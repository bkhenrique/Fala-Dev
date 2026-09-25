# Aula 01 — Spring Core e Spring Boot

> **Objetivo:** entender o que é o Spring, o container de IoC, beans, injeção de dependência, escopos, proxies/AOP, e o que o Spring Boot adiciona (auto-configuração, starters, profiles, Actuator).

---

## 1. O que é o Spring

**Spring Framework** (2003) é o framework mais usado no backend Java. Nasceu como alternativa mais simples ao pesado **Java EE/EJB** da época. Seu núcleo é:

> **Um container de Inversão de Controle (IoC) que cria, configura e conecta os objetos da aplicação (beans) via Injeção de Dependência.**

Em volta desse núcleo existe um ecossistema: **Spring MVC** (web), **Spring Data** (acesso a dados), **Spring Security**, **Spring Cloud**, **Spring Batch**…

> Se você fez as aulas de NestJS: o Nest foi **muito** inspirado nessa ideia. `@Injectable` ≈ `@Service`, módulo ≈ contexto de configuração, provider ≈ bean.

---

## 2. IoC Container e Beans

- **Bean**: um objeto **criado e gerenciado** pelo container do Spring.
- **ApplicationContext**: o container. Na inicialização ele:
  1. **Escaneia** o classpath atrás de classes anotadas (*component scan*).
  2. Lê as configurações.
  3. Cria os beans, resolve as dependências e **injeta**.
  4. Gerencia o ciclo de vida (inicialização, destruição).

### Como declarar beans

**Estereótipos** (na classe):
| Anotação | Uso |
|---|---|
| `@Component` | Genérico |
| `@Service` | Camada de regra de negócio |
| `@Repository` | Acesso a dados (também traduz exceções de persistência) |
| `@Controller` / `@RestController` | Camada web |

Tecnicamente os quatro registram um bean; os específicos **comunicam a intenção** e alguns adicionam comportamento.

**`@Configuration` + `@Bean`** (métodos que criam beans), útil para classes de bibliotecas de terceiros que você não pode anotar:
```java
@Configuration
public class HttpConfig {
  @Bean
  public RestClient pagamentosClient(@Value("${pagamentos.url}") String url) {
    return RestClient.builder().baseUrl(url).build();
  }
}
```

---

## 3. Injeção de dependência

Três formas:
```java
@Service
public class PedidoService {
  private final PedidoRepository repo;
  private final Notificador notificador;

  // ✅ 1. CONSTRUTOR (recomendada). Com um construtor só, nem precisa de @Autowired.
  public PedidoService(PedidoRepository repo, Notificador notificador) {
    this.repo = repo;
    this.notificador = notificador;
  }
}

// 2. Setter:  @Autowired public void setRepo(...)
// 3. Campo:   @Autowired private PedidoRepository repo;   ❌ evite
```

Por que **construtor**:
- Dependências **explícitas** e **obrigatórias** (não existe objeto "pela metade").
- Campos **`final`** (imutáveis).
- **Testável sem Spring**: `new PedidoService(mockRepo, mockNotificador)`.
- Construtor com 8 parâmetros **denuncia** que a classe faz coisa demais (violando responsabilidade única).

### Mais de uma implementação
Se existem `EmailNotificador` e `SmsNotificador` implementando `Notificador`, o Spring não sabe qual injetar (`NoUniqueBeanDefinitionException`). Soluções: `@Primary` (a padrão), `@Qualifier("sms")`, ou injetar **`List<Notificador>`** (recebe todas, útil para Strategy).

---

## 4. Escopos de bean

| Escopo | Instâncias |
|---|---|
| **singleton** (padrão) | Uma por container |
| **prototype** | Uma nova a cada injeção/pedido |
| **request** | Uma por requisição HTTP |
| **session** | Uma por sessão HTTP |

Singleton é o normal, então (repetindo porque é importante): **beans devem ser stateless**. Estado de requisição em atributo de `@Service` = bug de concorrência.

---

## 5. Proxies e AOP: a "mágica" do Spring

Muitas anotações do Spring funcionam porque ele **não injeta seu objeto diretamente**, e sim um **proxy** em volta dele:

```
Controller ──chama──▶ [PROXY do PedidoService] ──▶ PedidoService real
                        │ abre transação (@Transactional)
                        │ checa permissão (@PreAuthorize)
                        │ verifica cache (@Cacheable)
                        │ executa em outra thread (@Async)
```

Isso é **AOP (Aspect-Oriented Programming)**: adicionar comportamentos **transversais** (transação, segurança, cache, log) sem poluir a regra de negócio.

