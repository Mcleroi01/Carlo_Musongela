-- Données du CV (public/documents/Musongela_Carlo_CV.pdf) + traductions françaises.
-- Prérequis : les deux migrations de supabase/migrations appliquées, puis seed_static_portfolio.sql.
-- MODE SÛR PAR DÉFAUT : aperçu uniquement. Passez 'preview' à 'apply' pour écrire.
-- Le script n'écrase rien : les expériences/formations déjà présentes (même poste + entreprise,
-- même titre + établissement) sont ignorées, et les traductions ne sont ajoutées qu'aux lignes
-- dont la colonne `translations` est encore vide.
-- Le CV ne donne que des années : les dates sont enregistrées au 1er janvier / 31 décembre,
-- et le site n'affiche que l'année.
select set_config('portfolio.cv_seed_mode', 'preview', false);

create temporary table if not exists cv_seed_experiences (
  position text, company text, start_date date, end_date date, display_order int,
  description text, fr jsonb
);
truncate cv_seed_experiences;
insert into cv_seed_experiences values
('Freelance Fullstack Developer', 'Independent', '2024-01-01', '2025-12-31', 1,
 E'Design and deliver custom web and mobile apps (Laravel, React, Flutter) from client needs.\nBuild secure REST APIs and structure SQL databases following MVC.\nDesign responsive interfaces in Figma for a clear, consistent experience.\nDeploy, maintain and evolve products in production (Git, Firebase, AWS).',
 jsonb_build_object('position', 'Développeur Fullstack Freelance', 'company', 'Indépendant', 'description',
 E'Concevoir et livrer des applications web et mobiles sur mesure (Laravel, React, Flutter) à partir des besoins des clients.\nDévelopper des API REST sécurisées et structurer des bases de données SQL selon l''architecture MVC.\nConcevoir des interfaces responsives sous Figma pour une expérience claire et cohérente.\nDéployer, maintenir et faire évoluer les solutions en production (Git, Firebase, AWS).')),
('Fullstack Web Developer', 'Eyano Santé', '2023-01-01', '2023-12-31', 2,
 E'Developed modules of a hospital management web app, back-end to UI.\nModelled and administered the database for reliable, consistent data.\nTurned medical and administrative staff needs into concrete features.',
 jsonb_build_object('position', 'Développeur Web Fullstack', 'description',
 E'Développer les modules d''une application web de gestion hospitalière, du back-end à l''interface.\nModéliser et administrer la base de données pour des informations fiables et cohérentes.\nTraduire les besoins du personnel médical et administratif en fonctionnalités concrètes.')),
('Digital Video Editor (Internship)', 'RTNC2', '2021-01-01', '2022-12-31', 3,
 E'Edited and finalised audiovisual content for national TV broadcast.\nMet tight deadlines in a fast-paced newsroom environment.',
 jsonb_build_object('position', 'Monteur Numérique (Stage)', 'description',
 E'Monter et finaliser des contenus audiovisuels destinés à la diffusion télévisuelle nationale.\nTenir des délais serrés dans une rédaction au rythme soutenu.'));

create temporary table if not exists cv_seed_formations (
  title text, institution text, end_date date, display_order int, description text, fr jsonb
);
truncate cv_seed_formations;
insert into cv_seed_formations values
('Bachelor in Computer Technology', 'ISP/Gombe', '2025-12-31', 1, 'With honours',
 jsonb_build_object('title', 'Licence en Technologie Informatique', 'description', 'Mention Bien')),
('Fullstack Developer', 'Orange Digital Center', '2025-12-31', 2, 'Design and delivery of a mobile and web application project.',
 jsonb_build_object('title', 'Developer FullStack', 'description', 'Conception et réalisation d''un projet d''application mobile et web.')),
('Fullstack Developer Master Class', 'Letecode Academy', '2023-12-31', 3, 'Web interface development and dynamic feature integration.',
 jsonb_build_object('title', 'Master Class Developer FullStack', 'description', 'Développement d''interfaces web et intégration de fonctionnalités dynamiques.')),
('Digital Editor', 'ICA (RTNC)', '2021-12-31', 4, 'Editing and production of audiovisual content for television.',
 jsonb_build_object('title', 'Monteur Numérique', 'description', 'Montage et réalisation de contenus audiovisuels pour la télévision.')),
('Graphic Design Master Class', 'Art Ndaka', '2020-12-31', 5, 'An innovative graphic design project.',
 jsonb_build_object('title', 'Master Class Design Graphique', 'description', 'Réalisation d''un projet de design graphique innovant.'));

