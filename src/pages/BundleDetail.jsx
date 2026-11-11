import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Layers, MapPin, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { products as productsApi, reviews as reviewsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import {
  getComboPrice,
  isComboProduct,
  resolveComboItems,
} from '../utils/comboProducts';

const money = value => Number(value || 0).toLocaleString('en-IN', {
  maximumFractionDigits: 2,
});

export default function BundleDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
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

  const comboItems = resolveComboItems(catalogProduct, catalogProducts);
  const comboPrice = getComboPrice(catalogProduct);
  const regularPrice = Number(catalogProduct?.price) || 0;
  const availableStock = Math.max(0, Number(catalogProduct?.quantity) || 0);
  const hasValidComboItems = comboItems.length > 0 &&
    comboItems.every(item => item.catalogMatch && item.id != null && item.slug);
  const comboIsAvailable = hasValidComboItems &&
    availableStock > 0;

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

  return (
    <main className="min-h-screen bg-[#081b15] px-4 pb-24 pt-28 text-[#FAF7F2] sm:px-6">
      <SEO
        title={`${catalogProduct.name} | Bhumivera`}
        description={catalogProduct.description || catalogProduct.meta_description || ''}
        route={`/combo/${catalogProduct.slug}`}
      />
      <div className="mx-auto max-w-6xl">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-[#DFD7C4] hover:text-[#FCE096]">
          <ArrowLeft size={16} /> Back to collection
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-3xl border border-[#D4AF37]/35 bg-[#102219] p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#D4AF37]/45 bg-[#D4AF37]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#FCE096]">
                {catalogProduct.sku || 'Combo'}
              </span>
            </div>
            <div className="mt-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#081b15] text-[#FCE096]">
              <Layers size={30} />
            </div>
            <h1 className="mt-6 max-w-3xl font-serif text-3xl font-bold leading-tight sm:text-5xl">{catalogProduct.name}</h1>
            {catalogProduct.description && (
              <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-[#DFD7C4] sm:text-base">
                {catalogProduct.description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              {reviewSummary.total > 0 && (
                <>
                  <span className="inline-flex items-center gap-1.5 text-[#FCE096]"><Star size={16} fill="currentColor" /> {reviewSummary.average}</span>
                  <span className="text-[#9BB0A5]">{reviewSummary.total} combo reviews</span>
                </>
              )}
            </div>
            <div className="mt-8 border-t border-[#244A38] pt-6">
              <h2 className="font-serif text-xl font-bold text-white">Products in this combo</h2>
              <ul className="mt-4 space-y-4">
                {comboItems.map((item, index) => (
                  <li key={`${item.id ?? item.slug ?? item.name}-${index}`} className="flex items-start gap-3 rounded-2xl border border-[#244A38] bg-[#081b15]/70 p-4">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                    <div className="min-w-0 flex-1">
                      {item.slug ? (
                        <Link to={`/product/${item.slug}`} className="font-semibold text-white hover:text-[#FCE096]">{item.name}</Link>
                      ) : (
                        <p className="font-semibold text-white">{item.name}</p>
                      )}
                      {item.componentQuantity > 1 && (
                        <p className="mt-1 text-xs text-[#9BB0A5]">Quantity: {item.componentQuantity}</p>
                      )}
                      {(item.short_description || item.description) && (
                        <p className="mt-1 text-xs leading-5 text-[#9BB0A5]">{item.short_description || item.description}</p>
                      )}
                      {!item.catalogMatch && <p className="mt-1 text-xs text-rose-300">This product is no longer active.</p>}
                    </div>
                    <span className="shrink-0 font-mono text-xs text-[#FCE096]">
                      ₹{money(Number(item.discount_price) > 0 ? item.discount_price : item.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-[#D4AF37]/35 bg-[#102219] p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9BB0A5]">Combo · {comboItems.length} products</p>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-serif text-4xl font-bold text-[#FCE096]">₹{money(comboPrice)}</span>
              {regularPrice > comboPrice && (
                <span className="text-sm text-[#9BB0A5] line-through">₹{money(regularPrice)}</span>
              )}
            </div>
            {regularPrice > comboPrice && (
              <p className="mt-2 inline-flex rounded-md border border-emerald-500/30 bg-emerald-950/50 px-2.5 py-1 text-xs font-bold text-emerald-300">
                You save ₹{money(regularPrice - comboPrice)}
              </p>
            )}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity(value => Math.max(1, value - 1))}
                className="rounded-lg border border-slate-700 p-2 text-white disabled:opacity-40"
              ><Minus size={16} /></button>
              <span className="min-w-8 text-center font-bold">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= Math.min(10, availableStock)}
                onClick={() => setQuantity(value => Math.min(10, availableStock, value + 1))}
                className="rounded-lg border border-slate-700 p-2 text-white disabled:opacity-40"
              ><Plus size={16} /></button>
              {availableStock > 0 && <span className="text-xs text-[#9BB0A5]">{availableStock} available</span>}
            </div>
            <button
              type="button"
              onClick={handleAddToBag}
              disabled={adding || !comboIsAvailable}
              className="btn-gold-luxury mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-xs font-bold uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag size={16} />
              {adding ? 'Adding combo…' : comboIsAvailable ? 'Add combo to bag' : 'Currently unavailable'}
            </button>
            {!hasValidComboItems && (
              <p role="alert" className="mt-3 text-sm text-rose-300">
                One or more combo products could not be verified in the active catalog.
              </p>
            )}
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-[#244A38] bg-[#102219] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Customer feedback</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-white">Combo reviews ({filteredComboReviews.length})</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {reviewSummary.total > 0 && (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#FCE096]">
                  <Star size={15} fill="currentColor" /> {reviewSummary.average} · {reviewSummary.total}
                </span>
              )}
              {comboReviews.length > 0 && (
                <select
                  value={ratingFilter}
                  onChange={e => setRatingFilter(e.target.value)}
                  aria-label="Filter combo reviews by rating"
                  className="rounded-lg border border-[#D4AF37]/30 bg-[#081b15] px-3 py-1.5 text-xs text-[#FCE096] outline-none"
                >
                  <option value="all">All ratings ({comboReviews.length})</option>
                  {[5, 4, 3, 2, 1].map(r => (
                    <option key={r} value={r}>{r} stars</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          {reviewLoadError ? (
            <p role="alert" className="mt-5 text-sm text-rose-300">{reviewLoadError}</p>
          ) : filteredComboReviews.length ? (
            <>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {filteredComboReviews.slice(0, visibleCount).map(review => (
                  <article key={review.id} className="rounded-2xl border border-[#244A38] bg-[#081b15]/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{review.user_name || review.reviewer_name}</p>
                        {review.reviewer_location && (
                          <p className="flex items-center gap-1 text-[11px] text-[#9BB0A5] mt-0.5">
                            <MapPin size={10} className="text-[#D4AF37]" /> {review.reviewer_location}
                          </p>
                        )}
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs text-[#FCE096]">
                        <Star size={12} fill="currentColor" /> {review.rating}/5
                      </span>
                    </div>
                    {review.title && <h3 className="mt-2 text-sm font-bold text-white">{review.title}</h3>}
                    <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#DFD7C4]">{review.body || review.comment}</p>
                    {review.created_at && (
                      <time className="mt-3 block text-[11px] text-[#9BB0A5]" dateTime={review.created_at}>
                        {new Date(review.created_at).toLocaleDateString()}
                      </time>
                    )}
                  </article>
                ))}
              </div>
              {visibleCount < filteredComboReviews.length && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount(c => c + 24)}
                    className="btn-silver-luxury rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FCE096]"
                  >
                    Show more combo reviews ({filteredComboReviews.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="mt-5 text-sm text-[#9BB0A5]">No approved reviews are currently recorded for this combo.</p>
          )}
        </section>
      </div>
    </main>
  );
}
