import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import { buildBreadcrumbSchema } from '../utils/seo';

export default function ContactPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: 'İletişim', path: '/iletisim' },
  ]);

  return (
    <div className="flex-1 bg-slate-900">
      <SEO
        title="İletişim"
        description="Sevgili Bul iletişim bilgileri. Sorularınız, önerileriniz ve geri bildirimleriniz için bize ulaşın. Size en kısa sürede dönüş yapacağız."
        canonical="/iletisim"
      >
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </SEO>

      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">İletişim</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto font-medium">
          Soruların mı var? Görüş ve önerilerini duymaktan mutluluk duyarız.
        </p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-3">📧 E-posta</h2>
              <p className="text-slate-400">Bize e-posta gönderin, en geç 24 saat içinde yanıtlayalım.</p>
              <a href="mailto:destek@sevgilibul.help" className="text-brand-400 hover:text-brand-300 transition font-medium mt-2 inline-block">
                destek@sevgilibul.help
              </a>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-3">🔒 Güvenlik</h2>
              <p className="text-slate-400">Hesap güvenliği veya şüpheli aktivite bildirimleri için.</p>
              <a href="mailto:guvenlik@sevgilibul.help" className="text-brand-400 hover:text-brand-300 transition font-medium mt-2 inline-block">
                guvenlik@sevgilibul.help
              </a>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-3">📱 Sosyal Medya</h2>
              <p className="text-slate-400">Bizi sosyal medyada takip edin, güncellemeleri kaçırmayın.</p>
              <p className="text-slate-500 mt-2">Instagram · Twitter · TikTok (yakında)</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-3">💼 İş Birliği</h2>
              <p className="text-slate-400">Reklam, sponsorluk ve iş birliği teklifleri için.</p>
              <a href="mailto:isbirligi@sevgilibul.help" className="text-brand-400 hover:text-brand-300 transition font-medium mt-2 inline-block">
                isbirligi@sevgilibul.help
              </a>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-slate-400 mb-6">
              Hızlı cevap almak için <a href="/blog" className="text-brand-400 hover:text-brand-300 transition">blog sayfamızı</a> veya
              {' '}<a href="/" className="text-brand-400 hover:text-brand-300 transition">SSS bölümümüzü</a> ziyaret edebilirsiniz.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
