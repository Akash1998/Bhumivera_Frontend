import SEO from '../components/SEO';
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Mic,
  SlidersHorizontal,
  Grid,
  List,
  Star,
  ShoppingBag,
  Heart,
  Eye,
  X,
} from 'lucide-react';
import { products as productsApi, categories as categoriesApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductImageUrl } from '../utils/productImageUrl';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist() || {};
  const navigate = useNavigate();
  const wishlisted = typeof isInWishlist === 'function' ? isInWishlist(product.id) : false;

  return (
    <article className="group relative flex min-w-0 flex-col">
      <Link to={`/product/${product.slug || product.id}`} className="relative aspect-[4/5] overflow-hidden bg-[#e9e8df]">
        <img
          src={getProductImageUrl(product.image_url || product.images || product.image) || '/logo.webp'}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          alt={product.name}
          onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }}
        />
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-100 transition-opacity md:right-4 md:top-4 md:opacity-0 md:group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (typeof toggleWishlist === 'function') {
                toggleWishlist(product);
              }
            }}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className={`grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-colors shadow-sm ${
              wishlisted
                ? 'border-[#253b2f] bg-[#253b2f] text-white'
                : 'border-white/70 bg-white/90 text-[#253b2f] hover:bg-[#253b2f] hover:text-white'
            }`}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/product/${product.slug || product.id}`);
            }}
            aria-label={`View details for ${product.name}`}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/90 text-[#253b2f] shadow-sm transition-colors hover:bg-[#253b2f] hover:text-white"
          >
            <Eye size={16} />
          </button>
        </div>
        {product.is_featured && (
          <div className="absolute bottom-3 left-3 border border-white/30 bg-[#17251c]/85 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
            Featured
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-3 sm:pt-4">
        {Number(product.rating) > 0 && Number(product.reviews) > 0 && (
          <div
            className="mb-2 flex items-center gap-1 text-[#78875f]"
            aria-label={`Rated ${product.rating} out of 5 from ${product.reviews} reviews`}
          >
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={12}
                fill={index < Math.round(Number(product.rating)) ? 'currentColor' : 'none'}
              />
            ))}
            <span className="ml-1 text-[10px] text-stone-500">({product.reviews})</span>
          </div>
        )}

        <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.17em] text-[#77816d]">
          {product.category_name || 'The collection'}
        </span>
        <Link to={`/product/${product.slug || product.id}`} className="text-[#1b2921] transition-colors hover:text-[#536b4d]">
          <h3 className="line-clamp-2 font-serif text-base leading-snug sm:text-lg">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg text-[#253b2f] sm:text-xl">
              ₹{product.discount_price || product.price}
            </span>
            {product.discount_price && (
              <span className="text-xs text-stone-500 line-through">₹{product.price}</span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 border border-[#253b2f]/25 px-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#253b2f] transition-colors hover:border-[#253b2f] hover:bg-[#253b2f] hover:text-white sm:min-h-11 sm:text-[10px]"
        >
          <ShoppingBag size={14} /> Add to bag
        </button>
      </div>
    </article>
  );
};

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showRefinePanel, setShowRefinePanel] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodResult, catResult] = await Promise.allSettled([
          productsApi.getAllActive(),
          categoriesApi.getAll(),
        ]);
        if (prodResult.status === 'fulfilled') {
          setProducts(prodResult.value.data?.data || prodResult.value.data || []);
        } else {
          throw prodResult.reason;
        }
        if (catResult.status === 'fulfilled') {
          setCategories(catResult.value.data?.data || catResult.value.data || []);
        } else {
          console.warn('[SHOP_CATEGORIES_LOAD_ERROR]', catResult.reason);
        }
      } catch (err) {
        console.error('Shop fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.addEventListener('online', fetchData);
    return () => window.removeEventListener('online', fetchData);
  }, []);

  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      const matchSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === 'all' || p.category_id?.toString() === selectedCategory;
      const matchStock = !inStockOnly || Number(p.quantity ?? 1) > 0;
      return matchSearch && matchCategory && matchStock;
    });

    const sorted = [...list];
    if (sortBy === 'price_asc') {
      sorted.sort(
        (a, b) =>
          Number(a.discount_price || a.price || 0) - Number(b.discount_price || b.price || 0)
      );
    } else if (sortBy === 'price_desc') {
      sorted.sort(
        (a, b) =>
          Number(b.discount_price || b.price || 0) - Number(a.discount_price || a.price || 0)
      );
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }
    return sorted;
  }, [products, searchTerm, selectedCategory, sortBy, inStockOnly]);

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Voice search not supported in this browser.');

    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setSearchTerm(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-[#f4f1e9] pb-20 pt-10 font-sans text-[#1b2921] sm:pb-24 sm:pt-14">
      <SEO
        title="Botanical Collection | Bhumivera"
        description="Browse Bhumivera's skincare collection and review product-specific details, ingredients and directions."
        keywords="Bhumivera skincare, product details, skincare ingredients, skincare collection"
        route="/shop"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-9 border-b border-[#253b2f]/15 pb-7 sm:mb-12 sm:pb-9">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.24em] text-[#687958] sm:text-[10px]">
                Bhumivera · Thoughtfully considered
            </p>
            <h1 className="font-editorial text-4xl leading-none tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                The collection
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
                {loading
                  ? 'A considered edit of botanical care and everyday rituals.'
                  : `A considered edit of botanical care and everyday rituals. ${filteredProducts.length} formulations.`}
            </p>
          </div>
          <div className="mx-auto mt-6 w-full max-w-xl">
            <div className="group relative">
                <div className="absolute inset-y-0 left-5 flex items-center text-[#536b4d] transition-colors group-focus-within:text-[#253b2f]">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search products and ingredients"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-[#253b2f]/20 bg-[#fbfaf5] py-3.5 pl-12 pr-24 text-sm outline-none transition focus:border-[#536b4d] focus:ring-2 focus:ring-[#536b4d]/10"
                />
                <div className="absolute inset-y-1.5 right-1.5 flex gap-1">
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      aria-label="Clear search query"
                      className="grid w-10 place-items-center text-[#536b4d] hover:bg-[#e7e9de]"
                    >
                      <X size={17} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={startVoiceSearch}
                    aria-label="Search by voice"
                    className={`grid w-10 place-items-center transition-colors ${
                      isListening ? 'bg-rose-700 text-white' : 'text-[#536b4d] hover:bg-[#e7e9de]'
                    }`}
                  >
                    <Mic size={17} />
                  </button>
                </div>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#253b2f]/15 pb-5">
          <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1">
            <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`min-h-9 shrink-0 border px-4 text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  selectedCategory === 'all'
                    ? 'border-[#253b2f] bg-[#253b2f] text-white'
                    : 'border-[#253b2f]/20 bg-transparent text-[#526b4d] hover:border-[#253b2f]'
                }`}
            >
                All products
            </button>
            {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id.toString())}
                  className={`min-h-9 shrink-0 border px-4 text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    selectedCategory === cat.id.toString()
                      ? 'border-[#253b2f] bg-[#253b2f] text-white'
                      : 'border-[#253b2f]/20 bg-transparent text-[#526b4d] hover:border-[#253b2f]'
                  }`}
                >
                  {cat.name}
                </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => setShowRefinePanel((prev) => !prev)}
                aria-expanded={showRefinePanel}
                className={`flex min-h-9 items-center gap-2 border px-3 text-[9px] font-semibold uppercase tracking-[0.13em] transition-colors ${
                  showRefinePanel ? 'border-[#253b2f] bg-[#253b2f] text-white' : 'border-[#253b2f]/20 text-[#526b4d] hover:border-[#253b2f]'
                }`}
            >
                <SlidersHorizontal size={14} /> Refine
            </button>
            <div className="hidden items-center border border-[#253b2f]/20 sm:flex">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  className={`grid h-9 w-9 place-items-center ${viewMode === 'grid' ? 'bg-[#253b2f] text-white' : 'text-[#536b4d] hover:bg-[#e7e9de]'}`}
                >
                  <Grid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  className={`grid h-9 w-9 place-items-center ${viewMode === 'list' ? 'bg-[#253b2f] text-white' : 'text-[#536b4d] hover:bg-[#e7e9de]'}`}
                >
                  <List size={15} />
                </button>
            </div>
          </div>
        </div>

        {/* Interactive Refine & Sort Drawer */}
        {showRefinePanel && (
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border border-[#253b2f]/15 bg-[#fbfaf5] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#687958]">
                Sort By:
              </span>
              {[
                { id: 'featured', label: 'Featured' },
                { id: 'price_asc', label: 'Price: Low to High' },
                { id: 'price_desc', label: 'Price: High to Low' },
                { id: 'rating', label: 'Top Rated' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSortBy(opt.id)}
                  className={`min-h-9 border px-3 text-[9px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                    sortBy === opt.id
                      ? 'border-[#253b2f] bg-[#253b2f] text-white'
                      : 'border-[#253b2f]/20 bg-transparent text-[#526b4d] hover:border-[#253b2f]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#253b2f]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="border-[#253b2f]/30 text-[#253b2f] focus:ring-[#536b4d]"
              />
              <span>In-Stock Formulations Only</span>
            </label>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse bg-[#e8e5dc]"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4'
                : 'flex flex-col gap-6'
            }
          >
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="border-y border-[#253b2f]/15 py-20 text-center sm:py-28">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center border border-[#253b2f]/15 text-[#536b4d]">
              <Search size={28} />
            </div>
            <h3 className="mb-3 font-editorial text-3xl text-[#1b2921] sm:text-4xl">Nothing in this edit just yet.</h3>
            <p className="mx-auto mb-7 max-w-md text-sm leading-6 text-stone-600">
              We couldn’t find products matching “{searchTerm}” in this selection.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setInStockOnly(false);
              }}
              className="min-h-11 border border-[#253b2f] bg-[#253b2f] px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#354c3b]"
            >
              View all products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
