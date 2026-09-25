# Aula 04 — Eventos, processamento assíncrono e mensageria no Spring

> **Objetivo:** saber usar e explicar os eventos internos do Spring, `@Async`, `@Scheduled`, e a integração com Kafka e RabbitMQ, incluindo os cuidados de transação, retry, DLQ e idempotência.

Os conceitos gerais (fila × pub/sub × log, at-least-once, idempotência, Outbox, Saga) estão na [aula de mensageria de Fundamentos](../../fundamentos/aulas/08-mensageria-e-eventos.md). Aqui é **como o Spring faz**.

---

## 1. O problema

Um caso de uso comum: **ao confirmar um pedido**, é preciso enviar e-mail, baixar estoque, gerar nota fiscal e avisar o analytics.

Fazer tudo dentro do `PedidoService.confirmar()`:
- **Acopla** o serviço de pedidos a quatro outros assuntos.
- Deixa a requisição **lenta** (e-mail e nota fiscal podem levar segundos).
- Se o e-mail falhar, o pedido falha junto?

O Spring oferece ferramentas em níveis diferentes pra desacoplar isso: **eventos internos** (mesmo processo), **`@Async`** (outra thread), **`@Scheduled`** (tarefas no tempo) e **mensageria** (Kafka/RabbitMQ, entre serviços).

---

## 2. Eventos internos: ApplicationEventPublisher

```java
public record PedidoConfirmado(Long pedidoId, String email) {}

@Service
class PedidoService {
  private final ApplicationEventPublisher eventos;
  // ...
  @Transactional
  public void confirmar(Long id) {
    Pedido pedido = repo.findById(id).orElseThrow();
    pedido.confirmar();
    eventos.publishEvent(new PedidoConfirmado(pedido.getId(), pedido.getEmail()));
  }
}

@Component
class NotificacaoListener {
  @EventListener
  public void aoConfirmar(PedidoConfirmado evento) { ... }
}
```

- É o padrão **Observer / pub-sub em memória**, igual ao `EventEmitter` do Node.
- **Desacopla**: o `PedidoService` não conhece quem escuta.
- Por padrão o `@EventListener` é **síncrono**: roda na mesma thread e **na mesma transação** de quem publicou. Se o listener lançar exceção, ela sobe e pode dar rollback no pedido.

### @TransactionalEventListener: o detalhe que mais cai

Problema: o listener manda o e-mail "pedido confirmado", mas depois a transação do pedido **faz rollback**. O cliente recebeu um e-mail de algo que não aconteceu.

```java
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void aoConfirmar(PedidoConfirmado evento) { enviarEmail(evento); }
```

- **`AFTER_COMMIT`** (padrão): só executa **depois que a transação commitou**. Se deu rollback, não executa.
- Outras fases: `BEFORE_COMMIT`, `AFTER_ROLLBACK`, `AFTER_COMPLETION`.
- Se o evento for publicado **fora de uma transação**, o listener **não roda** por padrão (a não ser com `fallbackExecution = true`). É uma causa comum de "meu listener nunca é chamado".
- Cuidado: se a aplicação **cair** entre o commit e o listener, o evento **se perde** (é memória). Pra efeitos que não podem se perder, use **Outbox** (seção 6).

---

## 3. @Async: rodar em outra thread

```java
@Configuration
@EnableAsync
class AsyncConfig {}

@Service
class RelatorioService {
  @Async
  public CompletableFuture<Relatorio> gerar(Long id) { ... }
}
```

A chamada retorna **na hora**, e o método roda num **pool de threads** (`TaskExecutor`).

Cuidados:
- Funciona via **proxy**: **chamada interna na mesma classe não fica assíncrona** (mesma regra do `@Transactional`).
- **Configure o executor** (tamanho do pool, fila). O pool padrão do Boot é limitado; em cenários com muito I/O, as **virtual threads** (`spring.threads.virtual.enabled=true`) são uma boa opção.
- Exceção em método `void` com `@Async` **não chega em quem chamou**: some, a não ser que você configure um `AsyncUncaughtExceptionHandler`. Prefira retornar `CompletableFuture`.
- O **contexto** da thread original **não vai junto**: transação, `SecurityContext`, MDC dos logs.
- Se a aplicação reiniciar, o trabalho em andamento **se perde**. `@Async` não é fila: não tem retry nem persistência.

---

## 4. @Scheduled: tarefas no tempo

```java
@EnableScheduling
@Component
class Tarefas {
  @Scheduled(cron = "0 0 3 * * *", zone = "America/Sao_Paulo")  // todo dia às 3h
  public void limparCarrinhosAbandonados() { ... }

  @Scheduled(fixedDelay = 60_000)                                 // 1 min depois de terminar a anterior
  public void sincronizar() { ... }
}
```

- `fixedRate`: a cada N ms, contando do **início** da execução anterior. `fixedDelay`: N ms depois do **fim** da anterior.
- Atenção: o cron do Spring tem **6 campos** (começa pelos segundos), diferente do cron do Linux, que tem 5.

**A armadilha em produção:** com **3 réplicas** da aplicação, o `@Scheduled` roda **3 vezes**. Soluções:
- **ShedLock**: um lock no banco/Redis garante que só uma instância executa.
- Rodar o agendamento num serviço separado com uma réplica, ou usar o agendador da plataforma (CronJob do Kubernetes).
- Tornar a tarefa **idempotente** de qualquer forma.

---

## 5. Mensageria: Kafka e RabbitMQ

Quando o evento precisa **sair do processo** (outro serviço, sobreviver a quedas, ter retry), usa-se um broker. O Spring tem integração pronta pros dois mais comuns.

