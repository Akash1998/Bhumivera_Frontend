import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#111c17] font-sans text-[#f1efe7] antialiased">
      <div className="border-b border-white/10 bg-[#17251e]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-10">
          <div className="max-w-2xl">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#c8d6aa]">Curiosity, carried further</p>
            <h2 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">Get to know the details behind your ritual.</h2>
            <p className="mt-2 text-xs leading-5 text-white/55 sm:text-sm">Explore botanical notes, check product information, or ask our team a question.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/science#ingredients" className="inline-flex min-h-11 items-center gap-2 bg-[#dce7c5] px-4 py-2 text-xs font-semibold text-[#19271e] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dce7c5]">
              Botanical notes <span aria-hidden="true">↗</span>
            </Link>
            <Link to="/contact" className="inline-flex min-h-11 items-center gap-2 border border-white/25 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Contact us
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-5 gap-y-9 px-5 py-10 sm:gap-x-8 sm:gap-y-12 sm:px-8 sm:py-14 md:grid-cols-4 md:px-10">
        <div>
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">Bhumivera</h3>
          <ul className="space-y-3 text-xs leading-5 text-white/60 sm:text-sm">
            <li><Link to="/about" className="transition-colors hover:text-white">Our story</Link></li>
            <li><Link to="/impact" className="transition-colors hover:text-white">Our impact</Link></li>
            <li><Link to="/science" className="transition-colors hover:text-white">Product science</Link></li>
            <li><Link to="/shop" className="transition-colors hover:text-white">Shop the collection</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">Connect</h3>
          <ul className="space-y-3 text-xs leading-5 text-white/60 sm:text-sm">
            <li><a href="https://www.instagram.com/the_rsenterprises" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">Instagram</a></li>
            <li><a href="https://facebook.com/Bhumivera" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">Facebook</a></li>
            <li><a href="https://twitter.com/Bhumivera" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">X (Twitter)</a></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">Work with us</h3>
          <ul className="space-y-3 text-xs leading-5 text-white/60 sm:text-sm">
            <li><Link to="/contact?topic=sell" className="transition-colors hover:text-white">Sell on Bhumivera</Link></li>
            <li><Link to="/affiliate" className="transition-colors hover:text-white">Become an affiliate</Link></li>
            <li><Link to="/contact" className="transition-colors hover:text-white">Partnership enquiries</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">Customer care</h3>
          <ul className="space-y-3 text-xs leading-5 text-white/60 sm:text-sm">
            <li><Link to="/returns-centre" className="transition-colors hover:text-white">Returns Centre</Link></li>
            <li><Link to="/order-tracking" className="transition-colors hover:text-white">Track an order</Link></li>
            <li><a href="mailto:support@bhumivera.com" className="break-words transition-colors hover:text-white">support@bhumivera.com</a></li>
            <li><a href="tel:+917430985647" className="transition-colors hover:text-white">+91 74309 85647</a></li>
            <li><Link to="/contact" className="transition-colors hover:text-white">Help & support</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#0c1410]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 py-7 sm:flex-row sm:justify-between sm:px-8 md:px-10">
          <Link to="/" aria-label="Bhumivera home" className="flex items-center gap-3">
            <img src="/logo.webp" alt="" className="h-9 w-auto object-contain" />
            <span className="font-serif text-sm tracking-[0.16em] text-white/75">BHUMIVERA</span>
          </Link>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-white/45 sm:text-xs">
            <Link to="/legal" className="transition-colors hover:text-[#c8d6aa]">Conditions of Use</Link>
            <Link to="/legal" className="transition-colors hover:text-[#c8d6aa]">Privacy Notice</Link>
            <Link to="/legal" className="transition-colors hover:text-[#c8d6aa]">Interest-Based Ads</Link>
          </div>
          <p className="text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35 sm:text-right">
            © {currentYear} Bhumivera · Care, returned to its source
          </p>
        </div>
      </div>
    </footer>
  );
}
