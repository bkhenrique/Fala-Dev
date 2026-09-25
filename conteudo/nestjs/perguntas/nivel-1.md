# NestJS — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. O que é o NestJS?**
<sub>Aula [01 — O que é o NestJS e por que ele existe](../aulas/01-o-que-e-nest.md)</sub>
<details><summary>Ver resposta</summary>

Framework Node opinativo, em TypeScript, para backend, com arquitetura modular, injeção de dependência e pipeline de requisição (guards, pipes, interceptors, filters). Roda sobre Express (padrão) ou Fastify.

</details>

**2. O que significa ser um framework "opinativo"?**
<sub>Aula [01 — O que é o NestJS e por que ele existe](../aulas/01-o-que-e-nest.md)</sub>
<details><summary>Ver resposta</summary>

O framework já decide boa parte da estrutura: como organizar módulos, onde fica cada responsabilidade, como injetar dependências. Perde-se liberdade e ganha-se padronização e previsibilidade entre projetos.

</details>

**3. Nest substitui o Express?**
<sub>Aula [01 — O que é o NestJS e por que ele existe](../aulas/01-o-que-e-nest.md)</sub>
<details><summary>Ver resposta</summary>

Não. É uma camada de arquitetura por cima de uma plataforma HTTP, Express por padrão ou Fastify. O código Nest é independente da plataforma escolhida.

</details>

**4. O que é um decorator?**
<sub>Aula [02 — TypeScript, Decorators e Metadata](../aulas/02-typescript-e-decorators.md)</sub>
<details><summary>Ver resposta</summary>

Função aplicada com `@` sobre classe, método, propriedade ou parâmetro, que adiciona comportamento ou metadados. No Nest, a maioria só grava metadados que o framework lê depois.

</details>

**5. Qual o papel do controller e do service?**
<sub>Aula [03 — Módulos, Controllers e Providers](../aulas/03-modulos-controllers-providers.md)</sub>
<details><summary>Ver resposta</summary>

Controller é a entrada HTTP: recebe, extrai parâmetros, valida via DTO e delega. Service é onde fica a regra de negócio. Controller deve ser magro.

</details>

**6. O que é um provider?**
<sub>Aula [03 — Módulos, Controllers e Providers](../aulas/03-modulos-controllers-providers.md)</sub>
<details><summary>Ver resposta</summary>

Qualquer coisa que o container do Nest pode injetar: services, repositories, factories, clients, valores de config. Por padrão é singleton.

</details>

**7. Explique `imports`, `providers` e `exports` de um módulo.**
<sub>Aula [03 — Módulos, Controllers e Providers](../aulas/03-modulos-controllers-providers.md)</sub>
<details><summary>Ver resposta</summary>

`providers`: o que o módulo cria e usa internamente. `exports`: quais desses ficam visíveis pra quem importar o módulo. `imports`: módulos cujos exports eu quero usar. Provider não exportado é privado.

</details>

**8. O que é injeção de dependência?**
<sub>Aula [04 — Injeção de Dependência e o IoC Container](../aulas/04-injecao-de-dependencia.md)</sub>
<details><summary>Ver resposta</summary>

A classe recebe as dependências prontas, normalmente pelo construtor, em vez de criá-las. Reduz acoplamento e permite trocar implementações e usar mocks em teste.

</details>

