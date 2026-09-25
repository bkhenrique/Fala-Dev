# C# — perguntas, nível 1: O que é?

Responda em voz alta antes de abrir a resposta. Estruture: **definição → propósito → exemplo → trade-off**.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

### Aula 01 — [C#, .NET e execução](../aulas/01-csharp-dotnet-e-execucao.md)

**1. O que é C#?**

<sub>Aula 01: [C#, .NET e execução](../aulas/01-csharp-dotnet-e-execucao.md)</sub>

<details><summary>Ver resposta</summary>

É uma linguagem de programação. .NET é uma plataforma usada para compilar e executar muitas aplicações C#.

</details>

**2. Qual o papel do SDK .NET?**

<sub>Aula 01: [C#, .NET e execução](../aulas/01-csharp-dotnet-e-execucao.md)</sub>

<details><summary>Ver resposta</summary>

Ele fornece ferramentas para criar, compilar, publicar e diagnosticar aplicações .NET; não é a própria linguagem C# nem apenas o runtime.

</details>

### Aula 02 — [Tipos, variáveis e conversões](../aulas/02-tipos-variaveis-e-conversoes.md)

**3. O que var significa?**

<sub>Aula 02: [Tipos, variáveis e conversões](../aulas/02-tipos-variaveis-e-conversoes.md)</sub>

<details><summary>Ver resposta</summary>

O compilador infere o tipo estático a partir da expressão inicial.

</details>

**4. Por que compilar com uma versão de linguagem definida?**

<sub>Aula 02: [Tipos, variáveis e conversões](../aulas/02-tipos-variaveis-e-conversoes.md)</sub>

<details><summary>Ver resposta</summary>

Para tornar explícitos os recursos sintáticos disponíveis e evitar depender de uma versão implícita diferente entre ambientes.

</details>

### Aula 03 — [Controle de fluxo, métodos e escopo](../aulas/03-controle-de-fluxo-metodos-e-escopo.md)

**5. O que o parâmetro out exige?**

<sub>Aula 03: [Controle de fluxo, métodos e escopo](../aulas/03-controle-de-fluxo-metodos-e-escopo.md)</sub>

<details><summary>Ver resposta</summary>

O método deve atribuir o parâmetro out antes de retornar normalmente.

</details>

**6. O que var não permite fazer?**

<sub>Aula 03: [Controle de fluxo, métodos e escopo](../aulas/03-controle-de-fluxo-metodos-e-escopo.md)</sub>

<details><summary>Ver resposta</summary>

Não permite mudar o tipo estático da variável após a inferência inicial.

</details>

### Aula 04 — [Classes, records, structs e encapsulamento](../aulas/04-classes-records-structs-e-encapsulamento.md)

**7. O que diferencia class e struct?**

<sub>Aula 04: [Classes, records, structs e encapsulamento](../aulas/04-classes-records-structs-e-encapsulamento.md)</sub>

<details><summary>Ver resposta</summary>

class é tipo de referência; struct é tipo de valor, com semântica de cópia.

</details>

**8. O que acontece no unboxing?**

<sub>Aula 04: [Classes, records, structs e encapsulamento](../aulas/04-classes-records-structs-e-encapsulamento.md)</sub>

<details><summary>Ver resposta</summary>

Um valor em caixa é extraído para um tipo de valor compatível; tipo incompatível pode causar InvalidCastException.

</details>

### Aula 05 — [Interfaces, herança e polimorfismo](../aulas/05-interfaces-heranca-e-polimorfismo.md)

**9. O que é uma interface?**

<sub>Aula 05: [Interfaces, herança e polimorfismo](../aulas/05-interfaces-heranca-e-polimorfismo.md)</sub>

<details><summary>Ver resposta</summary>

É um contrato de membros que tipos podem implementar.

</details>

**10. Para que serve foreach?**

<sub>Aula 05: [Interfaces, herança e polimorfismo](../aulas/05-interfaces-heranca-e-polimorfismo.md)</sub>

<details><summary>Ver resposta</summary>

Para percorrer elementos segundo o padrão de enumeração ou interface de enumerador aplicável.

</details>

### Aula 06 — [Generics, coleções e LINQ](../aulas/06-generics-colecoes-e-linq.md)

**11. Para que servem generics?**

<sub>Aula 06: [Generics, coleções e LINQ](../aulas/06-generics-colecoes-e-linq.md)</sub>

<details><summary>Ver resposta</summary>

Permitem reutilizar tipos e métodos parametrizados mantendo verificação estática.

</details>

**12. O que é escopo lexical?**

<sub>Aula 06: [Generics, coleções e LINQ](../aulas/06-generics-colecoes-e-linq.md)</sub>

<details><summary>Ver resposta</summary>

A região do código na qual um nome declarado pode ser referenciado.

</details>

### Aula 07 — [Nullabilidade e contratos](../aulas/07-nullabilidade-e-contratos.md)

**13. O que string? indica?**

<sub>Aula 07: [Nullabilidade e contratos](../aulas/07-nullabilidade-e-contratos.md)</sub>

<details><summary>Ver resposta</summary>

Com análise nullable habilitada, indica que a referência pode ser nula e permite avisos estáticos.

</details>

**14. O que faz uma propriedade init?**

<sub>Aula 07: [Nullabilidade e contratos](../aulas/07-nullabilidade-e-contratos.md)</sub>

<details><summary>Ver resposta</summary>

Permite configurar a propriedade nos contextos de inicialização definidos pela linguagem, restringindo mudanças posteriores pela API.

</details>

### Aula 08 — [Exceções e gerenciamento de recursos](../aulas/08-excecoes-e-dispose.md)

**15. Para que serve IDisposable?**

<sub>Aula 08: [Exceções e gerenciamento de recursos](../aulas/08-excecoes-e-dispose.md)</sub>

<details><summary>Ver resposta</summary>

Define um contrato para liberação determinística de recursos por Dispose.

</details>

**16. O que é uma classe abstract?**

<sub>Aula 08: [Exceções e gerenciamento de recursos](../aulas/08-excecoes-e-dispose.md)</sub>

<details><summary>Ver resposta</summary>

Classe que não pode ser instanciada diretamente e pode declarar membros que tipos concretos devem implementar.

</details>

### Aula 09 — [Delegates, eventos e programação assíncrona](../aulas/09-delegates-eventos-e-async.md)

**17. O que await faz?**

<sub>Aula 09: [Delegates, eventos e programação assíncrona](../aulas/09-delegates-eventos-e-async.md)</sub>

<details><summary>Ver resposta</summary>

Aguarda uma operação awaitable sem bloquear sincronicamente a thread enquanto ela está incompleta.

</details>

**18. O que significa materializar uma consulta LINQ?**

<sub>Aula 09: [Delegates, eventos e programação assíncrona](../aulas/09-delegates-eventos-e-async.md)</sub>

<details><summary>Ver resposta</summary>

Executar a consulta e armazenar os resultados, por exemplo em uma lista.

</details>

### Aula 10 — [Memória, concorrência e publicação](../aulas/10-memoria-concorrencia-e-deploy.md)

**19. O que o garbage collector gerencia?**

<sub>Aula 10: [Memória, concorrência e publicação](../aulas/10-memoria-concorrencia-e-deploy.md)</sub>

<details><summary>Ver resposta</summary>

A memória de objetos gerenciados que se tornaram inacessíveis.

</details>

**20. IReadOnlyList torna seus elementos imutáveis?**

<sub>Aula 10: [Memória, concorrência e publicação](../aulas/10-memoria-concorrencia-e-deploy.md)</sub>

<details><summary>Ver resposta</summary>

Não. A interface limita operações disponíveis por aquela referência; não garante imutabilidade dos elementos ou da origem.

</details>
