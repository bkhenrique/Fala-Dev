# Aula 05 — Migrations, factories e transações

> **Objetivo:** explicar como evoluir o esquema de banco com segurança e como migrations, seeders, factories e transações se encaixam no ciclo de desenvolvimento.

---

## 1. Esquema como código

Uma migration registra uma mudança de esquema versionada junto com o código. Assim, equipe e CI conseguem recriar a estrutura do banco na ordem esperada. Ela não é um backup dos dados nem um mecanismo mágico de sincronização entre ambientes.

Migrations devem ser pequenas, revisáveis e consistentes com a versão da aplicação. A migration de rollback (`down`) tenta reverter a alteração, mas apagar coluna ou dado pode ser irreversível na prática. Para mudanças grandes, planeje o caminho de ida e de volta antes do deploy.

## 2. Deploy sem incompatibilidade

Um deploy pode ter instâncias antigas e novas executando ao mesmo tempo. Uma migration destrutiva imediata pode quebrar uma instância que ainda espera o formato antigo.

O padrão **expand and contract** divide a mudança: primeiro adiciona coluna ou estrutura compatível; o código passa a ler e escrever o formato novo; os dados são migrados; por último, uma versão posterior remove o formato antigo. Isso torna rolling deploy mais seguro.

## 3. Factories e seeders

Uma factory define como gerar modelos de teste com dados plausíveis. Estados da factory criam variantes, como usuário verificado ou pedido cancelado. Seeder preenche dados de referência ou ambiente local; dados de teste não devem depender de serviços de produção.

Factories reduzem repetição e deixam cenários expressivos. Não use dados aleatórios sem seed ou assertions específicas quando a aleatoriedade tornar o teste instável.

## 4. Transação no Laravel

`DB::transaction()` executa uma closure numa transação e confirma quando termina normalmente; uma exceção provoca rollback. Pode haver tentativas adicionais configuradas para deadlocks, então o corpo da closure não deve executar efeitos externos não idempotentes.

```php
DB::transaction(function () use ($pedido, $estoque) {
    $pedido->confirmar();
    $estoque->reservar($pedido->itens);
});
```

Transação garante atomicidade apenas para operações participantes do mesmo banco e conexão. Enviar um e-mail, chamar um gateway de pagamento ou publicar em broker não desfaz automaticamente se o banco fizer rollback.

## 5. Locks e concorrência

Para uma reserva de estoque, duas requisições podem ler a mesma quantidade disponível ao mesmo tempo. Uma transação pode bloquear a linha (`lockForUpdate`) enquanto atualiza, ou usar uma operação condicional atômica. Escolha a estratégia pelo banco e carga, e mantenha o lock curto.

Restrição única e foreign key são invariantes que o banco consegue impor mesmo diante de concorrência. Checar duplicata só em PHP antes de inserir tem uma janela de corrida.

## 6. Jobs e commit

Um job despachado antes de a transação confirmar pode começar antes de os dados estarem visíveis. O recurso de dispatch after commit ou evento equivalente só libera o job após commit. Isso resolve a ordem no processo comum, mas não transforma banco e broker num commit distribuído atômico.

Se perder um evento entre commit e publicação for inaceitável, avalie outbox transacional: grave uma mensagem na mesma transação e publique por um processo separado, com idempotência.

## 7. Quando uma migration não basta

Alterar uma coluna com milhões de linhas pode bloquear ou demorar. Estratégias dependem do motor, versão e operação: adicionar nullable primeiro, backfill em lotes, observar índices e separar validação de constraint. Teste com tamanho e comportamento semelhantes ao real.

Cuidado com seeders em produção. Eles podem inserir dados idempotentes de referência, mas não devem sobrescrever alterações de clientes ou criar contas privilegiadas com credenciais padrão.

## 8. Como falar na entrevista

**“Como mudaria o esquema de uma tabela grande sem derrubar a aplicação?”**

> “Eu usaria uma mudança expand-and-contract: adicionaria a nova estrutura mantendo compatibilidade, faria backfill em lotes, publicaria código que lê e escreve corretamente e removeria a coluna antiga só depois de todas as instâncias migrarem. Colocaria migrations sob revisão, mediria bloqueios e prepararia rollback. Efeitos externos seriam despachados após commit ou via outbox se a entrega precisar ser garantida.”

## 9. Resumo

- Migration registra mudança versionada do esquema, não é backup de dados.
- Deploy gradual precisa manter compatibilidade entre versões antigas e novas.
- Factories criam cenários; seeders devem ser intencionais e idempotentes.
- `DB::transaction()` agrupa operações do banco; serviço externo não faz parte do mesmo commit.
- Locks, constraints e outbox tratam problemas diferentes de concorrência e dual write.

## Termos desta aula
Migration · rollback · seeder · factory · transação · deadlock · lockForUpdate · expand and contract · after commit · transactional outbox

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 05** e separadas por nível.

### Para aprofundar
[Database migrations](https://laravel.com/framework/docs/13.x/migrations) · [Database transactions](https://laravel.com/framework/docs/13.x/database#database-transactions)
