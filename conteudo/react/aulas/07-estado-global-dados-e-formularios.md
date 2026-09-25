# Aula 07 — Estado global, dados do servidor e formulários

> **Objetivo:** saber classificar o estado de uma aplicação (UI, servidor, URL, global) e escolher a ferramenta certa pra cada tipo: TanStack Query pra dados do servidor, Context ou stores (Zustand, Redux) pro estado global, query string pra filtros, e React Hook Form + Zod pra formulários.

---

## 1. O problema

"Qual biblioteca de estado você usa?" é pergunta clássica, e a resposta madura começa com **"depende do tipo de estado"**. Muitos projetos antigos colocavam **tudo** num Redux gigante: dados da API, modal aberto, formulário, filtros. Isso gerava muito código repetitivo (*boilerplate*) e bugs de sincronização: o dado no Redux ficava velho em relação ao servidor.

A virada de chave: **dado vindo do servidor não é "estado da aplicação"**, é um **cache** de algo que mora em outro lugar.

---

## 2. Os tipos de estado

| Tipo | Exemplo | Onde guardar |
|---|---|---|
| **UI local** | Modal aberto, aba ativa, texto digitado | `useState` / `useReducer` no componente |
| **Servidor** | Lista de pedidos, perfil vindo da API | **TanStack Query / SWR**, ou buscar no servidor (Server Components) |
| **URL** | Filtros, página, busca, aba selecionada | **Query string** (`?status=pago&pagina=2`) |
| **Global de cliente** | Usuário logado, tema, carrinho, preferências | **Context** (muda pouco) ou **store** (Zustand, Redux Toolkit) |
| **Formulário** | Valores, erros, "enviando" | **React Hook Form** (ou `useActionState` com Server Actions) |

Muitas vezes, depois de separar o estado de servidor e o da URL, **sobra muito pouco** estado global.

---

## 3. Estado de servidor: TanStack Query

Buscar dados na mão com `useEffect` (aula 04) obriga você a reimplementar: loading, erro, cache, evitar requisições duplicadas, atualizar quando o dado fica velho, retry, paginação, invalidar depois de uma alteração. O **TanStack Query** (antigo React Query) resolve isso:

```jsx
function usePedidos(status) {
  return useQuery({
    queryKey: ["pedidos", status],          // identidade do dado no cache
    queryFn: () => api.listarPedidos(status),
    staleTime: 30_000,                      // considera fresco por 30 s
  });
}

const { data, isPending, error } = usePedidos("pago");

const criar = useMutation({
  mutationFn: api.criarPedido,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pedidos"] }),   // refaz a lista
});
```

O que ele dá:
- **Cache** por `queryKey`: dois componentes pedindo a mesma chave fazem **uma** requisição (**deduplicação**).
- **Stale-while-revalidate**: mostra o dado em cache na hora e atualiza em segundo plano quando ele fica "velho" (*stale*), ao focar a janela, ao reconectar.
- **Retry** com backoff, **paginação**, **scroll infinito**, **prefetch**.
- **Mutations** com **invalidação** do que mudou, e **atualização otimista** (mostra o resultado antes de o servidor confirmar e desfaz se falhar).

O **SWR** (da Vercel) é uma alternativa mais simples com a mesma ideia.

Com frameworks como o Next, parte disso vai pro **servidor** (Server Components buscam direto), e o TanStack Query fica pro que é interativo no cliente (polling, scroll infinito, dados que mudam enquanto o usuário está na tela).

---

## 4. Estado na URL

Filtros, busca, paginação e abas quase sempre deveriam estar na **URL**:
- O usuário pode **compartilhar** o link e cair no mesmo filtro.
- **Voltar** e **avançar** do navegador funcionam.
- Sobrevive ao **F5**.

Os roteadores e frameworks dão hooks pra ler e escrever a query string (ex.: `useSearchParams`). Bibliotecas como **nuqs** tipam e simplificam esse uso.

---

## 5. Estado global de cliente: Context, Zustand, Redux

### Context
Bom pra valores globais que **mudam pouco** (tema, idioma, usuário). Limitação: quando o value muda, **todos** os consumidores re-renderizam, e não dá pra assinar só uma parte (aula 05).

