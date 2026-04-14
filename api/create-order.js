// api/create-order.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // GİZLİ ANAHTAR BURADA KALDI!

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Sadece POST kabul edilir');

  try {
    const { urunId } = req.body;
    
    // İşlemi burada gizli anahtarla yapıyoruz
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: urunId, quantity: 1 }],
      mode: 'payment',
      success_url: 'https://siten.com/basarili',
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
