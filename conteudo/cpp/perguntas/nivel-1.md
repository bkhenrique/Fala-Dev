# C++ — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Modelo C++, compilação e versões](../aulas/01-modelo-compilacao-e-versoes.md)

**1. O que o padrão C++ define?**
<sub>Aula [01 — Modelo C++, compilação e versões](../aulas/01-modelo-compilacao-e-versoes.md)</sub>
<details><summary>Ver resposta</summary>

Define requisitos da linguagem e biblioteca padrão, incluindo comportamentos observáveis. Não escolhe uma toolchain, sistema operacional ou ABI única.

</details>

**2. Por que a versão de C++ importa?**
<sub>Aula [01 — Modelo C++, compilação e versões](../aulas/01-modelo-compilacao-e-versoes.md)</sub>
<details><summary>Ver resposta</summary>

Recursos e biblioteca padrão são introduzidos em edições diferentes, e suporte varia por compilador/librares. É preciso configurar e conferir a versão compatível com os alvos.

</details>

### Aula 02 — [Tipos, referências e value categories](../aulas/02-tipos-referencias-e-value-categories.md)

**3. O que é uma referência C++?**
<sub>Aula [02 — Tipos, referências e value categories](../aulas/02-tipos-referencias-e-value-categories.md)</sub>
<details><summary>Ver resposta</summary>

Um alias que precisa ser inicializado para designar um objeto. Diferentemente de ponteiro, não é reatribuível para outro objeto e não representa nulo válido no contrato normal.

</details>

**4. O que `std::move` faz?**
<sub>Aula [02 — Tipos, referências e value categories](../aulas/02-tipos-referencias-e-value-categories.md)</sub>
<details><summary>Ver resposta</summary>

Converte a expressão para uma categoria que permite selecionar operações de move. Não transfere recurso por si só; o construtor ou operador de atribuição escolhido faz isso.

</details>

### Aula 03 — [Classes, invariantes e special member functions](../aulas/03-classes-invariantes-e-special-members.md)

**5. O que são special member functions?**
<sub>Aula [03 — Classes, invariantes e special member functions](../aulas/03-classes-invariantes-e-special-members.md)</sub>
<details><summary>Ver resposta</summary>

Funções como construtores padrão, cópia, move, atribuições e destrutor, que têm regras especiais de declaração, geração e chamada associadas às classes.

</details>

**6. O que recomenda Rule of Zero?**
<sub>Aula [03 — Classes, invariantes e special member functions](../aulas/03-classes-invariantes-e-special-members.md)</sub>
<details><summary>Ver resposta</summary>

Preferir compor a classe com membros RAII que gerenciam recursos, evitando implementar manualmente as funções especiais de cópia, move e destruição.

</details>

### Aula 04 — [Lifetime, RAII e smart pointers](../aulas/04-lifetime-raii-e-smart-pointers.md)

**7. O que é RAII?**
<sub>Aula [04 — Lifetime, RAII e smart pointers](../aulas/04-lifetime-raii-e-smart-pointers.md)</sub>
<details><summary>Ver resposta</summary>

Princípio que associa aquisição e liberação de recurso ao lifetime de um objeto, normalmente usando construtor e destrutor.

</details>

**8. Qual o papel de `weak_ptr`?**
<sub>Aula [04 — Lifetime, RAII e smart pointers](../aulas/04-lifetime-raii-e-smart-pointers.md)</sub>
<details><summary>Ver resposta</summary>

Observar objeto gerenciado por `shared_ptr` sem prolongar seu lifetime. `lock()` tenta obter `shared_ptr` temporário se o objeto ainda estiver vivo.

</details>

### Aula 05 — [Herança, polimorfismo e composição](../aulas/05-heranca-polimorfismo-e-composicao.md)

**9. Para que serve `override`?**
<sub>Aula [05 — Herança, polimorfismo e composição](../aulas/05-heranca-polimorfismo-e-composicao.md)</sub>
<details><summary>Ver resposta</summary>

Indica que uma função membro pretende sobrescrever uma virtual herdada, permitindo ao compilador diagnosticar assinatura incompatível.

</details>

**10. O que é object slicing?**
<sub>Aula [05 — Herança, polimorfismo e composição](../aulas/05-heranca-polimorfismo-e-composicao.md)</sub>
<details><summary>Ver resposta</summary>

