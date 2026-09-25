# Fundamentos — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

**1. Qual a diferença entre TCP e UDP?**
<sub>Aula [01 — Como a web funciona: do navegador ao servidor](../aulas/01-como-a-web-funciona.md)</sub>
<details><summary>Ver resposta</summary>

TCP: orientado a conexão (handshake), entrega confiável e ordenada, com retransmissão e controle de fluxo. UDP: sem conexão e sem garantia, mais rápido e leve; usado em streaming ao vivo, jogos, DNS e no HTTP/3 (QUIC).

</details>

**2. Qual a diferença entre 201 e 202?**
<sub>Aula [02 — HTTP a fundo: métodos, status, headers, cookies e cache](../aulas/02-http-a-fundo.md)</sub>
<details><summary>Ver resposta</summary>

201 Created: recurso criado e já existe (com header Location). 202 Accepted: requisição aceita para processamento posterior, típico de fluxo assíncrono com fila; devolve um id para acompanhar o status.

</details>

**3. Qual a diferença entre 401 e 403? E 502 e 504?**
<sub>Aula [02 — HTTP a fundo: métodos, status, headers, cookies e cache](../aulas/02-http-a-fundo.md)</sub>
<details><summary>Ver resposta</summary>

401: não autenticado. 403: autenticado sem permissão. 502 Bad Gateway: o proxy recebeu resposta inválida do servidor de trás (ex: app caiu). 504 Gateway Timeout: o proxy não recebeu resposta a tempo (app lenta).

</details>

**4. PUT vs PATCH?**
<sub>Aula [02 — HTTP a fundo: métodos, status, headers, cookies e cache](../aulas/02-http-a-fundo.md)</sub>
<details><summary>Ver resposta</summary>

PUT substitui o recurso inteiro (idempotente). PATCH altera parcialmente só os campos enviados (não necessariamente idempotente).

</details>

**5. Como funciona o cache HTTP com Cache-Control e ETag?**
<sub>Aula [02 — HTTP a fundo: métodos, status, headers, cookies e cache](../aulas/02-http-a-fundo.md)</sub>
<details><summary>Ver resposta</summary>

Cache-Control define se e por quanto tempo guardar (max-age, no-cache = revalidar, no-store = não guardar, public/private). ETag identifica a versão; o cliente manda If-None-Match e, se não mudou, recebe 304 Not Modified sem corpo.

</details>

**6. Paginação por offset ou por cursor?**
<sub>Aula [03 — APIs: REST, GraphQL, gRPC, Webhooks e comunicação em tempo real](../aulas/03-apis-rest-graphql-grpc-tempo-real.md)</sub>
<details><summary>Ver resposta</summary>

Offset (page/size) é simples e permite pular páginas, mas fica lento com offsets grandes e pode repetir/pular itens com inserções. Cursor (depois do último id) é rápido e estável, ideal para feeds e scroll infinito, mas não permite ir direto a uma página.

</details>

**7. REST, GraphQL ou gRPC?**
<sub>Aula [03 — APIs: REST, GraphQL, gRPC, Webhooks e comunicação em tempo real](../aulas/03-apis-rest-graphql-grpc-tempo-real.md)</sub>
<details><summary>Ver resposta</summary>

REST para APIs públicas e CRUD (simples, cache HTTP). GraphQL quando vários clientes precisam de dados diferentes (cliente escolhe campos; cuidado com N+1 e cache). gRPC para comunicação interna entre serviços (HTTP/2 + Protobuf, rápido, contrato forte).

</details>

**8. Por que usar SSE e quando usar WebSocket?**
<sub>Aula [03 — APIs: REST, GraphQL, gRPC, Webhooks e comunicação em tempo real](../aulas/03-apis-rest-graphql-grpc-tempo-real.md)</sub>
<details><summary>Ver resposta</summary>

SSE quando o fluxo é só servidor → cliente (progresso de job, streaming de IA): HTTP comum, reconexão automática, passa por proxies. WebSocket quando os dois lados trocam mensagens constantemente (chat, colaboração); é mais complexo de escalar (conexões persistentes, pub/sub entre instâncias).

</details>

