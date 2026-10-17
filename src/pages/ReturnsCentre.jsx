import { motion } from 'framer-motion';
import { ArrowRight, Mail, RotateCcw, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import BhumiveraVideo from '../components/BhumiveraVideo';

const ReturnsCentre = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* SECTION 01: HERO (The Returns Philosophy with Video) */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-35">
          <BhumiveraVideo
            src="/assets/videos/unboxing-protection.mp4"
            poster="/assets/images/Promo1.webp"
            alt="Damaged items and courtesy resolution video"
            className="w-full h-full object-cover"
            containerClassName="relative w-full h-full overflow-hidden"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/70 to-[#050505]" />
        </div>
        <div className="container mx-auto px-6 text-center z-10">
          <motion.div {...fadeInUp}>
            <RotateCcw className="mx-auto text-emerald-500 mb-6" size={48} strokeWidth={1.5} />
            <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-6 italic">
              Damaged Items &amp; Courtesy Resolution
            </h1>
            <p className="max-w-3xl mx-auto text-gray-300 text-base md:text-lg leading-relaxed mb-8">
              Because personal care cosmetics (face washes, shampoos &amp; elixirs) cannot be physically restocked for hygiene safety, we offer an instant replacement or courtesy store credit if your bottle arrives damaged or leaking in transit—verified via our 360° uncut unboxing video protocol.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 02: GETTING HELP (WITH VIDEO PLAYER INSTEAD OF STATIC IMAGE) */}
      <section className="py-24 bg-white text-black">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-3xl font-light mb-6 border-l-4 border-emerald-600 pl-4">Start with your order details &amp; unboxing video</h2>
                <p>
                  If you have a question about an order, contact our support team within 48 hours of delivery and include the order number, a short description of the issue, and your continuous 360° uncut unboxing video.
                </p>
                <p>
                  Eligibility, available resolutions and applicable timeframes are governed by our <Link to="/legal?section=orders" className="text-emerald-700 font-semibold underline">Orders, Hygiene &amp; Courtesy Credit Terms</Link>. Please review those terms or ask support to confirm what applies before taking any action.
                </p>
              </div>
              <div className="relative pt-4">
                <div className="aspect-[16/10] overflow-hidden rounded-sm shadow-2xl bg-[#101c16]">
                  <BhumiveraVideo
                    src="/assets/videos/unboxing-protection.mp4"
                    poster="/assets/images/Promo1.webp"
                    alt="Bhumivera Quality Assurance & Unboxing Protocol Video"
                    className="h-full w-full object-cover"
                    containerClassName="relative h-full w-full overflow-hidden"
                    badge="Quality Assurance · Live Video"
                    showControls
                  />
                </div>
                <div className="absolute top-0 right-0 p-3 bg-emerald-600 text-white font-mono text-[10px] tracking-widest uppercase">
                  Customer support
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-light italic">What to include in your message</h3>
              <p>
                Share the order number, the name used at checkout, and a clear description of how we can help. For a damaged, leaking, or incorrect delivery, attach your continuous 360° unboxing video showing the sealed outer box, AWB label, and inner product seal alongside clear photographs.
              </p>
              <p>
                Because delivered personal-care cosmetics are non-returnable for hygiene reasons, do not ship opened bottles back without written authorization from our support team.
              </p>
              <blockquote className="text-3xl font-light text-emerald-700 italic border-l-0 text-center py-12">
                &ldquo;Clear verification starts with the details and unboxing record of your order.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: ORDER SUPPORT */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <RotateCcw className="text-emerald-500 mb-4" size={40} />
            <h2 className="text-4xl font-light tracking-tight">A clearer way to get help</h2>
            <p className="text-gray-500 mt-4 max-w-2xl text-center italic">
              Order-specific terms, warehouse dispatch records, and statutory consumer rights govern every resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {[
              { id: "01", title: "Order number", content: "Include the 9-digit order reference so the support team can locate your purchase and warehouse CCTV dispatch log." },
              { id: "02", title: "360° Unboxing Video", content: "Attach an unedited, continuous 360° unboxing video recorded before breaking the outer tamper seal, showing the AWB label and bottle." },
              { id: "03", title: "48-Hour Reporting Window", content: "Transit damage, leakage, or wrong-item claims must be submitted within 48 hours of the courier delivery timestamp." },
              { id: "04", title: "Hygiene Non-Return Rule", content: "Under cosmetics hygiene regulations, delivered skincare and haircare bottles cannot be physically returned or restocked." },
              { id: "05", title: "Courtesy Resolution Options", content: "Verified transit-damage claims receive either an immediate free replacement dispatch or 100% spendable Bhumivera Wallet credit." },
              { id: "06", title: "Prepaid Cancellation Refunds", content: "If an unshipped prepaid order is cancelled by SuperAdmin or fails fulfilment, refunds are processed atomically to source or Wallet." },
              { id: "07", title: "Product & Label Details", content: "For product-specific ingredient information and patch-test instructions, refer to the product page, packaging, and Legal Terms." },
              { id: "08", title: "Account Security", content: "Share only the information needed to identify your order. Never share passwords or OTP codes with anyone." },
              { id: "09", title: "Anti-Fraud Protection", content: "Fabricated claims, edited videos, or illegitimate payment chargebacks are cross-checked against warehouse weight & CCTV logs." },
              { id: "10", title: "Keep Your Order Records", content: "Retain your outer packaging, batch/serial label, tax invoice, and support ticket confirmation until your request is resolved." }
            ].map((tc) => (
              <div key={tc.id} className="flex gap-6 group">
                <span className="text-emerald-500 font-mono text-xl opacity-50 group-hover:opacity-100 transition-opacity">{tc.id}</span>
                <div>
                  <h4 className="text-lg font-medium mb-3 group-hover:text-emerald-400 transition-colors">{tc.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{tc.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 05: REFUND & LEDGER INFORMATION (WITH VIDEO PLAYER) */}
      <section className="py-24 container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-light tracking-tight italic">Refund &amp; Ledger Information</h2>
            <p className="text-gray-400 leading-relaxed">
              Refund and courtesy credit eligibility, method, and timing are governed by our atomic ledger and payment-provider rules. Spendable Wallet credits and restricted promotional/referral rewards are tracked in separate cryptographic ledgers.
            </p>
            <div className="p-6 bg-emerald-500/5 border-l-4 border-emerald-500">
              <h6 className="flex items-center gap-2 text-emerald-400 mb-2 font-bold uppercase text-[10px] tracking-widest">
                <Mail size={14} /> Ask our team
              </h6>
              <p className="text-sm text-gray-400 italic">
                Include your order number and the email address used at checkout. Support can confirm next steps within 24 hours.
              </p>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="aspect-[16/9] overflow-hidden rounded-sm border border-white/10">
              <BhumiveraVideo
                src="/assets/videos/aloe-science-lab.mp4"
                poster="/assets/images/aloeverascience.webp"
                alt="Bhumivera laboratory and quality verification video"
                className="h-full w-full object-cover"
                containerClassName="relative h-full w-full overflow-hidden"
                badge="Bhumivera Verification Ledger · HD"
                showControls
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07: CONTACT */}
      <section className="py-24 container mx-auto px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-light italic leading-tight">
              Need help with an order?
            </h2>
            <p className="mt-6 text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Contact our support team with your order details or review our comprehensive Conditions of Use &amp; Sale.
            </p>
          </motion.div>
          
          <div className="flex flex-col md:flex-row justify-center gap-5 pt-4">
            <Link to="/returns" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#e0bc46] transition-all rounded-xl shadow-lg">
              Damaged Item Courtesy Guarantee <ArrowRight size={14} />
            </Link>
            <Link to="/legal?section=orders" className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/25 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all rounded-xl">
              <ShieldCheck size={15} /> Read Legal Terms
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-black font-bold uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all rounded-xl">
              Contact support <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ReturnsCentre;
