# NestJS — perguntas

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

As perguntas estão separadas por **nível**, e cada uma indica a aula de onde vem.

---

## Nível 1 — O que é?

_Definições. Tem que sair sem pensar._

**1. O que é o NestJS?**
<sub>Aula [01 — O que é o NestJS e por que ele existe](aulas/01-o-que-e-nest.md)</sub>
<details><summary>Ver resposta</summary>

Framework Node opinativo, em TypeScript, para backend, com arquitetura modular, injeção de dependência e pipeline de requisição (guards, pipes, interceptors, filters). Roda sobre Express (padrão) ou Fastify.

</details>

**2. O que significa ser um framework "opinativo"?**
<sub>Aula [01 — O que é o NestJS e por que ele existe](aulas/01-o-que-e-nest.md)</sub>
<details><summary>Ver resposta</summary>

O framework já decide boa parte da estrutura: como organizar módulos, onde fica cada responsabilidade, como injetar dependências. Perde-se liberdade e ganha-se padronização e previsibilidade entre projetos.

</details>

**3. Nest substitui o Express?**
<sub>Aula [01 — O que é o NestJS e por que ele existe](aulas/01-o-que-e-nest.md)</sub>
<details><summary>Ver resposta</summary>

Não. É uma camada de arquitetura por cima de uma plataforma HTTP, Express por padrão ou Fastify. O código Nest é independente da plataforma escolhida.

</details>

**4. O que é um decorator?**
<sub>Aula [02 — TypeScript, Decorators e Metadata](aulas/02-typescript-e-decorators.md)</sub>
<details><summary>Ver resposta</summary>

Função aplicada com `@` sobre classe, método, propriedade ou parâmetro, que adiciona comportamento ou metadados. No Nest, a maioria só grava metadados que o framework lê depois.

</details>

**5. Qual o papel do controller e do service?**
<sub>Aula [03 — Módulos, Controllers e Providers](aulas/03-modulos-controllers-providers.md)</sub>
<details><summary>Ver resposta</summary>

Controller é a entrada HTTP: recebe, extrai parâmetros, valida via DTO e delega. Service é onde fica a regra de negócio. Controller deve ser magro.

</details>

**6. O que é um provider?**
<sub>Aula [03 — Módulos, Controllers e Providers](aulas/03-modulos-controllers-providers.md)</sub>
<details><summary>Ver resposta</summary>

Qualquer coisa que o container do Nest pode injetar: services, repositories, factories, clients, valores de config. Por padrão é singleton.

</details>

**7. Explique `imports`, `providers` e `exports` de um módulo.**
<sub>Aula [03 — Módulos, Controllers e Providers](aulas/03-modulos-controllers-providers.md)</sub>
<details><summary>Ver resposta</summary>

`providers`: o que o módulo cria e usa internamente. `exports`: quais desses ficam visíveis pra quem importar o módulo. `imports`: módulos cujos exports eu quero usar. Provider não exportado é privado.

</details>

**8. O que é injeção de dependência?**
<sub>Aula [04 — Injeção de Dependência e o IoC Container](aulas/04-injecao-de-dependencia.md)</sub>
<details><summary>Ver resposta</summary>

A classe recebe as dependências prontas, normalmente pelo construtor, em vez de criá-las. Reduz acoplamento e permite trocar implementações e usar mocks em teste.

</details>

