# Aula 01 — Ciclo de vida de uma requisição Laravel

> **Objetivo:** seguir uma requisição desde o servidor até a rota e explicar onde o Laravel inicializa serviços, executa middleware e monta a resposta.

---

## 1. O problema

Laravel parece fazer muita coisa automaticamente: encontra a rota, injeta dependências, inicia sessão e transforma exceções em respostas. Sem conhecer a ordem, é difícil descobrir onde uma requisição foi alterada, rejeitada ou ficou lenta.

## 2. O ponto de entrada

Em uma instalação HTTP tradicional, o servidor encaminha requisições para `public/index.php`. Esse arquivo carrega o autoloader do Composer e cria a aplicação a partir de `bootstrap/app.php`. O container de serviços passa a ser o núcleo usado pelo framework para resolver classes e configurações.

Em seguida, a aplicação encaminha o pedido para o fluxo HTTP do framework. Versões e skeletons recentes concentram parte da configuração em `bootstrap/app.php`; a estrutura de pastas pode variar conforme a aplicação, mas as responsabilidades conceituais permanecem.

## 3. Bootstrap e providers

Antes de executar a rota, Laravel configura tratamento de erros, logging, ambiente e providers. Um **service provider** registra serviços no container e inicializa componentes do framework, como banco, rotas, validação e fila.

O método `register` deve declarar bindings e dependências. O método `boot` executa inicialização que pode depender de bindings já registrados, como listeners ou políticas. Evite fazer consultas caras ou trabalho específico de cada requisição no boot, porque isso atrasa inicialização e pode rodar em cada processo.

## 4. Middleware global e da rota

A requisição passa por uma pilha de middleware. Middleware global pode atribuir correlation id, validar manutenção ou aplicar regras comuns. Middleware de rota pode verificar autenticação, CSRF, rate limit ou outras condições antes de chamar o controller.

A ordem importa: um middleware pode ler ou alterar request, encerrar cedo com resposta, ou permitir que o próximo execute. Depois do controller, a resposta volta pela cadeia para que middleware inspecione ou ajuste o resultado.

```text
public/index.php → bootstrap → providers → middleware → router → controller
controller → resposta → middleware de volta → servidor HTTP
```

## 5. Router, controller e injeção

O router procura uma rota que corresponda ao método HTTP, caminho, domínio e restrições. Pode extrair parâmetros, resolver model binding e escolher uma closure ou controller. O container injeta argumentos tipados, como Request, Form Request e serviços.

O controller traduz o protocolo para uma chamada de aplicação e converte o resultado em resposta. Se ele concentra validação, regras de domínio, consultas e formatação, cresce como “controller gordo”; mover responsabilidades para classes apropriadas melhora teste e manutenção.

## 6. Exceções e resposta

Exceções podem surgir em qualquer ponto do fluxo. O handler central transforma erros conhecidos em status e payload; por exemplo, validação pode retornar erros de formulário ou JSON, conforme o tipo de requisição. O ambiente local pode mostrar detalhes; produção deve registrar o erro sem exibir stack trace ao cliente.

Nem toda resposta precisa ser criada manualmente: string, view, array serializável ou objeto Response são normalizados pelo framework. Defina o contrato HTTP da aplicação para não variar formatos acidentalmente entre endpoints.

## 7. Response e envio

Depois de a rota retornar, o Laravel prepara headers, cookies, sessão e corpo. O servidor web envia a resposta ao cliente. A execução do script termina no ciclo tradicional; sessões, cache e dados persistentes estão nos armazenamentos configurados, não numa variável global que o navegador possa acessar diretamente.

Uma resposta 200 também pode esconder uma falha semântica. Use status corretos, como 201 para recurso criado, 204 para sem corpo, 4xx para erro do cliente e 5xx para falha do servidor.

## 8. Como falar na entrevista

**“O que acontece entre public/index.php e o controller?”**

> “O entry point carrega o autoloader e a aplicação. Laravel registra e inicializa providers, prepara o fluxo HTTP e passa a requisição pelos middleware até o router resolver a rota. O container injeta dependências no controller; a resposta retorna pela cadeia de middleware e o servidor a envia. Exceções são traduzidas centralmente e detalhes internos ficam nos logs.”

## 9. Resumo

- `public/index.php` carrega Composer e cria a aplicação configurada em `bootstrap/app.php`.
- Providers registram e inicializam serviços; `register` e `boot` têm propósitos distintos.
- Middleware forma uma cadeia de entrada e saída antes e depois da rota.
- Router combina requisição com rota e container resolve argumentos tipados.
- Exceção, status, sessão e serialização pertencem ao ciclo completo, não só ao controller.

## Termos desta aula
Entry point · bootstrap · service provider · container · middleware · router · route model binding · controller · response · exception handler

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 01** e separadas por nível.

### Para aprofundar
[Ciclo de vida oficial do Laravel 13](https://laravel.com/framework/docs/lifecycle)
