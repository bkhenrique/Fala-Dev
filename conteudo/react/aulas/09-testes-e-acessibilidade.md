# Aula 09 — Testes e acessibilidade em React

> **Objetivo:** saber testar componentes do jeito que o usuário usa (Testing Library), escolher o que testar em cada nível (unitário, integração, E2E), simular a API com MSW, e aplicar o básico de acessibilidade: HTML semântico, labels, teclado, foco e ARIA na medida certa.

---

## 1. O problema

Testes de front costumam ser **frágeis**: quebram a cada refatoração, mesmo quando nada mudou pro usuário. Isso acontece quando o teste verifica **detalhes de implementação** (nome do estado interno, quantas vezes um método foi chamado, a classe CSS).

E acessibilidade costuma ser esquecida, embora seja **exigência legal** em muitos contextos (no Brasil, a Lei Brasileira de Inclusão) e melhore a experiência de todo mundo, inclusive teclado, leitor de tela, SEO e testes.

As duas coisas se conectam: **um componente acessível é mais fácil de testar**, porque os testes encontram elementos do mesmo jeito que um leitor de tela.

---

## 2. A filosofia da Testing Library

> "Quanto mais seus testes se parecem com a forma como o software é usado, mais confiança eles podem te dar."

A **React Testing Library** renderiza o componente e oferece consultas que funcionam **como um usuário encontra as coisas**:

```jsx
test("mostra erro quando o e-mail é inválido", async () => {
  const user = userEvent.setup();
  render(<Cadastro />);

  await user.type(screen.getByLabelText("E-mail"), "invalido");
  await user.click(screen.getByRole("button", { name: "Criar conta" }));

  expect(screen.getByRole("alert")).toHaveTextContent("E-mail inválido");
});
```

- **Ordem de preferência das consultas**: `getByRole` (com o nome acessível) → `getByLabelText` → `getByPlaceholderText` → `getByText` → … → `getByTestId` (último recurso).
- **`userEvent`** simula interações reais (digitar, clicar, tab), melhor que disparar eventos na mão.
- Variações: `getBy` (erro se não achar), `queryBy` (pra verificar que **não** existe), `findBy` (assíncrono, espera aparecer).
- **Não teste implementação**: nada de verificar estado interno ou chamar métodos do componente. Se você refatorar de `useState` pra `useReducer`, o teste **não deve quebrar**.

Runner: **Vitest** (rápido, integra com Vite) ou **Jest**, com ambiente **jsdom** simulando o navegador.

---

## 3. Simulando a API com MSW

Componentes que buscam dados precisam de respostas controladas no teste. Em vez de mockar o `fetch` ou o módulo de API, o **MSW** (*Mock Service Worker*) intercepta as requisições **na camada de rede**:

```js
const server = setupServer(
  http.get("/api/pedidos", () => HttpResponse.json([{ id: 1, total: 100 }])),
);
```

- O código do componente roda **igual à produção** (mesmo cliente HTTP, mesmo TanStack Query).
- Dá pra simular erro 500, lentidão, lista vazia.
- Os mesmos handlers servem pra **desenvolvimento** sem backend e pro **Storybook**.

---

## 4. O que testar em cada nível

| Nível | Ferramenta | O que cobre |
|---|---|---|
| **Estático** | TypeScript, ESLint | Erros de tipo e padrões proibidos, "de graça" |
| **Unitário** | Vitest | Funções puras, custom hooks (`renderHook`), reducers, formatadores |
| **Integração / componente** | Testing Library + MSW | Uma tela ou fluxo: renderiza, interage, verifica o resultado. **Onde está o maior valor em front** |
| **E2E** | **Playwright**, Cypress | Fluxos críticos no navegador real, com backend (login, checkout) |
| **Visual** | Storybook + testes de regressão visual | Mudanças de aparência não intencionais |

Muita gente no front prefere o **"troféu de testes"** à pirâmide clássica: poucos unitários, **muitos testes de integração** (componente + interação), alguns E2E, e a base estática. O motivo: a maioria dos bugs de UI está na **integração** das peças, não numa função isolada.

**Snapshot tests** (comparar a saída renderizada com um arquivo salvo) geram muitos falsos positivos e tendem a ser aprovados sem olhar; use com moderação.

---

