# PHP — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os trade-offs._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Como o PHP executa: Zend Engine, FPM e OPcache](../aulas/01-execucao-e-runtime.md)

**1. OPcache ou JIT: resolvem o mesmo problema?**
<sub>Aula [01 — Como o PHP executa: Zend Engine, FPM e OPcache](../aulas/01-execucao-e-runtime.md)</sub>
<details><summary>Ver resposta</summary>

Não. OPcache reutiliza bytecode compilado e costuma reduzir trabalho repetido de inicialização; JIT compila certos trechos para código nativo. Uma API limitada por banco ou rede tende a ganhar pouco com JIT.

</details>

**2. Por que shared-nothing simplifica aplicações PHP?**
<sub>Aula [01 — Como o PHP executa: Zend Engine, FPM e OPcache](../aulas/01-execucao-e-runtime.md)</sub>
<details><summary>Ver resposta</summary>

Cada requisição normalmente trabalha em estado isolado, então não depende de uma cópia mutável compartilhada com outras. Estado durável ou entre instâncias vai para banco, sessão ou cache; isso acrescenta uma dependência externa.

</details>

### Aula 02 — [Sistema de tipos, coerção e recursos modernos](../aulas/02-tipos-e-tipagem.md)

**3. strict_types torna o PHP estaticamente tipado?**
<sub>Aula [02 — Sistema de tipos, coerção e recursos modernos](../aulas/02-tipos-e-tipagem.md)</sub>
<details><summary>Ver resposta</summary>

Não. strict_types controla coerções escalares em chamadas feitas a partir daquele arquivo, enquanto variáveis ainda podem receber tipos diferentes em runtime. Validação de entrada e análise estática continuam sendo responsabilidades distintas.

</details>

**4. Quando usar union type e quando evitar mixed?**
<sub>Aula [02 — Sistema de tipos, coerção e recursos modernos](../aulas/02-tipos-e-tipagem.md)</sub>
<details><summary>Ver resposta</summary>

Union type expressa um conjunto finito de valores válidos e permite que o motor ajude quem chama. mixed é honesto quando a entrada realmente é irrestrita, mas espalhado pelo domínio adia verificações e enfraquece contratos.

</details>

### Aula 03 — [Orientação a objetos, traits e late static binding](../aulas/03-objetos-traits-e-metodos-magicos.md)

**5. Trait ou interface com composição?**
<sub>Aula [03 — Orientação a objetos, traits e late static binding](../aulas/03-objetos-traits-e-metodos-magicos.md)</sub>
<details><summary>Ver resposta</summary>

Trait reutiliza implementação dentro de classes sem criar subtipagem; interface define um contrato para implementações substituíveis. Se comportamento precisa de dependências ou alternativas, interface e composição tendem a ser mais claras.

</details>

**6. Quando late static binding ajuda e quando uma fábrica injetada é melhor?**
<sub>Aula [03 — Orientação a objetos, traits e late static binding](../aulas/03-objetos-traits-e-metodos-magicos.md)</sub>
<details><summary>Ver resposta</summary>

static:: ajuda uma hierarquia que permite que subclasses preservem seu tipo concreto, por exemplo numa factory de classe base. Se escolha depende de configuração ou precisa ser substituída em teste, um serviço de fábrica injetado evita estado global estático.

</details>

### Aula 04 — [Funções, closures e generators](../aulas/04-funcoes-closures-e-generators.md)

**7. Por valor ou por referência ao capturar variável numa closure?**
<sub>Aula [04 — Funções, closures e generators](../aulas/04-funcoes-closures-e-generators.md)</sub>
<details><summary>Ver resposta</summary>

Captura por valor usa a cópia lógica existente quando a closure é criada; captura por referência compartilha a variável mutável. A referência pode ser necessária, mas cria efeitos temporais e torna o comportamento menos fácil de raciocinar.

</details>

**8. Quando generator é melhor que retornar array?**
<sub>Aula [04 — Funções, closures e generators](../aulas/04-funcoes-closures-e-generators.md)</sub>
<details><summary>Ver resposta</summary>

Quando produtor e consumidor podem trabalhar item a item e o conjunto é grande, o generator reduz memória retida. Se o consumidor materializa tudo, o ganho desaparece; yield também não transforma I/O bloqueante em concorrência.

</details>

### Aula 05 — [Arrays, iteráveis e SPL](../aulas/05-arrays-e-spl.md)

**9. isset ou array_key_exists para verificar uma chave?**
<sub>Aula [05 — Arrays, iteráveis e SPL](../aulas/05-arrays-e-spl.md)</sub>
<details><summary>Ver resposta</summary>

isset retorna false quando a chave não existe ou tem valor null; array_key_exists distingue os casos. A escolha depende se null é um valor válido do contrato.

</details>

**10. Por que array_filter pode criar um problema ao serializar JSON?**
<sub>Aula [05 — Arrays, iteráveis e SPL](../aulas/05-arrays-e-spl.md)</sub>
<details><summary>Ver resposta</summary>

