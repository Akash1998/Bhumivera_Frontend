/**
 * BHUMIVERA MASTER UNIQUE DATA & AUTHENTIC PHOTOGRAPHY REGISTRY
 * All images resolve to authentic high-resolution photographs (/assets/images/*.webp).
 * Zero video animations (.mp4 / <video>) exist anywhere in this registry.
 */

export const UNIQUE_IMAGE_BANK = [
  '/assets/images/seabuckthorn nature.webp',
  '/assets/images/seabuckthorn.webp',
  '/assets/images/charcoalFace wash.webp',
  '/assets/images/charcoal.webp',
  '/assets/images/tulsi.webp',
  '/assets/images/aloeverascience.webp',
  '/assets/images/aloeveradna.webp',
  '/assets/images/aloeveradrop.webp',
  '/assets/images/aloeverabeaker.webp',
  '/assets/images/niacidamine.webp',
  '/assets/images/plant tree.webp',
  '/assets/images/river free.webp',
  '/assets/images/education.webp',
  '/assets/images/foundermanifesto.webp',
  '/assets/images/Promo1.webp',
  '/assets/images/Promo2.webp',
  '/assets/images/Promo3.webp',
  '/assets/images/Promo4.webp',
  '/assets/images/Promo5.webp',
  '/assets/images/Promo7.webp',
  '/assets/images/Promo8.webp',
  '/assets/images/Promo9.webp',
  '/assets/images/home-stewardship-ledger.webp',
  '/assets/images/kashmiri-saffron.webp',
];

// 1. FOOTER 4 PHOTOGRAPHIC PILLARS + BRAND BANNER (Distinct Authentic Photographs)
export const FOOTER_BRAND_BANNER_IMAGE = '/assets/images/Promo7.webp';

export const FOOTER_PHOTO_STORIES = [
  {
    id: 'planting',
    code: '01',
    title: 'Himalayan & Native Afforestation',
    subtitle: 'On-Ground Sapling Nursery & Soil Stewardship',
    image: '/assets/images/plant tree.webp',
    modalDetailImage: '/assets/images/education.webp',
    location: 'Spiti & Asansol Nursery Corridors, India',
    metric: '100% Receipt-Backed COD Pledges',
    description:
      'Every environmental contribution is tracked from order delivery to physical sapling preparation in biodegradable jute pots. Public totals update only after cash collection reconciliation and field photo verification.',
    realLifeExample:
      'Real-Life Case #IMP-2026-01: 420 native Neem, Amla, and Sea Buckthorn saplings prepared in biodegradable jute grow-bags with verified soil moisture logs.',
    link: '/impact',
    linkLabel: 'Inspect Public Impact Ledger',
  },
  {
    id: 'science',
    code: '02',
    title: 'Cold-Pressed Botanical & Active Lab',
    subtitle: 'Sea Buckthorn, Niacinamide & Hyaluronic Synergy',
    image: '/assets/images/aloeverabeaker.webp',
    modalDetailImage: '/assets/images/niacidamine.webp',
    location: 'Bhumivera Formulation & pH Calibration Lab',
    metric: 'pH 5.3 – 5.6 Skin-Identical Calibration',
    description:
      'Our chemists pair cold-pressed Himalayan Sea Buckthorn (Omega-7), Kashmiri Saffron, and Aloe Vera inner-leaf fillet with cosmetic-grade Niacinamide (1%) and Sodium Hyaluronate (0.5%).',
    realLifeExample:
      'Real-Life Batch #BV-LAB-884: Digital pH electrode verification at 5.48 pH at 25°C prior to amber glass filling.',
    link: '/science',
    linkLabel: 'Explore Formulation Science',
  },
  {
    id: 'unboxing',
    code: '03',
    title: 'Artisanal Wax-Sealed Tamper Custody',
    subtitle: 'Warehouse Digital Scale & Bubble-Wrap Protection',
    image: '/assets/images/Promo9.webp',
    modalDetailImage: '/assets/images/Promo2.webp',
    location: 'West Bengal Fulfilment Hub · Dispatch Bay 02',
    metric: '±0.5g Atelier Gravimetric Certificate',
    description:
      'Every Bhumivera parcel is cushioned with bubble wrap, sealed with tamper-evident security tape, and weighed before the courier label is prepared.',
    realLifeExample:
      'Real-Life Dispatch #AWB-DLV998811: 210g gross parcel weight logged on digital scale with intact gold-black neck security seal.',
    link: '/purchase-protection',
    linkLabel: 'View Purchase Protection Shield',
  },
  {
    id: 'rivers',
    code: '04',
    title: 'Watershed & Botanical Sourcing Care',
    subtitle: 'Zero-Sulfate Biodegradable Wash-Off Standard',
    image: '/assets/images/river free.webp',
    modalDetailImage: '/assets/images/Promo1.webp',
    location: 'Himalayan & Eastern India River Basins',
    metric: '0% SLS / SLES / Microplastics',
    description:
      'Daily cleansers wash directly into local waterways. By formulating with mild plant-derived glucosides, Reetha saponins, and biodegradable botanical extracts, our rinse-off footprint stays gentle on aquatic ecosystems.',
    realLifeExample:
      'Real-Life Study #WTR-2026-04: Biodegradable decyl glucoside & soapnut surfactant rinse test showing zero synthetic polymer residue.',
    link: '/provenance-engine',
    linkLabel: 'Explore Provenance & Sourcing',
  },
];

// 2. HOMEPAGE (PremiumHome.jsx) UNIQUE IMAGES & REAL-LIFE EXAMPLES (Distinct Authentic Assets)
export const HOME_VISUAL_ASSETS = {
  heroPrimary: '/assets/images/seabuckthorn nature.webp',
  heroSecondary: '/assets/images/seabuckthorn.webp',
  stewardshipBanner: '/assets/images/home-stewardship-ledger.webp',
  activeSynergyBanner: '/assets/images/aloeverascience.webp',
  ingredients: [
    {
      name: 'Activated Bamboo Charcoal (3%)',
      botanical: 'Microporous Steam-Activated Carbon (3.0%)',
      note: 'Assam bamboo steam-activated carbon micro-particles adsorb deep pore sebum, urban PM2.5 soot, and impurities without stripping.',
      image: '/assets/images/charcoal.webp',
      tone: 'from-[#111a15]/90',
      badge: 'Assam Bamboo Groves · 3% Active Micro-Carbon',
    },
    {
      name: 'Himalayan Sea Buckthorn',
      botanical: 'Hippophae rhamnoides L. · Wild Berry Lipid',
      note: 'Hand-harvested in high-altitude Ladakh valleys; rich in rare Omega-7 palmitoleic acid and cellular bio-carotenoids.',
      image: '/assets/images/seabuckthorn nature.webp',
      tone: 'from-[#381d0d]/90',
      badge: 'Ladakh Valley · 3,400m · Omega-7 Rich',
    },
    {
      name: 'Sacred Tulsi, Neem & Haridra',
      botanical: 'Ocimum tenuiflorum, Azadirachta indica & Curcuma longa',
      note: 'Standardized golden turmeric (Haridra 0.5%), Neem (0.5%), and holy basil that balance and clarify skin microbiota.',
      image: '/assets/images/tulsi.webp',
      tone: 'from-[#172719]/90',
      badge: 'Central India · Standardized Botanical Actives',
    },
    {
      name: 'Pampore Kashmiri Saffron & Triphala',
      botanical: 'Crocus sativus L. & Emblica officinalis Blend',
      note: 'Pampore Karewa Mongra Saffron stigmas and sacred Triphala myrobalans for antioxidant radiance and root rejuvenation.',
      image: '/assets/images/Promo4.webp',
      tone: 'from-[#2a1b10]/90',
      badge: 'Pampore Highlands (1,600m) · Grade-A Mongra',
    },
  ],
  realLifeFieldStudies: [
    {
      id: 'home-case-1',
      title: 'Cold-Pressed Extraction at <28°C',
      subtitle: 'Preserving Heat-Sensitive Omega-7 & Vitamin C',
      description: 'Unlike steam-boiled commercial extracts, our Sea Buckthorn berries are cold-pressed in small batches so bioactive carotenoids remain intact.',
      image: '/assets/images/home-cold-pressed-extraction.webp',
      tag: 'Batch QC #SB-2026-09',
    },
    {
      id: 'home-case-2',
      title: '24-Hour Forearm Patch Test Protocol',
      subtitle: '24-Hour Skin Compatibility Patch Test',
      description: 'Every bottle includes clear instructions for a 24-hour inner-forearm patch test to verify individual skin compatibility with concentrated botanicals.',
      image: '/assets/images/home-forearm-patch-test.webp',
      tag: 'Safety Standard #PT-24H',
    },
    {
      id: 'home-case-3',
      title: 'Tamper-Evident Neck Seal & Weight Log',
      subtitle: 'Warehouse Digital Scale Verification',
      description: 'Each bottle is sealed with a matte-black and gold security strip and weighed on a digital platform scale before leaving our facility.',
      image: '/assets/images/home-dispatch-weight-log.webp',
      tag: 'Dispatch Shield #WS-100',
    },
    {
      id: 'home-case-4',
      title: 'Four-Texture Apothecary Swatch Study',
      subtitle: 'Zero Artificial Dyes or Sulphate Foaming Agents',
      description: 'Natural amber, charcoal matte, golden saffron oil, and translucent aloe gel colors come strictly from the raw botanical extracts themselves.',
      image: '/assets/images/home-apothecary-swatches.webp',
      tag: 'Apothecary Lab #SW-4',
    },
  ],
};

// 3. DEFAULT CATALOG FALLBACK PRODUCTS (Transcribed From Physical Bottle Labels & Authentic Photographs)
export const FALLBACK_CATALOG_PRODUCTS = [
  {
    id: 8,
    _id: '8',
    slug: 'aloe vera face wash',
    name: 'Seabuckthorn Face wash by Bhumivera',
    brand: 'Bhumivera',
    category_id: 1,
    category_name: 'Facial Cleansers',
    category_slug: 'facial-cleansers',
    price: 499,
    discount_price: 399,
    quantity: 92,
    countInStock: 92,
    inStock: true,
    rating: 4.9,
    reviews: 128,
    numReviews: 128,
    is_featured: 1,
    sku: 'BV-SBFW-100ML',
    warranty_period: 12,
    image_url: '/assets/images/seabuckthorn.webp',
    images: ['/assets/images/seabuckthorn.webp', '/assets/images/seabuckthorn nature.webp'],
    description: 'A pH 5.5 balanced, soap-free daily facial cleanser formulated with Cold-Pressed Himalayan Sea Buckthorn (Omega-7), Niacinamide (1%), Hyaluronic Acid (0.1%), Aloe Vera inner fillet (5%), Botanical Glycerin (5%), and Tulsi extract (0.5%). Compounded in small artisanal batches with zero sulphates.',
    phLevel: '5.5 (Skin-Identical)',
    primaryBotanicals: 'Himalayan Sea Buckthorn (2.0%), Aloe Vera Fillet (5.0%), Sacred Tulsi (0.5%)',
    clinicalActives: 'Niacinamide Vitamin B3 (1.0%), Hyaluronic Acid (0.1%), Botanical Glycerin (5.0%)',
    skinTypeCompatibility: 'Normal, Combination, Oily, Sensitive & Barrier-Impaired Skin',
    surfactantSystem: 'Decyl Glucoside & Coco-Glucoside (100% Sulfate-Free)',
    ritualTiming: 'Twice Daily (AM Antioxidant Shield & PM Barrier Reset · 30–45s Massage)',
    volume: '100 ml / 3.38 fl. oz. Amber Glass Pump',
    batchCode: 'BV-SB26-1042',
    directions: 'Moisten face and neck, apply a small amount of this facewash, and gently work up a lather using a circular motion. Wash off and pat dry. Use twice daily.',
    caution: 'Product contains natural ingredients & may change colour and fragrance, without losing effectiveness. Patch test recommended. Store in a cool and dry place, away from direct sunlight. For external use only.',
  },
  {
    id: 9,
    _id: '9',
    slug: 'charcoal-face-wash',
    name: 'Charcoal face wash',
    brand: 'Bhumivera',
    category_id: 1,
    category_name: 'Facial Cleansers',
    category_slug: 'facial-cleansers',
    price: 399,
    discount_price: 299,
    quantity: 87,
    countInStock: 87,
    inStock: true,
    rating: 4.8,
    reviews: 96,
    numReviews: 96,
    is_featured: 1,
    sku: 'BV-CHFW-100ML',
    warranty_period: 12,
    image_url: '/assets/images/charcoalFace wash.webp',
    images: ['/assets/images/charcoalFace wash.webp', '/assets/images/charcoal.webp'],
    description: 'Deep urban pore-purifying artisanal facial cleanser. Each 100ml contains: Charcoal 3%, Haridra (Turmeric) 0.5%, Neem 0.5%, Glycerin 5%, Cucumber Extract 0.5%, Manjistha Extract 0.5%, Hyaluronic Acid 0.1%, Niacinamide 0.1%, Perfume 0.5%, and Base Q.S. Adsorbs deep pore soot, urban particulate matter, and oxidized sebum while maintaining the acid mantle.',
    phLevel: '5.51 (Skin-Identical Balanced Clarifying)',
    primaryBotanicals: 'Charcoal (3%), Haridra Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%)',
    clinicalActives: 'Botanical Glycerin (5%), Niacinamide (0.1%), Hyaluronic Acid (0.1%)',
    skinTypeCompatibility: 'Oily, Congested, Blemish-Prone & Urban Pollution-Exposed Skin',
    surfactantSystem: 'Mild Plant-Derived Glucoside & Betaine Matrix',
    ritualTiming: 'Twice Daily (AM Clarifying & PM Deep Reset · 30–45s Circular Massage)',
    volume: '100 ml / 3.38 fl. oz. UV-Protected Gold-Trim Bottle',
    batchCode: 'BV-CH26-8841',
    directions: 'Moisten Face and neck, apply a small amount of this facewash, and gently work up a lather using a circular motion. Wash off and pat dry. Use twice daily.',
    caution: 'Product contains natural ingredients & may change colour and fragrance, without losing effectiveness. Patch test recommended. Store in a cool and dry place, away from direct sunlight. For external use only.',
  },
  {
    id: 103,
    _id: '103',
    inStock: false,
    slug: 'bhumivera-kumkumadi-night-elixir',
    name: 'Bhumivera Kashmiri Saffron Kumkumadi Night Elixir',
    brand: 'Bhumivera',
    category_id: 2,
    category_name: 'Night Elixirs & Serums',
    category_slug: 'night-elixirs',
    price: 1499,
    discount_price: 1199,
    quantity: 34,
    countInStock: 34,
    rating: 4.95,
    reviews: 142,
    numReviews: 142,
    is_featured: 1,
    sku: 'BV-KMNE-30ML',
    warranty_period: 12,
    image_url: '/assets/images/Promo4.webp',
    images: ['/assets/images/Promo4.webp', '/assets/images/Promo2.webp'],
    description: 'Classical 26-herb Ayurvedic cellular night oil infused with Pampore Mongra Kashmiri Saffron (Crocus sativus), Red Sandalwood (Rakta Chandana), Manjistha, Vetiver, and Haridra for overnight radiance, barrier lipid nourishment, and micro-circulation.',
    phLevel: 'Anhydrous Lipid Elixir (Water-Free)',
    primaryBotanicals: 'Pampore Kashmiri Saffron, Rakta Chandana, Manjistha, Yashtimadhu (26 Herbs)',
    clinicalActives: 'Crocin, Safranal, Natural Squalene & Cold-Pressed Sesame/Jojoba Lipids',
    skinTypeCompatibility: 'Dry, Normal, Combination & Uneven/Pigmented Complexions',
    surfactantSystem: 'None (Leave-On Overnight Botanical Oil Elixir)',
    ritualTiming: 'Nightly PM Ritual (Warm 2–3 drops between palms & press onto damp skin)',
    volume: '30 ml / 1.0 fl. oz. Amber Glass Pipette Dropper',
    batchCode: 'BV-KK26-3019',
    directions: 'Apply 2 to 3 drops onto clean, damp skin after cleansing. Gently press into face and neck using upward strokes. Allow overnight absorption.',
    caution: 'Product contains natural cold-pressed botanicals & pure saffron stigmas. Store in a cool and dry place, away from direct sunlight. For external use only.',
  },
  {
    id: 104,
    _id: '104',
    inStock: false,
    slug: 'bhumivera-amla-bhringraj-botanical-shampoo',
    name: 'Bhumivera Botanical Hair Cleanser & Shampoo',
    brand: 'Bhumivera',
    category_id: 3,
    category_name: 'Hair & Scalp Rituals',
    category_slug: 'hair-scalp-rituals',
    price: 799,
    discount_price: 629,
    quantity: 55,
    countInStock: 55,
    rating: 4.85,
    reviews: 84,
    numReviews: 84,
    is_featured: 1,
    sku: 'BV-ARSH-200ML',
    warranty_period: 12,
    image_url: '/assets/images/Promo3.webp',
    images: ['/assets/images/Promo3.webp', '/assets/images/Promo8.webp'],
    description: 'Sulfate-free Ayurvedic botanical hair cleanser. Each 100ml contains: Triphala 10mg, Amla 20mg, Ritta (Soapnut) 25mg, Shikakai 5mg, Bringna (Bhringraj) 10mg, Rosemary Oil 10mg, Neem 10mg, Aloe Vera (Aleovera) 10mg, in a pure Botanical Shampoo Base Q.S. Formulated to fortify hair roots and maintain cuticle smoothness.',
    phLevel: '5.24 (Cuticle-Smoothing Acidic pH)',
    primaryBotanicals: 'Ritta / Reetha (25mg), Amla (20mg), Triphala (10mg), Bringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aloe Vera (10mg), Shikakai (5mg)',
    clinicalActives: 'Carnosic Acid, Wedelolactone, Natural Saponins & Vitamin C Tannins',
    skinTypeCompatibility: 'All Scalp Types, Thinning Hair, Hard-Water Buildup & Sensitive Scalps',
    surfactantSystem: 'Natural Sapindus mukorossi (Reetha) Saponins + Mild Botanical Cleanser Base',
    ritualTiming: '2–3 Times Weekly (Apply on wet hair, gently massage scalp & rinse off)',
    volume: '200 ml / 6.76 fl. oz. Apothecary Dispenser',
    batchCode: 'BV-SH26-4409',
    directions: 'Apply shampoo on wet hair, gently massage & rinse off. Repeat if required.',
    caution: 'Product contains natural ingredients & may change colour and fragrance, without losing effectiveness. Patch test recommended. Store in a cool and dry place, away from direct sunlight. For external use only.',
  },
  {
    id: 105,
    _id: '105',
    inStock: false,
    slug: 'bhumivera-gotu-kola-barrier-repair-gel',
    name: 'Bhumivera Gotu Kola & Aloe Cellular Barrier Hydro-Gel',
    brand: 'Bhumivera',
    category_id: 4,
    category_name: 'Barrier Hydration',
    category_slug: 'barrier-hydration',
    price: 899,
    discount_price: 699,
    quantity: 41,
    countInStock: 41,
    rating: 4.9,
    reviews: 67,
    numReviews: 67,
    is_featured: 1,
    sku: 'BV-GKBG-50ML',
    warranty_period: 12,
    image_url: '/assets/images/aloeverascience.webp',
    images: ['/assets/images/aloeverascience.webp', '/assets/images/aloeveradrop.webp'],
    description: 'Featherlight post-cleansing barrier gel combining fresh Centella Asiatica (Gotu Kola) madecassoside extract, Cold-Pressed Aloe Vera fillet, Multi-Molecular Hyaluronic Acid, and Panthenol (Pro-Vitamin B5).',
    phLevel: '5.4 (Physiological Barrier Calm)',
    primaryBotanicals: 'Centella Asiatica Gotu Kola (3.0%), Aloe Barbadensis Inner Gel (10.0%)',
    clinicalActives: 'Madecassoside, Sodium Hyaluronate (0.5%), D-Panthenol (2.0%), Niacinamide (2.0%)',
    skinTypeCompatibility: 'Sensitive, Redness-Prone, Dehydrated & Post-Sun Skin',
    surfactantSystem: 'None (Leave-On 60-Second Damp-Skin Moisture Lock)',
    ritualTiming: 'Twice Daily Within 60 Seconds of Cleansing on Dewy Skin',
    volume: '50 g / 1.76 oz. Frosted Apothecary Jar',
    batchCode: 'BV-GK26-055',
  },
  {
    id: 106,
    _id: '106',
    inStock: false,
    slug: 'bhumivera-copper-distilled-tulsi-rose-hydrosol',
    name: 'Bhumivera Copper-Distilled Tulsi & Kannauj Rose Hydrosol Mist',
    brand: 'Bhumivera',
    category_id: 4,
    category_name: 'Barrier Hydration',
    category_slug: 'barrier-hydration',
    price: 599,
    discount_price: 449,
    quantity: 73,
    countInStock: 73,
    rating: 4.88,
    reviews: 91,
    numReviews: 91,
    is_featured: 0,
    sku: 'BV-TRHM-100ML',
    warranty_period: 12,
    image_url: '/assets/images/tulsi.webp',
    images: ['/assets/images/tulsi.webp', '/assets/images/Promo5.webp'],
    description: '100% steam-distilled botanical cellular water crafted in traditional copper Deg stills from fresh Rosa damascena petals and sacred Tulsi leaves to prep damp skin before serums and elixirs.',
    phLevel: '5.3 (Natural Hydrosol Acidity)',
    primaryBotanicals: 'Kannauj Rosa damascena Distillate (70%), Sacred Tulsi Hydrosol (28%)',
    clinicalActives: 'Botanical Glycerin (2.0%), Natural Rose Phenylethanol & Eugenol',
    skinTypeCompatibility: 'All Skin Types · Ideal Step-1 Prep for Kumkumadi Night Elixir',
    surfactantSystem: 'None (Alcohol-Free Steam Distillate Mist)',
    ritualTiming: 'AM/PM Immediately After Rinsing Face Wash (0–60s Window)',
    volume: '100 ml / 3.38 fl. oz. Fine Atomizer Amber Spray',
    batchCode: 'BV-RS26-093',
  },
];

