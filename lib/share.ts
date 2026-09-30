import { site } from "@/config/site";
import type { Frame } from "@/lib/products/types";

/**
 * Textes du partage natif. Isolés ici pour être testables et pour rester
 * cohérents avec les métadonnées Open Graph de la fiche.
 */
export function frameShareTitle(frame: Pick<Frame, "name" | "brand">): string {
  return `${frame.name} — ${frame.brand} | ${site.BUSINESS_NAME}`;
}

export function frameShareText(frame: Pick<Frame, "name" | "brand">): string {
  return `${frame.name} de ${frame.brand}, à découvrir chez ${site.BUSINESS_NAME}.`;
}

/**
 * Lien partagé : chemin seul, sans les paramètres de campagne de l'expéditeur.
 * Séparé du composant pour pouvoir être vérifié sans navigateur.
 */
export function shareUrl(origin: string, pathname: string): string {
  return `${origin.replace(/\/$/, "")}${pathname}`;
}