-- Traductions françaises des contenus créés par seed_static_portfolio.sql (par slug).
create temporary table if not exists cv_seed_project_fr (slug text primary key, fr jsonb);
truncate cv_seed_project_fr;
insert into cv_seed_project_fr values
('aiglevente', jsonb_build_object('short_description', 'Marketplace complète avec gestion des vendeurs, traitement des paiements et statistiques en temps réel.', 'duration', '4 mois', 'completed_date', 'Mars 2025')),
('naningana', jsonb_build_object('short_description', 'Un jeu mobile thérapeutique conçu avec une clinique médicale. Il aide les adultes à suivre les mouvements prescrits par un médecin pour leur rééducation physique et mentale.', 'duration', '5 mois', 'completed_date', 'Octobre 2024')),
('restaurant-management-api', jsonb_build_object('short_description', 'API REST pour la gestion de restaurants : menus, commandes et suivi des stocks.', 'duration', '3 mois', 'completed_date', 'Septembre 2023')),
('internal-crm-system', jsonb_build_object('short_description', 'CRM sur mesure pour le suivi des ventes, la gestion des clients et les rapports automatisés.', 'duration', '6 mois', 'completed_date', 'Prévu mars 2024')),
('sabedoria-kilumbu', jsonb_build_object('short_description', 'Une application éducative qui valorise le patrimoine culturel de l''Angola : articles, médias et faits sur l''histoire, les langues, les traditions et les symboles nationaux.', 'client', 'Projet personnel', 'duration', '1 mois', 'completed_date', 'Mars 2025')),
('momekano', jsonb_build_object('short_description', 'Une plateforme numérique pour les concours et les entretiens : les jurés votent en temps réel et les candidats passent des évaluations et des quiz en ligne.', 'duration', '5 mois', 'completed_date', 'Prévu juin 2024'));

create temporary table if not exists cv_seed_service_fr (slug text primary key, fr jsonb);
truncate cv_seed_service_fr;
insert into cv_seed_service_fr values
('web-app-development', jsonb_build_object('title', 'Développement d''applications web')),
('mobile-app-development', jsonb_build_object('title', 'Développement d''applications mobiles')),
('api-development-integration', jsonb_build_object('title', 'Développement et intégration d''API')),
('custom-systems-solutions', jsonb_build_object('title', 'Systèmes et solutions sur mesure'));

-- Aperçu
select 'experiences' as table_name, e.position || ' @ ' || e.company as record_key,
  case when exists (select 1 from public.experiences x where x.position = e.position and x.company = e.company)
       then 'SKIP — déjà présente' else 'WOULD INSERT — publiée' end as action
from cv_seed_experiences e
union all
select 'formations', f.title || ' @ ' || f.institution,
  case when exists (select 1 from public.formations x where x.title = f.title and x.institution = f.institution)
       then 'SKIP — déjà présente' else 'WOULD INSERT — publiée' end
from cv_seed_formations f
union all
select 'projects.translations', p.slug,
  case when not exists (select 1 from public.projects x where x.slug = p.slug) then 'SKIP — projet absent'
       when exists (select 1 from public.projects x where x.slug = p.slug and x.translations <> '{}'::jsonb) then 'SKIP — traduction déjà saisie'
       else 'WOULD UPDATE — ajoute la version française' end
from cv_seed_project_fr p
union all
select 'services.translations', s.slug,
  case when not exists (select 1 from public.services x where x.slug = s.slug) then 'SKIP — service absent'
       when exists (select 1 from public.services x where x.slug = s.slug and x.translations <> '{}'::jsonb) then 'SKIP — traduction déjà saisie'
       else 'WOULD UPDATE — ajoute la version française' end
from cv_seed_service_fr s
union all
select 'profiles.translations', 'Carlo Musongela',
  case when exists (select 1 from public.profiles where lower(display_name) = lower('Carlo Musongela') and translations = '{}'::jsonb)
       then 'WOULD UPDATE — ajoute le titre et la bio en français' else 'SKIP — profil absent ou déjà traduit' end
order by 1, 2;

do $$
declare n int;
begin
  if current_setting('portfolio.cv_seed_mode', true) <> 'apply' then
    raise notice 'MODE APERÇU : aucune donnée modifiée. Passez le mode à apply en haut du fichier pour écrire.';
    return;
  end if;

  insert into public.experiences (position, company, description, start_date, end_date, is_current, display_order, published_at, translations)
  select e.position, e.company, e.description, e.start_date, e.end_date, false, e.display_order, now(), jsonb_build_object('fr', e.fr)
  from cv_seed_experiences e
  where not exists (select 1 from public.experiences x where x.position = e.position and x.company = e.company);
  get diagnostics n = row_count; raise notice 'experiences: % insérée(s)', n;

  insert into public.formations (title, institution, description, end_date, status, display_order, published_at, translations)
  select f.title, f.institution, f.description, f.end_date, 'completed', f.display_order, now(), jsonb_build_object('fr', f.fr)
  from cv_seed_formations f
  where not exists (select 1 from public.formations x where x.title = f.title and x.institution = f.institution);
  get diagnostics n = row_count; raise notice 'formations: % insérée(s)', n;

  update public.projects p set translations = jsonb_build_object('fr', s.fr)
  from cv_seed_project_fr s where p.slug = s.slug and p.translations = '{}'::jsonb;
  get diagnostics n = row_count; raise notice 'projects: % traduction(s) ajoutée(s)', n;

  update public.services d set translations = jsonb_build_object('fr', s.fr)
  from cv_seed_service_fr s where d.slug = s.slug and d.translations = '{}'::jsonb;
  get diagnostics n = row_count; raise notice 'services: % traduction(s) ajoutée(s)', n;

  update public.profiles set translations = jsonb_build_object('fr', jsonb_build_object(
    'headline', 'Développeur Fullstack',
    'bio', 'Développeur fullstack avec de solides bases en design, passionné par la création d''expériences utilisateur fluides. Je m''épanouis à la croisée de la créativité et de la fonctionnalité, spécialisé dans les applications web et mobiles.'))
  where lower(display_name) = lower('Carlo Musongela') and translations = '{}'::jsonb;
  get diagnostics n = row_count; raise notice 'profiles: % traduction(s) ajoutée(s)', n;
end
$$;
