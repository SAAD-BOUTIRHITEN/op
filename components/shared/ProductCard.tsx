import Link from "next/link";
import type { Frame } from "@/lib/products/types";
import { formatPrice } from "@/lib/products/format";
import { FrameMedia } from "./FrameMedia";

/** Grille de la page d'accueil : 2 colonnes, puis 4 à partir de `lg`. */
const defaultSizes = "(min-width: 1024px) 23vw, 45vw";

function badge(frame: Frame): string | null {
  if (frame.newArrival) return "Nouveauté";
  if (frame.coupDeCoeur) return "Coup de cœur";
  return null;
}

interface ProductCardProps {
  frame: Frame;
  priority?: boolean;
  /** À fournir quand la grille diffère de celle de l'accueil. */
  sizes?: string;
}

export function ProductCard({ frame, priority = false, sizes = defaultSizes }: ProductCardProps) {
  const tag = badge(frame);

  return (
    <Link href={`/montures/${frame.slug}`} className="group flex flex-col">
      <div className="relative">
        {tag ? (
          <span className="absolute top-2.5 left-2.5 z-10 bg-creme px-2.5 py-1.5 text-nano font-medium tracking-[0.16em] uppercase text-noir">
            {tag}
          </span>
        ) : null}
        <FrameMedia frame={frame} sizes={sizes} ratio="4/3" priority={priority} />
      </div>

      <div className="pt-3.5">
        <span className="micro text-taupe">{frame.brand}</span>
        <h3 className="mt-1.5 font-serif text-[1.2rem] leading-tight lg:text-frame">
          {frame.name}
        </h3>

        <div className="mt-2 flex items-baseline justify-between gap-2.5 border-t border-hairline pt-2.5">
          <span className="text-fine tracking-[0.06em] text-taupe">
            Réf. {frame.reference}
          </span>
          <span className="font-serif text-body">{formatPrice(frame.price)}</span>
        </div>

        <span className="mt-3 inline-block self-start border-b border-hairline pb-1.5 text-fine font-medium tracking-[0.05em] transition-colors duration-200 group-hover:border-or">
          Voir le modèle →
        </span>
      </div>
    </Link>
  );
}
