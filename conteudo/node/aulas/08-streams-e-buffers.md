# Aula 08 — Buffers, Streams e Backpressure

> **Objetivo:** entender como o Node lida com dados binários (Buffer) e com grandes volumes de dados sem estourar a memória (Streams), e o que é *backpressure*.

---

## 1. Buffer: dados binários

JavaScript nasceu pra manipular texto no navegador. Mas no servidor você lida com **bytes**: arquivos, imagens, dados de rede, criptografia.

**Buffer** é o tipo do Node pra representar uma sequência de **bytes brutos** (tamanho fixo).

```js
const buf = Buffer.from('Olá', 'utf8');
console.log(buf);              // <Buffer 4f 6c c3 a1>
console.log(buf.length);       // 4 bytes (o "á" ocupa 2 em UTF-8)
console.log(buf.toString('base64')); // T2zDoQ==
```

Pontos:
- A memória do Buffer fica **fora do heap do V8** (em memória nativa), por isso é eficiente pra dados grandes.
- **Encoding** é como converter bytes ↔ texto: `utf8`, `base64`, `hex`, `latin1`.
- Tamanho em bytes ≠ número de caracteres (acentos e emojis ocupam mais de 1 byte).

---

## 2. O problema que Streams resolvem

Imagine servir um arquivo de 2 GB:

```js
app.get('/video', async (req, res) => {
  const video = await fs.promises.readFile('video.mp4'); // carrega 2 GB na memória
  res.send(video);
});
```

Com 10 usuários ao mesmo tempo: 20 GB de RAM. O processo morre com **out of memory**. E o usuário só começa a receber depois que o arquivo **inteiro** foi lido.

Com stream:
```js
app.get('/video', (req, res) => {
  fs.createReadStream('video.mp4').pipe(res);
});
```

O arquivo é lido em **pedaços pequenos (chunks)**, cada pedaço é enviado e descartado. O consumo de memória fica **constante** e o usuário começa a receber **na hora**.

> Analogia: encher uma piscina com um balde gigante (precisa de um balde do tamanho da piscina) vs com uma **mangueira** (fluxo contínuo, sem precisar armazenar tudo).

---

## 3. Os 4 tipos de Stream

| Tipo | O que faz | Exemplos |
|---|---|---|
| **Readable** | Fonte de dados (você **lê** dele) | `fs.createReadStream`, `req` (request HTTP no servidor), `process.stdin` |
| **Writable** | Destino de dados (você **escreve** nele) | `fs.createWriteStream`, `res` (response HTTP), `process.stdout` |
| **Duplex** | Lê **e** escreve, de forma independente | Socket TCP |
| **Transform** | Duplex que **transforma** o que passa por ele | `zlib.createGzip()`, criptografia, parser de CSV |

Todos são **EventEmitters** (aula 07): emitem `'data'`, `'end'`, `'error'`, `'finish'`, `'drain'`.

---

## 4. Backpressure (contrapressão)

E se a fonte produz dados **mais rápido** do que o destino consegue consumir? Ex: ler do disco (rápido) e mandar pra um cliente com internet lenta.

Sem controle, os dados se acumulariam em memória esperando, e voltaria o problema que o stream queria resolver.

**Backpressure** é o mecanismo pelo qual o destino avisa "**pera, estou cheio**", e a fonte **pausa** até ele avisar que liberou.

Como funciona por baixo:
- Cada stream tem um buffer interno com limite chamado **`highWaterMark`** (alguns KB).
- `writable.write(chunk)` retorna **`false`** quando o buffer interno passou desse limite: é o sinal pra parar de escrever.
- Quando esvazia, o writable emite **`'drain'`**: pode voltar a escrever.

Fazer isso na mão é chato e fácil de errar. Por isso existe o `pipe` / `pipeline`, que **gerencia o backpressure automaticamente**.

Como falar:
> "Backpressure é o controle de fluxo entre um produtor rápido e um consumidor lento. O write retorna false quando o buffer interno passa do highWaterMark, e o evento drain avisa que dá pra continuar. Usando pipeline, isso é tratado automaticamente."

---

## 5. `pipe` vs `pipeline`

```js
// pipe: encadeia, mas NÃO propaga erro nem destrói os streams se um falhar
fs.createReadStream('entrada.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('entrada.txt.gz'));
```

```js
// pipeline: encadeia, trata backpressure, propaga erro e limpa tudo
import { pipeline } from 'node:stream/promises';

await pipeline(
  fs.createReadStream('entrada.txt'),
  zlib.createGzip(),
  fs.createWriteStream('entrada.txt.gz'),
);
```

Use **`pipeline`**. Com `pipe`, se um stream do meio der erro, os outros podem ficar abertos (vazamento de file descriptor / memória) e o erro pode passar sem tratamento.

---

## 6. Casos reais onde streams aparecem

- **Upload/download** de arquivos grandes (inclusive direto pra S3).
- **Exportar CSV** com milhões de linhas: lê do banco com cursor, transforma em linha CSV, escreve na resposta.
- **Processar arquivo gigante** linha a linha (`readline`).
- **Compressão** (gzip) de respostas HTTP.
- **Streaming de resposta de IA**: o LLM vai mandando tokens e você repassa pro cliente via SSE conforme chegam.
- Streams são **async iterables**, então dá pra usar `for await`:

```js
for await (const chunk of fs.createReadStream('grande.log')) {
  processar(chunk);
}
```

---

## 7. Como falar na entrevista

**"Pra que servem streams?"**
> "Streams processam dados em pedaços em vez de carregar tudo na memória. Isso mantém o uso de memória constante, independente do tamanho do dado, e reduz o tempo até o primeiro byte, porque já começo a enviar enquanto ainda estou lendo. Existem quatro tipos: Readable, Writable, Duplex e Transform. Eu uso pipeline pra encadear, porque ele trata backpressure e propaga erro corretamente."

---

## 8. Resumo

- **Buffer** = bytes brutos, fora do heap do V8, com encoding (`utf8`, `base64`, `hex`).
- **Stream** = processar em **chunks**, memória constante, resposta começa antes.
- 4 tipos: **Readable, Writable, Duplex, Transform**.
- **Backpressure**: consumidor lento freia o produtor; `write()` → `false`, evento `'drain'`, limite `highWaterMark`.
- Use **`pipeline`**, não `pipe` (erro e limpeza).
- Streams são async iterables (`for await`).

## Termos desta aula
Buffer · byte · encoding · UTF-8 · base64 · stream · chunk · Readable · Writable · Duplex · Transform · backpressure · highWaterMark · drain · pipe · pipeline · out of memory · time to first byte · async iterable

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 08** e separadas por nível.
