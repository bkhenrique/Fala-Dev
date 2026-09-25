# Aula 03 — APIs: REST, GraphQL, gRPC, Webhooks e comunicação em tempo real

> **Objetivo:** saber o que é REST de verdade, boas práticas de design de API (versionamento, paginação, idempotência), quando usar GraphQL ou gRPC, e as opções de tempo real: polling, SSE e WebSocket.

---

## 1. O que é uma API

**API** (*Application Programming Interface*) é o **contrato** que define como um sistema conversa com outro: quais operações existem, que dados entram e saem, que erros podem acontecer.

O importante numa API é o **contrato**: quem consome depende dele. Mudar contrato de forma incompatível = **breaking change**.

---

## 2. REST

**REST** (*Representational State Transfer*) é um **estilo arquitetural** (definido por Roy Fielding em 2000), não um protocolo nem uma biblioteca.

Ideias centrais:
- Tudo é **recurso**, identificado por uma **URL** (`/pedidos/42`).
- Operações usam os **métodos HTTP** com sua semântica (GET lê, POST cria, PUT/PATCH altera, DELETE remove).
- **Stateless**: cada requisição carrega tudo o que precisa.
- **Representações**: o recurso é transferido numa representação (JSON, normalmente).
- Respostas podem ser **cacheáveis**.
- **Interface uniforme** e **sistema em camadas** (o cliente não sabe se há proxy, cache, gateway no meio).

### Boas práticas de URL
```
GET    /pedidos                 lista
GET    /pedidos/42              um pedido
POST   /pedidos                 cria
PATCH  /pedidos/42              altera parte
DELETE /pedidos/42              remove
GET    /clientes/7/pedidos      pedidos de um cliente (sub-recurso)
POST   /pedidos/42/cancelamento ação que não cabe num CRUD (vira um recurso/sub-recurso)
```
- **Substantivos** no plural, não verbos (`/criarPedido` ❌).
- Filtros e ordenação em **query string**: `/pedidos?status=pago&sort=-data`.

### Modelo de maturidade de Richardson
- **Nível 0**: um endpoint só, tudo via POST (estilo RPC).
- **Nível 1**: recursos com URLs próprias.
- **Nível 2**: + verbos e status HTTP corretos. **← a maioria das APIs "REST" do mercado.**
- **Nível 3**: + **HATEOAS** (a resposta traz links para as próximas ações possíveis). Raro na prática.

Frase madura: "A maioria das APIs chamadas de REST são nível 2 de Richardson; HATEOAS quase ninguém implementa."

---

## 3. Design de API na prática

### Versionamento
Para evoluir sem quebrar clientes:
- Na URL: `/v1/pedidos` (mais comum, explícito).
- No header: `Accept: application/vnd.loja.v2+json`.
Mudanças **aditivas** (novo campo opcional) não precisam de nova versão; remover/renomear campo precisa.

### Paginação
- **Offset**: `?page=3&size=20` → `OFFSET 40 LIMIT 20`. Simples, permite pular para a página X, mas fica **lento** com offsets grandes e pode **pular/repetir** itens se dados forem inseridos enquanto se pagina.
- **Cursor** (*keyset*): `?after=<id_do_ultimo>&limit=20` → `WHERE id > :cursor ORDER BY id LIMIT 20`. **Rápido** e estável; ideal para feeds e scroll infinito. Não permite pular para uma página arbitrária.

### Idempotency-Key
Para operações POST críticas (pagamento), o cliente manda um header único:
```
POST /pagamentos
Idempotency-Key: 7f3c-...
```
O servidor guarda a chave + resultado. Se a mesma requisição chegar de novo (retry por timeout), devolve **o mesmo resultado** sem cobrar de novo. (É assim que Stripe e outros fazem.)

### Erros padronizados
Mesmo formato para todos os erros, por exemplo **Problem Details (RFC 7807/9457)**:
```json
{ "type": "https://api.loja.com/erros/saldo-insuficiente", "title": "Saldo insuficiente",
  "status": 422, "detail": "Saldo de R$ 10 é menor que R$ 50", "instance": "/pagamentos/123" }
```

### Documentação: OpenAPI
Especificação padrão para descrever APIs REST (antigo Swagger). Gera documentação interativa e **clients tipados**. Abordagens: **code-first** (gera do código) ou **contract/design-first** (escreve o contrato antes).

---

## 4. GraphQL

Criado pelo Facebook. **Um endpoint** (`/graphql`) e o **cliente diz exatamente os campos que quer**:
```graphql
query {
  pedido(id: 42) {
    total
    cliente { nome }
    itens { produto { nome } quantidade }
  }
}
```

Resolve:
- **Over-fetching**: REST devolve campos que você não usa.
- **Under-fetching**: REST exige várias chamadas para montar uma tela.
- Schema **fortemente tipado** e introspectável.

Custos:
- **Cache HTTP** fica difícil (tudo é POST no mesmo endpoint).
- **N+1** nos resolvers (resolver `cliente` chamado por pedido) → **DataLoader** (agrupa em lote).
- Queries muito pesadas/aninhadas → limitar profundidade e complexidade.
- Mais complexidade no servidor.

