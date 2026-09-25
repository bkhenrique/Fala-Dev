# Aula 14 — Estruturas de dados, algoritmos e Big O

> **Objetivo:** saber analisar o custo de um código com Big O, conhecer as estruturas de dados que mais aparecem no dia a dia (array, lista, pilha, fila, hash, árvore, heap, grafo) e os padrões de algoritmo que caem em entrevista técnica, explicando o raciocínio em voz alta.

---

## 1. O problema

Um código que funciona com 100 itens pode travar com 1 milhão. Escolher a estrutura certa é a diferença entre uma busca instantânea e uma rota que dá timeout. E muitas entrevistas têm uma etapa de **algoritmos**, em que o que mais conta é **explicar o raciocínio** e o **custo** da solução, não só chegar na resposta.

---

## 2. Big O: como o custo cresce

**Big O** descreve como o tempo (ou a memória) **cresce** quando a entrada `n` cresce, ignorando constantes. Não mede segundos; mede **escala**.

| Notação | Nome | Exemplo | n = 1 milhão |
|---|---|---|---|
| **O(1)** | Constante | Acessar `array[i]`, buscar num hash | 1 operação |
| **O(log n)** | Logarítmica | Busca binária, árvore balanceada | ~20 |
| **O(n)** | Linear | Percorrer uma lista | 1 milhão |
| **O(n log n)** | Linearítmica | Ordenação eficiente (merge sort) | ~20 milhões |
| **O(n²)** | Quadrática | Loop dentro de loop sobre os mesmos dados | 1 trilhão 💥 |
| **O(2ⁿ)** | Exponencial | Testar todos os subconjuntos | inviável |

Regras práticas:
- Loops **em sequência** somam: O(n) + O(n) = O(n).
- Loops **aninhados** multiplicam: O(n) × O(n) = O(n²).
- Dividir o problema pela metade a cada passo = **O(log n)**.
- Descarta constantes e termos menores: O(2n + 10) = O(n).

Outros conceitos:
- **Pior caso, caso médio, melhor caso**: normalmente se fala do **pior** (ou do médio, deixando claro).
- **Complexidade de espaço**: quanta memória extra o algoritmo usa.
- **Amortizado**: uma operação às vezes é cara, mas na média é barata (o `push` num array dinâmico que ocasionalmente dobra de tamanho é **O(1) amortizado**).

Exemplo real do dia a dia: `lista.includes(x)` dentro de um `for` sobre outra lista é **O(n × m)**. Transformar a segunda lista num `Set` antes deixa **O(n + m)**. É um dos ganhos de performance mais comuns em código de produção.

---

## 3. As estruturas de dados

### Array (vetor)
Elementos **contíguos** na memória.
- Acesso por índice **O(1)**; busca por valor **O(n)**; inserir/remover no meio **O(n)** (desloca os outros); no fim, **O(1) amortizado**.
- Muito amigável ao **cache da CPU**. Na prática, é a estrutura padrão.

### Lista ligada
Nós com valor + ponteiro pro próximo (e pro anterior, se duplamente ligada).
- Inserir/remover num ponto que você **já tem** é **O(1)**; achar o ponto é **O(n)**; sem acesso por índice.
- Raramente é a melhor escolha em aplicações comuns, mas é base de outras estruturas (e de pergunta de entrevista).

### Pilha (stack): LIFO
Último a entrar, primeiro a sair. `push`/`pop` **O(1)**.
Usos: call stack, desfazer (Ctrl+Z), validar parênteses, DFS.

### Fila (queue): FIFO
Primeiro a entrar, primeiro a sair. `enqueue`/`dequeue` **O(1)**.
Usos: processar tarefas em ordem, BFS, filas de mensagens.

### Tabela hash (hash map, dicionário, `Map`, `dict`, `HashMap`)
Chave → valor. Uma **função hash** transforma a chave num índice do array interno.
- Inserir, buscar e remover em **O(1) em média**.
- **Colisões** (chaves diferentes no mesmo índice) são tratadas com listas ou árvores por "gaveta"; com muitas colisões, degrada pra O(n).
- **Fator de carga**: quando enche demais, a tabela cresce e redistribui (*rehash*).
- É a estrutura que **mais resolve problemas** de entrevista: contar ocorrências, detectar duplicata, lembrar o que já foi visto.

### Árvore
Nós com filhos, a partir de uma raiz.
- **Árvore binária de busca (BST)**: à esquerda os menores, à direita os maiores. Busca **O(log n)** se estiver **balanceada**; se degenerar (virar uma "linha"), O(n).
- **Árvores balanceadas** (rubro-negra, AVL) garantem O(log n): é o que está por trás do `TreeMap` do Java.
- **B-Tree**: árvore com muitos filhos por nó, otimizada pra disco. É a estrutura dos **índices de banco de dados** (ver [aula 05](05-banco-relacional.md)).
- **Trie**: árvore de prefixos, usada em autocomplete.

### Heap e fila de prioridade
Árvore em que o pai é sempre menor (min-heap) ou maior (max-heap) que os filhos.
- Pegar o menor/maior é **O(1)**; inserir e remover, **O(log n)**.
- Usos: **fila de prioridade** (jobs mais urgentes primeiro), "os K maiores", algoritmo de Dijkstra.

