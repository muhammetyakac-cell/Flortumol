export default function AuthModal({ showAuthModal, setShowAuthModal, mode, authForm, setAuthForm, handleSignIn, handleSignUp, loading, setMode }) {
  if (!showAuthModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) setShowAuthModal(false); }}
      role="dialog"
      aria-modal="true"
      aria-label="Giriş veya Kayıt Ol"
    >
      <div className="w-full max-w-[900px] grid md:grid-cols-2 bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-700 animate-fade-in">
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <button
            onClick={() => setShowAuthModal(false)}
            className="self-end mb-4 text-slate-500 hover:text-slate-700 text-2xl leading-none"
            aria-label="Kapat"
          >✕</button>
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${mode === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-fuchsia-100 text-fuchsia-700'}`}>
              {mode === 'admin' ? 'YÖNETİCİ SİSTEMİ' : 'FLORT PLATFORMU'}
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {mode === 'admin' ? 'Kontrol Paneli' : 'Eşleşmeye Başla'}
            </h2>
            <p className="text-slate-400 mt-1 font-medium text-sm">Lütfen devam etmek için giriş yapın.</p>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder={mode === 'admin' ? 'Kullanıcı Adı Kapalı' : 'Kullanıcı Adı'}
              disabled={mode === 'admin'}
              value={mode === 'admin' ? '' : authForm.username}
              onChange={(e) => setAuthForm((st) => ({ ...st, username: e.target.value }))}
              className="w-full px-4 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all disabled:opacity-50"
            />
            <input
              type="password"
              placeholder="Şifreniz"
              value={authForm.password}
              onChange={(e) => setAuthForm((st) => ({ ...st, password: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSignIn(); }}
              className="w-full px-4 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
          </div>
          <div className="mt-6 space-y-3">
            <button onClick={handleSignIn} disabled={loading} className="w-full bg-surface-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-slate-900/20 transition-transform active:scale-[0.98]">
              {loading ? 'İşleniyor...' : 'Giriş Yap'}
            </button>
            {mode !== 'admin' && (
              <button onClick={handleSignUp} disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold py-3.5 rounded-2xl transition-transform active:scale-[0.98]">
                Yeni Hesap Oluştur
              </button>
            )}
          </div>
        </div>
        <div className="hidden md:flex relative bg-surface-900 p-10 flex-col justify-end overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 to-indigo-600/40 mix-blend-overlay" />
          <img loading="lazy" src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?fm=webp&fit=crop&w=1000&q=80" alt="Sevgili Bul - Canlı Sohbet Platformu" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />
          <div className="relative z-10 text-white">
            <h3 className="text-2xl font-black mb-2 leading-tight">Gerçek Kişilerle<br/>Canlı Sohbet Deneyimi</h3>
            <p className="text-slate-300 font-medium text-sm">Hemen katıl ve sana en uygun eşleşmeleri saniyeler içinde bul.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
