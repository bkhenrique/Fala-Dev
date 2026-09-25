const OBJETIVOS = [
  {
    titulo: "Dar nome ao que você faz",
    texto: "\"Joguei pra rodar em segundo plano\" vira \"processamento assíncrono com fila\". Você já faz, só falta o vocabulário.",
  },
  {
    titulo: "Entender o porquê",
    texto: "Cada aula começa pelo problema que o assunto resolve. Sabendo o porquê, você consegue comparar soluções e falar de trade-offs.",
  },
  {
    titulo: "Treinar a fala",
    texto: "Toda aula traz uma resposta modelo pra entrevista, e cada trilha tem perguntas em três níveis pra responder em voz alta.",
  },
];

export function ParaQueServe() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold tracking-tight">Pra que serve</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {OBJETIVOS.map((o) => (
          <div key={o.titulo} className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <h3 className="font-semibold">{o.titulo}</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{o.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
