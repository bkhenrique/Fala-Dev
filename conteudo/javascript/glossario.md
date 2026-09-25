# JavaScript — glossário

Cada termo tem três partes: **Em uma frase** (definição), **Traduzindo** (explicação simples) e **Como falar** (frase curta para treinar).

É material de revisão: a explicação completa está nas [aulas](README.md).

---

### ECMAScript
- **Em uma frase:** especificação que define a linguagem JavaScript e sua biblioteca padrão.
- **Traduzindo:** o documento de regras que engines implementam.
- **Como falar:** “ECMAScript define a linguagem; o host acrescenta APIs do ambiente.”

### Host
- **Em uma frase:** ambiente que integra JavaScript a APIs externas à especificação da linguagem.
- **Traduzindo:** navegador e Node fornecem ferramentas diferentes ao código.
- **Como falar:** “DOM é API do navegador; filesystem é API de Node.js.”

### Primitivo
- **Em uma frase:** valor dos tipos `undefined`, `null`, boolean, number, bigint, string ou symbol.
- **Traduzindo:** valor que não é um objeto mutável.
- **Como falar:** “JavaScript tem sete tipos primitivos e também valores objeto.”

### Coerção
- **Em uma frase:** conversão implícita de valor feita pelas regras de uma operação.
- **Traduzindo:** a linguagem converte operandos para realizar a expressão.
- **Como falar:** “Uso conversão explícita quando a intenção precisa ficar clara.”

### Identidade
- **Em uma frase:** propriedade que permite distinguir uma referência de objeto de outra.
- **Traduzindo:** dois objetos com o mesmo conteúdo ainda podem ser objetos diferentes.
- **Como falar:** “`===` compara identidade entre objetos; não faz comparação profunda.”

### Truthy e falsy
- **Em uma frase:** valores convertidos para `true` ou `false` em contextos booleanos.
- **Traduzindo:** condicionais interpretam valores conforme uma regra definida pela linguagem.
- **Como falar:** “Array vazio é truthy; zero e string vazia são falsy.”

### Escopo léxico
- **Em uma frase:** visibilidade de identificadores definida pela estrutura escrita do código.
- **Traduzindo:** o local onde a função foi criada determina quais nomes externos ela vê.
- **Como falar:** “Closures usam o escopo léxico em que foram criadas.”

### Hoisting
- **Em uma frase:** nome informal para regras de instanciação que tornam certas declarações disponíveis antes de sua posição textual.
- **Traduzindo:** não é uma movimentação literal de linhas do arquivo.
- **Como falar:** “Declarações de função e variáveis têm regras diferentes de inicialização.”

### TDZ
- **Em uma frase:** intervalo antes da inicialização de ligações `let` e `const` em que acessá-las lança `ReferenceError`.
- **Traduzindo:** o nome existe no escopo, mas ainda não pode ser usado.
- **Como falar:** “A TDZ ajuda a detectar uso antes da inicialização.”

### Closure
- **Em uma frase:** função junto ao acesso às ligações do ambiente léxico onde foi criada.
- **Traduzindo:** uma função pode continuar usando estado externo após a função criadora terminar.
- **Como falar:** “Closures encapsulam estado, que permanece alcançável enquanto a função for usada.”

### `this`
- **Em uma frase:** valor determinado pela forma de chamada em funções comuns, ou herdado lexicalmente por arrow functions.
- **Traduzindo:** não significa sempre “o objeto atual”; depende do tipo de função e do contexto.
- **Como falar:** “Em `obj.metodo()`, `this` da função comum é `obj` naquela chamada.”

### Protótipo
- **Em uma frase:** objeto consultado como próximo elo quando uma propriedade não é encontrada no objeto atual.
- **Traduzindo:** mecanismo de delegação e herança da linguagem.
- **Como falar:** “Classes JavaScript usam a cadeia de protótipos.”

### Cópia rasa
- **Em uma frase:** cópia das propriedades de primeiro nível cujos valores internos podem continuar compartilhados.
- **Traduzindo:** o objeto externo é novo, mas objetos aninhados podem ser os mesmos.
- **Como falar:** “Spread de objeto cria cópia rasa, não imutabilidade profunda.”

### `Map`
- **Em uma frase:** coleção que associa valores de chave a valores e aceita qualquer tipo como chave.
- **Traduzindo:** dicionário sem conversão de chave de objeto para string.
- **Como falar:** “Uso `Map` quando preciso preservar a identidade de chaves que são objetos.”

### Iterável
- **Em uma frase:** valor que implementa `Symbol.iterator` para fornecer um iterador.
- **Traduzindo:** coleção que pode ser consumida por `for...of`.
- **Como falar:** “Array, string, Map e Set são iteráveis.”

### Promise
- **Em uma frase:** objeto que representa conclusão futura cumprida ou rejeitada de uma operação.
- **Traduzindo:** um resultado que ainda pode estar pendente.
- **Como falar:** “Promise é ECMAScript; a operação assíncrona pode depender de API do host.”

### Ligação viva
- **Em uma frase:** vínculo de importação com exportação de módulo que reflete as atualizações permitidas pela semântica ESM.
- **Traduzindo:** o importador não recebe simplesmente uma cópia independente da variável exportada.
- **Como falar:** “Módulos ECMAScript usam ligações vivas para importações.”

### Generator
- **Em uma frase:** função declarada com `function*` que suspende e retoma a execução por `yield`.
- **Traduzindo:** uma função que entrega valores gradualmente quando seu iterador avança.
- **Como falar:** “Generator produz sob demanda, mas não executa em outra thread.”
