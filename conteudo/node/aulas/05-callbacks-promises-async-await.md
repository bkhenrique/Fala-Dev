# Aula 05 — Callbacks, Promises e async/await

> **Objetivo:** entender a evolução do código assíncrono em JavaScript, como Promises funcionam por dentro, como tratar erros e como executar várias operações ao mesmo tempo do jeito certo.

---

## 1. Callbacks: o começo de tudo

**Callback** é uma função que você passa pra outra função, pra ela chamar quando terminar.

```js
fs.readFile('config.json', 'utf8', (err, conteudo) => {
  if (err) return console.error(err);
  console.log(conteudo);
});
```

O Node adotou uma convenção chamada **error-first callback**: o **primeiro** argumento é sempre o erro (ou `null`), os seguintes são o resultado.

### O problema: Callback Hell
Quando uma operação depende da outra, o código vai entortando pra direita:

```js
buscarUsuario(id, (err, usuario) => {
  if (err) return tratar(err);
  buscarPedidos(usuario.id, (err, pedidos) => {
    if (err) return tratar(err);
    buscarPagamento(pedidos[0].id, (err, pagamento) => {
      if (err) return tratar(err);
      enviarEmail(usuario, pagamento, (err) => {
        if (err) return tratar(err);
        console.log('feito');
      });
    });
  });
});
```

Isso é o **callback hell** (ou *pyramid of doom*). Problemas:
- Difícil de ler e manter.
- Tratamento de erro repetido em todo nível.
- Fácil esquecer de tratar um erro ou chamar o callback duas vezes.

---

## 2. Promises

Uma **Promise** é um objeto que representa um valor que **ainda não existe**, mas vai existir no futuro (ou vai falhar).

> Analogia: a senha que você recebe no fast food. Você ainda não tem o lanche, mas tem uma "promessa" de que ele vem. Quando fica pronto, você é chamado. Ou avisam que acabou o ingrediente.

### Os 3 estados
- **pending** (pendente): ainda esperando.
- **fulfilled** (resolvida): deu certo, tem um valor.
- **rejected** (rejeitada): deu erro, tem um motivo.

Quando sai de *pending*, ela está **settled** (finalizada) e **nunca mais muda** de estado.

### Consumindo
```js
buscarUsuario(id)
  .then(usuario => buscarPedidos(usuario.id))
  .then(pedidos => buscarPagamento(pedidos[0].id))
  .then(pagamento => console.log(pagamento))
  .catch(err => tratar(err))       // pega erro de QUALQUER etapa acima
  .finally(() => fecharConexao()); // roda sempre
```

Ganhos:
- Código **encadeado** (*chaining*) e linear em vez de aninhado.
- **Um** `.catch` pra toda a cadeia: o erro "cai" até o primeiro catch.

### Criando uma Promise
```js
function esperar(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}
```

E pra transformar funções antigas de callback em Promise, existe o `util.promisify`, ou use as versões prontas: `require('fs/promises')`.

---

## 3. async/await

`async/await` é **açúcar sintático** sobre Promises: deixa o código assíncrono com cara de síncrono.

```js
async function processarPedido(id) {
  try {
    const usuario = await buscarUsuario(id);
    const pedidos = await buscarPedidos(usuario.id);
    const pagamento = await buscarPagamento(pedidos[0].id);
    await enviarEmail(usuario, pagamento);
  } catch (err) {
    tratar(err);
  }
}
```

Regras:
- Uma função `async` **sempre retorna uma Promise**. Se você der `return 5`, ela retorna `Promise<5>`.
- `await` pausa **a função** (não a thread!) até a Promise resolver. A thread fica livre pra outras coisas enquanto isso.
- Erro em Promise aguardada vira `throw`, e você trata com `try/catch`.

> Importante: `await` **não bloqueia o Node**. Ele só pausa aquela função. O Event Loop continua atendendo outras requisições.

---

## 4. Executando em paralelo (concorrência) do jeito certo

### O erro mais comum: await em sequência sem necessidade
```js
// LENTO: 3 chamadas independentes esperando uma a outra
const usuario = await buscarUsuario(id);      // 100ms
const produtos = await buscarProdutos();       // 100ms
const banners = await buscarBanners();         // 100ms
// total: ~300ms
```

