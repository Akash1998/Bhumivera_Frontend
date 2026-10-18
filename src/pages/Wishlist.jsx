import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useToast } from '../context/ToastContext';
import { getProductImageUrl } from '../utils/productImageUrl';
import { FALLBACK_CATALOG_PRODUCTS } from '../data/bhumiveraUniqueData';

function getImageUrl(product, idx = 0) {
  return (
    getProductImageUrl(product.image_url || product.images || product.image) ||
    FALLBACK_CATALOG_PRODUCTS[idx % FALLBACK_CATALOG_PRODUCTS.length].image_url
  );
}

export default function Wishlist() {
  const toast = useToast();
  const { wishlist = [], loading, error, toggleWishlist, removeFromWishlist, clearWishlist, refreshWishlist } = useWishlist() || {};
  const { addToCart } = useCart() || {};

  const handleMoveToCart = async (product) => {
    const productId = product.product_id || product.id || product._id;
    const added = await addToCart(product);
    if (!added) {
      toast?.error?.('Could not add this product to your cart.');
      return;
    }
    await removeFromWishlist(productId);
  };

  const handleDeployAll = () => {
    wishlist.forEach((product) => addToCart(product));
  };

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <SEO
        title="Saved Wishlist & Curated Botanical Rituals | Bhumivera"
        description="Review your saved Bhumivera formulations or one-click save our curated AM and PM skincare regimens."
        route="/wishlist"
      />
      <div className="max-w-7xl mx-auto">
        {/* Header section matching two-tone gold/silver aesthetic */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 pb-6 border-b border-[#d4af37]/20 gap-6">
          <div>
            <span className="font-sub-gold text-[10px] font-semibold uppercase tracking-[0.26em] block">
              Personal Apothecary Curation
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif mt-2 tracking-tight">
              <span className="font-headline-gold">Saved</span>{' '}
              <span className="font-headline-silver">Wishlist &amp; Rituals</span>
            </h1>
            <div className="gold-hairline w-28 my-3" />
            <p className="text-[#cbd5e1] text-xs font-normal flex items-center gap-2 mt-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30">
                <ShieldCheck size={12} />
              </span>
              <span>{wishlist.length} saved {wishlist.length === 1 ? 'formulation' : 'formulations'} (Synced for Guest &amp; Account)</span>
            </p>
          </div>
          {wishlist.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearWishlist}
                className="btn-silver-luxury px-5 py-2.5 rounded-xl font-semibold uppercase tracking-wider text-xs"
              >
                Clear Wishlist
              </button>
              <button
                type="button"
                onClick={handleDeployAll}
                className="btn-gold-luxury px-5 py-2.5 rounded-xl font-semibold uppercase tracking-wider text-xs"
              >
                Move All to Bag
              </button>
            </div>
          )}
        </div>

        {/* Saved Items Grid */}
        {wishlist.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            {wishlist.map((product, idx) => {
              const pid = product.product_id || product.id || product._id;
              return (
                <article
                  key={pid || idx}
                  className="two-tone-card rounded-2xl overflow-hidden flex flex-col group hover:border-[#d4af37]/50 transition-all duration-300"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#070a0e] relative">
                    <img
                      src={getImageUrl(product, idx)}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1520] via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-serif text-xl font-semibold text-white tracking-wide">{product.name}</h2>
                      <p className="mt-2 text-lg font-serif font-bold text-[#d4af37]">
                        ₹{product.discount_price || product.price}
                      </p>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 btn-gold-luxury py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={14} /> Move to Bag
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(pid)}
                        className="btn-silver-luxury p-2.5 rounded-xl text-[#cbd5e1] hover:text-rose-400"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="two-tone-panel-gold rounded-3xl p-8 sm:p-12 text-center mb-16 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
              <Heart size={28} />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white">Your personal wishlist is ready to curate</h2>
            <p className="mt-2 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
              Click “Save to Wishlist” on any formulation below to build your AM/PM botanical routine—no sign-in required to start saving.
            </p>
            <div className="mt-6">
              <Link to="/shop" className="btn-gold-luxury inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold">
                Explore Formulations <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Curated Real-Life Botanical Regimens to Save with 1 Click */}
        <section>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#d4af37]/20 pb-4">
            <div>
              <span className="font-sub-gold text-[10px] font-semibold uppercase tracking-[0.24em] block">
                Real-Life Daily Regimens
              </span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl">
                <span className="font-headline-gold">Recommended</span>{' '}
                <span className="font-headline-silver">Formulations to Save &amp; Pair</span>
              </h2>
            </div>
            <Link to="/compare" className="text-xs uppercase tracking-wider font-semibold text-[#cbd5e1] hover:text-[#fce096] transition-colors underline underline-offset-4">
              Compare All Formulations ↗
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FALLBACK_CATALOG_PRODUCTS.map((prod) => (
              <article
                key={prod.id}
                className="two-tone-card rounded-2xl overflow-hidden flex flex-col group hover:border-[#d4af37]/40 transition-all duration-300"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#070a0e] relative">
                  <img src={prod.image_url} alt={prod.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1520] via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#fce096] uppercase tracking-widest bg-[#d4af37]/10 border border-[#d4af37]/25 px-2 py-0.5 rounded-full inline-block mb-2">
                      {prod.phLevel}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white">{prod.name}</h3>
                    <p className="mt-1 text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">{prod.description}</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#d4af37]/15">
                    <span className="font-serif text-lg font-bold text-white">₹{prod.discount_price}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleWishlist?.(prod)}
                        className="btn-silver-luxury inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#cbd5e1]"
                      >
                        <Heart size={13} className="text-[#d4af37]" /> Save
                      </button>
                      <button
                        type="button"
                        onClick={() => addToCart?.(prod, 1)}
                        className="btn-gold-luxury inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider"
                      >
                        + Bag
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
