import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS = {
  shop: 'Shop',
  product: 'Product',
  cart: 'Cart',
  checkout: 'Checkout',
  wishlist: 'Wishlist',
  compare: 'Compare',
  profile: 'Profile',
  orders: 'Orders',
  about: 'About',
  contact: 'Contact',
  verify: 'E-Warranty',
  provenance: 'Provenance',
  'provenance-engine': 'Provenance',
  'purchase-protection': 'Custody',
  science: 'Science',
  impact: 'Impact',
  affiliate: 'Affiliate',
  legal: 'Legal',
};

export default function Breadcrumbs({ productName }) {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/');
    const isLast = i === segments.length - 1;
    const isId = /^[a-f0-9]{24}$|^\d+$/.test(seg);
    let label = isId ? (productName || 'Detail') : (ROUTE_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1));
    return { path, label, isLast };
  });

  useEffect(() => {
    if (segments.length === 0) return;

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://bhumivera.com/"
        },
        ...crumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 2,
          "name": crumb.label,
          "item": `https://bhumivera.com${crumb.path}`
        }))
      ]
    };

    const schemaText = JSON.stringify(breadcrumbSchema || null);
    if (!schemaText || schemaText.length < 10) return;

    let scriptTag = document.querySelector('script[data-schema="breadcrumb"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.setAttribute('data-schema', 'breadcrumb');
    }
    scriptTag.textContent = schemaText;
    if (!scriptTag.parentNode) document.head.appendChild(scriptTag);

    return () => {
      if (scriptTag && scriptTag.parentNode) scriptTag.parentNode.removeChild(scriptTag);
    };
  }, [pathname, productName]);

  return (
    <nav aria-label="Breadcrumb" className="bg-[#070a0e]/95 border-b border-[#d4af37]/20 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs font-mono font-medium text-[#94a3b8] uppercase tracking-wider flex-wrap">
        <Link to="/" className="flex items-center gap-1 hover:text-[#fce096] transition-colors">
          <Home size={13} className="text-[#d4af37]" /> Home
        </Link>
        {crumbs.map(({ path, label, isLast }) => (
          <React.Fragment key={path}>
            <ChevronRight size={13} className="shrink-0 text-white/30" />
            {isLast ? (
              <span className="text-[#fce096] font-bold truncate max-w-[200px]">{label}</span>
            ) : (
              <Link to={path} className="hover:text-white transition-colors truncate max-w-[120px]">{label}</Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
