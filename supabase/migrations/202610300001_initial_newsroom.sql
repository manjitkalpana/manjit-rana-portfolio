-- ManjitRana Global News: initial PostgreSQL schema
create extension if not exists pgcrypto;

create table if not exists public.categories (
 id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
 description text, is_active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.countries (
 id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
 iso2 char(2) unique, flag_emoji text, created_at timestamptz not null default now()
);
create table if not exists public.sources (
 id uuid primary key default gen_random_uuid(), name text not null, website_url text not null,
 feed_url text, country_code char(2), category text, license_notes text,
 is_active boolean not null default true, last_checked_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.discovered_news (
 id uuid primary key default gen_random_uuid(), source_id uuid references public.sources(id) on delete set null,
 title text not null, url text not null, summary text, published_at timestamptz,
 fingerprint char(64) not null unique, country_code char(2), suggested_category text,
 status text not null default 'collected' check (status in ('collected','processing','needs_review','rejected','published')),
 created_at timestamptz not null default now()
);
create table if not exists public.articles (
 id uuid primary key default gen_random_uuid(), slug text not null unique, headline text not null,
 summary text not null, body_md text not null default '', image_url text, image_credit text,
 category_id uuid references public.categories(id) on delete set null,
 category_name text, country_id uuid references public.countries(id) on delete set null,
 country_name text, status text not null default 'draft' check (status in ('draft','review','published','archived')),
 is_featured boolean not null default false, source_count integer not null default 0,
 seo_title text, seo_description text, published_at timestamptz, created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.article_sources (
 article_id uuid not null references public.articles(id) on delete cascade,
 source_id uuid references public.sources(id) on delete set null, discovered_id uuid references public.discovered_news(id) on delete set null,
 publisher_name text not null, source_url text not null, accessed_at timestamptz not null default now(),
 primary key(article_id, source_url)
);
create table if not exists public.article_revisions (
 id uuid primary key default gen_random_uuid(), article_id uuid not null references public.articles(id) on delete cascade,
 headline text not null, summary text not null, body_md text not null, changed_by text,
 change_reason text, created_at timestamptz not null default now()
);
create table if not exists public.personalities (
 id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
 country_id uuid references public.countries(id) on delete set null, biography text,
 image_url text, image_credit text, created_at timestamptz not null default now()
);
create table if not exists public.events (
 id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique,
 description text, location text, country_id uuid references public.countries(id) on delete set null,
 starts_at timestamptz, ends_at timestamptz, status text not null default 'scheduled',
 created_at timestamptz not null default now()
);
create table if not exists public.media (
 id uuid primary key default gen_random_uuid(), storage_path text not null, public_url text,
 alt_text text, credit text, license text, created_at timestamptz not null default now()
);
create table if not exists public.automation_jobs (
 id uuid primary key default gen_random_uuid(), job_type text not null, payload jsonb not null default '{}',
 status text not null default 'queued' check (status in ('queued','running','done','failed','paused')),
 attempts integer not null default 0, run_after timestamptz not null default now(),
 last_error text, created_at timestamptz not null default now()
);
create table if not exists public.automation_logs (
 id uuid primary key default gen_random_uuid(), level text not null, event text not null,
 details jsonb not null default '{}', created_at timestamptz not null default now()
);
create table if not exists public.trending_topics (
 id uuid primary key default gen_random_uuid(), topic text not null, slug text not null unique,
 score numeric not null default 0, window_started_at timestamptz, updated_at timestamptz not null default now()
);
create table if not exists public.site_settings (
 key text primary key, value jsonb not null default '{}', updated_at timestamptz not null default now()
);
create index if not exists articles_published_idx on public.articles(status,published_at desc);
create index if not exists articles_category_idx on public.articles(category_id,published_at desc);
create index if not exists discovered_status_idx on public.discovered_news(status,created_at desc);
create index if not exists jobs_queue_idx on public.automation_jobs(status,run_after);
create index if not exists sources_active_idx on public.sources(is_active);
alter table public.articles enable row level security;
alter table public.article_sources enable row level security;
alter table public.sources enable row level security;
alter table public.categories enable row level security;
alter table public.countries enable row level security;
-- Public reads are served through server routes using a server-only service role key.
-- No anonymous write policies are created.

insert into public.categories(name,slug) values
('World News','world'),('Nepal News','nepal'),('Politics','politics'),('International Relations','international-relations'),
('Business','business'),('Economy','economy'),('Technology','technology'),('Artificial Intelligence','artificial-intelligence'),
('Science','science'),('Education','education'),('Health','health'),('Sports','sports'),('Entertainment','entertainment'),
('Crime','crime'),('War and Conflicts','war-and-conflicts'),('Environment','environment'),('Climate','climate'),
('Culture','culture'),('Society','society'),('Events','events'),('Breaking News','breaking'),('Trending News','trending')
on conflict(slug) do nothing;

insert into public.countries(name,slug,iso2) values
('Nepal','nepal','NP'),('India','india','IN'),('China','china','CN'),('United States','united-states','US'),
('United Kingdom','united-kingdom','GB'),('Russia','russia','RU'),('Japan','japan','JP'),('South Korea','south-korea','KR'),
('Pakistan','pakistan','PK'),('Bangladesh','bangladesh','BD'),('Australia','australia','AU'),('Canada','canada','CA')
on conflict(slug) do nothing;
