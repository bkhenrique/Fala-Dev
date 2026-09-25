# Aula 01 — O que é o Next.js e por que ele existe

> **Objetivo:** entender que problema do React "puro" o Next resolve, o que significa ser um framework React fullstack, e a diferença entre Pages Router e App Router.

---

## 1. Primeiro: o que é o React

**React** é uma **biblioteca** para construir **interfaces** a partir de **componentes**. Ele cuida de uma coisa: pegar o **estado** da aplicação e desenhar a **UI** correspondente, atualizando o DOM de forma eficiente.

O React sozinho **não** resolve:
- Roteamento (qual página mostrar em cada URL).
- Buscar dados no servidor.
- Renderizar no servidor (SEO).
- Build, otimização de imagens, fontes, divisão de código.
- Backend / API.

Por isso existem **frameworks React**: Next.js, Remix/React Router, Gatsby, Expo (mobile).

---

## 2. O problema da SPA tradicional

O jeito "clássico" de usar React (Create React App, Vite puro) é uma **SPA (Single Page Application)** renderizada no cliente (**CSR**):

```
1. Navegador pede /produtos
2. Servidor devolve um HTML quase VAZIO: <div id="root"></div> + bundle.js
3. Navegador baixa o JavaScript (às vezes MBs)
4. Executa o React
5. React busca os dados na API
6. Só agora a página aparece
```

Problemas:
- **SEO ruim**: robôs de busca e previews de redes sociais recebem uma página vazia (o Google até executa JS, mas com atraso e limitações; outros robôs, não).
- **Tela em branco** no primeiro carregamento, pior em celular e internet lenta.
- **Bundle grande**: todo o JS da aplicação vai pro navegador.
- **Waterfall** (cascata) de requisições: baixa JS → executa → busca dados → busca mais dados.

---

## 3. A resposta: Next.js

> **Next.js é um framework React fullstack, criado pela Vercel, que adiciona roteamento baseado em arquivos, renderização no servidor e estática, busca de dados, backend embutido e otimizações de performance.**

O que "fullstack" quer dizer aqui: no **mesmo projeto** você tem o front (componentes React) e código que roda **no servidor** (Server Components, Server Actions, Route Handlers), podendo acessar banco e segredos.

O que o Next adiciona:

| Recurso | O que resolve |
|---|---|
| **Roteamento por arquivos** | A estrutura de pastas vira as rotas |
| **Várias estratégias de renderização** (SSR, SSG, ISR, CSR) | Escolher por página o melhor equilíbrio entre dado fresco, performance e custo |
| **Server Components** | Componentes que rodam só no servidor, sem mandar JS pro navegador |
| **Server Actions e Route Handlers** | Backend no mesmo projeto (mutations, APIs, BFF) |
| **Cache e revalidação** | Evitar recalcular o que não mudou |
| **Otimizações** | Imagens, fontes, code splitting automático, prefetch de links |
| **Streaming** | Mandar a página em partes, conforme ficam prontas |

---

## 4. Pages Router vs App Router

O Next tem **dois sistemas de roteamento**:

### Pages Router (antigo, pasta `pages/`)
- Cada arquivo em `pages/` é uma rota.
- Dados buscados com funções especiais: `getServerSideProps` (SSR), `getStaticProps` + `getStaticPaths` (SSG/ISR).
- Todos os componentes são "client components" (vão pro navegador e são hidratados).
- API em `pages/api/`.

### App Router (atual, pasta `app/`, desde o Next 13)
- Baseado em **React Server Components**.
- Componentes são **Server Components por padrão**.
- **Layouts aninhados**, `loading.tsx`, `error.tsx`, **streaming**.
- Busca de dados direto no componente (`async function Page()` + `await`).
- Mutations com **Server Actions**; APIs com **Route Handlers** (`route.ts`).

Os dois podem **coexistir** num projeto (migração gradual). Projetos novos usam App Router. Em entrevista, é bom saber os dois, porque muita empresa ainda tem código em Pages Router.

> As aulas seguintes focam no **App Router**, mencionando o equivalente no Pages Router quando fizer sentido.

---

## 5. Uma página no App Router

```tsx
// app/produtos/page.tsx  →  rota /produtos
import { db } from '@/lib/db';

export default async function ProdutosPage() {
  const produtos = await db.produto.findMany();   // roda no SERVIDOR
  return (
    <ul>
      {produtos.map(p => <li key={p.id}>{p.nome}</li>)}
    </ul>
  );
}
```

Repare: o componente é `async`, acessa o banco **direto**, e nada disso vai pro navegador. O navegador recebe o HTML pronto.

---

## 6. Trade-offs

**Ganhos:** SEO, performance inicial, menos JS no cliente, front e back no mesmo lugar, muitas otimizações prontas.

**Custos:**
- **Complexidade mental**: saber o que roda no servidor e o que roda no cliente, e as regras de cache.
- O modelo de cache **mudou bastante entre versões** (13 → 14 → 15 → 16). Sempre confira a versão do projeto e a documentação dela.
- Precisa de servidor Node (ou plataforma como a Vercel) para os recursos dinâmicos, diferente de uma SPA que é só arquivo estático.
- Acoplamento a decisões do framework.

Quando uma SPA pura ainda faz sentido: painel interno logado, sem necessidade de SEO, com backend separado já existente.

---

## 7. Como falar na entrevista

**"O que é o Next.js e por que usar?"**
> "Next é um framework React fullstack. O React só resolve a UI; o Next adiciona roteamento por arquivos, renderização no servidor e estática, busca de dados, backend com Route Handlers e Server Actions, e várias otimizações. Uso principalmente quando SEO e performance de primeiro carregamento importam, ou quando quero um BFF no mesmo projeto do front. No App Router os componentes são Server Components por padrão, então mando muito menos JavaScript pro navegador. O custo é mais complexidade: entender a fronteira servidor/cliente e o modelo de cache."

---

## 8. Resumo

- **React** = biblioteca de UI. **Next** = framework React **fullstack**.
- SPA com CSR: SEO ruim, tela branca, bundle grande, waterfall.
- Next: roteamento por arquivos, SSR/SSG/ISR, Server Components, backend, otimizações.
- **Pages Router** (`pages/`, `getServerSideProps`) vs **App Router** (`app/`, Server Components).
- Trade-off: performance e SEO × complexidade (servidor/cliente, cache).

## Termos desta aula
React · biblioteca · framework · componente · SPA · CSR · SEO · bundle · waterfall · fullstack · Vercel · roteamento por arquivos · SSR · SSG · ISR · Server Components · Server Actions · Route Handlers · Pages Router · App Router · getServerSideProps · getStaticProps · streaming

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 01** e separadas por nível.
