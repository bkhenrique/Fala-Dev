# Aula 08 — React concorrente, Suspense e o React 19

> **Objetivo:** entender o que é renderização concorrente, como `useTransition`, `useDeferredValue` e `Suspense` mantêm a interface responsiva, e o que o React 19 trouxe: Actions, `useActionState`, `useFormStatus`, `useOptimistic`, `use`, `ref` como prop e Server Components.

---

## 1. O problema

Antes do React 18, uma atualização começava e **ia até o fim** sem parar. Se filtrar uma lista enorme levasse 300 ms, a digitação do usuário **travava** por 300 ms: a tecla só aparecia depois.

Nem toda atualização tem a mesma urgência:
- **Urgente**: digitar, clicar, arrastar. O usuário espera resposta **imediata**.
- **Não urgente**: mostrar os resultados filtrados, trocar de aba, carregar uma tela. Pode levar um instante.

---

## 2. Renderização concorrente

Desde o React 18, com a arquitetura **Fiber** (aula 01), o React consegue **interromper** uma renderização em andamento, atender algo mais urgente e depois **retomar** (ou descartar o trabalho que ficou velho). Isso é **renderização concorrente**.

"Concorrente" aqui não é paralelismo em várias threads: continua tudo na thread principal. É a capacidade de **fatiar e priorizar** o trabalho de renderização.

Você não liga isso sozinho; você **marca** o que não é urgente:

### useTransition
```jsx
const [pendente, iniciarTransicao] = useTransition();

function aoDigitar(e) {
  setTexto(e.target.value);                         // urgente: o input atualiza na hora
  iniciarTransicao(() => setFiltro(e.target.value)); // não urgente: pode ser interrompido
}

{pendente && <Spinner />}
```

- O que está dentro da **transição** tem prioridade baixa: se o usuário digitar de novo, o React abandona o render antigo e começa o novo.
- `pendente` indica que a transição está em andamento (pra mostrar um indicador sem esconder o conteúdo atual).
- Uso típico: trocar de aba ou de página, filtros pesados.

### useDeferredValue
```jsx
const filtroAdiado = useDeferredValue(filtro);
const resultados = useMemo(() => filtrar(itens, filtroAdiado), [itens, filtroAdiado]);
```
Mesma ideia quando você **não controla** onde o estado muda: recebe um valor e usa uma versão "atrasada" dele pra parte pesada da tela.

Diferença pro **debounce**: debounce espera um tempo fixo (e atrasa até em máquina rápida); transições começam **na hora** e só cedem quando algo mais urgente aparece.

---

## 3. Suspense

**Suspense** permite que um componente **"espere"** algo (código ou dados) e o React mostre um **fallback** enquanto isso:

```jsx
<Suspense fallback={<SkeletonPerfil />}>
  <Perfil />          {/* pode "suspender" enquanto carrega */}
</Suspense>
```

- Com **`lazy`**, suspende enquanto o **código** do componente é baixado (aula 06).
- Com frameworks e bibliotecas compatíveis (Next, TanStack Query com `useSuspenseQuery`, o hook `use`), suspende enquanto os **dados** chegam.
- Permite organizar o carregamento **declarativamente**: cada parte da tela tem seu próprio skeleton, sem `if (loading)` espalhado.
- No servidor, habilita **streaming SSR**: o HTML vai sendo enviado conforme cada parte fica pronta (ver [Next, aula 06](../../nextjs/aulas/06-dados-e-cache.md)).
- Com transições, o React **mantém a tela anterior** em vez de voltar pro fallback ao navegar.

**Error Boundaries** são o par do Suspense pros erros: capturam um erro de renderização numa parte da árvore e mostram uma UI alternativa, em vez de derrubar a aplicação inteira. (Ainda são componentes de classe, ou se usa a biblioteca `react-error-boundary`.)

---

## 4. React 19

Lançado no fim de 2024, com evoluções nas versões 19.x. O que mais cai:

### Actions
Funções **assíncronas** usadas em transições, principalmente em formulários. O React gerencia sozinho o **estado pendente**, os **erros** e a **atualização otimista**.

