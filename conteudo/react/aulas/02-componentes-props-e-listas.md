# Aula 02 — Componentes, props, composição e listas com key

> **Objetivo:** entender como os componentes conversam (props descem, eventos sobem), por que props são somente leitura, como compor componentes com `children`, como renderizar condicionalmente, e por que a `key` das listas importa tanto.

---

## 1. O problema

Com a interface dividida em componentes, surge a pergunta: **como eles trocam informação?** Se cada componente acessar dados de qualquer lugar, voltamos à bagunça. O React responde com uma regra simples: **o fluxo de dados é de mão única**, de cima pra baixo.

---

## 2. Props: dados que descem

**Props** (propriedades) são os argumentos de um componente, passados pelo pai:

```jsx
function CartaoProduto({ nome, preco, emPromocao = false }) {
  return (
    <article>
      <h2>{nome}</h2>
      <p>{emPromocao ? "Promoção! " : ""}R$ {preco}</p>
    </article>
  );
}

<CartaoProduto nome="Teclado" preco={199} emPromocao />
```

- Props são **somente leitura**: o componente **não altera** as props que recebeu. Se algo precisa mudar, é **estado** (aula 03) de algum componente.
- Podem ser qualquer valor: texto, número, objeto, função, outro elemento JSX.
- **Valor padrão** com default da desestruturação (`emPromocao = false`).

### Eventos sobem por callbacks
Filho não muda o estado do pai diretamente. O pai passa uma **função** como prop, e o filho a chama:

```jsx
function Lista() {
  const [itens, setItens] = useState([]);
  return <FormularioItem aoAdicionar={(item) => setItens([...itens, item])} />;
}

function FormularioItem({ aoAdicionar }) {
  return <button onClick={() => aoAdicionar("novo")}>Adicionar</button>;
}
```

Resumo do fluxo: **dados descem via props, eventos sobem via callbacks**. Isso é o **fluxo de dados unidirecional** (*one-way data flow*): fica fácil saber de onde vem cada dado e quem pode mudá-lo.

---

## 3. Composição e `children`

O React prefere **composição** a herança: em vez de estender componentes, você **encaixa** uns nos outros.

A prop especial **`children`** é o conteúdo colocado entre as tags:

```jsx
function Card({ titulo, children }) {
  return (
    <section className="card">
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}

<Card titulo="Resumo do pedido">
  <ListaDeItens />
  <Total />
</Card>
```

O `Card` não precisa saber o que vai dentro dele. Isso cria componentes **genéricos e reutilizáveis** (layouts, modais, painéis).

Composição também é uma forma de evitar **prop drilling** (passar uma prop por vários níveis que não a usam): em vez de o componente do meio repassar dados, o componente de cima **monta** os filhos já com o que precisam e passa como `children`.

---

## 4. Renderização condicional

Como JSX é JavaScript, usa-se as ferramentas da linguagem:

```jsx
{carregando ? <Spinner /> : <Tabela dados={dados} />}   // ternário: um ou outro
{erro && <Alerta mensagem={erro} />}                       // && : mostra ou nada
if (!usuario) return <Login />;                            // retorno antecipado
```

Pegadinha do `&&`: `{itens.length && <Lista />}` mostra **`0`** na tela quando a lista está vazia, porque `0` é um valor renderizável. Use `{itens.length > 0 && <Lista />}`.

---

## 5. Listas e a `key`

```jsx
<ul>
  {tarefas.map((t) => (
    <li key={t.id}>{t.titulo}</li>
  ))}
</ul>
```

Na reconciliação (aula 01), o React precisa saber **qual item é qual** entre um render e outro. A **`key`** é essa identidade.

### Por que não usar o índice?
Com `key={indice}`, se você **insere um item no começo** ou **reordena**, os índices mudam: o React acha que o item 0 continua sendo o item 0 e **reaproveita o componente errado**. Consequências:
- **Estado trocado**: o input com texto digitado "passa" pra outro item; um checkbox marcado aparece na linha errada.
- Mais trabalho no DOM do que o necessário.

Regras:
- A key deve ser **única entre irmãos** e **estável** (a mesma para o mesmo item sempre): normalmente o **id** do dado.
- Índice só é aceitável se a lista **nunca** é reordenada, filtrada ou tem itens inseridos no meio.
- **Nunca** `Math.random()` como key: muda a cada render e recria tudo.

### Key pra resetar estado
Truque útil: mudar a `key` de um componente faz o React **descartá-lo e criar outro**, com estado novo. Ex.: `<FormularioPerfil key={usuarioId} />` zera o formulário ao trocar de usuário, sem precisar de efeito.

---

## 6. Padrões de componentes que você vai ouvir

- **Componente de apresentação × container**: um só desenha a partir de props; o outro busca dados e cuida da lógica. Hoje isso aparece mais como **componente + custom hook** (aula 05).
- **Compound components**: componentes que funcionam juntos compartilhando estado implícito (`<Tabs>`, `<Tabs.Lista>`, `<Tabs.Painel>`), comuns em bibliotecas de UI.
- **Render props**: passar uma função que devolve JSX (`<Mouse render={(pos) => ...} />`). Menos comum depois dos hooks.

---

## 7. Como falar na entrevista

**"Por que a key é importante em listas? Posso usar o índice?"**
> "A key é a identidade de cada item na reconciliação: é com ela que o React sabe qual elemento é qual entre um render e outro. Ela precisa ser única entre irmãos e estável, normalmente o id do dado. Com o índice, se eu insiro no começo ou reordeno, os índices mudam, o React reaproveita o componente errado e o estado vai parar na linha errada, tipo o texto de um input. Índice só é aceitável em lista estática. E trocar a key é um jeito útil de resetar o estado de um componente."

**"Como componentes se comunicam no React?"**
> "O fluxo é unidirecional: dados descem por props, que são somente leitura, e eventos sobem por callbacks que o pai passa pro filho. Pra compartilhar estado entre irmãos, subo o estado pro ancestral comum. E uso composição com children pra montar componentes genéricos e evitar prop drilling."

---

## 8. Resumo

- **Props** descem, são **somente leitura**; **eventos sobem** por callbacks: **fluxo unidirecional**.
- **Composição** com **`children`** em vez de herança; ajuda a evitar **prop drilling**.
- Condicional com ternário, `&&` (cuidado com o `0`) e retorno antecipado.
- **`key`**: identidade na reconciliação; **única e estável** (id); índice quebra com inserção e reordenação; nunca aleatória.
- Mudar a key **reseta** o componente.
- Padrões: container/apresentação, compound components, render props.

## Termos desta aula
props · somente leitura · valor padrão · callback · fluxo de dados unidirecional · composição · children · prop drilling · renderização condicional · retorno antecipado · lista · key · identidade estável · reconciliação · resetar estado · componente de apresentação · container · compound components · render props

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 02** e separadas por nível.
