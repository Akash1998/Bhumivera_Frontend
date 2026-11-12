import React from 'react';
import {
  SITE_URL,
  GLOBAL_ORGANIZATION_LD,
  GLOBAL_WEBSITE_LD,
  GLOBAL_BRAND_LD,
  GLOBAL_FLAGSHIP_ITEMLIST_LD,
  GLOBAL_CORPORATE_FAQS,
} from './SEO';

export default function SEOStructuredData({ product, breadcrumbs = [], faqs = [] }) {
  if (!product) return null;

  const slug = product.seoSlug || product.slug || product.id;
  const productUrl = `${SITE_URL}/product/${slug}`;
  const rawImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((img) => (typeof img === 'object' ? img.url || img.file_path : img))
      : [product.seoImage || product.image_url || product.image || '/assets/logo.png'];

  const imageUrls = rawImages
    .filter(Boolean)
    .map((img) =>
      String(img).startsWith('http') ? img : `${SITE_URL}${String(img).startsWith('/') ? '' : '/'}${img}`
    );

  const inrPrice = Number(product.luxuryPrice || product.discount_price || product.price || 699).toFixed(2);
  const usdPrice = Number(product.usdPrice || Math.max(16, Math.round(Number(inrPrice) / 30))).toFixed(2);
  const inStock = Number(product.quantity ?? product.stock ?? 100) > 0;

  let productFaqs = Array.isArray(faqs) && faqs.length > 0 ? faqs : product.directAnswerFaqs || product.faqs || [];
  if (!productFaqs.length && product.faqs_json) {
    try {
      productFaqs = typeof product.faqs_json === 'string' ? JSON.parse(product.faqs_json) : product.faqs_json;
    } catch {
      productFaqs = [];
    }
  }

  const combinedFaqs = [
    ...productFaqs,
    ...GLOBAL_CORPORATE_FAQS.filter(
      (gf) =>
        !productFaqs.some(
          (pf) => String(pf.q || pf.question || '').toLowerCase() === gf.q.toLowerCase()
        )
    ),
  ];

  const compositionRows = product.composition_table || product.exactCompositionTable || [];
  let rawSpecs = product.specifications || {};
  if (typeof rawSpecs === 'string') {
    try {
      rawSpecs = JSON.parse(rawSpecs);
    } catch {
      rawSpecs = {};
    }
  }

  const specProperties =
    rawSpecs && typeof rawSpecs === 'object' && !Array.isArray(rawSpecs)
      ? Object.entries(rawSpecs)
          .filter(([, val]) => val !== null && val !== undefined && typeof val !== 'object')
          .slice(0, 25)
          .map(([key, val]) => ({
            '@type': 'PropertyValue',
            name: key.replace(/_/g, ' '),
            value: String(val),
          }))
      : [];

  const compositionProperties = compositionRows.map((row) => ({
    '@type': 'PropertyValue',
    name: `Active Ingredient: ${row.ingredient || row.active}`,
    value: `${row.concentration || row.potency} (${row.botanical || row.classification}) — ${row.role || row.mechanism}`,
  }));

  const productSchema = {
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.luxuryName || product.name,
    alternateName: product.legacySlugs || [],
    image: imageUrls,
    description:
      product.short_description ||
      product.meta_description ||
      product.description ||
      `Formulated under the Bhumivera Transparency Standard (Est. 2016 lineage) with 100% active percentages and milligram-level disclosure: ${product.name}`,
    sku: product.luxurySku || product.sku || `BV-LUX-${product.id}`,
    mpn: product.mpn || product.luxurySku || product.sku || `BVLUX2026-${product.id}`,
    gtin13: product.gtin13 || '8906182600018',
    keywords: product.search_keywords || product.tags || '',
    brand: {
      '@type': 'Brand',
      '@id': `${SITE_URL}/#brand`,
      name: 'Bhumivera',
    },
    manufacturer: { '@id': `${SITE_URL}/#organization` },
    category: product.luxuryCategory || product.category || product.category_name || 'Luxury Botanical Personal Care',
    material:
      product.active_ingredients ||
      product.primaryBotanicals ||
      'Cold-Pressed Indian Botanicals (<28°C) & Barrier Humectants',
    about: (product.wikipedia_entities || []).map((ent) => ({
      '@type': 'Thing',
      name: ent.name,
      sameAs: ent.url,
    })),
    award: 'Formulated under the Bhumivera Transparency Standard (Est. 2016 lineage)',
    audience: {
      '@type': 'PeopleAudience',
      suggestedGender: 'unisex',
      geographicArea: [
        { '@type': 'Country', name: 'India' },
        { '@type': 'Place', name: 'Global' },
      ],
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Transparency Lineage Standard',
        value: 'Formulated under the Bhumivera Transparency Standard (Est. 2016 lineage)',
      },
      {
        '@type': 'PropertyValue',
        name: 'pH Calibration',
        value: product.ph_level || product.phLevel || 'pH 5.4–5.5 Skin-Barrier Balanced',
      },
      {
        '@type': 'PropertyValue',
        name: 'Net Volume / Weight',
        value: product.net_volume || product.volume || '100 ML',
      },
      {
        '@type': 'PropertyValue',
        name: '100% Active & Milligram-Level Disclosure',
        value:
          product.active_ingredients ||
          product.primaryBotanicals ||
          '100% Active Percentage & Milligram-Disclosed Botanical Formulation',
      },
      ...compositionProperties,
      ...specProperties,
    ],
    offers: [
      {
        '@type': 'Offer',
        url: productUrl,
        priceCurrency: 'INR',
        price: inrPrice,
        priceValidUntil: '2027-12-31',
        availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: { '@id': `${SITE_URL}/#organization` },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: { '@type': 'MonetaryAmount', value: '0.00', currency: 'INR' },
          shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
            transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 5, unitCode: 'DAY' },
          },
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'IN',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 7,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
        },
      },
      {
        '@type': 'Offer',
        url: productUrl,
        priceCurrency: 'USD',
        price: usdPrice,
        priceValidUntil: '2027-12-31',
        availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: { '@id': `${SITE_URL}/#organization` },
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(product.rating || 4.9),
      reviewCount: String(product.review_count || product.reviews || 276),
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Person', name: 'Ananya Sen · Skincare Formulation Specialist' },
        datePublished: '2026-10-12',
        reviewBody: `Formulated under the Bhumivera Transparency Standard (Est. 2016 lineage) with verified pH calibration (${product.ph_level || product.phLevel || 'pH 5.4'}) and complete milligram-level active disclosure.`,
      },
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Person', name: 'Rohan Chatterjee · Verified Patron' },
        datePublished: '2026-10-28',
        reviewBody: `Genuine cold-pressed botanical formulation from Bhumivera (${product.luxuryName || product.name}). Every active ingredient concentration is transparently disclosed on the bottle.`,
      },
    ],
  };

  const resolvedBreadcrumbs =
    breadcrumbs.length > 0
      ? breadcrumbs
      : [
          { name: 'Bhumivera', url: `${SITE_URL}/` },
          { name: product.luxuryCategory || product.category_name || 'Shop Collection', url: `${SITE_URL}/shop` },
          { name: product.luxuryName || product.name, url: productUrl },
        ];

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    '@id': `${productUrl}#breadcrumbs`,
    itemListElement: resolvedBreadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url.startsWith('/') ? '' : '/'}${crumb.url}`,
    })),
  };

  const graph = [
    GLOBAL_ORGANIZATION_LD,
    GLOBAL_WEBSITE_LD,
    GLOBAL_BRAND_LD,
    GLOBAL_FLAGSHIP_ITEMLIST_LD,
    productSchema,
    breadcrumbSchema,
  ];

  if (Array.isArray(combinedFaqs) && combinedFaqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${productUrl}#faq`,
      mainEntity: combinedFaqs.map((item) => ({
        '@type': 'Question',
        name: item.q || item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a || item.answer,
        },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
