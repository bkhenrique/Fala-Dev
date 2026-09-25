# Aula 02 — Tipos, referências e value categories

> **Objetivo:** diferenciar ponteiros, referências e value categories e explicar como esses conceitos afetam cópia e lifetime.

---

## 1. Tipos e `const`

C++ tem tipos fundamentais, classes, arrays, enums, ponteiros e referências. `const` qualifica um tipo e impede certas modificações através daquela expressão; não torna automaticamente imutáveis objetos alcançados por ponteiros internos nem garante que não exista outro alias mutável.

## 2. Ponteiro e referência

Ponteiro é um objeto que pode guardar endereço, ser nulo ou ser reatribuído. Referência é um alias que precisa ser inicializado e não pode ser reseat para outro objeto depois da inicialização. Referências não são ponteiros nulos válidos; APIs devem evitar dangling references.

Use referência para parâmetro obrigatório não nulo conforme contrato; ponteiro pode comunicar ausência opcional ou navegação de endereço. Essas são convenções de API, não validação automática de pré-condições.

## 3. Value categories

Expressões têm categorias como lvalue, xvalue e prvalue. Simplificando: lvalue identifica objeto persistente; xvalue identifica objeto cujo recurso pode ser reutilizado; prvalue produz valor temporário. Essas categorias influenciam qual overload é escolhido e se move/cópia é possível.

## 4. `std::move`

`std::move(x)` não move por si só: faz cast que permite tratar a expressão como rvalue para seleção de overload. O move constructor/assignment selecionado define o que acontece. Depois de mover, o objeto continua válido, mas seu valor geralmente é não especificado salvo contrato da classe.

## 5. Como falar na entrevista

**“`std::move` move o objeto?”**
> “Não. Ele converte a categoria da expressão para permitir selecionar operações de move. O movimento ocorre no construtor ou atribuição escolhidos; o objeto de origem continua válido, mas pode ter estado diferente.”

## 6. Resumo

- `const` restringe modificações por uma expressão, não a todos os aliases.
- Ponteiro pode ser nulo/reatribuído; referência é alias que deve ser inicializado.
- Value category participa da seleção de overload e operações de move.
- `std::move` é cast, não transferência automática de recurso.
- Objetos movidos continuam válidos, mas o valor pode depender do contrato.

## Termos desta aula
Tipo · `const` · ponteiro · referência · lvalue · xvalue · prvalue · rvalue · `std::move` · overload · dangling

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 02** e separadas por nível.

### Para aprofundar
[C++ draft — expressions](https://eel.is/c++draft/expr) · [C++ draft — value categories](https://eel.is/c++draft/basic.lval)