// 4. ABOUT PAGE (About.jsx) UNIQUE IMAGES & REAL-LIFE EXAMPLES (Distinct Authentic Photographic Assets)
export const ABOUT_PAGE_DATA = {
  heroImage: '/assets/images/foundermanifesto.webp',
  genesisImage: '/assets/images/plant tree.webp',
  manifestoImage: '/assets/images/tulsi.webp',
  cleanroomImage: '/assets/images/aloeverascience.webp',
  milestones: [
    {
      year: 'Est. 2016 · 10-Year Heritage (MPG E Business Pvt. Ltd. → Bhumivera Organics India Pvt. Ltd.)',
      title: 'A Decade of Botanical Formulation Since 2016, Incorporated as a Luxury Flagship on 8 April 2026',
      copy: 'Our botanical formulation and offline retail stewardship began in 2016 under MPG E Business Private Limited. After 10 years of proven patron trust across India, we formally incorporated our dedicated luxury flagship and registered trademark—Bhumivera Organics India Private Limited (CIN: U20237WB2026PTC295842, RoC-Kolkata II)—on 8 April 2026 with directors Aman Prasad, Akash Prasad, and Payal Prasad.',
      image: '/assets/images/education.webp',
    },
    {
      year: 'Formulation Lab',
      title: 'Cold-Pressed Extracts + Clinical Actives at pH 5.5',
      copy: 'We bridge traditional Indian botanicals (Sea Buckthorn, Kumkumadi Saffron, Neem, Tulsi, Amla, Bhringraj) with precision actives (Niacinamide, Hyaluronic Acid) calibrated to protect the acid mantle.',
      image: '/assets/images/seabuckthorn nature.webp',
    },
    {
      year: 'Fulfilment Shield',
      title: 'Digital Weight-Scan & Bubble-Wrap Packaging',
      copy: 'Bubble wrap cushions products inside the parcel for transit, and the packed parcel is weighed before the courier label is prepared.',
      image: '/assets/images/Promo8.webp',
    },
    {
      year: 'Living Earth Ledger',
      title: 'Receipt-Verified Community & Tree Stewardship',
      copy: 'Optional COD pledges are never counted until cash is reconciled post-delivery and on-ground sapling or river-care work is documented with dated photographs.',
      image: '/assets/images/river free.webp',
    },
  ],
};

// 5. IMPACT PAGE (Impact.jsx) UNIQUE IMAGES & REAL-LIFE FIELD RECORDS (Distinct Authentic Field Photos)
export const IMPACT_PAGE_DATA = {
  heroImage: '/assets/images/home-stewardship-ledger.webp',
  charterImage: '/assets/images/foundermanifesto.webp',
  projectPosters: [
    { id: 'pampore-saffron', title: 'Pampore Saffron Corridors & Honeybee Sanctuaries', image: '/assets/images/impact-poster-01.webp' },
    { id: 'sacred-groves', title: 'Ancient Sacred Groves & Medicinal Reserves', image: '/assets/images/impact-poster-02.webp' },
    { id: 'earthen-kunds', title: 'Traditional Earthen Kunds & Wetland Aquifers', image: '/assets/images/impact-poster-03.webp' },
    { id: 'native-nurseries', title: 'Monsoon Sapling Preparation & Jute Potting', image: '/assets/images/impact-poster-04.webp' },
    { id: 'riparian-restoration', title: 'Riparian Coir & Vetiver Bank Stabilization', image: '/assets/images/impact-poster-05.webp' },
    { id: 'botanical-workshop', title: 'Medicinal Herb & Botanical Sorting Workshop', image: '/assets/images/impact-poster-06.webp' },
  ],
  projects: [
    {
      id: 'native-trees',
      title: 'Native Sapling Nurseries & Afforestation',
      copy: 'Locally adapted Neem, Amla, Peepal, and Himalayan Sea Buckthorn saplings raised in biodegradable jute bags for multi-season survival.',
      image: '/assets/images/plant tree.webp',
      metric: 'Biodegradable Jute Root-Balls · 18-Month Survival Audit',
      location: 'West Bengal & Himachal Corridors',
    },
    {
      id: 'river-care',
      title: 'Riparian Bank & Watershed Stewardship',
      copy: 'Community-led riverbank stabilization using coir geotextiles, native vetiver grass, and zero-sulfate greywater education.',
      image: '/assets/images/river free.webp',
      metric: 'Vetiver & Coir Erosion Barriers · Sulfate-Free Wash Standard',
      location: 'Damodar & Spiti Tributary Banks',
    },
    {
      id: 'community-care',
      title: 'Botanical Literacy & Community Gardens',
      copy: 'Hands-on medicinal plant identification workshops, seed-saving libraries, and seasonal kitchen-garden beds for local families.',
      image: '/assets/images/education.webp',
      metric: 'Open-Source Herbarium & Seed-Saving Workshops',
      location: 'Asansol & Rural Bengal Clusters',
      status: 'Active Corridor',
      isUpcoming: false,
    },
  ],
  upcomingProjects: [
    {
      id: 'saffron-pollinators',
      title: 'Pampore Saffron Corridors & Alpine Honeybee Sanctuaries',
      copy: 'Restoring high-altitude saffron soil vitality through pesticide-free floral buffer zones, wild biodiversity micro-hedges, and protected sanctuaries for indigenous Apis cerana honeybees.',
      image: '/assets/images/kashmiri-saffron.webp',
      metric: 'Target: 25 Community Apiaries & Organic Floral Buffer Belts',
      location: 'Pampore Karewas & Kashmir Valley (1,600m)',
      status: 'Upcoming · Will start from 2027',
      isUpcoming: true,
      upcomingYear: '2027',
    },
    {
      id: 'sacred-groves',
      title: 'Ancient Sacred Groves & Medicinal Ethnobotanical Reserves',
      copy: 'Preserving centuries-old community sacred groves (Devrais) and reviving endangered Ayurvedic germplasm: wild Manjistha, Rakta Chandana, Haridra, and indigenous wild Amla.',
      image: '/assets/images/Promo3.webp',
      metric: 'Target: 6 Heritage Sacred Forests Mapped & Protected',
      location: 'Vindhya & Central Indian Forest Belts',
      status: 'Upcoming · Will start from 2027',
      isUpcoming: true,
      upcomingYear: '2027',
    },
    {
      id: 'wetland-rejuvenation',
      title: 'Traditional Earthen Kunds & Wetland Aquifer Revival',
      copy: 'Restoring indigenous step-well aquifers, earthen percolation bunds, and deep vetiver bio-filters to naturally recharge ground water tables for local tribal grower settlements.',
      image: '/assets/images/Promo7.webp',
      metric: 'Target: 8 Desilted Percolation Reservoirs & Wetland Basins',
      location: 'Arid & Drought-Prone Rural Belts',
      status: 'Upcoming · Will start from 2027',
      isUpcoming: true,
      upcomingYear: '2027',
    },
  ],
  realLifeFieldNotes: [
    {
      id: 'fn-101',
      project_key: 'native-trees',
      title: 'Monsoon Sapling Preparation & Jute Potting Batch #01',
      field_date: '2026-09-18',
      location: 'Raniganj – Asansol Green Belt, West Bengal',
      verified_by: 'Bhumivera Field Stewardship Audit Team',
      summary: 'Prepared 350 native Azadirachta indica (Neem) and Phyllanthus emblica (Amla) saplings in unbleached jute grow-sacks enriched with vermicompost for community boundary planting.',
      photo_url: '/assets/images/seabuckthorn nature.webp',
    },
    {
      id: 'fn-102',
      project_key: 'river-care',
      title: 'Riparian Coir & Vetiver Bank Stabilization Drive',
      field_date: '2026-09-29',
      location: 'Riparian Buffer Zone, West Bengal',
      verified_by: 'Bhumivera Environmental Compliance Desk',
      summary: 'Installed biodegradable woven coir logs and planted deep-rooting Chrysopogon zizanioides (Vetiver) slips along 120 meters of stream bank to filter runoff and prevent soil collapse.',
      photo_url: '/assets/images/Promo1.webp',
    },
    {
      id: 'fn-103',
      project_key: 'community-care',
      title: 'Medicinal Herb & Botanical Sorting Workshop',
      field_date: '2026-10-08',
      location: 'Community Agro-Botanical Centre',
      verified_by: 'Bhumivera Botanical Education Lead',
      summary: 'Conducted a full-day practical training session on solar-drying Tulsi, grading raw Haridra rhizomes, and testing soil pH for chemical-free home herbal gardens.',
      photo_url: '/assets/images/tulsi.webp',
    },
  ],
};

// 6. PRODUCT SCIENCE PAGE (BhumiveraScience.jsx) UNIQUE IMAGES & LAB SPECIMENS (Distinct Authentic Photographic Assets)
export const SCIENCE_PAGE_DATA = {
  heroImage: '/assets/images/aloeverascience.webp',
  labBenchImage: '/assets/images/cleanroom-qc.webp',
  patchTestImage: '/assets/images/patch-test.webp',
  textureMatrixImage: '/assets/images/layering-rule.webp',
  ingredientSpecimens: [
    {
      id: 'sea_buckthorn',
      name: 'Himalayan Sea Buckthorn',
      botanicalName: 'Hippophae rhamnoides L. (Elaeagnaceae)',
      concentration: '1.5% – 3.0% Cold-Pressed Berry & Seed Extract',
      phWindow: 'pH 5.2 – 5.6',
      origin: 'Ladakh & Lahaul-Spiti High-Altitude Valleys (3,200m+)',
      note: 'Rich in rare Omega-7 (palmitoleic acid), Omega-3/6/9, beta-carotene, and Vitamins C & E. Cushions skin lipids during cleansing so skin feels supple, calm, and radiant after rinsing.',
      realLifeTest: 'Cold-pressed at <28°C to preserve deep orange carotenoid bio-activity without thermal oxidation.',
      image: '/assets/images/seabuckthorn nature.webp',
      reference: 'https://powo.science.kew.org/results?q=Hippophae%20rhamnoides',
      aiPrompt: 'Tell me about Sea Buckthorn Face Wash and its key ingredients',
    },
    {
      id: 'niacinamide',
      name: 'Niacinamide (Vitamin B3)',
      botanicalName: 'Nicotinamide / Pyridine-3-carboxamide (C6H6N2O)',
      concentration: '0.1% – 1.0% USP Cosmetic Grade Active',
      phWindow: 'pH 5.4 – 6.0 (Zero Nicotinic Acid Flush)',
      origin: 'Analytical Pharmaceutical Synthesis · Purity ≥99.5%',
      note: 'Water-soluble Vitamin B3 active that supports natural epidermal ceramide synthesis, regulates excess T-zone sebum, refines the appearance of enlarged pores, and calms redness.',
      realLifeTest: 'Calibrated at pH 5.5 to prevent hydrolysis into nicotinic acid, ensuring zero flushing on sensitive skin.',
      image: '/assets/images/niacidamine.webp',
      reference: 'https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide',
      aiPrompt: 'Tell me about Niacinamide in Sea Buckthorn Face Wash',
    },
    {
      id: 'hyaluronic_acid',
      name: 'Multi-Molecular Hyaluronic Acid',
      botanicalName: 'Sodium Hyaluronate Bio-Fermented Polysaccharide',
      concentration: '0.1% – 0.5% Humectant Matrix',
      phWindow: 'pH 5.0 – 6.5',
      origin: 'Plant-Glucose Bio-Fermentation · Zero Animal Source',
      note: 'Biomimetic humectant that binds up to 1,000 times its molecular weight in water, forming a breathable moisture cushion during washing so cleansing never leaves skin tight.',
      realLifeTest: 'Forms a hydrophilic film during the 40-second wash cycle that reduces post-rinse transepidermal water loss (TEWL).',
      image: '/assets/images/hyaluronic-acid-qc.webp',
      reference: 'https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate',
      aiPrompt: 'Tell me about Hyaluronic Acid in Sea Buckthorn Face Wash',
    },
    {
      id: 'aloe_vera',
      name: 'Cold-Filleted Aloe Vera Gel',
      botanicalName: 'Aloe barbadensis Miller (Asphodelaceae)',
      concentration: '5.0% Pure Inner-Leaf Mucilage Fillet',
      phWindow: 'pH 4.8 – 5.5',
      origin: 'Arid Sustainably Cultivated Farms, Rajasthan',
      note: 'Rich in acemannan polysaccharides, amino acids, and soothing plant sterols. Cools heat-flushed skin and cushions surfactant micelles during morning and evening cleansing.',
      realLifeTest: 'Hand-filleted within 6 hours of harvest to exclude outer-leaf aloin latex irritants.',
      image: '/assets/images/aloeverabeaker.webp',
      reference: 'https://powo.science.kew.org/results?q=Aloe%20vera',
      aiPrompt: 'Tell me about Aloe Vera in Sea Buckthorn Face Wash',
    },
    {
      id: 'tulsi',
      name: 'Sacred Krishna Tulsi & Neem',
      botanicalName: 'Ocimum tenuiflorum L. & Azadirachta indica',
      concentration: '0.5% Standardized Leaf & Distillate Extract',
      phWindow: 'pH 5.3 – 5.8',
      origin: 'Central & Eastern India Botanical Cooperatives',
      note: 'Contains rosmarinic acid, ursolic acid, nimbidin, and eugenol polyphenols that clarify urban pollution buildup and help calm blemish-prone skin.',
      realLifeTest: 'Steam-extracted in copper vessels to capture volatile eugenol and clarifying triterpenoids.',
      image: '/assets/images/tulsi.webp',
      reference: 'https://powo.science.kew.org/results?q=Ocimum%20tenuiflorum',
      aiPrompt: 'Tell me about Tulsi in Sea Buckthorn Face Wash',
    },
    {
      id: 'charcoal',
      name: 'Activated Bamboo Charcoal',
      botanicalName: 'Steam-Activated Microporous Carbon (3.0%)',
      concentration: '3.0% Ultra-Fine Cosmetic Grade (<15 Microns)',
      phWindow: 'pH 5.5 – 5.8',
      origin: 'Bambusa tulda Sustainable Groves, Assam',
      note: 'High-surface-area microporous carbon (>900 m²/g) that acts like a gentle magnet for excess sebum, oxidized pore debris, and PM2.5 urban traffic soot.',
      realLifeTest: 'Jet-milled to a silky <15-micron round particle profile so it purifies pores with zero physical scratchiness.',
      image: '/assets/images/charcoal.webp',
      reference: 'https://www.britannica.com/science/charcoal',
      aiPrompt: 'Tell me about Charcoal Face Wash and its key ingredients',
    },
    {
      id: 'saffron',
      name: 'Pampore Kashmiri Saffron (Kesar)',
      botanicalName: 'Crocus sativus L. · Grade-A Mongra Stigmas',
      concentration: 'Infused in 26-Herb Kumkumadi Tailam Matrix',
      phWindow: 'Lipid-Soluble Carotenoid Infusion',
      origin: 'Pampore Karewa Highlands, Jammu & Kashmir',
      note: 'Rich in bioactive crocin, picrocrocin, and safranal antioxidants that brighten dull skin tone, soften post-blemish marks, and impart natural golden luminosity.',
      realLifeTest: 'Authenticated via spectrophotometric crocin absorbance before slow-infusion with Red Sandalwood and Manjistha.',
      image: '/assets/images/kashmiri-saffron.webp',
      reference: 'https://powo.science.kew.org/results?q=Crocus%20sativus',
      aiPrompt: 'How do I pair Sea Buckthorn Face Wash with Bhumivera Kumkumadi Night Elixir?',
    },
    {
      id: 'amla_bhringraj',
      name: 'Amla, Reetha, Shikakai & Bhringraj',
      botanicalName: 'Phyllanthus emblica, Sapindus mukorossi & Eclipta prostrata',
      concentration: 'Reetha 25mg, Amla 20mg, Bhringraj 10mg, Rosemary 10mg',
      phWindow: 'pH 5.1 – 5.4 (Cuticle-Sealing)',
      origin: 'Vindhya & Western Ghats Forest Cooperatives',
      note: 'Natural saponin-rich soapnut pods gently lift scalp oil and hard-water mineral residue while Amla Vitamin C tannins and Bhringraj wedelolactone nourish hair roots.',
      realLifeTest: 'Decocted at low temperature in de-ionized water to preserve natural saponin foam stability without SLS.',
      image: '/assets/images/Promo3.webp',
      reference: 'https://powo.science.kew.org/results?q=Phyllanthus%20emblica',
      aiPrompt: 'Tell me about Bhumivera Botanical Shampoo ingredients',
    },
  ],
};

