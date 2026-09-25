import { existeArquivo, lerArquivo, listarPaginas, rotaDoArquivo } from "./arquivos";
import { semPrefixoDeAula, tituloDoMarkdown } from "./titulo";

export type TipoTrilha = "fundamentos" | "linguagem" | "runtime" | "biblioteca" | "framework";

export type Aula = { rota: string; numero: string; titulo: string };

export type Trilha = {
  id: string;
  titulo: string;
  tipo: TipoTrilha;
  base?: string;
  ordem: number;
  descricao?: string;
  rota: string;
  aulas: Aula[];
  totalPerguntas: number;
  rotaPerguntas?: string;
  rotaGlossario?: string;
};

export type PaginaAvulsa = { rota: string; titulo: string };

export const GRUPOS: { tipo: TipoTrilha; rotulo: string }[] = [
  { tipo: "fundamentos", rotulo: "Fundamentos" },
  { tipo: "linguagem", rotulo: "Linguagens" },
  { tipo: "runtime", rotulo: "Runtimes" },
  { tipo: "biblioteca", rotulo: "Bibliotecas" },
  { tipo: "framework", rotulo: "Frameworks" },
];

const NIVEIS = [1, 2, 3];

function contarPerguntas(id: string) {
  return NIVEIS.reduce((total, n) => {
    const arquivo = `${id}/perguntas/nivel-${n}.md`;
    if (!existeArquivo(arquivo)) return total;
    return total + (lerArquivo(arquivo).markdown.match(/^\*\*\d+\.\s/gm)?.length ?? 0);
  }, 0);
}

function montarTrilha(id: string): Trilha {
  const { dados, markdown } = lerArquivo(`${id}/README.md`);

  const aulas = listarPaginas()
    .filter((p) => p.arquivo.startsWith(`${id}/aulas/`))
    .sort((a, b) => a.arquivo.localeCompare(b.arquivo))
    .map((p) => {
      const nome = p.arquivo.split("/").at(-1)!;
      return {
        rota: p.rota,
        numero: nome.slice(0, 2),
        titulo: semPrefixoDeAula(tituloDoMarkdown(lerArquivo(p.arquivo).markdown, p.arquivo)),
      };
    });

  const perguntas = `${id}/perguntas/README.md`;
  const glossario = `${id}/glossario.md`;

  return {
    id,
    titulo: String(dados.titulo ?? tituloDoMarkdown(markdown, `${id}.md`)),
    tipo: (dados.tipo as TipoTrilha) ?? "linguagem",
    base: dados.base ? String(dados.base) : undefined,
    ordem: Number(dados.ordem ?? 99),
    descricao: dados.descricao ? String(dados.descricao) : undefined,
    rota: `/${id}`,
    aulas,
    totalPerguntas: contarPerguntas(id),
    rotaPerguntas: existeArquivo(perguntas) ? rotaDoArquivo(perguntas) : undefined,
    rotaGlossario: existeArquivo(glossario) ? rotaDoArquivo(glossario) : undefined,
  };
}

let cache: Trilha[] | undefined;

export function listarTrilhas(): Trilha[] {
  cache ??= listarPaginas()
    .filter((p) => /^[^/]+\/README\.md$/.test(p.arquivo))
    .map((p) => montarTrilha(p.arquivo.split("/")[0]))
    .sort((a, b) => a.ordem - b.ordem || a.titulo.localeCompare(b.titulo));
  return cache;
}

export function buscarTrilha(id: string) {
  return listarTrilhas().find((t) => t.id === id);
}

/** Arquivos soltos na raiz de conteudo/, como o dicionário. */
export function listarAvulsas(): PaginaAvulsa[] {
  return listarPaginas()
    .filter((p) => !p.arquivo.includes("/"))
    .map((p) => ({ rota: p.rota, titulo: tituloDoMarkdown(lerArquivo(p.arquivo).markdown, p.arquivo) }));
}
