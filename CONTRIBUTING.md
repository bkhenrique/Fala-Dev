# Como contribuir com o FalaDev

Contribuição é muito bem-vinda: corrigir um erro, melhorar uma explicação, criar uma aula ou uma trilha nova.

## 1. Fluxo

A `main` é protegida: toda mudança entra **só por Pull Request**, e o merge é feito pelo mantenedor.

1. Faça um **fork** do repositório.
2. Crie uma branch no seu fork:
   - `conteudo/node-aula-streams` para conteúdo novo;
   - `fix/typo-event-loop` para correção;
   - `feat/busca` para funcionalidade do site.
3. Faça as alterações e abra um **PR para a `main`**.
4. Descreva no PR **o que** mudou e **por quê**.
5. Aguarde a revisão. Pode ser que eu peça ajustes antes do merge.

## 2. O que dá pra contribuir

| Contribuição | Onde | Padrão |
|---|---|---|
| **Aula nova** | `conteudo/<trilha>/aulas/` | Próximo prefixo numérico (`13-nome-da-aula.md`), modelo [`_modelos/aula.md`](_modelos/aula.md) e link no `README.md` da trilha |
| **Pergunta nova** | `conteudo/<trilha>/perguntas.md`, no **nível** certo | Modelo [`_modelos/pergunta.md`](_modelos/pergunta.md): indica a aula de origem e deixa a resposta dentro de `<details>` |
| **Termo de glossário** | `conteudo/<trilha>/glossario.md` | Modelo [`_modelos/termo.md`](_modelos/termo.md): *Em uma frase*, *Traduzindo*, *Como falar* |
| **Trilha nova** (ex.: `laravel/`) | `conteudo/<nome>/` | Copie [`_modelos/trilha/`](_modelos/trilha/): `README.md` com frontmatter, `glossario.md`, `perguntas.md` e `aulas/` |
| **Correção ou melhoria** | Qualquer arquivo | Explique no PR o que estava errado ou confuso |

## 3. Organização das trilhas

Cada trilha é uma pasta em `conteudo/`, todas no mesmo nível, com o nome da tecnologia que aparece na vaga:

- **Nome curto, minúsculo, sem acento:** `php`, `laravel`, `spring`.
- **Sem pasta dentro de pasta:** `laravel/`, e não `php/laravel/`.
- Linguagem × framework é definido no frontmatter do `README.md` da trilha:

```md
---
titulo: Laravel
tipo: framework        # linguagem | framework | fundamentos
base: php              # opcional: trilha que é pré-requisito
ordem: 10              # posição no menu
descricao: Service container, Eloquent, filas e testes no Laravel.
---
```

### Onde cada assunto mora

| O assunto… | Vai em | Exemplo |
|---|---|---|
| serve pra qualquer linguagem | `fundamentos/` | O que é idempotência, CAP, cache-aside |
| é da linguagem | `php/`, `java/`, `node/`… | Event loop no Node, garbage collector no Java |
| só faz sentido citando o framework | `laravel/`, `nestjs/`, `spring/`… | Como o container do Nest resolve dependências |

Um conceito geral pode aparecer de novo na trilha de uma stack, mostrando **como aquela stack faz**. Nesse caso, seja breve na parte conceitual e foque no específico.

## 4. Regras de conteúdo

- Escrever em **português**, de forma simples, como se fosse pra um amigo, mas sem fugir do termo técnico.
- Foco em **teoria e fala de entrevista**: o que é, por que existe, como explicar. Tutorial passo a passo não entra.
- Informação que muda entre versões (ex.: cache do Next.js) deve dizer **a partir de qual versão** vale.
- Nome de arquivo em minúsculas, com hífen e sem acento: `filas-bullmq.md`.
- Nenhum arquivo passa de **500 linhas**. Se passar, divida.
- Um assunto por PR. Nada de misturar aula nova com mudança no site.
- Não copiar conteúdo de cursos pagos, livros ou blogs sem permissão. Se usar uma fonte como base, cite no fim da página.

## 5. Regras de código (site)

- Nenhum arquivo passa de **500 linhas**. Se crescer, quebre em componentes, hooks ou helpers.
- Comentário só para explicar o **porquê**, nunca o óbvio.
- Commits no padrão **Conventional Commits**: `feat(menu): ordena aulas pelo prefixo`.
- O build (`pnpm build`) precisa passar. A Vercel roda o preview no PR e mostra se quebrou.
