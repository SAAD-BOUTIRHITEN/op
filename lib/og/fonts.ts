import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/**
 * Satori n'accepte ni woff2 ni police variable : ces fichiers sont des
 * instances statiques (Playfair 500, Montserrat 400) sous-ensemblées au latin
 * et aux accents français. Ils ne servent qu'à la génération des images
 * Open Graph — le site, lui, charge les woff2 variables de `app/fonts/`.
 */
export async function brandFonts() {
  const [serif, sans] = await Promise.all([
    readFile(fileURLToPath(new URL("./playfair-display-500.ttf", import.meta.url))),
    readFile(fileURLToPath(new URL("./montserrat-400.ttf", import.meta.url))),
  ]);

  return [
    { name: "Playfair Display", data: serif, weight: 500 as const, style: "normal" as const },
    { name: "Montserrat", data: sans, weight: 400 as const, style: "normal" as const },
  ];
}
