# Java — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. Java é passagem por valor ou por referência?**
<sub>Aula [02 — Memória: Stack, Heap, tipos e Garbage Collector](../aulas/02-memoria-e-garbage-collector.md)</sub>
<details><summary>Ver resposta</summary>

Sempre por valor. Para objetos, o valor copiado é a referência: dá pra alterar o objeto apontado, mas reatribuir o parâmetro não afeta a variável de quem chamou.

</details>

**2. Como funciona o Garbage Collector?**
<sub>Aula [02 — Memória: Stack, Heap, tipos e Garbage Collector](../aulas/02-memoria-e-garbage-collector.md)</sub>
<details><summary>Ver resposta</summary>

Libera objetos inalcançáveis a partir das GC roots. Heap geracional (a maioria dos objetos morre cedo): young generation (Eden, survivors) com minor GCs frequentes, e old generation com coletas mais caras. Pausas stop-the-world afetam latência; G1 é o padrão, ZGC foca em pausas mínimas.

</details>

**3. Qual a diferença entre `OutOfMemoryError` e `StackOverflowError`?**
<sub>Aula [02 — Memória: Stack, Heap, tipos e Garbage Collector](../aulas/02-memoria-e-garbage-collector.md)</sub>
<details><summary>Ver resposta</summary>

`StackOverflowError` estoura a stack de uma thread, quase sempre por recursão sem fim. `OutOfMemoryError: Java heap space` é o heap sem espaço: objetos demais vivos, por volume real ou memory leak. O primeiro se resolve corrigindo a recursão; o segundo investigando com heap dump ou ajustando o heap.

</details>

**4. Quais as vantagens de objetos imutáveis?**
<sub>Aula [03 — Orientação a Objetos (parte 1): classes, objetos, encapsulamento, static e final](../aulas/03-orientacao-a-objetos-parte-1.md)</sub>
<details><summary>Ver resposta</summary>

Thread-safe por natureza, previsíveis, seguros como chave de HashMap e sem efeitos colaterais inesperados. Custo: criar novos objetos a cada "alteração".

</details>

**5. Por que getters e setters pra tudo não é encapsulamento?**
<sub>Aula [03 — Orientação a Objetos (parte 1): classes, objetos, encapsulamento, static e final](../aulas/03-orientacao-a-objetos-parte-1.md)</sub>
<details><summary>Ver resposta</summary>

Porque um setter genérico deixa qualquer um colocar o objeto em estado inválido: é um atributo público com mais passos. Encapsulamento é expor comportamento com significado (`depositar`, `sacar`) que protege as invariantes. Classes só com getters e setters e regra espalhada em services formam o chamado modelo anêmico.

</details>

**6. O que é polimorfismo e qual o ganho prático?**
<sub>Aula [04 — Orientação a Objetos (parte 2): herança, polimorfismo, abstração e interfaces](../aulas/04-orientacao-a-objetos-parte-2.md)</sub>
<details><summary>Ver resposta</summary>

Uma referência do tipo pai/interface executa o método do objeto real (dynamic dispatch). Elimina if/else por tipo: adicionar um caso novo é criar uma classe (Strategy, Open/Closed).

</details>

**7. Overload vs override?**
<sub>Aula [04 — Orientação a Objetos (parte 2): herança, polimorfismo, abstração e interfaces](../aulas/04-orientacao-a-objetos-parte-2.md)</sub>
<details><summary>Ver resposta</summary>

Overload: mesmo nome com parâmetros diferentes, resolvido em compilação. Override: subclasse redefine método da pai com mesma assinatura, resolvido em execução; usar @Override.

</details>

**8. Interface ou classe abstrata?**
<sub>Aula [04 — Orientação a Objetos (parte 2): herança, polimorfismo, abstração e interfaces](../aulas/04-orientacao-a-objetos-parte-2.md)</sub>
<details><summary>Ver resposta</summary>

Interface: contrato/capacidade, várias por classe, sem estado. Classe abstrata: família com estado e código comum, herança simples, pode ter construtor. Começar por interface.

</details>

**9. Por que "composição em vez de herança"?**
<sub>Aula [04 — Orientação a Objetos (parte 2): herança, polimorfismo, abstração e interfaces](../aulas/04-orientacao-a-objetos-parte-2.md)</sub>
<details><summary>Ver resposta</summary>

