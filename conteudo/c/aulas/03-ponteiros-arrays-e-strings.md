# Aula 03 — Ponteiros, arrays e strings

> **Objetivo:** distinguir arrays e ponteiros, acompanhar aritmética de ponteiros e compreender strings terminadas em NUL.

---

## 1. Array e ponteiro não são o mesmo tipo

Array reserva sequência de elementos contíguos. Em muitas expressões, o nome do array converte-se em ponteiro para o primeiro elemento; isso não ocorre em todos os contextos, como `sizeof array` e `&array`. Um parâmetro declarado como array em função é ajustado para parâmetro ponteiro, então o tamanho precisa ser passado separadamente.

```c
void processar(int itens[], size_t quantidade);
```

Esse parâmetro não carrega o comprimento do array. O chamador e a função precisam concordar sobre o limite válido.

## 2. Ponteiros

Ponteiro guarda endereço de objeto ou função conforme seu tipo e uso. `&objeto` obtém endereço; `*ponteiro` acessa o objeto apontado quando o ponteiro é válido. Ponteiro nulo representa ausência de endereço válido para objeto. Desreferenciar ponteiro nulo, indeterminado ou fora do tempo de vida do objeto é inválido e pode ser UB.

Aritmética de ponteiro é definida dentro do mesmo array, incluindo um elemento após o último para comparação/iteração, mas esse ponteiro “one past” não pode ser desreferenciado. Não se deve usar aritmética como se ponteiros fossem inteiros portáteis.

## 3. Arrays multidimensionais

Array multidimensional é array de arrays; layout e cálculo de índices decorrem do tipo. Um `int matriz[linhas][colunas]` não é o mesmo tipo que `int **`. Quando uma função recebe matriz, dimensões internas ou um ponteiro para array precisam estar no contrato.

## 4. Strings C

String C é sequência de `char` terminada por `\0`; sua capacidade alocada não informa o comprimento textual. Funções como `strlen` percorrem até o terminador e exigem que ele exista dentro de memória acessível. Espaço para texto de N caracteres precisa incluir o terminador.

## 5. Como falar na entrevista

**“Array e ponteiro são equivalentes em C?”**
> “Não. Array é objeto que contém elementos; em muitas expressões decai para ponteiro ao primeiro elemento, mas `sizeof` e `&` mostram diferenças. Parâmetros de array são ajustados para ponteiro e não carregam o comprimento.”

## 6. Resumo

- Array contém elementos; ponteiro guarda endereço.
- Conversão de array para ponteiro ocorre em muitas, não todas, as expressões.
- Aritmética de ponteiro só tem regras dentro do mesmo array; one-past não é desreferenciável.
- Array multidimensional não é `T **`.
- String C precisa de terminador NUL e espaço válido até ele.

## Termos desta aula
Array · decaimento · ponteiro · desreferência · ponteiro nulo · one-past · array multidimensional · string C · terminador NUL

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 03** e separadas por nível.

### Para aprofundar
[WG14 N1570 — arrays, ponteiros e strings](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
