# PHP — perguntas, nível 3: Como você faria?

_Cenários reais: juntar vários conceitos e contar como resolveria._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Como o PHP executa: Zend Engine, FPM e OPcache](../aulas/01-execucao-e-runtime.md)

**1. Como investigaria uma API PHP lenta e decidiria entre FPM, OPcache e JIT?**
<sub>Aula [01 — Como o PHP executa: Zend Engine, FPM e OPcache](../aulas/01-execucao-e-runtime.md)</sub>
<details><summary>Ver resposta</summary>

Eu separaria tempo de PHP, banco e chamadas externas com métricas e tracing, e verificaria fila, memória e ocupação do FPM. Confirmaria OPcache e mediria CPU antes de considerar JIT; se o gargalo for SQL ou rede, atacaria isso primeiro. Compararia percentis e throughput após cada mudança.

</details>

### Aula 02 — [Sistema de tipos, coerção e recursos modernos](../aulas/02-tipos-e-tipagem.md)

**2. Como desenharia contratos tipados para entrada JSON e domínio?**
<sub>Aula [02 — Sistema de tipos, coerção e recursos modernos](../aulas/02-tipos-e-tipagem.md)</sub>
<details><summary>Ver resposta</summary>

Validaria formato e limites no limite HTTP e converteria os dados para DTOs com tipos e enums que representem estados válidos. Regras de negócio ficam no domínio; strict_types e análise estática ajudam entre camadas, mas não substituem validação e autorização.

</details>

### Aula 03 — [Orientação a objetos, traits e late static binding](../aulas/03-objetos-traits-e-metodos-magicos.md)

**3. Como modelaria dois provedores de pagamento sem duplicar regra de negócio?**
<sub>Aula [03 — Orientação a objetos, traits e late static binding](../aulas/03-objetos-traits-e-metodos-magicos.md)</sub>
<details><summary>Ver resposta</summary>

Definiria uma interface para operações de pagamento e adaptadores para cada provedor, injetados conforme configuração. Entidades não dependeriam de traits de um gateway concreto; erros seriam traduzidos para uma taxonomia comum com causa preservada. Testes cobririam o contrato e cada integração relevante.

</details>

### Aula 04 — [Funções, closures e generators](../aulas/04-funcoes-closures-e-generators.md)

**4. Como processaria um arquivo muito grande sem carregar tudo na memória?**
<sub>Aula [04 — Funções, closures e generators](../aulas/04-funcoes-closures-e-generators.md)</sub>
<details><summary>Ver resposta</summary>

Usaria stream e generator para ler linhas progressivamente, validando e persistindo lotes pequenos. Mediria limite de memória e falhas parciais e tornaria o processamento retomável por checkpoint. Um generator economiza memória, mas chamadas de rede síncronas ainda podem bloquear.

</details>

### Aula 05 — [Arrays, iteráveis e SPL](../aulas/05-arrays-e-spl.md)

**5. Como escolheria estrutura de dados para uma fila de tarefas em memória?**
<sub>Aula [05 — Arrays, iteráveis e SPL](../aulas/05-arrays-e-spl.md)</sub>
<details><summary>Ver resposta</summary>

Se preciso de FIFO explícito, SplQueue comunica essa regra; para prioridade, SplPriorityQueue; para volume moderado, array pode ser mais simples. Eu escolheria pela semântica e faria benchmark só se o perfil mostrar que a estrutura é gargalo. Persistência e concorrência exigiriam uma fila externa, não SPL.

</details>

### Aula 06 — [Erros, exceções e recuperação](../aulas/06-erros-e-excecoes.md)

**6. Como evitaria converter erro de banco em resposta 500 com detalhes sensíveis?**
<sub>Aula [06 — Erros, exceções e recuperação](../aulas/06-erros-e-excecoes.md)</sub>
<details><summary>Ver resposta</summary>

Deixaria o PDO lançar exceção, capturaria o tipo conhecido na camada de aplicação e converteria para conflito ou resposta apropriada sem expor SQL. O log teria correlation id e causa técnica sem credenciais. Erros inesperados seriam registrados e tratados centralmente como falhas internas.

</details>

### Aula 07 — [Composer, autoload e padrões PSR](../aulas/07-composer-autoload-psr.md)

**7. Como atualizaria dependências de uma aplicação PHP com baixo risco?**
<sub>Aula [07 — Composer, autoload e padrões PSR](../aulas/07-composer-autoload-psr.md)</sub>
<details><summary>Ver resposta</summary>

Criaria uma mudança de dependências revisável, rodaria Composer update apenas para o conjunto planejado e examinaria o diff do lockfile e advisories. Executaria análise estática e testes antes de promover o mesmo lock até produção. Plugins Composer e scripts também entrariam na revisão de cadeia de suprimentos.

</details>

### Aula 08 — [PHP na Web: requisição e segurança](../aulas/08-php-na-web-e-seguranca.md)

**8. Como protegeria um endpoint que recebe filtro de ordenação e texto de busca?**
<sub>Aula [08 — PHP na Web: requisição e segurança](../aulas/08-php-na-web-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Passaria o texto como valor de prepared statement e validaria limites e formato. O nome da coluna e direção viriam de uma allowlist codificada, nunca diretamente da requisição. Também verificaria autenticação, autorização, paginação, escape da saída e proteção contra abuso.

</details>

### Aula 09 — [Acesso a banco de dados com PDO](../aulas/09-banco-de-dados-com-pdo.md)

**9. Como evitaria cobrar duas vezes ao executar duas requisições concorrentes?**
<sub>Aula [09 — Acesso a banco de dados com PDO](../aulas/09-banco-de-dados-com-pdo.md)</sub>
<details><summary>Ver resposta</summary>

A operação teria chave de idempotência com constraint única e uma transação curta para registrar estado consistente. A chamada externa não ficaria dentro da transação; usaria outbox ou fluxo recuperável com estado pendente e reconciliação. Testaria concorrência e falha após cada etapa.

</details>

### Aula 10 — [Performance, testes e ecossistema PHP](../aulas/10-performance-testes-e-ecossistema.md)

**10. Como equilibraria testes de integração, análise estática e performance?**
<sub>Aula [10 — Performance, testes e ecossistema PHP](../aulas/10-performance-testes-e-ecossistema.md)</sub>
<details><summary>Ver resposta</summary>

Manteria testes unitários rápidos para regras puras e integração com banco real ou container nos contratos SQL críticos. PHPStan ou Psalm rodariam no CI para erros de tipo; profiler e tracing seriam usados para perfis reais de carga. Nenhuma ferramenta substitui as outras, e níveis crescentes precisam de política de exceção revisável.

</details>
