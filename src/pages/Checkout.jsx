import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { addresses as addressesApi, coupons as couponsApi, orders as ordersApi, users as usersApi, wallet as walletApi } from '../services/api';
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
import { Gift, Wallet } from 'lucide-react';

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, getSubtotal, clearCart, rulePreview, rulePreviewLoading } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState('COD');
  const [shippingMethod, setShippingMethod] = useState('STANDARD');
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [redeemLoyaltyPoints, setRedeemLoyaltyPoints] = useState(false);
  
  const [couponCode, setCouponCode] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCouponDiscount, setAppliedCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [notes, setNotes] = useState('');

  const subtotal = getSubtotal();
  const standardShippingCost = Math.max(0, Number(settings?.standard_charge ?? settings?.default_shipping_charge ?? 50) || 0);
  const expressShippingCost = Math.max(0, Number(settings?.express_charge ?? 150) || 0);
  const shippingCost = rulePreview?.freeShipping ? 0 : shippingMethod === 'EXPRESS' ? expressShippingCost : standardShippingCost;
  const loyaltyPointsPerRupee = Math.max(1, Number(settings?.loyalty_points_per_rupee) || 10);
  const pointsPayableCap = Math.floor(Math.max(0, subtotal + shippingCost - appliedCouponDiscount) * loyaltyPointsPerRupee);
  const loyaltyPointsRedeemed = redeemLoyaltyPoints ? Math.min(loyaltyPoints, pointsPayableCap) : 0;
  const loyaltyDiscount = loyaltyPointsRedeemed / loyaltyPointsPerRupee;
  const finalTotal = Math.max(0, subtotal + shippingCost - appliedCouponDiscount - loyaltyDiscount);

  const fetchData = useCallback(async () => {
    try {
      const [addrRes, couponsRes] = await Promise.all([addressesApi.getAll(), couponsApi.getPublicActive().catch(() => ({ data: [] }))]);
      const list = addrRes.data.data || addrRes.data || [];
      setAddresses(list);
      setAvailableCoupons(Array.isArray(couponsRes.data) ? couponsRes.data : couponsRes.data?.data || []);
      
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

    try {
      const profileRes = await usersApi.getProfile();
      const profile = profileRes.data?.user || profileRes.data;
      setLoyaltyPoints(Math.max(0, Number(profile?.loyalty_points) || 0));
    } catch {
      setLoyaltyPoints(0);
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
        loyaltyPointsToRedeem: loyaltyPointsRedeemed,
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

  const applyBestCoupon = () => {
    const offers = availableCoupons.map(coupon => {
      const minimum = Number(coupon.min_order_value ?? coupon.min_order_amount) || 0;
      if (subtotal < minimum || (coupon.usage_limit && Number(coupon.used_count) >= Number(coupon.usage_limit))) return null;
      const amount = Number(coupon.value ?? coupon.discount_value) || 0;
      const calculated = coupon.discount_type === 'percentage' || coupon.type === 'percentage'
        ? subtotal * amount / 100
        : amount;
      const capped = coupon.max_discount ? Math.min(calculated, Number(coupon.max_discount)) : calculated;
      return { code: coupon.code, discount: Math.max(0, Math.min(subtotal, capped)) };
    }).filter(Boolean).sort((left, right) => right.discount - left.discount);
    if (!offers.length || offers[0].discount <= 0) {
      setCouponMessage('No eligible coupons for this subtotal.');
      return;
    }
    setCouponCode(offers[0].code);
    setAppliedCouponDiscount(offers[0].discount);
    setCouponMessage(`Best coupon applied: ${offers[0].code}`);
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#1A1A1A] pt-24 pb-16 font-sans selection:bg-[#8B9D83]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 border-b border-stone-200 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif text-[#2C3E2D] tracking-tight flex items-center gap-3">
              <FiShield className="text-[#8B9D83]" /> Secure Checkout
            </h1>
            <p className="text-stone-500 text-sm mt-2 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8B9D83] animate-pulse"></span>
              ENCRYPTED SESSION // {user?.email || 'GUEST'}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-mono text-stone-500">
            <span className="text-[#8B9D83] flex items-center gap-1"><FiCheckCircle /> Cart</span>
            <FiChevronRight />
            <span className="text-[#1A1A1A] flex items-center gap-1"><FiTruck /> Details</span>
            <FiChevronRight />
            <span>Payment</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN: Data Entry */}
          <div className="flex-1 space-y-10">
            
            {/* Addresses */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] flex items-center gap-3">
                  <FiMapPin className="text-[#8B9D83]" /> Shipping Address
                </h2>
                <button 
                  onClick={() => navigate('/address-book')}
                  className="text-[#8B9D83] hover:text-[#2C3E2D] text-sm font-bold flex items-center gap-1 transition-colors bg-stone-100 px-3 py-1.5 rounded-lg"
                >
                  <FiPlus /> ADD NEW
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length === 0 ? (
                  <div className="col-span-2 bg-stone-50 border border-stone-200 border-dashed p-8 rounded-xl text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-stone-100">
                      <FiMapPin className="text-stone-400 text-xl" />
                    </div>
                    <p className="text-stone-500 mb-4">No shipping addresses configured in your profile.</p>
                    <button 
                      onClick={() => navigate('/address-book')}
                      className="bg-[#2C3E2D] text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#3D553F] transition-colors"
                    >
                      Add New Address
                    </button>
                  </div>
                ) : (
                  addresses.map(addr => (
                    <div 
                      key={addr.id} 
                      onClick={() => setSelectedAddress(addr.id)} 
                      className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                        selectedAddress === addr.id 
                          ? 'bg-[#F5F1EB] border-[#8B9D83] shadow-sm' 
                          : 'bg-white border-stone-200 hover:border-[#8B9D83] hover:shadow-sm'
                      }`}
                    >
                      {selectedAddress === addr.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 text-[#8B9D83]">
                          <FiCheckCircle size={20} className="fill-[#8B9D83]/20" />
                        </motion.div>
                      )}
                      <p className="text-[#1A1A1A] font-medium mb-1 pr-8">{addr.full_name}</p>
                      <p className="text-stone-500 text-sm leading-relaxed">{addr.address_line1 || addr.street_address}</p>
                      <p className="text-stone-500 text-sm">{addr.city}, {addr.state} - <span className="font-mono text-[#8B9D83]">{addr.pincode || addr.postal_code}</span></p>
                    </div>
                  ))
                )}
              </div>
            </motion.section>

            {/* Delivery Method */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm"
            >
              <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-3">
                <FiPackage className="text-[#8B9D83]" /> Shipping Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setShippingMethod('STANDARD')}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${shippingMethod === 'STANDARD' ? 'bg-[#F5F1EB] border-[#8B9D83]' : 'bg-white border-stone-200 hover:border-[#8B9D83]'}`}
                >
                  <div>
                    <p className="font-medium flex items-center gap-2">Standard Shipping {shippingMethod === 'STANDARD' && <FiCheckCircle className="text-[#8B9D83]"/>}</p>
                    <p className="text-sm text-stone-500 mt-1">3-5 Business Days</p>
                  </div>
                    <span className="font-mono text-[#8B9D83] bg-[#E8E0D5] px-2 py-1 rounded text-xs">{rulePreview?.freeShipping ? 'FREE' : `₹${standardShippingCost}`}</span>
                </div>
                <div 
                  onClick={() => setShippingMethod('EXPRESS')}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${shippingMethod === 'EXPRESS' ? 'bg-[#F5F1EB] border-[#8B9D83]' : 'bg-white border-stone-200 hover:border-[#8B9D83]'}`}
                >
                  <div>
                    <p className="font-medium flex items-center gap-2">Express Shipping {shippingMethod === 'EXPRESS' && <FiCheckCircle className="text-[#8B9D83]"/>}</p>
                    <p className="text-sm text-stone-500 mt-1">1-2 Business Days</p>
                  </div>
                  <span className="font-mono text-[#1A1A1A]">{rulePreview?.freeShipping ? 'FREE' : `₹${expressShippingCost}`}</span>
                </div>
              </div>
            </motion.section>

            {/* Additional Info: Promo & Notes */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm"
            >
              <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-3">
                <FiTag className="text-[#8B9D83]" /> Order Options
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
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#8B9D83] transition-colors uppercase"
                    />
                    <button type="button" onClick={applyBestCoupon} className="shrink-0 rounded-lg border border-[#8B9D83] px-3 text-xs font-bold text-[#2C3E2D] hover:bg-[#F5F1EB]">Best coupon</button>
                  </div>
                  <p className="text-xs text-stone-500 mt-2 flex items-center gap-1"><FiInfo/>{couponMessage || 'Discount is confirmed when the order is placed.'}</p>
                </div>
                {loyaltyPoints > 0 && <label className="flex items-center justify-between gap-3 border border-stone-200 px-3 py-3 text-sm text-stone-700">
                  <span><span className="block font-semibold">Use loyalty points</span><span className="text-xs text-stone-500">{loyaltyPoints.toLocaleString()} available · up to ₹{(Math.min(loyaltyPoints, pointsPayableCap) / loyaltyPointsPerRupee).toFixed(2)}</span></span>
                  <input type="checkbox" checked={redeemLoyaltyPoints} onChange={event => setRedeemLoyaltyPoints(event.target.checked)} className="h-4 w-4 accent-[#8B9D83]"/>
                </label>}
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wider flex items-center gap-2"><FiMessageSquare/> Order Notes</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specific delivery instructions or gift notes..."
                    rows={3}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#8B9D83] transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
            </motion.section>

            {/* Payment Method */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm"
            >
              <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-3">
                <FiCreditCard className="text-[#8B9D83]" /> Payment Method
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

          {/* RIGHT COLUMN: Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="w-full lg:w-[400px]"
          >
            <div className="bg-white border border-stone-200 rounded-xl p-8 sticky top-24 shadow-sm">
              <h3 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center justify-between">
                Order Summary
                <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded font-bold">{cartItems?.length || 0} ITEMS</span>
              </h3>

              {rulePreview?.tiers?.length > 0 && <section className="mb-6 space-y-3 border-b border-stone-200 pb-5" aria-label="Cart rewards progress">
                {rulePreview.tiers.map(tier => <div key={tier.id}>
                  <div className="mb-1 flex justify-between gap-2 text-[10px] font-bold uppercase tracking-wider"><span className="truncate text-stone-500">{tier.badge}</span><span className={tier.unlocked ? 'text-emerald-700' : 'text-[#8B9D83]'}>{tier.unlocked ? 'Unlocked' : `Add ₹${tier.missingAmount}`}</span></div>
                  <div className="h-1.5 overflow-hidden bg-stone-100"><div className="h-full bg-[#8B9D83]" style={{ width: `${tier.progressPct}%` }}/></div>
                </div>)}
                {rulePreviewLoading && <p className="text-[10px] text-stone-400">Updating rewards…</p>}
              </section>}
              
              {/* Cart Items Preview */}
              <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4 custom-scrollbar">
                {cartItems?.length > 0 ? cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-stone-50 rounded-lg border border-stone-200 overflow-hidden flex-shrink-0 relative group p-1">
                      <img src={item.image || '/assets/images/placeholder.webp'} alt={item.name} className="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-0 right-0 bg-white/90 backdrop-blur text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg shadow-sm">x{item.quantity}</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1A1A1A] line-clamp-2 leading-tight">{item.name}</p>
                    </div>
                    <div className="text-sm font-bold text-[#2C3E2D]">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-8 text-stone-400">
                    <FiPackage size={32} className="mb-2 opacity-50" />
                    <p className="text-sm italic text-center">Your cart is empty.</p>
                  </div>
                )}
                {rulePreview?.gifts?.map(gift => <div key={`gift-${gift.ruleId}-${gift.productId}`} className="flex items-center gap-3 border-b border-emerald-100 pb-3 text-emerald-800"><Gift size={16}/><div className="flex-1"><p className="text-xs font-bold">FREE CART GIFT</p><p className="text-xs">{gift.productName || `Product #${gift.productId}`} · Qty {gift.quantity}</p></div><span className="text-xs font-bold">FREE</span></div>)}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4 mb-8 text-sm bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="text-[#1A1A1A] font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-[#8B9D83] font-bold">FREE</span>
                  ) : (
                    <span className="text-[#1A1A1A] font-medium">₹{shippingCost}</span>
                  )}
                </div>
                {couponCode && (
                  <div className="flex justify-between text-[#8B9D83] text-xs font-medium">
                    <span>Promo: {couponCode}</span>
                    <span>Pending Apply</span>
                  </div>
                )}
                {appliedCouponDiscount > 0 && <div className="flex justify-between text-emerald-700"><span>Coupon savings</span><span>-₹{appliedCouponDiscount.toFixed(2)}</span></div>}
                {loyaltyDiscount > 0 && <div className="flex justify-between text-emerald-700"><span>Loyalty points ({loyaltyPointsRedeemed})</span><span>-₹{loyaltyDiscount.toFixed(2)}</span></div>}
                <div className="border-t border-stone-200 pt-4 flex justify-between items-center text-lg font-serif text-[#1A1A1A]">
                  <span>Total</span>
                  <span className="font-bold text-[#2C3E2D] text-xl">₹{finalTotal}</span>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-2 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                {['Secure checkout', 'Verified products', 'Buyer protection', 'Support included'].map(badge => <span key={badge} className="border border-stone-200 px-2 py-2 text-center">{badge}</span>)}
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button 
                  onClick={() => handlePlaceOrder(false)} 
                  disabled={loading || !selectedAddress || cartItems?.length === 0} 
                  className="w-full bg-[#2C3E2D] text-white font-bold uppercase tracking-widest text-xs py-4 rounded-lg hover:bg-[#3D553F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? <span className="animate-pulse">Processing...</span> : <><FiShield/> Place Order</>}
                  </span>
                </button>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute border-t border-stone-200 w-full"></div>
                  <span className="relative bg-white px-4 text-[10px] font-bold tracking-widest text-stone-400 uppercase">OR</span>
                </div>

                <button 
                  onClick={() => handlePlaceOrder(true)} 
                  disabled={loading || walletBalance < finalTotal || !selectedAddress || cartItems?.length === 0} 
                  className="w-full bg-[#E8E0D5] text-[#1A1A1A] font-bold uppercase tracking-widest text-xs py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#DED2C4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiZap size={16} /> 1-Click Wallet Checkout
                </button>
                <p className="text-center text-stone-500 text-[10px] uppercase tracking-widest mt-2 flex items-center justify-center gap-1">
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
        ? 'opacity-50 cursor-not-allowed border-stone-200 bg-stone-50' 
        : active === id 
          ? 'bg-[#F5F1EB] border-[#8B9D83] text-[#2C3E2D] shadow-sm scale-[1.02]' 
          : 'bg-white border-stone-200 text-stone-500 hover:border-[#8B9D83] hover:shadow-sm hover:text-[#1A1A1A]'
    }`}
  >
    <div className={`${active === id ? 'text-[#8B9D83] bg-white' : 'text-stone-400 bg-stone-50'} p-3 rounded-lg border border-transparent ${active === id ? 'border-stone-200 shadow-sm' : ''} flex items-center justify-center transition-colors`}>
      {icon}
    </div>
    <span className="font-bold text-sm tracking-wide">{label}</span>
    {active === id && <FiCheckCircle className="absolute bottom-4 right-4 text-[#8B9D83] opacity-50" />}
  </div>
);
