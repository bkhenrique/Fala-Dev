# Aula 03 — Orientação a Objetos (parte 1): classes, objetos, encapsulamento, static e final

> **Objetivo:** dominar o vocabulário básico de OO em Java: classe, objeto, atributos, métodos, construtores, modificadores de acesso, encapsulamento, `static` e `final`.

---

## 1. Classe e objeto

- **Classe**: o **molde**. Define quais dados (**atributos**) e comportamentos (**métodos**) algo tem.
- **Objeto** (ou **instância**): uma coisa **concreta** criada a partir do molde, com seus próprios valores.

> Analogia: a classe é a **planta** da casa; os objetos são as **casas** construídas com ela. Cada casa tem sua cor, mas todas seguem a mesma planta.

```java
public class ContaBancaria {
  private String titular;        // atributo (estado)
  private double saldo;

  public ContaBancaria(String titular) {   // construtor
    this.titular = titular;
    this.saldo = 0;
  }

  public void depositar(double valor) {    // método (comportamento)
    if (valor <= 0) throw new IllegalArgumentException("valor inválido");
    this.saldo += valor;
  }

  public double getSaldo() { return saldo; }
}

ContaBancaria conta = new ContaBancaria("Ana");   // instanciação
conta.depositar(100);
```

- **`new`** aloca o objeto no heap e chama o **construtor**.
- **`this`** referencia o próprio objeto.
- Se você não escreve construtor, o Java cria um **construtor padrão** vazio. Pode haver vários construtores (**sobrecarga**), e um pode chamar outro com `this(...)`.

---

## 2. Modificadores de acesso

| Modificador | Visível em |
|---|---|
| `public` | Qualquer lugar |
| `protected` | Mesmo pacote **+ subclasses** (mesmo em outro pacote) |
| *(nenhum)* **package-private** | Só no mesmo **pacote** |
| `private` | Só dentro da **própria classe** |

Regra geral: **o mais restrito possível**. Atributos quase sempre `private`.

---

## 3. Encapsulamento

**Encapsulamento** = **esconder o estado interno** do objeto e só permitir alterá-lo por métodos que **garantem as regras**.

No exemplo acima, ninguém consegue fazer `conta.saldo = -1000`, porque `saldo` é `private`. Para mudar, tem que passar por `depositar`, que **valida**. O objeto protege suas **invariantes** (regras que devem ser sempre verdadeiras, como "valor de depósito é positivo").

> Analogia: você usa o **controle remoto**, não abre a TV pra mexer nos circuitos.

### Getters e setters não são encapsulamento automático
```java
public void setSaldo(double saldo) { this.saldo = saldo; }  // ❌ qualquer um define qualquer saldo
```
Gerar getter e setter pra tudo é só um atributo público com mais passos. Encapsulamento de verdade é expor **comportamento com significado** (`depositar`, `sacar`, `bloquear`) em vez de setters genéricos.

- **Modelo anêmico** (*anemic domain model*): classes só com getters/setters, e toda regra espalhada em "services". Muito comum, e criticado no DDD.
- **Modelo rico**: a regra vive dentro do objeto (`conta.sacar(valor)` valida saldo).

---

## 4. `static`: pertence à classe, não ao objeto

```java
public class Pedido {
  private static int totalCriados = 0;       // compartilhado por TODAS as instâncias
  public static final double TAXA = 0.05;    // constante

  public Pedido() { totalCriados++; }

  public static int getTotalCriados() { return totalCriados; }  // chamado pela classe
}

Pedido.getTotalCriados();
Math.max(1, 2);           // métodos utilitários são static
```

- Atributo `static`: **um só** para a classe inteira.
- Método `static`: chamado sem instância; **não** acessa `this` nem atributos de instância.
- Usos: constantes, métodos utilitários, factory methods (`List.of(...)`).

Cuidado: **estado estático mutável** é, na prática, uma **variável global**: dificulta testes e é perigoso com várias threads.

---

## 5. `final`: não pode mudar

| Onde | Significado |
|---|---|
| Variável/atributo `final` | Só pode ser atribuído **uma vez** |
| Método `final` | Não pode ser **sobrescrito** |
| Classe `final` | Não pode ser **estendida** (ex: `String`) |

Atenção: `final` numa referência impede **trocar o objeto**, mas **não** impede **alterar o conteúdo** dele:
```java
final List<String> nomes = new ArrayList<>();
nomes.add("Ana");          // ✅ permitido
nomes = new ArrayList<>(); // ❌ erro de compilação
```

---

## 6. Imutabilidade

Um objeto **imutável** não muda depois de criado. Exemplos: `String`, `Integer`, `LocalDate`, **records**.

Como criar:
- Classe `final`, atributos `private final`, sem setters.
- Cópias defensivas de coleções recebidas/retornadas (`List.copyOf`).
- "Alterar" = criar um **novo** objeto (`data.plusDays(1)` retorna outra data).

Vantagens:
- **Thread-safe** por natureza (ninguém muda, ninguém briga).
- Fácil de raciocinar, seguro como chave de `HashMap`, sem efeitos colaterais inesperados.

Custo: criar mais objetos (geralmente irrelevante).

---

## 7. Pacotes e imports

- **Pacote** (`package com.loja.pedidos;`) organiza classes e define o escopo do package-private.
- Convenção: domínio invertido (`com.empresa.projeto.modulo`).
- **Organizar por feature** (`pedidos`, `pagamentos`) em vez de por tipo técnico (`controllers`, `services`) permite usar package-private para esconder detalhes internos do módulo.

---

## 8. Como falar na entrevista

**"O que é encapsulamento?"**
> "É esconder o estado interno do objeto e só permitir alterá-lo por métodos que garantem as regras, as invariantes. Na prática, atributos privados e métodos com significado de negócio, tipo depositar e sacar, em vez de setter pra tudo, porque getter e setter genérico é só um atributo público disfarçado. Isso evita estado inválido e deixa a regra num lugar só."

**"Pra que serve o final?"**
> "Variável final só é atribuída uma vez, método final não pode ser sobrescrito e classe final não pode ser estendida. Numa referência, impede trocar o objeto, mas não impede alterar o conteúdo dele. Uso muito pra construir objetos imutáveis, que são thread-safe por natureza."

---

## 9. Resumo

- **Classe** = molde; **objeto** = instância; `new` + **construtor**; `this`.
- Acesso: `public` > `protected` > package-private > `private`. Use o mais restrito.
- **Encapsulamento**: estado privado + métodos que protegem **invariantes**. Setter pra tudo não é encapsulamento.
- **Modelo anêmico** × **modelo rico**.
- **`static`**: da classe; estado estático mutável = global.
- **`final`**: atribuição única / não sobrescreve / não estende. Não torna o conteúdo imutável.
- **Imutabilidade**: thread-safe, previsível.

## Termos desta aula
classe · objeto · instância · atributo · método · construtor · sobrecarga de construtor · this · modificador de acesso · public · protected · package-private · private · encapsulamento · invariante · getter · setter · modelo anêmico · modelo rico · static · constante · método utilitário · final · imutabilidade · thread-safe · cópia defensiva · pacote

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 03** e separadas por nível.
