import { hoursLabel } from "@/lib/opening-hours";
import { SmartLink } from "@/components/shared/SmartLink";
import { MapPinIcon } from "@/components/shared/icons";
import type { ReactNode } from "react";
import { Button } from "@/components/shared/Button";
import { Container } from "@/components/shared/Container";
import { ConfigValue } from "@/components/shared/ConfigValue";
import { formattedAddress, isSet, site } from "@/config/site";
import { formatPhoneDisplay, telHref } from "@/lib/whatsapp";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-hairline-inverse py-5 last:border-b">
      <span className="micro text-creme-faint">{label}</span>
      <div className="mt-1.5 text-body font-light text-creme-muted">{children}</div>
    </div>
  );
}

export function LocationSection() {
  const address = formattedAddress();
  const phone = telHref();

  return (
    <section id="contact" className="bg-noir py-section text-creme">
      <Container className="grid gap-11 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <h2 className="max-w-[14ch] font-serif text-title">Passez nous voir en boutique</h2>
          <p className="measure mt-4 text-body font-light text-creme-muted">
            L&rsquo;essayage reste le meilleur conseil. Nous vous accueillons sans rendez-vous.
          </p>

          <div className="mt-9">
            <Row label="Adresse">
              <ConfigValue value={address} fallback="Adresse à renseigner" tone="light" />
            </Row>
            <Row label="Téléphone">
              {phone ? (
                <a href={phone} className="border-b border-hairline-inverse pb-0.5 hover:border-or">
                  {formatPhoneDisplay(site.PHONE)}
                </a>
              ) : (
                <ConfigValue value={null} fallback="Téléphone à renseigner" tone="light" />
              )}
            </Row>
            <Row label="Horaires">
              {site.OPENING_HOURS.length > 0 ? (
                <ul className="space-y-1">
                  {site.OPENING_HOURS.map((slot) => (
                    <li key={slot.label} className="flex justify-between gap-5">
                      <span>{slot.label}</span>
                      <span>{hoursLabel(slot)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ConfigValue value={null} fallback="Horaires à renseigner" tone="light" />
              )}
            </Row>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              href={isSet(site.GOOGLE_MAPS_URL) ? site.GOOGLE_MAPS_URL : "/contact"}
              variant="gold"
            >
              Itinéraire Google Maps
            </Button>
            <Button href={phone ?? "/contact"} variant="ghost">
              Appeler la boutique
            </Button>
          </div>
        </div>

        <div className="relative min-h-65 overflow-hidden border border-hairline-inverse bg-noir-soft">
          {/*
            Volontairement un lien et non un iframe : un embed Google Maps
            tire plusieurs centaines de Ko de JavaScript tiers, et l'accueil
            n'en a pas l'usage — le bouton « Itinéraire » est juste au-dessus.
            La carte interactive est sur /contact, là où le visiteur la cherche.
          */}
          {isSet(site.GOOGLE_MAPS_URL) ? (
            <SmartLink
              href={site.GOOGLE_MAPS_URL}
              className="grid aspect-[4/3] place-items-center gap-4 transition-colors duration-200 hover:bg-noir"
            >
              <MapPinIcon className="size-9 text-beige" />
              <span className="text-body-sm font-light text-creme-muted">
                Voir la boutique sur Google Maps
              </span>
            </SmartLink>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
