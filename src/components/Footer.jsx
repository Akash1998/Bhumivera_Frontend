import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.webp";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#110c0a]/95 backdrop-blur-2xl border-t border-[#6b4226]/20 text-[#f6f0e4] font-sans antialiased mt-auto overflow-hidden">
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8b5a2b]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>

      <button 
        onClick={scrollToTop}
        className="relative z-10 w-full py-5 bg-[#1e1510]/50 hover:bg-[#6b4226]/30 backdrop-blur-md border-b border-[#6b4226]/20 text-[10px] tracking-[0.2em] uppercase text-[#d4af37] font-bold transition-all active:bg-[#6b4226]/50"
      >
        Return to the Surface
      </button>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-[0.15em] mb-6 text-[#d4af37]">Get to Know Us</h3>
          <ul className="space-y-4 text-sm text-[#a89f91] font-light">
            <li><Link to="/about" className="hover:text-[#f6f0e4] transition-colors duration-300">About Bhumivera</Link></li>
            <li><Link to="/about#careers" className="hover:text-[#f6f0e4] transition-colors duration-300">Careers</Link></li>
            <li><Link to="/about#press" className="hover:text-[#f6f0e4] transition-colors duration-300">Press Releases</Link></li>
            <li><Link to="/science" className="hover:text-[#f6f0e4] transition-colors duration-300 font-medium text-[#c4b5a2]">Bhumivera Science</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xs uppercase tracking-[0.15em] mb-6 text-[#d4af37]">Connect with Us</h3>
          <ul className="space-y-4 text-sm text-[#a89f91] font-light">
            <li><a href="https://www.instagram.com/the_rsenterprises" target="_blank" rel="noreferrer" className="hover:text-[#f6f0e4] transition-colors duration-300">Instagram</a></li>
            <li><a href="https://facebook.com/Bhumivera" target="_blank" rel="noreferrer" className="hover:text-[#f6f0e4] transition-colors duration-300">Facebook</a></li>
            <li><a href="https://twitter.com/Bhumivera" target="_blank" rel="noreferrer" className="hover:text-[#f6f0e4] transition-colors duration-300">X (Twitter)</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xs uppercase tracking-[0.15em] mb-6 text-[#d4af37]">Make Money</h3>
          <ul className="space-y-4 text-sm text-[#a89f91] font-light">
            <li><Link to="/contact?topic=sell" className="hover:text-[#f6f0e4] transition-colors duration-300">Sell on Bhumivera</Link></li>
            <li><Link to="/affiliate" className="hover:text-[#f6f0e4] transition-colors duration-300">Become an Affiliate</Link></li>
            <li><Link to="/contact" className="hover:text-[#f6f0e4] transition-colors duration-300">Advertise Products</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xs uppercase tracking-[0.15em] mb-6 text-[#d4af37]">Let Us Help You</h3>
          <ul className="space-y-4 text-sm text-[#a89f91] font-light">
            <li><Link to="/fitment-engine" className="hover:text-[#f6f0e4] transition-colors duration-300">Skin Tone Engine</Link></li>
            <li><Link to="/returns-centre" className="hover:text-[#f6f0e4] transition-colors duration-300">Returns Centre</Link></li>
            <li><Link to="/purchase-protection" className="hover:text-[#f6f0e4] transition-colors duration-300">Purchase Protection</Link></li>
            <li><Link to="/contact" className="hover:text-[#f6f0e4] transition-colors duration-300">Help & Support</Link></li>
          </ul>
        </div>
      </div>

      <div className="relative z-10 border-t border-[#6b4226]/20 py-12 flex flex-col items-center gap-8">
        <Link to="/" className="group" onClick={scrollToTop} aria-label="Bhumivera Home">
          <div className="p-3 bg-[#1e1510]/50 border border-[#6b4226]/30 rounded-2xl shadow-2xl backdrop-blur-xl group-hover:bg-[#6b4226]/20 group-hover:border-[#d4af37]/40 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-700 ease-out transform group-active:scale-95">
             <img src={logo} alt="Bhumivera Logo" className="h-10 md:h-12 w-auto object-contain rounded-xl opacity-90 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
        <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold tracking-[0.15em] uppercase text-[#a89f91] px-4">
           <button className="border border-[#6b4226]/30 bg-[#1e1510]/50 px-6 py-3 rounded-xl cursor-pointer hover:bg-[#6b4226]/40 hover:text-[#f6f0e4] hover:border-[#d4af37]/30 transition-all active:scale-95">English</button>
           <button className="border border-[#6b4226]/30 bg-[#1e1510]/50 px-6 py-3 rounded-xl cursor-pointer hover:bg-[#6b4226]/40 hover:text-[#f6f0e4] hover:border-[#d4af37]/30 transition-all active:scale-95">🇮🇳 India</button>
        </div>
      </div>

      <div className="relative z-10 bg-[#0a0705] py-10 px-4 text-center border-t border-[#6b4226]/10">
        <div className="flex flex-wrap justify-center gap-6 text-[11px] font-light tracking-wide mb-6 text-[#8a7f72]">
           <Link to="/legal" className="hover:text-[#d4af37] transition-colors">Conditions of Use</Link>
           <span className="hidden sm:inline opacity-20">|</span>
           <Link to="/legal" className="hover:text-[#d4af37] transition-colors">Privacy Notice</Link>
           <span className="hidden sm:inline opacity-20">|</span>
           <Link to="/legal" className="hover:text-[#d4af37] transition-colors">Interest-Based Ads</Link>
        </div>
        <p className="text-[9px] text-[#5c4a3d] font-bold tracking-[0.2em] uppercase">
          © {currentYear} Bhumivera. Earth to Skin. <br className="sm:hidden" /> ALL RIGHTS RESERVED.
        </p>
      </div>
      
    </footer>
  );
}
