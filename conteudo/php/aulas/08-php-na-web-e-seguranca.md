# Aula 08 — PHP na Web: requisição e segurança

> **Objetivo:** entender a fronteira entre HTTP e PHP e identificar controles básicos para proteger formulários, sessões, saída HTML e credenciais.

---

## 1. O problema

Um script web recebe dados controlados pelo cliente e produz uma resposta. Mesmo que a interface esconda campos, alguém pode enviar qualquer requisição. A segurança começa tratando entrada como não confiável e decidindo explicitamente o que pode entrar, persistir e sair.

## 2. Da requisição às superglobais

A SAPI disponibiliza dados de requisição em estruturas como `$_GET`, `$_POST`, `$_COOKIE`, `$_FILES` e `$_SERVER`. Elas são pontos de entrada, não objetos já validados. Cabeçalhos, query string e corpo têm formatos diferentes; parsear um valor não prova que ele é autorizado.

Prefira um framework ou objeto Request para organizar acesso, mas mantenha clara a origem externa. Valide estrutura, tipo, tamanho e formato; depois aplique regras de negócio e autorização no servidor.

## 3. SQL injection: parâmetros, não concatenação

Nunca monte SQL concatenando valores de usuário. **Prepared statements** separam o texto SQL dos valores e deixam o driver enviar os parâmetros com tipo apropriado.

```php
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();
```

Parâmetros protegem valores, não nomes de tabela, coluna ou fragmentos de ordenação. Para elementos dinâmicos de SQL que não podem ser parâmetro, escolha entre uma lista permitida no código. Validação não substitui escaping parametrizado.

## 4. XSS e saída contextual

**Cross-Site Scripting (XSS)** ocorre quando conteúdo não confiável vira código executável no navegador. Escape no momento de renderizar e conforme o contexto: texto HTML, atributo, URL e JavaScript têm regras diferentes. Em PHP, `htmlspecialchars()` com charset explícito é adequado para saída textual em HTML; não é um sanitizer universal para qualquer contexto.

Templates com autoescaping reduzem erros. Ainda assim, marque HTML como confiável apenas quando foi sanitizado por biblioteca apropriada. Não confunda “veio do meu banco” com “é seguro”: dado gravado pode ter sido fornecido por atacante.

## 5. CSRF, cookies e sessão

**Cross-Site Request Forgery (CSRF)** tenta fazer o navegador autenticado enviar uma ação que o usuário não autorizou. Um token imprevisível, validado no servidor, ajuda a distinguir o formulário legítimo. Cookies `SameSite`, `Secure` e `HttpOnly` complementam a proteção; não substituem entendimento do fluxo.

Regere o identificador da sessão após login ou mudança de privilégio para evitar fixation. Não coloque tokens de sessão em URL. Cookies de sessão devem usar HTTPS e políticas compatíveis com o cliente.

## 6. Senhas e segredos

Senhas devem ser armazenadas com função de hash adaptativa, nunca criptografadas reversivelmente nem em texto claro. `password_hash()` escolhe um algoritmo apropriado e guarda salt e parâmetros no resultado; `password_verify()` verifica a senha. Reavalie hashes antigos com `password_needs_rehash()` após mudança de política.

Segredos de aplicação vêm do ambiente de execução ou gerenciador de segredos, não do repositório. Logs também são uma saída: não escreva senha, cookie, token ou payload pessoal completo.

## 7. Uploads e limites

Upload exige checar tamanho, erro de transferência, tipo real do conteúdo e política de extensão. Não confie apenas no nome ou no `Content-Type` enviado pelo cliente. Armazene fora da raiz pública quando possível, gere nome interno e limite permissões e tempo de retenção.

A configuração PHP também define limites de corpo, memória e execução. Validar tamanho no código, no proxy e no PHP evita que um pedido enorme consuma recursos antes de chegar à regra de negócio.

## 8. Como falar na entrevista

**“Como protegeria um formulário PHP contra ataques comuns?”**

> “Validaria a entrada no servidor e autorizaria cada operação; usaria prepared statements para SQL, escape de saída conforme o contexto para XSS e token CSRF em ações autenticadas por cookie. Senhas seriam guardadas com password_hash e verificadas com password_verify. Também protegeria a sessão e os cookies, limitaria uploads e evitaria revelar detalhes internos em erros.”

## 9. Resumo

- Superglobais e conteúdo do banco são dados não confiáveis até validação e autorização.
- PDO prepared statements protegem valores SQL, mas nomes dinâmicos precisam de allowlist.
- Escape contextual reduz XSS; não existe uma única função segura para todo contexto.
- Tokens CSRF, cookies seguros e rotação de sessão protegem fluxos de autenticação por navegador.
- Hash adaptativo, upload controlado e logs sem segredos completam a defesa básica.

## Termos desta aula
SAPI · superglobal · SQL injection · prepared statement · XSS · CSRF · session fixation · SameSite · password_hash · allowlist

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 08** e separadas por nível.

### Para aprofundar
[PDO::prepare](https://www.php.net/manual/en/pdo.prepare.php) · [password_hash](https://www.php.net/manual/en/function.password-hash.php)
