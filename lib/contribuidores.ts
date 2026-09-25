import { REPOSITORIO } from "@/lib/site";

export type Contribuidor = { login: string; avatar: string; perfil: string };

type RespostaGithub = { login: string; avatar_url: string; html_url: string; type: string }[];

/** Roda no build. Se a API falhar, o rodapé só não mostra a lista. */
export async function buscarContribuidores(): Promise<Contribuidor[]> {
  if (!REPOSITORIO) return [];

  const token = process.env.GITHUB_TOKEN;
  try {
    const resposta = await fetch(`https://api.github.com/repos/${REPOSITORIO}/contributors?per_page=100`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!resposta.ok) return [];

    const dados = (await resposta.json()) as RespostaGithub;
    return dados
      .filter((c) => c.type !== "Bot")
      .map((c) => ({ login: c.login, avatar: c.avatar_url, perfil: c.html_url }));
  } catch {
    return [];
  }
}
