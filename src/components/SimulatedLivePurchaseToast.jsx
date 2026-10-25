import React, { useEffect, useState } from 'react';
import { ShoppingBag, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

const INDIAN_CITIES = [
  { city: 'Mumbai', state: 'Maharashtra', area: 'Bandra West' },
  { city: 'Bengaluru', state: 'Karnataka', area: 'Indiranagar' },
  { city: 'New Delhi', state: 'Delhi', area: 'Vasant Vihar' },
  { city: 'Jaipur', state: 'Rajasthan', area: 'C-Scheme' },
  { city: 'Kolkata', state: 'West Bengal', area: 'Salt Lake' },
  { city: 'Pune', state: 'Maharashtra', area: 'Koregaon Park' },
  { city: 'Hyderabad', state: 'Telangana', area: 'Jubilee Hills' },
  { city: 'Ahmedabad', state: 'Gujarat', area: 'Bodakdev' },
  { city: 'Kochi', state: 'Kerala', area: 'Fort Kochi' },
  { city: 'Chandigarh', state: 'Punjab', area: 'Sector 17' },
  { city: 'Lucknow', state: 'Uttar Pradesh', area: 'Gomti Nagar' },
  { city: 'Indore', state: 'Madhya Pradesh', area: 'Vijay Nagar' },
  { city: 'Chennai', state: 'Tamil Nadu', area: 'Alwarpet' },
  { city: 'Panaji', state: 'Goa', area: 'Miramar' },
  { city: 'Dehradun', state: 'Uttarakhand', area: 'Rajpur Road' },
  { city: 'Guwahati', state: 'Assam', area: 'Uzan Bazar' },
];

export default function SimulatedLivePurchaseToast({
  productName,
  enabled = true,
  onSimulatedPurchase = null,
}) {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;

    let timer;
    const triggerPurchase = () => {
      const cityObj = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
      const shopperId = Math.floor(Math.random() * 899 + 100);
      const newEvent = {
        shopper: `Sample shopper #${shopperId}`,
        location: `${cityObj.area}, ${cityObj.city}`,
        state: cityObj.state,
        quantity: 1,
        time: 'Just now',
        id: Date.now(),
      };

      setCurrentEvent(newEvent);
      setVisible(true);

      // Notify parent to decrement visual counter
      if (typeof onSimulatedPurchase === 'function') {
        onSimulatedPurchase(1);
      }

      // Hide after 6 seconds
      setTimeout(() => {
        setVisible(false);
      }, 6000);
    };

    // First trigger after 3.5 seconds
    const initialDelay = setTimeout(() => {
      triggerPurchase();
      // Subsequent triggers every 22-38 seconds
      timer = setInterval(triggerPurchase, 26000);
    }, 3500);

    return () => {
      clearTimeout(initialDelay);
      if (timer) clearInterval(timer);
    };
  }, [enabled, onSimulatedPurchase]);

  if (!enabled || !currentEvent || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-r from-[#071a12]/95 via-[#0b291d]/95 to-[#071a12]/95 p-3.5 shadow-2xl backdrop-blur-md text-amber-50 animate-in fade-in slide-in-from-bottom-3 duration-500"
    >
      <div className="flex items-start gap-3">
        <div className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-emerald-500/20 border border-[#D4AF37]/50 text-[#FCE096]">
          <ShoppingBag size={16} />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-amber-300">
            <Sparkles size={11} className="text-[#D4AF37]" />
            <span>Simulated Live Purchase Activity</span>
            <span className="text-slate-400">· {currentEvent.time}</span>
          </div>

          <p className="mt-0.5 text-xs text-white">
            A verified shopper in{' '}
            <strong className="text-[#FCE096] font-semibold">{currentEvent.location}</strong> ({currentEvent.state}) just ordered{' '}
            <strong className="text-emerald-300 font-bold">1x unit</strong> of{' '}
            <span className="italic text-slate-200">{productName || 'this formulation'}</span>
          </p>

          <p className="mt-1 text-[10px] text-amber-200/75">
            Illustrative ticker · Stock counter visually adjusted · Real stock & orders are never modified.
          </p>
        </div>
      </div>
    </div>
  );
}
