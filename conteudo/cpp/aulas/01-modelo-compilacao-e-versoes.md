# Aula 01 — Modelo C++, compilação e versões

> **Objetivo:** situar o padrão C++, a implementação e o fluxo comum de tradução sem atribuir ao padrão detalhes da toolchain.

---

## 1. Padrão e implementação

C++ é definido por um padrão ISO/IEC. O padrão descreve linguagem abstrata, biblioteca padrão e comportamento observável; compilador, ABI, linker, sistema operacional e bibliotecas adicionais pertencem à implementação e ao ambiente. Extensões do compilador não são automaticamente padrão C++.

## 2. Versões e recursos

O padrão evolui em edições como C++17, C++20 e C++23. Recursos têm requisitos mínimos de versão e suporte que pode variar entre compiladores/librares. Configure explicitamente o padrão e confira suporte no ambiente-alvo; “moderno C++” não significa que todo compilador aceite cada recurso mais recente.

Esta trilha usa C++20 como base. `std::expected`, por exemplo, pertence à biblioteca padrão C++23, enquanto `std::optional` foi padronizado antes. Identificar a versão evita apresentar recursos recentes como universais.

## 3. Tradução e linking

Uma construção C++ normalmente pré-processa, compila unidades de tradução, gera arquivos objeto e vincula símbolos com outras unidades e bibliotecas. Templates frequentemente precisam de definições visíveis onde são instanciados; por isso implementações de templates costumam ficar em headers. O padrão não exige um executável ou sequência de ferramentas específica.

## 4. C++ e C

C++ compartilha sintaxe e compatibilidade com parte de C, mas não é simplesmente “C com classes”. São padrões e linguagens diferentes, com regras próprias de tipos, linkage, biblioteca e semântica. Código escrito em C pode não compilar como C++ sem adaptações.

## 5. Como falar na entrevista

**“C++20 funciona em qualquer compilador?”**
> “O padrão define C++20, mas suporte depende da versão do compilador e da biblioteca padrão. Também separo extensões de implementação do que é garantido pelo padrão e testo na toolchain de produção.”

## 6. Resumo

- Padrão define linguagem e biblioteca; toolchain e ABI dependem da implementação.
- Recursos disponíveis dependem da edição e do suporte da toolchain.
- Esta trilha usa C++20 e identifica recursos posteriores, como `std::expected` em C++23.
- Templates normalmente requerem definições visíveis durante instanciação.
- C++ não é simplesmente C com classes.

## Termos desta aula
C++ · padrão ISO · implementação · toolchain · unidade de tradução · linking · ABI · template · C++20 · C++23

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 01** e separadas por nível.

### Para aprofundar
[WG21 — C++ standards committee](https://www.open-std.org/jtc1/sc22/wg21/) · [C++ working draft](https://eel.is/c++draft/)
