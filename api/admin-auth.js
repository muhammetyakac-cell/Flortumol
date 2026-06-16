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

    // Try sign-in first
    const { data: sessionData, error: signInError } = await adminClient.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });

    if (!signInError) {
      return json(res, 200, { ok: true, session: sessionData.session });
    }

    // Sign-in failed — try to create the admin user
    const { error: createError } = await adminClient.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password,
      email_confirm: true,
      user_metadata: { username: 'admin' },
      app_metadata: { role: 'admin' },
    });

    if (!createError) {
      // User was just created — sign in
      const { data: newSession, error: newSignInError } = await adminClient.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      });
      if (newSignInError) return json(res, 500, { ok: false, error: newSignInError.message });
      return json(res, 200, { ok: true, session: newSession.session });
    }

    // createUser failed because user already exists — find and update password
    let page = 0;
    let adminId = null;
    while (!adminId) {
      const { data: usersPage } = await adminClient.auth.admin.listUsers({ page: page + 1, perPage: 100 });
      const found = usersPage?.users?.find((u) => u.email === ADMIN_EMAIL);
      if (found) { adminId = found.id; break; }
      if (!usersPage?.users?.length) break;
      page++;
    }

    if (!adminId) {
      return json(res, 500, { ok: false, error: 'admin_user_not_found' });
    }

    await adminClient.auth.admin.updateUserById(adminId, { password });
    const { data: retrySession } = await adminClient.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });
    if (!retrySession?.session) return json(res, 500, { ok: false, error: 'login_failed' });
    return json(res, 200, { ok: true, session: retrySession.session });
  } catch (err) {
    return json(res, 500, { ok: false, error: err.message });
  }
}
