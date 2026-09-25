# Aula 10 — Arquitetura, Testes e Microservices no Nest

> **Objetivo:** saber organizar um projeto Nest maior (camadas, Clean Architecture/Hexagonal), testar direito (unitário, integração, e2e) e entender o que o Nest oferece para microservices.

---

## 1. Arquitetura em camadas

A organização mais comum:

```
Controller   → entrada (HTTP): recebe, valida (DTO), delega
   ↓
Service      → regra de negócio / casos de uso
   ↓
Repository   → acesso a dados (ORM, SQL)
   ↓
Banco / APIs externas
```

Regra: cada camada só conhece a **de baixo**, nunca a de cima. O service não sabe de HTTP (não recebe `req`, não lança `404` direto: lança erro de domínio, e um filter traduz).

Isso já resolve bem a maioria dos projetos.

---

## 2. Clean Architecture / Hexagonal (Ports and Adapters)

Em sistemas com regra de negócio mais complexa, vai-se um passo além: o **domínio** fica no centro e **não depende de nada** externo (nem do Nest, nem do ORM, nem do provider de IA).

```
           ┌─────────────── Infra / Adapters ──────────────┐
           │  Controllers HTTP   Prisma   OpenAI   BullMQ   │
           │        │              ▲        ▲        ▲     │
           │        ▼              │        │        │     │
           │   ┌─────── Application (casos de uso) ──────┐ │
           │   │  CriarPedidoUseCase                       │ │
           │   │     usa PORTS (interfaces):               │ │
           │   │     PedidosRepository, AIProvider, Fila   │ │
           │   │   ┌──────── Domain ────────┐              │ │
           │   │   │ Entidades e regras puras │              │ │
           │   │   └─────────────────────────┘              │ │
           │   └──────────────────────────────────────────┘ │
           └────────────────────────────────────────────────┘
```

- **Port** (porta): uma interface que o domínio/caso de uso **define** (ex: `AIProvider`).
- **Adapter** (adaptador): a implementação concreta que fica na infraestrutura (ex: `OpenAIProvider`).
- A **regra de dependência**: as setas apontam **para dentro**. O domínio não importa nada de fora.

No Nest, isso se encaixa com **tokens de injeção** (aula 04): o caso de uso injeta a porta, e o módulo registra o adapter.

Ganho: trocar banco/provider/framework sem tocar na regra; testar a regra sem infraestrutura.
Custo: **mais arquivos e indireção**. Pra CRUD simples é exagero (*overengineering*).

> Frase madura: "Uso camadas simples por padrão e aplico ports and adapters nas bordas que têm chance real de mudar ou que precisam ser testadas isoladas, como o provider de IA."

---

## 3. Testes

### Pirâmide de testes
```
        /\        E2E: poucos, lentos, testam o fluxo HTTP inteiro
       /  \
      /----\      Integração: módulo + banco real (em container)
     /      \
    /--------\    Unitários: muitos, rápidos, isolados com mocks
```

### Teste unitário com `Test.createTestingModule`
```ts
describe('PedidosService', () => {
  let service: PedidosService;
  const repo = { criar: jest.fn(), buscarPorUsuario: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PedidosService,
        { provide: PedidosRepository, useValue: repo }, // mock via DI
      ],
    }).compile();
    service = module.get(PedidosService);
  });

  it('cria pedido', async () => {
    repo.criar.mockResolvedValue({ id: 1 });
    await expect(service.criar(dto, 10)).resolves.toEqual({ id: 1 });
  });
});
```

Aqui a DI mostra seu valor: trocar a dependência real por um **mock** é só registrar outro provider. Também dá pra usar `.overrideProvider(X).useValue(mock)`.

Termos:
- **Mock**: objeto falso com comportamento programado e verificação de chamadas.
- **Stub**: retorna valores fixos, sem verificação.
- **Fake**: implementação simples funcional (ex: repositório em memória).
- **Spy**: observa uma função real.

