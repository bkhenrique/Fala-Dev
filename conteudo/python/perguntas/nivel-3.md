# Python — perguntas, nível 3: Como você faria?

_Cenários reais: junte conceitos e explique suas decisões._

**Regra:** responda **em voz alta** antes de abrir a resposta.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Linguagem, interpretador e execução](../aulas/01-linguagem-e-execucao.md)

**1. Um `.pyc` roda em qualquer implementação e substitui o fonte?**
<sub>Aula [01 — Linguagem, interpretador e execução](../aulas/01-linguagem-e-execucao.md)</sub>
<details><summary>Ver resposta</summary>

Não. É cache de bytecode associado a CPython e não é formato portátil de código nativo. Mantenho fonte e requisitos de versão/implementação claros.

</details>

### Aula 02 — [Objetos, tipos e mutabilidade](../aulas/02-objetos-tipos-e-mutabilidade.md)

**2. Uma função acumula valores entre chamadas sem querer. Qual padrão você investiga?**
<sub>Aula [02 — Objetos, tipos e mutabilidade](../aulas/02-objetos-tipos-e-mutabilidade.md)</sub>
<details><summary>Ver resposta</summary>

Verifico se há lista ou dicionário mutável como valor padrão, pois o mesmo objeto é reutilizado. Uso `None` como sentinela e crio a coleção dentro da função.

</details>

### Aula 03 — [Coleções, controle de fluxo e compreensão](../aulas/03-colecoes-e-controle-de-fluxo.md)

**3. Você precisa de elementos únicos e consultas de pertencimento, mas a ordem de exibição deve ser estável. O que considera?**
<sub>Aula [03 — Coleções, controle de fluxo e compreensão](../aulas/03-colecoes-e-controle-de-fluxo.md)</sub>
<details><summary>Ver resposta</summary>

Set é útil para unicidade e pertinência, mas não contrato de apresentação ordenada. Posso manter uma lista na ordem desejada e um set auxiliar para detectar duplicatas, ou ordenar explicitamente antes de exibir.

</details>

### Aula 04 — [Funções, escopo e closures](../aulas/04-funcoes-escopo-e-closures.md)

**4. Uma função lê um contador e depois o incrementa, mas dá `UnboundLocalError`. Como explica?**
<sub>Aula [04 — Funções, escopo e closures](../aulas/04-funcoes-escopo-e-closures.md)</sub>
<details><summary>Ver resposta</summary>

A atribuição torna o nome local à função inteira, então a leitura anterior tenta acessar um vínculo local ainda sem valor. Se a intenção é atualizar estado externo, avalio `nonlocal`, uma classe ou retorno explícito do novo estado.

</details>

### Aula 05 — [Classes, herança e protocolos](../aulas/05-classes-heranca-e-protocolos.md)

**5. Duas classes-base implementam o mesmo método. Como saber qual `super()` será chamado?**
<sub>Aula [05 — Classes, herança e protocolos](../aulas/05-classes-heranca-e-protocolos.md)</sub>
<details><summary>Ver resposta</summary>

Consulto a MRO da classe concreta. `super()` segue o próximo método nessa ordem; para cooperação correta, as implementações precisam respeitar o contrato e chamar `super()` quando apropriado.

</details>

### Aula 06 — [Exceções e gerenciamento de recursos](../aulas/06-excecoes-e-recursos.md)

**6. Um arquivo precisa ser fechado mesmo se o parse lançar erro. Como estruturaria?**
<sub>Aula [06 — Exceções e gerenciamento de recursos](../aulas/06-excecoes-e-recursos.md)</sub>
<details><summary>Ver resposta</summary>

Abro o arquivo dentro de `with` e faço o parse no bloco. A saída pelo protocolo de contexto realiza a limpeza mesmo quando a exceção se propaga.

</details>

### Aula 07 — [Módulos, pacotes e ambientes](../aulas/07-modulos-pacotes-e-ambientes.md)

**7. Em uma máquina, `import json` carrega um módulo local inesperado. Como investiga?**
<sub>Aula [07 — Módulos, pacotes e ambientes](../aulas/07-modulos-pacotes-e-ambientes.md)</sub>
<details><summary>Ver resposta</summary>

Verifico nomes locais como `json.py`, diretório atual, `sys.path`, `sys.modules` e interpretador/ambiente ativos. Renomeio o arquivo conflitante e reinicio o processo se o módulo já estiver no cache.

</details>

### Aula 08 — [Type hints e análise estática](../aulas/08-type-hints-e-analise-estatica.md)

**8. Um payload JSON tem anotação `TypedDict`, mas chega sem um campo obrigatório. O que deve impedir o uso?**
<sub>Aula [08 — Type hints e análise estática](../aulas/08-type-hints-e-analise-estatica.md)</sub>
<details><summary>Ver resposta</summary>

Uma validação runtime na fronteira precisa verificar as chaves e valores recebidos. `TypedDict` informa analisadores estáticos, mas não faz essa verificação ao carregar JSON.

</details>

### Aula 09 — [Iteradores, generators e programação assíncrona](../aulas/09-iteradores-generators-e-async.md)

**9. Uma coroutine executa `time.sleep()` e paralisa todas as tarefas asyncio. Como corrigir?**
<sub>Aula [09 — Iteradores, generators e programação assíncrona](../aulas/09-iteradores-generators-e-async.md)</sub>
<details><summary>Ver resposta</summary>

`time.sleep()` bloqueia a thread do event loop. Para espera temporizada assíncrona, uso `await asyncio.sleep(...)`; para chamada bloqueante, avalio executá-la fora do loop por mecanismo apropriado.

</details>

### Aula 10 — [Concorrência, GIL e desempenho](../aulas/10-concorrencia-gil-e-desempenho.md)

**10. Um cálculo CPU-bound precisa usar múltiplos núcleos em CPython convencional. Que opções compara?**
<sub>Aula [10 — Concorrência, GIL e desempenho](../aulas/10-concorrencia-gil-e-desempenho.md)</sub>
<details><summary>Ver resposta</summary>

Considero multiprocessamento para paralelismo com custo de IPC; extensões nativas que liberem o GIL; ou build free-threaded compatível, medindo compatibilidade e desempenho. Threads Python convencionais não aceleram automaticamente bytecode CPU-bound por causa do GIL.

</details>
