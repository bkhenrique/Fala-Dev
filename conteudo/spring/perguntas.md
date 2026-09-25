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

---

## Nível 2 — Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**7. Por que preferir injeção por construtor?**
<sub>Aula [01 — Spring Core e Spring Boot](aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

Dependências explícitas e obrigatórias, campos final, testável sem Spring (new com mocks) e deixa evidente quando a classe tem dependências demais.

</details>

**8. Como o Spring Boot decide o que configurar sozinho?**
<sub>Aula [01 — Spring Core e Spring Boot](aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

Pela auto-configuration: olha o que está no classpath e aplica configurações condicionais (`@ConditionalOnClass`, `@ConditionalOnMissingBean`). Se você declara seu próprio bean, o do Boot sai de cena. É convention over configuration.

</details>

**9. Por que o `@Transactional` não funciona em chamada interna da mesma classe?**
<sub>Aula [01 — Spring Core e Spring Boot](aulas/01-spring-core-e-boot.md)</sub>
<details><summary>Ver resposta</summary>

Porque o Spring aplica a transação via proxy em volta do bean. `this.metodo()` chama o objeto real direto, sem passar pelo proxy, então a anotação é ignorada. Vale pra @Cacheable e @Async também.

</details>

**10. LAZY ou EAGER nos relacionamentos JPA?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

LAZY por padrão em tudo, buscando explicitamente o que cada caso de uso precisa (join fetch, entity graph, DTO). EAGER carrega sempre, mesmo quando não precisa, e piora performance. Atenção: na JPA, `@ManyToOne` e `@OneToOne` já vêm EAGER por padrão.

</details>

**11. O que é o open-in-view e por que muitos times desligam?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Configuração ligada por padrão no Spring Boot que mantém a sessão do Hibernate aberta até o fim da requisição, evitando LazyInitializationException. É considerado anti-padrão porque esconde N+1 e segura a conexão do banco durante toda a requisição.

</details>

---

## Nível 3 — Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**12. Como você trata erros numa API Spring?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Services lançam exceções de domínio unchecked; um @RestControllerAdvice com @ExceptionHandler traduz em respostas HTTP, com ProblemDetail (RFC 7807). Validação com @Valid e Bean Validation gera 400.

</details>

**13. O que é o N+1 e como resolver com JPA? E a LazyInitializationException?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

N+1: uma query pra lista e uma por item ao acessar relacionamento lazy. Resolver com JOIN FETCH, @EntityGraph, batch size ou projeção em DTO. LazyInitializationException: acessar lazy fora da transação; resolver buscando o necessário no service, não com EAGER nem open-in-view.

</details>

**14. Um @Transactional não faz rollback. O que investigar?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Self-invocation (sem proxy), método não público, exceção checked (rollback padrão só em unchecked; usar rollbackFor), exceção capturada e engolida, ou classe que não é bean do Spring.

</details>

**15. Quando você usaria a propagação `REQUIRES_NEW`?**
<sub>Aula [02 — Spring Web e Spring Data JPA](aulas/02-spring-web-e-jpa.md)</sub>
<details><summary>Ver resposta</summary>

Quando uma operação precisa ser gravada independente do resultado da transação principal, como um log de auditoria ou o registro de uma tentativa que falhou. Ela suspende a transação atual e abre uma nova. Cuidado: usa outra conexão do pool e, via proxy, precisa estar em outro bean.

</details>
