import type { Frame, FrameQuery } from "./types";

/**
 * Logique de filtrage pure, partagée par la source de données serveur et par
 * l'îlot client du catalogue. Un seul endroit : les deux ne peuvent pas diverger.
 */

/** Supprime les accents et la casse pour une recherche tolérante. */
export function normalise(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function matchesQuery(frame: Frame, query: FrameQuery): boolean {
  if (query.category && frame.category !== query.category) return false;
  if (query.flag && !frame[query.flag]) return false;
  if (query.brand && frame.brand !== query.brand) return false;
  if (query.featuredOnly && !frame.featured) return false;

  if (query.search) {
    const needle = normalise(query.search);
    if (needle.length > 0) {
      const haystack = normalise([frame.name, frame.brand, frame.reference].join(" "));
      if (!haystack.includes(needle)) return false;
    }
  }

  return true;
}

export function byNewest(a: Frame, b: Frame): number {
  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
}

export function applyQuery(frames: readonly Frame[], query: FrameQuery = {}): Frame[] {
  const results = frames.filter((frame) => matchesQuery(frame, query)).sort(byNewest);
  return typeof query.limit === "number" ? results.slice(0, query.limit) : results;
}
