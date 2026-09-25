# Node.js — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. O que é o Node.js?**
<sub>Aula [01 — O que é o Node.js (de verdade)](../aulas/01-o-que-e-node.md)</sub>
<details><summary>Ver resposta</summary>

Runtime JavaScript fora do navegador, construído sobre o V8 (executa o JS) e a libuv (I/O assíncrono e Event Loop), com modelo de I/O não bloqueante orientado a eventos. Não é linguagem nem framework.

</details>

**2. Qual o papel do V8 e da libuv?**
<sub>Aula [01 — O que é o Node.js (de verdade)](../aulas/01-o-que-e-node.md)</sub>
<details><summary>Ver resposta</summary>

V8: motor do Google que compila JS pra código de máquina (JIT) e gerencia o heap e o garbage collector. libuv: biblioteca em C que implementa o Event Loop, o I/O assíncrono com o sistema operacional e o thread pool.

</details>

**3. O que é a call stack?**
<sub>Aula [02 — Síncrono, assíncrono, bloqueante e a Call Stack](../aulas/02-sincrono-assincrono-call-stack.md)</sub>
<details><summary>Ver resposta</summary>

Pilha LIFO onde o motor controla as funções em execução: cada chamada empilha um frame, cada retorno desempilha. Existe uma só no Node. Recursão infinita estoura a pilha (stack overflow).

</details>

**4. Qual a diferença entre síncrono e assíncrono?**
<sub>Aula [02 — Síncrono, assíncrono, bloqueante e a Call Stack](../aulas/02-sincrono-assincrono-call-stack.md)</sub>
<details><summary>Ver resposta</summary>

Síncrono: a próxima instrução só roda quando a anterior termina. Assíncrono: dispara a operação e segue; o resultado é tratado depois via callback, Promise ou await.

</details>

**5. O que significa "bloqueante"? Dê exemplos.**
<sub>Aula [02 — Síncrono, assíncrono, bloqueante e a Call Stack](../aulas/02-sincrono-assincrono-call-stack.md)</sub>
<details><summary>Ver resposta</summary>

Operação que prende a thread até terminar, impedindo o Node de atender outras coisas. Exemplos: métodos `*Sync` (`readFileSync`, `pbkdf2Sync`), loops pesados de CPU, `JSON.parse` de payload gigante.

</details>

**6. Explique o Event Loop.**
<sub>Aula [03 — Event Loop em profundidade](../aulas/03-event-loop.md)</sub>
<details><summary>Ver resposta</summary>

Laço implementado pela libuv que executa callbacks prontos quando a call stack está vazia. O I/O é delegado ao SO ou ao thread pool; quando termina, o callback entra numa fila. O loop passa por fases (timers, poll, check…) e entre cada callback esvazia nextTick e microtasks.

</details>

**7. Quais são as fases principais do Event Loop?**
<sub>Aula [03 — Event Loop em profundidade](../aulas/03-event-loop.md)</sub>
<details><summary>Ver resposta</summary>

Timers (setTimeout/setInterval) → pending callbacks → idle/prepare → poll (callbacks de I/O e espera por I/O) → check (setImmediate) → close callbacks.

</details>

**8. O que são microtasks e macrotasks?**
<sub>Aula [03 — Event Loop em profundidade](../aulas/03-event-loop.md)</sub>
<details><summary>Ver resposta</summary>

Microtasks: callbacks de Promises e `queueMicrotask` (além da fila do `process.nextTick`, que tem prioridade ainda maior). Macrotasks: callbacks das fases, como timers, I/O e setImmediate. As microtasks são esvaziadas totalmente depois de cada callback, antes da próxima macrotask.

</details>

**9. O que usa o thread pool da libuv e qual o tamanho dele?**
<sub>Aula [04 — libuv e o Thread Pool](../aulas/04-libuv-thread-pool.md)</sub>
<details><summary>Ver resposta</summary>

Maioria das operações de `fs`, `dns.lookup`, crypto assíncrono pesado (pbkdf2, scrypt, randomBytes) e zlib. Padrão de 4 threads, ajustável por `UV_THREADPOOL_SIZE`.

</details>

