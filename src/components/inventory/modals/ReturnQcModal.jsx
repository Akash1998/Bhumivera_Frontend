import React, { useState } from 'react';
import { X, RotateCcw, CheckCircle2, AlertOctagon, Archive, ShieldAlert } from 'lucide-react';
import api from '../../../services/api';

export default function ReturnQcModal({ order, onClose, onQcComplete, reqConfig }) {
  const [selectedGrade, setSelectedGrade] = useState('GRADE_A');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post(
        '/inventory-software/returns/qc-grade',
        {
          orderId: order.id,
          grade: selectedGrade,
          notes: notes.trim() || `Processed as ${selectedGrade}`,
        },
        reqConfig
      );

      if (res.data?.success) {
        if (onQcComplete) onQcComplete(order.id, selectedGrade);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to process return QC inspection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" /> Return & RTO Quality Inspection
              </span>
              <span className="text-xs font-mono text-slate-500">#{order.orderNumber}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Unboxing Condition & Restock Grading
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Return Condition Grade
            </label>

            {/* Grade Options */}
            <div
              onClick={() => setSelectedGrade('GRADE_A')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                selectedGrade === 'GRADE_A'
                  ? 'border-emerald-600 bg-emerald-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-sm">
                A
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="text-xs font-bold text-slate-900">Grade A — Pristine & Factory Sealed</div>
                <div className="text-[11px] text-slate-500">
                  Packaging and outer seal 100% intact. Automatically restocks back into <strong>Sellable Warehouse Vault</strong>.
                </div>
              </div>
            </div>

            <div
              onClick={() => setSelectedGrade('GRADE_B')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                selectedGrade === 'GRADE_B'
                  ? 'border-amber-600 bg-amber-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-sm">
                B
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="text-xs font-bold text-slate-900">Grade B — Box Distressed / Seal Intact</div>
                <div className="text-[11px] text-slate-500">
                  Outer luxury carton crushed by courier, but botanical formulation uncompromised. Restocks into <strong>Offline Shop Display / Clearance</strong>.
                </div>
              </div>
            </div>

            <div
              onClick={() => setSelectedGrade('GRADE_C')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                selectedGrade === 'GRADE_C'
                  ? 'border-rose-600 bg-rose-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold text-sm">
                C
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="text-xs font-bold text-slate-900">Grade C — Damaged / Leaked / Tampered</div>
                <div className="text-[11px] text-slate-500">
                  Product leaked, broken glass, or seal tampered. Routed directly into <strong>Damaged Quarantine</strong> (Zero sellable inventory addition).
                </div>
              </div>
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Inspector Notes & Unboxing Observation
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Courier delivered box with crushed corner, face wash seal intact..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Recording...' : 'Commit QC Decision'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
