import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
const FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%230f172a'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23334155' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E`;

function getImageUrl(product) {
  if (!product.images || product.images.length === 0) return FALLBACK;
  const img = product.images[0];
  if (img.startsWith('http')) return img;
  
  const cleanPath = img.replace(/^[\/\\]/, '');
  const finalPath = cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`;
  return `${BASE_URL}/${finalPath}`;
}

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Advanced Feature: Move directly to cart and remove from wishlist simultaneously
  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id || product.id);
  };

  // Advanced Feature: Batch Operations (Safe loops to avoid context missing function errors)
  const handleDeployAll = () => {
    wishlist.forEach(p => addToCart(p));
  };

  const handleClearArsenal = () => {
    wishlist.forEach(p => removeFromWishlist(p._id || p.id));
  };

  // --- EMPTY STATE (SYNCED WITH CART THEME) ---
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-emerald-500 selection:text-black pt-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="bg-slate-900/50 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl flex flex-col items-center text-center max-w-lg border border-slate-800/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
          <div className="w-32 h-32 bg-slate-950 rounded-full flex items-center justify-center mb-8 text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)] relative">
            <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full animate-ping"></div>
            <Heart size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Saved Arsenal Empty</h2>
          <p className="text-slate-400 mb-10 leading-relaxed font-medium">Your tactical wishlist requires equipment. Save high-performance gear here for rapid deployment later.</p>
          <Link to="/shop" className="bg-emerald-500 hover:bg-emerald-400 text-black px-10 py-5 rounded-full font-black tracking-widest uppercase text-sm transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center gap-3">
            <ArrowLeft size={18} /> Initialize Search
          </Link>
        </motion.div>
      </div>
    );
  }

  // --- POPULATED STATE (SYNCED WITH CART THEME) ---
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-black py-32 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER & BATCH CONTROLS */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 border-b border-slate-800 pb-6 gap-6">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Saved Arsenal</h1>
            <p className="text-emerald-500 font-bold tracking-widest text-sm flex items-center gap-2">
              <ShieldCheck size={16} /> {wishlist.length} Verified {wishlist.length === 1 ? 'Asset' : 'Assets'} Secured
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={handleClearArsenal}
              className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs bg-slate-900 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors border border-slate-800"
            >
              Clear Data
            </button>
            <button 
              onClick={handleDeployAll}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-emerald-500 hover:text-black text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all border border-slate-700 hover:border-emerald-500 group"
            >
              <Zap size={14} className="group-hover:animate-pulse" /> Deploy All
            </button>
          </div>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((product) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                key={product._id || product.id} 
                className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-3xl overflow-hidden shadow-xl hover:border-emerald-500/50 transition-colors group flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-square bg-slate-950 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60 z-10"></div>
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                  <button
                    onClick={() => removeFromWishlist(product._id || product.id)}
                    className="absolute top-4 right-4 z-20 p-2.5 bg-slate-950/80 backdrop-blur-md text-slate-400 hover:text-red-500 hover:bg-red-500/20 rounded-xl transition-all border border-slate-800"
                    title="Remove asset"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md">
                      {product.category || 'Gear'}
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 flex flex-col flex-1">
                  <Link to={`/product/${product._id || product.id}`} className="block mb-2 flex-1">
                    <h3 className="font-black text-lg text-white uppercase tracking-tight line-clamp-2 group-hover:text-emerald-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                    <p className="text-2xl font-black text-white tracking-tighter">
                      ${product.price || product.discount_price || 0}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full mt-6 bg-slate-800 hover:bg-emerald-500 text-white hover:text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all border border-slate-700 hover:border-emerald-500 shadow-[0_0_15px_rgba(0,0,0,0.5)] group/btn"
                  >
                    <ShoppingCart size={16} /> Move to Cart
                    <ArrowRight size={14} className="opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
