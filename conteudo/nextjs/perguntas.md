# Next.js — perguntas

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

As perguntas estão separadas por **nível**, e cada uma indica a aula de onde vem.

---

## Nível 1 — O que é?

_Definições. Tem que sair sem pensar._

**1. O que é o Next.js?**
<sub>Aula [01 — O que é o Next.js e por que ele existe](aulas/01-o-que-e-next.md)</sub>
<details><summary>Ver resposta</summary>

Framework React fullstack que adiciona ao React roteamento por arquivos, várias estratégias de renderização (SSR, SSG, ISR), Server Components, backend embutido (Server Actions, Route Handlers) e otimizações de performance.

</details>

**2. Qual a diferença entre React e Next?**
<sub>Aula [01 — O que é o Next.js e por que ele existe](aulas/01-o-que-e-next.md)</sub>
<details><summary>Ver resposta</summary>

React é uma biblioteca de UI baseada em componentes. Next é um framework em cima do React que resolve roteamento, renderização no servidor, busca de dados, backend, build e otimizações.

</details>

**3. Qual a diferença entre CSR, SSR, SSG e ISR?**
<sub>Aula [02 — Estratégias de renderização: CSR, SSR, SSG, ISR (e PPR)](aulas/02-estrategias-de-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

É sobre quando e onde o HTML é gerado. CSR: no navegador. SSR: no servidor a cada requisição. SSG: no build. ISR: estático regenerado por tempo ou sob demanda.

</details>

**4. O que é Partial Prerendering?**
<sub>Aula [02 — Estratégias de renderização: CSR, SSR, SSG, ISR (e PPR)](aulas/02-estrategias-de-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

Misturar estático e dinâmico na mesma rota: a casca da página é pré-renderizada e servida na hora, e as partes dinâmicas dentro de Suspense chegam por streaming. No Next 16 faz parte do modelo Cache Components.

</details>

**5. O que é hydration?**
<sub>Aula [03 — Hydration: como o HTML do servidor ganha vida](aulas/03-hydration.md)</sub>
<details><summary>Ver resposta</summary>

O React no navegador pega o HTML vindo do servidor, renderiza os componentes em memória, reaproveita o DOM e conecta eventos e estado, tornando a página interativa.

</details>

**6. O que é o RSC Payload?**
<sub>Aula [03 — Hydration: como o HTML do servidor ganha vida](aulas/03-hydration.md)</sub>
<details><summary>Ver resposta</summary>

Representação compacta da árvore renderizada pelos Server Components, com os "buracos" dos Client Components, os arquivos JS a carregar e as props passadas. Usado na reconciliação e na navegação client-side.

</details>

**7. Como funciona o roteamento no App Router?**
<sub>Aula [04 — App Router: roteamento por arquivos, layouts e arquivos especiais](aulas/04-app-router-roteamento.md)</sub>
<details><summary>Ver resposta</summary>

Cada pasta em `app/` é um segmento da URL; a rota fica pública quando há `page.tsx`. Arquivos especiais por segmento: layout, loading, error, not-found, route.

</details>

**8. O que fazem loading.tsx e error.tsx?**
<sub>Aula [04 — App Router: roteamento por arquivos, layouts e arquivos especiais](aulas/04-app-router-roteamento.md)</sub>
<details><summary>Ver resposta</summary>

loading.tsx vira um Suspense automático do segmento (skeleton e streaming). error.tsx vira um Error Boundary (precisa ser Client Component) que isola falhas do segmento e permite tentar de novo com `reset`.

</details>

**9. O que são route groups e rotas dinâmicas?**
<sub>Aula [04 — App Router: roteamento por arquivos, layouts e arquivos especiais](aulas/04-app-router-roteamento.md)</sub>
<details><summary>Ver resposta</summary>

Route group `(nome)`: pasta que não entra na URL, usada pra organizar ou aplicar layouts diferentes. Dinâmicas: `[id]`, catch-all `[...slug]`, optional catch-all `[[...slug]]`, com valores em `params`.

</details>

**10. O que o componente `<Link>` faz de especial?**
<sub>Aula [04 — App Router: roteamento por arquivos, layouts e arquivos especiais](aulas/04-app-router-roteamento.md)</sub>
<details><summary>Ver resposta</summary>

Navegação client-side (sem recarregar a página, mantendo layouts) e prefetch automático das rotas visíveis, deixando a navegação praticamente instantânea.

</details>

**11. Diferença entre Server e Client Components?**
<sub>Aula [05 — Server Components vs Client Components](aulas/05-server-e-client-components.md)</sub>
<details><summary>Ver resposta</summary>

Server: rodam só no servidor, podem ser async, acessam banco e segredos, não vão pro bundle, não usam hooks/eventos. Client (`use client`): pré-renderizados no servidor e hidratados no navegador, usam estado, efeitos, eventos e APIs do browser.

</details>

**12. Como buscar dados no App Router?**
<sub>Aula [06 — Busca de dados e Cache](aulas/06-dados-e-cache.md)</sub>
<details><summary>Ver resposta</summary>

Em Server Components async, com `await` direto no banco ou em `fetch`. Sem useEffect nem endpoint intermediário. Em paralelo com Promise.all ou Suspense separados pra evitar waterfall.

</details>

**13. O que é streaming e como usar?**
<sub>Aula [06 — Busca de dados e Cache](aulas/06-dados-e-cache.md)</sub>
<details><summary>Ver resposta</summary>

Enviar o HTML em partes: primeiro o que está pronto e os fallbacks, depois os componentes lentos na mesma resposta. Usa-se `<Suspense fallback>` em volta de componentes async, ou `loading.tsx`.

</details>

**14. O que é uma Server Action?**
<sub>Aula [07 — Mutations: Server Actions e Route Handlers](aulas/07-server-actions-e-route-handlers.md)</sub>
<details><summary>Ver resposta</summary>

Função async com `'use server'` que roda no servidor e pode ser chamada da UI (form action ou Client Component). Por baixo vira um POST interno; integra com revalidação e redirect e funciona com progressive enhancement.

</details>

**15. O que é UI otimista?**
<sub>Aula [07 — Mutations: Server Actions e Route Handlers](aulas/07-server-actions-e-route-handlers.md)</sub>
<details><summary>Ver resposta</summary>

Mostrar na hora o resultado esperado de uma ação (ex: curtida) antes da confirmação do servidor, e desfazer se falhar. No React 19, `useOptimistic`.

</details>

**16. O que o middleware (proxy) faz?**
<sub>Aula [08 — Middleware (Proxy), Autenticação e Segurança](aulas/08-middleware-autenticacao-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Roda antes da rota e pode redirecionar, reescrever URL, ler/definir cookies e headers. Usos: redirect de auth, i18n, A/B test. Deve ser leve. No Next 16 o arquivo virou `proxy.ts`.

</details>

**17. O que é a DAL (Data Access Layer) no Next?**
<sub>Aula [08 — Middleware (Proxy), Autenticação e Segurança](aulas/08-middleware-autenticacao-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Camada `server-only` que centraliza o acesso a dados e sempre verifica a sessão e o ownership antes de consultar, garantindo autorização perto dos dados independente de onde é chamada.

</details>

**18. O que são as Core Web Vitals?**
<sub>Aula [09 — Performance e SEO: Core Web Vitals, imagens, fontes, bundle e metadata](aulas/09-performance-e-seo.md)</sub>
<details><summary>Ver resposta</summary>

LCP (tempo até o maior elemento visível, ≤2,5s), INP (resposta a interações, ≤200ms) e CLS (estabilidade do layout, ≤0,1). Medidas de experiência real, usadas no ranking do Google.

</details>

**19. O que o `next/image` faz?**
<sub>Aula [09 — Performance e SEO: Core Web Vitals, imagens, fontes, bundle e metadata](aulas/09-performance-e-seo.md)</sub>
<details><summary>Ver resposta</summary>

Redimensiona por dispositivo, converte para WebP/AVIF, lazy loading por padrão, reserva espaço com width/height (evita CLS) e permite prioridade para a imagem do LCP.

</details>

---

## Nível 2 — Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**20. Quais os problemas de uma SPA renderizada só no cliente?**
<sub>Aula [01 — O que é o Next.js e por que ele existe](aulas/01-o-que-e-next.md)</sub>
<details><summary>Ver resposta</summary>

SEO fraco (HTML vazio), tela em branco no primeiro carregamento, bundle grande e waterfall de requisições (baixar JS → executar → buscar dados).

</details>

**21. Pages Router vs App Router?**
<sub>Aula [01 — O que é o Next.js e por que ele existe](aulas/01-o-que-e-next.md)</sub>
<details><summary>Ver resposta</summary>

Pages Router: pasta `pages/`, dados com getServerSideProps/getStaticProps, todos os componentes hidratados. App Router: pasta `app/`, baseado em React Server Components (Server por padrão), layouts aninhados, loading/error, streaming, Server Actions. Podem coexistir; projetos novos usam App Router.

</details>

**22. Quando usar SSR?**
<sub>Aula [02 — Estratégias de renderização: CSR, SSR, SSG, ISR (e PPR)](aulas/02-estrategias-de-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

Quando o conteúdo muda a cada acesso ou é personalizado (cookies, usuário) e precisa de SEO: busca, feed, páginas dependentes do usuário. Custo: processamento por requisição e TTFB dependente dos dados.

</details>

**23. Quando usar SSG?**
<sub>Aula [02 — Estratégias de renderização: CSR, SSR, SSG, ISR (e PPR)](aulas/02-estrategias-de-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

Conteúdo que muda pouco: landing page, institucional, blog, documentação. É o mais rápido e barato (CDN), mas o dado fica congelado até o próximo build.

</details>

**24. Como funciona o ISR e o stale-while-revalidate?**
<sub>Aula [02 — Estratégias de renderização: CSR, SSR, SSG, ISR (e PPR)](aulas/02-estrategias-de-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

A página é estática, mas regenerada em background. Com `revalidate: 60`, depois de 60s o próximo visitante ainda recebe a versão antiga, e isso dispara a regeneração; os seguintes recebem a nova. Também dá pra revalidar sob demanda com revalidatePath/revalidateTag.

</details>

**25. Server Components são hidratados?**
<sub>Aula [03 — Hydration: como o HTML do servidor ganha vida](aulas/03-hydration.md)</sub>
<details><summary>Ver resposta</summary>

Não. Só os Client Components são enviados como JS e hidratados. Server Components chegam como resultado (HTML + RSC Payload), o que reduz o JS e acelera a interatividade.

</details>

**26. Pra que serve o layout e qual a vantagem dele?**
<sub>Aula [04 — App Router: roteamento por arquivos, layouts e arquivos especiais](aulas/04-app-router-roteamento.md)</sub>
<details><summary>Ver resposta</summary>

UI compartilhada que envolve as páginas filhas. Não re-renderiza ao navegar entre filhas, preservando estado (sidebar, inputs, scroll).

</details>

**27. Client Component roda só no navegador?**
<sub>Aula [05 — Server Components vs Client Components](aulas/05-server-e-client-components.md)</sub>
<details><summary>Ver resposta</summary>

Não. Ele também é pré-renderizado no servidor para gerar o HTML inicial; a diferença é que também é enviado e hidratado no cliente.

</details>

**28. O que significa `"use client"` marcar uma fronteira?**
<sub>Aula [05 — Server Components vs Client Components](aulas/05-server-e-client-components.md)</sub>
<details><summary>Ver resposta</summary>

Tudo que aquele arquivo importa também entra no bundle do cliente. Por isso se empurra o `use client` para as folhas da árvore, deixando páginas e layouts como Server.

</details>

**29. Server Components é a mesma coisa que SSR?**
<sub>Aula [05 — Server Components vs Client Components](aulas/05-server-e-client-components.md)</sub>
<details><summary>Ver resposta</summary>

Não. SSR é quando o HTML é gerado (por requisição). Server Component é qual código roda só no servidor e não vai pro cliente. Um Server Component pode ser estático ou dinâmico, e um Client Component também passa por SSR.

</details>

**30. Quais são as camadas de cache do Next?**
<sub>Aula [06 — Busca de dados e Cache](aulas/06-dados-e-cache.md)</sub>
<details><summary>Ver resposta</summary>

Request memoization (deduplica chamadas numa renderização), Data Cache (resultados persistentes entre requisições), Full Route Cache (HTML e payload de rotas estáticas) e Router Cache (no navegador, pra navegação).

</details>

**31. O que torna uma rota dinâmica?**
<sub>Aula [06 — Busca de dados e Cache](aulas/06-dados-e-cache.md)</sub>
<details><summary>Ver resposta</summary>

Usar dados de requisição: `cookies()`, `headers()`, `searchParams`, fetch sem cache/`no-store`, ou `dynamic = 'force-dynamic'`. O relatório do build mostra estática (○/●) ou dinâmica (ƒ).

</details>

**32. revalidatePath vs revalidateTag?**
<sub>Aula [06 — Busca de dados e Cache](aulas/06-dados-e-cache.md)</sub>
<details><summary>Ver resposta</summary>

revalidatePath invalida uma rota específica. revalidateTag invalida todos os dados etiquetados com a tag, em qualquer página. Tag é mais precisa quando o mesmo dado aparece em várias rotas.

</details>

**33. O padrão de cache do Next é sempre o mesmo?**
<sub>Aula [06 — Busca de dados e Cache](aulas/06-dados-e-cache.md)</sub>
<details><summary>Ver resposta</summary>

Não. No 14 o fetch era cacheado por padrão; no 15 deixou de ser (e GET de Route Handler também); no 16 surgiu o modelo Cache Components com `'use cache'`. Sempre conferir a versão do projeto.

</details>

**34. Qual o principal cuidado de segurança com Server Actions?**
<sub>Aula [07 — Mutations: Server Actions e Route Handlers](aulas/07-server-actions-e-route-handlers.md)</sub>
<details><summary>Ver resposta</summary>

Toda action é um endpoint público. Dentro dela sempre autenticar, autorizar (incluindo ownership) e validar o input com Zod. Esconder o botão não é segurança.

</details>

**35. Server Action ou Route Handler?**
<sub>Aula [07 — Mutations: Server Actions e Route Handlers](aulas/07-server-actions-e-route-handlers.md)</sub>
<details><summary>Ver resposta</summary>

Server Action pra mutações da própria UI. Route Handler pra endpoint HTTP de verdade: webhooks, app mobile, terceiros, GET público com cache HTTP, streaming (SSE).

</details>

**36. Por que o front não deve chamar um LLM diretamente?**
<sub>Aula [07 — Mutations: Server Actions e Route Handlers](aulas/07-server-actions-e-route-handlers.md)</sub>
<details><summary>Ver resposta</summary>

A chave de API ficaria exposta no navegador. Além disso perde-se controle de custo, rate limit, validação do output e proteção de PII. O certo é passar por um BFF (Route Handler/Action) no servidor.

</details>

**37. Por que não fazer toda a autenticação só no middleware?**
<sub>Aula [08 — Middleware (Proxy), Autenticação e Segurança](aulas/08-middleware-autenticacao-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Defesa em profundidade: o middleware faz checagem otimista, mas a verificação real deve ficar perto dos dados (DAL, Server Actions, Route Handlers). A CVE-2025-29927 permitia pular o middleware, expondo quem dependia só dele.

</details>

**38. Onde guardar o token de sessão?**
<sub>Aula [08 — Middleware (Proxy), Autenticação e Segurança](aulas/08-middleware-autenticacao-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Em cookie `httpOnly` (JS não lê, protege contra roubo por XSS), `Secure` e `SameSite` (ajuda contra CSRF). Evitar localStorage.

</details>

**39. XSS vs CSRF?**
<sub>Aula [08 — Middleware (Proxy), Autenticação e Segurança](aulas/08-middleware-autenticacao-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

XSS: injetar script malicioso na página (defesa: React escapa por padrão, sanitizar `dangerouslySetInnerHTML`, CSP, cookie httpOnly). CSRF: site malicioso faz o navegador da vítima enviar requisição autenticada (defesa: SameSite, checagem de Origin, token CSRF).

</details>

**40. Node runtime vs Edge runtime?**
<sub>Aula [10 — Runtimes, Build e Deploy](aulas/10-runtime-e-deploy.md)</sub>
<details><summary>Ver resposta</summary>

Node: APIs completas, qualquer lib, padrão. Edge: subconjunto de Web APIs, roda perto do usuário, cold start baixo, bom pra lógica leve (redirects, geolocalização). Se precisa de banco numa região só, Node na mesma região costuma ser mais rápido.

</details>

**41. Quais as limitações do `output: 'export'`?**
<sub>Aula [10 — Runtimes, Build e Deploy](aulas/10-runtime-e-deploy.md)</sub>
<details><summary>Ver resposta</summary>

Gera só arquivos estáticos: perde SSR, Server Actions, Route Handlers dinâmicos, ISR, middleware e a otimização de imagem padrão. Em troca, hospeda em qualquer CDN com custo mínimo.

</details>

**42. Qual o cuidado com variáveis `NEXT_PUBLIC_`?**
<sub>Aula [10 — Runtimes, Build e Deploy](aulas/10-runtime-e-deploy.md)</sub>
<details><summary>Ver resposta</summary>

Vão pro navegador (nunca pôr segredo) e são embutidas no JS no momento do build. A mesma imagem em ambientes diferentes carrega o valor do build; precisa buildar por ambiente ou ler a config no servidor.

</details>

---

## Nível 3 — Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**43. Que estratégia usaria numa página de produto de e-commerce?**
<sub>Aula [02 — Estratégias de renderização: CSR, SSR, SSG, ISR (e PPR)](aulas/02-estrategias-de-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

ISR com revalidação on-demand (revalidateTag quando o produto muda no admin): SEO e CDN. Partes muito dinâmicas ou pessoais (preço personalizado, estoque em tempo real, carrinho) via streaming com Suspense ou client-side.

</details>

**44. O que causa hydration mismatch e como resolver?**
<sub>Aula [03 — Hydration: como o HTML do servidor ganha vida](aulas/03-hydration.md)</sub>
<details><summary>Ver resposta</summary>

HTML diferente entre servidor e cliente: Date/Math.random no render, window/localStorage, checagem de ambiente, HTML inválido, extensões do navegador. Resolver com useEffect, valor gerado no servidor passado por prop, `dynamic(..., { ssr: false })` ou `suppressHydrationWarning` em casos pontuais.

</details>

**45. Como usar um Server Component dentro de um Client Component?**
<sub>Aula [05 — Server Components vs Client Components](aulas/05-server-e-client-components.md)</sub>
<details><summary>Ver resposta</summary>

Não importando, mas passando como `children` ou prop a partir de um Server Component pai. Ele é renderizado no servidor e entra pronto no "buraco" do Client. É assim que se usam providers de contexto sem transformar tudo em client.

</details>

**46. Como evitar vazar segredos para o cliente?**
<sub>Aula [05 — Server Components vs Client Components](aulas/05-server-e-client-components.md)</sub>
<details><summary>Ver resposta</summary>

`import 'server-only'` em módulos sensíveis (o build falha se forem importados no cliente), nunca pôr segredo em variável `NEXT_PUBLIC_`, e passar pro Client só os campos necessários.

</details>

**47. Como melhorar o LCP?**
<sub>Aula [09 — Performance e SEO: Core Web Vitals, imagens, fontes, bundle e metadata](aulas/09-performance-e-seo.md)</sub>
<details><summary>Ver resposta</summary>

Página estática/ISR via CDN, next/image com `priority` na imagem principal e tamanhos corretos, streaming das partes lentas, menos JS bloqueante e next/font.

</details>

**48. Como reduzir o JavaScript enviado ao cliente?**
<sub>Aula [09 — Performance e SEO: Core Web Vitals, imagens, fontes, bundle e metadata](aulas/09-performance-e-seo.md)</sub>
<details><summary>Ver resposta</summary>

Server Components por padrão, `use client` só nas folhas, `dynamic()` pra componentes pesados, bundle analyzer pra achar libs grandes, e next/script com estratégia lazy pra terceiros.

</details>

**49. Como fazer SEO no Next?**
<sub>Aula [09 — Performance e SEO: Core Web Vitals, imagens, fontes, bundle e metadata](aulas/09-performance-e-seo.md)</sub>
<details><summary>Ver resposta</summary>

HTML renderizado no servidor, Metadata API (`metadata`/`generateMetadata`) com título, descrição, Open Graph e canonical, `sitemap.ts`, `robots.ts` e dados estruturados JSON-LD.

</details>

**50. Como fazer deploy de Next com Docker?**
<sub>Aula [10 — Runtimes, Build e Deploy](aulas/10-runtime-e-deploy.md)</sub>
<details><summary>Ver resposta</summary>

`output: 'standalone'` gera um servidor mínimo só com as dependências necessárias, pra uma imagem enxuta. Com várias réplicas, configurar cache handler compartilhado (Redis) e CDN na frente.

</details>
