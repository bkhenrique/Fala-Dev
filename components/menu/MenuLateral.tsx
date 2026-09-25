"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { aoMudarProgresso, contarConcluidas } from "@/lib/progresso";

export type TrilhaMenu = {
  id: string;
  titulo: string;
  rota: string;
  aulas: { rota: string; numero: string; titulo: string }[];
  rotaPerguntas?: string;
  rotaGlossario?: string;
};

export type GrupoMenu = { rotulo: string; trilhas: TrilhaMenu[] };

type Props = { grupos: GrupoMenu[]; avulsas: { rota: string; titulo: string }[] };

const normalizar = (rota: string) => (rota.length > 1 ? rota.replace(/\/$/, "") : rota);

function ItemMenu({ href, ativo, children }: { href: string; ativo: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={ativo ? "page" : undefined}
      className={`block rounded-md px-2 py-1 text-sm leading-snug transition-colors ${
        ativo
          ? "bg-emerald-50 font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
      }`}
    >
      {children}
    </Link>
  );
}

function Progresso({ rotas }: { rotas: string[] }) {
  const feitas = useSyncExternalStore(aoMudarProgresso, () => contarConcluidas(rotas), () => 0);
  if (!rotas.length) return null;
  return (
    <span className="ml-auto text-xs tabular-nums text-zinc-400">
      {feitas}/{rotas.length}
    </span>
  );
}

function BlocoTrilha({ trilha, atual }: { trilha: TrilhaMenu; atual: string }) {
  const dentro = atual === trilha.rota || atual.startsWith(trilha.rota + "/");
  return (
    <details open={dentro} className="group">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800/60">
        <span className="text-zinc-400 transition-transform group-open:rotate-90">›</span>
        {trilha.titulo}
        <Progresso rotas={trilha.aulas.map((a) => a.rota)} />
      </summary>
      <div className="ml-3 mt-1 space-y-0.5 border-l border-zinc-200 pl-2 dark:border-zinc-800">
        <ItemMenu href={trilha.rota} ativo={atual === trilha.rota}>Visão geral</ItemMenu>
        {trilha.aulas.map((aula) => (
          <ItemMenu key={aula.rota} href={aula.rota} ativo={atual === aula.rota}>
            <span className="mr-1.5 tabular-nums text-zinc-400">{aula.numero}</span>
            {aula.titulo}
          </ItemMenu>
        ))}
        {trilha.rotaPerguntas && (
          <ItemMenu href={trilha.rotaPerguntas} ativo={atual.startsWith(trilha.rotaPerguntas)}>Perguntas</ItemMenu>
        )}
        {trilha.rotaGlossario && (
          <ItemMenu href={trilha.rotaGlossario} ativo={atual === trilha.rotaGlossario}>Glossário</ItemMenu>
        )}
      </div>
    </details>
  );
}

export function MenuLateral({ grupos, avulsas }: Props) {
  const atual = normalizar(usePathname());
  const [aberto, setAberto] = useState(false);

  return (
    <aside className="lg:w-72 lg:shrink-0">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="mt-4 w-full rounded-md border border-zinc-200 px-3 py-2 text-left text-sm font-medium dark:border-zinc-800 lg:hidden"
      >
        {aberto ? "Fechar menu" : "Abrir menu de trilhas"}
      </button>
      <nav
        onClick={(e) => (e.target as HTMLElement).closest("a") && setAberto(false)}
        className={`${aberto ? "block" : "hidden"} py-4 lg:sticky lg:top-16 lg:block lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto lg:py-8`}
      >
        {grupos.map((grupo) => (
          <div key={grupo.rotulo} className="mb-5">
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">{grupo.rotulo}</p>
            <div className="space-y-0.5">
              {grupo.trilhas.map((t) => (
                <BlocoTrilha key={t.id} trilha={t} atual={atual} />
              ))}
            </div>
          </div>
        ))}
        {avulsas.length > 0 && (
          <div className="mb-5">
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Extras</p>
            {avulsas.map((p) => (
              <ItemMenu key={p.rota} href={p.rota} ativo={atual === p.rota}>{p.titulo}</ItemMenu>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
}
