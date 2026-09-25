# Aula 09 — Módulos e arquivos de declaração

> **Objetivo:** relacionar imports TypeScript, módulos JavaScript emitidos e declarações de tipo de dependências.

---

## 1. Imports e exports

TypeScript usa `import` e `export` para descrever dependências e APIs de módulos. O sistema de módulos TypeScript se integra aos módulos JavaScript, mas o compilador também usa a configuração do projeto para resolver arquivos e entender o formato esperado pelo ambiente.

`import type` e `export type` marcam dependências usadas apenas como tipos. Elas podem ser removidas da saída JavaScript, conforme as opções de compilação, porque não representam valores que precisam existir em runtime.

## 2. Resolução de módulos

O TypeScript precisa localizar arquivos de implementação e tipos durante a checagem. A opção `moduleResolution` escolhe regras compatíveis com o ambiente de destino, como Node.js ou bundlers. O modo de resolução deve refletir como o código será executado; uma importação aceita pelo verificador ainda pode falhar se o caminho não existir em runtime.

`paths` no `tsconfig` pode criar aliases para o compilador, mas não reescreve automaticamente os caminhos no JavaScript emitido. O runtime ou o bundler precisa ter configuração correspondente quando o alias for usado na execução.

## 3. Arquivos `.d.ts`

Arquivos de declaração `.d.ts` descrevem tipos e formas de APIs JavaScript sem implementar essas APIs. Pacotes podem distribuir declarações próprias; tipos de terceiros também podem vir de pacotes de definições como `@types`.

Uma declaração descreve o que o compilador deve acreditar existir. Se estiver incorreta ou desatualizada, o TypeScript pode aceitar código que falha ao executar. Declarações não criam a implementação ausente.

## 4. Ambient declarations e augmentação

Declarações `declare` descrevem valores ou módulos fornecidos externamente. Augmentação pode ampliar tipos de módulos existentes, mas deve corresponder a uma extensão real feita em runtime; adicionar apenas uma declaração não adiciona a propriedade ao objeto JavaScript.

## 5. Como falar na entrevista

**“Um alias `paths` garante que o import funcione no runtime?”**
> “Não. `paths` orienta a resolução do TypeScript durante a checagem. A ferramenta de build ou o runtime também precisa entender o alias, ou o import emitido não será resolvido.”

## 6. Resumo

- Imports/exports de valores participam do grafo JavaScript; imports type-only representam dependências estáticas.
- Resolução de módulos deve corresponder ao ambiente que executa o código.
- `paths` configura resolução do compilador, não necessariamente do runtime.
- `.d.ts` descreve tipos de uma implementação, mas não a implementa.
- Augmentação de tipo só é correta se o comportamento correspondente existir em runtime.

## Termos desta aula
Módulo · `import type` · `export type` · `moduleResolution` · `paths` · arquivo de declaração · `.d.ts` · ambient declaration · augmentação

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 09** e separadas por nível.

### Para aprofundar
[Modules: Theory](https://www.typescriptlang.org/docs/handbook/modules/theory.html) · [Type Declarations](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html) · [Modules reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html)
