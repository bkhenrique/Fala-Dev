# Kotlin — perguntas, nível 1: O que é?

Responda em voz alta antes de abrir a resposta. Estruture: **definição → propósito → exemplo → trade-off**.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

### Aula 01 — [Kotlin, alvos e compilação](../aulas/01-linguagem-alvos-e-compilacao.md)

**1. O que é Kotlin?**

<sub>Aula 01: [Kotlin, alvos e compilação](../aulas/01-linguagem-alvos-e-compilacao.md)</sub>

<details><summary>Ver resposta</summary>

É uma linguagem que possui toolchains para vários alvos, entre eles JVM, JavaScript e Native, conforme suporte da versão e projeto.

</details>

**2. O que Kotlin Multiplatform oferece?**

<sub>Aula 01: [Kotlin, alvos e compilação](../aulas/01-linguagem-alvos-e-compilacao.md)</sub>

<details><summary>Ver resposta</summary>

Uma forma de compartilhar código entre alvos declarados, sujeita às APIs disponíveis em cada alvo.

</details>

### Aula 02 — [Variáveis, tipos e inferência](../aulas/02-variaveis-tipos-e-inferencia.md)

**3. Qual a diferença entre val e var?**

<sub>Aula 02: [Variáveis, tipos e inferência](../aulas/02-variaveis-tipos-e-inferencia.md)</sub>

<details><summary>Ver resposta</summary>

val impede reatribuição do vínculo após inicialização; var permite reatribuição. val não garante imutabilidade profunda.

</details>

**4. O que significa inferência de tipo?**

<sub>Aula 02: [Variáveis, tipos e inferência](../aulas/02-variaveis-tipos-e-inferencia.md)</sub>

<details><summary>Ver resposta</summary>

O compilador deduz o tipo estático pela expressão, sem que a variável se torne dinamicamente tipada.

</details>

### Aula 03 — [Null safety e tipos](../aulas/03-null-safety-e-tipos.md)

**5. Como declarar uma String anulável?**

<sub>Aula 03: [Null safety e tipos](../aulas/03-null-safety-e-tipos.md)</sub>

<details><summary>Ver resposta</summary>

Com String?. O tipo exige tratamento antes de uso como não nulo.

</details>

**6. O que o operador !! faz?**

<sub>Aula 03: [Null safety e tipos](../aulas/03-null-safety-e-tipos.md)</sub>

<details><summary>Ver resposta</summary>

Afirma que o valor não é nulo e pode lançar NullPointerException caso seja nulo.

</details>

### Aula 04 — [Funções, controle de fluxo e escopo](../aulas/04-funcoes-controle-e-escopo.md)

**7. O que é uma função de extensão?**

<sub>Aula 04: [Funções, controle de fluxo e escopo](../aulas/04-funcoes-controle-e-escopo.md)</sub>

<details><summary>Ver resposta</summary>

Uma função chamada com sintaxe de membro que não altera a classe e é resolvida estaticamente.

</details>

**8. O que representa Unit?**

<sub>Aula 04: [Funções, controle de fluxo e escopo](../aulas/04-funcoes-controle-e-escopo.md)</sub>

<details><summary>Ver resposta</summary>

O tipo que indica um único valor de retorno sem dado significativo, semelhante a void em alguns usos.

</details>

### Aula 05 — [Classes, interfaces e data classes](../aulas/05-classes-interfaces-e-data-classes.md)

**9. O que data class sintetiza?**

<sub>Aula 05: [Classes, interfaces e data classes](../aulas/05-classes-interfaces-e-data-classes.md)</sub>

<details><summary>Ver resposta</summary>

Métodos como equals, hashCode, toString, componentes e copy a partir das propriedades do construtor primário.

</details>

**10. Classes Kotlin são abertas para herança por padrão?**

<sub>Aula 05: [Classes, interfaces e data classes](../aulas/05-classes-interfaces-e-data-classes.md)</sub>

