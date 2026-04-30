import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { addresses as addressesApi, orders as ordersApi } from '../services/api';
import { FiMapPin, FiTruck, FiCreditCard, FiCheckCircle, FiZap, FiPlus } from 'react-icons/fi';

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, getSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // State Management
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // Controls Address Form Visibility

  const subtotal = getSubtotal();
  const finalTotal = subtotal + (paymentMode === 'express' ? 99 : 0);

  // Fetch Addresses
  const fetchAddresses = useCallback(async () => {
    try {
      const res = await addressesApi.getAll();
      const list = res.data.data || res.data;
      setAddresses(list);
      
      // Auto-select default address or first available
      const def = list.find(a => a.is_default) || list[0];
      if (def && !selectedAddress) setSelectedAddress(def.id);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    }
  }, [selectedAddress]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handlePlaceOrder = async (isOneClick = false) => {
    if (!selectedAddress) {
      alert("Please select or add a shipping address before proceeding.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        addressId: selectedAddress,
        paymentMode: isOneClick ? 'WALLET' : paymentMode,
        deliveryType: 'standard'
      };

      const res = await ordersApi.create(payload);
      clearCart();

      navigate('/order-success', { 
        state: { orderId: res.data.orderId || res.data.id } 
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || "Checkout failed. Please try again.";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-6">
        
        {/* WALLET MINI-WIDGET */}
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-emerald-800 text-xs font-black uppercase tracking-wider">Anritvox Wallet</p>
            <h3 className="text-2xl font-black text-emerald-950">₹{user?.wallet_balance || '0.00'}</h3>
          </div>
          {user?.wallet_balance >= finalTotal && (
            <button 
              onClick={() => handlePlaceOrder(true)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
              <FiZap /> One-Click Buy
            </button>
          )}
        </div>

        {/* ADDRESS SELECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FiMapPin className="text-blue-600" /> Shipping Address
            </h2>
            <button 
              onClick={() => setShowForm(true)} 
              className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              <FiPlus /> Add New
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
              <p className="text-gray-500 mb-4">No saved addresses found.</p>
              <button 
                onClick={() => setShowForm(true)} 
                className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-black transition-all"
              >
                Add Shipping Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(addr => (
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  key={addr.id} 
                  onClick={() => setSelectedAddress(addr.id)} 
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedAddress === addr.id 
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' 
                    : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-900">{addr.full_name}</p>
                    {selectedAddress === addr.id && <FiCheckCircle className="text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{addr.street_address}</p>
                  <p className="text-sm text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* PAYMENT SELECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FiCreditCard className="text-purple-600" /> Payment Method
          </h2>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMode === 'COD' ? 'border-gray-900 bg-gray-50' : 'border-gray-100'}`}>
              <input 
                type="radio" 
                className="w-4 h-4 text-gray-900"
                checked={paymentMode === 'COD'} 
                onChange={() => setPaymentMode('COD')} 
              />
              <div>
                <p className="font-bold text-gray-900">Cash on Delivery</p>
                <p className="text-xs text-gray-500">Pay when your package arrives</p>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              user?.wallet_balance < finalTotal ? 'opacity-50 cursor-not-allowed bg-gray-50' : 
              paymentMode === 'WALLET' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100'
            }`}>
              <input 
                type="radio" 
                disabled={user?.wallet_balance < finalTotal} 
                checked={paymentMode === 'WALLET'} 
                onChange={() => setPaymentMode('WALLET')} 
                className="w-4 h-4 text-emerald-600"
              />
              <div>
                <p className="font-bold text-gray-900">Pay with Wallet</p>
                <p className="text-xs text-emerald-700 font-medium">Available Balance: ₹{user?.wallet_balance}</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* SUMMARY SIDEBAR */}
      <div className="lg:col-span-4">
        <div className="bg-gray-900 text-white p-6 rounded-3xl h-fit sticky top-24 shadow-xl shadow-gray-200">
          <h2 className="text-xl font-black mb-6">Order Total</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="text-white">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span className="text-white">{paymentMode === 'express' ? '₹99.00' : 'FREE'}</span>
            </div>
            
            <div className="border-t border-gray-800 pt-4 mt-4 flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Total Amount</p>
                <p className="text-3xl font-black text-[#febd69]">₹{finalTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <button 
            disabled={loading || (addresses.length === 0 && !showForm)}
            onClick={() => handlePlaceOrder(false)} 
            className="w-full bg-[#febd69] text-black font-black py-4 rounded-2xl mt-8 hover:bg-[#f3a847] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Complete Order'}
          </button>

          <p className="text-[10px] text-gray-500 mt-4 text-center">
            By placing your order, you agree to Anritvox's privacy notice and conditions of use.
          </p>
        </div>
      </div>
    </div>
  );
}
