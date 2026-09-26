const OBJETIVOS = [
  {
    titulo: "Dar nome ao que você faz",
    texto: "\"Joguei pra rodar em segundo plano\" vira \"processamento assíncrono com fila\". Você já faz, só falta o vocabulário.",
  },
  {
    titulo: "Entender o porquê",
    texto: "Cada aula começa pelo problema que o assunto resolve. Sabendo o porquê, você consegue comparar soluções e falar de trade-offs.",
  },
  {
    titulo: "Treinar a fala",
    texto: "Toda aula traz uma resposta modelo pra entrevista, e cada trilha tem perguntas em três níveis pra responder em voz alta.",
  },
];

export function ParaQueServe() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">Menos decoreba, mais clareza</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A teoria que conecta o que você faz.</h2>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {OBJETIVOS.map((o) => (
          <div key={o.titulo} className="group rounded-2xl border border-[#e6e0d3] bg-white/70 p-6 transition hover:-translate-y-1 hover:border-emerald-800/30 hover:shadow-xl hover:shadow-emerald-950/5 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#e8eee5] text-lg font-semibold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">{String(OBJETIVOS.indexOf(o) + 1).padStart(2, "0")}</span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{o.titulo}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{o.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
