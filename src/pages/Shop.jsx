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
import { scarcitySimulator } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductImageUrl } from '../utils/productImageUrl';
import useScarcitySimulator from '../hooks/useScarcitySimulator';
import ScarcitySimulationBadge from '../components/ScarcitySimulationBadge';
import { haptics } from '../utils/haptics';
import {
  FALLBACK_CATALOG_PRODUCTS,
  BHUMIVERA_6_PRODUCTS,
  MAISON_REGIMEN_BUNDLES,
} from '../data/bhumiveraUniqueData';

const ProductCard = ({ product, index, simulation, sampleActivityEnabled }) => {
  const { addToCart } = useCart() || {};
  const { isWishlisted, toggleWishlist } = useWishlist() || {};
  const prodId = product.id || product._id;
  const wishlisted = typeof isWishlisted === 'function' ? isWishlisted(product) : false;
  const rating = Number(product.rating) || 0;
  const reviewCount = Number(product.review_count) || 0;
  const simulatedUnitsSoldToday = Number(
    simulation?.simulatedSoldToday ?? simulation?.soldToday
  ) || 0;

  const imgSrc =
    getProductImageUrl(product.image_url || product.images || product.image) ||
    FALLBACK_CATALOG_PRODUCTS[index % FALLBACK_CATALOG_PRODUCTS.length].image_url;

  return (
    <div className="group relative flex flex-col two-tone-card border border-[#D4AF37]/20 rounded-2xl sm:rounded-[2rem] overflow-hidden hover:border-[#D4AF37]/60 hover:shadow-2xl transition-all duration-300">
      <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-[#102219]">
        <Link to={`/product/${product.slug || prodId}`} className="block w-full h-full">
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
        </Link>
        {simulation?.enabled && simulatedUnitsSoldToday > 0 && (
          <div className="pointer-events-none absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-950/90 border border-emerald-300/40 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-100">
            Sold Today: {simulatedUnitsSoldToday}
          </div>
        )}
        <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              haptics.impactLight();
              toggleWishlist?.(product);
            }}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className={`w-9 h-9 sm:w-10 sm:h-10 backdrop-blur-md border rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 ${
              wishlisted
                ? 'bg-[#D4AF37] text-[#14291F] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.6)]'
                : 'bg-[#102219]/90 text-[#DFD7C4] border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#14291F]'
            }`}
          >
            <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="pointer-events-none absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10 px-2 sm:px-3 py-0.5 sm:py-1 bg-[#102219]/90 border border-[#D4AF37]/40 backdrop-blur-md text-[#FCE096] font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full">
          {product.ph_level || product.phLevel || 'pH 5.5'}
        </div>
      </div>

      <div className="p-3 sm:p-6 flex flex-col flex-1 text-left">
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#FCE096] mb-1 sm:mb-2">
          <span className="truncate max-w-[100px] sm:max-w-none">{product.category || product.category_name || 'Botanical'}</span>
          <span className="flex items-center gap-1 shrink-0">
            <Star size={11} className="fill-current text-[#D4AF37]" />
            {reviewCount > 0 ? `${rating.toFixed(1)}` : 'New'}
          </span>
        </div>

        <Link to={`/product/${product.slug || prodId}`}>
          <h3 className="text-xs sm:text-base font-serif font-bold text-[#FAF7F2] group-hover:text-[#FCE096] transition-colors mb-1 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        {product.subtitle && (
          <p className="text-[10px] sm:text-[11px] font-mono text-emerald-300 mb-1.5 truncate hidden sm:block">
            {product.subtitle}
          </p>
        )}

        <p className="text-[11px] sm:text-xs text-[#DFD7C4] leading-relaxed line-clamp-1 sm:line-clamp-2 mb-3 sm:mb-4 font-light">
          {product.short_description || product.description}
        </p>

        {simulation?.enabled && (
          <div className="mb-3 hidden sm:block">
            <ScarcitySimulationBadge
              snapshot={simulation}
              productName={product.name}
              sampleActivityEnabled={sampleActivityEnabled}
              compact
            />
          </div>
        )}

        <div className="mt-auto pt-2.5 sm:pt-4 border-t border-[#244A38]/60 flex items-center justify-between gap-1.5 sm:gap-3">
          <div>
            <span className="text-sm sm:text-xl font-serif font-bold text-[#FCE096]">
              ₹{product.discount_price || product.price}
            </span>
            {(product.mrp || product.discount_price) && (
              <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs font-serif text-[#9BB0A5] line-through font-light">
                ₹{product.mrp || product.price}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => addToCart?.(product, 1)}
            className="btn-gold-luxury h-8 sm:min-h-11 px-2.5 sm:px-5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-lg sm:rounded-xl transition-all flex items-center gap-1 sm:gap-2 active:scale-95"
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Add to Bag</span>
            <span className="sm:hidden">Add</span>
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
  const [products, setProducts] = useState(BHUMIVERA_6_PRODUCTS || []);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('popular_today');
  const [popularToday, setPopularToday] = useState([]);
  const [popularError, setPopularError] = useState('');
  const { products: simulations, enabled: simulatorEnabled, sampleActivityEnabled, error: simulatorError } =
    useScarcitySimulator(products.map(product => product.id || product._id));

  useEffect(() => {
    const qParam = searchParams.get('q') || searchParams.get('search') || '';
    setSearchTerm(qParam);
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    scarcitySimulator.getPopularToday()
      .then(({ data }) => {
        if (active) setPopularToday(Array.isArray(data?.products) ? data.products : []);
      })
      .catch(error => {
        if (active) setPopularError('Today’s verified order ranking is temporarily unavailable.');
      });
    return () => {
      active = false;
    };
  }, []);

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
          .filter(p => p && (p.id ?? p._id) != null &&
            (!p.status || String(p.status).toLowerCase() === 'active') &&
            !String(p.sku || '').startsWith('BV-BND-'))
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
        }
      })
      .catch(() => {
        if (active) {
          setProducts(BHUMIVERA_6_PRODUCTS || []);
        }
      });
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
    if (sortBy === 'popular_today') {
      const ranking = new Map(popularToday.map((item, index) => [String(item.id), index]));
      sorted.sort((a, b) => {
        const rankA = ranking.get(String(a.id || a._id));
        const rankB = ranking.get(String(b.id || b._id));
        if (rankA === undefined && rankB === undefined) return 0;
        if (rankA === undefined) return 1;
        if (rankB === undefined) return -1;
        return rankA - rankB;
      });
    } else if (sortBy === 'price_asc') {
      sorted.sort((a, b) => Number(a.discount_price || a.price || 0) - Number(b.discount_price || b.price || 0));
    } else if (sortBy === 'price_desc') {
      sorted.sort((a, b) => Number(b.discount_price || b.price || 0) - Number(a.discount_price || a.price || 0));
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }
    return sorted;
  }, [products, searchTerm, selectedCategory, sortBy, popularToday]);

  return (
    <div className="min-h-screen bg-[#14291F] text-[#FAF7F2] pt-20 sm:pt-28 pb-24 font-sans">
      <SEO
        title="The Transparent Maison Collection · 6 Flagship Formulations & Regimen Bundles | Bhumivera"
        description="Shop Bhumivera's 100% label-disclosed, sub-28°C cold-pressed formulations and Complete Botanical Daily Regimen bundles (₹1,499)."
        route={location.pathname}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-8 mb-6 sm:mb-10">
          <div className="max-w-xl">
            <span className="font-sub-gold uppercase tracking-[0.2em] sm:tracking-[0.26em] text-[10px] sm:text-xs font-bold block mb-1.5 sm:mb-3">
              The Transparent Maison · 6 Flagship SKUs
            </span>
            <h1 className="text-2xl sm:text-5xl font-serif font-bold leading-tight mb-2 sm:mb-3 text-[#FAF7F2]">
              <span className="font-headline-gold">100% Disclosed</span>{' '}
              <span className="font-headline-silver">Formulations</span>
            </h1>
            <div className="gold-hairline w-16 sm:w-24 my-2.5 sm:my-4" />
            <p className="text-[#DFD7C4] font-light text-xs sm:text-base">
              Showing {filteredProducts.length} cold-pressed (&lt;28°C), pH 5.0–5.5 calibrated formulations.
            </p>
            <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-[#9BB0A5]">
              {popularError
                ? popularError
                : popularToday.length
                  ? 'Ranked by today’s live customer orders across our small-batch botanical collection.'
                  : 'Small-batch cold-pressed botanical formulations freshly compounded and dispatched from our cleanroom.'}
            </p>
          </div>

          <div className="flex-1 max-w-xl w-full">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
              <input
                type="text"
                placeholder="Search charcoal, sea buckthorn, reetha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#102219]/85 backdrop-blur-xl border border-[#D4AF37]/25 rounded-xl sm:rounded-full pl-10 pr-10 py-3 sm:py-4 text-xs sm:text-sm text-[#FAF7F2] placeholder-[#9BB0A5] outline-none focus:border-[#D4AF37] shadow-lg transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#9BB0A5] hover:text-[#FCE096]"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Curated Regimen Bundles Banner */}
        <div className="mb-6 sm:mb-12 rounded-2xl sm:rounded-3xl border border-[#D4AF37]/40 bg-gradient-to-b from-[#102219] to-[#0a1711] p-4 sm:p-7 shadow-xl w-full max-w-full overflow-hidden box-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#FCE096]">
                <Layers size={13} className="text-[#D4AF37]" /> Complete Regimens · Save Up To ₹845
              </span>
              <h2 className="mt-0.5 sm:mt-1 font-serif text-lg sm:text-2xl font-bold text-white">
                Architectural Regimen Bundles
              </h2>
            </div>
            <Link to="/verify" className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:text-[#FCE096] transition-colors">
              Verify authenticity →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 w-full min-w-0">
            {(MAISON_REGIMEN_BUNDLES || []).map((bundle) => (
              <div 
                key={bundle.id} 
                className="group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-[#244A38] bg-[#070a0e]/85 hover:border-[#D4AF37]/50 p-4 sm:p-5 transition-all duration-300 min-w-0 w-full overflow-hidden box-border shadow-sm hover:shadow-lg"
              >
                <div className="min-w-0 w-full">
                  <span className="inline-block rounded-full border border-[#D4AF37]/40 bg-[#102219] px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold text-[#FCE096]">
                    {bundle.badge}
                  </span>
                  <Link 
                    to={`/combo/${bundle.id}`} 
                    className="mt-2 block font-serif text-base sm:text-lg font-bold text-white hover:text-[#FCE096] transition-colors truncate"
                  >
                    {bundle.name}
                  </Link>
                  <p className="mt-1 text-[11px] sm:text-xs text-[#9BB0A5] line-clamp-1">{bundle.tagline}</p>
                  <ul className="mt-3 space-y-1.5 text-[10px] sm:text-xs text-[#DFD7C4] min-w-0 w-full">
                    {bundle.items.map((it) => (
                      <li key={it.id} className="flex items-center gap-2 min-w-0 w-full">
                        <CheckCircle2 size={12} className="shrink-0 text-[#D4AF37]" />
                        <span className="truncate min-w-0 flex-1">{it.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-[#244A38] flex items-center justify-between gap-3 min-w-0">
                  <div className="min-w-0">
                    <span className="font-serif text-base sm:text-xl font-bold text-[#FCE096]">₹{bundle.bundlePrice}</span>
                    <span className="ml-1.5 text-[10px] sm:text-xs text-[#9BB0A5] line-through">₹{bundle.mrpTotal}</span>
                  </div>
                  <Link 
                    to={`/combo/${bundle.id}`} 
                    className="btn-gold-luxury shrink-0 rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category & Sort Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-[#244A38]/60">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: 'all', label: 'All 6 SKUs' },
              { id: 'Luxury Facial Cleansers', label: 'Facial' },
              { id: 'Luxury Hair Care', label: 'Hair Care' },
              { id: 'Artisanal Ayurvedic Cleansing Bars', label: 'Cleansing Bars' },
              { id: 'Wellness & Immunity Drops', label: 'Wellness Drops' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap shrink-0 min-h-9 sm:min-h-11 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition ${
                  selectedCategory === cat.id
                    ? 'btn-gold-luxury shadow-lg'
                    : 'bg-[#102219]/70 backdrop-blur-md border border-[#D4AF37]/25 text-[#DFD7C4] hover:border-[#D4AF37] hover:text-[#FCE096]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
            <Link
              to="/science"
              className="btn-silver-luxury inline-flex items-center gap-1.5 rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider"
            >
              <FlaskConical size={12} className="text-[#D4AF37]" /> <span className="hidden sm:inline">Lab Science Dossier</span><span className="sm:hidden">Science</span>
            </Link>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-[#D4AF37]/25 bg-[#102219]/90 backdrop-blur-md text-[#DFD7C4] px-3 sm:px-4 py-1.5 sm:py-2.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider outline-none focus:border-[#D4AF37]"
            >
              <option value="featured" className="bg-[#102219] text-white">Featured</option>
              <option value="popular_today" className="bg-[#102219] text-white">Most ordered</option>
              <option value="price_asc" className="bg-[#102219] text-white">Price: Low to High</option>
              <option value="price_desc" className="bg-[#102219] text-white">Price: High to Low</option>
              <option value="rating" className="bg-[#102219] text-white">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid - 2 columns on mobile for pure native app look */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-7">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id || product._id || index}
              product={product}
              index={index}
              simulation={simulatorEnabled ? simulations[String(product.id || product._id)] : null}
              sampleActivityEnabled={sampleActivityEnabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
