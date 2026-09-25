# Fundamentos — glossário

Cada termo tem três partes: **Em uma frase** (a definição curta), **Traduzindo** (a explicação simples) e **Como falar** (uma frase pronta pra treinar em voz alta). Alguns trazem também **Não confundir com** ou **Cuidado**.

É material de revisão: a explicação completa está nas [aulas](README.md).

---

## HTTP e APIs

### Idempotência
- **Em uma frase:** uma operação é idempotente quando executá-la várias vezes produz o mesmo resultado que executá-la uma vez.
- **Traduzindo:** apertar o botão do elevador 10 vezes não chama 10 elevadores.
- **Como falar:** "Garanti idempotência usando uma *idempotency key*: se a mesma requisição chegar duas vezes, a segunda é ignorada e devolvo o resultado da primeira."
- **Não confundir com:** "não dar erro". Idempotência é sobre o *efeito* no sistema. GET, PUT e DELETE são idempotentes por definição; POST não.

### Status 200 / 201 / 202 / 204
- **Em uma frase:** 200 = OK com resposta; 201 = recurso criado; 202 = aceito, mas vai processar depois; 204 = OK sem corpo.
- **Traduzindo:** 201 é "pronto, criei"; 202 é "anotei seu pedido, te aviso quando ficar pronto".
- **Como falar:** "Retorno 202 Accepted porque o trabalho é assíncrono. Devolvo um *job id* pro cliente acompanhar o status."

### Stateless
- **Em uma frase:** o servidor não guarda estado da sessão do cliente entre requisições; cada requisição carrega tudo que precisa.
- **Traduzindo:** qualquer servidor consegue atender qualquer requisição, porque nenhum deles "lembra" de nada.
- **Como falar:** "Mantive a API *stateless*, com sessão em JWT e estado compartilhado no Redis, o que permite escalar horizontalmente sem *sticky session*."

### Autenticação vs Autorização
- **Em uma frase:** autenticação = *quem é você*; autorização = *o que você pode fazer*.
- **Traduzindo:** mostrar o crachá na portaria é autenticação; o crachá abrir só certos andares é autorização.
- **Como falar:** "A autenticação é feita via JWT e a autorização por *roles* (RBAC) verificadas num *guard*."

### JWT
- **Em uma frase:** token assinado que carrega *claims* (dados do usuário) e pode ser validado sem consultar o banco.
- **Traduzindo:** um crachá com assinatura que ninguém consegue falsificar, mas qualquer um consegue ler.
- **Como falar:** "Usamos JWT de curta duração com *refresh token*, porque JWT não dá pra revogar facilmente antes de expirar."
- **Não confundir com:** criptografia. O payload do JWT é só *Base64*, **não** é segredo.

### SSE vs WebSocket vs Polling
- **Em uma frase:** polling = cliente pergunta de tempos em tempos; SSE = servidor empurra dados numa conexão HTTP de mão única; WebSocket = conexão bidirecional persistente.
- **Traduzindo:** polling é ligar toda hora perguntando "já chegou?"; SSE é o rádio (só escuta); WebSocket é o telefone (os dois falam).
- **Como falar:** "Escolhi SSE porque o fluxo é só servidor → cliente, é HTTP puro, reconecta sozinho e é mais simples que WebSocket."

### CORS
- **Em uma frase:** mecanismo do navegador que bloqueia requisições entre origens diferentes, a menos que o servidor autorize via headers.
- **Traduzindo:** o navegador pergunta pro backend "esse site aqui pode falar com você?".
- **Como falar:** "Configurei CORS no backend liberando só as origens do nosso front."

---

## Arquitetura

### Escalabilidade vertical vs horizontal
- **Em uma frase:** vertical = aumentar a máquina (mais CPU/RAM); horizontal = adicionar mais máquinas.
- **Traduzindo:** vertical é trocar o carro por um caminhão; horizontal é comprar mais carros.
- **Como falar:** "Vertical tem limite físico e é ponto único de falha. Horizontal exige a aplicação ser *stateless*, mas escala quase sem teto e aumenta a disponibilidade."

### Load Balancer
- **Em uma frase:** componente que distribui requisições entre várias instâncias de um serviço.
- **Traduzindo:** o recepcionista que manda cada cliente pro atendente livre.
- **Como falar:** "Coloquei as réplicas atrás de um *load balancer* com *health check*, então uma instância com problema sai da rotação automaticamente."

### BFF (Backend for Frontend)
- **Em uma frase:** camada de backend dedicada a um front específico, que agrega e adapta dados de outros serviços.
- **Traduzindo:** um garçom que busca em várias cozinhas e monta o prato do jeito que aquele cliente gosta.
- **Como falar:** "O BFF isola o front da complexidade dos serviços internos, reduz o número de chamadas e protege segredos, como a chave do provider de IA."

### Monolito vs Microsserviços
- **Em uma frase:** monolito = uma aplicação única com todos os módulos; microsserviços = vários serviços pequenos, independentes, que se comunicam pela rede.
- **Traduzindo:** uma loja de departamento vs um shopping com várias lojas.
- **Como falar:** "Começaria com um *monolito modular*. Microsserviços trazem complexidade operacional: rede, observabilidade, consistência eventual. Só compensa quando os times e a escala pedem."

### Acoplamento e Coesão
- **Em uma frase:** acoplamento = o quanto um módulo depende de outro; coesão = o quanto as coisas dentro de um módulo têm a ver entre si.
- **Traduzindo:** queremos peças que fazem uma coisa só (alta coesão) e que dá pra trocar sem quebrar as outras (baixo acoplamento).
- **Como falar:** "Busquei baixo acoplamento e alta coesão separando o provider de IA da regra de negócio."

