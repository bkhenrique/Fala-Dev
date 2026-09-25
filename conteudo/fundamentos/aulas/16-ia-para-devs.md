# Aula 16 — IA para devs: LLMs, embeddings, RAG e agentes

> **Objetivo:** entender o suficiente de IA generativa pra explicar e integrar LLMs num sistema: tokens e janela de contexto, alucinação, saída estruturada e validação, embeddings e busca vetorial, RAG, agentes com ferramentas, e a arquitetura por trás (BFF, fila, streaming, custo, dados sensíveis, avaliação).

---

## 1. O problema

Hoje muita vaga de backend e fullstack pede "experiência com IA". Na prática, isso quase nunca é treinar modelo: é **integrar um LLM num produto** de forma confiável, segura e com custo controlado. As perguntas de entrevista giram em torno de **arquitetura** e **trade-offs**: por que o front não chama o modelo direto, como validar a resposta, quando usar RAG, como controlar custo.

---

## 2. O que é um LLM (sem matemática)

Um **LLM** (*Large Language Model*) é um modelo treinado com enormes volumes de texto pra **prever o próximo pedaço de texto** dado o que veio antes. A arquitetura por trás é o **Transformer**, com o mecanismo de **atenção**, que pesa quais partes do texto importam pra gerar a próxima.

Consequências práticas:
- Ele **gera texto plausível**, não "consulta a verdade". Por isso pode **alucinar**: inventar fatos, referências ou APIs com total confiança.
- Ele **não sabe** o que aconteceu depois do treino (tem uma **data de corte**) nem conhece os **seus dados**, a não ser que você os envie.
- É **não determinístico** por padrão: a mesma pergunta pode gerar respostas diferentes.

### Tokens e janela de contexto
- O modelo não lê palavras, lê **tokens** (pedaços de palavra; em português, uma palavra costuma virar 1 a 3 tokens).
- **Janela de contexto**: o máximo de tokens que cabem numa chamada (instruções + histórico + documentos + resposta).
- **Custo** e **latência** crescem com o número de tokens de entrada e de saída. Cobrança é por token.

### Parâmetros comuns
- **Temperatura**: aleatoriedade. Baixa → respostas mais previsíveis (bom pra extração e classificação); alta → mais criativas.
- **Máximo de tokens de saída**: limita o tamanho (e o custo) da resposta.
- **System prompt** (instruções do sistema): define papel, regras e formato; separado da mensagem do usuário.

---

## 3. Prompt e saída estruturada

**Prompt engineering** é escrever instruções claras: contexto, tarefa, formato esperado, exemplos (*few-shot*) e o que fazer quando não souber ("se a informação não estiver no texto, responda que não encontrou").

Em sistemas, quase sempre você quer **dados**, não prosa:
- Peça **saída estruturada** (JSON seguindo um schema). Muitas APIs de modelo têm modo de saída estruturada ou *tool calling* que força o formato.
- **Sempre valide** o que voltou (ex.: com **Zod** ou JSON Schema). Trate a resposta do LLM como **input externo não confiável**.
- Se vier inválido: **retry** com a mensagem de erro de validação, com **limite** de tentativas; depois, falha controlada ou fallback.

---

## 4. Embeddings e busca vetorial

Um **embedding** é um vetor de números que representa o **significado** de um texto. Textos com sentido parecido geram vetores **próximos**, mesmo com palavras diferentes ("cancelar assinatura" fica perto de "encerrar meu plano").

- A proximidade é medida por **similaridade de cosseno** (ou distância).
- Um **banco vetorial** guarda os vetores e busca "os K mais parecidos" de forma eficiente, com índices aproximados (HNSW, IVF). Exemplos: **pgvector** (extensão do Postgres), Qdrant, Pinecone, Weaviate.
- Usos: **busca semântica**, recomendação, deduplicação, agrupamento e, principalmente, **RAG**.

---

