import { motion } from 'framer-motion';
import { ArrowRight, Mail, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

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
              For help with an order, contact our support team with your order details. We will guide you through the options that apply.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 02: GETTING HELP */}
      <section className="py-24 bg-white text-black">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-3xl font-light mb-6 border-l-4 border-emerald-600 pl-4">Start with your order details</h2>
                <p>
                  If you have a question about an order, contact our support team and include the order number and a short description of the issue. This helps the team locate your purchase and explain the next steps.
                </p>
                <p>
                  Eligibility, available resolutions and any applicable timeframes depend on the order and the terms provided for it. Please review those terms or ask support to confirm what applies before sending an item back.
                </p>
              </div>
              <div className="relative pt-8">
                <img 
                  src="https://images.unsplash.com/photo-1566933266119-7a4bdbc4e641?auto=format&fit=crop&q=80&w=800" 
                  alt="Quality Assurance" 
                  className="rounded-sm shadow-2xl grayscale"
                />
                <div className="absolute top-0 right-0 p-4 bg-emerald-600 text-white font-mono text-[10px] tracking-widest uppercase">
                  Customer support
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-light italic">What to include in your message</h3>
              <p>
                Share the order number, the name used at checkout and a clear description of how we can help. For a damaged or incorrect delivery, include photographs if available.
              </p>
              <p>
                Please wait for instructions from the support team before returning or shipping an item. The correct steps can vary by order and issue.
              </p>
              <blockquote className="text-3xl font-light text-emerald-700 italic border-l-0 text-center py-12">
                "Clear information starts with the details of your order."
              </blockquote>
              <p>
                Support can confirm the available resolution and any applicable refund process. We do not publish a universal outcome or processing time here.
              </p>
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
              Order-specific terms and support guidance take precedence over general examples.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {[
              { 
                id: "01", 
                title: "Order number",
                content: "Include the order number so the support team can identify the purchase you are asking about."
              },
              { 
                id: "02", 
                title: "What happened",
                content: "Describe the issue or question clearly. Add photographs when they help explain a damaged or incorrect delivery."
              },
              { 
                id: "03", 
                title: "Applicable terms",
                content: "Eligibility and available options depend on the terms that apply to your order. Contact support to confirm the details."
              },
              { 
                id: "04", 
                title: "Wait for guidance",
                content: "Please contact support before sending an item back so the team can provide the appropriate instructions."
              },
              { 
                id: "05", 
                title: "Resolution options",
                content: "Support will explain the options available for your specific order and circumstances."
              },
              { 
                id: "06", 
                title: "Refund information",
                content: "If a refund applies, support will confirm the process and any relevant timing for your order."
              },
              { 
                id: "07", 
                title: "Product details",
                content: "For product-specific ingredient information, refer to the product page and packaging."
              },
              { 
                id: "08", 
                title: "Personal information",
                content: "Share only the information needed to identify your order and respond to your request."
              },
              { 
                id: "09", 
                title: "Need clarification?",
                content: "Contact support if you are unsure which terms or steps apply to your order."
              },
              { 
                id: "10", 
                title: "Keep your order records",
                content: "Retain your order confirmation and any messages from support while your request is being handled."
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

      {/* SECTION 04: CONTACT STEPS */}
      <section className="py-24 container mx-auto px-6">
        <div className="bg-[#111] p-12 border border-white/5 rounded-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <RotateCcw size={300} />
          </div>
          
          <h2 className="text-4xl font-light mb-16 relative z-10">How to contact support</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-600 flex items-center justify-center font-bold">1</div>
              <h5 className="font-bold uppercase tracking-widest text-xs">Find your order</h5>
              <p className="text-sm text-gray-500">Have your order number ready so the team can find the correct purchase.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center font-bold">2</div>
              <h5 className="font-bold uppercase tracking-widest text-xs">Explain the issue</h5>
              <p className="text-sm text-gray-500">Tell us what happened and include relevant details or photographs if available.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center font-bold">3</div>
              <h5 className="font-bold uppercase tracking-widest text-xs">Wait for instructions</h5>
              <p className="text-sm text-gray-500">The team will advise you on the next steps for your order. Do not ship an item before receiving guidance.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center font-bold">4</div>
              <h5 className="font-bold uppercase tracking-widest text-xs">Review the options</h5>
              <p className="text-sm text-gray-500">Support will confirm the applicable terms and available resolution for your request.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: REFUND INFORMATION */}
      <section className="py-24 container mx-auto px-6 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-light tracking-tight italic">Refund information</h2>
            <p className="text-gray-400 leading-relaxed">
              Refund eligibility, method and timing depend on the order and payment provider. Contact support for the details that apply to your case.
            </p>
            <div className="p-6 bg-emerald-500/5 border-l-4 border-emerald-500">
              <h6 className="flex items-center gap-2 text-emerald-400 mb-2 font-bold uppercase text-[10px] tracking-widest">
                <Mail size={14} /> Ask our team
              </h6>
              <p className="text-sm text-gray-400 italic">
                Include your order number and the email address used at checkout. Support can confirm next steps.
              </p>
            </div>
          </div>
          <div className="flex-1">
             <img 
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800" 
              alt="Order information on a desk"
              className="rounded-sm opacity-60"
            />
          </div>
        </div>
      </section>

      {/* SECTION 06: CHECK THE TERMS FOR YOUR ORDER */}
      <section className="py-24 bg-white text-black">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <RotateCcw className="mx-auto text-emerald-700" size={48} />
            <h2 className="text-3xl font-bold uppercase tracking-tighter">Check before sending an item</h2>
            <p className="text-gray-600 leading-relaxed">
              Return or refund eligibility can vary. Review the terms for your order and contact support for confirmation before sending anything back.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-4 border border-gray-200 flex items-center gap-3">
                <Mail size={16} className="text-emerald-600" />
                <span className="text-sm font-medium">Have your order number ready</span>
              </div>
              <div className="p-4 border border-gray-200 flex items-center gap-3">
                <Mail size={16} className="text-emerald-600" />
                <span className="text-sm font-medium">Describe the issue clearly</span>
              </div>
              <div className="p-4 border border-gray-200 flex items-center gap-3">
                <Mail size={16} className="text-emerald-600" />
                <span className="text-sm font-medium">Include photographs if helpful</span>
              </div>
              <div className="p-4 border border-gray-200 flex items-center gap-3">
                <Mail size={16} className="text-emerald-600" />
                <span className="text-sm font-medium">Wait for support instructions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07: CONTACT */}
      <section className="py-32 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div {...fadeInUp}>
            <h2 className="text-5xl font-light italic leading-tight">
              Need help with an order?
            </h2>
            <div className="mt-12 text-gray-500 leading-relaxed space-y-6">
              <p>
                Contact our support team with your order details. We can help clarify the terms and next steps for your request.
              </p>
              <p>
                Please refer to the terms associated with your order for the applicable information.
              </p>
            </div>
          </motion.div>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 pt-12">
            <Link to="/contact" className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-emerald-600 text-black font-bold uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all">
              Contact support <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ReturnsCentre;