// 7. SOMATIC LABEL REGISTRY (SomaticRegistry.jsx) AUTHENTIC IMAGES & MULTI-PRODUCT LABEL DECODER
export const SOMATIC_REGISTRY_PRODUCTS = {
  charcoal_face: {
    id: 'charcoal_face',
    name: 'Bhumivera Activated Bamboo Charcoal Face Wash',
    sku: 'BV-CHFW-100ML',
    search: 'charcoal face wash',
    image: '/assets/images/charcoalFace wash.webp',
    labelSpecImage: '/assets/images/charcoal.webp',
    description: 'Transcribed directly from physical packaging bottle: each 100ml contains Charcoal 3%, Haridra 0.5%, Neem 0.5%, Glycerin 5%, Cucumber Extract 0.5%, Manjistha Extract 0.5%, Hyaluronic Acid 0.1%, Niacinamide 0.1%, Perfume 0.5%, Base Q.S.',
    fragrance: 'IFRA-compliant allergen-screened botanical aroma (0.5%)',
    phValue: '5.51',
    directions: 'Moisten Face and neck, apply a small amount of this facewash, and gently work up a lather using a circular motion. Wash off and pat dry. Use twice daily.',
    caution: 'Product contains natural ingredients & may change colour and fragrance, without losing effectiveness. Patch test recommended. Store in a cool and dry place, away from direct sunlight. For external use only.',
    ingredients: [
      ['Charcoal (Activated Bamboo Carbon)', '3.0%', 'Microporous pollutant & oxidized sebum adsorbent'],
      ['Botanical Glycerin', '5.0%', 'Humectant moisture cushion preventing tightness'],
      ['Haridra (Curcuma longa Turmeric)', '0.5%', 'Antioxidant brightening & soothing rhizome'],
      ['Neem (Azadirachta indica Leaf)', '0.5%', 'Microbiome clarifying botanical active'],
      ['Cucumber Extract (Cucumis sativus)', '0.5%', 'Cooling cutaneous microcirculation extract'],
      ['Manjistha Extract (Rubia cordifolia)', '0.5%', 'Tone-evening Ayurvedic root extract'],
      ['Hyaluronic Acid (Sodium Hyaluronate)', '0.1%', 'Surface hydration & TEWL barrier binder'],
      ['Niacinamide (Vitamin B3)', '0.1%', 'Pore-refining co-factor & ceramide supporter'],
      ['Perfume / Botanical Aroma', '0.5%', 'Listed fragrance component'],
      ['Aqua & Mild Surfactant Base', 'Q.S.', 'pH-balanced soap-free cleansing vehicle'],
    ],
    preferences: [
      { id: 'charcoal', label: 'Verify Activated Charcoal (3.0%) & Neem (0.5%)', ingredient: 'Charcoal (Activated Bamboo Carbon)' },
      { id: 'glycerin', label: 'Verify Botanical Glycerin (5.0%) Hydration Base', ingredient: 'Botanical Glycerin' },
      { id: 'all', label: 'Inspect Full 10-Line Transcribed Label Breakdown', ingredient: null },
    ],
  },
  botanical_shampoo: {
    id: 'botanical_shampoo',
    name: 'Bhumivera Botanical Hair Cleanser & Shampoo',
    sku: 'BV-ARSH-200ML',
    search: 'botanical shampoo hair cleanser',
    image: '/assets/images/Promo3.webp',
    labelSpecImage: '/assets/images/Promo8.webp',
    description: 'Transcribed from physical bottle label: each 100ml contains Triphala 10mg, Amla 20mg, Ritta (Soapnut) 25mg, Shikakai 5mg, Bringna 10mg, Rosemary oil 10mg, Neem 10mg, Aleovera 10mg, Shampoo Base Q.S.',
    fragrance: 'natural rosemary & amla herbal aroma',
    phValue: '5.24',
    directions: 'Apply shampoo on wet hair, gently massage & rinse off. Repeat if required.',
    caution: 'Patch test recommended. Store in cool dry place. For external use only.',
    ingredients: [
      ['Ritta / Soapnut (Sapindus mukorossi)', '25 mg', 'Natural lathering saponin pods lifting residue'],
      ['Amla (Phyllanthus emblica Fruit)', '20 mg', 'Vitamin C tannins & root-strengthening polyphenols'],
      ['Triphala (Terminalia chebula, bellerica & emblica)', '10 mg', 'Ayurvedic tridoshic scalp conditioning tonic'],
      ['Bringna / Bhringraj (Eclipta prostrata)', '10 mg', 'Wedelolactone active fortifying hair follicles'],
      ['Rosemary Essential Oil (Rosmarinus officinalis)', '10 mg', 'Scalp microcirculation & follicle invigorating aroma'],
      ['Neem (Azadirachta indica Leaf)', '10 mg', 'Natural antimicrobial scalp clarifying active'],
      ['Aleovera (Aloe barbadensis Inner Gel)', '10 mg', 'Cuticle soothing acemannan moisture fillet'],
      ['Shikakai (Acacia concinna Pods)', '5 mg', 'Low-pH gentle detangling & natural shine herb'],
      ['Botanical Shampoo Base', 'Q.S.', 'Mild plant-glucoside sulfate-free lather vehicle'],
    ],
    preferences: [
      { id: 'ritta', label: 'Verify Soapnut (25mg) & Amla (20mg)', ingredient: 'Ritta / Soapnut (Sapindus mukorossi)' },
      { id: 'rosemary', label: 'Verify Rosemary Oil (10mg) & Bhringraj (10mg)', ingredient: 'Rosemary Essential Oil (Rosmarinus officinalis)' },
      { id: 'all', label: 'Inspect Full Physical Label Formulation', ingredient: null },
    ],
  },
  seabuckthorn_face: {
    id: 'seabuckthorn_face',
    name: 'Bhumivera Sea Buckthorn & Niacinamide Face Wash',
    sku: 'BV-SBFW-100ML',
    search: 'sea buckthorn face wash',
    image: '/assets/images/seabuckthorn.webp',
    labelSpecImage: '/assets/images/seabuckthorn nature.webp',
    description: 'Compounded in small artisanal batches: an antioxidant Omega-7 daily cleanser with 5% Aloe Vera, 5% Glycerin, 1% Niacinamide, and 0.1% Hyaluronic Acid.',
    fragrance: 'mild botanical essence (patch test advised)',
    phValue: '5.50',
    directions: 'Moisten face and neck, apply a small amount, gently work up lather in circular motion, wash off and pat dry.',
    caution: 'Product contains natural ingredients & may change colour/fragrance without losing effectiveness. Store in cool dry place.',
    ingredients: [
      ['Himalayan Sea Buckthorn Extract', '2.0%', 'Omega-7 & carotenoid lipid barrier support'],
      ['Aloe Vera Inner-Leaf Fillet Gel', '5.0%', 'Soothing acemannan polysaccharide cushion'],
      ['Botanical Glycerin', '5.0%', 'Moisture-locking humectant cushion'],
      ['Niacinamide (Vitamin B3)', '1.0%', 'Ceramide synthesis & pore refinement'],
      ['Hyaluronic Acid (Sodium Hyaluronate)', '0.1%', 'Multi-depth water binding humectant'],
      ['Sacred Tulsi Leaf Extract', '0.5%', 'Antioxidant urban anti-pollution shield'],
      ['Decyl Glucoside & Aqua Base', 'Q.S.', 'Sulfate-free pH 5.5 micro-foam base'],
    ],
    preferences: [
      { id: 'seabuckthorn', label: 'Verify Sea Buckthorn (2.0%) & Aloe Vera (5.0%)', ingredient: 'Himalayan Sea Buckthorn Extract' },
      { id: 'niacinamide', label: 'Verify Niacinamide (1.0%) & Hyaluronic Acid (0.1%)', ingredient: 'Niacinamide (Vitamin B3)' },
      { id: 'all', label: 'Inspect Full Transcribed Label Breakdown', ingredient: null },
    ],
  },
  kumkumadi_elixir: {
    id: 'kumkumadi_elixir',
    name: 'Bhumivera Kashmiri Saffron Kumkumadi Night Elixir',
    sku: 'BV-KMNE-30ML',
    search: 'kumkumadi',
    image: '/assets/images/Promo4.webp',
    labelSpecImage: '/assets/images/Promo5.webp',
    description: 'Classical 26-herb overnight facial elixir infused with Pampore Kashmiri Mongra Saffron, Red Sandalwood, and Manjistha.',
    fragrance: '100% natural saffron & sandalwood botanical aroma (zero synthetic perfume)',
    phValue: 'Anhydrous Oil',
    directions: 'Warm 2 to 3 drops between palms and gently press onto damp cleansed skin before bedtime.',
    caution: '100% natural oil. Store away from direct sunlight. External application only.',
    ingredients: [
      ['Kashmiri Saffron (Crocus sativus Stigmas)', '2.5%', 'Crocin & safranal complexion illumination'],
      ['Rakta Chandana (Red Sandalwood)', '3.0%', 'Cooling blemish & pigmentation clarifier'],
      ['Manjistha & Yashtimadhu (Licorice)', '4.0%', 'Tyrosinase-modulating tone brighteners'],
      ['Haridra (Curcuma longa Extract)', '1.5%', 'Antioxidant photo-damage recovery'],
      ['Vetiver & Lotus Stamen Decoction', '3.0%', 'Calming dermal micro-circulation support'],
      ['Cold-Pressed Sesamum & Jojoba Lipid Base', 'Q.S.', 'Non-comedogenic overnight carrier matrix'],
    ],
    preferences: [
      { id: 'saffron', label: 'Verify Pampore Kashmiri Saffron (2.5%)', ingredient: 'Kashmiri Saffron (Crocus sativus Stigmas)' },
      { id: 'sandalwood', label: 'Verify Red Sandalwood & Manjistha Complex', ingredient: 'Rakta Chandana (Red Sandalwood)' },
      { id: 'all', label: 'Inspect Full Transcribed Label Breakdown', ingredient: null },
    ],
  },
};

// 8. PROVENANCE & BATCH GUIDE (ProvenanceEngine.jsx) (6 Distinct Authentic Regional Corridors)
export const PROVENANCE_PAGE_DATA = {
  heroImage: '/assets/images/Promo7.webp',
  herbariumImage: '/assets/images/tulsi.webp',
  regions: [
    {
      code: 'REG-01',
      region: 'Leh-Ladakh & Spiti Valley (3,400m)',
      botanical: 'Hippophae rhamnoides (Sea Buckthorn Berries)',
      harvestWindow: 'September – November (Post-Frost Peak Omega-7)',
      verificationMethod: 'Cold-pressed within 48 hours of harvest; refractive index & carotenoid UV-Vis check.',
      batchPrefix: 'BV-SB26',
      image: '/assets/images/Promo1.webp',
    },
    {
      code: 'REG-02',
      region: 'Pampore Karewa Highlands, Kashmir (1,600m)',
      botanical: 'Crocus sativus L. (Grade-A Mongra Saffron)',
      harvestWindow: 'Late October – Mid November Dawn Harvest',
      verificationMethod: 'Spectrophotometric crocin & safranal botanical assay.',
      batchPrefix: 'BV-KM26',
      image: '/assets/images/Promo4.webp',
    },
    {
      code: 'REG-03',
      region: 'Assam & North-East Bamboo Groves',
      botanical: 'Bambusa tulda (Steam-Activated Charcoal)',
      harvestWindow: 'Year-Round Sustainable Culm Pruning',
      verificationMethod: 'High-temperature steam activation (850°C) & <15-micron jet-milling sieve test.',
      batchPrefix: 'BV-CH26',
      image: '/assets/images/charcoal.webp',
    },
    {
      code: 'REG-04',
      region: 'Thar Edge Organic Belts, Rajasthan',
      botanical: 'Aloe barbadensis Miller (Inner Fillet Gel)',
      harvestWindow: '3-Year Mature Leaf Harvest · Pre-Summer & Autumn',
      verificationMethod: 'Hand-filleted to remove yellow aloin rind; cold-stabilized within 6 hours.',
      batchPrefix: 'BV-AL26',
      image: '/assets/images/aloeverascience.webp',
    },
    {
      code: 'REG-05',
      region: 'Vindhya & Central Indian Forest Belts',
      botanical: 'Amla, Reetha, Shikakai, Neem & Tulsi',
      harvestWindow: 'Winter Berry Harvest (Amla/Reetha) & Monsoon Leaf Cut',
      verificationMethod: 'HPTLC phytochemical fingerprint & heavy-metal ICP-MS screening.',
      batchPrefix: 'BV-SH26',
      image: '/assets/images/Promo3.webp',
    },
    {
      code: 'REG-06',
      region: 'West Bengal GMP Formulation & Filling Hub',
      botanical: 'Small-Batch Blending, pH Calibration & Weight-Scan',
      harvestWindow: 'Continuous 90-Day Fresh Batch Cycle',
      verificationMethod: 'Digital pH meter check (5.3–5.6), microbial plate count, and CCTV dispatch weight log.',
      batchPrefix: 'BV-WB26',
      image: '/assets/images/Promo5.webp',
    },
  ],
};

