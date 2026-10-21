import React, { useState, useEffect, useMemo } from 'react';
import {
  Truck,
  Search,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  X,
  ShieldCheck,
  Save,
  Download,
  Calculator,
  Package,
  Clock,
} from 'lucide-react';
import api from '../../services/api';

export default function ShippingManagement() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentZone, setCurrentZone] = useState(null);
  const [formData, setFormData] = useState({ name: '', regions: '', base_charge: '', is_active: 1 });
  const [carriers, setCarriers] = useState([]);
  const [carrierProvider, setCarrierProvider] = useState('shiprocket');
  const [carrierForm, setCarrierForm] = useState({ enabled: true });
  const [carrierBusy, setCarrierBusy] = useState(false);
  const [carrierMessage, setCarrierMessage] = useState('');
  const [carrierError, setCarrierError] = useState('');

  // Volumetric & Rate Simulator state
  const [simLength, setSimLength] = useState(22);
  const [simWidth, setSimWidth] = useState(16);
  const [simHeight, setSimHeight] = useState(12);
  const [simDeadWeightKg, setSimDeadWeightKg] = useState(0.75);
  const [simOrderValue, setSimOrderValue] = useState(699);

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    api
      .get('/shipping/carriers')
      .then(response => setCarriers(Array.isArray(response.data) ? response.data : []))
      .catch(error => setCarrierError(error.response?.data?.message || 'Could not load carrier integrations.'));
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await api.get('/shipping/zones');
      setZones(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (zone = null) => {
    if (zone) {
      setCurrentZone(zone);
      setFormData({
        name: zone.name,
        regions: zone.regions,
        base_charge: zone.base_charge,
        is_active: zone.is_active ?? 1,
      });
    } else {
      setCurrentZone(null);
      setFormData({ name: '', regions: '', base_charge: '', is_active: 1 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      if (currentZone) await api.put(`/shipping/zones/${currentZone.id}`, formData);
      else await api.post('/shipping/zones', formData);
      setIsModalOpen(false);
      fetchZones();
    } catch {
      alert('Failed to save shipping zone.');
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this zone?')) {
      try {
        await api.delete(`/shipping/zones/${id}`);
        fetchZones();
      } catch (e) {
        console.error('Delete error:', e);
      }
    }
  };

  const saveCarrier = async event => {
    event.preventDefault();
    setCarrierBusy(true);
    setCarrierMessage('');
    setCarrierError('');
    try {
      const response = await api.put(`/shipping/carriers/${carrierProvider}`, carrierForm);
      setCarrierMessage(response.data?.message || 'Carrier connected and credentials encrypted.');
      setCarrierForm({ enabled: true });
      const carriersResponse = await api.get('/shipping/carriers');
      setCarriers(Array.isArray(carriersResponse.data) ? carriersResponse.data : []);
    } catch (saveError) {
      setCarrierError(saveError.response?.data?.message || 'Could not connect this carrier.');
    } finally {
      setCarrierBusy(false);
    }
  };

  const filteredZones = useMemo(
    () =>
      zones.filter(
        z =>
          String(z.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(z.regions || '').toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [zones, searchTerm]
  );

  const volumetricCalc = useMemo(() => {
    const volKg = Number(((simLength * simWidth * simHeight) / 5000).toFixed(2));
    const billableKg = Math.max(volKg, Number(simDeadWeightKg || 0));
    const slabs = Math.max(1, Math.ceil(billableKg / 0.5));
    const estCarrierCostInr = 42 + (slabs - 1) * 24;
    const customerShippingFee = simOrderValue >= 500 ? 0 : 60;
    return { volKg, billableKg, slabs, estCarrierCostInr, customerShippingFee };
  }, [simLength, simWidth, simHeight, simDeadWeightKg, simOrderValue]);

  const handleExportZonesCsv = () => {
    const headers = [
      'Zone ID',
      'Zone Name',
      'Regions Covered',
      'Region Count',
      'Base Charge (INR)',
      'Free Shipping Threshold (INR)',
      'Est. SLA Window',
      'Status',
    ];
    const escapeCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filteredZones.map(z => {
      const regionCount = String(z.regions || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean).length;
      return [
        z.id,
        z.name,
        z.regions,
        regionCount,
        Number(z.base_charge || 0).toFixed(2),
        '500.00',
        '2–5 Business Days',
        Number(z.is_active ?? 1) === 1 ? 'Active' : 'Inactive',
      ]
        .map(escapeCell)
        .join(',');
    });
    const csv = `\uFEFF${headers.map(escapeCell).join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhumivera-shipping-zones-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Truck className="text-emerald-500" /> Shipping Zones &amp; Carrier & Fulfilment Logistics
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage delivery regions, encrypted carrier APIs, volumetric weight slabs, and base shipping charges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportZonesCsv}
            className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-200 font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs transition-all"
          >
            <Download size={15} /> Export Zones CSV
          </button>
          <button
            onClick={() => openModal()}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
          >
            <Plus size={18} /> Add Zone
          </button>
        </div>
      </div>

      <section className="bg-[#10241f]/55 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={19} /> Carrier API connections
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Credentials are encrypted by the backend and never sent back to this page. A server-side
            CARRIER_CREDENTIALS_KEY is required.
          </p>
        </div>
        {carrierError && (
          <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
            {carrierError}
          </p>
        )}
        {carrierMessage && (
          <p
            role="status"
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200"
          >
            {carrierMessage}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          {['shiprocket', 'delhivery', 'bluedart'].map(provider => {
            const status = carriers.find(item => item.provider === provider);
            return (
              <button
                key={provider}
                type="button"
                onClick={() => {
                  setCarrierProvider(provider);
                  setCarrierForm({ enabled: true });
                  setCarrierError('');
                  setCarrierMessage('');
                }}
                className={`rounded-xl border p-4 text-left capitalize ${
                  carrierProvider === provider
                    ? 'border-emerald-400 bg-emerald-500/10 text-white'
                    : 'border-slate-800 text-slate-300'
                }`}
              >
                <span className="font-bold">{provider === 'bluedart' ? 'Blue Dart' : provider}</span>
                <span className={`mt-1 block text-xs ${status?.enabled ? 'text-emerald-300' : 'text-slate-500'}`}>
                  {status?.enabled ? 'Connected' : 'Not connected'}
                </span>
              </button>
            );
          })}
        </div>
        {carrierProvider === 'bluedart' ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            Direct Blue Dart booking is deliberately not enabled yet: Blue Dart APIs use account-specific products and
            shipment schemas that could not be verified from public documentation. You can continue entering AWB and
            courier manually in order details. Do not enter credentials until its API documentation is confirmed.
          </div>
        ) : (
          <form onSubmit={saveCarrier} className="grid gap-4 sm:grid-cols-2">
            {(carrierProvider === 'shiprocket'
              ? [
                  ['email', 'API account email', 'email'],
                  ['password', 'API password', 'password'],
                  ['pickup_location', 'Pickup location name in Shiprocket', 'text'],
                  ['pickup_name', 'Pickup contact / seller name', 'text'],
                  ['pickup_address', 'Pickup address', 'text'],
                  ['pickup_city', 'Pickup city', 'text'],
                  ['pickup_state', 'Pickup state', 'text'],
                  ['pickup_pincode', 'Pickup pincode', 'text'],
                  ['pickup_phone', 'Pickup phone', 'tel'],
                ]
              : [
                  ['api_token', 'Delhivery API token', 'password'],
                  ['client_name', 'Delhivery client name', 'text'],
                  ['pickup_name', 'Pickup contact / seller name', 'text'],
                  ['pickup_address', 'Pickup address', 'text'],
                  ['pickup_city', 'Pickup city', 'text'],
                  ['pickup_state', 'Pickup state', 'text'],
                  ['pickup_pincode', 'Pickup pincode', 'text'],
                  ['pickup_phone', 'Pickup phone', 'tel'],
                ]
            ).map(([key, label, type]) => (
              <label key={key}>
                <span className="mb-1 block text-xs font-semibold text-slate-400">{label}</span>
                <input
                  required
                  type={type}
                  autoComplete="off"
                  value={carrierForm[key] || ''}
                  onChange={event => setCarrierForm(current => ({ ...current, [key]: event.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                />
              </label>
            ))}
            <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={carrierForm.enabled !== false}
                onChange={event => setCarrierForm(current => ({ ...current, enabled: event.target.checked }))}
              />
              Enable for label booking
            </label>
            <div className="sm:col-span-2">
              <button
                disabled={carrierBusy}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-bold text-slate-950 disabled:opacity-50"
              >
                <Save size={16} /> {carrierBusy ? 'Checking & saving…' : 'Test and securely save'}
              </button>
              <p className="mt-2 text-xs text-slate-500">
                A successful credential test is required before credentials are saved. API secrets are encrypted at
                rest.
              </p>
            </div>
          </form>
        )}
      </section>

      {/* Volumetric Weight & Freight Margin Calculator */}
      <section className="bg-[#10241f]/55 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calculator size={16} className="text-[#d4af37]" />
            Volumetric Weight &amp; Carrier Freight Slab Simulator (L × W × H ÷ 5000)
          </h3>
          <span className="text-xs font-mono text-emerald-300">
            Billable Weight: {volumetricCalc.billableKg} kg ({volumetricCalc.slabs} × 500g slabs)
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <label className="text-slate-400">
            Length (cm)
            <input
              type="number"
              min="1"
              value={simLength}
              onChange={e => setSimLength(Number(e.target.value) || 1)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-white font-mono"
            />
          </label>
          <label className="text-slate-400">
            Width (cm)
            <input
              type="number"
              min="1"
              value={simWidth}
              onChange={e => setSimWidth(Number(e.target.value) || 1)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-white font-mono"
            />
          </label>
          <label className="text-slate-400">
            Height (cm)
            <input
              type="number"
              min="1"
              value={simHeight}
              onChange={e => setSimHeight(Number(e.target.value) || 1)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-white font-mono"
            />
          </label>
          <label className="text-slate-400">
            Dead Weight (kg)
            <input
              type="number"
              step="0.05"
              min="0.05"
              value={simDeadWeightKg}
              onChange={e => setSimDeadWeightKg(Number(e.target.value) || 0.1)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-white font-mono"
            />
          </label>
          <label className="text-slate-400">
            Order Subtotal (₹)
            <input
              type="number"
              min="0"
              value={simOrderValue}
              onChange={e => setSimOrderValue(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-white font-mono"
            />
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl bg-black/30 border border-white/10 p-3">
            <span className="text-slate-400 block">Volumetric Weight</span>
            <strong className="text-white font-mono">{volumetricCalc.volKg} kg</strong>
          </div>
          <div className="rounded-xl bg-black/30 border border-white/10 p-3">
            <span className="text-slate-400 block">Est. Carrier Forward Freight</span>
            <strong className="text-amber-300 font-mono">₹{volumetricCalc.estCarrierCostInr}</strong>
          </div>
          <div className="rounded-xl bg-black/30 border border-white/10 p-3">
            <span className="text-slate-400 block">Customer Shipping Charge</span>
            <strong className="text-emerald-300 font-mono">
              {volumetricCalc.customerShippingFee === 0
                ? 'FREE (Order ≥ ₹500)'
                : `₹${volumetricCalc.customerShippingFee}`}
            </strong>
          </div>
        </div>
      </section>

      <div className="bg-[#10241f]/55 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Configured Zones (Expanded 8-Column View)</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 text-sm text-white rounded-lg pl-9 pr-4 py-2 focus:border-emerald-500 focus:outline-none w-64"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-[#10241f]/85 backdrop-blur-xl text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Zone Name</th>
                <th className="px-5 py-4">Regions Covered</th>
                <th className="px-5 py-4">States / Pin Count</th>
                <th className="px-5 py-4">Base Charge (₹)</th>
                <th className="px-5 py-4">Free Ship Above</th>
                <th className="px-5 py-4">Est. Transit SLA</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : filteredZones.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-500">
                    No zones found.
                  </td>
                </tr>
              ) : (
                filteredZones.map(z => {
                  const regionItems = String(z.regions || '')
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);
                  return (
                    <tr key={z.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">#{z.id}</td>
                      <td className="px-5 py-4 font-bold text-white">{z.name}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-emerald-500 shrink-0" />
                          <span className="truncate max-w-xs">{z.regions}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-300">{regionItems.length} regions</td>
                      <td className="px-5 py-4 font-mono text-emerald-400 font-bold">
                        ₹{parseFloat(z.base_charge || 0).toFixed(2)}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-[#d4af37]">₹500.00</td>
                      <td className="px-5 py-4 text-xs text-slate-300">
                        <Clock size={12} className="inline mr-1 text-cyan-400" />
                        2–5 Days
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => openModal(z)}
                          className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(z.id)}
                          className="p-2 text-slate-400 hover:text-rose-400 transition-colors ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#081b15]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#10241f]/85 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">{currentZone ? 'Edit Zone' : 'Add Zone'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Zone Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 text-white rounded-lg px-4 py-2 focus:border-emerald-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Regions (Comma separated)</label>
                <textarea
                  required
                  rows="3"
                  className="w-full bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 text-white rounded-lg px-4 py-2 focus:border-emerald-500 outline-none resize-none"
                  value={formData.regions}
                  onChange={e => setFormData({ ...formData, regions: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Base Charge (₹)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  className="w-full bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 text-white rounded-lg px-4 py-2 focus:border-emerald-500 outline-none font-mono"
                  value={formData.base_charge}
                  onChange={e => setFormData({ ...formData, base_charge: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition-all"
              >
                {currentZone ? 'Update Zone' : 'Create Zone'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
