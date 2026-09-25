# C# — perguntas, nível 3: Como você faria?

Responda em voz alta antes de abrir a resposta. Estruture: **definição → propósito → exemplo → trade-off**.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

### Aula 01 — [C#, .NET e execução](../aulas/01-csharp-dotnet-e-execucao.md)

**1. Como você aplicaria os conceitos de c#, .net e execução em uma aplicação real?**

<sub>Aula 01: [C#, .NET e execução](../aulas/01-csharp-dotnet-e-execucao.md)</sub>

<details><summary>Ver resposta</summary>

C# é a linguagem e .NET é uma plataforma. CIL é código intermediário; JIT e AOT são estratégias de compilação com suporte dependente do alvo.

</details>

### Aula 02 — [Tipos, variáveis e conversões](../aulas/02-tipos-variaveis-e-conversoes.md)

**2. Como você aplicaria os conceitos de tipos, variáveis e conversões em uma aplicação real?**

<sub>Aula 02: [Tipos, variáveis e conversões](../aulas/02-tipos-variaveis-e-conversoes.md)</sub>

<details><summary>Ver resposta</summary>

A atribuição de um valor de referência copia a referência, não necessariamente o objeto. Valor/referência descreve semântica, não uma regra universal de localização na memória.

</details>

### Aula 03 — [Controle de fluxo, métodos e escopo](../aulas/03-controle-de-fluxo-metodos-e-escopo.md)

**3. Como você aplicaria os conceitos de controle de fluxo, métodos e escopo em uma aplicação real?**

<sub>Aula 03: [Controle de fluxo, métodos e escopo](../aulas/03-controle-de-fluxo-metodos-e-escopo.md)</sub>

<details><summary>Ver resposta</summary>

Use ref, out e in somente quando melhorarem o contrato. Mudar o valor padrão de uma biblioteca não reescreve automaticamente os chamadores já compilados.

</details>

### Aula 04 — [Classes, records, structs e encapsulamento](../aulas/04-classes-records-structs-e-encapsulamento.md)

**4. Como você aplicaria os conceitos de classes, records, structs e encapsulamento em uma aplicação real?**

<sub>Aula 04: [Classes, records, structs e encapsulamento](../aulas/04-classes-records-structs-e-encapsulamento.md)</sub>

<details><summary>Ver resposta</summary>

Escolha classe ou struct considerando identidade, cópia, mutabilidade e tamanho. Encapsulamento deve proteger invariantes do tipo.

</details>

### Aula 05 — [Interfaces, herança e polimorfismo](../aulas/05-interfaces-heranca-e-polimorfismo.md)

**5. Como você aplicaria os conceitos de interfaces, herança e polimorfismo em uma aplicação real?**

<sub>Aula 05: [Interfaces, herança e polimorfismo](../aulas/05-interfaces-heranca-e-polimorfismo.md)</sub>

<details><summary>Ver resposta</summary>

override substitui comportamento virtual; new oculta. Interfaces descrevem contratos, e composição frequentemente reduz acoplamento.

</details>

### Aula 06 — [Generics, coleções e LINQ](../aulas/06-generics-colecoes-e-linq.md)

**6. Como você aplicaria os conceitos de generics, coleções e linq em uma aplicação real?**

<sub>Aula 06: [Generics, coleções e LINQ](../aulas/06-generics-colecoes-e-linq.md)</sub>

<details><summary>Ver resposta</summary>

Verifique quando a consulta será executada e se ela pode ser repetida. Analise origem, materialização e provedor antes de afirmar que uma expressão consultará SQL ou memória.

</details>

### Aula 07 — [Nullabilidade e contratos](../aulas/07-nullabilidade-e-contratos.md)

**7. Como você aplicaria os conceitos de nullabilidade e contratos em uma aplicação real?**

<sub>Aula 07: [Nullabilidade e contratos](../aulas/07-nullabilidade-e-contratos.md)</sub>

<details><summary>Ver resposta</summary>

Não confunda T? em tipo de valor com a anotação nullable de referência. Avisos reduzem riscos, mas não provam ausência de NullReferenceException.

</details>

### Aula 08 — [Exceções e gerenciamento de recursos](../aulas/08-excecoes-e-dispose.md)

**8. Como você aplicaria os conceitos de exceções e gerenciamento de recursos em uma aplicação real?**

<sub>Aula 08: [Exceções e gerenciamento de recursos](../aulas/08-excecoes-e-dispose.md)</sub>

<details><summary>Ver resposta</summary>

Defina claramente quem possui e libera cada recurso. Use Dispose para recursos externos e GC para recuperação de memória gerenciada inacessível.

</details>

### Aula 09 — [Delegates, eventos e programação assíncrona](../aulas/09-delegates-eventos-e-async.md)

**9. Como você aplicaria os conceitos de delegates, eventos e programação assíncrona em uma aplicação real?**

<sub>Aula 09: [Delegates, eventos e programação assíncrona](../aulas/09-delegates-eventos-e-async.md)</sub>

<details><summary>Ver resposta</summary>

Assincronismo e paralelismo são conceitos distintos. Propague cancelamento e prefira retornar Task para operações assíncronas aguardáveis.

</details>

### Aula 10 — [Memória, concorrência e publicação](../aulas/10-memoria-concorrencia-e-deploy.md)

**10. Como você aplicaria os conceitos de memória, concorrência e publicação em uma aplicação real?**

<sub>Aula 10: [Memória, concorrência e publicação](../aulas/10-memoria-concorrencia-e-deploy.md)</sub>

<details><summary>Ver resposta</summary>

Publicação framework-dependent, self-contained, trimming e AOT têm requisitos por target e plataforma. Registre SDK, framework e alvo de runtime usados.

</details>
