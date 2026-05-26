create extension if not exists pgcrypto;

create table if not exists public.weights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight numeric(6, 2) not null check (weight > 0),
  date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists weights_user_id_date_idx
  on public.weights (user_id, date desc);

create table if not exists public.settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  target_weight numeric(6, 2),
  starting_weight numeric(6, 2),
  goal_segments integer not null default 5 check (goal_segments > 0),
  tracking_strategy text not null default 'last_weight'
    check (tracking_strategy in ('moving_average', 'last_weight', 'lowest_weight')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  starting_weight numeric(6, 2) not null check (starting_weight > 0),
  target_weight numeric(6, 2) not null check (target_weight > 0),
  steps integer not null default 5 check (steps > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists goals_user_id_created_at_idx
  on public.goals (user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_weights_updated_at on public.weights;
create trigger set_weights_updated_at
before update on public.weights
for each row execute function public.set_updated_at();

drop trigger if exists set_settings_updated_at on public.settings;
create trigger set_settings_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

drop trigger if exists set_goals_updated_at on public.goals;
create trigger set_goals_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

create or replace function public.create_default_settings_for_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists create_default_settings_after_user_insert on auth.users;
create trigger create_default_settings_after_user_insert
after insert on auth.users
for each row execute function public.create_default_settings_for_user();

alter table public.weights enable row level security;
alter table public.settings enable row level security;
alter table public.goals enable row level security;

drop policy if exists "Users can read own weights" on public.weights;
create policy "Users can read own weights"
on public.weights for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own weights" on public.weights;
create policy "Users can insert own weights"
on public.weights for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own weights" on public.weights;
create policy "Users can update own weights"
on public.weights for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own weights" on public.weights;
create policy "Users can delete own weights"
on public.weights for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own settings" on public.settings;
create policy "Users can read own settings"
on public.settings for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own settings" on public.settings;
create policy "Users can insert own settings"
on public.settings for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own settings" on public.settings;
create policy "Users can update own settings"
on public.settings for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read own goals" on public.goals;
create policy "Users can read own goals"
on public.goals for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own goals" on public.goals;
create policy "Users can insert own goals"
on public.goals for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own goals" on public.goals;
create policy "Users can update own goals"
on public.goals for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own goals" on public.goals;
create policy "Users can delete own goals"
on public.goals for delete
to authenticated
using (auth.uid() = user_id);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.weights to authenticated;
grant select, insert, update, delete on public.settings to authenticated;
grant select, insert, update, delete on public.goals to authenticated;
