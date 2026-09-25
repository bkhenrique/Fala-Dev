# Aula 01 — O que é o Node.js (de verdade)

> **Objetivo:** ao final desta aula você consegue explicar o que é o Node, do que ele é feito, por que ele foi criado e quando faz sentido usar (e quando não faz).

---

## 1. O problema que o Node veio resolver

Antes de 2009, o jeito mais comum de um servidor web atender requisições era: **uma thread por conexão**.

Pensa num restaurante onde cada cliente que entra ganha um garçom exclusivo. O garçom anota o pedido, vai até a cozinha e **fica parado lá esperando o prato ficar pronto**. Só depois volta.

Funciona, mas tem um problema: a maior parte do tempo o garçom está **parado esperando**. E cada garçom custa caro (memória). Se entram 10.000 clientes, você precisa de 10.000 garçons.

No mundo do servidor, "esperar a cozinha" é esperar:
- o banco de dados responder,
- uma API externa responder,
- um arquivo ser lido do disco,
- dados chegarem pela rede.

Tudo isso se chama **I/O (Input/Output, entrada e saída)**. E I/O é **muito** lento comparado à CPU: uma consulta ao banco de 5ms é uma eternidade pra um processador que faz bilhões de operações por segundo.

Em 2009, **Ryan Dahl** criou o Node.js com uma ideia diferente:

> E se tivesse **um garçom só**, que anota o pedido, entrega pra cozinha e **vai atender outra mesa** em vez de ficar esperando? Quando o prato fica pronto, a cozinha avisa, e ele leva.

Esse é o coração do Node: **I/O não bloqueante** e **orientado a eventos**.

---

## 2. Definição que você vai falar em entrevista

> **Node.js é um *runtime* (ambiente de execução) de JavaScript fora do navegador, construído sobre o motor V8 e a biblioteca libuv, com um modelo de I/O não bloqueante orientado a eventos.**

Vamos quebrar cada parte dessa frase:

| Parte | O que significa |
|---|---|
| **Runtime** | Não é linguagem nem framework. É o "programa" que executa o seu código JS e dá acesso a coisas do sistema (arquivos, rede, processos). |
| **Fora do navegador** | Antes, JS só rodava no browser. O Node leva JS pro servidor, pro terminal, pra scripts. |
| **V8** | O motor de JavaScript do Google Chrome. É ele quem de fato executa seu código. |
| **libuv** | Biblioteca em C que cuida do I/O assíncrono e implementa o **Event Loop**. |
| **I/O não bloqueante** | Quando você pede algo ao disco/rede, o Node não fica parado esperando. |
| **Orientado a eventos** | O código reage a eventos: "chegou requisição", "terminou de ler o arquivo", "o banco respondeu". |

### Erro comum em entrevista
Dizer "Node é uma linguagem" ou "Node é um framework".
- A **linguagem** é JavaScript (ou TypeScript, que vira JavaScript).
- **Frameworks** como Express, Fastify e NestJS rodam **em cima** do Node.

---

## 3. As peças por dentro

```
┌─────────────────────────────────────────────┐
│          Seu código JavaScript               │
├─────────────────────────────────────────────┤
│   APIs do Node (fs, http, crypto, stream…)   │  ← escritas em JS e C++
├───────────────────────┬─────────────────────┤
│         V8            │        libuv         │
│  executa o JS         │  event loop,         │
│  (compila e roda)     │  I/O assíncrono,     │
│                       │  thread pool         │
├───────────────────────┴─────────────────────┤
│         Sistema operacional                  │
└─────────────────────────────────────────────┘
```

### 3.1 V8
- Criado pelo Google pro Chrome.
- Pega seu JavaScript e transforma em **código de máquina** usando **JIT (Just-In-Time compilation)**: compila em tempo de execução, e otimiza as partes do código que rodam mais vezes (*hot paths*).
- Cuida da **memória** do JavaScript: o **heap** (onde ficam os objetos) e o **Garbage Collector** (que limpa objetos que ninguém mais usa).

> O V8 sozinho **não sabe** ler arquivo nem abrir conexão de rede. Ele só sabe executar JavaScript. Quem dá esses "superpoderes" é o Node.

### 3.2 libuv
- Biblioteca em C, multiplataforma (Linux, Mac, Windows).
- Implementa o **Event Loop** (aula 03).
- Conversa com o sistema operacional pra fazer I/O de forma assíncrona (no Linux usa `epoll`, no Mac `kqueue`, no Windows `IOCP`, mas você não precisa decorar isso, só saber que existe).
- Tem um **thread pool** (por padrão 4 threads) pra operações que o SO não consegue fazer de forma assíncrona, como boa parte das operações de arquivo e algumas de criptografia (aula 04).

