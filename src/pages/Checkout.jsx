import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { addresses as addressesApi, orders as ordersApi, wallet as walletApi } from '../services/api';
import { 
  FiMapPin, 
  FiTruck, 
  FiCreditCard, 
  FiCheckCircle, 
  FiZap, 
  FiPlus, 
  FiShield, 
  FiPackage, 
  FiChevronRight,
  FiInfo,
  FiTag,
  FiMessageSquare
} from 'react-icons/fi';
import { Wallet } from 'lucide-react';

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, getSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState('COD');
  const [shippingMethod, setShippingMethod] = useState('STANDARD');
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  
  const [couponCode, setCouponCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const shippingCost = shippingMethod === 'EXPRESS' ? 150 : 0;
  const finalTotal = subtotal + shippingCost;

  const fetchData = useCallback(async () => {
    try {
      const addrRes = await addressesApi.getAll();
      const list = addrRes.data.data || addrRes.data || [];
      setAddresses(list);
      
      const def = list.find(a => a.is_default) || list[0];
      if (def) setSelectedAddress(def.id);
    } catch (err) {
      console.error("Failed to fetch checkout addresses", err);
    }

    try {
      const walletRes = await walletApi.getBalance();
      setWalletBalance(walletRes.data.balance || 0);
    } catch (err) {
      console.error("Failed to fetch wallet balance, defaulting to 0", err);
      setWalletBalance(0);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePlaceOrder = async (isFastCheckout = false) => {
    if (!selectedAddress) return alert("Please select a shipping destination to proceed.");
    if (paymentMode === 'WALLET' && walletBalance < finalTotal) return alert("Insufficient Digital Wallet balance for this transaction.");

    setLoading(true);
    try {
      const payload = {
        addressId: selectedAddress,
        paymentMode: isFastCheckout ? 'WALLET' : paymentMode,
        isFastCheckout,
        deliveryType: shippingMethod.toLowerCase(),
        couponCode: couponCode.trim() || undefined,
        notes: notes.trim() || undefined
      };
      
      const res = await (isFastCheckout ? ordersApi.fastCheckout(payload) : ordersApi.create(payload));
      clearCart();
      navigate(`/order-success/${res.data.orderId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Checkout sequence failed. Please verify your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#1A1C18] pt-24 pb-16 font-sans selection:bg-[#8b5a2b]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 border-b border-[#e8dcc4] pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif tracking-tight flex items-center gap-3 text-[#2C3E2D]">
              <FiShield className="text-[#8b5a2b]" /> Secure Checkout
            </h1>
            <p className="text-stone-500 text-sm mt-2 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8b5a2b] animate-pulse"></span>
              SSL ENCRYPTED // {user?.email || 'GUEST'}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-stone-400">
            <span className="text-[#8b5a2b] flex items-center gap-1"><FiCheckCircle /> Cart</span>
            <FiChevronRight />
            <span className="text-[#2C3E2D] flex items-center gap-1"><FiTruck /> Details</span>
            <FiChevronRight />
            <span>Payment</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 space-y-10">
            
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#e8dcc4] rounded-2xl p-8 shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif text-[#2C3E2D] flex items-center gap-3">
                  <FiMapPin className="text-[#8b5a2b]" /> Shipping Destination
                </h2>
                <button 
                  onClick={() => navigate('/address-book')}
                  className="text-[#8b5a2b] hover:text-[#6b4421] text-sm font-bold flex items-center gap-1 transition-colors bg-[#faf8f5] px-3 py-1.5 rounded-lg border border-[#e8dcc4]"
                >
                  <FiPlus /> NEW
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length === 0 ? (
                  <div className="col-span-2 bg-[#faf8f5] border border-[#e8dcc4] p-8 rounded-xl text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#e8dcc4]">
                      <FiMapPin className="text-stone-400 text-xl" />
                    </div>
                    <p className="text-stone-500 mb-4 font-medium">No shipping addresses found.</p>
                    <button 
                      onClick={() => navigate('/address-book')}
                      className="bg-[#2C3E2D] text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#1A1C18] transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  addresses.map(addr => (
                    <div 
                      key={addr.id} 
                      onClick={() => setSelectedAddress(addr.id)} 
                      className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                        selectedAddress === addr.id 
                          ? 'bg-[#faf8f5] border-[#8b5a2b] shadow-sm' 
                          : 'bg-white border-[#e8dcc4] hover:border-[#8b5a2b]/50'
                      }`}
                    >
                      {selectedAddress === addr.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 text-[#8b5a2b]">
                          <FiCheckCircle size={20} className="fill-[#8b5a2b]/10" />
                        </motion.div>
                      )}
                      <p className="text-[#1A1C18] font-bold mb-1 pr-8">{addr.full_name}</p>
                      <p className="text-stone-500 text-sm leading-relaxed">{addr.address_line1 || addr.street_address}</p>
                      <p className="text-stone-500 text-sm">{addr.city}, {addr.state} - <span className="font-mono text-[#8b5a2b]">{addr.pincode || addr.postal_code}</span></p>
                    </div>
                  ))
                )}
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white border border-[#e8dcc4] rounded-2xl p-8 shadow-sm"
            >
              <h2 className="text-xl font-serif text-[#2C3E2D] mb-6 flex items-center gap-3">
                <FiPackage className="text-[#8b5a2b]" /> Delivery Protocol
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setShippingMethod('STANDARD')}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${shippingMethod === 'STANDARD' ? 'bg-[#faf8f5] border-[#8b5a2b]' : 'bg-white border-[#e8dcc4] hover:border-[#8b5a2b]/50'}`}
                >
                  <div>
                    <p className="font-bold flex items-center gap-2 text-[#1A1C18]">Standard Logistics {shippingMethod === 'STANDARD' && <FiCheckCircle className="text-[#8b5a2b]"/>}</p>
                    <p className="text-sm text-stone-500 mt-1">3-5 Business Days</p>
                  </div>
                  <span className="font-bold text-[#8b5a2b] bg-[#8b5a2b]/10 px-2 py-1 rounded text-xs uppercase tracking-widest">Free</span>
                </div>
                <div 
                  onClick={() => setShippingMethod('EXPRESS')}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${shippingMethod === 'EXPRESS' ? 'bg-[#faf8f5] border-[#8b5a2b]' : 'bg-white border-[#e8dcc4] hover:border-[#8b5a2b]/50'}`}
                >
                  <div>
                    <p className="font-bold flex items-center gap-2 text-[#1A1C18]">Priority Air {shippingMethod === 'EXPRESS' && <FiCheckCircle className="text-[#8b5a2b]"/>}</p>
                    <p className="text-sm text-stone-500 mt-1">1-2 Business Days</p>
                  </div>
                  <span className="font-bold text-[#1A1C18]">₹150</span>
                </div>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white border border-[#e8dcc4] rounded-2xl p-8 shadow-sm"
            >
              <h2 className="text-xl font-serif text-[#2C3E2D] mb-6 flex items-center gap-3">
                <FiTag className="text-[#8b5a2b]" /> Order Modifiers
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wider">Promotional Code</label>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE" 
                      className="flex-1 bg-[#faf8f5] border border-[#e8dcc4] rounded-xl px-4 py-3 text-[#1A1C18] font-mono placeholder:text-stone-400 focus:outline-none focus:border-[#8b5a2b] transition-colors uppercase"
                    />
                  </div>
                  <p className="text-xs text-stone-400 mt-2 flex items-center gap-1"><FiInfo/> Discount applied dynamically at processing.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wider flex items-center gap-2"><FiMessageSquare/> Concierge Notes</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specific delivery instructions or gift notes..."
                    rows={3}
                    className="w-full bg-[#faf8f5] border border-[#e8dcc4] rounded-xl px-4 py-3 text-[#1A1C18] text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#8b5a2b] transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white border border-[#e8dcc4] rounded-2xl p-8 shadow-sm"
            >
              <h2 className="text-xl font-serif text-[#2C3E2D] mb-6 flex items-center gap-3">
                <FiCreditCard className="text-[#8b5a2b]" /> Payment Gateway
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PaymentCard 
                  id="COD" 
                  label="Cash on Delivery" 
                  icon={<FiTruck size={24} />} 
                  active={paymentMode} 
                  set={setPaymentMode} 
                />
                <PaymentCard 
                  id="WALLET" 
                  label={`Digital Wallet (₹${walletBalance})`} 
                  icon={<Wallet size={24} />} 
                  active={paymentMode} 
                  set={setPaymentMode} 
                  disabled={walletBalance < finalTotal} 
                />
              </div>
            </motion.section>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="w-full lg:w-[400px]"
          >
            <div className="bg-white border border-[#e8dcc4] rounded-2xl p-8 sticky top-24 shadow-sm">
              <h3 className="text-xl font-serif text-[#2C3E2D] mb-6 flex items-center justify-between">
                Order Summary
                <span className="text-xs bg-[#8b5a2b]/10 text-[#8b5a2b] px-2 py-1 rounded font-bold uppercase tracking-widest">{cartItems?.length || 0} ITEMS</span>
              </h3>
              
              <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4 custom-scrollbar">
                {cartItems?.length > 0 ? cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-b border-[#e8dcc4]/50 pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-[#faf8f5] rounded-lg border border-[#e8dcc4] flex items-center justify-center p-1 flex-shrink-0 relative group">
                      <img src={item.image || '/logo.webp'} alt={item.name} className="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-0 right-0 bg-white/90 backdrop-blur text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg border-l border-b border-[#e8dcc4]">x{item.quantity}</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#1A1C18] line-clamp-2 leading-tight">{item.name}</p>
                    </div>
                    <div className="text-sm font-bold text-[#8b5a2b]">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-8 text-stone-400">
                    <FiPackage size={32} className="mb-2 opacity-50" />
                    <p className="text-sm italic text-center">Your cart is empty.</p>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-8 font-medium text-sm bg-[#faf8f5] p-4 rounded-xl border border-[#e8dcc4]">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="text-[#1A1C18] font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Logistics</span>
                  {shippingCost === 0 ? (
                    <span className="text-[#8b5a2b] font-bold uppercase tracking-widest text-xs">Free</span>
                  ) : (
                    <span className="text-[#1A1C18] font-bold">₹{shippingCost}</span>
                  )}
                </div>
                {couponCode && (
                  <div className="flex justify-between text-[#8b5a2b] text-xs font-bold">
                    <span>Promo: {couponCode}</span>
                    <span>Pending DB Evaluation</span>
                  </div>
                )}
                <div className="border-t border-[#e8dcc4] pt-4 flex justify-between items-center text-lg font-sans text-[#2C3E2D]">
                  <span>Total Due</span>
                  <span className="text-[#8b5a2b] text-xl font-bold">₹{finalTotal}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => handlePlaceOrder(false)} 
                  disabled={loading || !selectedAddress || cartItems?.length === 0} 
                  className="w-full bg-[#8b5a2b] text-white font-bold uppercase tracking-[0.2em] text-xs py-4 rounded-xl hover:bg-[#6b4421] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? <span className="animate-pulse">Processing...</span> : <><FiShield/> Place Order</>}
                  </span>
                </button>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute border-t border-[#e8dcc4] w-full"></div>
                  <span className="relative bg-white px-4 text-[10px] font-bold tracking-widest text-stone-400">OR</span>
                </div>

                <button 
                  onClick={() => handlePlaceOrder(true)} 
                  disabled={loading || walletBalance < finalTotal || !selectedAddress || cartItems?.length === 0} 
                  className="w-full bg-[#faf8f5] border border-[#8b5a2b] text-[#8b5a2b] font-bold uppercase tracking-[0.2em] text-xs py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#8b5a2b] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiZap size={16} /> Quick Pay Checkout
                </button>
                <p className="text-center text-stone-400 text-[10px] uppercase tracking-widest mt-2 flex items-center justify-center gap-1">
                  <FiInfo /> 1-Click Wallet Deduction
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const PaymentCard = ({ id, label, icon, active, set, disabled }) => (
  <div 
    onClick={() => !disabled && set(id)} 
    className={`p-6 rounded-xl border flex flex-col items-start gap-4 cursor-pointer transition-all duration-300 relative overflow-hidden ${
      disabled 
        ? 'opacity-30 cursor-not-allowed border-[#e8dcc4] bg-[#faf8f5]' 
        : active === id 
          ? 'bg-[#faf8f5] border-[#8b5a2b] text-[#8b5a2b] shadow-sm scale-[1.02]' 
          : 'bg-white border-[#e8dcc4] text-stone-500 hover:border-[#8b5a2b]/50 hover:bg-[#faf8f5]'
    }`}
  >
    {active === id && <div className="absolute top-0 right-0 w-16 h-16 bg-[#8b5a2b]/5 blur-xl rounded-full"></div>}
    <div className={`${active === id ? 'text-[#8b5a2b] bg-white border border-[#e8dcc4]' : 'text-stone-400 bg-[#faf8f5] border border-[#e8dcc4]/50'} p-3 rounded-lg flex items-center justify-center transition-colors`}>
      {icon}
    </div>
    <span className="font-bold text-sm tracking-wide">{label}</span>
    {active === id && <FiCheckCircle className="absolute bottom-4 right-4 text-[#8b5a2b]" />}
  </div>
);
