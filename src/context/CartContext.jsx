import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useSettings } from "./SettingsContext";
import { cart as cartApi, products as productsApi } from "../services/api";
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

export const getCartProductId = product => product?.product_id ?? product?._id ?? product?.id;

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
  const [rulePreviewLoading, setRulePreviewLoading] = useState(false);
  const previousRuleIds = useRef(null);
  const { isAuthenticated, user } = useAuth();
  const isCustomerAuthenticated = isAuthenticated &&
    !['admin', 'superadmin', 'warehouse_admin'].includes(user?.role);
  const { settings } = useSettings();
  const toast = useToast();

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

        let remainingGuestItems = [...guestItems];
        for (const item of guestItems) {
          let productId = getCartProductId(item);
          const quantity = Number(item.quantity);
          if (productId == null || !Number.isInteger(quantity) || quantity < 1) {
            console.error("Skipping invalid saved guest cart item:", item);
            continue;
          }
          try {
            const savedProduct = item.product && typeof item.product === 'object' ? item.product : item;
            if (savedProduct.slug) {
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
            toast.error(error.response?.data?.message || 'Some items from your saved bag could not be moved to your account.');
            break;
          }
        }

        const res = await cartApi.get();
        const fetchedData = res.data?.items || res.data;
        const serverItems = Array.isArray(fetchedData) ? fetchedData : [];
        const unmergedItems = remainingGuestItems.filter(item =>
          !serverItems.some(serverItem => String(getCartProductId(serverItem)) === String(getCartProductId(item)))
        );
        setCart([...serverItems, ...unmergedItems]);
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

    if (!isCustomerAuthenticated) {
      try {
        localStorage.setItem(PENDING_CART_ADD_KEY, JSON.stringify({
          product: { ...product, id: prodId },
          productId: prodId,
          quantity: qty,
        }));
        setIsCartAuthPromptOpen(true);
        return false;
      } catch (error) {
        console.error("Pending bag item could not be saved:", error);
        toast.error('Could not save this item before sign-in. Please try again.');
        return false;
      }
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

    setIsCartOpen(true);

    if (cartProduct.category === 'Lights' || cartProduct.category_name === 'Lights') {
      setUpsells([{ _id: 'rel_1', name: 'Heavy Duty Wiring Relay', price: 499, img: '/logo.webp' }]);
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
    if (!rulePreview) return;
    const currentIds = new Set((rulePreview.matchedRuleIds || []).map(String));
    if (previousRuleIds.current) {
      const newlyUnlocked = (rulePreview.matchedRules || []).filter(rule => currentIds.has(String(rule.id)) && !previousRuleIds.current.has(String(rule.id)));
      newlyUnlocked.forEach(rule => toast.success(`🎉 You unlocked ${rule.badge_text || rule.name}`));
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
      referralReward,
      loyalty,
      couponStackPolicy,
      rulePreviewLoading,
      abandonment,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
