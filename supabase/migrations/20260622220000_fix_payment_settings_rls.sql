-- Fix: Allow all authenticated users to SELECT payment_gateway_settings
-- Regular members need to read is_active, provider, webhook_url for coin checkout

DROP POLICY IF EXISTS "payment_gateway_settings_select" ON public.payment_gateway_settings;
CREATE POLICY "payment_gateway_settings_select" ON public.payment_gateway_settings FOR SELECT TO authenticated USING (true);