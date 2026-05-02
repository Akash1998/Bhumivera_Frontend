// anritvox-frontend/src/pages/admin/TaxManagement.jsx
import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';

export default function TaxManagement() {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTax, setCurrentTax] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    region: '',
    is_active: 1
  });

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tax');
      setTaxes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching tax rules:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (tax = null) => {
    if (tax) {
      setCurrentTax(tax);
      setFormData({ name: tax.name, rate: tax.rate, region: tax.region, is_active: tax.is_active });
    } else {
      setCurrentTax(null);
      setFormData({ name: '', rate: '', region: '', is_active: 1 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentTax) {
        await api.put(`/api/tax/${currentTax.id}`, formData);
      } else {
        await api.post('/api/tax', formData);
      }
      setIsModalOpen(false);
      fetchTaxes();
    } catch (error) {
      console.error("Error saving tax rule:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tax rule?')) {
      try {
        await api.delete(`/api/tax/${id}`);
        fetchTaxes();
      } catch (error) {
        console.error("Error deleting tax rule:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Receipt className="text-emerald-500" /> Taxation Logic
          </h2>
          <p className="text-slate-400 text-sm mt-1">Configure global and regional tax rates (GST, VAT, etc.).</p>
        </div>
        <button onClick={() => openModal()} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all">
          <Plus size={18} /> Add Tax Rule
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-slate-900 text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Rule Name</th>
                <th className="px-6 py-4">Rate (%)</th>
                <th className="px-6 py-4">Applied Region</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
              ) : taxes.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No tax rules configured.</td></tr>
              ) : (
                taxes.map((tax) => (
                  <tr key={tax.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-bold text-white">{tax.name}</td>
                    <td className="px-6 py-4 font-mono text-emerald-400 font-bold">{parseFloat(tax.rate).toFixed(2)}%</td>
                    <td className="px-6 py-4">{tax.region}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${tax.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        {tax.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openModal(tax)} className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(tax.id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors ml-2"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
            <h3 className="text-xl font-bold text-white mb-6">{currentTax ? 'Edit Tax Rule' : 'New Tax Rule'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Tax Name</label>
                <input type="text" required placeholder="e.g. IGST 18%" className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Rate (%)</label>
                <input type="number" required step="0.01" min="0" placeholder="18.00" className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none font-mono" value={formData.rate} onChange={(e) => setFormData({...formData, rate: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Region</label>
                <input type="text" required placeholder="e.g. West Bengal, National" className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" checked={!!formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked ? 1 : 0})} className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500" />
                  Enable this tax rule
                </label>
              </div>
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition-all mt-6">
                {currentTax ? 'Update Rule' : 'Create Rule'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
