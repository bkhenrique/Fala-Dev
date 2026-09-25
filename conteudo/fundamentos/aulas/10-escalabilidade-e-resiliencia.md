# Aula 10 — Escalabilidade e Resiliência

> **Objetivo:** explicar escala vertical e horizontal, por que stateless importa, load balancers, autoscaling, disponibilidade (SLA/SLO), e os padrões de resiliência: timeout, retry, circuit breaker, bulkhead, rate limiting e degradação graciosa.

---

## 1. Escalabilidade

**Escalabilidade** = capacidade de atender **mais carga** (usuários, requisições, dados) adicionando recursos, mantendo o desempenho.

### Vertical (scale up)
Aumentar a **máquina**: mais CPU, RAM, disco.
- ✅ Simples, sem mudar a aplicação.
- ❌ Tem **teto físico**, fica **caro** rápido, geralmente exige **downtime** para trocar, e continua sendo um **ponto único de falha** (SPOF).

### Horizontal (scale out)
Adicionar **mais máquinas/instâncias** iguais, dividindo a carga.
- ✅ Escala quase sem teto, aumenta **disponibilidade** (uma cai, as outras seguem), pode ser automática.
- ❌ Exige que a aplicação seja **stateless**, precisa de load balancer, e desloca o gargalo (normalmente para o banco).

> Analogia: vertical é trocar o carro por um caminhão; horizontal é ter uma frota de carros.

---

## 2. Stateless: o pré-requisito da escala horizontal

Uma aplicação é **stateless** quando **nenhuma instância guarda estado** que outra precise: qualquer instância atende qualquer requisição.

O que **não pode** ficar na memória/disco local da instância:
- **Sessão do usuário** → JWT, ou sessão no **Redis**.
- **Arquivos enviados** → storage de objetos (**S3**, GCS).
- **Cache que precisa ser consistente** → Redis.
- **Jobs em andamento** → fila (BullMQ, SQS).
- **Locks e contadores** → Redis/banco.

**Como várias instâncias compartilham estado?** Movendo o estado para **serviços externos compartilhados** (banco, Redis, S3, fila). As instâncias viram "gado, não animais de estimação" (*cattle, not pets*): descartáveis e intercambiáveis.

**Sticky sessions** (o load balancer manda o mesmo usuário sempre para a mesma instância) são um "remendo" para apps stateful: atrapalham o balanceamento e, se a instância cair, o estado se perde.

---

## 3. Load Balancer

Distribui as requisições entre as instâncias.

**Algoritmos**:
- **Round robin**: uma para cada, em rodízio.
- **Least connections**: para quem tem menos conexões ativas (bom com requisições de duração variada).
- **Weighted**: por peso (máquinas mais fortes recebem mais).
- **IP hash / consistent hashing**: o mesmo cliente vai para a mesma instância.

**L4 vs L7**:
- **L4** (transporte): olha IP/porta, repassa conexões TCP. Rápido, não entende HTTP.
- **L7** (aplicação): entende HTTP, pode rotear por **caminho/host/header**, terminar TLS, fazer cache.

**Health checks**: o LB testa periodicamente cada instância (ex: `GET /health`) e **tira da rotação** quem falha. Em Kubernetes: **liveness** (está vivo? senão reinicia) e **readiness** (está pronto para receber tráfego?).

**Onde entra o load balancer?** Na frente das réplicas da aplicação (e, internamente, entre serviços). "Por que não colocar um LB desde o início?" É uma pergunta de trade-off: com uma instância só, ele adiciona custo e uma peça a mais sem benefício; faz sentido quando você precisa de **mais de uma instância** (por carga ou por disponibilidade). Muitas plataformas gerenciadas já incluem um.

---

## 4. Autoscaling e como saber que precisa escalar

**Autoscaling**: subir/descer instâncias automaticamente conforme uma métrica:
- CPU/memória (simples, mas nem sempre reflete a carga real de apps I/O-bound).
- **Latência** (p95/p99) ou **requisições por segundo**.
- **Tamanho da fila** (para workers: fila crescendo = mais workers).

**Como saber que precisa escalar?** Pelos sinais, **antes** do usuário sentir:
- Latência p95/p99 subindo com o aumento de tráfego.
- Saturação: CPU alta sustentada, pool de conexões esgotado, event loop lag, fila crescendo mais rápido do que é consumida.
- Taxa de erros (timeouts, 503) subindo em picos.
- **Testes de carga** (k6, JMeter, Gatling) para descobrir o limite **antes** de chegar nele (*capacity planning*).

E lembre: escalar a aplicação **empurra o gargalo** para o banco. Escalar sem olhar o banco pode piorar (mais instâncias = mais conexões).

---

## 5. Disponibilidade, SLA, SLO, SLI

**Disponibilidade** = % do tempo em que o sistema funciona.

| Disponibilidade | Indisponível por ano |
|---|---|
| 99% ("dois noves") | ~3,65 dias |
| 99,9% ("três noves") | ~8,8 horas |
| 99,99% ("quatro noves") | ~53 minutos |
| 99,999% ("cinco noves") | ~5 minutos |

