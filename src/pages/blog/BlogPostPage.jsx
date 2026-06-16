import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { BLOG_POSTS, BLOG_CATEGORIES } from './blogData';
import { buildArticleSchema, buildBreadcrumbSchema, SITE_URL } from '../../utils/seo';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
        <SEO title="Blog Yazısı Bulunamadı" canonical={`/blog/${slug}`} noindex />
        <h1 className="text-3xl font-bold text-white mb-4">Yazı Bulunamadı</h1>
        <p className="text-slate-400 mb-8">Aradığınız blog yazısı mevcut değil.</p>
        <Link to="/blog" className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition">
          Blog Ana Sayfasına Dön
        </Link>
      </div>
    );
  }

  const articleSchema = buildArticleSchema(post);
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogType="article"
      >
        <meta property="article:published_time" content={post.date} />
        <meta property="article:modified_time" content={post.updated || post.date} />
        <meta property="article:tag" content={BLOG_CATEGORIES[post.category]} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </SEO>

      <article className="max-w-3xl mx-auto w-full py-12 px-4">
        <nav className="text-sm text-slate-500 mb-8" aria-label="Sayfa yolu">
          <Link to="/" className="hover:text-pink-400 transition">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-pink-400 transition">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-400">{post.title}</span>
        </nav>

        <header className="mb-8">
          <span className="inline-block bg-pink-500/20 text-pink-300 text-xs font-semibold px-2.5 py-1 rounded-full mb-4">
            {BLOG_CATEGORIES[post.category]}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readingTime} okuma süresi</span>
          </div>
          <img
            src={post.image}
            alt={`${post.title} - Sevgili Bul Blog`}
            loading="lazy"
            width="1200"
            height="630"
            className="w-full rounded-xl border border-slate-700 shadow-lg"
          />
        </header>

        <div
          className="blog-content text-slate-300 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <hr className="border-slate-700 my-12" />

        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-3">Bu yazıyı beğendiniz mi?</h2>
          <p className="text-slate-400 mb-6">Daha fazlası için blog sayfamızı ziyaret edin.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/blog"
              className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition"
            >
              Tüm Yazılar
            </Link>
            <Link
              to="/"
              className="bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-600 transition"
            >
              Sevgili Bul'a Katıl
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}
