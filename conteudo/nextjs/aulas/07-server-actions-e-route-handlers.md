# Aula 07 — Mutations: Server Actions e Route Handlers

> **Objetivo:** saber como alterar dados (criar, editar, excluir) no Next moderno, a diferença entre Server Actions e Route Handlers, e os cuidados de segurança de cada um.

---

## 1. Ler vs escrever

Até aqui vimos **ler** dados (Server Components). Para **escrever** (mutations), o Next oferece dois caminhos:

- **Server Actions**: funções do servidor chamadas **direto** da UI.
- **Route Handlers**: endpoints HTTP tradicionais (`GET`, `POST`…) dentro do app.

---

## 2. Server Actions

Uma **Server Action** é uma função `async` marcada com **`'use server'`** que roda **no servidor**, mas pode ser chamada de um formulário ou de um Client Component como se fosse uma função local.

```ts
// app/produtos/actions.ts
'use server';

import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

const Schema = z.object({ nome: z.string().min(2), preco: z.coerce.number().positive() });

export async function criarProduto(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.isAdmin) throw new Error('não autorizado');          // AUTORIZAÇÃO

  const dados = Schema.parse(Object.fromEntries(formData));           // VALIDAÇÃO
  await db.produto.create({ data: dados });

  revalidateTag('produtos');                                          // atualiza o cache
  redirect('/produtos');
}
```

```tsx
// app/produtos/novo/page.tsx (Server Component)
import { criarProduto } from '../actions';

export default function NovoProduto() {
  return (
    <form action={criarProduto}>
      <input name="nome" />
      <input name="preco" />
      <button type="submit">Salvar</button>
    </form>
  );
}
```

### Como funciona por baixo
- O Next gera um **ID** para a action e cria um **endpoint POST** interno.
- O formulário, ao ser enviado, faz um POST com esse ID e os dados.
- O servidor executa a função e devolve o resultado + a UI atualizada (RSC Payload), numa **única ida e volta**.

### Vantagens
- **Menos código**: sem criar rota de API, sem `fetch` manual, com tipos de ponta a ponta.
- **Progressive enhancement** (melhoria progressiva): com `<form action>`, o formulário funciona **mesmo antes do JS carregar** (ou sem JS).
- Integração com **revalidação** do cache e `redirect`.

### Estados de formulário (React 19)
- `useActionState`: estado retornado pela action (erros de validação, mensagem).
- `useFormStatus`: saber se o form está enviando (desabilitar botão).
- `useOptimistic`: **UI otimista**: mostra o resultado esperado na hora e confirma (ou desfaz) quando o servidor responde.

---

## 3. ⚠️ Server Action é um endpoint público

Esse é **o** ponto de segurança. Mesmo que a action só seja usada numa página de admin, ela vira um **endpoint POST acessível** para qualquer um que descubra o ID.

Portanto, **dentro de toda action**:
1. **Autenticar**: quem está chamando?
2. **Autorizar**: essa pessoa pode fazer isso **com esse recurso**? (ownership, evitando IDOR)
3. **Validar** o input (Zod): nunca confiar no `FormData`.

Esconder o botão na UI **não** é segurança.

O Next ajuda em algumas coisas: só aceita POST, compara o header `Origin` com o host (proteção contra **CSRF**), e os IDs das actions são não adivinháveis e as não usadas são removidas do build. Mas **autorização é sempre responsabilidade sua**.

---

## 4. Route Handlers

Arquivo **`route.ts`** que exporta funções com o nome do método HTTP:

```ts
// app/api/webhooks/pagamento/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const assinatura = request.headers.get('x-signature');
  const corpo = await request.text();
  if (!assinaturaValida(corpo, assinatura)) {
    return NextResponse.json({ erro: 'assinatura inválida' }, { status: 401 });
  }
  await processarPagamento(JSON.parse(corpo));
  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  const pagina = request.nextUrl.searchParams.get('pagina') ?? '1';
  return NextResponse.json(await listar(Number(pagina)));
}
```

- Usam as **Web APIs padrão** (`Request`, `Response`).
- Não podem coexistir com `page.tsx` **no mesmo segmento**.
- Em versões recentes, `GET` **não** é cacheado por padrão.

---

## 5. Quando usar cada um

| Situação | Use |
|---|---|
| Formulário/botão da **própria UI** que altera dados | **Server Action** |
| **Webhook** de terceiros (Stripe, GitHub, CMS) | **Route Handler** |
| API consumida por **app mobile** ou outro sistema | **Route Handler** |
| Precisa de **GET** com cache HTTP, URL pública, CORS | **Route Handler** |
| Streaming customizado (SSE, resposta de LLM) | **Route Handler** |
| **BFF**: front chama o Next, que chama serviços internos com segredo | **Route Handler** (ou Server Action / Server Component, conforme o caso) |

Em resumo: **Server Action para mutações da própria aplicação; Route Handler quando precisa de um endpoint HTTP de verdade.**

---

## 6. BFF com Next

**BFF (Backend for Frontend)**: uma camada de backend dedicada ao front, que agrega e adapta dados de outros serviços e **esconde segredos**.

Com Next, o próprio projeto vira o BFF:
```
Navegador ──▶ Next (Server Component / Action / Route Handler)
                 ├──▶ API de pedidos (interna)
                 ├──▶ API de usuários (interna)
                 └──▶ Provider de IA (com a chave secreta)
```
O navegador **nunca** vê as URLs internas nem as chaves. Por isso **o front não deve chamar um LLM direto**: exporia a chave, e você perderia controle de custo, rate limit, validação do output e proteção de dados pessoais (PII).

---

## 7. Como falar na entrevista

**"Server Action ou Route Handler?"**
> "Server Action pra mutações da própria UI: formulários e botões. É menos código, tem tipagem de ponta a ponta, funciona com progressive enhancement e integra com revalidatePath/revalidateTag. Route Handler quando preciso de um endpoint HTTP de verdade: webhook, consumo por app mobile ou terceiros, GET público, streaming. E um ponto importante: Server Action vira um endpoint POST público, então sempre autentico, autorizo e valido com Zod dentro dela; esconder o botão não é segurança."

---

## 8. Resumo

- **Server Action** (`'use server'`): função do servidor chamada da UI; POST interno; progressive enhancement; revalidação integrada.
- React 19: `useActionState`, `useFormStatus`, `useOptimistic` (UI otimista).
- **Toda action é endpoint público** → autenticar, autorizar, validar.
- **Route Handler** (`route.ts`): endpoint HTTP com Web APIs; webhooks, mobile, GET, streaming.
- Next como **BFF**: segredos e serviços internos longe do navegador.

## Termos desta aula
mutation · Server Action · use server · FormData · progressive enhancement · useActionState · useFormStatus · useOptimistic · UI otimista · endpoint público · autenticação · autorização · validação · Zod · CSRF · Origin · IDOR · Route Handler · route.ts · NextRequest · NextResponse · webhook · assinatura · BFF · PII

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 07** e separadas por nível.
