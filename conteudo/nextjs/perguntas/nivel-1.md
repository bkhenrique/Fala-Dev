# Next.js — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. O que é o Next.js?**
<sub>Aula [01 — O que é o Next.js e por que ele existe](../aulas/01-o-que-e-next.md)</sub>
<details><summary>Ver resposta</summary>

Framework React fullstack que adiciona ao React roteamento por arquivos, várias estratégias de renderização (SSR, SSG, ISR), Server Components, backend embutido (Server Actions, Route Handlers) e otimizações de performance.

</details>

**2. Qual a diferença entre React e Next?**
<sub>Aula [01 — O que é o Next.js e por que ele existe](../aulas/01-o-que-e-next.md)</sub>
<details><summary>Ver resposta</summary>

React é uma biblioteca de UI baseada em componentes. Next é um framework em cima do React que resolve roteamento, renderização no servidor, busca de dados, backend, build e otimizações.

</details>

**3. Qual a diferença entre CSR, SSR, SSG e ISR?**
<sub>Aula [02 — Estratégias de renderização: CSR, SSR, SSG, ISR (e PPR)](../aulas/02-estrategias-de-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

É sobre quando e onde o HTML é gerado. CSR: no navegador. SSR: no servidor a cada requisição. SSG: no build. ISR: estático regenerado por tempo ou sob demanda.

</details>

**4. O que é Partial Prerendering?**
<sub>Aula [02 — Estratégias de renderização: CSR, SSR, SSG, ISR (e PPR)](../aulas/02-estrategias-de-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

Misturar estático e dinâmico na mesma rota: a casca da página é pré-renderizada e servida na hora, e as partes dinâmicas dentro de Suspense chegam por streaming. No Next 16 faz parte do modelo Cache Components.

</details>

**5. O que é hydration?**
<sub>Aula [03 — Hydration: como o HTML do servidor ganha vida](../aulas/03-hydration.md)</sub>
<details><summary>Ver resposta</summary>

O React no navegador pega o HTML vindo do servidor, renderiza os componentes em memória, reaproveita o DOM e conecta eventos e estado, tornando a página interativa.

</details>

**6. O que é o RSC Payload?**
<sub>Aula [03 — Hydration: como o HTML do servidor ganha vida](../aulas/03-hydration.md)</sub>
<details><summary>Ver resposta</summary>

Representação compacta da árvore renderizada pelos Server Components, com os "buracos" dos Client Components, os arquivos JS a carregar e as props passadas. Usado na reconciliação e na navegação client-side.

</details>

**7. Como funciona o roteamento no App Router?**
<sub>Aula [04 — App Router: roteamento por arquivos, layouts e arquivos especiais](../aulas/04-app-router-roteamento.md)</sub>
<details><summary>Ver resposta</summary>

Cada pasta em `app/` é um segmento da URL; a rota fica pública quando há `page.tsx`. Arquivos especiais por segmento: layout, loading, error, not-found, route.

</details>

**8. O que fazem loading.tsx e error.tsx?**
<sub>Aula [04 — App Router: roteamento por arquivos, layouts e arquivos especiais](../aulas/04-app-router-roteamento.md)</sub>
<details><summary>Ver resposta</summary>

loading.tsx vira um Suspense automático do segmento (skeleton e streaming). error.tsx vira um Error Boundary (precisa ser Client Component) que isola falhas do segmento e permite tentar de novo com `reset`.

</details>

**9. O que são route groups e rotas dinâmicas?**
<sub>Aula [04 — App Router: roteamento por arquivos, layouts e arquivos especiais](../aulas/04-app-router-roteamento.md)</sub>
<details><summary>Ver resposta</summary>

Route group `(nome)`: pasta que não entra na URL, usada pra organizar ou aplicar layouts diferentes. Dinâmicas: `[id]`, catch-all `[...slug]`, optional catch-all `[[...slug]]`, com valores em `params`.

</details>

**10. O que o componente `<Link>` faz de especial?**
<sub>Aula [04 — App Router: roteamento por arquivos, layouts e arquivos especiais](../aulas/04-app-router-roteamento.md)</sub>
<details><summary>Ver resposta</summary>

Navegação client-side (sem recarregar a página, mantendo layouts) e prefetch automático das rotas visíveis, deixando a navegação praticamente instantânea.

</details>

**11. Diferença entre Server e Client Components?**
<sub>Aula [05 — Server Components vs Client Components](../aulas/05-server-e-client-components.md)</sub>
<details><summary>Ver resposta</summary>

Server: rodam só no servidor, podem ser async, acessam banco e segredos, não vão pro bundle, não usam hooks/eventos. Client (`use client`): pré-renderizados no servidor e hidratados no navegador, usam estado, efeitos, eventos e APIs do browser.

</details>

**12. Como buscar dados no App Router?**
<sub>Aula [06 — Busca de dados e Cache](../aulas/06-dados-e-cache.md)</sub>
<details><summary>Ver resposta</summary>

Em Server Components async, com `await` direto no banco ou em `fetch`. Sem useEffect nem endpoint intermediário. Em paralelo com Promise.all ou Suspense separados pra evitar waterfall.

</details>

**13. O que é streaming e como usar?**
<sub>Aula [06 — Busca de dados e Cache](../aulas/06-dados-e-cache.md)</sub>
<details><summary>Ver resposta</summary>

Enviar o HTML em partes: primeiro o que está pronto e os fallbacks, depois os componentes lentos na mesma resposta. Usa-se `<Suspense fallback>` em volta de componentes async, ou `loading.tsx`.

</details>

**14. O que é uma Server Action?**
<sub>Aula [07 — Mutations: Server Actions e Route Handlers](../aulas/07-server-actions-e-route-handlers.md)</sub>
<details><summary>Ver resposta</summary>

Função async com `'use server'` que roda no servidor e pode ser chamada da UI (form action ou Client Component). Por baixo vira um POST interno; integra com revalidação e redirect e funciona com progressive enhancement.

</details>

**15. O que é UI otimista?**
<sub>Aula [07 — Mutations: Server Actions e Route Handlers](../aulas/07-server-actions-e-route-handlers.md)</sub>
<details><summary>Ver resposta</summary>

Mostrar na hora o resultado esperado de uma ação (ex: curtida) antes da confirmação do servidor, e desfazer se falhar. No React 19, `useOptimistic`.

</details>

**16. O que o middleware (proxy) faz?**
<sub>Aula [08 — Middleware (Proxy), Autenticação e Segurança](../aulas/08-middleware-autenticacao-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Roda antes da rota e pode redirecionar, reescrever URL, ler/definir cookies e headers. Usos: redirect de auth, i18n, A/B test. Deve ser leve. No Next 16 o arquivo virou `proxy.ts`.

</details>

**17. O que é a DAL (Data Access Layer) no Next?**
<sub>Aula [08 — Middleware (Proxy), Autenticação e Segurança](../aulas/08-middleware-autenticacao-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Camada `server-only` que centraliza o acesso a dados e sempre verifica a sessão e o ownership antes de consultar, garantindo autorização perto dos dados independente de onde é chamada.

</details>

**18. O que são as Core Web Vitals?**
<sub>Aula [09 — Performance e SEO: Core Web Vitals, imagens, fontes, bundle e metadata](../aulas/09-performance-e-seo.md)</sub>
<details><summary>Ver resposta</summary>

LCP (tempo até o maior elemento visível, ≤2,5s), INP (resposta a interações, ≤200ms) e CLS (estabilidade do layout, ≤0,1). Medidas de experiência real, usadas no ranking do Google.

</details>

**19. O que o `next/image` faz?**
<sub>Aula [09 — Performance e SEO: Core Web Vitals, imagens, fontes, bundle e metadata](../aulas/09-performance-e-seo.md)</sub>
<details><summary>Ver resposta</summary>

Redimensiona por dispositivo, converte para WebP/AVIF, lazy loading por padrão, reserva espaço com width/height (evita CLS) e permite prioridade para a imagem do LCP.

</details>