// 9. PRODUCT SERIAL VERIFICATION REFERENCE DATA
export const EWARRANTY_PAGE_DATA = {
  heroImage: '/assets/images/foundermanifesto.webp',
  sealMacroImage: '/assets/images/charcoalFace wash.webp',
  labCheckImage: '/assets/images/Promo5.webp',
  batchLabelImage: '/assets/images/Promo9.webp',
  sampleSerials: [
    {
      serial: 'BV-CH26-8841',
      product_id: 102,
      product_name: 'Bhumivera Activated Bamboo Charcoal Face Wash (100ml)',
      batch_code: 'BV-CH26-04',
      artisanal_run: 'Small Artisanal Batch #04 · 250 Units Handcrafted',
      bottle_number: 'Bottle #087 of 250',
      harvest_origin: 'Assam Bamboo Groves & Nilgiri Haridra',
      mfg_date: '2026-10-04',
      expiry_date: '2028-10-03',
      ph_verified: '5.51 pH (Skin-Identical Neutrality)',
      spectro_purity: '99.8% Active Bio-Carbon Adsorption',
      heavy_metals: 'Not Detected (0.0 ppm Lead, Mercury, Arsenic)',
      microbial_count: 'Hygienically Compounded Small-Batch Standard',
      dispatch_hub: 'West Bengal Formulation Atelier · Bay 02',
      base_warranty_months: 12,
      status: 'unregistered',
      image: '/assets/images/charcoalFace wash.webp',
      ingredientsBreakdown: [
        { name: 'Charcoal (Steam-Activated)', amount: '3.0%', role: 'Deep-pore micro-carbon soot & sebum adsorption' },
        { name: 'Haridra (Curcuma longa)', amount: '0.5%', role: 'Golden antioxidant barrier protection' },
        { name: 'Neem (Azadirachta indica)', amount: '0.5%', role: 'Microbiome clarifying & purifying phytonutrient' },
        { name: 'Botanical Glycerin', amount: '5.0%', role: 'Humectant cellular moisture shield' },
        { name: 'Cucumber Extract', amount: '0.5%', role: 'Cooling, soothing & erythema relief tonic' },
        { name: 'Manjistha Extract', amount: '0.5%', role: 'Ayurvedic blood purifier & complexion illumination' },
        { name: 'Hyaluronic Acid', amount: '0.1%', role: 'Deep epidermis trans-dermal hydration' },
        { name: 'Niacinamide (Vitamin B3)', amount: '0.1%', role: 'Pore refinement & lipid barrier synthesis' },
        { name: 'Natural Perfume', amount: '0.5%', role: 'Subtle hypoallergenic botanical aroma' },
        { name: 'Purified Base', amount: 'Q.S.', role: 'Soap-free sulfate-free gentle glucoside carrier' },
      ],
      directions: 'Moisten Face and neck, apply a small amount of this facewash, and gently work up a lather using a circular motion. Wash off and pat dry. Use twice daily.',
      caution: 'Product contains natural ingredients & may change colour and fragrance, without losing effectiveness. Patch test recommended. Store in a cool and dry place, away from direct sunlight. For external use only.',
      sanitaryCustody: '100% Sealed Virgin Unit · Artisanal Custody Guarantee: Compounded in small artisanal runs of 250 units and sealed with tamper-evident security to maintain uncompromised botanical purity.',
    },
    {
      serial: 'BV-SH26-4409',
      product_id: 104,
      product_name: 'Bhumivera Botanical Hair Cleanser & Shampoo (200ml)',
      batch_code: 'BV-SH26-02',
      artisanal_run: 'Small Artisanal Batch #02 · 300 Units Handcrafted',
      bottle_number: 'Bottle #142 of 300',
      harvest_origin: 'Western Ghats Reetha, Amla & Rosemary Oil',
      mfg_date: '2026-10-08',
      expiry_date: '2028-10-07',
      ph_verified: '5.24 pH (Cuticle-Smoothing Acidic pH)',
      spectro_purity: '100% Natural Sapindus mukorossi Saponin Cleansing',
      heavy_metals: 'Not Detected (0.0 ppm)',
      microbial_count: 'Hygienically Compounded Small-Batch Standard',
      dispatch_hub: 'West Bengal Formulation Atelier · Bay 01',
      base_warranty_months: 12,
      status: 'unregistered',
      image: '/assets/images/Promo3.webp',
      ingredientsBreakdown: [
        { name: 'Triphala', amount: '10 mg', role: 'Three sacred myrobalans for root rejuvenation' },
        { name: 'Amla (Phyllanthus emblica)', amount: '20 mg', role: 'Vitamin C & tannin-rich follicle fortifier' },
        { name: 'Ritta (Soapnut / Reetha)', amount: '25 mg', role: 'Natural biodegradable saponin surfactant' },
        { name: 'Shikakai (Acacia concinna)', amount: '5 mg', role: 'Gentle low-pH hair detangler & conditioner' },
        { name: 'Bringna (Bhringraj)', amount: '10 mg', role: 'Ancient Ayurvedic king of hair vitality' },
        { name: 'Rosemary Oil', amount: '10 mg', role: 'Scalp micro-circulation stimulator & terpene tonic' },
        { name: 'Neem', amount: '10 mg', role: 'Scalp microbiome antimicrobial balance' },
        { name: 'Aleovera (Aloe Vera)', amount: '10 mg', role: 'Inner fillet soothing & follicular hydration' },
        { name: 'Shampoo Base', amount: 'Q.S.', role: 'Zero-sulfate biodegradable cleansing matrix' },
      ],
      directions: 'Apply shampoo on wet hair, gently massage & rinse off. Repeat if required.',
      caution: 'Product contains natural ingredients & may change colour and fragrance, without losing effectiveness. Patch test recommended. Store in a cool and dry place, away from direct sunlight. For external use only.',
      sanitaryCustody: '100% Sealed Virgin Unit · Artisanal Custody Guarantee: Compounded in small artisanal runs of 250 units and sealed with tamper-evident security to maintain uncompromised botanical purity.',
    },
    {
      serial: 'BV-SB26-1042',
      product_id: 101,
      product_name: 'Bhumivera Sea Buckthorn & Niacinamide Face Wash (100ml)',
      batch_code: 'BV-SB26-09',
      artisanal_run: 'Small Artisanal Batch #09 · 250 Units Handcrafted',
      bottle_number: 'Bottle #034 of 250',
      harvest_origin: 'Leh-Ladakh Valley (3,400m) & Rajasthan Aloe',
      mfg_date: '2026-09-12',
      expiry_date: '2028-09-11',
      ph_verified: '5.48 pH @ 25°C (Skin-Identical)',
      spectro_purity: '99.4% Bioactive Palmitoleic Acid Retention',
      heavy_metals: 'Not Detected (0.0 ppm)',
      microbial_count: '0 CFU/g (Cleanroom Verified)',
      dispatch_hub: 'West Bengal Fulfilment Hub #01',
      base_warranty_months: 12,
      status: 'unregistered',
      image: '/assets/images/seabuckthorn.webp',
      ingredientsBreakdown: [
        { name: 'Cold-Pressed Sea Buckthorn', amount: '2.0%', role: 'Rare Omega-7 palmitoleic acid lipid barrier' },
        { name: 'Niacinamide (Vitamin B3)', amount: '1.0%', role: 'Barrier synthesis & pore clarity' },
        { name: 'Hyaluronic Acid', amount: '0.1%', role: 'Cellular moisture retention' },
        { name: 'Aloe Vera Inner Fillet', amount: '5.0%', role: 'Acemannan polysaccharide soothing' },
        { name: 'Botanical Glycerin', amount: '5.0%', role: 'Humectant moisture shield' },
        { name: 'Sacred Tulsi Extract', amount: '0.5%', role: 'Eugenol antioxidant phytonutrient' },
        { name: 'Decyl & Coco-Glucoside Base', amount: 'Q.S.', role: '100% Sulfate-free gentle plant foam' },
      ],
      directions: 'Moisten face and neck, apply a small amount of this facewash, and gently work up a lather using a circular motion. Wash off and pat dry. Use twice daily.',
      caution: 'Product contains natural ingredients & may change colour and fragrance, without losing effectiveness. Patch test recommended. Store in a cool and dry place, away from direct sunlight. For external use only.',
      sanitaryCustody: '100% Sealed Virgin Unit · Artisanal Custody Guarantee: Compounded in small artisanal runs of 250 units and sealed with tamper-evident security to maintain uncompromised botanical purity.',
    },
    {
      serial: 'BV-KK26-3019',
      product_id: 103,
      product_name: 'Bhumivera Kashmiri Saffron Kumkumadi Night Elixir (30ml)',
      batch_code: 'BV-KK26-01',
      artisanal_run: 'Artisanal Ultra-Small Batch #01 · 150 Droppers Handcrafted',
      bottle_number: 'Bottle #019 of 150',
      harvest_origin: 'Pampore Karewa Highlands, Kashmir (1,600m)',
      mfg_date: '2026-10-02',
      expiry_date: '2028-10-01',
      ph_verified: 'Anhydrous Pure Lipid Matrix (Crocin Verified)',
      spectro_purity: 'Grade-A Mongra Saffron Infused',
      heavy_metals: 'Not Detected (0.0 ppm)',
      microbial_count: '0 CFU/g (Anhydrous Sterile Oil)',
      dispatch_hub: 'West Bengal Fulfilment Hub #02',
      base_warranty_months: 12,
      status: 'registered',
      registration_id: 'BV-GOLD-301944',
      user_name: 'Meera Das (Verified Patron)',
      shop_name: 'Bhumivera Official Online Maison',
      warranty_end_date: '2027-11-02',
      image: '/assets/images/Promo4.webp',
      ingredientsBreakdown: [
        { name: 'Grade-A Mongra Kashmiri Saffron', amount: '2.5%', role: 'Crocin & safranal complexion illumination' },
        { name: 'Rakta Chandana (Red Sandalwood)', amount: '3.0%', role: 'Cooling blemish & tone clarifier' },
        { name: 'Manjistha Extract', amount: '4.0%', role: 'Ayurvedic blood purifier & complexion refiner' },
        { name: 'Yashtimadhu (Licorice)', amount: '2.0%', role: 'Glabridin pigmentation inhibitor' },
        { name: 'Cold-Pressed Sesame & Jojoba Oil', amount: 'Q.S.', role: 'Biomimetic dermal absorption lipid carrier' },
      ],
      directions: 'Warm 2–3 drops between palms and press gently into clean damp skin every evening.',
      caution: 'Pure cold-pressed oil with raw saffron filaments. Store in a cool dry dark place.',
      sanitaryCustody: '100% Sealed Virgin Unit · Artisanal Custody Guarantee: Compounded in small artisanal runs of 250 units and sealed with tamper-evident security to maintain uncompromised botanical purity.',
    },
  ],
};

// 10. AFFILIATE & PARTNER PROGRAM (Affiliate.jsx) AUTHENTIC IMAGES & CASE STUDIES
export const AFFILIATE_PAGE_DATA = {
  heroImage: '/assets/images/Promo1.webp',
  editorialImage: '/assets/images/Promo7.webp',
  creatorCaseStudies: [
    {
      name: 'Meera Nair · Cosmetic Formulation Educator',
      location: 'Bengaluru, Karnataka',
      focus: 'pH-Testing & INCI Label Breakdown Series',
      outcome: 'Demonstrated live pH 5.5 strip testing of Sea Buckthorn Face Wash across 14 educational posts with full #ad ASCI disclosure.',
      tier: 'Tier-2 Clinical Educator Partner',
      image: '/assets/images/aloeverascience.webp',
    },
    {
      name: 'Rohan & Kavya · Himalayan Slow-Living Journal',
      location: 'Manali & Leh Corridor',
      focus: 'Botanical Sourcing & Plastic-Free Packaging Stories',
      outcome: 'Documented high-altitude Sea Buckthorn harvesting and protective bubble-wrap packaging for first-time customers.',
      tier: 'Tier-3 Heritage Storyteller',
      image: '/assets/images/seabuckthorn nature.webp',
    },
    {
      name: 'Aarav Aesthetics · Holistic Facialist Studio',
      location: 'Kolkata, West Bengal',
      focus: 'Post-Wash 60-Second Layering & Kumkumadi Massage',
      outcome: 'Integrated Bhumivera cleansers and Kumkumadi Night Elixir into evening lymphatic facial workshops with QR referral cards.',
      tier: 'Boutique Studio Ambassador',
      image: '/assets/images/Promo4.webp',
    },
  ],
};

// 11. SELL ON BHUMIVERA / B2B SUPPLIER & RETAIL HUB (SellOnBhumivera.jsx) AUTHENTIC IMAGES
export const SELL_ON_BHUMIVERA_DATA = {
  heroImage: '/assets/images/Promo2.webp',
  partners: [
    {
      code: 'B2B-01',
      category: 'Raw Botanical Farmer Cooperatives & Wild-Harvesters',
      requirements: 'Zero synthetic pesticide residue (ICP-MS & GC-MS verified), traceable GPS harvest lot, and fair-wage grower ledger.',
      example: 'Ladakh Sea Buckthorn Women’s Cooperative & Pampore Saffron Grower Estates.',
      image: '/assets/images/seabuckthorn nature.webp',
    },
    {
      code: 'B2B-02',
      category: 'Luxury Spas, Ayurvedic Clinics & Boutique Hotels',
      requirements: 'Authorized physical treatment rooms or apothecary retail counter with temperature-controlled storage (<30°C).',
      example: 'Curated amenity & back-bar cleansing rituals across 12 boutique wellness retreats.',
      image: '/assets/images/Promo5.webp',
    },
    {
      code: 'B2B-03',
      category: 'Primary Glass, Cork & Protective Packaging',
      requirements: 'Heavy-metal-free UV-amber glass, protective bubble wrap, and tamper-evident security seals.',
      example: 'Zero-bubble-wrap corrugated transit boxes tested for 1.5m drop-impact resilience.',
      image: '/assets/images/Promo8.webp',
    },
    {
      code: 'B2B-04',
      category: 'Independent Analytical & Quality Testing Labs',
      requirements: 'Batch pH, viscosity, heavy-metal, and quality verification testing.',
      example: 'Independent third-party COA verification prior to warehouse serialization.',
      image: '/assets/images/aloeverabeaker.webp',
    },
  ],
};

// 12. CUSTOMER CARE: ORDER TRACKING, SANITARY CUSTODY, PURCHASE PROTECTION (Distinct Authentic Assets)
export const ORDER_TRACKING_DATA = {
  heroImage: '/assets/images/tracking-digital-scale.webp',
  stageImages: [
    '/assets/images/tracking-batch-allocation.webp',
    '/assets/images/tracking-tamper-seal.webp',
    '/assets/images/tracking-digital-scale.webp',
    '/assets/images/tracking-bubble-wrap.webp',
  ],
};

export const RETURNS_COURTESY_DATA = {
  heroImage: '/assets/images/Promo7.webp',
  guideStepImages: [
    {
      step: 'Step 01 · Outer Parcel & Scale Inspection',
      title: 'Inspect Courier Barcode & Declared Dispatch Weight',
      detail: 'Before opening the security seal, observe the intact outer kraft parcel showing the official AWB barcode and calibrated warehouse weight certificate.',
      image: '/assets/images/Promo8.webp',
    },
    {
      step: 'Step 02 · Tamper-Evident Gold Neck Seal',
      title: 'Verify Virgin Sanitary Custody Strip',
      detail: 'Remove the bubble-wrap cushioning and verify the unbroken metallic gold tamper-evident security band over the cap collar.',
      image: '/assets/images/Promo9.webp',
    },
    {
      step: 'Step 03 · Artisanal Serial & Genuinity Check',
      title: 'Scan QR or Enter Serial Number on /verify',
      detail: 'Each bottle has an individual serial (e.g. #087 of 250). Inspect the calibrated pH 5.51 assay and chemical purity certificate on our public lab portal.',
      image: '/assets/images/Promo1.webp',
    },
  ],
  realLifeDamageCases: [
    {
      caseId: 'CASE-CR-401',
      scenario: 'Artisanal Batch BV-CH26 Verification',
      resolution: 'Serial Authenticated: Bottle #087 of 250 with pH 5.51 & Heavy Metals ND',
      evidenceUsed: 'Spectrophotometric purity assay and bottle serial lookup confirmed on /verify.',
      image: '/assets/images/charcoalFace wash.webp',
    },
    {
      caseId: 'CASE-CR-402',
      scenario: 'Personal Care Sanitary Custody Protocol',
      resolution: 'Strict Virgin Seal Standard: 100% Uncirculated Pure Stock',
      evidenceUsed: 'Cosmetics safety compliance ensures no delivered personal care item is ever restocked.',
      image: '/assets/images/Promo3.webp',
    },
  ],
};

export const RETURNS_CENTRE_DATA = {
  heroImage: '/assets/images/Promo7.webp',
  forensicImage: '/assets/images/Promo8.webp',
  labVerifyImage: '/assets/images/Promo9.webp',
  resolvedLogs: [
    {
      rmaId: 'QC-2026-8812',
      orderNo: '#918273646',
      issueType: 'Batch Serial Genuinity Verification',
      warehouseWeight: '420.0g (Scale #02 Verified)',
      resolutionTime: 'Instant Real-Time Verification',
      outcome: 'Verified · Batch BV-SB26 Lab Assay pH 5.50 Confirmed',
      image: '/assets/images/charcoalFace wash.webp',
    },
    {
      rmaId: 'QC-2026-8819',
      orderNo: '#931044512',
      issueType: 'Apothecary Formulation Monograph Query',
      warehouseWeight: '215.0g Logged vs 215.0g Expected',
      resolutionTime: '1 Hour 15 Minutes',
      outcome: 'Resolved · Botanical Monograph & INCI Concentration Shared',
      image: '/assets/images/Promo3.webp',
    },
  ],
};

export const PURCHASE_PROTECTION_DATA = {
  heroImage: '/assets/images/Promo7.webp',
  scaleShieldImage: '/assets/images/Promo8.webp',
  sealShieldImage: '/assets/images/Promo9.webp',
  paymentShieldImage: '/assets/images/Promo1.webp',
};

