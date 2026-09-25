# Aula 05 — Herança, polimorfismo e composição

> **Objetivo:** explicar subtipagem, despacho dinâmico e os cuidados de lifetime em hierarquias C++.

---

## 1. Herança

Herança pública representa relação de subtipo: objeto derivado pode ser usado onde base é esperada se preserva o contrato da base. Herança também reutiliza implementação, mas acopla tipos; composição pode expressar melhor capacidades sem criar hierarquia.

## 2. Funções virtuais

Uma função virtual permite despacho dinâmico quando chamada por referência ou ponteiro à base. `override` pede ao compilador que confirme a sobrescrita. Destrutor de classe base polimórfica geralmente deve ser virtual se objetos derivados puderem ser destruídos por ponteiro da base.

Chamadas virtuais em construtores/destrutores têm comportamento específico: durante construção/destruição o despacho não se comporta como se a parte derivada ainda estivesse plenamente viva. Evite depender de estado derivado nesses momentos.

## 3. Slicing

Copiar um objeto derivado para variável de tipo base por valor cria um objeto base e descarta a parte derivada: *object slicing*. Referência e ponteiro a base preservam identidade do objeto derivado, mas exigem lifetime válido.

## 4. Como falar na entrevista

**“Por que o destrutor da base polimórfica deve ser virtual?”**
> “Se o objeto derivado for destruído através de ponteiro da base e o destrutor não for virtual, o comportamento é indefinido. Um destrutor virtual permite despacho correto da destruição.”

## 5. Resumo

- Herança pública expressa subtipagem e exige preservar contrato.
- `virtual` habilita despacho dinâmico; `override` valida a intenção.
- Destrutor da base deve ser virtual quando destruída polimorficamente.
- Passar derivado por valor como base causa slicing.
- Composição reduz acoplamento quando não há relação real de subtipo.

## Termos desta aula
Herança · subtipagem · polimorfismo · função virtual · `override` · destrutor virtual · slicing · composição · despacho dinâmico

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 05** e separadas por nível.

### Para aprofundar
[C++ draft — virtual functions](https://eel.is/c++draft/class.virtual) · [C++ draft — destructors](https://eel.is/c++draft/class.dtor)
