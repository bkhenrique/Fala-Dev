# C — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os trade-offs._

**Regra:** responda **em voz alta** antes de abrir a resposta.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Padrão C, tradução e linking](../aulas/01-padrao-traducao-e-linking.md)

**1. Por que uma extensão do compilador pode reduzir portabilidade?**
<sub>Aula [01 — Padrão C, tradução e linking](../aulas/01-padrao-traducao-e-linking.md)</sub>
<details><summary>Ver resposta</summary>

Outro compilador pode não implementar a extensão. Para código portátil, fico nas regras do padrão comum às implementações-alvo ou isolo extensões atrás de configuração e alternativa compatível.

</details>

**2. Por que erro de linking pode ocorrer após compilar cada arquivo sem erro?**
<sub>Aula [01 — Padrão C, tradução e linking](../aulas/01-padrao-traducao-e-linking.md)</sub>
<details><summary>Ver resposta</summary>

Cada unidade pode compilar isoladamente, mas faltar uma definição externa ou haver símbolos duplicados/incompatíveis na etapa de link. Declarações visíveis não garantem que a definição necessária exista.

</details>

### Aula 02 — [Tipos, conversões e comportamento indefinido](../aulas/02-tipos-conversoes-e-ub.md)

**3. Por que não depender de wraparound em overflow de inteiro com sinal?**
<sub>Aula [02 — Tipos, conversões e comportamento indefinido](../aulas/02-tipos-conversoes-e-ub.md)</sub>
<details><summary>Ver resposta</summary>

Overflow de inteiro com sinal é UB em C; o padrão não promete wraparound. O compilador pode otimizar supondo que isso não ocorre. Se aritmética modular é desejada, avalio tipo sem sinal e ainda valido o domínio.

</details>

**4. Por que `sizeof` não significa sempre quantidade de bits dividida por oito?**
<sub>Aula [02 — Tipos, conversões e comportamento indefinido](../aulas/02-tipos-conversoes-e-ub.md)</sub>
<details><summary>Ver resposta</summary>

`sizeof` mede bytes C, e um byte tem `CHAR_BIT` bits; o padrão não exige `CHAR_BIT == 8`. Protocolos externos devem expressar largura em bits/bytes conforme contrato, não pelo palpite da plataforma.

</details>

### Aula 03 — [Ponteiros, arrays e strings](../aulas/03-ponteiros-arrays-e-strings.md)

**5. Por que a função que recebe `int itens[]` também precisa receber tamanho?**
<sub>Aula [03 — Ponteiros, arrays e strings](../aulas/03-ponteiros-arrays-e-strings.md)</sub>
<details><summary>Ver resposta</summary>

Parâmetro array é ajustado para ponteiro; o ponteiro não carrega o comprimento. Um parâmetro de tamanho/capacidade define os limites válidos para o chamador e a função.

</details>

**6. Por que `int **` não substitui automaticamente `int matriz[][N]`?**
<sub>Aula [03 — Ponteiros, arrays e strings](../aulas/03-ponteiros-arrays-e-strings.md)</sub>
<details><summary>Ver resposta</summary>

Array de arrays tem layout contíguo e tipo de ponteiro para array interno; `int **` aponta para ponteiros a `int`, que podem apontar para linhas separadas. Os layouts e tipos são diferentes.

</details>

### Aula 04 — [Funções, escopo e duração de objetos](../aulas/04-funcoes-escopo-e-duracao.md)

**7. Por que escopo e duração de armazenamento não são a mesma coisa?**
<sub>Aula [04 — Funções, escopo e duração de objetos](../aulas/04-funcoes-escopo-e-duracao.md)</sub>
<details><summary>Ver resposta</summary>

Escopo descreve onde o nome pode ser usado no código; duração descreve quando o objeto existe. Uma variável local `static` tem escopo de bloco, mas duração estática.

</details>

**8. Por que `const` num ponteiro não torna imutável o objeto em todas as referências?**
<sub>Aula [04 — Funções, escopo e duração de objetos](../aulas/04-funcoes-escopo-e-duracao.md)</sub>
<details><summary>Ver resposta</summary>

`const` qualifica o acesso por uma expressão específica; outra referência não-const válida pode ainda modificar o objeto. Também não protege transitivamente objetos alcançados por ponteiros internos.

</details>

### Aula 05 — [`struct`, `union` e `enum`](../aulas/05-struct-union-e-enum.md)

**9. Por que `sizeof(struct)` pode exceder a soma dos membros?**
<sub>Aula [05 — `struct`, `union` e `enum`](../aulas/05-struct-union-e-enum.md)</sub>
<details><summary>Ver resposta</summary>

O compilador pode inserir padding entre membros e ao final para atender requisitos de alinhamento. O tamanho e layout não são um formato binário universal.

</details>

**10. Por que uma union com várias variantes precisa de um discriminante?**
<sub>Aula [05 — `struct`, `union` e `enum`](../aulas/05-struct-union-e-enum.md)</sub>
<details><summary>Ver resposta</summary>

