import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, KeyRound, Truck, MapPin, Droplets, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VisualGuideModal({ isOpen, onClose, initialTab = 'password' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] text-[#0B2419] rounded-3xl border border-[#D4AF37]/50 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#071911] via-[#0B2419] to-[#143725] px-6 py-4 text-white flex items-center justify-between border-b border-[#D4AF37]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold tracking-wide">Bhumivera Visual Help &amp; Guides</h3>
              <p className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">
                Step-by-Step Interactive Assistance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-stone-300 hover:text-white"
            aria-label="Close Guide Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-200 bg-[#f4f1e9] overflow-x-auto p-2 gap-1.5 shrink-0 scrollbar-none">
          {[
            { id: 'password', label: 'Password & Login', icon: KeyRound },
            { id: 'damaged', label: 'Damaged & Courtesy Credit', icon: ShieldCheck },
            { id: 'tracking', label: 'Order Tracking', icon: Truck },
            { id: 'location', label: 'Pinpoint Location', icon: MapPin },
            { id: 'ritual', label: 'Skincare Layering', icon: Droplets },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#0B2419] text-[#D4AF37] shadow-sm'
                    : 'text-stone-600 hover:bg-black/5 hover:text-[#0B2419]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: PASSWORD & LOGIN GUIDE */}
          {activeTab === 'password' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="rounded-2xl bg-gradient-to-br from-[#0B2419]/5 to-[#D4AF37]/10 p-5 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center gap-5">
                {/* Animated Padlock SVG */}
                <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    <circle cx="50" cy="50" r="46" fill="#0B2419" stroke="#D4AF37" strokeWidth="2" opacity="0.1" />
                    {/* Animated Shackle */}
                    <path
                      d="M 38 45 V 32 A 12 12 0 0 1 62 32 V 45"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="5"
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="d"
                        values="M 38 45 V 32 A 12 12 0 0 1 62 32 V 45; M 38 45 V 26 A 12 12 0 0 1 62 26 V 38; M 38 45 V 32 A 12 12 0 0 1 62 32 V 45"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </path>
                    {/* Lock Body */}
                    <rect x="30" y="45" width="40" height="34" rx="8" fill="#0B2419" stroke="#D4AF37" strokeWidth="2.5" />
                    <circle cx="50" cy="59" r="4" fill="#D4AF37" />
                    <path d="M 50 63 V 69" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="space-y-1 text-center sm:text-left flex-1">
                  <h4 className="font-serif text-lg font-bold text-[#0B2419]">Password &amp; Account Security Guide</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Protecting your account details and order history. Follow our instant checklist to create a compliant, rock-solid password.
                  </p>
                </div>
              </div>

              {/* 3 Steps Visual Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-[#0B2419] text-[#D4AF37] font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h5 className="font-bold text-xs text-[#0B2419]">Enter Your Email</h5>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Go to <Link to="/forgot-password" onClick={onClose} className="text-[#8B5A2B] underline font-semibold">Forgot Password</Link> and enter your registered email.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-[#0B2419] text-[#D4AF37] font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h5 className="font-bold text-xs text-[#0B2419]">Check 6-Digit OTP</h5>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    A secure one-time verification code is sent instantly to your inbox (check Spam if needed).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-[#0B2419] text-[#D4AF37] font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <h5 className="font-bold text-xs text-[#0B2419]">Set New Password</h5>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Enter OTP and choose at least 8 chars with 1 uppercase, 1 lowercase, 1 number &amp; 1 symbol.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                <span>Have a typo like "passpot" or "paswrd"? Our AI understands and helps you instantly.</span>
                <Link
                  to="/forgot-password"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-xl bg-[#0B2419] text-[#D4AF37] font-bold text-xs shrink-0 ml-3"
                >
                  Reset Password →
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: DAMAGED ITEMS & COURTESY CREDIT */}
          {activeTab === 'damaged' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="rounded-2xl bg-gradient-to-br from-[#0B2419]/5 to-amber-500/10 p-5 border border-amber-500/30 flex flex-col sm:flex-row items-center gap-5">
                {/* Animated Courtesy Wallet & Shield SVG */}
                <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    <circle cx="50" cy="50" r="44" fill="#0B2419" opacity="0.08" />
                    {/* Protective Hexagon */}
                    <polygon
                      points="50,14 84,32 84,68 50,86 16,68 16,32"
                      fill="#0B2419"
                      stroke="#D4AF37"
                      strokeWidth="2.5"
                    />
                    {/* Golden Coin with shimmer */}
                    <circle cx="50" cy="50" r="16" fill="#D4AF37" stroke="#FFFFFF" strokeWidth="1.5">
                      <animate
                        attributeName="r"
                        values="15; 17; 15"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <text x="50" y="55" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#0B2419">
                      ₹
                    </text>
                  </svg>
                </div>

                <div className="space-y-1 text-center sm:text-left flex-1">
                  <h4 className="font-serif text-lg font-bold text-[#0B2419]">Cosmetics Hygiene &amp; Courtesy Credit Policy</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Personal care botanicals (Face Wash &amp; Shampoo) cannot be physically restocked once delivered. In case of damage, our 100% Courtesy Guarantee replaces or credits without return shipping.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h5 className="font-bold text-xs text-[#0B2419]">Snap a Photo</h5>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Take a clear picture of the leaking bottle, cracked cap, or damaged box showing the shipping label.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h5 className="font-bold text-xs text-[#0B2419]">Send via AI or WhatsApp</h5>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Share your photo and Order ID with our concierge or WhatsApp (+91 74309 85647) within 48 hours.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <h5 className="font-bold text-xs text-[#0B2419]">Instant Replacement</h5>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Zero return shipment required. We dispatch a fresh bottle or deposit 100% courtesy credit into your wallet!
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Link
                  to="/returns"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#0B2419] text-[#D4AF37] font-bold text-xs hover:bg-[#163c2a] transition-all"
                >
                  View Full Guarantee Policy →
                </Link>
              </div>
            </div>
          )}

          {/* TAB 3: ORDER TRACKING */}
          {activeTab === 'tracking' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="rounded-2xl bg-gradient-to-br from-[#0B2419]/5 to-emerald-500/10 p-5 border border-emerald-500/30 flex flex-col sm:flex-row items-center gap-5">
                {/* Animated Delivery Van SVG */}
                <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    <circle cx="50" cy="50" r="44" fill="#0B2419" opacity="0.08" />
                    {/* Van Body */}
                    <path
                      d="M 20 40 L 60 40 L 75 52 L 75 66 L 20 66 Z"
                      fill="#0B2419"
                      stroke="#D4AF37"
                      strokeWidth="2.5"
                    />
                    {/* Van Window */}
                    <polygon points="62,44 72,53 62,53" fill="#D4AF37" opacity="0.7" />
                    {/* Wheels */}
                    <circle cx="35" cy="66" r="8" fill="#143725" stroke="#D4AF37" strokeWidth="2">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 35 66"
                        to="360 35 66"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="65" cy="66" r="8" fill="#143725" stroke="#D4AF37" strokeWidth="2">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 65 66"
                        to="360 65 66"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                </div>

                <div className="space-y-1 text-center sm:text-left flex-1">
                  <h4 className="font-serif text-lg font-bold text-[#0B2419]">Live Express Delivery Tracking</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Partnered with Delhivery, BlueDart &amp; DTDC. Real-time updates delivered to your WhatsApp and SMS.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-stone-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#0B2419]">Order Confirmed &amp; Botanical Formulation</h5>
                    <p className="text-[11px] text-stone-600">Dispatched from our sterile apothecary within 12–24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-stone-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#0B2419]">Air &amp; Ground Express Transit</h5>
                    <p className="text-[11px] text-stone-600">2–3 business days for Metros, 3–5 days for other regions across India.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-stone-200">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#0B2419] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ●
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#0B2419]">Doorstep Delivery with Live Pin Verification</h5>
                    <p className="text-[11px] text-stone-600">Direct handover using your exact GPS pinned address.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Link
                  to="/order-tracking"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#0B2419] text-[#D4AF37] font-bold text-xs hover:bg-[#163c2a] transition-all"
                >
                  Open Live Order Tracker →
                </Link>
              </div>
            </div>
          )}

          {/* TAB 4: PINPOINT GOOGLE MAPS LOCATION */}
          {activeTab === 'location' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="rounded-2xl bg-gradient-to-br from-[#0B2419]/5 to-sky-500/10 p-5 border border-sky-500/30 flex flex-col sm:flex-row items-center gap-5">
                {/* Animated Pin Drop on Map SVG */}
                <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    <circle cx="50" cy="50" r="44" fill="#0B2419" opacity="0.08" />
                    {/* Radar Pulse */}
                    <circle cx="50" cy="68" r="16" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                      <animate attributeName="r" values="8; 24; 8" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8; 0; 0.8" dur="2s" repeatCount="indefinite" />
                    </circle>
                    {/* Map Pin Dropping */}
                    <g>
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0 -4; 0 2; 0 -4"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <path
                        d="M 50 25 C 41 25 34 32 34 41 C 34 53 50 70 50 70 C 50 70 66 53 66 41 C 66 32 59 25 50 25 Z"
                        fill="#0B2419"
                        stroke="#D4AF37"
                        strokeWidth="2.5"
                      />
                      <circle cx="50" cy="41" r="5" fill="#D4AF37" />
                    </g>
                  </svg>
                </div>

                <div className="space-y-1 text-center sm:text-left flex-1">
                  <h4 className="font-serif text-lg font-bold text-[#0B2419]">Google Maps Exact Pinpoint Delivery</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Never worry about delivery agents calling from the wrong street. Pin your exact door location on our interactive map.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 text-xs leading-relaxed">
                <p><strong>1. How to Pin Your Location:</strong> Open your <Link to="/profile" onClick={onClose} className="text-[#8B5A2B] underline font-semibold">Address Book</Link> or the Checkout page and tap <em>"Use My Current Location / Pin on Map"</em>.</p>
                <p><strong>2. Accuracy Verification:</strong> Move the golden pin directly over your building or apartment gate.</p>
                <p><strong>3. Driver Direct Access:</strong> The generated Google Maps link is shared with the courier driver's navigation app for direct doorstep arrival.</p>
              </div>

              <div className="flex justify-end pt-2">
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#0B2419] text-[#D4AF37] font-bold text-xs hover:bg-[#163c2a] transition-all"
                >
                  Manage Address Book →
                </Link>
              </div>
            </div>
          )}

          {/* TAB 5: SKINCARE LAYERING PROTOCOL */}
          {activeTab === 'ritual' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="rounded-2xl bg-gradient-to-br from-[#0B2419]/5 to-[#D4AF37]/15 p-5 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    <circle cx="50" cy="50" r="44" fill="#0B2419" opacity="0.08" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="6 4">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="10s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <path
                      d="M 50 26 C 50 26 62 44 62 54 A 12 12 0 0 1 38 54 C 38 44 50 26 50 26 Z"
                      fill="#D4AF37"
                      stroke="#0B2419"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="space-y-1 text-center sm:text-left flex-1">
                  <h4 className="font-serif text-lg font-bold text-[#0B2419]">Chronobiological AM &amp; PM Skincare Layering</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Designed to work with your body's circadian rhythm. Antioxidant barrier defense by day, deep cellular renewal by night.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">☀️ Morning Awakening (AM)</span>
                  <p className="text-xs font-semibold text-[#0B2419]">1. Cleanse: Sea Buckthorn Face Wash (1 pump, 40s massage + 15s dwell)</p>
                  <p className="text-xs text-stone-600">2. Hydrate: Apply toner/hyaluronic serum on 15% damp skin within 60s.</p>
                  <p className="text-xs text-stone-600">3. Shield: Finish with lightweight moisturizer and SPF 50 sunscreen.</p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">🌙 Evening Detox &amp; Renewal (PM)</span>
                  <p className="text-xs font-semibold text-[#0B2419]">1. Detox: Charcoal Face Wash (1.5 pumps) to lift PM2.5 city pollution.</p>
                  <p className="text-xs text-stone-600">2. Pat: Lightly dry to 15% dampness.</p>
                  <p className="text-xs font-semibold text-[#0B2419]">3. Elixir Press: Warm 2–3 drops of Kumkumadi Night Elixir &amp; leave on overnight.</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('bhumivera:open-support-chat', { detail: { prompt: '__OPEN_RITUAL_PLAYER__' } }));
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0B2419] text-[#D4AF37] font-bold text-xs hover:bg-[#163c2a] transition-all"
                >
                  Launch 4-Phase Ritual Timer →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
