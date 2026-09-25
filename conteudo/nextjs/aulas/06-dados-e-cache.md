# Aula 06 — Busca de dados e Cache

> **Objetivo:** saber buscar dados no App Router, entender as camadas de cache do Next, o que torna uma rota estática ou dinâmica, e como revalidar. É o assunto que mais confunde, então foco nos **conceitos**, que valem para qualquer versão.

> ⚠️ O **comportamento padrão** do cache mudou entre versões: no Next 14 o `fetch` era cacheado por padrão; no **15** deixou de ser; no **16** surgiu o modelo **Cache Components** com a diretiva `'use cache'`. Sempre confira a versão do projeto. Em entrevista, dizer isso já mostra maturidade.

---

## 1. Buscando dados em Server Components

```tsx
export default async function Pedidos() {
  const pedidos = await db.pedido.findMany();          // direto no banco
  const clima = await fetch('https://api.clima.com/sp').then(r => r.json());
  return <Lista pedidos={pedidos} clima={clima} />;
}
```

Sem `useEffect`, sem loading manual, sem criar endpoint só pra alimentar o próprio front.

### Evite waterfalls
```tsx
// ❌ sequencial: 300ms + 300ms
const usuario = await getUsuario();
const pedidos = await getPedidos();

// ✅ paralelo: ~300ms
const [usuario, pedidos] = await Promise.all([getUsuario(), getPedidos()]);
```
Ou separe em componentes com `<Suspense>` próprio, e cada um carrega e aparece **independente** (streaming).

---

## 2. As camadas de cache (visão conceitual)

| Camada | Onde | O que guarda | Pra que |
|---|---|---|---|
| **Request Memoization** | Servidor, durante **uma** renderização | Resultado de chamadas iguais | Não repetir o mesmo fetch em vários componentes da mesma página |
| **Data Cache** | Servidor, **persistente** entre requisições | Resultado de `fetch`/funções | Não ir na API/banco toda requisição |
| **Full Route Cache** | Servidor | HTML + RSC Payload de rotas **estáticas** | Servir a página pronta (SSG/ISR) |
| **Router Cache** | **Navegador**, em memória | RSC Payload das rotas visitadas/prefetch | Navegação instantânea (voltar/avançar) |

### Request Memoization
Se `Header` e `Page` chamam `getUsuario()` na mesma renderização, a chamada acontece **uma vez**. Para `fetch` é automático; para funções (ex: query no banco) use `cache()` do React:
```ts
import { cache } from 'react';
export const getUsuario = cache(async (id: string) => db.usuario.findUnique({ where: { id } }));
```
Por isso é aceitável buscar o mesmo dado em vários componentes, sem precisar passar por props (*prop drilling*).

### Data Cache (controle no `fetch`)
```ts
fetch(url, { cache: 'force-cache' });            // cacheia
fetch(url, { cache: 'no-store' });               // nunca cacheia (sempre fresco)
fetch(url, { next: { revalidate: 60 } });        // cacheia por 60s (ISR)
fetch(url, { next: { tags: ['produtos'] } });    // etiqueta pra invalidar depois
```
Para dados que não vêm de `fetch` (ORM), usa-se `unstable_cache` ou, no modelo novo, `'use cache'`.

---

## 3. Rota estática vs dinâmica

O Next decide, no build, se a rota pode ser **estática** (gerada uma vez, Full Route Cache) ou precisa ser **dinâmica** (renderizada por requisição).

A rota vira **dinâmica** quando usa algo que só existe **na requisição**:
- `cookies()`, `headers()` (em versões recentes, são assíncronas: `await cookies()`).
- `searchParams`.
- `fetch` com `cache: 'no-store'` (ou sem cache, no padrão das versões novas).
- `export const dynamic = 'force-dynamic'`.

Configurações de segmento úteis:
```ts
export const revalidate = 3600;           // ISR da rota inteira
export const dynamic = 'force-static';    // forçar estático
export const dynamic = 'force-dynamic';   // forçar dinâmico
```

