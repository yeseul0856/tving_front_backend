-- Roles, notices / FAQs / reservations (admin CRUD) and comments (signed-in users).
--   anon (일반 사용자)       : read notices, FAQs, comments, room availability
--   authenticated (로그인)   : + write / edit / delete own comments, read own reservations
--   admin (profiles.role)   : + full CRUD on notices, FAQs, reservations; delete any comment

------------------------------------------------------------------------------
-- 1) Role on profiles — users must not be able to promote themselves
------------------------------------------------------------------------------
alter table public.profiles
  add column if not exists role text not null default 'user' check (role in ('user', 'admin'));

revoke insert, update on public.profiles from anon, authenticated;
grant insert (id, full_name, age, gender, postcode, address, address_detail, avatar_url, onboarded) on public.profiles to authenticated;
grant update (id, full_name, age, gender, postcode, address, address_detail, avatar_url, onboarded) on public.profiles to authenticated;

create schema if not exists private;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;
revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

------------------------------------------------------------------------------
-- 2) Notices
------------------------------------------------------------------------------
create table if not exists public.notices (
  id         bigint generated always as identity primary key,
  title      text not null check (char_length(title) between 1 and 200),
  content    text not null default '' check (char_length(content) <= 20000),
  pinned     boolean not null default false,
  author_id  uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists notices_list_idx on public.notices (pinned desc, created_at desc);

------------------------------------------------------------------------------
-- 3) FAQs
------------------------------------------------------------------------------
create table if not exists public.faqs (
  id         bigint generated always as identity primary key,
  question   text not null check (char_length(question) between 1 and 300),
  answer     text not null default '' check (char_length(answer) <= 10000),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists faqs_order_idx on public.faqs (sort_order, id);

------------------------------------------------------------------------------
-- 4) Reservations (no double-booking of a room)
------------------------------------------------------------------------------
create extension if not exists btree_gist with schema extensions;

create table if not exists public.reservations (
  id         bigint generated always as identity primary key,
  room       text not null check (room in ('forest', 'light', 'rest')),
  check_in   date not null,
  check_out  date not null,
  guests     smallint not null check (guests between 1 and 10),
  guest_name text not null check (char_length(guest_name) between 1 and 50),
  phone      text check (char_length(phone) <= 30),
  email      text check (char_length(email) <= 200),
  user_id    uuid references auth.users (id) on delete set null,
  status     text not null default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled')),
  memo       text check (char_length(memo) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reservations_dates_chk check (check_out > check_in),
  constraint reservations_no_overlap exclude using gist (
    room with =, daterange(check_in, check_out) with &&
  ) where (status <> 'cancelled')
);
create index if not exists reservations_user_idx on public.reservations (user_id);

-- Public availability: which rooms are taken for a date range (no personal data).
create or replace function public.booked_rooms(p_check_in date, p_check_out date)
returns setof text language sql stable security definer set search_path = '' as $$
  select distinct r.room from public.reservations r
  where r.status <> 'cancelled'
    and daterange(r.check_in, r.check_out) && daterange(p_check_in, p_check_out);
$$;
revoke execute on function public.booked_rooms(date, date) from public;
grant execute on function public.booked_rooms(date, date) to anon, authenticated;

------------------------------------------------------------------------------
-- 5) Comments on notices / FAQs
------------------------------------------------------------------------------
create table if not exists public.comments (
  id            bigint generated always as identity primary key,
  notice_id     bigint references public.notices (id) on delete cascade,
  faq_id        bigint references public.faqs (id) on delete cascade,
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author_name   text,
  author_avatar text,
  body          text not null check (char_length(body) between 1 and 1000),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint comments_one_target check (num_nonnulls(notice_id, faq_id) = 1)
);
create index if not exists comments_notice_idx on public.comments (notice_id, created_at);
create index if not exists comments_faq_idx on public.comments (faq_id, created_at);

-- Author snapshot comes from the profile, never from the client.
create or replace function private.comments_set_author()
returns trigger language plpgsql security definer set search_path = '' as $$
declare p record;
begin
  new.user_id := (select auth.uid());
  select full_name, avatar_url into p from public.profiles where id = new.user_id;
  new.author_name := coalesce(nullif(p.full_name, ''), '회원');
  new.author_avatar := p.avatar_url;
  return new;
end;
$$;
revoke execute on function private.comments_set_author() from public, anon, authenticated;

drop trigger if exists comments_set_author on public.comments;
create trigger comments_set_author before insert on public.comments
  for each row execute function private.comments_set_author();

-- Users may only edit the body of a comment.
revoke insert, update on public.comments from anon, authenticated;
grant insert (notice_id, faq_id, body) on public.comments to authenticated;
grant update (body) on public.comments to authenticated;

------------------------------------------------------------------------------
-- updated_at triggers
------------------------------------------------------------------------------
drop trigger if exists notices_set_updated_at on public.notices;
create trigger notices_set_updated_at before update on public.notices for each row execute function public.set_updated_at();
drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at before update on public.faqs for each row execute function public.set_updated_at();
drop trigger if exists reservations_set_updated_at on public.reservations;
create trigger reservations_set_updated_at before update on public.reservations for each row execute function public.set_updated_at();
drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at before update on public.comments for each row execute function public.set_updated_at();

