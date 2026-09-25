import { urlArquivoNoGithub } from "@/lib/site";

export function Contribuir() {
  const guia = urlArquivoNoGithub("CONTRIBUTING.md");

  return (
    <section className="my-12 rounded-2xl bg-zinc-100 p-8 dark:bg-zinc-900">
      <h2 className="text-2xl font-bold tracking-tight">Quer ajudar?</h2>
      <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Todo o conteúdo é Markdown num repositório aberto. Dá pra corrigir um erro, melhorar uma explicação, criar uma
        aula ou uma trilha nova (PHP, Laravel, Python…). Quem tem PR aceito aparece no rodapé do site.
      </p>
      {guia && (
        <a
          href={guia}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-lg bg-zinc-900 px-5 py-3 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Como contribuir
        </a>
      )}
    </section>
  );
}
