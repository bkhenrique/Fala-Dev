# Node.js — perguntas

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

As perguntas estão separadas por **nível**, e cada uma indica a aula de onde vem.

---

## Nível 1 — O que é?

_Definições. Tem que sair sem pensar._

**1. O que é o Node.js?**
<sub>Aula [01 — O que é o Node.js (de verdade)](aulas/01-o-que-e-node.md)</sub>
<details><summary>Ver resposta</summary>

Runtime JavaScript fora do navegador, construído sobre o V8 (executa o JS) e a libuv (I/O assíncrono e Event Loop), com modelo de I/O não bloqueante orientado a eventos. Não é linguagem nem framework.

</details>

**2. Qual o papel do V8 e da libuv?**
<sub>Aula [01 — O que é o Node.js (de verdade)](aulas/01-o-que-e-node.md)</sub>
<details><summary>Ver resposta</summary>

V8: motor do Google que compila JS pra código de máquina (JIT) e gerencia o heap e o garbage collector. libuv: biblioteca em C que implementa o Event Loop, o I/O assíncrono com o sistema operacional e o thread pool.

</details>

**3. O que é a call stack?**
<sub>Aula [02 — Síncrono, assíncrono, bloqueante e a Call Stack](aulas/02-sincrono-assincrono-call-stack.md)</sub>
<details><summary>Ver resposta</summary>

Pilha LIFO onde o motor controla as funções em execução: cada chamada empilha um frame, cada retorno desempilha. Existe uma só no Node. Recursão infinita estoura a pilha (stack overflow).

</details>

**4. Qual a diferença entre síncrono e assíncrono?**
<sub>Aula [02 — Síncrono, assíncrono, bloqueante e a Call Stack](aulas/02-sincrono-assincrono-call-stack.md)</sub>
<details><summary>Ver resposta</summary>

Síncrono: a próxima instrução só roda quando a anterior termina. Assíncrono: dispara a operação e segue; o resultado é tratado depois via callback, Promise ou await.

</details>

**5. O que significa "bloqueante"? Dê exemplos.**
<sub>Aula [02 — Síncrono, assíncrono, bloqueante e a Call Stack](aulas/02-sincrono-assincrono-call-stack.md)</sub>
<details><summary>Ver resposta</summary>

Operação que prende a thread até terminar, impedindo o Node de atender outras coisas. Exemplos: métodos `*Sync` (`readFileSync`, `pbkdf2Sync`), loops pesados de CPU, `JSON.parse` de payload gigante.

</details>

**6. Explique o Event Loop.**
<sub>Aula [03 — Event Loop em profundidade](aulas/03-event-loop.md)</sub>
<details><summary>Ver resposta</summary>

Laço implementado pela libuv que executa callbacks prontos quando a call stack está vazia. O I/O é delegado ao SO ou ao thread pool; quando termina, o callback entra numa fila. O loop passa por fases (timers, poll, check…) e entre cada callback esvazia nextTick e microtasks.

</details>

**7. Quais são as fases principais do Event Loop?**
<sub>Aula [03 — Event Loop em profundidade](aulas/03-event-loop.md)</sub>
<details><summary>Ver resposta</summary>

Timers (setTimeout/setInterval) → pending callbacks → idle/prepare → poll (callbacks de I/O e espera por I/O) → check (setImmediate) → close callbacks.

</details>

**8. O que são microtasks e macrotasks?**
<sub>Aula [03 — Event Loop em profundidade](aulas/03-event-loop.md)</sub>
<details><summary>Ver resposta</summary>

Microtasks: callbacks de Promises e `queueMicrotask` (além da fila do `process.nextTick`, que tem prioridade ainda maior). Macrotasks: callbacks das fases, como timers, I/O e setImmediate. As microtasks são esvaziadas totalmente depois de cada callback, antes da próxima macrotask.

</details>

**9. O que usa o thread pool da libuv e qual o tamanho dele?**
<sub>Aula [04 — libuv e o Thread Pool](aulas/04-libuv-thread-pool.md)</sub>
<details><summary>Ver resposta</summary>

Maioria das operações de `fs`, `dns.lookup`, crypto assíncrono pesado (pbkdf2, scrypt, randomBytes) e zlib. Padrão de 4 threads, ajustável por `UV_THREADPOOL_SIZE`.

</details>