**9. Qual a ordem do ciclo de vida da requisição no Nest?**
<sub>Aula [05 — O ciclo de vida da requisição: Middleware, Guards, Interceptors, Pipes e Filters](../aulas/05-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Middleware → Guards → Interceptors (antes) → Pipes → Handler → Interceptors (depois) → Exception Filters (se houver erro).

</details>

**10. Pra que servem interceptors? Dê exemplos.**
<sub>Aula [05 — O ciclo de vida da requisição: Middleware, Guards, Interceptors, Pipes e Filters](../aulas/05-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Envolvem o handler, agindo antes e depois via RxJS. Exemplos: padronizar formato de resposta, logar tempo de execução, cache, timeout, serialização (remover campos). É o conceito de AOP.

</details>

**11. O que faz um pipe?**
<sub>Aula [05 — O ciclo de vida da requisição: Middleware, Guards, Interceptors, Pipes e Filters](../aulas/05-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Recebe o valor de um argumento antes do handler e transforma (string → número) ou valida, lançando 400 se inválido. Ex: ValidationPipe, ParseIntPipe, ParseUUIDPipe.

</details>

**12. O que é um DTO e por que classe e não interface?**
<sub>Aula [06 — Validação, DTOs e Serialização](../aulas/06-validacao-e-dtos.md)</sub>
<details><summary>Ver resposta</summary>

Objeto que define o formato de entrada/saída, o contrato da rota. É classe porque precisa existir em runtime pros decorators de validação serem lidos; interface some.

</details>

**13. Diferença entre autenticação e autorização? E entre 401 e 403?**
<sub>Aula [07 — Autenticação e Autorização no Nest](../aulas/07-autenticacao-e-autorizacao.md)</sub>
<details><summary>Ver resposta</summary>

Autenticação: quem você é. Autorização: o que você pode fazer. 401: não autenticado (sem token, inválido, expirado). 403: autenticado mas sem permissão.

</details>

**14. Como funciona um JWT? O payload é seguro?**
<sub>Aula [07 — Autenticação e Autorização no Nest](../aulas/07-autenticacao-e-autorizacao.md)</sub>
<details><summary>Ver resposta</summary>

header.payload.signature em Base64URL. A assinatura (HS256 com segredo ou RS256 com chave privada) garante integridade. O payload é só codificado, qualquer um lê; nunca colocar dado sensível.

</details>

**15. O que é um ORM? Vantagens e desvantagens?**
<sub>Aula [08 — Banco de dados no Nest: ORM, Repository, Transações e Migrations](../aulas/08-banco-de-dados.md)</sub>
<details><summary>Ver resposta</summary>

Mapeia tabelas pra objetos. Vantagens: produtividade, tipagem, proteção contra SQL injection, migrations. Desvantagens: abstração que vaza, fácil gerar queries ruins (N+1), queries complexas podem ficar piores que SQL.

</details>

**16. O que é arquitetura hexagonal (ports and adapters)?**
<sub>Aula [10 — Arquitetura, Testes e Microservices no Nest](../aulas/10-arquitetura-testes-microservices.md)</sub>
<details><summary>Ver resposta</summary>

O domínio e os casos de uso ficam no centro e dependem de portas (interfaces) que eles definem; a infraestrutura implementa adaptadores (ORM, provider de IA, fila). As dependências apontam pra dentro. No Nest, portas viram tokens de injeção.

</details>

**17. Diferença entre mock, stub, fake e spy?**
<sub>Aula [10 — Arquitetura, Testes e Microservices no Nest](../aulas/10-arquitetura-testes-microservices.md)</sub>
<details><summary>Ver resposta</summary>

Stub: retorna valores fixos. Mock: comportamento programado e verificação de chamadas. Fake: implementação simples funcional (repositório em memória). Spy: observa uma função real registrando chamadas.

</details>

**18. O que é um resolver GraphQL no Nest?**
<sub>Aula [11 — GraphQL, subscriptions e WebSockets](../aulas/11-graphql-e-websockets.md)</sub>
<details><summary>Ver resposta</summary>

É a classe ou método que resolve um campo do schema, como uma Query, Mutation ou campo de um objeto. No Nest, decorators associam o resolver ao tipo e aos argumentos; o método delega a regra para providers. Resolvers devem evitar concentrar lógica e consultas repetidas.

</details>

**19. O que é um Gateway WebSocket no Nest?**
<sub>Aula [11 — GraphQL, subscriptions e WebSockets](../aulas/11-graphql-e-websockets.md)</sub>
<details><summary>Ver resposta</summary>

É um provider marcado com @WebSocketGateway que recebe eventos por uma conexão persistente. Métodos com @SubscribeMessage tratam mensagens e podem injetar outros providers, como services. A plataforma pode usar Socket.IO ou ws, conforme o adapter escolhido.

</details>
