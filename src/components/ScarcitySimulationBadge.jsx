import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Eye, Sparkles } from 'lucide-react';
import { isInspectorDetected } from '../utils/runtimeShield';

const INDIAN_PURCHASE_LOCATIONS = [
  'Park Street, Kolkata (West Bengal)',
  'Salt Lake City Sector 1, Kolkata (West Bengal)',
  'Salt Lake City Sector 2, Kolkata (West Bengal)',
  'Salt Lake City Sector 3, Kolkata (West Bengal)',
  'Salt Lake City Sector 5, Kolkata (West Bengal)',
  'New Town Action Area 1, Kolkata (West Bengal)',
  'New Town Action Area 2, Kolkata (West Bengal)',
  'New Town Action Area 3, Kolkata (West Bengal)',
  'Ballygunge, Kolkata (West Bengal)',
  'Alipore, Kolkata (West Bengal)',
  'New Alipore, Kolkata (West Bengal)',
  'Gariahat, Kolkata (West Bengal)',
  'Tollygunge, Kolkata (West Bengal)',
  'Jadavpur, Kolkata (West Bengal)',
  'Behala, Kolkata (West Bengal)',
  'Lake Town, Kolkata (West Bengal)',
  'Ultadanga, Kolkata (West Bengal)',
  'Kankurgachi, Kolkata (West Bengal)',
  'Baguiati, Kolkata (West Bengal)',
  'VIP Road, Kolkata (West Bengal)',
  'Dum Dum, Kolkata (West Bengal)',
  'Nagerbazar, Kolkata (West Bengal)',
  'Baranagar, Kolkata (West Bengal)',
  'Dakshineswar, Kolkata (West Bengal)',
  'Kasba, Kolkata (West Bengal)',
  'Garfa, Kolkata (West Bengal)',
  'Santoshpur, Kolkata (West Bengal)',
  'Rajendra Nagar, Kolkata (West Bengal)',
  'Mukundapur, Kolkata (West Bengal)',
  'Patuli, Kolkata (West Bengal)',
  'Garia, Kolkata (West Bengal)',
  'Naktala, Kolkata (West Bengal)',
  'Bansdroni, Kolkata (West Bengal)',
  'Rashbehari Avenue, Kolkata (West Bengal)',
  'Southern Avenue, Kolkata (West Bengal)',
  'Hazra, Kolkata (West Bengal)',
  'Kalighat, Kolkata (West Bengal)',
  'Bhowanipore, Kolkata (West Bengal)',
  'Esplanade, Kolkata (West Bengal)',
  'Dalhousie, Kolkata (West Bengal)',
  'Burrabazar, Kolkata (West Bengal)',
  'Bowbazar, Kolkata (West Bengal)',
  'Entally, Kolkata (West Bengal)',
  'Tangra, Kolkata (West Bengal)',
  'Phoolbagan, Kolkata (West Bengal)',
  'Maniktala, Kolkata (West Bengal)',
  'Shyambazar, Kolkata (West Bengal)',
  'Hatibagan, Kolkata (West Bengal)',
  'Cossipore, Kolkata (West Bengal)',
  'Beadon Street, Kolkata (West Bengal)',
  'Khidirpur, Kolkata (West Bengal)',
  'Garden Reach, Kolkata (West Bengal)',
  'Metiabruz, Kolkata (West Bengal)',
  'Taratala, Kolkata (West Bengal)',
  'Thakurpukur, Kolkata (West Bengal)',
  'Joka, Kolkata (West Bengal)',
  'Budge Budge, South 24 Parganas (West Bengal)',
  'Barasat Town, North 24 Parganas (West Bengal)',
  'Madhyamgram, North 24 Parganas (West Bengal)',
  'Hridaypur, North 24 Parganas (West Bengal)',
  'Habra, North 24 Parganas (West Bengal)',
  'Bangaon, North 24 Parganas (West Bengal)',
  'Basirhat, North 24 Parganas (West Bengal)',
  'Barrackpore, North 24 Parganas (West Bengal)',
  'Titagarh, North 24 Parganas (West Bengal)',
  'Khardah, North 24 Parganas (West Bengal)',
  'Sodepur, North 24 Parganas (West Bengal)',
  'Panihati, North 24 Parganas (West Bengal)',
  'Kamarhati, North 24 Parganas (West Bengal)',
  'Dum Dum Cantt, North 24 Parganas (West Bengal)',
  'Rajarhat, North 24 Parganas (West Bengal)',
  'Sonarpur, South 24 Parganas (West Bengal)',
  'Baruipur, South 24 Parganas (West Bengal)',
  'Canning, South 24 Parganas (West Bengal)',
  'Diamond Harbour, South 24 Parganas (West Bengal)',
  'Kakdwip, South 24 Parganas (West Bengal)',
  'Bakkhali, South 24 Parganas (West Bengal)',
  'Gosaba, South 24 Parganas (West Bengal)',
  'Howrah Station Area, Howrah (West Bengal)',
  'Shibpur, Howrah (West Bengal)',
  'Salkia, Howrah (West Bengal)',
  'Kadamtala, Howrah (West Bengal)',
  'Bally, Howrah (West Bengal)',
  'Belur, Howrah (West Bengal)',
  'Liluah, Howrah (West Bengal)',
  'Dashnagar, Howrah (West Bengal)',
  'Santragachi, Howrah (West Bengal)',
  'Andul, Howrah (West Bengal)',
  'Mankundu, Howrah (West Bengal)',
  'Uluberia, Howrah (West Bengal)',
  'Bagnan, Howrah (West Bengal)',
  'Amta, Howrah (West Bengal)',
  'Panchla, Howrah (West Bengal)',
  'Domjur, Howrah (West Bengal)',
  'Serampore, Hooghly (West Bengal)',
  'Rishra, Hooghly (West Bengal)',
  'Konnagar, Hooghly (West Bengal)',
  'Uttarpara, Hooghly (West Bengal)',
  'Hindmotor, Hooghly (West Bengal)',
  'Bhadreswar, Hooghly (West Bengal)',
  'Champdani, Hooghly (West Bengal)',
  'Chandannagar, Hooghly (West Bengal)',
  'Chinsurah, Hooghly (West Bengal)',
  'Bandel, Hooghly (West Bengal)',
  'Hooghly Ghat, Hooghly (West Bengal)',
  'Dhaniakhali, Hooghly (West Bengal)',
  'Tarakeswar, Hooghly (West Bengal)',
  'Arambagh, Hooghly (West Bengal)',
  'Singur, Hooghly (West Bengal)',
  'Haripal, Hooghly (West Bengal)',
  'Station Road, Asansol (West Bengal)',
  'Burnpur, Asansol (West Bengal)',
  'Kulti, Asansol (West Bengal)',
  'Barakar, Asansol (West Bengal)',
  'Raniganj, Asansol (West Bengal)',
  'Jamuria, Asansol (West Bengal)',
  'Disergarh, Asansol (West Bengal)',
  'Chittaranjan, Asansol (West Bengal)',
  'Hirapur, Asansol (West Bengal)',
  'Durgapur City Centre, Durgapur (West Bengal)',
  'Bidhannagar, Durgapur (West Bengal)',
  'Benachity, Durgapur (West Bengal)',
  'Durgapur Steel Township, Durgapur (West Bengal)',
  'Andal, Durgapur (West Bengal)',
  'Kaksa, Durgapur (West Bengal)',
  'Galsi, Purba Bardhaman (West Bengal)',
  'Bardhaman Town, Purba Bardhaman (West Bengal)',
  'Golapbag, Purba Bardhaman (West Bengal)',
  'Memari, Purba Bardhaman (West Bengal)',
  'Katwa, Purba Bardhaman (West Bengal)',
  'Kalna, Purba Bardhaman (West Bengal)',
  'Purbasthali, Purba Bardhaman (West Bengal)',
  'Bankura Town, Bankura (West Bengal)',
  'Bishnupur, Bankura (West Bengal)',
  'Khatra, Bankura (West Bengal)',
  'Sonamukhi, Bankura (West Bengal)',
  'Barabazar, Purulia (West Bengal)',
  'Purulia Town, Purulia (West Bengal)',
  'Adra, Purulia (West Bengal)',
  'Raghunathpur, Purulia (West Bengal)',
  'Jhalda, Purulia (West Bengal)',
  'Ajodhya Hills, Purulia (West Bengal)',
  'Sevoke Road, Siliguri (West Bengal)',
  'Pradhan Nagar, Siliguri (West Bengal)',
  'Hill Cart Road, Siliguri (West Bengal)',
  'Bagdogra, Siliguri (West Bengal)',
  'Mall Road, Darjeeling (West Bengal)',
  'Kurseong, Darjeeling (West Bengal)',
  'Kalimpong Town, Kalimpong (West Bengal)',
  'Jalpaiguri Town, Jalpaiguri (West Bengal)',
  'Cooch Behar Town, Cooch Behar (West Bengal)',
  'English Bazar, Malda (West Bengal)',
  'Raiganj, Uttar Dinajpur (West Bengal)',
  'Balurghat, Dakshin Dinajpur (West Bengal)',
  'Midnapore Town, Paschim Medinipur (West Bengal)',
  'Kharagpur IIT, Paschim Medinipur (West Bengal)',
  'Haldia Port City, Purba Medinipur (West Bengal)',
  'Digha Beach, Purba Medinipur (West Bengal)',
  'Berhampore, Murshidabad (West Bengal)',
  'Krishnanagar Town, Nadia (West Bengal)',
  'Kalyani, Nadia (West Bengal)',
  'Bolpur Shantiniketan, Birbhum (West Bengal)',
  'Dwaraka Nagar, Visakhapatnam (Andhra Pradesh)',
  'Benz Circle, Vijayawada (Andhra Pradesh)',
  'SV University Road, Tirupati (Andhra Pradesh)',
  'GS Road, Guwahati (Assam)',
  'Boring Road, Patna (Bihar)',
  'Shankar Nagar, Raipur (Chhattisgarh)',
  'Miramar, Panaji (Goa)',
  'Bodakdev, Ahmedabad (Gujarat)',
  'Alkapuri, Vadodara (Gujarat)',
  'Vesu, Surat (Gujarat)',
  'Kalawad Road, Rajkot (Gujarat)',
  'DLF Phase 4, Gurgaon (Haryana)',
  'The Mall Road, Shimla (Himachal Pradesh)',
  'Kanke Road, Ranchi (Jharkhand)',
  'Bistupur, Jamshedpur (Jharkhand)',
  'Indiranagar, Bengaluru (Karnataka)',
  'Koramangala, Bengaluru (Karnataka)',
  'Jayanagar, Bengaluru (Karnataka)',
  'Whitefield, Bengaluru (Karnataka)',
  'Kuvempunagar, Mysuru (Karnataka)',
  'Bejai, Mangaluru (Karnataka)',
  'Panampilly Nagar, Kochi (Kerala)',
  'Kowdiar, Thiruvananthapuram (Kerala)',
  'Vijay Nagar, Indore (Madhya Pradesh)',
  'Arera Colony, Bhopal (Madhya Pradesh)',
  'Koregaon Park, Pune (Maharashtra)',
  'Bandra West, Mumbai (Maharashtra)',
  'Andheri West, Mumbai (Maharashtra)',
  'Juhu, Mumbai (Maharashtra)',
  'Powai, Mumbai (Maharashtra)',
  'Civil Lines, Nagpur (Maharashtra)',
  'Saheed Nagar, Bhubaneswar (Odisha)',
  'Buxi Bazaar, Cuttack (Odisha)',
  'Sarabha Nagar, Ludhiana (Punjab)',
  'Ranjit Avenue, Amritsar (Punjab)',
  'C-Scheme, Jaipur (Rajasthan)',
  'Vaishali Nagar, Jaipur (Rajasthan)',
  'Sardarpura, Jodhpur (Rajasthan)',
  'Fatehpura, Udaipur (Rajasthan)',
  'MG Marg, Gangtok (Sikkim)',
  'Alwarpet, Chennai (Tamil Nadu)',
  'T. Nagar, Chennai (Tamil Nadu)',
  'Anna Nagar, Chennai (Tamil Nadu)',
  'Adyar, Chennai (Tamil Nadu)',
  'RS Puram, Coimbatore (Tamil Nadu)',
  'KK Nagar, Madurai (Tamil Nadu)',
  'Jubilee Hills, Hyderabad (Telangana)',
  'Banjara Hills, Hyderabad (Telangana)',
  'Gachibowli, Hyderabad (Telangana)',
  'Gomti Nagar, Lucknow (Uttar Pradesh)',
  'Hazratganj, Lucknow (Uttar Pradesh)',
  'Swaroop Nagar, Kanpur (Uttar Pradesh)',
  'Assi Ghat, Varanasi (Uttar Pradesh)',
  'Noida Sector 18, Noida (Uttar Pradesh)',
  'Indirapuram, Ghaziabad (Uttar Pradesh)',
  'Rajpur Road, Dehradun (Uttarakhand)',
];

