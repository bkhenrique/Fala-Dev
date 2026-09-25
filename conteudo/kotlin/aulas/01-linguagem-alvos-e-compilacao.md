# Aula 01 — Kotlin, alvos e compilação

> **Objetivo:** Kotlin é uma linguagem com múltiplos alvos. Kotlin/JVM compila para bytecode da JVM; Kotlin/JS e Kotlin/Native têm toolchains e ambientes de execução distintos. Kotlin Multiplatform permite compartilhar código entre alvos, conforme suporte das APIs.

## Conceito

Kotlin é uma linguagem com múltiplos alvos. Kotlin/JVM compila para bytecode da JVM; Kotlin/JS e Kotlin/Native têm toolchains e ambientes de execução distintos. Kotlin Multiplatform permite compartilhar código entre alvos, conforme suporte das APIs.

## Como funciona

A sintaxe e semântica da linguagem não devem ser confundidas com APIs específicas de uma plataforma. Código comum multiplataforma precisa limitar-se ao conjunto de APIs disponível nos alvos declarados ou separar implementações específicas.

## Regras e limites

JVM não é sinônimo de Kotlin. Bibliotecas Java são acessíveis em Kotlin/JVM, mas interop pode expor diferenças como tipos de plataforma e nullability.

## Como explicar

Explique qual alvo e toolchain estão em uso. A portabilidade depende do código, das dependências e dos recursos compartilhados.

## Resumo

- Kotlin é uma linguagem com múltiplos alvos. Kotlin/JVM compila para bytecode da JVM; Kotlin/JS e Kotlin/Native têm toolchains e ambientes de execução distintos. Kotlin Multiplatform permite compartilhar código entre alvos, conforme suporte das APIs.
- JVM não é sinônimo de Kotlin. Bibliotecas Java são acessíveis em Kotlin/JVM, mas interop pode expor diferenças como tipos de plataforma e nullability.
- Explique qual alvo e toolchain estão em uso. A portabilidade depende do código, das dependências e dos recursos compartilhados.

## Termos desta aula
Kotlin · kotlin, alvos e compilação · compilador · plataforma

## Treine
Perguntas da **Aula 01**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Tour oficial Kotlin](https://kotlinlang.org/docs/kotlin-tour-welcome.html) · [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform.html)
