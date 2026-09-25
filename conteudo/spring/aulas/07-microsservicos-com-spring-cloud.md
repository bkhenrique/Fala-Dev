# Aula 07 — Microsserviços com Spring Cloud (e quando não usar)

> **Objetivo:** conhecer as peças do Spring Cloud usadas em arquitetura de microsserviços (API Gateway, configuração centralizada, service discovery, clientes HTTP, resiliência, tracing, mensageria) e saber argumentar quando um **monolito modular com Spring Modulith** é a escolha melhor.

O debate monolito × microsserviços está em [Fundamentos, aula 09](../../fundamentos/aulas/09-arquitetura-de-software.md). Aqui é **como o ecossistema Spring resolve cada problema**.

---

## 1. O problema

Quebrar uma aplicação em vários serviços traz problemas que o monolito não tinha:
- Por **onde** o cliente entra? Cada serviço com sua URL pública?
- **Como um serviço encontra o outro**, se as instâncias sobem e descem o tempo todo?
- Onde fica a **configuração** de 20 serviços?
- O que acontece quando o serviço de estoque **fica lento**?
- Como **seguir uma requisição** que passou por 5 serviços?

O **Spring Cloud** é um conjunto de projetos que dá respostas prontas pra esses padrões de sistemas distribuídos.

---

## 2. API Gateway: Spring Cloud Gateway

