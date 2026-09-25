# NestJS — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. Por que usar Nest em vez de Express puro?**
<sub>Aula [01 — O que é o NestJS e por que ele existe](../aulas/01-o-que-e-nest.md)</sub>
<details><summary>Ver resposta</summary>

Padronização, DI nativa (testabilidade), separação de responsabilidades clara e ecossistema oficial (config, validação, filas, auth, swagger). Faz mais diferença em projeto grande e time grande.

</details>

**2. Quando você não usaria Nest?**
<sub>Aula [01 — O que é o NestJS e por que ele existe](../aulas/01-o-que-e-nest.md)</sub>
<details><summary>Ver resposta</summary>

Em coisas pequenas: script, função serverless simples, microserviço com duas rotas. O custo de abstração, boilerplate e curva de aprendizado não compensa; Express/Fastify puro resolve.

</details>

**3. Como o Nest usa metadata?**
<sub>Aula [02 — TypeScript, Decorators e Metadata](../aulas/02-typescript-e-decorators.md)</sub>
<details><summary>Ver resposta</summary>

Os decorators gravam informações com `reflect-metadata` (rota, método HTTP, guards, roles). Na inicialização o Nest lê esses metadados pra registrar rotas e aplicar o pipeline. É programação declarativa.

</details>

**4. Como o Nest sabe o que injetar no construtor?**
<sub>Aula [02 — TypeScript, Decorators e Metadata](../aulas/02-typescript-e-decorators.md)</sub>
<details><summary>Ver resposta</summary>

Com `emitDecoratorMetadata`, o TypeScript grava os tipos dos parâmetros do construtor (`design:paramtypes`) em classes decoradas (`@Injectable`). O container lê esses tipos e resolve as instâncias.

</details>

**5. Por que não dá pra injetar uma interface diretamente?**
<sub>Aula [02 — TypeScript, Decorators e Metadata](../aulas/02-typescript-e-decorators.md)</sub>
<details><summary>Ver resposta</summary>

Porque interfaces só existem em tempo de compilação e somem no JS. O metadado vira `Object`. Solução: token (Symbol/string) com `@Inject(TOKEN)`, ou usar classe abstrata como token.

</details>

**6. O que são dynamic modules e `forRoot`/`forFeature`?**
<sub>Aula [03 — Módulos, Controllers e Providers](../aulas/03-modulos-controllers-providers.md)</sub>
<details><summary>Ver resposta</summary>

Módulos que recebem configuração ao serem importados. `forRoot` configura uma vez, globalmente (conexão de banco); `forFeature` registra uma parte específica pro módulo (entidades). A versão `Async` permite injetar dependências na configuração, como o ConfigService.

</details>

**7. Qual a diferença entre DI, IoC e DIP?**
<sub>Aula [04 — Injeção de Dependência e o IoC Container](../aulas/04-injecao-de-dependencia.md)</sub>
<details><summary>Ver resposta</summary>

IoC: o controle de criar e montar objetos passa pro framework. DI: a técnica de entregar dependências de fora. DIP (o D do SOLID): depender de abstrações, não de implementações. DI é o meio; DIP é o princípio que se cumpre injetando abstrações.

</details>

**8. Quais os tipos de custom provider?**
<sub>Aula [04 — Injeção de Dependência e o IoC Container](../aulas/04-injecao-de-dependencia.md)</sub>
<details><summary>Ver resposta</summary>

`useClass` (entrega uma classe), `useValue` (valor pronto, útil pra mocks e config), `useFactory` (cria via função, podendo injetar outras dependências com `inject`) e `useExisting` (alias pra outro provider).

</details>

**9. Quais os escopos de provider e o problema do escopo REQUEST?**
<sub>Aula [04 — Injeção de Dependência e o IoC Container](../aulas/04-injecao-de-dependencia.md)</sub>
<details><summary>Ver resposta</summary>

