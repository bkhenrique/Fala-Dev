# TypeScript — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [O papel do TypeScript e o fluxo de compilação](../aulas/01-papel-e-compilacao.md)

**1. O que o TypeScript acrescenta a programas JavaScript?**
<sub>Aula [01 — O papel do TypeScript e o fluxo de compilação](../aulas/01-papel-e-compilacao.md)</sub>
<details><summary>Ver resposta</summary>

Acrescenta sintaxe e um verificador estático de tipos que analisa programas antes da execução. O compilador também pode emitir JavaScript; as verificações não validam automaticamente dados em runtime.

</details>

**2. Qual a diferença entre checagem de tipos e emissão?**
<sub>Aula [01 — O papel do TypeScript e o fluxo de compilação](../aulas/01-papel-e-compilacao.md)</sub>
<details><summary>Ver resposta</summary>

Checagem analisa se os usos são compatíveis com os tipos conhecidos. Emissão grava JavaScript conforme as opções do projeto. É possível checar com `noEmit`, e ferramentas que transpilem sintaxe nem sempre fazem a checagem completa.

</details>

### Aula 02 — [Tipos, inferência e anotações](../aulas/02-tipos-inferencia-e-anotacoes.md)

**3. O que é inferência de tipo?**
<sub>Aula [02 — Tipos, inferência e anotações](../aulas/02-tipos-inferencia-e-anotacoes.md)</sub>
<details><summary>Ver resposta</summary>

É quando o compilador deduz um tipo com base em valores iniciais, contexto e usos, sem exigir anotação explícita em cada variável.

</details>

**4. Qual a diferença entre `any` e `unknown`?**
<sub>Aula [02 — Tipos, inferência e anotações](../aulas/02-tipos-inferencia-e-anotacoes.md)</sub>
<details><summary>Ver resposta</summary>

`any` permite operações sem checagem significativa. `unknown` aceita qualquer valor, mas exige uma verificação ou asserção antes de operações específicas.

</details>

### Aula 03 — [Tipos de objeto, `type` e `interface`](../aulas/03-objetos-type-e-interface.md)

**5. O que significa tipagem estrutural?**
<sub>Aula [03 — Tipos de objeto, `type` e `interface`](../aulas/03-objetos-type-e-interface.md)</sub>
<details><summary>Ver resposta</summary>

Compatibilidade depende dos membros e tipos que uma estrutura possui, em vez de exigir que os tipos tenham o mesmo nome ou declaração nominal.

</details>

**6. O que `readonly` significa para uma propriedade?**
<sub>Aula [03 — Tipos de objeto, `type` e `interface`](../aulas/03-objetos-type-e-interface.md)</sub>
<details><summary>Ver resposta</summary>

O compilador restringe atribuições a essa propriedade por meio daquela referência. Isso não congela o objeto em runtime nem torna imutáveis seus objetos aninhados.

</details>

### Aula 04 — [União, narrowing e tipos seguros](../aulas/04-unioes-narrowing-e-tipos-seguros.md)

**7. O que é narrowing?**
<sub>Aula [04 — União, narrowing e tipos seguros](../aulas/04-unioes-narrowing-e-tipos-seguros.md)</sub>
<details><summary>Ver resposta</summary>

É o refinamento que o compilador faz de um tipo amplo para um mais específico, com base em verificações e fluxo de controle.

</details>

**8. O que é uma união discriminada?**
<sub>Aula [04 — União, narrowing e tipos seguros](../aulas/04-unioes-narrowing-e-tipos-seguros.md)</sub>
<details><summary>Ver resposta</summary>

Uma união de formatos de objeto que compartilham uma propriedade discriminante, normalmente um literal, usada para identificar a variante e permitir narrowing.

</details>

### Aula 05 — [Funções e assinaturas](../aulas/05-funcoes-e-assinaturas.md)

**9. Como se escreve o tipo de uma função?**
<sub>Aula [05 — Funções e assinaturas](../aulas/05-funcoes-e-assinaturas.md)</sub>
<details><summary>Ver resposta</summary>

Uma forma comum é `(parametro: Tipo) => Retorno`. Também é possível usar assinatura de chamada em um tipo de objeto ou declarar uma função com os tipos de parâmetros e retorno.

</details>

**10. O que é uma sobrecarga?**
<sub>Aula [05 — Funções e assinaturas](../aulas/05-funcoes-e-assinaturas.md)</sub>
<details><summary>Ver resposta</summary>

