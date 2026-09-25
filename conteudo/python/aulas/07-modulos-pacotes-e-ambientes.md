# Aula 07 — Módulos, pacotes e ambientes

> **Objetivo:** distinguir módulos, pacotes, resolução de imports e isolamento de dependências.

---

## 1. Módulos e imports

Um módulo costuma ser um arquivo Python. Importá-lo executa seu código de nível superior na primeira importação do processo e armazena o objeto em `sys.modules`; importações seguintes normalmente reutilizam esse módulo. `import` não é uma chamada para reinicializar repetidamente seu estado.

## 2. Pacotes e resolução

Pacotes agrupam módulos. Pacotes regulares costumam ter `__init__.py`; namespace packages podem reunir porções em caminhos diferentes sem esse arquivo. A busca depende de `sys.path`, do ambiente e de como o programa foi iniciado. Um arquivo local pode sombrear uma biblioteca padrão ou dependência.

## 3. Ambientes e dependências

`venv` cria um ambiente virtual para isolar pacotes de um projeto. Ele não fixa sozinho todas as dependências nem substitui um arquivo de requisitos ou lockfile apropriado. `pip` instala pacotes no ambiente selecionado; confirme qual interpretador está ativo.

Separe biblioteca padrão, pacotes de terceiros e módulos locais. Essa distinção ajuda a diagnosticar problemas de importação e reprodução de builds.

## 4. Efeitos colaterais

Código no nível superior de um módulo roda durante a importação. Evite iniciar conexões, tarefas ou alterações externas inesperadamente quando o objetivo do import é carregar definições. Coloque inicialização explícita no ponto de entrada ou em função dedicada.

## 5. Como falar na entrevista

**“Por que uma importação carrega o módulo errado?”**
> “Verifico o diretório de execução, `sys.path`, o nome dos arquivos locais e o ambiente ativo. A resolução depende desses caminhos, e um arquivo local pode sombrear o pacote pretendido.”

## 6. Resumo

- Módulo é carregado e inicializado; o cache de import evita normalmente reexecução no processo.
- Pacotes regulares e namespace packages têm regras diferentes.
- `sys.path` e o ponto de entrada influenciam resolução.
- `venv` isola instalações, mas não substitui a declaração de dependências.
- Código de nível superior roda durante a importação.

## Termos desta aula
Módulo · pacote · `__init__.py` · namespace package · import · `sys.path` · `sys.modules` · `venv` · `pip`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 07** e separadas por nível.

### Para aprofundar
[Módulos](https://docs.python.org/3.14/tutorial/modules.html) · [Namespace packages](https://docs.python.org/3.14/reference/import.html#namespace-packages) · [venv](https://docs.python.org/3.14/library/venv.html)
