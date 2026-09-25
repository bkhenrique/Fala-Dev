# Spring — perguntas

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

As perguntas estão separadas por **nível**, e cada uma indica a aula de onde vem.

---

## Nível 1 — O que é?

_Definições. Tem que sair sem pensar._

**1. O que é IoC e um bean no Spring?**
<sub>Aula [01 — Spring Core e Spring Boot](aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

IoC: o container (ApplicationContext) cria, configura e conecta os objetos, em vez do código fazer `new`. Bean é um objeto gerenciado por esse container, declarado com estereótipos (@Service etc.) ou @Bean.

</details>

**2. Qual a diferença entre Spring e Spring Boot?**
<sub>Aula [01 — Spring Core e Spring Boot](aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

Spring é o framework (IoC, MVC, Data, Security). Boot adiciona auto-configuração baseada no classpath, starters, servidor embutido (jar executável), configuração externa com profiles e Actuator: convention over configuration.

</details>

**3. Quais são os escopos de bean no Spring e qual o cuidado com o padrão?**
<sub>Aula [01 — Spring Core e Spring Boot](aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

singleton (padrão, uma instância por container), prototype (nova a cada injeção), request e session. Como o singleton atende várias requisições em paralelo, o bean precisa ser stateless: nada de estado de requisição em atributo de `@Service`.

</details>

**4. Pra que servem profiles e `@ConfigurationProperties`?**
<sub>Aula [01 — Spring Core e Spring Boot](aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

Profiles separam configuração por ambiente (`application-dev.yml`, `application-prod.yml`, ativados por `spring.profiles.active`). `@ConfigurationProperties` mapeia um bloco de configuração para uma classe tipada e validável, melhor que vários `@Value` soltos.

</details>

**5. JPA, Hibernate e Spring Data: qual a diferença?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

JPA é a especificação de ORM do Java; Hibernate é a implementação mais usada; Spring Data JPA gera repositórios a partir de interfaces (JpaRepository, queries derivadas do nome, @Query).

</details>

**6. O que é dirty checking?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Entidades carregadas numa transação ficam gerenciadas no persistence context; no commit, o Hibernate compara com o estado original e gera os UPDATEs automaticamente, sem chamar save.

</details>

**7. O que é a `SecurityFilterChain` e como a requisição passa por ela?**
<sub>Aula [03 — Spring Security](aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

É a lista ordenada de filtros de segurança que roda antes do `DispatcherServlet`. O `DelegatingFilterProxy` (registrado no servidor) repassa pro `FilterChainProxy`, que escolhe a `SecurityFilterChain` pela URL. Nela passam CORS, CSRF, autenticação, tradução de exceções (401/403) e autorização. Hoje a configuração é um bean `SecurityFilterChain`, e não mais a antiga `WebSecurityConfigurerAdapter`.

</details>

**8. Qual o papel de `AuthenticationManager`, `UserDetailsService` e `PasswordEncoder`?**
<sub>Aula [03 — Spring Security](aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

O `AuthenticationManager` recebe o pedido de autenticação e delega aos `AuthenticationProvider`s. No login com usuário e senha, o provider usa o `UserDetailsService` pra buscar o usuário no banco e o `PasswordEncoder` (BCrypt) pra comparar a senha com o hash. Com sucesso, o `Authentication` vai pro `SecurityContextHolder`.

</details>

**9. O que é o `@TransactionalEventListener` e por que usar `AFTER_COMMIT`?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

É um listener de evento do Spring amarrado à transação de quem publicou. Com `AFTER_COMMIT` (o padrão), ele só executa se a transação commitou, evitando, por exemplo, mandar e-mail de um pedido que deu rollback. Se o evento for publicado fora de transação, por padrão o listener nem roda.

</details>

**10. O que é um consumer group no Kafka?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

É um conjunto de consumidores com o mesmo `groupId` que dividem as partições de um tópico entre si, escalando o processamento. Grupos diferentes recebem cada um sua cópia das mensagens, então estoque e analytics podem ler o mesmo tópico de forma independente.

</details>

**11. Pra que serve o Spring Boot Actuator e o que você expõe?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Endpoints de operação: health (com liveness e readiness), metrics, prometheus, info, loggers. Exponho só health, info e prometheus; endpoints como env, heapdump e loggers vazam dados ou permitem alterar a aplicação, então ficam fechados ou numa porta de gerenciamento separada.

</details>

**12. O que é o Micrometer?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

A fachada de métricas do Spring, como o SLF4J é pra logs: instrumenta uma vez e exporta pra Prometheus, Datadog, CloudWatch etc. O Boot já mede HTTP, JVM e pool de conexões, e você cria métricas de negócio com o `MeterRegistry`. Junto com Micrometer Tracing e OpenTelemetry, dá tracing distribuído.

</details>

---

## Nível 2 — Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**13. Por que preferir injeção por construtor?**
<sub>Aula [01 — Spring Core e Spring Boot](aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

Dependências explícitas e obrigatórias, campos final, testável sem Spring (new com mocks) e deixa evidente quando a classe tem dependências demais.

</details>

**14. Como o Spring Boot decide o que configurar sozinho?**
<sub>Aula [01 — Spring Core e Spring Boot](aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

Pela auto-configuration: olha o que está no classpath e aplica configurações condicionais (`@ConditionalOnClass`, `@ConditionalOnMissingBean`). Se você declara seu próprio bean, o do Boot sai de cena. É convention over configuration.

</details>

**15. Por que o `@Transactional` não funciona em chamada interna da mesma classe?**
<sub>Aula [01 — Spring Core e Spring Boot](aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

Porque o Spring aplica a transação via proxy em volta do bean. `this.metodo()` chama o objeto real direto, sem passar pelo proxy, então a anotação é ignorada. Vale pra @Cacheable e @Async também.

</details>

**16. LAZY ou EAGER nos relacionamentos JPA?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

LAZY por padrão em tudo, buscando explicitamente o que cada caso de uso precisa (join fetch, entity graph, DTO). EAGER carrega sempre, mesmo quando não precisa, e piora performance. Atenção: na JPA, `@ManyToOne` e `@OneToOne` já vêm EAGER por padrão.

</details>

**17. O que é o open-in-view e por que muitos times desligam?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Configuração ligada por padrão no Spring Boot que mantém a sessão do Hibernate aberta até o fim da requisição, evitando LazyInitializationException. É considerado anti-padrão porque esconde N+1 e segura a conexão do banco durante toda a requisição.

</details>

**18. `hasRole` ou `hasAuthority`?**
<sub>Aula [03 — Spring Security](aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

Authority é qualquer permissão (string). Role é uma authority com prefixo `ROLE_` por convenção. `hasRole("ADMIN")` procura `ROLE_ADMIN`; `hasAuthority("ADMIN")` procura `ADMIN` exatamente. Confundir os dois é causa clássica de 403 inesperado.

</details>

**19. Por que é comum desabilitar CSRF numa API com JWT, e quando isso seria um erro?**
<sub>Aula [03 — Spring Security](aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

CSRF explora o envio automático de cookies pelo navegador. Se o token vai no header `Authorization`, que o JavaScript precisa colocar de propósito, o ataque não funciona e desligar CSRF é seguro. Se a sessão ou o token estiver em cookie, desligar CSRF abre a vulnerabilidade.

</details>

**20. Autorização por URL ou por método com `@PreAuthorize`?**
<sub>Aula [03 — Spring Security](aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

Por URL para regras amplas (área admin, rotas públicas), com `anyRequest().authenticated()` no fim pra negar por padrão. Por método para regras finas, podendo usar os parâmetros (ex.: dono do recurso). `@PreAuthorize` funciona via proxy, então chamada interna na mesma classe não é checada; e ownership fica mais robusto na própria consulta, evitando IDOR.

</details>

**21. Onde fica o usuário autenticado durante a requisição e qual o cuidado com `@Async`?**
<sub>Aula [03 — Spring Security](aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

No `SecurityContextHolder`, que por padrão usa `ThreadLocal`: fica preso à thread da requisição. Ao passar trabalho pra outra thread (`@Async`, `CompletableFuture`), o contexto não vai junto; é preciso propagar (ex.: `DelegatingSecurityContextExecutor`) ou passar o id do usuário como parâmetro.

</details>

**22. Evento interno do Spring (`@EventListener`) ou Kafka/RabbitMQ?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

Evento interno é pub/sub em memória, síncrono por padrão e sem custo de infraestrutura: bom pra desacoplar módulos dentro da aplicação. Mas se o processo cair, o evento se perde e ele não chega em outros serviços. Quando o efeito não pode se perder, precisa de retry ou vai pra outro serviço, uso broker.

</details>

**23. Quais os cuidados com `@Async`?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

É proxy, então chamada interna não fica assíncrona. Configure o executor (ou use virtual threads pra I/O). Exceção em método `void` some sem um handler; prefira retornar `CompletableFuture`. Transação, contexto de segurança e MDC não propagam. E não é fila: sem retry nem persistência, se a aplicação cair o trabalho se perde.

</details>

**24. Qual o problema de `@Scheduled` com várias réplicas e como resolver?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

Cada réplica executa o agendamento, então a tarefa roda N vezes. Soluções: lock distribuído com ShedLock (banco ou Redis), agendador separado com uma réplica ou do próprio orquestrador (CronJob), e tarefa idempotente de qualquer forma.

</details>

**25. Qual a diferença entre liveness e readiness, e por que não colocar o banco no liveness?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Liveness diz se o processo está saudável; se falhar, o Kubernetes reinicia o container. Readiness diz se pode receber tráfego; se falhar, o pod sai do load balancer sem reiniciar. Se o banco estiver no liveness, uma oscilação dele faz todas as réplicas reiniciarem ao mesmo tempo e piora o incidente.

</details>

**26. Quais os cuidados ao usar `@Cacheable`?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Funciona via proxy (chamada interna não usa cache). Defina TTL e tamanho máximo; cache sem limite vira vazamento de memória. Caffeine é local, por instância; Redis é compartilhado entre réplicas. Invalide com `@CacheEvict` quando o dado muda, e cacheie DTOs, não entidades JPA gerenciadas.

</details>

**27. Virtual threads ou WebFlux?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Pra API comum I/O-bound, virtual threads (`spring.threads.virtual.enabled=true`): escalabilidade parecida com o reativo mantendo código imperativo, fácil de ler e depurar. WebFlux quando preciso de streaming ou backpressure de ponta a ponta. Nos dois casos o gargalo vira o pool de conexões do banco.

</details>

**28. Quando vale usar GraalVM Native Image com Spring?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Quando startup e memória importam muito: serverless, escala rápida, muitos serviços pequenos. O executável sobe em milissegundos e usa menos memória. Em troca, o build é lento, perde otimizações dinâmicas do JIT e exige cuidado com reflection e bibliotecas sem suporte a AOT.

</details>

---

## Nível 3 — Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**29. Como você trata erros numa API Spring?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Services lançam exceções de domínio unchecked; um @RestControllerAdvice com @ExceptionHandler traduz em respostas HTTP, com ProblemDetail (RFC 7807). Validação com @Valid e Bean Validation gera 400.

</details>

**30. O que é o N+1 e como resolver com JPA? E a LazyInitializationException?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

N+1: uma query pra lista e uma por item ao acessar relacionamento lazy. Resolver com JOIN FETCH, @EntityGraph, batch size ou projeção em DTO. LazyInitializationException: acessar lazy fora da transação; resolver buscando o necessário no service, não com EAGER nem open-in-view.

</details>

**31. Um @Transactional não faz rollback. O que investigar?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Self-invocation (sem proxy), método não público, exceção checked (rollback padrão só em unchecked; usar rollbackFor), exceção capturada e engolida, ou classe que não é bean do Spring.

</details>

**32. Quando você usaria a propagação `REQUIRES_NEW`?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Quando uma operação precisa ser gravada independente do resultado da transação principal, como um log de auditoria ou o registro de uma tentativa que falhou. Ela suspende a transação atual e abre uma nova. Cuidado: usa outra conexão do pool e, via proxy, precisa estar em outro bean.

</details>

**33. Como você protegeria uma API Spring com JWT emitido por um provedor como Keycloak ou Auth0?**
<sub>Aula [03 — Spring Security](aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

Configuro a API como resource server com `issuer-uri`: o Spring descobre as chaves públicas (JWKS) e valida assinatura, expiração e emissor. Sessão stateless, CSRF desligado (token no header), claims convertidas em authorities com um `JwtAuthenticationConverter`, regras por URL com negar por padrão, `@PreAuthorize` pras regras finas, ownership na consulta, e 401/403 customizados em JSON. Testo o caminho negativo também.

</details>

**34. Como você trataria erros num consumidor `@KafkaListener`?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

Retry com backoff só pra falha transitória, via `DefaultErrorHandler`; erro de dado (mensagem inválida) marcado como não-retentável. Esgotadas as tentativas, `DeadLetterPublishingRecoverer` manda pro tópico DLT, com alerta e reprocessamento depois. Como a entrega é at-least-once, o consumidor é idempotente, por exemplo com tabela de mensagens processadas ou constraint única.

</details>

**35. Como garantir que um evento só seja publicado no broker se a transação do banco commitar?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

Salvar no banco e publicar no broker não é atômico (dual write). Uso o transactional outbox: na mesma transação gravo a entidade e o evento numa tabela outbox, e um processo separado (poller com lock ou CDC com Debezium) publica e marca como enviado. O Spring Modulith oferece algo parecido com o registro de publicação de eventos. Consumidores idempotentes, porque pode haver reenvio.

</details>

**36. Como você protegeria sua aplicação de um serviço externo lento ou fora do ar?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Timeout de conexão e leitura em todo cliente HTTP (RestClient/WebClient). Circuit breaker com Resilience4j pra falhar rápido quando o serviço está fora, com fallback. Retry com backoff só pra operação idempotente. Bulkhead pra limitar a concorrência e não consumir todas as threads, e métricas desses componentes no Actuator.

</details>

**37. Como fazer deploy de uma aplicação Spring sem derrubar requisições?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Graceful shutdown (`server.shutdown=graceful`) com `timeout-per-shutdown-phase`, readiness que passa a falhar no desligamento pra sair do load balancer, e `terminationGracePeriodSeconds` do Kubernetes maior que esse timeout. Rolling update com migrações de banco compatíveis com a versão anterior (expand and contract).

</details>
