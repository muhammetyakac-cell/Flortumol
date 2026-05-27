import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function LandingPage({ setMode, setShowAuthModal }) {
  return (
    <div className="flex-1 flex flex-col">
      <Helmet>
        <title>Sevgili Bul - Yeni İnsanlarla Tanışın & Canlı Sohbet Edin</title>
        <meta name="description" content="Sevgili Bul ile Türkiye'nin dört bir yanından insanlarla tanışın. Güvenli, hızlı ve heyecanlı bir flört deneyimi sizi bekliyor." />
      </Helmet>
      {/* --- HERO --- */}
      <section className="relative text-center py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-50 via-white to-indigo-50 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-fuchsia-200/30 rounded-full blur-3xl -z-10" />
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Yeni İnsanlarla Tanış,<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-indigo-600">Canlı Sohbet Et</span>
        </h1>
        <p className="mt-6 text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          Sevgili Bul ile Türkiye'nin dört bir yanından insanlarla tanışın. Güvenli, hızlı ve heyecanlı bir flört deneyimi sizi bekliyor.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            id="landing-signup-btn"
            onClick={() => { setMode('user'); setShowAuthModal(true); }}
            className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white text-lg font-bold rounded-2xl shadow-xl shadow-fuchsia-500/25 transition-all hover:scale-105 active:scale-100"
          >
            Ücretsiz Kaydol ✦
          </button>
          <button
            id="landing-login-btn"
            onClick={() => { setMode('user'); setShowAuthModal(true); }}
            className="px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 text-lg font-bold rounded-2xl transition-all hover:scale-105 active:scale-100 shadow-sm"
          >
            Giriş Yap
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-400">Kredi kartı gerekmez · Saniyeler içinde başla</p>
      </section>

      {/* --- PROFIL ÖNİZLEME KARTLARI --- */}
      <section className="py-16 px-4 bg-white" aria-label="Platformdaki kullanıcı profilleri">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-3">Seni Bekleyen Profiller</h2>
          <p className="text-center text-slate-500 font-medium mb-10">Her gün yüzlerce yeni üye katılıyor. Sen de aramıza katıl!</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'Alara', age: 24, city: 'İstanbul', emoji: '🌸' },
              { name: 'Defne', age: 22, city: 'Ankara', emoji: '✨' },
              { name: 'Lina', age: 26, city: 'İzmir', emoji: '💫' },
              { name: 'Mira', age: 23, city: 'Bursa', emoji: '🌺' },
              { name: 'Selin', age: 25, city: 'Antalya', emoji: '🌟' },
              { name: 'Naz', age: 21, city: 'Eskişehir', emoji: '🌙' },
            ].map((profile) => (
              <article
                key={profile.name}
                className="flex flex-col items-center p-4 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                onClick={() => setShowAuthModal(true)}
                title={`${profile.name} ile sohbet et`}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-400 to-indigo-500 flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform">
                  {profile.emoji}
                </div>
                <p className="font-bold text-slate-900 text-sm">{profile.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{profile.age} · {profile.city}</p>
                <span className="mt-2 w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Çevrimiçi" />
              </article>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-fuchsia-600 font-bold text-sm hover:text-fuchsia-700 underline underline-offset-4 transition-colors"
            >
              Daha fazla profil gör →
            </button>
          </div>
        </div>
      </section>

      {/* --- ÖZELLIKLER --- */}
      <section className="py-16 px-4 bg-slate-50" aria-label="Platform özellikleri">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">Neden Sevgili Bul?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Anlık Sohbet',
                desc: 'Gerçek zamanlı mesajlaşma altyapısı sayesinde mesajlarınız anında iletilir. Hiçbir gecikme yok.',
              },
              {
                icon: '🛡️',
                title: 'Güvenli Platform',
                desc: 'Tüm mesajlarınız şifrelidir. Gizliliğiniz bizim için önceliktir. Doğrulanmış hesaplar ile güvenli sohbet.',
              },
              {
                icon: '💘',
                title: 'Akıllı Eşleşme',
                desc: 'Hobilerinize ve ilgi alanlarınıza göre size en uygun profilleri önce gösteririz.',
              },
            ].map((f) => (
              <article key={f.title} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-50 to-indigo-50 flex items-center justify-center text-2xl mb-4 border border-fuchsia-100">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- İSTATİSTİKLER --- */}
      <section className="py-14 px-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600" aria-label="Platform istatistikleri">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: '50K+', label: 'Aktif Üye' },
            { value: '30', label: 'Şehirden Kullanıcı' },
            { value: '1M+', label: 'Gönderilen Mesaj' },
            { value: '%98', label: 'Memnuniyet Oranı' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-black">{s.value}</p>
              <p className="text-fuchsia-100 font-semibold mt-1 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SON CTA --- */}
      <section className="py-16 px-4 bg-white text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Hemen Başla, Ücretsiz!</h2>
        <p className="text-slate-500 font-medium mb-8 max-w-xl mx-auto">
          Kaydolmak sadece 30 saniye sürer. Binlerce profil seni bekliyor.
        </p>
        <button
          id="landing-cta-btn"
          onClick={() => { setMode('user'); setShowAuthModal(true); }}
          className="px-10 py-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white text-lg font-bold rounded-2xl shadow-xl shadow-fuchsia-500/25 transition-all hover:scale-105 active:scale-100"
        >
          Ücretsiz Hesap Oluştur →
        </button>
      </section>
    </div>
  );
}
