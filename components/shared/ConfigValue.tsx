import { isSet } from "@/config/site";
import { IS_DEV } from "@/lib/env";
import { cn } from "@/lib/utils/cn";

interface ConfigValueProps {
  value: string | null | undefined;
  /** Texte affiché tant que la valeur n'est pas renseignée. */
  fallback: string;
  tone?: "dark" | "light";
  className?: string;
}

/**
 * Affiche une information d'entreprise.
 *
 * Si elle manque, un marqueur explicite apparaît **en développement
 * uniquement** : le trou reste visible pour celui qui construit le site, et
 * le visiteur ne lit jamais « à renseigner ».
 */
export function ConfigValue({ value, fallback, tone = "dark", className }: ConfigValueProps) {
  if (isSet(value)) return <span className={className}>{value}</span>;
  if (!IS_DEV) return null;

  return (
    <span
      className={cn(
        "border-b border-dotted",
        tone === "light" ? "border-beige/50 text-beige" : "border-taupe/45 text-taupe",
        className,
      )}
      title="Valeur à renseigner dans config/site.ts"
    >
      {fallback}
    </span>
  );
}
