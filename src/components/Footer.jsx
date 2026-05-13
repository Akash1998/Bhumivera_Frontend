import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.webp";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <footer className="relative bg-[#0a0a0c]/90 backdrop-blur-2xl border-t border-white/10 text-white font-sans mt-auto overflow-hidden">
      <button onClick={scrollToTop} className="relative z-10 w-full py-4 bg-white/5 hover:bg-white/10 text-xs tracking-widest uppercase text-cyan-400 font-bold transition-all">Back to top</button>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 text-slate-300">
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">Get to Know Us</h3>
          <ul className="space-y-3 text-xs md:text-sm">
            <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About Bhumivera</Link></li>
            <li><Link to="/science" className="hover:text-cyan-400 transition-colors font-semibold">Bhumivera Science</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">Connect with Us</h3>
          <ul className="space-y-3 text-xs md:text-sm">
            <li><a href="https://www.instagram.com/the_rsenterprises" target="_blank" rel="noreferrer" className="hover:text-cyan-400">Instagram</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">Make Money</h3>
          <ul className="space-y-3 text-xs md:text-sm">
            <li><Link to="/admin-login" className="hover:text-cyan-400">Sell on Bhumivera</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">Let Us Help You</h3>
          <ul className="space-y-3 text-xs md:text-sm">
            <li><Link to="/warranty" className="hover:text-cyan-400">E-Warranty</Link></li>
            <li><Link to="/contact" className="hover:text-cyan-400">Help & Support</Link></li>
          </ul>
        </div>
      </div>
      <div className="relative z-10 bg-[#050505]/80 py-8 px-4 text-center border-t border-white/5">
        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium mb-4 text-slate-300">
           <Link to="/legal" className="hover:text-cyan-400">Conditions of Use</Link>
           <span>|</span>
           <Link to="/legal" className="hover:text-cyan-400">Privacy Notice</Link>
           <span>|</span>
           <Link to="/legal" className="hover:text-cyan-400">Interest-Based Ads</Link>
        </div>
        <p className="text-[10px] text-slate-300 font-mono tracking-tight">© {currentYear} Bhumivera. ALL RIGHTS RESERVED. <br /> DEVELOPED BY AKASH PRASAD</p>
      </div>
    </footer>
  );
}
