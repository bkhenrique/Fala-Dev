# Aula 09 — Testes no Laravel: HTTP, banco e fakes

> **Objetivo:** escolher o nível de teste certo para uma aplicação Laravel e entender o que o ambiente de teste realmente substitui.

---

## 1. Testes no contexto da aplicação

Uma classe de teste pode instanciar uma unidade diretamente ou iniciar a aplicação Laravel com container, configuração e providers. O primeiro caminho é rápido e isola regra; o segundo verifica wiring, middleware, rotas, serialização e integração entre componentes.

Laravel suporta PHPUnit e Pest. Pest oferece sintaxe concisa sobre o ecossistema PHPUnit; não muda o princípio de que o teste deve verificar comportamento observável e ter dados determinísticos.

## 2. Unitário e feature

Teste unitário verifica uma regra pequena sem depender de servidor HTTP ou infraestrutura real. **Feature test** inicia partes da aplicação e pode chamar `$this->get()` ou `$this->postJson()` sem abrir uma conexão de rede verdadeira.

Teste HTTP de aplicação pode validar autenticação, status, JSON, headers e efeitos persistidos. Chame o nível pelo que cobre, não pelo nome da pasta: um teste com banco e fila ainda pode ser integração mesmo dentro do diretório `Feature`.

## 3. Banco de teste e RefreshDatabase

`RefreshDatabase` prepara o banco isolado para os testes conforme configuração e estratégia do framework. Cada execução precisa apontar para banco descartável ou dedicado, nunca para dados de produção. Testes que usam transações e threads HTTP diferentes podem não compartilhar o mesmo rollback esperado.

SQLite em memória é rápido, mas pode não reproduzir SQL, tipos, locks ou constraints do banco de produção. Use containers ou ambiente compatível quando essas diferenças importarem para o risco do recurso.

## 4. Fakes e fronteiras externas

Laravel oferece fakes para fila, eventos, e-mail, notificações, storage e HTTP. Fake permite afirmar “o job foi despachado com estes dados” sem iniciar worker ou chamar serviço real.

Fake prova que o código pediu a ação esperada, não que o serviço externo aceitaria a requisição. Combine teste unitário com mock/fake e alguns testes de integração controlados para serialização, autenticação e contrato externo.

## 5. Arrange, act, assert

Um teste claro prepara estado, executa uma ação e verifica resultado. Use factories e estados nomeados para criar dados relevantes. Evite fixtures enormes e factories que escondem condições importantes para o caso.

Asserts de banco podem verificar registro e colunas; asserts HTTP verificam contrato público. Também teste caminho negado: usuário sem permissão, entrada inválida, recurso inexistente e falha transitória.

## 6. Mock e overspecification

Mock permite configurar respostas e confirmar interações. Muitos mocks internos fazem o teste repetir a implementação passo a passo; refatorar a classe então quebra testes mesmo quando o comportamento público permanece igual.

Prefira mock em fronteiras instáveis ou efeitos caros. Para objeto de valor e lógica pura, use instância real. Para chamadas da facade, Laravel pode fornecer fake específico e assertions mais apropriados.

## 7. Concorrência e teste de fila

Teste que despacha job pode usar `Queue::fake()` para afirmar tipo e conteúdo; não executa o job. Teste a lógica do job separadamente, com dependências explícitas, e integração do worker quando retry, timeout e serialização são parte do risco.

Testes que dependem da ordem global de execução ou relógio real tendem a ser instáveis. Congele tempo onde o framework permite e limpe cache, sessão e filas entre cenários.

## 8. Como falar na entrevista

**“Como testaria a criação de um pedido que agenda uma notificação?”**

> “Testaria a regra de aplicação isolada, um feature test HTTP com Form Request e policy, e usaria Queue::fake para confirmar o job correto depois da criação. A transação e a persistência seriam verificadas em banco de teste; se o banco compatível for importante, usaria container. Testaria também usuário sem permissão e rollback, e testaria a lógica do job separadamente.”

## 9. Resumo

- Unitários verificam regra isolada; feature tests verificam o fluxo Laravel sem exigir servidor externo.
- RefreshDatabase isola dados, mas o banco de teste deve refletir as diferenças importantes do real.
- Fakes interceptam efeitos e permitem assertions; não provam integração com o serviço real.
- Teste caminhos permitidos e negados e mantenha factories explícitas.
- Use poucos mocks de detalhes internos para preservar liberdade de refatoração.

## Termos desta aula
PHPUnit · Pest · unit test · feature test · RefreshDatabase · factory · fake · mock · database assertion · Queue::fake

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 09** e separadas por nível.

### Para aprofundar
[Testing](https://laravel.com/framework/docs/13.x/testing) · [Database testing](https://laravel.com/framework/docs/13.x/database-testing)
