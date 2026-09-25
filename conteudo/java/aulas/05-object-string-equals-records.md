# Aula 05 — Object, equals/hashCode, String e Records

> **Objetivo:** entender os métodos da classe `Object` que todo mundo usa, o contrato de `equals` e `hashCode`, por que `String` é imutável e como usar `StringBuilder`, e o que são Records.

---

## 1. A classe `Object`

Toda classe Java herda de `java.lang.Object`. Os métodos que mais importam:

| Método | Pra que serve |
|---|---|
| `equals(Object)` | Igualdade **lógica** entre objetos |
| `hashCode()` | Número usado por coleções baseadas em hash |
| `toString()` | Representação em texto (logs, debug) |
| `getClass()` | Classe em runtime |

Os três primeiros você normalmente **sobrescreve** em classes de dados.

---

## 2. `==` vs `equals`

- **`==`** compara **referências** (é o mesmo objeto na memória?). Para primitivos, compara valores.
- **`equals`** compara **conteúdo/igualdade lógica** (representam a mesma coisa?).

```java
String a = new String("java");
String b = new String("java");
a == b;          // false: objetos diferentes
a.equals(b);     // true: mesmo conteúdo
```

O `equals` padrão de `Object` é igual ao `==`. Por isso você sobrescreve quando dois objetos diferentes devem ser considerados iguais (ex: dois `Cpf` com o mesmo número).

---

## 3. O contrato `equals` e `hashCode`

**Regra de ouro:** se dois objetos são **iguais pelo `equals`**, eles **precisam** ter o **mesmo `hashCode`**. (O contrário não é obrigatório: hashCodes iguais podem ser objetos diferentes, isso é uma **colisão**.)

**Sobrescreveu um, sobrescreva o outro.**

### Por quê? Como o `HashMap` funciona
1. Calcula o `hashCode()` da chave → escolhe o **bucket** (a "gaveta").
2. Dentro da gaveta, usa `equals()` pra achar a chave exata.

Se você sobrescreve só o `equals`:
```java
Set<Cpf> cpfs = new HashSet<>();
cpfs.add(new Cpf("123"));
cpfs.contains(new Cpf("123"));   // false!! hashCode diferente → procura na gaveta errada
```
E o `HashSet` passa a aceitar "duplicatas".

### Implementação correta
```java
@Override
public boolean equals(Object o) {
  if (this == o) return true;
  if (!(o instanceof Cpf outro)) return false;
  return numero.equals(outro.numero);
}

@Override
public int hashCode() {
  return Objects.hash(numero);
}
```

Propriedades do `equals`: **reflexivo** (a = a), **simétrico** (a = b ⇔ b = a), **transitivo**, **consistente**, e `x.equals(null)` é `false`.

Cuidado: usar campos **mutáveis** no `hashCode` e alterá-los depois de colocar o objeto num `HashSet` faz o objeto "sumir" do conjunto.

### Em entidades JPA
Entidades com ID gerado pelo banco são armadilha: antes de salvar, o ID é `null`. Estratégias comuns: comparar por uma **chave de negócio** imutável, ou pelo ID com cuidado (hashCode constante por classe). Vale saber que o tema é delicado.

---

## 4. String

### Imutável
Toda operação que "altera" uma `String` **cria outra**:
```java
String s = "olá";
s.toUpperCase();        // retorna "OLÁ", mas s continua "olá"
s = s.toUpperCase();    // agora s aponta pra nova String
```

Por que imutável?
- **Segurança**: strings são usadas em URLs, caminhos, senhas, nomes de classe. Ninguém consegue alterar depois de validar.
- **Thread-safe**.
- **Cache do hashCode**: calculado uma vez, ótimo pra chave de `HashMap`.
- Permite o **String Pool**.

### String Pool
Literais são guardados num **pool** (no heap) e **reaproveitados**:
```java
String a = "java";
String b = "java";
a == b;                       // true: mesmo objeto do pool
new String("java") == a;      // false: new força um objeto novo
```
Mesmo assim: **compare Strings com `equals`**, sempre.

