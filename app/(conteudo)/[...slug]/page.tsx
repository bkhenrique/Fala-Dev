import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown/Markdown";
import { NavegacaoAulas } from "@/components/NavegacaoAulas";
import { lerPagina, listarPaginas, PASTA_CONTEUDO } from "@/lib/conteudo/arquivos";
import { tituloDoMarkdown } from "@/lib/conteudo/titulo";
import { buscarTrilha } from "@/lib/conteudo/trilhas";
import { urlArquivoNoGithub } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return listarPaginas().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/[...slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const pagina = lerPagina(slug);
  if (!pagina) return {};

  const trilha = buscarTrilha(slug[0]);
  const titulo = tituloDoMarkdown(pagina.markdown, pagina.arquivo);
  return {
    title: trilha && !titulo.includes(trilha.titulo) ? `${titulo} · ${trilha.titulo}` : titulo,
    description: typeof pagina.dados.descricao === "string" ? pagina.dados.descricao : trilha?.descricao,
  };
}

export default async function PaginaDeConteudo(props: PageProps<"/[...slug]">) {
  const { slug } = await props.params;
  const pagina = lerPagina(slug);
  if (!pagina) notFound();

  const trilha = buscarTrilha(slug[0]);
  const indiceAula = trilha?.aulas.findIndex((a) => a.rota === pagina.rota) ?? -1;
  const urlEdicao = urlArquivoNoGithub(`${PASTA_CONTEUDO}/${pagina.arquivo}`, "edit");

  return (
    <article className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
        {trilha && pagina.rota !== trilha.rota && (
          <Link href={trilha.rota} className="hover:text-emerald-700 dark:hover:text-emerald-400">
            ← {trilha.titulo}
          </Link>
        )}
        {urlEdicao && (
          <a href={urlEdicao} target="_blank" rel="noreferrer" className="ml-auto hover:text-emerald-700 dark:hover:text-emerald-400">
            Editar esta página no GitHub
          </a>
        )}
      </div>

      <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-emerald-700 dark:prose-a:text-emerald-400 prose-pre:bg-zinc-900 prose-table:text-sm">
        <Markdown markdown={pagina.markdown} arquivo={pagina.arquivo} />
      </div>

      {trilha && indiceAula >= 0 && (
        <NavegacaoAulas anterior={trilha.aulas[indiceAula - 1]} proxima={trilha.aulas[indiceAula + 1]} />
      )}
    </article>
  );
}
