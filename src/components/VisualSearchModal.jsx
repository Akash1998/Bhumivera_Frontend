import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Camera, X, Upload, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../services/api';
import { haptics } from '../utils/haptics';

export default function VisualSearchModal({ isOpen, onClose }) {
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setError(null);
      setResults(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCaptureNative = async () => {
    if (typeof window !== 'undefined' && window.Capacitor?.isPluginAvailable?.('Camera')) {
      try {
        const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
        const image = await Camera.getPhoto({
          quality: 85,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
        });
        if (image?.base64String) {
          setPreview(`data:image/${image.format || 'jpeg'};base64,${image.base64String}`);
          setError(null);
          setResults(null);
        }
      } catch (err) {
        console.warn('[NATIVE_CAMERA_CANCELLED]', err);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const executeVisualSearch = async () => {
    if (!preview) return;
    setAnalyzing(true);
    setError(null);
    haptics.impactLight();

    try {
      const { data } = await axios.post(`${BASE_URL}/api/ai/visual-search`, {
        imageBase64: preview,
      });

      if (data.success) {
        setResults(data);
        haptics.notificationSuccess();
      } else {
        setError(data.message || 'No matching items identified.');
        haptics.notificationError();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Visual search failed. Please try another photo.');
      haptics.notificationError();
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#faf8f5] p-6 text-[#1c2922] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-stone-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#607552]">
          <Sparkles className="h-4 w-4" /> AI Visual Search &amp; Ingredient Scanner
        </div>
        <h2 className="mt-1 font-serif text-2xl">Find by Photo or Camera</h2>
        <p className="mt-1 text-xs text-stone-600">
          Point at an Ayurvedic botanical, skincare concern, or cosmetic item to discover matching catalog remedies.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {!preview ? (
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleCaptureNative}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#0b2419] py-3.5 text-sm font-semibold uppercase tracking-wider text-white hover:bg-[#153e2c]"
            >
              <Camera className="h-5 w-5" /> Take a Photo
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              <Upload className="h-4 w-4" /> Choose from Gallery
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="relative overflow-hidden rounded-xl border border-stone-300 bg-black/5">
              <img src={preview} alt="Visual Query" className="max-h-60 w-full object-contain" />
              <button
                onClick={reset}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!results && (
              <button
                onClick={executeVisualSearch}
                disabled={analyzing}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2419] py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-[#153e2c] disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" /> Analyzing with Gemini Vision...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Identify &amp; Search Catalog
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {results && (
          <div className="mt-5 max-h-72 overflow-y-auto border-t border-stone-200 pt-3">
            <div className="rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-900">
              <p className="font-semibold">Detected: {results.detection?.detectedEntity}</p>
              <p className="text-[11px] text-emerald-700">
                Keywords: {results.detection?.searchKeywords?.join(', ')}
              </p>
            </div>

            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Matching Remedies ({results.products?.length || 0}):
            </p>

            <div className="mt-2 space-y-2">
              {results.products?.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    onClose();
                    navigate(`/product/${prod.slug || prod.id}`);
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-stone-200 bg-white p-2.5 transition hover:border-[#607552]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.images?.[0] || '/placeholder.png'}
                      alt={prod.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold text-stone-800 line-clamp-1">{prod.name}</p>
                      <p className="text-[11px] text-stone-500">₹{prod.discount_price || prod.price}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-stone-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
