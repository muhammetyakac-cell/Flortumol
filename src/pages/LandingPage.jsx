import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function LandingPage({ setMode, setShowAuthModal }) {
  return (
    <div className="flex-1 flex flex-col">
      <Helmet>
        <title>Sevgili Bul - Yeni İnsanlarla Tanışın & Canlı Sohbet Edin</title>
        <meta name="description" content="Sevgili Bul ile Türkiye'nin dört bir yanından yeni insanlarla tanışın, canlı sohbet edin ve arkadaşlıklar kurun. Güvenli, hızlı ve heyecanlı flört platformu." />
      </Helmet>
      {/* --- HERO --- */}
      <section className="relative text-center py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-200/30 rounded-full blur-3xl -z-10" />
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Yeni İnsanlarla Tanış,<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-accent-500">Canlı Sohbet Et</span>
        </h1>
        <p className="mt-6 text-xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
          Yeni arkadaşlıklar kurmak, samimi sohbetler etmek ya da hayatının aşkını bulmak için doğru yerdesin. Türkiye'nin en aktif flört platformunda binlerce gerçek kullanıcıyla saniyeler içinde eşleş, güvenli ve canlı sohbetin tadını çıkar!
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            id="landing-signup-btn"
            onClick={() => { setMode('user'); setShowAuthModal(true); }}
            className="px-8 py-4 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white text-lg font-bold rounded-2xl shadow-xl shadow-brand-500/25 transition-all hover:scale-105 active:scale-100"
          >
            Ücretsiz Kaydol ✦
          </button>
          <button
            id="landing-login-btn"
            onClick={() => { setMode('user'); setShowAuthModal(true); }}
            className="px-8 py-4 bg-slate-900 border-2 border-slate-700 hover:border-slate-300 text-slate-700 text-lg font-bold rounded-2xl transition-all hover:scale-105 active:scale-100 shadow-sm"
          >
            Giriş Yap
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-500">Kredi kartı gerekmez · Saniyeler içinde başla</p>
      </section>

      {/* --- PROFIL ÖNİZLEME KARTLARI --- */}
      <section className="py-16 px-4 bg-slate-900" aria-label="Platformdaki kullanıcı profilleri">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-3">Seni Bekleyen Profiller</h2>
          <p className="text-center text-slate-400 font-medium mb-10">Her gün yüzlerce yeni üye katılıyor. Sen de aramıza katıl!</p>
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
                className="flex flex-col items-center p-4 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                onClick={() => setShowAuthModal(true)}
                title={`${profile.name} ile sohbet et`}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform">
                  {profile.emoji}
                </div>
                <p className="font-bold text-white text-sm">{profile.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{profile.age} · {profile.city}</p>
                <span className="mt-2 w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Çevrimiçi" />
              </article>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-brand-500 font-bold text-sm hover:text-brand-600 underline underline-offset-4 transition-colors"
            >
              Daha fazla profil gör →
            </button>
          </div>
        </div>
      </section>

      {/* --- ÖZELLIKLER --- */}
      <section className="py-16 px-4 bg-slate-800" aria-label="Platform özellikleri">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">Neden Sevgili Bul?</h2>
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
              <article key={f.title} className="p-6 bg-slate-900 rounded-2xl border border-slate-700 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-2xl mb-4 border border-slate-700">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- NASIL ÇALIŞIR --- */}
      <section className="py-20 px-4 bg-slate-900" aria-label="Nasıl Çalışır">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-400 font-extrabold text-sm uppercase tracking-wider">Kolay & Hızlı</span>
            <h2 className="text-4xl font-black text-white mt-2">3 Basit Adımda Sohbet Etmeye Başla</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Sevgili Bul, karmaşık eşleşme süreçlerini ortadan kaldırır. Sadece birkaç saniye içinde aradığın kişiyle sohbete başlayabilirsin.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Profilini Oluştur',
                desc: 'Hızlıca üye ol, birkaç güzel fotoğrafını ekle ve hobilerinden bahset. Kendini en iyi şekilde yansıtan bir profil oluştur.',
              },
              {
                step: '02',
                title: 'Eşleşmeleri Keşfet',
                desc: 'Akıllı algoritmamız ve konum bazlı arama seçenekleriyle seninle ortak ilgi alanlarına sahip üyeleri anında listele.',
              },
              {
                step: '03',
                title: 'Canlı Sohbeti Başlat',
                desc: 'Karşındaki kişinin dikkatini çekmek için bir selam gönder. Gerçek zamanlı, güvenli ve hızlı sohbetin tadını çıkar.',
              },
            ].map((item, index) => (
              <div key={item.step} className="relative p-8 bg-slate-800/40 rounded-3xl border border-slate-700/50 backdrop-blur-md flex flex-col group hover:border-brand-500/50 transition-all duration-300">
                <span className="text-6xl font-black text-brand-500/10 group-hover:text-brand-500/20 absolute top-4 right-6 transition-colors">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-extrabold text-lg mb-6 shadow-md shadow-brand-500/10">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- İSTATİSTİKLER --- */}
      <section className="py-14 px-4 bg-gradient-to-r from-brand-500 to-accent-500" aria-label="Platform istatistikleri">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: '50K+', label: 'Aktif Üye' },
            { value: '30', label: 'Şehirden Kullanıcı' },
            { value: '1M+', label: 'Gönderilen Mesaj' },
            { value: '%98', label: 'Memnuniyet Oranı' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-black">{s.value}</p>
              <p className="text-brand-100 font-semibold mt-1 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- ŞEHRE ÖZEL ODALAR --- */}
      <section className="py-20 px-4 bg-slate-800" aria-label="Popüler Şehirler">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent-400 font-extrabold text-sm uppercase tracking-wider">Konumunu Seç</span>
            <h2 className="text-4xl font-black text-white mt-2">Şehrindeki Bekarlarla Tanış</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Kendi şehrinden insanlarla tanışarak gerçek buluşmalara adım at. Türkiye'nin en popüler şehirlerindeki aktif sohbet odalarını keşfet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { id: 'istanbul', name: 'İstanbul', count: '12K+ Aktif', desc: 'Metropolün enerjisi' },
              { id: 'ankara', name: 'Ankara', count: '8K+ Aktif', desc: 'Başkentin kalbi' },
              { id: 'izmir', name: 'İzmir', count: '7K+ Aktif', desc: 'Ege esintisi' },
              { id: 'bursa', name: 'Bursa', count: '4K+ Aktif', desc: 'Tarih ve modernlik' },
              { id: 'antalya', name: 'Antalya', count: '5K+ Aktif', desc: 'Akdeniz sıcağı' },
            ].map((city) => (
              <Link
                key={city.id}
                to={`/${city.id}`}
                className="group flex flex-col justify-between p-6 bg-slate-900/60 hover:bg-slate-900 rounded-3xl border border-slate-700/50 hover:border-brand-500/40 transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl mb-4 group-hover:bg-brand-500/10 transition-colors">
                    📍
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">{city.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{city.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400">{city.count}</span>
                  <span className="text-sm text-slate-500 group-hover:text-brand-400 transition-colors">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-20 px-4 bg-slate-900" aria-label="Sıkça Sorulan Sorular">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-400 font-extrabold text-sm uppercase tracking-wider">Aklına Takılanlar</span>
            <h2 className="text-4xl font-black text-white mt-2">Sıkça Sorulan Sorular</h2>
            <p className="text-slate-400 mt-4">
              Sevgili Bul platformu hakkında en çok merak edilen konuları sizin için derledik.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'Sevgili Bul tamamen ücretsiz mi?',
                a: 'Evet, Sevgili Bul platformuna üye olmak, diğer üyelerin profillerine göz atmak ve ilk tanışma mesajlarını göndermek tamamen ücretsizdir. Daha gelişmiş filtreler ve limitsiz canlı sohbet keyfi için cüzdan jeton paketlerimizi tercih edebilirsiniz.',
              },
              {
                q: 'Güvenliğim nasıl sağlanıyor?',
                a: 'Kullanıcı güvenliği ve gizliliği en hassas olduğumuz konudur. Sohbetleriniz uçtan uca şifrelenir. Sizi rahatsız eden herhangi bir profili anında engelleyebilir veya admin panelimize şikayet edebilirsiniz. Moderatörlerimiz 7/24 aktiftir.',
              },
              {
                q: 'Şehir bazlı aramayı nasıl yaparım?',
                a: 'Kayıt sırasında bulunduğunuz şehri seçerek konumunuza en yakın üyeleri keşfet sekmesinde görebilirsiniz. Ayrıca üstteki popüler şehirler sayfamızdan da o şehirdeki popüler üye profillerini kolayca filtreleyebilirsiniz.',
              },
              {
                q: 'Profil doğrulaması nedir?',
                a: 'Güvenli sohbet ortamı oluşturmak adına, gerçek kullanıcı olduğunu doğrulayan hesaplara özel onay rozeti verilir. Bu sayede sahte hesaplarla vakit kaybetmeden doğrudan gerçek kişilerle konuşabilirsiniz.',
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group p-6 bg-slate-800/30 rounded-3xl border border-slate-700/50 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-all duration-300 hover:border-slate-700"
              >
                <summary className="flex items-center justify-between text-white font-bold text-lg select-none">
                  <span>{faq.q}</span>
                  <span className="ml-1.5 flex-shrink-0 rounded-full p-1.5 bg-slate-800 text-slate-400 group-open:rotate-180 group-open:text-brand-400 transition-all duration-300">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- SON CTA --- */}
      <section className="py-16 px-4 bg-slate-900 text-center">
        <h2 className="text-3xl font-black text-white mb-4">Hemen Başla, Ücretsiz!</h2>
        <p className="text-slate-400 font-medium mb-8 max-w-xl mx-auto">
          Kaydolmak sadece 30 saniye sürer. Binlerce profil seni bekliyor.
        </p>
        <button
          id="landing-cta-btn"
          onClick={() => { setMode('user'); setShowAuthModal(true); }}
          className="px-10 py-4 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white text-lg font-bold rounded-2xl shadow-xl shadow-brand-500/25 transition-all hover:scale-105 active:scale-100"
        >
          Ücretsiz Hesap Oluştur →
        </button>
      </section>
    </div>
  );
}
