import Link from "next/link";

export function Hero({ rotaInicial, totalAulas, totalPerguntas }: { rotaInicial: string; totalAulas: number; totalPerguntas: number }) {
  return (
    <section className="py-16 sm:py-24">
      <p className="mb-4 inline-block rounded-full border border-emerald-600/30 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
        Aberto, gratuito e sem cadastro
      </p>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
        Aprenda a <em className="text-emerald-600 not-italic dark:text-emerald-400">falar</em> o que você já sabe fazer.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
        Você programa, mas trava na entrevista na hora de explicar? O FalaDev ensina a teoria por trás do dia a dia:
        o nome das coisas, o porquê de cada decisão e como responder com segurança.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href={rotaInicial}
          className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
        >
          Começar a estudar
        </Link>
        <Link href="#trilhas" className="rounded-lg px-5 py-3 font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
          Ver trilhas
        </Link>
        <span className="text-sm text-zinc-500">
          {totalAulas} aulas · {totalPerguntas} perguntas de entrevista
        </span>
      </div>
    </section>
  );
}