### Concatenação em loop: use `StringBuilder`
```java
// ❌ cria uma String nova a cada volta → O(n²) em cópias
String resultado = "";
for (String item : itens) resultado += item + ",";

// ✅ um buffer mutável
StringBuilder sb = new StringBuilder();
for (String item : itens) sb.append(item).append(',');
String resultado = sb.toString();
```
- **`StringBuilder`**: mutável, **não** sincronizado, rápido. O normal.
- **`StringBuffer`**: mutável e **sincronizado** (thread-safe), mais lento. Legado, raramente necessário.

(Concatenação simples fora de loop, `"a" + b`, o compilador já otimiza.)

Outras: **text blocks** (Java 15+) para strings de várias linhas (`"""..."""`), `String.join`, `String.format` / `formatted`.

---

## 5. Records (Java 16+)

Muitas classes existem só para **carregar dados** (DTOs, value objects). Antes, era um monte de boilerplate: construtor, getters, `equals`, `hashCode`, `toString`. (Muita gente usava **Lombok** pra gerar.)

```java
public record Endereco(String rua, String cidade, String cep) {}
```

Isso gera automaticamente:
- Atributos `private final`.
- Construtor com todos os campos (**construtor canônico**).
- Acessores `rua()`, `cidade()`, `cep()` (sem o prefixo `get`).
- `equals`, `hashCode` e `toString` baseados em **todos** os campos.

Características:
- **Imutável** (raso: se um campo for uma lista mutável, a lista em si pode mudar; use `List.copyOf`).
- É `final`: não pode ser estendido. Pode implementar interfaces.
- Dá pra validar no **construtor compacto**:
```java
public record Email(String valor) {
  public Email {
    if (!valor.contains("@")) throw new IllegalArgumentException("e-mail inválido");
  }
}
```

Quando usar: **DTOs** de request/response, **value objects** (Email, Dinheiro, Cpf), retornos com múltiplos valores, chaves compostas de Map.
Quando **não** usar: **entidades JPA** (precisam ser mutáveis, ter construtor sem argumentos e proxies).

---

## 6. Como falar na entrevista

**"Por que sobrescrever equals e hashCode juntos?"**
> "Porque coleções baseadas em hash usam o hashCode pra achar o bucket e o equals pra comparar dentro dele. O contrato diz que objetos iguais pelo equals precisam ter o mesmo hashCode. Se eu sobrescrevo só o equals, dois objetos iguais caem em buckets diferentes: o HashMap não encontra a chave e o HashSet aceita duplicata. Hoje, pra classes de dados, uso record, que já gera os dois."

**"Por que String é imutável?"**
> "Segurança, porque strings carregam coisas como caminhos e credenciais e não podem mudar depois de validadas; thread-safety; cache do hashCode, que faz dela uma boa chave de mapa; e o string pool, que reaproveita literais. Pra montar string em loop uso StringBuilder, porque concatenar cria uma String nova a cada iteração."

---

## 7. Resumo

- `Object`: `equals`, `hashCode`, `toString`.
- **`==`** referência × **`equals`** conteúdo.
- **Iguais no equals ⇒ mesmo hashCode**. Sobrescreveu um, sobrescreva o outro.
- HashMap: hashCode → bucket; equals → chave exata.
- **String imutável**: segurança, thread-safe, hash em cache, **pool**.
- Loop: **StringBuilder** (StringBuffer é o sincronizado/legado).
- **Records**: classe de dados imutável com construtor, acessores, equals/hashCode/toString; não para entidades JPA.

## Termos desta aula
Object · equals · hashCode · toString · igualdade de referência · igualdade lógica · contrato equals/hashCode · bucket · colisão · reflexivo · simétrico · transitivo · Objects.hash · String imutável · String Pool · literal · StringBuilder · StringBuffer · text block · record · construtor canônico · construtor compacto · value object · DTO · Lombok · boilerplate

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 05** e separadas por nível.
