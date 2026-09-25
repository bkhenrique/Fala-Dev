# Aula 03 — Tipos de objeto, `type` e `interface`

> **Objetivo:** descrever formatos de objetos e distinguir as capacidades de aliases e interfaces sem tratá-los como mecanismos de runtime.

---

## 1. Tipos estruturais

TypeScript usa principalmente compatibilidade estrutural: dois valores são compatíveis quando têm os membros requeridos com tipos compatíveis. A relação depende da forma do valor, não apenas do nome de uma classe ou interface.

```ts
interface Ponto { x: number; y: number }
const origem = { x: 0, y: 0, rotulo: "início" };
const ponto: Ponto = origem; // compatível: possui x e y
```

Ao atribuir uma variável já existente, propriedades extras normalmente não impedem a atribuição. Literais de objeto recém-criados recebem verificações adicionais de propriedades excedentes para capturar possíveis erros de digitação; isso não é uma regra de tipo nominal.

## 2. `interface`

`interface` descreve a forma de objetos, funções e classes. Interfaces podem estender outras interfaces e podem participar de declaração mesclada quando declarações com o mesmo nome são permitidas. Essa capacidade pode ser útil para ampliar tipos de bibliotecas, mas uma mesclagem acidental também pode alterar o contrato global.

## 3. Alias `type`

`type` dá um nome a um tipo, incluindo objetos, primitivos, uniões, interseções, tuplas e tipos condicionais. Tanto aliases quanto interfaces podem descrever muitos formatos de objeto. Uma diferença importante é que aliases não têm a mesma declaração mesclada automática das interfaces.

Uma união (`A | B`) aceita uma alternativa; uma interseção (`A & B`) combina requisitos. Não confunda interseção de tipos com união de campos opcionalmente presentes.

## 4. Propriedades opcionais e somente leitura

`propriedade?: T` indica que a propriedade pode estar ausente; ao lê-la, o valor pode ser `undefined`. `readonly` impede atribuições por meio daquela referência segundo a checagem do compilador. Não congela profundamente o objeto em runtime e não torna imutáveis objetos aninhados.

## 5. Como falar na entrevista

**“Qual a diferença entre `type` e `interface`?”**
> “Os dois descrevem formatos estruturais de objeto. `interface` é voltada a contratos de objeto e pode ser estendida e mesclada; `type` pode nomear qualquer tipo, inclusive uniões e interseções, mas não tem a mesma mesclagem de declarações. Escolho conforme o tipo que preciso expressar e as convenções do projeto.”

## 6. Resumo

- Compatibilidade estrutural compara membros, em vez de exigir nomes iguais.
- Literais recebem verificações de propriedades excedentes em certos contextos.
- `interface` e `type` podem descrever formatos de objeto, com diferenças de composição.
- Aliases podem representar uniões, interseções e tipos não relacionados a objetos.
- `readonly` é uma restrição de atribuição estática, não congelamento em runtime.

## Termos desta aula
Tipo estrutural · interface · alias · união · interseção · propriedade opcional · `readonly` · excess property check · declaration merging

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 03** e separadas por nível.

### Para aprofundar
[Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) · [Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