**9. Qual a ordem do ciclo de vida da requisição no Nest?**
<sub>Aula [05 — O ciclo de vida da requisição: Middleware, Guards, Interceptors, Pipes e Filters](aulas/05-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Middleware → Guards → Interceptors (antes) → Pipes → Handler → Interceptors (depois) → Exception Filters (se houver erro).

</details>

**10. Pra que servem interceptors? Dê exemplos.**
<sub>Aula [05 — O ciclo de vida da requisição: Middleware, Guards, Interceptors, Pipes e Filters](aulas/05-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Envolvem o handler, agindo antes e depois via RxJS. Exemplos: padronizar formato de resposta, logar tempo de execução, cache, timeout, serialização (remover campos). É o conceito de AOP.

</details>

**11. O que faz um pipe?**
<sub>Aula [05 — O ciclo de vida da requisição: Middleware, Guards, Interceptors, Pipes e Filters](aulas/05-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Recebe o valor de um argumento antes do handler e transforma (string → número) ou valida, lançando 400 se inválido. Ex: ValidationPipe, ParseIntPipe, ParseUUIDPipe.

</details>

**12. O que é um DTO e por que classe e não interface?**
<sub>Aula [06 — Validação, DTOs e Serialização](aulas/06-validacao-e-dtos.md)</sub>
<details><summary>Ver resposta</summary>

Objeto que define o formato de entrada/saída, o contrato da rota. É classe porque precisa existir em runtime pros decorators de validação serem lidos; interface some.

</details>

**13. Diferença entre autenticação e autorização? E entre 401 e 403?**
<sub>Aula [07 — Autenticação e Autorização no Nest](aulas/07-autenticacao-e-autorizacao.md)</sub>
<details><summary>Ver resposta</summary>

Autenticação: quem você é. Autorização: o que você pode fazer. 401: não autenticado (sem token, inválido, expirado). 403: autenticado mas sem permissão.

</details>

**14. Como funciona um JWT? O payload é seguro?**
<sub>Aula [07 — Autenticação e Autorização no Nest](aulas/07-autenticacao-e-autorizacao.md)</sub>
<details><summary>Ver resposta</summary>

header.payload.signature em Base64URL. A assinatura (HS256 com segredo ou RS256 com chave privada) garante integridade. O payload é só codificado, qualquer um lê; nunca colocar dado sensível.

</details>

**15. O que é um ORM? Vantagens e desvantagens?**
<sub>Aula [08 — Banco de dados no Nest: ORM, Repository, Transações e Migrations](aulas/08-banco-de-dados.md)</sub>
<details><summary>Ver resposta</summary>

Mapeia tabelas pra objetos. Vantagens: produtividade, tipagem, proteção contra SQL injection, migrations. Desvantagens: abstração que vaza, fácil gerar queries ruins (N+1), queries complexas podem ficar piores que SQL.

</details>

**16. O que é arquitetura hexagonal (ports and adapters)?**
<sub>Aula [10 — Arquitetura, Testes e Microservices no Nest](aulas/10-arquitetura-testes-microservices.md)</sub>
<details><summary>Ver resposta</summary>

O domínio e os casos de uso ficam no centro e dependem de portas (interfaces) que eles definem; a infraestrutura implementa adaptadores (ORM, provider de IA, fila). As dependências apontam pra dentro. No Nest, portas viram tokens de injeção.

</details>

**17. Diferença entre mock, stub, fake e spy?**
<sub>Aula [10 — Arquitetura, Testes e Microservices no Nest](aulas/10-arquitetura-testes-microservices.md)</sub>
<details><summary>Ver resposta</summary>

Stub: retorna valores fixos. Mock: comportamento programado e verificação de chamadas. Fake: implementação simples funcional (repositório em memória). Spy: observa uma função real registrando chamadas.

</details>

---

## Nível 2 — Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**18. Por que usar Nest em vez de Express puro?**
<sub>Aula [01 — O que é o NestJS e por que ele existe](aulas/01-o-que-e-nest.md)</sub>
<details><summary>Ver resposta</summary>

Padronização, DI nativa (testabilidade), separação de responsabilidades clara e ecossistema oficial (config, validação, filas, auth, swagger). Faz mais diferença em projeto grande e time grande.

</details>

**19. Quando você não usaria Nest?**
<sub>Aula [01 — O que é o NestJS e por que ele existe](aulas/01-o-que-e-nest.md)</sub>
<details><summary>Ver resposta</summary>

Em coisas pequenas: script, função serverless simples, microserviço com duas rotas. O custo de abstração, boilerplate e curva de aprendizado não compensa; Express/Fastify puro resolve.

</details>

**20. Como o Nest usa metadata?**
<sub>Aula [02 — TypeScript, Decorators e Metadata](aulas/02-typescript-e-decorators.md)</sub>
<details><summary>Ver resposta</summary>

Os decorators gravam informações com `reflect-metadata` (rota, método HTTP, guards, roles). Na inicialização o Nest lê esses metadados pra registrar rotas e aplicar o pipeline. É programação declarativa.

</details>

**21. Como o Nest sabe o que injetar no construtor?**
<sub>Aula [02 — TypeScript, Decorators e Metadata](aulas/02-typescript-e-decorators.md)</sub>
<details><summary>Ver resposta</summary>

Com `emitDecoratorMetadata`, o TypeScript grava os tipos dos parâmetros do construtor (`design:paramtypes`) em classes decoradas (`@Injectable`). O container lê esses tipos e resolve as instâncias.

</details>

**22. Por que não dá pra injetar uma interface diretamente?**
<sub>Aula [02 — TypeScript, Decorators e Metadata](aulas/02-typescript-e-decorators.md)</sub>
<details><summary>Ver resposta</summary>

Porque interfaces só existem em tempo de compilação e somem no JS. O metadado vira `Object`. Solução: token (Symbol/string) com `@Inject(TOKEN)`, ou usar classe abstrata como token.

</details>

**23. O que são dynamic modules e `forRoot`/`forFeature`?**
<sub>Aula [03 — Módulos, Controllers e Providers](aulas/03-modulos-controllers-providers.md)</sub>
<details><summary>Ver resposta</summary>

Módulos que recebem configuração ao serem importados. `forRoot` configura uma vez, globalmente (conexão de banco); `forFeature` registra uma parte específica pro módulo (entidades). A versão `Async` permite injetar dependências na configuração, como o ConfigService.

</details>

**24. Qual a diferença entre DI, IoC e DIP?**
<sub>Aula [04 — Injeção de Dependência e o IoC Container](aulas/04-injecao-de-dependencia.md)</sub>
<details><summary>Ver resposta</summary>

IoC: o controle de criar e montar objetos passa pro framework. DI: a técnica de entregar dependências de fora. DIP (o D do SOLID): depender de abstrações, não de implementações. DI é o meio; DIP é o princípio que se cumpre injetando abstrações.

</details>

**25. Quais os tipos de custom provider?**
<sub>Aula [04 — Injeção de Dependência e o IoC Container](aulas/04-injecao-de-dependencia.md)</sub>
<details><summary>Ver resposta</summary>

`useClass` (entrega uma classe), `useValue` (valor pronto, útil pra mocks e config), `useFactory` (cria via função, podendo injetar outras dependências com `inject`) e `useExisting` (alias pra outro provider).

</details>

**26. Quais os escopos de provider e o problema do escopo REQUEST?**
<sub>Aula [04 — Injeção de Dependência e o IoC Container](aulas/04-injecao-de-dependencia.md)</sub>
<details><summary>Ver resposta</summary>

Singleton (padrão), REQUEST (nova instância por requisição) e TRANSIENT (nova por consumidor). O REQUEST sobe pela cadeia: quem depende dele também passa a ser recriado a cada requisição, com custo de performance. Alternativa: AsyncLocalStorage (nestjs-cls).

</details>

**27. Diferença entre middleware e guard?**
<sub>Aula [05 — O ciclo de vida da requisição: Middleware, Guards, Interceptors, Pipes e Filters](aulas/05-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Middleware roda antes do roteamento e não sabe qual handler vai executar. Guard tem o ExecutionContext, então lê metadados da rota (roles, @Public) e decide se a requisição segue. Auth fica no guard.

</details>

**28. Como funciona o tratamento de erros no Nest?**
<sub>Aula [05 — O ciclo de vida da requisição: Middleware, Guards, Interceptors, Pipes e Filters](aulas/05-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Exceções caem nos exception filters. O filtro global embutido transforma HttpException (e filhas como NotFoundException) no status correspondente, e qualquer outro erro em 500. Filters customizados com `@Catch` traduzem erros de domínio em respostas HTTP.

</details>

**29. Por que o service não deveria lançar `NotFoundException`?**
<sub>Aula [05 — O ciclo de vida da requisição: Middleware, Guards, Interceptors, Pipes e Filters](aulas/05-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Porque isso acopla a regra de negócio ao HTTP. Se o service for usado por um worker de fila ou microservice, status HTTP não faz sentido. Melhor lançar erro de domínio e deixar um filter traduzir. (Em projetos simples, usar HttpException no service é comum e aceitável.)

</details>

**30. Como funciona o ValidationPipe?**
<sub>Aula [06 — Validação, DTOs e Serialização](aulas/06-validacao-e-dtos.md)</sub>
<details><summary>Ver resposta</summary>

O class-transformer converte o JSON numa instância do DTO, o class-validator lê os decorators e valida. Se falhar, lança BadRequestException com os erros. Opções principais: whitelist, forbidNonWhitelisted e transform.

</details>

**31. O que é mass assignment e como evitar?**
<sub>Aula [06 — Validação, DTOs e Serialização](aulas/06-validacao-e-dtos.md)</sub>
<details><summary>Ver resposta</summary>

Quando o cliente envia campos que não deveria (ex: `role: 'admin'`) e o código salva o objeto inteiro. Evita com `whitelist`/`forbidNonWhitelisted` e nunca salvando o body cru direto no banco.

</details>

**32. Por que usar access token curto e refresh token?**
<sub>Aula [07 — Autenticação e Autorização no Nest](aulas/07-autenticacao-e-autorizacao.md)</sub>
<details><summary>Ver resposta</summary>

JWT é difícil de revogar. Access token curto limita o estrago se vazar; o refresh token, guardado com mais cuidado (cookie httpOnly) e registrado no banco, permite revogar e rotacionar.

</details>

**33. O que é IDOR e como evitar?**
<sub>Aula [07 — Autenticação e Autorização no Nest](aulas/07-autenticacao-e-autorizacao.md)</sub>
<details><summary>Ver resposta</summary>

Insecure Direct Object Reference: trocar o id na URL e acessar recurso de outro usuário. RBAC não resolve; é preciso checar ownership, normalmente no service, filtrando pelo id do usuário autenticado.

</details>

**34. TypeORM vs Prisma?**
<sub>Aula [08 — Banco de dados no Nest: ORM, Repository, Transações e Migrations](aulas/08-banco-de-dados.md)</sub>
<details><summary>Ver resposta</summary>

TypeORM: entidades como classes com decorators, repository, integração oficial com Nest. Prisma: schema próprio, client gerado com tipos muito precisos, migrations a partir do schema. Escolha costuma ser por tipagem e DX (Prisma) vs padrão de classes/Data Mapper (TypeORM).

</details>

**35. Pra que serve o padrão Repository?**
<sub>Aula [08 — Banco de dados no Nest: ORM, Repository, Transações e Migrations](aulas/08-banco-de-dados.md)</sub>
<details><summary>Ver resposta</summary>

Encapsular o acesso a dados. O service depende de uma abstração, não do ORM, o que permite trocar a persistência e testar com repositório em memória. Custo: mais uma camada.

</details>

**36. Por que usar migrations e não `synchronize: true`?**
<sub>Aula [08 — Banco de dados no Nest: ORM, Repository, Transações e Migrations](aulas/08-banco-de-dados.md)</sub>
<details><summary>Ver resposta</summary>

Migrations versionam o schema junto com o código, são revisáveis e reproduzíveis em todos os ambientes. `synchronize` altera o banco automaticamente e pode apagar colunas e dados em produção.

</details>

**37. EventEmitter ou fila?**
<sub>Aula [09 — Configuração, Filas, Eventos e Tarefas agendadas](aulas/09-config-filas-eventos-cron.md)</sub>
<details><summary>Ver resposta</summary>

EventEmitter: pub/sub em memória, desacopla módulos, custo zero, mas perde o evento se o processo cair e não chega em outras instâncias. Fila: persistente, com retry e DLQ, distribuída. Efeito que não pode se perder vai pra fila.

</details>

**38. Qual o problema de `@Cron` com várias réplicas?**
<sub>Aula [09 — Configuração, Filas, Eventos e Tarefas agendadas](aulas/09-config-filas-eventos-cron.md)</sub>
<details><summary>Ver resposta</summary>

Cada instância executa o cron, então ele roda N vezes. Soluções: job repetido do BullMQ, lock distribuído no Redis, ou agendador separado/da nuvem.

</details>

**39. Quando não aplicar Clean Architecture?**
<sub>Aula [10 — Arquitetura, Testes e Microservices no Nest](aulas/10-arquitetura-testes-microservices.md)</sub>
<details><summary>Ver resposta</summary>

Em CRUDs simples ou projetos pequenos, onde a indireção extra é overengineering. Aplicar nas bordas com chance real de mudar ou que precisam ser testadas isoladas.

</details>

**40. `@MessagePattern` vs `@EventPattern`? Microservices valem a pena?**
<sub>Aula [10 — Arquitetura, Testes e Microservices no Nest](aulas/10-arquitetura-testes-microservices.md)</sub>
<details><summary>Ver resposta</summary>

MessagePattern é request-response (espera resposta); EventPattern é evento fire-and-forget. Microservices trazem custo de rede, consistência eventual e observabilidade distribuída; prefiro monolito modular até haver uma necessidade concreta (escala ou times independentes).

</details>

---

## Nível 3 — Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**41. Como criar um decorator `@Public()` ou `@UsuarioAtual()`?**
<sub>Aula [02 — TypeScript, Decorators e Metadata](aulas/02-typescript-e-decorators.md)</sub>
<details><summary>Ver resposta</summary>

`@Public()` com `SetMetadata('isPublic', true)`, lido por um guard via `Reflector`. `@UsuarioAtual()` com `createParamDecorator` retornando `request.user`. Pra combinar vários, `applyDecorators`.

</details>

**42. O que significa o erro "Nest can't resolve dependencies of X"?**
<sub>Aula [03 — Módulos, Controllers e Providers](aulas/03-modulos-controllers-providers.md)</sub>
<details><summary>Ver resposta</summary>

O container não encontrou uma dependência no contexto do módulo. Normalmente o provider não está em `providers`, o módulo dele não foi importado, ou ele não foi exportado. Também pode ser dependência circular ou token errado.

</details>

**43. Como trocaria o provider de IA sem mexer na regra de negócio?**
<sub>Aula [04 — Injeção de Dependência e o IoC Container](aulas/04-injecao-de-dependencia.md)</sub>
<details><summary>Ver resposta</summary>

Defino uma abstração `AIProvider` e um token. O service injeta o token com `@Inject`. No módulo registro `useClass` ou `useFactory` escolhendo OpenAI ou Anthropic por config. A regra de negócio não muda.

</details>

**44. Como resolver dependência circular?**
<sub>Aula [04 — Injeção de Dependência e o IoC Container](aulas/04-injecao-de-dependencia.md)</sub>
<details><summary>Ver resposta</summary>

Tecnicamente com `forwardRef()`. Mas geralmente é cheiro de design: melhor extrair o que é comum pra um terceiro módulo/service ou usar eventos.

</details>

**45. Como evitar vazar a senha na resposta?**
<sub>Aula [06 — Validação, DTOs e Serialização](aulas/06-validacao-e-dtos.md)</sub>
<details><summary>Ver resposta</summary>

Não retornar a entidade do banco direto. Usar DTO de resposta mapeado no service, ou `@Exclude()` com ClassSerializerInterceptor (retornando instância da classe).

</details>

**46. Como deixar todas as rotas protegidas por padrão?**
<sub>Aula [07 — Autenticação e Autorização no Nest](aulas/07-autenticacao-e-autorizacao.md)</sub>
<details><summary>Ver resposta</summary>

Registrar o JwtAuthGuard como guard global via `APP_GUARD`, e criar um decorator `@Public()` que o guard lê via Reflector pra liberar as exceções. Secure by default: esquecer o decorator deixa a rota fechada.

</details>

**47. Como fazer uma transação no Nest? Cuidados?**
<sub>Aula [08 — Banco de dados no Nest: ORM, Repository, Transações e Migrations](aulas/08-banco-de-dados.md)</sub>
<details><summary>Ver resposta</summary>

`dataSource.transaction(manager => ...)` no TypeORM ou `prisma.$transaction(tx => ...)`. Todas as operações devem usar o mesmo manager/tx; não fazer chamada HTTP externa dentro da transação pra não segurar conexão e locks.

</details>

**48. Como você gerencia configuração no Nest?**
<sub>Aula [09 — Configuração, Filas, Eventos e Tarefas agendadas](aulas/09-config-filas-eventos-cron.md)</sub>
<details><summary>Ver resposta</summary>

`ConfigModule.forRoot({ isGlobal: true, validate })` lendo variáveis de ambiente (12-Factor), validando no boot pra falhar cedo, e `ConfigService` injetado. Segredos fora do git, vindos de secret manager em produção.

</details>

**49. Como integrar BullMQ no Nest?**
<sub>Aula [09 — Configuração, Filas, Eventos e Tarefas agendadas](aulas/09-config-filas-eventos-cron.md)</sub>
<details><summary>Ver resposta</summary>

`BullModule.forRoot` (conexão Redis), `registerQueue`, `@InjectQueue` pra enfileirar no service, e uma classe `@Processor` que estende `WorkerHost` com o método `process`. O worker pode rodar num processo separado.

</details>

**50. Como testar um service com dependências?**
<sub>Aula [10 — Arquitetura, Testes e Microservices no Nest](aulas/10-arquitetura-testes-microservices.md)</sub>
<details><summary>Ver resposta</summary>

`Test.createTestingModule` registrando o service real e as dependências como mocks via `useValue` (ou `overrideProvider`). Pra integração, banco real em container (Testcontainers) e só o externo mockado.

</details>
