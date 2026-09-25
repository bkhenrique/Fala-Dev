# JavaScript — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os trade-offs._

**Regra:** responda **em voz alta** antes de abrir a resposta.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [JavaScript, ECMAScript e ambientes de execução](../aulas/01-javascript-ecmascript-e-ambientes.md)

**1. Por que `document` pode existir no navegador e não no Node.js?**
<sub>Aula [01 — JavaScript, ECMAScript e ambientes de execução](../aulas/01-javascript-ecmascript-e-ambientes.md)</sub>
<details><summary>Ver resposta</summary>

`document` pertence à API DOM fornecida por navegadores, não ao conjunto de recursos centrais do ECMAScript. Node.js fornece outro conjunto de APIs; o código deve depender apenas das capacidades disponíveis no host usado.

</details>

**2. Por que transpilar sintaxe não garante suporte a uma API nova?**
<sub>Aula [01 — JavaScript, ECMAScript e ambientes de execução](../aulas/01-javascript-ecmascript-e-ambientes.md)</sub>
<details><summary>Ver resposta</summary>

Transpilação pode reescrever sintaxe, mas a API ainda precisa existir no runtime ou ser fornecida por um polyfill compatível. Sintaxe e biblioteca de APIs são camadas distintas.

</details>

### Aula 02 — [Valores, tipos e coerção](../aulas/02-valores-tipos-e-coercao.md)

**3. Por que preferir `===` em comparações comuns?**
<sub>Aula [02 — Valores, tipos e coerção](../aulas/02-valores-tipos-e-coercao.md)</sub>
<details><summary>Ver resposta</summary>

Porque ele não converte operandos de tipos diferentes antes de comparar, deixando o contrato mais previsível. Ainda compara objetos por identidade, não pelo conteúdo.

</details>

**4. Por que usar `BigInt` em vez de `number` para certos inteiros?**
<sub>Aula [02 — Valores, tipos e coerção](../aulas/02-valores-tipos-e-coercao.md)</sub>
<details><summary>Ver resposta</summary>

Inteiros `number` só são representados exatamente até `Number.MAX_SAFE_INTEGER` em magnitude. `BigInt` representa inteiros maiores com exatidão, mas não se mistura automaticamente com `number` em aritmética e não serve para frações.

</details>

### Aula 03 — [Declarações, escopo e hoisting](../aulas/03-declaracoes-escopo-e-hoisting.md)

**5. Por que preferir `let` ou `const` a `var` em código novo?**
<sub>Aula [03 — Declarações, escopo e hoisting](../aulas/03-declaracoes-escopo-e-hoisting.md)</sub>
<details><summary>Ver resposta</summary>

O escopo de bloco de `let` e `const` reduz vazamentos de nomes entre blocos e a TDZ torna leitura antes da inicialização um erro explícito. `var` continua necessário para compreender código legado.

</details>

**6. Por que `const` não garante imutabilidade?**
<sub>Aula [03 — Declarações, escopo e hoisting](../aulas/03-declaracoes-escopo-e-hoisting.md)</sub>
<details><summary>Ver resposta</summary>

`const` fixa a ligação entre o nome e o valor; se o valor é uma referência a objeto, as propriedades mutáveis do objeto ainda podem ser alteradas. Imutabilidade exige outro contrato ou mecanismos específicos.

</details>

### Aula 04 — [Funções, closures e `this`](../aulas/04-funcoes-closures-e-this.md)

**7. Por que closures são úteis para encapsular estado?**
<sub>Aula [04 — Funções, closures e `this`](../aulas/04-funcoes-closures-e-this.md)</sub>
<details><summary>Ver resposta</summary>

Uma função interna pode acessar variáveis locais da função externa sem expô-las como propriedades globais. O trade-off é que o estado permanece alcançável enquanto a closure relevante estiver viva.

</details>

**8. Por que uma arrow function nem sempre é substituta de método?**
<sub>Aula [04 — Funções, closures e `this`](../aulas/04-funcoes-closures-e-this.md)</sub>
<details><summary>Ver resposta</summary>

Arrow function herda `this` do contexto léxico e não recebe `this` do objeto chamador. Um método comum pode usar `this` conforme a forma `obj.metodo()`.

</details>

### Aula 05 — [Objetos, protótipos e classes](../aulas/05-objetos-prototipos-e-classes.md)

**9. Por que métodos de instância costumam ficar no protótipo?**
<sub>Aula [05 — Objetos, protótipos e classes](../aulas/05-objetos-prototipos-e-classes.md)</sub>
<details><summary>Ver resposta</summary>

Assim, instâncias da mesma classe podem compartilhar a função em vez de criar uma função própria para cada objeto. Campos e closures podem ter necessidades diferentes; a escolha depende do comportamento esperado.

</details>

**10. Por que composição pode ser preferível a herança profunda?**
<sub>Aula [05 — Objetos, protótipos e classes](../aulas/05-objetos-prototipos-e-classes.md)</sub>
<details><summary>Ver resposta</summary>

