import type { ImageAsset } from "@/lib/media";

export interface Collection {
  slug: string;
  title: string;
  description: string;
  href: string;
  image: ImageAsset;
}

export const collections: readonly Collection[] = [
  {
    slug: "lunettes-de-vue",
    title: "Lunettes de vue",
    description: "Formes classiques et contemporaines, en métal comme en acétate.",
    href: "/montures/lunettes-de-vue",
    image: {
      url: "/images/collections/vue.jpg",
      alt: "Femme portant des lunettes de vue en acétate cristal",
      width: 1200,
      height: 1600,
    },
  },
  {
    slug: "lunettes-de-soleil",
    title: "Lunettes de soleil",
    description: "Protection solaire et allure, toute l'année.",
    href: "/montures/lunettes-de-soleil",
    image: {
      url: "/images/collections/soleil.jpg",
      alt: "Homme portant des lunettes de soleil en acétate écaille devant la boutique",
      width: 1200,
      height: 1600,
    },
  },
  {
    slug: "nouveautes",
    title: "Nouveautés",
    description: "Les derniers modèles arrivés en boutique.",
    href: "/montures/nouveautes",
    image: {
      url: "/images/collections/nouveautes.jpg",
      alt: "Trois montures optiques posées sur une nappe de lin beige",
      width: 1200,
      height: 1600,
    },
  },
  {
    slug: "coups-de-coeur",
    title: "Coups de cœur",
    description: "Les modèles que nous défendons le plus volontiers.",
    href: "/montures/coups-de-coeur",
    image: {
      url: "/images/collections/coups-de-coeur.jpg",
      alt: "Monture en acétate miel posée sur une plaque de travertin",
      width: 1200,
      height: 1600,
    },
  },
] as const;
