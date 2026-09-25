# Aula 04 — Autenticação, Autorização e Segurança Web

> **Objetivo:** entender sessão vs token, JWT, OAuth2 e OpenID Connect, CORS, como guardar senhas, e os ataques mais comuns (OWASP Top 10) com suas defesas.

---

## 1. Autenticação vs Autorização

- **Autenticação (AuthN)**: provar **quem você é** (login, token, biometria). Falha → **401**.
- **Autorização (AuthZ)**: decidir **o que você pode fazer**. Falha → **403**.

Modelos de autorização:
- **RBAC** (*Role-Based*): por papel (admin, gerente, cliente).
- **ABAC** (*Attribute-Based*): por atributos (departamento, horário, dono do recurso).
- **Ownership**: o recurso pertence ao usuário? (Sem isso, **IDOR**: trocar o id na URL e ver dado alheio.)

**Princípio do menor privilégio**: cada usuário/serviço tem **só** as permissões que precisa.

---

## 2. Sessão vs Token

### Sessão (stateful)
1. Login → servidor cria uma **sessão** (no Redis/banco) e devolve um **session id** em cookie.
2. A cada requisição, o navegador manda o cookie; o servidor **consulta** a sessão.
- ✅ Revogação imediata (apaga a sessão), token pequeno e opaco.
- ❌ Precisa de armazenamento compartilhado entre instâncias.

### Token (stateless), normalmente JWT
1. Login → servidor devolve um **token assinado** com as informações (id, roles, expiração).
2. A cada requisição, o cliente manda `Authorization: Bearer <token>`; o servidor só **verifica a assinatura**.
- ✅ Sem consulta a banco, bom para APIs, mobile e vários serviços.
- ❌ **Difícil revogar** antes de expirar; token maior.

### JWT em 30 segundos
`header.payload.signature`, em Base64URL.
- Payload **legível por qualquer um** (não é criptografado): nunca colocar dado sensível.
- A **assinatura** garante que ninguém alterou. HS256 (segredo compartilhado) ou RS256 (chave privada assina, pública verifica).
- Claims comuns: `sub` (usuário), `exp` (expiração), `iat`, `iss` (emissor), `aud` (destinatário).
- Padrão: **access token curto** (minutos) + **refresh token** longo e revogável.

---

## 3. OAuth 2.0 e OpenID Connect

### OAuth 2.0: autorização delegada
Resolve: "quero que o **app X** acesse **meus dados** no **Google** **sem** eu dar minha senha do Google pro app X".

Papéis:
- **Resource Owner**: o usuário, dono dos dados.
- **Client**: o app que quer acessar.
- **Authorization Server**: quem autentica o usuário e emite tokens (Google, Keycloak, Auth0, Cognito).
- **Resource Server**: a API que tem os dados e aceita o **access token**.

Fluxos (*grant types*) principais:
- **Authorization Code + PKCE**: para apps com usuário (web, SPA, mobile). O usuário é redirecionado para o servidor de autorização, faz login, volta com um **código**, e o app troca o código por tokens. O **PKCE** impede que um código interceptado seja usado por outro.
- **Client Credentials**: **máquina a máquina** (um serviço chamando outro, sem usuário).
- (Os antigos *Implicit* e *Password* são desaconselhados.)

**Scopes**: o que o token permite (`read:pedidos`, `email`).

### OpenID Connect (OIDC)
OAuth 2.0 é sobre **autorização** (acesso a recursos). **OIDC** é uma camada **em cima** que adiciona **autenticação**: um **ID Token** (JWT) dizendo **quem é o usuário**. É o que está por trás de "Entrar com Google" e de **SSO** (*Single Sign-On*: um login para vários sistemas).

Frase-chave: **"OAuth2 é autorização; OIDC adiciona identidade."**

---

## 4. Senhas

- **Nunca** guardar em texto puro nem com hash rápido (MD5, SHA-1, SHA-256): GPUs testam bilhões por segundo.
- Usar **hash lento, com salt**: **bcrypt**, **scrypt** ou **argon2** (recomendado atualmente).
- **Salt**: valor aleatório por usuário, guardado junto. Impede **rainbow tables** e que senhas iguais tenham o mesmo hash.
- **Hash ≠ criptografia**: hash é **de mão única** (não se "descriptografa"); criptografia é reversível com a chave.
- Complementos: **MFA/2FA**, rate limit e bloqueio de tentativas no login, verificação de senhas vazadas.

---

## 5. CORS

O navegador aplica a **Same-Origin Policy**: um script de `https://app.com` **não pode ler** respostas de `https://api.outra.com`, a menos que o servidor **permita**.

**Origem** = protocolo + domínio + porta.

**CORS** (*Cross-Origin Resource Sharing*) é o mecanismo para o **servidor** dizer quais origens podem:
```
Access-Control-Allow-Origin: https://app.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
```
Para requisições "não simples" (ex: com `Authorization` ou `Content-Type: application/json`), o navegador faz antes um **preflight**: uma requisição **OPTIONS** perguntando se pode.

