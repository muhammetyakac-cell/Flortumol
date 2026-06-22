import { Link } from 'react-router-dom';

export default function Header({
  loggedIn, isAdmin, memberSession, userView, setUserView, adminTab, setAdminTab,
  memberProfile, totalUnreadCount, handleSignOut, mode, setMode, setShowAuthModal
}) {
  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-all ${isAdmin ? 'bg-surface-900/95 border-slate-800' : 'bg-slate-900/80 border-slate-700'} px-6 py-4 shadow-sm`}>
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {loggedIn ? (
          <button
            type="button"
            onClick={() => { if (!isAdmin) setUserView('discover'); }}
            className={`text-2xl font-black tracking-tight flex items-center gap-2 ${!isAdmin ? 'cursor-pointer' : 'cursor-default'}`}
            title={!isAdmin ? 'Keşfet sayfasına dön' : undefined}
          >
            <img loading="lazy" src="/favicon.svg" className="w-8 h-8" alt="Sevgili Bul Logo" width="32" height="32" />
            <span className={isAdmin ? 'text-white' : 'bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-accent-500'}>Sevgili Bul</span>
          </button>
        ) : (
          <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2 cursor-pointer">
            <img loading="lazy" src="/favicon.svg" className="w-8 h-8" alt="Sevgili Bul Logo" width="32" height="32" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-accent-500">Sevgili Bul</span>
          </Link>
        )}
        <div className="flex items-center gap-4">
          {isAdmin && loggedIn && (
            <nav className="hidden md:flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
              {['chat', 'stats', 'settings', 'payments'].map((tab) => (
                <button key={tab} onClick={() => setAdminTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${adminTab === tab ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}>
                  {tab === 'chat' ? 'Sohbetler' : tab === 'stats' ? 'İstatistikler' : tab === 'settings' ? 'Ayarlar' : 'Ödemeler'}
                </button>
              ))}
            </nav>
          )}

          {loggedIn && !isAdmin && (
            <div className="hidden md:flex items-center gap-3">
              <nav className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-700/50 shadow-sm backdrop-blur-md">
                {['discover', 'chat', 'profile', 'coins'].map((view) => (
                  <button key={view} onClick={() => setUserView(view)} className={`relative px-5 py-2 text-sm font-bold rounded-xl capitalize transition-all duration-300 ${userView === view ? 'bg-surface-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                    {view === 'discover' ? 'Keşfet' : view === 'chat' ? 'Mesajlar' : view === 'profile' ? 'Profil' : 'Cüzdan'}
                    {view === 'chat' && totalUnreadCount > 0 && <span className="absolute top-2 right-3 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />}
                  </button>
                ))}
              </nav>
              <button
                onClick={() => setUserView('coins')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm font-extrabold shadow-sm hover:bg-amber-100 transition-colors"
                title="Jeton bakiyesi"
              >
                <span aria-hidden="true">🪙</span>
                <span>{memberProfile.coin_balance ?? 0} jeton</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 border-l pl-4 border-slate-700/20">
             {!loggedIn && (
              <button onClick={() => { setMode(mode === 'user' ? 'admin' : 'user'); setShowAuthModal(true); }} className={`text-sm font-semibold underline underline-offset-4 transition-colors ${isAdmin ? 'text-slate-300 hover:text-white' : 'text-slate-400 hover:text-white'}`}>
                {mode === 'user' ? 'Admin Girişi' : 'Kullanıcı Girişi'}
              </button>
            )}
            {loggedIn && (
              <button onClick={handleSignOut} className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${isAdmin ? 'bg-slate-800 text-rose-400 hover:bg-slate-700' : 'bg-slate-800 text-slate-700 hover:bg-slate-200'}`}>Çıkış</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}