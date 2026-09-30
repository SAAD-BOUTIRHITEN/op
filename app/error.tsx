"use client";

import { useEffect } from "react";
import { Button } from "@/components/shared/Button";
import { Container } from "@/components/shared/Container";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

/**
 * Limite d'erreur des pages.
 *
 * Sans elle, une exception dans un composant serveur affiche la page d'erreur
 * par défaut de Next : sans marque, en anglais, sans issue. Le cas deviendra
 * courant dès que le catalogue viendra du CMS, où un appel réseau peut échouer.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Seule trace côté client : le détail reste dans les journaux du serveur.
    console.error(error);
  }, [error]);

  return (
    <section className="py-section">
      <Container>
        <h1 className="font-serif text-title">Une erreur est survenue</h1>
        <p className="measure mt-5 text-body font-light text-taupe">
          La page n&rsquo;a pas pu s&rsquo;afficher. Réessayez dans un instant — et si cela
          persiste, écrivez-nous, nous vous répondrons directement.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/" variant="dark" fullWidthOnMobile={false} className="w-full sm:w-auto">
            Retour à l&rsquo;accueil
          </Button>
          <WhatsAppButton
            label="Nous écrire"
            variant="line"
            fullWidthOnMobile={false}
            className="w-full sm:w-auto"
          />
        </div>
        <button
          type="button"
          onClick={reset}
          className="mt-6 min-h-11 border-b border-hairline pb-1 text-ui font-medium tracking-[0.05em] transition-colors hover:border-or"
        >
          Réessayer
        </button>
      </Container>
    </section>
  );
}