**10. O que é callback hell e como resolver?**
<sub>Aula [05 — Callbacks, Promises e async/await](../aulas/05-callbacks-promises-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Callbacks aninhados em várias camadas, difíceis de ler e com tratamento de erro repetido. Resolve com Promises (encadeamento e um catch único) e async/await.

</details>

**11. O que é uma Promise e quais os estados dela?**
<sub>Aula [05 — Callbacks, Promises e async/await](../aulas/05-callbacks-promises-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Objeto que representa um valor futuro. Estados: pending, fulfilled (resolvida) e rejected (rejeitada). Depois de settled não muda mais.

</details>

**12. O que é unhandled rejection e o que acontece?**
<sub>Aula [05 — Callbacks, Promises e async/await](../aulas/05-callbacks-promises-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Promise rejeitada sem catch/try-catch. Desde o Node 15, derruba o processo por padrão. Causa comum: esquecer o `await`. Linter (`no-floating-promises`) ajuda a pegar.

</details>

**13. dependencies vs devDependencies?**
<sub>Aula [06 — Módulos, npm e gerenciamento de dependências](../aulas/06-modulos-e-npm.md)</sub>
<details><summary>Ver resposta</summary>

dependencies: necessárias pra rodar em produção. devDependencies: só pra desenvolver (TypeScript, testes, linter); podem ser omitidas no build de produção.

</details>

**14. O que é semver e o que `^` e `~` significam?**
<sub>Aula [06 — Módulos, npm e gerenciamento de dependências](../aulas/06-modulos-e-npm.md)</sub>
<details><summary>Ver resposta</summary>

MAJOR.MINOR.PATCH: major quebra compatibilidade, minor adiciona de forma compatível, patch corrige. `^1.2.3` aceita minor e patch (<2.0.0). `~1.2.3` aceita só patch (<1.3.0).

</details>

**15. Pra que serve o lockfile e o `npm ci`?**
<sub>Aula [06 — Módulos, npm e gerenciamento de dependências](../aulas/06-modulos-e-npm.md)</sub>
<details><summary>Ver resposta</summary>

O lockfile trava a árvore exata de versões, incluindo transitivas, garantindo builds reproduzíveis. `npm ci` instala exatamente o lockfile, do zero, e falha se estiver inconsistente; é o comando pra CI e produção.

</details>

**16. O que é o EventEmitter e o `emit` é síncrono ou assíncrono?**
<sub>Aula [07 — EventEmitter e a arquitetura orientada a eventos](../aulas/07-event-emitter.md)</sub>
<details><summary>Ver resposta</summary>

Implementação do padrão observer/pub-sub em memória (`on`, `once`, `emit`, `off`). O `emit` é síncrono: chama os ouvintes na hora, em ordem, na mesma call stack. É base de streams, http e process.

</details>

**17. O que é um Buffer?**
<sub>Aula [08 — Buffers, Streams e Backpressure](../aulas/08-streams-e-buffers.md)</sub>
<details><summary>Ver resposta</summary>

Sequência de bytes brutos de tamanho fixo, com memória fora do heap do V8. Usado pra arquivos, rede e criptografia; converte pra texto com encodings como utf8, base64 e hex.

</details>

**18. Pra que servem streams e quais os tipos?**
<sub>Aula [08 — Buffers, Streams e Backpressure](../aulas/08-streams-e-buffers.md)</sub>
<details><summary>Ver resposta</summary>

Processar dados em chunks sem carregar tudo na memória: memória constante e resposta começa antes. Tipos: Readable, Writable, Duplex e Transform.

</details>

**19. O que é backpressure?**
<sub>Aula [08 — Buffers, Streams e Backpressure](../aulas/08-streams-e-buffers.md)</sub>
<details><summary>Ver resposta</summary>

Controle de fluxo quando o produtor é mais rápido que o consumidor. `write()` retorna false quando o buffer passa do highWaterMark; o evento `drain` indica que pode continuar. `pipeline` gerencia isso automaticamente.

</details>

**20. O que é um middleware?**
<sub>Aula [10 — HTTP no Node e como o Express funciona](../aulas/10-http-e-express.md)</sub>
<details><summary>Ver resposta</summary>

Função `(req, res, next)` na cadeia da requisição que pode ler/alterar req e res, encerrar a resposta ou chamar `next()`. Executa na ordem de registro. Usada pra cross-cutting concerns: auth, log, parse de body, CORS, erros. Padrão Chain of Responsibility.

</details>

**21. O que é retry com backoff exponencial e jitter?**
<sub>Aula [11 — Filas e processamento em background com BullMQ](../aulas/11-filas-bullmq.md)</sub>
<details><summary>Ver resposta</summary>

Retry: tentar de novo em falhas transitórias. Backoff exponencial: intervalo crescente (2s, 4s, 8s) pra não martelar um serviço degradado. Jitter: aleatoriedade no intervalo pra evitar que muitos jobs tentem ao mesmo tempo (thundering herd).

</details>

**22. O que é graceful shutdown?**
<sub>Aula [12 — Node em produção: erros, memória, shutdown e observabilidade](../aulas/12-node-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Ao receber SIGTERM: parar de aceitar novas requisições/jobs, terminar as em andamento, fechar conexões com banco/Redis e sair. Junto com readiness probe, permite deploy sem derrubar requisições.

</details>

**23. O que o módulo node:test oferece?**
<sub>Aula [13 — Testes em Node: unitários, integração e mocks](../aulas/13-testes-em-node.md)</sub>
<details><summary>Ver resposta</summary>

É o test runner que vem com o Node: permite declarar testes, agrupá-los, usar hooks e fazer assertions com node:assert. Evita instalar um runner só para começar e funciona bem com JavaScript ou TypeScript compilado. A aplicação ainda escolhe bibliotecas adicionais quando precisa de recursos específicos.

</details>

**24. Qual a diferença entre teste unitário, de integração e de contrato?**
<sub>Aula [13 — Testes em Node: unitários, integração e mocks](../aulas/13-testes-em-node.md)</sub>
<details><summary>Ver resposta</summary>

O unitário verifica uma unidade isolada, normalmente com dependências substituídas. O de integração verifica componentes reais trabalhando juntos, por exemplo service e banco de teste. O de contrato verifica se dois lados respeitam o formato e comportamento combinado da API.

</details>

**25. O que é Server-Sent Events (SSE)?**
<sub>Aula [14 — Tempo real: WebSocket, SSE e escala](../aulas/14-tempo-real-websocket-e-sse.md)</sub>
<details><summary>Ver resposta</summary>

É uma conexão HTTP mantida aberta em que o servidor envia eventos unidirecionais ao cliente, com reconexão e formato definidos pelo protocolo EventSource. Serve para notificações, progresso e atualizações ao vivo quando o navegador não precisa mandar mensagens pela mesma conexão.

</details>

**26. O que é um WebSocket?**
<sub>Aula [14 — Tempo real: WebSocket, SSE e escala](../aulas/14-tempo-real-websocket-e-sse.md)</sub>
<details><summary>Ver resposta</summary>

É um protocolo que começa com um handshake HTTP e depois mantém uma conexão persistente e bidirecional entre cliente e servidor. Cada lado pode enviar mensagens sem abrir uma requisição nova, útil para chat, colaboração e jogos.

</details>
