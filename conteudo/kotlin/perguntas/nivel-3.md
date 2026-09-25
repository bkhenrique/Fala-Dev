# Kotlin — perguntas, nível 3: Como você faria?

Responda em voz alta antes de abrir a resposta. Estruture: **definição → propósito → exemplo → trade-off**.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

### Aula 01 — [Kotlin, alvos e compilação](../aulas/01-linguagem-alvos-e-compilacao.md)

**1. Como você aplicaria kotlin, alvos e compilação em um projeto real?**

<sub>Aula 01: [Kotlin, alvos e compilação](../aulas/01-linguagem-alvos-e-compilacao.md)</sub>

<details><summary>Ver resposta</summary>

Explique qual alvo e toolchain estão em uso. A portabilidade depende do código, das dependências e dos recursos compartilhados.

</details>

### Aula 02 — [Variáveis, tipos e inferência](../aulas/02-variaveis-tipos-e-inferencia.md)

**2. Como você aplicaria variáveis, tipos e inferência em um projeto real?**

<sub>Aula 02: [Variáveis, tipos e inferência](../aulas/02-variaveis-tipos-e-inferencia.md)</sub>

<details><summary>Ver resposta</summary>

Use val como padrão quando o vínculo não precisa mudar. Diferencie imutabilidade da referência e imutabilidade profunda do objeto.

</details>

### Aula 03 — [Null safety e tipos](../aulas/03-null-safety-e-tipos.md)

**3. Como você aplicaria null safety e tipos em um projeto real?**

<sub>Aula 03: [Null safety e tipos](../aulas/03-null-safety-e-tipos.md)</sub>

<details><summary>Ver resposta</summary>

Modele ausência no tipo sempre que possível e valide nas fronteiras Java, rede, banco e reflexão. Evite !! quando um tratamento explícito comunica melhor o contrato.

</details>

### Aula 04 — [Funções, controle de fluxo e escopo](../aulas/04-funcoes-controle-e-escopo.md)

**4. Como você aplicaria funções, controle de fluxo e escopo em um projeto real?**

<sub>Aula 04: [Funções, controle de fluxo e escopo](../aulas/04-funcoes-controle-e-escopo.md)</sub>

<details><summary>Ver resposta</summary>

Avalie clareza, API gerada e alocação antes de usar inline. Extensões são utilitários de sintaxe, não métodos dinamicamente injetados.

</details>

### Aula 05 — [Classes, interfaces e data classes](../aulas/05-classes-interfaces-e-data-classes.md)

**5. Como você aplicaria classes, interfaces e data classes em um projeto real?**

<sub>Aula 05: [Classes, interfaces e data classes](../aulas/05-classes-interfaces-e-data-classes.md)</sub>

<details><summary>Ver resposta</summary>

Use data class para valor de dados, não como sinônimo de DTO sempre imutável. Herança é opt-in; composição e interfaces modelam contratos e capacidades.

</details>

### Aula 06 — [Generics, variância e contratos](../aulas/06-generics-variancia-e-contratos.md)

**6. Como você aplicaria generics, variância e contratos em um projeto real?**

<sub>Aula 06: [Generics, variância e contratos](../aulas/06-generics-variancia-e-contratos.md)</sub>

<details><summary>Ver resposta</summary>

Projete variância segundo o que a API produz e consome. Não prometa inspeção completa de tipo genérico em runtime no JVM.

</details>

### Aula 07 — [Coleções, sequências e operações](../aulas/07-colecoes-sequencias-e-operacoes.md)

**7. Como você aplicaria coleções, sequências e operações em um projeto real?**

<sub>Aula 07: [Coleções, sequências e operações](../aulas/07-colecoes-sequencias-e-operacoes.md)</sub>

<details><summary>Ver resposta</summary>

Escolha a API pelo contrato de mutação e pelo tamanho/uso dos dados. Meça antes de trocar coleções por Sequence por desempenho.

</details>

### Aula 08 — [Lambdas, extensões e funções de escopo](../aulas/08-lambdas-extensoes-e-escopo.md)

**8. Como você aplicaria lambdas, extensões e funções de escopo em um projeto real?**

<sub>Aula 08: [Lambdas, extensões e funções de escopo](../aulas/08-lambdas-extensoes-e-escopo.md)</sub>

<details><summary>Ver resposta</summary>

Escolha funções de escopo pelo valor retornado e nome do receptor; limite aninhamento para preservar legibilidade.

</details>

### Aula 09 — [Suspensão e coroutines](../aulas/09-suspensao-e-coroutines.md)

**9. Como você aplicaria suspensão e coroutines em um projeto real?**

<sub>Aula 09: [Suspensão e coroutines](../aulas/09-suspensao-e-coroutines.md)</sub>

<details><summary>Ver resposta</summary>

Separe o recurso da linguagem (suspend) da biblioteca escolhida. Explique se o trabalho está concorrente, paralelo ou apenas suspenso por I/O.

</details>

### Aula 10 — [Interop, build e testes](../aulas/10-java-interop-build-e-testes.md)

**10. Como você aplicaria interop, build e testes em um projeto real?**

<sub>Aula 10: [Interop, build e testes](../aulas/10-java-interop-build-e-testes.md)</sub>

<details><summary>Ver resposta</summary>

Registre alvo, JDK, compilador, plugin de build e versões de dependências. Valide contratos nullable ao cruzar fronteiras Java e Kotlin.

</details>
