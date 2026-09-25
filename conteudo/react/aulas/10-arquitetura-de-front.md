# Aula 10 — Arquitetura de front-end com React

> **Objetivo:** saber organizar uma aplicação React que cresce: estrutura de pastas por funcionalidade, TypeScript, camada de acesso à API, componentes de UI e design system, estilos, tratamento de erros, ferramentas de build, e quando usar SPA ou um framework.

---

## 1. O problema

Um app React pequeno funciona com qualquer organização. Com 10 devs e 200 telas, aparecem os sintomas: componentes de 800 linhas, `fetch` espalhado por todo lado, três versões do mesmo botão, pastas `components/` com 300 arquivos soltos, e medo de mexer em qualquer coisa.

Arquitetura de front é sobre **manter o código fácil de mudar**: fronteiras claras, responsabilidades separadas e padrões que o time todo segue.

---

## 2. SPA ou framework?

| | SPA (Vite + React Router) | Framework (Next.js, React Router em modo framework) |
|---|---|---|
| Renderização | No cliente | Servidor, estático, streaming, cliente |
| SEO e primeiro carregamento | Mais fracos | Fortes |
| Backend | Separado | Pode ter BFF no mesmo projeto |
| Infra | Arquivos estáticos em qualquer CDN | Servidor/plataforma pra partes dinâmicas |
| Bom para | Painel interno logado, ferramenta, app atrás de login | Sites públicos, e-commerce, conteúdo, produtos que precisam de SEO |

O **Create React App** foi descontinuado; hoje uma SPA nova começa com **Vite**, e a documentação oficial do React recomenda começar com um framework quando o projeto precisa de roteamento e busca de dados.

---

## 3. Estrutura de pastas por funcionalidade

Em vez de separar por **tipo técnico** (`components/`, `hooks/`, `services/`, cada um com centenas de arquivos), separe por **funcionalidade** (*feature*):

```
src/
├── app/                 ← rotas, layout, providers (QueryClient, tema)
├── features/
│   ├── pedidos/
│   │   ├── components/  ← ListaPedidos, CardPedido
│   │   ├── hooks/       ← usePedidos, useCriarPedido
│   │   ├── api.ts       ← chamadas HTTP da feature
│   │   ├── schemas.ts   ← Zod: validação e tipos
│   │   └── index.ts     ← o que a feature expõe pro resto do app
│   └── clientes/
├── shared/
│   ├── ui/              ← Button, Input, Modal (design system)
│   ├── lib/             ← cliente HTTP, formatadores, utilitários
│   └── hooks/           ← useDebounce, useMediaQuery
└── ...
```

- **Colocation**: o que muda junto fica junto.
- Cada feature expõe uma **API pública** (`index.ts`) e as outras não importam arquivos internos dela. Dá pra reforçar com regras de lint de importação.
- `shared/` não importa de `features/` (dependência só num sentido).

É a mesma ideia de **módulos com fronteiras** do backend (monolito modular).

---

## 4. Separar UI, lógica e dados

Um componente saudável **não faz tudo**:
- **Componentes de UI** desenham a partir de props (fáceis de reaproveitar e de colocar no Storybook).
- **Custom hooks** concentram lógica e estado (`usePedidos`, `useCarrinho`).
- **Camada de API** (`api.ts`) sabe falar com o backend: URLs, headers, conversão de dados. O componente **nunca** monta URL nem chama `fetch` direto.

Benefícios: trocar a API (REST pra GraphQL, mudar um endpoint) mexe num lugar só; testes simulam a camada certa; componentes ficam curtos.

### Validar o que vem da API
A resposta do servidor é **dado externo**. Validar com **Zod** na borda (ou gerar tipos a partir do **OpenAPI** do backend) evita que um campo que mudou quebre a tela silenciosamente em outro lugar.

---

## 5. TypeScript com React

Hoje é o padrão de mercado:
- Tipar **props** dos componentes (e usar `ComponentProps<"button">` pra estender elementos nativos).
- **Tipos derivados** do schema (`z.infer<typeof schema>`) ou do contrato da API, em vez de escrever tipos à mão em dois lugares.
- **Unions discriminadas** pra estados que não podem se misturar:
```ts
type Estado =
  | { status: "carregando" }
  | { status: "erro"; mensagem: string }
  | { status: "sucesso"; dados: Pedido[] };
```
Assim é impossível ter "sucesso sem dados" ou "erro sem mensagem".

