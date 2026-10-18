/**
 * BHUMIVERA MAISON — 100% DETERMINISTIC MASTER KNOWLEDGE TREE & INSTANT FINDER ENGINE
 * 
 * Provides structured decision-tree nodes, visual step-by-step resolution workflows,
 * high-converting sales product cards (with 1-click Add to Bag & Buy Now), and a
 * sub-5ms prefix & fuzzy autocomplete index across the entire website.
 */

export const MASTER_PILLARS = [
  {
    id: 'product_discovery_sales',
    title: 'Shop & Routine Concierge',
    shortTitle: 'Shop & Skincare',
    iconName: 'ShoppingBag',
    accentColor: '#D4AF37',
    badge: 'Sales & Recommendations',
    description: 'Bespoke botanical cleansers, active elixirs, skin diagnostics, and 1-click ordering.',
  },
  {
    id: 'account_security',
    title: 'Account & Security',
    shortTitle: 'Account & Login',
    iconName: 'Lock',
    accentColor: '#E07A24',
    badge: 'Password & OTP',
    description: 'Forgot password visual guides, OTP rescue, password policies, and profile settings.',
  },
  {
    id: 'orders_tracking',
    title: 'Orders & Live Tracking',
    shortTitle: 'Track Orders',
    iconName: 'Truck',
    accentColor: '#2D8A5E',
    badge: 'Live Status & Dispatch',
    description: 'Real-time AWB courier tracking (BlueDart/Delhivery/DTDC), dispatch cutoff, and timelines.',
  },
  {
    id: 'returns_cancellations',
    title: 'Returns & Refunds',
    shortTitle: 'Returns & RMA',
    iconName: 'RotateCcw',
    accentColor: '#C25E5E',
    badge: '7-Day Policy',
    description: '7-day self-service returns, instant Bhumivera Wallet credits, and cancellation guidelines.',
  },
  {
    id: 'payments_wallet_gst',
    title: 'Payments, Wallet & GST',
    shortTitle: 'Payments & GST',
    iconName: 'CreditCard',
    accentColor: '#3B82F6',
    badge: 'Instant Invoices',
    description: 'UPI/Cards/COD, B2B GST tax invoice downloads, Bhumivera Wallet coins, and refunds.',
  },
  {
    id: 'botanical_science',
    title: 'Botanical Science & Lab',
    shortTitle: 'Science & Lab',
    iconName: 'Leaf',
    accentColor: '#10B981',
    badge: 'Terroir & Actives',
    description: 'Himalayan wild-harvesting, supercritical CO2 extraction, pH 5.5 balance, and INCI.',
  },
  {
    id: 'offers_ambassador',
    title: 'Offers & Ambassador',
    shortTitle: 'Offers & Coins',
    iconName: 'Gift',
    accentColor: '#F59E0B',
    badge: '10% Commission',
    description: 'Active discount coupons, Spin & Win rewards, and Brand Ambassador referral program.',
  },
  {
    id: 'human_escalation',
    title: 'Specialist Escalation',
    shortTitle: 'Human Support',
    iconName: 'PhoneCall',
    accentColor: '#8B5CF6',
    badge: 'Verified Callback',
    description: 'Anti-spam 3-step order verification for scheduled morning, afternoon, or evening callbacks.',
  },
];

