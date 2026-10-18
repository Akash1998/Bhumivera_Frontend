import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addresses as addressesApi } from '../services/api';
import { MapPin, Plus, Edit2, Trash2, Star, Home, Building, Map, X, CheckCircle2, Navigation, ExternalLink, Copy, Check, Sparkles } from 'lucide-react';

const defaultForm = { 
  label: 'Home', 
  fullName: '', 
  phone: '', 
  addressLine1: '', 
  addressLine2: '', 
  city: '', 
  state: '', 
  pincode: '', 
  country: 'India', 
  isDefault: false,
  latitude: null,
  longitude: null,
  google_maps_url: ''
};

export default function AddressBook() {
  const { user } = useAuth();
  const toast = useToast();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');

  useEffect(() => { 
    fetchAddresses(); 
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await addressesApi.getAll();
      const list = res.data.addresses || res.data.data || res.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setAddresses(list);
      } else {
        const localSaved = JSON.parse(localStorage.getItem('bhumivera_guest_addresses') || '[]');
        setAddresses(localSaved);
      }
    } catch (e) {
      const localSaved = JSON.parse(localStorage.getItem('bhumivera_guest_addresses') || '[]');
      setAddresses(localSaved);
    }
    setLoading(false);
  };

  const handleDetectLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser. Please enter your address details manually.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(7));
        const lng = Number(position.coords.longitude.toFixed(7));
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        const updatedFields = {
          latitude: lat,
          longitude: lng,
          google_maps_url: mapsUrl
        };

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { 'Accept': 'application/json' }
          });
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const street = addr.road || addr.suburb || addr.neighbourhood || addr.residential || '';
            const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || '';
            const state = addr.state || '';
            const pincode = addr.postcode || '';

            if (street && !form.addressLine1) updatedFields.addressLine1 = street;
            if (city) updatedFields.city = city;
            if (state) updatedFields.state = state;
            if (pincode) updatedFields.pincode = pincode;
          }
        } catch (geoErr) {
          console.warn('Reverse geocoding network notice (non-blocking):', geoErr);
        }

        setForm(prev => ({
          ...prev,
          ...updatedFields
        }));
        setLocating(false);
        toast.success('Exact GPS delivery coordinates pinned!');
      },
      (error) => {
        setLocating(false);
        console.warn('Geolocation error:', error);
        if (error.code === 1) {
          toast.error('Location permission was denied. Please enter address manually.');
        } else if (error.code === 3) {
          toast.error('Location request timed out. Please enter address manually.');
        } else {
          toast.error('Unable to fetch precise location. Please enter address manually.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.addressLine1 || !form.city || !form.state || !form.pincode) {
      setMsg('Please fill in all required fields');
      setMsgType('error');
      return;
    }
    setSaving(true);
    setMsg('');

    const payload = {
      label: form.label,
      full_name: form.fullName,
      fullName: form.fullName,
      name: form.fullName,
      phone: form.phone,
      phone_number: form.phone,
      street_address: form.addressLine1,
      address_line1: form.addressLine1,
      addressLine1: form.addressLine1,
      line1: form.addressLine1,
      address: form.addressLine1,
      street_address2: form.addressLine2,
      address_line2: form.addressLine2,
      addressLine2: form.addressLine2,
      line2: form.addressLine2,
      city: form.city,
      state: form.state,
      postal_code: form.pincode,
      pincode: form.pincode,
      zip: form.pincode,
      country: form.country,
      is_default: form.isDefault,
      isDefault: form.isDefault,
      latitude: form.latitude || undefined,
      longitude: form.longitude || undefined,
      google_maps_url: form.google_maps_url || (form.latitude && form.longitude ? `https://www.google.com/maps?q=${form.latitude},${form.longitude}` : undefined)
    };

    try {
      if (editId) {
        await addressesApi.update(editId, payload);
        setAddresses(prev => prev.map(a => (a.id === editId || a._id === editId) ? { ...a, ...payload } : a));
        setMsg('Address updated successfully');
      } else {
        const res = await addressesApi.create(payload);
        const created = res.data.address || res.data.data || res.data;
        if (created && (created.id || created._id)) {
          setAddresses(prev => [created, ...prev]);
        } else {
          setAddresses(prev => [{ ...payload, id: Date.now() }, ...prev]);
        }
        setMsg('Address added successfully');
      }
      setMsgType('success');
      setShowForm(false);
      setForm(defaultForm);
      setEditId(null);
    } catch (err) {
      const localAddresses = JSON.parse(localStorage.getItem('bhumivera_guest_addresses') || '[]');
      if (editId) {
        const updated = localAddresses.map(a => (a.id === editId) ? { ...a, ...payload } : a);
        localStorage.setItem('bhumivera_guest_addresses', JSON.stringify(updated));
        setAddresses(updated);
        setMsg('Address updated locally');
      } else {
        const newAddr = { ...payload, id: Date.now() };
        const updated = [newAddr, ...localAddresses];
        localStorage.setItem('bhumivera_guest_addresses', JSON.stringify(updated));
        setAddresses(updated);
        setMsg('Address added locally');
      }
      setMsgType('success');
      setShowForm(false);
      setForm(defaultForm);
      setEditId(null);
    }
    setSaving(false);
  };

  const setDefault = async (id) => {
    try {
      await addressesApi.setDefault(id);
      setAddresses(prev => prev.map(a => ({
        ...a,
        isDefault: (a.id === id || a._id === id),
        is_default: (a.id === id || a._id === id)
      })));
      toast.success('Default address updated');
    } catch (e) {
      const localAddresses = JSON.parse(localStorage.getItem('bhumivera_guest_addresses') || '[]');
      const updated = localAddresses.map(a => ({
        ...a,
        isDefault: a.id === id,
        is_default: a.id === id
      }));
      localStorage.setItem('bhumivera_guest_addresses', JSON.stringify(updated));
      setAddresses(updated);
      toast.success('Default address updated');
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to remove this address?')) return;
    try {
      await addressesApi.delete(id);
      setAddresses(prev => prev.filter(a => a.id !== id && a._id !== id));
      toast.success('Address removed');
    } catch (e) {
      const localAddresses = JSON.parse(localStorage.getItem('bhumivera_guest_addresses') || '[]');
      const updated = localAddresses.filter(a => a.id !== id);
      localStorage.setItem('bhumivera_guest_addresses', JSON.stringify(updated));
      setAddresses(updated);
      toast.success('Address removed');
    }
  };

  const startEdit = (addr) => {
    const targetId = addr.id || addr._id;
    setEditId(targetId);
    setForm({ 
      label: addr.label || 'Home', 
      fullName: addr.fullName || addr.full_name || '', 
      phone: addr.phone || addr.phone_number || '', 
      addressLine1: addr.addressLine1 || addr.address_line1 || addr.street_address || addr.line1 || '', 
      addressLine2: addr.addressLine2 || addr.address_line2 || '', 
      city: addr.city || '', 
      state: addr.state || '', 
      pincode: addr.pincode || addr.postal_code || '', 
      country: addr.country || 'India', 
      isDefault: addr.isDefault || addr.is_default || false,
      latitude: addr.latitude || null,
      longitude: addr.longitude || null,
      google_maps_url: addr.google_maps_url || (addr.latitude && addr.longitude ? `https://www.google.com/maps?q=${addr.latitude},${addr.longitude}` : '')
    });
    setShowForm(true);
  };

  const LabelIcon = ({ label }) => {
    const l = (label || 'Home').toLowerCase();
    if (l === 'work') return <Building size={14} className="mr-1 text-[#fce096]" />;
    if (l === 'other') return <Map size={14} className="mr-1 text-[#fce096]" />;
    return <Home size={14} className="mr-1 text-[#fce096]" />;
  };

  return (
    <div className="min-h-screen bg-[#070a0e] text-[#e2e8f0] py-16 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4 border-b border-[#d4af37]/20 pb-6">
          <div>
            <span className="font-sub-gold text-[10px] uppercase tracking-[0.24em] font-semibold block">
              Saved Locations &amp; Logistics
            </span>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center shadow-sm">
                <MapPin size={20} />
              </div>
              <h1 className="text-3xl font-serif">
                <span className="font-headline-gold">Address</span>{' '}
                <span className="font-headline-silver">Book</span>
              </h1>
            </div>
            <p className="text-xs text-[#cbd5e1] mt-2">Manage your verified delivery locations and pinpoint GPS spots</p>
          </div>
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('bhumivera:open-visual-guide', { detail: { tab: 'location' } }))}
              className="btn-silver-luxury inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles size={14} className="text-[#d4af37]" /> Map Guide
            </button>
            <button
              onClick={() => { setForm(defaultForm); setEditId(null); setShowForm(true); }}
              className="btn-gold-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider"
            >
              <Plus size={15} /> Add New Address
            </button>
          </div>
        </div>

        {msg && (
          <div className={`mb-6 p-4 rounded-xl border text-xs font-medium flex items-center gap-2.5 ${
            msgType === 'success'
              ? 'bg-[#d4af37]/10 border-[#d4af37]/35 text-[#fce096]'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {msgType === 'success' ? <CheckCircle2 size={16} className="text-[#d4af37]" /> : <X size={16} />}
            {msg}
          </div>
        )}

        {showForm && (
          <div className="mb-8 two-tone-panel-gold rounded-2xl p-6 sm:p-7 shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#d4af37]/20">
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Edit2 size={18} className="text-[#d4af37]" />
                <span className="font-headline-gold">{editId ? 'Update' : 'Add New'}</span>{' '}
                <span className="font-headline-silver">Address</span>
              </h2>
              <button
                onClick={() => { setShowForm(false); setEditId(null); }}
                className="w-8 h-8 rounded-lg hover:bg-white/10 text-[#cbd5e1] flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 bg-[#070a0e]/70 border border-[#d4af37]/25 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Navigation className="text-[#d4af37] w-4 h-4" />
                    <span className="text-sm font-semibold text-white">Exact Delivery Spot Pinpointer</span>
                    {form.latitude && form.longitude && (
                      <span className="bg-[#d4af37]/20 text-[#fce096] border border-[#d4af37]/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        GPS Attached
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#cbd5e1] mt-1.5 leading-relaxed">
                    {form.latitude && form.longitude ? (
                      <>
                        Coordinates: <span className="font-mono text-[#fce096] font-semibold">{form.latitude}, {form.longitude}</span> &bull;{' '}
                        <a
                          href={form.google_maps_url || `https://www.google.com/maps?q=${form.latitude},${form.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#d4af37] underline font-medium hover:text-[#fce096] inline-flex items-center gap-1"
                        >
                          Preview on Google Maps <ExternalLink size={11} />
                        </a>
                      </>
                    ) : (
                      'Pin your exact location so couriers navigate straight to your doorstep without landmark confusion.'
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={locating}
                  className="btn-silver-luxury inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap"
                >
                  <Navigation size={13} className={locating ? 'animate-spin text-[#d4af37]' : 'text-[#d4af37]'} />
                  {locating ? 'Detecting GPS...' : form.latitude ? 'Re-pin Current Location' : 'Use Current Location'}
                </button>
              </div>

              <div>
                <label className="text-xs font-medium text-[#cbd5e1] mb-1.5 block uppercase tracking-wider">Label</label>
                <select
                  value={form.label}
                  onChange={e => setForm({...form, label: e.target.value})}
                  className="w-full bg-[#070a0e] border border-[#d4af37]/25 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                >
                  <option value="Home" className="bg-[#0d1520] text-white">Home</option>
                  <option value="Work" className="bg-[#0d1520] text-white">Work</option>
                  <option value="Other" className="bg-[#0d1520] text-white">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#cbd5e1] mb-1.5 block uppercase tracking-wider">Full Name *</label>
                <input
                  value={form.fullName}
                  onChange={e => setForm({...form, fullName: e.target.value})}
                  required
                  className="w-full bg-[#070a0e] border border-[#d4af37]/25 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-[#cbd5e1] mb-1.5 block uppercase tracking-wider">Phone Number *</label>
                <input
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#070a0e] border border-[#d4af37]/25 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-[#cbd5e1] mb-1.5 block uppercase tracking-wider">Street Address *</label>
                <input
                  value={form.addressLine1}
                  onChange={e => setForm({...form, addressLine1: e.target.value})}
                  required
                  placeholder="House / Flat no, Building, Street, Locality"
                  className="w-full bg-[#070a0e] border border-[#d4af37]/25 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-[#cbd5e1] mb-1.5 block uppercase tracking-wider">Address Line 2 (Optional)</label>
                <input
                  value={form.addressLine2}
                  onChange={e => setForm({...form, addressLine2: e.target.value})}
                  placeholder="Landmark, Nearby place, etc."
                  className="w-full bg-[#070a0e] border border-[#d4af37]/25 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#cbd5e1] mb-1.5 block uppercase tracking-wider">City *</label>
                <input
                  value={form.city}
                  onChange={e => setForm({...form, city: e.target.value})}
                  required
                  className="w-full bg-[#070a0e] border border-[#d4af37]/25 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#cbd5e1] mb-1.5 block uppercase tracking-wider">State *</label>
                <input
                  value={form.state}
                  onChange={e => setForm({...form, state: e.target.value})}
                  required
                  className="w-full bg-[#070a0e] border border-[#d4af37]/25 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#cbd5e1] mb-1.5 block uppercase tracking-wider">PIN Code *</label>
                <input
                  value={form.pincode}
                  onChange={e => setForm({...form, pincode: e.target.value})}
                  required
                  placeholder="e.g. 110001"
                  className="w-full bg-[#070a0e] border border-[#d4af37]/25 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#cbd5e1] mb-1.5 block uppercase tracking-wider">Country</label>
                <input
                  value={form.country}
                  onChange={e => setForm({...form, country: e.target.value})}
                  className="w-full bg-[#070a0e] border border-[#d4af37]/25 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                />
              </div>
              <div className="flex items-center gap-3 sm:col-span-2 mt-2 bg-[#070a0e]/60 p-3.5 rounded-xl border border-[#d4af37]/20">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={form.isDefault}
                  onChange={e => setForm({...form, isDefault: e.target.checked})}
                  className="w-4 h-4 accent-[#d4af37] rounded"
                />
                <label htmlFor="isDefault" className="text-sm text-[#cbd5e1] flex items-center gap-2 cursor-pointer">
                  <Star size={14} className="text-[#d4af37]" />
                  Set as my primary default shipping address
                </label>
              </div>
              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 mt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold-luxury px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editId ? 'Update Address' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditId(null); }}
                  className="btn-silver-luxury px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-[#cbd5e1] two-tone-panel rounded-2xl">
            Loading your saved addresses...
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-16 two-tone-panel rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center">
              <MapPin size={28} />
            </div>
            <p className="font-serif text-lg font-bold text-white">No addresses saved yet</p>
            <p className="text-xs text-[#cbd5e1] mt-1 mb-5">Add an address to make checkout faster next time</p>
            <button
              onClick={() => { setForm(defaultForm); setShowForm(true); }}
              className="btn-gold-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider"
            >
              <Plus size={16} /> Add your first address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map(addr => {
              const addrId = addr.id || addr._id;
              const isDefault = addr.isDefault || addr.is_default;
              const fullName = addr.fullName || addr.full_name;
              const addressLine1 = addr.addressLine1 || addr.address_line1 || addr.street_address || addr.line1;
              const addressLine2 = addr.addressLine2 || addr.address_line2;

              return (
                <div
                  key={addrId}
                  className={`two-tone-card rounded-2xl p-5 relative border transition-all ${isDefault ? 'border-[#d4af37]' : 'border-[#d4af37]/20 hover:border-[#d4af37]/40'}`}
                >
                  {isDefault && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#d4af37] to-[#b38728] text-[#070a0e] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Star size={10} /> Default
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#070a0e] text-[#fce096] font-medium border border-[#d4af37]/30 flex items-center">
                      <LabelIcon label={addr.label} />
                      {addr.label || 'Home'}
                    </span>
                  </div>
                  <p className="font-serif font-bold text-white text-base">{fullName}</p>
                  <p className="text-xs text-[#94a3b8] mt-0.5 font-mono">{addr.phone || addr.phone_number}</p>
                  <p className="text-sm text-[#cbd5e1] mt-2.5 leading-relaxed font-light">
                    {addressLine1}{addressLine2 ? ', ' + addressLine2 : ''}
                  </p>
                  <p className="text-sm text-[#cbd5e1] font-light">{addr.city}, {addr.state} &mdash; <span className="font-mono text-[#fce096]">{addr.pincode || addr.postal_code}</span></p>
                  <p className="text-xs text-[#94a3b8] mb-3">{addr.country || 'India'}</p>

                  {/* Google Maps Pin & Courier Share */}
                  {(() => {
                    const mapsUrl = addr.google_maps_url || (addr.latitude && addr.longitude ? `https://www.google.com/maps?q=${addr.latitude},${addr.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([addressLine1, addressLine2, addr.city, addr.state, addr.pincode || addr.postal_code, addr.country || 'India'].filter(Boolean).join(', '))}`);
                    const hasExactGps = !!(addr.latitude && addr.longitude);

                    return (
                      <div className="mb-3 pt-3 border-t border-[#d4af37]/15 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className={hasExactGps ? "text-[#d4af37]" : "text-[#94a3b8]"} />
                          <span className={hasExactGps ? "font-semibold text-[#fce096]" : "text-[#94a3b8]"}>
                            {hasExactGps ? "GPS Pinpoint Verified" : "Google Maps Link Ready"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#cbd5e1] hover:text-[#fce096] font-medium transition-colors"
                          >
                            View Map <ExternalLink size={12} />
                          </a>
                          <span className="text-[#94a3b8]/40">|</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(mapsUrl);
                              setCopiedId(addrId);
                              toast.success('Google Maps delivery link copied!');
                              setTimeout(() => setCopiedId(null), 2000);
                            }}
                            className="inline-flex items-center gap-1 text-[#cbd5e1] hover:text-[#fce096] font-medium transition-colors"
                          >
                            {copiedId === addrId ? (
                              <>
                                <Check size={12} className="text-[#d4af37]" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={12} /> Copy Map Link
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex items-center gap-3 pt-3 border-t border-[#d4af37]/15">
                    {!isDefault && (
                      <button
                        onClick={() => setDefault(addrId)}
                        className="text-xs font-semibold text-[#d4af37] hover:text-[#fce096] transition-colors flex items-center gap-1 uppercase tracking-wider"
                      >
                        <Star size={13} /> Set Default
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(addr)}
                      className="text-xs font-semibold text-[#cbd5e1] hover:text-white transition-colors flex items-center gap-1 ml-auto uppercase tracking-wider"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => deleteAddress(addrId)}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 uppercase tracking-wider"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
