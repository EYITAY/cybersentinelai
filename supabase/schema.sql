-- Cyber Sentinel AI - Supabase schema (paste into Supabase SQL Editor)

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- Profiles (one row per auth user)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Automatically create profile rows on signup (Cyber Sentinel specific)
create or replace function public.handle_new_user_cyber_sentinel()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists cyber_sentinel_on_auth_user_created on auth.users;
create trigger cyber_sentinel_on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user_cyber_sentinel();

-- ─────────────────────────────────────────────────────────────────────────────
-- Subscriptions (synced from Stripe webhooks)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.subscriptions (
  stripe_subscription_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  status text not null,
  plan text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
on public.subscriptions for select
using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Usage (quota tracking)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start date not null,
  scans_used int not null default 0,
  primary key (user_id, period_start)
);

alter table public.usage enable row level security;

drop policy if exists "usage_select_own" on public.usage;
create policy "usage_select_own"
on public.usage for select
using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Scans (persisted reports)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target text not null,
  persona text not null,
  report jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.scans enable row level security;

drop policy if exists "scans_select_own" on public.scans;
create policy "scans_select_own"
on public.scans for select
using (auth.uid() = user_id);

drop policy if exists "scans_insert_own" on public.scans;
create policy "scans_insert_own"
on public.scans for insert
with check (auth.uid() = user_id);

drop policy if exists "scans_delete_own" on public.scans;
create policy "scans_delete_own"
on public.scans for delete
using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Atomic usage increment (prevents race conditions)
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.increment_usage(p_user_id uuid, p_period_start date)
returns void as $$
begin
  insert into public.usage (user_id, period_start, scans_used)
  values (p_user_id, p_period_start, 1)
  on conflict (user_id, period_start)
  do update set scans_used = public.usage.scans_used + 1;
end;
$$ language plpgsql security definer;
