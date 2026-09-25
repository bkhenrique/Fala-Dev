# Aula 01 — Linguagem, interpretador e execução

> **Objetivo:** separar a linguagem Python da implementação e explicar como CPython normalmente executa um programa.

---

## 1. Linguagem e implementação

Python é uma linguagem; **CPython** é sua implementação de referência, escrita principalmente em C. PyPy e outras implementações usam arquiteturas diferentes. Detalhes de CPython não devem ser tratados automaticamente como garantias para qualquer implementação Python.

## 2. O caminho em CPython

CPython analisa o código-fonte, compila-o para bytecode e executa esse bytecode em sua máquina virtual. Arquivos `.pyc` podem guardar bytecode em cache para importações. Não são código de máquina nativo portátil nem substituem o código-fonte.

“Interpretada” é uma descrição prática, mas não quer dizer que o código nunca seja compilado. Ao responder tecnicamente, identifique a implementação quando falar de sua VM ou bytecode.

## 3. Versões

Novas versões acrescentam recursos e podem mudar comportamento. Declare a versão mínima do projeto, confira a documentação daquela versão e teste a compatibilidade nas versões suportadas. Um recurso da documentação atual pode não existir numa instalação mais antiga.

## 4. Script e módulo

Um arquivo pode ser executado como programa principal ou importado como módulo. Na execução direta, `__name__` vale `"__main__"`. O padrão abaixo mantém um ponto de entrada separado das funções reutilizáveis:

```python
def main():
    print("Executado como programa")

if __name__ == "__main__":
    main()
```

## 5. Como falar na entrevista

**“Python é interpretada?”**
> “É comum chamar Python de interpretada, mas isso simplifica a implementação. Em CPython, o fonte é compilado para bytecode e executado por sua máquina virtual. Outras implementações podem funcionar de forma diferente.”

## 6. Resumo

- Python é a linguagem; CPython é uma implementação.
- CPython compila fonte para bytecode e o executa em sua VM.
- `.pyc` é cache de bytecode de CPython, não código nativo portátil.
- Recursos dependem da versão e da implementação.
- `__name__ == "__main__"` identifica execução direta.

## Termos desta aula
Python · CPython · implementação · bytecode · máquina virtual · `.pyc` · módulo · `__main__`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 01** e separadas por nível.

### Para aprofundar
[Python 3.14 Tutorial](https://docs.python.org/3.14/tutorial/index.html) · [Modelo de dados](https://docs.python.org/3.14/reference/datamodel.html) · [Glossário: implementação](https://docs.python.org/3.14/glossary.html#term-implementation)
