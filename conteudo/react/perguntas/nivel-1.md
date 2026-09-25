# React — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. O que é o React?**
<sub>Aula [01 — O que é o React e o modelo mental dele](../aulas/01-o-que-e-react.md)</sub>
<details><summary>Ver resposta</summary>

Uma biblioteca declarativa pra construir interfaces com componentes. Você descreve como a tela deve ficar para cada estado (UI = f(estado)) e o React atualiza o DOM quando o estado muda. Cuida só da UI; roteamento, dados e renderização no servidor vêm de bibliotecas ou frameworks como o Next.

</details>

**2. O que é JSX?**
<sub>Aula [01 — O que é o React e o modelo mental dele](../aulas/01-o-que-e-react.md)</sub>
<details><summary>Ver resposta</summary>

Uma extensão de sintaxe que parece HTML dentro do JavaScript. O compilador transforma em chamadas de função que geram objetos descrevendo os elementos. Por isso usa className, aceita qualquer expressão entre chaves e escapa textos automaticamente, o que protege contra XSS.

</details>

**3. O que é o Virtual DOM e a reconciliação?**
<sub>Aula [01 — O que é o React e o modelo mental dele](../aulas/01-o-que-e-react.md)</sub>
<details><summary>Ver resposta</summary>

A cada mudança de estado o React chama os componentes e gera uma nova árvore de elementos (objetos baratos). A reconciliação compara essa árvore com a anterior e aplica no DOM real só as diferenças. Usa heurísticas: tipo de elemento diferente recria a subárvore, e listas usam a key.

</details>

**4. O que são props e por que são somente leitura?**
<sub>Aula [02 — Componentes, props, composição e listas com key](../aulas/02-componentes-props-e-listas.md)</sub>
<details><summary>Ver resposta</summary>

São os dados que o componente recebe do pai. São somente leitura pra manter o fluxo de dados unidirecional: quem é dono do dado é quem pode mudá-lo. Se algo precisa mudar, é estado de algum componente, e o filho avisa o pai por um callback.

</details>

**5. O que dispara um re-render de um componente?**
<sub>Aula [03 — Estado e quando o React re-renderiza](../aulas/03-estado-e-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

Mudança no estado dele, re-render do pai (todos os filhos renderizam por padrão, mesmo com props iguais) e mudança num contexto que ele consome. Props mudando sozinhas não são o gatilho; o gatilho é o pai renderizar.

</details>

**6. Pra que serve o useEffect?**
<sub>Aula [04 — Efeitos e useEffect (e quando não usar)](../aulas/04-efeitos-e-useeffect.md)</sub>
<details><summary>Ver resposta</summary>

Pra sincronizar o componente com um sistema externo enquanto ele está na tela: conexões, assinaturas, timers, bibliotecas de terceiros. Roda depois do commit; o array de dependências define quando roda de novo, e a função de cleanup desfaz o que o efeito fez.

</details>

**7. Quais são as regras dos hooks e por que existem?**
<sub>Aula [05 — Hooks: regras, useRef, useReducer, useContext e custom hooks](../aulas/05-hooks.md)</sub>
<details><summary>Ver resposta</summary>

Chamar hooks só no nível superior (nunca em if, loop ou depois de return) e só em componentes ou custom hooks. Existem porque o React identifica os hooks pela ordem de chamada, guardando o estado numa lista; se a ordem mudar entre renders, um estado recebe o valor de outro.

</details>

**8. O que é um custom hook?**
<sub>Aula [05 — Hooks: regras, useRef, useReducer, useContext e custom hooks](../aulas/05-hooks.md)</sub>
<details><summary>Ver resposta</summary>

Uma função que começa com use e combina outros hooks para reaproveitar lógica com estado, como useDebounce ou usePedidos. Cada componente que usa o hook tem sua própria cópia do estado. Substitui HOCs e render props na maioria dos casos e deixa componentes curtos e testáveis.

</details>

**9. O que fazem memo, useMemo e useCallback?**
<sub>Aula [06 — Performance: memo, useMemo, useCallback, React Compiler e além](../aulas/06-performance.md)</sub>
<details><summary>Ver resposta</summary>

memo faz um componente pular o render quando as props são iguais (comparação rasa). useMemo guarda o resultado de um cálculo até as dependências mudarem. useCallback guarda a referência de uma função. Os três são memoização e só valem quando há ganho medido.

</details>

**10. O que é o React Compiler?**
<sub>Aula [06 — Performance: memo, useMemo, useCallback, React Compiler e além](../aulas/06-performance.md)</sub>
<details><summary>Ver resposta</summary>

Um compilador que analisa os componentes no build e aplica memoização automaticamente, sem precisar escrever memo, useMemo e useCallback. Funciona com código que segue as regras do React (pureza, imutabilidade, regras dos hooks).

</details>

**11. Que tipos de estado existem numa aplicação React?**
<sub>Aula [07 — Estado global, dados do servidor e formulários](../aulas/07-estado-global-dados-e-formularios.md)</sub>
<details><summary>Ver resposta</summary>

Estado de UI local (modal, aba, input), estado de servidor (dados vindos da API, que é um cache), estado da URL (filtros, página, busca), estado global de cliente (usuário, tema, carrinho) e estado de formulário. Cada tipo tem uma ferramenta mais adequada.

</details>

**12. O que é renderização concorrente?**
<sub>Aula [08 — React concorrente, Suspense e o React 19](../aulas/08-react-concorrente-e-react-19.md)</sub>
<details><summary>Ver resposta</summary>

A capacidade do React, desde a versão 18, de interromper uma renderização em andamento, atender algo mais urgente e depois retomar ou descartar o trabalho velho. Não é paralelismo em várias threads, é priorização na thread principal, habilitada pela arquitetura Fiber.

</details>

**13. O que é o Suspense?**
<sub>Aula [08 — React concorrente, Suspense e o React 19](../aulas/08-react-concorrente-e-react-19.md)</sub>
<details><summary>Ver resposta</summary>

Um componente que mostra um fallback enquanto uma parte da árvore espera algo: código carregado com lazy ou dados com frameworks e bibliotecas compatíveis. Permite skeletons declarativos por região da tela e, no servidor, streaming do HTML.

</details>

**14. Qual a filosofia da React Testing Library?**
<sub>Aula [09 — Testes e acessibilidade em React](../aulas/09-testes-e-acessibilidade.md)</sub>
<details><summary>Ver resposta</summary>

Testar como o usuário usa o software: renderizar o componente, encontrar elementos por papel e label (como um leitor de tela), interagir com userEvent e verificar o que aparece na tela, sem testar detalhes de implementação. Assim refatorações internas não quebram os testes.

</details>

**15. O que é o MSW e por que usar em testes?**
<sub>Aula [09 — Testes e acessibilidade em React](../aulas/09-testes-e-acessibilidade.md)</sub>
<details><summary>Ver resposta</summary>

Mock Service Worker: intercepta requisições na camada de rede e devolve respostas simuladas. O componente roda igual à produção, com o mesmo cliente HTTP, e dá para simular erro, lentidão e lista vazia. Os mesmos handlers servem para desenvolvimento e Storybook.

</details>

**16. SPA ou framework como o Next?**
<sub>Aula [10 — Arquitetura de front-end com React](../aulas/10-arquitetura-de-front.md)</sub>
<details><summary>Ver resposta</summary>

SPA com Vite para aplicações atrás de login, como painéis internos: é só arquivo estático e o backend é separado. Framework quando SEO e primeiro carregamento importam, como sites públicos e e-commerce, pela renderização no servidor e estática e pela possibilidade de ter um BFF junto.

</details>
