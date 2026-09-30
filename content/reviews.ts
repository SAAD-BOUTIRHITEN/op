/**
 * Avis clients réels, recopiés depuis la fiche Google Business Profile.
 *
 * Pourquoi à la main plutôt que par API : l'API Places ne renvoie que
 * **5 avis** au maximum, exige une clé Google et une facturation activée.
 * Pour une boutique, recopier les avis publics coûte cinq minutes et ne
 * dépend de rien.
 *
 * Règle unique : le texte doit être **mot pour mot** celui de l'avis public.
 * Ni retouche, ni résumé, ni invention. Tant que ce tableau est vide, la
 * section n'apparaît pas sur le site.
 */

export interface Review {
  /** Prénom tel qu'il apparaît publiquement sur l'avis. */
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Verbatim de l'avis. */
  text: string;
  /** Date ISO de l'avis. */
  date: string;
}

export const reviews: readonly Review[] = [
  // Exemple de la forme attendue — à remplacer par de vrais avis :
  // {
  //   author: "Salma",
  //   rating: 5,
  //   text: "Accueil très professionnel, on prend le temps de bien vous conseiller.",
  //   date: "2026-09-12",
  // },
];
