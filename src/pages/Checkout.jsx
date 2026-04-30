import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { addresses as addressesApi, orders as ordersApi, wallet as walletApi } from '../services/api';
import { FiMapPin, FiTruck, FiCreditCard, FiCheckCircle, FiZap, FiPlus, FiWallet } from 'react-icons/fi';

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, getSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const subtotal = getSubtotal();
  const finalTotal = subtotal;

  const fetchData = useCallback(async () => {
    try {
      const [addrRes, walletRes] = await Promise.all([
        addressesApi.getAll(),
        walletApi.getBalance()
      ]);
      const list = addrRes.data.data || addrRes.data;
      setAddresses(list);
      setWalletBalance(walletRes.data.balance);
      
      const def = list.find(a => a.is_default) || list[0];
      if (def) setSelectedAddress(def.id);
    } catch (err) {
      console.error("Failed to fetch checkout data", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePlaceOrder = async (isFastCheckout = false) => {
    if (!selectedAddress) return alert("Select a shipping address");
    if (paymentMode === 'WALLET' && walletBalance < finalTotal) return alert("Insufficient wallet balance");

    setLoading(true);
    try {
      const payload = {
        addressId: selectedAddress,
        paymentMode: isFastCheckout ? 'WALLET' : paymentMode,
        isFastCheckout
      };
      
      const res = await (isFastCheckout ? ordersApi.fastCheckout(payload) : ordersApi.create(payload));
      clearCart();
      navigate(`/order-success/${res.data.orderId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><FiMapPin /> Shipping Address</h2>
            <div className="grid gap-4">
              {addresses.map(addr => (
                <div key={addr.id} onClick={() => setSelectedAddress(addr.id)} className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedAddress === addr.id ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                  <p className="text-white font-medium">{addr.full_name}</p>
                  <p className="text-slate-400 text-sm">{addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><FiCreditCard /> Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PaymentCard id="COD" label="Cash on Delivery" icon={<FiTruck />} active={paymentMode} set={setPaymentMode} />
              <PaymentCard id="WALLET" label={`Wallet Balance (₹${walletBalance})`} icon={<FiWallet />} active={paymentMode} set={setPaymentMode} disabled={walletBalance < finalTotal} />
            </div>
          </section>
        </div>

        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-slate-400"><span>Shipping</span><span className="text-emerald-500">FREE</span></div>
              <div className="border-t border-slate-800 pt-3 flex justify-between text-white font-bold text-lg"><span>Total</span><span>₹{finalTotal}</span></div>
            </div>

            <button onClick={() => handlePlaceOrder(false)} disabled={loading} className="w-full bg-white text-slate-950 font-black py-4 rounded-xl mb-4 hover:bg-slate-200 transition-all disabled:opacity-50">
              {loading ? "Processing..." : "Place Order"}
            </button>

            <button onClick={() => handlePlaceOrder(true)} disabled={loading || walletBalance < finalTotal || !selectedAddress} className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50">
              <FiZap /> Fast Checkout
            </button>
            <p className="text-center text-slate-500 text-xs mt-4">One-click checkout using Wallet balance</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const PaymentCard = ({ id, label, icon, active, set, disabled }) => (
  <div onClick={() => !disabled && set(id)} className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${disabled ? 'opacity-40 cursor-not-allowed border-slate-800' : active === id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
    <div className="text-xl">{icon}</div>
    <span className="font-medium text-sm">{label}</span>
  </div>
);
