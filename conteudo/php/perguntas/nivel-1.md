# PHP — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Como o PHP executa: Zend Engine, FPM e OPcache](../aulas/01-execucao-e-runtime.md)

**1. O que é a Zend Engine?**
<sub>Aula [01 — Como o PHP executa: Zend Engine, FPM e OPcache](../aulas/01-execucao-e-runtime.md)</sub>
<details><summary>Ver resposta</summary>

É a máquina virtual que executa os opcodes gerados a partir do código PHP. Ela participa da execução de instruções e do gerenciamento dos valores em runtime.

</details>

**2. O que o PHP-FPM faz?**
<sub>Aula [01 — Como o PHP executa: Zend Engine, FPM e OPcache](../aulas/01-execucao-e-runtime.md)</sub>
<details><summary>Ver resposta</summary>

É um gerenciador de processos FastCGI que mantém workers para executar scripts PHP. O servidor web recebe HTTP e encaminha a requisição ao FPM.

</details>

### Aula 02 — [Sistema de tipos, coerção e recursos modernos](../aulas/02-tipos-e-tipagem.md)

**3. O que significa type juggling?**
<sub>Aula [02 — Sistema de tipos, coerção e recursos modernos](../aulas/02-tipos-e-tipagem.md)</sub>
<details><summary>Ver resposta</summary>

É a conversão implícita que o PHP pode fazer entre tipos durante uma operação. Pode ser conveniente, mas deve ser evitada como base de validação ou decisão de segurança.

</details>

**4. O que um enum backed representa?**
<sub>Aula [02 — Sistema de tipos, coerção e recursos modernos](../aulas/02-tipos-e-tipagem.md)</sub>
<details><summary>Ver resposta</summary>

É um enum cujos casos têm valores escalares, como string ou inteiro. O código pode usar o caso nomeado e persistir seu valor definido.

</details>

### Aula 03 — [Orientação a objetos, traits e late static binding](../aulas/03-objetos-traits-e-metodos-magicos.md)

**5. O que é uma trait?**
<sub>Aula [03 — Orientação a objetos, traits e late static binding](../aulas/03-objetos-traits-e-metodos-magicos.md)</sub>
<details><summary>Ver resposta</summary>

É um mecanismo para reutilizar métodos e propriedades em classes sem estabelecer uma relação de herança entre elas. É adequada para comportamento pequeno e coeso.

</details>

**6. Qual a diferença entre self e static em chamada estática?**
<sub>Aula [03 — Orientação a objetos, traits e late static binding](../aulas/03-objetos-traits-e-metodos-magicos.md)</sub>
<details><summary>Ver resposta</summary>

self aponta para a classe onde o método foi definido. static usa late static binding e representa a classe concreta que iniciou a chamada.

</details>

### Aula 04 — [Funções, closures e generators](../aulas/04-funcoes-closures-e-generators.md)

**7. O que é uma closure?**
<sub>Aula [04 — Funções, closures e generators](../aulas/04-funcoes-closures-e-generators.md)</sub>
<details><summary>Ver resposta</summary>

É uma função que pode ser tratada como valor e capturar variáveis do escopo externo. Pode ser passada como callback ou estratégia para outra função.

</details>

**8. O que um Generator faz com yield?**
<sub>Aula [04 — Funções, closures e generators](../aulas/04-funcoes-closures-e-generators.md)</sub>
<details><summary>Ver resposta</summary>

Uma função generator pausa em yield e entrega um valor ao consumidor; depois continua quando o iterador avança. Isso permite percorrer um fluxo sem criar todo o array de uma vez.

</details>

### Aula 05 — [Arrays, iteráveis e SPL](../aulas/05-arrays-e-spl.md)

**9. O que é um array PHP?**
<sub>Aula [05 — Arrays, iteráveis e SPL](../aulas/05-arrays-e-spl.md)</sub>
<details><summary>Ver resposta</summary>

É um mapa ordenado de chaves e valores, com chaves inteiras ou strings. Pode atuar como lista, mapa associativo ou estrutura mista.

</details>

**10. O que significa iterable numa assinatura?**
<sub>Aula [05 — Arrays, iteráveis e SPL](../aulas/05-arrays-e-spl.md)</sub>
<details><summary>Ver resposta</summary>

É um tipo que aceita array ou objeto Traversable. Descreve que o valor pode ser percorrido, sem afirmar que tudo já está carregado em memória.

