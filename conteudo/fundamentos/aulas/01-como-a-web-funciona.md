# Aula 01 — Como a web funciona: do navegador ao servidor

> **Objetivo:** conseguir contar, passo a passo, o que acontece quando alguém digita uma URL e aperta Enter: DNS, TCP, TLS, HTTP e a volta. É uma pergunta clássica de entrevista e a base de todas as outras aulas.

---

## 1. Modelo cliente-servidor

- **Cliente**: quem **pede** (navegador, app mobile, outro serviço).
- **Servidor**: quem **responde** (sua API, um site).

A comunicação segue um protocolo em camadas. Simplificando o modelo **TCP/IP**:

| Camada | Protocolo | Papel |
|---|---|---|
| **Aplicação** | HTTP, DNS, WebSocket | O "conteúdo" da conversa |
| **Transporte** | TCP, UDP | Entregar os dados entre dois programas |
| **Rede** | IP | Endereçar e rotear entre máquinas |
| **Enlace/Física** | Ethernet, Wi-Fi | Transmitir os bits |

> Analogia: IP é o **endereço do prédio**; a **porta** (80, 443, 5432) é o **apartamento**; TCP é o **serviço de entrega com confirmação**; HTTP é a **língua da carta**.

---

## 2. O que acontece ao digitar `https://loja.com/produtos`

### Passo 1: DNS, descobrir o IP
Computadores se falam por **IP** (`203.0.113.10`), não por nome. O **DNS** (*Domain Name System*) é a "lista telefônica" da internet.

1. O navegador olha seu **cache**, depois o do sistema operacional.
2. Se não achar, pergunta a um **resolver recursivo** (do provedor ou `8.8.8.8`, `1.1.1.1`).
3. O resolver consulta a hierarquia: **servidores raiz** → servidor do **TLD** (`.com`) → servidor **autoritativo** do domínio (`loja.com`), que responde o IP.
4. A resposta é **cacheada** pelo tempo do **TTL** do registro.

Tipos de registro que valem saber: **A** (nome → IPv4), **AAAA** (IPv6), **CNAME** (apelido para outro nome), **MX** (e-mail), **TXT** (verificações, SPF).

Por que importa: mudanças de DNS demoram por causa do TTL (a "propagação"); e CDNs usam DNS para mandar o usuário para o servidor **mais próximo**.

### Passo 2: TCP, abrir a conexão
**TCP** (*Transmission Control Protocol*) garante entrega **confiável e em ordem** (reenvia pacotes perdidos, controla fluxo). Antes de trocar dados, faz o **three-way handshake**:
```
Cliente → SYN      → Servidor
Cliente ← SYN-ACK  ← Servidor
Cliente → ACK      → Servidor      (conexão estabelecida)
```
Isso custa **uma ida e volta** (*round trip*, RTT) antes de qualquer dado.

**UDP** é a alternativa sem conexão e sem garantia de entrega: mais rápido, usado em vídeo ao vivo, jogos, DNS e no HTTP/3.

### Passo 3: TLS, criptografar
Com **HTTPS**, antes do HTTP acontece o **handshake TLS** (*Transport Layer Security*; o antigo SSL):
1. O servidor apresenta seu **certificado** (assinado por uma **autoridade certificadora**, CA), provando que é mesmo `loja.com`.
2. Cliente e servidor combinam, usando **criptografia assimétrica** (chave pública/privada), uma **chave de sessão**.
3. Dali em diante, tudo usa **criptografia simétrica** com essa chave (bem mais rápida).

O TLS garante: **confidencialidade** (ninguém lê), **integridade** (ninguém altera) e **autenticidade** (é o servidor certo). Custa mais ida e volta (o TLS 1.3 reduziu para 1).

### Passo 4: HTTP, pedir e responder
```
GET /produtos HTTP/1.1
Host: loja.com
Accept: text/html
Cookie: sessao=abc123
```
O servidor processa (roteia, consulta banco, monta resposta) e responde:
```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: max-age=60

<html>...</html>
```

