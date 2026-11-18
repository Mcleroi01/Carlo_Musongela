-- Bilingual content: base columns hold the English text, `translations` holds the
-- overrides per language, e.g. {"fr": {"title": "…", "short_description": "…"}}.
-- Missing keys fall back to the base column, so existing rows keep working unchanged.

alter table public.profiles   add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.projects   add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.services   add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.experiences add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.formations add column if not exists translations jsonb not null default '{}'::jsonb;

alter table public.profiles   drop constraint if exists profiles_translations_object;
alter table public.profiles   add constraint profiles_translations_object check (jsonb_typeof(translations) = 'object');
alter table public.projects   drop constraint if exists projects_translations_object;
alter table public.projects   add constraint projects_translations_object check (jsonb_typeof(translations) = 'object');
alter table public.services   drop constraint if exists services_translations_object;
alter table public.services   add constraint services_translations_object check (jsonb_typeof(translations) = 'object');
alter table public.experiences drop constraint if exists experiences_translations_object;
alter table public.experiences add constraint experiences_translations_object check (jsonb_typeof(translations) = 'object');
alter table public.formations drop constraint if exists formations_translations_object;
alter table public.formations add constraint formations_translations_object check (jsonb_typeof(translations) = 'object');

-- Admins upload documents (CV, certificates) and images through the dashboard; keep the
-- public bucket limited to web-safe file types and a sane size.
update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf']
where id = 'portfolio-public';
