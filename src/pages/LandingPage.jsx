import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
const HeroCanvas = lazy(() => import('../components/HeroCanvas'));
import { buildFaqSchema, buildProductSchema } from '../utils/seo';

const FAQ_ITEMS = [
  { question: 'Sevgili Bul nedir?', answer: 'Sevgili Bul, Türkiye\'nin en güvenilir canlı sohbet ve flört platformudur. Yeni insanlarla tanışmak, sohbet etmek ve arkadaşlıklar kurmak için tasarlanmış modern bir uygulamadır.' },
  { question: 'Sevgili Bul ücretsiz mi?', answer: 'Evet, Sevgili Bul\'a katılmak ve temel özellikleri kullanmak tamamen ücretsizdir. İsteğe bağlı premium özellikler için jeton satın alabilirsiniz.' },
  { question: 'Sevgili Bul\'da nasıl sohbet başlatabilirim?', answer: 'Kayıt olduktan sonra size önerilen sanal profiller arasından ilgilendiğiniz kişiyi seçip doğrudan mesaj gönderebilirsiniz. Sohbet başlatmak için herhangi bir eşleşme beklemek zorunda değilsiniz.' },
  { question: 'Sevgili Bul güvenli mi?', answer: 'Sevgili Bul, kullanıcı güvenliğini en üst düzeyde tutar. Gelişmiş RLS politikaları, şifreli veri iletimi ve istenmeyen kullanıcıları engelleme/raporlama özellikleri ile güvenli bir ortam sunar.' },
  { question: 'Hangi şehirlerde kullanılıyor?', answer: 'Sevgili Bul, Türkiye\'nin tüm şehirlerinde kullanılmaktadır. İstanbul, Ankara, İzmir, Bursa, Antalya başta olmak üzere 81 ilde aktif kullanıcılarımız bulunmaktadır.' },
  { question: 'Nasıl kayıt olabilirim?', answer: 'Anasayfadaki kayıt ol butonuna tıklayarak, kullanıcı adı ve şifre belirleyerek hemen ücretsiz hesabınızı oluşturabilirsiniz. E-posta onayı gerektirmez, anında sohbete başlayabilirsiniz.' },
  { question: 'Jeton nedir ve nasıl kazanılır?', answer: 'Jetonlar, premium özellikleri kullanmanızı sağlayan sanal birimlerdir. Kayıt olduğunuzda size 100 ücretsiz jeton hediye edilir. Dilerseniz paket satın alarak jeton yükleyebilirsiniz.' },
  { question: 'Profilimi nasıl özelleştirebilirim?', answer: 'Profil sayfanızdan fotoğraf, yaş, şehir, ilgi alanları ve hobi bilgilerinizi güncelleyebilir, kendinizi en iyi şekilde ifade edebilirsiniz.' },
];

const faqSchema = buildFaqSchema(FAQ_ITEMS);
const productSchema = buildProductSchema();

