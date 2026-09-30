import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** Requis par l'export statique (GitHub Pages) ; sans effet ailleurs. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // `/selftest` est déjà en 404 sans ENABLE_SELFTEST ; l'exclure évite
      // qu'un robot ne la découvre si elle est activée un jour par erreur.
      disallow: ["/api/", "/selftest"],
    },
    sitemap: `${site.SITE_URL}/sitemap.xml`,
  };
}
