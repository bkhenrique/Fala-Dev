# Aula 03 — Coleções, controle de fluxo e compreensão

> **Objetivo:** escolher estruturas de dados padrão e entender iteração, hash e ordenação.

---

## 1. Estruturas principais

- `list`: sequência mutável, ordenada por posição e indexada.
- `tuple`: sequência imutável.
- `dict`: mapeamento de chaves para valores; chaves precisam ser hashable.
- `set`: coleção de elementos distintos, útil para pertinência e operações de conjuntos.

Desde Python 3.7, a ordem de inserção de `dict` é garantia da linguagem. Isso não significa que dicionários sejam ordenados pela chave.

## 2. Iteração e compreensões

`for` percorre iteráveis, não apenas índices. Compreensões constroem listas, conjuntos ou dicionários a partir de uma expressão e, opcionalmente, um filtro:

```python
pares = [n for n in valores if n % 2 == 0]
```

Use uma compreensão quando transformação e filtro forem claros numa expressão. Laços explícitos são mais legíveis para múltiplos efeitos, tratamento complexo ou saída antecipada.

## 3. Hash e igualdade

Uma chave hashable mantém hash estável durante sua vida e obedece à regra de que objetos iguais têm o mesmo hash. Listas e dicionários mutáveis não podem ser chaves padrão de dicionário ou membros de set; tuplas só são hashable se seus elementos também forem.

## 4. Ordenação

`sorted(iteravel)` retorna nova lista; `list.sort()` altera a lista e retorna `None`. Ambos aceitam `key` para extrair a chave de ordenação. Elementos de tipos incompatíveis podem não ser ordenáveis juntos.

## 5. Como falar na entrevista

**“Quando escolhe `set` em vez de lista?”**
> “Uso set quando preciso de unicidade ou consultas de pertencimento e a igualdade/hash são apropriadas. Uso lista quando preciso preservar posições e repetições. Não uso a ordem de um set como ordem de apresentação.”

## 6. Resumo

- `list`, `tuple`, `dict` e `set` têm contratos diferentes.
- `dict` preserva ordem de inserção; não ordena automaticamente por chave.
- Compreensões são concisas; laços explícitos ajudam em fluxos complexos.
- `dict` e `set` dependem de hash e igualdade compatíveis.
- `sort()` altera; `sorted()` cria uma nova lista.

## Termos desta aula
Lista · tupla · dicionário · conjunto · iterável · compreensão · hashable · hash · igualdade · `sorted` · `sort`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 03** e separadas por nível.

### Para aprofundar
[Estruturas de dados](https://docs.python.org/3.14/tutorial/datastructures.html) · [Modelo de dados: hash](https://docs.python.org/3.14/reference/datamodel.html#object.__hash__)