export const KNOWLEDGE_TREE_NODES = [
  // =========================================================================
  // PILLAR 1: PRODUCT DISCOVERY & SALES CONCIERGE (DESIGNED TO CONVERT)
  // =========================================================================
  {
    id: 'product_sea_buckthorn_facewash',
    pillarId: 'product_discovery_sales',
    title: 'Himalayan Sea Buckthorn Face Wash',
    badge: 'Best-Seller · Radiant Glow',
    summary: 'Cold-pressed Himalayan berry Omega-7 + 1% Niacinamide + 0.5% Hyaluronic Acid for daily barrier repair.',
    keywords: [
      'sea buckthorn', 'seabuckthorn', 'face wash', 'facewash', 'cleanser', 'glow', 'omega 7',
      'dry skin', 'dull skin', 'niacinamide', 'hyaluronic', 'buy facewash', 'shop facewash',
      'best facewash', 'sea buckthorn price', 'ingredients'
    ],
    productData: {
      id: 8,
      _id: '8',
      name: 'Seabuckthorn Face wash by Bhumivera',
      slug: 'aloe vera face wash',
      price: 499,
      discount_price: 399,
      discountPercent: '21% OFF',
      rating: 4.9,
      reviewsCount: 128,
      sku: 'BV-SBFW-100ML',
      inStock: true,
      stockCount: 92,
      image_url: '/assets/images/seabuckthorn.webp',
      keyActives: [
        { name: 'Himalayan Sea Buckthorn', conc: 'Cold-Pressed Omega-7 Berry Extract (2%)' },
        { name: 'Niacinamide (Vitamin B3)', conc: '1.0% Active Strength' },
        { name: 'Hyaluronic Acid', conc: '0.1% Sodium Hyaluronate' },
        { name: 'Aloe Vera Inner Fillet', conc: '5.0% Soothing Juice' },
        { name: 'Sacred Tulsi', conc: '0.5% Microbiome Defense' },
      ],
      phLevel: 'pH 5.5 (Skin-Identical)',
      volume: '100 ml / 3.38 fl. oz. Amber Glass Pump',
      ritualTiming: 'Twice Daily: AM Antioxidant Shield & PM Barrier Reset (30–45s Massage)',
      bundleRecommendation: {
        title: 'Complete the Radiance Ritual',
        description: 'Pair with Kashmiri Saffron Kumkumadi Night Elixir for 24h cellular nourishment & save ₹250.',
        bundleSlug: '9',
      },
    },
    richContent: `
### 🌿 Formulatory Science & Efficacy
- **Himalayan Sea Buckthorn (Omega-7)**: Sourced from Ladakh at 3,500m altitude. Biomimetically replicates youthful human sebum lipids without clogging pores.
- **1% Niacinamide**: Refines enlarged pores, regulates sebum excretion, and suppresses post-blemish redness.
- **pH 5.5 Zero-Sulfate Matrix**: Uses plant-derived decyl glucoside so your natural protective acid mantle is never stripped.
    `,
    directActions: [
      { label: '🛒 Add to Bag (₹399)', actionType: 'ADD_TO_CART', payload: { id: 8, name: 'Seabuckthorn Face wash by Bhumivera', price: 499, discount_price: 399, slug: 'aloe vera face wash', image_url: '/assets/images/seabuckthorn.webp' } },
      { label: '⚡ Buy Now · Instant Checkout', actionType: 'BUY_NOW', payload: { id: 8, name: 'Seabuckthorn Face wash by Bhumivera', price: 499, discount_price: 399, slug: 'aloe vera face wash', image_url: '/assets/images/seabuckthorn.webp' } },
      { label: '✨ View Complete Botanical INCI', actionType: 'NAVIGATE', target: '/product/8' },
    ],
    relatedSuggestions: [
      'product_charcoal_facewash',
      'product_kumkumadi_elixir',
      'skin_diagnostic_matcher',
      'routine_layering_guide',
    ],
  },
  {
    id: 'product_charcoal_facewash',
    pillarId: 'product_discovery_sales',
    title: 'Activated Bamboo Charcoal Face Wash',
    badge: 'Deep Pore Clarifying · Anti-Pollution',
    summary: '3% Activated Bamboo Charcoal + 0.5% Neem + 0.5% Turmeric for blemish, oil & PM2.5 pollution control.',
    keywords: [
      'charcoal', 'activated charcoal', 'bamboo charcoal', 'oily skin', 'acne', 'pimples',
      'blackheads', 'pores', 'neem', 'turmeric', 'pollution', 'pm2.5', 'face wash', 'facewash',
      'charcoal price', 'charcoal ingredients'
    ],
    productData: {
      id: 9,
      _id: '9',
      name: 'Charcoal face wash',
      slug: 'charcoal-face-wash',
      price: 399,
      discount_price: 299,
      discountPercent: '23% OFF',
      rating: 4.8,
      reviewsCount: 96,
      sku: 'BV-CHFW-100ML',
      inStock: true,
      stockCount: 87,
      image_url: '/assets/images/charcoalFace wash.webp',
      keyActives: [
        { name: 'Activated Bamboo Carbon', conc: '3.0% Microporous Adsorption' },
        { name: 'Ayurvedic Haridra (Turmeric)', conc: '0.5% Curcuminoid Anti-Inflammatory' },
        { name: 'Sacred Neem Extract', conc: '0.5% C. acnes Clarifying' },
        { name: 'Botanical Glycerin', conc: '5.0% Moisture Osmoprotectant' },
        { name: 'Cucumber Extract', conc: '0.5% Capillary Soothing' },
      ],
      phLevel: 'pH 5.51 (Skin-Identical Clarifying)',
      volume: '100 ml / 3.38 fl. oz. UV-Protected Gold-Trim Bottle',
      ritualTiming: 'Twice Daily: AM Fresh Awakening & PM Deep Urban Pollution Clear (60s Circular Massage)',
      bundleRecommendation: {
        title: 'Post-Wash Clarifying Ritual',
        description: 'Pair with Sea Buckthorn Face Wash in an AM/PM dual regimen (Charcoal at night, Sea Buckthorn in morning).',
        bundleSlug: '8',
      },
    },
    richContent: `
### 🌪️ Deep Urban Pore Purification
- **3% Microporous Carbon**: Van der Waals adsorption captures airborne PM2.5 heavy metals and oxidized sebum without physical micro-tears.
- **Neem & Turmeric Defense**: Naturally curbs *Cutibacterium acnes* bacterial proliferation while minimizing post-breakout redness.
- **5% Glycerin Humectant Buffer**: Leaves skin cleanly purified without the tightness common to conventional charcoal cleansers.
    `,
    directActions: [
      { label: '🛒 Add to Bag (₹299)', actionType: 'ADD_TO_CART', payload: { id: 9, name: 'Charcoal face wash', price: 399, discount_price: 299, slug: 'charcoal-face-wash', image_url: '/assets/images/charcoalFace wash.webp' } },
      { label: '⚡ Buy Now · Instant Checkout', actionType: 'BUY_NOW', payload: { id: 9, name: 'Charcoal face wash', price: 399, discount_price: 299, slug: 'charcoal-face-wash', image_url: '/assets/images/charcoalFace wash.webp' } },
      { label: '✨ View Complete Botanical INCI', actionType: 'NAVIGATE', target: '/product/9' },
    ],
    relatedSuggestions: [
      'product_sea_buckthorn_facewash',
      'skin_diagnostic_matcher',
      'routine_layering_guide',
    ],
  },
  {
    id: 'product_kumkumadi_elixir',
    pillarId: 'product_discovery_sales',
    title: 'Kashmiri Saffron Kumkumadi Night Elixir',
    badge: 'Artisanal Luxury · Overnight Golden Radiance',
    summary: 'Classical 26-herb Ayurvedic night oil with Pampore Kashmiri Saffron, Red Sandalwood & Manjistha.',
    keywords: [
      'kumkumadi', 'kumkumadi tailam', 'night elixir', 'saffron', 'kesar', 'pigmentation',
      'dark spots', 'fine lines', 'anti aging', 'glow oil', 'face oil', 'night oil', 'kashmiri saffron'
    ],
    productData: {
      id: 103,
      _id: '103',
      name: 'Bhumivera Kashmiri Saffron Kumkumadi Night Elixir',
      slug: 'bhumivera-kumkumadi-night-elixir',
      price: 1499,
      discount_price: 1199,
      discountPercent: '20% OFF',
      rating: 4.95,
      reviewsCount: 142,
      sku: 'BV-KMNE-30ML',
      inStock: false,
      stockCount: 0,
      image_url: '/assets/images/Promo4.webp',
      keyActives: [
        { name: 'Pampore Kashmiri Saffron (Mongra)', conc: 'Crocin & Safranal Radiance Extract' },
        { name: 'Rakta Chandana (Red Sandalwood)', conc: 'Cooling Micro-Circulation Support' },
        { name: 'Indian Madder (Manjistha)', conc: 'Tyrosinase Inhibiting Anthraquinones' },
        { name: 'Pure Sesame & Jojoba Matrix', conc: 'Cold-Pressed Lipid Carrier' },
      ],
      phLevel: 'Anhydrous Botanical Lipid Elixir (100% Water-Free)',
      volume: '30 ml / 1.0 fl. oz. Amber Glass Pipette Dropper',
      ritualTiming: 'PM Night Ritual: Warm 2–3 drops between palms & gently press into damp facial skin.',
    },
    richContent: `
### 🌙 Overnight Cellular Rejuvenation
- **Authentic Pampore Saffron**: Rich in crocin and safranal that accelerate epidermal renewal and fade stubborn sun tan and post-inflammatory dark spots.
- **Rakta Chandana & Manjistha**: Promotes even skin tone, relieves daily photo-damage, and seals in essential barrier lipids while you sleep.
    `,
    directActions: [
      { label: '✨ View Formulation Story', actionType: 'NAVIGATE', target: '/product/bhumivera-kumkumadi-night-elixir' },
    ],
    relatedSuggestions: [
      'product_sea_buckthorn_facewash',
      'routine_layering_guide',
    ],
  },
  {
    id: 'product_shampoo_amla_bhringraj',
    pillarId: 'product_discovery_sales',
    title: 'Amla & Bhringraj Botanical Shampoo',
    badge: 'Zero Sulfates · Follicle Strength',
    summary: 'Reetha & Shikakai natural saponins + Bhringraj, Rosemary Oil & Triphala to curb hair fall.',
    keywords: [
      'shampoo', 'hair wash', 'hair cleanser', 'hair fall', 'dandruff', 'amla', 'bhringraj',
      'rosemary oil', 'shikakai', 'reetha', 'sulfate free', 'scalp care', 'hair growth'
    ],
    productData: {
      id: 104,
      _id: '104',
      name: 'Bhumivera Botanical Hair Cleanser & Shampoo',
      slug: 'bhumivera-amla-bhringraj-botanical-shampoo',
      price: 799,
      discount_price: 629,
      discountPercent: '21% OFF',
      rating: 4.85,
      reviewsCount: 84,
      sku: 'BV-ARSH-200ML',
      inStock: false,
      stockCount: 0,
      image_url: '/assets/images/Promo3.webp',
      keyActives: [
        { name: 'Reetha (25mg) & Shikakai (5mg)', conc: 'Natural Saponin Gentle Lather' },
        { name: 'Rosemary Essential Oil (10mg)', conc: 'Scalp Micro-Capillary Perfusion' },
        { name: 'Bhringraj (10mg)', conc: 'Anagen Phase Follicle Upregulation' },
        { name: 'Organic Amla (20mg)', conc: 'Bioavailable Vitamin C & Root Tannins' },
        { name: 'Triphala & Neem (10mg each)', conc: 'Broad-Spectrum Scalp Clarifying' },
      ],
      phLevel: 'pH 5.2 (Cuticle-Sealing Natural Balance)',
      volume: '200 ml / 6.76 fl. oz. Ergonomic Dispenser',
      ritualTiming: '2–3 Times Weekly: Massage on wet scalp for 2–3 minutes before rinsing with cool water.',
    },
    richContent: `
### 🌾 Botanical Scalp & Follicle Therapy
- **Zero Sulfates, Zero Synthetic Silicones**: Cleanses with plant-derived saponins that preserve scalp microbiome balance without silicone buildup.
- **Rosemary & Bhringraj Clinical Synergy**: Stimulates microcapillary blood flow to hair roots, supporting natural follicle resilience and reduced shedding.
    `,
    directActions: [
    ],
    relatedSuggestions: [
      'product_sea_buckthorn_facewash',
      'offers_free_shipping_info',
    ],
  },
  {
    id: 'skin_diagnostic_matcher',
    pillarId: 'product_discovery_sales',
    title: 'Skincare Diagnostic & Routine Matcher',
    badge: 'Personalized Diagnostic',
    summary: 'Select your primary skin or hair goal to receive the exact clinically calibrated Bhumivera formulation.',
    keywords: [
      'skin diagnostic', 'skin type', 'recommendation', 'which product', 'what to buy',
      'help me choose', 'skin quiz', 'dry skin', 'oily skin', 'sensitive skin', 'routine'
    ],
    richContent: `
### 🎯 Find Your Ideal Bhumivera Botanical Match

Tap any category below to immediately explore verified active formulations:

- **For Oily, Congested & Acne-Prone Skin**:
  Choose **Activated Bamboo Charcoal Face Wash** (3% Micro-Carbon + Neem + Turmeric).
- **For Dry, Dull, Dehydrated or Barrier-Compromised Skin**:
  Choose **Himalayan Sea Buckthorn Face Wash** (Omega-7 + 1% Niacinamide + 0.5% Hyaluronic Acid).
- **For Sun Damage, Hyperpigmentation & Overnight Luminosity**:
  Choose **Kashmiri Saffron Kumkumadi Night Elixir** (26 Classical Ayurvedic Botanicals).
- **For Excessive Hair Fall & Congested Scalp**:
  Choose **Amla & Bhringraj Botanical Shampoo** (Rosemary Oil + Reetha + Shikakai).
    `,
    directActions: [
      { label: '🌿 Explore Sea Buckthorn (Dull / Dry Skin)', actionType: 'VIEW_NODE', target: 'product_sea_buckthorn_facewash' },
      { label: '🌪️ Explore Charcoal (Acne / Oily Skin)', actionType: 'VIEW_NODE', target: 'product_charcoal_facewash' },
      { label: '🌙 Explore Kumkumadi (Pigmentation / Glow)', actionType: 'VIEW_NODE', target: 'product_kumkumadi_elixir' },
      { label: '🌾 Explore Shampoo (Hair Fall / Scalp)', actionType: 'VIEW_NODE', target: 'product_shampoo_amla_bhringraj' },
    ],
    relatedSuggestions: [
      'routine_layering_guide',
      'offers_active_coupons',
    ],
  },
  {
    id: 'routine_layering_guide',
    pillarId: 'product_discovery_sales',
    title: 'Daily AM/PM Layering Protocol',
    badge: 'Clinical Protocol',
    summary: 'The optimal sequence to cleanse, treat, and seal botanical moisture for maximum absorption.',
    keywords: [
      'layering', 'routine', 'how to use', 'am pm', 'morning routine', 'night routine',
      'order of application', 'how to layer', 'regimen'
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Gentle Cleansing (AM/PM)',
        description: 'Massage Sea Buckthorn (AM) or Charcoal (PM) on damp skin for 30–45s with lukewarm water. Rinse thoroughly.',
      },
      {
        stepNumber: 2,
        title: 'Hydrating Toners & Serums',
        description: 'While skin is still slightly dewy, apply your water-based botanical essence or hyaluronic serum.',
      },
      {
        stepNumber: 3,
        title: 'Active Seal & Protection',
        description: 'In PM: Warm 2–3 drops of Kumkumadi Night Elixir between palms and press into skin. In AM: Apply lightweight moisturizer followed by SPF 50.',
      },
    ],
    richContent: `
Applying botanical actives from thinnest (water-based) to thickest (lipid elixirs) ensures 100% cellular penetration without pill formation.
    `,
    directActions: [
      { label: '🛍️ Shop Full Collection', actionType: 'NAVIGATE', target: '/products' },
      { label: '🌿 Explore Sea Buckthorn Cleanser', actionType: 'VIEW_NODE', target: 'product_sea_buckthorn_facewash' },
    ],
    relatedSuggestions: [
      'product_sea_buckthorn_facewash',
      'product_kumkumadi_elixir',
    ],
  },

  // =========================================================================
  // PILLAR 2: ACCOUNT & SECURITY (FORGOT PASSWORD, OTP, AUTH RESCUE)
  // =========================================================================
  {
    id: 'account_forgot_password_guide',
    pillarId: 'account_security',
    title: 'Forgot Password — Step-by-Step Reset Guide',
    badge: 'Account Security · Instant Solution',
    summary: 'Follow the 4-step verified workflow to reset your Bhumivera account password using a secure 6-digit email OTP.',
    keywords: [
      'forgot password', 'forg', 'forgot', 'password', 'pass', 'reset password', 'change password',
      'cant login', 'cannot login', 'recover password', 'lost password', 'reset link', 'otp reset',
      'login help', 'signin help', 'new password', 'forgot pwd', 'reset pwd'
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Navigate to Sign In',
        description: 'Click the Profile icon at the top-right header of any Bhumivera page, or open the Sign In page directly.',
      },
      {
        stepNumber: 2,
        title: 'Select "Forgot Password?"',
        description: 'On the sign-in modal or page, tap the gold "Forgot Password?" link positioned right below the password field.',
      },
      {
        stepNumber: 3,
        title: 'Enter Registered Email',
        description: 'Type in the exact email address you used when creating your Bhumivera account and tap "Send 6-Digit OTP".',
      },
      {
        stepNumber: 4,
        title: 'Verify OTP & Set New Password',
        description: 'Check your email inbox (and Spam/Promotions folder) for the 6-digit code. Enter it, choose a secure 8+ character password, and sign in!',
      },
    ],
    richContent: `
### 🔐 Fortress Account Protection Protocol
- **Fast Email Delivery**: Reset OTPs dispatch automatically within 10 seconds and remain active for **10 minutes**.
- **Password Strength Requirement**: At least 8 characters, containing uppercase letters, numbers, and a symbol.
- **Direct Link Support**: You can also request an AI 1-click password setup link sent straight to your verified mailbox.
    `,
    directActions: [
      { label: '🚀 Open Password Reset Page Now', actionType: 'NAVIGATE', target: '/forgot-password' },
      { label: '🔑 Go to Sign In / Login Page', actionType: 'NAVIGATE', target: '/login' },
      { label: '📩 Didn\'t Receive OTP? Troubleshooting', actionType: 'VIEW_NODE', target: 'account_otp_not_received' },
    ],
    relatedSuggestions: [
      'account_otp_not_received',
      'account_password_policy',
      'account_login_troubleshooting',
    ],
  },
  {
    id: 'account_otp_not_received',
    pillarId: 'account_security',
    title: 'Didn\'t Receive the 6-Digit Email OTP?',
    badge: 'Email Delivery Rescue',
    summary: 'Quick checklist to ensure your OTP email is received without delay.',
    keywords: [
      'otp', 'otp not received', 'didnt get otp', 'no otp', 'otp delay', 'otp expired',
      'email otp', 'verification code', 'code not coming', 'otp issue'
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Check Spam & Promotions Folders',
        description: 'Certain email providers (Gmail, Yahoo, Outlook) occasionally route automated security codes to the "Promotions" or "Spam" tabs.',
      },
      {
        stepNumber: 2,
        title: 'Verify Email Spelling',
        description: 'Double check for typos (e.g., .con instead of .com, missing letters, extra spaces).',
      },
      {
        stepNumber: 3,
        title: 'Wait 60s & Click "Resend OTP"',
        description: 'To protect against rate-limit abuse, the Resend button activates 60 seconds after your initial request.',
      },
    ],
    richContent: `
> [!TIP]
> Whitelist **adminbhumivera27@gmail.com** or mark our emails as "Not Spam" to ensure all future order and security notifications land directly in your primary inbox.
    `,
    directActions: [
      { label: '🔄 Return to Forgot Password Page', actionType: 'NAVIGATE', target: '/forgot-password' },
      { label: '📞 Speak to Support Specialist', actionType: 'VIEW_NODE', target: 'human_callback_wizard' },
    ],
    relatedSuggestions: [
      'account_forgot_password_guide',
      'account_login_troubleshooting',
    ],
  },
  {
    id: 'account_password_policy',
    pillarId: 'account_security',
    title: 'Password Rules & Fortress Security',
    badge: 'Security Standards',
    summary: 'Guidelines for setting an unbreakable password on Bhumivera.',
    keywords: [
      'password rules', 'password requirements', 'weak password', 'strong password',
      'password criteria', 'password policy'
    ],
    richContent: `
### 🛡️ Secure Account Password Standards
Your password must satisfy:
- **Minimum 8 characters** in total length.
- **At least 1 uppercase letter** (A–Z) and **1 lowercase letter** (a–z).
- **At least 1 numerical digit** (0–9).
- **At least 1 special character** (!@#$%^&*).
- Cannot contain your full name or registered email prefix.
    `,
    directActions: [
      { label: '🚀 Reset Password Now', actionType: 'NAVIGATE', target: '/forgot-password' },
    ],
    relatedSuggestions: [
      'account_forgot_password_guide',
    ],
  },
  {
    id: 'account_login_troubleshooting',
    pillarId: 'account_security',
    title: 'Login & Sign-In Troubleshooting',
    badge: 'Account Access',
    summary: 'Solutions for incorrect credentials, locked accounts, or session expiration.',
    keywords: [
      'login', 'cant sign in', 'login failed', 'invalid credentials', 'wrong password',
      'account locked', 'sign in error'
    ],
    richContent: `
### 🔑 Quick Fixes for Login Troubles
1. **Registered with Phone vs Email**: If you registered using mobile OTP, ensure you are not signing in via email.
2. **Caps Lock Active**: Passwords are case-sensitive. Verify Caps Lock is turned off.
3. **Session Cleared**: If you recently upgraded your browser or cleared cookies, tap the link below to enter your credentials afresh.
    `,
    directActions: [
      { label: '🔑 Go to Login', actionType: 'NAVIGATE', target: '/login' },
      { label: '🔐 Forgot Password? Reset in 60s', actionType: 'VIEW_NODE', target: 'account_forgot_password_guide' },
      { label: '📝 Create New Account', actionType: 'NAVIGATE', target: '/register' },
    ],
    relatedSuggestions: [
      'account_forgot_password_guide',
      'account_otp_not_received',
    ],
  },

  // =========================================================================
  // PILLAR 3: ORDERS & LIVE TRACKING
  // =========================================================================
  {
    id: 'orders_track_my_order',
    pillarId: 'orders_tracking',
    title: 'Track My Order in Real-Time',
    badge: 'Real-Time Tracking',
    summary: 'Enter your 9-digit or BHVM Order ID to inspect live courier transit status, dispatch notes, and delivery date.',
    keywords: [
      'track', 'tracking', 'order status', 'where is my order', 'track order', 'delivery status',
      'courier', 'awb', 'shipment', 'package', 'parcel', 'bhvm', 'dispatch status'
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Locate Your Order ID',
        description: 'Find your 9-digit Order Number (e.g. BHVM815899599) in your SMS confirmation, email invoice, or Profile -> Orders tab.',
      },
      {
        stepNumber: 2,
        title: 'Open Live Order Tracker',
        description: 'Visit the Bhumivera Live Order Tracking portal at /order-tracking.',
      },
      {
        stepNumber: 3,
        title: 'Inspect Transit Milestones',
        description: 'View real-time hub scans, courier partner assignment (BlueDart, Delhivery, DTDC), and delivery estimate.',
      },
    ],
    richContent: `
> [!NOTE]
> Orders placed before **2:00 PM IST** are packed, weight-calibrated (±0.5g tolerance), and dispatched the exact same working day!
    `,
    directActions: [
      { label: '🚚 Open Live Order Tracking', actionType: 'NAVIGATE', target: '/order-tracking' },
      { label: '👤 View My Orders in Profile', actionType: 'NAVIGATE', target: '/profile' },
    ],
    relatedSuggestions: [
      'orders_dispatch_timelines',
      'orders_courier_partners',
    ],
  },
  {
    id: 'orders_dispatch_timelines',
    pillarId: 'orders_tracking',
    title: 'Shipping Timelines & 2:00 PM Dispatch Cutoff',
    badge: 'Fast Dispatch',
    summary: 'Standard delivery estimates across Tier 1 metros, Tier 2 cities, and North-East/Himalayan regions.',
    keywords: [
      'shipping time', 'delivery time', 'when will it arrive', 'how long to deliver',
      'dispatch time', 'dispatch cutoff', 'same day dispatch', 'estimated delivery'
    ],
    richContent: `
### ⏱️ Delivery Standards Across India
- **Tier 1 Metros (Delhi NCR, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad)**: **2 to 3 Working Days**.
- **Tier 2 & 3 Cities**: **3 to 5 Working Days**.
- **North-East, J&K, Island Territories**: **5 to 7 Working Days**.
- **Same-Day Dispatch Guarantee**: Orders confirmed before **2:00 PM IST** (Mon–Sat) leave our West Bengal fulfillment hub the same day.
    `,
    directActions: [
      { label: '🚚 Track Existing Order', actionType: 'NAVIGATE', target: '/order-tracking' },
    ],
    relatedSuggestions: [
      'orders_track_my_order',
      'offers_free_shipping_info',
    ],
  },
  {
    id: 'orders_courier_partners',
    pillarId: 'orders_tracking',
    title: 'Authorized Courier Partners & Tamper-Seals',
    badge: 'Packaging Integrity',
    summary: 'How Bhumivera protects every bottle in transit with digital weight scanning and tamper-evident neck seals.',
    keywords: [
      'courier', 'bluedart', 'delhivery', 'dtdc', 'tamper seal', 'packaging',
      'safety seal', 'weight scan', 'bubble wrap'
    ],
    richContent: `
Every parcel is packed with biodegradable cushioning, verified on a digital scale (±0.5g precision), and sealed with our signature black-and-gold tamper-evident security tape.
    `,
    directActions: [
      { label: '🛡️ View Purchase Protection Shield', actionType: 'NAVIGATE', target: '/purchase-protection' },
    ],
    relatedSuggestions: [
      'orders_track_my_order',
    ],
  },

  // =========================================================================
  // PILLAR 4: RETURNS, REPLACEMENTS & REFUNDS
  // =========================================================================
  {
    id: 'returns_policy_and_rma',
    pillarId: 'returns_cancellations',
    title: '7-Day Return & Replacement Policy',
    badge: 'Hassle-Free Policy',
    summary: 'Self-service returns and replacements are open for 7 days post-delivery for damaged, defective, or incorrect items.',
    keywords: [
      'return', 'returns', 'refund', 'replacement', 'exchange', 'rma', 'broken bottle',
      'damaged product', 'leaked', 'wrong item', 'how to return'
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Check Eligibility Window',
        description: 'Returns are accepted within 7 days of verified courier delivery for damaged, leaked, or wrong items.',
      },
      {
        stepNumber: 2,
        title: 'Capture Unboxing Photos',
        description: 'Take clear photos of the shipping label, tamper seal, and the product issue.',
      },
      {
        stepNumber: 3,
        title: 'Initiate Self-Service RMA',
        description: 'Navigate to Profile -> Orders, select the order, and tap "Request Return / Replacement".',
      },
    ],
    richContent: `
### 💳 Refund Methods
- **Bhumivera Wallet (Instant)**: Credited immediately upon RMA inspection; spendable with zero expiry across all products.
- **Original Payment Gateway (UPI / Card)**: Credited within 5 to 7 banking days via Razorpay.
    `,
    directActions: [
      { label: '📦 Go to My Orders to Start RMA', actionType: 'NAVIGATE', target: '/profile' },
      { label: '📞 Request Specialist Verification', actionType: 'VIEW_NODE', target: 'human_callback_wizard' },
    ],
    relatedSuggestions: [
      'returns_cancellation_safeguard',
      'payments_wallet_and_coins',
    ],
  },
  {
    id: 'returns_cancellation_safeguard',
    pillarId: 'returns_cancellations',
    title: 'Order Cancellation Policy (SuperAdmin Exclusive)',
    badge: 'Order Integrity Safeguard',
    summary: 'Why customers cannot self-cancel confirmed orders and how our executive team handles address/item corrections.',
    keywords: [
      'cancel order', 'cancellation', 'stop order', 'cancel', 'modify order',
      'change address', 'cancel item'
    ],
    richContent: `
### 🔒 High-Integrity Fulfillment Architecture
Once an order is placed, our warehouse immediately reserves fresh artisanal batch bottles and begins automated packaging. 

- **Customer Self-Cancellation Disabled**: To prevent inventory drift and fraudulent disputes, orders cannot be self-cancelled directly by bot or non-admin users.
- **Need an Address Change or Urgent Correction?**: Connect with our SuperAdmin Support team within 60 minutes of placement using our verified escalation wizard below!
    `,
    directActions: [
      { label: '📞 Request Urgent Cancellation Review', actionType: 'VIEW_NODE', target: 'human_callback_wizard' },
      { label: '🚚 Check Order Dispatch Status', actionType: 'NAVIGATE', target: '/order-tracking' },
    ],
    relatedSuggestions: [
      'returns_policy_and_rma',
      'human_callback_wizard',
    ],
  },

  // =========================================================================
  // PILLAR 5: PAYMENTS, WALLETS & GST INVOICES
  // =========================================================================
  {
    id: 'payments_accepted_methods',
    pillarId: 'payments_wallet_gst',
    title: 'Payment Options (UPI, Cards, NetBanking, COD)',
    badge: '100% Encrypted',
    summary: 'Secure 256-bit SSL payments via Razorpay (UPI, Google Pay, PhonePe, Paytm, Cards) and Cash on Delivery.',
    keywords: [
      'payment', 'payment methods', 'upi', 'gpay', 'phonepe', 'paytm', 'cod',
      'cash on delivery', 'credit card', 'debit card', 'net banking'
    ],
    richContent: `
### 💳 Accepted Payment Gateways
- **Instant UPI**: Google Pay, PhonePe, Paytm, BHIM, Cred with zero transaction fee.
- **Credit & Debit Cards**: Visa, MasterCard, RuPay, American Express.
- **Net Banking**: 50+ Indian banks.
- **Cash on Delivery (COD)**: Available nationwide with SMS verification.
    `,
    directActions: [
      { label: '🛍️ Shop Products', actionType: 'NAVIGATE', target: '/products' },
    ],
    relatedSuggestions: [
      'payments_wallet_and_coins',
      'payments_gst_tax_invoice',
    ],
  },
  {
    id: 'payments_wallet_and_coins',
    pillarId: 'payments_wallet_gst',
    title: 'Bhumivera Wallet & Loyalty Coins',
    badge: 'Store Credits',
    summary: 'How to check and redeem your Bhumivera Wallet balance and Ambassador reward credits at checkout.',
    keywords: [
      'wallet', 'wallet balance', 'coins', 'loyalty points', 'credits',
      'referral balance', 'how to use wallet', 'redeem credits'
    ],
    richContent: `
### 💰 Using Your Bhumivera Wallet
- **1 Coin = ₹1 INR**: 100% spendable value with no arbitrary redemption caps.
- **Auto-Applied at Checkout**: Simply check "Use Wallet Balance" on the checkout page to instantly offset your total payable amount.
    `,
    directActions: [
      { label: '👤 Check Wallet in My Profile', actionType: 'NAVIGATE', target: '/profile' },
    ],
    relatedSuggestions: [
      'offers_ambassador_program',
      'payments_accepted_methods',
    ],
  },
  {
    id: 'payments_gst_tax_invoice',
    pillarId: 'payments_wallet_gst',
    title: 'GST Tax Invoices & B2B Billing',
    badge: 'GST Compliance',
    summary: 'Every order generates an automated GST-compliant tax invoice with HSN codes and breakdown of CGST/SGST/IGST.',
    keywords: [
      'invoice', 'gst', 'gst invoice', 'tax invoice', 'bill', 'receipt',
      'gstin', 'b2b invoice', 'download invoice'
    ],
    richContent: `
### 🧾 How to Download Your GST Invoice
1. Go to **Profile -> Orders**.
2. Tap on any completed order.
3. Tap **"Download Tax Invoice (PDF)"** to obtain an official receipt for GST input tax credit (ITC).
    `,
    directActions: [
      { label: '👤 Go to Profile Orders', actionType: 'NAVIGATE', target: '/profile' },
    ],
    relatedSuggestions: [
      'orders_track_my_order',
    ],
  },

  // =========================================================================
  // PILLAR 6: BOTANICAL SCIENCE & LAB
  // =========================================================================
  {
    id: 'science_sea_buckthorn_deep_dive',
    pillarId: 'botanical_science',
    title: 'Himalayan Sea Buckthorn Terroir & Extraction',
    badge: 'Super-Berry Active',
    summary: 'Why cold-desert Himalayan berries synthesize rare Omega-7 and up to 12x more Vitamin C than oranges.',
    keywords: [
      'sea buckthorn science', 'omega 7', 'palmitoleic acid', 'supercritical co2',
      'himalayan terroir', 'antioxidants', 'botanical science', 'extraction'
    ],
    richContent: `
### 🏔️ High-Altitude Himalayan Bio-Accumulation
Growing at 3,500m in Ladakh where UV radiation is intense and winter temperatures plunge below -25°C, Sea Buckthorn synthesizes rare Palmitoleic Acid (Omega-7) to preserve its cellular membrane.
We extract this via solvent-free supercritical CO2, ensuring zero chemical solvents touch the formulation.
    `,
    directActions: [
      { label: '🔬 Explore Bhumivera Science Lab', actionType: 'NAVIGATE', target: '/science' },
      { label: '🌿 Shop Sea Buckthorn Face Wash', actionType: 'VIEW_NODE', target: 'product_sea_buckthorn_facewash' },
    ],
    relatedSuggestions: [
      'product_sea_buckthorn_facewash',
      'science_ph_and_clean_standards',
    ],
  },
  {
    id: 'science_ph_and_clean_standards',
    pillarId: 'botanical_science',
    title: 'pH 5.5 Skin-Identical Calibration & 100% Vegan',
    badge: 'Clean Formulation Standard',
    summary: 'Formulated without SLS, SLES, parabens, synthetic dyes, or microplastics.',
    keywords: [
      'ph level', 'ph 5.5', 'vegan', 'cruelty free', 'clean beauty', 'no sulfates',
      'no parabens', 'acid mantle', 'microbiome'
    ],
    richContent: `
Healthy human facial skin maintains a slightly acidic surface pH between 5.2 and 5.7. Our lab precisely buffers every wash to pH 5.5, ensuring natural commensal microflora thrive without barrier stripping.
    `,
    directActions: [
      { label: '🔬 Visit Formulation Science', actionType: 'NAVIGATE', target: '/science' },
    ],
    relatedSuggestions: [
      'science_sea_buckthorn_deep_dive',
    ],
  },

  // =========================================================================
  // PILLAR 7: OFFERS & AMBASSADOR PROGRAM
  // =========================================================================
  {
    id: 'offers_active_coupons',
    pillarId: 'offers_ambassador',
    title: 'Available Discount Coupons & Promo Codes',
    badge: 'Instant Savings',
    summary: 'Active store discounts for new and returning clients.',
    keywords: [
      'coupons', 'coupon', 'promo', 'discount', 'offers', 'discount code',
      'welcome code', 'voucher', 'save money'
    ],
    richContent: `
### 🏷️ Active Promo Vouchers
- **WELCOME10**: 10% OFF on your first Bhumivera order with zero minimum cart value.
- **BHUMI20**: 20% OFF on luxury bundle rituals above ₹1,499.
- **FREESHIP**: Automatically unlocked on orders of ₹500 or more!
    `,
    directActions: [
      { label: '🛍️ Shop with WELCOME10', actionType: 'NAVIGATE', target: '/products' },
    ],
    relatedSuggestions: [
      'offers_ambassador_program',
      'offers_free_shipping_info',
    ],
  },
  {
    id: 'offers_ambassador_program',
    pillarId: 'offers_ambassador',
    title: 'Brand Ambassador & Affiliate Program (10% Earn)',
    badge: '10% Lifetime Commission',
    summary: 'Share your personal referral code, give friends 10% off, and earn 10% spendable wallet credits on every successful purchase.',
    keywords: [
      'ambassador', 'brand ambassador', 'affiliate', 'refer and earn', 'referral',
      'commission', 'earn money', 'referral code', 'join ambassador'
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Sign In to Your Account',
        description: 'Navigate to your Profile or visit /affiliate to activate your ambassador account.',
      },
      {
        stepNumber: 2,
        title: 'Generate Unique Referral Link',
        description: 'Copy your bespoke invitation link (e.g. bhumivera.com?ref=YOURNAME).',
      },
      {
        stepNumber: 3,
        title: 'Earn 10% Store Credits on Every Order',
        description: 'Friends get an instant 10% discount, and you receive 10% credited directly into your Bhumivera Wallet.',
      },
    ],
    richContent: `
### ✨ Privileges of Being an Ambassador
- Real-time earnings dashboard.
- Early access to seasonal limited-edition botanical harvests.
- Spendable wallet credits with zero expiration.
    `,
    directActions: [
      { label: '✨ Join Ambassador Program', actionType: 'NAVIGATE', target: '/affiliate' },
      { label: '👤 View Referral Dashboard in Profile', actionType: 'NAVIGATE', target: '/profile' },
    ],
    relatedSuggestions: [
      'payments_wallet_and_coins',
      'offers_active_coupons',
    ],
  },
  {
    id: 'offers_free_shipping_info',
    pillarId: 'offers_ambassador',
    title: 'Free Standard Shipping Threshold',
    badge: 'Free Shipping',
    summary: 'Free standard insured shipping applies automatically across India on all orders of ₹500 or more.',
    keywords: [
      'free shipping', 'shipping cost', 'delivery charges', 'shipping fee',
      'how much shipping', 'minimum order'
    ],
    richContent: `
- **Orders ₹500 and above**: **100% FREE Standard Shipping**.
- **Orders below ₹500**: Flat nominal ₹49 insured shipping fee.
    `,
    directActions: [
      { label: '🛍️ Add Products to Reach ₹500', actionType: 'NAVIGATE', target: '/products' },
    ],
    relatedSuggestions: [
      'product_sea_buckthorn_facewash',
      'orders_dispatch_timelines',
    ],
  },

  // =========================================================================
  // PILLAR 8: VERIFIED HUMAN SPECIALIST ESCALATION
  // =========================================================================
  {
    id: 'human_callback_wizard',
    pillarId: 'human_escalation',
    title: 'Schedule a Verified Specialist Callback',
    badge: 'Executive Support',
    summary: 'Verified 3-step order support with a dedicated specialist reaching out via email or phone call within 12 hours.',
    keywords: [
      'human', 'agent', 'support agent', 'call me', 'callback', 'speak to human',
      'executive', 'talk to person', 'real person', 'customer care', 'phone support'
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Validate Order ID & Contact',
        description: 'Enter your 9-digit Order Number and registered email or phone to confirm ownership.',
      },
      {
        stepNumber: 2,
        title: 'Select Contact Preference',
        description: 'Choose between an in-depth Email resolution or a Direct Phone Callback.',
      },
      {
        stepNumber: 3,
        title: 'Pick Convenient Time Slot',
        description: 'Slots: Morning (10 AM–1 PM), Afternoon (1 PM–5 PM), or Evening (5 PM–8 PM IST).',
      },
    ],
    richContent: `
Our executive team operates Monday through Saturday, 9:30 AM to 7:00 PM IST, to assist with verified order queries, transit exceptions, and customized skincare consultations.
    `,
    directActions: [
      { label: '📞 Launch 3-Step Verification Wizard', actionType: 'OPEN_ESCALATION' },
    ],
    relatedSuggestions: [
      'orders_track_my_order',
      'returns_policy_and_rma',
    ],
  },
];

