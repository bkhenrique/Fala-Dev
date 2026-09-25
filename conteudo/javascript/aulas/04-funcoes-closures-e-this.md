# Aula 04 — Funções, closures e `this`

> **Objetivo:** explicar funções como valores, closures e as regras que determinam `this`.

---

## 1. Funções são valores

Funções podem ser guardadas em variáveis, passadas como argumento e retornadas por outras funções. Isso permite abstrair comportamento e compor operações. Declaração de função e expressão de função têm diferenças de sintaxe e de inicialização; uma arrow function é uma forma de expressão.

```js
function aplicar(valor, transformacao) {
  return transformacao(valor);
}
const dobrar = valor => valor * 2;
aplicar(3, dobrar); // 6
```

## 2. Closure

Uma função criada dentro de outro escopo pode manter acesso às ligações léxicas visíveis onde foi criada. A função junto com essas ligações é chamada **closure**. Ela mantém acesso às variáveis, não uma cópia congelada de seus valores.

```js
function criarContador() {
  let valor = 0;
  return () => ++valor;
}
const proximo = criarContador();
proximo(); // 1
proximo(); // 2
```

Closures são úteis para callbacks e encapsulamento. Também podem prolongar a vida de dados enquanto a função for alcançável; mantenha apenas o estado necessário.

## 3. Parâmetros e retornos

Parâmetros sem argumento recebem `undefined`, salvo quando há valor padrão. Rest parameters (`...itens`) agrupam argumentos restantes em um array. `return` encerra a chamada e fornece o resultado; sem `return` explícito, a função retorna `undefined`.

## 4. `this` em funções

Em função comum, `this` depende da forma de chamada. Em `obj.metodo()`, o objeto à esquerda do ponto é o valor de `this` nessa chamada. Uma chamada simples em modo estrito não recebe automaticamente o objeto global como `this`; o valor é `undefined`. `call`, `apply` e `bind` permitem definir ou fixar esse valor.

Arrow functions não criam seu próprio `this`; capturam o valor léxico do escopo externo. Por isso, são úteis em callbacks, mas não substituem métodos quando o método precisa receber `this` do objeto chamador.

## 5. Como falar na entrevista

**“O que é uma closure?”**
> “É uma função que mantém acesso ao ambiente léxico em que foi criada, mesmo depois de a função externa terminar. Uso isso para callbacks e para encapsular estado; a referência ao ambiente também significa que dados ainda usados pela closure continuam alcançáveis.”

## 6. Resumo

- Funções são valores de primeira classe.
- Closure combina função com acesso às ligações do ambiente léxico externo.
- Parâmetros ausentes valem `undefined`, salvo valor padrão; função sem retorno explícito retorna `undefined`.
- Em função comum, `this` depende da chamada.
- Arrow function herda `this` léxico e não pode receber outro via `call` ou `bind`.

## Termos desta aula
Função de primeira classe · callback · closure · ambiente léxico · parâmetro padrão · rest parameter · `return` · `this` · arrow function · `bind`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 04** e separadas por nível.

### Para aprofundar
[Funções — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) · [Closures — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
