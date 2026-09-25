# NestJS — perguntas, nível 3: Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [índice](README.md)

---

**1. Como criar um decorator `@Public()` ou `@UsuarioAtual()`?**
<sub>Aula [02 — TypeScript, Decorators e Metadata](../aulas/02-typescript-e-decorators.md)</sub>
<details><summary>Ver resposta</summary>

`@Public()` com `SetMetadata('isPublic', true)`, lido por um guard via `Reflector`. `@UsuarioAtual()` com `createParamDecorator` retornando `request.user`. Pra combinar vários, `applyDecorators`.

</details>

**2. O que significa o erro "Nest can't resolve dependencies of X"?**
<sub>Aula [03 — Módulos, Controllers e Providers](../aulas/03-modulos-controllers-providers.md)</sub>
<details><summary>Ver resposta</summary>

O container não encontrou uma dependência no contexto do módulo. Normalmente o provider não está em `providers`, o módulo dele não foi importado, ou ele não foi exportado. Também pode ser dependência circular ou token errado.

</details>

**3. Como trocaria o provider de IA sem mexer na regra de negócio?**
<sub>Aula [04 — Injeção de Dependência e o IoC Container](../aulas/04-injecao-de-dependencia.md)</sub>
<details><summary>Ver resposta</summary>

Defino uma abstração `AIProvider` e um token. O service injeta o token com `@Inject`. No módulo registro `useClass` ou `useFactory` escolhendo OpenAI ou Anthropic por config. A regra de negócio não muda.

</details>

**4. Como resolver dependência circular?**
<sub>Aula [04 — Injeção de Dependência e o IoC Container](../aulas/04-injecao-de-dependencia.md)</sub>
<details><summary>Ver resposta</summary>

Tecnicamente com `forwardRef()`. Mas geralmente é cheiro de design: melhor extrair o que é comum pra um terceiro módulo/service ou usar eventos.

</details>

**5. Como evitar vazar a senha na resposta?**
<sub>Aula [06 — Validação, DTOs e Serialização](../aulas/06-validacao-e-dtos.md)</sub>
<details><summary>Ver resposta</summary>

Não retornar a entidade do banco direto. Usar DTO de resposta mapeado no service, ou `@Exclude()` com ClassSerializerInterceptor (retornando instância da classe).

</details>

**6. Como deixar todas as rotas protegidas por padrão?**
<sub>Aula [07 — Autenticação e Autorização no Nest](../aulas/07-autenticacao-e-autorizacao.md)</sub>
<details><summary>Ver resposta</summary>

Registrar o JwtAuthGuard como guard global via `APP_GUARD`, e criar um decorator `@Public()` que o guard lê via Reflector pra liberar as exceções. Secure by default: esquecer o decorator deixa a rota fechada.

</details>

**7. Como fazer uma transação no Nest? Cuidados?**
<sub>Aula [08 — Banco de dados no Nest: ORM, Repository, Transações e Migrations](../aulas/08-banco-de-dados.md)</sub>
<details><summary>Ver resposta</summary>

`dataSource.transaction(manager => ...)` no TypeORM ou `prisma.$transaction(tx => ...)`. Todas as operações devem usar o mesmo manager/tx; não fazer chamada HTTP externa dentro da transação pra não segurar conexão e locks.

</details>

**8. Como você gerencia configuração no Nest?**
<sub>Aula [09 — Configuração, Filas, Eventos e Tarefas agendadas](../aulas/09-config-filas-eventos-cron.md)</sub>
<details><summary>Ver resposta</summary>

`ConfigModule.forRoot({ isGlobal: true, validate })` lendo variáveis de ambiente (12-Factor), validando no boot pra falhar cedo, e `ConfigService` injetado. Segredos fora do git, vindos de secret manager em produção.

</details>

**9. Como integrar BullMQ no Nest?**
<sub>Aula [09 — Configuração, Filas, Eventos e Tarefas agendadas](../aulas/09-config-filas-eventos-cron.md)</sub>
<details><summary>Ver resposta</summary>

`BullModule.forRoot` (conexão Redis), `registerQueue`, `@InjectQueue` pra enfileirar no service, e uma classe `@Processor` que estende `WorkerHost` com o método `process`. O worker pode rodar num processo separado.

</details>

**10. Como testar um service com dependências?**
<sub>Aula [10 — Arquitetura, Testes e Microservices no Nest](../aulas/10-arquitetura-testes-microservices.md)</sub>
<details><summary>Ver resposta</summary>

`Test.createTestingModule` registrando o service real e as dependências como mocks via `useValue` (ou `overrideProvider`). Pra integração, banco real em container (Testcontainers) e só o externo mockado.

</details>

**11. Como desenharia notificações em tempo real para uma API Nest com várias réplicas?**
<sub>Aula [11 — GraphQL, subscriptions e WebSockets](../aulas/11-graphql-e-websockets.md)</sub>
<details><summary>Ver resposta</summary>

Definiria o contrato e a autorização do canal, emitiria eventos a partir da regra de domínio e usaria um broker compartilhado para alcançar sockets em todas as réplicas. Escolheria subscriptions se o cliente já usa GraphQL, ou gateway para eventos independentes do schema; protegeria handshake e cada assinatura. Acrescentaria reconexão, limites de conexões, métricas, persistência do histórico e testes de escala.

</details>
