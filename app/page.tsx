import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ServicesStrip } from "@/components/home/ServicesStrip";
import { CollectionsGrid } from "@/components/home/CollectionsGrid";
import { FeaturedFrames } from "@/components/home/FeaturedFrames";
import { BrandStory } from "@/components/home/BrandStory";
import { WhyLunea } from "@/components/home/WhyLunea";
import { Reviews } from "@/components/home/Reviews";
import { InstagramSection } from "@/components/home/InstagramSection";
import { LocationSection } from "@/components/home/LocationSection";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";

/*
 * Auparavant construites à la main avec `alternates: { canonical: "/" }`
 * mais sans `openGraph.url` — la seule page du site sans cette balise. Un
 * audit systématique par page l'a détecté après la migration de domaine ;
 * `pageMetadata()` existe précisément pour fermer ce genre d'écart.
 */
export const metadata: Metadata = pageMetadata({
  title: `${site.BUSINESS_NAME} — Opticien à ${site.CITY}`,
  // Le titre de page porte déjà le nom de la marque : sans cet `ogTitle`,
  // le comportement par défaut l'aurait ajouté une seconde fois en suffixe.
  ogTitle: `${site.BUSINESS_NAME} — ${site.TAGLINE}`,
  description: site.DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesStrip />
      <CollectionsGrid />
      <FeaturedFrames />
      <BrandStory />
      <WhyLunea />
      <Reviews />
      <InstagramSection />
      <LocationSection />
    </>
  );
}