### A consequência mais importante: self-invocation
```java
@Service
public class PedidoService {
  public void processarLote(List<Pedido> pedidos) {
    pedidos.forEach(this::salvar);   // chama pelo THIS, não pelo proxy
  }

  @Transactional
  public void salvar(Pedido p) { ... }   // a transação NÃO é aberta aqui!
}
```
A chamada interna (`this.salvar`) **não passa pelo proxy**, então a anotação é **ignorada**. Vale para `@Transactional`, `@Cacheable`, `@Async`… Solução: mover o método para outro bean, ou anotar o método externo.

Também: métodos `private` (e, dependendo do tipo de proxy, `final`) não são interceptados.

---

## 6. Spring Boot

Configurar Spring "puro" era trabalhoso (XML, servidor externo, dezenas de beans manuais). **Spring Boot** (2014) resolveu com:

### Auto-configuration
O Boot **olha o que está no classpath** e **configura sozinho**:
- Tem `spring-boot-starter-web`? Sobe um **Tomcat embutido** e configura o Spring MVC e o Jackson (JSON).
- Tem driver do Postgres + Spring Data JPA? Cria `DataSource`, pool de conexões (**HikariCP**), `EntityManager`.

Tudo com **condições** (`@ConditionalOnClass`, `@ConditionalOnMissingBean`): se **você** declarar seu próprio bean, o do Boot **sai de cena**. Filosofia: **convention over configuration** (convenção em vez de configuração), com padrões sensatos que você pode sobrescrever.

### Starters
Dependências agregadas: `spring-boot-starter-web`, `-data-jpa`, `-security`, `-validation`, `-actuator`, `-test`. Uma linha no `pom.xml` traz tudo compatível entre si.

### Servidor embutido
A aplicação vira um **`.jar` executável** (`java -jar app.jar`) com o Tomcat dentro. Nada de instalar servidor de aplicação. Ideal para containers.

### Configuração externa e profiles
```yaml
# application.yml
spring:
  datasource:
    url: ${DATABASE_URL}
pagamentos:
  url: https://api.pagamentos.com
```
- Lida com `@Value("${...}")` ou, melhor, **`@ConfigurationProperties`** (config tipada e validável).
- **Profiles**: `application-dev.yml`, `application-prod.yml`, ativados com `spring.profiles.active=prod`.
- Ordem de prioridade: variáveis de ambiente e argumentos sobrescrevem o arquivo (12-Factor).

### Actuator
Endpoints de operação: `/actuator/health` (liveness/readiness), `/actuator/metrics`, `/actuator/prometheus`, info. Base para **observabilidade** e health checks do Kubernetes.

### O ponto de partida
```java
@SpringBootApplication    // = @Configuration + @EnableAutoConfiguration + @ComponentScan
public class LojaApplication {
  public static void main(String[] args) {
    SpringApplication.run(LojaApplication.class, args);
  }
}
```

---

## 7. Como falar na entrevista

**"Qual a diferença entre Spring e Spring Boot?"**
> "Spring é o framework, cujo núcleo é o container de IoC que cria os beans e faz a injeção de dependência, com módulos como MVC, Data e Security. O Spring Boot é uma camada por cima que elimina a configuração manual: auto-configuração baseada no que está no classpath, starters, servidor embutido gerando um jar executável, configuração externa com profiles e o Actuator pra health e métricas. É convention over configuration: ele traz padrões sensatos e sai de cena se eu declarar meu próprio bean."

**"Por que injeção por construtor?"**
> "Deixa as dependências explícitas e obrigatórias, permite campos final, facilita teste sem subir o Spring e evidencia quando uma classe tem dependências demais."

---

## 8. Resumo

- Spring = **IoC container** + DI + ecossistema.
- **Bean** = objeto gerenciado; **ApplicationContext**; component scan.
- `@Component`, `@Service`, `@Repository`, `@RestController`; `@Configuration` + `@Bean`.
- **Injeção por construtor**; `@Primary`, `@Qualifier`, `List<Interface>`.
- Escopos: **singleton** (padrão, stateless!), prototype, request, session.
- **Proxies/AOP**: `@Transactional`, `@Cacheable`, `@Async`; **self-invocation** não passa pelo proxy.
- **Boot**: auto-configuration, starters, servidor embutido, `application.yml`, **profiles**, `@ConfigurationProperties`, **Actuator**.

## Termos desta aula
Spring Framework · Java EE · IoC container · ApplicationContext · bean · component scan · estereótipo · @Component · @Service · @Repository · @RestController · @Configuration · @Bean · injeção por construtor · @Autowired · @Primary · @Qualifier · escopo · singleton · prototype · stateless · proxy · AOP · aspecto · self-invocation · Spring Boot · auto-configuration · @Conditional · convention over configuration · starter · Tomcat embutido · jar executável · HikariCP · application.yml · profile · @ConfigurationProperties · Actuator · @SpringBootApplication

## Treine
As perguntas desta aula estão em [`../perguntas.md`](../perguntas.md), marcadas com **Aula 01** e separadas por nível.
