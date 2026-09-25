# Aula 03 — Classes, invariantes e special member functions

> **Objetivo:** modelar invariantes de classe e decidir como construtores, cópia, move e destrutor afetam propriedade de recursos.

---

## 1. Invariantes e encapsulamento

Classe agrupa estado e operações que preservam suas invariantes. Construtores estabelecem estado válido; métodos evitam transições inválidas. Encapsular não é apenas tornar campos privados: é controlar como o estado muda e o que a API promete.

## 2. Special member functions

Construtor padrão, copy constructor, move constructor, copy assignment, move assignment e destrutor são funções-membro especiais. O compilador pode declará-las implicitamente conforme as regras e membros da classe; declarar algumas pode afetar geração de outras. Declare explicitamente a política quando gerenciar recursos ou quando o contrato exigir.

## 3. Rule of Zero, Three e Five

**Rule of Zero:** prefira membros RAII que gerenciam seus próprios recursos para não precisar escrever funções especiais. Se a classe gerencia manualmente um recurso e define destrutor/cópia, pense nas regras de cópia e move correspondentes (Rule of Three/Five). Não são leis da linguagem, mas heurísticas de design.

## 4. Inicialização

Listas de inicialização constroem membros diretamente e são necessárias para referências, membros `const` e tipos sem construtor padrão. Ordem real de inicialização segue a ordem de declaração dos membros, não a ordem escrita na lista; alinhe ambas para evitar surpresas.

## 5. Como falar na entrevista

**“O que é Rule of Zero?”**
> “É a recomendação de compor a classe com tipos que já gerenciam recursos por RAII, evitando implementar manualmente cópia, move e destruição. Se eu realmente possuo recurso bruto, preciso definir corretamente as operações especiais.”

## 6. Resumo

- Construtores estabelecem invariantes; métodos mantêm transições válidas.
- Funções especiais governam criação, cópia, move e destruição.
- Rule of Zero prefere composição com tipos RAII.
- Gerenciamento manual pode exigir Rule of Three/Five.
- Membros inicializam na ordem de declaração da classe.

## Termos desta aula
Classe · invariante · construtor · copy constructor · move constructor · assignment · destrutor · Rule of Zero · Rule of Five · lista de inicialização

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 03** e separadas por nível.

### Para aprofundar
[C++ draft — special member functions](https://eel.is/c++draft/special) · [C++ draft — constructors](https://eel.is/c++draft/class.ctor)