</details>

### Aula 06 — [Erros, exceções e recuperação](../aulas/06-erros-e-excecoes.md)

**11. Qual a relação entre Throwable, Exception e Error?**
<sub>Aula [06 — Erros, exceções e recuperação](../aulas/06-erros-e-excecoes.md)</sub>
<details><summary>Ver resposta</summary>

Throwable é a interface comum para objetos lançáveis e capturáveis. Exception e Error são ramos diferentes; Error costuma sinalizar problema de execução ou programação.

</details>

**12. O que faz finally?**
<sub>Aula [06 — Erros, exceções e recuperação](../aulas/06-erros-e-excecoes.md)</sub>
<details><summary>Ver resposta</summary>

O bloco finally executa após try e catch para permitir limpeza mesmo se houver retorno ou exceção. Um return dentro dele pode suprimir a exceção ou substituir outro retorno.

</details>

### Aula 07 — [Composer, autoload e padrões PSR](../aulas/07-composer-autoload-psr.md)

**13. Qual a função do Composer?**
<sub>Aula [07 — Composer, autoload e padrões PSR](../aulas/07-composer-autoload-psr.md)</sub>
<details><summary>Ver resposta</summary>

Composer gerencia dependências PHP e gera o autoloader usado para encontrar classes. Também aplica restrições de versão e scripts declarados pelo projeto.

</details>

**14. Para que serve o composer.lock?**
<sub>Aula [07 — Composer, autoload e padrões PSR](../aulas/07-composer-autoload-psr.md)</sub>
<details><summary>Ver resposta</summary>

Registra as versões exatas resolvidas, inclusive dependências transitivas. Permite que install em equipe e CI reproduza a mesma árvore de pacotes.

</details>

### Aula 08 — [PHP na Web: requisição e segurança](../aulas/08-php-na-web-e-seguranca.md)

**15. O que é XSS?**
<sub>Aula [08 — PHP na Web: requisição e segurança](../aulas/08-php-na-web-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

É a execução de script não confiável no navegador por conteúdo inserido numa página. Escape contextual da saída e templates seguros reduzem esse risco.

</details>

**16. Para que serve password_hash?**
<sub>Aula [08 — PHP na Web: requisição e segurança](../aulas/08-php-na-web-e-seguranca.md)</sub>
<details><summary>Ver resposta</summary>

Gera um hash de senha apropriado para armazenamento, incluindo salt e parâmetros necessários. A verificação é feita com password_verify, não comparando hashes manualmente.

</details>

### Aula 09 — [Acesso a banco de dados com PDO](../aulas/09-banco-de-dados-com-pdo.md)

**17. O que é PDO?**
<sub>Aula [09 — Acesso a banco de dados com PDO](../aulas/09-banco-de-dados-com-pdo.md)</sub>
<details><summary>Ver resposta</summary>

É uma interface PHP para acessar bancos através de drivers. Ela oferece uma API comum para conexão, preparação e execução de instruções, sem ser um ORM.

</details>

**18. O que é um prepared statement?**
<sub>Aula [09 — Acesso a banco de dados com PDO](../aulas/09-banco-de-dados-com-pdo.md)</sub>
<details><summary>Ver resposta</summary>

É uma instrução preparada em que os valores são enviados separadamente do texto SQL. Isso evita concatenar entrada nos valores da consulta.

</details>

### Aula 10 — [Performance, testes e ecossistema PHP](../aulas/10-performance-testes-e-ecossistema.md)

**19. O que é OPcache?**
<sub>Aula [10 — Performance, testes e ecossistema PHP](../aulas/10-performance-testes-e-ecossistema.md)</sub>
<details><summary>Ver resposta</summary>

É uma extensão que guarda bytecode compilado em memória compartilhada para evitar ler e compilar scripts novamente. Não acelera diretamente uma consulta ou chamada externa lenta.

</details>

**20. Qual a diferença entre PHPUnit/Pest e PHPStan/Psalm?**
<sub>Aula [10 — Performance, testes e ecossistema PHP](../aulas/10-performance-testes-e-ecossistema.md)</sub>
<details><summary>Ver resposta</summary>

PHPUnit e Pest executam testes de comportamento. PHPStan e Psalm analisam código sem executar todos os caminhos, inferindo tipos e apontando inconsistências.

</details>
