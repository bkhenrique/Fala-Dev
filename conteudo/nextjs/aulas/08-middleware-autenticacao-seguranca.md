# Aula 08 — Middleware (Proxy), Autenticação e Segurança

> **Objetivo:** entender o middleware do Next (renomeado para *proxy* no Next 16), como montar autenticação de forma segura, e os cuidados de segurança específicos de uma aplicação Next.

---

## 1. Middleware / Proxy

É um arquivo na raiz do projeto que roda **antes** de a requisição chegar à rota. Ele pode:
- **Redirecionar** (`/dashboard` sem login → `/login`).
- **Reescrever** a URL (*rewrite*: mostrar outro conteúdo mantendo a URL).
- Ler/definir **cookies** e **headers**.
- Responder direto.

```ts
// middleware.ts (até o Next 15)  |  proxy.ts (Next 16+, mesma ideia)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const sessao = request.cookies.get('sessao');
  if (!sessao && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };
```

No **Next 16**, o arquivo passou a se chamar **`proxy.ts`** (função `proxy`), justamente para deixar claro o papel: um **proxy de rede** na frente da aplicação, e não um "middleware" no sentido do Express.

Usos típicos:
- Redirecionamento por autenticação (checagem **otimista**, rápida, só olhando o cookie).
- **Internacionalização**: redirecionar para `/pt` ou `/en` conforme o idioma.
- **Testes A/B** e feature flags (rewrite para variantes).
- Headers de segurança, bloqueio geográfico.

Cuidados:
- Roda em **toda** requisição que casa com o `matcher`, então precisa ser **leve**: nada de consulta pesada ao banco.
- Historicamente rodava no **Edge runtime** (APIs limitadas, sem `fs`, várias libs de Node não funcionam). Versões recentes permitem o **runtime Node**.

---

## 2. ⚠️ Middleware não é a sua única barreira de segurança

Em 2025 houve uma vulnerabilidade séria no Next (CVE-2025-29927) em que um header específico permitia **pular o middleware**. Aplicações que faziam **toda** a checagem de autenticação **só** no middleware ficaram expostas.

Lição que vale para qualquer framework: **defesa em profundidade** (*defense in depth*).

> O middleware faz a checagem **otimista** (redirecionar rápido quem não tem cookie). A checagem **real** de autenticação e autorização acontece **perto dos dados**: na Server Action, no Route Handler, e na camada que acessa o banco.

Padrão recomendado: **DAL (Data Access Layer)**, uma camada de acesso a dados que **sempre** verifica a sessão antes de devolver algo:

```ts
// lib/dal.ts
import 'server-only';
import { cache } from 'react';

export const verificarSessao = cache(async () => {
  const token = (await cookies()).get('sessao')?.value;
  const sessao = await validarToken(token);
  if (!sessao) redirect('/login');
  return sessao;
});

export async function getPedidosDoUsuario() {
  const { usuarioId } = await verificarSessao();
  return db.pedido.findMany({ where: { usuarioId } });   // ownership embutido
}
```

---

## 3. Autenticação em Next

Opções comuns:
- **Auth.js** (antigo NextAuth): login social (Google, GitHub), credenciais, sessões.
- **Clerk**, **Auth0**, **Supabase Auth**, **Better Auth**: serviços/libs prontos.
- **Implementação própria**: JWT ou sessão no banco, em cookie.

### Onde guardar o token
- **Cookie `httpOnly`**: JavaScript do navegador **não consegue ler** → protege contra roubo por **XSS**. É o recomendado.
  - Com **`Secure`** (só HTTPS) e **`SameSite=Lax`** ou `Strict` (ajuda contra **CSRF**).
- **`localStorage`**: qualquer script da página lê → se houver XSS, o token é roubado. Evite para tokens de sessão.

### Sessão stateless vs no banco
- **Stateless** (JWT criptografado/assinado no cookie): sem consulta ao banco, difícil de revogar.
- **Database session**: cookie só com um ID, sessão no banco/Redis; revogação fácil.

---

## 4. Os ataques que você precisa saber nomear

| Ataque | O que é | Defesa no Next |
|---|---|---|
| **XSS** (*Cross-Site Scripting*) | Injetar script malicioso na página | React **escapa** o conteúdo por padrão; cuidado com `dangerouslySetInnerHTML` (sanitizar com DOMPurify); **CSP**; cookies `httpOnly` |
| **CSRF** (*Cross-Site Request Forgery*) | Site malicioso faz o navegador da vítima mandar requisição autenticada | Cookies `SameSite`; Server Actions checam `Origin`; tokens CSRF em Route Handlers com cookie |
| **IDOR** | Trocar o id e acessar recurso de outro | Checar ownership na DAL/action |
| **Vazamento de segredo** | Chave de API indo pro bundle | `server-only`, nunca `NEXT_PUBLIC_` em segredo |
| **SSRF** (*Server-Side Request Forgery*) | Fazer o servidor buscar URLs internas via input do usuário | Validar/limitar URLs (ex: domínios permitidos em `next/image`) |
| **Exposição de dados** | Passar objeto inteiro do banco para Client Component | Mandar só os campos necessários (DTO) |

### Headers de segurança
Configurados no `next.config` (`headers()`) ou no middleware:
- **CSP** (*Content Security Policy*): quais origens de script/estilo/imagem são permitidas. Principal defesa extra contra XSS.
- `X-Frame-Options` / `frame-ancestors` (contra **clickjacking**), `Strict-Transport-Security` (HSTS), `X-Content-Type-Options`.

---

## 5. Como falar na entrevista

**"Como você protege rotas no Next?"**
> "Em camadas. O middleware, que no Next 16 virou proxy, faz uma checagem otimista: se não tem cookie de sessão, redireciona pro login. Mas a checagem real fica perto dos dados: uma data access layer com server-only que valida a sessão e aplica ownership antes de qualquer query, e toda Server Action e Route Handler autentica e autoriza de novo. Isso é defesa em profundidade; inclusive teve uma CVE em 2025 que permitia pular o middleware, e quem dependia só dele ficou exposto. A sessão vai em cookie httpOnly, Secure e SameSite, pra proteger de XSS e CSRF."

---

## 6. Resumo

- **Middleware/Proxy**: roda antes da rota; redirect, rewrite, cookies, headers; `matcher`; precisa ser **leve**.
- Next 16: **`middleware.ts` → `proxy.ts`**.
- Middleware = checagem **otimista**; checagem real **perto dos dados** (**DAL**, actions, handlers): **defesa em profundidade**.
- Auth: Auth.js, Clerk etc. ou próprio; token em **cookie `httpOnly` + `Secure` + `SameSite`**, não em `localStorage`.
- Ataques: **XSS, CSRF, IDOR, SSRF**, vazamento de segredo, exposição de dados.
- Headers: **CSP**, HSTS, frame-ancestors.

## Termos desta aula
middleware · proxy · matcher · redirect · rewrite · Edge runtime · Node runtime · checagem otimista · defesa em profundidade · CVE · DAL · server-only · Auth.js · sessão stateless · database session · cookie httpOnly · Secure · SameSite · XSS · CSRF · IDOR · SSRF · dangerouslySetInnerHTML · sanitização · CSP · clickjacking · HSTS · i18n · teste A/B

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 08** e separadas por nível.