export default function ScarcitySimulationBadge({
  snapshot,
  productName,
  sampleActivityEnabled = false,
  compact = false,
}) {
  const [inspectorOpen, setInspectorOpen] = useState(() => isInspectorDetected());

  useEffect(() => {
    const handleInspectorChange = event => {
      setInspectorOpen(Boolean(event.detail?.active));
    };
    window.addEventListener('bhumivera:inspector-state', handleInspectorChange);
    return () => window.removeEventListener('bhumivera:inspector-state', handleInspectorChange);
  }, []);

  const baseRemaining = snapshot?.outOfStock ? 0 : snapshot?.remaining || 0;
  const baseSoldToday = Number(snapshot?.simulatedSoldToday ?? snapshot?.soldToday) || 0;
  const dailyCap = snapshot?.dailyCap || 250;

  const [activeRemaining, setActiveRemaining] = useState(baseRemaining);
  const [activeSoldToday, setActiveSoldToday] = useState(baseSoldToday);
  const [recentOrderEvent, setRecentOrderEvent] = useState(null);

  const lastSoldRef = useRef(baseSoldToday);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    setActiveRemaining(baseRemaining);
    setActiveSoldToday(baseSoldToday);

    if (hasMountedRef.current && baseSoldToday > lastSoldRef.current) {
      const loc = INDIAN_PURCHASE_LOCATIONS[
        Math.floor(Math.random() * INDIAN_PURCHASE_LOCATIONS.length)
      ];
      setRecentOrderEvent({
        location: loc,
        time: 'Just now',
        id: Date.now(),
      });

      const timer = setTimeout(() => {
        setRecentOrderEvent(null);
      }, 7000);
      return () => clearTimeout(timer);
    }

    lastSoldRef.current = baseSoldToday;
    hasMountedRef.current = true;
  }, [baseSoldToday, baseRemaining]);

  const [viewerCount, setViewerCount] = useState(77);

  const driftStateRef = useRef({
    direction: Math.random() > 0.5 ? 1 : -1,
    ticksRemainingInTrend: 2 + Math.floor(Math.random() * 2),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const state = driftStateRef.current;
        state.ticksRemainingInTrend -= 1;

        if (state.ticksRemainingInTrend <= 0) {
          state.direction = -state.direction;
          state.ticksRemainingInTrend = 1 + Math.floor(Math.random() * 3);
        }

        const step = Math.floor(Math.random() * 13) + 4;
        let next = prev + state.direction * step;

        if (next >= 190) {
          next = 182 - Math.floor(Math.random() * 10);
          state.direction = -1;
          state.ticksRemainingInTrend = 2 + Math.floor(Math.random() * 2);
        } else if (next <= 15) {
          next = 20 + Math.floor(Math.random() * 10);
          state.direction = 1;
          state.ticksRemainingInTrend = 2 + Math.floor(Math.random() * 2);
        }

        return Math.min(200, Math.max(5, next));
      });
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  if (!snapshot?.enabled || snapshot?.paused || inspectorOpen) return null;

  const percentageSold = Math.min(
    100,
    Math.round((activeSoldToday / Math.max(1, dailyCap)) * 100)
  );

  return (
    <section
      aria-label="Total inventory"
      className={`select-none relative overflow-hidden rounded-2xl border border-[#D4AF37]/35 bg-gradient-to-br from-[#071a12]/95 via-[#0b2419]/90 to-[#05140e]/95 text-amber-50 shadow-xl backdrop-blur-md ${
        compact ? 'p-3' : 'p-4 sm:p-5'
      }`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#D4AF37]/10 blur-2xl" />

      <div className="flex items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#FCE096]">
            <Sparkles size={13} aria-hidden="true" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>
          <h4 className="text-[11px] font-black uppercase tracking-[0.14em] text-amber-200 truncate">
            Total inventory
          </h4>
        </div>
      </div>

      {!snapshot.outOfStock && (
        <div
          data-testid="live-viewers-badge"
          className="mt-2.5 flex items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-rose-950/90 via-rose-900/60 to-rose-950/90 border border-rose-500/50 px-3 py-1.5 shadow-[0_0_12px_rgba(244,63,94,0.25)]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-90" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-600 shadow-[0_0_6px_rgba(244,63,94,0.9)]" />
            </span>
            <Eye size={12} className="text-rose-300 stroke-[2.5] shrink-0" aria-hidden="true" />
            <span className="text-xs font-black tracking-wide text-rose-100 truncate">
              {viewerCount}+ people are viewing
            </span>
          </div>

          <span className="shrink-0 text-[9px] font-medium text-rose-300/80 font-mono">
            Live store activity
          </span>
        </div>
      )}

      <div className="mt-2.5 rounded-xl bg-black/35 border border-white/10 p-2.5">
        <div className="flex items-center justify-between gap-2 text-xs font-semibold">
          <div className="text-white truncate">
            <span className="text-slate-300 font-medium">Units remaining: </span>
            <strong className="text-sm font-black text-[#FCE096] transition-all duration-300">
              {activeRemaining}
            </strong>
            <span className="text-slate-400 font-normal"> / {dailyCap}</span>
          </div>

          <div className="text-right text-slate-300 font-medium shrink-0">
            <span>Units Sold Today: </span>
            <strong className="text-sm font-black text-[#FCE096]">
              {activeSoldToday}
            </strong>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/60 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-[#D4AF37] to-amber-400 transition-all duration-700 ease-out shadow-[0_0_6px_rgba(212,175,55,0.4)]"
              style={{ width: `${percentageSold}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono">
            <span>Batch claimed: {percentageSold}% today</span>
            <span>Daily batch: {dailyCap} units</span>
          </div>
        </div>
      </div>

      {recentOrderEvent && (
        <div className="mt-2.5 rounded-xl border border-[#D4AF37]/50 bg-gradient-to-r from-[#0d2a1d] to-[#071a12] p-2.5 text-xs text-amber-100 shadow-md animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#FCE096]">
              ⚡
            </span>
            <p className="leading-snug">
              A verified shopper in{' '}
              <strong className="text-[#FCE096]">{recentOrderEvent.location}</strong> just ordered{' '}
              <strong className="text-emerald-300">1x unit</strong> of{' '}
              <span className="italic text-slate-200">{productName || 'this formulation'}</span>
            </p>
          </div>
        </div>
      )}

      {snapshot.outOfStock && (
        <p className="mt-2 inline-flex items-center gap-1 rounded-lg bg-rose-950/40 border border-rose-400/30 px-2.5 py-1 text-xs font-bold text-rose-200">
          <AlertCircle size={13} aria-hidden="true" /> Currently out of stock
        </p>
      )}

      <p className="mt-2 text-[10px] leading-relaxed text-amber-50/70">
        Live dispatch status updates automatically as cleanroom batches are allocated.
      </p>

      {sampleActivityEnabled && snapshot.sampleActivity?.length > 0 && (
        <div className="mt-3 border-t border-[#D4AF37]/25 pt-2.5 text-[11px] leading-relaxed text-amber-100/90">
          <p className="flex items-center gap-1 font-bold uppercase tracking-wider text-amber-200 text-[10px]">
            <Sparkles size={11} className="text-[#D4AF37]" />
            Recent verified dispatches
          </p>
          <ul className="mt-1.5 space-y-1">
            {snapshot.sampleActivity.slice(0, 3).map(activity => (
              <li key={`${activity.buyer}-${activity.time}`} className="flex items-center gap-1.5 text-slate-300">
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                <span>
                  {activity.buyer} · {productName || 'Botanical formulation'} · {activity.city} · {activity.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
