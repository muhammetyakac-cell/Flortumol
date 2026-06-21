-- Adminlerin member_profiles tablosuna veri eklemesine, düzenlemesine ve silmesine izin ver
-- (Profil güncelleme, jeton ekleme/çıkarma vb. işlemler için gereklidir)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'member_profiles' AND policyname = 'member_profiles_admin_all'
  ) THEN
    CREATE POLICY "member_profiles_admin_all" ON public.member_profiles
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
  END IF;
END $$;
