import Link from "next/link";
import { GRUPOS, type Trilha } from "@/lib/conteudo/trilhas";

export function Trilhas({ trilhas }: { trilhas: Trilha[] }) {
  const titulos = new Map(trilhas.map((t) => [t.id, t.titulo]));

  return (
    <section id="trilhas" className="scroll-mt-20 py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">Seu próximo passo</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Escolha sua trilha</h2>
        </div>
        <p className="max-w-lg text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Comece por Fundamentos: é o que mais aparece em entrevista, seja qual for a stack.
        </p>
      </div>
      {GRUPOS.map((grupo) => {
        const doGrupo = trilhas.filter((t) => t.tipo === grupo.tipo);
        if (!doGrupo.length) return null;
        return (
          <div key={grupo.tipo} className="mt-8">
            <h3 className="mb-3 mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              <span className="h-px w-7 bg-[#e67652]" />{grupo.rotulo}
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {doGrupo.map((t) => (
                <Link
                  key={t.id}
                  href={t.rota}
                  className="group relative overflow-hidden rounded-2xl border border-[#e6e0d3] bg-white/75 p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-800/30 hover:shadow-xl hover:shadow-emerald-950/5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="absolute right-5 top-5 text-lg text-zinc-400 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-emerald-800 dark:group-hover:text-emerald-400" aria-hidden="true">↗</span>
                  <span className="inline-flex rounded-full bg-[#e8eee5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">{grupo.rotulo}</span>
                  <p className="mt-4 pr-8 text-lg font-semibold tracking-tight group-hover:text-emerald-800 dark:group-hover:text-emerald-400">{t.titulo}</p>
                  {t.descricao && <p className="mt-2 min-h-10 text-sm leading-5 text-zinc-600 dark:text-zinc-400">{t.descricao}</p>}
                  <p className="mt-5 border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-zinc-800">
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
