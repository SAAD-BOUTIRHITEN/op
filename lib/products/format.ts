import { site } from "@/config/site";

/**
 * Affichage du prix. `null` signifie « prix sur demande » — cas courant chez
 * un opticien, où le tarif dépend des verres.
 */
export function formatPrice(price: number | null): string {
  if (price === null) return "Prix sur demande";
  return `${new Intl.NumberFormat("fr-MA").format(price)} ${site.CURRENCY}`;
}
