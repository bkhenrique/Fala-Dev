# Aula 07 — Autenticação e Autorização no Nest

> **Objetivo:** diferenciar autenticação de autorização, entender como JWT funciona, e montar o fluxo completo no Nest com guards, Passport, `@Public()` e controle por roles (RBAC).

---

## 1. Dois conceitos diferentes

- **Autenticação (authentication, "authN")**: **quem é você?** Provar identidade (login, token).
- **Autorização (authorization, "authZ")**: **o que você pode fazer?** Verificar permissão.

Status HTTP correspondentes:
- **401 Unauthorized**: não autenticado (sem token, token inválido/expirado). O nome engana, mas é sobre **autenticação**.
- **403 Forbidden**: autenticado, mas **sem permissão**.

> Analogia: o crachá na portaria é autenticação; o crachá abrir só alguns andares é autorização.

---

## 2. Sessão vs Token

**Sessão (stateful):** o servidor guarda a sessão (memória/Redis/banco) e o cliente guarda só um **session id** num cookie. A cada request, o servidor consulta a sessão.
- Fácil de **revogar** (apaga a sessão).
- Exige armazenamento compartilhado para escalar.

**Token (stateless), tipo JWT:** o próprio token carrega as informações, assinado. O servidor só **verifica a assinatura**, sem consultar nada.
- Escala fácil, bom para APIs e mobile.
- **Difícil de revogar** antes de expirar.

---

## 3. JWT (JSON Web Token)

Formato: `header.payload.signature`, cada parte em **Base64URL**.

```
eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOjQyLCJyb2xlcyI6WyJhZG1pbiJdLCJleHAiOjE3MDAwMDB9 . 4pQ...
     header                          payload (claims)                              assinatura
```

- **Header**: algoritmo (`HS256`, `RS256`).
- **Payload**: as **claims**: `sub` (id do usuário), `exp` (expiração), `iat` (emitido em), roles…
- **Signature**: hash do header+payload com uma **chave secreta** (HS256) ou **chave privada** (RS256).

Pontos essenciais:
- O payload **não é criptografado**, só codificado. **Qualquer um lê**. Nunca coloque senha ou dado sensível.
- A assinatura garante **integridade**: se alguém alterar o payload, a assinatura não bate.
- **HS256** (simétrico, mesma chave assina e verifica) vs **RS256** (assimétrico: privada assina, pública verifica; bom quando vários serviços precisam verificar).

### Access token + Refresh token
- **Access token**: curto (ex: 15 min). Vai em toda requisição (`Authorization: Bearer <token>`).
- **Refresh token**: longo (dias), guardado com mais cuidado (cookie `httpOnly`), usado **só** para pegar um novo access token. Pode ser guardado no banco para permitir **revogação** e **rotação**.

Assim, se um access token vazar, ele expira rápido.

---

## 4. Fluxo no Nest

```
POST /auth/login {email, senha}
   → AuthService valida usuário (compara hash da senha com bcrypt/argon2)
   → JwtService.sign({ sub: usuario.id, roles }) → devolve access token (+ refresh)

GET /pedidos  (Authorization: Bearer xxx)
   → JwtAuthGuard: valida assinatura e expiração → coloca req.user
   → RolesGuard: confere se req.user tem a role exigida
   → Controller
```

### Com Passport
**Passport** é uma biblioteca de autenticação com **estratégias** (local, jwt, google, github…). O Nest integra via `@nestjs/passport`:

```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  validate(payload: { sub: number; roles: string[] }) {
    return { id: payload.sub, roles: payload.roles }; // vira req.user
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Dá pra fazer **sem Passport** também: um guard que usa `JwtService.verifyAsync()` direto. Mais simples e explícito; Passport vale mais quando há várias estratégias (login social).

---

## 5. Guard global + rotas públicas

Em vez de lembrar de colocar `@UseGuards` em toda rota (e esquecer em alguma), o padrão é: **tudo protegido por padrão**, e marcar exceções.

```ts
export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super(); }
  canActivate(ctx: ExecutionContext) {
    const publica = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      ctx.getHandler(), ctx.getClass(),
    ]);
    return publica ? true : super.canActivate(ctx);
  }
}

// app.module.ts
providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }]
```

Isso é **secure by default** (seguro por padrão): esquecer um decorator deixa a rota **fechada**, não aberta.

---

## 6. Autorização: RBAC, e além

**RBAC (Role-Based Access Control)**: permissões por **papel** (admin, gerente, cliente).
```ts
@Roles('admin')
@Delete(':id')
remover() {}
```
Implementado com `SetMetadata('roles', [...])` + `RolesGuard` que lê com `Reflector` (código na aula 05).

Quando RBAC não basta:
- **Verificação de propriedade** (*ownership*): "o usuário só pode ver os **próprios** pedidos". Isso é regra que depende do **recurso**, então normalmente fica no **service** (`where: { id, usuarioId }`). Esquecer isso gera a falha **IDOR** (*Insecure Direct Object Reference*): trocar o id na URL e ver dado de outro usuário.
- **ABAC (Attribute-Based)** / políticas: permissões por atributos (ex: `@casl/ability`).

---

## 7. Segurança de senha

- **Nunca** guardar senha em texto puro, nem com hash rápido (MD5, SHA-256).
- Usar **hash lento com salt**: **bcrypt** ou **argon2**. Lento de propósito, pra dificultar força bruta.
- **Salt**: valor aleatório por usuário, evita *rainbow tables*.
- Proteção de login: **rate limiting** (`@nestjs/throttler`), bloqueio após tentativas.

---

## 8. Como falar na entrevista

**"Como você fez autenticação e autorização no Nest?"**
> "Autenticação com JWT: no login valido a senha com bcrypt e emito um access token curto e um refresh token. Um JwtAuthGuard global valida o token em toda rota, com um decorator @Public pra exceções, ou seja, seguro por padrão. Autorização por roles com um decorator @Roles e um RolesGuard que lê o metadado via Reflector. E a verificação de que o recurso pertence ao usuário fica no service, pra evitar IDOR. 401 quando não autenticado, 403 quando não tem permissão."

---

## 9. Resumo

- **AuthN** = quem é você (401). **AuthZ** = o que pode fazer (403).
- **Sessão** (stateful, fácil revogar) vs **JWT** (stateless, difícil revogar).
- JWT = header.payload.signature; payload **legível**, assinatura garante **integridade**.
- **Access token curto + refresh token** (revogável, rotação).
- Nest: **JwtAuthGuard global + `@Public()`** = secure by default.
- **RBAC** com `@Roles` + `RolesGuard`; **ownership** no service (evita **IDOR**).
- Senha: **bcrypt/argon2** + salt; rate limit no login.

## Termos desta aula
autenticação · autorização · 401 · 403 · sessão · stateful · stateless · JWT · claims · sub · exp · Base64URL · assinatura · HS256 · RS256 · access token · refresh token · Bearer · httpOnly · Passport · strategy · APP_GUARD · secure by default · RBAC · ABAC · ownership · IDOR · bcrypt · argon2 · salt · rainbow table · throttler

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 07** e separadas por nível.
