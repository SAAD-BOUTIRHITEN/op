# Vidéo du hero — prompts et procédure

## La règle qui compte avant tout

**Générez en haute qualité, mais n'envoyez jamais de 4K au visiteur.**

Un clip de 8 secondes en 4K pèse 30 à 80 Mo. Votre photo de hero actuelle pèse
**6 Ko** sur mobile. Sur la 4G marocaine, une vidéo 4K ferait attendre vos
clients plusieurs secondes et consommerait leur forfait.

La 4K ne sert qu'au **fichier maître** — elle donne de la marge pour recadrer.
Ce qui part sur le site est réencodé : testé ici sur une vidéo d'essai, la
recette ramène un maître de 7,6 Mo à **264 Ko** sur bureau et **176 Ko** sur
mobile. Une vraie vidéo avec du mouvement (cheveux, lumière) pèsera plutôt
2 à 4 fois plus — encore largement raisonnable.

1080p suffit comme maître si l'outil ne propose pas la 4K : le site ne
dépasse jamais 1920 px de large.

---

## Il faut DEUX vidéos, pas une

Un écran de bureau est horizontal, un téléphone vertical. Une seule vidéo
horizontale recadrée sur mobile coupe le sujet — exactement ce qui arrivait au
visage de votre photo actuelle. Générez donc :

- **16:9** pour le bureau
- **9:16** pour le mobile

Le site choisit automatiquement la bonne selon l'écran.

**Pour que les deux se ressemblent :** générez d'abord la 16:9, puis donnez-la
en référence pour la 9:16, comme vous l'avez fait avec Nano Banana pour les
montures.

---

## Prompt 1 — Bureau (16:9)

```
Cinematic editorial video, 8 seconds, designed as a seamless loop.
Locked-off camera with an almost imperceptible slow push-in. No cuts.

A woman in her early thirties wearing thin round gold metal eyeglasses stands
by a tall window inside a warm, minimal optical boutique. Three-quarter
profile, looking softly toward the window light. She stays in the RIGHT THIRD
of the frame for the entire clip.

Motion must be very subtle and natural only: a slow blink, a slight turn of
the head, soft daylight gently shifting across her face and along the gold rim
of the glasses, a few strands of hair moving.

The LEFT TWO-THIRDS of the frame is a deep, warm, dark, uncluttered interior —
near-black with warm brown undertones — with nothing in it. It must stay dark
in EVERY frame: it is reserved for text overlay.

Warm minimal palette: off-white, soft beige, taupe, near-black, muted
champagne gold. Natural directional daylight from the right, soft shadows.
50mm lens, shallow depth of field, subtle film grain, low saturation, warm
neutral colour grading.

The first and last frames should match so the clip loops without a jump.

Negative: no text, no logos, no brand markings on the eyewear, no fast motion,
no camera shake, no zoom bursts, no one entering or leaving the frame, no
bright highlights in the left two-thirds.
Aspect ratio 16:9, highest available resolution.
```

## Prompt 2 — Mobile (9:16)

```
Same woman, same boutique, same light, same eyeglasses and same grading as the
reference video. Vertical composition.

She stands in the RIGHT HALF of the frame, her face in the upper third.
The left half and the lower part of the frame stay dark and low-key in every
frame — text will be placed over them.

Same very subtle motion only: slow blink, slight head turn, daylight shifting
across her face and the gold rim of the glasses.

Designed as a seamless 8-second loop, first and last frames matching.
Locked-off camera, no cuts, no fast motion.

Negative: no text, no logos, no brand markings on the eyewear, no bright
areas behind the left half.
Aspect ratio 9:16, highest available resolution.
```

**Pourquoi autant d'insistance sur la zone sombre :** le texte blanc du hero
doit rester lisible sur *chaque* image de la vidéo, pas seulement la première.
J'ai calibré le voile de lisibilité sur votre photo ; une vidéo avec un éclat
de lumière derrière le titre ferait tomber le contraste sous le seuil pendant
une fraction de seconde. D'où le contrôle image par image ci-dessous.

---

## Quel outil ?

N'importe quel générateur vidéo sérieux : Veo (Google, le même écosystème que
Nano Banana), Kling, Runway, Sora. Choisissez celui qui accepte une vidéo de
référence pour la 9:16 — c'est ce qui garantit la cohérence entre les deux.

Si la boucle « saute » à la jonction fin/début, ne régénérez pas forcément :
un fondu enchaîné de boucle se fabrique à l'encodage.

---

## Et ensuite : envoyez-moi les deux fichiers maîtres

C'est le chemin le plus simple. Je m'occupe de :

1. **l'encodage web** — H.264 pour tous les appareils, iPhone compris, et
   VP9 plus léger pour les navigateurs qui le lisent, sans piste son, avec
   les métadonnées en tête pour que la lecture démarre avant la fin du
   téléchargement ;
2. **l'image de départ** — j'extrais la première image de chaque vidéo pour
   remplacer la photo actuelle. Sans ça, le fondu de la photo vers la vidéo
   montrerait deux scènes différentes : un saut visible ;
3. **le contrôle de contraste image par image** — je mesure le titre sur
   toutes les images de la vidéo, pas seulement la première ;
4. **l'intégration** — une seule ligne dans `content/media.ts`.

Le lecteur est déjà construit et testé. Il attend vos fichiers.

---

## Ce qui est déjà prêt dans le code

Testé dans un vrai navigateur avec une vidéo d'essai :

| | Mobile 390 px | Bureau 1440 px |
|---|---|---|
| Source choisie | 9:16 | 16:9 |
| Lecture automatique | oui | oui |
| Muette, lue dans la page (iPhone) | oui | oui |
| Bouton pause | oui, fonctionnel | oui, fonctionnel |
| Élément LCP | **la photo** | la vidéo |

Et les garde-fous :

- **Réduction des animations activée** → pas de vidéo du tout, la photo reste.
  Testé.
- **Mode économie de données** → pas de vidéo.
- **Autoplay refusé** (mode économie d'énergie de l'iPhone) → la photo reste
  au lieu d'une image figée.
- **La vidéo ne se charge qu'après la page** : elle ne ralentit ni la photo ni
  les polices.
- **Requêtes partielles** (HTTP 206) vérifiées : Safari sur iPhone refuse de
  lire une vidéo sans elles.
- **Bouton pause** : exigé par les règles d'accessibilité WCAG pour tout
  mouvement automatique de plus de cinq secondes.

### Le compromis sur bureau, en toute transparence

Sur mobile, la photo reste l'élément LCP — la mesure que Google utilise pour
juger la vitesse d'affichage. **Sur bureau, la vidéo le devient**, parce
qu'elle apparaît après la photo et la recouvre. Le LCP bureau correspond alors
au moment où la vidéo démarre, plus tard que la photo.

C'est inhérent à toute vidéo d'arrière-plan plein écran, pas un défaut du code.
Avec l'encodage prévu, la vidéo bureau reste légère et démarre vite sur une
connexion fixe. Et le mobile — la majorité de vos visiteurs — n'est pas
concerné.

---

## Ce que je déconseille

Un hero vidéo peut faire très haut de gamme — ou faire « démo technique », ce
que votre cahier des charges interdit explicitement. La différence tient
entièrement à la **retenue du mouvement**. C'est pour ça que les prompts
insistent autant : clignement lent, lumière qui glisse, quelques cheveux. Si la
vidéo générée bouge davantage — caméra qui tourne, zoom marqué, sujet qui
marche — gardez la photo. Elle est déjà très belle.
