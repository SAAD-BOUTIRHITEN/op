import { hoursLabel } from "@/lib/opening-hours";
import { SmartLink } from "@/components/shared/SmartLink";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { ConfigValue } from "@/components/shared/ConfigValue";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { ContactForm } from "@/components/contact/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { MapPinIcon } from "@/components/shared/icons";
import { formattedAddress, isSet, site } from "@/config/site";
import { isContactTransportConfigured } from "@/lib/contact/transport";
import { formatPhoneDisplay, mailHref, telHref } from "@/lib/whatsapp";
import { reviewLinkHref } from "@/lib/reviews";
import { IS_DEV } from "@/lib/env";
import { breadcrumbJsonLd, hasBusinessIdentity } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

const description = `Adresse, horaires, téléphone et WhatsApp de ${site.BUSINESS_NAME}, opticien à ${site.CITY}. Venez essayer nos montures en boutique.`;

export const metadata: Metadata = pageMetadata({
  title: `Contact — Opticien à ${site.CITY}`,
  description,
  path: "/contact",
  ogTitle: `Contact | ${site.BUSINESS_NAME}`,
  /**
   * Cette page n'existe que pour porter l'adresse, le téléphone et les
   * horaires. Tant qu'ils ne sont pas renseignés, l'indexer enverrait à Google
   * une fiche locale vide — un mauvais signal, difficile à rattraper.
   */
  noIndex: !hasBusinessIdentity(),
});

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-hairline py-4 last:border-b">
      <dt className="micro text-taupe">{label}</dt>
      <dd className="mt-1.5 text-body font-light">{children}</dd>
    </div>
  );
}

export default function ContactPage() {
  const address = formattedAddress();
  const phone = telHref();
  const email = mailHref();
  const formEnabled = isContactTransportConfigured();
  const writeReview = reviewLinkHref();

  return (
    <section className="py-section">
      <Container>
        <h1 className="font-serif text-title">
          Contacter {site.BUSINESS_NAME} à {site.CITY}
        </h1>
        <p className="measure mt-4 text-body font-light text-taupe">
          Le plus simple reste de passer en boutique : l&rsquo;essayage vaut tous les
          conseils à distance. Sinon, écrivez-nous, nous répondons vite.
        </p>

        {/* Conversion principale sur mobile : trois cibles larges, avant tout le reste. */}
        <div className="mt-9 grid gap-3 sm:grid-cols-3">
          <WhatsAppButton
            label="WhatsApp"
            variant="dark"
            className="w-full"
            fullWidthOnMobile={false}
          />
          <Button
            href={phone ?? "#coordonnees"}
            variant="line"
            className="w-full"
            fullWidthOnMobile={false}
          >
            Appeler
          </Button>
          <Button
            href={isSet(site.GOOGLE_MAPS_URL) ? site.GOOGLE_MAPS_URL : "#coordonnees"}
            variant="line"
            className="w-full"
            fullWidthOnMobile={false}
          >
            Itinéraire
          </Button>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div id="coordonnees" className="scroll-mt-28">
            <h2 className="font-serif text-[1.6rem]">La boutique</h2>
            <dl className="mt-6">
              <Row label="Adresse">
                <ConfigValue value={address} fallback="Adresse à renseigner" />
              </Row>
              <Row label="Téléphone">
                {phone ? (
                <a href={phone} className="border-b border-hairline pb-0.5 hover:border-or">
                  {formatPhoneDisplay(site.PHONE)}
                </a>
              ) : (
                <ConfigValue value={null} fallback="Téléphone à renseigner" />
              )}
              </Row>
              <Row label="E-mail">
                {email ? (
                  <a href={email} className="inline-block border-b border-hairline py-1 hover:border-or">
                    {site.EMAIL}
                  </a>
                ) : (
                  <ConfigValue value={null} fallback="E-mail à renseigner" />
                )}
              </Row>
              <Row label="Instagram">
                {isSet(site.INSTAGRAM_URL) ? (
                  <a
                    href={site.INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-hairline pb-0.5 hover:border-or"
                  >
                    Voir notre compte
                  </a>
                ) : (
                  <ConfigValue value={null} fallback="Compte Instagram à renseigner" />
                )}
              </Row>
              {writeReview ? (
                <Row label="Avis">
                  <SmartLink
                    href={writeReview}
                    className="border-b border-hairline pb-0.5 hover:border-or"
                  >
                    Laisser un avis sur Google
                  </SmartLink>
                </Row>
              ) : null}
              <Row label="Horaires">
                {site.OPENING_HOURS.length > 0 ? (
                  <ul className="space-y-1">
                    {site.OPENING_HOURS.map((slot) => (
                      <li key={slot.label} className="flex justify-between gap-6">
                        <span>{slot.label}</span>
                        <span>{hoursLabel(slot)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ConfigValue value={null} fallback="Horaires à renseigner" />
                )}
              </Row>
            </dl>

            <div className="mt-8 aspect-[4/3] w-full overflow-hidden border border-hairline">
              {isSet(site.GOOGLE_MAPS_EMBED_URL) ? (
                <iframe
                  src={site.GOOGLE_MAPS_EMBED_URL}
                  title={`Localisation de ${site.BUSINESS_NAME}`}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
                  className="size-full"
                />
              ) : isSet(site.GOOGLE_MAPS_URL) ? (
                /* Voir le commentaire de LocationSection : lien utile plutôt
                   que visuel décoratif, tant qu'aucune URL d'intégration
                   n'est fournie. */
                <SmartLink
                  href={site.GOOGLE_MAPS_URL}
                  className="grid size-full place-items-center gap-3 bg-creme-deep transition-colors duration-200 hover:bg-beige-deep"
                >
                  <MapPinIcon className="size-9 text-taupe" />
                  <span className="text-body-sm font-light text-taupe">
                    Voir la boutique sur Google Maps
                  </span>
                </SmartLink>
              ) : null}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-[1.6rem]">Nous écrire</h2>
            {formEnabled ? (
              <div className="mt-6">
                <ContactForm />
              </div>
            ) : (
              /*
                Sans transport configuré, le visiteur reçoit les canaux qui
                fonctionnent — pas une consigne technique. La note de
                configuration n'apparaît qu'en développement.
              */
              <div className="mt-6">
                <p className="measure text-body font-light text-taupe">
                  Le plus rapide est de nous écrire sur WhatsApp : nous répondons dans la
                  journée. Vous pouvez aussi appeler la boutique ou nous envoyer un e-mail.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <WhatsAppButton
                    label="Écrire sur WhatsApp"
                    variant="dark"
                    fullWidthOnMobile={false}
                    className="w-full sm:w-auto"
                  />
                  {phone ? (
                    <Button
                      href={phone}
                      variant="line"
                      fullWidthOnMobile={false}
                      className="w-full sm:w-auto"
                    >
                      Appeler
                    </Button>
                  ) : null}
                  {email ? (
                    <Button
                      href={email}
                      variant="line"
                      fullWidthOnMobile={false}
                      className="w-full sm:w-auto"
                    >
                      Envoyer un e-mail
                    </Button>
                  ) : null}
                </div>
                {IS_DEV ? (
                  <p className="micro mt-6 text-taupe">
                    Développement : formulaire masqué, CONTACT_WEBHOOK_URL non défini.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </Container>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </section>
  );
}
