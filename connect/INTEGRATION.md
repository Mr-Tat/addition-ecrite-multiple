# Intégration Connect — Addition écrite multiple (préparation isolée)

Statut : **non connecté**, branche de préparation. Le site classique `main/index.html` reste intact.
Clé stable : `addition-ecrite-multiple` ; schéma de l'adaptateur : v1.

## Observé, à confirmer dans les sources originales
Le HTML `index.html` annonce une sortie générée « clean-v1 », version visible v3.2.1.
Éléments visibles : Entraînement, Classique (4, 10, 20 calculs), Mort subite.
Les éventuels autres modes ou niveaux doivent être confirmés sur le vrai moteur avant branchement.
L'adaptateur JS ne prend en charge que les résultats **finaux** classique/mort subite avec 3 niveaux (hypothèse temporaire héritée du pilote).
Aucun calcul d'XP côté client.

## Contrat et sécurité
- Une partie terminée = un événement unique (`eventId` UUID), jamais un appel par calcul.
- Synchronisation future via `game-record`, `expectedRevision` et `expectedResetEpoch`, avec file d'attente bornée et idempotence côté serveur.
- Ne jamais créditer d'XP sans règles serveur spécifiques à cette application, validées pédagogiquement.
- Prévoir états, jalons, historiques et reprises **isolés par app_key** ; refuser les événements d'une époque antérieure à une remise à zéro.
- Recommencement uniquement après vérification de permission professeur côté serveur ; archivage atomique et conservation des XP historiques.
- Aucune modification du classique, de ses clés localStorage, de son Master Mode et de ses préférences.
- Ne pas publier dans `hub-catalog.json` tant que tous les points ci-dessus ne sont pas raccordés et testés.

## Tests locaux
`node --experimental-default-type=module connect/adapter.test.mjs` (Node compatible ESM).
Les tests couvrent les meilleures performances conservées, l'indépendance des niveaux, les valeurs malformées et les modes non autorisés.

## Travail restant avant première partie Connect
1. Retrouver les **sources génératrices** et les clés historiques ; confirmer le contrat des modes/niveaux.
2. Ajouter une interface / un lanceur Connect commun réutilisable, avec correspondances des records du jeu réel.
3. Étendre l'allowlist de `connect-results`, les validateurs d'état, le résumé professeur et les RPC XP/recommencement de façon compatible avec `addition-ecrite-simple`.
4. Documenter et valider un barème XP **propre au jeu**, puis tests isolés sur comptes fictifs.
5. Publier l'entrée HUB et la projection uniquement à l'issue de la validation.
