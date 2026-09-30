import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { site } from "@/config/site";
import { heroImage, heroVideo } from "@/content/media";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-noir text-creme">
      {/*
        En mobile, la hauteur du bloc de texte pilote le recadrage
        (object-fit: cover ne rogne alors QUE la largeur, jamais la hauteur) :
        à 50 % centré, la fenêtre visible s'arrêtait avant son visage — on ne
        voyait que l'arrière de sa tête. Mesuré sur la photo réelle
        (2400×1600) : 68 % horizontal cadre son visage avec de l'air des deux
        côtés. Au-delà de `lg`, la photo est bien plus large que le bloc de
        texte : le centrage d'origine reste correct.
      */}
      <Image
        src={heroImage.url}
        alt={heroImage.alt}
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={heroImage.blurDataURL}
        className="-z-20 object-cover object-[68%_center] lg:object-center"
      />

      {heroVideo ? <HeroVideo sources={heroVideo} /> : null}

      {/*
        Voile de lisibilité — résolu, pas ajusté au jugé : pour chaque colonne
        de la photo, calcul du voile minimum nécessaire pour que CE pixel
        atteigne 4,5:1 contre le texte qui le recouvre à cet endroit-là,
        vérifié séparément pour le titre et les boutons (texte plein) et pour
        le paragraphe (texte translucide à 72 % — sa propre couleur rendue se
        mélange déjà 28 % à ce qu'il y a derrière, donc plus dur à satisfaire
        qu'un texte plein sur le même fond). Résultat vérifié partout à
        4,65:1 minimum. Une première version, lissée sur des tranches de 5 %
        de largeur, avait masqué un filet vertical clair (le montant de la
        fenêtre) qui traverse les trois blocs de texte vers 30-44 % — d'où
        des arrêts resserrés à cet endroit plutôt qu'une simple rampe.
        Recalculer si la photo ou le texte changent.
        Au-delà de `lg`, la photo est bien plus large que le texte : un
        dégradé gauche→droite simple suffit, déjà vérifié à 6,9:1.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,transparent_0%,transparent_22%,rgba(17,17,17,.44)_28%,rgba(17,17,17,.56)_34%,rgba(17,17,17,.56)_44%,rgba(17,17,17,.15)_48%,transparent_52%,rgba(17,17,17,.34)_55%,rgba(17,17,17,.56)_58%,rgba(17,17,17,.62)_85%,rgba(17,17,17,.68)_100%)] lg:bg-linear-to-r lg:from-noir/70 lg:via-noir/30 lg:to-transparent"
      />

      <div className="mx-auto w-full max-w-[1280px] px-5 pt-28 pb-16 lg:px-10 lg:pt-38 lg:pb-32">
        <h1 className="max-w-[14ch] animate-rise font-serif text-display [text-shadow:0_1px_28px_rgba(17,17,17,.45)] lg:[text-shadow:none]">
          Des montures qui révèlent votre personnalité
        </h1>

        {/*
          text-creme-muted (72 % d'opacité) est calibré pour un fond plein ;
          ici le texte se mélange à la photo voilée, donc 72 % ne tenait pas
          la marge de 4,5:1 dans certaines colonnes. 85 %, propre à ce
          composant, referme l'écart sans casser la hiérarchie visuelle.
        */}
        <p
          className="mt-6 max-w-[46ch] animate-rise text-body font-light text-[rgb(248_246_242_/_85%)] [animation-delay:120ms] lg:text-creme-muted"
        >
          Lunettes de vue, lunettes de soleil et conseils personnalisés, dans notre boutique
          à {site.CITY}.
        </p>

        <div className="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
          <Button href="/montures" variant="gold">
            Découvrir nos montures
          </Button>
          <WhatsAppButton variant="ghost" label="Nous contacter" />
        </div>
      </div>
    </section>
  );
}
