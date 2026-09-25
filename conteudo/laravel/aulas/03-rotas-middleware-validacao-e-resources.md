# Aula 03 — Rotas, middleware, validação e API Resources

> **Objetivo:** explicar como Laravel encontra rotas HTTP, filtra requisições, valida dados com Form Requests e controla a representação de uma API.

---

## 1. Rota como contrato HTTP

Uma rota associa método e caminho a uma ação. Métodos HTTP comunicam intenção: GET consulta, POST cria ou inicia processamento, PUT substitui, PATCH altera parcialmente e DELETE remove. Nomes de rota permitem gerar URLs sem repetir caminhos em templates.

Grupos compartilham prefixo, namespace ou middleware. Rotas nomeadas e grupos tornam a aplicação mais consistente; registrar rotas duplicadas ou sobrepostas pode deixar a precedência menos óbvia. Rotas públicas e autenticadas devem estar separadas de forma legível.

## 2. Route model binding

**Route model binding** converte parâmetro da rota em modelo Eloquent. A resolução por chave padrão pode retornar 404 quando o modelo não existe; chave customizada pode usar slug ou outra coluna.

Binding resolve identidade, não autorização. Encontrar `/orders/123` não prova que o usuário atual pode ver o pedido. A policy ou regra de acesso ainda precisa conferir ownership e permissões.

## 3. Middleware como política transversal

Middleware fica ao redor de um request e pode inspecionar cabeçalhos, autenticação, sessão, origem ou limite de uso. Pode recusar a requisição antes do controller ou enriquecer contexto para o restante do fluxo.

Autenticação identifica quem fez o pedido; autorização decide se essa identidade pode executar a ação. Rate limiting protege capacidade; CSRF protege ações autenticadas por cookies contra submissão entre sites. Cada política tem lugar e ameaça diferentes.

## 4. Form Request para entrada validada

Um **Form Request** reúne regras de validação e autorização para um tipo de operação. O controller recebe o objeto após a validação; falhas viram resposta de erro coerente, incluindo JSON em APIs.

Validação cuida de formato, presença, intervalo e relações simples entre campos. Regras de domínio mais complexas podem pertencer a serviço ou objeto de domínio. “Valido no formulário” não substitui validação no servidor: qualquer cliente pode ignorar a interface.

```php
public function rules(): array
{
    return [
        'email' => ['required', 'email'],
        'quantity' => ['required', 'integer', 'min:1'],
    ];
}
```

Após validar, use apenas os campos validados para criar ou alterar registros. Evite passar todo o request para mass assignment.

## 5. Respostas e status

Uma API comunica resultado com status, headers e corpo. Laravel pode converter array e objetos serializáveis em JSON, mas essa conveniência não define sozinha uma API estável. Contratos devem nomear campos, paginação, erros e datas de forma consistente.

POST que cria normalmente responde 201 e pode incluir localização do recurso. Uma validação costuma retornar 422 em uma API Laravel; autenticação, autorização e ausência usam 401, 403 e 404 conforme o contrato.

## 6. API Resources

**API Resource** transforma modelo ou coleção numa representação pública. Ele evita retornar todos os atributos internos do Eloquent e oferece um ponto explícito para renomear campos, formatar relações e omitir dados.

Uma coleção paginada pode incluir links e metadados. Relações devem ser incluídas de maneira previsível, normalmente respeitando eager loading da consulta, para que a serialização não dispare N+1 queries.

Resource não é DTO de entrada nem regra de autorização. Policy decide se o acesso é permitido; Form Request valida entrada; Resource define a saída.

## 7. Cache de rotas e organização

Cache de rotas pode acelerar o registro em produção, especialmente em aplicações com muitas rotas. Closures e recursos dinâmicos podem impor restrições; o comando de cache deve fazer parte de deploy validado.

Não coloque regra de negócio relevante numa closure de rota apenas porque é curta hoje. Controllers finos, Form Requests, policies e Resources dão nomes claros às etapas e permitem testes isolados.

## 8. Como falar na entrevista

**“Como estruturaria um endpoint Laravel para criar um pedido?”**

> “A rota usa POST e middleware de autenticação e rate limit. Um Form Request autoriza a operação e valida os campos, o controller delega a criação para a camada de aplicação e a transação protege as alterações relacionadas. Uma policy decide acesso ao recurso e um API Resource define a resposta 201 sem expor colunas internas.”

## 9. Resumo

- Rota associa método HTTP a uma ação; grupos e nomes organizam o contrato.
- Model binding resolve o registro, mas não autoriza acesso a ele.
- Middleware aplica políticas transversais; autenticação, autorização, CSRF e rate limit têm funções distintas.
- Form Request valida entrada no servidor; use campos validados para gravar.
- Resource controla representação de saída sem substituir policy ou regra de domínio.

## Termos desta aula
Route · route model binding · middleware · Form Request · validação · autorização · status HTTP · API Resource · paginação · route cache

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 03** e separadas por nível.

### Para aprofundar
[Routing](https://laravel.com/framework/docs/13.x/routing) · [Validation](https://laravel.com/framework/docs/13.x/validation) · [Eloquent Resources](https://laravel.com/framework/docs/13.x/eloquent-resources)
