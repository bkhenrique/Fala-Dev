# Next.js — perguntas, nível 3: Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [índice](README.md)

---

**1. Que estratégia usaria numa página de produto de e-commerce?**
<sub>Aula [02 — Estratégias de renderização: CSR, SSR, SSG, ISR (e PPR)](../aulas/02-estrategias-de-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

ISR com revalidação on-demand (revalidateTag quando o produto muda no admin): SEO e CDN. Partes muito dinâmicas ou pessoais (preço personalizado, estoque em tempo real, carrinho) via streaming com Suspense ou client-side.

</details>

**2. O que causa hydration mismatch e como resolver?**
<sub>Aula [03 — Hydration: como o HTML do servidor ganha vida](../aulas/03-hydration.md)</sub>
<details><summary>Ver resposta</summary>

HTML diferente entre servidor e cliente: Date/Math.random no render, window/localStorage, checagem de ambiente, HTML inválido, extensões do navegador. Resolver com useEffect, valor gerado no servidor passado por prop, `dynamic(..., { ssr: false })` ou `suppressHydrationWarning` em casos pontuais.

</details>

**3. Como usar um Server Component dentro de um Client Component?**
<sub>Aula [05 — Server Components vs Client Components](../aulas/05-server-e-client-components.md)</sub>
<details><summary>Ver resposta</summary>

Não importando, mas passando como `children` ou prop a partir de um Server Component pai. Ele é renderizado no servidor e entra pronto no "buraco" do Client. É assim que se usam providers de contexto sem transformar tudo em client.

</details>

**4. Como evitar vazar segredos para o cliente?**
<sub>Aula [05 — Server Components vs Client Components](../aulas/05-server-e-client-components.md)</sub>
<details><summary>Ver resposta</summary>

`import 'server-only'` em módulos sensíveis (o build falha se forem importados no cliente), nunca pôr segredo em variável `NEXT_PUBLIC_`, e passar pro Client só os campos necessários.

</details>

**5. Como melhorar o LCP?**
<sub>Aula [09 — Performance e SEO: Core Web Vitals, imagens, fontes, bundle e metadata](../aulas/09-performance-e-seo.md)</sub>
<details><summary>Ver resposta</summary>

Página estática/ISR via CDN, next/image com `priority` na imagem principal e tamanhos corretos, streaming das partes lentas, menos JS bloqueante e next/font.

</details>

**6. Como reduzir o JavaScript enviado ao cliente?**
<sub>Aula [09 — Performance e SEO: Core Web Vitals, imagens, fontes, bundle e metadata](../aulas/09-performance-e-seo.md)</sub>
<details><summary>Ver resposta</summary>

Server Components por padrão, `use client` só nas folhas, `dynamic()` pra componentes pesados, bundle analyzer pra achar libs grandes, e next/script com estratégia lazy pra terceiros.

</details>

**7. Como fazer SEO no Next?**
<sub>Aula [09 — Performance e SEO: Core Web Vitals, imagens, fontes, bundle e metadata](../aulas/09-performance-e-seo.md)</sub>
<details><summary>Ver resposta</summary>

HTML renderizado no servidor, Metadata API (`metadata`/`generateMetadata`) com título, descrição, Open Graph e canonical, `sitemap.ts`, `robots.ts` e dados estruturados JSON-LD.

</details>

**8. Como fazer deploy de Next com Docker?**
<sub>Aula [10 — Runtimes, Build e Deploy](../aulas/10-runtime-e-deploy.md)</sub>
<details><summary>Ver resposta</summary>

`output: 'standalone'` gera um servidor mínimo só com as dependências necessárias, pra uma imagem enxuta. Com várias réplicas, configurar cache handler compartilhado (Redis) e CDN na frente.

</details>
