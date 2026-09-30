import Image from "next/image";
import type { Frame } from "@/lib/products/types";
import { MediaPlaceholder } from "@/components/shared/MediaPlaceholder";
import { GalleryCarousel } from "./GalleryCarousel";

const mainSizes = "(min-width: 1024px) 58vw, 100vw";

/**
 * Composant serveur. Il ne monte l'îlot client que lorsqu'il y a réellement
 * plusieurs photos à parcourir : une monture à une seule image (ou sans image)
 * n'a rien d'interactif et n'a donc aucune raison d'être hydratée.
 */
export function ProductGallery({ frame }: { frame: Frame }) {
  if (frame.images.length > 1) {
    return <GalleryCarousel frame={frame} sizes={mainSizes} />;
  }

  const image = frame.images[0];

  return (
    <div className="relative aspect-[4/3] overflow-hidden">
      {image ? (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={mainSizes}
          priority
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
          className="object-cover"
        />
      ) : (
        <MediaPlaceholder seed={frame.id} category={frame.category} />
      )}
    </div>
  );
}
