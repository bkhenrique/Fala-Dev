# Java — glossário

Cada termo tem três partes: **Em uma frase** (a definição curta), **Traduzindo** (a explicação simples) e **Como falar** (uma frase pronta pra treinar em voz alta). Alguns trazem também **Não confundir com** ou **Cuidado**.

É material de revisão: a explicação completa está nas [aulas](README.md).

---

## Plataforma

### JVM, JRE e JDK
- **Em uma frase:** JVM executa o bytecode; JRE = JVM + bibliotecas pra rodar; JDK = JRE + ferramentas pra desenvolver (compilador `javac` etc.).
- **Traduzindo:** JDK é a oficina completa, JRE é o carro pronto, JVM é o motor.
- **Como falar:** "Java compila pra *bytecode*, que roda em qualquer JVM: é o *write once, run anywhere*."

### JIT (Just-In-Time)
- **Em uma frase:** a JVM compila pra código de máquina, em tempo de execução, os trechos mais usados (*hot spots*).
- **Traduzindo:** a JVM aprende o que você mais usa e otimiza isso.
- **Como falar:** "Por causa do JIT, aplicações Java têm *warm-up*: ficam mais rápidas depois de rodar um tempo."

### Heap vs Stack
- **Em uma frase:** stack guarda chamadas de método e variáveis locais (por thread); heap guarda os objetos (compartilhado).
- **Traduzindo:** stack é o bloco de notas de cada funcionário; heap é o armazém da empresa.
- **Como falar:** "`StackOverflowError` é recursão sem fim; `OutOfMemoryError: Java heap space` é objeto demais sem ser coletado."

### Garbage Collector
- **Em uma frase:** processo da JVM que libera automaticamente a memória de objetos que não são mais referenciados.
- **Traduzindo:** o faxineiro que joga fora o que ninguém usa mais.
- **Como falar:** "Pausas longas de GC podem causar picos de latência; ajustei o heap e usei G1/ZGC."

---

## Orientação a objetos

### Encapsulamento
- **Em uma frase:** esconder o estado interno e expor só comportamento controlado.
- **Traduzindo:** você usa o controle remoto sem abrir a TV.
- **Como falar:** "Campos privados e métodos que protegem as invariantes do objeto."

### Polimorfismo
- **Em uma frase:** o mesmo método se comportar diferente dependendo do objeto real.
- **Traduzindo:** "pagar()" funciona pra Pix, cartão ou boleto, cada um do seu jeito.
- **Como falar:** "Uso polimorfismo via interface pra eliminar `if/else` por tipo (padrão *Strategy*)."

### Interface vs Classe Abstrata
- **Em uma frase:** interface define um contrato (o que fazer); classe abstrata compartilha implementação e estado entre subclasses.
- **Traduzindo:** interface é o "cargo"; classe abstrata é a "família" com herança.
- **Como falar:** "Prefiro interfaces e composição; classe abstrata só quando há código comum real. Uma classe implementa várias interfaces, mas estende só uma classe."

### Overload vs Override
- **Em uma frase:** overload = mesmo nome, parâmetros diferentes (compilação); override = subclasse redefine o método da classe pai (execução).
- **Traduzindo:** overload é ter várias versões; override é substituir a versão herdada.
- **Como falar:** "Override é o que viabiliza polimorfismo em tempo de execução."

### equals e hashCode
- **Em uma frase:** se dois objetos são `equals`, precisam ter o mesmo `hashCode`.
- **Traduzindo:** se não sobrescrever os dois juntos, `HashMap` e `HashSet` se perdem.
- **Como falar:** "Records já geram `equals`/`hashCode` baseados nos campos."

### Record
- **Em uma frase:** tipo imutável e conciso pra carregar dados, com construtor, getters, `equals`, `hashCode` e `toString` gerados.
- **Traduzindo:** DTO sem *boilerplate*.
- **Como falar:** "Uso records pra DTOs e *value objects*."

---

## Linguagem e concorrência

### Checked vs Unchecked Exception
- **Em uma frase:** checked é obrigatório tratar ou declarar (`IOException`); unchecked estende `RuntimeException` e não é obrigatório.
- **Traduzindo:** checked o compilador te obriga a pensar; unchecked é erro de programação ou de negócio.
- **Como falar:** "No Spring, uso exceções unchecked de domínio e um `@ControllerAdvice` pra mapear pra HTTP."

### Streams API
- **Em uma frase:** API funcional pra processar coleções com `map`, `filter`, `reduce`, `collect`.
- **Traduzindo:** uma esteira de transformações em cima da lista.
- **Como falar:** "Streams são *lazy*: nada executa até a operação terminal."

### Race Condition e Deadlock
- **Em uma frase:** race condition = resultado depende da ordem das threads; deadlock = duas threads esperando uma pela outra pra sempre.
- **Traduzindo:** race é duas pessoas editando o mesmo documento ao mesmo tempo; deadlock é dois carros num cruzamento esperando o outro passar.
- **Como falar:** "Evito estado mutável compartilhado; quando preciso, uso estruturas concorrentes (`ConcurrentHashMap`, `AtomicInteger`) ou locks com ordem definida."

### Virtual Threads
- **Em uma frase:** threads leves gerenciadas pela JVM (Java 21), permitindo milhões de tarefas concorrentes com código bloqueante simples.
- **Traduzindo:** a resposta do Java ao "muita conexão ao mesmo tempo" do Node, sem precisar de async.
- **Como falar:** "Com virtual threads mantenho código imperativo e bloqueante, mas com escalabilidade parecida com modelos reativos em cargas I/O-bound."
