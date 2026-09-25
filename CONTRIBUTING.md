# Como contribuir com o FalaDev

Contribuição é muito bem-vinda: corrigir um erro, melhorar uma explicação, criar uma aula ou uma trilha nova.

Este guia tem tudo o que você precisa pra seu PR entrar sem idas e vindas. O resumo:

1. Copie o modelo certo de [`_modelos/`](_modelos/).
2. Escreva seguindo o [guia de estilo](#4-guia-de-estilo).
3. Rode `pnpm validar` e corrija o que ele apontar.
4. Abra o PR e preencha o checklist.

---

## 1. Fluxo

A `main` é protegida: toda mudança entra **só por Pull Request**, e o merge é feito pelo mantenedor ([@bkhenrique](https://github.com/bkhenrique)).

1. Faça um **fork** do repositório.
2. Crie uma branch no seu fork:
   - `conteudo/node-aula-streams` para conteúdo novo;
   - `fix/typo-event-loop` para correção;
   - `feat/busca` para funcionalidade do site.
3. Faça as alterações, rode `pnpm validar` e abra um **PR para a `main`**.
4. Descreva no PR **o que** mudou e **por quê**.
5. O GitHub Actions roda a validação, o lint e o build. PR com ❌ não entra; o log diz exatamente o que corrigir.
6. Aguarde a revisão. Pode ser que eu peça ajustes antes do merge.

## 2. Rodando localmente

```bash
pnpm install
pnpm dev        # site em http://localhost:3000, atualiza ao salvar o .md
pnpm validar    # confere se o conteúdo segue o padrão
pnpm build      # gera o site estático (o mesmo que roda no deploy)
```

## 3. O que dá pra contribuir

| Contribuição | Onde | Modelo |
|---|---|---|
| **Aula nova** | `conteudo/<trilha>/aulas/NN-nome.md` + link no `README.md` da trilha | [`_modelos/aula.md`](_modelos/aula.md) |
| **Pergunta nova** | `conteudo/<trilha>/perguntas/nivel-N.md`, no **nível** certo | [`_modelos/pergunta.md`](_modelos/pergunta.md) |
| **Termo de glossário** | `conteudo/<trilha>/glossario.md` | [`_modelos/termo.md`](_modelos/termo.md) |
| **Trilha nova** (ex.: `laravel/`) | `conteudo/<nome>/` | [`_modelos/trilha/`](_modelos/trilha/) (copie a pasta inteira) |
| **Linha no dicionário** | [`conteudo/dicionario-do-dia-a-dia.md`](conteudo/dicionario-do-dia-a-dia.md) | Siga as colunas da tabela |
| **Correção ou melhoria** | Qualquer arquivo | Explique no PR o que estava errado ou confuso |

Antes de criar, veja se o assunto já existe (principalmente em `fundamentos/`).

### Aulas de referência

Na dúvida sobre tom, profundidade ou tamanho, use estas como exemplo do padrão:

- [Node · Event Loop em profundidade](conteudo/node/aulas/03-event-loop.md): conceito difícil explicado do zero, com diagrama e exercício.
- [Fundamentos · Escalabilidade e resiliência](conteudo/fundamentos/aulas/10-escalabilidade-e-resiliencia.md): muitos conceitos ligados por um fio condutor.
- [NestJS · Ciclo de vida da requisição](conteudo/nestjs/aulas/05-ciclo-de-vida-da-requisicao.md): assunto específico de framework com tabela de decisão.

---

## 4. Guia de estilo

### O que é (e o que não é) o FalaDev

O público **já programa** e quer saber **explicar** o que faz, principalmente em entrevista. Então:

- ✅ **Teoria**: o que é, por que existe, como funciona por dentro, quando usar, qual o trade-off.
- ✅ **Vocabulário**: apresentar o termo técnico e explicá-lo.
- ❌ **Tutorial passo a passo** ("instale X, crie o arquivo Y"). Código só entra curto, pra ilustrar um conceito.
- ❌ Opinião sem justificativa ("X é melhor que Y"). Compare com trade-offs.

### Tom

- **Português do Brasil**, falando com **você** (o leitor), de forma simples, como se explicasse pra um amigo.
- **Não fuja do termo técnico**: apresente, destaque em **negrito** e explique. Termo em inglês consagrado fica em inglês (*event loop*, *backpressure*), com a tradução na primeira vez.
- **Analogias** ajudam muito (o garçom do event loop, o disjuntor do circuit breaker), mas depois delas vem a explicação técnica.
- Nada de primeira pessoa pessoal ("no meu projeto eu..."). A exceção é a resposta modelo de entrevista, que é escrita como o candidato falaria.

| ❌ Evite | ✅ Prefira |
|---|---|
| "O event loop é muito importante e todo dev deveria saber." | "O **Event Loop** é o laço que executa os callbacks quando a call stack está vazia." |
| "Use Redis, é o melhor." | "Redis dá latência baixa, mas custa memória e é mais uma peça pra operar." |
| "Basta rodar `npm i bullmq` e configurar assim: ..." | "A API enfileira o job e responde **202**; um worker separado processa." |

### Informação que muda com a versão

Diga **a partir de qual versão** vale: "desde o Node 15, unhandled rejection derruba o processo", "no Next 16 o `middleware.ts` virou `proxy.ts`". Se o comportamento padrão mudou entre versões, explique isso.

### Estrutura de uma aula

Copie [`_modelos/aula.md`](_modelos/aula.md). Seções obrigatórias (o validador confere):

1. `# Aula NN — Título` (o número bate com o do arquivo).
2. `> **Objetivo:**` o que a pessoa vai saber explicar ao final.
3. As seções de conteúdo, numeradas (`## 1. O problema`, `## 2. ...`). **Comece pelo problema**: o porquê vem antes do como.
4. `## N. Como falar na entrevista`: uma ou mais perguntas típicas com resposta modelo em citação (`>`), escrita como o candidato falaria: definição, pra que serve, exemplo e trade-off, em 3 a 6 frases.
5. `## N. Resumo`: bullets curtos com o que não pode faltar.
6. `## Termos desta aula`: o vocabulário, separado por ` · `.
7. `## Treine`: a frase padrão apontando pra pasta `perguntas/`.

Tamanho: entre **100 e 250 linhas** costuma ser o ideal. **Máximo 500**; se passar, divida em duas aulas.

### Perguntas

Copie [`_modelos/pergunta.md`](_modelos/pergunta.md). As perguntas ficam em `perguntas/`, **um arquivo por nível** (`nivel-1.md`, `nivel-2.md`, `nivel-3.md`), e cada pergunta vai no nível certo:

| Nível | Tipo | Exemplo |
|---|---|---|
| **1 — O que é?** | Definição | "O que é idempotência?" |
| **2 — Por quê? Quando usar?** | Comparação, motivo, trade-off | "Fila ou pub/sub?" |
| **3 — Como você faria?** | Cenário real que junta vários conceitos | "Como investigaria uma API lenta?" |

Formato exato (o validador confere):

```markdown
**12. Pergunta aqui?**
<sub>Aula [03 — Título da aula](../aulas/03-nome-da-aula.md)</sub>
<details><summary>Ver resposta</summary>

Resposta curta: de 2 a 6 frases, na ordem definição → pra que serve → exemplo → trade-off.

</details>
```

- Dentro do arquivo, as perguntas ficam **agrupadas pela aula**, em ordem. Numeração começa em 1 e é **contínua**: ao inserir no meio, renumere as seguintes.
- Atualize a contagem na tabela do `perguntas/README.md` (o validador confere).
- A pergunta tem que ser respondível **com o que está na aula** indicada.

### Glossário

Copie [`_modelos/termo.md`](_modelos/termo.md). Todo termo tem `- **Em uma frase:**`, `- **Traduzindo:**` e `- **Como falar:**`. É material de revisão: curto, sem repetir a aula inteira.

### Onde cada assunto mora

| O assunto… | Vai em | Exemplo |
|---|---|---|
| serve pra qualquer linguagem | `fundamentos/` | Idempotência, CAP, cache-aside |
| é da linguagem | `php/`, `java/`, `node/`… | Event loop no Node, garbage collector no Java |
| só faz sentido citando o framework | `laravel/`, `nestjs/`, `spring/`… | Como o container do Nest resolve dependências |

Um conceito geral pode aparecer de novo na trilha de uma stack, mostrando **como aquela stack faz**. Nesse caso, seja breve na parte conceitual e foque no específico.

### Trilha nova

- Pasta em `conteudo/`, **nome curto, minúsculo, sem acento** (`php`, `laravel`, `spring`), **sem pasta dentro de pasta**.
- Copie [`_modelos/trilha/`](_modelos/trilha/) (README, glossário, `aulas/` e `perguntas/`) e preencha o frontmatter do `README.md`:

```md
---
titulo: Laravel
tipo: framework        # linguagem | framework | fundamentos
base: php              # opcional: trilha que é pré-requisito (nome da pasta)
ordem: 10              # posição no menu
descricao: Service container, Eloquent, filas e testes no Laravel.
---
```

O site monta o menu, os cards da home e a contagem de aulas e perguntas sozinho a partir disso.

### Arquivos e links

- Nome de arquivo em **minúsculas, com hífen, sem acento**: `filas-bullmq.md`. Aulas com prefixo de dois dígitos: `04-libuv-thread-pool.md`.
- Links entre arquivos são **relativos ao `.md`** (`../perguntas/nivel-1.md`, `aulas/03-event-loop.md`). O site converte pra rota sozinho, e o link funciona no GitHub também.
- Não copie conteúdo de cursos pagos, livros ou blogs sem permissão. Se usou uma fonte como base, cite no fim da página.

---

## 5. O que o `pnpm validar` confere

Roda na sua máquina e no CI de todo PR:

- Trilha tem `README.md` (com `titulo`, `tipo`, `ordem`, `descricao` e `base` válida), `glossario.md`, `aulas/` e `perguntas/` (índice + um arquivo por nível).
- Aulas com nome `NN-nome.md`, numeração sem buracos, título `# Aula NN — ...`, seções obrigatórias e listadas no README da trilha.
- Perguntas: título do nível, numeração contínua, linha `<sub>` apontando pra uma aula que existe, resposta dentro de `<details>` com as linhas em branco, e contagem do índice batendo com os arquivos.
- Termos do glossário com os três campos.
- Nomes de arquivo no padrão, links relativos que existem e nenhum arquivo com mais de **500 linhas** (conteúdo e código).

## 6. Regras de código (site)

- Nenhum arquivo passa de **500 linhas**. Se crescer, quebre em componentes, hooks ou helpers.
- Comentário só para explicar o **porquê**, nunca o óbvio.
- Commits no padrão **Conventional Commits**: `feat(menu): ordena aulas pelo prefixo`, `docs(node): adiciona aula sobre streams`.
- Um assunto por PR: nada de misturar aula nova com mudança no site.
- `pnpm validar`, `pnpm lint` e `pnpm build` precisam passar.
