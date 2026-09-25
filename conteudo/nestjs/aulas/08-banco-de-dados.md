# Aula 08 — Banco de dados no Nest: ORM, Repository, Transações e Migrations

> **Objetivo:** entender o que é um ORM, as diferenças entre TypeORM e Prisma, o padrão Repository, como fazer transações e por que usar migrations.

---

## 1. ORM: o que é e por que existe

**ORM (Object-Relational Mapping)** é uma camada que **mapeia tabelas do banco para objetos/classes** do código, pra você trabalhar com objetos em vez de escrever SQL na mão.

```ts
// sem ORM
const { rows } = await db.query('SELECT * FROM pedidos WHERE usuario_id = $1', [id]);

// com ORM
const pedidos = await pedidoRepo.find({ where: { usuarioId: id } });
```

Vantagens:
- Produtividade, tipagem, menos SQL repetitivo.
- **Proteção contra SQL injection** (queries parametrizadas por padrão).
- Migrations, relacionamentos, abstração do banco.

Custos:
- **Abstração que vaza** (*leaky abstraction*): você ainda precisa entender o SQL gerado.
- Fácil gerar queries ruins sem perceber (**N+1**, `SELECT *` gigante).
- Queries complexas às vezes ficam piores que SQL puro.

Espectro de opções:
- **SQL puro / driver** (`pg`): controle total.
- **Query builder** (Knex, Kysely, Drizzle): monta SQL com código, tipado.
- **ORM** (TypeORM, Prisma, MikroORM, Sequelize).

---

## 2. TypeORM vs Prisma

| | TypeORM | Prisma |
|---|---|---|
| Modelo | **Classes com decorators** (`@Entity`, `@Column`) | Arquivo **`schema.prisma`** próprio |
| Tipagem | Via classes | **Client gerado**, tipos muito precisos (inclusive de `select`) |
| Padrões | Active Record **ou** Data Mapper/Repository | Client único (`prisma.pedido.findMany`) |
| Integração Nest | Oficial (`@nestjs/typeorm`) | Um `PrismaService` simples |
| Migrations | Geradas a partir das entidades | `prisma migrate`, a partir do schema |

TypeORM no Nest:
```ts
@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn() id: number;
  @Column() total: number;
  @ManyToOne(() => Usuario, u => u.pedidos) usuario: Usuario;
}

// no módulo
imports: [TypeOrmModule.forFeature([Pedido])]

// no service
constructor(@InjectRepository(Pedido) private repo: Repository<Pedido>) {}
```

Prisma no Nest:
```ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() { await this.$connect(); }
}
```

---

## 3. Padrão Repository

**Repository** é uma camada que **encapsula o acesso a dados**: o service pede "me dá os pedidos do usuário", sem saber se vem de Postgres, Mongo, cache ou API.

```ts
export abstract class PedidosRepository {
  abstract buscarPorUsuario(usuarioId: number): Promise<Pedido[]>;
  abstract salvar(pedido: Pedido): Promise<void>;
}

@Injectable()
export class PrismaPedidosRepository implements PedidosRepository {
  constructor(private prisma: PrismaService) {}
  buscarPorUsuario(usuarioId: number) {
    return this.prisma.pedido.findMany({ where: { usuarioId } });
  }
  // ...
}

// módulo
providers: [{ provide: PedidosRepository, useClass: PrismaPedidosRepository }]
```

Ganhos:
- Service **não depende do ORM** (DIP, aula 04).
- Teste unitário do service com um repositório **fake em memória**.
- Queries concentradas num lugar.

Trade-off: mais uma camada. Em projetos simples, usar o repository do TypeORM ou o Prisma direto no service é aceitável. **Saber justificar** a escolha é o que conta.

### Active Record vs Data Mapper
- **Active Record**: a própria entidade sabe se salvar (`pedido.save()`). Simples, mas mistura domínio e persistência.
- **Data Mapper**: entidade é só dados/comportamento; um repositório/mapper cuida da persistência. Melhor separação. É o padrão recomendado no Nest.

