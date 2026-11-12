import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SITE_URL = 'https://www.bhumivera.com';

export const DEFAULT_SEO_TITLE =
  'Bhumivera | The Transparent Maison — 100% Active Botanical Skincare & Haircare (Est. 2016)';

export const DEFAULT_SEO_DESCRIPTION =
  'Official Bhumivera Portal (bhumivera.com). Rooted in a 10-year manufacturing heritage (MPG E-Business, Est. 2016), offering 100% active, milligram-disclosed, sub-28°C cold-pressed Sea Buckthorn Face Wash, Activated Charcoal Face Wash with Niacinamide & Hyaluronic Acid, 2-in-1 Botanical Shampoo, Ayurvedic Cleansing Bars & 7-Tulsi Drops.';

export const DEFAULT_SEO_KEYWORDS =
  'Bhumivera, bhumivera.com, bhumivera facewash, bhumivera face wash, bhumivera seabuckthorn face wash, bhumivera sea buckthorn face wash, seabuckthorn face wash, sea buckthorn face wash India, facewash with niacinamide, facewash with niacidamine, niacinamide face wash, hyaluronic acid face wash, activated charcoal face wash, bhumivera charcoal face wash, 2 in 1 botanical shampoo, rosemary bhringraj reetha amla shampoo, handmade ayurvedic charcoal soap, aloe vera neem tulsi soothing bar, kalpvriksh satva tulsi drops, 7 tulsi drops, bhumivera impact, Bhumivera Organics, Bhumivera Organics India Private Limited, The Transparent Maison, MPG E-Business Private Limited, Dilip Prasad Nonia, Akash Prasad, Payal Prasad, Aman Prasad, Asansol West Bengal, cold-pressed botanical skincare under 28C, 100% active percentage skincare, milligram ingredient disclosure';

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
    'Bhumivera Skincare',
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
  description:
    'Bhumivera (incorporated as Bhumivera Organics India Private Limited on August 4, 2026, under the directorship of Akash Prasad, Payal Prasad & Aman Prasad and founded by Akash Prasad) is "The Transparent Maison" — an Indian organic skincare and cosmetics brand originating from the 10-year manufacturing and herbal distribution heritage of MPG E-Business Private Limited (Incorporated September 22, 2016; CIN: U74999WB2016PTC217735; Founder: Dilip Prasad Nonia).',
  disambiguatingDescription:
    'Bhumivera (https://www.bhumivera.com) is an authoritative 10-year family legacy clean-beauty brand originating from MPG E-Business Private Limited (Est. September 22, 2016, CIN: U74999WB2016PTC217735, Asansol, West Bengal) and formally incorporated as Bhumivera Organics India Private Limited on August 4, 2026. It specializes in cold-pressed Indian botanicals extracted under 28°C, 100% active percentages, and milligram-level ingredient disclosure.',
  slogan: 'The Transparent Maison — Rooted in Heritage Since 2016',
  areaServed: [
    { '@type': 'Country', name: 'IN' },
    { '@type': 'Place', name: 'Global' },
  ],
  sameAs: [
    'https://www.bhumivera.com',
    'https://www.bhumivera.com',
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
  alternateName: ['Bhumivera Organics', 'Bhumivera Maison', 'MPG Bhumivera', 'The Transparent Maison'],
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo.png`,
  slogan: 'The Transparent Maison — Rooted in Heritage Since 2016',
};

export const GLOBAL_FLAGSHIP_ITEMLIST_LD = {
  '@type': 'ItemList',
  '@id': `${SITE_URL}/#flagship-catalog`,
  name: 'Bhumivera Official 6-Product Luxury Botanical Catalog',
  description:
    'Complete 6-SKU collection of Bhumivera 100% active percentage and milligram-disclosed botanical skincare, haircare, cleansing bars, and 7-Tulsi adaptogen drops.',
  numberOfItems: 6,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML) — 3% Charcoal, 5% Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem',
      url: `${SITE_URL}/product/activated-charcoal-luxury-face-wash`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML) — 4% Sea Buckthorn (Omega-7), 5% Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide, 0.5% Manjistha, 0.5% Haridra',
      url: `${SITE_URL}/product/himalayan-seabuckthorn-luxury-face-wash`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML) — 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera, 5mg Shikakai',
      url: `${SITE_URL}/product/luxury-2-in-1-botanical-shampoo-conditioner`,
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Bhumivera Charcoal Deep Cleansing Bar (100 GM) — Handmade Ayurvedic Activated Charcoal & Aloe Vera Luxury Bathing Soap',
      url: `${SITE_URL}/product/artisanal-charcoal-handmade-soap`,
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'Bhumivera Soothing Bar (100 GM) — Handmade Aloe Vera, Neem & Sacred Tulsi Ayurvedic Cleansing Soap',
      url: `${SITE_URL}/product/artisanal-aloe-vera-handmade-soap`,
    },
    {
      '@type': 'ListItem',
      position: 6,
      name: 'Bhumivera Kalpvriksh Satva Tulsi (30 ML) — 9.0ml per 10ml Concentrated Liquid Extract of 7 Types of Tulsi (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi)',
      url: `${SITE_URL}/product/kalpvriksh-satva-tulsi-7-tulsi-extract`,
    },
  ],
};