### SOLID
- **Em uma frase:** cinco princípios de design orientado a objetos pra código fácil de manter.
- **Traduzindo:**
  - **S** — Single Responsibility: cada classe tem um motivo pra mudar.
  - **O** — Open/Closed: aberto pra extensão, fechado pra modificação.
  - **L** — Liskov: uma subclasse tem que poder substituir a classe pai sem quebrar nada.
  - **I** — Interface Segregation: interfaces pequenas e específicas.
  - **D** — Dependency Inversion: dependa de abstrações, não de implementações.
- **Como falar:** "Apliquei inversão de dependência: o serviço depende de uma interface `AIProvider`, então troco OpenAI por Anthropic sem mexer na regra de negócio."

### Trade-off
- **Em uma frase:** escolha consciente em que você ganha algo e perde outra coisa.
- **Traduzindo:** não existe solução perfeita, só a mais adequada pro momento.
- **Como falar:** "O *trade-off* foi aceitar consistência eventual em troca de disponibilidade e desempenho."

---

## Mensageria e processamento assíncrono

### Fila (Queue) / Producer / Consumer / Worker
- **Em uma frase:** fila é uma estrutura que armazena tarefas; o *producer* coloca, o *consumer* (ou *worker*) tira e processa.
- **Traduzindo:** a comanda da lanchonete: o caixa anota (producer), a cozinha prepara (worker).
- **Como falar:** "A API só enfileira o job e responde 202; os workers consomem no ritmo deles, o que desacopla e absorve picos."

### Retry e Backoff exponencial
- **Em uma frase:** retry = tentar de novo após falha; backoff exponencial = aumentar o intervalo a cada tentativa (1s, 2s, 4s, 8s…).
- **Traduzindo:** se o amigo não atende, você não liga 100 vezes seguidas; espera cada vez mais.
- **Como falar:** "Retry com backoff exponencial e *jitter* pra falhas transitórias, sem sobrecarregar um serviço que já está degradado."
- **Cuidado:** retry sem idempotência pode duplicar efeitos (cobrar duas vezes, mandar dois e-mails).

### DLQ (Dead Letter Queue)
- **Em uma frase:** fila pra onde vão as mensagens que falharam além do limite de tentativas.
- **Traduzindo:** a caixa de "problemas pra olhar depois".
- **Como falar:** "Após N tentativas o job vai pra DLQ, gera alerta, e a gente analisa ou reprocessa manualmente."

### Garantias de entrega
- **Em uma frase:** *at-most-once* (pode perder, nunca duplica), *at-least-once* (nunca perde, pode duplicar), *exactly-once* (ideal, difícil na prática).
- **Traduzindo:** a maioria das filas entrega "pelo menos uma vez", então **você** tem que lidar com duplicata.
- **Como falar:** "Como a fila é *at-least-once*, tornei o consumer idempotente."

### Circuit Breaker
- **Em uma frase:** padrão que para de chamar um serviço que está falhando, por um tempo, pra evitar falha em cascata.
- **Traduzindo:** o disjuntor de casa: desarma pra não queimar tudo.
- **Como falar:** "Com o provider instável, o *circuit breaker* abre e a gente responde com *fallback* em vez de acumular timeouts."

---

## Banco de dados

### ACID
- **Em uma frase:** propriedades de transação: **A**tomicidade, **C**onsistência, **I**solamento, **D**urabilidade.
- **Traduzindo:** ou tudo acontece ou nada acontece, os dados ficam válidos, uma transação não enxerga a outra pela metade, e o que foi salvo não se perde.
- **Como falar:** "Envolvi o débito e o crédito na mesma transação pra garantir atomicidade."

### Índice
- **Em uma frase:** estrutura (geralmente B-Tree) que acelera buscas numa coluna, em troca de escrita mais lenta e mais espaço.
- **Traduzindo:** o índice remissivo do livro.
- **Como falar:** "Analisei com `EXPLAIN ANALYZE`, vi um *seq scan* e criei um índice composto na ordem dos filtros."

### Problema N+1
- **Em uma frase:** fazer 1 query pra buscar a lista e mais N queries (uma por item) pra buscar os relacionamentos.
- **Traduzindo:** ir ao mercado 50 vezes pra comprar 50 itens.
- **Como falar:** "Resolvi o N+1 com *join* / *eager loading* / *DataLoader*."

### Cache e TTL
- **Em uma frase:** guardar resultado de operação cara num armazenamento rápido; TTL é o tempo de vida desse dado.
- **Traduzindo:** anotar a resposta num post-it em vez de fazer a conta de novo.
- **Como falar:** "Usei *cache-aside* no Redis com TTL. O desafio é a *invalidação de cache*: garantir que o dado não fique velho."

---

## Observabilidade

### Logs, Métricas e Traces
- **Em uma frase:** os três pilares da observabilidade: logs = eventos; métricas = números agregados no tempo; traces = caminho de uma requisição entre serviços.
- **Traduzindo:** log é o diário, métrica é o gráfico, trace é o GPS da requisição.
- **Como falar:** "Com *tracing* distribuído eu vejo em qual serviço a requisição perdeu tempo."

### Latência, Throughput e p95/p99
- **Em uma frase:** latência = quanto tempo uma requisição leva; throughput = quantas requisições por segundo; p95 = 95% das requisições foram mais rápidas que esse valor.
- **Traduzindo:** a média esconde os casos ruins; o p99 mostra a experiência dos usuários mais azarados.
- **Como falar:** "A média estava boa, mas o p99 estava em 3s, então fui investigar a cauda."
