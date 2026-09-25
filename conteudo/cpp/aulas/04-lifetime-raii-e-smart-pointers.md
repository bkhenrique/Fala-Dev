# Aula 04 — Lifetime, RAII e smart pointers

> **Objetivo:** relacionar lifetime de objetos, gerenciamento determinístico de recursos e semântica dos smart pointers padrão.

---

## 1. Lifetime

Todo objeto tem período de vida associado à obtenção de armazenamento e inicialização até destruição/liberação. Usar referência ou ponteiro depois do fim do lifetime é inválido. Retornar referência a variável local automática produz dangling reference.

## 2. RAII

Resource Acquisition Is Initialization associa aquisição de recurso ao lifetime de objeto: construtor adquire/estabelece recurso; destrutor libera. Escopo e unwinding de exceções acionam destrutores de objetos automáticos, facilitando cleanup previsível.

RAII aplica-se a memória, locks, arquivos e outros recursos. Construtores devem lidar com falha de aquisição e manter invariantes; destrutores não devem deixar exceções escaparem durante unwinding.

## 3. Smart pointers

- `std::unique_ptr<T>` expressa posse exclusiva e é movível, não copiável.
- `std::shared_ptr<T>` compartilha posse por contador de referências forte.
- `std::weak_ptr<T>` observa objeto gerenciado por shared_ptr sem prolongar sua vida; `lock()` tenta obter posse temporária.

Ciclo de `shared_ptr` entre objetos pode impedir contagem chegar a zero; `weak_ptr` pode quebrar ciclo. Referências/ponteiros crus podem observar objetos, mas sua API precisa documentar lifetime e posse.

## 4. Como falar na entrevista

**“Quando usar `unique_ptr` ou `shared_ptr`?”**
> “Uso `unique_ptr` por padrão para posse exclusiva e transferência explícita por move. Uso `shared_ptr` só quando a posse realmente é compartilhada e o lifetime não cabe numa hierarquia única. Para referência não proprietária de objeto compartilhado, considero `weak_ptr`.”

## 5. Resumo

- Lifetime define quando um objeto está vivo e pode ser usado.
- RAII atrela liberação de recurso ao destrutor e ao escopo.
- `unique_ptr` expressa posse exclusiva; `shared_ptr`, posse compartilhada.
- `weak_ptr` observa sem manter vivo e pode interromper ciclos.
- Ponteiros crus não expressam por si só posse nem garantem lifetime.

## Termos desta aula
Lifetime · dangling · RAII · unwinding · smart pointer · `unique_ptr` · `shared_ptr` · `weak_ptr` · posse · ciclo de referência

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 04** e separadas por nível.

### Para aprofundar
[C++ draft — object lifetime](https://eel.is/c++draft/basic.life) · [C++ draft — smart pointers](https://eel.is/c++draft/unique.ptr)
