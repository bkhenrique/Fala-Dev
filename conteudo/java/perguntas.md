# Java — perguntas

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

As perguntas estão separadas por **nível**, e cada uma indica a aula de onde vem.

---

## Nível 1 — O que é?

_Definições. Tem que sair sem pensar._

**1. Qual a diferença entre JDK, JRE e JVM?**
<sub>Aula [01 — A plataforma Java: JVM, JDK, JRE, bytecode e JIT](aulas/01-plataforma-java.md)</sub>
<details><summary>Ver resposta</summary>

JVM executa bytecode (interpretador, JIT, GC). JRE = JVM + bibliotecas padrão (pra rodar). JDK = JRE + ferramentas de desenvolvimento (javac, jar, debugger).

</details>

**2. O que é bytecode e como ele dá portabilidade ao Java?**
<sub>Aula [01 — A plataforma Java: JVM, JDK, JRE, bytecode e JIT](aulas/01-plataforma-java.md)</sub>
<details><summary>Ver resposta</summary>

Instruções intermediárias geradas pelo javac (.class), feitas pra JVM e não pra um processador real. O mesmo bytecode roda em qualquer sistema que tenha uma JVM: "write once, run anywhere".

</details>

**3. O que é o JIT e o que é warm-up?**
<sub>Aula [01 — A plataforma Java: JVM, JDK, JRE, bytecode e JIT](aulas/01-plataforma-java.md)</sub>
<details><summary>Ver resposta</summary>

A JVM começa interpretando e o compilador JIT compila pra código de máquina otimizado os trechos mais executados (hot spots), usando dados reais de execução. Por isso a aplicação fica mais rápida depois de rodar um tempo (warm-up).

</details>

**4. Quais as versões LTS do Java e o que trouxeram de importante?**
<sub>Aula [01 — A plataforma Java: JVM, JDK, JRE, bytecode e JIT](aulas/01-plataforma-java.md)</sub>
<details><summary>Ver resposta</summary>

8 (lambdas, streams, Optional, java.time), 11 (HttpClient, var em lambdas), 17 (records, sealed classes, text blocks), 21 (virtual threads, pattern matching no switch), 25 (LTS mais recente). Spring Boot 3 exige Java 17+.

</details>

**5. Qual a diferença entre stack e heap?**
<sub>Aula [02 — Memória: Stack, Heap, tipos e Garbage Collector](aulas/02-memoria-e-garbage-collector.md)</sub>
<details><summary>Ver resposta</summary>

Stack: uma por thread, frames de métodos com variáveis locais, primitivos e referências, liberada ao fim do método (StackOverflowError). Heap: compartilhado, guarda os objetos, gerenciado pelo GC (OutOfMemoryError).

</details>

**6. O que é encapsulamento?**
<sub>Aula [03 — Orientação a Objetos (parte 1): classes, objetos, encapsulamento, static e final](aulas/03-orientacao-a-objetos-parte-1.md)</sub>
<details><summary>Ver resposta</summary>

Esconder o estado interno e só permitir alterá-lo por métodos que protegem as invariantes. Atributos privados e métodos com significado de negócio; setter para tudo não é encapsulamento.

</details>

**7. Quais os modificadores de acesso?**
<sub>Aula [03 — Orientação a Objetos (parte 1): classes, objetos, encapsulamento, static e final](aulas/03-orientacao-a-objetos-parte-1.md)</sub>
<details><summary>Ver resposta</summary>

public (todos), protected (pacote + subclasses), package-private sem modificador (só o pacote), private (só a classe). Usar sempre o mais restrito possível.

</details>

**8. O que significam `static` e `final`?**
<sub>Aula [03 — Orientação a Objetos (parte 1): classes, objetos, encapsulamento, static e final](aulas/03-orientacao-a-objetos-parte-1.md)</sub>
<details><summary>Ver resposta</summary>

static: pertence à classe, não à instância (constantes, utilitários); estado estático mutável é global. final: variável atribuída uma vez, método não sobrescrito, classe não estendida. Referência final não impede mudar o conteúdo do objeto.

</details>

