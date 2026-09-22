import React from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw, 
  PackageCheck, 
  Clock, 
  CreditCard, 
  ShieldAlert, 
  FileText, 
  Truck, 
  HelpCircle,
  CheckCircle2,
  Scale
} from 'lucide-react';

const ReturnsCentre = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* SECTION 01: HERO (The Returns Philosophy) */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-16 bg-gradient-to-b from-emerald-950/10 to-transparent">
        <div className="container mx-auto px-6 text-center z-10">
          <motion.div {...fadeInUp}>
            <RotateCcw className="mx-auto text-emerald-500 mb-6" size={48} strokeWidth={1.5} />
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-8 italic">
              Returns & Resolution
            </h1>
            <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-relaxed mb-8">
              "A return is not a failure of the product, but an opportunity to refine the relationship. At Bhumivera, we architect our return process with the same precision as our botanical formulas."
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 02: THE RETURNS MANIFESTO (500+ Words Section) */}
      <section className="py-24 bg-white text-black">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-3xl font-light mb-6 border-l-4 border-emerald-600 pl-4">The Ethical Pivot</h2>
                <p>
                  In the traditional e-commerce landscape, the returns process is often designed as a friction-point—a series of hurdles intended to discourage the customer from seeking a refund. At Bhumivera, we reject this "Deception-Based Logic." We believe that the integrity of a brand is measured not at the point of sale, but at the point of dissatisfaction. 
                </p>
                <p>
                  Our returns philosophy is built on the concept of <strong>"Recursive Trust."</strong> If a product—whether it be our signature Aloe Vera soap or a specialized Multani Mitti blend—does not harmonize with your skin’s unique biology, the failure is ours to rectify. By providing a seamless exit path, we ensure that the entrance to our brand remains welcoming and risk-free.
                </p>
              </div>
              <div className="relative pt-8">
                <img 
                  src="https://images.unsplash.com/photo-1566933266119-7a4bdbc4e641?auto=format&fit=crop&q=80&w=800" 
                  alt="Quality Assurance" 
                  className="rounded-sm shadow-2xl grayscale"
                />
                <div className="absolute top-0 right-0 p-4 bg-emerald-600 text-white font-mono text-[10px] tracking-widest uppercase">
                  Audit: Quality_Control_Passed
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-light italic">Botanical Integrity & The 15-Day Window</h3>
              <p>
                Because Bhumivera products are bio-active and contain "living" botanical ingredients, they are subject to environmental variables. While mass-produced chemical soaps are shelf-stable for decades, our cold-processed products are designed to be fresh. Therefore, our Return Algorithm is set to a <strong>15-day window</strong> from the date of delivery.
              </p>
              <p>
                This window is mathematically calculated to allow the user enough time to perform a "Skin Compatibility Test" (as outlined in our Science SOPs) while ensuring that returned items, if unopened, can still maintain their enzymatic potency. We do not accept returns of products that have been used beyond a reasonable testing amount (exceeding 10% of total volume), as this enters the realm of "consumptive waste" rather than "quality discrepancy."
              </p>
              <blockquote className="text-3xl font-light text-emerald-700 italic border-l-0 text-center py-12">
                "We trade in the currency of results. If the results do not manifest, the transaction is incomplete."
              </blockquote>
              <p>
                To maintain our carbon-neutral footprint, we encourage "Resolution through Replacement" rather than "Resolution through Return." Every return shipment generates a logistics chain that increases our environmental impact. In many cases, if a product is damaged or defective, we may issue a full refund or replacement without requiring you to ship the physical item back, thus closing the loop with minimal environmental friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: THE 10 COMMANDMENTS (Terms & Conditions) */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <Scale className="text-emerald-500 mb-4" size={40} />
            <h2 className="text-4xl font-light tracking-tight">The Industry Standard: 10 Essential T&Cs</h2>
            <p className="text-gray-500 mt-4 max-w-2xl text-center italic">
              "Transparency in governance is the foundation of our digital commerce architecture."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {[
              { 
                id: "01", 
                title: "Right to Cancel (The Cooling-Off Period)", 
                content: "Per global e-commerce directives, customers have a legal right to cancel their order within a specific timeframe before dispatch. At Bhumivera, this 'Cancel Protocol' is active until the order status changes to 'Processing' in our warehouse."
              },
              { 
                id: "02", 
                title: "Transfer of Risk & Title", 
                content: "The 'Title' (ownership) of the goods remains with Bhumivera until full payment is received. The 'Risk' (responsibility for damage) transfers to the customer upon physical delivery at the specified address. We mitigate this through our Purchase Protection plan."
              },
              { 
                id: "03", 
                title: "Pricing & Clerical Errors", 
                content: "We reserve the right to cancel orders arising from 'Logic Errors' in pricing (e.g., a product listed at $0.00 due to a database glitch). In such cases, the transaction is voided, and the user is refunded immediately."
              },
              { 
                id: "04", 
                title: "Intellectual Property Sovereignty", 
                content: "All content, including 'Bhumivera Science' whitepapers, die-lines, and code-snippets, are the exclusive property of Bhumivera. Returns or purchases do not grant a license for commercial redistribution of our brand assets."
              },
              { 
                id: "05", 
                title: "Limitation of Liability", 
                content: "Bhumivera’s total liability for any claim shall not exceed the purchase price of the product. We are not liable for 'Butterfly Effect' damages (indirect, consequential, or incidental losses) arising from delayed deliveries or skin sensitivities."
              },
              { 
                id: "06", 
                title: "Indemnification Clause", 
                content: "By using our platform, the user agrees to indemnify Bhumivera against any legal claims arising from their misuse of the product or breach of our digital Terms of Service."
              },
              { 
                id: "07", 
                title: "Governing Law & Jurisdiction", 
                content: "All disputes are governed by the laws of India, specifically within the jurisdiction of the courts in West Bengal, reflecting our operational headquarters in Asansol."
              },
              { 
                id: "08", 
                title: "Privacy & Data Processing", 
                content: "Return requests require the processing of Personal Identifiable Information (PII). This data is handled according to our Privacy Protocol and is never sold to third-party marketing entities."
              },
              { 
                id: "09", 
                title: "Force Majeure (Superior Force)", 
                content: "Bhumivera is not responsible for failures caused by events beyond our control—including natural disasters, pandemics, or localized logistics strikes—that disrupt the 'Return Chain'."
              },
              { 
                id: "10", 
                title: "User Account Integrity", 
                content: "We reserve the right to suspend the 'Return Privilege' for accounts displaying patterns of 'Friendly Fraud' or 'Return Bullying' (excessive, unjustified return requests that deviate from normal consumer behavior)."
              }
            ].map((tc) => (
              <div key={tc.id} className="flex gap-6 group">
                <span className="text-emerald-500 font-mono text-xl opacity-50 group-hover:opacity-100 transition-opacity">{tc.id}</span>
                <div>
                  <h4 className="text-lg font-medium mb-3 group-hover:text-emerald-400 transition-colors">{tc.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed italic">{tc.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 04: THE OPERATIONAL FLOW (The Logic Steps) */}
      <section className="py-24 container mx-auto px-6">
        <div className="bg-[#111] p-12 border border-white/5 rounded-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <PackageCheck size={300} />
          </div>
          
          <h2 className="text-4xl font-light mb-16 relative z-10">Operational SOP: The Return Algorithm</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-600 flex items-center justify-center font-bold">1</div>
              <h5 className="font-bold uppercase tracking-widest text-xs">Verification</h5>
              <p className="text-sm text-gray-500">Submit your order ID and photographic evidence of the product state via the Returns Portal.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center font-bold">2</div>
              <h5 className="font-bold uppercase tracking-widest text-xs">Validation</h5>
              <p className="text-sm text-gray-500">Our QA team reviews the 'Digital Claim' within 24 business hours to ensure it aligns with T&C Clause 10.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center font-bold">3</div>
              <h5 className="font-bold uppercase tracking-widest text-xs">Extraction</h5>
              <p className="text-sm text-gray-500">A reverse-logistics courier is dispatched to your location. Ensure the item is sealed in original packaging.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center font-bold">4</div>
              <h5 className="font-bold uppercase tracking-widest text-xs">Refund/Credit</h5>
              <p className="text-sm text-gray-500">Upon warehouse intake, funds are released to your original payment method or Bhumivera Wallet within 3-5 days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: THE FINANCIALS (Refund Logic) */}
      <section className="py-24 container mx-auto px-6 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-light tracking-tight italic">Financial Reconciliation</h2>
            <p className="text-gray-400 leading-relaxed">
              We process refunds through a <strong>"Direct Reverse-Transaction"</strong> model. This means the money travels back through the exact same gateway it entered—be it a bank account, UPI, or credit card. 
            </p>
            <div className="p-6 bg-emerald-500/5 border-l-4 border-emerald-500">
              <h6 className="flex items-center gap-2 text-emerald-400 mb-2 font-bold uppercase text-[10px] tracking-widest">
                <CreditCard size={14} /> Speed of Capital
              </h6>
              <p className="text-sm text-gray-400 italic">
                Wallet Credits: <strong>Instant</strong><br />
                UPI/Bank Transfers: <strong>2-3 Business Days</strong><br />
                Credit Cards: <strong>5-7 Business Days (Bank Dependent)</strong>
              </p>
            </div>
          </div>
          <div className="flex-1">
             <img 
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800" 
              alt="Financial Security" 
              className="rounded-sm opacity-60"
            />
          </div>
        </div>
      </section>

      {/* SECTION 06: NON-RETURNABLE ASSETS (Exclusions) */}
      <section className="py-24 bg-white text-black">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <ShieldAlert className="mx-auto text-red-600" size={48} />
            <h2 className="text-3xl font-bold uppercase tracking-tighter">The "Zero-Return" Exceptions</h2>
            <p className="text-gray-600 leading-relaxed">
              To maintain hygiene and safety standards (SOP-Hygiene-01), the following items are strictly non-returnable unless received in a damaged state:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-4 border border-gray-200 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="text-sm font-medium">Customized Skin-Regimen Kits</span>
              </div>
              <div className="p-4 border border-gray-200 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="text-sm font-medium">Items with broken hygiene seals</span>
              </div>
              <div className="p-4 border border-gray-200 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="text-sm font-medium">Promotional 'Free Gifts'</span>
              </div>
              <div className="p-4 border border-gray-200 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="text-sm font-medium">Flash-Sale/Clearance Items</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07: CLOSING MANIFESTO (Final 200 Words) */}
      <section className="py-32 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div {...fadeInUp}>
            <h2 className="text-5xl font-light italic leading-tight">
              Our promise is simple: If your skin doesn't love it, we won't force it.
            </h2>
            <div className="mt-12 text-gray-500 leading-relaxed space-y-6">
              <p>
                Bhumivera was founded on the belief that nature provides the answers, but science provides the delivery. If our delivery fails to meet your expectations, the returns process is our final product to you. We analyze return data not as losses, but as scientific inputs to improve our future batches. 
              </p>
              <p>
                Thank you for trusting the Bhumivera Science journey. We are committed to ensuring your transition back to us is as graceful and natural as the products we create. Your feedback is the catalyst for our next innovation.
              </p>
            </div>
          </motion.div>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 pt-12">
            <button className="px-12 py-5 bg-emerald-600 text-black font-bold uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all">
              Initiate Return Claim
            </button>
            <button className="px-12 py-5 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
              Speak to a Skin Specialist
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER METRICS */}
      <footer className="py-12 bg-black border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-wrap justify-between gap-8 grayscale opacity-30 text-[10px] font-mono tracking-widest">
          <span>98.2% RESOLUTION RATE</span>
          <span>SOP-LOGISTICS-04 COMPLIANT</span>
          <span>GLOBAL CONSUMER RIGHTS ADHERENCE</span>
          <span>© 2026 BHUMIVERA ECO-LABS</span>
        </div>
      </footer>

    </div>
  );
};

export default ReturnsCentre;
