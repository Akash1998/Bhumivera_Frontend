import React, { useCallback, useEffect, useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Clock, Truck } from 'lucide-react';
import { addresses, shipping } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PincodeChecker({ onPincodeVerified, useSavedAddress = false }) {
  const { user, loading: authLoading } = useAuth();
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(useSavedAddress);
  const [savedAddressLabel, setSavedAddressLabel] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const checkPincodeValue = useCallback(async value => {
    setError(null);
    setResult(null);

    const cleanPincode = String(value || '').trim();
    if (!/^[1-9][0-9]{5}$/.test(cleanPincode)) {
      setError('Please enter a valid 6-digit Indian postal code.');
      return false;
    }

    setPincode(cleanPincode);
    setLoading(true);
    try {
      const { data } = await shipping.checkPincode(cleanPincode);
      if (data.success && data.serviceable) {
        setResult(data);
        if (onPincodeVerified) onPincodeVerified(data);
        return true;
      } else {
        setError(data.message || 'Delivery is currently not available for this pincode.');
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not verify delivery pincode.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [onPincodeVerified]);

  useEffect(() => {
    if (!useSavedAddress || authLoading) return undefined;
    if (!user?.id || ['admin', 'superadmin', 'warehouse_admin'].includes(user.role)) {
      setAddressLoading(false);
      return undefined;
    }

    let active = true;
    setAddressLoading(true);
    addresses.getAll()
      .then(({ data }) => {
        if (!active) return;
        const savedAddresses = data?.addresses || data?.data || [];
        const defaultAddress = savedAddresses.find(address => address.is_default || address.default) ||
          savedAddresses[0];
        const savedPincode = String(
          defaultAddress?.postal_code || defaultAddress?.pincode || defaultAddress?.zip || ''
        ).trim();

        if (!defaultAddress || !/^[1-9][0-9]{5}$/.test(savedPincode)) return;
        setPincode(savedPincode);
        setSavedAddressLabel(defaultAddress.label || 'Saved address');
        void checkPincodeValue(savedPincode);
      })
      .catch(loadError => {
        console.error('[PINCODE_SAVED_ADDRESS_LOAD]', loadError);
        if (active) setError('Could not load your saved address. You can enter a pincode to check delivery.');
      })
      .finally(() => {
        if (active) setAddressLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, checkPincodeValue, user?.id, user?.role, useSavedAddress]);

  const checkPincode = event => {
    event.preventDefault();
    setSavedAddressLabel('');
    void checkPincodeValue(pincode);
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
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, ''));
              setSavedAddressLabel('');
            }}
            placeholder="Enter 6-digit Pincode (e.g. 713301)"
            className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-[#607552] focus:outline-none focus:ring-1 focus:ring-[#607552]"
          />
        </div>
        <button
          type="submit"
          disabled={loading || addressLoading || pincode.length !== 6}
          className="rounded-lg bg-[#0b2419] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#153e2c] disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {savedAddressLabel && (
        <p className="mt-2 text-[11px] text-stone-500">
          Checking the pincode from your {savedAddressLabel.toLowerCase()} address.
        </p>
      )}

      {addressLoading && (
        <p className="mt-2 text-[11px] text-stone-500">Loading your saved delivery address...</p>
      )}

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
