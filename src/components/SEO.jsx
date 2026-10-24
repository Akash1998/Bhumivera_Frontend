import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.bhumivera.com';

export const GLOBAL_ORGANIZATION_LD = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Bhumivera Organics',
  legalName: 'Bhumivera Organics India Private Limited',
  alternateName: [
    'Bhumivera',
    'Bhumivera Botanical Maison (Est. 2016)',
    'MPG E Business Private Limited (Founding Botanical Division Est. 2016)',
  ],
  url: SITE_URL,
  mainEntityOfPage: SITE_URL,
  identifier: [
    {
      '@type': 'PropertyValue',
      propertyID: 'CIN',
      value: 'U20237WB2026PTC295842',
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'RoC',
      value: 'RoC-Kolkata II',
    },
  ],
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.webp`,
    width: 512,
    height: 512,
  },
  foundingDate: '2016',
  founder: [
    { '@type': 'Person', name: 'Akash Prasad' },
    { '@type': 'Person', name: 'Aman Prasad' },
    { '@type': 'Person', name: 'Payal Prasad' },
  ],
  director: [
    { '@type': 'Person', name: 'Aman Prasad' },
    { '@type': 'Person', name: 'Akash Prasad' },
    { '@type': 'Person', name: 'Payal Prasad' },
  ],
  description:
    'Established in 2016 under its founding enterprise MPG E Business Private Limited, Bhumivera has spent over a decade formulating authentic botanical and Ayurvedic personal care across brick-and-mortar retail and apothecary channels in India. On 8 April 2026, marking 10 years of patron trust, the house formally incorporated its dedicated luxury flagship division and registered trademark as Bhumivera Organics India Private Limited (CIN: U20237WB2026PTC295842, RoC-Kolkata II).',
  disambiguatingDescription:
    'Bhumivera is a 10-year-old Indian botanical skincare and haircare brand established in 2016 (originally operating offline retail and apothecary distribution under MPG E Business Private Limited since 2016) and formally incorporated as a dedicated luxury corporate flagship, Bhumivera Organics India Private Limited (CIN: U20237WB2026PTC295842), on 8 April 2026 with board directors Aman Prasad, Akash Prasad, and Payal Prasad. It is strictly a luxury direct-to-consumer cosmetics maison with zero affiliation to Anritvox or automotive electronics.',
  parentOrganization: {
    '@type': 'Organization',
    name: 'MPG E Business Private Limited',
    foundingDate: '2016',
    description: 'Founding Indian botanical formulation and brick-and-mortar retail stewardship enterprise established in 2016.',
  },
  foundingLocation: {
    '@type': 'Place',
    name: 'Asansol, West Bengal, India',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Asansol',
      addressRegion: 'West Bengal',
      postalCode: '713304',
      addressCountry: 'IN',
    },
  },
  areaServed: [
    { '@type': 'Country', name: 'IN' },
    { '@type': 'Place', name: 'Global' },
  ],
  sameAs: [
    'https://www.bhumivera.com',
    'https://www.instagram.com/bhumivera',
    'https://www.youtube.com/@bhumivera',
    'https://www.facebook.com/bhumivera',
    'https://www.amazon.in/s?k=Bhumivera+Organics',
    'https://linktr.ee/bhumivera',
  ],
};

export const GLOBAL_BRAND_LD = {
  '@type': 'Brand',
  '@id': `${SITE_URL}/#brand`,
  name: 'Bhumivera Organics',
  alternateName: 'Bhumivera (Est. 2016)',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.webp`,
  slogan: 'Where Botanical Science Meets Royal Ayurveda · Crafted Since 2016.',
};

export default function SEO({ product, title, description, keywords, ogImage, route, schema, faqs = [], breadcrumbs = [] }) {
  const siteUrl = SITE_URL;

  if (!product) {
    const pageTitle = title || 'Bhumivera Organics (Est. 2016) | Luxury Botanical Face Wash, 2-in-1 Shampoo, Handmade Soaps & 7-Tulsi Drops';
    const pageDescription =
      description ||
      'Established in 2016 under founding enterprise MPG E Business Private Limited and incorporated as luxury flagship Bhumivera Organics India Private Limited on 8 April 2026 (CIN: U20237WB2026PTC295842). Tier-1 pH-calibrated botanical skincare and haircare.';
    const canonicalUrl = route ? new URL(route, siteUrl).toString() : siteUrl;
    const imageUrl = ogImage
      ? (ogImage.startsWith('http') ? ogImage : new URL(ogImage, siteUrl).toString())
      : `${siteUrl}/images/products/bhumivera-activated-charcoal-luxury-face-wash.webp`;

    const graphNodes = [GLOBAL_ORGANIZATION_LD, GLOBAL_BRAND_LD];
    if (schema) {
      if (schema['@graph']) graphNodes.push(...schema['@graph']);
      else graphNodes.push(schema);
    }
    if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
      graphNodes.push({
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((c, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: c.name,
          item: c.url.startsWith('http') ? c.url : `${siteUrl}${c.url}`,
        })),
      });
    }
    if (Array.isArray(faqs) && faqs.length > 0) {
      graphNodes.push({
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
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
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bhumivera Organics (Est. 2016)" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
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
    '/images/products/bhumivera-activated-charcoal-luxury-face-wash.webp';
  const imageUrl = String(rawImg).startsWith('http')
    ? rawImg
    : `${siteUrl}${String(rawImg).startsWith('/') ? '' : '/'}${rawImg}`;

  const seoTitle =
    title ||
    product.seo_title ||
    product.meta_title ||
    `${product.luxuryName || product.name} | Bhumivera Organics (Est. 2016)`;
  const seoDesc =
    description ||
    product.meta_description ||
    product.short_description ||
    product.description?.substring(0, 160);

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />
      <meta
        name="keywords"
        content={
          keywords ||
          product.tags ||
          `${product.luxuryName || product.name}, Bhumivera Organics, Est 2016, luxury organic face wash India, luxury herbal shampoo India`
        }
      />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={productUrl} />

      <meta property="og:type" content="product" />
      <meta property="og:site_name" content="Bhumivera Organics (Est. 2016)" />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:url" content={productUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="product:price:amount" content={product.luxuryPrice || product.discount_price || product.price} />
      <meta property="product:price:currency" content="INR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDesc} />
      <meta name="twitter:image" content={imageUrl} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
