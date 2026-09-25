# Aula 13 — Testes em Node.js

> **Objetivo:** saber montar a estratégia de testes de uma aplicação Node: ferramentas (node:test, Vitest, Jest), dublês de teste (mock, stub, spy, fake), testar código assíncrono e com tempo, testar a API HTTP com supertest e o banco real com Testcontainers.

A visão geral de testes (pirâmide, tipos, TDD) está em [Fundamentos, aula 12](../../fundamentos/aulas/12-observabilidade-e-devops.md). Aqui é **como se faz em Node**.

---

## 1. O problema

Sem testes, cada mudança é um risco e o time passa a ter **medo de refatorar**. Com testes ruins, é pior: eles quebram a cada mudança interna, demoram, ou passam mesmo com bug ("testes que mentem"). O objetivo é ter testes **rápidos, confiáveis e que testam comportamento**.

Em Node, dois cuidados a mais: quase tudo é **assíncrono** (esquecer um `await` faz o teste passar sem testar nada) e muito código depende de **I/O** (banco, filas, APIs externas).

---

## 2. Ferramentas

| Ferramenta | Destaque |
|---|---|
| **`node:test`** | Test runner **nativo** do Node (`node --test`), sem dependência; `assert` nativo; mocks e fake timers embutidos |
| **Vitest** | Rápido, API compatível com Jest, TypeScript e ESM sem configuração; muito usado hoje |
| **Jest** | O mais tradicional; grande ecossistema; configuração com TypeScript/ESM dá mais trabalho |
| **supertest** | Faz requisições HTTP contra o app (Express, Fastify, Nest) sem subir porta |
| **Testcontainers** | Sobe Postgres, Redis, Kafka reais em Docker durante o teste |
| **nock / MSW** | Interceptam chamadas HTTP de saída pra APIs externas |

```ts
import { describe, it, expect } from "vitest";

describe("calcularFrete", () => {
  it("é grátis acima de R$ 200", () => {
    expect(calcularFrete({ total: 250, uf: "SP" })).toBe(0);
  });
});
```

Estrutura de um teste: **Arrange, Act, Assert** (preparar, executar, verificar), ou *Given/When/Then*.

---

## 3. Dublês de teste

Quando o código depende de algo lento, caro ou imprevisível (banco, e-mail, API de pagamento, relógio), usa-se um **dublê**:

| Dublê | O que é | Exemplo |
|---|---|---|
| **Stub** | Devolve respostas prontas | `buscarUsuario` sempre devolve o usuário X |
| **Mock** | Stub que também **verifica como foi chamado** | "o e-mail foi enviado uma vez, para este endereço" |
| **Spy** | Envolve a função real e **registra** as chamadas | Contar quantas vezes o logger foi chamado |
| **Fake** | Implementação simples que funciona de verdade | Repositório em memória com um `Map` |

```ts
const enviarEmail = vi.fn().mockResolvedValue(undefined);
const service = new PedidoService(repositorioEmMemoria, { enviarEmail });

await service.confirmar(pedidoId);

expect(enviarEmail).toHaveBeenCalledWith(expect.objectContaining({ para: "ana@x.com" }));
```

Cuidados:
- **Mock demais testa a implementação**, não o comportamento: o teste repete o código e quebra a cada refatoração.
- Prefira **injeção de dependência** (passar as dependências no construtor ou como parâmetro) a mockar módulos inteiros (`vi.mock("./email")`). É mais explícito e mais fácil de manter.
- **Fakes** (repositório em memória) costumam dar testes mais legíveis que mocks encadeados.
- Não mocke o que você não controla sem necessidade: pra banco, prefira o **banco real** em container (seção 6).

---

## 4. Testando código assíncrono

```ts
it("rejeita pedido sem itens", async () => {
  await expect(service.criar({ itens: [] })).rejects.toThrow("pedido vazio");
});
```

- **Sempre `await`** (ou `return`) a Promise no teste. Sem isso, o teste termina antes da operação e **passa sem verificar nada**.
- Para erros, `await expect(...).rejects`.
- Limpe o estado entre testes (`beforeEach`/`afterEach`): conexões abertas, mocks e dados. Teste que depende da ordem de execução é **frágil** (*flaky*).

### Tempo: fake timers
Código com `setTimeout`, retry com backoff ou "expira em 15 minutos" não deve fazer o teste **esperar de verdade**:
```ts
vi.useFakeTimers();
const promessa = comRetry(operacaoQueFalha);
await vi.advanceTimersByTimeAsync(10_000);   // "avança o relógio"
vi.useRealTimers();
```
O mesmo vale para `Date.now()`: congele a data (`vi.setSystemTime`) em vez de depender da hora em que o teste roda.