<details><summary>Ver resposta</summary>

Não. São finais por padrão; a classe/membro precisa permitir herança ou sobrescrita.

</details>

### Aula 06 — [Generics, variância e contratos](../aulas/06-generics-variancia-e-contratos.md)

**11. O que out indica em um parâmetro genérico?**

<sub>Aula 06: [Generics, variância e contratos](../aulas/06-generics-variancia-e-contratos.md)</sub>

<details><summary>Ver resposta</summary>

Covariância: o tipo parametrizado atua como produtor desse tipo sob as restrições da linguagem.

</details>

**12. O que reified permite?**

<sub>Aula 06: [Generics, variância e contratos](../aulas/06-generics-variancia-e-contratos.md)</sub>

<details><summary>Ver resposta</summary>

Em função inline, disponibiliza informação do argumento de tipo dentro do corpo sob as limitações do compilador/alvo.

</details>

### Aula 07 — [Coleções, sequências e operações](../aulas/07-colecoes-sequencias-e-operacoes.md)

**13. List garante que a coleção é imutável?**

<sub>Aula 07: [Coleções, sequências e operações](../aulas/07-colecoes-sequencias-e-operacoes.md)</sub>

<details><summary>Ver resposta</summary>

Não. É uma interface read-only, mas a implementação ou outra referência pode permitir mudanças.

</details>

**14. O que distingue Sequence?**

<sub>Aula 07: [Coleções, sequências e operações](../aulas/07-colecoes-sequencias-e-operacoes.md)</sub>

<details><summary>Ver resposta</summary>

Oferece operações de sequência lazy que processam elementos durante consumo.

</details>

### Aula 08 — [Lambdas, extensões e funções de escopo](../aulas/08-lambdas-extensoes-e-escopo.md)

**15. Extensions alteram a classe estendida?**

<sub>Aula 08: [Lambdas, extensões e funções de escopo](../aulas/08-lambdas-extensoes-e-escopo.md)</sub>

<details><summary>Ver resposta</summary>

Não. São funções independentes com sintaxe de chamada de extensão e resolução estática.

</details>

**16. Como escolher entre apply e also?**

<sub>Aula 08: [Lambdas, extensões e funções de escopo](../aulas/08-lambdas-extensoes-e-escopo.md)</sub>

<details><summary>Ver resposta</summary>

apply usa this e retorna o receptor; also usa it e também retorna o receptor, útil para efeitos laterais visíveis.

</details>

### Aula 09 — [Suspensão e coroutines](../aulas/09-suspensao-e-coroutines.md)

**17. O que suspend significa?**

<sub>Aula 09: [Suspensão e coroutines](../aulas/09-suspensao-e-coroutines.md)</sub>

<details><summary>Ver resposta</summary>

Marca função que pode suspender e retomar sem bloquear a thread quando usada com infraestrutura compatível.

</details>

**18. async/await são palavras-chave Kotlin?**

<sub>Aula 09: [Suspensão e coroutines](../aulas/09-suspensao-e-coroutines.md)</sub>

<details><summary>Ver resposta</summary>

Não. async e await usuais são APIs da biblioteca kotlinx.coroutines; suspend é recurso da linguagem.

</details>

### Aula 10 — [Interop, build e testes](../aulas/10-java-interop-build-e-testes.md)

**19. O que é um platform type em Kotlin/JVM?**

<sub>Aula 10: [Interop, build e testes](../aulas/10-java-interop-build-e-testes.md)</sub>

<details><summary>Ver resposta</summary>

Um tipo vindo de Java cuja nullability não está totalmente expressa para o compilador Kotlin.

</details>

**20. Gradle é parte da linguagem Kotlin?**

<sub>Aula 10: [Interop, build e testes](../aulas/10-java-interop-build-e-testes.md)</sub>

<details><summary>Ver resposta</summary>

Não. É uma ferramenta de build frequentemente usada com plugins Kotlin.

</details>
