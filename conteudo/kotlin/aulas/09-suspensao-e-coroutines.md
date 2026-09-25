# Aula 09 — Suspensão e coroutines

> **Objetivo:** suspend é um modificador da linguagem para declarar funções suspensíveis. Ele não cria sozinho uma coroutine nem oferece todas as APIs de agendamento; muitas funcionalidades usuais vêm da biblioteca kotlinx.coroutines.

## Conceito

suspend é um modificador da linguagem para declarar funções suspensíveis. Ele não cria sozinho uma coroutine nem oferece todas as APIs de agendamento; muitas funcionalidades usuais vêm da biblioteca kotlinx.coroutines.

## Como funciona

Coroutines podem suspender sem bloquear a thread em pontos preparados para suspensão. No JVM e Kotlin/Native, código concorrente executa em threads gerenciadas pelo sistema operacional; coroutines não significam automaticamente paralelismo.

## Regras e limites

CoroutineScope, launch, async, dispatchers, cancellation e structured concurrency pertencem às APIs da biblioteca kotlinx.coroutines quando usadas. async/await não são palavras-chave da linguagem Kotlin; async é uma função da biblioteca e await uma função suspensível.

## Como explicar

Separe o recurso da linguagem (suspend) da biblioteca escolhida. Explique se o trabalho está concorrente, paralelo ou apenas suspenso por I/O.

## Resumo

- suspend é um modificador da linguagem para declarar funções suspensíveis. Ele não cria sozinho uma coroutine nem oferece todas as APIs de agendamento; muitas funcionalidades usuais vêm da biblioteca kotlinx.coroutines.
- CoroutineScope, launch, async, dispatchers, cancellation e structured concurrency pertencem às APIs da biblioteca kotlinx.coroutines quando usadas. async/await não são palavras-chave da linguagem Kotlin; async é uma função da biblioteca e await uma função suspensível.
- Separe o recurso da linguagem (suspend) da biblioteca escolhida. Explique se o trabalho está concorrente, paralelo ou apenas suspenso por I/O.

## Termos desta aula
Kotlin · suspensão e coroutines · compilador · plataforma

## Treine
Perguntas da **Aula 09**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Coroutines: fundamentos](https://kotlinlang.org/docs/coroutines-basics.html) · [Guide oficial kotlinx.coroutines](https://kotlinlang.org/docs/coroutines-guide.html)
