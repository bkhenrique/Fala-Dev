# JavaScript — perguntas, nível 3: Como você faria?

_Cenários reais: junte conceitos e explique suas decisões._

**Regra:** responda **em voz alta** antes de abrir a resposta.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [JavaScript, ECMAScript e ambientes de execução](../aulas/01-javascript-ecmascript-e-ambientes.md)

**1. Uma função compartilhada entre navegador e Node.js usa `fetch` e `document`. Como você avalia a portabilidade?**
<sub>Aula [01 — JavaScript, ECMAScript e ambientes de execução](../aulas/01-javascript-ecmascript-e-ambientes.md)</sub>
<details><summary>Ver resposta</summary>

`document` é uma API de navegador e não deve ser presumida no Node. `fetch` precisa ser verificado na versão mínima de cada host. Eu separaria a lógica ECMAScript pura das integrações de host e injetaria as dependências, testando cada ambiente suportado.

</details>

### Aula 02 — [Valores, tipos e coerção](../aulas/02-valores-tipos-e-coercao.md)

**2. Dois objetos com as mesmas propriedades são comparados com `===` e o resultado é `false`. Por quê?**
<sub>Aula [02 — Valores, tipos e coerção](../aulas/02-valores-tipos-e-coercao.md)</sub>
<details><summary>Ver resposta</summary>

Porque objetos são comparados por identidade: cada literal cria um objeto distinto, mesmo que as propriedades e valores sejam iguais. Se o domínio exige igualdade estrutural, ela precisa ser definida explicitamente; serializar para comparar também tem limitações e não é um comparador geral.

</details>

### Aula 03 — [Declarações, escopo e hoisting](../aulas/03-declaracoes-escopo-e-hoisting.md)

**3. Um laço registra callbacks que deveriam lembrar cada índice, mas todos usam o último valor. O que você investiga?**
<sub>Aula [03 — Declarações, escopo e hoisting](../aulas/03-declaracoes-escopo-e-hoisting.md)</sub>
<details><summary>Ver resposta</summary>

Verifico se o índice foi declarado com `var`, que tem escopo de função e pode ser compartilhado entre iterações. `let` no cabeçalho do laço cria uma ligação por iteração, adequada para callbacks que precisam capturar cada índice.

</details>

### Aula 04 — [Funções, closures e `this`](../aulas/04-funcoes-closures-e-this.md)

**4. Um método funciona como `obj.salvar()`, mas falha ao ser passado como callback. Como diagnosticar?**
<sub>Aula [04 — Funções, closures e `this`](../aulas/04-funcoes-closures-e-this.md)</sub>
<details><summary>Ver resposta</summary>

Ao passar `obj.salvar`, a chamada perde a forma `obj.metodo()` que fornecia `this`. Posso usar uma arrow function de encaminhamento, `bind(obj)` ou remover a dependência de `this`, conforme o contrato e a API que recebe o callback.

</details>

### Aula 05 — [Objetos, protótipos e classes](../aulas/05-objetos-prototipos-e-classes.md)

**5. Uma cópia feita com `{ ...pedido }` ainda compartilha os itens internos. Por quê e como tratar?**
<sub>Aula [05 — Objetos, protótipos e classes](../aulas/05-objetos-prototipos-e-classes.md)</sub>
<details><summary>Ver resposta</summary>

Spread copia apenas propriedades próprias enumeráveis de primeiro nível; propriedades que contêm objetos continuam apontando para as mesmas referências. Eu definiria a semântica de cópia necessária e copiaria explicitamente os níveis mutáveis ou usaria uma estratégia de dados imutáveis adequada ao domínio.

</details>

### Aula 06 — [Arrays, coleções e iteração](../aulas/06-arrays-colecoes-e-iteracao.md)

**6. Você precisa agrupar resultados usando objetos como chaves e preservar a identidade. Qual coleção escolhe?**
<sub>Aula [06 — Arrays, coleções e iteração](../aulas/06-arrays-colecoes-e-iteracao.md)</sub>
<details><summary>Ver resposta</summary>

Escolho `Map`, pois aceita objetos como chaves sem convertê-los em strings e preserva identidade. Também considero se a coleção precisa ser enumerável e quanto tempo as referências devem permanecer vivas.

</details>

### Aula 07 — [Controle de fluxo e erros](../aulas/07-controle-de-fluxo-e-erros.md)

**7. Uma função aceita zero como limite opcional, mas atualmente substitui zero pelo padrão. Como você a ajusta?**
<sub>Aula [07 — Controle de fluxo e erros](../aulas/07-controle-de-fluxo-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

Substituo a verificação baseada em `||` por `??` ou verifico explicitamente `null`/`undefined`, conforme o contrato. Depois valido que o valor fornecido seja do tipo e faixa aceitos.

</details>

### Aula 08 — [Programação assíncrona: Promises e `async`/`await`](../aulas/08-promises-e-async-await.md)

**8. Duas consultas independentes são aguardadas uma após a outra. Como reduzir o tempo sem perder o tratamento de erro?**
<sub>Aula [08 — Programação assíncrona: Promises e `async`/`await`](../aulas/08-promises-e-async-await.md)</sub>
<details><summary>Ver resposta</summary>

Inicio ambas as Promises antes do `await` e aguardo `Promise.all()`, tratando rejeição com `try...catch` ou no chamador. Se preciso preservar resultados parciais mesmo quando uma falha, avalio `Promise.allSettled()` e interpreto cada status.

</details>

### Aula 09 — [Módulos ECMAScript](../aulas/09-modulos-ecmascript.md)

**9. Um módulo importa `"./util"`, mas funciona no bundler e falha no navegador sem build. O que você verifica?**
<sub>Aula [09 — Módulos ECMAScript](../aulas/09-modulos-ecmascript.md)</sub>
<details><summary>Ver resposta</summary>

Verifico o especificador e as regras do host: navegador carrega módulos por URL e normalmente precisa de um caminho resolvível, como `./util.js`; bundlers podem aplicar resolução adicional e empacotar dependências. Também confirmo MIME type e configuração do servidor.

</details>

### Aula 10 — [Iteradores e generators](../aulas/10-iteradores-e-generators.md)

**10. Um processo precisa ler uma sequência potencialmente grande, valor por valor. Como decidir entre array e generator?**
<sub>Aula [10 — Iteradores e generators](../aulas/10-iteradores-e-generators.md)</sub>
<details><summary>Ver resposta</summary>

Se preciso de todos os valores, acesso por índice ou múltiplas passagens, um array pode ser simples. Se posso consumir progressivamente uma vez e quero evitar materializar tudo, um iterável ou generator pode reduzir memória. Considero também encerramento, erros e se a fonte é síncrona ou assíncrona.

</details>
