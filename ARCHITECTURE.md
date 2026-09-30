# LUNÉA OPTIQUE — Architecture & Design System
**Step 1 deliverable.** Direction: Concept 2 — Moderne & Sophistiqué.
Stack: Next.js (App Router) · TypeScript · Tailwind CSS.

---

## 1. Sitemap

```
/                      Accueil — editorial homepage
/montures              Catalogue (search + facets, client island)
/montures/[slug]       Fiche monture (+ dynamic OG image)
/a-propos              Marque & savoir-faire
/contact               Local landing page (NAP, carte, formulaire)
/mentions-legales      Legal
/politique-confidentialite
```

Machine routes: `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/montures/[slug]/opengraph-image`.

Deliberately **not** built: cart, checkout, account, wishlist. The conversion is a
conversation, not a transaction.

### Naming note
`/montures` is the right URL, not `/produits` or `/collections`. It matches how
customers search in French Morocco and it reads as a boutique, not a catalogue.

---

## 2. User journeys

Three entry points matter, in this order of volume.

**A. Google / Google Business Profile → store visit**
`GBP listing → / or /contact → sees address, hours, map → "Itinéraire" or "Appeler"`
Requirement: address, phone and hours must be reachable without scrolling on
`/contact`, and present in the footer of every page.

**B. Instagram → frame discovery → WhatsApp**
`Bio link → / → Nos montures → /montures → filter → /montures/[slug] → "Demander ce modèle sur WhatsApp"`
Requirement: at most 3 taps from landing to a pre-filled WhatsApp message.

**C. WhatsApp share → second customer** *(the compounding loop)*
`Customer shares /montures/[slug] → recipient sees rich preview (photo + model + brand) → opens page → WhatsApp or store visit`
Requirement: per-frame Open Graph metadata is non-negotiable. A share that
renders as a bare URL breaks this entire loop.

**Conversion rule applied throughout:** every frame page exposes exactly two
actions — *demander sur WhatsApp* (primary) and *partager* (secondary). Phone
and itinerary live one level up, in the persistent surfaces.

---

## 3. Design tokens

### Colour — taken from the moodboard, unchanged

| Token | Hex | Role |
|---|---|---|
| `noir` | `#111111` | Hero field, footer, primary text, primary button |
| `creme` | `#F8F6F2` | Page background |
| `creme-deep` | `#EFEAE2` | Alternating section band (derived) |
| `beige` | `#D4B895` | Image wells, soft fields |
| `taupe` | `#6B5E52` | Secondary text, hairlines on light |
| `or` | `#D4AF7C` | Accent — rules, active state, small marks only |

Derived: `hairline-light: rgba(17,17,17,.10)`, `hairline-dark: rgba(248,246,242,.14)`.

**Discipline rule:** gold never fills a surface. It appears as a 1px rule, an
underline on hover, or a glyph under 24px. No gradients anywhere.

### Typography

| Role | Face | Size | Tracking / leading |
|---|---|---|---|
| Display (hero) | Playfair Display 400 | `clamp(40px, 8.5vw, 92px)` | `-0.015em` / `1.02` |
| Section title | Playfair Display 400 | `clamp(30px, 4.6vw, 52px)` | `-0.01em` / `1.1` |
| Frame name | Playfair Display 400 | `20–24px` | `1.25` |
| Body | Montserrat 400 | `15–17px` | `1.7`, measure ≤ 68ch |
| UI / nav | Montserrat 500 | `13–14px` | `0.02em` |
| Micro label | Montserrat 500 | `11px` uppercase | `0.22em` |
| Logo lockup | Playfair Display 500 | — | `LUNÉA` at `0.28em`, `OPTIQUE` at `0.42em` |

Two families only. Micro labels stay rare — category chips and the logo — so
uppercase tracking reads as brand, not as decoration on every heading.

### Space, shape, motion

- Scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 160`
- Section rhythm: `clamp(72px, 12vw, 160px)` vertical
- Container: `1280px`, gutters `20px` mobile / `40px` desktop
- Radius: `0` default · `2px` buttons/inputs · `999px` only for the WhatsApp pill
- Shadows: none on cards. Elevation comes from hairlines and whitespace. One
  exception: the sticky header gains `0 1px 0 hairline` after scroll.
- Transitions: `180ms` UI, `600ms cubic-bezier(.2,.7,.3,1)` reveals
- Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`
- **One** orchestrated motion: a staggered hero entrance on load. Elsewhere,
  motion only answers a tap (menu, gallery, filters). All of it gated behind
  `prefers-reduced-motion`.

---

## 4. Component architecture

```
components/
  layout/     Navbar · MobileMenu · MobileActionBar · Footer
  home/       Hero · ServicesStrip · CollectionsGrid · FeaturedFrames
              BrandStory · WhyLunea · Reviews · InstagramSection · LocationSection
  catalog/    CatalogView(client) · SearchField · FacetBar · ProductGrid · EmptyState
  product/    ProductGallery(client) · ProductInfo · ColorSwatches · RelatedFrames
  shared/     Button · Container · SectionHeading · ProductCard · CategoryCard
              WhatsAppButton · ShareButton(client) · Reveal(client) · Rule
  seo/        JsonLd
```

Client components, deliberately only these five: `MobileMenu`, `CatalogView`,
`ProductGallery`, `ShareButton`, `Reveal`. Everything else is a Server Component.
`ProductCard` stays a server component — the WhatsApp CTA is a plain `<a href>`,
no JS needed.

---

## 5. Product data model

```ts
export type FrameCategory   = 'lunettes-de-vue' | 'lunettes-de-soleil';
export type Availability    = 'en-stock' | 'sur-commande' | 'epuise';

export interface FrameColor { name: string; hex: string }

export interface FrameImage {
  url: string; alt: string; width: number; height: number;
  blurDataURL?: string;
}

export interface Frame {
  id: string;
  slug: string;            // 'ray-ban-rx1234'
  name: string;
  brand: string;
  reference: string;
  category: FrameCategory;
  description: string;
  images: FrameImage[];    // [0] is the card + OG image
  colors: FrameColor[];
  price: number | null;    // MAD. null renders "Prix sur demande"
  availability: Availability;
  featured: boolean;
  newArrival: boolean;
  coupDeCoeur: boolean;
  createdAt: string;       // ISO
}
```

**Modelling decision worth flagging:** the brief lists five catalogue tabs, but
*Nouveautés* and *Coups de cœur* are **flags, not categories**. Storing them as
category values would make a frame unable to be both a sunglass and a coup
de cœur. The facet bar therefore filters on `category` **or** on a boolean flag,
never mixing the two into one enum.

Query shape:

```ts
interface FrameQuery {
  category?: FrameCategory;
  flag?: 'newArrival' | 'coupDeCoeur';
  brand?: string;
  search?: string;         // matches name, brand, reference
}
```

---

## 6. Folder structure

```
app/
  layout.tsx                  fonts, metadataBase, LocalBusiness JSON-LD
  page.tsx                    Accueil
  montures/page.tsx           Catalogue
  montures/[slug]/page.tsx    Fiche
  montures/[slug]/opengraph-image.tsx
  a-propos/page.tsx
  contact/page.tsx
  api/contact/route.ts
  sitemap.ts · robots.ts · not-found.tsx · globals.css
components/                   (see §4)
config/
  site.ts                     ALL business constants — single source of truth
  navigation.ts
content/
  frames.ts                   seed catalogue (CMS stage 0)
lib/
  products/types.ts
  products/repository.ts      ← the single CMS swap point
  products/local-source.ts
  whatsapp.ts · share.ts
  seo/metadata.ts · seo/jsonld.ts
  utils/cn.ts
```

### Business configuration — `config/site.ts`

Every value is a placeholder until you supply the real one. Nothing is invented,
and no business string appears anywhere else in the codebase.

