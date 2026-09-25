# C++ — glossário

Cada termo tem três partes: **Em uma frase** (definição), **Traduzindo** (explicação simples) e **Como falar** (frase para treinar).

É material de revisão: a explicação completa está nas [aulas](README.md).

---

### Value category
- **Em uma frase:** categoria de expressão como lvalue, xvalue ou prvalue que afeta overload e operações.
- **Traduzindo:** informa como a expressão pode designar ou fornecer valor.
- **Como falar:** “A value category influencia seleção de copy/move, mas não é o tipo do objeto.”

### `std::move`
- **Em uma frase:** cast que permite tratar expressão como rvalue para selecionar operação de move.
- **Traduzindo:** habilita a possibilidade de mover; não move sozinho.
- **Como falar:** “O move constructor selecionado transfere recurso e define estado da origem.”

### RAII
- **Em uma frase:** associação de recurso ao lifetime de um objeto e liberação no destrutor.
- **Traduzindo:** cleanup automático quando o objeto sai de escopo.
- **Como falar:** “RAII libera recursos também durante stack unwinding.”

### `unique_ptr`
- **Em uma frase:** smart pointer que expressa ownership exclusivo de um recurso.
- **Traduzindo:** um dono que pode transferir posse por move.
- **Como falar:** “Prefiro `unique_ptr` quando não há posse compartilhada real.”

### `shared_ptr`
- **Em uma frase:** smart pointer que compartilha posse usando contagem forte.
- **Traduzindo:** o recurso vive até não haver donos fortes.
- **Como falar:** “Ciclos fortes podem impedir a liberação; uso `weak_ptr` numa aresta não proprietária.”

### Object slicing
- **Em uma frase:** cópia de objeto derivado por valor para objeto base que descarta estado derivado.
- **Traduzindo:** guardar só a parte da classe base.
- **Como falar:** “Uso indireção ou `variant` para preservar o tipo dinâmico conforme o contrato.”

### Concept
- **Em uma frase:** requisito nomeado que restringe argumentos de template em C++20.
- **Traduzindo:** um contrato legível sobre operações/tipos aceitos por template.
- **Como falar:** “Concept melhora constraints e diagnósticos, não valida comportamento em runtime.”

### Invalidação de iterator
- **Em uma frase:** operação que faz iterator/referência deixar de satisfazer o contrato do container.
- **Traduzindo:** o endereço salvo pode não apontar mais para elemento válido.
- **Como falar:** “Confiro regras específicas da operação e do container antes de reutilizar aliases.”

### Stack unwinding
- **Em uma frase:** destruição de objetos automáticos enquanto exceção propaga.
- **Traduzindo:** sair das funções libera os objetos RAII no caminho.
- **Como falar:** “Destrutores durante unwinding não devem lançar exceções.”

### Closure object
- **Em uma frase:** objeto de tipo único criado por expressão lambda e que armazena capturas.
- **Traduzindo:** a lambda guarda seus dados capturados num objeto chamável.
- **Como falar:** “Captura por referência exige lifetime suficiente para o closure.”

### Data race
- **Em uma frase:** acessos conflitantes concorrentes sem sincronização happens-before adequada.
- **Traduzindo:** threads leem/escrevem estado sem ordem de memória definida.
- **Como falar:** “Data race não atômica em C++ produz comportamento indefinido.”
