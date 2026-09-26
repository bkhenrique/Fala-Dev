import Image from "next/image";

const PARTES_DA_AULA = [
  ["O problema", "Por que aquilo existe e que dor resolve."],
  ["A teoria", "Explicação do zero, com analogia, diagrama e código curto."],
  ["Como falar na entrevista", "Uma resposta modelo pra treinar em voz alta."],
  ["Resumo e termos", "Os pontos que não podem faltar e o vocabulário da aula."],
];

const NIVEIS = [
  ["Nível 1", "O que é?", "Definições que têm que sair sem pensar."],
  ["Nível 2", "Por quê? Quando usar?", "Comparações, motivos e trade-offs."],
  ["Nível 3", "Como você faria?", "Cenários reais que juntam vários conceitos."],
];

export function ComoFunciona() {
  return (
    <section className="my-12 overflow-hidden rounded-[2rem] bg-[#17271f] text-[#f8f5ec] sm:my-16">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="p-6 sm:p-10 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a9c4a9]">Um método para ganhar confiança</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Aprenda. Pratique. Fale.</h2>
          <h3 className="mt-8 font-semibold">Cada aula tem um caminho claro</h3>
          <ol className="mt-4 space-y-3">
            {PARTES_DA_AULA.map(([titulo, texto], i) => (
              <li key={titulo} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#d8e5c9] text-xs font-bold text-emerald-950">{i + 1}</span>
                <span className="text-sm"><strong>{titulo}:</strong> <span className="text-zinc-300">{texto}</span></span>
              </li>
            ))}
          </ol>
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 sm:p-6">
            <h3 className="font-semibold">Perguntas em três níveis</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {NIVEIS.map(([nivel, pergunta, texto]) => (
                <li key={nivel} className="border-l-2 border-[#e67652] pl-3">
                  <strong>{nivel} — {pergunta}</strong><br /><span className="text-zinc-300">{texto}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl bg-[#f8f5ec] p-4 text-sm text-zinc-900">
              <p className="font-semibold">Qual a diferença entre 201 e 202?</p>
              <details className="mt-2">
                <summary className="cursor-pointer font-medium text-emerald-800">Ver resposta</summary>
                <p className="mt-2 text-zinc-600">
                  201 Created: o recurso foi criado e já existe. 202 Accepted: a requisição foi aceita, mas vai ser
                  processada depois, típico de fluxo assíncrono com fila. Aí devolvo um id pro cliente acompanhar.
                </p>
              </details>
            </div>
          </div>
        </div>
        <div className="relative hidden min-h-[620px] lg:block">
          <Image src="/images/faladev-fluxo-api.jpg" alt="Ilustração de um fluxo da web passando por uma API, uma fila e um banco de dados" fill sizes="45vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
