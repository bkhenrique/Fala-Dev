# Aula 06 — Generics, coleções e LINQ

> **Objetivo:** Generics parametrizam tipos e métodos, preservando verificação estática. Coleções .NET oferecem contratos como IEnumerable, ICollection e IReadOnlyList, além de implementações concretas.

## Conceito

Generics parametrizam tipos e métodos, preservando verificação estática. Coleções .NET oferecem contratos como IEnumerable, ICollection e IReadOnlyList, além de implementações concretas.

## Como funciona

LINQ define operadores de consulta sobre sequências. Muitos operadores de IEnumerable usam execução adiada até a enumeração; ToList materializa resultados. IQueryable representa uma árvore de expressão que um provedor pode traduzir.

## Regras e limites

IReadOnlyList restringe operações expostas, mas não garante que a coleção interna seja imutável. IQueryable não é apenas uma coleção em memória com outra sintaxe: depende de provedor.

## Como explicar

Verifique quando a consulta será executada e se ela pode ser repetida. Analise origem, materialização e provedor antes de afirmar que uma expressão consultará SQL ou memória.

## Resumo

- Generics parametrizam tipos e métodos, preservando verificação estática. Coleções .NET oferecem contratos como IEnumerable, ICollection e IReadOnlyList, além de implementações concretas.
- IReadOnlyList restringe operações expostas, mas não garante que a coleção interna seja imutável. IQueryable não é apenas uma coleção em memória com outra sintaxe: depende de provedor.
- Verifique quando a consulta será executada e se ela pode ser repetida. Analise origem, materialização e provedor antes de afirmar que uma expressão consultará SQL ou memória.

## Termos desta aula
C# · .NET · generics, coleções e linq

## Treine
Perguntas da **Aula 06**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Generics](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics) · [LINQ](https://learn.microsoft.com/en-us/dotnet/csharp/linq/)
