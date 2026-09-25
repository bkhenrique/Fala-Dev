# Aula 06 — Módulos, npm e gerenciamento de dependências

> **Objetivo:** explicar como o Node organiza código em módulos (CommonJS vs ES Modules), como o npm funciona, o que é o `package.json`, o *lockfile* e o versionamento semântico.

---

## 1. O que é um módulo

Um **módulo** é um arquivo (ou pacote) que isola seu código e **exporta** só o que quer mostrar pros outros. Tudo que não é exportado é **privado** daquele arquivo.

Por que isso importa:
- **Encapsulamento**: evita variáveis globais se pisando.
- **Reuso**: importa o mesmo módulo em vários lugares.
- **Organização**: cada arquivo com uma responsabilidade.

No Node existem **dois sistemas de módulos**.

---

## 2. CommonJS (CJS): o sistema original

```js
// soma.js
function soma(a, b) { return a + b; }
module.exports = { soma };

// app.js
const { soma } = require('./soma');
```

Características:
- **`require`** é uma função comum, **síncrona**: lê e executa o arquivo na hora.
- Pode ser chamado em qualquer lugar (dentro de `if`, de função), ou seja, é **dinâmico**.
- **Cache**: a primeira vez que um módulo é carregado, o resultado fica em cache. `require` do mesmo arquivo de novo devolve o **mesmo objeto**. Por isso um módulo funciona como um *singleton* natural.
- Tem variáveis automáticas: `__dirname`, `__filename`, `module`, `exports`.

---

## 3. ES Modules (ESM): o padrão oficial do JavaScript

```js
// soma.mjs  (ou .js com "type": "module" no package.json)
export function soma(a, b) { return a + b; }
export default soma;

// app.mjs
import { soma } from './soma.js';
```

Características:
- É o padrão da **linguagem** (ECMAScript), igual no navegador e no Node.
- `import`/`export` são **estáticos**: ficam no topo do arquivo, e a estrutura é analisada **antes** de executar.
- Isso permite **tree shaking**: ferramentas de build removem o código exportado que ninguém importa.
- Carregamento é **assíncrono** por natureza.
- Suporta **top-level await** (`await` fora de função, direto no arquivo).
- Pra importação dinâmica: `const mod = await import('./x.js')`.
- Não tem `__dirname` nativo (usa `import.meta.url` ou, no Node moderno, `import.meta.dirname`).

### Como o Node decide qual usar
- Arquivo `.mjs` → ESM. Arquivo `.cjs` → CommonJS.
- Arquivo `.js` → depende do campo **`"type"`** do `package.json` mais próximo: `"module"` = ESM; ausente ou `"commonjs"` = CJS.

### Resumo da comparação

| | CommonJS | ES Modules |
|---|---|---|
| Sintaxe | `require` / `module.exports` | `import` / `export` |
| Carregamento | Síncrono, em tempo de execução | Estático, analisado antes, assíncrono |
| Tree shaking | Difícil | Sim |
| Top-level await | Não | Sim |
| Onde é padrão | Node legado | Linguagem JS (browser + Node moderno) |

Como falar:
> "CommonJS é o sistema original do Node, com require síncrono e dinâmico. ESM é o padrão da linguagem, com imports estáticos, o que permite tree shaking e top-level await. Projetos novos tendem a ir de ESM, mas ainda convivemos com CommonJS por causa do legado e de bibliotecas antigas."

---

## 4. npm e o `package.json`

**npm** (*Node Package Manager*) é o gerenciador de pacotes padrão do Node. Alternativas: **yarn**, **pnpm**, **bun**.

O **`package.json`** é a "identidade" do projeto:

```json
{
  "name": "minha-api",
  "version": "1.2.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "build": "tsc",
    "test": "node --test"
  },
  "dependencies": {
    "express": "^4.19.2"
  },
  "devDependencies": {
    "typescript": "~5.4.0"
  },
  "engines": { "node": ">=20" }
}
```

- **`dependencies`**: o que a aplicação precisa pra **rodar em produção**.
- **`devDependencies`**: só pra **desenvolver** (TypeScript, testes, linter). Em produção dá pra instalar sem elas (`npm ci --omit=dev`).
- **`scripts`**: comandos do projeto (`npm run dev`).
- **`engines`**: versão de Node suportada.

---

## 5. Versionamento Semântico (SemVer)

Versão no formato **`MAJOR.MINOR.PATCH`**, ex: `4.19.2`.

| Parte | Quando muda | Exemplo |
|---|---|---|
| **MAJOR** | Mudança que **quebra** compatibilidade (*breaking change*) | 4.x → 5.0.0 |
| **MINOR** | Funcionalidade nova, **compatível** | 4.19 → 4.20 |
| **PATCH** | Correção de bug, compatível | 4.19.2 → 4.19.3 |

Os símbolos no `package.json`:
- **`^4.19.2`** (caret): aceita MINOR e PATCH novos → `>=4.19.2 <5.0.0`. É o padrão do npm.
- **`~4.19.2`** (tilde): aceita só PATCH → `>=4.19.2 <4.20.0`.
- **`4.19.2`**: exatamente essa.

---

## 6. Lockfile: `package-lock.json`

O `package.json` diz "aceito qualquer 4.x". Mas qual **exatamente** foi instalada? E as dependências das dependências (**dependências transitivas**)?

O **lockfile** (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) registra a **árvore exata** de versões instaladas.

Por que commitar o lockfile:
- **Builds reproduzíveis** (*deterministic builds*): todo mundo e o CI instalam exatamente a mesma coisa.
- Evita o "na minha máquina funciona".

`npm install` vs `npm ci`:
- **`npm install`**: pode atualizar o lockfile.
- **`npm ci`**: instala **exatamente** o lockfile, apaga o `node_modules` antes, falha se o lockfile estiver dessincronizado. É o certo pra **CI e produção**.

---

## 7. Segurança da cadeia de dependências

Um projeto Node comum tem centenas de dependências transitivas. Isso é um risco de **supply chain** (cadeia de suprimentos): se um pacote for comprometido, seu projeto também é.

Boas práticas:
- `npm audit` pra checar vulnerabilidades conhecidas.
- Dependabot/Renovate pra atualizar com PR.
- Commitar lockfile e usar `npm ci`.
- Desconfiar de pacote com pouquíssimos downloads ou nome parecido com um famoso (*typosquatting*).

---

## 8. Como falar na entrevista

**"Pra que serve o package-lock.json?"**
> "Ele trava a árvore exata de dependências, incluindo as transitivas. O package.json define faixas de versão via semver, como o caret que aceita minor e patch; o lockfile garante que todo mundo e o pipeline instalem exatamente as mesmas versões. No CI eu uso `npm ci`, que instala fielmente o lockfile e falha se estiver inconsistente."

---

## 9. Resumo

- **CommonJS**: `require`, síncrono, dinâmico, com cache.
- **ESM**: `import`, estático, tree shaking, top-level await; padrão da linguagem.
- `"type": "module"` decide o que `.js` significa.
- **dependencies** (produção) vs **devDependencies** (desenvolvimento).
- **SemVer**: MAJOR quebra, MINOR adiciona, PATCH corrige. `^` aceita minor, `~` só patch.
- **Lockfile** = build reproduzível. **`npm ci`** no CI.
- Dependências são risco de **supply chain**.

## Termos desta aula
módulo · CommonJS · ES Modules · require · import/export · tree shaking · top-level await · dynamic import · npm · package.json · dependencies · devDependencies · semver · breaking change · caret · tilde · lockfile · dependência transitiva · build reproduzível · npm ci · supply chain · typosquatting

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 06** e separadas por nível.
