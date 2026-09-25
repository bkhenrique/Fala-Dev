# Aula 11 — GraphQL e WebSockets no NestJS

> **Objetivo:** saber criar e explicar uma API GraphQL no Nest (code-first × schema-first, resolvers, DataLoader contra N+1, proteção contra queries caras) e comunicação em tempo real com Gateways (eventos, salas, guards e escala com Redis).

Conceitos gerais: [GraphQL em Fundamentos](../../fundamentos/aulas/03-apis-rest-graphql-grpc-tempo-real.md) e [tempo real em Node](../../node/aulas/14-tempo-real-websocket-e-sse.md).

---

## 1. O problema

REST resolve a maioria das APIs, mas duas necessidades aparecem com frequência:
- **Telas que juntam muitos dados** e clientes diferentes (web, mobile) pedindo formatos diferentes: com REST vira várias chamadas ou endpoints sob medida. **GraphQL** deixa o cliente pedir exatamente os campos que precisa.
- **Tempo real** (chat, notificações, painel ao vivo): o servidor precisa empurrar dados. **WebSockets**.

O Nest tem módulos oficiais pros dois, integrados à mesma DI, guards, pipes e interceptors das aulas anteriores.

---

## 2. GraphQL no Nest

Com `@nestjs/graphql` + um driver (Apollo ou Mercurius), há duas abordagens:

| | Code-first | Schema-first |
|---|---|---|
| Fonte da verdade | **Classes TypeScript** com decorators; o schema `.graphql` é **gerado** | O arquivo **`.graphql`**; os tipos TS são gerados a partir dele |
| Vantagem | Uma fonte só, tipagem forte, cara de Nest | Contrato explícito, bom quando front e back desenham o schema juntos |

Code-first é o mais comum em projetos Nest:

```ts
@ObjectType()
export class Pedido {
  @Field(() => ID) id: string;
  @Field() total: number;
  @Field(() => Cliente) cliente: Cliente;
}

@Resolver(() => Pedido)
export class PedidosResolver {
  constructor(private pedidos: PedidosService, private clientes: ClientesService) {}

  @Query(() => [Pedido])
  pedidos(@Args("status", { nullable: true }) status?: string) {
    return this.pedidos.listar(status);
  }

  @Mutation(() => Pedido)
  criarPedido(@Args("dados") dados: CriarPedidoInput) {       // @InputType validado com class-validator
    return this.pedidos.criar(dados);
  }

  @ResolveField(() => Cliente)
  cliente(@Parent() pedido: Pedido) {                          // resolve o campo "cliente" de cada pedido
    return this.clientes.buscar(pedido.clienteId);
  }
}
```

Vocabulário:
- **Schema**: o contrato tipado da API.
- **Query** (leitura), **Mutation** (escrita), **Subscription** (tempo real, via WebSocket).
- **Resolver**: a função que produz o valor de um campo.
- **`@ResolveField`**: resolve um campo de um tipo (o `cliente` do `Pedido`).

### O problema N+1 no GraphQL
Uma query pedindo 50 pedidos com o cliente de cada um chama o `@ResolveField cliente` **50 vezes**: 1 consulta de pedidos + 50 de clientes.

**DataLoader** resolve agrupando: durante a execução, ele **junta** todos os `load(id)` pedidos no mesmo ciclo e faz **uma** consulta (`WHERE id IN (...)`), com cache por requisição.
```ts
cliente(@Parent() pedido: Pedido, @Context() ctx) {
  return ctx.loaders.clientes.load(pedido.clienteId);   // um loader novo por requisição
}
```
O DataLoader precisa ser criado **por requisição** (pra o cache não vazar dados entre usuários).

### Protegendo a API
Como o cliente monta a query, alguém pode pedir algo enorme e aninhado (`pedidos { cliente { pedidos { cliente { ... } } } }`). Proteções:
- **Limite de profundidade** e **de complexidade** (cada campo tem um custo; a query tem um teto).
- **Paginação obrigatória** em listas.
- **Persisted queries** (só aceitar queries previamente registradas) em APIs públicas.
- Desligar **introspection** em produção, se a API não for pública.
- **Autorização por campo** quando necessário, e guards como no REST (com `GqlExecutionContext` pra acessar o contexto).

### Erros e cache
- GraphQL costuma responder **HTTP 200** com erros no campo `errors` da resposta, e pode devolver dado parcial. Monitoramento e tratamento de erro precisam considerar isso.
- **Cache HTTP** é mais difícil (normalmente tudo é POST no mesmo endpoint): o cache fica no cliente (Apollo Client normaliza por id) ou no servidor por resolver.

---

## 3. WebSockets com Gateways

No Nest, um **Gateway** é a "controller" do tempo real:

