# Aula 09 — Acesso a banco de dados com PDO

> **Objetivo:** explicar a função do PDO, consultas parametrizadas e transações, sem confundir a API de acesso ao banco com um ORM.

---

## 1. PDO: uma API para drivers

**PDO** é uma interface orientada a objetos para acessar diferentes bancos através de drivers. A aplicação cria uma conexão, prepara uma instrução, envia parâmetros e lê o resultado. O driver específico continua influenciando recursos e diferenças de SQL.

PDO não é banco de dados, pool de conexões distribuído nem ORM. Não transforma automaticamente consultas SQL de um fornecedor em SQL portável para outro. Ele oferece uma interface comum e uma camada conveniente para preparar e executar comandos.

## 2. Conexão e configuração de erro

Configure DSN, usuário e senha fora do código versionado. Defina explicitamente `PDO::ATTR_ERRMODE` como `PDO::ERRMODE_EXCEPTION` para que falhas apareçam como exceções tratáveis. A codificação deve usar UTF-8, por exemplo `charset=utf8mb4` em MySQL.

Não crie conexão nova dentro de cada pequeno método sem considerar custo e ciclo de vida. Em FPM, conexão persistente pode reduzir abertura em alguns cenários, mas pode reter sessão ou estado do servidor e não é um pool universal. Meça antes de habilitar.

## 3. Preparar e executar

Uma instrução preparada mantém separado o SQL e os valores. Bind posicional (`?`) ou nomeado (`:id`) evita inserir conteúdo do usuário diretamente na consulta.

```php
$sql = 'SELECT id, status FROM pedidos WHERE cliente_id = :cliente';
$stmt = $pdo->prepare($sql);
$stmt->execute(['cliente' => $clienteId]);
$pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);
```

Prepared statement protege valores, mas não pode substituir identificadores SQL de forma genérica. Para coluna de ordenação escolhida na interface, converta a opção numa coluna permitida escrita no código.

## 4. Resultado, fetch e limites

Escolha `fetch()` para uma linha e `fetchAll()` para conjuntos pequenos ou limitados. Buscar milhões de linhas de uma vez consome memória, mesmo que o banco tenha processado o SQL com eficiência. Paginação e processamento incremental podem ser necessários.

Defina o formato de fetch de modo consistente (`PDO::FETCH_ASSOC`, por exemplo). Não misture a linha do banco diretamente com o contrato HTTP: transforme o resultado em DTO ou estrutura de resposta controlada.

## 5. Transações e atomicidade

Uma transação agrupa mudanças que precisam ser confirmadas ou revertidas juntas. PDO oferece `beginTransaction()`, `commit()` e `rollBack()`. Envolva a unidade de trabalho em `try/catch/finally` ou numa abstração que sempre encerre a transação corretamente.

```php
$pdo->beginTransaction();
try {
    debitar($pdo, $origem, $valor);
    creditar($pdo, $destino, $valor);
    $pdo->commit();
} catch (Throwable $erro) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    throw $erro;
}
```

Atomicidade é uma das propriedades ACID. Isolamento, locks e conflitos dependem do banco e nível escolhido. Mantenha a transação curta e não faça chamada HTTP ou envio de e-mail dentro dela: esses sistemas não participam do mesmo commit.

## 6. Concorrência e consistência

Duas requisições podem ler o mesmo saldo e ambas tentar atualizá-lo. A aplicação precisa definir como evitar sobrescrita perdida: atualização condicional atômica, lock apropriado ou controle otimista com versão. Um `SELECT` seguido de `UPDATE` sem proteção não garante exclusividade.

A restrição única do banco é a última defesa contra duplicatas mesmo se duas requisições correrem juntas. Trate violação da constraint como resultado de domínio adequado; não dependa só de um `SELECT` prévio.

## 7. SQL explícito e camadas

PDO permite SQL explícito, ótimo para relatórios e consultas cujo formato importa. Separe a consulta de regra de negócio conforme a complexidade, e evite abstração genérica de repositório que apenas repita cada chamada do PDO sem oferecer significado.

Um ORM pode acelerar operações comuns e mapear relações, mas não elimina a necessidade de entender SQL, índices, plano de consulta, transação e bloqueio. PDO é uma escolha de nível mais direto, não uma promessa de performance por si só.

## 8. Como falar na entrevista

**“Como impediria SQL injection usando PDO?”**

> “Usaria prepared statements e passaria valores pelo execute, sem concatenar entrada no SQL. Para nomes de coluna ou direção de ordenação, que não podem ser parâmetros, escolheria de uma allowlist. Também limitaria resultados, usaria transações curtas e deixaria o banco impor constraints de integridade.”

## 9. Resumo

- PDO oferece uma API comum sobre drivers; não é ORM nem pool global.
- Prepare e passe valores; identificadores dinâmicos devem vir de allowlist.
- Escolha fetch e paginação para limitar memória.
- Transação agrupa alterações do banco; serviços externos exigem coordenação separada.
- Concorrência precisa de constraints, locks ou atualizações condicionais.

## Termos desta aula
PDO · DSN · driver · prepared statement · fetch mode · transação · ACID · isolamento · lock · optimistic locking · constraint

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 09** e separadas por nível.

### Para aprofundar
[PDO no manual do PHP](https://www.php.net/manual/en/book.pdo.php) · [Transações PDO](https://www.php.net/manual/en/pdo.transactions.php)
