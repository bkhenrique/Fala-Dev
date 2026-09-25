# Node.js — glossário

Cada termo tem três partes: **Em uma frase** (a definição curta), **Traduzindo** (a explicação simples) e **Como falar** (uma frase pronta pra treinar em voz alta). Alguns trazem também **Não confundir com** ou **Cuidado**.

É material de revisão: a explicação completa está nas [aulas](README.md).

---

### Node.js
- **Em uma frase:** *runtime* JavaScript no servidor, construído sobre o motor V8 do Chrome e a libuv, com I/O não bloqueante orientado a eventos.
- **Traduzindo:** é o que permite rodar JavaScript fora do navegador, bom pra lidar com muitas conexões ao mesmo tempo.
- **Como falar:** "Node é ótimo pra aplicações *I/O-bound*, como APIs e BFFs, porque com uma única thread atende milhares de conexões concorrentes sem ficar bloqueado."
- **Não confundir com:** framework. Node é o *runtime*; Express e Nest são frameworks que rodam em cima dele.

### V8
- **Em uma frase:** motor do Google que compila JavaScript pra código de máquina (JIT).
- **Traduzindo:** a peça que realmente executa o seu JS.
- **Como falar:** "O V8 executa o JS; a libuv cuida do I/O assíncrono e do event loop."

### libuv
- **Em uma frase:** biblioteca em C que implementa o event loop e o I/O assíncrono do Node, incluindo um *thread pool*.
- **Traduzindo:** o "motor escondido" que faz o Node não travar esperando disco ou rede.
- **Como falar:** "Algumas operações, como `fs`, `crypto` e DNS, rodam no *thread pool* da libuv, então o Node não é 100% single-thread por baixo."

### Event Loop
- **Em uma frase:** o mecanismo que fica verificando se há callbacks prontos pra executar e os coloca na call stack quando ela está vazia.
- **Traduzindo:** um garçom só que anota o pedido, entrega pra cozinha e vai atender outra mesa; quando o prato fica pronto, ele leva.
- **Como falar:** "O event loop permite concorrência com uma única thread: enquanto uma operação de I/O está pendente, ele segue processando outros eventos."
- **Fases (pra impressionar):** timers → pending callbacks → poll → check (`setImmediate`) → close callbacks. Entre elas rodam as microtasks (`process.nextTick` e Promises).

### I/O não bloqueante
- **Em uma frase:** a operação de I/O é disparada e o código segue em frente; o resultado chega depois via callback/Promise.
- **Traduzindo:** você pede a pizza por telefone e continua vendo TV, em vez de ficar parado na porta.
- **Como falar:** "O ganho do Node vem do I/O não bloqueante, não de paralelismo de CPU."

### Bloquear o Event Loop
- **Em uma frase:** executar código síncrono pesado que impede o event loop de atender outras requisições.
- **Traduzindo:** o garçom único parou pra lavar louça, e o restaurante inteiro espera.
- **Como falar:** "Um `JSON.parse` gigante, criptografia síncrona ou um loop pesado bloqueiam o event loop e aumentam a latência de **todas** as requisições."

### Microtask vs Macrotask
- **Em uma frase:** microtasks (Promises, `process.nextTick`) rodam logo após a operação atual, antes da próxima macrotask (`setTimeout`, `setImmediate`, I/O).
- **Traduzindo:** microtask é "fura-fila", roda antes do próximo item da fila normal.
- **Como falar:** "Por isso um `.then()` sempre executa antes de um `setTimeout(fn, 0)`."

### CPU-bound vs I/O-bound
- **Em uma frase:** CPU-bound = o gargalo é processamento (cálculo, compressão, imagem); I/O-bound = o gargalo é espera (banco, rede, disco).
- **Traduzindo:** CPU-bound é fazer conta; I/O-bound é esperar resposta.
- **Como falar:** "Node brilha em I/O-bound. Pra CPU-bound eu tiro da thread principal com Worker Threads ou mando pra uma fila."

