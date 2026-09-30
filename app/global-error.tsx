"use client";

import "./globals.css";

/**
 * Limite d'erreur de dernier recours : elle remplace le layout racine, donc
 * ni les polices ni l'en-tête ne sont chargés. Volontairement autonome et
 * minimale — c'est le seul écran qui doit fonctionner quand tout le reste a
 * échoué.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body className="bg-creme text-noir">
        <main className="mx-auto max-w-[36rem] px-5 py-24">
          <h1 className="font-serif text-[2rem] leading-tight">Le site est indisponible</h1>
          <p className="mt-5 text-body font-light text-taupe">
            Une erreur inattendue empêche l&rsquo;affichage. Réessayez dans un instant.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 min-h-11 rounded-xs bg-noir px-7 py-4 text-ui font-medium tracking-[0.09em] text-creme uppercase"
          >
            Réessayer
          </button>
        </main>
      </body>
    </html>
  );
}
