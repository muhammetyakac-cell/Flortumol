import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME, DEFAULT_DESC, DEFAULT_OG_IMAGE } from '../utils/seo';

export default function SEO({
  title,
  description = DEFAULT_DESC,
  canonical = '/',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
  children,
}) {
  const fullTitle = title ? `${title} - ${SITE_NAME}` : `${SITE_NAME} - Yeni İnsanlarla Tanışın & Canlı Sohbet Edin`;
  const url = `${SITE_URL}${canonical}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {children}
    </Helmet>
  );
}
