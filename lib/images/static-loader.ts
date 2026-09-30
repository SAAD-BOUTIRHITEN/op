/**
 * Chargeur d'images du mode STATIC_EXPORT (GitHub Pages).
 *
 * Sans serveur, `next/image` ne peut pas redimensionner à la demande.
 * `scripts/optimize-images.mjs` fabrique donc, après le build, des variantes
 * WebP de chaque photo de /images dans `_img/<largeur>/…` ; ce chargeur
 * choisit la plus petite variante au moins aussi large que demandé.
 *
 * Les largeurs doivent rester identiques à celles du script.
 */
export const VARIANT_WIDTHS = [384, 640, 828, 1200, 1600] as const;

export default function staticLoader({ src, width }: { src: string; width: number }): string {
  if (!src.startsWith("/images/")) return src;
  const target = VARIANT_WIDTHS.find((w) => w >= width) ?? VARIANT_WIDTHS[VARIANT_WIDTHS.length - 1];
  const withoutExt = src.replace(/\.[a-z0-9]+$/i, "");
  return `/_img/${target}${withoutExt}.webp`;
}
