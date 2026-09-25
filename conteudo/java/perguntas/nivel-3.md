# Java — perguntas, nível 3: Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [índice](README.md)

---

**1. Existe memory leak em Java? Como investigar?**
<sub>Aula [02 — Memória: Stack, Heap, tipos e Garbage Collector](../aulas/02-memoria-e-garbage-collector.md)</sub>
<details><summary>Ver resposta</summary>

Sim: objetos que não são mais usados mas continuam referenciados (coleção estática que cresce, listeners não removidos, ThreadLocal não limpo). Investiga com métricas de heap, heap dump (MAT, VisualVM) e JFR.

</details>

**2. Um `HashSet` está aceitando objetos "duplicados". O que você investigaria?**
<sub>Aula [05 — Object, equals/hashCode, String e Records](../aulas/05-object-string-equals-records.md)</sub>
<details><summary>Ver resposta</summary>

Se a classe sobrescreve `equals` e `hashCode` juntos e de forma consistente (iguais no equals precisam ter o mesmo hashCode). Se o hashCode usa campos mutáveis que foram alterados depois da inserção. E se o `equals` recebe `Object` (e não sobrecarga com o tipo da classe). Usar record resolve boa parte disso.

</details>

**3. Como lidar com coleções acessadas por várias threads?**
<sub>Aula [06 — Collections e Generics](../aulas/06-collections-e-generics.md)</sub>
<details><summary>Ver resposta</summary>

ConcurrentHashMap (alta concorrência, operações atômicas como computeIfAbsent), CopyOnWriteArrayList (muitas leituras, poucas escritas), BlockingQueue (produtor-consumidor). Evitar HashMap/ArrayList compartilhados.

</details>

**4. O que é race condition e como evitar?**
<sub>Aula [09 — Concorrência: Threads, sincronização, Executors, CompletableFuture e Virtual Threads](../aulas/09-concorrencia.md)</sub>
<details><summary>Ver resposta</summary>

Resultado dependente da ordem de execução de threads em estado compartilhado (ex: valor++ não é atômico). Evitar não compartilhando estado mutável (imutabilidade, beans stateless) ou com Atomic*, coleções concorrentes, synchronized/locks.

</details>

**5. O que é deadlock e como prevenir?**
<sub>Aula [09 — Concorrência: Threads, sincronização, Executors, CompletableFuture e Virtual Threads](../aulas/09-concorrencia.md)</sub>
<details><summary>Ver resposta</summary>

Threads esperando umas pelas outras para sempre (T1 tem A e quer B; T2 tem B e quer A). Prevenir adquirindo locks sempre na mesma ordem, usando tryLock com timeout e mantendo seções críticas pequenas.

</details>

**6. Como você dimensionaria um thread pool?**
<sub>Aula [09 — Concorrência: Threads, sincronização, Executors, CompletableFuture e Virtual Threads](../aulas/09-concorrencia.md)</sub>
<details><summary>Ver resposta</summary>

Depende do tipo de trabalho. CPU-bound: perto do número de núcleos, porque mais threads só geram troca de contexto. I/O-bound: bem mais threads, já que passam a maior parte do tempo esperando (ou virtual threads). Sempre com fila limitada e política de rejeição, e medindo: latência, tamanho da fila e uso de CPU. E lembrando do limite das dependências, como o pool de conexões do banco.

</details>

**7. Como você testa uma aplicação Spring Boot?**
<sub>Aula [10 — Build, Testes e Design Patterns](../aulas/10-build-testes-e-padroes.md)</sub>
<details><summary>Ver resposta</summary>

Unitários com JUnit, Mockito e AssertJ sem subir o Spring; @WebMvcTest pra camada web com service mockado; @DataJpaTest com Testcontainers (banco real, não H2); @SpringBootTest só pra fluxos de integração. Pirâmide de testes.

</details>

**8. Cite design patterns que você usa e onde o Spring os usa.**
<sub>Aula [10 — Build, Testes e Design Patterns](../aulas/10-build-testes-e-padroes.md)</sub>
<details><summary>Ver resposta</summary>

Strategy (métodos de pagamento), Builder (objetos com muitos campos), Adapter (gateways externos atrás de interface própria), Factory. No Spring: Proxy (@Transactional), Singleton (beans), Template Method (JdbcTemplate), Chain of Responsibility (filtros do Security), Observer (eventos), Front Controller (DispatcherServlet).

</details>
