type Peso = 400 | 700;

/**
 * Baixa a Geist em TTF no build, pro ImageResponse (ele não lê woff2).
 * Se a rede falhar, devolve lista vazia e a imagem sai com a fonte padrão, sem quebrar o build.
 */
export async function carregarFonteGeist(pesos: Peso[] = [400, 700]) {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Geist:wght@${pesos.join(";")}`, {
      signal: AbortSignal.timeout(8000),
    }).then((r) => r.text());

    const urls = [...css.matchAll(/src: url\((.+?)\) format\('truetype'\)/g)].map((m) => m[1]);
    if (urls.length !== pesos.length) return [];

    const arquivos = await Promise.all(urls.map((url) => fetch(url).then((r) => r.arrayBuffer())));
    return arquivos.map((data, i) => ({ name: "Geist", data, weight: pesos[i], style: "normal" as const }));
  } catch {
    return [];
  }
}
