# Aula 05 — Hooks: regras, useRef, useReducer, useContext e custom hooks

> **Objetivo:** entender o que são hooks e por que existem as regras dos hooks, e dominar os principais além do `useState`/`useEffect`: `useRef`, `useReducer`, `useContext`, além de criar **custom hooks** pra reaproveitar lógica.

---

## 1. O problema

Antes dos hooks (React 16.8, 2019), estado e ciclo de vida só existiam em **componentes de classe**. Reaproveitar lógica com estado entre componentes exigia padrões verbosos (**HOCs** e **render props**) que criavam árvores enormes de componentes "embrulhando" outros (*wrapper hell*), e a lógica de um mesmo assunto ficava espalhada por `componentDidMount`, `componentDidUpdate` e `componentWillUnmount`.

**Hooks** são funções que permitem a componentes de função **usar recursos do React** (estado, efeitos, contexto, refs) e, principalmente, **extrair e reaproveitar lógica com estado** em funções comuns.

---

## 2. As regras dos hooks

1. Chame hooks **só no nível superior** do componente: nunca dentro de `if`, loop, função aninhada ou depois de um `return` antecipado.
2. Chame hooks **só em componentes React ou em custom hooks**, não em funções comuns.

**Por quê?** O React não sabe o "nome" de cada `useState`. Ele guarda os estados de um componente numa **lista, em ordem de chamada**. No primeiro render, o 1º `useState` é o nome, o 2º é o e-mail. Se um `if` pular uma chamada no render seguinte, a ordem desloca e o e-mail passa a receber o valor do nome. A regra garante que a **ordem das chamadas é a mesma em todo render**.

O plugin `eslint-plugin-react-hooks` verifica as duas regras (e as dependências dos efeitos).

---

## 3. useRef: valor que persiste sem re-renderizar

```jsx
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();          // acesso ao elemento do DOM

const intervaloRef = useRef(null);
intervaloRef.current = setInterval(...);   // guardar um valor "de bastidor"
```

- `useRef` devolve um objeto `{ current }` que **persiste entre renders**.
- Mudar `ref.current` **não causa re-render**.
- Usos: acessar **elementos do DOM** (foco, rolagem, medir, integrar biblioteca), guardar **ids de timer**, valor anterior, instância de biblioteca, o valor "mais recente" de algo pra ler dentro de callbacks.
- Não leia nem escreva `ref.current` **durante o render** (quebra a pureza). Use em handlers e efeitos.

| | `useState` | `useRef` |
|---|---|---|
| Mudar causa re-render? | Sim | Não |
| Valor aparece na tela? | Sim | Não deveria |
| Uso | Dado que a UI mostra | Dado de bastidor, acesso ao DOM |

No React 19, componentes de função recebem **`ref` como prop comum**, e o antigo `forwardRef` deixa de ser necessário.

---

## 4. useReducer: estado com regras

Quando o estado tem **várias partes que mudam juntas** ou **muitas formas de mudar**, espalhar vários `useState` e lógica pelos handlers fica confuso. O `useReducer` centraliza:

```jsx
function carrinhoReducer(estado, acao) {
  switch (acao.tipo) {
    case "adicionar":
      return { ...estado, itens: [...estado.itens, acao.item] };
    case "remover":
      return { ...estado, itens: estado.itens.filter((i) => i.id !== acao.id) };
    case "limpar":
      return { ...estado, itens: [] };
    default:
      throw new Error(`ação desconhecida: ${acao.tipo}`);
  }
}

const [carrinho, dispatch] = useReducer(carrinhoReducer, { itens: [] });
dispatch({ tipo: "adicionar", item });
```

- **Reducer**: função **pura** `(estado, ação) → novo estado`. Mesmo padrão do Redux.
- O componente diz **o que aconteceu** (`dispatch` de uma ação); o reducer decide **como o estado muda**.
- Fácil de **testar** (é uma função pura) e de ler todas as transições num lugar só.
- `useState` para estado simples; `useReducer` quando as transições têm regras.

---

## 5. useContext: evitar prop drilling

**Prop drilling** é passar uma prop por vários níveis que só a repassam. **Context** permite que qualquer componente dentro de um **Provider** leia um valor diretamente:

```jsx
const TemaContext = createContext("claro");

function App() {
  const [tema, setTema] = useState("claro");
  return (
    <TemaContext value={tema}>          {/* no React 19; antes: <TemaContext.Provider value={tema}> */}
      <Pagina />
    </TemaContext>
  );
}

function Botao() {
  const tema = useContext(TemaContext);   // lê direto, sem props no meio
  return <button className={tema}>OK</button>;
}
```

Bons usos: tema, idioma, usuário autenticado, configurações: dados **globais** que mudam **pouco**.