Ele preserva as chaves originais por padrão; após remover itens podem sobrar índices esparsos. O PHP pode serializar esse array como objeto JSON em vez de lista, então array_values reindexa quando a API exige uma sequência.

</details>

### Aula 06 — [Erros, exceções e recuperação](../aulas/06-erros-e-excecoes.md)

**11. Quando capturar uma exceção e quando deixá-la subir?**
<sub>Aula [06 — Erros, exceções e recuperação](../aulas/06-erros-e-excecoes.md)</sub>
<details><summary>Ver resposta</summary>

Capture quando consegue recuperar, traduzir para uma resposta ou acrescentar contexto útil. Se não há ação, propague preservando a causa; um catch amplo que esconde falhas dificulta diagnóstico.

</details>

**12. Qual falha é adequada para retry?**
<sub>Aula [06 — Erros, exceções e recuperação](../aulas/06-erros-e-excecoes.md)</sub>
<details><summary>Ver resposta</summary>

Uma falha transitória numa operação que é segura de repetir pode justificar retry limitado com backoff. Erro de validação ou bug determinístico não melhora com repetição e retry sem limite aumenta a carga.

</details>

### Aula 07 — [Composer, autoload e padrões PSR](../aulas/07-composer-autoload-psr.md)

**13. Qual a diferença prática entre composer install e composer update?**
<sub>Aula [07 — Composer, autoload e padrões PSR](../aulas/07-composer-autoload-psr.md)</sub>
<details><summary>Ver resposta</summary>

install usa versões do lockfile e é apropriado para CI e deploy reprodutíveis. update resolve novamente dentro das restrições e altera o lockfile, devendo ser uma mudança revisada.

</details>

**14. Quando PSR-4 melhora interoperabilidade?**
<sub>Aula [07 — Composer, autoload e padrões PSR](../aulas/07-composer-autoload-psr.md)</sub>
<details><summary>Ver resposta</summary>

Quando vários pacotes seguem a mesma relação de namespace e diretório, o Composer encontra classes sem includes específicos por projeto. O custo é respeitar a convenção, capitalização e mapeamentos configurados.

</details>

### Aula 08 — [PHP na Web: requisição e segurança](../aulas/08-php-na-web-e-seguranca.md)

**15. Prepared statement substitui validação e allowlist?**
<sub>Aula [08 — PHP na Web: requisição e segurança](../aulas/08-php-na-web-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Não. Ele separa valores do SQL, mas não valida regra de negócio e não parametriza nomes de coluna ou direção de ordenação. Valide a entrada e escolha identificadores dinâmicos numa lista permitida.

</details>

**16. SameSite substitui token CSRF?**
<sub>Aula [08 — PHP na Web: requisição e segurança](../aulas/08-php-na-web-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Não em todos os fluxos. SameSite reduz envio de cookies em contextos cross-site, enquanto token valida que uma ação veio do fluxo legítimo; política depende de navegação, integração e compatibilidade do cliente.

</details>

### Aula 09 — [Acesso a banco de dados com PDO](../aulas/09-banco-de-dados-com-pdo.md)

**17. PDO é ORM e garante portabilidade de SQL?**
<sub>Aula [09 — Acesso a banco de dados com PDO](../aulas/09-banco-de-dados-com-pdo.md)</sub>
<details><summary>Ver resposta</summary>

Não. PDO unifica uma interface de acesso e conexão por driver, mas SQL, tipos e recursos seguem as diferenças do banco. Um ORM adiciona mapeamento de objetos e relações numa camada separada.

</details>

**18. Quando usar transação e por que não chamar API dentro dela?**
<sub>Aula [09 — Acesso a banco de dados com PDO](../aulas/09-banco-de-dados-com-pdo.md)</sub>
<details><summary>Ver resposta</summary>

Use transação para manter mudanças do banco atomicamente consistentes. Serviço HTTP externo não participa do commit e pode ficar lento ou concluir mesmo que o banco faça rollback, então coordene fora da transação.

</details>

### Aula 10 — [Performance, testes e ecossistema PHP](../aulas/10-performance-testes-e-ecossistema.md)

**19. Quando aumentar pm.max_children pode piorar a API?**
<sub>Aula [10 — Performance, testes e ecossistema PHP](../aulas/10-performance-testes-e-ecossistema.md)</sub>
<details><summary>Ver resposta</summary>

Se os workers extras excedem memória, o servidor pode usar swap ou competir por CPU e conexões do banco. O ajuste deve usar memória medida por worker, fila e limites dos downstreams.

</details>

**20. Quando considerar runtime persistente em vez de PHP-FPM?**
<sub>Aula [10 — Performance, testes e ecossistema PHP](../aulas/10-performance-testes-e-ecossistema.md)</sub>
<details><summary>Ver resposta</summary>

Se medições mostram custo de bootstrap relevante ou o produto exige outro modelo de concorrência, pode valer avaliar Swoole, RoadRunner ou FrankenPHP. Exige revisar estado que sobrevive entre requests e compatibilidade das dependências.

</details>
