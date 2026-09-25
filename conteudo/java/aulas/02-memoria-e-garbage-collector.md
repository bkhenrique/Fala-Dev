# Aula 02 — Memória: Stack, Heap, tipos e Garbage Collector

> **Objetivo:** entender onde cada coisa fica na memória, a diferença entre tipos primitivos e de referência, por que "Java é sempre passagem por valor", e como o Garbage Collector funciona.

---

## 1. As áreas de memória da JVM

```
┌────────────────────── JVM ──────────────────────┐
│                                                   │
│  STACK (uma por thread)      HEAP (compartilhado) │
│  ┌──────────────┐            ┌──────────────────┐ │
│  │ frame main() │            │  objetos          │ │
│  │  idade = 30  │            │  new Pedido(...)  │ │
│  │  pedido ─────┼──────────▶ │  Strings, arrays  │ │
│  ├──────────────┤            └──────────────────┘ │
│  │ frame calc() │                                  │
│  └──────────────┘            METASPACE             │
│                              (metadados de classes)│
└───────────────────────────────────────────────────┘
```

### Stack (pilha)
- **Uma por thread.**
- Cada chamada de método cria um **frame** com as **variáveis locais** e parâmetros.
- Guarda **valores primitivos** e **referências** (endereços) para objetos.
- Liberada automaticamente quando o método termina (LIFO).
- Rápida e pequena. Recursão infinita → **`StackOverflowError`**.

### Heap
- **Compartilhado** entre todas as threads.
- Onde ficam **todos os objetos** (`new ...`), arrays, Strings.
- Gerenciado pelo **Garbage Collector**.
- Sem espaço → **`OutOfMemoryError: Java heap space`**.
- Tamanho configurado com `-Xms` (inicial) e `-Xmx` (máximo).

### Metaspace
- Guarda **metadados das classes** (estrutura, métodos). Substituiu a antiga *PermGen* no Java 8.

> Frase pra entrevista: "Variáveis locais e referências ficam na stack; os objetos ficam no heap."

---

## 2. Tipos primitivos vs tipos de referência

### Os 8 primitivos
`byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`.
- Guardam o **valor direto**.
- Não são objetos, não podem ser `null`, são rápidos.

### Tipos de referência
Tudo o resto: classes, interfaces, arrays, `String`, `Integer`…
- A variável guarda uma **referência** (endereço) para o objeto no heap.
- Podem ser `null` → acessar gera **`NullPointerException`**.

```java
int a = 10;
int b = a;       // copia o VALOR
b = 20;          // a continua 10

Pedido p1 = new Pedido(100);
Pedido p2 = p1;  // copia a REFERÊNCIA: os dois apontam pro MESMO objeto
p2.setTotal(200);
System.out.println(p1.getTotal()); // 200
```

### Wrappers e autoboxing
Cada primitivo tem uma classe **wrapper**: `Integer`, `Long`, `Double`, `Boolean`… Necessárias em coleções (`List<Integer>`, não existe `List<int>`).

**Autoboxing/unboxing**: conversão automática entre `int` e `Integer`.

Pegadinhas:
```java
Integer x = 127, y = 127;
x == y;          // true  (cache de -128 a 127)
Integer m = 128, n = 128;
m == n;          // false! compara REFERÊNCIA
m.equals(n);     // true  ← o certo

Integer nulo = null;
int valor = nulo; // NullPointerException no unboxing
```
Regra: **compare objetos com `equals`, não `==`**.

---

## 3. Java é sempre passagem por valor

Pergunta clássica. Resposta: **Java é sempre pass-by-value**. Para objetos, o que é copiado é **o valor da referência**.

```java
void alterar(Pedido p) {
  p.setTotal(999);        // altera o objeto apontado → quem chamou VÊ a mudança
  p = new Pedido(0);      // troca a cópia LOCAL da referência → quem chamou NÃO vê
}
```

Você consegue **mexer no objeto** através da referência copiada, mas **não consegue fazer a variável de quem chamou apontar para outro objeto**. Isso prova que não é passagem por referência.

---

## 4. Garbage Collector (GC)

