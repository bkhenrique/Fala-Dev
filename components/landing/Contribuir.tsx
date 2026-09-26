import { urlArquivoNoGithub } from "@/lib/site";

export function Contribuir() {
  const guia = urlArquivoNoGithub("CONTRIBUTING.md");

  return (
    <section className="my-12 rounded-[2rem] border border-[#e6e0d3] bg-[#eee9dc] p-6 sm:my-16 sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">Feito em comunidade</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Conhecimento bom se compartilha.</h2>
        <p className="mt-3 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
          Todo o conteúdo é Markdown num repositório aberto. Dá pra corrigir um erro, melhorar uma explicação, criar uma
          aula ou uma trilha nova (PHP, Laravel, Python…). Quem tem PR aceito aparece no rodapé do site.
        </p>
        {guia && (
          <a
            href={guia}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Como contribuir <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </section>
  );
}