- **SLI** (*indicator*): a métrica medida (ex: % de requisições com sucesso em < 300 ms).
- **SLO** (*objective*): a meta interna (ex: 99,9% no mês).
- **SLA** (*agreement*): o **contrato** com o cliente, com penalidade se descumprir (geralmente mais folgado que o SLO).
- **Error budget**: quanto de falha o SLO permite (0,1%). Se sobrar orçamento, dá para arriscar mais em deploys; se acabou, foco em estabilidade.

**SPOF** (*Single Point of Failure*): componente cuja falha derruba tudo. Combate-se com **redundância** (várias instâncias, várias zonas de disponibilidade, réplicas de banco com failover).

---

## 6. Padrões de resiliência

Em sistemas distribuídos, **falhas são normais**. Resiliência é continuar funcionando (talvez de forma degradada) quando partes falham, e **não deixar uma falha se espalhar** (**falha em cascata**).

### Timeout
**Toda** chamada externa precisa de timeout. Sem ele, uma dependência lenta prende threads/conexões até esgotar os recursos, e o seu serviço cai junto.

### Retry com backoff exponencial + jitter
Tentar de novo só em falhas **transitórias** (timeout, 503, 429), só em operações **idempotentes** (ou com idempotency key), com intervalo crescente e aleatório, e com **limite**. Retry sem controle vira **retry storm** e derruba de vez o serviço que estava se recuperando.

### Circuit Breaker
Como o **disjuntor** de casa:
```
FECHADO (normal) ──muitas falhas──▶ ABERTO (falha rápido, nem chama)
     ▲                                   │ após um tempo
     └──── sucesso ◀── MEIO-ABERTO (deixa passar algumas de teste) ◀┘
                              └── falhou ──▶ ABERTO de novo
```
- Evita ficar chamando (e esperando) um serviço que está fora, e dá tempo para ele se recuperar.
- Combina com **fallback**: resposta alternativa (dado em cache, valor padrão, "tente mais tarde").
- Bibliotecas: Resilience4j (Java), opossum (Node).

### Bulkhead
Como os **compartimentos** de um navio: isolar recursos (pools de threads/conexões separados por dependência) para que um serviço lento não consuma **todos** os recursos e afete as outras funcionalidades.

### Rate limiting
Limitar quantas requisições um cliente pode fazer num período (resposta **429** + `Retry-After`). Protege contra abuso, picos e garante uso justo. Algoritmos: **token bucket** (permite rajadas até o tamanho do balde), **sliding window**, fixed window. Também do lado do **cliente**: respeitar o limite de um provedor externo (a fila com limiter da aula de BullMQ).

### Load shedding e degradação graciosa
Sob sobrecarga, **recusar parte** das requisições (as menos importantes) para manter as essenciais funcionando. **Degradação graciosa**: se o serviço de recomendações cai, a página de produto continua funcionando sem a seção de recomendações.

### Backpressure
Sinalizar para quem produz que o consumidor está sobrecarregado (a fila crescendo, streams). A fila é um amortecedor, mas não infinito.

---

## 7. Como falar na entrevista

**"Como você escalaria horizontalmente essa API?"**
> "Primeiro garanto que ela é stateless: sessão em JWT ou Redis, arquivos no S3, cache e locks no Redis, trabalho pesado em fila. Aí rodo várias réplicas atrás de um load balancer com health check e readiness, e configuro autoscaling por latência ou CPU, e os workers pelo tamanho da fila. Em seguida olho o próximo gargalo, que normalmente é o banco: pool de conexões, PgBouncer, réplicas de leitura e cache. E valido com teste de carga antes."

**"O que é um circuit breaker?"**
> "É um padrão de resiliência que funciona como disjuntor: depois de um número de falhas numa dependência, ele abre e passa a falhar rápido, sem chamar, geralmente com um fallback. Depois de um tempo entra em meio-aberto e deixa algumas chamadas passarem pra testar; se der certo, fecha. Isso evita falha em cascata e dá tempo do serviço se recuperar. Uso junto com timeout, retry com backoff e jitter e bulkhead."

---

## 8. Resumo

- **Vertical** (teto, caro, SPOF) × **horizontal** (quase sem teto, disponibilidade, exige stateless).
- **Stateless**: estado em banco/Redis/S3/fila; sticky session é remendo.
- **Load balancer**: round robin, least connections; **L4 × L7**; **health checks** (liveness/readiness).
- **Autoscaling** por CPU, latência, fila; sinais de escala; **teste de carga**; gargalo vai pro banco.
- Disponibilidade em "noves"; **SLI, SLO, SLA**, error budget; **SPOF** e redundância.
- Resiliência: **timeout**, **retry + backoff + jitter**, **circuit breaker** (fechado/aberto/meio-aberto) + **fallback**, **bulkhead**, **rate limiting** (token bucket, 429), load shedding, **degradação graciosa**, backpressure.

## Termos desta aula
escalabilidade · escala vertical · scale up · escala horizontal · scale out · stateless · stateful · sticky session · cattle not pets · object storage · load balancer · round robin · least connections · consistent hashing · L4 · L7 · health check · liveness · readiness · autoscaling · teste de carga · capacity planning · disponibilidade · noves · SLI · SLO · SLA · error budget · SPOF · redundância · zona de disponibilidade · resiliência · falha em cascata · timeout · retry storm · circuit breaker · half-open · fallback · bulkhead · rate limiting · token bucket · 429 · load shedding · degradação graciosa · backpressure

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 10** e separadas por nível.
