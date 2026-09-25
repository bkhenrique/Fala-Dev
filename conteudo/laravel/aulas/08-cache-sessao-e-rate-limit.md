# Aula 08 — Cache, sessão e rate limiting

> **Objetivo:** escolher onde guardar dados temporários, proteger sessões e limitar tráfego sem criar inconsistência ou gargalos escondidos.

---

## 1. Cache acelera leitura, não é fonte da verdade

Cache armazena um resultado por um período para evitar recalcular ou consultar origem repetidamente. Laravel abstrai drivers como memória local, arquivo, banco, Redis e Memcached. A API parecida não torna o comportamento operacional dos drivers idêntico.

**Cache-aside** é um padrão comum: consultar cache, buscar banco em caso de ausência e guardar o resultado com TTL. A pergunta difícil é invalidação: quando o dado muda, quais chaves ficam velhas e por quanto tempo isso é aceitável?

## 2. Chaves, TTL e invalidação

Chaves devem incluir dimensão que afeta o resultado: tenant, idioma, papel, filtro ou versão do esquema. Uma chave genérica como `dashboard` pode vazar dados de um usuário para outro.

TTL limita quanto uma entrada antiga sobrevive, mas não garante atualização imediata. Invalidar no write, usar versão na chave ou aceitar stale-while-revalidate são políticas diferentes. Tags ajudam a invalidar grupos em drivers compatíveis, com custo e suporte que precisam ser verificados.

## 3. Cache::remember e stampede

`Cache::remember()` consulta e preenche a chave se necessário. Se uma chave muito popular expira, várias requisições podem consultar a origem ao mesmo tempo: **cache stampede**. Um lock compartilhado ou renovação antecipada pode reduzir esse pico.

Locks distribuídos dependem do driver e do tempo de lease. Se a operação passar do prazo, outro worker pode entrar; proteja o resultado com idempotência ou fencing quando a exclusão precisa ser forte.

## 4. Sessão

Sessão guarda estado de um usuário entre requisições HTTP. Drivers comuns incluem arquivo, database e Redis; a escolha depende de quantidade de instâncias, latência e requisitos de durabilidade. O ID costuma viajar num cookie, enquanto os dados ficam no servidor.

Sessão não é substituto de banco para entidades duráveis. Armazenar payloads grandes ou sessões sem expiração aumenta custo. Sessões compartilhadas entre réplicas precisam de armazenamento comum; arquivos locais só funcionam quando roteamento e infraestrutura garantem consistência.

## 5. Cookies e segurança

Cookie `HttpOnly` impede acesso via JavaScript comum; `Secure` limita envio a HTTPS; `SameSite` controla envio em contextos cross-site. Esses atributos complementam token CSRF e políticas da aplicação.

Não armazene informação que o cliente pode alterar sem assinatura e validação. Mesmo cookies assinados continuam visíveis, e criptografia não substitui autorização por recurso.

## 6. Rate limiting

Rate limit limita operações por chave e janela, por exemplo usuário, IP, tenant ou token. Laravel pode guardar contadores num cache compartilhado. Limite por IP protege uma porta de entrada, mas usuários atrás de proxy ou NAT podem compartilhar endereço; combine dimensões conforme o risco.

Use limites mais estritos para login, recuperação de senha e chamadas custosas. Responda com status e `Retry-After` coerentes. Em sistema com várias instâncias, cache local não mantém um contador global confiável.

## 7. Cache não deve ocultar autorização

Sempre estabeleça autorização antes de retornar resultado cacheado ou inclua identidade/tenant na chave. Um cache de resposta inteira pode ignorar diferenças de papel, dados recentes ou headers de negociação.

Meça hit rate, latência, evictions, cardinalidade e memória. Cache pode reduzir banco em algumas rotas e se tornar nova dependência crítica em outras.

## 8. Como falar na entrevista

**“Como colocaria cache numa resposta por usuário?”**

> “Eu definiria a chave com usuário ou tenant e cada filtro que muda a representação, aplicaria TTL e invalidaria ou versionaria a chave após alterações. Em várias instâncias usaria um driver compartilhado. Também verificaria autorização antes da resposta e mediria hit rate, cardinalidade e consistência, porque cache local e chave incompleta podem causar dados errados.”

## 9. Resumo

- Cache reduz trabalho repetido; sua política precisa declarar validade e invalidação.
- Chaves incluem tenant, identidade e filtros relevantes para impedir colisão ou vazamento.
- Cache stampede ocorre quando muitas requisições refazem a mesma origem após expiração.
- Sessão pode ser compartilhada via driver comum e deve ter ciclo de vida limitado.
- Rate limiting distribuído precisa de armazenamento compartilhado e chave apropriada.

## Termos desta aula
Cache-aside · TTL · cache stampede · lock · sessão · cookie · SameSite · rate limit · Retry-After · cache driver

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 08** e separadas por nível.

### Para aprofundar
[Cache](https://laravel.com/framework/docs/13.x/cache) · [Sessions](https://laravel.com/framework/docs/13.x/session) · [Rate Limiting](https://laravel.com/framework/docs/13.x/rate-limiting)
