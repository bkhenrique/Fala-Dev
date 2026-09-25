# React — glossário

Cada termo tem três partes: **Em uma frase** (a definição curta), **Traduzindo** (a explicação simples) e **Como falar** (uma frase pronta pra treinar em voz alta). Alguns trazem também **Não confundir com** ou **Cuidado**.

É material de revisão: a explicação completa está nas [aulas](README.md).

---

### Declarativo
- **Em uma frase:** você descreve como a interface deve ficar para cada estado, e o React descobre como atualizar o DOM.
- **Traduzindo:** você dá o endereço, o GPS acha o caminho.
- **Como falar:** "O React é declarativo: UI é função do estado. Eu mudo o estado, e ele cuida de aplicar as mudanças no DOM."

### Virtual DOM e reconciliação
- **Em uma frase:** a árvore de elementos em JavaScript que o React gera a cada render e compara com a anterior pra aplicar no DOM só as diferenças.
- **Traduzindo:** um rascunho barato que é comparado com a versão anterior antes de mexer na tela de verdade.
- **Como falar:** "Na reconciliação, tipo diferente recria a subárvore, e em listas o React usa a key pra saber qual item é qual."

### Key
- **Em uma frase:** identidade estável de cada item de uma lista, usada na reconciliação.
- **Traduzindo:** o RG de cada item, pra o React não confundir um com outro.
- **Como falar:** "Uso o id do dado como key; o índice quebra quando insiro ou reordeno, e o estado vai parar na linha errada."

### Props
- **Em uma frase:** os dados que um componente recebe do pai, somente leitura.
- **Traduzindo:** os argumentos da função do componente.
- **Como falar:** "Dados descem por props e eventos sobem por callbacks: é o fluxo unidirecional."

### Estado (useState)
- **Em uma frase:** dado que pertence a um componente, persiste entre renders e, ao mudar, dispara um novo render.
- **Traduzindo:** a memória do componente.
- **Como falar:** "O estado é uma foto de cada render; quando o próximo valor depende do anterior, uso a forma com função."
- **Cuidado:** atualize de forma imutável: o React compara referências.

### useEffect
- **Em uma frase:** hook pra sincronizar o componente com um sistema externo, rodando depois do commit, com dependências e cleanup.
- **Traduzindo:** o lugar de conectar e desconectar coisas de fora do React.
- **Como falar:** "Uso efeito pra sincronizar com algo externo; valor derivado calculo no render e reação a clique vai no handler."

### useRef
- **Em uma frase:** hook que guarda um valor mutável que persiste entre renders sem causar re-render, ou referencia um elemento do DOM.
- **Traduzindo:** uma gaveta que o React não fica vigiando.
- **Como falar:** "useRef pra dado de bastidor, como id de timer, ou pra acessar o DOM; useState pro que aparece na tela."

### Context
- **Em uma frase:** mecanismo pra passar um valor a toda uma subárvore sem prop drilling.
- **Traduzindo:** um canal global dentro de uma parte da árvore.
- **Como falar:** "Uso Context pra dado global que muda pouco; quando o value muda, todos os consumidores re-renderizam."

### Custom hook
- **Em uma frase:** função que começa com `use` e combina outros hooks pra reaproveitar lógica com estado.
- **Traduzindo:** a lógica do componente extraída pra uma função reutilizável.
- **Como falar:** "Extraio lógica para custom hooks como usePedidos e useDebounce; cada componente que usa tem seu próprio estado."

### memo, useMemo e useCallback
- **Em uma frase:** ferramentas de memoização: pular o render quando as props não mudaram, guardar o resultado de um cálculo e guardar a referência de uma função.
- **Traduzindo:** lembrar o que já foi feito pra não refazer à toa.
- **Como falar:** "Meço antes de memoizar; hoje o React Compiler faz boa parte disso automaticamente."

### Renderização concorrente
- **Em uma frase:** a capacidade do React de interromper, priorizar e retomar renderizações, usada com useTransition e useDeferredValue.
- **Traduzindo:** o que é urgente, como digitar, passa na frente do que pode esperar.
- **Como falar:** "Marco a atualização pesada como transição, e a digitação continua instantânea."

### Suspense
- **Em uma frase:** componente que mostra um fallback enquanto uma parte da árvore espera código ou dados.
- **Traduzindo:** o "carregando…" declarativo, por região da tela.
- **Como falar:** "Com Suspense cada parte da tela tem seu skeleton, e no servidor ele habilita streaming."

### Actions (React 19)
- **Em uma frase:** funções assíncronas em transições, integradas a formulários, com estado pendente, erro e atualização otimista gerenciados pelo React.
- **Traduzindo:** o envio de formulário com o React cuidando do "enviando…".
- **Como falar:** "Uso form com action, useActionState pro resultado e useOptimistic pra mostrar a mudança antes de o servidor confirmar."

### TanStack Query
- **Em uma frase:** biblioteca que trata dados do servidor como cache, com deduplicação, revalidação, retry e invalidação após mutations.
- **Traduzindo:** o gerente dos dados que vêm da API.
- **Como falar:** "Dado de servidor não é estado da aplicação, é cache; por isso uso TanStack Query em vez de useEffect com fetch."
