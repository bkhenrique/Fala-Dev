# Aula 04 — Injeção de Dependência e o IoC Container

> **Objetivo:** explicar de verdade o que é injeção de dependência (DI) e inversão de controle (IoC), por que isso importa, e dominar os recursos do Nest: tokens, custom providers, escopos, dependência circular e lifecycle hooks.

---

## 1. O problema: acoplamento

Sem DI, a classe **cria** as próprias dependências:

```ts
class PedidosService {
  private repo = new PedidosRepository(new ConexaoPostgres('postgres://...'));
  private email = new SendGridEmail('chave-api');
}
```

Problemas:
- **Alto acoplamento**: `PedidosService` está amarrado ao Postgres e ao SendGrid. Trocar pra outro provedor de e-mail = mexer no service.
- **Difícil de testar**: não dá pra trocar o banco real por um fake no teste.
- **Configuração espalhada**: URL de banco e chave de API dentro da regra de negócio.
- **Várias instâncias** sem controle (cada service cria sua conexão).

---

## 2. Injeção de Dependência

**Injeção de dependência** = a classe **recebe** as dependências prontas (normalmente pelo construtor), em vez de criá-las.

```ts
class PedidosService {
  constructor(private repo: PedidosRepository, private email: EmailService) {}
}
```

Agora quem cria o `PedidosService` decide **qual** repositório e **qual** e-mail passar. No teste, passo mocks. Em produção, as implementações reais.

> Analogia: um chef que **recebe** os ingredientes na bancada, em vez de sair pra comprar. Você pode trocar o fornecedor sem mudar a receita.

## 3. Inversão de Controle (IoC)

Se a classe não cria as dependências, **alguém** precisa criar. Esse alguém é o **IoC container** (no Nest, o próprio framework).

**Inversão de controle** = o controle sobre **criar e montar os objetos** sai do seu código e vai para o framework. Em vez de você chamar o framework, **o framework chama você** (*Hollywood principle*: "não nos ligue, nós ligamos pra você").

O container do Nest:
1. Lê os módulos e os providers registrados.
2. Lê os tipos dos construtores (metadata, aula 02).
3. Monta o **grafo de dependências** e cria tudo na ordem certa.
4. Guarda as instâncias (singletons) e injeta onde for pedido.

### DI vs DIP (não confundir)
- **DI (Dependency Injection)**: a **técnica** de passar dependências de fora.
- **DIP (Dependency Inversion Principle)**, o "D" do SOLID: **dependa de abstrações, não de implementações**. Módulos de alto nível (regra de negócio) não devem depender de detalhes (banco, SDK).

DI é uma forma de **aplicar** o DIP, mas só aplica de verdade se você injeta uma **abstração**. Isso nos leva aos tokens.

---

## 4. Tokens e custom providers

Quando você escreve `providers: [PedidosService]`, é um atalho para:
```ts
{ provide: PedidosService, useClass: PedidosService }
```
- **`provide`**: o **token** (a "chave" pela qual o provider é encontrado).
- **`useClass`**: o que entregar quando alguém pedir esse token.

Existem quatro formas de custom provider:

| Forma | Uso |
|---|---|
| `useClass` | Entregar uma classe (pode ser diferente do token) |
| `useValue` | Entregar um valor pronto (config, mock em teste) |
| `useFactory` | Criar via função, podendo injetar outras dependências (`inject: [...]`) |
| `useExisting` | Criar um "apelido" (alias) para outro provider |

### Injetando uma abstração (o jeito certo de aplicar o DIP)
Interface some em runtime, então usamos um **token** (string, Symbol, ou classe abstrata):

```ts
export interface AIProvider {
  gerar(prompt: string): Promise<string>;
}
export const AI_PROVIDER = Symbol('AI_PROVIDER');

@Module({
  providers: [
    {
      provide: AI_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get('AI') === 'anthropic' ? new AnthropicProvider() : new OpenAIProvider(),
    },
    ResumoService,
  ],
})
export class IAModule {}

@Injectable()
export class ResumoService {
  constructor(@Inject(AI_PROVIDER) private readonly ai: AIProvider) {}
}
```

O `ResumoService` **não sabe** qual provider de IA está usando. Trocar de fornecedor = mudar config, sem tocar na regra de negócio. Isso é **baixo acoplamento** + **DIP** na prática.

