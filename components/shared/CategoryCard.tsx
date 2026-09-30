import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/content/collections";

const cardSizes = "(min-width: 1024px) 23vw, 45vw";

export function CategoryCard({ collection }: { collection: Collection }) {
  return (
    <Link href={collection.href} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-creme-deep">
        <Image
          src={collection.image.url}
          alt={collection.image.alt}
          fill
          sizes={cardSizes}
          className="object-cover transition-transform duration-500 ease-editorial group-hover:scale-105"
        />
      </div>
      <h3 className="mt-3.5 font-serif text-[1.2rem] lg:text-[1.35rem]">{collection.title}</h3>
      <span className="text-fine tracking-[0.04em] text-taupe">Voir la collection →</span>
    </Link>
  );
}
