import { ComoFunciona } from "@/components/landing/ComoFunciona";
import { Contribuir } from "@/components/landing/Contribuir";
import { Dicionario } from "@/components/landing/Dicionario";
import { Hero } from "@/components/landing/Hero";
import { ParaQueServe } from "@/components/landing/ParaQueServe";
import { Trilhas } from "@/components/landing/Trilhas";
import { listarTrilhas } from "@/lib/conteudo/trilhas";

export default function Home() {
  const trilhas = listarTrilhas();
  const totalAulas = trilhas.reduce((soma, t) => soma + t.aulas.length, 0);
  const totalPerguntas = trilhas.reduce((soma, t) => soma + t.totalPerguntas, 0);

  return (
    <main className="landing-shell mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6">
      <Hero rotaInicial={trilhas[0]?.rota ?? "/"} totalAulas={totalAulas} totalPerguntas={totalPerguntas} />
      <ParaQueServe />
      <Dicionario />
      <ComoFunciona />
      <Trilhas trilhas={trilhas} />
      <Contribuir />
    </main>
  );
}