### O custo do Context
Quando o `value` do Provider muda, **todos os componentes que consomem** aquele contexto re-renderizam. Cuidados:
- Não coloque num único contexto coisas que mudam muito (ex.: posição do mouse) junto com coisas estáveis.
- **Divida** em contextos menores (um pro valor, outro pras funções de atualização).
- Se o `value` é um objeto criado no render (`value={{ usuario, sair }}`), ele é novo a cada render do Provider: **memoize** com `useMemo`.
- Context **não é** uma ferramenta de gerenciamento de estado com seletores: pra estado global que muda muito, prefira uma store (Zustand, Redux) que permite assinar só uma parte (aula 07).

---

## 6. Custom hooks: reaproveitar lógica

Um **custom hook** é uma função que começa com **`use`** e chama outros hooks. Serve pra extrair e reaproveitar **lógica com estado** (não o estado em si: cada componente que usa o hook tem **sua própria cópia**).

```jsx
function useDebounce(valor, atraso = 300) {
  const [debounced, setDebounced] = useState(valor);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(valor), atraso);
    return () => clearTimeout(id);
  }, [valor, atraso]);
  return debounced;
}

function Busca() {
  const [texto, setTexto] = useState("");
  const termo = useDebounce(texto);            // só muda 300 ms depois de parar de digitar
  const { data } = useProdutos(termo);         // outro custom hook, que busca dados
  ...
}
```

Benefícios:
- Componentes ficam **curtos e declarativos** ("o que", não "como").
- Lógica **testável** isoladamente.
- Substitui os antigos HOCs e render props na maioria dos casos.

Exemplos comuns: `useDebounce`, `useLocalStorage`, `useMediaQuery`, `useOnlineStatus`, hooks de dados (`useProdutos`), hooks de formulário.

---

## 7. Outros hooks que vale conhecer

- **`useMemo` / `useCallback`**: memoização (aula 06).
- **`useId`**: gera ids únicos e estáveis, inclusive entre servidor e cliente (ligar `label` a `input` sem hydration mismatch).
- **`useTransition` / `useDeferredValue`**: atualizações não urgentes (aula 08).
- **`useSyncExternalStore`**: assinar uma **store externa** (localStorage, store própria) de forma segura com renderização concorrente.
- **`use`** (React 19): ler uma Promise ou um contexto, inclusive dentro de condicionais (aula 08).
- **`useActionState`, `useFormStatus`, `useOptimistic`** (React 19): formulários e ações (aula 08).

---

## 8. Como falar na entrevista

**"Por que hooks não podem ficar dentro de um if?"**
> "Porque o React não identifica os hooks pelo nome, e sim pela ordem de chamada: ele guarda o estado de cada componente numa lista na ordem em que os hooks são chamados. Se um if pular um hook num render, a ordem desloca e um estado recebe o valor de outro. Por isso hooks só no nível superior e só em componentes ou custom hooks; o plugin de lint do React verifica isso."

**"useState ou useRef? E quando usar Context?"**
> "useState pra dado que a tela mostra: mudar causa re-render. useRef pra valor de bastidor que persiste entre renders sem re-renderizar, como um id de timer, ou pra acessar o DOM. Context pra dado global que muda pouco, tipo tema e usuário logado, evitando prop drilling; mas quando o valor muda, todos os consumidores re-renderizam, então divido contextos e memoizo o value, e pra estado global que muda muito prefiro uma store com seletores."

---

## 9. Resumo

- **Hooks**: recursos do React em componentes de função + **reaproveitar lógica com estado**; substituíram classes, HOCs e render props.
- **Regras**: só no nível superior e só em componentes/custom hooks, porque o React usa a **ordem de chamada**.
- **`useRef`**: persiste sem re-render; DOM, timers, valor mais recente; não usar no render. React 19: `ref` como prop.
- **`useReducer`**: `(estado, ação) → novo estado`, puro e testável; pra transições com regras.
- **`useContext`**: evita prop drilling; todos os consumidores re-renderizam quando o value muda → dividir e memoizar; não é store com seletores.
- **Custom hooks** (`use...`): lógica reaproveitável; cada uso tem seu próprio estado.
- Outros: `useId`, `useSyncExternalStore`, `use`, hooks de ação do React 19.

## Termos desta aula
hooks · componente de classe · HOC · render props · wrapper hell · regras dos hooks · ordem de chamada · eslint-plugin-react-hooks · useRef · ref.current · forwardRef · useReducer · reducer · ação · dispatch · função pura · Redux · useContext · Context · Provider · prop drilling · custom hook · useDebounce · useId · useSyncExternalStore · use

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 05** e separadas por nível.
