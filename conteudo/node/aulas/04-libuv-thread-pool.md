# Aula 04 — libuv e o Thread Pool

> **Objetivo:** entender como o Node faz I/O "em paralelo" tendo uma thread só de JavaScript: o que vai pro sistema operacional, o que vai pro thread pool, e por que isso às vezes vira gargalo.

---

## 1. Se o JS é single-thread, quem faz o trabalho?

Na aula 01 vimos que o **seu JS** roda numa thread só, mas o **Node** não. Quando você chama `fs.readFile` ou faz uma query no banco, alguém precisa fazer esse trabalho enquanto a thread principal segue livre.

A libuv usa **dois caminhos** diferentes pra isso:

```
                  Operação assíncrona
                          │
        ┌─────────────────┴──────────────────┐
        ▼                                    ▼
 I/O de REDE                         Arquivo, DNS lookup,
 (TCP, HTTP, sockets)                crypto, zlib
        │                                    │
        ▼                                    ▼
 Mecanismo assíncrono                 THREAD POOL da libuv
 do SISTEMA OPERACIONAL               (4 threads por padrão)
 (epoll / kqueue / IOCP)
        │                                    │
        └──────────────┬─────────────────────┘
                       ▼
          Callback vai pra fila → Event Loop
```

### Caminho 1: o sistema operacional (rede)
Os sistemas operacionais modernos sabem fazer I/O de **rede** de forma assíncrona nativamente. O Node pede: "me avisa quando chegar dado nesse socket". Não precisa de thread nenhuma esperando.

É por isso que o Node aguenta **milhares de conexões HTTP** abertas com pouquíssimos recursos: cada conexão não custa uma thread.

> Chamadas ao banco de dados (Postgres, Mongo, Redis) são **rede** (TCP), então também vão por esse caminho.

### Caminho 2: o thread pool (o resto)
Algumas operações o SO **não** oferece de forma assíncrona (ou não de forma portável). Pra essas, a libuv mantém um **pool de threads** que executa o trabalho bloqueante "nos bastidores" e avisa quando acabar.

Usam o thread pool:
- **`fs`**: quase todas as operações de arquivo (`readFile`, `writeFile`, `stat`…).
- **`dns.lookup`** (resolve nome → IP usando o SO). Atenção: `http.get('https://site.com')` faz um `dns.lookup` antes!
- **`crypto`** assíncrono pesado: `pbkdf2`, `scrypt`, `randomBytes`, geração de chaves.
- **`zlib`** assíncrono: compressão gzip/deflate.

---

## 2. O tamanho do pool: 4 threads

Por padrão o thread pool tem **4 threads**. Dá pra mudar com a variável de ambiente:

```bash
UV_THREADPOOL_SIZE=16 node app.js
```

(máximo 1024; precisa ser definida antes do pool ser usado, então o normal é na inicialização do processo).

### Por que isso importa? Exemplo clássico

```js
const crypto = require('crypto');
const inicio = Date.now();

for (let i = 1; i <= 6; i++) {
  crypto.pbkdf2('senha', 'salt', 100_000, 64, 'sha512', () => {
    console.log(`hash ${i}: ${Date.now() - inicio}ms`);
  });
}
```

Resultado típico:
```
hash 1: 500ms
hash 2: 505ms
hash 3: 510ms
hash 4: 512ms
hash 5: 1000ms   ← esperou uma thread do pool liberar
hash 6: 1003ms
```

Os 4 primeiros rodam em paralelo (4 threads). O 5º e o 6º **esperam na fila** do pool.

### O gargalo escondido
Imagine uma API que, em cada login, faz `bcrypt`/`pbkdf2` (thread pool) e lê um arquivo (thread pool). Com muitos logins simultâneos, o pool enche, e até operações de `fs` e `dns.lookup` de **outras rotas** ficam esperando. A API fica lenta sem a CPU parecer sobrecarregada no JS.

Como falar:
> "O thread pool da libuv tem 4 threads por padrão e é compartilhado entre fs, dns.lookup, crypto e zlib. Sob carga, ele pode virar gargalo, e aí ou aumento o `UV_THREADPOOL_SIZE`, ou tiro esse trabalho do processo da API."

---

## 3. Thread pool ≠ Worker Threads

Não confunda:

| | Thread pool da libuv | Worker Threads |
|---|---|---|
| Quem controla | A libuv, automaticamente | Você, explicitamente (`new Worker()`) |
| O que roda | Operações nativas em C/C++ (fs, crypto…) | **O seu código JavaScript** |
| Pra que serve | Deixar operações do Node assíncronas | Paralelizar trabalho CPU-bound seu |

O thread pool **não** executa o seu JavaScript. Se você tem um `for` pesado, o thread pool não te ajuda. Aí é Worker Threads (aula 09).

---

## 4. Resumo visual do "Node por dentro"

```
┌──────────────────────── Processo Node ────────────────────────┐
│                                                                │
│   Main thread: V8 executando seu JS + Event Loop (libuv)       │
│                                                                │
│   Thread pool libuv: [T1] [T2] [T3] [T4]  ← fs, crypto, zlib   │
│                                                                │
│   Threads do V8: garbage collector, compilação otimizada       │
│                                                                │
└──────────────────────────┬─────────────────────────────────────┘
                           │ sockets de rede
                           ▼
                Sistema operacional (epoll/kqueue/IOCP)
```

---

## 5. Como falar na entrevista

**"Se o Node é single-thread, como ele faz várias operações de I/O ao mesmo tempo?"**
> "O JavaScript roda numa thread, mas o I/O é delegado. Pra rede, a libuv usa os mecanismos assíncronos do sistema operacional, como epoll no Linux, então milhares de conexões não custam milhares de threads. Pra operações que o SO não faz de forma assíncrona, como a maioria das de arquivo, `dns.lookup`, crypto e zlib, a libuv usa um thread pool, que por padrão tem 4 threads. Quando a operação termina, o callback volta pela fila do Event Loop."

---

## 6. Resumo

- Rede (HTTP, banco, Redis) → **SO assíncrono**, sem thread por conexão.
- `fs`, `dns.lookup`, `crypto`, `zlib` → **thread pool** da libuv.
- Pool padrão = **4 threads**, ajustável por `UV_THREADPOOL_SIZE`.
- Pool cheio = gargalo silencioso.
- Thread pool **não** roda seu JS; pra isso são **Worker Threads**.

## Termos desta aula
libuv · thread pool · UV_THREADPOOL_SIZE · epoll · kqueue · IOCP · dns.lookup · pbkdf2 · zlib · gargalo · worker threads

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 04** e separadas por nível.