**9. Quais são os 4 pilares da orientação a objetos?**
<sub>Aula [04 — Orientação a Objetos (parte 2): herança, polimorfismo, abstração e interfaces](aulas/04-orientacao-a-objetos-parte-2.md)</sub>
<details><summary>Ver resposta</summary>

Encapsulamento (esconder estado), herança (reaproveitar e especializar), polimorfismo (mesmo método, comportamentos diferentes conforme o objeto real) e abstração (expor só o essencial).

</details>

**10. Qual a diferença entre `==` e `equals`?**
<sub>Aula [05 — Object, equals/hashCode, String e Records](aulas/05-object-string-equals-records.md)</sub>
<details><summary>Ver resposta</summary>

`==` compara referências (mesmo objeto); para primitivos compara valores. `equals` compara igualdade lógica (conteúdo). O equals padrão de Object é igual ao ==.

</details>

**11. Checked vs unchecked exceptions?**
<sub>Aula [07 — Exceções](aulas/07-excecoes.md)</sub>
<details><summary>Ver resposta</summary>

Checked (Exception, fora de RuntimeException): o compilador obriga tratar ou declarar com throws. Unchecked (RuntimeException): não obriga; normalmente erro de programação ou regra violada. Frameworks modernos usam quase só unchecked.

</details>

**12. O que é try-with-resources?**
<sub>Aula [07 — Exceções](aulas/07-excecoes.md)</sub>
<details><summary>Ver resposta</summary>

Sintaxe que fecha automaticamente recursos AutoCloseable (conexões, arquivos) ao fim do bloco, mesmo com exceção, na ordem inversa, preservando exceções do close como suppressed.

</details>

**13. O que é uma interface funcional?**
<sub>Aula [08 — Programação funcional em Java: Lambdas, Streams e Optional](aulas/08-lambdas-streams-optional.md)</sub>
<details><summary>Ver resposta</summary>

Interface com um único método abstrato, que pode ser implementada por lambda ou method reference. Ex: Function, Predicate, Consumer, Supplier, Runnable, Comparator.

</details>

**14. O que são Virtual Threads?**
<sub>Aula [09 — Concorrência: Threads, sincronização, Executors, CompletableFuture e Virtual Threads](aulas/09-concorrencia.md)</sub>
<details><summary>Ver resposta</summary>

Threads leves do Java 21, gerenciadas pela JVM. Em I/O bloqueante, a JVM libera a thread do SO pra outra tarefa, permitindo milhões de tarefas com código bloqueante simples. Não ajudam em CPU-bound; é preciso limitar recursos externos (pool do banco).

</details>

**15. Maven ou Gradle?**
<sub>Aula [10 — Build, Testes e Design Patterns](aulas/10-build-testes-e-padroes.md)</sub>
<details><summary>Ver resposta</summary>

Os dois gerenciam dependências, compilam, testam e empacotam. Maven usa `pom.xml` declarativo com ciclo de vida fixo: simples e previsível. Gradle usa um DSL em código (Groovy ou Kotlin), é mais flexível e costuma ser mais rápido (build incremental e cache). Em ambos, use o wrapper (`./mvnw`, `./gradlew`) pra fixar a versão.

</details>

---

## Nível 2 — Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**16. Java é passagem por valor ou por referência?**
<sub>Aula [02 — Memória: Stack, Heap, tipos e Garbage Collector](aulas/02-memoria-e-garbage-collector.md)</sub>
<details><summary>Ver resposta</summary>

Sempre por valor. Para objetos, o valor copiado é a referência: dá pra alterar o objeto apontado, mas reatribuir o parâmetro não afeta a variável de quem chamou.

</details>

**17. Como funciona o Garbage Collector?**
<sub>Aula [02 — Memória: Stack, Heap, tipos e Garbage Collector](aulas/02-memoria-e-garbage-collector.md)</sub>
<details><summary>Ver resposta</summary>

Libera objetos inalcançáveis a partir das GC roots. Heap geracional (a maioria dos objetos morre cedo): young generation (Eden, survivors) com minor GCs frequentes, e old generation com coletas mais caras. Pausas stop-the-world afetam latência; G1 é o padrão, ZGC foca em pausas mínimas.

