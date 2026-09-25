# Aula 02 — Objetos, tipos e mutabilidade

> **Objetivo:** explicar nomes, objetos, identidade, mutabilidade e vinculação de argumentos em chamadas Python.

---

## 1. Nomes e objetos

Nomes são vinculados a objetos; uma variável não é uma caixa que mantém um tipo fixo. `b = a` vincula outro nome ao mesmo objeto, sem cloná-lo:

```python
a = [1, 2]
b = a
b.append(3)  # a também observa [1, 2, 3]
```

`is` compara identidade; `==` pede igualdade de valor definida pelo tipo. Para comparar com `None`, use `is None`, pois `None` é singleton.

## 2. Mutáveis e imutáveis

Listas, dicionários e conjuntos são mutáveis. Inteiros, strings e tuplas são exemplos de tipos imutáveis. Uma tupla não pode trocar suas referências, mas pode conter uma referência a uma lista que seja mutada.

Copiar uma lista com `list(original)` cria cópia rasa: elementos mutáveis internos ainda podem ser compartilhados. Mutação compartilhada é possível, mas aliases exigem cuidado.

## 3. Argumentos

Ao chamar uma função, os argumentos são vinculados aos parâmetros locais. O modelo é chamado *call by sharing*: mutar um objeto compartilhado pode ser observado pelo chamador; reatribuir o nome local não reatribui o nome do chamador.

## 4. Padrões mutáveis

Valores padrão são avaliados uma vez quando a função é definida. Uma lista padrão pode acumular dados entre chamadas. Se é necessário criar uma lista por chamada, use `None` como sentinela e construa a lista dentro da função.

## 5. Como falar na entrevista

**“Python passa listas por referência?”**
> “A chamada vincula o parâmetro local ao mesmo objeto. A função pode mutar a lista compartilhada, mas reatribuir o parâmetro não troca o nome do chamador. ‘Passagem por objeto compartilhado’ evita a ambiguidade de ‘passagem por referência’.”

## 6. Resumo

- Nomes referenciam objetos; atribuição não clona automaticamente.
- `is` compara identidade e `==` compara igualdade de valor.
- Mutação é observável por nomes que compartilham o mesmo objeto.
- Cópias comuns de coleções são rasas.
- Padrões mutáveis persistem porque são criados na definição da função.

## Termos desta aula
Nome · objeto · identidade · igualdade · alias · mutabilidade · imutabilidade · cópia rasa · argumento · valor padrão

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 02** e separadas por nível.

### Para aprofundar
[Nomes e objetos](https://docs.python.org/3.14/tutorial/classes.html#python-scopes-and-namespaces) · [Valores padrão](https://docs.python.org/3.14/tutorial/controlflow.html#default-argument-values)