export const GLOBAL_CORPORATE_FAQS = [
  {
    q: 'What is Bhumivera?',
    a: 'Bhumivera (official portal: https://www.bhumivera.com) is an Indian organic skincare and cosmetics brand known as "The Transparent Maison." Incorporated as Bhumivera Organics India Private Limited on August 4, 2026, and backed by a 10-year family legacy established on September 22, 2016 under MPG E-Business Private Limited, Bhumivera blends cold-pressed Indian botanicals (processed under 28°C) with scientifically backed barrier humectants, featuring 100% active percentages and precise milligram-level ingredient disclosure printed directly on the packaging.',
  },
  {
    q: 'Which Bhumivera face wash contains Sea Buckthorn, Niacinamide, and Hyaluronic Acid?',
    a: 'Both flagship Bhumivera facial cleansers contain Niacinamide (0.1%), Hyaluronic Acid (0.1%), Botanical Glycerin (5.0%), Manjistha (0.5%), Haridra/Turmeric (0.5%), Neem (0.5%), and Cucumber Extract (0.5%) in a sulfate-free pH 5.3–5.5 base. The Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (https://www.bhumivera.com/product/himalayan-seabuckthorn-luxury-face-wash) features 4.0% cold-pressed Himalayan Sea Buckthorn (rich in Omega-7 and Vitamin C carotenoids) for glowing radiance, while the Bhumivera Activated Charcoal Purifying Luxury Face Wash (https://www.bhumivera.com/product/activated-charcoal-luxury-face-wash) features 3.0% microporous Activated Charcoal for deep urban pore purification.',
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
    q: 'Where is Bhumivera manufactured and what is the Bhumivera Impact Ledger?',
    a: 'Bhumivera is rooted locally in Asansol, West Bengal, India, operating out of its Brand HQ at G.T. Road, Gopalpur, Asansol, West Bengal 713304, and its Heritage Corporate Office at 608, BNR Sen Raleigh Road, Park Lane, Behind Spencer, Asansol, West Bengal 713305. Through https://www.bhumivera.com/impact, Bhumivera operates verifiable grassroots community initiatives in West Bengal—including The Ceaser Memorial Stray Animal Care initiative, The Smt. Shanti Memorial Elderly & Disabled Ration Kits initiative, and six 2028 ecological restoration corridors.',
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
      GLOBAL_FLAGSHIP_ITEMLIST_LD,
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
    `${product.luxuryName || product.name} | Bhumivera — The Transparent Maison (Est. 2016)`;
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
