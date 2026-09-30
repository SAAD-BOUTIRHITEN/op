import type { Frame } from "@/lib/products/types";
import { ProductCard } from "@/components/shared/ProductCard";

/** Grille du catalogue : 2 colonnes, 3 à partir de `sm`, 4 à partir de `lg`. */
const catalogSizes = "(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 45vw";

export function ProductGrid({ frames }: { frames: Frame[] }) {
  return (
    <>
      {/* Le catalogue n'a pas de titre de section visible au-dessus de la
          grille : sans celui-ci, la page passait de h1 à h3. */}
      <h2 className="sr-only">Résultats</h2>
      <ul className="grid grid-cols-2 gap-x-3.5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
      {frames.map((frame, index) => (
        <li key={frame.id}>
          {/* Mobile-first : la première rangée compte deux vignettes. */}
          <ProductCard frame={frame} sizes={catalogSizes} priority={index < 2} />
        </li>
      ))}
      </ul>
    </>
  );
}
