# Aula 06 — Arrays, coleções e iteração

> **Objetivo:** escolher estruturas de coleção da linguagem e explicar métodos de iteração sem confundi-los com laços de objeto.

---

## 1. Arrays

Array é um objeto indexado, com propriedade `length` e métodos de iteração. Não é uma região de memória necessariamente contígua nem exige que todos os índices estejam preenchidos. Um array pode ter posições vazias (*sparse*) e conter valores de tipos diferentes.

`map` produz um array transformado; `filter` seleciona itens; `reduce` acumula um resultado. `forEach` executa uma função para cada elemento presente e retorna `undefined`. Esses métodos não substituem automaticamente um laço quando é necessário `break`, `continue` ou controle sequencial explícito.

## 2. Mutação e cópia

Métodos como `push`, `splice`, `sort` e `reverse` alteram o array. `map`, `filter` e `slice` retornam outro array. Spread (`[...itens]`) cria uma cópia rasa. Ao escolher, deixe claro se a operação modifica ou cria um valor novo; ordenação do `sort()` padrão compara strings, portanto números geralmente precisam de comparador.

```js
const valores = [3, 20, 100];
valores.sort(); // [100, 20, 3]: comparação como strings
valores.sort((a, b) => a - b); // [3, 20, 100]: comparação numérica
```

`sort()` altera o array. `toSorted()` retorna um novo array ordenado em ambientes que implementam esse método; outra opção é ordenar uma cópia. O comparador pode ser chamado várias vezes, então não coloque nele efeitos colaterais que dependam de uma quantidade específica de chamadas.

Arrays esparsos têm posições sem elemento. Diversos métodos de callback, como `map`, ignoram essas posições, portanto prefira arrays densos para listas comuns de aplicação ou trate explicitamente os casos esparsos.

## 3. Objetos, Map e Set

Use um objeto comum para registros com campos nomeados. `Map` associa chaves a valores e aceita qualquer tipo como chave; `Set` armazena valores únicos conforme igualdade SameValueZero. `WeakMap` e `WeakSet` mantêm referências fracas a objetos e têm limitações próprias, como não serem enumeráveis.

Objetos e `Map` não são intercambiáveis: objetos convertem chaves de propriedade em strings ou símbolos, enquanto `Map` mantém a identidade/tipo da chave.

`Map` e `Set` preservam a ordem de inserção ao iterar. `WeakMap`/`WeakSet` não são enumeráveis: essa limitação acompanha suas referências fracas, que não impedem a coleta de objetos quando não há outras referências fortes. Para dados JSON com campos conhecidos, um objeto simples costuma ser a representação mais direta.

## 4. Iteráveis e `for...of`

Um **iterável** fornece um método associado ao símbolo `Symbol.iterator`, que retorna um **iterador**. Arrays, strings, `Map` e `Set` são iteráveis. `for...of` consome valores do iterador; `for...in` percorre nomes enumeráveis de propriedades, incluindo propriedades herdadas enumeráveis, por isso não é o laço adequado para percorrer valores de array.

Para transformação que preserva uma saída por item, `map` expressa a intenção; `filter` seleciona; `find` localiza o primeiro item que satisfaz a condição. `reduce` é flexível para acumular um único resultado, mas um laço explícito pode ser mais legível quando o algoritmo tem várias etapas, saída antecipada ou tratamento de erros.

## 5. Como falar na entrevista

**“Quando você usaria `Map` em vez de objeto?”**
> “Uso objeto para representar registros com propriedades conhecidas. Uso `Map` quando preciso de chaves de qualquer tipo, identidade de objeto como chave ou operações próprias de coleção. Para percorrer um array, prefiro `for...of` para fluxo com controle e métodos como `map` ou `filter` para transformações declarativas.”

## 6. Resumo

- Array é objeto indexado e pode ter lacunas ou valores de tipos misturados.
- Métodos de array diferem entre mutáveis e não mutáveis; `sort()` altera o original.
- `Map` aceita chaves de qualquer tipo; `Set` mantém valores únicos.
- `for...of` consome valores iteráveis; `for...in` enumera chaves de propriedades.
- Cópias com spread e `slice` são rasas.

## Termos desta aula
Array · sparse array · `map` · `filter` · `reduce` · mutação · cópia rasa · `Map` · `Set` · iterável · iterador · `for...of` · `for...in`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 06** e separadas por nível.

### Para aprofundar
[Indexed collections — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections) · [Keyed collections — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections) · [Iteration protocols — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
