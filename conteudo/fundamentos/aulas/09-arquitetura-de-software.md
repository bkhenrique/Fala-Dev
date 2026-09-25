# Aula 09 — Arquitetura de software: monolito, microsserviços, camadas, hexagonal, DDD, BFF e API Gateway

> **Objetivo:** saber comparar estilos de arquitetura, explicar Clean/Hexagonal e conceitos básicos de DDD, e onde entram BFF e API Gateway. Aqui o mais importante é **argumentar trade-offs**.

---

## 1. O que é arquitetura

**Arquitetura** são as decisões **difíceis de mudar depois**: como o sistema é dividido, como as partes se comunicam, onde ficam os dados, que tecnologias base são usadas.

Toda decisão de arquitetura é um **trade-off**. Não existe "a melhor arquitetura", existe a **mais adequada ao contexto**: tamanho do time, maturidade do produto, requisitos de escala, prazo.

Os **requisitos não funcionais** (atributos de qualidade) guiam as decisões: escalabilidade, disponibilidade, performance, segurança, manutenibilidade, custo, time-to-market.

---

## 2. Monolito, monolito modular e microsserviços

### Monolito
Uma aplicação única, um deploy, geralmente um banco.
- ✅ Simples de desenvolver, testar, depurar e implantar; transações locais; sem latência de rede interna.
- ❌ Com o crescimento: código acoplado (**"big ball of mud"**), deploy de tudo por qualquer mudança, escala o conjunto inteiro, times pisando uns nos outros.

### Monolito modular
Um deploy, mas internamente dividido em **módulos com fronteiras claras** (cada um com sua API interna, dados próprios, sem acessar as tabelas dos outros).
- ✅ Organização e baixo acoplamento **sem** o custo operacional de microsserviços.
- Prepara o terreno: se um módulo precisar virar serviço, a fronteira já existe.

### Microsserviços
Vários serviços pequenos, **deploy independente**, cada um com **seu próprio banco**, organizados por **capacidade de negócio**, comunicando-se por rede.
- ✅ Deploy e escala **independentes**, times **autônomos**, isolamento de falhas, liberdade de tecnologia por serviço.
- ❌ **Complexidade distribuída**: latência e falhas de rede, **consistência eventual** (sem transação entre serviços → sagas), observabilidade distribuída (tracing), versionamento de contratos, testes de integração, infraestrutura (orquestração, service discovery, CI/CD por serviço).
- Anti-padrão: **monolito distribuído**: serviços que precisam ser implantados juntos e se chamam em cadeia síncrona. Tem os custos dos dois mundos e as vantagens de nenhum.

**Lei de Conway**: "a arquitetura de um sistema espelha a estrutura de comunicação da organização". Microsserviços fazem sentido quando há **vários times** que precisam de autonomia.

Resposta madura: **"Começaria com um monolito modular e extrairia serviços quando houvesse uma dor concreta: escala muito diferente entre partes, times independentes, ou isolamento de falhas crítico."**

### Serverless (menção)
Funções executadas sob demanda (Lambda, Cloud Functions): sem servidor para gerenciar, escala automática, paga por execução. Trade-offs: **cold start**, limites de tempo, vendor lock-in, difícil para conexões persistentes.

---

## 3. Arquitetura em camadas

```
Apresentação (controllers, HTTP)
      ↓
Aplicação / Serviço (casos de uso, regra de negócio)
      ↓
Dados / Infraestrutura (repositórios, ORM, APIs externas)
```
Cada camada só conhece a de **baixo**. Simples e suficiente para a maioria dos sistemas. O problema: a regra de negócio acaba **dependendo** da infraestrutura (do ORM, do SDK).

---

## 4. Clean Architecture / Hexagonal (Ports and Adapters)

Ideia central: **o domínio (regra de negócio) fica no centro e não depende de nada externo**. As dependências apontam **para dentro**.

```
      [HTTP]  [CLI]  [Fila]          ← adapters de ENTRADA (driving)
          \     |     /
       ┌───────────────────┐
       │  Casos de uso      │
       │   ┌───────────┐    │
       │   │  Domínio   │    │
       │   └───────────┘    │
       │  Ports (interfaces) │
       └───────────────────┘
          /     |     \
  [Postgres] [OpenAI] [SMTP]         ← adapters de SAÍDA (driven)
```
- **Port**: interface definida pelo núcleo (`RepositorioPedidos`, `ProvedorIA`).
- **Adapter**: implementação concreta na borda (`PostgresRepositorioPedidos`, `OpenAIProvedor`).
- Aplicação direta do **DIP** (inversão de dependência).

Ganhos: regra de negócio **testável sem infraestrutura**, trocar banco/provedor/framework sem tocar no domínio.
Custos: mais arquivos, interfaces e mapeamentos. Para CRUD simples é **overengineering**.

Nomes relacionados: **Hexagonal** (Alistair Cockburn), **Onion**, **Clean Architecture** (Uncle Bob). São variações da mesma ideia.

---

## 5. DDD (Domain-Driven Design): o essencial

Abordagem para software com **domínio complexo**, focada em modelar o negócio junto com os especialistas.

