import { isSet, site } from "@/config/site";
import { categoryLabels, type Availability, type Frame } from "@/lib/products/types";

type JsonLdValue = string | number | boolean | JsonLdObject | JsonLdValue[];
export type JsonLdObject = { [key: string]: JsonLdValue | undefined };

/** Retire les champs vides pour ne jamais publier de donnée structurée creuse. */
function compact(input: JsonLdObject): JsonLdObject {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === "string") return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    }),
  ) as JsonLdObject;
}

/**
 * `Optician` est un sous-type valide de `LocalBusiness` sur schema.org.
 * Le double typage avec `Store` reste valide en JSON-LD et couvre les deux
 * intentions de recherche (soin visuel et commerce).
 */
export function opticianJsonLd(): JsonLdObject {
  const sameAs = [site.INSTAGRAM_URL, site.GOOGLE_MAPS_URL].filter(isSet);

  // Une PostalAddress sans streetAddress est un signal LocalBusiness incomplet :
  // mieux vaut ne rien émettre que d'émettre une adresse partielle.
  const address = isSet(site.ADDRESS)
    ? compact({
        "@type": "PostalAddress",
        streetAddress: site.ADDRESS,
        postalCode: site.POSTAL_CODE,
        addressLocality: site.CITY,
        addressRegion: site.REGION,
        addressCountry: site.COUNTRY_CODE,
      })
    : undefined;

  const openingHoursSpecification = site.OPENING_HOURS.map((slot) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: slot.days.map((day) => `https://schema.org/${day}`),
    opens: slot.opens,
    closes: slot.closes,
  }));

  return compact({
    "@context": "https://schema.org",
    "@type": ["Optician", "Store"],
    "@id": `${site.SITE_URL}/#business`,
    name: site.BUSINESS_NAME,
    description: site.DESCRIPTION,
    slogan: site.TAGLINE,
    url: site.SITE_URL,
    telephone: site.PHONE,
    email: site.EMAIL,
    currenciesAccepted: site.CURRENCY,
    address,
    geo: site.GEO
      ? {
          "@type": "GeoCoordinates",
          latitude: site.GEO.lat,
          longitude: site.GEO.lng,
        }
      : undefined,
    openingHoursSpecification,
    sameAs,
    hasMap: site.GOOGLE_MAPS_URL,
    // Volontairement absent : aggregateRating et review.
    // Aucun balisage d'avis ne sera émis tant que des avis Google réels
    // ne seront pas connectés (risque d'action manuelle).
  });
}

/**
 * Un noeud LocalBusiness sans adresse ni téléphone n'apporte rien et signale
 * une fiche incomplète. On ne l'émet qu'une fois l'entreprise renseignée.
 */
export function hasBusinessIdentity(): boolean {
  return isSet(site.ADDRESS) || isSet(site.PHONE);
}

export function websiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.SITE_URL}/#website`,
    name: site.BUSINESS_NAME,
    url: site.SITE_URL,
    inLanguage: "fr-MA",
    ...(hasBusinessIdentity() ? { publisher: { "@id": `${site.SITE_URL}/#business` } } : {}),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.SITE_URL}/montures?recherche={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Donnees structurees du site, adaptees a ce qui est reellement renseigne. */
export function siteJsonLd(): JsonLdObject[] {
  return hasBusinessIdentity()
    ? [opticianJsonLd(), websiteJsonLd()]
    : [websiteJsonLd()];
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: `${site.SITE_URL}${step.path}`,
    })),
  };
}

/**
 * Liste des montures du catalogue. N'est jamais emise tant que le catalogue
 * contient des donnees de demonstration : publier des modeles fictifs dans
 * des donnees structurees reviendrait a les presenter comme reels.
 */
export function frameListJsonLd(frames: Frame[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Montures — ${site.BUSINESS_NAME}`,
    numberOfItems: frames.length,
    itemListElement: frames.map((frame, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${frame.brand} ${frame.name}`,
      url: `${site.SITE_URL}/montures/${frame.slug}`,
    })),
  };
}

const availabilitySchema: Record<Availability, string> = {
  "en-stock": "https://schema.org/InStock",
  "sur-commande": "https://schema.org/BackOrder",
  epuise: "https://schema.org/OutOfStock",
};

function absoluteUrl(path: string): string {
  return /^https?:/i.test(path) ? path : `${site.SITE_URL}${path}`;
}

/**
 * Fiche produit. Comme pour ItemList, elle n'est jamais emise tant que le
 * catalogue est en mode demonstration.
 *
 * `offers` n'apparait que si un prix existe : une Offer sans prix est
 * invalide, et « prix sur demande » est un cas normal chez un opticien.
 */
export function frameJsonLd(frame: Frame): JsonLdObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${frame.brand} ${frame.name}`,
    sku: frame.reference,
    mpn: frame.reference,
    description: frame.description,
    category: categoryLabels[frame.category],
    brand: { "@type": "Brand", name: frame.brand },
    color: frame.colors.map((colour) => colour.name),
    image: frame.images.map((image) => absoluteUrl(image.url)),
    url: `${site.SITE_URL}/montures/${frame.slug}`,
    ...(frame.price !== null
      ? {
          offers: compact({
            "@type": "Offer",
            price: frame.price,
            priceCurrency: site.CURRENCY,
            availability: availabilitySchema[frame.availability],
            url: `${site.SITE_URL}/montures/${frame.slug}`,
            ...(hasBusinessIdentity()
              ? { seller: { "@id": `${site.SITE_URL}/#business` } }
              : {}),
          }),
        }
      : {}),
  });
}
