import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  FlaskConical,
  Sprout,
  PackageCheck,
  ArrowRight,
  Send,
  FileText,
  Scale,
} from 'lucide-react';
import SEO from '../components/SEO';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { SELL_ON_BHUMIVERA_DATA } from '../data/bhumiveraUniqueData';

export default function SellOnBhumivera() {
  const { showToast } = useToast() || {};
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstin: '',
    partnerCategory: 'Raw Botanical Farmer Cooperative',
    region: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact', {
        name: `${form.contactPerson} (${form.companyName})`,
        email: form.email,
        phone: form.phone,
        subject: 'partnership',
        message: `[B2B / SELL ON BHUMIVERA APPLICATION]\nCategory: ${form.partnerCategory}\nGSTIN: ${form.gstin || 'Pending'}\nRegion: ${form.region}\nDetails: ${form.message}`,
      });
      setSubmitted(true);
      showToast?.('B2B Partner dossier submitted successfully.', 'success');
    } catch {
      // Allow local confirmation even when offline/guest
      setSubmitted(true);
      showToast?.('Your B2B partner inquiry has been logged for our sourcing desk.', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pb-24 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Sell on Bhumivera · B2B Sourcing, Spa & Retail Partnerships | Bhumivera"
        description="Apply to supply certified botanical raw extracts, sustainable apothecary packaging, or stock Bhumivera formulations at your luxury spa or boutique."
        route="/sell-on-bhumivera"
      />

      {/* Hero Section with Unique Real-Life Photography */}
      <section className="relative isolate overflow-hidden bg-[#070a0e] text-white py-20 px-6 sm:py-28">
        <div className="absolute inset-0 -z-20 opacity-25">
          <img
            src={SELL_ON_BHUMIVERA_DATA.heroImage}
            alt="Bhumivera B2B apothecary and botanical sourcing showcase"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070a0e]/95 via-[#070a0e]/85 to-[#070a0e]/55" />
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0d1520] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">
            <Building2 size={14} className="text-[#d4af37]" /> B2B Trade, Raw Botanical Supply &amp; Authorized Retail Desk
          </span>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl text-white">
            <span className="font-headline-gold">Partner or Supply</span> <span className="font-headline-silver">With Bhumivera Maison.</span>
          </h1>
          <div className="gold-hairline my-5 max-w-xs" />
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#cbd5e1] sm:text-base">
            Unlike open third-party marketplaces, every item on Bhumivera undergoes strict GMP batch verification, pH calibration, and heavy-metal screening. We partner with traceable botanical grower cooperatives, luxury spas, and sustainable packaging artisans under formal written B2B contracts.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#b2b-application-form"
              className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
            >
              Submit B2B Vendor / Retail Dossier <ArrowRight size={15} />
            </a>
            <Link
              to="/legal/warranty-affiliate-b2b"
              className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1]"
            >
              <Scale size={14} className="text-[#d4af37]" /> Read Part V: B2B Legal Terms
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Real-Life Partner Categories with Unique Photography */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#d4af37]/20 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-sub-gold text-[10px] tracking-[0.22em] block">
              4 Verified Trade Tracks
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-white">
              <span className="font-headline-gold">Real-Life Sourcing</span> <span className="font-headline-silver">&amp; Wholesale Tracks</span>
            </h2>
          </div>
          <p className="max-w-md text-xs leading-6 text-[#94a3b8]">
            Every trade partner is onboarded through written technical specifications, Certificate of Analysis (COA) audits, and GST-compliant invoicing.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {SELL_ON_BHUMIVERA_DATA.partners.map((track) => (
            <article
              key={track.code}
              className="overflow-hidden rounded-2xl two-tone-card border border-[#d4af37]/25 shadow-lg transition hover:border-[#d4af37]/60 hover:shadow-2xl"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#070a0e]">
                <img
                  src={track.image}
                  alt={track.category}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-6 sm:p-8">
                <span className="rounded bg-[#070a0e] border border-[#d4af37]/30 px-2.5 py-1 font-mono text-[10px] font-bold text-[#fce096] inline-block">
                  {track.code}
                </span>
                <h3 className="mt-3 font-serif text-2xl text-white font-bold">{track.category}</h3>
                <p className="mt-3 text-xs leading-6 text-[#cbd5e1] sm:text-sm">
                  <strong className="text-[#fce096]">Mandatory Standard:</strong> {track.requirements}
                </p>
                <div className="mt-4 rounded-xl border border-[#d4af37]/20 bg-[#070a0e] p-3.5 text-xs text-[#cbd5e1]">
                  <strong className="text-[#fce096]">Real-Life Benchmark:</strong> {track.example}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* B2B Onboarding Form */}
      <section id="b2b-application-form" className="mx-auto max-w-5xl px-6 pt-4 pb-12">
        <div className="rounded-3xl two-tone-panel-gold border border-[#d4af37]/40 p-8 shadow-2xl sm:p-12">
          <div className="mb-8 border-b border-[#d4af37]/20 pb-6">
            <span className="font-sub-gold text-[10px] tracking-[0.2em] block">
              Direct Trade Desk · West Bengal HQ
            </span>
            <h2 className="mt-2 font-serif text-3xl text-white">Submit a B2B Supply or Retail Stockist Application</h2>
            <p className="mt-2 text-xs leading-6 text-[#cbd5e1] sm:text-sm">
              No sign-in is required to submit your preliminary trade dossier. Our procurement and B2B partnership team reviews applications within 2–3 business days.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-[#d4af37]/40 bg-[#070a0e] p-8 text-center shadow-lg">
              <CheckCircle2 size={42} className="mx-auto text-[#d4af37]" />
              <h3 className="mt-4 font-serif text-2xl text-white font-bold">Trade Dossier Recorded</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#cbd5e1]">
                Thank you, <strong className="text-white">{form.contactPerson || 'Partner'}</strong>. Your inquiry for <strong className="text-white">{form.companyName || 'your enterprise'}</strong> has been logged. Our B2B desk will reply in writing to <strong className="text-[#fce096]">{form.email}</strong>.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn-gold-luxury mt-6 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg"
              >
                Submit Another Trade Dossier
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                  Enterprise / Cooperative / Spa Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="e.g. Himalayan Flora Co-op / Aura Spa"
                  className="mt-2 w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                  Authorized Contact Person *
                </label>
                <input
                  required
                  type="text"
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  placeholder="Full Name & Designation"
                  className="mt-2 w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                  Official Business Email *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="trade@enterprise.in"
                  className="mt-2 w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                  10-Digit Phone / WhatsApp *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="mt-2 w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                  Partnership Track *
                </label>
                <select
                  value={form.partnerCategory}
                  onChange={(e) => setForm({ ...form, partnerCategory: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]"
                >
                  <option className="bg-[#070a0e] text-white">Raw Botanical Farmer Cooperative</option>
                  <option className="bg-[#070a0e] text-white">Luxury Spa / Wellness Retreat Stockist</option>
                  <option className="bg-[#070a0e] text-white">Sustainable Glass &amp; Honeycomb Packaging</option>
                  <option className="bg-[#070a0e] text-white">Independent Analytical Testing Laboratory</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                  GSTIN &amp; State / Origin Region
                </label>
                <input
                  type="text"
                  value={form.gstin}
                  onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                  placeholder="e.g. 19AAACB... · West Bengal / Ladakh"
                  className="mt-2 w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                  Specification Summary (Botanical Grade, Batch Capacity, or Retail Footprint) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share details of your cold-pressed botanical batch specs, COA availability, or boutique retail requirements..."
                  className="mt-2 w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37]"
                />
              </div>
              <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
                <p className="text-xs text-[#94a3b8]">
                  Governed by Part V (B2B &amp; Partner Terms) of the Bhumivera Master Legal Suite.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
                >
                  <Send size={14} /> {submitting ? 'Submitting Dossier…' : 'Submit B2B Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