### Worker Threads
- **Em uma frase:** módulo nativo que roda JS em threads paralelas dentro do mesmo processo.
- **Traduzindo:** contratar ajudantes pro garçom fazerem o trabalho pesado sem ele parar de atender.
- **Como falar:** "Uso Worker Threads pra tarefas CPU-heavy, como processar imagem, sem bloquear o event loop."
- **Não confundir com:** BullMQ Worker (ver abaixo).

### BullMQ Worker
- **Em uma frase:** processo que consome jobs de uma fila BullMQ armazenada no Redis.
- **Traduzindo:** um funcionário que pode estar em outra máquina, pegando tarefas de um quadro compartilhado.
- **Como falar:** "Worker Thread é paralelismo *dentro* do processo; BullMQ Worker é processamento *distribuído*, com persistência, retry e escala entre máquinas."

### Cluster
- **Em uma frase:** módulo que cria vários processos Node (um por núcleo) compartilhando a mesma porta.
- **Traduzindo:** abrir várias cópias do restaurante no mesmo endereço, uma por cozinha disponível.
- **Como falar:** "Em produção prefiro escalar com containers e load balancer em vez de cluster, mas cluster/PM2 aproveita todos os cores de uma máquina."

### Streams
- **Em uma frase:** processamento de dados em pedaços (*chunks*), sem carregar tudo na memória.
- **Traduzindo:** beber a água pelo canudo em vez de virar o balde.
- **Como falar:** "Usei streams pra exportar um CSV grande sem estourar a memória, com *backpressure* controlando o fluxo."

### EventEmitter
- **Em uma frase:** classe que implementa o padrão *publish/subscribe* dentro do processo (`on`, `emit`).
- **Traduzindo:** um sino: quem está ouvindo reage quando ele toca.
- **Como falar:** "Muitos módulos do Node, como streams e HTTP, são baseados em EventEmitter."

### CommonJS vs ES Modules
- **Em uma frase:** CommonJS usa `require`/`module.exports` (carregamento síncrono); ESM usa `import`/`export` (padrão oficial do JS, estático e assíncrono).
- **Traduzindo:** dois jeitos de importar arquivos; ESM é o moderno.
- **Como falar:** "ESM permite *tree shaking* e é o padrão; CommonJS ainda aparece muito por legado."

### Semver e lockfile
- **Em uma frase:** semver = versão `MAJOR.MINOR.PATCH`; lockfile = trava as versões exatas instaladas.
- **Traduzindo:** MAJOR quebra, MINOR adiciona, PATCH corrige. O lockfile garante que todo mundo instala a mesma coisa.
- **Como falar:** "Commito o lockfile pra ter *builds* reproduzíveis."


### Test runner node:test
- **Em uma frase:** runner de testes embutido no Node, com testes, subtestes, hooks e assertions.
- **Traduzindo:** o kit básico de testes que já vem com o runtime.
- **Como falar:** "Começo com node:test e substituo dependências externas na fronteira; integração precisa validar os componentes reais."

### Mock e stub
- **Em uma frase:** substitutos controlados para uma dependência durante um teste.
- **Traduzindo:** um dublê com respostas combinadas.
- **Como falar:** "Mock ajuda a simular falhas e verificar interação, mas não prova que a integração real funciona."

### WebSocket
- **Em uma frase:** protocolo persistente e bidirecional sobre uma conexão iniciada por handshake HTTP.
- **Traduzindo:** uma linha aberta em que cliente e servidor podem falar a qualquer momento.
- **Como falar:** "Uso WebSocket quando a interação precisa ser bidirecional e frequente, como num chat."

### Server-Sent Events (SSE)
- **Em uma frase:** fluxo unidirecional de eventos do servidor ao cliente sobre HTTP.
- **Traduzindo:** uma transmissão ao vivo que o navegador pode reconectar.
- **Como falar:** "SSE simplifica notificações em que só o servidor precisa empurrar dados; o cliente envia ações por HTTP normal."

### Adapter pub/sub
- **Em uma frase:** integração que distribui eventos de WebSocket entre instâncias de uma aplicação.
- **Traduzindo:** o canal comum que permite às réplicas avisarem umas às outras.
- **Como falar:** "Com várias réplicas, uso adapter compartilhado e autorizo cada canal; memória local não alcança todos os sockets."
