# Aula 03 — Event Loop em profundidade

> **Objetivo:** explicar o que é o Event Loop, quais são as fases dele, o que são microtasks e macrotasks, e conseguir prever a ordem de execução de um código. É a pergunta de Node **mais cobrada** em entrevista.

---

## 1. O que é o Event Loop

O **Event Loop** é um laço (loop) que fica rodando enquanto o processo Node estiver vivo. A cada volta ele pergunta:

> "A call stack está vazia? Tem algum callback pronto pra executar? Então executa."

Ele é implementado pela **libuv**. É ele que faz a ponte entre "o I/O terminou" e "o seu callback rodar".

Quando o Event Loop não tem mais nada pra fazer (nenhum timer, nenhuma conexão aberta, nenhum I/O pendente), o processo Node **termina**. É por isso que um script simples encerra sozinho, mas um servidor HTTP fica rodando: o servidor mantém uma conexão escutando, então sempre tem "algo pendente".

---

## 2. As fases do Event Loop

Cada volta do loop (chamada de **tick**) passa por fases, cada uma com a **sua própria fila** de callbacks:

```
   ┌───────────────────────────┐
┌─▶│          timers           │  setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  alguns callbacks de sistema adiados
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  uso interno
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  espera e executa callbacks de I/O
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  socket.on('close'), etc.
   └───────────────────────────┘
```

As que importam de verdade:

### timers
Executa callbacks de `setTimeout` e `setInterval` cujo tempo **já passou**.

> Importante: `setTimeout(fn, 100)` **não** garante rodar em exatamente 100ms. Garante que vai rodar **depois de pelo menos** 100ms, quando o loop chegar na fase timers e a pilha estiver livre. Se a thread estiver ocupada, atrasa.

### poll
A fase mais importante. Aqui o Node:
1. Executa callbacks de I/O que ficaram prontos (resposta do banco, leitura de arquivo, dados de socket).
2. Se não tem nada, **espera** por novos eventos de I/O (sem gastar CPU), até algum timer vencer ou ter `setImmediate` agendado.

### check
Executa os callbacks de `setImmediate`. Ela vem **logo depois** do poll. Por isso `setImmediate` é o jeito de dizer "roda isso assim que terminar o I/O atual".

### close callbacks
Callbacks de fechamento, como `socket.on('close', ...)`.

---

## 3. Microtasks: as "furadoras de fila"

Além das fases, existem duas filas especiais com **prioridade máxima**:

1. **`process.nextTick` queue**: callbacks de `process.nextTick()`.
2. **Microtask queue**: callbacks de **Promises** (`.then`, `.catch`, `.finally`, e o que vem depois de um `await`) e `queueMicrotask()`.

Regra:
> Depois de **cada** callback executado (em qualquer fase), o Node **esvazia totalmente** a fila do `nextTick` e depois a fila de microtasks, **antes** de seguir pro próximo callback ou fase.

Ordem de prioridade:
```
código síncrono atual
  → process.nextTick
    → Promises (microtasks)
      → próxima macrotask (timers, I/O, setImmediate…)
```

Os callbacks das fases (timers, I/O, check) são chamados de **macrotasks**.

---

## 4. Exercício: qual a ordem?

```js
console.log('A');

setTimeout(() => console.log('B - timeout'), 0);

setImmediate(() => console.log('C - immediate'));

Promise.resolve().then(() => console.log('D - promise'));

process.nextTick(() => console.log('E - nextTick'));

console.log('F');
```

Resposta:
```
A
F
E - nextTick
D - promise
B - timeout      ┐ esses dois podem trocar de ordem
C - immediate    ┘ (veja abaixo)
```

Explicação:
1. **A** e **F**: código síncrono roda primeiro, sempre.
2. A pilha esvazia → roda a fila do **nextTick** (**E**).
3. Depois as **microtasks/Promises** (**D**).
4. Aí o Event Loop começa as fases: timers (**B**) e check (**C**).

