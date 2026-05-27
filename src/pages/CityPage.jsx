import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LandingPage from './LandingPage';

// Desteklenen şehirlerin listesi ve capitalize işlemleri için yardımcı fonksiyon
const allowedCities = ['istanbul', 'ankara', 'izmir', 'bursa', 'antalya'];

function capitalize(str) {
  if (!str) return '';
  // Türkçe karakterlere özel büyük harf çevrimi için
  const firstLetter = str.charAt(0).toLocaleUpperCase('tr-TR');
  const rest = str.slice(1).toLocaleLowerCase('tr-TR');
  return firstLetter + rest;
}

export default function CityPage({ setMode, setShowAuthModal }) {
  const { city } = useParams();
  
  if (!city || !allowedCities.includes(city.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  const cityName = capitalize(city);

  return (
    <div className="flex-1 flex flex-col">
      <Helmet>
        <title>{cityName} Arkadaşlık ve Sevgili Bul - Ücretsiz Canlı Sohbet</title>
        <meta name="description" content={`${cityName} şehrinden yeni insanlarla tanışın, canlı sohbet edin. ${cityName} arkadaşlık ve sevgili bulma platformuna ücretsiz katılın.`} />
      </Helmet>
      
      {/* Şehre Özel Hero Bölümü */}
      <section className="relative text-center py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-surface-50 to-brand-100 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-200/30 rounded-full blur-3xl -z-10" />
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-surface-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
          {cityName}'da Yeni İnsanlarla Tanış,<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-accent-500">Canlı Sohbet Et</span>
        </h1>
        <p className="mt-6 text-xl text-stone-500 font-medium max-w-2xl mx-auto leading-relaxed">
          {cityName} çevresindeki aktif profillerle saniyeler içinde eşleşin. Güvenli, hızlı ve heyecanlı bir flört deneyimi sizi bekliyor.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => { setMode('user'); setShowAuthModal(true); }}
            className="px-8 py-4 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-fuchsia-500 hover:to-indigo-500 text-white text-lg font-bold rounded-2xl shadow-xl shadow-brand-500/25 transition-all hover:scale-105 active:scale-100"
          >
            Hemen Ücretsiz Katıl ✦
          </button>
        </div>
      </section>

      {/* Ortak Landing Page özelliklerini kullanabilir veya şehre özel istatistikler eklenebilir */}
      <section className="py-16 px-4 bg-surface-50" aria-label="Şehre Özel Kullanıcı Profilleri">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-surface-900 text-center mb-3">{cityName} Profil Önerileri</h2>
          <p className="text-center text-stone-500 font-medium mb-10">{cityName}'dan her gün onlarca yeni üye katılıyor. Onlarla tanışmak için profillere göz at!</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'Alara', age: 24, emoji: '🌸' },
              { name: 'Defne', age: 22, emoji: '✨' },
              { name: 'Lina', age: 26, emoji: '💫' },
              { name: 'Mira', age: 23, emoji: '🌺' },
              { name: 'Selin', age: 25, emoji: '🌟' },
              { name: 'Naz', age: 21, emoji: '🌙' },
            ].map((profile, i) => (
              <article
                key={i}
                className="flex flex-col items-center p-4 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-surface-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                onClick={() => setShowAuthModal(true)}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform">
                  {profile.emoji}
                </div>
                <p className="font-bold text-surface-900 text-sm">{profile.name}</p>
                <p className="text-xs text-stone-500 mt-0.5">{profile.age} · {cityName}</p>
                <span className="mt-2 w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Çevrimiçi" />
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
