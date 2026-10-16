const supportActions = [
  {
    id: 'know_sb_fw',
    label: 'Sea Buckthorn Face Wash',
    prompt: 'Tell me about Sea Buckthorn Face Wash and its key ingredients',
    category: 'product_discovery',
  },
  {
    id: 'ing_niacinamide',
    label: 'Niacinamide (Vitamin B3)',
    prompt: 'Tell me about Niacinamide in Sea Buckthorn Face Wash',
    category: 'ingredient_discovery',
  },
  {
    id: 'usage_time',
    label: 'Face wash usage guide',
    prompt: 'How do I use face wash and what time of day should I use it?',
    category: 'usage_and_timing',
  },
  {
    id: 'verify_order',
    label: 'Order support',
    prompt: '__OPEN_VERIFICATION_FLOW__',
    category: 'verification',
  },
];

const buildClientUsageFollowUps = productName => [
  {
    id: 'post_wash_layering',
    label: '🧴 Post-Wash Layering Guide',
    prompt: `What skincare products should I apply right after using ${productName}?`,
    category: 'post_wash_routine',
  },
  {
    id: 'active_synergy',
    label: '🌿 Sea Buckthorn + Niacinamide Synergy',
    prompt: `How do Sea Buckthorn and Niacinamide work together in ${productName}?`,
    category: 'ingredient_synergy',
  },
  {
    id: 'skin_compatibility',
    label: '⚖️ Sensitive & Acne-Prone Skin Guide',
    prompt: `Is ${productName} safe for sensitive or acne-prone skin, and how do I patch test?`,
    category: 'skin_compatibility',
  },
  {
    id: 'kumkumadi_pairing',
    label: '🌙 Pair with Kumkumadi Night Elixir',
    prompt: `How do I pair ${productName} with Bhumivera Kumkumadi Night Elixir?`,
    category: 'product_pairing',
  },
];

const buildClientLayeringFollowUps = () => [
  {
    id: 'kumkumadi_pairing',
    label: '🌙 Pair with Kumkumadi Night Elixir',
    prompt: 'How do I pair Sea Buckthorn Face Wash with Bhumivera Kumkumadi Night Elixir?',
    category: 'product_pairing',
  },
  {
    id: 'ing_niacinamide',
    label: '🌿 Niacinamide Deep Dive',
    prompt: 'Tell me about Niacinamide in Sea Buckthorn Face Wash',
    category: 'ingredient_discovery',
  },
  {
    id: 'skin_compatibility',
    label: '⚖️ Sensitive & Acne-Prone Skin Guide',
    prompt: 'Is Sea Buckthorn Face Wash safe for sensitive or acne-prone skin?',
    category: 'skin_compatibility',
  },
  {
    id: 'ambassador',
    label: '✨ Brand Ambassador Program',
    prompt: 'How do I join the Bhumivera Brand Ambassador Program?',
    category: 'ambassador',
  },
];

const buildClientSynergyFollowUps = () => [
  {
    id: 'post_wash_layering',
    label: '🧴 Post-Wash Layering Guide',
    prompt: 'What skincare products should I apply right after using Sea Buckthorn Face Wash?',
    category: 'post_wash_routine',
  },
  {
    id: 'skin_compatibility',
    label: '⚖️ Sensitive & Acne-Prone Skin Guide',
    prompt: 'Is Sea Buckthorn Face Wash safe for sensitive or acne-prone skin?',
    category: 'skin_compatibility',
  },
  {
    id: 'ing_hyaluronic',
    label: '💧 Hyaluronic Acid in Cleansers',
    prompt: 'Tell me about Hyaluronic Acid in Sea Buckthorn Face Wash',
    category: 'ingredient_discovery',
  },
  {
    id: 'usage_time',
    label: '⏰ How & What Time to Use Face Wash',
    prompt: 'How do I use face wash and what time of day should I use it?',
    category: 'usage_and_timing',
  },
];

