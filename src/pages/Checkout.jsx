import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, MapPin, CreditCard, ShieldCheck, ArrowRight, Truck, Wallet } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BASE_URL, orders, addresses, wallet } from '../services/api';
import { haptics } from '../utils/haptics';
import { getProductImageUrl } from '../utils/productImageUrl';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment & Review
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMode, setPaymentMode] = useState('online');
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.discount_price || item.price) || 0;
    return acc + price * (Number(item.quantity) || 1);
  }, 0);

  const shippingCost = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop');
      return;
    }

    const fetchInitialData = async () => {
      try {
        const [addrRes, walletRes] = await Promise.all([
          addresses.get(),
          wallet.getBalance().catch(() => ({ data: { balance: 0 } })),
        ]);
        const list = addrRes.data?.addresses || addrRes.data?.data || [];
        setUserAddresses(list);
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.is_default) || list[0];
          setSelectedAddressId(defaultAddr.id);
        }
        setWalletBalance(walletRes.data?.balance || 0);
      } catch (err) {
        console.error('[CHECKOUT_INIT_ERROR]', err);
      }
    };

    fetchInitialData();
  }, [cartItems, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please choose or enter a delivery address.');
      setStep(1);
      return;
    }
    setLoading(true);
    setError(null);
    haptics.impactMedium();

    try {
      if (paymentMode === 'online') {
        // Step 1: Create Razorpay Order on server
        const { data: rzOrder } = await axios.post(
          `${BASE_URL}/api/create-order`,
          { amount: Math.round(total * 100), purpose: 'checkout' },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        // Step 2: Open Razorpay checkout or Native Intent
        const options = {
          key: rzOrder.key_id,
          amount: rzOrder.amount,
          currency: 'INR',
          name: 'Bhumivera Eco-Lab',
          description: 'Eco-conscious Order Checkout',
          order_id: rzOrder.order_id,
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.phone || '',
          },
          theme: { color: '#0b2419' },
          handler: async (response) => {
            try {
              const orderPayload = {
                addressId: selectedAddressId,
                paymentMode: 'online',
                termsAccepted: true,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };
              const { data: placed } = await orders.place(orderPayload);
              await clearCart();
              haptics.notificationSuccess();
              navigate(`/order-success/${placed.orderId}`);
            } catch (placeErr) {
              setError(placeErr.response?.data?.message || 'Payment verified but order creation failed.');
            }
          },
        };

        if (typeof window !== 'undefined' && window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Fallback dynamic script load
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            const rzp = new window.Razorpay(options);
            rzp.open();
          };
          document.body.appendChild(script);
        }
      } else {
        // COD or Wallet Checkout
        const { data: placed } = await orders.place({
          addressId: selectedAddressId,
          paymentMode,
          termsAccepted: true,
        });
        await clearCart();
        haptics.notificationSuccess();
        navigate(`/order-success/${placed.orderId}`);
      }
    } catch (err) {
      console.error('[CHECKOUT_ERROR]', err);
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
      haptics.notificationError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f2eb] px-4 py-8 text-[#1c2922] md:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-3xl font-bold md:text-4xl">Secure Checkout</h1>
        <p className="mt-1 text-sm text-stone-600">Complete your order with zero-waste packaging</p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-100 p-3.5 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {/* Main Steps */}
          <div className="space-y-6 lg:col-span-2">
            {/* Step 1: Address */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b2419] text-xs font-bold text-white">1</span>
                  <h2 className="font-serif text-xl font-semibold">Shipping Address</h2>
                </div>
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="text-xs font-semibold text-[#607552] underline">
                    Edit
                  </button>
                )}
              </div>

              {step === 1 ? (
                <div className="mt-4 space-y-4">
                  {userAddresses.length === 0 ? (
                    <div className="rounded-xl border border-stone-200 p-4 text-center">
                      <p className="text-sm text-stone-600">No saved addresses found.</p>
                      <button
                        onClick={() => navigate('/address-book')}
                        className="mt-3 rounded-lg bg-[#0b2419] px-4 py-2 text-xs font-semibold text-white"
                      >
                        Add New Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {userAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`cursor-pointer rounded-xl border p-4 transition ${
                            selectedAddressId === addr.id
                              ? 'border-[#0b2419] bg-[#f9f8f5] ring-2 ring-[#0b2419]'
                              : 'border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{addr.full_name}</span>
                            {addr.is_default ? (
                              <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] text-stone-700">Default</span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-xs text-stone-600">
                            {addr.street_address || addr.line1}, {addr.city}, {addr.state} - {addr.postal_code || addr.pincode}
                          </p>
                          <p className="mt-1 text-xs text-stone-500">Phone: {addr.phone_number || addr.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    disabled={!selectedAddressId}
                    onClick={() => setStep(2)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2419] py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-[#153e2c] disabled:opacity-50"
                  >
                    Continue to Payment <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-3 text-xs text-stone-600">
                  {userAddresses.find((a) => a.id === selectedAddressId)?.full_name} •{' '}
                  {userAddresses.find((a) => a.id === selectedAddressId)?.city} (Pincode:{' '}
                  {userAddresses.find((a) => a.id === selectedAddressId)?.postal_code || 'Verified'})
                </div>
              )}
            </div>

            {/* Step 2: Payment */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b2419] text-xs font-bold text-white">2</span>
                <h2 className="font-serif text-xl font-semibold">Payment Method</h2>
              </div>

              {step === 2 && (
                <div className="mt-4 space-y-3">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 p-4 transition hover:bg-stone-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMode === 'online'}
                        onChange={() => setPaymentMode('online')}
                        className="text-[#0b2419] focus:ring-[#0b2419]"
                      />
                      <div>
                        <span className="font-semibold text-sm">UPI, Cards, NetBanking (Razorpay)</span>
                        <p className="text-xs text-stone-500">Instant verification with GPay, PhonePe, Paytm or Cards</p>
                      </div>
                    </div>
                    <CreditCard className="h-5 w-5 text-stone-400" />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 p-4 transition hover:bg-stone-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMode === 'WALLET'}
                        onChange={() => setPaymentMode('WALLET')}
                        disabled={walletBalance < total}
                        className="text-[#0b2419] focus:ring-[#0b2419]"
                      />
                      <div>
                        <span className="font-semibold text-sm">Bhumivera Eco-Wallet</span>
                        <p className="text-xs text-stone-500">
                          Balance: ₹{walletBalance.toFixed(2)} {walletBalance < total ? '(Insufficient funds)' : ''}
                        </p>
                      </div>
                    </div>
                    <Wallet className="h-5 w-5 text-stone-400" />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 p-4 transition hover:bg-stone-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMode === 'COD'}
                        onChange={() => setPaymentMode('COD')}
                        className="text-[#0b2419] focus:ring-[#0b2419]"
                      />
                      <div>
                        <span className="font-semibold text-sm">Cash on Delivery (COD)</span>
                        <p className="text-xs text-stone-500">Pay cash or scan QR at delivery</p>
                      </div>
                    </div>
                    <Truck className="h-5 w-5 text-stone-400" />
                  </label>

                  <p className="mt-4 text-center text-xs leading-5 text-stone-600">
                    By placing your order, you agree to our{' '}
                    <Link to="/legal?section=terms" target="_blank" rel="noreferrer" className="font-semibold text-[#35533c] underline underline-offset-2">Conditions of Sale</Link>
                    {' '}and acknowledge the{' '}
                    <Link to="/legal?section=privacy" target="_blank" rel="noreferrer" className="font-semibold text-[#35533c] underline underline-offset-2">Privacy Notice</Link>.
                  </p>

                  <button
                    disabled={loading}
                    onClick={handlePlaceOrder}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2419] py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-md hover:bg-[#153e2c] disabled:opacity-50"
                  >
                    {loading ? 'Processing Order...' : `Place Order (₹${total.toFixed(2)})`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-semibold">Order Summary</h3>
            <div className="mt-4 divide-y divide-stone-100">
              {cartItems.map((item) => (
                <div key={item.id || item.product_id} className="flex items-center justify-between py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={getProductImageUrl(item.image || item.image_url || item.images?.[0]) || '/placeholder.png'}
                      alt={item.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-stone-800 line-clamp-1">{item.name}</p>
                      <p className="text-stone-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold">
                    ₹{((Number(item.discount_price || item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-bold text-stone-900">
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-stone-50 p-3 text-center text-[11px] text-stone-500">
              <ShieldCheck className="h-4 w-4 text-[#607552]" /> 100% Encrypted &amp; Direct-from-Lab Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
