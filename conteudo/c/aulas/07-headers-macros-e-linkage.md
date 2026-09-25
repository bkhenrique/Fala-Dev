# Aula 07 — Headers, macros e linkage

> **Objetivo:** organizar declarações em múltiplas unidades de tradução sem confundir pré-processamento com linguagem de tipos.

---

## 1. Headers

Headers declaram interfaces compartilhadas entre arquivos: tipos, macros e protótipos. Include guards ou `#pragma once` (extensão amplamente implementada, mas não diretiva ISO C) evitam inclusão repetida dentro de uma unidade de tradução. Headers devem ser incluídos por consumidores da própria interface e declarar apenas o necessário.

## 2. Macros

O pré-processador substitui macros antes da tradução C. Macros de função não têm checagem de tipo e podem avaliar argumentos mais de uma vez. Parênteses protegem precedência em substituições, mas macros continuam sujeitas a efeitos colaterais e captura inesperada de nomes.

Use `const`, funções `static inline` e enumerações quando oferecerem melhor escopo ou checagem de tipos. Diretivas condicionais também selecionam código por plataforma ou configuração, mas aumentam combinações possíveis de build.

## 3. Declaração e definição

Uma declaração apresenta tipo/nome; uma definição cria a entidade ou fornece corpo/armazenamento conforme o caso. Variáveis globais normalmente devem ter uma definição em um `.c` e declarações `extern` em header. Definições de função em headers precisam de linkage e estratégia apropriados, como `static inline` para funções internas a cada unidade.

## 4. Linkage

Linkage interno restringe nome à unidade de tradução; `static` em função/objeto de escopo de arquivo é um meio comum. Linkage externo permite referenciar uma entidade definida em outra unidade. Variáveis locais `static` têm duração estática, embora seu nome tenha escopo de bloco — contexto importa.

## 5. Como falar na entrevista

**“Por que não definir uma variável global comum num header?”**
> “Cada unidade que inclui o header pode acabar com uma definição, levando a múltiplas definições no link. Ponho a definição num único `.c` e declaro `extern` no header compartilhado.”

## 6. Resumo

- Headers compartilham declarações; include guard evita repetição.
- Macros atuam no pré-processador sem checagem normal de tipo.
- Declaração e definição têm papéis diferentes.
- Linkage interno/externo controla identidade entre unidades.
- `static` de escopo de arquivo e `static` local têm efeitos distintos.

## Termos desta aula
Header · include guard · macro · pré-processador · declaração · definição · unidade de tradução · linkage interno · linkage externo · `extern` · `static inline`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 07** e separadas por nível.

### Para aprofundar
[WG14 N1570 — diretivas e linkage](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) · [WG14 — padrões](https://www.open-std.org/jtc1/sc22/wg14/www/standards)
