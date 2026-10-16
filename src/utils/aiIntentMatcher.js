/**
 * Bhumivera AI Resilient Intent & Typo-Tolerant Resolution Engine
 * Handles misspellings, phonetic approximations, Romanized Indian phrases (Hinglish/Tanglish),
 * and multi-language inputs across all critical customer trouble points.
 */

import { getCurrentLanguage } from './indianLanguageEngine.js';

/**
 * Calculates Damerau-Levenshtein distance between two strings
 */
export function calculateLevenshteinDistance(a = '', b = '') {
  const s1 = String(a).toLowerCase();
  const s2 = String(b).toLowerCase();
  const m = s1.length;
  const n = s2.length;
  if (!m) return n;
  if (!n) return m;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && s1[i - 1] === s2[j - 2] && s1[i - 2] === s2[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }

  return dp[m][n];
}

/**
 * Collapses duplicate characters to single or double instances
 */
export function collapseRepeatedChars(str = '') {
  return String(str).replace(/(.)\1+/g, '$1');
}

/**
 * High-precision intent scoring dictionary
 */
const INTENT_DEFINITIONS = {
  PASSWORD_GUIDE: {
    exactPhrases: [
      'forgot password', 'reset password', 'change password', 'password guide',
      'cant sign in', 'login issue', 'login error', 'password bhul gaya',
      'one time password', 'passpot', 'paswrd', 'pswrd', 'passward',
    ],
    exactKeywords: [
      'password', 'passwords', 'passcode', 'passwords', 'login', 'signin', 'otp',
      'पासवर्ड', 'লগইন', 'கடவுச்சொல்', 'ಪಾಸ್‌ವರ್ಡ್', 'పాస్‌వర్డ్', 'પાસવર્ડ', 'پاس ورڈ',
    ],
    fuzzyTargets: ['password', 'passcode', 'signin'],
  },

  PAYMENT_TROUBLESHOOT: {
    exactPhrases: [
      'money debited', 'money deducted', 'paise kat gaye', 'paise cut gaye',
      'failed payment', 'payment failed', 'transaction failed', 'order not confirmed',
      'cash on delivery', 'cod verification',
    ],
    exactKeywords: [
      'upi', 'gpay', 'phonepe', 'paytm', 'bhim', 'razorpay', 'cod',
      'पेमेंट', 'यूपीआई', 'পেমেন্ট', 'பணம்', 'ಪಾವತಿ', 'చెల్లింపు',
    ],
    fuzzyTargets: ['payment', 'razorpay'],
  },

  ADDRESS_PINPOINT: {
    exactPhrases: [
      'google map', 'pin on map', 'delivery location', 'change address',
      'wrong address', 'ghar ka pata', 'exact location', 'pin location',
    ],
    exactKeywords: [
      'address', 'pincode', 'pinpoint', 'landmark', 'pincod',
      'पिनकोड', 'पता', 'ঠিকানা', 'முகவரி', 'ವಿಳಾಸ', 'చిరునామా', 'સરનામું',
    ],
    fuzzyTargets: ['address', 'pincode', 'pinpoint', 'location'],
  },

  DAMAGED_ITEM_CREDIT: {
    exactPhrases: [
      'courtesy credit', 'store credit', 'wallet credit', 'money back',
      'damaged bottle', 'leaking shampoo', 'broken cap', 'wrong item',
      'paisa wapas', 'kharab product', 'damadge',
    ],
    exactKeywords: [
      'damaged', 'damage', 'damadge', 'leaking', 'leak', 'broken', 'spilled', 'cracked',
      'defective', 'faulty', 'return', 'returns', 'refund', 'refunds', 'exchange',
      'kharaab', 'kharab', 'toota', 'futa', 'रिप्लेसमेंट', 'वापसी',
    ],
    fuzzyTargets: ['damaged', 'leaking', 'refund', 'replacement'],
  },

  ORDER_TRACKING: {
    exactPhrases: [
      'where is my order', 'track my order', 'track shipment', 'live tracking',
      'kahan pahucha', 'kab aayega', 'mera parcel', 'delivery status', 'where is my',
    ],
    exactKeywords: [
      'tracking', 'track', 'trak', 'courier', 'delhivery', 'bluedart', 'dtdc', 'awb',
      'shipment', 'dispatch', 'ordr', 'order', 'orders', 'parcel',
      'ट्रैक', 'ट्रैकिंग', 'ট্র্যাকিং', 'டிராக்கிங்',
    ],
    fuzzyTargets: ['tracking', 'courier', 'shipment', 'delivery', 'order'],
  },

  SKINCARE_LAYERING: {
    exactPhrases: [
      'how to use', 'how to layer', 'morning routine', 'evening routine',
      'am pm routine', 'kaise use kare', 'lagane ka tarika', 'order of products',
    ],
    exactKeywords: [
      'routine', 'layering', 'steps', 'दिनचर्या', 'வரிசை',
    ],
    fuzzyTargets: ['routine', 'layering'],
  },
};

