-- 1. admin_upsert_thread_quick_facts function security fix
CREATE OR REPLACE FUNCTION "public"."admin_upsert_thread_quick_facts"("p_member_id" "uuid", "p_virtual_profile_id" "uuid", "p_notes" "text", "p_fallback_username" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_username text;
begin
  -- Added admin check to prevent unauthorized access by authenticated users
  if not public.is_admin() then
    raise exception 'Access denied: Requires admin privileges.';
  end if;

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

-- Ensure cleanup_stale_typing_states is only executed by service_role just in case
REVOKE ALL ON FUNCTION public.cleanup_stale_typing_states(integer) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_stale_typing_states(integer) TO service_role;

-- 2 & 3. Add explicit WITH CHECK to ALL policies that might miss it
DROP POLICY IF EXISTS "typing_states_owner" ON "public"."typing_states";
CREATE POLICY "typing_states_owner" ON "public"."typing_states"
FOR ALL TO authenticated
USING (auth.uid() = member_id)
WITH CHECK (auth.uid() = member_id);

DROP POLICY IF EXISTS "thread_metrics_admin" ON "public"."thread_metrics_daily";
CREATE POLICY "thread_metrics_admin" ON "public"."thread_metrics_daily"
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. Recreate missing triggers
DROP TRIGGER IF EXISTS "trg_members_create_profile_defaults" ON "public"."members";
CREATE TRIGGER "trg_members_create_profile_defaults" AFTER INSERT ON "public"."members" FOR EACH ROW EXECUTE FUNCTION "public"."ensure_member_profile_defaults"();

DROP TRIGGER IF EXISTS "trg_protect_member_credentials_from_placeholder_overwrite" ON "public"."members";
CREATE TRIGGER "trg_protect_member_credentials_from_placeholder_overwrite" BEFORE UPDATE ON "public"."members" FOR EACH ROW EXECUTE FUNCTION "public"."protect_member_credentials_from_placeholder_overwrite"();

DROP TRIGGER IF EXISTS "trg_sync_admin_threads_from_messages" ON "public"."messages";
CREATE TRIGGER "trg_sync_admin_threads_from_messages" AFTER INSERT OR DELETE OR UPDATE ON "public"."messages" FOR EACH ROW EXECUTE FUNCTION "public"."sync_admin_threads_from_messages"();

DROP TRIGGER IF EXISTS "trg_touch_typing_states_updated_at" ON "public"."typing_states";
CREATE TRIGGER "trg_touch_typing_states_updated_at" BEFORE UPDATE ON "public"."typing_states" FOR EACH ROW EXECUTE FUNCTION "public"."trg_touch_typing_states_updated_at"();
