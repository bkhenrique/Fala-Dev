# Aula 10 — Laravel em produção: deploy, Octane e arquitetura

> **Objetivo:** preparar uma aplicação Laravel para produção e avaliar otimizações, arquitetura de classes e runtimes persistentes com os trade-offs corretos.

---

## 1. A aplicação além do controller

Laravel dá convenções para rotas, controllers, models, jobs, eventos, requests, resources e policies. Uma aplicação pequena pode organizar-se por camadas convencionais; conforme o domínio cresce, agrupar arquivos por funcionalidade pode aproximar o que muda junto.

Evite decidir arquitetura por quantidade de pastas. Use classes Action ou Services quando uma operação tem nome, várias etapas ou colaboração reutilizável; não crie um Service genérico que apenas repassa cada método do model. Regras importantes precisam de testes e dono claro.

## 2. Configuração de produção

Produção deve ter `APP_DEBUG=false`, configuração externa por ambiente e segredos fora do repositório. O usuário do processo deve ter permissão de escrita apenas nos diretórios necessários, como cache e logs.

Depois de configuração final, comandos como `php artisan optimize` precompilam caches de configuração, rotas, eventos e views conforme disponíveis. Quando config está cacheada, ler `env()` fora dos arquivos de configuração pode retornar `null`; código de aplicação deve consumir `config()`.

## 3. Deploy e migrações

Build e deploy devem usar versões de PHP, extensões e dependências alinhadas ao lockfile. Cache gerado precisa corresponder à versão que está entrando em produção; pipelines devem limpar ou regenerar de forma previsível.

Rolling deploy pode manter versões diferentes em execução ao mesmo tempo. Migrations compatíveis, expand-and-contract, health checks e rollback ajudam a evitar indisponibilidade. Rollback do binário não desfaz automaticamente migração que apagou ou transformou dados.

## 4. Queue workers e processos duradouros

Workers de fila são processos de longa duração. Depois de publicar código, eles precisam ser sinalizados para reiniciar e carregar versão nova. Limites de jobs, tempo e memória ajudam a reciclar worker e limitar vazamentos acumulados.

Horizon configura e monitora workers Redis; outros drivers usam comandos e supervisão apropriados. Escale workers com a capacidade do banco e APIs de destino, e acompanhe idade da fila além da contagem de jobs.

## 5. Octane e ciclo de vida persistente

Laravel Octane serve requisições usando servidores persistentes compatíveis, como Swoole ou RoadRunner, mantendo a aplicação em memória entre pedidos. Isso reduz parte do bootstrap e pode aumentar throughput, mas não muda automaticamente o custo do banco nem elimina gargalos externos.

Como o processo não começa do zero por requisição, variáveis estáticas, singletons e objetos que retêm dados precisam ser seguros entre requests. Não guarde usuário, request, dados de tenant ou coleção do pedido numa propriedade de singleton. Teste vazamento entre requisições com cenários de usuários diferentes.

## 6. Cache de config, rotas e views

Cache de configuração reduz leitura e combinação de arquivos; route cache reduz trabalho de registrar rotas; view cache compila templates. O comando `optimize` reúne caches suportados pela versão instalada. Mudanças devem ser regeneradas durante deploy e verificadas no ambiente de destino.

Cache de aplicação (Redis, por exemplo) é diferente de caches de bootstrap. O primeiro guarda dados de negócio temporários; o segundo acelera inicialização. Limpar o primeiro pode invalidar dados e locks, então não use um comando de otimização sem entender seus efeitos.

## 7. Observabilidade e resiliência

Logs estruturados com correlation id ajudam a ligar requisição, job e chamadas externas. Métricas de latência, erro, saturação de worker e conexões dão sinais operacionais; traces mostram onde a duração se acumulou.

Cliente HTTP e banco precisam de timeout. Retry só deve repetir operação segura; circuit breaker pode evitar espera prolongada; bulkhead limita recursos ocupados por dependência lenta. Health check diferencia processo vivo de aplicação pronta para receber tráfego.

## 8. Como falar na entrevista

**“Como colocaria uma aplicação Laravel em produção e avaliaria Octane?”**

> “Fixaria dependências pelo lock, manteria debug desligado e segredos externos, geraria caches de deploy e usaria migrations compatíveis com rolling release. Supervisionaria FPM ou queue workers e observaria fila, latência e dependências. Octane pode reduzir overhead de bootstrap, mas aumenta a importância de estado seguro entre requests; eu testaria isolamento e mediria ganho antes de adotar.”

## 9. Resumo

- Use camadas e classes nomeadas quando deixam fluxo e responsabilidade claros.
- Produção precisa de segredos externos, debug desativado e caches atualizados no deploy.
- Processos de fila precisam reiniciar ao publicar versão nova e ser dimensionados pelo downstream.
- Octane mantém processos quentes; estado de uma requisição não pode vazar para outra.
- Métricas, logs, tracing, timeout e health checks tornam operação observável.

## Termos desta aula
Laravel Octane · runtime persistente · config cache · route cache · view cache · queue worker · rolling deploy · health check · correlation id · Action · Service

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 10** e separadas por nível.

### Para aprofundar
[Deployment](https://laravel.com/framework/docs/13.x/deployment) · [Octane](https://laravel.com/framework/docs/13.x/octane) · [Release notes do Laravel 13](https://laravel.com/framework/docs/releases)
