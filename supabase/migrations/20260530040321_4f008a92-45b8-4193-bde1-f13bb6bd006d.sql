
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Admins can view all roles"
on public.user_roles for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Users can view own roles"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

create policy "Admins can manage roles"
on public.user_roles for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Content items
create type public.content_category as enum ('scheme', 'tourism', 'agriculture', 'service');

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  category public.content_category not null,
  title text not null,
  subtitle text,
  description text,
  image_url text,
  tag text,
  sort_order int not null default 0,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index content_items_category_idx on public.content_items (category, sort_order);

grant select on public.content_items to anon, authenticated;
grant insert, update, delete on public.content_items to authenticated;
grant all on public.content_items to service_role;

alter table public.content_items enable row level security;

create policy "Anyone can read content"
on public.content_items for select
to anon, authenticated
using (true);

create policy "Admins can insert content"
on public.content_items for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update content"
on public.content_items for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete content"
on public.content_items for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Auto-update updated_at
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger content_items_set_updated_at
before update on public.content_items
for each row execute function public.tg_set_updated_at();

-- Seed initial content
insert into public.content_items (category, title, subtitle, description, tag, sort_order) values
('scheme', 'Kalia Yojana', 'Agriculture & Farmers', 'Financial assistance of ₹10,000/year for small and marginal farmers.', 'Farmers', 1),
('scheme', 'Biju Swasthya Kalyan Yojana', 'Health', 'Cashless treatment up to ₹5 lakh per family per year.', 'Health', 2),
('scheme', 'Mission Shakti', 'Women & Child', 'Empowering 70 lakh women through self-help groups.', 'Women', 3),
('scheme', 'Mukhyamantri Karma Tatpara Abhiyan', 'Skill Development', 'Skilling youth for industry-ready employment.', 'Youth', 4),
('tourism', 'Konark Sun Temple', 'Puri District', '13th century UNESCO World Heritage site shaped as a colossal chariot.', 'Heritage', 1),
('tourism', 'Puri Jagannath Temple', 'Puri', 'One of the Char Dham pilgrimages and the seat of the Rath Yatra.', 'Pilgrimage', 2),
('tourism', 'Chilika Lake', 'Khordha', 'Asia''s largest brackish water lagoon, home to dolphins and migratory birds.', 'Nature', 3),
('tourism', 'Daringbadi', 'Kandhamal', 'The "Kashmir of Odisha" — pine forests, valleys and coffee plantations.', 'Hill Station', 4),
('agriculture', 'Crop Advisory', 'Personalised guidance', 'Crop-wise guidance for paddy, pulses, oilseeds and horticulture.', 'Advisory', 1),
('agriculture', 'Live Mandi Prices', 'Daily rates', 'Daily price updates from 80+ regulated markets across the state.', 'Market', 2),
('agriculture', 'Irrigation & Weather', 'Forecasts', 'Reservoir levels, rainfall forecasts and Jal Jeevan project status.', 'Weather', 3),
('agriculture', 'Subsidies & Equipment', 'Farm machinery', 'Apply for tractors, pumps and farm machinery subsidies online.', 'Subsidy', 4),
('service', 'Certificates', 'Vital records', 'Birth, caste, income and residence certificates.', 'Records', 1),
('service', 'Electricity Bills', 'DISCOMs', 'Pay TPCODL, TPWODL, TPNODL and TPSODL bills online.', 'Utilities', 2),
('service', 'Health Services', 'BSKY & hospitals', 'Apply for BSKY card, find hospitals and check entitlements.', 'Health', 3),
('service', 'Transport', 'RTO services', 'Driving licence, vehicle registration and fitness certificates.', 'Transport', 4);
