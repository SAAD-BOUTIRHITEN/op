import type { Metadata } from "next";
import { site } from "@/config/site";

/** Carte de marque servie par `app/opengraph-image.png`. */
const BRAND_OG_IMAGE = "/opengraph-image.png";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Chemin canonique, ex. « /montures ». */
  path: string;
  /** Titre Open Graph, si différent du titre de page. */
  ogTitle?: string;
  noIndex?: boolean;
  /**
   * À activer quand le segment possède son propre `opengraph-image.tsx` :
   * Next ajoutera lui-même l'image générée, et fixer `images` ici l'écraserait.
   */
  ownOgImage?: boolean;
}

/**
 * Métadonnées de page, composées au même endroit pour tout le site.
 *
 * Deux pièges que cette fonction ferme définitivement :
 *
 * 1. Un objet `openGraph` défini dans une page **remplace** celui du layout
 *    parent — images comprises. Trois pages se retrouvaient sans aperçu de
 *    partage parce qu'elles redéfinissaient `openGraph` sans `images`.
 * 2. Une page qui oublie `alternates.canonical` hérite de celui du layout.
 *    Le chemin est donc obligatoire ici.
 */
export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  noIndex = false,
  ownOgImage = false,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_MA",
      siteName: site.BUSINESS_NAME,
      title: ogTitle ?? `${title} | ${site.BUSINESS_NAME}`,
      description,
      url: path,
      ...(ownOgImage ? {} : { images: [{ url: BRAND_OG_IMAGE }] }),
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
