import React from 'react';
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
} from 'lucide-react';
import { triggerAiCopilotAssist } from '../utils/aiCopilotBus';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[#d4af37]/25 bg-[#0c1712] font-sans text-[#e2e8f0] antialiased">
      {/* 1. ULTRA-PREMIUM BRAND SHOWCASE & CONCIERGE HERO */}
      <div className="relative isolate overflow-hidden border-b border-[#d4af37]/20 bg-gradient-to-b from-[#0c1712] via-[#09130e] to-[#070f0b]">
        {/* Subtle Ambient Gold & Emerald Glows */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#d4af37]/5 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[#1b3a2b]/20 blur-[130px]" />

        <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d4af37]/50 bg-gradient-to-br from-[#13221b] to-[#050807] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
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
                  <span className="font-serif text-2xl font-bold tracking-[0.22em] text-[#d4af37] sm:text-3xl">
                    BHUMIVERA
                  </span>
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.28em] text-[#94a3b8]">
                    Botanical Maison · Est. India
                  </span>
                </div>
              </div>

              <h2 className="mt-5 font-serif text-2xl leading-snug text-[#f8fafc] sm:text-3xl lg:text-4xl">
                Pure care, rooted in its source.
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-[#cbd5e1] sm:text-sm max-w-xl">
                Formulated with cold-pressed Himalayan Sea Buckthorn, Pampore Kashmiri Saffron, and certified pH 5.5 clinical actives. Produced in micro-runs of 250 bottles with open label transparency and verifiable lab purity.
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
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#e5c247] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#0c1712] shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(212,175,55,0.45)]"
              >
                <Sparkles size={15} /> Client Concierge
              </button>

              <Link
                to="/verify"
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-[#d4af37]/60 bg-[#0c1712]/80 px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.15)] backdrop-blur transition-all hover:border-[#d4af37] hover:bg-[#d4af37]/15 hover:text-[#f8fafc]"
              >
                <ShieldCheck size={16} /> Verify Bottle Serial
              </Link>

              <Link
                to="/science"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-medium uppercase tracking-widest text-[#e2e8f0] transition-colors hover:border-white/40 hover:bg-white/10"
              >
                Lab Science <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. UNIFIED LUXURY DIRECTORY (4 BALANCED EDITORIAL COLUMNS - NO BOXES!) */}
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Column 1: The Maison & Collections */}
          <div>
            <div className="mb-5 flex items-center gap-2 border-b border-[#d4af37]/25 pb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                Maison &amp; Rituals
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#cbd5e1]">
              <li>
                <Link to="/shop" className="transition-colors hover:text-[#d4af37] flex items-center justify-between group">
                  <span>Shop the Collection</span>
                  <span className="text-[10px] text-[#94a3b8] opacity-0 transition-opacity group-hover:opacity-100">Browse</span>
                </Link>
              </li>
              <li>
                <Link to="/compare" className="transition-colors hover:text-[#d4af37] flex items-center justify-between group">
                  <span>Compare Formulations</span>
                  <span className="text-[10px] text-[#94a3b8] opacity-0 transition-opacity group-hover:opacity-100">Matrix</span>
                </Link>
              </li>
              <li>
                <Link to="/somatic-registry" className="transition-colors hover:text-[#d4af37] flex items-center justify-between group">
                  <span>Somatic Label Registry</span>
                  <span className="text-[10px] text-[#94a3b8] opacity-0 transition-opacity group-hover:opacity-100">INCI</span>
                </Link>
              </li>
              <li>
                <Link to="/science" className="transition-colors hover:text-[#d4af37] flex items-center justify-between group">
                  <span>Botanical Science &amp; pH 5.5</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-[#d4af37] flex items-center justify-between group">
                  <span>Our Story &amp; Heritage</span>
                </Link>
              </li>
              <li>
                <Link to="/impact" className="transition-colors hover:text-[#d4af37] flex items-center justify-between group">
                  <span>Ethical Harvesting &amp; Impact</span>
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="transition-colors hover:text-[#d4af37] flex items-center justify-between group">
                  <span>Saved Rituals &amp; Wishlist</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Authenticity & Purity */}
          <div>
            <div className="mb-5 flex items-center gap-2 border-b border-[#d4af37]/25 pb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                Authenticity &amp; Purity
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#cbd5e1]">
              <li>
                <Link to="/verify" className="inline-flex items-center gap-1.5 font-semibold text-[#d4af37] transition-colors hover:text-[#f8fafc]">
                  <ShieldCheck size={14} className="shrink-0" />
                  <span>Verify Bottle Serial &amp; Purity</span>
                </Link>
              </li>
              <li>
                <Link to="/ewarranty" className="transition-colors hover:text-[#d4af37]">
                  E-Warranty Digital Custody
                </Link>
              </li>
              <li>
                <Link to="/provenance-engine" className="transition-colors hover:text-[#d4af37]">
                  Spectrophotometric Lab Assays
                </Link>
              </li>
              <li>
                <Link to="/purchase-protection" className="transition-colors hover:text-[#d4af37]">
                  Tamper-Evident Delivery Shield
                </Link>
              </li>
              <li>
                <Link to="/affiliate" className="transition-colors hover:text-[#d4af37]">
                  Affiliate Ambassador Program
                </Link>
              </li>
              <li>
                <Link to="/sell-on-bhumivera" className="transition-colors hover:text-[#d4af37]">
                  Artisanal Sourcing Partnership
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Concierge */}
          <div>
            <div className="mb-5 flex items-center gap-2 border-b border-[#d4af37]/25 pb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                Client Concierge
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#cbd5e1]">
              <li>
                <Link to="/order-tracking" className="transition-colors hover:text-[#d4af37] flex items-center justify-between group">
                  <span>Track Consignment AWB</span>
                  <span className="text-[10px] text-[#94a3b8] opacity-0 transition-opacity group-hover:opacity-100">Live</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="transition-colors hover:text-[#d4af37]">
                  My Profile, Orders &amp; Wallet
                </Link>
              </li>
              <li>
                <Link to="/address-book" className="transition-colors hover:text-[#d4af37]">
                  Address Book &amp; Pinpoint
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-[#d4af37]">
                  Boutique Concierge &amp; FAQ
                </Link>
              </li>
              <li className="pt-2">
                <a
                  href="mailto:support@bhumivera.com"
                  className="flex items-center gap-2 text-xs font-mono text-[#cbd5e1] transition-colors hover:text-[#d4af37]"
                >
                  <Mail size={13} className="text-[#d4af37] shrink-0" />
                  support@bhumivera.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+917430985647"
                  className="flex items-center gap-2 text-xs font-mono text-[#cbd5e1] transition-colors hover:text-[#d4af37]"
                >
                  <Phone size={13} className="text-[#d4af37] shrink-0" />
                  +91 74309 85647
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Anti-Fraud Shield */}
          <div>
            <div className="mb-5 flex items-center gap-2 border-b border-[#d4af37]/25 pb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                Legal &amp; Anti-Fraud Shield
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#cbd5e1]">
              <li>
                <Link to="/legal/conditions-of-use" className="transition-colors hover:text-[#d4af37]">
                  Conditions of Use &amp; Sale
                </Link>
              </li>
              <li>
                <Link to="/legal/shipping-hygiene" className="transition-colors hover:text-[#d4af37]">
                  Sanitary Sealed Custody Standard
                </Link>
              </li>
              <li>
                <Link to="/legal/unboxing-antiscam" className="transition-colors hover:text-[#d4af37]">
                  Mandatory 360° Unboxing Video Rule
                </Link>
              </li>
              <li>
                <Link to="/legal/wallet-loyalty-referrals" className="transition-colors hover:text-[#d4af37]">
                  Wallet, Loyalty &amp; Referral Terms
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy-dpdp" className="transition-colors hover:text-[#d4af37]">
                  DPDP Act 2023 &amp; Privacy Shield
                </Link>
              </li>
              <li>
                <Link to="/legal/medical-ip-shield" className="transition-colors hover:text-[#d4af37]">
                  Medical Disclaimer &amp; IP Protection
                </Link>
              </li>
              <li>
                <Link to="/legal/arbitration-grievance" className="transition-colors hover:text-[#d4af37]">
                  Arbitration &amp; Statutory Grievance
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* CONNECT WITH US & VERIFIED CHANNELS STRIP */}
        <div className="mt-12 border-t border-[#d4af37]/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#94a3b8]">
              <Send size={14} className="text-[#d4af37]" />
              <span>Connect With Our Botanical Maison:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { name: 'Instagram', href: 'https://www.instagram.com/the_rsenterprises' },
                { name: 'Facebook', href: 'https://facebook.com/Bhumivera' },
                { name: 'X (Twitter)', href: 'https://twitter.com/Bhumivera' },
                { name: 'Telegram', href: 'https://t.me/bhumivera' },
                { name: 'WhatsApp VIP Desk', href: 'https://wa.me/917430985647' },
              ].map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#070f0b] px-4 py-2 text-xs font-semibold text-[#cbd5e1] transition-all hover:border-[#d4af37] hover:bg-[#d4af37]/15 hover:text-[#d4af37]"
                >
                  <span>{social.name}</span>
                  <ExternalLink size={11} className="opacity-60" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. STATUTORY COMPLIANCE & CONSUMER PROTECTION PILLARS */}
      <div className="border-t border-[#d4af37]/20 bg-[#070f0b]">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            <div className="flex items-start gap-3 rounded-2xl border border-[#d4af37]/20 bg-[#0c1712]/60 p-4 backdrop-blur-sm">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#d4af37]" />
              <div>
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                  100% Sealed Sanitary Custody
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-[#94a3b8]">
                  Artisanal micro-batch personal care bottled with tamper-evident seals to safeguard uncompromised potency and pure hygiene.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-[#d4af37]/20 bg-[#0c1712]/60 p-4 backdrop-blur-sm">
              <FileCheck2 size={20} className="mt-0.5 shrink-0 text-[#d4af37]" />
              <div>
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                  360° Unboxing Video Mandate
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-[#94a3b8]">
                  Transit damage or shortage claims require an uncut 360° unboxing recording displaying outer AWB label within 48h.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-[#d4af37]/20 bg-[#0c1712]/60 p-4 backdrop-blur-sm">
              <Lock size={20} className="mt-0.5 shrink-0 text-[#d4af37]" />
              <div>
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                  Digital Weight-Scan Shield
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-[#94a3b8]">
                  Warehouse shipments are precision-calibrated by digital weight scanners to eliminate discrepancy and fraudulent substitutions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-[#d4af37]/20 bg-[#0c1712]/60 p-4 backdrop-blur-sm">
              <Scale size={20} className="mt-0.5 shrink-0 text-[#d4af37]" />
              <div>
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                  Sovereign Legal Governance
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-[#94a3b8]">
                  Protected under CPA 2019, IT Act 2000, and DPDP Act 2023 with binding arbitration seated under West Bengal jurisdiction.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 4. BOTTOM TRADEMARK & PROMINENT DEVELOPER BRANDING BAR */}
      <div className="border-t border-[#d4af37]/25 bg-[#050907] pb-28 sm:pb-8 pt-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:px-8 lg:flex-row lg:px-12">
          
          {/* Copyright & Trademark */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <p className="text-xs tracking-wider text-[#94a3b8]">
              © {currentYear} <span className="font-serif font-bold text-[#d4af37]">BHUMIVERA</span> · Botanical Maison · All Rights Reserved
            </p>
          </div>

          {/* PROMINENT DEVELOPER BRANDING: AKASH PRASAD */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#94a3b8]">
              Architectural Engineering &amp; Design
            </span>
            <span className="hidden sm:inline text-[#d4af37]/50">•</span>
            <div className="group inline-flex items-center gap-2 rounded-full border border-[#d4af37]/60 bg-[#d4af37]/15 px-4 py-1.5 shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all hover:bg-[#d4af37] hover:scale-105">
              <Sparkles size={13} className="text-[#d4af37] group-hover:text-[#0c1712] transition-colors" />
              <span className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] group-hover:text-[#0c1712] transition-colors">
                Developed By Akash Prasad
              </span>
            </div>
          </div>

          {/* Quick Legal Pill Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#94a3b8]">
            <Link to="/legal/privacy-dpdp" className="transition-colors hover:text-[#d4af37]">Privacy Policy</Link>
            <span>·</span>
            <Link to="/legal/conditions-of-use" className="transition-colors hover:text-[#d4af37]">Terms of Sale</Link>
            <span>·</span>
            <Link to="/legal/arbitration-grievance" className="transition-colors hover:text-[#d4af37]">Grievance Officer</Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
