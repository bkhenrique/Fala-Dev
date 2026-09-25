# Aula 13 — Git e fluxo de trabalho em equipe

> **Objetivo:** entender como o Git funciona por dentro (commits, branches, HEAD), explicar merge × rebase, reset × revert, e conhecer os fluxos de trabalho de equipe (Git Flow, GitHub Flow, trunk-based) e boas práticas de PR e code review.

---

## 1. O problema

Todo mundo usa Git, mas pouca gente sabe explicar **o que acontece** num `rebase` ou por que um `push --force` apagou o trabalho do colega. Em entrevista, perguntas de Git medem se você trabalha bem **em equipe**: histórico limpo, conflitos resolvidos com segurança, entregas pequenas e revisáveis.

---

## 2. O modelo do Git

**Git** é um sistema de controle de versão **distribuído**: cada clone tem o **histórico completo**, e dá pra commitar, criar branch e ver o log **sem internet**. O GitHub/GitLab é só um servidor remoto onde os clones se sincronizam.

### Commit é um snapshot
Um **commit** guarda uma **foto completa** do projeto naquele momento (não só a diferença), mais: autor, data, mensagem e o **commit pai**. Cada commit é identificado por um **hash** (SHA) calculado a partir do conteúdo; mudar qualquer coisa gera outro hash.

Como cada commit aponta pro pai, o histórico forma um **grafo** (um DAG, grafo acíclico dirigido):
```
A ← B ← C ← D        (main)
         ↖
           E ← F     (feature)
```

### As três áreas
```
Working directory  ──git add──▶  Staging (index)  ──git commit──▶  Repositório
(seus arquivos)                  (o que vai no próximo commit)      (histórico)
```
A **staging area** deixa você escolher **o que** entra no commit, montando commits pequenos e com um assunto só.

### Branch e HEAD
- **Branch** é só um **ponteiro** (um arquivo com um hash) pra um commit. Criar branch é instantâneo e barato.
- **HEAD** aponta pra branch (ou commit) em que você está. Ao commitar, a branch atual avança.
- **Detached HEAD**: o HEAD aponta direto pra um commit, não pra uma branch. Commits feitos ali ficam "soltos" se você não criar uma branch.

---

## 3. Merge × Rebase

Os dois **integram** o trabalho de uma branch em outra, de jeitos diferentes.

### Merge
```
A ← B ← C ← D ← M     (main)       M = merge commit, com dois pais (D e F)
         ↖       ↙
           E ← F
```
- **Preserva o histórico real**: dá pra ver que houve uma branch e quando foi integrada.
- Não reescreve nada, então é **seguro** em branches compartilhadas.
- **Fast-forward**: se a `main` não andou desde que a branch saiu, o Git só avança o ponteiro, sem merge commit.
- Custo: histórico com muitos merge commits pode ficar poluído.

### Rebase
```
A ← B ← C ← D ← E' ← F'   (feature, reaplicada em cima de D)
```
- **Reaplica** os commits da sua branch em cima da ponta da outra, criando **commits novos** (E', F', com outros hashes).
- Histórico **linear** e limpo.
- **Reescreve o histórico.**

> **Regra de ouro do rebase:** nunca faça rebase de commits que **outras pessoas já baixaram** (branch compartilhada/pública). Você cria commits novos, e o histórico do colega diverge do seu.

Uso típico: `git rebase main` (ou `git pull --rebase`) na **sua** branch local pra atualizá-la antes do PR; **rebase interativo** (`git rebase -i`) pra juntar e arrumar commits antes de pedir revisão.

### Squash merge
No PR, junta todos os commits da branch em **um só** commit na `main`. Histórico da `main` fica com "um commit por funcionalidade". Muito usado com GitHub Flow.

---

## 4. Desfazendo coisas

| Comando | O que faz | Reescreve histórico? |
|---|---|---|
| `git revert <commit>` | Cria um **novo commit** que desfaz o anterior | Não, **seguro** em branch compartilhada |
| `git reset --soft <c>` | Volta a branch pra `<c>`, mantém as mudanças **no staging** | Sim |
| `git reset --mixed <c>` (padrão) | Volta, mantém as mudanças **nos arquivos**, fora do staging | Sim |
| `git reset --hard <c>` | Volta e **descarta** as mudanças | Sim, e apaga trabalho |
| `git restore <arquivo>` | Descarta mudanças não commitadas de um arquivo | Não |
| `git stash` | Guarda mudanças não commitadas numa "gaveta" temporária | Não |
| `git cherry-pick <c>` | Copia um commit específico pra branch atual | Não (cria commit novo) |

Regra: em algo que **já foi pro remoto**, prefira **`revert`**. `reset` é pra histórico **local**.

**Rede de segurança:** o `git reflog` registra por onde o HEAD passou. Mesmo depois de um `reset --hard` errado, dá pra achar o hash antigo e recuperar.

