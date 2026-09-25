# Aula 02 — Tipos, inferência e anotações

> **Objetivo:** ler tipos comuns de TypeScript e decidir quando anotar e quando deixar o compilador inferir.

---

## 1. Tipos primitivos e coleções

Os tipos primitivos mais comuns são `string`, `number` e `boolean`. Eles correspondem aos valores JavaScript desses tipos; JavaScript não separa `number` em tipos `int` e `float`. Arrays podem ser escritos como `number[]` ou `Array<number>`. Tuplas, como `[string, number]`, descrevem posições com tipos conhecidos.

Use os nomes minúsculos dos tipos primitivos. `String`, `Number` e `Boolean` designam tipos de objeto wrapper e normalmente não são os tipos desejados para valores primitivos.

## 2. Inferência

O compilador infere tipos a partir de inicializadores e contexto. Em geral, não é necessário anotar toda variável se o valor inicial deixa o tipo claro:

```ts
const nome = "Lia"; // inferido como string
const nomes = ["Lia", "Rui"]; // inferido como string[]
```

Em callbacks, o tipo esperado pela função que recebe o callback pode informar o tipo dos parâmetros. Isso se chama **tipagem contextual**. Anotações explícitas são úteis quando definem uma fronteira, esclarecem uma API pública ou impedem que uma mudança acidental altere um contrato.

## 3. `any`, `unknown`, `void` e `never`

`any` desativa boa parte da checagem para aquele valor e permite operações sem verificação. É uma saída de escape útil em migrações, mas seu uso espalhado remove garantias do sistema.

`unknown` aceita qualquer valor, mas exige narrowing ou uma asserção antes de operações específicas. É normalmente uma escolha mais segura para dados de origem desconhecida. `void` descreve uma função cujo retorno não é usado como valor; `never` representa caminhos que não produzem um retorno normal, como uma função que sempre lança uma exceção.

## 4. Nulidade

Com `strictNullChecks` ligado, `null` e `undefined` precisam ser tratados explicitamente quando o tipo não os inclui. Um tipo opcional `string | undefined` obriga o código a considerar a ausência antes de usar métodos de string. Sem essa opção, o compilador permite mais usos que podem falhar em runtime.

## 5. Como falar na entrevista

**“Quando você anota um tipo explicitamente?”**
> “Deixo a inferência cuidar de valores locais quando ela é clara. Anoto parâmetros, contratos públicos e fronteiras importantes quando isso melhora a leitura ou fixa uma intenção. Evito redundância, mas não escondo tipos frágeis com `any`.”

## 6. Resumo

- Use `string`, `number` e `boolean` para os primitivos; array usa `T[]` ou `Array<T>`.
- Inferência reduz anotações repetidas; tipagem contextual infere callbacks pelo contexto.
- `any` desativa verificações; `unknown` exige checagem antes do uso.
- `void` descreve retorno não usado; `never` descreve ausência de retorno normal.
- `strictNullChecks` faz `null` e `undefined` aparecerem explicitamente nos contratos.

## Termos desta aula
Inferência · tipagem contextual · anotação · `any` · `unknown` · `void` · `never` · `strictNullChecks` · tipo união · tupla

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 02** e separadas por nível.

### Para aprofundar
[Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) · [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