## 5. RAG (Retrieval-Augmented Generation)

O LLM não conhece seus documentos internos. **RAG** resolve isso **buscando** os trechos relevantes e **enviando junto** na pergunta.

```
Indexação (antes):
  documentos → dividir em pedaços (chunking) → gerar embeddings → guardar no banco vetorial

Na pergunta:
  pergunta → embedding → buscar os K trechos mais parecidos
          → montar o prompt: instruções + trechos + pergunta
          → LLM responde com base nos trechos (e cita as fontes)
```

Pontos que caem em entrevista:
- **Chunking**: pedaços grandes demais trazem ruído; pequenos demais perdem contexto. Costuma-se usar sobreposição entre pedaços.
- **Qualidade da busca decide tudo**: se o trecho certo não vem, o modelo não tem como acertar. Técnicas: **busca híbrida** (vetorial + palavra-chave), **reranking**, filtros por metadados (cliente, data, permissão).
- **Permissões**: filtre pelo que **o usuário pode ver** antes de mandar pro modelo; senão o RAG vaza documento de outro cliente.
- **Atualização**: documento mudou → reindexar os pedaços dele.

**RAG × fine-tuning:**
- **RAG**: traz **conhecimento** novo ou atualizado, com fonte citável; muda na hora em que os documentos mudam. É a primeira opção pra "responder sobre nossos dados".
- **Fine-tuning**: ajusta **comportamento, estilo ou formato** do modelo com exemplos. Não é a melhor forma de "ensinar fatos" que mudam.

Nem todo problema precisa de RAG: se o documento cabe inteiro na janela de contexto e é pouco usado, mandar o texto direto é mais simples.

---

## 6. Agentes e ferramentas (tool calling)

**Tool calling** (ou *function calling*): você descreve funções disponíveis (nome, descrição, parâmetros em JSON Schema); o modelo decide **chamar uma**, sua aplicação **executa** e devolve o resultado, e o modelo continua.

Um **agente** é um LLM rodando esse ciclo em **loop** até cumprir um objetivo: pensar → chamar ferramenta → observar o resultado → decidir o próximo passo.

Cuidados:
- **Quem executa é o seu código**: valide os argumentos e aplique **autorização** como em qualquer endpoint. O modelo pode pedir algo indevido (inclusive induzido por **prompt injection**: texto malicioso num documento ou página que tenta dar ordens ao modelo).
- **Limites**: número máximo de passos, timeout e custo por execução.
- Ações irreversíveis (pagar, apagar, enviar) pedem **confirmação humana**.
- Existe um padrão aberto pra expor ferramentas e dados a modelos, o **MCP** (*Model Context Protocol*).

---

## 7. Arquitetura de uma aplicação com LLM

```
Front ──▶ BFF / API (autenticação, rate limit, validação)
             │ tarefas longas → fila → worker ──▶ camada de IA
             │ respostas longas → streaming (SSE) pro front
             ▼
        Camada de IA
          ├─ "tasks" (resumir, classificar, extrair…): prompt + schema de saída + validação
          ├─ "providers" (OpenAI, Anthropic, Google…) atrás de uma interface
          ├─ proteção de PII, cache, controle de custo, logs e métricas
          └─ RAG (busca vetorial) quando precisa de dados próprios
```

Decisões e por quê:
- **O front nunca chama o provedor direto**: a chave de API vazaria, e você perderia controle de custo, rate limit, validação e proteção de dados. O backend (ou um **BFF**) intermedeia.
- **Separar "provider" de "task"**: a regra de negócio (a task) depende de uma **interface** de provedor, não de um SDK específico. Trocar de modelo ou ter **fallback** entre provedores vira configuração (inversão de dependência).
- **Assíncrono** pra tarefas longas: a API enfileira e responde **202** com um id; um worker processa com **retry com backoff** (provedores devolvem 429 e 5xx) e **idempotência** (retry não pode cobrar duas vezes nem gerar dois resultados).
- **Streaming (SSE)** pra respostas em texto: o usuário vê a resposta aparecer enquanto é gerada.
- **Custo**: limitar tokens de saída, escolher o **modelo mais barato que resolve** cada task (roteamento), **cache** de respostas pra entradas repetidas, cotas por usuário, métricas de tokens por feature.
- **PII e LGPD**: mascarar ou remover dados pessoais antes de enviar a um terceiro, e saber a política de retenção do provedor.
- **Provedor fora do ar**: timeout, circuit breaker, fallback pra outro provedor ou degradação graciosa.