</details>

**18. Qual a diferença entre `OutOfMemoryError` e `StackOverflowError`?**
<sub>Aula [02 — Memória: Stack, Heap, tipos e Garbage Collector](aulas/02-memoria-e-garbage-collector.md)</sub>
<details><summary>Ver resposta</summary>

`StackOverflowError` estoura a stack de uma thread, quase sempre por recursão sem fim. `OutOfMemoryError: Java heap space` é o heap sem espaço: objetos demais vivos, por volume real ou memory leak. O primeiro se resolve corrigindo a recursão; o segundo investigando com heap dump ou ajustando o heap.

</details>

**19. Quais as vantagens de objetos imutáveis?**
<sub>Aula [03 — Orientação a Objetos (parte 1): classes, objetos, encapsulamento, static e final](aulas/03-orientacao-a-objetos-parte-1.md)</sub>
<details><summary>Ver resposta</summary>

Thread-safe por natureza, previsíveis, seguros como chave de HashMap e sem efeitos colaterais inesperados. Custo: criar novos objetos a cada "alteração".

</details>

**20. Por que getters e setters pra tudo não é encapsulamento?**
<sub>Aula [03 — Orientação a Objetos (parte 1): classes, objetos, encapsulamento, static e final](aulas/03-orientacao-a-objetos-parte-1.md)</sub>
<details><summary>Ver resposta</summary>

Porque um setter genérico deixa qualquer um colocar o objeto em estado inválido: é um atributo público com mais passos. Encapsulamento é expor comportamento com significado (`depositar`, `sacar`) que protege as invariantes. Classes só com getters e setters e regra espalhada em services formam o chamado modelo anêmico.

</details>

**21. O que é polimorfismo e qual o ganho prático?**
<sub>Aula [04 — Orientação a Objetos (parte 2): herança, polimorfismo, abstração e interfaces](aulas/04-orientacao-a-objetos-parte-2.md)</sub>
<details><summary>Ver resposta</summary>

Uma referência do tipo pai/interface executa o método do objeto real (dynamic dispatch). Elimina if/else por tipo: adicionar um caso novo é criar uma classe (Strategy, Open/Closed).

</details>

**22. Overload vs override?**
<sub>Aula [04 — Orientação a Objetos (parte 2): herança, polimorfismo, abstração e interfaces](aulas/04-orientacao-a-objetos-parte-2.md)</sub>
<details><summary>Ver resposta</summary>

Overload: mesmo nome com parâmetros diferentes, resolvido em compilação. Override: subclasse redefine método da pai com mesma assinatura, resolvido em execução; usar @Override.

</details>

**23. Interface ou classe abstrata?**
<sub>Aula [04 — Orientação a Objetos (parte 2): herança, polimorfismo, abstração e interfaces](aulas/04-orientacao-a-objetos-parte-2.md)</sub>
<details><summary>Ver resposta</summary>

Interface: contrato/capacidade, várias por classe, sem estado. Classe abstrata: família com estado e código comum, herança simples, pode ter construtor. Começar por interface.

</details>

**24. Por que "composição em vez de herança"?**
<sub>Aula [04 — Orientação a Objetos (parte 2): herança, polimorfismo, abstração e interfaces](aulas/04-orientacao-a-objetos-parte-2.md)</sub>
<details><summary>Ver resposta</summary>

Herança acopla a subclasse aos detalhes da pai (fragile base class) e é fixa em compilação. Composição (ter um objeto e delegar) é flexível, combina com injeção de dependência e facilita teste. Herança só quando for "é um" de verdade, respeitando Liskov.

</details>

**25. O que é o Princípio de Substituição de Liskov? Dê um exemplo de violação.**
<sub>Aula [04 — Orientação a Objetos (parte 2): herança, polimorfismo, abstração e interfaces](aulas/04-orientacao-a-objetos-parte-2.md)</sub>
<details><summary>Ver resposta</summary>

