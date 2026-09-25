# Aula 04 — Orientação a Objetos (parte 2): herança, polimorfismo, abstração e interfaces

> **Objetivo:** explicar os pilares restantes da OO, a diferença entre interface e classe abstrata, overload vs override, e por que "composição em vez de herança" é o conselho mais repetido em design.

---

## 1. Os 4 pilares da OO

1. **Encapsulamento**: esconder estado, expor comportamento (aula 03).
2. **Herança**: uma classe **reaproveita** e especializa outra.
3. **Polimorfismo**: o mesmo método se comporta diferente conforme o objeto real.
4. **Abstração**: expor só o **essencial**, escondendo detalhes de implementação.

---

## 2. Herança

```java
public class Funcionario {
  protected String nome;
  protected double salarioBase;

  public double calcularSalario() { return salarioBase; }
}

public class Gerente extends Funcionario {
  private double bonus;

  @Override
  public double calcularSalario() {
    return super.calcularSalario() + bonus;   // reaproveita o da classe pai
  }
}
```

- `extends`: **Gerente é um Funcionario** (relação **"é um"**, *is-a*).
- A subclasse herda atributos e métodos não privados.
- `super` acessa a classe pai (métodos e construtor).
- Java tem **herança simples de classe**: uma classe só pode estender **uma** classe. (Mas pode implementar várias interfaces.)
- Toda classe herda, direta ou indiretamente, de **`Object`**.

---

## 3. Polimorfismo

"Muitas formas". Uma variável do tipo da classe pai (ou interface) pode apontar para objetos de subclasses diferentes, e **o método executado é o do objeto real**.

```java
List<Funcionario> equipe = List.of(new Funcionario(...), new Gerente(...), new Estagiario(...));

double folha = 0;
for (Funcionario f : equipe) {
  folha += f.calcularSalario();   // cada um executa SUA versão
}
```

O código do `for` **não sabe e não precisa saber** o tipo real. Isso se chama **dynamic dispatch** (despacho dinâmico): a decisão de qual método chamar acontece **em tempo de execução**.

### O ganho real: eliminar `if/else` por tipo
```java
// ❌ sem polimorfismo: todo tipo novo exige mexer aqui
if (pagamento.getTipo().equals("PIX")) { ... }
else if (pagamento.getTipo().equals("CARTAO")) { ... }

// ✅ com polimorfismo (padrão Strategy)
interface MetodoPagamento { void pagar(double valor); }
class Pix implements MetodoPagamento { public void pagar(double v) { ... } }
class Cartao implements MetodoPagamento { public void pagar(double v) { ... } }

metodo.pagar(valor);   // adicionar Boleto = criar uma classe nova, sem mexer no resto
```
Isso é o **Open/Closed Principle** (o "O" do SOLID): **aberto para extensão, fechado para modificação**.

---

## 4. Overload vs Override

| | **Overload (sobrecarga)** | **Override (sobrescrita)** |
|---|---|---|
| O que é | Mesmo nome, **parâmetros diferentes**, na mesma classe | Subclasse **redefine** método da classe pai, mesma assinatura |
| Decidido em | **Compilação** (polimorfismo estático) | **Execução** (polimorfismo dinâmico) |
| Exemplo | `somar(int, int)` e `somar(double, double)` | `Gerente.calcularSalario()` |

Use **`@Override`**: o compilador avisa se você errar a assinatura (e na verdade estiver criando um método novo sem querer).

---

## 5. Abstração: classes abstratas e interfaces

### Classe abstrata
```java
public abstract class Notificacao {
  protected final String destino;
  protected Notificacao(String destino) { this.destino = destino; }

  public void enviar(String msg) {          // comportamento comum (template)
    validar();
    entregar(formatar(msg));
  }
  protected abstract void entregar(String conteudo);  // cada filha implementa
  protected String formatar(String msg) { return msg; }
  private void validar() { ... }
}
```
- **Não pode ser instanciada** (`new Notificacao()` não compila).
- Pode ter **estado** (atributos), construtor, métodos concretos e abstratos.
- Serve para **compartilhar código e estado** entre subclasses parecidas. (O exemplo acima é o padrão **Template Method**.)