### Passo 5: o navegador renderiza
Faz o parse do HTML, descobre CSS, JS, imagens e dispara **novas requisições** para cada um (reaproveitando a conexão), monta a página e executa o JS.

---

## 3. O que existe no caminho (infraestrutura)

Na vida real, a requisição raramente vai direto para a sua aplicação:
```
Navegador → DNS
         → CDN (Cloudflare, CloudFront)       cache de estáticos, proteção DDoS, TLS
         → Load Balancer                      distribui entre instâncias
         → Reverse proxy (Nginx) / API Gateway
         → Sua aplicação (várias réplicas)
         → Banco, cache, filas, outros serviços
```
- **Proxy (forward)**: fica do lado do **cliente** (ex: proxy corporativo).
- **Reverse proxy**: fica do lado do **servidor**, na frente das aplicações: termina TLS, faz cache, compressão, roteamento.
- **CDN**: rede de servidores espalhados pelo mundo que guardam cópias do conteúdo **perto do usuário**.

Voltaremos a cada um nas aulas de cache (07) e escalabilidade (10).

---

## 4. Latência: por que as idas e voltas importam

**Latência** é o tempo de ida e volta. Dentro do mesmo datacenter: menos de 1 ms. De São Paulo aos EUA: ~120 ms. Cada handshake custa RTTs.

Por isso:
- **Reaproveitar conexões** (keep-alive, pool de conexões com o banco).
- **CDN** perto do usuário.
- **HTTP/2 e HTTP/3** (aula 02) reduzem idas e voltas.
- Servidor da aplicação **perto do banco**.
- Evitar **waterfalls** (uma requisição esperando a outra).

---

## 5. Como falar na entrevista

**"O que acontece quando você digita uma URL no navegador?"**
> "Primeiro o DNS resolve o nome pra um IP, passando pelos caches e, se precisar, pelo resolver recursivo, que consulta raiz, TLD e o servidor autoritativo. Aí o navegador abre uma conexão TCP com o three-way handshake e, sendo HTTPS, faz o handshake TLS: o servidor apresenta o certificado e eles combinam uma chave simétrica. Então vai a requisição HTTP, com método, caminho e headers. No caminho normalmente tem CDN, load balancer e reverse proxy antes de chegar na aplicação, que consulta banco e cache e devolve a resposta com status e headers. Por fim o navegador faz o parse do HTML, busca CSS, JS e imagens e renderiza."

---

## 6. Resumo

- Camadas: **aplicação (HTTP) / transporte (TCP, UDP) / rede (IP)**; IP + porta.
- **DNS**: nome → IP; resolver recursivo, raiz, TLD, autoritativo; **TTL**; A, AAAA, CNAME.
- **TCP**: confiável, ordenado, **three-way handshake**. **UDP**: sem garantia, rápido.
- **TLS**: certificado + CA, assimétrica pra combinar chave, simétrica pro resto; confidencialidade, integridade, autenticidade.
- **HTTP**: requisição (método, caminho, headers, corpo) e resposta (status, headers, corpo).
- Caminho real: CDN → load balancer → reverse proxy → app.
- **Latência/RTT**: reaproveitar conexões, CDN, proximidade.

## Termos desta aula
cliente-servidor · TCP/IP · camada de aplicação · camada de transporte · IP · porta · DNS · resolver recursivo · servidor raiz · TLD · servidor autoritativo · TTL · registro A · CNAME · TCP · UDP · three-way handshake · RTT · latência · TLS · SSL · HTTPS · certificado · autoridade certificadora · criptografia assimétrica · criptografia simétrica · proxy · reverse proxy · CDN · load balancer

## Treine
As perguntas desta aula estão em [`../perguntas/`](../perguntas/), marcadas com **Aula 01** e separadas por nível.