Onde se espera a classe pai, qualquer subclasse deve funcionar sem surpresas. Violação clássica: `Quadrado extends Retangulo`, em que mudar a largura muda a altura e quebra quem espera um retângulo. Outro sinal: subclasse que lança "operação não suportada" num método herdado. Indica que a herança está errada e composição seria melhor.

</details>

**26. Por que sobrescrever equals e hashCode juntos?**
<sub>Aula [05 — Object, equals/hashCode, String e Records](aulas/05-object-string-equals-records.md)</sub>
<details><summary>Ver resposta</summary>

Contrato: iguais no equals ⇒ mesmo hashCode. HashMap/HashSet usam hashCode para o bucket e equals para comparar; sobrescrever só um faz o mapa não achar chaves e o set aceitar duplicatas.

</details>

**27. Por que String é imutável?**
<sub>Aula [05 — Object, equals/hashCode, String e Records](aulas/05-object-string-equals-records.md)</sub>
<details><summary>Ver resposta</summary>

Segurança (valores validados não mudam), thread-safety, cache do hashCode (boa chave de mapa) e o String Pool, que reaproveita literais.

</details>

**28. StringBuilder vs StringBuffer vs concatenação?**
<sub>Aula [05 — Object, equals/hashCode, String e Records](aulas/05-object-string-equals-records.md)</sub>
<details><summary>Ver resposta</summary>

Concatenar em loop cria uma String nova a cada iteração (lento). StringBuilder é mutável e rápido (não sincronizado), o padrão. StringBuffer é sincronizado, legado.

</details>

**29. O que é um record e quando não usar?**
<sub>Aula [05 — Object, equals/hashCode, String e Records](aulas/05-object-string-equals-records.md)</sub>
<details><summary>Ver resposta</summary>

Classe de dados imutável que gera construtor, acessores, equals, hashCode e toString. Ótimo pra DTOs e value objects. Não usar em entidades JPA, que precisam ser mutáveis, ter construtor vazio e suportar proxies.

</details>

**30. ArrayList vs LinkedList?**
<sub>Aula [06 — Collections e Generics](aulas/06-collections-e-generics.md)</sub>
<details><summary>Ver resposta</summary>

ArrayList: array dinâmico, get O(1), inserção no meio O(n), compacto em memória. LinkedList: lista encadeada, acesso O(n). Na prática ArrayList quase sempre; para fila/pilha, ArrayDeque.

</details>

**31. HashMap vs LinkedHashMap vs TreeMap?**
<sub>Aula [06 — Collections e Generics](aulas/06-collections-e-generics.md)</sub>
<details><summary>Ver resposta</summary>

HashMap: O(1) médio, sem ordem. LinkedHashMap: mantém ordem de inserção (ou de acesso, útil pra LRU). TreeMap: chaves ordenadas, O(log n), operações por faixa.

</details>

**32. Como funciona o HashMap por dentro?**
<sub>Aula [06 — Collections e Generics](aulas/06-collections-e-generics.md)</sub>
<details><summary>Ver resposta</summary>

Array de buckets; hashCode define o bucket e equals acha a chave. Colisões viram lista ligada e, a partir do Java 8, árvore quando o bucket cresce (pior caso O(log n)). Load factor 0,75: ao passar, dobra a tabela e faz rehash. Não é thread-safe.

</details>

**33. O que é type erasure?**
<sub>Aula [06 — Collections e Generics](aulas/06-collections-e-generics.md)</sub>
<details><summary>Ver resposta</summary>

Generics só existem em compilação; no bytecode os tipos parametrizados são apagados (List<String> vira List). Por isso não dá `new T()` nem `instanceof List<String>`. Wildcards seguem PECS: producer extends, consumer super.

</details>

**34. Por que `List<Integer>` não é subtipo de `List<Number>`?**
<sub>Aula [06 — Collections e Generics](aulas/06-collections-e-generics.md)</sub>
<details><summary>Ver resposta</summary>

Generics são invariantes: se fosse permitido, dava pra adicionar um `Double` numa lista que só aceita `Integer`. Pra aceitar listas de subtipos usa-se wildcard: `List<? extends Number>` pra ler (produtor) e `List<? super Integer>` pra escrever (consumidor), a regra PECS.

