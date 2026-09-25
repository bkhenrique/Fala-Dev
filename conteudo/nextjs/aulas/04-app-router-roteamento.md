# Aula 04 — App Router: roteamento por arquivos, layouts e arquivos especiais

> **Objetivo:** dominar como a estrutura de pastas vira rotas no App Router, os arquivos especiais (`page`, `layout`, `loading`, `error`, `not-found`), rotas dinâmicas, grupos, e como funciona a navegação.

---

## 1. Pastas viram rotas

No App Router, **cada pasta** dentro de `app/` é um **segmento** da URL. Uma rota só fica **pública** quando a pasta tem um **`page.tsx`**.

```
app/
├── page.tsx                  → /
├── sobre/
│   └── page.tsx              → /sobre
├── produtos/
│   ├── page.tsx              → /produtos
│   └── [id]/
│       └── page.tsx          → /produtos/123
└── blog/
    └── [...slug]/
        └── page.tsx          → /blog/a, /blog/a/b/c
```

Isso é **roteamento baseado em sistema de arquivos** (*file-system based routing*). Vantagem: a estrutura do projeto **é** o mapa do site. Outros arquivos na pasta (componentes, utils) **não** viram rota; dá pra deixá-los junto (**colocation**).

---

## 2. Os arquivos especiais

| Arquivo | Pra que serve |
|---|---|
| `page.tsx` | A UI da rota. Torna o segmento acessível |
| `layout.tsx` | UI **compartilhada** que envolve as páginas filhas e **persiste** na navegação |
| `loading.tsx` | UI de carregamento (vira um `<Suspense>` automático) |
| `error.tsx` | UI de erro do segmento (vira um **Error Boundary**) |
| `not-found.tsx` | UI de 404 (chamada com `notFound()`) |
| `route.ts` | Endpoint HTTP (Route Handler, aula 07) |
| `template.tsx` | Como layout, mas **recria** a cada navegação |
| `global-error.tsx` | Erro no layout raiz |

A hierarquia que o Next monta para cada segmento:
```tsx
<Layout>
  <Template>
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary fallback={<NotFound />}>
          <Page />
        </ErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  </Template>
</Layout>
```

---

## 3. Layouts aninhados

```tsx
// app/layout.tsx  (layout RAIZ, obrigatório, tem <html> e <body>)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body><Header />{children}</body>
    </html>
  );
}

// app/dashboard/layout.tsx  (envolve tudo em /dashboard/*)
export default function DashboardLayout({ children }) {
  return <div className="flex"><Sidebar />{children}</div>;
}
```

Em `/dashboard/vendas`, a página fica dentro dos **dois** layouts.

Ponto importante: **layouts não re-renderizam** ao navegar entre páginas filhas. A Sidebar mantém estado (scroll, input aberto) quando você vai de `/dashboard/vendas` para `/dashboard/clientes`. Isso se chama **preservação de estado** e é uma das grandes vantagens do App Router.

Consequência: layout **não** recebe `searchParams` e não é o lugar pra algo que precisa mudar a cada página.

---

## 4. Rotas dinâmicas

| Pasta | Casa com | `params` |
|---|---|---|
| `[id]` | `/produtos/123` | `{ id: '123' }` |
| `[...slug]` (*catch-all*) | `/docs/a/b` | `{ slug: ['a', 'b'] }` |
| `[[...slug]]` (*optional catch-all*) | `/docs` e `/docs/a/b` | `{ slug: undefined }` ou array |

```tsx
// app/produtos/[id]/page.tsx
export default async function Produto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;          // nas versões recentes, params é uma Promise
  const produto = await getProduto(id);
  if (!produto) notFound();              // renderiza o not-found.tsx
  return <h1>{produto.nome}</h1>;
}
```

`searchParams` (query string, `?pagina=2`) chega da mesma forma na `page`.

---

## 5. Organização: route groups e pastas privadas

- **Route group** `(nome)`: pasta com parênteses **não entra na URL**. Serve pra organizar ou aplicar **layouts diferentes**:
```
app/
├── (marketing)/          ← layout com header público
│   ├── layout.tsx
│   └── sobre/page.tsx    → /sobre
└── (app)/                ← layout com sidebar logada
    ├── layout.tsx
    └── dashboard/page.tsx → /dashboard
```
- **Pasta privada** `_nome`: ignorada pelo roteamento (ex: `_components`).

Avançado (bom saber que existe):
- **Parallel routes** `@slot`: renderizar várias páginas no mesmo layout (ex: dashboard com painéis independentes).
- **Intercepting routes** `(.)foto`: abrir uma rota como **modal** mantendo a página de fundo (ex: clicar numa foto no feed abre modal; acessar a URL direto abre a página inteira).

---

## 6. Navegação

```tsx
import Link from 'next/link';
<Link href="/produtos/123">Ver produto</Link>
```

O `<Link>`:
- Faz **navegação client-side**: não recarrega a página; busca só o necessário (RSC Payload) e troca o conteúdo, mantendo layouts.
- Faz **prefetch**: quando o link aparece na tela (em produção), o Next já busca a rota antecipadamente, então o clique parece instantâneo.

Navegação por código: `useRouter()` de `next/navigation` (`router.push('/x')`) em Client Components; `redirect('/login')` no servidor.

---

## 7. Loading e erro por segmento

- `loading.tsx` mostra um **skeleton** enquanto a página do segmento carrega dados, e permite **streaming**: o layout aparece na hora.
- `error.tsx` isola falhas: se a página de vendas quebrar, a sidebar do layout continua funcionando. Precisa ser **Client Component** (recebe `error` e uma função `reset` para tentar de novo).

Isso é **isolamento de falhas na UI**: um erro não derruba a aplicação inteira.

---

## 8. Como falar na entrevista

**"Como funciona o roteamento no App Router?"**
> "É baseado em pastas: cada pasta dentro de app é um segmento da URL, e ela só vira rota quando tem um page.tsx. Tem arquivos especiais por segmento: layout, que envolve os filhos e persiste na navegação, mantendo estado; loading, que vira um Suspense e permite streaming; error, que é um Error Boundary isolando falhas; e not-found. Rotas dinâmicas com colchetes, catch-all com reticências, e route groups com parênteses pra organizar e aplicar layouts diferentes sem mudar a URL. A navegação com Link é client-side e com prefetch."

---

## 9. Resumo

- Pasta = segmento; **`page.tsx`** torna pública.
- **layout** (persiste, mantém estado), **loading** (Suspense), **error** (Error Boundary, client), **not-found**, **route** (API).
- Dinâmicas: `[id]`, `[...slug]`, `[[...slug]]`; `params` e `searchParams` (Promises nas versões recentes).
- **Route groups** `(x)` não entram na URL; `_pasta` é privada.
- Parallel `@slot` e intercepting `(.)` routes.
- `<Link>`: navegação client-side + **prefetch**.

## Termos desta aula
App Router · file-system routing · segmento · colocation · page · layout · template · loading · error · not-found · Error Boundary · Suspense · layout aninhado · preservação de estado · rota dinâmica · catch-all · params · searchParams · notFound · route group · pasta privada · parallel routes · intercepting routes · Link · prefetch · navegação client-side · useRouter · redirect · skeleton

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 04** e separadas por nível.
