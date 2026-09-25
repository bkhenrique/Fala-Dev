# Next.js — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. Quais os problemas de uma SPA renderizada só no cliente?**
<sub>Aula [01 — O que é o Next.js e por que ele existe](../aulas/01-o-que-e-next.md)</sub>
<details><summary>Ver resposta</summary>

SEO fraco (HTML vazio), tela em branco no primeiro carregamento, bundle grande e waterfall de requisições (baixar JS → executar → buscar dados).

</details>

**2. Pages Router vs App Router?**
<sub>Aula [01 — O que é o Next.js e por que ele existe](../aulas/01-o-que-e-next.md)</sub>
<details><summary>Ver resposta</summary>

Pages Router: pasta `pages/`, dados com getServerSideProps/getStaticProps, todos os componentes hidratados. App Router: pasta `app/`, baseado em React Server Components (Server por padrão), layouts aninhados, loading/error, streaming, Server Actions. Podem coexistir; projetos novos usam App Router.

</details>

**3. Quando usar SSR?**
<sub>Aula [02 — Estratégias de renderização: CSR, SSR, SSG, ISR (e PPR)](../aulas/02-estrategias-de-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

Quando o conteúdo muda a cada acesso ou é personalizado (cookies, usuário) e precisa de SEO: busca, feed, páginas dependentes do usuário. Custo: processamento por requisição e TTFB dependente dos dados.

</details>

**4. Quando usar SSG?**
<sub>Aula [02 — Estratégias de renderização: CSR, SSR, SSG, ISR (e PPR)](../aulas/02-estrategias-de-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

Conteúdo que muda pouco: landing page, institucional, blog, documentação. É o mais rápido e barato (CDN), mas o dado fica congelado até o próximo build.

</details>

**5. Como funciona o ISR e o stale-while-revalidate?**
<sub>Aula [02 — Estratégias de renderização: CSR, SSR, SSG, ISR (e PPR)](../aulas/02-estrategias-de-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

A página é estática, mas regenerada em background. Com `revalidate: 60`, depois de 60s o próximo visitante ainda recebe a versão antiga, e isso dispara a regeneração; os seguintes recebem a nova. Também dá pra revalidar sob demanda com revalidatePath/revalidateTag.

</details>

**6. Server Components são hidratados?**
<sub>Aula [03 — Hydration: como o HTML do servidor ganha vida](../aulas/03-hydration.md)</sub>
<details><summary>Ver resposta</summary>

Não. Só os Client Components são enviados como JS e hidratados. Server Components chegam como resultado (HTML + RSC Payload), o que reduz o JS e acelera a interatividade.

</details>

**7. Pra que serve o layout e qual a vantagem dele?**
<sub>Aula [04 — App Router: roteamento por arquivos, layouts e arquivos especiais](../aulas/04-app-router-roteamento.md)</sub>
<details><summary>Ver resposta</summary>

UI compartilhada que envolve as páginas filhas. Não re-renderiza ao navegar entre filhas, preservando estado (sidebar, inputs, scroll).

</details>

**8. Client Component roda só no navegador?**
<sub>Aula [05 — Server Components vs Client Components](../aulas/05-server-e-client-components.md)</sub>
<details><summary>Ver resposta</summary>

Não. Ele também é pré-renderizado no servidor para gerar o HTML inicial; a diferença é que também é enviado e hidratado no cliente.

</details>

**9. O que significa `"use client"` marcar uma fronteira?**
<sub>Aula [05 — Server Components vs Client Components](../aulas/05-server-e-client-components.md)</sub>
<details><summary>Ver resposta</summary>

Tudo que aquele arquivo importa também entra no bundle do cliente. Por isso se empurra o `use client` para as folhas da árvore, deixando páginas e layouts como Server.

</details>

**10. Server Components é a mesma coisa que SSR?**
<sub>Aula [05 — Server Components vs Client Components](../aulas/05-server-e-client-components.md)</sub>
<details><summary>Ver resposta</summary>

Não. SSR é quando o HTML é gerado (por requisição). Server Component é qual código roda só no servidor e não vai pro cliente. Um Server Component pode ser estático ou dinâmico, e um Client Component também passa por SSR.

</details>

**11. Quais são as camadas de cache do Next?**
<sub>Aula [06 — Busca de dados e Cache](../aulas/06-dados-e-cache.md)</sub>
<details><summary>Ver resposta</summary>

Request memoization (deduplica chamadas numa renderização), Data Cache (resultados persistentes entre requisições), Full Route Cache (HTML e payload de rotas estáticas) e Router Cache (no navegador, pra navegação).

</details>

**12. O que torna uma rota dinâmica?**
<sub>Aula [06 — Busca de dados e Cache](../aulas/06-dados-e-cache.md)</sub>
<details><summary>Ver resposta</summary>

Usar dados de requisição: `cookies()`, `headers()`, `searchParams`, fetch sem cache/`no-store`, ou `dynamic = 'force-dynamic'`. O relatório do build mostra estática (○/●) ou dinâmica (ƒ).

</details>

**13. revalidatePath vs revalidateTag?**
<sub>Aula [06 — Busca de dados e Cache](../aulas/06-dados-e-cache.md)</sub>
<details><summary>Ver resposta</summary>

revalidatePath invalida uma rota específica. revalidateTag invalida todos os dados etiquetados com a tag, em qualquer página. Tag é mais precisa quando o mesmo dado aparece em várias rotas.

</details>

**14. O padrão de cache do Next é sempre o mesmo?**
<sub>Aula [06 — Busca de dados e Cache](../aulas/06-dados-e-cache.md)</sub>
<details><summary>Ver resposta</summary>

Não. No 14 o fetch era cacheado por padrão; no 15 deixou de ser (e GET de Route Handler também); no 16 surgiu o modelo Cache Components com `'use cache'`. Sempre conferir a versão do projeto.

</details>

**15. Qual o principal cuidado de segurança com Server Actions?**
<sub>Aula [07 — Mutations: Server Actions e Route Handlers](../aulas/07-server-actions-e-route-handlers.md)</sub>
<details><summary>Ver resposta</summary>

Toda action é um endpoint público. Dentro dela sempre autenticar, autorizar (incluindo ownership) e validar o input com Zod. Esconder o botão não é segurança.

</details>

**16. Server Action ou Route Handler?**
<sub>Aula [07 — Mutations: Server Actions e Route Handlers](../aulas/07-server-actions-e-route-handlers.md)</sub>
<details><summary>Ver resposta</summary>

Server Action pra mutações da própria UI. Route Handler pra endpoint HTTP de verdade: webhooks, app mobile, terceiros, GET público com cache HTTP, streaming (SSE).

</details>

**17. Por que o front não deve chamar um LLM diretamente?**
<sub>Aula [07 — Mutations: Server Actions e Route Handlers](../aulas/07-server-actions-e-route-handlers.md)</sub>
<details><summary>Ver resposta</summary>

A chave de API ficaria exposta no navegador. Além disso perde-se controle de custo, rate limit, validação do output e proteção de PII. O certo é passar por um BFF (Route Handler/Action) no servidor.

</details>

**18. Por que não fazer toda a autenticação só no middleware?**
<sub>Aula [08 — Middleware (Proxy), Autenticação e Segurança](../aulas/08-middleware-autenticacao-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Defesa em profundidade: o middleware faz checagem otimista, mas a verificação real deve ficar perto dos dados (DAL, Server Actions, Route Handlers). A CVE-2025-29927 permitia pular o middleware, expondo quem dependia só dele.

</details>

**19. Onde guardar o token de sessão?**
<sub>Aula [08 — Middleware (Proxy), Autenticação e Segurança](../aulas/08-middleware-autenticacao-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Em cookie `httpOnly` (JS não lê, protege contra roubo por XSS), `Secure` e `SameSite` (ajuda contra CSRF). Evitar localStorage.

</details>

**20. XSS vs CSRF?**
<sub>Aula [08 — Middleware (Proxy), Autenticação e Segurança](../aulas/08-middleware-autenticacao-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

XSS: injetar script malicioso na página (defesa: React escapa por padrão, sanitizar `dangerouslySetInnerHTML`, CSP, cookie httpOnly). CSRF: site malicioso faz o navegador da vítima enviar requisição autenticada (defesa: SameSite, checagem de Origin, token CSRF).

</details>

**21. Node runtime vs Edge runtime?**
<sub>Aula [10 — Runtimes, Build e Deploy](../aulas/10-runtime-e-deploy.md)</sub>
<details><summary>Ver resposta</summary>

Node: APIs completas, qualquer lib, padrão. Edge: subconjunto de Web APIs, roda perto do usuário, cold start baixo, bom pra lógica leve (redirects, geolocalização). Se precisa de banco numa região só, Node na mesma região costuma ser mais rápido.

</details>

**22. Quais as limitações do `output: 'export'`?**
<sub>Aula [10 — Runtimes, Build e Deploy](../aulas/10-runtime-e-deploy.md)</sub>
<details><summary>Ver resposta</summary>

Gera só arquivos estáticos: perde SSR, Server Actions, Route Handlers dinâmicos, ISR, middleware e a otimização de imagem padrão. Em troca, hospeda em qualquer CDN com custo mínimo.

</details>

**23. Qual o cuidado com variáveis `NEXT_PUBLIC_`?**
<sub>Aula [10 — Runtimes, Build e Deploy](../aulas/10-runtime-e-deploy.md)</sub>
<details><summary>Ver resposta</summary>

Vão pro navegador (nunca pôr segredo) e são embutidas no JS no momento do build. A mesma imagem em ambientes diferentes carrega o valor do build; precisa buildar por ambiente ou ler a config no servidor.

</details>
