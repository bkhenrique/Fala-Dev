# Aula 04 — Funções, escopo e closures

> **Objetivo:** explicar parâmetros, funções como valores, resolução de nomes e closures.

---

## 1. Funções como valores

`def` vincula um objeto função a um nome. Funções podem ser passadas, retornadas e armazenadas. Argumentos podem ser posicionais ou nomeados; `*args` reúne posicionais excedentes e `**kwargs` reúne nomeados excedentes. Type hints documentam contratos, mas não validam automaticamente chamadas em runtime.

Valores padrão são avaliados uma vez na definição da função. Para padrões mutáveis, use uma sentinela como `None` e crie o objeto no corpo.

## 2. Escopo

LEGB (Local, Enclosing, Global, Built-in) é um resumo didático da resolução de nomes. `global` faz atribuição referir-se a um nome global do módulo; `nonlocal` permite reatribuir um vínculo de uma função envolvente.

Se há atribuição a um nome em qualquer ponto da função, ele é normalmente considerado local naquela função, salvo declaração explícita. Ler antes de atribuir pode produzir `UnboundLocalError`.

## 3. Closures

Uma função aninhada pode acessar nomes do escopo léxico envolvente. Ela mantém acesso a esses vínculos depois que a chamada externa terminou; isso é uma closure. `nonlocal` permite atualizar o vínculo envolvente.

## 4. Decorators

Decorator recebe função/classe e retorna um substituto ou objeto compatível. `@decorador` é a sintaxe aplicada à declaração. Decorators permitem envolver comportamento transversal; `functools.wraps` ajuda a preservar metadados da função decorada.

## 5. Como falar na entrevista

**“O que é uma closure em Python?”**
> “É uma função interna que mantém acesso aos nomes do escopo léxico em que foi criada. Pode encapsular estado; `nonlocal` altera um vínculo envolvente que não é global.”

## 6. Resumo

- Funções são objetos e aceitam argumentos posicionais, nomeados e agrupados.
- LEGB resume a busca de nomes.
- `global` e `nonlocal` declaram qual vínculo uma atribuição altera.
- Closures preservam acesso ao ambiente léxico externo.
- Decorators transformam ou envolvem funções e classes.

## Termos desta aula
Função · argumento nomeado · `*args` · `**kwargs` · escopo · LEGB · `global` · `nonlocal` · closure · decorator · `functools.wraps`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 04** e separadas por nível.

### Para aprofundar
[Definição de funções](https://docs.python.org/3.14/tutorial/controlflow.html#defining-functions) · [Escopos e namespaces](https://docs.python.org/3.14/tutorial/classes.html#python-scopes-and-namespaces) · [Decorator](https://docs.python.org/3.14/glossary.html#term-decorator)