```ts
export const site = {
  BUSINESS_NAME:   'Lunéa Optique',
  TAGLINE:         'Votre vision, votre style.',
  CITY:            'Casablanca',        // from the moodboard — confirm
  ADDRESS:         '',                  // TODO
  POSTAL_CODE:     '',                  // TODO
  PHONE:           '',                  // TODO  E.164, e.g. +2125XXXXXXXX
  WHATSAPP_NUMBER: '',                  // TODO  digits only, e.g. 2126XXXXXXXX
  EMAIL:           '',                  // TODO
  INSTAGRAM_URL:   '',                  // TODO
  GOOGLE_MAPS_URL: '',                  // TODO
  GOOGLE_PLACE_ID: '',                  // TODO — needed for live reviews
  OPENING_HOURS:   [] as OpeningHours[],// TODO
  SITE_URL:        'https://luneaoptique.live',
} as const;
```

Components render a muted `à configurer` marker when a field is empty, so a
missing value is visible rather than silently blank.

---

## 7. CMS strategy

**Recommendation: Sanity.**

Why, for this specific business: the owner manages roughly 100–400 frames whose
content is 80% photography. Sanity's asset pipeline (upload once, hotspot/crop,
CDN-resized derivatives, automatic WebP/AVIF) removes the part a non-technical
owner actually fails at — producing correctly sized images. Contentful charges
for that tier; Supabase would make you build the image pipeline yourself;
Shopify brings a checkout you explicitly don't want.

Reconsider Supabase only if stock levels, appointment booking or customer
accounts arrive later — that's a database problem, not a content problem.

### Migration path

**Stage 0 — now.** `content/frames.ts` holds typed seed data. All reads go
through `lib/products/repository.ts`.

```ts
export const frames: FrameRepository = {
  list:      (q) => localSource.list(q),
  getBySlug: (s) => localSource.getBySlug(s),
  slugs:     ()  => localSource.slugs(),
  brands:    ()  => localSource.brands(),
};
```

**Stage 1 — go live with the CMS.** Model the `frame` document in Sanity Studio
(field names identical to the `Frame` interface), then swap `localSource` for
`sanitySource` in that one file. No component changes, no page changes.

**Stage 2 — production polish.** Add `next/image` `remotePatterns` for
`cdn.sanity.io`, ISR via `revalidateTag('frames')`, and a Sanity webhook hitting
`/api/revalidate`. The owner publishes a frame and it is live in seconds.

The whole point of the repository layer is that stage 1 is a one-file diff.

---

## 8. SEO strategy

**Metadata.** `metadataBase` + per-route `generateMetadata`. Canonicals via
`alternates.canonical`. Titles follow `{Modèle} — {Marque} | Lunéa Optique`.

**Open Graph — the priority.** `app/montures/[slug]/opengraph-image.tsx` uses
`next/og` to compose the frame photo with the model name, brand and the Lunéa
lockup at 1200×630. This is what makes a WhatsApp share convert, so it ships in
Step 7, not as a polish item.

**Structured data.**

- Every page: `Optician` (valid Schema.org subtype of `LocalBusiness`), with
  `name`, `address` as `PostalAddress`, `telephone`, `openingHoursSpecification`,
  `url`, `sameAs` (Instagram, Google Maps), `geo`.
- `/montures` → `ItemList` of frames.
- `/montures/[slug]` → `Product` + `Offer` (`availability`, `priceCurrency: MAD`,
  price omitted when `null`) + `BreadcrumbList`.
- Site-wide `WebSite` with `SearchAction` pointing at `/montures?search=`.
- **No** `AggregateRating` or `Review` markup until real Google reviews exist.
  Fabricated review markup is a manual-action risk and it's dishonest.
- The `Optician` node is emitted only once an address or phone is configured
  (`hasBusinessIdentity()`). A LocalBusiness payload carrying no NAP data
  signals an incomplete listing; omitting it beats publishing a hollow one.

**Local SEO, without stuffing.** Targets — *opticien Casablanca*, *lunettes de
vue Casablanca*, *montures Casablanca*, *opticien près de moi*. The city appears
where it is genuinely informative: the `/contact` H1, the address block, the
`LocalBusiness` payload, and page titles. It does not get sprinkled into body
copy. `/contact` is built as a proper local landing page — NAP, hours, map,
itinerary — because that's the page Google matches to proximity queries.

