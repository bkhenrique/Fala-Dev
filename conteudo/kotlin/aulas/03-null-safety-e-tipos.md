# Aula 03 — Null safety e tipos

> **Objetivo:** Kotlin distingue tipos não nulos, como String, e anuláveis, como String?. O compilador exige tratamento explícito antes de usar uma referência anulável como não nula.

## Conceito

Kotlin distingue tipos não nulos, como String, e anuláveis, como String?. O compilador exige tratamento explícito antes de usar uma referência anulável como não nula.

## Como funciona

Operador seguro ?. acessa somente quando o receptor não é nulo; operador Elvis ?: fornece alternativa; !! força uma chamada e pode lançar NullPointerException. A análise de fluxo reconhece verificações e certos padrões de atribuição estável.

## Regras e limites

Interop com Java pode produzir platform types cujo nullability o compilador não consegue garantir completamente. Generics e APIs externas também têm limites de análise; null safety reduz riscos, mas não elimina todas as exceções possíveis.

## Como explicar

Modele ausência no tipo sempre que possível e valide nas fronteiras Java, rede, banco e reflexão. Evite !! quando um tratamento explícito comunica melhor o contrato.

## Resumo

- Kotlin distingue tipos não nulos, como String, e anuláveis, como String?. O compilador exige tratamento explícito antes de usar uma referência anulável como não nula.
- Interop com Java pode produzir platform types cujo nullability o compilador não consegue garantir completamente. Generics e APIs externas também têm limites de análise; null safety reduz riscos, mas não elimina todas as exceções possíveis.
- Modele ausência no tipo sempre que possível e valide nas fronteiras Java, rede, banco e reflexão. Evite !! quando um tratamento explícito comunica melhor o contrato.

## Termos desta aula
Kotlin · null safety e tipos · compilador · plataforma

## Treine
Perguntas da **Aula 03**: [nível 1](../perguntas/nivel-1.md), [nível 2](../perguntas/nivel-2.md), [nível 3](../perguntas/nivel-3.md).

### Fontes oficiais
[Null safety](https://kotlinlang.org/docs/null-safety.html) · [Interop Java](https://kotlinlang.org/docs/java-interop.html)
