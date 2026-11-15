import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SITE_URL = 'https://www.bhumivera.com';

export const DEFAULT_SEO_TITLE =
  'Bhumivera | Skincare & Personal Care';

export const DEFAULT_SEO_DESCRIPTION =
  'Bhumivera Organics India Private Limited was founded by Akash Prasad and incorporated in 2026, building on the MPG E-Business heritage established in 2016.';

export const DEFAULT_SEO_KEYWORDS =
  'Bhumivera, Bhumivera Organics India Private Limited, MPG E-Business Private Limited, Akash Prasad, Dilip Prasad Nonia, Asansol, West Bengal, skincare, personal care';

export const GLOBAL_ORGANIZATION_LD = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Bhumivera',
  legalName: 'Bhumivera Organics India Private Limited',
  alternateName: ['Bhumivera Organics', 'Bhumivera Maison', 'The Transparent Maison'],
  url: SITE_URL,
  mainEntityOfPage: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/assets/logo.png`,
    contentUrl: `${SITE_URL}/assets/logo.png`,
    width: 512,
    height: 512,
  },
  foundingDate: '2026-08-04',
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'CIN',
    value: 'U20237WB2026PTC295842',
  },
  founder: {
    '@type': 'Person',
    name: 'Akash Prasad',
  },
  director: [
    { '@type': 'Person', name: 'Akash Prasad' },
    { '@type': 'Person', name: 'Payal Prasad' },
    { '@type': 'Person', name: 'Aman Prasad' },
  ],
  parentOrganization: {
    '@type': 'Organization',
    name: 'MPG E-Business Private Limited',
    legalName: 'MPG E-Business Private Limited',
    foundingDate: '2016-09-22',
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'CIN',
      value: 'U74999WB2016PTC217735',
    },
    founder: {
      '@type': 'Person',
      name: 'Dilip Prasad Nonia',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '608, BNR Sen Raleigh Road, Park Lane, Behind Spencer',
      addressLocality: 'Asansol',
      addressRegion: 'West Bengal',
      postalCode: '713305',
      addressCountry: 'IN',
    },
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'G.T. Road, Gopalpur',
    addressLocality: 'Asansol',
    addressRegion: 'West Bengal',
    postalCode: '713304',
    addressCountry: 'IN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-74309-85647',
      contactType: 'customer service',
      email: 'support@bhumivera.com',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Bengali'],
    },
  ],
  description: 'Bhumivera Organics India Private Limited was founded by Akash Prasad and incorporated on August 4, 2026. Its family-business heritage includes MPG E-Business Private Limited, incorporated on September 22, 2016, by Dilip Prasad Nonia.',
  slogan: 'The Transparent Maison',
  sameAs: [
    SITE_URL,
  ],
};

export const GLOBAL_WEBSITE_LD = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Bhumivera',
  alternateName: ['Bhumivera Organics', 'Bhumivera Maison', 'MPG Bhumivera', 'The Transparent Maison'],
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-IN',
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: `${SITE_URL}/shop?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  ],
};

