import SEO from '../components/SEO';
import SEOStructuredData from '../components/SEOStructuredData';
import React, { useRef, useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Star, Leaf, Heart, Shield, ChevronRight, ChevronLeft,
  Minus, Plus, CheckCircle2, AlertCircle, Microscope, Package, Tag,
  BadgeCheck, Play, Truck, X
} from 'lucide-react';
import { 
  products as productsApi, 
  reviews as reviewsApi,
  recommendations as recommendationsApi
} from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { getDeliveryEstimate } from '../utils/deliveryEstimate';

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

// Robust parsing for JSON-stringified arrays from MySQL
const getImageUrl = (img) => {
  if (!img) return '/logo.webp';
  let parsedImg = img;
  
  if (typeof img === 'string') {
    try {
      const parsed = JSON.parse(img);
      parsedImg = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch (e) {
      parsedImg = img; // Normal string fallback
    }
  }

  let path = typeof parsedImg === 'object' && parsedImg !== null ? (parsedImg.url || parsedImg.file_path || parsedImg.path) : parsedImg;
  
  if (!path || typeof path !== 'string') return '/logo.webp';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL || import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-70fdb5d94df347c4bed417c28b066c02.r2.dev/bhumivera';
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const canPersonalize = Boolean(user?.id && !['admin', 'superadmin', 'warehouse_admin'].includes(user.role));
  
  const [product, setProduct] = useState(null);
  const [reviewsData, setReviewsData] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendationReason, setRecommendationReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [isAdding, setIsAdding] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [reviewRatingFilter, setReviewRatingFilter] = useState('all');
  const [reviewSort, setReviewSort] = useState('newest');
  const purchaseSectionRef = useRef(null);
  const isPurchaseSectionVisible = useInView(purchaseSectionRef, { amount: 0.2 });

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
        try {
          const prodRes = await productsApi.getById(id);
          fetchedProduct = prodRes.data?.data || prodRes.data;
        } catch (err) {
          const slugRes = await productsApi.getBySlug(id);
          fetchedProduct = slugRes.data?.data || slugRes.data;
        }
        
        if (fetchedProduct) {
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
        if (fetchedProduct?.images?.length > 0) {
          setActiveMedia(fetchedProduct.images[0]);
        }

        if (fetchedProduct && fetchedProduct.id) {
          try {
            const revRes = await reviewsApi.getByProduct(fetchedProduct.id);
            const reviewPayload = revRes.data?.data || revRes.data || {};
            const reviewRows = Array.isArray(reviewPayload) ? reviewPayload : reviewPayload.reviews || [];
            setReviewsData(Array.isArray(reviewRows) ? reviewRows.map(review => ({ ...review, comment: review.body || review.comment || '' })) : []);
            setReviewSummary(reviewPayload.summary || revRes.data?.summary || null);
          } catch (revErr) {
            setReviewsData([]);
            setReviewSummary(null);
          }
        }
      } catch (err) {
        console.error("Failed to load product ecosystem:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
    window.addEventListener('online', fetchProductData);
    return () => window.removeEventListener('online', fetchProductData);
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
    try {
      await addToCart(product, quantity);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setTimeout(() => setIsAdding(false), 800);
    }
  };

  const isOutOfStock = product?.quantity <= 0;
  let rawSpecifications = product?.specifications || {};
  if (typeof rawSpecifications === 'string') {
    try { rawSpecifications = JSON.parse(rawSpecifications); } catch { rawSpecifications = {}; }
  }
  const specificationEntries = rawSpecifications && typeof rawSpecifications === 'object' && !Array.isArray(rawSpecifications)
    ? Object.entries(rawSpecifications).filter(([, value]) => value !== null && value !== undefined && String(value).trim())
    : [];
  const productRating = reviewSummary
    ? Number(reviewSummary.average || 0)
    : Number(product?.rating || 0);
  const reviewCount = Number(reviewSummary?.total ?? product?.review_count ?? 0);
  const videoEmbeds = splitUrls(product?.video_urls)
    .map(url => ({ source: url, embed: toVideoEmbedUrl(url) }))
    .filter(video => video.embed);
  const reviewPhotos = reviewsData.flatMap(review => (Array.isArray(review.images) ? review.images : []).map(image => ({ image, review })));
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
      <div className="min-h-screen flex items-center justify-center text-[#8b5a2b] bg-[#FDFBF7] font-black uppercase tracking-widest text-2xl">
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
    <div className="relative min-h-screen bg-[#f4f2eb] pb-28 pt-20 font-sans text-[#1b2821] selection:bg-[#253b2f] selection:text-white md:pb-32 md:pt-24">
      <SEOStructuredData product={product} />
      <SEO 
        title={`${product.name} | Bhumivera`}
        description={product.description?.substring(0, 155)}
        keywords={`${product.name}, Bhumivera, skincare, hair care`}
        ogImage={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : undefined}
        route={`/product/${product.slug || product.id}`}
        schema={productSchema} 
      />

      <div className="relative z-10 mx-auto mb-4 flex max-w-7xl items-center gap-1.5 overflow-hidden px-4 text-[9px] font-bold uppercase tracking-[0.12em] text-stone-500 md:mb-8 md:gap-2 md:px-6 md:text-xs md:tracking-widest">
        <Link to="/" className="hover:text-[#8b5a2b] transition-colors">Home</Link>
        <ChevronRight size={12} className="shrink-0 md:h-[14px] md:w-[14px]" />
        <Link to={`/shop?category=${product.category_id}`} className="shrink-0 hover:text-[#8b5a2b] transition-colors">{product.category_name || 'Botanicals'}</Link>
        <ChevronRight size={12} className="shrink-0 md:h-[14px] md:w-[14px]" />
        <span className="truncate text-[#35533c]">{product.name}</span>
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
                    getImageUrl(activeMedia) === url ? 'border-[#8b5a2b] shadow-[2px_2px_0px_#6b4421]' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img src={url} alt={`${product.name} image ${idx + 1}`} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" loading="lazy" />
                </button>
              );
            })}
          </div>

          <div className="group relative aspect-[0.94] w-full overflow-hidden border-y border-[#253b2f]/10 bg-[#e9e8df] shadow-sm sm:aspect-square sm:rounded-2xl sm:border md:sticky md:top-28 md:aspect-auto md:h-[min(72vh,680px)] md:min-h-[500px] md:self-start lg:top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={getImageUrl(activeMedia)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="h-full w-full p-5 sm:p-8 md:p-10 lg:p-12"
              >
                <img src={getImageUrl(activeMedia)} alt={product.name} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.025]" />
              </motion.div>
            </AnimatePresence>

            {product.images?.length > 1 && (
              <>
                <button type="button" onClick={() => showAdjacentImage(-1)} aria-label="Previous product image" className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-stone-200 bg-white/90 p-2.5 text-[#35533c] shadow-lg transition hover:bg-white sm:left-4 sm:p-3">
                  <ChevronLeft size={18} className="sm:h-5 sm:w-5"/>
                </button>
                <button type="button" onClick={() => showAdjacentImage(1)} aria-label="Next product image" className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-stone-200 bg-white/90 p-2.5 text-[#35533c] shadow-lg transition hover:bg-white sm:right-4 sm:p-3">
                  <ChevronRight size={18} className="sm:h-5 sm:w-5"/>
                </button>
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-white/85 px-3 py-2 shadow-sm backdrop-blur">
                  {product.images.map((image, index) => (
                    <button key={image.id || `${getImageUrl(image)}-${index}`} type="button" onClick={() => setActiveMedia(image)} aria-label={`Show product image ${index + 1}`} aria-current={index === activeImageIndex} className={`h-2 rounded-full transition-all ${index === activeImageIndex ? 'w-6 bg-[#8b5a2b]' : 'w-2 bg-stone-400 hover:bg-stone-600'}`}/>
                  ))}
                </div>
              </>
            )}

            <div className="absolute left-3 top-3 z-10 flex flex-col gap-3 sm:left-6 sm:top-6">
              {product.is_featured === 1 && <span className="rounded-full bg-[#8b5a2b] px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white shadow-sm sm:px-4 sm:text-[10px]">Premium Selection</span>}
            </div>
            
            <button onClick={() => toggleWishlist(product)} aria-label={isWishlisted(product.id) ? 'Remove from saved products' : 'Save product'} aria-pressed={isWishlisted(product.id)} className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/95 text-stone-500 shadow-sm transition-all duration-300 hover:border-[#536b4d] hover:text-[#35533c] sm:right-6 sm:top-6 sm:h-12 sm:w-12">
              <Heart size={18} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <div className="relative flex flex-col px-4 md:px-0 lg:col-span-5">
          <div className="mb-5 border-b border-[#253b2f]/15 pb-5 md:mb-8 md:pb-8">
            <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
               <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-[#536b4d] sm:text-[10px] sm:tracking-[0.2em]">
                 SKU: {product.sku || 'N/A'}
               </span>
               {product.brand && (
                  <span className="flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-stone-600 sm:px-3 sm:text-[10px]">
                    <Tag size={12} /> {product.brand}
                  </span>
               )}
            </div>
            
            <h1 className="mb-3 font-serif text-[2rem] leading-[1.08] text-[#17251c] sm:text-4xl md:mb-5 md:text-5xl">
              {product.name}
            </h1>

            {productRating > 0 && <a href="#product-reviews" onClick={() => setActiveTab('reviews')} className="mb-4 inline-flex min-h-10 items-center gap-2 text-xs text-[#526b4c] hover:text-[#8b5a2b] sm:text-sm">
              <span className="flex" aria-label={`${productRating.toFixed(1)} out of 5 stars`}>{[1, 2, 3, 4, 5].map(star => <Star key={star} size={13} fill={star <= Math.round(productRating) ? 'currentColor' : 'none'} />)}</span>
              <span>{productRating.toFixed(1)}{reviewCount > 0 ? ` · ${reviewCount} reviews` : ''}</span>
            </a>}
            
            <div className="mb-4 flex flex-col gap-2 md:mb-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-serif text-3xl text-[#35533c] sm:text-4xl">
                  ₹{product.discount_price || product.price}
                </span>
                {product.discount_price && (
                  <span className="text-base font-medium text-stone-400 line-through sm:text-xl">₹{product.price}</span>
                )}
              </div>
            </div>

            <p className="line-clamp-3 text-sm leading-6 text-stone-600 md:line-clamp-none md:leading-7">
              {product.description}
            </p>
          </div>

          <div ref={purchaseSectionRef} className="relative mb-6 rounded-2xl border border-[#253b2f]/10 bg-white p-4 shadow-[0_12px_40px_rgba(28,41,34,0.07)] sm:p-6 md:mb-8 md:rounded-3xl md:p-7">
            <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
              <span className={`inline-flex min-h-8 items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.12em] sm:text-[10px] sm:tracking-widest ${isOutOfStock ? 'bg-red-50 text-red-600' : 'bg-[#eff3ec] text-[#526b4c]'}`}>
                {isOutOfStock ? <AlertCircle size={16}/> : <Package size={16}/>}
                {isOutOfStock ? 'Currently unavailable' : product.quantity <= 5 ? `Only ${product.quantity} left` : 'Available to order'}
              </span>
              <span className="shrink-0 text-[10px] font-medium text-stone-500">Secure checkout</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex h-12 w-full items-center justify-between rounded-xl border border-stone-200 bg-[#faf9f6] px-2 sm:h-auto sm:w-32">
                <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-white hover:text-[#8b5a2b] disabled:opacity-40">
                  <Minus size={16} />
                </button>
                <span aria-live="polite" className="w-8 text-center font-mono text-base">{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(q => q + 1)} disabled={quantity >= product.quantity} className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-white hover:text-[#8b5a2b] disabled:opacity-40">
                  <Plus size={16} />
                </button>
              </div>

              <button 
                type="button"
                onClick={handleAddToCart} 
                disabled={isOutOfStock || isAdding}
                className="relative flex min-h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#35533c] px-4 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(53,83,60,0.2)] transition-all hover:bg-[#253b2f] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-14 sm:tracking-widest"
              >
                <span className={`flex items-center gap-2 transition-transform duration-300 ${isAdding ? '-translate-y-12' : ''}`}>
                  <Leaf size={16} /> {isAdding ? 'Adding...' : 'Add to Cart'}
                </span>
                <span className={`absolute inset-0 flex items-center justify-center gap-2 bg-[#6b4421] transition-transform duration-300 ${isAdding ? 'translate-y-0' : 'translate-y-12'}`}>
                  <CheckCircle2 size={16} /> Added to Cart
                </span>
              </button>

            </div>
            <div className="mt-4 flex items-start gap-3 border-t border-stone-200 pt-4 text-stone-700 sm:mt-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eff3ec] text-[#607552]">
                <Truck size={17} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold">Estimated delivery</p>
                <p className="mt-1 text-sm font-medium">{getDeliveryEstimate()} <span className="font-normal text-stone-500">(5–7 days if ordered today)</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {[
              { icon: <Shield />, title: 'Product support', sub: 'Help with orders and product questions', to: '/contact' },
              { icon: <Leaf />, title: 'Care beyond the product', sub: 'See the public, verified field ledger', to: '/impact' },
            ].map((item, i) => (
              <Link to={item.to} key={i} className="group flex min-h-24 flex-row items-center gap-4 rounded-2xl border border-[#253b2f]/10 bg-white p-4 transition-colors hover:border-[#536b4d]/60 sm:min-h-36 sm:flex-col sm:items-start sm:p-5 md:p-6">
                <div className="text-[#8b5a2b] group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-800">{item.title}</h4>
                  <p className="mt-1 text-[10px] leading-4 text-stone-500 sm:text-xs">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-16 max-w-7xl px-4 md:mt-28 md:px-6">
        <div className="no-scrollbar relative mb-8 flex overflow-x-auto border-b border-stone-200 sm:mb-12">
          {['details', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative min-h-12 whitespace-nowrap px-5 pb-3 text-[10px] font-mono uppercase tracking-widest transition-colors sm:px-8 sm:pb-6 sm:text-xs ${
                activeTab === tab ? 'text-[#8b5a2b]' : 'text-stone-400 hover:text-stone-800'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${reviewCount})` : tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8b5a2b]" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'details' && (
              <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-stone-600 leading-loose text-base max-w-4xl whitespace-pre-wrap">
                {product.description}
              </motion.div>
            )}
            
            {activeTab === 'specifications' && (
              <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl border border-[#253b2f]/15 bg-white p-6 md:p-8">
                <h3 className="mb-6 border-b border-stone-100 pb-4 font-serif text-2xl">Product details</h3>
                {specificationEntries.length > 0 ? <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
                  {specificationEntries.map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2 border-b border-stone-100 border-dashed">
                      <span className="text-stone-500 text-xs">{label.replaceAll('_', ' ')}</span>
                      <span className="max-w-[60%] text-right text-sm font-medium text-[#35533c]">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                    </div>
                  ))}
                </div> : <p className="text-sm leading-6 text-stone-600">Detailed specifications have not been published for this product yet. Contact us for product-specific questions.</p>}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div id="product-reviews" key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl scroll-mt-28">
                <div className="mb-8 grid gap-6 border border-[#253b2f]/15 bg-white p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8">
                  <div className="text-center md:min-w-32">
                    <div className="font-serif text-5xl text-[#35533c]">{reviewCount ? productRating.toFixed(1) : '—'}</div>
                    <div className="mt-2 flex justify-center text-[#8b5a2b]" aria-label={`${productRating.toFixed(1)} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill={star <= Math.round(productRating) ? 'currentColor' : 'none'} />)}
                    </div>
                    <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-stone-500">{reviewCount} approved reviews</p>
                  </div>
                  <div className="border-t border-stone-100 pt-5 text-sm leading-7 text-stone-600 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                    <h3 className="mb-1 font-serif text-xl text-[#17251c]">Real experiences, thoughtfully shared</h3>
                    <p>Only currently approved reviews are shown. A verified-purchase label appears only when a review is linked to an order.</p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-[#35533c] sm:grid-cols-3">
                      <span className="flex items-center gap-2"><Shield size={15} className="text-[#8b5a2b]"/>Secure checkout</span>
                      <span className="flex items-center gap-2"><BadgeCheck size={15} className="text-[#8b5a2b]"/>Verified reviews</span>
                      <span className="flex items-center gap-2"><Package size={15} className="text-[#8b5a2b]"/>Order support</span>
                    </div>
                  </div>
                </div>
                {reviewPhotos.length > 0 && <section className="mb-8 rounded-2xl border border-[#253b2f]/15 bg-white p-5 md:p-6">
                  <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b5a2b]">From our customers</p><h3 className="mt-1 font-serif text-2xl text-[#17251c]">Real photos, real reviews</h3></div><span className="text-xs text-stone-500">{reviewPhotos.length} customer {reviewPhotos.length === 1 ? 'photo' : 'photos'}</span></div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {reviewPhotos.map(({ image, review }, index) => <a key={`${review.id || index}-${index}`} href={getImageUrl(image)} target="_blank" rel="noreferrer" aria-label={`View customer photo from ${review.user_name || 'a customer'}'s review`} className="group relative h-36 w-32 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-50 sm:h-44 sm:w-40">
                      <img src={getImageUrl(image)} alt={`Customer photo for ${product.name}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }}/>
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2 pb-2 pt-7 text-left text-[10px] font-semibold text-white">{review.user_name || 'Customer'}{review.order_id ? ' · Verified' : ''}</span>
                    </a>)}
                  </div>
                </section>}
                {reviewsData.length > 0 && <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#35533c]">{visibleReviews.length} customer {visibleReviews.length === 1 ? 'review' : 'reviews'}</p>
                  <div className="flex gap-2">
                    <label className="sr-only" htmlFor="review-rating-filter">Filter reviews by rating</label>
                    <select id="review-rating-filter" value={reviewRatingFilter} onChange={event => setReviewRatingFilter(event.target.value)} className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-[#35533c]">
                      <option value="all">All ratings</option>{[5, 4, 3, 2, 1].map(rating => <option key={rating} value={rating}>{rating} stars</option>)}
                    </select>
                    <label className="sr-only" htmlFor="review-sort">Sort reviews</label>
                    <select id="review-sort" value={reviewSort} onChange={event => setReviewSort(event.target.value)} className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-[#35533c]">
                      <option value="newest">Newest</option><option value="highest">Highest rated</option><option value="lowest">Lowest rated</option>
                    </select>
                  </div>
                </div>}
                {visibleReviews.length > 0 ? (
                  visibleReviews.map((review, i) => (
                    <article key={review.id || i} className="mb-4 rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-1 text-[#8b5a2b]" aria-label={`${review.rating} out of 5 stars`}>
                          {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill={idx < Number(review.rating) ? "currentColor" : "none"} />)}
                        </div>
                        {review.order_id && <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f7ef] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800"><BadgeCheck size={13}/>Verified purchase</span>}
                      </div>
                      {review.title && <h4 className="mb-2 text-lg font-semibold text-stone-800">{review.title}</h4>}
                      <p className="whitespace-pre-line text-sm leading-6 text-stone-600">{review.comment}</p>
                      {Array.isArray(review.images) && review.images.length > 0 && <div className="mt-4 flex flex-wrap gap-3">
                        {review.images.map((image, imageIndex) => <a key={`${review.id}-${imageIndex}`} href={getImageUrl(image)} target="_blank" rel="noreferrer" className="block h-24 w-24 overflow-hidden rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#8b5a2b]">
                          <img src={getImageUrl(image)} alt={`Customer photo ${imageIndex + 1} for ${product.name}`} className="h-full w-full object-cover" loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }}/>
                        </a>)}
                      </div>}
                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-stone-100 pt-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        <span>{review.user_name || 'Customer'}</span>
                        {review.created_at && <time dateTime={review.created_at}>{new Date(review.created_at).toLocaleDateString()}</time>}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-center py-24 bg-white border border-stone-200">
                    <Microscope className="mx-auto text-stone-300 mb-4" size={40} />
                    <h3 className="text-sm font-mono text-stone-500 uppercase tracking-widest">{reviewsData.length ? 'No reviews match this filter' : 'No approved reviews yet'}</h3>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {(videoEmbeds.length > 0 || productLinks.length > 0) && (
        <section className="max-w-7xl mx-auto px-6 mt-16 relative z-10">
          {videoEmbeds.length > 0 && (
            <div className="mb-12">
              <div className="mb-6 border-b border-[#253b2f]/15 pb-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b5a2b]">See it for yourself</p>
                <h2 className="mt-2 font-serif text-3xl text-[#17251c]">Product videos</h2>
              </div>
              <div className="flex snap-x gap-4 overflow-x-auto pb-3">
                {videoEmbeds.map((video, index) => (
                  <button key={video.embed} type="button" onClick={() => setActiveVideo(video)} aria-label={`Play product video ${index + 1}`} className="group relative aspect-[9/12] w-56 shrink-0 snap-start overflow-hidden rounded-2xl border border-[#253b2f]/15 bg-[#e9e8df] text-left shadow-sm sm:w-64">
                    {video.embed.includes('youtube-nocookie.com/embed/') ? <img src={`https://img.youtube.com/vi/${video.embed.split('/').pop()}/hqdefault.jpg`} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.classList.add('hidden'); }}/> : <div className="absolute inset-0 bg-gradient-to-br from-[#253b2f] to-[#8b5a2b]"/>}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition group-hover:bg-black/25"><span className="rounded-full bg-white/95 p-4 text-[#35533c] shadow-xl"><Play size={22} fill="currentColor"/></span></span>
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-16 text-left text-sm font-semibold text-white">{product.name}<span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-white/80">Watch product video</span></span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {productLinks.length > 0 && (
            <div className="mb-12 border border-[#253b2f]/15 bg-white p-6 md:p-8">
              <h2 className="mb-4 font-serif text-2xl text-[#17251c]">Product resources</h2>
              <div className="flex flex-wrap gap-3">
                {productLinks.map(url => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[#253b2f]/20 px-4 py-3 text-xs font-semibold text-[#35533c] transition hover:border-[#8b5a2b] hover:text-[#8b5a2b]">
                    {new URL(url).hostname.replace(/^www\./, '')}<ChevronRight size={14}/>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {canPersonalize && recommendedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-16 relative z-10">
          <div className="mb-6 border-b border-[#253b2f]/15 pb-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b5a2b]">Picked for you</p>
            <h2 className="mt-2 font-serif text-3xl text-[#17251c]">You may also love</h2>
            <p className="mt-2 text-sm text-stone-500">{recommendationReason}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {recommendedProducts.map(recommended => (
              <Link key={recommended.id} to={`/product/${recommended.slug || recommended.id}`} className="group overflow-hidden border border-[#253b2f]/15 bg-white transition hover:-translate-y-1 hover:shadow-lg">
                <div className="aspect-[4/5] overflow-hidden bg-[#e9e8df] p-4">
                  <img src={getImageUrl(recommended.images?.[0] || recommended.image_url)} alt={recommended.name} loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"/>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm font-medium text-[#17251c]">{recommended.name}</h3>
                  <p className="mt-2 font-mono text-sm text-[#35533c]">₹{recommended.discount_price || recommended.price}</p>
                  {Number(recommended.review_count) > 0 && <p className="mt-1 text-xs text-stone-500">★ {Number(recommended.rating || 0).toFixed(1)} · {recommended.review_count} reviews</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {activeVideo && <motion.div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) setActiveVideo(null); }}>
          <motion.section role="dialog" aria-modal="true" aria-labelledby="product-video-title" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} className="relative grid max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#FDFBF7] shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
            <button type="button" aria-label="Close video" onClick={() => setActiveVideo(null)} className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-stone-700 shadow"><X size={18}/></button>
            <div className="aspect-[9/12] max-h-[72vh] bg-black md:aspect-auto">
              <iframe src={activeVideo.embed} title={`${product.name} product video`} className="h-full w-full" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b5a2b]">See it for yourself</p>
              <h2 id="product-video-title" className="mt-2 font-serif text-2xl leading-tight text-[#17251c]">{product.name}</h2>
              <p className="mt-3 text-xl font-semibold text-[#35533c]">₹{product.discount_price || product.price}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-stone-600"><Shield size={15} className="text-[#8b5a2b]"/>Secure checkout · Bhumivera support</div>
              <div className="mt-auto pt-8">
                <button type="button" onClick={async () => { await handleAddToCart(); setActiveVideo(null); }} disabled={isOutOfStock || isAdding} className="w-full rounded-xl bg-[#35533c] px-5 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#253b2f] disabled:cursor-not-allowed disabled:opacity-50">{isAdding ? 'Adding…' : isOutOfStock ? 'Currently unavailable' : 'Add to cart'}</button>
              </div>
            </div>
          </motion.section>
        </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {!isPurchaseSectionVisible && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5"
          >
            <div className="pointer-events-auto mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-[#253b2f]/10 bg-white/95 p-2.5 shadow-[0_10px_40px_rgba(23,37,28,0.2)] backdrop-blur-xl sm:gap-4 sm:p-3 md:max-w-4xl">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-[#f4f2eb] sm:h-12 sm:w-12">
                <img src={getImageUrl(activeMedia)} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-full w-full object-contain mix-blend-multiply" alt="" />
              </div>
              <div className="min-w-0 flex-1 md:flex md:items-center md:gap-4">
                <h4 className="truncate text-xs font-medium text-stone-800 sm:text-sm">{product.name}</h4>
                <p className="text-sm font-semibold text-[#35533c] md:text-base">₹{product.discount_price || product.price}</p>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#35533c] px-4 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#253b2f] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-xs"
              >
                {isAdding ? 'Adding...' : <><Leaf size={15} /> Add to cart</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SkeletonPDP = () => (
  <div className="bg-[#FDFBF7] min-h-screen pt-24 pb-32 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse opacity-50">
      <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
        <div className="flex md:flex-col gap-4 w-full md:w-24">
          {[1,2,3,4].map(i => <div key={i} className="w-20 h-20 md:w-24 md:h-24 bg-stone-200 shrink-0"></div>)}
        </div>
        <div className="w-full h-[500px] md:h-[700px] bg-stone-200"></div>
      </div>
      <div className="lg:col-span-5 flex flex-col gap-8 pt-8">
        <div className="h-12 bg-stone-200 w-3/4"></div>
        <div className="h-6 bg-stone-200 w-1/3"></div>
        <div className="h-24 bg-stone-200 w-full"></div>
        <div className="h-32 bg-stone-200 w-full mt-10"></div>
      </div>
    </div>
  </div>
);
