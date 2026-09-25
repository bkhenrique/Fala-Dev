# Fundamentos — perguntas

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

As perguntas estão separadas por **nível**, e cada uma indica a aula de onde vem.

---

## Nível 1 — O que é?

_Definições. Tem que sair sem pensar._

**1. O que é DNS e o que é o TTL de um registro?**
<sub>Aula [01 — Como a web funciona: do navegador ao servidor](aulas/01-como-a-web-funciona.md)</sub>
<details><summary>Ver resposta</summary>

Sistema que traduz nomes de domínio em IPs, de forma hierárquica e distribuída. O TTL define por quanto tempo a resposta pode ficar em cache; por isso mudanças de DNS demoram a "propagar".

</details>

**2. O que o TLS garante e como funciona o handshake?**
<sub>Aula [01 — Como a web funciona: do navegador ao servidor](aulas/01-como-a-web-funciona.md)</sub>
<details><summary>Ver resposta</summary>

Confidencialidade, integridade e autenticidade. O servidor apresenta um certificado assinado por uma CA; com criptografia assimétrica os dois combinam uma chave de sessão, e o resto da comunicação usa criptografia simétrica, mais rápida.

</details>

**3. O que é idempotência em HTTP? Quais métodos são idempotentes?**
<sub>Aula [02 — HTTP a fundo: métodos, status, headers, cookies e cache](aulas/02-http-a-fundo.md)</sub>
<details><summary>Ver resposta</summary>

Executar N vezes tem o mesmo efeito no servidor que executar uma vez. GET, HEAD, OPTIONS, PUT e DELETE são; POST não, e PATCH não é garantido. Importa para retry: repetir POST pode duplicar operações.

</details>

**4. Quais atributos de cookie importam para segurança?**
<sub>Aula [02 — HTTP a fundo: métodos, status, headers, cookies e cache](aulas/02-http-a-fundo.md)</sub>
<details><summary>Ver resposta</summary>

HttpOnly (JS não lê, protege contra roubo por XSS), Secure (só HTTPS) e SameSite Lax/Strict (não enviado em requisições de outros sites, protege contra CSRF).

</details>

**5. O que é REST?**
<sub>Aula [03 — APIs: REST, GraphQL, gRPC, Webhooks e comunicação em tempo real](aulas/03-apis-rest-graphql-grpc-tempo-real.md)</sub>
<details><summary>Ver resposta</summary>

Estilo arquitetural: recursos identificados por URLs, manipulados via métodos HTTP com sua semântica, stateless, com representações (JSON) e respostas cacheáveis. A maioria das APIs "REST" é nível 2 de Richardson (sem HATEOAS).

</details>

