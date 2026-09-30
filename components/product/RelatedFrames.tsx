import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductCard } from "@/components/shared/ProductCard";
import { categoryLabels, type Frame } from "@/lib/products/types";
import { listFrames } from "@/lib/products/repository";

const relatedSizes = "(min-width: 1024px) 23vw, 45vw";

export async function RelatedFrames({ frame }: { frame: Frame }) {
  // On demande une monture de plus que nécessaire : la courante sera retirée.
  const candidates = await listFrames({ category: frame.category, limit: 5 });
  const related = candidates.filter((item) => item.id !== frame.id).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-hairline py-section">
      <Container>
        <SectionHeading
          title="Dans la même collection"
          link={{
            label: `Toutes les ${categoryLabels[frame.category].toLowerCase()}`,
            href: `/montures/${frame.category}`,
          }}
        />
        <ul className="grid grid-cols-2 gap-x-3.5 gap-y-9 lg:grid-cols-4 lg:gap-x-6">
          {related.map((item) => (
            <li key={item.id}>
              <ProductCard frame={item} sizes={relatedSizes} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
