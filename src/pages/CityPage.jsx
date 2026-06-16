import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { buildBreadcrumbSchema } from '../utils/seo';
import { BLOG_POSTS } from './blog/blogData';

const ALLOWED_CITIES = [
  'istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'adana', 'konya',
  'gaziantep', 'eskişehir', 'mersin', 'muğla', 'trabzon', 'samsun',
  'kocaeli', 'kayseri', 'denizli', 'tekirdağ', 'aydın', 'balıkesir',
  'sakarya', 'hatay', 'manisa', 'edirne', 'çanakkale', 'bolu',
  'kırklareli', 'rize', 'giresun', 'ordu', 'sinop',
];

const CITY_DESCRIPTIONS = {
  istanbul: 'Türkiye\'nin en kalabalık şehri İstanbul\'da, Boğaz manzaralı sohbetler için binlerce aktif kullanıcı seni bekliyor.',
  ankara: 'Başkent Ankara\'da, Çankaya\'dan Kızılay\'a kadar her semtte yeni arkadaşlıklar kurmanın tam zamanı.',
  izmir: 'Ege\'nin incisi İzmir\'de, Kordon boyunda romantik sohbetlere başlamak için hemen katıl.',
  bursa: 'Yeşil Bursa\'da, Uludağ eteklerinde yeni insanlarla tanışmanın en keyifli yolu Sevgili Bul.',
  antalya: 'Güney sahilinin parlayan yıldızı Antalya\'da, plaj keyfi ve sohbet bir arada.',
  adana: 'Sıcakkanlı insanlarıyla ünlü Adana\'da yeni arkadaşlıklar kurmak hiç bu kadar kolay olmamıştı.',
  konya: 'Konya\'nın samimi atmosferinde, gerçek arkadaşlıklar için doğru platformdasın.',
  gaziantep: 'Gastronomi başkenti Gaziantep\'te, lezzetli sohbetler ve yeni dostluklar seni bekliyor.',
  eskişehir: 'Öğrenci şehri Eskişehir\'de, genç ve dinamik bir toplulukla tanışmaya hazır ol.',
  mersin: `Akdeniz'in incisi Mersin'de, sıcak sohbetler ve yeni yüzler için hemen katıl.`,
  muğla: `Bodrum, Fethiye ve Marmaris ile ünlü Muğla'da tatil havasında sohbetler seni bekliyor.`,
  trabzon: `Karadeniz'in incisi Trabzon'da, doğal güzellikler eşliğinde yeni bağlantılar kur.`,
  samsun: `Samsun'un yeşil doğasında, Karadeniz'in samimi insanlarıyla tanış.`,
};

const CITY_FACTS = {
  istanbul: `15 milyonu aşkın nüfusuyla İstanbul, Türkiye'nin en büyük ve en hareketli flört şehridir.`,
  ankara: 'Başkent Ankara, 5.7 milyon nüfusu ve 25 üniversitesiyle genç bir flört potansiyeline sahiptir.',
  izmir: `İzmir, 4.4 milyon nüfusu ve Ege'nin en romantik şehri olarak bilinir.`,
  bursa: 'Bursa, 3.1 milyon nüfusu ve doğal güzellikleriyle flört için ideal bir şehirdir.',
  antalya: 'Antalya, yılda 15 milyon turist ağırlayan ve flörtün en canlı olduğu şehirlerdendir.',
  adana: 'Adana, 2.2 milyon nüfusu ve sıcakkanlı insanlarıyla bilinir.',
  konya: `Konya, 2.3 milyon nüfusu ve köklü tarihiyle Anadolu'nun kalbidir.`,
  gaziantep: 'Gaziantep, 2.1 milyon nüfusu ve UNESCO gastronomi şehri unvanıyla ünlüdür.',
  eskişehir: `Eskişehir, 900 bin nüfusu ve iki üniversitesiyle Türkiye'nin en genç şehirlerindendir.`,
};

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toLocaleUpperCase('tr-TR') + str.slice(1).toLocaleLowerCase('tr-TR');
}

export default function CityPage({ setMode, setShowAuthModal }) {
  const { city } = useParams();
  const slug = city?.toLowerCase();

  if (!slug || !ALLOWED_CITIES.includes(slug)) {
    return <Navigate to="/" replace />;
  }

  const cityName = capitalize(slug);
  const description = CITY_DESCRIPTIONS[slug] || `${cityName} şehrinden yeni insanlarla tanışın, canlı sohbet edin. ${cityName} arkadaşlık platformu.`;
  const fact = CITY_FACTS[slug] || '';

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: `${cityName}`, path: `/${slug}` },
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  const otherCities = ALLOWED_CITIES.filter((c) => c !== slug).slice(0, 6);

  return (
    <div className="flex-1 flex flex-col">
      <SEO
        title={`${cityName}'da Arkadaşlık ve Sohbet - Sevgili Bul`}
        description={description}
        canonical={`/${slug}`}
      >
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: `Sevgili Bul - ${cityName}`,
          areaServed: { '@type': 'City', name: cityName, sameAs: `https://tr.wikipedia.org/wiki/${encodeURIComponent(cityName)}` },
          provider: { '@type': 'Organization', name: 'Sevgili Bul' },
        })}</script>
      </SEO>

      <section className="relative text-center py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-200/30 rounded-full blur-3xl -z-10" />
        <nav className="text-sm text-slate-500 mb-8" aria-label="Sayfa yolu">
          <Link to="/" className="hover:text-pink-400 transition">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-400">{cityName}</span>
        </nav>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          {cityName}'da Yeni İnsanlarla Tanış,<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-accent-500">Canlı Sohbet Et</span>
        </h1>
        <p className="mt-6 text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        {fact && (
          <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto italic">
            {fact}
          </p>
        )}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => { setMode('user'); setShowAuthModal(true); }}
            className="px-8 py-4 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white text-lg font-bold rounded-2xl shadow-xl shadow-brand-500/25 transition-all hover:scale-105 active:scale-100"
          >
            Hemen Ücretsiz Katıl ✦
          </button>
        </div>
      </section>

      <section className="py-12 px-4 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-3">{cityName} Profil Önerileri</h2>
          <p className="text-center text-slate-400 font-medium mb-10">{cityName}'dan her gün onlarca yeni üye katılıyor. Onlarla tanışmak için profillere göz at!</p>
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
                className="flex flex-col items-center p-4 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                onClick={() => setShowAuthModal(true)}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform">
                  {profile.emoji}
                </div>
                <p className="font-bold text-white text-sm">{profile.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{profile.age} · {cityName}</p>
                <span className="mt-2 w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Çevrimiçi" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {fact && (
        <section className="py-12 px-4 bg-slate-950">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">{cityName} Hakkında</h2>
            <p className="text-slate-400 leading-relaxed">{fact}</p>
          </div>
        </section>
      )}

      {BLOG_POSTS.find((p) => p.slug === `${slug}-flort-rehberi`) && (
        <section className="py-12 px-4 bg-slate-950">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">{cityName} Flört Rehberi</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              {cityName}'da flört ederken keşfedebileceğin en romantik mekanlar ve aktiviteler hakkında detaylı rehberimizi okuyun.
            </p>
            <Link
              to={`/blog/${slug}-flort-rehberi`}
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-xl transition text-sm"
            >
              {cityName} Flört Rehberi →
            </Link>
          </div>
        </section>
      )}

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Diğer Şehirleri Keşfet</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {otherCities.map((other) => (
              <Link
                key={other}
                to={`/${other}`}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-full text-sm font-medium hover:bg-slate-700 hover:text-white transition border border-slate-700"
              >
                {capitalize(other)}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
