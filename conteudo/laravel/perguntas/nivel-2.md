# Laravel — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os trade-offs._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Ciclo de vida de uma requisição Laravel](../aulas/01-ciclo-de-vida-da-requisicao.md)

**1. Por que entender o ciclo de vida ajuda a depurar um 401 ou uma resposta alterada?**
<sub>Aula [01 — Ciclo de vida de uma requisição Laravel](../aulas/01-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

A requisição passa por bootstrap, middleware e roteamento antes do controller, e a resposta retorna pela cadeia. Localizar qual middleware ou provider atua evita procurar a causa somente na regra do endpoint.

</details>

**2. Por que não colocar trabalho pesado no service provider?**
<sub>Aula [01 — Ciclo de vida de uma requisição Laravel](../aulas/01-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Provider roda durante bootstrap, potencialmente em todo processo ou execução da aplicação, e sua responsabilidade é registrar e iniciar serviços. Consultas ou chamadas remotas ali atrasam inicialização e confundem ciclo global com trabalho por requisição.

</details>

### Aula 02 — [Service Container, Providers e Facades](../aulas/02-container-providers-e-facades.md)

**3. Quando usar facade e quando injetar uma dependência no construtor?**
<sub>Aula [02 — Service Container, Providers e Facades](../aulas/02-container-providers-e-facades.md)</sub>
<details><summary>Ver resposta</summary>

Facade oferece sintaxe curta para serviço do container e tem suporte a fakes. Injeção torna dependências centrais explícitas e facilita trocar implementações; classes que usam muitas facades podem indicar responsabilidades demais.

</details>

**4. Por que um singleton não deve guardar o usuário atual em propriedade?**
<sub>Aula [02 — Service Container, Providers e Facades](../aulas/02-container-providers-e-facades.md)</sub>
<details><summary>Ver resposta</summary>

O objeto pode ser reutilizado no processo e uma requisição posterior poderia observar estado da anterior, especialmente em runtimes persistentes. Passe contexto explicitamente ou use um escopo que corresponda ao ciclo de request/job.

</details>

### Aula 03 — [Rotas, middleware, validação e API Resources](../aulas/03-rotas-middleware-validacao-e-resources.md)

**5. Route model binding autoriza acesso ao registro?**
<sub>Aula [03 — Rotas, middleware, validação e API Resources](../aulas/03-rotas-middleware-validacao-e-resources.md)</sub>
<details><summary>Ver resposta</summary>

Não. Ele encontra o registro ou retorna ausência; policy precisa decidir se aquele usuário pode realizar a ação. Sem essa verificação, trocar o ID pode causar IDOR.

</details>

**6. Por que usar Form Request se já tenho validação no front-end?**
<sub>Aula [03 — Rotas, middleware, validação e API Resources](../aulas/03-rotas-middleware-validacao-e-resources.md)</sub>
<details><summary>Ver resposta</summary>

A validação do navegador melhora a experiência, mas pode ser ignorada por qualquer cliente. Form Request valida e pode autorizar no servidor antes da ação principal.

</details>

### Aula 04 — [Eloquent: relações, consultas e mass assignment](../aulas/04-eloquent-relacoes-e-consultas.md)

**7. Como eager loading reduz N+1 e qual o risco de carregar demais?**
<sub>Aula [04 — Eloquent: relações, consultas e mass assignment](../aulas/04-eloquent-relacoes-e-consultas.md)</sub>
<details><summary>Ver resposta</summary>

with carrega relações necessárias em poucas consultas em vez de uma consulta por item. Relations indiscriminadas podem trazer colunas e objetos demais; o plano deve seguir o formato da resposta.

</details>

**8. Mass assignment protection substitui autorização?**
<sub>Aula [04 — Eloquent: relações, consultas e mass assignment](../aulas/04-eloquent-relacoes-e-consultas.md)</sub>
<details><summary>Ver resposta</summary>

Não. fillable/guarded limitam quais atributos podem ser atribuídos em lote, mas não provam que o usuário pode editar aquele registro nem que os valores são válidos.

</details>

### Aula 05 — [Migrations, factories e transações](../aulas/05-migrations-factories-e-transacoes.md)

**9. Por que migrations precisam ser compatíveis com rolling deploy?**
<sub>Aula [05 — Migrations, factories e transações](../aulas/05-migrations-factories-e-transacoes.md)</sub>
<details><summary>Ver resposta</summary>

Durante atualização podem coexistir instâncias antigas e novas que esperam esquemas diferentes. Expand-and-contract permite adicionar e migrar o formato em etapas antes de remover a estrutura antiga.

</details>

**10. O que uma transação resolve e o que ela não resolve?**
<sub>Aula [05 — Migrations, factories e transações](../aulas/05-migrations-factories-e-transacoes.md)</sub>
<details><summary>Ver resposta</summary>

Ela mantém operações do mesmo banco atomicamente consistentes. Não faz rollback de e-mail ou mensagem publicada em outro sistema; para isso são necessários after-commit, outbox ou compensação.

</details>

### Aula 06 — [Autenticação, autorização e Sanctum](../aulas/06-autenticacao-autorizacao-e-sanctum.md)

**11. Sanctum ou Passport: como decidir?**
<sub>Aula [06 — Autenticação, autorização e Sanctum](../aulas/06-autenticacao-autorizacao-e-sanctum.md)</sub>
<details><summary>Ver resposta</summary>

Sanctum cobre autenticação de SPA first-party e tokens simples de API; Passport oferece recursos completos de OAuth2. Escolho pelo protocolo e pelas capacidades exigidas pelos clientes, não apenas porque existe uma API.

</details>

**12. Por que verificar Policy mesmo depois de auth middleware?**
<sub>Aula [06 — Autenticação, autorização e Sanctum](../aulas/06-autenticacao-autorizacao-e-sanctum.md)</sub>
<details><summary>Ver resposta</summary>

auth prova que há usuário autenticado, mas não que ele é dono ou tem acesso àquele pedido. Autorização deve ser aplicada ao modelo e à ação específica.

</details>

### Aula 07 — [Filas, Jobs, eventos e Scheduler](../aulas/07-filas-jobs-eventos-e-scheduler.md)

**13. Por que um Job precisa ser idempotente?**
<sub>Aula [07 — Filas, Jobs, eventos e Scheduler](../aulas/07-filas-jobs-eventos-e-scheduler.md)</sub>
<details><summary>Ver resposta</summary>

Um worker pode executar de novo após timeout, redelivery ou falha ao confirmar conclusão. Idempotência evita duplicar cobrança, e-mail ou atualização; retry deve ser limitado e reservado a falhas recuperáveis.

</details>

**14. After-commit garante entrega atômica ao broker?**
<sub>Aula [07 — Filas, Jobs, eventos e Scheduler](../aulas/07-filas-jobs-eventos-e-scheduler.md)</sub>
<details><summary>Ver resposta</summary>

Não. Ele evita que o job leia dados antes do commit, mas pode haver falha depois do commit e antes da publicação. Outbox armazena evento na mesma transação e permite publicação recuperável.

</details>

### Aula 08 — [Cache, sessão e rate limiting](../aulas/08-cache-sessao-e-rate-limit.md)

**15. Por que o cache key precisa considerar tenant e usuário?**
<sub>Aula [08 — Cache, sessão e rate limiting](../aulas/08-cache-sessao-e-rate-limit.md)</sub>
<details><summary>Ver resposta</summary>

A mesma consulta pode produzir resultados diferentes por identidade, permissão ou tenant. Uma chave incompleta pode retornar dado de uma pessoa para outra; cache ainda exige autorização e invalidação.

</details>

**16. Por que contador de rate limit em memória local falha com várias réplicas?**
<sub>Aula [08 — Cache, sessão e rate limiting](../aulas/08-cache-sessao-e-rate-limit.md)</sub>
<details><summary>Ver resposta</summary>

Cada instância vê apenas seus próprios pedidos e pode aceitar mais chamadas que o limite global. Um driver compartilhado coordena o contador, com custo de operação e latência.

</details>

### Aula 09 — [Testes no Laravel: HTTP, banco e fakes](../aulas/09-testes-no-laravel.md)

**17. Quando SQLite em memória é insuficiente como banco de teste?**
<sub>Aula [09 — Testes no Laravel: HTTP, banco e fakes](../aulas/09-testes-no-laravel.md)</sub>
<details><summary>Ver resposta</summary>

Quando diferenças de SQL, tipos, índices, locks ou transação do banco de produção influenciam o comportamento. Aí uso um motor compatível, por exemplo num container, apesar do custo maior.

</details>

**18. O que um Queue::fake prova e o que não prova?**
<sub>Aula [09 — Testes no Laravel: HTTP, banco e fakes](../aulas/09-testes-no-laravel.md)</sub>
<details><summary>Ver resposta</summary>

Prova que o código despachou um Job esperado com certos dados. Não executa o worker nem valida serialização, efeitos ou integração com Redis; a lógica do job precisa de teste próprio.

</details>

### Aula 10 — [Laravel em produção: deploy, Octane e arquitetura](../aulas/10-producao-octane-e-arquitetura.md)

**19. Que riscos Octane introduz em comparação com o ciclo comum?**
<sub>Aula [10 — Laravel em produção: deploy, Octane e arquitetura](../aulas/10-producao-octane-e-arquitetura.md)</sub>
<details><summary>Ver resposta</summary>

Objetos e memória do processo sobrevivem a várias requisições, podendo reter usuário, tenant, request ou dados antigos. É preciso controlar ciclo de vida e medir, pois a redução de bootstrap não elimina gargalos externos.

</details>

**20. Por que config cache muda o uso de env()?**
<sub>Aula [10 — Laravel em produção: deploy, Octane e arquitetura](../aulas/10-producao-octane-e-arquitetura.md)</sub>
<details><summary>Ver resposta</summary>

Com configuração cacheada, o arquivo .env não é carregado no fluxo normal da aplicação. env deve ser lido nos arquivos config; código usa config() para receber os valores resolvidos.

</details>
