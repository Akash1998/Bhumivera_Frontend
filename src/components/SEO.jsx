import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ product }) {
  if (!product) return null;

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.bhumivera.com';
  const productUrl = `${siteUrl}/product/${product.slug}`;
  
  // Safely extract the first image or default to logo
  const imageUrl = product.images?.[0] 
    ? (product.images[0].startsWith('http') ? product.images[0] : `${import.meta.env.VITE_IMAGE_BASE_URL}/${product.images[0]}`)
    : `${siteUrl}/assets/images/logo.webp`;

  // Compile the exact JSON-LD Schema Google requires for Product Rich Results
  const jsonLdSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [imageUrl],
    "description": product.meta_description || product.description,
    "sku": product.sku || `BHU-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Bhumivera"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "INR",
      "price": product.discount_price || product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.status === 'active' && product.quantity > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Bhumivera"
      }
    }
  };

  return (
    <Helmet>
      {/* Standard HTML Metadata */}
      <title>{product.meta_title || `${product.name} | Bhumivera`}</title>
      <meta name="description" content={product.meta_description || product.description?.substring(0, 155)} />
      <meta name="keywords" content={product.tags} />
      <link rel="canonical" href={productUrl} />

      {/* Open Graph / Facebook / Instagram Metadata */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={product.meta_title || product.name} />
      <meta property="og:description" content={product.meta_description || product.description?.substring(0, 155)} />
      <meta property="og:url" content={productUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="product:price:amount" content={product.discount_price || product.price} />
      <meta property="product:price:currency" content="INR" />

      {/* Twitter Cards Metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={product.meta_title || product.name} />
      <meta name="twitter:description" content={product.meta_description || product.description?.substring(0, 155)} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Google JSON-LD Schema Script */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLdSchema)}
      </script>
    </Helmet>
  );
}
