import Link from "next/link";
import {
  FACETS,
  facetHref,
  type CatalogFilters,
  type FacetKey,
} from "@/lib/products/catalog-params";
import { cn } from "@/lib/utils/cn";

/**
 * Onglets du catalogue — de vrais liens, pas des boutons JavaScript.
 *
 * Chaque onglet mène à sa propre page (/montures/lunettes-de-vue…). Il
 * fonctionne donc même si JavaScript ne s'exécute pas, et quand il
 * s'exécute, Next fait une navigation instantanée sans rechargement.
 * La marque et la recherche en cours suivent dans l'adresse.
 */
export function FacetBar({
  active,
  filters,
}: {
  active: FacetKey;
  filters: CatalogFilters;
}) {
  return (
    <nav
      aria-label="Filtrer par collection"
      className={
        // Fondu à droite sur mobile : il signale que la rangée défile.
        // pr-12 laisse le dernier onglet sortir du fondu en fin de course.
        "-mx-5 flex gap-7 overflow-x-auto pr-12 pl-5 [mask-image:linear-gradient(to_right,black_80%,transparent)] lg:mx-0 lg:gap-9 lg:px-0 lg:[mask-image:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      }
    >
      {FACETS.map((facet) => {
        const isActive = facet.key === active;
        return (
          <Link
            key={facet.key}
            href={facetHref(facet, filters)}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-end border-b-2 pb-2 text-ui whitespace-nowrap transition-colors duration-200",
              isActive
                ? "border-or-deep font-medium text-noir"
                : "border-transparent font-light text-taupe hover:text-noir",
            )}
          >
            {facet.label}
          </Link>
        );
      })}
    </nav>
  );
}
