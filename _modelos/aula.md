# Modelo — aula

Salve em `conteudo/<trilha>/aulas/` com o próximo prefixo numérico: `13-nome-da-aula.md` (minúsculas, hífen, sem acento). Depois adicione a aula na lista do `README.md` da trilha.

Regras:
- É **teoria**: o que é, por que existe, como funciona por dentro e como falar sobre. Tutorial passo a passo não entra.
- Explique como se fosse pra um amigo, mas sem fugir do termo técnico: apresente o termo e explique.
- Se o conceito é geral (vale pra qualquer linguagem), ele mora em `fundamentos/`. Aqui entra a parte da stack, e dá pra linkar o conceito.
- Nenhum arquivo passa de 500 linhas. Se passar, divida em duas aulas.

```markdown
# Aula NN — Título da aula

> **Objetivo:** o que a pessoa vai saber explicar ao final.

---

## 1. O problema

Por que isso existe. Que dor resolve. O porquê vem antes do como.

## 2. O conceito

Definição, analogia, diagrama ou código curto. Quantas seções forem precisas.

## N. Como falar na entrevista

**"Pergunta típica?"**
> "Resposta modelo, com o vocabulário técnico, pra treinar em voz alta."

## N+1. Resumo

- Os pontos que não podem faltar, em bullets curtos.

## Termos desta aula
termo · outro termo · mais um

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula NN** e separadas por nível.
```
