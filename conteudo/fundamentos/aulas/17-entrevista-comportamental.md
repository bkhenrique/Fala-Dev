# Aula 17 — Entrevista comportamental: como contar a sua experiência

> **Objetivo:** saber estruturar respostas sobre a sua própria experiência ("me fala de um projeto", "um conflito", "um erro que você cometeu") com o método STAR, transformar o que você fez em decisões e trade-offs, e montar um banco de histórias pra usar em qualquer entrevista.

---

## 1. O problema

Muita gente estuda a teoria, acerta as perguntas técnicas e trava quando ouve **"me conta sobre um projeto que você fez"**. Aí sai uma lista de tecnologias ("usei Node, Redis, Postgres…") ou uma história sem fim, sem mostrar **o que você decidiu** e **por quê**.

A entrevista comportamental (e a parte "conte sua experiência" da técnica) avalia coisas que o código não mostra: **como você toma decisões, trabalha em equipe, lida com erro e pressão, e comunica**. E a boa notícia é que dá pra treinar como qualquer outro assunto.

---

## 2. O método STAR

Estrutura pra contar uma situação de forma clara e curta:

| Letra | O quê | Quanto tempo |
|---|---|---|
| **S — Situação** | O contexto: empresa, produto, time, o que estava acontecendo | curto (15%) |
| **T — Tarefa** | O problema ou objetivo, e **qual era a sua responsabilidade** | curto (10%) |
| **A — Ação** | O que **você** fez, as decisões e **por quê** | a maior parte (50%) |
| **R — Resultado** | O que mudou, de preferência com **número**, e o que você aprendeu | (25%) |

Pra entrevista técnica, acrescente um **T de trade-off**: o que você abriu mão, que alternativa descartou, o que faria diferente hoje.

### Exemplo

**Pergunta:** "Me fala de um problema técnico difícil que você resolveu."

> **S:** "Numa plataforma de atendimento, a gente começou a usar IA pra resumir conversas. O resumo era gerado dentro da requisição."
> **T:** "Eu era responsável pelo backend dessa feature, e com o aumento de uso as requisições passaram a dar timeout nos horários de pico."
> **A:** "Tirei a geração da requisição: a API passou a enfileirar um job no Redis com BullMQ e responder 202 com um id, e o front acompanhava por SSE. Coloquei retry com backoff exponencial, porque o provedor devolvia 429 em pico, e DLQ pros jobs que esgotavam as tentativas. Como a fila entrega pelo menos uma vez, deixei o processamento idempotente com uma chave por conversa."
> **R:** "Os timeouts sumiram, o tempo de resposta da API caiu de vários segundos pra poucos milissegundos, e pico deixou de ser problema: a fila absorve e os workers processam no ritmo do provedor."
> **Trade-off:** "O custo foi mais infraestrutura, o Redis, e consistência eventual: o resumo não fica pronto na hora. Hoje eu colocaria métricas de tamanho da fila desde o primeiro dia; demorei pra ter essa visibilidade."

Repare: tem **contexto curto**, o foco está nas **decisões**, os termos técnicos aparecem com **o porquê**, e termina com **resultado e trade-off**.

---

## 3. Regras que mudam a qualidade da resposta

- **Fale "eu" quando foi você.** "A gente fez" esconde a sua contribuição. Reconheça o time, mas deixe claro o seu papel: "o time decidiu migrar; eu fiquei com a parte de filas e propus X".
- **Decisão + porquê > lista de tecnologia.** "Usei Redis" não diz nada. "Usei Redis como fila porque precisava absorver picos sem perder jobs" mostra raciocínio.
- **Números sempre que possível**: tempo de resposta, custo, taxa de erro, tempo de entrega, quantidade de usuários. Estimativa honesta vale ("reduziu mais ou menos pela metade").
- **Dois minutos por história**, mais ou menos. Deixe o entrevistador puxar os detalhes.
- **Honestidade**: não invente. O entrevistador vai aprofundar, e é aí que história inventada desmorona. Se não sabe, diga como descobriria.
- **Erro também conta**, e conta bem: mostre o que aprendeu e o que mudou no seu jeito de trabalhar.

---

## 4. Monte seu banco de histórias

Prepare de **5 a 8 histórias** reais, já no formato STAR, que cubram estes temas. Uma boa história costuma servir pra mais de uma pergunta.

