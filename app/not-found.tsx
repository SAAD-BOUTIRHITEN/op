import type { Metadata } from "next";
import { Button } from "@/components/shared/Button";
import { Container } from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="py-section">
      <Container>
        <p className="micro text-taupe">Erreur 404</p>
        <h1 className="mt-4 max-w-[16ch] font-serif text-title">
          Cette page n&rsquo;existe pas ou a été déplacée
        </h1>
        <p className="measure mt-5 text-body font-light text-taupe">
          Le lien est peut-être incomplet. Vous pouvez reprendre depuis nos montures ou
          revenir à l&rsquo;accueil.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/montures" variant="line">
            Voir les montures
          </Button>
          <Button href="/" variant="line">
            Accueil
          </Button>
        </div>
      </Container>
    </section>
  );
}
