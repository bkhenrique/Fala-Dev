# Python — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os trade-offs._

**Regra:** responda **em voz alta** antes de abrir a resposta.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Linguagem, interpretador e execução](../aulas/01-linguagem-e-execucao.md)

**1. Por que não afirmar que toda implementação Python executa bytecode de CPython?**
<sub>Aula [01 — Linguagem, interpretador e execução](../aulas/01-linguagem-e-execucao.md)</sub>
<details><summary>Ver resposta</summary>

Porque bytecode e VM descritos são específicos de CPython. Outras implementações, como PyPy, podem executar e otimizar o código de outra forma; a resposta deve identificar a implementação.

</details>

**2. Por que `__name__ == "__main__"` é útil?**
<sub>Aula [01 — Linguagem, interpretador e execução](../aulas/01-linguagem-e-execucao.md)</sub>
<details><summary>Ver resposta</summary>

Permite que funções e classes sejam importáveis sem executar automaticamente o trecho de ponto de entrada reservado à execução direta do arquivo.

</details>

### Aula 02 — [Objetos, tipos e mutabilidade](../aulas/02-objetos-tipos-e-mutabilidade.md)

**3. Por que `is` não é a comparação normal para strings ou números?**
<sub>Aula [02 — Objetos, tipos e mutabilidade](../aulas/02-objetos-tipos-e-mutabilidade.md)</sub>
<details><summary>Ver resposta</summary>

`is` testa se é o mesmo objeto; igualdade de valor é a intenção normal e usa `==`. Internamento ou reutilização de objetos pode variar, então identidade não deve substituir igualdade.

</details>

**4. Por que uma lista padrão pode causar estado compartilhado entre chamadas?**
<sub>Aula [02 — Objetos, tipos e mutabilidade](../aulas/02-objetos-tipos-e-mutabilidade.md)</sub>
<details><summary>Ver resposta</summary>

Porque o objeto padrão é criado uma vez na definição da função. Chamadas que o mutam encontram a mesma lista; criar a lista dentro do corpo evita esse compartilhamento.

</details>

### Aula 03 — [Coleções, controle de fluxo e compreensão](../aulas/03-colecoes-e-controle-de-fluxo.md)

**5. Por que a igualdade de uma chave de dicionário precisa concordar com o hash?**
<sub>Aula [03 — Coleções, controle de fluxo e compreensão](../aulas/03-colecoes-e-controle-de-fluxo.md)</sub>
<details><summary>Ver resposta</summary>

Dict e set usam hash para localizar entradas e igualdade para distinguir colisões. Se objetos iguais produzirem hashes diferentes, uma busca pode não encontrar a chave equivalente.

</details>

**6. Por que escolher `sorted()` em vez de `list.sort()`?**
<sub>Aula [03 — Coleções, controle de fluxo e compreensão](../aulas/03-colecoes-e-controle-de-fluxo.md)</sub>
<details><summary>Ver resposta</summary>

Quando é preciso preservar a lista original ou ordenar qualquer iterável para obter uma lista nova. `list.sort()` altera a lista existente e pode ser mais apropriado quando a mutação é desejada.

</details>

### Aula 04 — [Funções, escopo e closures](../aulas/04-funcoes-escopo-e-closures.md)

**7. Por que ocorre `UnboundLocalError` ao ler uma variável e atribuí-la depois na função?**
<sub>Aula [04 — Funções, escopo e closures](../aulas/04-funcoes-escopo-e-closures.md)</sub>
<details><summary>Ver resposta</summary>

Uma atribuição no corpo normalmente classifica o nome como local para toda a função. A leitura anterior tenta usar o vínculo local antes de ele receber valor. `global` ou `nonlocal` mudam o vínculo alvo quando apropriado.

</details>

**8. Quando uma closure pode ser uma boa alternativa a estado global?**
<sub>Aula [04 — Funções, escopo e closures](../aulas/04-funcoes-escopo-e-closures.md)</sub>
<details><summary>Ver resposta</summary>

Quando uma função precisa manter estado privado para chamadas relacionadas sem expô-lo como global. O estado continua vivo enquanto for referenciado, e uma classe pode ser mais clara quando há muitos métodos ou invariantes.

</details>

### Aula 05 — [Classes, herança e protocolos](../aulas/05-classes-heranca-e-protocolos.md)

**9. Por que `super()` não significa necessariamente chamar o pai imediato?**
<sub>Aula [05 — Classes, herança e protocolos](../aulas/05-classes-heranca-e-protocolos.md)</sub>
<details><summary>Ver resposta</summary>

Ele consulta o próximo método segundo a MRO da instância. Em herança múltipla, essa sequência permite chamadas cooperativas pelas classes da hierarquia.

</details>

**10. Por que Python usa convenções em vez de privacidade rígida de atributos?**
<sub>Aula [05 — Classes, herança e protocolos](../aulas/05-classes-heranca-e-protocolos.md)</sub>
<details><summary>Ver resposta</summary>