const buildClientCompatibilityFollowUps = () => [
  {
    id: 'post_wash_layering',
    label: '🧴 Post-Wash Layering Guide',
    prompt: 'What skincare products should I apply right after using Sea Buckthorn Face Wash?',
    category: 'post_wash_routine',
  },
  {
    id: 'active_synergy',
    label: '🌿 Sea Buckthorn + Niacinamide Synergy',
    prompt: 'How do Sea Buckthorn and Niacinamide work together in Sea Buckthorn Face Wash?',
    category: 'ingredient_synergy',
  },
  {
    id: 'kumkumadi_pairing',
    label: '🌙 Pair with Kumkumadi Night Elixir',
    prompt: 'How do I pair Sea Buckthorn Face Wash with Bhumivera Kumkumadi Night Elixir?',
    category: 'product_pairing',
  },
  {
    id: 'verify_order',
    label: 'Order support',
    prompt: '__OPEN_VERIFICATION_FLOW__',
    category: 'verification',
  },
];

const buildClientPairingFollowUps = () => [
  {
    id: 'post_wash_layering',
    label: '🧴 Post-Wash Layering Guide',
    prompt: 'What skincare products should I apply right after using Sea Buckthorn Face Wash?',
    category: 'post_wash_routine',
  },
  {
    id: 'know_sb_fw',
    label: '🌿 Sea Buckthorn Face Wash',
    prompt: 'Tell me about Sea Buckthorn Face Wash and its key ingredients',
    category: 'product_discovery',
  },
  {
    id: 'active_synergy',
    label: '🌿 Sea Buckthorn + Niacinamide Synergy',
    prompt: 'How do Sea Buckthorn and Niacinamide work together in Sea Buckthorn Face Wash?',
    category: 'ingredient_synergy',
  },
  {
    id: 'ambassador',
    label: '✨ Brand Ambassador Program',
    prompt: 'How do I join the Bhumivera Brand Ambassador Program?',
    category: 'ambassador',
  },
];

export const FRONTEND_INGREDIENT_MEMORY = [
  {
    id: 'sea_buckthorn',
    name: 'Sea Buckthorn',
    aliases: ['hippophae rhamnoides', 'omega 7'],
    description: 'A nutrient-dense botanical super-berry rich in rare Omega-7, Omegas 3, 6 & 9, and Vitamin C. Strengthens the cellular lipid barrier and delivers antioxidant defense against daily pollution.',
  },
  {
    id: 'niacinamide',
    name: 'Niacinamide (Vitamin B3)',
    aliases: ['vitamin b3', 'nicotinamide', 'niacinamide'],
    description: 'A form of vitamin B3 (1% in face wash) that stimulates ceramide synthesis, refines enlarged pores, regulates excess oil, and brightens skin tone without barrier irritation.',
  },
  {
    id: 'hyaluronic_acid',
    name: 'Hyaluronic Acid',
    aliases: ['sodium hyaluronate', 'hyaluron'],
    description: 'A biomimetic humectant (0.5% in face wash) capable of binding up to 1,000x its weight in water, infusing deep epidermal hydration and preventing tightness after cleansing.',
  },
  {
    id: 'aloe_vera',
    name: 'Aloe Vera',
    aliases: ['aloe', 'aloe barbadensis'],
    description: 'Cold-pressed botanical juice (5% in face wash) rich in soothing polysaccharides that cool inflammation and cushion delicate skin during cleansing.',
  },
  {
    id: 'glycerin',
    name: 'Botanical Glycerin',
    aliases: ['glycerine', 'glycerin'],
    description: '100% plant-derived humectant (4% in face wash) that prevents transepidermal water loss (TEWL) and maintains smooth cellular elasticity.',
  },
  {
    id: 'tulsi',
    name: 'Tulsi (Holy Basil)',
    aliases: ['holy basil', 'ocimum tenuiflorum', 'ocimum sanctum'],
    description: 'Classical Ayurvedic adaptogen with antimicrobial and purifying eugenol compounds that defend the cutaneous microbiome against environmental stress.',
  },
  {
    id: 'activated_charcoal',
    name: 'Activated Charcoal',
    aliases: ['charcoal', 'bamboo charcoal'],
    description: 'Steam-activated bamboo carbon (3% in charcoal cleanser) that adsorbs microscopic environmental pollutants, impurities, and excess sebum from deep pores.',
  },
  {
    id: 'neem',
    name: 'Neem',
    aliases: ['azadirachta', 'nimba'],
    description: 'Ayurvedic Nimba extract (0.5%) rich in margosic acids that naturally clarify blemish-prone skin and suppress surface micro-flora imbalance.',
  },
  {
    id: 'haridra',
    name: 'Haridra (Turmeric)',
    aliases: ['turmeric', 'curcuma', 'curcuma longa'],
    description: 'Organic Turmeric rhizome extract (0.5%) standardized for curcuminoids, providing radiance, calming redness, and defending against photo-oxidative stress.',
  },
];

