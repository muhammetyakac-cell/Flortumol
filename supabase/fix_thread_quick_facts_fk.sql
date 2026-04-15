-- Quick Facts FK + 409 Conflict fix
-- Run in Supabase SQL Editor once.

-- 1) Backfill legacy member ids so FK references are satisfiable.
insert into public.members (id, username, password_hash)
select
  src.member_id,
  ('legacy_' || substr(replace(src.member_id::text, '-', ''), 1, 12))::text as username,
  ('legacy-' || replace(src.member_id::text, '-', ''))::text as password_hash
from (
  select member_id from public.thread_quick_facts
  union
  select member_id from public.messages
  union
  select member_id from public.member_profiles
  union
  select member_id from public.admin_threads
) as src
left join public.members m on m.id = src.member_id
where src.member_id is not null
  and m.id is null;

-- 2) Create privileged RPC to safely upsert quick facts.
create or replace function public.admin_upsert_thread_quick_facts(
  p_member_id uuid,
  p_virtual_profile_id uuid,
  p_notes text,
  p_fallback_username text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text;
begin
  v_username := coalesce(nullif(regexp_replace(lower(coalesce(p_fallback_username, '')), '[^a-z0-9_]+', '_', 'g'), ''), 'legacy_user');

  insert into public.members (id, username, password_hash)
  values (
    p_member_id,
    left(v_username || '_' || substr(replace(p_member_id::text, '-', ''), 1, 8), 36),
    'legacy-' || replace(p_member_id::text, '-', '')
  )
  on conflict (id) do nothing;

  insert into public.thread_quick_facts (member_id, virtual_profile_id, notes)
  values (p_member_id, p_virtual_profile_id, p_notes)
  on conflict (member_id, virtual_profile_id)
  do update set notes = excluded.notes, updated_at = now();
end;
$$;

grant execute on function public.admin_upsert_thread_quick_facts(uuid, uuid, text, text) to anon, authenticated;

-- 3) Optional check: should return 0 after backfill.
select count(*) as missing_members_after_fix
from (
  select member_id from public.thread_quick_facts
  union
  select member_id from public.messages
  union
  select member_id from public.member_profiles
  union
  select member_id from public.admin_threads
) src
left join public.members m on m.id = src.member_id
where src.member_id is not null and m.id is null;
