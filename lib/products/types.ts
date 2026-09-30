/**
 * Modèle de données du catalogue.
 *
 * Note de conception : « Nouveautés » et « Coups de cœur » sont des *drapeaux*,
 * pas des catégories. Les stocker comme valeurs de `category` empêcherait
 * une monture d'être à la fois solaire et coup de cœur.
 */

import type { ImageAsset } from "@/lib/media";

export type FrameCategory = "lunettes-de-vue" | "lunettes-de-soleil";

export type FrameFlag = "newArrival" | "coupDeCoeur";

export type Availability = "en-stock" | "sur-commande" | "epuise";

export interface FrameColor {
  name: string;
  /** Pastille affichée dans la fiche produit. */
  hex: string;
}

/** Une photo de monture est une image du site comme une autre. */
export type FrameImage = ImageAsset;

export interface Frame {
  id: string;
  /** Segment d'URL, ex. « ray-ban-rx1234 ». */
  slug: string;
  name: string;
  brand: string;
  reference: string;
  category: FrameCategory;
  description: string;
  /** La première image sert de visuel de carte et d'image Open Graph. */
  images: FrameImage[];
  colors: FrameColor[];
  /** En MAD. `null` affiche « Prix sur demande ». */
  price: number | null;
  availability: Availability;
  featured: boolean;
  newArrival: boolean;
  /** Sélection de la maison — une revendication vérifiable, au contraire d'un best-seller. */
  coupDeCoeur: boolean;
  /** Date ISO 8601. */
  createdAt: string;
}

export interface FrameQuery {
  category?: FrameCategory;
  flag?: FrameFlag;
  brand?: string;
  /** Recherche libre sur le nom, la marque et la référence. */
  search?: string;
  featuredOnly?: boolean;
  limit?: number;
}

/**
 * Contrat d'accès aux données. C'est le seul point à réimplémenter
 * lors du passage à un CMS (voir ARCHITECTURE.md, §7).
 */
export interface FrameRepository {
  list(query?: FrameQuery): Promise<Frame[]>;
  getBySlug(slug: string): Promise<Frame | null>;
  slugs(): Promise<string[]>;
  brands(): Promise<string[]>;
}

export const categoryLabels: Record<FrameCategory, string> = {
  "lunettes-de-vue": "Lunettes de vue",
  "lunettes-de-soleil": "Lunettes de soleil",
};

export const availabilityLabels: Record<Availability, string> = {
  "en-stock": "Disponible en boutique",
  "sur-commande": "Sur commande",
  epuise: "Épuisé",
};
