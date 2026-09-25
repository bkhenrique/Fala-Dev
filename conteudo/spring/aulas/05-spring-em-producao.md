# Aula 05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance

> **Objetivo:** saber o que muda quando a aplicação Spring vai pra produção: health checks, métricas e tracing, configuração, cache, chamadas externas resilientes, graceful shutdown e as opções de performance (virtual threads, native image).

Os conceitos gerais (logs, métricas e traces, circuit breaker, retry, cache-aside, liveness × readiness) estão em Fundamentos: [cache](../../fundamentos/aulas/07-cache-e-redis.md), [resiliência](../../fundamentos/aulas/10-escalabilidade-e-resiliencia.md) e [observabilidade](../../fundamentos/aulas/12-observabilidade-e-devops.md).

---

## 1. O problema

Funcionar na sua máquina é metade do trabalho. Em produção, a aplicação precisa:
- dizer ao orquestrador se está **viva** e **pronta**;
- mostrar **o que está acontecendo** (métricas, logs, traces);
- sobreviver a dependências **lentas ou fora do ar**;
- **desligar sem derrubar** requisições;
- usar bem **memória e CPU** do container.

O Spring Boot tem peças prontas pra tudo isso. Saber quais são e por que existem é o que diferencia quem "fez um CRUD em Spring" de quem já operou uma aplicação.

---

## 2. Actuator: os endpoints de operação

Com `spring-boot-starter-actuator`, a aplicação ganha endpoints em `/actuator`:

| Endpoint | Pra quê |
|---|---|
| `/actuator/health` | Saúde da aplicação e das dependências (banco, Redis, disco, broker) |
| `/actuator/health/liveness` e `/readiness` | Probes do Kubernetes |
| `/actuator/metrics` | Métricas (JVM, HTTP, pool de conexões…) |
| `/actuator/prometheus` | Métricas no formato do Prometheus |
| `/actuator/info` | Versão, commit, build |
| `/actuator/loggers` | Ver e **mudar o nível de log em tempo real** |

Cuidado de segurança: **exponha só o necessário** (`management.endpoints.web.exposure.include=health,info,prometheus`). Endpoints como `env`, `heapdump` e `loggers` vazam informação sensível ou permitem mexer na aplicação. Proteja-os, ou sirva o actuator numa **porta separada** (`management.server.port`) que não é exposta publicamente.

### Liveness × Readiness
- **Liveness**: "o processo está saudável?" Se falhar, o Kubernetes **reinicia** o container. Deve checar só a própria aplicação.
- **Readiness**: "posso receber tráfego agora?" Se falhar, o pod **sai do load balancer**, mas não é reiniciado. Aqui entram dependências essenciais.

Erro clássico: colocar o **banco** no liveness. O banco oscila, todas as réplicas falham o liveness ao mesmo tempo e o Kubernetes **reinicia tudo**, o que piora o incidente.

---

## 3. Observabilidade: Micrometer e tracing

- **Micrometer** é a "fachada" de métricas do Spring (como o SLF4J é pra logs): você instrumenta uma vez e exporta pra Prometheus, Datadog, CloudWatch etc. O Boot já mede requisições HTTP (`http.server.requests`, com latência por rota e status), JVM (heap, GC, threads), pool **HikariCP** e mais.
- Métrica de negócio própria:
```java
meterRegistry.counter("pedidos.confirmados", "canal", canal).increment();
```
- **Tracing distribuído**: com **Micrometer Tracing** + **OpenTelemetry**, cada requisição ganha um **trace id** propagado nos headers pra outros serviços (e pra Kafka), e os logs incluem esse id. Assim dá pra seguir uma requisição de ponta a ponta.
- **Logs estruturados** (JSON) com o trace id: versões recentes do Boot têm suporte nativo (`logging.structured.format.console=ecs`, por exemplo).

---

## 4. Configuração em produção

