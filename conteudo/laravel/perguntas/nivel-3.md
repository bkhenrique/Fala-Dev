# Laravel — perguntas, nível 3: Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Ciclo de vida de uma requisição Laravel](../aulas/01-ciclo-de-vida-da-requisicao.md)

**1. Como rastrearia uma requisição que chega mas nunca atinge o controller?**
<sub>Aula [01 — Ciclo de vida de uma requisição Laravel](../aulas/01-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Seguiria o entry point, bootstrap e providers, depois verificaria cada middleware global e de rota até o router. Usaria logs estruturados com correlation id e inspecionaria uma resposta encerrada cedo, como auth, CSRF ou maintenance.

</details>

### Aula 02 — [Service Container, Providers e Facades](../aulas/02-container-providers-e-facades.md)

**2. Como deixaria um serviço de e-mail substituível e fácil de testar?**
<sub>Aula [02 — Service Container, Providers e Facades](../aulas/02-container-providers-e-facades.md)</sub>
<details><summary>Ver resposta</summary>

Definiria um contrato se há mais de uma implementação ou fronteira externa relevante, registraria binding no provider e injetaria no serviço. Em teste usaria fake ou implementação em memória. Evitaria criar interface artificial se não houver necessidade de substituição.

</details>

### Aula 03 — [Rotas, middleware, validação e API Resources](../aulas/03-rotas-middleware-validacao-e-resources.md)

**3. Como estruturaria endpoint para criar pedido sem expor dados internos?**
<sub>Aula [03 — Rotas, middleware, validação e API Resources](../aulas/03-rotas-middleware-validacao-e-resources.md)</sub>
<details><summary>Ver resposta</summary>

Rota POST com middleware adequado, Form Request valida campos e policy autoriza, controller delega a regra e transação persiste as mudanças. API Resource retorna apenas campos públicos com status 201; consultas carregam relações necessárias sem N+1.

</details>

### Aula 04 — [Eloquent: relações, consultas e mass assignment](../aulas/04-eloquent-relacoes-e-consultas.md)

**4. Como corrigiria uma tela de pedidos que gera centenas de consultas?**
<sub>Aula [04 — Eloquent: relações, consultas e mass assignment](../aulas/04-eloquent-relacoes-e-consultas.md)</sub>
<details><summary>Ver resposta</summary>

Mediria consultas e identificaria acesso a relações dentro de loops ou Resource. Planejaria eager loading e withCount para os dados exibidos, paginaria e verificaria índices. Depois validaria o número de queries e o plano com dados representativos.

</details>

### Aula 05 — [Migrations, factories e transações](../aulas/05-migrations-factories-e-transacoes.md)

**5. Como alteraria uma coluna usada por várias versões ativas da aplicação?**
<sub>Aula [05 — Migrations, factories e transações](../aulas/05-migrations-factories-e-transacoes.md)</sub>
<details><summary>Ver resposta</summary>

Faria expand-and-contract: adicionaria coluna compatível, faria backfill em lotes, publicaria código que lê ou escreve os dois formatos conforme necessário e removeria a antiga numa implantação posterior. Testaria migration e rollback em cópia representativa e observaria bloqueio e duração.

</details>

### Aula 06 — [Autenticação, autorização e Sanctum](../aulas/06-autenticacao-autorizacao-e-sanctum.md)

**6. Como evitaria acesso indevido a pedidos por mudança de ID na URL?**
<sub>Aula [06 — Autenticação, autorização e Sanctum](../aulas/06-autenticacao-autorizacao-e-sanctum.md)</sub>
<details><summary>Ver resposta</summary>

Autenticação exigiria sessão ou token apropriado; binding encontraria o pedido e uma Policy verificaria ownership e tenant para cada ação. Também limitaria escopo da consulta e testaria explicitamente outro usuário recebendo 403 ou 404 conforme o contrato.

</details>

### Aula 07 — [Filas, Jobs, eventos e Scheduler](../aulas/07-filas-jobs-eventos-e-scheduler.md)

**7. Como manteria pedido e notificação consistentes se worker ou broker cair?**
<sub>Aula [07 — Filas, Jobs, eventos e Scheduler](../aulas/07-filas-jobs-eventos-e-scheduler.md)</sub>
<details><summary>Ver resposta</summary>

Confirmaria o pedido em transação e despacharia após commit; se a publicação não puder ser perdida, gravaria um evento na outbox na mesma transação. Publisher usa retry e idempotência, workers observam timeout e falhas vão para fila morta com alerta.

</details>

### Aula 08 — [Cache, sessão e rate limiting](../aulas/08-cache-sessao-e-rate-limit.md)

**8. Como armazenaria sessão e cache num deploy com várias instâncias?**
<sub>Aula [08 — Cache, sessão e rate limiting](../aulas/08-cache-sessao-e-rate-limit.md)</sub>
<details><summary>Ver resposta</summary>

Usaria driver compartilhado como Redis ou banco para que qualquer réplica veja o mesmo estado, configurando TTL e política de indisponibilidade. Separaria chaves por usuário ou tenant, protegeria cookies e monitoraria latência, hit rate e memória.

</details>

### Aula 09 — [Testes no Laravel: HTTP, banco e fakes](../aulas/09-testes-no-laravel.md)

**9. Como testaria um fluxo HTTP Laravel com banco e Job?**
<sub>Aula [09 — Testes no Laravel: HTTP, banco e fakes](../aulas/09-testes-no-laravel.md)</sub>
<details><summary>Ver resposta</summary>

Feature test iniciaria a aplicação, prepararia banco isolado com RefreshDatabase/factory, enviaria a requisição e verificaria status, payload e persistência. Queue::fake confirmaria despacho; testaria o Job à parte e usaria banco compatível se locks ou SQL fossem parte do risco.

</details>

### Aula 10 — [Laravel em produção: deploy, Octane e arquitetura](../aulas/10-producao-octane-e-arquitetura.md)

**10. Como decidiria se deve adotar Octane e fazer deploy seguro?**
<sub>Aula [10 — Laravel em produção: deploy, Octane e arquitetura](../aulas/10-producao-octane-e-arquitetura.md)</sub>
<details><summary>Ver resposta</summary>

Instrumentaria latência e custo de bootstrap antes, compararia carga no ambiente representativo e revisaria dependências para processos persistentes. Garantiria ausência de estado por usuário em singletons, supervisionaria workers, prepararia caches e migrations compatíveis e faria rollout com health checks e rollback observável.

</details>
