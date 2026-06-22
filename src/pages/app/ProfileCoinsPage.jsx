import { COIN_COST_PER_MESSAGE, TEST_CONTACT_NUMBER } from '../../appConstants';

export default function ProfileCoinsPage({
  userView, memberProfile, setMemberProfile, saveOwnProfile,
  uploadImage, requestCoinCheckout, coinCheckoutLoading,
  coinSuccessGuideOpen, setCoinSuccessGuideOpen,
  handleCoinPurchaseTest
}) {
  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-700 shadow-sm">
         <h2 className="text-2xl font-black text-white mb-6">{userView === 'profile' ? 'Profil Ayarları' : 'Jeton Cüzdanı'}</h2>
         {userView === 'profile' ? (
           <div className="space-y-4">
             <div className="flex items-center gap-6 mb-6">
               <div className="w-24 h-24 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                 {memberProfile.photo_url && <img loading="lazy" src={memberProfile.photo_url} alt="Profil fotoğrafınız" className="w-full h-full object-cover" />}
               </div>
               <label className="px-4 py-2 bg-slate-800 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl cursor-pointer transition-colors">
                 Fotoğraf Değiştir
                 <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if(f){ const url = await uploadImage(f, 'members'); if(url) setMemberProfile(s=>({...s, photo_url:url})); } }} />
               </label>
             </div>
             <input value={memberProfile.age} onChange={e=>setMemberProfile(s=>({...s, age:e.target.value}))} placeholder="Yaşınız" type="number" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none focus:border-fuchsia-400" />
             <input value={memberProfile.city} onChange={e=>setMemberProfile(s=>({...s, city:e.target.value}))} placeholder="Yaşadığınız Şehir" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none focus:border-fuchsia-400" />
             <textarea value={memberProfile.hobbies} onChange={e=>setMemberProfile(s=>({...s, hobbies:e.target.value}))} placeholder="Hobileriniz (virgülle ayırın)" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none focus:border-fuchsia-400 min-h-[100px]" />
             <button onClick={saveOwnProfile} className="w-full py-4 bg-surface-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md mt-4">Değişiklikleri Kaydet</button>
           </div>
         ) : (
           <div className="space-y-6">
             <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-center justify-between">
               <div>
                 <p className="text-sm font-bold text-amber-700 uppercase tracking-wider">Mevcut Bakiye</p>
                 <p className="text-4xl font-black text-amber-900">{memberProfile.coin_balance ?? 0} <span className="text-lg font-bold">Jeton</span></p>
               </div>
               <span className="text-5xl">🪙</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                 { amount: 500, label: 'Başlangıç', bonus: '+0 bonus', price: '₺99' },
                 { amount: 1200, label: 'Popüler Paket', bonus: '+120 bonus', price: '₺199', popular: true },
                 { amount: 2500, label: 'Power Paket', bonus: '+400 bonus', price: '₺349' },
               ].map((pkg) => (
                 <button key={pkg.amount} onClick={() => requestCoinCheckout(pkg.amount)} disabled={coinCheckoutLoading} className={`relative py-4 bg-slate-900 border rounded-2xl font-bold text-slate-200 flex flex-col items-center justify-center gap-1 shadow-sm transition-all active:scale-95 disabled:opacity-50 ${pkg.popular ? 'border-emerald-400 ring-2 ring-emerald-200' : 'border-slate-700 hover:border-emerald-300'}`}>
                   {pkg.popular && <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">En Popüler</span>}
                   <span className="text-emerald-500 text-xl">💎</span>
                   <span>{pkg.amount} Jeton</span>
                   <span className="text-xs text-slate-400">{pkg.label}</span>
                   <span className="text-xs font-bold text-emerald-700">{pkg.bonus}</span>
                   <span className="text-sm font-black text-white">{pkg.price}</span>
                 </button>
               ))}
             </div>

             {coinSuccessGuideOpen && (
               <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                 <div className="flex items-start justify-between gap-4">
                   <div>
                     <p className="text-sm font-black text-emerald-800">Satın alma başarılı 🎉 Jetonla neler yapabilirsin?</p>
                     <ul className="mt-2 text-xs text-emerald-900 list-disc pl-4 space-y-1">
                       <li>Yeni bir profile mesaj gönder: -{COIN_COST_PER_MESSAGE} jeton</li>
                       <li>Kalp/selam reaksiyonu gönder: -{COIN_COST_PER_MESSAGE} jeton</li>
                       <li>Daha hızlı eşleşme için aktif sohbet başlat</li>
                     </ul>
                   </div>
                   <button onClick={() => setCoinSuccessGuideOpen(false)} className="text-emerald-700 font-bold text-sm">Kapat</button>
                 </div>
               </div>
             )}

             <div className="mt-8 pt-6 border-t border-slate-800">
               <p className="text-xs text-slate-500 font-bold uppercase mb-3">Test Yükleme (Geliştirici Modu)</p>
               <div className="flex gap-2">
                 <input value={memberProfile.contact_phone || ''} onChange={(e) => setMemberProfile((prev) => ({ ...prev, contact_phone: e.target.value }))} placeholder={`Telefon (${TEST_CONTACT_NUMBER})`} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none focus:border-fuchsia-400" />
                 <button onClick={handleCoinPurchaseTest} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl whitespace-nowrap text-sm">5000 Yükle</button>
               </div>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}
