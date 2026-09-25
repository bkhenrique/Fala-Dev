import path from "node:path";
import { urlArquivoNoGithub } from "@/lib/site";
import { PASTA_CONTEUDO, rotaDoArquivo } from "./arquivos";

const EXTERNO = /^[a-z][a-z0-9+.-]*:/i;

/**
 * Converte um link relativo escrito no .md (ex.: "../perguntas.md", "aulas/01-x.md", "../spring/")
 * na rota do site, pra navegação funcionar igual no GitHub e no site.
 */
export function resolverLink(href: string, arquivoAtual: string): string {
  if (!href || EXTERNO.test(href) || href.startsWith("#") || href.startsWith("/")) return href;

  const [caminho, ancora] = href.split("#");
  let alvo = path.posix.normalize(path.posix.join(path.posix.dirname(arquivoAtual), caminho));

  if (alvo.startsWith("..")) {
    const foraDoConteudo = path.posix.normalize(path.posix.join(PASTA_CONTEUDO, alvo));
    return urlArquivoNoGithub(foraDoConteudo) ?? href;
  }

  if (!alvo.endsWith(".md")) alvo = path.posix.join(alvo, "README.md");
  const rota = rotaDoArquivo(alvo);
  return ancora ? `${rota}#${ancora}` : rota;
}
