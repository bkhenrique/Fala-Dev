# Aula 10 — Runtimes, Build e Deploy

> **Objetivo:** entender o que acontece no `next build`, a diferença entre os runtimes Node e Edge, as opções de deploy (Vercel, self-hosting, Docker, export estático) e as variáveis de ambiente.

---

## 1. O que o `next build` faz

```
next build
 ├─ compila TypeScript/JSX (Turbopack, bundler padrão no Next 16; antes, Webpack)
 ├─ separa o código de servidor e de cliente
 ├─ divide o JS por rota (code splitting)
 ├─ pré-renderiza as rotas ESTÁTICAS (SSG) → HTML + RSC Payload
 └─ gera o relatório: ○ estática  ● SSG  ƒ dinâmica
```

Depois, `next start` sobe o servidor Node de produção.

Olhar o relatório do build é um hábito importante: mostra se uma página que você queria estática virou dinâmica sem querer (porque alguém usou `cookies()` num layout, por exemplo).

---

## 2. Runtimes: Node vs Edge

O código de servidor do Next pode rodar em dois ambientes:

| | **Node.js runtime** (padrão) | **Edge runtime** |
|---|---|---|
| APIs | Node completo (`fs`, `crypto`, drivers de banco, qualquer lib npm) | Subconjunto de **Web APIs** (`fetch`, `Request`, `Response`) |
| Onde roda | Servidor/região específica | Muitas localizações **perto do usuário** |
| Cold start | Maior | Muito baixo |
| Limites | Poucos | Tamanho de código, sem várias libs de Node |

**Edge** faz sentido para lógica **leve e sensível à latência** perto do usuário: redirecionamentos, geolocalização, testes A/B.

Mas atenção: se a função no edge precisa consultar um banco que está em **uma** região, ela pode ficar **mais lenta** (a distância até o banco é que pesa). Por isso, para a maioria das páginas e APIs com banco, **Node runtime na mesma região do banco** é a melhor escolha. O próprio Next tem movido o padrão de volta para Node em vários lugares.

---

## 3. Opções de deploy

### Vercel
Criadora do Next. Deploy com `git push`, CDN global, ISR, preview por PR, tudo configurado.
- ✅ Zero configuração, todos os recursos funcionam.
- ❌ Custo pode crescer com escala; dependência de fornecedor (**vendor lock-in**).

### Self-hosting com Node
`next build && next start` em qualquer servidor/VM/container.
- Suporta todos os recursos, mas **você** cuida de: CDN na frente, cache compartilhado entre instâncias (o cache de ISR em disco é **por instância**; com várias réplicas, configure um **cache handler** compartilhado, ex: Redis), escala, logs.

### Docker
```js
// next.config.js
module.exports = { output: 'standalone' };
```
`standalone` gera uma pasta com só os arquivos necessários (incluindo um `server.js` mínimo e só as dependências usadas) → imagem Docker **muito menor**. Base pra rodar em Kubernetes, ECS, Cloud Run.

### Export estático
```js
module.exports = { output: 'export' };
```
Gera **só HTML/CSS/JS** estáticos, hospedáveis em S3, GitHub Pages, qualquer CDN.
- ❌ Perde tudo que precisa de servidor: SSR, Server Actions, Route Handlers dinâmicos, ISR, middleware, otimização de imagem padrão.
- ✅ Custo mínimo e simplicidade. Bom pra site institucional/documentação.

### Outras plataformas
Netlify, AWS Amplify, Cloudflare (via adaptadores como **OpenNext**).

---

## 4. Variáveis de ambiente

- **Sem prefixo** (`DATABASE_URL`, `OPENAI_API_KEY`): só existem **no servidor**.
- **`NEXT_PUBLIC_`** (`NEXT_PUBLIC_API_URL`): vão pro navegador e são **embutidas no JS no momento do build**.

Consequência importante: como as `NEXT_PUBLIC_` são embutidas **no build**, se você usa a **mesma imagem Docker** em staging e produção, ela terá o valor do momento em que foi construída. Mudar a variável no ambiente depois **não** muda o que está no bundle. Soluções: build por ambiente, ou ler a config no servidor e passar para o cliente.

Arquivos: `.env`, `.env.local` (não commitar), `.env.production`, `.env.development`.

---

## 5. Observabilidade e operação

- **Logs** do servidor (Server Components, actions, handlers): estruturados, com correlation id.
- **`instrumentation.ts`**: arquivo pra inicializar **OpenTelemetry**/APM quando o servidor sobe.
- **Erros**: Sentry ou similar, no servidor e no cliente (`error.tsx` pode reportar).
- **Web Vitals** de usuários reais (aula 09).
- **Health check** simples via Route Handler para o load balancer.

---

## 6. Como falar na entrevista

**"Como você faria deploy de uma aplicação Next fora da Vercel?"**
> "Uso output standalone pra gerar uma imagem Docker enxuta e rodo em containers, por exemplo em ECS ou Kubernetes, com uma CDN na frente pros assets estáticos. Com várias réplicas, configuro um cache handler compartilhado, tipo Redis, porque o cache de ISR em disco é por instância. Rodo no runtime Node, na mesma região do banco, e deixo edge só pra coisas leves como redirecionamento. E cuido das variáveis NEXT_PUBLIC_, que são embutidas no build, então a imagem precisa ser construída com os valores certos do ambiente."

---

## 7. Resumo

- `next build`: compila, separa servidor/cliente, code splitting, pré-renderiza estáticas, relatório ○ ● ƒ.
- **Node runtime** (completo, padrão) vs **Edge** (Web APIs, perto do usuário, leve). Banco longe do edge = lento.
- Deploy: **Vercel** (tudo pronto, lock-in), **self-host Node**, **Docker `standalone`**, **export estático** (sem servidor).
- Várias réplicas → **cache handler compartilhado**.
- **`NEXT_PUBLIC_`** vai pro cliente e é embutida **no build**.
- Observabilidade: logs, `instrumentation.ts` (OpenTelemetry), Sentry, Web Vitals.

## Termos desta aula
next build · next start · Turbopack · Webpack · bundler · Node runtime · Edge runtime · Web APIs · cold start · latência · região · Vercel · vendor lock-in · self-hosting · Docker · output standalone · output export · cache handler · OpenNext · variáveis de ambiente · NEXT_PUBLIC_ · build time · instrumentation · OpenTelemetry · Sentry · health check

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 10** e separadas por nível.
