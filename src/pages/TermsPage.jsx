import React from 'react';

export default function TermsPage() {
  return (
    <div className="flex-1 bg-white">
      <section className="bg-slate-50 border-b border-slate-200 py-16 px-4 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Kullanım Koşulları</h1>
        <p className="text-slate-500 font-medium">Lütfen platformumuzu kullanmadan önce dikkatlice okuyunuz.</p>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <p className="text-slate-600 leading-relaxed mb-6">
            Sevgili Bul web sitesine ve mobil uygulamasına erişim sağlayarak veya üye olarak aşağıdaki şartları ve kuralları peşinen kabul etmiş sayılırsınız. Kurallara uyulmaması durumunda hesaplarınız askıya alınabilir veya kalıcı olarak silinebilir.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Yaş Sınırı</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Sevgili Bul hizmetlerini kullanabilmek için en az 18 yaşında olmanız gerekmektedir. 18 yaşın altındaki kullanıcıların platforma kayıt olması yasaktır. Tespit edilen reşit olmayan hesaplar derhal silinir.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Topluluk Kuralları ve Saygı</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Amacımız, herkes için nezih ve seviyeli bir sohbet ortamı sunmaktır. Diğer üyelere hakaret etmek, tehdit savurmak, ırkçı veya ayrımcı söylemlerde bulunmak kesinlikle yasaktır. Spam mesaj göndermek, hileli yazılımlar kullanmak veya platformu ticari amaçlarla (reklam vb.) kullanmak hesabınızın kalıcı olarak engellenmesine neden olur.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Gerçek Profil Kullanımı</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Platformumuzun kalitesini artırmak için kullanıcıların gerçek dışı bilgilerle profil oluşturması yasaktır. Başkasına ait fotoğrafları kullanmak veya kendinizi farklı biri gibi tanıtmak (catfishing) durumunda şikayet üzerine profiliniz incelenir ve ihlal tespit edilirse kapatılır.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. İçerik Sorumluluğu</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Sevgili Bul üzerinde paylaştığınız tüm metin, fotoğraf ve diğer içeriklerin yasal sorumluluğu tamamen size aittir. Yasa dışı, telif hakkı ihlali barındıran veya müstehcen içeriklerin paylaşımı yasaktır. Platformumuz bu tür içerikleri bildirim olmaksızın kaldırma hakkını saklı tutar.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Koşullarda Değişiklik</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Sevgili Bul yönetimi, bu kullanım koşullarını önceden haber vermeksizin tek taraflı olarak değiştirme hakkını saklı tutar. Değişiklikler siteye eklendiği an yürürlüğe girer.
          </p>
        </div>
      </section>
    </div>
  );
}
