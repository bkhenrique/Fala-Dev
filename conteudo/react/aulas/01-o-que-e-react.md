# Aula 01 — O que é o React e o modelo mental dele

> **Objetivo:** explicar o que é o React, por que ele existe, o que significa ser declarativo, o que são componentes e JSX, e como funcionam Virtual DOM, reconciliação e as fases de render e commit.

---

## 1. O problema

Antes das bibliotecas de componentes, a gente atualizava a tela **na mão**: buscava elementos (`document.querySelector`), mudava texto, adicionava classe, removia item da lista. Com uma interface pequena funciona. Com uma interface grande, vira um emaranhado:

- O **estado** (dados) e a **tela** ficam dessincronizados: o contador diz 3, mas a lista mostra 2 itens.
- Cada mudança precisa lembrar **todos os lugares** da tela que dependem dela.
- Código difícil de reaproveitar e de testar.

Esse jeito se chama **imperativo**: você diz **como** mudar a tela, passo a passo.

---

## 2. A ideia do React: UI = f(estado)

O **React** (criado no Facebook, hoje Meta, em 2013) é uma **biblioteca** pra construir interfaces a partir de **componentes**. A ideia central:

> A interface é uma **função do estado**. Você descreve **como a tela deve ficar** para um estado, e o React se encarrega de atualizar o DOM quando o estado muda.

Isso é programação **declarativa**: você declara **o quê**, não o **como**.

```jsx
function Contador() {
  const [total, setTotal] = useState(0);
  return <button onClick={() => setTotal(total + 1)}>Cliques: {total}</button>;
}
```

Você nunca escreve "mude o texto do botão". Você muda o **estado** (`setTotal`) e o React redesenha o que for preciso.

> Analogia: no modo imperativo você dá as direções pro motorista ("vire à esquerda, siga 200 m…"). No declarativo você diz o **endereço** e o GPS descobre o caminho.

### Biblioteca, não framework
O React cuida da **camada de UI**. Roteamento, busca de dados, build e renderização no servidor vêm de outras bibliotecas ou de um **framework** em cima dele (Next.js, React Router em modo framework, Expo para mobile).

---

## 3. Componentes

Um **componente** é uma **função** que recebe dados (**props**) e retorna **o que deve aparecer na tela**.

```jsx
function Saudacao({ nome }) {
  return <h1>Olá, {nome}!</h1>;
}

function App() {
  return (
    <main>
      <Saudacao nome="Ana" />
      <Saudacao nome="Bruno" />
    </main>
  );
}
```

- A interface vira uma **árvore de componentes**, cada um cuidando de um pedaço.
- Componentes são **reutilizáveis** e **compostos** uns dentro dos outros.
- O nome começa com letra maiúscula (é assim que o JSX diferencia componente de tag HTML).
- Hoje se usa **componentes de função** com **hooks**. Componentes de classe ainda existem em código antigo.

---

## 4. JSX

**JSX** é uma extensão de sintaxe que parece HTML dentro do JavaScript. Não é HTML: é **açúcar sintático** que o compilador (Babel, SWC, esbuild) transforma em chamadas de função:

```jsx
<button className="primario" onClick={salvar}>Salvar</button>
// vira algo como:
jsx("button", { className: "primario", onClick: salvar, children: "Salvar" })
```

O resultado é um **objeto** que descreve o elemento (tipo, props, filhos). É por isso que:
- se usa `className` em vez de `class` (é propriedade de objeto JavaScript);
- dá pra usar qualquer **expressão** entre `{}` (variável, chamada de função, ternário, `.map`);
- um componente precisa retornar **um** elemento raiz (ou um **Fragment**: `<>...</>`).

Segurança: textos colocados com `{}` são **escapados** automaticamente, o que protege contra **XSS**. A exceção é o `dangerouslySetInnerHTML`, que o nome já avisa.

---

## 5. Virtual DOM e reconciliação

Mexer no **DOM** real é caro (o navegador recalcula layout e pinta). O React evita isso assim:

