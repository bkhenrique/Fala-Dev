# Aula 05 — Interfaces, herança e polimorfismo

> **Objetivo:** Uma classe pode herdar de uma classe-base e implementar várias interfaces. Interfaces expressam contratos; a linguagem atual permite algumas implementações padrão, sujeitas às versões de linguagem e plataforma.

## Conceito

Uma classe pode herdar de uma classe-base e implementar várias interfaces. Interfaces expressam contratos; a linguagem atual permite algumas implementações padrão, sujeitas às versões de linguagem e plataforma.

## Como funciona

Membros virtual podem ser sobrescritos com override e despacho polimórfico. abstract exige implementação em tipo derivado concreto. new oculta um membro herdado, não é sobrescrita.

## Regras e limites

C# não oferece herança múltipla de classes. Composição e interfaces permitem combinar capacidades. Finalizadores executam em momento não determinístico e não substituem IDisposable.

## Como explicar

override substitui comportamento virtual; new oculta. Interfaces descrevem contratos, e composição frequentemente reduz acoplamento.

## Resumo

- Uma classe pode herdar de uma classe-base e implementar várias interfaces. Interfaces expressam contratos; a linguagem atual permite algumas implementações padrão, sujeitas às versões de linguagem e plataforma.
- C# não oferece herança múltipla de classes. Composição e interfaces permitem combinar capacidades. Finalizadores executam em momento não determinístico e não substituem IDisposable.
- override substitui comportamento virtual; new oculta. Interfaces descrevem contratos, e composição frequentemente reduz acoplamento.

## Termos desta aula
C# · .NET · interfaces, herança e polimorfismo

## Treine
Perguntas da **Aula 05**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Classes](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/classes) · [Interfaces](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/interfaces)
