# Aula 06 — Testes no Spring Boot

> **Objetivo:** saber escolher o tipo de teste certo numa aplicação Spring (unitário puro, fatias como `@WebMvcTest` e `@DataJpaTest`, `@SpringBootTest`), usar banco real com Testcontainers e `@ServiceConnection`, testar segurança, e manter a suíte rápida com o cache de contexto.

A base (JUnit, Mockito, AssertJ, pirâmide, tipos de dublê) está na [aula 10 de Java](../../java/aulas/10-build-testes-e-padroes.md). Aqui é **o que o Spring oferece**.

---

## 1. O problema

O erro mais comum em projetos Spring é colocar **`@SpringBootTest` em todo teste**. Cada um sobe a aplicação inteira (banco, filas, segurança, todos os beans): a suíte fica lenta, o time para de rodar os testes localmente e eles viram algo que "só o CI roda".

O Spring oferece **níveis** de teste. A habilidade é subir **só o necessário** pra cada caso.

---

## 2. Os níveis

| Nível | O que sobe | Velocidade | Pra testar |
|---|---|---|---|
| **Unitário puro** (JUnit + Mockito) | **Nada** do Spring | Milissegundos | Regras de negócio, services com dependências falsas |
| **`@WebMvcTest`** | Camada web: controllers, advice, validação, filtros, Jackson | Rápido | Rotas, status, validação, formato JSON, erros |
| **`@DataJpaTest`** | Camada JPA: repositórios, entidades, `EntityManager` | Rápido/médio | Queries, mapeamentos, constraints |
| Outras fatias: `@JsonTest`, `@RestClientTest`, `@WebFluxTest` | Só a parte correspondente | Rápido | Serialização, clientes HTTP |
| **`@SpringBootTest`** | A **aplicação inteira** | Lento | Fluxos de integração ponta a ponta |

**Injeção por construtor** (aula 01) é o que torna o unitário puro possível: `new PedidoService(repoFalso, notificadorFalso)`, sem Spring nenhum.

---

## 3. @WebMvcTest: a camada web

```java
@WebMvcTest(PedidoController.class)
class PedidoControllerTest {
  @Autowired MockMvc mvc;
  @MockitoBean PedidoService service;          // substitui o bean real por um mock

  @Test
  void criarRetorna201() throws Exception {
    when(service.criar(any())).thenReturn(new PedidoResponse(1L, "NOVO"));

    mvc.perform(post("/pedidos").contentType(APPLICATION_JSON).content("""
          {"clienteId": 10, "itens": [{"produtoId": 5, "quantidade": 2}]}
        """))
       .andExpect(status().isCreated())
       .andExpect(jsonPath("$.status").value("NOVO"));
  }

  @Test
  void validacaoRetorna400() throws Exception {
    mvc.perform(post("/pedidos").contentType(APPLICATION_JSON).content("{}"))
       .andExpect(status().isBadRequest());
  }
}
```

- **MockMvc** simula requisições sem subir servidor HTTP de verdade, passando por todo o pipeline do Spring MVC (filtros, validação, `@ControllerAdvice`, serialização).
- **`@MockitoBean`** (nome atual; o antigo era `@MockBean`) troca um bean do contexto por um mock.
- Teste os **caminhos de erro**: validação (400), não encontrado (404), regra de negócio (409/422), segurança (401/403).

---

## 4. @DataJpaTest e banco real

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)   // não trocar pelo banco em memória
@Testcontainers
class PedidoRepositoryTest {
  @Container @ServiceConnection
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17");

  @Autowired PedidoRepository repo;

  @Test
  void buscaPedidosPagosDoCliente() { ... }
}
```

- Por padrão, o `@DataJpaTest` **troca o banco** por um em memória (H2) e roda cada teste **numa transação com rollback no final** (isolamento de graça).
- **H2 esconde bugs**: SQL específico do Postgres, tipos (JSONB, arrays), constraints e comportamento de locks diferentes. Por isso, banco **real** com **Testcontainers**.
- **`@ServiceConnection`** (Boot 3.1+): o Spring lê o container e configura a conexão sozinho, sem `@DynamicPropertySource` na mão.
- As **migrations** reais (Flyway/Liquibase) rodam no container: o teste também valida que elas funcionam.

---

## 5. @SpringBootTest: integração

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Testcontainers
class FluxoPedidoIT {
  @Container @ServiceConnection static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17");
  @Container @ServiceConnection static KafkaContainer kafka = new KafkaContainer("apache/kafka:3.8.0");
  ...
}
```

