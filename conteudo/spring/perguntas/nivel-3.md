# Spring — perguntas, nível 3: Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [índice](README.md)

---

**1. Como você trata erros numa API Spring?**
<sub>Aula [02 — Spring Web e Spring Data JPA](../aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Services lançam exceções de domínio unchecked; um @RestControllerAdvice com @ExceptionHandler traduz em respostas HTTP, com ProblemDetail (RFC 7807). Validação com @Valid e Bean Validation gera 400.

</details>

**2. O que é o N+1 e como resolver com JPA? E a LazyInitializationException?**
<sub>Aula [02 — Spring Web e Spring Data JPA](../aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

N+1: uma query pra lista e uma por item ao acessar relacionamento lazy. Resolver com JOIN FETCH, @EntityGraph, batch size ou projeção em DTO. LazyInitializationException: acessar lazy fora da transação; resolver buscando o necessário no service, não com EAGER nem open-in-view.

</details>

**3. Um @Transactional não faz rollback. O que investigar?**
<sub>Aula [02 — Spring Web e Spring Data JPA](../aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Self-invocation (sem proxy), método não público, exceção checked (rollback padrão só em unchecked; usar rollbackFor), exceção capturada e engolida, ou classe que não é bean do Spring.

</details>

**4. Quando você usaria a propagação `REQUIRES_NEW`?**
<sub>Aula [02 — Spring Web e Spring Data JPA](../aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Quando uma operação precisa ser gravada independente do resultado da transação principal, como um log de auditoria ou o registro de uma tentativa que falhou. Ela suspende a transação atual e abre uma nova. Cuidado: usa outra conexão do pool e, via proxy, precisa estar em outro bean.

</details>

**5. Como você protegeria uma API Spring com JWT emitido por um provedor como Keycloak ou Auth0?**
<sub>Aula [03 — Spring Security](../aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

Configuro a API como resource server com `issuer-uri`: o Spring descobre as chaves públicas (JWKS) e valida assinatura, expiração e emissor. Sessão stateless, CSRF desligado (token no header), claims convertidas em authorities com um `JwtAuthenticationConverter`, regras por URL com negar por padrão, `@PreAuthorize` pras regras finas, ownership na consulta, e 401/403 customizados em JSON. Testo o caminho negativo também.

</details>

**6. Como você trataria erros num consumidor `@KafkaListener`?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](../aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

Retry com backoff só pra falha transitória, via `DefaultErrorHandler`; erro de dado (mensagem inválida) marcado como não-retentável. Esgotadas as tentativas, `DeadLetterPublishingRecoverer` manda pro tópico DLT, com alerta e reprocessamento depois. Como a entrega é at-least-once, o consumidor é idempotente, por exemplo com tabela de mensagens processadas ou constraint única.

</details>

**7. Como garantir que um evento só seja publicado no broker se a transação do banco commitar?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](../aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

Salvar no banco e publicar no broker não é atômico (dual write). Uso o transactional outbox: na mesma transação gravo a entidade e o evento numa tabela outbox, e um processo separado (poller com lock ou CDC com Debezium) publica e marca como enviado. O Spring Modulith oferece algo parecido com o registro de publicação de eventos. Consumidores idempotentes, porque pode haver reenvio.

</details>

**8. Como você protegeria sua aplicação de um serviço externo lento ou fora do ar?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](../aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Timeout de conexão e leitura em todo cliente HTTP (RestClient/WebClient). Circuit breaker com Resilience4j pra falhar rápido quando o serviço está fora, com fallback. Retry com backoff só pra operação idempotente. Bulkhead pra limitar a concorrência e não consumir todas as threads, e métricas desses componentes no Actuator.

</details>

**9. Como fazer deploy de uma aplicação Spring sem derrubar requisições?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](../aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Graceful shutdown (`server.shutdown=graceful`) com `timeout-per-shutdown-phase`, readiness que passa a falhar no desligamento pra sair do load balancer, e `terminationGracePeriodSeconds` do Kubernetes maior que esse timeout. Rolling update com migrações de banco compatíveis com a versão anterior (expand and contract).

</details>

**10. Como testaria um endpoint Spring que salva no banco e envia uma mensagem Kafka?**
<sub>Aula [06 — Testes no Spring: unitários, slices e integração](../aulas/06-testes-no-spring.md)</sub>
<details><summary>Ver resposta</summary>

Faria testes unitários da regra, um teste MVC para contrato HTTP e uma integração com banco e Kafka compatíveis com produção, por exemplo em containers. Verificaria que o evento não é publicado quando a transação falha e que o consumidor tolera redelivery. Se houver outbox, testaria a gravação atômica e a publicação posterior.

</details>

**11. Como dividiria responsabilidades num sistema de pedidos com gateway, configuração e vários serviços?**
<sub>Aula [07 — Microsserviços com Spring Cloud](../aulas/07-microsservicos-com-spring-cloud.md)</sub>
<details><summary>Ver resposta</summary>

O gateway roteia e aplica políticas de borda; cada serviço mantém seu domínio e dados; configuração externa fornece valores por ambiente e gestão de segredos é separada. Descoberta e balanceamento vêm da plataforma ou de um registry, com timeouts, circuit breakers e tracing entre chamadas. Eu começaria com limites de domínio e só extraía serviço quando autonomia e escala justificassem o custo distribuído.

</details>
