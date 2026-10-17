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
    <div className="group relative flex flex-col bg-white border border-[#e8dcc4] rounded-[1.5rem] sm:rounded-[2.2rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(139,90,43,0.1)] hover:border-[#8b5a2b]/30 transition-all duration-500">
      <Link to={`/product/${product.slug || prodId}`} className="relative aspect-[4/3] overflow-hidden bg-[#101d16]">
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
                ? 'bg-[#8b5a2b] text-white border-[#8b5a2b]'
                : 'bg-white/90 text-[#1a1a1a] border-[#e8dcc4] hover:bg-[#8b5a2b] hover:text-white'
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
                ? 'bg-[#14251c] text-[#d4af37] border-[#d4af37]'
                : 'bg-white/90 text-[#1a1a1a] border-[#e8dcc4] hover:bg-[#14251c] hover:text-white'
            }`}
          >
            <GitCompareArrows size={15} />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md text-[#d4af37] font-mono text-[10px] font-bold uppercase tracking-wider rounded-full">
          {product.phLevel || 'pH 5.5 Balanced'}
        </div>
      </Link>

      <div className="p-5 sm:p-7 flex flex-col flex-1 text-left">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#8b5a2b] mb-2">
          <span>{product.category_name || 'Botanical Care'}</span>
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-current text-amber-500" />
            {product.rating || 4.9} ({product.reviews || 95})
          </span>
        </div>

        <Link to={`/product/${product.slug || prodId}`}>
          <h3 className="text-lg font-serif font-bold text-[#1a1a1a] group-hover:text-[#8b5a2b] transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-[#5c4a3d] leading-relaxed line-clamp-2 mb-5">
          {product.description}
        </p>

        <div className="mt-auto pt-4 border-t border-[#e8dcc4] flex items-center justify-between gap-3">
          <div>
            <span className="text-xl font-serif font-bold text-[#1a1a1a]">
              ₹{product.discount_price || product.price}
            </span>
            {product.discount_price && (
              <span className="ml-2 text-xs font-serif text-[#8b5a2b]/60 line-through">₹{product.price}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => addToCart?.(product, 1)}
            className="px-5 py-3 bg-[#14251c] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#8b5a2b] transition-all flex items-center gap-2"
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
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] pt-24 pb-24 font-sans">
      <SEO
        title="Botanical Collection & Formulations | Bhumivera"
        description="Browse Bhumivera's pH-calibrated botanical facial cleansers, Kashmiri Saffron Kumkumadi Night Elixir, and Ayurvedic hair rituals."
        route={location.pathname}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="max-w-xl">
            <span className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.4em] block mb-3">
              pH 5.5 Calibrated Apothecary
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif text-[#1a1a1a] leading-none mb-4">
              The <span className="text-[#8b5a2b] italic">Collection.</span>
            </h1>
            <p className="text-[#5c4a3d] text-sm sm:text-base">
              Showing {filteredProducts.length} plant-powered formulations with complete INCI percentage transparency.
            </p>
          </div>

          <div className="flex-1 max-w-xl w-full">
            <div className="relative">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8b5a2b]" />
              <input
                type="text"
                placeholder="Search Sea Buckthorn, Charcoal, Kumkumadi, Niacinamide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#e8dcc4] rounded-full pl-12 pr-12 py-4 text-sm text-[#1a1a1a] outline-none focus:border-[#8b5a2b] shadow-sm"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category & Sort Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#e8dcc4]">
          <div className="flex flex-wrap gap-2">
            {['all', 'Facial Cleansers', 'Night Elixirs & Serums', 'Hair & Scalp Rituals', 'Barrier Hydration'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                  selectedCategory === cat
                    ? 'bg-[#14251c] text-white'
                    : 'bg-white border border-[#e8dcc4] text-[#5c4a3d] hover:border-[#14251c]'
                }`}
              >
                {cat === 'all' ? 'All Formulations' : cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 rounded-full border border-[#14251c]/20 bg-white px-4 py-2 text-xs font-bold text-[#14251c] hover:bg-[#14251c] hover:text-white"
            >
              <FlaskConical size={14} /> Compare Side-by-Side
            </Link>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-[#e8dcc4] bg-white px-4 py-2 text-xs font-bold text-[#1a1a1a] outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
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
