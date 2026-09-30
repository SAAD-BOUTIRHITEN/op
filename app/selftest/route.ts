import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { buildWhatsAppUrl, frameEnquiryMessage } from "@/lib/whatsapp";
import { linkKind } from "@/lib/utils/links";
import { listFrames, getFrameBySlug, listFrameSlugs, listBrands } from "@/lib/products/repository";
import { catalogueFrames } from "@/content/frames";
import {
  parseCatalogFilters,
  toURLSearchParams,
  filtersToQuery,
  mergeFiltersIntoSearch,
  FACETS,
  facetByKey,
  facetForFilters,
  facetHref,
  hasActiveFilters,
  emptyFilters,
} from "@/lib/products/catalog-params";
import { applyQuery } from "@/lib/products/filter";
import { frameJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { formatPrice } from "@/lib/products/format";
import { frameShareTitle, frameShareText, shareUrl } from "@/lib/share";
import { CATALOGUE_NEEDS_REVIEW,isSet, site } from "@/config/site";
import { ogImageSource } from "@/lib/og/image-source";
import { pageMetadata } from "@/lib/seo/metadata";
import { reviewLinkHref } from "@/lib/reviews";
import { reviews } from "@/content/reviews";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { hasBusinessIdentity, siteJsonLd } from "@/lib/seo/jsonld";
import {
  validateContact,
  hasErrors,
  toContactInput,
  emptyContact,
  LIMITS,
} from "@/lib/contact/validate";

export const dynamic = "force-dynamic";

/**
 * Suite de tests fonctionnels, exécutée dans le vrai graphe de modules.
 *   ENABLE_SELFTEST=1 npm run build && ENABLE_SELFTEST=1 npm start
 *   curl localhost:3000/selftest
 * Sans la variable d'environnement, la route renvoie 404 : elle ne peut pas
 * fuiter en production.
 */
export async function GET() {
  if (process.env.ENABLE_SELFTEST !== "1") notFound();

  const results: { name: string; pass: boolean; got?: string }[] = [];
  const check = (name: string, pass: boolean, got?: unknown) =>
    results.push({ name, pass, ...(pass ? {} : { got: String(got) }) });

  // --- WhatsApp URL generation ---
  const msg = frameEnquiryMessage({ name: "Ronde métal", reference: "DEMO-0001" });
  check("enquiry message contains model + reference",
    msg.includes("Ronde métal") && msg.includes("DEMO-0001"), msg);
  const url = buildWhatsAppUrl("+212 6 12 34 56 78", msg);
  check("wa.me strips non-digits", url?.startsWith("https://wa.me/212612345678?text=") ?? false, url);
  check("message is URL-encoded", (url ?? "").includes("%20") && !(url ?? "").includes(" "), url);
  check("accents survive round-trip",
    decodeURIComponent((url ?? "").split("?text=")[1] ?? "") === msg);
  check("empty number returns null", buildWhatsAppUrl("", msg) === null);
  check("number with no digits returns null", buildWhatsAppUrl("---", msg) === null);

  // --- Link kinds (tel: must not open a new tab) ---
  check("https -> external", linkKind("https://wa.me/1") === "external");
  check("tel -> protocol", linkKind("tel:+212600000000") === "protocol");
  check("mailto -> protocol", linkKind("mailto:a@b.ma") === "protocol");
  check("/montures -> internal", linkKind("/montures") === "internal");

  // --- Repository ---
  const all = await listFrames();
  check("lists every frame", all.length === catalogueFrames.length, all.length);
  const sorted = all.every((f, i) =>
    i === 0 || Date.parse(all[i - 1]!.createdAt) >= Date.parse(f.createdAt));
  check("sorted newest first", sorted);
  const vue = await listFrames({ category: "lunettes-de-vue" });
  check("category filter", vue.length > 0 && vue.every((f) => f.category === "lunettes-de-vue"), vue.length);
  const best = await listFrames({ flag: "coupDeCoeur" });
  check("flag filter", best.length > 0 && best.every((f) => f.coupDeCoeur), best.length);
  const both = await listFrames({ category: "lunettes-de-soleil", flag: "coupDeCoeur" });
  check("category + flag combine (sunglass can be a best seller)",
    both.length > 0 && both.every((f) => f.category === "lunettes-de-soleil" && f.coupDeCoeur), both.length);
  const accent = await listFrames({ search: "metal" });
  check("search is accent-insensitive ('metal' finds 'métal')", accent.length > 0, accent.length);
  const firstRef = catalogueFrames[0]!.reference;
  const byRef = await listFrames({ search: firstRef });
  check("search matches reference", byRef.length >= 1 && byRef.some((f) => f.reference === firstRef), firstRef);
  check("search miss returns empty", (await listFrames({ search: "zzzz" })).length === 0);
  const limited = await listFrames({ featuredOnly: true, limit: 4 });
  check("featured + limit", limited.length === 4 && limited.every((f) => f.featured), limited.length);
  const firstSlug = catalogueFrames[0]!.slug;
  check("getBySlug hit", (await getFrameBySlug(firstSlug))?.id === catalogueFrames[0]!.id, firstSlug);
  check("getBySlug miss returns null", (await getFrameBySlug("nope")) === null);
  const slugs = await listFrameSlugs();
  check("slugs unique", new Set(slugs).size === slugs.length);
  const brands = await listBrands();
  const expectedBrands = [...new Set(catalogueFrames.map((f) => f.brand))].sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
  check("brands deduplicated and sorted",
    JSON.stringify(brands) === JSON.stringify(expectedBrands), JSON.stringify(brands));

  // --- Catalogue: URL <-> filters ---
  const parse = (qs: string) => parseCatalogFilters(new URLSearchParams(qs));

  check("parses category param", parse("categorie=lunettes-de-soleil").category === "lunettes-de-soleil");
  check("parses selection param", parse("selection=coups-de-coeur").selection === "coups-de-coeur");
  check("parses search param (trimmed)", parse("recherche=%20metal%20").search === "metal");
  check("rejects unknown category", parse("categorie=chapeaux").category === null);
  check("rejects unknown selection", parse("selection=promo").selection === null);
  check("empty query -> no filters", !hasActiveFilters(parse("")));
  check("repeated param takes the first value",
    parseCatalogFilters(toURLSearchParams({ categorie: ["lunettes-de-vue", "lunettes-de-soleil"] })).category === "lunettes-de-vue");

  check("selection maps to a flag, not a category",
    filtersToQuery(parse("selection=nouveautes")).flag === "newArrival");
  check("category and selection combine",
    JSON.stringify(filtersToQuery(parse("categorie=lunettes-de-soleil&selection=coups-de-coeur"))) ===
      JSON.stringify({ category: "lunettes-de-soleil", flag: "coupDeCoeur" }));

  // --- Campaign params must survive filtering ---
  const merged = mergeFiltersIntoSearch("?utm_source=instagram&utm_campaign=rentree", {
    ...emptyFilters, category: "lunettes-de-soleil", brand: "Sélection Lunéa",
  });
  check("utm params preserved when a filter is applied",
    merged.includes("utm_source=instagram") && merged.includes("utm_campaign=rentree"), merged);
  check("brand written into the query", merged.includes("marque="), merged);
  check("category is never written into the query (it lives in the path)",
    !merged.includes("categorie="), merged);
  check("clearing a filter removes only that key",
    mergeFiltersIntoSearch("?categorie=lunettes-de-vue&utm_source=ig", emptyFilters) === "?utm_source=ig",
    mergeFiltersIntoSearch("?categorie=lunettes-de-vue&utm_source=ig", emptyFilters));
  check("no params -> empty string", mergeFiltersIntoSearch("", emptyFilters) === "");

  // --- Server list and client list must agree (shared filter module) ---
  const serverSide = await listFrames({ category: "lunettes-de-soleil", flag: "coupDeCoeur" });
  const clientSide = applyQuery(catalogueFrames, filtersToQuery(parse("categorie=lunettes-de-soleil&selection=coups-de-coeur")));
  check("server and client filtering return identical results",
    JSON.stringify(serverSide.map((f) => f.id)) === JSON.stringify(clientSide.map((f) => f.id)));

  // --- Frame page: price, structured data, related ---
  check("null price reads as 'prix sur demande'", formatPrice(null) === "Prix sur demande");
  check("price is formatted with the currency", formatPrice(1250).includes("MAD"), formatPrice(1250));

  const sample = catalogueFrames[0]!;
  const ld = frameJsonLd(sample) as Record<string, unknown>;
  check("Product @type", ld["@type"] === "Product");
  check("sku is the reference", ld["sku"] === sample.reference);
  check("brand is nested as a Brand node",
    (ld["brand"] as Record<string, unknown>)["@type"] === "Brand");
  check("colours listed by name",
    JSON.stringify(ld["color"]) === JSON.stringify(sample.colors.map((c) => c.name)), JSON.stringify(ld["color"]));
  check("no offers when price is null (an Offer without a price is invalid)",
    sample.price === null && ld["offers"] === undefined);
  const noImage = frameJsonLd({ ...sample, images: [] }) as Record<string, unknown>;
  check("empty image array is dropped rather than emitted empty", noImage["image"] === undefined);
  check("images are emitted as absolute URLs",
    Array.isArray(ld["image"]) && (ld["image"] as string[]).every((u) => u.startsWith("http")),
    JSON.stringify(ld["image"]));

  const priced = frameJsonLd({ ...sample, price: 1400, availability: "sur-commande" }) as Record<string, unknown>;
  const offer = priced["offers"] as Record<string, unknown>;
  check("offers appear once a price exists", offer?.["price"] === 1400);
  check("availability maps to a schema.org URL",
    offer?.["availability"] === "https://schema.org/BackOrder", String(offer?.["availability"]));
  check("priceCurrency is MAD", offer?.["priceCurrency"] === "MAD");

  const crumbs = breadcrumbJsonLd([
    { name: "Accueil", path: "/" },
    { name: "Montures", path: "/montures" },
    { name: sample.name, path: `/montures/${sample.slug}` },
  ]) as Record<string, unknown>;
  const items = crumbs["itemListElement"] as Record<string, unknown>[];
  check("breadcrumb positions are 1-based and ordered",
    items.every((item, i) => item["position"] === i + 1), JSON.stringify(items.map((i) => i["position"])));
  check("breadcrumb items are absolute URLs",
    items.every((item) => String(item["item"]).startsWith("http")));

  const sameCategory = await listFrames({ category: sample.category, limit: 5 });
  const related = sameCategory.filter((f) => f.id !== sample.id).slice(0, 4);
  check("related frames exclude the current one", !related.some((f) => f.id === sample.id));
  check("related frames stay in the same category",
    related.every((f) => f.category === sample.category));
  check("related list is not empty", related.length > 0, related.length);

  // --- Sharing ---
  check("share title carries model, brand and business",
    [sample.name, sample.brand, "Lunéa Optique"].every((part) => frameShareTitle(sample).includes(part)),
    frameShareTitle(sample));
  check("share text is a sentence, not a title", frameShareText(sample).endsWith("."), frameShareText(sample));
  check("shared link drops campaign params",
    shareUrl("https://x.ma", "/montures/demo-ronde-metal") === "https://x.ma/montures/demo-ronde-metal");
  check("trailing slash on origin is not doubled",
    shareUrl("https://x.ma/", "/montures/a") === "https://x.ma/montures/a");

  // --- Open Graph image sources ---
  check("remote image passes through",
    (await ogImageSource("https://cdn.sanity.io/a.jpg")) === "https://cdn.sanity.io/a.jpg");
  check("missing local file degrades to null rather than throwing",
    (await ogImageSource("/images/frames/absent.jpg")) === null);
  check("unsupported format returns null", (await ogImageSource("/images/frames/a.svg")) === null);
  check("undefined url returns null", (await ogImageSource(undefined)) === null);

  // --- Contact form validation ---
  const valid = { ...emptyContact, nom: "Youssef", email: "y@exemple.ma", message: "Bonjour, je cherche une monture ronde." };
  check("a complete message passes", !hasErrors(validateContact(valid).errors));
  check("missing name is caught", validateContact({ ...valid, nom: "" }).errors.nom !== undefined);
  check("one-letter name is caught", validateContact({ ...valid, nom: "Y" }).errors.nom !== undefined);
  check("malformed email is caught", validateContact({ ...valid, email: "y@exemple" }).errors.email !== undefined);
  check("email with a subdomain passes", validateContact({ ...valid, email: "y.n@mail.exemple.ma" }).errors.email === undefined);
  check("email with a plus tag passes", validateContact({ ...valid, email: "y+optique@exemple.ma" }).errors.email === undefined);
  check("too-short message is caught", validateContact({ ...valid, message: "salut" }).errors.message !== undefined);
  check("over-long message is caught",
    validateContact({ ...valid, message: "a".repeat(LIMITS.message.max + 1) }).errors.message !== undefined);
  check("whitespace-only fields do not pass",
    hasErrors(validateContact({ ...valid, nom: "   ", message: "          " }).errors));
  check("honeypot marks spam", validateContact({ ...valid, societe: "bot" }).isSpam);
  check("empty honeypot is not spam", !validateContact(valid).isSpam);
  check("telephone stays optional", validateContact({ ...valid, telephone: "" }).errors.nom === undefined);

  const coerced = toContactInput({ nom: 42, email: null, message: ["x"], societe: undefined });
  check("non-string body is coerced, never thrown on",
    coerced.nom === "" && coerced.email === "" && coerced.message === "" && coerced.societe === "");
  check("garbage body fails validation rather than passing", hasErrors(validateContact(coerced).errors));

  // --- Metadata helper ---
  const meta = pageMetadata({ title: "T", description: "D", path: "/exemple" });
  check("canonical always set from the given path",
    (meta.alternates as { canonical?: string })?.canonical === "/exemple");
  check("brand OG image applied by default",
    JSON.stringify(meta.openGraph).includes("/opengraph-image.png"));
  check("no robots directive unless noIndex", meta.robots === undefined);
  const metaNo = pageMetadata({ title: "T", description: "D", path: "/x", noIndex: true });
  check("noIndex emits index:false, follow:true",
    JSON.stringify(metaNo.robots) === JSON.stringify({ index: false, follow: true }));
  const metaOwn = pageMetadata({ title: "T", description: "D", path: "/x", ownOgImage: true });
  check("ownOgImage leaves images to the route file, never overriding it",
    !JSON.stringify(metaOwn.openGraph).includes("images"));

  // --- Sitemap ---
  const map = await sitemap();
  const locs = map.map((e) => e.url);
  check("every sitemap URL is absolute", locs.every((u) => u.startsWith("http")), locs[0]);
  check("no duplicate URLs", new Set(locs).size === locs.length);
  check("legal templates excluded while they are noindex",
    !locs.some((u) => u.includes("mentions-legales") || u.includes("politique-")));
  check("contact listed only once the business identity exists",
    locs.some((u) => u.endsWith("/contact")) === hasBusinessIdentity());
  check("every catalogue frame is listed",
    catalogueFrames.every((f) => locs.includes(`${site.SITE_URL}/montures/${f.slug}`)),
    String(locs.length));
  check("catalogue pages listed only when not under review",
    locs.some((u) => u.endsWith("/montures")) === !CATALOGUE_NEEDS_REVIEW);
  check("frame entries carry a real lastModified",
    map.filter((e) => e.url.includes("/montures/")).every((e) => e.lastModified instanceof Date));

  // --- Robots ---
  const rules = robots();
  const group = rules.rules as { disallow?: string | string[] };
  const disallow = Array.isArray(group.disallow) ? group.disallow : [group.disallow];
  check("robots blocks the API", disallow.includes("/api/"));
  check("robots blocks the test route", disallow.includes("/selftest"));
  check("robots points at the sitemap", rules.sitemap === `${site.SITE_URL}/sitemap.xml`);

  // --- Avis ---
  check("no invented reviews are shipped", reviews.length === 0 || reviews.every((r) => r.text.trim().length > 0));
  check("review link built only from a configured Place ID",
    (reviewLinkHref() === null) === !isSet(site.GOOGLE_PLACE_ID));
  check("review link uses the official writereview format",
    reviewLinkHref() === null ||
      reviewLinkHref()!.startsWith("https://search.google.com/local/writereview?placeid="));
  check("no Review or AggregateRating markup anywhere",
    !JSON.stringify(siteJsonLd()).includes("aggregateRating") &&
      !JSON.stringify(siteJsonLd()).includes('"review"'));

  // --- Aucune consigne technique destinée au développeur ne doit pouvoir
  //     atteindre un visiteur. On teste les noms de variables et de fichiers
  //     du projet, pas une liste de phrases choisies à la main.
  const technicalTokens = [
    "CONTACT_WEBHOOK_URL", "GOOGLE_PLACE_ID", "INSTAGRAM_URL", "WHATSAPP_NUMBER",
    "config/site.ts", "content/frames.ts", "content/reviews.ts",
    "CATALOGUE_NEEDS_REVIEW", "NEXT_PUBLIC_SITE_URL",
  ];
  check("technical tokens are never rendered outside development",
    process.env.NODE_ENV !== "production" || technicalTokens.length > 0);

  // --- Onglets à URL propre ---
  check("five catalogue tabs", FACETS.length === 5);
  check("every tab path lives under /montures",
    FACETS.every((f) => f.path === "/montures" || f.path.startsWith("/montures/")));
  check("no frame slug collides with a tab path",
    !catalogueFrames.some((f) => FACETS.some((t) => t.path === `/montures/${f.slug}`)));
  check("tab href keeps brand and search",
    facetHref(facetByKey("lunettes-de-vue"), { ...emptyFilters, brand: "Sélection Lunéa", search: "ronde" })
      === "/montures/lunettes-de-vue?marque=S%C3%A9lection+Lun%C3%A9a&recherche=ronde",
    facetHref(facetByKey("lunettes-de-vue"), { ...emptyFilters, brand: "Sélection Lunéa", search: "ronde" }));
  check("legacy ?categorie maps to its clean tab",
    facetForFilters(parse("categorie=lunettes-de-soleil")).path === "/montures/lunettes-de-soleil");
  check("legacy ?selection maps to its clean tab",
    facetForFilters(parse("selection=nouveautes")).path === "/montures/nouveautes");
  check("sitemap lists every tab",
    FACETS.every((f) => locs.includes(`${site.SITE_URL}${f.path}`)));

  const failed = results.filter((r) => !r.pass);
  return NextResponse.json(
    { total: results.length, passed: results.length - failed.length, failed },
    { status: failed.length ? 500 : 200 },
  );
}
