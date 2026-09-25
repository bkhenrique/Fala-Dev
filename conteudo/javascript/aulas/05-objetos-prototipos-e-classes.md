# Aula 05 — Objetos, protótipos e classes

> **Objetivo:** descrever propriedades de objetos e o mecanismo de herança baseado em protótipos, inclusive a sintaxe de classes.

---

## 1. Objetos e propriedades

Objetos são coleções de propriedades. Uma propriedade pode ser própria do objeto ou encontrada ao percorrer sua cadeia de protótipos. Propriedades podem ser acessadas com ponto ou colchetes; colchetes permitem chaves calculadas e nomes que não são identificadores.

```js
const chave = "status";
const pedido = { [chave]: "aberto" };
pedido.status; // "aberto"
```

Desestruturação lê propriedades e as associa a variáveis; spread copia propriedades enumeráveis próprias para um novo objeto. Essa cópia é rasa: objetos aninhados ainda podem ser compartilhados.

## 2. Cadeia de protótipos

Ao buscar uma propriedade, JavaScript verifica primeiro o objeto. Se não encontrá-la, segue o link interno para seu protótipo e continua até encontrar a propriedade ou chegar ao fim da cadeia (`null`). Esse mecanismo é **herança prototípica**.

Propriedades herdadas não são propriedades próprias. `Object.hasOwn(obj, chave)` verifica se a propriedade pertence diretamente ao objeto. Evite adicionar métodos a protótipos nativos: isso pode causar conflitos com bibliotecas e futuras APIs.

## 3. Classes

`class` oferece sintaxe declarativa para criar funções construtoras e configurar a herança prototípica. Métodos de instância ficam no protótipo da classe, em vez de serem recriados para cada instância. Classes devem ser instanciadas com `new`; seus corpos executam em modo estrito.

`extends` define uma relação de herança; `super()` chama o construtor da classe base. Campos privados com `#` têm acesso restrito à definição da classe. Classes não transformam JavaScript em uma linguagem com herança de classes tradicional independente de protótipos.

## 4. Composição e imutabilidade

Herança pode representar uma relação “é um”, mas hierarquias profundas acoplam subclasses à implementação da base. Composição combina objetos menores por delegação. Spread de objeto ajuda a criar uma cópia rasa sem alterar a referência original, mas não garante imutabilidade profunda.

## 5. Como falar na entrevista

**“Classes em JavaScript funcionam como em Java?”**
> “A sintaxe de `class` é familiar, mas o mecanismo subjacente é a cadeia de protótipos. Métodos de instância são associados ao protótipo, e `extends` configura essa relação. Também considero composição quando a hierarquia não expressa uma relação estável.”

## 6. Resumo

- Propriedades podem ser próprias ou herdadas pela cadeia de protótipos.
- A busca sobe a cadeia até encontrar a chave ou alcançar `null`.
- `class` e `extends` são sintaxe sobre o modelo prototípico.
- Métodos de instância ficam no protótipo; `#campo` é privado à classe.
- Spread/desestruturação de objetos não fazem cópia profunda.

## Termos desta aula
Objeto · propriedade própria · propriedade herdada · protótipo · cadeia de protótipos · classe · `extends` · `super` · campo privado · composição

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 05** e separadas por nível.

### Para aprofundar
[Herança e cadeia de protótipos — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain) · [Classes — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_classes)
