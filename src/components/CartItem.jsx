import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { getProductImageUrl } from '../utils/productImageUrl';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const qty = Number(item.quantity) || 1;
  const unitPrice = Number(item.discount_price || item.price) || 0;
  return (
    <div className="flex gap-4 sm:gap-6 py-5 border-b border-white/10 group transition-all duration-300 hover:bg-white/[0.02] -mx-3 px-3 rounded-2xl">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#070a0e] border border-white/15 group-hover:border-[#d4af37]/40 transition-colors shrink-0">
        <img 
          src={getProductImageUrl(item.image || item.image_url || item.images) || '/logo.webp'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex flex-col justify-between flex-1 py-0.5">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="text-white font-serif font-bold text-base sm:text-lg leading-tight group-hover:text-[#d4af37] transition-colors">{item.name}</h3>
            <p className="text-[#94a3b8] text-[10px] sm:text-xs mt-1 font-semibold uppercase tracking-wider">{item.category || item.category_name || 'Botanical Care'}</p>
          </div>
          <button 
            onClick={() => onRemove(item.id || item.product_id)}
            aria-label="Remove item"
            className="text-[#94a3b8] hover:text-rose-400 transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-between items-end mt-3">
          <div className="flex items-center bg-[#070a0e] rounded-xl border border-white/15 p-1 group-hover:border-white/25 transition-colors">
            <button 
              onClick={() => onUpdateQuantity(item.id || item.product_id, Math.max(1, qty - 1))}
              aria-label="Decrease quantity"
              className="w-7 h-7 flex items-center justify-center text-[#cbd5e1] hover:text-[#d4af37] transition-colors hover:bg-white/5 rounded-lg"
            >
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-white font-bold text-xs">{qty}</span>
            <button 
              onClick={() => onUpdateQuantity(item.id || item.product_id, qty + 1)}
              aria-label="Increase quantity"
              className="w-7 h-7 flex items-center justify-center text-[#cbd5e1] hover:text-[#d4af37] transition-colors hover:bg-white/5 rounded-lg"
            >
              <Plus size={13} />
            </button>
          </div>
          
          <div className="text-right">
            <p className="font-serif font-bold text-lg leading-none text-[#d4af37]">₹{(unitPrice * qty).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-[#94a3b8] font-semibold uppercase mt-1 tracking-wider">₹{unitPrice.toLocaleString('en-IN')} / UNIT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
