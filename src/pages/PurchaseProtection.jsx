import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  RefreshCcw, 
  UserCheck, 
  FileSearch, 
  CreditCard, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

const PurchaseProtection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7 }
  };

  return (
    <div className="bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* SECTION 01: THE TRUST MANIFESTO (Hero) */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-24 pb-12 border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <ShieldCheck className="mx-auto text-emerald-500 mb-6" size={64} strokeWidth={1} />
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-8 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              The Trust Protocol
            </h1>
            <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-relaxed italic">
              "Security is not a feature; it is the invisible architecture of every transaction. At Bhumivera, we protect your journey from the first click to the final glow."
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 02: THE FOUR PILLARS OF PROTECTION */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Lock, title: "Encrypted Payments", desc: "Military-grade SSL/TLS layers ensuring your financial data never touches our servers in plain text." },
            { icon: Truck, title: "Transit Assurance", desc: "Full coverage for lost or damaged goods. If the seal is broken, our commitment begins." },
            { icon: RefreshCcw, title: "Seamless Returns", desc: "A 15-day window for botanical integrity. No-questions-asked resolution for quality discrepancies." },
            { icon: UserCheck, title: "Data Sovereignty", desc: "We adhere to strict privacy protocols. Your identity is your property, never a commodity." }
          ].map((pillar, idx) => (
            <motion.div 
              key={idx}
              {...fadeInUp}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-[#0d0d0d] border border-white/5 hover:border-emerald-500/30 transition-all group"
            >
              <pillar.icon className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-medium mb-4">{pillar.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 03: DEEP DIVE - THE GUARANTEE (Long-form Content) */}
      <section className="py-24 bg-white text-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeInUp}>
              <h2 className="text-4xl font-light mb-12 tracking-tight">01. Financial Integrity & Payment Logic</h2>
              <div className="prose prose-lg text-gray-700 space-y-6">
                <p>
                  Every transaction processed on <strong>Bhumivera.com</strong> is wrapped in a multi-layered security stack. We utilize 256-bit AES encryption, ensuring that your payment credentials—whether via Credit Card, UPI, or Net Banking—remain entirely opaque to third parties. 
                </p>
                <blockquote className="italic border-l-4 border-emerald-600 pl-6 my-8 py-2 bg-gray-50">
                  "In a digital economy, trust is the only currency that truly matters. Our payment gateway is built on a 'Zero-Knowledge' architecture."
                </blockquote>
                <p>
                  We partner exclusively with PCI-DSS compliant payment aggregators. This means we do not store your CVV or full card numbers on our internal databases. Your financial safety is automated, audited, and absolute.
                </p>
              </div>
            </motion.div>

            <div className="my-20 border-t border-gray-100"></div>

            <motion.div {...fadeInUp}>
              <h2 className="text-4xl font-light mb-12 tracking-tight">02. The "Physical Asset" Guarantee</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-gray-700">
                  <p>
                    Unlike standard e-commerce, Bhumivera views shipping as an extension of the product experience. Our <strong>Transit Protection Plan</strong> covers:
                  </p>
                  <ul className="space-y-4 list-none">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      <span>Full replacement for items damaged during courier handling.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      <span>Lost-in-transit priority re-shipping within 48 hours.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      <span>Tamper-evident packaging verification.</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                   <img 
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" 
                    alt="Packaging Security" 
                    className="rounded-sm shadow-2xl"
                  />
                  <div className="absolute -bottom-6 -right-6 p-6 bg-emerald-600 text-white font-mono text-xs">
                    SOP: TRANSIT_VERIFIED_V1
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="my-20 border-t border-gray-100"></div>

            <motion.div {...fadeInUp}>
              <h2 className="text-4xl font-light mb-12 tracking-tight">03. Botanical Authenticity & Quality Audits</h2>
              <div className="prose prose-lg text-gray-700 space-y-6">
                <p>
                  Our purchase protection extends into the chemistry of the products themselves. If a product does not meet the specified pH levels or botanical purity standards outlined in our <strong>Bhumivera Science</strong> whitepapers, we offer a total refund.
                </p>
                <p>
                  We conduct "Blind Batch Audits" where random units are pulled from the warehouse and tested for microbial purity. This ensures that what arrives at your doorstep is exactly what was engineered in our lab.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 04: THE CLAIM ALGORITHM (Process Flow) */}
      <section className="py-24 bg-[#0d0d0d] relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light mb-4">How to Initiate a Protection Claim</h2>
            <p className="text-gray-500">Fast-tracked resolution logic for Bhumivera customers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileSearch className="text-emerald-500" />
              </div>
              <h4 className="text-xl mb-4">1. Document</h4>
              <p className="text-sm text-gray-500 px-8">Take a photo of the delivery box and the internal product condition.</p>
            </div>
            {/* Step 2 */}
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="text-emerald-500" />
              </div>
              <h4 className="text-xl mb-4">2. Trigger</h4>
              <p className="text-sm text-gray-500 px-8">Email <strong>support@bhumivera.com</strong> with your Order ID and "CLAIM" in the subject line.</p>
            </div>
            {/* Step 3 */}
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCcw className="text-emerald-500" />
              </div>
              <h4 className="text-xl mb-4">3. Resolution</h4>
              <p className="text-sm text-gray-500 px-8">Our team reviews and initiates a replacement or refund within 24 hours.</p>
            </div>
            
            {/* Decorative Connector Line */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* SECTION 05: FAQ SNIPPETS */}
      <section className="py-32">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-light mb-16 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div className="border-b border-white/5 pb-8">
              <h5 className="flex items-center gap-4 text-emerald-400 mb-4 font-mono text-sm uppercase tracking-wider">
                <HelpCircle size={16} /> Is my card data stored?
              </h5>
              <p className="text-gray-400 leading-relaxed">
                No. We use a method called "Tokenization." Your card details are replaced with a unique digital token by the bank, so Bhumivera never sees or holds your sensitive data.
              </p>
            </div>
            <div className="border-b border-white/5 pb-8">
              <h5 className="flex items-center gap-4 text-emerald-400 mb-4 font-mono text-sm uppercase tracking-wider">
                <HelpCircle size={16} /> What if my order is marked "Delivered" but I haven't received it?
              </h5>
              <p className="text-gray-400 leading-relaxed">
                Our Purchase Protection includes "Last-Mile Assurance." If a courier logs a delivery incorrectly, we open an investigation and ensure a resolution within 3 business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <footer className="py-24 bg-emerald-600 text-black text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-light mb-8 italic">"Shop with the peace of mind you deserve."</h2>
          <p className="max-w-xl mx-auto mb-10 text-emerald-950 font-medium">
            Our protection isn't just a policy; it's our brand's DNA. Experience the Bhumivera standard of security.
          </p>
          <div className="flex justify-center gap-6">
            <button className="px-10 py-4 bg-black text-white hover:bg-neutral-800 transition-all font-bold tracking-widest uppercase text-xs">
              Go to Shop
            </button>
            <button className="px-10 py-4 border border-black hover:bg-black hover:text-white transition-all font-bold tracking-widest uppercase text-xs">
              Contact Support
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default PurchaseProtection;
