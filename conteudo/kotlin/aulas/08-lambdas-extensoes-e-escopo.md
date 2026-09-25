# Aula 08 — Lambdas, extensões e funções de escopo

> **Objetivo:** Lambdas são valores de função e podem capturar variáveis do contexto. Funções de extensão oferecem chamadas com receiver; sua resolução é estática segundo o tipo declarado do receptor.

## Conceito

Lambdas são valores de função e podem capturar variáveis do contexto. Funções de extensão oferecem chamadas com receiver; sua resolução é estática segundo o tipo declarado do receptor.

## Como funciona

let, run, with, apply e also são funções padrão de escopo com diferenças de receptor (this/it) e valor de retorno. Convenções idiomáticas ajudam, mas não mudam a semântica fundamental de escopo léxico.

## Regras e limites

Lambdas com receiver permitem DSLs, mas sobrecarga de escopos encadeados pode dificultar a leitura. Extensions não acessam membros privados e não substituem métodos de instância por despacho dinâmico.

## Como explicar

Escolha funções de escopo pelo valor retornado e nome do receptor; limite aninhamento para preservar legibilidade.

## Resumo

- Lambdas são valores de função e podem capturar variáveis do contexto. Funções de extensão oferecem chamadas com receiver; sua resolução é estática segundo o tipo declarado do receptor.
- Lambdas com receiver permitem DSLs, mas sobrecarga de escopos encadeados pode dificultar a leitura. Extensions não acessam membros privados e não substituem métodos de instância por despacho dinâmico.
- Escolha funções de escopo pelo valor retornado e nome do receptor; limite aninhamento para preservar legibilidade.

## Termos desta aula
Kotlin · lambdas, extensões e funções de escopo · compilador · plataforma

## Treine
Perguntas da **Aula 08**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Lambdas](https://kotlinlang.org/docs/lambdas.html) · [Extensions](https://kotlinlang.org/docs/extensions.html)
