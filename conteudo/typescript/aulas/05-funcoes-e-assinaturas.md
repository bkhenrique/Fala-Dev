# Aula 05 — Funções e assinaturas

> **Objetivo:** declarar contratos de parâmetros, retornos, callbacks e sobrecargas com tipos de função.

---

## 1. Parâmetros e retorno

Anotações de parâmetro ficam depois do nome do parâmetro; o tipo de retorno fica depois dos parênteses. O compilador costuma inferir o retorno, mas anotá-lo pode documentar ou fixar um contrato público.

```ts
function somar(a: number, b: number): number {
  return a + b;
}
```

Parâmetro opcional (`?`) pode não ser fornecido e seu valor deve ser tratado como possivelmente `undefined`. Parâmetros com valor padrão também podem ser omitidos. Parâmetros rest são tipados como arrays.

## 2. Tipos de função e callbacks

Uma função pode ser descrita por seus parâmetros e retorno, por exemplo `(texto: string) => number`. A tipagem contextual pode inferir os parâmetros de um callback quando ele é passado para uma API conhecida.

Parâmetros de callback devem refletir a API chamada. Não marque como opcional um parâmetro só porque a implementação do callback pretende ignorá-lo: opcionalidade descreve o que o chamador pode omitir, não o que o receptor escolhe usar.

## 3. `void` e `Promise`

Uma função anotada com retorno `void` comunica que o chamador não deve depender de um valor retornado. Uma função `async` tem retorno `Promise<T>` quando seu valor final é `T`; a declaração `async` sempre envolve o resultado em Promise.

`void` não significa que a função não possa calcular internamente um valor. APIs de callbacks também podem aceitar funções que retornam valor e ignorar esse resultado.

## 4. Sobrecargas

Sobrecargas permitem declarar várias formas públicas de chamada, seguidas de uma implementação compatível que lida com os casos. As assinaturas visíveis ao chamador são as sobrecargas; a assinatura da implementação não fica disponível como uma chamada adicional.

Prefira união quando a função pode naturalmente aceitar alternativas simples. Sobrecargas são úteis quando a relação entre os parâmetros e o retorno varia de modo que uma única assinatura união não expressa com clareza.

## 5. Como falar na entrevista

**“Quando usar sobrecargas em vez de uma união?”**
> “Uso união quando os argumentos e o retorno têm o mesmo contrato geral para várias alternativas. Uso sobrecargas quando diferentes formatos de chamada implicam relações diferentes entre entrada e saída. A implementação ainda precisa lidar corretamente com todos os casos declarados.”

## 6. Resumo

- Tipos de parâmetros aparecem após o nome; tipo de retorno após a lista de parâmetros.
- Inferência e tipagem contextual reduzem anotações redundantes.
- Parâmetro opcional significa que o chamador pode omiti-lo.
- `void` descreve um retorno que o chamador não usa; `async` retorna `Promise`.
- Sobrecargas descrevem chamadas públicas diferentes; a implementação cobre os casos.

## Termos desta aula
Assinatura de função · tipo de função · parâmetro opcional · parâmetro rest · tipagem contextual · `void` · `Promise<T>` · sobrecarga

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 05** e separadas por nível.

### Para aprofundar
[More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
