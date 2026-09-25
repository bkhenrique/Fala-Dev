# Aula 10 — `tsconfig`, segurança de tipos e runtime

> **Objetivo:** escolher opções do compilador e explicar os limites de segurança do sistema de tipos.

---

## 1. O projeto TypeScript

`tsconfig.json` declara opções e arquivos de um projeto TypeScript. `target` influencia o JavaScript emitido; `module` influencia o formato dos módulos emitidos; `lib` controla declarações de APIs padrão que o verificador conhece. Essas opções descrevem compilação e ambiente esperado, mas não instalam APIs nem alteram automaticamente o runtime.

Um arquivo pode ser compilado por diferentes pipelines. Confira qual ferramenta efetivamente emite o JavaScript e qual executa a checagem de tipos; algumas ferramentas de velocidade removem tipos sem fazer a checagem completa do `tsc`.

## 2. `strict`

`strict` ativa um grupo de verificações estritas do compilador. Opções como `strictNullChecks` e `noImplicitAny` evitam classes importantes de omissões. O conjunto de verificações melhora a análise estática, mas não faz o sistema se tornar uma prova matemática sem exceções nem verifica dados externos.

Ao ativar strictness em uma base existente, trate erros gradualmente e corrija contratos na origem. Acrescentar `as any` para silenciar mensagens remove a análise naquele caminho em vez de resolver a incompatibilidade.

## 3. Limites do sistema

TypeScript usa compatibilidade estrutural e permite algumas operações não totalmente seguras por razões de compatibilidade com padrões JavaScript. `any`, asserções, declarações incorretas e fronteiras de código não tipado podem contornar a checagem.

Até um tipo aparentemente preciso pode não refletir uma resposta HTTP real: tipos desaparecem antes da execução. Valide o dado externo com verificações explícitas ou uma biblioteca de validação que execute em runtime, e só então trate-o como o tipo validado.

## 4. `as` e `satisfies`

`as Tipo` diz ao compilador para tratar uma expressão como aquele tipo, após as verificações de compatibilidade que a linguagem permite. Não converte o valor nem comprova a afirmação. O operador `satisfies` verifica compatibilidade da expressão com um contrato e preserva mais detalhes do tipo inferido; também é somente estático.

Use ambos para expressar intenções verificáveis, não para substituir uma validação ou silenciar erro sem entender sua causa.

## 5. Como falar na entrevista

**“TypeScript é totalmente type-safe?”**
> “Ele detecta muitas incompatibilidades estaticamente, sobretudo com opções estritas, mas não é totalmente sound e não valida dados em runtime. `any`, asserções, tipos externos incorretos e entradas não validadas são fronteiras que ainda preciso tratar.”

## 6. Resumo

- `tsconfig` define como o compilador checa e emite; não instala recursos de runtime.
- `strict` ativa um conjunto de verificações, incluindo importantes controles de nulidade e `any` implícito.
- O sistema é estrutural e permite escapes como `any` e asserções.
- Tipos não validam respostas HTTP, JSON, arquivos ou mensagens em runtime.
- `as` e `satisfies` não convertem nem validam valores durante a execução.

## Termos desta aula
`tsconfig.json` · `target` · `module` · `lib` · `strict` · `strictNullChecks` · soundness · asserção · `satisfies` · validação runtime

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 10** e separadas por nível.

### Para aprofundar
[TSConfig Reference](https://www.typescriptlang.org/tsconfig/) · [Type Compatibility: Soundness](https://www.typescriptlang.org/docs/handbook/type-compatibility.html#a-note-on-soundness) · [TypeScript 4.9: `satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator)