const makePrompts = product => ({
  knowMore: `Tell me about ${product} and its listed ingredients`,
  usage: `How should I use ${product}, and when?`,
  niacinamide: `Tell me about Niacinamide in ${product}`,
});

const faceWashSteps = [
  'Wet your face with comfortable lukewarm water (never hot).',
  'Dispense 1 to 2 coin-sized pumps into clean, damp palms and work into a velvety micro-bubble lather.',
  'Gently massage over face and neck in upward circular motions for 30 to 45 seconds, avoiding the eye area.',
  'Rinse thoroughly with cool water to refresh pores, pat gently with a clean muslin towel, and follow with your routine toner and serum while skin is damp.',
];

export const FRONTEND_PRODUCTS_GUIDE = [
  {
    id: 'sea_buckthorn_face_wash',
    name: 'Bhumivera Sea Buckthorn Face Wash',
    subtitle: 'A daily cleanser with listed botanical and skincare ingredients',
    skinTypes: 'pH 5.5 balanced, non-comedogenic, soap-free. Ideal for normal, combination, oily, and sensitive skin.',
    keyActives: [
      { id: 'sea_buckthorn', name: 'Sea Buckthorn', pct: 'Botanical extract (Omega-7 rich)', role: 'Antioxidant & lipid barrier fortification.' },
      { id: 'niacinamide', name: 'Niacinamide (Vitamin B3)', pct: '1%', role: 'Pore refinement & sebum regulation.' },
      { id: 'hyaluronic_acid', name: 'Hyaluronic Acid', pct: '0.5%', role: 'Multi-depth humectant hydration.' },
      { id: 'aloe_vera', name: 'Aloe Vera', pct: '5%', role: 'Calming redness & inflammation.' },
      { id: 'glycerin', name: 'Botanical Glycerin', pct: '4%', role: 'Locking in moisture & barrier cushioning.' },
      { id: 'tulsi', name: 'Tulsi', pct: 'Botanical extract', role: 'Purifying against environmental pollution.' },
    ],
    bestTimeToUse: {
      morning: 'Antioxidant shield: cleanse upon waking to sweep away overnight sebum and prime skin for daytime SPF.',
      evening: 'Barrier reset: cleanse before bedtime to dissolve daytime sunscreen, grime, and environmental impurities.',
      frequency: 'Use twice daily (AM & PM). Massage for 30 to 45 seconds on wet skin.',
    },
    howToUseSteps: faceWashSteps,
    prompts: makePrompts('Bhumivera Sea Buckthorn Face Wash'),
  },
  {
    id: 'charcoal_face_wash',
    name: 'Bhumivera Charcoal Face Wash',
    subtitle: 'A cleanser with activated charcoal and listed skincare ingredients',
    skinTypes: 'Formulated for deep urban pore purification and oil-balancing. Patch test if sensitive.',
    keyActives: [
      { id: 'activated_charcoal', name: 'Activated Charcoal', pct: '3%', role: 'Micro-pollutant & sebum adsorbent.' },
      { id: 'glycerin', name: 'Botanical Glycerin', pct: '5%', role: 'Hydrating base cushioning deep cleansers.' },
      { id: 'neem', name: 'Neem', pct: '0.5%', role: 'Ayurvedic clarifying active for blemish-prone skin.' },
      { id: 'haridra', name: 'Haridra (Turmeric)', pct: '0.5%', role: 'Curcuminoid radiance & anti-inflammatory calming.' },
      { id: 'hyaluronic_acid', name: 'Hyaluronic Acid', pct: '0.1%', role: 'Humectant moisture binding.' },
      { id: 'niacinamide', name: 'Niacinamide', pct: '0.1%', role: 'Pore texture evening active.' },
    ],
    bestTimeToUse: {
      morning: 'Use to sweep away morning oiliness and clear urban grime.',
      evening: 'Use to lift away city pollution and clear congested pores.',
      frequency: 'Daily or 3-4 times weekly depending on skin oil balance.',
    },
    howToUseSteps: faceWashSteps,
    prompts: makePrompts('Bhumivera Charcoal Face Wash'),
  },
  {
    id: 'kumkumadi_night_elixir',
    name: 'Bhumivera Kumkumadi Night Elixir',
    subtitle: 'An authentic Ayurvedic night-time facial elixir',
    skinTypes: 'Suitable for dry, normal, and combination skin seeking radiant overnight rejuvenation.',
    keyActives: [
      { id: 'saffron', name: 'Kashmiri Saffron (Kesar)', pct: 'Pure Grade', role: 'Complexion illumination & cell renewal.' },
      { id: 'haridra', name: 'Haridra (Turmeric)', pct: 'Extract', role: 'Calming oxidative stress & brightening.' },
    ],
    bestTimeToUse: {
      morning: 'This is a night-time product; reserve for evening ritual.',
      evening: 'Warm 2 to 3 drops between clean palms and press onto face and neck right after cleansing.',
      frequency: 'Nightly before sleep.',
    },
    howToUseSteps: [
      'Cleanse thoroughly with Bhumivera Sea Buckthorn Face Wash and leave skin slightly dewy.',
      'Dispense 2 to 3 golden drops into the palm of your hand.',
      'Rub palms together gently to warm and activate the botanical saffron extracts.',
      'Press gently into your face, neck, and décolletage using upward lymphatic strokes.',
    ],
    prompts: makePrompts('Bhumivera Kumkumadi Night Elixir'),
  },
];

