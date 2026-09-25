# Aula 10 — Concorrência e modelo de memória

> **Objetivo:** explicar data races, sincronização e atomics no modelo de memória C++.

---

## 1. Threads padrão

`std::thread` cria fluxo de execução concorrente; C++20 também fornece `std::jthread`, que pede stop e faz join no destrutor conforme seu contrato. Thread joinable precisa ser unida ou destacada antes de seu destrutor; deixar `std::thread` joinable no destrutor chama `std::terminate`.

## 2. Data race

Acessos conflitantes não atômicos ao mesmo objeto por threads, sem relação *happens-before* e com ao menos uma escrita, causam comportamento indefinido. Proteger com mutex, usar atomics com ordenação adequada ou evitar estado compartilhado são estratégias possíveis.

## 3. Atomics e ordenação

`std::atomic<T>` fornece operações atômicas para tipos permitidos. `memory_order_seq_cst` oferece ordem sequencial consistente entre operações sequencialmente consistentes; ordens mais fracas permitem otimizações, mas exigem prova cuidadosa de sincronização e visibilidade.

Atomicidade de um campo não torna atômica uma invariável que envolve vários campos. Um mutex pode expressar essa proteção com mais clareza.

## 4. Compartilhamento e cancelamento

Concorrência acrescenta riscos de deadlock, race e lifetime. Associe lifetime de thread ao dono e comunique cancelamento/encerramento com protocolo. Evite referências a objetos que possam ser destruídos antes do uso concorrente.

## 5. Como falar na entrevista

**“`std::atomic` substitui mutex?”**
> “Para um estado independente simples, atomics podem bastar, se a ordem de memória estiver correta. Para uma invariante que abrange vários campos ou operações, mutex costuma ser uma forma mais clara de proteger o conjunto.”

## 6. Resumo

- Threads precisam ser unidas/destacadas conforme seu contrato.
- Data race não atômica sem happens-before é UB.
- Atomics oferecem operações e ordenações; memory ordering fraca exige análise formal.
- Um atomic isolado não protege invariantes compostas.
- Concorrência também exige lifetime e cancelamento bem definidos.

## Termos desta aula
`std::thread` · `std::jthread` · join · data race · happens-before · atomic · `memory_order` · mutex · deadlock · cancelamento

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 10** e separadas por nível.

### Para aprofundar
[C++ draft — threads](https://eel.is/c++draft/thread) · [C++ draft — atomics](https://eel.is/c++draft/atomics)
