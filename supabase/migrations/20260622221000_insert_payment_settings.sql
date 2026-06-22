-- Insert default payment gateway settings if not exists
INSERT INTO public.payment_gateway_settings (id, provider, webhook_url, is_active, updated_at)
VALUES (1, 'stripe', '/api/create-checkout-session', true, now())
ON CONFLICT (id) DO UPDATE SET
  is_active = true,
  updated_at = now();
