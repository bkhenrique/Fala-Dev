# Aula 03 — Spring Security

> **Objetivo:** entender como o Spring Security funciona por dentro (a cadeia de filtros), os papéis de autenticação e autorização, como proteger uma API com JWT, e os pontos que mais caem em entrevista: CSRF, CORS, roles e segurança por método.

Conceitos gerais (autenticação × autorização, JWT, OAuth2, CSRF, CORS) estão na [aula de segurança de Fundamentos](../../fundamentos/aulas/04-autenticacao-e-seguranca.md). Aqui o foco é **como o Spring faz**.

---

## 1. O problema

Toda API precisa responder duas perguntas em **toda** requisição: *quem é você?* e *você pode fazer isso?*. Fazer isso à mão em cada controller seria repetitivo e perigoso: basta esquecer uma rota.

O **Spring Security** resolve colocando a segurança **antes** do seu código, numa cadeia de filtros que roda em toda requisição. É um framework poderoso e famoso por ser difícil, principalmente porque muita coisa acontece "por mágica". Entender a cadeia de filtros tira a mágica.

---

## 2. A cadeia de filtros (Security Filter Chain)

Uma aplicação Spring MVC roda sobre a **Servlet API**. Antes da requisição chegar no `DispatcherServlet` (e no seu controller), ela passa por **filtros** (`jakarta.servlet.Filter`).

O Spring Security se pluga ali:

```
Requisição
   │
   ▼
DelegatingFilterProxy        ← filtro "ponte" registrado no servidor (Tomcat)
   │
   ▼
FilterChainProxy             ← escolhe qual SecurityFilterChain usar pela URL
   │
   ▼
SecurityFilterChain          ← lista ordenada de filtros de segurança
   ├─ CorsFilter
   ├─ CsrfFilter
   ├─ filtro de autenticação  (formulário, Basic, BearerToken/JWT…)
   ├─ ExceptionTranslationFilter  ← transforma exceção de segurança em 401/403
   └─ AuthorizationFilter     ← decide se pode acessar a URL
   │
   ▼
DispatcherServlet → Controller
```

É o mesmo padrão **Chain of Responsibility** dos middlewares do Express ou dos guards do Nest: cada filtro faz uma coisa e passa adiante (ou interrompe).

Você pode ter **várias** `SecurityFilterChain` (ex: uma para `/api/**` com JWT e outra para `/admin/**` com login por formulário). O `FilterChainProxy` usa a primeira que casar com a URL.

### Configuração moderna (Spring Security 6+)

A antiga `WebSecurityConfigurerAdapter` **foi removida**. Hoje a configuração é um **bean** do tipo `SecurityFilterChain`:

```java
@Configuration
@EnableMethodSecurity
public class SegurancaConfig {

  @Bean
  SecurityFilterChain api(HttpSecurity http) throws Exception {
    return http
        .securityMatcher("/api/**")
        .csrf(csrf -> csrf.disable())                              // API stateless com token (ver seção 5)
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/publico/**").permitAll()
            .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
            .anyRequest().authenticated())                         // negar por padrão
        .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))
        .build();
  }
}
```

Leia de cima pra baixo: **as regras de URL são avaliadas em ordem**, então a mais específica vem primeiro, e o `anyRequest().authenticated()` no fim garante que o que você esqueceu fica **protegido** (*deny by default*).

---

## 3. Autenticação: as peças

| Peça | Papel |
|---|---|
| **`Authentication`** | Representa o usuário: *principal* (quem), *credentials* (senha/token) e *authorities* (permissões) |
| **`SecurityContextHolder`** | Onde fica o `Authentication` da requisição atual |
| **`AuthenticationManager`** | Recebe um pedido de autenticação e decide se é válido |
| **`AuthenticationProvider`** | Implementa um jeito específico de autenticar (usuário e senha, JWT, LDAP…) |
| **`UserDetailsService`** | Busca o usuário pelo login (normalmente no banco) |
| **`PasswordEncoder`** | Compara a senha digitada com o hash guardado |

