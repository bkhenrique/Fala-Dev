# Laravel — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Ciclo de vida de uma requisição Laravel](../aulas/01-ciclo-de-vida-da-requisicao.md)

**1. Qual arquivo é a entrada HTTP tradicional de uma aplicação Laravel?**
<sub>Aula [01 — Ciclo de vida de uma requisição Laravel](../aulas/01-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Em geral, public/index.php carrega o autoloader do Composer e cria a aplicação configurada em bootstrap/app.php. O servidor web encaminha as requisições para essa entrada.

</details>

**2. Qual é o papel de um middleware no ciclo HTTP?**
<sub>Aula [01 — Ciclo de vida de uma requisição Laravel](../aulas/01-ciclo-de-vida-da-requisicao.md)</sub>
<details><summary>Ver resposta</summary>

Middleware inspeciona ou altera a requisição antes da rota e pode também agir na resposta que volta. Ele pode seguir para o próximo passo ou encerrar o fluxo com uma resposta.

</details>

### Aula 02 — [Service Container, Providers e Facades](../aulas/02-container-providers-e-facades.md)

**3. O que é o Service Container?**
<sub>Aula [02 — Service Container, Providers e Facades](../aulas/02-container-providers-e-facades.md)</sub>
<details><summary>Ver resposta</summary>

É o componente que resolve classes e injeta as dependências delas. Bindings informam ao container qual implementação fornecer para uma abstração.

</details>

**4. O que faz um Service Provider?**
<sub>Aula [02 — Service Container, Providers e Facades](../aulas/02-container-providers-e-facades.md)</sub>
<details><summary>Ver resposta</summary>

Registra bindings e inicializa serviços durante o bootstrap da aplicação. register associa dependências; boot executa inicialização que pode depender dos serviços registrados.

</details>

### Aula 03 — [Rotas, middleware, validação e API Resources](../aulas/03-rotas-middleware-validacao-e-resources.md)

**5. O que é route model binding?**
<sub>Aula [03 — Rotas, middleware, validação e API Resources](../aulas/03-rotas-middleware-validacao-e-resources.md)</sub>
<details><summary>Ver resposta</summary>

É a resolução de um parâmetro de rota para uma instância de Model Eloquent. Se o registro não existe, o framework pode responder 404; autorização ainda é uma verificação separada.

</details>

**6. Para que serve um API Resource?**
<sub>Aula [03 — Rotas, middleware, validação e API Resources](../aulas/03-rotas-middleware-validacao-e-resources.md)</sub>
<details><summary>Ver resposta</summary>

Transforma um Model ou coleção numa representação pública explícita da API. Evita expor automaticamente todos os atributos internos.

</details>

### Aula 04 — [Eloquent: relações, consultas e mass assignment](../aulas/04-eloquent-relacoes-e-consultas.md)

**7. O que é Eloquent?**
<sub>Aula [04 — Eloquent: relações, consultas e mass assignment](../aulas/04-eloquent-relacoes-e-consultas.md)</sub>
<details><summary>Ver resposta</summary>

É o ORM Active Record do Laravel: Models representam registros e permitem consultar e persistir esses objetos. Também oferece relações, scopes e conversões de atributo.

</details>

**8. O que significa mass assignment?**
<sub>Aula [04 — Eloquent: relações, consultas e mass assignment](../aulas/04-eloquent-relacoes-e-consultas.md)</sub>
<details><summary>Ver resposta</summary>

É preencher vários atributos de um Model com um array, por exemplo create. fillable ou guarded controlam quais campos podem ser atribuídos em massa.

</details>

### Aula 05 — [Migrations, factories e transações](../aulas/05-migrations-factories-e-transacoes.md)

**9. O que registra uma migration?**
<sub>Aula [05 — Migrations, factories e transações](../aulas/05-migrations-factories-e-transacoes.md)</sub>
<details><summary>Ver resposta</summary>

Uma mudança versionada do esquema do banco, aplicada em ordem pela aplicação. Pode criar ou alterar tabelas, índices e constraints.

</details>

**10. O que DB::transaction faz?**
<sub>Aula [05 — Migrations, factories e transações](../aulas/05-migrations-factories-e-transacoes.md)</sub>
<details><summary>Ver resposta</summary>

Executa operações participantes numa transação de banco: confirma se a closure termina normalmente ou reverte se uma exceção escapar. Não inclui automaticamente serviços externos.

</details>

### Aula 06 — [Autenticação, autorização e Sanctum](../aulas/06-autenticacao-autorizacao-e-sanctum.md)

**11. Qual a diferença entre autenticação e autorização?**
<sub>Aula [06 — Autenticação, autorização e Sanctum](../aulas/06-autenticacao-autorizacao-e-sanctum.md)</sub>
<details><summary>Ver resposta</summary>

Autenticação identifica quem fez a requisição. Autorização decide se essa identidade pode realizar determinada ação num recurso.

</details>

**12. O que é uma Policy no Laravel?**
<sub>Aula [06 — Autenticação, autorização e Sanctum](../aulas/06-autenticacao-autorizacao-e-sanctum.md)</sub>
<details><summary>Ver resposta</summary>

É uma classe que agrupa regras de autorização relacionadas a um Model ou recurso. Pode decidir, por exemplo, se um usuário pode atualizar um pedido específico.

</details>

### Aula 07 — [Filas, Jobs, eventos e Scheduler](../aulas/07-filas-jobs-eventos-e-scheduler.md)

**13. O que é um Job de fila?**
<sub>Aula [07 — Filas, Jobs, eventos e Scheduler](../aulas/07-filas-jobs-eventos-e-scheduler.md)</sub>
<details><summary>Ver resposta</summary>

É uma unidade serializável de trabalho que pode ser executada mais tarde por um worker. Jobs permitem tirar processamento lento do ciclo HTTP.

</details>

**14. O que é Laravel Horizon?**
<sub>Aula [07 — Filas, Jobs, eventos e Scheduler](../aulas/07-filas-jobs-eventos-e-scheduler.md)</sub>
<details><summary>Ver resposta</summary>

É um dashboard e gerenciador de workers para filas Laravel baseadas em Redis. Mostra métricas como duração, throughput e falhas.

</details>

### Aula 08 — [Cache, sessão e rate limiting](../aulas/08-cache-sessao-e-rate-limit.md)

**15. O que é cache-aside?**
<sub>Aula [08 — Cache, sessão e rate limiting](../aulas/08-cache-sessao-e-rate-limit.md)</sub>
<details><summary>Ver resposta</summary>

É um padrão em que a aplicação consulta cache primeiro e, se faltar, busca a origem e grava uma cópia temporária. A política precisa definir TTL e invalidação.

</details>

**16. Para que serve rate limiting?**
<sub>Aula [08 — Cache, sessão e rate limiting](../aulas/08-cache-sessao-e-rate-limit.md)</sub>
<details><summary>Ver resposta</summary>

Limita quantas operações uma chave pode executar numa janela de tempo. Ajuda a proteger login e endpoints caros contra abuso e picos.

</details>

### Aula 09 — [Testes no Laravel: HTTP, banco e fakes](../aulas/09-testes-no-laravel.md)

**17. O que é RefreshDatabase?**
<sub>Aula [09 — Testes no Laravel: HTTP, banco e fakes](../aulas/09-testes-no-laravel.md)</sub>
<details><summary>Ver resposta</summary>

É uma trait Laravel que prepara o banco de dados de testes em estado conhecido usando a estratégia adequada ao ambiente. Deve apontar para um banco isolado.

</details>

**18. Qual a diferença entre fake e mock num teste Laravel?**
<sub>Aula [09 — Testes no Laravel: HTTP, banco e fakes](../aulas/09-testes-no-laravel.md)</sub>
<details><summary>Ver resposta</summary>

Fake costuma substituir um serviço do framework e registrar efeitos para assertions, como jobs despachados. Mock configura respostas ou interações esperadas de uma dependência.

</details>

### Aula 10 — [Laravel em produção: deploy, Octane e arquitetura](../aulas/10-producao-octane-e-arquitetura.md)

**19. O que é Laravel Octane?**
<sub>Aula [10 — Laravel em produção: deploy, Octane e arquitetura](../aulas/10-producao-octane-e-arquitetura.md)</sub>
<details><summary>Ver resposta</summary>

É uma forma de servir Laravel em workers persistentes usando runtimes compatíveis. O processo aquecido pode reduzir bootstrap, mas estado de uma requisição precisa ser limpo.

</details>

**20. O que são config cache e route cache?**
<sub>Aula [10 — Laravel em produção: deploy, Octane e arquitetura](../aulas/10-producao-octane-e-arquitetura.md)</sub>
<details><summary>Ver resposta</summary>

São caches de bootstrap que pré-compilam arquivos de configuração ou registro de rotas para produção. Precisam ser gerados para a versão e configuração certas no deploy.

</details>
