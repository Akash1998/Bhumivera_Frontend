/**
 * ============================================================================
 * BHUMIVERA 100X AI OMNIPRESENT CUSTOMER CO-PILOT & FRICTION-RESCUE BUS
 * ============================================================================
 * Connects every storefront action (Add to Cart, Quantity Change, Password
 * Setup, Password Reset, Login, OTP Verification, Coupon Application, and
 * Checkout) directly to the Bhumivera AI Support Assistant so customers are
 * proactively guided whenever they encounter friction.
 * ============================================================================
 */

export const AI_COPILOT_EVENT = 'bhumivera:ai-copilot-assist';
export const AI_COPILOT_ADD_CART_RETRY_EVENT = 'bhumivera:ai-copilot-cart-retry';

export const COMPLETE_SITE_NAVIGATION_DIRECTORY = [
  {
    id: 'home',
    category: 'Storefront',
    title: 'Home & Featured Botanicals',
    path: '/',
    description: 'Signature Ayurvedic & botanical formulations, seasonal highlights, and verified customer stories.',
    badge: 'Storefront',
  },
  {
    id: 'shop',
    category: 'Storefront',
    title: 'Shop Full Catalog (/shop)',
    path: '/shop',
    description: 'Browse all formulations with category, price, rating, and in-stock filters.',
    badge: 'Catalog',
  },
  {
    id: 'flash-sales',
    category: 'Storefront',
    title: 'Flash Sales & Limited Deals (/flash-sales)',
    path: '/flash-sales',
    description: 'Time-limited promotional discounts and special bundles.',
    badge: 'Live Deals',
  },
  {
    id: 'compare',
    category: 'Storefront',
    title: 'Compare Formulations (/compare)',
    path: '/compare',
    description: 'Compare ingredients, ratings, benefits, and pricing side by side.',
    badge: 'Compare',
  },
  {
    id: 'wishlist',
    category: 'Shopping & Checkout',
    title: 'Saved Wishlist (/wishlist)',
    path: '/wishlist',
    description: 'View saved products and move them straight into your shopping cart.',
    badge: 'Saved',
  },
  {
    id: 'checkout',
    category: 'Shopping & Checkout',
    title: 'Secure Checkout & Coupons (/checkout)',
    path: '/checkout',
    description: 'Apply promo codes, redeem loyalty points, select delivery speed, and complete payment.',
    badge: 'Checkout',
  },
  {
    id: 'order-tracking',
    category: 'Orders & Tracking',
    title: 'Track Order Live (/order-tracking)',
    path: '/order-tracking',
    description: 'Track any order using your 9-digit Order Number (e.g. BHVM815899599) or courier AWB.',
    badge: 'Live Tracking',
  },
  {
    id: 'verify',
    category: 'Authenticity & Artisanal Custody',
    title: 'Artisanal Serial & Genuinity Test (/verify)',
    path: '/verify',
    description: 'Scan or enter your bottle serial to view individual batch assay, lab pH calibration, and formulation purity certificate.',
    badge: 'Lab Verified',
  },
  {
    id: 'ewarranty',
    category: 'Authenticity & Science',
    title: 'Product Serial Verification (/verify)',
    path: '/verify',
    description: 'Check whether a product serial number matches a Bhumivera product record.',
    badge: 'Authenticity',
  },
  {
    id: 'provenance',
    category: 'Authenticity & Science',
    title: 'Botanical Provenance Engine (/provenance)',
    path: '/provenance',
    description: 'Inspect botanical origin, lab testing standards, and batch purity.',
    badge: 'Lab Verified',
  },
  {
    id: 'science',
    category: 'Authenticity & Science',
    title: 'Bhumivera Science (/science)',
    path: '/science',
    description: 'Explore clinical research and active botanical synergy.',
    badge: 'Science',
  },
  {
    id: 'impact',
    category: 'Authenticity & Science',
    title: 'Earth Impact Ledger (/impact)',
    path: '/impact',
    description: 'Verified tree restoration, river care, and community field reports.',
    badge: 'Sustainability',
  },
  {
    id: 'profile',
    category: 'Account & Security',
    title: 'My Profile, Orders, Wallet & Loyalty (/profile)',
    path: '/profile',
    description: 'Manage orders, GST tax invoices, wallet balance, loyalty tier, referral code, and passkeys.',
    badge: 'My Account',
  },
  {
    id: 'addresses',
    category: 'Account & Security',
    title: 'Address Book (/addresses)',
    path: '/addresses',
    description: 'Manage saved delivery and billing addresses with state & pincode verification.',
    badge: 'Addresses',
  },
  {
    id: 'login',
    category: 'Account & Security',
    title: 'Customer Sign In (/login)',
    path: '/login',
    description: 'Sign in with email & password, Google, or biometric Passkey.',
    badge: 'Sign In',
  },
  {
    id: 'register',
    category: 'Account & Security',
    title: 'Create Customer Account (/register)',
    path: '/register',
    description: 'Register a new account to earn loyalty points and referral rewards.',
    badge: 'Join',
  },
  {
    id: 'forgot-password',
    category: 'Account & Security',
    title: 'Password Recovery & OTP Reset (/forgot-password)',
    path: '/forgot-password',
    description: 'Reset your password using a 6-digit email OTP verification code.',
    badge: 'Password Help',
  },
  {
    id: 'support-center',
    category: 'Support & Policies',
    title: 'Customer Help & Ticket Center (/support-center)',
    path: '/support-center',
    description: 'FAQs, support tickets, live chat, and @BhumiveraBot Telegram handoff.',
    badge: '24/7 Support',
  },
  {
    id: 'contact',
    category: 'Support & Policies',
    title: 'Contact Concierge (/contact)',
    path: '/contact',
    description: 'Send a direct message to our customer care specialists.',
    badge: 'Contact',
  },
  {
    id: 'purchase-protection',
    category: 'Support & Policies',
    title: 'Purchase Protection Guarantee (/purchase-protection)',
    path: '/purchase-protection',
    description: 'Guaranteed authenticity, transit damage protection, and 100% sealed virgin custody standard.',
    badge: 'Guarantee',
  },
  {
    id: 'legal',
    category: 'Support & Policies',
    title: 'Terms, Privacy & Compliance Policies (/legal)',
    path: '/legal',
    description: 'Statutory consumer rights, privacy policy, and terms of service.',
    badge: 'Legal',
  },
  {
    id: 'support-portal',
    category: 'Staff & Admin Portals',
    title: 'Staff Support Desk (/support)',
    path: '/support',
    description: 'Executive (L1), Supervisor (L2), and Manager (L3) order verification and live chat portal.',
    badge: 'Staff Portal',
  },
  {
    id: 'superadmin-support',
    category: 'Staff & Admin Portals',
    title: 'SuperAdmin Support Command Center (/superadminsupport)',
    path: '/superadminsupport',
    description: 'Omnichannel chats, ticket deletion, staff RBAC permissions, and cryptographic audit logs.',
    badge: 'SuperAdmin',
  },
  {
    id: 'admin-dashboard',
    category: 'Staff & Admin Portals',
    title: 'Enterprise Admin & GST Portal (/admin/dashboard)',
    path: '/admin/dashboard',
    description: 'Full store administration, GST & Books, Luxury Tax Invoices, Coupons, and Analytics.',
    badge: 'Admin',
  },
].map(item => ({ label: item.title, ...item }));

