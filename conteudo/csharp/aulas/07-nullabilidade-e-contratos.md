# Aula 07 — Nullabilidade e contratos

> **Objetivo:** Tipos de valor podem usar Nullable<T> (T?) para representar ausência. Anotações de tipos de referência, como string e string?, alimentam análise estática quando o contexto nullable está ativo.

## Conceito

Tipos de valor podem usar Nullable<T> (T?) para representar ausência. Anotações de tipos de referência, como string e string?, alimentam análise estática quando o contexto nullable está ativo.

## Como funciona

A análise do compilador acompanha estados possivelmente nulo em caminhos do programa. ?. acessa condicionalmente, ?? fornece fallback e ! suprime avisos sem validar o objeto em runtime.

## Regras e limites

Anotações de referência não criam tipos de runtime separados. Código legado, interoperabilidade e entradas externas ainda exigem validação efetiva.

## Como explicar

Não confunda T? em tipo de valor com a anotação nullable de referência. Avisos reduzem riscos, mas não provam ausência de NullReferenceException.

## Resumo

- Tipos de valor podem usar Nullable<T> (T?) para representar ausência. Anotações de tipos de referência, como string e string?, alimentam análise estática quando o contexto nullable está ativo.
- Anotações de referência não criam tipos de runtime separados. Código legado, interoperabilidade e entradas externas ainda exigem validação efetiva.
- Não confunda T? em tipo de valor com a anotação nullable de referência. Avisos reduzem riscos, mas não provam ausência de NullReferenceException.

## Termos desta aula
C# · .NET · nullabilidade e contratos

## Treine
Perguntas da **Aula 07**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Nullable reference types](https://learn.microsoft.com/en-us/dotnet/csharp/nullable-references) · [Especificação de tipos](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/types)