- **`@ConfigurationProperties`** + **`@Validated`**: configuração tipada e **validada no boot**. Se faltar a URL do gateway de pagamento, a aplicação **não sobe** (*fail fast*), em vez de quebrar na primeira compra.
```java
@Validated
@ConfigurationProperties(prefix = "pagamentos")
public record PagamentosProps(@NotBlank String url, @NotNull Duration timeout) {}
```
- **Profiles** pra diferenças entre ambientes; **variáveis de ambiente** sobrescrevem o `application.yml` (`PAGAMENTOS_URL`).
- **Segredos** vêm do ambiente ou de um *secret manager* (Vault, AWS Secrets Manager), nunca do repositório.

---

## 5. Cache com @Cacheable

```java
@EnableCaching
@Configuration class CacheConfig {}

@Cacheable(cacheNames = "produtos", key = "#id")
public ProdutoResponse buscar(Long id) { ... }            // 2ª chamada com o mesmo id não executa o método

@CacheEvict(cacheNames = "produtos", key = "#id")
public void atualizar(Long id, AtualizarProduto cmd) { ... }
```

- É **cache-aside** declarativo, via **proxy** (de novo: chamada interna não usa o cache).
- O provedor é plugável: **Caffeine** (em memória, rápido, **por instância**) ou **Redis** (compartilhado entre réplicas).
- Defina **TTL** e tamanho máximo. Cache sem limite é vazamento de memória.
- Não cacheie entidades JPA gerenciadas (problemas de lazy loading e de estado); cacheie **DTOs**.

---

## 6. Chamadas externas resilientes

### Cliente HTTP com timeout
- **`RestClient`**: cliente síncrono moderno (substituto do `RestTemplate` em código novo).
- **`WebClient`**: reativo.
- **HTTP Interfaces** (`@HttpExchange`): você declara uma interface e o Spring gera o cliente (ideia parecida com o OpenFeign).

**Sempre configure timeout** de conexão e de leitura. Sem timeout, um provedor lento prende threads até a aplicação inteira travar.

### Resilience4j
A biblioteca padrão de resiliência no ecossistema Spring (via Spring Cloud Circuit Breaker ou direto):
```java
@CircuitBreaker(name = "pagamentos", fallbackMethod = "pagamentoIndisponivel")
@Retry(name = "pagamentos")
public Autorizacao autorizar(Pagamento p) { return clientePagamentos.autorizar(p); }
```
- **CircuitBreaker** (falha rápido quando o serviço está fora), **Retry** (com backoff), **RateLimiter**, **Bulkhead** (limita concorrência) e **TimeLimiter**.
- Configurados por nome no `application.yml` e com métricas no Actuator.
- Retry **só** em operação idempotente (ou com idempotency key).

> Nas versões mais novas do ecossistema (Spring Framework 7 / Boot 4), anotações simples de resiliência como `@Retryable` e `@ConcurrencyLimit` passaram a existir no próprio core. Confira a versão do projeto antes de escolher.

---

## 7. Graceful shutdown

Quando o Kubernetes manda `SIGTERM` (deploy, scale down), o ideal é:
1. Readiness passa a responder "não pronto" → sai do load balancer.
2. Parar de aceitar novas requisições e **terminar as que estão em andamento**.
3. Fechar pool de conexões, consumidores de fila etc.

No Boot: `server.shutdown=graceful` (habilitado por padrão nas versões recentes) + `spring.lifecycle.timeout-per-shutdown-phase=30s`. O `terminationGracePeriodSeconds` do Kubernetes precisa ser **maior** que esse timeout.

---

## 8. Performance e recursos

### Virtual threads (Java 21+, Boot 3.2+)
`spring.threads.virtual.enabled=true` faz o Tomcat, o `@Async` e outros executores usarem virtual threads. Ganho grande em aplicações **I/O-bound** (muita espera por banco e APIs), mantendo o código **imperativo e simples**.

