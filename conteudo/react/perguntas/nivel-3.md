# React — perguntas, nível 3: Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [índice](README.md)

---

**1. Dois componentes irmãos precisam do mesmo dado. O que você faz?**
<sub>Aula [03 — Estado e quando o React re-renderiza](../aulas/03-estado-e-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

Subo o estado pro ancestral comum mais próximo (lifting state up), que passa o valor e os callbacks por props, mantendo uma fonte única da verdade. Se o dado for global e usado em muitos lugares distantes, considero Context ou uma store; se vier do servidor, um cache como o TanStack Query.

</details>

**2. Como evitar race condition ao buscar dados num useEffect?**
<sub>Aula [04 — Efeitos e useEffect (e quando não usar)](../aulas/04-efeitos-e-useeffect.md)</sub>
<details><summary>Ver resposta</summary>

No cleanup, marco uma flag para ignorar a resposta antiga e cancelo a requisição com AbortController, assim a resposta de uma busca anterior não sobrescreve a mais recente. Na prática prefiro TanStack Query ou buscar no servidor, que já resolvem cache, deduplicação, loading e erro.

</details>

**3. Uma tela React está lenta. Como você investiga e resolve?**
<sub>Aula [06 — Performance: memo, useMemo, useCallback, React Compiler e além](../aulas/06-performance.md)</sub>
<details><summary>Ver resposta</summary>

Meço com o Profiler do React DevTools no build de produção para ver o que renderiza, quanto tempo leva e por quê. Primeiro tento estrutura: descer o estado para perto de quem usa, passar a parte pesada como children, dividir contextos. Depois memo com props estabilizadas, virtualização para listas enormes, lazy com Suspense para código pesado e useTransition para manter a digitação responsiva.

</details>

**4. Como você implementaria um formulário grande com validação?**
<sub>Aula [07 — Estado global, dados do servidor e formulários](../aulas/07-estado-global-dados-e-formularios.md)</sub>
<details><summary>Ver resposta</summary>

Com React Hook Form, que usa inputs não controlados e re-renderiza bem menos que controlar tudo com useState, e validação por schema com Zod via resolver. Mostro erros por campo associados ao input para acessibilidade e reaproveito o mesmo schema para validar de novo no servidor, porque validação no front é experiência e no back é segurança.

</details>

**5. Uma busca que filtra 10 mil itens trava a digitação. Como resolver?**
<sub>Aula [08 — React concorrente, Suspense e o React 19](../aulas/08-react-concorrente-e-react-19.md)</sub>
<details><summary>Ver resposta</summary>

Separo o estado do input (urgente) do filtro aplicado, e marco a atualização do filtro como transição com useTransition, ou uso useDeferredValue sobre o texto, memoizando o cálculo do filtro. Assim a tecla aparece na hora e a lista atualiza logo depois. Se a lista renderizada também for enorme, virtualizo.

</details>

**6. Que cuidados de acessibilidade você teria num modal?**
<sub>Aula [09 — Testes e acessibilidade em React](../aulas/09-testes-e-acessibilidade.md)</sub>
<details><summary>Ver resposta</summary>

Ao abrir, levar o foco para dentro; prender o foco enquanto estiver aberto; fechar com Esc; devolver o foco para o elemento que abriu; ter título associado e papel de diálogo. O dialog nativo ou componentes acessíveis prontos como os do Radix já resolvem boa parte.

</details>

**7. Como você distribui os testes de uma aplicação React?**
<sub>Aula [09 — Testes e acessibilidade em React](../aulas/09-testes-e-acessibilidade.md)</sub>
<details><summary>Ver resposta</summary>

Base com TypeScript e lint; unitários para funções puras, reducers e custom hooks; a maior parte em testes de integração de componente com Testing Library e MSW; e poucos E2E com Playwright nos fluxos críticos, como login e checkout. Snapshot só com moderação.

</details>

**8. Como você organizaria um projeto React grande?**
<sub>Aula [10 — Arquitetura de front-end com React](../aulas/10-arquitetura-de-front.md)</sub>
<details><summary>Ver resposta</summary>

Pastas por feature com API pública e dependências num sentido só; UI separada da lógica em custom hooks e da camada de API; TanStack Query para dados do servidor, URL para filtros e uma store pequena para o global; TypeScript com tipos derivados dos schemas; design system com componentes acessíveis documentados no Storybook; Error Boundaries por região; e testes de integração com Testing Library e MSW.

</details>
