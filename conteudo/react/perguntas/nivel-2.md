# React — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. Qual a diferença entre as fases de render e commit?**
<sub>Aula [01 — O que é o React e o modelo mental dele](../aulas/01-o-que-e-react.md)</sub>
<details><summary>Ver resposta</summary>

No render o React chama os componentes pra calcular o JSX; essa fase deve ser pura e pode ser repetida, pausada ou descartada. No commit ele aplica as mudanças no DOM, e só depois rodam os efeitos. Renderizar não significa mexer na tela.

</details>

**2. Por que os componentes precisam ser puros?**
<sub>Aula [01 — O que é o React e o modelo mental dele](../aulas/01-o-que-e-react.md)</sub>
<details><summary>Ver resposta</summary>

Porque o React pode renderizar um componente várias vezes, pausar e descartar renders (renderização concorrente), e o StrictMode renderiza duas vezes em desenvolvimento de propósito. Efeito colateral durante o render gera comportamento imprevisível; ele deve ir para event handlers ou efeitos.

</details>

**3. Por que a key é importante em listas? Posso usar o índice?**
<sub>Aula [02 — Componentes, props, composição e listas com key](../aulas/02-componentes-props-e-listas.md)</sub>
<details><summary>Ver resposta</summary>

A key é a identidade de cada item na reconciliação. Deve ser única entre irmãos e estável, normalmente o id. Com índice, inserir no começo ou reordenar desloca os índices, o React reaproveita o componente errado e o estado (texto de input, checkbox) vai para a linha errada. Índice só em lista estática; aleatório nunca.

</details>

**4. O que é prop drilling e como evitar?**
<sub>Aula [02 — Componentes, props, composição e listas com key](../aulas/02-componentes-props-e-listas.md)</sub>
<details><summary>Ver resposta</summary>

É passar uma prop por vários níveis de componentes que só a repassam. Dá pra evitar com composição (montar os filhos no componente de cima e passar como children), com Context para dados globais que mudam pouco, ou com uma store.

</details>

**5. Por que `{itens.length && <Lista />}` pode mostrar um 0 na tela?**
<sub>Aula [02 — Componentes, props, composição e listas com key](../aulas/02-componentes-props-e-listas.md)</sub>
<details><summary>Ver resposta</summary>

Porque o && retorna o primeiro valor falsy, e 0 é um valor que o React renderiza. Com a lista vazia aparece 0. Use uma condição booleana: itens.length > 0 && <Lista />.

</details>

