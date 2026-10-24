import SEO from '../components/SEO';
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import {
  Search,
  Star,
  ShoppingBag,
  Heart,
  X,
  FlaskConical,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { products as productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductImageUrl } from '../utils/productImageUrl';
import {
  FALLBACK_CATALOG_PRODUCTS,
  BHUMIVERA_6_PRODUCTS,
  MAISON_REGIMEN_BUNDLES,
} from '../data/bhumiveraUniqueData';

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart() || {};
  const { isWishlisted, toggleWishlist } = useWishlist() || {};
  const prodId = product.id || product._id;
  const wishlisted = typeof isWishlisted === 'function' ? isWishlisted(prodId) : false;
  const rating = Number(product.rating) || 0;
  const reviewCount = Number(product.review_count) || 0;

  const imgSrc =
    getProductImageUrl(product.image_url || product.images || product.image) ||
    FALLBACK_CATALOG_PRODUCTS[index % FALLBACK_CATALOG_PRODUCTS.length].image_url;

  return (
    <div className="group relative flex flex-col two-tone-card border border-[#D4AF37]/20 rounded-[1.8rem] sm:rounded-[2.4rem] overflow-hidden hover:border-[#D4AF37]/60 hover:shadow-2xl transition-all duration-500">
      <Link to={`/product/${product.slug || prodId}`} className="relative aspect-[4/3] overflow-hidden bg-[#102219]">
        <img
          src={imgSrc}
          width="640"
          height="480"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={`${product.name} - ${product.primaryBotanicals || product.phLevel || 'Bhumivera Organics Luxury Botanical Formula'}`}
          onError={event => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_CATALOG_PRODUCTS[index % FALLBACK_CATALOG_PRODUCTS.length].image_url;
          }}
        />
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#070a0e]/85 border border-[#D4AF37]/40 font-mono text-[10px] font-bold uppercase tracking-wider text-[#FCE096]">
          Batch 04/26 · 250-Unit Run
        </div>
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist?.(product);
            }}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className={`p-3 backdrop-blur-md border rounded-full transition-all shadow-sm ${
              wishlisted
                ? 'bg-[#D4AF37] text-[#14291F] border-[#D4AF37]'
                : 'bg-[#102219]/80 text-[#DFD7C4] border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-[#14291F]'
            }`}
          >
            <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#102219]/90 border border-[#D4AF37]/40 backdrop-blur-md text-[#FCE096] font-mono text-[10px] font-bold uppercase tracking-wider rounded-full">
          {product.ph_level || product.phLevel || 'pH 5.5 Balanced'}
        </div>
      </Link>

      <div className="p-5 sm:p-7 flex flex-col flex-1 text-left">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#FCE096] mb-2">
          <span>{product.category || product.category_name || 'Botanical Care'}</span>
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-current text-[#D4AF37]" />
            {reviewCount > 0 ? `${rating.toFixed(2)} (${reviewCount})` : 'No reviews yet'}
          </span>
        </div>

        <Link to={`/product/${product.slug || prodId}`}>
          <h3 className="text-lg font-serif font-bold text-[#FAF7F2] group-hover:text-[#FCE096] transition-colors mb-1.5">
            {product.name}
          </h3>
        </Link>

        {product.subtitle && (
          <p className="text-[11px] font-mono text-emerald-300 mb-2">
            {product.subtitle}
          </p>
        )}

        <p className="text-xs text-[#DFD7C4] leading-relaxed line-clamp-2 mb-5 font-light">
          {product.short_description || product.description}
        </p>

        <div className="mt-auto pt-4 border-t border-[#244A38]/60 flex items-center justify-between gap-3">
          <div>
            <span className="text-xl font-serif font-bold text-[#FCE096]">
              ₹{product.discount_price || product.price}
            </span>
            {(product.mrp || product.discount_price) && (
              <span className="ml-2 text-xs font-serif text-[#9BB0A5] line-through font-light">
                ₹{product.mrp || product.price}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => addToCart?.(product, 1)}
            className="btn-gold-luxury min-h-11 px-5 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
          >
            <ShoppingBag size={14} /> Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Shop() {
  const [searchParams] = useSearchParams();
  const { slug: categorySlug } = useParams();
  const location = useLocation();
  const { addToCart } = useCart() || {};
  const [products, setProducts] = useState(BHUMIVERA_6_PRODUCTS || []);
  const [catalogStatus, setCatalogStatus] = useState('loaded');
  const [catalogRetry, setCatalogRetry] = useState(0);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const qParam = searchParams.get('q') || searchParams.get('search') || '';
    setSearchTerm(qParam);
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    productsApi
      .getAllActive()
      .then(({ data }) => {
        const rows = data?.data || data;
        if (!Array.isArray(rows) || rows.length === 0) {
          return;
        }
        const enriched = rows
          .filter(p => p && (p.id ?? p._id) != null && (!p.status || String(p.status).toLowerCase() === 'active'))
          .map((p, idx) => ({
            ...FALLBACK_CATALOG_PRODUCTS[idx % FALLBACK_CATALOG_PRODUCTS.length],
            ...p,
            id: p.id ?? p._id,
            _id: p._id ?? p.id,
            product_id: p.product_id ?? p.id ?? p._id,
            slug: p.slug || p.id,
            image_url:
              p.image_url ||
              FALLBACK_CATALOG_PRODUCTS[idx % FALLBACK_CATALOG_PRODUCTS.length].image_url,
          }));
        if (active && enriched.length > 0) {
          setProducts(enriched);
          setCatalogStatus('loaded');
        }
      })
      .catch(() => {
        if (active) {
          setProducts(BHUMIVERA_6_PRODUCTS || []);
          setCatalogStatus('loaded');
        }
      });
    return () => {
      active = false;
    };
  }, [catalogRetry]);

  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.active_ingredients?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q);
      const matchCategory =
        selectedCategory === 'all' ||
        p.category_id?.toString() === selectedCategory ||
        p.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        p.category_name?.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchSearch && matchCategory;
    });

    const sorted = [...list];
    if (sortBy === 'price_asc') {
      sorted.sort((a, b) => Number(a.discount_price || a.price || 0) - Number(b.discount_price || b.price || 0));
    } else if (sortBy === 'price_desc') {
      sorted.sort((a, b) => Number(b.discount_price || b.price || 0) - Number(a.discount_price || a.price || 0));
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }
    return sorted;
  }, [products, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#14291F] text-[#FAF7F2] pt-28 pb-24 font-sans">
      <SEO
        title="The Transparent Maison Collection · 6 Flagship Formulations & Regimen Bundles | Bhumivera"
        description="Shop Bhumivera's 100% label-disclosed, sub-28°C cold-pressed formulations and Complete Botanical Daily Regimen bundles (₹1,499)."
        route={location.pathname}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="max-w-xl">
            <span className="font-sub-gold uppercase tracking-[0.26em] text-xs font-bold block mb-3">
              The Transparent Maison · Batch 04/26 (250-Unit Micro-Batches)
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold leading-none mb-3 text-[#FAF7F2]">
              <span className="font-headline-gold">100% Disclosed</span>{' '}
              <span className="font-headline-silver">Formulations</span>
            </h1>
            <div className="gold-hairline w-24 my-4" />
            <p className="text-[#DFD7C4] font-light text-sm sm:text-base">
              Showing {filteredProducts.length} cold-pressed (&lt;28°C), pH 5.0–5.5 calibrated formulations and Inside-Out Botanical Rituals.
            </p>
          </div>

          <div className="flex-1 max-w-xl w-full">
            <div className="relative">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
              <input
                type="text"
                placeholder="Search 3% Charcoal, 4% Sea Buckthorn, 25mg Reetha, 7-Tulsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#102219]/75 backdrop-blur-xl border border-[#D4AF37]/25 rounded-full pl-12 pr-12 py-4 text-sm text-[#FAF7F2] placeholder-[#9BB0A5] outline-none focus:border-[#D4AF37] shadow-xl transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#9BB0A5] hover:text-[#FCE096]"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Curated Regimen Bundles Banner (Strategic Play 1) */}
        <div className="mb-12 rounded-3xl border border-[#D4AF37]/40 bg-[#102219] p-6 sm:p-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FCE096]">
                <Layers size={14} className="text-[#D4AF37]" /> Complete Botanical Regimens · Save Up To ₹845
              </span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-white">
                Architectural Regimen &amp; Inside-Out Ritual Bundles
              </h2>
            </div>
            <Link to="/verify" className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:text-[#FCE096]">
              All Bottles Serialized in Runs of 250 →
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {(MAISON_REGIMEN_BUNDLES || []).map((bundle) => (
              <div key={bundle.id} className="flex flex-col justify-between rounded-2xl border border-[#244A38] bg-[#070a0e]/80 p-5">
                <div>
                  <span className="inline-block rounded-full border border-[#D4AF37]/40 bg-[#102219] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#FCE096]">
                    {bundle.badge}
                  </span>
                  <h3 className="mt-3 font-serif text-lg font-bold text-white">{bundle.name}</h3>
                  <p className="mt-1 text-xs text-[#9BB0A5]">{bundle.tagline}</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-[#DFD7C4]">
                    {bundle.items.map((it) => (
                      <li key={it.id} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                        <span>{it.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-[#244A38] flex items-center justify-between">
                  <div>
                    <span className="font-serif text-xl font-bold text-[#FCE096]">₹{bundle.bundlePrice}</span>
                    <span className="ml-2 text-xs text-[#9BB0A5] line-through">₹{bundle.mrpTotal}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addToCart?.(
                        {
                          id: bundle.id,
                          name: bundle.name,
                          price: bundle.mrpTotal,
                          discount_price: bundle.bundlePrice,
                          image_url: bundle.image_url,
                        },
                        1
                      )
                    }
                    className="btn-gold-luxury rounded-xl px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider"
                  >
                    Add Regimen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category & Sort Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#244A38]/60">
          <div className="flex flex-wrap gap-2">
            {['all', 'Luxury Facial Cleansers', 'Luxury Hair Care', 'Artisanal Ayurvedic Cleansing Bars', 'Wellness & Immunity Drops'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-11 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                  selectedCategory === cat
                    ? 'btn-gold-luxury shadow-lg'
                    : 'bg-[#102219]/70 backdrop-blur-md border border-[#D4AF37]/25 text-[#DFD7C4] hover:border-[#D4AF37] hover:text-[#FCE096]'
                }`}
              >
                {cat === 'all' ? 'All 6 Flagship SKUs' : cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/science"
              className="btn-silver-luxury inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider"
            >
              <FlaskConical size={14} className="text-[#D4AF37]" /> Lab Science Dossier
            </Link>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-[#D4AF37]/25 bg-[#102219]/80 backdrop-blur-md text-[#DFD7C4] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider outline-none focus:border-[#D4AF37]"
            >
              <option value="featured" className="bg-[#102219] text-white">Sort: Featured</option>
              <option value="price_asc" className="bg-[#102219] text-white">Price: Low to High</option>
              <option value="price_desc" className="bg-[#102219] text-white">Price: High to Low</option>
              <option value="rating" className="bg-[#102219] text-white">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id || product._id || index} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
