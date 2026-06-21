import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { BLOG_POSTS, BLOG_CATEGORIES } from './blogData';
import { buildBreadcrumbSchema, buildCollectionSchema } from '../../utils/seo';

export default function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === activeCategory);

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Blog', path: '/blog' },
  ]);
  const collectionSchema = buildCollectionSchema(
    filtered,
    activeCategory === 'all' ? null : BLOG_CATEGORIES[activeCategory]
  );

  return (
    <>
      <SEO
        title="Blog"
        description="Flört, sohbet, ilişkiler ve online arkadaşlık hakkında en güncel blog yazıları. Uzman tavsiyeleri, şehir rehberleri ve güvenlik ipuçları."
        canonical="/blog"
        ogType="blog"
      >
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
      </SEO>

      <section className="bg-gradient-to-r from-pink-600 to-purple-700 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Sevgili Bul Blog</h1>
        <p className="text-lg text-pink-100 max-w-2xl mx-auto">
          Flört, sohbet, ilişkiler ve online arkadaşlık hakkında en güncel yazılar, ipuçları ve şehir rehberleri.
        </p>
      </section>

      <section className="py-8 px-4 max-w-5xl mx-auto w-full">
        <nav className="flex flex-wrap gap-2 mb-8 justify-center" aria-label="Blog kategorileri">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCategory === 'all' ? 'bg-pink-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
          >
            Tümü
          </button>
            {Object.entries(BLOG_CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCategory === key ? 'bg-pink-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                {label}
              </button>
            ))}
        </nav>

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

        {filtered.length === 0 && (
          <p className="text-center text-slate-400 py-12">Bu kategoride henüz içerik bulunmuyor.</p>
        )}

        <div className="mt-12 pt-8 border-t border-slate-700 text-center">
          <h2 className="text-lg font-bold text-white mb-4">Kategoriler</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {Object.entries(BLOG_CATEGORIES).map(([key, label]) => (
              <Link
                key={key}
                to={`/blog/kategori/${key}`}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-full text-sm font-medium hover:bg-slate-700 hover:text-white transition border border-slate-700"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}
