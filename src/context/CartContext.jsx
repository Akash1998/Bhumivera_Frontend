import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useSettings } from "./SettingsContext";
import { cart as cartApi, cartRules as cartRulesApi, products as productsApi, affiliate as affiliateApi } from "../services/api";
import { useToast } from './ToastContext';
import {
  AI_COPILOT_ADD_CART_RETRY_EVENT,
  classifyCartErrorForAiGuide,
  triggerAiCopilotAssist,
} from "../utils/aiCopilotBus";
import { getClientStockError } from "../utils/cartStock";

const CartContext = createContext();
const GUEST_CART_KEY = "Bhumivera_guest_cart";
const PENDING_CART_ADD_KEY = "Bhumivera_pending_cart_add";
const AFFILIATE_ATTRIBUTION_KEY = "Bhumivera_affiliate_attribution";
const getStoredAffiliateCode = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(AFFILIATE_ATTRIBUTION_KEY) || 'null');
    if (stored?.code && Number(stored.expiresAt) > Date.now()) return String(stored.code);
    localStorage.removeItem(AFFILIATE_ATTRIBUTION_KEY);
  } catch {
    localStorage.removeItem(AFFILIATE_ATTRIBUTION_KEY);
  }
  return '';
};

export const getCartProductId = product => product?.product_id ?? product?._id ?? product?.id;

