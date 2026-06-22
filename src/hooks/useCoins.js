import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { DEFAULT_CHECKOUT_ENDPOINT, TEST_CONTACT_NUMBER, COIN_COST_PER_MESSAGE, resolveCheckoutEndpoint } from '../appConstants';

export default function useCoins({ memberSession, isAdmin, loggedIn, memberProfile, setMemberProfile, setStatus, userView, adminTab }) {
  const [coinPurchaseModalOpen, setCoinPurchaseModalOpen] = useState(false);
  const [zeroCoinPromptDismissed, setZeroCoinPromptDismissed] = useState(false);
  const [coinCheckoutLoading, setCoinCheckoutLoading] = useState(false);
  const [coinSpendFeedback, setCoinSpendFeedback] = useState('');
  const [coinSuccessGuideOpen, setCoinSuccessGuideOpen] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState({ provider: '', webhook_url: DEFAULT_CHECKOUT_ENDPOINT, is_active: false });

  useEffect(() => {
    if (!loggedIn || isAdmin) return;
    const balance = Number(memberProfile.coin_balance ?? 0);
    if (balance <= 0 && !zeroCoinPromptDismissed) {
      setCoinPurchaseModalOpen(true);
      return;
    }
    if (balance > 0 && zeroCoinPromptDismissed) {
      setZeroCoinPromptDismissed(false);
    }
  }, [loggedIn, isAdmin, memberProfile.coin_balance, zeroCoinPromptDismissed]);

  useEffect(() => {
    if (!coinSpendFeedback) return;
    const timeoutId = window.setTimeout(() => setCoinSpendFeedback(''), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [coinSpendFeedback]);

  useEffect(() => {
    if (typeof window === 'undefined' || isAdmin) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('coin_purchase') === 'success' || params.get('payment') === 'success') {
      setCoinSuccessGuideOpen(true);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!memberSession || isAdmin || userView !== 'coins') return;
    fetchPublicPaymentSettings();
  }, [memberSession, isAdmin, userView]);

  useEffect(() => {
    if (!isAdmin || adminTab !== 'payments') return;
    fetchPaymentSettings();
  }, [isAdmin, adminTab]);

  async function fetchPaymentSettings() {
    const { data, error } = await supabase.from('payment_gateway_settings').select('provider, webhook_url, is_active').eq('id', 1).maybeSingle();
    if (!error && data) setPaymentSettings({ provider: data.provider || '', webhook_url: data.webhook_url || DEFAULT_CHECKOUT_ENDPOINT, is_active: !!data.is_active });
  }

  async function fetchPublicPaymentSettings() {
    const { data, error } = await supabase.from('payment_gateway_settings').select('provider, webhook_url, is_active').eq('id', 1).maybeSingle();
    if (!error && data) setPaymentSettings((prev) => ({ ...prev, provider: data.provider || '', webhook_url: data.webhook_url || DEFAULT_CHECKOUT_ENDPOINT, is_active: !!data.is_active }));
  }

  async function savePaymentSettings() {
    const { error } = await supabase.from('payment_gateway_settings').upsert({
      id: 1,
      provider: paymentSettings.provider,
      webhook_url: resolveCheckoutEndpoint(paymentSettings.webhook_url),
      is_active: paymentSettings.is_active,
    }, { onConflict: 'id' });
    if (error) return setStatus(error.message);
    setStatus('Ödeme API ayarları kaydedildi.');
  }

  async function consumeCoins(amount) {
    if (!memberSession || isAdmin) return true;
    const current = Number(memberProfile.coin_balance || 0);
    if (current < amount) return false;

    const nextBalance = current - amount;
    const { error } = await supabase.from('member_profiles').update({ coin_balance: nextBalance }).eq('member_id', memberSession.id);
    if (error) { setStatus(error.message); return false; }

    setMemberProfile((prev) => ({ ...prev, coin_balance: nextBalance }));
    setCoinSpendFeedback(`-${amount} jeton`);
    return true;
  }

  async function requestCoinCheckout(coinAmount) {
    if (!memberSession) return;
    if (!paymentSettings.is_active) return setStatus('Ödeme sistemi aktif değil.');
    setCoinCheckoutLoading(true);
    try {
      const response = await fetch(resolveCheckoutEndpoint(paymentSettings.webhook_url), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberSession.id, coin_amount: coinAmount, provider: paymentSettings.provider || 'stripe', source: 'flortbeta_member_coins_page' }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Checkout endpoint hata döndürdü.');
      if (!result.url) throw new Error('Checkout endpoint geçerli bir url döndürmedi.');
      window.location.href = result.url;
    } catch (err) { setStatus(err.message || 'Checkout yönlendirmesi sırasında hata oluştu.'); }
    finally { setCoinCheckoutLoading(false); }
  }

  async function handleCoinPurchaseTest() {
    if (!memberSession) return;
    if ((memberProfile.contact_phone || '').trim() !== TEST_CONTACT_NUMBER) {
      return setStatus(`Test için iletişim numarasını ${TEST_CONTACT_NUMBER} girmen gerekiyor.`);
    }

    const nextBalance = Number(memberProfile.coin_balance || 0) + 5000;
    const { error } = await supabase.from('member_profiles').upsert({ member_id: memberSession.id, coin_balance: nextBalance, contact_phone: memberProfile.contact_phone }, { onConflict: 'member_id' });
    if (error) return setStatus(error.message);
    setMemberProfile((prev) => ({ ...prev, coin_balance: nextBalance }));
    setCoinSuccessGuideOpen(true);
    setStatus('Test satın alma başarılı: 5000 jeton yüklendi.');
  }

  return {
    coinPurchaseModalOpen, setCoinPurchaseModalOpen,
    zeroCoinPromptDismissed, setZeroCoinPromptDismissed,
    coinCheckoutLoading, setCoinCheckoutLoading,
    coinSpendFeedback, setCoinSpendFeedback,
    coinSuccessGuideOpen, setCoinSuccessGuideOpen,
    paymentSettings, setPaymentSettings,
    consumeCoins, requestCoinCheckout, handleCoinPurchaseTest,
    fetchPaymentSettings, fetchPublicPaymentSettings, savePaymentSettings,
  };
}
