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
  ArrowRight,
  ShieldCheck,
  Leaf,
  BookOpen,
} from 'lucide-react';
import ActiveComboShowcase from '../components/ActiveComboShowcase';
import { products as productsApi } from '../services/api';
import { scarcitySimulator } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductImageUrl } from '../utils/productImageUrl';
import useScarcitySimulator from '../hooks/useScarcitySimulator';
import ScarcitySimulationBadge from '../components/ScarcitySimulationBadge';
import { haptics } from '../utils/haptics';
import { isComboProduct } from '../utils/comboProducts';
import {
  FALLBACK_CATALOG_PRODUCTS,
  BHUMIVERA_6_PRODUCTS,
} from '../data/bhumiveraUniqueData';

const SEARCH_STOP_WORDS = new Set([
  'with', 'for', 'and', 'the', 'best', 'in', 'by', 'of', 'to', 'from', 'a', 'an', 'on', 'my', 'all', 'india',
]);

const normalizeSearchText = (raw = '') =>
  String(raw || '')
    .toLowerCase()
    .replace(/niacidamine|niacinimide|nicotinamide|vitamin\s*b3/g, 'niacinamide')
    .replace(/hyaluronic|hyluronic|sodium\s*hyaluronate/g, 'hyaluronic acid')
    .replace(/facewash|face-wash/g, 'face wash')
    .replace(/seabuckthorn|sea-buckthorn|seabuck\s*thorn/g, 'sea buckthorn')
    .replace(/aloevera|aleovera/g, 'aloe vera')
    .replace(/shikhakai/g, 'shikakai')
    .replace(/bringna|bhringraj/g, 'bhringraj')
    .replace(/ritta|reetha|soapnut/g, 'reetha')
    .replace(/haridra|turmeric/g, 'haridra turmeric')
    .replace(/manjistha|rubia\s*cordifolia/g, 'manjistha')
    .replace(/panchtulsi|panch\s*tulsi|seven\s*tulsi|7\s*tulsi/g, 'tulsi')
    .trim();

