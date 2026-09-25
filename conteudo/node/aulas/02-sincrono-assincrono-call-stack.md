# Aula 02 — Síncrono, assíncrono, bloqueante e a Call Stack

> **Objetivo:** entender como o JavaScript executa código linha a linha, o que é a *call stack*, e a diferença entre síncrono/assíncrono e bloqueante/não bloqueante. É a base pra entender o Event Loop na próxima aula.

---

## 1. Como o JavaScript executa código: a Call Stack

A **call stack** (pilha de chamadas) é onde o motor (V8) controla **qual função está executando agora**.

Funciona como uma pilha de pratos:
- Chamou uma função → coloca um prato em cima (**push**).
- A função terminou → tira o prato de cima (**pop**).
- Só o prato do **topo** está sendo executado.

```js
function multiplicar(a, b) {
  return a * b;
}

function quadrado(n) {
  return multiplicar(n, n);
}

function imprimirQuadrado(n) {
  const resultado = quadrado(n);
  console.log(resultado);
}

imprimirQuadrado(4);
```

A pilha vai ficando assim:

```
1) [imprimirQuadrado]
2) [imprimirQuadrado, quadrado]
3) [imprimirQuadrado, quadrado, multiplicar]
4) [imprimirQuadrado, quadrado]          ← multiplicar terminou
5) [imprimirQuadrado]                    ← quadrado terminou
6) [imprimirQuadrado, console.log]
7) []                                    ← pilha vazia
```

Pontos importantes:
- Existe **uma** call stack só (porque o JS roda numa thread só).
- Enquanto a pilha **não estiver vazia**, nada mais roda. Nenhum callback, nenhuma outra requisição.
- Se uma função chama a si mesma sem parar (recursão infinita), a pilha estoura: **`RangeError: Maximum call stack size exceeded`**. Isso é o famoso **stack overflow**.

---

## 2. Código síncrono

**Síncrono** = uma coisa depois da outra, e a próxima linha só roda quando a anterior termina.

```js
console.log('1');
const dados = fs.readFileSync('arquivo-grande.txt'); // espera ler o arquivo TODO
console.log('2');
```

O `readFileSync` **segura a thread** até terminar de ler. Enquanto isso, o seu servidor **não atende mais ninguém**.

Num script que roda uma vez (um CLI, um script de migração), isso não tem problema nenhum. Num servidor com várias requisições, é um desastre.

---

## 3. Código assíncrono

**Assíncrono** = você dispara a operação, **segue em frente**, e o resultado chega depois (via callback, Promise ou `await`).

```js
console.log('1');
fs.readFile('arquivo-grande.txt', (err, dados) => {
  console.log('3 - terminou de ler');
});
console.log('2');
```

Saída:
```
1
2
3 - terminou de ler
```

O que aconteceu:
1. `console.log('1')` roda.
2. `fs.readFile` **entrega** a leitura pra libuv e registra o callback. Retorna na hora.
3. `console.log('2')` roda. A call stack esvazia.
4. Quando o arquivo termina de ser lido, o callback é colocado numa fila, e o **Event Loop** o coloca na call stack.

---

## 4. Bloqueante vs não bloqueante

Parecido com síncrono/assíncrono, mas o foco é outro:

- **Bloqueante (blocking):** a operação **impede** a thread de fazer qualquer outra coisa até terminar.
- **Não bloqueante (non-blocking):** a operação **retorna imediatamente** e a thread fica livre.

Na documentação do Node, a regra é:
> Métodos que terminam com **`Sync`** (`readFileSync`, `execSync`, `pbkdf2Sync`) são **bloqueantes**. Evite em código de servidor.

### Cuidado: nem todo código "síncrono" é I/O
Um `for` com 1 bilhão de iterações também é bloqueante. Não tem I/O nenhum, mas ocupa a thread principal. Isso é trabalho **CPU-bound** bloqueando o Event Loop.

```js
app.get('/lento', (req, res) => {
  let total = 0;
  for (let i = 0; i < 5_000_000_000; i++) total += i; // trava TODAS as requisições
  res.send(String(total));
});
```

Enquanto essa rota roda, **qualquer outra requisição** pro servidor fica esperando, até um simples `/health`.

---

## 5. Juntando tudo: o modelo mental certo

```
┌──────────────┐     entrega I/O      ┌──────────────────┐
│  Call Stack  │ ───────────────────▶ │ libuv / SO       │
│  (seu JS)    │                      │ (faz o trabalho) │
└──────────────┘                      └────────┬─────────┘
       ▲                                       │ terminou
       │  Event Loop coloca na pilha           ▼
       │  quando ela está VAZIA        ┌──────────────────┐
       └────────────────────────────── │ Fila de callbacks│
                                       └──────────────────┘
```

1. Seu código roda na call stack.
2. Operações de I/O são entregues pra libuv/sistema operacional.
3. Quando terminam, o callback vai pra uma fila.
4. O Event Loop só pega da fila quando a call stack está **vazia**.

Consequência direta: **se o seu código nunca esvazia a pilha (loop pesado), nenhum callback roda**. É por isso que o Node "trava".

---

## 6. Como falar na entrevista

**"Qual a diferença entre síncrono e assíncrono?"**
> "Síncrono executa em sequência e a próxima instrução espera a anterior terminar. Assíncrono dispara a operação e continua a execução; o resultado é tratado depois, por callback, Promise ou async/await. No Node isso é crucial, porque como o JavaScript roda numa única thread, uma operação síncrona demorada bloqueia o Event Loop e o servidor para de atender outras requisições."

**"O que é a call stack?"**
> "É a estrutura LIFO onde o motor controla as funções em execução. Cada chamada empilha um frame, cada retorno desempilha. Como só existe uma call stack no Node, callbacks assíncronos só são executados quando ela esvazia, e quem faz essa ponte é o Event Loop."

---

## 7. Resumo

- **Call stack**: pilha LIFO das funções em execução. Uma só.
- **Stack overflow**: recursão sem fim estoura a pilha.
- **Síncrono**: espera terminar. **Assíncrono**: dispara e segue.
- **Bloqueante**: prende a thread. Métodos `*Sync` são bloqueantes.
- Loop pesado de CPU também bloqueia, mesmo sem I/O.
- Callbacks só rodam quando a pilha está **vazia**.

## Termos desta aula
call stack · frame · LIFO · stack overflow · síncrono · assíncrono · bloqueante · não bloqueante · callback · CPU-bound

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 02** e separadas por nível.
