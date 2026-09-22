import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Send, Mail, Phone, MessageSquare, 
  HelpCircle, FileText, RefreshCw,
  CheckCircle, ChevronDown, ArrowRight, Leaf
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const FAQS = [
  {
    q: "Are your formulations 100% natural?",
    a: "Absolutely. We reject all synthetic preservatives, parabens, and sulfates. Our entire catalog is rooted in pure, earth-derived botanicals sourced directly from trusted cultivators."
  },
  {
    q: "How can I become an authorized retail partner?",
    a: "We welcome partnerships with luxury spas, boutiques, and curated digital platforms. Select 'Retail / Wholesale Partnership' in the contact form below and our B2B team will reach out with our wholesale prospectus."
  },
  {
    q: "How long does shipping take?",
    a: "Orders processed before 14:00 IST are dispatched the same day. Standard transit times are 2-4 business days, wrapped securely in our eco-conscious packaging."
  },
  {
    q: "What is your return policy?",
    a: "Due to the natural and personal care nature of our products, we accept returns on unopened, sealed items within 7 days of delivery. Refer to our Returns Centre for full details."
  }
];

export default function Contact() {
  const location = useLocation();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', order_id: '', subject: 'product_inquiry', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const { showToast } = useToast() || {};

  // Parse URL parameters to auto-select "Sell on Bhumivera" routing
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('topic') === 'sell') {
      setForm(prev => ({ ...prev, subject: 'partnership' }));
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/contact', form);
      setTicketGenerated(true);
      showToast?.('Inquiry submitted successfully.', 'success');
      setForm({ name: '', email: '', phone: '', order_id: '', subject: 'product_inquiry', message: '' });
    } catch (err) {
      showToast?.('Failed to submit your inquiry. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f0e4] text-[#1e1510] pt-32 pb-20 font-sans selection:bg-[#6b4226] selection:text-[#f6f0e4]">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#6b4226]/30 bg-[#1e1510]/5 text-[#6b4226] text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
          <Leaf size={14} /> Concierge Active
        </div>
        <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-6 text-[#1e1510]">
          Connect <span className="italic text-[#6b4226] font-light">With Us.</span>
        </h1>
        <p className="text-[#4a3628] font-light max-w-2xl mx-auto text-lg leading-relaxed">
          Whether you need guidance on your botanical regimen, logistics support, or are interested in becoming a retail partner, our dedicated team is here to assist.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Support Ticket Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#dccfb8] rounded-[3rem] p-8 md:p-14 relative shadow-sm hover:shadow-xl transition-shadow duration-700">
            
            {ticketGenerated ? (
              <div className="flex flex-col items-center justify-center text-center py-20 animate-in zoom-in duration-700">
                <div className="w-24 h-24 bg-[#6b4226]/10 border border-[#6b4226]/20 rounded-full flex items-center justify-center text-[#6b4226] mb-8">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-serif tracking-tight mb-4 text-[#1e1510]">Inquiry Received</h3>
                <p className="text-[#4a3628] font-light text-lg mb-10 max-w-md leading-relaxed">
                  Your message has been securely delivered to our concierge team. We will review your request and respond to your email shortly.
                </p>
                <button onClick={() => setTicketGenerated(false)} className="px-10 py-4 bg-[#1e1510] text-[#f6f0e4] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#6b4226] transition-all duration-500">
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-serif tracking-tight mb-2 flex items-center gap-4 text-[#1e1510]">
                  <MessageSquare size={24} className="text-[#6b4226]" /> Drop us a note
                </h2>
                <p className="text-[10px] font-bold text-[#6b4226] uppercase tracking-[0.2em] mb-10">We usually reply within 24 hours</p>
                
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a3628] ml-2 block mb-3">Full Name</label>
                      <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#faf8f5] border border-[#dccfb8] rounded-2xl p-5 text-sm text-[#1e1510] outline-none focus:border-[#6b4226] focus:bg-white transition-all shadow-inner" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a3628] ml-2 block mb-3">Email Address</label>
                      <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-[#faf8f5] border border-[#dccfb8] rounded-2xl p-5 text-sm text-[#1e1510] outline-none focus:border-[#6b4226] focus:bg-white transition-all shadow-inner" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a3628] ml-2 block mb-3">Phone Number (Optional)</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-[#faf8f5] border border-[#dccfb8] rounded-2xl p-5 text-sm text-[#1e1510] outline-none focus:border-[#6b4226] focus:bg-white transition-all shadow-inner" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a3628] ml-2 block mb-3">Order ID (Optional)</label>
                      <input type="text" placeholder="#BHUM..." value={form.order_id} onChange={e => setForm({...form, order_id: e.target.value})} className="w-full bg-[#faf8f5] border border-[#dccfb8] rounded-2xl p-5 text-sm text-[#1e1510] outline-none focus:border-[#6b4226] focus:bg-white transition-all shadow-inner" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a3628] ml-2 block mb-3">Inquiry Category</label>
                    <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-[#faf8f5] border border-[#dccfb8] rounded-2xl p-5 text-sm text-[#1e1510] outline-none focus:border-[#6b4226] focus:bg-white transition-all appearance-none cursor-pointer shadow-inner">
                      <option value="product_inquiry">Product & Botanical Inquiry</option>
                      <option value="order_status">Order Tracking & Logistics</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="partnership">Retail / Wholesale Partnership (Sell on Bhumivera)</option>
                      <option value="general">General Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a3628] ml-2 block mb-3">Your Message</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="How can we assist your journey today?" className="w-full bg-[#faf8f5] border border-[#dccfb8] rounded-2xl p-5 text-sm text-[#1e1510] outline-none focus:border-[#6b4226] focus:bg-white transition-all resize-none shadow-inner" />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-[#1e1510] text-[#f6f0e4] font-bold uppercase tracking-[0.2em] text-[10px] rounded-full hover:bg-[#6b4226] transition-all duration-500 shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 group">
                    {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} className="group-hover:translate-x-1 transition-transform" />} 
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Info & FAQ Matrix */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-[#dccfb8] p-8 rounded-[2rem] shadow-sm">
              <Mail className="text-[#6b4226] mb-5" size={28} />
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-[#4a3628]">Digital Desk</h4>
              <p className="text-sm font-medium text-[#1e1510]">support@Bhumivera.com</p>
            </div>
            <div className="bg-white border border-[#dccfb8] p-8 rounded-[2rem] shadow-sm">
              <Phone className="text-[#6b4226] mb-5" size={28} />
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-[#4a3628]">Concierge Line</h4>
              <p className="text-sm font-medium text-[#1e1510]">+91 90000 00000</p>
            </div>
          </div>

          <div className="bg-white border border-[#dccfb8] p-10 rounded-[2.5rem] shadow-sm">
            <h3 className="text-2xl font-serif tracking-tight mb-8 flex items-center gap-3 text-[#1e1510]">
              <HelpCircle size={24} className="text-[#6b4226]" /> Common Queries
            </h3>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="border-b border-[#dccfb8] last:border-0 pb-2">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
                  >
                    <span className="text-sm font-bold text-[#1e1510] group-hover:text-[#6b4226] transition-colors pr-4">{faq.q}</span>
                    <ChevronDown size={16} className={`text-[#6b4226] transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-400 ease-in-out ${activeFaq === i ? 'max-h-60 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-sm text-[#4a3628] font-light leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1e1510] border border-[#6b4226]/50 p-10 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/10 blur-3xl rounded-full" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-3 relative z-10">B2B & Retail Partners</h3>
            <p className="text-sm font-light text-[#a89f91] mb-8 leading-relaxed relative z-10">Looking to stock Bhumivera in your boutique or spa? Select 'Retail Partnership' in the form or visit our dedicated dealer portal to begin the onboarding process.</p>
            <button onClick={() => {setForm(prev => ({ ...prev, subject: 'partnership' })); window.scrollTo({ top: 0, behavior: 'smooth' })}} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f6f0e4] hover:text-[#d4af37] transition-colors relative z-10 group">
              Apply to Sell on Bhumivera <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
