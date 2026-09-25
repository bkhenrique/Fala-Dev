# Aula 06 — Generics e restrições

> **Objetivo:** usar parâmetros de tipo para preservar relações entre valores sem recorrer a `any`.

---

## 1. O problema da generalidade

Uma função que sempre devolve `any` aceita muitas entradas, mas perde a relação entre o valor recebido e o valor retornado. Um generic cria um parâmetro de tipo que representa essa relação:

```ts
function identidade<T>(valor: T): T {
  return valor;
}

const numero = identidade(42); // T é inferido como number
```

O chamador pode fornecer o parâmetro explicitamente, mas muitas vezes o compilador consegue inferi-lo a partir dos argumentos.

## 2. Restrições

Um tipo genérico sem restrição não pode ser usado como se tivesse qualquer propriedade. `extends` limita os tipos aceitos a valores que satisfaçam uma forma necessária:

```ts
function tamanho<T extends { length: number }>(valor: T): number {
  return valor.length;
}
```

A restrição expressa uma capacidade, não necessariamente uma classe base. Não escolha um tipo de parâmetro genérico quando um tipo concreto simples descreve melhor o contrato.

## 3. Preservar precisão do tipo

Generics são mais úteis quando o tipo aparece de forma relacionada em mais de um lugar, como entrada e saída, chave e valor, ou retorno e callback. Um `T` decorativo que não afeta o resultado não cria segurança adicional.

Parâmetros de tipo podem ter valores padrão e restrições. Eles são apagados na execução: não é possível, em geral, testar diretamente `T` com `instanceof` porque `T` não existe como valor JavaScript.

## 4. `keyof` e acesso indexado

`keyof T` produz uma união das chaves conhecidas de `T`. `T[K]` obtém o tipo associado a uma chave `K`. Com uma restrição `K extends keyof T`, é possível escrever funções genéricas seguras para ler uma propriedade e manter seu tipo específico.

```ts
function ler<T, K extends keyof T>(objeto: T, chave: K): T[K] {
  return objeto[chave];
}
```

## 5. Como falar na entrevista

**“Por que usar generic em vez de `any`?”**
> “`any` aceita qualquer operação e perde a relação entre entrada e saída. Um generic mantém o tipo concreto do chamador, por exemplo `T` entrando e `T` saindo, e permite reutilização com checagem estática. Adiciono uma restrição quando o algoritmo depende de uma capacidade específica.”

## 6. Resumo

- Generics preservam relações entre tipos de entrada, saída e parâmetros.
- Inferência costuma determinar argumentos de tipo a partir dos valores.
- `extends` restringe quais tipos concretos são aceitos.
- `keyof` e `T[K]` descrevem chaves e valores de propriedades genericamente.
- Parâmetros de tipo são conceitos estáticos, não valores disponíveis no runtime.

## Termos desta aula
Generic · parâmetro de tipo · inferência genérica · restrição · `extends` · `keyof` · acesso indexado · `T[K]` · apagamento

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 06** e separadas por nível.

### Para aprofundar
[Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) · [Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html) · [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
