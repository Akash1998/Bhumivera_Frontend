import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Briefcase, DollarSign, Home, CheckCircle2, ShieldCheck, ArrowRight, Info, HelpCircle, Users, Box, Plus, Minus } from 'lucide-react';

const easeFluid = [0.25, 1, 0.5, 1];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeFluid } }
};

export default function MPGEBusinessLanding() {
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Business Phone Configurations - Change these values to your active support numbers
  const phoneNumber = "+919999999999"; 
  const whatsappNumber = "919999999999"; 
  const whatsappMessage = encodeURIComponent("Hello MPGEBusiness, I am interested in your Work from Home program. Please provide more details on how to start earning.");

  const highlights = [
    { icon: <Home className="w-6 h-6 text-[#d4af37]" />, title: "Complete Work From Home", desc: "No commercial setup needed. Start a business comfortably inside your own home space." },
    { icon: <Box className="w-6 h-6 text-[#d4af37]" />, title: "Raw Material Provided", desc: "We deliver 100% of the raw materials directly to your doorstep across India." },
    { icon: <ShieldCheck className="w-6 h-6 text-[#d4af37]" />, title: "100% Guaranteed Buyback", desc: "Everything you cultivate or manufacture is legally bound to be bought back by us." },
    { icon: <DollarSign className="w-6 h-6 text-[#d4af37]" />, title: "Weekly/Monthly Payouts", desc: "Get direct bank transfers as soon as the finished goods are verified and collected." }
  ];

  const tracks = [
    {
      title: "Track 1: Mushroom Cultivation",
      subtitle: "Agricultural Self-Employment Program",
      earningPotential: "₹15,000 - ₹35,000 / Month",
      description: "Utilize unused dark spaces inside your residential building or rooms to grow nutrient-dense, high-demand commercial mushrooms. We provide premium spawns and detailed technical guides.",
      bullets: [
        "Low investment, high-margin crop architecture",
        "Full scientific growing kits & organic boosters provided",
        "Climatic controls advice and full lifecycle mentorship",
        "Immediate wholesale collection by MPGEBusiness trucks"
      ],
      bg: "bg-[#1e1510]"
    },
    {
      title: "Track 2: Home-Based 'Mukut' Assembly",
      subtitle: "Handicraft & Manufacturing Program",
      earningPotential: "₹12,000 - ₹25,000 / Month",
      description: "Assemble premium cultural and traditional design crowns (Mukuts) directly from home. Perfect for women, students, and seniors looking for secondary income streams.",
      bullets: [
        "Zero artistic experience required — easy onboarding video modules",
        "Raw beads, structures, threads, and stones delivered by us",
        "Flexible working hours — scale production up or down at your pace",
        "Fixed-rate payment structure per approved finished unit"
      ],
      bg: "bg-[#2c2017]"
    }
  ];

  const steps = [
    { step: "01", title: "Instant Registration", desc: "Call our helpline or message on WhatsApp to secure a slot in your local pincode." },
    { step: "02", title: "Material Logistics", desc: "Our transport partner delivers raw assembly components or cultivation spawn bags to your home." },
    { step: "03", title: "Production & Build", desc: "Cultivate or assemble following our structural quality control frameworks." },
    { step: "04", title: "Inspection & Collection", desc: "Our supervisors inspect items at your door, weigh products, and initiate immediate bank buyback transfers." }
  ];

  const faqs = [
    { q: "What is MPGEBusiness Private Limited?", a: "MPGEBusiness Private Limited is a legally registered enterprise specialized in agro-processing, mushroom cultivation technology, and micro-handicraft self-employment distribution systems." },
    { q: "Is there any entry fee or security charges?", a: "To maintain serious partnerships and logistics coverage, a minor, fully-refundable logistical deployment structure applies based on your localized package metrics. Call our managers for dynamic offers today." },
    { q: "How do I receive payments for finished products?", a: "Payments are settled via IMPS, UPI, or Direct NEFT Bank Transfer instantly upon product counting and collection from your home." },
    { q: "Do I need special licensing to grow mushrooms at home?", a: "No commercial manufacturing license is required for basic domestic production tiers. We cover standard collective clearances under our processing licenses." }
  ];

  return (
    <div className="bg-[#f6f0e4] text-[#2c2c2c] font-sans selection:bg-[#6b4226] selection:text-[#f6f0e4]">
      
      {/* Dynamic Announcement Top Bar */}
      <div className="bg-[#6b4226] text-[#f6f0e4] py-3 px-4 text-center text-xs font-bold uppercase tracking-[0.2em] sticky top-0 z-50 shadow-md flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        MPGEBusiness Self-Employment Initiative 2026: Pincode Registrations are Now Active
      </div>

      {/* Hero Section */}
      <section className="relative bg-[#1e1510] pt-20 pb-32 px-6 overflow-hidden border-b border-[#6b4226]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#6b4226]/30 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: easeFluid }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#d4af37]/40 bg-[#2c2017] text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <Briefcase size={12} /> Govt Registered Corporate Program
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easeFluid }}
            className="text-4xl sm:text-6xl font-serif text-[#f6f0e4] tracking-tight leading-[1.15]"
          >
            Earn Steady Income From Home with <br />
            <span className="text-[#d4af37] font-serif italic">MPGEBusiness Pvt Ltd</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base sm:text-xl text-[#e2d8c8] font-light max-w-3xl mx-auto leading-relaxed"
          >
            Empowering unemployed individuals, housewives, and students across India. We supply premium raw materials, guide you step-by-step, and offer a <span className="text-[#d4af37] font-semibold">100% legal buyback guarantee</span>.
          </motion.p>

          {/* Core Intent CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6"
          >
            <a 
              href={`tel:${phoneNumber}`}
              className="w-full sm:w-auto px-10 py-5 bg-[#d4af37] text-[#1e1510] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#f6f0e4] transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(212,175,55,0.15)]"
            >
              <Phone size={16} fill="currentColor" /> Tap To Call Helpline Now
            </a>
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-transparent text-[#f6f0e4] border border-[#f6f0e4]/40 hover:border-[#d4af37] hover:text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3"
            >
              Connect on WhatsApp <ArrowRight size={14} />
            </a>
          </motion.div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 text-left border-t border-[#6b4226]/30 mt-16">
            <div className="bg-[#2c2017] p-6 border border-[#6b4226]/20">
              <p className="text-[#d4af37] text-2xl sm:text-3xl font-serif font-bold">100%</p>
              <p className="text-[#e2d8c8] text-xs tracking-wider uppercase mt-1">Material Delivery</p>
            </div>
            <div className="bg-[#2c2017] p-6 border border-[#6b4226]/20">
              <p className="text-[#d4af37] text-2xl sm:text-3xl font-serif font-bold">₹35K</p>
              <p className="text-[#e2d8c8] text-xs tracking-wider uppercase mt-1">Max Monthly Potential</p>
            </div>
            <div className="bg-[#2c2017] p-6 border border-[#6b4226]/20">
              <p className="text-[#d4af37] text-2xl sm:text-3xl font-serif font-bold">4,500+</p>
              <p className="text-[#e2d8c8] text-xs tracking-wider uppercase mt-1">Active Cultivators</p>
            </div>
            <div className="bg-[#2c2017] p-6 border border-[#6b4226]/20">
              <p className="text-[#d4af37] text-2xl sm:text-3xl font-serif font-bold">Legal</p>
              <p className="text-[#e2d8c8] text-xs tracking-wider uppercase mt-1">Buyback Agreement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Benefits Overview */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-[10px] font-bold text-[#6b4226] uppercase tracking-[0.5em]">The MPGE Advantage</h2>
          <h3 className="text-3xl sm:text-5xl font-serif text-[#1e1510]">Why thousands trust our home livelihood channels</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((h, i) => (
            <div key={i} className="bg-[#ebe1d1] p-8 border border-[#dccfb8] shadow-sm flex flex-col space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-none bg-[#1e1510] flex items-center justify-center">
                {h.icon}
              </div>
              <h4 className="text-base font-bold uppercase tracking-wider text-[#1e1510] pt-2">{h.title}</h4>
              <p className="text-[#4a3628] font-light text-sm leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Livelihood Tracks */}
      <section className="bg-[#ebe1d1] py-24 px-6 border-y border-[#dccfb8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-[10px] font-bold text-[#6b4226] uppercase tracking-[0.5em]">Available Income Frameworks</h2>
            <h3 className="text-3xl sm:text-5xl font-serif text-[#1e1510]">Choose your specialization track</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {tracks.map((track, i) => (
              <div key={i} className={`${track.bg} text-[#f6f0e4] p-8 sm:p-12 border border-[#6b4226]/40 shadow-2xl flex flex-col justify-between space-y-8`}>
                <div className="space-y-6">
                  <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em] block">{track.subtitle}</span>
                  <h4 className="text-2xl sm:text-3xl font-serif tracking-wide">{track.title}</h4>
                  
                  <div className="bg-[#f6f0e4]/10 p-4 border-l-4 border-[#d4af37] flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-[#e2d8c8]">Earnings Potential:</span>
                    <span className="text-[#d4af37] font-serif font-bold text-lg">{track.earningPotential}</span>
                  </div>

                  <p className="text-[#e2d8c8] font-light text-sm leading-loose pt-2">{track.description}</p>
                  
                  <div className="w-full h-px bg-[#6b4226]/40" />
                  
                  <ul className="space-y-3 pt-2">
                    {track.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[#e2d8c8] font-light">
                        <CheckCircle2 size={16} className="text-[#d4af37] mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <a 
                    href={`tel:${phoneNumber}`} 
                    className="w-full py-4 bg-[#6b4226] hover:bg-[#d4af37] hover:text-[#1e1510] text-[#f6f0e4] text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    Apply For This Specific Track <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Step Onboarding Sequence */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-[10px] font-bold text-[#6b4226] uppercase tracking-[0.5em]">The Execution Model</h2>
          <h3 className="text-3xl sm:text-5xl font-serif text-[#1e1510]">4 Steps to secure regular monthly payouts</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((s, i) => (
            <div key={i} className="bg-[#f6f0e4] p-8 border-l-2 border-[#6b4226] relative group hover:bg-[#ebe1d1] transition-colors">
              <span className="text-4xl font-serif italic font-bold text-[#6b4226]/15 group-hover:text-[#6b4226]/30 transition-colors absolute top-4 right-6">{s.step}</span>
              <h4 className="text-lg font-bold uppercase tracking-wider text-[#1e1510] mb-3">{s.title}</h4>
              <p className="text-[#4a3628] font-light text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Transparency Legal Footprint */}
      <section className="bg-[#1e1510] text-[#f6f0e4] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 bg-[#2c2017] border border-[#6b4226] flex items-center justify-center mx-auto text-[#d4af37]">
            <Users size={28} />
          </div>
          <h3 className="text-2xl sm:text-4xl font-serif">100% Risk-Free Professional Corporate System</h3>
          <p className="text-sm sm:text-base text-[#e2d8c8] font-light leading-relaxed max-w-2xl mx-auto">
            We operate in compliance with ministry standards. Every vendor or household execution is cataloged down to the batch system with full tracking. No ambiguous fine print — we deliver raw materials, you assemble/grow, we issue standard corporate payouts.
          </p>
          <div className="pt-4">
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer" 
              className="px-10 py-5 bg-[#d4af37] text-[#1e1510] font-bold text-xs uppercase tracking-[0.2em] inline-flex items-center gap-3 hover:bg-[#f6f0e4] transition-colors"
            >
              Verify Available Batch Openings On WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Informative Frequently Asked Questions */}
      <section className="py-24 px-6 max-w-4xl mx-auto bg-[#f6f0e4]">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-[10px] font-bold text-[#6b4226] uppercase tracking-[0.5em]">Transparent Disclosures</h2>
          <h3 className="text-3xl sm:text-4xl font-serif text-[#1e1510]">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-[#dccfb8]">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
              >
                <span className="text-sm sm:text-base font-bold uppercase tracking-widest text-[#1e1510] group-hover:text-[#6b4226] transition-colors">{faq.q}</span>
                <span className="text-[#6b4226] transition-transform duration-300">
                  {activeFaq === idx ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }} 
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="pb-6 text-[#4a3628] font-light text-sm sm:text-base leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Bottom Persistent High-Conversion Call CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1e1510]/95 backdrop-blur-md border-t border-[#6b4226]/40 py-4 px-6 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <p className="text-xs text-[#d4af37] font-bold uppercase tracking-widest">Slots are filling rapidly</p>
          <p className="text-[#f6f0e4] font-serif text-sm hidden sm:block">Speak directly with a micro-employment licensing advisor</p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-4">
          <a 
            href={`tel:${phoneNumber}`} 
            className="flex-1 sm:flex-none px-8 py-4 bg-[#6b4226] text-[#f6f0e4] hover:bg-[#d4af37] hover:text-[#1e1510] text-[10px] font-bold uppercase tracking-[0.2em] text-center transition-all flex items-center justify-center gap-2"
          >
            <Phone size={12} fill="currentColor" /> Call Helpline
          </a>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 sm:flex-none px-8 py-4 bg-[#d4af37] text-[#1e1510] hover:bg-[#f6f0e4] text-[10px] font-bold uppercase tracking-[0.2em] text-center transition-all flex items-center justify-center gap-2"
          >
            WhatsApp Info
          </a>
        </div>
      </div>
      
      {/* Spacer matching layout depth */}
      <div className="h-24 sm:h-20 bg-[#1e1510]" />

    </div>
  );
}
