# Aula 01 — O que é o NestJS e por que ele existe

> **Objetivo:** explicar o que é o Nest, que problema ele resolve em relação ao Express puro, e qual é a "filosofia" dele: framework opinativo, modular, com injeção de dependência.

---

## 1. O problema: Express não te diz como organizar nada

O Express (aula 10 de Node) é **minimalista**: te dá rotas e middlewares, e o resto é com você. Numa API pequena isso é ótimo. Num projeto grande, com vários devs, vira isso:

- Cada dev organiza pastas de um jeito (`routes/`, `controllers/`, `services/`, `utils/`, `helpers/`...).
- Dependências criadas na mão com `new` espalhados, ou `require` de instâncias globais.
- Testar é difícil, porque não dá pra trocar o banco por um mock sem gambiarra.
- Validação, autenticação e tratamento de erro feitos de formas diferentes em cada rota.
- Onboarding lento: cada projeto Express é um mundo.

Isso é o que se chama de **falta de arquitetura padronizada**.

---

## 2. A resposta: um framework **opinativo**

O **NestJS** (criado em 2017 por Kamil Myśliwiec) é um framework Node para backend, escrito em **TypeScript**, fortemente inspirado no **Angular**.

> **NestJS é um framework Node.js opinativo para construir aplicações server-side escaláveis, com arquitetura modular, injeção de dependência nativa e TypeScript, rodando sobre Express ou Fastify.**

**Opinativo** (*opinionated*) = o framework **já decide** muita coisa por você: como organizar módulos, onde fica cada responsabilidade, como injetar dependências, como validar. Você perde um pouco de liberdade e ganha **padronização**.

> Analogia: Express é um terreno vazio com material de construção. Nest é um condomínio com planta pronta: você ainda decora do seu jeito, mas cozinha fica na cozinha e banheiro no banheiro.

---

## 3. Nest roda **em cima** do Express (ou Fastify)

Nest **não substitui** o servidor HTTP. Ele é uma camada de arquitetura por cima:

```
┌───────────────────────────────┐
│  Seu código (módulos, services) │
├───────────────────────────────┤
│  NestJS (DI, módulos, pipes,    │
│  guards, interceptors...)       │
├───────────────────────────────┤
│  Plataforma HTTP:               │
│  Express (padrão) ou Fastify    │
├───────────────────────────────┤
│  Node.js                        │
└───────────────────────────────┘
```

Isso se chama **abstração de plataforma**: você escreve o código do Nest e ele funciona com Express ou Fastify (`@nestjs/platform-express` ou `@nestjs/platform-fastify`).

---

## 4. Os pilares do Nest

| Pilar | O que é | Aula |
|---|---|---|
| **TypeScript** | Tipagem estática, decorators, melhor tooling | 02 |
| **Decorators** | `@Controller`, `@Get`, `@Injectable`: configuração declarativa | 02 |
| **Módulos** | Organização por domínio/funcionalidade | 03 |
| **Injeção de dependência** | O framework cria e entrega as dependências | 04 |
| **Pipeline da requisição** | Middleware, guards, interceptors, pipes, filters | 05 |
| **Ecossistema oficial** | Config, validação, ORM, filas, WebSocket, GraphQL, microservices, Swagger | 06–10 |

---

## 5. Cara de um código Nest

```ts
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get(':id')
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.buscarPorId(id);
  }

  @Post()
  criar(@Body() dto: CriarUsuarioDto) {
    return this.usuariosService.criar(dto);
  }
}

@Injectable()
export class UsuariosService {
  constructor(private readonly repo: UsuariosRepository) {}

  buscarPorId(id: number) {
    return this.repo.findById(id);
  }
}

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuariosRepository],
})
export class UsuariosModule {}
```

Repare:
- Ninguém dá `new UsuariosService()`. O Nest cria e **injeta** pelo construtor.
- O **controller** só recebe e delega. A **regra** fica no **service**.
- Validação (`ParseIntPipe`, DTO) é **declarativa**, via decorators.

A CLI gera essa estrutura: `nest g resource usuarios`.

---

## 6. Vantagens e custos (trade-off)

**Vantagens:**
- **Padronização**: todo projeto Nest é parecido; onboarding rápido.
- **Testabilidade**: DI permite trocar dependências por mocks facilmente.
- **Separação de responsabilidades** clara.
- **Ecossistema oficial** pra quase tudo.
- Escala bem para **times grandes** e projetos longos.

**Custos:**
- **Curva de aprendizado**: decorators, DI, módulos, RxJS nos interceptors.
- **Mais abstração e boilerplate** para coisas simples.
- Um pouco de **overhead** em relação a Express/Fastify puros (geralmente irrelevante perto do I/O).
- "Mágica": quando algo dá errado na DI, o erro pode ser confuso no começo.

Quando **não** usaria: um script, uma função serverless pequena, um microserviço com 2 rotas. Aí Express/Fastify puro ou até sem framework resolvem.

---

## 7. Como falar na entrevista

**"O que é o NestJS e por que usar?"**
> "Nest é um framework Node opinativo, em TypeScript, que roda sobre Express ou Fastify e traz uma arquitetura pronta: módulos, injeção de dependência e um pipeline de requisição com guards, pipes, interceptors e exception filters. O ganho principal é padronização e testabilidade, o que faz muita diferença em projeto grande com vários devs. O custo é mais abstração e curva de aprendizado, então pra algo pequeno eu iria de Express ou Fastify puro."

---

## 8. Resumo

- Express é minimalista; Nest é **opinativo** e dá **arquitetura**.
- Nest roda **sobre** Express (padrão) ou Fastify.
- Pilares: **TypeScript, decorators, módulos, DI, pipeline da requisição**.
- Controller recebe e delega; service tem a regra.
- Trade-off: padronização e testabilidade × abstração e curva de aprendizado.

## Termos desta aula
framework opinativo · minimalista · arquitetura · TypeScript · decorator · módulo · injeção de dependência · abstração de plataforma · Express · Fastify · boilerplate · separação de responsabilidades · testabilidade · CLI

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 01** e separadas por nível.
