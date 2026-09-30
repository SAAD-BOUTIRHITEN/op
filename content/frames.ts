/**
 * Sélection Lunéa — catalogue de la boutique.
 *
 * Ces montures sont proposées **sur commande** : le visuel présente le modèle,
 * la commande est passée après échange avec le client. D'où `availability:
 * "sur-commande"` et `price: null` (« Prix sur demande », le tarif dépendant
 * des verres).
 *
 * Aucune marque tierce n'est revendiquée : ce sont les modèles de la maison,
 * sous les références LO-01 à LO-14.
 */

import type { Frame, FrameColor } from "@/lib/products/types";

const DORE: FrameColor = { name: "Doré", hex: "#C9A227" };
const ECAILLE: FrameColor = { name: "Écaille", hex: "#A9622F" };
const HAVANE_FONCE: FrameColor = { name: "Havane foncé", hex: "#5A3520" };
const CRISTAL_ROSE: FrameColor = { name: "Cristal rosé", hex: "#E3B7AE" };
const NOIR_MAT: FrameColor = { name: "Noir mat", hex: "#1C1C1C" };
const NOIR_BRILLANT: FrameColor = { name: "Noir brillant", hex: "#111111" };
const ARGENT: FrameColor = { name: "Argent brossé", hex: "#B9BCC0" };
const BLEU_NUIT: FrameColor = { name: "Bleu nuit", hex: "#2A3550" };
const GUNMETAL: FrameColor = { name: "Gunmetal", hex: "#4A4E54" };
const MIEL: FrameColor = { name: "Miel", hex: "#C8802E" };
const TAUPE: FrameColor = { name: "Taupe", hex: "#9C8B7C" };

interface Seed {
  slug: string;
  name: string;
  /** Marque réelle du fabricant. Par défaut, la sélection de la maison. */
  brand?: string;
  reference: string;
  category: Frame["category"];
  description: string;
  colors: FrameColor[];
  alt: string;
  featured: boolean;
  newArrival: boolean;
  coupDeCoeur: boolean;
  createdAt: string;
}

