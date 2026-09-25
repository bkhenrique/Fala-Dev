# Aula 08 — Programação assíncrona: Promises e `async`/`await`

> **Objetivo:** explicar o contrato de uma Promise, encadeamento, tratamento de rejeição e a relação entre sintaxe assíncrona e o host.

---

## 1. O que uma Promise representa

Uma `Promise` representa o resultado futuro de uma operação assíncrona. Ela começa pendente e termina cumprida (*fulfilled*) com um valor ou rejeitada (*rejected*) com um motivo. Depois de liquidada, não muda de estado.

Promise é parte da linguagem ECMAScript, mas não torna uma operação automaticamente paralela ou não bloqueante. A API que inicia trabalho de rede, temporizador ou I/O normalmente vem do host.

## 2. Encadeamento

`.then()` registra uma reação para cumprimento e pode também receber tratamento de rejeição. Cada chamada a `.then()` retorna uma nova Promise: o valor retornado pelo callback cumpre essa nova Promise; uma exceção lançada a rejeita; retornar outra Promise faz a cadeia aguardar seu resultado.

`.catch()` é uma forma de registrar tratamento de rejeição. `.finally()` roda após cumprimento ou rejeição e normalmente preserva o resultado, salvo se lançar erro ou retornar uma Promise rejeitada.

## 3. `async` e `await`

Uma função `async` sempre retorna uma Promise. `await` suspende a continuação daquela função assíncrona até a Promise ser liquidada; não bloqueia a thread do host enquanto espera. Uma rejeição aguardada se comporta como exceção naquele ponto e pode ser tratada com `try...catch`.

```js
async function carregarUsuario(id) {
  try {
    const resposta = await buscarUsuario(id); // API fornecida pelo host/aplicação
    return resposta;
  } catch (erro) {
    throw new Error("Não foi possível carregar o usuário", { cause: erro });
  }
}
```

## 4. Sequencial ou concorrente

Dois `await`s em sequência iniciam e aguardam as operações em ordem. Se forem independentes, iniciar ambas antes de aguardar com `Promise.all()` permite que progridam concorrentemente. `Promise.all()` rejeita quando qualquer entrada rejeita; `Promise.allSettled()` espera todas e informa cada resultado. Concorrência não significa que o JavaScript executou callbacks simultaneamente em várias threads.

## 5. Limite entre linguagem e Event Loop

ECMAScript define jobs e comportamento de Promises, mas detalhes de filas de tarefas, temporizadores e APIs assíncronas integram a especificação do host. O Event Loop e a interação com libuv são estudados na trilha [Node.js](../../node/README.md); não se deve tratar o loop do Node como regra universal de JavaScript.

## 6. Como falar na entrevista

**“`async`/`await` torna o código síncrono?”**
> “Não. É sintaxe para trabalhar com Promises de forma sequencial e legível. `await` suspende a continuação da função assíncrona, e não bloqueia por si só o host. O modelo de tarefas depende do ambiente; no Node, isso inclui o Event Loop do Node.”

## 7. Resumo

- Promise tem estados pendente, cumprido ou rejeitado; após liquidar, não muda.
- Cada `then` cria uma nova Promise e propaga valores ou erros.
- Função `async` sempre retorna Promise; `await` trata rejeição como exceção.
- `Promise.all` permite aguardar operações independentes em concorrência.
- APIs e detalhes do Event Loop dependem do host; Promise é recurso ECMAScript.

## Termos desta aula
Promise · pendente · cumprida · rejeitada · encadeamento · `then` · `catch` · `finally` · `async` · `await` · concorrência · `Promise.all` · Event Loop

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 08** e separadas por nível.

### Para aprofundar
[Promises — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) · [Async functions — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) · [Jobs and Host Operations — ECMAScript](https://tc39.es/ecma262/#sec-jobs)