</details>

**35. Quais são as más práticas no tratamento de exceções?**
<sub>Aula [07 — Exceções](aulas/07-excecoes.md)</sub>
<details><summary>Ver resposta</summary>

Engolir exceção (catch vazio), catch genérico de Exception/Throwable no meio do código, logar e relançar em toda camada, usar exceção como fluxo normal, e perder a causa ao encapsular (não passar a exceção original).

</details>

**36. Por que frameworks como Spring preferem exceções unchecked?**
<sub>Aula [07 — Exceções](aulas/07-excecoes.md)</sub>
<details><summary>Ver resposta</summary>

Checked exceptions obrigam `throws` em cascata por todas as camadas ou `catch` vazio só pra calar o compilador, poluindo assinaturas que não conseguem tratar o erro. Com unchecked, a exceção sobe até quem sabe lidar, normalmente um tratamento centralizado como o `@ControllerAdvice`.

</details>

**37. Explique a Streams API e o que significa ser lazy.**
<sub>Aula [08 — Programação funcional em Java: Lambdas, Streams e Optional](aulas/08-lambdas-streams-optional.md)</sub>
<details><summary>Ver resposta</summary>

Pipeline declarativo: fonte → operações intermediárias (filter, map, flatMap) → operação terminal (collect, findFirst). Intermediárias só executam quando há terminal, elemento por elemento, permitindo curto-circuito. O stream não altera a fonte nem pode ser reusado.

</details>

**38. Quando usar parallel stream?**
<sub>Aula [08 — Programação funcional em Java: Lambdas, Streams e Optional](aulas/08-lambdas-streams-optional.md)</sub>
<details><summary>Ver resposta</summary>

Raramente: só com muitos dados e operações CPU-bound sem estado compartilhado. Nunca com I/O bloqueante, porque usa o ForkJoinPool comum, compartilhado com o resto da aplicação.

</details>

**39. Como usar Optional corretamente?**
<sub>Aula [08 — Programação funcional em Java: Lambdas, Streams e Optional](aulas/08-lambdas-streams-optional.md)</sub>
<details><summary>Ver resposta</summary>

Como tipo de retorno de métodos que podem não ter resultado. Não em atributos, parâmetros ou coleções. Evitar get() sem checar; usar map/orElseThrow; orElseGet quando o default é caro.

</details>

**40. Qual a diferença entre `map` e `flatMap` em Streams?**
<sub>Aula [08 — Programação funcional em Java: Lambdas, Streams e Optional](aulas/08-lambdas-streams-optional.md)</sub>
<details><summary>Ver resposta</summary>

`map` transforma cada elemento em outro (1 pra 1). `flatMap` transforma cada elemento num stream e "achata" tudo num stream só (1 pra N), por exemplo de uma lista de pedidos pra todos os itens de todos os pedidos. No `Optional` é parecido: `flatMap` evita `Optional<Optional<T>>`.

</details>

**41. synchronized vs volatile?**
<sub>Aula [09 — Concorrência: Threads, sincronização, Executors, CompletableFuture e Virtual Threads](aulas/09-concorrencia.md)</sub>
<details><summary>Ver resposta</summary>

synchronized garante exclusão mútua e visibilidade. volatile só garante visibilidade (leitura da memória principal), não torna operações compostas atômicas.

</details>

**42. Por que usar ExecutorService em vez de criar threads?**
<sub>Aula [09 — Concorrência: Threads, sincronização, Executors, CompletableFuture e Virtual Threads](aulas/09-concorrencia.md)</sub>
<details><summary>Ver resposta</summary>

Threads de sistema são caras; o pool reaproveita threads, limita quantas rodam ao mesmo tempo e organiza tarefas numa fila, com Future/CompletableFuture para resultados.

</details>

---

## Nível 3 — Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**43. Existe memory leak em Java? Como investigar?**
<sub>Aula [02 — Memória: Stack, Heap, tipos e Garbage Collector](aulas/02-memoria-e-garbage-collector.md)</sub>
<details><summary>Ver resposta</summary>