const COMMON_WEAK_PASSWORDS = new Set([
  'password', 'password123', 'password123!', '12345678', '123456789', 'qwerty123',
  'welcome123', 'admin123', 'bhumivera', 'bhumivera123', 'iloveyou', 'letmein123',
]);

/**
 * Evaluates a password in real time on the client so the AI Co-Pilot can show
 * an interactive checklist and tell the user the exact rule that is missing.
 */
export function analyzePasswordForAiGuide(candidatePassword = '', email = '') {
  const pwd = String(candidatePassword || '');
  const emailLocal = String(email || '').trim().toLowerCase().split('@')[0] || '';

  const checks = [
    {
      id: 'length',
      label: '8 to 72 characters long',
      passed: pwd.length >= 8 && pwd.length <= 72,
      hint: pwd.length < 8
        ? `Add ${8 - pwd.length} more character(s) (minimum 8 required).`
        : pwd.length > 72
        ? 'Shorten to 72 characters or fewer.'
        : 'Length requirement satisfied.',
    },
    {
      id: 'uppercase',
      label: 'At least 1 uppercase letter (A–Z)',
      passed: /[A-Z]/.test(pwd),
      hint: /[A-Z]/.test(pwd) ? 'Uppercase letter present.' : 'Add at least 1 capital letter (e.g. A, B, M).',
    },
    {
      id: 'lowercase',
      label: 'At least 1 lowercase letter (a–z)',
      passed: /[a-z]/.test(pwd),
      hint: /[a-z]/.test(pwd) ? 'Lowercase letter present.' : 'Add at least 1 lowercase letter (e.g. a, b, m).',
    },
    {
      id: 'digit',
      label: 'At least 1 number (0–9)',
      passed: /\d/.test(pwd),
      hint: /\d/.test(pwd) ? 'Number present.' : 'Add at least 1 digit (e.g. 2, 6, 9).',
    },
    {
      id: 'symbol',
      label: 'At least 1 special symbol (!@#$%^&*)',
      passed: /[^A-Za-z0-9\s]/.test(pwd),
      hint: /[^A-Za-z0-9\s]/.test(pwd) ? 'Special character present.' : 'Add a symbol such as !, @, #, $, or %.',
    },
    {
      id: 'not_common',
      label: 'Not a common or easily guessed password',
      passed: pwd.length > 0 && !COMMON_WEAK_PASSWORDS.has(pwd.toLowerCase()),
      hint: COMMON_WEAK_PASSWORDS.has(pwd.toLowerCase())
        ? 'Avoid common phrases like Password123! — combine 2 unique words with a number and symbol.'
        : 'Uniqueness check passed.',
    },
    {
      id: 'not_email',
      label: 'Does not contain your email username',
      passed: !emailLocal || emailLocal.length < 3 || !pwd.toLowerCase().includes(emailLocal),
      hint: emailLocal && emailLocal.length >= 3 && pwd.toLowerCase().includes(emailLocal)
        ? 'Remove your email username from the password.'
        : 'Does not repeat email username.',
    },
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const failed = checks.filter(c => !c.passed);

  return {
    isCompliant: failed.length === 0,
    scorePercent: Math.round((passedCount / checks.length) * 100),
    checks,
    failed,
    nextStepSummary:
      failed.length === 0
        ? 'All password security requirements are met! You can submit the form now.'
        : `Missing ${failed.length} requirement(s): ${failed.map(f => f.hint).join(' ')}`,
    suggestedExample: 'Botanical#2026! (Memorable word + capital + number + symbol)',
  };
}

/**
 * Classifies an Add-to-Cart or Cart Quantity update failure so the AI Assistant
 * can immediately explain the issue and provide a 1-click rescue action.
 */
export function classifyCartErrorForAiGuide(error, product = null, requestedQuantity = 1, currentCartQuantity = 0) {
  const rawMessage =
    error?.response?.data?.message ||
    error?.message ||
    (typeof error === 'string' ? error : 'Unable to add item to cart.');
  const lower = String(rawMessage).toLowerCase();
  const productName = product?.name || 'this item';
  const stock = product?.stock !== undefined ? Number(product.stock) : product?.quantity !== undefined ? Number(product.quantity) : null;

  if (stock !== null && stock <= 0 || lower.includes('out of stock') || lower.includes('sold out')) {
    return {
      frictionType: 'cart_out_of_stock',
      cause: 'out_of_stock',
      headline: `${productName} is currently out of stock`,
      explanation: `Our warehouse inventory has 0 units available for ${productName}. I can show you in-stock alternatives in the same category or set up a restock alert for you.`,
      steps: [
        'Browse in-stock formulations in our Shop catalog.',
        'Or ask me to notify you as soon as the next batch is bottled.',
      ],
      productId: product?.id || product?._id || null,
      productName,
    };
  }

  if (lower.includes('exceed') || lower.includes('available in stock') || (stock !== null && (currentCartQuantity + requestedQuantity) > stock)) {
    const maxAddable = stock !== null ? Math.max(0, stock - currentCartQuantity) : 1;
    return {
      frictionType: 'cart_stock_limit',
      cause: 'insufficient_stock_for_qty',
      headline: `Only ${stock ?? maxAddable} unit(s) of ${productName} available`,
      explanation: `You tried to add ${requestedQuantity} unit(s) (total ${currentCartQuantity + requestedQuantity}), which exceeds the ${stock ?? maxAddable} unit(s) currently in stock.`,
      steps: [
        maxAddable > 0
          ? `Reduce the quantity to ${maxAddable} unit(s) and click Add to Cart.`
          : `You already have all ${stock} available unit(s) in your cart! Proceed to Checkout to complete your order.`,
      ],
      productId: product?.id || product?._id || null,
      productName,
      maxAddable,
    };
  }

  if (lower.includes('variant') || lower.includes('option') || lower.includes('size')) {
    return {
      frictionType: 'cart_variant_required',
      cause: 'variant_required',
      headline: `Select an option for ${productName} first`,
      explanation: 'Please click on a pack size or variant option badge above the Add to Cart button before adding the item.',
      steps: [
        'Select your preferred size/variant option.',
        'Then click Add to Cart.',
      ],
      productId: product?.id || product?._id || null,
      productName,
    };
  }

  return {
    frictionType: 'cart_general',
    cause: 'general_cart_issue',
    headline: `Need help adding ${productName} to your cart?`,
    explanation: rawMessage,
    steps: [
      'Ensure you have selected a valid quantity (1 or more).',
      'Click "Retry Add to Cart" in the AI Co-Pilot panel or open /shop to add directly.',
    ],
    productId: product?.id || product?._id || null,
    productName,
  };
}

/**
 * Emits a global AI Co-Pilot rescue event so `SupportAssistant.jsx` opens or
 * displays an interactive rescue card with 1-click fixes.
 */
export function triggerAiCopilotAssist(detail = {}) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(
      new CustomEvent(AI_COPILOT_EVENT, {
        detail: {
          timestamp: Date.now(),
          autoOpen: detail.autoOpen !== false,
          ...detail,
        },
      })
    );
  } catch (err) {
    console.error('[AI_COPILOT_EVENT_ERROR]', err);
  }
}
