# Dicionário do dia a dia

Do jeito que eu falo → o nome técnico → como soar numa entrevista.

A ideia é ler a coluna da esquerda, reconhecer algo que já fiz, e decorar as outras duas.

## Backend e API

| Eu falo assim | Isso se chama | Como falar |
|---|---|---|
| "Joguei pra rodar depois, em segundo plano" | **Processamento assíncrono** / **background job** | "Desacoplei o processamento pesado da requisição usando uma fila e workers." |
| "Coloquei uma fila no Redis" | **Message queue** / **fila de mensagens** (ex: BullMQ) | "Usei BullMQ sobre Redis como *message broker* pra enfileirar os jobs." |
| "O código que fica pegando as coisas da fila" | **Worker** / **consumer** | "Um *worker* consome os jobs da fila de forma independente da API." |
| "A API manda, a outra parte pega" | **Producer / Consumer** | "A API atua como *producer* e os workers como *consumers*." |
| "Se der erro ele tenta de novo" | **Retry** | "Configurei *retry* com *backoff exponencial* pra falhas transitórias." |
| "Espera um pouco mais a cada tentativa" | **Backoff exponencial** | "Cada nova tentativa espera o dobro, pra não martelar um serviço que já está com problema." |
| "Depois de falhar muito, joga pra um canto" | **DLQ — Dead Letter Queue** | "Jobs que estouram o limite de tentativas vão pra uma DLQ pra análise manual." |
| "Garantir que não processa duas vezes" | **Idempotência** | "A operação é *idempotente*: executar duas vezes gera o mesmo resultado que uma." |
| "Guardei no Redis pra não ir no banco toda hora" | **Cache** | "Implementei uma camada de *cache* pra reduzir latência e carga no banco." |
| "Limitar quantas requisições alguém pode fazer" | **Rate limiting** / **throttling** | "Apliquei *rate limiting* pra proteger a API de abuso e picos de tráfego." |
| "A API não guarda nada na memória dela" | **Stateless** | "A API é *stateless*, o estado fica no banco/Redis, então escala horizontalmente." |
| "Subir mais máquinas iguais" | **Escalabilidade horizontal** (*scale out*) | "Escalo horizontalmente adicionando instâncias atrás de um *load balancer*." |
| "Colocar uma máquina mais forte" | **Escalabilidade vertical** (*scale up*) | "Escalar verticalmente tem teto e custo alto, por isso preferimos o horizontal." |
| "O que distribui as requisições entre os servidores" | **Load balancer** | "Um *load balancer* distribui o tráfego entre as réplicas." |
| "Backend feito só pra atender o front" | **BFF — Backend for Frontend** | "Criamos um BFF pra agregar e adaptar dados específicos pro front." |
| "Respondi logo e mandei processar depois" | **HTTP 202 Accepted** | "Retorno 202 porque a requisição foi aceita, mas o processamento é assíncrono." |
| "O servidor fica mandando atualização pro front" | **SSE — Server-Sent Events** / **push** | "Uso SSE pra *streaming* unidirecional do servidor pro cliente." |
| "Conexão aberta dos dois lados" | **WebSocket** / comunicação *full-duplex* | "WebSocket quando preciso de comunicação bidirecional em tempo real." |
| "Checar se o dado que chegou está certo" | **Validação de schema** / **validação de contrato** | "Valido o *payload* na borda com Zod / class-validator." |
| "Deixei o código separado em partes" | **Separação de responsabilidades** / **desacoplamento** | "Separei em camadas pra reduzir acoplamento e facilitar teste." |
| "Criei uma interface pra trocar a implementação fácil" | **Abstração** / **Inversão de dependência** | "Dependo de abstrações, não de implementações concretas (o D do SOLID)." |
| "O framework que cria as classes e passa pra mim" | **Injeção de dependência (DI)** / **IoC** | "O container de DI resolve e injeta as dependências." |
| "Um código no meio do caminho da requisição" | **Middleware** / **interceptor** | "Coloquei a lógica transversal num *middleware*, fora da regra de negócio." |
| "Log, autenticação, coisas que todo endpoint precisa" | **Cross-cutting concerns** (preocupações transversais) | "Autenticação e logging são *cross-cutting concerns*, tratados em camada separada." |
| "Ver o que está acontecendo no sistema" | **Observabilidade** (logs, métricas, traces) | "Temos observabilidade com logs estruturados, métricas e *tracing* distribuído." |

## Banco de dados

| Eu falo assim | Isso se chama | Como falar |
|---|---|---|
| "Fiz o banco ficar rápido nessa busca" | **Índice** / **otimização de query** | "Criei um índice composto e validei com `EXPLAIN ANALYZE`." |
| "Ou salva tudo ou não salva nada" | **Transação** / **atomicidade** (ACID) | "Envolvi as operações numa transação pra garantir atomicidade." |
| "Buscava no loop e fazia mil queries" | **Problema N+1** | "Identifiquei um N+1 e resolvi com *eager loading* / join." |
| "Script que altera a tabela" | **Migration** | "Versiono o schema com *migrations*." |
| "Busca por significado, não por palavra" | **Busca semântica** / **embeddings** / **vector search** | "Gero *embeddings* e faço busca por similaridade com pgvector." |

## Frontend / Next.js

| Eu falo assim | Isso se chama | Como falar |
|---|---|---|
| "A página já vem pronta do servidor" | **SSR — Server-Side Rendering** | "Renderizo no servidor pra melhorar SEO e *first paint*." |
| "A página é gerada no build" | **SSG — Static Site Generation** | "Páginas estáticas geradas em *build time* e servidas via CDN." |
| "Gera estática mas atualiza de tempos em tempos" | **ISR — Incremental Static Regeneration** | "Uso ISR com revalidação a cada N segundos." |
| "O JS 'liga' o HTML que veio do servidor" | **Hydration** | "Após o SSR, o React faz a *hydration* pra tornar a página interativa." |
| "Carregar só quando precisar" | **Lazy loading** / **code splitting** | "Apliquei *code splitting* pra reduzir o *bundle* inicial." |

## Processo e arquitetura

| Eu falo assim | Isso se chama | Como falar |
|---|---|---|
| "Escolhi isso sabendo que perdia aquilo" | **Trade-off** | "O *trade-off* foi abrir mão de X pra ganhar Y." |
| "Fiz o mínimo pra lançar" | **MVP** | "No MVP priorizamos entregar valor rápido e deixamos X pra uma segunda fase." |
| "Gambiarra que depois tem que arrumar" | **Débito técnico** (*tech debt*) | "Assumimos um débito técnico consciente e registramos pra pagar depois." |
| "Um sistema cai e não derruba o outro" | **Resiliência** / **isolamento de falhas** | "Isolar em fila aumenta a resiliência: se o provider cai, os jobs esperam." |
| "Parar de chamar um serviço que está caindo" | **Circuit breaker** | "Um *circuit breaker* evita falhas em cascata." |
| "Mudar o código sem mudar o que ele faz" | **Refatoração** | "Refatorei pra reduzir complexidade sem alterar o comportamento." |

---

> Achou um novo? Adicione aqui uma linha. Quanto mais do **seu** jeito de falar estiver na coluna da esquerda, melhor.
