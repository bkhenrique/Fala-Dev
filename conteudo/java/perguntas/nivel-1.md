# Java — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. Qual a diferença entre JDK, JRE e JVM?**
<sub>Aula [01 — A plataforma Java: JVM, JDK, JRE, bytecode e JIT](../aulas/01-plataforma-java.md)</sub>
<details><summary>Ver resposta</summary>

JVM executa bytecode (interpretador, JIT, GC). JRE = JVM + bibliotecas padrão (pra rodar). JDK = JRE + ferramentas de desenvolvimento (javac, jar, debugger).

</details>

**2. O que é bytecode e como ele dá portabilidade ao Java?**
<sub>Aula [01 — A plataforma Java: JVM, JDK, JRE, bytecode e JIT](../aulas/01-plataforma-java.md)</sub>
<details><summary>Ver resposta</summary>

Instruções intermediárias geradas pelo javac (.class), feitas pra JVM e não pra um processador real. O mesmo bytecode roda em qualquer sistema que tenha uma JVM: "write once, run anywhere".

</details>

**3. O que é o JIT e o que é warm-up?**
<sub>Aula [01 — A plataforma Java: JVM, JDK, JRE, bytecode e JIT](../aulas/01-plataforma-java.md)</sub>
<details><summary>Ver resposta</summary>

A JVM começa interpretando e o compilador JIT compila pra código de máquina otimizado os trechos mais executados (hot spots), usando dados reais de execução. Por isso a aplicação fica mais rápida depois de rodar um tempo (warm-up).

</details>

**4. Quais as versões LTS do Java e o que trouxeram de importante?**
<sub>Aula [01 — A plataforma Java: JVM, JDK, JRE, bytecode e JIT](../aulas/01-plataforma-java.md)</sub>
<details><summary>Ver resposta</summary>

8 (lambdas, streams, Optional, java.time), 11 (HttpClient, var em lambdas), 17 (records, sealed classes, text blocks), 21 (virtual threads, pattern matching no switch), 25 (LTS mais recente). Spring Boot 3 exige Java 17+.

</details>

**5. Qual a diferença entre stack e heap?**
<sub>Aula [02 — Memória: Stack, Heap, tipos e Garbage Collector](../aulas/02-memoria-e-garbage-collector.md)</sub>
<details><summary>Ver resposta</summary>

Stack: uma por thread, frames de métodos com variáveis locais, primitivos e referências, liberada ao fim do método (StackOverflowError). Heap: compartilhado, guarda os objetos, gerenciado pelo GC (OutOfMemoryError).

</details>

**6. O que é encapsulamento?**
<sub>Aula [03 — Orientação a Objetos (parte 1): classes, objetos, encapsulamento, static e final](../aulas/03-orientacao-a-objetos-parte-1.md)</sub>
<details><summary>Ver resposta</summary>

Esconder o estado interno e só permitir alterá-lo por métodos que protegem as invariantes. Atributos privados e métodos com significado de negócio; setter para tudo não é encapsulamento.

</details>

**7. Quais os modificadores de acesso?**
<sub>Aula [03 — Orientação a Objetos (parte 1): classes, objetos, encapsulamento, static e final](../aulas/03-orientacao-a-objetos-parte-1.md)</sub>
<details><summary>Ver resposta</summary>

public (todos), protected (pacote + subclasses), package-private sem modificador (só o pacote), private (só a classe). Usar sempre o mais restrito possível.

</details>

**8. O que significam `static` e `final`?**
<sub>Aula [03 — Orientação a Objetos (parte 1): classes, objetos, encapsulamento, static e final](../aulas/03-orientacao-a-objetos-parte-1.md)</sub>
<details><summary>Ver resposta</summary>

static: pertence à classe, não à instância (constantes, utilitários); estado estático mutável é global. final: variável atribuída uma vez, método não sobrescrito, classe não estendida. Referência final não impede mudar o conteúdo do objeto.

</details>

**9. Quais são os 4 pilares da orientação a objetos?**
<sub>Aula [04 — Orientação a Objetos (parte 2): herança, polimorfismo, abstração e interfaces](../aulas/04-orientacao-a-objetos-parte-2.md)</sub>
<details><summary>Ver resposta</summary>

Encapsulamento (esconder estado), herança (reaproveitar e especializar), polimorfismo (mesmo método, comportamentos diferentes conforme o objeto real) e abstração (expor só o essencial).

</details>

**10. Qual a diferença entre `==` e `equals`?**
<sub>Aula [05 — Object, equals/hashCode, String e Records](../aulas/05-object-string-equals-records.md)</sub>
<details><summary>Ver resposta</summary>

`==` compara referências (mesmo objeto); para primitivos compara valores. `equals` compara igualdade lógica (conteúdo). O equals padrão de Object é igual ao ==.

</details>

**11. Checked vs unchecked exceptions?**
<sub>Aula [07 — Exceções](../aulas/07-excecoes.md)</sub>
<details><summary>Ver resposta</summary>

Checked (Exception, fora de RuntimeException): o compilador obriga tratar ou declarar com throws. Unchecked (RuntimeException): não obriga; normalmente erro de programação ou regra violada. Frameworks modernos usam quase só unchecked.

</details>

**12. O que é try-with-resources?**
<sub>Aula [07 — Exceções](../aulas/07-excecoes.md)</sub>
<details><summary>Ver resposta</summary>

Sintaxe que fecha automaticamente recursos AutoCloseable (conexões, arquivos) ao fim do bloco, mesmo com exceção, na ordem inversa, preservando exceções do close como suppressed.

</details>

**13. O que é uma interface funcional?**
<sub>Aula [08 — Programação funcional em Java: Lambdas, Streams e Optional](../aulas/08-lambdas-streams-optional.md)</sub>
<details><summary>Ver resposta</summary>

Interface com um único método abstrato, que pode ser implementada por lambda ou method reference. Ex: Function, Predicate, Consumer, Supplier, Runnable, Comparator.

</details>

**14. O que são Virtual Threads?**
<sub>Aula [09 — Concorrência: Threads, sincronização, Executors, CompletableFuture e Virtual Threads](../aulas/09-concorrencia.md)</sub>
<details><summary>Ver resposta</summary>

Threads leves do Java 21, gerenciadas pela JVM. Em I/O bloqueante, a JVM libera a thread do SO pra outra tarefa, permitindo milhões de tarefas com código bloqueante simples. Não ajudam em CPU-bound; é preciso limitar recursos externos (pool do banco).

</details>

**15. Maven ou Gradle?**
<sub>Aula [10 — Build, Testes e Design Patterns](../aulas/10-build-testes-e-padroes.md)</sub>
<details><summary>Ver resposta</summary>

Os dois gerenciam dependências, compilam, testam e empacotam. Maven usa `pom.xml` declarativo com ciclo de vida fixo: simples e previsível. Gradle usa um DSL em código (Groovy ou Kotlin), é mais flexível e costuma ser mais rápido (build incremental e cache). Em ambos, use o wrapper (`./mvnw`, `./gradlew`) pra fixar a versão.

</details>
