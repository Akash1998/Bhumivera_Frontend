import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SITE_URL = 'https://bhumivera.com';

export const DEFAULT_SEO_TITLE =
  'Bhumivera | The Transparent Maison — Rooted in Heritage Since 2016';

export const DEFAULT_SEO_DESCRIPTION =
  'Discover Bhumivera (bhumivera.com). Founded on a decade of family manufacturing heritage with MPG E-Business (Est. 2016), delivering 100% active, milligram-disclosed cold-pressed botanical skincare.';

export const GLOBAL_ORGANIZATION_LD = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Bhumivera',
  legalName: 'Bhumivera Organics India Private Limited',
  alternateName: [
    'Bhumivera Organics',
    'Bhumivera Maison',
    'MPG Bhumivera',
    'The Transparent Maison',
  ],
  url: SITE_URL,
  mainEntityOfPage: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/assets/logo.png`,
    contentUrl: `${SITE_URL}/assets/logo.png`,
    width: 512,
    height: 512,
  },
  foundingDate: '2016-09-22',
  founder: [
    {
      '@type': 'Person',
      name: 'Akash Prasad',
      jobTitle: 'Founder, Bhumivera',
    },
    {
      '@type': 'Person',
      name: 'Dilip Prasad Nonia',
      jobTitle: 'Founder & Patriarch, MPG E-Business Group (Est. 2016)',
    },
  ],
  director: [
    {
      '@type': 'Person',
      name: 'Akash Prasad, Payal Prasad & Aman Prasad',
      jobTitle: 'Director, Bhumivera Organics India Private Limited',
    },
  ],
  parentOrganization: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#parent-organization`,
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
    description:
      'Parent heritage enterprise incorporated on September 22, 2016 (CIN: U74999WB2016PTC217735) by Dilip Prasad Nonia in Asansol, West Bengal, providing a decade of supply-chain mastery, local household distribution, and herbal manufacturing.',
  },
  foundingLocation: {
    '@type': 'Place',
    name: 'Asansol, West Bengal, India',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'G.T. Road, Gopalpur',
      addressLocality: 'Asansol',
      addressRegion: 'West Bengal',
      postalCode: '713304',
      addressCountry: 'IN',
    },
  },
  address: [
    {
      '@type': 'PostalAddress',
      name: 'Bhumivera Brand HQ',
      streetAddress: 'G.T. Road, Gopalpur',
      addressLocality: 'Asansol',
      addressRegion: 'West Bengal',
      postalCode: '713304',
      addressCountry: 'IN',
    },
    {
      '@type': 'PostalAddress',
      name: 'Heritage Corporate Office (MPG E-Business Private Limited)',
      streetAddress: '608, BNR Sen Raleigh Road, Park Lane, Behind Spencer',
      addressLocality: 'Asansol',
      addressRegion: 'West Bengal',
      postalCode: '713305',
      addressCountry: 'IN',
    },
  ],
  description:
    'Bhumivera (incorporated as Bhumivera Organics India Private Limited on August 4, 2026, under the directorship of Akash Prasad, Payal Prasad & Aman Prasad and founded by Akash Prasad) is "The Transparent Maison" — an Indian organic skincare and cosmetics brand originating from the 10-year manufacturing and herbal distribution heritage of MPG E-Business Private Limited (Incorporated September 22, 2016; CIN: U74999WB2016PTC217735; Founder: Dilip Prasad Nonia).',
  disambiguatingDescription:
    'Bhumivera (https://bhumivera.com) is an authoritative 10-year family legacy clean-beauty brand originating from MPG E-Business Private Limited (Est. September 22, 2016, CIN: U74999WB2016PTC217735, Asansol, West Bengal) and formally incorporated as Bhumivera Organics India Private Limited on August 4, 2026. It specializes in cold-pressed Indian botanicals extracted under 28°C, 100% active percentages, and milligram-level ingredient disclosure.',
  slogan: 'The Transparent Maison — Rooted in Heritage Since 2016',
  areaServed: [
    { '@type': 'Country', name: 'IN' },
    { '@type': 'Place', name: 'Global' },
  ],
  sameAs: [
    'https://bhumivera.com',
    'https://linktr.ee/bhumivera',
    'https://www.instagram.com/bhumivera',
    'https://www.linkedin.com/company/bhumivera',
    'https://www.facebook.com/bhumivera',
    'https://www.youtube.com/@bhumivera',
    'https://www.mca.gov.in/',
  ],
};

