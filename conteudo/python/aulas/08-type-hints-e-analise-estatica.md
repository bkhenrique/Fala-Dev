# Aula 08 — Type hints e análise estática

> **Objetivo:** explicar o papel das anotações de tipo e distingui-las de validação automática em runtime.

---

## 1. Anotações

Type hints anotam parâmetros, retornos, variáveis e estruturas compostas. Ferramentas de análise estática os usam para apontar inconsistências. Python não impõe automaticamente essas anotações em chamadas comuns.

```python
def buscar_usuario(identificador: int) -> str | None:
    ...
```

O retorno indica que a busca pode não encontrar usuário; o chamador precisa lidar com essa alternativa.

## 2. Coleções e protocolos

`list[str]`, `dict[str, int]` e `tuple[str, int]` descrevem elementos ou posições esperados. `TypedDict` descreve chaves e valores esperados em dicionários. `Protocol` descreve comportamento estrutural. Essas declarações ajudam analisadores, mas não convertem nem verificam objetos em runtime.

## 3. `Any` e `object`

`Any` permite ao analisador aceitar operações como se o valor fosse compatível com tudo, enfraquecendo verificações. `object` aceita qualquer objeto Python, mas permite apenas operações disponíveis no tipo amplo até que haja narrowing.

Use `Any` conscientemente quando tipos não estiverem disponíveis e limite sua propagação. Para dados externos, combine tipagem estática com validação efetiva em runtime.

## 4. Anotações e ferramentas

Anotações podem ser consultadas por introspecção, e frameworks podem interpretá-las para executar validações próprias. Essa validação vem da ferramenta, não é comportamento obrigatório do sistema de type hints do Python.

## 5. Como falar na entrevista

**“Type hints são verificados quando Python executa?”**
> “Não automaticamente. Anotações descrevem contratos para leitores e ferramentas estáticas. Um framework pode inspecioná-las e validar, mas essa regra vem do framework. Dados externos ainda precisam de validação em runtime.”

## 6. Resumo

- Type hints alimentam documentação e análise estática.
- Anotações comuns não impõem checagem automática em chamadas.
- `Any` enfraquece análise; `object` exige narrowing para operações específicas.
- `Protocol` descreve comportamento estrutural; `TypedDict` descreve formato de dicionário.
- Frameworks podem executar validação própria, separada da linguagem.

## Termos desta aula
Type hint · análise estática · `Any` · `object` · `Protocol` · `TypedDict` · anotação · validação runtime

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 08** e separadas por nível.

### Para aprofundar
[Typing](https://docs.python.org/3.14/library/typing.html) · [PEP 484 — Type Hints](https://peps.python.org/pep-0484/)
