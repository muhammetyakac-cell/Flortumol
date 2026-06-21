-- STAGE 3 SECURITY PATCHES

-- 1. Realtime Publication Sızıntısı (Bulgu 19)
-- admin_threads (gizli panel verileri) realtime yayından çıkarılıyor
ALTER PUBLICATION "supabase_realtime" DROP TABLE "public"."admin_threads";

-- 2. members.username Case-Sensitivity (Büyük/Küçük Harf) Açığı (Bulgu 10)
-- Eskiyi silip, lower(username) üzerinden yepyeni bir eşsizlik kuralı getiriyoruz
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_username_key;
CREATE UNIQUE INDEX IF NOT EXISTS members_username_lower_idx ON public.members (lower(username));

-- 3. Spam Koruması (DDoS / Rate Limiting - Bulgu 7)
-- engagement_events: Saatte 100'den fazla etkileşim atılmasını engelleyen basit bir hız sınırı (rate limit) trigger'ı
CREATE OR REPLACE FUNCTION public.throttle_engagement_events()
RETURNS trigger AS $$
BEGIN
  IF (SELECT count(*) FROM public.engagement_events 
      WHERE member_id = NEW.member_id 
      AND created_at > now() - interval '1 hour') > 100 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Saniyede çok fazla istek atıldı. (DDoS Koruması)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sadece postgres (admin) yetkisiyle oluşturulan bu trigger'ı tabloya bağla
DROP TRIGGER IF EXISTS trg_throttle_engagement_events ON public.engagement_events;
CREATE TRIGGER trg_throttle_engagement_events
BEFORE INSERT ON public.engagement_events
FOR EACH ROW EXECUTE FUNCTION public.throttle_engagement_events();

-- 4. Admin Logları WITH CHECK eksikliği (Bulgu 13 & 14)
-- admin_actions_log ve kpi_snapshots_daily için WITH CHECK ekliyoruz
DROP POLICY IF EXISTS "admin_actions_admin" ON public.admin_actions_log;
CREATE POLICY "admin_actions_admin" ON public.admin_actions_log TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "kpi_snapshots_admin" ON public.kpi_snapshots_daily;
CREATE POLICY "kpi_snapshots_admin" ON public.kpi_snapshots_daily TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