**Force push:** depois de reescrever histórico, o push normal é rejeitado. Se precisar forçar, use **`git push --force-with-lease`**: ele só força se o remoto ainda estiver como você viu, e evita apagar commits que um colega enviou nesse meio tempo.

---

## 5. Conflitos

Acontecem quando as duas branches mudaram **as mesmas linhas** (ou uma apagou o que a outra alterou). O Git marca o trecho:
```
<<<<<<< HEAD
const limite = 10;
=======
const limite = 20;
>>>>>>> feature/limite
```
Resolver = decidir o resultado certo (às vezes uma **combinação** dos dois), remover as marcas, testar e concluir (`git add` + `git commit`, ou `git rebase --continue`).

Como reduzir conflitos: **branches curtas**, integrar com frequência, PRs pequenos, e formatador automático (sem briga de espaço e aspas).

---

## 6. Fluxos de trabalho

| Fluxo | Como é | Bom para |
|---|---|---|
| **Git Flow** | `main` (produção), `develop` (integração), branches `feature/*`, `release/*`, `hotfix/*` | Produtos com **versões** e releases planejadas (app instalado, biblioteca) |
| **GitHub Flow** | Só `main` sempre implantável + branches curtas + PR + deploy | Aplicações web com **deploy contínuo** |
| **Trunk-based** | Todos integram na `main` (trunk) **várias vezes por dia**, branches de horas; código incompleto escondido por **feature flags** | Times maduros com CI forte e muitos deploys |

Tendência do mercado: **GitHub Flow** ou **trunk-based**, com **CI** em todo PR e **feature flags** separando *deploy* (código em produção) de *release* (funcionalidade ligada pro usuário). O Git Flow ficou pesado para quem faz deploy várias vezes por dia: branches longas geram conflitos grandes.

---

## 7. Pull Requests e code review

**PR bom:**
- **Pequeno** e com **um assunto** (várias centenas de linhas já dificultam revisar de verdade).
- Descrição com **o quê** e **por quê**, como testar, prints se for UI.
- CI passando (testes, lint, build) antes de pedir revisão.

**Revisão boa:**
- Foca em **correção, clareza, riscos e design**, não em estilo (isso é trabalho do formatador e do linter).
- Comentários **sobre o código, não sobre a pessoa**; perguntas em vez de ordens ("e se a lista vier vazia?").
- Diferencia **bloqueante** de **sugestão** ("nit:").

**Mensagens de commit:** no imperativo, dizendo o **porquê** quando não for óbvio. O padrão **Conventional Commits** (`feat:`, `fix:`, `docs:`, `refactor:`) permite gerar changelog e versão semântica automaticamente.

**Proteções de branch:** `main` protegida, merge só por PR, status checks obrigatórios, sem force push.

---

## 8. Como falar na entrevista

**"Qual a diferença entre merge e rebase?"**
> "Os dois integram trabalho de uma branch em outra. O merge preserva o histórico real e cria um merge commit quando as branches divergiram; não reescreve nada, então é seguro em branch compartilhada. O rebase reaplica meus commits em cima da outra branch, gerando commits novos e um histórico linear, mas reescreve o histórico. Minha regra é: rebase na minha branch local pra atualizar e arrumar os commits antes do PR, nunca em branch que outras pessoas já baixaram. E se precisar forçar o push, uso force-with-lease."

**"Como é o fluxo de trabalho que você usa?"**
> "Branches curtas a partir da main, PR pequeno com CI rodando testes e lint, revisão de pelo menos uma pessoa e squash merge. A main fica sempre implantável e o deploy é automático. Funcionalidade que não está pronta vai desligada por feature flag, o que separa deploy de release e evita branch longa acumulando conflito."

---

## 9. Resumo

- Git é **distribuído**; commit é **snapshot** com hash e pai; histórico é um **grafo**.
- **Working directory → staging → repositório**. **Branch** = ponteiro; **HEAD** = onde você está.
- **Merge** preserva histórico (seguro); **rebase** lineariza e **reescreve** (só em branch local). **Squash** = um commit por PR.
- **`revert`** pra desfazer o que já é público; **`reset`** só local; **`reflog`** salva; **`--force-with-lease`**.
- Conflitos: branches curtas e PRs pequenos.
- Fluxos: **Git Flow** (releases), **GitHub Flow** (deploy contínuo), **trunk-based** + feature flags.
- PR pequeno, com porquê e CI; review sobre o código; Conventional Commits.

## Termos desta aula
Git · controle de versão distribuído · commit · snapshot · hash · DAG · working directory · staging area · index · branch · HEAD · detached HEAD · merge · fast-forward · merge commit · rebase · rebase interativo · squash · revert · reset · soft · mixed · hard · stash · cherry-pick · reflog · force-with-lease · conflito · Git Flow · GitHub Flow · trunk-based development · feature flag · deploy × release · pull request · code review · Conventional Commits · branch protegida

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 13** e separadas por nível.
