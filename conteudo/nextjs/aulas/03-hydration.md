# Aula 03 — Hydration: como o HTML do servidor ganha vida

> **Objetivo:** entender o que acontece entre o HTML chegar no navegador e a página ficar interativa, o que é hydration, os erros de hydration mismatch e por que Server Components reduzem esse custo.

---

## 1. O HTML do servidor é "uma foto"

Quando o servidor renderiza um componente React (SSR/SSG), ele gera **HTML**. Esse HTML aparece rápido na tela, mas é **estático**: o botão aparece, mas **clicar não faz nada**. Não existe `onClick`, não existe `useState` funcionando ainda.

> Analogia: o servidor manda uma **foto** da página pronta. É bonita e aparece rápido, mas é só uma foto. A **hydration** é o React chegar e "dar vida" a ela.

---

## 2. O que é hydration

**Hydration** (hidratação) é o processo em que o React, no navegador:
1. Baixa e executa o JavaScript dos componentes.
2. Renderiza os componentes **de novo, em memória**, e compara com o HTML que já está na tela.
3. **Reaproveita** o DOM existente (não recria) e **conecta** os event handlers e o estado.

No código, isso é o `hydrateRoot` do React (o Next faz por você).

Linha do tempo:
```
HTML chega ─▶ usuário VÊ a página (FCP/LCP)
            ─▶ JS baixa e executa
            ─▶ hydration
            ─▶ usuário pode INTERAGIR
```

O intervalo entre **ver** e **poder interagir** é um problema real: o usuário clica num botão e nada acontece. Por isso **menos JavaScript** = hydration mais rápida = página interativa mais cedo.

---

## 3. Hydration mismatch

A hydration **exige** que o React, no cliente, produza **exatamente** o mesmo HTML que o servidor produziu. Se for diferente, dá erro:

```
Error: Hydration failed because the server rendered HTML didn't match the client.
```
(ou o aviso "Text content does not match server-rendered HTML").

### Causas comuns
```tsx
// 1. Valores que mudam entre servidor e cliente
<p>{new Date().toLocaleTimeString()}</p>
<p>{Math.random()}</p>

// 2. APIs que só existem no navegador
<p>{window.innerWidth}</p>                 // no servidor nem existe window
<p>{localStorage.getItem('tema')}</p>

// 3. Checagem de ambiente no render
{typeof window !== 'undefined' ? <A /> : <B />}

// 4. HTML inválido (o navegador "corrige" e fica diferente)
<p><div>...</div></p>

// 5. Locale/fuso diferentes entre servidor e cliente (datas, números)
```
Também acontece por **extensões do navegador** que injetam HTML (tradutores, gerenciadores de senha).

### Como resolver
- Mover o que depende do navegador para **`useEffect`** (roda **só no cliente**, **depois** da hydration):
```tsx
const [largura, setLargura] = useState<number | null>(null);
useEffect(() => setLargura(window.innerWidth), []);
```
- Gerar o valor **no servidor** e passar como prop (a mesma data para os dois lados).
- Desligar SSR de um componente específico: `dynamic(() => import('./Mapa'), { ssr: false })`.
- Para casos pontuais e inevitáveis (ex: timestamp): `suppressHydrationWarning`.
- Corrigir HTML inválido.

---

## 4. O custo da hydration e a solução do App Router

No **Pages Router**, **toda** a árvore de componentes da página é hidratada: todo componente vai como JS pro navegador, mesmo um rodapé que nunca muda.

No **App Router**, com **React Server Components**:
- **Server Components não são hidratados**. Eles rodam só no servidor; o navegador recebe o resultado, **sem o JS** deles.
- Só os **Client Components** (`"use client"`) são enviados e hidratados.

Resultado: muito menos JavaScript, hydration mais rápida.

```
Página
├── Header          (Server) → só HTML
├── ListaProdutos   (Server) → só HTML
│   └── BotaoFavoritar (Client) → HTML + JS + hydration
└── Footer          (Server) → só HTML
```

Só o botão é hidratado. Isso às vezes é chamado de **hidratação seletiva/parcial** (a ideia de "ilhas de interatividade").

### Streaming + hydration seletiva
Com `<Suspense>`, o React 18+ consegue **hidratar por partes**: um pedaço que já chegou pode ficar interativo antes de outro que ainda está carregando, e ele prioriza a parte em que o usuário está clicando.

---

## 5. O que o navegador recebe no App Router

Além do HTML, o navegador recebe o **RSC Payload** (*React Server Component Payload*): uma representação compacta da árvore renderizada no servidor, com:
- O resultado dos Server Components.
- "Buracos" indicando onde entram os Client Components e quais arquivos JS carregar.
- As props passadas dos Server para os Client Components.

É com ele que o React reconcilia a árvore no cliente, e é ele que o Next busca ao **navegar** entre páginas (navegação no cliente, sem recarregar a página inteira).

---

## 6. Como falar na entrevista

**"O que é hydration?"**
> "É o processo em que o React, no navegador, pega o HTML que veio do servidor, renderiza os componentes de novo em memória, reaproveita o DOM e conecta os eventos e o estado, tornando a página interativa. Precisa que o resultado seja idêntico ao do servidor; se não for, dá hydration mismatch, que geralmente vem de Date, Math.random, window ou localStorage no render, ou de HTML inválido. A solução é mover isso pro useEffect ou gerar o valor no servidor. No App Router, Server Components não são hidratados, só os Client Components, o que reduz bastante o JavaScript e o tempo até a página ficar interativa."

---

## 7. Resumo

- HTML do servidor = **foto** sem interatividade.
- **Hydration**: React no cliente reaproveita o DOM e conecta eventos/estado.
- Entre **ver** e **interagir** existe um intervalo → menos JS é melhor.
- **Mismatch**: servidor e cliente geraram HTML diferente (Date, random, window, localStorage, HTML inválido, extensões).
- Soluções: `useEffect`, valor vindo do servidor, `ssr: false`, `suppressHydrationWarning`.
- **Server Components não hidratam**; só Client Components.
- **RSC Payload**: a árvore do servidor serializada, usada na reconciliação e navegação.

## Termos desta aula
hydration · hydrateRoot · event handler · hydration mismatch · useEffect · dynamic import · ssr: false · suppressHydrationWarning · React Server Components · Client Components · hidratação seletiva · ilhas de interatividade · Suspense · streaming · RSC Payload · reconciliação · navegação client-side · FCP · LCP

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 03** e separadas por nível.