```jsx
function AlterarNome() {
  const [erro, enviar, pendente] = useActionState(async (estadoAnterior, formData) => {
    const erro = await atualizarNome(formData.get("nome"));
    return erro ?? null;
  }, null);

  return (
    <form action={enviar}>
      <input name="nome" />
      <button disabled={pendente}>Salvar</button>
      {erro && <p>{erro}</p>}
    </form>
  );
}
```

- **`<form action={fn}>`**: o formulário chama a função com o `FormData` ao enviar.
- **`useActionState`**: guarda o resultado da última ação (ex.: erro de validação) e o estado pendente.
- **`useFormStatus`**: um componente filho (o botão) sabe se o formulário está sendo enviado, sem receber props.
- **`useOptimistic`**: mostra o resultado esperado na hora (a mensagem aparece no chat) e reverte se a ação falhar.

### O hook `use`
Lê o valor de uma **Promise** (suspendendo até ela resolver) ou de um **contexto**. Diferente dos outros hooks, pode ser chamado **dentro de condicionais**.

### Outras mudanças
- **`ref` como prop comum** em componentes de função: `forwardRef` não é mais necessário.
- `<Context>` direto como provider (em vez de `<Context.Provider>`).
- Tags de **metadados** (`<title>`, `<meta>`) dentro de componentes, que o React sobe pro `<head>`.
- **Server Components** e **Server Actions** estáveis pro uso via frameworks (como o Next App Router).
- Nas versões 19.x seguintes vieram, por exemplo, o `useEffectEvent` (aula 04) e o componente `<Activity>` (esconder uma parte da UI mantendo o estado dela).

---

## 5. Server Components em uma frase

**React Server Components** são componentes que rodam **só no servidor**, podem acessar banco e segredos direto, e **não mandam JavaScript** pro navegador. Eles são um recurso do React, mas usados através de um framework. A explicação completa está na [trilha de Next.js](../../nextjs/aulas/05-server-e-client-components.md).

---

## 6. Como falar na entrevista

**"O que é renderização concorrente?"**
> "É a capacidade do React, desde a versão 18, de interromper uma renderização em andamento pra atender algo mais urgente e depois retomar ou descartar o trabalho velho. Não é paralelismo, continua tudo na thread principal; é priorização. Eu uso com useTransition, marcando como não urgente uma atualização pesada, tipo filtrar uma lista grande, enquanto a digitação continua instantânea, ou useDeferredValue quando só recebo o valor. Diferente do debounce, a transição começa na hora e só cede quando aparece algo mais urgente."

**"O que mudou no React 19?"**
> "O principal foram as Actions: funções assíncronas em transições, integradas ao form com action, com useActionState pro resultado e o estado pendente, useFormStatus pro botão saber que está enviando, e useOptimistic pra atualização otimista. Também veio o hook use, que lê promise ou contexto e pode ficar em condicional, ref como prop comum, sem forwardRef, metadados no componente e Server Components estáveis pra frameworks."

---

## 7. Resumo

- Nem toda atualização é urgente; antes do 18, render longo **travava** a interação.
- **Renderização concorrente**: interromper, priorizar e retomar (Fiber). Não é multithread.
- **`useTransition`** (marca a atualização como não urgente, dá `pendente`) e **`useDeferredValue`** (versão atrasada de um valor). Diferente de debounce.
- **Suspense**: fallback enquanto código ou dados carregam; skeletons declarativos; **streaming SSR**. **Error Boundary** pros erros.
- **React 19**: **Actions**, `<form action>`, **`useActionState`**, **`useFormStatus`**, **`useOptimistic`**, **`use`**, `ref` como prop, metadados, **Server Components** via frameworks.

## Termos desta aula
renderização concorrente · Fiber · prioridade · atualização urgente · transição · useTransition · isPending · useDeferredValue · debounce · Suspense · fallback · skeleton · streaming SSR · Error Boundary · React 19 · Actions · form action · FormData · useActionState · useFormStatus · useOptimistic · use · forwardRef · metadados · Server Components · Server Actions · Activity

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 08** e separadas por nível.
