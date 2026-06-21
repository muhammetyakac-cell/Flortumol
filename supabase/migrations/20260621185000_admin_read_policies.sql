-- Admin kullanıcıların tüm member_profiles ve members tablolarını okumasına izin ver
-- (Kayıtlı Kullanıcılar sayfasının çalışması için gerekli)

-- member_profiles tablosuna admin okuma politikası ekle
CREATE POLICY "member_profiles_admin_read" ON public.member_profiles
FOR SELECT TO authenticated
USING (public.is_admin());

-- members tablosuna admin okuma politikası ekle (yoksa)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'members' AND policyname = 'members_admin_read'
  ) THEN
    EXECUTE 'CREATE POLICY "members_admin_read" ON public.members FOR SELECT TO authenticated USING (public.is_admin())';
  END IF;
END $$;