No build (`next build`), o terminal mostra cada rota como **estática** (○), **SSG** (●) ou **dinâmica** (ƒ). Olhar isso é o jeito de conferir se a decisão ficou como você queria.

---

## 4. Revalidação

**Revalidar** = descartar o cache e buscar/gerar de novo.

- **Por tempo**: `revalidate: 60` → stale-while-revalidate (aula 02).
- **Sob demanda**, depois de uma mutação ou via webhook:
```ts
revalidatePath('/produtos');          // invalida uma rota
revalidateTag('produtos');            // invalida todo fetch etiquetado com 'produtos'
```

Revalidar por **tag** é mais preciso: o mesmo dado (produtos) pode aparecer em várias páginas (home, categoria, busca), e uma tag invalida todas.

> Invalidação de cache é famosamente difícil ("existem só duas coisas difíceis em computação: invalidação de cache e dar nome às coisas"). O ideal é **atrelar a invalidação ao evento que muda o dado** (a Server Action de editar produto chama `revalidateTag('produtos')`).

---

## 5. Streaming com Suspense

```tsx
export default function Pagina() {
  return (
    <>
      <Cabecalho />                                   {/* aparece na hora */}
      <Suspense fallback={<SkeletonRecomendacoes />}>
        <Recomendacoes />                             {/* componente async lento */}
      </Suspense>
    </>
  );
}
```

O servidor manda o HTML em **partes**: primeiro o que está pronto e o *fallback*; quando `Recomendacoes` termina, o pedaço é enviado **na mesma resposta** e substitui o skeleton. O usuário vê algo útil muito antes. `loading.tsx` é um atalho para um Suspense na página inteira.

---

## 6. Dados no cliente

Quando a busca precisa ser no cliente (dado que muda enquanto o usuário está na tela, paginação infinita, polling):
- **TanStack Query** ou **SWR**: cache no cliente, revalidação, retry, deduplicação.
- Evite `useEffect` + `fetch` na mão para tudo: você reimplementa cache, loading, erro e race condition.

Padrão comum: buscar os dados iniciais no **Server Component** e passar como `initialData` para o cliente continuar atualizando.

---

## 7. Como falar na entrevista

**"Como funciona o cache no Next?"**
> "Conceitualmente tem quatro camadas: request memoization, que deduplica chamadas iguais numa mesma renderização; o data cache, que persiste resultados de fetch entre requisições; o full route cache, que guarda o HTML e o payload de rotas estáticas; e o router cache no navegador, pra navegação instantânea. A rota vira dinâmica quando usa cookies, headers, searchParams ou dados sem cache. Pra atualizar, revalido por tempo ou sob demanda com revalidatePath ou revalidateTag, de preferência amarrado à mutação que alterou o dado. E vale lembrar que os padrões mudaram entre versões: no 15 o fetch deixou de ser cacheado por padrão, e no 16 veio o modelo com 'use cache'."

---

## 8. Resumo

- Server Components buscam dados com `await`, direto no banco/API.
- Evite **waterfall**: `Promise.all` ou `Suspense` separados.
- Camadas: **Request Memoization**, **Data Cache**, **Full Route Cache**, **Router Cache**.
- `cache()` do React para deduplicar funções.
- Dinâmica quando usa **cookies/headers/searchParams/no-store**.
- **Revalidação**: tempo (`revalidate`) ou on-demand (`revalidatePath`, **`revalidateTag`**).
- **Streaming** com `Suspense`.
- Cliente: **TanStack Query / SWR**.
- Os **padrões** de cache mudaram entre versões: conferir sempre.

## Termos desta aula
data fetching · waterfall · Promise.all · request memoization · data cache · full route cache · router cache · cache() · prop drilling · force-cache · no-store · revalidate · tags · unstable_cache · use cache · Cache Components · rota estática · rota dinâmica · cookies() · headers() · force-dynamic · revalidatePath · revalidateTag · invalidação de cache · streaming · Suspense · fallback · TanStack Query · SWR

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 06** e separadas por nível.
