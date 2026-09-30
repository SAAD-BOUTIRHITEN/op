# Lunéa Optique

Site vitrine d'opticien. Next.js 16 (App Router) · TypeScript · Tailwind CSS 4.

Direction visuelle : Concept 2 — Moderne & Sophistiqué.
Architecture complète : voir `ARCHITECTURE.md`.

## Démarrer

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Avant la mise en ligne

1. **`config/site.ts`** — adresse, code postal, région, coordonnées GPS,
   téléphone, WhatsApp, e-mail, horaires, lien et carte Google Maps sont
   renseignés. **Restent vides** : `INSTAGRAM_URL` et `GOOGLE_PLACE_ID`.

   `GEO` est extrait de l'URL d'intégration Maps : dans le paramètre `pb`,
   `!3d` porte la latitude et `!2d` la longitude. Ces coordonnées alimentent
   le champ `geo` des données structurées, que Google utilise pour la
   proximité.

   **Deux points à confirmer :**
   - le code postal `20000` a été donné pour l'ancienne adresse ; vérifier
     qu'il correspond bien à Oulfa ;
   - l'adresse du site doit être **identique** à celle de la fiche Google
     Business Profile. Une divergence de NAP coûte cher en référencement
     local.
   Le numéro WhatsApp est supposé identique au téléphone : à corriger si la
   boutique utilise une ligne distincte.

   Le dimanche est déclaré **explicitement fermé** (`closed: true`) plutôt
   qu'omis : l'interface affiche « Fermé » et Google affiche « Fermé le
   dimanche » au lieu de laisser le doute.

   Conséquences des champs encore vides :
   - `INSTAGRAM_URL` — la section « Lunéa au quotidien » reste visible (elle a
     une valeur de marque) mais sans lien de suivi ;
   - `GOOGLE_PLACE_ID` — sert au lien « Laisser un avis », pas à afficher des
     avis (voir ci-dessous).

## Avis clients

### Trouver le Place ID

Outil officiel de Google, gratuit et sans clé :
`developers.google.com/maps/documentation/javascript/examples/places-placeid-finder`
Chercher « Lunéa Optique » ou l'adresse, le Place ID s'affiche sur la carte.
Il commence par `ChIJ`. Le coller dans `GOOGLE_PLACE_ID`.

### À quoi il sert vraiment

**Pas à afficher des avis.** Le Place ID seul n'en récupère aucun : il faudrait
l'API Places, une clé Google et une facturation activée, pour au mieux
**5 avis**.

Il sert au **lien direct vers le formulaire d'avis** :
`search.google.com/local/writereview?placeid=…`
Le site le construit automatiquement et l'affiche sur la page contact. C'est
l'outil qui permet à une boutique qui ouvre d'obtenir ses premiers avis :
à partager en fin de visite par WhatsApp, ou en QR code sur le comptoir.

### Afficher de vrais avis

Recopier les avis publics dans `content/reviews.ts` : auteur, note, verbatim,
date. Le texte doit être **mot pour mot** celui de l'avis public.

- Tableau vide → la section n'apparaît pas du tout.
- Au moins un avis → la section s'affiche, avec le lien « Laisser un avis ».

Aucune donnée structurée `Review` ni `AggregateRating` n'est émise : Google ne
soutient plus les avis auto-déclarés d'un commerce sur son propre site, et les
publier expose à une action manuelle sans rien rapporter. Un test le vérifie.

## Accessibilité et performance

Mesures du build de production (gzip) : JS 177–184 Ko dont ~175 Ko de socle
Next/React, CSS 6 Ko, polices 74 Ko sur le chemin critique, image LCP 6 Ko en
AVIF 640 px.

Points corrigés à l'étape 10, tous mesurés et non supposés :

- **Anneau de focus** : l'or sur crème donnait 1,90:1 — un utilisateur au
  clavier ne voyait pas où il se trouvait. Remplacé par un anneau bicolore
  (trait noir + halo crème) visible sur fond clair comme sur fond sombre.
