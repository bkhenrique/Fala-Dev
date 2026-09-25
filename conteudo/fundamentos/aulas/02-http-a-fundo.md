# Aula 02 — HTTP a fundo: métodos, status, headers, cookies e cache

> **Objetivo:** dominar o protocolo HTTP: semântica dos métodos (seguro e idempotente), os status codes que importam, headers essenciais, cookies, cache HTTP e as diferenças entre HTTP/1.1, 2 e 3.

---

## 1. HTTP é stateless

**HTTP é um protocolo sem estado** (*stateless*): cada requisição é independente, e o servidor não "lembra" da anterior. Tudo o que ele precisa saber tem que vir **na própria requisição** (token, cookie, parâmetros).

Estado de sessão, quando existe, é construído **por cima** (cookies, tokens). Isso é a base da escalabilidade horizontal (aula 10).

---

## 2. Métodos: seguro e idempotente

Duas propriedades que caem em entrevista:
- **Seguro** (*safe*): **não altera** o estado do servidor (só leitura).
- **Idempotente**: executar **N vezes** tem o **mesmo efeito** que executar **1 vez**.

| Método | Uso | Seguro | Idempotente |
|---|---|---|---|
| **GET** | Buscar | ✅ | ✅ |
| **HEAD** | Como GET, só headers | ✅ | ✅ |
| **OPTIONS** | Quais métodos são aceitos (usado no CORS) | ✅ | ✅ |
| **POST** | Criar / executar ação | ❌ | ❌ |
| **PUT** | **Substituir** o recurso inteiro | ❌ | ✅ |
| **PATCH** | Alterar **parcialmente** | ❌ | ❌ (não garantido) |
| **DELETE** | Remover | ❌ | ✅ |

Por que importa:
- **Retry**: é seguro repetir automaticamente um método idempotente (proxies, clients e navegadores fazem isso). Repetir um POST pode **criar duas vezes** (dois pedidos, duas cobranças).
- Idempotência é sobre o **efeito no servidor**, não sobre a resposta: o segundo DELETE pode devolver 404, mas o estado final (recurso removido) é o mesmo.
- Para tornar um POST seguro de repetir: **Idempotency-Key** (aula 03).

PUT vs PATCH: `PUT /usuarios/1 {nome, email, telefone}` manda o recurso completo (o que faltar é apagado). `PATCH /usuarios/1 {telefone}` muda só o campo enviado.

---

## 3. Status codes

**Por família:**
- **1xx**: informativo (raro).
- **2xx**: sucesso.
- **3xx**: redirecionamento.
- **4xx**: erro **do cliente** (pedido errado; tentar de novo igual não adianta).
- **5xx**: erro **do servidor** (pode adiantar tentar de novo depois).

**Os que você precisa saber de cor:**

| Código | Significado | Quando |
|---|---|---|
| **200** OK | Sucesso com corpo | GET, PUT, PATCH |
| **201** Created | Recurso **criado** | POST que criou; header `Location` com a URL |
| **202** Accepted | **Aceito, vai processar depois** | Processamento assíncrono (fila); devolve jobId |
| **204** No Content | Sucesso **sem corpo** | DELETE, PUT sem retorno |
| **301** / **308** | Moved Permanently | URL mudou pra sempre (SEO) |
| **302** / **307** | Redirecionamento temporário | Redirect após login |
| **304** Not Modified | Use sua cópia em cache | Cache condicional (ETag) |
| **400** Bad Request | Requisição malformada/inválida | Validação falhou |
| **401** Unauthorized | **Não autenticado** | Sem token / token inválido |
| **403** Forbidden | Autenticado, **sem permissão** | Usuário comum em rota de admin |
| **404** Not Found | Não existe | (também usado pra não revelar que existe) |
| **405** Method Not Allowed | Método não suportado | DELETE numa rota só GET |
| **409** Conflict | Conflito com o estado atual | E-mail já cadastrado, versão desatualizada |
| **422** Unprocessable Entity | Formato certo, **regra** violada | Validação de negócio (convenção de algumas APIs) |
| **429** Too Many Requests | **Rate limit** estourado | Com header `Retry-After` |
| **500** Internal Server Error | Erro inesperado no servidor | Bug, exceção não tratada |
| **502** Bad Gateway | O proxy recebeu resposta inválida do servidor de trás | App caiu atrás do load balancer |
| **503** Service Unavailable | Temporariamente indisponível | Sobrecarga, manutenção |
| **504** Gateway Timeout | O proxy não recebeu resposta a tempo | App lenta demais |

Clássicos de entrevista: **201 vs 202**, **401 vs 403**, **400 vs 422**, **502 vs 504**.

---

## 4. Headers essenciais

| Header | Para quê |
|---|---|
| `Content-Type` | Formato do corpo (`application/json`) |
| `Accept` | Formato que o cliente aceita (negociação de conteúdo) |
| `Authorization` | Credenciais (`Bearer <token>`) |
| `Cookie` / `Set-Cookie` | Enviar / definir cookies |
| `Cache-Control`, `ETag`, `If-None-Match` | Cache |
| `Location` | URL do recurso criado / destino do redirect |
| `User-Agent` | Quem é o cliente |
| `Origin` | De onde vem a requisição (CORS, CSRF) |
| `X-Request-Id` / `traceparent` | Rastrear a requisição entre serviços |
| `Retry-After` | Quando tentar de novo (429, 503) |

