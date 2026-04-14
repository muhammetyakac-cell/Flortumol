const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Sadece POST isteklerini kabul ediyoruz
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { memberId, coinAmount, price, successUrl, cancelUrl } = req.body;

    // 1. DOĞRULAMA: Gerekli veriler gelmiş mi?
    if (!memberId || !coinAmount || !price) {
      return res.status(400).json({ error: 'Eksik bilgi: memberId, coinAmount ve price gerekli.' });
    }

    // 2. STRIPE CHECKOUT SESSION OLUŞTURMA
    // Bu yapı, kullanıcının önüne güvenli bir ödeme sayfası açar.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'try', // Veya 'usd'
            product_data: {
              name: `${coinAmount} Coin Paketi`,
              description: `${coinAmount} adet uygulama içi kredi.`,
            },
            unit_amount: Math.round(price * 100), // Kuruş cinsinden (Örn: 10.50 TL -> 1050)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      
      // SENİN WEBHOOK'UNUN BEKLEDİĞİ KRİTİK ALANLAR BURASI:
      // Webhook kodu 'member_id' ve 'coin_amount' isimlerini arıyor.
      metadata: {
        member_id: String(memberId), 
        coin_amount: String(coinAmount),
      },
      // Webhook'ta fallback olarak client_reference_id kullanılmış, onu da dolduralım:
      client_reference_id: String(memberId),

      success_url: successUrl || `https://flortumol.vercel.app/success`,
      cancel_url: cancelUrl || `https://flortumol.vercel.app/cancel`,
    });

    // 3. MOBİL UYGULAMAYA SESSION ID VE URL GÖNDER
    // Mobil uygulama bu URL'yi açarak ödeme sayfasına gider.
    res.status(200).json({ 
      id: session.id, 
      url: session.url 
    });

  } catch (err) {
    console.error('Stripe Error:', err);
    res.status(500).json({ error: err.message });
  }
}
