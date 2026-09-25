# Aula 04 — Funções, controle de fluxo e escopo

> **Objetivo:** Kotlin oferece funções nomeadas, locais, de extensão, lambdas e funções de ordem superior. if e when podem produzir valores; loops e intervalos expressam iteração.

## Conceito

Kotlin oferece funções nomeadas, locais, de extensão, lambdas e funções de ordem superior. if e when podem produzir valores; loops e intervalos expressam iteração.

## Como funciona

Parâmetros nomeados e valores padrão simplificam chamadas. Funções podem ser declaradas como inline para permitir expansão/otimizações sob regras específicas; isso tem implicações para código gerado e não deve ser usado automaticamente.

## Regras e limites

Escopo de nomes é lexical. Funções de extensão acrescentam sintaxe de chamada, mas são resolvidas estaticamente e não alteram a classe nem sobrescrevem membros virtuais.

## Como explicar

Avalie clareza, API gerada e alocação antes de usar inline. Extensões são utilitários de sintaxe, não métodos dinamicamente injetados.

## Resumo

- Kotlin oferece funções nomeadas, locais, de extensão, lambdas e funções de ordem superior. if e when podem produzir valores; loops e intervalos expressam iteração.
- Escopo de nomes é lexical. Funções de extensão acrescentam sintaxe de chamada, mas são resolvidas estaticamente e não alteram a classe nem sobrescrevem membros virtuais.
- Avalie clareza, API gerada e alocação antes de usar inline. Extensões são utilitários de sintaxe, não métodos dinamicamente injetados.

## Termos desta aula
Kotlin · funções, controle de fluxo e escopo · compilador · plataforma

## Treine
Perguntas da **Aula 04**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Funções](https://kotlinlang.org/docs/functions.html) · [Controle de fluxo](https://kotlinlang.org/docs/control-flow.html)
