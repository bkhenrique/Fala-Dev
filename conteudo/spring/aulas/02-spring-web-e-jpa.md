# Aula 02 — Spring Web e Spring Data JPA

> **Objetivo:** montar uma API REST com Spring (camadas, validação, tratamento de erro) e entender JPA/Hibernate a fundo: entidades, persistence context, lazy/eager, N+1 e `@Transactional`.

---

## 1. Camadas de uma API Spring

```
@RestController   → HTTP: recebe, valida, devolve DTO
      ↓
@Service          → regra de negócio, transação
      ↓
@Repository       → acesso a dados (Spring Data JPA)
      ↓
Banco
```

Mesma ideia do Nest (aula 10 de Nest): controller magro, regra no service, entidade do banco **não** sai pela API (usa DTO, muitas vezes um **record**).

---

## 2. Controller REST

```java
@RestController
@RequestMapping("/pedidos")
public class PedidoController {
  private final PedidoService service;
  public PedidoController(PedidoService service) { this.service = service; }

  @GetMapping("/{id}")
  public PedidoResponse buscar(@PathVariable Long id) {
    return service.buscar(id);
  }

  @GetMapping
  public Page<PedidoResponse> listar(@RequestParam(defaultValue = "0") int pagina) {
    return service.listar(PageRequest.of(pagina, 20));
  }

  @PostMapping
  public ResponseEntity<PedidoResponse> criar(@Valid @RequestBody CriarPedidoRequest req) {
    PedidoResponse criado = service.criar(req);
    return ResponseEntity.created(URI.create("/pedidos/" + criado.id())).body(criado);   // 201 + Location
  }
}
```

- `@RestController` = `@Controller` + `@ResponseBody` (retorno vira JSON via **Jackson**).
- `@PathVariable`, `@RequestParam`, `@RequestBody`, `@RequestHeader`.
- **`ResponseEntity`** para controlar status e headers.

Por baixo, o **`DispatcherServlet`** (padrão **Front Controller**) recebe todas as requisições e despacha para o método certo.

---

## 3. Validação: Bean Validation

```java
public record CriarPedidoRequest(
    @NotNull Long clienteId,
    @NotEmpty List<@Valid ItemRequest> itens,
    @Email String emailNotificacao
) {}
```
Com **`@Valid`** no parâmetro, o Spring valida antes de entrar no método; se falhar, lança `MethodArgumentNotValidException` → 400. Anotações: `@NotNull`, `@NotBlank`, `@Size`, `@Min`, `@Positive`, `@Email`, `@Pattern`, `@Past`… (especificação **Jakarta Bean Validation**, implementação **Hibernate Validator**).

---

## 4. Tratamento de erro centralizado

```java
@RestControllerAdvice
public class TratadorDeErros {

  @ExceptionHandler(PedidoNaoEncontradoException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ProblemDetail naoEncontrado(PedidoNaoEncontradoException e) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ProblemDetail validacao(MethodArgumentNotValidException e) { ... }   // 400 com campos
}
```
- **`@ControllerAdvice`/`@RestControllerAdvice`**: um lugar só que traduz exceções em respostas (equivalente ao exception filter do Nest).
- **`ProblemDetail`** (Spring 6): formato padrão de erro da **RFC 7807/9457** (`type`, `title`, `status`, `detail`).
- O service lança **exceção de domínio**, sem saber de HTTP.

---

## 5. JPA, Hibernate e Spring Data

- **JPA** (*Jakarta Persistence API*): a **especificação** de ORM do Java (as anotações e interfaces).
- **Hibernate**: a **implementação** mais usada da JPA.
- **Spring Data JPA**: camada do Spring que **gera repositórios** automaticamente.

```java
@Entity
@Table(name = "pedidos")
public class Pedido {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  private Cliente cliente;

  @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ItemPedido> itens = new ArrayList<>();

  @Enumerated(EnumType.STRING)
  private Status status;

  protected Pedido() {}          // JPA exige construtor sem argumentos
}

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
  List<Pedido> findByClienteIdAndStatus(Long clienteId, Status status);   // query derivada do NOME

  @Query("select p from Pedido p join fetch p.itens where p.id = :id")
  Optional<Pedido> buscarComItens(Long id);
}
```
Você só declara a interface; o Spring cria a implementação (é um proxy). `JpaRepository` já tem `save`, `findById`, `findAll(Pageable)`, `delete`…

---

## 6. Persistence Context e Dirty Checking

O **persistence context** (gerenciado pelo `EntityManager`) é um "cache de primeiro nível" das entidades carregadas **dentro da transação**.

- Entidade carregada fica **gerenciada** (*managed*).
- **Dirty checking**: ao fim da transação, o Hibernate compara as entidades gerenciadas com o estado original e **gera os `UPDATE` sozinho**:
```java
@Transactional
public void pagar(Long id) {
  Pedido p = repo.findById(id).orElseThrow();
  p.marcarComoPago();        // nenhum save() chamado...
}                            // ...mas no commit, o Hibernate faz o UPDATE
```
- Estados da entidade: **transient** (nova, não persistida), **managed**, **detached** (fora do contexto), **removed**.

---

