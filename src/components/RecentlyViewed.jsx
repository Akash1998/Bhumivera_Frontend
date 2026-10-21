import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { getProductImageUrl } from '../utils/productImageUrl';

const STORAGE_KEY = 'Bhumivera_recently_viewed';
const MAX_ITEMS = 8;

export function addToRecentlyViewed(product) {
  if (!product) return;
  try {
    const productId = String(product.id || product._id);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = stored.filter(p => String(p.id || p._id) !== productId);
    const itemToAdd = {
      id: productId,
      name: product.name,
      image: product.image_url || (Array.isArray(product.images) ? product.images[0] : product.images) || product.image || product.file_path,
      price: product.price,
      discount_price: product.discount_price,
      slug: product.slug
    };
    const updated = [itemToAdd, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error adding to recently viewed:', err);
  }
}

export default function RecentlyViewed({ currentId }) {
  const toast = useToast();
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    loadItems();
    window.addEventListener('storage', loadItems);
    return () => window.removeEventListener('storage', loadItems);
  }, [currentId]);

  const loadItems = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const cid = String(currentId);
      setItems(stored.filter(p => String(p.id || p._id) !== cid));
    } catch { 
      setItems([]); 
    }
  };

  const clearAll = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setItems([]);
      toast?.success?.('Recently viewed history cleared.');
    } catch (error) {
      console.error('Could not clear recently viewed history:', error);
      toast?.error?.('Could not clear recently viewed history.');
    }
  };

  if (!items.length) return null;

  return (
    <section className="two-tone-panel-gold rounded-3xl p-6 sm:p-8 my-16 bg-[#0d1520] relative overflow-hidden shadow-xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#070a0e] border border-[#d4af37]/40 text-[#fce096] flex items-center justify-center shadow-md">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">Recently Inspected</h3>
              <p className="font-sub-gold text-[10px] tracking-widest mt-0.5">Resume your botanical formulation audit</p>
            </div>
          </div>
          <button 
            onClick={clearAll} 
            className="btn-silver-luxury flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider text-[#cbd5e1]"
          >
            <Trash2 size={13} className="text-[#d4af37]" /> Clear History
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => {
              const selling = item.discount_price ? Number(item.discount_price) : Number(item.price);
              const original = Number(item.price);
              const discount = item.discount_price ? Math.round(((original - selling) / original) * 100) : 0;
              return (
                <motion.div 
                  layout 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.8 }} 
                  transition={{ delay: idx * 0.05 }} 
                  key={item.id} 
                  className="two-tone-card group relative bg-[#070a0e] border border-[#d4af37]/20 hover:border-[#d4af37]/60 rounded-xl overflow-hidden transition-all duration-300 shadow-md"
                >
                  <Link to={`/product/${item.slug || item.id}`} className="block">
                    <div className="aspect-[4/5] bg-black/40 overflow-hidden relative p-2.5">
                      <img 
                        src={getProductImageUrl(item.image) || '/logo.webp'} 
                        alt={item.name} 
                        onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} 
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                        loading="lazy" 
                      />
                      {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-black/85 border border-[#d4af37]/40 text-[#fce096] text-[8px] font-mono font-bold px-2 py-0.5 rounded-full shadow-lg uppercase tracking-wider z-10 backdrop-blur-sm">
                          {discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 bg-[#0d1520] border-t border-white/5">
                      <h4 className="text-[#cbd5e1] text-[10px] font-medium truncate group-hover:text-white transition-colors uppercase tracking-tight mb-1">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-[#fce096] font-bold text-xs">₹{selling.toLocaleString()}</span>
                        {discount > 0 && (
                          <span className="text-[#94a3b8] text-[9px] line-through">₹{original.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
