import React from 'react';
import { Link } from 'react-router-dom';
import { triggerAiCopilotAssist } from '../utils/aiCopilotBus';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#111c17] font-sans text-[#f1efe7] antialiased">
      <div className="border-b border-white/10 bg-[#17251e]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-10">
          <div className="max-w-2xl">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#c8d6aa]">
              Curiosity, carried further · 100X AI Co-Pilot Ready
            </p>
            <h2 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">
              Get to know the details behind your ritual.
            </h2>
            <p className="mt-2 text-xs leading-5 text-white/55 sm:text-sm">
              Explore botanical notes, verify product authenticity, reset your password with AI assistance, or ask our
              concierge team a question.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                triggerAiCopilotAssist({
                  mode: 'navigation_rescue',
                  title: '100X AI Co-Pilot & Complete Site Guide',
                  message:
                    'How can I assist you today? I can help you add items to your cart, set or reset your password, track an order, or jump to any page on Bhumivera.',
                })
              }
              className="inline-flex min-h-11 items-center gap-2 bg-[#d4af37] px-4 py-2 text-xs font-bold text-[#071a12] transition-colors hover:bg-[#e5c247]"
            >
              ✦ Ask 100X AI Co-Pilot
            </button>
            <Link
              to="/science#ingredients"
              className="inline-flex min-h-11 items-center gap-2 bg-[#dce7c5] px-4 py-2 text-xs font-semibold text-[#19271e] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dce7c5]"
            >
              Botanical notes <span aria-hidden="true">↗</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center gap-2 border border-white/25 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-5 gap-y-9 px-5 py-10 sm:gap-x-8 sm:gap-y-12 sm:px-8 sm:py-14 md:grid-cols-5 md:px-10">
        <div>
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">
            Bhumivera Store
          </h3>
          <ul className="space-y-3 text-xs leading-5 text-white/60 sm:text-sm">
            <li>
              <Link to="/" className="transition-colors hover:text-white">
                Storefront Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="transition-colors hover:text-white">
                Shop the collection
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-white">
                Our story
              </Link>
            </li>
            <li>
              <Link to="/impact" className="transition-colors hover:text-white">
                Our impact
              </Link>
            </li>
            <li>
              <Link to="/science" className="transition-colors hover:text-white">
                Product science
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="transition-colors hover:text-white">
                Saved Wishlist
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">
            Account &amp; Security
          </h3>
          <ul className="space-y-3 text-xs leading-5 text-white/60 sm:text-sm">
            <li>
              <Link to="/login" className="transition-colors hover:text-white">
                Customer Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="transition-colors hover:text-white">
                Create Account
              </Link>
            </li>
            <li>
              <Link to="/forgot-password" className="transition-colors hover:text-white">
                Forgot / Reset Password (AI Assist)
              </Link>
            </li>
            <li>
              <Link to="/profile" className="transition-colors hover:text-white">
                My Profile, Wallet &amp; Orders
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="transition-colors hover:text-white">
                Secure Checkout
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">
            Authenticity &amp; Partners
          </h3>
          <ul className="space-y-3 text-xs leading-5 text-white/60 sm:text-sm">
            <li>
              <Link to="/verify-product" className="transition-colors hover:text-white">
                Verify Product Authenticity
              </Link>
            </li>
            <li>
              <Link to="/ewarranty" className="transition-colors hover:text-white">
                E-Warranty Registration
              </Link>
            </li>
            <li>
              <Link to="/affiliate" className="transition-colors hover:text-white">
                Become an affiliate
              </Link>
            </li>
            <li>
              <Link to="/contact?topic=sell" className="transition-colors hover:text-white">
                Sell on Bhumivera
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-white">
                Partnership enquiries
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">
            Customer care
          </h3>
          <ul className="space-y-3 text-xs leading-5 text-white/60 sm:text-sm">
            <li>
              <Link to="/order-tracking" className="transition-colors hover:text-white">
                Track an order
              </Link>
            </li>
            <li>
              <Link to="/returns-centre" className="transition-colors hover:text-white">
                Returns Centre
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-white">
                Help &amp; support
              </Link>
            </li>
            <li>
              <a href="mailto:support@bhumivera.com" className="break-words transition-colors hover:text-white">
                support@bhumivera.com
              </a>
            </li>
            <li>
              <a href="tel:+917430985647" className="transition-colors hover:text-white">
                +91 74309 85647
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8d6aa] sm:mb-5 sm:text-xs">
            Connect &amp; Portals
          </h3>
          <ul className="space-y-3 text-xs leading-5 text-white/60 sm:text-sm">
            <li>
              <a
                href="https://www.instagram.com/the_rsenterprises"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com/Bhumivera"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/Bhumivera"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                X (Twitter)
              </a>
            </li>
            <li>
              <Link to="/support" className="transition-colors hover:text-[#c8d6aa]">
                Support Agent Desk (/support)
              </Link>
            </li>
            <li>
              <Link to="/superadminsupport" className="transition-colors hover:text-[#c8d6aa]">
                SuperAdmin Support (/superadminsupport)
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard" className="transition-colors hover:text-[#c8d6aa]">
                Admin Workspace (/admin)
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#0c1410]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 py-7 sm:flex-row sm:justify-between sm:px-8 md:px-10">
          <Link to="/" aria-label="Bhumivera home" className="flex items-center gap-3">
            <img
              src="/logo.webp"
              alt="Bhumivera Crest"
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
              className="h-12 w-12 object-contain"
            />
            <span className="font-serif text-sm tracking-[0.16em] text-white/75">BHUMIVERA</span>
          </Link>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-white/45 sm:text-xs">
            <Link to="/legal?section=terms" className="transition-colors hover:text-[#c8d6aa]">
              Conditions of Use &amp; Sale
            </Link>
            <Link to="/legal?section=privacy" className="transition-colors hover:text-[#c8d6aa]">
              Privacy Notice
            </Link>
            <Link to="/legal?section=referrals" className="transition-colors hover:text-[#c8d6aa]">
              Referral rewards
            </Link>
            <Link to="/returns-centre" className="transition-colors hover:text-[#c8d6aa]">
              Return &amp; Refund Policy
            </Link>
          </div>
          <p className="text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35 sm:text-right">
            © {currentYear} Bhumivera · Care, returned to its source
          </p>
        </div>
      </div>
    </footer>
  );
}
