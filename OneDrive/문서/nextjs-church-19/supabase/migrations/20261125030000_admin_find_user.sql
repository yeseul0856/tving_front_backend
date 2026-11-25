-- Admin-only: look up a member's user id by email, to link a reservation to that member
-- (the member then sees it under "내 예약"). Non-admins get a permission error.
create or replace function public.admin_find_user(p_email text)
returns uuid language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return (select u.id from auth.users u where lower(u.email) = lower(trim(p_email)) limit 1);
end;
$$;
revoke execute on function public.admin_find_user(text) from public, anon;
grant execute on function public.admin_find_user(text) to authenticated;
