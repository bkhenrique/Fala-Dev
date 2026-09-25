# Aula 09 — Delegates, eventos e programação assíncrona

> **Objetivo:** Delegate é um tipo que representa referências a métodos com assinatura compatível; lambdas podem produzir delegates. Eventos estruturam publicação e inscrição, restringindo como consumidores disparam notificações.

## Conceito

Delegate é um tipo que representa referências a métodos com assinatura compatível; lambdas podem produzir delegates. Eventos estruturam publicação e inscrição, restringindo como consumidores disparam notificações.

## Como funciona

async e await compõem operações awaitable, geralmente representadas por Task e Task<T>. A operação pode suspender enquanto espera I/O e continuar depois; async não cria, por si só, uma thread.

## Regras e limites

async void não pode ser aguardado pelo chamador e costuma ser reservado a handlers exigidos por APIs. CancellationToken comunica cancelamento cooperativo; não encerra à força a operação.

## Como explicar

Assincronismo e paralelismo são conceitos distintos. Propague cancelamento e prefira retornar Task para operações assíncronas aguardáveis.

## Resumo

- Delegate é um tipo que representa referências a métodos com assinatura compatível; lambdas podem produzir delegates. Eventos estruturam publicação e inscrição, restringindo como consumidores disparam notificações.
- async void não pode ser aguardado pelo chamador e costuma ser reservado a handlers exigidos por APIs. CancellationToken comunica cancelamento cooperativo; não encerra à força a operação.
- Assincronismo e paralelismo são conceitos distintos. Propague cancelamento e prefira retornar Task para operações assíncronas aguardáveis.

## Termos desta aula
C# · .NET · delegates, eventos e programação assíncrona

## Treine
Perguntas da **Aula 09**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Programação assíncrona](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/) · [Eventos](https://learn.microsoft.com/en-us/dotnet/csharp/events-overview)
