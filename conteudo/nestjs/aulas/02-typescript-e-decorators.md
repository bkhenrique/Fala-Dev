# Aula 02 — TypeScript, Decorators e Metadata

> **Objetivo:** entender o que é um decorator, como o Nest usa decorators + metadata pra montar rotas, validação e injeção de dependência, e por que o Nest depende tanto de TypeScript.

---

## 1. TypeScript em 1 minuto

**TypeScript** é um **superset** do JavaScript: todo JS válido é TS válido, e o TS adiciona **tipagem estática**.

- O código TS é **compilado** (*transpilado*) para JS antes de rodar. O Node executa JS.
- Os tipos existem **só em tempo de compilação**: em runtime, **interfaces e types somem**.

Guarde essa última frase: ela explica por que, no Nest, você **não consegue injetar uma interface diretamente** (aula 04).

---

## 2. O que é um decorator

**Decorator** é uma função que você "cola" em cima de uma classe, método, propriedade ou parâmetro com `@`, e que recebe informações sobre aquilo pra **adicionar comportamento ou metadados**.

```ts
function Log(target: any, metodo: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`chamando ${metodo}`, args);
    return original.apply(this, args);
  };
}

class Calculadora {
  @Log
  somar(a: number, b: number) { return a + b; }
}
```

Tipos de decorator:
- **De classe**: `@Controller()`, `@Injectable()`, `@Module()`.
- **De método**: `@Get()`, `@Post()`, `@UseGuards()`.
- **De propriedade**: `@IsEmail()` (class-validator).
- **De parâmetro**: `@Body()`, `@Param()`, `@Inject()`.

> Analogia: decorators são **etiquetas** coladas no código. Sozinhas não fazem nada; o framework lê as etiquetas e age de acordo.

---

## 3. Metadata: o segredo do Nest

A maioria dos decorators do Nest **não muda** o seu código. Eles só **gravam metadados** (informações) na classe ou no método, usando a biblioteca **`reflect-metadata`**.

Exemplo simplificado do que `@Get(':id')` faz:
```ts
Reflect.defineMetadata('path', ':id', UsuariosController.prototype.buscar);
Reflect.defineMetadata('method', 'GET', UsuariosController.prototype.buscar);
```

Na inicialização, o Nest **varre** todos os controllers, **lê** esses metadados e registra as rotas no Express/Fastify. Isso é **programação declarativa**: você **declara o que quer**, e o framework faz o como.

### `emitDecoratorMetadata`: como o Nest sabe o que injetar
No `tsconfig.json` do Nest tem:
```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

Com `emitDecoratorMetadata`, o compilador TypeScript **grava os tipos dos parâmetros do construtor** como metadado (`design:paramtypes`) em classes decoradas.

```ts
@Injectable()
export class UsuariosService {
  constructor(private repo: UsuariosRepository, private mail: MailService) {}
}
// o TS grava algo como: design:paramtypes = [UsuariosRepository, MailService]
```

Quando o Nest precisa criar o `UsuariosService`, ele lê esse metadado, vê que precisa de `UsuariosRepository` e `MailService`, cria (ou reaproveita) essas instâncias, e passa pro construtor.

> É por isso que `@Injectable()` é necessário: sem um decorator na classe, o TypeScript não emite o metadado dos parâmetros.

E é por isso que **interface não funciona como tipo de injeção**: interface some no JS compilado, então o metadado vira `Object`, e o Nest não sabe o que injetar. Solução: **token de injeção** (aula 04).

---

## 4. Criando seus próprios decorators

### Decorator de metadado com `SetMetadata`
```ts
export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);

@Public()
@Get('health')
health() { return 'ok'; }
```
Depois, um **guard** lê esse metadado com o `Reflector` (aula 07) e libera a rota.

### Decorator de parâmetro com `createParamDecorator`
```ts
export const UsuarioAtual = createParamDecorator(
  (_data, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);

@Get('me')
perfil(@UsuarioAtual() usuario: Usuario) { return usuario; }
```

### Compondo decorators com `applyDecorators`
```ts
export function Admin() {
  return applyDecorators(Roles('admin'), UseGuards(JwtAuthGuard, RolesGuard));
}
```

---

## 5. Decorators legados vs padrão novo

Existe um padrão oficial de decorators no JavaScript (TC39, suportado no TypeScript 5+). O Nest ainda usa os decorators **legados/experimentais** do TypeScript (`experimentalDecorators`), porque o padrão novo **não suporta decorator de parâmetro** nem `emitDecoratorMetadata`, e o Nest depende dos dois. É um detalhe, mas mostra que você entende o que está por baixo.

---

## 6. Como falar na entrevista

**"Como o Nest usa decorators?"**
> "Decorators no Nest são basicamente declarativos: eles gravam metadados com reflect-metadata na classe ou no método. Na inicialização, o Nest lê esses metadados pra registrar rotas, aplicar guards e pipes, e resolver a injeção de dependência. Pra DI, o TypeScript com emitDecoratorMetadata grava os tipos dos parâmetros do construtor, e é assim que o Nest sabe o que injetar. Por isso interface não serve como token: ela não existe em runtime."

---

## 7. Resumo

- TypeScript = JS + tipos; **tipos somem em runtime**.
- **Decorator** = função aplicada com `@` a classe/método/propriedade/parâmetro.
- Decorators do Nest **gravam metadados** (`reflect-metadata`); o Nest lê e age.
- `emitDecoratorMetadata` grava os **tipos do construtor** → base da DI.
- **Interface não é injetável** diretamente (some em runtime) → usar token.
- Custom decorators: `SetMetadata`, `createParamDecorator`, `applyDecorators`.

## Termos desta aula
TypeScript · superset · tipagem estática · transpilação · decorator · metadata · reflect-metadata · programação declarativa · experimentalDecorators · emitDecoratorMetadata · design:paramtypes · token de injeção · SetMetadata · Reflector · createParamDecorator · applyDecorators

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 02** e separadas por nível.
