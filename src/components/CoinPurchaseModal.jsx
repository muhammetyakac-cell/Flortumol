export default function CoinPurchaseModal({ coinPurchaseModalOpen, isAdmin, setCoinPurchaseModalOpen, setZeroCoinPromptDismissed, setUserView }) {
  if (!coinPurchaseModalOpen || isAdmin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm">
      <div className="bg-slate-900 p-8 rounded-[2rem] max-w-sm w-full shadow-2xl border border-slate-800">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-2xl mb-4">😮</div>
        <h3 className="text-2xl font-black text-white mb-2">Jetonun Bitti!</h3>
        <p className="text-sm font-medium text-slate-400 mb-6">Sohbete veya etkileşime devam edebilmek için cüzdanına jeton eklemen gerekiyor.</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => { setZeroCoinPromptDismissed(false); setCoinPurchaseModalOpen(false); setUserView('coins'); }} className="w-full py-3.5 bg-surface-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md">Jeton Satın Al</button>
          <button onClick={() => { setZeroCoinPromptDismissed(true); setCoinPurchaseModalOpen(false); }} className="w-full py-3.5 bg-slate-800 hover:bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-700">Kapat</button>
        </div>
      </div>
    </div>
  );
}
