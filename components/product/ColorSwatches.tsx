import type { FrameColor } from "@/lib/products/types";

/**
 * Le nom accompagne toujours la pastille : la couleur seule ne doit pas être
 * le seul véhicule de l'information (WCAG 1.4.1).
 */
export function ColorSwatches({ colors }: { colors: FrameColor[] }) {
  if (colors.length === 0) return null;

  return (
    <div>
      <h2 className="micro text-taupe">Coloris disponibles</h2>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
        {colors.map((color) => (
          <li key={color.name} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="size-4 rounded-full border border-hairline"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-body-sm font-light">{color.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
