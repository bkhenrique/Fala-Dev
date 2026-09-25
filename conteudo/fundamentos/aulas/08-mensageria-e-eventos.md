# Aula 08 — Mensageria, processamento assíncrono e arquitetura orientada a eventos

> **Objetivo:** entender filas vs pub/sub vs log de eventos (Kafka), garantias de entrega, idempotência, o problema da escrita dupla (Outbox) e transações distribuídas com Saga.

---

## 1. Por que comunicação assíncrona

**Síncrono**: o serviço A chama B e **espera** a resposta (HTTP, gRPC).
- Simples, resposta imediata.
- Mas **acopla no tempo**: se B está lento, A fica lento; se B cai, A falha. Numa cadeia A → B → C → D, a disponibilidade total é o **produto** das disponibilidades (99,9% × 4 ≈ 99,6%).

**Assíncrono**: A **publica uma mensagem** num **broker** e segue; B processa quando puder.
- **Desacoplamento temporal**: B pode estar fora do ar; a mensagem espera.
- **Absorve picos** (a fila funciona como amortecedor, *buffer*).
- **Escala** consumidores independentemente.
- Custo: **consistência eventual**, mais infraestrutura, mais difícil de depurar.

---

## 2. Três modelos de mensageria

### Fila (point-to-point)
```
Producer → [ fila ] → Consumer A
                    → Consumer B     (cada mensagem vai para UM consumidor)
```
Cada mensagem é processada **por um** consumidor e depois some. Distribui **trabalho** (*work queue*).
Exemplos: **RabbitMQ**, **SQS**, **BullMQ**. Uso: processar jobs (enviar e-mail, gerar PDF, chamar IA).

### Pub/Sub (tópicos)
```
Publisher → [ tópico ] → Assinante 1 (e-mail)
                       → Assinante 2 (estoque)     (TODOS recebem uma cópia)
                       → Assinante 3 (analytics)
```
Cada assinante recebe **sua cópia**. Distribui **eventos** ("algo aconteceu").
Exemplos: SNS, Google Pub/Sub, Redis Pub/Sub (este último sem persistência), exchanges *fanout* do RabbitMQ.

### Log de eventos / streaming (Kafka)
```
Tópico "pedidos", partição 0: [e1][e2][e3][e4][e5] ...   ← log imutável, só acrescenta
                                     ▲         ▲
                          grupo "estoque"   grupo "analytics"   (cada grupo guarda seu OFFSET)
```
- As mensagens ficam **gravadas** por um período (**retenção**), não somem ao serem lidas.
- Cada **consumer group** mantém seu próprio **offset** (posição de leitura). Dá para **reprocessar** (*replay*) voltando o offset.
- Tópicos divididos em **partições** para paralelismo; a **ordem é garantida só dentro de uma partição** (por isso se usa uma chave, ex: `pedido_id`, para eventos do mesmo pedido caírem na mesma partição).
- Altíssimo throughput.
Exemplos: **Kafka**, Redpanda, Kinesis. Uso: event sourcing, pipelines de dados, integração entre muitos serviços.

| | Fila | Pub/Sub | Log (Kafka) |
|---|---|---|---|
| Quem recebe | Um consumidor | Todos os assinantes | Cada grupo, no seu ritmo |
| Após consumir | Some | Some (por assinante) | **Fica** (retenção) |
| Replay | Não | Não | **Sim** |
| Ordem | Geralmente FIFO | Varia | Por partição |

---

## 3. Garantias de entrega

- **At-most-once** (no máximo uma vez): pode **perder**, nunca duplica.
- **At-least-once** (pelo menos uma vez): nunca perde, pode **duplicar**. **← o padrão da maioria dos sistemas.**
- **Exactly-once** (exatamente uma vez): o ideal, **muito difícil** de garantir de ponta a ponta; na prática é *at-least-once + idempotência*.

Por que duplica: o consumidor processou, mas caiu antes de confirmar (**ack**); o broker reentrega.

### Consequência: idempotência no consumidor
Técnicas:
- **ID único** da mensagem + tabela de "já processados" (checar antes, gravar junto com o efeito, na mesma transação).
- **Constraint única** no banco (a segunda inserção falha → ignorar).
- Operações naturalmente idempotentes (`status = 'PAGO'` em vez de `saldo = saldo - 10`).

### Retry, backoff, DLQ
- **Retry** só para falhas **transitórias**; com **backoff exponencial + jitter**.
- Após N tentativas → **DLQ** (*Dead Letter Queue*), com alerta e reprocessamento manual.
- Mensagem que sempre falha (**poison message**) não pode travar a fila.

### Ordem
Garantir ordem global limita paralelismo. Normalmente basta ordem **por entidade** (partição por chave). E o consumidor deve tolerar mensagens fora de ordem (ex: ignorar evento com versão mais antiga que a atual).

---

## 4. O problema da escrita dupla e o Outbox Pattern

