# Aula 10 — Build, Testes e Design Patterns

> **Objetivo:** conhecer as ferramentas de build (Maven e Gradle), a stack de testes do Java (JUnit, Mockito, testes do Spring, Testcontainers) e os design patterns que mais aparecem em entrevista.

---

## 1. Build: Maven e Gradle

Ferramentas de build **gerenciam dependências**, **compilam**, **rodam testes** e **empacotam** (`.jar`).

### Maven
- Configuração em **`pom.xml`** (XML), declarativa e padronizada.
- **Ciclo de vida** com fases fixas: `validate → compile → test → package → verify → install → deploy`. Rodar `mvn package` executa todas as fases até `package`.
- **Convenção de pastas**: `src/main/java`, `src/main/resources`, `src/test/java`.
- Dependências baixadas do **Maven Central** e guardadas em `~/.m2`.
- Escopos de dependência: `compile` (padrão), `test`, `provided`, `runtime`.

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
Coordenadas: **groupId : artifactId : version** (GAV).

### Gradle
- Configuração em código (**Groovy** ou **Kotlin DSL**: `build.gradle.kts`).
- Mais flexível e geralmente **mais rápido** (build incremental, cache de build, daemon).
- Padrão no Android.

Maven: mais simples e previsível. Gradle: mais poderoso e rápido, porém mais complexo. Os dois usam o **wrapper** (`./mvnw`, `./gradlew`), que fixa a versão da ferramenta no projeto.

---

## 2. Testes: a stack

| Ferramenta | Pra que |
|---|---|
| **JUnit 5** | Framework de testes (`@Test`, `@BeforeEach`, `@ParameterizedTest`, `@Nested`) |
| **AssertJ** | Asserções fluentes: `assertThat(total).isEqualTo(100)` |
| **Mockito** | Mocks: `when(repo.findById(1L)).thenReturn(Optional.of(p))`, `verify(...)` |
| **Spring Boot Test** | Testes com contexto Spring (completo ou fatias) |
| **Testcontainers** | Sobe Postgres, Kafka, Redis **reais** em Docker durante o teste |
| **MockMvc / WebTestClient / RestAssured** | Testar a camada HTTP |

### Teste unitário (sem Spring, rápido)
```java
class PedidoServiceTest {
  PedidoRepository repo = mock(PedidoRepository.class);
  Notificador notificador = mock(Notificador.class);
  PedidoService service = new PedidoService(repo, notificador);   // injeção por construtor facilita!

  @Test
  void deveNotificarAoConcluir() {
    var pedido = new Pedido(...);
    when(repo.findById(1L)).thenReturn(Optional.of(pedido));

    service.concluir(1L);

    verify(notificador).enviar(eq(pedido.getEmail()), anyString());
    assertThat(pedido.getStatus()).isEqualTo(Status.CONCLUIDO);
  }
}
```

### Testes com Spring: fatias (*slices*)
- **`@WebMvcTest`**: sobe só a camada web (controllers, advice, validação), com o service mockado (`@MockitoBean`, antigo `@MockBean`).
- **`@DataJpaTest`**: sobe só a camada JPA (repositórios), idealmente com banco real via Testcontainers.
- **`@SpringBootTest`**: sobe a aplicação **inteira**; mais lento; para testes de integração/e2e.

Usar **fatias** deixa os testes muito mais rápidos que subir tudo sempre.

### Pirâmide de testes
Muitos **unitários** (rápidos, isolados), alguns de **integração** (com banco real), poucos **e2e**. Com Testcontainers, testar contra o **banco real** evita a falsa segurança do H2 (banco em memória que se comporta diferente do Postgres).

Conceitos: **mock** (comportamento programado + verificação), **stub** (retorno fixo), **fake** (implementação simples), **spy** (objeto real observado). **TDD** (*Test-Driven Development*): escrever o teste antes (vermelho → verde → refatorar).

---

## 3. Design Patterns que mais caem

Os padrões clássicos vêm do livro ***Design Patterns*** (1994), da **Gang of Four (GoF)**, divididos em **criacionais**, **estruturais** e **comportamentais**.

### Criacionais (como criar objetos)
- **Singleton**: uma única instância. No Spring, os **beans já são singletons** gerenciados pelo container (não precisa implementar na mão; o Singleton "clássico" com `static` dificulta testes).
- **Factory / Factory Method**: um método/classe decide **qual** implementação criar (`NotificadorFactory.criar(tipo)`, `List.of`).
- **Builder**: construir objetos complexos passo a passo, com legibilidade:
```java
Pedido p = Pedido.builder().cliente(c).item(i1).item(i2).cupom("X").build();
```
Evita construtores com 10 parâmetros (*telescoping constructor*). Lombok `@Builder` gera.

