# Aula 07 — Exceções

> **Objetivo:** entender a hierarquia de exceções, a diferença entre checked e unchecked, try-with-resources, e as boas práticas de tratamento de erro em aplicações Java.

---

## 1. A hierarquia

```
Throwable
├── Error                       → problemas graves da JVM; NÃO trate
│    ├── OutOfMemoryError
│    └── StackOverflowError
└── Exception
     ├── IOException, SQLException, ...   → CHECKED
     └── RuntimeException                  → UNCHECKED
          ├── NullPointerException
          ├── IllegalArgumentException
          ├── IllegalStateException
          ├── IndexOutOfBoundsException
          └── ...
```

- **`Error`**: a JVM está em apuros. Não há o que o código da aplicação faça (sem memória, pilha estourada).
- **`Exception`**: situações que a aplicação pode tratar.

---

## 2. Checked vs Unchecked

### Checked (verificadas)
Herdam de `Exception` mas **não** de `RuntimeException`. O **compilador obriga** você a:
- **tratar** com `try/catch`, ou
- **declarar** com `throws` na assinatura.

```java
public String lerArquivo(Path caminho) throws IOException {
  return Files.readString(caminho);
}
```
Ideia original: erros **recuperáveis e esperados** do mundo externo (arquivo não existe, rede caiu), e o compilador força você a pensar neles.

### Unchecked (não verificadas)
Herdam de `RuntimeException`. O compilador **não obriga** a tratar.
- Normalmente indicam **erro de programação** (NPE, índice inválido) ou **violação de regra** (`IllegalArgumentException`).

### O debate
Checked exceptions são polêmicas: acabam gerando `throws` em cascata por todas as camadas, ou `catch` vazio só pra calar o compilador. Por isso frameworks modernos (Spring, JPA, Hibernate) usam **quase só unchecked**, e muitas linguagens da JVM (Kotlin) nem têm checked.

Prática comum hoje: **exceções de domínio unchecked** (`PedidoNaoEncontradoException extends RuntimeException`) + **tratamento centralizado** (no Spring, `@ControllerAdvice`, aula 02 da trilha Spring).

---

## 3. try / catch / finally

```java
try {
  processar();
} catch (PagamentoRecusadoException e) {       // mais específica primeiro
  log.warn("pagamento recusado", e);
} catch (IOException | TimeoutException e) {   // multi-catch
  throw new ServicoIndisponivelException("falha ao processar", e);
} finally {
  // SEMPRE executa (com ou sem exceção): liberar recurso, limpar contexto
}
```

- A ordem dos `catch` importa: a mais **específica** antes da mais **genérica**.
- `finally` roda sempre (exceto se a JVM morrer). Não faça `return` dentro de `finally` (engole exceções).

---

## 4. try-with-resources

Recursos (conexões, arquivos, streams) **precisam ser fechados**, senão vazam (conexões esgotadas, arquivos travados).

```java
// ❌ antigo: verboso e fácil de errar
BufferedReader br = null;
try {
  br = new BufferedReader(new FileReader("x.txt"));
  ...
} finally {
  if (br != null) br.close();
}

// ✅ Java 7+: fecha automaticamente, mesmo se der exceção
try (var br = new BufferedReader(new FileReader("x.txt"));
     var conexao = dataSource.getConnection()) {
  ...
}
```

Funciona com qualquer classe que implemente **`AutoCloseable`**. Os recursos são fechados na **ordem inversa** da abertura. Se o `close()` também lançar exceção, ela é anexada como **suppressed** à principal (sem esconder o erro original).

---

## 5. Criando e relançando exceções

```java
public class PedidoNaoEncontradoException extends RuntimeException {
  public PedidoNaoEncontradoException(Long id) {
    super("Pedido " + id + " não encontrado");
  }
}
```

**Encadeamento** (*exception chaining*): ao converter uma exceção em outra, **passe a original como causa**:
```java
catch (SQLException e) {
  throw new RepositorioException("erro ao salvar pedido", e);   // ✅ mantém o stack trace original
}
```
Sem isso, você perde a informação de onde o problema começou.

---

## 6. Boas práticas (e anti-padrões)

✅ Faça:
- **Falhe cedo** (*fail fast*): valide argumentos no início (`Objects.requireNonNull`, `IllegalArgumentException`).
- Exceções **específicas e com mensagem útil** (qual id, qual valor).
- **Trate onde dá pra fazer algo** (retry, fallback, resposta ao usuário); nos outros lugares, deixe subir.
- **Centralize** a tradução para respostas HTTP.
- Logue **uma vez**, com o stack trace, no ponto onde a exceção é tratada.

❌ Evite:
- **Engolir exceção**:
```java
catch (Exception e) { }        // o erro some, e o bug vira mistério
```
- `catch (Exception e)` ou `catch (Throwable t)` genérico no meio do código.
- **Logar e relançar** em toda camada (o mesmo erro aparece 5 vezes no log).
- Usar exceção para **controle de fluxo normal** (é lento e confuso).
- Retornar `null` para indicar erro (vira NPE longe da causa) → prefira exceção ou `Optional` (aula 08).

---

## 7. NullPointerException

A exceção mais famosa do Java. Formas de reduzir:
- Validar entradas (`Objects.requireNonNull`).
- `Optional` como **retorno** de métodos que podem não ter resultado.
- Retornar **coleções vazias** em vez de `null`.
- Anotações `@NonNull`/`@Nullable` + ferramentas de análise estática.
- Desde o Java 14, as mensagens de NPE são **úteis** (*helpful NullPointerExceptions*): dizem exatamente qual variável era null.

---

## 8. Como falar na entrevista

**"Qual a diferença entre checked e unchecked exceptions?"**
> "Checked herdam de Exception, e o compilador obriga a tratar ou declarar com throws; a ideia é forçar o tratamento de falhas externas esperadas, tipo IOException. Unchecked herdam de RuntimeException e não são obrigatórias; normalmente indicam erro de programação ou violação de regra. Na prática, frameworks como Spring usam quase só unchecked, e eu sigo isso: crio exceções de domínio unchecked e trato de forma centralizada num ControllerAdvice. E sempre uso try-with-resources pra recurso e passo a causa ao encapsular exceção, pra não perder o stack trace."

---

## 9. Resumo

- `Throwable` → **`Error`** (não trate) e **`Exception`** → checked e **`RuntimeException`** (unchecked).
- **Checked**: compilador obriga `try/catch` ou `throws`. **Unchecked**: não obriga.
- Mercado moderno: **unchecked de domínio** + **tratamento centralizado**.
- `catch` do específico ao genérico; `finally` sempre roda.
- **try-with-resources** + `AutoCloseable`; suppressed exceptions.
- **Encadeie a causa** ao relançar.
- Anti-padrões: engolir exceção, catch genérico, logar em toda camada, exceção como fluxo.
- Menos NPE: validação, `Optional`, coleções vazias.

## Termos desta aula
Throwable · Error · Exception · RuntimeException · checked · unchecked · throws · try · catch · finally · multi-catch · try-with-resources · AutoCloseable · suppressed exception · exceção customizada · exceção de domínio · exception chaining · causa · stack trace · fail fast · engolir exceção · tratamento centralizado · NullPointerException · helpful NPE · requireNonNull

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 07** e separadas por nível.
