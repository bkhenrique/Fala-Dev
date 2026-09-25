# Aula 15 — System design: como responder "desenhe um sistema"

> **Objetivo:** ter um roteiro pra responder perguntas de design de sistemas ("desenhe um encurtador de URL", "um feed", "um sistema de notificações"): levantar requisitos, estimar números, propor a arquitetura, aprofundar gargalos e defender trade-offs. É a aula que junta todas as anteriores.

---

## 1. O problema

Perguntas de system design são **abertas de propósito**: não existe uma resposta certa. O entrevistador quer ver **como você pensa**: se pergunta antes de sair desenhando, se enxerga gargalos, se conhece as ferramentas (cache, fila, réplica, sharding) e, principalmente, se **justifica escolhas com trade-offs**.

O erro mais comum é pular direto pro desenho ("coloco Kafka, Redis e Kubernetes") sem entender o problema. O segundo é ficar travado sem estrutura. Um **roteiro** resolve os dois.

---

## 2. O roteiro em 7 passos

### Passo 1: requisitos (5 min)
Pergunte antes de desenhar.
- **Funcionais**: o que o sistema **faz**? ("encurtar uma URL e redirecionar; o usuário escolhe o apelido? a URL expira? tem estatística de cliques?")
- **Não funcionais**: **como** ele deve se comportar? Escala, latência, disponibilidade, consistência, durabilidade. ("redirecionar em menos de 100 ms", "não pode perder um link criado", "disponibilidade alta é mais importante que consistência imediata").
- **Fora do escopo**: combine o que **não** vai fazer, pra caber no tempo.

### Passo 2: estimativas (back-of-the-envelope)
Números aproximados pra saber o **tamanho** do problema. Atalhos:
- 1 dia ≈ **86.400 s ≈ 10⁵ s**.
- 1 milhão de requisições por dia ≈ **12 por segundo** em média; o pico costuma ser 2 a 5× a média.
- Calcule: **QPS de leitura e de escrita**, **armazenamento** por ano, **banda**.

Latências que vale ter na cabeça (ordem de grandeza):
| Operação | Tempo |
|---|---|
| Ler da memória RAM | ~100 ns |
| Ler do SSD | ~0,1 ms |
| Ida e volta no mesmo datacenter | ~0,5 ms |
| Consulta simples ao Redis (pela rede) | ~1 ms |
| Consulta indexada no banco | 1 a 10 ms |
| Ida e volta entre continentes | ~150 ms |

### Passo 3: API
Defina os **contratos** principais: `POST /links { url } → { codigo }`, `GET /{codigo} → 302 Location`. Isso deixa claro o que o sistema expõe.

### Passo 4: modelo de dados
Quais entidades, quais campos, **como serão consultadas** (isso define chave e índice). Relacional ou chave-valor? (ver [aula 06](06-escalando-banco-e-nosql.md)).

### Passo 5: arquitetura de alto nível
O desenho simples que **funciona**: cliente → load balancer → serviço stateless → banco. Só depois se adiciona complexidade.

### Passo 6: aprofundar gargalos
Onde quebra com a escala estimada? Leitura pesada → **cache** e **réplicas**. Escrita pesada → **fila**, **particionamento**, **sharding**. Trabalho lento → **assíncrono**. Ponto único de falha → **redundância**. Cada adição **justificada por um número** do passo 2.

### Passo 7: trade-offs, falhas e evolução
O que acontece se o cache cair? Se uma região ficar fora? O que você **escolheu não fazer** e por quê? Como monitoraria (métricas, alertas)? Como evoluiria?

---

## 3. Exemplo completo: encurtador de URL

**Requisitos combinados:** criar link curto; redirecionar; links não expiram; contar cliques (pode ter atraso); leitura muito maior que escrita; redirecionamento rápido e altamente disponível.

**Estimativas:**
- 10 milhões de links novos por dia → ~**120 escritas/s** (pico ~500).
- Proporção de 100 leituras pra 1 escrita → 1 bilhão de redirecionamentos/dia → ~**12 mil leituras/s** (pico ~40 mil).
- ~500 bytes por link × 10 milhões/dia ≈ 5 GB/dia ≈ **~2 TB por ano**.

Conclusão dos números: é um sistema de **leitura intensa**, com escrita moderada e dados que cabem com folga em poucas máquinas por anos. O foco é **latência de leitura e disponibilidade**.

**Gerar o código curto:**
- Com **base62** (`a-z`, `A-Z`, `0-9`), 7 caracteres dão 62⁷ ≈ **3,5 trilhões** de combinações. Sobra.
- Opções:
  - **Contador + base62**: sem colisão e curto, mas o contador é um ponto central (dá pra resolver distribuindo **faixas** de IDs pra cada instância) e os códigos ficam previsíveis.
  - **Hash da URL** (truncado): mesma URL gera o mesmo código, mas exige **tratar colisão**.
  - **Aleatório + verificação**: simples, não previsível, com checagem de colisão via constraint única.

