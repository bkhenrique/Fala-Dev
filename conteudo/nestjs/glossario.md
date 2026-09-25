# NestJS — glossário

Cada termo tem três partes: **Em uma frase** (a definição curta), **Traduzindo** (a explicação simples) e **Como falar** (uma frase pronta pra treinar em voz alta). Alguns trazem também **Não confundir com** ou **Cuidado**.

É material de revisão: a explicação completa está nas [aulas](README.md).

---

### NestJS
- **Em uma frase:** framework Node.js *opinativo* pra backend, em TypeScript, com arquitetura modular e injeção de dependência, inspirado no Angular.
- **Traduzindo:** o Express te dá liberdade total; o Nest te dá uma estrutura pronta e padronizada.
- **Como falar:** "Escolhemos Nest pela arquitetura opinativa: padroniza o projeto, facilita *onboarding* e testes, e roda sobre Express ou Fastify."

### Module
- **Em uma frase:** unidade de organização que agrupa controllers e providers de um mesmo domínio.
- **Traduzindo:** uma "caixa" por assunto: `UsersModule`, `PaymentsModule`.
- **Como falar:** "Organizo por módulos de domínio e exporto só os providers que outros módulos precisam, pra manter o encapsulamento."

### Controller
- **Em uma frase:** camada que recebe a requisição HTTP, mapeia rotas e delega pro service.
- **Traduzindo:** o atendente: recebe o pedido e passa pra quem resolve.
- **Como falar:** "Mantenho controllers finos, sem regra de negócio, só roteamento e contrato de entrada/saída."

### Provider / Service
- **Em uma frase:** classe marcada com `@Injectable()` que o container de DI gerencia e injeta onde for preciso; normalmente onde fica a regra de negócio.
- **Traduzindo:** quem de fato faz o trabalho.
- **Como falar:** "A regra de negócio fica nos services, que são providers injetados via construtor."

### Injeção de Dependência (DI) e IoC
- **Em uma frase:** em vez da classe criar suas dependências (`new`), ela as recebe prontas; o controle da criação é invertido pro framework (*Inversion of Control*).
- **Traduzindo:** você não vai na cozinha buscar os ingredientes, eles chegam na sua bancada.
- **Como falar:** "O IoC container do Nest resolve o grafo de dependências e injeta via construtor, o que facilita trocar implementações e *mockar* em teste."

### Decorator
- **Em uma frase:** função que adiciona metadados ou comportamento a classes, métodos e parâmetros (`@Controller`, `@Get`, `@Body`).
- **Traduzindo:** etiquetas que dizem ao framework o que fazer com aquele código.
- **Como falar:** "O Nest usa decorators e *reflect-metadata* pra montar rotas, validação e injeção de forma declarativa."

### Guard
- **Em uma frase:** decide se a requisição pode seguir ou não (retorna `true`/`false`), usado pra autenticação e autorização.
- **Traduzindo:** o segurança na porta.
- **Como falar:** "Implementei um `JwtAuthGuard` global e um `RolesGuard` que lê as roles via metadata do decorator `@Roles()`."

### Pipe
- **Em uma frase:** transforma ou valida os dados de entrada antes de chegarem no controller.
- **Traduzindo:** o filtro que confere e ajeita o que chegou.
- **Como falar:** "Uso `ValidationPipe` global com `whitelist` pra validar DTOs e descartar campos não esperados."

### Interceptor
- **Em uma frase:** envolve a execução do handler, podendo agir antes e depois (log, cache, transformar resposta, timeout).
- **Traduzindo:** um "embrulho" em volta da chamada.
- **Como falar:** "Criei um interceptor pra padronizar o formato da resposta e medir o tempo de cada request."

### Exception Filter
- **Em uma frase:** captura exceções lançadas e as transforma numa resposta HTTP padronizada.
- **Traduzindo:** o SAC que traduz o erro interno numa mensagem decente pro cliente.
- **Como falar:** "Um exception filter global converte erros de domínio em status HTTP e esconde *stack trace* em produção."

### Middleware
- **Em uma frase:** função executada antes do roteamento, com acesso a `req`, `res` e `next`, igual ao Express.
- **Traduzindo:** o primeiro filtro, antes de saber qual rota vai atender.
- **Como falar:** "Middleware pra coisas genéricas como *correlation id*; guard quando a decisão depende do contexto da rota."

### DTO (Data Transfer Object)
- **Em uma frase:** objeto que define o formato dos dados que entram ou saem da API.
- **Traduzindo:** o "formulário oficial" que a requisição tem que preencher.
- **Como falar:** "DTOs com class-validator definem o contrato da API e servem de base pra documentação Swagger."

### Escopo de Provider
- **Em uma frase:** *singleton* (padrão, uma instância pra app inteira), *request* (uma por requisição), *transient* (uma por injeção).
- **Traduzindo:** quantas cópias daquela classe existem.
- **Como falar:** "Evito escopo *request* porque ele se propaga pela cadeia de dependências e tem custo de performance."

### Custom Provider
- **Em uma frase:** registrar um provider de forma customizada com `useClass`, `useValue`, `useFactory` ou `useExisting`.
- **Traduzindo:** dizer ao Nest exatamente como criar aquela dependência.
- **Como falar:** "Registrei um token `AI_PROVIDER` com `useClass` apontando pra implementação escolhida por config, aplicando inversão de dependência."


### Resolver
- **Em uma frase:** função que fornece o valor de um campo, Query, Mutation ou Subscription do schema GraphQL.
- **Traduzindo:** a peça que responde a cada campo pedido pelo cliente.
- **Como falar:** "Mantenho resolver fino e delego regra de negócio a providers."

### DataLoader
- **Em uma frase:** utilitário por requisição que agrupa e deduplica buscas para evitar N+1.
- **Traduzindo:** espera juntar várias consultas pequenas e resolve com uma busca em lote.
- **Como falar:** "Crio DataLoader por usuário e por requisição, sem misturar cache nem autorização."

### GraphQL Subscription
- **Em uma frase:** operação GraphQL que mantém um canal para entregar eventos selecionados pelo cliente.
- **Traduzindo:** uma assinatura que recebe atualizações quando algo acontece.
- **Como falar:** "Uso subscription quando o tempo real faz parte do contrato GraphQL e limito o acesso ao fluxo."

### WebSocket Gateway
- **Em uma frase:** provider Nest que recebe mensagens e envia eventos por conexões WebSocket.
- **Traduzindo:** controller para mensagens persistentes.
- **Como falar:** "Gateway integra com DI e guards, mas precisa de adapter compartilhado quando há várias réplicas."
