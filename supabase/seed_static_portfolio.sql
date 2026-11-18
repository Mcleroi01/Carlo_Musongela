-- Import initial des données statiques du portfolio.
-- MODE SÛR PAR DÉFAUT : aperçu uniquement. Pour importer, changer la valeur
-- ci-dessous de 'preview' à 'apply' après avoir contrôlé le rapport et la migration.
select set_config('portfolio.static_seed_mode', 'preview', false);

-- Staging temporaire dans la session SQL Editor; aucun contenu permanent n'est écrit ici.
create temporary table if not exists portfolio_seed_projects (
  slug text primary key,
  title text not null,
  short_description text,
  long_description text,
  category text not null,
  status text not null,
  client text,
  duration text,
  team_size integer,
  completed_date text,
  technologies text[] not null,
  cover_image_path text,
  github_url text,
  live_url text,
  display_order integer not null
);
truncate table portfolio_seed_projects;
insert into portfolio_seed_projects values
('aiglevente', 'AigleVente', 'Full-featured marketplace with vendor management, payment processing, and real-time analytics.', 'A comprehensive e-commerce marketplace platform that connects multiple vendors with customers. Features include advanced product catalog management, secure payment processing with Stripe integration, real-time order tracking, vendor dashboard with analytics, customer review system, and mobile-responsive design. The platform handles thousands of products and processes hundreds of transactions daily.', 'web_app', 'completed', 'Olympic games', '4 months', 2, 'Mars 2025', ARRAY['Laravel','React.js','MySQL','Stripe API','Redis','Docker'], 'https://aiglevente.com/img/logo/logo_sans_bg.png', 'https://github.com/Mcleroi01/aigle-vente.git', 'https://aiglevente.com/', 1),
('naningana', 'Naningana', 'A therapeutic mobile game designed in collaboration with a medical clinic. Helps adults follow physical movements prescribed by a doctor for mental and physical rehabilitation.', 'A sophisticated hotel booking mobile application built with Flutter, offering seamless user experience across iOS and Android platforms. Features include real-time room availability, interactive maps, secure payment processing, booking management, push notifications, offline capability, and integration with hotel management systems. The app serves over 10,000 active users and processes bookings for 200+ hotels.', 'mobile_app', 'completed', 'Monica Tshitenga', '5 months', 2, 'October 2024', ARRAY['Flutter','Dart','Firebase'], 'https://naningana.com/splash/img/dark-1x.png', 'https://github.com/Mcleroi01/naningana2.git', 'https://naningana.com/', 2),
('restaurant-management-api', 'Restaurant Management API', 'RESTful API for restaurant operations including menu management, orders, and inventory tracking.', 'A robust RESTful API system designed for restaurant management operations. The API handles menu management with dynamic pricing, order processing with real-time kitchen notifications, inventory tracking with automatic reorder alerts, staff management, customer loyalty programs, and comprehensive reporting. Built with Laravel and optimized for high-performance operations, serving multiple restaurant chains with 99.9% uptime.', 'api', 'completed', 'FoodChain Enterprises', '3 months', 2, 'September 2023', ARRAY['Laravel','PHP','PostgreSQL','Redis','JWT','Swagger'], 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://github.com/mcleroi01/restaurant-api', 'https://restaurettetemplate.netlify.app', 3),
('internal-crm-system', 'Internal CRM System', 'Custom CRM solution for sales tracking, customer management, and automated reporting.', 'A comprehensive Customer Relationship Management system tailored for mid-size businesses. Features include lead management with automated scoring, sales pipeline visualization, customer communication history, task automation, email marketing integration, advanced reporting with custom dashboards, and role-based access control. The system has improved sales efficiency by 40% and manages over 5,000 customer records.', 'system', 'in_progress', 'SalesPro Ltd', '6 months', 4, 'Expected March 2024', ARRAY['Laravel','Vue.js','MySQL','Chart.js','Mailgun','Docker'], 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://github.com/mcleroi01/crm-system', null, 4),
('sabedoria-kilumbu', 'Sabedoria (Kilumbu)', 'An educational app highlighting Angolaâ€™s cultural heritage. Includes articles, media, and facts about Angolan history, languages, traditions, and national symbols.', 'A comprehensive fitness tracking mobile application that helps users achieve their health goals. Features include workout planning with video demonstrations, nutrition tracking with barcode scanning, progress visualization with detailed analytics, social challenges with friends, wearable device integration, and personalized coaching recommendations. The app has garnered over 50,000 downloads with a 4.8-star rating.', 'mobile_app', 'completed', 'Personal Project', '1 months', 1, 'March 2025', ARRAY['Flutter','Dart','Firebase'], 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://github.com/Mcleroi01/kilumbu.git', 'https://apps.apple.com/app/fitlife-tracker/id123456789', 5),
('momekano', 'Momekano', 'A digital platform designed for competitions and interviews, allowing jury members to vote in real time and candidates to take online evaluations and quizzes.', 'A modern real estate portal connecting property buyers, sellers, and agents. Features include advanced property search with filters, interactive maps with neighborhood data, virtual tour integration, mortgage calculator, agent profiles with ratings, lead management system, and mobile-responsive design. The platform lists over 10,000 properties and serves 500+ real estate agents across multiple cities.', 'web_app', 'planned', 'Orange digital center', '5 months', 7, 'Expected June 2024', ARRAY['React.js','Laravel','MySQL','Google Maps','AWS S3','Elasticsearch'], 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800', null, null, 6);

create temporary table if not exists portfolio_seed_services (
  slug text primary key,
  title text not null,
  display_order integer not null
);
truncate table portfolio_seed_services;
insert into portfolio_seed_services values
('web-app-development', 'Web App Development', 1),
('mobile-app-development', 'Mobile App Development', 2),
('api-development-integration', 'API Development & Integration', 3),
('custom-systems-solutions', 'Custom Systems & Solutions', 4);

create temporary table if not exists portfolio_seed_skills (
  name text not null,
  category text not null,
  display_order integer not null,
  primary key (name, category)
);
truncate table portfolio_seed_skills;
insert into portfolio_seed_skills values
('React.js','Frontend',1),('Flutter','Frontend',2),('HTML5','Frontend',3),('CSS3','Frontend',4),('JavaScript','Frontend',5),
('Laravel','Backend',1),('PHP','Backend',2),('Dart','Backend',3),('Firebase','Backend',4),('Node.js','Backend',5),
('MySQL','Database',1),('PostgreSQL','Database',2),('Firestore','Database',3),
('Git','Tools',1),('Docker','Tools',2),('VS Code','Tools',3),('Figma','Tools',4);

-- État de prévisualisation : la clé naturelle indique si la ligne existe déjà.
select 'profiles' as table_name, 'Carlo Musongela' as record_key,
  case when exists (select 1 from public.profiles where id = '9e4e8876-694f-5fe4-a1fd-74eb8b46430c'::uuid or lower(display_name) = lower('Carlo Musongela'))
       then 'SKIP — profil correspondant déjà présent (aucune mise à jour automatique)'
       else 'WOULD INSERT — profil public' end as action
union all
select 'projects', s.slug,
  case when exists (select 1 from public.projects p where p.slug = s.slug)
       then 'SKIP — slug déjà présent (aucune mise à jour automatique)'
       else 'WOULD INSERT — publié, car déjà visible dans le portfolio actuel' end
from portfolio_seed_projects s
union all
select 'services', s.slug,
  case when exists (select 1 from public.services d where d.slug = s.slug)
       then 'SKIP — slug déjà présent (aucune mise à jour automatique)'
       else 'WOULD INSERT — publié; description laissée NULL car absente de la source' end
from portfolio_seed_services s
union all
select 'skills', s.category || '/' || s.name,
  case when exists (select 1 from public.skills k where k.name = s.name and k.category = s.category)
       then 'SKIP — compétence déjà présente (aucune mise à jour automatique)'
       else 'WOULD INSERT — publié, car visible dans la section publique actuelle' end
from portfolio_seed_skills s
order by table_name, record_key;

-- Le bloc écrit uniquement si le mode a été explicitement changé en 'apply'.
-- Il n'efface et ne met à jour aucune ligne existante.
do $$
declare
  inserted_count integer;
  inserted_total integer := 0;
begin
  if current_setting('portfolio.static_seed_mode', true) <> 'apply' then
    raise notice 'MODE APERÇU : aucune donnée permanente modifiée. Pour appliquer, changez uniquement le mode en haut du fichier en apply puis relisez les commandes.';
    return;
  end if;

  insert into public.profiles (
    id, display_name, headline, bio, location, languages, github_url,
    linkedin_url, whatsapp_number, is_public
  )
  select
    '9e4e8876-694f-5fe4-a1fd-74eb8b46430c'::uuid,
    'Carlo Musongela', 'Fullstack Developer',
    'A fullstack developer with solid foundations in design, passionate about crafting seamless user experiences. I thrive at the intersection of creativity and functionality, specializing in web and mobile applications.',
    'Kinshasa, DR CONGO', ARRAY['EN','FR','PT'],
    'https://github.com/Mcleroi01', 'https://linkedin.com/in/carlo-musongela-bb024b202',
    '+243803122782', true
  where not exists (
    select 1 from public.profiles
    where id = '9e4e8876-694f-5fe4-a1fd-74eb8b46430c'::uuid
       or lower(display_name) = lower('Carlo Musongela')
  )
  on conflict (id) do nothing;
  get diagnostics inserted_count = row_count;
  inserted_total := inserted_total + inserted_count;
  raise notice 'profiles: % ligne insérée(s)', inserted_count;

  insert into public.projects (
    title, slug, short_description, long_description, category, status, client,
    duration, team_size, completed_date, technologies, cover_image_path,
    github_url, live_url, display_order, published_at
  )
  select title, slug, short_description, long_description, category, status, client,
    duration, team_size, completed_date, technologies, cover_image_path,
    github_url, live_url, display_order, now()
  from portfolio_seed_projects
  on conflict (slug) do nothing;
  get diagnostics inserted_count = row_count;
  inserted_total := inserted_total + inserted_count;
  raise notice 'projects: % ligne(s) insérée(s)', inserted_count;

  insert into public.services (title, slug, description, display_order, published_at)
  select title, slug, null, display_order, now()
  from portfolio_seed_services
  on conflict (slug) do nothing;
  get diagnostics inserted_count = row_count;
  inserted_total := inserted_total + inserted_count;
  raise notice 'services: % ligne(s) insérée(s); descriptions absentes laissées NULL', inserted_count;

  insert into public.skills (name, category, display_order, published_at)
  select name, category, display_order, now()
  from portfolio_seed_skills
  on conflict (name, category) do nothing;
  get diagnostics inserted_count = row_count;
  inserted_total := inserted_total + inserted_count;
  raise notice 'skills: % ligne(s) insérée(s)', inserted_count;

  raise notice 'Import terminé sans suppression ni mise à jour; total inséré: %', inserted_total;
end
$$;
