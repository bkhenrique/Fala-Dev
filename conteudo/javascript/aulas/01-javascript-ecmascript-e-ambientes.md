# Aula 01 — JavaScript, ECMAScript e ambientes de execução

> **Objetivo:** distinguir JavaScript, o padrão ECMAScript e as APIs que cada ambiente hospedeiro oferece.

---

## 1. Linguagem e padrão

JavaScript é uma linguagem de programação padronizada principalmente pela especificação **ECMAScript**, mantida pela Ecma International com participação da comunidade técnica. A especificação define sintaxe, tipos, operadores, objetos padrão, funções, módulos e o comportamento das construções da linguagem.

O nome **ECMAScript** identifica o padrão; **JavaScript** é o nome pelo qual a linguagem é conhecida e implementada por engines. Não são duas linguagens concorrentes. Recursos novos são propostos e, quando aprovados no processo do TC39, entram nas edições da especificação.

## 2. A linguagem não é o ambiente

A especificação não define todas as capacidades disponíveis a um programa. O ambiente hospedeiro (*host*) integra a linguagem com o sistema onde ela roda:

- Navegadores oferecem APIs Web, como DOM, `fetch`, temporizadores e armazenamento web.
- Node.js oferece APIs de sistema e servidor, como arquivos, processos e rede.
- Outros hosts podem fornecer APIs diferentes.

`Promise`, `Map` e `Array` fazem parte dos objetos padrão definidos pela linguagem. `document` é uma API do navegador; `process` e `node:fs` pertencem ao ambiente Node.js. Essa distinção evita atribuir ao JavaScript funcionalidades que vêm do host.

## 3. Engines e compatibilidade

Uma **engine** implementa a linguagem e executa o código. V8, SpiderMonkey e JavaScriptCore são engines usadas em diferentes produtos. Uma engine não é, por si só, um runtime completo: um runtime combina uma engine com APIs do host e outros componentes.

O mesmo código pode depender de recursos de linguagem e de APIs do host. Para portabilidade, identifique ambos os requisitos e confira se a versão de cada ambiente os suporta. Transpiladores podem converter sintaxe nova em sintaxe mais antiga, mas não fornecem automaticamente APIs ausentes.

## 4. Modos de código

JavaScript pode ser analisado como script ou como módulo ECMAScript. Módulos têm escopo próprio e usam `import`/`export`; scripts clássicos seguem regras diferentes para escopo global. Ambientes também podem definir como arquivos são identificados e carregados.

O modo estrito é aplicado automaticamente a módulos. Em scripts, pode ser ativado com diretiva no início do código:

```js
"use strict";

function atualizar() {
  // O modo estrito evita alguns comportamentos legados permissivos.
}
```

## 5. Como falar na entrevista

**“JavaScript e Node.js são a mesma coisa?”**
> “Não. JavaScript é a linguagem, padronizada pelo ECMAScript. Node.js é um ambiente de execução que usa uma engine JavaScript e fornece APIs próprias de sistema. O navegador também executa JavaScript, mas oferece APIs diferentes, como o DOM.”

## 6. Resumo

- ECMAScript especifica a linguagem e seus objetos padrão; JavaScript é seu nome de uso comum.
- Navegador e Node.js são hosts que integram a linguagem com APIs específicas.
- Engine executa a linguagem; runtime inclui engine e recursos do ambiente.
- Uma API disponível em um host pode não existir em outro.
- Módulo ECMAScript e script clássico têm regras distintas.

## Termos desta aula
JavaScript · ECMAScript · TC39 · host · engine · runtime · API Web · módulo · modo estrito

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 01** e separadas por nível.

### Para aprofundar
[ECMAScript Language Specification](https://tc39.es/ecma262/) · [JavaScript Guide — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction)