Fluxo de login com usuário e senha:
```
filtro de autenticação → AuthenticationManager → AuthenticationProvider
    → UserDetailsService.loadUserByUsername(login)   (busca no banco)
    → PasswordEncoder.matches(senhaDigitada, hash)   (BCrypt)
    → sucesso: Authentication vai pro SecurityContextHolder
```

### PasswordEncoder
- Use **`BCryptPasswordEncoder`** (ou Argon2). **Nunca** guarde senha em texto.
- `PasswordEncoderFactories.createDelegatingPasswordEncoder()` grava o hash com um prefixo do algoritmo (`{bcrypt}$2a$...`), o que permite **migrar de algoritmo** no futuro sem invalidar senhas antigas.

### SecurityContextHolder e ThreadLocal
Por padrão, o contexto de segurança fica num **`ThreadLocal`**: preso à thread que atende a requisição. Consequências:
- Em qualquer ponto da requisição dá pra pegar o usuário: `SecurityContextHolder.getContext().getAuthentication()`, ou no controller com `@AuthenticationPrincipal`.
- Se você passa trabalho pra **outra thread** (`@Async`, `CompletableFuture`), **o contexto não vai junto** automaticamente. É preciso propagar (ex: `DelegatingSecurityContextExecutor`) ou passar o id do usuário como parâmetro.

---

## 4. Autorização

### Roles × Authorities
- **Authority**: uma permissão qualquer, uma string (`pedidos:ler`, `SCOPE_read`).
- **Role**: uma authority com o prefixo **`ROLE_`** por convenção.
- `hasRole("ADMIN")` procura a authority `ROLE_ADMIN`; `hasAuthority("ADMIN")` procura exatamente `ADMIN`. Essa diferença é fonte clássica de bug ("configurei a role e sempre dá 403").

### Por URL
No `authorizeHttpRequests`, como no exemplo acima. Bom para regras amplas (área admin, rotas públicas).

### Por método
Com `@EnableMethodSecurity`:
```java
@PreAuthorize("hasRole('ADMIN') or #usuarioId == authentication.name")
public PerfilResponse buscarPerfil(String usuarioId) { ... }
```
- A expressão (SpEL) pode usar os **parâmetros** do método, o que permite checar **ownership**.
- Funciona via **proxy** (AOP), então vale a regra da aula 01: **chamada interna na mesma classe não passa pelo proxy** e a anotação é ignorada.

Mesmo com isso, a checagem de "esse pedido é desse usuário" costuma ficar melhor **na consulta** (`findByIdAndClienteId`), pra evitar **IDOR** de forma robusta.

### 401 × 403 no Spring
O `ExceptionTranslationFilter` traduz:
- Sem autenticação → **`AuthenticationEntryPoint`** → **401**.
- Autenticado sem permissão → **`AccessDeniedHandler`** → **403**.
Dá pra customizar os dois pra devolver JSON no padrão da API (ex: `ProblemDetail`).

---

## 5. API stateless com JWT (Resource Server)

O cenário mais comum hoje: um **provedor de identidade** (Keycloak, Auth0, Cognito, Entra ID) faz o login e emite o JWT; sua API só **valida o token**. No vocabulário do OAuth2, sua API é um **Resource Server**.

```yaml
# application.yml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://auth.minhaempresa.com/realms/loja
```

Com o starter `spring-boot-starter-oauth2-resource-server` e o `.oauth2ResourceServer(o -> o.jwt(...))`:
1. O `BearerTokenAuthenticationFilter` lê o header `Authorization: Bearer ...`.
2. Baixa as **chaves públicas** do emissor (endpoint JWKS, descoberto pelo `issuer-uri`) e **valida a assinatura**, a expiração e o emissor.
3. Converte as claims em authorities (por padrão, os *scopes* viram `SCOPE_xxx`; pra ler roles de outra claim, configura-se um `JwtAuthenticationConverter`).