### Zustand
Store pequena, sem Provider e sem boilerplate, com **seletores**:
```jsx
const useCarrinho = create((set) => ({
  itens: [],
  adicionar: (item) => set((s) => ({ itens: [...s.itens, item] })),
}));

const quantidade = useCarrinho((s) => s.itens.length);   // re-renderiza só quando a quantidade muda
```

### Redux (Redux Toolkit)
- Store única, estado alterado por **ações** processadas por **reducers** puros (o mesmo padrão do `useReducer`).
- **Redux Toolkit** é a forma moderna (bem menos código que o Redux antigo), com **RTK Query** pra dados do servidor.
- Pontos fortes: **previsibilidade**, **DevTools** com histórico das ações (*time-travel debugging*), padrão conhecido em times grandes.
- Custo: mais estrutura. Faz sentido quando o estado de cliente é **grande e complexo**, com muitas regras.

Resposta madura: "separo estado de servidor (TanStack Query) e de URL; o pouco estado global que sobra fica em Context se muda pouco, ou em Zustand se muda muito ou precisa de seletores. Redux eu uso quando o estado de cliente é grande e o time se beneficia do padrão e das DevTools."

---

## 6. Formulários

Formulários parecem simples até precisarem de validação, erros por campo, máscaras, campos dinâmicos e performance.

- **Controlado** (`value` + `onChange` com `useState`): simples, mas re-renderiza o formulário a cada tecla. Ok para formulários pequenos.
- **React Hook Form**: usa inputs **não controlados** por baixo (registra os campos via ref), então re-renderiza muito menos; gerencia erros, estado de envio e campos dinâmicos.
- **Validação com schema**: **Zod** define o formato uma vez e serve tanto pro formulário (`zodResolver`) quanto pra **validar de novo no servidor**. A validação do front é **experiência do usuário**; a do servidor é **segurança**. As duas são necessárias.

```jsx
const schema = z.object({ email: z.string().email(), senha: z.string().min(8) });
const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
```

Com React 19 e frameworks, formulários também podem usar **Actions** (`<form action={...}>`, `useActionState`, `useFormStatus`), com melhoria progressiva (aula 08).

---

## 7. Como falar na entrevista

**"Qual gerenciador de estado você usa?"**
> "Depende do tipo de estado. Dado do servidor eu trato como cache, com TanStack Query: ele dá deduplicação, stale-while-revalidate, retry e invalidação depois de mutations, coisa que com useEffect eu teria que reimplementar. Filtros e paginação vão na URL, pra poder compartilhar o link e o voltar do navegador funcionar. O que sobra de estado global de cliente, tipo usuário e tema, fica em Context se muda pouco, ou em Zustand quando muda muito e preciso de seletores. Redux faz sentido quando o estado de cliente é grande e complexo e o time se beneficia do padrão."

**"Como você faz formulários em React?"**
> "Pra formulário simples, controlado com useState. Pra formulário maior, React Hook Form, que usa inputs não controlados e re-renderiza bem menos, com validação por schema no Zod. O mesmo schema valida de novo no servidor, porque validação no front é experiência do usuário, e segurança é no backend."

---

## 8. Resumo

- Classifique: **UI local**, **servidor**, **URL**, **global**, **formulário**.
- Dado do servidor é **cache**: **TanStack Query** (queryKey, deduplicação, stale-while-revalidate, retry, mutations com invalidação, otimista) ou SWR; no Next, parte vai pro servidor.
- **URL** pra filtros e paginação: compartilhável, voltar/avançar, sobrevive ao F5.
- Global: **Context** (muda pouco), **Zustand** (seletores, simples), **Redux Toolkit** (estado grande e complexo, DevTools, RTK Query).
- Formulários: controlado (simples) × **React Hook Form** (não controlado, performance) + **Zod**; validar no front **e** no servidor.

## Termos desta aula
estado de UI · estado de servidor · estado da URL · estado global · boilerplate · TanStack Query · React Query · SWR · queryKey · cache · deduplicação · stale-while-revalidate · staleTime · mutation · invalidação · atualização otimista · prefetch · query string · useSearchParams · Context · Zustand · seletor · Redux · Redux Toolkit · RTK Query · reducer · time-travel debugging · React Hook Form · Zod · zodResolver · validação no servidor

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 07** e separadas por nível.
