export type LinkKind = "internal" | "external" | "protocol";

/**
 * Détermine comment un lien doit être rendu.
 * `protocol` couvre tel: et mailto: — qui ne doivent jamais ouvrir un onglet.
 */
export function linkKind(href: string): LinkKind {
  if (/^https?:\/\//i.test(href)) return "external";
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return "protocol";
  return "internal";
}
