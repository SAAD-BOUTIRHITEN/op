import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";

import { site } from "@/config/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteJsonLd } from "@/lib/seo/jsonld";

/**
 * Polices auto-hébergées (fichiers variables, sous-ensemble latin).
 * Choix délibéré plutôt que next/font/google : la compilation ne dépend
 * d'aucun service tiers, le résultat est reproductible, et une police
 * variable remplace quatre graisses statiques.
 */
const playfair = localFont({
  src: [
    { path: "./fonts/playfair-display-latin-wght-normal.woff2", weight: "400 900", style: "normal" },
  ],
  variable: "--font-playfair",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

/**
 * L'italique ne sert qu'à la signature du pied de page, sous la ligne de
 * flottaison. Déclaré à part avec `preload: false`, il quitte le chemin
 * critique — 37 Ko de moins au premier chargement, sur les 112 Ko de polices.
 * La substitution s'affiche d'abord, la police arrive ensuite.
 */
const playfairItalic = localFont({
  src: [
    { path: "./fonts/playfair-display-latin-wght-italic.woff2", weight: "400 900", style: "italic" },
  ],
  variable: "--font-playfair-italic",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
});

const montserrat = localFont({
  src: [{ path: "./fonts/montserrat-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-montserrat",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.SITE_URL),
  title: {
    default: `${site.BUSINESS_NAME} — Opticien à ${site.CITY}`,
    template: `%s | ${site.BUSINESS_NAME}`,
  },
  description: site.DESCRIPTION,
  // Pas de `alternates.canonical` ici : chaque page déclare le sien.
  // Un défaut au niveau du layout se propage silencieusement aux pages qui
  // oublient de le redéfinir, et les fait toutes pointer vers l'accueil.
  applicationName: site.BUSINESS_NAME,
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: site.BUSINESS_NAME,
    title: `${site.BUSINESS_NAME} — ${site.TAGLINE}`,
    description: site.DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.BUSINESS_NAME} — ${site.TAGLINE}`,
    description: site.DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F8F6F2",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${playfairItalic.variable} ${montserrat.variable}`}>
      <body className="pb-20 lg:pb-0">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-80 focus:bg-noir focus:px-4 focus:py-2 focus:text-creme"
        >
          Aller au contenu
        </a>

        <Navbar />
        {/* tabIndex={-1} : sans lui, le lien d'évitement défile sans déplacer le focus. */}
        <main id="contenu" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <MobileActionBar />

        <JsonLd data={siteJsonLd()} />
      </body>
    </html>
  );
}