**Redirecionamento: 301 ou 302?**
- **301** (permanente): o navegador **guarda** o redirecionamento; menos carga, mas as próximas visitas **nem chegam** no servidor, e você perde a contagem de cliques.
- **302** (temporário): toda visita passa pelo servidor. Mais carga, mas permite **estatística** e mudar o destino.
- Como a contagem de cliques é requisito, **302**.

**Arquitetura:**
```
Cliente → CDN/LB → Serviço de redirecionamento (stateless, N réplicas)
                        │  1. procura no Redis (cache)  → hit: responde 302
                        │  2. miss: busca no banco, grava no cache
                        │  3. publica "clique" numa fila (assíncrono, não atrasa o redirect)
                        ▼
                  Banco (chave = código)          Fila → Worker → contadores de cliques
```
- **Cache** com os links mais acessados (poucos links concentram a maioria dos acessos).
- **Banco**: chave-valor ou relacional com o código como chave primária; réplicas de leitura se precisar.
- **Cliques** via **fila**: o redirecionamento não espera a gravação da estatística (consistência eventual aceitável, combinado nos requisitos).

**Trade-offs e falhas:**
- Cache fora → o banco aguenta por um tempo (dimensionado com réplicas), com latência maior.
- Códigos previsíveis (contador) permitem **enumerar** links; se links privados importarem, código aleatório.
- Abuso (spam, phishing) → rate limit por usuário/IP na criação e verificação de URLs maliciosas.

---

## 4. Blocos de construção (e quando usar)

| Precisa de… | Bloco | Aula |
|---|---|---|
| Distribuir tráfego, escalar a aplicação | Load balancer + serviço stateless + autoscaling | [10](10-escalabilidade-e-resiliencia.md) |
| Ler rápido dado muito acessado | Cache (Redis), CDN | [07](07-cache-e-redis.md) |
| Escalar leitura do banco | Réplicas de leitura | [06](06-escalando-banco-e-nosql.md) |
| Escalar escrita e volume | Particionamento, sharding | [06](06-escalando-banco-e-nosql.md) |
| Trabalho lento, picos, desacoplar | Fila, workers, eventos | [08](08-mensageria-e-eventos.md) |
| Arquivos grandes (imagem, vídeo) | Object storage (S3) + CDN | — |
| Busca textual | Elasticsearch/OpenSearch | [06](06-escalando-banco-e-nosql.md) |
| Tempo real pro cliente | WebSocket, SSE | [03](03-apis-rest-graphql-grpc-tempo-real.md) |
| Proteger de abuso e dependências | Rate limit, circuit breaker | [10](10-escalabilidade-e-resiliencia.md) |

---

## 5. Erros comuns

- **Desenhar antes de perguntar** os requisitos.
- **Overengineering**: microsserviços, Kafka e sharding pra um sistema com 50 requisições por segundo. Comece simples e escale **justificando com números**.
- **Ignorar o banco**: escalar a aplicação e esquecer que todas as réplicas batem no mesmo banco.
- **Não falar de falhas**: "e se esse componente cair?"
- **Monólogo**: é uma conversa. Confirme decisões com o entrevistador ("faz sentido priorizar disponibilidade aqui?").

---

## 6. Como falar na entrevista

**"Desenhe um sistema de notificações."** (como começar)
> "Antes de desenhar, queria entender o escopo: quais canais, e-mail, push, SMS? Precisa ser em tempo real ou alguns segundos de atraso tudo bem? Qual o volume esperado e o pico? O usuário pode configurar preferências? Pode duplicar uma notificação ou tem que ser no máximo uma vez? Com isso eu estimo o volume, defino a API e o modelo de dados, faço um desenho simples e depois aprofundo nos gargalos, que num sistema desses costumam ser os picos e os provedores externos lentos, o que já aponta pra fila, retry com backoff, DLQ e idempotência."

**"Por que você colocou um cache aí?"**
> "Pelos números: são 12 mil leituras por segundo e poucos links concentram a maior parte dos acessos. Com cache, a maioria das leituras sai da memória em cerca de um milissegundo e o banco fica com uma fração da carga. O custo é poder servir um dado desatualizado, o que aqui é aceitável porque o destino de um link quase nunca muda; e quando muda, invalido a chave."

---

## 7. Resumo

- System design avalia **raciocínio e trade-offs**, não uma resposta certa.
- Roteiro: **requisitos → estimativas → API → dados → alto nível → gargalos → trade-offs e falhas**.
- Estimativa: 1 dia ≈ 10⁵ s; calcule QPS de leitura/escrita e armazenamento; conheça as ordens de grandeza de latência.
- Comece **simples** e adicione cada peça **justificada por um número**.
- Encurtador: base62, geração de código (contador × hash × aleatório), **302** por causa das métricas, cache pra leitura, fila pros cliques.
- Evite: desenhar sem perguntar, overengineering, esquecer o banco, não falar de falhas, monólogo.

## Termos desta aula
system design · requisito funcional · requisito não funcional · escopo · back-of-the-envelope · QPS · pico · latência · API · modelo de dados · arquitetura de alto nível · gargalo · base62 · colisão · 301 · 302 · cache · réplica · sharding · fila · consistência eventual · object storage · CDN · rate limit · ponto único de falha · overengineering · trade-off

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 15** e separadas por nível.
