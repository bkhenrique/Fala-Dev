# TypeScript — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os trade-offs._

**Regra:** responda **em voz alta** antes de abrir a resposta.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [O papel do TypeScript e o fluxo de compilação](../aulas/01-papel-e-compilacao.md)

**1. Por que TypeScript não substitui testes e validação runtime?**
<sub>Aula [01 — O papel do TypeScript e o fluxo de compilação](../aulas/01-papel-e-compilacao.md)</sub>
<details><summary>Ver resposta</summary>

O verificador analisa o código e seus tipos estáticos, mas tipos não confirmam a forma de dados externos nem todos os comportamentos em execução. Testes exercitam comportamentos; validação runtime inspeciona valores recebidos.

</details>

**2. Por que transpilar código não significa que ele passou por type-check?**
<sub>Aula [01 — O papel do TypeScript e o fluxo de compilação](../aulas/01-papel-e-compilacao.md)</sub>
<details><summary>Ver resposta</summary>

Uma ferramenta pode remover anotações e transformar sintaxe sem analisar compatibilidade de tipos. Confirme se o pipeline executa uma etapa de checagem, frequentemente `tsc --noEmit` ou a ferramenta de type-check do projeto.

</details>

### Aula 02 — [Tipos, inferência e anotações](../aulas/02-tipos-inferencia-e-anotacoes.md)

**3. Por que `unknown` é mais seguro que `any` para entrada externa?**
<sub>Aula [02 — Tipos, inferência e anotações](../aulas/02-tipos-inferencia-e-anotacoes.md)</sub>
<details><summary>Ver resposta</summary>

`unknown` exige verificar o valor antes de usar suas propriedades ou métodos, evitando que a incerteza se espalhe silenciosamente. `any` permite as operações sem checagem, mas continua sem validar o dado em runtime.

</details>

**4. Por que habilitar `strictNullChecks`?**
<sub>Aula [02 — Tipos, inferência e anotações](../aulas/02-tipos-inferencia-e-anotacoes.md)</sub>
<details><summary>Ver resposta</summary>

Ele faz `null` e `undefined` serem tratados como alternativas explícitas em vez de aceitos onde qualquer tipo é esperado. O código passa a lidar com ausência em pontos identificáveis; isso não valida formatos de dados externos.

</details>

### Aula 03 — [Tipos de objeto, `type` e `interface`](../aulas/03-objetos-type-e-interface.md)

**5. Por que um objeto com propriedades extras pode ser atribuído a uma interface menor?**
<sub>Aula [03 — Tipos de objeto, `type` e `interface`](../aulas/03-objetos-type-e-interface.md)</sub>
<details><summary>Ver resposta</summary>

Porque a compatibilidade é estrutural: o valor tem os membros requeridos pelo destino. Literais de objeto novos recebem verificações adicionais para propriedades excedentes, mas isso não transforma o sistema em nominal.

</details>

**6. Quando escolher `interface` ou `type`?**
<sub>Aula [03 — Tipos de objeto, `type` e `interface`](../aulas/03-objetos-type-e-interface.md)</sub>
<details><summary>Ver resposta</summary>

Ambos descrevem objetos; `interface` é conveniente para contratos que podem ser estendidos ou mesclados. `type` é necessário para nomear uniões e outros tipos compostos. A escolha também deve seguir a convenção do código-base.

</details>

### Aula 04 — [União, narrowing e tipos seguros](../aulas/04-unioes-narrowing-e-tipos-seguros.md)

**7. Por que usar uma união discriminada em vez de muitas propriedades opcionais?**
<sub>Aula [04 — União, narrowing e tipos seguros](../aulas/04-unioes-narrowing-e-tipos-seguros.md)</sub>
<details><summary>Ver resposta</summary>

Uma união discriminada pode modelar alternativas exclusivas e associar a cada estado apenas seus campos válidos. Muitas propriedades opcionais podem permitir combinações contraditórias, como erro e sucesso ao mesmo tempo.

</details>

**8. Por que `as` não é uma validação?**
<sub>Aula [04 — União, narrowing e tipos seguros](../aulas/04-unioes-narrowing-e-tipos-seguros.md)</sub>
<details><summary>Ver resposta</summary>

`as` só altera o que o compilador assume sobre a expressão. Não testa propriedades, tipos ou valores e não converte o objeto em runtime; a suposição incorreta pode causar erro posterior.

</details>

### Aula 05 — [Funções e assinaturas](../aulas/05-funcoes-e-assinaturas.md)

**9. Por que nem todo parâmetro de callback deve ser opcional?**
<sub>Aula [05 — Funções e assinaturas](../aulas/05-funcoes-e-assinaturas.md)</sub>
<details><summary>Ver resposta</summary>

Parâmetro opcional diz que o chamador pode omiti-lo. Se a função que recebe o callback sempre envia o argumento, o callback pode aceitá-lo como obrigatório ou ignorá-lo; marcar `?` altera o contrato do chamador.

</details>

**10. Por que usar `Promise<T>` como retorno de uma função assíncrona?**
<sub>Aula [05 — Funções e assinaturas](../aulas/05-funcoes-e-assinaturas.md)</sub>
<details><summary>Ver resposta</summary>