Os membros compartilham armazenamento. Um campo discriminante permite à aplicação saber qual variante foi armazenada e interpretar os bytes segundo o tipo correto, sujeito às regras do padrão.

</details>

### Aula 06 — [Alocação dinâmica e propriedade de memória](../aulas/06-alocacao-e-propriedade.md)

**11. Por que usar um ponteiro temporário com `realloc`?**
<sub>Aula [06 — Alocação dinâmica e propriedade de memória](../aulas/06-alocacao-e-propriedade.md)</sub>
<details><summary>Ver resposta</summary>

Se `realloc` falhar para tamanho não zero, retorna `NULL` sem liberar o bloco antigo. Guardar diretamente no ponteiro proprietário perderia o endereço antigo e causaria vazamento.

</details>

**12. Por que o cálculo de tamanho precisa ser verificado antes de `malloc`?**
<sub>Aula [06 — Alocação dinâmica e propriedade de memória](../aulas/06-alocacao-e-propriedade.md)</sub>
<details><summary>Ver resposta</summary>

Uma multiplicação como `quantidade * sizeof(T)` pode exceder o tipo usado e produzir tamanho menor que o necessário. Verifico overflow antes de alocar para não criar buffer insuficiente.

</details>

### Aula 07 — [Headers, macros e linkage](../aulas/07-headers-macros-e-linkage.md)

**13. Por que uma macro de função pode avaliar argumento mais de uma vez?**
<sub>Aula [07 — Headers, macros e linkage](../aulas/07-headers-macros-e-linkage.md)</sub>
<details><summary>Ver resposta</summary>

O pré-processador substitui texto: cada ocorrência do parâmetro na macro repete o argumento. Se a expressão tem efeito colateral, ele pode ocorrer várias vezes; uma função real avalia o argumento uma vez na chamada.

</details>

**14. Por que colocar uma definição global num header gera erro de múltiplas definições?**
<sub>Aula [07 — Headers, macros e linkage](../aulas/07-headers-macros-e-linkage.md)</sub>
<details><summary>Ver resposta</summary>

Cada unidade que inclui o header pode produzir uma definição externa. Ponho a definição em um único arquivo-fonte e exponho uma declaração `extern` pelo header.

</details>

### Aula 08 — [Biblioteca padrão, I/O e erros](../aulas/08-biblioteca-io-e-erros.md)

**15. Por que `fgets` é preferível a leitura sem limite de uma string?**
<sub>Aula [08 — Biblioteca padrão, I/O e erros](../aulas/08-biblioteca-io-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

Recebe a capacidade do buffer e limita quantos caracteres lê, incluindo espaço para NUL. Ainda é preciso detectar linha truncada e continuar o tratamento conforme a entrada.

</details>

**16. Por que `errno` não deve ser lido depois de qualquer chamada?**
<sub>Aula [08 — Biblioteca padrão, I/O e erros](../aulas/08-biblioteca-io-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

Só tem significado quando a função indica falha e documenta seu uso. Um sucesso pode deixar valor antigo em `errno`, que não descreve a chamada recém-feita.

</details>

### Aula 09 — [Segurança de memória e depuração](../aulas/09-seguranca-de-memoria-e-depuracao.md)

**17. Por que warnings e sanitizers juntos são melhores que um só?**
<sub>Aula [09 — Segurança de memória e depuração](../aulas/09-seguranca-de-memoria-e-depuracao.md)</sub>
<details><summary>Ver resposta</summary>

Warnings analisam construções do código; sanitizers detectam certas falhas nos caminhos executados e instrumentados. Cada um cobre classes diferentes, e nenhum prova sozinho correção completa.

</details>

**18. Por que memória não inicializada é perigosa?**
<sub>Aula [09 — Segurança de memória e depuração](../aulas/09-seguranca-de-memoria-e-depuracao.md)</sub>
<details><summary>Ver resposta</summary>

Ler valor indeterminado pode ter comportamento indefinido ou produzir dado imprevisível conforme tipo e contexto. Inicialização explícita e verificações de fluxo evitam depender de conteúdo residual.

</details>

### Aula 10 — [Concorrência e atomics](../aulas/10-concorrencia-e-atomics.md)

**19. Por que `volatile` não é mecanismo de sincronização?**
<sub>Aula [10 — Concorrência e atomics](../aulas/10-concorrencia-e-atomics.md)</sub>
<details><summary>Ver resposta</summary>

Não estabelece atomicidade nem relação happens-before entre threads. O compilador e hardware precisam de operações atômicas ou locks para sincronizar acessos concorrentes.

</details>

**20. Quando um mutex pode ser mais adequado que vários atomics?**
<sub>Aula [10 — Concorrência e atomics](../aulas/10-concorrencia-e-atomics.md)</sub>
<details><summary>Ver resposta</summary>

Quando uma invariante envolve vários campos ou etapas que precisam ser observados juntos. Um lock protege a seção crítica inteira; atomics individuais não tornam automaticamente composto o estado consistente.

</details>
