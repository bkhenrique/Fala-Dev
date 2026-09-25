# Aula 06 — Generics, variância e contratos

> **Objetivo:** Generics permitem parametrizar classes e funções. Em Kotlin, out declara covariância para produtores e in contravariância para consumidores, restringindo os usos válidos do parâmetro de tipo.

## Conceito

Generics permitem parametrizar classes e funções. Em Kotlin, out declara covariância para produtores e in contravariância para consumidores, restringindo os usos válidos do parâmetro de tipo.

## Como funciona

Restrições de tipo e where expressam contratos genéricos. Reified só é permitido em parâmetros de tipo de funções inline e disponibiliza informação de tipo no corpo conforme as regras do compilador; não elimina toda erasure ou limitações da plataforma.

## Regras e limites

No alvo JVM, type erasure afeta tipos genéricos em runtime. Declarações Kotlin multiplataforma devem considerar que detalhes de runtime e interop diferem entre alvos.

## Como explicar

Projete variância segundo o que a API produz e consome. Não prometa inspeção completa de tipo genérico em runtime no JVM.

## Resumo

- Generics permitem parametrizar classes e funções. Em Kotlin, out declara covariância para produtores e in contravariância para consumidores, restringindo os usos válidos do parâmetro de tipo.
- No alvo JVM, type erasure afeta tipos genéricos em runtime. Declarações Kotlin multiplataforma devem considerar que detalhes de runtime e interop diferem entre alvos.
- Projete variância segundo o que a API produz e consome. Não prometa inspeção completa de tipo genérico em runtime no JVM.

## Termos desta aula
Kotlin · generics, variância e contratos · compilador · plataforma

## Treine
Perguntas da **Aula 06**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Generics](https://kotlinlang.org/docs/generics.html) · [Funções inline](https://kotlinlang.org/docs/inline-functions.html)
