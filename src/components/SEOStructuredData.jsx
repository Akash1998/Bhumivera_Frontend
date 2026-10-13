import React from 'react';

export default function SEOStructuredData({ product, breadcrumbs = [] }) {
  if (!product) return null;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image],
    description: product.description || `Organic, eco-conscious cosmetic care by Bhumivera: ${product.name}`,
    sku: product.sku || `BHUMI-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'Bhumivera',
    },
    offers: {
      '@type': 'Offer',
      url: typeof window !== 'undefined' ? window.location.href : `https://www.bhumivera.com/product/${product.slug || product.id}`,
      priceCurrency: 'INR',
      price: product.discount_price || product.price,
      availability: Number(product.quantity || 1) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.rating ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviews_count || 1,
      },
    } : {}),
  };

  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  );
}
