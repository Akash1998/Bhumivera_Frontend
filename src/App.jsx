import React,{useState,useEffect}from 'react';
import {Package,LogOut,Server,AlertTriangle,RefreshCw}from 'lucide-react';
import api from './services/api';
import {useToast}from './context/ToastContext';
import {useNavigate}from 'react-router-dom';
export default function Warehouse(){
const[storeName,setStoreName]=useState('Connecting...');
const[products,setProducts]=useState([]);
const[loading,setLoading]=useState(true);
const[accessDenied,setAccessDenied]=useState(false);
const[error,setError]=useState(null);
const[formData,setFormData]=useState({product_name:'',quantity:1,sale_price:''});
const[isSubmitting,setIsSubmitting]=useState(false);
const toastCtx=useToast();
const showToast=toastCtx?.showToast;
const navigate=useNavigate();
const init=async()=>{setLoading(true);setError(null);try{
const token=localStorage.getItem('token')||localStorage.getItem('ms_token');
if(!token){navigate('/login');return;}
const accessRes=await api.get('/warehouse/check-access');
const accessData=accessRes.data;
if(!accessData.hasAccess&&!accessData.isAdmin){setAccessDenied(true);return;}
setStoreName(accessData.storeName||'Master Admin Access');
const prodRes=await api.get('/products');
const prodData=prodRes.data;
const pList=prodData.data||prodData.products||(Array.isArray(prodData)?prodData:[]);
setProducts(pList);
}catch(e){console.error('Warehouse init error:',e);
if(e?.response?.status===401){navigate('/login');return;}
if(e?.response?.status===403){setAccessDenied(true);}else{
setError(e?.response?.data?.message||'Connection failed. Please try again.');
showToast?.('Connection failed.','error');}
}finally{setLoading(false);}};
useEffect(()=>{init();},[]);
const handleSubmit=async(e)=>{e.preventDefault();
if(!formData.product_name)return showToast?.('Select a product','error');
if(!formData.sale_price||formData.sale_price<=0)return showToast?.('Enter a valid sale price','error');
setIsSubmitting(true);try{
await api.post('/warehouse/log-sale',{product_name:formData.product_name,quantity:formData.quantity,sale_price:parseFloat(formData.sale_price)});
showToast?.('Transaction secured to ledger.','success');
setFormData({product_name:'',quantity:1,sale_price:''});
}catch(e){console.error('Log sale error:',e);showToast?.(e?.response?.data?.message||'Failed to log sale.','error');}finally{setIsSubmitting(false);}};
const handleLogout=()=>{localStorage.removeItem('token');localStorage.removeItem('ms_token');localStorage.removeItem('user');navigate('/login');};
if(loading)return(<div className="min-h-screen flex items-center justify-center bg-[#020617]"><p className="text-emerald-500 font-black tracking-widest uppercase text-sm animate-pulse">Verifying Clearance...</p></div>);
if(accessDenied)return(<div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-center px-4"><AlertTriangle className="w-12 h-12 text-rose-500 mb-4"/><h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Access Denied</h2><p className="text-slate-500 text-sm mb-6">You lack distributor clearance. Contact admin.</p><button onClick={handleLogout} className="px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-xl text-sm font-black uppercase hover:bg-rose-500 hover:text-white transition-all">Return to Login</button></div>);
if(error)return(<div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-center px-4"><Server className="w-12 h-12 text-amber-500 mb-4"/><h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">Connection Error</h2><p className="text-slate-400 text-sm mb-6">{error}</p><button onClick={init} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-black uppercase hover:bg-emerald-500 hover:text-slate-950 transition-all"><RefreshCw className="w-4 h-4"/> Retry Connection</button></div>);
return(<div className="min-h-screen bg-[#020617] text-[#e2e8f0] p-4 md:p-8"><div className="max-w-2xl mx-auto"><div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800"><div><h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2"><Package className="text-emerald-500"/>Local <span className="text-emerald-500">Warehouse</span></h1><p id="store-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{storeName}</p></div><button onClick={handleLogout} className="p-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-md flex items-center gap-2 text-xs font-black uppercase"><LogOut className="w-5 h-5"/> Logout</button></div><div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl"><h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2 mb-6"><Server className="text-emerald-500 w-5 h-5"/>Log Sale Transaction</h2><form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Select Product SKU</label><select required value={formData.product_name} onChange={(e)=>setFormData({...formData,product_name:e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"><option value="">-- Select Valid Product --</option>{products.map(p=>(<option key={p.id} value={p.name}>{p.name}</option>))}</select></div><div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Quantity</label><input type="number" min="1" required value={formData.quantity} onChange={(e)=>setFormData({...formData,quantity:parseInt(e.target.value)||1})} className="w-full bg-[#0f172a] border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-emerald-500 transition-all"/></div><div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sale Price (₹)</label><input type="number" min="0" step="0.01" required placeholder="e.g. 1500" value={formData.sale_price} onChange={(e)=>setFormData({...formData,sale_price:e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-emerald-500 transition-all"/></div><button type="submit" disabled={isSubmitting} className="w-full py-3 bg-emerald-500 text-slate-950 font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20">{isSubmitting?'Syncing to Ledger...':'Log Transaction to Ledger'}</button></form></div></div></div>);}