- `RANDOM_PORT` sobe o servidor de verdade numa porta aleatória; chama-se com um cliente HTTP (ex.: `RestClient`/`TestRestTemplate`).
- Use pra **poucos fluxos críticos** (criar pedido → publica evento → consumidor processa).
- **Cuidado com `@Transactional` em teste de integração**: o rollback automático esconde problemas (ex.: `LazyInitializationException` que aconteceria em produção, porque o teste inteiro fica dentro de uma transação).

---

## 6. Cache de contexto: por que a suíte fica lenta

O Spring **reaproveita o contexto** entre classes de teste que têm **a mesma configuração**. Cada combinação diferente de `@MockitoBean`, profiles ou propriedades cria **um contexto novo** (lento, e cada um com seus containers e conexões).

Boas práticas:
- Padronize a configuração de testes de integração numa **classe base** ou anotação própria.
- Evite `@MockitoBean` espalhado com combinações diferentes em cada classe.
- Evite **`@DirtiesContext`** (força recriar o contexto), a não ser que seja inevitável.
- Containers **estáticos e compartilhados** (ou *singleton containers*) entre as classes.

---

## 7. Testando segurança e mensageria

- **Segurança**: `spring-security-test` com `@WithMockUser(roles = "ADMIN")` ou, com MockMvc, `.with(jwt().authorities(...))`. Teste sempre o **caminho negativo** (sem token → 401; papel errado → 403).
- **Kafka/Rabbit**: container real com Testcontainers, e aguardar o processamento assíncrono com **Awaitility** (`await().atMost(5, SECONDS).untilAsserted(...)`), em vez de `Thread.sleep`.
- **APIs externas**: WireMock ou `@RestClientTest` com `MockRestServiceServer`.
- **Contrato entre serviços**: Spring Cloud Contract ou Pact, pra garantir que produtor e consumidor concordam.

---

## 8. Como falar na entrevista

**"Como você testa uma aplicação Spring Boot sem deixar a suíte lenta?"**
> "Subo só o necessário pra cada caso. Regra de negócio é teste unitário puro com JUnit e Mockito, sem Spring, o que a injeção por construtor permite. Controller com @WebMvcTest e MockMvc, mockando o service com @MockitoBean e testando validação, status e erros. Repositório com @DataJpaTest, mas contra Postgres real no Testcontainers com @ServiceConnection, porque H2 esconde bug. @SpringBootTest só em poucos fluxos críticos. E cuido do cache de contexto: configuração padronizada e sem @DirtiesContext, pra o Spring reaproveitar o contexto entre as classes."

**"Por que não usar H2 nos testes?"**
> "Porque ele se comporta diferente do banco de produção: SQL específico, tipos como JSONB, constraints e locks. O teste passa e o bug aparece em produção. Com Testcontainers eu uso o mesmo Postgres e as migrations reais, e o custo é alguns segundos pra subir o container, que compartilho entre as classes."

---

## 9. Resumo

- Erro comum: **`@SpringBootTest` em tudo** → suíte lenta.
- Níveis: **unitário puro** (sem Spring), **`@WebMvcTest`** (web + MockMvc + `@MockitoBean`), **`@DataJpaTest`** (JPA, rollback por teste), outras fatias, **`@SpringBootTest`** (poucos fluxos).
- Banco real com **Testcontainers** + **`@ServiceConnection`** + migrations; **H2 esconde bugs**.
- `@Transactional` em teste de integração pode esconder erros.
- **Cache de contexto**: configuração padronizada, evitar `@DirtiesContext` e combinações de mocks, containers compartilhados.
- Segurança com `@WithMockUser`/`jwt()`; mensageria com containers + **Awaitility**; APIs externas com WireMock; contrato com Spring Cloud Contract/Pact.

## Termos desta aula
teste unitário · teste de integração · fatia (slice) · @WebMvcTest · MockMvc · @MockitoBean · @MockBean · @DataJpaTest · rollback · @AutoConfigureTestDatabase · H2 · Testcontainers · @ServiceConnection · Flyway · Liquibase · @SpringBootTest · RANDOM_PORT · cache de contexto · @DirtiesContext · @WithMockUser · spring-security-test · Awaitility · WireMock · @RestClientTest · Spring Cloud Contract · Pact

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 06** e separadas por nível.
