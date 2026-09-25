# Aula 06 — Exceções e gerenciamento de recursos

> **Objetivo:** capturar e propagar falhas com contexto e liberar recursos usando o protocolo apropriado.

---

## 1. Exceções

`SyntaxError` ocorre quando o código não pode ser analisado. Outras exceções são levantadas durante a execução. `try`/`except` captura classes de exceção; capture as que a camada consegue tratar, em vez de esconder falhas com um `except` amplo.

`raise` levanta uma exceção. `raise NovaExcecao(...) from erro` encadeia uma causa ao traduzir falhas e preserva contexto de diagnóstico. Exceções próprias normalmente derivam de `Exception`.

## 2. `else` e `finally`

O `else` do `try` roda quando o corpo terminou sem exceção. `finally` é executado ao sair do bloco durante fluxo normal ou excepcional. Evite `return` ou novo `raise` em `finally`: isso pode substituir o resultado ou erro pendente.

## 3. Gerenciadores de contexto

`with` usa o protocolo de contexto (`__enter__`, `__exit__`) para adquirir e liberar recursos, como arquivos e locks, mesmo quando o corpo levanta uma exceção.

```python
with open("dados.txt", encoding="utf-8") as arquivo:
    conteudo = arquivo.read()
```

O protocolo organiza limpeza; não garante que operações de rede ou disco tenham sido bem-sucedidas.

## 4. Exceção como contrato

Documente exceções significativas. Trate onde é possível recuperar, traduzir a falha ou adicionar contexto. Se a camada não puder resolver, propague. Para condições esperadas e frequentes, uma verificação explícita pode comunicar melhor o fluxo.

## 5. Como falar na entrevista

**“Como garante que um arquivo feche mesmo em caso de erro?”**
> “Uso `with`, que chama o protocolo de gerenciamento de contexto e executa a saída ao deixar o bloco, inclusive quando há uma exceção.”

## 6. Resumo

- `try`/`except` trata falhas; capture exceções específicas.
- `raise from` mantém a causa de uma falha traduzida.
- `else` roda sem exceção; `finally` executa na saída do bloco.
- `with` aplica o protocolo de gerenciamento de contexto.
- Evite `return` em `finally`, que pode mascarar o fluxo pendente.

## Termos desta aula
Exceção · `SyntaxError` · `try` · `except` · `raise` · encadeamento · `else` · `finally` · gerenciador de contexto · `with`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 06** e separadas por nível.

### Para aprofundar
[Erros e exceções](https://docs.python.org/3.14/tutorial/errors.html) · [A instrução `with`](https://docs.python.org/3.14/reference/compound_stmts.html#the-with-statement)
