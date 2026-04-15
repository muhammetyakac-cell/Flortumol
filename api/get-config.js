export default function handler(req, res) {
  // 1. ADIM: CORS Başlıklarını Ayarla
  // Mobil uygulamalar için '*' (herkese açık) en sorunsuz yöntemdir.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 2. ADIM: Preflight (Ön Kontrol) İsteğini Yanıtla
  // Tarayıcı/WebView gerçek veriyi istemeden önce "Bana izin var mı?" diye OPTIONS atar.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. ADIM: Verileri Hazırla
  // Vercel Panelindeki Environment Variables kısmındaki isimlerle birebir aynı olmalı.
  const publicConfig = {
    supabaseUrl: process.env.VITE_SUPABASE_URL,
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
    stripePublicKey: process.env.VITE_STRIPE_PUBLIC_KEY,
  };

  // 4. ADIM: Yanıtı Gönder
  // Eğer anahtarlardan biri eksikse null döner, kontrol etmekte fayda var.
  res.status(200).json(publicConfig);
}