Herança acopla a subclasse aos detalhes da pai (fragile base class) e é fixa em compilação. Composição (ter um objeto e delegar) é flexível, combina com injeção de dependência e facilita teste. Herança só quando for "é um" de verdade, respeitando Liskov.

</details>

**10. O que é o Princípio de Substituição de Liskov? Dê um exemplo de violação.**
<sub>Aula [04 — Orientação a Objetos (parte 2): herança, polimorfismo, abstração e interfaces](../aulas/04-orientacao-a-objetos-parte-2.md)</sub>
<details><summary>Ver resposta</summary>

Onde se espera a classe pai, qualquer subclasse deve funcionar sem surpresas. Violação clássica: `Quadrado extends Retangulo`, em que mudar a largura muda a altura e quebra quem espera um retângulo. Outro sinal: subclasse que lança "operação não suportada" num método herdado. Indica que a herança está errada e composição seria melhor.

</details>

**11. Por que sobrescrever equals e hashCode juntos?**
<sub>Aula [05 — Object, equals/hashCode, String e Records](../aulas/05-object-string-equals-records.md)</sub>
<details><summary>Ver resposta</summary>

Contrato: iguais no equals ⇒ mesmo hashCode. HashMap/HashSet usam hashCode para o bucket e equals para comparar; sobrescrever só um faz o mapa não achar chaves e o set aceitar duplicatas.

</details>

**12. Por que String é imutável?**
<sub>Aula [05 — Object, equals/hashCode, String e Records](../aulas/05-object-string-equals-records.md)</sub>
<details><summary>Ver resposta</summary>

Segurança (valores validados não mudam), thread-safety, cache do hashCode (boa chave de mapa) e o String Pool, que reaproveita literais.

</details>

**13. StringBuilder vs StringBuffer vs concatenação?**
<sub>Aula [05 — Object, equals/hashCode, String e Records](../aulas/05-object-string-equals-records.md)</sub>
<details><summary>Ver resposta</summary>

Concatenar em loop cria uma String nova a cada iteração (lento). StringBuilder é mutável e rápido (não sincronizado), o padrão. StringBuffer é sincronizado, legado.

</details>

**14. O que é um record e quando não usar?**
<sub>Aula [05 — Object, equals/hashCode, String e Records](../aulas/05-object-string-equals-records.md)</sub>
<details><summary>Ver resposta</summary>

Classe de dados imutável que gera construtor, acessores, equals, hashCode e toString. Ótimo pra DTOs e value objects. Não usar em entidades JPA, que precisam ser mutáveis, ter construtor vazio e suportar proxies.

</details>

**15. ArrayList vs LinkedList?**
<sub>Aula [06 — Collections e Generics](../aulas/06-collections-e-generics.md)</sub>
<details><summary>Ver resposta</summary>

ArrayList: array dinâmico, get O(1), inserção no meio O(n), compacto em memória. LinkedList: lista encadeada, acesso O(n). Na prática ArrayList quase sempre; para fila/pilha, ArrayDeque.

</details>

**16. HashMap vs LinkedHashMap vs TreeMap?**
<sub>Aula [06 — Collections e Generics](../aulas/06-collections-e-generics.md)</sub>
<details><summary>Ver resposta</summary>

HashMap: O(1) médio, sem ordem. LinkedHashMap: mantém ordem de inserção (ou de acesso, útil pra LRU). TreeMap: chaves ordenadas, O(log n), operações por faixa.

</details>

**17. Como funciona o HashMap por dentro?**
<sub>Aula [06 — Collections e Generics](../aulas/06-collections-e-generics.md)</sub>
<details><summary>Ver resposta</summary>

Array de buckets; hashCode define o bucket e equals acha a chave. Colisões viram lista ligada e, a partir do Java 8, árvore quando o bucket cresce (pior caso O(log n)). Load factor 0,75: ao passar, dobra a tabela e faz rehash. Não é thread-safe.

</details>

**18. O que é type erasure?**
<sub>Aula [06 — Collections e Generics](../aulas/06-collections-e-generics.md)</sub>
<details><summary>Ver resposta</summary>

Generics só existem em compilação; no bytecode os tipos parametrizados são apagados (List<String> vira List). Por isso não dá `new T()` nem `instanceof List<String>`. Wildcards seguem PECS: producer extends, consumer super.

