# Aula 09 — Concorrência: Threads, sincronização, Executors, CompletableFuture e Virtual Threads

> **Objetivo:** entender como o Java executa coisas em paralelo, os problemas clássicos (race condition, deadlock, visibilidade), as ferramentas para resolvê-los, e como as Virtual Threads mudaram o jogo.

---

## 1. O modelo do Java é diferente do Node

- **Node**: uma thread de JS + Event Loop + I/O não bloqueante.
- **Java (tradicional)**: **várias threads de verdade**, cada requisição HTTP atendida por uma thread (**thread-per-request**, ex: Tomcat com pool de 200 threads). O código é **bloqueante** e simples de ler, e o paralelismo é real (vários núcleos).

O preço: com várias threads mexendo na **mesma memória** (o heap é compartilhado, aula 02), surgem problemas que no Node quase não existem.

---

## 2. Criando threads

```java
Thread t = new Thread(() -> System.out.println("rodando em " + Thread.currentThread().getName()));
t.start();     // start() cria a thread; run() direto executaria na thread atual!
t.join();      // espera terminar
```

- **`Runnable`**: tarefa sem retorno (`void run()`).
- **`Callable<T>`**: tarefa **com retorno** e que pode lançar exceção checked.

Mas criar `new Thread` na mão é raro em produção: threads de sistema são **caras** (cada uma reserva memória de stack, na casa de 1 MB, e a troca entre elas custa). Por isso usamos **pools**.

---

## 3. ExecutorService e thread pools

```java
ExecutorService pool = Executors.newFixedThreadPool(10);

Future<Relatorio> futuro = pool.submit(() -> gerarRelatorio());   // Callable
Relatorio r = futuro.get(5, TimeUnit.SECONDS);                    // bloqueia até ter o resultado

pool.shutdown();
```

- **Thread pool**: um conjunto fixo de threads reaproveitadas que pegam tarefas de uma **fila**.
- Evita o custo de criar/destruir threads e **limita** quantas rodam ao mesmo tempo (protege a máquina).
- **`Future`**: representa um resultado que ainda vai existir (parecido com Promise, mas o `get()` **bloqueia**).
- Tipos: `newFixedThreadPool`, `newCachedThreadPool`, `newScheduledThreadPool`, `newVirtualThreadPerTaskExecutor` (Java 21).

Dimensionamento (regra de bolso): tarefas **CPU-bound** ≈ número de núcleos; tarefas **I/O-bound** podem ter muito mais threads, porque passam a maior parte do tempo esperando.

---

## 4. Os problemas clássicos

### Race condition (condição de corrida)
Quando o resultado depende da **ordem** em que as threads executam:
```java
class Contador {
  private int valor = 0;
  void incrementar() { valor++; }   // NÃO é atômico: ler → somar → escrever
}
```
Duas threads leem `5` ao mesmo tempo, as duas escrevem `6`. Um incremento **se perdeu**.

A parte do código que acessa estado compartilhado e não pode ser executada por duas threads ao mesmo tempo é a **seção crítica**.

### Visibilidade
Cada núcleo tem **cache**. Uma thread pode não "ver" a alteração que outra fez numa variável (continua lendo o valor antigo do cache). O **Java Memory Model** define regras de ***happens-before*** que garantem quando uma escrita fica visível para outra thread.

### Deadlock
Duas (ou mais) threads esperando **uma pela outra** para sempre:
```
Thread 1: trava A → espera B
Thread 2: trava B → espera A        → ninguém anda
```
Prevenção: **sempre adquirir locks na mesma ordem**, usar timeout (`tryLock`), manter seções críticas pequenas.

Outros: **starvation** (uma thread nunca consegue o recurso), **livelock** (threads reagem uma à outra e não progridem).

---

## 5. Ferramentas de sincronização

| Ferramenta | O que garante |
|---|---|
| **`synchronized`** | Exclusão mútua (uma thread por vez no bloco) **+ visibilidade** |
| **`volatile`** | Só **visibilidade** (leitura sempre da memória principal); **não** torna `x++` atômico |
| **Atomic*** (`AtomicInteger`, `AtomicLong`, `LongAdder`) | Operações atômicas sem lock (CAS, *compare-and-swap*) |
| **`ReentrantLock`** | Lock explícito com `tryLock`, timeout, fairness |
| **`ReadWriteLock`** | Várias leituras simultâneas, escrita exclusiva |
| **Coleções concorrentes** | `ConcurrentHashMap`, `BlockingQueue`… (aula 06) |
| **`CountDownLatch`, `Semaphore`** | Coordenar (esperar N tarefas; limitar N acessos simultâneos) |

```java
class Contador {
  private final AtomicInteger valor = new AtomicInteger();
  void incrementar() { valor.incrementAndGet(); }      // ✅ atômico
}
```

**A melhor sincronização é não precisar dela**: prefira **objetos imutáveis**, **não compartilhar estado** (cada thread com seus dados), e estruturas concorrentes prontas.

Relevante para Spring: **beans são singletons** e atendem várias requisições em paralelo. **Nunca guarde estado de requisição em atributo de um `@Service`.**

