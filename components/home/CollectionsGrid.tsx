import { collections } from "@/content/collections";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CategoryCard } from "@/components/shared/CategoryCard";

export function CollectionsGrid() {
  return (
    <section className="py-section">
      <Container>
        <SectionHeading
          title="Nos collections"
          lede="Lunettes de vue et de soleil, sélectionnées une par une."
          link={{ label: "Voir toutes les montures", href: "/montures" }}
        />
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4 lg:gap-6">
          {collections.map((collection) => (
            <CategoryCard key={collection.slug} collection={collection} />
          ))}
        </div>
      </Container>
    </section>
  );
}
