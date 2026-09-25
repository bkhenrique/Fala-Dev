# Aula 05 — Banco de dados relacional: modelagem, ACID, transações, isolamento e índices

> **Objetivo:** entender o modelo relacional, normalização, ACID, níveis de isolamento e suas anomalias, locks otimista e pessimista, e como índices funcionam.

---

## 1. O modelo relacional

Dados organizados em **tabelas** (relações), com **linhas** (registros) e **colunas** (atributos).

- **Chave primária (PK)**: identifica unicamente cada linha.
- **Chave estrangeira (FK)**: coluna que referencia a PK de outra tabela, garantindo **integridade referencial** (não existe pedido de cliente inexistente).
- **Relacionamentos**: 1:1, 1:N (cliente tem muitos pedidos), N:N (pedido ↔ produto, via **tabela associativa** `itens_pedido`).
- **Constraints**: `NOT NULL`, `UNIQUE`, `CHECK`, `FOREIGN KEY`. O banco **protege** a consistência mesmo se a aplicação tiver bug.

**SQL** é a linguagem: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN` (inner, left, right), `GROUP BY`, `HAVING`, subqueries, **CTEs** (`WITH`), **window functions** (`ROW_NUMBER() OVER (...)`).

Exemplos: **PostgreSQL**, MySQL, SQL Server, Oracle.

---

## 2. Normalização

**Normalizar** = organizar os dados para **evitar redundância** e anomalias de atualização (mudar o endereço do cliente em 500 linhas de pedido).

- **1FN**: valores **atômicos** (nada de lista numa coluna), sem grupos repetidos.
- **2FN**: 1FN + todo atributo depende da chave **inteira** (importa em chaves compostas).
- **3FN**: 2FN + nenhum atributo depende de **outro atributo não-chave** (ex: `cidade` dependendo de `cep`).

Resumo informal: **"cada fato guardado em um lugar só"**.

### Desnormalização
Às vezes, **de propósito**, duplica-se dado para **ler mais rápido** (evitar joins caros): guardar `total` no pedido em vez de somar os itens toda vez, ou o nome do produto no item (histórico do preço/nome na época da compra). Trade-off: **leitura rápida × consistência e complexidade na escrita**. Comum em relatórios e sistemas de leitura intensa.

---

## 3. ACID

As garantias de uma **transação** em bancos relacionais:

| Letra | Propriedade | Significado |
|---|---|---|
| **A** | **Atomicidade** | Tudo ou nada. Se uma parte falha, tudo é desfeito (**rollback**) |
| **C** | **Consistência** | A transação leva o banco de um estado válido para outro válido (constraints respeitadas) |
| **I** | **Isolamento** | Transações simultâneas não interferem umas nas outras (em graus configuráveis) |
| **D** | **Durabilidade** | Depois do **commit**, o dado não se perde, nem se o servidor cair (graças ao log em disco, o WAL) |

Exemplo clássico: transferência bancária. Debitar de A e creditar em B **na mesma transação**: nunca pode acontecer só metade.

```sql
BEGIN;
UPDATE contas SET saldo = saldo - 100 WHERE id = 'A';
UPDATE contas SET saldo = saldo + 100 WHERE id = 'B';
COMMIT;   -- ou ROLLBACK se algo falhar
```

---

## 4. Níveis de isolamento e anomalias

Isolamento total é caro (tudo em fila). Por isso existem **níveis**, cada um permitindo certas **anomalias**:

### As anomalias
- **Dirty read**: ler dado de outra transação **ainda não commitada** (que pode sofrer rollback).
- **Non-repeatable read**: ler a mesma linha duas vezes na mesma transação e obter **valores diferentes** (outra transação alterou e commitou no meio).
- **Phantom read**: repetir a mesma consulta e aparecerem/sumirem **linhas** (outra transação inseriu/removeu).
- **Lost update**: duas transações leem o mesmo valor, cada uma altera e grava; **uma sobrescreve a outra**.

### Os níveis (SQL padrão)

| Nível | Dirty read | Non-repeatable | Phantom |
|---|---|---|---|
| **Read Uncommitted** | possível | possível | possível |
| **Read Committed** | ✅ evita | possível | possível |
| **Repeatable Read** | ✅ | ✅ evita | possível (no padrão) |
| **Serializable** | ✅ | ✅ | ✅ evita tudo |

- **Postgres** usa **Read Committed** por padrão; **MySQL (InnoDB)**, **Repeatable Read**.
- Mais isolamento = mais correção, **menos concorrência** (mais locks, mais transações abortadas para tentar de novo).

---

## 5. Controle de concorrência: lock pessimista vs otimista

Cenário: dois usuários compram o **último** item do estoque ao mesmo tempo.

### Pessimista: "trava antes"
```sql
BEGIN;
SELECT estoque FROM produtos WHERE id = 1 FOR UPDATE;   -- trava a linha
-- outra transação que tentar o mesmo FOR UPDATE espera
UPDATE produtos SET estoque = estoque - 1 WHERE id = 1;
COMMIT;
```
- ✅ Garantido. ❌ Espera, risco de **deadlock**, menos throughput.
- Bom quando **conflito é frequente**.

### Otimista: "confere na hora de gravar"
Uma coluna **`version`**:
```sql
UPDATE produtos SET estoque = 4, version = 8
WHERE id = 1 AND version = 7;          -- se ninguém mudou, afeta 1 linha
-- se afetou 0 linhas: alguém alterou antes → recarregar e tentar de novo (ou 409 Conflict)
```
- ✅ Sem travas, alto throughput. ❌ Precisa tratar o conflito (retry).
- Bom quando **conflito é raro**. JPA tem `@Version`.

Alternativa simples para contadores: **update atômico condicional**:
```sql
UPDATE produtos SET estoque = estoque - 1 WHERE id = 1 AND estoque > 0;
```

---

## 6. Índices

Sem índice, para achar uma linha o banco faz **full table scan** (*seq scan*): lê a tabela inteira. Com milhões de linhas, é lento.

**Índice** é uma estrutura auxiliar (quase sempre uma **B-Tree**, árvore balanceada) que permite achar linhas em **O(log n)**.

> Analogia: o **índice remissivo** no fim do livro.

```sql
CREATE INDEX idx_pedidos_cliente_status ON pedidos (cliente_id, status);
```

### Pontos importantes
- **Custo**: índices ocupam espaço e deixam **INSERT/UPDATE/DELETE mais lentos** (cada índice precisa ser atualizado). Não indexe tudo.
- **Índice composto** e a regra do **prefixo mais à esquerda**: o índice `(cliente_id, status)` serve para filtros por `cliente_id` e por `cliente_id + status`, mas **não** só por `status`.
- **Seletividade**: índice em coluna com poucos valores distintos (ex: `ativo` true/false) geralmente ajuda pouco.
- **Covering index**: o índice contém todas as colunas da consulta, e o banco nem vai na tabela (*index-only scan*).
- **Índice parcial** (Postgres): `WHERE status = 'pendente'`.
- Funções na coluna "quebram" o índice: `WHERE LOWER(email) = ...` precisa de índice em `LOWER(email)`.
- `LIKE 'abc%'` usa índice; `LIKE '%abc'` não.
- Tipos: B-Tree (padrão, igualdade e faixa), **Hash**, **GIN** (arrays, JSONB, busca textual), **GiST**, e índices vetoriais (**pgvector**, para embeddings).

### Como investigar uma query lenta
1. **`EXPLAIN ANALYZE`** mostra o **plano de execução** real: seq scan vs index scan, tipo de join, linhas estimadas vs reais, tempo de cada etapa.
2. Procurar: *seq scan* em tabela grande, estimativa muito errada (estatísticas desatualizadas → `ANALYZE`), sort em disco, **N+1** vindo da aplicação.
3. **`pg_stat_statements`**: ranking das queries que mais consomem tempo no total.
4. Corrigir (índice certo, reescrever query, buscar menos colunas, paginação por cursor) e **medir de novo**.

---

## 7. Como falar na entrevista

**"Como você investigaria uma query lenta no Postgres?"**
> "Primeiro acho as queries que mais pesam com pg_stat_statements. Na suspeita, rodo EXPLAIN ANALYZE pra ver o plano real: se tem seq scan em tabela grande, se a estimativa de linhas bate com o real, se tem sort em disco. As soluções mais comuns são um índice adequado, geralmente composto respeitando o prefixo mais à esquerda, reescrever a query, trazer só as colunas necessárias, paginar por cursor e atualizar estatísticas. E lembro que índice tem custo na escrita, então não saio indexando tudo."

**"O que é ACID?"**
> "Atomicidade, tudo ou nada; consistência, sempre de um estado válido pra outro; isolamento, transações concorrentes não se atrapalham, em níveis configuráveis; e durabilidade, depois do commit o dado não se perde."

---

## 8. Resumo

- Tabelas, **PK**, **FK**, constraints, JOINs; SQL.
- **Normalização** (1FN, 2FN, 3FN: cada fato em um lugar) × **desnormalização** (leitura rápida).
- **ACID**: atomicidade, consistência, isolamento, durabilidade.
- Anomalias: **dirty read, non-repeatable read, phantom, lost update**.
- Níveis: Read Uncommitted < **Read Committed** (padrão Postgres) < Repeatable Read < Serializable.
- **Lock pessimista** (`FOR UPDATE`) × **otimista** (`version`).
- **Índice B-Tree**: leitura O(log n), custo na escrita; composto (prefixo à esquerda), covering, parcial.
- **`EXPLAIN ANALYZE`** + `pg_stat_statements`.

## Termos desta aula
modelo relacional · tabela · chave primária · chave estrangeira · integridade referencial · constraint · JOIN · CTE · window function · normalização · 1FN · 2FN · 3FN · desnormalização · transação · commit · rollback · ACID · atomicidade · consistência · isolamento · durabilidade · WAL · dirty read · non-repeatable read · phantom read · lost update · Read Committed · Repeatable Read · Serializable · lock pessimista · SELECT FOR UPDATE · lock otimista · version · deadlock · índice · B-Tree · full table scan · índice composto · prefixo mais à esquerda · seletividade · covering index · índice parcial · GIN · pgvector · EXPLAIN ANALYZE · plano de execução · pg_stat_statements

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 05** e separadas por nível.