### A pegadinha do `setTimeout(0)` vs `setImmediate`
No código principal, a ordem entre eles é **não determinística**: depende de quanto tempo levou pra iniciar o loop (o `setTimeout(0)` na verdade vira 1ms).

Mas **dentro de um callback de I/O**, `setImmediate` **sempre** roda antes:

```js
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});
// sempre: immediate, timeout
```

Porque depois do poll (onde o callback de I/O rodou) vem o check (setImmediate), e só na próxima volta vem timers.

---

## 5. async/await no Event Loop

`await` é açúcar sintático em cima de Promises. Tudo que vem **depois** de um `await` vira uma microtask.

```js
async function exemplo() {
  console.log('1');
  await null;
  console.log('3');
}

exemplo();
console.log('2');
```

Saída: `1, 2, 3`. A função pausa no `await`, devolve o controle, o código síncrono segue (`2`), e o resto da função roda como microtask.

---

## 6. Starvation: quando as microtasks travam o loop

Como as microtasks são esvaziadas **totalmente** antes de seguir, se você ficar criando microtask infinitamente, o loop **nunca** avança pras fases de I/O:

```js
function loop() {
  process.nextTick(loop); // nunca deixa o Event Loop seguir
}
loop();
```

O servidor para de responder, mesmo sem nenhum `for` pesado. Isso se chama **starvation** (inanição) do Event Loop. O mesmo pode acontecer com Promises recursivas.

---

## 7. Bloquear o Event Loop: o pecado capital

Resumindo tudo que vimos: **o Event Loop só avança quando a call stack esvazia**. Então qualquer coisa que ocupe a thread por muito tempo trava tudo:

- Loops pesados (CPU-bound).
- Métodos `*Sync` (`readFileSync`, `pbkdf2Sync`).
- `JSON.parse`/`JSON.stringify` de objetos gigantes.
- Regex mal escrita com textos grandes (**ReDoS**, *Regular expression Denial of Service*).
- Ordenar/filtrar arrays enormes.

Como detectar:
- Métrica de **event loop lag / delay** (`perf_hooks.monitorEventLoopDelay()`, APMs como Datadog e New Relic).
- Sintoma: **todas** as rotas ficam lentas ao mesmo tempo, CPU a 100% em um core.

Como resolver:
- Tornar assíncrono (usar a versão sem `Sync`).
- Quebrar o trabalho em pedaços (*chunking*) com `setImmediate` entre eles.
- Mover pra **Worker Threads** ou pra uma **fila** com workers separados (aulas 09 e 11).

---

## 8. Como falar na entrevista

**"Explique o Event Loop."**
> "O Event Loop é o mecanismo, implementado pela libuv, que permite ao Node executar operações não bloqueantes com uma única thread de JavaScript. O I/O é delegado pro sistema operacional ou pro thread pool, e quando termina o callback entra numa fila. O loop passa por fases, principalmente timers, poll, que é onde os callbacks de I/O rodam, e check, que é onde roda o setImmediate. Entre cada callback, o Node esvazia a fila de process.nextTick e a de microtasks, que são as Promises. Por isso uma Promise resolvida sempre executa antes de um setTimeout de zero. E o ponto crítico é: como tudo depende da call stack esvaziar, código síncrono pesado bloqueia o loop e degrada a latência de todas as requisições."

---

## 9. Resumo

- Event Loop = laço da libuv que executa callbacks quando a pilha está vazia.
- Fases principais: **timers → poll → check** (+ pending e close).
- **nextTick** > **Promises (microtasks)** > **macrotasks**.
- Microtasks são esvaziadas depois de **cada** callback.
- `setTimeout(fn, 0)` não é imediato; é "no mínimo depois de ~1ms".
- Dentro de I/O, `setImmediate` roda antes de `setTimeout(0)`.
- Bloquear o loop (CPU, `*Sync`, JSON gigante, ReDoS) trava tudo.

## Termos desta aula
event loop · tick · fases · timers · poll · check · macrotask · microtask · process.nextTick · setImmediate · queueMicrotask · starvation · event loop lag · ReDoS · chunking

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 03** e separadas por nível.