- **Jeton `--color-or-deep`** (#8a6524, 4,90:1) pour l'or *textuel* et les
  indicateurs d'état sur fond clair : étoiles d'avis, onglet de filtre actif.
  L'or de marque reste réservé aux filets et ornements.
- **Champs de formulaire à 16 px** : en dessous, iOS zoome la page au focus.
- **Placeholder de recherche** en taupe plein (3,07:1 → 5,81:1).
- **État actif de navigation** avec `aria-current="page"` : rien n'indiquait
  la page courante, ni visuellement ni pour un lecteur d'écran.
- **Cibles tactiles** : lien de section élargi à ~44 px sans déplacer un pixel,
  liens de pied de page passés de ~24 à ~36 px à rythme vertical constant.
- **Carte Maps retirée de l'accueil** : un embed tire plusieurs centaines de Ko
  de JavaScript tiers, et l'accueil a déjà un bouton « Itinéraire ». La carte
  interactive reste sur `/contact`.
- **Préchargement d'images ramené de 4 à 2** sur le catalogue : la première
  rangée mobile en compte deux.

## Marqueurs de développement

Tous les marqueurs de configuration manquante (« à renseigner », « à
connecter », emplacements d'avis vides, mentions d'étape) sont conditionnés par
`IS_DEV` dans `lib/env.ts`. Le développeur voit les trous, le visiteur jamais.

Un test parcourt les sept routes du site compilé et vérifie qu'aucun **nom de
variable ni chemin de fichier du projet** n'y apparaît — la liste porte sur les
identifiants techniques, pas sur des phrases choisies à la main. C'est ce
balayage élargi qui a révélé, à l'étape 11, que la page contact expliquait à un
client comment configurer `CONTACT_WEBHOOK_URL`. C'est le seul fichier à
   modifier : aucune information d'entreprise n'est écrite ailleurs.
   Tant qu'un champ est vide, l'interface affiche un marqueur « à renseigner »
   et les boutons WhatsApp renvoient vers `/contact`.
2. **`content/frames.ts`** — Sélection Lunéa : 14 modèles sous les références
   LO-01 à LO-14, sept de vue et sept de soleil. Aucune marque tierce n'est
   revendiquée : ce sont les modèles de la maison, proposés **sur commande**,
   à **prix sur demande** (le tarif dépend des verres).

   Les visuels sont des rendus de présentation. Chaque fiche porte la mention
   « photo non contractuelle », usuelle dans le commerce et nécessaire ici :
   la monture est commandée après échange avec le client.

   Le catalogue accueille aussi des marques tierces : le champ `brand` d'un
   modèle prend le pas sur « Sélection Lunéa ». Les modèles sans référence
   fabricant visible reçoivent une référence interne (ex. VM-01), celle que
   le client citera sur WhatsApp.

   Quand vous connaîtrez vos prix, renseignez `price` ; quand une monture sera
   en vitrine, passez son `availability` à `"en-stock"`.

   **Cohérence visuelle** : les photos de marques tierces ont un fond de mise
   en scène, les 14 modèles maison un fond crème uni. Elles sont donc en
   `featured: false` pour ne pas casser la grille de l'accueil. Passez-les à
   `true` une fois retouchées sur fond crème (voir le prompt de retouche).

3. **Photographies** — déposer les images dans `public/images/frames/` et
   renseigner le tableau `images` de chaque monture. Sans image, un visuel de
   remplacement au bon format est affiché.

## Tests

```bash
npm run typecheck
npm run lint
npm run build
ENABLE_SELFTEST=1 npm run build && ENABLE_SELFTEST=1 npm start
curl localhost:3000/selftest      # 104 assertions, sortie JSON
```

`app/selftest/route.ts` couvre la génération des URL WhatsApp, la nature des
liens (`tel:` ne doit jamais ouvrir un onglet) et le filtrage du catalogue.
Sans `ENABLE_SELFTEST=1` la route renvoie 404 : elle ne peut pas fuiter en
production.

## Windows — dépannage

### `@next/swc-win32-x64-msvc ... is not a valid Win32 application`

Le binaire natif de compilation n'a pas pu être chargé. Next bascule alors sur
les bindings WebAssembly, que Turbopack ne sait pas utiliser, d'où l'arrêt.

Cause la plus fréquente : **le projet est stocké dans un dossier synchronisé
OneDrive**. Avec « Fichiers à la demande », un `.node` peut rester un fichier
fantôme que Windows refuse de charger. La synchronisation de `node_modules`
corrompt aussi régulièrement les binaires natifs.

Correction, dans l'ordre :

```bash
# 1. Sortir le projet de OneDrive
mkdir C:\dev
mv "$HOME/OneDrive/Bureau/lunea-optique" /c/dev/lunea-optique
cd /c/dev/lunea-optique

# 2. Supprimer le lockfile parasite laissé sur le Bureau
#    (il faisait prendre le Bureau pour la racine de l'espace de travail)
rm -f "$HOME/OneDrive/Bureau/package-lock.json"

# 3. Réinstallation propre
rm -rf node_modules
npm install

# 4. Vérifier que le binaire natif est bien un vrai fichier
ls -l node_modules/@next/swc-win32-x64-msvc/   # doit peser ~100 Mo, pas 0
node -p "process.arch"                          # doit afficher x64

npm run dev
```

Si l'antivirus met le `.node` en quarantaine, ajouter le dossier du projet aux
exclusions, puis réinstaller.

### Tester depuis un téléphone

`npm run dev` affiche une ligne « Network : http://192.168.x.x:3000 ». Ouvrez
cette adresse sur un téléphone connecté au même Wi-Fi.

Si l'IP affichée diffère de celle de `.env.example`, relancez avec la vôtre :

```bash
DEV_ORIGINS="192.168.1.20" npm run dev
```

Sans cela la page s'affiche, mais le rechargement à chaud reste bloqué.

### Avertissement d'hydratation causé par une extension

Si la console affiche « A tree hydrated but some attributes… » avec des
attributs du type `bis_skin_checked`, `bis_register`, `data-gr-ext-installed`
ou `__processed_<uuid>__`, **ce n'est pas le site**. Ce sont des extensions de
navigateur qui modifient le DOM avant que React ne s'hydrate :

- `bis_*` et `__processed_*` → Bitdefender
- `data-gr-*` → Grammarly

Rien à corriger dans le code. Pour vérifier un vrai problème d'hydratation,
ouvrez le site dans une fenêtre de navigation privée, extensions désactivées.
`suppressHydrationWarning` sur `<body>` ne servirait à rien ici : ces
extensions marquent aussi des `<div>` imbriqués, que cette directive ne couvre
pas.

### Solution de repli

Si le binaire natif reste indisponible, le projet compile avec Webpack :

```bash
npm run dev:webpack
npm run build:webpack
```

C'est plus lent que Turbopack, mais le résultat est identique — les deux
chemins de compilation sont testés et produisent les mêmes 18 routes.

## Structure

```
app/            routes App Router, styles globaux, métadonnées
components/     layout · home · shared · seo
config/         site.ts (source unique) · navigation.ts
content/        catalogue local (étape 0 du CMS)
lib/            products (modèle + dépôt) · whatsapp · seo · utils
```

## Catalogue

`/montures` lit ses filtres dans l'URL, ce qui rend la page dynamique : chaque
vue filtrée est rendue côté serveur et reste donc correcte sans JavaScript et
partageable telle quelle. Le catalogue complet est ensuite confié à l'îlot
client, qui filtre en mémoire — aucun aller-retour serveur pendant la frappe
ou au clic sur un onglet. L'URL suit l'état via `replaceState`, en préservant
les paramètres de campagne (`utm_*`, `gclid`).

Paramètres publics : `?categorie=`, `?selection=`, `?marque=`, `?recherche=`.
Ils apparaissent dans les liens de la page d'accueil et dans le `SearchAction`
des données structurées — les renommer implique de mettre à jour ces deux
endroits.

Au passage à Sanity, ajouter `export const revalidate` sur cette page : sans
cela, chaque requête déclencherait un appel au CMS.

## Fiches montures

`/montures/[slug]` est prérendue pour chaque monture (`generateStaticParams`).
La galerie est un composant serveur : elle ne monte l'îlot client que s'il y a
au moins deux photos, une monture à une seule image n'ayant rien d'interactif
à hydrater.

Le bouton WhatsApp compose son message à partir du modèle et de la référence.
Tant que `WHATSAPP_NUMBER` est vide, il renvoie vers `/contact`.

## Partage et Open Graph

Chaque fiche génère sa propre image Open Graph 1200×630
(`app/montures/[slug]/opengraph-image.tsx`), prérendue à la compilation : les
robots de WhatsApp et Facebook reçoivent un PNG statique. La carte reprend la
palette et le verrou de marque, avec la photo du modèle si elle existe, une
silhouette sinon.

Satori n'accepte ni woff2 ni police variable. `lib/og/` contient donc deux
instances statiques sous-ensemblées (Playfair 500, Montserrat 400), utilisées
uniquement pour ces images — le site charge les woff2 variables de `app/fonts/`.

Le bouton de partage utilise l'API Web Share quand elle existe et copie le lien
sinon. Son libellé ne dépend jamais des capacités du navigateur : le serveur ne
les connaît pas, et en faire dépendre le rendu provoquerait une divergence
d'hydratation. Le lien partagé est reconstruit à partir du chemin seul, pour ne
pas transmettre les paramètres de campagne de l'expéditeur.

## Formulaire de contact

Le formulaire poste sur `/api/contact`, qui valide puis relaie le message vers
`CONTACT_WEBHOOK_URL` — n'importe quel service acceptant du JSON (Formspree,
Make, Zapier, n8n). Aucune dépendance npm : passer plus tard à un fournisseur
d'e-mail ne touche que `lib/contact/transport.ts`.

