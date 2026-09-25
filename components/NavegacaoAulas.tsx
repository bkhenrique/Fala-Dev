import Link from "next/link";
import type { Aula } from "@/lib/conteudo/trilhas";

export function NavegacaoAulas({ anterior, proxima }: { anterior?: Aula; proxima?: Aula }) {
  if (!anterior && !proxima) return null;

  return (
    <nav className="mt-12 grid gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-2 dark:border-zinc-800">
      {anterior ? (
        <Link href={anterior.rota} className="rounded-lg border border-zinc-200 p-4 hover:border-emerald-500 dark:border-zinc-800">
          <span className="text-xs text-zinc-500">← Aula anterior</span>
          <span className="mt-1 block font-medium">{anterior.numero} — {anterior.titulo}</span>
        </Link>
      ) : (
        <span />
      )}
      {proxima && (
        <Link href={proxima.rota} className="rounded-lg border border-zinc-200 p-4 text-right hover:border-emerald-500 dark:border-zinc-800">
          <span className="text-xs text-zinc-500">Próxima aula →</span>
          <span className="mt-1 block font-medium">{proxima.numero} — {proxima.titulo}</span>
        </Link>
      )}
    </nav>
  );
}
