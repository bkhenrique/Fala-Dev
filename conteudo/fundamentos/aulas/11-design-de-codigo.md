# Aula 11 — Design de código: SOLID, acoplamento, coesão, princípios e débito técnico

> **Objetivo:** conseguir falar com propriedade sobre qualidade de código: SOLID com exemplos, acoplamento e coesão, DRY/KISS/YAGNI, code smells, refatoração e débito técnico.

---

## 1. Por que design de código importa

Código é **lido** muito mais vezes do que é escrito, e **muda** o tempo todo. Bom design = código **fácil de entender, testar e mudar** sem quebrar o resto. O custo de um design ruim não aparece no dia 1, aparece no mês 6, quando qualquer mudança vira uma operação de risco.

Os dois conceitos que estão por trás de quase todos os princípios:

### Acoplamento (quanto uma parte depende de outra)
- **Alto acoplamento**: mudar A obriga a mudar B, C e D. Difícil de testar isolado.
- Queremos **baixo acoplamento**: as partes se conhecem pelo mínimo necessário (interfaces, contratos).

### Coesão (quanto as coisas dentro de uma parte têm a ver entre si)
- **Baixa coesão**: uma classe `Utils` que formata data, envia e-mail e calcula imposto.
- Queremos **alta coesão**: cada módulo/classe tem **um propósito claro**.

> Meta: **baixo acoplamento, alta coesão.**

---

## 2. SOLID

Cinco princípios de design orientado a objetos (popularizados por Robert C. Martin, "Uncle Bob").

### S: Single Responsibility (Responsabilidade Única)
> Uma classe deve ter **um único motivo para mudar**.

❌ `PedidoService` que calcula total, salva no banco, gera PDF e envia e-mail: muda se a regra de preço mudar, se o banco mudar, se o layout do PDF mudar…
✅ Separar: `CalculadoraDePreco`, `PedidoRepository`, `GeradorDeNotaPdf`, `Notificador`, orquestrados por um caso de uso.

### O: Open/Closed (Aberto/Fechado)
> Aberto para **extensão**, fechado para **modificação**.

❌ Um `switch` por tipo de frete que precisa ser editado a cada transportadora nova.
✅ Interface `CalculadoraDeFrete` com uma implementação por transportadora (padrão **Strategy**). Nova transportadora = nova classe, sem mexer no código existente.

### L: Liskov Substitution (Substituição de Liskov)
> Uma subclasse deve poder **substituir** a classe pai **sem quebrar** quem a usa.

❌ `ContaPoupanca extends Conta` mas lança exceção em `transferir()`. Quem recebe uma `Conta` e chama `transferir()` quebra.
Sinal de violação: `if (obj instanceof Subtipo)` espalhado, métodos sobrescritos que lançam "não suportado".

### I: Interface Segregation (Segregação de Interfaces)
> Clientes não devem depender de métodos que **não usam**.

❌ Interface `Impressora` com `imprimir()`, `escanear()`, `enviarFax()`; a impressora simples é obrigada a implementar fax.
✅ Interfaces pequenas: `Imprime`, `Escaneia`, `EnviaFax`.

### D: Dependency Inversion (Inversão de Dependência)
> Módulos de alto nível (regra de negócio) não devem depender de módulos de baixo nível (detalhes); ambos devem depender de **abstrações**.

❌ `ServicoDeResumo` faz `new OpenAIClient()` direto.
✅ `ServicoDeResumo` depende de uma interface `ProvedorIA`; a implementação é **injetada** (injeção de dependência). Trocar de provedor ou mockar em teste vira trivial. É a base da arquitetura hexagonal (aula 09).

---

## 3. Outros princípios que caem

