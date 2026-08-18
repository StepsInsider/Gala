-- Apply once to the target Pincus Supabase project.
-- No production execution is performed by this repository commit.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid,
  status text not null default 'neu',
  service text not null,
  city text,
  postcode text,
  address text,
  project_size text,
  desired_period text,
  description text,
  contact_name text not null,
  phone text,
  email text,
  source text,
  landing_page text,
  campaign text,
  keyword text,
  gclid text,
  fbclid text,
  photo_urls jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_service_city_idx on public.leads(service, city);

alter table public.leads enable row level security;

-- Public visitors never receive direct table access. Netlify's server-side
-- function uses the Supabase service-role key and is the only write path.