Tant que la variable est vide, le formulaire **n'est pas affiché** et la page
propose WhatsApp et le téléphone. Un formulaire qui perd les messages est pire
qu'un formulaire absent. La page `/contact` étant prérendue, un changement de
`CONTACT_WEBHOOK_URL` nécessite un redéploiement.

Les règles de validation vivent dans `lib/contact/validate.ts` et servent au
navigateur comme au serveur : le client ne peut pas être plus permissif.
Un champ piège (`societe`) écarte les robots — la réponse reste un `200`, pour
ne rien leur apprendre. La limitation de débit n'est pas implémentée ici :
elle se règle au niveau de l'hébergeur ou du WAF.

`/contact` reste en `noindex` tant qu'aucune adresse ni téléphone n'est
renseigné : indexer une fiche locale vide dessert le référencement local.

## Onglets du catalogue

Chaque onglet (`Toutes`, `Lunettes de vue`, `Lunettes de soleil`, `Nouveautés`,
`Coups de cœur`) est une vraie page — `/montures`, `/montures/lunettes-de-vue`,
etc. — et non un bouton JavaScript : chacune a son titre, sa méta-description
et son URL canonique propres, et fonctionne même sans JavaScript. Défini dans
`lib/products/catalog-params.ts` (`FACETS`), généré par
`components/catalog/catalog-route.tsx`. Les anciennes adresses
`?categorie=…`/`?selection=…` redirigent en 301 vers l'onglet correspondant ;
marque et recherche continuent de vivre dans la query string et suivent d'un
onglet à l'autre.