> Alternativa comum: usar uma **classe abstrata** como token (`provide: AIProvider, useClass: OpenAIProvider`), porque classe abstrata existe em runtime e dispensa o `@Inject`.

---

## 5. Escopos de provider

| Escopo | Instâncias | Quando usar |
|---|---|---|
| **DEFAULT (singleton)** | Uma para a aplicação toda | Quase sempre |
| **REQUEST** | Uma nova **por requisição** | Precisa de dados da requisição (ex: multi-tenant) |
| **TRANSIENT** | Uma nova **para cada consumidor** que injeta | Objetos com estado próprio, ex: logger com contexto |

```ts
@Injectable({ scope: Scope.REQUEST })
export class TenantService {}
```

Cuidado: o escopo REQUEST **"sobe" pela cadeia** (*scope bubbling*). Se o controller depende de um service REQUEST-scoped, o controller também passa a ser recriado a cada requisição. Isso tem **custo de performance**. Alternativas: passar o dado como parâmetro, ou usar `AsyncLocalStorage` (ex: `nestjs-cls`).

Consequência do singleton: **não guarde estado de requisição em propriedade do service** (`this.usuarioAtual = ...`). Com requisições concorrentes, uma sobrescreve a outra.

---

## 6. Dependência circular

A depende de B e B depende de A. O container não sabe quem criar primeiro.

Solução técnica: `forwardRef`:
```ts
constructor(@Inject(forwardRef(() => BService)) private b: BService) {}
// e nos módulos: imports: [forwardRef(() => BModule)]
```

Mas a resposta madura é: **dependência circular geralmente é um cheiro de design**. Melhor:
- Extrair a parte comum para um **terceiro** módulo/service.
- Usar **eventos** (A emite, B escuta) em vez de chamada direta.

---

## 7. Lifecycle hooks

O Nest chama métodos em momentos da vida da aplicação:

| Hook | Quando |
|---|---|
| `onModuleInit` | Dependências do módulo resolvidas |
| `onApplicationBootstrap` | Tudo inicializado, antes de escutar conexões |
| `onModuleDestroy` | Recebeu sinal de desligamento |
| `beforeApplicationShutdown` | Depois que os `onModuleDestroy` terminaram |
| `onApplicationShutdown` | Conexões fechadas, antes de sair |

Os hooks de shutdown **só funcionam** se você chamar `app.enableShutdownHooks()` no `main.ts`. É assim que se faz **graceful shutdown** no Nest (fechar conexões, terminar jobs).

---

## 8. Como falar na entrevista

**"O que é injeção de dependência e como o Nest faz?"**
> "Injeção de dependência é a classe receber suas dependências de fora, normalmente pelo construtor, em vez de criá-las. Isso reduz acoplamento e facilita teste. No Nest, o IoC container lê os providers registrados nos módulos e os tipos dos construtores via metadata, monta o grafo e injeta, por padrão como singletons. Quando quero depender de uma abstração, por exemplo um AIProvider, registro um token com useClass ou useFactory e injeto com @Inject, e aí troco a implementação só mudando o registro. Isso é o princípio de inversão de dependência na prática."

---

## 9. Resumo

- **DI**: receber dependências prontas. **IoC**: o framework cria e monta os objetos.
- **DIP** (SOLID): depender de **abstrações**; DI é o meio.
- Provider = **token** + `useClass` / `useValue` / `useFactory` / `useExisting`.
- Interface não existe em runtime → **token** (Symbol/string) + `@Inject`, ou classe abstrata.
- Escopos: **singleton** (padrão), **request** (sobe na cadeia, custo), **transient**.
- Singleton ⇒ **não guardar estado de requisição** no service.
- Dependência circular: `forwardRef`, mas prefira **redesenhar**.
- Lifecycle hooks + `enableShutdownHooks()` = graceful shutdown.

## Termos desta aula
injeção de dependência · inversão de controle · IoC container · Hollywood principle · acoplamento · DIP · SOLID · token · custom provider · useClass · useValue · useFactory · useExisting · @Inject · Symbol · escopo · singleton · request scope · transient · scope bubbling · AsyncLocalStorage · dependência circular · forwardRef · lifecycle hooks · enableShutdownHooks

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 04** e separadas por nível.