---

## 4. Transações

**Transação** = um conjunto de operações que acontece **inteiro ou não acontece** (atomicidade, o "A" do **ACID**).

Exemplo: criar pedido + baixar estoque + registrar pagamento. Se o pagamento falhar, pedido e estoque **não podem** ficar gravados.

TypeORM:
```ts
await this.dataSource.transaction(async (manager) => {
  const pedido = await manager.save(Pedido, dados);
  await manager.decrement(Produto, { id: dados.produtoId }, 'estoque', 1);
});
```

Prisma:
```ts
await this.prisma.$transaction(async (tx) => {
  const pedido = await tx.pedido.create({ data });
  await tx.produto.update({ where: { id }, data: { estoque: { decrement: 1 } } });
});
```

Pontos de atenção:
- Tudo dentro da transação tem que usar o **mesmo** `manager`/`tx`. Usar o repositório "normal" lá dentro roda **fora** da transação.
- **Não** faça chamada HTTP externa dentro de transação: segura conexão e locks do banco enquanto espera a rede.
- Pra propagar a transação entre vários services sem passar `tx` em todo lugar, existem libs baseadas em `AsyncLocalStorage` (ex: `@nestjs-cls/transactional`).

---

## 5. Migrations

**Migration** = arquivo versionado que descreve uma **mudança no schema** do banco (criar tabela, adicionar coluna, índice).

Por quê:
- Schema **versionado junto com o código** (no git).
- Todo ambiente (dev, staging, prod) evolui igual e de forma **reproduzível**.
- Dá pra revisar a mudança em PR.

**Nunca** use `synchronize: true` (TypeORM) em produção: ele altera o banco automaticamente a partir das entidades e pode **apagar colunas e dados**.

Cuidados em produção: migrations que travam tabela grande (ex: adicionar coluna com default em bancos antigos, criar índice sem `CONCURRENTLY` no Postgres), e compatibilidade com a versão anterior do código durante o deploy (**expand and contract**: adiciona o novo, migra, só depois remove o antigo).

---

## 6. Problemas comuns de performance

- **N+1**: listar 100 pedidos e fazer 1 query por pedido pra buscar o usuário. Resolver com `relations`/`include`/join, ou em lote.
- Buscar colunas demais: use `select`.
- Falta de **índice** nas colunas de filtro/join.
- **Paginação** com `OFFSET` grande é lenta → paginação por **cursor**.
- **Pool de conexões** mal dimensionado.

---

## 7. Como falar na entrevista

**"Como você organizou o acesso a dados?"**
> "Usei Prisma, com um PrismaService injetável. Os services não falam direto com o ORM: dependem de um repository abstrato, registrado com useClass pra implementação Prisma. Isso deixa a regra de negócio desacoplada da persistência e permite testar com um repositório em memória. Operações que precisam ser atômicas, como criar pedido e baixar estoque, rodam numa transação, e o schema evolui com migrations versionadas; synchronize nunca em produção."

---

## 8. Resumo

- **ORM** mapeia tabela ↔ objeto; produtividade × abstração que vaza.
- **TypeORM** (decorators, repository) vs **Prisma** (schema + client gerado).
- **Repository** isola a persistência (DIP, testabilidade).
- **Active Record** vs **Data Mapper**.
- **Transação** = atomicidade; mesmo `tx` em tudo; nada de HTTP dentro.
- **Migrations** versionadas; nunca `synchronize` em produção; *expand and contract*.
- Cuidados: N+1, índices, `select`, paginação por cursor, pool.

## Termos desta aula
ORM · leaky abstraction · query builder · SQL injection · TypeORM · Prisma · entity · schema · repository pattern · Active Record · Data Mapper · transação · ACID · atomicidade · migration · synchronize · expand and contract · N+1 · índice · paginação por cursor · pool de conexões

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 08** e separadas por nível.
