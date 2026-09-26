import Image from "next/image";
import Link from "next/link";

const EXEMPLOS = [
  ["\"Joguei pra rodar em segundo plano\"", "Processamento assíncrono com fila"],
  ["\"Se der erro ele tenta de novo, esperando mais a cada vez\"", "Retry com backoff exponencial"],
  ["\"A API não guarda nada na memória dela\"", "API stateless"],
];

export function Dicionario() {
  return (
    <section className="py-8 sm:py-12">
      <div className="grid overflow-hidden rounded-[2rem] border border-[#e6e0d3] bg-[#eee9dc] lg:grid-cols-[0.82fr_1.18fr] dark:border-zinc-800 dark:bg-zinc-900">
        <div className="relative min-h-64 overflow-hidden sm:min-h-80 lg:min-h-full">
          <Image src="/images/faladev-dicionario.jpg" alt="Cartões ilustrando a transformação de uma conversa em conceitos técnicos" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
        </div>
        <div className="p-6 sm:p-10 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">Do seu jeito de falar ao termo certo</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Dicionário do dia a dia</h2>
          <p className="mt-3 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
            O jeito mais rápido de destravar o vocabulário: o que você fala no dia a dia, o nome técnico e como falar isso
            numa entrevista.
          </p>
          <ul className="mt-6 space-y-3">
            {EXEMPLOS.map(([fala, termo]) => (
              <li key={termo} className="flex flex-col gap-1 rounded-xl border border-white/80 bg-white/65 p-3 text-sm sm:flex-row sm:items-center sm:gap-3 dark:border-zinc-700 dark:bg-zinc-800">
                <span className="text-zinc-600 dark:text-zinc-400">{fala}</span>
                <span className="hidden text-emerald-700 sm:inline">→</span>
                <strong className="text-emerald-950 dark:text-emerald-300">{termo}</strong>
              </li>
            ))}
          </ul>
          <Link
            href="/dicionario-do-dia-a-dia"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Abrir o dicionário <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
