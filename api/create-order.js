const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // 1. ADIM: CORS Başlıklarını Ayarla
  // Mobil uygulamalar (Capacitor) farklı originlerden gelebilir, '*' hepsine izin verir.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 2. ADIM: Preflight (Ön Kontrol) İsteğini Yanıtla
  // Tarayıcılar asıl istekten önce "OPTIONS" ile izin var mı diye sorar.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. ADIM: Sadece POST İsteklerini Kabul Et
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { memberId, coinAmount, price, successUrl, cancelUrl } = req.body;

    // Doğrulama
    if (!memberId || !coinAmount || !price) {
      return res.status(400).json({ error: 'Eksik bilgi: memberId, coinAmount ve price gerekli.' });
    }

    // Stripe Checkout Session Oluşturma
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'try',
            product_data: {
              name: `${coinAmount} Coin Paketi`,
              description: `${coinAmount} adet uygulama içi kredi.`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        member_id: String(memberId), 
        coin_amount: String(coinAmount),
      },
      client_reference_id: String(memberId),
      success_url: successUrl || `https://flortumol.vercel.app/success`,
      cancel_url: cancelUrl || `https://flortumol.vercel.app/cancel`,
    });

    // Sonuç Gönder
    res.status(200).json({ 
      id: session.id, 
      url: session.url 
    });

  } catch (err) {
    console.error('Stripe Error:', err);
    res.status(500).json({ error: err.message });
  }
}
