# C++ — perguntas, nível 3: Como você faria?

_Cenários reais: junte conceitos e explique suas decisões._

**Regra:** responda **em voz alta** antes de abrir a resposta.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Modelo C++, compilação e versões](../aulas/01-modelo-compilacao-e-versoes.md)

**1. O projeto compila em uma máquina mas `std::expected` falha em outra. O que verifica?**
<sub>Aula [01 — Modelo C++, compilação e versões](../aulas/01-modelo-compilacao-e-versoes.md)</sub>
<details><summary>Ver resposta</summary>

`std::expected` é C++23. Confiro padrão configurado, versão do compilador e suporte da biblioteca padrão no segundo ambiente, depois alinho requisitos/CI ou escolho uma alternativa compatível.

</details>

### Aula 02 — [Tipos, referências e value categories](../aulas/02-tipos-referencias-e-value-categories.md)

**2. Uma chamada com `std::move(obj)` deixa `obj` inutilizável?**
<sub>Aula [02 — Tipos, referências e value categories](../aulas/02-tipos-referencias-e-value-categories.md)</sub>
<details><summary>Ver resposta</summary>

Não necessariamente: `std::move` só permite selecionar overload de rvalue. O objeto continua válido conforme contrato do tipo, mas seu valor pode estar não especificado; não presumo que manteve conteúdo original.

</details>

### Aula 03 — [Classes, invariantes e special member functions](../aulas/03-classes-invariantes-e-special-members.md)

**3. Uma classe que guarda `FILE*` é copiada e ambas fecham o recurso. Como evitar double close?**
<sub>Aula [03 — Classes, invariantes e special member functions](../aulas/03-classes-invariantes-e-special-members.md)</sub>
<details><summary>Ver resposta</summary>

Defino ownership exclusivo: deleto cópia e implemento move que transfere handle e zera a origem, ou encapsulo o recurso num wrapper RAII existente/deleter apropriado. Um alias cru não comunica posse segura.

</details>

### Aula 04 — [Lifetime, RAII e smart pointers](../aulas/04-lifetime-raii-e-smart-pointers.md)

**4. Um grafo de objetos com `shared_ptr` não libera memória. O que investiga?**
<sub>Aula [04 — Lifetime, RAII e smart pointers](../aulas/04-lifetime-raii-e-smart-pointers.md)</sub>
<details><summary>Ver resposta</summary>

Procuro ciclos fortes entre nós. Transformo aresta não proprietária em `weak_ptr`, usando `lock()` quando for acessar e tratando a possibilidade de o objeto já ter expirado.

</details>

### Aula 05 — [Herança, polimorfismo e composição](../aulas/05-heranca-polimorfismo-e-composicao.md)

**5. Um objeto derivado é guardado por valor num container de base e perde estado. Como corrigir o modelo?**
<sub>Aula [05 — Herança, polimorfismo e composição](../aulas/05-heranca-polimorfismo-e-composicao.md)</sub>
<details><summary>Ver resposta</summary>

Isso é slicing. Armazeno indireção polimórfica, por exemplo `unique_ptr<Base>` com destrutor virtual, ou uso composição/variant se os tipos possíveis forem fechados e o contrato justificar.

</details>

### Aula 06 — [Templates, generics e concepts](../aulas/06-templates-e-concepts.md)

**6. Template aceita tipos sem operação necessária e gera erros profundos. Como melhora o contrato?**
<sub>Aula [06 — Templates, generics e concepts](../aulas/06-templates-e-concepts.md)</sub>
<details><summary>Ver resposta</summary>

Em C++20, declaro concept ou `requires` que nomeie as operações/propriedades exigidas. Isso documenta requisito e restringe candidatos, sem substituir testes da implementação.

</details>

### Aula 07 — [STL: containers, iterators e algorithms](../aulas/07-stl-containers-iterators-e-algorithms.md)

**7. Uma referência a `vector` fica inválida após `push_back`. Como encontra e corrige a causa?**
<sub>Aula [07 — STL: containers, iterators e algorithms](../aulas/07-stl-containers-iterators-e-algorithms.md)</sub>
<details><summary>Ver resposta</summary>

Verifico se `push_back` realocou capacidade, invalidando referências/iteradores. Evito reter alias através de mutação potencialmente invalidante, re-obtenho referência após operação ou reservo capacidade quando adequado, sem tratar `reserve` como garantia ilimitada.

</details>

### Aula 08 — [Exceções e tratamento de erros](../aulas/08-excecoes-e-erros.md)

**8. Uma falha ao atualizar saldo deve manter estado antigo, mas a operação altera dois campos. Que garantia oferece?**
<sub>Aula [08 — Exceções e tratamento de erros](../aulas/08-excecoes-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

Busco garantia forte: preparo mudança antes, e só confirmo estado quando todas as operações que podem falhar terminaram, ou uso rollback/transação. A estratégia depende de tipos e exceções que as operações podem lançar.

</details>

### Aula 09 — [Lambdas, move semantics e callable objects](../aulas/09-lambdas-e-move-semantics.md)

**9. Um callback assíncrono captura `this` e o objeto é destruído antes da chamada. Como evita uso pendente?**
<sub>Aula [09 — Lambdas, move semantics e callable objects](../aulas/09-lambdas-e-move-semantics.md)</sub>
<details><summary>Ver resposta</summary>

Defino ciclo de vida do callback e dono. Posso cancelar/aguardar antes da destruição, capturar dados independentes por valor, ou usar ownership compartilhado fraco com checagem de lifetime; não capturo `this` cru sem garantia.

</details>

### Aula 10 — [Concorrência e modelo de memória](../aulas/10-concorrencia-e-modelo-de-memoria.md)

**10. Um contador é atômico, mas outro campo relacionado às vezes fica inconsistente. Por quê?**
<sub>Aula [10 — Concorrência e modelo de memória](../aulas/10-concorrencia-e-modelo-de-memoria.md)</sub>
<details><summary>Ver resposta</summary>

Atomicidade do contador não protege automaticamente a relação com outro campo. Sincronizo a invariante composta com mutex ou desenho uma publicação/ordenação atomicamente correta demonstrável.

</details>
