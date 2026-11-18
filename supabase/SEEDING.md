# Import manuel des données statiques

Le fichier `seed_static_portfolio.sql` contient le staging, l'aperçu et l'import idempotent des données statiques retrouvées dans le dépôt. Il n'est jamais exécuté par l'application. Il fonctionne dans le SQL Editor du projet avec un rôle propriétaire/opérateur autorisé à écrire. Il n'utilise pas de clé `service_role`.

## Données prévues

- Le profil public existant : nom, titre, bio, localisation, langues, liens GitHub/LinkedIn et numéro WhatsApp déjà présent dans l'interface.
- Les six projets de `src/data/projects.ts`, en conservant les textes, technologies, liens, statuts et ordre. Ils sont marqués publiés parce qu'ils sont déjà affichés publiquement. Les URLs d'images restent dans `cover_image_path`; aucun fichier n'est téléversé.
- Les quatre offres explicitement listées dans la section publique : « Web App Development », « Mobile App Development », « API Development & Integration » et « Custom Systems & Solutions ». Leur description reste `NULL`, car aucune description par offre n'existe.
- Les 17 technologies/outils visibles dans « Tools I Use », avec leurs catégories et leur ordre. Ils sont marqués publiés puisqu'ils sont déjà affichés publiquement.

Aucune donnée structurée de formation, d'expérience ou de promotion n'a été trouvée; le script n'insère donc aucune ligne dans ces tables. Les spécialisations (« Marketplace Development », etc.) ne sont pas décrites comme des offres séparées et sont exclues. Les quatre logos clients sont uniquement des URLs d'images, sans nom de client associé exploitable. Le CV et la photo restent des fichiers locaux; le seeder ne les copie pas vers Storage.

La description de Sabedoria contient déjà le texte mal encodé `Angolaâ€™s` dans la source. Le seeder le conserve exactement; corrigez la source séparément après validation éditoriale si nécessaire.

## Exécution prudente

1. Appliquez puis vérifiez `migrations/20261013143000_create_portfolio_schema.sql`. Le seeder dépend des tables `profiles`, `projects`, `services` et `skills`, ainsi que de leurs contraintes.
2. Ouvrez le SQL Editor du bon projet avec le compte propriétaire/opérateur. N'utilisez pas le client frontend.
3. Ouvrez `seed_static_portfolio.sql`, copiez **tout** le fichier dans l'éditeur et exécutez-le en laissant le mode initial `preview`. Le rapport précise pour chaque clé si la ligne serait insérée ou ignorée parce qu'elle existe déjà. Ce mode ne modifie aucune table permanente.
4. Vérifiez les contenus et les conflits signalés. Les projets, offres et compétences provenant des sections publiques seront publiés lors de l'import; le profil est marqué `is_public = true`. Ne passez pas à l'étape suivante si cette visibilité ne correspond plus à votre intention.
5. Après revue, changez uniquement `'preview'` en `'apply'` sur la première instruction SQL, relisez le fichier entier puis exécutez-le dans le SQL Editor. Le script insère les nouvelles lignes et signale les quantités; il ne met à jour ni ne supprime aucune ligne existante.
6. Remettez le fichier en mode `preview`. Vous pouvez le relancer sans doublons : les clés déjà présentes sont ignorées.

## Identifiants et limites

Le profil utilise un UUID fixe et refuse d'insérer s'il trouve déjà cet UUID ou un profil au nom `Carlo Musongela`. Les projets et services utilisent leur `slug`; les compétences utilisent la contrainte unique `(name, category)`. Les conflits sont tous traités par `DO NOTHING` : si une ligne présente sous la même clé contient d'autres données, elle n'est pas écrasée et nécessite une comparaison manuelle.

L'aperçu consulte les tables distantes en lecture dans le SQL Editor; il faut donc que la migration ait déjà été appliquée. Le script n'a pas été exécuté localement contre PostgreSQL ni sur Supabase, et aucun import n'a été lancé. Une vérification avec l'instance réelle reste nécessaire avant tout mode `apply`.
