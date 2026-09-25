# TypeScript — perguntas, nível 3: Como você faria?

_Cenários reais: junte conceitos e explique suas decisões._

**Regra:** responda **em voz alta** antes de abrir a resposta.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [O papel do TypeScript e o fluxo de compilação](../aulas/01-papel-e-compilacao.md)

**1. O build transpila TypeScript, mas um erro de tipo chega à produção. Como você investiga?**
<sub>Aula [01 — O papel do TypeScript e o fluxo de compilação](../aulas/01-papel-e-compilacao.md)</sub>
<details><summary>Ver resposta</summary>

Identifico qual ferramenta emitiu o JavaScript e se o pipeline executou type-check. Um transpiler pode remover tipos sem verificá-los. Eu adicionaria uma etapa explícita de checagem no CI e confirmaria que ela usa o mesmo `tsconfig` do projeto.

</details>

### Aula 02 — [Tipos, inferência e anotações](../aulas/02-tipos-inferencia-e-anotacoes.md)

**2. Uma resposta de API está tipada como `Usuario`, mas pode vir malformada. O que você faz?**
<sub>Aula [02 — Tipos, inferência e anotações](../aulas/02-tipos-inferencia-e-anotacoes.md)</sub>
<details><summary>Ver resposta</summary>

Trato o corpo recebido como `unknown`, valido sua estrutura e regras em runtime e só depois o converto para o tipo que representa o dado validado. Uma anotação ou cast para `Usuario` não comprova o formato recebido.

</details>

### Aula 03 — [Tipos de objeto, `type` e `interface`](../aulas/03-objetos-type-e-interface.md)

**3. Uma interface exige `id`, e o objeto também tem vários campos extras. Como você avalia a atribuição?**
<sub>Aula [03 — Tipos de objeto, `type` e `interface`](../aulas/03-objetos-type-e-interface.md)</sub>
<details><summary>Ver resposta</summary>

Se o valor já está numa variável e tem `id` compatível, a tipagem estrutural normalmente permite atribuí-lo mesmo com membros extras. Se for literal recém-criado, a verificação de propriedade excedente pode apontar campos desconhecidos. Isso é uma checagem de erro provável, não tipagem nominal.

</details>

### Aula 04 — [União, narrowing e tipos seguros](../aulas/04-unioes-narrowing-e-tipos-seguros.md)

**4. Uma operação retorna `{ ok: boolean, data?, error? }` e aceita estados contraditórios. Como modelar?**
<sub>Aula [04 — União, narrowing e tipos seguros](../aulas/04-unioes-narrowing-e-tipos-seguros.md)</sub>
<details><summary>Ver resposta</summary>

Modelaria uma união discriminada, por exemplo `{ kind: "ok", data: Dado } | { kind: "erro", error: Erro }`. Assim o discriminante permite narrowing e cada variante exige os campos correspondentes. Ainda validaria em runtime se a origem for externa.

</details>

### Aula 05 — [Funções e assinaturas](../aulas/05-funcoes-e-assinaturas.md)

**5. Uma função tem entradas textuais e numéricas com formatos de retorno diferentes. Como escolher entre união e overload?**
<sub>Aula [05 — Funções e assinaturas](../aulas/05-funcoes-e-assinaturas.md)</sub>
<details><summary>Ver resposta</summary>

Se a relação entrada/saída varia conforme a forma de chamada, sobrecargas podem expressar melhor esse contrato. Se as alternativas compartilham o mesmo comportamento e retorno geral, uma assinatura com união pode ser mais simples. Em ambos os casos, a implementação deve tratar os formatos reais.

</details>

### Aula 06 — [Generics e restrições](../aulas/06-generics-e-restricoes.md)

**6. Escreva mentalmente o tipo de uma função que recebe objeto e chave válida e devolve o valor daquela chave. Que relação genérica usa?**
<sub>Aula [06 — Generics e restrições](../aulas/06-generics-e-restricoes.md)</sub>
<details><summary>Ver resposta</summary>

Uso `<T, K extends keyof T>(objeto: T, chave: K): T[K]`. `K` fica restrito às chaves de `T`, e `T[K]` relaciona o tipo de retorno à chave escolhida.

</details>

### Aula 07 — [Operadores e tipos utilitários](../aulas/07-operadores-e-tipos-utilitarios.md)

**7. Você usa `Partial<Usuario>` para uma configuração e quer preservar os tipos inferidos dos valores específicos. Como declarar o contrato?**
<sub>Aula [07 — Operadores e tipos utilitários](../aulas/07-operadores-e-tipos-utilitarios.md)</sub>
<details><summary>Ver resposta</summary>

Posso usar `satisfies Partial<Usuario>` para verificar a compatibilidade e preservar mais detalhes inferidos da expressão. Isso continua sendo estático: se a configuração vier de JSON externo, valido a forma em runtime.

</details>

### Aula 08 — [Classes e compatibilidade com JavaScript](../aulas/08-classes-e-javascript.md)

**8. Uma biblioteca JavaScript acessa diretamente uma propriedade marcada `private` no TypeScript. Que privacidade existe?**
<sub>Aula [08 — Classes e compatibilidade com JavaScript](../aulas/08-classes-e-javascript.md)</sub>
<details><summary>Ver resposta</summary>

O `private` tradicional do TypeScript restringe acessos durante a checagem, mas não é garantia de privacidade runtime contra JavaScript. Se for necessário encapsulamento runtime, avalio campos `#privados` e compatibilidade com os ambientes suportados.

</details>

### Aula 09 — [Módulos e arquivos de declaração](../aulas/09-modulos-e-declaracoes.md)

**9. O TypeScript resolve um alias de import, mas a aplicação quebra ao iniciar. Quais camadas você confere?**
<sub>Aula [09 — Módulos e arquivos de declaração](../aulas/09-modulos-e-declaracoes.md)</sub>
<details><summary>Ver resposta</summary>

Confiro `moduleResolution`, `paths`, a configuração do bundler ou runtime e os caminhos presentes no JavaScript emitido. O compilador pode conhecer o alias sem que o executor conheça a mesma regra.

</details>

### Aula 10 — [`tsconfig`, segurança de tipos e runtime](../aulas/10-tsconfig-seguranca-e-runtime.md)

**10. Você recebe JSON, faz `as Pedido` e o programa falha ao acessar `itens.map`. Como corrigir o limite de confiança?**
<sub>Aula [10 — `tsconfig`, segurança de tipos e runtime](../aulas/10-tsconfig-seguranca-e-runtime.md)</sub>
<details><summary>Ver resposta</summary>

O cast não verificou que `itens` existia nem que era array. Leio o JSON como `unknown`, valido campos e elementos em runtime (manualmente ou com schema validator) e só então passo adiante o resultado que satisfaz o contrato.

</details>
