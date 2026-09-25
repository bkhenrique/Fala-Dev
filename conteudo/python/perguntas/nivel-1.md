# Python — perguntas, nível 1: O que é?

_Definições. Tem que sair sem pensar._

**Regra:** responda **em voz alta** antes de abrir a resposta. Se travar, volte na aula indicada.

Estrutura de resposta: **Definição → Pra que serve → Exemplo real → Trade-off.**

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Linguagem, interpretador e execução](../aulas/01-linguagem-e-execucao.md)

**1. O que é CPython?**
<sub>Aula [01 — Linguagem, interpretador e execução](../aulas/01-linguagem-e-execucao.md)</sub>
<details><summary>Ver resposta</summary>

É uma implementação de Python, escrita principalmente em C e usada como implementação de referência. Não é sinônimo de toda a linguagem Python.

</details>

**2. O que é bytecode em CPython?**
<sub>Aula [01 — Linguagem, interpretador e execução](../aulas/01-linguagem-e-execucao.md)</sub>
<details><summary>Ver resposta</summary>

É uma representação intermediária para a máquina virtual CPython executar. Arquivos `.pyc` podem armazená-la em cache; não são código nativo portátil.

</details>

### Aula 02 — [Objetos, tipos e mutabilidade](../aulas/02-objetos-tipos-e-mutabilidade.md)

**3. O que `is` compara?**
<sub>Aula [02 — Objetos, tipos e mutabilidade](../aulas/02-objetos-tipos-e-mutabilidade.md)</sub>
<details><summary>Ver resposta</summary>

Identidade: se os dois nomes referem-se ao mesmo objeto. Para igualdade de valor, use `==`; para `None`, é idiomático testar `is None`.

</details>

**4. O que é uma cópia rasa?**
<sub>Aula [02 — Objetos, tipos e mutabilidade](../aulas/02-objetos-tipos-e-mutabilidade.md)</sub>
<details><summary>Ver resposta</summary>

Uma cópia da coleção externa cujos elementos continuam podendo referenciar os mesmos objetos internos da coleção original.

</details>

### Aula 03 — [Coleções, controle de fluxo e compreensão](../aulas/03-colecoes-e-controle-de-fluxo.md)

**5. O que é um objeto hashable?**
<sub>Aula [03 — Coleções, controle de fluxo e compreensão](../aulas/03-colecoes-e-controle-de-fluxo.md)</sub>
<details><summary>Ver resposta</summary>

Um objeto cujo hash permanece estável durante sua vida e cuja igualdade é compatível com esse hash. Chaves de dict e elementos de set precisam ser hashable.

</details>

**6. Qual a diferença entre `sorted()` e `list.sort()`?**
<sub>Aula [03 — Coleções, controle de fluxo e compreensão](../aulas/03-colecoes-e-controle-de-fluxo.md)</sub>
<details><summary>Ver resposta</summary>

`sorted()` retorna uma nova lista ordenada; `list.sort()` ordena a lista existente e retorna `None`.

</details>

### Aula 04 — [Funções, escopo e closures](../aulas/04-funcoes-escopo-e-closures.md)

**7. O que faz `nonlocal`?**
<sub>Aula [04 — Funções, escopo e closures](../aulas/04-funcoes-escopo-e-closures.md)</sub>
<details><summary>Ver resposta</summary>

Declara que uma atribuição dentro da função deve atualizar um vínculo já existente numa função envolvente, e não criar um novo nome local.

</details>

**8. O que é uma closure?**
<sub>Aula [04 — Funções, escopo e closures](../aulas/04-funcoes-escopo-e-closures.md)</sub>
<details><summary>Ver resposta</summary>

Uma função que mantém acesso aos nomes do escopo léxico externo onde foi definida, mesmo depois que a função externa terminou.

</details>

### Aula 05 — [Classes, herança e protocolos](../aulas/05-classes-heranca-e-protocolos.md)

**9. O que é a MRO?**
<sub>Aula [05 — Classes, herança e protocolos](../aulas/05-classes-heranca-e-protocolos.md)</sub>
<details><summary>Ver resposta</summary>

Method Resolution Order: ordem em que Python procura atributos e métodos na hierarquia de classes, inclusive com herança múltipla.

</details>

**10. O que `super()` faz em herança múltipla?**
<sub>Aula [05 — Classes, herança e protocolos](../aulas/05-classes-heranca-e-protocolos.md)</sub>
<details><summary>Ver resposta</summary>

