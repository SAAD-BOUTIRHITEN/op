import type { MetadataRoute } from "next";
import { CATALOGUE_NEEDS_REVIEW,site } from "@/config/site";
import { listFrames } from "@/lib/products/repository";
import { FACETS } from "@/lib/products/catalog-params";
import { hasBusinessIdentity } from "@/lib/seo/jsonld";

/**
 * Le sitemap n'annonce que des URL réellement indexables. Y lister une page en
 * `noindex` envoie à Google deux consignes contradictoires, ce qui use le
 * budget d'exploration sans rien rapporter.
 *
 * Sont donc exclues : les pages légales (encore des gabarits en noindex),
 * `/contact` tant qu'aucune adresse ni téléphone n'est renseigné, et les
 * fiches montures si le catalogue est repassé en révision.
 */
/** Requis par l'export statique (GitHub Pages) ; sans effet ailleurs. */
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const frames = await listFrames();
  const newest = frames[0]?.createdAt;

  const entries: MetadataRoute.Sitemap = [
    { url: `${site.SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    {
      url: `${site.SITE_URL}/a-propos`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  if (hasBusinessIdentity()) {
    entries.push({
      url: `${site.SITE_URL}/contact`,
      changeFrequency: "yearly",
      priority: 0.8,
    });
  }

  if (!CATALOGUE_NEEDS_REVIEW) {
    // Chaque onglet du catalogue est une page à part entière, avec sa
    // canonique : /montures, /montures/lunettes-de-vue, etc.
    for (const facet of FACETS) {
      entries.push({
        url: `${site.SITE_URL}${facet.path}`,
        ...(newest ? { lastModified: new Date(newest) } : {}),
        changeFrequency: "weekly",
        priority: facet.key === "toutes" ? 0.9 : 0.8,
      });
    }

    for (const frame of frames) {
      entries.push({
        url: `${site.SITE_URL}/montures/${frame.slug}`,
        lastModified: new Date(frame.createdAt),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
