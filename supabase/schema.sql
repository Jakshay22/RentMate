-- RentMate base schema
-- Run in Supabase SQL editor (new projects)

create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_name text not null,
  property_address text null,
  name text not null,
  phone text not null,
  rent_amount numeric(12,2) not null,
  due_date date not null,
  upi_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  amount numeric(12,2) not null,
  month int not null check (month between 1 and 12),
  year int not null check (year >= 2020),
  status text not null check (status in ('PAID', 'UNPAID', 'LATE')),
  paid_at timestamptz null,
  created_at timestamptz not null default now(),
  unique (tenant_id, month, year)
);

create table if not exists public.reminder_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_id uuid not null references public.payments(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  reminder_type text not null check (reminder_type in ('before_due', 'due_today', 'late_due')),
  channel text not null default 'whatsapp',
  status text not null default 'sent',
  provider_message_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_tenants_user_id on public.tenants(user_id);
create index if not exists idx_payments_user_id_month_year on public.payments(user_id, month, year);
create index if not exists idx_payments_tenant_id on public.payments(tenant_id);

alter table public.tenants enable row level security;
alter table public.payments enable row level security;
alter table public.reminder_logs enable row level security;

drop policy if exists "tenants_select_own" on public.tenants;
drop policy if exists "tenants_insert_own" on public.tenants;
drop policy if exists "tenants_update_own" on public.tenants;
drop policy if exists "tenants_delete_own" on public.tenants;

create policy "tenants_select_own" on public.tenants for select using (auth.uid() = user_id);
create policy "tenants_insert_own" on public.tenants for insert with check (auth.uid() = user_id);
create policy "tenants_update_own" on public.tenants for update using (auth.uid() = user_id);
create policy "tenants_delete_own" on public.tenants for delete using (auth.uid() = user_id);

drop policy if exists "payments_select_own" on public.payments;
drop policy if exists "payments_insert_own" on public.payments;
drop policy if exists "payments_update_own" on public.payments;
drop policy if exists "payments_delete_own" on public.payments;

create policy "payments_select_own" on public.payments for select using (auth.uid() = user_id);
create policy "payments_insert_own" on public.payments for insert with check (auth.uid() = user_id);
create policy "payments_update_own" on public.payments for update using (auth.uid() = user_id);
create policy "payments_delete_own" on public.payments for delete using (auth.uid() = user_id);

drop policy if exists "reminder_logs_select_own" on public.reminder_logs;
drop policy if exists "reminder_logs_insert_own" on public.reminder_logs;

create policy "reminder_logs_select_own" on public.reminder_logs for select using (auth.uid() = user_id);
create policy "reminder_logs_insert_own" on public.reminder_logs for insert with check (auth.uid() = user_id);

-- Public read-only access (so visitors can view dashboard/tenants/payments without login).
-- Anonymous users (anon) have auth.uid() = null, so we add `using (true)` select policies.
create policy "tenants_select_public" on public.tenants for select using (true);
create policy "payments_select_public" on public.payments for select using (true);
create policy "reminder_logs_select_public" on public.reminder_logs for select using (true);
