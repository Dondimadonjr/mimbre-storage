-- Raiz y Mimbre - Atomic stock discount RPC
-- Phase 2A only: prepare SQL for manual review/application in Supabase.
-- Do not run automatically from the app yet.
--
-- Purpose:
-- - Confirm an order as paid and discount product stock atomically.
-- - Prevent double discount when the same paid order is processed twice.
-- - Prevent overselling by locking the order row and product rows.
-- - Return a clear result for server-side code.
--
-- Expected current schema:
-- - public.orders(id uuid, status text)
-- - public.order_items(order_id uuid, product_id uuid, quantity integer)
-- - public.products(id uuid, stock integer)
--
-- Security notes:
-- - Intended to be called server-side with the Supabase service role.
-- - Execution is revoked from public, anon and authenticated.
-- - SECURITY DEFINER is used with an empty search_path and fully qualified names.

begin;

create or replace function public.confirm_paid_order_and_discount_stock(
  p_order_id uuid
)
returns table (
  success boolean,
  message text,
  order_id uuid,
  previous_status text,
  new_status text,
  items_count integer,
  discounted_items integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_items_count integer := 0;
  v_discounted_items integer := 0;
  v_missing_products integer := 0;
  v_invalid_items integer := 0;
  v_insufficient_stock integer := 0;
  v_expected_products integer := 0;
begin
  if p_order_id is null then
    return query
    select
      false,
      'order_id is required',
      null::uuid,
      null::text,
      null::text,
      0,
      0;
    return;
  end if;

  -- Lock the order first. Concurrent calls for the same order will wait here.
  select *
  into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    return query
    select
      false,
      'Order not found',
      p_order_id,
      null::text,
      null::text,
      0,
      0;
    return;
  end if;

  select count(*)
  into v_expected_products
  from (
    select product_id
    from public.order_items
    where order_id = p_order_id
    group by product_id
  ) distinct_products;

  if v_discounted_items <> v_expected_products then
    raise exception 'Stock discount mismatch for order %. Expected %, updated %',
      p_order_id,
      v_expected_products,
      v_discounted_items;
  end if;

  -- Idempotency guard: a paid order has already had stock handled.
  if v_order.status = 'pagado' then
    return query
    select
      true,
      'Order already paid; stock was not discounted again',
      v_order.id,
      v_order.status,
      v_order.status,
      0,
      0;
    return;
  end if;

  select count(*)
  into v_items_count
  from public.order_items
  where order_id = p_order_id;

  if v_items_count = 0 then
    return query
    select
      false,
      'Order has no items',
      v_order.id,
      v_order.status,
      v_order.status,
      0,
      0;
    return;
  end if;

  select count(*)
  into v_invalid_items
  from public.order_items
  where order_id = p_order_id
    and (product_id is null or quantity is null or quantity <= 0);

  if v_invalid_items > 0 then
    return query
    select
      false,
      'Order has invalid items',
      v_order.id,
      v_order.status,
      v_order.status,
      v_items_count,
      0;
    return;
  end if;

  -- Lock all product rows in a deterministic order before checking stock.
  perform 1
  from public.products p
  join (
    select product_id
    from public.order_items
    where order_id = p_order_id
    group by product_id
    order by product_id
  ) locked_items on locked_items.product_id = p.id
  order by p.id
  for update of p;

  select count(*)
  into v_missing_products
  from (
    select product_id
    from public.order_items
    where order_id = p_order_id
    group by product_id
  ) item_products
  left join public.products p on p.id = item_products.product_id
  where p.id is null;

  if v_missing_products > 0 then
    return query
    select
      false,
      'One or more products no longer exist',
      v_order.id,
      v_order.status,
      v_order.status,
      v_items_count,
      0;
    return;
  end if;

  select count(*)
  into v_insufficient_stock
  from (
    select product_id, sum(quantity)::integer as requested_quantity
    from public.order_items
    where order_id = p_order_id
    group by product_id
  ) requested
  join public.products p on p.id = requested.product_id
  where p.stock < requested.requested_quantity;

  if v_insufficient_stock > 0 then
    return query
    select
      false,
      'Insufficient stock',
      v_order.id,
      v_order.status,
      v_order.status,
      v_items_count,
      0;
    return;
  end if;

  with requested as (
    select product_id, sum(quantity)::integer as requested_quantity
    from public.order_items
    where order_id = p_order_id
    group by product_id
  ),
  updated_products as (
    update public.products p
    set stock = p.stock - requested.requested_quantity
    from requested
    where p.id = requested.product_id
      and p.stock >= requested.requested_quantity
    returning p.id
  )
  select count(*)
  into v_discounted_items
  from updated_products;

  update public.orders
  set status = 'pagado'
  where id = p_order_id;

  return query
  select
    true,
    'Order marked as paid and stock discounted',
    v_order.id,
    v_order.status,
    'pagado'::text,
    v_items_count,
    v_discounted_items;
end;
$$;

comment on function public.confirm_paid_order_and_discount_stock(uuid)
is 'Atomically marks an order as pagado and discounts product stock once. Intended for server-side service_role calls after Webpay approval.';

revoke all on function public.confirm_paid_order_and_discount_stock(uuid) from public;
revoke all on function public.confirm_paid_order_and_discount_stock(uuid) from anon;
revoke all on function public.confirm_paid_order_and_discount_stock(uuid) from authenticated;
grant execute on function public.confirm_paid_order_and_discount_stock(uuid) to service_role;

commit;

-- Verification queries - safe to run manually after applying this file:
--
-- select
--   n.nspname as schema,
--   p.proname as function_name,
--   pg_get_function_arguments(p.oid) as arguments,
--   pg_get_function_result(p.oid) as result,
--   p.prosecdef as security_definer,
--   p.proconfig as config
-- from pg_proc p
-- join pg_namespace n on n.oid = p.pronamespace
-- where n.nspname = 'public'
--   and p.proname = 'confirm_paid_order_and_discount_stock';
--
-- select
--   routine_schema,
--   routine_name,
--   grantee,
--   privilege_type
-- from information_schema.routine_privileges
-- where routine_schema = 'public'
--   and routine_name = 'confirm_paid_order_and_discount_stock'
-- order by grantee, privilege_type;

-- Manual test queries - keep commented until using a controlled test order:
--
-- select *
-- from public.confirm_paid_order_and_discount_stock('00000000-0000-0000-0000-000000000000'::uuid);
--
-- Expected idempotency test:
-- 1. Run the function once for an unpaid test order with enough stock.
-- 2. Run it again for the same order.
-- 3. The second result should be success=true with message
--    'Order already paid; stock was not discounted again'.

-- Manual rollback, if this RPC must be removed:
--
-- begin;
-- revoke all on function public.confirm_paid_order_and_discount_stock(uuid) from public;
-- revoke all on function public.confirm_paid_order_and_discount_stock(uuid) from anon;
-- revoke all on function public.confirm_paid_order_and_discount_stock(uuid) from authenticated;
-- revoke all on function public.confirm_paid_order_and_discount_stock(uuid) from service_role;
-- drop function if exists public.confirm_paid_order_and_discount_stock(uuid);
-- commit;
