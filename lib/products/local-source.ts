import { catalogueFrames } from "@/content/frames";
import { applyQuery } from "./filter";
import type { Frame, FrameQuery, FrameRepository } from "./types";

export const localSource: FrameRepository = {
  async list(query: FrameQuery = {}): Promise<Frame[]> {
    return applyQuery(catalogueFrames, query);
  },

  async getBySlug(slug: string): Promise<Frame | null> {
    return catalogueFrames.find((frame) => frame.slug === slug) ?? null;
  },

  async slugs(): Promise<string[]> {
    return catalogueFrames.map((frame) => frame.slug);
  },

  async brands(): Promise<string[]> {
    return [...new Set(catalogueFrames.map((frame) => frame.brand))].sort((a, b) =>
      a.localeCompare(b, "fr"),
    );
  },
};
