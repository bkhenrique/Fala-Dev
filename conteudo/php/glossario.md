# PHP — glossário

Cada termo tem três partes: **Em uma frase** (definição), **Traduzindo** (explicação simples) e **Como falar** (resposta curta para treinar).

É material de revisão: a explicação completa está nas [aulas](README.md).

---

### Zend Engine
- **Em uma frase:** máquina virtual que executa os opcodes produzidos a partir do código PHP.
- **Traduzindo:** o motor que transforma instruções PHP em trabalho executável.
- **Como falar:** "O Zend Engine executa opcodes; a SAPI conecta o runtime ao servidor ou terminal."

### PHP-FPM
- **Em uma frase:** gerenciador de processos FastCGI que mantém e controla workers PHP.
- **Traduzindo:** o conjunto de trabalhadores que executa scripts quando o servidor web encaminha pedidos.
- **Como falar:** "FPM atende cada requisição num worker; max_children limita concorrência e memória."

### OPcache
- **Em uma frase:** cache compartilhado que guarda bytecode compilado para reutilizar em execuções seguintes.
- **Traduzindo:** o PHP não precisa analisar o mesmo arquivo desde o começo em cada pedido.
- **Como falar:** "OPcache costuma ajudar aplicações web; ele não corrige consulta lenta nem espera de rede."

### JIT
- **Em uma frase:** compilação de trechos de opcode para instruções nativas da CPU.
- **Traduzindo:** um otimizador que pode acelerar alguns cálculos repetidos.
- **Como falar:** "Meço antes de ativar JIT, pois muitas APIs gastam mais tempo esperando I/O do que em CPU."

### Shared-nothing
- **Em uma frase:** modelo em que estado mutável de uma requisição não é automaticamente compartilhado com outra.
- **Traduzindo:** cada atendimento tem seu próprio espaço de trabalho.
- **Como falar:** "Estado que precisa sobreviver entre requests fica em cache, sessão ou banco compartilhado."

### strict_types
- **Em uma frase:** diretiva por arquivo que controla coerções de escalares em chamadas de função feitas a partir dele.
- **Traduzindo:** uma regra mais rigorosa para respeitar os tipos declarados.
- **Como falar:** "strict_types não valida entrada de usuário e precisa ser adotado de forma consistente."

### Type juggling
- **Em uma frase:** conversão implícita entre tipos feita em algumas operações PHP.
- **Traduzindo:** o PHP adapta o valor ao tipo que uma operação espera.
- **Como falar:** "Normalizo entrada e uso comparações estritas em decisões de segurança e domínio."

### Enum respaldado
- **Em uma frase:** enum cujos casos têm um valor escalar estável, como string ou inteiro.
- **Traduzindo:** um estado com nome seguro dentro do código e valor definido para persistência.
- **Como falar:** "Uso enum backed para evitar strings soltas, mantendo migração compatível quando o valor persistido muda."

### Trait
- **Em uma frase:** mecanismo de composição que insere métodos e propriedades numa classe sem criar subtipo.
- **Traduzindo:** um conjunto de comportamento reaproveitado por classes diferentes.
- **Como falar:** "Trait serve para comportamento pequeno compartilhado; abstração substituível pede interface e composição."

### Late static binding
- **Em uma frase:** resolução de `static::` pela classe concreta chamada em tempo de execução.
- **Traduzindo:** uma classe base pode respeitar qual filha iniciou a chamada.
- **Como falar:** "self aponta à classe onde o método foi definido; static usa a classe concreta chamada."

### Generator
- **Em uma frase:** iterador criado por função que pausa e produz valores com `yield`.
- **Traduzindo:** entrega um item de cada vez sem materializar toda a lista.
- **Como falar:** "Generator reduz memória em fluxos consumidos incrementalmente, mas não torna I/O bloqueante paralelo."

### SPL
- **Em uma frase:** biblioteca padrão do PHP com iteradores e estruturas de dados como fila, pilha e prioridade.
- **Traduzindo:** estruturas prontas com comportamento explícito.
- **Como falar:** "Escolho SplQueue quando FIFO comunica melhor a regra, e meço se performance for requisito."

### Composer
- **Em uma frase:** gerenciador de dependências e autoload do ecossistema PHP.
- **Traduzindo:** instala bibliotecas e encontra classes sem includes manuais.
- **Como falar:** "Composer install reproduz o lockfile; update resolve versões novas e merece revisão."

### PSR-4
- **Em uma frase:** padrão que mapeia prefixos de namespace a diretórios para autoload de classes.
- **Traduzindo:** o nome da classe indica em que pasta o Composer a procura.
- **Como falar:** "PSR-4 ajuda bibliotecas diferentes a carregar classes com a mesma convenção."

### PDO
- **Em uma frase:** interface PHP comum para acessar bancos por drivers.
- **Traduzindo:** uma API de conexão e consulta que ainda usa o SQL do banco escolhido.
- **Como falar:** "PDO prepared statements separam valores do SQL; identificadores dinâmicos vêm de allowlist."

### Prepared statement
- **Em uma frase:** consulta cujo texto e valores são enviados separadamente ao driver.
- **Traduzindo:** o banco recebe o molde SQL e cada valor em seu próprio campo.
- **Como falar:** "Prepared statements protegem valores contra injection, não nomes de coluna fornecidos pelo usuário."

### PHPUnit e Pest
- **Em uma frase:** ferramentas do ecossistema para escrever e executar testes PHP.
- **Traduzindo:** formas diferentes de organizar cenários e verificar comportamento.
- **Como falar:** "Mocks verificam colaborações; testes de integração ainda precisam exercitar infraestrutura real."

### PHPStan e Psalm
- **Em uma frase:** analisadores estáticos que inferem tipos e identificam inconsistências sem executar todos os caminhos.
- **Traduzindo:** revisores automáticos que procuram erros prováveis no código.
- **Como falar:** "Análise estática complementa testes, mas não comprova comportamento de rede ou banco."
