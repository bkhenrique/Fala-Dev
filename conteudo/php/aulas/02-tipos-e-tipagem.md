# Aula 02 — Sistema de tipos, coerção e recursos modernos

> **Objetivo:** explicar como o PHP combina tipagem dinâmica com declarações de tipo e como reduzir surpresas de coerção em APIs e regras de negócio.

---

## 1. O problema

PHP permite começar a programar sem declarar o tipo de cada variável. Essa flexibilidade acelera código pequeno, mas uma entrada como a string `"0"` pode se comportar como número ou booleano conforme a operação. Em aplicações maiores, tipos explícitos tornam contratos mais fáceis de ler e erros mais próximos da causa.

## 2. Tipo dinâmico e type juggling

Uma variável PHP pode apontar para valores de tipos diferentes durante a execução. O **type juggling** é a conversão implícita que o motor faz quando uma operação espera outro tipo. Comparações frouxas com `==` também podem converter operandos; em validação de entrada, igualdade estrita e normalização explícita evitam ambiguidades.

```php
$quantidade = "3";       // string recebida, por exemplo, de um formulário
$total = $quantidade * 2; // a operação pode convertê-la para número
```

O comportamento exato de coerções mudou em versões do PHP. Não dependa de conversões implícitas para autorizar, validar ou decidir dinheiro. Converta na fronteira e rejeite valores fora do contrato.

## 3. Declarações e strict_types

Parâmetros, retornos e propriedades podem ter declarações de tipo. Há tipos escalares, classes, `mixed`, `void`, `never`, tipos anuláveis, uniões e interseções. O tipo documenta a intenção e permite que o motor lance `TypeError` quando a chamada viola o contrato.

`declare(strict_types=1)` é uma diretiva por arquivo que torna estrita a coerção de argumentos escalares feita nas chamadas que partem daquele arquivo. Ela não transforma PHP numa linguagem estaticamente tipada: variáveis continuam dinâmicas, e entrada externa ainda precisa ser validada.

```php
declare(strict_types=1);

function aplicarDesconto(float $preco, int $percentual): float
{
    return $preco * (1 - $percentual / 100);
}
```

Em modo estrito, passar uma string numérica para um parâmetro `int` pode falhar em vez de convertê-la. O modo fraco ainda permite certas coerções escalares. Consistência no projeto importa mais que adicionar a diretiva a um arquivo isolado.

## 4. Uniões, interseções e tipos de retorno

Uma **união** (`A|B`) aceita uma alternativa; uma **interseção** (`A&B`) exige que o objeto implemente todos os tipos declarados. Tipos anuláveis permitem `null`, e `mixed` comunica que todos os valores são possíveis. `never` indica que a função não retorna normalmente, por exemplo porque sempre lança uma exceção.

Prefira o tipo mais estreito que represente o contrato. `mixed` pode ser honesto na borda de uma biblioteca, mas espalhado pelo domínio adia erros para runtime. O PHP também verifica compatibilidade de assinatura em interfaces e herança, respeitando regras de variância.

## 5. Enums para conjuntos fechados

Enums representam um conjunto finito de alternativas nomeadas. Um enum puro tem casos sem valor escalar; um enum respaldado (`string` ou `int`) associa um valor estável para persistência ou integração.

```php
enum StatusPedido: string
{
    case Pendente = 'pending';
    case Pago = 'paid';
    case Cancelado = 'cancelled';
}
```

O código interno usa `StatusPedido::Pago`; o valor escalar pode aparecer no banco ou JSON. Isso evita espalhar strings soltas, mas mudanças no valor persistido exigem migração compatível.

## 6. Readonly e imutabilidade

Uma propriedade `readonly` pode ser inicializada uma vez e depois não pode receber outra atribuição. Ela precisa de tipo. Propriedades readonly ajudam a modelar dados que não mudam após construção; não tornam automaticamente imutáveis objetos guardados dentro delas.

Uma classe `readonly` declara propriedades readonly por padrão. Escolha esse recurso quando a semântica do objeto é valor imutável, como um identificador ou resultado de cálculo. Para entidades que mudam durante o ciclo de vida, readonly pode tornar o modelo artificial.

## 7. Validação não é tipagem

Type hints verificam compatibilidade no limite da chamada. Eles não garantem que uma string seja um e-mail válido, que um número esteja num intervalo permitido ou que o usuário possa alterar determinado campo.

A fronteira HTTP converte texto em tipos esperados e valida regras de formato e negócio. Depois disso, tipos explícitos mantêm o contrato entre camadas. A tipagem estática de PHPStan ou Psalm acrescenta análise antes de executar, inferindo tipos e sinalizando caminhos suspeitos.

## 8. Como falar na entrevista

**“PHP é fracamente tipado?”**

> “PHP é dinamicamente tipado e permite coerção em algumas operações, mas tem declarações de tipo cada vez mais expressivas. Eu uso parâmetros e retornos tipados, strict_types de forma consistente e valido a entrada externa na fronteira. Tipagem ajuda a expressar contratos, mas não substitui validação de domínio nem autorização.”

## 9. Resumo

- Tipagem dinâmica permite mudar o tipo do valor; type juggling converte implicitamente em algumas operações.
- Tipos de parâmetro, retorno e propriedade tornam contratos explícitos; strict_types controla coerção escalar nas chamadas do arquivo.
- Uniões, interseções, enums e `never` expressam estados válidos com mais precisão.
- Readonly impede reatribuição da propriedade, mas não congela o objeto referenciado.
- Validação de formato, regra de negócio e permissão continua necessária.

## Termos desta aula
Type juggling · strict_types · tipo escalar · união · interseção · mixed · never · enum respaldado · readonly · PHPStan · Psalm

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 02** e separadas por nível.

### Para aprofundar
[Declarações de tipo no manual do PHP](https://www.php.net/types.declarations) · [Propriedades](https://www.php.net/manual/en/language.oop5.properties.php)
