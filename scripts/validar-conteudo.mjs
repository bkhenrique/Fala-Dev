// Confere se o conteúdo segue o padrão descrito no CONTRIBUTING.md.
// Uso: pnpm validar   (roda também no CI de cada PR)
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const RAIZ = process.cwd();
const CONTEUDO = path.join(RAIZ, "conteudo");
const LIMITE_LINHAS = 500;
const TIPOS = ["fundamentos", "linguagem", "runtime", "biblioteca", "framework"];
const NOME_ARQUIVO = /^[a-z0-9]+(-[a-z0-9]+)*\.md$/;
const NOME_AULA = /^(\d{2})-[a-z0-9]+(-[a-z0-9]+)*\.md$/;
const NIVEIS = [1, 2, 3];

const erros = [];
const rel = (p) => path.relative(RAIZ, p);
const erro = (arquivo, mensagem, linha) => erros.push({ arquivo: rel(arquivo), linha, mensagem });
const ler = (p) => fs.readFileSync(p, "utf8");
const linhaDe = (texto, indice) => texto.slice(0, indice).split("\n").length;

function listarRecursivo(dir, filtro) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name.startsWith(".") || e.name === "node_modules") return [];
    const p = path.join(dir, e.name);
    return e.isDirectory() ? listarRecursivo(p, filtro) : filtro(e.name) ? [p] : [];
  });
}

function validarTamanho(arquivo) {
  const linhas = ler(arquivo).split("\n").length;
  if (linhas > LIMITE_LINHAS) {
    erro(arquivo, `tem ${linhas} linhas (máximo ${LIMITE_LINHAS}). Divida em arquivos menores.`);
  }
}

function validarLinks(arquivo) {
  const texto = ler(arquivo).replace(/```[\s\S]*?```/g, (bloco) => bloco.replace(/[^\n]/g, " "));
  for (const m of texto.matchAll(/\]\(([^)\s]+)\)/g)) {
    const href = m[1].split("#")[0];
    if (!href || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("/")) continue;
    const alvo = path.resolve(path.dirname(arquivo), href);
    if (!fs.existsSync(alvo)) erro(arquivo, `link quebrado: ${m[1]}`, linhaDe(texto, m.index));
  }
}

function validarTrilha(id) {
  const dir = path.join(CONTEUDO, id);
  const readme = path.join(dir, "README.md");

  const obrigatorios = ["README.md", "glossario.md", "aulas", "perguntas/README.md", ...NIVEIS.map((n) => `perguntas/nivel-${n}.md`)];
  for (const obrigatorio of obrigatorios) {
    if (!fs.existsSync(path.join(dir, obrigatorio))) {
      erro(dir, `a trilha precisa ter ${obrigatorio} (copie de _modelos/trilha/).`);
    }
  }
  if (!fs.existsSync(readme)) return;

  const { data, content } = matter(ler(readme));
  if (typeof data.titulo !== "string") erro(readme, "frontmatter sem `titulo`.");
  if (!TIPOS.includes(data.tipo)) erro(readme, `frontmatter \`tipo\` deve ser: ${TIPOS.join(", ")}.`);
  if (typeof data.ordem !== "number") erro(readme, "frontmatter sem `ordem` (número da posição no menu).");
  if (typeof data.descricao !== "string") erro(readme, "frontmatter sem `descricao` (frase do card na home).");
  if (data.base && !fs.existsSync(path.join(CONTEUDO, String(data.base), "README.md"))) {
    erro(readme, `frontmatter \`base: ${data.base}\` aponta pra uma trilha que não existe.`);
  }

  const dirAulas = path.join(dir, "aulas");
  if (fs.existsSync(dirAulas)) validarAulas(dirAulas, content, readme);
  for (const n of NIVEIS) {
    const arquivo = path.join(dir, "perguntas", `nivel-${n}.md`);
    if (fs.existsSync(arquivo)) validarPerguntas(arquivo, n, dirAulas);
  }
  validarIndicePerguntas(path.join(dir, "perguntas"));
  if (fs.existsSync(path.join(dir, "glossario.md"))) validarGlossario(path.join(dir, "glossario.md"));
}

