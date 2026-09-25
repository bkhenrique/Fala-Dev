# Spring — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. O que é IoC e um bean no Spring?**
<sub>Aula [01 — Spring Core e Spring Boot](../aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

IoC: o container (ApplicationContext) cria, configura e conecta os objetos, em vez do código fazer `new`. Bean é um objeto gerenciado por esse container, declarado com estereótipos (@Service etc.) ou @Bean.

</details>

**2. Qual a diferença entre Spring e Spring Boot?**
<sub>Aula [01 — Spring Core e Spring Boot](../aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

Spring é o framework (IoC, MVC, Data, Security). Boot adiciona auto-configuração baseada no classpath, starters, servidor embutido (jar executável), configuração externa com profiles e Actuator: convention over configuration.

</details>

**3. Quais são os escopos de bean no Spring e qual o cuidado com o padrão?**
<sub>Aula [01 — Spring Core e Spring Boot](../aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

singleton (padrão, uma instância por container), prototype (nova a cada injeção), request e session. Como o singleton atende várias requisições em paralelo, o bean precisa ser stateless: nada de estado de requisição em atributo de `@Service`.

</details>

**4. Pra que servem profiles e `@ConfigurationProperties`?**
<sub>Aula [01 — Spring Core e Spring Boot](../aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

Profiles separam configuração por ambiente (`application-dev.yml`, `application-prod.yml`, ativados por `spring.profiles.active`). `@ConfigurationProperties` mapeia um bloco de configuração para uma classe tipada e validável, melhor que vários `@Value` soltos.

</details>

**5. JPA, Hibernate e Spring Data: qual a diferença?**
<sub>Aula [02 — Spring Web e Spring Data JPA](../aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

JPA é a especificação de ORM do Java; Hibernate é a implementação mais usada; Spring Data JPA gera repositórios a partir de interfaces (JpaRepository, queries derivadas do nome, @Query).

</details>

**6. O que é dirty checking?**
<sub>Aula [02 — Spring Web e Spring Data JPA](../aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Entidades carregadas numa transação ficam gerenciadas no persistence context; no commit, o Hibernate compara com o estado original e gera os UPDATEs automaticamente, sem chamar save.

</details>

**7. O que é a `SecurityFilterChain` e como a requisição passa por ela?**
<sub>Aula [03 — Spring Security](../aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

É a lista ordenada de filtros de segurança que roda antes do `DispatcherServlet`. O `DelegatingFilterProxy` (registrado no servidor) repassa pro `FilterChainProxy`, que escolhe a `SecurityFilterChain` pela URL. Nela passam CORS, CSRF, autenticação, tradução de exceções (401/403) e autorização. Hoje a configuração é um bean `SecurityFilterChain`, e não mais a antiga `WebSecurityConfigurerAdapter`.

</details>

**8. Qual o papel de `AuthenticationManager`, `UserDetailsService` e `PasswordEncoder`?**
<sub>Aula [03 — Spring Security](../aulas/03-spring-security.md)</sub>
<details><summary>Ver resposta</summary>

O `AuthenticationManager` recebe o pedido de autenticação e delega aos `AuthenticationProvider`s. No login com usuário e senha, o provider usa o `UserDetailsService` pra buscar o usuário no banco e o `PasswordEncoder` (BCrypt) pra comparar a senha com o hash. Com sucesso, o `Authentication` vai pro `SecurityContextHolder`.

</details>

**9. O que é o `@TransactionalEventListener` e por que usar `AFTER_COMMIT`?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](../aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

É um listener de evento do Spring amarrado à transação de quem publicou. Com `AFTER_COMMIT` (o padrão), ele só executa se a transação commitou, evitando, por exemplo, mandar e-mail de um pedido que deu rollback. Se o evento for publicado fora de transação, por padrão o listener nem roda.

</details>

**10. O que é um consumer group no Kafka?**
<sub>Aula [04 — Eventos, processamento assíncrono e mensageria no Spring](../aulas/04-eventos-assincrono-e-mensageria.md)</sub>
<details><summary>Ver resposta</summary>

É um conjunto de consumidores com o mesmo `groupId` que dividem as partições de um tópico entre si, escalando o processamento. Grupos diferentes recebem cada um sua cópia das mensagens, então estoque e analytics podem ler o mesmo tópico de forma independente.

</details>

**11. Pra que serve o Spring Boot Actuator e o que você expõe?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](../aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Endpoints de operação: health (com liveness e readiness), metrics, prometheus, info, loggers. Exponho só health, info e prometheus; endpoints como env, heapdump e loggers vazam dados ou permitem alterar a aplicação, então ficam fechados ou numa porta de gerenciamento separada.

</details>

**12. O que é o Micrometer?**
<sub>Aula [05 — Spring em produção: Actuator, observabilidade, cache, resiliência e performance](../aulas/05-spring-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

A fachada de métricas do Spring, como o SLF4J é pra logs: instrumenta uma vez e exporta pra Prometheus, Datadog, CloudWatch etc. O Boot já mede HTTP, JVM e pool de conexões, e você cria métricas de negócio com o `MeterRegistry`. Junto com Micrometer Tracing e OpenTelemetry, dá tracing distribuído.

</details>

**13. O que o starter de testes do Spring Boot costuma reunir?**
<sub>Aula [06 — Testes no Spring: unitários, slices e integração](../aulas/06-testes-no-spring.md)</sub>
<details><summary>Ver resposta</summary>

Ele reúne Spring Boot Test e Spring Test, além de ferramentas comuns como JUnit Jupiter, AssertJ e Mockito. A composição exata depende da versão e dos módulos presentes. Com isso, testes podem criar o contexto Spring, fazer assertions legíveis e substituir dependências sem configurar cada peça manualmente.

</details>

**14. Qual a diferença entre @WebMvcTest e @SpringBootTest?**
<sub>Aula [06 — Testes no Spring: unitários, slices e integração](../aulas/06-testes-no-spring.md)</sub>
<details><summary>Ver resposta</summary>

@WebMvcTest sobe um recorte focado na camada MVC, normalmente com controllers e conversores, deixando services como mocks. @SpringBootTest cria o contexto amplo da aplicação e serve para integração entre várias camadas. O recorte é mais rápido; o contexto completo encontra problemas de wiring, mas custa mais.

</details>

**15. O que é um API Gateway no Spring Cloud?**
<sub>Aula [07 — Microsserviços com Spring Cloud](../aulas/07-microsservicos-com-spring-cloud.md)</sub>
<details><summary>Ver resposta</summary>

É a borda de entrada que recebe chamadas e as encaminha a serviços, podendo aplicar filtros transversais como roteamento, autenticação, rate limit e observabilidade. O Spring Cloud Gateway implementa esse padrão com rotas e filtros reativos. A regra de domínio continua no serviço responsável.

</details>

**16. O que significa descoberta de serviços?**
<sub>Aula [07 — Microsserviços com Spring Cloud](../aulas/07-microsservicos-com-spring-cloud.md)</sub>
<details><summary>Ver resposta</summary>

É resolver a localização atual de uma instância pelo nome lógico do serviço, em vez de fixar IPs no código. Um registro ou a plataforma de execução mantém instâncias disponíveis; clientes ou proxies escolhem um destino. Em Kubernetes, DNS e Services muitas vezes já resolvem essa necessidade.

</details>
