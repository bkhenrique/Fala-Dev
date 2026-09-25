import { ImageResponse } from "next/og";
import { listarTrilhas } from "@/lib/conteudo/trilhas";
import { carregarFonteGeist } from "@/lib/fonteImagem";

const size = { width: 1200, height: 630 };

export const dynamic = "force-static";

// Rota com extensão pra sair do build como arquivo .png; crawlers de redes sociais exigem o tipo certo.
export async function GET() {
  const trilhas = listarTrilhas();
  const aulas = trilhas.reduce((soma, t) => soma + t.aulas.length, 0);
  const perguntas = trilhas.reduce((soma, t) => soma + t.totalPerguntas, 0);
  const fonts = await carregarFonteGeist();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0b0b0e",
          color: "#e4e4e7",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#059669" />
            <path d="M16 18h32a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H30l-9 8v-8h-5a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6Z" fill="#fff" />
            <path d="M27 26l-5 5 5 5M37 26l5 5-5 5" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: "flex", fontSize: 48, fontWeight: 700 }}>
            <span>Fala</span>
            <span style={{ color: "#34d399" }}>Dev</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontWeight: 700, fontSize: 76, lineHeight: 1.1, color: "#fafafa" }}>
          <div style={{ display: "flex", gap: 20 }}>
            <span>Aprenda a</span>
            <span style={{ color: "#34d399" }}>falar</span>
            <span>o que você</span>
          </div>
          <span>já sabe fazer.</span>
          <span style={{ marginTop: 28, fontSize: 30, fontWeight: 400, color: "#a1a1aa" }}>
            Aulas, glossário e perguntas de entrevista com resposta.
          </span>
        </div>

        <span style={{ fontSize: 28, color: "#a1a1aa" }}>
          {`${aulas} aulas · ${perguntas} perguntas · ${trilhas.map((t) => t.titulo).join(" · ")}`}
        </span>
      </div>
    ),
    { ...size, fonts },
  );
}
