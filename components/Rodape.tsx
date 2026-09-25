import Image from "next/image";
import { buscarContribuidores } from "@/lib/contribuidores";
import { URL_REPOSITORIO } from "@/lib/site";
import { IconeGithub } from "./IconeGithub";

export async function Rodape() {
  const contribuidores = await buscarContribuidores();

  return (
    <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 text-sm text-zinc-500">
        {contribuidores.length > 0 && (
          <div>
            <p className="mb-3 font-medium text-zinc-700 dark:text-zinc-300">Quem já contribuiu</p>
            <ul className="flex flex-wrap gap-2">
              {contribuidores.map((c) => (
                <li key={c.login}>
                  <a
                    href={c.perfil}
                    target="_blank"
                    rel="noreferrer"
                    title={`@${c.login}`}
                    className="flex items-center gap-2 rounded-full border border-zinc-200 py-1 pl-1 pr-3 hover:border-emerald-500 dark:border-zinc-800"
                  >
                    <Image src={c.avatar} alt="" width={24} height={24} className="rounded-full" />
                    @{c.login}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>
            <strong className="text-zinc-700 dark:text-zinc-300">FalaDev</strong> · teoria de desenvolvimento pra quem
            quer saber explicar o que faz.
          </span>
          {URL_REPOSITORIO && (
            <a href={URL_REPOSITORIO} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100">
              <IconeGithub className="size-4" /> Código e conteúdo no GitHub
            </a>
          )}
          <span className="lg:ml-auto">
            Criado por{" "}
            <a href="https://github.com/bkhenrique" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              @bkhenrique
            </a>{" "}
            · Código MIT · Conteúdo CC BY 4.0
          </span>
        </div>
      </div>
    </footer>
  );
}
