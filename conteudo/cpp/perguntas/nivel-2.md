# C++ — perguntas, nível 2: Por quê? Quando usar?

_Comparações e motivos. É aqui que aparecem os trade-offs._

**Regra:** responda **em voz alta** antes de abrir a resposta.

Outros níveis: [nível 1](nivel-1.md) · [nível 2](nivel-2.md) · [nível 3](nivel-3.md) · [índice](README.md)

---

### Aula 01 — [Modelo C++, compilação e versões](../aulas/01-modelo-compilacao-e-versoes.md)

**1. Por que indicar a versão mínima de C++ do projeto?**
<sub>Aula [01 — Modelo C++, compilação e versões](../aulas/01-modelo-compilacao-e-versoes.md)</sub>
<details><summary>Ver resposta</summary>

Para alinhar recursos da linguagem/biblioteca, flags da toolchain e ambientes de build. Sem uma versão declarada, código pode compilar numa máquina e falhar noutra.

</details>

**2. Por que templates costumam ter implementação em headers?**
<sub>Aula [01 — Modelo C++, compilação e versões](../aulas/01-modelo-compilacao-e-versoes.md)</sub>
<details><summary>Ver resposta</summary>

O compilador precisa da definição apropriada quando instancia o template com tipos concretos. Separar interface/implementação exige estratégias explícitas de instanciação para cada especialização necessária.

</details>

### Aula 02 — [Tipos, referências e value categories](../aulas/02-tipos-referencias-e-value-categories.md)

**3. Por que usar referência `const T&` para parâmetro grande?**
<sub>Aula [02 — Tipos, referências e value categories](../aulas/02-tipos-referencias-e-value-categories.md)</sub>
<details><summary>Ver resposta</summary>

Evita cópia e impede modificação através daquele parâmetro, mantendo lifetime e não nulidade como pré-condições do contrato. Para valores pequenos ou ownership, outro tipo de parâmetro pode ser melhor.

</details>

**4. Por que o estado de objeto movido não deve ser presumido?**
<sub>Aula [02 — Tipos, referências e value categories](../aulas/02-tipos-referencias-e-value-categories.md)</sub>
<details><summary>Ver resposta</summary>

O tipo define o estado válido resultante. Tipos padrão geralmente permanecem válidos, mas seu valor pode ser não especificado; consulto o contrato antes de reutilizar conteúdo.

</details>

### Aula 03 — [Classes, invariantes e special member functions](../aulas/03-classes-invariantes-e-special-members.md)

**5. Por que Rule of Zero reduz bugs?**
<sub>Aula [03 — Classes, invariantes e special member functions](../aulas/03-classes-invariantes-e-special-members.md)</sub>
<details><summary>Ver resposta</summary>

Membros RAII existentes já implementam cópia/move/destruição apropriados, reduzindo lógica manual de ownership que poderia causar leak, shallow copy incorreta ou double free.

</details>

**6. Por que a ordem da lista de inicialização pode enganar?**
<sub>Aula [03 — Classes, invariantes e special member functions](../aulas/03-classes-invariantes-e-special-members.md)</sub>
<details><summary>Ver resposta</summary>

Membros são inicializados na ordem em que aparecem na classe, não na ordem da lista do construtor. Se um membro depende de outro, declarar e inicializar na ordem correta evita leitura prematura.

</details>

### Aula 04 — [Lifetime, RAII e smart pointers](../aulas/04-lifetime-raii-e-smart-pointers.md)

**7. Por que `unique_ptr` é o padrão preferível a `shared_ptr` quando possível?**
<sub>Aula [04 — Lifetime, RAII e smart pointers](../aulas/04-lifetime-raii-e-smart-pointers.md)</sub>
<details><summary>Ver resposta</summary>

Expressa dono único e transferência explícita, evita contador e ciclos de posse compartilhada. `shared_ptr` é apropriado quando há compartilhamento real de lifetime.

</details>

**8. Por que `weak_ptr` ajuda com ciclos?**
<sub>Aula [04 — Lifetime, RAII e smart pointers](../aulas/04-lifetime-raii-e-smart-pointers.md)</sub>
<details><summary>Ver resposta</summary>

Não incrementa a contagem forte. Se um grafo de objetos precisa de referências de volta, trocar uma aresta para weak permite que a contagem forte chegue a zero.

</details>

### Aula 05 — [Herança, polimorfismo e composição](../aulas/05-heranca-polimorfismo-e-composicao.md)

**9. Por que destrutor não virtual pode ser incorreto?**
<sub>Aula [05 — Herança, polimorfismo e composição](../aulas/05-heranca-polimorfismo-e-composicao.md)</sub>
<details><summary>Ver resposta</summary>

Destruir objeto derivado por ponteiro à base sem destrutor virtual tem comportamento indefinido. Destrutor virtual garante despacho para a destruição derivada.

</details>

**10. Por que composição pode ser preferível a herança?**
<sub>Aula [05 — Herança, polimorfismo e composição](../aulas/05-heranca-polimorfismo-e-composicao.md)</sub>
<details><summary>Ver resposta</summary>

