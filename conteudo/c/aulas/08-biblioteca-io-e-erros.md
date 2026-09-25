# Aula 08 — Biblioteca padrão, I/O e erros

> **Objetivo:** usar interfaces padrão para I/O e comunicar falhas sem confundir sentinelas, estado de erro e mensagens.

---

## 1. Biblioteca padrão

Headers como `<stdio.h>`, `<stdlib.h>`, `<string.h>`, `<stdint.h>` e `<errno.h>` declaram partes da biblioteca padrão. Incluir um header torna declarações disponíveis; não garante que funções específicas de POSIX ou de um sistema operacional façam parte do ISO C.

## 2. I/O com streams

`FILE *` representa stream de I/O. `fopen` pode falhar e retornar nulo; `fclose` também pode reportar falha, por exemplo ao descarregar saída buffered. `fgets` lê até limite/término de linha/EOF e reserva espaço para o NUL, mas o chamador deve distinguir linha completa, truncada e fim do arquivo.

Ao ler números com `scanf`, valide o valor de retorno e o formato; para entradas não confiáveis, ler uma linha e converter com funções que verificam faixa e fim de conversão tende a permitir tratamento mais cuidadoso.

## 3. Códigos de erro

Funções podem sinalizar erro com retorno especial, `errno`, parâmetro de saída ou outro contrato documentado. `errno` só deve ser consultado quando a função indica falha, e nem toda falha define valor significativo de `errno`. Não presuma que uma mensagem de erro específica seja portátil.

## 4. Limites e strings

Funções de string que não recebem capacidade podem escrever além do buffer se o chamador não controlar tamanho. Mantenha capacidade junto do ponteiro e valide limites antes de copiar/formatar; truncamento também deve ser tratado como decisão explícita.

## 5. Como falar na entrevista

**“Como ler uma linha sem ultrapassar o buffer?”**
> “Uso `fgets` com a capacidade real do buffer, detecto se a linha terminou ou foi truncada e removo a quebra de linha somente quando presente. Se a entrada for maior, dreno ou acumulo o restante conforme o contrato.”

## 6. Resumo

- ISO C e APIs de sistema como POSIX são conjuntos distintos.
- Sempre confira os contratos e valores de retorno das funções de I/O.
- `fgets` limita a escrita, mas exige tratamento de linha truncada e EOF.
- Consulte `errno` apenas quando o contrato da função indicar falha relevante.
- Passe capacidade e trate truncamento em operações sobre buffers.

## Termos desta aula
Biblioteca padrão · header · `FILE` · stream · `fopen` · `fgets` · EOF · `errno` · capacidade · truncamento · POSIX

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 08** e separadas por nível.

### Para aprofundar
[WG14 N1570 — biblioteca C](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) · [POSIX Base Specifications](https://pubs.opengroup.org/onlinepubs/9799919799/)