export function resolveClientSideConciergeFallback(message) {
  const query = String(message || '').trim();
  const normalizedQuery = query.toLowerCase();

  if (/\b(ambassador|affiliate|referral program)\b/.test(normalizedQuery)) {
    return {
      reply: 'For the Bhumivera Brand Ambassador Program, sign in and open the Brand Ambassador Program section in your profile, or visit [the affiliate page](/affiliate).',
      quickActions: supportActions,
    };
  }

  if (/\b(shipping|delivery|deliver|shipping charge)\b/.test(normalizedQuery)) {
    return {
      reply: 'Delivery options, charges, and estimates are shown at checkout for your address. I cannot retrieve live shipping information while the concierge service is offline.',
      quickActions: supportActions,
    };
  }

  if (/\b(order|track|tracking|return|refund|wallet|coupon)\b/.test(normalizedQuery)) {
    return {
      reply: 'I cannot access live account or order information right now. Please open the order-support verification flow, or try again when the Client Concierge service is available.',
      quickActions: supportActions,
    };
  }

  // Post-Wash Layering Guide
  if (/\b(post.?wash|layering|apply right after|after washing|after cleansing|routine order|what to apply)\b/.test(normalizedQuery)) {
    return {
      reply: `**Expert Post-Cleansing Layering Ritual (The 60-Second Rule):**\n\n` +
        `Immediately after cleansing with Bhumivera Face Wash, your skin's cellular permeability is at its peak. Here is the recommended layering sequence:\n\n` +
        `1. **Step 1 — Immediate Damp Hydration (0–60 Seconds):**\n` +
        `   While your face is still dewy from rinsing, mist with pure botanical rosewater or hydrating toner. Never let skin dry out before applying active serums.\n\n` +
        `2. **Step 2 — Active Water-Based Serums:**\n` +
        `   Dispense 3 to 4 drops of targeted serum (such as **Niacinamide** or **Hyaluronic Acid**). Pat gently with fingertips into face and neck.\n\n` +
        `3. **Step 3 — Barrier Moisture Lock:**\n` +
        `   Smooth a pea-sized amount of lightweight gel-cream or restorative moisturizer to seal in the humectants.\n\n` +
        `4. **Step 4 — AM vs PM Ritual Finish:**\n` +
        `   • **☀️ Morning:** Always apply broad-spectrum SPF 50 sunscreen as your final shield.\n` +
        `   • **🌙 Evening:** Warm 2–3 drops of **Bhumivera Kumkumadi Night Elixir** and press gently onto facial contours for overnight cellular nourishment.`,
      quickActions: buildClientLayeringFollowUps(),
    };
  }

  // Botanical & Biochemical Synergy
  if (/\b(synergy|work together|combine|combination of sea buckthorn and niacinamide)\b/.test(normalizedQuery)) {
    return {
      reply: `**Botanical & Biochemical Synergy: Sea Buckthorn + Niacinamide:**\n\n` +
        `In Bhumivera Sea Buckthorn Face Wash, Himalayan Sea Buckthorn and clinical-grade Niacinamide work in precise harmonic balance:\n\n` +
        `• **Lipid + Moisture Matrix:** Sea Buckthorn delivers rare fat-soluble **Omega-7 (palmitoleic acid)** and carotenoids that reinforce intercellular lipids, while Niacinamide boosts your skin's natural ceramide production.\n\n` +
        `• **Dual Antioxidant Shield:** Sea Buckthorn packs 12x more Vitamin C than oranges to neutralize daytime free-radicals, while Niacinamide quenches cutaneous inflammation and calms post-acne erythema (redness).\n\n` +
        `• **Pore Clarity Without Stripping:** Niacinamide clarifies pores and balances excess sebum, while Botanical Glycerin (4%) and Aloe Vera (5%) maintain a comfortable, hydrated finish.`,
      quickActions: buildClientSynergyFollowUps(),
    };
  }

  // Sensitive & Acne-Prone Skin Compatibility
  if (/\b(sensitive skin|acne.?prone|patch test|breakout|irritation|safety for skin|clog pores|non.?comedogenic)\b/.test(normalizedQuery)) {
    return {
      reply: `**Dermatological Compatibility & Patch Testing:**\n\n` +
        `• **Acne-Prone Skin:** Yes, highly suitable. Formulated to be **non-comedogenic** (will not clog pores). Niacinamide helps regulate sebum production, and Holy Basil Tulsi naturally purifies blemish-causing bacteria without causing flaking or rebound oiliness.\n\n` +
        `• **Sensitive Skin:** Formulated at **pH 5.5** (skin's natural physiological pH) with zero harsh sulphates (SLS/SLES-free), soap, or parabens. Pure Aloe Vera (5%) and Botanical Glycerin (4%) cushion the cleansing base to prevent redness or stinging.\n\n` +
        `• **How to Perform a 24-Hour Patch Test:**\n` +
        `  1. Dispense a pea-sized drop onto your inner wrist or behind your earlobe.\n` +
        `  2. Gently wash off after 45 seconds and wait 24 hours.\n` +
        `  3. If no redness, itching, or irritation appears, incorporate into your daily morning and evening ritual with confidence.`,
      quickActions: buildClientCompatibilityFollowUps(),
    };
  }

  // Product Pairing (Kumkumadi Night Elixir)
  if (/\b(pair.*kumkumadi|kumkumadi.*pair|kumkumadi night elixir|night ritual)\b/.test(normalizedQuery)) {
    return {
      reply: `**The Golden PM Ritual: Sea Buckthorn Cleanser + Kumkumadi Night Elixir:**\n\n` +
        `This evening ritual pairs gentle deep pore purification with classical Ayurvedic cellular nourishment:\n\n` +
        `• **Phase 1 — The Purifying Canvas (PM):**\n` +
        `  Massage **Bhumivera Sea Buckthorn Face Wash** onto damp skin for **30 to 45 seconds**. This lifts away environmental micro-particulates, day grime, and sunscreen while prepping the skin barrier to receive botanical nutrients.\n\n` +
        `• **Phase 2 — The Golden Elixir Press (PM):**\n` +
        `  While skin is still slightly damp, dispense 2 to 3 drops of **Bhumivera Kumkumadi Night Elixir** into clean palms. Warm the elixir between your hands to activate the authentic Kashmiri Saffron (Kesar), Red Sandalwood, and herbal extracts, then press gently into facial contours and neck.\n\n` +
        `• **Overnight Synergy:**\n` +
        `  While you rest, the micro-nutrients penetrate deep into the relaxed skin barrier to even out skin tone, repair oxidative damage, and reveal a rested, radiant glow by morning.`,
      quickActions: buildClientPairingFollowUps(),
    };
  }

  // Usage & Timing Guide
  const product = FRONTEND_PRODUCTS_GUIDE.find(item =>
    normalizedQuery.includes(item.name.replace(/^Bhumivera\s+/i, '').toLowerCase()) ||
    normalizedQuery.includes(item.id.replace(/_/g, ' '))
  );

  if (/\b(when|what time|how often|how long|routine|use|usage|apply|application)\b/.test(normalizedQuery) && (product || normalizedQuery.includes('face wash'))) {
    const targetProduct = product || FRONTEND_PRODUCTS_GUIDE[0];
    return {
      reply: `**Best Time to Use & Daily Skincare Ritual for ${targetProduct.name}:**\n\n` +
        `• **☀️ Morning (AM) Ritual — Antioxidant Shield:**\n` +
        `  Cleanse gently upon waking to sweep away overnight sebum and metabolic residue. The natural **Sea Buckthorn (Omega-7)** and **Niacinamide (1%)** work synergistically to create a radiant antioxidant shield against daytime pollutants and oxidative stress.\n\n` +
        `• **🌙 Evening (PM) Ritual — Restorative Barrier Reset:**\n` +
        `  Cleanse at dusk or before bed to dissolve accumulated sunscreen, dust, and urban grime. Infused with **Hyaluronic Acid (0.5%)** and **Botanical Glycerin (4%)**, it thoroughly purifies without stripping your skin's vital lipid moisture barrier.\n\n` +
        `• **💧 Step-by-Step Application Technique:**\n` +
        `  1. Splash your face with comfortable lukewarm water (avoid hot water, which strips natural sebum).\n` +
        `  2. Dispense 1 to 2 coin-sized pumps into clean, damp palms and work into a rich micro-bubble lather.\n` +
        `  3. Gently massage over face and neck in upward circular motions for **30 to 45 seconds**, focusing on the T-zone while avoiding direct contact with the eyes.\n` +
        `  4. Rinse thoroughly with cool water to refresh the pores, then pat gently with a clean muslin towel — leaving skin slightly damp for subsequent steps.\n\n` +
        `• **🧴 Post-Cleansing Layering Order:**\n` +
        `  *Face Wash* ➔ *Hydrating Toner / Mist* ➔ *Active Serum (Niacinamide / Vitamin C)* ➔ *Moisturizer / Kumkumadi Night Elixir* ➔ *Broad Spectrum SPF (AM only)*.\n\n` +
        `• **🌿 Skin Compatibility & Safety:**\n` +
        `  Formulated at skin-identical **pH 5.5**, soap-free, non-comedogenic, and safe for sensitive, oily, or acne-prone skin. Follow the product label for frequency and conduct a 24-hour patch test before first use.`,
      quickActions: buildClientUsageFollowUps(targetProduct.name.replace(/^Bhumivera\s+/i, '')),
    };
  }

  const ingredientQuery = product
    ? normalizedQuery.replace(product.name.replace(/^Bhumivera\s+/i, '').toLowerCase(), '')
    : normalizedQuery;
  const ingredient = FRONTEND_INGREDIENT_MEMORY.find(item =>
    [item.name, ...item.aliases].some(name => ingredientQuery.includes(name.toLowerCase()))
  );

  if (ingredient) {
    const prodName = product ? product.name.replace(/^Bhumivera\s+/i, '') : 'Sea Buckthorn Face Wash';
    const usage = product ? ` Calibrated and formulated in ${product.name}.` : '';
    return {
      reply: `**${ingredient.name}:** ${ingredient.description}${usage}`,
      quickActions: [
        {
          id: 'post_wash_layering',
          label: '🧴 Post-Wash Layering Guide',
          prompt: `What skincare products should I apply right after using ${prodName}?`,
          category: 'post_wash_routine',
        },
        {
          id: 'active_synergy',
          label: '🌿 Active Synergy',
          prompt: `How do Sea Buckthorn and Niacinamide work together in ${prodName}?`,
          category: 'ingredient_synergy',
        },
        {
          id: 'usage_time',
          label: '⏰ How & What Time to Use',
          prompt: `How do I use ${prodName} and what time of day should I use it?`,
          category: 'usage_and_timing',
        },
        {
          id: 'verify_order',
          label: 'Order support',
          prompt: '__OPEN_VERIFICATION_FLOW__',
          category: 'verification',
        },
      ],
    };
  }

  if (product) {
    const activeList = product.keyActives.map(active => `**${active.name}** (${active.pct})`).join(', ');
    return {
      reply: `**${product.name}**\n\n**Listed Key Ingredients:** ${activeList}.\n\n• **Skin Compatibility:** ${product.skinTypes}\n• **AM Timing:** ${product.bestTimeToUse.morning}\n• **PM Timing:** ${product.bestTimeToUse.evening}\n\nCheck the product packaging for the complete listed ingredients and batch directions.`,
      quickActions: [
        {
          id: 'usage_time',
          label: `How & What Time to Use ${product.name.replace(/^Bhumivera\s+/i, '')}`,
          prompt: `How do I use ${product.name} and what time of day should I use it?`,
          category: 'usage_and_timing',
        },
        {
          id: 'ing_niacinamide',
          label: 'Ingredient: Niacinamide',
          prompt: `Tell me about Niacinamide in ${product.name}`,
          category: 'ingredient_discovery',
        },
        {
          id: 'ing_seabuckthorn',
          label: 'Ingredient: Sea Buckthorn',
          prompt: `Tell me about Sea Buckthorn in ${product.name}`,
          category: 'ingredient_discovery',
        },
        {
          id: 'post_wash_layering',
          label: '🧴 Post-Wash Layering Guide',
          prompt: `What skincare products should I apply right after using ${product.name}?`,
          category: 'post_wash_routine',
        },
      ],
    };
  }

  return {
    reply: 'The Client Concierge service is temporarily unavailable, so I cannot look up live account details or confirm product-specific information. Please check the product label for ingredients and directions, or try again shortly.',
    quickActions: supportActions,
  };
}
