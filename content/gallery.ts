import type { ImageAsset } from "@/lib/media";

/**
 * Vignettes de la section Instagram. La grille s'adapte au nombre d'entrées ;
 * un multiple de quatre reste le plus équilibré.
 */
export const instagramTiles: readonly ImageAsset[] = [
  {
    url: "/images/instagram/1.jpg",
    alt: "Gros plan sur la charnière dorée d'une monture en acétate noir",
    width: 1000,
    height: 1000,
  },
  {
    url: "/images/instagram/2.jpg",
    alt: "Lunettes de soleil écaille posées près d'un étui en toile beige",
    width: 1000,
    height: 1000,
  },
  {
    url: "/images/instagram/3.jpg",
    alt: "Coin d'essayage de la boutique : miroir en laiton, tabouret et plante",
    width: 1000,
    height: 1000,
  },
  {
    url: "/images/instagram/4.jpg",
    alt: "Lunettes rondes en métal doré posées sur un carnet ouvert",
    width: 1000,
    height: 1000,
  },
] as const;
