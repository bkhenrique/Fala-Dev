# Aula 09 — Performance e SEO: Core Web Vitals, imagens, fontes, bundle e metadata

> **Objetivo:** saber medir e melhorar a performance de uma aplicação Next, explicar as Core Web Vitals, e conhecer as ferramentas de SEO do framework.

---

## 1. Como medir performance

Performance web é medida pela **experiência do usuário**, não só pelo tempo do servidor. As métricas oficiais do Google são as **Core Web Vitals**:

| Métrica | O que mede | Bom |
|---|---|---|
| **LCP** – *Largest Contentful Paint* | Quanto tempo até o **maior elemento visível** (imagem de destaque, título grande) aparecer | ≤ 2,5 s |
| **INP** – *Interaction to Next Paint* | Quanto tempo a página demora pra **responder a uma interação** (clique, digitação) | ≤ 200 ms |
| **CLS** – *Cumulative Layout Shift* | Quanto o layout **"pula"** enquanto carrega | ≤ 0,1 |

> Em linguagem de gente: **carrega rápido? responde rápido? a tela fica parada?**

O INP substituiu o antigo **FID** (*First Input Delay*) em 2024. Outras métricas úteis: **TTFB** (tempo até o primeiro byte), **FCP** (primeira coisa pintada).

Ferramentas:
- **Lighthouse** / PageSpeed Insights: **dados de laboratório** (simulação).
- **CrUX** / Search Console / `useReportWebVitals` do Next: **dados de campo** (*RUM, Real User Monitoring*), de usuários reais. É o que o Google usa pra ranking.

---

## 2. Imagens: `next/image`

Imagens costumam ser o maior peso da página e o elemento do LCP.

```tsx
import Image from 'next/image';
<Image src="/hero.jpg" alt="Produto" width={1200} height={600} priority sizes="100vw" />
```

O que o componente faz:
- **Redimensiona** e serve o tamanho certo por dispositivo (`srcset` + `sizes`).
- Converte para formatos modernos (**WebP/AVIF**).
- **Lazy loading** por padrão: só carrega quando chega perto da tela.
- Exige `width`/`height` (ou `fill`) → reserva o espaço → **evita CLS**.
- `priority` na imagem principal (acima da dobra) → carrega cedo → **melhora LCP**.

Erro comum: colocar lazy loading na imagem do LCP (ela deveria carregar com prioridade).

---

## 3. Fontes: `next/font`

```ts
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });
```
- **Hospeda a fonte junto com a aplicação** (sem requisição para o Google em runtime, bom pra privacidade e velocidade).
- Ajusta métricas da fonte de fallback para **evitar CLS** quando a fonte real carrega.

---

## 4. JavaScript: menos é mais

JS é o recurso mais "caro": precisa baixar, fazer parse, executar e hidratar. Afeta diretamente o **INP**.

- **Server Components** por padrão; `"use client"` só nas folhas (aula 05).
- **Code splitting automático por rota**: cada página baixa só o próprio JS.
- **Lazy loading de componentes** pesados:
```tsx
const Grafico = dynamic(() => import('./Grafico'), { loading: () => <Skeleton /> });
```
- **Analisar o bundle**: `@next/bundle-analyzer` mostra quais libs pesam (ex: uma biblioteca de datas inteira por causa de uma função).
- Scripts de terceiros (analytics, chat) com `next/script` e `strategy="lazyOnload"` ou `afterInteractive`, pra não bloquear o carregamento.
- Evitar trabalho pesado no **main thread** do navegador durante interações (quebrar tarefas longas; `useTransition` para atualizações não urgentes).

---

## 5. Rede e servidor

- **Estático/ISR sempre que possível** → servido de **CDN**, TTFB baixíssimo.
- **Streaming com Suspense**: mostrar o que está pronto primeiro.
- **Evitar waterfalls** de dados (`Promise.all`, aula 06).
- **Prefetch** de links (automático com `<Link>`).
- Cache de dados e revalidação bem pensados.
- **Região** do servidor perto do banco (latência servidor↔banco pesa em toda query).

---

## 6. SEO no Next

**SEO** (*Search Engine Optimization*): fazer o site ser bem **encontrado e exibido** por buscadores e redes sociais.

O que o Next facilita:

### HTML renderizado no servidor
O conteúdo já vem no HTML (SSR/SSG/ISR), então robôs leem sem executar JS.

### Metadata API
```tsx
// estático
export const metadata = { title: 'Loja X', description: 'Os melhores produtos' };

// dinâmico
export async function generateMetadata({ params }) {
  const { id } = await params;
  const produto = await getProduto(id);
  return {
    title: produto.nome,
    description: produto.resumo,
    openGraph: { images: [produto.imagem] },   // preview no WhatsApp/LinkedIn
    alternates: { canonical: `/produtos/${id}` },
  };
}
```
- **Open Graph** / Twitter cards: título e imagem do preview ao compartilhar link.
- **Canonical**: diz qual é a URL "oficial" (evita conteúdo duplicado).

### Arquivos de SEO
- `app/sitemap.ts` → `/sitemap.xml` (lista de páginas pro buscador).
- `app/robots.ts` → `/robots.txt` (o que pode ou não ser rastreado).
- `opengraph-image.tsx` → gerar imagem de preview dinamicamente.

### Dados estruturados
**JSON-LD** (schema.org) com informações de produto, preço, avaliações → *rich results* no Google.

---

## 7. Como falar na entrevista

**"Como você melhoraria a performance de uma página Next?"**
> "Primeiro meço, com Lighthouse pra laboratório e dados de campo das Core Web Vitals: LCP, INP e CLS. Pra LCP, deixo a página estática ou ISR quando dá, uso next/image com priority na imagem principal e streaming com Suspense pras partes lentas. Pra INP, reduzo JavaScript: Server Components por padrão, use client só nas folhas, dynamic import de componentes pesados, bundle analyzer pra achar libs grandes e next/script pra terceiros. Pra CLS, next/image com dimensões e next/font. E no servidor, evito waterfall de dados com Promise.all."

---

## 8. Resumo

- **Core Web Vitals**: **LCP** (carregar), **INP** (responder), **CLS** (estabilidade).
- Laboratório (Lighthouse) × campo (RUM/CrUX).
- **`next/image`**: tamanho certo, WebP/AVIF, lazy, dimensões (CLS), `priority` (LCP).
- **`next/font`**: self-host, sem CLS.
- Menos JS: Server Components, code splitting, `dynamic()`, bundle analyzer, `next/script`.
- Estático + CDN, streaming, sem waterfall.
- SEO: HTML do servidor, **Metadata API**, Open Graph, canonical, sitemap, robots, JSON-LD.

## Termos desta aula
Core Web Vitals · LCP · INP · CLS · FID · TTFB · FCP · Lighthouse · RUM · CrUX · next/image · srcset · WebP · AVIF · lazy loading · priority · next/font · code splitting · dynamic import · bundle analyzer · next/script · main thread · useTransition · CDN · SEO · Metadata API · generateMetadata · Open Graph · canonical · sitemap · robots.txt · JSON-LD · rich results

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 09** e separadas por nível.
