import Link from "next/link";
import Image from "next/image";

export function Hero({ rotaInicial, totalAulas, totalPerguntas }: { rotaInicial: string; totalAulas: number; totalPerguntas: number }) {
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-[#e6e0d3] bg-[#f4f0e5] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative z-10">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-800/15 bg-white/70 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-900 dark:border-emerald-300/20 dark:bg-zinc-800 dark:text-emerald-300">
            <span className="size-2 rounded-full bg-[#e67652]" /> ABERTO, GRATUITO E SEM CADASTRO
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#17271f] sm:text-5xl lg:text-6xl dark:text-white">
            Você já sabe fazer. <span className="text-emerald-800 dark:text-emerald-400">Agora aprenda a explicar.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-700 sm:text-lg dark:text-zinc-300">
            Entenda a teoria por trás do seu dia a dia, encontre o nome certo para cada coisa e fale com confiança na próxima entrevista.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={rotaInicial} className="rounded-xl bg-emerald-900 px-5 py-3.5 font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:-translate-y-0.5 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500">
              Começar a estudar <span aria-hidden="true">↗</span>
            </Link>
            <Link href="#trilhas" className="rounded-xl border border-zinc-300 bg-white/60 px-5 py-3.5 font-semibold text-zinc-800 transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700">
              Explorar trilhas
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <span><strong className="text-zinc-900 dark:text-white">{totalAulas}</strong> aulas práticas</span>
            <span><strong className="text-zinc-900 dark:text-white">{totalPerguntas}</strong> perguntas para treinar</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[640px] overflow-hidden rounded-[1.5rem] shadow-2xl shadow-emerald-950/10 ring-1 ring-black/5">
          <Image src="/images/faladev-hero.jpg" alt="Pessoa desenvolvedora explicando um fluxo de arquitetura de software" width={1774} height={887} priority sizes="(max-width: 1024px) 100vw, 48vw" className="h-auto w-full object-cover" />
          <div className="absolute bottom-4 left-4 rounded-xl border border-white/70 bg-[#fffdf7]/90 px-4 py-3 shadow-lg backdrop-blur sm:bottom-5 sm:left-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-900">Na prática → na teoria</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">Entenda. Conecte. Explique.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