Em C, você aloca e **libera** memória manualmente (`malloc`/`free`). Esquecer = vazamento; liberar duas vezes = crash.

Em Java, o **Garbage Collector** libera automaticamente objetos **inalcançáveis**: que não têm mais nenhuma referência vinda das **GC roots** (variáveis locais nas stacks, campos estáticos, threads ativas).

```java
Pedido p = new Pedido();
p = null;           // o objeto antigo ficou inalcançável → elegível para GC
```

### Hipótese geracional
"A maioria dos objetos morre jovem" (objetos temporários de uma requisição). Por isso o heap é dividido:

```
HEAP
├── Young Generation
│    ├── Eden          ← objetos novos nascem aqui
│    ├── Survivor S0   ← sobreviventes de coletas
│    └── Survivor S1
└── Old Generation     ← objetos que sobreviveram várias coletas (caches, singletons)
```

- **Minor GC**: coleta a young generation. Frequente e rápida.
- **Major/Full GC**: coleta a old generation (ou tudo). Mais rara e mais cara.

### Stop-the-world
Algumas fases do GC **pausam todas as threads da aplicação**. Pausas longas = **picos de latência** (o p99 da API sobe). Coletores modernos reduzem isso.

### Coletores
| Coletor | Característica |
|---|---|
| **Serial** | Uma thread; para apps pequenas |
| **Parallel** | Várias threads; foca em throughput |
| **G1** (padrão desde Java 9) | Divide o heap em regiões; equilíbrio entre throughput e pausas |
| **ZGC** / **Shenandoah** | Pausas de **milissegundos**, mesmo com heaps enormes; para baixa latência |

---

## 5. Memory leak em Java

"Se tem GC, não existe vazamento de memória?" **Existe.** O GC só libera o que é **inalcançável**. Se você mantém referência para algo que não usa mais, ele nunca é coletado.

Causas comuns:
- **Coleções estáticas** que só crescem (`static Map` usado como cache sem limite).
- **Listeners** registrados e nunca removidos.
- **ThreadLocal** não limpo em pool de threads.
- Recursos não fechados (conexões, streams) → use **try-with-resources** (aula 07).

Como investigar: métricas de heap (sobe e não volta depois do GC), **heap dump** (`jmap`, `-XX:+HeapDumpOnOutOfMemoryError`) analisado no **Eclipse MAT** ou VisualVM, **JFR** (*Java Flight Recorder*).

---

## 6. Como falar na entrevista

**"Explique stack e heap."**
> "A stack é por thread e guarda os frames de cada chamada de método, com variáveis locais, primitivos e referências; é liberada quando o método termina. O heap é compartilhado e guarda os objetos, e é gerenciado pelo garbage collector, que libera objetos inalcançáveis a partir das GC roots. O heap é geracional porque a maioria dos objetos morre cedo: minor GCs frequentes na young generation e coletas mais caras na old. Coletores como G1, que é o padrão, e ZGC reduzem as pausas stop-the-world que afetam a latência."

---

## 7. Resumo

- **Stack**: por thread, frames, primitivos e **referências**; `StackOverflowError`.
- **Heap**: compartilhado, **objetos**, GC; `OutOfMemoryError`; `-Xmx`.
- **Metaspace**: metadados de classes.
- 8 **primitivos** × **referências**; wrappers + **autoboxing**; `==` vs **`equals`**; cache de Integer.
- **Sempre passagem por valor** (o valor da referência).
- **GC**: coleta inalcançáveis; **young/old**; minor/major; **stop-the-world**; G1 (padrão), ZGC.
- **Memory leak** existe: referência esquecida. Heap dump para investigar.

## Termos desta aula
stack · frame · heap · metaspace · PermGen · StackOverflowError · OutOfMemoryError · -Xmx · primitivo · tipo de referência · null · NullPointerException · wrapper · autoboxing · unboxing · Integer cache · equals · pass-by-value · garbage collector · GC roots · inalcançável · hipótese geracional · young generation · Eden · survivor · old generation · minor GC · full GC · stop-the-world · G1 · ZGC · memory leak · heap dump · JFR

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 02** e separadas por nível.
