# Aula 05 — Classes, herança e protocolos

> **Objetivo:** explicar instâncias, métodos, herança e protocolos de comportamento.

---

## 1. Classes e instâncias

Uma classe cria um tipo e pode produzir instâncias com estado e métodos. Ao chamar um método de instância, a instância é vinculada como primeiro argumento (`self` por convenção); `self` não é palavra reservada.

Atributos de classe podem ser compartilhados. Atributos mutáveis definidos no corpo da classe não são automaticamente cópias por instância; inicialize estado próprio na instância, normalmente em `__init__`.

## 2. Encapsulamento por convenção

Python não impõe privacidade rígida de atributo. `_nome` comunica que um membro é interno por convenção. Nomes `__dunder` em classe sofrem name mangling para evitar colisões acidentais em subclasses; isso não é mecanismo de segurança ou controle de acesso.

## 3. Herança e MRO

Python permite herança múltipla. A Method Resolution Order (MRO) define a sequência de busca de atributos e métodos. `super()` segue essa resolução cooperativa; não significa simplesmente “chamar o pai imediato”. Hierarquias múltiplas exigem métodos cooperativos e assinaturas compatíveis.

## 4. Protocolos

Métodos especiais como `__iter__`, `__len__`, `__enter__` e `__exit__` permitem que objetos participem de protocolos da linguagem. Muitas vezes, implementar o comportamento esperado é mais importante do que herdar uma classe-base comum; esse estilo é chamado informalmente de tipagem por pato.

`dataclasses.dataclass` pode gerar métodos comuns para classes de dados, mas não valida automaticamente invariantes de negócio.

## 5. Como falar na entrevista

**“Python tem atributos privados?”**
> “Não há privacidade rígida como em algumas linguagens. `_nome` é convenção interna e `__nome` usa name mangling para evitar colisões, não para impedir acesso. A API pública precisa ser documentada.”

## 6. Resumo

- `self` é a convenção para a instância vinculada ao método.
- Atributos de classe podem ser compartilhados entre instâncias.
- `_` e name mangling comunicam intenção, não impõem privacidade segura.
- Herança múltipla segue a MRO; `super()` coopera com essa resolução.
- Protocolos definem comportamento por métodos especiais.

## Termos desta aula
Classe · instância · `self` · atributo de classe · atributo de instância · name mangling · herança múltipla · MRO · `super` · protocolo · dataclass

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 05** e separadas por nível.

### Para aprofundar
[Classes](https://docs.python.org/3.14/tutorial/classes.html) · [Method Resolution Order](https://docs.python.org/3.14/howto/mro.html) · [Dataclasses](https://docs.python.org/3.14/library/dataclasses.html)
