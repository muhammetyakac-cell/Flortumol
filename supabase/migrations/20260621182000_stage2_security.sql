-- STAGE 2 SECURITY PATCHES

-- 1. payment_gateway_settings (Bulgu 6)
-- Sızıntıyı önlemek için sadece adminlerin okuyabileceği şekilde kısıtlama
DROP POLICY IF EXISTS "payment_gateway_settings_select" ON public.payment_gateway_settings;
CREATE POLICY "payment_gateway_settings_select" ON public.payment_gateway_settings FOR SELECT TO authenticated USING (is_admin());

-- 2. messages (Bulgu 5, 9, 29)
-- İçerik limiti ekle (DDoS/Storage Quota koruması)
ALTER TABLE public.messages ADD CONSTRAINT "messages_content_length_check" CHECK (length(content) <= 2000);

-- INSERT işlemi için sahteciliği (impersonation) önle
-- Üyeler sadece kendileri olarak (member) mesaj atabilir. Admin her role girebilir.
DROP POLICY IF EXISTS "messages_owner_or_admin_all" ON public.messages;
CREATE POLICY "messages_owner_or_admin_all" ON public.messages TO authenticated
USING (member_id = auth.uid() OR is_admin())
WITH CHECK (
  (member_id = auth.uid() AND sender_role = 'member') OR is_admin()
);

-- 3. member_mood_history (Bulgu 11)
-- FK bağlantısını auth.users'dan public.members'a geçir
ALTER TABLE public.member_mood_history DROP CONSTRAINT IF EXISTS "member_mood_history_member_id_fkey";
ALTER TABLE public.member_mood_history ADD CONSTRAINT "member_mood_history_member_id_fkey" FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE;

-- 4. sync_admin_threads_from_messages (Bulgu 4 vb.)
-- Tetikleyici fonksiyonları anonim ve genel erişime kapat
REVOKE ALL ON FUNCTION public.sync_admin_threads_from_messages() FROM public, anon;
