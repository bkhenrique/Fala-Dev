# Aula 04 — Classes, records, structs e encapsulamento

> **Objetivo:** class declara um tipo de referência e struct um tipo de valor. Tipos podem agrupar estado e comportamento com campos, propriedades, métodos e construtores.

## Conceito

class declara um tipo de referência e struct um tipo de valor. Tipos podem agrupar estado e comportamento com campos, propriedades, métodos e construtores.

## Como funciona

record class e record struct pedem ao compilador membros sintetizados voltados a igualdade baseada em valores. Records não tornam objetos profundamente imutáveis: membros ou objetos referenciados ainda podem mudar.

## Regras e limites

Propriedades init restringem atribuição ao contexto de inicialização previsto pela linguagem. required exige inicialização em contextos verificados pelo compilador, mas não substitui validação de regras de negócio.

## Como explicar

Escolha classe ou struct considerando identidade, cópia, mutabilidade e tamanho. Encapsulamento deve proteger invariantes do tipo.

## Resumo

- class declara um tipo de referência e struct um tipo de valor. Tipos podem agrupar estado e comportamento com campos, propriedades, métodos e construtores.
- Propriedades init restringem atribuição ao contexto de inicialização previsto pela linguagem. required exige inicialização em contextos verificados pelo compilador, mas não substitui validação de regras de negócio.
- Escolha classe ou struct considerando identidade, cópia, mutabilidade e tamanho. Encapsulamento deve proteger invariantes do tipo.

## Termos desta aula
C# · .NET · classes, records, structs e encapsulamento

## Treine
Perguntas da **Aula 04**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Tipos C#](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/) · [Records](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/record)
