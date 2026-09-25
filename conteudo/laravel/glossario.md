# Laravel — glossário

Cada termo tem três partes: **Em uma frase** (definição), **Traduzindo** (explicação simples) e **Como falar** (resposta curta para treinar).

É material de revisão: a explicação completa está nas [aulas](README.md).

---

### Ciclo de vida da requisição
- **Em uma frase:** sequência de bootstrap, middleware, roteamento, execução da ação e envio da resposta.
- **Traduzindo:** o caminho completo entre o pedido HTTP e o que o servidor devolve.
- **Como falar:** "Entender a ordem entre providers, middleware e router ajuda a localizar onde uma requisição mudou."

### Service Container
- **Em uma frase:** componente que resolve e injeta dependências de classes Laravel.
- **Traduzindo:** a fábrica que conecta cada classe aos colaboradores de que precisa.
- **Como falar:** "Faço binding de interface quando há implementação variável ou infraestrutura substituível."

### Service Provider
- **Em uma frase:** classe que registra e inicializa serviços durante o bootstrap da aplicação.
- **Traduzindo:** o lugar onde o framework prepara componentes antes de atender pedidos.
- **Como falar:** "register configura bindings; boot executa inicialização que depende dos serviços registrados."

### Facade
- **Em uma frase:** proxy com sintaxe estática para um serviço resolvido pelo container.
- **Traduzindo:** um atalho expressivo para uma instância que continua substituível.
- **Como falar:** "Facade não é método estático comum; uso-a sem deixar classes crescerem em responsabilidades."

### Middleware
- **Em uma frase:** camada que inspeciona ou altera requisições antes e depois da rota.
- **Traduzindo:** filtros em volta do atendimento HTTP.
- **Como falar:** "Autenticação, CSRF e rate limit entram na cadeia; policy decide permissão sobre o recurso."

### Form Request
- **Em uma frase:** classe que centraliza autorização e validação de um tipo de entrada.
- **Traduzindo:** o contrato validado antes de a regra principal receber os dados.
- **Como falar:** "Valido no servidor e uso os campos validados, sem confiar em dados que o cliente ocultou."

### API Resource
- **Em uma frase:** transformador que define a representação pública de um model ou coleção.
- **Traduzindo:** a camada que escolhe o que o cliente pode ver e em qual formato.
- **Como falar:** "Resource evita expor colunas internas e deve serializar relações já carregadas com intenção."

### Eloquent
- **Em uma frase:** ORM Active Record do Laravel para consultar e persistir modelos relacionados.
- **Traduzindo:** cada model representa um tipo de registro e oferece operações de banco.
- **Como falar:** "Eloquent acelera consultas comuns, mas ainda preciso entender SQL e o esquema."

### N+1 e eager loading
- **Em uma frase:** N+1 é uma consulta por item de uma coleção; eager loading carrega relações em lote.
- **Traduzindo:** evitar voltar ao banco repetidamente por cada linha de uma lista.
- **Como falar:** "Uso with para as relações necessárias e verifico consultas, tamanho e plano do banco."

### Mass assignment
- **Em uma frase:** atribuição de vários atributos a partir de um array, controlada por fillable ou guarded.
- **Traduzindo:** preencher o model com campos de uma vez.
- **Como falar:** "Mass assignment usa allowlist e não substitui validação nem autorização."

### Migration
- **Em uma frase:** mudança versionada do esquema de banco executada em ordem.
- **Traduzindo:** histórico reproduzível das alterações que a aplicação espera.
- **Como falar:** "Para deploy gradual, uso expand-and-contract em vez de remover coluna que a versão antiga ainda lê."

### Transaction
- **Em uma frase:** unidade atômica de operações no banco, confirmada em conjunto ou revertida.
- **Traduzindo:** tudo no banco acontece ou nada acontece.
- **Como falar:** "E-mail e broker não participam da transação SQL; uso after-commit ou outbox conforme a garantia."

### Sanctum
- **Em uma frase:** pacote de autenticação Laravel para SPAs first-party e tokens simples de API.
- **Traduzindo:** ferramentas de sessão e token para clientes próprios.
- **Como falar:** "Escolho Sanctum para SPA e token simples; Passport atende requisitos OAuth2 completos."

### Policy e Gate
- **Em uma frase:** mecanismos de autorização para decidir se usuário pode executar ação ou acessar recurso.
- **Traduzindo:** regras de permissão centralizadas no servidor.
- **Como falar:** "Login prova identidade; policy verifica se aquele usuário pode alterar aquele pedido."

### Queue Job
- **Em uma frase:** trabalho serializável executado posteriormente por worker de fila.
- **Traduzindo:** tarefa colocada para outro processo terminar depois da resposta.
- **Como falar:** "Jobs podem repetir, então operações externas precisam de idempotência e retry limitado."

### Horizon
- **Em uma frase:** dashboard e configuração de workers para filas Laravel baseadas em Redis.
- **Traduzindo:** painel para ver volume, duração e falhas dos jobs.
- **Como falar:** "Horizon monitora o worker, mas escalar exige respeitar a capacidade do banco e dos serviços externos."

### Cache-aside
- **Em uma frase:** padrão que lê cache primeiro e consulta a origem quando a chave não existe.
- **Traduzindo:** guardar uma cópia temporária e buscar o dado verdadeiro quando necessário.
- **Como falar:** "TTL não resolve sozinho invalidação nem garante que a chave não misture tenants."

### RefreshDatabase
- **Em uma frase:** trait Laravel para preparar e isolar o banco durante testes.
- **Traduzindo:** cada conjunto de cenários começa com um estado conhecido.
- **Como falar:** "Banco rápido em memória não substitui teste com o motor de produção quando SQL e locks importam."

### Laravel Octane
- **Em uma frase:** modo de servir aplicações com workers persistentes em runtimes compatíveis.
- **Traduzindo:** manter o processo aquecido entre pedidos para reduzir parte da inicialização.
- **Como falar:** "Octane pode reduzir overhead, mas preciso impedir que estado de uma requisição sobreviva para outra."

### Expand and contract
- **Em uma frase:** estratégia de mudança de esquema em etapas compatíveis com versões antigas e novas.
- **Traduzindo:** primeiro adicionar o formato novo, migrar, e só depois remover o antigo.
- **Como falar:** "Uso expand-and-contract para rolling deploy com instâncias de versões diferentes."
