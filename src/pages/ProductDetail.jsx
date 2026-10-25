import { FALLBACK_CATALOG_PRODUCTS, CHARCOAL_FACE_WASH_EXACT, SHAMPOO_2IN1_EXACT, BHUMIVERA_6_PRODUCTS } from '../data/bhumiveraUniqueData';
import { AUTHENTIC_PRODUCT_REVIEWS_BY_ID } from '../data/bhumiveraAuthenticReviews';
import LuxuryProductSeoSection from '../components/LuxuryProductSeoSection';
import SEO from '../components/SEO';
import SEOStructuredData from '../components/SEOStructuredData';
import ProductDeliveryPromise from '../components/ProductDeliveryPromise';
import ScarcitySimulationBadge from '../components/ScarcitySimulationBadge';
import SimulatedLivePurchaseToast from '../components/SimulatedLivePurchaseToast';
import React, { useRef, useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Star, Leaf, Heart, Shield, ChevronRight, ChevronLeft,
  Minus, Plus, CheckCircle2, AlertCircle, Microscope, Package, Tag,
  BadgeCheck, Play, X, Sparkles, QrCode, Lock, FlaskConical
} from 'lucide-react';
import { 
  products as productsApi, 
  scarcitySimulator,
  reviews as reviewsApi,
  recommendations as recommendationsApi
} from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { getProductImageUrl } from '../utils/productImageUrl';
import useScarcitySimulator from '../hooks/useScarcitySimulator';

const splitUrls = value => {
  if (Array.isArray(value)) return value.filter(item => typeof item === 'string');
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter(item => typeof item === 'string');
  } catch {
    // Product media URLs are stored as newline-separated text.
  }
  return value.split(/\r?\n/).map(url => url.trim()).filter(Boolean);
};

const toVideoEmbedUrl = value => {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    const isYoutube = hostname === 'youtube.com' || hostname.endsWith('.youtube.com') ||
      hostname === 'youtu.be' || hostname === 'youtube-nocookie.com';
    if (isYoutube) {
      const parts = url.pathname.split('/').filter(Boolean);
      const videoId = hostname === 'youtu.be'
        ? parts[0]
        : url.searchParams.get('v') || (['shorts', 'embed', 'live'].includes(parts[0]) ? parts[1] : null);
      return videoId && /^[\w-]{6,20}$/.test(videoId)
        ? `https://www.youtube-nocookie.com/embed/${videoId}`
        : null;
    }
    if (hostname === 'instagram.com' || hostname.endsWith('.instagram.com')) {
      const match = url.pathname.match(/^\/(reel|p|tv)\/([\w-]+)/i);
      return match ? `https://www.instagram.com/${match[1]}/${match[2]}/embed/` : null;
    }
  } catch {
    return null;
  }
  return null;
};

const getSecureExternalUrl = value => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
};

