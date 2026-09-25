# Aula 01 — Padrão C, tradução e linking

> **Objetivo:** distinguir a linguagem C, o padrão ISO, o compilador e as etapas comuns de construção de um executável.

---

## 1. Linguagem e padrões

C é uma linguagem definida por padrões ISO/IEC 9899. C17, C23 e versões anteriores têm diferenças; um recurso só é portátil para projetos que o suportam quando o padrão adotado e as implementações-alvo o oferecem. Extensões de GCC, Clang ou MSVC não são automaticamente parte do padrão.

O padrão descreve uma máquina abstrata e requisitos observáveis, não uma implementação específica de CPU, sistema operacional ou compilador. C pode ser usado em ambientes hospedados com biblioteca e sistema operacional, ou ambientes freestanding com recursos diferentes.

## 2. Etapas de construção comuns

Uma toolchain costuma processar diretivas do pré-processador, traduzir cada unidade de tradução, produzir objetos e vinculá-los com outras unidades e bibliotecas. Os nomes e arquivos intermediários variam por ferramenta; o padrão descreve fases de tradução, não exige um comando ou formato de objeto específico.

## 3. Cabeçalho e unidade de tradução

Uma unidade de tradução resulta do processamento de um arquivo-fonte junto com headers incluídos. Declarações precisam estar visíveis onde os nomes são usados; definições externas compatíveis podem ser ligadas entre unidades. Erros podem aparecer na compilação de cada unidade ou no linker.

## 4. Portabilidade

Tipos inteiros podem ter larguras e representações diferentes conforme implementação e padrão. Use tipos de largura exata de `<stdint.h>` somente quando a implementação os fornece; para formato externo, serialize explicitamente em vez de gravar structs diretamente e assumir layout universal.

## 5. Como falar na entrevista

**“C é compilada?”**
> “C é padronizada como linguagem; toolchains normalmente traduzem unidades para objetos e fazem linking. O padrão define fases e comportamento observável, não exige um compilador, sistema ou formato de executável específico.”

## 6. Resumo

- O padrão ISO define C; compiladores e sistemas implementam ou estendem esse padrão.
- C hosted e freestanding têm requisitos de ambiente diferentes.
- Compilação por unidade e linking são etapas usuais, com detalhes dependentes da toolchain.
- O padrão não garante tamanho ou layout idêntico para todos os tipos em toda plataforma.
- Extensão de compilador não é automaticamente C portátil.

## Termos desta aula
C · ISO C · padrão · implementação · extensão · hosted · freestanding · unidade de tradução · objeto · linker · portabilidade

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 01** e separadas por nível.

### Para aprofundar
[WG14 — padrões C](https://www.open-std.org/jtc1/sc22/wg14/www/standards) · [WG14 N1570 — draft público de C11](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