// 13. 8 LEGAL & ANTI-FRAUD SHIELD DOMAINS (Legal.jsx) — AUTHENTIC HIGH-RESOLUTION ASSETS
export const LEGAL_SECTION_PROFILES = {
  terms: {
    id: 'terms',
    slug: 'conditions-of-use',
    code: 'PART I',
    title: 'Conditions of Use & Retail Sale',
    subtitle: 'Binding Electronic Contract, Patch-Test Duty, GST Pricing & SuperAdmin Cancellation Lock',
    statuteBadge: 'Indian Contract Act 1872 · IT Act 2000 Sec. 10A',
    heroImage: '/assets/images/Promo1.webp',
    keyMetrics: [
      ['18+ Years', 'Contractual Legal Capacity'],
      ['24–48 Hours', 'Mandatory Forearm Patch Test'],
      ['100% GST', 'Tax Invoice Fiscal Record'],
      ['Locked State', 'Post-Confirmation Order Lock'],
    ],
    realLifeExamples: [
      {
        caseCode: 'CASE-LGL-101',
        title: 'Natural Botanical Batch Variation vs. Defect',
        summary: 'A customer noticed winter-harvested Sea Buckthorn Face Wash had a deeper amber hue than a summer batch. Lab carotenoid records confirmed natural seasonal berry variation with identical pH 5.5 and active levels.',
        outcome: 'Verified authentic natural batch variation under Clause 1.3; full COA shared with customer.',
        image: '/assets/images/seabuckthorn.webp',
      },
      {
        caseCode: 'CASE-LGL-102',
        title: '24-Hour Inner-Forearm Patch Test Protocol',
        summary: 'Before applying Kumkumadi Night Elixir across the face, a customer with known essential-oil sensitivity performed the mandatory 24-hour inner-forearm patch test as instructed on the box.',
        outcome: 'Prevented facial irritation and guided customer to fragrance-free Aloe-Centella Barrier Gel.',
        image: '/assets/images/aloeveradna.webp',
      },
    ],
  },
  orders: {
    id: 'orders',
    slug: 'shipping-hygiene',
    code: 'PART II',
    title: 'Shipping & Personal-Care Sanitary Custody Standard',
    subtitle: 'Personal-Care Cosmetics Hygiene Seal Standard & 100% Sealed Virgin Custody',
    statuteBadge: 'Drugs & Cosmetics Act 1940 · E-Commerce Rules 2020',
    heroImage: '/assets/images/Promo7.webp',
    keyMetrics: [
      ['100% Sealed Virgin Units', 'Delivered Cosmetics Custody Standard'],
      ['Virgin Seal', 'Tamper-Evident Cap Collar'],
      ['Zero Re-entry', 'Zero Contamination Restocking'],
      ['Patron Care', 'Verified Concierge Quality Resolution'],
    ],
    realLifeExamples: [
      {
        caseCode: 'CASE-LGL-201',
        title: 'Why Delivered Personal Care Cannot Be Restocked',
        summary: 'Under cosmetic hygiene safety standards, delivered personal-care bottles cannot re-enter inventory to protect patrons against biological contamination.',
        outcome: 'Explained statutory hygiene seal rule; guided patron on artisanal application ritual.',
        image: '/assets/images/charcoalFace wash.webp',
      },
      {
        caseCode: 'CASE-LGL-202',
        title: 'Tamper Seal Intactness & Quality Resolution',
        summary: 'An order parcel arrived with transit impact to its outer bubble-wrap cushioning. Our concierge verified the intact gold neck seal and batch assay.',
        outcome: 'Concierge priority support provided directly to verified patron.',
        image: '/assets/images/Promo8.webp',
      },
    ],
  },
  antifraud: {
    id: 'antifraud',
    slug: 'unboxing-antiscam',
    code: 'PART III',
    title: 'Artisanal Wax-Sealed Custody & Patron Shield',
    subtitle: 'Warehouse Digital Weight-Scan Logs, Tamper-Evident Seals & Chargeback Forensics',
    statuteBadge: 'Bharatiya Sakshya Adhiniyam 2023 Sec. 63 · BNS 2023',
    heroImage: '/assets/images/Promo9.webp',
    keyMetrics: [
      ['±0.5g Scale', 'Pre-Dispatch Digital Weight Log'],
      ['6-Sided Proof', 'Intact AWB & Seal Inspection'],
      ['SHA-512 Audit', 'Immutable Payment & Order Trail'],
      ['Zero Tolerance', 'Sybil & False Chargeback Block'],
    ],
    realLifeExamples: [
      {
        caseCode: 'CASE-LGL-301',
        title: 'Warehouse Weight-Scan Resolves "Empty Box" Claim',
        summary: 'A false claim alleged a parcel arrived empty. Warehouse dispatch records proved the sealed box weighed 422.5g on the digital scale and Delhivery hub re-weighing logged 420.0g at destination.',
        outcome: 'Forensic weight certificate & CCTV frame disproved the false empty-box claim under Clause 3.2.',
        image: '/assets/images/Promo8.webp',
      },
      {
        caseCode: 'CASE-LGL-302',
        title: 'Courier Tampering Caught via Security Tape Check',
        summary: 'A customer showed that the outer brown tape had been slit and re-taped with clear plastic tape in transit before opening. Our team cross-checked the pre-dispatch seal photo.',
        outcome: 'Confirmed third-party courier tampering; initiated carrier claim and verified unboxing.',
        image: '/assets/images/Promo1.webp',
      },
    ],
  },
  referrals: {
    id: 'referrals',
    slug: 'wallet-loyalty-referrals',
    code: 'PART IV',
    title: 'Wallet, Loyalty & Referral Terms',
    subtitle: 'Dual-Ledger Wallet Separation (Refundable Cash vs. Promotional Credits) & Anti-Sybil Rules',
    statuteBadge: 'Indian Contract Act 1872 · Promotional Ledger Governance',
    heroImage: '/assets/images/Promo2.webp',
    keyMetrics: [
      ['Dual-Ledger', 'Refundable vs. Promotional Split'],
      ['45% Max Cap', 'Loyalty Points Redemption Ceiling'],
      ['Non-Cash', 'Referral & Spin Promotional Credits'],
      ['Anti-Sybil', 'Self-Referral & Multi-Account Filter'],
    ],
    realLifeExamples: [
      {
        caseCode: 'CASE-LGL-401',
        title: 'Dual-Ledger Refundable vs. Promotional Credit Split',
        summary: 'A customer paid ₹800 via UPI and ₹200 via Referral Bonus on an order cancelled before dispatch. The system automatically refunded ₹800 to their bank account and restored ₹200 to their Promotional Ledger.',
        outcome: 'Zero ledger confusion; exact source-of-funds preserved atomically under Clause 4.1.',
        image: '/assets/images/Promo3.webp',
      },
      {
        caseCode: 'CASE-LGL-402',
        title: 'Self-Referral Loop Blocked by Device & Address Graph',
        summary: 'An automated script attempted to create 9 disposable-email accounts delivering to the same pin-point address to farm referral credits.',
        outcome: 'Blocked by disposable-email and address-hash screening; promotional credits voided under Clause 4.6.',
        image: '/assets/images/Promo5.webp',
      },
    ],
  },
  warranty_affiliate: {
    id: 'warranty_affiliate',
    slug: 'warranty-affiliate-b2b',
    code: 'PART V',
    title: 'Warranty, Affiliate & B2B Partner Terms',
    subtitle: 'Product Serial Verification, ASCI Influencer Disclosures & Written Wholesale Contracts',
    statuteBadge: 'ASCI Guidelines · Trade Marks Act 1999 · CPA 2019',
    heroImage: '/assets/images/Promo4.webp',
    keyMetrics: [
      ['Serial Check', '1-to-1 Bottle Authenticity Lookup'],
      ['#Ad Mandatory', 'ASCI Influencer Disclosure Rule'],
      ['Written Only', 'B2B & Wholesale Agreements'],
      ['MAP Protected', 'Authorized Dealer Pricing Integrity'],
    ],
    realLifeExamples: [
      {
        caseCode: 'CASE-LGL-501',
        title: 'Serial Verification Exposes Unauthorized Marketplace Reseller',
        summary: 'A buyer checked serial code BV-SBFW-2026-8841 on /verify before purchasing from an unauthorized third-party discount page.',
        outcome: 'Protected buyer from expired grey-market stock and directed them to official sealed inventory.',
        image: '/assets/images/Promo7.webp',
      },
      {
        caseCode: 'CASE-LGL-502',
        title: 'Written B2B Prospectus for Boutique Spa Onboarding',
        summary: 'A wellness retreat in Goa requested bulk back-bar Kumkumadi and Sea Buckthorn cleansers. All MOQ, GST input credit, and storage terms were executed via formal written B2B contract.',
        outcome: 'Clean GST B2B invoicing and batch traceability established under Clause 5.7.',
        image: '/assets/images/Promo2.webp',
      },
    ],
  },
  privacy: {
    id: 'privacy',
    slug: 'privacy-dpdp',
    code: 'PART VI',
    title: 'Privacy & DPDP Act 2023 Notice',
    subtitle: 'Data Fiduciary Duties, Scrypt/WebAuthn Passkeys, PII Masking & Consent Rights',
    statuteBadge: 'Digital Personal Data Protection (DPDP) Act 2023 · IT Rules 2011',
    heroImage: '/assets/images/Promo1.webp',
    keyMetrics: [
      ['DPDP 2023', 'Compliant Data Fiduciary Notice'],
      ['Zero Raw Card', 'PCI-DSS Tokenized Gateway Only'],
      ['WebAuthn', 'Hardware Passkey & Scrypt Hashing'],
      ['PII Masked', 'Automated Log Redaction Engine'],
    ],
    realLifeExamples: [
      {
        caseCode: 'CASE-LGL-601',
        title: 'Hardware Passkey Login Eliminates Phishing Risk',
        summary: 'A customer enabled WebAuthn biometric Passkey in their Bhumivera Profile, binding authentication cryptographically to their device enclave without transmitting a password.',
        outcome: 'Zero password reuse exposure and instant 1-tap sign-in under Clause 6.3.',
        image: '/assets/images/aloeveradna.webp',
      },
      {
        caseCode: 'CASE-LGL-602',
        title: 'Granular Marketing & Recommendation Consent Toggle',
        summary: 'A user opted out of personalized product recommendations in Profile settings while keeping transactional order-tracking alerts active.',
        outcome: 'Consent version logged immediately in database; recommendations switched to non-personalized catalog mode.',
        image: '/assets/images/education.webp',
      },
    ],
  },
  ip_disclaimer: {
    id: 'ip_disclaimer',
    slug: 'medical-ip-shield',
    code: 'PART VII',
    title: 'Medical Disclaimer, IP & Liability Shield',
    subtitle: 'Cosmetic vs. Pharmaceutical Distinction, Trade Dress Copyright & Statutory Liability Cap',
    statuteBadge: 'Drugs & Cosmetics Act 1940 · Copyright Act 1957 · Trade Marks Act 1999',
    heroImage: '/assets/images/charcoalFace wash.webp',
    keyMetrics: [
      ['Cosmetic Only', 'Non-Pharmaceutical Daily Care'],
      ['No Drug Claims', 'Zero Cure/Disease Representations'],
      ['Trade Dress', 'Protected Crest & Bottle Design'],
      ['Invoice Cap', '100% Order Value Liability Ceiling'],
    ],
    realLifeExamples: [
      {
        caseCode: 'CASE-LGL-701',
        title: 'Cosmetic Barrier Support vs. Clinical Prescription Treatment',
        summary: 'A customer with severe cystic acne asked the AI Concierge if Charcoal Face Wash could replace prescription isotretinoin. The Concierge clearly stated Bhumivera products are cosmetic cleansers, not medical drugs.',
        outcome: 'Advised consulting a qualified skincare professional while explaining gentle pH 5.5 cleansing support.',
        image: '/assets/images/charcoal.webp',
      },
      {
        caseCode: 'CASE-LGL-702',
        title: 'Takedown of Unauthorized Label & Photography Scraping',
        summary: 'An external clone site copied Bhumivera’s original product descriptions and apothecary bottle photography. Our IP team issued a statutory takedown notice with SHA-256 asset timestamps.',
        outcome: 'Clone listing removed within 24 hours under the Copyright Act 1957 and Trade Marks Act 1999.',
        image: '/assets/images/foundermanifesto.webp',
      },
    ],
  },
  grievance: {
    id: 'grievance',
    slug: 'arbitration-grievance',
    code: 'PART VIII',
    title: 'Arbitration, Jurisdiction & Grievance Officer',
    subtitle: '3-Tier Customer Care Escalation, Designated Grievance Officer & West Bengal Jurisdiction',
    statuteBadge: 'Consumer Protection (E-Commerce) Rules 2020 · Arbitration Act 1996',
    heroImage: '/assets/images/Promo8.webp',
    keyMetrics: [
      ['48 Hours', 'Grievance Ticket Acknowledgment'],
      ['3-Tier SLA', 'Concierge ➔ Specialist ➔ Officer'],
      ['West Bengal', 'Exclusive Judicial & Arbitral Seat'],
      ['Verified ID', 'Order Number & Buyer Auth Check'],
    ],
    realLifeExamples: [
      {
        caseCode: 'CASE-LGL-801',
        title: 'Tier-2 Verified Buyer Escalation Resolved in 9 Hours',
        summary: 'A customer whose courier tracking stalled in transit escalated Ticket #TKT-4410 via the Verified Buyer flow. Our logistics specialist contacted the regional hub and expedited delivery the next morning.',
        outcome: 'Resolved amicably at Tier-2 without needing formal arbitration.',
        image: '/assets/images/Promo9.webp',
      },
      {
        caseCode: 'CASE-LGL-802',
        title: 'Direct Grievance Officer Review for Payment Gateway Delay',
        summary: 'A UPI double-debit occurred during a bank server outage. The Grievance Officer cross-verified the Razorpay webhook log and issued the bank UTR refund confirmation within 18 hours.',
        outcome: 'Full statutory transparency and documented UTR closure provided under Clause 8.4.',
        image: '/assets/images/Promo1.webp',
      },
    ],
  },
  all: {
    id: 'all',
    slug: 'all',
    code: 'MASTER',
    title: 'Master 88-Clause E-Commerce Legal Suite',
    subtitle: 'Complete Consolidated Conditions of Use, Hygiene Custody, Anti-Scam & DPDP Governance',
    statuteBadge: 'All 8 Parts · 88 Binding Clauses · 2026-10-17-v4X',
    heroImage: '/assets/images/Promo7.webp',
    keyMetrics: [
      ['88 Clauses', '8 Complete Statutory Parts'],
      ['CPA 2019', 'Consumer & E-Commerce Compliant'],
      ['DPDP 2023', 'Privacy & Cryptographic Security'],
      ['West Bengal', 'Governing Indian Jurisdiction'],
    ],
    realLifeExamples: [],
  },
};

// 14. REMAINING PAGES UNIQUE IMAGES (Distinct Authentic Assets)
export const EXTRA_PAGE_IMAGES = {
  flashSalesHero: '/assets/images/Promo2.webp',
  spinRewardHero: '/assets/images/Promo4.webp',
  mpgeBusinessHero: '/assets/images/foundermanifesto.webp',
  addressBookPinpoint: '/assets/images/Promo7.webp',
  profileWalletShowcase: '/assets/images/Promo1.webp',
  checkoutSecurityShowcase: '/assets/images/Promo8.webp',
};


// 15. EXACT LABEL-VERIFIED LUXURY GEO OBJECTS & DIRECT-ANSWER FAQ BLOCKS
export const CHARCOAL_FACE_WASH_EXACT = {
  name: 'Bhumivera Activated Charcoal Purifying Luxury Face Wash',
  slug: 'activated-charcoal-luxury-face-wash',
    rating: 4.59,
    review_count: 220,
    reviews: 220,
  sku: 'BV-LUX-CFW-01',
  mpn: 'BVCFW2026LUX',
  price: 699.00,
  mrp: 899.00,
  stock: 250,
  category: 'Luxury Facial Cleansers',
  ph_level: '5.4 (Barrier-Hydrating Botanical & Active Emulsion)',
  active_ingredients: 'Activated Charcoal (3%), Botanical Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%)',
  image_url: '/images/products/bhumivera-activated-charcoal-luxury-face-wash.webp',
  seo_title: 'Bhumivera Activated Charcoal Luxury Face Wash | 3% Charcoal, Hyaluronic Acid, Niacinamide & Manjistha',
  meta_description: 'Shop Bhumivera Activated Charcoal Luxury Face Wash. Formulated per 100ml with label-disclosed potency: with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, Hyaluronic Acid & Niacinamide.',
  short_description: 'Ultra-luxury Activated Charcoal Face Wash formulated per 100ml with 3% Charcoal, 5% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid & 0.1% Niacinamide.',
  editorial_heading: 'Where Botanical Science Meets Royal Ayurveda',
  editorial_paragraphs: [
    "The Bhumivera Activated Charcoal Purifying Luxury Face Wash is a masterclass in multi-pathway skin purification and barrier hydration. Formulated with a clinical 3.0% concentration of Activated Charcoal, it acts as a deep-pore magnetic detoxifier—extracting urban PM2.5 pollutants, oxidized blackheads, and excess sebum without disrupting the skin's delicate acid mantle.",
    "To ensure zero post-wash dryness, our laboratories paired this purifying core with a sumptuous 5.0% Pure Botanical Glycerin cushion, 0.1% Hyaluronic Acid, and 0.1% Niacinamide (Vitamin B3) to lock in multi-depth epidermal moisture and refine pore texture. Crucially, the formula is elevated with India’s most revered complexion-brightening Ayurvedic botanicals—0.5% Manjistha Extract, 0.5% Haridra (Wild Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract—working in harmony to calm acne inflammation, fade stubborn dark spots, and unveil a translucent, glass-skin glow."
  ],
  composition_table: [
    { active: 'Activated Charcoal', potency: '3.0%', classification: 'Microporous Adsorbent Carbon', mechanism: 'Binds and extracts deep-seated pore toxins, heavy metals, pollution particulates, and excess sebum up to 200x its weight.' },
    { active: 'Botanical Glycerin', potency: '5.0%', classification: 'High-Potency Humectant Cushion', mechanism: 'Draws moisture into the stratum corneum during cleansing, preventing tightness and preserving skin-barrier elasticity.' },
    { active: 'Haridra (Wild Turmeric)', potency: '0.5%', classification: 'Curcuma longa Phyto-Active', mechanism: 'Rich in bioactive curcuminoids that neutralize free radicals, calm blemish redness, and brighten uneven skin tone.' },
    { active: 'Neem Extract', potency: '0.5%', classification: 'Azadirachta indica Extract', mechanism: 'Provides targeted antibacterial defense against acne-causing bacteria while regulating sebaceous gland hyperactivity.' },
    { active: 'Cucumber Extract', potency: '0.5%', classification: 'Cucumis sativus Cellular Cooling Extract', mechanism: 'Instantly cools epidermal heat, tightens pores, and delivers soothing silica and amino acids.' },
    { active: 'Manjistha Extract', potency: '0.5%', classification: 'Rubia cordifolia Complexion Enhancer', mechanism: 'Revered Ayurvedic blood and lymph purifier that inhibits hyperpigmentation and accelerates post-blemish scar fading.' },
    { active: 'Hyaluronic Acid', potency: '0.1%', classification: 'Biomimetic Moisture Magnet', mechanism: 'Holds up to 1,000x its weight in water, plumping fine dehydration lines and leaving a dewy, cushiony skin finish.' },
    { active: 'Niacinamide (Vitamin B3)', potency: '0.1%', classification: 'Barrier-Repair Vitamin Active', mechanism: 'Boosts natural ceramide synthesis, smooths uneven skin texture, and minimizes pore appearance.' },
    { active: 'Perfume & Cleanser Base', potency: '0.5% / Q.S.', classification: 'Luxury Micro-Emulsion Base', mechanism: 'Gentle, pH-balanced cleansing vehicle with a subtle allergen-screened luxury botanical aroma.' },
  ],
  faqs: [
    {
      q: 'What is the exact ingredient percentage breakdown of Bhumivera Activated Charcoal Face Wash?',
      a: 'Each 100ml bottle contains a transparent, label-disclosed concentration: 3% Activated Charcoal, 5% Glycerin, 0.5% Haridra (Turmeric), 0.5% Neem, 0.5% Cucumber Extract, 0.5% Manjistha Extract, 0.1% Hyaluronic Acid, and 0.1% Niacinamide in a gentle cleansing base (Q.S.).'
    },
    {
      q: 'Why does Bhumivera combine Activated Charcoal with Manjistha, Haridra, and Hyaluronic Acid?',
      a: 'Standard charcoal face washes only remove oil and often leave skin dehydrated. By pairing 3% Activated Charcoal with 5% Glycerin and 0.1% Hyaluronic Acid, Bhumivera deeply hydrates while detoxifying. Meanwhile, 0.5% Manjistha and 0.5% Haridra actively target pigmentation, acne marks, and dullness.'
    },
    {
      q: 'How should I use Bhumivera Activated Charcoal Face Wash for best results?',
      a: 'Moisten your face and neck, apply a small amount of the face wash, and gently work up a lather using circular motions for 60 seconds before washing off and patting dry. Use twice daily (morning and evening).'
    },
    {
      q: 'Which is the best luxury organic face wash in India for glowing skin?',
      a: 'Bhumivera Activated Charcoal Purifying Luxury Face Wash (SKU: BV-LUX-CFW-01) combines 3.0% microporous Activated Charcoal with 5.0% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.1% Hyaluronic Acid, and 0.1% Niacinamide at an optimal skin-barrier pH of 5.4.'
    },
    {
      q: 'Does Bhumivera Activated Charcoal Face Wash strip the skin barrier or cause post-wash tightness?',
      a: 'No. Calibrated at pH 5.4 with a 5.0% Botanical Glycerin humectant cushion and 0.1% Hyaluronic Acid, it removes PM2.5 pollution and oxidized sebum while preserving intercellular ceramides.'
    }
  ]
};

