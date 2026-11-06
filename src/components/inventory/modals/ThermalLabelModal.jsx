import React, { useRef } from 'react';
import { X, Printer, Download, Package } from 'lucide-react';

export default function ThermalLabelModal({ order, onClose }) {
  const printAreaRef = useRef(null);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const awb = order.trackingNumber || `BV-TRK-${order.id}`;
  const courier = (order.courier || 'Delhivery Express').toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Controls */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div>
            <h3 className="text-sm font-bold text-slate-900">4×6″ Thermal Courier Label</h3>
            <p className="text-[11px] text-slate-500">Order #{order.orderNumber} • {courier}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print 4×6″
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4x6 Shipping Label Container */}
        <div className="p-6 bg-slate-100 flex justify-center overflow-y-auto">
          <div
            ref={printAreaRef}
            className="w-[360px] min-h-[520px] bg-white border-2 border-black p-4 text-black flex flex-col justify-between font-sans shadow-lg print:border-none print:shadow-none print:w-full print:h-full print:p-2"
          >
            {/* Carrier Banner & Routing */}
            <div className="border-b-2 border-black pb-2 flex items-center justify-between">
              <div>
                <div className="text-xl font-black tracking-tight">{courier}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider">Surface Air Express</div>
              </div>
              <div className="text-right">
                <span className="inline-block border-2 border-black px-2 py-0.5 text-xs font-black uppercase">
                  {order.paymentMode === 'cod' ? 'COD' : 'PREPAID'}
                </span>
                {order.paymentMode === 'cod' && (
                  <div className="text-xs font-black mt-0.5">₹{order.total}</div>
                )}
              </div>
            </div>

            {/* AWB Barcode Simulation */}
            <div className="py-3 border-b-2 border-black text-center">
              <div className="text-[10px] uppercase font-bold text-slate-600">AWB Tracking Number</div>
              {/* High-density barcode graphic */}
              <div className="h-14 flex items-center justify-center my-1">
                <div className="w-64 h-12 flex items-center justify-center bg-repeating-linear-stripes text-transparent select-none font-mono tracking-widest text-xs border-y border-black">
                  ||| | | |||| | ||| || |||| | | ||| || |||| | | |||
                </div>
              </div>
              <div className="font-mono text-sm font-black tracking-widest">{awb}</div>
            </div>

            {/* Destination Pincode & Routing Hub */}
            <div className="grid grid-cols-2 border-b-2 border-black py-2">
              <div className="border-r-2 border-black pr-2">
                <div className="text-[9px] uppercase font-bold text-slate-600">Destination PIN</div>
                <div className="text-2xl font-black font-mono">{order.pincode || '713304'}</div>
              </div>
              <div className="pl-2">
                <div className="text-[9px] uppercase font-bold text-slate-600">Routing Hub</div>
                <div className="text-sm font-black uppercase">{order.city || 'KOLKATA'} / {order.state || 'WB'}</div>
              </div>
            </div>

            {/* Ship To Address */}
            <div className="py-2 border-b-2 border-black space-y-1">
              <div className="text-[9px] uppercase font-bold text-slate-600">Ship To (Consignee)</div>
              <div className="text-xs font-black">{order.customerName}</div>
              <div className="text-[11px] leading-tight text-slate-800">
                {order.addressLine1 || 'Maison Address Details'}
                <br />
                {order.city}, {order.state} - {order.pincode}
              </div>
              <div className="text-[11px] font-bold font-mono">TEL: {order.customerPhone}</div>
            </div>

            {/* Items Summary */}
            <div className="py-2 border-b-2 border-black text-[10px]">
              <div className="font-bold flex justify-between">
                <span>Contents: Botanical Cleansers & Formulations</span>
                <span>Qty: {order.items?.length || 1} SKU(s)</span>
              </div>
              <div className="text-slate-600 truncate mt-0.5">
                {order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}
              </div>
            </div>

            {/* Return Address & Brand Footer */}
            <div className="pt-2 flex justify-between items-end text-[9px]">
              <div>
                <div className="font-black uppercase">If Undelivered Return To:</div>
                <div className="font-semibold text-slate-700">
                  Bhumivera Organics India Pvt Ltd
                  <br />
                  G.T. Road, Gopalpur, Asansol, WB - 713304
                </div>
              </div>
              <div className="text-right">
                <div className="font-black">BHUMIVERA</div>
                <div className="text-[8px] text-slate-500 font-mono">Invoice #{order.orderNumber}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
