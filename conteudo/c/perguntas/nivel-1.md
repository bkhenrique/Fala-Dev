# C — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Padrão C, tradução e linking](../aulas/01-padrao-traducao-e-linking.md)

**1. O que define o padrão ISO C?**
<sub>Aula [01 — Padrão C, tradução e linking](../aulas/01-padrao-traducao-e-linking.md)</sub>
<details><summary>Ver resposta</summary>

Define requisitos da linguagem e biblioteca padrão, incluindo sintaxe e comportamento observável; não especifica uma CPU, sistema operacional ou compilador único.

</details>

**2. O que é uma unidade de tradução?**
<sub>Aula [01 — Padrão C, tradução e linking](../aulas/01-padrao-traducao-e-linking.md)</sub>
<details><summary>Ver resposta</summary>

É o resultado do processamento de um arquivo-fonte e das diretivas de pré-processamento, incluindo os headers, antes das etapas posteriores de tradução.

</details>

### Aula 02 — [Tipos, conversões e comportamento indefinido](../aulas/02-tipos-conversoes-e-ub.md)

**3. O que é comportamento indefinido?**
<sub>Aula [02 — Tipos, conversões e comportamento indefinido](../aulas/02-tipos-conversoes-e-ub.md)</sub>
<details><summary>Ver resposta</summary>

Uma situação para a qual o padrão C não impõe requisitos. O programa não pode assumir um resultado portátil ou previsível para essa execução.

</details>

**4. O que `sizeof` retorna?**
<sub>Aula [02 — Tipos, conversões e comportamento indefinido](../aulas/02-tipos-conversoes-e-ub.md)</sub>
<details><summary>Ver resposta</summary>

O tamanho em bytes C do tipo ou objeto. `sizeof(char)` é 1, mas o número de bits por byte é informado por `CHAR_BIT` e não precisa ser oito.

</details>

### Aula 03 — [Ponteiros, arrays e strings](../aulas/03-ponteiros-arrays-e-strings.md)

**5. O que significa decaimento de array?**
<sub>Aula [03 — Ponteiros, arrays e strings](../aulas/03-ponteiros-arrays-e-strings.md)</sub>
<details><summary>Ver resposta</summary>

Em muitas expressões, uma expressão de tipo array é convertida para ponteiro ao primeiro elemento. Há exceções importantes como `sizeof` e o operador `&` aplicado diretamente ao array.

</details>

**6. Como uma string C termina?**
<sub>Aula [03 — Ponteiros, arrays e strings](../aulas/03-ponteiros-arrays-e-strings.md)</sub>
<details><summary>Ver resposta</summary>

Com um caractere nulo `\0`. A capacidade do buffer não informa por si só o comprimento da string; funções de string percorrem até esse terminador.

</details>

### Aula 04 — [Funções, escopo e duração de objetos](../aulas/04-funcoes-escopo-e-duracao.md)

**7. O que é duração de armazenamento?**
<sub>Aula [04 — Funções, escopo e duração de objetos](../aulas/04-funcoes-escopo-e-duracao.md)</sub>
<details><summary>Ver resposta</summary>

É o período durante o qual o objeto existe. C distingue, entre outras, duração automática, estática, de thread e alocada.

</details>

**8. O que acontece com o endereço de uma variável automática local após o retorno da função?**
<sub>Aula [04 — Funções, escopo e duração de objetos](../aulas/04-funcoes-escopo-e-duracao.md)</sub>
<details><summary>Ver resposta</summary>

O objeto deixa de existir quando termina seu tempo de vida. Usar o ponteiro que apontava para ele depois disso é inválido e pode causar comportamento indefinido.

</details>

### Aula 05 — [`struct`, `union` e `enum`](../aulas/05-struct-union-e-enum.md)

**9. Para que serve `struct`?**
<sub>Aula [05 — `struct`, `union` e `enum`](../aulas/05-struct-union-e-enum.md)</sub>
<details><summary>Ver resposta</summary>

Agrupa membros nomeados em um tipo composto. A implementação pode inserir padding para alinhamento.

</details>

**10. O que `typedef` faz?**
<sub>Aula [05 — `struct`, `union` e `enum`](../aulas/05-struct-union-e-enum.md)</sub>
<details><summary>Ver resposta</summary>

