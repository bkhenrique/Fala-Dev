# Aula 09 — Iteradores, generators e programação assíncrona

> **Objetivo:** descrever iteração e entender corrotinas sem confundi-las com threads ou paralelismo.

---

## 1. Iteráveis e iteradores

Um iterável pode produzir iterador por `iter(objeto)`. O iterador fornece valores por `next()` até levantar `StopIteration`. Laços `for` usam esse protocolo; a fonte não precisa ser uma lista materializada.

## 2. Generators

Uma função com `yield` é generator function. Chamá-la retorna um generator iterator; o corpo avança sob demanda e preserva estado entre yields. Isso pode evitar materializar uma sequência, mas não fornece automaticamente acesso por índice ou múltiplas passagens.

Generator expressions produzem uma sequência lazy. A criação e o consumo do generator ocorrem em momentos diferentes; uma exceção pode surgir ao iterar.

## 3. Corrotinas e `asyncio`

`async def` define coroutine function; chamá-la cria um objeto coroutine que precisa ser aguardado ou agendado. `await` suspende a coroutine até o resultado ficar disponível. A biblioteca `asyncio` fornece event loop, tarefas e APIs assíncronas para concorrência cooperativa, frequentemente útil em I/O.

Uma operação síncrona bloqueante dentro do event loop também bloqueia o progresso das outras tarefas. É necessário usar APIs não bloqueantes ou deslocar trabalho bloqueante de forma apropriada.

## 4. Concorrência e paralelismo

`asyncio` alterna tarefas quando elas cedem controle; isso oferece concorrência, mas não implica que instruções Python estejam executando simultaneamente em vários núcleos. Threads e processos têm trade-offs diferentes e são discutidos na aula seguinte.

## 5. Como falar na entrevista

**“`asyncio` executa código em paralelo?”**
> “Ele oferece concorrência cooperativa: uma tarefa cede quando aguarda e o event loop pode avançar outra. Isso não é paralelismo de CPU. Para trabalho CPU-bound, avalio processos ou outra estratégia.”

## 6. Resumo

- `for` consome iteradores; generators fornecem valores sob demanda.
- `yield` suspende e retoma uma função generator.
- Corrotinas precisam ser aguardadas ou agendadas.
- `asyncio` costuma servir a concorrência de I/O, não paralelismo automático de CPU.
- Trabalho bloqueante pode travar o event loop.

## Termos desta aula
Iterável · iterador · `StopIteration` · generator · `yield` · lazy · coroutine · `async` · `await` · `asyncio`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 09** e separadas por nível.

### Para aprofundar
[Iteradores](https://docs.python.org/3.14/tutorial/classes.html#iterators) · [Generators](https://docs.python.org/3.14/tutorial/classes.html#generators) · [asyncio](https://docs.python.org/3.14/library/asyncio.html)
