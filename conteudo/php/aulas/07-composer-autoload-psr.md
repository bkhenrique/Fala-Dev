# Aula 07 — Composer, autoload e padrões PSR

> **Objetivo:** explicar como Composer instala dependências, gera autoload e como os padrões PSR ajudam bibliotecas PHP a interoperar.

---

## 1. O problema

Aplicações usam bibliotecas de outras equipes, mas sem convenções cada pacote exigiria uma forma própria de instalar, carregar classes e registrar dependências. Composer padroniza resolução de pacotes PHP e faz parte do ciclo de desenvolvimento moderno.

## 2. composer.json e composer.lock

`composer.json` declara o pacote, suas restrições de versão, autoload e scripts. `composer.lock` registra versões exatas resolvidas, incluindo dependências transitivas. Aplicações devem versionar o lock para que equipe, CI e produção instalem a mesma árvore.

`composer require` altera a declaração e resolve pacotes. `composer install` usa o lock quando existe; `composer update` volta a resolver dentro das restrições e atualiza o lock. Rodar update indiscriminadamente pode atualizar muitas dependências ao mesmo tempo e tornar uma regressão difícil de atribuir.

## 3. dependências de execução e desenvolvimento

`require` lista pacotes necessários para executar a aplicação; `require-dev` lista ferramentas como PHPUnit, Pest e PHPStan, usadas no desenvolvimento e CI. O deploy pode instalar sem dependências de desenvolvimento, mas os artefatos precisam conter o que a aplicação exige em runtime.

Restrições como `^2.4` permitem versões compatíveis dentro da major segundo semver. A resolução também considera PHP e extensões instaladas. Leia o diff do lockfile e execute análise e testes antes de incorporar uma atualização importante.

## 4. Autoload PSR-4

O Composer gera `vendor/autoload.php`. Com **PSR-4**, um prefixo de namespace corresponde a um diretório; o autoloader mapeia o nome completo da classe ao caminho do arquivo, respeitando capitalização em sistemas de arquivos sensíveis a maiúsculas.

```json
{
  "autoload": {
    "psr-4": { "App\": "app/" }
  }
}
```

O mapeamento ajuda pacotes independentes a encontrar classes sem centenas de `require`. Após mudar o mapeamento, o autoloader precisa ser regenerado. Arquivos de funções globais podem ser registrados separadamente, mas classes PSR-4 são preferíveis para APIs extensíveis.

## 5. PSR: família de padrões

**PHP-FIG** coordena recomendações comuns da comunidade. Nem toda PSR é uma lei da linguagem nem todos os projetos adotam todas. Exemplos:

- **PSR-4:** autoload de classes.
- **PSR-12:** estilo de código comum.
- **PSR-3:** interface de logger.
- **PSR-7:** interfaces para mensagens HTTP.
- **PSR-15:** interfaces para middleware HTTP.
- **PSR-18:** cliente HTTP.

Interfaces compartilhadas permitem que bibliotecas implementem ou consumam comportamentos sem depender de uma implementação concreta. O benefício é interoperabilidade; o custo é aprender o contrato e adaptar o projeto ao nível de abstração necessário.

## 6. Scripts e plugins

Scripts Composer automatizam tarefas como análise estática, geração de artefatos ou checagens. Plugins podem executar código durante operações do Composer; por isso dependências e plugins merecem revisão como qualquer código de terceiro.

Em CI, use instalação reprodutível, valide plataforma e evite resolver versões de novo durante o deploy. Segredos não pertencem ao `composer.json`, lockfile ou script versionado.

## 7. Bibliotecas, pacotes e aplicações

Uma **biblioteca** é consumida por outras aplicações; tende a declarar uma API pública estável e compatível. Uma **aplicação** controla seu deploy e normalmente fixa versões pelo lockfile. Padrões PSR ajudam ambas, mas o versionamento e a política de compatibilidade podem ser diferentes.

Composer também pode validar requisitos de plataforma e mostrar por que uma dependência não resolve. Ao depurar instalação, verifique versão do PHP, extensões, restrições de pacote e origem do repositório antes de apagar o lockfile.

## 8. Como falar na entrevista

**“Qual a diferença entre composer install e composer update?”**

> “Install instala as versões registradas no composer.lock, então é o comando reprodutível de CI e deploy. Update resolve de novo dentro das restrições e altera o lockfile, por isso faço isso como mudança revisável. O autoloader gerado segue PSR-4 e evita incluir classes manualmente.”

## 9. Resumo

- `composer.json` declara dependências e `composer.lock` fixa a resolução usada pela aplicação.
- `install` reproduz o lock; `update` resolve e pode atualizá-lo.
- PSR-4 mapeia namespaces a diretórios para carregar classes automaticamente.
- PSRs são contratos de interoperabilidade, não recursos obrigatórios da linguagem.
- Plugins e dependências são código executável e entram na cadeia de suprimentos.

## Termos desta aula
Composer · composer.json · composer.lock · semver · autoload · PSR-4 · PHP-FIG · PSR-3 · PSR-7 · PSR-12 · PSR-15 · PSR-18

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 07** e separadas por nível.

### Para aprofundar
[Documentação do Composer](https://getcomposer.org/doc/) · [Padrão PSR-4](https://www.php-fig.org/psr/psr-4/)
