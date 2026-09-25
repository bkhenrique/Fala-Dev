# Aula 06 — Performance: memo, useMemo, useCallback, React Compiler e além

> **Objetivo:** saber quando um app React fica lento, como medir, e usar as ferramentas certas: `memo`, `useMemo`, `useCallback`, o React Compiler, virtualização de listas, code splitting e cuidados com estado e contexto.

---

## 1. O problema

Por padrão, quando um componente re-renderiza, **todos os filhos** re-renderizam também (aula 03). Na maioria das vezes isso é barato e não importa. Mas às vezes:
- uma lista de 5.000 linhas renderiza inteira a cada tecla digitada num campo de busca;
- um gráfico pesado recalcula tudo porque o pai mudou um detalhe irrelevante;
- um contexto com o usuário logado muda e a aplicação inteira re-renderiza.

Performance em React é principalmente: **evitar trabalho desnecessário** e **não bloquear a thread principal** do navegador (o que piora o INP, a métrica de resposta à interação).

**Regra número 1: meça antes de otimizar.** Memoização tem custo de memória e de complexidade; espalhar `useMemo` por tudo "por garantia" costuma não ajudar em nada.

---

## 2. Medindo

- **React DevTools → Profiler**: grava uma interação e mostra quais componentes renderizaram, **quanto tempo** cada um levou e **por quê** (qual prop, estado ou contexto mudou).
- Opção "Highlight updates" do DevTools: pisca os componentes que re-renderizam.
- **Performance** do navegador e métricas reais (Web Vitals, INP).
- Faça a medição com o **build de produção**: o modo desenvolvimento é bem mais lento (e o StrictMode renderiza duas vezes).

---

## 3. memo: pular o render se as props não mudaram

```jsx
const LinhaProduto = memo(function LinhaProduto({ produto, aoSelecionar }) {
  return <li onClick={() => aoSelecionar(produto.id)}>{produto.nome}</li>;
});
```

`memo` faz o componente **pular o re-render** quando o pai renderiza mas as **props são as mesmas**, comparadas **raso** (uma por uma, por referência, com `Object.is`).

O detalhe que quebra o `memo` na prática: objetos, arrays e **funções criados no render do pai** são **novos a cada render**. Então `aoSelecionar={(id) => ...}` faz o `memo` nunca funcionar. É aí que entram `useCallback` e `useMemo`.

---

## 4. useMemo e useCallback

```jsx
const filtrados = useMemo(
  () => produtos.filter((p) => p.nome.includes(busca)),   // cálculo caro
  [produtos, busca],
);

const selecionar = useCallback((id) => setSelecionado(id), []);   // mesma função entre renders
```

- **`useMemo(fn, deps)`**: guarda o **resultado** de um cálculo e só refaz quando as dependências mudam.
- **`useCallback(fn, deps)`**: guarda a **própria função** (é um `useMemo` que retorna a função).

Quando fazem sentido:
1. **Cálculo realmente caro** (filtrar/ordenar milhares de itens, transformação pesada).
2. Manter a **mesma referência** pra passar a um filho com **`memo`**.
3. Manter a mesma referência de algo usado como **dependência de um efeito**.

Quando não: cálculos baratos (somar alguns números, montar uma string). O custo de comparar dependências e guardar em memória pode ser maior que o do cálculo.

---

## 5. React Compiler

O **React Compiler** (estável desde 2025) analisa seus componentes **no build** e aplica **memoização automática**, sem você escrever `memo`, `useMemo` e `useCallback`. Ele consegue isso porque os componentes seguem as **regras do React** (pureza, imutabilidade, regras dos hooks).

Consequências:
- Em projetos com o compiler, boa parte da memoização manual se torna **desnecessária**.
- Código que **quebra as regras** (muta props ou estado, lê ref durante o render) não é otimizado, ou pode se comportar diferente. Mais um motivo pra escrever componentes puros.

Em entrevista, vale citar: "hoje dá pra usar o React Compiler e deixar a memoização por conta dele, mas entendo o que `memo`, `useMemo` e `useCallback` fazem porque muito código ainda usa".

---

## 6. Estrutura antes de memoização

Muitas vezes o melhor ganho vem de **mudar a estrutura**, sem memoizar nada:

