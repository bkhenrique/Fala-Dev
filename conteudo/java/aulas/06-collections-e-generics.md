# Aula 06 — Collections e Generics

> **Objetivo:** conhecer as estruturas de dados do Java (List, Set, Map, Queue), quando usar cada implementação, como o `HashMap` funciona por dentro, e o que são generics e type erasure.

---

## 1. A hierarquia

```
Iterable
 └── Collection
      ├── List    → ordenada, aceita duplicatas, acesso por índice
      │     ├── ArrayList
      │     └── LinkedList
      ├── Set     → sem duplicatas
      │     ├── HashSet
      │     ├── LinkedHashSet
      │     └── TreeSet
      └── Queue / Deque → fila / fila de duas pontas
            ├── ArrayDeque
            └── PriorityQueue

Map (não herda de Collection) → pares chave → valor
 ├── HashMap
 ├── LinkedHashMap
 └── TreeMap
```

Boa prática: **declare pela interface**, instancie pela implementação:
```java
List<String> nomes = new ArrayList<>();       // ✅ fácil de trocar a implementação
ArrayList<String> nomes = new ArrayList<>();  // ❌ acopla à implementação
```

---

## 2. Notação Big O (rapidinho)

**Big O** descreve como o custo cresce com o tamanho `n` dos dados:
- **O(1)**: constante (não importa o tamanho).
- **O(log n)**: cresce devagar (árvore balanceada, busca binária).
- **O(n)**: proporcional (percorrer a lista).
- **O(n²)**: quadrático (loop dentro de loop).

É assim que se justifica a escolha de estrutura em entrevista.

---

## 3. List

| | **ArrayList** | **LinkedList** |
|---|---|---|
| Por dentro | **Array** que cresce (redimensiona ~50% quando enche) | **Lista duplamente encadeada** (nós com ponteiros) |
| `get(i)` | **O(1)** | O(n) |
| Adicionar no fim | O(1) amortizado | O(1) |
| Inserir/remover no meio | O(n) (desloca elementos) | O(n) pra achar + O(1) pra ligar |
| Memória / cache da CPU | Compacta, amigável | Um objeto por nó, espalhado |

Na prática, **ArrayList ganha quase sempre**. LinkedList raramente é a melhor escolha; para fila/pilha, use **`ArrayDeque`**.

---

## 4. Set

| | Ordem | Operações | Por dentro |
|---|---|---|---|
| **HashSet** | Nenhuma garantida | O(1) médio | Um HashMap por baixo |
| **LinkedHashSet** | **Ordem de inserção** | O(1) médio | Hash + lista ligada |
| **TreeSet** | **Ordenado** (natural ou Comparator) | O(log n) | Árvore rubro-negra |

Uso típico: remover duplicatas, verificar "já vi isso?" em O(1).
Depende de **`equals`/`hashCode`** corretos (Hash*) ou de **`compareTo`/Comparator** (Tree*).

---

## 5. Map e como o HashMap funciona

| | Ordem | Operações |
|---|---|---|
| **HashMap** | Nenhuma | O(1) médio |
| **LinkedHashMap** | Inserção (ou acesso → dá pra fazer **cache LRU**) | O(1) médio |
| **TreeMap** | Chaves ordenadas; `firstKey`, `subMap`, faixas | O(log n) |

### Por dentro do HashMap
```
tabela (array de buckets)
[0] → null
[1] → (chave A, valor) → (chave K, valor)    ← colisão: mesmo bucket
[2] → (chave B, valor)
...
```
1. `hash = chave.hashCode()` (com um "espalhamento" extra) → índice = hash & (tamanho - 1).
2. No bucket, percorre comparando com **`equals`**.
3. **Colisões** formam uma lista ligada; a partir do **Java 8**, se um bucket passar de **8** elementos (e a tabela for grande), vira **árvore** balanceada: o pior caso cai de O(n) para O(log n).
4. **Load factor** (fator de carga) padrão **0,75**: quando 75% da capacidade é ocupada, a tabela **dobra** e tudo é redistribuído (*rehash*), uma operação cara. Se você sabe o tamanho, passe a capacidade inicial.

Por isso **hashCode ruim** (ex: sempre retorna 1) transforma o HashMap numa lista lenta. E chave **mutável** alterada depois de inserida "some" do mapa.

`HashMap` aceita **uma chave `null`**; **não é thread-safe**.

---

## 6. Coleções e concorrência

