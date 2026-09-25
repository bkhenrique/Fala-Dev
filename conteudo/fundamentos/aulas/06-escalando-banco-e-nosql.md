# Aula 06 — Escalando o banco e NoSQL: pool, réplicas, sharding, CAP e tipos de banco

> **Objetivo:** saber como bancos escalam (pool de conexões, réplicas de leitura, particionamento, sharding), entender o teorema CAP e consistência eventual, e quando usar cada tipo de banco NoSQL.

---

## 1. O banco costuma ser o gargalo

Escalar a aplicação é fácil: ela é stateless, basta subir mais réplicas (aula 10). O **banco** guarda estado, então é bem mais difícil de escalar. Por isso, quase toda conversa de escala termina nele.

Ordem natural de otimização (do mais barato ao mais caro):
1. **Queries e índices** certos (aula 05).
2. **Cache** (aula 07).
3. **Pool de conexões** bem dimensionado.
4. **Escala vertical** (máquina maior).
5. **Réplicas de leitura**.
6. **Particionamento** de tabelas.
7. **Sharding** (último recurso, muito complexo).

---

## 2. Pool de conexões

Abrir uma conexão com o banco é **caro** (TCP, TLS, autenticação, processo no servidor; no Postgres, cada conexão é um **processo**, com memória própria).

**Pool de conexões**: um conjunto de conexões **abertas e reaproveitadas** pela aplicação (HikariCP no Java, o pool do `pg`/Prisma no Node).

Dimensionamento:
- **Pequeno demais**: requisições esperam na fila por uma conexão livre (latência sobe, timeouts).
- **Grande demais**: o banco fica sobrecarregado. E atenção à multiplicação: **20 conexões × 30 réplicas da API = 600 conexões** no banco.
- Solução para muitas instâncias/serverless: um **pooler externo** na frente do banco (**PgBouncer**, RDS Proxy).

Regra: **nunca segure conexão enquanto espera algo externo** (chamada HTTP dentro de transação).

---

## 3. Réplicas de leitura

```
            escritas                 replicação
App ──────────────────▶ PRIMÁRIO ───────────────▶ RÉPLICA 1
 └──── leituras ─────────────────────────────────▶ RÉPLICA 2
```
- Um **primário** recebe as **escritas**; as **réplicas** recebem cópias e atendem **leituras**.
- Ótimo porque a maioria dos sistemas **lê muito mais do que escreve**.
- Também dá **alta disponibilidade**: se o primário cair, uma réplica é promovida (**failover**).

O porém: **replication lag** (atraso de replicação). A replicação costuma ser **assíncrona**, então a réplica pode estar alguns milissegundos (ou segundos) atrás. Cenário clássico: o usuário edita o perfil (vai pro primário), a tela recarrega lendo da réplica, e ele vê o **dado antigo**. Solução: **read-your-writes**, ler do primário logo após escrever (ou por um tempo) para aquele usuário.

---

## 4. Particionamento e Sharding

### Particionamento (numa mesma instância)
Dividir uma tabela gigante em **partes menores** dentro do mesmo banco, por exemplo por data (`pedidos_2025`, `pedidos_2026`). Consultas por período leem só a partição certa, e apagar dados antigos vira "dropar a partição". O Postgres suporta nativamente.

### Sharding (entre várias instâncias)
Dividir os dados entre **vários servidores de banco**, cada um com um pedaço (**shard**), usando uma **chave de shard** (ex: `cliente_id`).
- ✅ Escala **escrita** e armazenamento praticamente sem limite.
- ❌ **Muito complexo**: queries que cruzam shards, joins entre shards, transações distribuídas, rebalancear quando um shard cresce demais, escolher a chave errada cria **hot shards**.

Frase madura: "Sharding é o último recurso; antes vêm índices, cache, réplicas e particionamento."

---

## 5. Teorema CAP

Em um **sistema distribuído**, quando ocorre uma **partição de rede** (P, nós não conseguem se comunicar), você precisa escolher entre:
- **C (Consistência)**: todos os nós veem **o mesmo dado** ao mesmo tempo (toda leitura retorna a escrita mais recente, ou erro).
- **A (Disponibilidade)**: todo pedido recebe **uma resposta** (mesmo que não seja a mais recente).

Como partições de rede **acontecem** em sistemas distribuídos, na prática a escolha é **CP ou AP** durante a falha:
- **CP**: prefere recusar a responder a responder errado (ex: sistemas financeiros, bancos com consenso forte).
- **AP**: prefere responder, mesmo com dado possivelmente desatualizado, e acertar depois (ex: carrinho de compras, feed, contador de likes).

Complemento (**PACELC**): **mesmo sem partição**, existe o trade-off entre **latência** e **consistência**.

### Consistência forte vs eventual
- **Forte**: após a escrita, todas as leituras veem o novo valor.
- **Eventual**: se não houver novas escritas, **eventualmente** todos os nós convergem para o mesmo valor. Por um tempo, leituras podem ver o valor antigo.

