# Modelo — pergunta

As perguntas de cada trilha ficam em `conteudo/<trilha>/perguntas/`, **um arquivo por nível**:

| Arquivo | Nível | Tipo de pergunta | Exemplo |
|---|---|---|---|
| `nivel-1.md` | **1 — O que é?** | Definição | "O que é o Event Loop?" |
| `nivel-2.md` | **2 — Por quê? Quando usar?** | Comparação, motivo, trade-off | "Worker Thread ou fila?" |
| `nivel-3.md` | **3 — Como você faria?** | Cenário real, junta vários conceitos | "Como investigaria uma API lenta?" |

Regras:
- Dentro do arquivo, as perguntas ficam **agrupadas pela aula de origem**, em ordem, e a numeração começa em 1 e é **contínua**. Ao inserir no meio, renumere as seguintes.
- A linha `<sub>` aponta para a aula que explica o assunto (caminho `../aulas/`).
- A resposta fica dentro do `<details>` e precisa das linhas em branco para o Markdown funcionar.
- Atualize a contagem no `perguntas/README.md` da trilha.

```markdown
**N. Pergunta aqui?**
<sub>Aula [03 — Título da aula](../aulas/03-nome-da-aula.md)</sub>
<details><summary>Ver resposta</summary>

Resposta curta: de 2 a 6 frases, na ordem definição → pra que serve → exemplo → trade-off.

</details>
```
