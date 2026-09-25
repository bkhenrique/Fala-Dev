# Aula 02 — Tipos, conversões e comportamento indefinido

> **Objetivo:** explicar tipos escalares, conversões e por que certas operações em C não têm resultado definido pelo padrão.

---

## 1. Tipos e representações

C define tipos inteiros, floating-point, ponteiros, arrays, structs, unions, enums e tipos derivados. Largura e representação de alguns tipos dependem da implementação. `<stdint.h>` oferece tipos exatos opcionais como `int32_t` e tipos de largura mínima como `int_least32_t`.

## 2. Conversões

Em expressões, tipos inteiros menores passam por promoções inteiras; conversões aritméticas usuais determinam um tipo comum para operandos. Uma conversão para tipo mais estreito pode perder informação ou produzir resultado dependente das regras e da versão. Use tipos e limites explicitamente ao processar entradas.

`sizeof` retorna tamanho em bytes de tipo ou objeto; `sizeof(char)` é 1 por definição, mas um byte C não precisa ter oito bits. `CHAR_BIT` informa o número de bits de um byte na implementação.

## 3. Comportamento indefinido

Comportamento indefinido (UB) é uma situação para a qual o padrão não impõe requisitos. Exemplos incluem acessar fora dos limites de array, usar ponteiro inválido ou signed integer overflow. Não é correto presumir que UB “sempre falha” ou se comporta igual em debug e release; o compilador pode otimizar com base na ausência de UB.

## 4. Comportamento definido pela implementação

Alguns aspectos são deixados ao compilador/documentação da implementação, e outros são não especificados entre alternativas permitidas. Isso é diferente de UB: há um comportamento permitido documentado ou um conjunto de escolhas válidas. Código portátil deve consultar a categoria relevante no padrão e evitar depender de suposições.

## 5. Como falar na entrevista

**“O que acontece com overflow de `int` com sinal?”**
> “Overflow de inteiro com sinal é comportamento indefinido em C; não devo esperar wraparound portátil. Para aritmética de módulo, uso tipo sem sinal conscientemente e verifico limites de domínio.”

## 6. Resumo

- Largura e representação de tipos podem depender da implementação.
- Conversões e promoções afetam o tipo e o valor de expressões.
- `sizeof(char)` é 1 byte C; `CHAR_BIT` pode variar.
- UB não define resultado, e otimizações podem explorar essa premissa.
- Definido pela implementação e não especificado não são sinônimos de UB.

## Termos desta aula
Tipo escalar · tipo inteiro · conversão · promoção inteira · `sizeof` · byte · `CHAR_BIT` · UB · implementação-defined · não especificado

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 02** e separadas por nível.

### Para aprofundar
[WG14 N1570 — tipos e expressões](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) · [WG14: padrões](https://www.open-std.org/jtc1/sc22/wg14/www/standards)
