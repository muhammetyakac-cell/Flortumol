-- Fix admin role logic to avoid reserved 'role' keyword in app_metadata
CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select 
    coalesce(auth.jwt() ->> 'role', '') = 'service_role'
    or coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false') = 'true'
    or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;