## 5. Acessibilidade (a11y) na prática

### HTML semântico primeiro
- Use o elemento certo: **`<button>`** pra ações (não `<div onClick>`), **`<a href>`** pra navegação, `<nav>`, `<main>`, `<header>`, `<ul>/<li>`, **títulos em ordem** (`h1` → `h2` → `h3`).
- Um `<button>` já vem com foco, Enter/Espaço e papel de botão pro leitor de tela. Um `<div>` com `onClick` não tem nada disso.

### Formulários
- Todo campo com **`<label>`** associado (`htmlFor`/`id`, gerado com `useId`).
- Erros **associados** ao campo (`aria-describedby`) e anunciados (`role="alert"`).
- Não depender só de cor pra indicar erro.

### Teclado e foco
- Tudo que funciona com mouse deve funcionar com **teclado** (Tab, Enter, Esc, setas).
- **Foco visível** (não remover o outline sem colocar outro indicador).
- **Modais**: mover o foco pra dentro ao abrir, **prender o foco** enquanto aberto, fechar com Esc, **devolver o foco** ao botão que abriu. (Ou use o `<dialog>` nativo, ou componentes acessíveis prontos como Radix.)
- Em SPAs, ao trocar de página, mover o foco pro conteúdo novo ou anunciá-lo.

### ARIA com moderação
**ARIA** (atributos `role`, `aria-*`) descreve comportamento pra tecnologias assistivas quando o HTML não dá conta (abas, combobox, árvore). Primeira regra do ARIA: **se existe um elemento HTML nativo que faz isso, use ele**. ARIA errado é pior que nenhum.

### Outros
- Texto alternativo em imagens (`alt`); `alt=""` em imagens decorativas.
- **Contraste** suficiente (WCAG).
- Respeitar `prefers-reduced-motion` em animações.
- Ferramentas: **axe** (extensão e testes automatizados), Lighthouse, e testar de verdade com teclado e leitor de tela.

Padrão de referência: **WCAG** (níveis A, AA, AAA; o **AA** é o alvo comum).

---

## 6. Como falar na entrevista

**"Como você testa componentes React?"**
> "Com Testing Library e Vitest, testando como o usuário usa: renderizo, encontro os elementos por role e label, interajo com userEvent e verifico o que aparece na tela. Não testo implementação, então refatorar o estado não quebra o teste. A API eu simulo com MSW na camada de rede, pra o componente rodar igual a produção. O maior volume fica em testes de integração de componente, com alguns E2E no Playwright pros fluxos críticos, tipo login e checkout, e TypeScript e lint como base."

**"Que cuidados de acessibilidade você toma?"**
> "HTML semântico primeiro: button pra ação, link pra navegação, títulos em ordem, label em todo campo. Tudo funcionando com teclado e com foco visível; em modal, levo o foco pra dentro, prendo, fecho com Esc e devolvo o foco. ARIA só quando o HTML nativo não resolve. Verifico contraste e rodo o axe. E um bônus: componente acessível é mais fácil de testar, porque os testes encontram os elementos pelo papel, como o leitor de tela."

---

## 7. Resumo

- Teste **comportamento, não implementação**; teste frágil verifica detalhes internos.
- **Testing Library**: consultas por **role** e **label**, `userEvent`, `findBy` pra assíncrono; Vitest/Jest + jsdom.
- **MSW** simula a API na camada de rede (testes, dev, Storybook).
- Níveis: estático, unitário (funções, hooks), **integração** (maior valor), **E2E** (Playwright) pros fluxos críticos; snapshot com moderação.
- A11y: **HTML semântico**, labels, **teclado e foco** (modais!), **ARIA só quando necessário**, alt, contraste, reduced motion, axe. Alvo: **WCAG AA**.

## Termos desta aula
teste de comportamento · detalhe de implementação · React Testing Library · getByRole · nome acessível · getByLabelText · userEvent · queryBy · findBy · Vitest · Jest · jsdom · MSW · renderHook · teste de integração · E2E · Playwright · Cypress · Storybook · troféu de testes · snapshot · acessibilidade · a11y · HTML semântico · label · foco · focus trap · dialog · ARIA · role · aria-describedby · leitor de tela · contraste · WCAG · axe · Lei Brasileira de Inclusão

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 09** e separadas por nível.
