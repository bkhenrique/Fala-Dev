# Aula 08 — Exceções e gerenciamento de recursos

> **Objetivo:** try, catch e finally estruturam propagação e tratamento de exceções. Capturar falhas genéricas sem capacidade de tratá-las pode ocultar problemas. throw sem argumento dentro de catch relança preservando contexto.

## Conceito

try, catch e finally estruturam propagação e tratamento de exceções. Capturar falhas genéricas sem capacidade de tratá-las pode ocultar problemas. throw sem argumento dentro de catch relança preservando contexto.

## Como funciona

using e await using chamam Dispose ou DisposeAsync ao sair do escopo, inclusive em caso de exceção. IDisposable e IAsyncDisposable formalizam liberação determinística de recursos.

## Regras e limites

Garbage collection recupera memória gerenciada, mas não determina quando handles, arquivos ou conexões externas serão liberados. Finalizadores são não determinísticos e não substituem Dispose.

## Como explicar

Defina claramente quem possui e libera cada recurso. Use Dispose para recursos externos e GC para recuperação de memória gerenciada inacessível.

## Resumo

- try, catch e finally estruturam propagação e tratamento de exceções. Capturar falhas genéricas sem capacidade de tratá-las pode ocultar problemas. throw sem argumento dentro de catch relança preservando contexto.
- Garbage collection recupera memória gerenciada, mas não determina quando handles, arquivos ou conexões externas serão liberados. Finalizadores são não determinísticos e não substituem Dispose.
- Defina claramente quem possui e libera cada recurso. Use Dispose para recursos externos e GC para recuperação de memória gerenciada inacessível.

## Termos desta aula
C# · .NET · exceções e gerenciamento de recursos

## Treine
Perguntas da **Aula 08**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Exceções](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/exceptions/) · [Implementar Dispose](https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/implementing-dispose)
