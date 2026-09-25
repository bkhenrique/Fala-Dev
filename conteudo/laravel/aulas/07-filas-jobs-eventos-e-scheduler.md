# Aula 07 — Filas, Jobs, eventos e Scheduler

> **Objetivo:** explicar como Laravel desloca trabalho para filas, quando usar eventos e como tarefas agendadas são executadas com segurança.

---

## 1. O problema

Enviar e-mail, gerar relatório ou sincronizar arquivo pode demorar mais que a resposta HTTP deveria esperar. Se uma requisição síncrona fizer todo o trabalho, o usuário aguarda e uma falha externa pode consumir o tempo de conexão.

Uma **fila** permite gravar uma mensagem de trabalho e responder antes de executá-la. Isso separa latência do usuário de duração da tarefa, mas cria consistência eventual e exige um worker ativo.

## 2. Job e worker

Um **Job** representa trabalho serializável que pode ser despachado. Um **worker** busca jobs e os executa fora da requisição web. Conexões como Redis e database têm propriedades diferentes de throughput, operação e durabilidade.

Dados serializados no job podem ficar desatualizados entre despacho e execução. Quando necessário, passe um identificador e recarregue estado; decida o que deve acontecer se o registro foi removido ou mudou.

## 3. Retry, backoff e idempotência

Falhas transitórias podem ser tentadas novamente com limite e backoff. Jobs podem ser executados mais de uma vez por timeout, falha entre execução e acknowledgement ou retry. Portanto, efeitos precisam ser **idempotentes**: executar de novo produz o mesmo resultado lógico.

Uma chave de idempotência, constraint única ou registro de operação concluída evita cobrar duas vezes ou enviar o mesmo efeito. Jobs que esgotam tentativas vão para failed jobs, onde precisam de alerta, inspeção e política de reprocessamento.

## 4. Tempo limite e reserva de jobs

Timeout do job, timeout do worker e visibilidade/reserva do driver precisam combinar. Se a reserva expira antes do job acabar, outro worker pode executar a mesma mensagem enquanto a primeira ainda está ativa.

Mantenha cada job focado, limite tentativas e não armazene objetos enormes. Métricas importantes incluem profundidade da fila, idade do job mais antigo, duração, falhas e tempo até conclusão.

## 5. Jobs após commit e transactional outbox

Se uma transação grava um pedido e despacha um job antes de commit, o worker pode consultar um registro que ainda não existe. Laravel oferece dispatch após commit para preservar a ordem dentro do fluxo transacional.

Ainda existe uma falha possível entre commit do banco e publicação no broker. Para uma garantia mais forte, use outbox transacional: a aplicação grava pedido e evento na mesma transação; um publisher lê a outbox e publica de forma recuperável.

## 6. Eventos e listeners

Eventos descrevem algo que aconteceu, como `PedidoPago`. Listeners reagem para enviar e-mail, atualizar projeção ou avisar outro sistema. Isso reduz dependência direta entre quem produz e quem reage.

Evento interno não é automaticamente uma fila durável nem substitui transação. Se o listener roda síncrono, ainda afeta a requisição; se enfileirado, deve aceitar execução duplicada e eventual. Não crie eventos sem consumidores ou sem significado de domínio.

## 7. Scheduler

Laravel Scheduler permite declarar a frequência de comandos ou jobs num único agendador. Em produção, uma entrada cron chama o scheduler periodicamente; o framework decide qual tarefa venceu.

Em múltiplos servidores, tarefas podem disparar em cada nó. Use as opções de execução em um único servidor ou sem sobreposição quando apropriado, e garanta locks compartilhados. A tarefa deve continuar idempotente porque um scheduler pode ser interrompido ou repetir uma execução.

## 8. Horizon

**Horizon** fornece dashboard e configuração de workers para filas Redis do Laravel: throughput, duração e falhas. Não é fila em si e exige Redis. O dashboard deve ser protegido e o número de supervisores dimensionado para CPU, memória e serviço dependente.

Aumentar workers pode aumentar a concorrência no banco ou API externa; isso pode piorar a capacidade total. Escale com métricas da fila e limite de vazão do downstream.

## 9. Como falar na entrevista

**“Como processaria uma cobrança sem segurar a requisição e sem cobrar duas vezes?”**

> “A API valida o pedido e registra uma operação com chave de idempotência. Se o fluxo permitir, despacho o job depois do commit; para não perder publicação entre banco e broker, posso gravar uma outbox. O job usa timeout, retry limitado com backoff e consulta a chave antes de aplicar de novo. Monitoro fila e falhas e protejo qualquer reprocessamento.”

## 10. Resumo

- Job em fila tira trabalho da requisição, mas traz consistência eventual e workers operacionais.
- Retry exige idempotência; timeouts e reserva devem ser compatíveis.
- Dispatch after commit resolve visibilidade; outbox trata garantia de publicação.
- Eventos desacoplam reações, mas só são assíncronos se seus listeners forem.
- Scheduler distribuído requer locks e tarefas idempotentes; Horizon monitora workers Redis.

## Termos desta aula
Queue · Job · Worker · retry · backoff · idempotência · failed job · transactional outbox · event · listener · Scheduler · Horizon

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 07** e separadas por nível.

### Para aprofundar
[Queues](https://laravel.com/framework/docs/13.x/queues) · [Task Scheduling](https://laravel.com/framework/docs/13.x/scheduling) · [Horizon](https://laravel.com/framework/docs/13.x/horizon)
