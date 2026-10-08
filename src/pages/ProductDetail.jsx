import SEO from '../components/SEO';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Star, Leaf, Heart, Shield, ChevronRight, ChevronLeft,
  Minus, Plus, CheckCircle2, AlertCircle, Microscope, Package, Tag
} from 'lucide-react';
import { 
  products as productsApi, 
  reviews as reviewsApi,
  recommendations as recommendationsApi
} from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

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

  const { scrollY } = useScroll();
  const showStickyBar = useTransform(scrollY, [0, 800], [0, 1]);
  const stickyYOffset = useTransform(showStickyBar, [0, 1], [50, 0]);

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
    <div className="bg-[#f4f2eb] text-[#1b2821] min-h-screen selection:bg-[#253b2f] selection:text-white pt-24 pb-32 font-sans relative">
      <SEO 
        title={`${product.name} | Bhumivera`}
        description={product.description?.substring(0, 155)}
        keywords={`${product.name}, Bhumivera, skincare, hair care`}
        ogImage={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : undefined}
        route={`/product/${product.slug || product.id}`}
        schema={productSchema} 
      />

      <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 relative z-10">
        <Link to="/" className="hover:text-[#8b5a2b] transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to={`/shop?category=${product.category_id}`} className="hover:text-[#8b5a2b] transition-colors">{product.category_name || 'Botanicals'}</Link>
        <ChevronRight size={14} />
        <span className="text-[#35533c] truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
        
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6 relative">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 no-scrollbar py-1">
            {product.images?.map((media, idx) => {
              const url = getImageUrl(media);
              return (
                <button 
                  key={media.id || `${url}-${idx}`}
                  onClick={() => setActiveMedia(media)}
                  className={`relative w-20 h-20 md:w-24 md:h-24 rounded-none overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                    getImageUrl(activeMedia) === url ? 'border-[#8b5a2b] shadow-[2px_2px_0px_#6b4421]' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img src={url} alt={`${product.name} image ${idx + 1}`} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" loading="lazy" />
                </button>
              );
            })}
          </div>

          <div className="relative w-full aspect-square md:aspect-auto md:h-[680px] bg-[#e9e8df] border border-[#253b2f]/10 shadow-sm overflow-hidden flex items-center justify-center lg:sticky lg:top-32 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={getImageUrl(activeMedia)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full p-8 md:p-12"
              >
                <img src={getImageUrl(activeMedia)} alt={product.name} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.025]" />
              </motion.div>
            </AnimatePresence>

            {product.images?.length > 1 && (
              <>
                <button type="button" onClick={() => showAdjacentImage(-1)} aria-label="Previous product image" className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-stone-200 bg-white/90 p-3 text-[#35533c] shadow-lg transition hover:bg-white">
                  <ChevronLeft size={20}/>
                </button>
                <button type="button" onClick={() => showAdjacentImage(1)} aria-label="Next product image" className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-stone-200 bg-white/90 p-3 text-[#35533c] shadow-lg transition hover:bg-white">
                  <ChevronRight size={20}/>
                </button>
                <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 px-3 py-2">
                  {product.images.map((image, index) => (
                    <button key={image.id || `${getImageUrl(image)}-${index}`} type="button" onClick={() => setActiveMedia(image)} aria-label={`Show product image ${index + 1}`} aria-current={index === activeImageIndex} className={`h-2 rounded-full transition-all ${index === activeImageIndex ? 'w-6 bg-[#8b5a2b]' : 'w-2 bg-stone-400 hover:bg-stone-600'}`}/>
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
              {product.is_featured === 1 && <span className="bg-[#8b5a2b] text-white px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest">Premium Selection</span>}
            </div>
            
            <button onClick={() => toggleWishlist(product)} aria-label={isWishlisted(product.id) ? 'Remove from saved products' : 'Save product'} aria-pressed={isWishlisted(product.id)} className="absolute top-6 right-6 w-12 h-12 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-500 hover:text-[#35533c] hover:border-[#536b4d] transition-all duration-300 z-10">
              <Heart size={20} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col relative">
          <div className="mb-8 border-b border-[#253b2f]/15 pb-8">
            <div className="flex items-center gap-3 mb-3">
               <span className="text-[#536b4d] font-mono text-[10px] uppercase tracking-[0.2em] block">
                 SKU: {product.sku || 'N/A'}
               </span>
               {product.brand && (
                  <span className="bg-stone-100 px-3 py-1 text-[10px] font-bold text-stone-600 uppercase tracking-widest rounded-full flex items-center gap-1">
                    <Tag size={12} /> {product.brand}
                  </span>
               )}
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] mb-5 text-[#17251c]">
              {product.name}
            </h1>

            {productRating > 0 && <div className="mb-5 flex items-center gap-2 text-sm text-[#526b4c]"><div className="flex" aria-label={`${productRating.toFixed(1)} out of 5 stars`}>{[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill={star <= Math.round(productRating) ? 'currentColor' : 'none'} />)}</div><span>{productRating.toFixed(1)}{reviewCount > 0 ? ` · ${reviewCount} reviews` : ''}</span></div>}
            
            <div className="flex flex-col gap-2 mb-5">
              <div className="flex items-end gap-4">
                <span className="font-serif text-4xl text-[#35533c]">
                  ₹{product.discount_price || product.price}
                </span>
                {product.discount_price && (
                  <span className="text-xl font-medium text-stone-400 line-through mb-1">₹{product.price}</span>
                )}
              </div>
            </div>

            <p className="text-stone-600 text-sm leading-7">
              {product.description}
            </p>
          </div>

          <div className="bg-white border border-[#253b2f]/15 p-6 md:p-8 mb-8 relative">
            <div className="flex items-center justify-between gap-4 mb-6">
              <span className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest ${isOutOfStock ? 'text-red-500' : 'text-[#8b5a2b]'}`}>
                {isOutOfStock ? <AlertCircle size={16}/> : <Package size={16}/>}
                {isOutOfStock ? 'Currently unavailable' : product.quantity <= 5 ? `Only ${product.quantity} left` : 'Available to order'}
              </span>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-between bg-stone-50 border border-stone-200 w-32 px-2 py-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-[#8b5a2b] transition-colors">
                  <Minus size={16} />
                </button>
                <span className="font-mono text-lg w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} disabled={quantity >= product.quantity} className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-[#8b5a2b] transition-colors disabled:opacity-50">
                  <Plus size={16} />
                </button>
              </div>

              <button 
                onClick={handleAddToCart} 
                disabled={isOutOfStock || isAdding}
                className="flex-1 bg-[#8b5a2b] hover:bg-[#6b4421] text-white font-mono uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 active:translate-x-1"
              >
                <span className={`flex items-center gap-2 transition-transform duration-300 ${isAdding ? '-translate-y-12' : ''}`}>
                  <Leaf size={16} /> Add to Cart
                </span>
                <span className={`absolute inset-0 flex items-center justify-center gap-2 bg-[#6b4421] transition-transform duration-300 ${isAdding ? 'translate-y-0' : 'translate-y-12'}`}>
                  <CheckCircle2 size={16} /> Added to Cart
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Shield />, title: 'Product support', sub: 'Help with orders and product questions', to: '/contact' },
              { icon: <Leaf />, title: 'Care beyond the product', sub: 'See the public, verified field ledger', to: '/impact' },
            ].map((item, i) => (
              <Link to={item.to} key={i} className="flex flex-col gap-2 p-6 bg-white border border-[#253b2f]/15 hover:border-[#536b4d]/60 transition-colors group cursor-pointer">
                <div className="text-[#8b5a2b] group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-800">{item.title}</h4>
                  <p className="text-[9px] leading-4 text-stone-500 mt-1">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-32 relative z-10">
        <div className="flex border-b border-stone-200 mb-12 relative overflow-x-auto no-scrollbar">
          {['details', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-6 px-8 text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap relative ${
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
              <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl">
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
                    <p>Only currently approved customer reviews appear here. Ratings and totals update as reviews are published or removed.</p>
                  </div>
                </div>
                {reviewsData.length > 0 ? (
                  reviewsData.map((review, i) => (
                    <div key={i} className="p-8 bg-white border border-stone-200 mb-6 relative">
                      <div className="flex items-center gap-1 text-[#8b5a2b] mb-4">
                        {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill={idx < review.rating ? "currentColor" : "none"} />)}
                      </div>
                      <h4 className="text-lg font-medium text-stone-800 mb-2 italic">"{review.title}"</h4>
                      <p className="text-stone-500 text-sm mb-6">{review.comment}</p>
                      {Array.isArray(review.images) && review.images.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-3">
                          {review.images.map((image, imageIndex) => (
                            <a key={`${review.id}-${imageIndex}`} href={getImageUrl(image)} target="_blank" rel="noreferrer" className="block h-24 w-24 overflow-hidden rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#8b5a2b]">
                              <img src={getImageUrl(image)} alt={`Customer photo ${imageIndex + 1} for ${product?.name || 'this product'}`} className="h-full w-full object-cover" loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }}/>
                            </a>
                          ))}
                        </div>
                      )}
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-t border-stone-100 pt-4">{review.user_name}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24 bg-white border border-stone-200">
                    <Microscope className="mx-auto text-stone-300 mb-4" size={40} />
                    <h3 className="text-sm font-mono text-stone-500 uppercase tracking-widest">No approved reviews yet</h3>
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
              <div className="grid gap-6 md:grid-cols-2">
                {videoEmbeds.map((video, index) => (
                  <div key={video.embed} className="overflow-hidden border border-[#253b2f]/15 bg-white shadow-sm">
                    <div className="aspect-video bg-[#e9e8df]">
                      <iframe src={video.embed} title={`${product.name} video ${index + 1}`} className="h-full w-full" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
                    </div>
                  </div>
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

      <motion.div 
        style={{ opacity: showStickyBar, y: stickyYOffset }}
        className="fixed bottom-0 left-0 w-full z-50 p-4 pointer-events-none"
      >
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl border border-[#8b5a2b]/20 p-3 shadow-lg flex items-center justify-between pointer-events-auto">
          <div className="hidden md:flex items-center gap-4 pl-2">
            <div className="w-10 h-10 border border-stone-200 overflow-hidden bg-white">
              <img src={getImageUrl(activeMedia)} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="w-full h-full object-contain mix-blend-multiply" alt="sticky" />
            </div>
            <div>
              <h4 className="text-xs font-medium italic text-stone-800 line-clamp-1">{product.name}</h4>
              <p className="text-[#8b5a2b] font-mono text-[10px] tracking-widest">₹{product.discount_price || product.price}</p>
            </div>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full md:w-auto px-8 py-3 bg-[#8b5a2b] text-white font-mono uppercase tracking-widest text-[10px] hover:bg-[#6b4421] transition-colors disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </motion.div>
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
