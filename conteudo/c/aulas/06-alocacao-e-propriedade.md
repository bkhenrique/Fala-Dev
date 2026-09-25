# Aula 06 — Alocação dinâmica e propriedade de memória

> **Objetivo:** gerenciar memória dinâmica e definir claramente quem mantém e libera cada alocação.

---

## 1. Alocação dinâmica

`malloc`, `calloc` e `realloc` estão em `<stdlib.h>`. `malloc` reserva bytes sem inicializá-los; `calloc` reserva um array e inicializa os bytes a zero; `realloc` tenta redimensionar uma alocação preservando conteúdo até o menor dos tamanhos antigos e novos. O retorno precisa ser verificado.

Em C, o ponteiro retornado por `malloc` pode ser convertido implicitamente para tipo de objeto adequado; não é necessário cast em C. Multiplicações usadas para calcular tamanho devem ser verificadas para evitar overflow antes da alocação.

## 2. `free` e ciclo de vida

Cada alocação bem-sucedida deve ter uma liberação correspondente quando deixa de ser usada. `free(NULL)` não faz nada; liberar ponteiro não retornado por alocador compatível, liberar duas vezes ou acessar após `free` é inválido e pode ser UB. Depois de liberar, invalide/reorganize os aliases para evitar uso posterior.

## 3. `realloc` com segurança

Se `realloc` falhar para tamanho não zero, retorna `NULL` e a alocação antiga continua válida. Guardar diretamente o resultado na única variável pode perder o endereço antigo e vazar memória. Use um temporário, verifique sucesso e só então atualize o ponteiro proprietário.

## 4. Propriedade como contrato

C não tem destrutor automático. Defina em cada API quem aloca, quem libera, se a função transfere propriedade e por quanto tempo ponteiros emprestados continuam válidos. Documente tamanho/capacidade e tratamento de erro junto com o contrato.

## 5. Como falar na entrevista

**“Como evitar vazamento e double free em C?”**
> “Defino um dono por alocação e contratos explícitos de transferência/empréstimo. Cada caminho de erro libera o que já adquiriu; ponho a lógica de cleanup num caminho comum e nunca uso ponteiro após liberar.”

## 6. Resumo

- Verifique falhas de `malloc`, `calloc` e `realloc`.
- Memória de `malloc` não é inicializada; `calloc` zera bytes.
- Falha de `realloc` com tamanho não zero mantém a alocação anterior.
- `free` exige ponteiro compatível e deve acontecer uma única vez por alocação.
- Contratos de propriedade substituem gerenciamento automático ausente na linguagem.

## Termos desta aula
Heap · alocação dinâmica · `malloc` · `calloc` · `realloc` · `free` · vazamento · use-after-free · double free · propriedade

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 06** e separadas por nível.

### Para aprofundar
[WG14 N1570 — gerenciamento de memória](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) · [`malloc`/`free` — biblioteca padrão C](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
