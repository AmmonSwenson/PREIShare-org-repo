-- supabase/migrations/20250321000000_property_listings.sql
-- Implements docs/data-model/property-listings-schema.md
-- Owner is auth.users(id) so RLS can use auth.uid().
-- No anon policies. No USING (true) write access.

create extension if not exists "pgcrypto";

create table if not exists public.property_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  property_type text not null
    check (property_type in (
      'multifamily',
      'office',
      'retail',
      'industrial',
      'mixed_use',
      'land'
    )),
  status text not null default 'draft'
    check (status in (
      'draft',
      'published',
      'under_offer',
      'sold',
      'archived'
    )),
  address_line1 text not null,
  address_line2 text,
  city text not null,
  region text not null,
  postal_code text not null,
  country text not null default 'US',
  price numeric(12, 2) not null default 0
    check (price >= 0),
  currency text not null default 'USD'
    check (currency = 'USD'),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists property_listings_owner_id_idx
  on public.property_listings (owner_id);

create index if not exists property_listings_owner_id_status_idx
  on public.property_listings (owner_id, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists property_listings_set_updated_at on public.property_listings;
create trigger property_listings_set_updated_at
before update on public.property_listings
for each row
execute function public.set_updated_at();

alter table public.property_listings enable row level security;

-- Sponsors only see their own rows. No policy for anon.
create policy "listings_select_own"
  on public.property_listings
  for select
  to authenticated
  using (owner_id = auth.uid());

-- Inserts must belong to the signed-in user (blocks forged owner_id).
create policy "listings_insert_own"
  on public.property_listings
  for insert
  to authenticated
  with check (owner_id = auth.uid());

-- USING: which rows may be updated. WITH CHECK: row must still be owned after.
create policy "listings_update_own"
  on public.property_listings
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Hard DELETE of own rows only (archived status is the soft alternative).
create policy "listings_delete_own"
  on public.property_listings
  for delete
  to authenticated
  using (owner_id = auth.uid());
