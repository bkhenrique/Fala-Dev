# Aula 06 — Validação, DTOs e Serialização

> **Objetivo:** entender o que é um DTO, por que validar na borda, como o `ValidationPipe` funciona com class-validator/class-transformer, e como controlar o que sai na resposta.

---

## 1. Por que validar na borda

**Borda** (*edge*) = o ponto onde dados **de fora** entram no sistema (request HTTP, mensagem de fila, webhook).

Regra: **nunca confie no input**. Validar na borda garante que, daí pra dentro, o código trabalha com dados no formato certo. Isso evita:
- Erros estranhos lá no fundo (`Cannot read property of undefined`).
- Dados lixo no banco.
- Falhas de segurança (campos inesperados, *mass assignment*, injeção).

Resposta pra input inválido: **400 Bad Request** com a lista do que está errado (ou **422 Unprocessable Entity**, dependendo da convenção da API).

---

## 2. DTO (Data Transfer Object)

**DTO** é uma classe que define **o formato dos dados** que entram (ou saem) da API. É o **contrato** da rota.

```ts
import { IsEmail, IsString, MinLength, IsOptional, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EnderecoDto {
  @IsString() rua: string;
  @IsString() cidade: string;
}

export class CriarUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  senha: string;

  @IsOptional()
  @IsInt()
  @Min(18)
  idade?: number;

  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco: EnderecoDto;
}
```

Por que **classe** e não **interface**? Porque interface some em runtime (aula 02). A classe existe em runtime, então os decorators de validação podem ser lidos.

---

## 3. Como o ValidationPipe funciona

```ts
// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,              // remove campos que não estão no DTO
  forbidNonWhitelisted: true,   // ou: rejeita (400) se vier campo a mais
  transform: true,              // converte o objeto pra instância do DTO e tipos primitivos
}));
```

O que acontece com um `@Body() dto: CriarUsuarioDto`:
1. O body chega como **objeto JS simples** (JSON parseado).
2. **class-transformer** (`plainToInstance`) converte num **objeto da classe** `CriarUsuarioDto`.
3. **class-validator** (`validate`) lê os decorators e checa cada campo.
4. Se houver erros → `BadRequestException` com as mensagens. Se não → o handler recebe o DTO.

### As opções que importam
- **`whitelist`**: descarta propriedades sem decorator. Protege contra **mass assignment** (ex: o cliente mandar `"role": "admin"` e você fazer `repo.save(dto)`).
- **`forbidNonWhitelisted`**: em vez de descartar, **rejeita**. Mais explícito.
- **`transform`**: converte tipos (`"10"` de query string → `10`) e entrega instância real do DTO.

---

## 4. Reaproveitando DTOs: mapped types

```ts
import { PartialType, PickType, OmitType } from '@nestjs/mapped-types'; // ou @nestjs/swagger

export class AtualizarUsuarioDto extends PartialType(CriarUsuarioDto) {}  // todos opcionais
export class LoginDto extends PickType(CriarUsuarioDto, ['email', 'senha']) {}
export class UsuarioPublicoDto extends OmitType(CriarUsuarioDto, ['senha']) {}
```

Evita repetir validação (**DRY**, *Don't Repeat Yourself*).

---

## 5. Alternativa: Zod

Muitos times usam **Zod** em vez de class-validator:
```ts
const CriarUsuarioSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(8),
});
type CriarUsuario = z.infer<typeof CriarUsuarioSchema>;
```
Com um pipe customizado (ou bibliotecas como `nestjs-zod`).

Vantagens do Zod: o **tipo é inferido do schema** (uma fonte da verdade), dá pra compartilhar o schema com o front, e serve também para validar **output de LLM**, variáveis de ambiente, etc.

Trade-off: class-validator é o "padrão da casa" do Nest e integra direto com Swagger; Zod é mais funcional e portável.

---

## 6. Serialização: controlar o que SAI

Validar a entrada é metade. A outra metade: **não vazar dados** na saída (senha, hash, campos internos).

Opções:

**a) `ClassSerializerInterceptor` + `@Exclude`**
```ts
export class UsuarioEntity {
  id: number;
  email: string;
  @Exclude() senhaHash: string;
}
// app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
```
Funciona se o handler retornar **instância da classe**, não objeto simples.

**b) DTO de resposta explícito** (mapear entity → response DTO no service). Mais verboso, mas mais seguro e explícito: a API **nunca** expõe a entidade do banco diretamente.

> Boa prática: **não retornar a entidade do ORM direto**. Isso acopla o contrato da API ao schema do banco e é o jeito mais fácil de vazar campo sensível.

---

## 7. Documentação: Swagger / OpenAPI

Com `@nestjs/swagger`, os DTOs viram documentação **OpenAPI** automaticamente (com `@ApiProperty()` ou o plugin da CLI que infere). O resultado é uma página `/docs` com todas as rotas, e um JSON que pode gerar **client tipado** para o front.

---

## 8. Como falar na entrevista

**"Como você valida dados no Nest?"**
> "Valido na borda com DTOs e o ValidationPipe global. O DTO é uma classe com decorators do class-validator; o pipe usa o class-transformer pra converter o JSON numa instância e o class-validator pra checar, devolvendo 400 com os erros. Uso whitelist e forbidNonWhitelisted pra evitar mass assignment, e transform pra converter tipos. Na saída, não exponho entidades do banco: uso DTO de resposta ou o ClassSerializerInterceptor com @Exclude pra não vazar campo sensível."

---

## 9. Resumo

- **Validar na borda**, nunca confiar no input; 400 (ou 422) se inválido.
- **DTO** = classe que define o contrato; classe porque existe em runtime.
- `ValidationPipe`: **class-transformer** converte, **class-validator** valida.
- **whitelist / forbidNonWhitelisted** contra **mass assignment**; **transform** converte tipos.
- **Mapped types**: `PartialType`, `PickType`, `OmitType`.
- **Zod**: alternativa com tipo inferido do schema.
- Saída: `@Exclude` + serializer, ou **DTO de resposta**. Não expor entity.
- DTOs geram **OpenAPI/Swagger**.

## Termos desta aula
borda · input validation · DTO · contrato · class-validator · class-transformer · ValidationPipe · whitelist · forbidNonWhitelisted · transform · mass assignment · 400 Bad Request · 422 · mapped types · DRY · Zod · schema · inferência de tipo · serialização · @Exclude · ClassSerializerInterceptor · response DTO · OpenAPI · Swagger

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 06** e separadas por nível.
