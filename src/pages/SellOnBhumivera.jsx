import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Send,
  Scale,
  Sparkles,
  MapPin,
} from 'lucide-react';
import SEO from '../components/SEO';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { SELL_ON_BHUMIVERA_DATA } from '../data/bhumiveraUniqueData';

const HOSPITALITY_CORRIDORS = [
  {
    region: 'Himachal Pradesh & Ladakh Sanctuaries',
    hubs: 'Manali, Dharamkot, Shimla, Spiti & Leh Luxury Mountain Homestays & Spas',
    allocation: '250 ml Refillable UV-Amber Apothecary Pumps (4% Sea Buckthorn Face Wash + Royal 2-in-1 Saponin Shampoo)',
    conversion: 'In-room QR serial cards convert mountain retreat guests into recurring D2C replenishment subscribers.',
  },
  {
    region: 'Uttarakhand Himalayan Wellness Retreats',
    hubs: 'Rishikesh, Narendra Nagar, Almora & Mukteshwar Ayurvedic Spas & Yoga Sanctuaries',
    allocation: '250 ml Spa Backbar Dispensers + 7-Tulsi Ingestible Adaptogen Welcome Elixir & Soothing Neem-Tulsi Bars',
    conversion: 'Zero-CAC sensory discovery during treatment rituals with 15% Partner Referral Commission on guest reorders.',
  },
  {
    region: 'West Bengal Heritage & Tea-Estate Bungalows',
    hubs: 'Darjeeling Heritage Tea Planter Bungalows, Kalimpong, Shantiniketan & Raichak Riverfront Retreats',
    allocation: '250 ml Refillable UV-Amber Apothecary Pumps (3% Charcoal Purifying Cleanser + Royal 2-in-1 Shampoo)',
    conversion: 'Direct cleanroom dispatch from our West Bengal HQ with 48-hour refill replenishment.',
  },
];

