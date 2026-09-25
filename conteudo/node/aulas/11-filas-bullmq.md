# Aula 11 — Filas e processamento em background com BullMQ

> **Objetivo:** entender por que e quando tirar trabalho da requisição, como uma fila funciona (producer, consumer, job), e os conceitos que todo entrevistador pergunta: retry, backoff, DLQ, idempotência, concorrência e rate limit.

---

## 1. O problema

Imagine uma rota que, ao receber um documento, chama um provider de IA que leva **40 segundos** pra responder.

Se fizer isso **dentro da requisição**:
- O usuário fica 40s esperando, e o navegador, proxy ou load balancer pode dar **timeout** antes.
- Se o provider falhar, a requisição inteira falha, e o usuário tem que tentar de novo.
- Um pico de 5.000 documentos dispara 5.000 chamadas simultâneas e toma **rate limit** do provider.
- A API fica segurando conexões e memória.

A solução: **processamento assíncrono com fila**.

```
Cliente ──POST /documentos──▶ API ──add job──▶ [ FILA no Redis ] ──▶ Worker ──▶ Provider IA
   ▲                           │                                        │
   └──── 202 Accepted + jobId ─┘                                        ▼
   ▲                                                                salva resultado
   └──────── acompanha status (polling / SSE / webhook) ◀───────────────┘
```

1. A API **valida** e **enfileira** o trabalho, e responde na hora com **`202 Accepted`** + um `jobId`.
2. Um **worker** (outro processo) pega o job e processa no ritmo dele.
3. O cliente acompanha o status (polling, SSE ou webhook).

---

## 2. Vocabulário

| Termo | Significado |
|---|---|
| **Fila (queue)** | Lista ordenada de tarefas esperando processamento (FIFO por padrão). |
| **Job** | Uma tarefa na fila: nome + dados (payload) + opções. |
| **Producer** | Quem **coloca** jobs na fila (normalmente a API). |
| **Consumer / Worker** | Quem **tira** e processa os jobs. |
| **Broker** | O sistema que armazena e entrega as mensagens (aqui, o Redis). |
| **Desacoplamento** | API e processamento independentes: um pode cair, escalar ou ser alterado sem afetar o outro. |

---

## 3. BullMQ na prática

**BullMQ** é uma biblioteca de filas para Node que usa **Redis** como armazenamento.

```js
import { Queue, Worker } from 'bullmq';
const connection = { host: 'localhost', port: 6379 };

// PRODUCER (na API)
const filaIA = new Queue('analise-documento', { connection });

app.post('/documentos', async (req, res) => {
  const job = await filaIA.add('analisar', { documentoId: req.body.id }, {
    jobId: `doc-${req.body.id}`,       // evita job duplicado pro mesmo documento
    attempts: 5,                        // até 5 tentativas
    backoff: { type: 'exponential', delay: 2000 }, // 2s, 4s, 8s, 16s…
    removeOnComplete: 1000,             // não deixa o Redis crescer pra sempre
  });
  res.status(202).json({ jobId: job.id });
});

// CONSUMER (processo separado)
const worker = new Worker('analise-documento', async (job) => {
  const resultado = await chamarProviderIA(job.data.documentoId);
  await salvarResultado(job.data.documentoId, resultado);
  return resultado;
}, {
  connection,
  concurrency: 10,                      // até 10 jobs ao mesmo tempo neste worker
  limiter: { max: 50, duration: 1000 }, // no máximo 50 jobs/segundo (respeita o provider)
});

worker.on('failed', (job, err) => log.error({ jobId: job.id, err }));
```

### Os estados de um job
```
waiting ──▶ active ──▶ completed
   ▲           │
   │           ▼
delayed ◀── (falhou, ainda tem tentativa)
               │
               ▼ (acabaram as tentativas)
             failed
```
- **waiting**: na fila, esperando worker.
- **active**: um worker está processando.
- **delayed**: agendado pra depois (retry com backoff, ou job com `delay`).
- **completed** / **failed**: finalizado.

---

## 4. Os conceitos que caem em entrevista

### Retry
Tentar de novo quando falha. Faz sentido pra **falhas transitórias** (timeout, 503, 429, rede instável). **Não** faz sentido pra erro permanente (dados inválidos): tentar de novo não vai resolver. Nesse caso, falhe de vez (no BullMQ, `UnrecoverableError`).

### Backoff exponencial
Aumentar o intervalo entre as tentativas: 2s, 4s, 8s, 16s…
- Se o provider está sobrecarregado, **martelar** piora. Esperar dá tempo dele se recuperar.
- **Jitter**: adicionar um valor aleatório ao intervalo, pra que mil jobs que falharam juntos não tentem de novo **exatamente** ao mesmo tempo (*thundering herd*).

