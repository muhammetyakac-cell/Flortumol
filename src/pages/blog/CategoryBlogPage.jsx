import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import { BLOG_POSTS, BLOG_CATEGORIES } from './blogData';
import { buildBreadcrumbSchema, buildCollectionSchema } from '../../utils/seo';

export default function CategoryBlogPage() {
  const { category } = useParams();

  if (!category || !BLOG_CATEGORIES[category]) {
    return <Navigate to="/blog" replace />;
  }

  const categoryName = BLOG_CATEGORIES[category];
  const filtered = BLOG_POSTS.filter((p) => p.category === category);
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: categoryName, path: `/blog/kategori/${category}` },
  ]);
  const collectionSchema = buildCollectionSchema(filtered, categoryName);

  return (
    <>
      <SEO
        title={`${categoryName} - Sevgili Bul Blog`}
        description={`${categoryName} kategorisindeki blog yazıları. Flört, sohbet, güvenlik ve daha fazlası hakkında uzman ipuçları.`}
        canonical={`/blog/kategori/${category}`}
      >
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
      </SEO>

      <section className="bg-gradient-to-r from-pink-600 to-purple-700 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">{categoryName}</h1>
        <p className="text-lg text-pink-100 max-w-2xl mx-auto">
          {categoryDescriptions[category] || `${categoryName} hakkında tüm blog yazıları.`}
        </p>
        <Link to="/blog" className="inline-block mt-4 text-pink-200 text-sm hover:text-white transition underline underline-offset-4">
          ← Tüm Kategorilere Dön
        </Link>
      </section>

      <section className="py-8 px-4 max-w-5xl mx-auto w-full">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-12">Bu kategoride henüz içerik bulunmuyor.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <article key={post.slug} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-pink-500/50 transition shadow-lg">
                <Link to={`/blog/${post.slug}`} className="block">
                  <img src={post.image} alt={post.title} loading="lazy" width="1200" height="630" className="w-full h-40 object-cover border-b border-slate-700" />
                  <div className="p-6">
                    <span className="inline-block bg-pink-500/20 text-pink-300 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                      {BLOG_CATEGORIES[post.category]}
                    </span>
                    <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h2>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span>{post.readingTime} okuma</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

const categoryDescriptions = {
  flort: 'Flört ve ilişkiler hakkında uzman ipuçları, tavsiyeler ve rehber yazıları. Online flörtten uzun süreli ilişkilere kadar her konuda kapsamlı içerikler.',
  sohbet: 'Sohbet ve iletişim becerileri hakkında pratik tavsiyeler. İlk mesajdan derin sohbetlere kadar etkili iletişim teknikleri.',
  guvenlik: 'Online platformlarda güvenlik ve gizlilik hakkında bilinçlendirici içerikler. Kişisel veri koruma ve siber güvenlik ipuçları.',
  rehber: 'Sevgili Bul platformunu kullanma rehberi. Kayıttan profile, jetondan sohbete kadar adım adım kullanım kılavuzu.',
  sehir: 'Türkiye nin dört bir yanından şehir rehberleri. Her şehirde flört etmek için en romantik mekanlar ve aktiviteler.',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}