Porque uma função `async` sempre retorna uma Promise, cujo valor de cumprimento tem tipo `T`. Escrever `Promise<T>` documenta o valor que o chamador recebe depois de aguardar.

</details>

### Aula 06 — [Generics e restrições](../aulas/06-generics-e-restricoes.md)

**11. Por que usar generic em vez de `any` numa função identidade?**
<sub>Aula [06 — Generics e restrições](../aulas/06-generics-e-restricoes.md)</sub>
<details><summary>Ver resposta</summary>

Generic mantém a relação entre o tipo recebido e o devolvido, preservando a informação do chamador. `any` permite que essa relação desapareça e não verifica operações posteriores.

</details>

**12. Por que restringir `T` com `extends`?**
<sub>Aula [06 — Generics e restrições](../aulas/06-generics-e-restricoes.md)</sub>
<details><summary>Ver resposta</summary>

Para declarar a capacidade mínima que o algoritmo usa e rejeitar tipos que não oferecem os membros necessários. A restrição é estrutural na maioria dos usos; não precisa ser uma classe base.

</details>

### Aula 07 — [Operadores e tipos utilitários](../aulas/07-operadores-e-tipos-utilitarios.md)

**13. Por que `Partial<T>` não é suficiente para processar um PATCH HTTP?**
<sub>Aula [07 — Operadores e tipos utilitários](../aulas/07-operadores-e-tipos-utilitarios.md)</sub>
<details><summary>Ver resposta</summary>

`Partial<T>` só torna propriedades opcionais durante a checagem estática. É preciso validar em runtime os campos, tipos, permissões e regras de negócio recebidos; o tipo não executa essa inspeção.

</details>

**14. Por que `satisfies` pode ser melhor que uma anotação ampla de configuração?**
<sub>Aula [07 — Operadores e tipos utilitários](../aulas/07-operadores-e-tipos-utilitarios.md)</sub>
<details><summary>Ver resposta</summary>

Ele verifica compatibilidade com o contrato e tende a preservar detalhes literais inferidos que uma anotação explícita mais ampla poderia generalizar. Continua sendo uma checagem estática, não uma validação runtime.

</details>

### Aula 08 — [Classes e compatibilidade com JavaScript](../aulas/08-classes-e-javascript.md)

**15. Por que `private` e `#privado` não são equivalentes?**
<sub>Aula [08 — Classes e compatibilidade com JavaScript](../aulas/08-classes-e-javascript.md)</sub>
<details><summary>Ver resposta</summary>

`private` do TypeScript é aplicado pelo compilador e normalmente não impõe acesso privado em runtime. `#campo` é uma construção JavaScript com checagem runtime. A interoperabilidade com JS sem checagem difere entre eles.

</details>

**16. Por que `implements` não protege uma classe de entrada inválida?**
<sub>Aula [08 — Classes e compatibilidade com JavaScript](../aulas/08-classes-e-javascript.md)</sub>
<details><summary>Ver resposta</summary>

`implements` verifica estaticamente os membros da instância contra uma interface. Interfaces não existem como validadores runtime; valores externos precisam ser validados por lógica que realmente os inspecione.

</details>

### Aula 09 — [Módulos e arquivos de declaração](../aulas/09-modulos-e-declaracoes.md)

**17. Por que caminhos `paths` podem compilar e falhar ao executar?**
<sub>Aula [09 — Módulos e arquivos de declaração](../aulas/09-modulos-e-declaracoes.md)</sub>
<details><summary>Ver resposta</summary>

`paths` orienta a resolução do TypeScript, mas não reescreve necessariamente os imports emitidos. Bundler ou runtime precisa saber resolver o mesmo alias.

</details>

**18. Por que uma declaração `.d.ts` incorreta é perigosa?**
<sub>Aula [09 — Módulos e arquivos de declaração](../aulas/09-modulos-e-declaracoes.md)</sub>
<details><summary>Ver resposta</summary>

O compilador confia que a declaração descreve a implementação. Se ela estiver errada ou desatualizada, o código pode passar na checagem e falhar em execução porque o arquivo de tipos não implementa a API.

</details>

### Aula 10 — [`tsconfig`, segurança de tipos e runtime](../aulas/10-tsconfig-seguranca-e-runtime.md)

**19. Por que `strict` não torna TypeScript totalmente seguro?**
<sub>Aula [10 — `tsconfig`, segurança de tipos e runtime](../aulas/10-tsconfig-seguranca-e-runtime.md)</sub>
<details><summary>Ver resposta</summary>

`strict` aumenta a cobertura das verificações estáticas, mas escapes como `any` e asserções, declarações incorretas e dados externos continuam fora de uma garantia completa. Também não executa validação runtime.

</details>

**20. Por que `target` e `lib` não instalam recursos no runtime?**
<sub>Aula [10 — `tsconfig`, segurança de tipos e runtime](../aulas/10-tsconfig-seguranca-e-runtime.md)</sub>
<details><summary>Ver resposta</summary>

`target` orienta a forma da saída JavaScript e `lib` informa ao verificador quais declarações de APIs considerar. Nenhuma das opções adiciona por si só a implementação de uma API ao ambiente que executa o programa.

</details>