**Hygiene.** Semantic landmarks, one `<h1>` per page, `sitemap.ts` generated
from `repository.slugs()`, `robots.ts` allowing everything except `/api`,
`hreflang` deferred until Arabic actually ships.

---

## 9. Performance & accessibility targets

LCP < 2.0s on 4G mobile · CLS < 0.05.

**Measured, Stage 10** (gzipped, production build):

| | measured | note |
|---|---|---|
| First-load JS | **177–184 kB** | ~175 kB is the Next 16 + React 19 floor |
| Application JS | ~5–9 kB per route | five small client islands |
| CSS | 6 kB | whole site |
| Fonts on critical path | 74 kB | 2 files; the italic is deferred |
| LCP image (hero, 640px AVIF) | **6 kB** | from a 391 kB source |

The 90 kB JS budget written here in Stage 1 was **wrong for this stack** and is
corrected above. Next 16's App Router ships its client runtime on every route
regardless of how few client components exist, so ~175 kB is a floor, not a
choice. Application code is a rounding error beside it; the honest levers are
images, fonts and third-party embeds — where the wins actually were..

- `next/font/local` with variable woff2 files committed to `app/fonts/`
  (latin subset, `display: swap`). The roman faces are preloaded; the Playfair
  italic is declared separately with `preload: false` because it serves one
  below-the-fold line — 37 kB off the critical path. Chosen over `next/font/google`
  so builds never depend on a third-party service, and so one variable file
  replaces four static weights. `adjustFontFallback` limits layout shift.
- `next/image` everywhere, explicit `sizes`, `priority` on the hero only,
  AVIF/WebP, blur placeholders.
- Catalogue filtering runs on already-loaded data. No request per keystroke.
- Error boundaries: `app/error.tsx` (branded, with retry) and
  `app/global-error.tsx` (self-contained, no fonts or layout). Needed the
  moment a CMS fetch can fail.
- Security headers in `next.config.ts`: `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, HSTS. No CSP —
  it needs nonces for the inline JSON-LD and would break the Maps iframe;
  add it once verified against the real host.
- Heading hierarchy verified: no skipped levels on any of the 7 routes.
  Three visually hidden `h2` anchors carry the outline where no visible
  section title exists (services strip, catalogue results, footer).
- Keyboard-reachable everything, visible dual-tone `:focus-visible` ring,
  touch targets ≥ 44px, `aria-live` on the filtered result count, labelled form
  fields with inline error text. Contrast audited against every pair actually
  used: taupe on cream 5.8:1, muted cream on black 9.3:1, placeholder artwork
  ≥ 3:1 (WCAG 1.4.11). No token is used below its passing threshold.

---

## 10. Build order

| Step | Scope | Status |
|---|---|---|
| 1 | Architecture, design system, data model | ✅ this document |
| — | Visual direction prototype | ✅ published for review |
| 2 | Project scaffold, config, tokens, seed data | next |
| 3 | Global layout, Navbar, MobileMenu, Footer | next |
| 4 | Homepage | |
| 5 | Catalogue + facets + search | ✅ |
| 6 | Frame pages + gallery | ✅ |
| 7 | WhatsApp + share + dynamic OG | ✅ |
| 8 | À propos + Contact | ✅ |
| 9 | SEO, sitemap, structured data | ✅ |
| 10 | Mobile, performance, accessibility pass | ✅ |
| 11 | UI/UX review (brand · UX · engineering) | ✅ |
| 12 | Technical review | ✅ |

---

## 11. Open items blocking later steps

None block Steps 2–6. These are needed before Step 7 and Step 9:

1. `WHATSAPP_NUMBER` and `PHONE` — without them CTAs render disabled.
2. Real address, postal code, opening hours — for `Optician` structured data.
3. Instagram handle, Google Maps URL, Google Place ID.
4. Final domain, for `metadataBase` and canonicals.
5. Product photography, or the first batch of frames to seed the catalogue.
