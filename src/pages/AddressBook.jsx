import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { addresses as addressesApi } from '../services/api';
import { MapPin, Plus, Edit2, Trash2, Star, Home, Building, Map, X, CheckCircle2 } from 'lucide-react';

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
  isDefault: false 
};

export default function AddressBook() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');

  useEffect(() => { 
    fetchAddresses(); 
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await addressesApi.getAll();
      setAddresses(res.data.addresses || res.data.data || res.data || []);
    } catch (e) { 
      console.error("Failed to fetch addresses:", e); 
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      ...form,
      full_name: form.fullName,
      line1: form.addressLine1,
      street_address: form.addressLine1,
      address_line1: form.addressLine1,
      address_line2: form.addressLine2,
      phone_number: form.phone,
      postal_code: form.pincode,
      is_default: form.isDefault
    };

    try {
      if (editId) {
        await addressesApi.update(editId, payload);
        setMsg('Address updated successfully!');
      } else {
        await addressesApi.create(payload);
        setMsg('Address added successfully!');
      }
      setMsgType('success');
      setShowForm(false);
      setEditId(null);
      setForm(defaultForm);
      fetchAddresses();
    } catch (err) { 
      setMsg('Failed to save address. Please try again.'); 
      setMsgType('error');
      console.error(err);
    }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const deleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressesApi.delete(id);
      setMsg('Address deleted');
      setMsgType('success');
      fetchAddresses();
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      console.error("Failed to delete address", err);
      setMsg('Failed to delete address');
      setMsgType('error');
    }
  };

  const setDefault = async (id) => {
    try {
      await addressesApi.setDefault(id);
      fetchAddresses();
    } catch (err) {
      console.error("Failed to set default address", err);
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
      isDefault: addr.isDefault || addr.is_default || false 
    });
    setShowForm(true);
  };

  const LabelIcon = ({ label }) => {
    const l = (label || 'Home').toLowerCase();
    if (l === 'work') return <Building size={14} className="mr-1" />;
    if (l === 'other') return <Map size={14} className="mr-1" />;
    return <Home size={14} className="mr-1" />;
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B2419] text-[#D4AF37] flex items-center justify-center shadow-sm">
              <MapPin size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0B2419]">Address Book</h1>
              <p className="text-sm text-[#8B9D83]">Manage your saved shipping addresses</p>
            </div>
          </div>
          <button onClick={() => { setForm(defaultForm); setEditId(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B2419] hover:bg-[#2C3E2D] text-[#FDFBF7] rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md self-start sm:self-auto">
            <Plus size={16} /> Add New Address
          </button>
        </div>

        {msg && (
          <div className={`mb-5 p-3 rounded-xl border text-sm flex items-center gap-2 ${
            msgType === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {msgType === 'success' ? <CheckCircle2 size={16} /> : <X size={16} />}
            {msg}
          </div>
        )}

        {showForm && (
          <div className="mb-6 bg-white border border-[#8B9D83]/20 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-[#0B2419] flex items-center gap-2">
                <Edit2 size={18} className="text-[#D4AF37]" />
                {editId ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditId(null); }}
                className="w-8 h-8 rounded-lg hover:bg-[#FDFBF7] text-[#8B9D83] flex items-center justify-center transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#2C3E2D] mb-1.5 block">Label</label>
                <select value={form.label} onChange={e => setForm({...form, label: e.target.value})}
                  className="w-full bg-[#FDFBF7] border border-[#8B9D83]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-[#0B2419]">
                  <option>Home</option><option>Work</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#2C3E2D] mb-1.5 block">Full Name *</label>
                <input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required
                  className="w-full bg-[#FDFBF7] border border-[#8B9D83]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-[#0B2419]" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-[#2C3E2D] mb-1.5 block">Phone Number *</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required placeholder="+91 98765 43210"
                  className="w-full bg-[#FDFBF7] border border-[#8B9D83]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-[#0B2419]" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-[#2C3E2D] mb-1.5 block">Street Address *</label>
                <input value={form.addressLine1} onChange={e => setForm({...form, addressLine1: e.target.value})} required placeholder="House no, Street, Locality"
                  className="w-full bg-[#FDFBF7] border border-[#8B9D83]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-[#0B2419]" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-[#2C3E2D] mb-1.5 block">Address Line 2 (Optional)</label>
                <input value={form.addressLine2} onChange={e => setForm({...form, addressLine2: e.target.value})} placeholder="Landmark, Nearby place, etc."
                  className="w-full bg-[#FDFBF7] border border-[#8B9D83]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-[#0B2419]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#2C3E2D] mb-1.5 block">City *</label>
                <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} required
                  className="w-full bg-[#FDFBF7] border border-[#8B9D83]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-[#0B2419]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#2C3E2D] mb-1.5 block">State *</label>
                <input value={form.state} onChange={e => setForm({...form, state: e.target.value})} required
                  className="w-full bg-[#FDFBF7] border border-[#8B9D83]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-[#0B2419]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#2C3E2D] mb-1.5 block">PIN Code *</label>
                <input value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} required placeholder="e.g. 110001"
                  className="w-full bg-[#FDFBF7] border border-[#8B9D83]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-[#0B2419]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#2C3E2D] mb-1.5 block">Country</label>
                <input value={form.country} onChange={e => setForm({...form, country: e.target.value})}
                  className="w-full bg-[#FDFBF7] border border-[#8B9D83]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-[#0B2419]" />
              </div>
              <div className="flex items-center gap-3 sm:col-span-2 mt-2 bg-[#FDFBF7] p-3 rounded-xl border border-[#8B9D83]/20">
                <input type="checkbox" id="isDefault" checked={form.isDefault} onChange={e => setForm({...form, isDefault: e.target.checked})} className="w-4 h-4 accent-[#D4AF37]" />
                <label htmlFor="isDefault" className="text-sm text-[#2C3E2D] flex items-center gap-1.5">
                  <Star size={14} className="text-[#D4AF37]" />
                  Set as my default shipping address
                </label>
              </div>
              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 mt-3">
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#0B2419] hover:bg-[#2C3E2D] text-[#FDFBF7] rounded-xl text-sm font-semibold transition-all disabled:opacity-50 shadow-sm">
                  {saving ? 'Saving...' : editId ? 'Update Address' : 'Save Address'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                  className="px-6 py-2.5 bg-white hover:bg-[#FDFBF7] text-[#2C3E2D] rounded-xl text-sm font-medium transition-colors border border-[#8B9D83]/30">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-[#8B9D83] bg-white rounded-2xl border border-[#8B9D83]/20">
            Loading your saved addresses...
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#8B9D83]/20 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FDFBF7] text-[#8B9D83] flex items-center justify-center">
              <MapPin size={28} />
            </div>
            <p className="font-semibold text-[#0B2419]">No addresses saved yet</p>
            <p className="text-sm text-[#8B9D83] mt-1 mb-4">Add an address to make checkout faster next time</p>
            <button onClick={() => { setForm(defaultForm); setShowForm(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/20 text-[#0B2419] rounded-xl text-sm font-semibold hover:bg-[#D4AF37]/30 transition-colors">
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
                <div key={addrId} className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative ${isDefault ? 'border-[#D4AF37]' : 'border-[#8B9D83]/20'}`}>
                  {isDefault && (
                    <div className="absolute top-3 right-3 bg-[#D4AF37] text-[#0B2419] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                      <Star size={10} /> Default
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#FDFBF7] text-[#2C3E2D] font-medium border border-[#8B9D83]/20 flex items-center">
                      <LabelIcon label={addr.label} />
                      {addr.label || 'Home'}
                    </span>
                  </div>
                  <p className="font-semibold text-[#0B2419] text-base">{fullName}</p>
                  <p className="text-[#8B9D83] text-sm mt-0.5">{addr.phone || addr.phone_number}</p>
                  <p className="text-[#2C3E2D] text-sm mt-2 leading-relaxed">
                    {addressLine1}{addressLine2 ? ', ' + addressLine2 : ''}
                  </p>
                  <p className="text-[#2C3E2D] text-sm">{addr.city}, {addr.state} &mdash; {addr.pincode || addr.postal_code}</p>
                  <p className="text-[#8B9D83] text-sm mb-3">{addr.country || 'India'}</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-[#8B9D83]/10">
                    {!isDefault && (
                      <button onClick={() => setDefault(addrId)} className="text-xs font-medium text-[#D4AF37] hover:text-[#0B2419] transition-colors flex items-center gap-1">
                        <Star size={13} /> Set Default
                      </button>
                    )}
                    <button onClick={() => startEdit(addr)} className="text-xs font-medium text-[#2C3E2D] hover:text-[#0B2419] transition-colors flex items-center gap-1 ml-auto">
                      <Edit2 size={13} /> Edit
                    </button>
                    <button onClick={() => deleteAddress(addrId)} className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-1">
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
