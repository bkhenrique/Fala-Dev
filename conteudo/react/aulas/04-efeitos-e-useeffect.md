# Aula 04 — Efeitos e useEffect (e quando não usar)

> **Objetivo:** entender pra que serve o `useEffect` (sincronizar com sistemas externos), como funcionam o array de dependências e o cleanup, por que o StrictMode roda o efeito duas vezes, como evitar race condition ao buscar dados, e reconhecer os casos em que você **não precisa** de um efeito.

---

## 1. O problema

O render deve ser **puro** (aula 01). Mas a aplicação precisa fazer coisas "fora do React": assinar um WebSocket, mexer no título da página, iniciar um timer, integrar com uma biblioteca de mapa, buscar dados. Onde colocar isso?

- Se é **reação a uma ação do usuário** (clicou, enviou): no **event handler**.
- Se é **sincronizar** o componente com algo externo **enquanto ele está na tela**: no **efeito**.

`useEffect` é o **gancho de sincronização** com sistemas externos. Não é um "ciclo de vida" pra rodar lógica qualquer.

---

## 2. Como funciona

```jsx
useEffect(() => {
  const conexao = criarConexao(salaId);   // sincroniza
  conexao.conectar();
  return () => conexao.desconectar();      // cleanup: desfaz
}, [salaId]);                              // dependências
```

- O efeito roda **depois do commit** (depois de a tela ser atualizada e, normalmente, pintada), sem bloquear a pintura.
- **Dependências**: o React compara cada valor com o do render anterior (`Object.is`). Se algum mudou, roda o **cleanup** do efeito anterior e depois o efeito de novo.
  - `[salaId]`: roda na montagem e quando `salaId` muda.
  - `[]`: só na montagem (e o cleanup na desmontagem).
  - Sem array: depois de **todo** render (raramente é o que você quer).
- **Cleanup**: a função retornada desfaz o que o efeito fez (desconectar, limpar timer, remover listener). Roda antes da próxima execução e quando o componente sai da tela. Esquecer o cleanup gera **vazamento** (listeners acumulando, conexões duplicadas).

### As dependências são o que o efeito usa
A regra do linter (`react-hooks/exhaustive-deps`) exige declarar **tudo** que o efeito usa de props, estado e funções do componente. Mentir nas dependências pra "rodar uma vez só" gera **stale closure**: o efeito enxerga valores velhos. Se o efeito roda demais, a solução é **mudar o código** (tirar a dependência de dentro, usar updater, mover a função pra dentro do efeito), não esconder a dependência.

### Objetos e funções como dependência
Um objeto ou função criado no corpo do componente é **novo a cada render**, então o efeito roda sempre. Soluções: criar dentro do efeito, depender de valores primitivos (`usuario.id` em vez de `usuario`), ou memoizar (`useMemo`, `useCallback`, aula 06).

---

## 3. Por que o efeito roda duas vezes em desenvolvimento?

No **StrictMode**, em desenvolvimento, o React **monta, desmonta e monta de novo** cada componente. Parece bug, mas é um teste: se o seu efeito não tem cleanup correto (conecta duas vezes, duplica listener), você descobre na hora. Em produção roda uma vez.

A resposta certa não é desligar o StrictMode: é **escrever o cleanup**, de modo que "montar → desmontar → montar" tenha o mesmo resultado que "montar".

---

## 4. Buscar dados com useEffect (e a race condition)

```jsx
useEffect(() => {
  let ignorar = false;
  const controller = new AbortController();

  fetch(`/api/produtos?busca=${busca}`, { signal: controller.signal })
    .then((r) => r.json())
    .then((dados) => { if (!ignorar) setProdutos(dados); })
    .catch(() => {});

  return () => { ignorar = true; controller.abort(); };
}, [busca]);
```

Sem o cleanup, se o usuário digita "no" e depois "note", as duas requisições correm juntas; se a resposta de "no" chegar **depois**, ela sobrescreve a de "note": **race condition**. O cleanup ignora (e cancela) a resposta velha.

