# Aula 02 — Service Container, Providers e Facades

> **Objetivo:** explicar como Laravel resolve dependências e como bindings, providers e facades influenciam arquitetura e testes.

---

## 1. O problema

Uma classe que instancia todas as suas dependências com `new` controla tanto a regra quanto a construção dos colaboradores. Trocar banco, cliente HTTP ou implementação exige alterar vários lugares, e testar a regra isolada fica difícil.

## 2. Inversão de controle e injeção

O **Service Container** do Laravel constrói objetos e fornece suas dependências. Com injeção pelo construtor, a classe declara o que precisa; o framework resolve classes concretas automaticamente quando não há ambiguidade.

```php
class EmitirRelatorio
{
    public function __construct(private RelatorioRepository $repositorio) {}
}
```

A aplicação também pode pedir dependências em controllers, middleware, listeners, jobs e outros pontos integrados ao container. Isso reduz acoplamento à criação, mas não torna qualquer classe magicamente gerenciada: ela precisa ser resolvida por um lugar que use o container.

## 3. Bindings para abstrações

Se o código depende de uma interface, o container precisa saber qual implementação fornecer. Um binding associa contrato a implementação; uma factory pode usar configuração para escolher um driver. Essa é uma forma de inversão de dependência.

Use binding quando há alternativas reais, infraestrutura externa ou requisito de teste. Criar uma interface para cada classe sem possibilidade concreta de variação acrescenta indireção sem reduzir acoplamento relevante.

## 4. Escopos de vida

Bindings transient podem criar uma instância a cada resolução; singleton reutiliza uma instância no processo; scoped dura um ciclo de requisição ou job e é limpo entre esses ciclos em runtimes que mantêm processos vivos.

Singleton mutável pode vazar estado entre requisições num servidor persistente. Se um serviço armazena usuário atual em propriedade, isso não pertence a um singleton compartilhado. Prefira objetos sem estado de requisição e injete explicitamente os dados necessários.

## 5. Service providers

Providers são o ponto central de configuração da aplicação. `register()` associa abstrações e implementações. `boot()` roda depois que providers foram registrados e pode inicializar listeners, macros e políticas que dependam do container já montado.

Na aplicação, o provider principal costuma receber pequenas configurações. Provedores de pacote registram serviços necessários para integrar funcionalidade externa. Não coloque processamento de cada pedido no provider: ele é bootstrap, não controller.

## 6. Facades: sintaxe estática, resolução dinâmica

Uma **Facade** parece chamada estática, como `Cache::get()`, mas é um proxy para um serviço resolvido do container. Isso é diferente de um método estático tradicional: a facade aponta para uma instância substituível e oferece mecanismos próprios de fake e mock nos testes.

Facades tornam chamadas expressivas e idiomáticas. Em serviços com muitas responsabilidades, a sintaxe curta pode esconder uma lista grande de dependências; a injeção pelo construtor deixa essa lista visível. A escolha pode seguir o padrão do código, sem tratar facade como sinônimo de global compartilhado.

## 7. Testabilidade e limites

Container facilita substituir binding por fake ou mock e criar uma classe com dependências controladas. Testes unitários podem instanciar objetos diretamente sem subir Laravel; testes de aplicação podem construir um container real e trocar apenas serviços externos.

Se uma classe chama muitas facades, fala com vários sistemas e decide regra de negócio, problema maior pode ser o tamanho da responsabilidade. Mover comportamento para colaboradores menores costuma melhorar o desenho mais do que discutir sintaxe de facade versus injeção.

## 8. Como falar na entrevista

**“Facades quebram injeção de dependência?”**

> “A facade é uma sintaxe estática para um serviço resolvido no container, não um método estático tradicional. Ela continua testável com os fakes do Laravel. Para dependências centrais e contratos variáveis, injeção pelo construtor deixa o acoplamento explícito; em código idiomático posso usar facade para operações transversais. Se a classe acumula muitas dependências ou regras, eu a dividiria.”

## 9. Resumo

- O container resolve objetos e injeta dependências; bindings associam interfaces a implementações.
- Singleton, transient e scoped têm ciclos de vida diferentes.
- Providers configuram serviços no bootstrap; `register` e `boot` não são intercambiáveis.
- Facade é proxy de container com sintaxe estática e pode ser substituída em testes.
- Testabilidade melhora com responsabilidades coesas e dependências explícitas.

## Termos desta aula
Service Container · dependency injection · binding · singleton · scoped · service provider · Facade · proxy · fake

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 02** e separadas por nível.

### Para aprofundar
[Service Container](https://laravel.com/framework/docs/13.x/container) · [Facades](https://laravel.com/framework/docs/13.x/facades)
