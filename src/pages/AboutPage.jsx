import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function AboutPage({ setMode, setShowAuthModal }) {
  return (
    <div className="flex-1 bg-white">
      <Helmet>
        <title>Hakkımızda - Sevgili Bul</title>
        <meta name="description" content="Sevgili Bul hakkında merak ettikleriniz. Vizyonumuz, güvenli canlı sohbet ve arkadaşlık ilkelerimiz." />
      </Helmet>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Hakkımızda</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto font-medium">
          Sevgili Bul, Türkiye'nin en dinamik, güvenilir ve modern canlı sohbet platformudur. Bizimle yeni insanlarla tanışmak artık çok daha kolay.
        </p>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-slate prose-lg">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Vizyonumuz</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Günümüzün hızlı temposunda yeni insanlarla tanışmak, anlamlı bağlar kurmak veya sadece keyifli bir sohbet etmek giderek zorlaşıyor. Sevgili Bul olarak vizyonumuz; mesafeleri ortadan kaldırarak, güvenli ve şeffaf bir ortamda insanların birbirleriyle kaynaşmasını sağlamaktır. Yenilikçi eşleşme algoritmamız sayesinde, ilgi alanlarınıza ve yaşam tarzınıza en uygun profilleri saniyeler içinde karşınızda bulabilirsiniz.
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mb-6">Neden Sevgili Bul?</h2>
          <ul className="space-y-4 mb-8 text-slate-600">
            <li className="flex items-start">
              <span className="text-fuchsia-600 font-bold mr-3">✓</span>
              <span><strong>Anlık ve Kesintisiz İletişim:</strong> Canlı mesajlaşma altyapımız ile beklemeden, anında sohbet etmenin keyfini çıkarın.</span>
            </li>
            <li className="flex items-start">
              <span className="text-fuchsia-600 font-bold mr-3">✓</span>
              <span><strong>Üst Düzey Güvenlik:</strong> Gizliliğiniz bizim için her şeyden önemlidir. Tüm mesajlaşmalarınız uçtan uca korunur ve üçüncü şahıslarla paylaşılmaz.</span>
            </li>
            <li className="flex items-start">
              <span className="text-fuchsia-600 font-bold mr-3">✓</span>
              <span><strong>Gerçek Profiller:</strong> Topluluğumuzun kalitesini korumak için profil doğrulama adımlarına önem veriyoruz. Sahte hesaplara karşı sıfır tolerans politikası izliyoruz.</span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-slate-900 mb-6">Nasıl Çalışır?</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Sisteme katılmak tamamen ücretsizdir! Üye olduktan sonra profilinizi doldurur, ilgi alanlarınızı belirtirsiniz. Akıllı sistemimiz sizi, kriterlerinize en uygun aktif üyelerle eşleştirir. Şehrinizdeki insanları keşfedebilir, onlara selam gönderebilir ve özel mesajlaşma odalarında sohbeti derinleştirebilirsiniz.
          </p>

          <div className="bg-fuchsia-50 p-8 rounded-2xl border border-fuchsia-100 text-center mt-12">
            <h3 className="text-2xl font-black text-fuchsia-900 mb-3">Sen de Aramıza Katıl!</h3>
            <p className="text-fuchsia-800 mb-6 font-medium">Binlerce kişi şu an burada sohbet ediyor. Seni de aramızda görmek istiyoruz.</p>
            <button 
              onClick={() => { setMode('user'); setShowAuthModal(true); }}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              Hemen Kayıt Ol
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
