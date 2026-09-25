# Aula 02 — Estratégias de renderização: CSR, SSR, SSG, ISR (e PPR)

> **Objetivo:** saber explicar cada estratégia de renderização, **quando** o HTML é gerado em cada uma, e escolher a certa para cada tipo de página. É a pergunta de Next mais clássica.

---

## 1. A pergunta central: **quando e onde** o HTML é gerado?

Toda estratégia responde a isso:

| Estratégia | Onde | Quando |
|---|---|---|
| **CSR** – Client-Side Rendering | Navegador | Depois que o JS carrega |
| **SSR** – Server-Side Rendering | Servidor | **A cada requisição** |
| **SSG** – Static Site Generation | Servidor (build) | **No build**, uma vez |
| **ISR** – Incremental Static Regeneration | Servidor | No build **e regenerado** depois de um tempo ou sob demanda |

> Analogia do restaurante:
> - **CSR**: te entregam os ingredientes e a receita, você cozinha na mesa.
> - **SSR**: o chef cozinha na hora, **para cada pedido**.
> - **SSG**: pratos prontos feitos de manhã, servidos na hora (rápido, mas não muda durante o dia).
> - **ISR**: pratos prontos, mas a cozinha **refaz** de tempos em tempos (ou quando o cardápio muda).

---

## 2. CSR – Client-Side Rendering

O servidor manda HTML mínimo + JS; o navegador monta a página e busca os dados.

- ✅ Servidor simples (arquivos estáticos), ótima interatividade depois de carregado.
- ❌ SEO fraco, tela em branco inicial, depende do dispositivo do usuário.
- **Quando**: áreas logadas muito interativas, dashboards, partes que dependem do usuário e não precisam de SEO.

No Next: um Client Component que busca dados com `useEffect` ou, melhor, com **SWR** / **TanStack Query**.

---

## 3. SSR – Server-Side Rendering

O servidor gera o HTML **a cada requisição**, com os dados daquele momento.

- ✅ Dados sempre atuais, SEO ótimo, pode personalizar por usuário (cookies, headers).
- ❌ Cada requisição custa processamento; **TTFB** (*Time To First Byte*, tempo até o primeiro byte) depende da velocidade dos dados; mais caro de escalar.
- **Quando**: páginas que mudam a cada acesso **e** precisam de SEO, ou conteúdo personalizado: resultado de busca, feed, página que depende do usuário logado.

App Router: uma rota vira **dinâmica** (SSR) quando usa APIs de requisição, como `cookies()`, `headers()`, `searchParams`, ou quando você força:
```ts
export const dynamic = 'force-dynamic';
```
Pages Router: `getServerSideProps`.

---

## 4. SSG – Static Site Generation

O HTML é gerado **no build** e servido como arquivo estático, normalmente por uma **CDN** (*Content Delivery Network*, rede de servidores espalhados pelo mundo, perto do usuário).

- ✅ **O mais rápido** possível, custo quase zero, aguenta qualquer pico, SEO ótimo.
- ❌ Dado "congelado" até o próximo build; build demora se forem milhares de páginas.
- **Quando**: conteúdo que muda pouco: landing page, institucional, blog, documentação.

App Router: é o **padrão** quando a rota não usa nada dinâmico. Para rotas dinâmicas (`/blog/[slug]`), `generateStaticParams` diz quais páginas gerar no build:
```ts
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(p => ({ slug: p.slug }));
}
```
Pages Router: `getStaticProps` + `getStaticPaths`.

---

## 5. ISR – Incremental Static Regeneration

**O melhor dos dois mundos**: a página é estática (rápida, via CDN), mas é **regenerada em background**.

### Por tempo (time-based)
```ts
export const revalidate = 60; // segundos
```
Funciona no modelo **stale-while-revalidate**:
1. Página gerada e cacheada.
2. Nos próximos 60s, todo mundo recebe a versão em cache.
3. Depois de 60s, o **próximo** visitante ainda recebe a versão **antiga** (stale), mas isso **dispara** a regeneração em background.
4. Quando termina, os próximos recebem a nova.

### Sob demanda (on-demand)
Quando o dado muda (ex: produto editado no admin), você manda **invalidar**:
```ts
revalidatePath('/produtos/123');
revalidateTag('produtos');
```
Geralmente chamado numa Server Action ou num webhook do CMS. Vantagem: dado atualizado **na hora**, sem ficar regenerando à toa.

- **Quando**: e-commerce (página de produto), portais de notícia, catálogos, qualquer conteúdo público que muda às vezes.

---

## 6. PPR – Partial Prerendering (a evolução)

Nas versões mais recentes do Next, existe a ideia de **misturar** estático e dinâmico **na mesma página**:
- A "casca" da página (layout, cabeçalho, descrição do produto) é **pré-renderizada** e servida instantaneamente.
- As partes dinâmicas (carrinho, preço personalizado, recomendações) ficam dentro de `<Suspense>` e chegam **por streaming** logo depois.

Isso aparece como **Partial Prerendering** e, no Next 16, integrado ao modelo de **Cache Components** (diretiva `'use cache'`). Não precisa saber a API de cor; o conceito é: **estático por padrão, dinâmico só onde precisa, na mesma rota**.

---

## 7. Como escolher

```
A página precisa de SEO?
 ├─ Não → CSR pode bastar (área logada / dashboard)
 └─ Sim → O conteúdo depende de quem está acessando ou muda a cada segundo?
           ├─ Sim → SSR (ou estático + partes dinâmicas com streaming)
           └─ Não → Muda de vez em quando?
                     ├─ Não → SSG
                     └─ Sim → ISR (por tempo ou on-demand)
```

A decisão é **por rota** (e até por componente), não para o site inteiro. Um mesmo projeto pode ter home em SSG, produto em ISR, busca em SSR e painel em CSR.

---

## 8. Como falar na entrevista

**"Qual a diferença entre SSR, SSG e ISR?"**
> "A diferença é quando o HTML é gerado. No SSR, a cada requisição, então o dado é sempre fresco e pode ser personalizado, mas custa processamento em todo acesso. No SSG, no build: é servido por CDN, super rápido e barato, mas o dado fica congelado até o próximo build. O ISR é estático com regeneração: por tempo, no modelo stale-while-revalidate, ou sob demanda com revalidatePath/revalidateTag quando o dado muda. E CSR é renderizar no navegador, que serve pra áreas logadas sem necessidade de SEO. Eu escolho por rota: por exemplo, produto em ISR com revalidação on-demand e busca em SSR."

---

## 9. Resumo

- Pergunta-chave: **onde e quando** o HTML é gerado.
- **CSR**: navegador; sem SEO; interativo.
- **SSR**: servidor, **por requisição**; fresco e personalizado; mais caro.
- **SSG**: **build**; CDN; mais rápido; dado congelado.
- **ISR**: estático + **regeneração** (tempo com stale-while-revalidate, ou **on-demand** com `revalidatePath`/`revalidateTag`).
- **PPR**: casca estática + partes dinâmicas por streaming.
- Escolha **por rota**.

## Termos desta aula
CSR · SSR · SSG · ISR · PPR · TTFB · CDN · build time · request time · rota dinâmica · rota estática · force-dynamic · generateStaticParams · getServerSideProps · getStaticProps · getStaticPaths · revalidate · stale-while-revalidate · on-demand revalidation · revalidatePath · revalidateTag · Cache Components · SWR · TanStack Query

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 02** e separadas por nível.
