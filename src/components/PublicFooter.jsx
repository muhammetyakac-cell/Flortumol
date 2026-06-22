import { Link } from 'react-router-dom';

export default function PublicFooter() {
  return (
    <footer className="bg-surface-900 text-slate-500 py-12 px-6 mt-auto">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="text-2xl font-black text-white flex items-center gap-2 mb-4">
            <img loading="lazy" src="/favicon.svg" className="w-8 h-8" alt="Sevgili Bul Logo" width="32" height="32" />
            <span>Sevgili Bul</span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">Türkiye'nin en güvenilir, hızlı ve dinamik canlı sohbet ve arkadaşlık platformu. Yeni insanlarla tanışmanın en güvenli yolu.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Kurumsal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/hakkimizda" className="hover:text-white transition-colors">Hakkımızda</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            <li><Link to="/iletisim" className="hover:text-white transition-colors">İletişim</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Yasal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/gizlilik-politikasi" className="hover:text-white transition-colors">Gizlilik Politikası</Link></li>
            <li><Link to="/kullanim-kosullari" className="hover:text-white transition-colors">Kullanım Koşulları</Link></li>
            <li><Link to="/cerez-politikasi" className="hover:text-white transition-colors">Çerez Politikası</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-slate-800 text-sm text-center">
        &copy; {new Date().getFullYear()} Sevgili Bul Platformu. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