Composição reutiliza comportamento sem prometer subtipagem e reduz acoplamento a detalhes da classe base. Herança pública deve representar substituição legítima.

</details>

### Aula 06 — [Templates, generics e concepts](../aulas/06-templates-e-concepts.md)

**11. Por que Concepts melhoram diagnóstico de template?**
<sub>Aula [06 — Templates, generics e concepts](../aulas/06-templates-e-concepts.md)</sub>
<details><summary>Ver resposta</summary>

Expressam requisitos nomeados na interface e removem candidatos que não os satisfazem, frequentemente produzindo mensagens mais próximas do contrato esperado.

</details>

**12. Por que template pode aumentar compile time e tamanho do binário?**
<sub>Aula [06 — Templates, generics e concepts](../aulas/06-templates-e-concepts.md)</sub>
<details><summary>Ver resposta</summary>

Instanciações para muitos tipos geram código e trabalho de compilação. Type erasure ou interface virtual podem reduzir instanciações, mas introduzem indireção/runtime e outros trade-offs.

</details>

### Aula 07 — [STL: containers, iterators e algorithms](../aulas/07-stl-containers-iterators-e-algorithms.md)

**13. Por que `vector` costuma ser a sequência padrão?**
<sub>Aula [07 — STL: containers, iterators e algorithms](../aulas/07-stl-containers-iterators-e-algorithms.md)</sub>
<details><summary>Ver resposta</summary>

Tem armazenamento contíguo, bom acesso aleatório e localidade. Inserções podem realocar e invalidar referências; outras estruturas são melhores se operações e estabilidade de iteradores exigirem.

</details>

**14. Por que conferir invalidação após inserir no container?**
<sub>Aula [07 — STL: containers, iterators e algorithms](../aulas/07-stl-containers-iterators-e-algorithms.md)</sub>
<details><summary>Ver resposta</summary>

Cada container define quais iteradores/referências continuam válidos. Usar uma referência invalidada pode ser UB ou comportamento incorreto; o contrato muda conforme operação e estrutura.

</details>

### Aula 08 — [Exceções e tratamento de erros](../aulas/08-excecoes-e-erros.md)

**15. Por que RAII combina com exceções?**
<sub>Aula [08 — Exceções e tratamento de erros](../aulas/08-excecoes-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

Durante stack unwinding, objetos automáticos são destruídos, e seus destrutores liberam recursos. Assim, cleanup ocorre também nos caminhos excepcionais sem duplicar blocos manuais.

</details>

**16. Quando um retorno `expected` pode comunicar melhor que exceção?**
<sub>Aula [08 — Exceções e tratamento de erros](../aulas/08-excecoes-e-erros.md)</sub>
<details><summary>Ver resposta</summary>

Quando falha é resultado normal e precisa ser inspecionado explicitamente pelo chamador. `expected` é C++23; API, versão e frequência/custo também importam.

</details>

### Aula 09 — [Lambdas, move semantics e callable objects](../aulas/09-lambdas-e-move-semantics.md)

**17. Por que capturar por valor em callback que escapa pode ser mais seguro?**
<sub>Aula [09 — Lambdas, move semantics e callable objects](../aulas/09-lambdas-e-move-semantics.md)</sub>
<details><summary>Ver resposta</summary>

Captura por valor guarda cópia do dado no closure e não depende do lifetime da variável local original. Ainda é necessário considerar custo da cópia e lifetime de objetos que essa cópia referencia.

</details>

**18. Por que preferir tipo concreto de lambda a `std::function` em alguns casos?**
<sub>Aula [09 — Lambdas, move semantics e callable objects](../aulas/09-lambdas-e-move-semantics.md)</sub>
<details><summary>Ver resposta</summary>

Tipo concreto evita type erasure e pode permitir otimização/inlining; `std::function` é útil quando preciso armazenar callables de tipos diferentes sob uma assinatura comum, com custo potencial de indireção/alocação.

</details>

### Aula 10 — [Concorrência e modelo de memória](../aulas/10-concorrencia-e-modelo-de-memoria.md)

**19. Por que `memory_order_relaxed` pode ser difícil de usar corretamente?**
<sub>Aula [10 — Concorrência e modelo de memória](../aulas/10-concorrencia-e-modelo-de-memoria.md)</sub>
<details><summary>Ver resposta</summary>

Garante atomicidade da operação, mas não estabelece por si só a ordenação/visibilidade de outros acessos. Só é correto quando a lógica não depende dessas relações ou quando outra sincronização as estabelece.

</details>

**20. Por que joinar uma thread antes de destruir dados compartilhados?**
<sub>Aula [10 — Concorrência e modelo de memória](../aulas/10-concorrencia-e-modelo-de-memoria.md)</sub>
<details><summary>Ver resposta</summary>

Join confirma que a thread terminou antes de o dono liberar os objetos que ela poderia acessar. Sem isso, pode haver data race ou referência pendente.

</details>