Pontos que caem:
- CORS é uma proteção **do navegador**. Postman, curl e outro backend **ignoram** CORS. **Não é mecanismo de autenticação.**
- `Access-Control-Allow-Origin: *` não funciona junto com credenciais (cookies).
- Erro de CORS se resolve **no servidor**, não no front.

---

## 6. OWASP Top 10 (os ataques que você precisa nomear)

A **OWASP** mantém a lista dos riscos mais comuns em aplicações web. Os principais conceitos:

| Ataque | O que é | Defesa |
|---|---|---|
| **Broken Access Control** (nº 1) | Acessar o que não deveria (IDOR, rota sem checagem) | Autorização no servidor em toda operação, ownership, deny by default |
| **Injection** (SQL, comando) | Input do usuário vira código | **Queries parametrizadas**/ORM, nunca concatenar SQL; validar input |
| **XSS** | Injetar script que roda no navegador de outro usuário | Escapar saída (frameworks fazem por padrão), sanitizar HTML, **CSP**, cookie HttpOnly |
| **CSRF** | Site malicioso faz o navegador da vítima enviar requisição autenticada | **SameSite** cookie, token CSRF, checar `Origin` |
| **SSRF** | Fazer o servidor buscar URLs internas a partir de input | Allowlist de destinos, bloquear IPs internos |
| **Falhas criptográficas** | Dados sensíveis sem criptografia, algoritmos fracos | HTTPS em tudo, criptografia em repouso, hash de senha correto |
| **Configuração insegura** | Debug ligado, stack trace exposto, portas abertas, credenciais padrão | Hardening, erros genéricos em produção |
| **Componentes vulneráveis** | Dependências com falhas conhecidas | `npm audit`, Dependabot, atualizar |
| **Falhas de autenticação** | Senha fraca, sem rate limit, sessão que não expira | MFA, rate limit, expiração, rotação |

Exemplo de SQL injection:
```sql
-- código vulnerável: "SELECT * FROM usuarios WHERE email = '" + email + "'"
-- input: ' OR '1'='1
SELECT * FROM usuarios WHERE email = '' OR '1'='1'   -- retorna todos
```
Com query parametrizada (`WHERE email = $1`), o input é tratado **como dado**, nunca como código.

### Outras práticas
- **Segredos** fora do código (variáveis de ambiente, secret manager); rotação.
- **Proteger PII** (dados pessoais: CPF, e-mail, telefone) em logs e ao enviar para terceiros (ex: mascarar antes de mandar para um provider de IA). LGPD.
- **Defesa em profundidade**: várias camadas de proteção, nenhuma sozinha é suficiente.

---

## 7. Como falar na entrevista

**"Qual a diferença entre OAuth2 e OpenID Connect?"**
> "OAuth2 é um framework de autorização delegada: permite que um app acesse recursos em nome do usuário sem ter a senha dele, através de access tokens com escopos. OIDC é uma camada em cima do OAuth2 que adiciona autenticação, com um ID token dizendo quem é o usuário; é a base do 'entrar com Google' e de SSO. Pra apps com usuário uso Authorization Code com PKCE; entre serviços, Client Credentials."

**"CORS protege a minha API?"**
> "Não como autenticação. CORS é uma política do navegador que controla se um script de outra origem pode ler a resposta. Curl ou outro backend ignoram CORS. A proteção da API é autenticação e autorização no servidor."

---

## 8. Resumo

- **AuthN** (401) × **AuthZ** (403); RBAC, ABAC, ownership; menor privilégio.
- **Sessão** (stateful, revogável) × **JWT** (stateless, difícil revogar); access curto + refresh.
- **OAuth2** = autorização delegada (Authorization Code + **PKCE**, Client Credentials, scopes). **OIDC** = + identidade (ID Token, SSO).
- Senhas: **argon2/bcrypt + salt**; hash ≠ criptografia.
- **CORS**: política do navegador; preflight OPTIONS; não é autenticação.
- **OWASP**: broken access control, injection, XSS, CSRF, SSRF, config insegura, dependências vulneráveis.
- Segredos fora do código, PII protegida, **defesa em profundidade**.

## Termos desta aula
autenticação · autorização · 401 · 403 · RBAC · ABAC · ownership · IDOR · menor privilégio · sessão · token · JWT · claims · access token · refresh token · OAuth 2.0 · resource owner · client · authorization server · resource server · Authorization Code · PKCE · Client Credentials · scope · OpenID Connect · ID Token · SSO · MFA · hash · salt · bcrypt · argon2 · rainbow table · Same-Origin Policy · origem · CORS · preflight · OWASP · SQL injection · query parametrizada · XSS · CSP · CSRF · SSRF · PII · LGPD · defesa em profundidade

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 04** e separadas por nível.
