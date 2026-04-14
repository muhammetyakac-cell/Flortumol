import { createClient } from '@supabase/supabase-js';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metod yasak' });

  try {
    const { urunId, fiyat, kullaniciId } = req.body;

    // Supabase Admin Bağlantısı
    const supabaseAdmin = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Stripe Ödemesi Başlat
    const paymentIntent = await stripe.paymentIntents.create({
      amount: fiyat * 100, // Kuruş hesabı
      currency: 'try',
      metadata: { kullaniciId, urunId }
    });

    // 2. Veritabanına "Bekliyor" olarak kaydet
    const { error } = await supabaseAdmin
      .from('siparisler')
      .insert([{ 
        urun_id: urunId, 
        user_id: kullaniciId, 
        stripe_id: paymentIntent.id, 
        durum: 'bekliyor' 
      }]);

    if (error) throw error;

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