------------------------------------------------------------------------------
-- RLS
------------------------------------------------------------------------------
alter table public.notices enable row level security;
alter table public.faqs enable row level security;
alter table public.reservations enable row level security;
alter table public.comments enable row level security;

-- notices
drop policy if exists "notices: read all" on public.notices;
create policy "notices: read all" on public.notices for select to anon, authenticated using (true);
drop policy if exists "notices: admin insert" on public.notices;
create policy "notices: admin insert" on public.notices for insert to authenticated with check ((select private.is_admin()));
drop policy if exists "notices: admin update" on public.notices;
create policy "notices: admin update" on public.notices for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
drop policy if exists "notices: admin delete" on public.notices;
create policy "notices: admin delete" on public.notices for delete to authenticated using ((select private.is_admin()));

-- faqs
drop policy if exists "faqs: read all" on public.faqs;
create policy "faqs: read all" on public.faqs for select to anon, authenticated using (true);
drop policy if exists "faqs: admin insert" on public.faqs;
create policy "faqs: admin insert" on public.faqs for insert to authenticated with check ((select private.is_admin()));
drop policy if exists "faqs: admin update" on public.faqs;
create policy "faqs: admin update" on public.faqs for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
drop policy if exists "faqs: admin delete" on public.faqs;
create policy "faqs: admin delete" on public.faqs for delete to authenticated using ((select private.is_admin()));

-- reservations: admin everything; a signed-in user reads only their own
drop policy if exists "reservations: read own or admin" on public.reservations;
create policy "reservations: read own or admin" on public.reservations for select to authenticated
  using ((select private.is_admin()) or user_id = (select auth.uid()));
drop policy if exists "reservations: admin insert" on public.reservations;
create policy "reservations: admin insert" on public.reservations for insert to authenticated with check ((select private.is_admin()));
drop policy if exists "reservations: admin update" on public.reservations;
create policy "reservations: admin update" on public.reservations for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
drop policy if exists "reservations: admin delete" on public.reservations;
create policy "reservations: admin delete" on public.reservations for delete to authenticated using ((select private.is_admin()));

-- comments
drop policy if exists "comments: read all" on public.comments;
create policy "comments: read all" on public.comments for select to anon, authenticated using (true);
drop policy if exists "comments: insert own" on public.comments;
create policy "comments: insert own" on public.comments for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "comments: update own" on public.comments;
create policy "comments: update own" on public.comments for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "comments: delete own or admin" on public.comments;
create policy "comments: delete own or admin" on public.comments for delete to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

------------------------------------------------------------------------------
-- Seed: the sample notices / FAQs that were hard-coded in the site
------------------------------------------------------------------------------
insert into public.notices (title, content, pinned, author_id, created_at)
select * from (values
  ('2026 연말 · 연초 예약 오픈 안내', '12월 20일부터 1월 5일까지의 예약이 오픈되었습니다. 성수기에는 2박 이상 예약 가능합니다.', true, null::uuid, timestamptz '2026-11-24 10:00+09'),
  ('겨울 시즌 불멍 패키지 출시', '장작과 마시멜로, 담요가 포함된 겨울 불멍 패키지를 예약 시 옵션으로 선택하실 수 있습니다.', false, null, timestamptz '2026-11-10 10:00+09'),
  ('객실 내 난방 시스템 점검 완료', '모든 객실의 바닥 난방과 보일러 점검을 마쳤습니다. 따뜻한 겨울 보내세요.', false, null, timestamptz '2026-10-28 10:00+09'),
  ('가을 산책 코스 지도 업데이트', '숙소 주변 산책 코스 지도가 새로 업데이트되었습니다. 객실 내 비치된 지도를 확인해 주세요.', false, null, timestamptz '2026-10-12 10:00+09')
) v(title, content, pinned, author_id, created_at)
where not exists (select 1 from public.notices);

insert into public.faqs (question, answer, sort_order)
select * from (values
  ('얼리 체크인이나 레이트 체크아웃이 가능한가요?', '당일 예약 상황에 따라 가능하며, 1시간당 추가 요금이 발생합니다. 방문 전 문의해 주세요.', 1),
  ('기준 인원을 초과하면 어떻게 하나요?', '최대 인원 내에서 1인당 20,000원의 추가 요금이 있으며, 침구가 함께 제공됩니다.', 2),
  ('바비큐 그릴은 어떻게 이용하나요?', '예약 시 옵션으로 선택하시면 숯과 그릴을 세팅해 드립니다. (30,000원)', 3),
  ('예약 취소 시 환불 규정이 궁금해요.', '이용일 7일 전까지 전액 환불, 이후에는 환불 규정에 따라 차등 환불됩니다.', 4)
) v(question, answer, sort_order)
where not exists (select 1 from public.faqs);
