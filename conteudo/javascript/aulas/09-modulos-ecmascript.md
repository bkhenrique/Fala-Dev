# Aula 09 — Módulos ECMAScript

> **Objetivo:** usar `import` e `export` para dividir código e explicar o escopo e a ligação entre módulos.

---

## 1. Por que módulos

Módulos dividem um programa em arquivos com dependências e APIs explícitas. Um módulo exporta declarações que outros módulos podem importar. Isso torna a relação entre partes do sistema visível e evita depender de variáveis globais compartilhadas.

## 2. Exportações e importações

Um módulo pode ter exportações nomeadas e, opcionalmente, uma exportação padrão. As exportações nomeadas podem ser importadas por nome ou renomeadas; `import * as` agrupa exportações em um namespace.

```js
// calculo.js
export function somar(a, b) {
  return a + b;
}

// app.js
import { somar } from "./calculo.js";
```

As declarações `import` e `export` estáticas ficam no nível superior do módulo. `import()` é uma forma dinâmica que retorna uma Promise com o módulo carregado.

## 3. Escopo e ligações

Cada módulo tem seu próprio escopo. As importações são ligações ao vivo (*live bindings*): o importador observa o valor exportado atualizado conforme as regras do módulo, em vez de receber uma cópia independente da variável. Importar um módulo também avalia suas dependências conforme o grafo de módulos.

## 4. Especificação e resolução de arquivos

ECMAScript define módulos e suas ligações, mas a resolução de especificadores como `"./calculo.js"` e a busca dos arquivos dependem do host. Navegadores normalmente usam URLs; Node.js tem regras próprias de resolução e configuração de módulos. Formatos CommonJS e ECMAScript Modules são sistemas distintos, mesmo que Node possa interoperar entre eles sob condições documentadas.

Extensão de arquivo, configuração do projeto e modo de carregamento devem ser coerentes com o ambiente. `import` em um browser não significa que o browser resolva automaticamente pacotes npm como um bundler.

## 5. Como falar na entrevista

**“O que os módulos resolvem?”**
> “Eles organizam um programa em arquivos com dependências e exportações explícitas, cada um com escopo próprio. No ECMAScript Modules, importações são ligações vivas. A especificação define a semântica do módulo, enquanto a resolução do caminho depende do host e da ferramenta usada.”

## 6. Resumo

- Módulos fornecem escopo próprio e APIs explícitas via `export`/`import`.
- Há exportações nomeadas, padrão, namespace e importação dinâmica.
- Importações estáticas são declarações de nível superior; `import()` retorna Promise.
- Importações são ligações vivas segundo a semântica ESM.
- Resolução de arquivos e interoperabilidade com CommonJS dependem do ambiente.

## Termos desta aula
Módulo ECMAScript · exportação nomeada · exportação padrão · importação estática · `import()` · ligação viva · grafo de módulos · resolução · CommonJS · ESM

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 09** e separadas por nível.

### Para aprofundar
[JavaScript modules — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) · [Modules — ECMAScript](https://tc39.es/ecma262/#sec-modules)