---

## 6. CompletableFuture: composição assíncrona

`Future` bloqueia no `get()`. **`CompletableFuture`** (Java 8) permite **encadear** etapas sem bloquear, como Promises:
```java
CompletableFuture<Usuario> usuario = CompletableFuture.supplyAsync(() -> buscarUsuario(id), pool);
CompletableFuture<List<Pedido>> pedidos = CompletableFuture.supplyAsync(() -> buscarPedidos(id), pool);

CompletableFuture<Painel> painel = usuario.thenCombine(pedidos, Painel::new)   // junta os dois
    .orTimeout(3, TimeUnit.SECONDS)
    .exceptionally(erro -> Painel.vazio());                                     // fallback

CompletableFuture.allOf(a, b, c).join();                                        // como Promise.all
```
Métodos: `thenApply` (map), `thenCompose` (flatMap), `thenCombine`, `allOf`, `anyOf`, `exceptionally`, `handle`.
Cuidado: sem passar um executor, usa o **ForkJoinPool comum**, que não é bom para I/O bloqueante.

---

## 7. Virtual Threads (Java 21)

O problema do thread-per-request: threads de sistema são caras, então um servidor tem, digamos, 200. Se cada requisição passa 95% do tempo **esperando** banco/API, as 200 threads ficam ocupadas **esperando**, e a requisição 201 espera na fila. A saída era **programação reativa** (WebFlux, Reactor): alta concorrência, mas código **difícil** de ler e depurar.

**Virtual Threads** (Projeto Loom):
- Threads **leves** gerenciadas pela **JVM**, não pelo sistema operacional.
- Dá pra ter **milhões**.
- Quando uma virtual thread faz I/O bloqueante, a JVM a **"desmonta"** da thread real (*carrier thread*) e usa essa thread real para outra virtual thread. Quando o I/O termina, ela é remontada.

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
  for (var url : urls) executor.submit(() -> baixar(url));   // 10.000 tarefas, sem problema
}
```
No Spring Boot 3.2+: `spring.threads.virtual.enabled=true`.

Resultado: **código bloqueante e simples**, com **escalabilidade parecida com o modelo não bloqueante** em cargas I/O-bound. É, de certa forma, o Java alcançando o que o Node faz com o Event Loop, mas sem callbacks/async.

Cuidados:
- **Não ajuda em CPU-bound** (o número de núcleos continua o mesmo).
- **Não use pool** de virtual threads (são baratas; crie uma por tarefa).
- Ainda é preciso **limitar recursos externos** (pool de conexões do banco, rate limit), senão milhares de threads derrubam o banco. Use `Semaphore`.
- Nas primeiras versões, `synchronized` com I/O dentro "prendia" a thread real (*pinning*); isso foi resolvido no Java 24.

---

## 8. Como falar na entrevista

**"O que é race condition e como evitar?"**
> "É quando o resultado depende da ordem de execução das threads acessando estado compartilhado, tipo um contador com valor++, que na verdade é ler, somar e escrever. Evito primeiro não compartilhando estado mutável: objetos imutáveis e nada de estado de requisição em bean singleton. Quando preciso compartilhar, uso classes atômicas, coleções concorrentes como ConcurrentHashMap, ou synchronized/locks numa seção crítica pequena. Volatile só resolve visibilidade, não atomicidade."

**"O que são Virtual Threads?"**
> "Threads leves gerenciadas pela JVM, do Java 21. Quando fazem I/O bloqueante, a JVM libera a thread do sistema operacional pra outra tarefa. Isso permite milhões de tarefas concorrentes mantendo código bloqueante simples, com escalabilidade próxima do modelo reativo em cargas I/O-bound. Não ajudam em CPU-bound, e ainda preciso limitar recursos externos como o pool de conexões."

---

## 9. Resumo

- Java: **várias threads reais**, thread-per-request, código bloqueante.
- `Runnable` (sem retorno) × `Callable` (com retorno); `start()` não `run()`.
- **ExecutorService / thread pool** + `Future`.
- Problemas: **race condition**, **visibilidade** (happens-before), **deadlock**, starvation.
- **`synchronized`** (exclusão + visibilidade), **`volatile`** (só visibilidade), **Atomic***, locks, coleções concorrentes.
- Melhor: **imutabilidade** e **não compartilhar estado**; beans Spring são singletons.
- **CompletableFuture**: composição assíncrona (thenApply, thenCombine, allOf).
- **Virtual Threads**: leves, milhões, I/O bloqueante barato; não para CPU-bound; limitar recursos.

## Termos desta aula
thread · concorrência · paralelismo · thread-per-request · Runnable · Callable · ExecutorService · thread pool · Future · race condition · seção crítica · atomicidade · visibilidade · Java Memory Model · happens-before · deadlock · starvation · livelock · synchronized · volatile · AtomicInteger · CAS · ReentrantLock · ReadWriteLock · Semaphore · CountDownLatch · thread-safe · CompletableFuture · thenCompose · allOf · programação reativa · WebFlux · Virtual Threads · Projeto Loom · carrier thread · pinning

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 09** e separadas por nível.