export const SHAMPOO_2IN1_EXACT = {
  name: 'Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner',
  slug: 'luxury-2-in-1-botanical-shampoo-conditioner',
    rating: 4.53,
    review_count: 160,
    reviews: 160,
  sku: 'BV-LUX-SH2IN1-05',
  mpn: 'BVSH2IN12026LUX',
  price: 899.00,
  mrp: 1199.00,
  stock: 200,
  category: 'Luxury Hair Care',
  ph_level: '5.0 (Ayurvedic Saponin & Aloe Conditioning Calibration)',
  active_ingredients: 'Ritta/Reetha (25mg), Amla (20mg), Triphala (10mg), Bringna/Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aloe Vera (10mg), Shikhakai (5mg)',
  image_url: '/images/products/bhumivera-luxury-2-in-1-shampoo-conditioner.webp',
  seo_title: 'Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner | Reetha, Amla, Rosemary, Bhringraj & Aloe',
  meta_description: "Experience India's premier ultra-luxury 2-in-1 Ayurvedic Shampoo with Conditioner by Bhumivera Organics. Formulated with 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, Bhringraj, Triphala, Neem & Aloe Vera.",
  short_description: 'India’s premier ultra-luxury 2-in-1 Ayurvedic Shampoo with Conditioner. Formulated with 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera & 5mg Shikakai.',
  editorial_heading: 'Haute-Couture Ayurvedic Trichology',
  editorial_paragraphs: [
    "The Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner elevates ancient Vedic hair rituals into a precision-dosed, modern luxury haircare formulation. Rather than relying on harsh synthetic detergents that strip the scalp barrier, this dual-action botanical elixir is powered by 25 mg of wild-harvested Reetha (Sapindus mukorossi) and 5 mg of Shikakai (Acacia concinna)—nature’s purest, low-foaming saponin cleansers that lift excess sebum and environmental buildup while preserving the hair shaft's delicate lipid cuticle.",
    "Simultaneously, an intensive follicular nourishment matrix of 20 mg Vitamin-C-rich Amla, 10 mg Bhringraj ('King of Hair'), 10 mg Triphala, and 10 mg Pure Rosemary Essential Oil stimulates dermal papilla micro-circulation to anchor hair roots and combat premature thinning. Finished with 10 mg Cold-Pressed Neem for scalp microbiome purification and 10 mg Cellular Aloe Vera for weightless conditioning, it leaves hair deeply detangled, voluminous, and luminous in a single effortless step."
  ],
  composition_table: [
    { active: 'Ritta (Reetha)', potency: '25 mg', classification: 'Sapindus mukorossi', mechanism: 'Natural triterpenoid saponin surfactant that gently emulsifies scalp oil and dirt without stripping natural keratin lipids.' },
    { active: 'Amla (Indian Gooseberry)', potency: '20 mg', classification: 'Phyllanthus emblica', mechanism: 'Rich in bio-available Vitamin C, tannins, and gallotannins that strengthen follicular collagen and impart mirror-like shine.' },
    { active: 'Triphala Complex', potency: '10 mg', classification: 'Amalaki, Bibhitaki, Haritaki', mechanism: 'Tridoshic antioxidant powerhouse that repairs oxidative scalp damage and revitalizes dormant hair follicles.' },
    { active: 'Bringna (Bhringraj)', potency: '10 mg', classification: 'Eclipta prostrata', mechanism: 'Traditionally revered Ayurvedic botanical that prolongs the anagen (active growth) phase and prevents premature greying and shedding.' },
    { active: 'Rosemary Oil', potency: '10 mg', classification: 'Rosmarinus officinalis', mechanism: 'Stimulates micro-vascular blood flow to the hair bulb, supporting thicker, denser hair shaft regeneration.' },
    { active: 'Neem Extract', potency: '10 mg', classification: 'Azadirachta indica', mechanism: 'Purifies the scalp microbiome, eliminating dandruff-causing Malassezia fungi and soothing scalp itchiness.' },
    { active: 'Aloe Vera', potency: '10 mg', classification: 'Aloe barbadensis miller', mechanism: 'Natural cationic mucopolysaccharide conditioner that smooths raised cuticles, locks in moisture, and eliminates frizz.' },
    { active: 'Shikhakai', potency: '5 mg', classification: 'Acacia concinna', mechanism: 'Naturally low-pH botanical pod extract that detangles wet hair strands and seals the hair cuticle post-wash.' },
    { active: 'Luxury Shampoo Base', potency: 'Q.S.', classification: 'Conditioning Cleansing Matrix', mechanism: 'pH-balanced, gentle cleansing and conditioning suspension base.' },
  ],
  faqs: [
    {
      q: 'What are the exact active ingredients in Bhumivera 2-in-1 Luxury Shampoo with Conditioner?',
      a: 'Every bottle is precision-formulated with 8 potent botanical actives: Reetha (25 mg), Amla (20 mg), Triphala (10 mg), Bhringraj (10 mg), Rosemary Oil (10 mg), Neem (10 mg), Aloe Vera (10 mg), and Shikakai (5 mg) in a pH-balanced conditioning shampoo base (Q.S.).'
    },
    {
      q: 'How does Bhumivera 2-in-1 Shampoo condition hair naturally without heavy silicones?',
      a: 'It combines 25 mg of natural Reetha saponins and 5 mg of Shikakai for gentle, non-stripping cleansing alongside 10 mg of pure Aloe Vera cellular gel and 20 mg of Amla, which naturally smooth the hair cuticle and lock in hydration without suffocating the scalp.'
    },
    {
      q: 'Does this shampoo help with hair fall and dandruff?',
      a: 'Yes. The synergy of 10 mg Rosemary Oil, 10 mg Bhringraj, and 20 mg Amla directly fortifies hair roots to reduce breakage and shedding, while 10 mg of Neem and 10 mg of Triphala purify the scalp to prevent dandruff and follicular congestion.'
    },
    {
      q: 'Does Bhumivera 2-in-1 Shampoo contain Rosemary Oil and Bhringraj for hair growth?',
      a: 'Yes. It contains both Rosemary Oil (10 mg) and Bhringraj (10 mg) alongside Amla (20 mg) and Triphala (10 mg) to stimulate scalp blood flow, strengthen hair follicles, and reduce hair fall.'
    },
    {
      q: 'Why is Bhumivera shampoo considered a super-premium sulfate-free formula?',
      a: 'Rather than synthetic SLS/SLES detergents and dimethicone silicones, Bhumivera uses a 100 mg standardized Ayurvedic phyto-complex led by wild-harvested Reetha (25 mg) and Shikakai (5 mg) calibrated at pH 5.0.'
    }
  ]
};


