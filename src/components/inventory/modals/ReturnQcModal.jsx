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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0c261b] text-white rounded-2xl shadow-2xl border border-emerald-500/40 max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-emerald-500/30 flex items-center justify-between bg-[#071711]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/25 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" /> Return &amp; RTO Quality Inspection
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">#{order.orderNumber}</span>
            </div>
            <h3 className="text-base font-black text-white mt-1 uppercase tracking-wide">
              Unboxing Condition &amp; Restock Grading
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300">
              Select Return Condition Grade
            </label>

            {/* Grade Options */}
            <div
              onClick={() => setSelectedGrade('GRADE_A')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                selectedGrade === 'GRADE_A'
                  ? 'border-emerald-400 bg-emerald-950/40'
                  : 'border-emerald-500/25 bg-[#071711] hover:border-emerald-500/40'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0 font-bold text-sm">
                A
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="text-xs font-bold text-white">Grade A — Pristine &amp; Factory Sealed</div>
                <div className="text-[11px] text-slate-300">
                  Outer seal intact. Automatically restocks into <strong>Sellable Warehouse Vault</strong> and live website.
                </div>
              </div>
            </div>

            <div
              onClick={() => setSelectedGrade('GRADE_B')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                selectedGrade === 'GRADE_B'
                  ? 'border-amber-400 bg-amber-950/40'
                  : 'border-emerald-500/25 bg-[#071711] hover:border-emerald-500/40'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0 font-bold text-sm">
                B
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="text-xs font-bold text-white">Grade B — Outer Box Distressed / Seal Intact</div>
                <div className="text-[11px] text-slate-300">
                  Carton bruised in transit, formulation intact. Restocks into <strong>Offline Shop Counter / Clearance</strong>.
                </div>
              </div>
            </div>

            <div
              onClick={() => setSelectedGrade('GRADE_C')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                selectedGrade === 'GRADE_C'
                  ? 'border-rose-400 bg-rose-950/40'
                  : 'border-emerald-500/25 bg-[#071711] hover:border-emerald-500/40'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center shrink-0 font-bold text-sm">
                C
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="text-xs font-bold text-white">Grade C — Damaged / Leaked / Tampered</div>
                <div className="text-[11px] text-slate-300">
                  Bottle broken or seal broken. Quarantined in <strong>Bay Q (Zero sellable inventory addition)</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
              Inspector Notes &amp; Unboxing Observation
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Outer carton dented, seal 100% verified intact..."
              className="w-full text-xs p-2.5 bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none placeholder-slate-400"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-emerald-500/30">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 font-bold text-xs transition shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Recording...' : 'Commit QC Decision'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
