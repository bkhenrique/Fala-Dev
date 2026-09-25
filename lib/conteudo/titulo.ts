export function tituloDoMarkdown(markdown: string, arquivo: string) {
  const h1 = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (h1) return h1;

  const nome = arquivo.split("/").at(-1)!.replace(/\.md$/, "").replace(/^\d+-/, "").replace(/-/g, " ");
  return nome.charAt(0).toUpperCase() + nome.slice(1);
}

/** "Aula 03 — Event Loop em profundidade" → "Event Loop em profundidade" */
export function semPrefixoDeAula(titulo: string) {
  return titulo.replace(/^Aula\s+\d+\s+—\s+/, "");
}
