const SITE_URL = 'https://sevgilibul.help';
const SITE_NAME = 'Sevgili Bul';
const DEFAULT_DESC = 'Sevgili Bul ile yeni insanlarla tanışın, canlı sohbet edin ve arkadaşlıklar kurun. Türkiye\'nin en güvenilir flört ve sohbet platformu.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function buildArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image || DEFAULT_OG_IMAGE,
    datePublished: article.date,
    dateModified: article.updated || article.date,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo192.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${article.slug}`,
    },
    inLanguage: 'tr-TR',
  };
}

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function buildFaqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildCollectionSchema(posts, categoryName) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName ? `${categoryName} Blog Yazıları - ${SITE_NAME}` : `Blog - ${SITE_NAME}`,
    description: `Sevgili Bul blogunda flört, sohbet, ilişkiler ve online arkadaşlık hakkında ${posts.length} adet yazı.`,
    url: `${SITE_URL}/blog`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
        name: post.title,
      })),
    },
    inLanguage: 'tr-TR',
  };
}

export function buildServiceSchema(name, description, areaServed) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    areaServed: { '@type': 'City', name: areaServed },
    inLanguage: 'tr-TR',
  };
}

export function buildProductSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Sevgili Bul Jeton Paketi',
    description: 'Sevgili Bul\'da premium sohbet özelliklerini kullanmak için dijital jeton paketleri.',
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'TRY',
      lowPrice: '39.90',
      highPrice: '399.90',
      offerCount: '4',
      url: `${SITE_URL}`,
      availability: 'https://schema.org/InStock',
    },
    inLanguage: 'tr-TR',
  };
}

export function buildWebPageSchema(title, description, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${url}`,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    inLanguage: 'tr-TR',
  };
}

export { SITE_URL, SITE_NAME, DEFAULT_DESC, DEFAULT_OG_IMAGE };
