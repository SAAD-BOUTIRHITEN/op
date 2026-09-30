/**
 * Point de bascule CMS unique.
 *
 * Étape 0 (actuelle) : données locales typées.
 * Étape 1            : remplacer `localSource` par `sanitySource`. Rien d'autre
 *                      ne change — ni les pages, ni les composants.
 */

import { localSource } from "./local-source";
import type { Frame, FrameQuery, FrameRepository } from "./types";

const source: FrameRepository = localSource;

export function listFrames(query?: FrameQuery): Promise<Frame[]> {
  return source.list(query);
}

export function getFrameBySlug(slug: string): Promise<Frame | null> {
  return source.getBySlug(slug);
}

export function listFrameSlugs(): Promise<string[]> {
  return source.slugs();
}

export function listBrands(): Promise<string[]> {
  return source.brands();
}
