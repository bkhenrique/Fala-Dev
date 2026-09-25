# JavaScript — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [JavaScript, ECMAScript e ambientes de execução](../aulas/01-javascript-ecmascript-e-ambientes.md)

**1. O que é ECMAScript?**
<sub>Aula [01 — JavaScript, ECMAScript e ambientes de execução](../aulas/01-javascript-ecmascript-e-ambientes.md)</sub>
<details><summary>Ver resposta</summary>

É a especificação que define a linguagem JavaScript: sua sintaxe, semântica e objetos padrão. Navegador e Node.js acrescentam APIs próprias como hosts.

</details>

**2. Qual a diferença entre engine e runtime?**
<sub>Aula [01 — JavaScript, ECMAScript e ambientes de execução](../aulas/01-javascript-ecmascript-e-ambientes.md)</sub>
<details><summary>Ver resposta</summary>

Engine implementa e executa a linguagem. Runtime combina a engine com APIs e recursos do host; Node.js e navegadores são ambientes diferentes.

</details>

### Aula 02 — [Valores, tipos e coerção](../aulas/02-valores-tipos-e-coercao.md)

**3. Quais são os tipos primitivos de JavaScript?**
<sub>Aula [02 — Valores, tipos e coerção](../aulas/02-valores-tipos-e-coercao.md)</sub>
<details><summary>Ver resposta</summary>

`undefined`, `null`, `boolean`, `number`, `bigint`, `string` e `symbol`. Objetos, arrays e funções não são tipos primitivos.

</details>

**4. O que é coerção?**
<sub>Aula [02 — Valores, tipos e coerção](../aulas/02-valores-tipos-e-coercao.md)</sub>
<details><summary>Ver resposta</summary>

É a conversão de valor que a linguagem aplica implicitamente em certas operações, como concatenação ou condicionais. Conversão explícita é solicitada no código, por exemplo com `Number(valor)`.

</details>

### Aula 03 — [Declarações, escopo e hoisting](../aulas/03-declaracoes-escopo-e-hoisting.md)

**5. Qual o escopo de `let` e `const`?**
<sub>Aula [03 — Declarações, escopo e hoisting](../aulas/03-declaracoes-escopo-e-hoisting.md)</sub>
<details><summary>Ver resposta</summary>

Escopo de bloco: ficam visíveis no bloco onde foram declarados e nos escopos internos, não fora dele.

</details>

**6. O que é a TDZ?**
<sub>Aula [03 — Declarações, escopo e hoisting](../aulas/03-declaracoes-escopo-e-hoisting.md)</sub>
<details><summary>Ver resposta</summary>

Zona temporal morta: intervalo entre o início do escopo e a inicialização de uma ligação `let` ou `const`. Tentar acessá-la nesse intervalo lança `ReferenceError`.

</details>

### Aula 04 — [Funções, closures e `this`](../aulas/04-funcoes-closures-e-this.md)

**7. O que é uma closure?**
<sub>Aula [04 — Funções, closures e `this`](../aulas/04-funcoes-closures-e-this.md)</sub>
<details><summary>Ver resposta</summary>

É uma função que mantém acesso às ligações do ambiente léxico onde foi criada, mesmo quando a execução externa já terminou.

</details>

**8. Como uma arrow function obtém `this`?**
<sub>Aula [04 — Funções, closures e `this`](../aulas/04-funcoes-closures-e-this.md)</sub>
<details><summary>Ver resposta</summary>

Arrow function não cria `this` próprio; usa o `this` léxico do escopo externo. `call`, `apply` e `bind` não substituem esse valor.

</details>

### Aula 05 — [Objetos, protótipos e classes](../aulas/05-objetos-prototipos-e-classes.md)

**9. O que é a cadeia de protótipos?**
<sub>Aula [05 — Objetos, protótipos e classes](../aulas/05-objetos-prototipos-e-classes.md)</sub>
<details><summary>Ver resposta</summary>

É a sequência de objetos consultada quando uma propriedade não é encontrada diretamente no objeto, até encontrar a propriedade ou chegar a `null`.

</details>

**10. O que `class` representa em JavaScript?**
<sub>Aula [05 — Objetos, protótipos e classes](../aulas/05-objetos-prototipos-e-classes.md)</sub>
<details><summary>Ver resposta</summary>