Conceitos **estratégicos**:
- **Linguagem ubíqua**: o mesmo vocabulário no código, nas conversas e na documentação (se o negócio diz "apólice", a classe se chama `Apolice`).
- **Bounded Context** (contexto delimitado): fronteira dentro da qual um modelo tem significado único. "Cliente" no contexto de **Vendas** não é o mesmo que "Cliente" no **Suporte**. Bounded contexts são ótimos candidatos a **módulos** ou **serviços**.
- **Context map**: como os contextos se relacionam (inclusive com **anti-corruption layer**, uma camada de tradução para não "contaminar" seu modelo com o de um sistema legado/externo).

Conceitos **táticos**:
- **Entidade**: tem identidade que persiste no tempo (`Pedido #42`), mesmo mudando atributos.
- **Value Object**: definido só pelos valores, imutável, sem identidade (`Dinheiro(10, BRL)`, `Endereco`, `Email`).
- **Agregado**: grupo de objetos tratado como unidade de consistência, com uma **raiz** (`Pedido` controla seus `Itens`; ninguém altera um item sem passar pelo pedido). Transação = um agregado.
- **Domain Events**: fatos relevantes do domínio (`PedidoConfirmado`).
- **Repositório**: acesso a agregados como se fosse uma coleção.

---

## 6. BFF e API Gateway

### API Gateway
**Porta de entrada única** para vários serviços de backend. Cuida de preocupações transversais:
- **Roteamento** (`/pedidos` → serviço de pedidos).
- **Autenticação** (validar token uma vez na borda).
- **Rate limiting**, quotas, CORS.
- Terminação TLS, logs, métricas.
Exemplos: Kong, AWS API Gateway, Apigee, Traefik, Nginx.

### BFF (Backend for Frontend)
Um backend **dedicado a um tipo de cliente** (um para web, um para mobile), que:
- **Agrega** chamadas a vários serviços numa resposta pensada para aquela tela (menos idas e voltas do cliente).
- **Adapta** o formato ao que o front precisa.
- **Esconde segredos** e serviços internos (ex: a chave do provedor de IA fica no BFF, nunca no navegador).

Diferença: **gateway** é genérico e transversal (infraestrutura); **BFF** tem **lógica específica de um front** (aplicação). Podem coexistir: cliente → gateway → BFF → serviços. Next.js com Route Handlers/Server Components frequentemente faz o papel de BFF.

---

## 7. Registrando decisões: ADR

**ADR** (*Architecture Decision Record*): documento curto registrando **contexto, decisão, alternativas consideradas e consequências (trade-offs)**. Ajuda o time a lembrar **por que** algo foi feito, e é ótimo material para contar em entrevista.

---

## 8. Como falar na entrevista

**"Monolito ou microsserviços?"**
> "Depende do contexto, mas meu padrão é começar com um monolito modular: fronteiras claras entre módulos, cada um dono dos seus dados, com o custo operacional de um deploy só. Microsserviços trazem deploy e escala independentes e autonomia de times, mas cobram latência de rede, consistência eventual, tracing distribuído e muita infraestrutura; e, pela lei de Conway, fazem mais sentido com vários times. Eu extrairia um serviço quando houvesse uma dor concreta, como uma parte com escala muito diferente ou que precisa de isolamento de falhas."

**"O que é arquitetura hexagonal?"**
> "É deixar o domínio e os casos de uso no centro, sem depender de infraestrutura. O núcleo define portas, que são interfaces, e as bordas têm adaptadores: HTTP e fila na entrada, banco e provedores externos na saída. As dependências apontam pra dentro. Ganho testabilidade e posso trocar banco ou provedor sem mexer na regra; o custo é mais indireção, então aplico onde a regra é complexa ou a borda tem chance real de mudar."

---

## 9. Resumo

- Arquitetura = decisões **difíceis de mudar**; guiada por **requisitos não funcionais**; sempre **trade-off**.
- **Monolito** (simples) → **monolito modular** (fronteiras, padrão recomendado) → **microsserviços** (autonomia × complexidade distribuída). Evitar **monolito distribuído**. **Lei de Conway**.
- **Camadas**: simples, mas domínio depende da infra.
- **Hexagonal/Clean**: domínio no centro, **ports & adapters**, dependências para dentro.
- **DDD**: linguagem ubíqua, **bounded context**, anti-corruption layer; entidade, **value object**, **agregado**, domain events.
- **API Gateway** (transversal) × **BFF** (específico de um front, agrega e esconde segredos).
- **ADR** para registrar decisões.

## Termos desta aula
arquitetura · trade-off · requisito não funcional · atributo de qualidade · monolito · big ball of mud · monolito modular · microsserviços · deploy independente · banco por serviço · monolito distribuído · Lei de Conway · serverless · cold start · arquitetura em camadas · Clean Architecture · arquitetura hexagonal · ports and adapters · onion · DIP · overengineering · DDD · linguagem ubíqua · bounded context · context map · anti-corruption layer · entidade · value object · agregado · raiz de agregado · domain event · API Gateway · BFF · ADR

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 09** e separadas por nível.