### Spring for Apache Kafka
```java
// produzir
kafkaTemplate.send("pedidos.confirmados", pedido.getId().toString(), evento);   // chave = id → mesma partição

// consumir
@KafkaListener(topics = "pedidos.confirmados", groupId = "estoque")
public void baixarEstoque(PedidoConfirmado evento) { ... }
```
- A **chave** da mensagem decide a **partição**: mensagens com a mesma chave (o mesmo pedido) mantêm a **ordem**.
- **`groupId`** é o **consumer group**: instâncias do mesmo grupo **dividem** as partições entre si (escala horizontal); grupos diferentes recebem **cada um sua cópia** (estoque e analytics leem o mesmo tópico).
- **Tratamento de erro**: o `DefaultErrorHandler` faz **retry com backoff** e, esgotadas as tentativas, o `DeadLetterPublishingRecoverer` manda a mensagem pra um tópico **DLT** (*dead letter topic*, `pedidos.confirmados.DLT`).

### Spring AMQP (RabbitMQ)
```java
rabbitTemplate.convertAndSend("pedidos", "pedido.confirmado", evento);   // exchange + routing key

@RabbitListener(queues = "estoque.pedidos-confirmados")
public void baixarEstoque(PedidoConfirmado evento) { ... }
```
- No RabbitMQ você publica numa **exchange**, que roteia pra **filas** conforme as **bindings** e a **routing key** (tipos: direct, topic, fanout).
- Falhas vão pra uma **DLX** (*dead letter exchange*) configurada na fila.

### Kafka ou RabbitMQ?
| | Kafka | RabbitMQ |
|---|---|---|
| Modelo | **Log** com retenção e replay | **Fila** tradicional com roteamento flexível |
| Forte em | Alto volume, streaming, vários consumidores lendo o mesmo evento, reprocessar | Distribuir tarefas, roteamento por regras, baixa latência por mensagem |
| Ordem | Por partição | Por fila (com um consumidor) |

Pra quem quer abstrair o broker, existe o **Spring Cloud Stream** (mesmo código, binder Kafka ou Rabbit).

### Regras que valem pros dois
- Entrega **at-least-once** → o consumidor tem que ser **idempotente** (tabela de mensagens processadas, constraint única).
- Retry **só** pra falha transitória; erro de dado vai direto pra DLQ/DLT.
- Contrato do evento é **API pública**: evolua de forma compatível (adicione campos, não remova).

---

## 6. Publicar evento só se a transação commitar (Outbox)

O **dual write**: salvar o pedido no banco **e** publicar no Kafka não é atômico. Se o banco commita e o Kafka falha, o evento some; se inverte a ordem, sai evento de pedido que não existe.

Soluções no mundo Spring:
- **Transactional Outbox** "na mão": na mesma transação, grava o pedido **e** uma linha na tabela `outbox`; um processo (`@Scheduled` com lock, ou **CDC** com Debezium) publica e marca como enviado.
- **Spring Modulith**: registra os eventos da aplicação no banco na mesma transação (*event publication registry*) e reprocessa os que não foram concluídos, com suporte a externalizar pra Kafka/Rabbit.

---

## 7. Como falar na entrevista

**"Como você desacoplaria o envio de e-mail da confirmação do pedido no Spring?"**
> "Publico um evento de domínio com o ApplicationEventPublisher e trato com @TransactionalEventListener em AFTER_COMMIT, pra não mandar e-mail de pedido que deu rollback, e deixo o envio assíncrono. Se o e-mail não pode se perder numa queda, aí evento em memória não basta: gravo no outbox na mesma transação, ou uso o registro de eventos do Spring Modulith, e publico numa fila com retry, DLQ e consumidor idempotente."

**"Quais os cuidados com @Async?"**
> "É proxy, então chamada interna não fica assíncrona. Configuro o executor em vez de usar o padrão, ou uso virtual threads pra I/O. Exceção em método void some se não tiver handler, então prefiro retornar CompletableFuture. O contexto não propaga, nem transação nem segurança. E não é fila: se a aplicação cair, o trabalho se perde."

---

## 8. Resumo

- **`ApplicationEventPublisher` + `@EventListener`**: pub/sub em memória, síncrono e na mesma transação.
- **`@TransactionalEventListener(AFTER_COMMIT)`**: só roda se commitou; ainda se perde numa queda.
- **`@Async`**: outra thread; proxy; configure o executor; exceções e contexto não propagam; não é fila.
- **`@Scheduled`**: cron de 6 campos; roda **uma vez por réplica** → **ShedLock** ou agendador externo.
- **Kafka**: `KafkaTemplate`, `@KafkaListener`, chave → partição → ordem, consumer group, retry + **DLT**.
- **RabbitMQ**: exchange + routing key + fila, `@RabbitListener`, **DLX**.
- At-least-once ⇒ **idempotência**. Dual write ⇒ **Outbox** / Spring Modulith.

## Termos desta aula
evento de domínio · ApplicationEventPublisher · @EventListener · @TransactionalEventListener · AFTER_COMMIT · @Async · @EnableAsync · TaskExecutor · CompletableFuture · virtual threads · @Scheduled · cron · fixedRate · fixedDelay · ShedLock · Spring for Apache Kafka · KafkaTemplate · @KafkaListener · partição · chave · consumer group · DefaultErrorHandler · DLT · Spring AMQP · RabbitTemplate · exchange · routing key · binding · DLX · Spring Cloud Stream · at-least-once · idempotência · dual write · Outbox · CDC · Spring Modulith

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 04** e separadas por nível.
