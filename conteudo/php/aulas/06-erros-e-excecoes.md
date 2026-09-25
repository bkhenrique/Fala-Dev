# Aula 06 — Erros, exceções e recuperação

> **Objetivo:** distinguir erros de execução de exceções de domínio e escolher onde capturar, registrar ou propagar uma falha.

---

## 1. O problema

Falhas acontecem: entrada inválida, banco indisponível, tipo inesperado ou bug. Se o sistema mistura essas causas, qualquer erro vira resposta genérica e ninguém sabe se deve tentar de novo, corrigir a entrada ou investigar o código.

## 2. Throwable, Error e Exception

No PHP, `Throwable` é a raiz das falhas que podem ser lançadas e capturadas. `Exception` cobre exceções da aplicação e bibliotecas. `Error` representa várias falhas do motor ou de programação, como `TypeError` e `ParseError` em contextos onde o código chegou a executar.

O nome “Error” não significa que nunca possa ser capturado; ambos implementam `Throwable`. Mesmo assim, não é saudável tratar todo `Error` como falha recuperável. Um `TypeError` inesperado geralmente indica bug que deve ser observado e corrigido, não escondido.

## 3. Exceção como fluxo de falha

Uma exceção interrompe o fluxo normal até encontrar um `catch` compatível. Use-a para representar uma operação que não pode cumprir seu contrato; não use exceções como retorno comum para “nenhum resultado” quando `null`, um tipo de resultado ou uma coleção vazia expressam melhor o caso.

```php
try {
    $pedido = $repositorio->buscar($id);
} catch (PedidoNaoEncontrado $erro) {
    return respostaNaoEncontrado();
}
```

Capture o tipo específico no limite onde existe uma decisão. Camadas inferiores podem lançar uma exceção de domínio; a camada HTTP traduz isso para status e payload. Capturar `Throwable` em todo método apaga o tipo da falha e frequentemente converte bug em sucesso aparente.

## 4. Propagar, traduzir e preservar causa

Uma camada deve capturar uma exceção quando consegue recuperar ou acrescentar contexto útil. Se traduz uma exceção de infraestrutura para uma exceção de domínio, preserve a causa com `previous`. Assim, a API pode mostrar uma mensagem segura enquanto os logs retêm a origem técnica.

Não exponha stack trace, SQL, caminhos locais, tokens ou dados pessoais ao cliente. Registre contexto suficiente — operação, identificador de correlação, classe e causa — sem registrar segredos.

## 5. finally e limpeza

`finally` roda após o `try` e eventual `catch`, inclusive quando há retorno ou exceção, e serve para limpeza que realmente precisa ocorrer. Em código moderno, `try/finally` também protege recursos quando não há bloco `using` aplicável.

Evite `return` em `finally`: ele pode substituir o retorno anterior ou suprimir a exceção. Para arquivos e streams, use APIs que tenham gerenciamento claro e feche recursos mesmo quando a operação falha.

## 6. Erros tradicionais e handlers

Além de exceções, o PHP emite níveis de erro como notice, warning e deprecation, controlados por `error_reporting` e pelo handler configurado. O ambiente de desenvolvimento deve mostrar problemas cedo; produção deve registrar detalhes sem exibi-los na resposta.

`set_error_handler()` permite converter determinados erros em exceções, mas não intercepta todo erro fatal nem deve ser usado para esconder avisos. Configure logging e tratamento no bootstrap da aplicação ou framework, não em cada arquivo de domínio.

## 7. Retry só para falhas transitórias

Retry pode ajudar com timeout momentâneo, indisponibilidade breve ou contenção transitória. Não resolve validação inválida, violação de regra nem bug determinístico. Repetição sem limite pode ampliar a carga de um serviço que já está sofrendo.

Ao repetir, use limite de tentativas, atraso exponencial com jitter, timeout total e idempotência. Para tarefas assíncronas, mover falhas permanentes para uma fila de mensagens mortas permite investigar sem bloquear o restante.

## 8. Como falar na entrevista

**“Você captura Throwable em todas as operações para evitar que a aplicação caia?”**

> “Não. Capturo a falha mais específica no limite em que posso tomar uma decisão: traduzir erro de domínio para HTTP, tentar uma operação idempotente com retry limitado ou adicionar contexto e propagar. Throwable é útil no limite do processo para registrar e encerrar de modo controlado, mas esconder Error transforma bugs em respostas falsas.”

## 9. Resumo

- `Throwable` é a raiz de `Exception` e `Error`; nem toda falha capturável é recuperável.
- Exceção interrompe o fluxo; capture somente onde há ação útil e prefira tipos específicos.
- Preserve a causa ao traduzir camadas e não revele detalhes internos ao cliente.
- `finally` serve para limpeza; não devolva valor por ele.
- Retry precisa ser limitado e reservado a falhas transitórias de operação segura.

## Termos desta aula
Throwable · Exception · Error · TypeError · causa anterior · error handler · warning · deprecation · retry · idempotência

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 06** e separadas por nível.

### Para aprofundar
[Erros e exceções no manual do PHP](https://www.php.net/manual/en/language.errors.php) · [Hierarquia Throwable](https://www.php.net/manual/en/class.throwable.php)
