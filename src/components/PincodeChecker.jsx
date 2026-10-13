import React, { useState } from 'react';
import axios from 'axios';
import { MapPin, CheckCircle2, AlertCircle, Clock, Truck } from 'lucide-react';
import { BASE_URL } from '../services/api';

export default function PincodeChecker({ onPincodeVerified }) {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const checkPincode = async (e) => {
    e?.preventDefault();
    setError(null);
    setResult(null);

    const cleanPincode = pincode.trim();
    if (!/^[1-9][0-9]{5}$/.test(cleanPincode)) {
      setError('Please enter a valid 6-digit Indian postal code.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/api/shipping/pincode/${cleanPincode}`);
      if (data.success && data.serviceable) {
        setResult(data);
        if (onPincodeVerified) onPincodeVerified(data);
      } else {
        setError(data.message || 'Delivery is currently not available for this pincode.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not verify delivery pincode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-[#faf8f5] p-4 text-[#1c2922]">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#607552]">
        <Truck className="h-4 w-4" /> Delivery &amp; Serviceability
      </div>

      <form onSubmit={checkPincode} className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit Pincode (e.g. 713301)"
            className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-[#607552] focus:outline-none focus:ring-1 focus:ring-[#607552]"
          />
        </div>
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="rounded-lg bg-[#0b2419] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#153e2c] disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {error && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-3 space-y-1.5 border-t border-stone-200 pt-2.5 text-xs text-stone-700">
          <div className="flex items-center gap-1.5 font-medium text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Delivery available to {result.pincode}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-stone-500" />
            <span>Estimated Delivery: <strong>{result.estimated_delivery}</strong> ({result.estimated_days})</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Cash on Delivery {result.cod_available ? 'Available' : 'Unavailable'} • Free delivery on orders above ₹{result.free_delivery_above}
          </p>
        </div>
      )}
    </div>
  );
}
