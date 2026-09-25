# Aula 01 — O papel do TypeScript e o fluxo de compilação

> **Objetivo:** explicar o que TypeScript acrescenta ao JavaScript e separar checagem estática, emissão de código e execução.

---

## 1. O problema

Em JavaScript, muitas incompatibilidades só aparecem quando o caminho do código é executado: uma função recebe um valor de formato inesperado, uma propriedade não existe ou uma refatoração deixa uma chamada inconsistente. Em projetos grandes, essas relações entre módulos e dados ficam difíceis de manter só pela leitura.

TypeScript permite descrever essas relações e verifica boa parte delas antes da execução. A ferramenta analisa o programa e aponta usos incompatíveis segundo o sistema de tipos configurado.

## 2. Linguagem e sistema de tipos

TypeScript é uma linguagem de programação baseada em JavaScript que acrescenta sintaxe de tipos e recursos associados. A documentação oficial o descreve como um verificador estático de tipos para programas JavaScript. O código TypeScript normalmente é transformado em JavaScript para execução por um host compatível.

Uma anotação como `: string` informa ao verificador o tipo esperado. Ela não cria uma verificação automática do valor em tempo de execução:

```ts
function saudar(nome: string): string {
  return `Olá, ${nome}`;
}
```

Se dados vierem de uma requisição HTTP, arquivo, banco ou mensagem, ainda é necessário validar a estrutura real em runtime. O tipo documenta e checa o código estático; não prova que o dado externo obedece ao contrato.

## 3. Checar e emitir são etapas diferentes

O compilador `tsc` pode fazer checagem de tipos e emitir JavaScript conforme as opções do projeto. `noEmit` permite checar sem gravar arquivos. Bundlers e outras ferramentas também podem transformar sintaxe TypeScript, mas nem todo transpiler faz a mesma checagem de tipos que o `tsc`.

Tipos como `interface`, anotações e aliases não existem no JavaScript emitido como verificações runtime. Outros recursos da sintaxe TypeScript podem exigir transformação em JavaScript, dependendo do recurso e das opções. Portanto, “transpilar” e “verificar tipos” não são sinônimos.

## 4. Compatibilidade com JavaScript

TypeScript foi desenhado para trabalhar com programas e bibliotecas JavaScript. Código JavaScript pode ser migrado gradualmente, e tipos podem ser inferidos sem anotações explícitas em muitos casos. A compatibilidade não significa que todo arquivo `.js` e `.ts` seja intercambiável sem configuração: opções do compilador, módulos, dependências e recursos usados afetam o resultado.

## 5. Como falar na entrevista

**“TypeScript impede erros em produção?”**
> “Ele detecta antes da execução várias incompatibilidades que o sistema de tipos consegue modelar, mas não garante ausência de erros. Os tipos são apagados ou transformados no JavaScript emitido e não validam dados externos em runtime. Para esses dados, valido o formato na fronteira do sistema.”

## 6. Resumo

- TypeScript acrescenta checagem estática e sintaxe de tipos a programas JavaScript.
- O verificador analisa tipos antes da execução; tipos não são validação runtime.
- `tsc` pode checar e emitir JavaScript; ferramentas diferentes podem apenas transformar sintaxe.
- Compatibilidade com JavaScript facilita migração, sujeita às opções e aos recursos usados.
- Dados externos continuam exigindo validação em runtime.

## Termos desta aula
TypeScript · JavaScript · checagem estática · compilador · transpiler · emissão · apagamento de tipos · runtime · validação

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 01** e separadas por nível.

### Para aprofundar
[TypeScript Handbook — introdução](https://www.typescriptlang.org/docs/handbook/intro.html) · [TypeScript para programadores JavaScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
