# Aula 12 — Observabilidade, Testes, CI/CD, Containers e estratégias de deploy

> **Objetivo:** saber falar de como um sistema é operado em produção: observabilidade (logs, métricas, traces), testes, CI/CD, Docker e Kubernetes, e estratégias de deploy.

---

## 1. Observabilidade

**Monitoramento** responde "**está funcionando?**" (alertas para problemas conhecidos). **Observabilidade** vai além: a capacidade de entender **por que** algo está acontecendo, inclusive problemas que você nunca previu, a partir dos dados que o sistema emite.

### Os três pilares
| Pilar | O que é | Exemplo |
|---|---|---|
| **Logs** | Registros de **eventos** discretos | "Pedido 42 criado", "erro ao chamar pagamento" |
| **Métricas** | **Números agregados** ao longo do tempo | Requisições/s, latência p99, uso de CPU, tamanho da fila |
| **Traces** | O **caminho de uma requisição** através de vários serviços, com o tempo de cada etapa (*spans*) | API → serviço de pedidos (20 ms) → banco (300 ms!) → fila |

### Logs bem feitos
- **Estruturados** (JSON), não texto solto: permitem filtrar e agregar (`nivel=error AND servico=pagamentos`).
- **Níveis**: debug, info, warn, error.
- **Correlation id / request id / trace id** em todos os logs de uma requisição, propagado entre serviços (header `traceparent`).
- **Nunca** logar senha, token, dados de cartão; mascarar **PII**.
- Centralizados: ELK/OpenSearch, Loki, Datadog, CloudWatch.

### Métricas que importam
- **Os 4 sinais de ouro** (*Golden Signals*, do SRE do Google): **latência**, **tráfego**, **erros** e **saturação**.
- Método **RED** (para serviços): *Rate, Errors, Duration*.
- Método **USE** (para recursos): *Utilization, Saturation, Errors*.
- **Percentis** em vez de média: a **média esconde** os casos ruins. **p50** (mediana), **p95**, **p99** (1% das requisições foram mais lentas que isso). Um p99 alto significa que muitos usuários reais estão sofrendo.
- Ferramentas: Prometheus + Grafana, Datadog, New Relic.

### Tracing distribuído
Essencial em microsserviços: sem ele, descobrir **em qual serviço** a requisição ficou lenta é adivinhação. Padrão aberto: **OpenTelemetry** (instrumentação), com backends como Jaeger, Tempo, Datadog APM.

### Alertas
- Alertar por **sintoma que afeta o usuário** (taxa de erro, latência, SLO em risco), não por qualquer causa (CPU a 80% por 1 minuto).
- Alerta que ninguém age vira ruído (**alert fatigue**).
- **Runbooks**: o que fazer quando o alerta dispara. **Postmortem sem culpados** (*blameless*) após incidentes.

---

## 2. Testes

### Pirâmide de testes
```
          /\         E2E: poucos, lentos, caros, testam o fluxo completo pela UI/API
         /  \
        /----\       Integração: componentes reais juntos (API + banco em container)
       /      \
      /--------\     Unitários: muitos, rápidos, isolados
```
- **Unitário**: uma unidade (função, classe) isolada, com dependências falsas (**mocks/stubs/fakes**).
- **Integração**: várias partes reais juntas (repositório + banco real via **Testcontainers**).
- **E2E** (*end-to-end*): o sistema inteiro, como o usuário usa (Playwright, Cypress).
- **Contrato**: garante que produtor e consumidor de uma API concordam (Pact). Útil em microsserviços.
- **Carga/performance**: comportamento sob volume (k6, JMeter).

Cobertura de código é um **indicador**, não uma meta: 100% de cobertura com asserts ruins não garante nada. O que importa é testar **comportamento e regras de negócio**, incluindo casos de borda e erro.

**TDD**: escrever o teste antes (vermelho → verde → refatorar).

---

## 3. CI/CD

- **CI** (*Continuous Integration*): todo push/PR dispara um pipeline automático: instalar dependências, **lint**, **build**, **testes**, análise de segurança. Integrar código na branch principal **frequentemente**, pegando problemas cedo.
- **CD**:
  - ***Continuous Delivery***: todo código que passa no pipeline está **pronto** para ir para produção; o deploy é **um clique** (decisão humana).
  - ***Continuous Deployment***: vai para produção **automaticamente**, sem intervenção.

Ferramentas: GitHub Actions, GitLab CI, Jenkins, CircleCI.

Práticas associadas: branches curtas, **code review** via PR, **trunk-based development**, **feature flags** (liberar código desligado e ativar depois, separando **deploy** de **release**).

---

## 4. Containers e Docker

**Container**: empacota a aplicação **com tudo o que ela precisa** (runtime, bibliotecas, configuração) para rodar igual em qualquer lugar. Resolve o "na minha máquina funciona".

**Container × Máquina Virtual**:
- **VM**: virtualiza o **hardware**; cada VM tem seu **sistema operacional inteiro**. Pesada, boot em minutos.
- **Container**: compartilha o **kernel** do sistema hospedeiro e isola só o processo. **Leve**, sobe em segundos, muitos por máquina.

**Docker**:
- **Dockerfile**: a receita para montar a imagem.
- **Imagem**: o pacote imutável, feito em **camadas** (cacheadas; por isso copiar o `package.json` e instalar dependências **antes** de copiar o código acelera o build).
- **Container**: uma imagem **em execução**.
- **Registry**: onde as imagens ficam (Docker Hub, ECR, GHCR).
- **Multi-stage build**: compila numa etapa e copia só o resultado para uma imagem final **pequena** (menos superfície de ataque).
- **Docker Compose**: sobe vários containers juntos em desenvolvimento (API + Postgres + Redis).

