# Aula 10 — Concorrência, GIL e desempenho

> **Objetivo:** escolher entre threads, processos e concorrência assíncrona com escopo correto para afirmações sobre o GIL.

---

## 1. I/O e CPU

Trabalho I/O-bound passa tempo esperando rede, disco ou outro recurso. Threads ou `asyncio` podem manter progresso durante esperas, conforme as APIs. Trabalho CPU-bound exige cálculo; processos podem usar vários núcleos, com custos de criação e comunicação.

Threads compartilham memória do processo, facilitando comunicação e criando riscos de corrida. Processos têm memória separada e trocam dados por mecanismos explícitos.

## 2. O GIL

O GIL tradicional é característica de builds convencionais do **CPython**: limita a execução simultânea de bytecode Python por várias threads dentro do mesmo processo. Não é regra abstrata da linguagem nem significa que threads nunca ajudem; operações de I/O e código nativo podem liberar o lock.

CPython oferece builds free-threaded a partir da linha 3.13. Suporte, compatibilidade de extensões e desempenho dependem da versão e do build; não se deve generalizar que “Python sempre tem GIL” nem que removê-lo acelera qualquer programa.

## 3. Medir e sincronizar

Use profiling para localizar gargalos antes de otimizar. Compreensões, generators e caching têm trade-offs de clareza, memória e invalidação. Complexidade algorítmica continua relevante.

Quando threads compartilham estado mutável, sincronize invariantes com locks ou filas apropriadas. Não trate uma operação como atomicamente segura só porque parece assim numa implementação específica.

## 4. Como falar na entrevista

**“O GIL torna threads inúteis em Python?”**
> “Não. Em CPython convencional, o GIL limita paralelismo de bytecode Python entre threads, então threads não são escolha geral para acelerar CPU-bound Python puro. Ainda são úteis para I/O e integrações que liberam o lock. Processos podem usar vários núcleos; `asyncio` é concorrência cooperativa.”

## 5. Resumo

- I/O-bound, CPU-bound e concorrência cooperativa pedem estratégias diferentes.
- Threads compartilham memória; processos têm memória separada.
- O GIL tradicional é detalhe de builds convencionais do CPython, não da linguagem.
- Builds free-threaded existem, com suporte dependente da versão/ecossistema.
- Meça o gargalo e sincronize estado compartilhado explicitamente.

## Termos desta aula
I/O-bound · CPU-bound · thread · processo · GIL · CPython · free-threaded · lock · corrida de dados · profiling

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 10** e separadas por nível.

### Para aprofundar
[Threading](https://docs.python.org/3.14/library/threading.html) · [Free-threaded CPython](https://docs.python.org/3.14/howto/free-threading-python.html) · [asyncio](https://docs.python.org/3.14/library/asyncio.html)
