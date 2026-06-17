-- Mimbre Store - Real Supabase hardening migration
-- Review this file before running it manually in the Supabase SQL editor.
-- This migration assumes public.admin_users already exists and already contains
-- the current administrator rows. It does not create, insert, update or delete
-- administrator data.
--
-- Notes:
-- - Storage write policies for the "productos" bucket are migrated here because
--   they already exist and depend on public.is_admin().
-- - Public image read policies, if any, are not modified.
-- - Global storage.objects privileges and bucket configuration are not modified.
-- - orders_with_items exposes order and customer data and must respect RLS from
--   orders and order_items. The security_invoker patch was already applied
--   manually in production and is recorded here for reproducibility.
-- - /admin still needs server-side validation in a later phase.
-- - Supabase Security Advisor warnings should be reviewed in a later phase.
-- - orders, order_items and payments are written by server API routes using
--   service_role, not directly by browser clients.

begin;

-- 1. Private schema for privileged helper functions
create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;
grant usage on schema private to authenticated;

-- 2. Drop existing policies that depend on public.is_admin()
-- public.admin_users
drop policy if exists "Admins can manage admin users" on public.admin_users;
drop policy if exists "Admins can read admin users" on public.admin_users;

-- public.products
drop policy if exists "Admins can delete products" on public.products;
drop policy if exists "Admins can insert products" on public.products;
drop policy if exists "Admins can read all products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Public can read available products" on public.products;

-- old initial policies
drop policy if exists "Authenticated users can insert products" on public.products;
drop policy if exists "Authenticated users can update products" on public.products;
drop policy if exists "Authenticated users can delete products" on public.products;

-- public.orders
drop policy if exists "Admins can delete orders" on public.orders;
drop policy if exists "Admins can read orders" on public.orders;
drop policy if exists "Admins can update orders" on public.orders;

-- old initial policies
drop policy if exists "Anyone can insert orders" on public.orders;
drop policy if exists "Authenticated users can read orders" on public.orders;
drop policy if exists "Authenticated users can update orders" on public.orders;

-- public.order_items
drop policy if exists "Admins can delete order items" on public.order_items;
drop policy if exists "Admins can read order items" on public.order_items;
drop policy if exists "Admins can update order items" on public.order_items;

-- old initial policies
drop policy if exists "Anyone can insert order items" on public.order_items;
drop policy if exists "Authenticated users can read order items" on public.order_items;

-- public.payments
drop policy if exists "Admins can delete payments" on public.payments;
drop policy if exists "Admins can read payments" on public.payments;
drop policy if exists "Admins can update payments" on public.payments;

-- old initial policies
drop policy if exists "Authenticated users can insert payments" on public.payments;
drop policy if exists "Authenticated users can update payments" on public.payments;
drop policy if exists "Authenticated users can read payments" on public.payments;

-- storage.objects
drop policy if exists "Admins can delete product images" on storage.objects;
drop policy if exists "Admins can update product images" on storage.objects;
drop policy if exists "Admins can upload product images" on storage.objects;

-- 3. Drop the old public helper only after dependent policies are removed
drop function if exists public.is_admin();

-- 4. Create hardened private admin helper
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public;
revoke all on function private.is_admin() from anon;
grant execute on function private.is_admin() to authenticated;

-- 5. Keep RLS enabled without forcing RLS
alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

-- 6. Minimum table privileges
-- public.admin_users: no browser access. private.is_admin() checks internally.
revoke all on table public.admin_users from anon;
revoke all on table public.admin_users from authenticated;

-- public.products: public catalog reads; authenticated writes only when RLS says admin.
revoke all on table public.products from anon;
revoke all on table public.products from authenticated;
grant select on table public.products to anon, authenticated;
grant insert, update, delete on table public.products to authenticated;

-- public.orders: admin browser reads only. Writes happen through service_role APIs.
revoke all on table public.orders from anon;
revoke all on table public.orders from authenticated;
grant select on table public.orders to authenticated;

-- public.order_items: admin browser reads only. Writes happen through service_role APIs.
revoke all on table public.order_items from anon;
revoke all on table public.order_items from authenticated;
grant select on table public.order_items to authenticated;

-- public.payments: admin browser reads only. Writes happen through service_role APIs.
revoke all on table public.payments from anon;
revoke all on table public.payments from authenticated;
grant select on table public.payments to authenticated;

-- public.orders_with_items: view exposes order and customer data.
-- It must run as invoker so underlying orders/order_items RLS applies.
-- This patch was already applied manually in production and is kept here so
-- the secure state can be reproduced in another environment.
alter view public.orders_with_items
set (security_invoker = true);

revoke all on table public.orders_with_items from anon;
revoke all on table public.orders_with_items from authenticated;
grant select on table public.orders_with_items to authenticated;

-- 7. Recreate only the required policies
-- public.products
create policy "Public can read available products"
  on public.products
  for select
  to anon, authenticated
  using (available = true);

create policy "Admins can read all products"
  on public.products
  for select
  to authenticated
  using ((select private.is_admin()));

create policy "Admins can insert products"
  on public.products
  for insert
  to authenticated
  with check ((select private.is_admin()));

create policy "Admins can update products"
  on public.products
  for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins can delete products"
  on public.products
  for delete
  to authenticated
  using ((select private.is_admin()));

-- public.orders
create policy "Admins can read orders"
  on public.orders
  for select
  to authenticated
  using ((select private.is_admin()));

-- public.order_items
create policy "Admins can read order items"
  on public.order_items
  for select
  to authenticated
  using ((select private.is_admin()));

-- public.payments
create policy "Admins can read payments"
  on public.payments
  for select
  to authenticated
  using ((select private.is_admin()));

-- storage.objects
-- Only write policies for the "productos" bucket are migrated.
-- Public image reads and bucket-level configuration are intentionally untouched.
create policy "Admins can upload product images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'productos'::text
    and (select private.is_admin())
  );

create policy "Admins can update product images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'productos'::text
    and (select private.is_admin())
  )
  with check (
    bucket_id = 'productos'::text
    and (select private.is_admin())
  );

create policy "Admins can delete product images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'productos'::text
    and (select private.is_admin())
  );

commit;