Composição combina capacidades sem acoplar a classe filha à cadeia de implementação da classe base. Herança ainda é adequada quando existe uma relação estável de subtipo e substituibilidade.

</details>

### Aula 06 — [Arrays, coleções e iteração](../aulas/06-arrays-colecoes-e-iteracao.md)

**11. Por que escolher `Map` para chaves que são objetos?**
<sub>Aula [06 — Arrays, coleções e iteração](../aulas/06-arrays-colecoes-e-iteracao.md)</sub>
<details><summary>Ver resposta</summary>

`Map` preserva a identidade do objeto usado como chave e oferece operações próprias de coleção. Em um objeto comum, uma chave de objeto é convertida em string, então identidades distintas podem colidir no mesmo nome.

</details>

**12. Por que `sort()` exige cuidado com números?**
<sub>Aula [06 — Arrays, coleções e iteração](../aulas/06-arrays-colecoes-e-iteracao.md)</sub>
<details><summary>Ver resposta</summary>

Sem comparador, `sort()` ordena elementos convertidos para strings UTF-16, não numericamente. Além disso, ele altera o próprio array. Use um comparador numérico e considere copiar antes se a entrada não puder ser mutada.

</details>

### Aula 07 — [Controle de fluxo e erros](../aulas/07-controle-de-fluxo-e-erros.md)

**13. Por que `??` pode ser melhor que `||` para valor padrão?**
<sub>Aula [07 — Controle de fluxo e erros](../aulas/07-controle-de-fluxo-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

`??` só substitui `null` e `undefined`, preservando valores legítimos como `0`, `false` e `""`. `||` substitui qualquer valor falsy, o que pode apagar uma configuração válida.

</details>

**14. Por que não capturar e ignorar toda exceção?**
<sub>Aula [07 — Controle de fluxo e erros](../aulas/07-controle-de-fluxo-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

Ignorar a exceção esconde o ponto da falha e pode deixar o programa em estado incorreto. Capture onde há uma ação útil, como recuperar, traduzir o erro ou acrescentar contexto; caso contrário, propague.

</details>

### Aula 08 — [Programação assíncrona: Promises e `async`/`await`](../aulas/08-promises-e-async-await.md)

**15. Por que `Promise.all()` é adequado para operações independentes?**
<sub>Aula [08 — Programação assíncrona: Promises e `async`/`await`](../aulas/08-promises-e-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Iniciar as operações antes de aguardar permite que progridam concorrentemente. `Promise.all()` entrega os resultados em ordem de entrada se todas cumprirem, e rejeita se uma rejeitar; não cancela automaticamente as outras.

</details>

**16. Por que `await` em sequência pode aumentar a latência?**
<sub>Aula [08 — Programação assíncrona: Promises e `async`/`await`](../aulas/08-promises-e-async-await.md)</sub>
<details><summary>Ver resposta</summary>

O segundo trabalho só começa depois que o primeiro termina. Se ambos forem independentes, iniciar ambos e depois aguardar `Promise.all()` evita serializar esperas; se houver dependência, a sequência é necessária.

</details>

### Aula 09 — [Módulos ECMAScript](../aulas/09-modulos-ecmascript.md)

**17. Por que modularizar dependências com `import`/`export`?**
<sub>Aula [09 — Módulos ECMAScript](../aulas/09-modulos-ecmascript.md)</sub>
<details><summary>Ver resposta</summary>

As dependências e APIs ficam explícitas, cada arquivo mantém escopo próprio e ferramentas conseguem analisar o grafo de módulos. O trade-off é ter de configurar corretamente resolução e carregamento no ambiente.

</details>

**18. Por que a resolução de módulos não é totalmente definida pelo ECMAScript?**
<sub>Aula [09 — Módulos ECMAScript](../aulas/09-modulos-ecmascript.md)</sub>
<details><summary>Ver resposta</summary>

A especificação define semântica e registros dos módulos, mas o host determina aspectos de carregamento e resolução de especificadores, como URLs no navegador ou regras de arquivos no Node.js.

</details>

### Aula 10 — [Iteradores e generators](../aulas/10-iteradores-e-generators.md)

**19. Por que usar um generator para uma sequência grande?**
<sub>Aula [10 — Iteradores e generators](../aulas/10-iteradores-e-generators.md)</sub>
<details><summary>Ver resposta</summary>

Ele pode produzir valores sob demanda em vez de materializar a sequência inteira. Isso economiza memória em alguns fluxos, mas não fornece acesso aleatório e pode deixar o consumo mais complexo.

</details>

**20. Por que `for...of` funciona com coleções diferentes?**
<sub>Aula [10 — Iteradores e generators](../aulas/10-iteradores-e-generators.md)</sub>
<details><summary>Ver resposta</summary>

Porque consome o protocolo iterável comum (`Symbol.iterator` e `next()`), implementado por arrays, strings, `Map`, `Set` e generators.

</details>