## Menu mobile : fonctionne sans JavaScript

Le bouton hamburger est un vrai lien d'ancre (`href="#menu-mobile"`) affiché
par CSS via `:target` — le navigateur seul suffit à l'ouvrir. Quand JavaScript
tourne, il intercepte le clic (`preventDefault`) pour une ouverture instantanée
et pilotée par React ; les deux mécanismes cohabitent sans conflit
(`components/layout/MobileMenu.tsx`). Testé dans les deux cas : ouverture,
fermeture, navigation, aucun saut de défilement.

## Hébergement

Netlify. Voir **`DEPLOIEMENT.md`** pour la procédure complète.
`netlify.toml` épingle Node 22 (Next 16 exige 20.9 minimum) ; le runtime
Next.js est laissé à la gestion de Netlify pour recevoir ses mises à jour.

## Domaine et mise en ligne

> **GitHub Pages** : voir `DEPLOIEMENT-GITHUB-PAGES.md` (`npm run build:pages`,
> export statique). Sur GitHub Pages, les redirections `.com`/`.me` → `.live`
> décrites ci-dessous se règlent chez le registrar, pas dans le code. La suite
> de cette section décrit le mode serveur (Netlify).

Hôte canonique : **`https://luneaoptique.live`** (apex, sans `www`).

Cette valeur pilote les URL canoniques, le sitemap, les images de partage et
les données structurées. Elle doit correspondre **exactement** à l'hôte servi :