### 3.3 APIs do Node (os "módulos nativos")
São os módulos que já vêm com o Node:
- `fs` (arquivos), `http`/`https` (servidor e cliente web), `path`, `os`, `crypto`, `stream`, `events`, `child_process`, `worker_threads`, `zlib`, etc.
- No Node moderno também tem `fetch` nativo, test runner (`node --test`), `--watch` e até execução direta de TypeScript simples.

---

## 4. "Node é single-thread" — verdade ou mentira?

Essa é pergunta clássica. A resposta madura é: **depende do nível que você olha**.

- **O seu código JavaScript** roda em **uma única thread** (a *main thread*). Duas linhas do seu código nunca executam ao mesmo tempo.
- **Por baixo**, o Node **usa várias threads**: o thread pool da libuv, threads do Garbage Collector do V8, etc.

Como falar:
> "O modelo de execução do JavaScript no Node é single-thread, mas o runtime em si não é: a libuv usa um thread pool e o sistema operacional pra fazer I/O em paralelo. Por isso o Node consegue ter alta **concorrência** mesmo com uma única thread executando JS."

---

## 5. Concorrência não é paralelismo

Essa diferença é **muito** cobrada e pouca gente sabe explicar.

- **Concorrência:** lidar com várias coisas **no mesmo período de tempo**, alternando entre elas. Um garçom atendendo 10 mesas.
- **Paralelismo:** fazer várias coisas **exatamente ao mesmo tempo**. 10 garçons, cada um numa mesa.

O Node é excelente em **concorrência** (milhares de conexões esperando I/O), mas o seu JS **não roda em paralelo** por padrão. Pra paralelismo de verdade você usa Worker Threads, Cluster ou mais instâncias (aula 09).

---

## 6. Quando usar Node (e quando não usar)

### Node brilha em cargas **I/O-bound**
Onde o gargalo é **esperar**:
- APIs REST/GraphQL que consultam banco e outras APIs.
- **BFF** (Backend for Frontend): agregar chamadas de vários serviços.
- Aplicações **real-time**: chat, notificações, WebSocket, SSE.
- Streaming de dados.
- Ferramentas de linha de comando e build (Vite, ESLint, etc.).
- Mesma linguagem no front e no back (time fullstack, compartilhar tipos e validações).

### Node sofre em cargas **CPU-bound**
Onde o gargalo é **calcular**:
- Processamento de imagem/vídeo, compressão pesada.
- Cálculos matemáticos grandes, machine learning.
- Criptografia pesada síncrona.

Por quê? Porque enquanto a thread principal está calculando, **ela não atende mais ninguém**. É o garçom único parando pra lavar a louça: o restaurante inteiro trava. Isso se chama **bloquear o Event Loop** (aula 03).

Isso não significa "nunca use Node pra isso", significa "tire esse trabalho da thread principal" (Worker Threads, filas, outro serviço).

---

## 7. Como falar na entrevista

**"O que é Node.js?"**
> "Node é um runtime JavaScript server-side, baseado no V8 e na libuv. O diferencial dele é o modelo de I/O não bloqueante orientado a eventos: com uma única thread executando JavaScript, ele consegue atender milhares de conexões concorrentes, porque não fica parado esperando banco, rede ou disco. Por isso ele é muito bom pra aplicações I/O-bound, como APIs e BFFs, e exige cuidado com tarefas CPU-bound, que precisam sair da thread principal."

**"Por que vocês usaram Node?"** (adapte à sua realidade)
> "A aplicação era majoritariamente I/O-bound: chamadas a banco, a provider de IA e a outros serviços. Node lida muito bem com esse tipo de concorrência, e a gente ganhava por usar TypeScript no front e no back, compartilhando tipos e validação."

---

## 8. Resumo

- Node é **runtime**, não linguagem nem framework.
- **V8** executa JS; **libuv** faz I/O assíncrono e implementa o Event Loop.
- O **seu JS** roda numa thread só; o **runtime** usa várias.
- Node é forte em **concorrência** (I/O-bound), não em **paralelismo** (CPU-bound).
- Tarefa pesada de CPU **bloqueia o Event Loop** e trava todo mundo.

## Termos desta aula
runtime · V8 · libuv · JIT · heap · garbage collector · I/O · I/O não bloqueante · orientado a eventos · single-thread · thread pool · concorrência · paralelismo · I/O-bound · CPU-bound

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 01** e separadas por nível.
