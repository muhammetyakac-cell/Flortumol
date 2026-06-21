-- PRE-FLIGHT FIX: Move the admin privileges to the actual auth.users table 
-- to prevent locking the genuine admin out.
UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(coalesce(raw_app_meta_data,'{}'::jsonb), '{role}', '"admin"')
  WHERE id IN (SELECT id FROM public.members WHERE username = 'admin');

-- Change the username of the existing 'admin' to something safe so the CHECK constraint can pass
UPDATE public.members
  SET username = 'admin_' || substr(id::text, 1, 6)
  WHERE username = 'admin';

-- SECURITY PATCH: Bulgu 1 & 4
-- is_admin() fonksiyonunu güvenli hale getir
CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select 
    coalesce(auth.jwt() ->> 'role', '') = 'service_role'
    or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

-- "admin", "root" gibi isimleri bloke et
ALTER TABLE public.members
  DROP CONSTRAINT IF EXISTS members_username_reserved_blocklist;

ALTER TABLE public.members
  ADD CONSTRAINT members_username_reserved_blocklist
  CHECK (lower(username) NOT IN ('admin', 'administrator', 'root', 'system', 'moderator', 'support'));

-- SECURITY PATCH: Bulgu 16
-- admin_upsert_thread_quick_facts fonksiyonunu anon ve yetkisiz erişimden koru
REVOKE ALL ON FUNCTION public.admin_upsert_thread_quick_facts(uuid, uuid, text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_upsert_thread_quick_facts(uuid, uuid, text, text) TO service_role;
REVOKE EXECUTE ON FUNCTION public.admin_upsert_thread_quick_facts(uuid, uuid, text, text) FROM anon;

-- SECURITY PATCH: Bulgu 2 & 3
-- member_sign_in ve member_sign_up fonksiyonlarını (DDoS ve Enumeration koruması) anonim erişime kapat
REVOKE ALL ON FUNCTION public.member_sign_in(text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.member_sign_in(text, text) TO service_role;

REVOKE ALL ON FUNCTION public.member_sign_up(text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.member_sign_up(text, text) TO service_role;

-- SECURITY PATCH: Bulgu 17
-- cleanup_stale_typing_states fonksiyonunu anonim erişime kapat
REVOKE ALL ON FUNCTION public.cleanup_stale_typing_states(integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.cleanup_stale_typing_states(integer) TO authenticated, service_role;