---

## 6. Design system e estilos

- Um **design system** é o conjunto de **componentes base** (botão, input, modal, tabela), **tokens** (cores, espaçamentos, tipografia) e regras de uso. Evita "três botões diferentes" e acelera telas novas.
- Componentes **acessíveis** prontos, sem estilo (*headless*), como **Radix**, estilizados pelo time. O **shadcn/ui** popularizou copiar esses componentes pro próprio projeto.
- **Storybook** pra documentar e desenvolver componentes isolados.
- Estilos: **Tailwind** (classes utilitárias, muito usado hoje), **CSS Modules** (escopo por arquivo), CSS-in-JS em runtime (styled-components) perdeu espaço por custo de performance e por não combinar com Server Components.

---

## 7. Erros, loading e resiliência na UI

- **Error Boundaries** por região da tela: um widget quebrado não derruba a página inteira.
- Estados **explícitos** de carregamento (skeleton), vazio e erro, com opção de tentar de novo.
- Reportar erros do front pra uma ferramenta (Sentry) com contexto (usuário, rota, versão).
- **Feature flags** pra liberar funcionalidades aos poucos.

---

## 8. Ferramentas de build

- **Vite**: servidor de desenvolvimento muito rápido (serve módulos ES nativos) e build de produção otimizado.
- **Bundler**: junta os módulos, faz **tree shaking** (remove código não usado), **code splitting** e minificação.
- Ferramentas modernas escritas em linguagens rápidas (**SWC**, **esbuild**, **Turbopack**, **Rolldown**) substituem o Babel e o Webpack em muitos projetos.
- **Monorepo** (pnpm workspaces, Turborepo, Nx) quando vários apps compartilham o design system e os tipos.

---

## 9. Como falar na entrevista

**"Como você organiza um projeto React grande?"**
> "Por funcionalidade em vez de por tipo técnico: cada feature tem seus componentes, hooks, chamadas de API e schemas, e expõe só uma API pública pro resto do app. Separo UI, lógica e dados: componentes de apresentação, custom hooks com a lógica, e uma camada de API, então componente nunca chama fetch direto. Dados do servidor com TanStack Query, respostas validadas com Zod, TypeScript com tipos derivados dos schemas e unions discriminadas pros estados. Um design system com componentes acessíveis e Storybook, e Error Boundaries por região."

**"SPA ou Next.js?"**
> "Depende de SEO e de primeiro carregamento. Um painel interno atrás de login funciona muito bem como SPA com Vite: é só arquivo estático e o backend é separado. Site público, e-commerce ou qualquer coisa que dependa de SEO e performance inicial eu faria com um framework como o Next, pela renderização no servidor e estática e pela possibilidade de ter um BFF junto."

---

## 10. Resumo

- Arquitetura de front = **manter fácil de mudar** com fronteiras e padrões.
- **SPA com Vite** (painel interno) × **framework** (SEO, performance inicial, BFF). CRA foi descontinuado.
- Pastas **por feature**, colocation, **API pública** por feature, dependência num sentido só.
- Separar **UI**, **lógica (custom hooks)** e **dados (camada de API)**; validar resposta da API (Zod/OpenAPI).
- **TypeScript**: props tipadas, tipos derivados de schema, **unions discriminadas**.
- **Design system**, componentes headless acessíveis (Radix, shadcn/ui), Storybook; Tailwind ou CSS Modules.
- **Error Boundaries** por região, estados de loading/vazio/erro, Sentry, feature flags.
- Build: **Vite**, tree shaking, code splitting, ferramentas rápidas (SWC, esbuild); monorepo quando há vários apps.

## Termos desta aula
arquitetura de front-end · SPA · framework · Vite · Create React App · React Router · estrutura por feature · colocation · API pública · camada de API · custom hook · validação de resposta · Zod · OpenAPI · TypeScript · union discriminada · design system · tokens · headless · Radix · shadcn/ui · Storybook · Tailwind · CSS Modules · CSS-in-JS · Error Boundary · Sentry · feature flag · bundler · tree shaking · code splitting · SWC · esbuild · monorepo

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 10** e separadas por nível.
