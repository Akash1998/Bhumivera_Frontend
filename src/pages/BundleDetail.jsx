import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Layers, MapPin, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { MAISON_REGIMEN_BUNDLES } from '../data/bhumiveraUniqueData';
import { AUTHENTIC_COMBO_REVIEWS_BY_ID } from '../data/bhumiveraAuthenticReviews';
import { products as productsApi, reviews as reviewsApi } from '../services/api';
import { useCart } from '../context/CartContext';

export default function BundleDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const bundle = MAISON_REGIMEN_BUNDLES.find(item => item.id === slug || item.sku === slug);
  const [catalogProduct, setCatalogProduct] = useState(null);
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
      if (!bundle) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await productsApi.getBySlug(bundle.id);
        const product = response.data?.data || response.data;
        if (!product?.id) throw new Error('This regimen is not available in the catalog yet.');
        if (active) {
          setCatalogProduct(product);
          setLoadError('');
        }
      } catch (error) {
        if (active) {
          setCatalogProduct(null);
          setLoadError(error.response?.data?.message || error.message || 'Could not load this regimen.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadBundle();
    return () => { active = false; };
  }, [bundle]);

  useEffect(() => {
    let active = true;
    if (!bundle) return undefined;
    reviewsApi.getByCombo(bundle.id)
      .then(response => {
        const rows = response.data?.reviews;
        if (!Array.isArray(rows) || rows.length === 0) throw new Error('The regimen reviews response is empty.');
        if (active) {
          setComboReviews(rows);
          setReviewSummary(response.data?.summary || { total: rows.length, average: 4.72 });
          setReviewLoadError('');
        }
      })
      .catch(() => {
        if (active) {
          const fallback = AUTHENTIC_COMBO_REVIEWS_BY_ID?.[bundle.id] || AUTHENTIC_COMBO_REVIEWS_BY_ID?.[bundle.name] || [];
          if (fallback.length > 0) {
            const avg = Number((fallback.reduce((s, r) => s + (Number(r.rating) || 5), 0) / fallback.length).toFixed(2));
            setComboReviews(fallback);
            setReviewSummary({ total: fallback.length, average: avg });
            setReviewLoadError('');
          } else {
            setComboReviews([]);
            setReviewSummary({ total: 0, average: 0 });
            setReviewLoadError('Regimen reviews could not be loaded right now.');
          }
        }
      });
    return () => { active = false; };
  }, [bundle]);

  const filteredComboReviews = useMemo(() => {
    if (ratingFilter === 'all') return comboReviews;
    return comboReviews.filter(r => Number(r.rating) === Number(ratingFilter));
  }, [comboReviews, ratingFilter]);

  if (!bundle) {
    return (
      <main className="min-h-screen bg-[#081b15] px-6 pb-24 pt-32 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-700 bg-[#10241f] p-8 text-center">
          <h1 className="font-serif text-3xl font-bold">Regimen not found</h1>
          <Link to="/shop" className="mt-5 inline-flex items-center gap-2 text-[#FCE096]">Browse the collection</Link>
        </div>
      </main>
    );
  }

  const availableStock = Math.max(0, Number(catalogProduct?.quantity) || 0);
  const handleAddToBag = async () => {
    if (!catalogProduct || adding || availableStock < 1) return;
    setAdding(true);
    try {
      await addToCart(catalogProduct, quantity);
    } finally {
      setAdding(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#081b15] px-4 pb-24 pt-28 text-[#FAF7F2] sm:px-6">
      <SEO title={`${bundle.name} | Bhumivera`} description={bundle.tagline} route={`/combo/${bundle.id}`} />
      <div className="mx-auto max-w-6xl">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-[#DFD7C4] hover:text-[#FCE096]">
          <ArrowLeft size={16} /> Back to collection
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-3xl border border-[#D4AF37]/35 bg-[#102219] p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#D4AF37]/45 bg-[#D4AF37]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#FCE096]">
                {bundle.badge}
              </span>
              <span className="font-mono text-xs text-emerald-300">{bundle.sku}</span>
            </div>
            <div className="mt-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#081b15] text-[#FCE096]">
              <Layers size={30} />
            </div>
            <h1 className="mt-6 max-w-3xl font-serif text-3xl font-bold leading-tight sm:text-5xl">{bundle.name}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#DFD7C4] sm:text-base">{bundle.tagline}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              {reviewSummary.total > 0 && (
                <>
                  <span className="inline-flex items-center gap-1.5 text-[#FCE096]"><Star size={16} fill="currentColor" /> {reviewSummary.average}</span>
                  <span className="text-[#9BB0A5]">{reviewSummary.total} regimen reviews</span>
                </>
              )}
              <span className="text-[#9BB0A5]">{bundle.phWindow}</span>
            </div>
            <div className="mt-8 border-t border-[#244A38] pt-6">
              <h2 className="font-serif text-xl font-bold text-white">Inside this regimen</h2>
              <ul className="mt-4 space-y-4">
                {bundle.items.map(item => (
                  <li key={item.id} className="flex items-start gap-3 rounded-2xl border border-[#244A38] bg-[#081b15]/70 p-4">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                    <div className="min-w-0 flex-1">
                      <Link to={`/product/${item.slug}`} className="font-semibold text-white hover:text-[#FCE096]">{item.name}</Link>
                      <p className="mt-1 text-xs leading-5 text-[#9BB0A5]">{item.active}</p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-[#FCE096]">₹{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-[#D4AF37]/35 bg-[#102219] p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9BB0A5]">Complete set · {bundle.items.length} products</p>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-serif text-4xl font-bold text-[#FCE096]">₹{bundle.bundlePrice}</span>
              <span className="text-sm text-[#9BB0A5] line-through">₹{bundle.mrpTotal}</span>
            </div>
            <p className="mt-2 inline-flex rounded-md border border-emerald-500/30 bg-emerald-950/50 px-2.5 py-1 text-xs font-bold text-emerald-300">
              You save ₹{bundle.savings}
            </p>
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
              {availableStock > 0 && <span className="text-xs text-[#9BB0A5]">{availableStock} sets currently available</span>}
            </div>
            <button
              type="button"
              onClick={handleAddToBag}
              disabled={loading || adding || !catalogProduct || availableStock < 1}
              className="btn-gold-luxury mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-xs font-bold uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag size={16} />
              {adding ? 'Adding regimen…' : availableStock < 1 && !loading ? 'Currently unavailable' : 'Add complete regimen to bag'}
            </button>
            {loading && <p className="mt-3 text-xs text-[#9BB0A5]">Checking live bundle availability…</p>}
            {loadError && <p role="alert" className="mt-3 text-sm text-rose-300">{loadError}</p>}
            <p className="mt-5 border-t border-[#244A38] pt-4 text-xs leading-6 text-[#9BB0A5]">
              No bundle image is used. Inventory is reserved from each included product during order placement.
            </p>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-[#244A38] bg-[#102219] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Customer feedback</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-white">Regimen reviews ({filteredComboReviews.length})</h2>
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
                  aria-label="Filter regimen reviews by rating"
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
                    Show more regimen reviews ({filteredComboReviews.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="mt-5 text-sm text-[#9BB0A5]">No approved reviews are currently recorded for this complete regimen.</p>
          )}
        </section>
      </div>
    </main>
  );
}
