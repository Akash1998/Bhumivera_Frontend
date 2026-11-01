import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Camera,
  CheckCircle2,
  FlaskConical,
  Gift,
  Lock,
  QrCode,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import SEO from '../components/SEO';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const UNIVERSAL_GIFT_CODE = 'BHUMIVERA-GIFT-2026';

export default function ProductVerification() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth() || {};
  const userId = user?.id;
  const urlGiftCode = searchParams.get('qr') || '';
  const urlSerial = searchParams.get('serial') || searchParams.get('code') || '';
  const urlGiftSerial = searchParams.get('serial') || '';
  const [serial, setSerial] = useState(urlSerial);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [coaData, setCoaData] = useState(null);
  const [error, setError] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [giftCode, setGiftCode] = useState(urlGiftCode || UNIVERSAL_GIFT_CODE);
  const [giftSerial, setGiftSerial] = useState(urlGiftSerial);
  const [giftStatus, setGiftStatus] = useState(null);
  const [giftLoading, setGiftLoading] = useState(false);
  const [redeemingGift, setRedeemingGift] = useState(false);
  const videoRef = useRef(null);
  const scannerControlsRef = useRef(null);
  const scannedResultRef = useRef(false);

  const verifySerialCode = useCallback(async (targetSerial) => {
    const cleanSerial = String(targetSerial || '').trim().toUpperCase();
    if (!cleanSerial) return;

    setSerial(cleanSerial);
    setProductData(null);
    setCoaData(null);
    setError('');
    setLoading(true);
    const [coaResult, warrantyResult] = await Promise.allSettled([
      api.get(`/serials/batch-coa/${encodeURIComponent(cleanSerial)}`),
      api.get(`/warranty/validate/${encodeURIComponent(cleanSerial)}`),
    ]);

    if (coaResult.status === 'fulfilled' && coaResult.value.data?.success &&
        coaResult.value.data?.verified && coaResult.value.data?.coa) {
      setCoaData(coaResult.value.data.coa);
    } else {
      setError(
        (coaResult.status === 'rejected' && coaResult.reason?.response?.data?.message) ||
        (coaResult.status === 'fulfilled' && coaResult.value.data?.message) ||
        'This serial does not have a verified batch certificate.'
      );
    }

    if (warrantyResult.status === 'fulfilled' && warrantyResult.value.data?.success) {
      setProductData(warrantyResult.value.data);
    } else if (coaResult.status === 'rejected' && warrantyResult.status === 'rejected') {
      setError(
        warrantyResult.reason?.response?.data?.message ||
        coaResult.reason?.response?.data?.message ||
        'Could not verify this serial right now. Please try again.'
      );
    }
    setLoading(false);
  }, []);

  const verifyGift = useCallback(async (targetCode, targetSerial = '') => {
    const cleanCode = String(targetCode || '').trim().toUpperCase();
    const cleanSerial = String(targetSerial || '').trim().toUpperCase();
    if (!cleanCode) return;

    setGiftCode(cleanCode);
    setGiftSerial(cleanSerial);
    setGiftStatus(null);
    if (!userId) {
      setGiftStatus({
        requiresLogin: true,
        message: 'Sign in so we can securely check your delivered orders and gift history.',
      });
      return;
    }

    setGiftLoading(true);
    try {
      const { data } = await api.get('/gamification/box-qr-status', {
        params: { qr: cleanCode, ...(cleanSerial ? { serial: cleanSerial } : {}) },
      });
      setGiftStatus(data);
    } catch (verificationError) {
      setGiftStatus(verificationError.response?.data || {
        valid: false,
        message: 'Could not check your gift eligibility right now. Please try again.',
      });
    } finally {
      setGiftLoading(false);
    }
  }, [userId]);

  const stopCameraScanner = useCallback(() => {
    scannerControlsRef.current?.stop();
    scannerControlsRef.current = null;
    setScannerOpen(false);
  }, []);

  const handleScannedRawValue = useCallback((rawValue) => {
    const scannedValue = String(rawValue || '').trim();
    if (!scannedValue) return;

    try {
      const scannedUrl = new URL(scannedValue, window.location.origin);
      const scannedGiftCode = scannedUrl.searchParams.get('qr') || scannedUrl.searchParams.get('code');
      const scannedSerial = scannedUrl.searchParams.get('serial');
      if (scannedGiftCode) {
        setGiftCode(scannedGiftCode);
        setGiftSerial(scannedSerial || '');
        verifyGift(scannedGiftCode, scannedSerial || '');
        return;
      }
      if (scannedSerial) {
        verifySerialCode(scannedSerial);
        return;
      }
    } catch {
      // Non-URL QR values are handled as codes below.
    }

    if (scannedValue.toUpperCase() === UNIVERSAL_GIFT_CODE) {
      verifyGift(scannedValue);
    } else {
      verifySerialCode(scannedValue);
    }
  }, [verifyGift, verifySerialCode]);

  useEffect(() => {
    if (!scannerOpen || !videoRef.current) return undefined;
    let active = true;
    scannedResultRef.current = false;
    const reader = new BrowserMultiFormatReader();

    reader.decodeFromConstraints({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 },
        advanced: [{ focusMode: 'continuous' }],
      },
      audio: false,
    }, videoRef.current, (result) => {
      if (!active || !result || scannedResultRef.current) return;
      scannedResultRef.current = true;
      stopCameraScanner();
      handleScannedRawValue(result.getText());
    }).then((controls) => {
      if (active) {
        scannerControlsRef.current = controls;
        const track = videoRef.current?.srcObject?.getVideoTracks?.()[0];
        const caps = track?.getCapabilities?.() || {};
        if (caps.focusMode?.includes('continuous')) {
          track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] }).catch(() => {});
        }
      } else {
        controls.stop();
      }
    }).catch((cameraFailure) => {
      if (active) {
        setScannerError(cameraFailure?.message || 'Unable to start the camera. Check camera permission and try again.');
        setScannerOpen(false);
      }
    });

    return () => {
      active = false;
      scannerControlsRef.current?.stop();
      scannerControlsRef.current = null;
    };
  }, [handleScannedRawValue, scannerOpen, stopCameraScanner]);

  useEffect(() => {
    if (searchParams.get('scan') === '1' || searchParams.get('scan') === 'true') {
      setScannerOpen(true);
    }
    if (urlGiftCode) {
      setGiftCode(urlGiftCode);
      verifyGift(urlGiftCode, urlGiftSerial);
    } else if (urlSerial) {
      verifySerialCode(urlSerial);
    }
  }, [searchParams, urlGiftCode, urlGiftSerial, urlSerial, verifyGift, verifySerialCode]);

  const handleGiftSubmit = (event) => {
    event.preventDefault();
    verifyGift(giftCode, giftSerial);
  };

  const handleRedeemGift = async () => {
    setRedeemingGift(true);
    try {
      const { data } = await api.post('/gamification/redeem-box-qr', {
        qr: giftCode,
        ...(giftSerial ? { serial: giftSerial } : {}),
      });
      setGiftStatus(data);
    } catch (redeemError) {
      setGiftStatus(redeemError.response?.data || {
        valid: false,
        message: 'Could not redeem your gift right now. Please try again.',
      });
    } finally {
      setRedeemingGift(false);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    verifySerialCode(serial);
  };

  const productImage = Array.isArray(productData?.images) ? productData.images[0] : null;

  return (
    <main className="min-h-screen bg-[#070a0e] pb-28 pt-10 font-sans text-[#e2e8f0] selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Bottle Serial & Patron Gift Verification | Bhumivera"
        description="Scan a Bhumivera box QR code or enter a bottle serial to verify the batch record and check your one-time delivered-order gift."
        route="/verify"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="flex flex-wrap items-center gap-4 border-b border-[#d4af37]/25 pb-6 pt-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4af37]/40 bg-[#0d1520] text-[#d4af37]">
            <ShieldCheck size={26} />
          </span>
          <div>
            <p className="font-sub-gold text-[10px] uppercase tracking-[0.25em]">
              Product authenticity &amp; box gift portal
            </p>
            <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
              <span className="font-headline-gold">Bottle Serial &amp; QR</span>{' '}
              <span className="font-headline-silver">Verification</span>
            </h1>
          </div>
        </header>

        <section className="relative mt-8 overflow-hidden rounded-3xl border border-[#d4af37]/40 two-tone-panel-gold p-6 shadow-2xl sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-3xl" />
          <div className="relative mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#070a0e] px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">
              <QrCode size={14} className="text-[#d4af37]" />
              Verify a bottle or scan your box QR
            </div>
            <h2 className="mt-5 font-serif text-2xl text-white sm:text-4xl">
              Inspect Your Bottle&apos;s Batch Record
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#cbd5e1]">
              Scan the QR code printed on your box card, or enter the serial printed on your bottle. Only registry-backed records are shown as verified.
            </p>

            <div className="mt-7">
              <button
                type="button"
                onClick={() => {
                  setScannerError('');
                  setScannerOpen((open) => !open);
                }}
                className="btn-gold-luxury inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
              >
                {scannerOpen ? <X size={16} /> : <Camera size={16} />}
                {scannerOpen ? 'Close Camera Scanner' : 'Open Live Camera QR Scanner'}
              </button>
            </div>

            {scannerOpen && createPortal(
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black p-4">
              <div className="w-full max-w-lg rounded-2xl border-2 border-[#d4af37] bg-black p-4">
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" style={{ filter: 'none', backdropFilter: 'none' }} />
                  <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-dashed border-[#fce096]" />
                </div>
                <p className="mt-3 text-xs text-[#fce096]">Hold the QR code steady inside the frame.</p>
                {scannerError && <p role="alert" className="mt-2 text-sm text-amber-300">{scannerError}</p>}
                <button type="button" onClick={stopCameraScanner} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#d4af37] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#fce096]">
                  <X size={14} /> Close Camera Scanner
                </button>
              </div>
              </div>,
              document.body
            )}
            {scannerError && !scannerOpen && (
              <p role="alert" className="mx-auto mt-4 max-w-xl text-sm text-amber-300">{scannerError}</p>
            )}

            <form onSubmit={handleSearchSubmit} className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="text"
                required
                value={serial}
                onChange={(event) => setSerial(event.target.value)}
                aria-label="Product serial number"
                placeholder="Enter bottle serial (e.g. BV-CH26-8841)"
                className="min-w-0 flex-1 rounded-2xl border border-[#d4af37]/40 bg-[#070a0e] px-5 py-4 font-mono text-base uppercase tracking-wider text-[#fce096] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-stone-600 focus:border-[#d4af37]"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gold-luxury inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition disabled:cursor-wait disabled:opacity-50"
              >
                <Search size={16} />
                {loading ? 'Checking…' : 'Verify Bottle Serial'}
              </button>
            </form>

            {error && (
              <p role="alert" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-left text-sm text-rose-300">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </p>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#d4af37]/40 bg-[#0d1520] p-6 shadow-xl sm:p-8">
          <div className="flex items-center gap-3">
            <Gift size={24} className="text-[#d4af37]" />
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">
                One-time delivered-order patron gift
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold text-white sm:text-2xl">
                Claim ₹250 Credit + 100 Privilege Points
              </h2>
            </div>
          </div>
          <form onSubmit={handleGiftSubmit} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input
              type="text"
              value={giftCode}
              onChange={(event) => setGiftCode(event.target.value)}
              aria-label="Box gift code"
              placeholder="Box gift code"
              className="min-w-0 rounded-xl border border-[#d4af37]/35 bg-[#070a0e] px-4 py-3 font-mono text-sm uppercase text-[#fce096] outline-none focus:border-[#d4af37]"
            />
            <input
              type="text"
              value={giftSerial}
              onChange={(event) => setGiftSerial(event.target.value)}
              aria-label="Optional bottle serial number"
              placeholder="Bottle serial (optional)"
              className="min-w-0 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] px-4 py-3 font-mono text-sm uppercase text-white outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              disabled={giftLoading}
              className="btn-gold-luxury inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
            >
              <Search size={15} /> {giftLoading ? 'Checking…' : 'Check Gift'}
            </button>
          </form>

          {giftStatus && (
            <div className="mt-5 rounded-2xl border border-[#d4af37]/30 bg-[#070a0e] p-5" role="status">
              {giftStatus.requiresLogin ? (
                <>
                  <p className="flex items-center gap-2 font-semibold text-[#fce096]">
                    <Lock size={18} /> Sign in to check gift eligibility
                  </p>
                  <p className="mt-2 text-sm text-[#cbd5e1]">{giftStatus.message}</p>
                  <Link
                    to={`/login?redirect=${encodeURIComponent(`/verify?qr=${encodeURIComponent(giftCode)}${giftSerial ? `&serial=${encodeURIComponent(giftSerial)}` : ''}`)}`}
                    className="btn-gold-luxury mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    Sign In <ArrowRight size={14} />
                  </Link>
                </>
              ) : giftStatus.redeemedNow ? (
                <p className="font-semibold text-emerald-300">
                  Gift claimed: ₹{giftStatus.creditInr} credit and {giftStatus.loyaltyPoints} points added to your account.
                </p>
              ) : giftStatus.canRedeem ? (
                <>
                  <p className="font-semibold text-emerald-300">
                    Delivered order verified{giftStatus.qualifyingOrder?.order_number
                      ? `: #${giftStatus.qualifyingOrder.order_number}`
                      : ''}. Your account is eligible.
                  </p>
                  <button
                    type="button"
                    onClick={handleRedeemGift}
                    disabled={redeemingGift}
                    className="btn-gold-luxury mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
                  >
                    <Gift size={15} /> {redeemingGift ? 'Crediting account…' : 'Claim My One-Time Gift'}
                  </button>
                </>
              ) : (
                <p className="flex items-center gap-2 text-sm text-rose-200">
                  <AlertCircle size={17} /> {giftStatus.message || 'This gift code could not be verified.'}
                </p>
              )}
            </div>
          )}
        </section>

        {coaData && (
          <section aria-live="polite" className="mt-8 overflow-hidden rounded-3xl border border-[#d4af37]/40 bg-[#0d1520] p-6 shadow-xl sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d4af37]/20 pb-5">
              <div className="flex items-center gap-3">
                <FlaskConical size={24} className="text-[#d4af37]" />
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                    Verified batch certificate of analysis
                  </p>
                  <h2 className="mt-1 font-serif text-xl font-bold text-white sm:text-2xl">
                    {coaData.productName}
                  </h2>
                </div>
              </div>
              <span className="rounded-xl border border-[#d4af37]/45 bg-[#070a0e] px-4 py-2 font-mono text-xs font-bold text-[#fce096]">
                {coaData.bottleSequence}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8]">Serial &amp; Batch ID</dt>
                <dd className="mt-1 font-mono font-semibold text-[#fce096]">{coaData.serial} · {coaData.batchCode}</dd>
              </div>
              <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8]">Digital Electrode pH Assay</dt>
                <dd className="mt-1 font-semibold text-emerald-400">{coaData.calibratedPh}</dd>
              </div>
              <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8]">Cold-Press Extraction Temp</dt>
                <dd className="mt-1 font-semibold text-white">{coaData.extractionTemp}</dd>
              </div>
              <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8]">Microbiological Assay</dt>
                <dd className="mt-1 font-semibold text-white">{coaData.microbiologicalAssay}</dd>
              </div>
              <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8]">Heavy Metal Screen (ICP-MS)</dt>
                <dd className="mt-1 font-semibold text-white">{coaData.heavyMetals}</dd>
              </div>
              <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8]">Artisanal Tamper Custody</dt>
                <dd className="mt-1 font-semibold text-[#fce096]">{coaData.tamperCustody}</dd>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] p-4 text-xs text-[#cbd5e1]">
              <p><strong className="text-[#fce096]">Label-disclosed active profile:</strong> {coaData.disclosedActives}</p>
              <p className="mt-1 text-[#94a3b8]"><strong className="text-white">Origin &amp; press date:</strong> {coaData.originLot} · Pressed {coaData.pressedDate} ({coaData.remainingInBatch} of 250 units remaining)</p>
            </div>
          </section>
        )}

        {productData && (
          <section aria-live="polite" className="mt-8 overflow-hidden rounded-3xl border border-[#d4af37]/35 two-tone-panel p-6 shadow-xl sm:p-8">
            <div className="flex flex-wrap items-center gap-3 border-b border-[#d4af37]/20 pb-5">
              <CheckCircle2 size={22} className="text-[#d4af37]" />
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">
                  Database serial matched
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
