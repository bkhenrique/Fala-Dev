# Aula 03 — Declarações, escopo e hoisting

> **Objetivo:** comparar `var`, `let` e `const` e explicar escopo, hoisting e zona temporal morta.

---

## 1. Declaração e atribuição

Declarar um identificador cria uma ligação entre um nome e um valor no ambiente léxico. Atribuir associa ou troca o valor dessa ligação. `const` impede reatribuir a ligação, mas não torna imutável um objeto guardado nela.

```js
const usuario = { nome: "Ana" };
usuario.nome = "Bia"; // permitido: altera o objeto
// usuario = {};      // TypeError: reatribuição proibida
```

## 2. Escopos

`let` e `const` têm escopo de bloco: ficam visíveis no bloco `{ ... }` onde foram declarados. `var` tem escopo de função (ou global quando declarado fora de função), não de bloco. Escopo léxico significa que a visibilidade depende de onde o código foi escrito, não de quem o chamou.

```js
if (true) {
  let dentro = 1;
  var daFuncao = 2;
}
// dentro não existe aqui; daFuncao existe no escopo envolvente.
```

Módulos têm escopo de módulo: declarações de topo não viram automaticamente propriedades do objeto global.

## 3. Hoisting sem mito

**Hoisting** é um nome didático para o fato de que algumas declarações podem ser referenciadas antes de sua posição textual, por causa das regras de instanciação e avaliação da linguagem. Não significa que o motor literalmente mova linhas do arquivo.

Declarações de função podem ser chamadas antes de aparecerem no texto. `var` tem ligação disponível desde o início do escopo e começa como `undefined`. `let` e `const` também têm ligações criadas para o escopo, mas ficam inacessíveis até a declaração ser inicializada.

## 4. Zona temporal morta

O intervalo entre o início do escopo e a inicialização de uma ligação `let` ou `const` é a **zona temporal morta** (TDZ). Acessar a variável nesse intervalo lança `ReferenceError`.

```js
// console.log(total); // ReferenceError: ainda está na TDZ
let total = 3;
```

O mesmo cuidado se aplica a certas declarações de classe. Evitar leitura antes da declaração torna o fluxo mais claro.

## 5. Como falar na entrevista

**“Qual a diferença entre `var`, `let` e `const`?”**
> “`var` tem escopo de função e pode ser redeclarado; `let` e `const` têm escopo de bloco e não podem ser acessados antes da inicialização por causa da TDZ. `let` permite reatribuição e `const` não, mas `const` não congela objetos.”

## 6. Resumo

- Escopo léxico decorre da estrutura do código.
- `var` tem escopo de função; `let` e `const`, de bloco.
- `const` impede reatribuição da ligação, não mutação do objeto.
- Hoisting descreve regras de disponibilidade, não movimentação física de código.
- `let` e `const` lançam `ReferenceError` quando acessados na TDZ.

## Termos desta aula
Declaração · atribuição · escopo léxico · escopo de bloco · escopo de função · hoisting · TDZ · ligação · mutabilidade

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 03** e separadas por nível.

### Para aprofundar
[Declarações — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements) · [Declarações e escopo — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations)
