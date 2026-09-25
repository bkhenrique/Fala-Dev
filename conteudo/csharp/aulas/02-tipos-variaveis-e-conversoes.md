# Aula 02 — Tipos, variáveis e conversões

> **Objetivo:** C# é estaticamente tipada: variáveis e expressões têm tipos verificados pelo compilador. var infere o tipo estático da expressão inicial; não torna a variável dinamicamente tipada.

## Conceito

C# é estaticamente tipada: variáveis e expressões têm tipos verificados pelo compilador. var infere o tipo estático da expressão inicial; não torna a variável dinamicamente tipada.

## Como funciona

Tipos de valor, como int, bool, struct e enum, têm semântica de valor. Tipos de referência, como class, arrays e string, permitem referenciar objetos. A distinção não é simplesmente stack contra heap: o local de armazenamento depende do contexto e da implementação.

## Regras e limites

Conversões implícitas e explícitas seguem regras da linguagem; conversões numéricas podem perder informação. Boxing converte um valor para object ou interface implementada; unboxing exige tipo compatível.

## Como explicar

A atribuição de um valor de referência copia a referência, não necessariamente o objeto. Valor/referência descreve semântica, não uma regra universal de localização na memória.

## Resumo

- C# é estaticamente tipada: variáveis e expressões têm tipos verificados pelo compilador. var infere o tipo estático da expressão inicial; não torna a variável dinamicamente tipada.
- Conversões implícitas e explícitas seguem regras da linguagem; conversões numéricas podem perder informação. Boxing converte um valor para object ou interface implementada; unboxing exige tipo compatível.
- A atribuição de um valor de referência copia a referência, não necessariamente o objeto. Valor/referência descreve semântica, não uma regra universal de localização na memória.

## Termos desta aula
C# · .NET · tipos, variáveis e conversões

## Treine
Perguntas da **Aula 02**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Sistema de tipos](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/) · [Conversões numéricas](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/numeric-conversions)
