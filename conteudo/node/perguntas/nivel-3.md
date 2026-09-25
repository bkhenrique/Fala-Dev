# Node.js — perguntas, nível 3: Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [índice](README.md)

---

**1. Como detectar e resolver bloqueio do Event Loop?**
<sub>Aula [03 — Event Loop em profundidade](../aulas/03-event-loop.md)</sub>
<details><summary>Ver resposta</summary>

Detectar: métrica de event loop lag (`monitorEventLoopDelay`, APM), todas as rotas lentas ao mesmo tempo, CPU de um core a 100%, profiler/flame graph. Resolver: versões assíncronas, quebrar o trabalho em pedaços, Worker Threads, ou mover pra fila com workers.

</details>

**2. Três chamadas independentes: como fazer?**
<sub>Aula [05 — Callbacks, Promises e async/await](../aulas/05-callbacks-promises-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Disparar juntas com `Promise.all` em vez de `await` em sequência; o tempo total vira o da mais lenta, não a soma. Pra listas grandes, limitar a concorrência (lotes, `p-limit`) pra não esgotar pool do banco nem tomar rate limit.

</details>

**3. Como processar um arquivo de 5 GB?**
<sub>Aula [08 — Buffers, Streams e Backpressure](../aulas/08-streams-e-buffers.md)</sub>
<details><summary>Ver resposta</summary>

Com streams: `createReadStream` → transform (ou `readline` linha a linha) → destino, usando `pipeline` pra tratar backpressure, erros e limpeza. Memória fica constante.

</details>

**4. Como escalaria uma API Node horizontalmente?**
<sub>Aula [09 — Paralelismo e escala: Worker Threads, Child Process, Cluster e containers](../aulas/09-paralelismo-e-escala.md)</sub>
<details><summary>Ver resposta</summary>

Garantir que é stateless (sessão/cache no Redis, arquivos no S3), rodar várias réplicas atrás de um load balancer com health check, autoscaling por métrica, jogar trabalho pesado pra filas com workers que escalam separado, e cuidar do próximo gargalo, normalmente o banco (pool, réplicas de leitura, cache).

</details>

**5. Como tratar um job processado duas vezes? E se o worker cair no meio?**
<sub>Aula [11 — Filas e processamento em background com BullMQ](../aulas/11-filas-bullmq.md)</sub>
<details><summary>Ver resposta</summary>

A entrega é at-least-once, então o processamento deve ser idempotente: jobId determinístico, chave de idempotência, constraint única no banco, operações que não acumulam efeito. Se o worker cai, o lock expira, o job vira stalled e volta pra fila, e a idempotência evita efeito duplicado.

</details>

**6. Como investigaria um memory leak?**
<sub>Aula [12 — Node em produção: erros, memória, shutdown e observabilidade](../aulas/12-node-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Confirmar pela métrica (memória sobe e não volta depois do GC), tirar heap snapshots em momentos diferentes e comparar quais objetos crescem. Suspeitos: cache sem limite, listeners não removidos, timers não limpos, globais acumulando.

</details>

**7. Como você investigaria uma API Node lenta?**
<sub>Aula [12 — Node em produção: erros, memória, shutdown e observabilidade](../aulas/12-node-em-producao.md)</sub>
<details><summary>Ver resposta</summary>

Medir antes: p95/p99 por endpoint, traces pra ver onde o tempo vai. Se todas as rotas estão lentas juntas, suspeito de event loop bloqueado (lag, profiler). Se é uma rota, olho query lenta/N+1, chamada externa sem timeout, falta de cache, pool de conexões esgotado ou thread pool saturado. Corrijo e meço de novo.

</details>

**8. Como testaria uma rota que salva um registro no banco e publica um evento?**
<sub>Aula [13 — Testes em Node: unitários, integração e mocks](../aulas/13-testes-em-node.md)</sub>
<details><summary>Ver resposta</summary>

Separaria o teste unitário da regra, com banco e publisher substituídos, do teste de integração com banco temporário e transporte controlado. Verificaria sucesso, rollback e falha ao publicar; se gravação e publicação precisarem ser atômicas, usaria outbox e testaria a retomada do publisher. Também fixaria relógio e ids para resultados determinísticos.

</details>

**9. Como desenharia notificações ao vivo para usuários conectados a várias instâncias Node?**
<sub>Aula [14 — Tempo real: WebSocket, SSE e escala](../aulas/14-tempo-real-websocket-e-sse.md)</sub>
<details><summary>Ver resposta</summary>

A API autentica a conexão, associa o usuário a um canal e recebe eventos de domínio por uma fila ou broker. Um adapter pub/sub distribui o evento entre instâncias e cada uma o envia aos sockets locais; para clientes que só recebem, SSE pode simplificar. Eu definiria reconexão, autorização por canal, idempotência, métricas de conexões e um fallback de leitura após desconexão.

</details>