**9. Sessão vs JWT?**
<sub>Aula [04 — Autenticação, Autorização e Segurança Web](../aulas/04-autenticacao-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Sessão: estado no servidor (Redis/banco), cookie com id; revogação fácil, precisa de armazenamento compartilhado. JWT: token assinado autocontido; stateless e escalável, mas difícil de revogar. Padrão com JWT: access token curto + refresh token revogável.

</details>

**10. OAuth2 vs OpenID Connect?**
<sub>Aula [04 — Autenticação, Autorização e Segurança Web](../aulas/04-autenticacao-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

OAuth2 é autorização delegada: um app acessa recursos em nome do usuário via access token com escopos, sem ter a senha. OIDC é uma camada sobre o OAuth2 que adiciona autenticação (ID Token), base de "entrar com Google" e SSO. Fluxos: Authorization Code + PKCE (com usuário), Client Credentials (máquina a máquina).

</details>

**11. Explique SQL injection, XSS e CSRF e suas defesas.**
<sub>Aula [04 — Autenticação, Autorização e Segurança Web](../aulas/04-autenticacao-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

SQL injection: input vira parte do SQL → queries parametrizadas/ORM. XSS: script injetado roda no navegador de outro usuário → escapar saída, sanitizar HTML, CSP, cookie HttpOnly. CSRF: outro site faz o navegador da vítima mandar requisição autenticada → SameSite, token CSRF, checagem de Origin.

</details>

**12. Quais são os níveis de isolamento e as anomalias?**
<sub>Aula [05 — Banco de dados relacional: modelagem, ACID, transações, isolamento e índices](../aulas/05-banco-relacional.md)</sub>
<details><summary>Ver resposta</summary>

Read Uncommitted (permite dirty read), Read Committed (evita dirty read; padrão do Postgres), Repeatable Read (evita non-repeatable read; padrão do MySQL) e Serializable (evita também phantom reads). Mais isolamento = mais correção e menos concorrência.

</details>

**13. Lock otimista vs pessimista?**
<sub>Aula [05 — Banco de dados relacional: modelagem, ACID, transações, isolamento e índices](../aulas/05-banco-relacional.md)</sub>
<details><summary>Ver resposta</summary>

Pessimista trava antes (SELECT FOR UPDATE): garantido, mas com espera e risco de deadlock; bom com conflito frequente. Otimista confere na escrita com uma coluna version (UPDATE ... WHERE version = x); sem travas, precisa tratar conflito com retry ou 409; bom com conflito raro.

</details>

**14. O que é replication lag e como lidar?**
<sub>Aula [06 — Escalando o banco e NoSQL: pool, réplicas, sharding, CAP e tipos de banco](../aulas/06-escalando-banco-e-nosql.md)</sub>
<details><summary>Ver resposta</summary>

Atraso entre a escrita no primário e sua chegada nas réplicas (replicação assíncrona). O usuário pode não ver o que acabou de gravar. Solução: read-your-writes (ler do primário logo após escrever).

</details>

**15. Quando usar NoSQL? Cite tipos.**
<sub>Aula [06 — Escalando o banco e NoSQL: pool, réplicas, sharding, CAP e tipos de banco](../aulas/06-escalando-banco-e-nosql.md)</sub>
<details><summary>Ver resposta</summary>

Quando há um padrão de acesso específico ou escala que o relacional não atende bem. Tipos: documento (MongoDB), chave-valor (Redis, DynamoDB), colunar (Cassandra), grafo (Neo4j), busca (Elasticsearch), séries temporais, vetorial (pgvector) para embeddings/RAG. Relacional continua sendo o padrão para dados de negócio com transações.

</details>

**16. Que trade-offs existem ao usar Redis?**
<sub>Aula [07 — Cache e Redis](../aulas/07-cache-e-redis.md)</sub>
<details><summary>Ver resposta</summary>

Ganha latência muito baixa e estruturas prontas (cache, sessão, rate limit, lock, filas, pub/sub). Custa memória (cara e limitada), persistência não é o forte (RDB/AOF), é mais uma peça para operar e monitorar, e como cache traz risco de dado desatualizado.

</details>

**17. Fila, pub/sub e Kafka: qual a diferença?**
<sub>Aula [08 — Mensageria, processamento assíncrono e arquitetura orientada a eventos](../aulas/08-mensageria-e-eventos.md)</sub>
<details><summary>Ver resposta</summary>

Fila: cada mensagem vai para um consumidor e some (distribuir trabalho). Pub/sub: cada assinante recebe uma cópia (distribuir eventos). Kafka: log com retenção, partições e offsets por consumer group, permitindo replay e alto throughput, com ordem por partição.

</details>

**18. O que significa entrega at-least-once e qual a consequência?**
<sub>Aula [08 — Mensageria, processamento assíncrono e arquitetura orientada a eventos](../aulas/08-mensageria-e-eventos.md)</sub>
<details><summary>Ver resposta</summary>

A mensagem nunca é perdida, mas pode ser entregue mais de uma vez (ex: consumidor processou e caiu antes do ack). Consequência: o consumidor precisa ser idempotente (id da mensagem + controle de processados, constraint única, operações idempotentes).

</details>

**19. Monolito ou microsserviços?**
<sub>Aula [09 — Arquitetura de software: monolito, microsserviços, camadas, hexagonal, DDD, BFF e API Gateway](../aulas/09-arquitetura-de-software.md)</sub>
<details><summary>Ver resposta</summary>

Começaria com monolito modular (fronteiras claras, um deploy). Microsserviços dão deploy/escala independentes e autonomia de times, mas trazem latência de rede, consistência eventual, tracing distribuído e muita infra. Extrair quando houver dor concreta (Lei de Conway, escala diferente, isolamento de falhas).

</details>

**20. O que é BFF e como difere de um API Gateway?**
<sub>Aula [09 — Arquitetura de software: monolito, microsserviços, camadas, hexagonal, DDD, BFF e API Gateway](../aulas/09-arquitetura-de-software.md)</sub>
<details><summary>Ver resposta</summary>

BFF: backend dedicado a um front, que agrega e adapta dados de vários serviços e esconde segredos (ex: chave do provedor de IA). API Gateway: porta de entrada genérica para vários serviços, com roteamento, autenticação, rate limit e TLS. Podem coexistir.

</details>

**21. Escala vertical vs horizontal? Por que crescimento vertical é uma preocupação?**
<sub>Aula [10 — Escalabilidade e Resiliência](../aulas/10-escalabilidade-e-resiliencia.md)</sub>
<details><summary>Ver resposta</summary>

Vertical: máquina maior; simples, mas tem teto físico, custo crescente, downtime para trocar e continua sendo ponto único de falha. Horizontal: mais instâncias; escala quase sem teto e aumenta disponibilidade, mas exige aplicação stateless e load balancer.

</details>

**22. Onde entra um load balancer e por que não colocar desde o início?**
<sub>Aula [10 — Escalabilidade e Resiliência](../aulas/10-escalabilidade-e-resiliencia.md)</sub>
<details><summary>Ver resposta</summary>

Na frente das réplicas da aplicação, distribuindo requisições e tirando instâncias doentes via health check. Com uma instância só, ele adiciona custo e uma peça sem benefício; entra quando há mais de uma instância, por carga ou disponibilidade (e muitas plataformas já o incluem).

</details>

**23. O que é débito técnico e como gerenciar?**
<sub>Aula [11 — Design de código: SOLID, acoplamento, coesão, princípios e débito técnico](../aulas/11-design-de-codigo.md)</sub>
<details><summary>Ver resposta</summary>

Custo futuro de uma solução mais rápida hoje, que cobra "juros" em cada mudança. Pode ser consciente (decisão de MVP) ou imprudente. Gerenciar registrando, priorizando por impacto, pagando aos poucos e explicando em termos de negócio.

</details>

**24. Blue-green vs canary vs rolling update?**
<sub>Aula [12 — Observabilidade, Testes, CI/CD, Containers e estratégias de deploy](../aulas/12-observabilidade-e-devops.md)</sub>
<details><summary>Ver resposta</summary>

Rolling: substitui instâncias aos poucos, sem downtime. Blue-green: dois ambientes completos, troca todo o tráfego de uma vez, rollback instantâneo, infra dobrada. Canary: fração crescente de tráfego para a nova versão, monitorando. Em todos, versões convivem, então migrações precisam ser compatíveis (expand and contract).

</details>

**25. Qual a diferença entre merge e rebase? Quando usar cada um?**
<sub>Aula [13 — Git e fluxo de trabalho em equipe](../aulas/13-git-e-fluxo-de-trabalho.md)</sub>
<details><summary>Ver resposta</summary>

Merge integra preservando o histórico real e cria um merge commit quando as branches divergiram; não reescreve nada, então é seguro em branch compartilhada. Rebase reaplica seus commits em cima da outra branch, criando commits novos e um histórico linear, mas reescreve o histórico. Rebase na sua branch local (atualizar, arrumar commits antes do PR); nunca em branch que outros já baixaram.

</details>

**26. `git revert` ou `git reset`?**
<sub>Aula [13 — Git e fluxo de trabalho em equipe](../aulas/13-git-e-fluxo-de-trabalho.md)</sub>
<details><summary>Ver resposta</summary>

Revert cria um novo commit que desfaz outro, sem reescrever histórico: é o certo para algo que já está no remoto. Reset move a branch para trás (soft mantém no staging, mixed nos arquivos, hard descarta) e reescreve histórico: só para commits locais. Se algo der errado, o reflog permite recuperar.

</details>

**27. Git Flow, GitHub Flow ou trunk-based?**
<sub>Aula [13 — Git e fluxo de trabalho em equipe](../aulas/13-git-e-fluxo-de-trabalho.md)</sub>
<details><summary>Ver resposta</summary>

Git Flow (main, develop, release, hotfix) serve para produtos com versões planejadas. GitHub Flow (main sempre implantável, branches curtas, PR e deploy) serve para aplicações web com deploy contínuo. Trunk-based integra na main várias vezes por dia, com feature flags para código incompleto, e exige CI forte. Branches longas geram conflitos grandes, por isso a tendência é GitHub Flow ou trunk-based.

</details>

**28. Por que a busca num hash map é O(1) e quando ela piora?**
<sub>Aula [14 — Estruturas de dados, algoritmos e Big O](../aulas/14-estruturas-de-dados-e-big-o.md)</sub>
<details><summary>Ver resposta</summary>

A função hash transforma a chave num índice do array interno, então a busca vai direto na posição, O(1) em média. Piora com muitas colisões (chaves diferentes no mesmo índice), podendo chegar a O(n) com uma função hash ruim. Por isso a tabela cresce e redistribui quando o fator de carga passa do limite.

</details>

**29. Hash map ou árvore balanceada?**
<sub>Aula [14 — Estruturas de dados, algoritmos e Big O](../aulas/14-estruturas-de-dados-e-big-o.md)</sub>
<details><summary>Ver resposta</summary>

Hash map para busca, inserção e remoção por chave em O(1) médio, sem ordem. Árvore balanceada quando precisa de chaves ordenadas ou consulta por faixa (entre A e B), com O(log n). É o mesmo motivo de os índices de banco usarem B-Tree.

</details>

**30. Num encurtador de URL, redirecionar com 301 ou 302?**
<sub>Aula [15 — System design: como responder "desenhe um sistema"](../aulas/15-system-design.md)</sub>
<details><summary>Ver resposta</summary>

301 é permanente: o navegador guarda e as próximas visitas nem chegam no servidor, o que reduz carga mas perde a contagem de cliques e a possibilidade de mudar o destino. 302 é temporário: toda visita passa pelo servidor, permitindo métricas. Se estatística é requisito, 302.

</details>

**31. Por que fazer estimativas numa entrevista de system design?**
<sub>Aula [15 — System design: como responder "desenhe um sistema"](../aulas/15-system-design.md)</sub>
<details><summary>Ver resposta</summary>

Porque os números dizem o tamanho do problema e justificam cada peça da arquitetura. Saber que são 12 mil leituras por segundo e 2 TB por ano mostra que o foco é cache e leitura, e que sharding talvez nem seja necessário. Sem números, a arquitetura vira chute ou overengineering.

</details>

**32. RAG ou fine-tuning?**
<sub>Aula [16 — IA para devs: LLMs, embeddings, RAG e agentes](../aulas/16-ia-para-devs.md)</sub>
<details><summary>Ver resposta</summary>

RAG busca trechos dos seus documentos e manda junto na pergunta: traz conhecimento próprio e atualizado, com fonte, e muda assim que os documentos mudam. Fine-tuning ajusta comportamento, estilo ou formato com exemplos, e não é a melhor forma de ensinar fatos que mudam. Para responder sobre dados da empresa, RAG é a primeira opção.

</details>

**33. Por que validar a saída do LLM e o que fazer se vier JSON inválido?**
<sub>Aula [16 — IA para devs: LLMs, embeddings, RAG e agentes](../aulas/16-ia-para-devs.md)</sub>
<details><summary>Ver resposta</summary>

Porque o modelo é não determinístico e pode alucinar ou quebrar o formato; a resposta deve ser tratada como input externo não confiável. Valido com schema (Zod, JSON Schema) e, se falhar, faço retry mandando o erro de validação, com limite de tentativas, e depois falho de forma controlada ou uso fallback.

</details>

**34. Por que falar "eu" em vez de "a gente" ao contar um projeto?**
<sub>Aula [17 — Entrevista comportamental: como contar a sua experiência](../aulas/17-entrevista-comportamental.md)</sub>
<details><summary>Ver resposta</summary>

Porque o entrevistador quer entender a sua contribuição e as suas decisões. "A gente fez" esconde o seu papel. Dá para reconhecer o time e ainda deixar claro o que foi seu: "o time decidiu migrar; eu fiquei com a parte de filas e propus usar idempotência por chave".

</details>

**35. Como responder "me fala de um erro que você cometeu"?**
<sub>Aula [17 — Entrevista comportamental: como contar a sua experiência](../aulas/17-entrevista-comportamental.md)</sub>
<details><summary>Ver resposta</summary>

Com uma história real: contexto curto, o erro, o que fez na hora para conter o impacto, a causa, e principalmente o que mudou depois (teste, alerta, processo). Mostrar aprendizado e postmortem sem culpados conta mais do que fingir que nunca errou.

</details>
