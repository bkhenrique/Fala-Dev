# Aula 07 — Controle de fluxo e erros

> **Objetivo:** usar estruturas de controle e exceções distinguindo erros lançados de valores falsy ou resultados inválidos.

---

## 1. Decisões e curto-circuito

`if`, `switch` e o operador condicional `? :` escolhem caminhos. `&&`, `||` e `??` são operadores de curto-circuito e retornam um dos operandos, não necessariamente um booleano. `||` usa a regra de truthiness; `??` só usa o valor alternativo quando o operando é `null` ou `undefined`.

```js
const limite = configuracao.limite ?? 10; // preserva 0
```

## 2. Laços

`for`, `while` e `do...while` repetem código. `break` encerra o laço; `continue` avança para a próxima repetição. `for...of` percorre valores iteráveis. `for...in` percorre chaves enumeráveis e costuma ser usado para propriedades de objetos, não elementos de array.

## 3. Exceções

`throw` interrompe o fluxo normal e propaga um valor até um `catch` compatível. Prefira lançar instâncias de `Error` (ou subclasses) para manter mensagem e rastreamento de pilha. `try...catch...finally` trata uma exceção ou garante a execução da seção `finally` ao sair do bloco.

Capturar e ignorar um erro esconde falhas. Trate aquilo que a camada consegue resolver; quando for necessário propagar, preserve contexto sem apagar a causa original.

## 4. Exceção não é validação

Entrada fora do formato esperado pode ser tratada como resultado inválido ou erro, conforme o contrato da operação. Exceções são adequadas para falhas excepcionais de execução e são usadas também por APIs da linguagem. Validação explícita é mais clara para condições esperadas, como um campo obrigatório ausente.

## 5. Como falar na entrevista

**“Qual a diferença entre `||` e `??`?”**
> “Os dois fazem curto-circuito, mas `||` escolhe o lado direito para qualquer valor falsy, como `0` e string vazia. `??` só faz isso para `null` ou `undefined`, então é melhor quando zero ou string vazia são valores válidos.”

## 6. Resumo

- Operadores lógicos retornam operandos e aplicam curto-circuito.
- `??` trata somente `null` e `undefined`; `||` trata qualquer falsy.
- `for...of` percorre valores; `for...in`, propriedades enumeráveis.
- `throw` propaga uma exceção; use `Error` para diagnóstico.
- `finally` roda ao deixar o bloco, inclusive quando há exceção ou `return`.

## Termos desta aula
Curto-circuito · truthiness · `??` · `||` · `break` · `continue` · exceção · `throw` · `Error` · `catch` · `finally` · validação

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 07** e separadas por nível.

### Para aprofundar
[Controle de fluxo e tratamento de erros — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) · [Nullish coalescing — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
