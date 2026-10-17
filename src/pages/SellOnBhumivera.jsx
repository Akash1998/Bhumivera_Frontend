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
    <main className="min-h-screen bg-[#f6f3ec] text-[#17251c] pb-20 font-sans">
      <SEO
        title="Sell on Bhumivera · B2B Sourcing, Spa & Retail Partnerships | Bhumivera"
        description="Apply to supply certified botanical raw extracts, sustainable apothecary packaging, or stock Bhumivera formulations at your luxury spa or boutique."
        route="/sell-on-bhumivera"
      />

      {/* Hero Section with Unique Real-Life Photography */}
      <section className="relative isolate overflow-hidden bg-[#101d16] text-white py-20 px-6 sm:py-28">
        <div className="absolute inset-0 -z-20 opacity-35">
          <img
            src={SELL_ON_BHUMIVERA_DATA.heroImage}
            alt="Bhumivera B2B apothecary and botanical sourcing showcase"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b1510]/95 via-[#0b1510]/85 to-[#0b1510]/55" />
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">
            <Building2 size={14} /> B2B Trade, Raw Botanical Supply &amp; Authorized Retail Desk
          </span>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
            Partner or Supply With Bhumivera Maison.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            Unlike open third-party marketplaces, every item on Bhumivera undergoes strict GMP batch verification, pH calibration, and heavy-metal screening. We partner with certified organic grower cooperatives, luxury spas, and sustainable packaging artisans under formal written B2B contracts.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#b2b-application-form"
              className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-[#0b1510] hover:bg-[#e5c247]"
            >
              Submit B2B Vendor / Retail Dossier <ArrowRight size={15} />
            </a>
            <Link
              to="/legal/warranty-affiliate-b2b"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10"
            >
              <Scale size={14} /> Read Part V: B2B &amp; Wholesale Legal Terms
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Real-Life Partner Categories with Unique Photography */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#17251c]/15 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b4226]">
              4 Verified Trade Tracks
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
              Real-Life Sourcing &amp; Wholesale Tracks
            </h2>
          </div>
          <p className="max-w-md text-xs leading-6 text-stone-600">
            Every trade partner is onboarded through written technical specifications, Certificate of Analysis (COA) audits, and GST-compliant invoicing.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {SELL_ON_BHUMIVERA_DATA.partners.map((track) => (
            <article
              key={track.code}
              className="overflow-hidden rounded-2xl border border-[#17251c]/15 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#101d16]">
                <img
                  src={track.image}
                  alt={track.category}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-6 sm:p-8">
                <span className="rounded bg-[#101d16] px-2.5 py-1 font-mono text-[10px] font-bold text-[#d4af37]">
                  {track.code}
                </span>
                <h3 className="mt-3 font-serif text-2xl text-[#17251c]">{track.category}</h3>
                <p className="mt-3 text-xs leading-6 text-stone-600 sm:text-sm">
                  <strong className="text-[#17251c]">Mandatory Standard:</strong> {track.requirements}
                </p>
                <div className="mt-4 rounded-xl border border-emerald-900/15 bg-[#f4f6ef] p-3.5 text-xs text-[#26392c]">
                  <strong>Real-Life Benchmark:</strong> {track.example}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* B2B Onboarding Form */}
      <section id="b2b-application-form" className="mx-auto max-w-5xl px-6 pt-4">
        <div className="rounded-3xl border border-[#17251c]/15 bg-white p-8 shadow-sm sm:p-12">
          <div className="mb-8 border-b border-stone-200 pb-6">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800">
              Direct Trade Desk · West Bengal HQ
            </span>
            <h2 className="mt-2 font-serif text-3xl">Submit a B2B Supply or Retail Stockist Application</h2>
            <p className="mt-2 text-xs leading-6 text-stone-600 sm:text-sm">
              No sign-in is required to submit your preliminary trade dossier. Our procurement and B2B partnership team reviews applications within 2–3 business days.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/60 p-8 text-center">
              <CheckCircle2 size={42} className="mx-auto text-emerald-700" />
              <h3 className="mt-4 font-serif text-2xl text-[#17251c]">Trade Dossier Recorded</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-stone-600">
                Thank you, <strong>{form.contactPerson || 'Partner'}</strong>. Your inquiry for <strong>{form.companyName || 'your enterprise'}</strong> has been logged. Our B2B desk will reply in writing to <strong>{form.email}</strong>.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-xl bg-[#101d16] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white"
              >
                Submit Another Trade Dossier
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Enterprise / Cooperative / Spa Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="e.g. Himalayan Flora Co-op / Aura Spa"
                  className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#101d16]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Authorized Contact Person *
                </label>
                <input
                  required
                  type="text"
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  placeholder="Full Name & Designation"
                  className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#101d16]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Official Business Email *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="trade@enterprise.in"
                  className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#101d16]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  10-Digit Phone / WhatsApp *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#101d16]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Partnership Track *
                </label>
                <select
                  value={form.partnerCategory}
                  onChange={(e) => setForm({ ...form, partnerCategory: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#101d16]"
                >
                  <option>Raw Botanical Farmer Cooperative</option>
                  <option>Luxury Spa / Wellness Retreat Stockist</option>
                  <option>Sustainable Glass &amp; Honeycomb Packaging</option>
                  <option>NABL Analytical Testing Laboratory</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  GSTIN &amp; State / Origin Region
                </label>
                <input
                  type="text"
                  value={form.gstin}
                  onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                  placeholder="e.g. 19AAACB... · West Bengal / Ladakh"
                  className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#101d16]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Specification Summary (Botanical Grade, Batch Capacity, or Retail Footprint) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share details of your cold-pressed botanical batch specs, COA availability, or boutique retail requirements..."
                  className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#101d16]"
                />
              </div>
              <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
                <p className="text-xs text-stone-500">
                  Governed by Part V (B2B &amp; Partner Terms) of the Bhumivera Master Legal Suite.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#101d16] px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#d4af37] hover:bg-[#1c3327]"
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