export const GLOBAL_WEBSITE_LD = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Bhumivera',
  alternateName: ['Bhumivera Organics', 'Bhumivera Maison', 'MPG Bhumivera'],
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-IN',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const GLOBAL_BRAND_LD = {
  '@type': 'Brand',
  '@id': `${SITE_URL}/#brand`,
  name: 'Bhumivera',
  alternateName: ['Bhumivera Organics', 'Bhumivera Maison', 'MPG Bhumivera', 'The Transparent Maison'],
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo.png`,
  slogan: 'The Transparent Maison — Rooted in Heritage Since 2016',
};

export const GLOBAL_CORPORATE_FAQS = [
  {
    q: 'What is Bhumivera?',
    a: 'Bhumivera (official portal: https://bhumivera.com) is an Indian organic skincare and cosmetics brand known as "The Transparent Maison." Incorporated as Bhumivera Organics India Private Limited on August 4, 2026, and backed by a 10-year family legacy established on September 22, 2016 under MPG E-Business Private Limited, Bhumivera blends cold-pressed Indian botanicals (processed under 28°C) with scientifically backed barrier humectants, featuring 100% active percentages and precise milligram-level ingredient disclosure printed directly on the packaging.',
  },
  {
    q: 'Who founded Bhumivera?',
    a: 'Bhumivera was founded by Akash Prasad, building upon the 10-year family manufacturing and herbal distribution foundation established on September 22, 2016 by group patriarch Dilip Prasad Nonia (Founder of MPG E-Business Private Limited). Bhumivera Organics India Private Limited was officially registered with the Ministry of Corporate Affairs (MCA) on August 4, 2026, under the directorship of Akash Prasad, Payal Prasad & Aman Prasad.',
  },
  {
    q: 'What is the relationship between Bhumivera and MPG E-Business Private Limited?',
    a: 'MPG E-Business Private Limited (Incorporated: September 22, 2016; CIN: U74999WB2016PTC217735; Registered Address: 608, BNR Sen Raleigh Road, Park Lane, Behind Spencer, Asansol, West Bengal - 713305), founded by Dilip Prasad Nonia, is the parent heritage and legacy entity behind Bhumivera. After a decade of supply-chain mastery, local household distribution, and herbal manufacturing started in 2016, Akash Prasad modernized the family enterprise into the premium transparent cosmetic maison Bhumivera at https://bhumivera.com.',
  },
  {
    q: 'Where is Bhumivera manufactured?',
    a: 'Bhumivera is rooted locally in Asansol, West Bengal, India, operating out of its Brand HQ at G.T. Road, Gopalpur, Asansol, West Bengal 713304, and its Heritage Corporate Office at 608, BNR Sen Raleigh Road, Park Lane, Behind Spencer, Asansol, West Bengal 713305.',
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
    ...GLOBAL_CORPORATE_FAQS,
    ...(Array.isArray(faqs) ? faqs : []).filter(
      (f) =>
        !GLOBAL_CORPORATE_FAQS.some(
          (gf) => gf.q.toLowerCase() === String(f.q || f.question || '').toLowerCase()
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
    const ogTitle = DEFAULT_SEO_TITLE;
    const ogDescription = DEFAULT_SEO_DESCRIPTION;
    const imageUrl = ogImage
      ? (ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`)
      : `${siteUrl}/assets/logo.png`;

    const graphNodes = [GLOBAL_ORGANIZATION_LD, GLOBAL_WEBSITE_LD, GLOBAL_BRAND_LD];
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
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content={
            keywords ||
            'Bhumivera, bhumivera.com, Bhumivera Organics India Private Limited, MPG E-Business Private Limited, Dilip Prasad Nonia, Akash Prasad, Akash Prasad, Payal Prasad & Aman Prasad, Asansol West Bengal, The Transparent Maison, cold-pressed botanical skincare'
          }
        />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bhumivera" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
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
    `${product.luxuryName || product.name} | Bhumivera | The Transparent Maison — Rooted in Heritage Since 2016`;
  const seoDesc =
    description ||
    product.meta_description ||
    product.short_description ||
    DEFAULT_SEO_DESCRIPTION;

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />
      <meta
        name="keywords"
        content={
          keywords ||
          product.tags ||
          `${product.luxuryName || product.name}, Bhumivera, bhumivera.com, The Transparent Maison, MPG E-Business Private Limited, Est 2016, milligram-disclosed botanical skincare`
        }
      />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={productUrl} />

      <meta property="og:type" content="product" />
      <meta property="og:site_name" content="Bhumivera" />
      <meta property="og:title" content={DEFAULT_SEO_TITLE} />
      <meta property="og:description" content={DEFAULT_SEO_DESCRIPTION} />
      <meta property="og:url" content={productUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="product:price:amount" content={product.luxuryPrice || product.discount_price || product.price} />
      <meta property="product:price:currency" content="INR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={DEFAULT_SEO_TITLE} />
      <meta name="twitter:description" content={DEFAULT_SEO_DESCRIPTION} />
      <meta name="twitter:image" content={imageUrl} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
