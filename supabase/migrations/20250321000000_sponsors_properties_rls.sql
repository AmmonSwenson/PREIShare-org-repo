-- supabase/migrations/20250321000000_sponsors_properties_rls.sql
-- Implements docs/data-model-and-rls-matrix.md only.
-- Table names follow the matrix: public.profiles + public.properties (owner_id).
-- Not the tutorial scaffold's sponsors/sponsor_id names.
-- No anon policies. No USING (true). No service-role or secret values.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: 1:1 with auth.users. id = auth.uid() after signup/login.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- profiles DELETE: denied this topic — no policy.

-- ---------------------------------------------------------------------------
-- properties: listings owned by a sponsor. RLS hinge = owner_id.
-- ---------------------------------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  city text,
  status text not null
    check (status in (
      'draft',
      'published',
      'under_offer',
      'sold',
      'archived'
    )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_owner_id_idx
  on public.properties (owner_id);

alter table public.properties enable row level security;

create policy "properties_select_own"
  on public.properties
  for select
  to authenticated
  using (owner_id = auth.uid());

create policy "properties_insert_own"
  on public.properties
  for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "properties_update_own"
  on public.properties
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "properties_delete_own"
  on public.properties
  for delete
  to authenticated
  using (owner_id = auth.uid());

-- Review vs docs/data-model-and-rls-matrix.md:
-- [x] RLS enabled on profiles and properties
-- [x] No USING (true); no policies for anon
-- [x] INSERT/UPDATE WITH CHECK tied to auth.uid()
-- [x] properties.owner_id FK → profiles.id (= auth.users.id)
-- [x] No profiles DELETE policy
-- [x] No extra tables or marketplace read policy
