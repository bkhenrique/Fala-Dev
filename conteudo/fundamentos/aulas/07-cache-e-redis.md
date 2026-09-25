# Aula 07 — Cache e Redis

> **Objetivo:** entender onde existe cache num sistema, as estratégias de cache (cache-aside, write-through…), TTL e invalidação, os problemas clássicos (stampede, dado velho) e o que o Redis faz além de cache.

---

## 1. O que é cache e por que usar

**Cache** = guardar o resultado de uma operação **cara** (consulta pesada, chamada externa, cálculo) num lugar **mais rápido**, para não refazer toda vez.

Ganhos: **menos latência**, **menos carga** no banco/serviço, **menos custo** (inclusive de APIs pagas, como provider de IA).

O preço: o dado do cache pode ficar **desatualizado** (*stale*). Todo cache é um **trade-off entre frescor e desempenho**.

Métricas: **hit rate** (quantas leituras acharam no cache) e **miss** (não achou, foi na fonte).

---

## 2. Camadas de cache

```
Navegador  →  CDN  →  Load balancer/Proxy  →  Aplicação  →  Cache distribuído  →  Banco
(HTTP cache)  (edge)   (Nginx cache)         (memória local)   (Redis)            (buffer do próprio banco)
```

| Camada | Exemplo | Observação |
|---|---|---|
| **Navegador** | `Cache-Control`, ETag (aula 02) | Grátis, por usuário |
| **CDN** | Cloudflare, CloudFront | Estáticos e páginas públicas, perto do usuário |
| **Em memória na aplicação** | Um `Map`/LRU no processo | Rapidíssimo, mas **cada instância tem o seu** (inconsistência entre réplicas) e some no restart |
| **Distribuído** | **Redis**, Memcached | **Compartilhado** entre instâncias; uma ida à rede (~1 ms) |
| **Banco** | Buffer pool, cache de planos | Automático |

---

## 3. Estratégias de cache

### Cache-aside (lazy loading), a mais comum
A **aplicação** controla:
```
ler(chave):
  valor = cache.get(chave)
  se existe → retorna (HIT)
  senão     → valor = banco.buscar(); cache.set(chave, valor, TTL); retorna (MISS)
```
- ✅ Só cacheia o que é usado; se o cache cair, o sistema continua (mais lento).
- ❌ Primeira leitura sempre lenta; pode servir dado velho até o TTL ou uma invalidação.

### Read-through
Parecido, mas é o **próprio cache** (ou uma biblioteca) que busca na fonte quando não tem.

### Write-through
Toda escrita vai **no cache e no banco** ao mesmo tempo.
- ✅ Cache sempre atualizado. ❌ Escrita mais lenta; cacheia coisa que talvez ninguém leia.

### Write-behind (write-back)
Escreve **no cache** e grava no banco **depois**, em lote.
- ✅ Escrita rapidíssima. ❌ Risco de **perder dados** se o cache cair antes de gravar.

---

## 4. Expiração e remoção

- **TTL** (*Time To Live*): quanto tempo o item vale. Define o **máximo de "idade"** do dado.
- **Eviction** (remoção quando a memória enche): **LRU** (remove o menos usado recentemente), **LFU** (menos usado no total), aleatório. No Redis: `maxmemory-policy`.

Escolher o TTL é decidir **quanto tempo de dado velho o negócio tolera**: catálogo aguenta minutos; saldo bancário, zero (não se cacheia assim).

---

## 5. Invalidação: a parte difícil

> "Só existem duas coisas difíceis em Ciência da Computação: invalidação de cache e dar nome às coisas." — Phil Karlton

Estratégias:
- **Só TTL**: simples; aceita dado velho até expirar.
- **Invalidação explícita na escrita**: ao atualizar o produto, **apagar** a chave (`DEL produto:42`). Apagar costuma ser mais seguro que atualizar (evita condições de corrida entre escritas).
- **Invalidação por evento**: o serviço que muda o dado publica um evento; quem tem cache escuta e invalida.
- **Chave versionada**: `produto:42:v7`; mudar a versão "invalida" tudo que dependia da anterior.

Cuidado: com várias instâncias e **cache local em memória**, invalidar em uma não invalida nas outras. Por isso o cache **distribuído** é o padrão para dados que mudam.

---

## 6. Problemas clássicos

### Cache stampede (thundering herd)
Uma chave muito acessada **expira**, e **milhares** de requisições dão *miss* ao mesmo tempo e vão **todas** no banco, que cai.
Soluções:
- **Lock/single-flight**: só a primeira requisição recalcula; as outras esperam ou recebem o valor antigo.
- **Stale-while-revalidate**: servir o valor velho enquanto um processo atualiza.
- **Jitter no TTL**: TTLs levemente aleatórios para chaves não expirarem todas juntas.
- Pré-aquecer (*cache warming*) chaves importantes.

