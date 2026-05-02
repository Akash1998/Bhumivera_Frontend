import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, Search, Plus, Loader2 } from 'lucide-react';
import api from '../../services/api'; 

export default function WalletManagement() {
  const [data, setData] = useState({ stats: {}, wallets: [], transactions: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/wallet/overview');
      if (response.data.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustBalance = async () => {
    const userId = prompt("Enter User ID:");
    const amount = prompt("Enter Amount (use negative for deduction):");
    
    if(!userId || !amount) return;

    try {
      const response = await api.post('/wallet/adjust', { 
        userId, 
        amount: parseFloat(amount),
        reason: 'Admin Manual Adjustment'
      });
      
      if (response.data.success) {
        alert("Balance adjusted successfully!");
        fetchWalletData(); // Refresh data
      }
    } catch (error) {
      alert("Failed to adjust balance. Check console for details.");
      console.error("Adjustment error:", error);
    }
  };

  const filteredTransactions = data.transactions.filter(tx => 
    tx.user_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.id?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Wallet className="text-emerald-500" /> Wallet Vault
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage user balances, credits, and transaction history.</p>
        </div>
        <button 
          onClick={handleAdjustBalance}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} /> Adjust Balance
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-2">Total Liability (Held)</p>
          <p className="text-3xl font-black text-white">₹{data.stats.totalBalanceHeld || '0.00'}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-2">Active Wallets</p>
          <p className="text-3xl font-black text-white">{data.stats.totalActiveWallets || '0'}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-2">Total Transactions</p>
          <p className="text-3xl font-black text-white">{data.transactions.length}</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by User ID..." 
              className="w-full bg-slate-950 border border-slate-800 text-sm text-white rounded-lg pl-9 pr-4 py-2 focus:border-emerald-500 focus:outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-slate-900 text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="text-emerald-500 animate-spin" size={24} />
                      <span className="text-slate-500 animate-pulse">Loading vault data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-500">
                    No transactions found matching your search.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{tx.id}</td>
                    <td className="px-6 py-4 text-slate-300 font-medium">{tx.user_id}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded-md text-[10px] font-black tracking-wider ${
                        tx.type === 'credit' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {tx.type === 'credit' ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">₹{tx.amount}</td>
                    <td className="px-6 py-4 text-xs whitespace-nowrap">
                      {new Date(tx.created_at).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
