import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const EMAIL_DOMAIN = '@flortumol.app';

function normalizeUser(supabaseUser) {
  if (!supabaseUser) return null;
  return {
    id: supabaseUser.id,
    username:
      supabaseUser.user_metadata?.username ||
      supabaseUser.email?.replace(EMAIL_DOMAIN, '') ||
      `user_${supabaseUser.id.slice(0, 6)}`,
  };
}

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: sbSession } }) => {
      setSession(sbSession ? { user: normalizeUser(sbSession.user) } : null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sbSession) => {
      setSession(sbSession ? { user: normalizeUser(sbSession.user) } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signUp(username, password) {
    const normalizedUsername = String(username || '').trim().toLowerCase();
    if (!normalizedUsername) {
      setStatus('Kullanıcı adı gerekli.');
      return { ok: false, error: 'Kullanıcı adı gerekli.' };
    }
    if (!password || password.length < 6) {
      setStatus('Şifre en az 6 karakter olmalı.');
      return { ok: false, error: 'Şifre en az 6 karakter olmalı.' };
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: `${normalizedUsername}${EMAIL_DOMAIN}`,
      password,
      options: { data: { username: normalizedUsername } },
    });

    if (error) {
      setStatus(`Kayıt hatası: ${error.message}`);
      setLoading(false);
      return { ok: false, error: error.message };
    }

    setStatus('Kayıt başarılı!');
    setLoading(false);
    return { ok: true };
  }

  async function signIn(username, password) {
    const normalizedUsername = String(username || '').trim().toLowerCase();
    if (!normalizedUsername) {
      setStatus('Kullanıcı adı gerekli.');
      return { ok: false, error: 'Kullanıcı adı gerekli.' };
    }
    if (!password) {
      setStatus('Şifre gerekli.');
      return { ok: false, error: 'Şifre gerekli.' };
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: `${normalizedUsername}${EMAIL_DOMAIN}`,
      password,
    });

    if (error) {
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('invalid login') || msg.includes('invalid credentials')) {
        setStatus('Kullanıcı adı veya şifre hatalı.');
      } else {
        setStatus(`Giriş hatası: ${error.message}`);
      }
      setLoading(false);
      return { ok: false, error: error.message };
    }

    setStatus('Giriş yapıldı.');
    setLoading(false);
    return { ok: true };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setStatus('Çıkış yapıldı.');
  }

  return { session, user: session?.user, loading, status, signIn, signUp, signOut };
}
