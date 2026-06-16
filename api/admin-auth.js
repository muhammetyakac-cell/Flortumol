import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'admin@flortumol.app';

function json(res, status, payload) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(status).setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'method_not_allowed' });
  }

  try {
    const { password } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    if (!password) {
      return json(res, 400, { ok: false, error: 'password_required' });
    }

    const adminPassword1 = process.env.ADMIN_PASSWORD?.trim();
    const adminPassword2 = process.env.ADMIN_PASSWORD2?.trim();

    if (!adminPassword1 && !adminPassword2) {
      return json(res, 500, { ok: false, error: 'admin_not_configured' });
    }

    const isValid = (password === adminPassword1) || (password === adminPassword2);
    if (!isValid) {
      return json(res, 401, { ok: false, error: 'invalid_password' });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return json(res, 500, { ok: false, error: 'supabase_not_configured' });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const existingAdmin = existingUsers?.users?.find((u) => u.email === ADMIN_EMAIL);

    if (!existingAdmin) {
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password,
        email_confirm: true,
        user_metadata: { username: 'admin' },
        app_metadata: { role: 'admin' },
      });

      if (createError) {
        return json(res, 500, { ok: false, error: createError.message });
      }

      const { data: sessionData, error: signInError } = await adminClient.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      });

      if (signInError) {
        return json(res, 500, { ok: false, error: signInError.message });
      }

      return json(res, 200, { ok: true, session: sessionData.session });
    }

    const { data: sessionData, error: signInError } = await adminClient.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });

    if (signInError) {
      await adminClient.auth.admin.updateUserById(existingAdmin.id, { password });
      const { data: retrySession } = await adminClient.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      });
      if (!retrySession?.session) {
        return json(res, 500, { ok: false, error: 'login_failed' });
      }
      return json(res, 200, { ok: true, session: retrySession.session });
    }

    return json(res, 200, { ok: true, session: sessionData.session });
  } catch (err) {
    return json(res, 500, { ok: false, error: err.message });
  }
}
