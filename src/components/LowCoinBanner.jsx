import { COIN_COST_PER_MESSAGE } from '../appConstants';

export default function LowCoinBanner({ memberProfile, setUserView }) {
  const balance = Number(memberProfile.coin_balance ?? 0);
  if (balance >= COIN_COST_PER_MESSAGE * 2) return null;

  return (
    <div className="bg-rose-50 border-b border-rose-200 px-6 py-3">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-rose-700">Düşük bakiye: Mesaj/reaksiyon başı {COIN_COST_PER_MESSAGE} jeton. Kalan bakiye ile en fazla {Math.floor(balance / COIN_COST_PER_MESSAGE)} işlem yapabilirsin.</p>
        <button onClick={() => setUserView('coins')} className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold">Jeton Yükle</button>
      </div>
    </div>
  );
}
