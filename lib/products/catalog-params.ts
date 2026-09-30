import type { FrameCategory, FrameFlag, FrameQuery } from "./types";

/**
 * Traduction entre les paramètres d'URL et l'état du catalogue.
 *
 * Les noms de paramètres sont publics : ils apparaissent dans les liens de la
 * page d'accueil et dans le SearchAction des données structurées. Ils ne
 * doivent pas changer sans mettre à jour ces deux endroits.
 */

export type Selection = "nouveautes" | "coups-de-coeur";

export interface CatalogFilters {
  category: FrameCategory | null;
  selection: Selection | null;
  brand: string | null;
  search: string;
}

export const PARAM = {
  category: "categorie",
  selection: "selection",
  brand: "marque",
  search: "recherche",
} as const;

export const emptyFilters: CatalogFilters = {
  category: null,
  selection: null,
  brand: null,
  search: "",
};

const categories: readonly FrameCategory[] = ["lunettes-de-vue", "lunettes-de-soleil"];
const selections: readonly Selection[] = ["nouveautes", "coups-de-coeur"];

const selectionFlag: Record<Selection, FrameFlag> = {
  nouveautes: "newArrival",
  "coups-de-coeur": "coupDeCoeur",
};

/** Convertit l'objet `searchParams` de Next en URLSearchParams. */
export function toURLSearchParams(
  input: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && typeof value[0] === "string") params.set(key, value[0]);
  }
  return params;
}

/** Une valeur inconnue est ignorée plutôt que de produire une erreur. */
export function parseCatalogFilters(params: URLSearchParams): CatalogFilters {
  const category = params.get(PARAM.category);
  const selection = params.get(PARAM.selection);
  const brand = params.get(PARAM.brand);

  return {
    category: categories.includes(category as FrameCategory)
      ? (category as FrameCategory)
      : null,
    selection: selections.includes(selection as Selection) ? (selection as Selection) : null,
    brand: brand && brand.trim().length > 0 ? brand : null,
    search: params.get(PARAM.search)?.trim() ?? "",
  };
}

export function filtersToQuery(filters: CatalogFilters): FrameQuery {
  const query: FrameQuery = {};
  if (filters.category) query.category = filters.category;
  if (filters.selection) query.flag = selectionFlag[filters.selection];
  if (filters.brand) query.brand = filters.brand;
  if (filters.search) query.search = filters.search;
  return query;
}

/**
 * Applique la marque et la recherche à une chaîne de requête existante, en
 * préservant tout paramètre que nous ne gérons pas : `utm_source`, `gclid`…
 * La catégorie ne s'y écrit plus : elle vit dans le chemin (/montures/…).
 * Les anciens paramètres `categorie` et `selection` sont retirés au passage.
 */
export function mergeFiltersIntoSearch(
  currentSearch: string,
  filters: CatalogFilters,
): string {
  const params = new URLSearchParams(currentSearch);
  params.delete(PARAM.category);
  params.delete(PARAM.selection);

  const assign = (key: string, value: string | null) => {
    if (value === null || value.length === 0) params.delete(key);
    else params.set(key, value);
  };
  assign(PARAM.brand, filters.brand);
  assign(PARAM.search, filters.search);

  const query = params.toString();
  return query.length > 0 ? `?${query}` : "";
}

export function hasActiveFilters(filters: CatalogFilters): boolean {
  return Boolean(filters.category || filters.selection || filters.brand || filters.search);
}

// ---------------------------------------------------------------------------
// Onglets du catalogue : une URL propre par onglet.
//
// Chaque onglet est une vraie page (/montures/lunettes-de-soleil…) et non un
// bouton JavaScript. Trois conséquences : il fonctionne même si JavaScript ne
// s'exécute pas, son adresse se partage telle quelle, et Google peut l'indexer
// comme une page d'atterrissage (« lunettes de soleil Casablanca »).
// ---------------------------------------------------------------------------

export type FacetKey =
  | "toutes"
  | "lunettes-de-vue"
  | "lunettes-de-soleil"
  | "nouveautes"
  | "coups-de-coeur";

export interface Facet {
  key: FacetKey;
  label: string;
  path: string;
  axis: Pick<CatalogFilters, "category" | "selection">;
  /** Titre de la page (balise <title>, sans le nom de la boutique). */
  title: string;
  /** Titre visible (h1). */
  heading: string;
  /** Phrase d'introduction, reprise en meta description. */
  lede: string;
}

export const FACETS: readonly Facet[] = [
  {
    key: "toutes",
    label: "Toutes",
    path: "/montures",
    axis: { category: null, selection: null },
    title: "Nos montures",
    heading: "Nos montures",
    lede: "Lunettes de vue et lunettes de soleil, sélectionnées une par une. Tous les modèles sont à essayer en boutique.",
  },
  {
    key: "lunettes-de-vue",
    label: "Lunettes de vue",
    path: "/montures/lunettes-de-vue",
    axis: { category: "lunettes-de-vue", selection: null },
    title: "Lunettes de vue",
    heading: "Lunettes de vue",
    lede: "Montures optiques en métal, en acétate et en titane. Mesures, centrage et ajustage réalisés en boutique.",
  },
  {
    key: "lunettes-de-soleil",
    label: "Lunettes de soleil",
    path: "/montures/lunettes-de-soleil",
    axis: { category: "lunettes-de-soleil", selection: null },
    title: "Lunettes de soleil",
    heading: "Lunettes de soleil",
    lede: "Solaires de ville, de conduite et de bord de mer. Verres dégradés, polarisés ou teintés, à essayer en boutique.",
  },
  {
    key: "nouveautes",
    label: "Nouveautés",
    path: "/montures/nouveautes",
    axis: { category: null, selection: "nouveautes" },
    title: "Nouveautés",
    heading: "Nouveautés",
    lede: "Les derniers modèles arrivés dans la sélection.",
  },
  {
    key: "coups-de-coeur",
    label: "Coups de cœur",
    path: "/montures/coups-de-coeur",
    axis: { category: null, selection: "coups-de-coeur" },
    title: "Coups de cœur",
    heading: "Nos coups de cœur",
    lede: "Les modèles que nous défendons le plus volontiers.",
  },
];

export function facetByKey(key: FacetKey): Facet {
  const facet = FACETS.find((item) => item.key === key);
  if (!facet) throw new Error(`Onglet inconnu : ${key}`);
  return facet;
}

/** Onglet correspondant à un couple catégorie / sélection. */
export function facetForFilters(filters: Pick<CatalogFilters, "category" | "selection">): Facet {
  return (
    FACETS.find(
      (item) =>
        item.axis.category === filters.category && item.axis.selection === filters.selection,
    ) ?? facetByKey("toutes")
  );
}

/** Adresse d'un onglet, en conservant la marque et la recherche en cours. */
export function facetHref(facet: Facet, filters: CatalogFilters): string {
  return `${facet.path}${mergeFiltersIntoSearch("", filters)}`;
}