---

## 5. Cookies

Um cookie é um pequeno dado que o **servidor manda** (`Set-Cookie`) e o **navegador devolve automaticamente** em toda requisição para aquele domínio.

```
Set-Cookie: sessao=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600
```

| Atributo | Efeito |
|---|---|
| **HttpOnly** | JavaScript **não lê** → protege contra roubo por XSS |
| **Secure** | Só enviado por **HTTPS** |
| **SameSite** | `Strict`/`Lax`: não enviado em requisições vindas de outros sites → protege contra **CSRF**. `None` exige Secure |
| `Max-Age`/`Expires` | Validade |
| `Domain`/`Path` | Escopo |

Uso: sessão, preferências, rastreamento.

---

## 6. Cache HTTP

O próprio HTTP tem um sistema de cache (no navegador, na CDN, em proxies).

**`Cache-Control`**:
- `max-age=3600`: pode usar a cópia por 1 hora sem perguntar.
- `no-cache`: pode guardar, mas **tem que validar** com o servidor antes de usar.
- `no-store`: **não guarde** (dados sensíveis).
- `public` (CDN pode cachear) vs `private` (só o navegador do usuário).
- `s-maxage`: validade específica para caches compartilhados (CDN).
- `stale-while-revalidate`: pode servir a versão velha enquanto busca a nova.

**Cache condicional com ETag:**
```
1ª resposta:   200 OK            ETag: "v42"
2ª requisição: If-None-Match: "v42"
resposta:      304 Not Modified   (sem corpo: o cliente usa a cópia que tem)
```
Economiza banda: o servidor só manda o conteúdo se mudou. (`Last-Modified` + `If-Modified-Since` é a versão por data.)

Arquivos estáticos com **hash no nome** (`app.3f9a1.js`) podem ter `max-age` de um ano: quando mudam, o nome muda (*cache busting*).

---

## 7. HTTP/1.1 vs HTTP/2 vs HTTP/3

| | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| Formato | Texto | **Binário** | Binário |
| Transporte | TCP | TCP | **QUIC (sobre UDP)** |
| Várias requisições | Uma por vez por conexão (navegador abre ~6 conexões) | **Multiplexação**: várias ao mesmo tempo na mesma conexão | Multiplexação sem bloqueio entre fluxos |
| Headers | Repetidos, sem compressão | **Comprimidos** (HPACK) | Comprimidos (QPACK) |
| Problema | *Head-of-line blocking* | HOL no nível do TCP (um pacote perdido trava tudo) | Resolve o HOL; conexão mais rápida; sobrevive a troca de rede (Wi-Fi → 4G) |

---

## 8. Como falar na entrevista

**"O que é idempotência em HTTP?"**
> "Um método é idempotente quando executá-lo várias vezes tem o mesmo efeito no servidor que executar uma vez. GET, PUT e DELETE são; POST não. Isso importa pra retry: um cliente ou proxy pode repetir com segurança um PUT, mas repetir um POST pode criar dois pedidos. Pra POST crítico, como pagamento, uso uma Idempotency-Key: o servidor guarda o resultado pela chave e devolve o mesmo resultado se a requisição chegar de novo."

**"Qual a diferença entre 401 e 403? E 201 e 202?"**
> "401 é não autenticado: não sei quem você é. 403 é autenticado, mas sem permissão. 201 é recurso criado, já existe, com Location. 202 é aceito pra processar depois, típico de processamento assíncrono com fila, e aí devolvo um id pro cliente acompanhar."

---

## 9. Resumo

- HTTP é **stateless**.
- **Seguro** (não altera) × **idempotente** (N vezes = 1 vez). POST e PATCH não são idempotentes.
- Status: 2xx sucesso, 3xx redirect, **4xx cliente**, **5xx servidor**. 201/202, 401/403, 400/422, 429, 502/503/504.
- Headers: Content-Type, Authorization, Cache-Control, Location, Origin, request id.
- Cookies: **HttpOnly, Secure, SameSite**.
- Cache: `Cache-Control` (max-age, no-cache, no-store, public/private), **ETag → 304**.
- HTTP/2 **multiplexação**, binário; HTTP/3 sobre **QUIC/UDP**.

## Termos desta aula
stateless · método HTTP · seguro · idempotente · GET · POST · PUT · PATCH · DELETE · OPTIONS · status code · 200 · 201 · 202 · 204 · 304 · 400 · 401 · 403 · 404 · 409 · 422 · 429 · 500 · 502 · 503 · 504 · header · Content-Type · Accept · Authorization · Location · cookie · HttpOnly · Secure · SameSite · Cache-Control · max-age · no-cache · no-store · ETag · If-None-Match · cache busting · HTTP/2 · multiplexação · head-of-line blocking · HTTP/3 · QUIC

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 02** e separadas por nível.
