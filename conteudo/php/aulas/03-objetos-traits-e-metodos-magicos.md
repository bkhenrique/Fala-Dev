# Aula 03 — Orientação a objetos, traits e late static binding

> **Objetivo:** explicar os mecanismos de orientação a objetos do PHP e escolher entre composição, herança, interfaces e traits sem criar hierarquias frágeis.

---

## 1. O problema

Classes ajudam a agrupar estado e comportamento, mas herança profunda acopla subclasses à implementação dos pais. PHP oferece interfaces, composição e traits para resolver problemas diferentes; eles não são opções equivalentes.

## 2. Classe, objeto e encapsulamento

Uma **classe** define propriedades e métodos; um **objeto** é uma instância em runtime. Construtores estabelecem invariantes, propriedades tipadas documentam o estado e visibilidade (`public`, `protected`, `private`) controla o acesso.

Encapsular não é esconder tudo. É oferecer operações que preservam as regras do objeto em vez de permitir que qualquer chamador escreva qualquer valor em qualquer momento. Um método `confirmar()` pode validar uma transição de estado; tornar `$status` público espalha essa regra por todo o código.

## 3. Interfaces, classes abstratas e composição

Uma **interface** define um contrato que implementações distintas podem cumprir. Uma classe abstrata pode fornecer comportamento e estado comum, além de deixar métodos abstratos para subclasses. Use interface para capacidades substituíveis; use herança quando há uma relação real de especialização e comportamento compartilhado estável.

Na **composição**, um objeto delega trabalho a outros objetos. Ela permite trocar uma política ou colaborador sem herdar toda a hierarquia. Em código de aplicação, composição e injeção de dependência costumam ser mais fáceis de evoluir que cadeias de subclasses.

## 4. Traits: reutilização horizontal

Uma **trait** injeta métodos e propriedades numa classe durante a composição do tipo. Não é um objeto, não pode ser instanciada por si e não cria uma relação de subtipagem. É útil para compartilhar um comportamento pequeno entre classes de hierarquias diferentes, como uma convenção de serialização.

```php
trait TemIdentificador
{
    public function chave(): string
    {
        return static::class . ':' . $this->id;
    }
}
```

Quando duas traits definem o mesmo método, a classe precisa resolver o conflito com `insteadof` e pode dar outro nome com `as`. Traits reduzem duplicação, mas muitas traits grandes escondem dependências e criam uma classe difícil de entender.

## 5. self, parent e static

`self::` aponta para a classe em que o método foi definido. `parent::` chama a implementação da classe pai. `static::` usa **late static binding** e aponta para a classe concreta que iniciou a chamada.

Essa diferença aparece em métodos estáticos de fábrica e hierarquias que permitem subclasses. `new self()` cria a classe base; `new static()` respeita o tipo derivado. Evite métodos estáticos como substituto para injeção quando o comportamento precisa variar por ambiente ou ser testado com facilidade.

```php
class Registro
{
    public static function criar(): static
    {
        return new static();
    }
}
```

## 6. Métodos mágicos

Métodos com nomes reservados, como `__construct`, `__toString`, `__get` e `__call`, são invocados pelo motor em situações específicas. Alguns adaptam conversão, inicialização ou acesso a propriedades. Eles podem fazer uma API parecer simples, mas ocultar trabalho e erros.

`__get` e `__set` podem esconder nomes inválidos ou consultas inesperadas; `__call` pode disfarçar erro de digitação. Use magia quando ela implementa uma convenção clara, documentada e previsível — não para evitar declarar a interface pública da classe.

## 7. Herança, polimorfismo e Liskov

**Polimorfismo** permite tratar implementações diferentes através do mesmo contrato. O princípio de substituição de Liskov pede que uma implementação possa ocupar o lugar da abstração sem quebrar as expectativas do chamador.

Subclasse não deve exigir pré-condições mais fortes nem enfraquecer resultados prometidos pelo pai. Se subclasses precisam de muitos `instanceof`, override condicional ou método que lança “não suportado”, a abstração talvez esteja mal definida.

## 8. Como falar na entrevista

**“Quando você usaria trait em PHP?”**

> “Trait é um mecanismo de reutilização horizontal: injeta métodos e estado na classe que a usa, sem criar herança entre tipos. Eu a usaria para comportamento pequeno e coeso compartilhado entre hierarquias independentes. Se o comportamento precisa ser substituível, prefiro uma interface com composição; muitas traits também podem esconder dependências.”

## 9. Resumo

- Classe define objetos; interfaces definem contratos; composição conecta colaboradores.
- Herança modela especialização e polimorfismo, mas hierarquias profundas geram acoplamento.
- Trait compartilha comportamento sem representar um objeto ou subtipo.
- `self::` usa a classe de definição; `static::` usa a classe concreta chamada.
- Métodos mágicos são úteis com convenção clara, mas podem ocultar erros e efeitos.

## Termos desta aula
Classe · objeto · encapsulamento · interface · classe abstrata · composição · trait · late static binding · método mágico · polimorfismo · Liskov

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 03** e separadas por nível.

### Para aprofundar
[Traits no manual do PHP](https://www.php.net/manual/en/language.oop5.traits.php) · [Late static bindings](https://www.php.net/manual/en/language.oop5.late-static-bindings.php)
