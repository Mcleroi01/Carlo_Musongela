create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
$$;

revoke all on function public.is_admin() from public, anon, service_role;
grant execute on function public.is_admin() to authenticated;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  headline text,
  bio text,
  location text,
  languages text[] not null default '{}',
  avatar_path text,
  cv_path text,
  github_url text,
  linkedin_url text,
  whatsapp_number text,
  contact_email text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  long_description text,
  category text not null check (category in ('web_app', 'mobile_app', 'api', 'system', 'other')),
  status text not null default 'planned' check (status in ('completed', 'in_progress', 'planned')),
  client text,
  duration text,
  team_size integer check (team_size is null or team_size > 0),
  completed_date text,
  technologies text[] not null default '{}',
  cover_image_path text,
  github_url text,
  live_url text,
  display_order integer not null default 0,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_publication_dates_check check (
    archived_at is null or published_at is null or archived_at >= published_at
  )
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  position text not null,
  company text not null,
  description text,
  location text,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  display_order integer not null default 0,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint experiences_dates_check check (end_date is null or end_date >= start_date),
  constraint experiences_current_check check (
    (is_current = true and end_date is null) or is_current = false
  )
);

create table public.formations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  institution text not null,
  description text,
  start_date date,
  end_date date,
  status text not null default 'completed' check (status in ('completed', 'in_progress', 'planned')),
  certificate_path text,
  document_url text,
  display_order integer not null default 0,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint formations_dates_check check (
    start_date is null or end_date is null or end_date >= start_date
  )
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  level integer check (level is null or (level >= 0 and level <= 100)),
  display_order integer not null default 0,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint skills_name_category_unique unique (name, category)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  image_path text,
  price_label text,
  cta_label text,
  cta_url text,
  display_order integer not null default 0,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_path text,
  service_id uuid references public.services(id) on delete set null,
  formation_id uuid references public.formations(id) on delete set null,
  starts_at timestamptz,
  ends_at timestamptz,
  cta_label text,
  cta_url text,
  display_order integer not null default 0,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promotions_dates_check check (
    starts_at is null or ends_at is null or ends_at >= starts_at
  )
);

create index profiles_public_idx on public.profiles (is_public);
create index projects_public_idx on public.projects (published_at, archived_at, display_order);
create index projects_slug_idx on public.projects (slug);
create index experiences_public_idx on public.experiences (published_at, archived_at, start_date desc);
create index formations_public_idx on public.formations (published_at, archived_at, display_order);
create index skills_public_idx on public.skills (published_at, archived_at, category, display_order);
create index services_public_idx on public.services (published_at, archived_at, display_order);
create index services_slug_idx on public.services (slug);
create index promotions_public_idx on public.promotions (published_at, archived_at, starts_at, ends_at);
create index promotions_service_idx on public.promotions (service_id);
create index promotions_formation_idx on public.promotions (formation_id);

create trigger admin_users_set_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger experiences_set_updated_at
before update on public.experiences
for each row execute function public.set_updated_at();

create trigger formations_set_updated_at
before update on public.formations
for each row execute function public.set_updated_at();

create trigger skills_set_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create trigger promotions_set_updated_at
before update on public.promotions
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.formations enable row level security;
alter table public.skills enable row level security;
alter table public.services enable row level security;
alter table public.promotions enable row level security;

-- Only the project owner/database operator can change administrator assignments.
-- API roles get read access (filtered by RLS) but no table write privileges.
-- The owner/operator remains able to bootstrap and revoke admins in the SQL Editor.
revoke all privileges on table public.admin_users
from public, anon, authenticated, service_role;
grant select on table public.admin_users to authenticated;

-- Grants permit the API operations; RLS below restricts rows and writes.
grant select on table
  public.profiles,
  public.projects,
  public.experiences,
  public.formations,
  public.skills,
  public.services,
  public.promotions
to anon, authenticated;

grant insert, update, delete on table
  public.profiles,
  public.projects,
  public.experiences,
  public.formations,
  public.skills,
  public.services,
  public.promotions
to authenticated;

create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

create policy "Public can read public profiles"
on public.profiles
for select
to anon, authenticated
using (is_public = true);

create policy "Admins can manage profiles"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (published_at is not null and archived_at is null);

create policy "Admins can manage projects"
on public.projects
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published experiences"
on public.experiences
for select
to anon, authenticated
using (published_at is not null and archived_at is null);

create policy "Admins can manage experiences"
on public.experiences
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published formations"
on public.formations
for select
to anon, authenticated
using (published_at is not null and archived_at is null);

create policy "Admins can manage formations"
on public.formations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published skills"
on public.skills
for select
to anon, authenticated
using (published_at is not null and archived_at is null);

create policy "Admins can manage skills"
on public.skills
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published services"
on public.services
for select
to anon, authenticated
using (published_at is not null and archived_at is null);

create policy "Admins can manage services"
on public.services
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read active published promotions"
on public.promotions
for select
to anon, authenticated
using (
  published_at is not null
  and archived_at is null
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

create policy "Admins can manage promotions"
on public.promotions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values
  ('portfolio-public', 'portfolio-public', true),
  ('portfolio-private', 'portfolio-private', false)
on conflict (id) do nothing;

create policy "Public can read portfolio public files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio-public');

create policy "Admins can upload portfolio public files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio-public' and public.is_admin());

create policy "Admins can update portfolio public files"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio-public' and public.is_admin())
with check (bucket_id = 'portfolio-public' and public.is_admin());

create policy "Admins can delete portfolio public files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio-public' and public.is_admin());

create policy "Admins can read portfolio private files"
on storage.objects
for select
to authenticated
using (bucket_id = 'portfolio-private' and public.is_admin());

create policy "Admins can upload portfolio private files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio-private' and public.is_admin());

create policy "Admins can update portfolio private files"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio-private' and public.is_admin())
with check (bucket_id = 'portfolio-private' and public.is_admin());

create policy "Admins can delete portfolio private files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio-private' and public.is_admin());
