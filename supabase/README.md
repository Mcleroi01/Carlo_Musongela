# Brancher le portfolio sur Supabase (procédure complète)

1. **Projet** : sur supabase.com, créez (ou restaurez) le projet. Dans *Project Settings → API*, copiez l'URL du projet et la clé *publishable*.
2. **Variables** : mettez-les dans `.env` (local) **et** dans les variables d'environnement de Netlify (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`), puis relancez `npm run dev` / redéployez.
3. **Schéma** : dans le SQL Editor, exécutez dans l'ordre `migrations/20261013143000_create_portfolio_schema.sql` puis `migrations/20261118120000_add_content_translations.sql`.
4. **Administrateur** : suivez la section « Étapes manuelles » ci-dessous (création du compte + ligne dans `admin_users`).
5. **Contenu initial** (facultatif) : `seed_static_portfolio.sql` puis `seed_cv_and_translations.sql`, chacun d'abord en mode `preview`, puis `apply`.
6. **Gestion** : connectez-vous sur `/admin` pour modifier profil, projets, services, expériences, formations et compétences, en anglais et en français.

Tant que Supabase est injoignable, le site public affiche son contenu intégré ; les messages d'état « [dev] » n'apparaissent qu'en développement.

# Premier administrateur Supabase

Cette procédure décrit l'amorçage manuel du premier administrateur. Elle ne crée aucun compte et n'exécute aucune migration par elle-même. Aucun mot de passe, jeton ou clé secrète ne doit être placé dans ce dépôt ou dans le frontend.

## Protections prévues par la migration

- `public.is_admin()` vérifie uniquement l'identité de la session courante (`auth.uid()`). Elle ne prend pas d'UUID fourni par l'appelant et ne permet donc pas d'interroger le statut d'un autre compte.
- La fonction est `SECURITY DEFINER`, utilise un `search_path` vide et référence ses objets avec leur schéma. Dans Supabase, elle doit appartenir au rôle privilégié qui exécute la migration (habituellement `postgres`) pour lire `admin_users` sans retomber dans les règles RLS de cette table.
- RLS est activée sur `admin_users`. La seule politique API est une lecture pour les administrateurs déjà actifs. Les rôles `PUBLIC`, `anon`, `authenticated` et `service_role` n'ont aucun privilège sur cette table; `authenticated` reçoit explicitement seulement `SELECT`. Il n'existe aucune politique d'insertion, de modification ou de suppression. L'accès propriétaire à la base (SQL Editor exécuté avec le rôle privilégié) reste le seul moyen prévu pour créer ou révoquer une affectation administrateur.
- La migration accorde explicitement `SELECT` aux rôles API `anon` et `authenticated` sur les tables de contenu, puis `INSERT`, `UPDATE` et `DELETE` à `authenticated`. Ces droits SQL ne suffisent pas à écrire : les politiques RLS autorisent ces opérations uniquement lorsque `public.is_admin()` confirme la session courante. La lecture publique est filtrée par les politiques de publication.
- L'amorçage et les changements ultérieurs de `admin_users` doivent donc être exécutés par le propriétaire/opérateur privilégié du projet depuis le SQL Editor. Ne donnez pas de clé `service_role` à l'application ni aux utilisateurs.

La fonction évite la récursion RLS parce que son propriétaire privilégié lit la table sous `SECURITY DEFINER`, sans appliquer les politiques de l'appelant. Le rôle propriétaire de la table peut naturellement contourner RLS; gardez la migration et le SQL Editor réservés aux propriétaires/opérateurs de confiance. N'altérez pas le propriétaire de la fonction ni ses privilèges après migration.

## Variables d'environnement du frontend

Pour une future connexion du frontend, copiez `.env.example` vers `.env.local`, puis renseignez `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` avec les valeurs publiques du projet. La clé publishable (anciennement clé `anon`) est conçue pour être visible dans le navigateur; la sécurité doit donc reposer sur RLS. Ne mettez jamais une clé `service_role`, un mot de passe ou un secret dans une variable `VITE_*`. Le fichier `.env.local` est ignoré par Git (`*.local`).