**6. Por que o setState não atualiza o valor imediatamente?**
<sub>Aula [03 — Estado e quando o React re-renderiza](../aulas/03-estado-e-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

Porque o estado é uma foto de cada render: dentro do mesmo render a variável tem sempre o mesmo valor. O set agenda uma atualização que aparece no próximo render, e o React agrupa várias atualizações num render só (batching). Quando o novo valor depende do anterior, use o updater: set(prev => prev + 1).

</details>

**7. Por que o estado deve ser atualizado de forma imutável?**
<sub>Aula [03 — Estado e quando o React re-renderiza](../aulas/03-estado-e-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

Porque o React detecta mudança comparando referências (Object.is), que é barato. Se você muta um array com push e passa o mesmo array, a referência é a mesma e o React pode não re-renderizar. Crie novos objetos e arrays com spread, map e filter (ou use Immer).

</details>

**8. O que é estado derivado e por que evitar duplicar estado?**
<sub>Aula [03 — Estado e quando o React re-renderiza](../aulas/03-estado-e-renderizacao.md)</sub>
<details><summary>Ver resposta</summary>

É um valor que pode ser calculado a partir de props ou de outro estado, como o total de um carrinho. Guardá-lo em outro useState cria duas fontes da verdade que podem dessincronizar e exige efeitos extras. Guarde o mínimo e calcule o resto no render.

</details>

**9. Por que meu efeito roda duas vezes em desenvolvimento?**
<sub>Aula [04 — Efeitos e useEffect (e quando não usar)](../aulas/04-efeitos-e-useeffect.md)</sub>
<details><summary>Ver resposta</summary>

Porque o StrictMode monta, desmonta e monta o componente de novo em desenvolvimento, pra revelar efeitos sem cleanup correto. Em produção roda uma vez. A correção é escrever o cleanup de forma que montar duas vezes tenha o mesmo resultado.

</details>

**10. O que acontece se eu omitir uma dependência do useEffect?**
<sub>Aula [04 — Efeitos e useEffect (e quando não usar)](../aulas/04-efeitos-e-useeffect.md)</sub>
<details><summary>Ver resposta</summary>

O efeito passa a enxergar valores de um render antigo (stale closure) e não roda de novo quando esse valor muda, gerando bugs difíceis. As dependências devem ser tudo que o efeito usa; se ele roda demais, mude o código (updater, mover a função pra dentro, depender de primitivos), não esconda a dependência.

</details>

**11. Quando você não precisa de um useEffect?**
<sub>Aula [04 — Efeitos e useEffect (e quando não usar)](../aulas/04-efeitos-e-useeffect.md)</sub>
<details><summary>Ver resposta</summary>

Para calcular valor derivado (faça no render), para reagir a uma ação do usuário (faça no event handler), para resetar estado quando uma prop muda (use key), para avisar o pai de uma mudança (chame o callback no mesmo handler) e para encadear estados. Cada efeito desnecessário custa um render extra e abre espaço para bugs.

</details>

**12. useState ou useRef?**
<sub>Aula [05 — Hooks: regras, useRef, useReducer, useContext e custom hooks](../aulas/05-hooks.md)</sub>
<details><summary>Ver resposta</summary>

useState para dados que a tela mostra: mudar causa re-render. useRef para valores de bastidor que persistem entre renders sem re-renderizar (id de timer, valor anterior, instância de biblioteca) e para acessar elementos do DOM. Não leia nem escreva ref.current durante o render.

</details>

**13. Quando usar useReducer em vez de useState?**
<sub>Aula [05 — Hooks: regras, useRef, useReducer, useContext e custom hooks](../aulas/05-hooks.md)</sub>
<details><summary>Ver resposta</summary>

Quando o estado tem várias partes que mudam juntas ou muitas formas de mudar com regras. O reducer é uma função pura (estado, ação) → novo estado, que centraliza as transições, é fácil de testar e deixa o componente só despachando o que aconteceu.

</details>

**14. Qual o custo de usar Context para estado global?**
<sub>Aula [05 — Hooks: regras, useRef, useReducer, useContext e custom hooks](../aulas/05-hooks.md)</sub>
<details><summary>Ver resposta</summary>

Quando o value do Provider muda, todos os componentes que consomem aquele contexto re-renderizam, e não dá para assinar só uma parte. Por isso: dividir em contextos menores, memoizar o value, e para estado global que muda muito usar uma store com seletores, como Zustand.

</details>

**15. Por que um componente com memo continua re-renderizando?**
<sub>Aula [06 — Performance: memo, useMemo, useCallback, React Compiler e além](../aulas/06-performance.md)</sub>
<details><summary>Ver resposta</summary>

Normalmente porque recebe um objeto, array ou função criado no render do pai: são referências novas a cada render, então a comparação rasa sempre acusa mudança. Estabilize com useMemo e useCallback (ou deixe o React Compiler fazer isso), ou mude a estrutura.

</details>

**16. Quando não vale a pena usar useMemo?**
<sub>Aula [06 — Performance: memo, useMemo, useCallback, React Compiler e além](../aulas/06-performance.md)</sub>
<details><summary>Ver resposta</summary>

Em cálculos baratos, como somar poucos números ou montar uma string: o custo de guardar em memória e comparar dependências pode ser maior que o do cálculo. Vale para cálculo realmente caro, para referência estável passada a um filho com memo e para dependência de efeito.

</details>

**17. Por que usar TanStack Query em vez de useEffect com fetch?**
<sub>Aula [07 — Estado global, dados do servidor e formulários](../aulas/07-estado-global-dados-e-formularios.md)</sub>
<details><summary>Ver resposta</summary>

Porque dado de servidor é cache, e com useEffect eu teria que reimplementar loading, erro, cache, deduplicação, revalidação quando o dado fica velho, retry, paginação e invalidação depois de uma alteração. O TanStack Query entrega tudo isso com queryKey, stale-while-revalidate e mutations com invalidação.

</details>

**18. Por que colocar filtros e paginação na URL?**
<sub>Aula [07 — Estado global, dados do servidor e formulários](../aulas/07-estado-global-dados-e-formularios.md)</sub>
<details><summary>Ver resposta</summary>

Porque assim o link pode ser compartilhado com o mesmo filtro, o voltar e avançar do navegador funcionam e o estado sobrevive ao recarregar a página. É estado que pertence à navegação, não à memória do componente.

</details>

**19. Context, Zustand ou Redux?**
<sub>Aula [07 — Estado global, dados do servidor e formulários](../aulas/07-estado-global-dados-e-formularios.md)</sub>
<details><summary>Ver resposta</summary>

Context para dado global que muda pouco (tema, idioma, usuário). Zustand quando o estado global muda com frequência e preciso de seletores para re-renderizar só quem usa a parte que mudou, com pouco código. Redux Toolkit quando o estado de cliente é grande e complexo e o time se beneficia do padrão de ações e reducers e das DevTools.

</details>

**20. Qual a diferença entre useTransition e debounce?**
<sub>Aula [08 — React concorrente, Suspense e o React 19](../aulas/08-react-concorrente-e-react-19.md)</sub>
<details><summary>Ver resposta</summary>

Debounce espera um tempo fixo antes de atualizar, atrasando até em máquinas rápidas. useTransition começa a atualização na hora, mas com prioridade baixa: se algo urgente como uma nova tecla aparecer, o React interrompe e recomeça. A digitação fica instantânea e o resultado aparece assim que possível.

</details>

**21. O que são Actions no React 19?**
<sub>Aula [08 — React concorrente, Suspense e o React 19](../aulas/08-react-concorrente-e-react-19.md)</sub>
<details><summary>Ver resposta</summary>

Funções assíncronas usadas em transições, principalmente em formulários com form action. O React gerencia o estado pendente, os erros e a atualização otimista: useActionState guarda o resultado e o pendente, useFormStatus informa um filho que o form está enviando e useOptimistic mostra o resultado antes da confirmação.

</details>

**22. O que é um Error Boundary?**
<sub>Aula [08 — React concorrente, Suspense e o React 19](../aulas/08-react-concorrente-e-react-19.md)</sub>
<details><summary>Ver resposta</summary>

Um componente que captura erros de renderização na sua subárvore e mostra uma interface alternativa, em vez de derrubar a aplicação inteira. É o par do Suspense para erros; ainda é escrito como classe ou com a biblioteca react-error-boundary, e costuma ser colocado por região da tela.

</details>

**23. Por que usar getByRole em vez de getByTestId?**
<sub>Aula [09 — Testes e acessibilidade em React](../aulas/09-testes-e-acessibilidade.md)</sub>
<details><summary>Ver resposta</summary>

Porque getByRole encontra o elemento pelo papel e nome acessível, do jeito que o usuário e o leitor de tela o percebem, e ainda verifica acessibilidade de graça. getByTestId depende de um atributo que não tem significado para o usuário e deve ser o último recurso.

</details>

**24. Por que usar <button> em vez de <div onClick>?**
<sub>Aula [09 — Testes e acessibilidade em React](../aulas/09-testes-e-acessibilidade.md)</sub>
<details><summary>Ver resposta</summary>

Porque o button já vem com foco pelo teclado, ativação com Enter e Espaço e papel de botão para leitores de tela. A div com onClick não tem nada disso e exigiria recriar tudo manualmente com tabIndex, eventos de teclado e ARIA.

</details>

**25. Por que organizar o projeto por funcionalidade e não por tipo técnico?**
<sub>Aula [10 — Arquitetura de front-end com React](../aulas/10-arquitetura-de-front.md)</sub>
<details><summary>Ver resposta</summary>

Porque o que muda junto fica junto (colocation): componentes, hooks, chamadas de API e schemas de uma feature ficam na mesma pasta, e cada feature expõe uma API pública. Pastas por tipo técnico viram listas enormes e espalham uma mudança por vários lugares.

</details>

**26. Por que ter uma camada de API em vez de chamar fetch nos componentes?**
<sub>Aula [10 — Arquitetura de front-end com React](../aulas/10-arquitetura-de-front.md)</sub>
<details><summary>Ver resposta</summary>

Para concentrar URLs, headers, tratamento de erro e conversão de dados num lugar só. Mudar um endpoint ou trocar REST por GraphQL mexe em um arquivo, os testes simulam a camada certa e os componentes ficam só com a UI. Validar a resposta com Zod na borda evita que uma mudança do backend quebre a tela silenciosamente.

</details>

**27. Para que serve uma union discriminada em TypeScript no front?**
<sub>Aula [10 — Arquitetura de front-end com React](../aulas/10-arquitetura-de-front.md)</sub>
<details><summary>Ver resposta</summary>

Para modelar estados que não podem se misturar, como carregando, erro com mensagem e sucesso com dados. O TypeScript obriga a tratar cada caso e impede combinações inválidas, como sucesso sem dados ou erro sem mensagem.

</details>
