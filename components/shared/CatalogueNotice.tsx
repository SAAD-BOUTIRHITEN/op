import { cn } from "@/lib/utils/cn";

/**
 * Affiché tant que `CATALOGUE_NEEDS_REVIEW` vaut `true`. Le même drapeau met
 * les pages concernées en noindex et supprime les données structurées produit.
 *
 * Les modèles sont réels ; c'est leur présence en boutique, leur prix et leurs
 * photos qui restent à confirmer. Le message le dit tel quel.
 */
export function CatalogueNotice({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={cn(
        "border-l-2 border-or bg-creme-deep font-light text-taupe",
        compact ? "px-4 py-3 text-ui" : "px-5 py-4 text-body-sm",
      )}
    >
      {compact ? (
        <>
          Modèle de référence : disponibilité, prix et photo restent à confirmer par la
          boutique.
        </>
      ) : (
        <>
          Catalogue de référence. Ces modèles existent bien — marques, références et
          coloris sont exacts — mais leur présence en boutique, leurs prix et leurs
          photographies restent à confirmer. Les pages sont en <em>noindex</em> tant que
          c&rsquo;est le cas.
        </>
      )}
    </p>
  );
}
