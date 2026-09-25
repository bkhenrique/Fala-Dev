# Aula 05 — Server Components vs Client Components

> **Objetivo:** entender o modelo mental mais importante do Next moderno: o que roda no servidor, o que roda no cliente, as regras da fronteira entre eles e como compor os dois.

---

## 1. Dois tipos de componente

### Server Components (padrão no App Router)
- Rodam **só no servidor** (no build ou na requisição).
- Podem ser **`async`** e fazer `await` direto.
- Acessam **banco, sistema de arquivos, segredos, APIs internas** diretamente.
- **O código deles não vai pro navegador** → não aumentam o bundle.
- **Não** podem usar: `useState`, `useEffect`, `onClick`, APIs do navegador (`window`, `localStorage`).

### Client Components (`"use client"`)
- Renderizam no servidor (para o HTML inicial) **e** são **hidratados** no navegador (aula 03).
- Podem usar **estado, efeitos, eventos, APIs do navegador**.
- O código **vai pro navegador** (aumenta o bundle).
- Não podem ser `async` nem acessar segredos do servidor.

> Atenção a um erro comum: "Client Component só roda no cliente". **Falso.** Ele também é pré-renderizado no servidor para gerar HTML. A diferença é que ele **também** é enviado e hidratado no cliente.

---

## 2. `"use client"` marca uma **fronteira**

```tsx
'use client';                              // primeira linha do arquivo
import { useState } from 'react';

export function BotaoCurtir() {
  const [curtido, setCurtido] = useState(false);
  return <button onClick={() => setCurtido(!curtido)}>{curtido ? '♥' : '♡'}</button>;
}
```

A diretiva `"use client"` não marca só aquele componente: marca a **fronteira** (*boundary*). **Tudo que esse arquivo importa** também vira parte do bundle do cliente.

Por isso a regra de ouro:

> **Empurre o `"use client"` para as folhas da árvore.** Deixe páginas e layouts como Server Components e transforme em client só as partes pequenas e interativas.

```
❌ Ruim                               ✅ Bom
'use client' na page inteira          page (Server)
  → tudo vai pro navegador              ├─ Descricao (Server)
                                        ├─ Avaliacoes (Server)
                                        └─ BotaoComprar (Client)  ← só isso vira JS
```

---

## 3. Regras da composição

### Server pode importar e renderizar Client ✅
```tsx
// page.tsx (Server)
import { BotaoCurtir } from './BotaoCurtir';
export default async function Post() {
  const post = await getPost();
  return <article>{post.texto}<BotaoCurtir postId={post.id} /></article>;
}
```

### Client **não** pode importar Server Component ❌…
Se um arquivo `"use client"` importar um Server Component, ele vira client (perde acesso ao banco etc.).

### …mas pode **receber** como `children` ou prop ✅
```tsx
// Modal.tsx
'use client';
export function Modal({ children }: { children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false);
  return aberto ? <div className="modal">{children}</div> : <button onClick={() => setAberto(true)}>Abrir</button>;
}

// page.tsx (Server)
<Modal>
  <DetalhesDoProduto />   {/* continua Server Component! */}
</Modal>
```
O Server Component é renderizado no servidor e passado já pronto como "buraco" para o Client. Esse padrão é essencial para usar providers de contexto (tema, React Query) sem transformar a aplicação inteira em client.

### Props do Server para o Client precisam ser **serializáveis**
Elas atravessam a rede (vão no RSC Payload). Pode: string, número, boolean, objeto/array simples, Date, Promise. **Não pode**: funções (exceto Server Actions), instâncias de classe, conexões.

---

## 4. Protegendo o que é do servidor

Risco: importar sem querer um módulo com segredo dentro de um Client Component e **vazar a chave no bundle**.

Proteções:
- Pacote **`server-only`**: `import 'server-only'` no topo de um módulo faz o **build falhar** se ele for importado no cliente.
- **Variáveis de ambiente**: só as com prefixo **`NEXT_PUBLIC_`** vão para o navegador (e são embutidas no build). As outras só existem no servidor. **Nunca** coloque segredo em `NEXT_PUBLIC_`.
- Passar para o client só os **campos necessários** (não o objeto inteiro do banco).

---

## 5. Contexto e bibliotecas de terceiros

- **React Context** só funciona em Client Components. Padrão: criar um `Providers.tsx` com `"use client"` e usar no layout envolvendo `{children}`. Os filhos continuam Server Components (regra do `children`).
- Biblioteca de terceiros que usa hooks mas não tem `"use client"`: crie um arquivo wrapper com `"use client"` que reexporta o componente.

---

## 6. Quando usar cada um

| Preciso de… | Tipo |
|---|---|
| Buscar dados, acessar banco/segredos | **Server** |
| Conteúdo estático, texto, listas, layout | **Server** |
| Reduzir JS no navegador | **Server** |
| `useState`, `useEffect`, `onClick`, `onChange` | **Client** |
| `window`, `localStorage`, geolocalização | **Client** |
| Context, bibliotecas de animação, gráficos interativos | **Client** |

Pense assim: **Server por padrão, Client por necessidade.**

---

## 7. Server Components vs SSR (não confunda!)

- **SSR** é **quando** o HTML é gerado (a cada requisição). É uma estratégia de renderização.
- **Server Components** é **qual código** roda só no servidor e **não é enviado** ao cliente. É um tipo de componente.

Um Server Component pode ser renderizado no **build** (estático) ou na **requisição** (dinâmico). E um Client Component também passa por SSR para gerar o HTML inicial. São eixos diferentes.

---

## 8. Como falar na entrevista

**"Qual a diferença entre Server e Client Components?"**
> "Server Components rodam só no servidor, podem ser async e acessar banco e segredos diretamente, e o código deles não vai pro navegador. Client Components, marcados com use client, também são pré-renderizados no servidor, mas são enviados e hidratados, então podem usar estado, efeitos e eventos. O use client marca uma fronteira: tudo que o arquivo importa entra no bundle. Por isso eu deixo páginas e layouts como Server e empurro o use client pras folhas interativas. Pra compor, passo Server Components como children pra Client Components, e as props entre eles precisam ser serializáveis. E não confundo com SSR: SSR é sobre quando o HTML é gerado; Server Component é sobre onde o código roda e se ele vai pro cliente."

---

## 9. Resumo

- **Server** (padrão): só servidor, `async`, banco/segredos, **zero JS** no cliente, sem hooks/eventos.
- **Client** (`"use client"`): pré-renderizado **e** hidratado; hooks, eventos, APIs do browser.
- `"use client"` = **fronteira**; empurre para as **folhas**.
- Client não importa Server, mas recebe como **children/props**.
- Props Server → Client: **serializáveis**.
- `server-only`, **`NEXT_PUBLIC_`** só para o que pode ser público.
- **Server Component ≠ SSR.**

## Termos desta aula
React Server Components · Server Component · Client Component · use client · fronteira · bundle · folhas da árvore · composição · children · serialização · RSC Payload · server-only · NEXT_PUBLIC_ · Context · Provider · wrapper

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 05** e separadas por nível.
