import Link from "next/link";
import { collections } from "@/content/collections";
import { legalNav, primaryNav } from "@/config/navigation";
import { formattedAddress, isSet, site } from "@/config/site";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { ConfigValue } from "@/components/shared/ConfigValue";
import { SmartLink } from "@/components/shared/SmartLink";
import { WhatsAppIcon } from "@/components/shared/icons";
import { formatPhoneDisplay, telHref, whatsappHref } from "@/lib/whatsapp";

const columnTitle = "micro mb-4 text-creme-faint";
const itemClass =
  "inline-block py-1.5 text-body-sm font-light text-creme-muted transition-colors hover:text-or";

export function Footer() {
  const whatsapp = whatsappHref();

  return (
    <footer className="border-t border-hairline-inverse bg-noir pt-16 pb-8 text-creme">
      <Container>
        {/* Le pied de page est un repère à part : ce titre masqué évite que
            ses colonnes (h3) sautent depuis le h1 ou h2 de la page. */}
        <h2 className="sr-only">Informations {site.BUSINESS_NAME}</h2>
        <div className="grid gap-10 lg:grid-cols-[4fr_8fr] lg:gap-20">
          <div>
            <Logo tone="light" href={null} />
            <p className="mt-4 font-serif-italic text-[1rem] text-creme-muted italic">
              {site.TAGLINE}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-3">
            <div>
              <h3 className={columnTitle}>Navigation</h3>
              <ul className="space-y-0">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={itemClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={columnTitle}>Collections</h3>
              <ul className="space-y-0">
                {collections.map((collection) => (
                  <li key={collection.slug}>
                    <Link href={collection.href} className={itemClass}>
                      {collection.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={columnTitle}>Contact</h3>
              <ul className="space-y-0 text-body-sm font-light text-creme-muted">
                <li>
                  <ConfigValue
                    value={formattedAddress()}
                    fallback="Adresse à renseigner"
                    tone="light"
                  />
                </li>
                <li>
                  {telHref() ? (
                    <a href={telHref()!} className={itemClass}>
                      {formatPhoneDisplay(site.PHONE)}
                    </a>
                  ) : (
                    <ConfigValue value={null} fallback="Téléphone à renseigner" tone="light" />
                  )}
                </li>
                <li>
                  <SmartLink href={whatsapp ?? "/contact"} className={`inline-flex items-center gap-2 ${itemClass}`}>
                    <WhatsAppIcon className="size-3.5" />
                    WhatsApp
                  </SmartLink>
                </li>
                <li>
                  {isSet(site.INSTAGRAM_URL) ? (
                    <SmartLink href={site.INSTAGRAM_URL} className={itemClass}>
                      Instagram
                    </SmartLink>
                  ) : (
                    <ConfigValue value={null} fallback="Instagram à renseigner" tone="light" />
                  )}
                </li>
                <li>
                  {isSet(site.GOOGLE_MAPS_URL) ? (
                    <SmartLink href={site.GOOGLE_MAPS_URL} className={itemClass}>
                      Voir sur Google Maps
                    </SmartLink>
                  ) : (
                    <ConfigValue value={null} fallback="Lien Maps à renseigner" tone="light" />
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-13 flex flex-wrap justify-between gap-x-6 gap-y-3 border-t border-hairline-inverse pt-5 text-fine text-creme-faint">
          <span>
            © {new Date().getFullYear()} {site.BUSINESS_NAME}. Tous droits réservés.
          </span>
          <span className="flex flex-wrap gap-x-4">
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href} className="inline-block py-2 transition-colors hover:text-or">
                {item.label}
              </Link>
            ))}
          </span>
        </div>
      </Container>
    </footer>
  );
}
