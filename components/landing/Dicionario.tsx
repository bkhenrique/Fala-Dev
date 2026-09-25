import Link from "next/link";

const EXEMPLOS = [
  ["\"Joguei pra rodar em segundo plano\"", "Processamento assíncrono com fila"],
  ["\"Se der erro ele tenta de novo, esperando mais a cada vez\"", "Retry com backoff exponencial"],
  ["\"A API não guarda nada na memória dela\"", "API stateless"],
];

export function Dicionario() {
  return (
    <section className="py-12">
      <div className="rounded-2xl border border-emerald-600/30 bg-emerald-50/60 p-6 sm:p-8 dark:bg-emerald-950/30">
        <h2 className="text-2xl font-bold tracking-tight">Dicionário do dia a dia</h2>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          O jeito mais rápido de destravar o vocabulário: o que você fala no dia a dia, o nome técnico e como falar isso
          numa entrevista.
        </p>
        <ul className="mt-6 space-y-3">
          {EXEMPLOS.map(([fala, termo]) => (
            <li key={termo} className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:gap-3">
              <span className="text-zinc-600 dark:text-zinc-400">{fala}</span>
              <span className="hidden text-emerald-600 sm:inline">→</span>
              <strong>{termo}</strong>
            </li>
          ))}
        </ul>
        <Link
          href="/dicionario-do-dia-a-dia"
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
        >
          Abrir o dicionário
        </Link>
      </div>
    </section>
  );
}
