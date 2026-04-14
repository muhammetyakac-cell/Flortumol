// api/get-config.js

export default function handler(req, res) {
  // 1. ADIM: Sadece GÜVENLİ olan anahtarları Vercel'den çekiyoruz
  // Bunlar kullanıcının telefonuna gitmesinde sakınca olmayanlar
  const publicConfig = {
    supabaseUrl: process.env.VITE_SUPABASE_URL,
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
    stripePublicKey: process.env.VITE_STRIPE_PUBLIC_KEY,
  };

  // 2. ADIM: Güvenlik Filtresi (İsteğe Bağlı)
  // Sadece senin uygulamanın erişmesini istiyorsan basit bir kontrol ekleyebilirsin
  // Ama başlangıç için direkt göndermek en kolayıdır.

  // 3. ADIM: Yanıtı Gönder
  res.status(200).json(publicConfig);
}
