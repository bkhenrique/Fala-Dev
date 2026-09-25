const donoVercel = process.env.VERCEL_GIT_REPO_OWNER;
const repoVercel = process.env.VERCEL_GIT_REPO_SLUG;

// FALADEV_REPO e as variáveis da Vercel permitem apontar pra um fork sem mexer no código.
export const REPOSITORIO =
  process.env.FALADEV_REPO ?? (donoVercel && repoVercel ? `${donoVercel}/${repoVercel}` : "bkhenrique/Fala-Dev");

export const BRANCH = "main";

export const URL_REPOSITORIO = REPOSITORIO ? `https://github.com/${REPOSITORIO}` : undefined;

export function urlArquivoNoGithub(caminho: string, modo: "blob" | "edit" = "blob") {
  if (!URL_REPOSITORIO) return undefined;
  return `${URL_REPOSITORIO}/${modo}/${BRANCH}/${caminho}`;
}