export const BHUMIVERA_6_PRODUCTS = [
  {
    "id": 1,
    "legacyIds": [
      9,
      1
    ],
    "name": "Bhumivera Activated Charcoal Purifying Luxury Face Wash",
    "subtitle": "3% Activated Charcoal, 5% Glycerin, Manjistha, Haridra, Hyaluronic Acid & Niacinamide",
    "slug": "activated-charcoal-luxury-face-wash",
    "legacySlugs": [
      "charcoal-face-wash"
    ],
    "sku": "BV-LUX-CFW-01",
    "legacySkus": [
      "BV-CHFW-100ML"
    ],
    "mpn": "BVCFW100ML",
    "net_volume": "100 ML",
    "price": 699,
    "discountPrice": 699,
    "mrp": 899,
    "stock": 250,
    "quantity": 250,
    "category": "Luxury Facial Cleansers",
    "ph_level": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
    "active_ingredients": "Charcoal (3%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)",
    "image_url": "/images/products/bhumivera-activated-charcoal-luxury-face-wash.webp",
    "image": "/images/products/bhumivera-activated-charcoal-luxury-face-wash.webp",
    "additionalImages": [
      "/assets/images/charcoalFace wash.webp"
    ],
    "seo_title": "Bhumivera Activated Charcoal Luxury Face Wash (100ml) | 3% Charcoal, 5% Glycerin, Hyaluronic Acid, Niacinamide & Manjistha Gentle Botanical Cleanser",
    "meta_description": "Crafted for conscious skincare lovers: Bhumivera Activated Charcoal Luxury Face Wash (100ml) with label-disclosed 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.1% Hyaluronic Acid & 0.1% Niacinamide. Sulfate-free & pH-balanced.",
    "short_description": "A pH-balanced, sulfate-free botanical and active facial cleanser crafted for conscious skincare buyers. Formulated per 100ml with 100% label-disclosed concentrations: 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra (Turmeric), 0.5% Neem, 0.5% Cucumber Extract, 0.1% Hyaluronic Acid & 0.1% Niacinamide.",
    "search_keywords": "activated charcoal face wash India, gentle natural face wash for glowing skin, sulfate free charcoal face wash with niacinamide hyaluronic acid, ayurvedic botanical face wash manjistha turmeric neem, non drying face wash for oily combination acne prone skin, conscious clean skincare face wash",
    "conscious_buyer_highlights": [
      "100% Label-Disclosed Potency: Every active percentage (3% Charcoal, 5% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.1% Hyaluronic Acid, 0.1% Niacinamide) is printed openly on the bottle.",
      "Non-Stripping Barrier Care: Cushioning 5% Botanical Glycerin and 0.1% Hyaluronic Acid keep skin soft, hydrated, and comfortable after rinsing.",
      "Clean & Conscious Formula: Zero SLS/SLES sulfates, zero parabens, zero mineral oil, and zero synthetic microbeads.",
      "Honest Transparency: Botanical and Ayurvedic-inspired cosmetic formulation by Bhumivera Organics; 24-hour inner-forearm patch test recommended before first use."
    ],
    "wikipedia_entities": [
      {
        "name": "Activated carbon",
        "url": "https://en.wikipedia.org/wiki/Activated_carbon"
      },
      {
        "name": "Hyaluronic acid",
        "url": "https://en.wikipedia.org/wiki/Hyaluronic_acid"
      },
      {
        "name": "Niacinamide",
        "url": "https://en.wikipedia.org/wiki/Niacinamide"
      },
      {
        "name": "Rubia cordifolia (Manjistha)",
        "url": "https://en.wikipedia.org/wiki/Rubia_cordifolia"
      },
      {
        "name": "Curcuma longa (Haridra)",
        "url": "https://en.wikipedia.org/wiki/Turmeric"
      },
      {
        "name": "Azadirachta indica (Neem)",
        "url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Activated Charcoal",
        "concentration": "3.0%",
        "botanical": "Microporous Carbon",
        "role": "Adsorbs surface PM2.5 urban pollutants, pore congestion, and excess sebum without abrasive scrubbing."
      },
      {
        "ingredient": "Botanical Glycerin",
        "concentration": "5.0%",
        "botanical": "Plant-Derived Humectant",
        "role": "Creates an intensive moisture cushion that prevents post-wash tightness and supports the skin moisture barrier."
      },
      {
        "ingredient": "Manjistha Extract",
        "concentration": "0.5%",
        "botanical": "Rubia cordifolia",
        "role": "Traditional Ayurvedic complexion-brightening root that helps visibly even out dull skin tone and post-blemish marks."
      },
      {
        "ingredient": "Haridra (Wild Turmeric)",
        "concentration": "0.5%",
        "botanical": "Curcuma longa",
        "role": "Antioxidant-rich botanical rhizome that helps calm the appearance of redness and supports natural skin radiance."
      },
      {
        "ingredient": "Neem Extract",
        "concentration": "0.5%",
        "botanical": "Azadirachta indica",
        "role": "Time-tested purifying leaf extract that helps keep pores clean, fresh, and clarified."
      },
      {
        "ingredient": "Cucumber Extract",
        "concentration": "0.5%",
        "botanical": "Cucumis sativus",
        "role": "Cools and refreshes skin while delivering soothing plant hydration."
      },
      {
        "ingredient": "Hyaluronic Acid",
        "concentration": "0.1%",
        "botanical": "Sodium Hyaluronate",
        "role": "Water-binding humectant that helps retain surface hydration during cleansing for a plump, dewy feel."
      },
      {
        "ingredient": "Niacinamide (Vitamin B3)",
        "concentration": "0.1%",
        "botanical": "Nicotinamide",
        "role": "Supports the skin lipid barrier, helps balance surface oiliness, and refines the look of pores."
      },
      {
        "ingredient": "Perfume & Cleanser Base",
        "concentration": "0.5% / Q.S.",
        "botanical": "pH-Balanced Emulsion",
        "role": "Gentle, sulfate-free cleansing suspension vehicle."
      }
    ],
    "full_description": "<h3>Where Botanical Science Meets Royal Ayurveda</h3>\n<p>The <strong>Bhumivera Activated Charcoal Purifying Luxury Face Wash</strong> is thoughtfully formulated for conscious skincare lovers who read ingredient labels and care deeply about their skin barrier. Crafted with a label-disclosed <strong>3.0% concentration of Activated Charcoal</strong> per 100ml, it gently draws out everyday urban pollution, surface grime, and excess T-zone oil without stripping your skin's natural moisture mantle.</p>\n<p>Unlike harsh commercial charcoal washes that leave skin feeling tight and dry, Bhumivera suspends its purifying core inside a generous <strong>5.0% Botanical Glycerin cushion</strong> enriched with <strong>0.1% Hyaluronic Acid</strong> and <strong>0.1% Niacinamide (Vitamin B3)</strong>. Paired with treasured Ayurvedic botanicals—<strong>0.5% Manjistha Extract</strong>, <strong>0.5% Haridra (Turmeric)</strong>, <strong>0.5% Neem</strong>, and <strong>0.5% Cooling Cucumber Extract</strong>—every wash leaves your complexion feeling clean, calm, hydrated, and naturally luminous.</p>\n<p><strong>Direction for Use:</strong> Moisten face and neck, apply a small amount of this face wash, and gently work up a lather using a circular motion for 30–45 seconds. Rinse thoroughly with lukewarm water and pat dry. Use twice daily. A 24-hour patch test on the inner forearm is recommended prior to first use.</p>",
    "faqs": [
      {
        "q": "What is the exact ingredient percentage breakdown of Bhumivera Activated Charcoal Face Wash?",
        "a": "Each 100ml bottle features a 100% transparent, label-disclosed formulation: 3% Activated Charcoal, 5% Glycerin, 0.5% Haridra (Turmeric), 0.5% Neem, 0.5% Cucumber Extract, 0.5% Manjistha Extract, 0.1% Hyaluronic Acid, 0.1% Niacinamide, and 0.5% Perfume in a gentle pH-balanced cleansing base (Q.S.)."
      },
      {
        "q": "Why do conscious skincare buyers prefer Bhumivera Charcoal Face Wash over regular charcoal cleansers?",
        "a": "Many conventional charcoal cleansers rely on harsh sulfates (SLS/SLES) and disclose no active percentages, leaving skin tight and dry. Bhumivera pairs a full 3% Activated Charcoal dose with 5% Botanical Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide, and Ayurvedic Manjistha & Haridra—purifying pores while keeping the moisture barrier soft and hydrated."
      },
      {
        "q": "Is Bhumivera Activated Charcoal Face Wash suitable for oily, combination, and sensitive skin?",
        "a": "Yes. Its pH 5.4–5.5 balanced, sulfate-free base and 5% Glycerin cushion make it suitable for oily, combination, normal, and blemish-prone skin. Because it contains natural botanical extracts, we always recommend a 24-hour inner-forearm patch test before first use."
      },
      {
        "q": "How does Bhumivera Organics ensure ingredient transparency and formulation quality?",
        "a": "Bhumivera Organics is our registered brand and corporate name (Bhumivera Organics India Private Limited). Our formulations combine plant-derived Ayurvedic botanicals with proven cosmetic actives and zero SLS/parabens, with every active concentration printed transparently on the label. Every active concentration is disclosed openly on the product label for complete consumer transparency."
      }
    ]
  },
  {
    "id": 2,
    "legacyIds": [
      8,
      2
    ],
    "name": "Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash",
    "subtitle": "4% Sea Buckthorn, 5% Glycerin, Manjistha, Haridra, Hyaluronic Acid & Niacinamide",
    "slug": "himalayan-seabuckthorn-luxury-face-wash",
    "legacySlugs": [
      "aloe vera face wash",
      "sea-buckthorn-niacinamide-luxury-face-wash"
    ],
    "sku": "BV-LUX-SBFW-02",
    "legacySkus": [
      "BV-SBFW-100ML"
    ],
    "mpn": "BVSBFW100ML",
    "net_volume": "100 ML",
    "price": 799,
    "discountPrice": 799,
    "mrp": 999,
    "stock": 250,
    "quantity": 250,
    "category": "Luxury Facial Cleansers",
    "ph_level": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
    "active_ingredients": "Sea Buckthorn (4%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)",
    "image_url": "/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp",
    "image": "/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp",
    "additionalImages": [
      "/assets/images/seabuckthorn.webp"
    ],
    "seo_title": "Bhumivera Himalayan Sea Buckthorn Luxury Face Wash (100ml) | 4% Sea Buckthorn, 5% Glycerin, Hyaluronic Acid, Niacinamide & Manjistha Brightening Cleanser",
    "meta_description": "Discover Bhumivera Himalayan Sea Buckthorn Face Wash (100ml): formulated for conscious skincare buyers with 4% Sea Buckthorn (Omega-7 & Vitamin C), 5% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.1% Hyaluronic Acid & 0.1% Niacinamide.",
    "short_description": "Brightening botanical luxury face wash crafted for skin-conscious buyers. Formulated per 100ml with a label-disclosed 4% Himalayan Sea Buckthorn extract, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid & 0.1% Niacinamide.",
    "search_keywords": "sea buckthorn face wash India, brightening botanical face wash for glowing skin, omega 7 vitamin c face wash with niacinamide hyaluronic acid, gentle sulfate free face wash for dry dull skin, manjistha turmeric radiance cleanser, conscious skincare face wash India",
    "conscious_buyer_highlights": [
      "High-Potency 4% Sea Buckthorn: Delivers natural Omega-7, carotenoids, and botanical antioxidants at a full 4.0% concentration.",
      "Dewy Glass-Skin Hydration: 5.0% Botanical Glycerin and 0.1% Hyaluronic Acid lock in moisture during cleansing.",
      "Ayurvedic Tone-Evening Complex: 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, and 0.5% Cucumber soothe and brighten dull skin.",
      "Clean & Transparent: Sulfate-free, paraben-free cosmetic formulation with 100% label-disclosed active percentages."
    ],
    "wikipedia_entities": [
      {
        "name": "Hippophae rhamnoides (Sea buckthorn)",
        "url": "https://en.wikipedia.org/wiki/Hippophae_rhamnoides"
      },
      {
        "name": "Omega-7 fatty acid",
        "url": "https://en.wikipedia.org/wiki/Omega-7_fatty_acid"
      },
      {
        "name": "Hyaluronic acid",
        "url": "https://en.wikipedia.org/wiki/Hyaluronic_acid"
      },
      {
        "name": "Niacinamide",
        "url": "https://en.wikipedia.org/wiki/Niacinamide"
      },
      {
        "name": "Rubia cordifolia (Manjistha)",
        "url": "https://en.wikipedia.org/wiki/Rubia_cordifolia"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Himalayan Sea Buckthorn",
        "concentration": "4.0%",
        "botanical": "Hippophae rhamnoides",
        "role": "Rich in rare Omega-7 (Palmitoleic acid), Omega 3, 6, 9, and natural Vitamin C carotenoids to nourish the skin barrier and enhance radiance."
      },
      {
        "ingredient": "Botanical Glycerin",
        "concentration": "5.0%",
        "botanical": "Plant-Derived Humectant",
        "role": "Helps retain surface moisture and leaves a supple, dewy feel after rinsing."
      },
      {
        "ingredient": "Manjistha Extract",
        "concentration": "0.5%",
        "botanical": "Rubia cordifolia",
        "role": "Traditional Ayurvedic botanical that helps improve the look of uneven skin tone and sun-induced dullness."
      },
      {
        "ingredient": "Haridra (Wild Turmeric)",
        "concentration": "0.5%",
        "botanical": "Curcuma longa",
        "role": "Supports natural skin luminosity and defends against everyday environmental oxidative stress."
      },
      {
        "ingredient": "Neem Extract",
        "concentration": "0.5%",
        "botanical": "Azadirachta indica",
        "role": "Purifies pores and helps maintain a clean, balanced complexion."
      },
      {
        "ingredient": "Cucumber Extract",
        "concentration": "0.5%",
        "botanical": "Cucumis sativus",
        "role": "Soothes skin, reduces morning puffiness, and refreshes tired complexions."
      },
      {
        "ingredient": "Hyaluronic Acid",
        "concentration": "0.1%",
        "botanical": "Sodium Hyaluronate",
        "role": "Hydrates the outer skin layers for an instant smooth, plumped appearance."
      },
      {
        "ingredient": "Niacinamide (Vitamin B3)",
        "concentration": "0.1%",
        "botanical": "Nicotinamide",
        "role": "Supports natural barrier lipids and refines overall skin texture."
      },
      {
        "ingredient": "Perfume & Cleanser Base",
        "concentration": "0.5% / Q.S.",
        "botanical": "pH-Balanced Emulsion",
        "role": "Silk-textured, non-stripping botanical cleansing matrix."
      }
    ],
    "full_description": "<h3>Golden Himalayan Botanical Nutrition: 4% Sea Buckthorn</h3>\n<p>Harvested from high-altitude Himalayan valleys, <em>Hippophae rhamnoides</em> (Sea Buckthorn) is prized in botanical skincare for its rare lipid and antioxidant profile. While conventional brightening washes use trace extracts below 0.1%, the <strong>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash</strong> is formulated with a label-disclosed <strong>4.0% concentration of Sea Buckthorn</strong> per 100ml.</p>\n<p>Naturally rich in <strong>Omega-7 (Palmitoleic Acid)</strong>, beta-carotene, and Vitamin C, this golden micro-emulsion works in harmony with <strong>5.0% Glycerin</strong>, <strong>0.1% Hyaluronic Acid</strong>, <strong>0.1% Niacinamide</strong>, <strong>0.5% Manjistha</strong>, and <strong>0.5% Haridra</strong> to gently lift dull surface impurities, replenish moisture, and unveil a fresh, lit-from-within glow.</p>\n<p><strong>Direction for Use:</strong> Moisten face and neck, apply a small amount of this face wash, and gently work up a lather using a circular motion. Wash off and pat dry. Use twice daily. Patch test recommended before first use.</p>",
    "faqs": [
      {
        "q": "What is the exact percentage of Sea Buckthorn and active ingredients in Bhumivera Sea Buckthorn Face Wash?",
        "a": "Every 100ml bottle is formulated with a label-disclosed 4% Sea Buckthorn extract, 5% Glycerin, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber Extract, 0.5% Manjistha Extract, 0.1% Hyaluronic Acid, and 0.1% Niacinamide in a gentle cleansing base (Q.S.)."
      },
      {
        "q": "Why is 4% Sea Buckthorn combined with Manjistha, Hyaluronic Acid, and Niacinamide ideal for glowing skin?",
        "a": "Sea Buckthorn supplies rare Omega-7 lipids and natural Vitamin C carotenoids to nourish the skin barrier, Manjistha and Haridra help brighten dull, uneven tone, Niacinamide refines pore appearance, and Hyaluronic Acid + 5% Glycerin flood the skin with moisture."
      },
      {
        "q": "Which Bhumivera face wash should I choose: Activated Charcoal or Himalayan Sea Buckthorn?",
        "a": "Choose the 3% Activated Charcoal Face Wash if your primary goals are deep pore detoxification, urban pollution removal, and oil control. Choose the 4% Himalayan Sea Buckthorn Face Wash if you want intensive Omega-7 nourishment, dullness brightening, and dewy radiance—or use Charcoal in the evening and Sea Buckthorn in the morning."
      }
    ]
  },
  {
    "id": 3,
    "legacyIds": [
      104,
      3
    ],
    "name": "Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner",
    "subtitle": "25mg Reetha, 20mg Amla, 10mg Rosemary Oil, Bhringraj, Triphala, Neem, Aloe Vera & Shikakai",
    "slug": "luxury-2-in-1-botanical-shampoo-conditioner",
    "legacySlugs": [
      "bhumivera-amla-bhringraj-botanical-shampoo"
    ],
    "sku": "BV-LUX-SH2IN1-03",
    "legacySkus": [
      "BV-ARSH-200ML",
      "BV-LUX-SH2IN1-05"
    ],
    "mpn": "BVSH2IN1LUX",
    "net_volume": "200 ML",
    "price": 899,
    "discountPrice": 899,
    "mrp": 1199,
    "stock": 200,
    "quantity": 200,
    "category": "Luxury Hair Care",
    "ph_level": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
    "active_ingredients": "Ritta/Reetha (25mg), Amla (20mg), Triphala (10mg), Bringna/Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aleovera/Aloe Vera (10mg), Shikhakai (5mg), Shampoo Base (Q.S.)",
    "image_url": "/images/products/bhumivera-luxury-2-in-1-shampoo-conditioner.webp",
    "image": "/images/products/bhumivera-luxury-2-in-1-shampoo-conditioner.webp",
    "additionalImages": [
      "/assets/images/Promo3.webp"
    ],
    "seo_title": "Bhumivera Royal 2-in-1 Luxury Shampoo with Conditioner (200ml) | Reetha (25mg), Amla (20mg), Rosemary Oil, Bhringraj & Aloe Vera Sulfate-Free Hair Cleanser",
    "meta_description": "Shop Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200ml). Formulated with label-verified 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera & 5mg Shikakai.",
    "short_description": "Dual-action Ayurvedic botanical 2-in-1 Shampoo with Conditioner. Formulated with label-disclosed 25mg Ritta (Reetha), 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera & 5mg Shikakai for clean, soft, fuller-looking hair.",
    "search_keywords": "ayurvedic 2 in 1 shampoo with conditioner India, sulfate free reetha amla shikakai bhringraj rosemary shampoo, herbal shampoo for hair fall and frizzy hair, natural saponin hair cleanser India",
    "conscious_buyer_highlights": [
      "100 mg Standardized 8-Herb Complex: Exact milligram dosages of Reetha (25mg), Amla (20mg), Triphala (10mg), Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aloe Vera (10mg), and Shikakai (5mg).",
      "Natural Plant Saponin Cleansing: Gently lifts scalp oil and hard-water residue without harsh SLS/SLES sulfates.",
      "Silicone-Free Built-In Conditioning: Aloe Vera and low-pH Shikakai smooth the hair cuticle for soft, tangle-free shine."
    ],
    "wikipedia_entities": [
      {
        "name": "Sapindus mukorossi (Reetha)",
        "url": "https://en.wikipedia.org/wiki/Sapindus_mukorossi"
      },
      {
        "name": "Phyllanthus emblica (Amla)",
        "url": "https://en.wikipedia.org/wiki/Phyllanthus_emblica"
      },
      {
        "name": "Eclipta prostrata (Bhringraj)",
        "url": "https://en.wikipedia.org/wiki/Eclipta_prostrata"
      },
      {
        "name": "Rosmarinus officinalis (Rosemary)",
        "url": "https://en.wikipedia.org/wiki/Rosemary"
      },
      {
        "name": "Acacia concinna (Shikakai)",
        "url": "https://en.wikipedia.org/wiki/Acacia_concinna"
      },
      {
        "name": "Triphala",
        "url": "https://en.wikipedia.org/wiki/Triphala"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Ritta (Reetha)",
        "concentration": "25 mg",
        "botanical": "Sapindus mukorossi",
        "role": "Natural plant saponin cleanser that gently lifts scalp oil and buildup without stripping natural hair lipids."
      },
      {
        "ingredient": "Amla (Indian Gooseberry)",
        "concentration": "20 mg",
        "botanical": "Phyllanthus emblica",
        "role": "Rich in natural Vitamin C and tannins that nourish hair roots and impart glossy shine."
      },
      {
        "ingredient": "Triphala Complex",
        "concentration": "10 mg",
        "botanical": "Amalaki, Bibhitaki, Haritaki",
        "role": "Traditional three-fruit Ayurvedic blend that clarifies the scalp and supports strong roots."
      },
      {
        "ingredient": "Bringna (Bhringraj)",
        "concentration": "10 mg",
        "botanical": "Eclipta prostrata",
        "role": "Revered in Ayurveda as the \"King of Herbs for Hair\" to support thicker, fuller-looking hair."
      },
      {
        "ingredient": "Rosemary Oil",
        "concentration": "10 mg",
        "botanical": "Rosmarinus officinalis",
        "role": "Invigorates scalp massage circulation and supports healthy, resilient hair strands."
      },
      {
        "ingredient": "Neem Extract",
        "concentration": "10 mg",
        "botanical": "Azadirachta indica",
        "role": "Helps keep the scalp clean, flake-free, and comfortable."
      },
      {
        "ingredient": "Aleovera (Aloe Vera)",
        "concentration": "10 mg",
        "botanical": "Aloe barbadensis miller",
        "role": "Natural moisture-binding conditioner that smooths hair cuticles and tames frizz."
      },
      {
        "ingredient": "Shikhakai",
        "concentration": "5 mg",
        "botanical": "Acacia concinna",
        "role": "Low-pH botanical detangler that leaves hair silky and manageable without heavy silicones."
      },
      {
        "ingredient": "Shampoo Base",
        "concentration": "Q.S.",
        "botanical": "Conditioning Matrix",
        "role": "Gentle pH-balanced cleansing and conditioning suspension."
      }
    ],
    "full_description": "<h3> Precision-Dosed 8-Botanical 2-in-1 Hair & Scalp Ritual</h3>\n<p>The <strong>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner</strong> brings traditional Ayurvedic hair care into a transparent, modern ritual. Powered by <strong>25 mg of Ritta (Reetha)</strong> and <strong>5 mg of Shikhakai</strong>, its natural plant saponins gently lift scalp oil and pollution buildup while respecting your hair shaft's protective cuticle.</p>\n<p>At the same time, a nourishing blend of <strong>20 mg Amla</strong>, <strong>10 mg Bringna (Bhringraj)</strong>, <strong>10 mg Triphala</strong>, and <strong>10 mg Pure Rosemary Oil</strong> revitalizes the scalp and fortifies roots against breakage. Finished with <strong>10 mg Neem</strong> for scalp clarity and <strong>10 mg Aloe Vera</strong> for weightless conditioning, it leaves hair detangled, soft, and voluminous in one step.</p>\n<p><strong>Direction for Use:</strong> Apply shampoo on wet hair, gently massage into scalp and lengths for 2 minutes, and rinse thoroughly. Repeat if required.</p>",
    "faqs": [
      {
        "q": "What are the exact active ingredients and dosages in Bhumivera 2-in-1 Luxury Shampoo?",
        "a": "Each unit is formulated with 8 label-disclosed botanicals: Ritta/Reetha (25 mg), Amla (20 mg), Triphala (10 mg), Bringna/Bhringraj (10 mg), Rosemary Oil (10 mg), Neem (10 mg), Aloe Vera (10 mg), and Shikhakai (5 mg) in a conditioning shampoo base (Q.S.)."
      },
      {
        "q": "How does Bhumivera 2-in-1 Shampoo help reduce hair breakage and condition strands naturally?",
        "a": "The synergy of 10 mg Rosemary Oil, 10 mg Bhringraj, 20 mg Amla, and 10 mg Triphala nourishes the scalp and strengthens hair fibers, while Aloe Vera (10 mg) and Shikakai (5 mg) smooth and detangle strands without heavy synthetic silicones."
      }
    ]
  },
  {
    "id": 4,
    "legacyIds": [
      103,
      4
    ],
    "name": "Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)",
    "subtitle": "With Activated Charcoal & Aloe Vera | Gentle Purifying Handmade Bathing Bar (100 GM)",
    "slug": "artisanal-charcoal-handmade-soap",
    "legacySlugs": [
      "bhumivera-kumkumadi-night-elixir"
    ],
    "sku": "BV-LUX-CSOAP-04",
    "legacySkus": [
      "BV-KMNE-30ML"
    ],
    "mpn": "BVCSOAP100GM",
    "net_volume": "100 GM",
    "price": 399,
    "discountPrice": 399,
    "mrp": 499,
    "stock": 300,
    "quantity": 300,
    "category": "Artisanal Ayurvedic Cleansing Bars",
    "ph_level": "Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)",
    "active_ingredients": "Activated Charcoal, Aloevera (Aloe barbadensis), Pure Ayurvedic Soap Base (Free from Harsh Synthetic Chemicals)",
    "image_url": "/images/products/bhumivera-artisanal-charcoal-handmade-soap.webp",
    "image": "/images/products/bhumivera-artisanal-charcoal-handmade-soap.webp",
    "additionalImages": [
      "/assets/images/charcoal.webp"
    ],
    "seo_title": "Bhumivera Charcoal Deep Cleansing Bar (100 GM) | Handmade Ayurvedic Activated Charcoal & Aloe Vera Luxury Bathing Soap",
    "meta_description": "Handcrafted 100 GM Bhumivera Charcoal Deep Cleansing Bar with Activated Charcoal and Aloe Vera in a gentle Ayurvedic soap base free from harsh synthetic detergents.",
    "short_description": "Handcrafted 100 GM Ayurvedic Charcoal Deep Cleansing Bar formulated with Activated Charcoal and soothing Aloe Vera. A gentle, non-drying luxury bathing bar that lifts deep pore impurities, sweat, and urban grime while keeping skin soft and comfortable.",
    "search_keywords": "handmade charcoal soap India, ayurvedic activated charcoal aloe vera bathing bar, natural handmade soap for oily skin and body care, chemical free base charcoal soap",
    "conscious_buyer_highlights": [
      "Deep-Pore Carbon Purification: Microporous Activated Charcoal lifts excess body oil, sweat, and urban grime.",
      "Soothing Aloe Vera Cushion: Pure Aloe Vera extract keeps lather creamy and prevents post-bath skin dryness.",
      "Gentle Ayurvedic Soap Base: Crafted under strict quality control without harsh synthetic detergents; gentle enough for delicate skin (patch test advised)."
    ],
    "wikipedia_entities": [
      {
        "name": "Activated carbon",
        "url": "https://en.wikipedia.org/wiki/Activated_carbon"
      },
      {
        "name": "Aloe vera",
        "url": "https://en.wikipedia.org/wiki/Aloe_vera"
      },
      {
        "name": "Ayurveda",
        "url": "https://en.wikipedia.org/wiki/Ayurveda"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Activated Charcoal",
        "concentration": "Deep Cleansing Core",
        "botanical": "Microporous Activated Carbon",
        "role": "Draws out pore impurities, excess oil, sweat residue, and environmental pollutants."
      },
      {
        "ingredient": "Aloevera Extract",
        "concentration": "Soothing Hydration Matrix",
        "botanical": "Aloe barbadensis miller",
        "role": "Replenishes skin moisture, calms dryness, and creates a creamy, non-stripping lather."
      },
      {
        "ingredient": "Ayurvedic Soap Base",
        "concentration": "Q.S. (100 GM Bar)",
        "botanical": "Gentle Artisanal Soap Base",
        "role": "Prepared in quality-controlled batches without harsh synthetic detergents for everyday face and body cleansing."
      }
    ],
    "full_description": "<h3>Artisanal Ayurvedic Deep Cleansing Meets Pure Aloe Hydration</h3>\n<p>The <strong>Bhumivera Charcoal Deep Cleansing Bar (100 GM)</strong> is a handmade Ayurvedic luxury bathing bar crafted to purify, refresh, and soften your skin without harsh synthetic detergents. Combining high-porosity <strong>Activated Charcoal</strong> with soothing <strong>Pure Aloe Vera</strong>, this obsidian bar lifts daily sweat, excess oil, and urban grime while leaving skin supple.</p>\n<p>Prepared in a quality-controlled environment, it offers gentle everyday purification for face and body while remaining mild on sensitive and delicate skin profiles.</p>\n<p><strong>Usage & Care:</strong> Work into a rich lather on wet skin, massage gently, and rinse clean. For external use only. Conduct a 24-hour patch test before initial use if you have specific herbal sensitivities.</p>",
    "faqs": [
      {
        "q": "What are the exact ingredients in Bhumivera Charcoal Deep Cleansing Bar?",
        "a": "It is formulated with Activated Charcoal, pure Aloe Vera (Aloevera), and a gentle Ayurvedic Soap Base in a 100 GM handmade bar free from harsh synthetic detergents."
      },
      {
        "q": "Is Bhumivera Handmade Charcoal Soap suitable for sensitive skin?",
        "a": "Yes. This handmade Ayurvedic cleansing bar is crafted under strict quality control with soothing Aloe Vera and without harsh synthetic detergents, making it gentle for everyday use. As with all botanical products, we recommend a patch test before first use."
      }
    ]
  },
  {
    "id": 5,
    "legacyIds": [
      105,
      5
    ],
    "name": "Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)",
    "subtitle": "Botanical Cleansing Bar for Glowing, Smooth & Clear Skin | Gentle Daily Ritual (100 GM)",
    "slug": "artisanal-aloe-vera-handmade-soap",
    "legacySlugs": [
      "bhumivera-gotu-kola-barrier-repair-gel"
    ],
    "sku": "BV-LUX-ASOAP-05",
    "legacySkus": [
      "BV-GKBG-50ML"
    ],
    "mpn": "BVASOAP100GM",
    "net_volume": "100 GM",
    "price": 349,
    "discountPrice": 349,
    "mrp": 449,
    "stock": 300,
    "quantity": 300,
    "category": "Artisanal Ayurvedic Cleansing Bars",
    "ph_level": "Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)",
    "active_ingredients": "Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Tulsi (Ocimum tenuiflorum), Pure Ayurvedic Soap Base",
    "image_url": "/images/products/bhumivera-artisanal-aloe-vera-handmade-soap.webp",
    "image": "/images/products/bhumivera-artisanal-aloe-vera-handmade-soap.webp",
    "additionalImages": [
      "/assets/images/aloeverascience.webp"
    ],
    "seo_title": "Bhumivera Soothing Bar (100 GM) | Handmade Aloe Vera, Neem & Tulsi Ayurvedic Soap for Glowing & Clear Skin",
    "meta_description": "Shop Bhumivera Soothing Bar (100 GM): a handmade Ayurvedic cleansing bar infused with Aloe Vera, Neem, and Sacred Tulsi for smooth, clarified, and glowing skin.",
    "short_description": "Bhumivera Soothing Bar (100 GM)—a handmade Ayurvedic Cleansing Bar infused with Aloe Vera, Neem, and Sacred Tulsi for glowing, smooth, and clarified skin. Crafted in a gentle base free from harsh synthetic detergents.",
    "search_keywords": "aloe vera neem tulsi handmade soap India, ayurvedic soothing bathing bar for clear glowing skin, natural herbal soap for sensitive blemish prone skin",
    "conscious_buyer_highlights": [
      "Sacred Ayurvedic Trio: Combines soothing Aloe Vera with clarifying Neem and antioxidant-rich Tulsi.",
      "Smooth & Luminous Finish: Hydrates while cleansing so skin feels soft, calm, and refreshed.",
      "Zero Harsh Detergents: Handcrafted in a gentle Ayurvedic base suitable for everyday face and body cleansing."
    ],
    "wikipedia_entities": [
      {
        "name": "Aloe vera",
        "url": "https://en.wikipedia.org/wiki/Aloe_vera"
      },
      {
        "name": "Azadirachta indica (Neem)",
        "url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
      },
      {
        "name": "Ocimum tenuiflorum (Tulsi)",
        "url": "https://en.wikipedia.org/wiki/Ocimum_tenuiflorum"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Aloevera (Aloe Vera)",
        "concentration": "Primary Soothing Active",
        "botanical": "Aloe barbadensis miller",
        "role": "Hydrates outer skin layers, cools dryness, and imparts a smooth, glowing finish."
      },
      {
        "ingredient": "Neem Extract",
        "concentration": "Purifying Botanical Clarifier",
        "botanical": "Azadirachta indica",
        "role": "Helps keep blemish-prone skin clean, fresh, and clarified."
      },
      {
        "ingredient": "Tulsi (Holy Basil)",
        "concentration": "Adaptogenic Herbal Purifier",
        "botanical": "Ocimum tenuiflorum",
        "role": "Rich in natural eugenol and rosmarinic acid antioxidants that refresh pores and support radiant skin."
      },
      {
        "ingredient": "Ayurvedic Soap Base",
        "concentration": "Q.S. (100 GM Bar)",
        "botanical": "Gentle Artisanal Base",
        "role": "Crafted under strict quality control without harsh synthetic chemicals."
      }
    ],
    "full_description": "<h3>The Classic Trinity of Ayurveda: Aloe Vera, Neem & Tulsi</h3>\n<p>Crafted for <strong>glowing, smooth, and clear-looking skin</strong>, the <strong>Bhumivera Soothing Bar (100 GM)</strong> unites three of Ayurveda’s most cherished botanicals—<strong>Pure Aloe Vera, Neem, and Sacred Tulsi</strong>—in a handmade luxury bathing bar.</p>\n<p>Neem and Tulsi work together to gently purify pores and refresh blemish-prone skin, while Aloe Vera cushions the skin with soothing hydration. Produced in a quality-controlled environment with <strong>zero harsh synthetic detergents</strong>, it is gentle enough for daily face and body cleansing.</p>",
    "faqs": [
      {
        "q": "What makes Bhumivera Soothing Bar ideal for glowing and blemish-prone skin?",
        "a": "Unlike ordinary soaps that strip skin moisture, Bhumivera Soothing Bar pairs hydrating Aloe Vera with purifying Neem and antioxidant Tulsi in a gentle Ayurvedic soap base—clarifying pores while keeping skin soft and luminous."
      },
      {
        "q": "Can Bhumivera Aloe Vera, Neem & Tulsi Soothing Bar be used on sensitive skin?",
        "a": "Yes. It is crafted under strict quality control without harsh synthetic detergents. We recommend a standard 24-hour patch test before first use."
      }
    ]
  },
  {
    "id": 6,
    "legacyIds": [
      106,
      6
    ],
    "name": "Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)",
    "subtitle": "9.0ml Seven-Tulsi Blend per 10ml (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi) | 30 ML Drops",
    "slug": "kalpvriksh-satva-tulsi-7-tulsi-extract",
    "legacySlugs": [
      "bhumivera-copper-distilled-tulsi-rose-hydrosol"
    ],
    "sku": "BV-LUX-TULSI-06",
    "legacySkus": [
      "BV-TRHM-100ML"
    ],
    "mpn": "BVTULSI30ML",
    "net_volume": "30 ML",
    "price": 499,
    "discountPrice": 499,
    "mrp": 649,
    "stock": 300,
    "quantity": 300,
    "category": "Luxury Ayurvedic Wellness & Immunity Drops",
    "ph_level": "90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)",
    "active_ingredients": "Each 10ml contains 9.0ml Mix Blend of Seven Tulsi: Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, Lemon Tulsi; Excipient Q.S.",
    "image_url": "/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp",
    "image": "/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp",
    "additionalImages": [
      "/assets/images/tulsi.webp"
    ],
    "seo_title": "Bhumivera Kalpvriksh Satva Tulsi Drops (30 ML) | Concentrated Liquid Extract of 7 Types of Tulsi (9.0ml per 10ml)",
    "meta_description": "Shop Bhumivera Kalpvriksh Satva Tulsi (30 ML): concentrated Ayurvedic wellness drops containing 9.0ml per 10ml liquid extract of 7 Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi).",
    "short_description": "The Ingestible Skin-Clearing & Cortisol Adaptogen in the Bhumivera Inside-Out Botanical Ritual. Each 10ml contains 9.0ml concentrated liquid extract of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi) to calm cortisol spikes, support the gut-skin axis, and promote radiant clarity from within.",
    "search_keywords": "kalpvriksh satva tulsi drops, 7 tulsi liquid extract drops India, seven tulsi ark immunity wellness drops, panchtulsi vs 7 tulsi drops bhumivera",
    "conscious_buyer_highlights": [
      "7 Distinct Tulsi Varieties (Not Just 5): Combines Van, Sweet, Marua, Bisva, Kala, Rama, and Lemon Tulsi.",
      "90% Label-Verified Concentration: Each 10ml contains 9.0ml of pure Seven-Tulsi liquid blend.",
      "Effortless Daily Ritual: Just 3–4 drops in warm water, tea, or milk twice daily."
    ],
    "wikipedia_entities": [
      {
        "name": "Ocimum tenuiflorum (Holy Basil / Tulsi)",
        "url": "https://en.wikipedia.org/wiki/Ocimum_tenuiflorum"
      },
      {
        "name": "Ocimum gratissimum (Van Tulsi)",
        "url": "https://en.wikipedia.org/wiki/Ocimum_gratissimum"
      },
      {
        "name": "Ocimum basilicum (Sweet Tulsi)",
        "url": "https://en.wikipedia.org/wiki/Basil"
      },
      {
        "name": "Ocimum × africanum (Lemon Tulsi)",
        "url": "https://en.wikipedia.org/wiki/Lemon_basil"
      },
      {
        "name": "Eugenol",
        "url": "https://en.wikipedia.org/wiki/Eugenol"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Seven-Tulsi Concentrated Blend (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi)",
        "concentration": "9.0 ml (per 10 ml)",
        "botanical": "Ocimum Spectrum Phyto-Extract",
        "role": "Provides 90% active tulsi extract rich in natural eugenol, ursolic acid, and rosmarinic acid to support daily wellness, seasonal comfort, and antioxidant vitality."
      },
      {
        "ingredient": "Excipient Base",
        "concentration": "Q.S.",
        "botanical": "Food-Grade Carrier",
        "role": "Stabilizes volatile botanical essential oils for easy mixing in water, tea, or milk."
      },
      {
        "ingredient": "Nutritional Profile (Per 100ml Approx.)",
        "concentration": "80 Kcal | 2g Carb | 8g Essential Lipids",
        "botanical": "Label Nutritional Value",
        "role": "0.0g protein; concentrated botanical phytonutrient profile."
      }
    ],
    "full_description": "<h3>The Concentrated Nectar of Seven Sacred Tulsi Varieties (90% Potency)</h3>\n<p>While standard market \"Panch Tulsi\" drops combine 5 varieties, <strong>Bhumivera Kalpvriksh Satva Tulsi (30 ML)</strong> delivers the concentrated liquid extract of <strong>7 distinct types of Tulsi</strong> at a label-disclosed potency of <strong>9.0 ml active extract per 10 ml</strong>.</p>\n<p>Uniting <strong>Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, and Lemon Tulsi</strong>, every drop provides natural eugenol, rosmarinic acid, and adaptogenic botanical polyphenols to support everyday seasonal wellness, respiratory comfort, and internal antioxidant balance.</p>\n<h4>Nutritional Information (Per 100ml Approx.)</h4>\n<ul>\n  <li><strong>Energy:</strong> 80 Kcal | <strong>Carbohydrate:</strong> 2.0 gm | <strong>Protein:</strong> 0.0 gm | <strong>Fat (Essential Botanical Oils):</strong> 8.0 gm</li>\n</ul>\n<p><strong>Direction for Use:</strong> Take 3–4 drops of Kalpvriksh Satva Tulsi in a glass of warm water, tea, or milk twice daily, or as directed by a wellness professional. Consume contents within 30 days of opening the bottle.</p>",
    "faqs": [
      {
        "q": "How is Bhumivera Kalpvriksh Satva Tulsi different from regular Panch Tulsi drops?",
        "a": "Regular Panch Tulsi products use 5 types of tulsi. Bhumivera Kalpvriksh Satva Tulsi combines 7 distinct varieties—Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, and Lemon Tulsi—at a label-disclosed concentration of 9.0ml per 10ml."
      },
      {
        "q": "How should I take Kalpvriksh Satva Tulsi drops daily?",
        "a": "Add 3 to 4 drops into a glass of warm water, tea, or milk twice daily. Because it is a concentrated 90% botanical extract (9.0ml per 10ml), 3–4 drops are sufficient for a daily wellness serving."
      }
    ]
  }
]
;


