# Aula 12 — Node em produção: erros, memória, shutdown e observabilidade

> **Objetivo:** saber o que muda quando a aplicação sai da sua máquina: como o processo lida com erros fatais, como desligar sem perder requisições, como achar vazamento de memória e como enxergar o que está acontecendo.

---

## 1. Erros que derrubam o processo

### `uncaughtException`
Uma exceção lançada que **ninguém capturou** sobe até o topo e o Node **encerra o processo**.

### `unhandledRejection`
Uma Promise rejeitada sem `.catch`/`try-catch`. Desde o **Node 15**, também **encerra o processo** por padrão.

Dá pra ouvir esses eventos:
```js
process.on('uncaughtException', (err) => {
  logger.fatal(err, 'erro não tratado');
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'promise rejeitada sem tratamento');
  process.exit(1);
});
```

Regra de ouro: **use pra logar e encerrar, não pra "continuar como se nada tivesse acontecido"**. Depois de um erro não tratado, o estado da aplicação é desconhecido (conexão pela metade, transação aberta). O certo é **deixar cair** e o orquestrador (Kubernetes, PM2, ECS) **sobe um processo novo**. Isso se chama filosofia **fail-fast** / *let it crash*.

### Erros operacionais vs erros de programação
- **Operacional**: esperado no mundo real. Banco fora do ar, timeout, input inválido. → **Tratar** (retry, resposta 4xx/5xx, fallback).
- **De programação**: bug. `undefined is not a function`, lógica errada. → **Corrigir o código**; em runtime, fail-fast.

---

## 2. Graceful shutdown (desligamento gracioso)

Em produção, o processo é desligado o tempo todo: deploy, autoscaling reduzindo réplicas, reinício. O orquestrador manda o sinal **`SIGTERM`** e espera um tempo antes de forçar com `SIGKILL`.

Se o processo simplesmente morrer, requisições em andamento são **cortadas** e jobs ficam pela metade.

**Graceful shutdown** = ao receber o sinal:
1. **Parar de aceitar** novas requisições/jobs.
2. **Terminar** as que estão em andamento.
3. **Fechar** conexões (banco, Redis, filas).
4. Sair com `process.exit(0)`.

```js
process.on('SIGTERM', async () => {
  logger.info('SIGTERM recebido, desligando');
  server.close();                 // para de aceitar conexões, espera as ativas
  await worker.close();           // BullMQ: termina o job atual e para de pegar novos
  await db.end();
  await redis.quit();
  process.exit(0);
});
```

Junto com isso, **health checks**:
- **Liveness**: "o processo está vivo?" Se falhar, o orquestrador reinicia.
- **Readiness**: "está pronto pra receber tráfego?" Durante o boot e o shutdown responde "não", e o load balancer para de mandar requisição.

---

## 3. Memória e memory leaks

### Como a memória do Node funciona
- O **heap do V8** guarda objetos JS. Tem um limite (configurável com `--max-old-space-size`).
- O **Garbage Collector** libera objetos que **não têm mais referência**.
- Ele é **geracional**: objetos novos ficam na *young generation* (coletada com frequência, rápido); os que sobrevivem vão pra *old generation* (coletada menos vezes, mais caro).

### O que é memory leak
É quando objetos que você **não usa mais** continuam **referenciados**, então o GC não pode liberar. A memória só sobe, até o processo morrer com:
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

### Causas mais comuns
- **Cache em memória sem limite** (`const cache = {}` que só cresce). Use LRU com tamanho máximo ou TTL, ou Redis.
- **Listeners de eventos** registrados e nunca removidos (aula 07).
- **Variáveis globais** acumulando dados.
- **Closures** segurando objetos grandes.
- **Timers/intervals** nunca limpos (`setInterval` sem `clearInterval`).

### Como investigar
1. Observar a métrica de memória: se sobe sempre e **nunca volta** depois do GC, é leak.
2. Tirar **heap snapshots** em momentos diferentes (`node --inspect` + Chrome DevTools, ou `--heapsnapshot-signal`).
3. **Comparar** os snapshots e ver quais objetos só crescem.

