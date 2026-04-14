-- Fix legacy member references that break thread_quick_facts FK writes
-- Run this once in Supabase SQL editor.

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

-- Optional sanity check
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
