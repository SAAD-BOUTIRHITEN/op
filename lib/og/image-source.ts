import { readFile } from "node:fs/promises";
import path from "node:path";

const mimeByExtension: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

/**
 * Satori ne sait pas résoudre une URL relative. Une image distante (CDN du
 * CMS) est transmise telle quelle ; une image locale est lue sur le disque et
 * intégrée en data URI, ce qui fonctionne à la compilation comme à l'exécution.
 * Retourne `null` si l'image est absente ou dans un format non géré : la carte
 * bascule alors sur sa version typographique plutôt que d'échouer.
 */
export async function ogImageSource(url: string | undefined): Promise<string | null> {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;

  const type = mimeByExtension[path.extname(url).toLowerCase()];
  if (!type) return null;

  try {
    const file = await readFile(path.join(process.cwd(), "public", url));
    return `data:${type};base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}