**BASE** (*Basically Available, Soft state, Eventually consistent*) é o "oposto" filosófico do ACID, comum em NoSQL distribuído.

---

## 6. Tipos de banco NoSQL

**NoSQL** ("not only SQL") é um guarda-chuva para bancos **não relacionais**, geralmente feitos para escalar horizontalmente e para modelos de dados específicos.

| Tipo | Exemplos | Modelo | Bom para |
|---|---|---|---|
| **Documento** | MongoDB, Firestore | Documentos JSON flexíveis | Dados com estrutura variável, agregados lidos juntos (produto com atributos variados) |
| **Chave-valor** | **Redis**, DynamoDB | Chave → valor | Cache, sessão, contadores, alta velocidade |
| **Colunar (wide-column)** | Cassandra, ScyllaDB | Linhas com colunas dinâmicas, particionadas | **Escrita massiva**, séries temporais, alta disponibilidade (AP) |
| **Grafo** | Neo4j | Nós e arestas | Relacionamentos complexos: redes sociais, recomendação, fraude |
| **Busca** | Elasticsearch, OpenSearch | Índice invertido | **Busca textual**, filtros, logs |
| **Séries temporais** | TimescaleDB, InfluxDB | Pontos no tempo | Métricas, IoT |
| **Vetorial** | pgvector, Pinecone, Qdrant | **Vetores/embeddings** | Busca por **similaridade semântica**, RAG |

### SQL ou NoSQL?
Use **relacional** por padrão quando: dados estruturados com relacionamentos, precisa de transações/ACID e consultas flexíveis (a maioria dos sistemas de negócio). O Postgres, inclusive, cobre muita coisa "NoSQL" (JSONB, busca textual, pgvector).

Considere **NoSQL** quando: um padrão de acesso **específico** (chave-valor, busca, grafo), volume/escala de escrita que um relacional não aguenta, esquema muito variável.

**Persistência poliglota**: usar bancos diferentes para necessidades diferentes no mesmo sistema (Postgres + Redis + Elasticsearch). Trade-off: mais coisa para operar e manter sincronizada.

### Embeddings e busca vetorial (bônus, cai em vaga com IA)
Um **embedding** é um vetor de números que representa o **significado** de um texto. Textos parecidos têm vetores próximos. **pgvector** adiciona ao Postgres um tipo vetor e índices para buscar "os mais parecidos" (similaridade de cosseno). É a base do **RAG** (*Retrieval-Augmented Generation*): buscar os trechos relevantes e mandá-los junto na pergunta ao LLM.

---

## 7. Como falar na entrevista

**"Como você escalaria um banco que está no limite?"**
> "Primeiro garanto o básico: queries e índices certos, olhando EXPLAIN e pg_stat_statements, e pool de conexões bem dimensionado, com um PgBouncer se tiver muitas instâncias. Depois cache pro que é muito lido. Se o gargalo for leitura, réplicas de leitura, cuidando do replication lag com read-your-writes. Pra tabelas enormes, particionamento. Sharding só como último recurso, porque traz queries entre shards, transações distribuídas e rebalanceamento."

**"Explique o teorema CAP."**
> "Num sistema distribuído, durante uma partição de rede, você escolhe entre consistência, ou seja, todos veem o dado mais recente ou recebem erro, e disponibilidade, ou seja, sempre responder mesmo com dado possivelmente desatualizado. Como partição acontece, na prática é CP ou AP. Pagamento eu quero CP; um feed ou contador de curtidas pode ser AP, com consistência eventual."

---

## 8. Resumo

- Banco é o gargalo típico; otimizar do barato ao caro.
- **Pool de conexões** (conexão é cara; cuidado com réplicas × pool; **PgBouncer**).
- **Réplicas de leitura**: escalam leitura e dão failover; **replication lag** → read-your-writes.
- **Particionamento** (mesma instância) × **sharding** (várias; último recurso; hot shard).
- **CAP**: na partição, **CP ou AP**; PACELC; consistência **forte × eventual**; BASE.
- NoSQL: **documento, chave-valor, colunar, grafo, busca, séries temporais, vetorial**.
- Relacional por padrão; **persistência poliglota** com cuidado.
- **Embeddings + pgvector** → busca semântica, RAG.

## Termos desta aula
gargalo · pool de conexões · HikariCP · PgBouncer · réplica de leitura · primário · replicação assíncrona · replication lag · read-your-writes · failover · alta disponibilidade · particionamento · sharding · chave de shard · hot shard · transação distribuída · sistema distribuído · teorema CAP · partição de rede · consistência · disponibilidade · CP · AP · PACELC · consistência forte · consistência eventual · BASE · NoSQL · documento · chave-valor · wide-column · grafo · Elasticsearch · índice invertido · série temporal · banco vetorial · embedding · similaridade de cosseno · RAG · persistência poliglota

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 06** e separadas por nível.
