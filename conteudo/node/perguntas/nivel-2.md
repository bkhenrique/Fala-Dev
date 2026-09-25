# Node.js — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. O Node é single-thread?**
<sub>Aula [01 — O que é o Node.js (de verdade)](../aulas/01-o-que-e-node.md)</sub>
<details><summary>Ver resposta</summary>

O JavaScript roda numa única thread (main thread). Mas o runtime usa várias: thread pool da libuv, threads do GC do V8. Por isso tem alta concorrência de I/O mesmo com uma thread de JS.

</details>

**2. Qual a diferença entre concorrência e paralelismo?**
<sub>Aula [01 — O que é o Node.js (de verdade)](../aulas/01-o-que-e-node.md)</sub>
<details><summary>Ver resposta</summary>

Concorrência é lidar com várias tarefas no mesmo período, alternando entre elas (um garçom com várias mesas). Paralelismo é executar várias ao mesmo tempo de fato (vários garçons). Node é forte em concorrência; paralelismo exige Worker Threads, cluster ou mais instâncias.

</details>

**3. Quando você usaria e quando evitaria Node?**
<sub>Aula [01 — O que é o Node.js (de verdade)](../aulas/01-o-que-e-node.md)</sub>
<details><summary>Ver resposta</summary>

Usaria em cargas I/O-bound: APIs, BFFs, real-time, streaming, CLIs, e quando ter a mesma linguagem no front e no back ajuda. Evitaria (ou isolaria) em CPU-bound pesado, como processamento de imagem/vídeo e ML, porque bloqueia o Event Loop, a não ser que o trabalho seja movido pra Worker Threads, filas ou outro serviço.

</details>

**4. Por que um callback assíncrono não roda enquanto um loop pesado executa?**
<sub>Aula [02 — Síncrono, assíncrono, bloqueante e a Call Stack](../aulas/02-sincrono-assincrono-call-stack.md)</sub>
<details><summary>Ver resposta</summary>

Porque o Event Loop só coloca callbacks na call stack quando ela está vazia. Enquanto o loop ocupa a pilha, nenhum callback, timer ou requisição é processado.

</details>

**5. Qual a ordem: `setTimeout(0)`, `setImmediate`, `Promise.then`, `process.nextTick`?**
<sub>Aula [03 — Event Loop em profundidade](../aulas/03-event-loop.md)</sub>
<details><summary>Ver resposta</summary>

Depois do código síncrono: nextTick → Promise.then → setTimeout/setImmediate. Entre os dois últimos, no módulo principal a ordem não é garantida; dentro de um callback de I/O, setImmediate roda antes.

</details>

**6. `setTimeout(fn, 100)` executa em exatamente 100ms?**
<sub>Aula [03 — Event Loop em profundidade](../aulas/03-event-loop.md)</sub>
<details><summary>Ver resposta</summary>

Não. Garante no mínimo 100ms. Roda quando o loop chegar na fase timers e a call stack estiver livre; se a thread estiver ocupada, atrasa.

</details>

**7. Como o Node faz I/O de rede sem uma thread por conexão?**
<sub>Aula [04 — libuv e o Thread Pool](../aulas/04-libuv-thread-pool.md)</sub>
<details><summary>Ver resposta</summary>

A libuv usa os mecanismos assíncronos do sistema operacional (epoll, kqueue, IOCP), que avisam quando há dados num socket. Nenhuma thread fica parada esperando, então milhares de conexões custam pouco.

</details>

**8. Qual a diferença entre o thread pool da libuv e Worker Threads?**
<sub>Aula [04 — libuv e o Thread Pool](../aulas/04-libuv-thread-pool.md)</sub>
<details><summary>Ver resposta</summary>

O thread pool é gerenciado pela libuv e roda operações nativas do Node; não executa seu JS. Worker Threads são criadas por você e executam seu JavaScript em paralelo, com V8 e Event Loop próprios.

</details>

