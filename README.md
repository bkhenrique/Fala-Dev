# FalaDev

**Aprenda a *falar* o que você já sabe fazer.**

Muita gente programa bem, mas trava na entrevista na hora de explicar o que faz: não lembra o nome das coisas, não sabe o porquê de uma decisão, não consegue comparar duas soluções. O FalaDev é um site aberto de **teoria de desenvolvimento** feito pra resolver isso: aulas, glossário e perguntas de entrevista com resposta, tudo em Markdown.

Sem cadastro, sem login, sem banco. Você abre, escolhe a trilha e estuda.

---

## O que tem aqui

| Trilha | Tipo | Aulas | Perguntas |
|---|---|---|---|
| [Fundamentos](conteudo/fundamentos/) | Fundamentos | 17 | 75 |
| [Node.js](conteudo/node/) | Runtime | 14 | 60 |
| [React](conteudo/react/) | Biblioteca | 10 | 51 |
| [NestJS](conteudo/nestjs/) | Framework | 11 | 55 |
| [Next.js](conteudo/nextjs/) | Framework | 10 | 50 |
| [JavaScript](conteudo/javascript/) | Linguagem | 10 | 50 |
| [Java](conteudo/java/) | Linguagem | 10 | 50 |
| [Spring](conteudo/spring/) | Framework | 7 | 47 |
| [PHP](conteudo/php/) | Linguagem | 10 | 50 |
| [Laravel](conteudo/laravel/) | Framework | 10 | 50 |

Os tipos classificam a tecnologia: **linguagem** define sintaxe e semântica; **runtime** a executa e fornece APIs; **biblioteca** oferece funcionalidades reutilizáveis; **framework** organiza a aplicação e seu fluxo. **Fundamentos** reúne conceitos que atravessam stacks.

Além disso, o [dicionário do dia a dia](conteudo/dicionario-do-dia-a-dia.md) traduz o jeito que a gente fala ("joguei pra rodar em segundo plano") pro termo técnico ("processamento assíncrono com fila").

Cada trilha tem:

- **Aulas**: teoria do zero, com o problema que o assunto resolve, a explicação, uma resposta modelo pra entrevista, resumo e os termos da aula.
- **Perguntas** em três níveis (*O que é?*, *Por quê?*, *Como você faria?*), com a resposta escondida pra você tentar antes.
- **Glossário** pra revisar rápido antes de uma entrevista.

## Como estudar

1. Leia uma aula por vez.
2. Feche e **explique em voz alta**. Se travar, releia só o trecho.
3. Responda as perguntas da aula antes de abrir as respostas.
4. Marque a aula como concluída na trilha.

Pra responder qualquer pergunta, use a ordem **definição → pra que serve → exemplo real → trade-off**. Falar do trade-off é o que mais mostra senioridade.

---

## Rodando o site localmente

O site é feito em Next.js e lê os arquivos de `conteudo/` na hora do build.

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

O build (`pnpm build`) gera um site 100% estático na pasta `out/`. Os links do GitHub apontam para [bkhenrique/Fala-Dev](https://github.com/bkhenrique/Fala-Dev); num fork, defina `FALADEV_REPO=seu-usuario/seu-repo` (na Vercel isso é automático).

## Estrutura

```
conteudo/        ← todo o conteúdo em .md (cada pasta é uma trilha)
_modelos/        ← modelos pra quem for contribuir
app/             ← páginas do site
```

## Quer contribuir?

Correções, explicações melhores, aulas e trilhas novas (PHP, Laravel, Python…) são muito bem-vindas. Leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir um PR.

## Licença

- **Código** do site: [MIT](LICENSE).
- **Conteúdo** (`conteudo/`): [CC BY 4.0](LICENSE-CONTEUDO.md). Pode usar e adaptar, dando o crédito.

Criado por [@bkhenrique](https://github.com/bkhenrique).
