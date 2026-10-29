import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Scale,
  Lock,
  Sparkles,
  FileCheck2,
  ArrowRight,
  Phone,
  Mail,
  Send,
  ExternalLink,
  CheckCircle2,
  MapPin,
  Building2,
  Globe,
} from 'lucide-react';
import { triggerAiCopilotAssist } from '../utils/aiCopilotBus';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSent(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSent(false), 5000);
    }
  };

  return (
    <footer className="mt-auto border-t border-[#244A38]/50 bg-[#14291F] font-sans text-[#FAF7F2] antialiased">
      {/* 1. ARCHITECTURAL BRAND SHOWCASE & CLIENT CONCIERGE HERO */}
      <div className="relative isolate overflow-hidden border-b border-[#244A38]/60 bg-gradient-to-b from-[#102219] via-[#14291F] to-[#102219]">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[#244A38]/30 blur-[130px]" />

        <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-gradient-to-br from-[#1C382B] to-[#102219] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  <img
                    src="/logo.webp"
                    alt="Bhumivera Crest"
                    width="40"
                    height="40"
                    loading="lazy"
                    decoding="async"
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <div>
                  <a
                    href="https://bhumivera.com"
                    className="font-serif text-2xl font-bold tracking-[0.22em] text-[#D4AF37] sm:text-3xl hover:text-[#FCE096] transition-colors"
                  >
                    BHUMIVERA
                  </a>
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9BB0A5]">
                    The Transparent Maison · Est. 2016 Lineage · bhumivera.com
                  </span>
                </div>
              </div>

              <h2 className="mt-5 font-serif text-2xl leading-snug text-[#FAF7F2] sm:text-3xl lg:text-4xl font-bold">
                <span className="font-headline-gold">100% Active Botanicals,</span>{' '}
                <span className="font-headline-silver">Milligram Disclosed.</span>
              </h2>
              <div className="gold-hairline w-24 my-3" />
              <p className="mt-2 text-xs leading-relaxed text-[#DFD7C4] sm:text-sm max-w-xl font-light">
                Bhumivera™ is a brand of <strong className="text-white">Bhumivera Organics India Private Limited</strong> (Inc. August 4, 2026; Founder: Akash Prasad; Director: Payal Prasad). Backed by the 10-year manufacturing and consumer trust legacy of <strong className="text-white">MPG E-Business Private Limited</strong> (Est. September 22, 2016, Asansol · CIN: U74999WB2016PTC217735 · Founder: Dilip Prasad Nonia).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:justify-end">
              <button
                type="button"
                onClick={() =>
                  triggerAiCopilotAssist({
                    mode: 'navigation_rescue',
                    title: 'Bhumivera Client Concierge & Site Guide',
                    message:
                      'How may we assist your ritual today? I can help verify bottle genuinity, track transit weight logs, or inspect formulation ingredients.',
                  })
                }
                className="btn-gold-luxury inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-xl"
              >
                <Sparkles size={15} /> Client Concierge
              </button>

              <Link
                to="/verify"
                className="btn-silver-luxury inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wider"
              >
                <ShieldCheck size={16} className="text-[#D4AF37]" /> Product Verification
              </Link>

              <a
                href="https://bhumivera.com"
                className="two-tone-card inline-flex min-h-12 items-center gap-2 rounded-full border border-[#D4AF37]/30 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] hover:text-[#FCE096] transition-colors"
              >
                <Globe size={14} className="text-[#D4AF37]" /> bhumivera.com <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. UNIFIED LUXURY DIRECTORY (4 STREAMLINED EDITORIAL COLUMNS) */}
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: The Maison */}
          <div>
            <div className="mb-5 flex items-center gap-2 border-b border-[#244A38] pb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                The Maison
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#DFD7C4]">
              <li>
                <a
                  href="https://bhumivera.com"
                  className="transition-colors hover:text-[#D4AF37] flex items-center justify-between group font-semibold text-[#FCE096]"
                >
                  <span>Official Portal: bhumivera.com</span>
                  <span className="text-[10px] text-[#D4AF37] font-mono">Home</span>
                </a>
              </li>
              <li>
                <Link to="/shop" className="transition-colors hover:text-[#D4AF37] flex items-center justify-between group">
                  <span>Shop Collections</span>
                  <span className="text-[10px] text-[#9BB0A5] opacity-0 transition-opacity group-hover:opacity-100">Catalog</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-[#D4AF37] flex items-center justify-between group">
                  <span>Our 10-Year Heritage (Est. 2016)</span>
                </Link>
              </li>
              <li>
                <Link to="/science" className="transition-colors hover:text-[#D4AF37] flex items-center justify-between group">
                  <span>Sub-28°C Science &amp; pH 5.5</span>
                </Link>
              </li>
              <li>
                <Link to="/guides/ultimate-guide-luxury-organic-face-wash-india" className="transition-colors hover:text-[#D4AF37] flex items-center justify-between group">
                  <span>Guide: Best Luxury Organic Face Wash</span>
                </Link>
              </li>
              <li>
                <Link to="/guides/science-of-sulfate-free-luxury-herbal-shampoos" className="transition-colors hover:text-[#D4AF37] flex items-center justify-between group">
                  <span>Guide: Sulfate-Free Herbal Shampoos</span>
                </Link>
              </li>
              <li>
                <Link to="/impact" className="transition-colors hover:text-[#D4AF37] flex items-center justify-between group">
                  <span>Himalayan Harvest &amp; Impact</span>
                </Link>
              </li>
              <li>
                <Link to="/community" className="transition-colors hover:text-[#D4AF37] flex items-center justify-between group">
                  <span>Community &amp; Volunteer Hub</span>
                  <span className="text-[10px] text-[#D4AF37] font-bold font-mono">Join Free</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Corporate Footprint & Registered Offices */}
          <div>
            <div className="mb-5 flex items-center gap-2 border-b border-[#244A38] pb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                Registered Addresses
              </h3>
            </div>
            <div className="space-y-4 text-xs text-[#DFD7C4]">
              <div className="rounded-xl border border-[#244A38] bg-[#102219]/80 p-3.5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FCE096] flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#D4AF37]" /> Brand HQ (Bhumivera Organics)
                </p>
                <p className="mt-1 text-white font-semibold">Bhumivera Organics India Private Limited</p>
                <p className="mt-0.5 text-[#DFD7C4] leading-relaxed">
                  G.T. Road, Gopalpur, Asansol, WB 713304
                </p>
                <p className="mt-1 font-mono text-[10px] text-[#9BB0A5]">
                  Inc. August 4, 2026 · Director: Payal Prasad
                </p>
              </div>

              <div className="rounded-xl border border-[#244A38] bg-[#102219]/80 p-3.5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FCE096] flex items-center gap-1.5">
                  <Building2 size={12} className="text-[#D4AF37]" /> Heritage Corporate Office
                </p>
                <p className="mt-1 text-white font-semibold">MPG E-Business Private Limited</p>
                <p className="mt-0.5 text-[#DFD7C4] leading-relaxed">
                  608 BNR Sen Raleigh Road, Park Lane, Behind Spencer, Asansol, WB 713305
                </p>
                <p className="mt-1 font-mono text-[10px] text-[#9BB0A5]">
                  Est. Sept 22, 2016 · CIN: U74999WB2016PTC217735 · Founder: Dilip Prasad Nonia
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Client Care & Legal */}
          <div>
            <div className="mb-5 flex items-center gap-2 border-b border-[#244A38] pb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                Client Care &amp; Legal
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#DFD7C4]">
              <li>
                <Link to="/order-tracking" className="transition-colors hover:text-[#D4AF37] flex items-center justify-between group">
                  <span>Track Consignment AWB</span>
                  <span className="text-[10px] text-[#D4AF37] font-bold font-mono">Live</span>
                </Link>
              </li>
              <li>
                <Link to="/verify" className="inline-flex items-center gap-1.5 font-semibold text-[#D4AF37] transition-colors hover:text-white">
                  <ShieldCheck size={14} className="shrink-0" />
                  <span>Verify Product Serial</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-[#D4AF37]">
                  Boutique Concierge &amp; FAQ
                </Link>
              </li>
              <li>
                <Link to="/legal/conditions-of-use" className="transition-colors hover:text-[#D4AF37]">
                  Conditions of Sale &amp; Terms
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy-dpdp" className="transition-colors hover:text-[#D4AF37]">
                  DPDP Act 2023 &amp; Privacy Shield
                </Link>
              </li>
              <li className="pt-2">
                <a
                  href="mailto:support@bhumivera.com"
                  className="flex items-center gap-2 text-xs font-mono text-[#DFD7C4] transition-colors hover:text-[#D4AF37]"
                >
                  <Mail size={13} className="text-[#D4AF37] shrink-0" />
                  support@bhumivera.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+917430985647"
                  className="flex items-center gap-2 text-xs font-mono text-[#DFD7C4] transition-colors hover:text-[#D4AF37]"
                >
                  <Phone size={13} className="text-[#D4AF37] shrink-0" />
                  +91 74309 85647
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: The Gazette & Direct Channels */}
          <div>
            <div className="mb-5 flex items-center gap-2 border-b border-[#244A38] pb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                The Botanical Gazette
              </h3>
            </div>
            <p className="text-xs text-[#DFD7C4] leading-relaxed mb-3 font-light">
              Receive private micro-batch release schedules, botanical harvest essays, and client privilege invitations from <a href="https://bhumivera.com" className="text-[#FCE096] underline">bhumivera.com</a>.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full min-h-14 rounded-xl border border-[#244A38] bg-[#102219] px-3.5 py-2.5 pr-14 text-xs text-[#FAF7F2] placeholder-[#9BB0A5] focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to Gazette"
                  className="absolute right-1.5 top-1.5 grid min-h-11 min-w-11 place-items-center rounded-lg bg-[#D4AF37] text-[#14291F] hover:bg-[#FCE096] transition-colors"
                >
                  <Send size={13} />
                </button>
              </div>
              {newsletterSent && (
                <p className="text-[11px] text-[#D4AF37] font-medium flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> You are inscribed into our Gazette.
                </p>
              )}
            </form>
            <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-[#244A38]/60">
              <a
                href="https://linktr.ee/bhumivera"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#102219] px-3 py-1 text-[11px] font-semibold text-[#DFD7C4] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                <span>Bhumivera Linktree</span>
                <ExternalLink size={10} className="opacity-70" />
              </a>
              <a
                href="https://www.instagram.com/bhumivera"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#102219] px-3 py-1 text-[11px] font-semibold text-[#DFD7C4] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                <span>Instagram</span>
                <ExternalLink size={10} className="opacity-70" />
              </a>
              <a
                href="https://wa.me/917430985647"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#102219] px-3 py-1 text-[11px] font-semibold text-[#DFD7C4] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                <span>WhatsApp VIP</span>
                <ExternalLink size={10} className="opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CORPORATE LINEAGE & REGISTERED OFFICE NOTICE BAR */}
      <div className="border-t border-[#244A38]/50 bg-[#102219]">
        <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-12">
          <div className="rounded-2xl border border-[#D4AF37]/35 bg-[#070a0e]/80 p-5 text-xs leading-relaxed text-[#DFD7C4]">
            <p className="font-serif text-sm font-bold text-[#FCE096]">
              Bhumivera™ is a brand of Bhumivera Organics India Private Limited. Backed by the 10-year manufacturing and consumer trust legacy of MPG E-Business Private Limited (Est. 2016, Asansol).
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 text-[11px] text-[#9BB0A5]">
              <div>
                <strong className="text-white">Brand HQ:</strong> G.T. Road, Gopalpur, Asansol, WB 713304.
              </div>
              <div>
                <strong className="text-white">Heritage Corporate Office:</strong> 608 BNR Sen Raleigh Road, Park Lane, Asansol, WB 713305.
              </div>
              <div>
                <strong className="text-white">Official Digital Platform:</strong>{' '}
                <a href="https://bhumivera.com" className="text-[#D4AF37] underline hover:text-[#FCE096]">
                  bhumivera.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM TRADEMARK & PROMINENT FOUNDER BRANDING BAR */}
      <div className="border-t border-[#244A38]/50 bg-[#0D1C14] pb-28 sm:pb-8 pt-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:px-8 lg:flex-row lg:px-12">
          {/* Copyright & Trademark */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <p className="text-xs tracking-wider text-[#9BB0A5] font-light">
              © {currentYear}{' '}
              <a href="https://bhumivera.com" className="font-serif font-bold text-[#D4AF37] hover:underline">
                bhumivera.com
              </a>{' '}
              · Bhumivera Organics India Private Limited · All Rights Reserved
            </p>
          </div>

          {/* PROMINENT FOUNDER & ARCHITECT BRANDING: AKASH PRASAD */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9BB0A5] font-light">
              MPG Group Patriarch: Dilip Prasad Nonia (Est. 2016)
            </span>
            <span className="hidden sm:inline text-[#D4AF37]/50">•</span>
            <div className="group inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/15 px-4 py-1.5 shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all hover:bg-[#D4AF37] hover:scale-105">
              <Sparkles size={13} className="text-[#D4AF37] group-hover:text-[#102219] transition-colors" />
              <span className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] group-hover:text-[#102219] transition-colors">
                Founded &amp; Engineered By Akash Prasad
              </span>
            </div>
          </div>

          {/* Quick Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#DFD7C4] font-light">
            <a href="https://bhumivera.com" className="transition-colors hover:text-[#D4AF37] font-semibold text-[#FCE096]">
              bhumivera.com
            </a>
            <span>·</span>
            <Link to="/legal/privacy-dpdp" className="transition-colors hover:text-[#D4AF37]">Privacy Policy</Link>
            <span>·</span>
            <Link to="/legal/conditions-of-use" className="transition-colors hover:text-[#D4AF37]">Terms of Sale</Link>
            <span>·</span>
            <Link to="/legal/arbitration-grievance" className="transition-colors hover:text-[#D4AF37]">Grievance Officer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