1. **Cinq redirections 301 (techniquement 308 — voir plus bas) vivent dans
   `next.config.ts`**, pas dans la config d'hébergeur : `luneaoptique.com` →
   `.live`, `www.luneaoptique.com` → `.live`, `luneaoptique.me` → `.live`,
   `www.luneaoptique.me` → `.live`, et `www.luneaoptique.live` → `.live`.
   Aucune ne dépend de l'hébergeur choisi. Testé avec un en-tête `Host:`
   simulé : les cinq redirigent en préservant le chemin, `.live` seul ne
   redirige jamais (pas de boucle).
   Next émet ces redirections `permanent: true` avec le code **308**, pas
   littéralement 301 — 308 préserve la méthode de la requête (POST reste
   POST), ce que 301 ne garantit pas ; Google traite les deux identiquement
   pour le référencement. Objectif rempli : permanent et indexable par les
   moteurs, jamais 302.
2. **`luneaoptique.com` et `luneaoptique.me` doivent tous les deux rester
   pointés vers ce même déploiement** pour que ces règles s'exécutent : sur
   Netlify, les garder comme domaines additionnels (`.live` en principal)
   plutôt que de les retirer.
3. **Vérifier `/robots.txt` après le déploiement**, sur `.live`. Si une page
   de parking ou une configuration d'hébergeur l'intercepte, Google est
   bloqué sur tout le site. La route est fournie par `app/robots.ts`.
4. **Soumettre le sitemap** dans Google Search Console :
   `https://luneaoptique.live/sitemap.xml` (23 URL : accueil, à-propos,
   contact, les 5 pages de catalogue — voir plus bas — et 15 fiches montures).

`luneaoptique.com` et `luneaoptique.me` restent tous les deux enregistrés et
redirigent en permanence vers `.live` — voir ci-dessus.

## SEO

`app/sitemap.ts` et `app/robots.ts` sont générés à la compilation.

Le sitemap n'annonce **que des URL réellement indexables** : lister une page en
`noindex` revient à donner deux consignes contradictoires à Google. Sont donc
exclues les pages légales (encore des gabarits), `/contact` tant qu'aucune
adresse ni téléphone n'est renseigné, et les fiches montures si
`CATALOGUE_NEEDS_REVIEW` repasse à `true`. Un test vérifie qu'aucune URL du
sitemap n'est en `noindex`.

`lib/seo/metadata.ts` compose les métadonnées de toutes les pages. Il ferme
deux pièges de Next :

- un objet `openGraph` défini dans une page **remplace** celui du layout
  parent, images comprises — trois pages se retrouvaient sans aperçu de
  partage ;
- une page qui oublie `alternates.canonical` hérite de celui du layout, et
  pointe donc vers l'accueil. Le chemin est désormais obligatoire.

Les fiches montures passent `ownOgImage: true` : leur segment possède son
propre `opengraph-image.tsx`, et fixer `images` dans les métadonnées le
remplacerait par la photo brute.

## Vidéo du hero

Le lecteur est prêt, désactivé tant que `heroVideo` vaut `null` dans
`content/media.ts`. Prompts et procédure : voir `video-hero-prompts.md`.

Deux fichiers, un par format : 16:9 pour le bureau, 9:16 pour le mobile — une
seule vidéo recadrée couperait le sujet sur téléphone. La source est choisie en
JavaScript, pas avec l'attribut `media` des `<source>` que d'anciens
navigateurs ignorent.

Amélioration progressive : la photo s'affiche d'abord et reste l'élément LCP
sur mobile ; la vidéo ne se monte qu'après `load`, n'apparaît qu'une fois en
lecture effective, et ne se monte jamais si la réduction des animations ou
l'économie de données sont actives. Bouton pause pour WCAG 2.2.2.

Encodage web (H.264 + VP9, sans son, `faststart`) — testé ici : un maître de
7,6 Mo donne 264 Ko sur bureau et 176 Ko sur mobile.

