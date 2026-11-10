import React from 'react';
import { Truck, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderSummary = ({ cartItems = [], subtotal = 0, shipping = 0, tax = 0 }) => {
  const total = subtotal + shipping + tax;

  return (
    <div className="two-tone-panel-gold rounded-2xl p-6 lg:p-7 sticky top-24">
      <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20">
        <div>
          <p className="font-sub-gold text-[10px] tracking-[0.24em] uppercase font-semibold">Price Breakdown</p>
          <h2 className="text-xl md:text-2xl font-serif mt-1">
            <span className="font-headline-gold">Order</span>{' '}
            <span className="font-headline-silver">Summary</span>
          </h2>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
          <ShieldCheck size={18} />
        </div>
      </div>
      
      <div className="space-y-4 my-6">
        <div className="flex justify-between text-sm text-[#cbd5e1] font-light">
          <span>Subtotal</span>
          <span className="text-[#ffffff] font-medium tracking-wide">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        
        <div className="flex justify-between text-sm text-[#cbd5e1] font-light">
          <span>Estimated Shipping</span>
          <span className="text-[#d4af37] font-medium tracking-wide">{shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping.toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between text-sm text-[#cbd5e1] font-light">
          <span>Taxes & Duties</span>
          <span className="text-[#ffffff] font-medium tracking-wide">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        <div className="pt-5 border-t border-[#d4af37]/20">
          <div className="flex justify-between items-baseline">
            <div>
              <p className="font-sub-gold text-[10px] tracking-[0.22em] uppercase">Total Payable</p>
              <p className="text-3xl font-serif font-bold text-[#ffffff] tracking-tight mt-1">
                <span className="text-[#d4af37]">₹</span>{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#fce096] font-semibold uppercase tracking-[0.18em] bg-[#d4af37]/10 border border-[#d4af37]/30 px-2.5 py-1 rounded-full">
                Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="gold-hairline my-6" />

      <div className="space-y-3">
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#070a0e]/60 border border-[#d4af37]/15">
          <div className="w-9 h-9 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center text-[#d4af37] shrink-0">
            <Truck size={17} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#ffffff] uppercase tracking-wider">Priority Express Logistics</p>
            <p className="text-[11px] text-[#94a3b8]">Dispatched in sealed tamper-proof packaging</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#070a0e]/60 border border-[#94a3b8]/15">
          <div className="w-9 h-9 rounded-lg bg-[#94a3b8]/10 border border-[#94a3b8]/25 flex items-center justify-center text-[#cbd5e1] shrink-0">
            <Mail size={17} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#ffffff] uppercase tracking-wider">Concierge Support</p>
            <a href="mailto:support@bhumivera.com" className="text-[11px] text-[#cbd5e1] hover:text-[#fce096] transition-colors">
              support@bhumivera.com
            </a>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[10px] text-center text-[#94a3b8] font-normal leading-relaxed uppercase tracking-[0.16em]">
        By completing your order, you agree to our <br/>
        <Link to="/legal?section=terms" className="text-[#cbd5e1] hover:text-[#fce096] underline transition-colors">Terms of Sale</Link> and <Link to="/legal?section=privacy" className="text-[#cbd5e1] hover:text-[#fce096] underline transition-colors">Privacy Policy</Link>
      </p>
    </div>
  );
};

export default OrderSummary;
