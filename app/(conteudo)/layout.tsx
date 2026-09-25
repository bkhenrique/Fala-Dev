import { MenuLateral, type GrupoMenu } from "@/components/menu/MenuLateral";
import { GRUPOS, listarAvulsas, listarTrilhas } from "@/lib/conteudo/trilhas";

export default function LayoutConteudo({ children }: { children: React.ReactNode }) {
  const trilhas = listarTrilhas();
  const grupos: GrupoMenu[] = GRUPOS.map((g) => ({
    rotulo: g.rotulo,
    trilhas: trilhas
      .filter((t) => t.tipo === g.tipo)
      .map(({ id, titulo, rota, aulas, rotaPerguntas, rotaGlossario }) => ({
        id,
        titulo,
        rota,
        aulas,
        rotaPerguntas,
        rotaGlossario,
      })),
  })).filter((g) => g.trilhas.length > 0);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 lg:flex-row lg:gap-10">
      <MenuLateral grupos={grupos} avulsas={listarAvulsas()} />
      <main className="min-w-0 flex-1 py-8">{children}</main>
    </div>
  );
}
