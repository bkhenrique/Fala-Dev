# Aula 10 — Memória, concorrência e publicação

> **Objetivo:** O runtime .NET administra a memória de objetos gerenciados por garbage collection. Código unsafe, interoperabilidade nativa e recursos externos exigem contratos adicionais de vida útil e ownership.

## Conceito

O runtime .NET administra a memória de objetos gerenciados por garbage collection. Código unsafe, interoperabilidade nativa e recursos externos exigem contratos adicionais de vida útil e ownership.

## Como funciona

Task representa operações/resultados assíncronos. Threads e APIs paralelas atendem execução concorrente. Compartilhamento de estado mutável exige sincronização; lock coordena regiões entre threads que usam o mesmo objeto de bloqueio.

## Regras e limites

volatile tem garantias específicas e não torna operações compostas atômicas. Interlocked, lock, coleções concorrentes ou imutabilidade podem ser adequados conforme o contrato.

## Como explicar

Publicação framework-dependent, self-contained, trimming e AOT têm requisitos por target e plataforma. Registre SDK, framework e alvo de runtime usados.

## Resumo

- O runtime .NET administra a memória de objetos gerenciados por garbage collection. Código unsafe, interoperabilidade nativa e recursos externos exigem contratos adicionais de vida útil e ownership.
- volatile tem garantias específicas e não torna operações compostas atômicas. Interlocked, lock, coleções concorrentes ou imutabilidade podem ser adequados conforme o contrato.
- Publicação framework-dependent, self-contained, trimming e AOT têm requisitos por target e plataforma. Registre SDK, framework e alvo de runtime usados.

## Termos desta aula
C# · .NET · memória, concorrência e publicação

## Treine
Perguntas da **Aula 10**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Introdução ao .NET](https://learn.microsoft.com/en-us/dotnet/core/introduction) · [Threading](https://learn.microsoft.com/en-us/dotnet/standard/threading/)