Mesmo corrigido, buscar dados na mão com efeito tem vários problemas: sem cache, sem deduplicação, cascata de requisições (*waterfall*), loading e erro manuais, nada de pré-carregamento. Por isso, na prática, usa-se **TanStack Query/SWR** (aula 07) ou **buscar no servidor** com o framework (Server Components no Next).

---

## 5. Você provavelmente não precisa de um efeito

Uma das lições mais cobradas do React moderno. Casos em que **não** se usa efeito:

| Situação | ❌ Com efeito | ✅ Sem efeito |
|---|---|---|
| Valor calculado de props/estado | `useEffect(() => setTotal(soma(itens)), [itens])` | `const total = soma(itens)` (cálculo caro? `useMemo`) |
| Reagir a um clique/envio | Estado "enviou" + efeito que chama a API | Chamar a API **no handler** do evento |
| Resetar estado ao mudar uma prop | Efeito que zera o estado quando `id` muda | `<Componente key={id} />` |
| Avisar o pai de uma mudança | Efeito que chama `onChange` depois | Chamar `onChange` no mesmo handler que mudou o estado |
| Encadear estados | Efeito A muda estado B, efeito B muda C… | Calcular tudo no handler |

Cada efeito desnecessário custa **um render extra** (renderiza com o valor velho, roda o efeito, muda o estado, renderiza de novo) e abre espaço pra bugs de sincronização.

---

## 6. useLayoutEffect e useEffectEvent

- **`useLayoutEffect`**: igual ao `useEffect`, mas roda **antes de o navegador pintar**. Use só quando precisa **medir o layout** e ajustar antes de o usuário ver (ex.: posicionar um tooltip), senão aparece um "pulo". Bloqueia a pintura, então é exceção.
- **`useEffectEvent`** (versões recentes do React): extrai de dentro do efeito uma lógica que precisa ler o valor **mais recente** de algo sem que esse algo vire dependência (ex.: registrar log com o tema atual quando conectar a uma sala, sem reconectar ao mudar o tema).

---

## 7. Como falar na entrevista

**"Pra que serve o useEffect?"**
> "Pra sincronizar o componente com um sistema externo enquanto ele está na tela: assinatura, timer, WebSocket, biblioteca de terceiros. Ele roda depois do commit, e o array de dependências define quando roda de novo; antes de rodar de novo, e na desmontagem, o React executa o cleanup. As dependências têm que ser tudo o que o efeito usa, senão vira stale closure. E muito do que as pessoas colocam em efeito não precisa estar lá: valor derivado se calcula no render, reação a clique vai no handler, e resetar estado se faz com key."

**"Por que meu efeito roda duas vezes?"**
> "É o StrictMode em desenvolvimento: ele monta, desmonta e monta de novo pra revelar efeito sem cleanup. Em produção roda uma vez. A correção é escrever o cleanup de forma que montar duas vezes dê o mesmo resultado, por exemplo desconectar o que foi conectado ou ignorar a resposta de um fetch antigo."

---

## 8. Resumo

- Efeito = **sincronizar com sistema externo**; ação do usuário vai no **handler**.
- Roda **depois do commit**; **dependências** decidem quando repete; **cleanup** desfaz e evita vazamento.
- Dependências = tudo que o efeito usa (linter); mentir gera **stale closure**; objetos/funções novos a cada render disparam o efeito.
- **StrictMode** monta duas vezes em dev pra achar cleanup faltando.
- Fetch em efeito: tratar **race condition** (flag ou AbortController); melhor usar TanStack Query ou buscar no servidor.
- **Não precisa de efeito**: valor derivado, reação a evento, reset (use **key**), avisar o pai, encadear estados.
- `useLayoutEffect` só pra medir layout antes de pintar; `useEffectEvent` pra ler valor recente sem virar dependência.

## Termos desta aula
efeito colateral · useEffect · sincronização · sistema externo · event handler · array de dependências · cleanup · vazamento · exhaustive-deps · stale closure · StrictMode · race condition · AbortController · waterfall · TanStack Query · estado derivado · useLayoutEffect · useEffectEvent

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 04** e separadas por nível.