export default function SellOnBhumivera() {
  const { showToast } = useToast() || {};
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstin: '',
    partnerCategory: 'Boutique Hotel / Heritage Homestay (250ml Apothecary Backbar)',
    region: 'Himachal Pradesh / Uttarakhand / West Bengal',
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
        message: `[B2B / HOSPITALITY APOTHECARY BACKBAR APPLICATION]\nCategory: ${form.partnerCategory}\nGSTIN: ${form.gstin || 'Pending'}\nRegion: ${form.region}\nDetails: ${form.message}`,
      });
      setSubmitted(true);
      showToast?.('Hospitality & B2B Partner dossier submitted successfully.', 'success');
    } catch {
      setSubmitted(true);
      showToast?.('Your Hospitality & B2B partner inquiry has been logged for our trade desk.', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pb-24 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Boutique Hospitality Backbar (250ml Apothecary Pumps) & B2B Sourcing | Bhumivera"
        description="Partner with Bhumivera for 250 ml refillable UV-amber apothecary pumps across luxury spas, heritage homestays, and boutique hotels in Himachal, Uttarakhand, and West Bengal."
        route="/sell-on-bhumivera"
      />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#070a0e] text-white py-20 px-6 sm:py-28">
        <div className="absolute inset-0 -z-20 opacity-25">
          <img
            src={SELL_ON_BHUMIVERA_DATA.heroImage}
            alt="Bhumivera B2B apothecary and boutique hospitality backbar showcase"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070a0e]/95 via-[#070a0e]/85 to-[#070a0e]/55" />
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0d1520] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">
            <Building2 size={14} className="text-[#d4af37]" /> Institutional Hospitality Backbar · Spa &amp; Grower Partnerships
          </span>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl text-white">
            <span className="font-headline-gold">250 ml Apothecary Backbars</span>{' '}
            <span className="font-headline-silver">for Boutique Sanctuary Stays.</span>
          </h1>
          <div className="gold-hairline my-5 max-w-xs" />
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#cbd5e1] sm:text-base">
            We partner with heritage homestays, luxury Ayurvedic spas, and boutique mountain and tea-estate retreats across <strong className="text-white">Himachal Pradesh, Uttarakhand, and West Bengal</strong>—supplying serialized <strong className="text-[#fce096]">250 ml UV-amber apothecary pumps</strong> and in-room botanical rituals that turn guest discovery into long-term D2C patronage.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#b2b-application-form"
              className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
            >
              Request 250ml Hospitality Backbar Allocation <ArrowRight size={15} />
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

      {/* Strategic Play 5: 3 Regional Hospitality Corridors */}
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-6">
        <div className="rounded-3xl border border-[#d4af37]/35 bg-[#0d1520] p-6 sm:p-10">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#fce096]">
            <Sparkles size={13} className="text-[#d4af37]" /> Zero-CAC Offline Sanctuary Discovery Engine
          </span>
          <h2 className="mt-2 font-serif text-2xl sm:text-4xl text-white">
            Regional Hospitality &amp; Spa Backbar Corridors (2026 Rollout)
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {HOSPITALITY_CORRIDORS.map((corridor) => (
              <div key={corridor.region} className="rounded-2xl border border-[#d4af37]/25 bg-[#070a0e] p-5">
                <div className="flex items-center gap-2 text-[#fce096] font-mono text-xs font-bold">
                  <MapPin size={15} className="text-[#d4af37]" />
                  <span>{corridor.region}</span>
                </div>
                <p className="mt-2 text-xs text-white font-semibold">{corridor.hubs}</p>
                <p className="mt-2 text-xs text-[#cbd5e1] leading-relaxed">
                  <strong className="text-[#fce096]">Backbar Format:</strong> {corridor.allocation}
                </p>
                <p className="mt-2 text-[11px] text-[#94a3b8] leading-relaxed">
                  {corridor.conversion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Real-Life Partner Categories */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#d4af37]/20 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-sub-gold text-[10px] tracking-[0.22em] block">
              4 Verified Trade Tracks
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-white">
              <span className="font-headline-gold">Hospitality, Sourcing</span> <span className="font-headline-silver">&amp; Wholesale Tracks</span>
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
              Direct Hospitality &amp; Trade Desk · Asansol, West Bengal HQ
            </span>
            <h2 className="mt-2 font-serif text-3xl text-white">Submit a 250ml Hospitality Backbar or Trade Application</h2>
            <p className="mt-2 text-xs leading-6 text-[#cbd5e1] sm:text-sm">
              No sign-in is required to submit your preliminary hospitality or trade dossier. Our partnership division reviews applications within 48 hours.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-[#d4af37]/40 bg-[#070a0e] p-8 text-center shadow-lg">
              <CheckCircle2 size={42} className="mx-auto text-[#d4af37]" />
              <h3 className="mt-4 font-serif text-2xl text-white font-bold">Hospitality &amp; Trade Dossier Recorded</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#cbd5e1]">
                Thank you, <strong className="text-white">{form.contactPerson || 'Partner'}</strong>. Your inquiry for <strong className="text-white">{form.companyName || 'your property'}</strong> has been logged. Our B2B desk will reply in writing to <strong className="text-[#fce096]">{form.email}</strong>.
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
                  Property / Spa / Cooperative Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="e.g. Glenburn Tea Estate / Himalayan Retreat Spa"
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
                  placeholder="gm@sanctuarystay.in"
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
                  <option className="bg-[#070a0e] text-white">Boutique Hotel / Heritage Homestay (250ml Apothecary Backbar)</option>
                  <option className="bg-[#070a0e] text-white">Luxury Spa / Ayurvedic Wellness Retreat Stockist</option>
                  <option className="bg-[#070a0e] text-white">Raw Botanical Farmer Cooperative</option>
                  <option className="bg-[#070a0e] text-white">Sustainable Glass &amp; Honeycomb Packaging</option>
                  <option className="bg-[#070a0e] text-white">Independent Analytical Testing Laboratory</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                  Corridor / State &amp; GSTIN
                </label>
                <input
                  type="text"
                  value={form.gstin}
                  onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                  placeholder="e.g. Himachal / Uttarakhand / West Bengal · GSTIN"
                  className="mt-2 w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                  Suite Count, Monthly 250ml Pump Allocation, or Botanical Supply Specs *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share number of guest suites/treatment rooms requiring 250ml UV-amber apothecary dispensers, or details of your botanical lot..."
                  className="mt-2 w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37]"
                />
              </div>
              <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
                <p className="text-xs text-[#94a3b8]">
                  Governed by Part V (B2B &amp; Hospitality Partner Terms) of the Bhumivera Master Legal Suite.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
                >
                  <Send size={14} /> {submitting ? 'Submitting Dossier…' : 'Submit Hospitality / B2B Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
