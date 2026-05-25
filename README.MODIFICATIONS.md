FR: Intégration du menu "Sources" (Mini Media Player)
=====================================================

Résumé
------
Cette modification ajoute un menu déroulant de sélection de source repris du projet "Mini Media Player" et l'intègre dans la carte `universal-remote-card`.

Fichiers ajoutés / modifiés
---------------------------
- Ajouté: `src/components/urc-source-menu.ts` — nouveau composant Lit qui récupère la liste de sources d'une entité `media_player` et appelle `media_player.select_source`.
- Modifié: `src/universal-remote-card.ts` — import du composant et rendu dynamique d'un menu de sources quand un élément est configuré comme `source` (détection par `tap_action.action === 'source'` ou `type === 'source'`).
- Généré: `dist/universal-remote-card.min.js` + `dist/universal-remote-card.min.js.gz` (build automatique).

Comment ça marche
-----------------
- Le composant lit les attributs `source_list` / `sources` et l'attribut `source` (ou l'état) de l'entité fournie.
- Au clic sur une source, il appelle le service `media_player.select_source` avec `{ entity_id, source }`.
- Le composant se ferme automatiquement quand on clique en dehors.

Exemple d'utilisation dans la configuration de la carte
----------------------------------------------------
Vous pouvez définir un élément personnalisé qui utilise le menu de sources, puis l'insérer dans votre `rows`.

Exemple minimal (YAML de configuration de la carte) :

```yaml
type: custom:universal-remote-card
media_player_id: media_player.living_room_tv
custom_actions:
  - name: sources
    type: source
    entity_id: media_player.living_room_tv
    label: Sources
rows:
  - ['power', 'sources', 'volume_buttons']
```

Explications :
- `custom_actions` définit un élément nommé `sources` de type `source`.
- Quand la carte rencontre l'élément `sources` dans la `rows`, elle rend automatiquement le composant `urc-source-menu` lié à l'entité fournie.

Build & installation
---------------------
Depuis le dossier `universal-remote-card` :

```bash
npm install
npm run build
```

Remarques Windows : si le script `npm run build` échoue sur l'étape `gzip` (commande non trouvée), générez le `.gz` manuellement :

```bash
node -e "const fs=require('fs'),z=require('zlib');fs.createReadStream('dist/universal-remote-card.min.js').pipe(z.createGzip()).pipe(fs.createWriteStream('dist/universal-remote-card.min.js.gz'))"
```

Pour l'installer dans Home Assistant (manuel) :
- déposer `dist/universal-remote-card.min.js` (et optionnellement `.gz`) dans `www/community/universal-remote-card/` de votre configuration Home Assistant.
- ajouter la ressource Lovelace (ressources -> JavaScript module) pointant sur `/local/community/universal-remote-card/universal-remote-card.min.js`.
- ajouter la carte dans un tableau de bord.

Test rapide
----------
1. Ouvrir Lovelace et ajouter la carte modifiée.
2. Vérifier que le bouton "Sources" s'affiche et ouvre le menu.
3. Sélectionner une source : la source doit changer sur l'entité `media_player` (vérifier le service appelé dans les outils de développement si nécessaire).
4. Sur erreur, regarder la console navigateur pour des exceptions et le panneau Services dans Home Assistant pour voir si `media_player.select_source` est accepté.

Options / améliorations possibles
--------------------------------
- Afficher des icônes à côté des sources (si vous voulez, j'ajoute la prise en charge des icônes côté `urc-source-menu`).
- Animation et style (je peux raffiner le CSS pour ressembler au style original du projet Mini Media Player).

Besoin d'autre chose ?
----------------------
Si tu veux, je peux :
- ajouter un exemple entièrement prêt à copier dans la doc principale `README.md` ;
- ajouter des icônes et gérer un attribut `source_icons` ;
- ou pousser directement les fichiers `dist` vers un emplacement HA si tu me donnes le chemin.

*** Fin du fichier de modifications ***