## 7. Lazy vs Eager, N+1

- **LAZY**: o relacionamento só é buscado **quando acessado** (o Hibernate coloca um proxy no lugar).
- **EAGER**: buscado **junto**, sempre.

Padrões da JPA: `@ManyToOne` e `@OneToOne` são **EAGER**; `@OneToMany` e `@ManyToMany` são **LAZY**.
Boa prática: **tudo LAZY** e buscar explicitamente o que cada caso de uso precisa.

### Problema N+1
```java
List<Pedido> pedidos = repo.findAll();                   // 1 query
pedidos.forEach(p -> p.getCliente().getNome());          // +1 query POR pedido → N queries
```
Soluções:
- **`JOIN FETCH`** na query JPQL.
- **`@EntityGraph(attributePaths = "cliente")`** no método do repositório.
- `@BatchSize` / `hibernate.default_batch_fetch_size`: busca os relacionamentos em lote (`WHERE id IN (...)`).
- **Projeção direto para DTO** (`select new ...` ou interface projection) quando é só leitura.

Detecte ativando log do SQL ou estatísticas do Hibernate (e em teste, contando queries).

### LazyInitializationException
Acessar um relacionamento LAZY **depois** que a transação/sessão fechou (ex: no controller) lança essa exceção. A solução correta é **buscar o que precisa dentro do service** (fetch join, entity graph, DTO), não mudar tudo para EAGER.

O Spring Boot vem com **`spring.jpa.open-in-view=true`** por padrão (mantém a sessão aberta até o fim da requisição, "resolvendo" a exceção). É considerado **anti-padrão**: esconde N+1 e segura conexão do banco durante a renderização. Muitos times desligam.

---

## 8. @Transactional a fundo

```java
@Transactional                          // no service, não no controller nem no repository
public PedidoResponse criar(CriarPedidoRequest req) { ... }

@Transactional(readOnly = true)         // leitura: otimizações (sem dirty checking, flush)
public PedidoResponse buscar(Long id) { ... }
```

- Funciona via **proxy** (aula 01) → **self-invocation não abre transação**; método precisa ser público.
- **Rollback**: por padrão só em **unchecked** (`RuntimeException`) e `Error`. Exceção **checked** faz **commit**! Use `rollbackFor = Exception.class` se necessário.
- Se você **captura** a exceção dentro do método e não relança, não há rollback.
- **Propagação**: `REQUIRED` (padrão: usa a existente ou cria), `REQUIRES_NEW` (sempre cria uma nova, suspendendo a atual; útil para log de auditoria que deve ser salvo mesmo se a principal falhar).
- **Isolamento** (`isolation`): controla o que uma transação enxerga das outras (aula de banco em Fundamentos).
- Não faça **chamadas HTTP externas** dentro de transação (segura conexão e locks).

---

## 9. Como falar na entrevista

**"O que é o problema N+1 e como resolver com JPA?"**
> "É quando busco uma lista com uma query e depois, ao acessar um relacionamento lazy de cada item, o Hibernate faz uma query por item: 1 mais N. Detecto com log de SQL ou estatísticas do Hibernate. Resolvo com join fetch ou entity graph quando preciso do relacionamento, batch size pra buscar em lote, ou projetando direto pra DTO quando é só leitura. Mantenho os relacionamentos lazy por padrão e não confio no open-in-view."

**"Um @Transactional não está fazendo rollback. Por quê?"**
> "Os suspeitos: chamada interna na mesma classe, que não passa pelo proxy; método não público; exceção checked, porque por padrão o rollback é só em unchecked; ou a exceção foi capturada e engolida dentro do método."

---

## 10. Resumo

- Camadas: **RestController → Service → Repository**; DTO/record na borda.
- `@GetMapping`, `@PathVariable`, `@RequestBody`, **`ResponseEntity`**; DispatcherServlet.
- **Bean Validation** com `@Valid` → 400.
- **`@RestControllerAdvice`** + **`ProblemDetail`**.
- **JPA** (especificação) / **Hibernate** (implementação) / **Spring Data** (repositórios gerados, queries derivadas).
- **Persistence context**, **dirty checking**, estados da entidade.
- **LAZY por padrão**; **N+1** → join fetch, entity graph, batch, DTO; **LazyInitializationException**; open-in-view é anti-padrão.
- **@Transactional**: proxy (self-invocation), rollback só unchecked, propagação, `readOnly`.

## Termos desta aula
REST · @RestController · @RequestMapping · @GetMapping · @PathVariable · @RequestParam · @RequestBody · ResponseEntity · Jackson · DispatcherServlet · Front Controller · Bean Validation · @Valid · Hibernate Validator · @RestControllerAdvice · @ExceptionHandler · ProblemDetail · RFC 7807 · JPA · Hibernate · Spring Data JPA · @Entity · JpaRepository · query derivada · JPQL · @Query · Pageable · EntityManager · persistence context · dirty checking · managed · detached · LAZY · EAGER · N+1 · JOIN FETCH · @EntityGraph · @BatchSize · projeção · LazyInitializationException · open-in-view · @Transactional · rollback · propagação · REQUIRES_NEW · readOnly · isolamento

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 02** e separadas por nível.
