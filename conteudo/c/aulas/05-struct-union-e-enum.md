# Aula 05 — `struct`, `union` e `enum`

> **Objetivo:** modelar dados compostos e reconhecer layout e regras de representação que não são portáveis por suposição.

---

## 1. `struct`

`struct` agrupa membros nomeados em um tipo. A implementação pode inserir padding entre membros ou ao final para satisfazer alinhamento; `sizeof(struct)` pode exceder a soma dos tamanhos dos membros. Ordem dos membros é preservada, mas não se deve assumir layout binário universal entre compiladores/ABIs.

Campos de bits permitem especificar larguras, mas alocação, ordem e alinhamento têm aspectos dependentes da implementação. Não são substituto automático para um formato de rede/arquivo explicitamente serializado.

## 2. `union`

Membros de uma union compartilham armazenamento. Em geral, no máximo um membro contém o valor ativo pretendido; ler outro membro que não seja o último escrito tem regras delicadas e pode depender do caso/padrão. Para representar variantes portáveis, acompanhe o membro ativo com um discriminante e respeite as regras de tipo efetivo e representação.

## 3. `enum`

Enumeração nomeia constantes inteiras. Em C, enumeradores têm valores inteiros e o tipo compatível de enumeração é escolhido pela implementação segundo o padrão; não é uma union segura com validação automática de que o valor é um dos enumeradores.

## 4. `typedef`

`typedef` cria um nome alternativo para um tipo existente, não um tipo distinto. Pode melhorar legibilidade, mas aliases de ponteiros e arrays podem esconder níveis de indireção; use nomes claros e revele a estrutura quando isso facilitar revisão.

## 5. Como falar na entrevista

**“Posso gravar uma struct diretamente num arquivo e ler em outro computador?”**
> “Não devo assumir que o layout seja portátil: padding, alinhamento, endianness e representação podem variar. Defino um formato serializado com campos e ordem de bytes explícitos.”

## 6. Resumo

- `struct` agrupa membros e pode incluir padding e alinhamento.
- Layout de struct não é formato universal de arquivo ou rede.
- `union` compartilha armazenamento e exige controle consciente da variante ativa.
- `enum` nomeia valores inteiros, sem validar automaticamente entradas externas.
- `typedef` cria alias, não tipo nominal distinto.

## Termos desta aula
`struct` · membro · padding · alinhamento · campo de bits · `union` · variante ativa · `enum` · enumerador · `typedef`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 05** e separadas por nível.

### Para aprofundar
[WG14 N1570 — tipos estruturados](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
