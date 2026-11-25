-- Private bucket holding a JSON copy of each user's profile: profile-data/<uid>/profile.json
-- The profiles table stays the source of truth; this is a per-user file backup.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-data', 'profile-data', false, 65536, array['application/json'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Owner-only access (select is also needed for upsert/overwrite and delete).
drop policy if exists "profile-data: read own" on storage.objects;
create policy "profile-data: read own" on storage.objects
  for select to authenticated
  using (bucket_id = 'profile-data' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "profile-data: insert own" on storage.objects;
create policy "profile-data: insert own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'profile-data' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "profile-data: update own" on storage.objects;
create policy "profile-data: update own" on storage.objects
  for update to authenticated
  using (bucket_id = 'profile-data' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'profile-data' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "profile-data: delete own" on storage.objects;
create policy "profile-data: delete own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'profile-data' and (storage.foldername(name))[1] = (select auth.uid())::text);