---

## 4. Performance e profiling

- **CPU profiling**: `node --prof`, `node --inspect` + DevTools, **clinic.js**, **flame graphs** (mostram em que função o tempo é gasto).
- **Event loop lag**: métrica essencial pra Node (aula 03).
- **Pool de conexões** do banco: poucas conexões = requisições esperando; muitas = banco sobrecarregado.
- **Timeouts** em tudo que é externo.

---

## 5. Configuração: variáveis de ambiente

Seguindo a metodologia **12-Factor App**, configuração fica em **variáveis de ambiente**, não no código:
- `process.env.DATABASE_URL`, `process.env.PORT`.
- Arquivo `.env` só em desenvolvimento (Node moderno lê direto com `--env-file=.env`; antes se usava `dotenv`). **Nunca commitar segredos.**
- **Validar** as variáveis no boot (ex: com Zod) e falhar cedo se faltar alguma.
- `NODE_ENV=production` ativa otimizações em várias bibliotecas (ex: Express desativa mensagens de erro detalhadas).

---

## 6. Observabilidade

Os **três pilares**:
- **Logs**: eventos. Em produção, **logs estruturados em JSON** (bibliotecas **pino**, winston), com nível (`info`, `warn`, `error`) e um **correlation id** / request id pra seguir uma requisição.
- **Métricas**: números no tempo. Latência (**p95/p99**), taxa de erro, throughput, uso de memória, event loop lag, tamanho das filas.
- **Traces**: o caminho de uma requisição passando por vários serviços (**OpenTelemetry**, Jaeger, Datadog APM).

> Logar com `console.log` em produção funciona, mas é síncrono em alguns destinos e não é estruturado. `pino` é o padrão de mercado por ser rápido.

---

## 7. Segurança básica

- Validar e sanitizar **todo input**.
- Nunca montar SQL concatenando string (**SQL injection**): usar queries parametrizadas / ORM.
- Cuidado com `exec` + input do usuário (**command injection**).
- Regex com input do usuário (**ReDoS**).
- Rate limiting, headers de segurança (`helmet`), CORS restrito.
- `npm audit` e dependências atualizadas.
- Não rodar o container como root.

---

## 8. Como falar na entrevista

**"Como você garante um deploy sem derrubar requisições?"**
> "Implemento graceful shutdown: ao receber SIGTERM, o servidor para de aceitar conexões, termina as requisições em andamento, o worker termina o job atual, e aí fecho banco e Redis. Junto com isso, um readiness probe que passa a responder não-pronto, pro load balancer tirar a instância da rotação antes. Com rolling update, sempre há réplicas saudáveis atendendo."

**"Como investigaria um memory leak?"**
> "Primeiro confirmo pela métrica: memória subindo continuamente sem voltar depois do GC. Aí tiro heap snapshots em momentos diferentes e comparo pra ver quais objetos só crescem. Os culpados mais comuns são cache em memória sem limite, listeners que nunca são removidos e timers não limpos."

---

## 9. Resumo

- `uncaughtException` / `unhandledRejection`: **logar e encerrar** (fail-fast), o orquestrador reinicia.
- Erro **operacional** (tratar) vs **de programação** (corrigir).
- **Graceful shutdown** no `SIGTERM`: parar de aceitar, terminar, fechar conexões.
- **Liveness** vs **readiness**.
- **Memory leak** = referência esquecida; investigar com **heap snapshots**.
- Config em **variáveis de ambiente** (12-Factor), validadas no boot.
- Observabilidade: **logs estruturados, métricas, traces**.

## Termos desta aula
uncaughtException · unhandledRejection · fail-fast · erro operacional · erro de programação · SIGTERM · SIGKILL · graceful shutdown · liveness probe · readiness probe · rolling update · heap · garbage collector · young/old generation · memory leak · heap snapshot · profiling · flame graph · 12-Factor App · variável de ambiente · NODE_ENV · log estruturado · correlation id · p95/p99 · OpenTelemetry · SQL injection · command injection

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 12** e separadas por nível.
