# Next.js — glossário

Cada termo tem três partes: **Em uma frase** (a definição curta), **Traduzindo** (a explicação simples) e **Como falar** (uma frase pronta pra treinar em voz alta). Alguns trazem também **Não confundir com** ou **Cuidado**.

É material de revisão: a explicação completa está nas [aulas](README.md).

---

### Next.js
- **Em uma frase:** framework React fullstack com roteamento por arquivos, múltiplas estratégias de renderização e backend embutido.
- **Traduzindo:** React "com baterias": rotas, servidor, otimização e deploy já resolvidos.
- **Como falar:** "Uso Next pelo controle de renderização por rota, SSR pra SEO, estático pra performance, e pela possibilidade de ter um BFF no mesmo projeto."

### CSR (Client-Side Rendering)
- **Em uma frase:** o navegador baixa um HTML quase vazio e o JavaScript monta a página.
- **Traduzindo:** o cliente recebe as peças e monta o móvel em casa.
- **Como falar:** "CSR é bom pra áreas logadas muito interativas, mas prejudica SEO e o primeiro carregamento."

### SSR (Server-Side Rendering)
- **Em uma frase:** o HTML é gerado no servidor a cada requisição.
- **Traduzindo:** o móvel chega montado, feito sob encomenda na hora.
- **Como falar:** "Uso SSR quando o conteúdo é dinâmico por usuário ou muda sempre e precisa de SEO."

### SSG (Static Site Generation)
- **Em uma frase:** o HTML é gerado no *build* e servido pronto, normalmente via CDN.
- **Traduzindo:** móvel de pronta-entrega, já montado no estoque.
- **Como falar:** "Páginas institucionais e blog em SSG: carregam instantâneo e custam quase nada de servidor."

### ISR (Incremental Static Regeneration)
- **Em uma frase:** página estática que é regenerada em background depois de um tempo (ou sob demanda).
- **Traduzindo:** o estoque é reposto de tempos em tempos sem fechar a loja.
- **Como falar:** "Com ISR tenho a performance do estático e dados atualizados com `revalidate` ou revalidação sob demanda por tag."

### Hydration
- **Em uma frase:** processo em que o React no navegador "assume" o HTML que veio do servidor, conectando eventos e estado.
- **Traduzindo:** o HTML chega como uma foto; a hydration dá vida a ela.
- **Como falar:** "Erro de *hydration mismatch* acontece quando o HTML do servidor difere do render no cliente, por exemplo usando `Date.now()` ou `window` no render."

### Server Components (RSC)
- **Em uma frase:** componentes que rodam só no servidor, podem acessar banco e segredos direto e não mandam JS pro cliente.
- **Traduzindo:** a parte da página que vem pronta e não pesa no navegador.
- **Como falar:** "No App Router tudo é Server Component por padrão; só marco `"use client"` onde preciso de interatividade, o que reduz o *bundle*."

### Client Components
- **Em uma frase:** componentes marcados com `"use client"`, que rodam no navegador e podem usar estado, efeitos e eventos.
- **Traduzindo:** a parte interativa: botões, formulários, modais.
- **Como falar:** "Empurro o `"use client"` o mais pra baixo possível na árvore, nas folhas interativas."

### Server Actions
- **Em uma frase:** funções marcadas com `"use server"` que executam no servidor e podem ser chamadas direto de formulários/componentes.
- **Traduzindo:** chamar uma função do backend sem criar endpoint manualmente.
- **Como falar:** "Uso Server Actions pra mutações de formulário, sempre validando input e autorização dentro delas, porque na prática viram um endpoint público."

### Route Handlers
- **Em uma frase:** arquivos `route.ts` que criam endpoints HTTP (GET, POST…) dentro do app.
- **Traduzindo:** a API do próprio Next.
- **Como falar:** "Uso Route Handlers como BFF: o front chama o Next, que chama os serviços internos com os segredos no servidor."

### Middleware / Proxy (Next)
- **Em uma frase:** código que roda antes da requisição chegar na rota, útil pra redirect, auth e reescrita de URL. No Next 16 o arquivo passou a se chamar `proxy.ts`.
- **Traduzindo:** o porteiro que decide pra onde mandar o visitante.
- **Como falar:** "O middleware checa o cookie de sessão e redireciona pra login, rodando antes de renderizar qualquer página."

### Streaming e Suspense
- **Em uma frase:** enviar a página em partes conforme ficam prontas, mostrando *fallback* (`loading.tsx`) enquanto o resto carrega.
- **Traduzindo:** servir a entrada enquanto o prato principal termina.
- **Como falar:** "Com streaming o usuário vê o layout na hora, e as partes lentas aparecem quando chegam, melhorando a percepção de performance."

### Core Web Vitals
- **Em uma frase:** métricas do Google de experiência: **LCP** (carregamento do maior elemento), **INP** (resposta a interação), **CLS** (estabilidade visual).
- **Traduzindo:** carrega rápido? responde rápido? a tela fica pulando?
- **Como falar:** "Melhorei o LCP com `next/image` e `priority` na imagem principal, e zerei o CLS reservando espaço das imagens."
