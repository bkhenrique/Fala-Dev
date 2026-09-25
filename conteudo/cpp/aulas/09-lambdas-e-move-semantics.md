# Aula 09 — Lambdas, move semantics e callable objects

> **Objetivo:** entender closures de lambda, captura por valor/referência e transferência de recursos em C++.

---

## 1. Lambdas

Lambda expression cria um objeto closure cujo tipo é único e não nomeado. A lista de captura determina como nomes locais ficam disponíveis: por valor cria cópia; por referência mantém referência ao objeto original e exige que o lifetime dele exceda qualquer uso da closure.

`[=]` e `[&]` capturam variáveis locais conforme regras próprias e podem obscurecer lifetime. Prefira captura explícita em callbacks que possam escapar do escopo.

## 2. `std::function` e callable

Função, lambda e objeto com `operator()` são callables. Templates podem receber tipo concreto e evitar type erasure; `std::function` armazena callables com assinatura compatível, mas pode alocar e tem custo de indireção. Escolha conforme necessidade de armazenamento polimórfico e performance.

## 3. Move semantics

Move permite transferir recursos de um objeto para outro sem copiar o recurso custoso, se o tipo oferecer operação de move. `std::move` apenas converte a categoria da expressão; move constructor/assignment fazem a operação. Tipos padrão normalmente permanecem válidos após move, mas estado específico pode ficar não especificado.

## 4. Captura e retorno

Retornar lambda que captura variável local por referência cria dangling reference. Capture por valor ou organize lifetime compartilhado/externo conscientemente. `mutable` permite modificar as cópias capturadas por valor dentro do closure; não muda objetos originais capturados por referência.

## 5. Como falar na entrevista

**“Qual o risco de capturar por referência numa lambda assíncrona?”**
> “A lambda pode executar depois que a variável local saiu de escopo, deixando referência pendente. Verifico quando e onde o callback será executado e capturo por valor ou estendo o lifetime de forma explícita.”

## 6. Resumo

- Lambda cria closure object; captura define posse/acesso a variáveis externas.
- Captura por referência exige que o objeto sobreviva a todo uso da closure.
- `std::function` armazena callables por type erasure, com custos próprios.
- `std::move` habilita overloads de move; não move sozinho.
- Move pode transferir recursos e deixa estado de origem dependente do contrato.

## Termos desta aula
Lambda · closure object · captura por valor · captura por referência · `mutable` · callable · `std::function` · type erasure · move constructor · `std::move`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 09** e separadas por nível.

### Para aprofundar
[C++ draft — lambda expressions](https://eel.is/c++draft/expr.prim.lambda) · [C++ draft — move helpers](https://eel.is/c++draft/forward)
