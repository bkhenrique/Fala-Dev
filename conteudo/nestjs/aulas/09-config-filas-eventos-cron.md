# Aula 09 — Configuração, Filas, Eventos e Tarefas agendadas

> **Objetivo:** conhecer os módulos oficiais do Nest que aparecem em quase todo projeto real: `@nestjs/config`, `@nestjs/bullmq`, `@nestjs/event-emitter` e `@nestjs/schedule`, e saber quando usar cada um.

---

## 1. Configuração com `@nestjs/config`

Configuração vem de **variáveis de ambiente** (princípio do **12-Factor App**): o mesmo código roda em dev, staging e prod, mudando só o ambiente.

```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,                   // ConfigService disponível em todo lugar
      validate: (env) => envSchema.parse(env), // valida no boot (Zod)
    }),
  ],
})
export class AppModule {}

@Injectable()
export class PagamentosService {
  constructor(private config: ConfigService) {}
  private chave = this.config.getOrThrow<string>('PAGAMENTO_API_KEY');
}
```

Boas práticas:
- **Validar no boot** e **falhar cedo** (*fail fast*) se faltar variável. Melhor quebrar no deploy do que às 3h da manhã quando a rota é chamada.
- **Namespaces** com `registerAs('banco', () => ({...}))` pra agrupar config por assunto.
- Segredos **fora do git**; em produção vêm de um **secret manager** (AWS Secrets Manager, Vault) ou do orquestrador.

---

## 2. Filas com `@nestjs/bullmq`

Mesmo conceito da aula 11 de Node (fila, producer, worker, retry, backoff, DLQ, idempotência), agora integrado ao Nest com DI.

```ts
// registro
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({ connection: { url: c.get('REDIS_URL') } }),
    }),
    BullModule.registerQueue({ name: 'analise-ia' }),
  ],
  providers: [AnaliseProcessor],
})
export class IAModule {}

// producer (em qualquer service)
@Injectable()
export class DocumentosService {
  constructor(@InjectQueue('analise-ia') private fila: Queue) {}

  async solicitarAnalise(id: string) {
    const job = await this.fila.add('analisar', { id }, {
      jobId: `analise-${id}`,
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 },
    });
    return { jobId: job.id };            // controller responde 202
  }
}

// consumer (worker)
@Processor('analise-ia', { concurrency: 5 })
export class AnaliseProcessor extends WorkerHost {
  constructor(private ia: IAService) { super(); }

  async process(job: Job<{ id: string }>) {
    return this.ia.analisar(job.data.id);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) { /* log, alerta */ }
}
```

O worker pode rodar **no mesmo processo** da API (simples) ou num **processo separado** (outra aplicação Nest só com os processors), que é o ideal quando o processamento é pesado: escala separado e não disputa recursos com a API.

---

## 3. Eventos internos com `@nestjs/event-emitter`

Pub/sub **dentro do processo** (é o `EventEmitter` da aula 07 de Node, com DI).

```ts
// quem emite
this.eventEmitter.emit('pedido.criado', new PedidoCriadoEvent(pedido.id));

// quem escuta (em outro módulo)
@OnEvent('pedido.criado', { async: true })
async enviarEmail(evento: PedidoCriadoEvent) { ... }
```

Ganho: **desacoplamento**. O `PedidosService` não precisa conhecer `EmailService`, `EstoqueService`, `AnalyticsService`. Ele só anuncia "pedido criado", e quem se interessa reage. Também é um jeito de **quebrar dependência circular**.

Limitação importante: é **em memória**. Se o processo cair, o evento se perde, e ele não chega em outras instâncias. Quando o efeito **não pode se perder** (cobrança, e-mail importante), use **fila**.

| | EventEmitter | Fila (BullMQ) |
|---|---|---|
| Onde vive | Memória do processo | Redis |
| Sobrevive a queda | Não | Sim |
| Retry / DLQ | Não | Sim |
| Outras instâncias | Não | Sim |
| Custo | Zero | Infra + complexidade |

---

## 4. Tarefas agendadas com `@nestjs/schedule`

```ts
@Injectable()
export class RelatoriosTask {
  @Cron('0 3 * * *')             // todo dia às 3h
  async gerarRelatorioDiario() { ... }

  @Interval(60_000)              // a cada 1 min
  async limparCache() { ... }
}
```

**Expressão cron**: `minuto hora dia-do-mês mês dia-da-semana`.

Armadilha em produção: com **3 réplicas** da API, o `@Cron` roda **3 vezes**, uma em cada instância. Soluções:
- Usar **jobs repetidos do BullMQ** (`repeat: { pattern: '0 3 * * *' }`), que garantem uma execução só, distribuída.
- Um **lock distribuído** (ex: Redis) pra só uma instância executar.
- Rodar o agendador num serviço separado com 1 réplica, ou usar o agendador da nuvem (CronJob do Kubernetes, EventBridge).

---

## 5. Outros módulos que valem conhecer

- **`@nestjs/throttler`**: rate limiting (por IP/usuário).
- **`@nestjs/cache-manager`**: cache (memória ou Redis) com interceptor.
- **`@nestjs/terminus`**: health checks (`/health` checando banco, Redis, disco).
- **`@nestjs/websockets`**: gateways WebSocket/Socket.IO.
- **`@nestjs/graphql`**: GraphQL.
- **`@nestjs/swagger`**: documentação OpenAPI.
- **`@nestjs/microservices`**: comunicação por TCP, Redis, NATS, RabbitMQ, Kafka, gRPC (aula 10).

---

## 6. Como falar na entrevista

**"Qual a diferença entre usar EventEmitter e fila no Nest?"**
> "EventEmitter é pub/sub em memória: ótimo pra desacoplar módulos internamente, custo zero, mas se o processo cair o evento se perde e ele não chega em outras instâncias. Fila com BullMQ persiste no Redis, tem retry, backoff e DLQ, e distribui entre workers. Uso evento interno pra efeitos colaterais baratos, e fila pra tudo que não pode se perder ou é pesado, como chamada ao provider de IA."

**"Tem algum cuidado com @Cron em produção?"**
> "Sim: com várias réplicas, cada instância executa o cron. Pra rodar uma vez só uso job repetido do BullMQ ou um lock distribuído."

---

## 7. Resumo

- **ConfigModule**: env vars (12-Factor), `isGlobal`, **validar no boot** (fail fast).
- **BullMQ**: `registerQueue`, `@InjectQueue`, `@Processor` + `WorkerHost`; worker pode ser processo separado.
- **EventEmitter**: pub/sub em memória, desacopla, mas **perde evento** se cair.
- Evento que não pode se perder → **fila**.
- **@Cron** com várias réplicas roda N vezes → job repetido/lock distribuído.
- Outros: throttler, cache-manager, terminus, websockets, graphql, swagger, microservices.

## Termos desta aula
12-Factor App · variável de ambiente · ConfigModule · ConfigService · fail fast · secret manager · BullModule · @InjectQueue · @Processor · WorkerHost · concurrency · event emitter · @OnEvent · desacoplamento · cron · expressão cron · @Interval · lock distribuído · job repetido · throttler · health check · terminus

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 09** e separadas por nível.
