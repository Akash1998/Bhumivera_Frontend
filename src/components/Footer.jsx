import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#111c17] font-sans text-[#f1efe7] antialiased">

      <button 
        onClick={scrollToTop}
        className="relative z-10 w-full border-b border-white/10 bg-[#15231c] py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8d6aa] transition-colors hover:bg-[#1c3026] active:bg-[#20382b]"
      >
        Return to the Surface
      </button>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
        <div>
          <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#c8d6aa]">Bhumivera</h3>
          <ul className="space-y-4 text-sm font-light text-white/60">
            <li><Link to="/about" className="hover:text-[#f6f0e4] transition-colors duration-300">About Bhumivera</Link></li>
            <li><Link to="/impact" className="font-medium text-[#dce7c5] hover:text-white transition-colors duration-300">Our impact</Link></li>
            <li><Link to="/science" className="hover:text-white transition-colors duration-300">Product science</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#c8d6aa]">Connect</h3>
          <ul className="space-y-4 text-sm font-light text-white/60">
            <li><a href="https://www.instagram.com/the_rsenterprises" target="_blank" rel="noreferrer" className="hover:text-[#f6f0e4] transition-colors duration-300">Instagram</a></li>
            <li><a href="https://facebook.com/Bhumivera" target="_blank" rel="noreferrer" className="hover:text-[#f6f0e4] transition-colors duration-300">Facebook</a></li>
            <li><a href="https://twitter.com/Bhumivera" target="_blank" rel="noreferrer" className="hover:text-[#f6f0e4] transition-colors duration-300">X (Twitter)</a></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#c8d6aa]">Partner with us</h3>
          <ul className="space-y-4 text-sm font-light text-white/60">
            <li><Link to="/contact?topic=sell" className="hover:text-[#f6f0e4] transition-colors duration-300">Sell on Bhumivera</Link></li>
            <li><Link to="/affiliate" className="hover:text-[#f6f0e4] transition-colors duration-300">Become an Affiliate</Link></li>
            <li><Link to="/contact" className="hover:text-[#f6f0e4] transition-colors duration-300">Advertise Products</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#c8d6aa]">Customer care</h3>
          <ul className="space-y-4 text-sm font-light text-white/60">
            <li><Link to="/science" className="hover:text-[#f6f0e4] transition-colors duration-300">Botanical Science</Link></li>
            <li><Link to="/returns-centre" className="hover:text-[#f6f0e4] transition-colors duration-300">Returns Centre</Link></li>
            <li><a href="mailto:support@bhumivera.com" className="hover:text-[#f6f0e4] transition-colors duration-300">support@bhumivera.com</a></li>
            <li><a href="tel:+917430985647" className="hover:text-[#f6f0e4] transition-colors duration-300">+91 74309 85647</a></li>
            <li><a href="tel:+918370804458" className="hover:text-[#f6f0e4] transition-colors duration-300">+91 83708 04458</a></li>
            <li><Link to="/contact" className="hover:text-[#f6f0e4] transition-colors duration-300">Help & Support</Link></li>
          </ul>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 border-t border-white/10 py-12">
        <Link to="/" className="group" onClick={scrollToTop} aria-label="Bhumivera Home">
          <div className="border border-white/10 bg-[#15231c] p-3 transition-colors duration-500 group-hover:border-[#c8d6aa]/50 group-hover:bg-[#1c3026]">
             {/* FIXED: Replaced imported variable with direct static public path */}
             <img src="/logo.webp" alt="Bhumivera Logo" className="h-10 md:h-12 w-auto object-contain rounded-xl opacity-90 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
        <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold tracking-[0.15em] uppercase text-[#a89f91] px-4">
           <span className="border border-white/10 px-4 py-2 text-xs text-white/60">English</span>
           <span className="border border-white/10 px-4 py-2 text-xs text-white/60">India · INR</span>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-[#0c1410] px-4 py-10 text-center">
        <div className="mb-6 flex flex-wrap justify-center gap-6 text-[11px] font-light tracking-wide text-white/45">
           <Link to="/legal" className="hover:text-[#c8d6aa] transition-colors">Conditions of Use</Link>
           <span className="hidden sm:inline opacity-20">|</span>
           <Link to="/legal" className="hover:text-[#c8d6aa] transition-colors">Privacy Notice</Link>
           <span className="hidden sm:inline opacity-20">|</span>
           <Link to="/legal" className="hover:text-[#c8d6aa] transition-colors">Interest-Based Ads</Link>
        </div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
          © {currentYear} Bhumivera. Care, returned to its source.
        </p>
      </div>
      
    </footer>
  );
}