/**
 * Score an input against all intents and return the top match
 */
export function scoreIntent(query = '') {
  const raw = String(query).toLowerCase().trim();
  const collapsed = collapseRepeatedChars(raw);
  const words = raw.split(/[\s,./?!@#$%^&*()_+=-]+/).filter(w => w.length >= 2);

  let bestIntent = null;
  let highestScore = 0;

  for (const [intentName, config] of Object.entries(INTENT_DEFINITIONS)) {
    let score = 0;

    // 1. Exact phrase match (+15 points per phrase)
    for (const phrase of config.exactPhrases) {
      if (raw.includes(phrase) || collapsed.includes(phrase)) {
        score += 15;
      }
    }

    // 2. Exact keyword match (+8 points)
    for (const kw of config.exactKeywords) {
      if (words.includes(kw) || raw.includes(kw)) {
        score += 8;
      }
    }

    // 3. Fuzzy target match (+5 points for 1 edit, +3 points for 2 edits on long words)
    for (const target of config.fuzzyTargets) {
      for (const w of words) {
        if (w.length >= 3 && target.length >= 3) {
          const d = calculateLevenshteinDistance(w, target);
          if (d === 1) {
            score += 5;
          } else if (d === 2 && target.length >= 6 && w[0] === target[0]) {
            score += 3;
          }
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestIntent = intentName;
    }
  }

  // Minimum score threshold to consider an intentional match
  return highestScore >= 5 ? bestIntent : null;
}

/**
 * Resolves critical help guides based on fuzzy intent matching
 */
export function matchAiIntentWithFuzzy(rawQuery = '') {
  const q = String(rawQuery || '').trim();
  if (!q) return null;

  const topIntent = scoreIntent(q);
  if (!topIntent) return null;

  // 1. Password & Account Access Guide
  if (topIntent === 'PASSWORD_GUIDE') {
    return {
      intent: 'PASSWORD_GUIDE',
      reply: [
        '🔐 **Bhumivera AI Password & Account Access Guide**',
        'If you are having trouble logging in, resetting your password, or meeting password requirements, here is everything you need:',
        '**Password Security Requirements (Checked Live):**\n- **Length:** 8 to 72 characters long.\n- **Letters:** At least 1 uppercase (A–Z) & 1 lowercase (a–z).\n- **Numbers & Symbols:** At least 1 number (0–9) and 1 special symbol (!@#$%^&*).\n- **Safety:** Avoid common words like "Password123" or repeating your email username.',
        '**How to Reset Your Password in 3 Easy Steps:**\n1. Visit the [Forgot Password Page](/forgot-password).\n2. Enter your registered email to receive a secure 6-digit OTP.\n3. Enter the OTP code and set your strong new password.',
        '💡 *Need immediate sign-in? If you forgot your password, our concierge can dispatch a 30-minute one-click recovery link directly to your inbox.*',
      ].join('\n\n'),
      quickActions: [
        { id: 'go_forgot_pwd', label: '🔑 Open Forgot Password Page', prompt: 'I want to reset my password on the Forgot Password page' },
        { id: 'otp_help', label: '✉️ Did Not Receive OTP Code?', prompt: 'I did not receive the password OTP verification email' },
        { id: 'contact_auth_agent', label: '👤 Connect to Account Specialist', prompt: 'Connect me with an account support specialist for login help' },
      ],
    };
  }

  // 2. Damaged / Leaking Item & Courtesy Credit Guarantee
  if (topIntent === 'DAMAGED_ITEM_CREDIT') {
    return {
      intent: 'DAMAGED_ITEM_CREDIT',
      reply: [
        '🌿 **Bhumivera Cosmetics Hygiene & Courtesy Protection Guarantee**',
        '*“Zero return shipping hassle — instant replacement or 100% store credit.”*',
        '**Why No Physical Returns?**\nBecause our botanical formulations (Sea Buckthorn Face Wash, Charcoal Face Wash, Kumkumadi Night Elixir, and Botanical Shampoo) are intimate personal care cosmetics, Indian health regulations prohibit restocking or reselling delivered bottles. This guarantees 100% sterile purity for every customer.',
        '**What If Your Item Arrived Damaged, Leaking, or Defective?**\nYou **NEVER** have to pack or return the product! Follow our 3-step courtesy resolution:\n1. **Snap a Photo:** Take a quick picture of the damaged bottle, leaky cap, or package with the shipping label.\n2. **Share with Us:** Message our concierge here, on WhatsApp (+91 74309 85647), or email support@bhumivera.com with your Order ID.\n3. **Instant Resolution:** We approve within 24 hours! Choose between a **Free Express Replacement** dispatched to your door OR **100% Courtesy Store Credit** deposited directly into your Bhumivera Wallet.',
      ].join('\n\n'),
      quickActions: [
        { id: 'damaged_claim', label: '📸 Submit Damaged Item Claim', prompt: 'I want to submit a photo for a damaged bottle replacement or courtesy credit' },
        { id: 'check_wallet', label: '💰 View My Wallet Balance', prompt: 'What is my current Bhumivera Wallet and Courtesy Credit balance?' },
        { id: 'policy_page', label: '📋 View Full Guarantee Policy', prompt: 'Show me the official Courtesy Credit & Hygiene Policy' },
      ],
    };
  }

  // 3. Order Tracking & Delivery Status
  if (topIntent === 'ORDER_TRACKING') {
    return {
      intent: 'ORDER_TRACKING',
      reply: [
        '📦 **Bhumivera Live Express Delivery Tracking Guide**',
        'All Bhumivera orders are hand-calibrated and dispatched from our botanical apothecary via **Delhivery, BlueDart, and DTDC Express** with end-to-end SMS & WhatsApp tracking.',
        '**Standard Delivery Timelines:**\n- **Metro Cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata):** 2 to 3 Business Days.\n- **Tier 2 / Tier 3 Cities:** 3 to 5 Business Days.\n- **Northeast, Jammu & Kashmir, and Remote Pin Codes:** 4 to 6 Business Days.',
        '**How to Track Your Shipment:**\n- Enter your **Order ID** (e.g., `#BHU-84920` or 24-character ID) directly in this chat, or visit our [Live Order Tracking Page](/order-tracking).\n- Once dispatched, you receive a direct AWB tracking link via SMS to monitor the courier truck in real-time.',
      ].join('\n\n'),
      quickActions: [
        { id: 'open_tracker', label: '🚚 Open Order Tracker Page', prompt: 'Open the Live Order Tracking page' },
        { id: 'deliv_estimate', label: '⏱ Check Pin Code Delivery Time', prompt: 'How long will delivery take to my pin code?' },
        { id: 'order_history', label: '📋 View My Recent Orders', prompt: 'Show me my recent orders and tracking status' },
      ],
    };
  }

  // 4. Address Changing & Google Maps Pinpoint Delivery
  if (topIntent === 'ADDRESS_PINPOINT') {
    return {
      intent: 'ADDRESS_PINPOINT',
      reply: [
        '📍 **Address & Exact Google Maps Pinpoint Delivery Guide**',
        'To ensure our courier partners deliver directly to your doorstep without confusing phone calls, Bhumivera supports **Exact GPS Location Pinpointing**:',
        '**How to Update or Pinpoint Your Delivery Address:**\n1. Go to your [Account Address Book](/profile) or the Checkout screen.\n2. Tap **"Use My Live Location / Pin on Map"** to set your exact house entrance on Google Maps.\n3. Ensure your **House/Flat Number, Landmark, and 6-Digit Pin Code** are accurate.',
        '⚠️ **If your order has already been placed:**\n- If status is *Processing*, we can instantly update your delivery address or phone number.\n- If status is *Dispatched / In Transit*, our support desk will contact Delhivery/BlueDart to update the delivery routing instruction.',
      ].join('\n\n'),
      quickActions: [
        { id: 'edit_address', label: '🏠 Update Address in Profile', prompt: 'I want to update my delivery address in my profile' },
        { id: 'change_order_addr', label: '🚚 Change Address for Existing Order', prompt: 'Can I change the delivery address of my pending order?' },
      ],
    };
  }

  // 5. Payment, UPI, & COD Troubleshooting
  if (topIntent === 'PAYMENT_TROUBLESHOOT') {
    return {
      intent: 'PAYMENT_TROUBLESHOOT',
      reply: [
        '💳 **Payment, UPI & Cash on Delivery (COD) Guide**',
        'Bhumivera processes online payments via **100% Secure Razorpay (256-bit SSL encrypted)** supporting UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, Net Banking, and COD.',
        '**Did Money Get Deducted but Order Not Confirmed?**\nDo not worry! This happens if your bank app loses internet connection during the UPI handshake:\n- If Razorpay does not receive the confirmation, the NPCI banking gateway **automatically refunds the full amount to your bank within 2 to 4 business days**.\n- Share your 12-digit UPI UTR number or bank transaction screenshot with our concierge to verify immediate credit.',
        '**Cash on Delivery (COD):**\n- Available on orders up to ₹3,000 across 19,000+ Indian pin codes.\n- You will receive a quick 1-click WhatsApp/SMS verification before dispatch.',
      ].join('\n\n'),
      quickActions: [
        { id: 'verify_payment', label: '🔍 Check Pending Transaction Status', prompt: 'Money was deducted from my UPI but order did not show confirmation' },
        { id: 'cod_query', label: '💵 COD Verification Info', prompt: 'How does Cash on Delivery verification work?' },
      ],
    };
  }

  // 6. Skincare Routine & Layering Order
  if (topIntent === 'SKINCARE_LAYERING') {
    return {
      intent: 'SKINCARE_LAYERING',
      reply: [
        '🌸 **The Signature Bhumivera AM/PM Chronobiological Layering Protocol**',
        '**☀️ Morning Awakening Ritual (7:00 AM – 9:00 AM):**\n1. **Cleanse:** 1 pump of **Sea Buckthorn Face Wash** with lukewarm water (28°C–32°C). Massage for 40s + 15s dwell pause.\n2. **Rinse & Blot:** Splash with cool water and pat to **15% dampness**.\n3. **Hydrate & Protect:** Within 60 seconds, apply your toner or hyaluronic serum, followed by moisturizer and broad-spectrum **SPF 50**.',
        '**🌙 Evening Detox & Renewal Ritual (8:00 PM – 10:30 PM):**\n1. **Detox Cleanse:** 1.5 pumps of **Charcoal Face Wash** to adsorb PM2.5 city pollution, sunscreen, and oxidized sebum.\n2. **Nocturnal Elixir Press:** Warm 2 to 3 drops of **Kumkumadi Night Elixir** (26-Herb Kashmiri Mogra Saffron) between clean palms and gently press upward onto cheeks, forehead, and neck.\n3. **Sleep Repair:** Leave on overnight during your natural 11 PM–2 AM cellular regeneration cycle.',
      ].join('\n\n'),
      quickActions: [
        { id: 'launch_ritual_timer', label: '⏱ Launch 4-Phase Ritual Player', prompt: '__OPEN_RITUAL_PLAYER__' },
        { id: 'kumk_details', label: '🌙 Kumkumadi Night Elixir Guide', prompt: 'Tell me about Kumkumadi Night Elixir and how to apply it' },
        { id: 'sb_wash_details', label: '🍊 Sea Buckthorn Face Wash Actives', prompt: 'Tell me about Sea Buckthorn Face Wash and its key ingredients' },
      ],
    };
  }

  return null;
}