```bash
# Bureau
ffmpeg -i maitre-16x9.mp4 -an -vf "scale=1920:-2:flags=lanczos,fps=25,format=yuv420p" \
  -c:v libx264 -preset slow -crf 26 -profile:v high -movflags +faststart hero-desktop.mp4
ffmpeg -i maitre-16x9.mp4 -an -vf "scale=1920:-2:flags=lanczos,fps=25" \
  -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 hero-desktop.webm
# Mobile
ffmpeg -i maitre-9x16.mp4 -an -vf "scale=720:-2:flags=lanczos,fps=25,format=yuv420p" \
  -c:v libx264 -preset slow -crf 27 -profile:v high -movflags +faststart hero-mobile.mp4
ffmpeg -i maitre-9x16.mp4 -an -vf "scale=720:-2:flags=lanczos,fps=25" \
  -c:v libvpx-vp9 -crf 37 -b:v 0 -row-mt 1 hero-mobile.webm
```

Sur bureau, la vidéo devient l'élément LCP — inhérent à toute vidéo plein
écran. Le mobile n'est pas concerné.

## Vérification mobile réelle

Les étapes 1 à 12 ont été contrôlées sans navigateur. Un Chromium a ensuite pu
être installé dans l'environnement de développement, et l'audit à 390×844 a
révélé ce que le raisonnement n'avait pas vu :

- **Tous les boutons à contour étaient invisibles** (« Appeler »,
  « Itinéraire », « Nous contacter »…). La base du composant portait
  `border-transparent`, de même spécificité que la couleur de la variante ;
  `cn()` concatène sans arbitrer, et le transparent l'emportait.
- **L'icône du menu changeait de côté** entre fermé et ouvert, et le logo
  sautait du centre vers la gauche.
- **Aucune monture n'était visible sur le premier écran** du catalogue.
- **Les onglets de filtre étaient coupés net**, sans signe de défilement.
- **Sur la fiche, « Demander ce modèle » était sous la ligne de flottaison** ;
  le seul bouton vert visible, celui de la barre du bas, envoie un message
  générique sans le modèle.
- **Le numéro de téléphone s'affichait brut** et n'était pas cliquable.
- **Une monture inexistante répondait 200** (soft 404), régression de
  l'étape 12 : le `loading.tsx` enveloppait aussi les fiches.

Tous corrigés et revérifiés dans le navigateur. **Limite restante** : ce
Chromium est le moteur d'Android. Safari sur iPhone utilise WebKit, qui n'a pas
pu être testé ici.

## Revue technique

- **Dépendances** : 3 en production (next, react, react-dom), 9 en
  développement. `npm audit` : 0 vulnérabilité. `@eslint/eslintrc`, importé
  directement par `eslint.config.mjs`, était seulement transitif — désormais
  déclaré, sinon `npm run lint` casse sur une installation neuve.
- **Cas d'erreur** : `app/error.tsx` et `app/global-error.tsx`. Sans eux, une
  exception affichait la page d'erreur par défaut de Next, sans marque et sans
  issue.
- **Squelette de chargement** sur `/montures`, route rendue à la demande.
- **En-têtes de sécurité** dans `next.config.ts`. Pas de CSP : elle exigerait
  des nonces pour le JSON-LD en ligne et casserait l'iframe Maps.
- **Hiérarchie des titres** : aucun saut de niveau sur les 7 routes.

## Point de bascule CMS

Toutes les lectures passent par `lib/products/repository.ts`. Le passage à
Sanity consiste à y remplacer `localSource` par `sanitySource` : aucune page ni
aucun composant n'est modifié. Détail de la migration dans `ARCHITECTURE.md`, §7.

## État d'avancement

| Étape | Périmètre | État |
| --- | --- | --- |
| 1 | Architecture, système de design, modèle de données | ✅ |
| 2 | Structure du projet, configuration, données | ✅ |
| 3 | Design system global, Navbar, MobileMenu, Footer | ✅ |
| 4 | Page d'accueil | ✅ |
| — | Revue, tests et corrections (étapes 1-4) | ✅ |
| 5 | Catalogue `/montures` (recherche + filtres) | ✅ |
| 6 | Fiches montures `/montures/[slug]` | ✅ |
| 7 | WhatsApp dynamique, partage, Open Graph par monture | ✅ |
| 8 | `/a-propos` et `/contact` | ✅ |
| 9 | SEO : sitemap, robots, données structurées produit | ✅ |
| 10 | Mobile, performance, accessibilité | à faire |
| 11-12 | Revues UI/UX et technique | à faire |

Les liens vers `/montures`, `/a-propos` et `/contact` sont déjà en place dans la
navigation : ces routes seront créées aux étapes 5, 6 et 8.
