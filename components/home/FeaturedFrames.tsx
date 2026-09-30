import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductCard } from "@/components/shared/ProductCard";
import { listFrames } from "@/lib/products/repository";

export async function FeaturedFrames() {
  const frames = await listFrames({ featuredOnly: true, limit: 4 });
  if (frames.length === 0) return null;

  return (
    <section className="pb-section">
      <Container>
        <SectionHeading
          title="Sélection du moment"
          lede="Quelques modèles à découvrir en boutique."
          link={{ label: "Tout le catalogue", href: "/montures" }}
        />
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
          {frames.map((frame) => (
            <ProductCard key={frame.id} frame={frame} />
          ))}
        </div>
      </Container>
    </section>
  );
}
