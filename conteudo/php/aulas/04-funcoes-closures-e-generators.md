# Aula 04 — Funções, closures e generators

> **Objetivo:** explicar funções de primeira classe, captura de variáveis e generators, e escolher quando um fluxo preguiçoso é melhor que uma coleção em memória.

---

## 1. Funções também podem ser valores

Uma função tem parâmetros, retorno e contrato. Em PHP, funções nomeadas convivem com funções anônimas e **closures**, que podem ser passadas como valores para `array_map`, callbacks de eventos ou estratégias de ordenação.

Parâmetros nomeados tornam chamadas extensas legíveis, enquanto variádicos (`...$itens`) recebem uma quantidade variável de argumentos. Use ambos com moderação: uma assinatura clara continua melhor que uma chamada ambígua com muitos argumentos opcionais.

## 2. Closure e escopo

Uma closure pode capturar variáveis locais com `use`. Por valor, captura o valor existente ao criar a closure; por referência, compartilha a variável que pode mudar. Arrow functions capturam automaticamente variáveis externas por valor e têm uma expressão como corpo.

```php
$multiplicador = 3;
$triplicar = fn (int $valor): int => $valor * $multiplicador;

$prefixo = 'pedido-';
$formatar = function (int $id) use ($prefixo): string {
    return $prefixo . $id;
};
```

Uma closure `static` não recebe `$this` implicitamente. Isso evita reter o objeto atual quando a função é armazenada por mais tempo do que o esperado. Captura por referência é poderosa, mas pode deixar claro menos sobre quando o estado muda.

## 3. Callable e composição

Um **callable** é qualquer valor que possa ser chamado: closure, nome de função, método em array ou objeto invocável. O tipo `callable` é flexível; `Closure` exige uma closure concreta. APIs podem aceitar callbacks para personalizar um passo sem acoplar a implementação à política.

Com callbacks, priorize nome de função e funções pequenas quando o comportamento é importante para o domínio. Cadeias extensas de callbacks anônimos podem dificultar depuração e stack traces. Uma classe dedicada costuma ser mais clara quando a estratégia tem dependências ou estado.

## 4. Iterator e avaliação preguiçosa

Uma coleção materializada guarda todos os itens ao mesmo tempo. Um iterador entrega o próximo item quando solicitado. A avaliação **preguiçosa** pode reduzir memória quando a origem é grande ou produzida incrementalmente.

Um `Generator` é um iterador criado ao chamar uma função que contém `yield`. A função pausa em cada `yield` e continua quando o consumidor pede o próximo valor. Ela não constrói uma lista completa de resultados antes de começar a entregar.

```php
function linhasValidas(iterable $linhas): Generator
{
    foreach ($linhas as $linha) {
        if (trim($linha) !== '') {
            yield trim($linha);
        }
    }
}
```

## 5. yield, chaves e yield from

`yield $valor` gera um item; `yield $chave => $valor` preserva uma chave. A chave pode ser substituída quando o valor é combinado em outra estrutura, então não presuma que todo generator produza índices consecutivos.

`yield from $iteravel` delega a outro generator ou iterável e pode encaminhar seu retorno final. Isso facilita separar etapas de um pipeline, mas não torna uma fonte não iterável ou bloqueante automaticamente assíncrona.

## 6. Generators não são corrotinas mágicas

Um generator economiza memória quando os consumidores processam os itens aos poucos, como leitura de arquivo grande ou exportação. Se o consumidor converte tudo para array, o ganho desaparece. Se a produção precisa buscar dados, cada `yield` pode ainda fazer trabalho síncrono.

Generators do PHP também podem receber valores com `send()` e encerrar com `return`, mas esses recursos avançados não são necessários para a maioria das iterações. Fibers, introduzidas no PHP 8.1, dão primitivas de suspensão cooperativa; não são threads nem tornam I/O bloqueante automaticamente assíncrono.

## 7. Erros comuns

- Capturar variável por referência e modificá-la em momentos diferentes da execução.
- Criar callback que fecha sobre um objeto grande e prolonga sua vida sem necessidade.
- Esperar que generator seja reiniciável: normalmente é um fluxo que avança uma vez.
- Usar `yield` para esconder dependência de rede bloqueante e acreditar que houve concorrência.
- Devolver uma closure sem documentar entradas, retorno e efeitos colaterais.

## 8. Como falar na entrevista

**“Quando um generator é melhor que retornar um array?”**

> “Quando posso produzir e consumir os elementos incrementalmente, sem precisar manter a coleção inteira na memória. Um generator pausa em `yield` e continua quando o consumidor solicita o próximo item. Isso reduz pico de memória, mas não deixa o trabalho paralelo nem torna uma operação de I/O bloqueante assíncrona.”

## 9. Resumo

- Closures podem capturar variáveis; arrow functions capturam automaticamente por valor.
- `callable` descreve qualquer valor chamável; uma estratégia complexa pode merecer uma classe.
- Generator com `yield` produz itens sob demanda e implementa a interface de iteração.
- `yield from` delega um fluxo; materializar o resultado de volta em array consome memória.
- Fiber permite suspensão cooperativa, não paralelismo ou I/O assíncrono automático.

## Termos desta aula
Closure · arrow function · callable · variádico · Iterator · Generator · yield · avaliação preguiçosa · Fiber

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 04** e separadas por nível.

### Para aprofundar
[Generators no manual do PHP](https://www.php.net/manual/en/language.generators.overview.php) · [Closures](https://www.php.net/manual/en/class.closure.php)
