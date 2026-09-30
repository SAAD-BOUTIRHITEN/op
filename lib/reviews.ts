import { isSet, site } from "@/config/site";

/**
 * Lien direct vers le formulaire d'avis Google de la boutique.
 * Format officiel : search.google.com/local/writereview?placeid=…
 *
 * C'est le véritable usage du Place ID pour un commerce qui démarre : il ne
 * sert pas à afficher des avis, il sert à en obtenir.
 */
export function reviewLinkHref(): string | null {
  if (!isSet(site.GOOGLE_PLACE_ID)) return null;
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(
    site.GOOGLE_PLACE_ID,
  )}`;
}
