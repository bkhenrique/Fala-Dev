# Aula 01 — A plataforma Java: JVM, JDK, JRE, bytecode e JIT

> **Objetivo:** explicar como um programa Java sai do código-fonte e roda na máquina, o que é a JVM e por que o Java é "portável", e o ecossistema de versões.

---

## 1. Um pouco de contexto

**Java** foi criado pela **Sun Microsystems** em **1995** (James Gosling), e hoje pertence à **Oracle** (desde 2010). A promessa era:

> **"Write once, run anywhere"** (escreva uma vez, rode em qualquer lugar).

Antes, um programa em C precisava ser **compilado para cada sistema operacional/processador**. Java resolveu isso com uma camada intermediária: a **JVM**.

Hoje Java é muito usado em **backend corporativo**, bancos, sistemas de alta escala, Android (historicamente) e big data (Kafka, Spark, Elasticsearch são feitos em Java/JVM).

---

## 2. Do código até a execução

```
Pedido.java  ──javac──▶  Pedido.class  ──▶  JVM  ──▶  código de máquina
(código-fonte)          (BYTECODE)         (interpreta + JIT)
```

1. Você escreve **código-fonte** (`.java`).
2. O compilador **`javac`** transforma em **bytecode** (`.class`): um conjunto de instruções **para a JVM**, não para um processador real.
3. A **JVM** (*Java Virtual Machine*) carrega o bytecode e o executa no sistema operacional em que está rodando.

A **portabilidade** vem daí: o mesmo `.class` roda em Windows, Linux ou Mac, porque **cada sistema tem sua própria JVM**. Quem é específico da plataforma é a JVM, não o seu programa.

> Analogia: o bytecode é um texto escrito numa "língua universal". Cada país (sistema operacional) tem um **intérprete** (JVM) que traduz para a língua local.

Os arquivos `.class` são empacotados em **`.jar`** (*Java ARchive*), que é basicamente um zip.

---

## 3. JVM, JRE e JDK

| Sigla | O que é | Contém |
|---|---|---|
| **JVM** – Java Virtual Machine | A **máquina virtual** que executa bytecode | Class loader, interpretador, JIT, garbage collector |
| **JRE** – Java Runtime Environment | O necessário para **rodar** programas Java | JVM + bibliotecas padrão |
| **JDK** – Java Development Kit | O necessário para **desenvolver** | JRE + ferramentas (`javac`, `jar`, `jshell`, debugger, profilers) |

> **JDK ⊃ JRE ⊃ JVM.** A oficina completa ⊃ o carro pronto ⊃ o motor.

Desde o Java 11, a Oracle não distribui mais um JRE separado: você instala o JDK (e pode gerar um runtime enxuto com `jlink`).

**Distribuições do JDK**: o código é aberto (**OpenJDK**), e várias empresas distribuem builds: Eclipse **Temurin**, Amazon **Corretto**, Azul Zulu, Oracle JDK, Microsoft Build of OpenJDK.

---

## 4. Como a JVM executa: interpretador + JIT

A JVM não compila tudo para código de máquina de uma vez. Ela faz algo mais inteligente:

1. **Começa interpretando** o bytecode, instrução por instrução (rápido pra começar, lento pra rodar).
2. **Monitora** quais métodos são chamados muitas vezes (**hot spots**; daí o nome da JVM padrão, **HotSpot**).
3. O **JIT compiler** (*Just-In-Time*) compila esses trechos quentes para **código de máquina otimizado**, usando informações reais da execução (quais tipos aparecem, quais `if` são mais comuns).

Consequências:
- **Warm-up** (aquecimento): uma aplicação Java fica **mais rápida depois de rodar um tempo**. Os primeiros requests são mais lentos.
- O JIT pode fazer otimizações que um compilador tradicional (AOT) não faz, porque conhece o comportamento real.
- **Startup** mais lento e mais **memória** que linguagens compiladas nativamente. Isso pesa em serverless e containers pequenos.

### AOT e GraalVM
Para reduzir startup e memória, existe a compilação **AOT** (*Ahead-Of-Time*) com **GraalVM Native Image**: gera um **executável nativo** que sobe em milissegundos. Frameworks como Spring Boot 3, Quarkus e Micronaut suportam. Trade-off: build mais demorado, perde otimizações dinâmicas do JIT, restrições com reflection.

---

## 5. Class loading

A JVM carrega as classes **sob demanda** (*lazy*), quando são usadas pela primeira vez, através de **class loaders** (Bootstrap → Platform → Application). Não precisa decorar, mas saber que existe ajuda a entender erros como `ClassNotFoundException` / `NoClassDefFoundError` (classe não encontrada no *classpath* em runtime).

---

## 6. Versões e LTS

Desde 2017, sai uma versão nova do Java **a cada 6 meses**. Algumas são **LTS** (*Long-Term Support*), com suporte por anos, e são as que empresas usam em produção:

| LTS | Destaques |
|---|---|
| **Java 8** (2014) | Lambdas, Streams, Optional, nova API de datas (`java.time`). Ainda muito presente em legado |
| **Java 11** (2018) | `var` em lambdas, novo HttpClient, fim do JRE separado |
| **Java 17** (2021) | **Records**, **sealed classes**, **text blocks**, pattern matching em `instanceof`, switch expressions |
| **Java 21** (2023) | **Virtual Threads**, pattern matching em `switch`, record patterns, sequenced collections |
| **Java 25** (2025) | LTS mais recente; várias features de preview das versões anteriores finalizadas |

O **Spring Boot 3** exige **Java 17+**. Saber isso mostra que você conhece o ecossistema.

A JVM também roda **outras linguagens**: **Kotlin**, Scala, Groovy, Clojure. Todas compilam para bytecode.

---

## 7. Como falar na entrevista

**"Qual a diferença entre JDK, JRE e JVM?"**
> "A JVM é a máquina virtual que executa bytecode; ela tem o interpretador, o JIT e o garbage collector. O JRE é a JVM mais as bibliotecas padrão, o necessário pra rodar. O JDK é o JRE mais as ferramentas de desenvolvimento, como o javac. O fluxo é: o javac compila o código pra bytecode, e a JVM executa, começando interpretado e compilando com o JIT os trechos mais usados. É isso que dá a portabilidade: o bytecode é o mesmo, e cada sistema tem sua JVM."

---

## 8. Resumo

- **"Write once, run anywhere"** graças ao **bytecode** + **JVM**.
- `.java` → **`javac`** → `.class` (bytecode) → **JVM**.
- **JDK ⊃ JRE ⊃ JVM**.
- JVM: interpreta, detecta **hot spots**, **JIT** compila → **warm-up**.
- **GraalVM Native Image** (AOT): startup rápido, menos memória, com restrições.
- Versões a cada 6 meses; **LTS**: 8, 11, 17, 21, 25. Spring Boot 3 exige 17+.

## Termos desta aula
JVM · JRE · JDK · bytecode · javac · .class · .jar · portabilidade · write once run anywhere · HotSpot · interpretador · JIT · hot spot · warm-up · AOT · GraalVM · native image · class loader · classpath · OpenJDK · Temurin · Corretto · LTS · records · sealed classes · virtual threads · Kotlin

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 01** e separadas por nível.
