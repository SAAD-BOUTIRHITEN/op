import path from "node:path";
import type { NextConfig } from "next";

/**
 * Hôtes autorisés à charger les ressources du serveur de développement.
 * Sans cela, ouvrir le site depuis un téléphone sur le même Wi-Fi fonctionne,
 * mais le rechargement à chaud (HMR) est bloqué : la page ne se rafraîchit pas.
 *
 * Votre IP locale change avec le routeur. Pour la mettre à jour sans toucher
 * au code : DEV_ORIGINS="192.168.1.20" npm run dev
 * (plusieurs hôtes séparés par des virgules).
 */
const devOrigins = (process.env.DEV_ORIGINS ?? "192.168.1.12")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/**
 * Deux modes de publication, un seul code :
 *
 *  - défaut (Netlify, Vercel…) : serveur Next complet — redirections de
 *    domaine, en-têtes de sécurité, images optimisées à la demande, route
 *    /api/contact ;
 *  - STATIC_EXPORT=1 (GitHub Pages) : dossier `out/` de fichiers statiques.
 *    GitHub Pages ne sait ni rediriger par domaine, ni poser d'en-têtes, ni
 *    exécuter du code serveur : ces trois choses sont donc désactivées ici et
 *    prises en charge autrement (voir DEPLOIEMENT-GITHUB-PAGES.md).
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        // Chargeur maison : GitHub Pages n'a pas de serveur d'optimisation.
        // Les variantes redimensionnées sont fabriquées après le build par
        // scripts/optimize-images.mjs.
        images: {
          loader: "custom" as const,
          loaderFile: "./lib/images/static-loader.ts",
        },
      }
    : {}),
  /**
   * Migration de domaine : luneaoptique.com ET luneaoptique.me →
   * luneaoptique.live, en 301 (permanent: true), jamais en 302.
   * `has: [{ type: "host", ... }]` ne matche que si l'hôte demandé est
   * CELUI-LÀ — un visiteur qui arrive sur .live ne traverse jamais ces
   * règles. Suppose que .com et .me restent tous les deux pointés vers ce
   * même déploiement (Netlify : gardés comme domaines additionnels, .live
   * désigné domaine principal) ; si l'un des deux est retiré du site, sa
   * règle devient inerte, sans effet de bord sur les autres.
   */
  ...(isStaticExport ? {} : { async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "luneaoptique.com" }],
        destination: "https://luneaoptique.live/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.luneaoptique.com" }],
        destination: "https://luneaoptique.live/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "luneaoptique.me" }],
        destination: "https://luneaoptique.live/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.luneaoptique.me" }],
        destination: "https://luneaoptique.live/:path*",
        permanent: true,
      },
      // www.luneaoptique.live -> apex : un seul hôte canonique, même après
      // la migration.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.luneaoptique.live" }],
        destination: "https://luneaoptique.live/:path*",
        permanent: true,
      },
    ];
  } }),

  allowedDevOrigins: devOrigins,
  /**
   * Épingle la racine du projet. Sans cela, Next remonte l'arborescence à la
   * recherche d'un lockfile et peut désigner un dossier parent (Bureau,
   * OneDrive) comme racine de l'espace de travail.
   */
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  /**
   * En-têtes de sécurité de base. Pas de Content-Security-Policy ici : elle
   * exigerait des nonces pour le JSON-LD en ligne et casserait l'iframe Google
   * Maps — à ajouter une fois vérifiée sur l'environnement réel.
   */
  ...(isStaticExport ? {} : { async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  } }),
  ...(isStaticExport
    ? {}
    : {
        images: {
          formats: ["image/avif" as const, "image/webp" as const],
          remotePatterns: [
            // Étape 2 de la migration CMS : décommenter lors du passage à Sanity.
            // { protocol: "https", hostname: "cdn.sanity.io" },
          ],
        },
      }),
};

export default nextConfig;
