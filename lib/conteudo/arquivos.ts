import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const PASTA_CONTEUDO = "conteudo";
const RAIZ = path.join(process.cwd(), PASTA_CONTEUDO);

export type Pagina = {
  rota: string;
  slug: string[];
  /** caminho relativo a conteudo/, sempre com "/" */
  arquivo: string;
};

export type PaginaLida = Pagina & {
  dados: Record<string, unknown>;
  markdown: string;
};

function listarMarkdown(dir: string, prefixo = ""): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entrada) => {
    if (entrada.name.startsWith(".") || entrada.name.startsWith("_")) return [];
    const relativo = prefixo ? `${prefixo}/${entrada.name}` : entrada.name;
    if (entrada.isDirectory()) return listarMarkdown(path.join(dir, entrada.name), relativo);
    return entrada.name.endsWith(".md") ? [relativo] : [];
  });
}

export function rotaDoArquivo(arquivo: string) {
  const partes = arquivo.replace(/\.md$/, "").split("/").filter(Boolean);
  if (partes.at(-1) === "README") partes.pop();
  return "/" + partes.join("/");
}

let cache: Pagina[] | undefined;

export function listarPaginas(): Pagina[] {
  cache ??= listarMarkdown(RAIZ).map((arquivo) => {
    const rota = rotaDoArquivo(arquivo);
    return { rota, arquivo, slug: rota.split("/").filter(Boolean) };
  });
  return cache;
}

export function lerArquivo(arquivo: string) {
  const { data, content } = matter(fs.readFileSync(path.join(RAIZ, arquivo), "utf8"));
  return { dados: data as Record<string, unknown>, markdown: content };
}

export function lerPagina(slug: string[]): PaginaLida | undefined {
  const rota = "/" + slug.join("/");
  const pagina = listarPaginas().find((p) => p.rota === rota);
  return pagina && { ...pagina, ...lerArquivo(pagina.arquivo) };
}

export function existeArquivo(arquivo: string) {
  return fs.existsSync(path.join(RAIZ, arquivo));
}
