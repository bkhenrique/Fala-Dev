# Fundamentos — perguntas, nível 3: Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [índice](README.md)

---

**1. O que acontece quando você digita uma URL e aperta Enter?**
<sub>Aula [01 — Como a web funciona: do navegador ao servidor](../aulas/01-como-a-web-funciona.md)</sub>
<details><summary>Ver resposta</summary>

DNS resolve o nome em IP (caches → resolver recursivo → raiz → TLD → autoritativo). Conexão TCP (three-way handshake) e handshake TLS (certificado + chave de sessão). Requisição HTTP, passando por CDN, load balancer e reverse proxy até a aplicação, que consulta banco/cache e responde. O navegador faz o parse, busca os recursos e renderiza.

</details>

**2. Quais cuidados ao receber webhooks?**
<sub>Aula [03 — APIs: REST, GraphQL, gRPC, Webhooks e comunicação em tempo real](../aulas/03-apis-rest-graphql-grpc-tempo-real.md)</sub>
<details><summary>Ver resposta</summary>

Verificar a assinatura (HMAC), responder rápido e processar em fila, ser idempotente (pode haver reenvio) e não depender da ordem de chegada.

</details>

**3. Como armazenar senhas?**
<sub>Aula [04 — Autenticação, Autorização e Segurança Web](../aulas/04-autenticacao-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Com hash lento e salt: argon2, bcrypt ou scrypt. Nunca texto puro ou hash rápido (MD5/SHA-256). Salt aleatório por usuário impede rainbow tables. Complementar com MFA e rate limit no login.

</details>

**4. Como investigaria uma query PostgreSQL lenta?**
<sub>Aula [05 — Banco de dados relacional: modelagem, ACID, transações, isolamento e índices](../aulas/05-banco-relacional.md)</sub>
<details><summary>Ver resposta</summary>

pg_stat_statements para achar as queries mais caras; EXPLAIN ANALYZE para ver o plano real (seq scan, estimativas erradas, sort em disco). Resolver com índice adequado, reescrita da query, menos colunas, paginação por cursor, ANALYZE nas estatísticas. Medir de novo.

</details>

**5. Como escalaria um banco no limite?**
<sub>Aula [06 — Escalando o banco e NoSQL: pool, réplicas, sharding, CAP e tipos de banco](../aulas/06-escalando-banco-e-nosql.md)</sub>
<details><summary>Ver resposta</summary>

Na ordem: queries e índices, cache, pool de conexões (PgBouncer com muitas instâncias), escala vertical, réplicas de leitura (cuidando do replication lag), particionamento e, por último, sharding.

</details>

**6. Como invalidar cache?**
<sub>Aula [07 — Cache e Redis](../aulas/07-cache-e-redis.md)</sub>
<details><summary>Ver resposta</summary>

TTL (aceita dado velho até expirar), apagar a chave na escrita, invalidação por eventos, ou chaves versionadas. Com várias instâncias, preferir cache distribuído, já que invalidar cache local de uma não afeta as outras.

</details>

**7. O que é cache stampede e como evitar?**
<sub>Aula [07 — Cache e Redis](../aulas/07-cache-e-redis.md)</sub>
<details><summary>Ver resposta</summary>

Uma chave muito acessada expira e milhares de requisições vão ao banco ao mesmo tempo. Evitar com lock/single-flight (só uma recalcula), stale-while-revalidate, jitter no TTL e pré-aquecimento.

</details>

**8. O que acontece com uma mensagem que falha 10 vezes?**
<sub>Aula [08 — Mensageria, processamento assíncrono e arquitetura orientada a eventos](../aulas/08-mensageria-e-eventos.md)</sub>
<details><summary>Ver resposta</summary>

Após esgotar as tentativas (com backoff exponencial e jitter), vai para uma DLQ: para de ser tentada, não trava a fila, gera alerta, é investigada e reprocessada depois da correção.

</details>

**9. O que é stateless e como múltiplas instâncias compartilham estado?**
<sub>Aula [10 — Escalabilidade e Resiliência](../aulas/10-escalabilidade-e-resiliencia.md)</sub>
<details><summary>Ver resposta</summary>

Nenhuma instância guarda estado que outra precise; qualquer uma atende qualquer requisição. O estado vai para serviços compartilhados: sessão em JWT/Redis, arquivos no S3, cache/locks no Redis, jobs em fila, dados no banco.

</details>

**10. Como você investigaria uma API lenta?**
<sub>Aula [12 — Observabilidade, Testes, CI/CD, Containers e estratégias de deploy](../aulas/12-observabilidade-e-devops.md)</sub>
<details><summary>Ver resposta</summary>

Métricas primeiro (qual endpoint, p95/p99, desde quando, deploy ou pico, saturação de CPU/pool/fila), depois tracing distribuído para ver em que etapa o tempo é gasto, e logs com correlation id. Suspeitos: query lenta/N+1, dependência sem timeout, falta de cache, recurso saturado. Corrigir e comparar antes/depois.

</details>

**11. O que faz um bom pull request e uma boa revisão de código?**
<sub>Aula [13 — Git e fluxo de trabalho em equipe](../aulas/13-git-e-fluxo-de-trabalho.md)</sub>
<details><summary>Ver resposta</summary>

PR pequeno e com um assunto, descrição com o quê e por quê, como testar, e CI passando antes de pedir revisão. A revisão foca em correção, riscos, clareza e design (estilo é trabalho do linter), comenta o código e não a pessoa, faz perguntas e separa o que é bloqueante do que é sugestão.

</details>

**12. Tenho um loop dentro de outro verificando se itens de uma lista estão em outra. Como melhorar?**
<sub>Aula [14 — Estruturas de dados, algoritmos e Big O](../aulas/14-estruturas-de-dados-e-big-o.md)</sub>
<details><summary>Ver resposta</summary>

Hoje é O(n × m). Transformo a segunda lista num set (ou hash map) antes, e cada verificação passa a ser O(1) em média: o total cai para O(n + m) de tempo, gastando O(m) de memória. Troco memória por tempo.

</details>

**13. Como você desenharia um encurtador de URL?**
<sub>Aula [15 — System design: como responder "desenhe um sistema"](../aulas/15-system-design.md)</sub>
<details><summary>Ver resposta</summary>

Combino requisitos (criar, redirecionar, contar cliques, leitura muito maior que escrita), estimo QPS e armazenamento, defino POST para criar e GET que responde 302. Código em base62 com 7 caracteres, gerado por contador distribuído em faixas ou aleatório com checagem de colisão. Serviço stateless atrás de load balancer, cache no Redis para os links quentes, banco com o código como chave, e cliques enviados para uma fila e processados assíncronamente. Discuto falhas (cache fora), abuso (rate limit) e o trade-off de códigos previsíveis.

</details>

**14. Quais erros evitar numa entrevista de system design?**
<sub>Aula [15 — System design: como responder "desenhe um sistema"](../aulas/15-system-design.md)</sub>
<details><summary>Ver resposta</summary>

Desenhar antes de levantar requisitos, colocar microsserviços, Kafka e sharding sem números que justifiquem, escalar a aplicação e esquecer o banco, não falar do que acontece quando algo cai, e fazer monólogo em vez de confirmar decisões com o entrevistador.

</details>

**15. Como você arquitetaria uma funcionalidade com LLM em produção?**
<sub>Aula [16 — IA para devs: LLMs, embeddings, RAG e agentes](../aulas/16-ia-para-devs.md)</sub>
<details><summary>Ver resposta</summary>

O front chama o backend, nunca o provedor. O backend autentica, aplica cota, remove PII e chama uma camada de IA em que cada task depende de uma interface de provedor, com saída validada por schema. Tarefas longas vão para fila com 202, retry com backoff e idempotência; texto longo sai por SSE. Controlo custo com limite de tokens, modelo adequado por task e cache, tenho fallback entre provedores e rodo evals a cada mudança de prompt ou modelo.

</details>

**16. Como você se prepara para a parte comportamental de uma entrevista?**
<sub>Aula [17 — Entrevista comportamental: como contar a sua experiência](../aulas/17-entrevista-comportamental.md)</sub>
<details><summary>Ver resposta</summary>

Monto um banco de 5 a 8 histórias reais em STAR mais trade-off, cobrindo projeto, problema difícil, decisão técnica, erro, conflito, prazo, aprendizado e influência. Para cada uma listo as perguntas técnicas que ela pode gerar e respondo com a teoria. Treino em voz alta, gravando, e com alguém que me interrompa perguntando por quê.

</details>

**17. O que fazer quando não sabe a resposta de uma pergunta técnica?**
<sub>Aula [17 — Entrevista comportamental: como contar a sua experiência](../aulas/17-entrevista-comportamental.md)</sub>
<details><summary>Ver resposta</summary>

Não inventar. Dizer com honestidade que não trabalhei com aquilo diretamente e raciocinar em voz alta a partir do que sei: o que eu esperaria que acontecesse e como validaria. O entrevistador avalia o raciocínio, e um chute confiante que desmorona no follow-up é pior.

</details>
