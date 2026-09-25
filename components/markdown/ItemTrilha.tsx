"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { aoMudarProgresso, estaConcluida, marcarConcluida } from "@/lib/progresso";

export function ItemTrilha({ rota, children }: { rota: string; children: ReactNode }) {
  const concluida = useSyncExternalStore(
    aoMudarProgresso,
    () => estaConcluida(rota),
    () => false,
  );

  return (
    <li className="task-list-item flex list-none items-start gap-3">
      <input
        type="checkbox"
        checked={concluida}
        onChange={(e) => marcarConcluida(rota, e.target.checked)}
        aria-label="Marcar como concluída"
        className="mt-1.5 size-4 shrink-0 cursor-pointer accent-emerald-600"
      />
      <span className={concluida ? "text-zinc-500 line-through decoration-zinc-400" : undefined}>{children}</span>
    </li>
  );
}
