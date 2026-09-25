# Aula 10 — Concorrência e atomics

> **Objetivo:** explicar data races no modelo de memória C e separar atomics padrão de APIs específicas de plataforma.

---

## 1. Threads e suporte

C11 define suporte opcional a threads na biblioteca padrão (`<threads.h>`); uma implementação pode indicar que não oferece esse recurso. APIs como pthreads pertencem a plataformas/POSIX, não ao núcleo universal da linguagem C.

## 2. Data race

Acessos conflitantes não atômicos ao mesmo objeto por threads, sem ordenação adequada e com pelo menos uma escrita, constituem data race no modelo C e causam comportamento indefinido. `volatile` não torna acesso atômico nem substitui sincronização.

## 3. Atomics

C11 `<stdatomic.h>` oferece tipos e operações atômicas. Operações sequencialmente consistentes impõem uma ordem global entre essas operações; ordens mais fracas exigem raciocínio cuidadoso sobre relações *happens-before*. Atomics protegem operações sobre objetos atômicos, mas não tornam automaticamente thread-safe uma estrutura inteira composta por vários campos.

## 4. Mutex e invariantes

Mutexes protegem seções críticas e invariantes compartilhadas; locks precisam ser adquiridos e liberados em todos os caminhos apropriados. Escolha sincronização a partir do contrato de dados e da implementação suportada. Concorrência deve ser medida e testada, pois pode adicionar overhead e complexidade.

## 5. Como falar na entrevista

**“`volatile` resolve data race?”**
> “Não. `volatile` afeta otimizações de certos acessos observáveis, mas não fornece atomicidade nem sincronização entre threads. Uso atomics ou mutex conforme a invariante que precisa ser protegida.”

## 6. Resumo

- C11 tem threads padrão opcionais; pthreads são API de plataforma.
- Data race não atômica sem sincronização é UB no modelo C.
- `volatile` não substitui atomics ou mutex.
- Atomics protegem objetos/ operações especificadas, não invariantes compostas automaticamente.
- Ordens de memória fracas exigem raciocínio explícito.

## Termos desta aula
Thread · data race · `<threads.h>` · POSIX threads · atomic · `<stdatomic.h>` · happens-before · ordem sequencialmente consistente · mutex · `volatile`

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 10** e separadas por nível.

### Para aprofundar
[WG14 N1570 — threads e atomics](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) · [WG14 — padrões](https://www.open-std.org/jtc1/sc22/wg14/www/standards)
