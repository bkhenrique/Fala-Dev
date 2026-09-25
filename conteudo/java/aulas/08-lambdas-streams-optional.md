# Aula 08 — Programação funcional em Java: Lambdas, Streams e Optional

> **Objetivo:** entender o que o Java 8 trouxe de programação funcional: lambdas, interfaces funcionais, method references, a Streams API (e como ela executa), e o uso certo do `Optional`.

---

## 1. Por que isso existe

Antes do Java 8, passar um "pedaço de comportamento" exigia **classe anônima**:
```java
Collections.sort(pedidos, new Comparator<Pedido>() {
  @Override
  public int compare(Pedido a, Pedido b) {
    return Double.compare(a.getTotal(), b.getTotal());
  }
});
```
Muito código para dizer "ordene por total". O Java 8 (2014) trouxe elementos de **programação funcional**:
```java
pedidos.sort(Comparator.comparing(Pedido::getTotal));
```

**Programação funcional**, em resumo: tratar **funções como valores** (passar, retornar), preferir **funções puras** (sem efeitos colaterais) e **imutabilidade**, e descrever **o que** fazer (declarativo) em vez de **como** (imperativo).

---

## 2. Lambdas

**Lambda** é uma **função anônima**, escrita de forma curta:
```java
(a, b) -> a + b
x -> x * 2
() -> System.out.println("oi")
(String s) -> { var t = s.trim(); return t.toUpperCase(); }
```

Regras:
- Uma lambda só pode ser usada onde se espera uma **interface funcional**.
- Pode usar variáveis de fora apenas se forem **efetivamente finais** (não reatribuídas). Isso evita confusão com concorrência.

---

## 3. Interfaces funcionais

**Interface funcional** = interface com **um único método abstrato** (pode ter `default`s). Marcada opcionalmente com `@FunctionalInterface`.

As principais do pacote `java.util.function`:

| Interface | Assinatura | Uso |
|---|---|---|
| `Function<T, R>` | `T → R` | Transformar |
| `Predicate<T>` | `T → boolean` | Filtrar/testar |
| `Consumer<T>` | `T → void` | Consumir (efeito colateral) |
| `Supplier<T>` | `() → T` | Fornecer/criar sob demanda |
| `BiFunction<T, U, R>` | `(T, U) → R` | Duas entradas |
| `UnaryOperator<T>` | `T → T` | Transformar no mesmo tipo |

Outras que você já conhece: `Runnable`, `Callable`, `Comparator`.

### Method references
Atalho quando a lambda só chama um método existente:
```java
x -> x.getNome()          ≡  Pedido::getNome            // método de instância do parâmetro
s -> Integer.parseInt(s)  ≡  Integer::parseInt          // método estático
x -> logger.info(x)       ≡  logger::info               // método de um objeto específico
() -> new ArrayList<>()   ≡  ArrayList::new             // construtor
```

---

## 4. Streams API

**Stream** é uma **sequência de elementos** sobre a qual você monta um **pipeline** de operações de forma declarativa.

```java
Map<String, Double> totalPorCliente = pedidos.stream()
    .filter(p -> p.getStatus() == Status.PAGO)                 // intermediária
    .filter(p -> p.getData().getYear() == 2026)                // intermediária
    .collect(Collectors.groupingBy(
        Pedido::getCliente,
        Collectors.summingDouble(Pedido::getTotal)));           // terminal
```

### Estrutura de um pipeline
1. **Fonte**: `lista.stream()`, `Stream.of(...)`, `Arrays.stream(...)`, `Files.lines(...)`.
2. **Operações intermediárias**: retornam outro Stream. `filter`, `map`, `flatMap`, `sorted`, `distinct`, `limit`, `skip`, `peek`.
3. **Operação terminal**: produz o resultado e **dispara a execução**. `collect`, `toList()`, `forEach`, `reduce`, `count`, `sum`, `anyMatch`, `findFirst`, `min`, `max`.

### Lazy (preguiçoso)
As intermediárias **não executam nada** até existir uma terminal. E a execução é **por elemento**, atravessando o pipeline inteiro, o que permite **curto-circuito**:
```java
pedidos.stream()
    .filter(p -> p.getTotal() > 1000)
    .findFirst();        // para no PRIMEIRO que passar; não filtra a lista toda
```