Segue a próxima implementação segundo a MRO. Em hierarquias cooperativas, cada classe pode chamar `super()` para participar da sequência.

</details>

### Aula 06 — [Exceções e gerenciamento de recursos](../aulas/06-excecoes-e-recursos.md)

**11. O que `raise ... from ...` faz?**
<sub>Aula [06 — Exceções e gerenciamento de recursos](../aulas/06-excecoes-e-recursos.md)</sub>
<details><summary>Ver resposta</summary>

Levanta uma exceção com outra exceção definida como causa explícita, preservando contexto quando uma camada traduz a falha.

</details>

**12. Qual protocolo `with` usa?**
<sub>Aula [06 — Exceções e gerenciamento de recursos](../aulas/06-excecoes-e-recursos.md)</sub>
<details><summary>Ver resposta</summary>

O protocolo de gerenciamento de contexto, normalmente `__enter__` e `__exit__`, para organizar entrada e limpeza ao sair do bloco.

</details>

### Aula 07 — [Módulos, pacotes e ambientes](../aulas/07-modulos-pacotes-e-ambientes.md)

**13. O que é `sys.modules`?**
<sub>Aula [07 — Módulos, pacotes e ambientes](../aulas/07-modulos-pacotes-e-ambientes.md)</sub>
<details><summary>Ver resposta</summary>

É o mapeamento de módulos já carregados no processo. Importações posteriores normalmente reutilizam o objeto de módulo ali armazenado.

</details>

**14. Para que serve `venv`?**
<sub>Aula [07 — Módulos, pacotes e ambientes](../aulas/07-modulos-pacotes-e-ambientes.md)</sub>
<details><summary>Ver resposta</summary>

Cria um ambiente virtual para isolar interpretador e pacotes instalados de um projeto em relação a outros ambientes.

</details>

### Aula 08 — [Type hints e análise estática](../aulas/08-type-hints-e-analise-estatica.md)

**15. O que é `TypedDict`?**
<sub>Aula [08 — Type hints e análise estática](../aulas/08-type-hints-e-analise-estatica.md)</sub>
<details><summary>Ver resposta</summary>

Uma construção de typing para descrever, principalmente para ferramentas estáticas, as chaves e tipos esperados de um dicionário.

</details>

**16. Type hints validam argumentos automaticamente?**
<sub>Aula [08 — Type hints e análise estática](../aulas/08-type-hints-e-analise-estatica.md)</sub>
<details><summary>Ver resposta</summary>

Não. Python não aplica automaticamente as anotações comuns nas chamadas; analisadores externos podem checar o código e frameworks podem implementar validação própria.

</details>

### Aula 09 — [Iteradores, generators e programação assíncrona](../aulas/09-iteradores-generators-e-async.md)

**17. O que `yield` faz?**
<sub>Aula [09 — Iteradores, generators e programação assíncrona](../aulas/09-iteradores-generators-e-async.md)</sub>
<details><summary>Ver resposta</summary>

Suspende uma função generator e fornece um valor ao iterador; uma iteração posterior retoma a execução do ponto suspenso.

</details>

**18. O que `async def` declara?**
<sub>Aula [09 — Iteradores, generators e programação assíncrona](../aulas/09-iteradores-generators-e-async.md)</sub>
<details><summary>Ver resposta</summary>

Uma função coroutine. Chamá-la cria um objeto coroutine, que precisa ser aguardado ou agendado para executar.

</details>

### Aula 10 — [Concorrência, GIL e desempenho](../aulas/10-concorrencia-gil-e-desempenho.md)

**19. O que é o GIL em CPython convencional?**
<sub>Aula [10 — Concorrência, GIL e desempenho](../aulas/10-concorrencia-gil-e-desempenho.md)</sub>
<details><summary>Ver resposta</summary>

Um lock que limita a execução simultânea de bytecode Python por várias threads num mesmo processo CPython convencional. É uma característica daquela implementação/build, não regra da linguagem inteira.

</details>

**20. Qual a diferença entre thread e processo em relação à memória?**
<sub>Aula [10 — Concorrência, GIL e desempenho](../aulas/10-concorrencia-gil-e-desempenho.md)</sub>
<details><summary>Ver resposta</summary>

Threads do mesmo processo compartilham memória; processos têm espaços de memória separados e precisam trocar dados por mecanismos explícitos.

</details>