**10. O que é callback hell e como resolver?**
<sub>Aula [05 — Callbacks, Promises e async/await](aulas/05-callbacks-promises-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Callbacks aninhados em várias camadas, difíceis de ler e com tratamento de erro repetido. Resolve com Promises (encadeamento e um catch único) e async/await.

</details>

**11. O que é uma Promise e quais os estados dela?**
<sub>Aula [05 — Callbacks, Promises e async/await](aulas/05-callbacks-promises-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Objeto que representa um valor futuro. Estados: pending, fulfilled (resolvida) e rejected (rejeitada). Depois de settled não muda mais.

</details>

**12. O que é unhandled rejection e o que acontece?**
<sub>Aula [05 — Callbacks, Promises e async/await](aulas/05-callbacks-promises-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Promise rejeitada sem catch/try-catch. Desde o Node 15, derruba o processo por padrão. Causa comum: esquecer o `await`. Linter (`no-floating-promises`) ajuda a pegar.

</details>

**13. dependencies vs devDependencies?**
<sub>Aula [06 — Módulos, npm e gerenciamento de dependências](aulas/06-modulos-e-npm.md)</sub>
<details><summary>Ver resposta</summary>

dependencies: necessárias pra rodar em produção. devDependencies: só pra desenvolver (TypeScript, testes, linter); podem ser omitidas no build de produção.

</details>

**14. O que é semver e o que `^` e `~` significam?**
<sub>Aula [06 — Módulos, npm e gerenciamento de dependências](aulas/06-modulos-e-npm.md)</sub>
<details><summary>Ver resposta</summary>

MAJOR.MINOR.PATCH: major quebra compatibilidade, minor adiciona de forma compatível, patch corrige. `^1.2.3` aceita minor e patch (<2.0.0). `~1.2.3` aceita só patch (<1.3.0).

</details>

**15. Pra que serve o lockfile e o `npm ci`?**
<sub>Aula [06 — Módulos, npm e gerenciamento de dependências](aulas/06-modulos-e-npm.md)</sub>
<details><summary>Ver resposta</summary>

O lockfile trava a árvore exata de versões, incluindo transitivas, garantindo builds reproduzíveis. `npm ci` instala exatamente o lockfile, do zero, e falha se estiver inconsistente; é o comando pra CI e produção.

</details>

**16. O que é o EventEmitter e o `emit` é síncrono ou assíncrono?**
<sub>Aula [07 — EventEmitter e a arquitetura orientada a eventos](aulas/07-event-emitter.md)</sub>
<details><summary>Ver resposta</summary>

Implementação do padrão observer/pub-sub em memória (`on`, `once`, `emit`, `off`). O `emit` é síncrono: chama os ouvintes na hora, em ordem, na mesma call stack. É base de streams, http e process.

</details>

**17. O que é um Buffer?**
<sub>Aula [08 — Buffers, Streams e Backpressure](aulas/08-streams-e-buffers.md)</sub>
<details><summary>Ver resposta</summary>

Sequência de bytes brutos de tamanho fixo, com memória fora do heap do V8. Usado pra arquivos, rede e criptografia; converte pra texto com encodings como utf8, base64 e hex.

</details>

**18. Pra que servem streams e quais os tipos?**
<sub>Aula [08 — Buffers, Streams e Backpressure](aulas/08-streams-e-buffers.md)</sub>
<details><summary>Ver resposta</summary>

Processar dados em chunks sem carregar tudo na memória: memória constante e resposta começa antes. Tipos: Readable, Writable, Duplex e Transform.

</details>

**19. O que é backpressure?**
<sub>Aula [08 — Buffers, Streams e Backpressure](aulas/08-streams-e-buffers.md)</sub>
<details><summary>Ver resposta</summary>

Controle de fluxo quando o produtor é mais rápido que o consumidor. `write()` retorna false quando o buffer passa do highWaterMark; o evento `drain` indica que pode continuar. `pipeline` gerencia isso automaticamente.

</details>

**20. O que é um middleware?**
<sub>Aula [10 — HTTP no Node e como o Express funciona](aulas/10-http-e-express.md)</sub>
<details><summary>Ver resposta</summary>

Função `(req, res, next)` na cadeia da requisição que pode ler/alterar req e res, encerrar a resposta ou chamar `next()`. Executa na ordem de registro. Usada pra cross-cutting concerns: auth, log, parse de body, CORS, erros. Padrão Chain of Responsibility.

</details>

**21. O que é retry com backoff exponencial e jitter?**
<sub>Aula [11 — Filas e processamento em background com BullMQ](aulas/11-filas-bullmq.md)</sub>
<details><summary>Ver resposta</summary>

Retry: tentar de novo em falhas transitórias. Backoff exponencial: intervalo crescente (2s, 4s, 8s) pra não martelar um serviço degradado. Jitter: aleatoriedade no intervalo pra evitar que muitos jobs tentem ao mesmo tempo (thundering herd).

</details>

**22. O que é graceful shutdown?**
<sub>Aula [12 — Node em produção: erros, memória, shutdown e observabilidade](aulas/12-node-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Ao receber SIGTERM: parar de aceitar novas requisições/jobs, terminar as em andamento, fechar conexões com banco/Redis e sair. Junto com readiness probe, permite deploy sem derrubar requisições.

</details>

---

## Nível 2 — Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**23. O Node é single-thread?**
<sub>Aula [01 — O que é o Node.js (de verdade)](aulas/01-o-que-e-node.md)</sub>
<details><summary>Ver resposta</summary>

O JavaScript roda numa única thread (main thread). Mas o runtime usa várias: thread pool da libuv, threads do GC do V8. Por isso tem alta concorrência de I/O mesmo com uma thread de JS.

</details>

**24. Qual a diferença entre concorrência e paralelismo?**
<sub>Aula [01 — O que é o Node.js (de verdade)](aulas/01-o-que-e-node.md)</sub>
<details><summary>Ver resposta</summary>

Concorrência é lidar com várias tarefas no mesmo período, alternando entre elas (um garçom com várias mesas). Paralelismo é executar várias ao mesmo tempo de fato (vários garçons). Node é forte em concorrência; paralelismo exige Worker Threads, cluster ou mais instâncias.

</details>

**25. Quando você usaria e quando evitaria Node?**
<sub>Aula [01 — O que é o Node.js (de verdade)](aulas/01-o-que-e-node.md)</sub>
<details><summary>Ver resposta</summary>

Usaria em cargas I/O-bound: APIs, BFFs, real-time, streaming, CLIs, e quando ter a mesma linguagem no front e no back ajuda. Evitaria (ou isolaria) em CPU-bound pesado, como processamento de imagem/vídeo e ML, porque bloqueia o Event Loop, a não ser que o trabalho seja movido pra Worker Threads, filas ou outro serviço.

</details>

**26. Por que um callback assíncrono não roda enquanto um loop pesado executa?**
<sub>Aula [02 — Síncrono, assíncrono, bloqueante e a Call Stack](aulas/02-sincrono-assincrono-call-stack.md)</sub>
<details><summary>Ver resposta</summary>

Porque o Event Loop só coloca callbacks na call stack quando ela está vazia. Enquanto o loop ocupa a pilha, nenhum callback, timer ou requisição é processado.

</details>

**27. Qual a ordem: `setTimeout(0)`, `setImmediate`, `Promise.then`, `process.nextTick`?**
<sub>Aula [03 — Event Loop em profundidade](aulas/03-event-loop.md)</sub>
<details><summary>Ver resposta</summary>

Depois do código síncrono: nextTick → Promise.then → setTimeout/setImmediate. Entre os dois últimos, no módulo principal a ordem não é garantida; dentro de um callback de I/O, setImmediate roda antes.

</details>

**28. `setTimeout(fn, 100)` executa em exatamente 100ms?**
<sub>Aula [03 — Event Loop em profundidade](aulas/03-event-loop.md)</sub>
<details><summary>Ver resposta</summary>

Não. Garante no mínimo 100ms. Roda quando o loop chegar na fase timers e a call stack estiver livre; se a thread estiver ocupada, atrasa.

</details>

**29. Como o Node faz I/O de rede sem uma thread por conexão?**
<sub>Aula [04 — libuv e o Thread Pool](aulas/04-libuv-thread-pool.md)</sub>
<details><summary>Ver resposta</summary>

A libuv usa os mecanismos assíncronos do sistema operacional (epoll, kqueue, IOCP), que avisam quando há dados num socket. Nenhuma thread fica parada esperando, então milhares de conexões custam pouco.

</details>

**30. Qual a diferença entre o thread pool da libuv e Worker Threads?**
<sub>Aula [04 — libuv e o Thread Pool](aulas/04-libuv-thread-pool.md)</sub>
<details><summary>Ver resposta</summary>

O thread pool é gerenciado pela libuv e roda operações nativas do Node; não executa seu JS. Worker Threads são criadas por você e executam seu JavaScript em paralelo, com V8 e Event Loop próprios.

</details>

**31. O `await` bloqueia o Node?**
<sub>Aula [05 — Callbacks, Promises e async/await](aulas/05-callbacks-promises-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Não. Pausa só a função async; o restante dela vira microtask. A thread fica livre e o Event Loop segue atendendo outras requisições.

</details>

**32. Diferença entre `Promise.all`, `allSettled`, `race` e `any`?**
<sub>Aula [05 — Callbacks, Promises e async/await](aulas/05-callbacks-promises-async-await.md)</sub>
<details><summary>Ver resposta</summary>

all: resolve quando todas resolvem, rejeita na primeira falha (fail-fast). allSettled: espera todas e devolve o status de cada uma. race: assume o resultado da primeira que terminar (sucesso ou erro), útil pra timeout. any: primeira que der sucesso; rejeita só se todas falharem.

</details>

**33. CommonJS vs ES Modules?**
<sub>Aula [06 — Módulos, npm e gerenciamento de dependências](aulas/06-modulos-e-npm.md)</sub>
<details><summary>Ver resposta</summary>

CommonJS: `require`/`module.exports`, síncrono, dinâmico, com cache. ESM: `import`/`export`, padrão da linguagem, estático (permite tree shaking), suporta top-level await. `.mjs`/`.cjs` ou o campo `"type"` do package.json definem qual vale.

</details>

**34. O que significa o aviso `MaxListenersExceededWarning`?**
<sub>Aula [07 — EventEmitter e a arquitetura orientada a eventos](aulas/07-event-emitter.md)</sub>
<details><summary>Ver resposta</summary>

Que mais de 10 ouvintes foram registrados no mesmo evento, sinal típico de memory leak (ex: `on` dentro de rota, nunca removido). A correção é remover os ouvintes (`off`/`once`), não aumentar o limite.

</details>

**35. Qual o problema de uma operação CPU-heavy direto na rota?**
<sub>Aula [09 — Paralelismo e escala: Worker Threads, Child Process, Cluster e containers](aulas/09-paralelismo-e-escala.md)</sub>
<details><summary>Ver resposta</summary>

Bloqueia o Event Loop: nenhuma outra requisição é atendida enquanto roda, a latência sobe pra todos e health checks podem falhar. Mover pra Worker Threads, fila com workers, ou outro serviço.

</details>

**36. Worker Thread vs BullMQ Worker?**
<sub>Aula [09 — Paralelismo e escala: Worker Threads, Child Process, Cluster e containers](aulas/09-paralelismo-e-escala.md)</sub>
<details><summary>Ver resposta</summary>

Worker Thread: paralelismo de CPU dentro do processo, sem persistência; se o processo cai, perde o trabalho. BullMQ Worker: consumidor de fila distribuído, jobs persistidos no Redis, com retry, DLQ e escala em várias máquinas.

</details>

**37. Worker Thread vs Child Process?**
<sub>Aula [09 — Paralelismo e escala: Worker Threads, Child Process, Cluster e containers](aulas/09-paralelismo-e-escala.md)</sub>
<details><summary>Ver resposta</summary>

Worker: mais leve, mesmo processo, pra rodar seu JS em paralelo, comunicação por mensagem. Child process: processo separado, isolamento total, pra rodar outros programas (ffmpeg, Python) via spawn/exec/execFile, ou outro script Node com fork.

</details>

**38. O que é o cluster e por que hoje se usa menos?**
<sub>Aula [09 — Paralelismo e escala: Worker Threads, Child Process, Cluster e containers](aulas/09-paralelismo-e-escala.md)</sub>
<details><summary>Ver resposta</summary>

Módulo que cria vários processos Node (um por núcleo) compartilhando a porta, com um primary distribuindo conexões. Hoje o comum é um processo por container e o orquestrador rodando réplicas atrás de um load balancer, o que escala entre várias máquinas e já cuida de reinício.

</details>

**39. Como funciona o tratamento de erro no Express?**
<sub>Aula [10 — HTTP no Node e como o Express funciona](aulas/10-http-e-express.md)</sub>
<details><summary>Ver resposta</summary>

Middleware com 4 parâmetros `(err, req, res, next)` registrado no final; `next(err)` ou erro lançado pula pra ele. No Express 4, erro em função async precisa de try/catch + next(err); o Express 5 captura Promises rejeitadas automaticamente.

</details>

**40. Express vs Fastify vs NestJS?**
<sub>Aula [10 — HTTP no Node e como o Express funciona](aulas/10-http-e-express.md)</sub>
<details><summary>Ver resposta</summary>

Express: minimalista, mais popular, pouca estrutura. Fastify: minimalista com foco em performance e validação por JSON Schema. NestJS: framework opinativo com módulos, DI e TypeScript, rodando sobre Express ou Fastify.

</details>

**41. Por que usar Redis + BullMQ?**
<sub>Aula [11 — Filas e processamento em background com BullMQ](aulas/11-filas-bullmq.md)</sub>
<details><summary>Ver resposta</summary>

Pra tirar trabalho lento/instável da requisição: a API enfileira e responde 202, workers processam. Ganho tempo de resposta, retry com backoff, DLQ, controle de vazão (concurrency e limiter) e escala independente. Custo: mais infra e consistência eventual.

</details>

**42. O que é DLQ e o que acontece com um job que falha 10 vezes?**
<sub>Aula [11 — Filas e processamento em background com BullMQ](aulas/11-filas-bullmq.md)</sub>
<details><summary>Ver resposta</summary>

Dead Letter Queue: destino dos jobs que esgotaram as tentativas. O job para de ser tentado (não trava a fila), fica guardado com o erro, gera alerta, e é investigado e reprocessado depois da correção. No BullMQ é o estado failed ou uma fila separada.

</details>

**43. O que fazer em `uncaughtException`?**
<sub>Aula [12 — Node em produção: erros, memória, shutdown e observabilidade](aulas/12-node-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Logar e encerrar o processo (fail-fast), deixando o orquestrador subir outro. Continuar rodando é arriscado porque o estado da aplicação ficou desconhecido.

</details>

---

## Nível 3 — Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**44. Como detectar e resolver bloqueio do Event Loop?**
<sub>Aula [03 — Event Loop em profundidade](aulas/03-event-loop.md)</sub>
<details><summary>Ver resposta</summary>

Detectar: métrica de event loop lag (`monitorEventLoopDelay`, APM), todas as rotas lentas ao mesmo tempo, CPU de um core a 100%, profiler/flame graph. Resolver: versões assíncronas, quebrar o trabalho em pedaços, Worker Threads, ou mover pra fila com workers.

</details>

**45. Três chamadas independentes: como fazer?**
<sub>Aula [05 — Callbacks, Promises e async/await](aulas/05-callbacks-promises-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Disparar juntas com `Promise.all` em vez de `await` em sequência; o tempo total vira o da mais lenta, não a soma. Pra listas grandes, limitar a concorrência (lotes, `p-limit`) pra não esgotar pool do banco nem tomar rate limit.

</details>

**46. Como processar um arquivo de 5 GB?**
<sub>Aula [08 — Buffers, Streams e Backpressure](aulas/08-streams-e-buffers.md)</sub>
<details><summary>Ver resposta</summary>

Com streams: `createReadStream` → transform (ou `readline` linha a linha) → destino, usando `pipeline` pra tratar backpressure, erros e limpeza. Memória fica constante.

</details>

**47. Como escalaria uma API Node horizontalmente?**
<sub>Aula [09 — Paralelismo e escala: Worker Threads, Child Process, Cluster e containers](aulas/09-paralelismo-e-escala.md)</sub>
<details><summary>Ver resposta</summary>

Garantir que é stateless (sessão/cache no Redis, arquivos no S3), rodar várias réplicas atrás de um load balancer com health check, autoscaling por métrica, jogar trabalho pesado pra filas com workers que escalam separado, e cuidar do próximo gargalo, normalmente o banco (pool, réplicas de leitura, cache).

</details>

**48. Como tratar um job processado duas vezes? E se o worker cair no meio?**
<sub>Aula [11 — Filas e processamento em background com BullMQ](aulas/11-filas-bullmq.md)</sub>
<details><summary>Ver resposta</summary>

A entrega é at-least-once, então o processamento deve ser idempotente: jobId determinístico, chave de idempotência, constraint única no banco, operações que não acumulam efeito. Se o worker cai, o lock expira, o job vira stalled e volta pra fila, e a idempotência evita efeito duplicado.

</details>

**49. Como investigaria um memory leak?**
<sub>Aula [12 — Node em produção: erros, memória, shutdown e observabilidade](aulas/12-node-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Confirmar pela métrica (memória sobe e não volta depois do GC), tirar heap snapshots em momentos diferentes e comparar quais objetos crescem. Suspeitos: cache sem limite, listeners não removidos, timers não limpos, globais acumulando.

</details>

**50. Como você investigaria uma API Node lenta?**
<sub>Aula [12 — Node em produção: erros, memória, shutdown e observabilidade](aulas/12-node-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Medir antes: p95/p99 por endpoint, traces pra ver onde o tempo vai. Se todas as rotas estão lentas juntas, suspeito de event loop bloqueado (lag, profiler). Se é uma rota, olho query lenta/N+1, chamada externa sem timeout, falta de cache, pool de conexões esgotado ou thread pool saturado. Corrijo e meço de novo.

</details>