### Grafo
Vértices ligados por arestas (com ou sem direção, com ou sem peso). Representado por **lista de adjacência** (mais comum) ou matriz.
- **BFS** (busca em largura, usa fila): menor caminho em número de passos; "amigos de amigos".
- **DFS** (busca em profundidade, usa pilha ou recursão): explorar tudo, detectar ciclos, ordenação topológica (ordem de dependências, como no build).
- Usos: rotas, redes sociais, dependências entre pacotes, recomendação.

---

## 4. Ordenação e busca

- **Busca binária**: em dados **ordenados**, compara com o meio e descarta metade a cada passo: **O(log n)**.
- **Ordenações eficientes**: merge sort (O(n log n) sempre, **estável**, usa memória extra), quicksort (O(n log n) na média, O(n²) no pior caso, rápido na prática), heapsort.
- **Estável** = mantém a ordem original entre elementos iguais (importa ao ordenar por vários critérios).
- As bibliotecas padrão usam algoritmos híbridos (ex.: **Timsort** no Python e no Java para objetos). No dia a dia, **use o `sort` da linguagem**; o que você precisa saber é que ordenar custa **O(n log n)**.

---

## 5. Padrões que resolvem a maioria dos problemas

| Padrão | Ideia | Exemplo |
|---|---|---|
| **Hash map pra lembrar** | Guardar o que já viu pra responder em O(1) | "Two sum": achar dois números que somam X em O(n) |
| **Dois ponteiros** | Um no início e outro no fim (ou um lento e um rápido) | Verificar palíndromo; remover duplicatas de array ordenado |
| **Janela deslizante** | Manter um intervalo que anda pela sequência | Maior substring sem caracteres repetidos |
| **Ordenar antes** | Ordenar (n log n) pra simplificar o resto | Agrupar intervalos sobrepostos |
| **BFS/DFS** | Explorar grafo ou árvore | Contar ilhas numa matriz |
| **Recursão / dividir e conquistar** | Resolver partes menores e combinar | Merge sort, percorrer árvore |
| **Programação dinâmica** | Guardar resultados de subproblemas pra não recalcular (memoização) | Fibonacci eficiente, menor custo de caminho |

---

## 6. Como se comportar numa entrevista de algoritmo

1. **Entenda o problema**: repita com suas palavras, pergunte limites (tamanho da entrada, valores negativos, vazio, duplicatas).
2. **Dê exemplos** pequenos, inclusive casos de borda.
3. **Comece pela força bruta** e diga a complexidade dela: "a solução direta é O(n²), comparando todos os pares".
4. **Otimize** explicando o raciocínio: "se eu guardar o que já vi num hash map, cada busca vira O(1), e o total cai pra O(n) de tempo, com O(n) de memória".
5. **Codifique** falando em voz alta.
6. **Teste** com os exemplos e casos de borda.
7. **Diga a complexidade final** de tempo e de espaço.

Travou? **Pensar em voz alta** é melhor que o silêncio: o entrevistador avalia o raciocínio e pode dar uma dica.

---

## 7. Como falar na entrevista

**"Qual a complexidade dessa solução e como melhoraria?"**
> "Do jeito que está, tenho um loop dentro de outro sobre a mesma lista, então é O(n²) de tempo. Dá pra trocar o loop interno por um hash set com os elementos já vistos: cada verificação passa a ser O(1) em média, e o total cai pra O(n) de tempo, com O(n) de memória extra. É o trade-off clássico: gasto memória pra ganhar tempo."

**"Quando usar um hash map e quando usar uma árvore?"**
> "Hash map quando só preciso de busca, inserção e remoção por chave: é O(1) em média, mas não tem ordem. Árvore balanceada quando preciso das chaves ordenadas ou de consultas por faixa, tipo 'todos entre A e B', com O(log n) por operação. É a mesma lógica de o banco usar B-Tree nos índices: permite igualdade e faixa."

---

## 8. Resumo

- **Big O** mede **como o custo cresce**: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ).
- Loops em sequência somam, aninhados multiplicam; dividir pela metade = log n; **amortizado**.
- **Array** (índice O(1)), **lista ligada**, **pilha** (LIFO), **fila** (FIFO), **hash** (O(1) médio, colisões), **árvore** (balanceada O(log n), B-Tree nos índices), **heap** (prioridade), **grafo** (BFS/DFS).
- Ordenar custa **O(n log n)**; busca binária **O(log n)** em dados ordenados.
- Padrões: hash pra lembrar, dois ponteiros, janela deslizante, ordenar antes, BFS/DFS, programação dinâmica.
- Na entrevista: entender, exemplos, **força bruta → otimizar**, pensar em voz alta, testar, dizer tempo e espaço.

## Termos desta aula
estrutura de dados · algoritmo · Big O · complexidade de tempo · complexidade de espaço · pior caso · amortizado · array · lista ligada · pilha · LIFO · fila · FIFO · tabela hash · função hash · colisão · fator de carga · árvore · árvore binária de busca · árvore balanceada · B-Tree · trie · heap · fila de prioridade · grafo · lista de adjacência · BFS · DFS · ordenação topológica · busca binária · merge sort · quicksort · ordenação estável · dois ponteiros · janela deslizante · recursão · programação dinâmica · memoização · força bruta

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 14** e separadas por nível.
