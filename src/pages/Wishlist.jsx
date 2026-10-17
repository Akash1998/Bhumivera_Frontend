import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Plus } from 'lucide-react';
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
    <main className="min-h-screen bg-[#101914] text-white py-24 px-6 font-sans">
      <SEO
        title="Saved Wishlist & Curated Botanical Rituals | Bhumivera"
        description="Review your saved Bhumivera formulations or one-click save our curated AM and PM skincare regimens."
        route="/wishlist"
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 border-b border-white/10 pb-6 gap-6">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#d4af37]">
              Personal Apothecary Curation
            </span>
            <h1 className="text-4xl font-serif sm:text-5xl mt-2">Saved Wishlist &amp; Rituals</h1>
            <p className="text-emerald-400 font-semibold text-xs mt-2 flex items-center gap-2">
              <ShieldCheck size={15} /> {wishlist.length} saved {wishlist.length === 1 ? 'formulation' : 'formulations'} (Synced for Guest &amp; Account)
            </p>
          </div>
          {wishlist.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearWishlist}
                className="px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs bg-white/5 text-white/70 hover:text-rose-300 border border-white/10"
              >
                Clear Wishlist
              </button>
              <button
                type="button"
                onClick={handleDeployAll}
                className="px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs bg-[#d4af37] text-[#101914] hover:bg-[#e5c247]"
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
                  className="overflow-hidden rounded-2xl border border-white/15 bg-[#16241d] flex flex-col"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black">
                    <img
                      src={getImageUrl(product, idx)}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-white">{product.name}</h2>
                      <p className="mt-1 text-sm font-bold text-[#d4af37]">
                        ₹{product.discount_price || product.price}
                      </p>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold uppercase text-black"
                      >
                        <ShoppingCart size={14} /> Move to Bag
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(pid)}
                        className="rounded-xl border border-white/15 p-2.5 text-white/70 hover:text-rose-400"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/15 bg-[#16241d] p-8 sm:p-10 text-center mb-14">
            <Heart size={40} className="mx-auto text-[#d4af37] mb-4" />
            <h2 className="font-serif text-2xl sm:text-3xl">Your personal wishlist is ready to curate</h2>
            <p className="mt-2 max-w-xl mx-auto text-xs sm:text-sm text-white/70">
              Click “Save to Wishlist” on any formulation below to build your AM/PM botanical routine—no sign-in required to start saving.
            </p>
          </div>
        )}

        {/* Curated Real-Life Botanical Regimens to Save with 1 Click */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                Real-Life Daily Regimens
              </span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl">
                Recommended Formulations to Save &amp; Pair
              </h2>
            </div>
            <Link to="/compare" className="text-xs font-bold text-[#c8d6aa] underline underline-offset-4">
              Compare All 6 Formulations ↗
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FALLBACK_CATALOG_PRODUCTS.map((prod) => (
              <article
                key={prod.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#15221b] flex flex-col"
              >
                <img src={prod.image_url} alt={prod.name} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-[#d4af37] uppercase">{prod.phLevel}</span>
                    <h3 className="mt-1 font-serif text-lg font-bold text-white">{prod.name}</h3>
                    <p className="mt-1 text-xs text-white/65 line-clamp-2">{prod.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="font-serif text-lg font-bold text-white">₹{prod.discount_price}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleWishlist?.(prod)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-bold text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                      >
                        <Heart size={13} /> Save
                      </button>
                      <button
                        type="button"
                        onClick={() => addToCart?.(prod, 1)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#101914]"
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