### Teste de integração
Sobe o módulo com **banco de verdade** em container (**Testcontainers** ou docker-compose), mocka só o que é externo (provider de IA, gateway de pagamento).

### Teste E2E
```ts
const app = moduleFixture.createNestApplication();
await app.init();
await request(app.getHttpServer()).post('/pedidos').send(dto).expect(201);
```
Com **supertest**, testa o caminho HTTP inteiro: pipes, guards, filters.

---

## 4. Microservices no Nest

`@nestjs/microservices` permite que aplicações Nest se comuniquem por outros **transportes** além de HTTP: **TCP, Redis, NATS, RabbitMQ, Kafka, gRPC, MQTT**.

Dois estilos de mensagem:
- **`@MessagePattern`**: **request-response**. Quem manda espera resposta (`client.send()`).
- **`@EventPattern`**: **evento** (fire-and-forget). Quem manda não espera (`client.emit()`).

```ts
@Controller()
export class EstoqueController {
  @MessagePattern('estoque.consultar')
  consultar(@Payload() data: { produtoId: number }) { ... }

  @EventPattern('pedido.criado')
  baixarEstoque(@Payload() evento: PedidoCriadoEvent) { ... }
}
```

Isso é **comunicação síncrona** (request-response, acopla disponibilidade) vs **assíncrona** (eventos via broker, desacopla no tempo).

### Microservices: vale a pena?
Antes de sair quebrando em serviços, lembre que microsserviços trazem:
- Latência e falhas de **rede** entre serviços.
- **Consistência eventual** (não dá pra fazer uma transação entre dois bancos).
- Observabilidade distribuída (tracing), deploy e versionamento de contratos.

Alternativa madura: **monolito modular**. Os módulos do Nest já dão fronteiras claras; se um dia precisar extrair um serviço, a fronteira já existe.

---

## 5. Outras boas práticas de projeto Nest

- **Monorepo** com `nest-cli` (apps + libs compartilhadas) quando há API + worker.
- **Logger estruturado** (ex: `nestjs-pino`) com correlation id.
- **Health checks** com terminus.
- **Graceful shutdown**: `app.enableShutdownHooks()`.
- **Versionamento de API**: `app.enableVersioning()` → `/v1/pedidos`.
- Interceptor/filter padronizando **formato de resposta e de erro**.

---

## 6. Como falar na entrevista

**"Como você organizaria um projeto Nest grande?"**
> "Por módulos de domínio, com controllers magros, services com a regra e repositories pro acesso a dados. Nas bordas que mudam ou que preciso isolar, como provider de IA e fila, aplico ports and adapters: o caso de uso depende de uma interface registrada por token, e o módulo liga o adapter concreto. Testo o service unitariamente trocando dependências por mocks no TestingModule, faço integração com banco real em container, e alguns e2e com supertest. E prefiro começar com monolito modular a microservices, porque os módulos já dão fronteira e evito a complexidade de rede e consistência eventual antes de precisar."

---

## 7. Resumo

- **Camadas**: controller → service → repository; cada uma só conhece a de baixo.
- **Hexagonal / Clean**: domínio no centro, **ports** (interfaces) e **adapters** (implementações); dependências apontam pra dentro.
- Não aplique tudo em tudo: evite **overengineering**.
- **Pirâmide de testes**: muitos unitários, alguns de integração, poucos e2e.
- `Test.createTestingModule` + `useValue` / `overrideProvider` para mocks.
- Mock · stub · fake · spy.
- Microservices: `@MessagePattern` (request-response) vs `@EventPattern` (evento); vários transportes.
- **Monolito modular** antes de microservices.

## Termos desta aula
arquitetura em camadas · Clean Architecture · arquitetura hexagonal · ports and adapters · domínio · caso de uso · regra de dependência · overengineering · pirâmide de testes · teste unitário · teste de integração · e2e · mock · stub · fake · spy · Testcontainers · supertest · microservices · transporter · MessagePattern · EventPattern · request-response · fire-and-forget · consistência eventual · monolito modular · monorepo · versionamento de API

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 10** e separadas por nível.