---

## 5. Testando a API HTTP

Com **supertest**, você faz requisições direto na aplicação, sem abrir porta:

```ts
import request from "supertest";
import { criarApp } from "../src/app";

it("POST /pedidos retorna 201", async () => {
  const app = criarApp({ repositorio: repositorioEmMemoria });
  const res = await request(app).post("/pedidos").send({ itens: [{ id: 1, qtd: 2 }] });

  expect(res.status).toBe(201);
  expect(res.body).toMatchObject({ id: expect.any(String) });
});
```

Dica de arquitetura: separe **criar o app** (`criarApp()`) de **subir o servidor** (`app.listen()`). Assim o teste usa o app sem porta, e dá pra injetar dependências falsas.

Teste também os caminhos de erro: validação (400), sem autenticação (401), sem permissão (403), recurso inexistente (404).

---

## 6. Banco real com Testcontainers

Mockar o banco esconde bugs reais: SQL errado, constraint, transação, diferença entre o banco de teste (SQLite) e o de produção (Postgres). Com **Testcontainers**:

```ts
const container = await new PostgreSqlContainer("postgres:17").start();
process.env.DATABASE_URL = container.getConnectionUri();
await rodarMigrations();
// ... testes de integração com o banco real
await container.stop();
```

- Sobe um container novo (leva alguns segundos), roda as **migrations** e testa contra o mesmo banco da produção.
- Isolamento entre testes: transação com rollback, limpar tabelas, ou um schema por arquivo de teste.
- No CI, o GitHub Actions já tem Docker disponível.

---

## 7. Estratégia e cobertura

- **Unitários** para regras de negócio puras (cálculo, validação, máquina de estados): rápidos, muitos.
- **Integração** para a API com supertest e banco real: pegam os bugs de "encaixe" entre as peças.
- **Contrato/E2E** poucos, nos fluxos críticos.
- **Cobertura** (`--coverage`) é um indicador pra achar partes sem teste, não uma meta. 100% de cobertura com asserts fracos não garante nada.
- Testes rodando no **CI** em todo PR, e rápidos o bastante pra rodar localmente antes do commit (modo *watch*).

---

## 8. Como falar na entrevista

**"Como você testa uma API em Node?"**
> "Regras de negócio com testes unitários no Vitest, injetando as dependências e usando fakes, como um repositório em memória, em vez de mockar módulos. A API eu testo com supertest, separando a criação do app do listen, verificando status e corpo, inclusive os erros 400, 401, 403 e 404. Pra banco uso Testcontainers com o mesmo Postgres de produção e as migrations reais, porque mockar banco esconde bug de SQL e transação. APIs externas intercepto com nock ou MSW. Tudo roda no CI em todo PR."

**"Qual a diferença entre mock, stub, spy e fake?"**
> "Stub devolve respostas prontas. Mock é um stub que também verifica como foi chamado. Spy envolve a função real e registra as chamadas. Fake é uma implementação simples que funciona de verdade, como um repositório em memória. Tomo cuidado com mock demais, porque aí o teste passa a verificar a implementação e quebra a cada refatoração."

---

## 9. Resumo

- Testes **rápidos, confiáveis e de comportamento**; em Node, atenção ao **assíncrono** e ao **I/O**.
- Ferramentas: **node:test** (nativo), **Vitest**, Jest; **supertest**; **Testcontainers**; nock/MSW.
- Estrutura **Arrange/Act/Assert**.
- Dublês: **stub, mock, spy, fake**; prefira **injeção de dependência** e fakes a mockar módulos; cuidado com mock demais.
- Assíncrono: **sempre `await`**; `rejects`; isolar estado; **fake timers** e data congelada.
- API: **supertest** com `criarApp()` separado do `listen()`; testar caminhos de erro.
- Banco real com **Testcontainers** + migrations; isolamento entre testes.
- Cobertura é **indicador**, não meta; testes no **CI**.

## Termos desta aula
teste unitário · teste de integração · node:test · Vitest · Jest · Arrange Act Assert · dublê de teste · stub · mock · spy · fake · injeção de dependência · vi.fn · vi.mock · flaky · fake timers · setSystemTime · supertest · Testcontainers · migrations · nock · MSW · cobertura · CI

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 13** e separadas por nível.