export const GLOBAL_BRAND_LD = {
  '@type': 'Brand',
  '@id': `${SITE_URL}/#brand`,
  name: 'Bhumivera',
  alternateName: ['Bhumivera Organics', 'Bhumivera Maison', 'The Transparent Maison'],
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo.png`,
  slogan: 'The Transparent Maison',
};

export const GLOBAL_CORPORATE_FAQS = [
  {
    q: 'What is Bhumivera?',
    a: 'Bhumivera was founded by Akash Prasad and incorporated as Bhumivera Organics India Private Limited (CIN U20237WB2026PTC295842) on August 4, 2026. Its family-business heritage includes MPG E-Business Private Limited, founded by Dilip Prasad Nonia on September 22, 2016.',
  },
  {
    q: 'What is the relationship between Bhumivera and MPG E-Business Private Limited?',
    a: 'MPG E-Business Private Limited (CIN U74999WB2016PTC217735), founded by Dilip Prasad Nonia and incorporated on September 22, 2016, is the family-business heritage behind Bhumivera. Bhumivera Organics India Private Limited (CIN U20237WB2026PTC295842) was founded by Akash Prasad and incorporated on August 4, 2026.',
  },
  {
    q: 'Where are the company offices?',
    a: 'Bhumivera Organics India Private Limited is based at G.T. Road, Gopalpur, Asansol, West Bengal 713304. MPG E-Business Private Limited’s office is at 608, BNR Sen Raleigh Road, Park Lane, Behind Spencer, Asansol, West Bengal 713305.',
  },
  {
    q: 'Where can I find product ingredients and directions?',
    a: 'Review the specific product listing and the physical label for the available ingredient, direction, warning, and storage information. Contact customer support if you need help interpreting it.',
  },
  {
    q: 'How do I report a product or delivery issue?',
    a: 'Use the Contact page to tell us what happened. An online request is reviewed individually and does not guarantee a refund or replacement; any remedy required by applicable law remains available.',
  },
];

export default function SEO({
  product,
  title,
  description,
  keywords,
  ogImage,
  route,
  schema,
  faqs = [],
  breadcrumbs = [],
}) {
  const siteUrl = SITE_URL;
  const normalizedRoute = route
    ? (String(route).startsWith('/') ? String(route) : `/${route}`)
    : (typeof window !== 'undefined' ? window.location.pathname : '/');
  const canonicalUrl =
    normalizedRoute === '/' ? `${siteUrl}/` : `${siteUrl}${normalizedRoute.replace(/\/+$/, '')}`;

  const mergedFaqs = [
    ...(Array.isArray(faqs) ? faqs : []),
    ...GLOBAL_CORPORATE_FAQS.filter(
      (gf) =>
        !(Array.isArray(faqs) ? faqs : []).some(
          (f) => gf.q.toLowerCase() === String(f.q || f.question || '').toLowerCase()
        )
    ),
  ];

  const resolvedBreadcrumbs =
    Array.isArray(breadcrumbs) && breadcrumbs.length > 0
      ? breadcrumbs
      : [
          { name: 'Bhumivera', url: `${siteUrl}/` },
          ...(normalizedRoute !== '/'
            ? [
                {
                  name: title ? String(title).split('|')[0].trim() : 'Page',
                  url: canonicalUrl,
                },
              ]
            : []),
        ];

  if (!product) {
    const pageTitle = title || DEFAULT_SEO_TITLE;
    const pageDescription = description || DEFAULT_SEO_DESCRIPTION;
    const ogTitle = pageTitle;
    const ogDescription = pageDescription;
    const imageUrl = ogImage
      ? (ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`)
      : `${siteUrl}/assets/logo.png`;

    const webPageNode = {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: pageTitle,
      description: pageDescription,
      inLanguage: 'en-IN',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
    };

    const graphNodes = [
      GLOBAL_ORGANIZATION_LD,
      GLOBAL_WEBSITE_LD,
      GLOBAL_BRAND_LD,
      webPageNode,
    ];
    if (schema) {
      if (schema['@graph']) graphNodes.push(...schema['@graph']);
      else graphNodes.push(schema);
    }
    if (resolvedBreadcrumbs.length > 0) {
      graphNodes.push({
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: resolvedBreadcrumbs.map((c, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: c.name,
          item: c.url.startsWith('http') ? c.url : `${siteUrl}${c.url.startsWith('/') ? '' : '/'}${c.url}`,
        })),
      });
    }
    if (mergedFaqs.length > 0) {
      graphNodes.push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: mergedFaqs.map((f) => ({
          '@type': 'Question',
          name: f.q || f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a || f.answer,
          },
        })),
      });
    }

    return (
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords || DEFAULT_SEO_KEYWORDS} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="slurp" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="duckduckbot" content="index, follow" />
        <meta name="brave" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en-IN" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en" href={canonicalUrl} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bhumivera" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:alt" content={ogTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={imageUrl} />
        <script type="application/ld+json">
          {JSON.stringify({ '@context': 'https://schema.org', '@graph': graphNodes })}
        </script>
      </Helmet>
    );
  }

  const productSlug = product.seoSlug || product.slug || product.id;
  const productUrl = `${siteUrl}/product/${productSlug}`;
  const rawImg =
    product.seoImage ||
    (typeof product.images?.[0] === 'object' ? product.images[0]?.url : product.images?.[0]) ||
    product.image_url ||
    '/assets/logo.png';
  const imageUrl = String(rawImg).startsWith('http')
    ? rawImg
    : `${siteUrl}${String(rawImg).startsWith('/') ? '' : '/'}${rawImg}`;

  const seoTitle =
    title ||
    product.seo_title ||
    product.meta_title ||
    `${product.luxuryName || product.name} | Bhumivera`;
  const seoDesc =
    description ||
    product.meta_description ||
    product.short_description ||
    DEFAULT_SEO_DESCRIPTION;

  const resolvedKeywords =
    keywords ||
    product.search_keywords ||
    product.tags ||
    `${product.luxuryName || product.name}, ${DEFAULT_SEO_KEYWORDS}`;

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDesc} />
      <meta name="keywords" content={resolvedKeywords} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="slurp" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="duckduckbot" content="index, follow" />
      <meta name="brave" content="index, follow" />
      <link rel="canonical" href={productUrl} />
      <link rel="alternate" hrefLang="en-IN" href={productUrl} />
      <link rel="alternate" hrefLang="en" href={productUrl} />
      <link rel="alternate" hrefLang="x-default" href={productUrl} />

      <meta property="og:type" content="product" />
      <meta property="og:site_name" content="Bhumivera" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:url" content={productUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={seoTitle} />
      <meta property="product:price:amount" content={product.luxuryPrice || product.discount_price || product.price} />
      <meta property="product:price:currency" content="INR" />
      <meta property="product:brand" content="Bhumivera" />
      <meta property="product:availability" content="in stock" />
      <meta property="product:condition" content="new" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={productUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDesc} />
      <meta name="twitter:image" content={imageUrl} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
