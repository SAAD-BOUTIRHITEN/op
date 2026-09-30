import { Button } from "@/components/shared/Button";
import { Container } from "@/components/shared/Container";
import Image from "next/image";
import { site } from "@/config/site";
import { boutiqueImage } from "@/content/media";

export function BrandStory() {
  return (
    <section className="bg-creme-deep py-section">
      <Container className="grid gap-9 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-20">
        <div className="lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden bg-creme-deep">
            <Image
              src={boutiqueImage.url}
              alt={boutiqueImage.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="lg:order-2">
          <h2 className="max-w-[16ch] font-serif text-title">
            Une boutique où l&rsquo;on prend le temps de bien voir
          </h2>
          <p className="measure mt-5 text-body font-light text-taupe">
            Chez {site.BUSINESS_NAME}, chaque monture est choisie pour la façon dont elle
            s&rsquo;accorde à un visage, à une lumière, à une manière d&rsquo;être. Nous prenons
            le temps d&rsquo;écouter, de mesurer, d&rsquo;essayer.
          </p>
          <p className="measure mt-4 text-body font-light text-taupe">
            Le résultat : des lunettes que l&rsquo;on porte avec plaisir, et une vision
            confortable du matin au soir.
          </p>
          <div className="mt-8">
            <Button href="/a-propos" variant="line">
              En savoir plus
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
