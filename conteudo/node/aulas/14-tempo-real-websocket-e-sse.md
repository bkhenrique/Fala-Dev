# Aula 14 — Tempo real em Node: WebSocket, Socket.IO, SSE e como escalar

> **Objetivo:** saber implementar e explicar comunicação em tempo real em Node (SSE, WebSocket, Socket.IO), autenticar conexões, lidar com conexões que caem, e principalmente escalar isso com várias instâncias usando pub/sub no Redis.

Os conceitos gerais (polling × SSE × WebSocket) estão em [Fundamentos, aula 03](../../fundamentos/aulas/03-apis-rest-graphql-grpc-tempo-real.md). Aqui é **como fazer e escalar em Node**.

---

## 1. O problema

Chat, notificações, progresso de um job, painel ao vivo, edição colaborativa: o servidor precisa **empurrar** dados pro cliente sem que ele pergunte a cada segundo.

O Node é muito bom nisso: como o I/O não bloqueia (aulas 03 e 04), **milhares de conexões abertas** custam pouco, porque nenhuma thread fica parada esperando. O desafio de verdade aparece quando você tem **mais de uma instância** da aplicação.

---

## 2. SSE: o servidor empurra, por HTTP

**Server-Sent Events** é uma resposta HTTP que **não termina**: o servidor vai escrevendo eventos no formato texto.

```js
app.get("/pedidos/:id/eventos", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const enviar = (evento) => res.write(`id: ${evento.id}\nevent: status\ndata: ${JSON.stringify(evento)}\n\n`);
  assinarStatusDoPedido(req.params.id, enviar);

  const heartbeat = setInterval(() => res.write(": ping\n\n"), 15_000);
  req.on("close", () => { clearInterval(heartbeat); cancelarAssinatura(req.params.id, enviar); });
});
```

No navegador, `new EventSource(url)`, que **reconecta sozinho** e manda o `Last-Event-ID` pra retomar de onde parou.

- **Uma direção** (servidor → cliente); o cliente fala por requisições normais.
- É HTTP comum: passa por proxies, load balancers e CDN, e funciona com HTTP/2.
- Ideal pra: progresso de job, notificações, **streaming de resposta de IA** (token a token).
- Cuidados: **heartbeat** pra proxies não fecharem a conexão ociosa; **limpar** assinaturas no `close` (senão vaza memória, aula 07); desativar buffering do proxy (ex.: header `X-Accel-Buffering: no` no Nginx).

---

## 3. WebSocket: bidirecional

**WebSocket** começa como uma requisição HTTP que pede **upgrade** do protocolo; depois disso, vira uma conexão **full-duplex** persistente: os dois lados mandam mensagens quando quiserem, com pouco overhead por mensagem.

```js
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ server });
wss.on("connection", (socket, req) => {
  socket.on("message", (dados) => { /* mensagem do cliente */ });
  socket.send(JSON.stringify({ tipo: "boas-vindas" }));
});
```

A biblioteca **`ws`** é a implementação padrão em Node, crua e rápida. Você cuida de reconexão, salas, formato das mensagens e heartbeat.

### Socket.IO
Uma camada **em cima** do WebSocket (com protocolo próprio) que traz pronto:
- **Reconexão automática** e fallback pra long polling quando o WebSocket é bloqueado.
- **Eventos nomeados** (`socket.emit("pedido:atualizado", dados)`), **acks** (confirmação de recebimento).
- **Salas** (*rooms*) e **namespaces**: mandar pra todos de uma sala (`io.to("pedido:42").emit(...)`).
- **Adapters** pra escalar em várias instâncias (seção 5).

Trade-off: cliente e servidor precisam falar Socket.IO (um cliente WebSocket comum não conecta direto), e há um pouco mais de overhead.

### Qual escolher?
| Situação | Escolha |
|---|---|
| Só o servidor empurra (notificação, progresso, streaming de IA) | **SSE** |
| Os dois lados conversam muito (chat, jogo, colaboração) | **WebSocket** |
| Quer salas, reconexão e escala prontas | **Socket.IO** |
| Atualização rara e simples | Polling pode bastar |

---

## 4. Autenticação e segurança

- **Autentique no handshake**: valide o token (cookie de sessão ou token enviado na conexão) **antes** de aceitar. No navegador não dá pra mandar header `Authorization` customizado na API nativa de WebSocket; usa-se cookie, um token de uso único obtido antes via HTTP, ou o `auth` do Socket.IO.
- **Verifique a `Origin`** na conexão WebSocket: sem isso, outro site pode abrir conexão usando os cookies da vítima (*Cross-Site WebSocket Hijacking*, parente do CSRF).
- **Autorize cada mensagem e cada sala**: entrar na sala `pedido:42` exige ser dono do pedido 42.
- **Valide o conteúdo** das mensagens (Zod) e aplique **rate limit** por conexão.
- Tokens expiram: decida o que fazer com conexões longas (revalidar periodicamente ou desconectar).