### Estruturais (como compor objetos)
- **Adapter**: adapta uma interface para outra esperada (ex: `StripeGatewayAdapter implements GatewayPagamento`). É o "adapter" da arquitetura hexagonal.
- **Decorator**: adiciona comportamento **envolvendo** um objeto com a mesma interface (ex: `BufferedReader(new FileReader())`, um `NotificadorComLog` que envolve o notificador).
- **Proxy**: um substituto que controla o acesso ao objeto real (os proxies do Spring: transação, lazy loading do Hibernate).
- **Facade**: uma interface simples na frente de um subsistema complexo.

### Comportamentais (como objetos interagem)
- **Strategy**: família de algoritmos intercambiáveis por interface (formas de pagamento, cálculo de frete). Elimina `if/else` por tipo.
- **Observer**: objetos se inscrevem para ser avisados de eventos (listeners, `ApplicationEventPublisher` do Spring, pub/sub).
- **Template Method**: a classe pai define o esqueleto do algoritmo e as filhas preenchem passos (`JdbcTemplate` segue a ideia).
- **Chain of Responsibility**: a requisição passa por uma cadeia de handlers (filtros do Spring Security, middlewares).
- **Command**: encapsular uma ação como objeto (filas de tarefas, desfazer).

Dica de entrevista: **não decore a lista; conecte cada padrão a um lugar onde você já o viu ou usou.** "Uso Strategy para os métodos de pagamento; o Spring usa Proxy para o `@Transactional`; o Spring Security é uma Chain of Responsibility."

---

## 4. SOLID em uma frase cada

- **S**ingle Responsibility: uma classe, **um motivo pra mudar**.
- **O**pen/Closed: aberto para extensão, fechado para modificação (Strategy, polimorfismo).
- **L**iskov Substitution: subclasse substitui a pai sem quebrar nada.
- **I**nterface Segregation: interfaces pequenas e específicas; ninguém implementa método que não usa.
- **D**ependency Inversion: depender de abstrações; injeção de dependência.

---

## 5. Como falar na entrevista

**"Como você testa uma aplicação Spring?"**
> "Unitários sem Spring, com JUnit, Mockito e AssertJ, instanciando o service com mocks pelo construtor, que é rápido. Pra camada web uso @WebMvcTest com o service mockado, e pra persistência @DataJpaTest com Postgres real via Testcontainers, pra não ter a falsa segurança do H2. @SpringBootTest completo só pra alguns fluxos de integração. Sigo a pirâmide: muitos unitários, alguns de integração, poucos e2e."

**"Quais design patterns você usa?"**
> "Strategy pra variações de regra, tipo métodos de pagamento, injetando uma lista de implementações; Builder pra objetos com muitos campos; Adapter pra integrar gateways externos atrás de uma interface minha. E reconheço os que o framework usa: Proxy no @Transactional, Chain of Responsibility nos filtros do Spring Security, Observer nos eventos."

---

## 6. Resumo

- **Maven** (`pom.xml`, ciclo de vida, convenção, GAV) × **Gradle** (DSL em código, mais rápido); wrappers.
- Testes: **JUnit 5, AssertJ, Mockito, Testcontainers**.
- Spring: **`@WebMvcTest`**, **`@DataJpaTest`** (fatias), **`@SpringBootTest`** (tudo).
- Pirâmide; banco real > H2; mock/stub/fake/spy; TDD.
- Patterns: **Singleton, Factory, Builder** · **Adapter, Decorator, Proxy, Facade** · **Strategy, Observer, Template Method, Chain of Responsibility, Command**.
- **SOLID**.

## Termos desta aula
Maven · pom.xml · ciclo de vida · Maven Central · GAV · escopo de dependência · Gradle · Kotlin DSL · wrapper · JUnit 5 · AssertJ · Mockito · mock · stub · fake · spy · verify · Testcontainers · H2 · @WebMvcTest · @DataJpaTest · @SpringBootTest · @MockitoBean · test slice · pirâmide de testes · TDD · design patterns · Gang of Four · Singleton · Factory · Builder · Adapter · Decorator · Proxy · Facade · Strategy · Observer · Template Method · Chain of Responsibility · Command · SOLID

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 10** e separadas por nível.
