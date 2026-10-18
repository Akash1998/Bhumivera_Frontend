import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Star, Check, Minus, Plus, ExternalLink, Tag, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductImageUrl } from '../utils/productImageUrl';

const FALLBACK = 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=400&q=60';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (!product) return null;

  const productImages = Array.isArray(product.images)
    ? product.images.map(getProductImageUrl).filter(Boolean)
    : [];
  const images = productImages.length
    ? productImages
    : [getProductImageUrl(product.image_url || product.image) || FALLBACK];

  const price = Number(product.discount_price || product.price || 0);
  const original = Number(product.price || 0);
  const discount = product.discount_price && original > 0
    ? Math.round(((original - price) / original) * 100)
    : 0;

  const handleAdd = async () => {
    try {
      const chosenVariant = product.variants?.[selectedVariant];
      const itemToAdd = chosenVariant
        ? { ...product, selectedVariant: chosenVariant.name || chosenVariant }
        : product;
      await addToCart(itemToAdd, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="two-tone-panel-gold relative bg-[#0d1520] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2.5 bg-[#070a0e] hover:bg-black text-[#cbd5e1] hover:text-white rounded-full border border-white/20 hover:border-[#d4af37] transition-all backdrop-blur-sm shadow-md"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-[#070a0e] rounded-2xl overflow-hidden border border-white/10 group">
              {discount > 0 && (
                <div className="absolute top-3 left-3 z-10 bg-black/80 border border-[#d4af37]/40 text-[#fce096] px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-1 backdrop-blur-md">
                  <Tag size={12} className="text-[#d4af37]" />
                  {discount}% OFF
                </div>
              )}
              <img
                src={images[selectedImg]}
                alt={product.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK;
                  e.currentTarget.onerror = null;
                }}
              />
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border transition-all ${
                      selectedImg === i
                        ? 'border-[#d4af37] ring-1 ring-[#d4af37]/60'
                        : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = FALLBACK; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-4">
            {/* Category Badge */}
            {product.category && (
              <span className="font-sub-gold inline-flex items-center gap-1.5 text-[10px] tracking-wider border border-[#d4af37]/40 bg-[#070a0e] px-3 py-1 rounded-full w-fit">
                <Package size={12} className="text-[#d4af37]" />
                {typeof product.category === 'object' ? product.category.name : product.category}
              </span>
            )}

            {/* Product Name */}
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              {product.name}
            </h2>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${
                        i < Math.round(product.rating || 4)
                          ? 'text-[#fce096] fill-[#fce096]'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                {product.reviewCount && (
                  <span className="text-xs font-mono text-[#94a3b8]">({product.reviewCount} reviews)</span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 py-2 border-y border-white/5">
              <span className="text-3xl font-mono font-bold text-[#fce096]">
                ₹{price.toLocaleString()}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-base text-[#94a3b8] line-through">
                    ₹{original.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#fce096] bg-[#070a0e] px-2.5 py-1 rounded-md border border-[#d4af37]/35">
                    Save ₹{(original - price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-[#070a0e] border border-white/10 rounded-xl p-4">
                <p className="text-[#cbd5e1] text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            {product.quantity !== undefined && (
              <div className="flex items-center gap-2 text-xs font-mono">
                {product.quantity > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                    <span className="text-[#fce096] font-medium">
                      In Stock ({product.quantity} units available)
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-rose-400 rounded-full" />
                    <span className="text-rose-400 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
            )}

            {/* Variant Options */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#94a3b8] mb-2">Options</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedVariant(i)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        selectedVariant === i
                          ? 'border-[#d4af37] bg-gradient-to-r from-[#d4af37] to-[#fce096] text-black font-bold shadow-md'
                          : 'border-white/15 bg-[#070a0e] text-[#cbd5e1] hover:border-[#d4af37]/40'
                      }`}
                    >
                      {v.name || v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
              {/* Quantity Selector */}
              <div className="flex items-center bg-[#070a0e] border border-white/15 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3.5 py-2.5 text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors"
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2.5 text-white font-mono font-bold text-xs border-x border-white/15">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="px-3.5 py-2.5 text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAdd}
                disabled={added || (product.quantity !== undefined && product.quantity === 0)}
                className="btn-gold-luxury flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {added ? (
                  <>
                    <Check size={18} />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* View Full Details Link */}
            <Link
              to={`/product/${product.slug || product.id}`}
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#fce096] hover:text-white transition-colors py-1"
            >
              <ExternalLink size={13} />
              <span>Inspect Full Technical Dossier</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
