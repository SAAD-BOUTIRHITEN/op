import { IS_DEV } from "@/lib/env";
import { Button } from "./Button";
import { Container } from "./Container";

interface PagePlaceholderProps {
  title: string;
  /** Étape du plan de développement. Affichée en développement seulement. */
  stage?: string;
}

/**
 * Page d'attente temporaire.
 *
 * Ces routes existent dès maintenant pour qu'aucun lien de navigation ne
 * renvoie une 404 pendant le développement. Elles sont en `noindex` et seront
 * remplacées par l'implémentation réelle aux étapes indiquées.
 */
export function PagePlaceholder({ title, stage }: PagePlaceholderProps) {
  return (
    <section className="py-section">
      <Container>
        <h1 className="font-serif text-title">{title}</h1>
        <p className="measure mt-5 text-body font-light text-taupe">
          Cette page est en cours de rédaction. Pour toute question, écrivez-nous ou
          passez en boutique.
        </p>
        {IS_DEV && stage ? (
          <p className="micro mt-3 text-taupe">Développement : livrée à l&rsquo;{stage}</p>
        ) : null}
        <div className="mt-8">
          <Button href="/" variant="line">
            Retour à l&rsquo;accueil
          </Button>
        </div>
      </Container>
    </section>
  );
}
