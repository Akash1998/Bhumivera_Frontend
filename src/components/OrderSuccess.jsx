import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Share2, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccess({ orderId, onClose, onTrackOrder }) {
  const navigate = useNavigate();
  const [shared, setShared] = useState(false);

  const handleTrack = () => {
    if (typeof onTrackOrder === 'function') {
      onTrackOrder(orderId);
      return;
    }
    navigate(orderId ? `/order-tracking?order=${encodeURIComponent(orderId)}` : '/order-tracking');
  };

  const handleContinueShopping = () => {
    if (typeof onClose === 'function') {
      onClose();
      return;
    }
    navigate('/shop');
  };

  const handleShare = async () => {
    const shareUrl = 'https://www.bhumivera.com/shop';
    const shareText = `Just ordered my botanical skincare ritual from Bhumivera! Explore at ${shareUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Bhumivera Botanical Skincare',
          text: shareText,
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      }
      setShared(true);
      setTimeout(() => setShared(false), 3500);
    } catch {
      // User dismissed native share sheet
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 text-center space-y-8 relative overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full" />

        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto">
          <CheckCircle2 size={40} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Order Confirmed!</h1>
          <p className="text-slate-400 text-sm">
            Your botanical formulations are being prepared for dispatch.
          </p>
        </div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold uppercase">Order ID</span>
            <span className="text-emerald-500 font-mono font-bold">#{orderId || 'BHVM-9921'}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold uppercase">Est. Delivery</span>
            <span className="text-white font-bold">4–6 Calendar Days</span>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <button
            type="button"
            onClick={handleTrack}
            className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-tighter rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            <Package size={18} />
            Track My Package
          </button>
          <button
            type="button"
            onClick={handleContinueShopping}
            className="w-full py-4 bg-slate-800 text-white font-black uppercase tracking-tighter rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-500 flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          {shared ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
          {shared ? 'Link Copied to Share!' : 'Share your haul & get 10% off next time'}
        </button>
      </motion.div>
    </div>
  );
}
