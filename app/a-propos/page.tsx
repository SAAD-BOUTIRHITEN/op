import { IS_DEV } from "@/lib/env";
import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import Image from "next/image";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import { atelierImage } from "@/content/media";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

const description = `${site.BUSINESS_NAME}, opticien à ${site.CITY} : une sélection de montures choisie avec soin et des conseils d'essayage en boutique.`;

export const metadata: Metadata = pageMetadata({
  title: "À propos",
  description,
  path: "/a-propos",
});

/**
 * Aucune histoire inventée ici : ni date de création, ni nombre d'années
 * d'expérience, ni fondateur. Le texte décrit une manière de travailler, ce
 * qui reste vrai quelle que soit l'histoire réelle de la boutique, et se
 * remplace bloc par bloc.
 */
const approach = [
  {
    title: "Choisir plutôt qu'accumuler",
    body: "Nous préférons une sélection resserrée à un mur de vitrines. Chaque monture entre en boutique parce qu'elle apporte quelque chose : une forme, une matière, un équilibre.",
  },
  {
    title: "Mesurer avant de conseiller",
    body: "Le confort d'un verre se joue au millimètre : centrage, hauteur de montage, galbe, écart pupillaire. C'est la partie invisible du métier, et c'est celle qui fait la différence à l'usage.",
  },
  {
    title: "Rester disponible après",
    body: "Une monture bouge, se desserre, se raye. Un réglage, un resserrage ou un nettoyage ne se facture pas : passez quand vous voulez.",
  },
];

export default function AProposPage() {
  return (
    <>
      <section className="py-section">
        <Container>
          <h1 className="max-w-[18ch] font-serif text-title">
            Une manière de travailler, avant d&rsquo;être une boutique
          </h1>
          <p className="measure mt-5 text-[1rem] font-light text-taupe">
            {site.BUSINESS_NAME} est un opticien à {site.CITY}. Nous vendons des lunettes,
            mais surtout nous prenons le temps de trouver celles qui vous vont — et de les
            régler correctement.
          </p>

          <div className="mt-12 grid gap-10 lg:grid-cols-[6fr_6fr] lg:items-center lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden bg-creme-deep">
              <Image
                src={atelierImage.url}
                alt={atelierImage.alt}
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-[1.7rem] leading-tight lg:text-[2rem]">
                Ce que vous trouverez en venant
              </h2>
              <p className="measure mt-5 text-body font-light text-taupe">
                Un espace où l&rsquo;on peut essayer sans être pressé, comparer deux formes
                côte à côte, revenir le lendemain avec un avis extérieur. L&rsquo;achat de
                lunettes se vit tous les jours pendant des années : il mérite plus que
                quelques minutes.
              </p>
              <p className="measure mt-4 text-body font-light text-taupe">
                Nous travaillons aussi bien les lunettes de vue que les solaires, en verres
                correcteurs comme en verres neutres.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-hairline bg-creme-deep py-section">
        <Container>
          <h2 className="font-serif text-title">Notre approche</h2>
          <ul className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-14">
            {approach.map((item) => (
              <li key={item.title}>
                <span aria-hidden="true" className="block h-px w-10 bg-or" />
                <h3 className="mt-5 font-serif text-[1.35rem] leading-tight">{item.title}</h3>
                <p className="mt-3 text-body font-light text-taupe">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-section">
        <Container>
          <h2 className="max-w-[20ch] font-serif text-[1.8rem] leading-tight lg:text-[2.2rem]">
            Le plus simple, c&rsquo;est de passer essayer
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/montures" variant="dark">
              Voir les montures
            </Button>
            <Button href="/contact" variant="line">
              Adresse et horaires
            </Button>
            <WhatsAppButton label="Poser une question" variant="line" />
          </div>

          {IS_DEV ? (
          <p className="micro mt-12 text-taupe">
            Texte de présentation à remplacer par le contenu réel de la boutique — aucune
            date, aucun historique et aucun chiffre n&rsquo;ont été inventés.
          </p>
          ) : null}
        </Container>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "À propos", path: "/a-propos" },
        ])}
      />
    </>
  );
}
