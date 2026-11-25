-- Profiles: one row per auth user, editable only by its owner.
create table if not exists public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  full_name      text check (char_length(full_name) <= 50),
  age            smallint check (age between 1 and 120),
  gender         text check (gender in ('male', 'female', 'other')),
  postcode       text check (char_length(postcode) <= 10),
  address        text check (char_length(address) <= 200),
  address_detail text check (char_length(address_detail) <= 100),
  avatar_url     text,
  onboarded      boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- create a profile row automatically when a user signs up (email, Google, Kakao)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'nickname'), 50),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- backfill users who signed up before this migration
insert into public.profiles (id, full_name, avatar_url)
select u.id,
       left(coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', u.raw_user_meta_data ->> 'nickname'), 50),
       coalesce(u.raw_user_meta_data ->> 'avatar_url', u.raw_user_meta_data ->> 'picture')
from auth.users u
on conflict (id) do nothing;

-- Avatars: public-read bucket; each user may only write inside their own folder "<uid>/..."
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "avatars: read own" on storage.objects;
create policy "avatars: read own" on storage.objects
  for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "avatars: insert own" on storage.objects;
create policy "avatars: insert own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "avatars: update own" on storage.objects;
create policy "avatars: update own" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "avatars: delete own" on storage.objects;
create policy "avatars: delete own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Trigger-only functions: not callable via the REST API (/rest/v1/rpc/...).
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
