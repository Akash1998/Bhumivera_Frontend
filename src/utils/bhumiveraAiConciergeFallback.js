const supportActions = [
  {
    id: 'know_sb_fw',
    label: 'Sea Buckthorn Face Wash',
    prompt: 'Tell me about Sea Buckthorn Face Wash and its key ingredients',
    category: 'product_discovery',
  },
  {
    id: 'ing_niacinamide',
    label: 'Niacinamide',
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

export const FRONTEND_INGREDIENT_MEMORY = [
  {
    id: 'sea_buckthorn',
    name: 'Sea Buckthorn',
    aliases: ['hippophae rhamnoides', 'omega 7'],
    description: 'A botanical oil used in skincare formulations. Check the product label to confirm its inclusion.',
  },
  {
    id: 'niacinamide',
    name: 'Niacinamide',
    aliases: ['vitamin b3'],
    description: 'A form of vitamin B3 used in skincare. Product-specific directions and ingredient details are on the label.',
  },
  {
    id: 'hyaluronic_acid',
    name: 'Hyaluronic Acid',
    aliases: ['sodium hyaluronate'],
    description: 'A humectant used in skincare formulations. Check the product label for its presence and concentration.',
  },
  {
    id: 'aloe_vera',
    name: 'Aloe Vera',
    aliases: ['aloe'],
    description: 'A botanical ingredient used in some skincare formulations. Check the product label to confirm its inclusion.',
  },
  {
    id: 'glycerin',
    name: 'Glycerin',
    aliases: ['glycerine'],
    description: 'A humectant used in skincare formulations. Check the product label for product-specific details.',
  },
  {
    id: 'tulsi',
    name: 'Tulsi',
    aliases: ['holy basil', 'ocimum tenuiflorum'],
    description: 'A botanical ingredient used in some skincare formulations. Check the product label to confirm its inclusion.',
  },
  {
    id: 'activated_charcoal',
    name: 'Activated Charcoal',
    aliases: ['charcoal'],
    description: 'An adsorbent used in some cleansing products. Check the product label for product-specific details.',
  },
  {
    id: 'neem',
    name: 'Neem',
    aliases: ['azadirachta'],
    description: 'A botanical ingredient used in some skincare formulations. Check the product label to confirm its inclusion.',
  },
  {
    id: 'haridra',
    name: 'Haridra (Turmeric)',
    aliases: ['turmeric', 'curcuma'],
    description: 'A botanical ingredient used in some skincare formulations. Check the product label to confirm its inclusion.',
  },
];

const makePrompts = product => ({
  knowMore: `Tell me about ${product} and its listed ingredients`,
  usage: `How should I use ${product}, and when?`,
  niacinamide: `Tell me about Niacinamide in ${product}`,
});

const faceWashSteps = [
  'Wet your face with lukewarm water.',
  'Apply a small amount and massage gently; avoid the eye area.',
  'Rinse thoroughly and pat dry. Follow the product label for exact directions.',
  'Apply your usual moisturizer. Use sunscreen during the daytime.',
];

export const FRONTEND_PRODUCTS_GUIDE = [
  {
    id: 'sea_buckthorn_face_wash',
    name: 'Bhumivera Sea Buckthorn Face Wash',
    subtitle: 'A daily cleanser with listed botanical and skincare ingredients',
    skinTypes: 'Check the product label and patch test if you have sensitive skin.',
    keyActives: [
      { id: 'sea_buckthorn', name: 'Sea Buckthorn', pct: 'Listed', role: 'Botanical ingredient; check the label for the complete formulation.' },
      { id: 'niacinamide', name: 'Niacinamide (Vitamin B3)', pct: '1%', role: 'Skincare active listed for this face wash.' },
      { id: 'hyaluronic_acid', name: 'Hyaluronic Acid', pct: '0.5%', role: 'Humectant listed for this face wash.' },
      { id: 'aloe_vera', name: 'Aloe Vera', pct: '5%', role: 'Botanical ingredient listed for this face wash.' },
      { id: 'glycerin', name: 'Botanical Glycerin', pct: '4%', role: 'Humectant listed for this face wash.' },
      { id: 'tulsi', name: 'Tulsi', pct: 'Listed', role: 'Botanical ingredient; check the label for the complete formulation.' },
    ],
    bestTimeToUse: {
      morning: 'Use as directed on the product label; cleanse gently and rinse thoroughly.',
      evening: 'Use as directed on the product label to cleanse the skin.',
      frequency: 'Follow the product label and adjust if your skin becomes irritated.',
    },
    howToUseSteps: faceWashSteps,
    prompts: makePrompts('Bhumivera Sea Buckthorn Face Wash'),
  },
  {
    id: 'charcoal_face_wash',
    name: 'Bhumivera Charcoal Face Wash',
    subtitle: 'A cleanser with activated charcoal and listed skincare ingredients',
    skinTypes: 'Check the product label and patch test if you have sensitive skin.',
    keyActives: [
      { id: 'activated_charcoal', name: 'Activated Charcoal', pct: '3%', role: 'Adsorbent listed for this face wash.' },
      { id: 'glycerin', name: 'Glycerin', pct: '5%', role: 'Humectant listed for this face wash.' },
      { id: 'neem', name: 'Neem', pct: '0.5%', role: 'Botanical ingredient listed for this face wash.' },
      { id: 'haridra', name: 'Haridra (Turmeric)', pct: '0.5%', role: 'Botanical ingredient listed for this face wash.' },
      { id: 'hyaluronic_acid', name: 'Hyaluronic Acid', pct: '0.1%', role: 'Humectant listed for this face wash.' },
      { id: 'niacinamide', name: 'Niacinamide', pct: '0.1%', role: 'Skincare active listed for this face wash.' },
    ],
    bestTimeToUse: {
      morning: 'Use as directed on the product label; cleanse gently and rinse thoroughly.',
      evening: 'Use as directed on the product label to cleanse the skin.',
      frequency: 'Follow the product label and adjust if your skin becomes irritated.',
    },
    howToUseSteps: faceWashSteps,
    prompts: makePrompts('Bhumivera Charcoal Face Wash'),
  },
  {
    id: 'kumkumadi_night_elixir',
    name: 'Bhumivera Kumkumadi Night Elixir',
    subtitle: 'A night-time product; confirm ingredients and directions on its label',
    skinTypes: 'Check the product label and patch test if you have sensitive skin.',
    keyActives: [
      { id: 'kumkumadi_blend', name: 'Kumkumadi blend', pct: 'See label', role: 'Refer to the package ingredient list for the exact formulation.' },
    ],
    bestTimeToUse: {
      morning: 'This is a night-time product; follow the package directions.',
      evening: 'Use in the evening as directed on the product label.',
      frequency: 'Follow the product label and discontinue use if irritation occurs.',
    },
    howToUseSteps: [
      'Cleanse and dry your skin.',
      'Apply the amount directed on the package.',
      'Avoid the eye area and follow the product label for layering instructions.',
      'Patch test first if you have sensitive skin.',
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
      reply: 'Delivery options, charges, and estimates are shown at checkout for your address. I cannot retrieve live shipping information while the concierge service is unavailable.',
      quickActions: supportActions,
    };
  }

  if (/\b(order|track|tracking|return|refund|wallet|coupon)\b/.test(normalizedQuery)) {
    return {
      reply: 'I cannot access live account or order information right now. Please open the order-support verification flow, or try again when the Client Concierge service is available.',
      quickActions: supportActions,
    };
  }

  const product = FRONTEND_PRODUCTS_GUIDE.find(item =>
    normalizedQuery.includes(item.name.replace(/^Bhumivera\s+/i, '').toLowerCase()) ||
    normalizedQuery.includes(item.id.replace(/_/g, ' '))
  );
  const ingredientQuery = product
    ? normalizedQuery.replace(product.name.replace(/^Bhumivera\s+/i, '').toLowerCase(), '')
    : normalizedQuery;
  const ingredient = FRONTEND_INGREDIENT_MEMORY.find(item =>
    [item.name, ...item.aliases].some(name => ingredientQuery.includes(name.toLowerCase()))
  );

  if (ingredient) {
    const usage = product ? ` For exact product-specific inclusion and directions, check the ${product.name} label.` : '';
    return {
      reply: `**${ingredient.name}:** ${ingredient.description}${usage}`,
      quickActions: supportActions,
    };
  }

  if (product) {
    const activeList = product.keyActives.map(active => `${active.name} (${active.pct})`).join(', ');
    return {
      reply: `**${product.name}**\nListed ingredients in this guide: ${activeList}.\n\nPlease check the product packaging for the complete ingredient list and exact directions.`,
      quickActions: supportActions,
    };
  }

  return {
    reply: 'The Client Concierge service is temporarily unavailable, so I cannot look up live account details or confirm product-specific information. Please check the product label for ingredients and directions, or try again shortly.',
    quickActions: supportActions,
  };
}
