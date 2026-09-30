# Mise en ligne sur GitHub Pages — luneaoptique.live

Le site est publié par une **GitHub Action** : à chaque `git push` sur `main`,
GitHub fabrique le site statique (`npm run build:pages`) et le met en ligne.
Rien à téléverser à la main.

---

## 1. Créer le dépôt et pousser le code

GitHub Pages est **gratuit uniquement pour un dépôt public** (un dépôt privé
exige un abonnement Pro/Team). Le code ne contient aucun secret : les
coordonnées de la boutique sont de toute façon publiques sur le site.

```bash
cd lunea-optique
git init
git add .
git commit -m "Site Lunéa Optique"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/lunea-optique.git
git push -u origin main
```

## 2. Activer Pages

Dépôt GitHub → **Settings → Pages → Build and deployment → Source :
« GitHub Actions »**. C'est tout : le fichier `.github/workflows/pages.yml`
fait le reste. Suivre l'avancement dans l'onglet **Actions** (2 à 3 minutes).

## 3. Brancher le domaine `luneaoptique.live`

Le fichier `public/CNAME` (contenu : `luneaoptique.live`) est déjà là.

Chez le registrar de `luneaoptique.live`, créer ces enregistrements DNS :

| Type | Nom | Valeur |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `VOTRE-COMPTE.github.io` |

(Ces quatre adresses sont celles documentées par GitHub Pages — à recontrôler
sur leur documentation si le domaine ne répond pas.)

Puis dépôt → **Settings → Pages → Custom domain** : `luneaoptique.live` →
Save, et cocher **Enforce HTTPS** dès que la case est disponible (le
certificat est créé automatiquement, comptez de quelques minutes à une heure).

## 4. Rediriger `luneaoptique.com` et `luneaoptique.me` vers `.live`

**Ce point change par rapport à Netlify.** GitHub Pages ne peut héberger qu'un
seul domaine et ne sait pas rediriger : les règles 301 écrites dans
`next.config.ts` ne fonctionnent que sur un serveur Next (Netlify, Vercel…).
Elles sont donc **désactivées** dans la version GitHub Pages.

La redirection se règle **chez le registrar** de chaque ancien domaine, avec
l'option « redirection / URL forwarding » :

- type **permanent (301)** — pas « temporaire » (302) ;
- destination `https://luneaoptique.live` ;
- si le registrar propose « conserver le chemin » (*forward path*), l'activer,
  sinon `/montures/xyz` renverra vers l'accueil ;
- à faire pour `.com` **et** `.me`, et pour leurs `www` si le registrar les
  gère séparément.

Si le registrar n'offre pas de redirection 301 fiable, la solution gratuite
habituelle est de passer les DNS de ces deux domaines par Cloudflare et d'y
créer une règle de redirection (« Redirect Rules »), sans toucher au site.

## 5. Formulaire de contact (facultatif)

GitHub Pages n'exécute aucun code serveur : le formulaire n'envoie plus par
`/api/contact` mais **directement depuis le navigateur** vers votre webhook
(Formspree, Web3Forms…). Dépôt → **Settings → Secrets and variables → Actions
→ onglet Variables → New repository variable** :

- nom : `CONTACT_WEBHOOK_URL`
- valeur : l'adresse fournie par le service (ex. `https://formspree.io/f/xxxx`)

Cette adresse devient visible dans le code du site — c'est normal pour ces
services, dont l'adresse est publique par conception. Sans cette variable, le
formulaire est masqué et la page propose WhatsApp et le téléphone.
Relancer un déploiement après l'avoir ajoutée (onglet Actions → Re-run).

## 6. Vérifications après la mise en ligne

```bash
curl -s https://luneaoptique.live/robots.txt          # Allow: /
curl -s https://luneaoptique.live/sitemap.xml | grep -c "<loc>"   # 23
curl -s -o /dev/null -w "%{http_code}\n" https://luneaoptique.live/montures/nexiste-pas   # 404
curl -sI https://luneaoptique.com/ | grep -i "^HTTP\|^location"   # 301 -> https://luneaoptique.live/
curl -sI https://luneaoptique.me/  | grep -i "^HTTP\|^location"   # 301 -> https://luneaoptique.live/
```

Puis soumettre `https://luneaoptique.live/sitemap.xml` dans Google Search
Console.

## Ce qui est différent de la version Netlify

| | Netlify | GitHub Pages |
|---|---|---|
| Redirections `.com`/`.me` → `.live` | dans le code (`next.config.ts`) | **chez le registrar** |
| En-têtes de sécurité (`X-Frame-Options`…) | posés par le code | **absents** (HTTPS et HSTS sont gérés par GitHub) |
| Images | optimisées à la demande (AVIF/WebP) | WebP pré-générés au build (5 tailles) |
| Formulaire de contact | via `/api/contact` | direct vers le webhook |
| Catalogue `/montures?marque=…` | lu côté serveur | lu dans le navigateur (même résultat à l'écran) |
| Ancien lien `?categorie=…` | redirigé en 301 | **plus redirigé** (ces liens n'ont jamais été publiés) |
| Coût | gratuit (limites) | gratuit, dépôt public |

Le même code sert les deux : `npm run build` produit la version Netlify,
`npm run build:pages` la version GitHub Pages (dossier `out/`).

## Tester en local avant de pousser

```bash
npm run build:pages
npx serve out          # puis ouvrir l'adresse affichée
```
