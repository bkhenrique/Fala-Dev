const CHAVE = "faladev:progresso";
const EVENTO = "faladev:progresso";

type Progresso = Record<string, true>;

function ler(): Progresso {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) ?? "{}") as Progresso;
  } catch {
    return {};
  }
}

export function estaConcluida(rota: string) {
  return Boolean(ler()[rota]);
}

export function contarConcluidas(rotas: string[]) {
  const progresso = ler();
  return rotas.filter((r) => progresso[r]).length;
}

export function marcarConcluida(rota: string, concluida: boolean) {
  const progresso = ler();
  if (concluida) progresso[rota] = true;
  else delete progresso[rota];
  try {
    localStorage.setItem(CHAVE, JSON.stringify(progresso));
  } catch {
    // sem localStorage (aba anônima com bloqueio, por exemplo) o progresso só não persiste
  }
  window.dispatchEvent(new Event(EVENTO));
}

export function aoMudarProgresso(callback: () => void) {
  window.addEventListener(EVENTO, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENTO, callback);
    window.removeEventListener("storage", callback);
  };
}
