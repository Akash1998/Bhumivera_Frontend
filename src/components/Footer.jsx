import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  ShieldCheck,
  Scale,
  Lock,
  Sparkles,
  Play,
  X,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';
import BhumiveraVideo from './BhumiveraVideo';
import { triggerAiCopilotAssist } from '../utils/aiCopilotBus';

const FOOTER_VIDEO_REELS = [
  {
    id: 'planting',
    code: '01',
    title: 'Planting & Earth Vision',
    subtitle: 'Native Afforestation & Stewardship',
    src: '/assets/videos/planting-vision.mp4',
    poster: '/assets/images/plant tree.webp',
    description:
      'Our live botanical vision replaces static illustrative artwork with continuous on-ground stewardship cinema. Optional COD pledges are reconciled into our verified public ledger after delivery.',
  },
  {
    id: 'science',
    code: '02',
    title: 'Botanical & Active Science',
    subtitle: 'Sea Buckthorn, Niacinamide & Hyaluronic Acid',
    src: '/assets/videos/aloe-science-lab.mp4',
    poster: '/assets/images/aloeverascience.webp',
    description:
      'Inspect the cellular synergy between cold-pressed Himalayan botanicals and precision dermatological actives calibrated for pH-balanced daily cleansing and barrier care.',
  },
  {
    id: 'unboxing',
    code: '03',
    title: '360° Unboxing & Seal Protocol',
    subtitle: 'Anti-Fraud & Courtesy Credit Verification',
    src: '/assets/videos/unboxing-protection.mp4',
    poster: '/assets/images/Promo1.webp',
    description:
      'Every Bhumivera dispatch is weighed, CCTV-recorded, and tamper-sealed. Record a continuous 360° uncut unboxing video showing the outer AWB label and seal within 48 hours of delivery to unlock instant Courtesy Replacement or Wallet Credit.',
  },
  {
    id: 'rivers',
    code: '04',
    title: 'River & Community Care',
    subtitle: 'Waterway & Botanical Ecosystem Focus',
    src: '/assets/videos/river-stewardship.mp4',
    poster: '/assets/images/river free.webp',
    description:
      'Discover how community-led river care and botanical education guide our long-term environmental focus areas across India.',
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [activeReel, setActiveReel] = useState(null);

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0d1712] font-sans text-[#f1efe7] antialiased">
      {/* 1. CINEMATIC AMBIENT VIDEO CONCIERGE BANNER */}
      <div className="relative isolate overflow-hidden border-b border-white/10 bg-[#13211a]">
        <div className="absolute inset-0 -z-20 opacity-30" aria-hidden="true">
          <img
            src="/assets/images/foundermanifesto.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0d1712]/95 via-[#0d1712]/85 to-[#0d1712]/65" />

        <div className="w-full px-[clamp(1.25rem,4vw,4.5rem)] py-12 sm:py-16">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#c8d6aa]">
                <Film size={13} className="text-[#d4af37]" /> Bhumivera · Botanical care, thoughtfully made
              </p>
              <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Care, returned to its source.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                Explore the botanicals, people, and considered practices behind every Bhumivera ritual.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <button
                type="button"
                onClick={() =>
                  triggerAiCopilotAssist({
                    mode: 'navigation_rescue',
                    title: 'Bhumivera Client Concierge & Site Guide',
                    message:
                      'How can I assist you today? I can help you add items to your cart, set or reset your password, track an order, verify unboxing & courtesy credit rules, or jump to any page on Bhumivera.',
                  })
                }
                className="inline-flex min-h-11 items-center gap-2 bg-[#d4af37] px-4 py-2.5 text-xs font-bold text-[#071a12] transition-colors hover:bg-[#e5c247]"
              >
                <Sparkles size={14} /> Ask our concierge
              </button>
              <Link
                to="/science#ingredients"
                className="inline-flex min-h-11 items-center gap-2 bg-[#dce7c5] px-4 py-2.5 text-xs font-semibold text-[#19271e] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dce7c5]"
              >
                Explore the ingredients <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          {/* 2. INTERACTIVE 4-REEL VIDEO GALLERY STRIP IN FOOTER */}
          <div className="mt-9 border-t border-white/10 pt-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8d6aa]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                From our world
              </span>
              <span className="text-[10px] text-white/50">Select a story to watch</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {FOOTER_VIDEO_REELS.map(reel => (
                <button
                  key={reel.id}
                  onClick={() => setActiveReel(reel)}
                  type="button"
                  aria-label={`Play video reel: ${reel.title}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e1914] text-left transition hover:-translate-y-0.5 hover:border-[#d4af37]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={reel.poster}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09120e]/95 via-[#09120e]/35 to-transparent pointer-events-none" />
                  <div className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-[#d4af37] backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-[#09120e]">
                    <Play size={12} className="fill-current" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3.5 pointer-events-none">
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#d4af37]">
                      REEL {reel.code} · {reel.subtitle}
                    </p>
                    <h3 className="mt-0.5 font-serif text-base text-white group-hover:text-[#dce7c5]">
                      {reel.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOOTER DIRECTORY */}
      <div className="grid w-full grid-cols-2 gap-4 border-b border-white/10 bg-[#0c1712] px-[clamp(1.25rem,4vw,4.5rem)] py-10 sm:grid-cols-3 sm:gap-5 sm:py-14 xl:grid-cols-6">
        {/* Column 1: Bhumivera Store */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
          <h3 className="mb-4 border-b border-white/10 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">
            Bhumivera Store
          </h3>
          <ul className="space-y-2.5 text-xs leading-5 text-white/65 sm:text-sm">
            <li>
              <Link to="/shop" className="transition-colors hover:text-white">
                Shop the collection
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-white">
                Our story
              </Link>
            </li>
            <li>
              <Link to="/impact" className="transition-colors hover:text-white">
                Our impact
              </Link>
            </li>
            <li>
              <Link to="/science" className="transition-colors hover:text-white">
                Product science
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="transition-colors hover:text-white">
                Saved Wishlist
              </Link>
            </li>
            <li>
              <Link to="/compare" className="transition-colors hover:text-white">
                Compare Formulations
              </Link>
            </li>
            <li>
              <Link to="/somatic-registry" className="transition-colors hover:text-white">
                Somatic Label Registry
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Account & Security */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
          <h3 className="mb-4 border-b border-white/10 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">
            Account &amp; Security
          </h3>
          <ul className="space-y-2.5 text-xs leading-5 text-white/65 sm:text-sm">
            <li>
              <Link to="/login" className="transition-colors hover:text-white">
                Customer Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="transition-colors hover:text-white">
                Create Account
              </Link>
            </li>
            <li>
              <Link to="/forgot-password" className="transition-colors hover:text-white">
                Forgot / Reset Password (AI Assist)
              </Link>
            </li>
            <li>
              <Link to="/profile" className="transition-colors hover:text-white">
                My Profile, Wallet &amp; Orders
              </Link>
            </li>
            <li>
              <Link to="/address-book" className="transition-colors hover:text-white">
                Address Book &amp; Pinpoint
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="transition-colors hover:text-white">
                Secure Checkout
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Authenticity & Partners */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
          <h3 className="mb-4 border-b border-white/10 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">
            Authenticity &amp; Partners
          </h3>
          <ul className="space-y-2.5 text-xs leading-5 text-white/65 sm:text-sm">
            <li>
              <Link to="/ewarranty" className="transition-colors hover:text-white">
                Verify product &amp; E-Warranty
              </Link>
            </li>
            <li>
              <Link to="/provenance-engine" className="transition-colors hover:text-white">
                Provenance &amp; Batch Guide
              </Link>
            </li>
            <li>
              <Link to="/affiliate" className="transition-colors hover:text-white">
                Become an affiliate
              </Link>
            </li>
            <li>
              <Link to="/contact?topic=sell" className="transition-colors hover:text-white">
                Sell on Bhumivera
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Customer Care */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
          <h3 className="mb-4 border-b border-white/10 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">
            Customer care
          </h3>
          <ul className="space-y-2.5 text-xs leading-5 text-white/65 sm:text-sm">
            <li>
              <Link to="/order-tracking" className="transition-colors hover:text-white">
                Track an order
              </Link>
            </li>
            <li>
              <Link to="/returns" className="transition-colors hover:text-white">
                Damaged Items &amp; Courtesy Credit
              </Link>
            </li>
            <li>
              <Link to="/returns-centre" className="transition-colors hover:text-white">
                Returns &amp; Resolution Centre
              </Link>
            </li>
            <li>
              <Link to="/purchase-protection" className="transition-colors hover:text-white">
                Purchase &amp; Order Protection
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-white">
                Help &amp; Support Guide
              </Link>
            </li>
            <li>
              <a href="mailto:support@bhumivera.com" className="break-words transition-colors hover:text-white">
                support@bhumivera.com
              </a>
            </li>
            <li>
              <a href="tel:+917430985647" className="transition-colors hover:text-white">
                +91 74309 85647
              </a>
            </li>
          </ul>
        </div>

        {/* Column 5: Legal & Anti-Fraud Shield (NEW 4X LEGAL SUITE) */}
        <div className="rounded-2xl border border-[#d4af37]/15 bg-[#d4af37]/[0.035] p-4 sm:p-5">
          <h3 className="mb-4 border-b border-[#d4af37]/15 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4af37] sm:mb-5 sm:text-xs">
            Legal &amp; Anti-Fraud Shield
          </h3>
          <ul className="space-y-2.5 text-xs leading-5 text-white/65 sm:text-sm">
            <li>
              <Link to="/legal?section=terms" className="transition-colors hover:text-[#e5c247]">
                Conditions of Use &amp; Sale
              </Link>
            </li>
            <li>
              <Link to="/legal?section=orders" className="transition-colors hover:text-[#e5c247]">
                Shipping &amp; Hygiene Non-Return
              </Link>
            </li>
            <li>
              <Link to="/legal?section=antifraud" className="transition-colors hover:text-[#e5c247]">
                360° Unboxing &amp; Anti-Scam Rules
              </Link>
            </li>
            <li>
              <Link to="/legal?section=referrals" className="transition-colors hover:text-[#e5c247]">
                Wallet, Loyalty &amp; Referral Terms
              </Link>
            </li>
            <li>
              <Link to="/legal?section=warranty_affiliate" className="transition-colors hover:text-[#e5c247]">
                Warranty, Affiliate &amp; B2B Terms
              </Link>
            </li>
            <li>
              <Link to="/legal?section=privacy" className="transition-colors hover:text-[#e5c247]">
                Privacy &amp; DPDP Act Notice
              </Link>
            </li>
            <li>
              <Link to="/legal?section=ip_disclaimer" className="transition-colors hover:text-[#e5c247]">
                Medical Disclaimer &amp; IP Shield
              </Link>
            </li>
            <li>
              <Link to="/legal?section=grievance" className="transition-colors hover:text-[#e5c247]">
                Arbitration &amp; Grievance Officer
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 6: Connect With Us */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
          <h3 className="mb-4 border-b border-white/10 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">
            Connect With Us
          </h3>
          <ul className="space-y-2.5 text-xs leading-5 text-white/65 sm:text-sm">
            <li>
              <a
                href="https://www.instagram.com/the_rsenterprises"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com/Bhumivera"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/Bhumivera"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                X (Twitter)
              </a>
            </li>
            <li>
              <a
                href="https://t.me/bhumivera"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                Telegram Community
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/917430985647"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                WhatsApp Support Desk
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. STATUTORY COMPLIANCE, ANTI-SCAM & CONSUMER PROTECTION SHIELD BAR */}
      <div className="border-t border-white/10 bg-[#0a120e]">
        <div className="w-full px-[clamp(1.25rem,4vw,4.5rem)] py-8 sm:py-10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#d4af37]" />
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#dce7c5]">
                  Hygiene Seal &amp; Non-Return Standard
                </h4>
                <p className="mt-1 text-[11px] leading-5 text-white/55">
                  Personal-care cosmetics are non-returnable once delivered under hygiene safety laws. Damaged arrivals qualify for Courtesy Replacement or Wallet Credit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <FileCheck2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#dce7c5]">
                  Mandatory 360° Unboxing Video Rule
                </h4>
                <p className="mt-1 text-[11px] leading-5 text-white/55">
                  Any transit-damage, leakage, or missing-item claim must include an uncut, unedited 360° unboxing video showing the sealed outer box &amp; AWB within 48 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <Lock size={18} className="mt-0.5 shrink-0 text-[#d4af37]" />
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#dce7c5]">
                  Cryptographic &amp; CCTV Fraud Shield
                </h4>
                <p className="mt-1 text-[11px] leading-5 text-white/55">
                  Dispatches are weight-logged and CCTV-recorded. Promotional/Referral credits are non-withdrawable, and false chargebacks or Sybil abuse trigger permanent blacklisting.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <Scale size={18} className="mt-0.5 shrink-0 text-emerald-400" />
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#dce7c5]">
                  Statutory &amp; Arbitration Governance
                </h4>
                <p className="mt-1 text-[11px] leading-5 text-white/55">
                  Protected under CPA 2019, E-Commerce Rules 2020, IT Act 2000, DPDP Act 2023 &amp; Indian Contract Act 1872, with binding arbitration &amp; West Bengal jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM LEGAL & BRAND CREST BAR */}
      <div className="border-t border-white/10 bg-[#070d0a]">
        <div className="flex w-full flex-col items-center gap-5 px-[clamp(1.25rem,4vw,4.5rem)] py-7 lg:flex-row lg:justify-between">
          <Link to="/" aria-label="Bhumivera home" className="flex items-center gap-3.5">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#d4af37]/40 bg-[#111c17]">
              <BhumiveraVideo
                src="/assets/videos/seabuckthorn-botanical.mp4"
                poster="/logo.webp"
                alt="Bhumivera Crest Video Emblem"
                className="h-full w-full object-cover opacity-50"
                containerClassName="relative h-full w-full overflow-hidden"
              />
              <img
                src="/logo.webp"
                alt="Bhumivera Crest"
                width="48"
                height="48"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain p-1"
              />
            </div>
            <div>
              <span className="block font-serif text-sm tracking-[0.18em] text-white/90">BHUMIVERA</span>
              <span className="block text-[9px] uppercase tracking-[0.16em] text-[#c8d6aa]/70">
                Botanical Maison · Est. India
              </span>
            </div>
          </Link>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-white/55 sm:text-xs">
            <Link to="/legal" className="transition-colors hover:text-[#c8d6aa]">
              Legal information
            </Link>
          </div>

          <p className="text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40 lg:text-right">
            © {currentYear} Bhumivera · Care, returned to its source
          </p>
        </div>
      </div>

      {/* 6. INTERACTIVE FOOTER VIDEO REEL MODAL */}
      {activeReel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-reel-modal-title"
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={e => {
            if (e.target === e.currentTarget) setActiveReel(null);
          }}
        >
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#101c16] text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveReel(null)}
              aria-label="Close video reel modal"
              className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white hover:bg-white hover:text-black"
            >
              <X size={16} />
            </button>
            <div className="grid md:grid-cols-[1.25fr_0.75fr]">
              <div className="aspect-[16/9] bg-black md:aspect-auto md:min-h-[360px]">
                <BhumiveraVideo
                  src={activeReel.src}
                  poster={activeReel.poster}
                  alt={activeReel.title}
                  className="h-full w-full object-cover"
                  containerClassName="relative h-full w-full overflow-hidden"
                  badge={`REEL ${activeReel.code} · LIVE HD`}
                  showControls
                  muted={false}
                />
              </div>
              <div className="flex flex-col justify-between p-6 sm:p-7">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                    Bhumivera Cinema · Reel {activeReel.code}
                  </span>
                  <h3 id="footer-reel-modal-title" className="mt-2 font-serif text-2xl text-white">
                    {activeReel.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-[#c8d6aa]">{activeReel.subtitle}</p>
                  <p className="mt-4 text-xs leading-6 text-white/75 sm:text-sm">{activeReel.description}</p>

                  <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-[11px] text-white/65">
                    <p className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      100% Video-First Botanical &amp; Fulfilment Transparency
                    </p>
                    <p className="flex items-center gap-2">
                      <AlertTriangle size={13} className="text-[#d4af37] shrink-0" />
                      Protected by Bhumivera Master Legal &amp; Anti-Scam Terms
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2.5 pt-4">
                  <Link
                    to="/legal?section=all"
                    onClick={() => setActiveReel(null)}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                  >
                    View Full 8-Part Master Legal Agreement
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