### Outras características
- Um stream **não pode ser reutilizado** depois da operação terminal.
- **Não modifica a fonte** (produz resultado novo).
- `map` transforma 1→1; **`flatMap`** transforma 1→N e "achata" (ex: pedidos → todos os itens de todos os pedidos).
- Streams de primitivos (`IntStream`, `mapToDouble`) evitam boxing e têm `sum()`, `average()`.

### Collectors úteis
`toList()`, `toSet()`, `toMap(k, v)`, `groupingBy`, `partitioningBy` (divide em true/false), `joining(", ")`, `counting()`, `summingDouble`, `averagingInt`.

### Parallel streams
`lista.parallelStream()` divide o trabalho entre núcleos (usando o **ForkJoinPool comum**). Cuidados:
- Só compensa com **muitos dados** e **operações pesadas de CPU**.
- **Nunca** com operações bloqueantes (I/O) ou efeitos colaterais em estado compartilhado.
- Compartilha um pool global com o resto da aplicação.
Na dúvida, **não use**.

### Stream vs for
Streams deixam transformações/agrupamentos **mais legíveis**. Mas um `for` simples pode ser mais claro para lógica com muitos passos, `break`, exceções checked ou efeitos colaterais. Legibilidade é o critério.

---

## 5. Optional

`Optional<T>` é um **contêiner** que pode ter ou não um valor. Serve para deixar **explícito no tipo** que um método **pode não retornar nada**, em vez de retornar `null`.

```java
Optional<Usuario> buscarPorEmail(String email);

String nome = repo.buscarPorEmail(email)
    .map(Usuario::getNome)
    .orElse("Visitante");

Usuario u = repo.buscarPorEmail(email)
    .orElseThrow(() -> new UsuarioNaoEncontradoException(email));
```

Métodos: `isPresent`/`isEmpty`, `ifPresent`, `map`, `flatMap`, `filter`, `orElse`, `orElseGet`, `orElseThrow`.

### Usar bem
- ✅ Como **tipo de retorno** de métodos que podem não achar algo.
- ❌ **Não** use em **atributos**, **parâmetros** de método ou em coleções (`List<Optional<X>>`). Não foi feito para isso (e não é serializável).
- ❌ `optional.get()` sem checar é só um NPE com outro nome.
- `orElse(x)` **sempre avalia** `x`; se criar o valor padrão é caro, use **`orElseGet(() -> ...)`** (lazy).
- Para coleções, retorne **lista vazia**, não `Optional<List>`.

---

## 6. Como falar na entrevista

**"Explique Streams no Java."**
> "Stream é uma API declarativa pra processar sequências: uma fonte, operações intermediárias como filter, map e flatMap, e uma operação terminal, como collect ou findFirst. As intermediárias são lazy: nada executa até a terminal, e a execução passa elemento por elemento pelo pipeline, o que permite curto-circuito. O stream não modifica a fonte e não pode ser reusado. Parallel stream eu uso com muito cuidado: só pra CPU pesada com muitos dados, nunca com I/O, porque usa o ForkJoinPool comum."

**"Como você usa Optional?"**
> "Como retorno de método que pode não ter resultado, pra deixar isso explícito no tipo em vez de devolver null. Não uso em atributo nem parâmetro, evito get sem checar, e prefiro orElseGet quando o valor padrão é caro de criar."

---

## 7. Resumo

- Java 8: **lambdas**, **interfaces funcionais**, **method references**, **Streams**, **Optional**.
- Lambda só onde se espera **interface funcional** (um método abstrato); variáveis **efetivamente finais**.
- `Function`, `Predicate`, `Consumer`, `Supplier`.
- Stream: **fonte → intermediárias (lazy) → terminal**; curto-circuito; não reutilizável; não altera a fonte.
- `map` × **`flatMap`**; Collectors (`groupingBy`, `toMap`, `joining`...).
- **Parallel stream**: só CPU-bound com muito dado, sem I/O.
- **Optional**: só como **retorno**; `orElseGet` vs `orElse`; nada de `get()` cego.

## Termos desta aula
programação funcional · função pura · efeito colateral · declarativo · imperativo · classe anônima · lambda · efetivamente final · interface funcional · @FunctionalInterface · Function · Predicate · Consumer · Supplier · method reference · Stream · pipeline · operação intermediária · operação terminal · lazy evaluation · curto-circuito · map · flatMap · filter · reduce · Collectors · groupingBy · partitioningBy · parallel stream · ForkJoinPool · Optional · orElse · orElseGet · orElseThrow

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 08** e separadas por nível.