Le code local prépare des lectures publiques de projets, services et profil, ainsi que des services de lecture pour les expériences, formations, compétences et promotions. Sans configuration ou si une requête échoue (par exemple avant l'application de la migration), les sections déjà connectées gardent leur contenu statique et indiquent le recours au contenu statique. Une réponse réussie sans lignes publiées reste vide; elle n'est pas remplacée par des résultats fictifs. Les lectures utilisent la clé publishable et restent soumises à RLS. Les expériences, formations, compétences et promotions ne sont pas encore affichées dans de nouvelles sections du site.

## Étapes manuelles dans le tableau de bord

1. Connectez-vous au tableau de bord Supabase avec le compte propriétaire. Vérifiez le nom du projet avant toute action.
2. Dans les réglages Auth, désactivez les inscriptions publiques si aucun compte public n'est nécessaire.
3. Dans **Authentication → Users**, créez ou invitez l'administrateur avec une adresse que vous contrôlez. Utilisez un mot de passe unique et fort, puis terminez la confirmation de l'adresse. Le compte doit exister et être confirmé avant l'étape SQL.
4. Appliquez `migrations/20261013143000_create_portfolio_schema.sql` au projet cible depuis une session propriétaire/privilégiée. Cette opération crée le schéma et les buckets; elle ne crée aucun administrateur. Vérifiez le projet et la migration avant de l'exécuter.
5. Dans **Authentication → Users**, copiez l'UUID du compte confirmé. Revérifiez qu'il correspond à votre compte.
6. Dans le **SQL Editor** du même projet, sous le rôle privilégié du propriétaire, remplacez le marqueur par l'UUID copié puis exécutez :

   ```sql
   insert into public.admin_users (user_id, role, is_active)
   select id, 'admin', true
   from auth.users
   where id = 'UUID_DU_COMPTE_CONFIRME'::uuid
     and email_confirmed_at is not null;
   ```

   La requête insère une seule ligne si le compte Auth existe et est confirmé. Attendez un résultat d'une ligne. Si aucune ligne n'est insérée, arrêtez-vous et vérifiez le compte et son UUID dans le tableau de bord.
7. Vérifiez le résultat dans le SQL Editor. Cette requête affiche aussi l'adresse e-mail : ne partagez pas son résultat.

   ```sql
   select u.id, u.email, a.role, a.is_active
   from auth.users as u
   join public.admin_users as a on a.user_id = u.id
   where u.id = 'UUID_DU_COMPTE_CONFIRME'::uuid;
   ```

8. Protégez les comptes propriétaire et administrateur avec un mot de passe unique et la MFA si disponible. Gardez les accès propriétaires séparés des accès applicatifs.

## Gestion après l'amorçage

Un administrateur actif peut gérer les contenus dans `projects`, `formations`, `experiences`, `skills`, `services` et `promotions`, ainsi que les profils, selon les politiques de la migration. Un utilisateur authentifié non administrateur peut recevoir les privilèges SQL nécessaires aux requêtes de contenu, mais RLS bloque ses écritures et limite ses lectures aux contenus publics. Il peut lire les lignes de `admin_users` uniquement si RLS l'autorise (administrateur actif); il ne peut pas s'y ajouter, s'y promouvoir, modifier les statuts ni supprimer des comptes via l'API. Le propriétaire doit effectuer toute modification d'affectation depuis le SQL Editor.

Pour révoquer l'accès d'un administrateur, le propriétaire peut désactiver sa ligne dans le SQL Editor :

```sql
update public.admin_users
set is_active = false
where user_id = 'UUID_DU_COMPTE_A_REVOQUER'::uuid;
```

Les fichiers du bucket `portfolio-public` sont lisibles publiquement; seuls les administrateurs actifs peuvent les écrire. Le bucket `portfolio-private` est réservé aux administrateurs actifs pour la lecture et l'écriture. Ne placez aucun document privé dans le bucket public.

## Limites de vérification

Voir aussi [SEEDING.md](./SEEDING.md) pour l'aperçu et l'import manuel des données statiques du portfolio.

La migration et les règles ont été relues statiquement. Aucun PostgreSQL local, `psql`, Docker ou Supabase CLI n'est disponible dans l'environnement de travail pour exécuter des tests SQL. Rien n'a été testé sur le projet distant. La migration suppose que le rôle Supabase `service_role` existe. Avant toute connexion du frontend, vérifiez dans le tableau de bord que la migration s'est appliquée, que la fonction appartient au rôle privilégié attendu, que `admin_users` n'a aucune politique d'écriture et que les politiques des tables de contenu et de Storage sont présentes.
