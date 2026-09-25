# Aula 10 — Interop, build e testes

> **Objetivo:** Kotlin/JVM interoperável com Java por meio de classes e bytecode JVM, mas convenções dos dois ecossistemas diferem. Platform types surgem quando nullability de APIs Java não é conhecida pelo compilador Kotlin.

## Conceito

Kotlin/JVM interoperável com Java por meio de classes e bytecode JVM, mas convenções dos dois ecossistemas diferem. Platform types surgem quando nullability de APIs Java não é conhecida pelo compilador Kotlin.

## Como funciona

Gradle é uma ferramenta de build comum, não parte da linguagem. Plugins e versões do Kotlin Gradle Plugin, JDK, Gradle e bibliotecas precisam ser compatíveis conforme documentação da combinação usada.

## Regras e limites

Testes podem usar kotlin.test e integrações específicas de plataforma. Anotações e modificadores de interop podem alterar nomes e visibilidade no bytecode; use-os quando consumidores Java precisarem de uma API previsível.

## Como explicar

Registre alvo, JDK, compilador, plugin de build e versões de dependências. Valide contratos nullable ao cruzar fronteiras Java e Kotlin.

## Resumo

- Kotlin/JVM interoperável com Java por meio de classes e bytecode JVM, mas convenções dos dois ecossistemas diferem. Platform types surgem quando nullability de APIs Java não é conhecida pelo compilador Kotlin.
- Testes podem usar kotlin.test e integrações específicas de plataforma. Anotações e modificadores de interop podem alterar nomes e visibilidade no bytecode; use-os quando consumidores Java precisarem de uma API previsível.
- Registre alvo, JDK, compilador, plugin de build e versões de dependências. Valide contratos nullable ao cruzar fronteiras Java e Kotlin.

## Termos desta aula
Kotlin · interop, build e testes · compilador · plataforma

## Treine
Perguntas da **Aula 10**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Interop Java](https://kotlinlang.org/docs/java-interop.html) · [Configurar Gradle](https://kotlinlang.org/docs/gradle.html)
