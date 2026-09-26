import Link from "next/link";
import { URL_REPOSITORIO } from "@/lib/site";
import { BotaoTema } from "./BotaoTema";
import { IconeGithub } from "./IconeGithub";

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e8e4db] bg-[var(--background)]/90 backdrop-blur-xl dark:border-zinc-800">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-900 text-sm text-white dark:bg-emerald-600">F</span>
          <span>Fala<span className="text-emerald-700 dark:text-emerald-400">Dev</span></span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          <Link href="/#trilhas" className="rounded-lg px-3 py-2 font-medium text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Trilhas
          </Link>
          <Link href="/dicionario-do-dia-a-dia" className="rounded-lg px-3 py-2 font-medium text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Dicionário
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