/**
 * High-speed prefix & fuzzy search index (< 5ms execution)
 * Searches across title, summary, keywords, and category tokens.
 */
export function searchKnowledgeTree(rawQuery = '') {
  const query = String(rawQuery || '').toLowerCase().trim();
  if (!query) return [];

  // Normalize tokens
  const cleanQuery = query.replace(/[^\w\s]/g, ' ');
  const tokens = cleanQuery.split(/\s+/).filter(t => t.length > 0);
  if (!tokens.length) return [];

  const results = [];

  for (const node of KNOWLEDGE_TREE_NODES) {
    let score = 0;
    const titleLower = node.title.toLowerCase();
    const summaryLower = (node.summary || '').toLowerCase();
    const keywords = (node.keywords || []).map(k => k.toLowerCase());

    // 1. Exact phrase match in title (Highest priority)
    if (titleLower.includes(query)) {
      score += 100;
    }

    // 2. Exact match in keywords
    if (keywords.includes(query)) {
      score += 80;
    }

    // 3. Token prefix matching (e.g. "for" -> "forgot", "pass" -> "password")
    for (const token of tokens) {
      // Keyword prefix match
      const matchedKeyword = keywords.find(k => k.startsWith(token) || k.includes(token));
      if (matchedKeyword) {
        if (matchedKeyword.startsWith(token)) {
          score += 50;
        } else {
          score += 25;
        }
      }

      // Title prefix match
      if (titleLower.includes(token)) {
        score += 35;
      }

      // Summary match
      if (summaryLower.includes(token)) {
        score += 15;
      }
    }

    // Special Boosters for critical queries:
    // When typing "for", "forg", "forgot", "pass", "pwd", strongly boost forgot password guide!
    if (/^(for|forg|forgo|forgot|pass|pwd|reset)$/i.test(query)) {
      if (node.id === 'account_forgot_password_guide') {
        score += 150;
      }
    }

    // When typing "track", "order", "where", strongly boost tracking
    if (/^(track|order|where|ship|deliv)$/i.test(query)) {
      if (node.id === 'orders_track_my_order') {
        score += 120;
      }
    }

    // When typing product or wash
    if (/^(wash|face|clean|char|sea|buck|shamp|elix|saff)$/i.test(query)) {
      if (node.productData) {
        score += 70;
      }
    }

    if (score > 0) {
      results.push({
        node,
        score,
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, 8).map(r => r.node);
}

/**
 * Returns all nodes belonging to a master pillar.
 */
export function getNodesByPillar(pillarId) {
  return KNOWLEDGE_TREE_NODES.filter(node => node.pillarId === pillarId);
}

/**
 * Returns a node by its ID.
 */
export function getNodeById(id) {
  return KNOWLEDGE_TREE_NODES.find(node => node.id === id) || null;
}