---

## 5. Kubernetes (o essencial)

**Kubernetes (K8s)** é um **orquestrador de containers**: roda, escala e mantém saudáveis muitos containers em muitas máquinas.

| Conceito | O que é |
|---|---|
| **Pod** | A menor unidade: um (ou poucos) containers rodando juntos |
| **Deployment** | Declara "quero 5 réplicas desta imagem"; o K8s mantém esse estado e faz rolling update |
| **Service** | Endereço estável e balanceamento interno para um conjunto de pods |
| **Ingress** | Entrada HTTP externa (roteamento por host/caminho) |
| **ConfigMap / Secret** | Configuração e segredos injetados nos pods |
| **HPA** | *Horizontal Pod Autoscaler*: escala réplicas por métrica |
| **Probes** | Liveness (reinicia se travar) e readiness (só recebe tráfego quando pronto) |

Ideia central: é **declarativo**. Você descreve o **estado desejado**, e o K8s trabalha continuamente para que o estado real bata com ele (*reconciliation loop*). Se um pod morre, ele sobe outro.

Custo: complexidade operacional alta. Para times pequenos, plataformas gerenciadas (Cloud Run, ECS, Railway, Render, Vercel) podem ser melhor escolha.

**IaC** (*Infrastructure as Code*): infraestrutura descrita em código versionado (**Terraform**, Pulumi, CloudFormation), reproduzível e revisável em PR.

---

## 6. Estratégias de deploy

| Estratégia | Como funciona | Prós / contras |
|---|---|---|
| **Recreate** | Derruba tudo, sobe a nova | Simples; **tem downtime** |
| **Rolling update** | Substitui as instâncias **aos poucos** | Sem downtime; por um tempo convivem duas versões; rollback mais lento |
| **Blue-Green** | Dois ambientes completos; o tráfego **vira de uma vez** do azul (atual) para o verde (novo) | Rollback **instantâneo** (volta o tráfego); custa o dobro de infraestrutura durante a troca |
| **Canary** | A nova versão recebe **uma fração** do tráfego (1%, 10%, 50%…), monitorada, e vai aumentando | Risco controlado, detecta problemas com poucos usuários; mais complexo |
| **Feature flag** | O código novo vai para produção **desligado** e é ativado por configuração (para todos, % ou grupos) | Separa deploy de release; rollback é desligar a flag |

Cuidado comum a todas (menos recreate): **duas versões rodando ao mesmo tempo** → mudanças de banco e de contrato de API precisam ser **compatíveis com a versão anterior** (*expand and contract*: adiciona o novo, migra, remove o antigo depois).

---

## 7. Como falar na entrevista

**"Como você investigaria uma API lenta em produção?"**
> "Começo pelas métricas: qual endpoint, desde quando, p95 e p99, se coincide com deploy ou pico de tráfego, e os sinais de saturação, como CPU, pool de conexões e fila. Aí vou pro tracing distribuído pra ver em qual etapa o tempo está sendo gasto, banco, serviço externo ou a própria aplicação, e uso os logs com o correlation id pra ver requisições específicas. Os culpados mais comuns são query lenta ou N+1, dependência externa sem timeout, falta de cache e recurso saturado. Corrijo e comparo as métricas antes e depois."

**"Qual a diferença entre blue-green e canary?"**
> "No blue-green tenho dois ambientes completos e viro todo o tráfego de uma vez pro novo; o rollback é instantâneo, mas custa infraestrutura dobrada. No canary mando uma fração pequena do tráfego pra nova versão, monitoro erros e latência e vou aumentando, o que limita o impacto de um problema. Nos dois casos as versões convivem, então migrações de banco precisam ser compatíveis com a versão anterior."

---

## 8. Resumo

- **Monitoramento** (está funcionando?) × **observabilidade** (por quê?).
- **Logs** estruturados + correlation id; **métricas** (golden signals, RED, USE, **percentis**); **traces** (OpenTelemetry).
- Alertas por **sintoma**; runbooks; postmortem blameless.
- **Pirâmide de testes**: unitário, integração (Testcontainers), E2E; contrato; carga; cobertura é indicador.
- **CI** (integrar e testar sempre) × **Continuous Delivery** (pronto, um clique) × **Continuous Deployment** (automático); feature flags.
- **Container × VM**; Docker: Dockerfile, imagem em camadas, multi-stage, registry, Compose.
- **Kubernetes**: pod, deployment, service, ingress, HPA, probes; **declarativo**. **IaC** (Terraform).
- Deploy: recreate, **rolling**, **blue-green**, **canary**, **feature flag**; compatibilidade entre versões (*expand and contract*).

## Termos desta aula
monitoramento · observabilidade · logs · métricas · traces · span · log estruturado · correlation id · trace id · PII · golden signals · latência · tráfego · erros · saturação · RED · USE · percentil · p50 · p95 · p99 · OpenTelemetry · Prometheus · Grafana · alerta · alert fatigue · runbook · postmortem blameless · pirâmide de testes · teste unitário · teste de integração · E2E · teste de contrato · teste de carga · cobertura · TDD · CI · continuous delivery · continuous deployment · pipeline · trunk-based · feature flag · container · VM · kernel · Docker · Dockerfile · imagem · camada · registry · multi-stage build · Docker Compose · Kubernetes · pod · deployment · service · ingress · HPA · probe · declarativo · IaC · Terraform · recreate · rolling update · blue-green · canary · rollback · expand and contract

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 12** e separadas por nível.
