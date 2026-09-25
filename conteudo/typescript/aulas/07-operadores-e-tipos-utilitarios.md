# Aula 07 — Operadores e tipos utilitários

> **Objetivo:** compor tipos a partir de outros tipos sem duplicar contratos e entender os limites dessas transformações.

---

## 1. Tipos derivados

TypeScript permite expressar relações entre tipos: `keyof T` obtém chaves, `T[K]` consulta o tipo de uma propriedade, `typeof valor` captura o tipo estático de uma expressão e `as const` preserva literais e adiciona qualificadores readonly no tipo inferido.

Esses operadores atuam no sistema de tipos. `typeof` em uma posição de tipo não é a mesma operação runtime do `typeof` do JavaScript, embora use a mesma palavra-chave.

## 2. Tipos mapeados e condicionais

Um tipo mapeado percorre as chaves de outro tipo para transformar suas propriedades. Tipos utilitários como `Partial<T>`, `Readonly<T>`, `Pick<T, K>` e `Omit<T, K>` são construídos a partir de mecanismos desse tipo.

Um tipo condicional escolhe um tipo com base em uma relação de compatibilidade, usando a forma `T extends U ? X : Y`. Com um parâmetro genérico nu, tipos condicionais podem distribuir sobre cada integrante de uma união; parênteses em tupla mudam esse comportamento.

## 3. Tipos utilitários comuns

- `Partial<T>` torna as propriedades opcionais no tipo.
- `Required<T>` remove a opcionalidade.
- `Pick<T, K>` seleciona propriedades nomeadas; `Omit<T, K>` remove-as.
- `Record<K, V>` descreve um mapeamento de chaves para valores.
- `ReturnType<F>` obtém o tipo retornado por uma função.

Esses utilitários transformam descrições estáticas. `Partial<User>` não remove campos de um objeto em runtime nem valida um payload parcial.

## 4. `satisfies` e widening

O operador `satisfies` verifica se uma expressão atende a um tipo sem simplesmente substituir o tipo inferido da expressão por aquele tipo. Ele é útil para validar a forma de uma configuração preservando informação mais específica. `as` faz uma asserção e pode esconder incompatibilidades; os dois operadores têm propósitos diferentes.

## 5. Como falar na entrevista

**“`Partial<T>` valida um objeto parcialmente preenchido?”**
> “Não. É uma transformação estática que torna propriedades opcionais para o verificador. A entrada ainda precisa ser checada em runtime e as regras do domínio continuam necessárias.”

## 6. Resumo

- `keyof`, `typeof` em tipos e `T[K]` permitem derivar tipos de declarações existentes.
- Tipos mapeados e condicionais compõem transformações avançadas.
- Utilitários como `Partial`, `Pick`, `Omit` e `Record` operam no sistema estático.
- `satisfies` checa compatibilidade sem descartar tanta informação inferida.
- Tipos utilitários não alteram nem validam valores em runtime.

## Termos desta aula
Tipo utilitário · tipo mapeado · tipo condicional · `keyof` · `typeof` de tipo · indexed access · `Partial` · `Pick` · `Omit` · `Record` · `satisfies`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 07** e separadas por nível.

### Para aprofundar
[Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) · [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) · [TypeScript 4.9: `satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator)
