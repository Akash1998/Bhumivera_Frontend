import SEO from '../components/SEO';
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Search,
  Star,
  ShoppingBag,
  Heart,
  X,
  FlaskConical,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { products as productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductImageUrl } from '../utils/productImageUrl';
import { FALLBACK_CATALOG_PRODUCTS } from '../data/bhumiveraUniqueData';

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart() || {};
  const { isWishlisted, toggleWishlist } = useWishlist() || {};
  const prodId = product.id || product._id;
  const wishlisted = typeof isWishlisted === 'function' ? isWishlisted(prodId) : false;

  const imgSrc =
    getProductImageUrl(product.image_url || product.images || product.image) ||
    FALLBACK_CATALOG_PRODUCTS[index % FALLBACK_CATALOG_PRODUCTS.length].image_url;

  return (
    <div className="group relative flex flex-col two-tone-card border border-[#D4AF37]/20 rounded-[1.8rem] sm:rounded-[2.4rem] overflow-hidden hover:border-[#D4AF37]/60 hover:shadow-2xl transition-all duration-500">
      <Link to={`/product/${product.slug || prodId}`} className="relative aspect-[4/3] overflow-hidden bg-[#102219]">
        <img
          src={imgSrc}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={product.name}
          onError={event => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_CATALOG_PRODUCTS[index % FALLBACK_CATALOG_PRODUCTS.length].image_url;
          }}
        />
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
          {product.phLevel || 'pH 5.5 Balanced'}
        </div>
      </Link>

      <div className="p-5 sm:p-7 flex flex-col flex-1 text-left">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#FCE096] mb-2">
          <span>{product.category_name || 'Botanical Care'}</span>
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-current text-[#D4AF37]" />
            {product.rating || 4.9} ({product.reviews || 95})
          </span>
        </div>

        <Link to={`/product/${product.slug || prodId}`}>
          <h3 className="text-lg font-serif font-bold text-[#FAF7F2] group-hover:text-[#FCE096] transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-[#DFD7C4] leading-relaxed line-clamp-2 mb-5 font-light">
          {product.description}
        </p>

        <div className="mt-auto pt-4 border-t border-[#244A38]/60 flex items-center justify-between gap-3">
          <div>
            <span className="text-xl font-serif font-bold text-[#FCE096]">
              ₹{product.discount_price || product.price}
            </span>
            {product.discount_price && (
              <span className="ml-2 text-xs font-serif text-[#9BB0A5] line-through font-light">₹{product.price}</span>
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
  const [products, setProducts] = useState(FALLBACK_CATALOG_PRODUCTS);
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
        if (active && Array.isArray(rows) && rows.length > 0) {
          const enriched = rows.map((p, idx) => ({
            ...FALLBACK_CATALOG_PRODUCTS[idx % FALLBACK_CATALOG_PRODUCTS.length],
            ...p,
            image_url:
              p.image_url ||
              FALLBACK_CATALOG_PRODUCTS[idx % FALLBACK_CATALOG_PRODUCTS.length].image_url,
          }));
          setProducts(enriched);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.primaryBotanicals?.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q);
      const matchCategory =
        selectedCategory === 'all' ||
        p.category_id?.toString() === selectedCategory ||
        p.category_name?.toLowerCase() === selectedCategory.toLowerCase() ||
        p.category_slug?.toLowerCase() === selectedCategory.toLowerCase();
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
        title="Botanical Collection & Formulations | Bhumivera"
        description="Browse Bhumivera's pH-calibrated botanical facial cleansers, Kashmiri Saffron Kumkumadi Night Elixir, and Ayurvedic hair rituals."
        route={location.pathname}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="max-w-xl">
            <span className="font-sub-gold uppercase tracking-[0.26em] text-xs font-bold block mb-3">
              pH 5.5 Calibrated Apothecary
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold leading-none mb-3 text-[#FAF7F2]">
              <span className="font-headline-gold">The Botanical</span>{' '}
              <span className="font-headline-silver">Collection</span>
            </h1>
            <div className="gold-hairline w-24 my-4" />
            <p className="text-[#DFD7C4] font-light text-sm sm:text-base">
              Showing {filteredProducts.length} plant-powered formulations with complete INCI percentage transparency.
            </p>
          </div>

          <div className="flex-1 max-w-xl w-full">
            <div className="relative">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
              <input
                type="text"
                placeholder="Search Sea Buckthorn, Charcoal, Kumkumadi, Niacinamide..."
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

        {/* Category & Sort Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#244A38]/60">
          <div className="flex flex-wrap gap-2">
            {['all', 'Facial Cleansers', 'Night Elixirs & Serums', 'Hair & Scalp Rituals', 'Barrier Hydration'].map((cat) => (
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
                {cat === 'all' ? 'All Formulations' : cat}
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

        {/* Product Grid or Empty State */}
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full card-glass-forest relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-[#D4AF37]/30 p-10 text-center shadow-2xl">
              <span className="card-orbit-outer h-[340px] w-[340px]" aria-hidden="true" />
              <span className="card-orbit-inner h-[240px] w-[240px]" aria-hidden="true" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#14231C] text-[#D4AF37] shadow-[0_12px_32px_rgba(0,0,0,0.65)] ring-1 ring-[#D4AF37]/20">
                <ShoppingBag size={30} strokeWidth={1.5} className="text-[#E6C57E]" />
                <Sparkles size={16} className="absolute -top-1 -right-1 text-[#E6C57E] fill-[#E6C57E]/20" />
              </div>
              <p className="relative mt-8 text-[10px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
                Ritual Search Dossier
              </p>
              <h3 className="relative mt-2 font-serif text-3xl font-bold tracking-tight">
                <span className="text-[#D4AF37]">No Formulations</span> <span className="text-[#FAF7F2]">Match Criteria</span>
              </h3>
              <p className="relative mt-3 max-w-md text-xs leading-relaxed text-[#9BB0A5]">
                Adjust your botanical filters or keyword terms to explore our small-batch Himalayan apothecaries.
              </p>
              <button
                type="button"
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="btn-gold-luxury relative mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-[0.18em]"
              >
                <span>Reset All Filters</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <ProductCard key={product.id || product._id || index} product={product} index={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
