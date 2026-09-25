# Aula 10 — Performance, testes e ecossistema PHP

> **Objetivo:** explicar como diagnosticar gargalos num serviço PHP e conhecer as ferramentas de teste, análise estática e execução em produção.

---

## 1. Otimize a causa medida

Performance não é um número único. Uma rota pode estar limitada por CPU, alocação de memória, banco, chamada externa, contenção ou falta de workers. Antes de otimizar, observe tempo total e por dependência, throughput, percentis de latência e erros.

Um profiler identifica funções que acumulam CPU ou chamadas; tracing mostra a viagem por banco e serviços; logs contextualizados ajudam a reconstruir uma falha. Otimizar microdetalhes sem identificar a causa pode aumentar complexidade sem melhorar a experiência.

## 2. FPM e capacidade

PHP-FPM controla o conjunto de workers. `pm.max_children` limita quantas requisições podem executar simultaneamente. Para estimá-lo, observe memória média real por worker e deixe espaço para servidor, sistema operacional, cache e picos.

Se todos os workers estão ocupados, as requisições esperam na fila. Aumentar o limite sem memória pode causar swap e piorar tudo; um limite baixo demais mantém recursos ociosos enquanto a fila cresce. Monitore saturação, duração e reinicializações dos processos.

## 3. OPcache, JIT e aplicação

Ative e configure OPcache em produção para reutilizar bytecode. Um deploy precisa invalidar ou reiniciar cache conforme a política do ambiente. Preloading pode manter código comum carregado, mas adiciona uma etapa de inicialização e precisa combinar com os processos longos.

JIT ajuda cargas com bastante computação que o compilador consegue otimizar; APIs normalmente passam mais tempo esperando banco e rede. Não o trate como substituto de índices, cache ou redução de chamadas remotas.

## 4. Runtime persistente

Swoole, RoadRunner, FrankenPHP e servidores compatíveis com protocolos modernos oferecem opções de workers persistentes, concorrência e integração diferente do modelo FPM tradicional. Os detalhes e capacidades variam; compare as exigências da aplicação e extensão escolhida.

O ponto de atenção é o ciclo de vida: singletons podem sobreviver a muitas requisições e manter referências antigas. Bibliotecas que assumem inicialização e destruição por requisição precisam ser avaliadas. Isolamento de dados por usuário, limpeza de estado e manejo de memória tornam-se parte explícita do desenho.

## 5. PHPUnit e Pest

**PHPUnit** é um framework de testes amplamente usado no ecossistema PHP. **Pest** oferece uma sintaxe concisa construída sobre PHPUnit. Ambos executam testes unitários e de integração; a escolha costuma depender da preferência e padrão do time.

Teste regra pura isolando banco, rede e relógio. Teste integração com banco compatível ou infraestrutura temporária quando SQL e transações importam. Teste HTTP em nível de aplicação para validar roteamento, autorização, status e serialização.

Mocks verificam uma colaboração combinada; não provam que o serviço real existe nem que a consulta é válida. Um equilíbrio entre testes unitários, integração e alguns fluxos ponta a ponta ajuda a detectar erros com feedback razoável.

## 6. PHPStan, Psalm e qualidade estática

Análise estática percorre o código sem executar cada caminho. **PHPStan** e **Psalm** inferem tipos, identificam valores talvez nulos, chamadas inválidas e inconsistências. Anotações e generics documentam coleções e contratos que o sistema de tipos da linguagem não representa completamente.

O nível deve crescer com uma política clara: corrigir erros de verdade, evitar suprimir avisos por conveniência e revisar baseline legado. Análise estática complementa testes; não confirma comportamento de integração ou desempenho.

## 7. Deploy e segurança operacional

Build reproduzível usa versão de PHP e extensões compatíveis com o `composer.lock`. Em produção, desative exibição de erros, mantenha logs acessíveis, rode workers supervisionados e tenha deploy que invalide cache de maneira previsível.

Atualize PHP e dependências dentro das janelas de suporte, acompanhe avisos de segurança e mantenha rollback compatível com migrações. O estado da aplicação compartilhado entre instâncias precisa ficar em banco, cache, filesystem compartilhado ou serviço apropriado.

## 8. Como falar na entrevista

**“Como investigaria uma API PHP com latência alta?”**

> “Eu separaria tempo do PHP, FPM, consultas e dependências externas por tracing e métricas. Verificaria fila e memória dos workers, OPcache e consultas lentas. Corrigiria a causa observada e compararia percentis antes e depois. JIT ou mais workers só entram se a medição mostrar que CPU ou concorrência é o gargalo e houver recursos disponíveis.”

## 9. Resumo

- Latência precisa ser dividida por camada antes de otimizar.
- FPM é limitado por workers e memória; saturação cria fila.
- OPcache costuma reduzir trabalho repetido; JIT não resolve espera de I/O.
- Runtime persistente pode melhorar throughput e também manter estado entre requisições.
- PHPUnit/Pest testam comportamento; PHPStan/Psalm verificam contratos estáticos.

## Termos desta aula
Profiler · tracing · FPM · max_children · OPcache · JIT · runtime persistente · PHPUnit · Pest · PHPStan · Psalm

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 10** e separadas por nível.

### Para aprofundar
[Versões suportadas do PHP](https://www.php.net/supported-versions.php) · [Manual do OPcache](https://www.php.net/manual/en/book.opcache.php)