Se as operações **não dependem** uma da outra, dispare todas e espere juntas:

```js
const [usuario, produtos, banners] = await Promise.all([
  buscarUsuario(id),
  buscarProdutos(),
  buscarBanners(),
]);
// total: ~100ms
```

### Os combinadores de Promise

| Método | Resolve quando | Rejeita quando | Uso típico |
|---|---|---|---|
| `Promise.all` | **todas** resolvem | **qualquer uma** rejeita (fail-fast) | Preciso de todos os resultados |
| `Promise.allSettled` | **todas** terminam (sucesso ou erro) | nunca | Quero saber o resultado de cada uma, mesmo com falhas |
| `Promise.race` | a **primeira** que terminar (sucesso ou erro) | a primeira que terminar for erro | Timeout: corrida entre a operação e um timer |
| `Promise.any` | a **primeira que der sucesso** | **todas** falharem | Várias fontes redundantes, pego a mais rápida que funcionou |

Exemplo de timeout com `race`:
```js
const resultado = await Promise.race([
  chamarProviderIA(prompt),
  esperar(10_000).then(() => { throw new Error('timeout'); }),
]);
```

### Cuidado com `Promise.all` em listas enormes
```js
await Promise.all(dezMilIds.map(id => buscarNoBanco(id)));
```
Isso dispara **10.000 queries ao mesmo tempo**, pode esgotar o pool de conexões do banco ou tomar *rate limit* de uma API. O certo é **limitar a concorrência** (processar em lotes, ou usar bibliotecas como `p-limit`).

---

## 5. Tratamento de erros assíncronos

### Erro não tratado
```js
async function falha() { throw new Error('boom'); }
falha(); // ninguém deu await nem .catch
```
Isso gera uma **unhandled promise rejection**. Desde o **Node 15**, isso **derruba o processo** por padrão. Sempre trate: `await` dentro de `try/catch`, ou `.catch()`.

### try/catch não pega callback
```js
try {
  setTimeout(() => { throw new Error('x'); }, 0);
} catch (e) {
  // NUNCA chega aqui: quando o callback roda, o try/catch já acabou
}
```
Porque quando o callback executa, a call stack original já foi embora.

### Esquecer o await
```js
try {
  salvarNoBanco(dados); // sem await!
} catch (err) {
  // erro do salvarNoBanco NÃO é capturado aqui
}
```
Um dos bugs mais comuns. O linter (`@typescript-eslint/no-floating-promises`) ajuda a pegar.

---

## 6. Como falar na entrevista

**"Qual a diferença entre callback, Promise e async/await?"**
> "São três formas de lidar com código assíncrono. Callbacks foram o padrão original do Node, com a convenção error-first, mas geram callback hell e tratamento de erro espalhado. Promises representam um valor futuro com três estados, pending, fulfilled e rejected, e permitem encadear e centralizar o tratamento de erro. async/await é açúcar sintático sobre Promises: deixa o código com cara de síncrono e permite usar try/catch, mas continua não bloqueante, porque o await pausa só a função, não a thread."

**"Como você faria várias chamadas independentes?"**
> "Disparo todas ao mesmo tempo com Promise.all, ou allSettled se uma falha não deve anular as outras. E se for uma lista grande, limito a concorrência pra não estourar o pool do banco ou o rate limit do provider."

---

## 7. Resumo

- **Callback**: função chamada ao terminar; padrão *error-first*; gera **callback hell**.
- **Promise**: valor futuro; estados **pending / fulfilled / rejected**; encadeamento + `.catch` único.
- **async/await**: sintaxe sobre Promises; `await` pausa a função, **não a thread**.
- Operações independentes: **`Promise.all`**, não `await` em sequência.
- `all` (fail-fast) · `allSettled` (todas, sem falhar) · `race` (a primeira) · `any` (a primeira com sucesso).
- **Unhandled rejection** derruba o processo desde o Node 15.
- Muita coisa em paralelo? **Limitar concorrência.**

## Termos desta aula
callback · error-first callback · callback hell · Promise · pending · fulfilled · rejected · settled · chaining · async/await · açúcar sintático · Promise.all · allSettled · race · any · fail-fast · unhandled rejection · promisify · concorrência limitada

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 05** e separadas por nível.
