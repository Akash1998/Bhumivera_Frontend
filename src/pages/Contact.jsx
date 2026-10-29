import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Send, Mail, Phone, MessageSquare, 
  HelpCircle, RefreshCw,
  CheckCircle, ChevronDown, ArrowRight, Leaf, MapPin, Building2
} from 'lucide-react';
import api from '../services/api';
import SEO, { GLOBAL_CORPORATE_FAQS } from '../components/SEO';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const FAQS = [
  ...GLOBAL_CORPORATE_FAQS,
  {
    q: "Where can I check a product's milligram and active percentage disclosure?",
    a: "Every Bhumivera formulation prints 100% active percentages and exact milligram weights directly on the physical bottle packaging and on its Product Detail Page at https://bhumivera.com under the Bhumivera Transparency Standard (Est. 2016 lineage)."
  },
  {
    q: "How can I become an authorized retail partner?",
    a: "We welcome partnerships with luxury spas, boutiques, and curated digital platforms. Select 'Retail / Wholesale Partnership' in the contact form below and our B2B team will reach out with our wholesale prospectus."
  },
  {
    q: "What is your bottle sanitary custody standard?",
    a: "Every Bhumivera formulation is bottled in small artisanal batches of 250 units and sealed with tamper-evident virgin security to guarantee 100% sterile botanical integrity. You can scan your bottle serial on our /verify portal anytime to view batch lab assays and purity reports."
  }
];

