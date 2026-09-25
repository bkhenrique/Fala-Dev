# Aula 08 — Classes e compatibilidade com JavaScript

> **Objetivo:** diferenciar verificações de classe feitas pelo TypeScript das garantias e propriedades reais do JavaScript.

---

## 1. Tipos de instância e de construtor

Uma classe declara um tipo de instância e também um valor construtor disponível em runtime. `implements` faz o compilador verificar se a instância satisfaz uma interface; a palavra `implements` não cria validação nem código de interface em JavaScript.

Uma classe pode ser usada como tipo de instância (`Usuario`) e, em posição de valor, como construtor (`typeof Usuario`). Essa distinção aparece ao escrever funções que recebem uma classe para instanciar.

## 2. Modificadores de acesso

`public`, `protected` e `private` controlam acesso verificado estaticamente pelo TypeScript. O modificador `private` de TypeScript não é, por si só, o mecanismo de privacidade runtime de JavaScript. Em contraste, campos privados ECMAScript com `#campo` têm restrição de acesso executada pela linguagem em runtime.

`readonly` em propriedade restringe atribuições segundo o compilador; não congela o objeto nem seus membros aninhados em runtime. Essas distinções devem ser consideradas quando dados atravessam código JavaScript sem checagem TypeScript.

## 3. Herança e substituição

`extends` herda membros de uma classe base conforme o modelo JavaScript. Tipos TypeScript são estruturais na maioria das comparações, mas membros privados/protegidos de classe influenciam compatibilidade e precisam ter origem na mesma hierarquia.

Implemente `implements` para checar um contrato estrutural; use herança quando a relação de subtipo fizer sentido. Nenhuma dessas declarações substitui validação de dados recebidos de fora.

## 4. Parâmetros de construtor

Parâmetros de construtor com modificadores, como `constructor(public nome: string)`, são um recurso de sintaxe do TypeScript que declara e inicializa uma propriedade. Essa sintaxe é transformada na emissão quando necessário; ela não é uma assinatura de parâmetro comum do JavaScript.

## 5. Como falar na entrevista

**“`private` do TypeScript garante privacidade em runtime?”**
> “O modificador `private` tradicional do TypeScript é uma restrição estática do compilador. Para privacidade runtime nativa, JavaScript tem campos `#privados`. Ambos têm contratos e compatibilidade diferentes, então não os trato como equivalentes.”

## 6. Resumo

- Classe fornece um tipo de instância e um valor construtor em runtime.
- `implements` é uma verificação estática e não gera checagem runtime.
- `private`/`protected` do TypeScript são restrições estáticas; `#campo` é privacidade runtime JavaScript.
- `readonly` não congela objetos profundamente.
- Anotações e interfaces não protegem contra código JavaScript ou dados externos.

## Termos desta aula
Tipo de instância · tipo construtor · `typeof Classe` · `implements` · `private` · `protected` · `readonly` · campo `#privado` · herança

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 08** e separadas por nível.

### Para aprofundar
[Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
