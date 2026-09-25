# Aula 04 — Eloquent: relações, consultas e mass assignment

> **Objetivo:** entender o Eloquent como Active Record, carregar relações com eficiência e controlar como atributos são convertidos e gravados.

---

## 1. Active Record

**Eloquent** é o ORM do Laravel e usa o padrão **Active Record**: um Model combina representação do registro com operações de persistência e consulta. `$pedido->save()` persiste o objeto; `Pedido::query()` cria uma consulta fluente.

Esse estilo reduz código repetitivo e integra bem com relações e collections. O custo é aproximar domínio e banco: modelos podem acumular regras, eventos, consultas e efeitos laterais. Modelos pequenos e consultas legíveis ajudam a manter essa conveniência controlada.

## 2. Model e tabela

Por convenção, um model `Pedido` usa a tabela `pedidos`, chave primária `id` e timestamps `created_at` e `updated_at`. Convenções podem ser substituídas quando o esquema legado pede. O model também define casts, relações, scopes e campos atribuíveis.

Não trate cada objeto Eloquent como necessariamente carregado do banco: pode ser uma instância nova, parcial ou já alterada em memória. `exists`, dirty attributes e refresh ajudam a entender seu estado.

## 3. Relacionamentos

Métodos como `belongsTo`, `hasMany`, `belongsToMany` e morph relations descrevem relações entre tabelas. Chamar `$pedido->itens()` fornece o construtor da relação para compor uma consulta; acessar `$pedido->itens` lê ou carrega a coleção relacionada.

Essa distinção importa: método é consulta; propriedade é resultado. Relações também permitem criar filhos já preenchendo a chave estrangeira. Integridade continua sendo responsabilidade do esquema, com índices e foreign keys apropriados.

## 4. Lazy loading e N+1

Com **lazy loading**, a relação só é buscada quando acessada como propriedade. Num loop de 100 pedidos e clientes, isso pode virar uma query para os pedidos mais 100 consultas de cliente: o problema **N+1**.

**Eager loading** com `with()` busca antecipadamente as relações necessárias e reduz viagens ao banco. Use `withCount()` quando só precisa de uma contagem. Em desenvolvimento, impedir lazy loading inesperado pode revelar consultas ocultas.

```php
$pedidos = Pedido::with('cliente', 'itens.produto')->get();
```

Eager loading indiscriminado também carrega dados demais. Escolha a relação baseada na resposta solicitada e verifique SQL, tamanho da coleção e plano de execução.

## 5. Casts e formatos

**Casts** convertem atributos entre representação persistida e valor PHP: datas, booleanos, JSON, enums ou tipos customizados. Isso deixa consumo consistente, mas não valida sozinho se o conteúdo de entrada é permitido.

Ajuste precisão e tipo monetário com cuidado: `float` tem representação binária aproximada e pode produzir erros em cálculos de dinheiro. Muitas aplicações guardam unidades mínimas em inteiros ou usam decimal com política explícita.

## 6. Mass assignment

Mass assignment aplica um array de atributos de uma vez, por exemplo `create($dados)`. `fillable` define campos permitidos; `guarded` define os protegidos. Sem uma política, um cliente pode tentar escrever `is_admin`, `owner_id` ou preço que deveria ser calculado pelo servidor.

Use uma lista validada e atribua campos sensíveis a partir do contexto confiável. Proteção de mass assignment reduz a superfície, mas autorização e validação seguem necessárias.

## 7. Scopes, collections e domínio

Local scopes nomeiam filtros reutilizáveis, como pedidos publicados. Query Builder compõe SQL antes de executar; Collection opera sobre resultados já carregados em memória. Uma chamada `get()` muda a fase: a partir dali, filtrar Collection não reduz o trabalho que o banco já fez.

Mantenha filtros e ordenação no banco quando a tabela é grande. Para regras com transições importantes, um método de domínio explícito pode ser mais claro que eventos mágicos acionados por qualquer `save()`.

## 8. Como falar na entrevista

**“Como investigaria um endpoint lento por causa do Eloquent?”**

> “Eu mediria as consultas e verificaria se há N+1 causado por lazy loading. Carregaria explicitamente as relações usadas com eager loading, reduziria colunas e resultados e adicionaria índices compatíveis com filtros. Também verificaria serialização e mass assignment para não buscar ou expor mais dados do que o contrato precisa.”

## 9. Resumo

- Eloquent é ORM Active Record: Model representa e persiste registros.
- Métodos de relação constroem consulta; propriedades podem disparar carregamento.
- N+1 se reduz com eager loading planejado, sem carregar relações desnecessárias.
- Cast converte representação; validação e semântica de domínio continuam explícitas.
- Mass assignment precisa de allowlist e não substitui autorização.

## Termos desta aula
Eloquent · Active Record · Model · relation · lazy loading · eager loading · N+1 · cast · mass assignment · fillable · scope · Collection

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 04** e separadas por nível.

### Para aprofundar
[Models](https://laravel.com/framework/docs/13.x/eloquent) · [Relações e eager loading](https://laravel.com/framework/docs/eloquent-relationships) · [Mass assignment](https://laravel.com/framework/docs/13.x/eloquent#mass-assignment)
