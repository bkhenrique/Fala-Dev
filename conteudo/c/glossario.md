# C — glossário

Cada termo tem três partes: **Em uma frase** (definição), **Traduzindo** (explicação simples) e **Como falar** (frase para treinar).

É material de revisão: a explicação completa está nas [aulas](README.md).

---

### Unidade de tradução
- **Em uma frase:** fonte C após processamento do pré-processador e dos headers incluídos.
- **Traduzindo:** a unidade que o compilador traduz antes do linking.
- **Como falar:** “Várias unidades de tradução podem se conectar por declarações e linkage.”

### Comportamento indefinido
- **Em uma frase:** operação para a qual o padrão não impõe requisitos.
- **Traduzindo:** o programa não pode assumir um resultado específico e portátil.
- **Como falar:** “Signed overflow e acesso fora do array podem ser UB.”

### Decaimento de array
- **Em uma frase:** conversão de expressão array para ponteiro ao primeiro elemento em muitos contextos.
- **Traduzindo:** array pode agir como endereço, mas não é o mesmo tipo que ponteiro.
- **Como falar:** “`sizeof array` não mede o ponteiro porque ali não há decaimento.”

### String C
- **Em uma frase:** sequência de caracteres terminada por NUL em memória acessível.
- **Traduzindo:** funções percorrem até `\0`, não conhecem a capacidade do buffer.
- **Como falar:** “Reservo também o byte do terminador e passo capacidade.”

### Duração de armazenamento
- **Em uma frase:** período durante o qual um objeto existe.
- **Traduzindo:** define quando o endereço ainda designa objeto vivo.
- **Como falar:** “Retornar ponteiro para local automático deixa referência pendente.”

### Linkage
- **Em uma frase:** determina se declarações em escopos/unidades diferentes referem-se à mesma entidade.
- **Traduzindo:** conecta ou restringe o nome entre arquivos.
- **Como falar:** “`static` em escopo de arquivo dá linkage interno.”

### Padding
- **Em uma frase:** bytes inseridos pela implementação para alinhamento em tipos compostos.
- **Traduzindo:** tamanho em memória pode superar os campos visíveis.
- **Como falar:** “Não serializo struct crua como formato de rede portátil.”

### Propriedade da memória
- **Em uma frase:** contrato sobre quem deve liberar uma alocação e quando.
- **Traduzindo:** C exige que o programa gerencie ciclo de vida explicitamente.
- **Como falar:** “Defino um proprietário e regras claras de transferência e empréstimo.”

### Data race
- **Em uma frase:** acessos conflitantes sem sincronização adequada, ao menos um deles escrita.
- **Traduzindo:** duas threads acessam estado com conflito sem relação de ordem.
- **Como falar:** “Data race em C causa comportamento indefinido.”

### `volatile`
- **Em uma frase:** qualificador que afeta otimizações de certos acessos observáveis.
- **Traduzindo:** não transforma variável em atômica ou protegida por lock.
- **Como falar:** “Uso atomics ou mutex para sincronização entre threads; não `volatile`.”
