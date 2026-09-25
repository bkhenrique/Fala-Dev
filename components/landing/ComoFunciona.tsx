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
    <section className="py-12">
      <h2 className="text-2xl font-bold tracking-tight">Como funciona</h2>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="font-semibold">Cada aula tem o mesmo formato</h3>
          <ol className="mt-4 space-y-3">
            {PARTES_DA_AULA.map(([titulo, texto], i) => (
              <li key={titulo} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm">
                  <strong>{titulo}:</strong> <span className="text-zinc-600 dark:text-zinc-400">{texto}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="font-semibold">Perguntas em três níveis, com a resposta escondida</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NIVEIS.map(([nivel, pergunta, texto]) => (
              <li key={nivel}>
                <strong>{nivel} — {pergunta}</strong> <span className="text-zinc-600 dark:text-zinc-400">{texto}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-800">
            <p className="font-semibold">Qual a diferença entre 201 e 202?</p>
            <details className="mt-2">
              <summary className="cursor-pointer font-medium text-emerald-700 dark:text-emerald-400">Ver resposta</summary>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                201 Created: o recurso foi criado e já existe. 202 Accepted: a requisição foi aceita, mas vai ser
                processada depois, típico de fluxo assíncrono com fila. Aí devolvo um id pro cliente acompanhar.
              </p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
