import { COIN_COST_PER_MESSAGE } from '../../appConstants';

export default function DiscoverPage({
  discoverProfiles, sortedProfiles, cityFilter, setCityFilter, genderFilter, setGenderFilter,
  profileSearch, setProfileSearch, discoverSort, setDiscoverSort, effectiveOnlineProfiles,
  memberProfile, interestScore, totalUnreadCount, activeProfileCount, spotlightProfiles,
  userProfileRenderCount, setUserProfileRenderCount, userView, setUserView,
  heartedProfiles, setHeartedProfiles, wavedProfiles, setWavedProfiles,
  selectedProfileId, setSelectedProfileId, setMobileViewMode,
  sendReaction, openChatWithProfile, handleUserProfileListScroll, profileListRef
}) {
  return (
    <div className="space-y-6 relative">
      <div className="pointer-events-none absolute -top-6 -left-6 w-44 h-44 bg-fuchsia-200/50 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute top-20 right-0 w-56 h-56 bg-indigo-200/40 blur-3xl rounded-full" />

      <div className="relative overflow-hidden rounded-[2rem] p-4 md:p-6 border border-slate-700/80 shadow-md bg-slate-900/90">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-500/20 to-accent-500/20 blur-2xl rounded-full" />
        <h2 className="relative text-3xl font-black text-white tracking-tight mb-2">Yeni Yüzler Keşfet ✨</h2>
        <p className="relative text-slate-200 font-semibold max-w-2xl">Filtreleri kullanarak kriterlerine uygun profilleri bul ve hemen etkileşime geç.</p>
        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-400">Cüzdan</p>
            <p className="text-lg font-black text-amber-200">{memberProfile.coin_balance ?? 0} jeton</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Mesaj Maliyeti</p>
            <p className="text-lg font-black text-slate-200">{COIN_COST_PER_MESSAGE} jeton</p>
          </div>
          <button onClick={() => setUserView('coins')} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-left hover:bg-emerald-500/20 transition-all hover:scale-[1.02] active:scale-100">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-400">Hızlı İşlem</p>
            <p className="text-lg font-black text-emerald-200">Jeton satın al →</p>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="rounded-2xl bg-slate-900/70 border border-slate-700/70 px-4 py-3 backdrop-blur-md">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Aktif Profil</p>
            <p className="text-xl font-black text-white">{activeProfileCount}</p>
          </div>
          <div className="rounded-2xl bg-slate-900/70 border border-slate-700/70 px-4 py-3 backdrop-blur-md">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Okunmamış Mesaj</p>
            <p className="text-xl font-black text-rose-600">{totalUnreadCount}</p>
          </div>
          <div className="rounded-2xl bg-slate-900/70 border border-slate-700/70 px-4 py-3 backdrop-blur-md">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Uyum Skoru (Örnek)</p>
            <p className="text-xl font-black text-indigo-400">%{interestScore}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col md:flex-row items-center gap-3 bg-slate-800 p-2 rounded-2xl border border-slate-800">
          <input value={profileSearch} onChange={(e)=>setProfileSearch(e.target.value)} placeholder="🔍 İsim veya hobi ara..." className="w-full md:w-auto flex-1 bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl text-sm font-medium outline-none focus:border-fuchsia-400" />
          <select value={genderFilter} onChange={(e)=>setGenderFilter(e.target.value)} className="w-full md:w-40 bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl text-sm font-medium outline-none focus:border-fuchsia-400">
            <option value="all">Tüm Cinsiyetler</option>
            <option value="Kadın">Kadın</option>
            <option value="Erkek">Erkek</option>
          </select>
          <input value={cityFilter} onChange={(e)=>setCityFilter(e.target.value)} placeholder="📍 Şehir..." className="w-full md:w-48 bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl text-sm font-medium outline-none focus:border-fuchsia-400" />
        </div>
      </div>

      {!!spotlightProfiles.length && (
        <div className="bg-slate-900 rounded-[2rem] border border-slate-700 shadow-sm p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-white">Bugünün Öne Çıkanları</h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800/30">Editor's pick</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spotlightProfiles.slice(0, 3).map((profile) => (
              <button key={`spot-${profile.id}`} onClick={() => openChatWithProfile(profile.id)} className="group relative overflow-hidden rounded-2xl h-64 text-left border border-slate-700 shadow-md">
                {profile.photo_url ? (
                  <img loading="lazy" src={profile.photo_url} alt={`${profile.name} profil fotoğrafı`} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-lg leading-tight truncate">{profile.name}, {profile.age}</p>
                  <p className="text-slate-200 text-xs font-semibold mt-1 truncate">📍 {profile.city || 'Belirtilmemiş'} • Sohbeti Başlat</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {discoverProfiles.map(profile => (
          <div key={profile.id} className="group bg-slate-900/95 backdrop-blur-sm rounded-3xl border border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="relative h-72 overflow-hidden bg-slate-800">
              {profile.photo_url ? (
                <img loading="lazy" src={profile.photo_url} alt={`${profile.name} profil fotoğrafı`} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-black text-slate-300">{profile.name.slice(0,1)}</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white leading-tight">{profile.name}, {profile.age}</h3>
                  {effectiveOnlineProfiles[profile.id] && <span className="w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full" title="Çevrimiçi" />}
                </div>
                <p className="text-xs font-semibold text-slate-300 flex items-center gap-1">📍 {profile.city || 'Belirtilmemiş'}</p>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {profile.hobbies.split(',').slice(0,3).map(h => h.trim() && <span key={h} className="text-[10px] font-bold px-2 py-1 bg-slate-800 text-slate-300 rounded-md">{h}</span>)}
              </div>
              <div className="mt-auto grid grid-cols-3 gap-2">
                 <button onClick={() => { setHeartedProfiles(s => ({...s, [profile.id]: true})); sendReaction(profile.id, 'heart'); }} className={`py-2.5 rounded-xl text-[11px] font-bold transition-colors ${heartedProfiles[profile.id] ? 'bg-rose-100 text-rose-600' : 'bg-slate-800 text-slate-300 hover:bg-slate-800'}`}>❤️ -{COIN_COST_PER_MESSAGE}</button>
                 <button onClick={() => { setWavedProfiles(s => ({...s, [profile.id]: true})); sendReaction(profile.id, 'wave'); }} className={`py-2.5 rounded-xl text-[11px] font-bold transition-colors ${wavedProfiles[profile.id] ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-800 text-slate-300 hover:bg-slate-800'}`}>👋 -{COIN_COST_PER_MESSAGE}</button>
                 <button onClick={() => openChatWithProfile(profile.id)} className="py-2.5 rounded-xl text-sm font-bold bg-surface-900 hover:bg-slate-800 text-white shadow-md">Mesaj</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