Sim: objetos que não são mais usados mas continuam referenciados (coleção estática que cresce, listeners não removidos, ThreadLocal não limpo). Investiga com métricas de heap, heap dump (MAT, VisualVM) e JFR.

</details>

**44. Um `HashSet` está aceitando objetos "duplicados". O que você investigaria?**
<sub>Aula [05 — Object, equals/hashCode, String e Records](aulas/05-object-string-equals-records.md)</sub>
<details><summary>Ver resposta</summary>

Se a classe sobrescreve `equals` e `hashCode` juntos e de forma consistente (iguais no equals precisam ter o mesmo hashCode). Se o hashCode usa campos mutáveis que foram alterados depois da inserção. E se o `equals` recebe `Object` (e não sobrecarga com o tipo da classe). Usar record resolve boa parte disso.

</details>

**45. Como lidar com coleções acessadas por várias threads?**
<sub>Aula [06 — Collections e Generics](aulas/06-collections-e-generics.md)</sub>
<details><summary>Ver resposta</summary>

ConcurrentHashMap (alta concorrência, operações atômicas como computeIfAbsent), CopyOnWriteArrayList (muitas leituras, poucas escritas), BlockingQueue (produtor-consumidor). Evitar HashMap/ArrayList compartilhados.

</details>

**46. O que é race condition e como evitar?**
<sub>Aula [09 — Concorrência: Threads, sincronização, Executors, CompletableFuture e Virtual Threads](aulas/09-concorrencia.md)</sub>
<details><summary>Ver resposta</summary>

Resultado dependente da ordem de execução de threads em estado compartilhado (ex: valor++ não é atômico). Evitar não compartilhando estado mutável (imutabilidade, beans stateless) ou com Atomic*, coleções concorrentes, synchronized/locks.

</details>

**47. O que é deadlock e como prevenir?**
<sub>Aula [09 — Concorrência: Threads, sincronização, Executors, CompletableFuture e Virtual Threads](aulas/09-concorrencia.md)</sub>
<details><summary>Ver resposta</summary>

Threads esperando umas pelas outras para sempre (T1 tem A e quer B; T2 tem B e quer A). Prevenir adquirindo locks sempre na mesma ordem, usando tryLock com timeout e mantendo seções críticas pequenas.

</details>

**48. Como você dimensionaria um thread pool?**
<sub>Aula [09 — Concorrência: Threads, sincronização, Executors, CompletableFuture e Virtual Threads](aulas/09-concorrencia.md)</sub>
<details><summary>Ver resposta</summary>

Depende do tipo de trabalho. CPU-bound: perto do número de núcleos, porque mais threads só geram troca de contexto. I/O-bound: bem mais threads, já que passam a maior parte do tempo esperando (ou virtual threads). Sempre com fila limitada e política de rejeição, e medindo: latência, tamanho da fila e uso de CPU. E lembrando do limite das dependências, como o pool de conexões do banco.

</details>

**49. Como você testa uma aplicação Spring Boot?**
<sub>Aula [10 — Build, Testes e Design Patterns](aulas/10-build-testes-e-padroes.md)</sub>
<details><summary>Ver resposta</summary>

Unitários com JUnit, Mockito e AssertJ sem subir o Spring; @WebMvcTest pra camada web com service mockado; @DataJpaTest com Testcontainers (banco real, não H2); @SpringBootTest só pra fluxos de integração. Pirâmide de testes.

</details>

**50. Cite design patterns que você usa e onde o Spring os usa.**
<sub>Aula [10 — Build, Testes e Design Patterns](aulas/10-build-testes-e-padroes.md)</sub>
<details><summary>Ver resposta</summary>

Strategy (métodos de pagamento), Builder (objetos com muitos campos), Adapter (gateways externos atrás de interface própria), Factory. No Spring: Proxy (@Transactional), Singleton (beans), Template Method (JdbcTemplate), Chain of Responsibility (filtros do Security), Observer (eventos), Front Controller (DispatcherServlet).

</details>
