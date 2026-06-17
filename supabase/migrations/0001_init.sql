-- ===========================================================================
-- Portfolio database schema + Row Level Security.
--
-- Run this in the Supabase dashboard:  SQL Editor -> New query -> paste -> Run.
-- It is safe to run more than once.
--
-- Security model:
--   * The PUBLIC (anon) role can only READ published content.
--   * The single ADMIN (any authenticated user) can read everything and write.
--   * Public sign-ups must be DISABLED in Auth settings so "authenticated"
--     only ever means the brother's account.
-- ===========================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.pages (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null default '',
  nav_order   int  not null default 0,
  published   boolean not null default false,
  show_in_nav boolean not null default true,
  content     jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.site_settings (
  id          uuid primary key default gen_random_uuid(),
  site_title  text not null default 'My Portfolio',
  tagline     text not null default '',
  socials     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  path        text,            -- storage path, used when deleting the file
  alt         text default '',
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Keep updated_at fresh
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.pages         enable row level security;
alter table public.site_settings enable row level security;
alter table public.media         enable row level security;

-- pages: public reads only published rows; admin reads + writes everything
drop policy if exists pages_public_read on public.pages;
create policy pages_public_read on public.pages
  for select to anon using (published = true);

drop policy if exists pages_admin_read on public.pages;
create policy pages_admin_read on public.pages
  for select to authenticated using (true);

drop policy if exists pages_admin_write on public.pages;
create policy pages_admin_write on public.pages
  for all to authenticated using (true) with check (true);

-- site_settings: public read, admin write
drop policy if exists settings_public_read on public.site_settings;
create policy settings_public_read on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists settings_admin_write on public.site_settings;
create policy settings_admin_write on public.site_settings
  for all to authenticated using (true) with check (true);

-- media: public read, admin write
drop policy if exists media_public_read on public.media;
create policy media_public_read on public.media
  for select to anon, authenticated using (true);

drop policy if exists media_admin_write on public.media;
create policy media_admin_write on public.media
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for uploaded images (public read, admin write)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_storage_read on storage.objects;
create policy media_storage_read on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists media_storage_insert on storage.objects;
create policy media_storage_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists media_storage_update on storage.objects;
create policy media_storage_update on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists media_storage_delete on storage.objects;
create policy media_storage_delete on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- ---------------------------------------------------------------------------
-- Seed data (only inserts if missing)
-- ---------------------------------------------------------------------------

insert into public.site_settings (site_title, tagline, socials)
select 'Michael John Aguilar', 'Visual Artist & Designer — Bacolod City',
       '{"facebook":"https://facebook.com/miiiijii.aguilar","instagram":"","email":""}'::jsonb
where not exists (select 1 from public.site_settings);

insert into public.pages (slug, title, nav_order, published, show_in_nav, content)
values
  ('home', 'Work', 0, true, true,
   '[
     {"id":"seedhero","type":"hero","heading":"Michael John Aguilar","subheading":"Visual Artist & Designer — Bacolod City","align":"center"},
     {"id":"seedgal","type":"gallery","heading":"Selected Work","columns":3,"images":[]}
   ]'::jsonb),
  ('about', 'About', 1, true, true,
   '[
     {"id":"seedabout","type":"rich_text","heading":"About","text":"Write your artist statement here.","align":"left"}
   ]'::jsonb)
on conflict (slug) do nothing;
