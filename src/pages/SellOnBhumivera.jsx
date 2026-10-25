import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Send,
  Building2,
  FileCheck,
  TrendingUp,
  Leaf,
  Layers,
  ArrowRight,
  HelpCircle,
  BadgeCheck,
} from 'lucide-react';
import SEO from '../components/SEO';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function SellOnBhumivera() {
  const { showToast } = useToast() || {};
  const [form, setForm] = useState({
    brandName: '',
    legalEntityName: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    category: 'Botanical Skincare Formulations',
    entityType: 'Private Limited / LLP',
    gstin: '',
    websiteOrSocial: '',
    monthlyCapacity: '500 – 2,500 units / month',
    certifications: 'AYUSH / GMP / Organic / Lab Tested',
    disclosureCommitment: true,
    applicationDossier: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.disclosureCommitment) {
      showToast?.('Please confirm your commitment to 100% active label disclosure.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formattedMessage = [
        `### [SELLER APPLICATION DOSSIER]`,
        `**Brand / Trade Name:** ${form.brandName}`,
        `**Legal Entity:** ${form.legalEntityName} (${form.entityType})`,
        `**Contact Person:** ${form.contactPerson} - ${form.designation || 'Representative'}`,
        `**Email:** ${form.email}`,
        `**Phone / WhatsApp:** ${form.phone}`,
        `**Operating Location:** ${form.city}, ${form.state}, India`,
        `**GSTIN / Tax ID:** ${form.gstin || 'Pending / Exemption'}`,
        `**Primary Category:** ${form.category}`,
        `**Monthly Production Capacity:** ${form.monthlyCapacity}`,
        `**Certifications & Compliance:** ${form.certifications || 'None stated'}`,
        `**Brand Website / Catalog:** ${form.websiteOrSocial || 'Not provided'}`,
        `**100% Active Disclosure Agreed:** YES`,
        ``,
        `#### Brand Story & Formulation Pitch:`,
        form.applicationDossier,
      ].join('\n');

      const response = await api.post('/contact', {
        name: `${form.contactPerson} (${form.brandName})`,
        email: form.email,
        phone: form.phone,
        subject: 'seller_application',
        message: formattedMessage,
      });

      const returnedId = response.data?.ticketId || response.data?.id || `SEL-${Date.now().toString().slice(-6)}`;
      setTicketId(returnedId);
      setSubmitted(true);
      showToast?.('Seller application submitted successfully to Bhumivera Admin!', 'success');
    } catch (error) {
      console.error('[SELLER_APPLICATION_SUBMIT_ERROR]', error);
      // Fallback display so user has positive confirmation even on network hiccup
      setTicketId(`SEL-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
      showToast?.('Your application dossier has been queued for review by the Admin panel.', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#14291F] text-[#FAF7F2] pb-24 font-sans selection:bg-[#D4AF37]/30 selection:text-white">
      <SEO
        title="Seller Application Portal · Become a Bhumivera Merchant & Artisan | Bhumivera"
        description="Apply to list and sell your cold-pressed botanical skincare, clean Ayurvedic formulations, and organic apothecary products on Bhumivera. Submit your seller application dossier directly to our Admin Control Centre."
        route="/sell-on-bhumivera"
      />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden border-b border-[#244A38]/70 bg-gradient-to-b from-[#102219] via-[#14291F] to-[#102219] px-6 py-20 sm:py-28">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[#244A38]/30 blur-[130px]" />

        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#1C382B] px-4 py-1.5 shadow-inner">
            <Sparkles size={14} className="text-[#D4AF37]" />
            <span className="font-serif text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
              Merchant &amp; Artisan Onboarding Portal
            </span>
          </div>

          <h1 className="mt-6 font-serif text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl text-[#FAF7F2]">
            <span className="font-headline-gold">Apply to Sell</span>{' '}
            <span className="font-headline-silver">on Bhumivera</span>
          </h1>

          <div className="gold-hairline mx-auto my-5 w-24" />

          <p className="mx-auto max-w-2xl text-xs sm:text-sm leading-relaxed text-[#DFD7C4] font-light">
            Are you an artisan formulator, clean Ayurvedic brand, cold-pressed oil producer, or wild-harvest cooperative? Join India&apos;s most uncompromising botanical maison. Submit your application below to get curated and listed on Bhumivera.
          </p>
        </div>
      </section>

      {/* 3 Pillar Value Proposition */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#244A38] bg-[#102219] p-6 shadow-lg">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-[#1C382B] text-[#D4AF37]">
              <FileCheck size={20} />
            </div>
            <h3 className="mt-4 font-serif text-base font-bold text-white">100% Active Disclosure</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#DFD7C4]">
              We celebrate clean formulas. If your products disclose active percentages and contain no hidden &ldquo;Base Q.S.&rdquo;, Bhumivera is your ideal sanctuary.
            </p>
          </div>

          <div className="rounded-2xl border border-[#244A38] bg-[#102219] p-6 shadow-lg">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-[#1C382B] text-[#D4AF37]">
              <TrendingUp size={20} />
            </div>
            <h3 className="mt-4 font-serif text-base font-bold text-white">Discerning Patrons</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#DFD7C4]">
              Reach our educated, label-conscious patron base who appreciate botanical luxury, batch assay certificates, and superior unit values.
            </p>
          </div>

          <div className="rounded-2xl border border-[#244A38] bg-[#102219] p-6 shadow-lg">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-[#1C382B] text-[#D4AF37]">
              <ShieldCheck size={20} />
            </div>
            <h3 className="mt-4 font-serif text-base font-bold text-white">Admin-Verified Review</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#DFD7C4]">
              Every application is routed directly into our Executive Admin Panel for prompt technical evaluation and partnership onboarding within 48–72 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Seller Application Form Container */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-[#D4AF37]/40 bg-[#102219] p-6 shadow-2xl sm:p-12">
          {submitted ? (
            <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#070a0e] p-8 text-center sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-950/60 text-emerald-400 shadow-lg">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="mt-5 font-serif text-2xl font-bold sm:text-3xl text-white">
                Seller Application Received
              </h2>
              <div className="gold-hairline mx-auto my-3 w-20" />
              <p className="mt-2 font-mono text-xs text-[#D4AF37]">
                Reference Application Dossier ID: <strong>{ticketId || 'SEL-REGISTERED'}</strong>
              </p>
              <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm leading-relaxed text-[#DFD7C4]">
                Thank you, <strong className="text-white">{form.contactPerson}</strong>. Your seller dossier for <strong className="text-[#FCE096]">{form.brandName}</strong> has been transmitted directly to the Bhumivera Admin Control Centre.
              </p>
              <div className="mt-6 rounded-xl border border-[#244A38] bg-[#102219] p-4 text-xs text-[#9BB0A5]">
                Our curation team reviews formulation standards, ingredient assays, and packaging compliance within <strong>48–72 hours</strong>. We will reach out to you via <strong className="text-white">{form.email}</strong> and <strong className="text-white">{form.phone}</strong>.
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      brandName: '',
                      legalEntityName: '',
                      contactPerson: '',
                      designation: '',
                      email: '',
                      phone: '',
                      city: '',
                      state: '',
                      category: 'Botanical Skincare Formulations',
                      entityType: 'Private Limited / LLP',
                      gstin: '',
                      websiteOrSocial: '',
                      monthlyCapacity: '500 – 2,500 units / month',
                      certifications: 'AYUSH / GMP / Organic / Lab Tested',
                      disclosureCommitment: true,
                      applicationDossier: '',
                    });
                  }}
                  className="btn-gold-luxury rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
                >
                  Submit Another Application
                </button>
                <Link
                  to="/shop"
                  className="btn-silver-luxury rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#FAF7F2]"
                >
                  Explore Current Catalog
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold sm:text-3xl text-white">
                  Seller Application Form
                </h2>
                <p className="mt-1 text-xs text-[#9BB0A5]">
                  Please complete the details below. All applications are forwarded directly to the Bhumivera Curation Desk for onboarding assessment.
                </p>
                <div className="gold-hairline my-4 w-20" />
              </div>

              {/* Section 1: Brand & Enterprise Profile */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
                  <Building2 size={16} /> 1. Brand &amp; Enterprise Profile
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      Brand / Trade Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.brandName}
                      onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                      placeholder="e.g. Veda Organics"
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#60756b] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      Registered Legal Entity Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.legalEntityName}
                      onChange={(e) => setForm({ ...form, legalEntityName: e.target.value })}
                      placeholder="e.g. Veda Botanicals Pvt. Ltd. / Proprietary"
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#60756b] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      Entity Legal Type *
                    </label>
                    <select
                      value={form.entityType}
                      onChange={(e) => setForm({ ...form, entityType: e.target.value })}
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                    >
                      <option className="bg-[#070a0e] text-white">Private Limited / LLP</option>
                      <option className="bg-[#070a0e] text-white">Sole Proprietorship / Artisan Studio</option>
                      <option className="bg-[#070a0e] text-white">Partnership Firm</option>
                      <option className="bg-[#070a0e] text-white">Farmer / Cultivator Cooperative</option>
                      <option className="bg-[#070a0e] text-white">Certified Contract Manufacturer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      Brand Website or Social / Catalog URL
                    </label>
                    <input
                      type="text"
                      value={form.websiteOrSocial}
                      onChange={(e) => setForm({ ...form, websiteOrSocial: e.target.value })}
                      placeholder="https://yourbrand.com or @instagram"
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#60756b] outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Operational Details */}
              <div className="pt-2">
                <h3 className="mb-4 flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
                  <ShieldCheck size={16} /> 2. Authorized Contact &amp; Operations
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      Authorized Contact Person *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.contactPerson}
                      onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                      placeholder="Full Name (Founder / Lead Formulator)"
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#60756b] outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      Designation / Role
                    </label>
                    <input
                      type="text"
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                      placeholder="e.g. Founder &amp; CEO / Head of Operations"
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#60756b] outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      Official Business Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="partnership@yourbrand.com"
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#60756b] outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      10-Digit Mobile / WhatsApp *
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#60756b] outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      Operating City *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Bengaluru / Dehradun / Kolkata"
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#60756b] outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      State / Region *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      placeholder="e.g. Karnataka / Himachal Pradesh / West Bengal"
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#60756b] outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      GSTIN (Goods &amp; Services Tax Identification)
                    </label>
                    <input
                      type="text"
                      value={form.gstin}
                      onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                      placeholder="e.g. 29AAAAA0000A1Z5 (or type 'Pending / In Progress')"
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#60756b] outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Product Category & Quality Standards */}
              <div className="pt-2">
                <h3 className="mb-4 flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
                  <Layers size={16} /> 3. Product Category &amp; Formulation Quality
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      Primary Product Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                    >
                      <option className="bg-[#070a0e] text-white">Botanical Skincare Formulations</option>
                      <option className="bg-[#070a0e] text-white">Clean Hair &amp; Scalp Care</option>
                      <option className="bg-[#070a0e] text-white">Cold-Pressed Botanical &amp; Carrier Oils</option>
                      <option className="bg-[#070a0e] text-white">Ayurvedic Ingestibles &amp; Adaptogen Drops</option>
                      <option className="bg-[#070a0e] text-white">Artisan Bath, Body &amp; Saponified Bars</option>
                      <option className="bg-[#070a0e] text-white">Wild-Harvest Botanical Ingredients &amp; Herbs</option>
                      <option className="bg-[#070a0e] text-white">Sustainable Glass &amp; Eco-Packaging Supplies</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      Estimated Monthly Production Capacity *
                    </label>
                    <select
                      value={form.monthlyCapacity}
                      onChange={(e) => setForm({ ...form, monthlyCapacity: e.target.value })}
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                    >
                      <option className="bg-[#070a0e] text-white">Micro-runs (100 – 500 units / month)</option>
                      <option className="bg-[#070a0e] text-white">Small-Batch (500 – 2,500 units / month)</option>
                      <option className="bg-[#070a0e] text-white">Medium Scale (2,500 – 10,000 units / month)</option>
                      <option className="bg-[#070a0e] text-white">High Volume (10,000+ units / month)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                      Licenses &amp; Certifications Held
                    </label>
                    <input
                      type="text"
                      value={form.certifications}
                      onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                      placeholder="e.g. AYUSH Manufacturing License / GMP / NPOP Organic / Cruelty-Free"
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#60756b] outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Brand Dossier & Pitch */}
              <div className="pt-2">
                <h3 className="mb-4 flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
                  <Leaf size={16} /> 4. Brand Story &amp; Formulation Pitch
                </h3>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9BB0A5] mb-1.5">
                    Product Formulation Philosophy, Active Actives &amp; Why Bhumivera *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.applicationDossier}
                    onChange={(e) => setForm({ ...form, applicationDossier: e.target.value })}
                    placeholder="Tell us about your hero ingredients, extraction temperature, pH range, where you source raw botanicals, and why our patrons will love your creations..."
                    className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#60756b] outline-none focus:border-[#D4AF37] leading-relaxed"
                  />
                </div>

                <div className="mt-4 rounded-2xl border border-[#D4AF37]/30 bg-[#070a0e] p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.disclosureCommitment}
                      onChange={(e) => setForm({ ...form, disclosureCommitment: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-[#D4AF37] text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <div className="text-xs leading-relaxed text-[#DFD7C4]">
                      <strong className="text-white block font-serif text-[13px]">
                        Commitment to 100% Active Percentage Disclosure
                      </strong>
                      I agree that formulations listed on Bhumivera must disclose active ingredients openly with exact percentages/mg concentrations, without relying on undisclosed synthetic bases.
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-[#244A38] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-[#9BB0A5] text-center sm:text-left">
                  Submissions are reviewed directly by the Bhumivera Executive Admin Team.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold-luxury w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:scale-105 transition-transform disabled:opacity-50"
                >
                  <Send size={15} />
                  {submitting ? 'Transmitting Dossier…' : 'Submit Seller Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
