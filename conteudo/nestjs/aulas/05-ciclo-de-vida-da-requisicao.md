# Aula 05 — O ciclo de vida da requisição: Middleware, Guards, Interceptors, Pipes e Filters

> **Objetivo:** saber exatamente por onde uma requisição passa dentro do Nest, o papel de cada peça, e quando usar uma ou outra. É uma das perguntas de Nest mais comuns em entrevista.

---

## 1. A ordem completa

```
Requisição chega
   │
   ▼
1. Middleware           (global → de módulo)
   │
   ▼
2. Guards               (global → controller → rota)       "pode entrar?"
   │
   ▼
3. Interceptors (antes) (global → controller → rota)       "embrulha a execução"
   │
   ▼
4. Pipes                (global → controller → rota → parâmetro)  "valida/transforma input"
   │
   ▼
5. Controller / handler  → Service ...
   │
   ▼
6. Interceptors (depois) (ordem inversa)                    "mexe na resposta"
   │
   ▼
7. Exception Filters    (rota → controller → global)        só se houver erro
   │
   ▼
Resposta
```

Frase pra decorar: **Middleware → Guard → Interceptor → Pipe → Handler → Interceptor → Filter.**

Todas essas peças são **cross-cutting concerns** (preocupações transversais): coisas que várias rotas precisam, mas que não são regra de negócio. O Nest dá **uma peça especializada para cada tipo** de preocupação.

---

## 2. Middleware

Igual ao do Express: função `(req, res, next)` que roda **antes** do roteamento.

```ts
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.headers['x-correlation-id'] ??= randomUUID();
    next();
  }
}

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
```

Limitação: o middleware **não sabe qual handler vai executar** (não tem acesso ao `ExecutionContext`). Use para coisas genéricas: correlation id, logging bruto, CORS, cookies, helmet.

---

## 3. Guards: "pode entrar?"

Um **guard** decide se a requisição **pode seguir** (`true`) ou não (`false` → 403, ou lança exceção).

```ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;
    const { user } = context.switchToHttp().getRequest();
    return roles.some(r => user.roles.includes(r));
  }
}
```

Diferença pro middleware: o guard tem o **`ExecutionContext`**: sabe **qual classe e qual método** vão rodar, então consegue ler os **metadados** (ex: `@Roles('admin')`, `@Public()`).

Uso: **autenticação** e **autorização** (aula 07).

Aplicar: `@UseGuards(RolesGuard)` na rota/controller, ou global. Guard global **com DI** é registrado como provider:
```ts
providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }]
```

---

## 4. Interceptors: "embrulhar a execução"

Um **interceptor** envolve o handler: roda código **antes** e **depois**, e pode **transformar** o resultado ou o erro. Usa **RxJS** (`Observable`).

```ts
@Injectable()
export class TempoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const inicio = Date.now();
    return next.handle().pipe(                       // next.handle() = executa o handler
      map(data => ({ data, sucesso: true })),        // transforma a resposta
      tap(() => console.log(`${Date.now() - inicio}ms`)),
    );
  }
}
```

Usos típicos:
- **Padronizar formato** da resposta (`{ data, meta }`).
- **Logging** com tempo de execução.
- **Cache** (se tem no cache, nem chama o handler).
- **Timeout** (`timeout(5000)` do RxJS).
- **Serialização** (`ClassSerializerInterceptor` remove campos com `@Exclude()`, tipo a senha).
- Mapear erros.

> Padrão por trás: **AOP (Aspect-Oriented Programming, programação orientada a aspectos)**, que é adicionar comportamento em volta do código sem modificá-lo.

---

## 5. Pipes: validar e transformar o input

Um **pipe** recebe o **valor de um argumento** antes do handler e:
- **Transforma** (string `"42"` → número `42`), ou
- **Valida** (se inválido, lança exceção → 400).

```ts
@Get(':id')
buscar(@Param('id', ParseIntPipe) id: number) {}  // "abc" → 400 Bad Request

@Post()
criar(@Body() dto: CriarPedidoDto) {}             // validado pelo ValidationPipe global
```

Pipes prontos: `ValidationPipe`, `ParseIntPipe`, `ParseUUIDPipe`, `ParseBoolPipe`, `ParseEnumPipe`, `DefaultValuePipe`.

Aula 06 aprofunda o `ValidationPipe` e DTOs.

---

## 6. Exception Filters: tratar o erro

Quando algo lança exceção (em guard, pipe, handler, service…), ela cai nos **exception filters**, que montam a resposta de erro.

O Nest tem um filtro **global embutido**:
- Se é uma `HttpException` (ou filha: `NotFoundException`, `BadRequestException`, `UnauthorizedException`, `ForbiddenException`, `ConflictException`…) → usa o status e a mensagem dela.
- Qualquer outro erro → **500 Internal server error** (sem vazar detalhes).

Filtro customizado:
```ts
@Catch(PedidoNaoEncontradoError)
export class DominioFilter implements ExceptionFilter {
  catch(erro: PedidoNaoEncontradoError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    res.status(404).json({ erro: erro.message, codigo: 'PEDIDO_NAO_ENCONTRADO' });
  }
}
```

Boa prática: o **service lança erros de domínio** (sem saber de HTTP), e um **filter** traduz para status HTTP. Assim a regra de negócio não fica acoplada ao transporte.

---

## 7. Qual usar? Tabela de decisão

| Preciso de… | Use |
|---|---|
| Algo genérico antes de tudo (correlation id, helmet) | **Middleware** |
| Decidir se a requisição pode seguir (auth, roles, feature flag) | **Guard** |
| Validar/converter um parâmetro ou body | **Pipe** |
| Mexer no antes/depois: log com tempo, formato de resposta, cache, timeout | **Interceptor** |
| Transformar erros em respostas HTTP | **Exception Filter** |

---

## 8. Como falar na entrevista

**"Qual a diferença entre middleware, guard e interceptor?"**
> "A ordem no Nest é middleware, guard, interceptor, pipe, handler, interceptor de novo na volta, e exception filter em caso de erro. Middleware roda antes do roteamento e não sabe qual handler vai executar, então uso pra coisas genéricas como correlation id. Guard tem o ExecutionContext, então lê metadados da rota e decide se pode seguir; é onde fica autenticação e autorização. Interceptor envolve o handler com RxJS, antes e depois, e uso pra padronizar resposta, logar tempo, cache ou timeout. Pipes validam e transformam os parâmetros, e filters traduzem exceções em resposta HTTP."

---

## 9. Resumo

- Ordem: **Middleware → Guard → Interceptor → Pipe → Handler → Interceptor → Filter**.
- **Middleware**: genérico, sem contexto do handler.
- **Guard**: `canActivate`, tem `ExecutionContext` + `Reflector` → auth.
- **Interceptor**: antes/depois com RxJS → formato, log, cache, timeout, serialização (AOP).
- **Pipe**: valida/transforma argumentos → 400 se inválido.
- **Filter**: exceção → resposta; `HttpException` vira status; resto vira 500.
- Globais com DI: `APP_GUARD`, `APP_INTERCEPTOR`, `APP_PIPE`, `APP_FILTER`.

## Termos desta aula
request lifecycle · cross-cutting concerns · middleware · guard · CanActivate · ExecutionContext · Reflector · interceptor · CallHandler · RxJS · Observable · AOP · pipe · PipeTransform · ValidationPipe · ParseIntPipe · exception filter · HttpException · ArgumentsHost · erro de domínio · APP_GUARD

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 05** e separadas por nível.
