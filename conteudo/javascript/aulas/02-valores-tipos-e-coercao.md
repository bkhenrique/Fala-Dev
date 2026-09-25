# Aula 02 — Valores, tipos e coerção

> **Objetivo:** explicar os tipos de valores em JavaScript e prever conversões e comparações comuns.

---

## 1. Valores primitivos

JavaScript tem sete tipos primitivos: `undefined`, `null`, `boolean`, `number`, `bigint`, `string` e `symbol`. Um primitivo não é um objeto e seu valor não pode ser alterado. Operações produzem outros valores em vez de modificar o primitivo original.

`number` usa o formato binário de ponto flutuante IEEE 754 de 64 bits e inclui valores como `NaN`, `Infinity` e `-0`. Inteiros muito grandes podem perder precisão; `BigInt` representa inteiros arbitrariamente grandes, mas não se mistura automaticamente com `number` em operações aritméticas.

`null` representa ausência intencional de valor; `undefined` costuma indicar valor ainda não atribuído ou propriedade ausente. A expressão histórica `typeof null` retorna `"object"`; isso é um comportamento legado, não evidência de que `null` seja objeto.

## 2. Objetos e identidade

Objetos, arrays e funções são valores de tipo objeto (funções também têm comportamento chamável). Variáveis guardam referências a esses valores. Atribuir uma referência a outra variável não clona o objeto:

```js
const original = { pontos: 1 };
const copiaDaReferencia = original;
copiaDaReferencia.pontos = 2;
// original.pontos agora também é 2.
```

Dois objetos com as mesmas propriedades ainda são objetos distintos. `===` compara identidade para objetos, não igualdade estrutural do conteúdo.

## 3. Conversões e coerção

Uma conversão **explícita** é pedida pelo código, como `Number(texto)` ou `String(valor)`. **Coerção** é a conversão implícita que certas operações aplicam. Por exemplo, `+` pode concatenar strings ou somar números; o resultado depende dos valores convertidos.

Em decisões condicionais, valores são convertidos para booleano. `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` e `NaN` são *falsy*; objetos e arrays vazios são *truthy*. Não confunda “vazio” no sentido de negócio com falsy.

## 4. Igualdade

`===` compara sem coerção entre tipos: valores de tipos diferentes não são iguais. Para objetos, verifica se é a mesma referência. `==` pode converter operandos antes de comparar e por isso tem casos pouco intuitivos. A recomendação prática é preferir `===`, exceto quando a conversão implícita foi escolhida deliberadamente e está clara.

`Object.is` difere de `===` em dois casos notáveis: considera `NaN` igual a `NaN` e distingue `+0` de `-0`. Não é um comparador profundo de objetos.

```js
NaN === NaN;                // false
Object.is(NaN, NaN);         // true
({ id: 1 }) === ({ id: 1 }); // false: objetos distintos
```

Para detectar o valor numérico `NaN`, use `Number.isNaN(valor)`: essa função não converte strings nem outros tipos antes de verificar. `isNaN` global faz coerção e pode produzir resultados surpreendentes.

## 5. Precisão numérica e passagem de valores

Como `number` usa ponto flutuante binário, alguns decimais não têm representação exata. Por isso, `0.1 + 0.2` não é exatamente `0.3`. Cálculos que dependam de arredondamento devem explicitar a regra do domínio. Para dinheiro, é comum guardar unidades mínimas inteiras, considerando os limites seguros de `number` ou outra representação adequada.

JavaScript passa argumentos por valor. Se o valor é uma referência a objeto, a função recebe uma cópia da referência e pode alterar o mesmo objeto. Reatribuir o parâmetro local não reatribui a variável da chamada:

```js
function trocar(parametro) {
  parametro = { ativo: false };
}
const estado = { ativo: true };
trocar(estado);
// estado continua sendo { ativo: true }
```

Isso é mais preciso do que dizer que “objetos são passados por referência”: o parâmetro não é um alias reatribuível para a variável original.

## 6. Como falar na entrevista

**“JavaScript passa objetos por referência?”**
> “JavaScript passa valores. Quando o valor é uma referência a objeto, a função recebe uma cópia dessa referência: pode alterar o objeto compartilhado, mas reatribuir o parâmetro não troca a variável original.”

## 7. Resumo

- Há sete tipos primitivos; objetos têm identidade e podem ser mutáveis.
- `typeof null === "object"` é uma peculiaridade histórica.
- `===` evita coerção entre tipos; igualdade de objetos é por identidade.
- `Object.is` tem regras próprias para `NaN` e zeros com sinal; não compara objetos profundamente.
- Ponto flutuante pode não representar decimais exatamente; defina a política de precisão do domínio.
- Coerção aparece em operadores e condicionais; conversão explícita torna a intenção visível.
- Valores falsy incluem `0`, `""`, `null`, `undefined`, `false` e `NaN`; arrays e objetos vazios são truthy.

## Termos desta aula
Primitivo · objeto · referência · identidade · coerção · truthy · falsy · `typeof` · `===` · `Object.is` · `NaN` · `BigInt`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 02** e separadas por nível.

### Para aprofundar
[Tipos e estruturas de dados — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures) · [Equality comparisons — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
