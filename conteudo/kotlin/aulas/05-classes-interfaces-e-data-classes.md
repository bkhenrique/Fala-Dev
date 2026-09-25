# Aula 05 — Classes, interfaces e data classes

> **Objetivo:** Classes em Kotlin são finais por padrão; open permite herança e override marca membros sobrescritos. Interfaces declaram contratos e podem fornecer implementações de membros.

## Conceito

Classes em Kotlin são finais por padrão; open permite herança e override marca membros sobrescritos. Interfaces declaram contratos e podem fornecer implementações de membros.

## Como funciona

data class gera componentes e operações como equals, hashCode, toString e copy conforme propriedades do construtor primário. copy é raso: propriedades que referenciam objetos mutáveis continuam apontando para esses objetos.

## Regras e limites

sealed class e sealed interface restringem subclasses permitidas por regras de pacote/módulo e tornam certas hierarquias fechadas úteis para when exaustivo. object declara singleton; companion object associa membros à classe segundo o modelo Kotlin.

## Como explicar

Use data class para valor de dados, não como sinônimo de DTO sempre imutável. Herança é opt-in; composição e interfaces modelam contratos e capacidades.

## Resumo

- Classes em Kotlin são finais por padrão; open permite herança e override marca membros sobrescritos. Interfaces declaram contratos e podem fornecer implementações de membros.
- sealed class e sealed interface restringem subclasses permitidas por regras de pacote/módulo e tornam certas hierarquias fechadas úteis para when exaustivo. object declara singleton; companion object associa membros à classe segundo o modelo Kotlin.
- Use data class para valor de dados, não como sinônimo de DTO sempre imutável. Herança é opt-in; composição e interfaces modelam contratos e capacidades.

## Termos desta aula
Kotlin · classes, interfaces e data classes · compilador · plataforma

## Treine
Perguntas da **Aula 05**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Classes](https://kotlinlang.org/docs/classes.html) · [Data classes](https://kotlinlang.org/docs/data-classes.html)
