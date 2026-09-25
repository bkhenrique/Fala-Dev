# Spring — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. Por que preferir injeção por construtor?**
<sub>Aula [01 — Spring Core e Spring Boot](../aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

Dependências explícitas e obrigatórias, campos final, testável sem Spring (new com mocks) e deixa evidente quando a classe tem dependências demais.

</details>

**2. Como o Spring Boot decide o que configurar sozinho?**
<sub>Aula [01 — Spring Core e Spring Boot](../aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

Pela auto-configuration: olha o que está no classpath e aplica configurações condicionais (`@ConditionalOnClass`, `@ConditionalOnMissingBean`). Se você declara seu próprio bean, o do Boot sai de cena. É convention over configuration.

</details>

**3. Por que o `@Transactional` não funciona em chamada interna da mesma classe?**
<sub>Aula [01 — Spring Core e Spring Boot](../aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

Porque o Spring aplica a transação via proxy em volta do bean. `this.metodo()` chama o objeto real direto, sem passar pelo proxy, então a anotação é ignorada. Vale pra @Cacheable e @Async também.

</details>

**4. LAZY ou EAGER nos relacionamentos JPA?**
<sub>Aula [02 — Spring Web e Spring Data JPA](../aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

LAZY por padrão em tudo, buscando explicitamente o que cada caso de uso precisa (join fetch, entity graph, DTO). EAGER carrega sempre, mesmo quando não precisa, e piora performance. Atenção: na JPA, `@ManyToOne` e `@OneToOne` já vêm EAGER por padrão.

</details>

**5. O que é o open-in-view e por que muitos times desligam?**
<sub>Aula [02 — Spring Web e Spring Data JPA](../aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Configuração ligada por padrão no Spring Boot que mantém a sessão do Hibernate aberta até o fim da requisição, evitando LazyInitializationException. É considerado anti-padrão porque esconde N+1 e segura a conexão do banco durante toda a requisição.

</details>

**6. `hasRole` ou `hasAuthority`?**
<sub>Aula [03 — Spring Security](../aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

Authority é qualquer permissão (string). Role é uma authority com prefixo `ROLE_` por convenção. `hasRole("ADMIN")` procura `ROLE_ADMIN`; `hasAuthority("ADMIN")` procura `ADMIN` exatamente. Confundir os dois é causa clássica de 403 inesperado.

</details>

**7. Por que é comum desabilitar CSRF numa API com JWT, e quando isso seria um erro?**
<sub>Aula [03 — Spring Security](../aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

CSRF explora o envio automático de cookies pelo navegador. Se o token vai no header `Authorization`, que o JavaScript precisa colocar de propósito, o ataque não funciona e desligar CSRF é seguro. Se a sessão ou o token estiver em cookie, desligar CSRF abre a vulnerabilidade.

</details>

**8. Autorização por URL ou por método com `@PreAuthorize`?**
<sub>Aula [03 — Spring Security](../aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

Por URL para regras amplas (área admin, rotas públicas), com `anyRequest().authenticated()` no fim pra negar por padrão. Por método para regras finas, podendo usar os parâmetros (ex.: dono do recurso). `@PreAuthorize` funciona via proxy, então chamada interna na mesma classe não é checada; e ownership fica mais robusto na própria consulta, evitando IDOR.

</details>

**9. Onde fica o usuário autenticado durante a requisição e qual o cuidado com `@Async`?**
<sub>Aula [03 — Spring Security](../aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

No `SecurityContextHolder`, que por padrão usa `ThreadLocal`: fica preso à thread da requisição. Ao passar trabalho pra outra thread (`@Async`, `CompletableFuture`), o contexto não vai junto; é preciso propagar (ex.: `DelegatingSecurityContextExecutor`) ou passar o id do usuário como parâmetro.

</details>

**10. Evento interno do Spring (`@EventListener`) ou Kafka/RabbitMQ?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](../aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

Evento interno é pub/sub em memória, síncrono por padrão e sem custo de infraestrutura: bom pra desacoplar módulos dentro da aplicação. Mas se o processo cair, o evento se perde e ele não chega em outros serviços. Quando o efeito não pode se perder, precisa de retry ou vai pra outro serviço, uso broker.

</details>

**11. Quais os cuidados com `@Async`?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](../aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

É proxy, então chamada interna não fica assíncrona. Configure o executor (ou use virtual threads pra I/O). Exceção em método `void` some sem um handler; prefira retornar `CompletableFuture`. Transação, contexto de segurança e MDC não propagam. E não é fila: sem retry nem persistência, se a aplicação cair o trabalho se perde.

</details>

**12. Qual o problema de `@Scheduled` com várias réplicas e como resolver?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](../aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

Cada réplica executa o agendamento, então a tarefa roda N vezes. Soluções: lock distribuído com ShedLock (banco ou Redis), agendador separado com uma réplica ou do próprio orquestrador (CronJob), e tarefa idempotente de qualquer forma.

</details>

**13. Qual a diferença entre liveness e readiness, e por que não colocar o banco no liveness?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](../aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Liveness diz se o processo está saudável; se falhar, o Kubernetes reinicia o container. Readiness diz se pode receber tráfego; se falhar, o pod sai do load balancer sem reiniciar. Se o banco estiver no liveness, uma oscilação dele faz todas as réplicas reiniciarem ao mesmo tempo e piora o incidente.

</details>

**14. Quais os cuidados ao usar `@Cacheable`?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](../aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Funciona via proxy (chamada interna não usa cache). Defina TTL e tamanho máximo; cache sem limite vira vazamento de memória. Caffeine é local, por instância; Redis é compartilhado entre réplicas. Invalide com `@CacheEvict` quando o dado muda, e cacheie DTOs, não entidades JPA gerenciadas.

</details>

**15. Virtual threads ou WebFlux?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](../aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Pra API comum I/O-bound, virtual threads (`spring.threads.virtual.enabled=true`): escalabilidade parecida com o reativo mantendo código imperativo, fácil de ler e depurar. WebFlux quando preciso de streaming ou backpressure de ponta a ponta. Nos dois casos o gargalo vira o pool de conexões do banco.

</details>

**16. Quando vale usar GraalVM Native Image com Spring?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](../aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Quando startup e memória importam muito: serverless, escala rápida, muitos serviços pequenos. O executável sobe em milissegundos e usa menos memória. Em troca, o build é lento, perde otimizações dinâmicas do JIT e exige cuidado com reflection e bibliotecas sem suporte a AOT.

</details>

**17. Quando um teste deve subir o contexto completo do Spring?**
<sub>Aula [06 — Testes no Spring: unitários, slices e integração](../aulas/06-testes-no-spring.md)</sub>
<details><summary>Ver resposta</summary>

Quando a pergunta é sobre integração real entre configuração, DI, filtros ou persistência. Para regra pura, instancio a classe com mocks; para controller, uso um slice; deixo o contexto completo para fluxos que dependem dessa integração. Isso reduz tempo e evita testes de alto custo para toda linha de código.

</details>

**18. Quando escolher Testcontainers em vez de H2?**
<sub>Aula [06 — Testes no Spring: unitários, slices e integração](../aulas/06-testes-no-spring.md)</sub>
<details><summary>Ver resposta</summary>

Uso Testcontainers quando diferenças do banco ou broker importam: dialeto SQL, índices, locks, extensões e comportamento de transação. H2 inicia rápido e é útil em testes simples, mas não reproduz necessariamente o banco de produção. Containers tornam o ambiente mais fiel ao custo de tempo e dependência do runtime Docker.

</details>

**19. Quando usar Spring Cloud Config e quando a configuração da plataforma basta?**
<sub>Aula [07 — Microsserviços com Spring Cloud](../aulas/07-microsservicos-com-spring-cloud.md)</sub>
<details><summary>Ver resposta</summary>

Config centralizado ajuda quando várias aplicações precisam compartilhar configuração versionada e atualização coordenada. Em ambientes com Kubernetes, ConfigMaps, Secrets e variáveis podem resolver sem mais um serviço. Segredos continuam em um cofre apropriado, e mudanças de configuração precisam de política clara de recarga e auditoria.

</details>

**20. Por que o circuit breaker deve ser combinado com timeout e bulkhead?**
<sub>Aula [07 — Microsserviços com Spring Cloud](../aulas/07-microsservicos-com-spring-cloud.md)</sub>
<details><summary>Ver resposta</summary>

Circuit breaker impede insistir num serviço que falha; timeout limita quanto uma chamada pode esperar; bulkhead limita recursos ocupados por chamadas lentas. Sem timeout, a chamada pode nunca concluir; sem bulkhead, as chamadas pendentes esgotam threads ou conexões. Retry só ajuda falhas transitórias e operações seguras de repetir.

</details>