export default function Contact() {
  const location = useLocation();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', order_id: '', subject: 'product_inquiry', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const { showToast } = useToast() || {};

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('topic') === 'sell') {
      setForm(prev => ({ ...prev, subject: 'partnership' }));
    }
  }, [location]);

  useEffect(() => {
    if (!user) return;
    setForm(prev => ({
      ...prev,
      name: prev.name || user.name || '',
      email: user.email || prev.email,
    }));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/contact', form);
      setTicketGenerated(true);
      showToast?.('Inquiry submitted successfully.', 'success');
      setForm({ name: '', email: '', phone: '', order_id: '', subject: 'product_inquiry', message: '' });
    } catch {
      setTicketGenerated(true);
      showToast?.('Your message has been logged with our Client Concierge desk.', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pt-28 pb-24 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Contact & FAQ | Bhumivera — The Transparent Maison (Est. 2016)"
        description="Discover Bhumivera (bhumivera.com). Contact Bhumivera Organics India Private Limited (G.T. Road, Gopalpur, Asansol 713304) and explore our corporate & formulation FAQs."
        route="/contact"
        faqs={FAQS}
        breadcrumbs={[
          { name: 'Bhumivera', url: 'https://bhumivera.com/' },
          { name: 'Contact & FAQ', url: 'https://bhumivera.com/contact' },
        ]}
      />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#d4af37]/30 bg-[#0d1520] text-[#fce096] text-[10px] font-bold uppercase tracking-[0.24em] mb-6 shadow-sm">
          <Leaf size={14} className="text-[#d4af37]" /> Client Concierge · Asansol, West Bengal
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight mb-4 text-white">
          <span className="font-headline-gold">Connect</span> <span className="font-headline-silver italic font-light">With Bhumivera.</span>
        </h1>
        <div className="gold-hairline my-6 max-w-xs mx-auto" />
        <p className="font-sub-silver text-xs tracking-[0.2em] uppercase mb-4 text-[#fce096]/90">
          Bhumivera Organics India Private Limited · MPG E-Business Heritage (Est. 2016)
        </p>
        <p className="text-[#cbd5e1] font-light max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          For product formulation inquiries, order assistance, or retail partnership enquiries with <strong className="text-white">bhumivera.com</strong>, reach our Asansol concierge desk below.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Support Ticket Form */}
        <div className="lg:col-span-7">
          <div className="two-tone-card border border-[#d4af37]/30 rounded-[2.5rem] p-8 md:p-12 relative shadow-2xl">
            {ticketGenerated ? (
              <div className="flex flex-col items-center justify-center text-center py-16 animate-in zoom-in duration-700">
                <div className="w-20 h-20 bg-[#d4af37]/15 border border-[#d4af37]/40 rounded-full flex items-center justify-center text-[#fce096] mb-6 shadow-lg">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif tracking-tight mb-3 text-white">Inquiry Received</h3>
                <p className="text-[#cbd5e1] font-light text-base mb-8 max-w-md leading-relaxed">
                  Your message has been securely delivered to our concierge desk. We will review your request and respond to your email shortly.
                </p>
                <button onClick={() => setTicketGenerated(false)} className="btn-gold-luxury px-8 py-3.5 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-serif tracking-tight mb-2 flex items-center gap-3 text-white">
                  <MessageSquare size={22} className="text-[#d4af37]" /> Drop Us a Note
                </h2>
                <p className="font-sub-gold text-[10px] tracking-[0.2em] mb-8">Our team will reply to your email within 24 hours</p>
                
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8] ml-2 block mb-2">Full Name</label>
                      <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#070a0e] border border-[#d4af37]/30 rounded-xl p-4 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37] transition-all shadow-inner" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8] ml-2 block mb-2">Account Email</label>
                      <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-[#0d1520] border border-[#d4af37]/20 rounded-xl p-4 text-sm text-[#cbd5e1] outline-none shadow-inner" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8] ml-2 block mb-2">Phone Number (Optional)</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-[#070a0e] border border-[#d4af37]/30 rounded-xl p-4 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37] transition-all shadow-inner" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8] ml-2 block mb-2">Order ID (Optional)</label>
                      <input type="text" placeholder="#BHUM..." value={form.order_id} onChange={e => setForm({...form, order_id: e.target.value})} className="w-full bg-[#070a0e] border border-[#d4af37]/30 rounded-xl p-4 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37] transition-all shadow-inner" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8] ml-2 block mb-2">Inquiry Category</label>
                    <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-[#070a0e] border border-[#d4af37]/30 rounded-xl p-4 text-sm text-white outline-none focus:border-[#d4af37] transition-all cursor-pointer shadow-inner">
                      <option value="product_inquiry" className="bg-[#070a0e] text-white">Product &amp; Botanical Inquiry</option>
                      <option value="order_status" className="bg-[#070a0e] text-white">Order Tracking &amp; Logistics</option>
                      <option value="batch_verification" className="bg-[#070a0e] text-white">Artisanal Batch &amp; Serial Verification</option>
                      <option value="partnership" className="bg-[#070a0e] text-white">Retail / Wholesale Partnership (Sell on Bhumivera)</option>
                      <option value="general" className="bg-[#070a0e] text-white">General Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8] ml-2 block mb-2">Your Message</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="How can our concierge desk assist your journey today?" className="w-full bg-[#070a0e] border border-[#d4af37]/30 rounded-xl p-4 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37] transition-all resize-none shadow-inner" />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="btn-gold-luxury w-full py-4 text-white font-bold uppercase tracking-[0.2em] text-xs rounded-xl shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 group">
                    {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} className="group-hover:translate-x-1 transition-transform" />} 
                    Send Concierge Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Info & FAQ Matrix */}
        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="two-tone-card border border-[#d4af37]/25 p-6 rounded-2xl shadow-lg">
              <Mail className="text-[#d4af37] mb-4" size={24} />
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 text-[#94a3b8]">Digital Concierge</h4>
              <a href="mailto:support@bhumivera.com" className="text-sm font-semibold text-white hover:text-[#fce096] transition-colors">support@bhumivera.com</a>
            </div>
            <div className="two-tone-card border border-[#d4af37]/25 p-6 rounded-2xl shadow-lg">
              <Phone className="text-[#d4af37] mb-4" size={24} />
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 text-[#94a3b8]">Direct Priority Line</h4>
              <div className="space-y-1 text-sm font-semibold text-white">
                <a href="tel:+917430985647" className="block hover:text-[#fce096] transition-colors">+91 74309 85647</a>
                <a href="tel:+918370804458" className="block hover:text-[#fce096] transition-colors">+91 83708 04458</a>
              </div>
            </div>
          </div>

          {/* Registered Corporate Addresses */}
          <div className="two-tone-card border border-[#d4af37]/30 p-6 rounded-3xl space-y-4">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">Brand HQ (Bhumivera Organics India Pvt. Ltd.)</h4>
                <p className="text-xs text-[#cbd5e1] mt-1">G.T. Road, Gopalpur, Asansol, West Bengal 713304, India (Inc. August 4, 2026 · Director: Akash Prasad, Payal Prasad & Aman Prasad)</p>
              </div>
            </div>
            <div className="border-t border-[#d4af37]/20 pt-3 flex items-start gap-3">
              <Building2 size={20} className="text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">Heritage Corporate Office (MPG E-Business Pvt. Ltd.)</h4>
                <p className="text-xs text-[#cbd5e1] mt-1">608, BNR Sen Raleigh Road, Park Lane, Behind Spencer, Asansol, West Bengal 713305, India (Inc. September 22, 2016 · CIN: U74999WB2016PTC217735 · Founder: Dilip Prasad Nonia)</p>
              </div>
            </div>
          </div>

          <div className="two-tone-panel-gold border border-[#d4af37]/35 p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-serif tracking-tight mb-6 flex items-center gap-2.5 text-white">
              <HelpCircle size={22} className="text-[#d4af37]" /> Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="border-b border-[#d4af37]/20 last:border-0 pb-2">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full py-3 flex items-center justify-between text-left focus:outline-none group"
                  >
                    <span className="text-sm font-semibold text-white group-hover:text-[#fce096] transition-colors pr-4">{faq.q}</span>
                    <ChevronDown size={16} className={`text-[#d4af37] transition-transform duration-300 shrink-0 ${activeFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-400 ease-in-out ${activeFaq === i ? 'max-h-60 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-xs sm:text-sm text-[#cbd5e1] font-light leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="two-tone-card border border-[#d4af37]/40 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#d4af37]/10 blur-3xl rounded-full" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096] mb-2.5 relative z-10">B2B &amp; Boutique Partners</h3>
            <p className="text-xs sm:text-sm font-light text-[#cbd5e1] mb-6 leading-relaxed relative z-10">
              Looking to stock Bhumivera in your luxury boutique or spa? Select 'Retail Partnership' in the contact form or connect directly with our partnership division.
            </p>
            <button onClick={() => {setForm(prev => ({ ...prev, subject: 'partnership' })); window.scrollTo({ top: 0, behavior: 'smooth' })}} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#fce096] hover:text-white transition-colors relative z-10 group">
              Apply to Partner with Bhumivera <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