export default function LandingPage({ setMode, setShowAuthModal }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const cardHoverEffect = {
    scale: 1.03,
    y: -6,
    borderColor: "rgba(255, 122, 69, 0.3)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.45)",
    transition: { type: "spring", stiffness: 350, damping: 18 }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Helmet>
        <title>Sevgili Bul - Yeni İnsanlarla Tanışın & Canlı Sohbet Edin</title>
        <meta name="description" content="Sevgili Bul ile Türkiye'nin dört bir yanından yeni insanlarla tanışın, canlı sohbet edin ve arkadaşlıklar kurun. Güvenli, hızlı ve heyecanlı flört platformu." />
        <meta property="og:title" content="Sevgili Bul - Yeni İnsanlarla Tanışın & Canlı Sohbet Edin" />
        <meta property="og:description" content="Sevgili Bul ile Türkiye'nin dört bir yanından yeni insanlarla tanışın, canlı sohbet edin ve arkadaşlıklar kurun." />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      </Helmet>
      
      {/* --- HERO --- */}
      <section className="relative text-center px-4 overflow-hidden min-h-[92vh] flex flex-col justify-center items-center">
        {/* Three.js Interactive Shader + Particle Background (lazy loaded) */}
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 -z-10" />}>
          <HeroCanvas />
        </Suspense>

        {/* Pulsing CSS glow orbs layered with the 3D canvas */}
        <div className="hero-glow orange animate-pulse-slow" />
        <div className="hero-glow pink animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="hero-glow blue animate-pulse-slow" style={{ animationDelay: '3s' }} />

        {/* Extra radial spotlight behind headline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-brand-500/8 via-transparent to-transparent rounded-full pointer-events-none" style={{ zIndex: 1 }} />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center relative"
          style={{ zIndex: 10 }}
        >
          {/* Animated badge */}
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span className="text-xs font-bold text-white tracking-wider uppercase drop-shadow-md">Şu an 2,847 kişi çevrimiçi</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] max-w-5xl mx-auto drop-shadow-[0_0_40px_rgba(255,122,69,0.15)]"
          >
            Yeni İnsanlarla Tanış,<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 via-accent-400 to-brand-400 bg-[length:200%_auto] animate-gradient-shift">Canlı Sohbet Et</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="mt-7 text-lg md:text-xl text-white font-bold max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
          >
            Yeni arkadaşlıklar kurmak, samimi sohbetler etmek ya da hayatının aşkını bulmak için doğru yerdesin. Binlerce gerçek kullanıcıyla saniyeler içinde eşleş!
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
          >
            <motion.button
              id="landing-signup-btn"
              onClick={() => { setMode('user'); setShowAuthModal(true); }}
              whileHover={{ scale: 1.06, boxShadow: "0 0 50px rgba(255,122,69,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="relative px-10 py-4 bg-gradient-to-r from-brand-500 to-accent-500 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-brand-500/30 transition-all cursor-pointer w-full sm:w-auto overflow-hidden group"
            >
              {/* Shimmer effect on hover */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative">Ücretsiz Kaydol ✦</span>
            </motion.button>
            <motion.button
              id="landing-login-btn"
              onClick={() => { setMode('user'); setShowAuthModal(true); }}
              whileHover={{ scale: 1.06, borderColor: "rgba(255,122,69,0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-white/5 border-2 border-white/10 backdrop-blur-sm text-white/90 text-lg font-bold rounded-2xl transition-all cursor-pointer shadow-sm w-full sm:w-auto hover:bg-white/10"
            >
              Giriş Yap
            </motion.button>
          </motion.div>
          
          {/* Trust bar */}
          <motion.div 
            variants={itemVariants}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-200 font-bold drop-shadow-md"
          >
            <span className="flex items-center gap-1.5"><span className="text-emerald-400" role="img" aria-label="kilit simgesi">🔒</span> Uçtan uca şifreli</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" aria-hidden="true" />
            <span className="flex items-center gap-1.5"><span className="text-amber-400" role="img" aria-label="şimşek simgesi">⚡</span> Kredi kartı gerekmez</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" aria-hidden="true" />
            <span className="flex items-center gap-1.5"><span className="text-blue-400" role="img" aria-label="yıldız simgesi">✨</span> 30 saniyede başla</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ zIndex: 10 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-brand-400"
            />
          </div>
        </motion.div>
      </section>

      <div className="section-divider" />

      {/* --- PROFIL ÖNİZLEME KARTLARI --- */}
      <section className="py-16 px-4 bg-transparent" aria-label="Platformdaki kullanıcı profilleri">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-3">Seni Bekleyen Profiller</h2>
          <p className="text-center text-slate-400 font-medium mb-10">Her gün yüzlerce yeni üye katılıyor. Sen de aramıza katıl!</p>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
          >
            {[
              { name: 'Alara', age: 24, city: 'İstanbul', emoji: '🌸' },
              { name: 'Defne', age: 22, city: 'Ankara', emoji: '✨' },
              { name: 'Lina', age: 26, city: 'İzmir', emoji: '💫' },
              { name: 'Mira', age: 23, city: 'Bursa', emoji: '🌺' },
              { name: 'Selin', age: 25, city: 'Antalya', emoji: '🌟' },
              { name: 'Naz', age: 21, city: 'Eskişehir', emoji: '🌙' },
            ].map((profile) => (
              <motion.article
                key={profile.name}
                variants={itemVariants}
                whileHover={cardHoverEffect}
                className="glass-card flex flex-col items-center p-5 cursor-pointer group"
                onClick={() => setShowAuthModal(true)}
                title={`${profile.name} ile sohbet et`}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform" role="img" aria-label={`${profile.name} profil simgesi`}>
                  {profile.emoji}
                </div>
                <p className="font-bold text-white text-sm">{profile.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{profile.age} · {profile.city}</p>
                <span className="mt-2 w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Çevrimiçi" />
              </motion.article>
            ))}
          </motion.div>
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

      <div className="section-divider" />

      {/* --- ÖZELLIKLER --- */}
      <section className="py-16 px-4 bg-transparent" aria-label="Platform özellikleri">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">Neden Sevgili Bul?</h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: '⚡',
                iconLabel: 'şimşek',
                title: 'Anlık Sohbet',
                desc: 'Gerçek zamanlı mesajlaşma altyapısı sayesinde mesajlarınız anında iletilir. Hiçbir gecikme yok.',
              },
              {
                icon: '🛡️',
                iconLabel: 'kalkan',
                title: 'Güvenli Platform',
                desc: 'Tüm mesajlarınız şifrelidir. Gizliliğiniz bizim için önceliktir. Doğrulanmış hesaplar ile güvenli sohbet.',
              },
              {
                icon: '💘',
                iconLabel: 'kalp',
                title: 'Akıllı Eşleşme',
                desc: 'Hobilerinize ve ilgi alanlarınıza göre size en uygun profilleri önce gösteririz.',
              },
            ].map((f) => (
              <motion.article 
                key={f.title} 
                variants={itemVariants}
                whileHover={cardHoverEffect}
                className="glass-card p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-2xl mb-4 border border-slate-700/50" role="img" aria-label={`${f.iconLabel} simgesi`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* --- NASIL ÇALIŞIR --- */}
      <section className="py-20 px-4 bg-transparent" aria-label="Nasıl Çalışır">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-400 font-extrabold text-sm uppercase tracking-wider">Kolay & Hızlı</span>
            <h2 className="text-4xl font-black text-white mt-2">3 Basit Adımda Sohbet Etmeye Başla</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Sevgili Bul, karmaşık eşleşme süreçlerini ortadan kaldırır. Sadece birkaç saniye içinde aradığın kişiyle sohbete başlayabilirsin.
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
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
              <motion.div 
                key={item.step} 
                variants={itemVariants}
                whileHover={cardHoverEffect}
                className="glass-card relative p-8 flex flex-col group"
              >
                <span className="text-6xl font-black text-brand-500/10 group-hover:text-brand-500/20 absolute top-4 right-6 transition-colors">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-extrabold text-lg mb-6 shadow-md shadow-brand-500/10">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
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

      <div className="section-divider" />

      {/* --- ŞEHRE ÖZEL ODALAR --- */}
      <section className="py-20 px-4 bg-transparent" aria-label="Popüler Şehirler">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent-400 font-extrabold text-sm uppercase tracking-wider">Konumunu Seç</span>
            <h2 className="text-4xl font-black text-white mt-2">Şehrindeki Bekarlarla Tanış</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Kendi şehrinden insanlarla tanışarak gerçek buluşmalara adım at. Türkiye'nin en popüler şehirlerindeki aktif sohbet odalarını keşfet.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            {[
              { id: 'istanbul', name: 'İstanbul', count: '12K+ Aktif', desc: 'Metropolün enerjisi' },
              { id: 'ankara', name: 'Ankara', count: '8K+ Aktif', desc: 'Başkentin kalbi' },
              { id: 'izmir', name: 'İzmir', count: '7K+ Aktif', desc: 'Ege esintisi' },
              { id: 'bursa', name: 'Bursa', count: '4K+ Aktif', desc: 'Tarih ve modernlik' },
              { id: 'antalya', name: 'Antalya', count: '5K+ Aktif', desc: 'Akdeniz sıcağı' },
            ].map((city) => (
              <motion.div
                key={city.id}
                variants={itemVariants}
                whileHover={cardHoverEffect}
                className="glass-card"
              >
                <Link
                  to={`/${city.id}`}
                  className="group flex flex-col justify-between p-6 cursor-pointer h-full"
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* --- FAQ --- */}
      <section className="py-20 px-4 bg-transparent" aria-label="Sıkça Sorulan Sorular">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-400 font-extrabold text-sm uppercase tracking-wider">Aklına Takılanlar</span>
            <h2 className="text-4xl font-black text-white mt-2">Sıkça Sorulan Sorular</h2>
            <p className="text-slate-400 mt-4">
              Sevgili Bul platformu hakkında en çok merak edilen konuları sizin için derledik.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-6"
          >
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
              <motion.div key={idx} variants={itemVariants}>
                <details
                  className="glass-card group p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer"
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* --- BLOG PROMO --- */}
      <section className="py-20 px-4 bg-transparent" aria-label="Blog yazıları">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-brand-400 font-extrabold text-sm uppercase tracking-wider">Blog</span>
          <h2 className="text-4xl font-black text-white mt-2 mb-4">Flört ve Sohbet İpuçları</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Online flört, güvenli sohbet ve ilişkiler hakkında uzman tavsiyeleri için blogumuzu ziyaret edin.
          </p>
          <Link
            to="/blog"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-lg shadow-brand-500/25"
          >
            Blog'u Keşfet
          </Link>
        </div>
      </section>

      <div className="section-divider" />

      {/* --- SON CTA --- */}
      <section className="py-20 px-4 bg-transparent text-center">
        <h2 className="text-3xl font-black text-white mb-4">Hemen Başla, Ücretsiz!</h2>
        <p className="text-slate-400 font-medium mb-8 max-w-xl mx-auto">
          Kaydolmak sadece 30 saniye sürer. Binlerce profil seni bekliyor.
        </p>
        <motion.button
          id="landing-cta-btn"
          onClick={() => { setMode('user'); setShowAuthModal(true); }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="px-10 py-4 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white text-lg font-bold rounded-2xl shadow-xl shadow-brand-500/25 transition-all hover:scale-105 active:scale-100"
        >
          Ücretsiz Hesap Oluştur →
        </motion.button>
      </section>
    </div>
  );
}