Copiar um objeto derivado por valor para um objeto base, mantendo apenas a parte base e descartando o estado derivado.

</details>

### Aula 06 — [Templates, generics e concepts](../aulas/06-templates-e-concepts.md)

**11. O que é um template?**
<sub>Aula [06 — Templates, generics e concepts](../aulas/06-templates-e-concepts.md)</sub>
<details><summary>Ver resposta</summary>

Uma declaração parametrizada por tipos, valores ou templates que pode gerar funções/classes específicas durante instanciação.

</details>

**12. O que Concepts acrescenta em C++20?**
<sub>Aula [06 — Templates, generics e concepts](../aulas/06-templates-e-concepts.md)</sub>
<details><summary>Ver resposta</summary>

Uma forma de nomear e restringir requisitos de argumentos de template, ajudando a documentar contratos e tornar diagnósticos mais claros.

</details>

### Aula 07 — [STL: containers, iterators e algorithms](../aulas/07-stl-containers-iterators-e-algorithms.md)

**13. O que é um iterator?**
<sub>Aula [07 — STL: containers, iterators e algorithms](../aulas/07-stl-containers-iterators-e-algorithms.md)</sub>
<details><summary>Ver resposta</summary>

Abstração de posição em sequência/faixa que permite a algorithms percorrer ou acessar elementos segundo uma categoria e contrato.

</details>

**14. O que é invalidação de iterador?**
<sub>Aula [07 — STL: containers, iterators e algorithms](../aulas/07-stl-containers-iterators-e-algorithms.md)</sub>
<details><summary>Ver resposta</summary>

Quando uma operação no container faz um iterator/referência/ponteiro deixar de designar uma posição ou elemento válido segundo as regras daquele container.

</details>

### Aula 08 — [Exceções e tratamento de erros](../aulas/08-excecoes-e-erros.md)

**15. O que é stack unwinding?**
<sub>Aula [08 — Exceções e tratamento de erros](../aulas/08-excecoes-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

Processo pelo qual objetos automáticos construídos no caminho da exceção são destruídos enquanto a exceção propaga até um handler compatível.

</details>

**16. O que `std::expected<T, E>` representa?**
<sub>Aula [08 — Exceções e tratamento de erros](../aulas/08-excecoes-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

Em C++23, um resultado que contém valor de sucesso `T` ou erro `E`, como alternativa tipada para certos contratos de falha.

</details>

### Aula 09 — [Lambdas, move semantics e callable objects](../aulas/09-lambdas-e-move-semantics.md)

**17. O que é o closure object de uma lambda?**
<sub>Aula [09 — Lambdas, move semantics e callable objects](../aulas/09-lambdas-e-move-semantics.md)</sub>
<details><summary>Ver resposta</summary>

Objeto de tipo único não nomeado criado pela expressão lambda; mantém as capturas e pode ser chamado conforme o corpo definido.

</details>

**18. Qual o risco da captura por referência?**
<sub>Aula [09 — Lambdas, move semantics e callable objects](../aulas/09-lambdas-e-move-semantics.md)</sub>
<details><summary>Ver resposta</summary>

Se a closure sobreviver ao objeto referenciado, a captura vira referência pendente. É necessário garantir lifetime ou capturar por valor apropriadamente.

</details>

### Aula 10 — [Concorrência e modelo de memória](../aulas/10-concorrencia-e-modelo-de-memoria.md)

**19. O que `std::jthread` acrescenta em C++20?**
<sub>Aula [10 — Concorrência e modelo de memória](../aulas/10-concorrencia-e-modelo-de-memoria.md)</sub>
<details><summary>Ver resposta</summary>

Uma thread com gerenciamento de escopo cujo destrutor solicita stop e faz join quando ainda joinable, conforme o contrato da classe.

</details>

**20. O que é uma data race em C++?**
<sub>Aula [10 — Concorrência e modelo de memória](../aulas/10-concorrencia-e-modelo-de-memoria.md)</sub>
<details><summary>Ver resposta</summary>

Acessos conflitantes não atômicos sem relação happens-before adequada, com ao menos uma escrita. O programa tem comportamento indefinido.

</details>