- `HashMap`/`ArrayList` com várias threads escrevendo = dados corrompidos.
- **`ConcurrentHashMap`**: thread-safe com alta concorrência (trava por partes, não o mapa todo). Tem operações atômicas: `computeIfAbsent`, `merge`.
- `Collections.synchronizedList(...)`: trava tudo, mais lenta.
- **`CopyOnWriteArrayList`**: ótima para muitas leituras e raras escritas (ex: lista de listeners).
- **`BlockingQueue`**: fila para padrão produtor-consumidor entre threads.

### ConcurrentModificationException
```java
for (String n : nomes) {
  if (n.isBlank()) nomes.remove(n);   // 💥 ConcurrentModificationException
}
nomes.removeIf(String::isBlank);       // ✅
```
Os iteradores das coleções comuns são **fail-fast**: detectam que a coleção mudou durante a iteração e lançam a exceção (mesmo com uma thread só).

---

## 7. Coleções imutáveis

```java
List<String> fixa = List.of("a", "b");     // imutável; add() lança UnsupportedOperationException
Map<String, Integer> m = Map.of("a", 1);
List<String> copia = List.copyOf(outraLista);
```
Cuidado: `Collections.unmodifiableList(lista)` é uma **visão** somente leitura; se a lista original mudar, a visão mostra a mudança. `List.copyOf` faz uma cópia de verdade.

---

## 8. Generics

**Generics** permitem parametrizar tipos: `List<Pedido>` em vez de uma lista de `Object`.

```java
List<Pedido> pedidos = new ArrayList<>();
pedidos.add("texto");          // ❌ erro de COMPILAÇÃO (antes seria erro em runtime)
Pedido p = pedidos.get(0);     // sem cast
```
Ganhos: **segurança de tipo em compilação** e sem casts.

Métodos e classes genéricos:
```java
public class Resposta<T> {
  private final T dados;
  ...
}
public static <T extends Comparable<T>> T maior(List<T> lista) { ... }   // bounded type
```

### Type erasure
Os generics existem **só em compilação**. No bytecode, `List<Pedido>` e `List<String>` viram só `List` (*type erasure*, apagamento de tipo), por compatibilidade com código antigo.
Consequências: não dá pra fazer `new T()`, nem `instanceof List<String>`, nem sobrecarregar `metodo(List<String>)` e `metodo(List<Integer>)`.

### Wildcards e PECS
- `List<? extends Numero>`: **lê** Números (produtor). Não dá pra adicionar.
- `List<? super Inteiro>`: **escreve** Inteiros (consumidor).
- Regra **PECS**: *Producer Extends, Consumer Super*.

Detalhe que cai: `List<Integer>` **não é** subtipo de `List<Number>` (generics são **invariantes**), por isso existem os wildcards.

---

## 9. Como falar na entrevista

**"Como funciona um HashMap?"**
> "É um array de buckets. Ele calcula o hashCode da chave pra escolher o bucket e usa o equals pra achar a chave dentro dele. Colisões viram uma lista ligada, e desde o Java 8, se um bucket fica grande, vira uma árvore balanceada, então o pior caso vai de O(n) pra O(log n). Quando a ocupação passa do load factor de 0,75, a tabela dobra e faz rehash. Por isso equals e hashCode precisam estar corretos e as chaves devem ser imutáveis. Não é thread-safe; pra concorrência uso ConcurrentHashMap."

---

## 10. Resumo

- **List** (ordem, duplicatas), **Set** (sem duplicatas), **Map** (chave-valor), **Queue/Deque**.
- Declare pela **interface**.
- **ArrayList** quase sempre > LinkedList; fila/pilha: **ArrayDeque**.
- Hash* O(1) sem ordem; Linked* ordem de inserção; Tree* ordenado O(log n).
- HashMap: buckets, hashCode + equals, colisões → árvore (Java 8), **load factor 0,75**, rehash.
- Concorrência: **ConcurrentHashMap**, CopyOnWriteArrayList, BlockingQueue; iteradores **fail-fast**.
- Imutáveis: `List.of`, `List.copyOf`.
- **Generics**: segurança em compilação; **type erasure**; **PECS**; invariância.

## Termos desta aula
Collection · List · Set · Map · Queue · Deque · ArrayList · LinkedList · HashSet · LinkedHashSet · TreeSet · HashMap · LinkedHashMap · TreeMap · ArrayDeque · PriorityQueue · Big O · amortizado · bucket · colisão · load factor · rehash · árvore rubro-negra · LRU · ConcurrentHashMap · CopyOnWriteArrayList · BlockingQueue · fail-fast · ConcurrentModificationException · coleção imutável · generics · type erasure · bounded type · wildcard · PECS · invariância

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 06** e separadas por nível.