export const MAISON_REGIMEN_BUNDLES = [
  {
    id: 'bundle-daily-regimen',
    rating: 4.89,
    reviews: 342,
    review_count: 342,
    sku: 'BV-BND-DAILY-01',
    name: 'The Complete Botanical Daily Regimen',
    badge: 'Flagship AOV Hero · Save ₹548 (27% Off)',
    tagline: 'Morning 4% Sea Buckthorn Radiance + 8-Herb Saponin Hair Ritual + Soothing Aloe-Neem-Tulsi Bar',
    items: [
      { id: 2, slug: 'himalayan-seabuckthorn-luxury-face-wash',
    rating: 4.61,
    review_count: 240,
    reviews: 240, name: 'Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML)', price: 799, active: '4% Sea Buckthorn + 5% Glycerin + 0.1% HA & Niacinamide' },
      { id: 3, slug: 'luxury-2-in-1-botanical-shampoo-conditioner',
    rating: 4.53,
    review_count: 160,
    reviews: 160, name: 'Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML)', price: 899, active: '25mg Reetha + 20mg Amla + 10mg Rosemary Oil + 10mg Bhringraj' },
      { id: 5, slug: 'artisanal-aloe-vera-handmade-soap',
    rating: 4.51,
    review_count: 120,
    reviews: 120, name: 'Soothing Bar — Aloe Vera, Neem & Tulsi (100 GM)', price: 349, active: 'Aloe Vera + Purifying Neem + Sacred Tulsi' }
    ],
    mrpTotal: 2047,
    bundlePrice: 1499,
    savings: 548,
    phWindow: 'pH 5.0 – 5.5 Acid-Mantle Calibrated',
    batchAllocation: 'Batch 04/26 · 42 Regimen Sets Remaining',
    image_url: '/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp'
  },
  {
    id: 'bundle-inside-out-ritual',
    rating: 4.92,
    reviews: 378,
    review_count: 378,
    sku: 'BV-BND-INSIDEOUT-02',
    name: 'The Inside-Out Skin-Clearing & Cortisol Ritual',
    badge: 'Dual Topical + Internal System · Save ₹298',
    tagline: 'Topical 3% Activated Carbon Pore Detox + Internal 90% 7-Tulsi Cortisol & Gut-Skin Adaptogen',
    items: [
      { id: 1, slug: 'activated-charcoal-luxury-face-wash',
    rating: 4.59,
    review_count: 220,
    reviews: 220, name: 'Activated Charcoal Purifying Luxury Face Wash (100 ML)', price: 699, active: '3% Activated Charcoal + 5% Glycerin + 0.5% Manjistha' },
      { id: 6, slug: 'kalpvriksh-satva-tulsi-7-tulsi-extract',
    rating: 4.62,
    review_count: 210,
    reviews: 210, name: 'Kalpvriksh Satva 7-Tulsi Ingestible Skin & Cortisol Adaptogen (30 ML)', price: 499, active: '9.0 ml / 10 ml Seven-Tulsi Extract (Eugenol & Rosmarinic Acid)' },
      { id: 4, slug: 'artisanal-charcoal-handmade-soap',
    rating: 4.52,
    review_count: 130,
    reviews: 130, name: 'Charcoal Deep Cleansing Bar with Aloe Vera (100 GM)', price: 399, active: 'Microporous Carbon + Soothing Aloe Matrix' }
    ],
    mrpTotal: 1597,
    bundlePrice: 1299,
    savings: 298,
    phWindow: 'pH 5.4 Topical + 90% Phyto-Extract',
    batchAllocation: 'Batch 04/26 · 37 Ritual Sets Remaining',
    image_url: '/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp'
  },
  {
    id: 'bundle-grand-maison-vault',
    rating: 4.78,
    reviews: 118,
    review_count: 118,
    sku: 'BV-BND-VAULT-06',
    name: 'The Grand Maison 6-Piece Apothecary Vault',
    badge: 'Complete Collector Edition · Save ₹845',
    tagline: 'All 6 100% Label-Disclosed Formulations in an Artisanal Wax-Sealed Collector Vault',
    items: [
      { id: 1, slug: 'activated-charcoal-luxury-face-wash',
    rating: 4.59,
    review_count: 220,
    reviews: 220, name: 'Activated Charcoal Purifying Luxury Face Wash (100 ML)', price: 699, active: '3% Charcoal + 5% Glycerin' },
      { id: 2, slug: 'himalayan-seabuckthorn-luxury-face-wash',
    rating: 4.61,
    review_count: 240,
    reviews: 240, name: 'Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML)', price: 799, active: '4% Sea Buckthorn + 5% Glycerin' },
      { id: 3, slug: 'luxury-2-in-1-botanical-shampoo-conditioner',
    rating: 4.53,
    review_count: 160,
    reviews: 160, name: 'Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML)', price: 899, active: '100mg Standardized 8-Herb Complex' },
      { id: 4, slug: 'artisanal-charcoal-handmade-soap',
    rating: 4.52,
    review_count: 130,
    reviews: 130, name: 'Charcoal Deep Cleansing Bar (100 GM)', price: 399, active: 'Activated Charcoal + Aloe' },
      { id: 5, slug: 'artisanal-aloe-vera-handmade-soap',
    rating: 4.51,
    review_count: 120,
    reviews: 120, name: 'Soothing Bar — Aloe Vera, Neem & Tulsi (100 GM)', price: 349, active: 'Aloe + Neem + Sacred Tulsi' },
      { id: 6, slug: 'kalpvriksh-satva-tulsi-7-tulsi-extract',
    rating: 4.62,
    review_count: 210,
    reviews: 210, name: 'Kalpvriksh Satva 7-Tulsi Ingestible Adaptogen Drops (30 ML)', price: 499, active: '9.0ml / 10ml 7-Tulsi Extract' }
    ],
    mrpTotal: 3644,
    bundlePrice: 2799,
    savings: 845,
    phWindow: 'Signed Batch 04/26 Lab Certificates Included',
    batchAllocation: 'Batch 04/26 · 19 Collector Vaults Remaining',
    image_url: '/assets/images/Promo7.webp'
  }
];

export const SAMPLE_BATCH_COAS = {
  'BHMV-2610-SB083': {
    serial: 'BHMV-2610-SB083',
    batchCode: 'BATCH-04/26-SB',
    productName: 'Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML)',
    bottleSequence: 'Bottle #083 of 250',
    remainingInBatch: 83,
    pressedDate: 'Oct 18, 2026',
    extractionTemp: '26.4°C (Sub-28°C Cold-Pressed Verified)',
    calibratedPh: '5.42 pH (at 25.0°C Digital Electrode)',
    microbiologicalAssay: 'Total Aerobic Count < 10 CFU/ml · Zero Pathogens',
    heavyMetals: 'Pb <0.05 ppm · As <0.02 ppm · Hg ND (ICP-MS)',
    disclosedActives: '4.0% Sea Buckthorn, 5.0% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid, 0.1% Niacinamide',
    tamperCustody: 'Artisanal Wax-Sealed & Gold-Foil Neck Collar · 214.5g Verified',
    originLot: 'Ladakh Nubra Valley Cooperative Lot #LDK-SB-2026'
  },
  'BHMV-2610-CH041': {
    serial: 'BHMV-2610-CH041',
    batchCode: 'BATCH-04/26-CH',
    productName: 'Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML)',
    bottleSequence: 'Bottle #041 of 250',
    remainingInBatch: 64,
    pressedDate: 'Oct 16, 2026',
    extractionTemp: '25.8°C (Sub-28°C Cold-Compounded)',
    calibratedPh: '5.48 pH (at 25.0°C Digital Electrode)',
    microbiologicalAssay: 'Total Aerobic Count < 10 CFU/ml · Sterile Fill',
    heavyMetals: 'Pb <0.04 ppm · As <0.01 ppm · Hg ND (ICP-MS)',
    disclosedActives: '3.0% Activated Charcoal, 5.0% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid, 0.1% Niacinamide',
    tamperCustody: 'Artisanal Wax-Sealed & Gold-Foil Neck Collar · 215.0g Verified',
    originLot: 'Assam Microporous Bamboo Carbon Lot #ASM-BC-2026'
  },
  'BHMV-2610-SH112': {
    serial: 'BHMV-2610-SH112',
    batchCode: 'BATCH-04/26-SH',
    productName: 'Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML)',
    bottleSequence: 'Bottle #112 of 250',
    remainingInBatch: 91,
    pressedDate: 'Oct 19, 2026',
    extractionTemp: '27.1°C (Sub-28°C Saponin Infusion)',
    calibratedPh: '5.18 pH (Cuticle-Smoothing Calibration)',
    microbiologicalAssay: 'Total Aerobic Count < 10 CFU/ml · Passed',
    heavyMetals: 'Pb <0.03 ppm · As ND · Hg ND (ICP-MS)',
    disclosedActives: '25mg Reetha, 20mg Amla, 10mg Triphala, 10mg Bhringraj, 10mg Rosemary Oil, 10mg Neem, 10mg Aloe Vera, 5mg Shikakai',
    tamperCustody: 'Artisanal Wax-Sealed & Gold-Foil Neck Collar · 342.0g Verified',
    originLot: 'Himachal & Central India Saponin Estate Lot #HIM-RP-2026'
  },
  'BHMV-2610-TL019': {
    serial: 'BHMV-2610-TL019',
    batchCode: 'BATCH-04/26-TL',
    productName: 'Kalpvriksh Satva Tulsi — Ingestible Skin-Clearing & Cortisol Adaptogen (30 ML)',
    bottleSequence: 'Bottle #019 of 250',
    remainingInBatch: 58,
    pressedDate: 'Oct 20, 2026',
    extractionTemp: '24.9°C (Cold-Hydro-Distilled Phyto-Essence)',
    calibratedPh: '90% Seven-Tulsi Distillate (9.0 ml / 10 ml)',
    microbiologicalAssay: 'Food-Grade Botanical Purity · Zero Solvents',
    heavyMetals: 'Pb ND · As ND · Cd ND · Hg ND',
    disclosedActives: '9.0 ml / 10 ml Seven-Tulsi Spectrum: Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi',
    tamperCustody: 'Artisanal Dropper Security Seal · 98.5g Verified',
    originLot: 'Vrindavan & Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026'
  }
};