**Virtual threads ou WebFlux?** WebFlux (reativo) também escala bem em I/O, mas exige programar com `Mono`/`Flux` do começo ao fim e é mais difícil de depurar. Pra maioria das APIs, virtual threads entregam escalabilidade parecida com código comum. WebFlux ainda faz sentido pra streaming e *backpressure* de ponta a ponta.

Atenção: com milhares de threads virtuais, o gargalo vira o **pool de conexões do banco**. Não adianta ter 10.000 requisições concorrentes com 20 conexões.

### Memória em container
A JVM precisa saber o limite do container: use `-XX:MaxRAMPercentage=75` em vez de um `-Xmx` fixo. Heap no limite do container = o processo é morto pelo **OOM killer** sem nenhum log útil.

### Startup: GraalVM Native Image
O Boot suporta compilar pra **executável nativo** (AOT): sobe em **milissegundos** e usa bem menos memória. Ótimo pra serverless e escala rápida.
Trade-offs: build **lento**, sem as otimizações dinâmicas do JIT (throughput de pico pode ser menor), e cuidado com **reflection**, proxies dinâmicos e bibliotecas que não suportam AOT.

### Imagem Docker
`./mvnw spring-boot:build-image` gera uma imagem otimizada com **Buildpacks**, com o jar em **camadas** (dependências separadas do código, então o rebuild é rápido).

---

## 9. Como falar na entrevista

**"O que você configura antes de colocar uma aplicação Spring em produção?"**
> "Actuator com health, info e prometheus expostos e o resto fechado, liveness e readiness separados, sem colocar o banco no liveness. Métricas com Micrometer, tracing com OpenTelemetry e logs estruturados com o trace id. Configuração com @ConfigurationProperties validada no boot e segredos fora do repositório. Toda chamada externa com timeout, e Resilience4j com circuit breaker e retry onde faz sentido. Graceful shutdown alinhado com o grace period do Kubernetes, e MaxRAMPercentage pra JVM respeitar o container."

**"Virtual threads ou WebFlux?"**
> "Pra uma API comum, I/O-bound, eu iria de virtual threads: escala parecido com o reativo e mantém código imperativo, mais fácil de ler e depurar. WebFlux faz sentido quando preciso de streaming ou backpressure de ponta a ponta. Em qualquer caso, o gargalo passa a ser o pool de conexões, então limito a concorrência nas dependências."

---

## 10. Resumo

- **Actuator**: health, liveness/readiness, metrics, prometheus, info. **Exponha só o necessário**.
- **Liveness** reinicia, **readiness** tira do tráfego. Banco **não** vai no liveness.
- **Micrometer** (métricas), **Micrometer Tracing + OpenTelemetry** (traces), logs estruturados com trace id.
- **`@ConfigurationProperties` + `@Validated`** = fail fast; segredos fora do repo.
- **`@Cacheable`/`@CacheEvict`**: proxy, TTL, Caffeine (local) × Redis (compartilhado), cachear DTO.
- **`RestClient`/`WebClient`/`@HttpExchange` com timeout**; **Resilience4j** (circuit breaker, retry, bulkhead, rate limiter).
- **Graceful shutdown** + grace period do Kubernetes.
- **Virtual threads** pra I/O; WebFlux pra streaming/backpressure; cuidado com o pool do banco.
- **`MaxRAMPercentage`** em container; **Native Image** pra startup rápido, com trade-offs.

## Termos desta aula
produção · Actuator · health check · liveness · readiness · probe · Prometheus · Micrometer · métrica de negócio · Micrometer Tracing · OpenTelemetry · trace id · log estruturado · @ConfigurationProperties · @Validated · fail fast · secret manager · @Cacheable · @CacheEvict · Caffeine · Redis · RestClient · WebClient · @HttpExchange · timeout · Resilience4j · circuit breaker · retry · bulkhead · rate limiter · graceful shutdown · SIGTERM · virtual threads · WebFlux · MaxRAMPercentage · OOM killer · GraalVM · Native Image · AOT · Buildpacks

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 05** e separadas por nível.