Por que `STATELESS` e CSRF desligado aqui?
- **Stateless**: não há sessão no servidor; cada requisição traz o token.
- **CSRF** explora o fato de o navegador mandar **cookies automaticamente**. Se a autenticação vem num header `Authorization` que o JavaScript precisa colocar de propósito, o ataque não funciona, e desligar CSRF é seguro.
- ⚠️ Se o token (ou a sessão) estiver num **cookie**, **mantenha CSRF ligado**. "Desabilitar CSRF sempre" é um erro comum.

### CORS
Se o front está em outra origem, configure CORS **no Spring Security** (`.cors(...)` com um `CorsConfigurationSource`), senão o *preflight* `OPTIONS` é barrado pela segurança antes de chegar no `@CrossOrigin` do controller.

---

## 6. Testando segurança

- `@WithMockUser(roles = "ADMIN")` simula um usuário autenticado num teste.
- Com MockMvc: `.with(jwt().authorities(...))` simula um JWT.
- Teste **também o caminho negativo**: rota sem token dá 401, usuário comum na rota de admin dá 403.

---

## 7. Como falar na entrevista

**"Como funciona o Spring Security?"**
> "Ele funciona como uma cadeia de filtros que roda antes do DispatcherServlet. O FilterChainProxy escolhe a SecurityFilterChain pela URL, e ela tem filtros de CORS, CSRF, autenticação e autorização em ordem. A autenticação passa pelo AuthenticationManager e pelos providers, e o usuário autenticado fica no SecurityContextHolder, que por padrão é um ThreadLocal. Hoje a configuração é um bean SecurityFilterChain, com regras de URL em ordem e anyRequest().authenticated() no fim, pra negar por padrão."

**"Como você protegeria uma API com JWT?"**
> "Configuro a API como resource server: o provedor de identidade emite o token e o Spring valida a assinatura com as chaves públicas do issuer, além de expiração e emissor. Deixo a sessão stateless e desligo CSRF, porque o token vai no header e não em cookie; se fosse cookie, manteria o CSRF. Regras amplas por URL, regras finas com @PreAuthorize, e a checagem de dono do recurso direto na consulta pra evitar IDOR."

---

## 8. Resumo

- Spring Security = **cadeia de filtros** antes do `DispatcherServlet` (`DelegatingFilterProxy` → `FilterChainProxy` → `SecurityFilterChain`).
- Configuração é um **bean `SecurityFilterChain`**; regras de URL **em ordem**; **negar por padrão**.
- Autenticação: `AuthenticationManager` → `AuthenticationProvider` → `UserDetailsService` + `PasswordEncoder` (BCrypt).
- Usuário fica no **`SecurityContextHolder` (ThreadLocal)**: não propaga sozinho pra `@Async`.
- `hasRole("X")` = authority `ROLE_X`; `hasAuthority("X")` = `X`.
- `@PreAuthorize` por método (proxy!); ownership de preferência na consulta.
- 401 = `AuthenticationEntryPoint`; 403 = `AccessDeniedHandler`.
- JWT: **resource server** com `issuer-uri`; stateless; **CSRF off só se não houver cookie**.
- CORS configurado **no Security**.

## Termos desta aula
Spring Security · filtro · Servlet · DelegatingFilterProxy · FilterChainProxy · SecurityFilterChain · Chain of Responsibility · deny by default · Authentication · principal · authority · role · SecurityContextHolder · ThreadLocal · AuthenticationManager · AuthenticationProvider · UserDetailsService · PasswordEncoder · BCrypt · DelegatingPasswordEncoder · authorizeHttpRequests · @EnableMethodSecurity · @PreAuthorize · SpEL · IDOR · AuthenticationEntryPoint · AccessDeniedHandler · resource server · issuer-uri · JWKS · stateless · CSRF · CORS · @WithMockUser

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 03** e separadas por nível.