Singleton (padrão), REQUEST (nova instância por requisição) e TRANSIENT (nova por consumidor). O REQUEST sobe pela cadeia: quem depende dele também passa a ser recriado a cada requisição, com custo de performance. Alternativa: AsyncLocalStorage (nestjs-cls).

</details>

**10. Diferença entre middleware e guard?**
<sub>Aula [05 — O ciclo de vida da requisição: Middleware, Guards, Interceptors, Pipes e Filters](../aulas/05-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Middleware roda antes do roteamento e não sabe qual handler vai executar. Guard tem o ExecutionContext, então lê metadados da rota (roles, @Public) e decide se a requisição segue. Auth fica no guard.

</details>

**11. Como funciona o tratamento de erros no Nest?**
<sub>Aula [05 — O ciclo de vida da requisição: Middleware, Guards, Interceptors, Pipes e Filters](../aulas/05-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Exceções caem nos exception filters. O filtro global embutido transforma HttpException (e filhas como NotFoundException) no status correspondente, e qualquer outro erro em 500. Filters customizados com `@Catch` traduzem erros de domínio em respostas HTTP.

</details>

**12. Por que o service não deveria lançar `NotFoundException`?**
<sub>Aula [05 — O ciclo de vida da requisição: Middleware, Guards, Interceptors, Pipes e Filters](../aulas/05-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Porque isso acopla a regra de negócio ao HTTP. Se o service for usado por um worker de fila ou microservice, status HTTP não faz sentido. Melhor lançar erro de domínio e deixar um filter traduzir. (Em projetos simples, usar HttpException no service é comum e aceitável.)

</details>

**13. Como funciona o ValidationPipe?**
<sub>Aula [06 — Validação, DTOs e Serialização](../aulas/06-validacao-e-dtos.md)</sub>
<details><summary>Ver resposta</summary>

O class-transformer converte o JSON numa instância do DTO, o class-validator lê os decorators e valida. Se falhar, lança BadRequestException com os erros. Opções principais: whitelist, forbidNonWhitelisted e transform.

</details>

**14. O que é mass assignment e como evitar?**
<sub>Aula [06 — Validação, DTOs e Serialização](../aulas/06-validacao-e-dtos.md)</sub>
<details><summary>Ver resposta</summary>

Quando o cliente envia campos que não deveria (ex: `role: 'admin'`) e o código salva o objeto inteiro. Evita com `whitelist`/`forbidNonWhitelisted` e nunca salvando o body cru direto no banco.

</details>

**15. Por que usar access token curto e refresh token?**
<sub>Aula [07 — Autenticação e Autorização no Nest](../aulas/07-autenticacao-e-autorizacao.md)</sub>
<details><summary>Ver resposta</summary>

JWT é difícil de revogar. Access token curto limita o estrago se vazar; o refresh token, guardado com mais cuidado (cookie httpOnly) e registrado no banco, permite revogar e rotacionar.

</details>

**16. O que é IDOR e como evitar?**
<sub>Aula [07 — Autenticação e Autorização no Nest](../aulas/07-autenticacao-e-autorizacao.md)</sub>
<details><summary>Ver resposta</summary>

Insecure Direct Object Reference: trocar o id na URL e acessar recurso de outro usuário. RBAC não resolve; é preciso checar ownership, normalmente no service, filtrando pelo id do usuário autenticado.

</details>

**17. TypeORM vs Prisma?**
<sub>Aula [08 — Banco de dados no Nest: ORM, Repository, Transações e Migrations](../aulas/08-banco-de-dados.md)</sub>
<details><summary>Ver resposta</summary>

TypeORM: entidades como classes com decorators, repository, integração oficial com Nest. Prisma: schema próprio, client gerado com tipos muito precisos, migrations a partir do schema. Escolha costuma ser por tipagem e DX (Prisma) vs padrão de classes/Data Mapper (TypeORM).

</details>

**18. Pra que serve o padrão Repository?**
<sub>Aula [08 — Banco de dados no Nest: ORM, Repository, Transações e Migrations](../aulas/08-banco-de-dados.md)</sub>
<details><summary>Ver resposta</summary>

Encapsular o acesso a dados. O service depende de uma abstração, não do ORM, o que permite trocar a persistência e testar com repositório em memória. Custo: mais uma camada.

</details>

**19. Por que usar migrations e não `synchronize: true`?**
<sub>Aula [08 — Banco de dados no Nest: ORM, Repository, Transações e Migrations](../aulas/08-banco-de-dados.md)</sub>
<details><summary>Ver resposta</summary>

Migrations versionam o schema junto com o código, são revisáveis e reproduzíveis em todos os ambientes. `synchronize` altera o banco automaticamente e pode apagar colunas e dados em produção.

</details>

**20. EventEmitter ou fila?**
<sub>Aula [09 — Configuração, Filas, Eventos e Tarefas agendadas](../aulas/09-config-filas-eventos-cron.md)</sub>
<details><summary>Ver resposta</summary>

EventEmitter: pub/sub em memória, desacopla módulos, custo zero, mas perde o evento se o processo cair e não chega em outras instâncias. Fila: persistente, com retry e DLQ, distribuída. Efeito que não pode se perder vai pra fila.

</details>

**21. Qual o problema de `@Cron` com várias réplicas?**
<sub>Aula [09 — Configuração, Filas, Eventos e Tarefas agendadas](../aulas/09-config-filas-eventos-cron.md)</sub>
<details><summary>Ver resposta</summary>

Cada instância executa o cron, então ele roda N vezes. Soluções: job repetido do BullMQ, lock distribuído no Redis, ou agendador separado/da nuvem.

</details>

**22. Quando não aplicar Clean Architecture?**
<sub>Aula [10 — Arquitetura, Testes e Microservices no Nest](../aulas/10-arquitetura-testes-microservices.md)</sub>
<details><summary>Ver resposta</summary>

Em CRUDs simples ou projetos pequenos, onde a indireção extra é overengineering. Aplicar nas bordas com chance real de mudar ou que precisam ser testadas isoladas.

</details>

**23. `@MessagePattern` vs `@EventPattern`? Microservices valem a pena?**
<sub>Aula [10 — Arquitetura, Testes e Microservices no Nest](../aulas/10-arquitetura-testes-microservices.md)</sub>
<details><summary>Ver resposta</summary>

MessagePattern é request-response (espera resposta); EventPattern é evento fire-and-forget. Microservices trazem custo de rede, consistência eventual e observabilidade distribuída; prefiro monolito modular até haver uma necessidade concreta (escala ou times independentes).

</details>

**24. Como evitar o problema N+1 em resolvers GraphQL?**
<sub>Aula [11 — GraphQL, subscriptions e WebSockets](../aulas/11-graphql-e-websockets.md)</sub>
<details><summary>Ver resposta</summary>

Uso DataLoader por requisição para agrupar buscas de campos relacionados numa consulta em lote, em vez de consultar uma vez por item. Também seleciono apenas os dados necessários e imponho limites de profundidade, complexidade e paginação. DataLoader precisa respeitar autorização e não deve compartilhar cache entre usuários.

</details>

**25. Gateway WebSocket ou GraphQL subscription: como escolher?**
<sub>Aula [11 — GraphQL, subscriptions e WebSockets](../aulas/11-graphql-e-websockets.md)</sub>
<details><summary>Ver resposta</summary>

Gateway é a opção geral para eventos bidirecionais e protocolos como Socket.IO; subscription entrega eventos no modelo GraphQL e no transporte suportado pelo servidor, normalmente graphql-ws. Se já existe uma API GraphQL e os eventos seguem o schema, subscription integra bem. Para chat ou protocolos específicos, gateway pode ser mais claro; ambos precisam de escala e autorização.

</details>
