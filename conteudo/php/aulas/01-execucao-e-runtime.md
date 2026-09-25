# Aula 01 — Como o PHP executa: Zend Engine, FPM e OPcache

> **Objetivo:** explicar o caminho de um arquivo PHP até a resposta HTTP e distinguir o motor da linguagem, o servidor FastCGI e os caches de execução.

---

## 1. O problema

Um arquivo PHP parece rodar linha por linha quando chega uma requisição. Em produção, porém, há várias peças entre o navegador e a função do seu código. Saber separá-las ajuda a entender concorrência, memória, latência e o significado real de “PHP é stateless”.

## 2. Da fonte ao opcode

O PHP lê o arquivo, faz análise léxica e sintática, constrói uma representação interna e compila o código para **opcodes**. A **Zend Engine** executa esses opcodes na máquina virtual do PHP. O motor também participa da gestão de valores, referências, chamadas de função e coleta de ciclos de referência.

O opcode é uma instrução intermediária da VM, não o código de máquina final da CPU. Por isso, dizer que “o Zend interpreta PHP” é uma simplificação aceitável, mas não significa que cada linha de texto seja interpretada do zero em toda requisição.

## 3. OPcache e JIT

Sem cache, o processo precisa ler, analisar e compilar os arquivos a cada execução. O **OPcache** guarda bytecode compilado em memória compartilhada entre processos do servidor e evita parte desse trabalho repetido. Em deploy, o cache precisa perceber que os arquivos mudaram; por isso configurações de validação de timestamps e reinício importam.

O **JIT** pode compilar trechos de opcode para instruções nativas da CPU. Ele não transforma automaticamente qualquer aplicação web em algo muito mais rápido: a maior parte das APIs espera banco, disco ou rede. Meça a carga real antes de ativá-lo. Desde PHP 8.4, a configuração padrão do JIT é desativada.

## 4. SAPI: a ponte entre PHP e o ambiente

**SAPI** significa Server Application Programming Interface: a forma como o PHP conversa com quem o hospeda. `php` no terminal usa a SAPI CLI. Um servidor web pode encaminhar requisições para processos PHP-FPM por FastCGI. Extensões e integração com servidor dependem dessa camada.

PHP-FPM é um gerenciador de processos FastCGI. Ele mantém workers prontos para receber scripts, controla quantos existem e recicla processos conforme a configuração. Nginx ou Apache recebe HTTP; FPM executa PHP; a resposta volta pelo FastCGI.

```text
Navegador → Nginx/Apache → FastCGI → worker PHP-FPM → resposta
```

## 5. Um worker por vez e o modelo shared-nothing

No modelo tradicional, cada worker atende uma requisição por vez. A memória do processo fica disponível enquanto aquela execução ocorre e é liberada ao final, salvo recursos explicitamente persistentes. Duas requisições concorrentes são atendidas por workers diferentes.

Isso costuma ser chamado de **shared-nothing**: requisições não compartilham automaticamente estado mutável da aplicação. Para compartilhar sessão, cache ou fila entre processos e máquinas, usa-se um armazenamento externo, como Redis ou banco. O benefício é isolamento simples; o custo é reconstruir estado ou consultar esse armazenamento.

A frase “PHP reinicia em toda requisição” é uma analogia, não uma descrição literal de cada processo. O processo FPM permanece vivo, mas o ciclo de execução do script e o estado comum da requisição são separados. Extensões e conexões persistentes podem manter recursos entre requisições.

## 6. O que muda com runtimes persistentes

Servidores como Swoole, RoadRunner e FrankenPHP podem manter o processo da aplicação aquecido entre requisições ou oferecer servidores de aplicação persistentes. Isso reduz inicialização e pode abrir opções de concorrência, mas muda a responsabilidade do código.

Uma variável estática, singleton ou cache em memória pode sobreviver à próxima requisição. Estado de usuário não pode ficar acidentalmente numa propriedade global. O código precisa liberar recursos e evitar guardar dados específicos da requisição em serviços de longa duração.

## 7. Onde procurar lentidão

Uma resposta lenta pode vir do tempo de inicialização, do código PHP, de uma consulta N+1, de uma chamada HTTP externa ou da fila de workers cheia. OPcache ajuda com compilação repetida; não corrige SQL ruim nem espera de rede.

Meça latência total e por dependência. Observe CPU, memória por worker, quantidade de workers ocupados, fila do FPM e conexões abertas. A configuração de `pm.max_children` limita concorrência e deve caber na memória disponível: workers demais podem provocar troca de páginas e piorar a latência.

## 8. Como falar na entrevista

**“O que acontece quando uma requisição chega a uma aplicação PHP?”**

> “O servidor HTTP encaminha a requisição por FastCGI a um worker PHP-FPM. O Zend Engine analisa e executa os opcodes do script; o OPcache pode reutilizar bytecode compilado. No modelo comum o worker atende uma requisição por vez, e estado que precisa sobreviver ou ser compartilhado fica em sessão, cache ou banco. Eu mediria FPM, banco e chamadas externas antes de culpar o JIT.”

## 9. Resumo

- O Zend Engine executa opcodes; a SAPI liga PHP ao terminal ou servidor.
- PHP-FPM administra workers FastCGI; Nginx ou Apache ainda recebe HTTP.
- OPcache evita recompilar scripts repetidamente; JIT não é solução universal.
- Shared-nothing simplifica isolamento, mas estado compartilhado precisa de armazenamento externo.
- Runtimes persistentes exigem cuidado com estado e recursos entre requisições.

## Termos desta aula
Zend Engine · opcode · SAPI · PHP-FPM · FastCGI · OPcache · JIT · worker · shared-nothing · runtime persistente

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 01** e separadas por nível.

### Para aprofundar
[OPcache no manual do PHP](https://www.php.net/manual/en/book.opcache.php) · [Configuração do JIT](https://www.php.net/manual/en/opcache.configuration.php)