### DLQ (Dead Letter Queue)
O lugar pra onde vão os jobs que **esgotaram as tentativas**. No BullMQ, eles ficam no estado **failed** (que funciona como DLQ), ou você move pra uma fila separada. Serve pra:
- Não perder o job.
- Não travar a fila com um job "envenenado" (*poison message*) tentando pra sempre.
- **Alertar**, investigar e **reprocessar** manualmente depois da correção.

### Idempotência
Filas geralmente garantem entrega **at-least-once** (pelo menos uma vez), ou seja, **o mesmo job pode ser processado mais de uma vez**. Exemplo: o worker processou, cobrou o cliente, e caiu antes de marcar como concluído → o job volta pra fila → cobra de novo.

Por isso o processamento precisa ser **idempotente**: rodar 2 vezes tem o mesmo efeito que rodar 1.

Técnicas:
- **`jobId` determinístico** pra não enfileirar duplicado.
- **Chave de idempotência** e checagem "já processei isso?" antes de agir.
- **Constraint única** no banco (a segunda inserção falha e você ignora).
- Operações naturalmente idempotentes (`UPDATE status = 'pago'` em vez de `saldo = saldo - 10`).

### Stalled jobs (worker caiu no meio)
O worker mantém um **lock** no job enquanto processa e vai renovando. Se o worker morrer, o lock expira, o BullMQ detecta o job como **stalled** e o devolve pra fila. Outra razão pra ser idempotente.

### Concorrência e rate limit
- **`concurrency`**: quantos jobs **um** worker processa ao mesmo tempo.
- **Mais workers** (processos/containers) = mais vazão total.
- **`limiter`**: limite global de jobs por intervalo, pra respeitar o rate limit de um provider externo.

A fila funciona como um **amortecedor** (*buffer*): um pico de 10.000 jobs entra na fila de uma vez, mas sai num ritmo controlado.

---

## 5. Outros recursos úteis

- **Jobs com atraso** (`delay`): "manda esse e-mail daqui a 1 hora".
- **Jobs repetidos** (cron): "gera relatório todo dia às 3h".
- **Prioridade**: jobs de cliente premium primeiro.
- **Flows**: job pai que só roda depois que os filhos terminam.
- **Progresso**: `job.updateProgress(50)`, que dá pra repassar pro cliente via SSE.

---

## 6. Trade-offs (fale disso!)

Ganhos:
- Tempo de resposta baixo, resiliência (retry sem o usuário perceber), controle de vazão, escala independente.

Custos:
- **Mais infraestrutura**: Redis pra operar e monitorar (e ele precisa de persistência configurada pra não perder jobs).
- **Consistência eventual**: o resultado não está pronto na hora da resposta.
- **Complexidade**: status, notificação ao cliente, idempotência, observabilidade da fila (tamanho, jobs falhos, tempo de espera).

---

## 7. Como falar na entrevista

**"Por que usar Redis + BullMQ?"**
> "Pra tirar da requisição um trabalho lento ou instável, como a chamada ao provider de IA. A API enfileira e responde 202 com um jobId; workers separados consomem. Isso me dá tempo de resposta baixo, retry com backoff exponencial pra falhas transitórias, DLQ pros jobs que esgotam as tentativas, e controle de vazão com concurrency e rate limiter, pra não estourar o limite do provider. Como a entrega é at-least-once, o processamento é idempotente. O trade-off é mais infraestrutura e consistência eventual."

---

## 8. Resumo

- Fila = **desacoplar** trabalho lento da requisição; API responde **202**.
- **Producer** enfileira, **worker** consome, **Redis** é o broker.
- Estados: waiting → active → completed / failed (+ delayed).
- **Retry** só pra falha transitória; **backoff exponencial + jitter**.
- **DLQ** pra jobs que esgotaram tentativas.
- Entrega **at-least-once** ⇒ **idempotência** obrigatória.
- **Stalled job**: worker caiu, job volta pra fila.
- **concurrency** + **limiter** = vazão controlada.

## Termos desta aula
fila · job · payload · producer · consumer · worker · broker · desacoplamento · 202 Accepted · polling · SSE · webhook · retry · falha transitória · backoff exponencial · jitter · thundering herd · DLQ · poison message · at-least-once · idempotência · chave de idempotência · stalled job · lock · concurrency · rate limit · consistência eventual

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 11** e separadas por nível.
