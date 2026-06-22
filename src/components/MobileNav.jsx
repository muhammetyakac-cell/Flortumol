export default function MobileNav({ loggedIn, isAdmin, adminTab, setAdminTab, userView, setUserView, setMobileViewMode, totalUnreadCount, memberProfile }) {
  if (!loggedIn) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 py-2 px-6 flex items-center justify-around shadow-[0_-8px_30px_rgb(0,0,0,0.4)]">
      {isAdmin ? (
        ['chat', 'stats', 'settings', 'payments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setAdminTab(tab)}
            className={`flex flex-col items-center gap-1 text-xs font-bold transition-all ${adminTab === tab ? 'text-brand-400 scale-105' : 'text-slate-400'}`}
          >
            <span className="text-xl">
              {tab === 'chat' ? '💬' : tab === 'stats' ? '📊' : tab === 'settings' ? '⚙️' : '💳'}
            </span>
            <span className="text-[10px]">
              {tab === 'chat' ? 'Sohbet' : tab === 'stats' ? 'İstatistik' : tab === 'settings' ? 'Ayarlar' : 'Ödemeler'}
            </span>
          </button>
        ))
      ) : (
        [
          { view: 'discover', label: 'Keşfet', icon: '✨' },
          { view: 'chat', label: 'Mesajlar', icon: '💬', badge: totalUnreadCount > 0 },
          { view: 'profile', label: 'Profil', icon: '👤' },
          { view: 'coins', label: 'Cüzdan', icon: '🪙', sub: `${memberProfile.coin_balance ?? 0} Jet` }
        ].map((tab) => (
          <button
            key={tab.view}
            onClick={() => {
              setUserView(tab.view);
              if (tab.view === 'chat') setMobileViewMode('list');
            }}
            className={`relative flex flex-col items-center gap-1 text-xs font-bold transition-all ${userView === tab.view ? 'text-brand-400 scale-105' : 'text-slate-400'}`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px]">{tab.sub && userView !== tab.view ? tab.sub : tab.label}</span>
            {tab.badge && <span className="absolute top-0.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border border-slate-900 animate-pulse" />}
          </button>
        ))
      )}
    </nav>
  );
}
