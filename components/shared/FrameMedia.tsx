import Image from "next/image";
import type { Frame } from "@/lib/products/types";
import { cn } from "@/lib/utils/cn";
import { MediaPlaceholder } from "./MediaPlaceholder";

type Ratio = "3/4" | "4/3" | "1/1" | "4/5";

const ratios: Record<Ratio, string> = {
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "4/5": "aspect-[4/5]",
};

interface FrameMediaProps {
  frame: Frame;
  /** Attribut `sizes` de next/image. Obligatoire : il conditionne le poids téléchargé. */
  sizes: string;
  ratio?: Ratio;
  priority?: boolean;
  className?: string;
  tone?: "light" | "dark";
}

export function FrameMedia({
  frame,
  sizes,
  ratio = "4/3",
  priority = false,
  className,
  tone = "light",
}: FrameMediaProps) {
  const image = frame.images[0];

  return (
    <div className={cn("relative overflow-hidden", ratios[ratio], className)}>
      {image ? (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
          className="object-cover transition-transform duration-500 ease-editorial group-hover:scale-105"
        />
      ) : (
        <MediaPlaceholder
          seed={frame.id}
          category={frame.category}
          tone={tone}
          interactive
        />
      )}
    </div>
  );
}
