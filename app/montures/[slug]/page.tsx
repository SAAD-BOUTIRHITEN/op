import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { CatalogueNotice } from "@/components/shared/CatalogueNotice";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { RelatedFrames } from "@/components/product/RelatedFrames";
import { CATALOGUE_NEEDS_REVIEW,site } from "@/config/site";
import { getFrameBySlug, listFrameSlugs } from "@/lib/products/repository";
import { categoryLabels } from "@/lib/products/types";
import { breadcrumbJsonLd, frameJsonLd } from "@/lib/seo/jsonld";

type Params = Promise<{ slug: string }>;

/**
 * Toutes les fiches sont connues à la compilation. Une référence inconnue
 * doit donc renvoyer un vrai 404 dès le routage, sans rendu. Avec le CMS, un
 * nouveau modèle apparaîtra au déploiement suivant — à déclencher par un
 * webhook Sanity vers un build hook Netlify.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await listFrameSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const frame = await getFrameBySlug(slug);

  if (!frame) {
    return { title: "Modèle introuvable", robots: { index: false, follow: true } };
  }

  const title = `${frame.name} — ${frame.brand}`;
  const description = `${frame.name} de ${frame.brand}, référence ${frame.reference}. À essayer chez ${site.BUSINESS_NAME}, ${site.CITY}.`;

  return {
    title,
    description,
    alternates: { canonical: `/montures/${frame.slug}` },
    openGraph: {
      type: "website",
      title: `${title} | ${site.BUSINESS_NAME}`,
      description,
      url: `/montures/${frame.slug}`,
      // Pas d'`images` ici : le segment possède son propre
      // `opengraph-image.tsx`, qui compose la carte 1200x630 avec le verrou de
      // marque. La fixer ici la remplacerait par la photo brute 1600x1200.
    },
    // Même règle que le catalogue : rien de fictif n'est indexé.
    robots: CATALOGUE_NEEDS_REVIEW ? { index: false, follow: true } : undefined,
  };
}

export default async function FramePage({ params }: { params: Params }) {
  const { slug } = await params;
  const frame = await getFrameBySlug(slug);
  if (!frame) notFound();

  const structuredData = [
    breadcrumbJsonLd([
      { name: "Accueil", path: "/" },
      { name: "Montures", path: "/montures" },
      {
        name: categoryLabels[frame.category],
        path: `/montures/${frame.category}`,
      },
      { name: frame.name, path: `/montures/${frame.slug}` },
    ]),
    ...(CATALOGUE_NEEDS_REVIEW ? [] : [frameJsonLd(frame)]),
  ];

  return (
    <>
      <section className="pt-10 pb-section lg:pt-14">
        <Container>
          <nav aria-label="Fil d'Ariane" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-ui font-light text-taupe">
              <li>
                <Link href="/" className="inline-block py-2 transition-colors hover:text-noir">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/montures" className="inline-block py-2 transition-colors hover:text-noir">
                  Montures
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/montures/${frame.category}`}
                  className="inline-block py-2 transition-colors hover:text-noir"
                >
                  {categoryLabels[frame.category]}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-noir">
                {frame.name}
              </li>
            </ol>
          </nav>

          {CATALOGUE_NEEDS_REVIEW ? (
            <div className="mb-8">
              <CatalogueNotice compact />
            </div>
          ) : null}

          <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <ProductGallery frame={frame} />
            <ProductInfo frame={frame} />
          </div>
        </Container>
      </section>

      <RelatedFrames frame={frame} />

      <JsonLd data={structuredData} />
    </>
  );
}