### Interface
```java
public interface Notificador {
  void enviar(String destino, String mensagem);

  default void enviarVarios(List<String> destinos, String msg) {   // Java 8+
    destinos.forEach(d -> enviar(d, msg));
  }
}
```
- Define um **contrato**: "quem implementa sabe fazer isso".
- Uma classe pode **implementar várias** interfaces.
- Não tem estado de instância (só constantes).
- Desde o Java 8 pode ter métodos **`default`** e `static`; desde o 9, `private`.

### Qual usar?

| | Interface | Classe abstrata |
|---|---|---|
| Relação | "**sabe fazer**" (*can-do*, capacidade) | "**é um**" (*is-a*, família) |
| Múltiplas | Sim | Não (herança simples) |
| Estado | Não | Sim |
| Construtor | Não | Sim |

Regra prática: **comece por interface**. Use classe abstrata quando houver **estado e código comum de verdade** entre as implementações.

---

## 6. Composição em vez de herança

Herança parece prática, mas tem problemas:
- **Acoplamento forte**: a subclasse depende dos detalhes internos da pai. Mudar a pai quebra as filhas (**fragile base class**).
- Hierarquias profundas ficam difíceis de entender.
- Herança é decidida em compilação e é **uma só**.

**Composição** = a classe **tem** outro objeto (relação **"tem um"**, *has-a*) e **delega** a ele:
```java
public class ServicoPedido {
  private final Notificador notificador;      // TEM um notificador
  public ServicoPedido(Notificador n) { this.notificador = n; }
  public void concluir(Pedido p) { ...; notificador.enviar(p.email(), "Pedido concluído"); }
}
```
Flexível: troca o comportamento passando outro `Notificador` (inclusive em teste), combinando com **injeção de dependência**.

> **"Favor composition over inheritance"** (livro *Design Patterns*, Gang of Four). Use herança quando for **realmente** "é um" e a substituição for segura.

### Liskov (o "L" do SOLID)
**Princípio da Substituição de Liskov**: onde se espera a classe pai, **qualquer subclasse deve funcionar sem surpresas**. Exemplo clássico da violação: `Quadrado extends Retangulo`. Se `setLargura` num quadrado muda também a altura, um código que espera um retângulo quebra. É sinal de que a herança está errada.

---

## 7. Novidades úteis: sealed classes e pattern matching

```java
public sealed interface Forma permits Circulo, Quadrado {}     // Java 17
public record Circulo(double raio) implements Forma {}
public record Quadrado(double lado) implements Forma {}

double area(Forma f) {
  return switch (f) {                                         // Java 21
    case Circulo c -> Math.PI * c.raio() * c.raio();
    case Quadrado q -> q.lado() * q.lado();
  };  // o compilador sabe que não há outros casos
}
```
**Sealed** limita quem pode implementar/estender. Com pattern matching no `switch`, o compilador verifica se todos os casos foram tratados.

---

## 8. Como falar na entrevista

**"Interface ou classe abstrata?"**
> "Interface define um contrato, uma capacidade; uma classe pode implementar várias, e não tem estado. Classe abstrata é pra uma família de classes que compartilha estado e código, com herança simples. Eu começo por interface e só uso classe abstrata quando existe código comum de verdade, tipo um template method. E, no geral, prefiro composição a herança: herança acopla a subclasse aos detalhes da pai, enquanto compor e injetar a dependência me deixa trocar o comportamento facilmente."

---

## 9. Resumo

- Pilares: **encapsulamento, herança, polimorfismo, abstração**.
- **Herança**: `extends`, "é um", simples, tudo herda de `Object`.
- **Polimorfismo**: método do objeto real (**dynamic dispatch**); elimina `if` por tipo (**Strategy**, **Open/Closed**).
- **Overload** (compilação, parâmetros) × **override** (execução, `@Override`).
- **Interface** (contrato, várias, sem estado) × **classe abstrata** (família, estado, uma só).
- **Composição > herança**; **Liskov**.
- **Sealed** + **pattern matching**.

## Termos desta aula
herança · extends · super · is-a · has-a · herança simples · Object · polimorfismo · dynamic dispatch · Strategy · Open/Closed · overload · override · @Override · abstração · classe abstrata · método abstrato · Template Method · interface · implements · default method · composição · delegação · fragile base class · Liskov · SOLID · sealed · pattern matching · switch expression

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 04** e separadas por nível.