const seeds: Seed[] = [
  // --- Marques tierces -------------------------------------------------
  // Aucune référence fabricant n'apparaît sur ce modèle : le code VM-01 est
  // une référence interne à la boutique. C'est elle que le client citera
  // dans son message WhatsApp.
  {
    slug: "victoria-michael-ronde-ecaille",
    name: "Ronde écaille",
    brand: "Victoria Michael",
    reference: "VM-01",
    category: "lunettes-de-soleil",
    description:
      "Solaire ronde en acétate, noir sur le dessus fondu vers l'écaille, verres bruns. Les branches portent une barrette dorée et se terminent en écaille claire. Livrée dans son étui rigide et sa boîte de marque.",
    colors: [
      { name: "Écaille", hex: "#A9622F" },
      { name: "Noir", hex: "#111111" },
    ],
    alt: "Lunettes de soleil rondes Victoria Michael en acétate écaille et noir, avec leur étui",
    featured: false,
    newArrival: true,
    coupDeCoeur: true,
    createdAt: "2026-09-16T10:00:00.000Z",
  },

  // --- Sélection Lunéa ---------------------------------------------------
  {
    slug: "lunea-ronde-metal-dore",
    name: "Ronde métal doré",
    reference: "LO-01",
    category: "lunettes-de-vue",
    description:
      "Un cercle net en métal doré poli, cerclage filaire et branches fines. C'est la monture la plus légère de la sélection, et celle qui se fait le plus oublier : on la porte du matin au soir sans y penser. Elle adoucit les visages anguleux et donne du caractère aux traits doux.",
    colors: [DORE],
    alt: "Monture de vue ronde en métal doré, vue trois quarts",
    featured: true,
    newArrival: true,
    coupDeCoeur: true,
    createdAt: "2026-09-14T00:00:00.000Z",
  },
  {
    slug: "lunea-pilote-dore",
    name: "Pilote doré",
    reference: "LO-08",
    category: "lunettes-de-soleil",
    description:
      "La forme goutte en métal doré, double pont, verres bruns dégradés. Un dessin que personne n'a jamais réussi à démoder. Le dégradé éclaircit vers le bas : on garde le regard lisible, ce qui change tout en conversation.",
    colors: [DORE],
    alt: "Lunettes de soleil pilote en métal doré à verres bruns dégradés, vue trois quarts",
    featured: true,
    newArrival: true,
    coupDeCoeur: true,
    createdAt: "2026-09-13T00:00:00.000Z",
  },
  {
    slug: "lunea-pantos-ecaille",
    name: "Pantos acétate écaille",
    reference: "LO-02",
    category: "lunettes-de-vue",
    description:
      "Forme pantos en acétate écaille clair, d'épaisseur moyenne. L'écaille réchauffe le teint là où le noir le durcit — c'est le choix le plus sûr pour une première monture affirmée.",
    colors: [ECAILLE],
    alt: "Monture de vue pantos en acétate écaille, vue trois quarts",
    featured: true,
    newArrival: true,
    coupDeCoeur: true,
    createdAt: "2026-09-12T00:00:00.000Z",
  },
  {
    slug: "lunea-papillon-noir",
    name: "Papillon noir dégradé",
    reference: "LO-11",
    category: "lunettes-de-soleil",
    description:
      "Acétate noir brillant, pointes relevées, verres gris dégradés. Une solaire franchement féminine, qui remonte le regard et structure les pommettes. À essayer : la hauteur des pointes se joue à quelques millimètres.",
    colors: [NOIR_BRILLANT],
    alt: "Lunettes de soleil papillon en acétate noir brillant à verres dégradés, vue trois quarts",
    featured: true,
    newArrival: true,
    coupDeCoeur: false,
    createdAt: "2026-09-11T00:00:00.000Z",
  },
  {
    slug: "lunea-carree-ecaille",
    name: "Carrée écaille",
    reference: "LO-09",
    category: "lunettes-de-soleil",
    description:
      "Acétate écaille, cerclage large, verres verts. Le vert est le verre le plus neutre qui soit : il assombrit sans fausser les couleurs, ce qui en fait la solaire de conduite par excellence.",
    colors: [ECAILLE],
    alt: "Lunettes de soleil carrées en acétate écaille à verres verts, vue trois quarts",
    featured: true,
    newArrival: true,
    coupDeCoeur: true,
    createdAt: "2026-09-10T00:00:00.000Z",
  },
  {
    slug: "lunea-browline-miel",
    name: "Browline miel et or",
    reference: "LO-12",
    category: "lunettes-de-soleil",
    description:
      "Sourcil en acétate miel translucide, bas du verre cerclé de métal doré, verres bruns. Une solaire plus habillée qu'une carrée classique, qui passe du bureau à la terrasse sans changer de registre.",
    colors: [MIEL, DORE],
    alt: "Lunettes de soleil browline en acétate miel et métal doré, vue trois quarts",
    featured: true,
    newArrival: false,
    coupDeCoeur: true,
    createdAt: "2026-09-08T00:00:00.000Z",
  },
  {
    slug: "lunea-rectangle-noir-mat",
    name: "Rectangle noir mat",
    reference: "LO-04",
    category: "lunettes-de-vue",
    description:
      "Acétate noir mat, lignes droites, cerclage épais. Le mat absorbe la lumière au lieu de la renvoyer : la monture se voit moins en photo et en visioconférence qu'un noir brillant, tout en gardant sa présence.",
    colors: [NOIR_MAT],
    alt: "Monture de vue rectangulaire en acétate noir mat, vue trois quarts",
    featured: false,
    newArrival: false,
    coupDeCoeur: true,
    createdAt: "2026-09-05T00:00:00.000Z",
  },
  {
    slug: "lunea-papillon-cristal-rose",
    name: "Papillon cristal rosé",
    reference: "LO-03",
    category: "lunettes-de-vue",
    description:
      "Acétate translucide rosé, coins légèrement relevés. La transparence allège une forme qui pourrait vite être trop marquée — elle laisse passer la lumière et ne coupe pas le visage.",
    colors: [CRISTAL_ROSE],
    alt: "Monture de vue papillon en acétate translucide rosé, vue trois quarts",
    featured: false,
    newArrival: false,
    coupDeCoeur: false,
    createdAt: "2026-09-03T00:00:00.000Z",
  },
  {
    slug: "lunea-browline-acetate-metal",
    name: "Browline acétate et métal",
    reference: "LO-05",
    category: "lunettes-de-vue",
    description:
      "Sourcil et branches en acétate havane foncé, cerclage inférieur en métal doré. Le poids se concentre en haut, ce qui la rend confortable sur une longue journée d'écran.",
    colors: [HAVANE_FONCE, DORE],
    alt: "Monture de vue browline en acétate havane foncé et métal doré, vue trois quarts",
    featured: false,
    newArrival: false,
    coupDeCoeur: true,
    createdAt: "2026-09-01T00:00:00.000Z",
  },
  {
    slug: "lunea-ovale-titane",
    name: "Ovale titane argent",
    reference: "LO-06",
    category: "lunettes-de-vue",
    description:
      "Cerclage filaire en titane brossé, branches d'une finesse extrême. Le titane ne s'oxyde pas et supporte les torsions : c'est la monture des porteurs permanents, et celle qui pardonne le plus les fortes corrections.",
    colors: [ARGENT],
    alt: "Monture de vue ovale en titane argent brossé, vue trois quarts",
    featured: false,
    newArrival: false,
    coupDeCoeur: false,
    createdAt: "2026-08-28T00:00:00.000Z",
  },
  {
    slug: "lunea-carree-bleu-nuit",
    name: "Carrée bleu nuit",
    reference: "LO-07",
    category: "lunettes-de-vue",
    description:
      "Acétate translucide bleu nuit, cerclage franc. Une alternative au noir pour qui veut une monture présente sans être sévère : le bleu profond se lit comme un neutre de près, et révèle sa couleur à la lumière.",
    colors: [BLEU_NUIT],
    alt: "Monture de vue carrée en acétate translucide bleu nuit, vue trois quarts",
    featured: false,
    newArrival: false,
    coupDeCoeur: false,
    createdAt: "2026-08-25T00:00:00.000Z",
  },
  {
    slug: "lunea-ronde-gunmetal",
    name: "Ronde gunmetal",
    reference: "LO-10",
    category: "lunettes-de-soleil",
    description:
      "Cerclage rond en métal gunmetal, verres gris unis, branches filaires. La plus graphique de la sélection, et celle qui demande le plus d'assurance — le gris uni respecte les couleurs sans les réchauffer.",
    colors: [GUNMETAL],
    alt: "Lunettes de soleil rondes en métal gunmetal à verres gris, vue trois quarts",
    featured: false,
    newArrival: false,
    coupDeCoeur: false,
    createdAt: "2026-08-22T00:00:00.000Z",
  },
  {
    slug: "lunea-rectangle-taupe",
    name: "Rectangle taupe ambré",
    reference: "LO-13",
    category: "lunettes-de-soleil",
    description:
      "Acétate taupe mat, cerclage fin, verres ambrés. L'ambre augmente le contraste par temps voilé — utile sur la côte, quand la lumière est forte mais diffuse.",
    colors: [TAUPE],
    alt: "Lunettes de soleil rectangulaires en acétate taupe à verres ambrés, vue trois quarts",
    featured: false,
    newArrival: false,
    coupDeCoeur: false,
    createdAt: "2026-08-18T00:00:00.000Z",
  },
  {
    slug: "lunea-sport-noir-mat",
    name: "Sport noir mat",
    reference: "LO-14",
    category: "lunettes-de-soleil",
    description:
      "Monture enveloppante en noir mat, écran d'un seul tenant, verres gris. Le galbe protège des reflets latéraux, ce qu'aucune forme droite ne fait. Pour la route, la marche et le bord de mer.",
    colors: [NOIR_MAT],
    alt: "Lunettes de soleil de sport enveloppantes en noir mat, vue trois quarts",
    featured: false,
    newArrival: false,
    coupDeCoeur: false,
    createdAt: "2026-08-15T00:00:00.000Z",
  },
];

export const catalogueFrames: Frame[] = seeds.map((seed) => ({
  id: seed.reference.toLowerCase(),
  slug: seed.slug,
  name: seed.name,
  brand: seed.brand ?? "Sélection Lunéa",
  reference: seed.reference,
  category: seed.category,
  description: seed.description,
  images: [
    {
      url: `/images/frames/${seed.slug}-1.jpg`,
      alt: seed.alt,
      width: 1600,
      height: 1200,
    },
  ],
  colors: seed.colors,
  price: null,
  availability: "sur-commande",
  featured: seed.featured,
  newArrival: seed.newArrival,
  coupDeCoeur: seed.coupDeCoeur,
  createdAt: seed.createdAt,
}));
