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
        return product ? { ...product, unitsOrdered: item.unitsOrdered } : null;
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
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-10" aria-labelledby="todays-order-highlights">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
            <ShoppingBag size={14} aria-hidden="true" />
            {rankedProducts.length ? "Today's customer favourites" : 'Explore the collection'}
          </p>
          <h2 id="todays-order-highlights" className="mt-2 font-serif text-3xl font-bold text-[#FAF7F2] sm:text-4xl">
            {rankedProducts.length ? 'Going fast today' : 'Find your daily botanical ritual'}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#DFD7C4]">
            {rankedProducts.length
              ? 'Today’s most-ordered favourites. Shop now while your pick is still in stock.'
              : error || (loading
                ? 'Loading today’s verified order highlights.'
                : 'No eligible orders have been recorded today yet. Browse the collection without invented popularity claims.')}
          </p>
        </div>
        <Link to="/shop" className="inline-flex min-h-10 items-center gap-2 self-start text-xs font-bold uppercase tracking-widest text-[#FCE096] hover:text-white sm:self-auto">
          View all products <ArrowRight size={15} />
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product, index) => {
            const id = product.id || product._id;
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
              <article key={id} className="overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#102219]">
                <Link to={`/product/${product.slug || id}`} className="block">
                  <img
                    src={image}
                    alt={product.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </Link>
                <div className="space-y-3 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {Number.isFinite(Number(product.unitsOrdered)) && (
                      <span className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-950/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                        {product.unitsOrdered} {product.unitsOrdered === 1 ? 'unit ordered' : 'units ordered'} today
                      </span>
                    )}
                    {isLowStock && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/35 bg-rose-950/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-200">
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-300 opacity-60 motion-reduce:animate-none" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400" />
                        </span>
                        Only {stockQuantity} left
                      </span>
                    )}
                  </div>
                  <Link to={`/product/${product.slug || id}`} className="block font-serif text-lg font-bold text-white hover:text-[#FCE096]">
                    {product.name}
                  </Link>
                  {simulatorEnabled && (
                    <ScarcitySimulationBadge
                      snapshot={simulations[String(id)]}
                      productName={product.name}
                      sampleActivityEnabled={sampleActivityEnabled}
                      compact
                    />
                  )}
                  <p className="text-sm font-semibold text-[#FCE096]">
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
