# Aula 06 — Templates, generics e concepts

> **Objetivo:** explicar instanciação de templates, constraints e quando abstração genérica melhora reutilização.

---

## 1. Templates

Templates descrevem famílias de funções e classes parametrizadas por tipos, valores ou templates. Instanciação gera entidades específicas conforme os argumentos usados. Erros podem surgir na instanciação, às vezes longe da declaração original; mensagens detalhadas são consequência do sistema de instanciação.

## 2. Definições e ODR

Como a implementação precisa ver definições apropriadas ao instanciar templates, elas geralmente ficam em headers. A One Definition Rule define restrições sobre definições repetidas e entidades entre unidades de tradução; include guard evita inclusão duplicada localmente, mas não corrige toda violação de ODR.

## 3. Concepts (C++20)

Concepts nomeiam requisitos sobre argumentos de template e restringem quais tipos são aceitos. `requires` pode expressar requisitos. Isso melhora documentação e diagnósticos em relação a templates sem constraints, mas não é checagem dinâmica nem prova que qualquer comportamento de runtime está correto.

## 4. Abstração correta

Use template quando comportamento precisa ser parametrizado por tipo/valor e a operação genérica preserva contrato. Templates podem aumentar tempo de compilação e tamanho de código quando muitas instanciações diferem. Type erasure e interfaces virtuais oferecem alternativas com trade-offs de flexibilidade, runtime e compile time.

## 5. Como falar na entrevista

**“O que Concepts resolvem?”**
> “Em C++20, Concepts expressam requisitos de templates e restringem candidatos, produzindo contratos e diagnósticos melhores. Eles não substituem testes nem garantem correção dinâmica da implementação.”

## 6. Resumo

- Templates descrevem famílias instanciadas com argumentos concretos.
- Definições precisam estar disponíveis durante instanciação em usos comuns.
- ODR governa definições entre unidades; include guard tem alcance local.
- Concepts e `requires` nomeiam/restringem requisitos de templates em C++20.
- Templates trocam flexibilidade por possíveis custos de compile time e código.

## Termos desta aula
Template · instanciação · parâmetro de tipo · ODR · header · concept · `requires` · constraint · type erasure · compile time

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 06** e separadas por nível.

### Para aprofundar
[C++ draft — templates](https://eel.is/c++draft/temp) · [C++ draft — constraints](https://eel.is/c++draft/temp.constr)