```ts
@WebSocketGateway({ cors: { origin: ["https://app.loja.com"] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private auth: AuthService) {}

  async handleConnection(socket: Socket) {
    const usuario = await this.auth.validarToken(socket.handshake.auth.token);
    if (!usuario) return socket.disconnect();          // autentica no handshake
    socket.data.usuario = usuario;
  }

  handleDisconnect(socket: Socket) { /* limpar presença, etc. */ }

  @SubscribeMessage("sala:entrar")
  entrar(@ConnectedSocket() socket: Socket, @MessageBody() dto: EntrarSalaDto) {
    // autorizar: o usuário pode entrar nessa sala?
    socket.join(`pedido:${dto.pedidoId}`);
  }

  notificarPedido(pedidoId: string, evento: StatusPedido) {
    this.server.to(`pedido:${pedidoId}`).emit("pedido:status", evento);
  }
}
```

- Por padrão usa **Socket.IO** (`@nestjs/platform-socket.io`); dá pra usar `ws` puro com outro adapter.
- `@SubscribeMessage` define o handler de um evento; **pipes, guards, interceptors e filters** funcionam aqui também (com `WsException` pros erros).
- **Salas** (`socket.join`) pra mandar só pra quem interessa.
- Outros módulos (um service de pedidos, um consumidor de fila) injetam o gateway ou emitem eventos internos que ele escuta, e ele envia pros clientes.

### Escalando
Com várias réplicas, cada conexão vive numa instância só. Use o **Redis adapter** do Socket.IO (um `IoAdapter` customizado com `@socket.io/redis-adapter`), pra `server.to(sala).emit()` alcançar todas as instâncias. E cuide de **sticky sessions** se houver long polling, heartbeat e reconexão com backoff (detalhes na [aula 14 de Node](../../node/aulas/14-tempo-real-websocket-e-sse.md)).

### GraphQL Subscriptions
Alternativa ao gateway quando a API já é GraphQL: `@Subscription` com um **PubSub** (em produção, baseado em Redis, porque o PubSub em memória só funciona com uma instância).

---

## 4. Quando usar cada um

| Precisa de… | Use |
|---|---|
| CRUD e integrações simples, cache HTTP | **REST** (controllers) |
| Várias telas/clientes pedindo formatos diferentes, dados muito relacionados | **GraphQL** (resolvers + DataLoader) |
| Servidor empurrando dados, conversa bidirecional | **Gateway** (WebSocket) ou **SSE** num controller |
| Tempo real numa API que já é GraphQL | **Subscriptions** |

Muitos projetos combinam: REST ou GraphQL pra leitura e escrita, gateway pro tempo real.

---

## 5. Como falar na entrevista

**"Como você evitaria o N+1 numa API GraphQL no Nest?"**
> "O N+1 aparece porque o resolver de campo roda uma vez por item: 50 pedidos, 50 consultas de cliente. Uso DataLoader, criado por requisição, que agrupa todos os load de um ciclo numa consulta só com IN e ainda faz cache dentro da requisição. Junto com isso limito profundidade e complexidade das queries e exijo paginação nas listas, porque em GraphQL o cliente monta a consulta."

**"Como funciona WebSocket no Nest?"**
> "Com um Gateway, que é como uma controller de eventos: @SubscribeMessage pros eventos que chegam, e o server pra emitir, normalmente em salas. Autentico no handshake e autorizo a entrada em cada sala, e posso usar guards, pipes e filters como no HTTP. Com várias réplicas, uso o Redis adapter do Socket.IO pra que emitir numa sala alcance os clientes conectados em qualquer instância."

---

## 6. Resumo

- `@nestjs/graphql`: **code-first** (classes geram o schema) × **schema-first** (`.graphql` gera os tipos).
- **Query, Mutation, Subscription**; **resolvers** e `@ResolveField`; inputs validados como DTOs.
- **N+1** → **DataLoader por requisição** (agrupa em `IN` + cache).
- Proteger: **profundidade, complexidade, paginação**, persisted queries, introspection, autorização por campo.
- GraphQL responde 200 com `errors`; cache HTTP mais difícil.
- **Gateway**: `@WebSocketGateway`, `@SubscribeMessage`, **salas**, guards/pipes/filters; autenticar no **handshake** e autorizar salas.
- Escala: **Redis adapter**; subscriptions com **PubSub em Redis**.

## Termos desta aula
GraphQL · schema · code-first · schema-first · @ObjectType · @Field · @InputType · Resolver · Query · Mutation · Subscription · @ResolveField · @Parent · N+1 · DataLoader · complexidade de query · profundidade · persisted queries · introspection · GqlExecutionContext · Apollo · WebSocket · Gateway · @WebSocketGateway · @SubscribeMessage · @WebSocketServer · Socket.IO · sala · handshake · WsException · Redis adapter · PubSub

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 11** e separadas por nível.
