# Aula 04 — Funções, escopo e duração de objetos

> **Objetivo:** distinguir escopo, linkage e duração de armazenamento e explicar o que permanece válido após uma chamada.

---

## 1. Escopo e linkage

Escopo determina a região do código em que um identificador pode ser usado. Linkage determina se declarações do mesmo identificador em diferentes escopos ou unidades de tradução referem-se à mesma entidade. Duração de armazenamento determina por quanto tempo o objeto existe.

Esses conceitos são separados: variável local pode ter duração automática; variável local `static` tem duração estática; identificador `extern` pode declarar entidade com linkage externo.

## 2. Funções e parâmetros

C passa argumentos por valor. Para permitir que uma função altere o objeto do chamador, passe um ponteiro válido. Parâmetros de array são ajustados para ponteiro, portanto tamanho e capacidade costumam fazer parte de parâmetros separados.

Protótipos declaram tipos de parâmetros e retorno. Um protótipo visível permite ao compilador verificar chamadas; definições incompatíveis entre unidades podem causar erro de diagnóstico, e violações que escapem ao compilador não se tornam seguras.

## 3. Duração de armazenamento

Objetos automáticos locais existem durante a execução do bloco associado. Retornar o endereço de um objeto automático local deixa um ponteiro inválido após o retorno. Objetos de duração estática existem durante a execução do programa; objetos alocados dinamicamente existem até desalocação ou término conforme regras da implementação.

## 4. `const` e `static`

`const` limita modificações por meio de uma expressão com esse tipo qualificado; não implica armazenamento somente leitura nem garante imutabilidade profunda de objetos apontados. `static` muda duração ou linkage conforme o local da declaração; seu significado depende do contexto.

## 5. Como falar na entrevista

**“Por que não retornar o endereço de uma variável local?”**
> “O objeto automático deixa de existir quando a função retorna. O ponteiro então não designa um objeto vivo, e usá-lo é comportamento indefinido. Posso retornar por valor, receber armazenamento do chamador ou alocar com propriedade definida.”

## 6. Resumo

- Escopo, linkage e duração de armazenamento são conceitos diferentes.
- C passa parâmetros por valor; ponteiros permitem acessar objeto externo.
- Parâmetro de array vira ponteiro e não carrega tamanho.
- Endereço de variável automática local não sobrevive ao retorno.
- `const` não torna transitivamente imutável o objeto apontado.

## Termos desta aula
Escopo · linkage · duração automática · duração estática · `extern` · `static` · protótipo · parâmetro por valor · `const`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 04** e separadas por nível.

### Para aprofundar
[WG14 N1570 — declaradores e duração](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
