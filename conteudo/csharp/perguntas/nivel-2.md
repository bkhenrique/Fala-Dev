# C# — perguntas, nível 2: Por quê?

Responda em voz alta antes de abrir a resposta. Estruture: **definição → propósito → exemplo → trade-off**.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

### Aula 01 — [C#, .NET e execução](../aulas/01-csharp-dotnet-e-execucao.md)

**1. O que é CIL?**

<sub>Aula 01: [C#, .NET e execução](../aulas/01-csharp-dotnet-e-execucao.md)</sub>

<details><summary>Ver resposta</summary>

É código intermediário armazenado em assemblies .NET, que o runtime pode executar por JIT ou em cenários AOT suportados.

</details>

**2. Como explicar a relação entre C# e .NET?**

<sub>Aula 01: [C#, .NET e execução](../aulas/01-csharp-dotnet-e-execucao.md)</sub>

<details><summary>Ver resposta</summary>

C# é a linguagem; .NET fornece um ecossistema com runtime, bibliotecas e ferramentas. Um projeto fixa linguagem, target framework e alvos de publicação.

</details>

### Aula 02 — [Tipos, variáveis e conversões](../aulas/02-tipos-variaveis-e-conversoes.md)

**3. O que é boxing?**

<sub>Aula 02: [Tipos, variáveis e conversões](../aulas/02-tipos-variaveis-e-conversoes.md)</sub>

<details><summary>Ver resposta</summary>

É a conversão de um valor para object ou interface compatível por meio de uma caixa gerenciada.

</details>

**4. Quando o tipo de valor pode sofrer boxing?**

<sub>Aula 02: [Tipos, variáveis e conversões](../aulas/02-tipos-variaveis-e-conversoes.md)</sub>

<details><summary>Ver resposta</summary>

Ao ser convertido para object ou para uma interface que implementa, criando a representação gerenciada necessária.

</details>

### Aula 03 — [Controle de fluxo, métodos e escopo](../aulas/03-controle-de-fluxo-metodos-e-escopo.md)

**5. O que significa static em um método?**

<sub>Aula 03: [Controle de fluxo, métodos e escopo](../aulas/03-controle-de-fluxo-metodos-e-escopo.md)</sub>

<details><summary>Ver resposta</summary>

O método pertence ao tipo, e não a uma instância particular.

</details>

**6. Quando usar ref em vez de passagem por valor?**

<sub>Aula 03: [Controle de fluxo, métodos e escopo](../aulas/03-controle-de-fluxo-metodos-e-escopo.md)</sub>

<details><summary>Ver resposta</summary>

Quando o contrato precisa que o método leia e altere a variável do chamador; a referência muda o comportamento da chamada e deve ser explícita.

</details>

### Aula 04 — [Classes, records, structs e encapsulamento](../aulas/04-classes-records-structs-e-encapsulamento.md)

**7. Record garante imutabilidade profunda?**

<sub>Aula 04: [Classes, records, structs e encapsulamento](../aulas/04-classes-records-structs-e-encapsulamento.md)</sub>

<details><summary>Ver resposta</summary>

Não. Record fornece membros sintetizados de igualdade por valor, mas estado referenciado ainda pode ser mutável.

</details>

**8. Quando escolher record em vez de class comum?**

<sub>Aula 04: [Classes, records, structs e encapsulamento](../aulas/04-classes-records-structs-e-encapsulamento.md)</sub>

<details><summary>Ver resposta</summary>

Quando a igualdade baseada em valores e a representação de dados são desejadas; a escolha ainda depende de identidade, mutabilidade e invariantes.

</details>

### Aula 05 — [Interfaces, herança e polimorfismo](../aulas/05-interfaces-heranca-e-polimorfismo.md)

**9. Qual é a diferença entre override e new?**

<sub>Aula 05: [Interfaces, herança e polimorfismo](../aulas/05-interfaces-heranca-e-polimorfismo.md)</sub>

<details><summary>Ver resposta</summary>

override substitui membro virtual no despacho polimórfico; new oculta um membro herdado.

</details>

**10. Como uma chamada virtual escolhe a implementação?**

<sub>Aula 05: [Interfaces, herança e polimorfismo](../aulas/05-interfaces-heranca-e-polimorfismo.md)</sub>

<details><summary>Ver resposta</summary>

Usa o tipo real do objeto para despachar o membro marcado virtual e substituído com override.

</details>

### Aula 06 — [Generics, coleções e LINQ](../aulas/06-generics-colecoes-e-linq.md)

**11. O que é execução adiada em LINQ?**

<sub>Aula 06: [Generics, coleções e LINQ](../aulas/06-generics-colecoes-e-linq.md)</sub>

<details><summary>Ver resposta</summary>

A consulta só é executada quando enumerada em muitos operadores de IEnumerable.

</details>

**12. Como evitar execução repetida inesperada em LINQ?**

<sub>Aula 06: [Generics, coleções e LINQ](../aulas/06-generics-colecoes-e-linq.md)</sub>

<details><summary>Ver resposta</summary>

Materialize quando apropriado e evite enumerar múltiplas vezes uma sequência cuja execução tenha efeitos ou custo elevado.

</details>

### Aula 07 — [Nullabilidade e contratos](../aulas/07-nullabilidade-e-contratos.md)

**13. O que int? representa?**

<sub>Aula 07: [Nullabilidade e contratos](../aulas/07-nullabilidade-e-contratos.md)</sub>

<details><summary>Ver resposta</summary>

Um Nullable<int>, que contém um inteiro ou ausência de valor.

</details>

**14. Como representar retorno opcional sem usar null em referência?**

<sub>Aula 07: [Nullabilidade e contratos](../aulas/07-nullabilidade-e-contratos.md)</sub>

<details><summary>Ver resposta</summary>

Para valor use Nullable<T>; para referências modele a anotação nullable e trate o caso ausente, ou use um tipo de resultado explícito quando o domínio pedir.

</details>

### Aula 08 — [Exceções e gerenciamento de recursos](../aulas/08-excecoes-e-dispose.md)

**15. GC substitui Dispose?**

<sub>Aula 08: [Exceções e gerenciamento de recursos](../aulas/08-excecoes-e-dispose.md)</sub>

<details><summary>Ver resposta</summary>

Não. Garbage collection não libera recursos externos em momento determinístico.

</details>

**16. Como garantir liberação de um stream se ocorrer exceção?**

<sub>Aula 08: [Exceções e gerenciamento de recursos](../aulas/08-excecoes-e-dispose.md)</sub>

<details><summary>Ver resposta</summary>

Coloque o stream em um escopo using ou await using conforme implemente IDisposable ou IAsyncDisposable.

</details>

### Aula 09 — [Delegates, eventos e programação assíncrona](../aulas/09-delegates-eventos-e-async.md)

**17. async cria uma thread?**

<sub>Aula 09: [Delegates, eventos e programação assíncrona](../aulas/09-delegates-eventos-e-async.md)</sub>

<details><summary>Ver resposta</summary>

Não por si só; pode suspender uma operação durante espera e retomá-la depois.

</details>

**18. Quando uma operação async não precisa criar thread?**

<sub>Aula 09: [Delegates, eventos e programação assíncrona](../aulas/09-delegates-eventos-e-async.md)</sub>

<details><summary>Ver resposta</summary>

Ao aguardar I/O assíncrono, ela pode suspender enquanto o sistema conclui a operação, sem manter uma thread bloqueada durante toda a espera.

</details>

### Aula 10 — [Memória, concorrência e publicação](../aulas/10-memoria-concorrencia-e-deploy.md)

**19. O que lock oferece?**

<sub>Aula 10: [Memória, concorrência e publicação](../aulas/10-memoria-concorrencia-e-deploy.md)</sub>

<details><summary>Ver resposta</summary>

Exclusão mútua entre threads que usam o mesmo objeto de sincronização.

</details>

**20. Como proteger estado compartilhado entre threads?**

<sub>Aula 10: [Memória, concorrência e publicação](../aulas/10-memoria-concorrencia-e-deploy.md)</sub>

<details><summary>Ver resposta</summary>

Defina o estado e a região crítica, então use lock, Interlocked, coleções concorrentes ou imutabilidade conforme a atomicidade e o contrato exigidos.

</details>