É uma sintaxe para definir construtores e métodos integrados ao modelo de herança por protótipos. Métodos de instância ficam no protótipo da classe.

</details>

### Aula 06 — [Arrays, coleções e iteração](../aulas/06-arrays-colecoes-e-iteracao.md)

**11. Qual a diferença entre `for...of` e `for...in`?**
<sub>Aula [06 — Arrays, coleções e iteração](../aulas/06-arrays-colecoes-e-iteracao.md)</sub>
<details><summary>Ver resposta</summary>

`for...of` consome valores de um iterável. `for...in` enumera nomes de propriedades enumeráveis, inclusive herdadas; não é o laço indicado para os valores de um array.

</details>

**12. Quando `Map` é diferente de um objeto comum?**
<sub>Aula [06 — Arrays, coleções e iteração](../aulas/06-arrays-colecoes-e-iteracao.md)</sub>
<details><summary>Ver resposta</summary>

`Map` aceita qualquer valor como chave e preserva sua identidade/tipo. Chaves de propriedade de objetos comuns são strings ou símbolos.

</details>

### Aula 07 — [Controle de fluxo e erros](../aulas/07-controle-de-fluxo-e-erros.md)

**13. O que significa curto-circuito em `&&` e `||`?**
<sub>Aula [07 — Controle de fluxo e erros](../aulas/07-controle-de-fluxo-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

A avaliação para quando o resultado já pode ser determinado, e o operador retorna um dos operandos. `&&` para no primeiro falsy; `||` para no primeiro truthy.

</details>

**14. O que `finally` faz?**
<sub>Aula [07 — Controle de fluxo e erros](../aulas/07-controle-de-fluxo-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

Executa a seção de finalização quando o fluxo sai do `try`/`catch`, seja normalmente, por exceção ou por `return`, observadas as regras de completamento da linguagem.

</details>

### Aula 08 — [Programação assíncrona: Promises e `async`/`await`](../aulas/08-promises-e-async-await.md)

**15. Quais são os estados de uma Promise?**
<sub>Aula [08 — Programação assíncrona: Promises e `async`/`await`](../aulas/08-promises-e-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Pendente, cumprida (*fulfilled*) ou rejeitada (*rejected*). Cumprida e rejeitada são estados finais, chamados de liquidados.

</details>

**16. O que uma função `async` sempre retorna?**
<sub>Aula [08 — Programação assíncrona: Promises e `async`/`await`](../aulas/08-promises-e-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Uma Promise. O valor retornado pela função cumpre essa Promise; uma exceção não tratada a rejeita.

</details>

### Aula 09 — [Módulos ECMAScript](../aulas/09-modulos-ecmascript.md)

**17. Para que servem `import` e `export`?**
<sub>Aula [09 — Módulos ECMAScript](../aulas/09-modulos-ecmascript.md)</sub>
<details><summary>Ver resposta</summary>

`export` expõe ligações de um módulo; `import` declara dependências e acessa ligações exportadas por outros módulos.

</details>

**18. O que é uma ligação viva (*live binding*)?**
<sub>Aula [09 — Módulos ECMAScript](../aulas/09-modulos-ecmascript.md)</sub>
<details><summary>Ver resposta</summary>

É a ligação que um módulo importador mantém com a exportação. O importador observa o valor atualizado conforme as regras do módulo, em vez de receber uma cópia independente.

</details>

### Aula 10 — [Iteradores e generators](../aulas/10-iteradores-e-generators.md)

**19. O que o método `next()` de um iterador retorna?**
<sub>Aula [10 — Iteradores e generators](../aulas/10-iteradores-e-generators.md)</sub>
<details><summary>Ver resposta</summary>

Um objeto de resultado de iteração, normalmente com as propriedades `value` e `done`; `done: true` indica que a iteração terminou.

</details>

**20. O que `yield` faz em uma função generator?**
<sub>Aula [10 — Iteradores e generators](../aulas/10-iteradores-e-generators.md)</sub>
<details><summary>Ver resposta</summary>

Suspende a execução do generator e fornece um valor ao iterador. Uma chamada posterior a `next()` retoma a execução.

</details>
