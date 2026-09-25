# TypeScript — glossário

Cada termo tem três partes: **Em uma frase** (definição), **Traduzindo** (explicação simples) e **Como falar** (frase curta para treinar).

É material de revisão: a explicação completa está nas [aulas](README.md).

---

### Checagem estática
- **Em uma frase:** análise feita antes da execução para encontrar incompatibilidades conforme os tipos conhecidos.
- **Traduzindo:** o compilador compara o uso do código com seus contratos sem precisar executar aquele caminho.
- **Como falar:** “Type-check não substitui testes nem validação runtime.”

### Inferência de tipo
- **Em uma frase:** dedução de tipos pelo compilador a partir de inicializadores e contexto.
- **Traduzindo:** o compilador consegue saber o tipo sem anotação em vários casos.
- **Como falar:** “Anoto fronteiras importantes e deixo o compilador inferir variáveis locais óbvias.”

### `any`
- **Em uma frase:** tipo que desativa grande parte das verificações para o valor.
- **Traduzindo:** um escape hatch que permite quase tudo sem checagem.
- **Como falar:** “Uso `any` com parcimônia porque a incerteza se espalha.”

### `unknown`
- **Em uma frase:** tipo que aceita qualquer valor, mas exige checagem antes de uso específico.
- **Traduzindo:** o compilador obriga a descobrir o que veio antes de confiar.
- **Como falar:** “Uso `unknown` para dados externos e faço narrowing antes do consumo.”

### `never`
- **Em uma frase:** tipo sem valores possíveis em determinado ponto do fluxo.
- **Traduzindo:** depois das verificações, não resta nenhum caso.
- **Como falar:** “`never` pode ajudar a detectar uma variante não tratada numa união discriminada.”

### Tipo estrutural
- **Em uma frase:** compatibilidade de tipos baseada em membros compatíveis, não apenas em nomes.
- **Traduzindo:** o que importa é a forma exigida do valor.
- **Como falar:** “TypeScript usa compatibilidade estrutural e tem verificações especiais para literais.”

### Interface
- **Em uma frase:** declaração de formato de objeto, função ou classe que participa da checagem estática.
- **Traduzindo:** um contrato sobre os membros que precisam existir.
- **Como falar:** “Interface não é uma validação runtime.”

### Alias `type`
- **Em uma frase:** nome para um tipo, incluindo uniões, interseções e formatos de objeto.
- **Traduzindo:** dá nome a uma expressão de tipo reutilizável.
- **Como falar:** “Uso alias para tipos compostos e interface para contratos de objeto conforme a convenção do projeto.”

### União discriminada
- **Em uma frase:** união de variantes identificadas por uma propriedade discriminante comum.
- **Traduzindo:** cada valor declara claramente em qual estado se encontra.
- **Como falar:** “O discriminante permite narrowing e ajuda a evitar combinações inválidas.”

### Narrowing
- **Em uma frase:** refinamento de um tipo baseado em verificações e fluxo de controle.
- **Traduzindo:** depois de checar uma condição, o compilador sabe qual alternativa restou.
- **Como falar:** “Narrowing estático só corresponde a validação runtime se as verificações realmente examinarem o dado.”

### Asserção de tipo
- **Em uma frase:** instrução ao compilador para tratar uma expressão como um tipo compatível.
- **Traduzindo:** uma afirmação do autor, sem conversão ou teste do valor.
- **Como falar:** “`as Tipo` pode esconder uma suposição errada; não valida entrada.”

### Generic
- **Em uma frase:** parâmetro de tipo que expressa relações entre valores e tipos.
- **Traduzindo:** a função preserva o tipo concreto informado pelo chamador.
- **Como falar:** “Uso generics quando tipo de entrada e saída precisam continuar relacionados.”

### Tipo utilitário
- **Em uma frase:** tipo predefinido que transforma ou deriva outro tipo.
- **Traduzindo:** ferramenta estática para reaproveitar contratos, como `Partial` ou `Pick`.
- **Como falar:** “Tipos utilitários não transformam nem validam valores em runtime.”

### Arquivo `.d.ts`
- **Em uma frase:** arquivo de declaração que descreve tipos e APIs de uma implementação externa.
- **Traduzindo:** um contrato para o compilador, não o código que executa.
- **Como falar:** “Declarações incorretas podem fazer uma API quebrada parecer válida durante o type-check.”

### `strict`
- **Em uma frase:** opção do TypeScript que ativa um conjunto de verificações estritas.
- **Traduzindo:** pede ao compilador para sinalizar mais situações frágeis.
- **Como falar:** “`strict` aumenta a análise estática, mas não valida dados em runtime.”

### `satisfies`
- **Em uma frase:** operador que verifica compatibilidade estática sem substituir de forma ampla o tipo inferido da expressão.
- **Traduzindo:** confere o contrato e preserva detalhes úteis do valor.
- **Como falar:** “`satisfies` verifica tipos durante a compilação; não faz validação runtime.”
