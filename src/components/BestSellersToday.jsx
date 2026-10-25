import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products as productsApi, scarcitySimulator } from '../services/api';
import { getProductImageUrl } from '../utils/productImageUrl';
import { FALLBACK_CATALOG_PRODUCTS } from '../data/bhumiveraUniqueData';
import useScarcitySimulator from '../hooks/useScarcitySimulator';
import ScarcitySimulationBadge from './ScarcitySimulationBadge';

const getRows = response => {
  const data = response?.data?.data || response?.data?.products || response?.data || [];
  return Array.isArray(data) ? data : [];
};

export default function BestSellersToday() {
  const [catalog, setCatalog] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([productsApi.getAllActive(), scarcitySimulator.getPopularToday()])
      .then(([catalogResponse, bestsellerResponse]) => {
        if (!active) return;
        setCatalog(getRows(catalogResponse));
        const data = bestsellerResponse.data?.products;
        if (!Array.isArray(data)) throw new Error('Order popularity response was invalid.');
        setBestsellers(data);
      })
      .catch(loadError => {
        console.error('[HOME_TODAYS_BESTSELLERS]', loadError);
        if (active) setError('Today’s verified order highlights are temporarily unavailable.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const rankedProducts = useMemo(() => {
    const productsById = new Map(catalog.map(product => [String(product.id || product._id), product]));
    return bestsellers
      .map(item => {
        const product = productsById.get(String(item.id));
        return product || null;
      })
      .filter(Boolean)
      .slice(0, 4);
  }, [catalog, bestsellers]);

  const displayProducts = rankedProducts.length
    ? rankedProducts
    : catalog.filter(product => product && (product.id || product._id)).slice(0, 4);
  const ids = displayProducts.map(product => product.id || product._id);
  const {
    products: simulations,
    enabled: simulatorEnabled,
    sampleActivityEnabled,
    error: simulatorError,
  } = useScarcitySimulator(ids);

  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-10 sm:py-12" aria-labelledby="todays-order-highlights">
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#D4AF37] sm:gap-2 sm:text-[10px] sm:tracking-[0.2em]">
            <ShoppingBag size={14} aria-hidden="true" />
            {rankedProducts.length ? "Today's customer favourites" : 'Explore the collection'}
          </p>
          <h2 id="todays-order-highlights" className="mt-1 font-serif text-xl font-bold leading-tight text-[#FAF7F2] sm:mt-2 sm:text-4xl">
            {rankedProducts.length ? 'Going fast today' : 'Find your daily botanical ritual'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#DFD7C4] sm:mt-2 sm:text-sm">
            {rankedProducts.length
              ? 'Today’s most-ordered favourites. Shop now while your pick is still in stock.'
              : error || (loading
                ? 'Loading today’s verified order highlights.'
                : 'No eligible orders have been recorded today yet. Browse the collection without invented popularity claims.')}
          </p>
        </div>
        <Link to="/shop" className="inline-flex min-h-8 items-center gap-1.5 self-start text-[10px] font-bold uppercase tracking-widest text-[#FCE096] hover:text-white sm:min-h-10 sm:gap-2 sm:text-xs sm:self-auto">
          View all products <ArrowRight size={13} />
        </Link>
      </div>

      {error && !loading && (
        <p role="status" className="mb-4 rounded-lg border border-amber-300/25 bg-amber-950/20 px-4 py-3 text-xs text-amber-100">
          {error}
        </p>
      )}
      {simulatorError && (
        <p role="status" className="mb-4 rounded-lg border border-amber-300/25 bg-amber-950/20 px-4 py-3 text-xs text-amber-100">
          {simulatorError} Actual availability is still checked by the store.
        </p>
      )}

      {displayProducts.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
          {displayProducts.map((product, index) => {
            const id = product.id || product._id;
            const simulation = simulations[String(id)];
            const simulatedUnitsSoldToday = Number(
              simulation?.simulatedSoldToday ?? simulation?.soldToday
            ) || 0;
            const image = getProductImageUrl(product.image_url || product.images || product.image) ||
              FALLBACK_CATALOG_PRODUCTS[index % FALLBACK_CATALOG_PRODUCTS.length].image_url;
            const hasKnownStock = product.quantity !== null &&
              product.quantity !== undefined &&
              product.quantity !== '';
            const stockQuantity = Number(product.quantity);
            const isLowStock = hasKnownStock &&
              Number.isFinite(stockQuantity) &&
              stockQuantity > 0 &&
              stockQuantity <= 5;
            return (
              <article key={id} className="overflow-hidden rounded-xl border border-[#D4AF37]/20 bg-[#102219] sm:rounded-2xl">
                <Link to={`/product/${product.slug || id}`} className="block">
                  <img
                    src={image}
                    alt={product.name}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover sm:aspect-[4/3]"
                  />
                </Link>
                <div className="space-y-2 p-2 sm:space-y-3 sm:p-4">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    {simulation?.enabled && simulatedUnitsSoldToday > 0 && (
                      <span className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-950/30 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-emerald-200 sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-wider">
                        Units Sold Today: {simulatedUnitsSoldToday}
                      </span>
                    )}
                    {isLowStock && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/35 bg-rose-950/35 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-rose-200 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-wider">
                        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2" aria-hidden="true">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-300 opacity-60 motion-reduce:animate-none" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400 sm:h-2 sm:w-2" />
                        </span>
                        Only {stockQuantity} left
                      </span>
                    )}
                  </div>
                  <Link to={`/product/${product.slug || id}`} className="line-clamp-2 block font-serif text-sm font-bold leading-snug text-white hover:text-[#FCE096] sm:text-lg">
                    {product.name}
                  </Link>
                  {simulatorEnabled && (
                    <div className="hidden sm:block">
                      <ScarcitySimulationBadge
                        snapshot={simulation}
                        productName={product.name}
                        sampleActivityEnabled={sampleActivityEnabled}
                        compact
                      />
                    </div>
                  )}
                  <p className="text-xs font-semibold text-[#FCE096] sm:text-sm">
                    ₹{product.discount_price || product.price || product.sale_price}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