### Cache penetration
Consultas a chaves que **não existem** (ex: ids inválidos) sempre dão miss e vão ao banco. Solução: cachear também o "não existe" (com TTL curto) ou **Bloom filter**.

### Hot key
Uma única chave recebendo tráfego enorme (ex: produto em promoção) sobrecarrega um nó do Redis. Solução: cache local curto na frente, réplicas.

### Dados sensíveis e personalizados
Cuidado para não cachear resposta **de um usuário** e servir para **outro** (chave de cache sem o id do usuário, ou CDN cacheando página logada). Use `Cache-Control: private` e inclua o que diferencia na chave.

---

## 7. Redis além do cache

**Redis** é um banco **em memória**, chave-valor, com **estruturas de dados**: string, hash, list, set, sorted set, stream, bitmap, HyperLogLog, geo.

Características:
- **Muito rápido** (memória + execução de comandos numa thread principal, sem disputa de lock).
- Operações **atômicas** (`INCR`, `SETNX`, scripts Lua, `MULTI`).
- **Persistência** opcional: **RDB** (snapshots periódicos) e **AOF** (log de cada escrita). Mesmo assim, não é o lugar para dado que não pode se perder de jeito nenhum.
- **Replicação** e **Cluster** (sharding) para escalar.

Usos comuns:
| Uso | Como |
|---|---|
| **Cache** | `SET chave valor EX 60` |
| **Sessão** | Sessão compartilhada entre instâncias da API |
| **Rate limiting** | `INCR` + `EXPIRE` por IP/usuário por janela |
| **Lock distribuído** | `SET lock:x id NX PX 30000` (só uma instância executa algo) |
| **Filas** | BullMQ, Sidekiq usam Redis |
| **Pub/Sub** | Mensagens entre instâncias (ex: WebSocket em várias réplicas) |
| **Ranking** | Sorted sets (`ZADD`, `ZRANGE`) |
| **Contadores, dedup** | `INCR`, sets |

Trade-offs do Redis: memória é cara e limitada; é mais uma peça de infraestrutura para operar e monitorar; persistência não é seu ponto forte; se cair, o que depende dele (sessões, filas) é afetado.

---

## 8. Como falar na entrevista

**"Como você usaria cache nessa API?"**
> "Primeiro identifico o que é muito lido e pouco alterado, e quanto tempo de dado velho o negócio tolera. Uso cache-aside no Redis, que é compartilhado entre as réplicas, com TTL adequado e invalidação explícita quando o dado muda, apagando a chave. Pra chaves muito quentes, protejo contra cache stampede com lock ou stale-while-revalidate e coloco jitter no TTL. E tomo cuidado com dados por usuário, pra não servir a resposta de um pra outro."

**"Quais os trade-offs de usar Redis?"**
> "Ganho latência muito baixa e estruturas prontas pra cache, sessão, rate limit, lock e filas. O custo é memória, que é cara e limitada; persistência não é o forte dele; e é mais uma peça de infra pra operar, monitorar e manter disponível, com o risco de dado desatualizado quando usado como cache."

---

## 9. Resumo

- Cache: guardar resultado caro em lugar rápido; **frescor × desempenho**; hit rate.
- Camadas: **navegador, CDN, local, distribuído (Redis), banco**. Local = inconsistência entre réplicas.
- Estratégias: **cache-aside** (padrão), read-through, **write-through**, write-behind.
- **TTL** e eviction (**LRU**/LFU).
- **Invalidação**: TTL, apagar na escrita, eventos, chave versionada.
- Problemas: **stampede** (lock, stale-while-revalidate, jitter), penetration, hot key, cache de dado de outro usuário.
- **Redis**: em memória, estruturas, atômico, RDB/AOF; cache, sessão, **rate limit**, **lock distribuído**, filas, pub/sub, ranking.

## Termos desta aula
cache · hit · miss · hit rate · stale · CDN · cache local · cache distribuído · Redis · Memcached · cache-aside · lazy loading · read-through · write-through · write-behind · TTL · eviction · LRU · LFU · invalidação de cache · chave versionada · cache stampede · thundering herd · single-flight · stale-while-revalidate · jitter · cache warming · cache penetration · Bloom filter · hot key · Cache-Control private · sorted set · RDB · AOF · Redis Cluster · rate limiting · lock distribuído · pub/sub

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 07** e separadas por nível.
