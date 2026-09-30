import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { CatalogView } from "@/components/catalog/CatalogView";
import { CatalogueNotice } from "@/components/shared/CatalogueNotice";
import { JsonLd } from "@/components/seo/JsonLd";
import { CATALOGUE_NEEDS_REVIEW, site } from "@/config/site";
import { listBrands, listFrames } from "@/lib/products/repository";
import { applyQuery } from "@/lib/products/filter";
import {
  facetByKey,
  facetForFilters,
  filtersToQuery,
  mergeFiltersIntoSearch,
  parseCatalogFilters,
  toURLSearchParams,
  type CatalogFilters,
  type FacetKey,
} from "@/lib/products/catalog-params";
import { breadcrumbJsonLd, frameListJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Export statique (GitHub Pages) : la page est fabriquée une fois au build, sans
 * requête. Lire `searchParams` côté serveur est alors impossible — la marque et
 * la recherche de l'URL sont relues dans le navigateur par CatalogView.
 */
const STATIC = process.env.STATIC_EXPORT === "1";

/**
 * Fabrique d'une page de catalogue. Les cinq onglets (/montures,
 * /montures/lunettes-de-vue…) sont cinq vraies routes qui partagent ce code :
 * chacune a son titre, sa description, son URL canonique et sa place dans le
 * sitemap.
 */
export function catalogRoute(key: FacetKey) {
  const facet = facetByKey(key);

  async function generateMetadata({
    searchParams,
  }: {
    searchParams?: SearchParams;
  }): Promise<Metadata> {
    const refinements = parseCatalogFilters(
      toURLSearchParams(STATIC || !searchParams ? {} : await searchParams),
    );
    const title =
      key === "toutes" ? facet.title : `${facet.title} à ${site.CITY}`;

    return pageMetadata({
      title,
      description: `${facet.lede} ${site.BUSINESS_NAME}, ${site.CITY}.`,
      // Filtrer par marque ne crée pas une autre page : la canonique reste
      // l'onglet. Une page de résultats de recherche n'est jamais indexée.
      path: facet.path,
      noIndex: CATALOGUE_NEEDS_REVIEW || refinements.search.length > 0,
    });
  }

  async function Page({ searchParams }: { searchParams?: SearchParams }) {
    const params = toURLSearchParams(STATIC || !searchParams ? {} : await searchParams);
    const refinements = parseCatalogFilters(params);

    // Anciennes adresses (?categorie=… / ?selection=…) : redirection 301 vers
    // l'URL propre, en conservant la marque et la recherche.
    if (key === "toutes" && (refinements.category || refinements.selection)) {
      const target = facetForFilters(refinements);
      permanentRedirect(`${target.path}${mergeFiltersIntoSearch(params.toString(), refinements)}`);
    }

    const initialFilters: CatalogFilters = {
      ...facet.axis,
      brand: refinements.brand,
      search: refinements.search,
    };

    const [frames, brands] = await Promise.all([listFrames(), listBrands()]);
    const facetFrames = applyQuery(frames, filtersToQuery({ ...initialFilters, brand: null, search: "" }));

    const crumbs = [
      { name: "Accueil", path: "/" },
      { name: "Montures", path: "/montures" },
      ...(key === "toutes" ? [] : [{ name: facet.heading, path: facet.path }]),
    ];
    const structuredData = [
      breadcrumbJsonLd(crumbs),
      ...(CATALOGUE_NEEDS_REVIEW ? [] : [frameListJsonLd(facetFrames)]),
    ];

    return (
      <section className="pt-8 pb-section lg:pt-section">
        <Container>
          <h1 className="font-serif text-title">{facet.heading}</h1>
          <p className="measure mt-4 text-body font-light text-taupe">{facet.lede}</p>

          {CATALOGUE_NEEDS_REVIEW ? (
            <div className="mt-8">
              <CatalogueNotice />
            </div>
          ) : null}

          <div className="mt-10">
            <CatalogView
              frames={frames}
              brands={brands}
              facetKey={key}
              initialFilters={initialFilters}
            />
          </div>
        </Container>

        <JsonLd data={structuredData} />
      </section>
    );
  }

  return { generateMetadata, Page };
}
