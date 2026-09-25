# Aula 07 — STL: containers, iterators e algorithms

> **Objetivo:** combinar containers, iterators e algoritmos padrão escolhendo contratos de invalidação e custo apropriados.

---

## 1. Containers

Containers como `std::vector`, `std::array`, `std::list`, `std::map` e `std::unordered_map` armazenam dados sob diferentes contratos. `vector` oferece acesso aleatório contíguo; inserções que realocam invalidam ponteiros/referências/iteradores. `map` mantém chaves ordenadas; `unordered_map` usa hash e não garante ordem de iteração ordenada.

Escolha pela operação e semântica necessária, não por uma alegação simplista de que uma estrutura é sempre mais rápida.

## 2. Iterators e algorithms

Iterators abstraem posições e faixas. Algorithms como `std::sort`, `std::find` e `std::transform` operam sobre faixas e iterator categories apropriadas. `std::sort` requer iteradores de acesso aleatório e ordenação estrita fraca do comparador.

Ranges (C++20) oferecem abstração de faixa e podem compor views lazy; view pode referenciar dados subjacentes, então lifetime continua importante.

## 3. Invalidar iteradores

Operações que inserem/removem podem invalidar iteradores conforme container e operação. Consulte o contrato do tipo e não retenha iterador/referência através de mutações que podem invalidá-los. Uma referência dangling é tão perigosa quanto ponteiro inválido.

## 4. Complexidade e alocação

Containers oferecem complexidades e garantias distintas, mas custo real depende de cache, alocação, comparador e distribuição de dados. Escolha a semântica adequada e meça no workload relevante.

## 5. Como falar na entrevista

**“Quando escolhe `vector` ou `list`?”**
> “`vector` é meu padrão para sequência contígua e acesso aleatório; inserções podem realocar e invalidar referências. `list` oferece estabilidade de iteradores em certas operações e inserção/removal local, mas perde localidade e acesso aleatório. Decido pelo padrão de operações e meço.”

## 6. Resumo

- Containers oferecem contratos diferentes de acesso, ordenação e invalidação.
- `vector` é contíguo e pode realocar; não retenha referências sem checar invalidação.
- Algorithms usam iterator ranges e exigem categorias/ordenações específicas.
- Views de ranges podem referenciar dados subjacentes; lifetime importa.
- Complexidade assintótica não substitui medição no workload.

## Termos desta aula
Container · `vector` · `map` · `unordered_map` · iterator · range · `std::sort` · view · invalidação · localidade · complexidade

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 07** e separadas por nível.

### Para aprofundar
[C++ draft — containers](https://eel.is/c++draft/containers) · [C++ draft — algorithms](https://eel.is/c++draft/algorithms)
