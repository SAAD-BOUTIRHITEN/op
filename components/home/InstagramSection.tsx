import { IS_DEV } from "@/lib/env";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { instagramTiles } from "@/content/gallery";
import { isSet, site } from "@/config/site";

const tileSizes = "(min-width: 1024px) 23vw, 48vw";

export function InstagramSection() {
  const instagramConfigured = isSet(site.INSTAGRAM_URL);

  return (
    <section className="pb-section">
      <Container>
        <SectionHeading
          title="Lunéa au quotidien"
          lede="Nouveautés, coulisses et montures du jour."
          {...(instagramConfigured
            ? { link: { label: "Suivez-nous sur Instagram", href: site.INSTAGRAM_URL } }
            : {})}
        />
        <ul className="grid grid-cols-2 gap-1.5 lg:grid-cols-4 lg:gap-2.5">
          {instagramTiles.map((tile) => (
            <li key={tile.url} className="relative aspect-square overflow-hidden bg-creme-deep">
              <Image
                src={tile.url}
                alt={tile.alt}
                fill
                sizes={tileSizes}
                className="object-cover"
              />
            </li>
          ))}
        </ul>
        {IS_DEV && !instagramConfigured ? (
          <p className="micro mt-5 text-taupe">
            Flux Instagram à connecter — renseigner INSTAGRAM_URL dans config/site.ts
          </p>
        ) : null}
      </Container>
    </section>
  );
}
