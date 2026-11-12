import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products as productsApi } from '../services/api';
import { getProductImageUrl } from '../utils/productImageUrl';
import {
  getComboPath,
  getComboPrice,
  isComboProduct,
  resolveComboItems,
} from '../utils/comboProducts';

const money = value => Number(value || 0).toLocaleString('en-IN', {
  maximumFractionDigits: 2,
});

export default function ActiveComboShowcase({ variant = 'shop' }) {
  const sectionRef = useRef(null);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [shouldLoad, setShouldLoad] = useState(() => variant !== 'home');

  useEffect(() => {
    if (variant !== 'home') {
      setShouldLoad(true);
      return undefined;
    }
    if (shouldLoad) return undefined;

    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: '0px 0px -25% 0px' });

    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldLoad, variant]);

  useEffect(() => {
    if (!shouldLoad) return undefined;
    let active = true;
    productsApi.getAllActive()
      .then(response => {
        const products = response.data?.data || response.data;
        if (!Array.isArray(products)) {
          throw new Error('The active catalog response is invalid.');
        }
        const activeProducts = products.filter(product =>
          product && (!product.status || String(product.status).toLowerCase() === 'active')
        );
        const catalogCombos = activeProducts.filter(isComboProduct);
        if (active) {
          setCombos(catalogCombos.map(combo => ({
            ...combo,
            comboItems: resolveComboItems(combo, activeProducts),
          })));
          setLoadError('');
        }
      })
      .catch(error => {
        console.error('[ACTIVE_COMBOS_LOAD]', error);
        if (active) {
          setCombos([]);
          setLoadError('Combos could not be loaded from the current catalog.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [shouldLoad]);

  if (loadError) return <p role="alert" className="my-8 text-sm text-rose-300">{loadError}</p>;
  if (!loading && combos.length === 0) return null;

  const isHome = variant === 'home';
  return (
    <section ref={sectionRef} className={isHome ? 'mt-10 sm:mt-14' : 'mb-6 sm:mb-12'}>
      <div className={`mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between ${isHome ? '' : 'sm:mb-6'}`}>
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FCE096]">
            <Layers size={13} className="text-[#D4AF37]" /> Combos
          </span>
          <h2 className={`mt-1 font-serif font-bold text-white ${isHome ? 'text-2xl sm:text-4xl' : 'text-lg sm:text-2xl'}`}>
            Available combos
          </h2>
        </div>
        <Link to="/shop" className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:text-[#FCE096]">
          View products
        </Link>
      </div>

      {loading ? (
        <p role="status" className="text-sm text-[#9BB0A5]">Loading combos from the current catalog…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
          {combos.map(combo => {
            const comboPath = getComboPath(combo);
            const price = getComboPrice(combo);
            const regularPrice = Number(combo.price) || 0;
            const imageUrl = getProductImageUrl(combo.image_url || combo.images || combo.image);
            return (
              <article
                key={combo.id ?? combo._id ?? comboPath}
                className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#244A38] bg-gradient-to-b from-[#102219] to-[#070a0e] p-4 sm:p-5 transition hover:border-[#D4AF37]/60"
              >
                {imageUrl ? (
                  <img src={imageUrl} alt={combo.name} loading="lazy" className="mb-4 aspect-[16/9] w-full rounded-xl object-cover" />
                ) : (
                  <div className="mb-4 flex aspect-[16/9] items-center justify-center rounded-xl border border-[#244A38] bg-[#081b15]">
                    <Layers size={28} className="text-[#D4AF37]" />
                  </div>
                )}
                {combo.sku && <span className="font-mono text-[10px] text-emerald-300">{combo.sku}</span>}
                <Link to={`/combo/${encodeURIComponent(comboPath)}`} className="mt-1 font-serif text-lg font-bold text-white hover:text-[#FCE096]">
                  {combo.name}
                </Link>
                {combo.description && <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#9BB0A5]">{combo.description}</p>}

                {combo.comboItems.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-[#244A38] pt-3">
                    {combo.comboItems.map((item, index) => {
                      const itemPrice = Number(item.discount_price) > 0
                        ? Number(item.discount_price)
                        : Number(item.price);
                      return (
                        <li key={`${item.id ?? item.slug ?? item.name}-${index}`} className="flex items-start gap-2 text-xs text-[#DFD7C4]">
                          <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                          <span className="min-w-0 flex-1">
                            {item.name}{item.componentQuantity > 1 ? ` × ${item.componentQuantity}` : ''}
                          </span>
                          {Number.isFinite(itemPrice) && itemPrice > 0 && (
                            <span className="shrink-0 font-mono text-[10px] text-[#FCE096]">₹{money(itemPrice)}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#244A38] pt-4">
                  <div className="font-serif text-xl font-bold text-[#FCE096]">
                    ₹{money(price)}
                    {regularPrice > price && (
                      <span className="ml-2 text-xs font-normal text-[#9BB0A5] line-through">₹{money(regularPrice)}</span>
                    )}
                  </div>
                  <Link
                    to={`/combo/${encodeURIComponent(comboPath)}`}
                    className="btn-gold-luxury shrink-0 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider"
                  >
                    View combo
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