1. Quando o estado muda, o React **chama os componentes de novo** e obtém uma nova **árvore de elementos** (objetos JavaScript, baratos). Isso costuma ser chamado de **Virtual DOM**.
2. Compara a árvore nova com a anterior. Essa comparação se chama **reconciliação** (o *diffing*).
3. Aplica no DOM real **só as diferenças**.

Pra comparar rápido (em O(n), e não num custo proibitivo), o React usa duas **heurísticas**:
- Se o **tipo** do elemento mudou (`<div>` virou `<section>`, ou `ComponenteA` virou `ComponenteB`), ele **descarta** a subárvore inteira e cria de novo (o estado daquela parte se perde).
- Em **listas**, ele usa a **`key`** pra saber qual item é qual entre um render e outro (aula 02).

### Render e commit
Dois momentos que vale separar:
- **Render**: o React **chama seus componentes** pra descobrir o que mudou. Deve ser **puro**: sem efeitos colaterais, só calcular o JSX a partir de props e estado.
- **Commit**: o React **aplica as mudanças no DOM**. Depois disso rodam os **efeitos** (`useEffect`).

"Renderizar" no React **não é** pintar a tela: é chamar a função do componente. Um componente pode renderizar sem que nada mude no DOM.

### Fiber (pra impressionar)
Desde o React 16, a reconciliação é feita pela arquitetura **Fiber**, que divide o trabalho em pedaços e consegue **pausar, priorizar e retomar** a renderização. É a base dos recursos **concorrentes** (aula 08): uma atualização urgente (digitar) pode passar na frente de uma menos urgente (filtrar uma lista enorme).

---

## 6. Componentes puros

Regra importante: um componente, dado as **mesmas props e estado**, deve retornar o **mesmo JSX**, sem alterar nada fora dele durante o render.

```jsx
let contador = 0;
function Errado() {
  contador++;                  // ❌ efeito colateral durante o render
  return <p>{contador}</p>;
}
```

Por que importa: o React pode renderizar um componente **mais de uma vez** (em desenvolvimento, o **StrictMode** faz isso de propósito pra revelar impurezas), pausar e descartar renders. Efeito colateral vai em **event handlers** ou em **efeitos** (aula 04).

---

## 7. Como falar na entrevista

**"O que é o React e o que é o Virtual DOM?"**
> "React é uma biblioteca declarativa pra construir interfaces com componentes: eu descrevo como a tela deve ficar pra cada estado, e o React cuida de atualizar o DOM. Quando o estado muda, ele chama os componentes de novo e gera uma nova árvore de elementos, que são objetos baratos, o chamado Virtual DOM. Aí compara com a árvore anterior, que é a reconciliação, e aplica no DOM só as diferenças. Pra essa comparação ser rápida, ele assume que tipos diferentes geram árvores diferentes e usa as keys pra identificar itens de lista. Separando as fases: no render ele chama os componentes, que devem ser puros; no commit aplica as mudanças e depois roda os efeitos."

---

## 8. Resumo

- Antes: atualização **imperativa** do DOM, estado e tela dessincronizados.
- React: **UI = f(estado)**, **declarativo**; é **biblioteca** (UI), frameworks vêm em cima.
- **Componente** = função que recebe props e retorna JSX; interface = árvore de componentes.
- **JSX** vira chamadas de função que geram objetos; `{}` escapa texto (proteção contra XSS).
- **Virtual DOM + reconciliação**: gerar árvore nova, comparar, aplicar só a diferença; tipo diferente recria; listas usam **key**.
- **Render** (chamar componentes, deve ser puro) × **commit** (aplicar no DOM, depois efeitos). **Fiber** permite pausar e priorizar.
- **Componentes puros**; StrictMode renderiza duas vezes em dev pra achar impurezas.

## Termos desta aula
React · biblioteca · framework · imperativo · declarativo · UI = f(estado) · componente · árvore de componentes · props · JSX · Fragment · escape · XSS · DOM · Virtual DOM · reconciliação · diffing · heurística · key · render · commit · Fiber · componente puro · efeito colateral · StrictMode

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 01** e separadas por nível.