Declara um alias para um tipo existente; não cria por si só um tipo nominal distinto.

</details>

### Aula 06 — [Alocação dinâmica e propriedade de memória](../aulas/06-alocacao-e-propriedade.md)

**11. Qual a diferença entre `malloc` e `calloc`?**
<sub>Aula [06 — Alocação dinâmica e propriedade de memória](../aulas/06-alocacao-e-propriedade.md)</sub>
<details><summary>Ver resposta</summary>

`malloc` reserva uma quantidade de bytes sem inicializá-los; `calloc` reserva espaço para uma quantidade de elementos e inicializa os bytes alocados a zero.

</details>

**12. O que acontece se `realloc` falha para tamanho não zero?**
<sub>Aula [06 — Alocação dinâmica e propriedade de memória](../aulas/06-alocacao-e-propriedade.md)</sub>
<details><summary>Ver resposta</summary>

Retorna `NULL` e a alocação original continua válida. O chamador deve preservar o ponteiro antigo até verificar o resultado.

</details>

### Aula 07 — [Headers, macros e linkage](../aulas/07-headers-macros-e-linkage.md)

**13. Para que serve um include guard?**
<sub>Aula [07 — Headers, macros e linkage](../aulas/07-headers-macros-e-linkage.md)</sub>
<details><summary>Ver resposta</summary>

Evita que o conteúdo de um header seja processado repetidamente na mesma unidade de tradução, prevenindo redefinições decorrentes de inclusões múltiplas.

</details>

**14. O que é linkage interno?**
<sub>Aula [07 — Headers, macros e linkage](../aulas/07-headers-macros-e-linkage.md)</sub>
<details><summary>Ver resposta</summary>

É o linkage pelo qual identificadores de escopo de arquivo, frequentemente declarados `static`, designam entidades limitadas àquela unidade de tradução.

</details>

### Aula 08 — [Biblioteca padrão, I/O e erros](../aulas/08-biblioteca-io-e-erros.md)

**15. O que `FILE *` representa?**
<sub>Aula [08 — Biblioteca padrão, I/O e erros](../aulas/08-biblioteca-io-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

Um ponteiro para objeto de stream definido pela biblioteca padrão, usado por funções de I/O como `fopen`, `fgets` e `fclose`.

</details>

**16. Quando se deve consultar `errno`?**
<sub>Aula [08 — Biblioteca padrão, I/O e erros](../aulas/08-biblioteca-io-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

Quando o contrato da função indica falha e define que `errno` contém informação útil. Seu valor não é necessariamente significativo após sucesso ou para qualquer função.

</details>

### Aula 09 — [Segurança de memória e depuração](../aulas/09-seguranca-de-memoria-e-depuracao.md)

**17. O que um sanitizer faz?**
<sub>Aula [09 — Segurança de memória e depuração](../aulas/09-seguranca-de-memoria-e-depuracao.md)</sub>
<details><summary>Ver resposta</summary>

Instrumenta ou analisa o programa para detectar certas classes de problemas durante execução/teste, como muitos acessos inválidos à memória. Não prova a ausência de todos os erros.

</details>

**18. O que é use-after-free?**
<sub>Aula [09 — Segurança de memória e depuração](../aulas/09-seguranca-de-memoria-e-depuracao.md)</sub>
<details><summary>Ver resposta</summary>

Usar memória por um ponteiro depois que o objeto alocado deixou de existir ou foi liberado. O uso é inválido e pode causar UB.

</details>

### Aula 10 — [Concorrência e atomics](../aulas/10-concorrencia-e-atomics.md)

**19. `volatile` torna uma operação atômica?**
<sub>Aula [10 — Concorrência e atomics](../aulas/10-concorrencia-e-atomics.md)</sub>
<details><summary>Ver resposta</summary>

Não. `volatile` não fornece atomicidade nem sincronização entre threads; atomics ou mecanismos de lock são necessários conforme o contrato.

</details>

**20. O que é uma data race em C?**
<sub>Aula [10 — Concorrência e atomics](../aulas/10-concorrencia-e-atomics.md)</sub>
<details><summary>Ver resposta</summary>

Acessos conflitantes não atômicos ao mesmo objeto por threads sem ordenação adequada, com pelo menos uma escrita. No modelo de memória C, isso causa comportamento indefinido.

</details>
