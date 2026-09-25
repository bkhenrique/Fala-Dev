import Link from "next/link";
import { URL_REPOSITORIO } from "@/lib/site";
import { BotaoTema } from "./BotaoTema";
import { IconeGithub } from "./IconeGithub";

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-[var(--background)]/85 backdrop-blur dark:border-zinc-800">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Fala<span className="text-emerald-600 dark:text-emerald-400">Dev</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          <Link href="/#trilhas" className="rounded-md px-3 py-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Trilhas
          </Link>
          {URL_REPOSITORIO && (
            <a
              href={URL_REPOSITORIO}
              target="_blank"
              rel="noreferrer"
              aria-label="Repositório no GitHub"
              className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <IconeGithub />
            </a>
          )}
          <BotaoTema />
        </nav>
      </div>
    </header>
  );
}
