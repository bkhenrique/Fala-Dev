# Fundamentos — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. O que é DNS e o que é o TTL de um registro?**
<sub>Aula [01 — Como a web funciona: do navegador ao servidor](../aulas/01-como-a-web-funciona.md)</sub>
<details><summary>Ver resposta</summary>

Sistema que traduz nomes de domínio em IPs, de forma hierárquica e distribuída. O TTL define por quanto tempo a resposta pode ficar em cache; por isso mudanças de DNS demoram a "propagar".

</details>

**2. O que o TLS garante e como funciona o handshake?**
<sub>Aula [01 — Como a web funciona: do navegador ao servidor](../aulas/01-como-a-web-funciona.md)</sub>
<details><summary>Ver resposta</summary>

Confidencialidade, integridade e autenticidade. O servidor apresenta um certificado assinado por uma CA; com criptografia assimétrica os dois combinam uma chave de sessão, e o resto da comunicação usa criptografia simétrica, mais rápida.

</details>

**3. O que é idempotência em HTTP? Quais métodos são idempotentes?**
<sub>Aula [02 — HTTP a fundo: métodos, status, headers, cookies e cache](../aulas/02-http-a-fundo.md)</sub>
<details><summary>Ver resposta</summary>

Executar N vezes tem o mesmo efeito no servidor que executar uma vez. GET, HEAD, OPTIONS, PUT e DELETE são; POST não, e PATCH não é garantido. Importa para retry: repetir POST pode duplicar operações.

</details>

**4. Quais atributos de cookie importam para segurança?**
<sub>Aula [02 — HTTP a fundo: métodos, status, headers, cookies e cache](../aulas/02-http-a-fundo.md)</sub>
<details><summary>Ver resposta</summary>

HttpOnly (JS não lê, protege contra roubo por XSS), Secure (só HTTPS) e SameSite Lax/Strict (não enviado em requisições de outros sites, protege contra CSRF).

</details>

**5. O que é REST?**
<sub>Aula [03 — APIs: REST, GraphQL, gRPC, Webhooks e comunicação em tempo real](../aulas/03-apis-rest-graphql-grpc-tempo-real.md)</sub>
<details><summary>Ver resposta</summary>

Estilo arquitetural: recursos identificados por URLs, manipulados via métodos HTTP com sua semântica, stateless, com representações (JSON) e respostas cacheáveis. A maioria das APIs "REST" é nível 2 de Richardson (sem HATEOAS).

</details>

