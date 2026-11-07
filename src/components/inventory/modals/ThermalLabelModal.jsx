import React, { useRef, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Printer, Download, Package, QrCode } from 'lucide-react';

export default function ThermalLabelModal({ order, onClose }) {
  const printAreaRef = useRef(null);
  const [packageQrUrl, setPackageQrUrl] = useState('');

  if (!order) return null;

  const awb = order.trackingNumber || `BV-TRK-${order.id}`;
  const courier = (order.courier || 'Delhivery Express').toUpperCase();
  const packagePayload = `PKG:${order.id}`;

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(packagePayload, {
      width: 140,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then(url => {
        if (active) setPackageQrUrl(url);
      })
      .catch(err => console.error('Failed to generate Package QR', err));
    return () => {
      active = false;
    };
  }, [order.id, packagePayload]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0c261b] text-white rounded-2xl shadow-2xl border border-emerald-500/40 max-w-md w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Controls */}
        <div className="p-4 border-b border-emerald-500/30 flex items-center justify-between bg-[#071711] print:hidden">
          <div>
            <h3 className="text-sm font-black uppercase text-white tracking-wide">4×6″ Thermal Courier Label</h3>
            <p className="text-[11px] text-emerald-300 font-medium">Order #{order.orderNumber} • {courier} • PKG ID: {packagePayload}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-md transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print 4×6″
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4x6 Shipping Label Container (White Background with Black Thermal Ink) */}
        <div className="p-6 bg-[#040e0a] flex justify-center overflow-y-auto">
          <div
            ref={printAreaRef}
            className="w-[360px] min-h-[520px] bg-white border-2 border-black p-4 text-black flex flex-col justify-between font-sans shadow-2xl print:border-none print:shadow-none print:w-full print:h-full print:p-2"
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
            <div className="py-2.5 border-b-2 border-black text-center">
              <div className="text-[10px] uppercase font-bold text-slate-600">AWB Tracking Number</div>
              {/* High-density barcode graphic */}
              <div className="h-12 flex items-center justify-center my-1">
                <div className="w-64 h-10 flex items-center justify-center bg-repeating-linear-stripes text-transparent select-none font-mono tracking-widest text-xs border-y border-black">
                  ||| | | |||| | ||| || |||| | | ||| || |||| | | |||
                </div>
              </div>
              <div className="font-mono text-sm font-black tracking-widest">{awb}</div>
            </div>

            {/* Destination Pincode & Package Recovery QR */}
            <div className="grid grid-cols-3 border-b-2 border-black py-2 items-center">
              <div className="col-span-2 pr-2 border-r-2 border-black">
                <div className="text-[9px] uppercase font-bold text-slate-600">Destination PIN & Hub</div>
                <div className="text-2xl font-black font-mono leading-tight">{order.pincode || '713304'}</div>
                <div className="text-xs font-black uppercase truncate">{order.city || 'KOLKATA'} / {order.state || 'WB'}</div>
                <div className="text-[10px] font-mono mt-1 font-black text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded inline-block">
                  {packagePayload}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center pl-2">
                {packageQrUrl ? (
                  <img src={packageQrUrl} alt="Package Recovery QR" className="w-16 h-16 object-contain" />
                ) : (
                  <div className="w-16 h-16 border border-black flex items-center justify-center text-[9px] font-mono">QR</div>
                )}
                <span className="text-[8px] font-mono font-black uppercase tracking-tight mt-0.5 text-center">PACKAGE QR</span>
              </div>
            </div>

            {/* Ship To Address */}
            <div className="py-2 border-b-2 border-black space-y-1">
              <div className="text-[9px] uppercase font-bold text-slate-600">Ship To (Consignee)</div>
              <div className="text-xs font-black">{order.customerName}</div>
              <div className="text-[11px] leading-tight text-slate-800">
                {order.addressLine1 || order.line1 || 'Patron Delivery Destination'}
                <br />
                {order.city}, {order.state} - {order.pincode}
              </div>
              <div className="text-[11px] font-bold font-mono">TEL: {order.customerPhone}</div>
            </div>

            {/* Items Summary with HSN */}
            <div className="py-2 border-b-2 border-black text-[10px]">
              <div className="font-bold flex justify-between">
                <span>Contents: Formulations • HSN: 30049011</span>
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
                <div className="text-[8px] text-slate-500 font-mono">Order #{order.orderNumber}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