Bom quando: vários clientes (web, mobile) com necessidades diferentes, telas que juntam muitos dados.

---

## 5. gRPC

Criado pelo Google. Chamada de procedimento remoto (**RPC**) sobre **HTTP/2**, com contrato definido em **Protocol Buffers** (`.proto`), um formato **binário**.

```proto
service Estoque {
  rpc Consultar (ConsultaRequest) returns (ConsultaResponse);
}
```

- ✅ Muito **rápido e compacto**, contrato forte com **código gerado** em várias linguagens, **streaming** bidirecional.
- ❌ Não roda direto no navegador (precisa de gRPC-Web), não é legível por humanos, debugar é mais chato.

Bom para: **comunicação interna entre microsserviços** com alto volume.

### Resumo das opções

| | REST | GraphQL | gRPC |
|---|---|---|---|
| Formato | JSON | JSON | Protobuf (binário) |
| Endpoint | Um por recurso | Um só | Métodos de serviço |
| Quem escolhe os campos | Servidor | **Cliente** | Contrato |
| Cache HTTP | Fácil | Difícil | N/A |
| Melhor para | APIs públicas, CRUD | Front com telas ricas, vários clientes | Serviço ↔ serviço |

---

## 6. Webhooks

Em vez de você ficar perguntando "o pagamento foi aprovado?", o **outro sistema chama você** quando algo acontece: um **POST para uma URL sua**.

Cuidados:
- **Verificar a assinatura** (HMAC com segredo compartilhado) para garantir que veio mesmo do provedor.
- Responder **rápido** (2xx) e processar em **fila**.
- Ser **idempotente**: o provedor pode reenviar o mesmo evento.
- Não confiar na ordem de chegada.

---

## 7. Tempo real: polling, SSE, WebSocket

| | Como funciona | Direção | Quando usar |
|---|---|---|---|
| **Short polling** | Cliente pergunta a cada N segundos | Cliente → servidor | Simples; atualizações raras; tolera atraso |
| **Long polling** | Cliente pergunta; o servidor **segura** a resposta até ter novidade | Servidor → cliente (simulado) | Legado / fallback |
| **SSE** (*Server-Sent Events*) | Conexão HTTP aberta, servidor **empurra** eventos em texto | **Servidor → cliente** | Notificações, progresso de job, **streaming de resposta de IA** |
| **WebSocket** | Conexão persistente **full-duplex** após um upgrade do HTTP | **Bidirecional** | Chat, jogos, edição colaborativa, trading |

SSE: é HTTP comum (passa fácil por proxies e load balancers), tem **reconexão automática** e retomada pelo último id de evento, e é simples. Só vai do servidor para o cliente (o cliente fala por requisições normais).

WebSocket: mais poderoso, mas mais complexo de escalar: conexões **persistentes** (stateful), e para mandar mensagem a um usuário conectado em **outra** instância precisa de um **pub/sub** (ex: Redis) entre as instâncias.

---

## 8. Como falar na entrevista

**"Por que usar SSE e quando usaria WebSocket?"**
> "SSE quando o fluxo é só do servidor pro cliente, tipo progresso de um job ou streaming de resposta de IA: é HTTP comum, passa por proxy e load balancer sem configuração especial e reconecta sozinho. WebSocket quando os dois lados precisam mandar mensagens o tempo todo, como chat ou colaboração em tempo real. O trade-off é que WebSocket mantém conexão persistente, então pra escalar horizontalmente preciso de um pub/sub entre as instâncias."

**"REST, GraphQL ou gRPC?"**
> "REST pra APIs públicas e CRUD, pela simplicidade e cache HTTP. GraphQL quando tenho vários clientes com necessidades diferentes e telas que juntam muitos dados, aceitando a complexidade de N+1 e cache. gRPC pra comunicação interna entre serviços com alto volume, pela performance e contrato forte."

---

## 9. Resumo

- API = **contrato**; breaking change quebra consumidores.
- **REST**: recursos + URLs + métodos HTTP + stateless; maioria é **nível 2 de Richardson**.
- Design: **versionamento**, paginação **offset vs cursor**, **Idempotency-Key**, erros padronizados (**Problem Details**), **OpenAPI**.
- **GraphQL**: cliente escolhe campos; resolve over/under-fetching; cuidado com N+1 (DataLoader) e cache.
- **gRPC**: HTTP/2 + Protobuf; rápido; serviço ↔ serviço.
- **Webhook**: o outro sistema te chama; assinatura, fila, idempotência.
- Tempo real: **polling < SSE (servidor→cliente) < WebSocket (bidirecional)**.

## Termos desta aula
API · contrato · breaking change · REST · recurso · representação · stateless · interface uniforme · Richardson · HATEOAS · RPC · versionamento · paginação offset · paginação cursor · keyset · Idempotency-Key · Problem Details · OpenAPI · Swagger · code-first · design-first · GraphQL · over-fetching · under-fetching · resolver · DataLoader · gRPC · Protocol Buffers · webhook · HMAC · polling · long polling · SSE · WebSocket · full-duplex · pub/sub

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 03** e separadas por nível.
