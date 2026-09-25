# Aula 09 — Paralelismo e escala: Worker Threads, Child Process, Cluster e containers

> **Objetivo:** saber como fazer o Node usar mais de um núcleo de CPU, quando usar cada ferramenta, e como uma aplicação Node escala em produção.

---

## 1. O limite de um processo Node

Um processo Node executa seu JavaScript em **um núcleo** de CPU. Se o servidor tem 8 núcleos, sem fazer nada você usa 1/8 do poder de processamento pro seu código.

Pra I/O-bound, isso raramente é problema. Mas aparecem duas necessidades:
1. **Uma tarefa pesada** (CPU-bound) que não pode travar a API → paralelizar **dentro** do processo.
2. **Mais volume de requisições** do que um núcleo aguenta → rodar **mais processos/instâncias**.

Cada uma tem sua ferramenta.

---

## 2. Worker Threads: paralelismo dentro do processo

`worker_threads` cria **threads de verdade** que executam **JavaScript** em paralelo, no mesmo processo.

```js
// main.js
import { Worker } from 'node:worker_threads';

function gerarRelatorioPesado(dados) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./relatorio-worker.js', import.meta.url), {
      workerData: dados,
    });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}

// relatorio-worker.js
import { parentPort, workerData } from 'node:worker_threads';
const resultado = calculoCaro(workerData);
parentPort.postMessage(resultado);
```

Como funciona:
- Cada worker tem **seu próprio V8 isolado** e **seu próprio Event Loop**.
- **Não compartilham variáveis**. Se comunicam por **mensagens** (`postMessage`), e os dados são **copiados** (*structured clone*).
- Exceção: `SharedArrayBuffer` permite memória compartilhada de verdade (com `Atomics` pra sincronizar), mas é caso avançado.

Quando usar:
- Processamento de imagem, compressão, parsing pesado, criptografia síncrona, cálculos.

Cuidados:
- Criar worker tem custo (subir um V8 novo). Pra várias tarefas, use um **pool de workers** (ex: biblioteca `piscina`).
- **Não** ajuda em I/O: pra I/O o Event Loop já resolve.

---

## 3. Child Process: rodar outro programa

`child_process` cria um **processo filho**, separado, com memória própria. Serve pra executar **outros programas** (ffmpeg, Python, comandos do sistema) ou outro script Node.

| Função | O que faz |
|---|---|
| `spawn` | Executa um comando e te dá **streams** de stdout/stderr. Bom pra saídas grandes ou longas. |
| `exec` | Executa num **shell** e devolve a saída inteira em buffer. Cuidado com **command injection** se tiver input do usuário. |
| `execFile` | Como `exec`, mas sem shell (mais seguro). |
| `fork` | Especial pra outro script **Node**, com canal de mensagens embutido (IPC). |

Worker Thread vs Child Process:
- **Worker**: mais leve, mesmo processo, pra rodar **JS** seu.
- **Child process**: mais pesado, isolamento total (se ele crashar, o pai não cai), pra rodar **outros programas**.

---

## 4. Cluster: vários processos na mesma porta

O módulo `cluster` cria **vários processos Node** (normalmente **um por núcleo**) que **compartilham a mesma porta**.

```js
import cluster from 'node:cluster';
import os from 'node:os';

if (cluster.isPrimary) {
  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork();
  cluster.on('exit', () => cluster.fork()); // reinicia se morrer
} else {
  iniciarServidorHttp(); // cada worker sobe o mesmo servidor
}
```

- O processo **primary** distribui as conexões entre os **workers**.
- Cada worker é um processo completo, com memória separada.
- Na prática, muita gente usa o **PM2** (`pm2 start app.js -i max`), que faz o cluster e também reinicia, gerencia logs e faz *zero-downtime reload*.

Consequência importante: como cada processo tem **memória separada**, **não dá pra guardar estado em memória** (sessão, cache local, contador) e esperar que os outros vejam. A aplicação precisa ser **stateless**.

---

## 5. Em produção moderna: containers e escala horizontal

Hoje, o jeito mais comum de escalar Node **não** é cluster, é:

```
                    ┌──────────────┐
Internet ─────────▶ │ Load Balancer│
                    └──────┬───────┘
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   [Container Node]  [Container Node]  [Container Node]    ← réplicas iguais, stateless
          │                │                │
          └────────┬───────┴────────┬───────┘
                   ▼                ▼
              [Postgres]        [Redis]                     ← estado compartilhado
```

- **Um processo Node por container**, e o orquestrador (Kubernetes, ECS, Cloud Run) roda **N réplicas**.
- Um **load balancer** distribui as requisições.
- **Autoscaling**: sobe ou desce réplicas conforme CPU, latência ou tamanho de fila.
- O estado fica **fora** dos processos: banco, Redis, storage (S3).

Isso é **escalabilidade horizontal**. A alternativa, aumentar a máquina, é **escalabilidade vertical**, que tem teto e custo alto.

Por que containers em vez de cluster? Porque o orquestrador já faz o papel do cluster (reiniciar, distribuir, escalar) e de forma entre **várias máquinas**, não só dentro de uma.

---

## 6. Qual ferramenta para qual problema

| Problema | Solução |
|---|---|
| Uma rota faz cálculo pesado e trava a API | **Worker Threads** (ou jogar pra fila) |
| Preciso rodar ffmpeg/Python/comando do sistema | **Child Process** (`spawn`/`execFile`) |
| Quero usar todos os núcleos de **uma** máquina | **Cluster / PM2** |
| Preciso atender muito mais tráfego, com alta disponibilidade | **Containers + load balancer + réplicas** |
| Tarefa demorada que pode rodar depois, com retry | **Fila + workers** (aula 11) |

---

## 7. Como falar na entrevista

**"Como fazer o Node usar todos os núcleos?"**
> "Um processo Node executa JavaScript em um núcleo. Pra usar mais, tenho duas frentes. Pra paralelizar trabalho CPU-bound dentro da aplicação, uso Worker Threads, de preferência com um pool, e eles se comunicam por mensagens. Pra escalar throughput, rodo vários processos: com cluster ou PM2 numa máquina, ou, o mais comum hoje, containers com várias réplicas atrás de um load balancer. Em todos os casos a aplicação precisa ser stateless, porque cada processo tem memória separada."

---

## 8. Resumo

- Um processo Node = **um núcleo** executando JS.
- **Worker Threads**: JS em paralelo, V8 isolado, comunicação por mensagem. Pra CPU-bound.
- **Child Process**: outro processo/programa; `spawn`, `exec`, `execFile`, `fork`.
- **Cluster/PM2**: vários processos na mesma porta, numa máquina.
- **Containers + LB + réplicas**: escala horizontal moderna.
- Vários processos ⇒ **stateless**, estado em banco/Redis.

## Termos desta aula
paralelismo · núcleo · worker threads · workerData · postMessage · structured clone · SharedArrayBuffer · pool de workers · child process · spawn · exec · fork · IPC · command injection · cluster · primary · PM2 · zero-downtime · container · orquestrador · réplica · load balancer · autoscaling · escalabilidade horizontal · escalabilidade vertical · stateless

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 09** e separadas por nível.