---

## 8. Avaliação e observabilidade

LLM não se testa só com teste unitário tradicional, porque a resposta varia. Usa-se **avaliação (evals)**:
- Um **conjunto de casos** com entradas e o que se espera (resposta exata, campos obrigatórios, critérios).
- Métricas automáticas (validou o schema? acertou a classificação?) e, pra texto livre, **LLM como juiz** com uma rubrica, calibrado com avaliação humana.
- Rodar as evals **a cada mudança de prompt ou de modelo**, como um teste de regressão.
- Em produção: logar prompt, resposta, tokens, latência e custo (cuidando de PII), e coletar **feedback do usuário**.

---

## 9. Como falar na entrevista

**"Por que o frontend não chama o LLM diretamente?"**
> "Porque a chave do provedor ficaria exposta no navegador, e eu perderia o controle de custo, rate limit, validação da resposta e proteção de dados pessoais. A chamada passa pelo backend: ele autentica o usuário, aplica cota, remove PII, chama o provedor atrás de uma interface, valida a saída com schema e devolve, em streaming se for texto longo, ou via fila e 202 se for uma tarefa demorada."

**"O que é RAG e quando você usaria?"**
> "É buscar os trechos relevantes dos nossos documentos e mandar junto na pergunta, pra o modelo responder com base neles. Os documentos são divididos em pedaços, viram embeddings e ficam num banco vetorial, como o pgvector; na pergunta eu busco os mais parecidos e monto o prompt. Uso quando o modelo precisa responder sobre dados próprios ou atualizados, com fonte. O ponto crítico é a qualidade da busca e respeitar as permissões do usuário. Se o documento cabe na janela de contexto, às vezes mandar direto é mais simples."

---

## 10. Resumo

- **LLM** prevê o próximo token; pode **alucinar**; tem **data de corte**; é **não determinístico**.
- **Tokens** e **janela de contexto** definem limite, custo e latência. **Temperatura** controla a aleatoriedade.
- **Saída estruturada + validação com schema**; resposta do LLM é input não confiável; retry limitado.
- **Embeddings**: significado em vetor; **similaridade de cosseno**; **banco vetorial** (pgvector).
- **RAG**: chunking → embeddings → busca → prompt com trechos. Qualidade da busca e **permissões** são o essencial. RAG pra conhecimento; **fine-tuning** pra comportamento.
- **Agentes**: tool calling em loop; seu código executa e autoriza; cuidado com **prompt injection**; limites e confirmação humana.
- Arquitetura: **backend/BFF intermedeia**, **provider × task**, **fila + 202**, **SSE**, controle de **custo**, **PII**, fallback.
- **Evals** a cada mudança de prompt/modelo; observabilidade de tokens, custo e latência.

## Termos desta aula
LLM · Transformer · atenção · token · janela de contexto · data de corte · alucinação · temperatura · system prompt · prompt engineering · few-shot · saída estruturada · JSON Schema · Zod · embedding · vetor · similaridade de cosseno · banco vetorial · pgvector · HNSW · busca semântica · RAG · chunking · busca híbrida · reranking · fine-tuning · tool calling · agente · prompt injection · MCP · BFF · provider · task · streaming · SSE · 202 Accepted · roteamento de modelo · PII · LGPD · fallback · evals · LLM como juiz

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 16** e separadas por nível.