</details>

**19. Por que `List<Integer>` não é subtipo de `List<Number>`?**
<sub>Aula [06 — Collections e Generics](../aulas/06-collections-e-generics.md)</sub>
<details><summary>Ver resposta</summary>

Generics são invariantes: se fosse permitido, dava pra adicionar um `Double` numa lista que só aceita `Integer`. Pra aceitar listas de subtipos usa-se wildcard: `List<? extends Number>` pra ler (produtor) e `List<? super Integer>` pra escrever (consumidor), a regra PECS.

</details>

**20. Quais são as más práticas no tratamento de exceções?**
<sub>Aula [07 — Exceções](../aulas/07-excecoes.md)</sub>
<details><summary>Ver resposta</summary>

Engolir exceção (catch vazio), catch genérico de Exception/Throwable no meio do código, logar e relançar em toda camada, usar exceção como fluxo normal, e perder a causa ao encapsular (não passar a exceção original).

</details>

**21. Por que frameworks como Spring preferem exceções unchecked?**
<sub>Aula [07 — Exceções](../aulas/07-excecoes.md)</sub>
<details><summary>Ver resposta</summary>

Checked exceptions obrigam `throws` em cascata por todas as camadas ou `catch` vazio só pra calar o compilador, poluindo assinaturas que não conseguem tratar o erro. Com unchecked, a exceção sobe até quem sabe lidar, normalmente um tratamento centralizado como o `@ControllerAdvice`.

</details>

**22. Explique a Streams API e o que significa ser lazy.**
<sub>Aula [08 — Programação funcional em Java: Lambdas, Streams e Optional](../aulas/08-lambdas-streams-optional.md)</sub>
<details><summary>Ver resposta</summary>

Pipeline declarativo: fonte → operações intermediárias (filter, map, flatMap) → operação terminal (collect, findFirst). Intermediárias só executam quando há terminal, elemento por elemento, permitindo curto-circuito. O stream não altera a fonte nem pode ser reusado.

</details>

**23. Quando usar parallel stream?**
<sub>Aula [08 — Programação funcional em Java: Lambdas, Streams e Optional](../aulas/08-lambdas-streams-optional.md)</sub>
<details><summary>Ver resposta</summary>

Raramente: só com muitos dados e operações CPU-bound sem estado compartilhado. Nunca com I/O bloqueante, porque usa o ForkJoinPool comum, compartilhado com o resto da aplicação.

</details>

**24. Como usar Optional corretamente?**
<sub>Aula [08 — Programação funcional em Java: Lambdas, Streams e Optional](../aulas/08-lambdas-streams-optional.md)</sub>
<details><summary>Ver resposta</summary>

Como tipo de retorno de métodos que podem não ter resultado. Não em atributos, parâmetros ou coleções. Evitar get() sem checar; usar map/orElseThrow; orElseGet quando o default é caro.

</details>

**25. Qual a diferença entre `map` e `flatMap` em Streams?**
<sub>Aula [08 — Programação funcional em Java: Lambdas, Streams e Optional](../aulas/08-lambdas-streams-optional.md)</sub>
<details><summary>Ver resposta</summary>

`map` transforma cada elemento em outro (1 pra 1). `flatMap` transforma cada elemento num stream e "achata" tudo num stream só (1 pra N), por exemplo de uma lista de pedidos pra todos os itens de todos os pedidos. No `Optional` é parecido: `flatMap` evita `Optional<Optional<T>>`.

</details>

**26. synchronized vs volatile?**
<sub>Aula [09 — Concorrência: Threads, sincronização, Executors, CompletableFuture e Virtual Threads](../aulas/09-concorrencia.md)</sub>
<details><summary>Ver resposta</summary>

synchronized garante exclusão mútua e visibilidade. volatile só garante visibilidade (leitura da memória principal), não torna operações compostas atômicas.

</details>

**27. Por que usar ExecutorService em vez de criar threads?**
<sub>Aula [09 — Concorrência: Threads, sincronização, Executors, CompletableFuture e Virtual Threads](../aulas/09-concorrencia.md)</sub>
<details><summary>Ver resposta</summary>

Threads de sistema são caras; o pool reaproveita threads, limita quantas rodam ao mesmo tempo e organiza tarefas numa fila, com Future/CompletableFuture para resultados.

</details>
