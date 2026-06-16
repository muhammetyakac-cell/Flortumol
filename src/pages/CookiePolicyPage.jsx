import SEO from '../components/SEO';
import { buildBreadcrumbSchema } from '../utils/seo';

export default function CookiePolicyPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Çerez Politikası', path: '/cerez-politikasi' },
  ]);

  return (
    <div className="flex-1 bg-slate-900">
      <SEO
        title="Çerez Politikası"
        description="Sevgili Bul çerez politikası. Web sitemizde kullandığımız çerezler ve veri toplama yöntemleri hakkında detaylı bilgi."
        canonical="/cerez-politikasi"
      >
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </SEO>

      <section className="bg-slate-800 border-b border-slate-700 py-16 px-4 text-center">
        <h1 className="text-4xl font-black text-white mb-4">Çerez Politikası</h1>
        <p className="text-slate-400 font-medium">Son Güncelleme: 1 Haziran 2026</p>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-300 leading-relaxed mb-6">
            Bu Çerez Politikası, Sevgili Bul platformunu kullanırken cihazınıza yerleştirilen çerezler ve benzer teknolojiler hakkında sizi bilgilendirmeyi amaçlar.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Çerez Nedir?</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza depolanan küçük metin dosyalarıdır. Bu dosyalar, siteyi tekrar ziyaret ettiğinizde tercihlerinizi hatırlamamıza ve size daha iyi bir kullanıcı deneyimi sunmamıza yardımcı olur.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Kullandığımız Çerez Türleri</h2>
          <div className="space-y-4 mb-4">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h3 className="text-white font-bold mb-2">Zorunlu Çerezler</h3>
              <p className="text-slate-400 text-sm">Platformun temel işlevlerini yerine getirebilmesi için gereklidir. Oturum yönetimi ve güvenlik önlemleri bu çerezler sayesinde çalışır.</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h3 className="text-white font-bold mb-2">Analitik Çerezler</h3>
              <p className="text-slate-400 text-sm">Hangi sayfaların daha çok ziyaret edildiğini, kullanıcıların sitede nasıl gezindiğini anonim olarak analiz etmemizi sağlar (Google Analytics 4).</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h3 className="text-white font-bold mb-2">İşlevsel Çerezler</h3>
              <p className="text-slate-400 text-sm">Oturum tercihlerinizi ve dil seçiminizi hatırlayarak size kişiselleştirilmiş bir deneyim sunar.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Çerezleri Nasıl Kullanıyoruz?</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Çerezleri; oturumunuzu aktif tutmak, platform tercihlerinizi hatırlamak, site trafiğini analiz etmek ve hizmet kalitemizi artırmak için kullanıyoruz. Üçüncü taraf reklam çerezleri kullanmamaktayız.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Çerezleri Nasıl Kontrol Edebilirsiniz?</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz. Çoğu tarayıcı, çerezleri otomatik olarak kabul eder ancak tarayıcı ayarlarınızı değiştirerek çerezleri reddedebilir veya size bildirim gönderilmesini sağlayabilirsiniz. Çerezleri devre dışı bırakmanız durumunda platformun bazı özellikleri düzgün çalışmayabilir.
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Chrome:{' '}
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
              support.google.com/chrome
            </a>
            <br />
            Firefox:{' '}
            <a href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
              support.mozilla.org
            </a>
            <br />
            Safari:{' '}
            <a href="https://support.apple.com/guide/safari/manage-cookies" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
              support.apple.com
            </a>
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Güncellemeler</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Bu Çerez Politikası zaman zaman güncellenebilir. Önemli değişiklikler olması durumunda platform üzerinden bildirim yapılacaktır.
          </p>
        </div>
      </section>
    </div>
  );
}
