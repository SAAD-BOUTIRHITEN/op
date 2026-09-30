"use client";

import Image from "next/image";
import { useState } from "react";
import type { Frame } from "@/lib/products/types";
import { cn } from "@/lib/utils/cn";

export function GalleryCarousel({ frame, sizes }: { frame: Frame; sizes: string }) {
  const [active, setActive] = useState(0);
  const images = frame.images;
  const current = images[active] ?? images[0];
  if (!current) return null;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt}
          fill
          sizes={sizes}
          priority
          placeholder={current.blurDataURL ? "blur" : "empty"}
          blurDataURL={current.blurDataURL}
          className="object-cover"
        />
      </div>

      <div role="group" aria-label="Photos du modèle" className="mt-3 grid grid-cols-5 gap-3">
        {images.map((image, index) => (
          <button
            key={image.url}
            type="button"
            aria-pressed={index === active}
            aria-label={`Afficher la photo ${index + 1} sur ${images.length}`}
            onClick={() => setActive(index)}
            className={cn(
              "relative aspect-square overflow-hidden border transition-colors duration-200",
              index === active ? "border-or" : "border-transparent hover:border-hairline",
            )}
          >
            <Image src={image.url} alt="" fill sizes="18vw" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
