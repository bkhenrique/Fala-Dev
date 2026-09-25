# Aula 10 — Iteradores e generators

> **Objetivo:** explicar os protocolos de iteração e como generators produzem valores sob demanda.

---

## 1. Iterável e iterador

Um objeto **iterável** fornece `Symbol.iterator`, método que devolve um iterador. Um **iterador** tem um método `next()` que devolve objetos no formato `{ value, done }`. Quando `done` é `true`, a iteração terminou.

O protocolo permite que `for...of`, spread e desestruturação consumam diferentes estruturas de dados com uma interface comum. O iterador controla o progresso; cada consumo pode solicitar o próximo valor.

## 2. Generators

Uma função generator é declarada com `function*`. Chamá-la retorna um objeto generator, que é iterável e iterador; o corpo começa a executar quando `next()` é chamado. `yield` suspende a execução e fornece um valor; uma chamada posterior a `next()` retoma do ponto suspenso.

```js
function* ids() {
  yield "a";
  yield "b";
}

for (const id of ids()) {
  // "a", depois "b"
}
```

Isso é produção sob demanda, útil para sequências que não precisam ser materializadas todas de uma vez. Não significa que o generator rode em outra thread.

## 3. `yield*` e uso responsável

`yield*` delega a iteração a outro iterável. Generators podem modelar percursos, pipelines e sequências, mas introduzem estado suspenso e fluxo menos direto. Para transformar listas pequenas e já disponíveis, métodos como `map` e `filter` podem ser mais simples.

Generators assíncronos usam `async function*` e `for await...of` para consumir iteráveis assíncronos; a fonte e o suporte do host determinam de onde vêm os dados assíncronos.

## 4. Como falar na entrevista

**“Qual a diferença entre array e generator?”**
> “Um array mantém os valores materializados e oferece acesso por índice. Um generator produz valores progressivamente quando seu iterador é avançado, preservando o estado da execução entre `yield`s. Escolho conforme preciso de acesso aleatório ou produção sob demanda.”

## 5. Resumo

- Iterável fornece `Symbol.iterator`; iterador implementa `next()`.
- `for...of` consome o protocolo de iteração.
- Generator (`function*`) retorna iterador e pausa/retoma em `yield`.
- Produção sob demanda não implica execução paralela.
- Generators assíncronos produzem iteráveis assíncronos.

## Termos desta aula
Iterável · iterador · `Symbol.iterator` · `next()` · `done` · generator · `yield` · `yield*` · produção sob demanda · generator assíncrono

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 10** e separadas por nível.

### Para aprofundar
[Iterators and generators — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators) · [Iteration protocols — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
