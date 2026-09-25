# Spring — glossário

Cada termo tem três partes: **Em uma frase** (a definição curta), **Traduzindo** (a explicação simples) e **Como falar** (uma frase pronta pra treinar em voz alta). Alguns trazem também **Não confundir com** ou **Cuidado**.

É material de revisão: a explicação completa está nas [aulas](README.md).

---

### Spring vs Spring Boot
- **Em uma frase:** Spring é o framework (IoC, MVC, Data…); Spring Boot é a camada que dá autoconfiguração, *starters* e servidor embutido.
- **Traduzindo:** Spring são as peças; Boot é o kit já montado.
- **Como falar:** "Spring Boot usa *convention over configuration*: com um starter eu já tenho tudo configurado."

### Bean e IoC Container
- **Em uma frase:** Bean é um objeto gerenciado pelo container do Spring (`ApplicationContext`), que cria e injeta as dependências.
- **Traduzindo:** mesma ideia do provider no Nest.
- **Como falar:** "Prefiro injeção por construtor em vez de `@Autowired` em campo: deixa a dependência explícita, imutável e fácil de testar."

### JPA / Hibernate
- **Em uma frase:** JPA é a especificação de ORM do Java; Hibernate é a implementação mais usada.
- **Traduzindo:** mapear classe ↔ tabela sem escrever SQL na mão.
- **Como falar:** "Cuido do N+1 com `JOIN FETCH` ou `@EntityGraph`, e uso `LAZY` por padrão nos relacionamentos."

### @Transactional
- **Em uma frase:** anotação que faz o método rodar dentro de uma transação, com commit no sucesso e rollback em exceção unchecked.
- **Traduzindo:** tudo ou nada, de forma declarativa.
- **Como falar:** "Pegadinha: `@Transactional` funciona via *proxy*, então chamar o método de dentro da própria classe (*self-invocation*) não abre transação."
