# Aula 02 — Variáveis, tipos e inferência

> **Objetivo:** val declara uma referência somente leitura após inicialização; var permite reatribuição. Inferência de tipo reduz anotações, mas o tipo continua definido estaticamente pelo compilador.

## Conceito

val declara uma referência somente leitura após inicialização; var permite reatribuição. Inferência de tipo reduz anotações, mas o tipo continua definido estaticamente pelo compilador.

## Como funciona

Kotlin tem tipos numéricos, booleanos, caracteres, strings, arrays e tipos definidos pelo usuário. Não há conversões numéricas implícitas gerais entre tipos numéricos; funções explícitas como toLong convertem.

## Regras e limites

val impede reatribuir a variável, mas não torna imutável um objeto mutável referenciado. Unit representa um único valor útil em funções sem resultado significativo; Nothing representa uma expressão que nunca termina normalmente.

## Como explicar

Use val como padrão quando o vínculo não precisa mudar. Diferencie imutabilidade da referência e imutabilidade profunda do objeto.

## Resumo

- val declara uma referência somente leitura após inicialização; var permite reatribuição. Inferência de tipo reduz anotações, mas o tipo continua definido estaticamente pelo compilador.
- val impede reatribuir a variável, mas não torna imutável um objeto mutável referenciado. Unit representa um único valor útil em funções sem resultado significativo; Nothing representa uma expressão que nunca termina normalmente.
- Use val como padrão quando o vínculo não precisa mudar. Diferencie imutabilidade da referência e imutabilidade profunda do objeto.

## Termos desta aula
Kotlin · variáveis, tipos e inferência · compilador · plataforma

## Treine
Perguntas da **Aula 02**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Tipos básicos](https://kotlinlang.org/docs/basic-types.html) · [Declarações](https://kotlinlang.org/docs/basic-syntax.html)