const CATEGORY_SEO_MAP = {
  'luxury-facial-cleansers': {
    title: 'Luxury Botanical Facial Cleansers — Sea Buckthorn & Activated Charcoal Face Washes | Bhumivera',
    description:
      'Shop Bhumivera pH 5.3–5.5 Sulfate-Free Luxury Facial Cleansers: 4% Himalayan Sea Buckthorn Face Wash and 3% Activated Charcoal Face Wash with 5% Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide, Manjistha & Haridra.',
  },
  'luxury-hair-care': {
    title: 'Sulfate-Free Ayurvedic Hair Care — Royal 2-in-1 Botanical Shampoo with Conditioner | Bhumivera',
    description:
      'Shop Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML): 100mg standardized 8-herb complex with 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, Triphala, Neem, Aloe Vera & Shikakai.',
  },
  'artisanal-ayurvedic-cleansing-bars': {
    title: 'Artisanal Ayurvedic Cleansing Bars — Charcoal & Aloe-Neem-Tulsi Handmade Soaps | Bhumivera',
    description:
      'Shop Bhumivera 100 GM Handmade Ayurvedic Luxury Bathing Bars: Charcoal Deep Cleansing Bar with Aloe Vera and Soothing Bar with Aloe Vera, Neem & Sacred Tulsi.',
  },
  'luxury-ayurvedic-wellness-immunity-drops': {
    title: 'Kalpvriksh Satva 7-Tulsi Drops — 90% Concentrated Seven-Tulsi Adaptogen | Bhumivera',
    description:
      'Shop Bhumivera Kalpvriksh Satva Tulsi (30 ML): 9.0ml per 10ml concentrated liquid extract of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi).',
  },
};

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
    <div className="group relative flex flex-col two-tone-card border border-[#D4AF37]/25 rounded-2xl sm:rounded-[2rem] overflow-hidden hover:border-[#D4AF37]/70 hover:shadow-2xl transition-all duration-300">
      <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-[#102219]">
        <Link to={`/product/${product.slug || prodId}`} className="block w-full h-full">
          <img
            src={imgSrc}
            width="640"
            height="480"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            alt={`${product.name} - ${product.active_ingredients || product.primaryBotanicals || product.phLevel || 'Bhumivera Organics Luxury Botanical Formula'}`}
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
  const { products: simulations, enabled: simulatorEnabled, sampleActivityEnabled } =
    useScarcitySimulator(products.map(product => product.id || product._id));

  useEffect(() => {
    const qParam = searchParams.get('q') || searchParams.get('search') || '';
    setSearchTerm(qParam);
  }, [searchParams]);

  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
  }, [categorySlug]);

  useEffect(() => {
    let active = true;
    scarcitySimulator.getPopularToday()
      .then(({ data }) => {
        if (active) setPopularToday(Array.isArray(data?.products) ? data.products : []);
      })
      .catch(() => {
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
            !isComboProduct(p))
          .map((p) => {
            const sixMatch = (BHUMIVERA_6_PRODUCTS || []).find(bp =>
              bp.slug === p.slug ||
              bp.sku === p.sku ||
              String(bp.id) === String(p.id) ||
              bp.legacySlugs?.includes(p.slug) ||
              bp.legacyIds?.includes(Number(p.id)) ||
              (p.name && bp.name?.toLowerCase().includes(p.name.toLowerCase())) ||
              (p.name && p.name.toLowerCase().includes(bp.name?.toLowerCase()))
            );
            return {
              ...(sixMatch || {}),
              ...p,
              id: p.id ?? p._id,
              _id: p._id ?? p.id,
              product_id: p.product_id ?? p.id ?? p._id,
              slug: p.slug || sixMatch?.slug || p.id,
              name: p.name || sixMatch?.name,
              category: p.category_name || sixMatch?.category || p.category || 'Luxury Botanical Formula',
              category_name: p.category_name || sixMatch?.category || p.category || 'Luxury Botanical Formula',
              image_url: p.image_url || sixMatch?.image_url || p.images?.[0]?.url || p.image,
              quantity: p.quantity ?? sixMatch?.quantity ?? 100,
            };
          });
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
    const qRaw = searchTerm.toLowerCase().trim();
    const normalizedQ = normalizeSearchText(qRaw);
    const queryTokens = normalizedQ
      .split(/[^a-z0-9.]+/)
      .filter((t) => t.length >= 2 && !SEARCH_STOP_WORDS.has(t));
    const nonBrandTokens = queryTokens.filter((t) => t !== 'bhumivera' && t !== 'organics');

    const scoredList = products
      .map((p) => {
        const matchCategory = (() => {
          if (!selectedCategory || selectedCategory === 'all') return true;
          const sel = selectedCategory.toLowerCase().trim();
          const pCat = (p.category || '').toLowerCase();
          const pCatName = (p.category_name || '').toLowerCase();
          const pCatId = String(p.category_id || '');

          if (pCatId === selectedCategory) return true;
          if (pCat.includes(sel) || pCatName.includes(sel) || sel.includes(pCat) || sel.includes(pCatName)) return true;

          if (sel.includes('facial') || sel.includes('cleanser')) {
            return pCat.includes('facial') || pCatName.includes('facial') || pCat.includes('cleanser') || pCatName.includes('cleanser');
          }
          if (sel.includes('hair') || sel.includes('shampoo')) {
            return pCat.includes('hair') || pCatName.includes('hair') || pCat.includes('shampoo') || pCatName.includes('shampoo');
          }
          if (sel.includes('bar') || sel.includes('soap') || sel.includes('cleansing')) {
            return pCat.includes('bar') || pCatName.includes('bar') || pCat.includes('soap') || pCatName.includes('soap') || pCat.includes('cleansing');
          }
          if (sel.includes('wellness') || sel.includes('drop') || sel.includes('immunity') || sel.includes('nabhi') || sel.includes('elixir')) {
            return pCat.includes('wellness') || pCatName.includes('wellness') || pCat.includes('drop') || pCatName.includes('drop') || pCat.includes('tailam') || pCat.includes('elixir');
          }
          return false;
        })();

        if (!matchCategory) return { product: p, match: false, searchScore: 0 };
        if (!qRaw) return { product: p, match: true, searchScore: 1 };

        const productCorpus = normalizeSearchText(
          [
            p.name,
            p.subtitle,
            p.slug,
            ...(p.legacySlugs || []),
            p.short_description,
            p.description,
            p.active_ingredients,
            p.primaryBotanicals,
            p.clinicalActives,
            p.search_keywords,
            p.tags,
            p.category,
            p.category_name,
          ].join(' ')
        );

        let score = 0;
        if (productCorpus.includes(normalizedQ)) score += 100;

        if (nonBrandTokens.length === 0) {
          // User searched "bhumivera" or "bhumivera organics" — all Bhumivera products match!
          score += 50;
        } else {
          let matchedTokens = 0;
          for (const token of nonBrandTokens) {
            if (normalizeSearchText(p.name).includes(token)) {
              score += 35;
              matchedTokens += 1;
            } else if (normalizeSearchText(`${p.subtitle || ''} ${p.active_ingredients || ''}`).includes(token)) {
              score += 25;
              matchedTokens += 1;
            } else if (productCorpus.includes(token)) {
              score += 12;
              matchedTokens += 1;
            }
          }
          // If user searched "bhumivera facewash", rank Face Washes #1 but still show other Bhumivera products if query includes "bhumivera"
          if (matchedTokens === 0 && queryTokens.includes('bhumivera')) {
            score = 5;
          } else if (matchedTokens === 0) {
            return { product: p, match: false, searchScore: 0 };
          }
        }

        return { product: p, match: score > 0, searchScore: score };
      })
      .filter((item) => item.match);

    const sorted = [...scoredList];
    if (qRaw) {
      sorted.sort((a, b) => b.searchScore - a.searchScore);
    } else if (sortBy === 'popular_today') {
      const ranking = new Map(popularToday.map((item, index) => [String(item.id), index]));
      sorted.sort((a, b) => {
        const rankA = ranking.get(String(a.product.id || a.product._id));
        const rankB = ranking.get(String(b.product.id || b.product._id));
        if (rankA === undefined && rankB === undefined) return 0;
        if (rankA === undefined) return 1;
        if (rankB === undefined) return -1;
        return rankA - rankB;
      });
    } else if (sortBy === 'price_asc') {
      sorted.sort((a, b) => Number(a.product.discount_price || a.product.price || 0) - Number(b.product.discount_price || b.product.price || 0));
    } else if (sortBy === 'price_desc') {
      sorted.sort((a, b) => Number(b.product.discount_price || b.product.price || 0) - Number(a.product.discount_price || a.product.price || 0));
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => Number(b.product.rating || 0) - Number(a.product.rating || 0));
    }
    return sorted.map((item) => item.product);
  }, [products, searchTerm, selectedCategory, sortBy, popularToday]);

  const categorySeo = categorySlug ? CATEGORY_SEO_MAP[categorySlug] : null;
  const pageTitle = categorySeo
    ? categorySeo.title
    : searchTerm
      ? `${searchTerm} — 100% Active Botanical Formulations | Bhumivera`
      : 'Shop All 6 Flagship Formulations & Regimen Combos | Bhumivera (bhumivera.com)';
  const pageDescription = categorySeo
    ? categorySeo.description
    : 'Shop Bhumivera’s 6 flagship cold-pressed (<28°C), pH 5.0–5.5 botanical formulations with 100% active percentages and milligram-level label disclosure: 4% Himalayan Sea Buckthorn Face Wash, 3% Activated Charcoal Face Wash with Niacinamide & Hyaluronic Acid, Royal 2-in-1 Botanical Shampoo, Handmade Ayurvedic Soaps, and 7-Tulsi Drops.';

  return (
    <div className="min-h-screen bg-[#14291F] text-[#FAF7F2] pt-20 sm:pt-28 pb-24 font-sans">
      <SEO
        title={pageTitle}
        description={pageDescription}
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
                placeholder="Search sea buckthorn, charcoal, niacinamide, reetha, tulsi..."
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
            {/* Quick Ingredient & Trending Search Chips */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
              <span className="text-[#9BB0A5] uppercase tracking-wider mr-1">Popular:</span>
              {[
                { label: 'Sea Buckthorn Face Wash', q: 'seabuckthorn face wash' },
                { label: 'Face Wash with Niacinamide', q: 'facewash with niacinamide' },
                { label: '3% Charcoal Cleanser', q: 'activated charcoal face wash' },
                { label: '2-in-1 Rosemary Shampoo', q: 'reetha amla rosemary shampoo' },
                { label: '7-Tulsi Drops', q: 'kalpvriksh 7 tulsi' },
              ].map((chip) => (
                <button
                  key={chip.q}
                  type="button"
                  onClick={() => setSearchTerm(chip.q)}
                  className="rounded-full border border-[#D4AF37]/30 bg-[#102219]/70 px-2.5 py-0.5 text-[#FCE096] hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 transition"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ActiveComboShowcase />

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

        {/* Comprehensive Catalog & Ingredient Cross-Reference Matrix for SEO & Buyers */}
        <section className="mt-16 rounded-3xl two-tone-card border border-[#D4AF37]/30 p-6 sm:p-10 space-y-8">
          <div className="border-b border-[#D4AF37]/20 pb-5">
            <span className="font-sub-gold text-[10px] uppercase tracking-[0.24em] block">
              The Bhumivera Transparency Standard · Complete Ingredient &amp; Product Index
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-bold text-white">
              Compare All 6 Flagship Formulations by Active Concentration &amp; Skin Goal
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#DFD7C4] leading-relaxed max-w-4xl">
              Every formulation at <a href="https://bhumivera.com" className="text-[#FCE096] underline">bhumivera.com</a> is cold-pressed below 28°C and calibrated to skin- and scalp-identical pH 5.0–5.5 with 100% active percentage and milligram-weight disclosure printed openly on the bottle. Click any product or ingredient below to inspect its complete 1,500+ word formulation monograph, 20x specifications, and laboratory COA.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#D4AF37]/25 bg-[#070a0e]/80">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#D4AF37]/30 bg-[#102219] text-[#FCE096] font-mono uppercase text-[11px]">
                  <th className="p-4">Flagship Product &amp; Canonical Link</th>
                  <th className="p-4">Volume &amp; Price</th>
                  <th className="p-4">pH / Calibration</th>
                  <th className="p-4">Disclosed Active Ingredients &amp; Milligram Potencies</th>
                  <th className="p-4">Primary Skin / Scalp / Wellness Goal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-[#DFD7C4]">
                <tr>
                  <td className="p-4 font-bold text-white">
                    <Link to="/product/himalayan-seabuckthorn-luxury-face-wash" className="text-[#FCE096] hover:underline">
                      Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash
                    </Link>
                  </td>
                  <td className="p-4 font-mono">100 ML · ₹799</td>
                  <td className="p-4 font-mono text-emerald-300">pH 5.3 – 5.5</td>
                  <td className="p-4">4% Sea Buckthorn (Omega-7), 5% Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber</td>
                  <td className="p-4">Cellular radiance, dullness brightening, Omega-7 barrier lipid replenishment &amp; glass-skin glow</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">
                    <Link to="/product/activated-charcoal-luxury-face-wash" className="text-[#FCE096] hover:underline">
                      Bhumivera Activated Charcoal Purifying Luxury Face Wash
                    </Link>
                  </td>
                  <td className="p-4 font-mono">100 ML · ₹699</td>
                  <td className="p-4 font-mono text-emerald-300">pH 5.4 – 5.5</td>
                  <td className="p-4">3% Activated Charcoal, 5% Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber</td>
                  <td className="p-4">Deep PM2.5 urban pore detoxification, excess sebum control &amp; non-drying barrier hydration</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">
                    <Link to="/product/luxury-2-in-1-botanical-shampoo-conditioner" className="text-[#FCE096] hover:underline">
                      Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner
                    </Link>
                  </td>
                  <td className="p-4 font-mono">200 ML · ₹899</td>
                  <td className="p-4 font-mono text-emerald-300">pH 5.0 – 5.24</td>
                  <td className="p-4">25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera, 5mg Shikakai</td>
                  <td className="p-4">Sulfate-free natural saponin scalp cleansing, root fortification &amp; silicone-free cuticle smoothing</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">
                    <Link to="/product/artisanal-charcoal-handmade-soap" className="text-[#FCE096] hover:underline">
                      Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Soap)
                    </Link>
                  </td>
                  <td className="p-4 font-mono">100 GM · ₹399</td>
                  <td className="p-4 font-mono text-emerald-300">Gentle Artisanal Bar</td>
                  <td className="p-4">Microporous Activated Charcoal, Pure Aloe Vera Inner Fillet &amp; Gentle Ayurvedic Soap Base</td>
                  <td className="p-4">Daily face &amp; body pore purification, sweat/grime removal &amp; soothing aloe moisture cushion</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">
                    <Link to="/product/artisanal-aloe-vera-handmade-soap" className="text-[#FCE096] hover:underline">
                      Bhumivera Soothing Bar (Aloe Vera, Neem &amp; Tulsi Handmade Soap)
                    </Link>
                  </td>
                  <td className="p-4 font-mono">100 GM · ₹349</td>
                  <td className="p-4 font-mono text-emerald-300">Gentle Soothing Bar</td>
                  <td className="p-4">Aloe Vera (Aloe barbadensis), Neem (Azadirachta indica), Sacred Tulsi (Ocimum tenuiflorum) &amp; Ayurvedic Base</td>
                  <td className="p-4">Calming blemish-prone &amp; sensitive skin, clarifying microbiome care &amp; luminous daily bathing</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">
                    <Link to="/product/kalpvriksh-satva-tulsi-7-tulsi-extract" className="text-[#FCE096] hover:underline">
                      Bhumivera Kalpvriksh Satva Tulsi (7-Tulsi Liquid Extract Drops)
                    </Link>
                  </td>
                  <td className="p-4 font-mono">30 ML · ₹499</td>
                  <td className="p-4 font-mono text-emerald-300">90% Distillate (9.0ml/10ml)</td>
                  <td className="p-4">9.0ml per 10ml Mix Blend of 7 Tulsi Varieties: Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi</td>
                  <td className="p-4">Inside-out gut-skin-cortisol adaptogen, seasonal respiratory wellness &amp; daily eugenol antioxidant vitality</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Link to="/science" className="rounded-2xl border border-[#D4AF37]/25 bg-[#070a0e]/70 p-4 hover:border-[#D4AF37] transition flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">Formulation Lab</p>
                <p className="font-serif text-base font-bold text-white mt-0.5">Sub-28°C Science &amp; pH 5.5 Monograph</p>
              </div>
              <ArrowRight size={16} className="text-[#FCE096]" />
            </Link>
            <Link to="/guides" className="rounded-2xl border border-[#D4AF37]/25 bg-[#070a0e]/70 p-4 hover:border-[#D4AF37] transition flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">Authority Buying Guides</p>
                <p className="font-serif text-base font-bold text-white mt-0.5">Face Wash, Niacinamide &amp; Shampoo Guides</p>
              </div>
              <BookOpen size={16} className="text-[#FCE096]" />
            </Link>
            <Link to="/impact" className="rounded-2xl border border-[#D4AF37]/25 bg-[#070a0e]/70 p-4 hover:border-[#D4AF37] transition flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">Public Stewardship</p>
                <p className="font-serif text-base font-bold text-white mt-0.5">Ceaser &amp; Smt. Shanti Memorials (/impact)</p>
              </div>
              <Leaf size={16} className="text-[#FCE096]" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
