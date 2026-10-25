import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, CalendarDays, CheckCircle2, FlaskConical, PackageCheck, Search, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import { serials as serialsApi } from '../services/api';

const formatDate = value => {
  if (!value) return 'Not recorded';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function ProductVerification() {
  const [searchParams] = useSearchParams();
  const requestId = useRef(0);
  const [serial, setSerial] = useState(searchParams.get('serial') || searchParams.get('code') || '');
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const verifyCode = useCallback(async value => {
    const code = String(value || '').trim().toUpperCase();
    if (!code) return;

    const currentRequest = ++requestId.current;
    setSerial(code);
    setVerification(null);
    setError('');
    setLoading(true);
    try {
      const response = await serialsApi.verify(code);
      if (currentRequest === requestId.current) {
        setVerification(response.data?.verified ? response.data : null);
        if (!response.data?.verified) {
          setError(response.data?.message || 'This code could not be verified.');
        }
      }
    } catch (verifyError) {
      if (currentRequest === requestId.current) {
        setError(
          verifyError.response?.data?.message ||
          'We could not check this code right now. Please try again shortly.'
        );
      }
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const code = searchParams.get('serial') || searchParams.get('code') || '';
    setSerial(code);
    setVerification(null);
    setError('');
    if (code) void verifyCode(code);
  }, [searchParams, verifyCode]);

  const handleSubmit = event => {
    event.preventDefault();
    void verifyCode(serial);
  };

  const imageUrl = verification?.image
    ? (/^https?:\/\//i.test(verification.image)
      ? verification.image
      : `${import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_URL || 'https://service.bhumivera.com'}${verification.image.startsWith('/') ? '' : '/'}${verification.image}`)
    : null;

  return (
    <main className="min-h-screen bg-[#11120F] px-4 pb-28 pt-12 font-sans text-[#FAF7F2] sm:px-6">
      <SEO
        title="Product Authenticity & Batch Verification | Bhumivera"
        description="Verify a Bhumivera product code against its registered production batch and view its recorded expiry and batch details."
        route="/verify"
      />

      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center gap-4 border-b border-[#D4AF37]/25 pb-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#14291F] text-[#FCE096]">
            <ShieldCheck size={25} />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#D4AF37]">Bhumivera product registry</p>
            <h1 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">Authenticity &amp; Batch Check</h1>
          </div>
        </header>

        <section className="rounded-3xl border border-[#D4AF37]/30 bg-[#14291F] p-6 shadow-2xl sm:p-9">
          <div className="mx-auto max-w-2xl text-center">
            <PackageCheck className="mx-auto h-8 w-8 text-[#D4AF37]" aria-hidden="true" />
            <h2 className="mt-4 font-serif text-2xl font-semibold sm:text-3xl">Check your product code</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#DFD7C4]">
              Scan the QR code on your product or enter its unique code to check the official batch record, manufacture date, and expiry date.
            </p>
            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="product-authenticity-code">Product code</label>
              <input
                id="product-authenticity-code"
                type="text"
                required
                maxLength={255}
                value={serial}
                onChange={event => setSerial(event.target.value.toUpperCase())}
                placeholder="Enter the code printed on your label"
                autoCapitalize="characters"
                autoComplete="off"
                className="min-h-14 min-w-0 flex-1 rounded-2xl border border-[#D4AF37]/35 bg-[#11120F] px-5 font-mono text-sm tracking-wider text-[#FCE096] outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-[#9BB0A5] focus:border-[#FCE096]"
              />
              <button
                type="submit"
                disabled={loading || !serial.trim()}
                className="btn-gold-luxury inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl px-7 text-xs font-bold uppercase tracking-widest disabled:cursor-wait disabled:opacity-60"
              >
                <Search size={16} />
                {loading ? 'Checking…' : 'Verify product'}
              </button>
            </form>
          </div>
        </section>

        {loading && (
          <div role="status" aria-live="polite" className="mt-7 rounded-2xl border border-[#D4AF37]/20 bg-[#14291F]/80 p-6 text-center text-sm text-[#DFD7C4]">
            Checking the official batch registry…
          </div>
        )}

        {error && (
          <section role="alert" className="mt-7 flex items-start gap-3 rounded-2xl border border-rose-400/30 bg-rose-950/30 p-5 text-sm text-rose-200">
            <AlertCircle size={19} className="mt-0.5 shrink-0 text-rose-300" />
            <div>
              <h2 className="font-semibold">We couldn’t verify this code</h2>
              <p className="mt-1 leading-relaxed">{error}</p>
            </div>
          </section>
        )}

        {verification && (
          <section aria-live="polite" className="mt-7 overflow-hidden rounded-3xl border border-emerald-400/30 bg-[#14291F] shadow-xl">
            <div className={`flex items-start gap-4 border-b border-white/10 p-6 sm:p-8 ${verification.expired ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
              {verification.expired
                ? <CalendarDays size={25} className="mt-0.5 shrink-0 text-amber-300" />
                : <CheckCircle2 size={25} className="mt-0.5 shrink-0 text-emerald-300" />}
              <div>
                <p className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${verification.expired ? 'text-amber-200' : 'text-emerald-200'}`}>
                  {verification.expired ? 'Authentic · past expiry date' : 'Official batch record matched'}
                </p>
                <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">{verification.productName}</h2>
                <p className="mt-2 break-all font-mono text-xs text-[#DFD7C4]">{verification.serialNumber}</p>
              </div>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt=""
                  className="ml-auto hidden h-20 w-20 rounded-xl border border-[#D4AF37]/25 object-cover sm:block"
                />
              )}
            </div>

            <dl className="grid gap-px bg-white/10 sm:grid-cols-2">
              {[
                ['Batch number', verification.batchNumber],
                ['Product SKU', verification.sku],
                ['Manufactured', formatDate(verification.manufactureDate)],
                ['Expiry date', formatDate(verification.expiryDate)],
                ['Batch size', `${verification.batchQuantity} units`],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#11120F]/85 p-5">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-[#9BB0A5]">{label}</dt>
                  <dd className="mt-2 break-words text-sm font-semibold text-[#FCE096]">{value || 'Not recorded'}</dd>
                </div>
              ))}
            </dl>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-4">
                <FlaskConical size={18} className="text-[#D4AF37]" />
                <h3 className="font-serif text-lg font-semibold">Recorded batch information</h3>
              </div>
              {verification.details?.length ? (
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {verification.details.map(detail => (
                    <div key={detail.label} className="rounded-xl border border-[#D4AF37]/15 bg-[#11120F]/65 p-4">
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-[#9BB0A5]">{detail.label}</dt>
                      <dd className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#FAF7F2]">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-4 text-sm text-[#9BB0A5]">No additional batch information has been recorded.</p>
              )}
              {verification.expired && (
                <p className="mt-5 rounded-xl border border-amber-400/25 bg-amber-950/20 p-4 text-sm leading-relaxed text-amber-100">
                  This batch code matches an official record, but the recorded expiry date has passed. Please do not use the product.
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