É uma declaração de uma forma pública de chamada de função. Pode haver várias assinaturas de sobrecarga e uma implementação que trata os casos, mas a implementação não vira uma assinatura adicional para o chamador.

</details>

### Aula 06 — [Generics e restrições](../aulas/06-generics-e-restricoes.md)

**11. O que é um generic?**
<sub>Aula [06 — Generics e restrições](../aulas/06-generics-e-restricoes.md)</sub>
<details><summary>Ver resposta</summary>

É um parâmetro de tipo que permite expressar uma relação entre tipos de entrada, saída ou membros, mantendo o tipo concreto informado ou inferido pelo chamador.

</details>

**12. O que `keyof T` produz?**
<sub>Aula [06 — Generics e restrições](../aulas/06-generics-e-restricoes.md)</sub>
<details><summary>Ver resposta</summary>

Produz um tipo união com as chaves conhecidas de `T`, permitindo restringir ou relacionar operações genéricas às propriedades daquele tipo.

</details>

### Aula 07 — [Operadores e tipos utilitários](../aulas/07-operadores-e-tipos-utilitarios.md)

**13. Para que serve `Partial<T>`?**
<sub>Aula [07 — Operadores e tipos utilitários](../aulas/07-operadores-e-tipos-utilitarios.md)</sub>
<details><summary>Ver resposta</summary>

É um tipo utilitário que transforma as propriedades de `T` em opcionais no sistema estático. Não altera um objeto nem valida dados em runtime.

</details>

**14. Para que serve `satisfies`?**
<sub>Aula [07 — Operadores e tipos utilitários](../aulas/07-operadores-e-tipos-utilitarios.md)</sub>
<details><summary>Ver resposta</summary>

Verifica se uma expressão é compatível com um tipo sem simplesmente substituir o tipo inferido da expressão por esse tipo. Atua só na checagem estática.

</details>

### Aula 08 — [Classes e compatibilidade com JavaScript](../aulas/08-classes-e-javascript.md)

**15. O que `implements` faz em uma classe?**
<sub>Aula [08 — Classes e compatibilidade com JavaScript](../aulas/08-classes-e-javascript.md)</sub>
<details><summary>Ver resposta</summary>

Faz o compilador verificar se a instância da classe satisfaz o contrato de uma interface. Não adiciona validação runtime nem cria a interface em JavaScript.

</details>

**16. O que são campos privados `#`?**
<sub>Aula [08 — Classes e compatibilidade com JavaScript](../aulas/08-classes-e-javascript.md)</sub>
<details><summary>Ver resposta</summary>

São campos privados da sintaxe JavaScript, com acesso restrito pela linguagem em runtime à classe que os declara.

</details>

### Aula 09 — [Módulos e arquivos de declaração](../aulas/09-modulos-e-declaracoes.md)

**17. Para que serve um arquivo `.d.ts`?**
<sub>Aula [09 — Módulos e arquivos de declaração](../aulas/09-modulos-e-declaracoes.md)</sub>
<details><summary>Ver resposta</summary>

Descreve tipos e APIs de uma implementação JavaScript para a checagem do TypeScript. O arquivo não contém a implementação runtime da API descrita.

</details>

**18. O que `import type` indica?**
<sub>Aula [09 — Módulos e arquivos de declaração](../aulas/09-modulos-e-declaracoes.md)</sub>
<details><summary>Ver resposta</summary>

Indica uma importação usada apenas como tipo. Ela é apagada da saída JavaScript e não cria uma dependência de valor runtime.

</details>

### Aula 10 — [`tsconfig`, segurança de tipos e runtime](../aulas/10-tsconfig-seguranca-e-runtime.md)

**19. O que `strict` faz no `tsconfig`?**
<sub>Aula [10 — `tsconfig`, segurança de tipos e runtime](../aulas/10-tsconfig-seguranca-e-runtime.md)</sub>
<details><summary>Ver resposta</summary>

Ativa um conjunto de verificações estritas do compilador, incluindo opções importantes para nulidade e `any` implícito. Não valida dados em runtime.

</details>

**20. Uma asserção `valor as Tipo` valida ou converte o valor?**
<sub>Aula [10 — `tsconfig`, segurança de tipos e runtime](../aulas/10-tsconfig-seguranca-e-runtime.md)</sub>
<details><summary>Ver resposta</summary>

Não. É uma instrução estática para o compilador; não inspeciona nem transforma o valor em runtime. Uma asserção incorreta pode deixar um erro para execução.

</details>
