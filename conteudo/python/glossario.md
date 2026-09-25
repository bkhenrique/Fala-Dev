# Python — glossário

Cada termo tem três partes: **Em uma frase** (definição), **Traduzindo** (explicação simples) e **Como falar** (frase para treinar).

É material de revisão: a explicação completa está nas [aulas](README.md).

---

### CPython
- **Em uma frase:** implementação de Python que compila fonte para bytecode e o executa em sua VM.
- **Traduzindo:** uma implementação específica da linguagem, não a linguagem inteira.
- **Como falar:** “Bytecode e VM são detalhes de CPython; identifico a implementação ao descrever esse fluxo.”

### Identidade
- **Em uma frase:** relação que indica se dois nomes referem-se ao mesmo objeto.
- **Traduzindo:** não é a mesma pergunta que saber se dois valores são iguais.
- **Como falar:** “Uso `is` para identidade e `==` para igualdade de valor.”

### Mutabilidade
- **Em uma frase:** capacidade de um objeto mudar seu estado após ser criado.
- **Traduzindo:** nomes diferentes podem observar a mesma alteração no objeto.
- **Como falar:** “Aliases de lista compartilham mutações; cópias superficiais ainda compartilham elementos internos.”

### Hashable
- **Em uma frase:** objeto com hash estável e igualdade compatível com o hash.
- **Traduzindo:** requisito para ser chave comum de dict ou membro de set.
- **Como falar:** “Chaves mutáveis não podem mudar seu hash enquanto usadas numa coleção hash.”

### Closure
- **Em uma frase:** função que mantém acesso a vínculos do escopo léxico externo.
- **Traduzindo:** a função interna continua usando estado criado pela função externa.
- **Como falar:** “`nonlocal` atualiza um vínculo de função envolvente capturado.”

### MRO
- **Em uma frase:** ordem de resolução usada para buscar métodos e atributos na hierarquia.
- **Traduzindo:** sequência de classes percorrida, inclusive em herança múltipla.
- **Como falar:** “`super()` segue a MRO, não necessariamente o pai imediato.”

### Gerenciador de contexto
- **Em uma frase:** objeto que controla entrada e saída de um bloco `with`.
- **Traduzindo:** organiza setup e limpeza de recurso em caminhos normais e excepcionais.
- **Como falar:** “`with` usa o protocolo de contexto para liberar recursos.”

### Ambiente virtual
- **Em uma frase:** ambiente isolado de Python para instalar dependências de um projeto.
- **Traduzindo:** cada projeto pode manter suas próprias bibliotecas.
- **Como falar:** “`venv` isola instalações, e o projeto ainda precisa declarar dependências.”

### Type hint
- **Em uma frase:** anotação que comunica tipos e pode ser analisada por ferramentas estáticas.
- **Traduzindo:** orientação para ferramentas e leitores, sem validação automática da linguagem.
- **Como falar:** “Type hints não verificam sozinhos payloads recebidos em runtime.”

### Generator
- **Em uma frase:** iterador que produz valores sob demanda e preserva estado entre yields.
- **Traduzindo:** entrega a próxima parte da sequência quando solicitada.
- **Como falar:** “Generator economiza materialização, mas não oferece automaticamente acesso aleatório.”

### Coroutine
- **Em uma frase:** computação suspensível declarada em Python por `async def`.
- **Traduzindo:** pode ceder durante `await` para outra tarefa progredir no event loop.
- **Como falar:** “Concorrência asyncio não implica paralelismo de CPU.”

### GIL
- **Em uma frase:** lock de builds convencionais do CPython que restringe execução simultânea de bytecode Python em threads de um processo.
- **Traduzindo:** limita paralelismo de CPU puro com threads naquela implementação/build.
- **Como falar:** “Não generalizo GIL como regra de toda implementação Python.”
