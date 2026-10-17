import React, { useEffect } from 'react';
import { ShieldCheck, Sparkles, AlertCircle, Camera, CheckCircle2, Wallet, HeadphonesIcon, Film, Scale, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BhumiveraVideo from '../components/BhumiveraVideo';

export default function Returns() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans pb-20">
      {/* Hero Section with Live Video Background */}
      <div className="bg-gradient-to-br from-[#0B2419] via-[#1a3828] to-[#0d281c] text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <BhumiveraVideo
            src="/assets/videos/unboxing-protection.mp4"
            poster="/assets/images/Promo1.webp"
            alt="Bhumivera 360 degree unboxing and courtesy guarantee video"
            className="h-full w-full object-cover"
            containerClassName="relative h-full w-full overflow-hidden"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2419]/90 via-[#0B2419]/80 to-[#0B2419]/95" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-6">
            <ShieldCheck className="w-4 h-4" /> Hygiene &amp; Courtesy Guarantee · Video Verified
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-6 tracking-tight">
            Replacement &amp; Courtesy Credit Policy
          </h1>
          <p className="text-base sm:text-lg text-[#FDFBF7]/85 max-w-2xl mx-auto leading-relaxed">
            Because our botanicals (Face Washes, Shampoos &amp; Night Elixirs) are intimate personal care cosmetics, we do not accept physical returns for hygiene and safety reasons. Instead, we offer a <strong className="text-[#D4AF37]">100% Zero-Hassle Courtesy Protection Guarantee</strong> backed by our mandatory 360° Unboxing Video Verification Protocol.
          </p>
        </div>
      </div>

      {/* Hygiene Policy Banner */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#0B2419]/10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-600">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 text-center md:text-left flex-1">
            <h3 className="text-lg font-bold text-[#0B2419]">Cosmetics Hygiene &amp; Mandatory 360° Unboxing Video Standard</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Under the Drugs and Cosmetics Act, 1940 and Consumer Protection (E-Commerce) Rules, 2020, opened or delivered personal care items cannot be restocked. If your bottle arrives damaged, leaking, defective, or incorrect, you <strong className="text-emerald-700">never have to ship it back</strong>—simply submit your continuous <strong>360° uncut unboxing video</strong> and photo within <strong>48 hours of delivery</strong> for an immediate replacement or 100% Bhumivera Wallet credit.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('bhumivera:open-support-chat', { detail: { prompt: 'My item arrived damaged, how do I get a replacement or courtesy credit?' } }))}
            className="px-5 py-3 rounded-2xl bg-[#0B2419] text-[#D4AF37] font-bold text-xs hover:bg-[#153e2b] transition-all shrink-0 flex items-center gap-2 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Ask Concierge Guide
          </button>
        </div>
      </div>

      {/* Live Video Demonstration of Unboxing & Seal Inspection */}
      <div className="max-w-6xl mx-auto px-4 mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#0B2419] text-white rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/15">
            <BhumiveraVideo
              src="/assets/videos/unboxing-protection.mp4"
              poster="/assets/images/Promo1.webp"
              alt="Bhumivera 360 unboxing and seal verification film"
              className="h-full w-full object-cover"
              containerClassName="relative h-full w-full overflow-hidden"
              badge="Mandatory 360° Unboxing Protocol · HD Video"
              showControls
            />
          </div>
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              <Film size={14} /> Anti-Scam &amp; Buyer Protection Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">
              How to Record a Valid 360° Unboxing Video
            </h2>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
              To protect genuine customers and prevent fraudulent empty-box or post-opening damage claims, every Bhumivera shipment is weighed and filmed under warehouse CCTV prior to dispatch.
            </p>
            <ul className="space-y-2 text-xs text-white/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Step A:</strong> Begin recording BEFORE cutting or breaking the outer courier tamper-evident tape, clearly showing the shipping AWB label and all 6 sides (360°) of the parcel.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Step B:</strong> Keep the parcel in frame continuously with zero pauses, cuts, splices, or camera obstructions while opening the box and inspecting the bottle seal and batch/serial code.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Step C:</strong> Submit the video and clear photos within 48 hours of the carrier’s delivery timestamp.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/legal?section=antifraud"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
              >
                <Scale size={14} /> View Full Legal Anti-Fraud &amp; Unboxing Clause <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Step Courtesy Resolution Process */}
      <div className="max-w-6xl mx-auto px-4 mt-16 sm:mt-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Zero-Friction Resolution</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0B2419] mt-2">What to Do If an Item Arrives Damaged</h2>
          <p className="text-stone-600 text-sm mt-3">Follow these 3 easy steps within 48 hours of package delivery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              icon: Camera,
              badge: '360° Video & Photo',
              title: 'Record Uncut Unboxing & Photo',
              desc: 'Capture an unpaused 360° unboxing video from sealed outer box to inner bottle, plus a clear photo showing the bottle label, batch/serial number, and shipping AWB.',
            },
            {
              step: '02',
              icon: HeadphonesIcon,
              badge: 'Instant Connect',
              title: 'Send via Concierge or WhatsApp',
              desc: 'Share your order ID, unboxing video, and photo with our Client Concierge, WhatsApp (+91 74309 85647), or support@bhumivera.com within 48 hours of delivery.',
            },
            {
              step: '03',
              icon: Wallet,
              badge: 'Direct Resolution',
              title: 'Instant Replacement or Store Credit',
              desc: 'Once verified against our warehouse dispatch log, choose between an immediate free replacement dispatched to your door OR 100% courtesy credit into your Bhumivera Wallet!',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-3xl shadow-sm border border-[#0B2419]/10 relative group hover:shadow-lg hover:border-[#D4AF37]/50 transition-all duration-300"
            >
              <div className="text-6xl font-black text-[#D4AF37]/15 absolute top-4 right-5 select-none pointer-events-none">
                {item.step}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#0B2419]/5 border border-[#0B2419]/10 flex items-center justify-center text-[#0B2419] mb-5 group-hover:bg-[#0B2419] group-hover:text-[#D4AF37] transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {item.badge}
              </span>
              <h3 className="text-lg font-bold text-[#0B2419] mt-3 mb-2">{item.title}</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions on Courtesy Protection */}
      <div className="max-w-4xl mx-auto px-4 mt-20">
        <h3 className="text-2xl font-serif font-bold text-[#0B2419] text-center mb-8">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#0B2419]/10">
            <h4 className="font-bold text-sm text-[#0B2419] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Why can&apos;t I return a face wash or shampoo if I changed my mind?
            </h4>
            <p className="text-xs text-stone-600 mt-2 pl-6 leading-relaxed">
              Face wash, shampoo, and botanical elixirs are intimate, microbial-sensitive personal hygiene liquids. Once a product leaves our sterile warehouse seals, Indian drug and cosmetic safety regulations prohibit putting it back into circulation. This guarantees 100% uncompromised purity for every customer.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#0B2419]/10">
            <h4 className="font-bold text-sm text-[#0B2419] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Why is a continuous 360° uncut unboxing video mandatory for damage or missing-item claims?
            </h4>
            <p className="text-xs text-stone-600 mt-2 pl-6 leading-relaxed">
              Every order is packed under high-definition warehouse CCTV and digital weight-verification scales. Requiring an unpaused 360° unboxing video showing the intact shipping label and outer seal before opening protects genuine customers while eliminating courier tampering and fraudulent post-opening claims.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#0B2419]/10">
            <h4 className="font-bold text-sm text-[#0B2419] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              How long does it take to receive courtesy store credit?
            </h4>
            <p className="text-xs text-stone-600 mt-2 pl-6 leading-relaxed">
              Once your damage claim is verified by our team (typically under 24 hours), store credit is deposited instantly into your Bhumivera Account Wallet. It applies seamlessly during checkout on your next order.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#0B2419]/10">
            <h4 className="font-bold text-sm text-[#0B2419] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Do I have to wait for courier pickup to get my replacement?
            </h4>
            <p className="text-xs text-stone-600 mt-2 pl-6 leading-relaxed">
              No! That is the core of our Courtesy Protection. You never have to wait for a reverse pickup or hand over a broken bottle to a delivery agent. We dispatch a brand-new replacement immediately upon video &amp; photo verification.
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="max-w-4xl mx-auto px-4 mt-16 text-center bg-white p-8 sm:p-12 rounded-3xl border border-[#0B2419]/10 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0B2419] mb-3">Need Help with an Order?</h2>
        <p className="text-stone-600 text-xs sm:text-sm mb-6 max-w-xl mx-auto leading-relaxed">
          Open your order history to view tracking details, review our full legal conditions, or message our live client concierge right now.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/profile"
            className="px-6 py-3.5 bg-[#0B2419] hover:bg-[#1a4430] text-[#FDFBF7] font-bold text-xs rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2"
          >
            View My Orders
          </Link>
          <Link
            to="/legal?section=orders"
            className="px-6 py-3.5 border border-[#0B2419]/20 hover:bg-[#0B2419]/5 text-[#0B2419] font-bold text-xs rounded-xl transition-all inline-flex items-center justify-center gap-2"
          >
            Read Full Legal Policy
          </Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('bhumivera:open-support-chat', { detail: { prompt: 'How do I claim courtesy credit for a damaged item?' } }))}
            className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#c49e28] text-[#0B2419] font-bold text-xs rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Message AI Concierge
          </button>
        </div>
      </div>
    </div>
  );
}