| Tema | Perguntas que ela responde |
|---|---|
| **Projeto de que você se orgulha** | "Me fala de um projeto", "sua maior conquista" |
| **Problema técnico difícil** | "Um bug difícil", "um problema de performance" |
| **Decisão de arquitetura com trade-off** | "Uma decisão técnica importante", "o que faria diferente" |
| **Erro ou falha** | "Um erro que você cometeu", "um incidente em produção" |
| **Conflito ou discordância** | "Discordou do time ou do chefe?", "colega difícil" |
| **Prazo apertado / prioridade** | "Trabalhou sob pressão?", "como prioriza?" |
| **Aprender algo rápido** | "Tecnologia nova que precisou dominar" |
| **Influenciar ou ajudar outros** | "Mentoria", "melhorou um processo do time" |

Dica: pra cada história, anote as **perguntas técnicas** que ela pode gerar ("por que fila e não Worker Threads?", "como garantiu idempotência?") e responda com a teoria das aulas. É assim que a teoria vira fala.

---

## 5. Perguntas clássicas e como pensar nelas

- **"Me fala de você."** Não é sua biografia. Em 1 a 2 minutos: quem você é profissionalmente, no que tem experiência, um destaque, e por que essa vaga faz sentido.
- **"Por que quer sair / por que essa empresa?"** Foque no que você **busca** (desafio, produto, aprendizado), nunca em falar mal do emprego atual.
- **"Um ponto fraco."** Algo real, que não seja central pra vaga, e **o que você faz** pra melhorar.
- **"Discordou de uma decisão técnica?"** Mostre que argumentou com **dados**, ouviu, e que, se a decisão foi outra, você se comprometeu com ela (*disagree and commit*).
- **"Um erro em produção."** Contexto rápido, o que você fez na hora (conter o impacto), a causa, e o que mudou depois (teste, alerta, processo). Postmortem **sem culpados**.

### Quando não sabe a resposta técnica
Não invente. Mostre raciocínio: "Não trabalhei com isso diretamente. Pelo que sei de X, eu esperaria Y; eu validaria olhando Z." Isso vale mais que um chute confiante.

### Suas perguntas no final
Sempre tenha 2 ou 3: como é o fluxo de deploy e code review, qual o maior desafio técnico do time agora, como medem sucesso nos primeiros meses. Mostra interesse e te ajuda a avaliar a empresa.

---

## 6. Como treinar

1. Escreva suas histórias no formato STAR + trade-off.
2. **Fale em voz alta** e grave; ouça e corte o que não agrega.
3. Faça as **perguntas técnicas de follow-up** de cada história e responda com o vocabulário das aulas.
4. Treine com alguém que te interrompa com "por quê?".

---

## 7. Como falar na entrevista

**"Me fala de um projeto que você fez."**
> "Vou contar sobre a plataforma de IA que construí no último emprego. O problema era que cada time chamava o provedor de IA do seu jeito, direto do front em alguns casos, sem controle de custo nem de dados pessoais. Eu propus e implementei uma camada única no backend: as funcionalidades viraram 'tasks' que dependem de uma interface de provedor, com saída validada por schema, processamento assíncrono em fila e mascaramento de PII antes de chamar o provedor. Com isso a gente passou a trocar de modelo por configuração e ter custo por funcionalidade visível. O trade-off foi mais uma camada pra manter, e no MVP deixei RAG de fora de propósito, pra entregar antes. Se fosse hoje, colocaria avaliação automática dos prompts desde o início."

(Troque pelo seu projeto real: a estrutura é o que importa.)

---

## 8. Resumo

- Comportamental avalia **decisão, colaboração, erro, comunicação**.
- **STAR**: Situação e Tarefa curtas, **Ação** como foco (o que **você** fez e **por quê**), **Resultado** com número. Acrescente o **trade-off**.
- "Eu" quando foi você; **decisão + porquê** em vez de lista de tecnologia; ~2 minutos; honestidade.
- **Banco de 5 a 8 histórias** cobrindo projeto, problema difícil, decisão, erro, conflito, prazo, aprendizado, influência.
- Cada história gera perguntas técnicas: responda com a teoria das aulas.
- Não sabe? Raciocine em voz alta. Tenha perguntas pro entrevistador.

## Termos desta aula
entrevista comportamental · STAR · situação · tarefa · ação · resultado · trade-off · banco de histórias · follow-up · disagree and commit · postmortem sem culpados · pitch pessoal

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 17** e separadas por nível.