---

## 5. Escalando com várias instâncias

Com **uma** instância, a conexão da Ana e a do Bruno estão no mesmo processo, e mandar mensagem de um pro outro é fácil. Com **três** réplicas atrás de um load balancer:

```
Ana ──── Instância A          Bruno ──── Instância C
```

A instância A **não tem** a conexão do Bruno. Como a mensagem chega?

### Pub/Sub entre instâncias
Cada instância **publica** eventos num **broker** e **assina** o que interessa; quem tem a conexão do destinatário entrega:

```
Instância A ──publish "sala:pedido:42"──▶ Redis Pub/Sub ──▶ Instâncias A, B, C
                                                         └─ C tem o Bruno → entrega
```

- No **Socket.IO**, o **Redis adapter** (`@socket.io/redis-adapter`) faz isso de forma transparente: `io.to(sala).emit()` alcança sockets de todas as instâncias.
- Com `ws` ou SSE, você mesmo assina o canal no Redis (ou NATS, Kafka) e repassa às conexões locais.
- Redis Pub/Sub **não guarda** mensagens: quem estava desconectado perde. Se não pode perder, use **Redis Streams** ou outro broker com persistência, e o cliente pede o que faltou ao reconectar (o `Last-Event-ID` do SSE ajuda nisso).

### Sticky sessions
O **long polling** do Socket.IO faz várias requisições HTTP que precisam cair na **mesma instância**, então exige **sticky sessions** no load balancer. Se o transporte for só WebSocket, a conexão é uma só e isso deixa de ser problema.

### Outras preocupações de escala
- **Deploy e restart**: todas as conexões daquela instância caem. O cliente precisa **reconectar com backoff e jitter**; senão, milhares de clientes reconectam no mesmo segundo (*thundering herd*).
- **Graceful shutdown**: avisar os clientes e fechar as conexões aos poucos.
- **Limites**: file descriptors do sistema operacional, memória por conexão, timeouts de ociosidade do load balancer (heartbeat resolve).
- **Backpressure**: cliente lento acumula mensagens no buffer do servidor; monitore `socket.bufferedAmount` e descarte ou desconecte.
- Em escala muito grande, serviços gerenciados (Ably, Pusher, API Gateway WebSocket da AWS) tiram esse trabalho da aplicação.

---

## 6. Como falar na entrevista

**"Como você escalaria WebSocket com várias instâncias?"**
> "O problema é que a conexão de cada usuário vive em uma instância só. Então as instâncias precisam trocar mensagens por um pub/sub, normalmente o Redis: quem recebe o evento publica no canal da sala, todas as instâncias recebem, e a que tem a conexão do destinatário entrega. No Socket.IO isso é o Redis adapter. Se não pode perder mensagem, uso algo com persistência, como Redis Streams, e o cliente pede o que perdeu ao reconectar. Também cuido de sticky session se houver long polling, heartbeat pros timeouts do load balancer, e reconexão do cliente com backoff e jitter pra não virar thundering herd depois de um deploy."

**"SSE ou WebSocket?"**
> "SSE quando só o servidor precisa empurrar dados, como progresso de job, notificação ou streaming de resposta de IA: é HTTP comum, passa por proxy e o EventSource reconecta sozinho retomando pelo último id. WebSocket quando os dois lados conversam o tempo todo, como chat ou colaboração. Socket.IO se eu quiser salas, reconexão e escala com Redis prontos."

---

## 7. Resumo

- Node aguenta **muitas conexões abertas** (I/O não bloqueante); o difícil é **várias instâncias**.
- **SSE**: `text/event-stream`, servidor → cliente, `EventSource` reconecta com `Last-Event-ID`; heartbeat e limpeza no `close`.
- **WebSocket**: upgrade de HTTP, full-duplex; lib **`ws`**. **Socket.IO**: eventos, acks, salas, reconexão, adapters.
- Segurança: autenticar no **handshake**, verificar **Origin**, autorizar **cada sala e mensagem**, validar e limitar.
- Escala: **pub/sub (Redis adapter)** entre instâncias; **Redis Streams** se não pode perder; **sticky sessions** com long polling; reconexão com **backoff + jitter**; heartbeat; backpressure; graceful shutdown.

## Termos desta aula
tempo real · SSE · text/event-stream · EventSource · Last-Event-ID · heartbeat · WebSocket · upgrade · full-duplex · ws · Socket.IO · evento · ack · sala · namespace · handshake · Origin · Cross-Site WebSocket Hijacking · pub/sub · Redis adapter · Redis Streams · sticky session · long polling · thundering herd · backoff · jitter · backpressure · bufferedAmount · graceful shutdown

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 14** e separadas por nível.
