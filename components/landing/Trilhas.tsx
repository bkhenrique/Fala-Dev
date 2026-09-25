import Link from "next/link";
import { GRUPOS, type Trilha } from "@/lib/conteudo/trilhas";

export function Trilhas({ trilhas }: { trilhas: Trilha[] }) {
  const titulos = new Map(trilhas.map((t) => [t.id, t.titulo]));

  return (
    <section id="trilhas" className="scroll-mt-20 py-12">
      <h2 className="text-2xl font-bold tracking-tight">Trilhas</h2>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Comece por Fundamentos: é o que mais aparece em entrevista, seja qual for a stack.
      </p>
      {GRUPOS.map((grupo) => {
        const doGrupo = trilhas.filter((t) => t.tipo === grupo.tipo);
        if (!doGrupo.length) return null;
        return (
          <div key={grupo.tipo} className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">{grupo.rotulo}</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {doGrupo.map((t) => (
                <Link
                  key={t.id}
                  href={t.rota}
                  className="group rounded-xl border border-zinc-200 p-5 transition-colors hover:border-emerald-500 dark:border-zinc-800"
                >
                  <p className="font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{t.titulo}</p>
                  {t.descricao && <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.descricao}</p>}
                  <p className="mt-4 text-xs text-zinc-500">
                    {t.aulas.length} aulas · {t.totalPerguntas} perguntas
                    {t.base && titulos.has(t.base) && <> · antes, veja {titulos.get(t.base)}</>}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
