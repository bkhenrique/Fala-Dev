# C — perguntas, nível 3: Como você faria?

_Cenários reais: junte conceitos e explique suas decisões._

**Regra:** responda **em voz alta** antes de abrir a resposta.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Padrão C, tradução e linking](../aulas/01-padrao-traducao-e-linking.md)

**1. Seu código compila em GCC, mas falha em outro compilador por uma extensão. Como proceder?**
<sub>Aula [01 — Padrão C, tradução e linking](../aulas/01-padrao-traducao-e-linking.md)</sub>
<details><summary>Ver resposta</summary>

Identifico a extensão e decido se é requisito do produto. Se for, isolo-a e ofereço alternativa ou declaro a toolchain; para portabilidade, substituo por recurso padronizado e configuro o padrão de linguagem explicitamente.

</details>

### Aula 02 — [Tipos, conversões e comportamento indefinido](../aulas/02-tipos-conversoes-e-ub.md)

**2. Uma soma de `int` ocasionalmente vira número negativo inesperado. O que investiga?**
<sub>Aula [02 — Tipos, conversões e comportamento indefinido](../aulas/02-tipos-conversoes-e-ub.md)</sub>
<details><summary>Ver resposta</summary>

Verifico limites e overflow antes da operação; overflow signed é UB e não há garantia de wraparound. Escolho tipo/faixa adequados, valido entrada e uso verificações de overflow explícitas.

</details>

### Aula 03 — [Ponteiros, arrays e strings](../aulas/03-ponteiros-arrays-e-strings.md)

**3. Uma função recebe ponteiro e comprimento para processar buffer. Quais invariantes documenta?**
<sub>Aula [03 — Ponteiros, arrays e strings](../aulas/03-ponteiros-arrays-e-strings.md)</sub>
<details><summary>Ver resposta</summary>

Defino se ponteiro pode ser nulo, quantos elementos/bytes são válidos, se o tamanho inclui terminador, quem possui memória e se a função pode modificá-la. A função valida consistência antes de acessar índices.

</details>

### Aula 04 — [Funções, escopo e duração de objetos](../aulas/04-funcoes-escopo-e-duracao.md)

**4. Uma API retorna ponteiro para um buffer temporário local. Como redesenha?**
<sub>Aula [04 — Funções, escopo e duração de objetos](../aulas/04-funcoes-escopo-e-duracao.md)</sub>
<details><summary>Ver resposta</summary>

O buffer automático deixa de existir ao retornar. Posso receber buffer e capacidade do chamador, retornar estrutura por valor quando viável ou alocar dinamicamente e documentar que o chamador deve liberar.

</details>

### Aula 05 — [`struct`, `union` e `enum`](../aulas/05-struct-union-e-enum.md)

**5. Precisa serializar uma struct em protocolo de rede binário. O que faria?**
<sub>Aula [05 — `struct`, `union` e `enum`](../aulas/05-struct-union-e-enum.md)</sub>
<details><summary>Ver resposta</summary>

Não gravaria sua memória diretamente como protocolo, por causa de padding, alinhamento, endianness e representação. Serializaria cada campo com largura, ordem de bytes e formato explicitamente definidos.

</details>

### Aula 06 — [Alocação dinâmica e propriedade de memória](../aulas/06-alocacao-e-propriedade.md)

**6. Um vetor dinâmico cresce com `realloc`, mas às vezes perde os dados após falha. Como corrige?**
<sub>Aula [06 — Alocação dinâmica e propriedade de memória](../aulas/06-alocacao-e-propriedade.md)</sub>
<details><summary>Ver resposta</summary>

Guardo o retorno de `realloc` num ponteiro temporário. Se for `NULL` para tamanho não zero, mantenho o ponteiro e bloco antigos; se tiver sucesso, atualizo o dono. Também verifico overflow no cálculo da capacidade em bytes.

</details>

### Aula 07 — [Headers, macros e linkage](../aulas/07-headers-macros-e-linkage.md)

**7. O linker relata múltiplas definições de uma variável declarada num header. Como organiza?**
<sub>Aula [07 — Headers, macros e linkage](../aulas/07-headers-macros-e-linkage.md)</sub>
<details><summary>Ver resposta</summary>

Deixo uma única definição num arquivo `.c`; no header publico uma declaração `extern`. As unidades incluem a declaração e o linker conecta as referências à definição única.

</details>

### Aula 08 — [Biblioteca padrão, I/O e erros](../aulas/08-biblioteca-io-e-erros.md)

**8. Uma entrada pode superar o tamanho do buffer e tem de preservar a linha toda. Como trata?**
<sub>Aula [08 — Biblioteca padrão, I/O e erros](../aulas/08-biblioteca-io-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

Leio com limite usando `fgets`, detecto ausência de newline antes do fim do buffer e então acumulo mais dados ou rejeito/dreno o restante conforme o contrato. Nunca assumo que uma chamada capturou a linha inteira.

</details>

### Aula 09 — [Segurança de memória e depuração](../aulas/09-seguranca-de-memoria-e-depuracao.md)

**9. Ocorre corrupção rara em produção, mas não em debug. Qual abordagem de investigação?**
<sub>Aula [09 — Segurança de memória e depuração](../aulas/09-seguranca-de-memoria-e-depuracao.md)</sub>
<details><summary>Ver resposta</summary>

Procuro UB, limites, lifetime e dados não inicializados. Reproduzo com warnings rigorosos, sanitizers, testes de entrada de fronteira e símbolos; diferenças de otimização podem revelar UB, não provam que o compilador é culpado.

</details>

### Aula 10 — [Concorrência e atomics](../aulas/10-concorrencia-e-atomics.md)

**10. Duas threads atualizam vários campos que formam um único estado consistente. Como sincroniza?**
<sub>Aula [10 — Concorrência e atomics](../aulas/10-concorrencia-e-atomics.md)</sub>
<details><summary>Ver resposta</summary>

Protejo a invariante composta com mutex/seção crítica ou desenho um protocolo atômico cuidadosamente demonstrado. `volatile` e atomics isolados por campo não garantem que leitores observem uma combinação consistente.

</details>
