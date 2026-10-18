import SEO from '../components/SEO';
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Search,
  Mic,
  Star,
  ShoppingBag,
  Heart,
  Eye,
  X,
  GitCompareArrows,
  FlaskConical,
} from 'lucide-react';
import { products as productsApi, categories as categoriesApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { getProductImageUrl } from '../utils/productImageUrl';
import { FALLBACK_CATALOG_PRODUCTS } from '../data/bhumiveraUniqueData';

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart() || {};
  const { isWishlisted, toggleWishlist } = useWishlist() || {};
  const { addToCompare, isInCompare } = useCompare() || {};
  const navigate = useNavigate();
  const prodId = product.id || product._id;
  const wishlisted = typeof isWishlisted === 'function' ? isWishlisted(prodId) : false;
  const compared = typeof isInCompare === 'function' ? isInCompare(prodId) : false;

  const imgSrc =
    getProductImageUrl(product.image_url || product.images || product.image) ||
    FALLBACK_CATALOG_PRODUCTS[index % FALLBACK_CATALOG_PRODUCTS.length].image_url;

  return (
    <div className="group relative flex flex-col two-tone-card border border-[#d4af37]/25 rounded-[1.5rem] sm:rounded-[2.2rem] overflow-hidden hover:border-[#d4af37]/60 hover:shadow-2xl transition-all duration-500">
      <Link to={`/product/${product.slug || prodId}`} className="relative aspect-[4/3] overflow-hidden bg-[#070a0e]">
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
                ? 'bg-[#d4af37] text-[#070a0e] border-[#d4af37]'
                : 'bg-[#070a0e]/80 text-[#cbd5e1] border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-[#070a0e]'
            }`}
          >
            <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCompare?.(product);
              navigate('/compare');
            }}
            aria-label={`Compare ${product.name}`}
            className={`p-3 backdrop-blur-md border rounded-full transition-all shadow-sm ${
              compared
                ? 'bg-[#d4af37] text-[#070a0e] border-[#d4af37]'
                : 'bg-[#070a0e]/80 text-[#cbd5e1] border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-[#070a0e]'
            }`}
          >
            <GitCompareArrows size={15} />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#070a0e]/85 border border-[#d4af37]/40 backdrop-blur-md text-[#fce096] font-mono text-[10px] font-bold uppercase tracking-wider rounded-full">
          {product.phLevel || 'pH 5.5 Balanced'}
        </div>
      </Link>

      <div className="p-5 sm:p-7 flex flex-col flex-1 text-left">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#fce096] mb-2">
          <span>{product.category_name || 'Botanical Care'}</span>
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-current text-[#d4af37]" />
            {product.rating || 4.9} ({product.reviews || 95})
          </span>
        </div>

        <Link to={`/product/${product.slug || prodId}`}>
          <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#fce096] transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-[#cbd5e1] leading-relaxed line-clamp-2 mb-5 font-light">
          {product.description}
        </p>

        <div className="mt-auto pt-4 border-t border-[#d4af37]/20 flex items-center justify-between gap-3">
          <div>
            <span className="text-xl font-serif font-bold text-[#fce096]">
              ₹{product.discount_price || product.price}
            </span>
            {product.discount_price && (
              <span className="ml-2 text-xs font-serif text-[#94a3b8] line-through font-light">₹{product.price}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => addToCart?.(product, 1)}
            className="btn-gold-luxury px-5 py-3 text-white text-[10px] font-semibold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
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
  const [categories, setCategories] = useState([
    { id: 'Facial Cleansers', name: 'Facial Cleansers' },
    { id: 'Night Elixirs & Serums', name: 'Night Elixirs & Serums' },
    { id: 'Hair & Scalp Rituals', name: 'Hair & Scalp Rituals' },
    { id: 'Barrier Hydration', name: 'Barrier Hydration' },
  ]);
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
    <div className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pt-28 pb-24 font-sans">
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
            <h1 className="text-4xl sm:text-6xl font-serif font-bold leading-none mb-3 text-white">
              <span className="font-headline-gold">The Botanical</span>{' '}
              <span className="font-headline-silver">Collection</span>
            </h1>
            <div className="gold-hairline w-24 my-4" />
            <p className="text-[#cbd5e1] font-light text-sm sm:text-base">
              Showing {filteredProducts.length} plant-powered formulations with complete INCI percentage transparency.
            </p>
          </div>

          <div className="flex-1 max-w-xl w-full">
            <div className="relative">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#d4af37]" />
              <input
                type="text"
                placeholder="Search Sea Buckthorn, Charcoal, Kumkumadi, Niacinamide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#070a0e] border border-[#d4af37]/30 rounded-full pl-12 pr-12 py-4 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37] shadow-sm"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#94a3b8] hover:text-[#fce096]"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category & Sort Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#d4af37]/20">
          <div className="flex flex-wrap gap-2">
            {['all', 'Facial Cleansers', 'Night Elixirs & Serums', 'Hair & Scalp Rituals', 'Barrier Hydration'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                  selectedCategory === cat
                    ? 'btn-gold-luxury text-white'
                    : 'two-tone-card border border-[#d4af37]/25 text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#fce096]'
                }`}
              >
                {cat === 'all' ? 'All Formulations' : cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/compare"
              className="btn-silver-luxury inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider"
            >
              <FlaskConical size={14} className="text-[#d4af37]" /> Compare Side-by-Side
            </Link>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-[#d4af37]/30 bg-[#070a0e] text-[#cbd5e1] px-4 py-2 text-xs font-semibold uppercase tracking-wider outline-none focus:border-[#d4af37]"
            >
              <option value="featured" className="bg-[#070a0e] text-white">Sort: Featured</option>
              <option value="price_asc" className="bg-[#070a0e] text-white">Price: Low to High</option>
              <option value="price_desc" className="bg-[#070a0e] text-white">Price: High to Low</option>
              <option value="rating" className="bg-[#070a0e] text-white">Highest Rated</option>
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