Cenário: salvar o pedido no banco **e** publicar o evento `PedidoCriado`.
```
1. INSERT pedido  ✅
2. publicar evento  💥 broker fora do ar
→ pedido existe, mas ninguém foi avisado (estoque não baixou, e-mail não saiu)
```
Inverter a ordem também não resolve (evento sai, INSERT falha). Não existe transação que englobe o banco **e** o broker. Isso é o **dual write problem**.

**Transactional Outbox**:
1. Na **mesma transação** do banco: grava o pedido **e** grava o evento numa tabela **`outbox`**.
2. Um processo separado (*relay*/poller, ou **CDC**, *Change Data Capture*, como o Debezium lendo o log do banco) lê a outbox e **publica** no broker, marcando como enviado.
3. Como pode publicar duas vezes (at-least-once), os consumidores são **idempotentes**.

Garantia: se o pedido foi salvo, o evento **vai** ser publicado.

---

## 5. Transações distribuídas e Saga

Em microsserviços, cada serviço tem **seu banco**. Uma operação de negócio pode envolver vários (pedido → pagamento → estoque → entrega). Não dá para fazer um `BEGIN/COMMIT` entre bancos diferentes (o **2PC**, *two-phase commit*, existe, mas é lento, frágil e pouco usado em sistemas modernos).

**Saga**: a transação vira uma **sequência de transações locais**; se uma etapa falhar, executam-se **ações compensatórias** para desfazer as anteriores.
```
Criar pedido → Reservar estoque → Cobrar pagamento ✖ falhou
                     ↓ compensa
             Liberar estoque ← Cancelar pedido
```

Dois estilos:
- **Coreografia**: cada serviço reage a eventos e publica o próximo. Sem coordenador central. Simples com poucos passos, difícil de visualizar com muitos.
- **Orquestração**: um **orquestrador** comanda os passos e as compensações. Fluxo explícito e mais fácil de acompanhar; o orquestrador é mais uma peça. (Ferramentas: Temporal, Step Functions.)

Compensação **não é rollback**: é uma nova ação de negócio (estorno, cancelamento), e o sistema passa por estados intermediários visíveis (consistência eventual).

---

## 6. Arquitetura orientada a eventos (EDA)

Serviços se comunicam publicando **eventos** (fatos no passado: `PedidoCriado`, `PagamentoAprovado`) em vez de chamar uns aos outros diretamente.

- **Evento** (aconteceu, quem quiser reage) vs **comando** (faça isto, destinatário específico).
- ✅ Desacoplamento: adicionar um novo consumidor (analytics) sem mexer no produtor.
- ❌ Fluxo difícil de seguir ("quem reage a isso?"), consistência eventual, versionamento de eventos (o **schema** do evento é um contrato; use schema registry, mudanças compatíveis).
- **Event Sourcing** (avançado): o estado é derivado da **sequência de eventos** guardada, em vez de guardar só o estado atual. Frequentemente combinado com **CQRS** (modelos separados para escrita e leitura).

---

## 7. Como falar na entrevista

**"Como garantir que um evento é publicado quando salvo algo no banco?"**
> "Isso é o problema da escrita dupla: não tenho transação que englobe banco e broker. Uso o transactional outbox: na mesma transação gravo a entidade e o evento numa tabela outbox, e um processo separado, por polling ou CDC com Debezium, publica no broker. Como pode publicar mais de uma vez, os consumidores são idempotentes."

**"Qual a diferença entre uma fila e o Kafka?"**
> "Numa fila tradicional cada mensagem vai pra um consumidor e some depois de processada; é ideal pra distribuir trabalho. O Kafka é um log: as mensagens ficam retidas, cada consumer group guarda seu offset, então vários sistemas leem o mesmo evento no seu ritmo e dá pra reprocessar. A ordem é garantida por partição, e ele tem throughput muito alto. Uso fila pra jobs e Kafka pra streaming de eventos entre muitos serviços."

---

## 8. Resumo

- Assíncrono = **desacoplamento temporal**, absorve picos; custo: consistência eventual.
- **Fila** (um consumidor, some) × **pub/sub** (todos recebem) × **log/Kafka** (retenção, offset, replay, partições).
- Garantias: at-most-once, **at-least-once** (padrão), exactly-once (≈ at-least-once + idempotência).
- **Idempotência** no consumidor; retry com backoff+jitter; **DLQ**; poison message; ordem por partição.
- **Dual write** → **Transactional Outbox** (+ CDC).
- **Saga**: transações locais + **compensações**; **coreografia** × **orquestração**; 2PC evitado.
- **EDA**: eventos × comandos; schema como contrato; event sourcing, CQRS.

## Termos desta aula
comunicação síncrona · comunicação assíncrona · broker · desacoplamento temporal · buffer · fila · point-to-point · work queue · pub/sub · tópico · assinante · log de eventos · Kafka · partição · offset · consumer group · retenção · replay · at-most-once · at-least-once · exactly-once · ack · idempotência · retry · backoff · jitter · DLQ · poison message · dual write · transactional outbox · CDC · Debezium · 2PC · saga · ação compensatória · coreografia · orquestração · event-driven architecture · evento · comando · schema registry · event sourcing · CQRS · consistência eventual

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 08** e separadas por nível.