- **DRY** (*Don't Repeat Yourself*): cada **conhecimento** deve ter uma representação única. Atenção: é sobre **regra/conhecimento** duplicado, não sobre código parecido. Juntar à força coisas que só *parecem* iguais cria acoplamento errado. Existe o contraponto **WET**/"regra de três": duplicar uma vez é aceitável; na terceira, abstraia.
- **KISS** (*Keep It Simple, Stupid*): a solução mais simples que resolve. Complexidade tem custo.
- **YAGNI** (*You Aren't Gonna Need It*): não construir hoje algo "para o futuro" que ninguém pediu. Evita **overengineering**.
- **Composição sobre herança**: compor objetos e delegar é mais flexível que hierarquias (aula 04 de Java).
- **Lei de Demeter** ("fale só com seus amigos próximos"): evite `pedido.getCliente().getEndereco().getCidade().getNome()` (*train wreck*); isso acopla você a toda a estrutura interna.
- **Tell, don't ask**: em vez de perguntar o estado e decidir fora (`if (conta.getSaldo() >= v) conta.setSaldo(...)`), mande o objeto fazer (`conta.sacar(v)`).
- **Separation of Concerns**: separar responsabilidades diferentes (apresentação, regra, dados).
- **Fail fast**: detectar e sinalizar erro o mais cedo possível (validar na entrada).

---

## 4. Code smells e refatoração

**Code smell** ("cheiro de código"): sinal de que algo **pode** estar mal projetado. Não é bug, é indício.

| Smell | Sinal | Refatoração típica |
|---|---|---|
| **Método longo** | Função com centenas de linhas | Extrair métodos com nomes claros |
| **Classe grande / God class** | Classe que sabe e faz tudo | Dividir por responsabilidade |
| **Código duplicado** | Mesma regra em vários lugares | Extrair para um lugar só |
| **Lista longa de parâmetros** | `criar(a, b, c, d, e, f, g)` | Objeto de parâmetro, Builder |
| **Obsessão por primitivos** | CPF, e-mail, dinheiro como `String`/`double` | **Value objects** (`Cpf`, `Dinheiro`) |
| **Switch/if por tipo** | Espalhado pelo código | Polimorfismo (Strategy) |
| **Feature envy** | Método que usa mais dados de outra classe que da própria | Mover o método para lá |
| **Nomes ruins** | `data`, `tmp`, `processar2`, `x` | Renomear para intenção |
| **Comentário explicando código confuso** | "// isso faz X porque..." | Tornar o código autoexplicativo |

**Refatoração**: mudar a **estrutura** do código **sem mudar o comportamento**, em passos pequenos, apoiado por **testes** (sem testes, não é refatoração, é "mexer e torcer"). **Regra do escoteiro**: deixe o código um pouco melhor do que encontrou.

---

## 5. Débito técnico

**Débito técnico** (*technical debt*): o custo futuro de ter escolhido uma solução mais rápida/simples agora. Como dívida financeira, cobra **juros**: cada mudança naquele trecho fica mais cara.

Nem todo débito é ruim:
- **Consciente e deliberado**: "vamos lançar o MVP sem X, sabendo que teremos que refazer; está registrado." Decisão de negócio legítima.
- **Inconsciente/imprudente**: bagunça por falta de cuidado ou conhecimento.

Como gerenciar: **registrar** (tickets, ADRs), priorizar pelo **impacto** (onde mais se mexe e mais dói), pagar aos poucos junto com features, e saber **explicar em termos de negócio** ("cada funcionalidade de pagamento está levando o dobro do tempo por causa disso").

Frase ótima para entrevista quando perguntarem de decisões no MVP: *"Assumimos um débito técnico consciente para validar o produto mais rápido, deixamos registrado, e pagamos quando o uso justificou."*

---

## 6. Como falar na entrevista

**"Explique SOLID com exemplos."**
> "S, responsabilidade única: uma classe com um motivo pra mudar, então separo cálculo de preço, persistência e notificação. O, aberto/fechado: pra adicionar uma transportadora, crio uma nova implementação de uma interface de frete em vez de editar um switch. L, Liskov: uma subclasse tem que substituir a pai sem surpresa; se ela lança 'não suportado', a herança está errada. I, segregação de interfaces: interfaces pequenas, ninguém implementa método que não usa. D, inversão de dependência: a regra de negócio depende de abstrações, como um ProvedorIA, e a implementação concreta é injetada, o que facilita trocar e testar."

**"O que é débito técnico?"**
> "É o custo futuro de uma solução mais rápida hoje; cobra juros, porque cada mudança naquele ponto fica mais cara. Pode ser consciente, uma decisão de negócio legítima num MVP, desde que registrada e paga quando fizer sentido. Eu priorizo pagar onde mais se mexe e explico o impacto em termos de negócio, tipo tempo de entrega."

---

## 7. Resumo

- **Baixo acoplamento, alta coesão.**
- **SOLID**: responsabilidade única, aberto/fechado, Liskov, segregação de interfaces, inversão de dependência.
- **DRY** (conhecimento, não código parecido), **KISS**, **YAGNI**, composição > herança, **Demeter**, tell don't ask, fail fast.
- **Code smells**: método longo, god class, duplicação, muitos parâmetros, **obsessão por primitivos**, switch por tipo, nomes ruins.
- **Refatoração**: estrutura muda, comportamento não; com testes; passos pequenos.
- **Débito técnico**: juros; consciente × imprudente; registrar, priorizar, explicar em negócio.

## Termos desta aula
acoplamento · coesão · SOLID · single responsibility · open/closed · Liskov · interface segregation · dependency inversion · Strategy · injeção de dependência · DRY · WET · regra de três · KISS · YAGNI · overengineering · composição sobre herança · Lei de Demeter · train wreck · tell don't ask · separation of concerns · fail fast · code smell · god class · obsessão por primitivos · value object · feature envy · refatoração · regra do escoteiro · débito técnico · MVP

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 11** e separadas por nível.
