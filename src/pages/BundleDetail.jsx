import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Layers,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import SEO from '../components/SEO';
import ProductDeliveryPromise from '../components/ProductDeliveryPromise';
import QASection from '../components/QASection';
import { products as productsApi, reviews as reviewsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductImageUrl } from '../utils/productImageUrl';
import {
  getComboPrice,
  isComboProduct,
  resolveComboItems,
} from '../utils/comboProducts';

const money = value => Number(value || 0).toLocaleString('en-IN', {
  maximumFractionDigits: 2,
});

const getComboImages = product => [
  ...(Array.isArray(product?.images) ? product.images : product?.images ? [product.images] : []),
  product?.image_url,
  product?.image,
].map(getProductImageUrl).filter((url, index, urls) => url && urls.indexOf(url) === index);

export default function BundleDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [catalogProduct, setCatalogProduct] = useState(null);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [comboReviews, setComboReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({ total: 0, average: 0 });
  const [reviewLoadError, setReviewLoadError] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(24);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryZoomed, setIsGalleryZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [purchaseButtonVisible, setPurchaseButtonVisible] = useState(true);
  const addToBagButtonRef = useRef(null);

  useEffect(() => {
    let active = true;
    const loadBundle = async () => {
      setLoading(true);
      setCatalogProduct(null);
      setCatalogProducts([]);
      setLoadError('');
      try {
        const [response, catalogResponse] = await Promise.all([
          productsApi.getBySlug(slug),
          productsApi.getAllActive(),
        ]);
        const product = response.data?.data || response.data;
        const activeProducts = catalogResponse.data?.data || catalogResponse.data;
        if (!product?.id || !isComboProduct(product)) {
          throw new Error('The requested catalog product is not an active combo.');
        }
        if (!Array.isArray(activeProducts)) {
          throw new Error('Current combo contents could not be verified.');
        }
        if (active) {
          setCatalogProducts(activeProducts);
          setCatalogProduct(product);
          setLoadError('');
        }
      } catch (error) {
        console.error('[REGIMEN_PRODUCT_LOAD]', error);
        if (active) {
          setCatalogProduct(null);
          setCatalogProducts([]);
          setLoadError('This combo is currently unavailable. Please refresh and try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadBundle();
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    let active = true;
    if (!catalogProduct?.id) return undefined;
    setComboReviews([]);
    setReviewSummary({ total: 0, average: 0 });
    setReviewLoadError('');
    reviewsApi.getByCombo(catalogProduct.id)
      .then(response => {
        const rows = response.data?.reviews;
        if (!Array.isArray(rows) || !response.data?.summary) throw new Error('The combo reviews response is incomplete.');
        if (active) {
          setComboReviews(rows);
          setReviewSummary(response.data.summary);
          setReviewLoadError('');
        }
      })
      .catch(error => {
        console.error('[COMBO_REVIEWS_LOAD]', error);
        if (active) {
          setComboReviews([]);
          setReviewSummary({ total: 0, average: 0 });
          setReviewLoadError('Combo reviews could not be loaded right now.');
        }
      });
    return () => { active = false; };
  }, [catalogProduct]);

  const filteredComboReviews = useMemo(() => {
    if (ratingFilter === 'all') return comboReviews;
    return comboReviews.filter(r => Number(r.rating) === Number(ratingFilter));
  }, [comboReviews, ratingFilter]);

  const comboImages = useMemo(() => getComboImages(catalogProduct), [catalogProduct]);
  const activeImageUrl = comboImages[activeImageIndex] || comboImages[0] || null;
  const comboItems = resolveComboItems(catalogProduct, catalogProducts);
  const comboPrice = getComboPrice(catalogProduct);
  const regularPrice = Number(catalogProduct?.price) || 0;
  const availableStock = Math.max(0, Number(catalogProduct?.quantity) || 0);
  const hasValidComboItems = comboItems.length > 0 &&
    comboItems.every(item => item.catalogMatch && item.id != null && item.slug);
  const comboIsAvailable = hasValidComboItems &&
    availableStock > 0;

  const showAdjacentImage = direction => {
    if (comboImages.length < 2) return;
    setActiveImageIndex(index => (index + direction + comboImages.length) % comboImages.length);
    setIsGalleryZoomed(false);
    setLightboxZoom(1);
  };

  useEffect(() => {
    setActiveImageIndex(0);
    setIsGalleryZoomed(false);
    setIsLightboxOpen(false);
    setLightboxZoom(1);
    setActiveTab('overview');
  }, [slug]);

  useEffect(() => {
    if (!isLightboxOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = event => {
      if (event.key === 'Escape') setIsLightboxOpen(false);
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const direction = event.key === 'ArrowLeft' ? -1 : 1;
        setActiveImageIndex(index => (index + direction + comboImages.length) % comboImages.length);
        setLightboxZoom(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, comboImages.length]);

  useEffect(() => {
    const button = addToBagButtonRef.current;
    if (!button || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setPurchaseButtonVisible(entry.isIntersecting);
    }, { threshold: 0.01 });
    observer.observe(button);
    return () => observer.disconnect();
  }, [catalogProduct?.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#081b15] px-6 pb-24 pt-32 text-white">
        <p role="status" className="mx-auto max-w-3xl text-center text-[#DFD7C4]">Loading combo from the current catalog…</p>
      </main>
    );
  }

  if (!loading && !catalogProduct) {
    return (
      <main className="min-h-screen bg-[#081b15] px-6 pb-24 pt-32 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-700 bg-[#10241f] p-8 text-center">
          <h1 className="font-serif text-3xl font-bold">Combo unavailable</h1>
          {loadError && <p role="alert" className="mt-3 text-sm text-rose-300">{loadError}</p>}
          <Link to="/shop" className="mt-5 inline-flex items-center gap-2 text-[#FCE096]">Browse the collection</Link>
        </div>
      </main>
    );
  }

  const handleAddToBag = async () => {
    if (!catalogProduct || adding || !comboIsAvailable) return;
    setAdding(true);
    try {
      await addToCart(catalogProduct, quantity);
    } finally {
      setAdding(false);
    }
  };

  const description = catalogProduct.short_description ||
    catalogProduct.description ||
    catalogProduct.meta_description ||
    '';

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#050806] pb-28 pt-8 font-sans text-[#FAF7F2] selection:bg-[#D4AF37]/30 selection:text-white md:pb-32 md:pt-12"
      style={{
        backgroundImage: 'radial-gradient(ellipse at 12% 8%, rgba(38, 91, 61, 0.48) 0%, transparent 38%), radial-gradient(ellipse at 88% 32%, rgba(18, 62, 42, 0.38) 0%, transparent 42%), linear-gradient(135deg, #050806 0%, #09130d 44%, #102319 72%, #050806 100%)',
      }}
    >
      <SEO
        title={catalogProduct.meta_title || `${catalogProduct.name} | Bhumivera`}
        description={description}
        ogImage={activeImageUrl || undefined}
        route={`/combo/${catalogProduct.slug}`}
      />
      <div className="relative z-10 mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 overflow-hidden px-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[#b8c5bb] md:mb-7 md:px-6 md:text-[10px] md:tracking-[0.2em]">
          <Link to="/" className="shrink-0 transition-colors hover:text-[#fce096]">Home</Link>
          <ChevronRight size={13} className="shrink-0 text-[#d4af37]/60" />
          <Link to="/shop" className="shrink-0 transition-colors hover:text-[#fce096]">Combos</Link>
          <ChevronRight size={13} className="shrink-0 text-[#d4af37]/60" />
          <span className="truncate text-[#fce096]">{catalogProduct.name}</span>
        </nav>

        <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-7 md:gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="relative flex flex-col-reverse gap-3 px-4 md:flex-row md:gap-5 lg:col-span-7 lg:px-0">
            {comboImages.length > 1 && (
              <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-4 py-1 md:w-20 md:flex-col md:gap-3 md:overflow-y-auto md:px-0 lg:w-24">
                {comboImages.map((url, index) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(index);
                      setIsGalleryZoomed(false);
                      setLightboxZoom(1);
                    }}
                    aria-label={`View ${catalogProduct.name} image ${index + 1}`}
                    aria-pressed={activeImageIndex === index}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-16 sm:w-16 md:h-20 md:w-20 md:rounded-2xl lg:h-24 lg:w-24 ${
                      activeImageIndex === index
                        ? 'border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                        : 'border-white/10 bg-[#171813] hover:border-[#D4AF37]/60'
                    }`}
                  >
                    <img
                      src={url}
                      alt=""
                      loading="lazy"
                      onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="product-media-gallery group relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] border border-[#d4af37]/30 bg-[radial-gradient(ellipse_at_50%_35%,#244232_0%,#14291f_68%,#101b15_100%)] shadow-[0_30px_90px_rgba(0,0,0,0.32)] md:sticky md:top-28 md:aspect-[4/5] md:self-start lg:top-32">
              {activeImageUrl ? (
                <AnimatePresence mode="wait">
                  <Motion.div
                    key={activeImageUrl}
                    initial={{ opacity: 0, scale: 0.975, x: 12 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 1.015, x: -12 }}
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 overflow-hidden"
                  >
                    <img
                      src={activeImageUrl}
                      alt={catalogProduct.name}
                      fetchpriority="high"
                      onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }}
                      onPointerMove={event => {
                        if (event.pointerType !== 'mouse') return;
                        const bounds = event.currentTarget.parentElement.getBoundingClientRect();
                        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
                        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
                        event.currentTarget.style.transformOrigin = `${x}% ${y}%`;
                      }}
                      onPointerEnter={event => {
                        if (event.pointerType === 'mouse') setIsGalleryZoomed(true);
                      }}
                      onPointerLeave={event => {
                        if (event.pointerType === 'mouse') setIsGalleryZoomed(false);
                      }}
                      onClick={() => {
                        setIsGalleryZoomed(false);
                        setIsLightboxOpen(true);
                      }}
                      className={`h-full w-full cursor-zoom-in object-cover object-center transition-transform duration-300 ease-out ${isGalleryZoomed ? 'scale-[1.8]' : 'scale-100'}`}
                    />
                  </Motion.div>
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[#D4AF37]">
                  <Layers size={52} aria-hidden="true" />
                </div>
              )}

              {comboImages.length > 1 && (
                <>
                  <button type="button" onClick={() => showAdjacentImage(-1)} aria-label="Previous combo image" className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#D4AF37]/30 bg-[#171813]/90 p-2.5 text-[#FCE096] shadow-lg transition hover:bg-[#D4AF37] hover:text-[#14291F] sm:left-4 sm:p-3">
                    <ChevronLeft size={20} />
                  </button>
                  <button type="button" onClick={() => showAdjacentImage(1)} aria-label="Next combo image" className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#D4AF37]/30 bg-[#171813]/90 p-2.5 text-[#FCE096] shadow-lg transition hover:bg-[#D4AF37] hover:text-[#14291F] sm:right-4 sm:p-3">
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full border border-[#D4AF37]/30 bg-[#171813]/90 px-3 py-2 shadow-sm backdrop-blur">
                    {comboImages.map((url, index) => (
                      <button key={url} type="button" onClick={() => setActiveImageIndex(index)} aria-label={`Show combo image ${index + 1}`} aria-current={index === activeImageIndex} className={`h-2 rounded-full transition-all ${index === activeImageIndex ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/20 hover:bg-white/40'}`} />
                    ))}
                  </div>
                </>
              )}

              <span className="absolute left-3 top-3 z-10 rounded-full border border-[#D4AF37]/45 bg-[#102219]/90 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[#FCE096] sm:left-6 sm:top-6">
                Combo
              </span>
              <button
                type="button"
                onClick={() => toggleWishlist(catalogProduct)}
                aria-label={isWishlisted(catalogProduct) ? 'Remove from saved products' : 'Save combo'}
                aria-pressed={isWishlisted(catalogProduct)}
                className={`absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border transition-all sm:right-6 sm:top-6 sm:h-12 sm:w-12 ${
                  isWishlisted(catalogProduct)
                    ? 'border-[#D4AF37] bg-[#D4AF37] text-[#14291F]'
                    : 'border-[#D4AF37]/30 bg-[#171813]/80 text-[#DFD7C4] hover:border-[#D4AF37] hover:text-[#FCE096]'
                }`}
              >
                <Heart size={18} fill={isWishlisted(catalogProduct) ? 'currentColor' : 'none'} />
              </button>
              {activeImageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setIsGalleryZoomed(false);
                    setIsLightboxOpen(true);
                  }}
                  aria-label="Open combo image zoom"
                  className="absolute bottom-4 right-4 z-20 rounded-full border border-[#d4af37]/35 bg-[#0d1d15]/90 px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#f4d98a] shadow-lg transition hover:border-[#d4af37]/70 hover:bg-[#173323] sm:bottom-5 sm:right-5"
                >
                  Click to zoom
                </button>
              )}
            </div>
          </div>

          <aside className="relative flex flex-col rounded-[1.75rem] border border-[#d4af37]/25 bg-[linear-gradient(145deg,rgba(26,52,39,0.96),rgba(15,29,21,0.96))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-7 lg:col-span-5 lg:p-8">
            <div className="mb-6 border-b border-[#d4af37]/20 pb-6 sm:mb-7 sm:pb-7">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#102219]/70 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#f4d98a]">
                  <Layers size={12} /> Curated combo
                </span>
                {catalogProduct.sku && <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#aebdb1]">{catalogProduct.sku}</span>}
              </div>

              <h1 className="mb-3 break-words font-serif font-medium text-[2rem] leading-[1.08] tracking-[-0.035em] text-[#fffaf0] [overflow-wrap:anywhere] sm:text-4xl md:text-[3.35rem]">
                {catalogProduct.name}
              </h1>

              {reviewSummary.total > 0 && (
                <button type="button" onClick={() => setActiveTab('reviews')} className="mb-4 inline-flex min-h-9 items-center gap-2 text-xs text-[#d7dfd7] hover:text-[#FCE096] sm:text-sm">
                  <span className="flex text-[#D4AF37]" aria-label={`${Number(reviewSummary.average).toFixed(1)} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={13} fill={star <= Math.round(Number(reviewSummary.average)) ? 'currentColor' : 'none'} />)}
                  </span>
                  <span>{Number(reviewSummary.average).toFixed(1)} · {reviewSummary.total} reviews</span>
                </button>
              )}

              <div className="mb-5 flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-serif text-4xl font-semibold tracking-tight text-[#f2d783] sm:text-[2.8rem]">₹{money(comboPrice)}</span>
                  {regularPrice > comboPrice && <span className="text-base font-medium text-[#9bb0a5] line-through sm:text-lg">₹{money(regularPrice)}</span>}
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#9eafa2]">One clear price · {comboItems.length} products together</span>
                {regularPrice > comboPrice && (
                  <span className="mt-1 inline-flex w-fit rounded-md border border-emerald-500/30 bg-emerald-950/50 px-2.5 py-1 text-xs font-bold text-emerald-300">
                    You save ₹{money(regularPrice - comboPrice)}
                  </span>
                )}
              </div>

              {description && <p className="break-words text-sm leading-6 text-[#d7dfd7] [overflow-wrap:anywhere]">{description}</p>}
            </div>

            <div className="product-detail-translucent relative mb-6 rounded-2xl border border-[#d4af37]/25 bg-[#0d1d15]/75 p-4 shadow-xl sm:p-6 md:mb-7 md:rounded-3xl md:p-7">
              <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
                <span className={`inline-flex min-h-8 items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.12em] sm:text-[10px] sm:tracking-widest ${comboIsAvailable ? 'border border-emerald-300/25 bg-emerald-950/40 text-emerald-100' : 'border border-red-500/40 bg-red-950/60 text-red-300'}`}>
                  <Layers size={16} /> {comboIsAvailable ? 'Available' : 'Currently unavailable'}
                </span>
                <span className="shrink-0 text-[10px] font-medium text-[#b8c5bb]">Secure checkout</span>
              </div>

              <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-[#d4af37]/25 bg-[#0d1d15]/75 px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 text-[#e7ca78]"><Layers size={16} /></span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#e9d79d]">Complete combo</p>
                    <p className="mt-0.5 text-[10px] text-[#aebdb1]">One set includes {comboItems.length} products</p>
                  </div>
                </div>
                <span className="min-w-8 text-right font-serif text-2xl font-semibold tabular-nums text-[#fff8e9]" aria-live="polite">
                  {availableStock}
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-[#171813] px-2 sm:h-auto sm:w-32">
                  <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity(value => Math.max(1, value - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg text-[#DFD7C4] transition-colors hover:bg-white/10 hover:text-[#FCE096] disabled:opacity-40"><Minus size={16} /></button>
                  <span aria-live="polite" className="w-8 text-center font-mono text-base text-white">{quantity}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(value => Math.min(10, availableStock, value + 1))} disabled={quantity >= Math.min(10, availableStock)} className="flex h-10 w-10 items-center justify-center rounded-lg text-[#DFD7C4] transition-colors hover:bg-white/10 hover:text-[#FCE096] disabled:opacity-40"><Plus size={16} /></button>
                </div>
                <button
                  ref={addToBagButtonRef}
                  type="button"
                  onClick={handleAddToBag}
                  disabled={adding || !comboIsAvailable}
                  className="btn-gold-luxury relative flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-[10px] font-bold uppercase tracking-[0.08em] shadow-xl transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-14 sm:px-4 sm:text-xs sm:tracking-widest"
                >
                  <ShoppingBag size={16} />
                  {adding ? 'Adding combo…' : comboIsAvailable ? 'Add combo to bag' : 'Currently unavailable'}
                </button>
              </div>
              <ProductDeliveryPromise isOutOfStock={!comboIsAvailable} />
              {!hasValidComboItems && <p role="alert" className="mt-3 text-sm text-rose-300">One or more combo products could not be verified in the active catalog.</p>}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { title: 'Product support', text: 'Help with your combo', to: '/contact' },
                { title: 'Care beyond the product', text: 'See the public field ledger', to: '/impact' },
              ].map(item => (
                <Link key={item.title} to={item.to} className="group rounded-2xl border border-[#d4af37]/25 bg-[#0c1a12]/70 p-4 transition hover:border-[#d4af37]/60">
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-white">{item.title}</h2>
                  <p className="mt-1 text-[10px] leading-4 text-[#94a3b8] sm:text-xs">{item.text}</p>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section id="combo-information" className="relative z-10 mx-auto mt-10 max-w-7xl px-4 md:mt-16 md:px-6">
          <div className="no-scrollbar relative mb-6 flex overflow-x-auto border-b border-[#d4af37]/20 sm:mb-8">
            {['overview', 'contents', 'qa', 'reviews'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative min-h-12 shrink-0 whitespace-nowrap px-4 pb-3 text-[10px] font-mono uppercase tracking-wider transition-colors sm:px-8 sm:pb-6 sm:text-xs sm:tracking-widest ${activeTab === tab ? 'text-[#fce096]' : 'text-[#94a3b8] hover:text-[#fce096]'}`}
              >
                {tab === 'contents'
                  ? `In this combo (${comboItems.length})`
                  : tab === 'qa'
                    ? 'Product Q&A'
                    : tab === 'reviews'
                      ? `Reviews (${reviewSummary.total})`
                      : 'Overview'}
                {activeTab === tab && <Motion.div layoutId="activeComboTabIndicator" className="absolute bottom-0 left-0 h-0.5 w-full bg-[#d4af37]" />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <Motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                <article className="min-w-0 rounded-3xl border border-[#d4af37]/25 bg-[linear-gradient(145deg,rgba(26,52,39,0.82),rgba(15,29,21,0.9))] p-5 backdrop-blur-xl sm:p-8">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#d9bf6e]">Combo overview</p>
                  <h2 className="mt-2 break-words font-serif text-2xl leading-tight text-[#fff9ed] sm:text-3xl">{catalogProduct.name}</h2>
                  <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-[#d4ddd5] [overflow-wrap:anywhere]">
                    {description || 'Explore the products selected for this combo.'}
                  </p>
                  <div className="mt-6 border-t border-[#d4af37]/20 pt-5">
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#d9bf6e]">Products in this combo</p>
                    <ul className="mt-3 divide-y divide-white/10">
                      {comboItems.map((item, index) => (
                        <li key={`${item.id ?? item.slug ?? item.name}-${index}`} className="flex items-start justify-between gap-3 py-3 text-sm">
                          <div className="min-w-0">
                            {item.slug ? <Link to={`/product/${item.slug}`} className="font-semibold text-white hover:text-[#FCE096]">{item.name}</Link> : <span className="font-semibold text-white">{item.name}</span>}
                            {!item.catalogMatch && <p className="mt-1 text-xs text-rose-300">This product is no longer active.</p>}
                          </div>
                          <span className="shrink-0 font-mono text-xs text-[#FCE096]">₹{money(Number(item.discount_price) > 0 ? item.discount_price : item.price)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
                <aside className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {[
                    ['Products included', `${comboItems.length} current catalog products`],
                    ['Combo price', `₹${money(comboPrice)}`],
                    ['Availability', comboIsAvailable ? `${availableStock} available` : 'Currently unavailable'],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0 rounded-2xl border border-white/10 bg-[#0c1a12]/70 p-4 backdrop-blur-lg sm:p-5">
                      <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#d9bf6e]">{label}</p>
                      <p className="mt-2 break-words text-xs leading-5 text-[#edf0e9] [overflow-wrap:anywhere]">{value}</p>
                    </div>
                  ))}
                </aside>
              </Motion.div>
            )}

            {activeTab === 'contents' && (
              <Motion.div key="contents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-4 md:grid-cols-2">
                {comboItems.map((item, index) => {
                  const imageUrl = [
                    item.images,
                    item.image_url,
                    item.image,
                  ].map(getProductImageUrl).find(Boolean);
                  return (
                    <article key={`${item.id ?? item.slug ?? item.name}-${index}`} className="flex min-w-0 gap-4 rounded-2xl border border-[#244A38] bg-[#102219]/80 p-4 sm:p-5">
                      {imageUrl ? (
                        <img src={imageUrl} alt="" loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-20 w-20 shrink-0 rounded-xl border border-white/10 bg-[#070a0e] object-cover sm:h-24 sm:w-24" />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-[#d4af37] sm:h-24 sm:w-24"><Layers size={24} /></div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          {item.slug ? <Link to={`/product/${item.slug}`} className="break-words font-semibold text-white hover:text-[#FCE096]">{item.name}</Link> : <h2 className="break-words font-semibold text-white">{item.name}</h2>}
                          <span className="shrink-0 font-mono text-xs text-[#FCE096]">₹{money(Number(item.discount_price) > 0 ? item.discount_price : item.price)}</span>
                        </div>
                        {item.componentQuantity > 1 && <p className="mt-1 text-xs text-[#9BB0A5]">Quantity: {item.componentQuantity}</p>}
                        {(item.short_description || item.description) && <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#9BB0A5]">{item.short_description || item.description}</p>}
                        {!item.catalogMatch && <p className="mt-2 text-xs text-rose-300">This product is no longer active.</p>}
                        {item.catalogMatch && <CheckCircle2 size={15} className="mt-2 text-[#D4AF37]" aria-label="Verified combo product" />}
                      </div>
                    </article>
                  );
                })}
              </Motion.div>
            )}

            {activeTab === 'qa' && (
              <Motion.div key="qa" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-5xl">
                <QASection productId={catalogProduct.id} product={catalogProduct} />
              </Motion.div>
            )}

            {activeTab === 'reviews' && (
              <Motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-5xl scroll-mt-28">
                <div className="product-detail-translucent mb-8 grid gap-6 rounded-3xl border border-[#d4af37]/40 bg-[#102219]/80 p-6 shadow-xl md:grid-cols-[auto_1fr] md:items-center md:p-8">
                  <div className="text-center md:min-w-32">
                    <div className="font-serif text-5xl font-bold text-[#fce096]">{reviewSummary.total ? Number(reviewSummary.average).toFixed(1) : '—'}</div>
                    <div className="mt-2 flex justify-center text-[#d4af37]" aria-label={`${Number(reviewSummary.average).toFixed(1)} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill={star <= Math.round(Number(reviewSummary.average)) ? 'currentColor' : 'none'} />)}
                    </div>
                    <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-[#94a3b8]">{reviewSummary.total} approved reviews</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Customer feedback</p>
                    <p className="mt-1 text-xs leading-5 text-[#cbd5e1]">Reviews currently approved for this combo.</p>
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4af37]">From our customers</p><h2 className="mt-1 font-serif text-2xl text-white">Combo reviews</h2></div>
                  {comboReviews.length > 0 && (
                    <select value={ratingFilter} onChange={event => setRatingFilter(event.target.value)} aria-label="Filter combo reviews by rating" className="rounded-lg border border-[#d4af37]/30 bg-[#070a0e] px-3 py-2 text-xs text-[#fce096] outline-none">
                      <option value="all">All ratings ({comboReviews.length})</option>
                      {[5, 4, 3, 2, 1].map(rating => <option key={rating} value={rating}>{rating} stars</option>)}
                    </select>
                  )}
                </div>
                {reviewLoadError ? (
                  <p role="alert" className="mt-5 text-sm text-rose-300">{reviewLoadError}</p>
                ) : filteredComboReviews.length ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredComboReviews.slice(0, visibleCount).map(review => (
                        <article key={review.id} className="rounded-2xl border border-[#244A38] bg-[#081b15]/70 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-white">{review.user_name || review.reviewer_name}</p>
                              {review.reviewer_location && <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#9BB0A5]"><MapPin size={10} className="text-[#D4AF37]" /> {review.reviewer_location}</p>}
                            </div>
                            <span className="inline-flex shrink-0 items-center gap-1 text-xs text-[#FCE096]"><Star size={12} fill="currentColor" /> {review.rating}/5</span>
                          </div>
                          {review.title && <h3 className="mt-2 text-sm font-bold text-white">{review.title}</h3>}
                          <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#DFD7C4]">{review.body || review.comment}</p>
                          {review.created_at && <time className="mt-3 block text-[11px] text-[#9BB0A5]" dateTime={review.created_at}>{new Date(review.created_at).toLocaleDateString()}</time>}
                        </article>
                      ))}
                    </div>
                    {visibleCount < filteredComboReviews.length && (
                      <div className="mt-6 text-center">
                        <button type="button" onClick={() => setVisibleCount(count => count + 24)} className="btn-silver-luxury rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FCE096]">
                          Show more combo reviews ({filteredComboReviews.length - visibleCount} remaining)
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="mt-5 text-sm text-[#9BB0A5]">{reviewLoadError || (comboReviews.length ? 'No reviews match this filter.' : 'No approved reviews are currently recorded for this combo.')}</p>
                )}
              </Motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <AnimatePresence>
        {isLightboxOpen && activeImageUrl && (
          <Motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden overscroll-contain bg-[#07130d]/95 p-3 backdrop-blur-md [touch-action:none] sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`${catalogProduct.name} image viewer`}
          >
            <button type="button" onClick={() => setIsLightboxOpen(false)} aria-label="Close image viewer" className="absolute right-4 top-4 z-10 rounded-full border border-[#d4af37]/35 bg-[#102219] p-3 text-[#f4d98a] transition hover:bg-[#1c382b] sm:right-7 sm:top-7">
              <X size={20} />
            </button>
            {comboImages.length > 1 && (
              <>
                <button type="button" onClick={event => { event.stopPropagation(); showAdjacentImage(-1); }} aria-label="Previous combo image" className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#d4af37]/35 bg-[#102219]/90 p-3 text-[#f4d98a] transition hover:bg-[#1c382b] sm:left-7"><ChevronLeft size={22} /></button>
                <button type="button" onClick={event => { event.stopPropagation(); showAdjacentImage(1); }} aria-label="Next combo image" className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#d4af37]/35 bg-[#102219]/90 p-3 text-[#f4d98a] transition hover:bg-[#1c382b] sm:right-7"><ChevronRight size={22} /></button>
              </>
            )}
            <Motion.img
              key={activeImageUrl}
              src={activeImageUrl}
              alt={`${catalogProduct.name} enlarged`}
              onClick={event => {
                event.stopPropagation();
                setLightboxZoom(value => value === 1 ? 1.6 : 1);
              }}
              className="absolute left-1/2 top-1/2 max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 cursor-zoom-in select-none object-contain"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: lightboxZoom }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#102219]/95 p-1.5 shadow-xl">
              <button type="button" onClick={event => { event.stopPropagation(); setLightboxZoom(value => Math.max(1, Number((value - 0.25).toFixed(2)))); }} aria-label="Zoom out" disabled={lightboxZoom <= 1} className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-[#f4d98a] hover:bg-white/10 disabled:opacity-40">−</button>
              <button type="button" onClick={event => { event.stopPropagation(); setLightboxZoom(1); }} aria-label="Reset image zoom" className="min-w-16 px-2 font-mono text-[9px] font-bold uppercase tracking-wider text-[#c5d0c8]">{lightboxZoom === 1 ? 'Fit' : `${Math.round(lightboxZoom * 100)}%`}</button>
              <button type="button" onClick={event => { event.stopPropagation(); setLightboxZoom(value => Math.min(2.5, Number((value + 0.25).toFixed(2)))); }} aria-label="Zoom in" disabled={lightboxZoom >= 2.5} className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-[#f4d98a] hover:bg-white/10 disabled:opacity-40">+</button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {!purchaseButtonVisible && comboIsAvailable && !isLightboxOpen && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 px-3 pb-1 md:bottom-0 md:pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
          <div className="pointer-events-auto mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-[#d4af37]/40 bg-[#102219]/95 p-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:gap-4 sm:p-3 md:max-w-4xl">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#d4af37]/30 bg-[#070a0e] text-[#d4af37] sm:h-12 sm:w-12">
              {activeImageUrl ? <img src={activeImageUrl} alt="" className="h-full w-full object-contain" /> : <Layers size={18} />}
            </div>
            <div className="min-w-0 flex-1 md:flex md:items-center md:gap-4">
              <h2 className="truncate text-xs font-medium text-white sm:text-sm">{catalogProduct.name}</h2>
              <p className="font-serif text-sm font-bold text-[#fce096] md:text-base">₹{money(comboPrice)}</p>
            </div>
            <button
              type="button"
              onClick={handleAddToBag}
              disabled={adding || !comboIsAvailable}
              className="btn-gold-luxury flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-[10px] font-bold uppercase tracking-wider text-white transition disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-xs"
            >
              <ShoppingBag size={15} /> {adding ? 'Adding…' : 'Add combo to bag'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
