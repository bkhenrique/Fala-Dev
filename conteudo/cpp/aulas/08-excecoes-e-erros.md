# Aula 08 — Exceções e tratamento de erros

> **Objetivo:** propagar falhas com exceções e comparar essa estratégia com tipos de resultado e contratos de erro.

---

## 1. Exceções

`throw` propaga uma exceção até um `catch` compatível. Durante unwinding, destrutores de objetos automáticos construídos desde o ponto de lançamento são chamados, o que torna RAII central para cleanup. Um destrutor não deve lançar exceção durante unwinding; isso leva a `std::terminate`.

## 2. Garantias de exceção

Operação sem falha pode oferecer garantias diferentes. Garantia básica mantém invariantes e não vaza recursos; garantia forte deixa estado inalterado em falha; garantia no-throw promete não lançar. APIs devem documentar a garantia real em vez de presumir que qualquer operação é transacional.

## 3. Alternativas de resultado

`std::optional<T>` (C++17) modela presença/ausência sem necessariamente explicar erro. `std::expected<T, E>` (C++23) representa sucesso ou erro tipado. Códigos de retorno também são válidos em APIs C-like. A escolha depende de frequência do erro, contrato público e convenções do projeto.

## 4. Exceções e performance

Não conclua que `throw` é sempre lento ou sempre grátis: custos dependem da implementação e do caminho (lançar/capturar versus caminho sem exceção). Não use exceções para fluxo normal frequente sem considerar contrato e medidas.

## 5. Como falar na entrevista

**“Como escolher entre exceção e `expected`?”**
> “Uso exceções para falhas que interrompem operação e podem ser tratadas em camadas superiores; uso resultado tipado quando erro faz parte do retorno normal e precisa ser inspecionado localmente. Considero versão, API e custo medido.”

## 6. Resumo

- `throw` propaga erro; stack unwinding destrói objetos automáticos.
- RAII realiza cleanup em unwinding.
- Destrutor não deve lançar durante unwinding.
- `optional` representa presença/ausência; `expected` C++23 representa sucesso ou erro tipado.
- Defina a estratégia e garantias da API; não generalize custos de exceção.

## Termos desta aula
Exceção · `throw` · `catch` · unwinding · `std::terminate` · garantia básica · garantia forte · `noexcept` · `optional` · `expected`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 08** e separadas por nível.

### Para aprofundar
[C++ draft — exceptions](https://eel.is/c++draft/except) · [C++ draft — optional](https://eel.is/c++draft/optional) · [C++ draft — expected](https://eel.is/c++draft/expected)
