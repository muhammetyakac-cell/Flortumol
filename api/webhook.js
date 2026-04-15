import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

// Vercel'in ham veriyi (raw body) işlemesi için şart
export const config = {
  api: {
    bodyParser: false,
  },
};

function json(res, status, payload) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');
  res.status(status).setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(payload));
}

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function verifyStripeSignature(rawBody, signatureHeader, webhookSecret) {
  if (!signatureHeader || !webhookSecret) return false;
  const entries = String(signatureHeader).split(',').map(p => p.trim()).filter(Boolean);
  const timestamp = entries.find(p => p.startsWith('t='))?.slice(2);
  const signatures = entries.filter(p => p.startsWith('v1=')).map(p => p.slice(3));
  if (!timestamp || !signatures.length) return false;

  const signedPayload = `${timestamp}.${rawBody.toString('utf8')}`;
  const expected = crypto.createHmac('sha256', webhookSecret).update(signedPayload, 'utf8').digest('hex');
  return signatures.some(sig => crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex')));
}

export default async function handler(req, res) {
  // CORS Ön Kontrolü
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'method_not_allowed' });
  }

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
    const rawBody = await getRawBody(req);
    const signatureHeader = req.headers['stripe-signature'];

    if (!verifyStripeSignature(rawBody, signatureHeader, webhookSecret)) {
      return json(res, 400, { ok: false, error: 'invalid_signature' });
    }

    const event = JSON.parse(rawBody.toString('utf8'));

    // Sadece ödeme başarılı olaylarını dinliyoruz
    if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.async_payment_succeeded') {
      return json(res, 200, { ok: true, ignored: true });
    }

    const session = event.data.object;
    const memberId = session.metadata?.member_id || session.client_reference_id;
    const coinAmount = Number(session.metadata?.coin_amount || 0);

    if (!memberId || coinAmount <= 0) {
      return json(res, 400, { ok: false, error: 'invalid_metadata' });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const admin = createClient(supabaseUrl, serviceRoleKey);

    // FIX: Sadece 'member_profiles' tablosunda coin güncellemesi yapıyoruz.
    // 'members' tablosuna dokunmuyoruz ki kullanıcı adı ve şifre ezilmesin.

    // 1. Mevcut bakiyeyi al
    const { data: profile, error: readError } = await admin
      .from('member_profiles')
      .select('coin_balance')
      .eq('member_id', memberId)
      .maybeSingle();

    if (readError) throw readError;
    if (!profile) {
       // Eğer profil hiç yoksa (beklenmedik bir durum), yeni profil oluştur
       const { error: insertError } = await admin
         .from('member_profiles')
         .insert({ member_id: memberId, coin_balance: coinAmount });
       if (insertError) throw insertError;
    } else {
       // 2. Yeni bakiyeyi hesapla ve mevcut profili güncelle
       const currentBalance = Number(profile?.coin_balance || 0);
       const nextBalance = currentBalance + coinAmount;

       const { error: writeError } = await admin
         .from('member_profiles')
         .update({ coin_balance: nextBalance })
         .eq('member_id', memberId);

       if (writeError) throw writeError;
    }

    return json(res, 200, { ok: true, added: coinAmount });
  } catch (error) {
    return json(res, 500, { ok: false, error: error.message });
  }
}