Uma **porta de entrada única** na frente dos serviços:

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: pedidos
          uri: lb://servico-pedidos          # "lb" = balanceia entre as instâncias descobertas
          predicates:
            - Path=/api/pedidos/**
          filters:
            - StripPrefix=1
            - name: RequestRateLimiter        # rate limit (com Redis)
```

Responsabilidades típicas: **roteamento**, **autenticação** na borda (validar o JWT uma vez), **rate limiting**, CORS, reescrita de caminho, métricas. Os serviços internos ficam sem exposição pública.

Cuidado: o gateway **não deve ter regra de negócio**; senão vira um novo monolito no meio do caminho. Se o front precisa de dados agregados sob medida, isso é papel de um **BFF** (Fundamentos, aula 09).

---

## 3. Configuração centralizada: Spring Cloud Config

Um **Config Server** serve as configurações de todos os serviços a partir de um **repositório Git** (ou Vault, banco):
- Configuração **versionada** e auditável.
- Uma mudança vale pra todas as instâncias; com **refresh** (Spring Cloud Bus), dá pra atualizar sem redeploy.
- Segredos vêm de um cofre (**Vault**), não do Git.

Em **Kubernetes**, muitos times usam **ConfigMaps e Secrets** do próprio cluster e dispensam o Config Server.

---

## 4. Service discovery

As instâncias mudam de endereço o tempo todo (autoscaling, deploy). **Service discovery** mantém um registro de "quais instâncias do serviço X estão vivas agora":
- **Eureka** (Spring Cloud Netflix): cada serviço se **registra** e consulta o registro; o balanceamento é feito **no cliente** (Spring Cloud LoadBalancer).
- **Consul**: alternativa com health check e configuração.
- **Kubernetes**: o próprio cluster já faz discovery (o **Service** tem um nome DNS estável e balanceia entre os pods). Aqui o Eureka costuma ser **desnecessário**.

Frase madura: "rodando em Kubernetes, uso o discovery do cluster; Eureka faz sentido fora dele".

---

## 5. Chamando outros serviços

- **HTTP Interfaces** (`@HttpExchange`) com `RestClient`: você declara uma interface e o Spring gera o cliente. É a opção nativa recomendada hoje.
- **OpenFeign** (Spring Cloud OpenFeign): a mesma ideia, mais antigo e ainda muito comum em código existente.

```java
@HttpExchange("/api/estoque")
interface EstoqueClient {
  @GetExchange("/{produtoId}")
  Disponibilidade consultar(@PathVariable Long produtoId);
}
```

Regras que valem sempre (aula 05):
- **Timeout** em toda chamada.
- **Circuit breaker, retry com backoff e bulkhead** com Resilience4j (**Spring Cloud Circuit Breaker** abstrai a implementação).
- Retry só em operação **idempotente**.
- Propagar o **trace id** (automático com Micrometer Tracing).

### Síncrono ou assíncrono?
Cadeias de chamadas síncronas (A → B → C → D) somam latências e multiplicam a chance de falha. Sempre que o fluxo permitir, prefira **eventos** entre serviços (aula 04): o pedido publica `PedidoCriado`, e estoque e faturamento reagem. **Spring Cloud Stream** abstrai Kafka e RabbitMQ.

Transações entre serviços viram **Sagas** com ações compensatórias (Fundamentos, aula 08).

---

## 6. Observabilidade distribuída

Sem isso, microsserviços são impossíveis de depurar:
- **Tracing distribuído** com Micrometer Tracing + OpenTelemetry: um **trace id** atravessa gateway, serviços, filas e banco, e ferramentas como Jaeger, Tempo ou Zipkin mostram o caminho e o tempo de cada etapa.
- **Logs centralizados** com o trace id em cada linha.
- **Métricas** por serviço (RED: taxa, erros, duração) e alertas por SLO.

---

## 7. O outro lado: monolito modular com Spring Modulith

Microsserviços cobram caro: rede, consistência eventual, versionamento de contratos, deploy e observabilidade de N serviços, e times que precisam dominar tudo isso. Pra muitos produtos, o ganho não compensa.

**Spring Modulith** ajuda a construir um **monolito modular** bem feito:
- Cada **pacote de nível superior** é um **módulo** com fronteira explícita; ele **verifica em teste** se um módulo acessa o interno de outro (quebra o build se a arquitetura for violada).
- Módulos conversam por **eventos de aplicação**, com **registro de publicação** no banco (aula 04), o que já prepara a separação futura.
- Gera **documentação** dos módulos e das dependências, e permite **testar um módulo isolado**.

Estratégia madura: começar com monolito modular e **extrair um serviço** quando houver motivo concreto (escala muito diferente, time independente, isolamento de falha, tecnologia diferente). Como os módulos já conversam por eventos, a extração é bem menos dolorosa.

---

## 8. Como falar na entrevista

**"Quais componentes você usaria numa arquitetura de microsserviços com Spring?"**
> "Na borda, Spring Cloud Gateway pra roteamento, autenticação do JWT e rate limit, sem regra de negócio. Configuração no Config Server com segredos no Vault, ou ConfigMaps e Secrets se estiver em Kubernetes, que também já resolve service discovery; fora dele, Eureka. Entre serviços, HTTP Interfaces ou Feign sempre com timeout, circuit breaker e retry do Resilience4j, mas priorizando eventos com Kafka via Spring Cloud Stream, e sagas pras transações que cruzam serviços. E tracing distribuído com Micrometer e OpenTelemetry desde o primeiro dia."

**"Você começaria com microsserviços?"**
> "Normalmente não. Começaria com um monolito modular, usando Spring Modulith pra garantir as fronteiras entre módulos em teste e fazer os módulos conversarem por eventos. Só extrairia um serviço com um motivo concreto, como escala muito diferente ou um time independente, e aí a extração é mais simples porque a fronteira e os eventos já existem."

---

## 9. Resumo

- Microsserviços trazem problemas de **entrada, descoberta, configuração, falhas e rastreio**; o **Spring Cloud** resolve cada um.
- **Spring Cloud Gateway**: roteamento, auth na borda, rate limit; **sem regra de negócio** (isso é BFF).
- **Config Server** (Git, Vault) ou ConfigMaps/Secrets no Kubernetes.
- **Discovery**: Eureka/Consul, ou o do **Kubernetes** (que dispensa Eureka).
- Chamadas: **HTTP Interfaces**/Feign + **timeout, circuit breaker, retry**; prefira **eventos** (Spring Cloud Stream) e **sagas**.
- **Tracing distribuído**, logs centralizados, métricas RED.
- **Spring Modulith**: monolito modular com fronteiras verificadas e eventos; extrair serviço com motivo concreto.

## Termos desta aula
microsserviços · Spring Cloud · API Gateway · Spring Cloud Gateway · rota · predicate · filtro · rate limiting · BFF · Config Server · Spring Cloud Bus · Vault · ConfigMap · Secret · service discovery · Eureka · Consul · Spring Cloud LoadBalancer · Kubernetes Service · HTTP Interfaces · @HttpExchange · OpenFeign · Resilience4j · Spring Cloud Circuit Breaker · Spring Cloud Stream · saga · tracing distribuído · Micrometer Tracing · OpenTelemetry · monolito modular · Spring Modulith

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 07** e separadas por nível.