**6. O que é CORS? Ele protege a API?**
<sub>Aula [04 — Autenticação, Autorização e Segurança Web](../aulas/04-autenticacao-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Mecanismo em que o servidor diz ao navegador quais origens podem ler suas respostas, relaxando a Same-Origin Policy; requisições não simples fazem preflight OPTIONS. Não é autenticação: curl e outros backends ignoram CORS.

</details>

**7. O que é ACID?**
<sub>Aula [05 — Banco de dados relacional: modelagem, ACID, transações, isolamento e índices](../aulas/05-banco-relacional.md)</sub>
<details><summary>Ver resposta</summary>

Atomicidade (tudo ou nada), Consistência (de um estado válido para outro), Isolamento (transações concorrentes não interferem, em níveis configuráveis) e Durabilidade (após o commit, não se perde).

</details>

**8. Como funciona um índice e qual o custo dele?**
<sub>Aula [05 — Banco de dados relacional: modelagem, ACID, transações, isolamento e índices](../aulas/05-banco-relacional.md)</sub>
<details><summary>Ver resposta</summary>

Estrutura (normalmente B-Tree) que permite achar linhas em O(log n) em vez de varrer a tabela. Custa espaço e deixa escritas mais lentas. Índice composto segue o prefixo mais à esquerda; funções na coluna e LIKE '%x' não usam índice comum.

</details>

**9. Explique o teorema CAP.**
<sub>Aula [06 — Escalando o banco e NoSQL: pool, réplicas, sharding, CAP e tipos de banco](../aulas/06-escalando-banco-e-nosql.md)</sub>
<details><summary>Ver resposta</summary>

Num sistema distribuído, durante uma partição de rede, é preciso escolher entre consistência (todos veem o dado mais recente ou recebem erro) e disponibilidade (sempre responder, talvez com dado antigo). Na prática, CP ou AP. PACELC acrescenta o trade-off latência × consistência sem partição.

</details>

**10. O que é cache-aside?**
<sub>Aula [07 — Cache e Redis](../aulas/07-cache-e-redis.md)</sub>
<details><summary>Ver resposta</summary>

A aplicação procura no cache; se não achar (miss), busca na fonte, grava no cache com TTL e retorna. Só cacheia o que é usado e tolera o cache cair; pode servir dado velho até expirar ou ser invalidado.

</details>

**11. O que é o Outbox Pattern?**
<sub>Aula [08 — Mensageria, processamento assíncrono e arquitetura orientada a eventos](../aulas/08-mensageria-e-eventos.md)</sub>
<details><summary>Ver resposta</summary>

Solução para o dual write (não há transação entre banco e broker): na mesma transação grava-se a entidade e o evento numa tabela outbox; um processo separado (polling ou CDC/Debezium) publica no broker. Garante que o evento sai se o dado foi salvo; consumidores idempotentes.

</details>

**12. O que é uma Saga?**
<sub>Aula [08 — Mensageria, processamento assíncrono e arquitetura orientada a eventos](../aulas/08-mensageria-e-eventos.md)</sub>
<details><summary>Ver resposta</summary>

Forma de fazer uma operação entre vários serviços sem transação distribuída: sequência de transações locais, com ações compensatórias para desfazer os passos anteriores se algum falhar. Pode ser coreografada (eventos) ou orquestrada (coordenador central).

</details>

**13. O que é arquitetura hexagonal (ports and adapters)?**
<sub>Aula [09 — Arquitetura de software: monolito, microsserviços, camadas, hexagonal, DDD, BFF e API Gateway](../aulas/09-arquitetura-de-software.md)</sub>
<details><summary>Ver resposta</summary>

Domínio e casos de uso no centro, sem depender de infraestrutura; o núcleo define portas (interfaces) e as bordas têm adaptadores (HTTP, fila, banco, provedores). Dependências apontam para dentro. Ganha testabilidade e troca de tecnologia; custa indireção.

</details>

**14. O que são bounded context, entidade, value object e agregado?**
<sub>Aula [09 — Arquitetura de software: monolito, microsserviços, camadas, hexagonal, DDD, BFF e API Gateway](../aulas/09-arquitetura-de-software.md)</sub>
<details><summary>Ver resposta</summary>

Bounded context: fronteira onde um modelo tem significado único. Entidade: tem identidade que persiste. Value object: definido pelos valores, imutável. Agregado: grupo tratado como unidade de consistência, acessado pela raiz.

</details>

**15. O que é circuit breaker e como ele se relaciona com timeout e retry?**
<sub>Aula [10 — Escalabilidade e Resiliência](../aulas/10-escalabilidade-e-resiliencia.md)</sub>
<details><summary>Ver resposta</summary>

Disjuntor que, após muitas falhas numa dependência, abre e passa a falhar rápido (com fallback); depois de um tempo, em meio-aberto, testa algumas chamadas e fecha se derem certo. Evita falha em cascata. Timeout limita a espera de cada chamada; retry com backoff e jitter trata falhas transitórias; o breaker impede retries infinitos contra um serviço fora do ar.

</details>

**16. Explique SOLID com exemplos.**
<sub>Aula [11 — Design de código: SOLID, acoplamento, coesão, princípios e débito técnico](../aulas/11-design-de-codigo.md)</sub>
<details><summary>Ver resposta</summary>

S: uma classe, um motivo para mudar. O: estender sem modificar (Strategy em vez de switch). L: subclasse substitui a pai sem quebrar. I: interfaces pequenas e específicas. D: regra de negócio depende de abstrações, implementações injetadas.

</details>

**17. O que é uma branch e o que é o HEAD no Git?**
<sub>Aula [13 — Git e fluxo de trabalho em equipe](../aulas/13-git-e-fluxo-de-trabalho.md)</sub>
<details><summary>Ver resposta</summary>

Branch é só um ponteiro para um commit; criar uma é instantâneo. HEAD indica onde você está, normalmente apontando para a branch atual, que avança a cada commit. Com o HEAD apontando direto para um commit (detached HEAD), commits novos ficam soltos se você não criar uma branch.

</details>

**18. O que é Big O e o que significam O(1), O(log n), O(n) e O(n²)?**
<sub>Aula [14 — Estruturas de dados, algoritmos e Big O](../aulas/14-estruturas-de-dados-e-big-o.md)</sub>
<details><summary>Ver resposta</summary>

Big O descreve como o custo cresce com o tamanho da entrada, ignorando constantes. O(1) não depende do tamanho (acesso por índice, hash); O(log n) divide o problema pela metade a cada passo (busca binária); O(n) percorre tudo uma vez; O(n²) compara todos com todos (loop dentro de loop).

</details>

**19. Qual a diferença entre pilha e fila?**
<sub>Aula [14 — Estruturas de dados, algoritmos e Big O](../aulas/14-estruturas-de-dados-e-big-o.md)</sub>
<details><summary>Ver resposta</summary>

Pilha é LIFO: o último a entrar é o primeiro a sair (call stack, desfazer, DFS). Fila é FIFO: o primeiro a entrar é o primeiro a sair (processar tarefas em ordem, BFS, filas de mensagens). As duas têm inserção e remoção em O(1).

</details>

**20. Quais são as etapas para responder uma pergunta de system design?**
<sub>Aula [15 — System design: como responder "desenhe um sistema"](../aulas/15-system-design.md)</sub>
<details><summary>Ver resposta</summary>

Requisitos funcionais e não funcionais, estimativas (QPS, armazenamento), API, modelo de dados, desenho de alto nível simples, aprofundar os gargalos com cache, réplicas, filas ou sharding justificados por números, e por fim trade-offs, falhas e monitoramento.

</details>

**21. O que são tokens e janela de contexto num LLM?**
<sub>Aula [16 — IA para devs: LLMs, embeddings, RAG e agentes](../aulas/16-ia-para-devs.md)</sub>
<details><summary>Ver resposta</summary>

Tokens são os pedaços de texto que o modelo processa (partes de palavras). A janela de contexto é o máximo de tokens que cabem numa chamada, somando instruções, histórico, documentos e resposta. Custo e latência crescem com a quantidade de tokens.

</details>

**22. O que é um embedding?**
<sub>Aula [16 — IA para devs: LLMs, embeddings, RAG e agentes](../aulas/16-ia-para-devs.md)</sub>
<details><summary>Ver resposta</summary>

Um vetor de números que representa o significado de um texto; textos com sentido parecido geram vetores próximos, medidos por similaridade de cosseno. É a base da busca semântica e do RAG, guardado em bancos vetoriais como o pgvector.

</details>

**23. O que é o método STAR?**
<sub>Aula [17 — Entrevista comportamental: como contar a sua experiência](../aulas/17-entrevista-comportamental.md)</sub>
<details><summary>Ver resposta</summary>

Uma estrutura para contar experiências: Situação (contexto), Tarefa (o problema e a sua responsabilidade), Ação (o que você fez e por quê, a maior parte da resposta) e Resultado (o que mudou, de preferência com número). Em entrevista técnica vale acrescentar o trade-off e o que faria diferente.

</details>
