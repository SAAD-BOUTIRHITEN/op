/**
 * Source unique de vérité pour toutes les informations de l'entreprise.
 *
 * Aucune de ces valeurs ne doit être dupliquée ailleurs dans le code.
 * Les champs vides sont volontaires : ils seront remplis par le client.
 * L'interface affiche un marqueur « à configurer » tant qu'une valeur est vide,
 * afin qu'une information manquante soit visible plutôt que silencieusement absente.
 */

export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface OpeningHoursSpec {
  /** Jours concernés, au format schema.org. */
  days: WeekDay[];
  /** Libellé affiché, ex. « Lundi – Samedi ». */
  label: string;
  /** Heure d'ouverture au format 24h, ex. « 09:00 ». */
  opens: string;
  /** Heure de fermeture au format 24h, ex. « 19:30 ». */
  closes: string;
  /**
   * Jour de fermeture. L'interface affiche « Fermé », et les données
   * structurées gardent `opens` et `closes` à « 00:00 » — la convention
   * schema.org pour un jour fermé. Déclarer explicitement la fermeture vaut
   * mieux que l'omettre : Google affiche alors « Fermé le dimanche » au lieu
   * de laisser le doute.
   */
  closed?: boolean;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export const site = {
  BUSINESS_NAME: "Lunéa Optique",
  TAGLINE: "Votre vision, votre style.",
  DESCRIPTION:
    "Opticien à Casablanca. Lunettes de vue, lunettes de soleil et conseils personnalisés en boutique.",

  /** Ville de la boutique. Reprise du moodboard — à confirmer. */
  CITY: "Casablanca",
  COUNTRY_CODE: "MA",
  CURRENCY: "MAD",

  // ---------------------------------------------------------------------
  // À RENSEIGNER PAR LE CLIENT
  // ---------------------------------------------------------------------
  ADDRESS: "Bd Moulouya, Oulfa",
  POSTAL_CODE: "20000",
  REGION: "Casablanca-Settat",
  /** Format international E.164, ex. « +2125XXXXXXXX ». */
  PHONE: "+212690715198",
  /**
   * Chiffres uniquement, indicatif pays inclus.
   * Supposé identique au téléphone : à corriger si la boutique utilise une
   * ligne WhatsApp distincte.
   */
  WHATSAPP_NUMBER: "212690715198",
  EMAIL: "info.luneaoptique@gmail.com",
  INSTAGRAM_URL: "",
  /** Lien « Itinéraire » de la fiche Google Business Profile. */
  GOOGLE_MAPS_URL: "https://maps.app.goo.gl/48A7j8Rd6QV2kKTA9",
  /** URL d'intégration de la carte (iframe). Laisser vide pour afficher le visuel de remplacement. */
  GOOGLE_MAPS_EMBED_URL:
    "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1415.786063372904!2d-7.677434904325834!3d33.54950693278194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sma!4v1789679080268!5m2!1sen!2sma",
  /** Nécessaire pour afficher les avis Google réels (étape ultérieure). */
  GOOGLE_PLACE_ID: "",
  /** Extrait de l'URL d'intégration Maps : !3d = latitude, !2d = longitude. */
  GEO: { lat: 33.5495069, lng: -7.6774349 } as GeoPoint | null,
  OPENING_HOURS: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      label: "Lundi – Samedi",
      opens: "09:00",
      closes: "18:00",
    },
    { days: ["Sunday"], label: "Dimanche", opens: "00:00", closes: "00:00", closed: true },
  ] as OpeningHoursSpec[],
  // ---------------------------------------------------------------------

  /**
   * Hôte canonique, sans barre oblique finale.
   *
   * Doit correspondre EXACTEMENT à l'hôte réellement servi. Le site déclare
   * ses URL canoniques, son sitemap et ses images de partage à partir de cette
   * valeur : si elle dit `luneaoptique.live` et que l'hébergeur sert
   * `www.luneaoptique.live`, Google voit deux sites et les met en concurrence.
   * Choisir un hôte, rediriger l'autre en 301.
   *
   * `.live` est le domaine retenu (les anciens `.me` et `.com` restent
   * enregistrés et redirigent en 301 — voir next.config.ts).
   */
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://luneaoptique.live",
} as const;

/**
 * Passe à `true` dès que le catalogue contient des modèles non validés :
 * bandeau d'avertissement, pages en noindex, données structurées produit
 * suspendues.
 *
 * Vit ici et non dans `content/frames.ts` parce que c'est une décision de
 * publication, pas une donnée de contenu — et le contenu partira dans le CMS.
 * Tant qu'il y vivait, trois pages importaient le fichier de contenu en
 * direct, et la bascule CMS n'était pas le changement d'un seul fichier
 * annoncé dans ARCHITECTURE.md.
 */
export const CATALOGUE_NEEDS_REVIEW = false;

/** Vrai si une valeur de configuration a été renseignée. */
export function isSet(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Adresse postale sur une ligne, telle qu'elle peut être affichée. */
export function formattedAddress(): string | null {
  if (!isSet(site.ADDRESS)) return null;
  return [site.ADDRESS, site.POSTAL_CODE, site.CITY]
    .filter((part) => isSet(part))
    .join(", ");
}
