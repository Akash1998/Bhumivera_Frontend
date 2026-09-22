import React, { useEffect } from 'react';
import { RefreshCcw, ShieldCheck, Package, HeadphonesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Returns() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0B2419] via-[#2C3E2D] to-[#1a3024] text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_20%,#D4AF37_0,transparent_50%),radial-gradient(circle_at_70%_80%,#8B9D83_0,transparent_50%)]" />
        <div className="relative">
          <RefreshCcw className="w-16 h-16 mx-auto mb-6 text-[#D4AF37]" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Returns &amp; Replacements</h1>
          <p className="text-lg text-[#FDFBF7]/80 max-w-2xl mx-auto leading-relaxed">
            We stand by the quality of our premium Bhumivera products. If your purchase doesn't meet your expectations, we are here to make it right — backed by our 10-year E-Warranty promise.
          </p>
        </div>
      </div>

      {/* Return Process */}
      <div className="max-w-7xl mx-auto px-4 mt-16 sm:mt-20">
        <h2 className="text-3xl font-bold text-center text-[#0B2419] mb-12 tracking-tight">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            { step: "01", icon: ShieldCheck, title: "Verify Warranty", desc: "Ensure your product serial number is registered in our E-Warranty Nexus." },
            { step: "02", icon: HeadphonesIcon, title: "Contact Support", desc: "Reach out to our expert team to troubleshoot or authorize a return." },
            { step: "03", icon: Package, title: "Pack & Ship", desc: "Securely pack the item in its original packaging and ship it to our facility." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-[#8B9D83]/20 text-center relative z-10 hover:shadow-md hover:border-[#D4AF37]/40 transition-all">
              <div className="text-6xl font-black text-[#D4AF37]/10 absolute top-4 right-4 z-0">{item.step}</div>
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[#FDFBF7] border border-[#8B9D83]/20 flex items-center justify-center relative z-10">
                <item.icon className="w-7 h-7 text-[#0B2419]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B2419] mb-2 relative z-10">{item.title}</h3>
              <p className="text-[#8B9D83] text-sm relative z-10 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Area */}
      <div className="max-w-4xl mx-auto px-4 mt-20 text-center bg-white p-10 sm:p-12 rounded-3xl border border-[#8B9D83]/20 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0B2419] mb-4">Ready to start a return?</h2>
        <p className="text-[#8B9D83] mb-8 max-w-xl mx-auto leading-relaxed">
          Our specialized support team is ready to assist you with product diagnostics and the RMA (Return Merchandise Authorization) process.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/EWarranty" className="px-8 py-4 bg-[#0B2419] hover:bg-[#2C3E2D] text-[#FDFBF7] font-bold rounded-xl transition-colors shadow-sm inline-flex items-center justify-center">
            Check E-Warranty
          </Link>
          <Link to="/contact" className="px-8 py-4 bg-[#D4AF37] hover:bg-[#c09d2e] text-[#0B2419] font-bold rounded-xl transition-colors shadow-sm inline-flex items-center justify-center">
            Contact Support Team
          </Link>
        </div>
      </div>
    </div>
  );
}
