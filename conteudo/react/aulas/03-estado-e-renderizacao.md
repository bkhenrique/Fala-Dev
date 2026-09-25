# Aula 03 — Estado e quando o React re-renderiza

> **Objetivo:** entender o que é estado, como o `useState` funciona (estado como "foto" de cada render, atualização com função, batching), por que atualizar de forma imutável, o que dispara um re-render e como decidir onde o estado mora (derivado, elevado, local).

---

## 1. O problema

Uma variável comum dentro de um componente **não serve** pra guardar dado que muda na tela:

```jsx
function Contador() {
  let total = 0;
  return <button onClick={() => total++}>{total}</button>;   // nunca atualiza
}
```

Dois motivos: mudar a variável **não avisa** o React pra renderizar de novo, e a cada render a função roda do zero e `total` volta a ser `0`. É pra isso que existe o **estado**.

---

## 2. useState

```jsx
const [total, setTotal] = useState(0);
```

- **`total`**: o valor do estado **neste render**.
- **`setTotal`**: a função que **agenda** uma atualização e pede um novo render.
- O React **guarda** o estado fora da função do componente, associado à posição do componente na árvore, e o devolve a cada render.

### Estado é uma foto de cada render
```jsx
function Contador() {
  const [total, setTotal] = useState(0);

  function somarTres() {
    setTotal(total + 1);
    setTotal(total + 1);
    setTotal(total + 1);
  }
  // clicar soma 1, não 3!
}
```
Dentro desse render, `total` vale `0` o tempo todo. As três chamadas pedem "mude pra 1". O estado não muda "na hora"; ele muda **no próximo render**.

Quando o novo valor depende do anterior, use a **forma com função** (*updater*):
```jsx
setTotal((anterior) => anterior + 1);   // cada chamada recebe o valor mais recente
```

A mesma ideia explica o **closure desatualizado** (*stale closure*): um `setTimeout` ou um efeito criado num render "enxerga" o estado **daquele** render. Se ele precisa do valor mais novo, use o updater ou um ref (aula 05).

---

## 3. Batching

O React **agrupa** várias atualizações de estado que acontecem juntas e faz **um único render** no final. Desde o React 18, isso vale também dentro de `setTimeout`, promises e eventos nativos (**automatic batching**). Resultado: menos renders e nenhum estado "pela metade" na tela.

---

## 4. Imutabilidade

O React decide se o estado mudou comparando **a referência** (com `Object.is`). Se você **mutar** um objeto ou array, a referência continua a mesma e o React **não re-renderiza** (ou renderiza com dado inconsistente).

```jsx
// ❌ muta: mesma referência
itens.push(novo);
setItens(itens);

// ✅ cria novo array/objeto
setItens([...itens, novo]);
setItens(itens.filter((i) => i.id !== id));
setItens(itens.map((i) => (i.id === id ? { ...i, feito: true } : i)));
setUsuario({ ...usuario, endereco: { ...usuario.endereco, cidade: "Recife" } });
```

Por que o React escolheu isso: comparar referências é **barato** (O(1)); comparar objetos profundamente seria caro. A imutabilidade também é o que permite otimizações como `memo` (aula 06). Para objetos muito aninhados, bibliotecas como **Immer** deixam escrever como se fosse mutação, gerando cópias por baixo.

---

## 5. O que dispara um re-render

Um componente renderiza de novo quando:
1. O **estado dele** muda.
2. O **pai re-renderiza**: por padrão, **todos os filhos** renderizam de novo, mesmo que as props não tenham mudado.
3. Um **contexto** que ele consome muda (aula 05).

Ponto que muita gente erra: **mudança de props sozinha não é gatilho**; o gatilho é o pai renderizar. E re-render **não é necessariamente caro**: renderizar é chamar a função; o DOM só é alterado se o resultado mudar. Só vale otimizar quando **medir** que um render é caro (aula 06).

---

## 6. Onde o estado deve morar

### Estado mínimo e estado derivado
Guarde o **mínimo** e **calcule** o resto durante o render:
```jsx
// ❌ estado duplicado, pode dessincronizar
const [itens, setItens] = useState([]);
const [total, setTotal] = useState(0);

// ✅ derivado
const total = itens.reduce((soma, i) => soma + i.preco, 0);
```
Se um valor pode ser calculado a partir de props ou de outro estado, **não é estado**. Isso elimina uma classe inteira de bugs (e de `useEffect` desnecessários, aula 04).

### Elevar o estado (lifting state up)
Quando **dois irmãos** precisam do mesmo dado, o estado sobe para o **ancestral comum** mais próximo, que passa o valor e os callbacks por props. Uma **única fonte da verdade**.

### Local, perto de quem usa
O contrário também vale: estado que só um componente usa fica **nele**. Estado alto demais na árvore faz a árvore toda re-renderizar a cada mudança.

### Tipos de estado (ver aula 07)
- **Estado de UI local**: modal aberto, aba ativa, texto do input → `useState`.
- **Estado de servidor**: dados vindos da API → cache de dados (TanStack Query) ou Server Components.
- **Estado da URL**: filtros, paginação, busca → query string (compartilhável e sobrevive ao F5).
- **Estado global de cliente**: usuário logado, tema, carrinho → Context ou store (Zustand, Redux).

---

## 7. Formulários: controlado × não controlado

- **Controlado**: o valor do input vem do estado (`value={nome}` + `onChange`). O React é a fonte da verdade; fácil validar e reagir a cada tecla.
- **Não controlado**: o DOM guarda o valor; você lê quando precisa (`ref` ou `FormData` no submit). Menos renders, bom pra formulários grandes.

Bibliotecas como **React Hook Form** usam o modelo não controlado por baixo por performance (aula 07).

---

## 8. Como falar na entrevista

**"Por que o setState não atualiza o valor na hora?"**
> "Porque o estado é uma foto de cada render: dentro de um render, a variável tem sempre o mesmo valor. O set agenda uma atualização e o novo valor só aparece no próximo render. E o React ainda agrupa várias atualizações num render só, o batching. Se o próximo valor depende do anterior, uso a forma com função, setTotal(anterior => anterior + 1), que sempre recebe o valor mais recente."

**"Por que o estado tem que ser imutável?"**
> "Porque o React decide se algo mudou comparando referências, que é barato. Se eu faço push num array e passo o mesmo array, a referência não muda e o React pode não re-renderizar. Então crio um novo array ou objeto com spread, map ou filter. Isso também é o que permite otimizações como memo."

---

## 9. Resumo

- Variável comum não serve: não avisa o React e zera a cada render. **Estado** resolve.
- **`useState`**: valor do render atual + setter que **agenda** atualização.
- Estado é uma **foto** por render; use **updater** (`prev => ...`) quando depende do anterior; cuidado com **stale closure**.
- **Automatic batching** (React 18+): várias atualizações, um render.
- **Imutabilidade**: React compara **referência**; crie novos objetos e arrays (spread, map, filter, Immer).
- Re-render: **estado próprio, pai renderizou, contexto mudou**. Props sozinhas não são gatilho. Re-render ≠ mexer no DOM.
- **Estado mínimo**, o resto **derivado**; **elevar** pro ancestral comum; manter **local** quando possível.
- Controlado × não controlado.

## Termos desta aula
estado · useState · setter · re-render · foto do render · updater function · stale closure · batching · automatic batching · imutabilidade · referência · Object.is · spread · Immer · estado derivado · estado mínimo · lifting state up · fonte única da verdade · estado de UI · estado de servidor · estado da URL · estado global · input controlado · input não controlado

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 03** e separadas por nível.