**6. O que é CORS? Ele protege a API?**
<sub>Aula [04 — Autenticação, Autorização e Segurança Web](aulas/04-autenticacao-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Mecanismo em que o servidor diz ao navegador quais origens podem ler suas respostas, relaxando a Same-Origin Policy; requisições não simples fazem preflight OPTIONS. Não é autenticação: curl e outros backends ignoram CORS.

</details>

**7. O que é ACID?**
<sub>Aula [05 — Banco de dados relacional: modelagem, ACID, transações, isolamento e índices](aulas/05-banco-relacional.md)</sub>
<details><summary>Ver resposta</summary>

Atomicidade (tudo ou nada), Consistência (de um estado válido para outro), Isolamento (transações concorrentes não interferem, em níveis configuráveis) e Durabilidade (após o commit, não se perde).

</details>

**8. Como funciona um índice e qual o custo dele?**
<sub>Aula [05 — Banco de dados relacional: modelagem, ACID, transações, isolamento e índices](aulas/05-banco-relacional.md)</sub>
<details><summary>Ver resposta</summary>

Estrutura (normalmente B-Tree) que permite achar linhas em O(log n) em vez de varrer a tabela. Custa espaço e deixa escritas mais lentas. Índice composto segue o prefixo mais à esquerda; funções na coluna e LIKE '%x' não usam índice comum.

</details>

**9. Explique o teorema CAP.**
<sub>Aula [06 — Escalando o banco e NoSQL: pool, réplicas, sharding, CAP e tipos de banco](aulas/06-escalando-banco-e-nosql.md)</sub>
<details><summary>Ver resposta</summary>

Num sistema distribuído, durante uma partição de rede, é preciso escolher entre consistência (todos veem o dado mais recente ou recebem erro) e disponibilidade (sempre responder, talvez com dado antigo). Na prática, CP ou AP. PACELC acrescenta o trade-off latência × consistência sem partição.

</details>

**10. O que é cache-aside?**
<sub>Aula [07 — Cache e Redis](aulas/07-cache-e-redis.md)</sub>
<details><summary>Ver resposta</summary>

A aplicação procura no cache; se não achar (miss), busca na fonte, grava no cache com TTL e retorna. Só cacheia o que é usado e tolera o cache cair; pode servir dado velho até expirar ou ser invalidado.

</details>

**11. O que é o Outbox Pattern?**
<sub>Aula [08 — Mensageria, processamento assíncrono e arquitetura orientada a eventos](aulas/08-mensageria-e-eventos.md)</sub>
<details><summary>Ver resposta</summary>

Solução para o dual write (não há transação entre banco e broker): na mesma transação grava-se a entidade e o evento numa tabela outbox; um processo separado (polling ou CDC/Debezium) publica no broker. Garante que o evento sai se o dado foi salvo; consumidores idempotentes.

</details>

**12. O que é uma Saga?**
<sub>Aula [08 — Mensageria, processamento assíncrono e arquitetura orientada a eventos](aulas/08-mensageria-e-eventos.md)</sub>
<details><summary>Ver resposta</summary>

Forma de fazer uma operação entre vários serviços sem transação distribuída: sequência de transações locais, com ações compensatórias para desfazer os passos anteriores se algum falhar. Pode ser coreografada (eventos) ou orquestrada (coordenador central).

</details>

**13. O que é arquitetura hexagonal (ports and adapters)?**
<sub>Aula [09 — Arquitetura de software: monolito, microsserviços, camadas, hexagonal, DDD, BFF e API Gateway](aulas/09-arquitetura-de-software.md)</sub>
<details><summary>Ver resposta</summary>

Domínio e casos de uso no centro, sem depender de infraestrutura; o núcleo define portas (interfaces) e as bordas têm adaptadores (HTTP, fila, banco, provedores). Dependências apontam para dentro. Ganha testabilidade e troca de tecnologia; custa indireção.

</details>

**14. O que são bounded context, entidade, value object e agregado?**
<sub>Aula [09 — Arquitetura de software: monolito, microsserviços, camadas, hexagonal, DDD, BFF e API Gateway](aulas/09-arquitetura-de-software.md)</sub>
<details><summary>Ver resposta</summary>

Bounded context: fronteira onde um modelo tem significado único. Entidade: tem identidade que persiste. Value object: definido pelos valores, imutável. Agregado: grupo tratado como unidade de consistência, acessado pela raiz.

</details>

**15. O que é circuit breaker e como ele se relaciona com timeout e retry?**
<sub>Aula [10 — Escalabilidade e Resiliência](aulas/10-escalabilidade-e-resiliencia.md)</sub>
<details><summary>Ver resposta</summary>

Disjuntor que, após muitas falhas numa dependência, abre e passa a falhar rápido (com fallback); depois de um tempo, em meio-aberto, testa algumas chamadas e fecha se derem certo. Evita falha em cascata. Timeout limita a espera de cada chamada; retry com backoff e jitter trata falhas transitórias; o breaker impede retries infinitos contra um serviço fora do ar.

</details>

**16. Explique SOLID com exemplos.**
<sub>Aula [11 — Design de código: SOLID, acoplamento, coesão, princípios e débito técnico](aulas/11-design-de-codigo.md)</sub>
<details><summary>Ver resposta</summary>

S: uma classe, um motivo para mudar. O: estender sem modificar (Strategy em vez de switch). L: subclasse substitui a pai sem quebrar. I: interfaces pequenas e específicas. D: regra de negócio depende de abstrações, implementações injetadas.

</details>

---

## Nível 2 — Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os *trade-offs*._

**17. Qual a diferença entre TCP e UDP?**
<sub>Aula [01 — Como a web funciona: do navegador ao servidor](aulas/01-como-a-web-funciona.md)</sub>
<details><summary>Ver resposta</summary>

TCP: orientado a conexão (handshake), entrega confiável e ordenada, com retransmissão e controle de fluxo. UDP: sem conexão e sem garantia, mais rápido e leve; usado em streaming ao vivo, jogos, DNS e no HTTP/3 (QUIC).

</details>

**18. Qual a diferença entre 201 e 202?**
<sub>Aula [02 — HTTP a fundo: métodos, status, headers, cookies e cache](aulas/02-http-a-fundo.md)</sub>
<details><summary>Ver resposta</summary>

201 Created: recurso criado e já existe (com header Location). 202 Accepted: requisição aceita para processamento posterior, típico de fluxo assíncrono com fila; devolve um id para acompanhar o status.

</details>

**19. Qual a diferença entre 401 e 403? E 502 e 504?**
<sub>Aula [02 — HTTP a fundo: métodos, status, headers, cookies e cache](aulas/02-http-a-fundo.md)</sub>
<details><summary>Ver resposta</summary>

401: não autenticado. 403: autenticado sem permissão. 502 Bad Gateway: o proxy recebeu resposta inválida do servidor de trás (ex: app caiu). 504 Gateway Timeout: o proxy não recebeu resposta a tempo (app lenta).

</details>

**20. PUT vs PATCH?**
<sub>Aula [02 — HTTP a fundo: métodos, status, headers, cookies e cache](aulas/02-http-a-fundo.md)</sub>
<details><summary>Ver resposta</summary>

PUT substitui o recurso inteiro (idempotente). PATCH altera parcialmente só os campos enviados (não necessariamente idempotente).

</details>

**21. Como funciona o cache HTTP com Cache-Control e ETag?**
<sub>Aula [02 — HTTP a fundo: métodos, status, headers, cookies e cache](aulas/02-http-a-fundo.md)</sub>
<details><summary>Ver resposta</summary>

Cache-Control define se e por quanto tempo guardar (max-age, no-cache = revalidar, no-store = não guardar, public/private). ETag identifica a versão; o cliente manda If-None-Match e, se não mudou, recebe 304 Not Modified sem corpo.

</details>

**22. Paginação por offset ou por cursor?**
<sub>Aula [03 — APIs: REST, GraphQL, gRPC, Webhooks e comunicação em tempo real](aulas/03-apis-rest-graphql-grpc-tempo-real.md)</sub>
<details><summary>Ver resposta</summary>

Offset (page/size) é simples e permite pular páginas, mas fica lento com offsets grandes e pode repetir/pular itens com inserções. Cursor (depois do último id) é rápido e estável, ideal para feeds e scroll infinito, mas não permite ir direto a uma página.

</details>

**23. REST, GraphQL ou gRPC?**
<sub>Aula [03 — APIs: REST, GraphQL, gRPC, Webhooks e comunicação em tempo real](aulas/03-apis-rest-graphql-grpc-tempo-real.md)</sub>
<details><summary>Ver resposta</summary>

REST para APIs públicas e CRUD (simples, cache HTTP). GraphQL quando vários clientes precisam de dados diferentes (cliente escolhe campos; cuidado com N+1 e cache). gRPC para comunicação interna entre serviços (HTTP/2 + Protobuf, rápido, contrato forte).

</details>

**24. Por que usar SSE e quando usar WebSocket?**
<sub>Aula [03 — APIs: REST, GraphQL, gRPC, Webhooks e comunicação em tempo real](aulas/03-apis-rest-graphql-grpc-tempo-real.md)</sub>
<details><summary>Ver resposta</summary>

SSE quando o fluxo é só servidor → cliente (progresso de job, streaming de IA): HTTP comum, reconexão automática, passa por proxies. WebSocket quando os dois lados trocam mensagens constantemente (chat, colaboração); é mais complexo de escalar (conexões persistentes, pub/sub entre instâncias).

</details>

**25. Sessão vs JWT?**
<sub>Aula [04 — Autenticação, Autorização e Segurança Web](aulas/04-autenticacao-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Sessão: estado no servidor (Redis/banco), cookie com id; revogação fácil, precisa de armazenamento compartilhado. JWT: token assinado autocontido; stateless e escalável, mas difícil de revogar. Padrão com JWT: access token curto + refresh token revogável.

</details>

**26. OAuth2 vs OpenID Connect?**
<sub>Aula [04 — Autenticação, Autorização e Segurança Web](aulas/04-autenticacao-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

OAuth2 é autorização delegada: um app acessa recursos em nome do usuário via access token com escopos, sem ter a senha. OIDC é uma camada sobre o OAuth2 que adiciona autenticação (ID Token), base de "entrar com Google" e SSO. Fluxos: Authorization Code + PKCE (com usuário), Client Credentials (máquina a máquina).

</details>

**27. Explique SQL injection, XSS e CSRF e suas defesas.**
<sub>Aula [04 — Autenticação, Autorização e Segurança Web](aulas/04-autenticacao-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

SQL injection: input vira parte do SQL → queries parametrizadas/ORM. XSS: script injetado roda no navegador de outro usuário → escapar saída, sanitizar HTML, CSP, cookie HttpOnly. CSRF: outro site faz o navegador da vítima mandar requisição autenticada → SameSite, token CSRF, checagem de Origin.

</details>

**28. Quais são os níveis de isolamento e as anomalias?**
<sub>Aula [05 — Banco de dados relacional: modelagem, ACID, transações, isolamento e índices](aulas/05-banco-relacional.md)</sub>
<details><summary>Ver resposta</summary>

Read Uncommitted (permite dirty read), Read Committed (evita dirty read; padrão do Postgres), Repeatable Read (evita non-repeatable read; padrão do MySQL) e Serializable (evita também phantom reads). Mais isolamento = mais correção e menos concorrência.

</details>

**29. Lock otimista vs pessimista?**
<sub>Aula [05 — Banco de dados relacional: modelagem, ACID, transações, isolamento e índices](aulas/05-banco-relacional.md)</sub>
<details><summary>Ver resposta</summary>

Pessimista trava antes (SELECT FOR UPDATE): garantido, mas com espera e risco de deadlock; bom com conflito frequente. Otimista confere na escrita com uma coluna version (UPDATE ... WHERE version = x); sem travas, precisa tratar conflito com retry ou 409; bom com conflito raro.

</details>

**30. O que é replication lag e como lidar?**
<sub>Aula [06 — Escalando o banco e NoSQL: pool, réplicas, sharding, CAP e tipos de banco](aulas/06-escalando-banco-e-nosql.md)</sub>
<details><summary>Ver resposta</summary>

Atraso entre a escrita no primário e sua chegada nas réplicas (replicação assíncrona). O usuário pode não ver o que acabou de gravar. Solução: read-your-writes (ler do primário logo após escrever).

</details>

**31. Quando usar NoSQL? Cite tipos.**
<sub>Aula [06 — Escalando o banco e NoSQL: pool, réplicas, sharding, CAP e tipos de banco](aulas/06-escalando-banco-e-nosql.md)</sub>
<details><summary>Ver resposta</summary>

Quando há um padrão de acesso específico ou escala que o relacional não atende bem. Tipos: documento (MongoDB), chave-valor (Redis, DynamoDB), colunar (Cassandra), grafo (Neo4j), busca (Elasticsearch), séries temporais, vetorial (pgvector) para embeddings/RAG. Relacional continua sendo o padrão para dados de negócio com transações.

</details>

**32. Que trade-offs existem ao usar Redis?**
<sub>Aula [07 — Cache e Redis](aulas/07-cache-e-redis.md)</sub>
<details><summary>Ver resposta</summary>

Ganha latência muito baixa e estruturas prontas (cache, sessão, rate limit, lock, filas, pub/sub). Custa memória (cara e limitada), persistência não é o forte (RDB/AOF), é mais uma peça para operar e monitorar, e como cache traz risco de dado desatualizado.

</details>

**33. Fila, pub/sub e Kafka: qual a diferença?**
<sub>Aula [08 — Mensageria, processamento assíncrono e arquitetura orientada a eventos](aulas/08-mensageria-e-eventos.md)</sub>
<details><summary>Ver resposta</summary>

Fila: cada mensagem vai para um consumidor e some (distribuir trabalho). Pub/sub: cada assinante recebe uma cópia (distribuir eventos). Kafka: log com retenção, partições e offsets por consumer group, permitindo replay e alto throughput, com ordem por partição.

</details>

**34. O que significa entrega at-least-once e qual a consequência?**
<sub>Aula [08 — Mensageria, processamento assíncrono e arquitetura orientada a eventos](aulas/08-mensageria-e-eventos.md)</sub>
<details><summary>Ver resposta</summary>

A mensagem nunca é perdida, mas pode ser entregue mais de uma vez (ex: consumidor processou e caiu antes do ack). Consequência: o consumidor precisa ser idempotente (id da mensagem + controle de processados, constraint única, operações idempotentes).

</details>

**35. Monolito ou microsserviços?**
<sub>Aula [09 — Arquitetura de software: monolito, microsserviços, camadas, hexagonal, DDD, BFF e API Gateway](aulas/09-arquitetura-de-software.md)</sub>
<details><summary>Ver resposta</summary>

Começaria com monolito modular (fronteiras claras, um deploy). Microsserviços dão deploy/escala independentes e autonomia de times, mas trazem latência de rede, consistência eventual, tracing distribuído e muita infra. Extrair quando houver dor concreta (Lei de Conway, escala diferente, isolamento de falhas).

</details>

**36. O que é BFF e como difere de um API Gateway?**
<sub>Aula [09 — Arquitetura de software: monolito, microsserviços, camadas, hexagonal, DDD, BFF e API Gateway](aulas/09-arquitetura-de-software.md)</sub>
<details><summary>Ver resposta</summary>

BFF: backend dedicado a um front, que agrega e adapta dados de vários serviços e esconde segredos (ex: chave do provedor de IA). API Gateway: porta de entrada genérica para vários serviços, com roteamento, autenticação, rate limit e TLS. Podem coexistir.

</details>

**37. Escala vertical vs horizontal? Por que crescimento vertical é uma preocupação?**
<sub>Aula [10 — Escalabilidade e Resiliência](aulas/10-escalabilidade-e-resiliencia.md)</sub>
<details><summary>Ver resposta</summary>

Vertical: máquina maior; simples, mas tem teto físico, custo crescente, downtime para trocar e continua sendo ponto único de falha. Horizontal: mais instâncias; escala quase sem teto e aumenta disponibilidade, mas exige aplicação stateless e load balancer.

</details>

**38. Onde entra um load balancer e por que não colocar desde o início?**
<sub>Aula [10 — Escalabilidade e Resiliência](aulas/10-escalabilidade-e-resiliencia.md)</sub>
<details><summary>Ver resposta</summary>

Na frente das réplicas da aplicação, distribuindo requisições e tirando instâncias doentes via health check. Com uma instância só, ele adiciona custo e uma peça sem benefício; entra quando há mais de uma instância, por carga ou disponibilidade (e muitas plataformas já o incluem).

</details>

**39. O que é débito técnico e como gerenciar?**
<sub>Aula [11 — Design de código: SOLID, acoplamento, coesão, princípios e débito técnico](aulas/11-design-de-codigo.md)</sub>
<details><summary>Ver resposta</summary>

Custo futuro de uma solução mais rápida hoje, que cobra "juros" em cada mudança. Pode ser consciente (decisão de MVP) ou imprudente. Gerenciar registrando, priorizando por impacto, pagando aos poucos e explicando em termos de negócio.

</details>

**40. Blue-green vs canary vs rolling update?**
<sub>Aula [12 — Observabilidade, Testes, CI/CD, Containers e estratégias de deploy](aulas/12-observabilidade-e-devops.md)</sub>
<details><summary>Ver resposta</summary>

Rolling: substitui instâncias aos poucos, sem downtime. Blue-green: dois ambientes completos, troca todo o tráfego de uma vez, rollback instantâneo, infra dobrada. Canary: fração crescente de tráfego para a nova versão, monitorando. Em todos, versões convivem, então migrações precisam ser compatíveis (expand and contract).

</details>

---

## Nível 3 — Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**41. O que acontece quando você digita uma URL e aperta Enter?**
<sub>Aula [01 — Como a web funciona: do navegador ao servidor](aulas/01-como-a-web-funciona.md)</sub>
<details><summary>Ver resposta</summary>

DNS resolve o nome em IP (caches → resolver recursivo → raiz → TLD → autoritativo). Conexão TCP (three-way handshake) e handshake TLS (certificado + chave de sessão). Requisição HTTP, passando por CDN, load balancer e reverse proxy até a aplicação, que consulta banco/cache e responde. O navegador faz o parse, busca os recursos e renderiza.

</details>

**42. Quais cuidados ao receber webhooks?**
<sub>Aula [03 — APIs: REST, GraphQL, gRPC, Webhooks e comunicação em tempo real](aulas/03-apis-rest-graphql-grpc-tempo-real.md)</sub>
<details><summary>Ver resposta</summary>

Verificar a assinatura (HMAC), responder rápido e processar em fila, ser idempotente (pode haver reenvio) e não depender da ordem de chegada.

</details>

**43. Como armazenar senhas?**
<sub>Aula [04 — Autenticação, Autorização e Segurança Web](aulas/04-autenticacao-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Com hash lento e salt: argon2, bcrypt ou scrypt. Nunca texto puro ou hash rápido (MD5/SHA-256). Salt aleatório por usuário impede rainbow tables. Complementar com MFA e rate limit no login.

</details>

**44. Como investigaria uma query PostgreSQL lenta?**
<sub>Aula [05 — Banco de dados relacional: modelagem, ACID, transações, isolamento e índices](aulas/05-banco-relacional.md)</sub>
<details><summary>Ver resposta</summary>

pg_stat_statements para achar as queries mais caras; EXPLAIN ANALYZE para ver o plano real (seq scan, estimativas erradas, sort em disco). Resolver com índice adequado, reescrita da query, menos colunas, paginação por cursor, ANALYZE nas estatísticas. Medir de novo.

</details>

**45. Como escalaria um banco no limite?**
<sub>Aula [06 — Escalando o banco e NoSQL: pool, réplicas, sharding, CAP e tipos de banco](aulas/06-escalando-banco-e-nosql.md)</sub>
<details><summary>Ver resposta</summary>

Na ordem: queries e índices, cache, pool de conexões (PgBouncer com muitas instâncias), escala vertical, réplicas de leitura (cuidando do replication lag), particionamento e, por último, sharding.

</details>

**46. Como invalidar cache?**
<sub>Aula [07 — Cache e Redis](aulas/07-cache-e-redis.md)</sub>
<details><summary>Ver resposta</summary>

TTL (aceita dado velho até expirar), apagar a chave na escrita, invalidação por eventos, ou chaves versionadas. Com várias instâncias, preferir cache distribuído, já que invalidar cache local de uma não afeta as outras.

</details>

**47. O que é cache stampede e como evitar?**
<sub>Aula [07 — Cache e Redis](aulas/07-cache-e-redis.md)</sub>
<details><summary>Ver resposta</summary>

Uma chave muito acessada expira e milhares de requisições vão ao banco ao mesmo tempo. Evitar com lock/single-flight (só uma recalcula), stale-while-revalidate, jitter no TTL e pré-aquecimento.

</details>

**48. O que acontece com uma mensagem que falha 10 vezes?**
<sub>Aula [08 — Mensageria, processamento assíncrono e arquitetura orientada a eventos](aulas/08-mensageria-e-eventos.md)</sub>
<details><summary>Ver resposta</summary>

Após esgotar as tentativas (com backoff exponencial e jitter), vai para uma DLQ: para de ser tentada, não trava a fila, gera alerta, é investigada e reprocessada depois da correção.

</details>

**49. O que é stateless e como múltiplas instâncias compartilham estado?**
<sub>Aula [10 — Escalabilidade e Resiliência](aulas/10-escalabilidade-e-resiliencia.md)</sub>
<details><summary>Ver resposta</summary>

Nenhuma instância guarda estado que outra precise; qualquer uma atende qualquer requisição. O estado vai para serviços compartilhados: sessão em JWT/Redis, arquivos no S3, cache/locks no Redis, jobs em fila, dados no banco.

</details>

**50. Como você investigaria uma API lenta?**
<sub>Aula [12 — Observabilidade, Testes, CI/CD, Containers e estratégias de deploy](aulas/12-observabilidade-e-devops.md)</sub>
<details><summary>Ver resposta</summary>

Métricas primeiro (qual endpoint, p95/p99, desde quando, deploy ou pico, saturação de CPU/pool/fila), depois tracing distribuído para ver em que etapa o tempo é gasto, e logs com correlation id. Suspeitos: query lenta/N+1, dependência sem timeout, falta de cache, recurso saturado. Corrigir e comparar antes/depois.

</details>
