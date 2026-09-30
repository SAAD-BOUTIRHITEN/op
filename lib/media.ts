/**
 * Image du site. Même forme que `FrameImage` : un seul contrat, que l'image
 * vienne du dépôt local ou, plus tard, du CDN du CMS.
 */
export interface ImageAsset {
  url: string;
  alt: string;
  width: number;
  height: number;
  /** Vignette encodée, pour un chargement progressif. Réservée au LCP. */
  blurDataURL?: string;
}
