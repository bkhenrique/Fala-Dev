# Aula 06 — Autenticação, autorização e Sanctum

> **Objetivo:** distinguir identidade de permissão e escolher mecanismos de sessão, tokens, Gates e Policies em uma aplicação Laravel.

---

## 1. Duas perguntas diferentes

**Autenticação** responde “quem está fazendo a requisição?”. **Autorização** responde “essa identidade pode executar esta ação neste recurso?”. Um usuário autenticado ainda pode não ter acesso a um pedido pertencente a outra pessoa.

Separar as duas decisões torna o código mais seguro. Middleware pode exigir login; policy verifica propriedade, papel ou estado do recurso antes de uma ação específica.

## 2. Guards e providers

Um **guard** define como a requisição é autenticada, como sessão de navegador ou token. Um **provider** explica de onde vêm usuários, por exemplo Eloquent ou uma fonte externa. Guard não é sinônimo de papel, e provider aqui não é o mesmo conceito de service provider do container.

Aplicação web tradicional costuma usar sessão e cookie. Após login, o navegador envia o cookie em requisições seguintes; o servidor valida o identificador e busca a sessão no driver configurado.

## 3. Sessão e proteção contra fixation

Após autenticar, regenere o ID da sessão para que um identificador conhecido antes do login não seja reutilizado com privilégios novos. No logout, invalide a sessão e regenere o token CSRF conforme o fluxo recomendado pelo framework.

Cookies de sessão precisam de HTTPS em produção e atributos como `HttpOnly`, `Secure` e `SameSite` adequados. Se a autenticação usa cookie automaticamente enviado pelo navegador, proteção CSRF continua relevante.

## 4. Sanctum: SPA e tokens pessoais

**Laravel Sanctum** atende autenticação stateful de uma SPA first-party e tokens para clientes API. No modo SPA, usa cookies e proteção CSRF, não um token bearer guardado de qualquer maneira no JavaScript. Para tokens pessoais, a API pode emitir credenciais com abilities limitadas.

Sanctum é simples para first-party apps e tokens de API comuns. **Passport** implementa um servidor OAuth2 mais amplo para cenários que exigem fluxos e autorização próprios desse protocolo. Escolha pelo contrato de clientes, não por “API precisa de JWT” como regra universal.

## 5. Gates e Policies

**Gate** é uma autorização nomeada que responde se um usuário pode realizar uma ação. **Policy** agrupa decisões em torno de um modelo ou recurso, como `PedidoPolicy::update`. Laravel pode chamar policies por convenção e elas podem ser aplicadas pelo controller, middleware ou Blade.

Policy pode considerar papel, ownership, estado, organização e regra de domínio. Esconder um botão no front é experiência do usuário; a decisão precisa ser repetida no servidor.

## 6. Route middleware e autorização de objeto

Uma rota protegida por `auth` garante uma identidade autenticada, mas não necessariamente acesso ao recurso carregado. A autorização deve usar o usuário corrente e o recurso específico, preferencialmente através da policy.

Cuidado com IDOR (Insecure Direct Object Reference): trocar `/orders/10` por `/orders/11` não pode revelar dado de outra conta. Consultar recursos já limitados ao usuário reduz exposição, mas ação sensível ainda precisa de teste de autorização negativo.

## 7. Abilities de tokens

Token abilities limitam o que um token de API pode fazer, parecido com escopos simplificados. Elas não substituem policy do recurso: um token com ability de leitura ainda não deve permitir ler pedido de outro tenant.

Guarde tokens como segredo, limite expiração quando aplicável e permita revogação. Evite colocar bearer token em URL ou logs. Se uma credencial vazou, rotacioná-la é diferente de trocar a senha do usuário.

## 8. Como falar na entrevista

**“Como escolheria autenticação para Laravel com SPA e API?”**

> “Para uma SPA first-party, eu avaliaria Sanctum em modo stateful com sessão e proteção CSRF. Para clientes móveis ou integrações, Sanctum pode emitir tokens com abilities; OAuth2 completo pode justificar Passport. Depois de autenticar, policies continuam decidindo acesso a cada recurso. Eu testaria explicitamente que usuário autenticado não acessa dados de outro usuário.”

## 9. Resumo

- Autenticação estabelece identidade; autorização avalia ação e recurso.
- Guard escolhe o mecanismo de autenticação; provider busca usuário.
- Sessão exige rotação de ID e proteção CSRF em fluxos com cookies.
- Sanctum cobre SPA first-party e tokens simples; Passport serve a requisitos OAuth2 completos.
- Policies e Gates autorizam no servidor; abilities de token não substituem ownership.

## Termos desta aula
Autenticação · autorização · guard · provider · sessão · CSRF · Sanctum · Passport · ability · Gate · Policy · IDOR

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 06** e separadas por nível.

### Para aprofundar
[Authentication](https://laravel.com/framework/docs/13.x/authentication) · [Authorization](https://laravel.com/framework/docs/13.x/authorization) · [CSRF](https://laravel.com/framework/docs/13.x/csrf)
