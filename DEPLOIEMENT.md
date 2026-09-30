# Mise en ligne sur Netlify

> Pour publier sur **GitHub Pages** à la place : `DEPLOIEMENT-GITHUB-PAGES.md`.

Next.js 16 est pris en charge par le runtime Netlify v5, actif par défaut.
Rien à installer : Netlify détecte Next.js et s'en occupe.

---

## 1. Mettre le projet sur Git

Netlify a besoin d'un dépôt Git pour ce site : il contient des routes rendues
à la demande (`/montures`, `/api/contact`), donc un simple glisser-déposer de
dossier ne suffit pas.

```bash
cd /c/dev/lunea-optique        # hors OneDrive
git init
git add .
git commit -m "Site Lunéa Optique"
```

Créez un dépôt **privé** sur GitHub, puis :

```bash
git remote add origin https://github.com/VOTRE-COMPTE/lunea-optique.git
git branch -M main
git push -u origin main
```

`node_modules`, `.next` et `.env` sont déjà exclus par `.gitignore`.

---

## 2. Créer le site sur Netlify

1. **Add new site → Import an existing project → GitHub**, choisir le dépôt.
2. Netlify propose de lui-même : commande `npm run build`, dossier `.next`,
   runtime Next.js. Ces valeurs sont déjà fixées par `netlify.toml` — les
   laisser telles quelles.
3. **Deploy.** Le premier build prend 2 à 4 minutes.

---

## 3. Variables d'environnement

Site configuration → Environment variables.

| Variable | Valeur | Obligatoire |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://luneaoptique.live` | recommandé |
| `CONTACT_WEBHOOK_URL` | l'URL de votre webhook | seulement pour activer le formulaire |

**Ne définissez jamais `ENABLE_SELFTEST`** en production : elle ouvre la route
de tests.

Gardez `NEXT_PUBLIC_SITE_URL` sur le domaine de production même pour les
aperçus de déploiement. Les canonicals des aperçus pointent alors vers la
production, ce qui évite qu'ils soient indexés comme des doublons — et Netlify
ajoute déjà `X-Robots-Tag: noindex` sur les aperçus.

Après tout changement de variable, **relancer un déploiement** : la page
`/contact` est prérendue, donc `CONTACT_WEBHOOK_URL` n'est lue qu'au build.

---

## 4. Brancher le domaine

`luneaoptique.live` est le domaine retenu. **Les trois domaines doivent être
ajoutés au site**, pas seulement celui-ci :

1. Domain management → Add a domain → `luneaoptique.live`. Suivre les
   enregistrements DNS indiqués par Netlify chez votre registrar. Désigner
   **`luneaoptique.live` comme domaine principal** (apex, sans `www`) : c'est
   la valeur de `SITE_URL`.
2. Domain management → Add a domain → `luneaoptique.me`, **en domaine
   additionnel** (pas principal). Son DNS doit continuer à pointer vers ce
   même site Netlify.
3. Domain management → Add a domain → `luneaoptique.com`, **en domaine
   additionnel** également. Même chose : DNS pointé vers ce site Netlify.
4. Le certificat Let's Encrypt de chaque domaine est provisionné
   automatiquement, comptez quelques minutes après la propagation DNS —
   pour les trois domaines, puisque `.me` et `.com` doivent continuer à
   répondre en HTTPS pour que leur redirection s'exécute.

**Pourquoi garder `.me` et `.com` connectés plutôt que de les retirer :** les
redirections `.me` → `.live` et `.com` → `.live` (301, en réalité servies en
308 par Next — voir le README) vivent dans le code (`next.config.ts`, testées
avec un en-tête `Host:` simulé), pas dans un réglage Netlify. Si l'un des
deux est détaché du site, ses visiteurs et les liens déjà partagés tombent en
erreur au lieu d'atterrir sur `.live`.

---

## 5. Un réglage Netlify à désactiver

Site configuration → Build & deploy → Post processing : **désactiver « Asset
optimization »**. Next.js optimise déjà ses fichiers au build ; une seconde
passe de Netlify peut casser le site. C'est une recommandation explicite de
leur documentation.

---

## 6. Vérifications après le premier déploiement

Dans l'ordre d'importance :

```bash
curl -s https://luneaoptique.live/robots.txt
```
Doit afficher `Allow: /`. **C'est la vérification la plus importante** : si une
page de parking ou une configuration d'hébergeur intercepte cette route, Google
est bloqué sur tout le site et vous ne le verriez pas avant des semaines.

```bash
curl -s https://luneaoptique.live/sitemap.xml | grep -c "<loc>"
```
Doit renvoyer 23 (accueil, à-propos, contact, 5 pages de catalogue,
15 fiches montures).

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://luneaoptique.live/montures/nexiste-pas
```
Doit renvoyer **404**, pas 200. Un 200 sur une page inexistante (« soft
404 ») fait indexer par Google des pages vides — c'est arrivé une fois sur ce
projet, par un `loading.tsx` mal placé.

```bash
curl -sD - -o /dev/null https://luneaoptique.live/ | grep -i "x-content-type\|strict-transport"
```
Les en-têtes de sécurité doivent apparaître.

```bash
curl -sI https://luneaoptique.com/ | grep -i "^HTTP\|^location"
curl -sI https://luneaoptique.me/ | grep -i "^HTTP\|^location"
```
Chacune doit afficher un statut **301 ou 308** avec
`location: https://luneaoptique.live/`. C'est la redirection de domaine —
testée en local avec un en-tête `Host:` simulé, mais seule une vérification
en production confirme que le DNS de `.com` et de `.me` pointe encore bien
vers ce déploiement.

Puis à l'œil, sur un téléphone :

- le menu hamburger s'ouvre et se ferme ;
- un bouton « Demander ce modèle sur WhatsApp » ouvre bien WhatsApp avec le
  message pré-rempli ;
- « Partager ce modèle » ouvre le partage natif ;
- collez un lien de monture dans une conversation WhatsApp : l'aperçu doit
  montrer la carte 1200×630 avec le nom du modèle, pas la photo brute.

Enfin, soumettez `https://luneaoptique.live/sitemap.xml` dans Google Search
Console. Si le site était déjà indexé sous `.com` ou `.me`, ajoutez aussi ces
propriétés dans Search Console : Google y signalera les redirections
détectées plutôt que de les découvrir seul, plus lentement.

---

## Ce qui tourne en fonction serverless

Tout le site est prérendu et servi par le CDN, **sauf** :

- `/montures` — lit ses filtres dans l'URL, donc rendue à la demande ;
- `/api/contact` — la réception du formulaire ;
- `/selftest` — renvoie 404 sans `ENABLE_SELFTEST`.

Pour le trafic d'une boutique, c'est sans conséquence. Si le temps de réponse
de `/montures` devenait gênant, le correctif consiste à déplacer les filtres en
état client seul — au prix d'un bref affichage non filtré sur les liens
partagés.

## Risque connu, non applicable ici

Certains projets Next 16 échouent sur Netlify à l'étape de bundling des Edge
Functions, lorsque du middleware importe des dépendances non-ESM. Ce site n'a
**ni middleware ni dépendance en production** en dehors de Next et React :
ce mode d'échec ne le concerne pas.
