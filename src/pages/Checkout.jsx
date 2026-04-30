import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { addresses as addressesApi, orders as ordersApi } from '../services/api';
import { FiMapPin, FiTruck, FiCreditCard, FiCheckCircle, FiZap } from 'react-icons/fi';

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, getSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState('COD');
  const [loading, setLoading] = useState(false);

  const subtotal = getSubtotal();
  const finalTotal = subtotal + (paymentMode === 'express' ? 99 : 0);

  useEffect(() => {
    addressesApi.getAll().then(res => {
      const list = res.data.data || res.data;
      setAddresses(list);
      const def = list.find(a => a.is_default) || list[0];
      if (def) setSelectedAddress(def.id);
    });
  }, []);

  const handlePlaceOrder = async (isOneClick = false) => {
    setLoading(true);
    try {
      const payload = {
        addressId: selectedAddress,
        paymentMode: isOneClick ? 'WALLET' : paymentMode,
        deliveryType: 'standard'
      };
      const res = await ordersApi.create(payload);
      clearCart();
      navigate('/order-success', { state: { orderId: res.data.orderId } });
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-6">
        {/* WALLET MINI-WIDGET (NEW) */}
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-emerald-800 text-xs font-black uppercase">Anritvox Wallet</p>
            <h3 className="text-2xl font-black text-emerald-950">₹{user?.wallet_balance || '0.00'}</h3>
          </div>
          {user?.wallet_balance >= finalTotal && (
            <button 
              onClick={() => handlePlaceOrder(true)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all"
            >
              <FiZap /> One-Click Buy
            </button>
          )}
        </div>

        {/* ADDRESS SELECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FiMapPin/> Shipping Address</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {addresses.map(addr => (
               <div key={addr.id} onClick={() => setSelectedAddress(addr.id)} className={`p-4 border-2 rounded-xl cursor-pointer ${selectedAddress === addr.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100'}`}>
                 <p className="font-bold">{addr.full_name}</p>
                 <p className="text-sm text-gray-500">{addr.street_address}, {addr.city}</p>
               </div>
             ))}
           </div>
        </div>

        {/* PAYMENT SELECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FiCreditCard/> Payment Method</h2>
           <div className="space-y-3">
             <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer">
               <input type="radio" checked={paymentMode === 'COD'} onChange={() => setPaymentMode('COD')} />
               <span className="font-bold">Cash on Delivery</span>
             </label>
             <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${user?.wallet_balance < finalTotal ? 'opacity-50' : ''}`}>
               <input type="radio" disabled={user?.wallet_balance < finalTotal} checked={paymentMode === 'WALLET'} onChange={() => setPaymentMode('WALLET')} />
               <span className="font-bold">Pay with Wallet (₹{user?.wallet_balance})</span>
             </label>
           </div>
        </div>
      </div>

      {/* SUMMARY SIDEBAR */}
      <div className="lg:col-span-4 bg-gray-900 text-white p-6 rounded-3xl h-fit sticky top-24">
        <h2 className="text-xl font-black mb-6">Order Total</h2>
        <div className="flex justify-between mb-4"><span>Subtotal</span><span>₹{subtotal}</span></div>
        <div className="border-t border-gray-800 pt-4 mt-4 flex justify-between items-end">
          <span className="text-gray-400">Final Total</span>
          <span className="text-3xl font-black">₹{finalTotal}</span>
        </div>
        <button 
          disabled={loading}
          onClick={() => handlePlaceOrder(false)} 
          className="w-full bg-[#febd69] text-black font-black py-4 rounded-2xl mt-8 hover:bg-[#f3a847] transition-all"
        >
          {loading ? 'Processing...' : 'Complete Order'}
        </button>
      </div>
    </div>
  );
}
