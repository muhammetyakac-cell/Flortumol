import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-slate-900">
      <Helmet>
        <title>Gizlilik Politikası - Sevgili Bul</title>
        <meta name="description" content="Sevgili Bul Gizlilik Politikası. Veri güvenliğiniz ve kişisel bilgilerinizin nasıl korunduğu hakkında detaylı bilgiler." />
      </Helmet>
      <section className="bg-slate-800 border-b border-slate-700 py-16 px-4 text-center">
        <h1 className="text-4xl font-black text-white mb-4">Gizlilik Politikası</h1>
        <p className="text-slate-400 font-medium">Son Güncelleme: 1 Ocak 2026</p>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <p className="text-slate-300 leading-relaxed mb-6">
            Sevgili Bul olarak, gizliliğinize ve kişisel verilerinizin güvenliğine büyük önem veriyoruz. Sitemize üye olarak veya hizmetlerimizi kullanarak bu Gizlilik Politikası'nda belirtilen şartları kabul etmiş olursunuz.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Toplanan Veriler</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Platformumuzu kullanırken daha iyi eşleşmeler yapabilmemiz için yaş, şehir, cinsiyet ve hobiler gibi bazı profil bilgilerini talep etmekteyiz. Bu bilgiler, sadece size en uygun profilleri sunmak amacıyla işlenmektedir. Ayrıca, hizmet kalitesini artırmak için cihaz IP adresi ve tarayıcı bilgileri gibi teknik veriler de anonim olarak toplanabilir.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Veri Güvenliği ve Şifreleme</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Sevgili Bul üzerindeki tüm mesajlaşmalarınız güvenli sunucularımızda şifreli olarak saklanır. Sohbet odalarındaki özel mesajlarınıza sizin ve mesajlaştığınız kişinin dışında üçüncü şahıslar kesinlikle erişemez. Kredi kartı gibi finansal bilgileriniz sistemlerimizde tutulmaz, güvenli ödeme kuruluşları aracılığıyla işlenir.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Çerezler (Cookies)</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Kullanıcı deneyiminizi kişiselleştirmek ve sitemizi geliştirmek için çerezlerden faydalanıyoruz. Çerezler, cihazınıza zarar vermeyen küçük veri dosyalarıdır. Tarayıcı ayarlarınızı değiştirerek çerez kullanımını kısıtlayabilirsiniz ancak bu durum platformun bazı özelliklerinin eksik çalışmasına neden olabilir.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Bilgilerinizin Paylaşımı</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Kişisel bilgileriniz, yasal bir zorunluluk (mahkeme kararları vb.) bulunmadığı sürece reklam verenlerle veya diğer şirketlerle asla paylaşılmaz. Sistem üzerindeki halka açık profil bilgileriniz sadece platforma kayıtlı diğer üyeler tarafından görülebilir.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Hesap Silme</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Kullanıcılarımız diledikleri zaman hesaplarını ve ilişkili tüm verilerini sistemden sildirme hakkına sahiptir. Hesap silme işleminin ardından, yasal olarak tutmakla yükümlü olduğumuz loglar hariç tüm profil bilgileriniz sunucularımızdan kalıcı olarak yok edilir.
          </p>
        </div>
      </section>
    </div>
  );
}