function validarAulas(dirAulas, conteudoReadme, readme) {
  const arquivos = fs.readdirSync(dirAulas).filter((n) => n.endsWith(".md")).sort();

  arquivos.forEach((nome, i) => {
    const arquivo = path.join(dirAulas, nome);
    const m = nome.match(NOME_AULA);
    if (!m) {
      erro(arquivo, "nome de aula deve ser `NN-nome-da-aula.md` (minúsculas, hífen, sem acento).");
      return;
    }
    const esperado = String(i + 1).padStart(2, "0");
    if (m[1] !== esperado) erro(arquivo, `numeração fora de ordem: esperado ${esperado}-..., veio ${m[1]}-...`);

    const texto = ler(arquivo);
    if (!texto.startsWith(`# Aula ${m[1]} — `)) {
      erro(arquivo, `a primeira linha deve ser "# Aula ${m[1]} — Título da aula".`, 1);
    }
    const secoes = [
      [/^> \*\*Objetivo:\*\*/m, "> **Objetivo:** ..."],
      [/^## (\d+\. )?Como falar/m, "## N. Como falar na entrevista"],
      [/^## (\d+\. )?Resumo/m, "## N. Resumo"],
      [/^## Termos desta aula/m, "## Termos desta aula"],
      [/^## Treine/m, "## Treine"],
    ];
    for (const [regex, exemplo] of secoes) {
      if (!regex.test(texto)) erro(arquivo, `falta a seção "${exemplo}" (veja _modelos/aula.md).`);
    }
    if (!conteudoReadme.includes(`](aulas/${nome})`)) {
      erro(readme, `a aula ${nome} não está listada no README da trilha.`);
    }
  });

  for (const m of conteudoReadme.matchAll(/\]\(aulas\/([^)]+)\)/g)) {
    if (!arquivos.includes(m[1])) erro(readme, `o README lista aulas/${m[1]}, que não existe.`);
  }
}

function validarPerguntas(arquivo, nivel, dirAulas) {
  const texto = ler(arquivo);
  if (!new RegExp(`^# .+ — perguntas, nível ${nivel}: `).test(texto)) {
    erro(arquivo, `a primeira linha deve ser "# Trilha — perguntas, nível ${nivel}: ..." (veja _modelos/trilha/perguntas/).`, 1);
  }

  const linhas = texto.split("\n");
  let esperado = 1;
  linhas.forEach((linha, i) => {
    const m = linha.match(/^\*\*(\d+)\. .+\*\*$/);
    if (!m) return;
    const n = i + 1;
    if (Number(m[1]) !== esperado) erro(arquivo, `pergunta numerada ${m[1]}, esperado ${esperado}. Renumere as seguintes.`, n);
    esperado = Number(m[1]) + 1;

    const aula = linhas[i + 1]?.match(/^<sub>Aula \[\d{2} — .+\]\(\.\.\/aulas\/([^)]+)\)<\/sub>$/);
    if (!aula) erro(arquivo, 'depois da pergunta vem a linha "<sub>Aula [NN — Título](../aulas/NN-arquivo.md)</sub>".', n + 1);
    else if (!fs.existsSync(path.join(dirAulas, aula[1]))) erro(arquivo, `a pergunta aponta pra aulas/${aula[1]}, que não existe.`, n + 1);

    if (linhas[i + 2] !== "<details><summary>Ver resposta</summary>" || linhas[i + 3] !== "") {
      erro(arquivo, 'a resposta deve começar com "<details><summary>Ver resposta</summary>" seguido de uma linha em branco.', n + 2);
    }
    const fim = linhas.findIndex((l, j) => j > i && l.trim() === "</details>");
    const proxima = linhas.findIndex((l, j) => j > i && /^\*\*\d+\. /.test(l));
    if (fim < 0 || (proxima > 0 && fim > proxima)) erro(arquivo, "a resposta não fecha com </details>.", n);
    else if (linhas[fim - 1] !== "") erro(arquivo, "deixe uma linha em branco antes do </details>.", fim + 1);
  });
}

function validarIndicePerguntas(dir) {
  const indice = path.join(dir, "README.md");
  if (!fs.existsSync(indice)) return;
  const texto = ler(indice);
  for (const n of NIVEIS) {
    const arquivo = path.join(dir, `nivel-${n}.md`);
    if (!fs.existsSync(arquivo)) continue;
    const real = ler(arquivo).match(/^\*\*\d+\. /gm)?.length ?? 0;
    const linha = texto.match(new RegExp(`\\(nivel-${n}\\.md\\).*\\| (\\d+) \\|$`, "m"));
    if (!linha) erro(indice, `falta a linha do nível ${n} na tabela (veja _modelos/trilha/perguntas/README.md).`);
    else if (Number(linha[1]) !== real) erro(indice, `a tabela diz ${linha[1]} perguntas no nível ${n}, mas o arquivo tem ${real}.`);
  }
}

function validarGlossario(arquivo) {
  const texto = ler(arquivo);
  const blocos = texto.split(/^(?=### )/m).slice(1);
  let offset = texto.indexOf("### ");
  for (const bloco of blocos) {
    const termo = bloco.split("\n")[0].replace("### ", "");
    for (const campo of ["Em uma frase", "Traduzindo", "Como falar"]) {
      if (!bloco.includes(`- **${campo}:**`)) {
        erro(arquivo, `o termo "${termo}" não tem "- **${campo}:**" (veja _modelos/termo.md).`, linhaDe(texto, offset));
      }
    }
    offset += bloco.length;
  }
}

// ---------------------------------------------------------------------------

const trilhas = fs.readdirSync(CONTEUDO, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
trilhas.forEach(validarTrilha);

const markdowns = listarRecursivo(CONTEUDO, (n) => n.endsWith(".md"));
for (const arquivo of markdowns) {
  const nome = path.basename(arquivo);
  if (nome !== "README.md" && !NOME_ARQUIVO.test(nome)) {
    erro(arquivo, "nome de arquivo deve ser minúsculo, com hífen e sem acento (ex.: filas-bullmq.md).");
  }
  if (/Eu já usei quando/.test(ler(arquivo))) erro(arquivo, 'o campo "Eu já usei quando" é pessoal e não entra no conteúdo público.');
  validarTamanho(arquivo);
  validarLinks(arquivo);
}

const codigo = ["app", "components", "lib", "scripts"]
  .map((d) => path.join(RAIZ, d))
  .filter(fs.existsSync)
  .flatMap((d) => listarRecursivo(d, (n) => /\.(ts|tsx|js|mjs|css)$/.test(n)));
codigo.forEach(validarTamanho);

if (erros.length) {
  console.error(`\n✖ ${erros.length} problema(s) encontrado(s):\n`);
  for (const e of erros) console.error(`  ${e.arquivo}${e.linha ? `:${e.linha}` : ""}\n    ${e.mensagem}\n`);
  console.error("Padrão completo: CONTRIBUTING.md e modelos em _modelos/.\n");
  process.exit(1);
}
console.log(`✓ Conteúdo no padrão: ${trilhas.length} trilhas, ${markdowns.length} arquivos .md, ${codigo.length} arquivos de código.`);
