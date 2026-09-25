# Aula 03 — Módulos, Controllers e Providers

> **Objetivo:** entender os três blocos básicos de uma aplicação Nest, como eles se conectam, e o conceito de encapsulamento entre módulos.

---

## 1. A visão geral

Uma aplicação Nest é uma **árvore de módulos**. Cada módulo agrupa **controllers** e **providers** de um mesmo assunto.

```
                 AppModule (raiz)
          ┌───────────┼─────────────┐
   UsuariosModule  PedidosModule  AuthModule
     ├ Controller    ├ Controller   ├ Controller
     └ Service       ├ Service      └ Service
       Repository    └ Repository
```

O Nest começa pelo `AppModule` e vai montando o **grafo de dependências** da aplicação inteira.

```ts
// main.ts
const app = await NestFactory.create(AppModule);
await app.listen(3000);
```

---

## 2. Controller: a porta de entrada

O **controller** recebe a requisição, extrai os dados e **delega**. Ele representa a **camada de apresentação/transporte** (HTTP).

```ts
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  listar(@Query('pagina') pagina = 1) {
    return this.pedidosService.listar(pagina);
  }

  @Post()
  @HttpCode(201)
  criar(@Body() dto: CriarPedidoDto, @UsuarioAtual() usuario: Usuario) {
    return this.pedidosService.criar(dto, usuario.id);
  }
}
```

Decorators de parâmetro mais comuns: `@Body()`, `@Param()`, `@Query()`, `@Headers()`, `@Req()`, `@Res()`.

- O valor retornado vira a resposta (objeto → JSON automaticamente). Status padrão: 200 (201 em `@Post`).
- Evite `@Res()`: ele te tira do fluxo padrão do Nest (interceptors, serialização) e você passa a ter que responder manualmente.

**Regra:** controller **magro**. Nada de regra de negócio, acesso a banco ou chamada externa ali.

---

## 3. Provider: quem faz o trabalho

**Provider** é qualquer classe (ou valor) que o Nest pode **injetar**. O mais comum é o **service**, marcado com `@Injectable()`.

```ts
@Injectable()
export class PedidosService {
  constructor(
    private readonly repo: PedidosRepository,
    private readonly pagamentos: PagamentosService,
  ) {}

  async criar(dto: CriarPedidoDto, usuarioId: number) {
    const pedido = await this.repo.criar({ ...dto, usuarioId });
    await this.pagamentos.iniciar(pedido);
    return pedido;
  }
}
```

Exemplos de providers: services, repositories, factories, helpers, clients de APIs externas, configs.

Por padrão, cada provider é um **singleton**: o Nest cria **uma instância** e reaproveita em todo lugar (aula 04 fala dos outros escopos).

---

## 4. Module: a caixa que organiza

```ts
@Module({
  imports: [PagamentosModule],          // módulos dos quais eu preciso
  controllers: [PedidosController],     // controllers deste módulo
  providers: [PedidosService, PedidosRepository], // providers deste módulo
  exports: [PedidosService],            // o que eu deixo outros módulos usarem
})
export class PedidosModule {}
```

| Propriedade | Significado |
|---|---|
| `imports` | Módulos cujos providers **exportados** eu quero usar |
| `controllers` | Controllers que pertencem a este módulo |
| `providers` | Providers criados e disponíveis **dentro** deste módulo |
| `exports` | Subconjunto dos providers que fica visível pra quem **importar** este módulo |

### Encapsulamento
Um provider **não exportado** é **privado** do módulo. Se o `PedidosModule` tentar injetar o `PagamentosRepository` que o `PagamentosModule` não exportou, dá erro:

```
Nest can't resolve dependencies of the PedidosService (?).
Please make sure that the argument PagamentosRepository at index [0]
is available in the PedidosModule context.
```

Esse é **o erro mais comum do Nest**. Quase sempre é: o provider não está em `providers`, ou o módulo dele não está em `imports`, ou não foi exportado.

O encapsulamento é bom: força cada módulo a expor uma **API pública pequena** e esconder detalhes internos (**baixo acoplamento**).

### Módulos compartilhados e globais
- Módulos são **singletons**: se dois módulos importam o `PagamentosModule`, ambos recebem **a mesma instância** do `PagamentosService`.
- `@Global()` torna os exports de um módulo disponíveis em todo lugar sem importar. Use com moderação (config, logger, banco). Muito `@Global` = acoplamento escondido.

---

## 5. Módulos dinâmicos

Às vezes um módulo precisa de **configuração** ao ser importado. Para isso existem **dynamic modules**, geralmente com métodos estáticos `forRoot`, `forRootAsync`, `register` ou `forFeature`:

```ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ url: config.get('DATABASE_URL') }),
    }),
    TypeOrmModule.forFeature([Pedido]),
  ],
})
export class AppModule {}
```

Convenção:
- **`forRoot`**: configuração global, uma vez (conexão com banco).
- **`forFeature`**: parte específica de um módulo (quais entidades esse módulo usa).
- **`Async`**: quando a configuração depende de outra coisa injetada (ex: `ConfigService`).

---

## 6. Como organizar pastas

Organização **por domínio (feature)**, não por tipo técnico:

```
src/
  pedidos/
    pedidos.module.ts
    pedidos.controller.ts
    pedidos.service.ts
    pedidos.repository.ts
    dto/criar-pedido.dto.ts
    entities/pedido.entity.ts
  usuarios/
  shared/  (ou common/)
```

Isso se chama **package by feature** e combina com a ideia de módulo: tudo sobre pedidos fica junto.

---

## 7. Como falar na entrevista

**"Explique a arquitetura de uma aplicação Nest."**
> "É uma árvore de módulos a partir do AppModule. Cada módulo agrupa, por domínio, os controllers, que são a camada de entrada HTTP e só delegam, e os providers, como services e repositories, onde ficam a regra de negócio e o acesso a dados. Os módulos são encapsulados: um provider só é visível fora se for exportado, e quem usa precisa importar o módulo. Pra módulos que precisam de configuração, como banco e config, usamos dynamic modules com forRoot e forFeature."

---

## 8. Resumo

- App Nest = **árvore de módulos** a partir do `AppModule`.
- **Controller**: entrada HTTP, magro, delega.
- **Provider**: qualquer coisa injetável; service tem a regra. Singleton por padrão.
- **Module**: `imports`, `controllers`, `providers`, `exports`.
- Provider não exportado é **privado** → erro "can't resolve dependencies".
- **Dynamic modules**: `forRoot` / `forFeature` / `Async`.
- Pastas **por feature**.

## Termos desta aula
módulo · AppModule · controller · provider · service · repository · @Injectable · imports · exports · encapsulamento · singleton · @Global · dynamic module · forRoot · forFeature · forRootAsync · package by feature · grafo de dependências

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 03** e separadas por nível.
