/**
 * Vrai hors production.
 *
 * Sert à ne montrer qu'au développeur les marqueurs de configuration
 * manquante. Un visiteur ne doit jamais lire « à renseigner dans
 * config/site.ts » sur le site en ligne.
 */
export const IS_DEV = process.env.NODE_ENV !== "production";