- **Descer o estado**: se só o campo de busca muda a cada tecla, deixe esse estado **dentro** de um componente pequeno de busca, em vez de no topo da página.
- **Passar como `children`**: um componente que muda muito pode receber a parte pesada como `children`. Como o `children` foi criado pelo **avô**, ele não re-renderiza quando o componente do meio muda.
- **Dividir contextos** e memoizar o `value` (aula 05); pra estado global muito dinâmico, uma store com **seletores** (Zustand, Redux) re-renderiza só quem usa a parte que mudou.
- **Keys estáveis** em listas (aula 02), senão o React recria elementos à toa.

---

## 7. Listas enormes: virtualização

Renderizar 10.000 linhas cria 10.000 nós no DOM, mesmo que só 20 caibam na tela. **Virtualização** (*windowing*) renderiza **só os itens visíveis** (e alguns de margem), trocando o conteúdo conforme a rolagem.

Bibliotecas: **TanStack Virtual**, react-window. Alternativa simples: **paginação** ou "carregar mais".

---

## 8. Código: carregar menos JavaScript

- **Code splitting** com `lazy` + `Suspense`: carregar um componente pesado (editor, gráfico, modal raro) **só quando for usado**.
```jsx
const Editor = lazy(() => import("./Editor"));
<Suspense fallback={<Carregando />}><Editor /></Suspense>
```
- Frameworks já dividem o código **por rota**.
- Analisar o bundle (bundle analyzer) e trocar bibliotecas pesadas por alternativas menores.
- **Server Components** (no Next) não mandam JavaScript pro cliente (ver a [trilha de Next.js](../../nextjs/aulas/05-server-e-client-components.md)).

---

## 9. Manter a interface responsiva

Uma atualização cara (filtrar uma lista enorme) **trava a digitação** se for feita com a mesma urgência. O React concorrente permite marcar atualizações como **não urgentes** com `useTransition` e `useDeferredValue`, assim a tecla digitada aparece na hora e a lista atualiza logo depois (aula 08). Debounce (aula 05) também ajuda quando cada tecla dispara uma busca na API.

---

## 10. Como falar na entrevista

**"Como você otimiza a performance de um componente React?"**
> "Primeiro meço com o Profiler do React DevTools, no build de produção, pra saber o que renderiza e por quê. Muitas vezes resolvo com estrutura: descer o estado pra perto de quem usa, passar a parte pesada como children, dividir contextos. Se um componente caro re-renderiza sem motivo, uso memo, e aí preciso estabilizar as props com useCallback e useMemo, porque funções e objetos criados no render são novos a cada vez. Pra listas enormes, virtualização; pra bundle, lazy e Suspense. E hoje o React Compiler já faz a memoização automaticamente em código que segue as regras do React."

**"useMemo ou useCallback?"**
> "Os dois memoizam com base em dependências. useMemo guarda o resultado de um cálculo, útil quando o cálculo é caro ou quando preciso da mesma referência de objeto. useCallback guarda a própria função, útil pra passar a um filho com memo ou usar como dependência de efeito. Não uso por padrão em tudo, porque em cálculos baratos o custo da memoização não compensa."

---

## 11. Resumo

- Filhos re-renderizam com o pai; normalmente barato. **Meça antes** (Profiler, build de produção).
- **`memo`**: pula render se props iguais (comparação rasa); quebra com objetos/funções novos.
- **`useMemo`** (resultado) e **`useCallback`** (função): cálculo caro, referência estável pra `memo` ou efeito.
- **React Compiler**: memoização automática no build pra código que segue as regras.
- Estrutura antes de memoização: **descer estado**, **children**, dividir contexto, store com seletores.
- **Virtualização** pra listas enormes; **`lazy` + `Suspense`** pra code splitting.
- **`useTransition`/`useDeferredValue`** e debounce pra manter a UI responsiva.

## Termos desta aula
performance · re-render · thread principal · INP · Profiler · React DevTools · memo · comparação rasa · referência · useMemo · useCallback · memoização · React Compiler · descer o estado · children · seletor · store · virtualização · windowing · TanStack Virtual · code splitting · lazy · Suspense · bundle · useTransition · useDeferredValue · debounce

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 06** e separadas por nível.
