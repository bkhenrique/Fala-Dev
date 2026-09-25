# Aula 07 — Coleções, sequências e operações

> **Objetivo:** Kotlin diferencia interfaces read-only como List e interfaces mutáveis como MutableList. Read-only restringe operações pela referência, mas não prova imutabilidade da implementação nem impede mudanças por outra referência.

## Conceito

Kotlin diferencia interfaces read-only como List e interfaces mutáveis como MutableList. Read-only restringe operações pela referência, mas não prova imutabilidade da implementação nem impede mudanças por outra referência.

## Como funciona

Operações de coleção como map e filter normalmente produzem coleções resultantes. Sequence oferece pipeline lazy: transforma elementos à medida que são consumidos e pode reduzir coleções intermediárias em certas cadeias.

## Regras e limites

A avaliação lazy não é sempre mais rápida: para coleções pequenas ou operações simples, overhead pode superar benefícios. A ordem de operações altera custo e, em alguns casos, o número de avaliações.

## Como explicar

Escolha a API pelo contrato de mutação e pelo tamanho/uso dos dados. Meça antes de trocar coleções por Sequence por desempenho.

## Resumo

- Kotlin diferencia interfaces read-only como List e interfaces mutáveis como MutableList. Read-only restringe operações pela referência, mas não prova imutabilidade da implementação nem impede mudanças por outra referência.
- A avaliação lazy não é sempre mais rápida: para coleções pequenas ou operações simples, overhead pode superar benefícios. A ordem de operações altera custo e, em alguns casos, o número de avaliações.
- Escolha a API pelo contrato de mutação e pelo tamanho/uso dos dados. Meça antes de trocar coleções por Sequence por desempenho.

## Termos desta aula
Kotlin · coleções, sequências e operações · compilador · plataforma

## Treine
Perguntas da **Aula 07**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Coleções](https://kotlinlang.org/docs/collections-overview.html) · [Sequences](https://kotlinlang.org/docs/sequences.html)
