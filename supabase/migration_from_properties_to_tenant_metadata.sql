-- Run once on existing DBs that have properties + due_day + property_id on tenants.
-- Backup first.

alter table public.tenants add column if not exists property_name text;
alter table public.tenants add column if not exists property_address text;
alter table public.tenants add column if not exists due_date date;

update public.tenants t
set
  property_name = coalesce(t.property_name, p.name),
  property_address = coalesce(t.property_address, p.address)
from public.properties p
where t.property_id is not null and t.property_id = p.id;

update public.tenants
set property_name = coalesce(property_name, 'Property')
where property_name is null;

update public.tenants
set due_date = make_date(2000, 1, least(coalesce(due_day, 28), 28))
where due_date is null and due_day is not null;

update public.tenants
set due_date = current_date
where due_date is null;

alter table public.tenants drop constraint if exists tenants_property_id_fkey;
alter table public.tenants drop column if exists property_id;
alter table public.tenants drop column if exists due_day;

alter table public.tenants alter column property_name set not null;
alter table public.tenants alter column due_date set not null;

drop table if exists public.properties cascade;
