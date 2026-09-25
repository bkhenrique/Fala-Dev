# Aula 09 — Segurança de memória e depuração

> **Objetivo:** reconhecer classes comuns de defeito em C e usar ferramentas de diagnóstico sem tratá-las como prova de correção.

---

## 1. Erros de memória

Out-of-bounds, use-after-free, double free, ponteiros pendentes e leitura não inicializada podem causar UB, falhas, corrupção ou vulnerabilidades. Buffer overflow pode permitir que entrada altere memória fora do objeto, então tamanho e validade precisam fazer parte do contrato de cada função.

## 2. Inicialização e validação

Variáveis automáticas sem inicialização explícita podem ter valor indeterminado. Inicialize dados antes de ler, verifique retornos e valide índices e tamanhos antes de operações. Não use zero-initialization como substituto para validar que os dados recebidos são semanticamente corretos.

## 3. Ferramentas

Avisos de compilador, sanitizers e ferramentas de análise dinâmica podem detectar classes de problemas em caminhos executados. AddressSanitizer identifica muitos acessos inválidos à memória; UndefinedBehaviorSanitizer detecta algumas formas de UB. Nenhuma ferramenta encontra toda falha nem substitui revisão do contrato.

## 4. Segurança e limites

Valide entrada antes de calcular tamanhos e confirme que multiplicações/addições não estouraram. Verifique retorno de alocação e I/O. Faça cleanup em caminhos de erro. Use bibliotecas e APIs cuja capacidade seja explícita e evite cópias sem limite.

## 5. Como falar na entrevista

**“Sanitizer prova que o programa não tem UB?”**
> “Não. Ele encontra algumas classes de problema que acontecem nos caminhos instrumentados e executados. Combinaria warnings, sanitizers, testes, análise estática e revisão de limites/lifetimes; ausência de alerta não prova ausência de UB.”

## 6. Resumo

- Erros de limite e lifetime podem produzir UB e vulnerabilidades.
- Inicialize e valide dados antes de usá-los.
- Sanitizers detectam classes de erros, não provam correção.
- Verifique overflow em cálculos de tamanho antes de alocar.
- Combine ferramentas, testes e contratos de API.

## Termos desta aula
Out-of-bounds · use-after-free · double free · ponteiro pendente · valor indeterminado · sanitizer · AddressSanitizer · UB · overflow de tamanho

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 09** e separadas por nível.

### Para aprofundar
[WG14 N1570 — comportamento indefinido](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) · [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) · [Clang UBSan](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html)