O design favorece introspecção e cooperação entre código. `_` marca API interna por convenção; name mangling evita colisões acidentais, mas não é barreira de segurança.

</details>

### Aula 06 — [Exceções e gerenciamento de recursos](../aulas/06-excecoes-e-recursos.md)

**11. Por que capturar apenas exceções que a camada consegue tratar?**
<sub>Aula [06 — Exceções e gerenciamento de recursos](../aulas/06-excecoes-e-recursos.md)</sub>
<details><summary>Ver resposta</summary>

Um catch amplo pode esconder defeitos não previstos e dificultar diagnóstico. Capturar tipos específicos permite recuperação deliberada; falhas que a camada não resolve devem propagar.

</details>

**12. Por que usar `with` para um arquivo?**
<sub>Aula [06 — Exceções e gerenciamento de recursos](../aulas/06-excecoes-e-recursos.md)</sub>
<details><summary>Ver resposta</summary>

O protocolo de contexto executa a limpeza ao sair do bloco mesmo se houver exceção, evitando duplicar fechamento manual em todos os caminhos.

</details>

### Aula 07 — [Módulos, pacotes e ambientes](../aulas/07-modulos-pacotes-e-ambientes.md)

**13. Por que uma importação pode mudar ao alterar o diretório de execução?**
<sub>Aula [07 — Módulos, pacotes e ambientes](../aulas/07-modulos-pacotes-e-ambientes.md)</sub>
<details><summary>Ver resposta</summary>

O diretório inicial e os caminhos de busca influenciam `sys.path`. Isso pode mudar qual arquivo corresponde a um nome de módulo e causar sombreamento ou falha.

</details>

**14. Por que `venv` sozinho não torna um build reproduzível?**
<sub>Aula [07 — Módulos, pacotes e ambientes](../aulas/07-modulos-pacotes-e-ambientes.md)</sub>
<details><summary>Ver resposta</summary>

Ele isola o ambiente, mas não especifica por si só todos os pacotes e versões a instalar. O projeto também precisa registrar as dependências e usar um fluxo de instalação adequado.

</details>

### Aula 08 — [Type hints e análise estática](../aulas/08-type-hints-e-analise-estatica.md)

**15. Por que `object` pode ser mais seguro que `Any`?**
<sub>Aula [08 — Type hints e análise estática](../aulas/08-type-hints-e-analise-estatica.md)</sub>
<details><summary>Ver resposta</summary>

`object` representa qualquer objeto, mas exige narrowing antes de operações específicas. `Any` permite tais operações sem análise significativa e deixa erros escaparem ao verificador.

</details>

**16. Por que type hints não validam uma resposta HTTP?**
<sub>Aula [08 — Type hints e análise estática](../aulas/08-type-hints-e-analise-estatica.md)</sub>
<details><summary>Ver resposta</summary>

O servidor remoto não consulta as anotações locais. Elas ajudam ferramentas estáticas; para comprovar a estrutura recebida é necessário examinar o valor em runtime.

</details>

### Aula 09 — [Iteradores, generators e programação assíncrona](../aulas/09-iteradores-generators-e-async.md)

**17. Por que generator pode reduzir uso de memória?**
<sub>Aula [09 — Iteradores, generators e programação assíncrona](../aulas/09-iteradores-generators-e-async.md)</sub>
<details><summary>Ver resposta</summary>

Ele pode produzir um valor por vez, em vez de materializar toda a sequência. O custo é que o fluxo é normalmente consumido progressivamente e não oferece automaticamente índice ou múltiplas passagens.

</details>

**18. Por que uma chamada `async def` não executa imediatamente todo o corpo?**
<sub>Aula [09 — Iteradores, generators e programação assíncrona](../aulas/09-iteradores-generators-e-async.md)</sub>
<details><summary>Ver resposta</summary>

Ela cria um objeto coroutine. O corpo progride quando a coroutine é aguardada ou agendada dentro de um event loop apropriado.

</details>

### Aula 10 — [Concorrência, GIL e desempenho](../aulas/10-concorrencia-gil-e-desempenho.md)

**19. Quando threads ainda podem ajudar num CPython com GIL?**
<sub>Aula [10 — Concorrência, GIL e desempenho](../aulas/10-concorrencia-gil-e-desempenho.md)</sub>
<details><summary>Ver resposta</summary>

Para concorrência de I/O, porque uma thread pode esperar enquanto outra progride, e para chamadas nativas que liberam o lock. O GIL limita paralelismo de bytecode Python puro no build convencional.

</details>

**20. Por que processos são uma opção para CPU-bound?**
<sub>Aula [10 — Concorrência, GIL e desempenho](../aulas/10-concorrencia-gil-e-desempenho.md)</sub>
<details><summary>Ver resposta</summary>

Processos separados podem executar em núcleos diferentes e não compartilham o mesmo GIL de processo, mas têm custos de inicialização, memória e comunicação.

</details>
