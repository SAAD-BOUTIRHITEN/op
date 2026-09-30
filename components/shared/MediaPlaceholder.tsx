import type { FrameCategory } from "@/lib/products/types";
import { cn } from "@/lib/utils/cn";
import { FrameArt } from "./FrameArt";

interface MediaPlaceholderProps {
  seed: string;
  category: FrameCategory;
  tone?: "light" | "soft" | "dark";
  /** Applique l'effet de zoom au survol d'un parent portant `group`. */
  interactive?: boolean;
  /** Masque la mention « photo à intégrer » (grilles denses où elle ferait du bruit). */
  note?: boolean;
  className?: string;
}

/**
 * Opacités calibrées sur un contraste non textuel ≥ 3:1 (WCAG 1.4.11) :
 * taupe/55 sur crème ne donnait que 2,2:1.
 */
const tones = {
  light: "bg-creme-deep text-taupe/80",
  soft: "bg-beige-deep text-taupe/80",
  dark: "bg-noir-soft text-beige/60",
} as const;

const noteTones = {
  light: "text-taupe",
  soft: "text-taupe",
  dark: "text-creme-muted",
} as const;

/**
 * Visuel de remplacement affiché tant qu'aucune photographie n'est fournie.
 * Occupe exactement le format de l'image finale, pour qu'aucun décalage de
 * mise en page n'apparaisse au moment du remplacement.
 */
export function MediaPlaceholder({
  seed,
  category,
  tone = "light",
  interactive = false,
  note = true,
  className,
}: MediaPlaceholderProps) {
  return (
    <div className={cn("absolute inset-0 grid place-items-center", tones[tone], className)}>
      <FrameArt
        seed={seed}
        category={category}
        className={cn(
          "w-[70%]",
          interactive && "transition-transform duration-500 ease-editorial group-hover:scale-105",
        )}
      />
      {note ? (
        <span
          className={cn(
            "absolute bottom-2 left-2.5 text-nano tracking-[0.16em] uppercase",
            noteTones[tone],
          )}
        >
          photo à intégrer
        </span>
      ) : null}
    </div>
  );
}
