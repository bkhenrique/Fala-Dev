# Aula 07 — EventEmitter e a arquitetura orientada a eventos

> **Objetivo:** entender o `EventEmitter`, que é a base de boa parte do Node (streams, HTTP, sockets), o padrão *publish/subscribe* por trás dele, e os cuidados (vazamento de memória, erros).

---

## 1. A ideia

Na aula 01 dissemos que o Node é "orientado a eventos". O `EventEmitter` é a peça que implementa isso **no nível do seu código**.

> Analogia: um sino. Várias pessoas ficam **escutando** o sino. Quando alguém **toca** o sino, todo mundo que estava escutando reage. Quem toca não precisa saber quem está ouvindo.

Esse padrão se chama **Observer** (observador) ou **publish/subscribe (pub/sub)**:
- **Emissor / publisher**: avisa que algo aconteceu (`emit`).
- **Ouvinte / listener / subscriber**: reage ao evento (`on`).

O ganho é **desacoplamento**: quem emite não conhece quem ouve.

---

## 2. Usando

```js
import { EventEmitter } from 'node:events';

const pedidos = new EventEmitter();

pedidos.on('pedido:criado', (pedido) => {
  console.log('enviar e-mail para', pedido.email);
});

pedidos.on('pedido:criado', (pedido) => {
  console.log('atualizar estoque de', pedido.itens.length, 'itens');
});

pedidos.emit('pedido:criado', { email: 'a@b.com', itens: [1, 2] });
```

Métodos principais:
- **`on(evento, fn)`** (ou `addListener`): registra um ouvinte.
- **`once(evento, fn)`**: ouve **uma vez só** e se remove.
- **`emit(evento, ...args)`**: dispara o evento.
- **`off(evento, fn)`** (ou `removeListener`): remove um ouvinte.
- **`removeAllListeners(evento)`**.

Normalmente você **estende** a classe:
```js
class Fila extends EventEmitter {
  adicionar(job) {
    // ...
    this.emit('job:adicionado', job);
  }
}
```

---

## 3. Ponto que muita gente erra: `emit` é SÍNCRONO

```js
emissor.on('evento', () => console.log('B'));
console.log('A');
emissor.emit('evento');
console.log('C');
```

Saída: `A, B, C`.

O `emit` chama os ouvintes **na hora, em sequência, na mesma call stack**, na ordem em que foram registrados. Não passa pelo Event Loop. Consequências:
- Um ouvinte pesado **bloqueia** quem emitiu.
- Se um ouvinte lançar erro, ele **sobe pra quem chamou `emit`**.
- Se quiser que o ouvinte rode depois, você mesmo agenda (`setImmediate`, `queueMicrotask`).

---

## 4. O evento especial `'error'`

Se você emitir `'error'` e **não houver nenhum ouvinte** pra ele, o Node **lança a exceção** e, se ninguém tratar, o processo cai.

```js
emissor.emit('error', new Error('falhou')); // sem .on('error') → crash
```

Regra: **todo EventEmitter que pode emitir erro deve ter um `.on('error')`**. Isso vale pra streams, sockets, conexões de banco, clients de Redis, etc.

---

## 5. Vazamento de memória com listeners

Cada `on` guarda uma referência pra função. Se você registra ouvintes e **nunca remove**, eles se acumulam.

Exemplo clássico: registrar ouvinte dentro de uma rota.

```js
app.get('/status', (req, res) => {
  eventosGlobais.on('atualizacao', (dado) => { /* ... */ }); // um NOVO a cada request!
  res.send('ok');
});
```

Depois de 10 requisições, o Node avisa:
```
MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
11 atualizacao listeners added.
```

O limite padrão é **10 ouvintes por evento**. O aviso é um alarme de **memory leak** (vazamento de memória). A correção **não** é aumentar o limite com `setMaxListeners`, e sim remover o ouvinte quando não precisa mais (`off`, `once`, ou remover quando a conexão fechar).

---

## 6. Onde o EventEmitter aparece no Node

Quase tudo que "emite coisas ao longo do tempo" é um EventEmitter:
- **`http.Server`**: evento `'request'`, `'connection'`, `'close'`.
- **Streams** (aula 08): `'data'`, `'end'`, `'error'`, `'finish'`.
- **`process`**: `'exit'`, `'SIGTERM'`, `'uncaughtException'`, `'unhandledRejection'`.
- **Sockets**, `child_process`, clients de Redis e de banco.
- **BullMQ**: `worker.on('completed')`, `worker.on('failed')`.

---

## 7. EventEmitter vs mensageria de verdade

O EventEmitter funciona **dentro do mesmo processo**, **em memória**:
- Se o processo cair, os eventos se perdem.
- Outra instância da API (outra máquina) **não recebe** o evento.
- Não tem retry, persistência, nem garantia de entrega.

Quando você precisa de eventos **entre serviços ou instâncias**, usa um **message broker**: Redis Pub/Sub, filas (BullMQ, RabbitMQ, SQS) ou Kafka.

Como falar:
> "EventEmitter é pub/sub em memória, dentro do processo. Serve pra desacoplar módulos internamente. Se o evento precisa sobreviver a queda ou chegar em outras instâncias, uso um broker, como uma fila no Redis ou Kafka."

---

## 8. Resumo

- `EventEmitter` implementa **Observer / pub-sub** no processo.
- `on`, `once`, `emit`, `off`.
- **`emit` é síncrono**: ouvintes rodam na hora, em ordem.
- Evento **`'error'` sem ouvinte derruba** o processo.
- Listener registrado e nunca removido = **memory leak** (`MaxListenersExceededWarning`, limite 10).
- É base de streams, http, process, sockets.
- Em memória só; entre instâncias → **message broker**.

## Termos desta aula
EventEmitter · evento · listener · emit · observer · publish/subscribe · desacoplamento · memory leak · MaxListenersExceededWarning · message broker

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 07** e separadas por nível.