function GiftUnlockCelebration({ celebration }) {
  useEffect(() => {
    if (!celebration) return undefined;
    const timer = setTimeout(() => celebration.onComplete(), 3200);
    return () => clearTimeout(timer);
  }, [celebration]);

  if (!celebration) return null;
  const confetti = Array.from({ length: 48 }, (_, index) => ({
    left: `${(index * 37) % 101}%`,
    delay: `${(index % 9) * 0.035}s`,
    duration: `${2.2 + (index % 6) * 0.12}s`,
    drift: `${((index % 7) - 3) * 28}px`,
    rotation: `${360 + (index % 4) * 180}deg`,
    color: ['#D4AF37', '#FCE096', '#8BCB91', '#F7F5EE'][index % 4],
    shape: index % 3 === 0 ? 'rounded-full' : 'rounded-sm',
  }));
  const giftNames = celebration.names.join(', ');

  return (
    <>
      <style>{`
        @keyframes gift-unlock-confetti-fall {
          0% { opacity: 0; transform: translate3d(0, -12vh, 0) rotate(0deg) scale(.7); }
          12% { opacity: 1; }
          100% { opacity: 0; transform: translate3d(var(--gift-drift), 110vh, 0) rotate(var(--gift-rotation)) scale(1); }
        }
        @keyframes gift-unlock-message-pop {
          0% { opacity: 0; transform: translateY(-14px) scale(.92); }
          12%, 82% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-6px) scale(.98); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gift-unlock-confetti { display: none; }
          .gift-unlock-message { animation: none !important; }
        }
      `}</style>
      <div key={celebration.id} className="pointer-events-none fixed inset-0 z-[200] overflow-hidden" aria-hidden="true">
        {confetti.map((piece, index) => (
          <span
            key={index}
            className={`gift-unlock-confetti absolute top-0 h-2.5 w-1.5 ${piece.shape}`}
            style={{
              left: piece.left,
              backgroundColor: piece.color,
              animation: `gift-unlock-confetti-fall ${piece.duration} ease-out ${piece.delay} both`,
              '--gift-drift': piece.drift,
              '--gift-rotation': piece.rotation,
            }}
          />
        ))}
      </div>
      <div
        key={`message-${celebration.id}`}
        role="status"
        aria-live="polite"
        className="gift-unlock-message pointer-events-none fixed left-1/2 top-5 z-[201] -translate-x-1/2 rounded-2xl border border-[#D4AF37]/50 bg-[#102219]/95 px-5 py-3 text-center text-sm text-white shadow-2xl backdrop-blur-xl"
        style={{ animation: 'gift-unlock-message-pop 3.2s ease both' }}
      >
        <span className="block font-bold text-[#FCE096]">🎁 Free gift unlocked!</span>
        <span className="mt-1 block max-w-[min(80vw,32rem)] text-xs text-[#DFD7C4]">{giftNames}</span>
      </div>
    </>
  );
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [isCartAuthPromptOpen, setIsCartAuthPromptOpen] = useState(false);
  const [cartAddEvent, setCartAddEvent] = useState(null);
  const [upsells, setUpsells] = useState([]); 
  const [rulePreview, setRulePreview] = useState(null);
  const [referralReward, setReferralReward] = useState({ balance: 0, estimatedAmount: 0, tiers: [] });
  const [loyalty, setLoyalty] = useState(null);
  const [abandonment, setAbandonment] = useState(null);
  const [couponStackPolicy, setCouponStackPolicy] = useState('both');
  const [affiliateCode, setAffiliateCode] = useState(getStoredAffiliateCode);
  const [affiliateOffer, setAffiliateOffer] = useState(null);
  const [affiliateOfferError, setAffiliateOfferError] = useState('');
  const [affiliateOfferLoading, setAffiliateOfferLoading] = useState(false);
  const [minimumOrderAmount, setMinimumOrderAmount] = useState(599);
  const [rulePreviewLoading, setRulePreviewLoading] = useState(false);
  const [giftCelebration, setGiftCelebration] = useState(null);
  const previousRuleIds = useRef(new Set());
  const skipInitialRulePreview = useRef(true);

  useEffect(() => {
    const incomingCode = new URLSearchParams(window.location.search).get('aff');
    if (incomingCode && /^[A-Z0-9_-]{4,32}$/i.test(incomingCode)) {
      const code = incomingCode.trim().toUpperCase();
      localStorage.setItem(AFFILIATE_ATTRIBUTION_KEY, JSON.stringify({
        code,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      }));
      setAffiliateCode(code);
    }
    affiliateApi.getProgramConfig()
      .then(response => {
        const minimum = Number(response.data?.minimumOrderAmount);
        if (Number.isFinite(minimum) && minimum >= 0) setMinimumOrderAmount(minimum);
      })
      .catch(error => console.error('[AFFILIATE_CHECKOUT_CONFIG]', error));
  }, []);

  useEffect(() => {
    let active = true;
    if (!affiliateCode) {
      setAffiliateOffer(null);
      setAffiliateOfferError('');
      setAffiliateOfferLoading(false);
      return () => { active = false; };
    }
    setAffiliateOfferLoading(true);
    affiliateApi.getOffer(affiliateCode)
      .then(response => {
        if (!active) return;
        setAffiliateOffer(response.data?.offer || null);
        setAffiliateOfferError('');
      })
      .catch(error => {
        if (!active) return;
        setAffiliateOffer(null);
        setAffiliateOfferError(error.response?.data?.message || 'This promoter offer is unavailable.');
      })
      .finally(() => {
        if (active) setAffiliateOfferLoading(false);
      });
    return () => { active = false; };
  }, [affiliateCode]);

  const applyAffiliateCode = async value => {
    const code = String(value || '').trim().toUpperCase();
    if (!/^[A-Z0-9_-]{4,32}$/.test(code)) throw new Error('Enter a valid promoter code.');
    const response = await affiliateApi.getOffer(code);
    localStorage.setItem(AFFILIATE_ATTRIBUTION_KEY, JSON.stringify({
      code,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    }));
    setAffiliateCode(code);
    setAffiliateOffer(response.data?.offer || null);
    setAffiliateOfferError('');
    setAffiliateOfferLoading(false);
  };

  const removeAffiliateCode = () => {
    localStorage.removeItem(AFFILIATE_ATTRIBUTION_KEY);
    setAffiliateCode('');
    setAffiliateOffer(null);
    setAffiliateOfferError('');
  };
  const { isAuthenticated, user } = useAuth();
  const isCustomerAuthenticated = isAuthenticated &&
    !['admin', 'superadmin', 'warehouse_admin'].includes(user?.role);
  const { settings, loadSettings } = useSettings();
  const toast = useToast();

  useEffect(() => {
    if (isCartOpen) void loadSettings();
  }, [isCartOpen, loadSettings]);

  const loadCart = useCallback(async () => {
    if (isCustomerAuthenticated) {
      setCartLoading(true);
      setRulePreviewLoading(true);
      try {
        let guestItems = [];
        let pendingAdd = null;
        try {
          const saved = localStorage.getItem(GUEST_CART_KEY);
          const parsed = saved ? JSON.parse(saved) : [];
          if (Array.isArray(parsed)) guestItems = parsed;
          const pending = localStorage.getItem(PENDING_CART_ADD_KEY);
          pendingAdd = pending ? JSON.parse(pending) : null;
        } catch (error) {
          console.error("Guest cart restore failed:", error);
          toast.error('Your saved bag could not be read. Please try again before continuing.');
          throw error;
        }

        if (pendingAdd) {
          const pendingProductId = getCartProductId(pendingAdd) ?? pendingAdd.productId;
          const pendingQuantity = Number(pendingAdd.quantity);
          if (pendingProductId != null && Number.isInteger(pendingQuantity) && pendingQuantity > 0) {
            const existing = guestItems.find(item => String(getCartProductId(item)) === String(pendingProductId));
            if (existing) {
              existing.quantity = (Number(existing.quantity) || 0) + pendingQuantity;
            } else {
              guestItems.push({
                product_id: pendingProductId,
                id: pendingProductId,
                product: pendingAdd.product || { id: pendingProductId },
                quantity: pendingQuantity,
              });
            }
          }
          localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems));
          localStorage.removeItem(PENDING_CART_ADD_KEY);
        }

        if (guestItems.length > 0) {
          let remainingGuestItems = [...guestItems];
          for (const item of guestItems) {
            let productId = getCartProductId(item);
            const quantity = Number(item.quantity);
            if (productId == null || !Number.isInteger(quantity) || quantity < 1) {
              console.error("Skipping invalid saved guest cart item:", item);
              remainingGuestItems = remainingGuestItems.filter(candidate => candidate !== item);
              continue;
            }
            try {
              const savedProduct = item.product && typeof item.product === 'object' ? item.product : item;
              if ((productId === undefined || productId === null || !Number.isInteger(Number(productId))) && savedProduct.slug) {
                try {
                  const response = await productsApi.getBySlug(savedProduct.slug);
                  const liveProduct = response.data?.data || response.data;
                  const liveProductId = getCartProductId(liveProduct);
                  if (liveProductId !== undefined && liveProductId !== null) {
                    productId = liveProductId;
                  }
                } catch (error) {
                  if (error.response?.status !== 404) throw error;
                }
              }
              await cartApi.add({ productId, quantity });
              remainingGuestItems = remainingGuestItems.filter(candidate => candidate !== item);
              if (remainingGuestItems.length) {
                localStorage.setItem(GUEST_CART_KEY, JSON.stringify(remainingGuestItems));
              } else {
                localStorage.removeItem(GUEST_CART_KEY);
              }
            } catch (error) {
              console.error("Guest bag item could not be merged after sign-in:", error);
            }
          }
          if (remainingGuestItems.length === 0) {
            localStorage.removeItem(GUEST_CART_KEY);
          }
        }

        const res = await cartApi.get();
        const fetchedData = res.data?.items || res.data;
        const serverItems = Array.isArray(fetchedData) ? fetchedData : [];
        setCart(serverItems);
        setRulePreview(res.data?.rulePreview || null);
        setReferralReward(res.data?.referralReward || { balance: 0, estimatedAmount: 0, tiers: [] });
        setLoyalty(res.data?.loyalty || null);
        setAbandonment(res.data?.abandonment || null);
        setCouponStackPolicy(res.data?.couponStackPolicy || 'both');
      } catch (err) {
        console.error("Cart sync failed:", err);
        setCart([]);
        setRulePreview(null);
        setReferralReward({ balance: 0, estimatedAmount: 0, tiers: [] });
        setLoyalty(null);
        setAbandonment(null);
        setCouponStackPolicy('both');
      } finally {
        setCartLoading(false);
        setRulePreviewLoading(false);
      }
    } else {
      try {
        const saved = localStorage.getItem(GUEST_CART_KEY);
        const parsed = saved ? JSON.parse(saved) : [];
        skipInitialRulePreview.current = parsed.length > 0;
        previousRuleIds.current = new Set();
        setCart(Array.isArray(parsed) ? parsed : []);
        setRulePreview(null);
        setReferralReward({ balance: 0, estimatedAmount: 0, tiers: [] });
        setLoyalty(null);
        setAbandonment(null);
        setCouponStackPolicy('both');
      } catch (e) {
        console.error("Local cart parse failed:", e);
        setCart([]);
      }
    }
  }, [isCustomerAuthenticated, toast]);

  const saveGuestCart = (nextCart, failureMessage) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(nextCart));
      setCart(nextCart);
      return true;
    } catch (error) {
      console.error("Guest cart update failed:", error);
      toast.error(failureMessage);
      return false;
    }
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('online', loadCart);
    return () => window.removeEventListener('online', loadCart);
  }, [loadCart]);

  // ZERO-LATENCY OPTIMISTIC UPDATE WITH 100X AI CO-PILOT RESCUE
  const addToCart = async (product, qty = 1) => {
    let prodId = getCartProductId(product);
    if (prodId === undefined || prodId === null) {
      const msg = 'This product cannot be added to your cart right now.';
      toast.error(msg);
      const diag = classifyCartErrorForAiGuide(msg, product, qty, 0);
      triggerAiCopilotAssist({
        ...diag,
        requestedQuantity: qty,
        currentCartQuantity: 0,
        errorMessage: msg,
        autoOpen: true,
      });
      return false;
    }

    let cartProduct;
    try {
      const response = await productsApi.getById(prodId);
      const liveProduct = response.data?.data || response.data;
      if (!liveProduct || typeof liveProduct !== 'object') {
        throw new Error('Product inventory could not be verified.');
      }
      const liveProductId = getCartProductId(liveProduct);
      const liveStock = liveProduct.stock ?? liveProduct.quantity;
      if (
        liveProductId === undefined ||
        liveProductId === null ||
        liveStock === undefined ||
        liveStock === null ||
        liveStock === '' ||
        !Number.isFinite(Number(liveStock))
      ) {
        throw new Error('Current product inventory could not be verified. Please try again.');
      }
      prodId = liveProductId;
      if (liveProduct.status && String(liveProduct.status).toLowerCase() !== 'active') {
        throw new Error(`${liveProduct.name || product.name || 'This product'} is currently unavailable.`);
      }
      cartProduct = { ...product, ...liveProduct };
      cartProduct.stock = Number(liveStock);
      cartProduct.quantity = Number(liveStock);
    } catch (error) {
      const message = error.response?.status === 404
        ? 'This product is no longer available in the current catalog. Refresh the catalog and try again.'
        : error.response?.data?.message || error.message || 'Could not verify current product availability. Please try again.';
      toast.error(message);
      return false;
    }

    const existingItem = (Array.isArray(cart) ? cart : []).find(
      i => String(i.product_id || i.id) === String(prodId)
    );
    const currentQty = Number(existingItem?.quantity || 0);
    const stockError = getClientStockError(cartProduct, currentQty, qty);
    if (stockError) {
      const msg = stockError;
      toast.error(msg);
      const diag = classifyCartErrorForAiGuide(msg, cartProduct, qty, currentQty);
      triggerAiCopilotAssist({
        ...diag,
        requestedQuantity: qty,
        currentCartQuantity: currentQty,
        errorMessage: msg,
        autoOpen: false,
      });
      return false;
    }
    const addProduct = prev => {
      const safeCart = Array.isArray(prev) ? prev : [];
      const updated = [...safeCart];
      const idx = updated.findIndex(i => String(i.product_id || i.id) === String(prodId));
      if (idx > -1) updated[idx] = { ...updated[idx], quantity: (Number(updated[idx].quantity) || 0) + qty };
      else updated.push({ product_id: prodId, id: prodId, product: cartProduct, quantity: qty });
      return updated;
    };

    if (isCustomerAuthenticated) setCart(prev => addProduct(prev));
    else if (!saveGuestCart(addProduct(cart), 'Could not add this product to your cart.')) {
      triggerAiCopilotAssist({
        frictionType: 'cart_general',
        headline: 'Unable to save item to your cart',
        explanation: 'Your browser storage may be full or restricted. Let me guide you through completing your purchase.',
        productId: prodId,
        productName: product?.name || 'Selected Product',
        requestedQuantity: qty,
        autoOpen: true,
      });
      return false;
    }

    if (cartProduct.category === 'Lights' || cartProduct.category_name === 'Lights') {
      setUpsells([{ id: 6, _id: '6', slug: 'kalpvriksh-satva-tulsi-7-tulsi-extract', name: 'Bhumivera Kalpvriksh Satva Tulsi (7-Tulsi Extract)', price: 499, img: '/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp' }]);
    }

    // 3. Background DB Sync
    if (isCustomerAuthenticated) {
      try {
        await cartApi.add({ productId: prodId, quantity: qty });
        await loadCart(); // Re-sync to assure accuracy
        setCartAddEvent({ id: Date.now(), productName: product.name || 'your selection' });
        toast.success('Added to bag successfully.');
        return true;
      } catch (err) {
        console.error("Failed to sync cart add to DB, reverting state", err);
        await loadCart(); // Auto-revert if offline/error
        const errMsg = err.normalized?.message || err.response?.data?.message || 'Could not add this product to your cart.';
        toast.error(errMsg);
        const diag = classifyCartErrorForAiGuide(err, cartProduct, qty, currentQty);
        triggerAiCopilotAssist({
          ...diag,
          requestedQuantity: qty,
          currentCartQuantity: currentQty,
          errorMessage: errMsg,
          autoOpen: false,
        });
        return false;
      }
    }
    setCartAddEvent({ id: Date.now(), productName: product.name || 'your selection' });
    toast.success('Added to bag successfully.');
    return true;
  };

  // Allow AI Co-Pilot rescue drawer to trigger 1-click Add to Bag retries
  useEffect(() => {
    const onRetry = e => {
      const detail = e?.detail || {};
      if (detail.product) {
        void addToCart(detail.product, Number(detail.quantity || 1));
      } else if (detail.productId) {
        void addToCart({ id: detail.productId, name: detail.productName || 'Product' }, Number(detail.quantity || 1));
      }
    };
    window.addEventListener(AI_COPILOT_ADD_CART_RETRY_EVENT, onRetry);
    return () => window.removeEventListener(AI_COPILOT_ADD_CART_RETRY_EVENT, onRetry);
  });

  const updateQuantity = async (productId, newQty, { notify = true } = {}) => {
    if (newQty < 1) return removeFromCart(productId);
    
    // Optimistic Update
    const update = prev => {
      const safeCart = Array.isArray(prev) ? prev : [];
      const updated = [...safeCart];
      const idx = updated.findIndex(i => String(i.product_id || i.id) === String(productId));
      if (idx > -1) updated[idx] = { ...updated[idx], quantity: newQty };
      return updated;
    };
    if (isCustomerAuthenticated) setCart(prev => update(prev));
    else if (!saveGuestCart(update(cart), 'Could not update the cart quantity.')) return false;
    
    if (isCustomerAuthenticated) {
      try {
        await cartApi.updateQuantity(productId, newQty, { notify });
        await loadCart();
      } catch (err) {
        console.error("Quantity update failed", err);
        await loadCart();
        const errMsg = err.normalized?.message || err.response?.data?.message || 'Could not update the cart quantity.';
        toast.error(errMsg);
        triggerAiCopilotAssist({
          frictionType: 'cart_stock_limit',
          headline: 'Unable to increase cart quantity',
          explanation: errMsg,
          productId,
          requestedQuantity: newQty,
          errorMessage: errMsg,
          autoOpen: true,
        });
        return false;
      }
    } else {
      if (notify) toast.success('Cart quantity updated successfully.');
    }
    return true;
  };

  const removeFromCart = async (id, { notify = true } = {}) => {
    const remove = prev => {
      const safeCart = Array.isArray(prev) ? prev : [];
      const updated = safeCart.filter(i => String(i.product_id || i.id) !== String(id));
      return updated;
    };
    if (isCustomerAuthenticated) setCart(prev => remove(prev));
    else if (!saveGuestCart(remove(cart), 'Could not remove this item from your cart.')) return false;

    if (isCustomerAuthenticated) {
      try {
        await cartApi.remove(id, { notify });
        await loadCart();
      } catch (err) {
        console.error("Remove failed", err);
        await loadCart();
        toast.error(err.normalized?.message || 'Could not remove this item from your cart.');
        return false;
      }
    } else {
      if (notify) toast.success('Item removed from your cart.');
    }
    return true;
  };
  
  const clearCart = async () => {
    const previousCart = cart;
    try {
      if (isCustomerAuthenticated) {
        setCart([]);
        await cartApi.clear();
        localStorage.removeItem(GUEST_CART_KEY);
        localStorage.removeItem(PENDING_CART_ADD_KEY);
      } else {
        localStorage.removeItem(GUEST_CART_KEY);
        setCart([]);
      }
      toast.success('Cart cleared successfully.');
      return true;
    } catch (err) {
      setCart(previousCart);
      toast.error(err.normalized?.message || 'Could not clear your cart.');
      return false;
    }
  };

  const getSubtotal = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((acc, item) => {
      const p = item.product || item;
      const price = p.discount_price || p.price || item.unit_price || 0;
      return acc + (price * (item.quantity || 1));
    }, 0);
  };

  useEffect(() => {
    if (isCustomerAuthenticated) return undefined;
    const subtotal = (Array.isArray(cart) ? cart : []).reduce((total, item) => {
      const product = item.product || item;
      const price = Number(product.discount_price || product.price || item.unit_price) || 0;
      return total + price * (Number(item.quantity) || 1);
    }, 0);
    if (subtotal <= 0) {
      setRulePreview(null);
      setRulePreviewLoading(false);
      return undefined;
    }

    let active = true;
    const timer = setTimeout(() => {
      setRulePreviewLoading(true);
      cartRulesApi.preview(subtotal)
        .then(response => {
          if (active) setRulePreview(response.data?.data || response.data || null);
        })
        .catch(error => {
          console.error('[GUEST_CART_RULE_PREVIEW]', error);
          if (active) setRulePreview(null);
        })
        .finally(() => {
          if (active) setRulePreviewLoading(false);
        });
    }, 150);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [cart, isCustomerAuthenticated]);

  useEffect(() => {
    if (!rulePreview) return;
    const currentIds = new Set((rulePreview.matchedRuleIds || []).map(String));
    if (skipInitialRulePreview.current) {
      previousRuleIds.current = currentIds;
      skipInitialRulePreview.current = false;
      return;
    }
    const newlyUnlocked = (rulePreview.matchedRules || []).filter(rule => currentIds.has(String(rule.id)) && !previousRuleIds.current.has(String(rule.id)));
    newlyUnlocked.forEach(rule => toast.success(`🎉 You unlocked ${rule.badge_text || rule.name}`));
    const newGiftNames = [...new Set(newlyUnlocked
      .filter(rule => rule.gift_product_id != null)
      .map(rule => rule.gift_product_name || rule.badge_text || rule.name)
      .filter(Boolean))];
    if (newGiftNames.length) {
      setGiftCelebration({
        id: Date.now(),
        names: newGiftNames,
        onComplete: () => setGiftCelebration(null),
      });
    }
    previousRuleIds.current = currentIds;
  }, [rulePreview, toast]);
  
  const rawThreshold = settings?.free_shipping_threshold;
  const parsedThreshold = Number(rawThreshold);
  const freeShippingThreshold = rawThreshold !== null && rawThreshold !== undefined && rawThreshold !== '' && Number.isFinite(parsedThreshold)
    ? parsedThreshold
    : 5000;
  const shippingProgress = freeShippingThreshold > 0
    ? Math.min((getSubtotal() / freeShippingThreshold) * 100, 100)
    : 100;
  const affiliateDiscount = affiliateOffer
    ? Math.round((getSubtotal() * Number(affiliateOffer.discountPercent || 0) / 100 + Number.EPSILON) * 100) / 100
    : 0;

  return (
    <CartContext.Provider value={{ 
      cartItems: Array.isArray(cart) ? cart : [], 
      loading: cartLoading, 
      isCartOpen, 
      setIsCartOpen,
      isCartAuthPromptOpen,
      closeCartAuthPrompt: ({ keepPending = false } = {}) => {
        setIsCartAuthPromptOpen(false);
        if (!keepPending) localStorage.removeItem(PENDING_CART_ADD_KEY);
      },
      cartAddEvent,
      addToCart, 
      updateQuantity, 
      removeFromCart,
      clearCart,
      upsells,
      getSubtotal,
      shippingProgress,
      freeShippingThreshold,
      rulePreview,
      giftCelebration,
      referralReward,
      loyalty,
      affiliateCode,
      affiliateOffer,
      affiliateOfferError,
      affiliateOfferLoading,
      affiliateDiscount,
      minimumOrderAmount,
      applyAffiliateCode,
      removeAffiliateCode,
      couponStackPolicy,
      rulePreviewLoading,
      abandonment,
      loadCart
    }}>
      {children}
      <GiftUnlockCelebration celebration={giftCelebration} />
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
