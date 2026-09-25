# Aula 10 — HTTP no Node e como o Express funciona

> **Objetivo:** entender o que acontece quando uma requisição chega num servidor Node, como o módulo `http` funciona, e o que é o padrão de middleware que Express (e Nest por baixo) usa.

---

## 1. O servidor HTTP "cru"

Sem framework nenhum, um servidor Node é assim:

```js
import http from 'node:http';

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true }));
  }
  res.writeHead(404);
  res.end();
});

server.listen(3000);
```

O que tem aqui:
- **`http.createServer`** cria um servidor (que é um **EventEmitter**; a função que você passa é um ouvinte do evento `'request'`).
- **`req`** (*IncomingMessage*) é um **Readable stream**: o corpo da requisição chega em pedaços.
- **`res`** (*ServerResponse*) é um **Writable stream**: você escreve a resposta.

Ler o body na mão:
```js
let body = '';
req.on('data', chunk => body += chunk);
req.on('end', () => {
  const dados = JSON.parse(body);
});
```

Você percebe que roteamento, parse de JSON, tratamento de erro, tudo é manual. É isso que os frameworks resolvem.

---

## 2. O ciclo de vida de uma requisição

```
Cliente
  │  1. conexão TCP (+ TLS se HTTPS)
  ▼
Sistema operacional aceita a conexão
  │  2. libuv avisa o Event Loop (fase poll)
  ▼
Node faz o parse do HTTP (método, URL, headers)
  │  3. emite 'request'
  ▼
Seu código (framework → middlewares → rota → handler)
  │  4. normalmente faz I/O: banco, cache, API externa (não bloqueia)
  ▼
res.end() → resposta volta pelo socket
```

Enquanto o passo 4 espera o banco, o Event Loop está livre atendendo **outras** requisições. É assim que um processo atende milhares de conexões.

### Keep-alive
Por padrão o HTTP/1.1 mantém a conexão TCP aberta depois da resposta (**keep-alive**), pra reaproveitar em próximas requisições e evitar o custo de abrir conexão (e handshake TLS) toda vez.

---

## 3. Express e o padrão Middleware

**Express** é um framework minimalista em cima do `http`. O conceito central é o **middleware**.

**Middleware** é uma função que recebe `(req, res, next)` e pode:
1. Executar qualquer código.
2. Modificar `req` e `res` (ex: colocar `req.user`).
3. **Encerrar** a requisição (responder).
4. Ou chamar **`next()`** pra passar pro próximo middleware.

```js
const app = express();

app.use(express.json());                 // middleware: faz parse do body JSON
app.use(logger);                         // middleware: loga a requisição
app.use('/admin', autenticar);           // middleware só pra /admin

app.get('/admin/relatorio', (req, res) => {  // handler final da rota
  res.json({ usuario: req.user });
});

app.use((err, req, res, next) => {       // middleware de ERRO (4 parâmetros)
  res.status(500).json({ erro: 'interno' });
});

function autenticar(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).end(); // encerra aqui
  req.user = validar(token);
  next();                                   // segue a cadeia
}
```

A requisição passa por uma **cadeia (pipeline)** de funções, **na ordem em que foram registradas**:

```
request → json() → logger → autenticar → handler → response
                                  │
                                  └─ sem token → 401 (para aqui)
```

> Analogia: uma linha de montagem. Cada estação faz uma coisa e passa adiante, ou tira a peça da linha.

Esse padrão também se chama **Chain of Responsibility** (cadeia de responsabilidade).

### Pra que servem middlewares
Coisas que **toda** (ou muitas) rota precisa, chamadas de **cross-cutting concerns** (preocupações transversais):
- Parse de body, CORS, compressão.
- Autenticação, rate limiting.
- Logging, correlation id, métricas.
- Tratamento de erro centralizado.

Assim a regra de negócio da rota fica limpa.

### Middleware de erro
Tem **4 parâmetros** `(err, req, res, next)`. Quando um middleware chama `next(err)` ou lança erro, o Express pula direto pros middlewares de erro.

> Pegadinha: no **Express 4**, erro dentro de função `async` (Promise rejeitada) **não** é capturado automaticamente, você precisa de `try/catch` + `next(err)`. No **Express 5** isso foi resolvido.

---

## 4. Express vs Fastify vs NestJS

| | O que é | Destaque |
|---|---|---|
| **Express** | Minimalista, o mais popular | Simples, ecossistema gigante, pouca estrutura |
| **Fastify** | Minimalista focado em performance | Mais rápido, validação e serialização por **JSON Schema**, plugins |
| **NestJS** | Framework **opinativo** com arquitetura | Módulos, injeção de dependência, TypeScript. Roda **sobre** Express ou Fastify |

---

## 5. Boas práticas de um servidor HTTP em Node

- **Timeouts** em toda chamada externa (senão uma API lenta prende recursos pra sempre).
- **Validar input** na borda (Zod, class-validator, JSON Schema).
- **Não bloquear** o Event Loop dentro dos handlers.
- **Tratamento de erro centralizado**, sem vazar stack trace em produção.
- **Health check** (`/health`) pro load balancer/orquestrador.
- **Graceful shutdown** (aula 12).
- Headers de segurança (ex: `helmet`), CORS restrito, rate limit.

---

## 6. Como falar na entrevista

**"O que é um middleware?"**
> "É uma função na cadeia de processamento da requisição, que recebe request, response e next. Ela pode ler e alterar a requisição, encerrar a resposta ou passar pro próximo. É o lugar certo pra cross-cutting concerns como autenticação, logging, parse de body e tratamento de erro, deixando os handlers só com a regra de negócio. É basicamente o padrão Chain of Responsibility."

---

## 7. Resumo

- `http.createServer`: `req` é **Readable**, `res` é **Writable**, servidor é **EventEmitter**.
- Enquanto a rota espera I/O, o Event Loop atende outras requisições.
- **Keep-alive** reaproveita conexão TCP.
- **Middleware** = `(req, res, next)`; executa em ordem; pode encerrar ou chamar `next()`.
- Middleware de erro tem **4 parâmetros**.
- Express 4 não captura erro de async sozinho; Express 5 sim.
- Middlewares = lugar de **cross-cutting concerns**.

## Termos desta aula
http.createServer · IncomingMessage · ServerResponse · request lifecycle · TCP · TLS · keep-alive · Express · middleware · next · pipeline · Chain of Responsibility · cross-cutting concerns · error handler · Fastify · JSON Schema · timeout · health check

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 10** e separadas por nível.
