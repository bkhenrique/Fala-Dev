# Spring — glossário

Cada termo tem três partes: **Em uma frase** (a definição curta), **Traduzindo** (a explicação simples) e **Como falar** (uma frase pronta pra treinar em voz alta). Alguns trazem também **Não confundir com** ou **Cuidado**.

É material de revisão: a explicação completa está nas [aulas](README.md).

---

### Spring vs Spring Boot
- **Em uma frase:** Spring é o framework (IoC, MVC, Data…); Spring Boot é a camada que dá autoconfiguração, *starters* e servidor embutido.
- **Traduzindo:** Spring são as peças; Boot é o kit já montado.
- **Como falar:** "Spring Boot usa *convention over configuration*: com um starter eu já tenho tudo configurado."

### Bean e IoC Container
- **Em uma frase:** Bean é um objeto gerenciado pelo container do Spring (`ApplicationContext`), que cria e injeta as dependências.
- **Traduzindo:** mesma ideia do provider no Nest.
- **Como falar:** "Prefiro injeção por construtor em vez de `@Autowired` em campo: deixa a dependência explícita, imutável e fácil de testar."

### JPA / Hibernate
- **Em uma frase:** JPA é a especificação de ORM do Java; Hibernate é a implementação mais usada.
- **Traduzindo:** mapear classe ↔ tabela sem escrever SQL na mão.
- **Como falar:** "Cuido do N+1 com `JOIN FETCH` ou `@EntityGraph`, e uso `LAZY` por padrão nos relacionamentos."

### @Transactional
- **Em uma frase:** anotação que faz o método rodar dentro de uma transação, com commit no sucesso e rollback em exceção unchecked.
- **Traduzindo:** tudo ou nada, de forma declarativa.
- **Como falar:** "Pegadinha: `@Transactional` funciona via *proxy*, então chamar o método de dentro da própria classe (*self-invocation*) não abre transação."

### SecurityFilterChain
- **Em uma frase:** a cadeia ordenada de filtros do Spring Security que roda antes do `DispatcherServlet` e cuida de CORS, CSRF, autenticação e autorização.
- **Traduzindo:** a fila de seguranças na porta: cada um confere uma coisa antes de deixar a requisição chegar no controller.
- **Como falar:** "Configuro a segurança como um bean SecurityFilterChain, com regras de URL em ordem e anyRequest().authenticated() no fim, pra negar por padrão."

### @PreAuthorize
- **Em uma frase:** anotação de segurança por método que avalia uma expressão (SpEL) antes de executar, podendo usar os parâmetros.
- **Traduzindo:** a regra de permissão colada no próprio método.
- **Como falar:** "Uso @PreAuthorize pras regras finas, lembrando que é proxy: chamada interna na mesma classe não passa pela checagem."
- **Cuidado:** `hasRole('X')` procura a authority `ROLE_X`; `hasAuthority('X')` procura `X`.

### @TransactionalEventListener
- **Em uma frase:** listener de evento que executa numa fase da transação de quem publicou, por padrão depois do commit.
- **Traduzindo:** "só avisa os outros se deu certo mesmo".
- **Como falar:** "Uso @TransactionalEventListener em AFTER_COMMIT pra não disparar efeito colateral de algo que deu rollback; se não pode se perder numa queda, vai pro outbox."

### @KafkaListener
- **Em uma frase:** anotação do Spring for Apache Kafka que transforma um método em consumidor de um tópico, dentro de um consumer group.
- **Traduzindo:** o método que é chamado pra cada mensagem que chega no tópico.
- **Como falar:** "No consumidor configuro retry com backoff, DLT pras mensagens que esgotam as tentativas, e processamento idempotente, porque a entrega é at-least-once."

### Actuator
- **Em uma frase:** módulo do Spring Boot que expõe endpoints de operação: health, liveness, readiness, métricas e informações do build.
- **Traduzindo:** o painel de instrumentos da aplicação, que o Kubernetes e o Prometheus consultam.
- **Como falar:** "Exponho só health, info e prometheus; o resto fica fechado ou numa porta de gerenciamento separada."

### Resilience4j
- **Em uma frase:** biblioteca de resiliência com circuit breaker, retry, rate limiter, bulkhead e time limiter, integrada ao Spring.
- **Traduzindo:** os disjuntores e amortecedores das chamadas pra serviços externos.
- **Como falar:** "Toda chamada externa tem timeout, e as críticas têm circuit breaker com fallback e retry só quando a operação é idempotente."


### Test slice
- **Em uma frase:** teste que carrega apenas uma fatia configurada do contexto, como a camada MVC.
- **Traduzindo:** uma montagem parcial do Spring para testar uma camada.
- **Como falar:** "Uso @WebMvcTest para controller e deixo o contexto completo para integrações que realmente dependem dele."

### Testcontainers
- **Em uma frase:** biblioteca que inicia serviços reais em containers descartáveis para testes.
- **Traduzindo:** banco ou broker de verdade, isolado para o teste.
- **Como falar:** "Uso Testcontainers quando diferenças entre o banco de teste e o de produção podem esconder defeitos."

### Spring Cloud Gateway
- **Em uma frase:** gateway de API com roteamento e filtros para aplicações distribuídas.
- **Traduzindo:** a recepção que encaminha chamadas e aplica políticas comuns.
- **Como falar:** "O gateway cuida da borda; as regras de domínio permanecem nos serviços."

### Service discovery
- **Em uma frase:** resolução dinâmica do endereço de instâncias de um serviço por um nome lógico.
- **Traduzindo:** procurar uma unidade disponível pelo nome, em vez de decorar seu IP.
- **Como falar:** "Em Kubernetes, DNS e Services podem resolver descoberta sem introduzir um registry à parte."

### Circuit breaker
- **Em uma frase:** mecanismo que interrompe chamadas a uma dependência com falhas persistentes e testa depois se ela voltou.
- **Traduzindo:** um disjuntor que evita sobrecarregar um serviço já indisponível.
- **Como falar:** "Combino circuit breaker com timeout e bulkhead; retry só quando é seguro repetir."
