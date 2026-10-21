import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, QrCode, Search, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../services/api';

export default function ProductVerification() {
  const [searchParams] = useSearchParams();
  const urlSerial = searchParams.get('serial') || searchParams.get('code') || '';
  const [serial, setSerial] = useState(urlSerial);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState('');

  const verifySerialCode = async (targetSerial) => {
    const cleanSerial = targetSerial.trim().toUpperCase();
    if (!cleanSerial) return;

    setSerial(cleanSerial);
    setProductData(null);
    setError('');
    setLoading(true);
    try {
      const response = await api.get(`/warranty/validate/${encodeURIComponent(cleanSerial)}`);
      if (!response.data?.success) {
        setError(response.data?.message || 'This serial number could not be verified.');
        return;
      }
      setProductData(response.data);
    } catch (verificationError) {
      setError(
        verificationError.response?.data?.message ||
        'Verification is temporarily unavailable. Please try again shortly.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlSerial) verifySerialCode(urlSerial);
  }, [urlSerial]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    verifySerialCode(serial);
  };

  const productImage = Array.isArray(productData?.images) ? productData.images[0] : null;

  return (
    <main className="min-h-screen bg-[#070a0e] pb-28 pt-10 font-sans text-[#e2e8f0] selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Product Verification | Bhumivera"
        description="Check whether a Bhumivera product serial number matches an issued product record."
        route="/verify"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="flex flex-wrap items-center gap-4 border-b border-[#d4af37]/25 pb-6 pt-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4af37]/40 bg-[#0d1520] text-[#d4af37]">
            <ShieldCheck size={26} />
          </span>
          <div>
            <p className="font-sub-gold text-[10px] uppercase tracking-[0.25em]">
              Bhumivera Product Lookup
            </p>
            <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
              <span className="font-headline-gold">Product</span>{' '}
              <span className="font-headline-silver">Verification</span>
            </h1>
          </div>
        </header>

        <section className="relative mt-8 overflow-hidden rounded-3xl border border-[#d4af37]/40 two-tone-panel-gold p-6 shadow-2xl sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-3xl" />
          <div className="relative mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#070a0e] px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">
              <QrCode size={14} className="text-[#d4af37]" />
              Serial Number Check
            </div>
            <h2 className="mt-5 font-serif text-2xl text-white sm:text-4xl">
              Check Your Product
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#cbd5e1]">
              Enter or scan the serial number printed on your product label to check whether it matches a Bhumivera product record.
            </p>

            <form onSubmit={handleSearchSubmit} className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="text"
                required
                value={serial}
                onChange={(event) => setSerial(event.target.value)}
                aria-label="Product serial number"
                placeholder="Enter product serial number"
                className="min-w-0 flex-1 rounded-2xl border border-[#d4af37]/40 bg-[#070a0e] px-5 py-4 font-mono text-base uppercase tracking-wider text-[#fce096] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-stone-600 focus:border-[#d4af37]"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gold-luxury inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition disabled:cursor-wait disabled:opacity-50"
              >
                <Search size={16} />
                {loading ? 'Checking…' : 'Verify Product'}
              </button>
            </form>

            <p className="mt-4 text-xs leading-relaxed text-[#94a3b8]">
              This lookup only checks the serial number against available Bhumivera product records.
            </p>

            {error && (
              <p role="alert" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-left text-sm text-rose-300">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </p>
            )}
          </div>
        </section>

        {productData && (
          <section aria-live="polite" className="mt-8 overflow-hidden rounded-3xl border border-[#d4af37]/35 two-tone-panel p-6 shadow-xl sm:p-8">
            <div className="flex flex-wrap items-center gap-3 border-b border-[#d4af37]/20 pb-5">
              <CheckCircle2 size={22} className="text-[#d4af37]" />
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">
                  Serial Matched
                </p>
                <h2 className="mt-1 font-serif text-xl font-bold text-white sm:text-2xl">
                  Product record found
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1fr)_180px]">
              <dl className="grid content-start gap-4 sm:grid-cols-2">
                <div className="min-w-0 rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/60 p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8]">Product</dt>
                  <dd className="mt-1 break-words font-semibold text-white">{productData.product_name || 'Product record'}</dd>
                </div>
                <div className="min-w-0 rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/60 p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8]">Serial number</dt>
                  <dd className="mt-1 break-all font-mono font-semibold text-[#fce096]">{productData.serial_number || serial}</dd>
                </div>
                {productData.brand && (
                  <div className="min-w-0 rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/60 p-4">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8]">Brand</dt>
                    <dd className="mt-1 break-words font-semibold text-white">{productData.brand}</dd>
                  </div>
                )}
                {productData.category_name && (
                  <div className="min-w-0 rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/60 p-4">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8]">Category</dt>
                    <dd className="mt-1 break-words font-semibold text-white">{productData.category_name}</dd>
                  </div>
                )}
              </dl>

              {productImage && (
                <img
                  src={productImage}
                  alt={productData.product_name || 'Verified product'}
                  className="h-44 w-full rounded-2xl border border-[#d4af37]/20 object-cover sm:h-48"
                />
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