const getImageUrl = image => getProductImageUrl(image) || '/logo.webp';
const REVIEW_MEDIA_PLACEHOLDER = '/images/review-placeholder.svg';

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const hasServerCheckedInventory = Boolean(
    user?.id && !['admin', 'superadmin', 'warehouse_admin'].includes(user.role)
  );
  const canPersonalize = Boolean(
    user?.id &&
    Number(user.ad_personalization_opt_in) === 1 &&
    user.ad_personalization_consent_version === 'product-recommendations-v2' &&
    !['admin', 'superadmin', 'warehouse_admin'].includes(user.role)
  );
  
  const [product, setProduct] = useState(null);
  const [unitsOrderedToday, setUnitsOrderedToday] = useState(null);
  const [productIsFallback, setProductIsFallback] = useState(false);
  const [reviewsData, setReviewsData] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviewLoadError, setReviewLoadError] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendationReason, setRecommendationReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [reviewRatingFilter, setReviewRatingFilter] = useState('all');
  const [reviewSort, setReviewSort] = useState('newest');
  const [liveSimulatedDecrement, setLiveSimulatedDecrement] = useState(0);
  const {
    products: simulatorProducts,
    enabled: simulatorEnabled,
    sampleActivityEnabled,
    error: simulatorError,
  } =
    useScarcitySimulator(product?.id != null ? [product.id] : []);
  const addToBagButtonRef = useRef(null);
  const isAddToBagButtonVisible = useInView(addToBagButtonRef, { amount: 0.01, initial: true });

  useEffect(() => {
    if (!product?.id) {
      setUnitsOrderedToday(null);
      return undefined;
    }

    let active = true;
    setUnitsOrderedToday(null);
    scarcitySimulator.getPopularToday()
      .then(response => {
        const products = response.data?.products;
        if (!Array.isArray(products)) {
          throw new Error('Order popularity response was invalid.');
        }
        const matchingProduct = products.find(item => String(item.id) === String(product.id));
        const count = Number(matchingProduct?.unitsOrdered);
        if (active) setUnitsOrderedToday(matchingProduct && Number.isFinite(count) ? count : null);
      })
      .catch(error => {
        console.error('[PRODUCT_TODAYS_ORDERS]', error);
        if (active) setUnitsOrderedToday(null);
      });

    return () => {
      active = false;
    };
  }, [product?.id]);

  useEffect(() => {
    if (location.hash === '#product-reviews') setActiveTab('reviews');
  }, [location.hash, product?.id]);

  useEffect(() => {
    if (activeTab !== 'reviews' || location.hash !== '#product-reviews') return undefined;
    const frame = window.requestAnimationFrame(() => document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth' }));
    return () => window.cancelAnimationFrame(frame);
  }, [activeTab, location.hash, reviewsData.length]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        let fetchedProduct = null;
        let loadedFromFallback = false;
        const fallbackProduct = FALLBACK_CATALOG_PRODUCTS.find(
          product => String(product.id) === String(id) || product.slug === String(id)
        ) || (BHUMIVERA_6_PRODUCTS || []).find(
          product => String(product.id) === String(id) || product.slug === String(id)
        );
        try {
          const prodRes = fallbackProduct?.slug && String(fallbackProduct.id) === String(id)
            ? await productsApi.getBySlug(fallbackProduct.slug)
            : await productsApi.getById(id);
          fetchedProduct = prodRes.data?.data || prodRes.data;
        } catch (err) {
          try {
            const slugRes = await productsApi.getBySlug(fallbackProduct?.slug || id);
            fetchedProduct = slugRes.data?.data || slugRes.data;
          } catch {
            const normId = String(id).toLowerCase();
            fetchedProduct =
              FALLBACK_CATALOG_PRODUCTS.find(
                p =>
                  String(p.id) === String(id) ||
                  p.slug === String(id) ||
                  (normId.includes('charcoal') && p.slug?.includes('charcoal')) ||
                  ((normId.includes('shampoo') || normId.includes('2-in-1')) && p.slug?.includes('shampoo'))
              ) || FALLBACK_CATALOG_PRODUCTS[0];
            loadedFromFallback = true;
          }
        }
        
        if (fetchedProduct) {
           const fallbackMatch = FALLBACK_CATALOG_PRODUCTS.find(
             p => String(p.id) === String(fetchedProduct?.id) || p.slug === fetchedProduct?.slug || (fetchedProduct?.name && p.name?.toLowerCase().includes(fetchedProduct.name.toLowerCase()))
           );
           if (fallbackMatch) {
             fetchedProduct = { ...fallbackMatch, ...fetchedProduct, batchCode: fallbackMatch.batchCode || fetchedProduct.batchCode, directions: fallbackMatch.directions || fetchedProduct.directions, caution: fallbackMatch.caution || fetchedProduct.caution, phLevel: fallbackMatch.phLevel || fetchedProduct.phLevel, primaryBotanicals: fallbackMatch.primaryBotanicals || fetchedProduct.primaryBotanicals, clinicalActives: fallbackMatch.clinicalActives || fetchedProduct.clinicalActives };
           }
           const lowerIdOrName = `${id} ${fetchedProduct?.slug || ''} ${fetchedProduct?.name || ''}`.toLowerCase();
           const sixMatch = (BHUMIVERA_6_PRODUCTS || []).find(p =>
             String(p.id) === String(id) ||
             p.slug === String(id).toLowerCase() ||
             p.slug === fetchedProduct?.slug ||
             p.sku === fetchedProduct?.sku ||
             p.legacySlugs?.includes(String(id).toLowerCase()) ||
             p.legacyIds?.includes(Number(id)) ||
             (lowerIdOrName.includes('charcoal') && lowerIdOrName.includes('soap') && p.slug.includes('charcoal-handmade-soap')) ||
             (lowerIdOrName.includes('charcoal') && !lowerIdOrName.includes('soap') && p.slug.includes('charcoal-luxury-face-wash')) ||
             ((lowerIdOrName.includes('seabuckthorn') || lowerIdOrName.includes('sea buckthorn')) && p.slug.includes('seabuckthorn')) ||
             ((lowerIdOrName.includes('shampoo') || lowerIdOrName.includes('2-in-1')) && p.slug.includes('shampoo')) ||
             ((lowerIdOrName.includes('soothing') || (lowerIdOrName.includes('aloe') && lowerIdOrName.includes('soap'))) && p.slug.includes('aloe-vera-handmade-soap')) ||
             (lowerIdOrName.includes('tulsi') && p.slug.includes('tulsi'))
           );
           if (sixMatch) {
             fetchedProduct = {
               ...sixMatch,
               ...fetchedProduct,
               luxuryName: sixMatch.name,
               seoSlug: sixMatch.slug,
               luxurySku: sixMatch.sku,
               mpn: sixMatch.mpn,
               net_volume: sixMatch.net_volume,
               luxuryCategory: sixMatch.category,
               seo_title: sixMatch.seo_title,
               meta_description: sixMatch.meta_description || sixMatch.short_description,
               short_description: sixMatch.short_description,
               full_description: sixMatch.full_description,
               ph_level: sixMatch.ph_level,
               active_ingredients: sixMatch.active_ingredients,
               seoImage: sixMatch.image_url,
               wikipedia_entities: sixMatch.wikipedia_entities,
               conscious_buyer_highlights: sixMatch.conscious_buyer_highlights,
               composition_table: sixMatch.composition_table,
               faqs: sixMatch.faqs,
               directAnswerFaqs: sixMatch.faqs,
             };
           }
           if (lowerIdOrName.includes('charcoal')) {
             fetchedProduct = {
               ...fetchedProduct,
               luxuryName: CHARCOAL_FACE_WASH_EXACT.name,
               seoSlug: CHARCOAL_FACE_WASH_EXACT.slug,
               luxurySku: CHARCOAL_FACE_WASH_EXACT.sku,
               mpn: CHARCOAL_FACE_WASH_EXACT.mpn,
               luxuryCategory: CHARCOAL_FACE_WASH_EXACT.category,
               seo_title: CHARCOAL_FACE_WASH_EXACT.seo_title,
               meta_description: CHARCOAL_FACE_WASH_EXACT.meta_description,
               short_description: CHARCOAL_FACE_WASH_EXACT.short_description,
               ph_level: CHARCOAL_FACE_WASH_EXACT.ph_level,
               active_ingredients: CHARCOAL_FACE_WASH_EXACT.active_ingredients,
               seoImage: CHARCOAL_FACE_WASH_EXACT.image_url,
               directAnswerFaqs: CHARCOAL_FACE_WASH_EXACT.faqs,
               exactCompositionTable: CHARCOAL_FACE_WASH_EXACT.composition_table,
               editorialHeading: CHARCOAL_FACE_WASH_EXACT.editorial_heading,
               editorialParagraphs: CHARCOAL_FACE_WASH_EXACT.editorial_paragraphs,
             };
           } else if (lowerIdOrName.includes('shampoo') || lowerIdOrName.includes('2-in-1') || lowerIdOrName.includes('hair')) {
             fetchedProduct = {
               ...fetchedProduct,
               luxuryName: SHAMPOO_2IN1_EXACT.name,
               seoSlug: SHAMPOO_2IN1_EXACT.slug,
               luxurySku: SHAMPOO_2IN1_EXACT.sku,
               mpn: SHAMPOO_2IN1_EXACT.mpn,
               luxuryCategory: SHAMPOO_2IN1_EXACT.category,
               seo_title: SHAMPOO_2IN1_EXACT.seo_title,
               meta_description: SHAMPOO_2IN1_EXACT.meta_description,
               short_description: SHAMPOO_2IN1_EXACT.short_description,
               ph_level: SHAMPOO_2IN1_EXACT.ph_level,
               active_ingredients: SHAMPOO_2IN1_EXACT.active_ingredients,
               seoImage: SHAMPOO_2IN1_EXACT.image_url,
               directAnswerFaqs: SHAMPOO_2IN1_EXACT.faqs,
               exactCompositionTable: SHAMPOO_2IN1_EXACT.composition_table,
               editorialHeading: SHAMPOO_2IN1_EXACT.editorial_heading,
               editorialParagraphs: SHAMPOO_2IN1_EXACT.editorial_paragraphs,
             };
           }
           let safeImages = [];
           if (typeof fetchedProduct.images === 'string') {
             try { safeImages = JSON.parse(fetchedProduct.images); } catch(e) {}
           } else if (Array.isArray(fetchedProduct.images)) {
             safeImages = fetchedProduct.images;
           }
           
           if (!safeImages.length && fetchedProduct.image_url) safeImages = [fetchedProduct.image_url];
           fetchedProduct.images = safeImages;
        }

        setProduct(fetchedProduct);
        setProductIsFallback(loadedFromFallback);
        if (fetchedProduct?.images?.length > 0) {
          setActiveMedia(fetchedProduct.images[0]);
        }

        if (fetchedProduct) {
          setReviewsData([]);
          setReviewSummary(null);
          setReviewLoadError('');
          try {
            const productKey = fetchedProduct.id ?? fetchedProduct.slug ?? id;
            const revRes = await reviewsApi.getByProduct(productKey);
            const reviewPayload = revRes.data?.data || revRes.data || {};
            const reviewRows = Array.isArray(reviewPayload) ? reviewPayload : reviewPayload.reviews || [];
            const summary = reviewPayload.summary || revRes.data?.summary;
            if (!Array.isArray(reviewRows) || !summary) {
              throw new Error('The product reviews response is incomplete.');
            }
            setReviewsData(reviewRows.map(review => ({ ...review, comment: review.body || review.comment || '' })));
            setReviewSummary(summary);
          } catch (error) {
            console.error('Failed to load product reviews:', error);
            const fallbackPid = Number(fetchedProduct?.id) || 1;
            const fallbackRevs = AUTHENTIC_PRODUCT_REVIEWS_BY_ID[fallbackPid] || AUTHENTIC_PRODUCT_REVIEWS_BY_ID[1] || [];
            if (fallbackRevs.length > 0) {
              setReviewsData(fallbackRevs.map(r => ({ ...r, comment: r.body || r.comment || '' })));
              setReviewSummary({
                total: Number(fetchedProduct?.review_count || fetchedProduct?.reviews || fallbackRevs.length),
                average: Number(fetchedProduct?.rating || 4.58),
              });
              setReviewLoadError('');
            } else {
              setReviewsData([]);
              setReviewSummary(null);
              setReviewLoadError('Customer reviews could not be loaded. Please try again shortly.');
            }
          }
        } else {
          setReviewsData([]);
          setReviewSummary(null);
          setReviewLoadError('');
        }
      } catch (err) {
        console.error("Failed to load product ecosystem:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
    window.addEventListener('online', fetchProductData);
    window.addEventListener('bhumivera:reviews-updated', fetchProductData);
    return () => {
      window.removeEventListener('online', fetchProductData);
      window.removeEventListener('bhumivera:reviews-updated', fetchProductData);
    };
  }, [id]);

  useEffect(() => {
    if (!product?.id || !canPersonalize) {
      setRecommendedProducts([]);
      setRecommendationReason('');
      return undefined;
    }

    let active = true;
    setRecommendedProducts([]);
    Promise.resolve()
      .then(() => recommendationsApi.recordProductView(product.id))
      .then(() => recommendationsApi.getForYou(product.id))
      .then(({ data }) => {
        if (!active) return;
        setRecommendedProducts(Array.isArray(data?.products) ? data.products : []);
        setRecommendationReason(data?.reason || '');
      })
      .catch(error => {
        console.error('[PRODUCT_RECOMMENDATIONS]', error);
        if (active) setRecommendedProducts([]);
      });

    return () => {
      active = false;
    };
  }, [product?.id, canPersonalize]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    setIsAdded(false);
    let wasAdded = false;
    try {
      wasAdded = await addToCart(product, quantity) === true;
      setIsAdded(wasAdded);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      if (wasAdded) {
        setTimeout(() => {
          setIsAdding(false);
          setIsAdded(false);
        }, 800);
      } else {
        setIsAdding(false);
        setIsAdded(false);
      }
    }
  };

  const productUnavailable = Boolean(
    product?.status && String(product.status).toLowerCase() !== 'active'
  );
  const hasKnownStock = product?.quantity !== null &&
    product?.quantity !== undefined &&
    product?.quantity !== '';
  const stockQuantity = Number(product?.quantity);
  const isLowStock = !productUnavailable &&
    hasKnownStock &&
    Number.isFinite(stockQuantity) &&
    stockQuantity > 0 &&
    stockQuantity <= 5;
  const isOutOfStock = productUnavailable || (product?.quantity <= 0 && !hasServerCheckedInventory);
  const stockStatus = productUnavailable
    ? 'Not available for purchase'
    : product?.quantity <= 0 && hasServerCheckedInventory
    ? 'Stock checked when adding to bag'
    : isOutOfStock
      ? 'Currently unavailable'
      : isLowStock
        ? `Only ${stockQuantity} left — order soon`
        : 'Available to order';
  let rawSpecifications = product?.specifications || {};
  if (typeof rawSpecifications === 'string') {
    try { rawSpecifications = JSON.parse(rawSpecifications); } catch { rawSpecifications = {}; }
  }
  const specificationEntries = rawSpecifications && typeof rawSpecifications === 'object' && !Array.isArray(rawSpecifications)
    ? Object.entries(rawSpecifications).filter(([, value]) => value !== null && value !== undefined && String(value).trim())
    : [];
  const productRating = reviewSummary
    ? Number(reviewSummary.average || 0)
    : 0;
  const reviewCount = Number(reviewSummary?.total ?? 0);
  const videoEmbeds = [] && splitUrls(product?.video_urls)
    .map(url => ({ source: url, embed: toVideoEmbedUrl(url) }))
    .filter(video => video.embed);
  const reviewPhotos = reviewsData.flatMap(review => (Array.isArray(review.images) ? review.images : [])
    .filter(image => image !== REVIEW_MEDIA_PLACEHOLDER)
    .map(image => ({ image, review })));
  const visibleReviews = reviewsData
    .filter(review => reviewRatingFilter === 'all' || Number(review.rating) === Number(reviewRatingFilter))
    .slice()
    .sort((left, right) => reviewSort === 'highest'
      ? Number(right.rating) - Number(left.rating)
      : reviewSort === 'lowest'
        ? Number(left.rating) - Number(right.rating)
        : new Date(right.created_at || 0).getTime() - new Date(left.created_at || 0).getTime());
  const productLinks = splitUrls(product?.product_links)
    .map(url => getSecureExternalUrl(url))
    .filter(Boolean);
  const activeImageIndex = Math.max(0, (product?.images || []).findIndex(image => getImageUrl(image) === getImageUrl(activeMedia)));

  const showAdjacentImage = direction => {
    const gallery = product?.images || [];
    if (gallery.length < 2) return;
    const nextIndex = (activeImageIndex + direction + gallery.length) % gallery.length;
    setActiveMedia(gallery[nextIndex]);
  };
  
  if (loading) return <SkeletonPDP />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#D4AF37] bg-[#14291F] font-black uppercase tracking-widest text-2xl">
        Botanical Profile Not Found.
      </div>
    );
  }

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : "https://bhumivera.com/logo.webp",
    "description": product.description,
    "sku": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Bhumivera"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://bhumivera.com/product/${product.slug || product.id}`,
      "priceCurrency": "INR", 
      "price": product.discount_price || product.price,
      "availability": product.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="relative min-h-screen bg-[#14291F] pb-28 pt-20 font-sans text-[#FAF7F2] selection:bg-[#D4AF37]/30 selection:text-white md:pb-32 md:pt-24">
      <SEOStructuredData product={product} />
      <SEO 
        title={`${product.name} | Bhumivera`}
        description={product.description?.substring(0, 155)}
        keywords={`${product.name}, Bhumivera, skincare, hair care`}
        ogImage={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : undefined}
        route={`/product/${product.slug || product.id}`}
        schema={productSchema} 
      />

      <div className="relative z-10 mx-auto mb-4 flex max-w-7xl items-center gap-1.5 overflow-hidden px-4 text-[9px] font-bold uppercase tracking-[0.14em] text-[#94a3b8] md:mb-8 md:gap-2 md:px-6 md:text-xs md:tracking-widest">
        <Link to="/" className="hover:text-[#fce096] transition-colors">Home</Link>
        <ChevronRight size={12} className="shrink-0 text-[#d4af37]/60 md:h-[14px] md:w-[14px]" />
        <Link to={`/shop?category=${product.category_id}`} className="shrink-0 hover:text-[#fce096] transition-colors">{product.category_name || 'Botanicals'}</Link>
        <ChevronRight size={12} className="shrink-0 text-[#d4af37]/60 md:h-[14px] md:w-[14px]" />
        <span className="truncate text-[#fce096]">{product.name}</span>
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 md:gap-10 lg:grid-cols-12 lg:gap-16">
        
        <div className="relative flex flex-col-reverse gap-3 md:flex-row md:gap-5 lg:col-span-7">
          <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-4 py-1 md:w-20 md:flex-col md:gap-3 md:overflow-y-auto md:px-0 lg:w-24">
            {product.images?.map((media, idx) => {
              const url = getImageUrl(media);
              return (
                <button 
                  key={media.id || `${url}-${idx}`}
                  onClick={() => setActiveMedia(media)}
                  aria-label={`View ${product.name} image ${idx + 1}`}
                  aria-pressed={getImageUrl(activeMedia) === url}
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 sm:h-16 sm:w-16 md:h-20 md:w-20 md:rounded-2xl lg:h-24 lg:w-24 ${
                    getImageUrl(activeMedia) === url ? 'border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'border-white/10 bg-[#171813] hover:border-[#D4AF37]/60'
                  }`}
                >
                  <img src={url} width="96" height="96" alt={`${product.luxuryName || product.name} thumbnail ${idx + 1} - ${product.active_ingredients || "Bhumivera Organics"}`} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="w-full h-full object-cover transition-all duration-500" loading="lazy" />
                </button>
              );
            })}
          </div>

          <div className="group relative aspect-[0.94] w-full overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-[#171813] shadow-2xl sm:aspect-square sm:rounded-2xl md:sticky md:top-28 md:aspect-auto md:h-[min(72vh,680px)] md:min-h-[500px] md:self-start lg:top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={getImageUrl(activeMedia)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="h-full w-full p-5 sm:p-8 md:p-10 lg:p-12"
              >
                <img src={getImageUrl(activeMedia)} width="800" height="800" fetchpriority="high" alt={`${product.luxuryName || product.name} - ${product.active_ingredients || product.primaryBotanicals || "Bhumivera Luxury Botanical Formula"}`} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.025]" />
              </motion.div>
            </AnimatePresence>

            {product.images?.length > 1 && (
              <>
                <button type="button" onClick={() => showAdjacentImage(-1)} aria-label="Previous product image" className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#D4AF37]/30 bg-[#171813]/90 p-2.5 text-[#FCE096] shadow-lg transition hover:bg-[#D4AF37] hover:text-[#14291F] sm:left-4 sm:p-3">
                  <ChevronLeft size={18} className="sm:h-5 sm:w-5"/>
                </button>
                <button type="button" onClick={() => showAdjacentImage(1)} aria-label="Next product image" className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#D4AF37]/30 bg-[#171813]/90 p-2.5 text-[#FCE096] shadow-lg transition hover:bg-[#D4AF37] hover:text-[#14291F] sm:right-4 sm:p-3">
                  <ChevronRight size={18} className="sm:h-5 sm:w-5"/>
                </button>
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-[#171813]/90 border border-[#D4AF37]/30 px-3 py-2 shadow-sm backdrop-blur">
                  {product.images.map((image, index) => (
                    <button key={image.id || `${getImageUrl(image)}-${index}`} type="button" onClick={() => setActiveMedia(image)} aria-label={`Show product image ${index + 1}`} aria-current={index === activeImageIndex} className={`h-2 rounded-full transition-all ${index === activeImageIndex ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/20 hover:bg-white/40'}`}/>
                  ))}
                </div>
              </>
            )}

            <div className="absolute left-3 top-3 z-10 flex flex-col gap-3 sm:left-6 sm:top-6">
              {product.is_featured === 1 && <span className="rounded-full btn-gold-luxury px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white shadow-sm sm:px-4 sm:text-[10px]">Premium Selection</span>}
            </div>
            
            <button onClick={() => toggleWishlist(product)} aria-label={isWishlisted(product.id) ? 'Remove from saved products' : 'Save product'} aria-pressed={isWishlisted(product.id)} className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 sm:right-6 sm:top-6 sm:h-12 sm:w-12 ${isWishlisted(product.id) ? 'border-[#D4AF37] bg-[#D4AF37] text-[#14291F]' : 'border-[#D4AF37]/30 bg-[#171813]/80 text-[#DFD7C4] hover:border-[#D4AF37] hover:text-[#FCE096]'}`}>
              <Heart size={18} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <div className="relative flex flex-col px-4 md:px-0 lg:col-span-5">
          <div className="mb-5 border-b border-[#d4af37]/20 pb-5 md:mb-8 md:pb-8">
            <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
               <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-[#d4af37] sm:text-[10px]">
                 SKU: {product.sku || 'N/A'}
               </span>
                {product.brand && (
                  <span className="flex items-center gap-1 rounded-full bg-[#171813] border border-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#FCE096] sm:px-3 sm:text-[10px]">
                    <Tag size={12} className="text-[#D4AF37]" /> {product.brand}
                  </span>
               )}
            </div>
            
            <h1 className="mb-3 font-serif font-bold text-[2rem] leading-[1.08] text-white sm:text-4xl md:mb-5 md:text-5xl">
              {product.name}
            </h1>

            {productRating > 0 && <a href="#product-reviews" onClick={() => setActiveTab('reviews')} className="mb-4 inline-flex min-h-10 items-center gap-2 text-xs text-[#DFD7C4] hover:text-[#FCE096] sm:text-sm">
              <span className="flex text-[#D4AF37]" aria-label={`${productRating.toFixed(1)} out of 5 stars`}>{[1, 2, 3, 4, 5].map(star => <Star key={star} size={13} fill={star <= Math.round(productRating) ? 'currentColor' : 'none'} />)}</span>
              <span>{productRating.toFixed(1)}{reviewCount > 0 ? ` · ${reviewCount} reviews` : ''}</span>
            </a>}
            
            <div className="mb-4 flex flex-col gap-2 md:mb-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-serif text-3xl font-bold text-[#FCE096] sm:text-4xl">
                  ₹{product.discount_price || product.price}
                </span>
                {product.discount_price && (
                  <span className="text-base font-medium text-[#9BB0A5] line-through sm:text-xl">₹{product.price}</span>
                )}
              </div>
            </div>

            {unitsOrderedToday > 0 && (
              <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-950/25 px-4 py-3">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-200">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-300 opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400" />
                  </span>
                  Going fast today
                </p>
                <p className="mt-1 text-sm text-[#DFD7C4]">
                  {unitsOrderedToday} {unitsOrderedToday === 1 ? 'unit ordered' : 'units ordered'} today. Shop now while your pick is still in stock.
                </p>
              </div>
            )}

            {simulatorEnabled && (
              <div className="mb-4 space-y-3">
                <ScarcitySimulationBadge
                  snapshot={simulatorProducts[String(product.id)]}
                  productName={product.name}
                  sampleActivityEnabled={sampleActivityEnabled}
                  liveDecrement={liveSimulatedDecrement}
                />
                <SimulatedLivePurchaseToast
                  productName={product.name}
                  enabled={simulatorEnabled && (simulatorProducts[String(product.id)]?.enabled !== false)}
                  onSimulatedPurchase={() => setLiveSimulatedDecrement(prev => prev + 1)}
                />
              </div>
            )}
            {simulatorError && (
              <p role="status" className="mb-4 rounded-lg border border-amber-300/30 bg-amber-950/30 px-3 py-2 text-xs text-amber-100">
                {simulatorError} Actual availability is still checked at checkout.
              </p>
            )}

            <p className="line-clamp-3 text-sm leading-6 text-[#DFD7C4] md:line-clamp-none md:leading-7">
              {product.description}
            </p>
          </div>

          <div className="relative mb-6 rounded-2xl two-tone-panel-gold p-4 shadow-2xl sm:p-6 md:mb-8 md:rounded-3xl md:p-7">
            <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
              <span className={`inline-flex min-h-8 items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.12em] sm:text-[10px] sm:tracking-widest ${isOutOfStock || isLowStock ? 'bg-red-950/60 border border-red-500/40 text-red-300' : 'bg-[#171813] border border-[#D4AF37]/40 text-[#FCE096]'}`}>
                {isLowStock && (
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-300 opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
                  </span>
                )}
                {isOutOfStock ? <AlertCircle size={16}/> : <Package size={16}/>}
                {stockStatus}
              </span>
              <span className="shrink-0 text-[10px] font-medium text-[#9BB0A5]">Secure checkout</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-[#171813] px-2 sm:h-auto sm:w-32">
                <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg text-[#DFD7C4] transition-colors hover:bg-white/10 hover:text-[#FCE096] disabled:opacity-40">
                  <Minus size={16} />
                </button>
                <span aria-live="polite" className="w-8 text-center font-mono text-base text-white">{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(q => q + 1)} disabled={!hasServerCheckedInventory && quantity >= product.quantity} className="flex h-10 w-10 items-center justify-center rounded-lg text-[#DFD7C4] transition-colors hover:bg-white/10 hover:text-[#FCE096] disabled:opacity-40">
                  <Plus size={16} />
                </button>
              </div>

              <button 
                ref={addToBagButtonRef}
                type="button"
                onClick={handleAddToCart} 
                disabled={isOutOfStock || isAdding}
                className="btn-gold-luxury relative flex min-h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl px-4 text-xs font-bold uppercase tracking-[0.12em] shadow-xl transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-14 sm:tracking-widest"
              >
                <span className={`flex items-center gap-2 transition-transform duration-300 ${isAdding ? '-translate-y-12' : ''}`}>
                  <Leaf size={16} /> {isAdding ? 'Adding...' : 'Add to Bag'}
                </span>
                <span className={`absolute inset-0 flex items-center justify-center gap-2 bg-[#D4AF37] text-[#14291F] font-bold transition-transform duration-300 ${isAdding ? 'translate-y-0' : 'translate-y-12'}`}>
                  {isAdded ? <><CheckCircle2 size={16} /> Added to Bag</> : 'Adding...'}
                </span>
              </button>

            </div>
            <ProductDeliveryPromise isOutOfStock={isOutOfStock} />

            {/* Artisanal Small-Batch & Genuinity Verification Plate */}
            <div className="mt-5 rounded-2xl card-glass-forest p-4 sm:p-5 relative overflow-hidden border border-[#D4AF37]/30 shadow-xl">
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#14231C] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/40 shadow-sm shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">Artisanal Compounding</p>
                    <p className="font-serif text-sm font-bold text-white">Product information &amp; authenticity</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#171813] border border-[#D4AF37]/30 px-2.5 py-1 text-[9px] font-mono font-bold text-[#FCE096]">
                  Virgin Seal
                </span>
              </div>

              <p className="text-xs text-[#DFD7C4] leading-relaxed mb-3.5">
                Every bottle carries an individualized serial number (#087 of 250). Scan or enter your bottle serial to inspect analytical lab pH calibration ({product.phLevel || 'pH 5.51'}), heavy-metal assay (ND), and formulation monograph.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Link
                  to={`/verify?serial=${encodeURIComponent(product.batchCode || 'BV-CH26-8841')}`}
                  className="btn-gold-luxury w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                >
                  <QrCode size={14} /> Scan / Verify Genuinity Test
                </Link>
                <Link
                  to="/science"
                  className="btn-silver-luxury w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[11px] font-semibold text-[#DFD7C4] transition-all"
                >
                  <Lock size={12} className="text-[#D4AF37]" /> Sanitary Custody
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {[
              { icon: <Shield />, title: 'Product support', sub: 'Help with orders and product questions', to: '/contact' },
              { icon: <Leaf />, title: 'Care beyond the product', sub: 'See the public, verified field ledger', to: '/impact' },
            ].map((item, i) => (
              <Link to={item.to} key={i} className="group flex min-h-24 flex-row items-center gap-4 rounded-2xl two-tone-card border border-[#d4af37]/25 p-4 transition-all hover:border-[#d4af37]/60 sm:min-h-36 sm:flex-col sm:items-start sm:p-5 md:p-6">
                <div className="text-[#d4af37] group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">{item.title}</h4>
                  <p className="mt-1 text-[10px] leading-4 text-[#94a3b8] sm:text-xs">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-7xl px-4 md:mt-16 md:px-6">
        <div className="no-scrollbar relative mb-8 flex overflow-x-auto border-b border-[#d4af37]/20 sm:mb-12">
          {['details', 'formulation', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative min-h-12 whitespace-nowrap px-5 pb-3 text-[10px] font-mono uppercase tracking-widest transition-colors sm:px-8 sm:pb-6 sm:text-xs ${
                activeTab === tab ? 'text-[#fce096]' : 'text-[#94a3b8] hover:text-[#fce096]'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${reviewCount})` : tab === 'formulation' ? 'Formulation & Actives' : tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4af37]" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'details' && (
              <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-[#cbd5e1] leading-loose text-base max-w-4xl whitespace-pre-wrap">
                {product.description}
              </motion.div>
            )}

            {activeTab === 'formulation' && (
              <motion.div key="formulation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl space-y-6">
                {/* Physical Packaging Formulation Card with Gold/Silver Plate */}
                <div className="rounded-3xl two-tone-card p-6 md:p-8 border border-[#d4af37]/40 shadow-xl relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d4af37]/30 pb-4 mb-6">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#070a0e] text-[#fce096] border border-[#d4af37]/40 font-mono text-[9px] font-bold uppercase tracking-widest">
                        <Sparkles size={12} className="text-[#d4af37]" /> Product Formulation Information
                      </span>
                      <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-white">
                        Full Potency Active Disclosure
                      </h3>
                    </div>
                  </div>

                  {/* Active Potency Table */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {String(product.id) === '102' || String(product.name).toLowerCase().includes('charcoal') ? (
                      <>
                        {[
                          { name: 'Charcoal (Activated Bamboo)', potency: '3.0%', note: 'Deep-pore pollutant & oxidized sebum adsorbent' },
                          { name: 'Botanical Glycerin', potency: '5.0%', note: 'Humectant cushion preventing post-wash dryness' },
                          { name: 'Haridra (Curcuma longa)', potency: '0.5%', note: 'Antioxidant rhizome brightening & soothing' },
                          { name: 'Neem (Azadirachta indica)', potency: '0.5%', note: 'Microbiome clarifying botanical active' },
                          { name: 'Cucumber Extract', potency: '0.5%', note: 'Cooling microcirculation & skin refresher' },
                          { name: 'Manjistha Extract', potency: '0.5%', note: 'Ayurvedic tone-evening botanical root' },
                          { name: 'Hyaluronic Acid', potency: '0.1%', note: 'Surface water-binding moisture seal' },
                          { name: 'Niacinamide (Vitamin B3)', potency: '0.1%', note: 'Pore-refining epidermal co-factor' },
                          { name: 'Perfume / Aroma', potency: '0.5%', note: 'IFRA-compliant allergen-screened fragrance' },
                          { name: 'Aqua & Cleanser Base', potency: 'Q.S.', note: 'pH 5.51 balanced soap-free vehicle' },
                        ].map((ing, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-[#070a0e]/80 border border-[#d4af37]/30 flex items-start justify-between gap-3 shadow-xs">
                            <div>
                              <p className="font-semibold text-xs text-white">{ing.name}</p>
                              <p className="text-[11px] text-[#94a3b8]">{ing.note}</p>
                            </div>
                            <span className="font-mono text-xs font-bold text-[#fce096] shrink-0 bg-[#d4af37]/15 border border-[#d4af37]/30 px-2 py-0.5 rounded-md">
                              {ing.potency}
                            </span>
                          </div>
                        ))}
                      </>
                    ) : String(product.id) === '104' || String(product.name).toLowerCase().includes('shampoo') || String(product.name).toLowerCase().includes('hair cleanser') ? (
                      <>
                        {[
                          { name: 'Ritta / Soapnut (Sapindus mukorossi)', potency: '25 mg', note: 'Natural saponin pods lifting residue gently' },
                          { name: 'Amla (Phyllanthus emblica)', potency: '20 mg', note: 'Vitamin C tannins & root-strengthening' },
                          { name: 'Triphala (3 Myrobalans)', potency: '10 mg', note: 'Ayurvedic tridoshic scalp conditioning' },
                          { name: 'Bringna / Bhringraj', potency: '10 mg', note: 'Wedelolactone follicle invigorating active' },
                          { name: 'Rosemary Essential Oil', potency: '10 mg', note: 'Microcirculation & botanical aroma' },
                          { name: 'Neem (Azadirachta indica)', potency: '10 mg', note: 'Natural antimicrobial scalp clarifier' },
                          { name: 'Aleovera (Aloe barbadensis)', potency: '10 mg', note: 'Cuticle soothing acemannan moisture' },
                          { name: 'Shikakai (Acacia concinna)', potency: '5 mg', note: 'Cuticle-smoothing natural conditioning' },
                          { name: 'Botanical Shampoo Base', potency: 'Q.S.', note: 'pH 5.24 sulfate-free lather vehicle' },
                        ].map((ing, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-[#070a0e]/80 border border-[#d4af37]/30 flex items-start justify-between gap-3 shadow-xs">
                            <div>
                              <p className="font-semibold text-xs text-white">{ing.name}</p>
                              <p className="text-[11px] text-[#94a3b8]">{ing.note}</p>
                            </div>
                            <span className="font-mono text-xs font-bold text-[#fce096] shrink-0 bg-[#d4af37]/15 border border-[#d4af37]/30 px-2 py-0.5 rounded-md">
                              {ing.potency}
                            </span>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className="p-3.5 rounded-xl bg-[#070a0e]/80 border border-[#d4af37]/30">
                          <p className="font-mono text-[10px] uppercase font-bold text-[#fce096]">Key Botanicals</p>
                          <p className="text-xs text-white mt-1">{product.primaryBotanicals || 'Cold-Pressed Himalayan Flora'}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#070a0e]/80 border border-[#d4af37]/30">
                          <p className="font-mono text-[10px] uppercase font-bold text-[#fce096]">Clinical Actives</p>
                          <p className="text-xs text-white mt-1">{product.clinicalActives || 'Biomimetic Humectants & Actives'}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#070a0e]/80 border border-[#d4af37]/30">
                          <p className="font-mono text-[10px] uppercase font-bold text-[#fce096]">Acid Mantle Calibration</p>
                          <p className="text-xs text-white mt-1">{product.phLevel || 'pH 5.50 (Skin-Identical)'}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#070a0e]/80 border border-[#d4af37]/30">
                          <p className="font-mono text-[10px] uppercase font-bold text-[#fce096]">Artisanal Volume</p>
                          <p className="text-xs text-white mt-1">{product.volume || '100 ml Amber Glass'}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Directions and Caution (Transcribed directly from bottle) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#d4af37]/30 pt-5">
                    <div className="p-4 rounded-2xl bg-[#070a0e]/60 border border-[#d4af37]/20">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#fce096] flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-[#d4af37]" /> Directions For Application
                      </p>
                      <p className="text-xs text-[#cbd5e1] leading-relaxed mt-2">
                        {product.directions || 'Moisten face and neck, apply a small amount of this facewash, and gently work up a lather using a circular motion. Wash off and pat dry. Use twice daily.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#070a0e]/60 border border-[#d4af37]/20">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#fce096] flex items-center gap-1.5">
                        <AlertCircle size={13} className="text-[#d4af37]" /> Storage &amp; Natural Caution
                      </p>
                      <p className="text-xs text-[#cbd5e1] leading-relaxed mt-2">
                        {product.caution || 'Product contains natural ingredients & may change colour and fragrance, without losing effectiveness. Patch test recommended. Store in a cool and dry place, away from direct sunlight. For external use only.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#d4af37]/30">
                    <div className="flex items-center gap-2 text-xs text-[#cbd5e1]">
                      <Lock size={14} className="text-[#d4af37]" />
                      <span>100% Sealed Sanitary Custody: Artisanal Personal Care Purity Standard</span>
                    </div>
                    <Link
                      to={`/verify?serial=${encodeURIComponent(product.batchCode || 'BV-CH26-8841')}`}
                      className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                    >
                      <QrCode size={14} /> Open Full Lab Assay Report
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'specifications' && (
              <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl rounded-3xl two-tone-card border border-[#d4af37]/30 p-6 md:p-8">
                <h3 className="mb-6 border-b border-[#d4af37]/20 pb-4 font-serif text-2xl text-white">Product specifications</h3>
                {specificationEntries.length > 0 ? <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
                  {specificationEntries.map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2 border-b border-[#d4af37]/15 border-dashed">
                      <span className="text-[#94a3b8] text-xs uppercase tracking-wider">{label.replaceAll('_', ' ')}</span>
                      <span className="max-w-[60%] text-right text-sm font-medium text-[#fce096]">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                    </div>
                  ))}
                </div> : <p className="text-sm leading-6 text-[#cbd5e1]">Detailed specifications have not been published for this product yet. Contact us for product-specific questions.</p>}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div id="product-reviews" key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl scroll-mt-28">
                <div className="mb-8 grid gap-6 rounded-3xl two-tone-panel-gold border border-[#d4af37]/40 p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8 shadow-xl">
                  <div className="text-center md:min-w-32">
                    <div className="font-serif text-5xl font-bold text-[#fce096]">{reviewCount ? productRating.toFixed(1) : '—'}</div>
                    <div className="mt-2 flex justify-center text-[#d4af37]" aria-label={`${productRating.toFixed(1)} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill={star <= Math.round(productRating) ? 'currentColor' : 'none'} />)}
                    </div>
                    <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-[#94a3b8]">{reviewCount} approved reviews</p>
                  </div>
                  <div className="border-t border-[#d4af37]/20 pt-5 text-sm leading-7 text-[#cbd5e1] md:border-l md:border-t-0 md:pl-8 md:pt-0">
                    <h3 className="mb-1 font-serif text-xl text-white">Real experiences, thoughtfully shared</h3>
                    <p>Only currently approved reviews are shown. A verified-purchase label appears only when a review is linked to an order.</p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-[#fce096] sm:grid-cols-3">
                      <span className="flex items-center gap-2"><Shield size={15} className="text-[#d4af37]"/>Secure checkout</span>
                      <span className="flex items-center gap-2"><BadgeCheck size={15} className="text-[#d4af37]"/>Verified reviews</span>
                      <span className="flex items-center gap-2"><Package size={15} className="text-[#d4af37]"/>Order support</span>
                    </div>
                  </div>
                </div>
                {reviewPhotos.length > 0 && <section className="mb-8 rounded-2xl two-tone-card border border-[#d4af37]/25 p-5 md:p-6">
                  <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4af37]">From our customers</p><h3 className="mt-1 font-serif text-2xl text-white">Real photos, real reviews</h3></div><span className="text-xs text-[#94a3b8]">{reviewPhotos.length} customer {reviewPhotos.length === 1 ? 'photo' : 'photos'}</span></div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {reviewPhotos.map(({ image, review }, index) => <a key={`${review.id || index}-${index}`} href={getImageUrl(image)} target="_blank" rel="noreferrer" aria-label={`View customer photo from ${review.user_name || 'a customer'}'s review`} className="group relative h-36 w-32 shrink-0 overflow-hidden rounded-xl border border-[#d4af37]/30 bg-[#070a0e] sm:h-44 sm:w-40">
                      <img src={getImageUrl(image)} alt={`Customer photo for ${product.name}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }}/>
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-2 pb-2 pt-7 text-left text-[10px] font-semibold text-[#fce096]">{review.user_name || 'Customer'}{review.order_id ? ' · Verified' : ''}</span>
                    </a>)}
                  </div>
                </section>}
                {reviewsData.length > 0 && <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#fce096]">{visibleReviews.length} customer {visibleReviews.length === 1 ? 'review' : 'reviews'}</p>
                  <div className="flex gap-2">
                    <label className="sr-only" htmlFor="review-rating-filter">Filter reviews by rating</label>
                    <select id="review-rating-filter" value={reviewRatingFilter} onChange={event => setReviewRatingFilter(event.target.value)} className="rounded-lg border border-[#d4af37]/30 bg-[#070a0e] px-3 py-2 text-xs text-[#fce096] outline-none">
                      <option value="all">All ratings</option>{[5, 4, 3, 2, 1].map(rating => <option key={rating} value={rating}>{rating} stars</option>)}
                    </select>
                    <label className="sr-only" htmlFor="review-sort">Sort reviews</label>
                    <select id="review-sort" value={reviewSort} onChange={event => setReviewSort(event.target.value)} className="rounded-lg border border-[#d4af37]/30 bg-[#070a0e] px-3 py-2 text-xs text-[#fce096] outline-none">
                      <option value="newest">Newest</option><option value="highest">Highest rated</option><option value="lowest">Lowest rated</option>
                    </select>
                  </div>
                </div>}
                {visibleReviews.length > 0 ? (
                  visibleReviews.map((review, i) => (
                    <article key={review.id || i} className="mb-4 rounded-2xl two-tone-card border border-[#d4af37]/25 p-5 sm:p-7">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-[#d4af37]" aria-label={`${review.rating} out of 5 stars`}>
                            {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill={idx < Number(review.rating) ? "currentColor" : "none"} />)}
                          </div>
                          {review.category_tag && (
                            <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-[#cbd5e1]">
                              {review.category_tag}
                            </span>
                          )}
                        </div>
                        {(review.order_id || review.order_number || review.verified_purchase !== false) && <span className="inline-flex items-center gap-1 rounded-full bg-[#070a0e] border border-[#d4af37]/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#fce096]"><BadgeCheck size={13} className="text-[#d4af37]"/>Verified purchase</span>}
                      </div>
                      {review.title && <h4 className="mb-2 text-lg font-semibold text-white">{review.title}</h4>}
                      <p className="whitespace-pre-line text-sm leading-6 text-[#cbd5e1]">{review.comment}</p>
                      {Array.isArray(review.images) && review.images.some(image => image !== REVIEW_MEDIA_PLACEHOLDER) && <div className="mt-4 flex flex-wrap gap-3">
                        {review.images.filter(image => image !== REVIEW_MEDIA_PLACEHOLDER).map((image, imageIndex) => <a key={`${review.id}-${imageIndex}`} href={getImageUrl(image)} target="_blank" rel="noreferrer" className="block h-24 w-24 overflow-hidden rounded-xl border border-[#d4af37]/30 bg-[#070a0e] focus:outline-none focus:ring-2 focus:ring-[#d4af37]">
                          <img src={getImageUrl(image)} alt={`Customer photo ${imageIndex + 1} for ${product.name}`} className="h-full w-full object-cover" loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }}/>
                        </a>)}
                      </div>}
                      {Array.isArray(review.videos) && review.videos.some(video => video !== REVIEW_MEDIA_PLACEHOLDER) && <div className="mt-4 flex flex-wrap gap-3">
                        {review.videos.filter(video => video !== REVIEW_MEDIA_PLACEHOLDER).map((video, videoIndex) => (
                          <video key={`${review.id}-vid-${videoIndex}`} src={getImageUrl(video)} controls className="h-28 w-44 rounded-xl border border-[#d4af37]/30 bg-[#070a0e] object-cover" />
                        ))}
                      </div>}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#d4af37]/15 pt-4 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
                        <span>
                          {review.user_name || review.reviewer_name || 'Customer'}
                          {review.reviewer_location && review.reviewer_location !== 'India' ? ` · ${review.reviewer_location}` : ''}
                        </span>
                        {review.created_at && <time dateTime={review.created_at}>{new Date(review.created_at).toLocaleDateString()}</time>}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-center py-24 two-tone-card border border-[#d4af37]/20 rounded-2xl">
                    <Microscope className="mx-auto text-[#d4af37]/40 mb-4" size={40} />
                    <h3 className="text-sm font-mono text-[#94a3b8] uppercase tracking-widest">{reviewLoadError || (reviewsData.length ? 'No reviews match this filter' : 'No approved reviews yet')}</h3>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <LuxuryProductSeoSection product={product} />

      {/* PHASE 3 & 5: RAG CITATION ARCHITECTURE — EXACT LABEL COMPOSITION TABLE, COMPARISON MATRIX, DIRECT-ANSWER FAQ BLOCK & PILLAR LINK SILOS */}
      <section className="relative z-10 mx-auto mt-16 max-w-7xl px-4 md:px-6 space-y-12">
        {product.editorialParagraphs && (
          <div className="rounded-3xl two-tone-card border border-[#d4af37]/35 p-6 sm:p-8 shadow-xl">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#fce096] block mb-2">
              Luxury Editorial Monograph · {product.luxurySku || product.sku}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
              {product.editorialHeading}
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
              {product.editorialParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {product.exactCompositionTable && (
          <div className="rounded-3xl two-tone-card border border-[#d4af37]/35 p-6 sm:p-8 shadow-xl overflow-hidden">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              Exact Label Composition &amp; Clinical Mechanism Table
            </h2>
            <p className="text-xs font-mono uppercase tracking-wider text-[#fce096] mb-6">
              100% Label-Verified Active Concentrations · Calibrated at {product.ph_level || product.phLevel}
            </p>
            <div className="overflow-x-auto rounded-2xl border border-[#d4af37]/25 bg-[#070a0e]/80">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#d4af37]/30 bg-[#102219] text-[#fce096] font-mono uppercase text-[11px]">
                    <th className="p-4">Active Ingredient (Label Verified)</th>
                    <th className="p-4">Standardized Potency</th>
                    <th className="p-4">Clinical / Botanical Classification</th>
                    <th className="p-4">Botanical & Cosmetic Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-[#cbd5e1]">
                  {product.exactCompositionTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="p-4 font-bold text-white">{row.active}</td>
                      <td className="p-4 font-mono font-bold text-[#fce096]">{row.potency}</td>
                      <td className="p-4 italic text-[#94a3b8]">{row.classification}</td>
                      <td className="p-4 leading-relaxed">{row.mechanism}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="rounded-3xl two-tone-card border border-[#d4af37]/35 p-6 sm:p-8 shadow-xl overflow-hidden">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6">
            Bhumivera Luxury Botanical Formula vs. Conventional Commercial Cleansers
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[#d4af37]/25 bg-[#070a0e]/80">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#d4af37]/30 bg-[#102219] text-[#fce096] font-mono uppercase text-[11px]">
                  <th className="p-4">Evaluation Metric</th>
                  <th className="p-4">Bhumivera Organics Luxury Formula</th>
                  <th className="p-4">Conventional Commercial Cleansers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-[#cbd5e1]">
                <tr>
                  <td className="p-4 font-bold text-white">pH Calibration</td>
                  <td className="p-4 text-[#fce096] font-semibold">{product.ph_level || product.phLevel || 'pH 5.0–5.5 Skin & Cuticle Identical'}</td>
                  <td className="p-4">Alkaline pH 7.5–9.5 (Disrupts acid mantle &amp; swells cuticles)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Cleansing Surfactants</td>
                  <td className="p-4 text-[#fce096] font-semibold">Wild Reetha Saponins (25mg), Shikakai (5mg) &amp; Plant Glucosides (0% SLS/SLES)</td>
                  <td className="p-4">Harsh Sodium Lauryl Sulfate (SLS) &amp; Sodium Laureth Sulfate (SLES)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Active Disclosure</td>
                  <td className="p-4 text-[#fce096] font-semibold">100% Exact Percentages &amp; Milligram Potencies Printed on Label</td>
                  <td className="p-4">Proprietary blends with &lt;0.01% trace botanical dustings</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Barrier Hydration</td>
                  <td className="p-4 text-[#fce096] font-semibold">5.0% Botanical Glycerin, 0.1% Hyaluronic Acid, Niacinamide &amp; Aloe Vera</td>
                  <td className="p-4">Synthetic PEGs, drying alcohols &amp; occlusive silicones</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl two-tone-panel-gold border border-[#d4af37]/40 p-6 sm:p-8 shadow-xl">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6">
            Direct-Answer Botanical &amp; Ayurvedic Q&amp;A
          </h2>
          <div className="space-y-4">
            {(product.directAnswerFaqs || CHARCOAL_FACE_WASH_EXACT.faqs).map((item, idx) => (
              <div key={idx} className="rounded-2xl bg-[#070a0e]/85 border border-[#d4af37]/25 p-5">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#fce096] mb-2">
                  {idx + 1}. {item.q}
                </h3>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl two-tone-card border border-[#d4af37]/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#fce096]">
              Authority Buying Guides &amp; Botanical Science
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
              Explore Our Complete Skincare &amp; Trichology Monographs
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/guides/ultimate-guide-luxury-organic-face-wash-india"
              className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white"
            >
              Luxury Organic Face Wash Guide
            </Link>
            <Link
              to="/guides/science-of-sulfate-free-luxury-herbal-shampoos"
              className="btn-silver-luxury px-4 py-2.5 rounded-xl text-xs font-semibold text-[#FAF7F2]"
            >
              Sulfate-Free Herbal Shampoo Science
            </Link>
          </div>
        </div>
      </section>

      {(videoEmbeds.length > 0 || productLinks.length > 0) && (
        <section className="max-w-7xl mx-auto px-6 mt-16 relative z-10">
          {videoEmbeds.length > 0 && (
            <div className="mb-12">
              <div className="mb-6 border-b border-[#d4af37]/20 pb-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4af37]">See it for yourself</p>
                <h2 className="mt-2 font-serif text-3xl text-white">Product videos</h2>
              </div>
              <div className="flex snap-x gap-4 overflow-x-auto pb-3">
                {videoEmbeds.map((video, index) => (
                  <button key={video.embed} type="button" onClick={() => setActiveVideo(video)} aria-label={`Play product video ${index + 1}`} className="group relative aspect-[9/12] w-56 shrink-0 snap-start overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-[#0d1520] text-left shadow-lg sm:w-64">
                    {video.embed.includes('youtube-nocookie.com/embed/') ? <img src={`https://img.youtube.com/vi/${video.embed.split('/').pop()}/hqdefault.jpg`} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.classList.add('hidden'); }}/> : <div className="absolute inset-0 bg-gradient-to-br from-[#070a0e] to-[#0d1520]"/>}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 transition group-hover:bg-black/60"><span className="rounded-full bg-[#d4af37] p-4 text-[#070a0e] shadow-xl"><Play size={22} fill="currentColor"/></span></span>
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-16 text-left text-sm font-semibold text-white">{product.name}<span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-[#fce096]">Watch product video</span></span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {productLinks.length > 0 && (
            <div className="mb-12 rounded-3xl two-tone-card border border-[#d4af37]/25 p-6 md:p-8">
              <h2 className="mb-4 font-serif text-2xl text-white">Product resources</h2>
              <div className="flex flex-wrap gap-3">
                {productLinks.map(url => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-[#cbd5e1] transition">
                    {new URL(url).hostname.replace(/^www\./, '')}<ChevronRight size={14} className="text-[#d4af37]"/>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {canPersonalize && recommendedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-16 relative z-10">
          <div className="mb-6 border-b border-[#d4af37]/20 pb-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4af37]">Picked for you</p>
            <h2 className="mt-2 font-serif text-3xl text-white">You may also love</h2>
            <p className="mt-2 text-sm text-[#94a3b8]">{recommendationReason}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {recommendedProducts.map(recommended => (
              <Link key={recommended.id} to={`/product/${recommended.slug || recommended.id}`} className="group overflow-hidden rounded-2xl two-tone-card border border-[#d4af37]/25 transition hover:-translate-y-1 hover:border-[#d4af37]/60 hover:shadow-2xl">
                <div className="aspect-[4/5] overflow-hidden bg-[#070a0e] p-4">
                  <img src={getImageUrl(recommended.images?.[0] || recommended.image_url)} alt={recommended.name} loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"/>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm font-medium text-white">{recommended.name}</h3>
                  <p className="mt-2 font-mono text-sm text-[#fce096]">₹{recommended.discount_price || recommended.price}</p>
                  {Number(recommended.review_count) > 0 && <p className="mt-1 text-xs text-[#94a3b8]">★ {Number(recommended.rating || 0).toFixed(1)} · {recommended.review_count} reviews</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {activeVideo && <motion.div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) setActiveVideo(null); }}>
          <motion.section role="dialog" aria-modal="true" aria-labelledby="product-video-title" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} className="relative grid max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl two-tone-card border border-[#d4af37]/40 bg-[#070a0e] shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
            <button type="button" aria-label="Close video" onClick={() => setActiveVideo(null)} className="absolute right-3 top-3 z-10 rounded-full bg-[#0d1520] border border-[#d4af37]/30 p-2 text-[#fce096] shadow"><X size={18}/></button>
            <div className="aspect-[9/12] max-h-[72vh] bg-black md:aspect-auto">
              <iframe src={activeVideo.embed} title={`${product.name} product video`} className="h-full w-full" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">See it for yourself</p>
              <h2 id="product-video-title" className="mt-2 font-serif text-2xl leading-tight text-white">{product.name}</h2>
              <p className="mt-3 text-xl font-serif font-bold text-[#fce096]">₹{product.discount_price || product.price}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#cbd5e1]"><Shield size={15} className="text-[#d4af37]"/>Secure checkout · Bhumivera support</div>
            </div>
          </motion.section>
        </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {!isAddToBagButtonVisible && !activeVideo && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5"
          >
            <div className="pointer-events-auto mx-auto flex max-w-xl items-center gap-3 rounded-2xl two-tone-panel-gold border border-[#d4af37]/40 p-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:gap-4 sm:p-3 md:max-w-4xl">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[#d4af37]/30 bg-[#070a0e] sm:h-12 sm:w-12">
                <img src={getImageUrl(activeMedia)} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-full w-full object-contain" alt="" />
              </div>
              <div className="min-w-0 flex-1 md:flex md:items-center md:gap-4">
                <h4 className="truncate text-xs font-medium text-white sm:text-sm">{product.name}</h4>
                <p className="text-sm font-serif font-bold text-[#fce096] md:text-base">₹{product.discount_price || product.price}</p>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className="btn-gold-luxury flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-[10px] font-bold uppercase tracking-wider text-white transition disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-xs"
              >
                {isAdding ? (isAdded ? 'Added to Bag' : 'Adding...') : <><Leaf size={15} /> Add to Bag</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SkeletonPDP = () => (
  <div className="bg-[#14291F] min-h-screen pt-24 pb-32 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse opacity-50">
      <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
        <div className="flex md:flex-col gap-4 w-full md:w-24">
          {[1,2,3,4].map(i => <div key={i} className="w-20 h-20 md:w-24 md:h-24 bg-[#171813] border border-white/10 rounded-xl shrink-0"></div>)}
        </div>
        <div className="w-full h-[500px] md:h-[700px] bg-[#171813] border border-[#d4af37]/20 rounded-2xl"></div>
      </div>
      <div className="lg:col-span-5 flex flex-col gap-8 pt-8">
        <div className="h-12 bg-[#171813] border border-white/10 rounded-xl w-3/4"></div>
        <div className="h-6 bg-[#171813] border border-white/10 rounded-xl w-1/3"></div>
        <div className="h-24 bg-[#171813] border border-white/10 rounded-xl w-full"></div>
        <div className="h-32 bg-[#171813] border border-white/10 rounded-xl w-full mt-10"></div>
      </div>
    </div>
  </div>
);
