# Aula 05 — Arrays, iteráveis e SPL

> **Objetivo:** explicar por que o array PHP é versátil, quais custos essa versatilidade esconde e quando usar iteradores ou estruturas da SPL.

---

## 1. Um nome, várias formas

O `array` do PHP é uma estrutura ordenada que funciona como mapa de chaves e valores. As chaves podem ser inteiros ou strings, então o mesmo tipo representa uma lista sequencial, um mapa associativo ou uma combinação dos dois.

```php
$nomes = ['Ana', 'Bia'];
$pedido = ['id' => 42, 'itens' => $nomes];
```

Essa flexibilidade torna arrays convenientes para dados temporários e APIs que já trabalham com mapas. Também facilita estruturas ambíguas: uma função pode esperar lista ordenada e receber chaves esparsas ou misturadas.

## 2. Array não é vetor simples

Internamente, um array se comporta mais como uma tabela hash ordenada do que como um bloco compacto de elementos homogêneos. Isso dá acesso por chave e preserva ordem de inserção, mas pode usar mais memória que um vetor compacto de uma linguagem de baixo nível.

Ao remover um elemento, índices numéricos restantes não são necessariamente renumerados. `array_values()` cria uma sequência reindexada; `array_filter()` preserva chaves por padrão. Essa diferença causa bugs em JSON: um array com índices consecutivos pode serializar como lista, enquanto chaves esparsas podem serializar como objeto.

## 3. Copy-on-write

Atribuir um array grande a outra variável não exige necessariamente copiar imediatamente todos os elementos. O motor usa **copy-on-write**: compartilha a estrutura enquanto ninguém a altera e separa os dados quando uma das cópias muda.

Essa otimização torna passagem por valor prática, mas não é memória grátis. Mutar cópias grandes, manter muitas versões vivas ou construir arrays intermediários numa cadeia pode aumentar o pico de memória. Meça e processe fluxos grandes incrementalmente quando fizer sentido.

## 4. Operações de lista e mapa

Funções como `array_map`, `array_filter`, `array_reduce` e `array_column` deixam transformações declarativas. `foreach` continua uma escolha simples quando o fluxo tem ramificações ou produz efeitos. Não use `array_reduce` só para evitar um loop legível.

Para testar uma chave, `array_key_exists()` distingue ausência de chave de valor `null`; `isset()` retorna falso para chave ausente ou valor nulo. Escolha de acordo com o contrato.

## 5. iterable, Iterator e Traversable

O tipo `iterable` aceita array ou objeto que implemente `Traversable`. Isso permite que uma função de domínio percorra dados sem exigir que estejam todos em array. Um `Iterator` implementa o protocolo de avançar, verificar validade e obter chave/valor; um `IteratorAggregate` fornece o iterador.

Generators também são iteráveis. Em assinatura de função, `iterable` descreve o que pode ser percorrido, não garante que a coleção seja finita, indexada ou carregada em memória.

## 6. SPL: estruturas prontas

A **Standard PHP Library (SPL)** inclui iteradores e estruturas como `SplQueue`, `SplStack`, `SplPriorityQueue`, `SplObjectStorage` e `SplFixedArray`. São úteis quando a estrutura deixa explícita a regra de acesso: fila FIFO, pilha LIFO ou prioridade.

Nem toda estrutura SPL é mais rápida ou mais simples que array para o caso comum. Escolha pela semântica e meça antes de trocar uma representação usada em grande volume. A classe também comunica intenção ao próximo leitor.

## 7. Arrays na borda e objetos no domínio

Arrays associativos são práticos ao decodificar JSON, mapear linhas ou preparar uma resposta. No domínio, um array livre não informa quais chaves são obrigatórias nem quais estados são válidos. Objetos e value objects tipados podem tornar o contrato explícito.

Uma abordagem comum é validar o array na borda, convertê-lo para um objeto de entrada e só então aplicar regras de negócio. Na saída, um Resource ou serializador decide os campos expostos, evitando retornar estrutura interna sem intenção.

## 8. Como falar na entrevista

**“O que há de especial no array do PHP?”**

> “Ele é um mapa ordenado que pode funcionar como lista ou dicionário, com chaves inteiras e strings. Essa ergonomia tem custo de memória maior que um vetor compacto e permite estruturas inconsistentes. Eu uso arrays na transformação e na borda; para contratos de domínio, prefiro tipos explícitos. Para fluxo grande, considero iteradores e generators.”

## 9. Resumo

- Array PHP é mapa ordenado; pode representar lista, mapa e estruturas mistas.
- Chaves esparsas afetam reindexação e serialização JSON.
- Copy-on-write adia cópias até a mutação, mas arrays intermediários ainda custam memória.
- `iterable` aceita arrays e objetos iteráveis; não promete finitude ou materialização.
- SPL fornece estruturas com semântica de fila, pilha e prioridade.

## Termos desta aula
Array ordenado · mapa associativo · copy-on-write · iterable · Traversable · Iterator · IteratorAggregate · SPL · SplQueue · SplPriorityQueue

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 05** e separadas por nível.

### Para aprofundar
[Arrays no manual do PHP](https://www.php.net/manual/en/language.types.array.php) · [SPL](https://www.php.net/manual/en/book.spl.php)
