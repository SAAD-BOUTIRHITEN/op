import type { ImageAsset } from "@/lib/media";

/**
 * Visuels éditoriaux du site. Les photographies de montures vivent dans
 * `content/frames.ts` : ce sont des données produit, pas de la mise en scène.
 */

export const heroImage: ImageAsset = {
  url: "/images/hero.jpg",
  alt: "Femme portant des lunettes de vue rondes en métal doré, près de la vitrine de la boutique",
  width: 2400,
  height: 1600,
  blurDataURL:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDBidQyFSN3lsc+hwcfrXb6azNa7pG3OTlm9T60UVPUrof/2Q==",
};

export const boutiqueImage: ImageAsset = {
  url: "/images/boutique.jpg",
  alt: "Présentoir mural en noyer garni de montures, éclairé par un bandeau lumineux",
  width: 1200,
  height: 1500,
};

export const atelierImage: ImageAsset = {
  url: "/images/atelier.jpg",
  alt: "Opticien ajustant une monture en métal doré serrée dans un étau d'atelier",
  width: 1600,
  height: 1200,
};

export interface HeroVideoSource {
  /** H.264 — lu partout, y compris sur iPhone. Obligatoire. */
  mp4: string;
  /** VP9 — plus léger, servi en priorité aux navigateurs qui le lisent. */
  webm?: string;
}

export interface HeroVideo {
  /** 16:9, 1920 px de large au maximum. */
  desktop: HeroVideoSource;
  /** 9:16, 720 px de large au maximum. */
  mobile: HeroVideoSource;
}

/**
 * Vidéo du hero. `null` tant qu'aucune vidéo n'est fournie : le hero reste
 * la photo, sans aucun changement.
 *
 * La photo `heroImage` reste de toute façon affichée en premier : c'est elle
 * l'élément LCP. La vidéo n'arrive qu'après le chargement de la page et se
 * superpose en fondu une fois qu'elle joue réellement.
 */
export const heroVideo: HeroVideo | null = null;
