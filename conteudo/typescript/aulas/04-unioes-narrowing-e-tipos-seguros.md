# Aula 04 — União, narrowing e tipos seguros

> **Objetivo:** modelar alternativas válidas e explicar como o controle de fluxo refina um tipo amplo para um mais específico.

---

## 1. União como conjunto de alternativas

Um tipo união, escrito `A | B`, permite valores que pertençam a uma das alternativas. Só é seguro acessar diretamente membros disponíveis em todas as alternativas. O código precisa distinguir as opções antes de usar um membro específico.

## 2. Narrowing

**Narrowing** é o refinamento que o verificador faz a partir do fluxo de controle. `typeof`, comparações, `in`, `instanceof` e verificações de valores discriminantes podem reduzir as possibilidades de um tipo união.

```ts
function exibir(valor: string | number) {
  if (typeof valor === "string") {
    return valor.toUpperCase(); // aqui é string
  }
  return valor.toFixed(2); // aqui é number
}
```

O refinamento vale no trecho em que a condição garante a propriedade. Se a variável puder mudar ou um getter/callback introduzir comportamento externo, o compilador aplica regras próprias de análise e o programa ainda precisa respeitar as invariantes em runtime.

## 3. Uniões discriminadas

Uma união de objetos pode compartilhar uma propriedade literal, como `kind`, que identifica cada variante. Após comparar esse discriminante, o compilador permite os campos específicos do ramo correspondente.

```ts
type Resultado =
  | { kind: "sucesso"; valor: string }
  | { kind: "erro"; mensagem: string };

function resumir(r: Resultado) {
  if (r.kind === "sucesso") return r.valor;
  return r.mensagem;
}
```

Esse padrão representa estados mutuamente exclusivos melhor do que um único objeto cheio de propriedades opcionais que poderiam formar combinações inválidas.

## 4. `unknown`, predicados e asserções

Dados JSON, respostas HTTP e valores vindos de `JSON.parse` devem ser tratados como não confiáveis. `unknown` obriga o código a verificar antes de acessar propriedades. Uma função de guarda pode retornar `value is Tipo`, mas o corpo dessa função precisa validar de verdade o valor.

Uma asserção (`valor as Tipo`) informa ao compilador que o programador acredita em um tipo; ela não converte nem verifica o dado. Uma asserção incorreta pode causar erro em runtime.

## 5. Exaustividade

`never` aparece quando nenhum caso resta após o narrowing. Usar uma função que recebe `never` em um ramo final ajuda a revelar quando uma nova variante foi adicionada à união e o fluxo não foi atualizado.

## 6. Como falar na entrevista

**“O narrowing valida dados recebidos de uma API?”**
> “O narrowing refina tipos estáticos com base em verificações no código. Para validar dados externos, as verificações precisam realmente inspecionar o valor em runtime; uma asserção ou anotação não faz essa validação.”

## 7. Resumo

- Uma união permite alternativas; operações específicas exigem narrowing.
- O controle de fluxo refina tipos com verificações como `typeof` e discriminantes.
- Uniões discriminadas modelam estados mutuamente exclusivos e favorecem exaustividade.
- `unknown` é adequado para valores externos antes de serem verificados.
- `as` é uma asserção estática e não valida nem converte o valor.

## Termos desta aula
Tipo união · narrowing · discriminante · união discriminada · guarda de tipo · predicado de tipo · asserção · exhaustividade · `never` · `unknown`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 04** e separadas por nível.

### Para aprofundar
[Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) · [Everyday Types: unions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