**9. O `await` bloqueia o Node?**
<sub>Aula [05 — Callbacks, Promises e async/await](../aulas/05-callbacks-promises-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Não. Pausa só a função async; o restante dela vira microtask. A thread fica livre e o Event Loop segue atendendo outras requisições.

</details>

**10. Diferença entre `Promise.all`, `allSettled`, `race` e `any`?**
<sub>Aula [05 — Callbacks, Promises e async/await](../aulas/05-callbacks-promises-async-await.md)</sub>
<details><summary>Ver resposta</summary>

all: resolve quando todas resolvem, rejeita na primeira falha (fail-fast). allSettled: espera todas e devolve o status de cada uma. race: assume o resultado da primeira que terminar (sucesso ou erro), útil pra timeout. any: primeira que der sucesso; rejeita só se todas falharem.

</details>

**11. CommonJS vs ES Modules?**
<sub>Aula [06 — Módulos, npm e gerenciamento de dependências](../aulas/06-modulos-e-npm.md)</sub>
<details><summary>Ver resposta</summary>

CommonJS: `require`/`module.exports`, síncrono, dinâmico, com cache. ESM: `import`/`export`, padrão da linguagem, estático (permite tree shaking), suporta top-level await. `.mjs`/`.cjs` ou o campo `"type"` do package.json definem qual vale.

</details>

**12. O que significa o aviso `MaxListenersExceededWarning`?**
<sub>Aula [07 — EventEmitter e a arquitetura orientada a eventos](../aulas/07-event-emitter.md)</sub>
<details><summary>Ver resposta</summary>

Que mais de 10 ouvintes foram registrados no mesmo evento, sinal típico de memory leak (ex: `on` dentro de rota, nunca removido). A correção é remover os ouvintes (`off`/`once`), não aumentar o limite.

</details>

**13. Qual o problema de uma operação CPU-heavy direto na rota?**
<sub>Aula [09 — Paralelismo e escala: Worker Threads, Child Process, Cluster e containers](../aulas/09-paralelismo-e-escala.md)</sub>
<details><summary>Ver resposta</summary>

Bloqueia o Event Loop: nenhuma outra requisição é atendida enquanto roda, a latência sobe pra todos e health checks podem falhar. Mover pra Worker Threads, fila com workers, ou outro serviço.

</details>

**14. Worker Thread vs BullMQ Worker?**
<sub>Aula [09 — Paralelismo e escala: Worker Threads, Child Process, Cluster e containers](../aulas/09-paralelismo-e-escala.md)</sub>
<details><summary>Ver resposta</summary>

Worker Thread: paralelismo de CPU dentro do processo, sem persistência; se o processo cai, perde o trabalho. BullMQ Worker: consumidor de fila distribuído, jobs persistidos no Redis, com retry, DLQ e escala em várias máquinas.

</details>

**15. Worker Thread vs Child Process?**
<sub>Aula [09 — Paralelismo e escala: Worker Threads, Child Process, Cluster e containers](../aulas/09-paralelismo-e-escala.md)</sub>
<details><summary>Ver resposta</summary>

Worker: mais leve, mesmo processo, pra rodar seu JS em paralelo, comunicação por mensagem. Child process: processo separado, isolamento total, pra rodar outros programas (ffmpeg, Python) via spawn/exec/execFile, ou outro script Node com fork.

</details>

**16. O que é o cluster e por que hoje se usa menos?**
<sub>Aula [09 — Paralelismo e escala: Worker Threads, Child Process, Cluster e containers](../aulas/09-paralelismo-e-escala.md)</sub>
<details><summary>Ver resposta</summary>

Módulo que cria vários processos Node (um por núcleo) compartilhando a porta, com um primary distribuindo conexões. Hoje o comum é um processo por container e o orquestrador rodando réplicas atrás de um load balancer, o que escala entre várias máquinas e já cuida de reinício.

</details>

**17. Como funciona o tratamento de erro no Express?**
<sub>Aula [10 — HTTP no Node e como o Express funciona](../aulas/10-http-e-express.md)</sub>
<details><summary>Ver resposta</summary>

Middleware com 4 parâmetros `(err, req, res, next)` registrado no final; `next(err)` ou erro lançado pula pra ele. No Express 4, erro em função async precisa de try/catch + next(err); o Express 5 captura Promises rejeitadas automaticamente.

</details>

**18. Express vs Fastify vs NestJS?**
<sub>Aula [10 — HTTP no Node e como o Express funciona](../aulas/10-http-e-express.md)</sub>
<details><summary>Ver resposta</summary>

Express: minimalista, mais popular, pouca estrutura. Fastify: minimalista com foco em performance e validação por JSON Schema. NestJS: framework opinativo com módulos, DI e TypeScript, rodando sobre Express ou Fastify.

</details>

**19. Por que usar Redis + BullMQ?**
<sub>Aula [11 — Filas e processamento em background com BullMQ](../aulas/11-filas-bullmq.md)</sub>
<details><summary>Ver resposta</summary>

Pra tirar trabalho lento/instável da requisição: a API enfileira e responde 202, workers processam. Ganho tempo de resposta, retry com backoff, DLQ, controle de vazão (concurrency e limiter) e escala independente. Custo: mais infra e consistência eventual.

</details>

**20. O que é DLQ e o que acontece com um job que falha 10 vezes?**
<sub>Aula [11 — Filas e processamento em background com BullMQ](../aulas/11-filas-bullmq.md)</sub>
<details><summary>Ver resposta</summary>

Dead Letter Queue: destino dos jobs que esgotaram as tentativas. O job para de ser tentado (não trava a fila), fica guardado com o erro, gera alerta, e é investigado e reprocessado depois da correção. No BullMQ é o estado failed ou uma fila separada.

</details>

**21. O que fazer em `uncaughtException`?**
<sub>Aula [12 — Node em produção: erros, memória, shutdown e observabilidade](../aulas/12-node-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Logar e encerrar o processo (fail-fast), deixando o orquestrador subir outro. Continuar rodando é arriscado porque o estado da aplicação ficou desconhecido.

</details>

**22. Quando usar mock e quando usar uma dependência real no teste?**
<sub>Aula [13 — Testes em Node: unitários, integração e mocks](../aulas/13-testes-em-node.md)</sub>
<details><summary>Ver resposta</summary>

Mock é útil para controlar uma fronteira externa e forçar cenários como timeout, erro ou resposta rara. Dependências reais em integração detectam incompatibilidades que o mock não consegue ver, como SQL ou serialização incorretos. Isole o que é lento ou externo, mas mantenha testes com infraestrutura real nos caminhos críticos.

</details>

**23. O que você testaria com timers falsos?**
<sub>Aula [13 — Testes em Node: unitários, integração e mocks](../aulas/13-testes-em-node.md)</sub>
<details><summary>Ver resposta</summary>

Código cujo comportamento depende de tempo: debounce, retry, timeout e tarefas agendadas. O relógio falso avança sem esperar de verdade, deixando o teste rápido e determinístico. É preciso restaurar o timer real e evitar misturá-lo sem cuidado com APIs assíncronas que o próprio teste usa.

</details>

**24. Quando escolher SSE em vez de WebSocket?**
<sub>Aula [14 — Tempo real: WebSocket, SSE e escala](../aulas/14-tempo-real-websocket-e-sse.md)</sub>
<details><summary>Ver resposta</summary>

Escolho SSE quando só o servidor precisa enviar atualizações: é HTTP simples, funciona bem com proxies e o navegador reconecta. WebSocket vale quando há conversa bidirecional frequente e latência baixa, como chat. WebSocket traz mais trabalho de autenticação, reconexão, estado de conexão e operação.

</details>

**25. Por que várias instâncias de WebSocket precisam de pub/sub compartilhado?**
<sub>Aula [14 — Tempo real: WebSocket, SSE e escala](../aulas/14-tempo-real-websocket-e-sse.md)</sub>
<details><summary>Ver resposta</summary>

Cada conexão fica ligada a uma instância específica, então um evento recebido por outra instância não alcança automaticamente aquele cliente. Um adapter ou broker compartilha a publicação entre réplicas; o balanceador ainda precisa respeitar os requisitos de transporte e sessão da biblioteca. Isso acrescenta infraestrutura e consistência operacional.

</details>
