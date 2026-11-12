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
    gst_hsn_code: '30049011',
    gst_rate: 5.0,
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
    gst_hsn_code: '30049011',
    gst_rate: 5.0,
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
      copy: 'Our botanical formulation and offline retail stewardship began in 2016 under MPG E Business Private Limited. After 10 years of proven patron trust across India, we formally incorporated our dedicated luxury flagship and registered trademark—Bhumivera Organics India Private Limited (CIN: U20237WB2026PTC295842, RoC-Kolkata II)—on 8 April 2026 with directors Aman Prasad, Akash Prasad, and Akash Prasad, Payal Prasad & Aman Prasad.',
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
    subtitle: 'A clear account of the personal data we use, why we use it, who may receive it, how long we retain it, and how you can exercise your rights.',
    statuteBadge: 'Digital Personal Data Protection (DPDP) Act 2023 · IT Rules 2011',
    heroImage: '/logo.webp',
    keyMetrics: [
      ['Clear purposes', 'Data used for stated service needs'],
      ['Optional choices', 'Marketing and recommendations are separate'],
      ['Limited access', 'Shared only where needed or legally required'],
      ['Your rights', 'Access, correction, withdrawal and erasure requests'],
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
  "id": 1,
  "name": "Bhumivera Activated Charcoal Purifying Luxury Face Wash",
  "slug": "activated-charcoal-luxury-face-wash",
  "rating": 4.71,
  "review_count": 276,
  "reviews": 276,
  "sku": "BV-LUX-CFW-01",
  "mpn": "BVCFW100ML",
  "net_volume": "100 ML",
  "price": 699.0,
  "mrp": 899.0,
  "stock": 250,
  "category": "Luxury Facial Cleansers",
  "ph_level": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
  "active_ingredients": "Charcoal (3%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)",
  "image_url": "/images/products/bhumivera-activated-charcoal-luxury-face-wash.webp",
  "seo_title": "Bhumivera Activated Charcoal Luxury Face Wash (100ml) | 3% Charcoal, 5% Glycerin, Hyaluronic Acid, Niacinamide & Manjistha Gentle Botanical Cleanser",
  "meta_description": "Crafted for conscious skincare lovers: Bhumivera Activated Charcoal Luxury Face Wash (100ml) with label-disclosed 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.1% Hyaluronic Acid & 0.1% Niacinamide. Sulfate-free & pH-balanced.",
  "short_description": "A pH-balanced, sulfate-free botanical and active facial cleanser crafted for conscious skincare buyers. Formulated per 100ml with 100% label-disclosed concentrations: 3% Charcoal, 5% Glycerin, 0.5% Manjistha, 0.5% Haridra (Turmeric), 0.5% Neem, 0.5% Cucumber Extract, 0.1% Hyaluronic Acid & 0.1% Niacinamide.",
  "full_description": "<article class=\"bhumivera-monograph space-y-6\">\n  <h3>Where Sub-28°C Botanical Science Meets Royal Ayurveda: The 3% Activated Charcoal & 5% Glycerin Barrier Cleanser</h3>\n  <p><strong>Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · SKU: BV-LUX-CFW-01)</strong> is a flagship formulation from <a href=\"https://bhumivera.com\"><strong>Bhumivera — The Transparent Maison</strong></a> (<a href=\"https://bhumivera.com/about\">Bhumivera Organics India Private Limited</a>, incorporated August 4, 2026 under Founder <strong>Akash Prasad</strong> and Directors <strong>Akash Prasad, Payal Prasad &amp; Aman Prasad</strong>), rooted in the 10-year herbal manufacturing and household distribution heritage of <a href=\"https://bhumivera.com/mpgebusiness\"><strong>MPG E-Business Private Limited</strong></a> (established September 22, 2016 in Asansol, West Bengal · CIN: <code>U74999WB2016PTC217735</code> · Founder: <strong>Dilip Prasad Nonia</strong>). Engineered under <em>The Bhumivera Transparency Standard (Est. 2016 lineage)</em>, this formulation prints 100% of its functional active concentrations openly on the physical bottle label: <strong>Charcoal (3%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)</strong>, calibrated to <strong>pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)</strong>.</p>\n  <p>Urban life across modern cities exposes facial skin to an invisible daily siege of particulate matter (PM2.5 and PM10 traffic soot), polycyclic aromatic hydrocarbons (PAHs), heavy metals, and volatile organic compounds. Because PM2.5 particles measure less than 2.5 micrometers in diameter—roughly 20 times smaller than a human pore opening—they penetrate deep into the pilosebaceous unit, where they catalyze the peroxidation of natural squalene into comedogenic squalene monohydroperoxide. The result is chronic low-grade inflammation, stubborn blackheads, enlarged pores, and premature dullness.</p><p>The Bhumivera Activated Charcoal Purifying Luxury Face Wash was engineered specifically for label-conscious skincare buyers who demand deep urban pore purification without sacrificing their skin's delicate moisture barrier. While mass-market charcoal cleansers rely on harsh Sodium Lauryl Sulfate (SLS) and an undisclosed trace of carbon powder purely for black coloring, Bhumivera formulates every 100ml bottle with a label-disclosed 3.0% concentration of steam-activated microporous carbon suspended inside a generous 5.0% Botanical Glycerin cushion, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Wild Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract.</p>\n\n  <h3>I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters</h3>\n  <p>At the core of this formulation is 3.0% Steam-Activated Bamboo Charcoal (Bambusa tulda), harvested from sustainable groves in Assam and steam-activated at 850°C to create an internal microporous lattice exceeding 900 square meters of surface area per gram. Crucially, our carbon is jet-milled to an ultra-fine, spherical particle profile under 15 microns. Unlike crushed walnut shells, apricot kernels, or coarse charcoal powders that inflict microscopic lacerations (micro-tears) across the stratum corneum, Bhumivera's sub-15-micron activated carbon glides silkily across the epidermis, acting as a lipophilic molecular magnet that binds and lifts oxidized sebum, sunscreen residue, and PM2.5 soot through physical adsorption.</p><p>To ensure that this powerful adsorption never leaves the skin feeling tight, dry, or squeaky, the 3.0% carbon core is balanced by a 5.0% Plant-Derived Glycerin humectant matrix and 0.1% bio-fermented Sodium Hyaluronate (Hyaluronic Acid). During the 30-to-45-second cleansing massage, Glycerin and Hyaluronic Acid form a hydrogen-bonded hydration shield over the corneocytes, while 0.1% USP-grade Niacinamide (Vitamin B3) supports barrier lipid resilience and helps normalize sebaceous gland output.</p>\n  <p>For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque <code>&ldquo;Aqua / Base Q.S.&rdquo;</code> disclosure on the back—where high-value botanicals like <a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Himalayan Sea Buckthorn</a>, <a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Manjistha (Rubia cordifolia)</a>, <a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Haridra (Curcuma longa)</a>, <a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reetha (Sapindus mukorossi)</a>, and <a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Sacred Tulsi (Ocimum tenuiflorum)</a> are dusted in at trace levels below 0.01% and boiled at 80°C–100°C. <a href=\"https://bhumivera.com/science\">Bhumivera’s Sub-28°C Formulation Lab</a> eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Niacinamide Vitamin B3</a>, <a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Multi-Molecular Hyaluronic Acid</a>, and Plant-Derived Glycerin) at full, verifiable label potencies.</p>\n\n  <h4>Complete Active Ingredient &amp; Phytochemical Monograph Table (100 ML)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Disclosed Active &amp; INCI</th>\n          <th>Label Potency</th>\n          <th>Botanical / Chemical Class &amp; Reference</th>\n          <th>Extraction &amp; Harvest Corridor</th>\n          <th>Dermal / Trichological / Cellular Mechanism</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Activated Charcoal</strong><br/><small>Carbon Black / Steam-Activated Bambusa tulda Carbon (<15 μm)</small></td>\n          <td><strong>3.0%</strong></td>\n          <td>Microporous Steam-Activated Carbon (<a href=\"https://en.wikipedia.org/wiki/Activated_carbon\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>850°C Steam Activation & Jet-Milling (<15 Microns) · <a href=\"/provenance-engine\">REG-03 · Assam & North-East Sustainable Bamboo Groves</a></td>\n          <td>Adsorbs surface PM2.5 urban pollutants, oxidized squalene, pore congestion, and excess sebum via Van der Waals forces without abrasive physical scrubbing.</td>\n        </tr><tr>\n          <td><strong>Botanical Glycerin</strong><br/><small>Glycerin (Plant-Derived Trihydroxy Sugar Alcohol)</small></td>\n          <td><strong>5.0%</strong></td>\n          <td>Plant-Derived Humectant Cushion (<a href=\"https://en.wikipedia.org/wiki/Glycerol\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold-Filtered Vegetable Lipid Hydrolysis (USP Grade) · <a href=\"/provenance-engine\">REG-06 · Indian Plant-Oil Fractionation Cleanroom</a></td>\n          <td>Creates an intensive 5.0% moisture cushion that prevents surfactant-induced tightness, supports aquaporin-3 water transport, and protects the stratum corneum barrier.</td>\n        </tr><tr>\n          <td><strong>Manjistha Extract</strong><br/><small>Rubia cordifolia Root Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Rubia cordifolia (Varnya Root) (<a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Hydro-Glycerinic Root Maceration · <a href=\"/provenance-engine\">REG-05 · Vindhya & Central Indian Forest Belts</a></td>\n          <td>Revered Ayurvedic complexion-brightening (Varnya) root that modulates oxidative tyrosinase activity, calms post-blemish erythema, and visibly evens out dull skin tone.</td>\n        </tr><tr>\n          <td><strong>Haridra (Wild Turmeric)</strong><br/><small>Curcuma longa Rhizome Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Curcuma longa Rhizome (<a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Rhizome Extraction · <a href=\"/provenance-engine\">REG-05 · Nilgiri & Eastern India Organic Farms</a></td>\n          <td>Antioxidant-rich botanical rhizome that neutralizes UV- and pollution-induced free radicals, calms redness, and supports natural cellular luminosity.</td>\n        </tr><tr>\n          <td><strong>Neem Extract</strong><br/><small>Azadirachta indica Leaf Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Azadirachta indica Leaf (<a href=\"https://en.wikipedia.org/wiki/Azadirachta_indica\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Leaf Infusion · <a href=\"/provenance-engine\">REG-05 · Central & Eastern India Botanical Cooperatives</a></td>\n          <td>Time-tested purifying leaf extract that clarifies congested pores, balances cutaneous flora, and defends blemish-prone skin against urban grime.</td>\n        </tr><tr>\n          <td><strong>Cucumber Extract</strong><br/><small>Cucumis sativus Fruit Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Cucumis sativus Cellular Water (<a href=\"https://en.wikipedia.org/wiki/Cucumber\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold Cellular Press (<25°C) · <a href=\"/provenance-engine\">REG-06 · Eastern India Agrarian Clusters</a></td>\n          <td>Instantly cools heat-flushed skin, reduces morning puffiness, and delivers lightweight amino-acid and mineral hydration.</td>\n        </tr><tr>\n          <td><strong>Hyaluronic Acid</strong><br/><small>Sodium Hyaluronate (Bio-Fermented)</small></td>\n          <td><strong>0.1%</strong></td>\n          <td>Sodium Hyaluronate Polysaccharide (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Plant-Glucose Bio-Fermentation (100% Vegan) · <a href=\"/provenance-engine\">Analytical Cleanroom Bio-Fermentation</a></td>\n          <td>Biomimetic water-binding humectant that binds up to 1,000x its weight in water, forming a breathable hydration veil during cleansing for a plump, dewy feel.</td>\n        </tr><tr>\n          <td><strong>Niacinamide (Vitamin B3)</strong><br/><small>Niacinamide (Pyridine-3-carboxamide · USP Grade)</small></td>\n          <td><strong>0.1%</strong></td>\n          <td>Nicotinamide (Vitamin B3) (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Pharmaceutical Grade Synthesis (Zero Nicotinic Acid Flush) · <a href=\"/provenance-engine\">USP/EP Certified Analytical Synthesis</a></td>\n          <td>Supports natural epidermal ceramide and free-fatty-acid synthesis, helps regulate excess T-zone sebum, and refines the appearance of enlarged pores.</td>\n        </tr><tr>\n          <td><strong>Perfume & Cleanser Base</strong><br/><small>Aqua, Decyl Glucoside, Coco-Glucoside, Cocamidopropyl Betaine, IFRA Botanical Aroma</small></td>\n          <td><strong>0.5% / Q.S.</strong></td>\n          <td>pH-Balanced Sulfate-Free Emulsion (<a href=\"https://bhumivera.com/science\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold-Compounded Cleanroom Homogenization (<28°C) · <a href=\"/provenance-engine\">REG-06 · GMP Formulation Cleanroom</a></td>\n          <td>Gentle, 100% sulfate-free (0% SLS/SLES) cleansing suspension vehicle that lifts impurities without disrupting intercellular barrier lipids.</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3>II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced))</h3>\n  <p>What elevates the Bhumivera Activated Charcoal Purifying Luxury Face Wash into a true Ayurvedic-clinical hybrid is its standardized 2.0% quad-botanical phyto-complex: 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). In classical Ayurvedic dermatology, Manjistha and Haridra are revered as premier 'Varnya' (complexion-illuminating and blood/lymph-clarifying) botanicals. Rich in purpurin, munjistin, and bioactive curcuminoids, they calm the appearance of post-blemish redness and help visibly even out sun-induced hyperpigmentation.</p><p>Simultaneously, 0.5% cold-extracted Neem leaf delivers nimbidin and quercetin limonoids that keep acne-prone and congested pores clarified, while 0.5% fresh Cucumber cellular extract cools epidermal heat and replenishes soothing silica and amino acids. For patrons who practice a dual-cleanser routine, pairing this 3% Activated Charcoal Face Wash in the evening (PM) with our 4% Himalayan Sea Buckthorn Cellular Radiance Face Wash in the morning (AM) provides 24-hour pore clarity and Omega-7 radiance.</p>\n  <p>Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically <em>beta-glucocerebrosidase</em> and <em>acidic sphingomyelinase</em>—require an acidic microenvironment between <strong>pH 4.7 and 5.75</strong> to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating <strong>Bhumivera Activated Charcoal Purifying Luxury Face Wash</strong> to <strong>pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)</strong> and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our <a href=\"/verify\">Bottle Serial &amp; COA Verification Portal</a> and <a href=\"/somatic-registry\">Somatic INCI Label Registry</a>), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it.</p>\n\n  <h3>III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule</h3>\n  <p>To unlock the full benefit of this 9.7% active-disclosed emulsion, treat cleansing as a mindful 45-second dermal treatment rather than a rushed 5-second splash. Because the formula uses mild, biodegradable plant glucosides rather than synthetic SLS foaming agents, it produces a dense, creamy micro-velvet lather that rinses away effortlessly without leaving a soapy film.</p>\n  <ul>\n    <li><strong>Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):</strong> Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer.</li>\n    <li><strong>Step 2 — Measured Dispensing &amp; Palmar Emulsification:</strong> Dispense the recommended dose of <strong>Bhumivera Activated Charcoal Purifying Luxury Face Wash</strong> into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp.</li>\n    <li><strong>Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:</strong> Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives (<strong>Charcoal (3%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)</strong>) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates.</li>\n    <li><strong>Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:</strong> Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary <a href=\"/shop\">Bhumivera Inside-Out Ritual</a> formulations.</li>\n    <li><strong>Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:</strong> Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility (<a href=\"/lab\">read our full Cleanroom &amp; Patch-Test Protocol</a>).</li>\n  </ul>\n\n  <h3>IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter)</h3>\n  <p>Whether you commute through high-traffic metropolitan corridors in Delhi NCR, Mumbai, Bengaluru, Kolkata, Hyderabad, or industrial hubs like Asansol and Durgapur, daily particulate exposure accelerates oxidative skin stress. In peak summer and monsoon humidity, use this cleanser morning and evening to keep T-zone sebum balanced. In dry winter months, use it as your evening (PM) deep-pore reset and pair with the Bhumivera Himalayan Sea Buckthorn Face Wash in the morning.</p>\n  <p>Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum. <strong>Bhumivera Activated Charcoal Purifying Luxury Face Wash</strong> is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration.</p>\n\n  <h3>V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem</h3>\n  <p>Every formulation in the <a href=\"/shop\">Bhumivera 6-Product Flagship Catalog</a> is engineered to work as part of an interconnected, inside-out botanical system. Explore how <strong>Bhumivera Activated Charcoal Purifying Luxury Face Wash</strong> pairs with our companion formulations:</p>\n  <ul>\n    <li><strong>1. <a href=\"/product/activated-charcoal-luxury-face-wash\">Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699)</a>:</strong> Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification.</li>\n    <li><strong>2. <a href=\"/product/himalayan-seabuckthorn-luxury-face-wash\">Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799)</a>:</strong> Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity.</li>\n    <li><strong>3. <a href=\"/product/luxury-2-in-1-botanical-shampoo-conditioner\">Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899)</a>:</strong> Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing.</li>\n    <li><strong>4. <a href=\"/product/artisanal-charcoal-handmade-soap\">Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399)</a>:</strong> Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification.</li>\n    <li><strong>5. <a href=\"/product/artisanal-aloe-vera-handmade-soap\">Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349)</a>:</strong> Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care.</li>\n    <li><strong>6. <a href=\"/product/kalpvriksh-satva-tulsi-7-tulsi-extract\">Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499)</a>:</strong> Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality.</li>\n  </ul>\n  <p>You can also acquire coordinated sets in our <a href=\"/combo/bundle-daily-regimen\">Grand Maison 4-Piece Daily Apothecary Bundle</a>, <a href=\"/combo/bundle-royal-crown-trio\">Royal Skin &amp; Scalp Stewardship Trio</a>, <a href=\"/combo/bundle-inside-out-ritual\">Inside-Out Skin-Clearing &amp; Cortisol Ritual</a>, or the collector’s <a href=\"/combo/bundle-grand-maison-vault\">Grand Maison 6-Piece Apothecary Vault</a>, or compare any two formulations side-by-side on our <a href=\"/compare\">Interactive Formulation Comparison Tool</a>.</p>\n\n  <h3>VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact</h3>\n  <p>Every bottle of Bhumivera Activated Charcoal Purifying Luxury Face Wash (Batch #SCFW26H · Sample COA Serial: BHMV-2610-CH041) undergoes cleanroom microbiological screening (<10 CFU/ml) and ICP-MS heavy-metal verification (Lead <0.04 ppm, Arsenic <0.01 ppm, Mercury ND).</p>\n  <p>Every unit of <strong>Bhumivera Activated Charcoal Purifying Luxury Face Wash</strong> is traceable through our <a href=\"/provenance-engine\">6-Corridor Indian Botanical Provenance Engine</a> and protected by <a href=\"/purchase-protection\">Bhumivera White-Glove Purchase Protection</a>. To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard (<a href=\"/legal/shipping-hygiene\">Part II of the Bhumivera Legal Suite</a>) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch (<a href=\"/order-tracking\">track live AWB &amp; dispatch weight logs</a>). Furthermore, every order supports our verifiable community initiatives documented on the <a href=\"/impact\">Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact)</a>—including <a href=\"/impact/stray-animal-care\">The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative</a> and <a href=\"/impact/elderly-disabled-rations\">The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative</a> in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors (<a href=\"/impact/damodar-cleanup\">Damodar Riverbank Vetiver Cleanup</a>, <a href=\"/impact/jute-sapling-nursery\">Biodegradable Jute Sapling Nursery</a>, <a href=\"/impact/village-pukur-revival\">Village Pukur Pond Revival</a>, <a href=\"/impact/herbal-kitchen-gardens\">Medicinal Herbal Kitchen Gardens</a>, <a href=\"/impact/mandi-vermicomposting\">Mandi Waste Vermicomposting</a>, and <a href=\"/impact/coal-belt-microgrove\">Coal-Belt Native Micro-Grove</a>).</p>\n\n  <h4>Technical &amp; Regulatory Specification Summary (BV-LUX-CFW-01)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Specification Parameter</th>\n          <th>Verified Bhumivera Standard</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Brand Name</strong></td>\n          <td>Bhumivera (The Transparent Maison · Est. 2016 Lineage)</td>\n        </tr><tr>\n          <td><strong>Product Full Name</strong></td>\n          <td>Bhumivera Activated Charcoal Purifying Luxury Face Wash</td>\n        </tr><tr>\n          <td><strong>SKU Code</strong></td>\n          <td>BV-LUX-CFW-01 (Legacy: BV-CHFW-100ML)</td>\n        </tr><tr>\n          <td><strong>MPN Code</strong></td>\n          <td>BVCFW100ML</td>\n        </tr><tr>\n          <td><strong>GTIN 13 EAN</strong></td>\n          <td>8906182600018</td>\n        </tr><tr>\n          <td><strong>GST HSN Code</strong></td>\n          <td>30049011 (Ayurvedic & Botanical Preparations · 5% GST)</td>\n        </tr><tr>\n          <td><strong>Net Volume Metric</strong></td>\n          <td>100 ML (3.38 fl. oz.)</td>\n        </tr><tr>\n          <td><strong>Gross Dispatch Weight</strong></td>\n          <td>215.0 Grams (±0.5g Digital Scale Verified)</td>\n        </tr><tr>\n          <td><strong>Batch Number</strong></td>\n          <td>SCFW26H / BATCH-04/26-CH (250 Units per Micro-Batch)</td>\n        </tr><tr>\n          <td><strong>Calibrated pH Range</strong></td>\n          <td>pH 5.40 – 5.51 at 25.0°C (Digital Glass Electrode Verified)</td>\n        </tr><tr>\n          <td><strong>Extraction Temperature</strong></td>\n          <td>< 28.0°C (25.8°C Cold-Compounded Sub-Ambient Protocol)</td>\n        </tr><tr>\n          <td><strong>Primary Purifying Active</strong></td>\n          <td>3.0% Steam-Activated Microporous Bamboo Charcoal (<15 Microns)</td>\n        </tr><tr>\n          <td><strong>Primary Humectant Cushion</strong></td>\n          <td>5.0% Plant-Derived Botanical Glycerin + 0.1% Hyaluronic Acid</td>\n        </tr><tr>\n          <td><strong>Barrier Vitamin CoFactor</strong></td>\n          <td>0.1% USP-Grade Niacinamide (Vitamin B3 · Pyridine-3-carboxamide)</td>\n        </tr><tr>\n          <td><strong>Ayurvedic Phyto Complex</strong></td>\n          <td>0.5% Manjistha + 0.5% Haridra (Turmeric) + 0.5% Neem + 0.5% Cucumber</td>\n        </tr><tr>\n          <td><strong>Total Disclosed Actives</strong></td>\n          <td>9.7% Active & Functional Botanical/Humectant Concentration + Q.S. Base</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</article>",
  "description": "Where Sub-28°C Botanical Science Meets Royal Ayurveda: The 3% Activated Charcoal & 5% Glycerin Barrier Cleanser \n    Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · SKU: BV-LUX-CFW-01)  is a flagship formulation from   Bhumivera — The Transparent Maison   ( Bhumivera Organics India Private Limited , incorporated August 4, 2026 under Founder  Akash Prasad  and Directors  Akash Prasad, Payal Prasad &amp; Aman Prasad ), rooted in the 10-year herbal manufacturing and household distribution heritage of   MPG E-Business Private Limited   (established September 22, 2016 in Asansol, West Bengal · CIN:  U74999WB2016PTC217735  · Founder:  Dilip Prasad Nonia ). Engineered under  The Bhumivera Transparency Standard (Est. 2016 lineage) , this formulation prints 100% of its functional active concentrations openly on the physical bottle label:  Charcoal (3%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.) , calibrated to  pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced) . \n   Urban life across modern cities exposes facial skin to an invisible daily siege of particulate matter (PM2.5 and PM10 traffic soot), polycyclic aromatic hydrocarbons (PAHs), heavy metals, and volatile organic compounds. Because PM2.5 particles measure less than 2.5 micrometers in diameter—roughly 20 times smaller than a human pore opening—they penetrate deep into the pilosebaceous unit, where they catalyze the peroxidation of natural squalene into comedogenic squalene monohydroperoxide. The result is chronic low-grade inflammation, stubborn blackheads, enlarged pores, and premature dullness.  The Bhumivera Activated Charcoal Purifying Luxury Face Wash was engineered specifically for label-conscious skincare buyers who demand deep urban pore purification without sacrificing their skin's delicate moisture barrier. While mass-market charcoal cleansers rely on harsh Sodium Lauryl Sulfate (SLS) and an undisclosed trace of carbon powder purely for black coloring, Bhumivera formulates every 100ml bottle with a label-disclosed 3.0% concentration of steam-activated microporous carbon suspended inside a generous 5.0% Botanical Glycerin cushion, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Wild Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract. \n\n   I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters \n   At the core of this formulation is 3.0% Steam-Activated Bamboo Charcoal (Bambusa tulda), harvested from sustainable groves in Assam and steam-activated at 850°C to create an internal microporous lattice exceeding 900 square meters of surface area per gram. Crucially, our carbon is jet-milled to an ultra-fine, spherical particle profile under 15 microns. Unlike crushed walnut shells, apricot kernels, or coarse charcoal powders that inflict microscopic lacerations (micro-tears) across the stratum corneum, Bhumivera's sub-15-micron activated carbon glides silkily across the epidermis, acting as a lipophilic molecular magnet that binds and lifts oxidized sebum, sunscreen residue, and PM2.5 soot through physical adsorption.  To ensure that this powerful adsorption never leaves the skin feeling tight, dry, or squeaky, the 3.0% carbon core is balanced by a 5.0% Plant-Derived Glycerin humectant matrix and 0.1% bio-fermented Sodium Hyaluronate (Hyaluronic Acid). During the 30-to-45-second cleansing massage, Glycerin and Hyaluronic Acid form a hydrogen-bonded hydration shield over the corneocytes, while 0.1% USP-grade Niacinamide (Vitamin B3) supports barrier lipid resilience and helps normalize sebaceous gland output. \n   For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque  &ldquo;Aqua / Base Q.S.&rdquo;  disclosure on the back—where high-value botanicals like  Himalayan Sea Buckthorn ,  Manjistha (Rubia cordifolia) ,  Haridra (Curcuma longa) ,  Reetha (Sapindus mukorossi) , and  Sacred Tulsi (Ocimum tenuiflorum)  are dusted in at trace levels below 0.01% and boiled at 80°C–100°C.  Bhumivera’s Sub-28°C Formulation Lab  eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants ( Niacinamide Vitamin B3 ,  Multi-Molecular Hyaluronic Acid , and Plant-Derived Glycerin) at full, verifiable label potencies. \n\n   Complete Active Ingredient &amp; Phytochemical Monograph Table (100 ML) \n   \n     \n       \n         \n           Disclosed Active &amp; INCI \n           Label Potency \n           Botanical / Chemical Class &amp; Reference \n           Extraction &amp; Harvest Corridor \n           Dermal / Trichological / Cellular Mechanism \n         \n       \n       \n         \n            Activated Charcoal   Carbon Black / Steam-Activated Bambusa tulda Carbon (  \n            3.0%  \n           Microporous Steam-Activated Carbon ( Reference ↗ ) \n           850°C Steam Activation & Jet-Milling ( REG-03 · Assam & North-East Sustainable Bamboo Groves  \n           Adsorbs surface PM2.5 urban pollutants, oxidized squalene, pore congestion, and excess sebum via Van der Waals forces without abrasive physical scrubbing. \n          \n            Botanical Glycerin   Glycerin (Plant-Derived Trihydroxy Sugar Alcohol)  \n            5.0%  \n           Plant-Derived Humectant Cushion ( Reference ↗ ) \n           Cold-Filtered Vegetable Lipid Hydrolysis (USP Grade) ·  REG-06 · Indian Plant-Oil Fractionation Cleanroom  \n           Creates an intensive 5.0% moisture cushion that prevents surfactant-induced tightness, supports aquaporin-3 water transport, and protects the stratum corneum barrier. \n          \n            Manjistha Extract   Rubia cordifolia Root Extract  \n            0.5%  \n           Rubia cordifolia (Varnya Root) ( Reference ↗ ) \n           Sub-28°C Hydro-Glycerinic Root Maceration ·  REG-05 · Vindhya & Central Indian Forest Belts  \n           Revered Ayurvedic complexion-brightening (Varnya) root that modulates oxidative tyrosinase activity, calms post-blemish erythema, and visibly evens out dull skin tone. \n          \n            Haridra (Wild Turmeric)   Curcuma longa Rhizome Extract  \n            0.5%  \n           Curcuma longa Rhizome ( Reference ↗ ) \n           Sub-28°C Cold Rhizome Extraction ·  REG-05 · Nilgiri & Eastern India Organic Farms  \n           Antioxidant-rich botanical rhizome that neutralizes UV- and pollution-induced free radicals, calms redness, and supports natural cellular luminosity. \n          \n            Neem Extract   Azadirachta indica Leaf Extract  \n            0.5%  \n           Azadirachta indica Leaf ( Reference ↗ ) \n           Sub-28°C Cold Leaf Infusion ·  REG-05 · Central & Eastern India Botanical Cooperatives  \n           Time-tested purifying leaf extract that clarifies congested pores, balances cutaneous flora, and defends blemish-prone skin against urban grime. \n          \n            Cucumber Extract   Cucumis sativus Fruit Extract  \n            0.5%  \n           Cucumis sativus Cellular Water ( Reference ↗ ) \n           Cold Cellular Press ( REG-06 · Eastern India Agrarian Clusters  \n           Instantly cools heat-flushed skin, reduces morning puffiness, and delivers lightweight amino-acid and mineral hydration. \n          \n            Hyaluronic Acid   Sodium Hyaluronate (Bio-Fermented)  \n            0.1%  \n           Sodium Hyaluronate Polysaccharide ( Reference ↗ ) \n           Plant-Glucose Bio-Fermentation (100% Vegan) ·  Analytical Cleanroom Bio-Fermentation  \n           Biomimetic water-binding humectant that binds up to 1,000x its weight in water, forming a breathable hydration veil during cleansing for a plump, dewy feel. \n          \n            Niacinamide (Vitamin B3)   Niacinamide (Pyridine-3-carboxamide · USP Grade)  \n            0.1%  \n           Nicotinamide (Vitamin B3) ( Reference ↗ ) \n           Pharmaceutical Grade Synthesis (Zero Nicotinic Acid Flush) ·  USP/EP Certified Analytical Synthesis  \n           Supports natural epidermal ceramide and free-fatty-acid synthesis, helps regulate excess T-zone sebum, and refines the appearance of enlarged pores. \n          \n            Perfume & Cleanser Base   Aqua, Decyl Glucoside, Coco-Glucoside, Cocamidopropyl Betaine, IFRA Botanical Aroma  \n            0.5% / Q.S.  \n           pH-Balanced Sulfate-Free Emulsion ( Reference ↗ ) \n           Cold-Compounded Cleanroom Homogenization ( REG-06 · GMP Formulation Cleanroom  \n           Gentle, 100% sulfate-free (0% SLS/SLES) cleansing suspension vehicle that lifts impurities without disrupting intercellular barrier lipids. \n         \n       \n     \n   \n\n   II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)) \n   What elevates the Bhumivera Activated Charcoal Purifying Luxury Face Wash into a true Ayurvedic-clinical hybrid is its standardized 2.0% quad-botanical phyto-complex: 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). In classical Ayurvedic dermatology, Manjistha and Haridra are revered as premier 'Varnya' (complexion-illuminating and blood/lymph-clarifying) botanicals. Rich in purpurin, munjistin, and bioactive curcuminoids, they calm the appearance of post-blemish redness and help visibly even out sun-induced hyperpigmentation.  Simultaneously, 0.5% cold-extracted Neem leaf delivers nimbidin and quercetin limonoids that keep acne-prone and congested pores clarified, while 0.5% fresh Cucumber cellular extract cools epidermal heat and replenishes soothing silica and amino acids. For patrons who practice a dual-cleanser routine, pairing this 3% Activated Charcoal Face Wash in the evening (PM) with our 4% Himalayan Sea Buckthorn Cellular Radiance Face Wash in the morning (AM) provides 24-hour pore clarity and Omega-7 radiance. \n   Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically  beta-glucocerebrosidase  and  acidic sphingomyelinase —require an acidic microenvironment between  pH 4.7 and 5.75  to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating  Bhumivera Activated Charcoal Purifying Luxury Face Wash  to  pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)  and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our  Bottle Serial &amp; COA Verification Portal  and  Somatic INCI Label Registry ), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it. \n\n   III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule \n   To unlock the full benefit of this 9.7% active-disclosed emulsion, treat cleansing as a mindful 45-second dermal treatment rather than a rushed 5-second splash. Because the formula uses mild, biodegradable plant glucosides rather than synthetic SLS foaming agents, it produces a dense, creamy micro-velvet lather that rinses away effortlessly without leaving a soapy film. \n   \n      Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):  Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer. \n      Step 2 — Measured Dispensing &amp; Palmar Emulsification:  Dispense the recommended dose of  Bhumivera Activated Charcoal Purifying Luxury Face Wash  into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp. \n      Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:  Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives ( Charcoal (3%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.) ) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates. \n      Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:  Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary  Bhumivera Inside-Out Ritual  formulations. \n      Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:  Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility ( read our full Cleanroom &amp; Patch-Test Protocol ). \n   \n\n   IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter) \n   Whether you commute through high-traffic metropolitan corridors in Delhi NCR, Mumbai, Bengaluru, Kolkata, Hyderabad, or industrial hubs like Asansol and Durgapur, daily particulate exposure accelerates oxidative skin stress. In peak summer and monsoon humidity, use this cleanser morning and evening to keep T-zone sebum balanced. In dry winter months, use it as your evening (PM) deep-pore reset and pair with the Bhumivera Himalayan Sea Buckthorn Face Wash in the morning. \n   Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum.  Bhumivera Activated Charcoal Purifying Luxury Face Wash  is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration. \n\n   V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem \n   Every formulation in the  Bhumivera 6-Product Flagship Catalog  is engineered to work as part of an interconnected, inside-out botanical system. Explore how  Bhumivera Activated Charcoal Purifying Luxury Face Wash  pairs with our companion formulations: \n   \n      1.  Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699) :  Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification. \n      2.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799) :  Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity. \n      3.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899) :  Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing. \n      4.  Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399) :  Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification. \n      5.  Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349) :  Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care. \n      6.  Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499) :  Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality. \n   \n   You can also acquire coordinated sets in our  Grand Maison 4-Piece Daily Apothecary Bundle ,  Royal Skin &amp; Scalp Stewardship Trio ,  Inside-Out Skin-Clearing &amp; Cortisol Ritual , or the collector’s  Grand Maison 6-Piece Apothecary Vault , or compare any two formulations side-by-side on our  Interactive Formulation Comparison Tool . \n\n   VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact \n   Every bottle of Bhumivera Activated Charcoal Purifying Luxury Face Wash (Batch #SCFW26H · Sample COA Serial: BHMV-2610-CH041) undergoes cleanroom microbiological screening ( \n   Every unit of  Bhumivera Activated Charcoal Purifying Luxury Face Wash  is traceable through our  6-Corridor Indian Botanical Provenance Engine  and protected by  Bhumivera White-Glove Purchase Protection . To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard ( Part II of the Bhumivera Legal Suite ) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch ( track live AWB &amp; dispatch weight logs ). Furthermore, every order supports our verifiable community initiatives documented on the  Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact) —including  The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative  and  The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative  in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors ( Damodar Riverbank Vetiver Cleanup ,  Biodegradable Jute Sapling Nursery ,  Village Pukur Pond Revival ,  Medicinal Herbal Kitchen Gardens ,  Mandi Waste Vermicomposting , and  Coal-Belt Native Micro-Grove ). \n\n   Technical &amp; Regulatory Specification Summary (BV-LUX-CFW-01) \n   \n     \n       \n         \n           Specification Parameter \n           Verified Bhumivera Standard \n         \n       \n       \n         \n            Brand Name  \n           Bhumivera (The Transparent Maison · Est. 2016 Lineage) \n          \n            Product Full Name  \n           Bhumivera Activated Charcoal Purifying Luxury Face Wash \n          \n            SKU Code  \n           BV-LUX-CFW-01 (Legacy: BV-CHFW-100ML) \n          \n            MPN Code  \n           BVCFW100ML \n          \n            GTIN 13 EAN  \n           8906182600018 \n          \n            GST HSN Code  \n           30049011 (Ayurvedic & Botanical Preparations · 5% GST) \n          \n            Net Volume Metric  \n           100 ML (3.38 fl. oz.) \n          \n            Gross Dispatch Weight  \n           215.0 Grams (±0.5g Digital Scale Verified) \n          \n            Batch Number  \n           SCFW26H / BATCH-04/26-CH (250 Units per Micro-Batch) \n          \n            Calibrated pH Range  \n           pH 5.40 – 5.51 at 25.0°C (Digital Glass Electrode Verified) \n          \n            Extraction Temperature  \n            \n          \n            Primary Purifying Active  \n           3.0% Steam-Activated Microporous Bamboo Charcoal ( \n          \n            Primary Humectant Cushion  \n           5.0% Plant-Derived Botanical Glycerin + 0.1% Hyaluronic Acid \n          \n            Barrier Vitamin CoFactor  \n           0.1% USP-Grade Niacinamide (Vitamin B3 · Pyridine-3-carboxamide) \n          \n            Ayurvedic Phyto Complex  \n           0.5% Manjistha + 0.5% Haridra (Turmeric) + 0.5% Neem + 0.5% Cucumber \n          \n            Total Disclosed Actives  \n           9.7% Active & Functional Botanical/Humectant Concentration + Q.S. Base",
  "editorial_heading": "Where Sub-28°C Botanical Science Meets Royal Ayurveda: The 3% Activated Charcoal & 5% Glycerin Barrier Cleanser",
  "editorial_paragraphs": [
    "Urban life across modern cities exposes facial skin to an invisible daily siege of particulate matter (PM2.5 and PM10 traffic soot), polycyclic aromatic hydrocarbons (PAHs), heavy metals, and volatile organic compounds. Because PM2.5 particles measure less than 2.5 micrometers in diameter—roughly 20 times smaller than a human pore opening—they penetrate deep into the pilosebaceous unit, where they catalyze the peroxidation of natural squalene into comedogenic squalene monohydroperoxide. The result is chronic low-grade inflammation, stubborn blackheads, enlarged pores, and premature dullness.",
    "The Bhumivera Activated Charcoal Purifying Luxury Face Wash was engineered specifically for label-conscious skincare buyers who demand deep urban pore purification without sacrificing their skin's delicate moisture barrier. While mass-market charcoal cleansers rely on harsh Sodium Lauryl Sulfate (SLS) and an undisclosed trace of carbon powder purely for black coloring, Bhumivera formulates every 100ml bottle with a label-disclosed 3.0% concentration of steam-activated microporous carbon suspended inside a generous 5.0% Botanical Glycerin cushion, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Wild Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract.",
    "At the core of this formulation is 3.0% Steam-Activated Bamboo Charcoal (Bambusa tulda), harvested from sustainable groves in Assam and steam-activated at 850°C to create an internal microporous lattice exceeding 900 square meters of surface area per gram. Crucially, our carbon is jet-milled to an ultra-fine, spherical particle profile under 15 microns. Unlike crushed walnut shells, apricot kernels, or coarse charcoal powders that inflict microscopic lacerations (micro-tears) across the stratum corneum, Bhumivera's sub-15-micron activated carbon glides silkily across the epidermis, acting as a lipophilic molecular magnet that binds and lifts oxidized sebum, sunscreen residue, and PM2.5 soot through physical adsorption.",
    "To ensure that this powerful adsorption never leaves the skin feeling tight, dry, or squeaky, the 3.0% carbon core is balanced by a 5.0% Plant-Derived Glycerin humectant matrix and 0.1% bio-fermented Sodium Hyaluronate (Hyaluronic Acid). During the 30-to-45-second cleansing massage, Glycerin and Hyaluronic Acid form a hydrogen-bonded hydration shield over the corneocytes, while 0.1% USP-grade Niacinamide (Vitamin B3) supports barrier lipid resilience and helps normalize sebaceous gland output.",
    "What elevates the Bhumivera Activated Charcoal Purifying Luxury Face Wash into a true Ayurvedic-clinical hybrid is its standardized 2.0% quad-botanical phyto-complex: 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). In classical Ayurvedic dermatology, Manjistha and Haridra are revered as premier 'Varnya' (complexion-illuminating and blood/lymph-clarifying) botanicals. Rich in purpurin, munjistin, and bioactive curcuminoids, they calm the appearance of post-blemish redness and help visibly even out sun-induced hyperpigmentation.",
    "Simultaneously, 0.5% cold-extracted Neem leaf delivers nimbidin and quercetin limonoids that keep acne-prone and congested pores clarified, while 0.5% fresh Cucumber cellular extract cools epidermal heat and replenishes soothing silica and amino acids. For patrons who practice a dual-cleanser routine, pairing this 3% Activated Charcoal Face Wash in the evening (PM) with our 4% Himalayan Sea Buckthorn Cellular Radiance Face Wash in the morning (AM) provides 24-hour pore clarity and Omega-7 radiance."
  ],
  "composition_table": [
    {
      "active": "Activated Charcoal",
      "ingredient": "Activated Charcoal",
      "potency": "3.0%",
      "concentration": "3.0%",
      "classification": "Microporous Steam-Activated Carbon",
      "botanical": "Microporous Steam-Activated Carbon",
      "inci": "",
      "molecular_markers": "High-porosity microporous carbon lattice (>900 m²/g surface area)",
      "extraction_method": "850°C Steam Activation & Jet-Milling (<15 Microns)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
      "mechanism": "Adsorbs surface PM2.5 urban pollutants, oxidized squalene, pore congestion, and excess sebum via Van der Waals forces without abrasive physical scrubbing.",
      "role": "Adsorbs surface PM2.5 urban pollutants, oxidized squalene, pore congestion, and excess sebum via Van der Waals forces without abrasive physical scrubbing.",
      "synergy_partners": "5% Botanical Glycerin + 0.5% Neem + 0.1% Niacinamide",
      "reference_url": "https://en.wikipedia.org/wiki/Activated_carbon"
    },
    {
      "active": "Botanical Glycerin",
      "ingredient": "Botanical Glycerin",
      "potency": "5.0%",
      "concentration": "5.0%",
      "classification": "Plant-Derived Humectant Cushion",
      "botanical": "Plant-Derived Humectant Cushion",
      "inci": "",
      "molecular_markers": "Propane-1,2,3-triol (3 Hydrophilic Hydroxyl Groups)",
      "extraction_method": "Cold-Filtered Vegetable Lipid Hydrolysis (USP Grade)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
      "mechanism": "Creates an intensive 5.0% moisture cushion that prevents surfactant-induced tightness, supports aquaporin-3 water transport, and protects the stratum corneum barrier.",
      "role": "Creates an intensive 5.0% moisture cushion that prevents surfactant-induced tightness, supports aquaporin-3 water transport, and protects the stratum corneum barrier.",
      "synergy_partners": "0.1% Hyaluronic Acid + 0.5% Cucumber Extract",
      "reference_url": "https://en.wikipedia.org/wiki/Glycerol"
    },
    {
      "active": "Manjistha Extract",
      "ingredient": "Manjistha Extract",
      "potency": "0.5%",
      "concentration": "0.5%",
      "classification": "Rubia cordifolia (Varnya Root)",
      "botanical": "Rubia cordifolia (Varnya Root)",
      "inci": "",
      "molecular_markers": "Purpurin, Munjistin, Xanthopurpurin & Rubiadin Anthraquinones",
      "extraction_method": "Sub-28°C Hydro-Glycerinic Root Maceration",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
      "mechanism": "Revered Ayurvedic complexion-brightening (Varnya) root that modulates oxidative tyrosinase activity, calms post-blemish erythema, and visibly evens out dull skin tone.",
      "role": "Revered Ayurvedic complexion-brightening (Varnya) root that modulates oxidative tyrosinase activity, calms post-blemish erythema, and visibly evens out dull skin tone.",
      "synergy_partners": "0.5% Haridra (Turmeric) + 0.1% Niacinamide",
      "reference_url": "https://en.wikipedia.org/wiki/Rubia_cordifolia"
    },
    {
      "active": "Haridra (Wild Turmeric)",
      "ingredient": "Haridra (Wild Turmeric)",
      "potency": "0.5%",
      "concentration": "0.5%",
      "classification": "Curcuma longa Rhizome",
      "botanical": "Curcuma longa Rhizome",
      "inci": "",
      "molecular_markers": "Curcuminoids (Curcumin, Demethoxycurcumin) & Ar-turmerone",
      "extraction_method": "Sub-28°C Cold Rhizome Extraction",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
      "mechanism": "Antioxidant-rich botanical rhizome that neutralizes UV- and pollution-induced free radicals, calms redness, and supports natural cellular luminosity.",
      "role": "Antioxidant-rich botanical rhizome that neutralizes UV- and pollution-induced free radicals, calms redness, and supports natural cellular luminosity.",
      "synergy_partners": "0.5% Manjistha + 0.5% Neem Extract",
      "reference_url": "https://en.wikipedia.org/wiki/Turmeric"
    },
    {
      "active": "Neem Extract",
      "ingredient": "Neem Extract",
      "potency": "0.5%",
      "concentration": "0.5%",
      "classification": "Azadirachta indica Leaf",
      "botanical": "Azadirachta indica Leaf",
      "inci": "",
      "molecular_markers": "Nimbidin, Nimbin, Quercetin & Azadirachtin Limonoids",
      "extraction_method": "Sub-28°C Cold Leaf Infusion",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
      "mechanism": "Time-tested purifying leaf extract that clarifies congested pores, balances cutaneous flora, and defends blemish-prone skin against urban grime.",
      "role": "Time-tested purifying leaf extract that clarifies congested pores, balances cutaneous flora, and defends blemish-prone skin against urban grime.",
      "synergy_partners": "3.0% Activated Charcoal + 0.5% Haridra",
      "reference_url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
    },
    {
      "active": "Cucumber Extract",
      "ingredient": "Cucumber Extract",
      "potency": "0.5%",
      "concentration": "0.5%",
      "classification": "Cucumis sativus Cellular Water",
      "botanical": "Cucumis sativus Cellular Water",
      "inci": "",
      "molecular_markers": "Ascorbic Acid, Caffeic Acid, Lactic Acid & Bio-Silica",
      "extraction_method": "Cold Cellular Press (<25°C)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
      "mechanism": "Instantly cools heat-flushed skin, reduces morning puffiness, and delivers lightweight amino-acid and mineral hydration.",
      "role": "Instantly cools heat-flushed skin, reduces morning puffiness, and delivers lightweight amino-acid and mineral hydration.",
      "synergy_partners": "5.0% Botanical Glycerin + 0.1% Hyaluronic Acid",
      "reference_url": "https://en.wikipedia.org/wiki/Cucumber"
    },
    {
      "active": "Hyaluronic Acid",
      "ingredient": "Hyaluronic Acid",
      "potency": "0.1%",
      "concentration": "0.1%",
      "classification": "Sodium Hyaluronate Polysaccharide",
      "botanical": "Sodium Hyaluronate Polysaccharide",
      "inci": "",
      "molecular_markers": "Poly(beta-glucuronic acid-[1->3]-beta-N-acetylglucosamine)",
      "extraction_method": "Plant-Glucose Bio-Fermentation (100% Vegan)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
      "mechanism": "Biomimetic water-binding humectant that binds up to 1,000x its weight in water, forming a breathable hydration veil during cleansing for a plump, dewy feel.",
      "role": "Biomimetic water-binding humectant that binds up to 1,000x its weight in water, forming a breathable hydration veil during cleansing for a plump, dewy feel.",
      "synergy_partners": "5.0% Botanical Glycerin + 0.1% Niacinamide",
      "reference_url": "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate"
    },
    {
      "active": "Niacinamide (Vitamin B3)",
      "ingredient": "Niacinamide (Vitamin B3)",
      "potency": "0.1%",
      "concentration": "0.1%",
      "classification": "Nicotinamide (Vitamin B3)",
      "botanical": "Nicotinamide (Vitamin B3)",
      "inci": "",
      "molecular_markers": "NAD+ / NADP+ Coenzyme Precursor (C6H6N2O · Purity ≥99.5%)",
      "extraction_method": "Pharmaceutical Grade Synthesis (Zero Nicotinic Acid Flush)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
      "mechanism": "Supports natural epidermal ceramide and free-fatty-acid synthesis, helps regulate excess T-zone sebum, and refines the appearance of enlarged pores.",
      "role": "Supports natural epidermal ceramide and free-fatty-acid synthesis, helps regulate excess T-zone sebum, and refines the appearance of enlarged pores.",
      "synergy_partners": "0.1% Hyaluronic Acid + 0.5% Manjistha",
      "reference_url": "https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide"
    },
    {
      "active": "Perfume & Cleanser Base",
      "ingredient": "Perfume & Cleanser Base",
      "potency": "0.5% / Q.S.",
      "concentration": "0.5% / Q.S.",
      "classification": "pH-Balanced Sulfate-Free Emulsion",
      "botanical": "pH-Balanced Sulfate-Free Emulsion",
      "inci": "",
      "molecular_markers": "Mild Non-Ionic Alkyl Polyglucoside Micelles",
      "extraction_method": "Cold-Compounded Cleanroom Homogenization (<28°C)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
      "mechanism": "Gentle, 100% sulfate-free (0% SLS/SLES) cleansing suspension vehicle that lifts impurities without disrupting intercellular barrier lipids.",
      "role": "Gentle, 100% sulfate-free (0% SLS/SLES) cleansing suspension vehicle that lifts impurities without disrupting intercellular barrier lipids.",
      "synergy_partners": "All 8 Disclosed Actives",
      "reference_url": "https://bhumivera.com/science"
    }
  ],
  "specifications": {
    "Brand_Name": "Bhumivera (The Transparent Maison · Est. 2016 Lineage)",
    "Product_Full_Name": "Bhumivera Activated Charcoal Purifying Luxury Face Wash",
    "SKU_Code": "BV-LUX-CFW-01 (Legacy: BV-CHFW-100ML)",
    "MPN_Code": "BVCFW100ML",
    "GTIN_13_EAN": "8906182600018",
    "GST_HSN_Code": "30049011 (Ayurvedic & Botanical Preparations · 5% GST)",
    "Net_Volume_Metric": "100 ML (3.38 fl. oz.)",
    "Gross_Dispatch_Weight": "215.0 Grams (±0.5g Digital Scale Verified)",
    "Batch_Number": "SCFW26H / BATCH-04/26-CH (250 Units per Micro-Batch)",
    "Calibrated_pH_Range": "pH 5.40 – 5.51 at 25.0°C (Digital Glass Electrode Verified)",
    "Extraction_Temperature": "< 28.0°C (25.8°C Cold-Compounded Sub-Ambient Protocol)",
    "Primary_Purifying_Active": "3.0% Steam-Activated Microporous Bamboo Charcoal (<15 Microns)",
    "Primary_Humectant_Cushion": "5.0% Plant-Derived Botanical Glycerin + 0.1% Hyaluronic Acid",
    "Barrier_Vitamin_CoFactor": "0.1% USP-Grade Niacinamide (Vitamin B3 · Pyridine-3-carboxamide)",
    "Ayurvedic_Phyto_Complex": "0.5% Manjistha + 0.5% Haridra (Turmeric) + 0.5% Neem + 0.5% Cucumber",
    "Total_Disclosed_Actives": "9.7% Active & Functional Botanical/Humectant Concentration + Q.S. Base",
    "Surfactant_Architecture": "100% Sulfate-Free (Decyl Glucoside & Coco-Glucoside Micellar Matrix)",
    "Free_From_Guarantee": "0% SLS, 0% SLES, 0% Parabens, 0% Mineral Oil, 0% Plastic Microbeads",
    "Target_Skin_Profiles": "Oily, Combination, Congested, Blemish-Prone, Normal & Urban-Exposed Skin",
    "Primary_Skin_Concerns": "PM2.5 Urban Soot, Oxidized Sebum, Blackheads, Enlarged Pores & Dullness",
    "Texture_And_Visual_Profile": "Silky Obsidian Micro-Emulsion Gel with Zero Gritty Abrasion",
    "Aromatic_Profile": "Subtle Allergen-Screened Botanical Essence (0.5% IFRA Compliant)",
    "Recommended_Ritual_Timing": "Twice Daily (AM Sebum Balance & PM Deep Urban Pollution Detox · 30–45s)",
    "Shelf_Life_And_PAO": "24 Months from Manufacturing Date (6 Months Period After Opening)",
    "Primary_Vessel_Material": "UV-Protected Apothecary Dispenser Bottle with Tamper-Evident Gold Seal",
    "Microbiological_Purity": "Total Aerobic Microbial Count < 10 CFU/ml (Zero Pathogens)",
    "Heavy_Metals_ICP_MS": "Lead <0.04 ppm · Arsenic <0.01 ppm · Mercury Not Detected (ND)",
    "Patch_Test_Standard": "Mandatory 24-Hour Inner-Forearm Patch Test Prior to First Use",
    "Brand_Flagship_Entity": "Bhumivera Organics India Private Limited (Inc. August 4, 2026 · Asansol, WB)",
    "Parent_Heritage_Entity": "MPG E-Business Private Limited (Inc. Sept 22, 2016 · CIN: U74999WB2016PTC217735)",
    "Licensed_Manufacturing_Unit": "Sitashi Herbal Industry, H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022",
    "Country_Of_Origin": "Proudly Formulated & Manufactured in India (Bharat)"
  },
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
    },
    {
      "name": "Glycerol (Botanical Glycerin)",
      "url": "https://en.wikipedia.org/wiki/Glycerol"
    },
    {
      "name": "Cucumis sativus (Cucumber)",
      "url": "https://en.wikipedia.org/wiki/Cucumber"
    }
  ],
  "conscious_buyer_highlights": [
    "100% Label-Disclosed Potency: Every active percentage (3% Charcoal, 5% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid, 0.1% Niacinamide) is printed openly on the bottle.",
    "Non-Stripping Barrier Care: Cushioning 5% Botanical Glycerin and 0.1% Hyaluronic Acid keep skin soft, hydrated, and comfortable after rinsing without post-wash tightness.",
    "Clean & Conscious Formula: Zero SLS/SLES sulfates, zero parabens, zero mineral oil, and zero synthetic plastic microbeads.",
    "Honest Transparency: Botanical and Ayurvedic-inspired cosmetic formulation by Bhumivera Organics (Est. 2016 MPG lineage); 24-hour inner-forearm patch test recommended before first use."
  ],
  "related_products": [],
  "faqs": [
    {
      "q": "What is the exact ingredient percentage breakdown of Bhumivera Activated Charcoal Face Wash?",
      "a": "Each 100ml bottle features a 100% transparent, label-disclosed formulation: 3% Activated Charcoal, 5% Glycerin, 0.5% Haridra (Turmeric), 0.5% Neem, 0.5% Cucumber Extract, 0.5% Manjistha Extract, 0.1% Hyaluronic Acid, 0.1% Niacinamide, and 0.5% Perfume in a gentle pH-balanced cleansing base (Q.S.)."
    },
    {
      "q": "Does this face wash contain Niacinamide and Hyaluronic Acid?",
      "a": "Yes. Bhumivera Activated Charcoal Purifying Luxury Face Wash contains 0.1% USP-grade Niacinamide (Vitamin B3) and 0.1% Hyaluronic Acid alongside 5.0% Botanical Glycerin—making it an ideal choice if you are searching for a face wash with Niacinamide that purifies pores without drying the skin barrier."
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
      "q": "Will the 3% Activated Charcoal feel gritty or scratch my skin?",
      "a": "No. Our steam-activated bamboo charcoal is jet-milled to an ultra-fine particle size below 15 microns and suspended in a 5% Glycerin gel-emulsion, providing smooth, non-abrasive magnetic adsorption of oil and grime."
    },
    {
      "q": "Which Bhumivera face wash should I choose: 3% Activated Charcoal or 4% Himalayan Sea Buckthorn?",
      "a": "Both share our 5% Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, and 0.5% Cucumber base. Choose Activated Charcoal (₹699) for deep pore detoxification, blackhead care, and excess oil control; choose Himalayan Sea Buckthorn (₹799) for Omega-7 barrier nourishment and glowing radiance—or use Sea Buckthorn in the morning (AM) and Charcoal at night (PM)."
    },
    {
      "q": "How do I verify that my Bhumivera bottle is 100% genuine?",
      "a": "Every bottle carries a tamper-evident neck seal, batch code (SCFW26H), and QR/serial code. Visit https://bhumivera.com/verify to inspect your bottle's calibrated pH 5.48 assay and lab COA."
    },
    {
      "q": "How does Bhumivera Organics ensure ingredient transparency and formulation quality?",
      "a": "Bhumivera Organics is our registered brand and corporate name (Bhumivera Organics India Private Limited, backed by MPG E-Business Private Limited, Est. 2016). Our formulations combine plant-derived Ayurvedic botanicals with proven cosmetic actives and zero SLS/parabens, with every active concentration printed transparently on the label."
    },
    {
      "q": "Can men and women both use Bhumivera Activated Charcoal Face Wash?",
      "a": "Yes, it is a unisex formulation engineered for all adult skin profiles exposed to urban pollution, sweat, sunscreen, and excess T-zone sebum."
    },
    {
      "q": "What is the pH level of Bhumivera Activated Charcoal Face Wash?",
      "a": "It is calibrated to pH 5.4 – 5.5, matching the natural acidic mantle of healthy human facial skin."
    }
  ]
};

export const SEABUCKTHORN_FACE_WASH_EXACT = {
  "id": 2,
  "name": "Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash",
  "slug": "himalayan-seabuckthorn-luxury-face-wash",
  "rating": 4.74,
  "review_count": 290,
  "reviews": 290,
  "sku": "BV-LUX-SBFW-02",
  "mpn": "BVSBFW100ML",
  "net_volume": "100 ML",
  "price": 799.0,
  "mrp": 999.0,
  "stock": 250,
  "category": "Luxury Facial Cleansers",
  "ph_level": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
  "active_ingredients": "Sea Buckthorn (4%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)",
  "image_url": "/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp",
  "seo_title": "Bhumivera Himalayan Sea Buckthorn Luxury Face Wash (100ml) | 4% Sea Buckthorn, 5% Glycerin, Hyaluronic Acid, Niacinamide & Manjistha Brightening Cleanser",
  "meta_description": "Discover Bhumivera Himalayan Sea Buckthorn Face Wash (100ml): formulated for conscious skincare buyers with 4% Sea Buckthorn (Omega-7 & Vitamin C), 5% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.1% Hyaluronic Acid & 0.1% Niacinamide.",
  "short_description": "Brightening botanical luxury face wash crafted for skin-conscious buyers. Formulated per 100ml with a label-disclosed 4% Himalayan Sea Buckthorn extract, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid & 0.1% Niacinamide.",
  "full_description": "<article class=\"bhumivera-monograph space-y-6\">\n  <h3>Golden Himalayan Botanical Nutrition: 4% Cold-Pressed Sea Buckthorn, 5% Glycerin, Hyaluronic Acid & Niacinamide</h3>\n  <p><strong>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · SKU: BV-LUX-SBFW-02)</strong> is a flagship formulation from <a href=\"https://bhumivera.com\"><strong>Bhumivera — The Transparent Maison</strong></a> (<a href=\"https://bhumivera.com/about\">Bhumivera Organics India Private Limited</a>, incorporated August 4, 2026 under Founder <strong>Akash Prasad</strong> and Directors <strong>Akash Prasad, Payal Prasad &amp; Aman Prasad</strong>), rooted in the 10-year herbal manufacturing and household distribution heritage of <a href=\"https://bhumivera.com/mpgebusiness\"><strong>MPG E-Business Private Limited</strong></a> (established September 22, 2016 in Asansol, West Bengal · CIN: <code>U74999WB2016PTC217735</code> · Founder: <strong>Dilip Prasad Nonia</strong>). Engineered under <em>The Bhumivera Transparency Standard (Est. 2016 lineage)</em>, this formulation prints 100% of its functional active concentrations openly on the physical bottle label: <strong>Sea Buckthorn (4%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)</strong>, calibrated to <strong>pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)</strong>.</p>\n  <p>High in the cold desert valleys of Ladakh and Lahaul-Spiti at altitudes between 3,200 and 4,100 meters, the wild Himalayan Sea Buckthorn shrub (Hippophae rhamnoides L.) thrives under sub-zero frost, arid winds, and intense alpine ultraviolet radiation. To protect its cellular DNA against these extreme environmental stressors, the bright orange berry bio-accumulates over 190 bioactive phytonutrients—including rare Omega-7 (palmitoleic acid, a fatty acid naturally present in young human skin lipids), Omega-3, 6, and 9 fatty acids, beta-carotene, lycopene, zeaxanthin, superoxide dismutase (SOD), tocopherols (Vitamin E), and high-potency Vitamin C.</p><p>While conventional brightening face washes use less than 0.05% heat-degraded berry extract for label marketing, the Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash is formulated per 100ml with a full, label-disclosed 4.0% concentration of sub-28°C cold-pressed Sea Buckthorn extract, paired with 5.0% Botanical Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract.</p>\n\n  <h3>I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters</h3>\n  <p>Why does sub-28°C cold-pressing matter so profoundly for Sea Buckthorn? Palmitoleic acid (Omega-7), trans-beta-carotene, and L-ascorbic acid are thermally labile molecules; when subjected to standard 85°C industrial steam extraction, their double bonds oxidize rapidly, destroying their antioxidant capacity and turning the extract dull brown. At Bhumivera, post-frost Sea Buckthorn berries harvested from Ladakh cooperative lots are cold-pressed below 28°C (verified at 26.4°C in Batch #SFW26H), preserving the vibrant saffron-amber carotenoid matrix intact.</p><p>When you massage this 4.0% Sea Buckthorn emulsion over damp facial skin, its biocompatible Omega-7 lipids cushion the stratum corneum against surfactant disruption, while 5.0% Botanical Glycerin and 0.1% Sodium Hyaluronate bind water molecules directly to the outer corneocytes. Simultaneously, 0.1% USP-grade Niacinamide (calibrated at pH 5.3–5.5 so it never hydrolyzes into flushing nicotinic acid) supports endogenous ceramide synthesis and refines pore appearance.</p>\n  <p>For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque <code>&ldquo;Aqua / Base Q.S.&rdquo;</code> disclosure on the back—where high-value botanicals like <a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Himalayan Sea Buckthorn</a>, <a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Manjistha (Rubia cordifolia)</a>, <a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Haridra (Curcuma longa)</a>, <a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reetha (Sapindus mukorossi)</a>, and <a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Sacred Tulsi (Ocimum tenuiflorum)</a> are dusted in at trace levels below 0.01% and boiled at 80°C–100°C. <a href=\"https://bhumivera.com/science\">Bhumivera’s Sub-28°C Formulation Lab</a> eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Niacinamide Vitamin B3</a>, <a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Multi-Molecular Hyaluronic Acid</a>, and Plant-Derived Glycerin) at full, verifiable label potencies.</p>\n\n  <h4>Complete Active Ingredient &amp; Phytochemical Monograph Table (100 ML)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Disclosed Active &amp; INCI</th>\n          <th>Label Potency</th>\n          <th>Botanical / Chemical Class &amp; Reference</th>\n          <th>Extraction &amp; Harvest Corridor</th>\n          <th>Dermal / Trichological / Cellular Mechanism</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Himalayan Sea Buckthorn</strong><br/><small>Hippophae rhamnoides Fruit & Seed Extract</small></td>\n          <td><strong>4.0%</strong></td>\n          <td>Hippophae rhamnoides (High-Altitude Super-Berry) (<a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Cellular Press (26.4°C Verified) · <a href=\"/provenance-engine\">REG-01 · Leh-Ladakh & Spiti Valley (3,400m Altitude)</a></td>\n          <td>Rich in rare Omega-7 (Palmitoleic acid), Omega 3, 6, 9, and natural Vitamin C carotenoids to replenish barrier lipids, combat photo-oxidative dullness, and enhance cellular radiance.</td>\n        </tr><tr>\n          <td><strong>Botanical Glycerin</strong><br/><small>Glycerin (USP Plant-Derived Humectant)</small></td>\n          <td><strong>5.0%</strong></td>\n          <td>Plant-Derived Humectant Cushion (<a href=\"https://en.wikipedia.org/wiki/Glycerol\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold-Filtered Vegetable Lipid Hydrolysis · <a href=\"/provenance-engine\">REG-06 · Indian Plant-Oil Fractionation Cleanroom</a></td>\n          <td>Helps retain surface moisture during and after rinsing, preventing transepidermal water loss (TEWL) and leaving a supple, dewy glass-skin finish.</td>\n        </tr><tr>\n          <td><strong>Manjistha Extract</strong><br/><small>Rubia cordifolia Root Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Rubia cordifolia (Ayurvedic Varnya Root) (<a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Root Maceration · <a href=\"/provenance-engine\">REG-05 · Vindhya & Central Indian Forest Belts</a></td>\n          <td>Traditional Ayurvedic botanical that helps visibly improve uneven skin tone, sun-induced tan, and post-blemish marks.</td>\n        </tr><tr>\n          <td><strong>Haridra (Wild Turmeric)</strong><br/><small>Curcuma longa Rhizome Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Curcuma longa Antioxidant Rhizome (<a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Rhizome Extraction · <a href=\"/provenance-engine\">REG-05 · Nilgiri & Eastern India Organic Farms</a></td>\n          <td>Supports natural skin luminosity, calms visible redness, and defends against everyday environmental oxidative stress.</td>\n        </tr><tr>\n          <td><strong>Neem Extract</strong><br/><small>Azadirachta indica Leaf Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Azadirachta indica Clarifying Leaf (<a href=\"https://en.wikipedia.org/wiki/Azadirachta_indica\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Leaf Infusion · <a href=\"/provenance-engine\">REG-05 · Central & Eastern India Botanical Cooperatives</a></td>\n          <td>Purifies pores gently and helps maintain a clean, balanced, blemish-free complexion.</td>\n        </tr><tr>\n          <td><strong>Cucumber Extract</strong><br/><small>Cucumis sativus Fruit Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Cucumis sativus Soothing Agent (<a href=\"https://en.wikipedia.org/wiki/Cucumber\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold Cellular Press (<25°C) · <a href=\"/provenance-engine\">REG-06 · Eastern India Agrarian Clusters</a></td>\n          <td>Soothes heat-stressed skin, reduces morning puffiness, and refreshes tired complexions.</td>\n        </tr><tr>\n          <td><strong>Hyaluronic Acid</strong><br/><small>Sodium Hyaluronate (Bio-Fermented)</small></td>\n          <td><strong>0.1%</strong></td>\n          <td>Sodium Hyaluronate Humectant (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Plant-Glucose Bio-Fermentation · <a href=\"/provenance-engine\">Analytical Cleanroom Bio-Fermentation</a></td>\n          <td>Hydrates the outer epidermal layers during washing for an instant smooth, plumped, cushiony appearance.</td>\n        </tr><tr>\n          <td><strong>Niacinamide (Vitamin B3)</strong><br/><small>Niacinamide (USP Cosmetic Grade)</small></td>\n          <td><strong>0.1%</strong></td>\n          <td>Nicotinamide Lipid Barrier Co-Factor (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Analytical Synthesis (Calibrated at pH 5.4 for Zero Flush) · <a href=\"/provenance-engine\">USP/EP Certified Analytical Synthesis</a></td>\n          <td>Supports natural barrier ceramides, balances uneven tone, and refines overall pore and skin texture.</td>\n        </tr><tr>\n          <td><strong>Perfume & Cleanser Base</strong><br/><small>Aqua, Decyl Glucoside, Coco-Glucoside, Mild Botanical Emulsion</small></td>\n          <td><strong>0.5% / Q.S.</strong></td>\n          <td>pH-Balanced Sulfate-Free Emulsion (<a href=\"https://bhumivera.com/science\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cleanroom Emulsification · <a href=\"/provenance-engine\">REG-06 · GMP Formulation Cleanroom</a></td>\n          <td>Silk-textured, non-stripping botanical cleansing matrix free from SLS/SLES sulfates and parabens.</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3>II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated))</h3>\n  <p>To amplify cellular radiance across Indian skin tones prone to sun-tanning and post-inflammatory hyperpigmentation, our chemists united the 4.0% Himalayan Sea Buckthorn core with 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). Manjistha and Haridra work synergistically with Sea Buckthorn's carotenoids and Niacinamide to visibly brighten dullness and soften the look of dark spots, while Neem and Cucumber keep pores clarified, cool, and calm.</p><p>Whether you found Bhumivera by searching for 'bhumivera seabuckthorn face wash', 'sea buckthorn face wash India', or 'facewash with niacinamide and hyaluronic acid', this 10.7% total-active formulation delivers complete milligram and percentage transparency.</p>\n  <p>Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically <em>beta-glucocerebrosidase</em> and <em>acidic sphingomyelinase</em>—require an acidic microenvironment between <strong>pH 4.7 and 5.75</strong> to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating <strong>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash</strong> to <strong>pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)</strong> and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our <a href=\"/verify\">Bottle Serial &amp; COA Verification Portal</a> and <a href=\"/somatic-registry\">Somatic INCI Label Registry</a>), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it.</p>\n\n  <h3>III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule</h3>\n  <p>Designed as your daily AM antioxidant shield and PM radiance reset, this soap-free, 100% sulfate-free cleanser transforms with water into a velvety, lipid-rich lather that lifts sunscreen, sweat, and surface impurities while leaving a luminous, dewy glass-skin finish.</p>\n  <ul>\n    <li><strong>Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):</strong> Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer.</li>\n    <li><strong>Step 2 — Measured Dispensing &amp; Palmar Emulsification:</strong> Dispense the recommended dose of <strong>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash</strong> into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp.</li>\n    <li><strong>Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:</strong> Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives (<strong>Sea Buckthorn (4%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)</strong>) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates.</li>\n    <li><strong>Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:</strong> Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary <a href=\"/shop\">Bhumivera Inside-Out Ritual</a> formulations.</li>\n    <li><strong>Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:</strong> Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility (<a href=\"/lab\">read our full Cleanroom &amp; Patch-Test Protocol</a>).</li>\n  </ul>\n\n  <h3>IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter)</h3>\n  <p>In dry winters, high-altitude travel, or air-conditioned indoor environments, 4.0% Sea Buckthorn and 5.0% Glycerin prevent dry patches and flaking. In bright summer sun and monsoon humidity, its Vitamin C carotenoids, Manjistha, Haridra, and Niacinamide help defend against photo-dullness and uneven skin tone without feeling heavy or greasy.</p>\n  <p>Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum. <strong>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash</strong> is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration.</p>\n\n  <h3>V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem</h3>\n  <p>Every formulation in the <a href=\"/shop\">Bhumivera 6-Product Flagship Catalog</a> is engineered to work as part of an interconnected, inside-out botanical system. Explore how <strong>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash</strong> pairs with our companion formulations:</p>\n  <ul>\n    <li><strong>1. <a href=\"/product/activated-charcoal-luxury-face-wash\">Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699)</a>:</strong> Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification.</li>\n    <li><strong>2. <a href=\"/product/himalayan-seabuckthorn-luxury-face-wash\">Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799)</a>:</strong> Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity.</li>\n    <li><strong>3. <a href=\"/product/luxury-2-in-1-botanical-shampoo-conditioner\">Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899)</a>:</strong> Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing.</li>\n    <li><strong>4. <a href=\"/product/artisanal-charcoal-handmade-soap\">Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399)</a>:</strong> Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification.</li>\n    <li><strong>5. <a href=\"/product/artisanal-aloe-vera-handmade-soap\">Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349)</a>:</strong> Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care.</li>\n    <li><strong>6. <a href=\"/product/kalpvriksh-satva-tulsi-7-tulsi-extract\">Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499)</a>:</strong> Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality.</li>\n  </ul>\n  <p>You can also acquire coordinated sets in our <a href=\"/combo/bundle-daily-regimen\">Grand Maison 4-Piece Daily Apothecary Bundle</a>, <a href=\"/combo/bundle-royal-crown-trio\">Royal Skin &amp; Scalp Stewardship Trio</a>, <a href=\"/combo/bundle-inside-out-ritual\">Inside-Out Skin-Clearing &amp; Cortisol Ritual</a>, or the collector’s <a href=\"/combo/bundle-grand-maison-vault\">Grand Maison 6-Piece Apothecary Vault</a>, or compare any two formulations side-by-side on our <a href=\"/compare\">Interactive Formulation Comparison Tool</a>.</p>\n\n  <h3>VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact</h3>\n  <p>Every 100ml bottle of Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (Batch #SFW26H · Sample COA Serial: BHMV-2610-SB083) is traceable to Ladakh Nubra Valley Cooperative Lot #LDK-SB-2026 and verified for pH 5.42 calibration, <10 CFU/ml microbial purity, and non-detected mercury/heavy-metal safety.</p>\n  <p>Every unit of <strong>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash</strong> is traceable through our <a href=\"/provenance-engine\">6-Corridor Indian Botanical Provenance Engine</a> and protected by <a href=\"/purchase-protection\">Bhumivera White-Glove Purchase Protection</a>. To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard (<a href=\"/legal/shipping-hygiene\">Part II of the Bhumivera Legal Suite</a>) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch (<a href=\"/order-tracking\">track live AWB &amp; dispatch weight logs</a>). Furthermore, every order supports our verifiable community initiatives documented on the <a href=\"/impact\">Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact)</a>—including <a href=\"/impact/stray-animal-care\">The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative</a> and <a href=\"/impact/elderly-disabled-rations\">The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative</a> in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors (<a href=\"/impact/damodar-cleanup\">Damodar Riverbank Vetiver Cleanup</a>, <a href=\"/impact/jute-sapling-nursery\">Biodegradable Jute Sapling Nursery</a>, <a href=\"/impact/village-pukur-revival\">Village Pukur Pond Revival</a>, <a href=\"/impact/herbal-kitchen-gardens\">Medicinal Herbal Kitchen Gardens</a>, <a href=\"/impact/mandi-vermicomposting\">Mandi Waste Vermicomposting</a>, and <a href=\"/impact/coal-belt-microgrove\">Coal-Belt Native Micro-Grove</a>).</p>\n\n  <h4>Technical &amp; Regulatory Specification Summary (BV-LUX-SBFW-02)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Specification Parameter</th>\n          <th>Verified Bhumivera Standard</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Brand Name</strong></td>\n          <td>Bhumivera (The Transparent Maison · Est. 2016 Lineage)</td>\n        </tr><tr>\n          <td><strong>Product Full Name</strong></td>\n          <td>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash</td>\n        </tr><tr>\n          <td><strong>SKU Code</strong></td>\n          <td>BV-LUX-SBFW-02 (Legacy: BV-SBFW-100ML)</td>\n        </tr><tr>\n          <td><strong>MPN Code</strong></td>\n          <td>BVSBFW100ML</td>\n        </tr><tr>\n          <td><strong>GTIN 13 EAN</strong></td>\n          <td>8906182600025</td>\n        </tr><tr>\n          <td><strong>GST HSN Code</strong></td>\n          <td>30049011 (Ayurvedic & Botanical Preparations · 5% GST)</td>\n        </tr><tr>\n          <td><strong>Net Volume Metric</strong></td>\n          <td>100 ML (3.38 fl. oz.)</td>\n        </tr><tr>\n          <td><strong>Gross Dispatch Weight</strong></td>\n          <td>214.5 Grams (±0.5g Digital Scale Verified)</td>\n        </tr><tr>\n          <td><strong>Batch Number</strong></td>\n          <td>SFW26H / BATCH-04/26-SB (250 Units per Micro-Batch)</td>\n        </tr><tr>\n          <td><strong>Calibrated pH Range</strong></td>\n          <td>pH 5.30 – 5.50 at 25.0°C (5.42 pH Digital Electrode Verified)</td>\n        </tr><tr>\n          <td><strong>Extraction Temperature</strong></td>\n          <td>< 28.0°C (26.4°C Cold-Pressed Ladakh Berry Protocol)</td>\n        </tr><tr>\n          <td><strong>Primary Radiance Active</strong></td>\n          <td>4.0% Himalayan Sea Buckthorn (Hippophae rhamnoides · Omega-7 & Vitamin C)</td>\n        </tr><tr>\n          <td><strong>Primary Humectant Cushion</strong></td>\n          <td>5.0% Botanical Glycerin + 0.1% Multi-Molecular Hyaluronic Acid</td>\n        </tr><tr>\n          <td><strong>Barrier Vitamin CoFactor</strong></td>\n          <td>0.1% USP-Grade Niacinamide (Vitamin B3 · Ceramide & Pore Support)</td>\n        </tr><tr>\n          <td><strong>Ayurvedic Phyto Complex</strong></td>\n          <td>0.5% Manjistha + 0.5% Haridra (Turmeric) + 0.5% Neem + 0.5% Cucumber</td>\n        </tr><tr>\n          <td><strong>Total Disclosed Actives</strong></td>\n          <td>10.7% Active & Functional Botanical/Humectant Concentration + Q.S. Base</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</article>",
  "description": "Golden Himalayan Botanical Nutrition: 4% Cold-Pressed Sea Buckthorn, 5% Glycerin, Hyaluronic Acid & Niacinamide \n    Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · SKU: BV-LUX-SBFW-02)  is a flagship formulation from   Bhumivera — The Transparent Maison   ( Bhumivera Organics India Private Limited , incorporated August 4, 2026 under Founder  Akash Prasad  and Directors  Akash Prasad, Payal Prasad &amp; Aman Prasad ), rooted in the 10-year herbal manufacturing and household distribution heritage of   MPG E-Business Private Limited   (established September 22, 2016 in Asansol, West Bengal · CIN:  U74999WB2016PTC217735  · Founder:  Dilip Prasad Nonia ). Engineered under  The Bhumivera Transparency Standard (Est. 2016 lineage) , this formulation prints 100% of its functional active concentrations openly on the physical bottle label:  Sea Buckthorn (4%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.) , calibrated to  pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated) . \n   High in the cold desert valleys of Ladakh and Lahaul-Spiti at altitudes between 3,200 and 4,100 meters, the wild Himalayan Sea Buckthorn shrub (Hippophae rhamnoides L.) thrives under sub-zero frost, arid winds, and intense alpine ultraviolet radiation. To protect its cellular DNA against these extreme environmental stressors, the bright orange berry bio-accumulates over 190 bioactive phytonutrients—including rare Omega-7 (palmitoleic acid, a fatty acid naturally present in young human skin lipids), Omega-3, 6, and 9 fatty acids, beta-carotene, lycopene, zeaxanthin, superoxide dismutase (SOD), tocopherols (Vitamin E), and high-potency Vitamin C.  While conventional brightening face washes use less than 0.05% heat-degraded berry extract for label marketing, the Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash is formulated per 100ml with a full, label-disclosed 4.0% concentration of sub-28°C cold-pressed Sea Buckthorn extract, paired with 5.0% Botanical Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract. \n\n   I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters \n   Why does sub-28°C cold-pressing matter so profoundly for Sea Buckthorn? Palmitoleic acid (Omega-7), trans-beta-carotene, and L-ascorbic acid are thermally labile molecules; when subjected to standard 85°C industrial steam extraction, their double bonds oxidize rapidly, destroying their antioxidant capacity and turning the extract dull brown. At Bhumivera, post-frost Sea Buckthorn berries harvested from Ladakh cooperative lots are cold-pressed below 28°C (verified at 26.4°C in Batch #SFW26H), preserving the vibrant saffron-amber carotenoid matrix intact.  When you massage this 4.0% Sea Buckthorn emulsion over damp facial skin, its biocompatible Omega-7 lipids cushion the stratum corneum against surfactant disruption, while 5.0% Botanical Glycerin and 0.1% Sodium Hyaluronate bind water molecules directly to the outer corneocytes. Simultaneously, 0.1% USP-grade Niacinamide (calibrated at pH 5.3–5.5 so it never hydrolyzes into flushing nicotinic acid) supports endogenous ceramide synthesis and refines pore appearance. \n   For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque  &ldquo;Aqua / Base Q.S.&rdquo;  disclosure on the back—where high-value botanicals like  Himalayan Sea Buckthorn ,  Manjistha (Rubia cordifolia) ,  Haridra (Curcuma longa) ,  Reetha (Sapindus mukorossi) , and  Sacred Tulsi (Ocimum tenuiflorum)  are dusted in at trace levels below 0.01% and boiled at 80°C–100°C.  Bhumivera’s Sub-28°C Formulation Lab  eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants ( Niacinamide Vitamin B3 ,  Multi-Molecular Hyaluronic Acid , and Plant-Derived Glycerin) at full, verifiable label potencies. \n\n   Complete Active Ingredient &amp; Phytochemical Monograph Table (100 ML) \n   \n     \n       \n         \n           Disclosed Active &amp; INCI \n           Label Potency \n           Botanical / Chemical Class &amp; Reference \n           Extraction &amp; Harvest Corridor \n           Dermal / Trichological / Cellular Mechanism \n         \n       \n       \n         \n            Himalayan Sea Buckthorn   Hippophae rhamnoides Fruit & Seed Extract  \n            4.0%  \n           Hippophae rhamnoides (High-Altitude Super-Berry) ( Reference ↗ ) \n           Sub-28°C Cold Cellular Press (26.4°C Verified) ·  REG-01 · Leh-Ladakh & Spiti Valley (3,400m Altitude)  \n           Rich in rare Omega-7 (Palmitoleic acid), Omega 3, 6, 9, and natural Vitamin C carotenoids to replenish barrier lipids, combat photo-oxidative dullness, and enhance cellular radiance. \n          \n            Botanical Glycerin   Glycerin (USP Plant-Derived Humectant)  \n            5.0%  \n           Plant-Derived Humectant Cushion ( Reference ↗ ) \n           Cold-Filtered Vegetable Lipid Hydrolysis ·  REG-06 · Indian Plant-Oil Fractionation Cleanroom  \n           Helps retain surface moisture during and after rinsing, preventing transepidermal water loss (TEWL) and leaving a supple, dewy glass-skin finish. \n          \n            Manjistha Extract   Rubia cordifolia Root Extract  \n            0.5%  \n           Rubia cordifolia (Ayurvedic Varnya Root) ( Reference ↗ ) \n           Sub-28°C Cold Root Maceration ·  REG-05 · Vindhya & Central Indian Forest Belts  \n           Traditional Ayurvedic botanical that helps visibly improve uneven skin tone, sun-induced tan, and post-blemish marks. \n          \n            Haridra (Wild Turmeric)   Curcuma longa Rhizome Extract  \n            0.5%  \n           Curcuma longa Antioxidant Rhizome ( Reference ↗ ) \n           Sub-28°C Cold Rhizome Extraction ·  REG-05 · Nilgiri & Eastern India Organic Farms  \n           Supports natural skin luminosity, calms visible redness, and defends against everyday environmental oxidative stress. \n          \n            Neem Extract   Azadirachta indica Leaf Extract  \n            0.5%  \n           Azadirachta indica Clarifying Leaf ( Reference ↗ ) \n           Sub-28°C Cold Leaf Infusion ·  REG-05 · Central & Eastern India Botanical Cooperatives  \n           Purifies pores gently and helps maintain a clean, balanced, blemish-free complexion. \n          \n            Cucumber Extract   Cucumis sativus Fruit Extract  \n            0.5%  \n           Cucumis sativus Soothing Agent ( Reference ↗ ) \n           Cold Cellular Press ( REG-06 · Eastern India Agrarian Clusters  \n           Soothes heat-stressed skin, reduces morning puffiness, and refreshes tired complexions. \n          \n            Hyaluronic Acid   Sodium Hyaluronate (Bio-Fermented)  \n            0.1%  \n           Sodium Hyaluronate Humectant ( Reference ↗ ) \n           Plant-Glucose Bio-Fermentation ·  Analytical Cleanroom Bio-Fermentation  \n           Hydrates the outer epidermal layers during washing for an instant smooth, plumped, cushiony appearance. \n          \n            Niacinamide (Vitamin B3)   Niacinamide (USP Cosmetic Grade)  \n            0.1%  \n           Nicotinamide Lipid Barrier Co-Factor ( Reference ↗ ) \n           Analytical Synthesis (Calibrated at pH 5.4 for Zero Flush) ·  USP/EP Certified Analytical Synthesis  \n           Supports natural barrier ceramides, balances uneven tone, and refines overall pore and skin texture. \n          \n            Perfume & Cleanser Base   Aqua, Decyl Glucoside, Coco-Glucoside, Mild Botanical Emulsion  \n            0.5% / Q.S.  \n           pH-Balanced Sulfate-Free Emulsion ( Reference ↗ ) \n           Sub-28°C Cleanroom Emulsification ·  REG-06 · GMP Formulation Cleanroom  \n           Silk-textured, non-stripping botanical cleansing matrix free from SLS/SLES sulfates and parabens. \n         \n       \n     \n   \n\n   II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)) \n   To amplify cellular radiance across Indian skin tones prone to sun-tanning and post-inflammatory hyperpigmentation, our chemists united the 4.0% Himalayan Sea Buckthorn core with 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). Manjistha and Haridra work synergistically with Sea Buckthorn's carotenoids and Niacinamide to visibly brighten dullness and soften the look of dark spots, while Neem and Cucumber keep pores clarified, cool, and calm.  Whether you found Bhumivera by searching for 'bhumivera seabuckthorn face wash', 'sea buckthorn face wash India', or 'facewash with niacinamide and hyaluronic acid', this 10.7% total-active formulation delivers complete milligram and percentage transparency. \n   Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically  beta-glucocerebrosidase  and  acidic sphingomyelinase —require an acidic microenvironment between  pH 4.7 and 5.75  to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash  to  pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)  and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our  Bottle Serial &amp; COA Verification Portal  and  Somatic INCI Label Registry ), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it. \n\n   III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule \n   Designed as your daily AM antioxidant shield and PM radiance reset, this soap-free, 100% sulfate-free cleanser transforms with water into a velvety, lipid-rich lather that lifts sunscreen, sweat, and surface impurities while leaving a luminous, dewy glass-skin finish. \n   \n      Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):  Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer. \n      Step 2 — Measured Dispensing &amp; Palmar Emulsification:  Dispense the recommended dose of  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash  into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp. \n      Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:  Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives ( Sea Buckthorn (4%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.) ) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates. \n      Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:  Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary  Bhumivera Inside-Out Ritual  formulations. \n      Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:  Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility ( read our full Cleanroom &amp; Patch-Test Protocol ). \n   \n\n   IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter) \n   In dry winters, high-altitude travel, or air-conditioned indoor environments, 4.0% Sea Buckthorn and 5.0% Glycerin prevent dry patches and flaking. In bright summer sun and monsoon humidity, its Vitamin C carotenoids, Manjistha, Haridra, and Niacinamide help defend against photo-dullness and uneven skin tone without feeling heavy or greasy. \n   Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash  is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration. \n\n   V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem \n   Every formulation in the  Bhumivera 6-Product Flagship Catalog  is engineered to work as part of an interconnected, inside-out botanical system. Explore how  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash  pairs with our companion formulations: \n   \n      1.  Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699) :  Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification. \n      2.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799) :  Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity. \n      3.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899) :  Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing. \n      4.  Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399) :  Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification. \n      5.  Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349) :  Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care. \n      6.  Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499) :  Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality. \n   \n   You can also acquire coordinated sets in our  Grand Maison 4-Piece Daily Apothecary Bundle ,  Royal Skin &amp; Scalp Stewardship Trio ,  Inside-Out Skin-Clearing &amp; Cortisol Ritual , or the collector’s  Grand Maison 6-Piece Apothecary Vault , or compare any two formulations side-by-side on our  Interactive Formulation Comparison Tool . \n\n   VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact \n   Every 100ml bottle of Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (Batch #SFW26H · Sample COA Serial: BHMV-2610-SB083) is traceable to Ladakh Nubra Valley Cooperative Lot #LDK-SB-2026 and verified for pH 5.42 calibration,  \n   Every unit of  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash  is traceable through our  6-Corridor Indian Botanical Provenance Engine  and protected by  Bhumivera White-Glove Purchase Protection . To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard ( Part II of the Bhumivera Legal Suite ) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch ( track live AWB &amp; dispatch weight logs ). Furthermore, every order supports our verifiable community initiatives documented on the  Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact) —including  The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative  and  The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative  in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors ( Damodar Riverbank Vetiver Cleanup ,  Biodegradable Jute Sapling Nursery ,  Village Pukur Pond Revival ,  Medicinal Herbal Kitchen Gardens ,  Mandi Waste Vermicomposting , and  Coal-Belt Native Micro-Grove ). \n\n   Technical &amp; Regulatory Specification Summary (BV-LUX-SBFW-02) \n   \n     \n       \n         \n           Specification Parameter \n           Verified Bhumivera Standard \n         \n       \n       \n         \n            Brand Name  \n           Bhumivera (The Transparent Maison · Est. 2016 Lineage) \n          \n            Product Full Name  \n           Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash \n          \n            SKU Code  \n           BV-LUX-SBFW-02 (Legacy: BV-SBFW-100ML) \n          \n            MPN Code  \n           BVSBFW100ML \n          \n            GTIN 13 EAN  \n           8906182600025 \n          \n            GST HSN Code  \n           30049011 (Ayurvedic & Botanical Preparations · 5% GST) \n          \n            Net Volume Metric  \n           100 ML (3.38 fl. oz.) \n          \n            Gross Dispatch Weight  \n           214.5 Grams (±0.5g Digital Scale Verified) \n          \n            Batch Number  \n           SFW26H / BATCH-04/26-SB (250 Units per Micro-Batch) \n          \n            Calibrated pH Range  \n           pH 5.30 – 5.50 at 25.0°C (5.42 pH Digital Electrode Verified) \n          \n            Extraction Temperature  \n            \n          \n            Primary Radiance Active  \n           4.0% Himalayan Sea Buckthorn (Hippophae rhamnoides · Omega-7 & Vitamin C) \n          \n            Primary Humectant Cushion  \n           5.0% Botanical Glycerin + 0.1% Multi-Molecular Hyaluronic Acid \n          \n            Barrier Vitamin CoFactor  \n           0.1% USP-Grade Niacinamide (Vitamin B3 · Ceramide & Pore Support) \n          \n            Ayurvedic Phyto Complex  \n           0.5% Manjistha + 0.5% Haridra (Turmeric) + 0.5% Neem + 0.5% Cucumber \n          \n            Total Disclosed Actives  \n           10.7% Active & Functional Botanical/Humectant Concentration + Q.S. Base",
  "editorial_heading": "Golden Himalayan Botanical Nutrition: 4% Cold-Pressed Sea Buckthorn, 5% Glycerin, Hyaluronic Acid & Niacinamide",
  "editorial_paragraphs": [
    "High in the cold desert valleys of Ladakh and Lahaul-Spiti at altitudes between 3,200 and 4,100 meters, the wild Himalayan Sea Buckthorn shrub (Hippophae rhamnoides L.) thrives under sub-zero frost, arid winds, and intense alpine ultraviolet radiation. To protect its cellular DNA against these extreme environmental stressors, the bright orange berry bio-accumulates over 190 bioactive phytonutrients—including rare Omega-7 (palmitoleic acid, a fatty acid naturally present in young human skin lipids), Omega-3, 6, and 9 fatty acids, beta-carotene, lycopene, zeaxanthin, superoxide dismutase (SOD), tocopherols (Vitamin E), and high-potency Vitamin C.",
    "While conventional brightening face washes use less than 0.05% heat-degraded berry extract for label marketing, the Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash is formulated per 100ml with a full, label-disclosed 4.0% concentration of sub-28°C cold-pressed Sea Buckthorn extract, paired with 5.0% Botanical Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract.",
    "Why does sub-28°C cold-pressing matter so profoundly for Sea Buckthorn? Palmitoleic acid (Omega-7), trans-beta-carotene, and L-ascorbic acid are thermally labile molecules; when subjected to standard 85°C industrial steam extraction, their double bonds oxidize rapidly, destroying their antioxidant capacity and turning the extract dull brown. At Bhumivera, post-frost Sea Buckthorn berries harvested from Ladakh cooperative lots are cold-pressed below 28°C (verified at 26.4°C in Batch #SFW26H), preserving the vibrant saffron-amber carotenoid matrix intact.",
    "When you massage this 4.0% Sea Buckthorn emulsion over damp facial skin, its biocompatible Omega-7 lipids cushion the stratum corneum against surfactant disruption, while 5.0% Botanical Glycerin and 0.1% Sodium Hyaluronate bind water molecules directly to the outer corneocytes. Simultaneously, 0.1% USP-grade Niacinamide (calibrated at pH 5.3–5.5 so it never hydrolyzes into flushing nicotinic acid) supports endogenous ceramide synthesis and refines pore appearance.",
    "To amplify cellular radiance across Indian skin tones prone to sun-tanning and post-inflammatory hyperpigmentation, our chemists united the 4.0% Himalayan Sea Buckthorn core with 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). Manjistha and Haridra work synergistically with Sea Buckthorn's carotenoids and Niacinamide to visibly brighten dullness and soften the look of dark spots, while Neem and Cucumber keep pores clarified, cool, and calm.",
    "Whether you found Bhumivera by searching for 'bhumivera seabuckthorn face wash', 'sea buckthorn face wash India', or 'facewash with niacinamide and hyaluronic acid', this 10.7% total-active formulation delivers complete milligram and percentage transparency."
  ],
  "composition_table": [
    {
      "active": "Himalayan Sea Buckthorn",
      "ingredient": "Himalayan Sea Buckthorn",
      "potency": "4.0%",
      "concentration": "4.0%",
      "classification": "Hippophae rhamnoides (High-Altitude Super-Berry)",
      "botanical": "Hippophae rhamnoides (High-Altitude Super-Berry)",
      "inci": "",
      "molecular_markers": "Omega-7 (Palmitoleic Acid), Omega-3/6/9, Beta-Carotene, Lycopene, Vitamin C & Tocopherols",
      "extraction_method": "Sub-28°C Cold Cellular Press (26.4°C Verified)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
      "mechanism": "Rich in rare Omega-7 (Palmitoleic acid), Omega 3, 6, 9, and natural Vitamin C carotenoids to replenish barrier lipids, combat photo-oxidative dullness, and enhance cellular radiance.",
      "role": "Rich in rare Omega-7 (Palmitoleic acid), Omega 3, 6, 9, and natural Vitamin C carotenoids to replenish barrier lipids, combat photo-oxidative dullness, and enhance cellular radiance.",
      "synergy_partners": "0.1% Niacinamide + 0.5% Manjistha + 5.0% Glycerin",
      "reference_url": "https://en.wikipedia.org/wiki/Hippophae_rhamnoides"
    },
    {
      "active": "Botanical Glycerin",
      "ingredient": "Botanical Glycerin",
      "potency": "5.0%",
      "concentration": "5.0%",
      "classification": "Plant-Derived Humectant Cushion",
      "botanical": "Plant-Derived Humectant Cushion",
      "inci": "",
      "molecular_markers": "Propane-1,2,3-triol (Hydrophilic Moisture Binder)",
      "extraction_method": "Cold-Filtered Vegetable Lipid Hydrolysis",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
      "mechanism": "Helps retain surface moisture during and after rinsing, preventing transepidermal water loss (TEWL) and leaving a supple, dewy glass-skin finish.",
      "role": "Helps retain surface moisture during and after rinsing, preventing transepidermal water loss (TEWL) and leaving a supple, dewy glass-skin finish.",
      "synergy_partners": "0.1% Hyaluronic Acid + 4.0% Sea Buckthorn",
      "reference_url": "https://en.wikipedia.org/wiki/Glycerol"
    },
    {
      "active": "Manjistha Extract",
      "ingredient": "Manjistha Extract",
      "potency": "0.5%",
      "concentration": "0.5%",
      "classification": "Rubia cordifolia (Ayurvedic Varnya Root)",
      "botanical": "Rubia cordifolia (Ayurvedic Varnya Root)",
      "inci": "",
      "molecular_markers": "Purpurin, Munjistin & Rubiadin Glycosides",
      "extraction_method": "Sub-28°C Cold Root Maceration",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
      "mechanism": "Traditional Ayurvedic botanical that helps visibly improve uneven skin tone, sun-induced tan, and post-blemish marks.",
      "role": "Traditional Ayurvedic botanical that helps visibly improve uneven skin tone, sun-induced tan, and post-blemish marks.",
      "synergy_partners": "4.0% Sea Buckthorn + 0.5% Haridra",
      "reference_url": "https://en.wikipedia.org/wiki/Rubia_cordifolia"
    },
    {
      "active": "Haridra (Wild Turmeric)",
      "ingredient": "Haridra (Wild Turmeric)",
      "potency": "0.5%",
      "concentration": "0.5%",
      "classification": "Curcuma longa Antioxidant Rhizome",
      "botanical": "Curcuma longa Antioxidant Rhizome",
      "inci": "",
      "molecular_markers": "Bioactive Curcuminoids & Turmerones",
      "extraction_method": "Sub-28°C Cold Rhizome Extraction",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
      "mechanism": "Supports natural skin luminosity, calms visible redness, and defends against everyday environmental oxidative stress.",
      "role": "Supports natural skin luminosity, calms visible redness, and defends against everyday environmental oxidative stress.",
      "synergy_partners": "4.0% Sea Buckthorn + 0.5% Manjistha",
      "reference_url": "https://en.wikipedia.org/wiki/Turmeric"
    },
    {
      "active": "Neem Extract",
      "ingredient": "Neem Extract",
      "potency": "0.5%",
      "concentration": "0.5%",
      "classification": "Azadirachta indica Clarifying Leaf",
      "botanical": "Azadirachta indica Clarifying Leaf",
      "inci": "",
      "molecular_markers": "Nimbidin, Nimbin & Quercetin Flavonoids",
      "extraction_method": "Sub-28°C Cold Leaf Infusion",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
      "mechanism": "Purifies pores gently and helps maintain a clean, balanced, blemish-free complexion.",
      "role": "Purifies pores gently and helps maintain a clean, balanced, blemish-free complexion.",
      "synergy_partners": "0.1% Niacinamide + 0.5% Haridra",
      "reference_url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
    },
    {
      "active": "Cucumber Extract",
      "ingredient": "Cucumber Extract",
      "potency": "0.5%",
      "concentration": "0.5%",
      "classification": "Cucumis sativus Soothing Agent",
      "botanical": "Cucumis sativus Soothing Agent",
      "inci": "",
      "molecular_markers": "Caffeic Acid, Ascorbic Acid & Amino Acids",
      "extraction_method": "Cold Cellular Press (<25°C)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
      "mechanism": "Soothes heat-stressed skin, reduces morning puffiness, and refreshes tired complexions.",
      "role": "Soothes heat-stressed skin, reduces morning puffiness, and refreshes tired complexions.",
      "synergy_partners": "5.0% Botanical Glycerin + 0.1% Hyaluronic Acid",
      "reference_url": "https://en.wikipedia.org/wiki/Cucumber"
    },
    {
      "active": "Hyaluronic Acid",
      "ingredient": "Hyaluronic Acid",
      "potency": "0.1%",
      "concentration": "0.1%",
      "classification": "Sodium Hyaluronate Humectant",
      "botanical": "Sodium Hyaluronate Humectant",
      "inci": "",
      "molecular_markers": "Multi-Molecular Glycosaminoglycan Polysaccharide",
      "extraction_method": "Plant-Glucose Bio-Fermentation",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
      "mechanism": "Hydrates the outer epidermal layers during washing for an instant smooth, plumped, cushiony appearance.",
      "role": "Hydrates the outer epidermal layers during washing for an instant smooth, plumped, cushiony appearance.",
      "synergy_partners": "5.0% Botanical Glycerin + 0.1% Niacinamide",
      "reference_url": "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate"
    },
    {
      "active": "Niacinamide (Vitamin B3)",
      "ingredient": "Niacinamide (Vitamin B3)",
      "potency": "0.1%",
      "concentration": "0.1%",
      "classification": "Nicotinamide Lipid Barrier Co-Factor",
      "botanical": "Nicotinamide Lipid Barrier Co-Factor",
      "inci": "",
      "molecular_markers": "Pyridine-3-carboxamide (C6H6N2O · Purity ≥99.5%)",
      "extraction_method": "Analytical Synthesis (Calibrated at pH 5.4 for Zero Flush)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
      "mechanism": "Supports natural barrier ceramides, balances uneven tone, and refines overall pore and skin texture.",
      "role": "Supports natural barrier ceramides, balances uneven tone, and refines overall pore and skin texture.",
      "synergy_partners": "4.0% Sea Buckthorn + 0.5% Manjistha",
      "reference_url": "https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide"
    },
    {
      "active": "Perfume & Cleanser Base",
      "ingredient": "Perfume & Cleanser Base",
      "potency": "0.5% / Q.S.",
      "concentration": "0.5% / Q.S.",
      "classification": "pH-Balanced Sulfate-Free Emulsion",
      "botanical": "pH-Balanced Sulfate-Free Emulsion",
      "inci": "",
      "molecular_markers": "Biodegradable Plant-Derived Glucoside Micelles",
      "extraction_method": "Sub-28°C Cleanroom Emulsification",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
      "mechanism": "Silk-textured, non-stripping botanical cleansing matrix free from SLS/SLES sulfates and parabens.",
      "role": "Silk-textured, non-stripping botanical cleansing matrix free from SLS/SLES sulfates and parabens.",
      "synergy_partners": "All 8 Disclosed Actives",
      "reference_url": "https://bhumivera.com/science"
    }
  ],
  "specifications": {
    "Brand_Name": "Bhumivera (The Transparent Maison · Est. 2016 Lineage)",
    "Product_Full_Name": "Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash",
    "SKU_Code": "BV-LUX-SBFW-02 (Legacy: BV-SBFW-100ML)",
    "MPN_Code": "BVSBFW100ML",
    "GTIN_13_EAN": "8906182600025",
    "GST_HSN_Code": "30049011 (Ayurvedic & Botanical Preparations · 5% GST)",
    "Net_Volume_Metric": "100 ML (3.38 fl. oz.)",
    "Gross_Dispatch_Weight": "214.5 Grams (±0.5g Digital Scale Verified)",
    "Batch_Number": "SFW26H / BATCH-04/26-SB (250 Units per Micro-Batch)",
    "Calibrated_pH_Range": "pH 5.30 – 5.50 at 25.0°C (5.42 pH Digital Electrode Verified)",
    "Extraction_Temperature": "< 28.0°C (26.4°C Cold-Pressed Ladakh Berry Protocol)",
    "Primary_Radiance_Active": "4.0% Himalayan Sea Buckthorn (Hippophae rhamnoides · Omega-7 & Vitamin C)",
    "Primary_Humectant_Cushion": "5.0% Botanical Glycerin + 0.1% Multi-Molecular Hyaluronic Acid",
    "Barrier_Vitamin_CoFactor": "0.1% USP-Grade Niacinamide (Vitamin B3 · Ceramide & Pore Support)",
    "Ayurvedic_Phyto_Complex": "0.5% Manjistha + 0.5% Haridra (Turmeric) + 0.5% Neem + 0.5% Cucumber",
    "Total_Disclosed_Actives": "10.7% Active & Functional Botanical/Humectant Concentration + Q.S. Base",
    "Omega_Fatty_Acid_Profile": "Omega-7 (Palmitoleic Acid), Omega-3, Omega-6 & Omega-9 Bio-Lipids",
    "Surfactant_Architecture": "100% Sulfate-Free (Decyl Glucoside & Coco-Glucoside Gentle Plant Foam)",
    "Free_From_Guarantee": "0% SLS, 0% SLES, 0% Parabens, 0% Mineral Oil, 0% Synthetic Dyes",
    "Target_Skin_Profiles": "Dry, Dull, Normal, Combination, Sensitive & Barrier-Impaired Skin",
    "Primary_Skin_Concerns": "Dullness, Uneven Tone, Post-Sun Tan, Dehydration & Barrier Fatigue",
    "Texture_And_Visual_Profile": "Luminous Golden-Amber Nectar Emulsion with Cushioning Micro-Foam",
    "Aromatic_Profile": "Crisp Himalayan Berry & Subtle Allergen-Screened Botanical Aroma (0.5%)",
    "Recommended_Ritual_Timing": "Twice Daily (AM Antioxidant Radiance Shield & PM Barrier Reset · 30–45s)",
    "Shelf_Life_And_PAO": "24 Months from Manufacturing Date (6 Months Period After Opening)",
    "Primary_Vessel_Material": "UV-Protected Apothecary Dispenser with Gold-Foil Tamper Custody Seal",
    "Microbiological_Purity": "Total Aerobic Microbial Count < 10 CFU/ml (Zero Pathogens)",
    "Heavy_Metals_ICP_MS": "Lead <0.05 ppm · Arsenic <0.02 ppm · Mercury Not Detected (ND)",
    "Harvest_Origin_Lot": "Ladakh Nubra & Spiti Valley Cooperative Lot #LDK-SB-2026 (3,400m+)",
    "Brand_Flagship_Entity": "Bhumivera Organics India Private Limited (Inc. August 4, 2026 · Asansol, WB)",
    "Parent_Heritage_Entity": "MPG E-Business Private Limited (Inc. Sept 22, 2016 · CIN: U74999WB2016PTC217735)",
    "Country_Of_Origin": "Proudly Formulated & Manufactured in India (Bharat)"
  },
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
    },
    {
      "name": "Curcuma longa (Haridra)",
      "url": "https://en.wikipedia.org/wiki/Turmeric"
    },
    {
      "name": "Azadirachta indica (Neem)",
      "url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
    },
    {
      "name": "Glycerol (Botanical Glycerin)",
      "url": "https://en.wikipedia.org/wiki/Glycerol"
    }
  ],
  "conscious_buyer_highlights": [
    "High-Potency 4% Sea Buckthorn: Delivers rare Himalayan Omega-7 (palmitoleic acid), carotenoids, and botanical antioxidants at a full 4.0% label-disclosed concentration.",
    "Dewy Glass-Skin Hydration: 5.0% Botanical Glycerin, 0.1% Hyaluronic Acid, and 0.1% Niacinamide lock in moisture and support ceramide synthesis during cleansing.",
    "Ayurvedic Tone-Evening Complex: 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, and 0.5% Cucumber soothe redness and brighten dull, sun-stressed skin.",
    "Clean & Transparent: Sulfate-free (0% SLS/SLES), paraben-free cosmetic formulation calibrated to pH 5.3–5.5 with 100% label-disclosed active percentages."
  ],
  "related_products": [],
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
      "q": "If I am looking for a face wash with Niacinamide and Hyaluronic Acid, is this suitable?",
      "a": "Yes! Bhumivera Himalayan Sea Buckthorn Face Wash combines 0.1% USP Niacinamide and 0.1% Hyaluronic Acid with 5.0% Botanical Glycerin and 4.0% Sea Buckthorn at pH 5.3–5.5—giving you both clinical barrier humectants and cold-pressed Himalayan antioxidant nutrition."
    },
    {
      "q": "Which Bhumivera face wash should I choose: Activated Charcoal or Himalayan Sea Buckthorn?",
      "a": "Choose the 3% Activated Charcoal Face Wash if your primary goals are deep pore detoxification, urban pollution removal, and oil control. Choose the 4% Himalayan Sea Buckthorn Face Wash if you want intensive Omega-7 nourishment, dullness brightening, and dewy radiance—or use Charcoal in the evening and Sea Buckthorn in the morning."
    },
    {
      "q": "Is Bhumivera Himalayan Sea Buckthorn Face Wash sulfate-free and pH-balanced?",
      "a": "Yes. It is 100% free from SLS/SLES sulfates, parabens, and mineral oil, and is calibrated to a skin-identical pH of 5.3 – 5.5."
    },
    {
      "q": "What is Omega-7 in Sea Buckthorn and how does it help facial skin?",
      "a": "Omega-7 (palmitoleic acid) is a rare monounsaturated fatty acid naturally present in human sebum and epidermal lipids. It cushions the skin barrier during cleansing, softens dry or sun-stressed texture, and supports a supple, radiant glow."
    },
    {
      "q": "Can I use Bhumivera Sea Buckthorn Face Wash on sensitive or acne-prone skin?",
      "a": "Yes. Its pH 5.4 calibration, 5% Glycerin cushion, 0.5% Neem, and 0.1% Niacinamide make it gentle on sensitive and blemish-prone skin. As with all concentrated botanical formulas, perform a 24-hour inner-forearm patch test before first use."
    },
    {
      "q": "Where are the Sea Buckthorn berries sourced from?",
      "a": "Our Hippophae rhamnoides berries are sourced from high-altitude valleys in Ladakh and Spiti (above 3,200m) and cold-pressed below 28°C to preserve heat-sensitive carotenoids and Omega-7 lipids."
    },
    {
      "q": "Does this face wash remove sunscreen and light daily makeup?",
      "a": "Yes. Its mild plant-glucoside micelles and 4% Sea Buckthorn lipid complex effectively lift daily sunscreen, surface sebum, and urban dust in a 30–45 second wash without stripping the acid mantle."
    },
    {
      "q": "Where can I verify my bottle's batch COA and authenticity?",
      "a": "Scan the QR code on your box or enter your bottle serial (e.g., BHMV-2610-SB083) at https://bhumivera.com/verify to view the digital pH 5.42 assay and heavy-metal test results."
    }
  ]
};

export const SHAMPOO_2IN1_EXACT = {
  "id": 3,
  "name": "Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner",
  "slug": "luxury-2-in-1-botanical-shampoo-conditioner",
  "rating": 4.69,
  "review_count": 222,
  "reviews": 222,
  "sku": "BV-LUX-SH2IN1-03",
  "mpn": "BVSH2IN1LUX",
  "net_volume": "200 ML",
  "price": 899.0,
  "mrp": 1199.0,
  "stock": 200,
  "category": "Luxury Hair Care",
  "ph_level": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
  "active_ingredients": "Ritta/Reetha (25mg), Amla (20mg), Triphala (10mg), Bringna/Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aleovera/Aloe Vera (10mg), Shikhakai (5mg), Shampoo Base (Q.S.)",
  "image_url": "/images/products/bhumivera-luxury-2-in-1-shampoo-conditioner.webp",
  "seo_title": "Bhumivera Royal 2-in-1 Luxury Shampoo with Conditioner (200ml) | Reetha (25mg), Amla (20mg), Rosemary Oil, Bhringraj & Aloe Vera Sulfate-Free Hair Cleanser",
  "meta_description": "Shop Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200ml). Formulated with label-verified 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera & 5mg Shikakai.",
  "short_description": "Dual-action Ayurvedic botanical 2-in-1 Shampoo with Conditioner. Formulated with label-disclosed 25mg Ritta (Reetha), 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera & 5mg Shikakai for clean, soft, fuller-looking hair.",
  "full_description": "<article class=\"bhumivera-monograph space-y-6\">\n  <h3>Precision-Dosed 8-Botanical Ayurvedic Trichology: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, Bhringraj, Triphala, Neem, Aloe Vera & Shikakai</h3>\n  <p><strong>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · SKU: BV-LUX-SH2IN1-03)</strong> is a flagship formulation from <a href=\"https://bhumivera.com\"><strong>Bhumivera — The Transparent Maison</strong></a> (<a href=\"https://bhumivera.com/about\">Bhumivera Organics India Private Limited</a>, incorporated August 4, 2026 under Founder <strong>Akash Prasad</strong> and Directors <strong>Akash Prasad, Payal Prasad &amp; Aman Prasad</strong>), rooted in the 10-year herbal manufacturing and household distribution heritage of <a href=\"https://bhumivera.com/mpgebusiness\"><strong>MPG E-Business Private Limited</strong></a> (established September 22, 2016 in Asansol, West Bengal · CIN: <code>U74999WB2016PTC217735</code> · Founder: <strong>Dilip Prasad Nonia</strong>). Engineered under <em>The Bhumivera Transparency Standard (Est. 2016 lineage)</em>, this formulation prints 100% of its functional active concentrations openly on the physical bottle label: <strong>Ritta/Reetha (25mg), Amla (20mg), Triphala (10mg), Bringna/Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aleovera/Aloe Vera (10mg), Shikhakai (5mg), Shampoo Base (Q.S.)</strong>, calibrated to <strong>pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)</strong>.</p>\n  <p>Healthy, voluminous, resilient hair begins at the scalp microbiome and the overlapping keratin cuticle of the hair shaft. Conventional mass-market shampoos rely on aggressive anionic detergents—Sodium Lauryl Sulfate (SLS) and Sodium Laureth Sulfate (SLES)—that strip the scalp's protective sebum mantle and raise the pH of the hair shaft, causing cuticle scales to swell, snag, and fracture. To disguise this structural damage, conventional 2-in-1 shampoos coat the hair in water-insoluble synthetic silicones (dimethicone andamodimethicone) that suffocate hair follicles and attract dust.</p><p>The Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · SKU: BV-LUX-SH2IN1-03) replaces synthetic sulfates and occlusive silicones with a 100% label-disclosed, 100 mg standardized 8-herb Ayurvedic complex per 100ml: Ritta/Reetha (25 mg), Amla (20 mg), Triphala (10 mg), Bringna/Bhringraj (10 mg), Rosemary Essential Oil (10 mg), Neem (10 mg), Aleovera/Aloe Vera (10 mg), and Shikhakai (5 mg), calibrated to a cuticle-sealing pH of 5.0 – 5.24.</p>\n\n  <h3>I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters</h3>\n  <p>Our cleansing engine is led by 25 mg of wild-harvested Ritta/Reetha (Sapindus mukorossi) and 5 mg of Shikhakai (Acacia concinna). Reetha pericarps are naturally rich in triterpenoid saponins (sapindoside A and B)—non-ionic, biodegradable plant surfactants that lower the surface tension of water to lift excess scalp oil, sweat, and hard-water mineral deposits without stripping intracellular keratin lipids. Because Shikakai and Reetha naturally operate at an acidic pH around 5.0, they keep the hair cuticle flat and sealed during washing.</p><p>Simultaneously, 10 mg of cold-filleted Aloe Vera (Aloe barbadensis Miller, rich in acemannan mucopolysaccharides) and 20 mg of Amla (Phyllanthus emblica, rich in Vitamin C and gallotannins) act as a weightless, silicone-free built-in conditioner. They bind moisture along the hair cortex and smooth surface friction so wet hair detangles effortlessly with minimal comb breakage.</p>\n  <p>For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque <code>&ldquo;Aqua / Base Q.S.&rdquo;</code> disclosure on the back—where high-value botanicals like <a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Himalayan Sea Buckthorn</a>, <a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Manjistha (Rubia cordifolia)</a>, <a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Haridra (Curcuma longa)</a>, <a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reetha (Sapindus mukorossi)</a>, and <a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Sacred Tulsi (Ocimum tenuiflorum)</a> are dusted in at trace levels below 0.01% and boiled at 80°C–100°C. <a href=\"https://bhumivera.com/science\">Bhumivera’s Sub-28°C Formulation Lab</a> eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Niacinamide Vitamin B3</a>, <a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Multi-Molecular Hyaluronic Acid</a>, and Plant-Derived Glycerin) at full, verifiable label potencies.</p>\n\n  <h4>Complete Active Ingredient &amp; Phytochemical Monograph Table (200 ML)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Disclosed Active &amp; INCI</th>\n          <th>Label Potency</th>\n          <th>Botanical / Chemical Class &amp; Reference</th>\n          <th>Extraction &amp; Harvest Corridor</th>\n          <th>Dermal / Trichological / Cellular Mechanism</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Ritta (Reetha / Soapnut)</strong><br/><small>Sapindus mukorossi Pericarp Extract</small></td>\n          <td><strong>25 mg</strong></td>\n          <td>Sapindus mukorossi (Natural Saponin Pod) (<a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C De-Ionized Aqueous Pericarp Decoction · <a href=\"/provenance-engine\">REG-05 · Vindhya & Himachal Saponin Estates</a></td>\n          <td>Natural plant saponin cleanser that gently emulsifies scalp sebum, dust, and hard-water buildup without stripping natural keratin lipids.</td>\n        </tr><tr>\n          <td><strong>Amla (Indian Gooseberry)</strong><br/><small>Phyllanthus emblica Fruit Extract</small></td>\n          <td><strong>20 mg</strong></td>\n          <td>Phyllanthus emblica (Rasayana Fruit) (<a href=\"https://en.wikipedia.org/wiki/Phyllanthus_emblica\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Fruit Maceration · <a href=\"/provenance-engine\">REG-05 · Central Indian Forest Cooperatives</a></td>\n          <td>Rich in bio-available Vitamin C and hydrolysable tannins that bind to hair keratin, nourish hair roots, and impart mirror-like glossy shine.</td>\n        </tr><tr>\n          <td><strong>Triphala Complex</strong><br/><small>Phyllanthus emblica, Terminalia bellirica & Terminalia chebula Fruit Extract</small></td>\n          <td><strong>10 mg</strong></td>\n          <td>Amalaki, Bibhitaki & Haritaki Trio (<a href=\"https://en.wikipedia.org/wiki/Triphala\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Tridoshic Cold Infusion · <a href=\"/provenance-engine\">REG-05 · Vindhya Forest Belt</a></td>\n          <td>Traditional three-fruit Ayurvedic blend that clarifies follicular ostia, neutralizes scalp oxidative stress, and supports strong, anchored roots.</td>\n        </tr><tr>\n          <td><strong>Bringna (Bhringraj)</strong><br/><small>Eclipta prostrata Whole-Plant Extract</small></td>\n          <td><strong>10 mg</strong></td>\n          <td>Eclipta prostrata (Keshraj — King of Hair) (<a href=\"https://en.wikipedia.org/wiki/Eclipta_prostrata\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Whole-Leaf & Stem Extraction · <a href=\"/provenance-engine\">REG-05 · Eastern & Central India Riverine Belts</a></td>\n          <td>Revered in Ayurveda as 'Keshraj' (King of Hair) to nourish dermal papilla cells, reduce hair breakage, and support thicker, fuller-looking hair.</td>\n        </tr><tr>\n          <td><strong>Rosemary Oil</strong><br/><small>Rosmarinus officinalis Leaf Essential Oil</small></td>\n          <td><strong>10 mg</strong></td>\n          <td>Rosmarinus officinalis Essential Oil (<a href=\"https://en.wikipedia.org/wiki/Rosemary\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Low-Temperature Steam Hydro-Distillation · <a href=\"/provenance-engine\">REG-05 · High-Altitude Herbal Estates</a></td>\n          <td>Invigorates scalp massage micro-circulation around the hair bulb and supports healthy, resilient hair strands.</td>\n        </tr><tr>\n          <td><strong>Neem Extract</strong><br/><small>Azadirachta indica Leaf Extract</small></td>\n          <td><strong>10 mg</strong></td>\n          <td>Azadirachta indica Scalp Clarifier (<a href=\"https://en.wikipedia.org/wiki/Azadirachta_indica\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Leaf Infusion · <a href=\"/provenance-engine\">REG-05 · Central India Botanical Cooperatives</a></td>\n          <td>Purifies the scalp microbiome, helping keep the scalp clean, flake-free, and comfortable.</td>\n        </tr><tr>\n          <td><strong>Aleovera (Aloe Vera)</strong><br/><small>Aloe barbadensis Leaf Juice Fillet</small></td>\n          <td><strong>10 mg</strong></td>\n          <td>Aloe barbadensis Miller Inner Fillet (<a href=\"https://en.wikipedia.org/wiki/Aloe_vera\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold Hand-Filleted Inner Gel (<6h Post-Harvest) · <a href=\"/provenance-engine\">REG-04 · Thar Edge Organic Belts, Rajasthan</a></td>\n          <td>Natural moisture-binding conditioner that smooths raised hair cuticles, hydrates the scalp, and tames frizz without heavy silicones.</td>\n        </tr><tr>\n          <td><strong>Shikhakai</strong><br/><small>Acacia concinna Fruit Pod Extract</small></td>\n          <td><strong>5 mg</strong></td>\n          <td>Acacia concinna (Cuticle Detangler) (<a href=\"https://en.wikipedia.org/wiki/Acacia_concinna\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Pod Decoction · <a href=\"/provenance-engine\">REG-05 · Western Ghats & Central India</a></td>\n          <td>Low-pH botanical detangler that seals hair cuticles post-wash, leaving lengths silky and manageable without synthetic dimethicone.</td>\n        </tr><tr>\n          <td><strong>Shampoo Base</strong><br/><small>Aqua & Mild Plant-Glucoside Conditioning Matrix</small></td>\n          <td><strong>Q.S.</strong></td>\n          <td>Conditioning Cleansing Matrix (<a href=\"https://bhumivera.com/guides/science-of-sulfate-free-luxury-herbal-shampoos\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cleanroom Cold Homogenization (27.1°C) · <a href=\"/provenance-engine\">REG-06 · GMP Formulation Cleanroom</a></td>\n          <td>Gentle pH-balanced cleansing and conditioning suspension base suitable for all hair and scalp types.</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3>II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration))</h3>\n  <p>To nourish the scalp and support fuller, stronger-looking hair from the root, Bhumivera pairs 10 mg of pure Rosemary Essential Oil (Rosmarinus officinalis) with 10 mg of Bringna/Bhringraj (Eclipta prostrata), 10 mg of Triphala (Amalaki, Bibhitaki, and Haritaki), and 10 mg of clarifying Neem leaf extract. Rosemary Oil's carnosic and rosmarinic acids invigorate micro-vascular circulation during a 2-minute scalp massage, while Bhringraj's wedelolactone and Triphala's polyphenols fortify the follicular bulb.</p><p>Meanwhile, 10 mg of Neem extract keeps the scalp microbiome clean, balanced, and free from seasonal flaking or itchiness—making this 200ml apothecary vessel a complete 2-in-1 scalp and length ritual.</p>\n  <p>Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically <em>beta-glucocerebrosidase</em> and <em>acidic sphingomyelinase</em>—require an acidic microenvironment between <strong>pH 4.7 and 5.75</strong> to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating <strong>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner</strong> to <strong>pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)</strong> and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our <a href=\"/verify\">Bottle Serial &amp; COA Verification Portal</a> and <a href=\"/somatic-registry\">Somatic INCI Label Registry</a>), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it.</p>\n\n  <h3>III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule</h3>\n  <p>Wet hair thoroughly with lukewarm water. Dispense a coin-sized amount of Bhumivera Royal Botanical 2-in-1 Shampoo into your palms, emulsify with water, and massage into the scalp using your fingertips for a full 90 to 120 seconds. Allow the botanical saponin and Aloe lather to glide down the lengths before rinsing thoroughly. No separate synthetic conditioner is required.</p>\n  <ul>\n    <li><strong>Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):</strong> Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer.</li>\n    <li><strong>Step 2 — Measured Dispensing &amp; Palmar Emulsification:</strong> Dispense the recommended dose of <strong>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner</strong> into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp.</li>\n    <li><strong>Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:</strong> Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives (<strong>Ritta/Reetha (25mg), Amla (20mg), Triphala (10mg), Bringna/Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aleovera/Aloe Vera (10mg), Shikhakai (5mg), Shampoo Base (Q.S.)</strong>) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates.</li>\n    <li><strong>Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:</strong> Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary <a href=\"/shop\">Bhumivera Inside-Out Ritual</a> formulations.</li>\n    <li><strong>Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:</strong> Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility (<a href=\"/lab\">read our full Cleanroom &amp; Patch-Test Protocol</a>).</li>\n  </ul>\n\n  <h3>IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter)</h3>\n  <p>Ideal for Indian hard-water regions, humid monsoon scalps prone to oiliness and dandruff, and dry winter hair prone to static and frizz. Safe for oiled hair (gently emulsifies light pre-wash botanical oils in two washes) and daily or alternate-day cleansing.</p>\n  <p>Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum. <strong>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner</strong> is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration.</p>\n\n  <h3>V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem</h3>\n  <p>Every formulation in the <a href=\"/shop\">Bhumivera 6-Product Flagship Catalog</a> is engineered to work as part of an interconnected, inside-out botanical system. Explore how <strong>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner</strong> pairs with our companion formulations:</p>\n  <ul>\n    <li><strong>1. <a href=\"/product/activated-charcoal-luxury-face-wash\">Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699)</a>:</strong> Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification.</li>\n    <li><strong>2. <a href=\"/product/himalayan-seabuckthorn-luxury-face-wash\">Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799)</a>:</strong> Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity.</li>\n    <li><strong>3. <a href=\"/product/luxury-2-in-1-botanical-shampoo-conditioner\">Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899)</a>:</strong> Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing.</li>\n    <li><strong>4. <a href=\"/product/artisanal-charcoal-handmade-soap\">Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399)</a>:</strong> Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification.</li>\n    <li><strong>5. <a href=\"/product/artisanal-aloe-vera-handmade-soap\">Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349)</a>:</strong> Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care.</li>\n    <li><strong>6. <a href=\"/product/kalpvriksh-satva-tulsi-7-tulsi-extract\">Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499)</a>:</strong> Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality.</li>\n  </ul>\n  <p>You can also acquire coordinated sets in our <a href=\"/combo/bundle-daily-regimen\">Grand Maison 4-Piece Daily Apothecary Bundle</a>, <a href=\"/combo/bundle-royal-crown-trio\">Royal Skin &amp; Scalp Stewardship Trio</a>, <a href=\"/combo/bundle-inside-out-ritual\">Inside-Out Skin-Clearing &amp; Cortisol Ritual</a>, or the collector’s <a href=\"/combo/bundle-grand-maison-vault\">Grand Maison 6-Piece Apothecary Vault</a>, or compare any two formulations side-by-side on our <a href=\"/compare\">Interactive Formulation Comparison Tool</a>.</p>\n\n  <h3>VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact</h3>\n  <p>Every 200ml bottle of Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (Batch #SHS26H · Sample COA Serial: BHMV-2610-SH112) is verified at pH 5.18, <10 CFU/ml microbial purity, and non-detected arsenic/mercury via ICP-MS.</p>\n  <p>Every unit of <strong>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner</strong> is traceable through our <a href=\"/provenance-engine\">6-Corridor Indian Botanical Provenance Engine</a> and protected by <a href=\"/purchase-protection\">Bhumivera White-Glove Purchase Protection</a>. To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard (<a href=\"/legal/shipping-hygiene\">Part II of the Bhumivera Legal Suite</a>) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch (<a href=\"/order-tracking\">track live AWB &amp; dispatch weight logs</a>). Furthermore, every order supports our verifiable community initiatives documented on the <a href=\"/impact\">Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact)</a>—including <a href=\"/impact/stray-animal-care\">The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative</a> and <a href=\"/impact/elderly-disabled-rations\">The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative</a> in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors (<a href=\"/impact/damodar-cleanup\">Damodar Riverbank Vetiver Cleanup</a>, <a href=\"/impact/jute-sapling-nursery\">Biodegradable Jute Sapling Nursery</a>, <a href=\"/impact/village-pukur-revival\">Village Pukur Pond Revival</a>, <a href=\"/impact/herbal-kitchen-gardens\">Medicinal Herbal Kitchen Gardens</a>, <a href=\"/impact/mandi-vermicomposting\">Mandi Waste Vermicomposting</a>, and <a href=\"/impact/coal-belt-microgrove\">Coal-Belt Native Micro-Grove</a>).</p>\n\n  <h4>Technical &amp; Regulatory Specification Summary (BV-LUX-SH2IN1-03)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Specification Parameter</th>\n          <th>Verified Bhumivera Standard</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Brand Name</strong></td>\n          <td>Bhumivera (The Transparent Maison · Est. 2016 Lineage)</td>\n        </tr><tr>\n          <td><strong>Product Full Name</strong></td>\n          <td>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner</td>\n        </tr><tr>\n          <td><strong>SKU Code</strong></td>\n          <td>BV-LUX-SH2IN1-03 (Legacy: BV-ARSH-200ML / BV-LUX-SH2IN1-05)</td>\n        </tr><tr>\n          <td><strong>MPN Code</strong></td>\n          <td>BVSH2IN1LUX</td>\n        </tr><tr>\n          <td><strong>GTIN 13 EAN</strong></td>\n          <td>8906182600032</td>\n        </tr><tr>\n          <td><strong>GST HSN Code</strong></td>\n          <td>30049011 (Ayurvedic & Botanical Preparations · 5% GST)</td>\n        </tr><tr>\n          <td><strong>Net Volume Metric</strong></td>\n          <td>200 ML (6.76 fl. oz.)</td>\n        </tr><tr>\n          <td><strong>Gross Dispatch Weight</strong></td>\n          <td>342.0 Grams (±0.5g Digital Scale Verified)</td>\n        </tr><tr>\n          <td><strong>Batch Number</strong></td>\n          <td>SHS26H / BATCH-04/26-SH (200–250 Units per Micro-Batch)</td>\n        </tr><tr>\n          <td><strong>Calibrated pH Range</strong></td>\n          <td>pH 5.00 – 5.24 at 25.0°C (5.18 pH Cuticle-Sealing Calibration)</td>\n        </tr><tr>\n          <td><strong>Extraction Temperature</strong></td>\n          <td>< 28.0°C (27.1°C Sub-Ambient Saponin Infusion)</td>\n        </tr><tr>\n          <td><strong>Standardized Active Complex</strong></td>\n          <td>100 mg Standardized 8-Herb Ayurvedic Complex per 100 ML</td>\n        </tr><tr>\n          <td><strong>Primary Saponin Cleansers</strong></td>\n          <td>Ritta/Reetha (25 mg) + Shikhakai (5 mg) Natural Plant Saponins</td>\n        </tr><tr>\n          <td><strong>Follicular Strength Actives</strong></td>\n          <td>Amla (20 mg) + Bringna/Bhringraj (10 mg) + Rosemary Oil (10 mg) + Triphala (10 mg)</td>\n        </tr><tr>\n          <td><strong>Scalp And Cuticle Care</strong></td>\n          <td>Neem Extract (10 mg) Scalp Clarifier + Aloe Vera (10 mg) Cuticle Conditioner</td>\n        </tr><tr>\n          <td><strong>Surfactant Architecture</strong></td>\n          <td>100% Sulfate-Free (Natural Sapindus mukorossi Saponins + Plant Glucosides)</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</article>",
  "description": "Precision-Dosed 8-Botanical Ayurvedic Trichology: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, Bhringraj, Triphala, Neem, Aloe Vera & Shikakai \n    Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · SKU: BV-LUX-SH2IN1-03)  is a flagship formulation from   Bhumivera — The Transparent Maison   ( Bhumivera Organics India Private Limited , incorporated August 4, 2026 under Founder  Akash Prasad  and Directors  Akash Prasad, Payal Prasad &amp; Aman Prasad ), rooted in the 10-year herbal manufacturing and household distribution heritage of   MPG E-Business Private Limited   (established September 22, 2016 in Asansol, West Bengal · CIN:  U74999WB2016PTC217735  · Founder:  Dilip Prasad Nonia ). Engineered under  The Bhumivera Transparency Standard (Est. 2016 lineage) , this formulation prints 100% of its functional active concentrations openly on the physical bottle label:  Ritta/Reetha (25mg), Amla (20mg), Triphala (10mg), Bringna/Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aleovera/Aloe Vera (10mg), Shikhakai (5mg), Shampoo Base (Q.S.) , calibrated to  pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration) . \n   Healthy, voluminous, resilient hair begins at the scalp microbiome and the overlapping keratin cuticle of the hair shaft. Conventional mass-market shampoos rely on aggressive anionic detergents—Sodium Lauryl Sulfate (SLS) and Sodium Laureth Sulfate (SLES)—that strip the scalp's protective sebum mantle and raise the pH of the hair shaft, causing cuticle scales to swell, snag, and fracture. To disguise this structural damage, conventional 2-in-1 shampoos coat the hair in water-insoluble synthetic silicones (dimethicone andamodimethicone) that suffocate hair follicles and attract dust.  The Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · SKU: BV-LUX-SH2IN1-03) replaces synthetic sulfates and occlusive silicones with a 100% label-disclosed, 100 mg standardized 8-herb Ayurvedic complex per 100ml: Ritta/Reetha (25 mg), Amla (20 mg), Triphala (10 mg), Bringna/Bhringraj (10 mg), Rosemary Essential Oil (10 mg), Neem (10 mg), Aleovera/Aloe Vera (10 mg), and Shikhakai (5 mg), calibrated to a cuticle-sealing pH of 5.0 – 5.24. \n\n   I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters \n   Our cleansing engine is led by 25 mg of wild-harvested Ritta/Reetha (Sapindus mukorossi) and 5 mg of Shikhakai (Acacia concinna). Reetha pericarps are naturally rich in triterpenoid saponins (sapindoside A and B)—non-ionic, biodegradable plant surfactants that lower the surface tension of water to lift excess scalp oil, sweat, and hard-water mineral deposits without stripping intracellular keratin lipids. Because Shikakai and Reetha naturally operate at an acidic pH around 5.0, they keep the hair cuticle flat and sealed during washing.  Simultaneously, 10 mg of cold-filleted Aloe Vera (Aloe barbadensis Miller, rich in acemannan mucopolysaccharides) and 20 mg of Amla (Phyllanthus emblica, rich in Vitamin C and gallotannins) act as a weightless, silicone-free built-in conditioner. They bind moisture along the hair cortex and smooth surface friction so wet hair detangles effortlessly with minimal comb breakage. \n   For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque  &ldquo;Aqua / Base Q.S.&rdquo;  disclosure on the back—where high-value botanicals like  Himalayan Sea Buckthorn ,  Manjistha (Rubia cordifolia) ,  Haridra (Curcuma longa) ,  Reetha (Sapindus mukorossi) , and  Sacred Tulsi (Ocimum tenuiflorum)  are dusted in at trace levels below 0.01% and boiled at 80°C–100°C.  Bhumivera’s Sub-28°C Formulation Lab  eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants ( Niacinamide Vitamin B3 ,  Multi-Molecular Hyaluronic Acid , and Plant-Derived Glycerin) at full, verifiable label potencies. \n\n   Complete Active Ingredient &amp; Phytochemical Monograph Table (200 ML) \n   \n     \n       \n         \n           Disclosed Active &amp; INCI \n           Label Potency \n           Botanical / Chemical Class &amp; Reference \n           Extraction &amp; Harvest Corridor \n           Dermal / Trichological / Cellular Mechanism \n         \n       \n       \n         \n            Ritta (Reetha / Soapnut)   Sapindus mukorossi Pericarp Extract  \n            25 mg  \n           Sapindus mukorossi (Natural Saponin Pod) ( Reference ↗ ) \n           Sub-28°C De-Ionized Aqueous Pericarp Decoction ·  REG-05 · Vindhya & Himachal Saponin Estates  \n           Natural plant saponin cleanser that gently emulsifies scalp sebum, dust, and hard-water buildup without stripping natural keratin lipids. \n          \n            Amla (Indian Gooseberry)   Phyllanthus emblica Fruit Extract  \n            20 mg  \n           Phyllanthus emblica (Rasayana Fruit) ( Reference ↗ ) \n           Sub-28°C Cold Fruit Maceration ·  REG-05 · Central Indian Forest Cooperatives  \n           Rich in bio-available Vitamin C and hydrolysable tannins that bind to hair keratin, nourish hair roots, and impart mirror-like glossy shine. \n          \n            Triphala Complex   Phyllanthus emblica, Terminalia bellirica & Terminalia chebula Fruit Extract  \n            10 mg  \n           Amalaki, Bibhitaki & Haritaki Trio ( Reference ↗ ) \n           Sub-28°C Tridoshic Cold Infusion ·  REG-05 · Vindhya Forest Belt  \n           Traditional three-fruit Ayurvedic blend that clarifies follicular ostia, neutralizes scalp oxidative stress, and supports strong, anchored roots. \n          \n            Bringna (Bhringraj)   Eclipta prostrata Whole-Plant Extract  \n            10 mg  \n           Eclipta prostrata (Keshraj — King of Hair) ( Reference ↗ ) \n           Sub-28°C Whole-Leaf & Stem Extraction ·  REG-05 · Eastern & Central India Riverine Belts  \n           Revered in Ayurveda as 'Keshraj' (King of Hair) to nourish dermal papilla cells, reduce hair breakage, and support thicker, fuller-looking hair. \n          \n            Rosemary Oil   Rosmarinus officinalis Leaf Essential Oil  \n            10 mg  \n           Rosmarinus officinalis Essential Oil ( Reference ↗ ) \n           Low-Temperature Steam Hydro-Distillation ·  REG-05 · High-Altitude Herbal Estates  \n           Invigorates scalp massage micro-circulation around the hair bulb and supports healthy, resilient hair strands. \n          \n            Neem Extract   Azadirachta indica Leaf Extract  \n            10 mg  \n           Azadirachta indica Scalp Clarifier ( Reference ↗ ) \n           Sub-28°C Cold Leaf Infusion ·  REG-05 · Central India Botanical Cooperatives  \n           Purifies the scalp microbiome, helping keep the scalp clean, flake-free, and comfortable. \n          \n            Aleovera (Aloe Vera)   Aloe barbadensis Leaf Juice Fillet  \n            10 mg  \n           Aloe barbadensis Miller Inner Fillet ( Reference ↗ ) \n           Cold Hand-Filleted Inner Gel ( REG-04 · Thar Edge Organic Belts, Rajasthan  \n           Natural moisture-binding conditioner that smooths raised hair cuticles, hydrates the scalp, and tames frizz without heavy silicones. \n          \n            Shikhakai   Acacia concinna Fruit Pod Extract  \n            5 mg  \n           Acacia concinna (Cuticle Detangler) ( Reference ↗ ) \n           Sub-28°C Pod Decoction ·  REG-05 · Western Ghats & Central India  \n           Low-pH botanical detangler that seals hair cuticles post-wash, leaving lengths silky and manageable without synthetic dimethicone. \n          \n            Shampoo Base   Aqua & Mild Plant-Glucoside Conditioning Matrix  \n            Q.S.  \n           Conditioning Cleansing Matrix ( Reference ↗ ) \n           Cleanroom Cold Homogenization (27.1°C) ·  REG-06 · GMP Formulation Cleanroom  \n           Gentle pH-balanced cleansing and conditioning suspension base suitable for all hair and scalp types. \n         \n       \n     \n   \n\n   II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)) \n   To nourish the scalp and support fuller, stronger-looking hair from the root, Bhumivera pairs 10 mg of pure Rosemary Essential Oil (Rosmarinus officinalis) with 10 mg of Bringna/Bhringraj (Eclipta prostrata), 10 mg of Triphala (Amalaki, Bibhitaki, and Haritaki), and 10 mg of clarifying Neem leaf extract. Rosemary Oil's carnosic and rosmarinic acids invigorate micro-vascular circulation during a 2-minute scalp massage, while Bhringraj's wedelolactone and Triphala's polyphenols fortify the follicular bulb.  Meanwhile, 10 mg of Neem extract keeps the scalp microbiome clean, balanced, and free from seasonal flaking or itchiness—making this 200ml apothecary vessel a complete 2-in-1 scalp and length ritual. \n   Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically  beta-glucocerebrosidase  and  acidic sphingomyelinase —require an acidic microenvironment between  pH 4.7 and 5.75  to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner  to  pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)  and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our  Bottle Serial &amp; COA Verification Portal  and  Somatic INCI Label Registry ), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it. \n\n   III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule \n   Wet hair thoroughly with lukewarm water. Dispense a coin-sized amount of Bhumivera Royal Botanical 2-in-1 Shampoo into your palms, emulsify with water, and massage into the scalp using your fingertips for a full 90 to 120 seconds. Allow the botanical saponin and Aloe lather to glide down the lengths before rinsing thoroughly. No separate synthetic conditioner is required. \n   \n      Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):  Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer. \n      Step 2 — Measured Dispensing &amp; Palmar Emulsification:  Dispense the recommended dose of  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner  into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp. \n      Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:  Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives ( Ritta/Reetha (25mg), Amla (20mg), Triphala (10mg), Bringna/Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aleovera/Aloe Vera (10mg), Shikhakai (5mg), Shampoo Base (Q.S.) ) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates. \n      Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:  Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary  Bhumivera Inside-Out Ritual  formulations. \n      Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:  Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility ( read our full Cleanroom &amp; Patch-Test Protocol ). \n   \n\n   IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter) \n   Ideal for Indian hard-water regions, humid monsoon scalps prone to oiliness and dandruff, and dry winter hair prone to static and frizz. Safe for oiled hair (gently emulsifies light pre-wash botanical oils in two washes) and daily or alternate-day cleansing. \n   Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner  is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration. \n\n   V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem \n   Every formulation in the  Bhumivera 6-Product Flagship Catalog  is engineered to work as part of an interconnected, inside-out botanical system. Explore how  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner  pairs with our companion formulations: \n   \n      1.  Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699) :  Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification. \n      2.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799) :  Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity. \n      3.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899) :  Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing. \n      4.  Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399) :  Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification. \n      5.  Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349) :  Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care. \n      6.  Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499) :  Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality. \n   \n   You can also acquire coordinated sets in our  Grand Maison 4-Piece Daily Apothecary Bundle ,  Royal Skin &amp; Scalp Stewardship Trio ,  Inside-Out Skin-Clearing &amp; Cortisol Ritual , or the collector’s  Grand Maison 6-Piece Apothecary Vault , or compare any two formulations side-by-side on our  Interactive Formulation Comparison Tool . \n\n   VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact \n   Every 200ml bottle of Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (Batch #SHS26H · Sample COA Serial: BHMV-2610-SH112) is verified at pH 5.18,  \n   Every unit of  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner  is traceable through our  6-Corridor Indian Botanical Provenance Engine  and protected by  Bhumivera White-Glove Purchase Protection . To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard ( Part II of the Bhumivera Legal Suite ) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch ( track live AWB &amp; dispatch weight logs ). Furthermore, every order supports our verifiable community initiatives documented on the  Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact) —including  The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative  and  The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative  in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors ( Damodar Riverbank Vetiver Cleanup ,  Biodegradable Jute Sapling Nursery ,  Village Pukur Pond Revival ,  Medicinal Herbal Kitchen Gardens ,  Mandi Waste Vermicomposting , and  Coal-Belt Native Micro-Grove ). \n\n   Technical &amp; Regulatory Specification Summary (BV-LUX-SH2IN1-03) \n   \n     \n       \n         \n           Specification Parameter \n           Verified Bhumivera Standard \n         \n       \n       \n         \n            Brand Name  \n           Bhumivera (The Transparent Maison · Est. 2016 Lineage) \n          \n            Product Full Name  \n           Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner \n          \n            SKU Code  \n           BV-LUX-SH2IN1-03 (Legacy: BV-ARSH-200ML / BV-LUX-SH2IN1-05) \n          \n            MPN Code  \n           BVSH2IN1LUX \n          \n            GTIN 13 EAN  \n           8906182600032 \n          \n            GST HSN Code  \n           30049011 (Ayurvedic & Botanical Preparations · 5% GST) \n          \n            Net Volume Metric  \n           200 ML (6.76 fl. oz.) \n          \n            Gross Dispatch Weight  \n           342.0 Grams (±0.5g Digital Scale Verified) \n          \n            Batch Number  \n           SHS26H / BATCH-04/26-SH (200–250 Units per Micro-Batch) \n          \n            Calibrated pH Range  \n           pH 5.00 – 5.24 at 25.0°C (5.18 pH Cuticle-Sealing Calibration) \n          \n            Extraction Temperature  \n            \n          \n            Standardized Active Complex  \n           100 mg Standardized 8-Herb Ayurvedic Complex per 100 ML \n          \n            Primary Saponin Cleansers  \n           Ritta/Reetha (25 mg) + Shikhakai (5 mg) Natural Plant Saponins \n          \n            Follicular Strength Actives  \n           Amla (20 mg) + Bringna/Bhringraj (10 mg) + Rosemary Oil (10 mg) + Triphala (10 mg) \n          \n            Scalp And Cuticle Care  \n           Neem Extract (10 mg) Scalp Clarifier + Aloe Vera (10 mg) Cuticle Conditioner \n          \n            Surfactant Architecture  \n           100% Sulfate-Free (Natural Sapindus mukorossi Saponins + Plant Glucosides)",
  "editorial_heading": "Precision-Dosed 8-Botanical Ayurvedic Trichology: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, Bhringraj, Triphala, Neem, Aloe Vera & Shikakai",
  "editorial_paragraphs": [
    "Healthy, voluminous, resilient hair begins at the scalp microbiome and the overlapping keratin cuticle of the hair shaft. Conventional mass-market shampoos rely on aggressive anionic detergents—Sodium Lauryl Sulfate (SLS) and Sodium Laureth Sulfate (SLES)—that strip the scalp's protective sebum mantle and raise the pH of the hair shaft, causing cuticle scales to swell, snag, and fracture. To disguise this structural damage, conventional 2-in-1 shampoos coat the hair in water-insoluble synthetic silicones (dimethicone andamodimethicone) that suffocate hair follicles and attract dust.",
    "The Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · SKU: BV-LUX-SH2IN1-03) replaces synthetic sulfates and occlusive silicones with a 100% label-disclosed, 100 mg standardized 8-herb Ayurvedic complex per 100ml: Ritta/Reetha (25 mg), Amla (20 mg), Triphala (10 mg), Bringna/Bhringraj (10 mg), Rosemary Essential Oil (10 mg), Neem (10 mg), Aleovera/Aloe Vera (10 mg), and Shikhakai (5 mg), calibrated to a cuticle-sealing pH of 5.0 – 5.24.",
    "Our cleansing engine is led by 25 mg of wild-harvested Ritta/Reetha (Sapindus mukorossi) and 5 mg of Shikhakai (Acacia concinna). Reetha pericarps are naturally rich in triterpenoid saponins (sapindoside A and B)—non-ionic, biodegradable plant surfactants that lower the surface tension of water to lift excess scalp oil, sweat, and hard-water mineral deposits without stripping intracellular keratin lipids. Because Shikakai and Reetha naturally operate at an acidic pH around 5.0, they keep the hair cuticle flat and sealed during washing.",
    "Simultaneously, 10 mg of cold-filleted Aloe Vera (Aloe barbadensis Miller, rich in acemannan mucopolysaccharides) and 20 mg of Amla (Phyllanthus emblica, rich in Vitamin C and gallotannins) act as a weightless, silicone-free built-in conditioner. They bind moisture along the hair cortex and smooth surface friction so wet hair detangles effortlessly with minimal comb breakage.",
    "To nourish the scalp and support fuller, stronger-looking hair from the root, Bhumivera pairs 10 mg of pure Rosemary Essential Oil (Rosmarinus officinalis) with 10 mg of Bringna/Bhringraj (Eclipta prostrata), 10 mg of Triphala (Amalaki, Bibhitaki, and Haritaki), and 10 mg of clarifying Neem leaf extract. Rosemary Oil's carnosic and rosmarinic acids invigorate micro-vascular circulation during a 2-minute scalp massage, while Bhringraj's wedelolactone and Triphala's polyphenols fortify the follicular bulb.",
    "Meanwhile, 10 mg of Neem extract keeps the scalp microbiome clean, balanced, and free from seasonal flaking or itchiness—making this 200ml apothecary vessel a complete 2-in-1 scalp and length ritual."
  ],
  "composition_table": [
    {
      "active": "Ritta (Reetha / Soapnut)",
      "ingredient": "Ritta (Reetha / Soapnut)",
      "potency": "25 mg",
      "concentration": "25 mg",
      "classification": "Sapindus mukorossi (Natural Saponin Pod)",
      "botanical": "Sapindus mukorossi (Natural Saponin Pod)",
      "inci": "",
      "molecular_markers": "Triterpenoid Saponins (Sapindoside A, B, C & Mukorossi Saponins)",
      "extraction_method": "Sub-28°C De-Ionized Aqueous Pericarp Decoction",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
      "mechanism": "Natural plant saponin cleanser that gently emulsifies scalp sebum, dust, and hard-water buildup without stripping natural keratin lipids.",
      "role": "Natural plant saponin cleanser that gently emulsifies scalp sebum, dust, and hard-water buildup without stripping natural keratin lipids.",
      "synergy_partners": "5 mg Shikakai + 10 mg Aloe Vera",
      "reference_url": "https://en.wikipedia.org/wiki/Sapindus_mukorossi"
    },
    {
      "active": "Amla (Indian Gooseberry)",
      "ingredient": "Amla (Indian Gooseberry)",
      "potency": "20 mg",
      "concentration": "20 mg",
      "classification": "Phyllanthus emblica (Rasayana Fruit)",
      "botanical": "Phyllanthus emblica (Rasayana Fruit)",
      "inci": "",
      "molecular_markers": "Emblicanin A & B, Ascorbic Acid, Gallic Acid & Ellagitannins",
      "extraction_method": "Sub-28°C Cold Fruit Maceration",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
      "mechanism": "Rich in bio-available Vitamin C and hydrolysable tannins that bind to hair keratin, nourish hair roots, and impart mirror-like glossy shine.",
      "role": "Rich in bio-available Vitamin C and hydrolysable tannins that bind to hair keratin, nourish hair roots, and impart mirror-like glossy shine.",
      "synergy_partners": "10 mg Bhringraj + 10 mg Triphala + 10 mg Rosemary Oil",
      "reference_url": "https://en.wikipedia.org/wiki/Phyllanthus_emblica"
    },
    {
      "active": "Triphala Complex",
      "ingredient": "Triphala Complex",
      "potency": "10 mg",
      "concentration": "10 mg",
      "classification": "Amalaki, Bibhitaki & Haritaki Trio",
      "botanical": "Amalaki, Bibhitaki & Haritaki Trio",
      "inci": "",
      "molecular_markers": "Chebulagic Acid, Chebulinic Acid & Gallic Acid Polyphenols",
      "extraction_method": "Sub-28°C Tridoshic Cold Infusion",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
      "mechanism": "Traditional three-fruit Ayurvedic blend that clarifies follicular ostia, neutralizes scalp oxidative stress, and supports strong, anchored roots.",
      "role": "Traditional three-fruit Ayurvedic blend that clarifies follicular ostia, neutralizes scalp oxidative stress, and supports strong, anchored roots.",
      "synergy_partners": "20 mg Amla + 10 mg Neem",
      "reference_url": "https://en.wikipedia.org/wiki/Triphala"
    },
    {
      "active": "Bringna (Bhringraj)",
      "ingredient": "Bringna (Bhringraj)",
      "potency": "10 mg",
      "concentration": "10 mg",
      "classification": "Eclipta prostrata (Keshraj — King of Hair)",
      "botanical": "Eclipta prostrata (Keshraj — King of Hair)",
      "inci": "",
      "molecular_markers": "Wedelolactone, Demethylwedelolactone & Ecliptine",
      "extraction_method": "Sub-28°C Whole-Leaf & Stem Extraction",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
      "mechanism": "Revered in Ayurveda as 'Keshraj' (King of Hair) to nourish dermal papilla cells, reduce hair breakage, and support thicker, fuller-looking hair.",
      "role": "Revered in Ayurveda as 'Keshraj' (King of Hair) to nourish dermal papilla cells, reduce hair breakage, and support thicker, fuller-looking hair.",
      "synergy_partners": "10 mg Rosemary Oil + 20 mg Amla",
      "reference_url": "https://en.wikipedia.org/wiki/Eclipta_prostrata"
    },
    {
      "active": "Rosemary Oil",
      "ingredient": "Rosemary Oil",
      "potency": "10 mg",
      "concentration": "10 mg",
      "classification": "Rosmarinus officinalis Essential Oil",
      "botanical": "Rosmarinus officinalis Essential Oil",
      "inci": "",
      "molecular_markers": "1,8-Cineole, Carnosic Acid, Rosmarinic Acid & Alpha-Pinene",
      "extraction_method": "Low-Temperature Steam Hydro-Distillation",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
      "mechanism": "Invigorates scalp massage micro-circulation around the hair bulb and supports healthy, resilient hair strands.",
      "role": "Invigorates scalp massage micro-circulation around the hair bulb and supports healthy, resilient hair strands.",
      "synergy_partners": "10 mg Bhringraj + 20 mg Amla",
      "reference_url": "https://en.wikipedia.org/wiki/Rosemary"
    },
    {
      "active": "Neem Extract",
      "ingredient": "Neem Extract",
      "potency": "10 mg",
      "concentration": "10 mg",
      "classification": "Azadirachta indica Scalp Clarifier",
      "botanical": "Azadirachta indica Scalp Clarifier",
      "inci": "",
      "molecular_markers": "Nimbidin, Nimbin & Quercetin",
      "extraction_method": "Sub-28°C Cold Leaf Infusion",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
      "mechanism": "Purifies the scalp microbiome, helping keep the scalp clean, flake-free, and comfortable.",
      "role": "Purifies the scalp microbiome, helping keep the scalp clean, flake-free, and comfortable.",
      "synergy_partners": "10 mg Triphala + 10 mg Rosemary Oil",
      "reference_url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
    },
    {
      "active": "Aleovera (Aloe Vera)",
      "ingredient": "Aleovera (Aloe Vera)",
      "potency": "10 mg",
      "concentration": "10 mg",
      "classification": "Aloe barbadensis Miller Inner Fillet",
      "botanical": "Aloe barbadensis Miller Inner Fillet",
      "inci": "",
      "molecular_markers": "Acemannan Mucopolysaccharides, Amino Acids & Plant Sterols",
      "extraction_method": "Cold Hand-Filleted Inner Gel (<6h Post-Harvest)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
      "mechanism": "Natural moisture-binding conditioner that smooths raised hair cuticles, hydrates the scalp, and tames frizz without heavy silicones.",
      "role": "Natural moisture-binding conditioner that smooths raised hair cuticles, hydrates the scalp, and tames frizz without heavy silicones.",
      "synergy_partners": "5 mg Shikakai + 25 mg Reetha",
      "reference_url": "https://en.wikipedia.org/wiki/Aloe_vera"
    },
    {
      "active": "Shikhakai",
      "ingredient": "Shikhakai",
      "potency": "5 mg",
      "concentration": "5 mg",
      "classification": "Acacia concinna (Cuticle Detangler)",
      "botanical": "Acacia concinna (Cuticle Detangler)",
      "inci": "",
      "molecular_markers": "Acacinin A & B Saponins & Lupeol",
      "extraction_method": "Sub-28°C Pod Decoction",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
      "mechanism": "Low-pH botanical detangler that seals hair cuticles post-wash, leaving lengths silky and manageable without synthetic dimethicone.",
      "role": "Low-pH botanical detangler that seals hair cuticles post-wash, leaving lengths silky and manageable without synthetic dimethicone.",
      "synergy_partners": "25 mg Reetha + 10 mg Aloe Vera",
      "reference_url": "https://en.wikipedia.org/wiki/Acacia_concinna"
    },
    {
      "active": "Shampoo Base",
      "ingredient": "Shampoo Base",
      "potency": "Q.S.",
      "concentration": "Q.S.",
      "classification": "Conditioning Cleansing Matrix",
      "botanical": "Conditioning Cleansing Matrix",
      "inci": "",
      "molecular_markers": "Sulfate-Free & Silicone-Free Suspension",
      "extraction_method": "Cleanroom Cold Homogenization (27.1°C)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
      "mechanism": "Gentle pH-balanced cleansing and conditioning suspension base suitable for all hair and scalp types.",
      "role": "Gentle pH-balanced cleansing and conditioning suspension base suitable for all hair and scalp types.",
      "synergy_partners": "All 8 Milligram-Disclosed Botanicals",
      "reference_url": "https://bhumivera.com/guides/science-of-sulfate-free-luxury-herbal-shampoos"
    }
  ],
  "specifications": {
    "Brand_Name": "Bhumivera (The Transparent Maison · Est. 2016 Lineage)",
    "Product_Full_Name": "Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner",
    "SKU_Code": "BV-LUX-SH2IN1-03 (Legacy: BV-ARSH-200ML / BV-LUX-SH2IN1-05)",
    "MPN_Code": "BVSH2IN1LUX",
    "GTIN_13_EAN": "8906182600032",
    "GST_HSN_Code": "30049011 (Ayurvedic & Botanical Preparations · 5% GST)",
    "Net_Volume_Metric": "200 ML (6.76 fl. oz.)",
    "Gross_Dispatch_Weight": "342.0 Grams (±0.5g Digital Scale Verified)",
    "Batch_Number": "SHS26H / BATCH-04/26-SH (200–250 Units per Micro-Batch)",
    "Calibrated_pH_Range": "pH 5.00 – 5.24 at 25.0°C (5.18 pH Cuticle-Sealing Calibration)",
    "Extraction_Temperature": "< 28.0°C (27.1°C Sub-Ambient Saponin Infusion)",
    "Standardized_Active_Complex": "100 mg Standardized 8-Herb Ayurvedic Complex per 100 ML",
    "Primary_Saponin_Cleansers": "Ritta/Reetha (25 mg) + Shikhakai (5 mg) Natural Plant Saponins",
    "Follicular_Strength_Actives": "Amla (20 mg) + Bringna/Bhringraj (10 mg) + Rosemary Oil (10 mg) + Triphala (10 mg)",
    "Scalp_And_Cuticle_Care": "Neem Extract (10 mg) Scalp Clarifier + Aloe Vera (10 mg) Cuticle Conditioner",
    "Surfactant_Architecture": "100% Sulfate-Free (Natural Sapindus mukorossi Saponins + Plant Glucosides)",
    "Conditioning_Mechanism": "100% Silicone-Free (Aloe Acemannan + Acidic Shikakai Cuticle Alignment)",
    "Free_From_Guarantee": "0% SLS, 0% SLES, 0% Dimethicone Silicones, 0% Parabens, 0% Mineral Oil",
    "Target_Hair_And_Scalp_Types": "All Scalp Types, Frizz-Prone, Thinning/Breakage-Prone & Hard-Water Exposed Hair",
    "Primary_Trichology_Goals": "Root Fortification, Reduced Breakage, Scalp Clarity & Detangled Shine",
    "Texture_And_Visual_Profile": "Rich Botanical Herbal Emulsion with Soft Saponin Micro-Lather",
    "Aromatic_Profile": "Natural Rosemary Essential Oil & Earthy Amla-Herbal Bouquet",
    "Recommended_Ritual_Timing": "2–4 Times Weekly (Massage into wet scalp for 90–120 seconds before rinsing)",
    "Shelf_Life_And_PAO": "24 Months from Manufacturing Date (6 Months Period After Opening)",
    "Primary_Vessel_Material": "200 ML UV-Protected Apothecary Bottle with Tamper-Evident Gold Seal",
    "Microbiological_Purity": "Total Aerobic Microbial Count < 10 CFU/ml (Passed Cleanroom QC)",
    "Heavy_Metals_ICP_MS": "Lead <0.03 ppm · Arsenic Not Detected (ND) · Mercury Not Detected (ND)",
    "Harvest_Origin_Lot": "Himachal & Central India Saponin Estate Lot #HIM-RP-2026",
    "Brand_Flagship_Entity": "Bhumivera Organics India Private Limited (Inc. August 4, 2026 · Asansol, WB)",
    "Parent_Heritage_Entity": "MPG E-Business Private Limited (Inc. Sept 22, 2016 · CIN: U74999WB2016PTC217735)",
    "Country_Of_Origin": "Proudly Formulated & Manufactured in India (Bharat)"
  },
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
    },
    {
      "name": "Azadirachta indica (Neem)",
      "url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
    },
    {
      "name": "Aloe vera",
      "url": "https://en.wikipedia.org/wiki/Aloe_vera"
    }
  ],
  "conscious_buyer_highlights": [
    "100 mg Standardized 8-Herb Complex: Exact milligram dosages of Reetha (25mg), Amla (20mg), Triphala (10mg), Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aloe Vera (10mg), and Shikakai (5mg) per 100ml.",
    "Natural Plant Saponin Cleansing: Gently lifts scalp oil, sweat, and hard-water residue without harsh SLS/SLES sulfates.",
    "Silicone-Free Built-In Conditioning: Aloe Vera (10mg) and low-pH Shikakai (5mg) smooth and seal the hair cuticle at pH 5.0–5.24 for soft, tangle-free shine.",
    "Root & Follicle Stewardship: Rosemary Essential Oil, Bhringraj, Amla, and Triphala invigorate scalp massage micro-circulation and fortify strands against breakage."
  ],
  "related_products": [],
  "faqs": [
    {
      "q": "What are the exact active ingredients and dosages in Bhumivera 2-in-1 Luxury Shampoo?",
      "a": "Each unit is formulated with 8 label-disclosed botanicals: Ritta/Reetha (25 mg), Amla (20 mg), Triphala (10 mg), Bringna/Bhringraj (10 mg), Rosemary Oil (10 mg), Neem (10 mg), Aloe Vera (10 mg), and Shikhakai (5 mg) in a conditioning shampoo base (Q.S.)."
    },
    {
      "q": "How does Bhumivera 2-in-1 Shampoo help reduce hair breakage and condition strands naturally?",
      "a": "The synergy of 10 mg Rosemary Oil, 10 mg Bhringraj, 20 mg Amla, and 10 mg Triphala nourishes the scalp and strengthens hair fibers, while Aloe Vera (10 mg) and Shikakai (5 mg) smooth and detangle strands without heavy synthetic silicones."
    },
    {
      "q": "Is Bhumivera 2-in-1 Shampoo completely free from SLS/SLES sulfates and silicones?",
      "a": "Yes. It uses natural Reetha (25 mg) and Shikakai (5 mg) plant saponins with mild biodegradable glucosides—0% SLS, 0% SLES, 0% parabens, and 0% dimethicone silicones."
    },
    {
      "q": "Does this shampoo contain Rosemary Oil and Bhringraj for hair vitality?",
      "a": "Yes. Every bottle includes 10 mg of pure Rosemary Essential Oil and 10 mg of Bhringraj alongside 20 mg of Amla and 10 mg of Triphala to invigorate scalp circulation and fortify roots."
    },
    {
      "q": "Why is the pH of 5.0 – 5.24 important for hair and scalp health?",
      "a": "Alkaline shampoos (pH > 7.0) cause hair cuticle scales to lift and tangle, leading to frizz and breakage. Calibrating our shampoo to pH 5.0–5.24 keeps cuticles flat, sealed, and naturally glossy."
    },
    {
      "q": "Can I use Bhumivera 2-in-1 Shampoo to wash off hair oil?",
      "a": "Yes. Massage into wet scalp for 90–120 seconds and rinse; if you have applied a heavy pre-wash oil treatment, a gentle second wash will leave your scalp clean and lengths soft."
    },
    {
      "q": "Does it help with dandruff, scalp itchiness, and hard-water buildup?",
      "a": "Yes. 10 mg of Neem and 10 mg of Triphala clarify the scalp microbiome, while 25 mg of Reetha saponins gently chelate and lift hard-water mineral residue."
    },
    {
      "q": "Do I need a separate conditioner after using this 2-in-1 formula?",
      "a": "For most hair types, no separate conditioner is needed because 10 mg Aloe Vera, 20 mg Amla, and 5 mg low-pH Shikakai naturally detangle and condition hair cuticles during the wash."
    },
    {
      "q": "Is it safe for color-treated or keratin-treated hair?",
      "a": "Yes. Its sulfate-free, pH 5.0–5.24 cuticle-sealing formulation is gentle on color-treated and fragile hair shafts."
    },
    {
      "q": "How can I check the lab COA for my bottle of Bhumivera Shampoo?",
      "a": "Visit https://bhumivera.com/verify and enter your bottle serial (or sample serial BHMV-2610-SH112) to inspect the pH 5.18 and heavy-metal assay report."
    }
  ]
};

export const CHARCOAL_SOAP_EXACT = {
  "id": 4,
  "name": "Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)",
  "slug": "artisanal-charcoal-handmade-soap",
  "rating": 4.76,
  "review_count": 219,
  "reviews": 219,
  "sku": "BV-LUX-CSOAP-04",
  "mpn": "BVCSOAP100GM",
  "net_volume": "100 GM",
  "price": 399.0,
  "mrp": 499.0,
  "stock": 300,
  "category": "Artisanal Ayurvedic Cleansing Bars",
  "ph_level": "Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)",
  "active_ingredients": "Activated Charcoal, Aloevera (Aloe barbadensis), Pure Ayurvedic Soap Base (Free from Harsh Synthetic Chemicals)",
  "image_url": "/images/products/bhumivera-artisanal-charcoal-handmade-soap.webp",
  "seo_title": "Bhumivera Charcoal Deep Cleansing Bar (100 GM) | Handmade Ayurvedic Activated Charcoal & Aloe Vera Luxury Bathing Soap",
  "meta_description": "Handcrafted 100 GM Bhumivera Charcoal Deep Cleansing Bar with Activated Charcoal and Aloe Vera in a gentle Ayurvedic soap base free from harsh synthetic detergents.",
  "short_description": "Handcrafted 100 GM Ayurvedic Charcoal Deep Cleansing Bar formulated with Activated Charcoal and soothing Aloe Vera. A gentle, non-drying luxury bathing bar that lifts deep pore impurities, sweat, and urban grime while keeping skin soft and comfortable.",
  "full_description": "<article class=\"bhumivera-monograph space-y-6\">\n  <h3>Artisanal Ayurvedic Deep Cleansing Meets Pure Aloe Hydration: The 100 GM Charcoal Deep Cleansing Bar</h3>\n  <p><strong>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap) (100 GM · SKU: BV-LUX-CSOAP-04)</strong> is a flagship formulation from <a href=\"https://bhumivera.com\"><strong>Bhumivera — The Transparent Maison</strong></a> (<a href=\"https://bhumivera.com/about\">Bhumivera Organics India Private Limited</a>, incorporated August 4, 2026 under Founder <strong>Akash Prasad</strong> and Directors <strong>Akash Prasad, Payal Prasad &amp; Aman Prasad</strong>), rooted in the 10-year herbal manufacturing and household distribution heritage of <a href=\"https://bhumivera.com/mpgebusiness\"><strong>MPG E-Business Private Limited</strong></a> (established September 22, 2016 in Asansol, West Bengal · CIN: <code>U74999WB2016PTC217735</code> · Founder: <strong>Dilip Prasad Nonia</strong>). Engineered under <em>The Bhumivera Transparency Standard (Est. 2016 lineage)</em>, this formulation prints 100% of its functional active concentrations openly on the physical bottle label: <strong>Activated Charcoal, Aloevera (Aloe barbadensis), Pure Ayurvedic Soap Base (Free from Harsh Synthetic Chemicals)</strong>, calibrated to <strong>Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)</strong>.</p>\n  <p>While facial skin often receives carefully calibrated cleansers, the skin covering the rest of the body—particularly the back, shoulders, chest, and neck, which house a high density of sebaceous and eccrine sweat glands—is frequently subjected to harsh, mass-manufactured commercial syndet and tallow detergent bars. These industrial bars strip the body's lipid mantle, leave chalky hard-water soap scum across pores, and trigger post-shower dryness and body congestion.</p><p>The Bhumivera Charcoal Deep Cleansing Bar (100 GM · SKU: BV-LUX-CSOAP-04) elevates daily full-body bathing into a handcrafted Ayurvedic apothecary ritual. Compounded in quality-controlled artisanal batches under The Bhumivera Transparency Standard (Est. 2016 lineage), this obsidian bar pairs high-porosity Activated Charcoal with soothing Pure Aloe Vera (Aloe barbadensis Miller) inside a gentle, 100% vegetarian Ayurvedic soap base free from harsh synthetic detergents.</p>\n\n  <h3>I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters</h3>\n  <p>Activated Charcoal functions across the skin of the body through physical adsorption: its vast internal network of micropores binds excess sebum, gym and commute sweat, oxidized body oils, deodorants, and urban airborne particulates without requiring harsh alkaline degreasing agents. Because the carbon powder in the Bhumivera Charcoal Deep Cleansing Bar is finely milled, the bar glides smoothly over the skin without scratching or irritating delicate areas.</p><p>To counter the drying tendency of ordinary charcoal soaps, Bhumivera infuses the bar with cold-filleted Aloe Vera inner-leaf mucilage. Rich in acemannan polysaccharides, glycoproteins, and soothing plant sterols, Aloe Vera cushions the lather so that your skin emerges from the bath feeling velvety, calm, and deeply hydrated.</p>\n  <p>For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque <code>&ldquo;Aqua / Base Q.S.&rdquo;</code> disclosure on the back—where high-value botanicals like <a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Himalayan Sea Buckthorn</a>, <a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Manjistha (Rubia cordifolia)</a>, <a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Haridra (Curcuma longa)</a>, <a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reetha (Sapindus mukorossi)</a>, and <a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Sacred Tulsi (Ocimum tenuiflorum)</a> are dusted in at trace levels below 0.01% and boiled at 80°C–100°C. <a href=\"https://bhumivera.com/science\">Bhumivera’s Sub-28°C Formulation Lab</a> eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Niacinamide Vitamin B3</a>, <a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Multi-Molecular Hyaluronic Acid</a>, and Plant-Derived Glycerin) at full, verifiable label potencies.</p>\n\n  <h4>Complete Active Ingredient &amp; Phytochemical Monograph Table (100 GM)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Disclosed Active &amp; INCI</th>\n          <th>Label Potency</th>\n          <th>Botanical / Chemical Class &amp; Reference</th>\n          <th>Extraction &amp; Harvest Corridor</th>\n          <th>Dermal / Trichological / Cellular Mechanism</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Activated Charcoal</strong><br/><small>Carbon Black / Steam-Activated Bamboo Charcoal (<15 μm)</small></td>\n          <td><strong>Deep Cleansing Core</strong></td>\n          <td>Microporous Activated Carbon (<a href=\"https://en.wikipedia.org/wiki/Activated_carbon\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>850°C Steam Activation & Fine Sieve Milling · <a href=\"/provenance-engine\">REG-03 · Assam & North-East Sustainable Bamboo Groves</a></td>\n          <td>Draws out deep-seated pore impurities, excess body sebum, sweat residue, and environmental pollutants from face, neck, back, and shoulders.</td>\n        </tr><tr>\n          <td><strong>Aloevera Extract</strong><br/><small>Aloe barbadensis Miller Inner-Leaf Fillet Gel</small></td>\n          <td><strong>Soothing Hydration Matrix</strong></td>\n          <td>Aloe barbadensis miller (<a href=\"https://en.wikipedia.org/wiki/Aloe_vera\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold Hand-Filleted Mucilage (<28°C) · <a href=\"/provenance-engine\">REG-04 · Thar Edge Organic Belts, Rajasthan</a></td>\n          <td>Replenishes skin moisture during bathing, calms heat and dryness, and creates a rich, velvety, non-stripping lather.</td>\n        </tr><tr>\n          <td><strong>Ayurvedic Soap Base</strong><br/><small>Artisanal Vegetable-Oil & Glycerin Saponified Base</small></td>\n          <td><strong>Q.S. (100 GM Bar)</strong></td>\n          <td>Gentle Artisanal Soap Base (<a href=\"https://en.wikipedia.org/wiki/Ayurveda\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Small-Batch Cold-Molded Artisanal Curing · <a href=\"/provenance-engine\">REG-06 · GMP Artisanal Soap Atelier</a></td>\n          <td>Prepared in quality-controlled batches without harsh synthetic detergents, SLS, parabens, or animal tallow for everyday face and body cleansing.</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3>II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin))</h3>\n  <p>For patrons seeking a complete head-to-toe purifying regimen, the Bhumivera Charcoal Deep Cleansing Bar pairs seamlessly with our Bhumivera Activated Charcoal Purifying Luxury Face Wash (for targeted pH 5.4 facial cleansing) and our Kalpvriksh Satva 7-Tulsi Drops in The Inside-Out Skin-Clearing & Cortisol Ritual Bundle.</p><p>If you prefer to rotate your daily bathing bars by skin mood, use the Charcoal Deep Cleansing Bar after workouts or humid outdoor commutes, and alternate with the Bhumivera Soothing Bar (Aloe Vera, Neem & Sacred Tulsi) for calming herbal nourishment.</p>\n  <p>Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically <em>beta-glucocerebrosidase</em> and <em>acidic sphingomyelinase</em>—require an acidic microenvironment between <strong>pH 4.7 and 5.75</strong> to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating <strong>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)</strong> to <strong>Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)</strong> and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our <a href=\"/verify\">Bottle Serial &amp; COA Verification Portal</a> and <a href=\"/somatic-registry\">Somatic INCI Label Registry</a>), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it.</p>\n\n  <h3>III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule</h3>\n  <p>Wet the 100 GM bar under lukewarm shower water and work it between your palms or onto a soft cotton washcloth to build a rich, creamy lather. Massage across wet skin for 30 to 45 seconds—paying special attention to the neck, shoulders, upper back, and chest—before rinsing thoroughly. Place the bar on a well-drained dish after each use so it stays firm and long-lasting.</p>\n  <ul>\n    <li><strong>Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):</strong> Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer.</li>\n    <li><strong>Step 2 — Measured Dispensing &amp; Palmar Emulsification:</strong> Dispense the recommended dose of <strong>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)</strong> into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp.</li>\n    <li><strong>Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:</strong> Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives (<strong>Activated Charcoal, Aloevera (Aloe barbadensis), Pure Ayurvedic Soap Base (Free from Harsh Synthetic Chemicals)</strong>) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates.</li>\n    <li><strong>Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:</strong> Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary <a href=\"/shop\">Bhumivera Inside-Out Ritual</a> formulations.</li>\n    <li><strong>Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:</strong> Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility (<a href=\"/lab\">read our full Cleanroom &amp; Patch-Test Protocol</a>).</li>\n  </ul>\n\n  <h3>IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter)</h3>\n  <p>In India's hot summers and sticky monsoons, daily sweat and dust accumulate rapidly on the neck and back; the Charcoal Deep Cleansing Bar lifts this buildup effortlessly while leaving skin fresh. In cooler winter months, its Aloe Vera hydration matrix prevents the flaky, ashy skin dryness caused by ordinary market soaps.</p>\n  <p>Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum. <strong>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)</strong> is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration.</p>\n\n  <h3>V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem</h3>\n  <p>Every formulation in the <a href=\"/shop\">Bhumivera 6-Product Flagship Catalog</a> is engineered to work as part of an interconnected, inside-out botanical system. Explore how <strong>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)</strong> pairs with our companion formulations:</p>\n  <ul>\n    <li><strong>1. <a href=\"/product/activated-charcoal-luxury-face-wash\">Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699)</a>:</strong> Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification.</li>\n    <li><strong>2. <a href=\"/product/himalayan-seabuckthorn-luxury-face-wash\">Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799)</a>:</strong> Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity.</li>\n    <li><strong>3. <a href=\"/product/luxury-2-in-1-botanical-shampoo-conditioner\">Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899)</a>:</strong> Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing.</li>\n    <li><strong>4. <a href=\"/product/artisanal-charcoal-handmade-soap\">Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399)</a>:</strong> Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification.</li>\n    <li><strong>5. <a href=\"/product/artisanal-aloe-vera-handmade-soap\">Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349)</a>:</strong> Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care.</li>\n    <li><strong>6. <a href=\"/product/kalpvriksh-satva-tulsi-7-tulsi-extract\">Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499)</a>:</strong> Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality.</li>\n  </ul>\n  <p>You can also acquire coordinated sets in our <a href=\"/combo/bundle-daily-regimen\">Grand Maison 4-Piece Daily Apothecary Bundle</a>, <a href=\"/combo/bundle-royal-crown-trio\">Royal Skin &amp; Scalp Stewardship Trio</a>, <a href=\"/combo/bundle-inside-out-ritual\">Inside-Out Skin-Clearing &amp; Cortisol Ritual</a>, or the collector’s <a href=\"/combo/bundle-grand-maison-vault\">Grand Maison 6-Piece Apothecary Vault</a>, or compare any two formulations side-by-side on our <a href=\"/compare\">Interactive Formulation Comparison Tool</a>.</p>\n\n  <h3>VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact</h3>\n  <p>Handcrafted under Batch #SACHS26I using Assam bamboo activated carbon and Rajasthan Aloe Vera inner-leaf fillet, each 100 GM bar is wrapped and sealed under Bhumivera's strict sanitary custody protocol.</p>\n  <p>Every unit of <strong>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)</strong> is traceable through our <a href=\"/provenance-engine\">6-Corridor Indian Botanical Provenance Engine</a> and protected by <a href=\"/purchase-protection\">Bhumivera White-Glove Purchase Protection</a>. To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard (<a href=\"/legal/shipping-hygiene\">Part II of the Bhumivera Legal Suite</a>) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch (<a href=\"/order-tracking\">track live AWB &amp; dispatch weight logs</a>). Furthermore, every order supports our verifiable community initiatives documented on the <a href=\"/impact\">Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact)</a>—including <a href=\"/impact/stray-animal-care\">The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative</a> and <a href=\"/impact/elderly-disabled-rations\">The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative</a> in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors (<a href=\"/impact/damodar-cleanup\">Damodar Riverbank Vetiver Cleanup</a>, <a href=\"/impact/jute-sapling-nursery\">Biodegradable Jute Sapling Nursery</a>, <a href=\"/impact/village-pukur-revival\">Village Pukur Pond Revival</a>, <a href=\"/impact/herbal-kitchen-gardens\">Medicinal Herbal Kitchen Gardens</a>, <a href=\"/impact/mandi-vermicomposting\">Mandi Waste Vermicomposting</a>, and <a href=\"/impact/coal-belt-microgrove\">Coal-Belt Native Micro-Grove</a>).</p>\n\n  <h4>Technical &amp; Regulatory Specification Summary (BV-LUX-CSOAP-04)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Specification Parameter</th>\n          <th>Verified Bhumivera Standard</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Brand Name</strong></td>\n          <td>Bhumivera (The Transparent Maison · Est. 2016 Lineage)</td>\n        </tr><tr>\n          <td><strong>Product Full Name</strong></td>\n          <td>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)</td>\n        </tr><tr>\n          <td><strong>SKU Code</strong></td>\n          <td>BV-LUX-CSOAP-04</td>\n        </tr><tr>\n          <td><strong>MPN Code</strong></td>\n          <td>BVCSOAP100GM</td>\n        </tr><tr>\n          <td><strong>GTIN 13 EAN</strong></td>\n          <td>8906182600049</td>\n        </tr><tr>\n          <td><strong>GST HSN Code</strong></td>\n          <td>30049011 (Ayurvedic & Botanical Preparations · 5% GST)</td>\n        </tr><tr>\n          <td><strong>Net Weight Metric</strong></td>\n          <td>100 GM (3.52 oz. Solid Artisanal Bar)</td>\n        </tr><tr>\n          <td><strong>Gross Dispatch Weight</strong></td>\n          <td>135.0 Grams (±0.5g Digital Scale Verified)</td>\n        </tr><tr>\n          <td><strong>Batch Number</strong></td>\n          <td>SACHS26I (Handcrafted Quality-Controlled Batch)</td>\n        </tr><tr>\n          <td><strong>Manufacturing Date</strong></td>\n          <td>2026-09-01 (24-Month Shelf Life)</td>\n        </tr><tr>\n          <td><strong>Formulation Standard</strong></td>\n          <td>Skin-Friendly Handmade Ayurvedic Bar (Free from Harsh Synthetic Detergents)</td>\n        </tr><tr>\n          <td><strong>Primary Purifying Active</strong></td>\n          <td>Steam-Activated Microporous Bamboo Charcoal (<15 Microns)</td>\n        </tr><tr>\n          <td><strong>Primary Soothing Active</strong></td>\n          <td>Pure Aloe Vera (Aloe barbadensis Miller) Inner-Leaf Fillet Extract</td>\n        </tr><tr>\n          <td><strong>Cleansing Base Type</strong></td>\n          <td>100% Vegetarian Ayurvedic Soap Base with Retained Natural Glycerin</td>\n        </tr><tr>\n          <td><strong>Free From Guarantee</strong></td>\n          <td>0% SLS/SLES, 0% Parabens, 0% Animal Fat/Tallow, 0% Synthetic Microbeads</td>\n        </tr><tr>\n          <td><strong>Target Skin Profiles</strong></td>\n          <td>Oily, Combination, Sweat-Prone, Normal & Delicate Skin (Face & Body)</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</article>",
  "description": "Artisanal Ayurvedic Deep Cleansing Meets Pure Aloe Hydration: The 100 GM Charcoal Deep Cleansing Bar \n    Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap) (100 GM · SKU: BV-LUX-CSOAP-04)  is a flagship formulation from   Bhumivera — The Transparent Maison   ( Bhumivera Organics India Private Limited , incorporated August 4, 2026 under Founder  Akash Prasad  and Directors  Akash Prasad, Payal Prasad &amp; Aman Prasad ), rooted in the 10-year herbal manufacturing and household distribution heritage of   MPG E-Business Private Limited   (established September 22, 2016 in Asansol, West Bengal · CIN:  U74999WB2016PTC217735  · Founder:  Dilip Prasad Nonia ). Engineered under  The Bhumivera Transparency Standard (Est. 2016 lineage) , this formulation prints 100% of its functional active concentrations openly on the physical bottle label:  Activated Charcoal, Aloevera (Aloe barbadensis), Pure Ayurvedic Soap Base (Free from Harsh Synthetic Chemicals) , calibrated to  Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin) . \n   While facial skin often receives carefully calibrated cleansers, the skin covering the rest of the body—particularly the back, shoulders, chest, and neck, which house a high density of sebaceous and eccrine sweat glands—is frequently subjected to harsh, mass-manufactured commercial syndet and tallow detergent bars. These industrial bars strip the body's lipid mantle, leave chalky hard-water soap scum across pores, and trigger post-shower dryness and body congestion.  The Bhumivera Charcoal Deep Cleansing Bar (100 GM · SKU: BV-LUX-CSOAP-04) elevates daily full-body bathing into a handcrafted Ayurvedic apothecary ritual. Compounded in quality-controlled artisanal batches under The Bhumivera Transparency Standard (Est. 2016 lineage), this obsidian bar pairs high-porosity Activated Charcoal with soothing Pure Aloe Vera (Aloe barbadensis Miller) inside a gentle, 100% vegetarian Ayurvedic soap base free from harsh synthetic detergents. \n\n   I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters \n   Activated Charcoal functions across the skin of the body through physical adsorption: its vast internal network of micropores binds excess sebum, gym and commute sweat, oxidized body oils, deodorants, and urban airborne particulates without requiring harsh alkaline degreasing agents. Because the carbon powder in the Bhumivera Charcoal Deep Cleansing Bar is finely milled, the bar glides smoothly over the skin without scratching or irritating delicate areas.  To counter the drying tendency of ordinary charcoal soaps, Bhumivera infuses the bar with cold-filleted Aloe Vera inner-leaf mucilage. Rich in acemannan polysaccharides, glycoproteins, and soothing plant sterols, Aloe Vera cushions the lather so that your skin emerges from the bath feeling velvety, calm, and deeply hydrated. \n   For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque  &ldquo;Aqua / Base Q.S.&rdquo;  disclosure on the back—where high-value botanicals like  Himalayan Sea Buckthorn ,  Manjistha (Rubia cordifolia) ,  Haridra (Curcuma longa) ,  Reetha (Sapindus mukorossi) , and  Sacred Tulsi (Ocimum tenuiflorum)  are dusted in at trace levels below 0.01% and boiled at 80°C–100°C.  Bhumivera’s Sub-28°C Formulation Lab  eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants ( Niacinamide Vitamin B3 ,  Multi-Molecular Hyaluronic Acid , and Plant-Derived Glycerin) at full, verifiable label potencies. \n\n   Complete Active Ingredient &amp; Phytochemical Monograph Table (100 GM) \n   \n     \n       \n         \n           Disclosed Active &amp; INCI \n           Label Potency \n           Botanical / Chemical Class &amp; Reference \n           Extraction &amp; Harvest Corridor \n           Dermal / Trichological / Cellular Mechanism \n         \n       \n       \n         \n            Activated Charcoal   Carbon Black / Steam-Activated Bamboo Charcoal (  \n            Deep Cleansing Core  \n           Microporous Activated Carbon ( Reference ↗ ) \n           850°C Steam Activation & Fine Sieve Milling ·  REG-03 · Assam & North-East Sustainable Bamboo Groves  \n           Draws out deep-seated pore impurities, excess body sebum, sweat residue, and environmental pollutants from face, neck, back, and shoulders. \n          \n            Aloevera Extract   Aloe barbadensis Miller Inner-Leaf Fillet Gel  \n            Soothing Hydration Matrix  \n           Aloe barbadensis miller ( Reference ↗ ) \n           Cold Hand-Filleted Mucilage ( REG-04 · Thar Edge Organic Belts, Rajasthan  \n           Replenishes skin moisture during bathing, calms heat and dryness, and creates a rich, velvety, non-stripping lather. \n          \n            Ayurvedic Soap Base   Artisanal Vegetable-Oil & Glycerin Saponified Base  \n            Q.S. (100 GM Bar)  \n           Gentle Artisanal Soap Base ( Reference ↗ ) \n           Small-Batch Cold-Molded Artisanal Curing ·  REG-06 · GMP Artisanal Soap Atelier  \n           Prepared in quality-controlled batches without harsh synthetic detergents, SLS, parabens, or animal tallow for everyday face and body cleansing. \n         \n       \n     \n   \n\n   II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)) \n   For patrons seeking a complete head-to-toe purifying regimen, the Bhumivera Charcoal Deep Cleansing Bar pairs seamlessly with our Bhumivera Activated Charcoal Purifying Luxury Face Wash (for targeted pH 5.4 facial cleansing) and our Kalpvriksh Satva 7-Tulsi Drops in The Inside-Out Skin-Clearing & Cortisol Ritual Bundle.  If you prefer to rotate your daily bathing bars by skin mood, use the Charcoal Deep Cleansing Bar after workouts or humid outdoor commutes, and alternate with the Bhumivera Soothing Bar (Aloe Vera, Neem & Sacred Tulsi) for calming herbal nourishment. \n   Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically  beta-glucocerebrosidase  and  acidic sphingomyelinase —require an acidic microenvironment between  pH 4.7 and 5.75  to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating  Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)  to  Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)  and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our  Bottle Serial &amp; COA Verification Portal  and  Somatic INCI Label Registry ), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it. \n\n   III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule \n   Wet the 100 GM bar under lukewarm shower water and work it between your palms or onto a soft cotton washcloth to build a rich, creamy lather. Massage across wet skin for 30 to 45 seconds—paying special attention to the neck, shoulders, upper back, and chest—before rinsing thoroughly. Place the bar on a well-drained dish after each use so it stays firm and long-lasting. \n   \n      Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):  Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer. \n      Step 2 — Measured Dispensing &amp; Palmar Emulsification:  Dispense the recommended dose of  Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)  into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp. \n      Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:  Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives ( Activated Charcoal, Aloevera (Aloe barbadensis), Pure Ayurvedic Soap Base (Free from Harsh Synthetic Chemicals) ) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates. \n      Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:  Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary  Bhumivera Inside-Out Ritual  formulations. \n      Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:  Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility ( read our full Cleanroom &amp; Patch-Test Protocol ). \n   \n\n   IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter) \n   In India's hot summers and sticky monsoons, daily sweat and dust accumulate rapidly on the neck and back; the Charcoal Deep Cleansing Bar lifts this buildup effortlessly while leaving skin fresh. In cooler winter months, its Aloe Vera hydration matrix prevents the flaky, ashy skin dryness caused by ordinary market soaps. \n   Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum.  Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)  is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration. \n\n   V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem \n   Every formulation in the  Bhumivera 6-Product Flagship Catalog  is engineered to work as part of an interconnected, inside-out botanical system. Explore how  Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)  pairs with our companion formulations: \n   \n      1.  Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699) :  Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification. \n      2.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799) :  Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity. \n      3.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899) :  Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing. \n      4.  Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399) :  Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification. \n      5.  Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349) :  Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care. \n      6.  Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499) :  Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality. \n   \n   You can also acquire coordinated sets in our  Grand Maison 4-Piece Daily Apothecary Bundle ,  Royal Skin &amp; Scalp Stewardship Trio ,  Inside-Out Skin-Clearing &amp; Cortisol Ritual , or the collector’s  Grand Maison 6-Piece Apothecary Vault , or compare any two formulations side-by-side on our  Interactive Formulation Comparison Tool . \n\n   VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact \n   Handcrafted under Batch #SACHS26I using Assam bamboo activated carbon and Rajasthan Aloe Vera inner-leaf fillet, each 100 GM bar is wrapped and sealed under Bhumivera's strict sanitary custody protocol. \n   Every unit of  Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)  is traceable through our  6-Corridor Indian Botanical Provenance Engine  and protected by  Bhumivera White-Glove Purchase Protection . To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard ( Part II of the Bhumivera Legal Suite ) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch ( track live AWB &amp; dispatch weight logs ). Furthermore, every order supports our verifiable community initiatives documented on the  Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact) —including  The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative  and  The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative  in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors ( Damodar Riverbank Vetiver Cleanup ,  Biodegradable Jute Sapling Nursery ,  Village Pukur Pond Revival ,  Medicinal Herbal Kitchen Gardens ,  Mandi Waste Vermicomposting , and  Coal-Belt Native Micro-Grove ). \n\n   Technical &amp; Regulatory Specification Summary (BV-LUX-CSOAP-04) \n   \n     \n       \n         \n           Specification Parameter \n           Verified Bhumivera Standard \n         \n       \n       \n         \n            Brand Name  \n           Bhumivera (The Transparent Maison · Est. 2016 Lineage) \n          \n            Product Full Name  \n           Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap) \n          \n            SKU Code  \n           BV-LUX-CSOAP-04 \n          \n            MPN Code  \n           BVCSOAP100GM \n          \n            GTIN 13 EAN  \n           8906182600049 \n          \n            GST HSN Code  \n           30049011 (Ayurvedic & Botanical Preparations · 5% GST) \n          \n            Net Weight Metric  \n           100 GM (3.52 oz. Solid Artisanal Bar) \n          \n            Gross Dispatch Weight  \n           135.0 Grams (±0.5g Digital Scale Verified) \n          \n            Batch Number  \n           SACHS26I (Handcrafted Quality-Controlled Batch) \n          \n            Manufacturing Date  \n           2026-09-01 (24-Month Shelf Life) \n          \n            Formulation Standard  \n           Skin-Friendly Handmade Ayurvedic Bar (Free from Harsh Synthetic Detergents) \n          \n            Primary Purifying Active  \n           Steam-Activated Microporous Bamboo Charcoal ( \n          \n            Primary Soothing Active  \n           Pure Aloe Vera (Aloe barbadensis Miller) Inner-Leaf Fillet Extract \n          \n            Cleansing Base Type  \n           100% Vegetarian Ayurvedic Soap Base with Retained Natural Glycerin \n          \n            Free From Guarantee  \n           0% SLS/SLES, 0% Parabens, 0% Animal Fat/Tallow, 0% Synthetic Microbeads \n          \n            Target Skin Profiles  \n           Oily, Combination, Sweat-Prone, Normal & Delicate Skin (Face & Body)",
  "editorial_heading": "Artisanal Ayurvedic Deep Cleansing Meets Pure Aloe Hydration: The 100 GM Charcoal Deep Cleansing Bar",
  "editorial_paragraphs": [
    "While facial skin often receives carefully calibrated cleansers, the skin covering the rest of the body—particularly the back, shoulders, chest, and neck, which house a high density of sebaceous and eccrine sweat glands—is frequently subjected to harsh, mass-manufactured commercial syndet and tallow detergent bars. These industrial bars strip the body's lipid mantle, leave chalky hard-water soap scum across pores, and trigger post-shower dryness and body congestion.",
    "The Bhumivera Charcoal Deep Cleansing Bar (100 GM · SKU: BV-LUX-CSOAP-04) elevates daily full-body bathing into a handcrafted Ayurvedic apothecary ritual. Compounded in quality-controlled artisanal batches under The Bhumivera Transparency Standard (Est. 2016 lineage), this obsidian bar pairs high-porosity Activated Charcoal with soothing Pure Aloe Vera (Aloe barbadensis Miller) inside a gentle, 100% vegetarian Ayurvedic soap base free from harsh synthetic detergents.",
    "Activated Charcoal functions across the skin of the body through physical adsorption: its vast internal network of micropores binds excess sebum, gym and commute sweat, oxidized body oils, deodorants, and urban airborne particulates without requiring harsh alkaline degreasing agents. Because the carbon powder in the Bhumivera Charcoal Deep Cleansing Bar is finely milled, the bar glides smoothly over the skin without scratching or irritating delicate areas.",
    "To counter the drying tendency of ordinary charcoal soaps, Bhumivera infuses the bar with cold-filleted Aloe Vera inner-leaf mucilage. Rich in acemannan polysaccharides, glycoproteins, and soothing plant sterols, Aloe Vera cushions the lather so that your skin emerges from the bath feeling velvety, calm, and deeply hydrated.",
    "For patrons seeking a complete head-to-toe purifying regimen, the Bhumivera Charcoal Deep Cleansing Bar pairs seamlessly with our Bhumivera Activated Charcoal Purifying Luxury Face Wash (for targeted pH 5.4 facial cleansing) and our Kalpvriksh Satva 7-Tulsi Drops in The Inside-Out Skin-Clearing & Cortisol Ritual Bundle.",
    "If you prefer to rotate your daily bathing bars by skin mood, use the Charcoal Deep Cleansing Bar after workouts or humid outdoor commutes, and alternate with the Bhumivera Soothing Bar (Aloe Vera, Neem & Sacred Tulsi) for calming herbal nourishment."
  ],
  "composition_table": [
    {
      "active": "Activated Charcoal",
      "ingredient": "Activated Charcoal",
      "potency": "Deep Cleansing Core",
      "concentration": "Deep Cleansing Core",
      "classification": "Microporous Activated Carbon",
      "botanical": "Microporous Activated Carbon",
      "inci": "",
      "molecular_markers": "High-Surface-Area Microporous Carbon Lattice (>900 m²/g)",
      "extraction_method": "850°C Steam Activation & Fine Sieve Milling",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)",
      "mechanism": "Draws out deep-seated pore impurities, excess body sebum, sweat residue, and environmental pollutants from face, neck, back, and shoulders.",
      "role": "Draws out deep-seated pore impurities, excess body sebum, sweat residue, and environmental pollutants from face, neck, back, and shoulders.",
      "synergy_partners": "Aloevera Extract + Gentle Ayurvedic Soap Base",
      "reference_url": "https://en.wikipedia.org/wiki/Activated_carbon"
    },
    {
      "active": "Aloevera Extract",
      "ingredient": "Aloevera Extract",
      "potency": "Soothing Hydration Matrix",
      "concentration": "Soothing Hydration Matrix",
      "classification": "Aloe barbadensis miller",
      "botanical": "Aloe barbadensis miller",
      "inci": "",
      "molecular_markers": "Acemannan Polysaccharides, Glucomannans, Amino Acids & Sterols",
      "extraction_method": "Cold Hand-Filleted Mucilage (<28°C)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)",
      "mechanism": "Replenishes skin moisture during bathing, calms heat and dryness, and creates a rich, velvety, non-stripping lather.",
      "role": "Replenishes skin moisture during bathing, calms heat and dryness, and creates a rich, velvety, non-stripping lather.",
      "synergy_partners": "Microporous Activated Charcoal",
      "reference_url": "https://en.wikipedia.org/wiki/Aloe_vera"
    },
    {
      "active": "Ayurvedic Soap Base",
      "ingredient": "Ayurvedic Soap Base",
      "potency": "Q.S. (100 GM Bar)",
      "concentration": "Q.S. (100 GM Bar)",
      "classification": "Gentle Artisanal Soap Base",
      "botanical": "Gentle Artisanal Soap Base",
      "inci": "",
      "molecular_markers": "Retained Natural Plant Glycerin & Mild Fatty Acid Salts",
      "extraction_method": "Small-Batch Cold-Molded Artisanal Curing",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)",
      "mechanism": "Prepared in quality-controlled batches without harsh synthetic detergents, SLS, parabens, or animal tallow for everyday face and body cleansing.",
      "role": "Prepared in quality-controlled batches without harsh synthetic detergents, SLS, parabens, or animal tallow for everyday face and body cleansing.",
      "synergy_partners": "Activated Charcoal + Aloe Vera",
      "reference_url": "https://en.wikipedia.org/wiki/Ayurveda"
    }
  ],
  "specifications": {
    "Brand_Name": "Bhumivera (The Transparent Maison · Est. 2016 Lineage)",
    "Product_Full_Name": "Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)",
    "SKU_Code": "BV-LUX-CSOAP-04",
    "MPN_Code": "BVCSOAP100GM",
    "GTIN_13_EAN": "8906182600049",
    "GST_HSN_Code": "30049011 (Ayurvedic & Botanical Preparations · 5% GST)",
    "Net_Weight_Metric": "100 GM (3.52 oz. Solid Artisanal Bar)",
    "Gross_Dispatch_Weight": "135.0 Grams (±0.5g Digital Scale Verified)",
    "Batch_Number": "SACHS26I (Handcrafted Quality-Controlled Batch)",
    "Manufacturing_Date": "2026-09-01 (24-Month Shelf Life)",
    "Formulation_Standard": "Skin-Friendly Handmade Ayurvedic Bar (Free from Harsh Synthetic Detergents)",
    "Primary_Purifying_Active": "Steam-Activated Microporous Bamboo Charcoal (<15 Microns)",
    "Primary_Soothing_Active": "Pure Aloe Vera (Aloe barbadensis Miller) Inner-Leaf Fillet Extract",
    "Cleansing_Base_Type": "100% Vegetarian Ayurvedic Soap Base with Retained Natural Glycerin",
    "Free_From_Guarantee": "0% SLS/SLES, 0% Parabens, 0% Animal Fat/Tallow, 0% Synthetic Microbeads",
    "Target_Skin_Profiles": "Oily, Combination, Sweat-Prone, Normal & Delicate Skin (Face & Body)",
    "Primary_Bathing_Goals": "Full-Body Pore Detox, Back/Shoulder Clarity, Sweat Removal & Soft Skin",
    "Texture_And_Lather_Profile": "Smooth Obsidian Bar Producing a Creamy, Non-Drying Cushion Lather",
    "Application_Zones": "Daily Full-Body Bathing, Neck, Underarms, Back & Facial Cleansing",
    "Recommended_Ritual_Timing": "Daily Morning & Evening Bathing (Massage lather for 30–45 seconds)",
    "Storage_Instructions": "Keep on a well-drained soap dish between uses in a cool, dry place",
    "Patch_Test_Standard": "24-Hour Inner-Forearm Patch Test Recommended Prior to Initial Use",
    "Brand_Flagship_Entity": "Bhumivera Organics India Private Limited (Inc. August 4, 2026 · Asansol, WB)",
    "Parent_Heritage_Entity": "MPG E-Business Private Limited (Inc. Sept 22, 2016 · CIN: U74999WB2016PTC217735)",
    "Licensed_Manufacturing_Unit": "Sitashi Herbal Industry, H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022",
    "Country_Of_Origin": "Proudly Handcrafted in India (Bharat)"
  },
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
    },
    {
      "name": "Glycerol (Natural Humectant)",
      "url": "https://en.wikipedia.org/wiki/Glycerol"
    }
  ],
  "conscious_buyer_highlights": [
    "Deep-Pore Carbon Purification: Microporous Activated Charcoal lifts excess body oil, back/shoulder sweat congestion, and urban grime.",
    "Soothing Aloe Vera Cushion: Pure Aloe Vera (Aloe barbadensis) inner-leaf extract keeps lather creamy and prevents post-bath skin dryness.",
    "Gentle Ayurvedic Soap Base: Hand-poured in small artisanal batches without harsh synthetic detergents; gentle enough for daily face and body cleansing (24-hour patch test advised).",
    "Long-Lasting 100 GM Solid Bar: Zero plastic bottle waste, ideal for travel and daily luxury bathing."
  ],
  "related_products": [],
  "faqs": [
    {
      "q": "What are the exact ingredients in Bhumivera Charcoal Deep Cleansing Bar?",
      "a": "It is formulated with Activated Charcoal, pure Aloe Vera (Aloevera / Aloe barbadensis), and a gentle Ayurvedic Soap Base in a 100 GM handmade bar free from harsh synthetic detergents."
    },
    {
      "q": "Is Bhumivera Handmade Charcoal Soap suitable for sensitive skin?",
      "a": "Yes. This handmade Ayurvedic cleansing bar is crafted under strict quality control with soothing Aloe Vera and without harsh synthetic detergents, making it gentle for everyday use. As with all botanical products, we recommend a 24-hour patch test before first use."
    },
    {
      "q": "Can I use the Charcoal Deep Cleansing Bar on both my face and body?",
      "a": "Yes, its gentle Ayurvedic base and Aloe Vera cushion make it suitable for both face and body. For dedicated facial cleansing with 0.1% Niacinamide and 0.1% Hyaluronic Acid, you can also pair it with our Bhumivera Activated Charcoal Purifying Luxury Face Wash."
    },
    {
      "q": "Does this charcoal soap help with back acne, body sweat, and oily skin?",
      "a": "Yes. Microporous Activated Charcoal adsorbs excess sebum, sweat residue, and clogged pore debris on the back, shoulders, and chest without over-drying the skin."
    },
    {
      "q": "Will the black charcoal lather stain my skin or bathroom tiles?",
      "a": "No. The micro-milled carbon suspends cleanly in the Aloe-enriched lather and rinses off completely with water, leaving zero residue on skin or tiles."
    },
    {
      "q": "How is Bhumivera Charcoal Soap different from commercial market soaps?",
      "a": "Commercial soaps often remove natural glycerin and rely on harsh synthetic detergents (SLS) and animal tallow. Bhumivera crafts a 100% vegetarian Ayurvedic bar infused with pure Aloe Vera and steam-activated charcoal."
    },
    {
      "q": "How should I store my handmade soap bar so it lasts longer?",
      "a": "Store the bar on a slotted, well-drained soap dish away from direct standing water between showers so the artisanal base stays firm."
    },
    {
      "q": "What is the difference between the Charcoal Deep Cleansing Bar and the Bhumivera Soothing Bar?",
      "a": "The Charcoal Deep Cleansing Bar (₹399) focuses on deep-pore carbon detoxification with Aloe Vera, while the Soothing Bar (₹349) combines Aloe Vera, Neem, and Sacred Tulsi for calming, blemish-clarifying herbal care."
    }
  ]
};

export const ALOE_SOAP_EXACT = {
  "id": 5,
  "name": "Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)",
  "slug": "artisanal-aloe-vera-handmade-soap",
  "rating": 4.68,
  "review_count": 218,
  "reviews": 218,
  "sku": "BV-LUX-ASOAP-05",
  "mpn": "BVASOAP100GM",
  "net_volume": "100 GM",
  "price": 349.0,
  "mrp": 449.0,
  "stock": 300,
  "category": "Artisanal Ayurvedic Cleansing Bars",
  "ph_level": "Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)",
  "active_ingredients": "Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Tulsi (Ocimum tenuiflorum), Pure Ayurvedic Soap Base",
  "image_url": "/images/products/bhumivera-artisanal-aloe-vera-handmade-soap.webp",
  "seo_title": "Bhumivera Soothing Bar (100 GM) | Handmade Aloe Vera, Neem & Tulsi Ayurvedic Soap for Glowing & Clear Skin",
  "meta_description": "Shop Bhumivera Soothing Bar (100 GM): a handmade Ayurvedic cleansing bar infused with Aloe Vera, Neem, and Sacred Tulsi for smooth, clarified, and glowing skin.",
  "short_description": "Bhumivera Soothing Bar (100 GM)—a handmade Ayurvedic Cleansing Bar infused with Aloe Vera, Neem, and Sacred Tulsi for glowing, smooth, and clarified skin. Crafted in a gentle base free from harsh synthetic detergents.",
  "full_description": "<article class=\"bhumivera-monograph space-y-6\">\n  <h3>The Classic Trinity of Ayurveda: Handmade Aloe Vera, Neem & Sacred Tulsi Soothing Bar for Glowing, Clear Skin</h3>\n  <p><strong>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap) (100 GM · SKU: BV-LUX-ASOAP-05)</strong> is a flagship formulation from <a href=\"https://bhumivera.com\"><strong>Bhumivera — The Transparent Maison</strong></a> (<a href=\"https://bhumivera.com/about\">Bhumivera Organics India Private Limited</a>, incorporated August 4, 2026 under Founder <strong>Akash Prasad</strong> and Directors <strong>Akash Prasad, Payal Prasad &amp; Aman Prasad</strong>), rooted in the 10-year herbal manufacturing and household distribution heritage of <a href=\"https://bhumivera.com/mpgebusiness\"><strong>MPG E-Business Private Limited</strong></a> (established September 22, 2016 in Asansol, West Bengal · CIN: <code>U74999WB2016PTC217735</code> · Founder: <strong>Dilip Prasad Nonia</strong>). Engineered under <em>The Bhumivera Transparency Standard (Est. 2016 lineage)</em>, this formulation prints 100% of its functional active concentrations openly on the physical bottle label: <strong>Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Tulsi (Ocimum tenuiflorum), Pure Ayurvedic Soap Base</strong>, calibrated to <strong>Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)</strong>.</p>\n  <p>In classical Indian household wellness—a tradition our parent heritage enterprise MPG E-Business Private Limited has championed in Asansol, West Bengal since September 22, 2016—three botanicals stand unmatched for daily skin harmony: Aloe Vera (Kumari), Neem (Nimba), and Sacred Tulsi (Surasa). When skin is exposed to heat, humidity, sweat, friction, or seasonal dryness, it needs a cleanser that clarifies surface microbes without stripping the epidermal moisture barrier.</p><p>The Bhumivera Soothing Bar (100 GM · SKU: BV-LUX-ASOAP-05) brings this sacred Ayurvedic trio together in a handcrafted luxury bathing bar. Formulated with pure Aloe Vera inner-leaf fillet, clarifying Neem leaf extract, and antioxidant-rich Sacred Tulsi inside a mild, detergent-free Ayurvedic soap base, it leaves both face and body feeling calm, smooth, clarified, and naturally luminous.</p>\n\n  <h3>I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters</h3>\n  <p>Each botanical in the Bhumivera Soothing Bar performs a distinct, complementary biochemical role during bathing. Cold-filleted Aloe Vera (Aloe barbadensis Miller) supplies long-chain acemannan mucopolysaccharides that form a soothing, water-binding film over the stratum corneum, cooling heat-flushed skin and preventing post-bath tightness.</p><p>Simultaneously, Neem (Azadirachta indica, rich in nimbidin and quercetin limonoids) and Sacred Tulsi (Ocimum tenuiflorum, rich in eugenol, ursolic acid, and rosmarinic acid) purify pores and help maintain a balanced cutaneous microbiome—making this bar especially comforting during prickly summer heat, humid monsoons, and seasonal transitions.</p>\n  <p>For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque <code>&ldquo;Aqua / Base Q.S.&rdquo;</code> disclosure on the back—where high-value botanicals like <a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Himalayan Sea Buckthorn</a>, <a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Manjistha (Rubia cordifolia)</a>, <a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Haridra (Curcuma longa)</a>, <a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reetha (Sapindus mukorossi)</a>, and <a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Sacred Tulsi (Ocimum tenuiflorum)</a> are dusted in at trace levels below 0.01% and boiled at 80°C–100°C. <a href=\"https://bhumivera.com/science\">Bhumivera’s Sub-28°C Formulation Lab</a> eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Niacinamide Vitamin B3</a>, <a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Multi-Molecular Hyaluronic Acid</a>, and Plant-Derived Glycerin) at full, verifiable label potencies.</p>\n\n  <h4>Complete Active Ingredient &amp; Phytochemical Monograph Table (100 GM)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Disclosed Active &amp; INCI</th>\n          <th>Label Potency</th>\n          <th>Botanical / Chemical Class &amp; Reference</th>\n          <th>Extraction &amp; Harvest Corridor</th>\n          <th>Dermal / Trichological / Cellular Mechanism</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Aloevera (Aloe Vera)</strong><br/><small>Aloe barbadensis Miller Inner-Leaf Fillet Gel</small></td>\n          <td><strong>Primary Soothing Active</strong></td>\n          <td>Aloe barbadensis miller (<a href=\"https://en.wikipedia.org/wiki/Aloe_vera\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold Hand-Filleted Inner Mucilage (<28°C) · <a href=\"/provenance-engine\">REG-04 · Thar Edge Organic Belts, Rajasthan</a></td>\n          <td>Hydrates outer skin layers, cools heat and dryness, and imparts a smooth, dewy, glowing finish after bathing.</td>\n        </tr><tr>\n          <td><strong>Neem Extract</strong><br/><small>Azadirachta indica Leaf Extract</small></td>\n          <td><strong>Purifying Botanical Clarifier</strong></td>\n          <td>Azadirachta indica (<a href=\"https://en.wikipedia.org/wiki/Azadirachta_indica\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Leaf Infusion · <a href=\"/provenance-engine\">REG-05 · Central & Eastern India Botanical Cooperatives</a></td>\n          <td>Helps keep blemish-prone, heat-stressed, and monsoon-exposed skin clean, fresh, and clarified.</td>\n        </tr><tr>\n          <td><strong>Tulsi (Holy Basil)</strong><br/><small>Ocimum tenuiflorum Leaf Extract</small></td>\n          <td><strong>Adaptogenic Herbal Purifier</strong></td>\n          <td>Ocimum tenuiflorum (<a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Herbal Infusion · <a href=\"/provenance-engine\">REG-05 · Vrindavan & Central India Tulsi Sanctuaries</a></td>\n          <td>Rich in natural eugenol and rosmarinic acid antioxidants that refresh pores, calm environmental stress, and support radiant skin.</td>\n        </tr><tr>\n          <td><strong>Ayurvedic Soap Base</strong><br/><small>Artisanal Vegetarian Glycerin-Retained Soap Base</small></td>\n          <td><strong>Q.S. (100 GM Bar)</strong></td>\n          <td>Gentle Artisanal Base (<a href=\"https://en.wikipedia.org/wiki/Ayurveda\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Small-Batch Cold-Molded Curing · <a href=\"/provenance-engine\">REG-06 · GMP Artisanal Soap Atelier</a></td>\n          <td>Crafted under strict quality control without harsh synthetic chemicals, SLS/SLES, or animal tallow.</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3>II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin))</h3>\n  <p>Unlike mass-market herbal soaps that use synthetic green dyes and harsh sodium tallowate or SLS detergents, the Bhumivera Soothing Bar is hand-poured in a 100% vegetarian Ayurvedic base that retains natural plant glycerin. It is featured in our Royal Skin & Scalp Stewardship Trio alongside the 4% Himalayan Sea Buckthorn Face Wash and Royal 2-in-1 Botanical Shampoo.</p><p>For an inside-out Tulsi ritual, pair your daily bath with the Bhumivera Soothing Bar alongside 3–4 internal drops of Bhumivera Kalpvriksh Satva Tulsi (7-Tulsi Liquid Extract) in warm water.</p>\n  <p>Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically <em>beta-glucocerebrosidase</em> and <em>acidic sphingomyelinase</em>—require an acidic microenvironment between <strong>pH 4.7 and 5.75</strong> to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating <strong>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)</strong> to <strong>Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)</strong> and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our <a href=\"/verify\">Bottle Serial &amp; COA Verification Portal</a> and <a href=\"/somatic-registry\">Somatic INCI Label Registry</a>), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it.</p>\n\n  <h3>III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule</h3>\n  <p>Moisten skin with lukewarm water, work the Bhumivera Soothing Bar into a rich, creamy lather between your palms, and massage gently over your face and body for 30 to 45 seconds before rinsing clean. Pat dry with a soft towel.</p>\n  <ul>\n    <li><strong>Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):</strong> Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer.</li>\n    <li><strong>Step 2 — Measured Dispensing &amp; Palmar Emulsification:</strong> Dispense the recommended dose of <strong>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)</strong> into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp.</li>\n    <li><strong>Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:</strong> Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives (<strong>Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Tulsi (Ocimum tenuiflorum), Pure Ayurvedic Soap Base</strong>) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates.</li>\n    <li><strong>Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:</strong> Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary <a href=\"/shop\">Bhumivera Inside-Out Ritual</a> formulations.</li>\n    <li><strong>Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:</strong> Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility (<a href=\"/lab\">read our full Cleanroom &amp; Patch-Test Protocol</a>).</li>\n  </ul>\n\n  <h3>IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter)</h3>\n  <p>During hot Indian summers and humid monsoons, Neem and Tulsi refresh sweat-prone skin and calm heat rashes. During dry autumns and winters, Aloe Vera's polysaccharide cushion keeps skin supple, smooth, and flake-free.</p>\n  <p>Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum. <strong>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)</strong> is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration.</p>\n\n  <h3>V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem</h3>\n  <p>Every formulation in the <a href=\"/shop\">Bhumivera 6-Product Flagship Catalog</a> is engineered to work as part of an interconnected, inside-out botanical system. Explore how <strong>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)</strong> pairs with our companion formulations:</p>\n  <ul>\n    <li><strong>1. <a href=\"/product/activated-charcoal-luxury-face-wash\">Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699)</a>:</strong> Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification.</li>\n    <li><strong>2. <a href=\"/product/himalayan-seabuckthorn-luxury-face-wash\">Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799)</a>:</strong> Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity.</li>\n    <li><strong>3. <a href=\"/product/luxury-2-in-1-botanical-shampoo-conditioner\">Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899)</a>:</strong> Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing.</li>\n    <li><strong>4. <a href=\"/product/artisanal-charcoal-handmade-soap\">Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399)</a>:</strong> Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification.</li>\n    <li><strong>5. <a href=\"/product/artisanal-aloe-vera-handmade-soap\">Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349)</a>:</strong> Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care.</li>\n    <li><strong>6. <a href=\"/product/kalpvriksh-satva-tulsi-7-tulsi-extract\">Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499)</a>:</strong> Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality.</li>\n  </ul>\n  <p>You can also acquire coordinated sets in our <a href=\"/combo/bundle-daily-regimen\">Grand Maison 4-Piece Daily Apothecary Bundle</a>, <a href=\"/combo/bundle-royal-crown-trio\">Royal Skin &amp; Scalp Stewardship Trio</a>, <a href=\"/combo/bundle-inside-out-ritual\">Inside-Out Skin-Clearing &amp; Cortisol Ritual</a>, or the collector’s <a href=\"/combo/bundle-grand-maison-vault\">Grand Maison 6-Piece Apothecary Vault</a>, or compare any two formulations side-by-side on our <a href=\"/compare\">Interactive Formulation Comparison Tool</a>.</p>\n\n  <h3>VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact</h3>\n  <p>Compounded in Batch #SANTS26I under strict cleanroom quality control, every 100 GM Bhumivera Soothing Bar upholds our 100% Virgin Sanitary Custody Standard.</p>\n  <p>Every unit of <strong>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)</strong> is traceable through our <a href=\"/provenance-engine\">6-Corridor Indian Botanical Provenance Engine</a> and protected by <a href=\"/purchase-protection\">Bhumivera White-Glove Purchase Protection</a>. To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard (<a href=\"/legal/shipping-hygiene\">Part II of the Bhumivera Legal Suite</a>) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch (<a href=\"/order-tracking\">track live AWB &amp; dispatch weight logs</a>). Furthermore, every order supports our verifiable community initiatives documented on the <a href=\"/impact\">Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact)</a>—including <a href=\"/impact/stray-animal-care\">The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative</a> and <a href=\"/impact/elderly-disabled-rations\">The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative</a> in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors (<a href=\"/impact/damodar-cleanup\">Damodar Riverbank Vetiver Cleanup</a>, <a href=\"/impact/jute-sapling-nursery\">Biodegradable Jute Sapling Nursery</a>, <a href=\"/impact/village-pukur-revival\">Village Pukur Pond Revival</a>, <a href=\"/impact/herbal-kitchen-gardens\">Medicinal Herbal Kitchen Gardens</a>, <a href=\"/impact/mandi-vermicomposting\">Mandi Waste Vermicomposting</a>, and <a href=\"/impact/coal-belt-microgrove\">Coal-Belt Native Micro-Grove</a>).</p>\n\n  <h4>Technical &amp; Regulatory Specification Summary (BV-LUX-ASOAP-05)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Specification Parameter</th>\n          <th>Verified Bhumivera Standard</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Brand Name</strong></td>\n          <td>Bhumivera (The Transparent Maison · Est. 2016 Lineage)</td>\n        </tr><tr>\n          <td><strong>Product Full Name</strong></td>\n          <td>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)</td>\n        </tr><tr>\n          <td><strong>SKU Code</strong></td>\n          <td>BV-LUX-ASOAP-05</td>\n        </tr><tr>\n          <td><strong>MPN Code</strong></td>\n          <td>BVASOAP100GM</td>\n        </tr><tr>\n          <td><strong>GTIN 13 EAN</strong></td>\n          <td>8906182600056</td>\n        </tr><tr>\n          <td><strong>GST HSN Code</strong></td>\n          <td>30049011 (Ayurvedic & Botanical Preparations · 5% GST)</td>\n        </tr><tr>\n          <td><strong>Net Weight Metric</strong></td>\n          <td>100 GM (3.52 oz. Solid Artisanal Bar)</td>\n        </tr><tr>\n          <td><strong>Gross Dispatch Weight</strong></td>\n          <td>134.5 Grams (±0.5g Digital Scale Verified)</td>\n        </tr><tr>\n          <td><strong>Batch Number</strong></td>\n          <td>SANTS26I (Handcrafted Quality-Controlled Batch)</td>\n        </tr><tr>\n          <td><strong>Manufacturing Date</strong></td>\n          <td>2026-09-01 (24-Month Shelf Life)</td>\n        </tr><tr>\n          <td><strong>Formulation Standard</strong></td>\n          <td>Gentle Ayurvedic Soothing Bar (Zero Harsh Synthetic Detergents)</td>\n        </tr><tr>\n          <td><strong>Primary Soothing Active</strong></td>\n          <td>Pure Aloe Vera (Aloe barbadensis Miller) Inner-Leaf Fillet Gel</td>\n        </tr><tr>\n          <td><strong>Primary Clarifying Actives</strong></td>\n          <td>Neem (Azadirachta indica) + Sacred Tulsi (Ocimum tenuiflorum)</td>\n        </tr><tr>\n          <td><strong>Cleansing Base Type</strong></td>\n          <td>100% Vegetarian Ayurvedic Soap Base with Retained Natural Glycerin</td>\n        </tr><tr>\n          <td><strong>Free From Guarantee</strong></td>\n          <td>0% SLS/SLES, 0% Parabens, 0% Animal Fat/Tallow, 0% Harsh Detergents</td>\n        </tr><tr>\n          <td><strong>Target Skin Profiles</strong></td>\n          <td>Sensitive, Delicate, Blemish-Prone, Dry, Normal & Combination Skin</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</article>",
  "description": "The Classic Trinity of Ayurveda: Handmade Aloe Vera, Neem & Sacred Tulsi Soothing Bar for Glowing, Clear Skin \n    Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap) (100 GM · SKU: BV-LUX-ASOAP-05)  is a flagship formulation from   Bhumivera — The Transparent Maison   ( Bhumivera Organics India Private Limited , incorporated August 4, 2026 under Founder  Akash Prasad  and Directors  Akash Prasad, Payal Prasad &amp; Aman Prasad ), rooted in the 10-year herbal manufacturing and household distribution heritage of   MPG E-Business Private Limited   (established September 22, 2016 in Asansol, West Bengal · CIN:  U74999WB2016PTC217735  · Founder:  Dilip Prasad Nonia ). Engineered under  The Bhumivera Transparency Standard (Est. 2016 lineage) , this formulation prints 100% of its functional active concentrations openly on the physical bottle label:  Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Tulsi (Ocimum tenuiflorum), Pure Ayurvedic Soap Base , calibrated to  Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin) . \n   In classical Indian household wellness—a tradition our parent heritage enterprise MPG E-Business Private Limited has championed in Asansol, West Bengal since September 22, 2016—three botanicals stand unmatched for daily skin harmony: Aloe Vera (Kumari), Neem (Nimba), and Sacred Tulsi (Surasa). When skin is exposed to heat, humidity, sweat, friction, or seasonal dryness, it needs a cleanser that clarifies surface microbes without stripping the epidermal moisture barrier.  The Bhumivera Soothing Bar (100 GM · SKU: BV-LUX-ASOAP-05) brings this sacred Ayurvedic trio together in a handcrafted luxury bathing bar. Formulated with pure Aloe Vera inner-leaf fillet, clarifying Neem leaf extract, and antioxidant-rich Sacred Tulsi inside a mild, detergent-free Ayurvedic soap base, it leaves both face and body feeling calm, smooth, clarified, and naturally luminous. \n\n   I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters \n   Each botanical in the Bhumivera Soothing Bar performs a distinct, complementary biochemical role during bathing. Cold-filleted Aloe Vera (Aloe barbadensis Miller) supplies long-chain acemannan mucopolysaccharides that form a soothing, water-binding film over the stratum corneum, cooling heat-flushed skin and preventing post-bath tightness.  Simultaneously, Neem (Azadirachta indica, rich in nimbidin and quercetin limonoids) and Sacred Tulsi (Ocimum tenuiflorum, rich in eugenol, ursolic acid, and rosmarinic acid) purify pores and help maintain a balanced cutaneous microbiome—making this bar especially comforting during prickly summer heat, humid monsoons, and seasonal transitions. \n   For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque  &ldquo;Aqua / Base Q.S.&rdquo;  disclosure on the back—where high-value botanicals like  Himalayan Sea Buckthorn ,  Manjistha (Rubia cordifolia) ,  Haridra (Curcuma longa) ,  Reetha (Sapindus mukorossi) , and  Sacred Tulsi (Ocimum tenuiflorum)  are dusted in at trace levels below 0.01% and boiled at 80°C–100°C.  Bhumivera’s Sub-28°C Formulation Lab  eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants ( Niacinamide Vitamin B3 ,  Multi-Molecular Hyaluronic Acid , and Plant-Derived Glycerin) at full, verifiable label potencies. \n\n   Complete Active Ingredient &amp; Phytochemical Monograph Table (100 GM) \n   \n     \n       \n         \n           Disclosed Active &amp; INCI \n           Label Potency \n           Botanical / Chemical Class &amp; Reference \n           Extraction &amp; Harvest Corridor \n           Dermal / Trichological / Cellular Mechanism \n         \n       \n       \n         \n            Aloevera (Aloe Vera)   Aloe barbadensis Miller Inner-Leaf Fillet Gel  \n            Primary Soothing Active  \n           Aloe barbadensis miller ( Reference ↗ ) \n           Cold Hand-Filleted Inner Mucilage ( REG-04 · Thar Edge Organic Belts, Rajasthan  \n           Hydrates outer skin layers, cools heat and dryness, and imparts a smooth, dewy, glowing finish after bathing. \n          \n            Neem Extract   Azadirachta indica Leaf Extract  \n            Purifying Botanical Clarifier  \n           Azadirachta indica ( Reference ↗ ) \n           Sub-28°C Cold Leaf Infusion ·  REG-05 · Central & Eastern India Botanical Cooperatives  \n           Helps keep blemish-prone, heat-stressed, and monsoon-exposed skin clean, fresh, and clarified. \n          \n            Tulsi (Holy Basil)   Ocimum tenuiflorum Leaf Extract  \n            Adaptogenic Herbal Purifier  \n           Ocimum tenuiflorum ( Reference ↗ ) \n           Sub-28°C Cold Herbal Infusion ·  REG-05 · Vrindavan & Central India Tulsi Sanctuaries  \n           Rich in natural eugenol and rosmarinic acid antioxidants that refresh pores, calm environmental stress, and support radiant skin. \n          \n            Ayurvedic Soap Base   Artisanal Vegetarian Glycerin-Retained Soap Base  \n            Q.S. (100 GM Bar)  \n           Gentle Artisanal Base ( Reference ↗ ) \n           Small-Batch Cold-Molded Curing ·  REG-06 · GMP Artisanal Soap Atelier  \n           Crafted under strict quality control without harsh synthetic chemicals, SLS/SLES, or animal tallow. \n         \n       \n     \n   \n\n   II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)) \n   Unlike mass-market herbal soaps that use synthetic green dyes and harsh sodium tallowate or SLS detergents, the Bhumivera Soothing Bar is hand-poured in a 100% vegetarian Ayurvedic base that retains natural plant glycerin. It is featured in our Royal Skin & Scalp Stewardship Trio alongside the 4% Himalayan Sea Buckthorn Face Wash and Royal 2-in-1 Botanical Shampoo.  For an inside-out Tulsi ritual, pair your daily bath with the Bhumivera Soothing Bar alongside 3–4 internal drops of Bhumivera Kalpvriksh Satva Tulsi (7-Tulsi Liquid Extract) in warm water. \n   Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically  beta-glucocerebrosidase  and  acidic sphingomyelinase —require an acidic microenvironment between  pH 4.7 and 5.75  to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating  Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)  to  Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)  and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our  Bottle Serial &amp; COA Verification Portal  and  Somatic INCI Label Registry ), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it. \n\n   III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule \n   Moisten skin with lukewarm water, work the Bhumivera Soothing Bar into a rich, creamy lather between your palms, and massage gently over your face and body for 30 to 45 seconds before rinsing clean. Pat dry with a soft towel. \n   \n      Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):  Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer. \n      Step 2 — Measured Dispensing &amp; Palmar Emulsification:  Dispense the recommended dose of  Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)  into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp. \n      Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:  Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives ( Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Tulsi (Ocimum tenuiflorum), Pure Ayurvedic Soap Base ) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates. \n      Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:  Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary  Bhumivera Inside-Out Ritual  formulations. \n      Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:  Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility ( read our full Cleanroom &amp; Patch-Test Protocol ). \n   \n\n   IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter) \n   During hot Indian summers and humid monsoons, Neem and Tulsi refresh sweat-prone skin and calm heat rashes. During dry autumns and winters, Aloe Vera's polysaccharide cushion keeps skin supple, smooth, and flake-free. \n   Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum.  Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)  is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration. \n\n   V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem \n   Every formulation in the  Bhumivera 6-Product Flagship Catalog  is engineered to work as part of an interconnected, inside-out botanical system. Explore how  Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)  pairs with our companion formulations: \n   \n      1.  Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699) :  Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification. \n      2.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799) :  Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity. \n      3.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899) :  Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing. \n      4.  Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399) :  Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification. \n      5.  Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349) :  Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care. \n      6.  Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499) :  Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality. \n   \n   You can also acquire coordinated sets in our  Grand Maison 4-Piece Daily Apothecary Bundle ,  Royal Skin &amp; Scalp Stewardship Trio ,  Inside-Out Skin-Clearing &amp; Cortisol Ritual , or the collector’s  Grand Maison 6-Piece Apothecary Vault , or compare any two formulations side-by-side on our  Interactive Formulation Comparison Tool . \n\n   VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact \n   Compounded in Batch #SANTS26I under strict cleanroom quality control, every 100 GM Bhumivera Soothing Bar upholds our 100% Virgin Sanitary Custody Standard. \n   Every unit of  Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)  is traceable through our  6-Corridor Indian Botanical Provenance Engine  and protected by  Bhumivera White-Glove Purchase Protection . To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard ( Part II of the Bhumivera Legal Suite ) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch ( track live AWB &amp; dispatch weight logs ). Furthermore, every order supports our verifiable community initiatives documented on the  Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact) —including  The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative  and  The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative  in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors ( Damodar Riverbank Vetiver Cleanup ,  Biodegradable Jute Sapling Nursery ,  Village Pukur Pond Revival ,  Medicinal Herbal Kitchen Gardens ,  Mandi Waste Vermicomposting , and  Coal-Belt Native Micro-Grove ). \n\n   Technical &amp; Regulatory Specification Summary (BV-LUX-ASOAP-05) \n   \n     \n       \n         \n           Specification Parameter \n           Verified Bhumivera Standard \n         \n       \n       \n         \n            Brand Name  \n           Bhumivera (The Transparent Maison · Est. 2016 Lineage) \n          \n            Product Full Name  \n           Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap) \n          \n            SKU Code  \n           BV-LUX-ASOAP-05 \n          \n            MPN Code  \n           BVASOAP100GM \n          \n            GTIN 13 EAN  \n           8906182600056 \n          \n            GST HSN Code  \n           30049011 (Ayurvedic & Botanical Preparations · 5% GST) \n          \n            Net Weight Metric  \n           100 GM (3.52 oz. Solid Artisanal Bar) \n          \n            Gross Dispatch Weight  \n           134.5 Grams (±0.5g Digital Scale Verified) \n          \n            Batch Number  \n           SANTS26I (Handcrafted Quality-Controlled Batch) \n          \n            Manufacturing Date  \n           2026-09-01 (24-Month Shelf Life) \n          \n            Formulation Standard  \n           Gentle Ayurvedic Soothing Bar (Zero Harsh Synthetic Detergents) \n          \n            Primary Soothing Active  \n           Pure Aloe Vera (Aloe barbadensis Miller) Inner-Leaf Fillet Gel \n          \n            Primary Clarifying Actives  \n           Neem (Azadirachta indica) + Sacred Tulsi (Ocimum tenuiflorum) \n          \n            Cleansing Base Type  \n           100% Vegetarian Ayurvedic Soap Base with Retained Natural Glycerin \n          \n            Free From Guarantee  \n           0% SLS/SLES, 0% Parabens, 0% Animal Fat/Tallow, 0% Harsh Detergents \n          \n            Target Skin Profiles  \n           Sensitive, Delicate, Blemish-Prone, Dry, Normal & Combination Skin",
  "editorial_heading": "The Classic Trinity of Ayurveda: Handmade Aloe Vera, Neem & Sacred Tulsi Soothing Bar for Glowing, Clear Skin",
  "editorial_paragraphs": [
    "In classical Indian household wellness—a tradition our parent heritage enterprise MPG E-Business Private Limited has championed in Asansol, West Bengal since September 22, 2016—three botanicals stand unmatched for daily skin harmony: Aloe Vera (Kumari), Neem (Nimba), and Sacred Tulsi (Surasa). When skin is exposed to heat, humidity, sweat, friction, or seasonal dryness, it needs a cleanser that clarifies surface microbes without stripping the epidermal moisture barrier.",
    "The Bhumivera Soothing Bar (100 GM · SKU: BV-LUX-ASOAP-05) brings this sacred Ayurvedic trio together in a handcrafted luxury bathing bar. Formulated with pure Aloe Vera inner-leaf fillet, clarifying Neem leaf extract, and antioxidant-rich Sacred Tulsi inside a mild, detergent-free Ayurvedic soap base, it leaves both face and body feeling calm, smooth, clarified, and naturally luminous.",
    "Each botanical in the Bhumivera Soothing Bar performs a distinct, complementary biochemical role during bathing. Cold-filleted Aloe Vera (Aloe barbadensis Miller) supplies long-chain acemannan mucopolysaccharides that form a soothing, water-binding film over the stratum corneum, cooling heat-flushed skin and preventing post-bath tightness.",
    "Simultaneously, Neem (Azadirachta indica, rich in nimbidin and quercetin limonoids) and Sacred Tulsi (Ocimum tenuiflorum, rich in eugenol, ursolic acid, and rosmarinic acid) purify pores and help maintain a balanced cutaneous microbiome—making this bar especially comforting during prickly summer heat, humid monsoons, and seasonal transitions.",
    "Unlike mass-market herbal soaps that use synthetic green dyes and harsh sodium tallowate or SLS detergents, the Bhumivera Soothing Bar is hand-poured in a 100% vegetarian Ayurvedic base that retains natural plant glycerin. It is featured in our Royal Skin & Scalp Stewardship Trio alongside the 4% Himalayan Sea Buckthorn Face Wash and Royal 2-in-1 Botanical Shampoo.",
    "For an inside-out Tulsi ritual, pair your daily bath with the Bhumivera Soothing Bar alongside 3–4 internal drops of Bhumivera Kalpvriksh Satva Tulsi (7-Tulsi Liquid Extract) in warm water."
  ],
  "composition_table": [
    {
      "active": "Aloevera (Aloe Vera)",
      "ingredient": "Aloevera (Aloe Vera)",
      "potency": "Primary Soothing Active",
      "concentration": "Primary Soothing Active",
      "classification": "Aloe barbadensis miller",
      "botanical": "Aloe barbadensis miller",
      "inci": "",
      "molecular_markers": "Acemannan Polysaccharides, Amino Acids, Vitamins A/C/E & Plant Sterols",
      "extraction_method": "Cold Hand-Filleted Inner Mucilage (<28°C)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)",
      "mechanism": "Hydrates outer skin layers, cools heat and dryness, and imparts a smooth, dewy, glowing finish after bathing.",
      "role": "Hydrates outer skin layers, cools heat and dryness, and imparts a smooth, dewy, glowing finish after bathing.",
      "synergy_partners": "Neem Extract + Sacred Tulsi",
      "reference_url": "https://en.wikipedia.org/wiki/Aloe_vera"
    },
    {
      "active": "Neem Extract",
      "ingredient": "Neem Extract",
      "potency": "Purifying Botanical Clarifier",
      "concentration": "Purifying Botanical Clarifier",
      "classification": "Azadirachta indica",
      "botanical": "Azadirachta indica",
      "inci": "",
      "molecular_markers": "Nimbidin, Nimbin, Quercetin & Limonoids",
      "extraction_method": "Sub-28°C Cold Leaf Infusion",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)",
      "mechanism": "Helps keep blemish-prone, heat-stressed, and monsoon-exposed skin clean, fresh, and clarified.",
      "role": "Helps keep blemish-prone, heat-stressed, and monsoon-exposed skin clean, fresh, and clarified.",
      "synergy_partners": "Sacred Tulsi + Aloe Vera",
      "reference_url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
    },
    {
      "active": "Tulsi (Holy Basil)",
      "ingredient": "Tulsi (Holy Basil)",
      "potency": "Adaptogenic Herbal Purifier",
      "concentration": "Adaptogenic Herbal Purifier",
      "classification": "Ocimum tenuiflorum",
      "botanical": "Ocimum tenuiflorum",
      "inci": "",
      "molecular_markers": "Eugenol, Rosmarinic Acid, Ursolic Acid & Carvacrol",
      "extraction_method": "Sub-28°C Cold Herbal Infusion",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)",
      "mechanism": "Rich in natural eugenol and rosmarinic acid antioxidants that refresh pores, calm environmental stress, and support radiant skin.",
      "role": "Rich in natural eugenol and rosmarinic acid antioxidants that refresh pores, calm environmental stress, and support radiant skin.",
      "synergy_partners": "Neem Extract + Aloe Vera",
      "reference_url": "https://en.wikipedia.org/wiki/Ocimum_tenuiflorum"
    },
    {
      "active": "Ayurvedic Soap Base",
      "ingredient": "Ayurvedic Soap Base",
      "potency": "Q.S. (100 GM Bar)",
      "concentration": "Q.S. (100 GM Bar)",
      "classification": "Gentle Artisanal Base",
      "botanical": "Gentle Artisanal Base",
      "inci": "",
      "molecular_markers": "Plant-Derived Fatty Acid Salts & Natural Glycerin",
      "extraction_method": "Small-Batch Cold-Molded Curing",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)",
      "mechanism": "Crafted under strict quality control without harsh synthetic chemicals, SLS/SLES, or animal tallow.",
      "role": "Crafted under strict quality control without harsh synthetic chemicals, SLS/SLES, or animal tallow.",
      "synergy_partners": "Aloe Vera + Neem + Tulsi",
      "reference_url": "https://en.wikipedia.org/wiki/Ayurveda"
    }
  ],
  "specifications": {
    "Brand_Name": "Bhumivera (The Transparent Maison · Est. 2016 Lineage)",
    "Product_Full_Name": "Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)",
    "SKU_Code": "BV-LUX-ASOAP-05",
    "MPN_Code": "BVASOAP100GM",
    "GTIN_13_EAN": "8906182600056",
    "GST_HSN_Code": "30049011 (Ayurvedic & Botanical Preparations · 5% GST)",
    "Net_Weight_Metric": "100 GM (3.52 oz. Solid Artisanal Bar)",
    "Gross_Dispatch_Weight": "134.5 Grams (±0.5g Digital Scale Verified)",
    "Batch_Number": "SANTS26I (Handcrafted Quality-Controlled Batch)",
    "Manufacturing_Date": "2026-09-01 (24-Month Shelf Life)",
    "Formulation_Standard": "Gentle Ayurvedic Soothing Bar (Zero Harsh Synthetic Detergents)",
    "Primary_Soothing_Active": "Pure Aloe Vera (Aloe barbadensis Miller) Inner-Leaf Fillet Gel",
    "Primary_Clarifying_Actives": "Neem (Azadirachta indica) + Sacred Tulsi (Ocimum tenuiflorum)",
    "Cleansing_Base_Type": "100% Vegetarian Ayurvedic Soap Base with Retained Natural Glycerin",
    "Free_From_Guarantee": "0% SLS/SLES, 0% Parabens, 0% Animal Fat/Tallow, 0% Harsh Detergents",
    "Target_Skin_Profiles": "Sensitive, Delicate, Blemish-Prone, Dry, Normal & Combination Skin",
    "Primary_Bathing_Goals": "Soothing Hydration, Prickly-Heat & Blemish Clarity, Smooth Luminous Skin",
    "Texture_And_Lather_Profile": "Botanical Emerald-Cream Bar with Silky, Moisture-Rich Lather",
    "Application_Zones": "Gentle Daily Face & Full-Body Cleansing for All Adult Skin Profiles",
    "Recommended_Ritual_Timing": "Twice Daily Morning & Evening Bathing Ritual (30–45s Massage)",
    "Storage_Instructions": "Store on a dry, ventilated soap dish away from direct standing water",
    "Patch_Test_Standard": "24-Hour Inner-Forearm Patch Test Recommended Prior to First Use",
    "Brand_Flagship_Entity": "Bhumivera Organics India Private Limited (Inc. August 4, 2026 · Asansol, WB)",
    "Parent_Heritage_Entity": "MPG E-Business Private Limited (Inc. Sept 22, 2016 · CIN: U74999WB2016PTC217735)",
    "Licensed_Manufacturing_Unit": "Sitashi Herbal Industry, H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022",
    "Country_Of_Origin": "Proudly Handcrafted in India (Bharat)"
  },
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
    },
    {
      "name": "Ayurveda",
      "url": "https://en.wikipedia.org/wiki/Ayurveda"
    }
  ],
  "conscious_buyer_highlights": [
    "Sacred Ayurvedic Trio: Combines soothing Aloe Vera (Aloe barbadensis) with clarifying Neem (Azadirachta indica) and antioxidant-rich Sacred Tulsi (Ocimum tenuiflorum).",
    "Smooth & Luminous Finish: Hydrates outer skin layers while cleansing so skin feels soft, calm, and refreshed.",
    "Zero Harsh Synthetic Detergents: Handcrafted in a gentle vegetarian Ayurvedic base suitable for everyday face and body cleansing.",
    "Family & Sensitive Skin Friendly: Mild botanical bathing ritual backed by the 10-year MPG E-Business heritage (24-hour patch test advised)."
  ],
  "related_products": [],
  "faqs": [
    {
      "q": "What makes Bhumivera Soothing Bar ideal for glowing and blemish-prone skin?",
      "a": "Unlike ordinary soaps that strip skin moisture, Bhumivera Soothing Bar pairs hydrating Aloe Vera with purifying Neem and antioxidant Tulsi in a gentle Ayurvedic soap base—clarifying pores while keeping skin soft and luminous."
    },
    {
      "q": "Can Bhumivera Aloe Vera, Neem & Tulsi Soothing Bar be used on sensitive skin?",
      "a": "Yes. It is crafted under strict quality control without harsh synthetic detergents. We recommend a standard 24-hour inner-forearm patch test before first use."
    },
    {
      "q": "What are the exact ingredients in the Bhumivera Soothing Bar?",
      "a": "It is formulated with Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Sacred Tulsi (Ocimum tenuiflorum), and a pure vegetarian Ayurvedic Soap Base in a 100 GM handmade bar."
    },
    {
      "q": "Can I use the Soothing Bar for daily facial and body washing?",
      "a": "Yes. Its mild, detergent-free Ayurvedic base and high Aloe Vera content make it gentle enough for both face and full-body daily bathing."
    },
    {
      "q": "How does Neem and Tulsi help skin during summer and monsoon seasons?",
      "a": "Neem (nimbidin) and Tulsi (eugenol and rosmarinic acid) naturally clarify sweat, humidity-induced oiliness, and surface grime while Aloe Vera cools heat-flushed skin."
    },
    {
      "q": "Does Bhumivera Soothing Bar contain animal fat or SLS?",
      "a": "No. It is 100% vegetarian, cruelty-free, and formulated without SLS/SLES sulfates, parabens, or harsh synthetic detergents."
    },
    {
      "q": "Which Bhumivera handmade soap should I pick: Soothing Bar or Charcoal Deep Cleansing Bar?",
      "a": "Pick the Soothing Bar (Aloe, Neem & Tulsi · ₹349) if you want calming hydration and gentle herbal clarity for sensitive or blemish-prone skin; pick the Charcoal Deep Cleansing Bar (Charcoal & Aloe · ₹399) if you want deep carbon adsorption for heavy sweat and oily skin."
    },
    {
      "q": "Which bundle includes the Bhumivera Soothing Bar?",
      "a": "It is included in The Royal Skin & Scalp Stewardship Trio (/combo/bundle-royal-crown-trio) and The Grand Maison 6-Piece Apothecary Vault (/combo/bundle-grand-maison-vault)."
    }
  ]
};

export const TULSI_DROPS_EXACT = {
  "id": 6,
  "name": "Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)",
  "slug": "kalpvriksh-satva-tulsi-7-tulsi-extract",
  "rating": 4.7,
  "review_count": 275,
  "reviews": 275,
  "sku": "BV-LUX-TULSI-06",
  "mpn": "BVTULSI30ML",
  "net_volume": "30 ML",
  "price": 499.0,
  "mrp": 649.0,
  "stock": 300,
  "category": "Luxury Ayurvedic Wellness & Immunity Drops",
  "ph_level": "90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)",
  "active_ingredients": "Each 10ml contains 9.0ml Mix Blend of Seven Tulsi: Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, Lemon Tulsi; Excipient Q.S.",
  "image_url": "/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp",
  "seo_title": "Bhumivera Kalpvriksh Satva Tulsi Drops (30 ML) | Concentrated Liquid Extract of 7 Types of Tulsi (9.0ml per 10ml)",
  "meta_description": "Shop Bhumivera Kalpvriksh Satva Tulsi (30 ML): concentrated Ayurvedic wellness drops containing 9.0ml per 10ml liquid extract of 7 Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi).",
  "short_description": "The Ingestible Skin-Clearing & Cortisol Adaptogen in the Bhumivera Unified Inside-Out Botanical Ritual. Each 10ml of Bhumivera Kalpvriksh Satva Tulsi contains 9.0ml concentrated liquid extract of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi) to calm cortisol-induced skin stress, support gut-skin clarity, and provide daily antioxidant vitality.",
  "full_description": "<article class=\"bhumivera-monograph space-y-6\">\n  <h3>The Concentrated Nectar of Seven Sacred Tulsi Varieties (90% Potency · 9.0ml per 10ml): Inside-Out Skin & Wellness Adaptogen</h3>\n  <p><strong>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi) (30 ML · SKU: BV-LUX-TULSI-06)</strong> is a flagship formulation from <a href=\"https://bhumivera.com\"><strong>Bhumivera — The Transparent Maison</strong></a> (<a href=\"https://bhumivera.com/about\">Bhumivera Organics India Private Limited</a>, incorporated August 4, 2026 under Founder <strong>Akash Prasad</strong> and Directors <strong>Akash Prasad, Payal Prasad &amp; Aman Prasad</strong>), rooted in the 10-year herbal manufacturing and household distribution heritage of <a href=\"https://bhumivera.com/mpgebusiness\"><strong>MPG E-Business Private Limited</strong></a> (established September 22, 2016 in Asansol, West Bengal · CIN: <code>U74999WB2016PTC217735</code> · Founder: <strong>Dilip Prasad Nonia</strong>). Engineered under <em>The Bhumivera Transparency Standard (Est. 2016 lineage)</em>, this formulation prints 100% of its functional active concentrations openly on the physical bottle label: <strong>Each 10ml contains 9.0ml Mix Blend of Seven Tulsi: Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, Lemon Tulsi; Excipient Q.S.</strong>, calibrated to <strong>90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)</strong>.</p>\n  <p>True skin luminosity and systemic vitality are governed not only by what we apply topically to the stratum corneum, but also by the internal gut-skin-cortisol axis. Chronic psychological stress, seasonal weather shifts, and urban oxidative load elevate circulating cortisol levels—triggering sebaceous gland hyperactivity, barrier inflammation, and dullness from within.</p><p>While standard market 'Panch Tulsi' drops combine only five varieties of basil, Bhumivera Kalpvriksh Satva Tulsi (30 ML · SKU: BV-LUX-TULSI-06) delivers the concentrated liquid extract of 7 distinct types of Tulsi—Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala (Krishna) Tulsi, Rama Tulsi, and Lemon Tulsi—at a label-disclosed potency of 9.0 ml active extract per 10 ml (90% concentration).</p>\n\n  <h3>I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters</h3>\n  <p>Why unite seven distinct Ocimum chemotypes rather than one or five? Each Tulsi variety biosynthesizes a specialized ratio of volatile phenylpropanoids, monoterpenes, and triterpenoids. Kala (Krishna) and Rama Tulsi (Ocimum tenuiflorum) are rich in eugenol, rosmarinic acid, and ursolic acid—potent adaptogenic polyphenols that modulate oxidative stress. Van Tulsi (Ocimum gratissimum) contributes thymol and eugenol for seasonal respiratory comfort; Sweet Tulsi (Ocimum basilicum) provides linalool; Lemon Tulsi (Ocimum × africanum) delivers uplifting citral; and Marua and Bisva Tulsi round out the digestive and soothing phytonutrient spectrum.</p><p>Extracted via cold-hydro-distillation at 24.9°C (Batch #SPTD26I · Sample COA Serial: BHMV-2610-TL019) under FSSAI license 12222999000145, every 100ml provides 8.0 grams of pure essential botanical lipids, 2.0 grams of carbohydrate, 0.0 grams of protein, and 80 Kcal of phytonutrient energy with zero synthetic solvents.</p>\n  <p>For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque <code>&ldquo;Aqua / Base Q.S.&rdquo;</code> disclosure on the back—where high-value botanicals like <a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Himalayan Sea Buckthorn</a>, <a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Manjistha (Rubia cordifolia)</a>, <a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Haridra (Curcuma longa)</a>, <a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reetha (Sapindus mukorossi)</a>, and <a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Sacred Tulsi (Ocimum tenuiflorum)</a> are dusted in at trace levels below 0.01% and boiled at 80°C–100°C. <a href=\"https://bhumivera.com/science\">Bhumivera’s Sub-28°C Formulation Lab</a> eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Niacinamide Vitamin B3</a>, <a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Multi-Molecular Hyaluronic Acid</a>, and Plant-Derived Glycerin) at full, verifiable label potencies.</p>\n\n  <h4>Complete Active Ingredient &amp; Phytochemical Monograph Table (30 ML)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Disclosed Active &amp; INCI</th>\n          <th>Label Potency</th>\n          <th>Botanical / Chemical Class &amp; Reference</th>\n          <th>Extraction &amp; Harvest Corridor</th>\n          <th>Dermal / Trichological / Cellular Mechanism</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Seven-Tulsi Concentrated Blend (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi)</strong><br/><small>Ocimum gratissimum, Ocimum basilicum, Origanum majorana/Ocimum, Ocimum tenuiflorum (Kala & Rama), Ocimum × africanum Distillate</small></td>\n          <td><strong>9.0 ml (per 10 ml)</strong></td>\n          <td>Ocimum Spectrum Phyto-Extract (90% Potency) (<a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold-Hydro-Distilled Phyto-Essence (24.9°C Verified) · <a href=\"/provenance-engine\">REG-05 · Vrindavan & Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026</a></td>\n          <td>Provides 90% active tulsi extract rich in natural eugenol, ursolic acid, and rosmarinic acid to support daily wellness, seasonal comfort, gut-skin clarity, and antioxidant vitality.</td>\n        </tr><tr>\n          <td><strong>Excipient Base</strong><br/><small>Food-Grade Solubilizing Botanical Carrier</small></td>\n          <td><strong>Q.S. (1.0 ml per 10 ml)</strong></td>\n          <td>Food-Grade Carrier (<a href=\"https://en.wikipedia.org/wiki/Eugenol\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sterile Food-Grade Blending (FSSAI: 12222999000145) · <a href=\"/provenance-engine\">REG-06 · Hygienic Bottling Cleanroom</a></td>\n          <td>Stabilizes volatile botanical essential oils for instant, uniform dispersion in warm water, tea, or milk.</td>\n        </tr><tr>\n          <td><strong>Nutritional Profile (Per 100ml Approx.)</strong><br/><small>Energy 80 Kcal | Carbohydrate 2.0g | Protein 0.0g | Essential Botanical Lipids 8.0g</small></td>\n          <td><strong>80 Kcal | 2g Carb | 8g Essential Lipids</strong></td>\n          <td>Label Nutritional Value (<a href=\"https://en.wikipedia.org/wiki/Rosmarinic_acid\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Verified Nutritional Assay per 100ml · <a href=\"/provenance-engine\">FSSAI Licensed Facility (12222999000145)</a></td>\n          <td>0.0g protein; concentrated botanical phytonutrient profile delivering pure volatile essential lipids.</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3>II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml))</h3>\n  <p>Within the Bhumivera apothecary ecosystem, Kalpvriksh Satva Tulsi serves as the internal cornerstone of our Inside-Out Botanical Ritual. When you pair 3–4 drops of Kalpvriksh Satva Tulsi in warm morning and evening water alongside topical cleansing with the Bhumivera 4% Himalayan Sea Buckthorn Face Wash or 3% Activated Charcoal Face Wash, you address both external urban pollution and internal oxidative stress simultaneously.</p><p>It is featured in both The Grand Maison 4-Piece Daily Apothecary Bundle (/combo/bundle-daily-regimen) and The Inside-Out Skin-Clearing & Cortisol Ritual Bundle (/combo/bundle-inside-out-ritual).</p>\n  <p>Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically <em>beta-glucocerebrosidase</em> and <em>acidic sphingomyelinase</em>—require an acidic microenvironment between <strong>pH 4.7 and 5.75</strong> to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating <strong>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)</strong> to <strong>90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)</strong> and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our <a href=\"/verify\">Bottle Serial &amp; COA Verification Portal</a> and <a href=\"/somatic-registry\">Somatic INCI Label Registry</a>), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it.</p>\n\n  <h3>III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule</h3>\n  <p>Add 3 to 4 drops of Bhumivera Kalpvriksh Satva Tulsi into a glass (150–200 ml) of lukewarm water, herbal tea, or warm milk twice daily—once in the morning before breakfast and once in the evening—or as directed by a wellness professional. Because it is a 90% concentrated extract (9.0 ml per 10 ml), never consume undiluted drops directly on the tongue. Consume the contents within 30 days of opening the bottle.</p>\n  <ul>\n    <li><strong>Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):</strong> Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer.</li>\n    <li><strong>Step 2 — Measured Dispensing &amp; Palmar Emulsification:</strong> Dispense the recommended dose of <strong>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)</strong> into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp.</li>\n    <li><strong>Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:</strong> Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives (<strong>Each 10ml contains 9.0ml Mix Blend of Seven Tulsi: Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, Lemon Tulsi; Excipient Q.S.</strong>) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates.</li>\n    <li><strong>Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:</strong> Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary <a href=\"/shop\">Bhumivera Inside-Out Ritual</a> formulations.</li>\n    <li><strong>Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:</strong> Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility (<a href=\"/lab\">read our full Cleanroom &amp; Patch-Test Protocol</a>).</li>\n  </ul>\n\n  <h3>IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter)</h3>\n  <p>Particularly valuable during seasonal transitions (monsoon-to-autumn and autumn-to-winter), high-pollution winter smog months, and periods of intense work or travel stress across India.</p>\n  <p>Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum. <strong>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)</strong> is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration.</p>\n\n  <h3>V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem</h3>\n  <p>Every formulation in the <a href=\"/shop\">Bhumivera 6-Product Flagship Catalog</a> is engineered to work as part of an interconnected, inside-out botanical system. Explore how <strong>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)</strong> pairs with our companion formulations:</p>\n  <ul>\n    <li><strong>1. <a href=\"/product/activated-charcoal-luxury-face-wash\">Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699)</a>:</strong> Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification.</li>\n    <li><strong>2. <a href=\"/product/himalayan-seabuckthorn-luxury-face-wash\">Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799)</a>:</strong> Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity.</li>\n    <li><strong>3. <a href=\"/product/luxury-2-in-1-botanical-shampoo-conditioner\">Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899)</a>:</strong> Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing.</li>\n    <li><strong>4. <a href=\"/product/artisanal-charcoal-handmade-soap\">Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399)</a>:</strong> Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification.</li>\n    <li><strong>5. <a href=\"/product/artisanal-aloe-vera-handmade-soap\">Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349)</a>:</strong> Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care.</li>\n    <li><strong>6. <a href=\"/product/kalpvriksh-satva-tulsi-7-tulsi-extract\">Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499)</a>:</strong> Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality.</li>\n  </ul>\n  <p>You can also acquire coordinated sets in our <a href=\"/combo/bundle-daily-regimen\">Grand Maison 4-Piece Daily Apothecary Bundle</a>, <a href=\"/combo/bundle-royal-crown-trio\">Royal Skin &amp; Scalp Stewardship Trio</a>, <a href=\"/combo/bundle-inside-out-ritual\">Inside-Out Skin-Clearing &amp; Cortisol Ritual</a>, or the collector’s <a href=\"/combo/bundle-grand-maison-vault\">Grand Maison 6-Piece Apothecary Vault</a>, or compare any two formulations side-by-side on our <a href=\"/compare\">Interactive Formulation Comparison Tool</a>.</p>\n\n  <h3>VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact</h3>\n  <p>Sourced from Vrindavan and Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026 and verified via ICP-MS for non-detected Lead, Arsenic, Cadmium, and Mercury.</p>\n  <p>Every unit of <strong>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)</strong> is traceable through our <a href=\"/provenance-engine\">6-Corridor Indian Botanical Provenance Engine</a> and protected by <a href=\"/purchase-protection\">Bhumivera White-Glove Purchase Protection</a>. To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard (<a href=\"/legal/shipping-hygiene\">Part II of the Bhumivera Legal Suite</a>) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch (<a href=\"/order-tracking\">track live AWB &amp; dispatch weight logs</a>). Furthermore, every order supports our verifiable community initiatives documented on the <a href=\"/impact\">Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact)</a>—including <a href=\"/impact/stray-animal-care\">The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative</a> and <a href=\"/impact/elderly-disabled-rations\">The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative</a> in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors (<a href=\"/impact/damodar-cleanup\">Damodar Riverbank Vetiver Cleanup</a>, <a href=\"/impact/jute-sapling-nursery\">Biodegradable Jute Sapling Nursery</a>, <a href=\"/impact/village-pukur-revival\">Village Pukur Pond Revival</a>, <a href=\"/impact/herbal-kitchen-gardens\">Medicinal Herbal Kitchen Gardens</a>, <a href=\"/impact/mandi-vermicomposting\">Mandi Waste Vermicomposting</a>, and <a href=\"/impact/coal-belt-microgrove\">Coal-Belt Native Micro-Grove</a>).</p>\n\n  <h4>Technical &amp; Regulatory Specification Summary (BV-LUX-TULSI-06)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Specification Parameter</th>\n          <th>Verified Bhumivera Standard</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Brand Name</strong></td>\n          <td>Bhumivera (The Transparent Maison · Est. 2016 Lineage)</td>\n        </tr><tr>\n          <td><strong>Product Full Name</strong></td>\n          <td>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)</td>\n        </tr><tr>\n          <td><strong>SKU Code</strong></td>\n          <td>BV-LUX-TULSI-06 (Legacy: BV-TRHM-100ML)</td>\n        </tr><tr>\n          <td><strong>MPN Code</strong></td>\n          <td>BVTULSI30ML</td>\n        </tr><tr>\n          <td><strong>GTIN 13 EAN</strong></td>\n          <td>8906182600063</td>\n        </tr><tr>\n          <td><strong>GST HSN Code</strong></td>\n          <td>20099000 (Botanical & Herbal Extracts · 5% GST)</td>\n        </tr><tr>\n          <td><strong>FSSAI License Number</strong></td>\n          <td>12222999000145 (Food-Grade Botanical Purity Standard)</td>\n        </tr><tr>\n          <td><strong>Net Volume Metric</strong></td>\n          <td>30 ML (1.01 fl. oz. Precision Dropper Bottle)</td>\n        </tr><tr>\n          <td><strong>Gross Dispatch Weight</strong></td>\n          <td>98.5 Grams (±0.5g Digital Scale Verified)</td>\n        </tr><tr>\n          <td><strong>Batch Number</strong></td>\n          <td>SPTD26I / BATCH-04/26-TL (250 Units per Micro-Batch)</td>\n        </tr><tr>\n          <td><strong>Manufacturing Date</strong></td>\n          <td>2026-09-01 (Consume within 30 days of opening bottle)</td>\n        </tr><tr>\n          <td><strong>Active Potency Ratio</strong></td>\n          <td>9.0 ML Seven-Tulsi Extract per 10 ML (90.0% Active Concentration)</td>\n        </tr><tr>\n          <td><strong>Seven Tulsi Varieties</strong></td>\n          <td>1. Van, 2. Sweet, 3. Marua, 4. Bisva, 5. Kala (Krishna), 6. Rama, 7. Lemon Tulsi</td>\n        </tr><tr>\n          <td><strong>Key Phytochemicals</strong></td>\n          <td>Eugenol, Rosmarinic Acid, Ursolic Acid, Carvacrol, Linalool & Citral</td>\n        </tr><tr>\n          <td><strong>Extraction Temperature</strong></td>\n          <td>< 28.0°C (24.9°C Cold-Hydro-Distilled Phyto-Essence)</td>\n        </tr><tr>\n          <td><strong>Nutritional Energy Per 100ml</strong></td>\n          <td>80 Kcal | Carbohydrate: 2.0 gm | Protein: 0.0 gm | Essential Oils/Fat: 8.0 gm</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</article>",
  "description": "The Concentrated Nectar of Seven Sacred Tulsi Varieties (90% Potency · 9.0ml per 10ml): Inside-Out Skin & Wellness Adaptogen \n    Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi) (30 ML · SKU: BV-LUX-TULSI-06)  is a flagship formulation from   Bhumivera — The Transparent Maison   ( Bhumivera Organics India Private Limited , incorporated August 4, 2026 under Founder  Akash Prasad  and Directors  Akash Prasad, Payal Prasad &amp; Aman Prasad ), rooted in the 10-year herbal manufacturing and household distribution heritage of   MPG E-Business Private Limited   (established September 22, 2016 in Asansol, West Bengal · CIN:  U74999WB2016PTC217735  · Founder:  Dilip Prasad Nonia ). Engineered under  The Bhumivera Transparency Standard (Est. 2016 lineage) , this formulation prints 100% of its functional active concentrations openly on the physical bottle label:  Each 10ml contains 9.0ml Mix Blend of Seven Tulsi: Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, Lemon Tulsi; Excipient Q.S. , calibrated to  90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml) . \n   True skin luminosity and systemic vitality are governed not only by what we apply topically to the stratum corneum, but also by the internal gut-skin-cortisol axis. Chronic psychological stress, seasonal weather shifts, and urban oxidative load elevate circulating cortisol levels—triggering sebaceous gland hyperactivity, barrier inflammation, and dullness from within.  While standard market 'Panch Tulsi' drops combine only five varieties of basil, Bhumivera Kalpvriksh Satva Tulsi (30 ML · SKU: BV-LUX-TULSI-06) delivers the concentrated liquid extract of 7 distinct types of Tulsi—Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala (Krishna) Tulsi, Rama Tulsi, and Lemon Tulsi—at a label-disclosed potency of 9.0 ml active extract per 10 ml (90% concentration). \n\n   I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters \n   Why unite seven distinct Ocimum chemotypes rather than one or five? Each Tulsi variety biosynthesizes a specialized ratio of volatile phenylpropanoids, monoterpenes, and triterpenoids. Kala (Krishna) and Rama Tulsi (Ocimum tenuiflorum) are rich in eugenol, rosmarinic acid, and ursolic acid—potent adaptogenic polyphenols that modulate oxidative stress. Van Tulsi (Ocimum gratissimum) contributes thymol and eugenol for seasonal respiratory comfort; Sweet Tulsi (Ocimum basilicum) provides linalool; Lemon Tulsi (Ocimum × africanum) delivers uplifting citral; and Marua and Bisva Tulsi round out the digestive and soothing phytonutrient spectrum.  Extracted via cold-hydro-distillation at 24.9°C (Batch #SPTD26I · Sample COA Serial: BHMV-2610-TL019) under FSSAI license 12222999000145, every 100ml provides 8.0 grams of pure essential botanical lipids, 2.0 grams of carbohydrate, 0.0 grams of protein, and 80 Kcal of phytonutrient energy with zero synthetic solvents. \n   For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque  &ldquo;Aqua / Base Q.S.&rdquo;  disclosure on the back—where high-value botanicals like  Himalayan Sea Buckthorn ,  Manjistha (Rubia cordifolia) ,  Haridra (Curcuma longa) ,  Reetha (Sapindus mukorossi) , and  Sacred Tulsi (Ocimum tenuiflorum)  are dusted in at trace levels below 0.01% and boiled at 80°C–100°C.  Bhumivera’s Sub-28°C Formulation Lab  eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants ( Niacinamide Vitamin B3 ,  Multi-Molecular Hyaluronic Acid , and Plant-Derived Glycerin) at full, verifiable label potencies. \n\n   Complete Active Ingredient &amp; Phytochemical Monograph Table (30 ML) \n   \n     \n       \n         \n           Disclosed Active &amp; INCI \n           Label Potency \n           Botanical / Chemical Class &amp; Reference \n           Extraction &amp; Harvest Corridor \n           Dermal / Trichological / Cellular Mechanism \n         \n       \n       \n         \n            Seven-Tulsi Concentrated Blend (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi)   Ocimum gratissimum, Ocimum basilicum, Origanum majorana/Ocimum, Ocimum tenuiflorum (Kala & Rama), Ocimum × africanum Distillate  \n            9.0 ml (per 10 ml)  \n           Ocimum Spectrum Phyto-Extract (90% Potency) ( Reference ↗ ) \n           Cold-Hydro-Distilled Phyto-Essence (24.9°C Verified) ·  REG-05 · Vrindavan & Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026  \n           Provides 90% active tulsi extract rich in natural eugenol, ursolic acid, and rosmarinic acid to support daily wellness, seasonal comfort, gut-skin clarity, and antioxidant vitality. \n          \n            Excipient Base   Food-Grade Solubilizing Botanical Carrier  \n            Q.S. (1.0 ml per 10 ml)  \n           Food-Grade Carrier ( Reference ↗ ) \n           Sterile Food-Grade Blending (FSSAI: 12222999000145) ·  REG-06 · Hygienic Bottling Cleanroom  \n           Stabilizes volatile botanical essential oils for instant, uniform dispersion in warm water, tea, or milk. \n          \n            Nutritional Profile (Per 100ml Approx.)   Energy 80 Kcal | Carbohydrate 2.0g | Protein 0.0g | Essential Botanical Lipids 8.0g  \n            80 Kcal | 2g Carb | 8g Essential Lipids  \n           Label Nutritional Value ( Reference ↗ ) \n           Verified Nutritional Assay per 100ml ·  FSSAI Licensed Facility (12222999000145)  \n           0.0g protein; concentrated botanical phytonutrient profile delivering pure volatile essential lipids. \n         \n       \n     \n   \n\n   II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)) \n   Within the Bhumivera apothecary ecosystem, Kalpvriksh Satva Tulsi serves as the internal cornerstone of our Inside-Out Botanical Ritual. When you pair 3–4 drops of Kalpvriksh Satva Tulsi in warm morning and evening water alongside topical cleansing with the Bhumivera 4% Himalayan Sea Buckthorn Face Wash or 3% Activated Charcoal Face Wash, you address both external urban pollution and internal oxidative stress simultaneously.  It is featured in both The Grand Maison 4-Piece Daily Apothecary Bundle (/combo/bundle-daily-regimen) and The Inside-Out Skin-Clearing & Cortisol Ritual Bundle (/combo/bundle-inside-out-ritual). \n   Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically  beta-glucocerebrosidase  and  acidic sphingomyelinase —require an acidic microenvironment between  pH 4.7 and 5.75  to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating  Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)  to  90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)  and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our  Bottle Serial &amp; COA Verification Portal  and  Somatic INCI Label Registry ), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it. \n\n   III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule \n   Add 3 to 4 drops of Bhumivera Kalpvriksh Satva Tulsi into a glass (150–200 ml) of lukewarm water, herbal tea, or warm milk twice daily—once in the morning before breakfast and once in the evening—or as directed by a wellness professional. Because it is a 90% concentrated extract (9.0 ml per 10 ml), never consume undiluted drops directly on the tongue. Consume the contents within 30 days of opening the bottle. \n   \n      Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):  Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer. \n      Step 2 — Measured Dispensing &amp; Palmar Emulsification:  Dispense the recommended dose of  Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)  into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp. \n      Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:  Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives ( Each 10ml contains 9.0ml Mix Blend of Seven Tulsi: Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, Lemon Tulsi; Excipient Q.S. ) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates. \n      Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:  Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary  Bhumivera Inside-Out Ritual  formulations. \n      Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:  Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility ( read our full Cleanroom &amp; Patch-Test Protocol ). \n   \n\n   IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter) \n   Particularly valuable during seasonal transitions (monsoon-to-autumn and autumn-to-winter), high-pollution winter smog months, and periods of intense work or travel stress across India. \n   Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum.  Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)  is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration. \n\n   V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem \n   Every formulation in the  Bhumivera 6-Product Flagship Catalog  is engineered to work as part of an interconnected, inside-out botanical system. Explore how  Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)  pairs with our companion formulations: \n   \n      1.  Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699) :  Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification. \n      2.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799) :  Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity. \n      3.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899) :  Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing. \n      4.  Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399) :  Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification. \n      5.  Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349) :  Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care. \n      6.  Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499) :  Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality. \n   \n   You can also acquire coordinated sets in our  Grand Maison 4-Piece Daily Apothecary Bundle ,  Royal Skin &amp; Scalp Stewardship Trio ,  Inside-Out Skin-Clearing &amp; Cortisol Ritual , or the collector’s  Grand Maison 6-Piece Apothecary Vault , or compare any two formulations side-by-side on our  Interactive Formulation Comparison Tool . \n\n   VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact \n   Sourced from Vrindavan and Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026 and verified via ICP-MS for non-detected Lead, Arsenic, Cadmium, and Mercury. \n   Every unit of  Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)  is traceable through our  6-Corridor Indian Botanical Provenance Engine  and protected by  Bhumivera White-Glove Purchase Protection . To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard ( Part II of the Bhumivera Legal Suite ) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch ( track live AWB &amp; dispatch weight logs ). Furthermore, every order supports our verifiable community initiatives documented on the  Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact) —including  The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative  and  The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative  in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors ( Damodar Riverbank Vetiver Cleanup ,  Biodegradable Jute Sapling Nursery ,  Village Pukur Pond Revival ,  Medicinal Herbal Kitchen Gardens ,  Mandi Waste Vermicomposting , and  Coal-Belt Native Micro-Grove ). \n\n   Technical &amp; Regulatory Specification Summary (BV-LUX-TULSI-06) \n   \n     \n       \n         \n           Specification Parameter \n           Verified Bhumivera Standard \n         \n       \n       \n         \n            Brand Name  \n           Bhumivera (The Transparent Maison · Est. 2016 Lineage) \n          \n            Product Full Name  \n           Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi) \n          \n            SKU Code  \n           BV-LUX-TULSI-06 (Legacy: BV-TRHM-100ML) \n          \n            MPN Code  \n           BVTULSI30ML \n          \n            GTIN 13 EAN  \n           8906182600063 \n          \n            GST HSN Code  \n           20099000 (Botanical & Herbal Extracts · 5% GST) \n          \n            FSSAI License Number  \n           12222999000145 (Food-Grade Botanical Purity Standard) \n          \n            Net Volume Metric  \n           30 ML (1.01 fl. oz. Precision Dropper Bottle) \n          \n            Gross Dispatch Weight  \n           98.5 Grams (±0.5g Digital Scale Verified) \n          \n            Batch Number  \n           SPTD26I / BATCH-04/26-TL (250 Units per Micro-Batch) \n          \n            Manufacturing Date  \n           2026-09-01 (Consume within 30 days of opening bottle) \n          \n            Active Potency Ratio  \n           9.0 ML Seven-Tulsi Extract per 10 ML (90.0% Active Concentration) \n          \n            Seven Tulsi Varieties  \n           1. Van, 2. Sweet, 3. Marua, 4. Bisva, 5. Kala (Krishna), 6. Rama, 7. Lemon Tulsi \n          \n            Key Phytochemicals  \n           Eugenol, Rosmarinic Acid, Ursolic Acid, Carvacrol, Linalool & Citral \n          \n            Extraction Temperature  \n            \n          \n            Nutritional Energy Per 100ml  \n           80 Kcal | Carbohydrate: 2.0 gm | Protein: 0.0 gm | Essential Oils/Fat: 8.0 gm",
  "editorial_heading": "The Concentrated Nectar of Seven Sacred Tulsi Varieties (90% Potency · 9.0ml per 10ml): Inside-Out Skin & Wellness Adaptogen",
  "editorial_paragraphs": [
    "True skin luminosity and systemic vitality are governed not only by what we apply topically to the stratum corneum, but also by the internal gut-skin-cortisol axis. Chronic psychological stress, seasonal weather shifts, and urban oxidative load elevate circulating cortisol levels—triggering sebaceous gland hyperactivity, barrier inflammation, and dullness from within.",
    "While standard market 'Panch Tulsi' drops combine only five varieties of basil, Bhumivera Kalpvriksh Satva Tulsi (30 ML · SKU: BV-LUX-TULSI-06) delivers the concentrated liquid extract of 7 distinct types of Tulsi—Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala (Krishna) Tulsi, Rama Tulsi, and Lemon Tulsi—at a label-disclosed potency of 9.0 ml active extract per 10 ml (90% concentration).",
    "Why unite seven distinct Ocimum chemotypes rather than one or five? Each Tulsi variety biosynthesizes a specialized ratio of volatile phenylpropanoids, monoterpenes, and triterpenoids. Kala (Krishna) and Rama Tulsi (Ocimum tenuiflorum) are rich in eugenol, rosmarinic acid, and ursolic acid—potent adaptogenic polyphenols that modulate oxidative stress. Van Tulsi (Ocimum gratissimum) contributes thymol and eugenol for seasonal respiratory comfort; Sweet Tulsi (Ocimum basilicum) provides linalool; Lemon Tulsi (Ocimum × africanum) delivers uplifting citral; and Marua and Bisva Tulsi round out the digestive and soothing phytonutrient spectrum.",
    "Extracted via cold-hydro-distillation at 24.9°C (Batch #SPTD26I · Sample COA Serial: BHMV-2610-TL019) under FSSAI license 12222999000145, every 100ml provides 8.0 grams of pure essential botanical lipids, 2.0 grams of carbohydrate, 0.0 grams of protein, and 80 Kcal of phytonutrient energy with zero synthetic solvents.",
    "Within the Bhumivera apothecary ecosystem, Kalpvriksh Satva Tulsi serves as the internal cornerstone of our Inside-Out Botanical Ritual. When you pair 3–4 drops of Kalpvriksh Satva Tulsi in warm morning and evening water alongside topical cleansing with the Bhumivera 4% Himalayan Sea Buckthorn Face Wash or 3% Activated Charcoal Face Wash, you address both external urban pollution and internal oxidative stress simultaneously.",
    "It is featured in both The Grand Maison 4-Piece Daily Apothecary Bundle (/combo/bundle-daily-regimen) and The Inside-Out Skin-Clearing & Cortisol Ritual Bundle (/combo/bundle-inside-out-ritual)."
  ],
  "composition_table": [
    {
      "active": "Seven-Tulsi Concentrated Blend (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi)",
      "ingredient": "Seven-Tulsi Concentrated Blend (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi)",
      "potency": "9.0 ml (per 10 ml)",
      "concentration": "9.0 ml (per 10 ml)",
      "classification": "Ocimum Spectrum Phyto-Extract (90% Potency)",
      "botanical": "Ocimum Spectrum Phyto-Extract (90% Potency)",
      "inci": "",
      "molecular_markers": "Eugenol, Methyl Eugenol, Rosmarinic Acid, Ursolic Acid, Carvacrol, Linalool & Citral",
      "extraction_method": "Cold-Hydro-Distilled Phyto-Essence (24.9°C Verified)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)",
      "mechanism": "Provides 90% active tulsi extract rich in natural eugenol, ursolic acid, and rosmarinic acid to support daily wellness, seasonal comfort, gut-skin clarity, and antioxidant vitality.",
      "role": "Provides 90% active tulsi extract rich in natural eugenol, ursolic acid, and rosmarinic acid to support daily wellness, seasonal comfort, gut-skin clarity, and antioxidant vitality.",
      "synergy_partners": "Pairs internally with topical Sea Buckthorn & Charcoal Face Washes",
      "reference_url": "https://en.wikipedia.org/wiki/Ocimum_tenuiflorum"
    },
    {
      "active": "Excipient Base",
      "ingredient": "Excipient Base",
      "potency": "Q.S. (1.0 ml per 10 ml)",
      "concentration": "Q.S. (1.0 ml per 10 ml)",
      "classification": "Food-Grade Carrier",
      "botanical": "Food-Grade Carrier",
      "inci": "",
      "molecular_markers": "Micro-Dispersible Hydro-Botanical Suspension",
      "extraction_method": "Sterile Food-Grade Blending (FSSAI: 12222999000145)",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)",
      "mechanism": "Stabilizes volatile botanical essential oils for instant, uniform dispersion in warm water, tea, or milk.",
      "role": "Stabilizes volatile botanical essential oils for instant, uniform dispersion in warm water, tea, or milk.",
      "synergy_partners": "9.0 ml Seven-Tulsi Blend",
      "reference_url": "https://en.wikipedia.org/wiki/Eugenol"
    },
    {
      "active": "Nutritional Profile (Per 100ml Approx.)",
      "ingredient": "Nutritional Profile (Per 100ml Approx.)",
      "potency": "80 Kcal | 2g Carb | 8g Essential Lipids",
      "concentration": "80 Kcal | 2g Carb | 8g Essential Lipids",
      "classification": "Label Nutritional Value",
      "botanical": "Label Nutritional Value",
      "inci": "",
      "molecular_markers": "Zero Added Sugar · Zero Synthetic Colors · Zero Alcohol",
      "extraction_method": "Verified Nutritional Assay per 100ml",
      "harvest_corridor": "Indian Botanical Corridor",
      "corridor_url": "/provenance-engine",
      "ph_window": "90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)",
      "mechanism": "0.0g protein; concentrated botanical phytonutrient profile delivering pure volatile essential lipids.",
      "role": "0.0g protein; concentrated botanical phytonutrient profile delivering pure volatile essential lipids.",
      "synergy_partners": "Daily Warm Water / Herbal Tea Ritual",
      "reference_url": "https://en.wikipedia.org/wiki/Rosmarinic_acid"
    }
  ],
  "specifications": {
    "Brand_Name": "Bhumivera (The Transparent Maison · Est. 2016 Lineage)",
    "Product_Full_Name": "Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)",
    "SKU_Code": "BV-LUX-TULSI-06 (Legacy: BV-TRHM-100ML)",
    "MPN_Code": "BVTULSI30ML",
    "GTIN_13_EAN": "8906182600063",
    "GST_HSN_Code": "20099000 (Botanical & Herbal Extracts · 5% GST)",
    "FSSAI_License_Number": "12222999000145 (Food-Grade Botanical Purity Standard)",
    "Net_Volume_Metric": "30 ML (1.01 fl. oz. Precision Dropper Bottle)",
    "Gross_Dispatch_Weight": "98.5 Grams (±0.5g Digital Scale Verified)",
    "Batch_Number": "SPTD26I / BATCH-04/26-TL (250 Units per Micro-Batch)",
    "Manufacturing_Date": "2026-09-01 (Consume within 30 days of opening bottle)",
    "Active_Potency_Ratio": "9.0 ML Seven-Tulsi Extract per 10 ML (90.0% Active Concentration)",
    "Seven_Tulsi_Varieties": "1. Van, 2. Sweet, 3. Marua, 4. Bisva, 5. Kala (Krishna), 6. Rama, 7. Lemon Tulsi",
    "Key_Phytochemicals": "Eugenol, Rosmarinic Acid, Ursolic Acid, Carvacrol, Linalool & Citral",
    "Extraction_Temperature": "< 28.0°C (24.9°C Cold-Hydro-Distilled Phyto-Essence)",
    "Nutritional_Energy_Per_100ml": "80 Kcal | Carbohydrate: 2.0 gm | Protein: 0.0 gm | Essential Oils/Fat: 8.0 gm",
    "Free_From_Guarantee": "0% Alcohol, 0% Added Sugar, 0% Synthetic Flavors, 0% Artificial Colors",
    "Primary_Wellness_Goals": "Inside-Out Gut-Skin-Cortisol Balance, Seasonal Immunity & Respiratory Comfort",
    "Recommended_Dosage": "3 to 4 Drops in a Glass of Warm Water, Tea, or Milk Twice Daily",
    "Servings_Per_Container": "Approx. 150 to 200 Daily Wellness Servings per 30 ML Bottle",
    "Primary_Vessel_Material": "UV-Amber Apothecary Bottle with Tamper-Evident Precision Dropper Seal",
    "Microbiological_Purity": "Food-Grade Botanical Purity · Zero Synthetic Solvents",
    "Heavy_Metals_ICP_MS": "Lead ND · Arsenic ND · Cadmium ND · Mercury ND (ICP-MS Verified)",
    "Harvest_Origin_Lot": "Vrindavan & Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026",
    "Brand_Flagship_Entity": "Bhumivera Organics India Private Limited (Inc. August 4, 2026 · Asansol, WB)",
    "Parent_Heritage_Entity": "MPG E-Business Private Limited (Inc. Sept 22, 2016 · CIN: U74999WB2016PTC217735)",
    "Licensed_Manufacturing_Unit": "Sitashi Herbal Industry, H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022",
    "Country_Of_Origin": "Proudly Formulated & Manufactured in India (Bharat)"
  },
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
    },
    {
      "name": "Rosmarinic acid",
      "url": "https://en.wikipedia.org/wiki/Rosmarinic_acid"
    },
    {
      "name": "Ursolic acid",
      "url": "https://en.wikipedia.org/wiki/Ursolic_acid"
    }
  ],
  "conscious_buyer_highlights": [
    "7 Distinct Tulsi Varieties (Beyond Standard 5-Herb Panch Tulsi): Unites Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, and Lemon Tulsi.",
    "90% Label-Verified Concentration: Each 10ml contains 9.0ml of pure Seven-Tulsi liquid phyto-extract.",
    "Inside-Out Gut-Skin & Cortisol Adaptogen: Rich in natural eugenol, rosmarinic acid, and ursolic acid to support internal antioxidant vitality and seasonal respiratory comfort.",
    "Effortless Daily Ritual: Just 3–4 drops in a glass of warm water, herbal tea, or milk twice daily (approx. 150–200 servings per 30 ML dropper bottle)."
  ],
  "related_products": [],
  "faqs": [
    {
      "q": "How is Bhumivera Kalpvriksh Satva Tulsi different from regular Panch Tulsi drops?",
      "a": "Regular Panch Tulsi products use 5 types of tulsi. Bhumivera Kalpvriksh Satva Tulsi combines 7 distinct varieties—Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, and Lemon Tulsi—at a label-disclosed concentration of 9.0ml per 10ml (90% active potency)."
    },
    {
      "q": "How should I take Kalpvriksh Satva Tulsi drops daily?",
      "a": "Add 3 to 4 drops into a glass of warm water, tea, or milk twice daily. Because it is a concentrated 90% botanical extract (9.0ml per 10ml), 3–4 drops are sufficient for a daily wellness serving."
    },
    {
      "q": "What are the 7 types of Tulsi in Bhumivera Kalpvriksh Satva Tulsi?",
      "a": "Each 10ml contains 9.0ml Mix Blend of: 1) Van Tulsi, 2) Sweet Tulsi, 3) Marua Tulsi, 4) Bisva Tulsi, 5) Kala Tulsi, 6) Rama Tulsi, and 7) Lemon Tulsi, with Excipient Q.S."
    },
    {
      "q": "What is the nutritional value of Kalpvriksh Satva Tulsi per 100ml?",
      "a": "Per 100ml (approx.): Energy 80 Kcal, Carbohydrate 2.0 gm, Protein 0.0 gm, and Fat (Essential Botanical Oils) 8.0 gm."
    },
    {
      "q": "How does Kalpvriksh Satva Tulsi support clear, glowing skin from within?",
      "a": "Tulsi is rich in adaptogenic eugenol, rosmarinic acid, and ursolic acid, which help calm internal oxidative and cortisol stress along the gut-skin axis—complementing topical skincare with our Sea Buckthorn and Charcoal Face Washes."
    },
    {
      "q": "How long does one 30 ML bottle last, and what is its shelf window after opening?",
      "a": "At 3–4 drops twice daily, a 30 ML bottle provides approximately 150–200 servings. For peak volatile oil freshness, consume contents within 30 days of opening the bottle."
    },
    {
      "q": "Is Bhumivera Kalpvriksh Satva Tulsi licensed under FSSAI?",
      "a": "Yes, it is manufactured under FSSAI License No. 12222999000145 with Batch No. SPTD26I and HSN Code 20099000."
    },
    {
      "q": "Where can I verify the batch COA for Kalpvriksh Satva Tulsi?",
      "a": "Visit https://bhumivera.com/verify and enter your bottle serial (or sample serial BHMV-2610-TL019) to inspect the 24.9°C cold-hydro-distillation and heavy-metal ND certificate."
    }
  ]
};

export const BHUMIVERA_6_PRODUCTS = [
  {
    "id": 1,
    "legacyIds": [
      9,
      1,
      102
    ],
    "name": "Bhumivera Activated Charcoal Purifying Luxury Face Wash",
    "subtitle": "3% Activated Charcoal, 5% Glycerin, Manjistha, Haridra, Hyaluronic Acid & Niacinamide",
    "slug": "activated-charcoal-luxury-face-wash",
    "rating": 4.71,
    "review_count": 276,
    "reviews": 276,
    "legacySlugs": [
      "charcoal-face-wash",
      "bhumivera-charcoal-face-wash",
      "activated-charcoal-face-wash",
      "charcoal-niacinamide-face-wash",
      "bhumivera-facewash",
      "bhumivera-face-wash",
      "pore-purifying-charcoal-cleanser"
    ],
    "sku": "BV-LUX-CFW-01",
    "legacySkus": [
      "BV-CHFW-100ML"
    ],
    "mpn": "BVCFW100ML",
    "gtin13": "8906182600018",
    "net_volume": "100 ML",
    "price": 699.0,
    "discountPrice": 699.0,
    "mrp": 899.0,
    "stock": 250,
    "quantity": 250,
    "gst_hsn_code": "30049011",
    "gst_rate": 5.0,
    "cost_price": 60.0,
    "batch_no": "SCFW26H",
    "mfg_date": "2026-08-01",
    "manufacturer_name": "Sitashi Herbal Industry",
    "manufacturer_address": "H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022, Rajasthan",
    "manufacturer_gstin": "08AEQFS1102P1ZM",
    "manufacturer_fssai": "12222999000145",
    "category": "Luxury Facial Cleansers",
    "ph_level": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
    "active_ingredients": "Charcoal (3%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)",
    "image_url": "/images/products/bhumivera-activated-charcoal-luxury-face-wash.webp",
    "image": "/images/products/bhumivera-activated-charcoal-luxury-face-wash.webp",
    "additionalImages": [
      "/assets/images/charcoalFace wash.webp",
      "/assets/images/charcoal.webp"
    ],
    "seo_title": "Bhumivera Activated Charcoal Luxury Face Wash (100ml) | 3% Charcoal, 5% Glycerin, Hyaluronic Acid, Niacinamide & Manjistha Gentle Botanical Cleanser",
    "meta_description": "Crafted for conscious skincare lovers: Bhumivera Activated Charcoal Luxury Face Wash (100ml) with label-disclosed 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.1% Hyaluronic Acid & 0.1% Niacinamide. Sulfate-free & pH-balanced.",
    "short_description": "A pH-balanced, sulfate-free botanical and active facial cleanser crafted for conscious skincare buyers. Formulated per 100ml with 100% label-disclosed concentrations: 3% Charcoal, 5% Glycerin, 0.5% Manjistha, 0.5% Haridra (Turmeric), 0.5% Neem, 0.5% Cucumber Extract, 0.1% Hyaluronic Acid & 0.1% Niacinamide.",
    "search_keywords": "bhumivera activated charcoal face wash, bhumivera facewash, bhumivera face wash, facewash with niacinamide, facewash with niacidamine, charcoal face wash with niacinamide and hyaluronic acid, 3% activated charcoal cleanser India, gentle natural face wash for glowing skin, sulfate free charcoal face wash, ayurvedic botanical face wash manjistha turmeric neem, non drying face wash for oily combination acne prone skin, conscious clean skincare face wash, bhumivera.com",
    "conscious_buyer_highlights": [
      "100% Label-Disclosed Potency: Every active percentage (3% Charcoal, 5% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid, 0.1% Niacinamide) is printed openly on the bottle.",
      "Non-Stripping Barrier Care: Cushioning 5% Botanical Glycerin and 0.1% Hyaluronic Acid keep skin soft, hydrated, and comfortable after rinsing without post-wash tightness.",
      "Clean & Conscious Formula: Zero SLS/SLES sulfates, zero parabens, zero mineral oil, and zero synthetic plastic microbeads.",
      "Honest Transparency: Botanical and Ayurvedic-inspired cosmetic formulation by Bhumivera Organics (Est. 2016 MPG lineage); 24-hour inner-forearm patch test recommended before first use."
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
      },
      {
        "name": "Glycerol (Botanical Glycerin)",
        "url": "https://en.wikipedia.org/wiki/Glycerol"
      },
      {
        "name": "Cucumis sativus (Cucumber)",
        "url": "https://en.wikipedia.org/wiki/Cucumber"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Activated Charcoal",
        "inci_name": "Carbon Black / Steam-Activated Bambusa tulda Carbon (<15 μm)",
        "concentration": "3.0%",
        "botanical": "Microporous Steam-Activated Carbon",
        "molecular_markers": "High-porosity microporous carbon lattice (>900 m²/g surface area)",
        "extraction_method": "850°C Steam Activation & Jet-Milling (<15 Microns)",
        "origin_corridor": "REG-03 · Assam & North-East Sustainable Bamboo Groves",
        "ph_stability_window": "pH 5.0 – 7.0 (Inert Physical Adsorbent)",
        "role": "Adsorbs surface PM2.5 urban pollutants, oxidized squalene, pore congestion, and excess sebum via Van der Waals forces without abrasive physical scrubbing.",
        "synergy_partners": "5% Botanical Glycerin + 0.5% Neem + 0.1% Niacinamide",
        "reference_url": "https://en.wikipedia.org/wiki/Activated_carbon",
        "related_products": [
          {
            "name": "Charcoal Deep Cleansing Bar",
            "slug": "artisanal-charcoal-handmade-soap"
          }
        ]
      },
      {
        "ingredient": "Botanical Glycerin",
        "inci_name": "Glycerin (Plant-Derived Trihydroxy Sugar Alcohol)",
        "concentration": "5.0%",
        "botanical": "Plant-Derived Humectant Cushion",
        "molecular_markers": "Propane-1,2,3-triol (3 Hydrophilic Hydroxyl Groups)",
        "extraction_method": "Cold-Filtered Vegetable Lipid Hydrolysis (USP Grade)",
        "origin_corridor": "REG-06 · Indian Plant-Oil Fractionation Cleanroom",
        "ph_stability_window": "pH 4.0 – 7.0 (Aquaporin-3 Modulator)",
        "role": "Creates an intensive 5.0% moisture cushion that prevents surfactant-induced tightness, supports aquaporin-3 water transport, and protects the stratum corneum barrier.",
        "synergy_partners": "0.1% Hyaluronic Acid + 0.5% Cucumber Extract",
        "reference_url": "https://en.wikipedia.org/wiki/Glycerol",
        "related_products": [
          {
            "name": "Himalayan Sea Buckthorn Face Wash",
            "slug": "himalayan-seabuckthorn-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Manjistha Extract",
        "inci_name": "Rubia cordifolia Root Extract",
        "concentration": "0.5%",
        "botanical": "Rubia cordifolia (Varnya Root)",
        "molecular_markers": "Purpurin, Munjistin, Xanthopurpurin & Rubiadin Anthraquinones",
        "extraction_method": "Sub-28°C Hydro-Glycerinic Root Maceration",
        "origin_corridor": "REG-05 · Vindhya & Central Indian Forest Belts",
        "ph_stability_window": "pH 5.0 – 6.0 (Antioxidant Phyto-Active)",
        "role": "Revered Ayurvedic complexion-brightening (Varnya) root that modulates oxidative tyrosinase activity, calms post-blemish erythema, and visibly evens out dull skin tone.",
        "synergy_partners": "0.5% Haridra (Turmeric) + 0.1% Niacinamide",
        "reference_url": "https://en.wikipedia.org/wiki/Rubia_cordifolia",
        "related_products": [
          {
            "name": "Himalayan Sea Buckthorn Face Wash",
            "slug": "himalayan-seabuckthorn-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Haridra (Wild Turmeric)",
        "inci_name": "Curcuma longa Rhizome Extract",
        "concentration": "0.5%",
        "botanical": "Curcuma longa Rhizome",
        "molecular_markers": "Curcuminoids (Curcumin, Demethoxycurcumin) & Ar-turmerone",
        "extraction_method": "Sub-28°C Cold Rhizome Extraction",
        "origin_corridor": "REG-05 · Nilgiri & Eastern India Organic Farms",
        "ph_stability_window": "pH 4.5 – 6.0 (Acid-Stable Curcuminoid Window)",
        "role": "Antioxidant-rich botanical rhizome that neutralizes UV- and pollution-induced free radicals, calms redness, and supports natural cellular luminosity.",
        "synergy_partners": "0.5% Manjistha + 0.5% Neem Extract",
        "reference_url": "https://en.wikipedia.org/wiki/Turmeric",
        "related_products": [
          {
            "name": "Himalayan Sea Buckthorn Face Wash",
            "slug": "himalayan-seabuckthorn-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Neem Extract",
        "inci_name": "Azadirachta indica Leaf Extract",
        "concentration": "0.5%",
        "botanical": "Azadirachta indica Leaf",
        "molecular_markers": "Nimbidin, Nimbin, Quercetin & Azadirachtin Limonoids",
        "extraction_method": "Sub-28°C Cold Leaf Infusion",
        "origin_corridor": "REG-05 · Central & Eastern India Botanical Cooperatives",
        "ph_stability_window": "pH 5.0 – 6.2 (Microbiome-Balancing)",
        "role": "Time-tested purifying leaf extract that clarifies congested pores, balances cutaneous flora, and defends blemish-prone skin against urban grime.",
        "synergy_partners": "3.0% Activated Charcoal + 0.5% Haridra",
        "reference_url": "https://en.wikipedia.org/wiki/Azadirachta_indica",
        "related_products": [
          {
            "name": "Soothing Bar (Aloe, Neem & Tulsi)",
            "slug": "artisanal-aloe-vera-handmade-soap"
          },
          {
            "name": "Royal 2-in-1 Shampoo",
            "slug": "luxury-2-in-1-botanical-shampoo-conditioner"
          }
        ]
      },
      {
        "ingredient": "Cucumber Extract",
        "inci_name": "Cucumis sativus Fruit Extract",
        "concentration": "0.5%",
        "botanical": "Cucumis sativus Cellular Water",
        "molecular_markers": "Ascorbic Acid, Caffeic Acid, Lactic Acid & Bio-Silica",
        "extraction_method": "Cold Cellular Press (<25°C)",
        "origin_corridor": "REG-06 · Eastern India Agrarian Clusters",
        "ph_stability_window": "pH 5.1 – 5.8",
        "role": "Instantly cools heat-flushed skin, reduces morning puffiness, and delivers lightweight amino-acid and mineral hydration.",
        "synergy_partners": "5.0% Botanical Glycerin + 0.1% Hyaluronic Acid",
        "reference_url": "https://en.wikipedia.org/wiki/Cucumber",
        "related_products": [
          {
            "name": "Himalayan Sea Buckthorn Face Wash",
            "slug": "himalayan-seabuckthorn-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Hyaluronic Acid",
        "inci_name": "Sodium Hyaluronate (Bio-Fermented)",
        "concentration": "0.1%",
        "botanical": "Sodium Hyaluronate Polysaccharide",
        "molecular_markers": "Poly(beta-glucuronic acid-[1->3]-beta-N-acetylglucosamine)",
        "extraction_method": "Plant-Glucose Bio-Fermentation (100% Vegan)",
        "origin_corridor": "Analytical Cleanroom Bio-Fermentation",
        "ph_stability_window": "pH 5.0 – 6.5",
        "role": "Biomimetic water-binding humectant that binds up to 1,000x its weight in water, forming a breathable hydration veil during cleansing for a plump, dewy feel.",
        "synergy_partners": "5.0% Botanical Glycerin + 0.1% Niacinamide",
        "reference_url": "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate",
        "related_products": [
          {
            "name": "Himalayan Sea Buckthorn Face Wash",
            "slug": "himalayan-seabuckthorn-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Niacinamide (Vitamin B3)",
        "inci_name": "Niacinamide (Pyridine-3-carboxamide · USP Grade)",
        "concentration": "0.1%",
        "botanical": "Nicotinamide (Vitamin B3)",
        "molecular_markers": "NAD+ / NADP+ Coenzyme Precursor (C6H6N2O · Purity ≥99.5%)",
        "extraction_method": "Pharmaceutical Grade Synthesis (Zero Nicotinic Acid Flush)",
        "origin_corridor": "USP/EP Certified Analytical Synthesis",
        "ph_stability_window": "pH 5.3 – 6.0 (Optimal Non-Hydrolyzing Window)",
        "role": "Supports natural epidermal ceramide and free-fatty-acid synthesis, helps regulate excess T-zone sebum, and refines the appearance of enlarged pores.",
        "synergy_partners": "0.1% Hyaluronic Acid + 0.5% Manjistha",
        "reference_url": "https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide",
        "related_products": [
          {
            "name": "Himalayan Sea Buckthorn Face Wash",
            "slug": "himalayan-seabuckthorn-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Perfume & Cleanser Base",
        "inci_name": "Aqua, Decyl Glucoside, Coco-Glucoside, Cocamidopropyl Betaine, IFRA Botanical Aroma",
        "concentration": "0.5% / Q.S.",
        "botanical": "pH-Balanced Sulfate-Free Emulsion",
        "molecular_markers": "Mild Non-Ionic Alkyl Polyglucoside Micelles",
        "extraction_method": "Cold-Compounded Cleanroom Homogenization (<28°C)",
        "origin_corridor": "REG-06 · GMP Formulation Cleanroom",
        "ph_stability_window": "pH 5.4 – 5.5 Calibrated",
        "role": "Gentle, 100% sulfate-free (0% SLS/SLES) cleansing suspension vehicle that lifts impurities without disrupting intercellular barrier lipids.",
        "synergy_partners": "All 8 Disclosed Actives",
        "reference_url": "https://bhumivera.com/science",
        "related_products": []
      }
    ],
    "specifications": {
      "Brand_Name": "Bhumivera (The Transparent Maison · Est. 2016 Lineage)",
      "Product_Full_Name": "Bhumivera Activated Charcoal Purifying Luxury Face Wash",
      "SKU_Code": "BV-LUX-CFW-01 (Legacy: BV-CHFW-100ML)",
      "MPN_Code": "BVCFW100ML",
      "GTIN_13_EAN": "8906182600018",
      "GST_HSN_Code": "30049011 (Ayurvedic & Botanical Preparations · 5% GST)",
      "Net_Volume_Metric": "100 ML (3.38 fl. oz.)",
      "Gross_Dispatch_Weight": "215.0 Grams (±0.5g Digital Scale Verified)",
      "Batch_Number": "SCFW26H / BATCH-04/26-CH (250 Units per Micro-Batch)",
      "Calibrated_pH_Range": "pH 5.40 – 5.51 at 25.0°C (Digital Glass Electrode Verified)",
      "Extraction_Temperature": "< 28.0°C (25.8°C Cold-Compounded Sub-Ambient Protocol)",
      "Primary_Purifying_Active": "3.0% Steam-Activated Microporous Bamboo Charcoal (<15 Microns)",
      "Primary_Humectant_Cushion": "5.0% Plant-Derived Botanical Glycerin + 0.1% Hyaluronic Acid",
      "Barrier_Vitamin_CoFactor": "0.1% USP-Grade Niacinamide (Vitamin B3 · Pyridine-3-carboxamide)",
      "Ayurvedic_Phyto_Complex": "0.5% Manjistha + 0.5% Haridra (Turmeric) + 0.5% Neem + 0.5% Cucumber",
      "Total_Disclosed_Actives": "9.7% Active & Functional Botanical/Humectant Concentration + Q.S. Base",
      "Surfactant_Architecture": "100% Sulfate-Free (Decyl Glucoside & Coco-Glucoside Micellar Matrix)",
      "Free_From_Guarantee": "0% SLS, 0% SLES, 0% Parabens, 0% Mineral Oil, 0% Plastic Microbeads",
      "Target_Skin_Profiles": "Oily, Combination, Congested, Blemish-Prone, Normal & Urban-Exposed Skin",
      "Primary_Skin_Concerns": "PM2.5 Urban Soot, Oxidized Sebum, Blackheads, Enlarged Pores & Dullness",
      "Texture_And_Visual_Profile": "Silky Obsidian Micro-Emulsion Gel with Zero Gritty Abrasion",
      "Aromatic_Profile": "Subtle Allergen-Screened Botanical Essence (0.5% IFRA Compliant)",
      "Recommended_Ritual_Timing": "Twice Daily (AM Sebum Balance & PM Deep Urban Pollution Detox · 30–45s)",
      "Shelf_Life_And_PAO": "24 Months from Manufacturing Date (6 Months Period After Opening)",
      "Primary_Vessel_Material": "UV-Protected Apothecary Dispenser Bottle with Tamper-Evident Gold Seal",
      "Microbiological_Purity": "Total Aerobic Microbial Count < 10 CFU/ml (Zero Pathogens)",
      "Heavy_Metals_ICP_MS": "Lead <0.04 ppm · Arsenic <0.01 ppm · Mercury Not Detected (ND)",
      "Patch_Test_Standard": "Mandatory 24-Hour Inner-Forearm Patch Test Prior to First Use",
      "Brand_Flagship_Entity": "Bhumivera Organics India Private Limited (Inc. August 4, 2026 · Asansol, WB)",
      "Parent_Heritage_Entity": "MPG E-Business Private Limited (Inc. Sept 22, 2016 · CIN: U74999WB2016PTC217735)",
      "Licensed_Manufacturing_Unit": "Sitashi Herbal Industry, H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022",
      "Country_Of_Origin": "Proudly Formulated & Manufactured in India (Bharat)"
    },
    "hero_heading": "Where Sub-28°C Botanical Science Meets Royal Ayurveda: The 3% Activated Charcoal & 5% Glycerin Barrier Cleanser",
    "intro_paragraphs": [
      "Urban life across modern cities exposes facial skin to an invisible daily siege of particulate matter (PM2.5 and PM10 traffic soot), polycyclic aromatic hydrocarbons (PAHs), heavy metals, and volatile organic compounds. Because PM2.5 particles measure less than 2.5 micrometers in diameter—roughly 20 times smaller than a human pore opening—they penetrate deep into the pilosebaceous unit, where they catalyze the peroxidation of natural squalene into comedogenic squalene monohydroperoxide. The result is chronic low-grade inflammation, stubborn blackheads, enlarged pores, and premature dullness.",
      "The Bhumivera Activated Charcoal Purifying Luxury Face Wash was engineered specifically for label-conscious skincare buyers who demand deep urban pore purification without sacrificing their skin's delicate moisture barrier. While mass-market charcoal cleansers rely on harsh Sodium Lauryl Sulfate (SLS) and an undisclosed trace of carbon powder purely for black coloring, Bhumivera formulates every 100ml bottle with a label-disclosed 3.0% concentration of steam-activated microporous carbon suspended inside a generous 5.0% Botanical Glycerin cushion, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Wild Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract."
    ],
    "science_paragraphs": [
      "At the core of this formulation is 3.0% Steam-Activated Bamboo Charcoal (Bambusa tulda), harvested from sustainable groves in Assam and steam-activated at 850°C to create an internal microporous lattice exceeding 900 square meters of surface area per gram. Crucially, our carbon is jet-milled to an ultra-fine, spherical particle profile under 15 microns. Unlike crushed walnut shells, apricot kernels, or coarse charcoal powders that inflict microscopic lacerations (micro-tears) across the stratum corneum, Bhumivera's sub-15-micron activated carbon glides silkily across the epidermis, acting as a lipophilic molecular magnet that binds and lifts oxidized sebum, sunscreen residue, and PM2.5 soot through physical adsorption.",
      "To ensure that this powerful adsorption never leaves the skin feeling tight, dry, or squeaky, the 3.0% carbon core is balanced by a 5.0% Plant-Derived Glycerin humectant matrix and 0.1% bio-fermented Sodium Hyaluronate (Hyaluronic Acid). During the 30-to-45-second cleansing massage, Glycerin and Hyaluronic Acid form a hydrogen-bonded hydration shield over the corneocytes, while 0.1% USP-grade Niacinamide (Vitamin B3) supports barrier lipid resilience and helps normalize sebaceous gland output."
    ],
    "synergy_paragraphs": [
      "What elevates the Bhumivera Activated Charcoal Purifying Luxury Face Wash into a true Ayurvedic-clinical hybrid is its standardized 2.0% quad-botanical phyto-complex: 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). In classical Ayurvedic dermatology, Manjistha and Haridra are revered as premier 'Varnya' (complexion-illuminating and blood/lymph-clarifying) botanicals. Rich in purpurin, munjistin, and bioactive curcuminoids, they calm the appearance of post-blemish redness and help visibly even out sun-induced hyperpigmentation.",
      "Simultaneously, 0.5% cold-extracted Neem leaf delivers nimbidin and quercetin limonoids that keep acne-prone and congested pores clarified, while 0.5% fresh Cucumber cellular extract cools epidermal heat and replenishes soothing silica and amino acids. For patrons who practice a dual-cleanser routine, pairing this 3% Activated Charcoal Face Wash in the evening (PM) with our 4% Himalayan Sea Buckthorn Cellular Radiance Face Wash in the morning (AM) provides 24-hour pore clarity and Omega-7 radiance."
    ],
    "ritual_paragraphs": [
      "To unlock the full benefit of this 9.7% active-disclosed emulsion, treat cleansing as a mindful 45-second dermal treatment rather than a rushed 5-second splash. Because the formula uses mild, biodegradable plant glucosides rather than synthetic SLS foaming agents, it produces a dense, creamy micro-velvet lather that rinses away effortlessly without leaving a soapy film."
    ],
    "climate_paragraphs": [
      "Whether you commute through high-traffic metropolitan corridors in Delhi NCR, Mumbai, Bengaluru, Kolkata, Hyderabad, or industrial hubs like Asansol and Durgapur, daily particulate exposure accelerates oxidative skin stress. In peak summer and monsoon humidity, use this cleanser morning and evening to keep T-zone sebum balanced. In dry winter months, use it as your evening (PM) deep-pore reset and pair with the Bhumivera Himalayan Sea Buckthorn Face Wash in the morning."
    ],
    "provenance_paragraphs": [
      "Every bottle of Bhumivera Activated Charcoal Purifying Luxury Face Wash (Batch #SCFW26H · Sample COA Serial: BHMV-2610-CH041) undergoes cleanroom microbiological screening (<10 CFU/ml) and ICP-MS heavy-metal verification (Lead <0.04 ppm, Arsenic <0.01 ppm, Mercury ND)."
    ],
    "faqs": [
      {
        "q": "What is the exact ingredient percentage breakdown of Bhumivera Activated Charcoal Face Wash?",
        "a": "Each 100ml bottle features a 100% transparent, label-disclosed formulation: 3% Activated Charcoal, 5% Glycerin, 0.5% Haridra (Turmeric), 0.5% Neem, 0.5% Cucumber Extract, 0.5% Manjistha Extract, 0.1% Hyaluronic Acid, 0.1% Niacinamide, and 0.5% Perfume in a gentle pH-balanced cleansing base (Q.S.)."
      },
      {
        "q": "Does this face wash contain Niacinamide and Hyaluronic Acid?",
        "a": "Yes. Bhumivera Activated Charcoal Purifying Luxury Face Wash contains 0.1% USP-grade Niacinamide (Vitamin B3) and 0.1% Hyaluronic Acid alongside 5.0% Botanical Glycerin—making it an ideal choice if you are searching for a face wash with Niacinamide that purifies pores without drying the skin barrier."
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
        "q": "Will the 3% Activated Charcoal feel gritty or scratch my skin?",
        "a": "No. Our steam-activated bamboo charcoal is jet-milled to an ultra-fine particle size below 15 microns and suspended in a 5% Glycerin gel-emulsion, providing smooth, non-abrasive magnetic adsorption of oil and grime."
      },
      {
        "q": "Which Bhumivera face wash should I choose: 3% Activated Charcoal or 4% Himalayan Sea Buckthorn?",
        "a": "Both share our 5% Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, and 0.5% Cucumber base. Choose Activated Charcoal (₹699) for deep pore detoxification, blackhead care, and excess oil control; choose Himalayan Sea Buckthorn (₹799) for Omega-7 barrier nourishment and glowing radiance—or use Sea Buckthorn in the morning (AM) and Charcoal at night (PM)."
      },
      {
        "q": "How do I verify that my Bhumivera bottle is 100% genuine?",
        "a": "Every bottle carries a tamper-evident neck seal, batch code (SCFW26H), and QR/serial code. Visit https://bhumivera.com/verify to inspect your bottle's calibrated pH 5.48 assay and lab COA."
      },
      {
        "q": "How does Bhumivera Organics ensure ingredient transparency and formulation quality?",
        "a": "Bhumivera Organics is our registered brand and corporate name (Bhumivera Organics India Private Limited, backed by MPG E-Business Private Limited, Est. 2016). Our formulations combine plant-derived Ayurvedic botanicals with proven cosmetic actives and zero SLS/parabens, with every active concentration printed transparently on the label."
      },
      {
        "q": "Can men and women both use Bhumivera Activated Charcoal Face Wash?",
        "a": "Yes, it is a unisex formulation engineered for all adult skin profiles exposed to urban pollution, sweat, sunscreen, and excess T-zone sebum."
      },
      {
        "q": "What is the pH level of Bhumivera Activated Charcoal Face Wash?",
        "a": "It is calibrated to pH 5.4 – 5.5, matching the natural acidic mantle of healthy human facial skin."
      }
    ],
    "full_description": "<article class=\"bhumivera-monograph space-y-6\">\n  <h3>Where Sub-28°C Botanical Science Meets Royal Ayurveda: The 3% Activated Charcoal & 5% Glycerin Barrier Cleanser</h3>\n  <p><strong>Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · SKU: BV-LUX-CFW-01)</strong> is a flagship formulation from <a href=\"https://bhumivera.com\"><strong>Bhumivera — The Transparent Maison</strong></a> (<a href=\"https://bhumivera.com/about\">Bhumivera Organics India Private Limited</a>, incorporated August 4, 2026 under Founder <strong>Akash Prasad</strong> and Directors <strong>Akash Prasad, Payal Prasad &amp; Aman Prasad</strong>), rooted in the 10-year herbal manufacturing and household distribution heritage of <a href=\"https://bhumivera.com/mpgebusiness\"><strong>MPG E-Business Private Limited</strong></a> (established September 22, 2016 in Asansol, West Bengal · CIN: <code>U74999WB2016PTC217735</code> · Founder: <strong>Dilip Prasad Nonia</strong>). Engineered under <em>The Bhumivera Transparency Standard (Est. 2016 lineage)</em>, this formulation prints 100% of its functional active concentrations openly on the physical bottle label: <strong>Charcoal (3%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)</strong>, calibrated to <strong>pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)</strong>.</p>\n  <p>Urban life across modern cities exposes facial skin to an invisible daily siege of particulate matter (PM2.5 and PM10 traffic soot), polycyclic aromatic hydrocarbons (PAHs), heavy metals, and volatile organic compounds. Because PM2.5 particles measure less than 2.5 micrometers in diameter—roughly 20 times smaller than a human pore opening—they penetrate deep into the pilosebaceous unit, where they catalyze the peroxidation of natural squalene into comedogenic squalene monohydroperoxide. The result is chronic low-grade inflammation, stubborn blackheads, enlarged pores, and premature dullness.</p><p>The Bhumivera Activated Charcoal Purifying Luxury Face Wash was engineered specifically for label-conscious skincare buyers who demand deep urban pore purification without sacrificing their skin's delicate moisture barrier. While mass-market charcoal cleansers rely on harsh Sodium Lauryl Sulfate (SLS) and an undisclosed trace of carbon powder purely for black coloring, Bhumivera formulates every 100ml bottle with a label-disclosed 3.0% concentration of steam-activated microporous carbon suspended inside a generous 5.0% Botanical Glycerin cushion, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Wild Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract.</p>\n\n  <h3>I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters</h3>\n  <p>At the core of this formulation is 3.0% Steam-Activated Bamboo Charcoal (Bambusa tulda), harvested from sustainable groves in Assam and steam-activated at 850°C to create an internal microporous lattice exceeding 900 square meters of surface area per gram. Crucially, our carbon is jet-milled to an ultra-fine, spherical particle profile under 15 microns. Unlike crushed walnut shells, apricot kernels, or coarse charcoal powders that inflict microscopic lacerations (micro-tears) across the stratum corneum, Bhumivera's sub-15-micron activated carbon glides silkily across the epidermis, acting as a lipophilic molecular magnet that binds and lifts oxidized sebum, sunscreen residue, and PM2.5 soot through physical adsorption.</p><p>To ensure that this powerful adsorption never leaves the skin feeling tight, dry, or squeaky, the 3.0% carbon core is balanced by a 5.0% Plant-Derived Glycerin humectant matrix and 0.1% bio-fermented Sodium Hyaluronate (Hyaluronic Acid). During the 30-to-45-second cleansing massage, Glycerin and Hyaluronic Acid form a hydrogen-bonded hydration shield over the corneocytes, while 0.1% USP-grade Niacinamide (Vitamin B3) supports barrier lipid resilience and helps normalize sebaceous gland output.</p>\n  <p>For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque <code>&ldquo;Aqua / Base Q.S.&rdquo;</code> disclosure on the back—where high-value botanicals like <a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Himalayan Sea Buckthorn</a>, <a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Manjistha (Rubia cordifolia)</a>, <a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Haridra (Curcuma longa)</a>, <a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reetha (Sapindus mukorossi)</a>, and <a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Sacred Tulsi (Ocimum tenuiflorum)</a> are dusted in at trace levels below 0.01% and boiled at 80°C–100°C. <a href=\"https://bhumivera.com/science\">Bhumivera’s Sub-28°C Formulation Lab</a> eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Niacinamide Vitamin B3</a>, <a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Multi-Molecular Hyaluronic Acid</a>, and Plant-Derived Glycerin) at full, verifiable label potencies.</p>\n\n  <h4>Complete Active Ingredient &amp; Phytochemical Monograph Table (100 ML)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Disclosed Active &amp; INCI</th>\n          <th>Label Potency</th>\n          <th>Botanical / Chemical Class &amp; Reference</th>\n          <th>Extraction &amp; Harvest Corridor</th>\n          <th>Dermal / Trichological / Cellular Mechanism</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Activated Charcoal</strong><br/><small>Carbon Black / Steam-Activated Bambusa tulda Carbon (<15 μm)</small></td>\n          <td><strong>3.0%</strong></td>\n          <td>Microporous Steam-Activated Carbon (<a href=\"https://en.wikipedia.org/wiki/Activated_carbon\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>850°C Steam Activation & Jet-Milling (<15 Microns) · <a href=\"/provenance-engine\">REG-03 · Assam & North-East Sustainable Bamboo Groves</a></td>\n          <td>Adsorbs surface PM2.5 urban pollutants, oxidized squalene, pore congestion, and excess sebum via Van der Waals forces without abrasive physical scrubbing.</td>\n        </tr><tr>\n          <td><strong>Botanical Glycerin</strong><br/><small>Glycerin (Plant-Derived Trihydroxy Sugar Alcohol)</small></td>\n          <td><strong>5.0%</strong></td>\n          <td>Plant-Derived Humectant Cushion (<a href=\"https://en.wikipedia.org/wiki/Glycerol\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold-Filtered Vegetable Lipid Hydrolysis (USP Grade) · <a href=\"/provenance-engine\">REG-06 · Indian Plant-Oil Fractionation Cleanroom</a></td>\n          <td>Creates an intensive 5.0% moisture cushion that prevents surfactant-induced tightness, supports aquaporin-3 water transport, and protects the stratum corneum barrier.</td>\n        </tr><tr>\n          <td><strong>Manjistha Extract</strong><br/><small>Rubia cordifolia Root Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Rubia cordifolia (Varnya Root) (<a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Hydro-Glycerinic Root Maceration · <a href=\"/provenance-engine\">REG-05 · Vindhya & Central Indian Forest Belts</a></td>\n          <td>Revered Ayurvedic complexion-brightening (Varnya) root that modulates oxidative tyrosinase activity, calms post-blemish erythema, and visibly evens out dull skin tone.</td>\n        </tr><tr>\n          <td><strong>Haridra (Wild Turmeric)</strong><br/><small>Curcuma longa Rhizome Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Curcuma longa Rhizome (<a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Rhizome Extraction · <a href=\"/provenance-engine\">REG-05 · Nilgiri & Eastern India Organic Farms</a></td>\n          <td>Antioxidant-rich botanical rhizome that neutralizes UV- and pollution-induced free radicals, calms redness, and supports natural cellular luminosity.</td>\n        </tr><tr>\n          <td><strong>Neem Extract</strong><br/><small>Azadirachta indica Leaf Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Azadirachta indica Leaf (<a href=\"https://en.wikipedia.org/wiki/Azadirachta_indica\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Leaf Infusion · <a href=\"/provenance-engine\">REG-05 · Central & Eastern India Botanical Cooperatives</a></td>\n          <td>Time-tested purifying leaf extract that clarifies congested pores, balances cutaneous flora, and defends blemish-prone skin against urban grime.</td>\n        </tr><tr>\n          <td><strong>Cucumber Extract</strong><br/><small>Cucumis sativus Fruit Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Cucumis sativus Cellular Water (<a href=\"https://en.wikipedia.org/wiki/Cucumber\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold Cellular Press (<25°C) · <a href=\"/provenance-engine\">REG-06 · Eastern India Agrarian Clusters</a></td>\n          <td>Instantly cools heat-flushed skin, reduces morning puffiness, and delivers lightweight amino-acid and mineral hydration.</td>\n        </tr><tr>\n          <td><strong>Hyaluronic Acid</strong><br/><small>Sodium Hyaluronate (Bio-Fermented)</small></td>\n          <td><strong>0.1%</strong></td>\n          <td>Sodium Hyaluronate Polysaccharide (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Plant-Glucose Bio-Fermentation (100% Vegan) · <a href=\"/provenance-engine\">Analytical Cleanroom Bio-Fermentation</a></td>\n          <td>Biomimetic water-binding humectant that binds up to 1,000x its weight in water, forming a breathable hydration veil during cleansing for a plump, dewy feel.</td>\n        </tr><tr>\n          <td><strong>Niacinamide (Vitamin B3)</strong><br/><small>Niacinamide (Pyridine-3-carboxamide · USP Grade)</small></td>\n          <td><strong>0.1%</strong></td>\n          <td>Nicotinamide (Vitamin B3) (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Pharmaceutical Grade Synthesis (Zero Nicotinic Acid Flush) · <a href=\"/provenance-engine\">USP/EP Certified Analytical Synthesis</a></td>\n          <td>Supports natural epidermal ceramide and free-fatty-acid synthesis, helps regulate excess T-zone sebum, and refines the appearance of enlarged pores.</td>\n        </tr><tr>\n          <td><strong>Perfume & Cleanser Base</strong><br/><small>Aqua, Decyl Glucoside, Coco-Glucoside, Cocamidopropyl Betaine, IFRA Botanical Aroma</small></td>\n          <td><strong>0.5% / Q.S.</strong></td>\n          <td>pH-Balanced Sulfate-Free Emulsion (<a href=\"https://bhumivera.com/science\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold-Compounded Cleanroom Homogenization (<28°C) · <a href=\"/provenance-engine\">REG-06 · GMP Formulation Cleanroom</a></td>\n          <td>Gentle, 100% sulfate-free (0% SLS/SLES) cleansing suspension vehicle that lifts impurities without disrupting intercellular barrier lipids.</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3>II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced))</h3>\n  <p>What elevates the Bhumivera Activated Charcoal Purifying Luxury Face Wash into a true Ayurvedic-clinical hybrid is its standardized 2.0% quad-botanical phyto-complex: 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). In classical Ayurvedic dermatology, Manjistha and Haridra are revered as premier 'Varnya' (complexion-illuminating and blood/lymph-clarifying) botanicals. Rich in purpurin, munjistin, and bioactive curcuminoids, they calm the appearance of post-blemish redness and help visibly even out sun-induced hyperpigmentation.</p><p>Simultaneously, 0.5% cold-extracted Neem leaf delivers nimbidin and quercetin limonoids that keep acne-prone and congested pores clarified, while 0.5% fresh Cucumber cellular extract cools epidermal heat and replenishes soothing silica and amino acids. For patrons who practice a dual-cleanser routine, pairing this 3% Activated Charcoal Face Wash in the evening (PM) with our 4% Himalayan Sea Buckthorn Cellular Radiance Face Wash in the morning (AM) provides 24-hour pore clarity and Omega-7 radiance.</p>\n  <p>Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically <em>beta-glucocerebrosidase</em> and <em>acidic sphingomyelinase</em>—require an acidic microenvironment between <strong>pH 4.7 and 5.75</strong> to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating <strong>Bhumivera Activated Charcoal Purifying Luxury Face Wash</strong> to <strong>pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)</strong> and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our <a href=\"/verify\">Bottle Serial &amp; COA Verification Portal</a> and <a href=\"/somatic-registry\">Somatic INCI Label Registry</a>), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it.</p>\n\n  <h3>III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule</h3>\n  <p>To unlock the full benefit of this 9.7% active-disclosed emulsion, treat cleansing as a mindful 45-second dermal treatment rather than a rushed 5-second splash. Because the formula uses mild, biodegradable plant glucosides rather than synthetic SLS foaming agents, it produces a dense, creamy micro-velvet lather that rinses away effortlessly without leaving a soapy film.</p>\n  <ul>\n    <li><strong>Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):</strong> Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer.</li>\n    <li><strong>Step 2 — Measured Dispensing &amp; Palmar Emulsification:</strong> Dispense the recommended dose of <strong>Bhumivera Activated Charcoal Purifying Luxury Face Wash</strong> into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp.</li>\n    <li><strong>Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:</strong> Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives (<strong>Charcoal (3%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)</strong>) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates.</li>\n    <li><strong>Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:</strong> Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary <a href=\"/shop\">Bhumivera Inside-Out Ritual</a> formulations.</li>\n    <li><strong>Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:</strong> Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility (<a href=\"/lab\">read our full Cleanroom &amp; Patch-Test Protocol</a>).</li>\n  </ul>\n\n  <h3>IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter)</h3>\n  <p>Whether you commute through high-traffic metropolitan corridors in Delhi NCR, Mumbai, Bengaluru, Kolkata, Hyderabad, or industrial hubs like Asansol and Durgapur, daily particulate exposure accelerates oxidative skin stress. In peak summer and monsoon humidity, use this cleanser morning and evening to keep T-zone sebum balanced. In dry winter months, use it as your evening (PM) deep-pore reset and pair with the Bhumivera Himalayan Sea Buckthorn Face Wash in the morning.</p>\n  <p>Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum. <strong>Bhumivera Activated Charcoal Purifying Luxury Face Wash</strong> is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration.</p>\n\n  <h3>V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem</h3>\n  <p>Every formulation in the <a href=\"/shop\">Bhumivera 6-Product Flagship Catalog</a> is engineered to work as part of an interconnected, inside-out botanical system. Explore how <strong>Bhumivera Activated Charcoal Purifying Luxury Face Wash</strong> pairs with our companion formulations:</p>\n  <ul>\n    <li><strong>1. <a href=\"/product/activated-charcoal-luxury-face-wash\">Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699)</a>:</strong> Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification.</li>\n    <li><strong>2. <a href=\"/product/himalayan-seabuckthorn-luxury-face-wash\">Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799)</a>:</strong> Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity.</li>\n    <li><strong>3. <a href=\"/product/luxury-2-in-1-botanical-shampoo-conditioner\">Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899)</a>:</strong> Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing.</li>\n    <li><strong>4. <a href=\"/product/artisanal-charcoal-handmade-soap\">Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399)</a>:</strong> Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification.</li>\n    <li><strong>5. <a href=\"/product/artisanal-aloe-vera-handmade-soap\">Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349)</a>:</strong> Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care.</li>\n    <li><strong>6. <a href=\"/product/kalpvriksh-satva-tulsi-7-tulsi-extract\">Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499)</a>:</strong> Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality.</li>\n  </ul>\n  <p>You can also acquire coordinated sets in our <a href=\"/combo/bundle-daily-regimen\">Grand Maison 4-Piece Daily Apothecary Bundle</a>, <a href=\"/combo/bundle-royal-crown-trio\">Royal Skin &amp; Scalp Stewardship Trio</a>, <a href=\"/combo/bundle-inside-out-ritual\">Inside-Out Skin-Clearing &amp; Cortisol Ritual</a>, or the collector’s <a href=\"/combo/bundle-grand-maison-vault\">Grand Maison 6-Piece Apothecary Vault</a>, or compare any two formulations side-by-side on our <a href=\"/compare\">Interactive Formulation Comparison Tool</a>.</p>\n\n  <h3>VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact</h3>\n  <p>Every bottle of Bhumivera Activated Charcoal Purifying Luxury Face Wash (Batch #SCFW26H · Sample COA Serial: BHMV-2610-CH041) undergoes cleanroom microbiological screening (<10 CFU/ml) and ICP-MS heavy-metal verification (Lead <0.04 ppm, Arsenic <0.01 ppm, Mercury ND).</p>\n  <p>Every unit of <strong>Bhumivera Activated Charcoal Purifying Luxury Face Wash</strong> is traceable through our <a href=\"/provenance-engine\">6-Corridor Indian Botanical Provenance Engine</a> and protected by <a href=\"/purchase-protection\">Bhumivera White-Glove Purchase Protection</a>. To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard (<a href=\"/legal/shipping-hygiene\">Part II of the Bhumivera Legal Suite</a>) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch (<a href=\"/order-tracking\">track live AWB &amp; dispatch weight logs</a>). Furthermore, every order supports our verifiable community initiatives documented on the <a href=\"/impact\">Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact)</a>—including <a href=\"/impact/stray-animal-care\">The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative</a> and <a href=\"/impact/elderly-disabled-rations\">The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative</a> in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors (<a href=\"/impact/damodar-cleanup\">Damodar Riverbank Vetiver Cleanup</a>, <a href=\"/impact/jute-sapling-nursery\">Biodegradable Jute Sapling Nursery</a>, <a href=\"/impact/village-pukur-revival\">Village Pukur Pond Revival</a>, <a href=\"/impact/herbal-kitchen-gardens\">Medicinal Herbal Kitchen Gardens</a>, <a href=\"/impact/mandi-vermicomposting\">Mandi Waste Vermicomposting</a>, and <a href=\"/impact/coal-belt-microgrove\">Coal-Belt Native Micro-Grove</a>).</p>\n\n  <h4>Technical &amp; Regulatory Specification Summary (BV-LUX-CFW-01)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Specification Parameter</th>\n          <th>Verified Bhumivera Standard</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Brand Name</strong></td>\n          <td>Bhumivera (The Transparent Maison · Est. 2016 Lineage)</td>\n        </tr><tr>\n          <td><strong>Product Full Name</strong></td>\n          <td>Bhumivera Activated Charcoal Purifying Luxury Face Wash</td>\n        </tr><tr>\n          <td><strong>SKU Code</strong></td>\n          <td>BV-LUX-CFW-01 (Legacy: BV-CHFW-100ML)</td>\n        </tr><tr>\n          <td><strong>MPN Code</strong></td>\n          <td>BVCFW100ML</td>\n        </tr><tr>\n          <td><strong>GTIN 13 EAN</strong></td>\n          <td>8906182600018</td>\n        </tr><tr>\n          <td><strong>GST HSN Code</strong></td>\n          <td>30049011 (Ayurvedic & Botanical Preparations · 5% GST)</td>\n        </tr><tr>\n          <td><strong>Net Volume Metric</strong></td>\n          <td>100 ML (3.38 fl. oz.)</td>\n        </tr><tr>\n          <td><strong>Gross Dispatch Weight</strong></td>\n          <td>215.0 Grams (±0.5g Digital Scale Verified)</td>\n        </tr><tr>\n          <td><strong>Batch Number</strong></td>\n          <td>SCFW26H / BATCH-04/26-CH (250 Units per Micro-Batch)</td>\n        </tr><tr>\n          <td><strong>Calibrated pH Range</strong></td>\n          <td>pH 5.40 – 5.51 at 25.0°C (Digital Glass Electrode Verified)</td>\n        </tr><tr>\n          <td><strong>Extraction Temperature</strong></td>\n          <td>< 28.0°C (25.8°C Cold-Compounded Sub-Ambient Protocol)</td>\n        </tr><tr>\n          <td><strong>Primary Purifying Active</strong></td>\n          <td>3.0% Steam-Activated Microporous Bamboo Charcoal (<15 Microns)</td>\n        </tr><tr>\n          <td><strong>Primary Humectant Cushion</strong></td>\n          <td>5.0% Plant-Derived Botanical Glycerin + 0.1% Hyaluronic Acid</td>\n        </tr><tr>\n          <td><strong>Barrier Vitamin CoFactor</strong></td>\n          <td>0.1% USP-Grade Niacinamide (Vitamin B3 · Pyridine-3-carboxamide)</td>\n        </tr><tr>\n          <td><strong>Ayurvedic Phyto Complex</strong></td>\n          <td>0.5% Manjistha + 0.5% Haridra (Turmeric) + 0.5% Neem + 0.5% Cucumber</td>\n        </tr><tr>\n          <td><strong>Total Disclosed Actives</strong></td>\n          <td>9.7% Active & Functional Botanical/Humectant Concentration + Q.S. Base</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</article>",
    "description": "Where Sub-28°C Botanical Science Meets Royal Ayurveda: The 3% Activated Charcoal & 5% Glycerin Barrier Cleanser \n    Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · SKU: BV-LUX-CFW-01)  is a flagship formulation from   Bhumivera — The Transparent Maison   ( Bhumivera Organics India Private Limited , incorporated August 4, 2026 under Founder  Akash Prasad  and Directors  Akash Prasad, Payal Prasad &amp; Aman Prasad ), rooted in the 10-year herbal manufacturing and household distribution heritage of   MPG E-Business Private Limited   (established September 22, 2016 in Asansol, West Bengal · CIN:  U74999WB2016PTC217735  · Founder:  Dilip Prasad Nonia ). Engineered under  The Bhumivera Transparency Standard (Est. 2016 lineage) , this formulation prints 100% of its functional active concentrations openly on the physical bottle label:  Charcoal (3%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.) , calibrated to  pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced) . \n   Urban life across modern cities exposes facial skin to an invisible daily siege of particulate matter (PM2.5 and PM10 traffic soot), polycyclic aromatic hydrocarbons (PAHs), heavy metals, and volatile organic compounds. Because PM2.5 particles measure less than 2.5 micrometers in diameter—roughly 20 times smaller than a human pore opening—they penetrate deep into the pilosebaceous unit, where they catalyze the peroxidation of natural squalene into comedogenic squalene monohydroperoxide. The result is chronic low-grade inflammation, stubborn blackheads, enlarged pores, and premature dullness.  The Bhumivera Activated Charcoal Purifying Luxury Face Wash was engineered specifically for label-conscious skincare buyers who demand deep urban pore purification without sacrificing their skin's delicate moisture barrier. While mass-market charcoal cleansers rely on harsh Sodium Lauryl Sulfate (SLS) and an undisclosed trace of carbon powder purely for black coloring, Bhumivera formulates every 100ml bottle with a label-disclosed 3.0% concentration of steam-activated microporous carbon suspended inside a generous 5.0% Botanical Glycerin cushion, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Wild Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract. \n\n   I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters \n   At the core of this formulation is 3.0% Steam-Activated Bamboo Charcoal (Bambusa tulda), harvested from sustainable groves in Assam and steam-activated at 850°C to create an internal microporous lattice exceeding 900 square meters of surface area per gram. Crucially, our carbon is jet-milled to an ultra-fine, spherical particle profile under 15 microns. Unlike crushed walnut shells, apricot kernels, or coarse charcoal powders that inflict microscopic lacerations (micro-tears) across the stratum corneum, Bhumivera's sub-15-micron activated carbon glides silkily across the epidermis, acting as a lipophilic molecular magnet that binds and lifts oxidized sebum, sunscreen residue, and PM2.5 soot through physical adsorption.  To ensure that this powerful adsorption never leaves the skin feeling tight, dry, or squeaky, the 3.0% carbon core is balanced by a 5.0% Plant-Derived Glycerin humectant matrix and 0.1% bio-fermented Sodium Hyaluronate (Hyaluronic Acid). During the 30-to-45-second cleansing massage, Glycerin and Hyaluronic Acid form a hydrogen-bonded hydration shield over the corneocytes, while 0.1% USP-grade Niacinamide (Vitamin B3) supports barrier lipid resilience and helps normalize sebaceous gland output. \n   For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque  &ldquo;Aqua / Base Q.S.&rdquo;  disclosure on the back—where high-value botanicals like  Himalayan Sea Buckthorn ,  Manjistha (Rubia cordifolia) ,  Haridra (Curcuma longa) ,  Reetha (Sapindus mukorossi) , and  Sacred Tulsi (Ocimum tenuiflorum)  are dusted in at trace levels below 0.01% and boiled at 80°C–100°C.  Bhumivera’s Sub-28°C Formulation Lab  eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants ( Niacinamide Vitamin B3 ,  Multi-Molecular Hyaluronic Acid , and Plant-Derived Glycerin) at full, verifiable label potencies. \n\n   Complete Active Ingredient &amp; Phytochemical Monograph Table (100 ML) \n   \n     \n       \n         \n           Disclosed Active &amp; INCI \n           Label Potency \n           Botanical / Chemical Class &amp; Reference \n           Extraction &amp; Harvest Corridor \n           Dermal / Trichological / Cellular Mechanism \n         \n       \n       \n         \n            Activated Charcoal   Carbon Black / Steam-Activated Bambusa tulda Carbon (  \n            3.0%  \n           Microporous Steam-Activated Carbon ( Reference ↗ ) \n           850°C Steam Activation & Jet-Milling ( REG-03 · Assam & North-East Sustainable Bamboo Groves  \n           Adsorbs surface PM2.5 urban pollutants, oxidized squalene, pore congestion, and excess sebum via Van der Waals forces without abrasive physical scrubbing. \n          \n            Botanical Glycerin   Glycerin (Plant-Derived Trihydroxy Sugar Alcohol)  \n            5.0%  \n           Plant-Derived Humectant Cushion ( Reference ↗ ) \n           Cold-Filtered Vegetable Lipid Hydrolysis (USP Grade) ·  REG-06 · Indian Plant-Oil Fractionation Cleanroom  \n           Creates an intensive 5.0% moisture cushion that prevents surfactant-induced tightness, supports aquaporin-3 water transport, and protects the stratum corneum barrier. \n          \n            Manjistha Extract   Rubia cordifolia Root Extract  \n            0.5%  \n           Rubia cordifolia (Varnya Root) ( Reference ↗ ) \n           Sub-28°C Hydro-Glycerinic Root Maceration ·  REG-05 · Vindhya & Central Indian Forest Belts  \n           Revered Ayurvedic complexion-brightening (Varnya) root that modulates oxidative tyrosinase activity, calms post-blemish erythema, and visibly evens out dull skin tone. \n          \n            Haridra (Wild Turmeric)   Curcuma longa Rhizome Extract  \n            0.5%  \n           Curcuma longa Rhizome ( Reference ↗ ) \n           Sub-28°C Cold Rhizome Extraction ·  REG-05 · Nilgiri & Eastern India Organic Farms  \n           Antioxidant-rich botanical rhizome that neutralizes UV- and pollution-induced free radicals, calms redness, and supports natural cellular luminosity. \n          \n            Neem Extract   Azadirachta indica Leaf Extract  \n            0.5%  \n           Azadirachta indica Leaf ( Reference ↗ ) \n           Sub-28°C Cold Leaf Infusion ·  REG-05 · Central & Eastern India Botanical Cooperatives  \n           Time-tested purifying leaf extract that clarifies congested pores, balances cutaneous flora, and defends blemish-prone skin against urban grime. \n          \n            Cucumber Extract   Cucumis sativus Fruit Extract  \n            0.5%  \n           Cucumis sativus Cellular Water ( Reference ↗ ) \n           Cold Cellular Press ( REG-06 · Eastern India Agrarian Clusters  \n           Instantly cools heat-flushed skin, reduces morning puffiness, and delivers lightweight amino-acid and mineral hydration. \n          \n            Hyaluronic Acid   Sodium Hyaluronate (Bio-Fermented)  \n            0.1%  \n           Sodium Hyaluronate Polysaccharide ( Reference ↗ ) \n           Plant-Glucose Bio-Fermentation (100% Vegan) ·  Analytical Cleanroom Bio-Fermentation  \n           Biomimetic water-binding humectant that binds up to 1,000x its weight in water, forming a breathable hydration veil during cleansing for a plump, dewy feel. \n          \n            Niacinamide (Vitamin B3)   Niacinamide (Pyridine-3-carboxamide · USP Grade)  \n            0.1%  \n           Nicotinamide (Vitamin B3) ( Reference ↗ ) \n           Pharmaceutical Grade Synthesis (Zero Nicotinic Acid Flush) ·  USP/EP Certified Analytical Synthesis  \n           Supports natural epidermal ceramide and free-fatty-acid synthesis, helps regulate excess T-zone sebum, and refines the appearance of enlarged pores. \n          \n            Perfume & Cleanser Base   Aqua, Decyl Glucoside, Coco-Glucoside, Cocamidopropyl Betaine, IFRA Botanical Aroma  \n            0.5% / Q.S.  \n           pH-Balanced Sulfate-Free Emulsion ( Reference ↗ ) \n           Cold-Compounded Cleanroom Homogenization ( REG-06 · GMP Formulation Cleanroom  \n           Gentle, 100% sulfate-free (0% SLS/SLES) cleansing suspension vehicle that lifts impurities without disrupting intercellular barrier lipids. \n         \n       \n     \n   \n\n   II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)) \n   What elevates the Bhumivera Activated Charcoal Purifying Luxury Face Wash into a true Ayurvedic-clinical hybrid is its standardized 2.0% quad-botanical phyto-complex: 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). In classical Ayurvedic dermatology, Manjistha and Haridra are revered as premier 'Varnya' (complexion-illuminating and blood/lymph-clarifying) botanicals. Rich in purpurin, munjistin, and bioactive curcuminoids, they calm the appearance of post-blemish redness and help visibly even out sun-induced hyperpigmentation.  Simultaneously, 0.5% cold-extracted Neem leaf delivers nimbidin and quercetin limonoids that keep acne-prone and congested pores clarified, while 0.5% fresh Cucumber cellular extract cools epidermal heat and replenishes soothing silica and amino acids. For patrons who practice a dual-cleanser routine, pairing this 3% Activated Charcoal Face Wash in the evening (PM) with our 4% Himalayan Sea Buckthorn Cellular Radiance Face Wash in the morning (AM) provides 24-hour pore clarity and Omega-7 radiance. \n   Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically  beta-glucocerebrosidase  and  acidic sphingomyelinase —require an acidic microenvironment between  pH 4.7 and 5.75  to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating  Bhumivera Activated Charcoal Purifying Luxury Face Wash  to  pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)  and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our  Bottle Serial &amp; COA Verification Portal  and  Somatic INCI Label Registry ), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it. \n\n   III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule \n   To unlock the full benefit of this 9.7% active-disclosed emulsion, treat cleansing as a mindful 45-second dermal treatment rather than a rushed 5-second splash. Because the formula uses mild, biodegradable plant glucosides rather than synthetic SLS foaming agents, it produces a dense, creamy micro-velvet lather that rinses away effortlessly without leaving a soapy film. \n   \n      Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):  Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer. \n      Step 2 — Measured Dispensing &amp; Palmar Emulsification:  Dispense the recommended dose of  Bhumivera Activated Charcoal Purifying Luxury Face Wash  into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp. \n      Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:  Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives ( Charcoal (3%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.) ) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates. \n      Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:  Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary  Bhumivera Inside-Out Ritual  formulations. \n      Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:  Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility ( read our full Cleanroom &amp; Patch-Test Protocol ). \n   \n\n   IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter) \n   Whether you commute through high-traffic metropolitan corridors in Delhi NCR, Mumbai, Bengaluru, Kolkata, Hyderabad, or industrial hubs like Asansol and Durgapur, daily particulate exposure accelerates oxidative skin stress. In peak summer and monsoon humidity, use this cleanser morning and evening to keep T-zone sebum balanced. In dry winter months, use it as your evening (PM) deep-pore reset and pair with the Bhumivera Himalayan Sea Buckthorn Face Wash in the morning. \n   Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum.  Bhumivera Activated Charcoal Purifying Luxury Face Wash  is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration. \n\n   V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem \n   Every formulation in the  Bhumivera 6-Product Flagship Catalog  is engineered to work as part of an interconnected, inside-out botanical system. Explore how  Bhumivera Activated Charcoal Purifying Luxury Face Wash  pairs with our companion formulations: \n   \n      1.  Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699) :  Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification. \n      2.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799) :  Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity. \n      3.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899) :  Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing. \n      4.  Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399) :  Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification. \n      5.  Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349) :  Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care. \n      6.  Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499) :  Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality. \n   \n   You can also acquire coordinated sets in our  Grand Maison 4-Piece Daily Apothecary Bundle ,  Royal Skin &amp; Scalp Stewardship Trio ,  Inside-Out Skin-Clearing &amp; Cortisol Ritual , or the collector’s  Grand Maison 6-Piece Apothecary Vault , or compare any two formulations side-by-side on our  Interactive Formulation Comparison Tool . \n\n   VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact \n   Every bottle of Bhumivera Activated Charcoal Purifying Luxury Face Wash (Batch #SCFW26H · Sample COA Serial: BHMV-2610-CH041) undergoes cleanroom microbiological screening ( \n   Every unit of  Bhumivera Activated Charcoal Purifying Luxury Face Wash  is traceable through our  6-Corridor Indian Botanical Provenance Engine  and protected by  Bhumivera White-Glove Purchase Protection . To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard ( Part II of the Bhumivera Legal Suite ) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch ( track live AWB &amp; dispatch weight logs ). Furthermore, every order supports our verifiable community initiatives documented on the  Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact) —including  The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative  and  The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative  in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors ( Damodar Riverbank Vetiver Cleanup ,  Biodegradable Jute Sapling Nursery ,  Village Pukur Pond Revival ,  Medicinal Herbal Kitchen Gardens ,  Mandi Waste Vermicomposting , and  Coal-Belt Native Micro-Grove ). \n\n   Technical &amp; Regulatory Specification Summary (BV-LUX-CFW-01) \n   \n     \n       \n         \n           Specification Parameter \n           Verified Bhumivera Standard \n         \n       \n       \n         \n            Brand Name  \n           Bhumivera (The Transparent Maison · Est. 2016 Lineage) \n          \n            Product Full Name  \n           Bhumivera Activated Charcoal Purifying Luxury Face Wash \n          \n            SKU Code  \n           BV-LUX-CFW-01 (Legacy: BV-CHFW-100ML) \n          \n            MPN Code  \n           BVCFW100ML \n          \n            GTIN 13 EAN  \n           8906182600018 \n          \n            GST HSN Code  \n           30049011 (Ayurvedic & Botanical Preparations · 5% GST) \n          \n            Net Volume Metric  \n           100 ML (3.38 fl. oz.) \n          \n            Gross Dispatch Weight  \n           215.0 Grams (±0.5g Digital Scale Verified) \n          \n            Batch Number  \n           SCFW26H / BATCH-04/26-CH (250 Units per Micro-Batch) \n          \n            Calibrated pH Range  \n           pH 5.40 – 5.51 at 25.0°C (Digital Glass Electrode Verified) \n          \n            Extraction Temperature  \n            \n          \n            Primary Purifying Active  \n           3.0% Steam-Activated Microporous Bamboo Charcoal ( \n          \n            Primary Humectant Cushion  \n           5.0% Plant-Derived Botanical Glycerin + 0.1% Hyaluronic Acid \n          \n            Barrier Vitamin CoFactor  \n           0.1% USP-Grade Niacinamide (Vitamin B3 · Pyridine-3-carboxamide) \n          \n            Ayurvedic Phyto Complex  \n           0.5% Manjistha + 0.5% Haridra (Turmeric) + 0.5% Neem + 0.5% Cucumber \n          \n            Total Disclosed Actives  \n           9.7% Active & Functional Botanical/Humectant Concentration + Q.S. Base",
    "editorial_heading": "Where Sub-28°C Botanical Science Meets Royal Ayurveda: The 3% Activated Charcoal & 5% Glycerin Barrier Cleanser",
    "editorial_paragraphs": [
      "Urban life across modern cities exposes facial skin to an invisible daily siege of particulate matter (PM2.5 and PM10 traffic soot), polycyclic aromatic hydrocarbons (PAHs), heavy metals, and volatile organic compounds. Because PM2.5 particles measure less than 2.5 micrometers in diameter—roughly 20 times smaller than a human pore opening—they penetrate deep into the pilosebaceous unit, where they catalyze the peroxidation of natural squalene into comedogenic squalene monohydroperoxide. The result is chronic low-grade inflammation, stubborn blackheads, enlarged pores, and premature dullness.",
      "The Bhumivera Activated Charcoal Purifying Luxury Face Wash was engineered specifically for label-conscious skincare buyers who demand deep urban pore purification without sacrificing their skin's delicate moisture barrier. While mass-market charcoal cleansers rely on harsh Sodium Lauryl Sulfate (SLS) and an undisclosed trace of carbon powder purely for black coloring, Bhumivera formulates every 100ml bottle with a label-disclosed 3.0% concentration of steam-activated microporous carbon suspended inside a generous 5.0% Botanical Glycerin cushion, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Wild Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract.",
      "At the core of this formulation is 3.0% Steam-Activated Bamboo Charcoal (Bambusa tulda), harvested from sustainable groves in Assam and steam-activated at 850°C to create an internal microporous lattice exceeding 900 square meters of surface area per gram. Crucially, our carbon is jet-milled to an ultra-fine, spherical particle profile under 15 microns. Unlike crushed walnut shells, apricot kernels, or coarse charcoal powders that inflict microscopic lacerations (micro-tears) across the stratum corneum, Bhumivera's sub-15-micron activated carbon glides silkily across the epidermis, acting as a lipophilic molecular magnet that binds and lifts oxidized sebum, sunscreen residue, and PM2.5 soot through physical adsorption.",
      "To ensure that this powerful adsorption never leaves the skin feeling tight, dry, or squeaky, the 3.0% carbon core is balanced by a 5.0% Plant-Derived Glycerin humectant matrix and 0.1% bio-fermented Sodium Hyaluronate (Hyaluronic Acid). During the 30-to-45-second cleansing massage, Glycerin and Hyaluronic Acid form a hydrogen-bonded hydration shield over the corneocytes, while 0.1% USP-grade Niacinamide (Vitamin B3) supports barrier lipid resilience and helps normalize sebaceous gland output.",
      "What elevates the Bhumivera Activated Charcoal Purifying Luxury Face Wash into a true Ayurvedic-clinical hybrid is its standardized 2.0% quad-botanical phyto-complex: 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). In classical Ayurvedic dermatology, Manjistha and Haridra are revered as premier 'Varnya' (complexion-illuminating and blood/lymph-clarifying) botanicals. Rich in purpurin, munjistin, and bioactive curcuminoids, they calm the appearance of post-blemish redness and help visibly even out sun-induced hyperpigmentation.",
      "Simultaneously, 0.5% cold-extracted Neem leaf delivers nimbidin and quercetin limonoids that keep acne-prone and congested pores clarified, while 0.5% fresh Cucumber cellular extract cools epidermal heat and replenishes soothing silica and amino acids. For patrons who practice a dual-cleanser routine, pairing this 3% Activated Charcoal Face Wash in the evening (PM) with our 4% Himalayan Sea Buckthorn Cellular Radiance Face Wash in the morning (AM) provides 24-hour pore clarity and Omega-7 radiance."
    ],
    "exactCompositionTable": [
      {
        "active": "Activated Charcoal",
        "ingredient": "Activated Charcoal",
        "potency": "3.0%",
        "concentration": "3.0%",
        "classification": "Microporous Steam-Activated Carbon",
        "botanical": "Microporous Steam-Activated Carbon",
        "inci": "",
        "molecular_markers": "High-porosity microporous carbon lattice (>900 m²/g surface area)",
        "extraction_method": "850°C Steam Activation & Jet-Milling (<15 Microns)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
        "mechanism": "Adsorbs surface PM2.5 urban pollutants, oxidized squalene, pore congestion, and excess sebum via Van der Waals forces without abrasive physical scrubbing.",
        "role": "Adsorbs surface PM2.5 urban pollutants, oxidized squalene, pore congestion, and excess sebum via Van der Waals forces without abrasive physical scrubbing.",
        "synergy_partners": "5% Botanical Glycerin + 0.5% Neem + 0.1% Niacinamide",
        "reference_url": "https://en.wikipedia.org/wiki/Activated_carbon"
      },
      {
        "active": "Botanical Glycerin",
        "ingredient": "Botanical Glycerin",
        "potency": "5.0%",
        "concentration": "5.0%",
        "classification": "Plant-Derived Humectant Cushion",
        "botanical": "Plant-Derived Humectant Cushion",
        "inci": "",
        "molecular_markers": "Propane-1,2,3-triol (3 Hydrophilic Hydroxyl Groups)",
        "extraction_method": "Cold-Filtered Vegetable Lipid Hydrolysis (USP Grade)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
        "mechanism": "Creates an intensive 5.0% moisture cushion that prevents surfactant-induced tightness, supports aquaporin-3 water transport, and protects the stratum corneum barrier.",
        "role": "Creates an intensive 5.0% moisture cushion that prevents surfactant-induced tightness, supports aquaporin-3 water transport, and protects the stratum corneum barrier.",
        "synergy_partners": "0.1% Hyaluronic Acid + 0.5% Cucumber Extract",
        "reference_url": "https://en.wikipedia.org/wiki/Glycerol"
      },
      {
        "active": "Manjistha Extract",
        "ingredient": "Manjistha Extract",
        "potency": "0.5%",
        "concentration": "0.5%",
        "classification": "Rubia cordifolia (Varnya Root)",
        "botanical": "Rubia cordifolia (Varnya Root)",
        "inci": "",
        "molecular_markers": "Purpurin, Munjistin, Xanthopurpurin & Rubiadin Anthraquinones",
        "extraction_method": "Sub-28°C Hydro-Glycerinic Root Maceration",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
        "mechanism": "Revered Ayurvedic complexion-brightening (Varnya) root that modulates oxidative tyrosinase activity, calms post-blemish erythema, and visibly evens out dull skin tone.",
        "role": "Revered Ayurvedic complexion-brightening (Varnya) root that modulates oxidative tyrosinase activity, calms post-blemish erythema, and visibly evens out dull skin tone.",
        "synergy_partners": "0.5% Haridra (Turmeric) + 0.1% Niacinamide",
        "reference_url": "https://en.wikipedia.org/wiki/Rubia_cordifolia"
      },
      {
        "active": "Haridra (Wild Turmeric)",
        "ingredient": "Haridra (Wild Turmeric)",
        "potency": "0.5%",
        "concentration": "0.5%",
        "classification": "Curcuma longa Rhizome",
        "botanical": "Curcuma longa Rhizome",
        "inci": "",
        "molecular_markers": "Curcuminoids (Curcumin, Demethoxycurcumin) & Ar-turmerone",
        "extraction_method": "Sub-28°C Cold Rhizome Extraction",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
        "mechanism": "Antioxidant-rich botanical rhizome that neutralizes UV- and pollution-induced free radicals, calms redness, and supports natural cellular luminosity.",
        "role": "Antioxidant-rich botanical rhizome that neutralizes UV- and pollution-induced free radicals, calms redness, and supports natural cellular luminosity.",
        "synergy_partners": "0.5% Manjistha + 0.5% Neem Extract",
        "reference_url": "https://en.wikipedia.org/wiki/Turmeric"
      },
      {
        "active": "Neem Extract",
        "ingredient": "Neem Extract",
        "potency": "0.5%",
        "concentration": "0.5%",
        "classification": "Azadirachta indica Leaf",
        "botanical": "Azadirachta indica Leaf",
        "inci": "",
        "molecular_markers": "Nimbidin, Nimbin, Quercetin & Azadirachtin Limonoids",
        "extraction_method": "Sub-28°C Cold Leaf Infusion",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
        "mechanism": "Time-tested purifying leaf extract that clarifies congested pores, balances cutaneous flora, and defends blemish-prone skin against urban grime.",
        "role": "Time-tested purifying leaf extract that clarifies congested pores, balances cutaneous flora, and defends blemish-prone skin against urban grime.",
        "synergy_partners": "3.0% Activated Charcoal + 0.5% Haridra",
        "reference_url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
      },
      {
        "active": "Cucumber Extract",
        "ingredient": "Cucumber Extract",
        "potency": "0.5%",
        "concentration": "0.5%",
        "classification": "Cucumis sativus Cellular Water",
        "botanical": "Cucumis sativus Cellular Water",
        "inci": "",
        "molecular_markers": "Ascorbic Acid, Caffeic Acid, Lactic Acid & Bio-Silica",
        "extraction_method": "Cold Cellular Press (<25°C)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
        "mechanism": "Instantly cools heat-flushed skin, reduces morning puffiness, and delivers lightweight amino-acid and mineral hydration.",
        "role": "Instantly cools heat-flushed skin, reduces morning puffiness, and delivers lightweight amino-acid and mineral hydration.",
        "synergy_partners": "5.0% Botanical Glycerin + 0.1% Hyaluronic Acid",
        "reference_url": "https://en.wikipedia.org/wiki/Cucumber"
      },
      {
        "active": "Hyaluronic Acid",
        "ingredient": "Hyaluronic Acid",
        "potency": "0.1%",
        "concentration": "0.1%",
        "classification": "Sodium Hyaluronate Polysaccharide",
        "botanical": "Sodium Hyaluronate Polysaccharide",
        "inci": "",
        "molecular_markers": "Poly(beta-glucuronic acid-[1->3]-beta-N-acetylglucosamine)",
        "extraction_method": "Plant-Glucose Bio-Fermentation (100% Vegan)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
        "mechanism": "Biomimetic water-binding humectant that binds up to 1,000x its weight in water, forming a breathable hydration veil during cleansing for a plump, dewy feel.",
        "role": "Biomimetic water-binding humectant that binds up to 1,000x its weight in water, forming a breathable hydration veil during cleansing for a plump, dewy feel.",
        "synergy_partners": "5.0% Botanical Glycerin + 0.1% Niacinamide",
        "reference_url": "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate"
      },
      {
        "active": "Niacinamide (Vitamin B3)",
        "ingredient": "Niacinamide (Vitamin B3)",
        "potency": "0.1%",
        "concentration": "0.1%",
        "classification": "Nicotinamide (Vitamin B3)",
        "botanical": "Nicotinamide (Vitamin B3)",
        "inci": "",
        "molecular_markers": "NAD+ / NADP+ Coenzyme Precursor (C6H6N2O · Purity ≥99.5%)",
        "extraction_method": "Pharmaceutical Grade Synthesis (Zero Nicotinic Acid Flush)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
        "mechanism": "Supports natural epidermal ceramide and free-fatty-acid synthesis, helps regulate excess T-zone sebum, and refines the appearance of enlarged pores.",
        "role": "Supports natural epidermal ceramide and free-fatty-acid synthesis, helps regulate excess T-zone sebum, and refines the appearance of enlarged pores.",
        "synergy_partners": "0.1% Hyaluronic Acid + 0.5% Manjistha",
        "reference_url": "https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide"
      },
      {
        "active": "Perfume & Cleanser Base",
        "ingredient": "Perfume & Cleanser Base",
        "potency": "0.5% / Q.S.",
        "concentration": "0.5% / Q.S.",
        "classification": "pH-Balanced Sulfate-Free Emulsion",
        "botanical": "pH-Balanced Sulfate-Free Emulsion",
        "inci": "",
        "molecular_markers": "Mild Non-Ionic Alkyl Polyglucoside Micelles",
        "extraction_method": "Cold-Compounded Cleanroom Homogenization (<28°C)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.4 – 5.5 (Skin-Barrier Friendly & Acid-Mantle Balanced)",
        "mechanism": "Gentle, 100% sulfate-free (0% SLS/SLES) cleansing suspension vehicle that lifts impurities without disrupting intercellular barrier lipids.",
        "role": "Gentle, 100% sulfate-free (0% SLS/SLES) cleansing suspension vehicle that lifts impurities without disrupting intercellular barrier lipids.",
        "synergy_partners": "All 8 Disclosed Actives",
        "reference_url": "https://bhumivera.com/science"
      }
    ],
    "directAnswerFaqs": [
      {
        "q": "What is the exact ingredient percentage breakdown of Bhumivera Activated Charcoal Face Wash?",
        "a": "Each 100ml bottle features a 100% transparent, label-disclosed formulation: 3% Activated Charcoal, 5% Glycerin, 0.5% Haridra (Turmeric), 0.5% Neem, 0.5% Cucumber Extract, 0.5% Manjistha Extract, 0.1% Hyaluronic Acid, 0.1% Niacinamide, and 0.5% Perfume in a gentle pH-balanced cleansing base (Q.S.)."
      },
      {
        "q": "Does this face wash contain Niacinamide and Hyaluronic Acid?",
        "a": "Yes. Bhumivera Activated Charcoal Purifying Luxury Face Wash contains 0.1% USP-grade Niacinamide (Vitamin B3) and 0.1% Hyaluronic Acid alongside 5.0% Botanical Glycerin—making it an ideal choice if you are searching for a face wash with Niacinamide that purifies pores without drying the skin barrier."
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
        "q": "Will the 3% Activated Charcoal feel gritty or scratch my skin?",
        "a": "No. Our steam-activated bamboo charcoal is jet-milled to an ultra-fine particle size below 15 microns and suspended in a 5% Glycerin gel-emulsion, providing smooth, non-abrasive magnetic adsorption of oil and grime."
      },
      {
        "q": "Which Bhumivera face wash should I choose: 3% Activated Charcoal or 4% Himalayan Sea Buckthorn?",
        "a": "Both share our 5% Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, and 0.5% Cucumber base. Choose Activated Charcoal (₹699) for deep pore detoxification, blackhead care, and excess oil control; choose Himalayan Sea Buckthorn (₹799) for Omega-7 barrier nourishment and glowing radiance—or use Sea Buckthorn in the morning (AM) and Charcoal at night (PM)."
      },
      {
        "q": "How do I verify that my Bhumivera bottle is 100% genuine?",
        "a": "Every bottle carries a tamper-evident neck seal, batch code (SCFW26H), and QR/serial code. Visit https://bhumivera.com/verify to inspect your bottle's calibrated pH 5.48 assay and lab COA."
      },
      {
        "q": "How does Bhumivera Organics ensure ingredient transparency and formulation quality?",
        "a": "Bhumivera Organics is our registered brand and corporate name (Bhumivera Organics India Private Limited, backed by MPG E-Business Private Limited, Est. 2016). Our formulations combine plant-derived Ayurvedic botanicals with proven cosmetic actives and zero SLS/parabens, with every active concentration printed transparently on the label."
      },
      {
        "q": "Can men and women both use Bhumivera Activated Charcoal Face Wash?",
        "a": "Yes, it is a unisex formulation engineered for all adult skin profiles exposed to urban pollution, sweat, sunscreen, and excess T-zone sebum."
      },
      {
        "q": "What is the pH level of Bhumivera Activated Charcoal Face Wash?",
        "a": "It is calibrated to pH 5.4 – 5.5, matching the natural acidic mantle of healthy human facial skin."
      }
    ]
  },
  {
    "id": 2,
    "legacyIds": [
      8,
      2,
      101
    ],
    "name": "Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash",
    "subtitle": "4% Sea Buckthorn, 5% Glycerin, Manjistha, Haridra, Hyaluronic Acid & Niacinamide",
    "slug": "himalayan-seabuckthorn-luxury-face-wash",
    "rating": 4.74,
    "review_count": 290,
    "reviews": 290,
    "legacySlugs": [
      "aloe vera face wash",
      "sea-buckthorn-niacinamide-luxury-face-wash",
      "seabuckthorn-face-wash",
      "sea-buckthorn-face-wash",
      "seabuckthorn",
      "sea-buckthorn",
      "bhumivera-seabuckthorn-face-wash",
      "bhumivera-sea-buckthorn-face-wash",
      "facewash-with-niacinamide",
      "facewash-with-niacidamine",
      "niacinamide-face-wash",
      "hyaluronic-acid-face-wash"
    ],
    "sku": "BV-LUX-SBFW-02",
    "legacySkus": [
      "BV-SBFW-100ML"
    ],
    "mpn": "BVSBFW100ML",
    "gtin13": "8906182600025",
    "net_volume": "100 ML",
    "price": 799.0,
    "discountPrice": 799.0,
    "mrp": 999.0,
    "stock": 250,
    "quantity": 250,
    "gst_hsn_code": "30049011",
    "gst_rate": 5.0,
    "cost_price": 62.0,
    "batch_no": "SFW26H",
    "mfg_date": "2026-08-01",
    "manufacturer_name": "Sitashi Herbal Industry",
    "manufacturer_address": "H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022, Rajasthan",
    "manufacturer_gstin": "08AEQFS1102P1ZM",
    "manufacturer_fssai": "12222999000145",
    "category": "Luxury Facial Cleansers",
    "ph_level": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
    "active_ingredients": "Sea Buckthorn (4%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)",
    "image_url": "/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp",
    "image": "/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp",
    "additionalImages": [
      "/assets/images/seabuckthorn.webp",
      "/assets/images/seabuckthorn nature.webp"
    ],
    "seo_title": "Bhumivera Himalayan Sea Buckthorn Luxury Face Wash (100ml) | 4% Sea Buckthorn, 5% Glycerin, Hyaluronic Acid, Niacinamide & Manjistha Brightening Cleanser",
    "meta_description": "Discover Bhumivera Himalayan Sea Buckthorn Face Wash (100ml): formulated for conscious skincare buyers with 4% Sea Buckthorn (Omega-7 & Vitamin C), 5% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.1% Hyaluronic Acid & 0.1% Niacinamide.",
    "short_description": "Brightening botanical luxury face wash crafted for skin-conscious buyers. Formulated per 100ml with a label-disclosed 4% Himalayan Sea Buckthorn extract, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid & 0.1% Niacinamide.",
    "search_keywords": "bhumivera seabuckthorn face wash, bhumivera sea buckthorn face wash, seabuckthorn face wash, sea buckthorn face wash, seabuckthorn face wash India, himalayan sea buckthorn face wash, bhumivera sea buckthorn, best sea buckthorn face wash, facewash with niacinamide, facewash with niacidamine, bhumivera facewash, bhumivera face wash, brightening botanical face wash for glowing skin, omega 7 vitamin c face wash with niacinamide hyaluronic acid, gentle sulfate free face wash for dry dull skin, manjistha turmeric radiance cleanser, conscious skincare face wash India, organic seabuckthorn facial cleanser",
    "conscious_buyer_highlights": [
      "High-Potency 4% Sea Buckthorn: Delivers rare Himalayan Omega-7 (palmitoleic acid), carotenoids, and botanical antioxidants at a full 4.0% label-disclosed concentration.",
      "Dewy Glass-Skin Hydration: 5.0% Botanical Glycerin, 0.1% Hyaluronic Acid, and 0.1% Niacinamide lock in moisture and support ceramide synthesis during cleansing.",
      "Ayurvedic Tone-Evening Complex: 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, and 0.5% Cucumber soothe redness and brighten dull, sun-stressed skin.",
      "Clean & Transparent: Sulfate-free (0% SLS/SLES), paraben-free cosmetic formulation calibrated to pH 5.3–5.5 with 100% label-disclosed active percentages."
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
      },
      {
        "name": "Curcuma longa (Haridra)",
        "url": "https://en.wikipedia.org/wiki/Turmeric"
      },
      {
        "name": "Azadirachta indica (Neem)",
        "url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
      },
      {
        "name": "Glycerol (Botanical Glycerin)",
        "url": "https://en.wikipedia.org/wiki/Glycerol"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Himalayan Sea Buckthorn",
        "inci_name": "Hippophae rhamnoides Fruit & Seed Extract",
        "concentration": "4.0%",
        "botanical": "Hippophae rhamnoides (High-Altitude Super-Berry)",
        "molecular_markers": "Omega-7 (Palmitoleic Acid), Omega-3/6/9, Beta-Carotene, Lycopene, Vitamin C & Tocopherols",
        "extraction_method": "Sub-28°C Cold Cellular Press (26.4°C Verified)",
        "origin_corridor": "REG-01 · Leh-Ladakh & Spiti Valley (3,400m Altitude)",
        "ph_stability_window": "pH 5.2 – 5.6 (Carotenoid & Lipid Preservation Window)",
        "role": "Rich in rare Omega-7 (Palmitoleic acid), Omega 3, 6, 9, and natural Vitamin C carotenoids to replenish barrier lipids, combat photo-oxidative dullness, and enhance cellular radiance.",
        "synergy_partners": "0.1% Niacinamide + 0.5% Manjistha + 5.0% Glycerin",
        "reference_url": "https://en.wikipedia.org/wiki/Hippophae_rhamnoides",
        "related_products": [
          {
            "name": "Grand Maison 4-Piece Daily Apothecary",
            "slug": "activated-charcoal-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Botanical Glycerin",
        "inci_name": "Glycerin (USP Plant-Derived Humectant)",
        "concentration": "5.0%",
        "botanical": "Plant-Derived Humectant Cushion",
        "molecular_markers": "Propane-1,2,3-triol (Hydrophilic Moisture Binder)",
        "extraction_method": "Cold-Filtered Vegetable Lipid Hydrolysis",
        "origin_corridor": "REG-06 · Indian Plant-Oil Fractionation Cleanroom",
        "ph_stability_window": "pH 4.0 – 7.0",
        "role": "Helps retain surface moisture during and after rinsing, preventing transepidermal water loss (TEWL) and leaving a supple, dewy glass-skin finish.",
        "synergy_partners": "0.1% Hyaluronic Acid + 4.0% Sea Buckthorn",
        "reference_url": "https://en.wikipedia.org/wiki/Glycerol",
        "related_products": [
          {
            "name": "Activated Charcoal Luxury Face Wash",
            "slug": "activated-charcoal-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Manjistha Extract",
        "inci_name": "Rubia cordifolia Root Extract",
        "concentration": "0.5%",
        "botanical": "Rubia cordifolia (Ayurvedic Varnya Root)",
        "molecular_markers": "Purpurin, Munjistin & Rubiadin Glycosides",
        "extraction_method": "Sub-28°C Cold Root Maceration",
        "origin_corridor": "REG-05 · Vindhya & Central Indian Forest Belts",
        "ph_stability_window": "pH 5.0 – 6.0",
        "role": "Traditional Ayurvedic botanical that helps visibly improve uneven skin tone, sun-induced tan, and post-blemish marks.",
        "synergy_partners": "4.0% Sea Buckthorn + 0.5% Haridra",
        "reference_url": "https://en.wikipedia.org/wiki/Rubia_cordifolia",
        "related_products": [
          {
            "name": "Activated Charcoal Luxury Face Wash",
            "slug": "activated-charcoal-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Haridra (Wild Turmeric)",
        "inci_name": "Curcuma longa Rhizome Extract",
        "concentration": "0.5%",
        "botanical": "Curcuma longa Antioxidant Rhizome",
        "molecular_markers": "Bioactive Curcuminoids & Turmerones",
        "extraction_method": "Sub-28°C Cold Rhizome Extraction",
        "origin_corridor": "REG-05 · Nilgiri & Eastern India Organic Farms",
        "ph_stability_window": "pH 4.5 – 6.0",
        "role": "Supports natural skin luminosity, calms visible redness, and defends against everyday environmental oxidative stress.",
        "synergy_partners": "4.0% Sea Buckthorn + 0.5% Manjistha",
        "reference_url": "https://en.wikipedia.org/wiki/Turmeric",
        "related_products": [
          {
            "name": "Activated Charcoal Luxury Face Wash",
            "slug": "activated-charcoal-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Neem Extract",
        "inci_name": "Azadirachta indica Leaf Extract",
        "concentration": "0.5%",
        "botanical": "Azadirachta indica Clarifying Leaf",
        "molecular_markers": "Nimbidin, Nimbin & Quercetin Flavonoids",
        "extraction_method": "Sub-28°C Cold Leaf Infusion",
        "origin_corridor": "REG-05 · Central & Eastern India Botanical Cooperatives",
        "ph_stability_window": "pH 5.0 – 6.2",
        "role": "Purifies pores gently and helps maintain a clean, balanced, blemish-free complexion.",
        "synergy_partners": "0.1% Niacinamide + 0.5% Haridra",
        "reference_url": "https://en.wikipedia.org/wiki/Azadirachta_indica",
        "related_products": [
          {
            "name": "Soothing Bar (Aloe, Neem & Tulsi)",
            "slug": "artisanal-aloe-vera-handmade-soap"
          }
        ]
      },
      {
        "ingredient": "Cucumber Extract",
        "inci_name": "Cucumis sativus Fruit Extract",
        "concentration": "0.5%",
        "botanical": "Cucumis sativus Soothing Agent",
        "molecular_markers": "Caffeic Acid, Ascorbic Acid & Amino Acids",
        "extraction_method": "Cold Cellular Press (<25°C)",
        "origin_corridor": "REG-06 · Eastern India Agrarian Clusters",
        "ph_stability_window": "pH 5.1 – 5.8",
        "role": "Soothes heat-stressed skin, reduces morning puffiness, and refreshes tired complexions.",
        "synergy_partners": "5.0% Botanical Glycerin + 0.1% Hyaluronic Acid",
        "reference_url": "https://en.wikipedia.org/wiki/Cucumber",
        "related_products": [
          {
            "name": "Activated Charcoal Luxury Face Wash",
            "slug": "activated-charcoal-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Hyaluronic Acid",
        "inci_name": "Sodium Hyaluronate (Bio-Fermented)",
        "concentration": "0.1%",
        "botanical": "Sodium Hyaluronate Humectant",
        "molecular_markers": "Multi-Molecular Glycosaminoglycan Polysaccharide",
        "extraction_method": "Plant-Glucose Bio-Fermentation",
        "origin_corridor": "Analytical Cleanroom Bio-Fermentation",
        "ph_stability_window": "pH 5.0 – 6.5",
        "role": "Hydrates the outer epidermal layers during washing for an instant smooth, plumped, cushiony appearance.",
        "synergy_partners": "5.0% Botanical Glycerin + 0.1% Niacinamide",
        "reference_url": "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate",
        "related_products": [
          {
            "name": "Activated Charcoal Luxury Face Wash",
            "slug": "activated-charcoal-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Niacinamide (Vitamin B3)",
        "inci_name": "Niacinamide (USP Cosmetic Grade)",
        "concentration": "0.1%",
        "botanical": "Nicotinamide Lipid Barrier Co-Factor",
        "molecular_markers": "Pyridine-3-carboxamide (C6H6N2O · Purity ≥99.5%)",
        "extraction_method": "Analytical Synthesis (Calibrated at pH 5.4 for Zero Flush)",
        "origin_corridor": "USP/EP Certified Analytical Synthesis",
        "ph_stability_window": "pH 5.3 – 6.0",
        "role": "Supports natural barrier ceramides, balances uneven tone, and refines overall pore and skin texture.",
        "synergy_partners": "4.0% Sea Buckthorn + 0.5% Manjistha",
        "reference_url": "https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide",
        "related_products": [
          {
            "name": "Activated Charcoal Luxury Face Wash",
            "slug": "activated-charcoal-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Perfume & Cleanser Base",
        "inci_name": "Aqua, Decyl Glucoside, Coco-Glucoside, Mild Botanical Emulsion",
        "concentration": "0.5% / Q.S.",
        "botanical": "pH-Balanced Sulfate-Free Emulsion",
        "molecular_markers": "Biodegradable Plant-Derived Glucoside Micelles",
        "extraction_method": "Sub-28°C Cleanroom Emulsification",
        "origin_corridor": "REG-06 · GMP Formulation Cleanroom",
        "ph_stability_window": "pH 5.3 – 5.5 Calibrated",
        "role": "Silk-textured, non-stripping botanical cleansing matrix free from SLS/SLES sulfates and parabens.",
        "synergy_partners": "All 8 Disclosed Actives",
        "reference_url": "https://bhumivera.com/science",
        "related_products": []
      }
    ],
    "specifications": {
      "Brand_Name": "Bhumivera (The Transparent Maison · Est. 2016 Lineage)",
      "Product_Full_Name": "Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash",
      "SKU_Code": "BV-LUX-SBFW-02 (Legacy: BV-SBFW-100ML)",
      "MPN_Code": "BVSBFW100ML",
      "GTIN_13_EAN": "8906182600025",
      "GST_HSN_Code": "30049011 (Ayurvedic & Botanical Preparations · 5% GST)",
      "Net_Volume_Metric": "100 ML (3.38 fl. oz.)",
      "Gross_Dispatch_Weight": "214.5 Grams (±0.5g Digital Scale Verified)",
      "Batch_Number": "SFW26H / BATCH-04/26-SB (250 Units per Micro-Batch)",
      "Calibrated_pH_Range": "pH 5.30 – 5.50 at 25.0°C (5.42 pH Digital Electrode Verified)",
      "Extraction_Temperature": "< 28.0°C (26.4°C Cold-Pressed Ladakh Berry Protocol)",
      "Primary_Radiance_Active": "4.0% Himalayan Sea Buckthorn (Hippophae rhamnoides · Omega-7 & Vitamin C)",
      "Primary_Humectant_Cushion": "5.0% Botanical Glycerin + 0.1% Multi-Molecular Hyaluronic Acid",
      "Barrier_Vitamin_CoFactor": "0.1% USP-Grade Niacinamide (Vitamin B3 · Ceramide & Pore Support)",
      "Ayurvedic_Phyto_Complex": "0.5% Manjistha + 0.5% Haridra (Turmeric) + 0.5% Neem + 0.5% Cucumber",
      "Total_Disclosed_Actives": "10.7% Active & Functional Botanical/Humectant Concentration + Q.S. Base",
      "Omega_Fatty_Acid_Profile": "Omega-7 (Palmitoleic Acid), Omega-3, Omega-6 & Omega-9 Bio-Lipids",
      "Surfactant_Architecture": "100% Sulfate-Free (Decyl Glucoside & Coco-Glucoside Gentle Plant Foam)",
      "Free_From_Guarantee": "0% SLS, 0% SLES, 0% Parabens, 0% Mineral Oil, 0% Synthetic Dyes",
      "Target_Skin_Profiles": "Dry, Dull, Normal, Combination, Sensitive & Barrier-Impaired Skin",
      "Primary_Skin_Concerns": "Dullness, Uneven Tone, Post-Sun Tan, Dehydration & Barrier Fatigue",
      "Texture_And_Visual_Profile": "Luminous Golden-Amber Nectar Emulsion with Cushioning Micro-Foam",
      "Aromatic_Profile": "Crisp Himalayan Berry & Subtle Allergen-Screened Botanical Aroma (0.5%)",
      "Recommended_Ritual_Timing": "Twice Daily (AM Antioxidant Radiance Shield & PM Barrier Reset · 30–45s)",
      "Shelf_Life_And_PAO": "24 Months from Manufacturing Date (6 Months Period After Opening)",
      "Primary_Vessel_Material": "UV-Protected Apothecary Dispenser with Gold-Foil Tamper Custody Seal",
      "Microbiological_Purity": "Total Aerobic Microbial Count < 10 CFU/ml (Zero Pathogens)",
      "Heavy_Metals_ICP_MS": "Lead <0.05 ppm · Arsenic <0.02 ppm · Mercury Not Detected (ND)",
      "Harvest_Origin_Lot": "Ladakh Nubra & Spiti Valley Cooperative Lot #LDK-SB-2026 (3,400m+)",
      "Brand_Flagship_Entity": "Bhumivera Organics India Private Limited (Inc. August 4, 2026 · Asansol, WB)",
      "Parent_Heritage_Entity": "MPG E-Business Private Limited (Inc. Sept 22, 2016 · CIN: U74999WB2016PTC217735)",
      "Country_Of_Origin": "Proudly Formulated & Manufactured in India (Bharat)"
    },
    "hero_heading": "Golden Himalayan Botanical Nutrition: 4% Cold-Pressed Sea Buckthorn, 5% Glycerin, Hyaluronic Acid & Niacinamide",
    "intro_paragraphs": [
      "High in the cold desert valleys of Ladakh and Lahaul-Spiti at altitudes between 3,200 and 4,100 meters, the wild Himalayan Sea Buckthorn shrub (Hippophae rhamnoides L.) thrives under sub-zero frost, arid winds, and intense alpine ultraviolet radiation. To protect its cellular DNA against these extreme environmental stressors, the bright orange berry bio-accumulates over 190 bioactive phytonutrients—including rare Omega-7 (palmitoleic acid, a fatty acid naturally present in young human skin lipids), Omega-3, 6, and 9 fatty acids, beta-carotene, lycopene, zeaxanthin, superoxide dismutase (SOD), tocopherols (Vitamin E), and high-potency Vitamin C.",
      "While conventional brightening face washes use less than 0.05% heat-degraded berry extract for label marketing, the Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash is formulated per 100ml with a full, label-disclosed 4.0% concentration of sub-28°C cold-pressed Sea Buckthorn extract, paired with 5.0% Botanical Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract."
    ],
    "science_paragraphs": [
      "Why does sub-28°C cold-pressing matter so profoundly for Sea Buckthorn? Palmitoleic acid (Omega-7), trans-beta-carotene, and L-ascorbic acid are thermally labile molecules; when subjected to standard 85°C industrial steam extraction, their double bonds oxidize rapidly, destroying their antioxidant capacity and turning the extract dull brown. At Bhumivera, post-frost Sea Buckthorn berries harvested from Ladakh cooperative lots are cold-pressed below 28°C (verified at 26.4°C in Batch #SFW26H), preserving the vibrant saffron-amber carotenoid matrix intact.",
      "When you massage this 4.0% Sea Buckthorn emulsion over damp facial skin, its biocompatible Omega-7 lipids cushion the stratum corneum against surfactant disruption, while 5.0% Botanical Glycerin and 0.1% Sodium Hyaluronate bind water molecules directly to the outer corneocytes. Simultaneously, 0.1% USP-grade Niacinamide (calibrated at pH 5.3–5.5 so it never hydrolyzes into flushing nicotinic acid) supports endogenous ceramide synthesis and refines pore appearance."
    ],
    "synergy_paragraphs": [
      "To amplify cellular radiance across Indian skin tones prone to sun-tanning and post-inflammatory hyperpigmentation, our chemists united the 4.0% Himalayan Sea Buckthorn core with 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). Manjistha and Haridra work synergistically with Sea Buckthorn's carotenoids and Niacinamide to visibly brighten dullness and soften the look of dark spots, while Neem and Cucumber keep pores clarified, cool, and calm.",
      "Whether you found Bhumivera by searching for 'bhumivera seabuckthorn face wash', 'sea buckthorn face wash India', or 'facewash with niacinamide and hyaluronic acid', this 10.7% total-active formulation delivers complete milligram and percentage transparency."
    ],
    "ritual_paragraphs": [
      "Designed as your daily AM antioxidant shield and PM radiance reset, this soap-free, 100% sulfate-free cleanser transforms with water into a velvety, lipid-rich lather that lifts sunscreen, sweat, and surface impurities while leaving a luminous, dewy glass-skin finish."
    ],
    "climate_paragraphs": [
      "In dry winters, high-altitude travel, or air-conditioned indoor environments, 4.0% Sea Buckthorn and 5.0% Glycerin prevent dry patches and flaking. In bright summer sun and monsoon humidity, its Vitamin C carotenoids, Manjistha, Haridra, and Niacinamide help defend against photo-dullness and uneven skin tone without feeling heavy or greasy."
    ],
    "provenance_paragraphs": [
      "Every 100ml bottle of Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (Batch #SFW26H · Sample COA Serial: BHMV-2610-SB083) is traceable to Ladakh Nubra Valley Cooperative Lot #LDK-SB-2026 and verified for pH 5.42 calibration, <10 CFU/ml microbial purity, and non-detected mercury/heavy-metal safety."
    ],
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
        "q": "If I am looking for a face wash with Niacinamide and Hyaluronic Acid, is this suitable?",
        "a": "Yes! Bhumivera Himalayan Sea Buckthorn Face Wash combines 0.1% USP Niacinamide and 0.1% Hyaluronic Acid with 5.0% Botanical Glycerin and 4.0% Sea Buckthorn at pH 5.3–5.5—giving you both clinical barrier humectants and cold-pressed Himalayan antioxidant nutrition."
      },
      {
        "q": "Which Bhumivera face wash should I choose: Activated Charcoal or Himalayan Sea Buckthorn?",
        "a": "Choose the 3% Activated Charcoal Face Wash if your primary goals are deep pore detoxification, urban pollution removal, and oil control. Choose the 4% Himalayan Sea Buckthorn Face Wash if you want intensive Omega-7 nourishment, dullness brightening, and dewy radiance—or use Charcoal in the evening and Sea Buckthorn in the morning."
      },
      {
        "q": "Is Bhumivera Himalayan Sea Buckthorn Face Wash sulfate-free and pH-balanced?",
        "a": "Yes. It is 100% free from SLS/SLES sulfates, parabens, and mineral oil, and is calibrated to a skin-identical pH of 5.3 – 5.5."
      },
      {
        "q": "What is Omega-7 in Sea Buckthorn and how does it help facial skin?",
        "a": "Omega-7 (palmitoleic acid) is a rare monounsaturated fatty acid naturally present in human sebum and epidermal lipids. It cushions the skin barrier during cleansing, softens dry or sun-stressed texture, and supports a supple, radiant glow."
      },
      {
        "q": "Can I use Bhumivera Sea Buckthorn Face Wash on sensitive or acne-prone skin?",
        "a": "Yes. Its pH 5.4 calibration, 5% Glycerin cushion, 0.5% Neem, and 0.1% Niacinamide make it gentle on sensitive and blemish-prone skin. As with all concentrated botanical formulas, perform a 24-hour inner-forearm patch test before first use."
      },
      {
        "q": "Where are the Sea Buckthorn berries sourced from?",
        "a": "Our Hippophae rhamnoides berries are sourced from high-altitude valleys in Ladakh and Spiti (above 3,200m) and cold-pressed below 28°C to preserve heat-sensitive carotenoids and Omega-7 lipids."
      },
      {
        "q": "Does this face wash remove sunscreen and light daily makeup?",
        "a": "Yes. Its mild plant-glucoside micelles and 4% Sea Buckthorn lipid complex effectively lift daily sunscreen, surface sebum, and urban dust in a 30–45 second wash without stripping the acid mantle."
      },
      {
        "q": "Where can I verify my bottle's batch COA and authenticity?",
        "a": "Scan the QR code on your box or enter your bottle serial (e.g., BHMV-2610-SB083) at https://bhumivera.com/verify to view the digital pH 5.42 assay and heavy-metal test results."
      }
    ],
    "full_description": "<article class=\"bhumivera-monograph space-y-6\">\n  <h3>Golden Himalayan Botanical Nutrition: 4% Cold-Pressed Sea Buckthorn, 5% Glycerin, Hyaluronic Acid & Niacinamide</h3>\n  <p><strong>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · SKU: BV-LUX-SBFW-02)</strong> is a flagship formulation from <a href=\"https://bhumivera.com\"><strong>Bhumivera — The Transparent Maison</strong></a> (<a href=\"https://bhumivera.com/about\">Bhumivera Organics India Private Limited</a>, incorporated August 4, 2026 under Founder <strong>Akash Prasad</strong> and Directors <strong>Akash Prasad, Payal Prasad &amp; Aman Prasad</strong>), rooted in the 10-year herbal manufacturing and household distribution heritage of <a href=\"https://bhumivera.com/mpgebusiness\"><strong>MPG E-Business Private Limited</strong></a> (established September 22, 2016 in Asansol, West Bengal · CIN: <code>U74999WB2016PTC217735</code> · Founder: <strong>Dilip Prasad Nonia</strong>). Engineered under <em>The Bhumivera Transparency Standard (Est. 2016 lineage)</em>, this formulation prints 100% of its functional active concentrations openly on the physical bottle label: <strong>Sea Buckthorn (4%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)</strong>, calibrated to <strong>pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)</strong>.</p>\n  <p>High in the cold desert valleys of Ladakh and Lahaul-Spiti at altitudes between 3,200 and 4,100 meters, the wild Himalayan Sea Buckthorn shrub (Hippophae rhamnoides L.) thrives under sub-zero frost, arid winds, and intense alpine ultraviolet radiation. To protect its cellular DNA against these extreme environmental stressors, the bright orange berry bio-accumulates over 190 bioactive phytonutrients—including rare Omega-7 (palmitoleic acid, a fatty acid naturally present in young human skin lipids), Omega-3, 6, and 9 fatty acids, beta-carotene, lycopene, zeaxanthin, superoxide dismutase (SOD), tocopherols (Vitamin E), and high-potency Vitamin C.</p><p>While conventional brightening face washes use less than 0.05% heat-degraded berry extract for label marketing, the Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash is formulated per 100ml with a full, label-disclosed 4.0% concentration of sub-28°C cold-pressed Sea Buckthorn extract, paired with 5.0% Botanical Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract.</p>\n\n  <h3>I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters</h3>\n  <p>Why does sub-28°C cold-pressing matter so profoundly for Sea Buckthorn? Palmitoleic acid (Omega-7), trans-beta-carotene, and L-ascorbic acid are thermally labile molecules; when subjected to standard 85°C industrial steam extraction, their double bonds oxidize rapidly, destroying their antioxidant capacity and turning the extract dull brown. At Bhumivera, post-frost Sea Buckthorn berries harvested from Ladakh cooperative lots are cold-pressed below 28°C (verified at 26.4°C in Batch #SFW26H), preserving the vibrant saffron-amber carotenoid matrix intact.</p><p>When you massage this 4.0% Sea Buckthorn emulsion over damp facial skin, its biocompatible Omega-7 lipids cushion the stratum corneum against surfactant disruption, while 5.0% Botanical Glycerin and 0.1% Sodium Hyaluronate bind water molecules directly to the outer corneocytes. Simultaneously, 0.1% USP-grade Niacinamide (calibrated at pH 5.3–5.5 so it never hydrolyzes into flushing nicotinic acid) supports endogenous ceramide synthesis and refines pore appearance.</p>\n  <p>For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque <code>&ldquo;Aqua / Base Q.S.&rdquo;</code> disclosure on the back—where high-value botanicals like <a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Himalayan Sea Buckthorn</a>, <a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Manjistha (Rubia cordifolia)</a>, <a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Haridra (Curcuma longa)</a>, <a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reetha (Sapindus mukorossi)</a>, and <a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Sacred Tulsi (Ocimum tenuiflorum)</a> are dusted in at trace levels below 0.01% and boiled at 80°C–100°C. <a href=\"https://bhumivera.com/science\">Bhumivera’s Sub-28°C Formulation Lab</a> eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Niacinamide Vitamin B3</a>, <a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Multi-Molecular Hyaluronic Acid</a>, and Plant-Derived Glycerin) at full, verifiable label potencies.</p>\n\n  <h4>Complete Active Ingredient &amp; Phytochemical Monograph Table (100 ML)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Disclosed Active &amp; INCI</th>\n          <th>Label Potency</th>\n          <th>Botanical / Chemical Class &amp; Reference</th>\n          <th>Extraction &amp; Harvest Corridor</th>\n          <th>Dermal / Trichological / Cellular Mechanism</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Himalayan Sea Buckthorn</strong><br/><small>Hippophae rhamnoides Fruit & Seed Extract</small></td>\n          <td><strong>4.0%</strong></td>\n          <td>Hippophae rhamnoides (High-Altitude Super-Berry) (<a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Cellular Press (26.4°C Verified) · <a href=\"/provenance-engine\">REG-01 · Leh-Ladakh & Spiti Valley (3,400m Altitude)</a></td>\n          <td>Rich in rare Omega-7 (Palmitoleic acid), Omega 3, 6, 9, and natural Vitamin C carotenoids to replenish barrier lipids, combat photo-oxidative dullness, and enhance cellular radiance.</td>\n        </tr><tr>\n          <td><strong>Botanical Glycerin</strong><br/><small>Glycerin (USP Plant-Derived Humectant)</small></td>\n          <td><strong>5.0%</strong></td>\n          <td>Plant-Derived Humectant Cushion (<a href=\"https://en.wikipedia.org/wiki/Glycerol\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold-Filtered Vegetable Lipid Hydrolysis · <a href=\"/provenance-engine\">REG-06 · Indian Plant-Oil Fractionation Cleanroom</a></td>\n          <td>Helps retain surface moisture during and after rinsing, preventing transepidermal water loss (TEWL) and leaving a supple, dewy glass-skin finish.</td>\n        </tr><tr>\n          <td><strong>Manjistha Extract</strong><br/><small>Rubia cordifolia Root Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Rubia cordifolia (Ayurvedic Varnya Root) (<a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Root Maceration · <a href=\"/provenance-engine\">REG-05 · Vindhya & Central Indian Forest Belts</a></td>\n          <td>Traditional Ayurvedic botanical that helps visibly improve uneven skin tone, sun-induced tan, and post-blemish marks.</td>\n        </tr><tr>\n          <td><strong>Haridra (Wild Turmeric)</strong><br/><small>Curcuma longa Rhizome Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Curcuma longa Antioxidant Rhizome (<a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Rhizome Extraction · <a href=\"/provenance-engine\">REG-05 · Nilgiri & Eastern India Organic Farms</a></td>\n          <td>Supports natural skin luminosity, calms visible redness, and defends against everyday environmental oxidative stress.</td>\n        </tr><tr>\n          <td><strong>Neem Extract</strong><br/><small>Azadirachta indica Leaf Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Azadirachta indica Clarifying Leaf (<a href=\"https://en.wikipedia.org/wiki/Azadirachta_indica\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Leaf Infusion · <a href=\"/provenance-engine\">REG-05 · Central & Eastern India Botanical Cooperatives</a></td>\n          <td>Purifies pores gently and helps maintain a clean, balanced, blemish-free complexion.</td>\n        </tr><tr>\n          <td><strong>Cucumber Extract</strong><br/><small>Cucumis sativus Fruit Extract</small></td>\n          <td><strong>0.5%</strong></td>\n          <td>Cucumis sativus Soothing Agent (<a href=\"https://en.wikipedia.org/wiki/Cucumber\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold Cellular Press (<25°C) · <a href=\"/provenance-engine\">REG-06 · Eastern India Agrarian Clusters</a></td>\n          <td>Soothes heat-stressed skin, reduces morning puffiness, and refreshes tired complexions.</td>\n        </tr><tr>\n          <td><strong>Hyaluronic Acid</strong><br/><small>Sodium Hyaluronate (Bio-Fermented)</small></td>\n          <td><strong>0.1%</strong></td>\n          <td>Sodium Hyaluronate Humectant (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Plant-Glucose Bio-Fermentation · <a href=\"/provenance-engine\">Analytical Cleanroom Bio-Fermentation</a></td>\n          <td>Hydrates the outer epidermal layers during washing for an instant smooth, plumped, cushiony appearance.</td>\n        </tr><tr>\n          <td><strong>Niacinamide (Vitamin B3)</strong><br/><small>Niacinamide (USP Cosmetic Grade)</small></td>\n          <td><strong>0.1%</strong></td>\n          <td>Nicotinamide Lipid Barrier Co-Factor (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Analytical Synthesis (Calibrated at pH 5.4 for Zero Flush) · <a href=\"/provenance-engine\">USP/EP Certified Analytical Synthesis</a></td>\n          <td>Supports natural barrier ceramides, balances uneven tone, and refines overall pore and skin texture.</td>\n        </tr><tr>\n          <td><strong>Perfume & Cleanser Base</strong><br/><small>Aqua, Decyl Glucoside, Coco-Glucoside, Mild Botanical Emulsion</small></td>\n          <td><strong>0.5% / Q.S.</strong></td>\n          <td>pH-Balanced Sulfate-Free Emulsion (<a href=\"https://bhumivera.com/science\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cleanroom Emulsification · <a href=\"/provenance-engine\">REG-06 · GMP Formulation Cleanroom</a></td>\n          <td>Silk-textured, non-stripping botanical cleansing matrix free from SLS/SLES sulfates and parabens.</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3>II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated))</h3>\n  <p>To amplify cellular radiance across Indian skin tones prone to sun-tanning and post-inflammatory hyperpigmentation, our chemists united the 4.0% Himalayan Sea Buckthorn core with 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). Manjistha and Haridra work synergistically with Sea Buckthorn's carotenoids and Niacinamide to visibly brighten dullness and soften the look of dark spots, while Neem and Cucumber keep pores clarified, cool, and calm.</p><p>Whether you found Bhumivera by searching for 'bhumivera seabuckthorn face wash', 'sea buckthorn face wash India', or 'facewash with niacinamide and hyaluronic acid', this 10.7% total-active formulation delivers complete milligram and percentage transparency.</p>\n  <p>Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically <em>beta-glucocerebrosidase</em> and <em>acidic sphingomyelinase</em>—require an acidic microenvironment between <strong>pH 4.7 and 5.75</strong> to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating <strong>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash</strong> to <strong>pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)</strong> and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our <a href=\"/verify\">Bottle Serial &amp; COA Verification Portal</a> and <a href=\"/somatic-registry\">Somatic INCI Label Registry</a>), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it.</p>\n\n  <h3>III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule</h3>\n  <p>Designed as your daily AM antioxidant shield and PM radiance reset, this soap-free, 100% sulfate-free cleanser transforms with water into a velvety, lipid-rich lather that lifts sunscreen, sweat, and surface impurities while leaving a luminous, dewy glass-skin finish.</p>\n  <ul>\n    <li><strong>Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):</strong> Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer.</li>\n    <li><strong>Step 2 — Measured Dispensing &amp; Palmar Emulsification:</strong> Dispense the recommended dose of <strong>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash</strong> into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp.</li>\n    <li><strong>Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:</strong> Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives (<strong>Sea Buckthorn (4%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.)</strong>) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates.</li>\n    <li><strong>Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:</strong> Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary <a href=\"/shop\">Bhumivera Inside-Out Ritual</a> formulations.</li>\n    <li><strong>Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:</strong> Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility (<a href=\"/lab\">read our full Cleanroom &amp; Patch-Test Protocol</a>).</li>\n  </ul>\n\n  <h3>IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter)</h3>\n  <p>In dry winters, high-altitude travel, or air-conditioned indoor environments, 4.0% Sea Buckthorn and 5.0% Glycerin prevent dry patches and flaking. In bright summer sun and monsoon humidity, its Vitamin C carotenoids, Manjistha, Haridra, and Niacinamide help defend against photo-dullness and uneven skin tone without feeling heavy or greasy.</p>\n  <p>Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum. <strong>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash</strong> is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration.</p>\n\n  <h3>V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem</h3>\n  <p>Every formulation in the <a href=\"/shop\">Bhumivera 6-Product Flagship Catalog</a> is engineered to work as part of an interconnected, inside-out botanical system. Explore how <strong>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash</strong> pairs with our companion formulations:</p>\n  <ul>\n    <li><strong>1. <a href=\"/product/activated-charcoal-luxury-face-wash\">Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699)</a>:</strong> Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification.</li>\n    <li><strong>2. <a href=\"/product/himalayan-seabuckthorn-luxury-face-wash\">Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799)</a>:</strong> Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity.</li>\n    <li><strong>3. <a href=\"/product/luxury-2-in-1-botanical-shampoo-conditioner\">Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899)</a>:</strong> Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing.</li>\n    <li><strong>4. <a href=\"/product/artisanal-charcoal-handmade-soap\">Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399)</a>:</strong> Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification.</li>\n    <li><strong>5. <a href=\"/product/artisanal-aloe-vera-handmade-soap\">Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349)</a>:</strong> Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care.</li>\n    <li><strong>6. <a href=\"/product/kalpvriksh-satva-tulsi-7-tulsi-extract\">Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499)</a>:</strong> Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality.</li>\n  </ul>\n  <p>You can also acquire coordinated sets in our <a href=\"/combo/bundle-daily-regimen\">Grand Maison 4-Piece Daily Apothecary Bundle</a>, <a href=\"/combo/bundle-royal-crown-trio\">Royal Skin &amp; Scalp Stewardship Trio</a>, <a href=\"/combo/bundle-inside-out-ritual\">Inside-Out Skin-Clearing &amp; Cortisol Ritual</a>, or the collector’s <a href=\"/combo/bundle-grand-maison-vault\">Grand Maison 6-Piece Apothecary Vault</a>, or compare any two formulations side-by-side on our <a href=\"/compare\">Interactive Formulation Comparison Tool</a>.</p>\n\n  <h3>VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact</h3>\n  <p>Every 100ml bottle of Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (Batch #SFW26H · Sample COA Serial: BHMV-2610-SB083) is traceable to Ladakh Nubra Valley Cooperative Lot #LDK-SB-2026 and verified for pH 5.42 calibration, <10 CFU/ml microbial purity, and non-detected mercury/heavy-metal safety.</p>\n  <p>Every unit of <strong>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash</strong> is traceable through our <a href=\"/provenance-engine\">6-Corridor Indian Botanical Provenance Engine</a> and protected by <a href=\"/purchase-protection\">Bhumivera White-Glove Purchase Protection</a>. To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard (<a href=\"/legal/shipping-hygiene\">Part II of the Bhumivera Legal Suite</a>) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch (<a href=\"/order-tracking\">track live AWB &amp; dispatch weight logs</a>). Furthermore, every order supports our verifiable community initiatives documented on the <a href=\"/impact\">Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact)</a>—including <a href=\"/impact/stray-animal-care\">The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative</a> and <a href=\"/impact/elderly-disabled-rations\">The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative</a> in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors (<a href=\"/impact/damodar-cleanup\">Damodar Riverbank Vetiver Cleanup</a>, <a href=\"/impact/jute-sapling-nursery\">Biodegradable Jute Sapling Nursery</a>, <a href=\"/impact/village-pukur-revival\">Village Pukur Pond Revival</a>, <a href=\"/impact/herbal-kitchen-gardens\">Medicinal Herbal Kitchen Gardens</a>, <a href=\"/impact/mandi-vermicomposting\">Mandi Waste Vermicomposting</a>, and <a href=\"/impact/coal-belt-microgrove\">Coal-Belt Native Micro-Grove</a>).</p>\n\n  <h4>Technical &amp; Regulatory Specification Summary (BV-LUX-SBFW-02)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Specification Parameter</th>\n          <th>Verified Bhumivera Standard</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Brand Name</strong></td>\n          <td>Bhumivera (The Transparent Maison · Est. 2016 Lineage)</td>\n        </tr><tr>\n          <td><strong>Product Full Name</strong></td>\n          <td>Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash</td>\n        </tr><tr>\n          <td><strong>SKU Code</strong></td>\n          <td>BV-LUX-SBFW-02 (Legacy: BV-SBFW-100ML)</td>\n        </tr><tr>\n          <td><strong>MPN Code</strong></td>\n          <td>BVSBFW100ML</td>\n        </tr><tr>\n          <td><strong>GTIN 13 EAN</strong></td>\n          <td>8906182600025</td>\n        </tr><tr>\n          <td><strong>GST HSN Code</strong></td>\n          <td>30049011 (Ayurvedic & Botanical Preparations · 5% GST)</td>\n        </tr><tr>\n          <td><strong>Net Volume Metric</strong></td>\n          <td>100 ML (3.38 fl. oz.)</td>\n        </tr><tr>\n          <td><strong>Gross Dispatch Weight</strong></td>\n          <td>214.5 Grams (±0.5g Digital Scale Verified)</td>\n        </tr><tr>\n          <td><strong>Batch Number</strong></td>\n          <td>SFW26H / BATCH-04/26-SB (250 Units per Micro-Batch)</td>\n        </tr><tr>\n          <td><strong>Calibrated pH Range</strong></td>\n          <td>pH 5.30 – 5.50 at 25.0°C (5.42 pH Digital Electrode Verified)</td>\n        </tr><tr>\n          <td><strong>Extraction Temperature</strong></td>\n          <td>< 28.0°C (26.4°C Cold-Pressed Ladakh Berry Protocol)</td>\n        </tr><tr>\n          <td><strong>Primary Radiance Active</strong></td>\n          <td>4.0% Himalayan Sea Buckthorn (Hippophae rhamnoides · Omega-7 & Vitamin C)</td>\n        </tr><tr>\n          <td><strong>Primary Humectant Cushion</strong></td>\n          <td>5.0% Botanical Glycerin + 0.1% Multi-Molecular Hyaluronic Acid</td>\n        </tr><tr>\n          <td><strong>Barrier Vitamin CoFactor</strong></td>\n          <td>0.1% USP-Grade Niacinamide (Vitamin B3 · Ceramide & Pore Support)</td>\n        </tr><tr>\n          <td><strong>Ayurvedic Phyto Complex</strong></td>\n          <td>0.5% Manjistha + 0.5% Haridra (Turmeric) + 0.5% Neem + 0.5% Cucumber</td>\n        </tr><tr>\n          <td><strong>Total Disclosed Actives</strong></td>\n          <td>10.7% Active & Functional Botanical/Humectant Concentration + Q.S. Base</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</article>",
    "description": "Golden Himalayan Botanical Nutrition: 4% Cold-Pressed Sea Buckthorn, 5% Glycerin, Hyaluronic Acid & Niacinamide \n    Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · SKU: BV-LUX-SBFW-02)  is a flagship formulation from   Bhumivera — The Transparent Maison   ( Bhumivera Organics India Private Limited , incorporated August 4, 2026 under Founder  Akash Prasad  and Directors  Akash Prasad, Payal Prasad &amp; Aman Prasad ), rooted in the 10-year herbal manufacturing and household distribution heritage of   MPG E-Business Private Limited   (established September 22, 2016 in Asansol, West Bengal · CIN:  U74999WB2016PTC217735  · Founder:  Dilip Prasad Nonia ). Engineered under  The Bhumivera Transparency Standard (Est. 2016 lineage) , this formulation prints 100% of its functional active concentrations openly on the physical bottle label:  Sea Buckthorn (4%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.) , calibrated to  pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated) . \n   High in the cold desert valleys of Ladakh and Lahaul-Spiti at altitudes between 3,200 and 4,100 meters, the wild Himalayan Sea Buckthorn shrub (Hippophae rhamnoides L.) thrives under sub-zero frost, arid winds, and intense alpine ultraviolet radiation. To protect its cellular DNA against these extreme environmental stressors, the bright orange berry bio-accumulates over 190 bioactive phytonutrients—including rare Omega-7 (palmitoleic acid, a fatty acid naturally present in young human skin lipids), Omega-3, 6, and 9 fatty acids, beta-carotene, lycopene, zeaxanthin, superoxide dismutase (SOD), tocopherols (Vitamin E), and high-potency Vitamin C.  While conventional brightening face washes use less than 0.05% heat-degraded berry extract for label marketing, the Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash is formulated per 100ml with a full, label-disclosed 4.0% concentration of sub-28°C cold-pressed Sea Buckthorn extract, paired with 5.0% Botanical Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract. \n\n   I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters \n   Why does sub-28°C cold-pressing matter so profoundly for Sea Buckthorn? Palmitoleic acid (Omega-7), trans-beta-carotene, and L-ascorbic acid are thermally labile molecules; when subjected to standard 85°C industrial steam extraction, their double bonds oxidize rapidly, destroying their antioxidant capacity and turning the extract dull brown. At Bhumivera, post-frost Sea Buckthorn berries harvested from Ladakh cooperative lots are cold-pressed below 28°C (verified at 26.4°C in Batch #SFW26H), preserving the vibrant saffron-amber carotenoid matrix intact.  When you massage this 4.0% Sea Buckthorn emulsion over damp facial skin, its biocompatible Omega-7 lipids cushion the stratum corneum against surfactant disruption, while 5.0% Botanical Glycerin and 0.1% Sodium Hyaluronate bind water molecules directly to the outer corneocytes. Simultaneously, 0.1% USP-grade Niacinamide (calibrated at pH 5.3–5.5 so it never hydrolyzes into flushing nicotinic acid) supports endogenous ceramide synthesis and refines pore appearance. \n   For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque  &ldquo;Aqua / Base Q.S.&rdquo;  disclosure on the back—where high-value botanicals like  Himalayan Sea Buckthorn ,  Manjistha (Rubia cordifolia) ,  Haridra (Curcuma longa) ,  Reetha (Sapindus mukorossi) , and  Sacred Tulsi (Ocimum tenuiflorum)  are dusted in at trace levels below 0.01% and boiled at 80°C–100°C.  Bhumivera’s Sub-28°C Formulation Lab  eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants ( Niacinamide Vitamin B3 ,  Multi-Molecular Hyaluronic Acid , and Plant-Derived Glycerin) at full, verifiable label potencies. \n\n   Complete Active Ingredient &amp; Phytochemical Monograph Table (100 ML) \n   \n     \n       \n         \n           Disclosed Active &amp; INCI \n           Label Potency \n           Botanical / Chemical Class &amp; Reference \n           Extraction &amp; Harvest Corridor \n           Dermal / Trichological / Cellular Mechanism \n         \n       \n       \n         \n            Himalayan Sea Buckthorn   Hippophae rhamnoides Fruit & Seed Extract  \n            4.0%  \n           Hippophae rhamnoides (High-Altitude Super-Berry) ( Reference ↗ ) \n           Sub-28°C Cold Cellular Press (26.4°C Verified) ·  REG-01 · Leh-Ladakh & Spiti Valley (3,400m Altitude)  \n           Rich in rare Omega-7 (Palmitoleic acid), Omega 3, 6, 9, and natural Vitamin C carotenoids to replenish barrier lipids, combat photo-oxidative dullness, and enhance cellular radiance. \n          \n            Botanical Glycerin   Glycerin (USP Plant-Derived Humectant)  \n            5.0%  \n           Plant-Derived Humectant Cushion ( Reference ↗ ) \n           Cold-Filtered Vegetable Lipid Hydrolysis ·  REG-06 · Indian Plant-Oil Fractionation Cleanroom  \n           Helps retain surface moisture during and after rinsing, preventing transepidermal water loss (TEWL) and leaving a supple, dewy glass-skin finish. \n          \n            Manjistha Extract   Rubia cordifolia Root Extract  \n            0.5%  \n           Rubia cordifolia (Ayurvedic Varnya Root) ( Reference ↗ ) \n           Sub-28°C Cold Root Maceration ·  REG-05 · Vindhya & Central Indian Forest Belts  \n           Traditional Ayurvedic botanical that helps visibly improve uneven skin tone, sun-induced tan, and post-blemish marks. \n          \n            Haridra (Wild Turmeric)   Curcuma longa Rhizome Extract  \n            0.5%  \n           Curcuma longa Antioxidant Rhizome ( Reference ↗ ) \n           Sub-28°C Cold Rhizome Extraction ·  REG-05 · Nilgiri & Eastern India Organic Farms  \n           Supports natural skin luminosity, calms visible redness, and defends against everyday environmental oxidative stress. \n          \n            Neem Extract   Azadirachta indica Leaf Extract  \n            0.5%  \n           Azadirachta indica Clarifying Leaf ( Reference ↗ ) \n           Sub-28°C Cold Leaf Infusion ·  REG-05 · Central & Eastern India Botanical Cooperatives  \n           Purifies pores gently and helps maintain a clean, balanced, blemish-free complexion. \n          \n            Cucumber Extract   Cucumis sativus Fruit Extract  \n            0.5%  \n           Cucumis sativus Soothing Agent ( Reference ↗ ) \n           Cold Cellular Press ( REG-06 · Eastern India Agrarian Clusters  \n           Soothes heat-stressed skin, reduces morning puffiness, and refreshes tired complexions. \n          \n            Hyaluronic Acid   Sodium Hyaluronate (Bio-Fermented)  \n            0.1%  \n           Sodium Hyaluronate Humectant ( Reference ↗ ) \n           Plant-Glucose Bio-Fermentation ·  Analytical Cleanroom Bio-Fermentation  \n           Hydrates the outer epidermal layers during washing for an instant smooth, plumped, cushiony appearance. \n          \n            Niacinamide (Vitamin B3)   Niacinamide (USP Cosmetic Grade)  \n            0.1%  \n           Nicotinamide Lipid Barrier Co-Factor ( Reference ↗ ) \n           Analytical Synthesis (Calibrated at pH 5.4 for Zero Flush) ·  USP/EP Certified Analytical Synthesis  \n           Supports natural barrier ceramides, balances uneven tone, and refines overall pore and skin texture. \n          \n            Perfume & Cleanser Base   Aqua, Decyl Glucoside, Coco-Glucoside, Mild Botanical Emulsion  \n            0.5% / Q.S.  \n           pH-Balanced Sulfate-Free Emulsion ( Reference ↗ ) \n           Sub-28°C Cleanroom Emulsification ·  REG-06 · GMP Formulation Cleanroom  \n           Silk-textured, non-stripping botanical cleansing matrix free from SLS/SLES sulfates and parabens. \n         \n       \n     \n   \n\n   II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)) \n   To amplify cellular radiance across Indian skin tones prone to sun-tanning and post-inflammatory hyperpigmentation, our chemists united the 4.0% Himalayan Sea Buckthorn core with 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). Manjistha and Haridra work synergistically with Sea Buckthorn's carotenoids and Niacinamide to visibly brighten dullness and soften the look of dark spots, while Neem and Cucumber keep pores clarified, cool, and calm.  Whether you found Bhumivera by searching for 'bhumivera seabuckthorn face wash', 'sea buckthorn face wash India', or 'facewash with niacinamide and hyaluronic acid', this 10.7% total-active formulation delivers complete milligram and percentage transparency. \n   Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically  beta-glucocerebrosidase  and  acidic sphingomyelinase —require an acidic microenvironment between  pH 4.7 and 5.75  to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash  to  pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)  and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our  Bottle Serial &amp; COA Verification Portal  and  Somatic INCI Label Registry ), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it. \n\n   III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule \n   Designed as your daily AM antioxidant shield and PM radiance reset, this soap-free, 100% sulfate-free cleanser transforms with water into a velvety, lipid-rich lather that lifts sunscreen, sweat, and surface impurities while leaving a luminous, dewy glass-skin finish. \n   \n      Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):  Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer. \n      Step 2 — Measured Dispensing &amp; Palmar Emulsification:  Dispense the recommended dose of  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash  into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp. \n      Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:  Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives ( Sea Buckthorn (4%), Glycerin (5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Perfume (0.5%), Base (Q.S.) ) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates. \n      Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:  Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary  Bhumivera Inside-Out Ritual  formulations. \n      Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:  Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility ( read our full Cleanroom &amp; Patch-Test Protocol ). \n   \n\n   IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter) \n   In dry winters, high-altitude travel, or air-conditioned indoor environments, 4.0% Sea Buckthorn and 5.0% Glycerin prevent dry patches and flaking. In bright summer sun and monsoon humidity, its Vitamin C carotenoids, Manjistha, Haridra, and Niacinamide help defend against photo-dullness and uneven skin tone without feeling heavy or greasy. \n   Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash  is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration. \n\n   V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem \n   Every formulation in the  Bhumivera 6-Product Flagship Catalog  is engineered to work as part of an interconnected, inside-out botanical system. Explore how  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash  pairs with our companion formulations: \n   \n      1.  Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699) :  Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification. \n      2.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799) :  Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity. \n      3.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899) :  Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing. \n      4.  Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399) :  Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification. \n      5.  Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349) :  Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care. \n      6.  Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499) :  Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality. \n   \n   You can also acquire coordinated sets in our  Grand Maison 4-Piece Daily Apothecary Bundle ,  Royal Skin &amp; Scalp Stewardship Trio ,  Inside-Out Skin-Clearing &amp; Cortisol Ritual , or the collector’s  Grand Maison 6-Piece Apothecary Vault , or compare any two formulations side-by-side on our  Interactive Formulation Comparison Tool . \n\n   VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact \n   Every 100ml bottle of Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (Batch #SFW26H · Sample COA Serial: BHMV-2610-SB083) is traceable to Ladakh Nubra Valley Cooperative Lot #LDK-SB-2026 and verified for pH 5.42 calibration,  \n   Every unit of  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash  is traceable through our  6-Corridor Indian Botanical Provenance Engine  and protected by  Bhumivera White-Glove Purchase Protection . To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard ( Part II of the Bhumivera Legal Suite ) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch ( track live AWB &amp; dispatch weight logs ). Furthermore, every order supports our verifiable community initiatives documented on the  Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact) —including  The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative  and  The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative  in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors ( Damodar Riverbank Vetiver Cleanup ,  Biodegradable Jute Sapling Nursery ,  Village Pukur Pond Revival ,  Medicinal Herbal Kitchen Gardens ,  Mandi Waste Vermicomposting , and  Coal-Belt Native Micro-Grove ). \n\n   Technical &amp; Regulatory Specification Summary (BV-LUX-SBFW-02) \n   \n     \n       \n         \n           Specification Parameter \n           Verified Bhumivera Standard \n         \n       \n       \n         \n            Brand Name  \n           Bhumivera (The Transparent Maison · Est. 2016 Lineage) \n          \n            Product Full Name  \n           Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash \n          \n            SKU Code  \n           BV-LUX-SBFW-02 (Legacy: BV-SBFW-100ML) \n          \n            MPN Code  \n           BVSBFW100ML \n          \n            GTIN 13 EAN  \n           8906182600025 \n          \n            GST HSN Code  \n           30049011 (Ayurvedic & Botanical Preparations · 5% GST) \n          \n            Net Volume Metric  \n           100 ML (3.38 fl. oz.) \n          \n            Gross Dispatch Weight  \n           214.5 Grams (±0.5g Digital Scale Verified) \n          \n            Batch Number  \n           SFW26H / BATCH-04/26-SB (250 Units per Micro-Batch) \n          \n            Calibrated pH Range  \n           pH 5.30 – 5.50 at 25.0°C (5.42 pH Digital Electrode Verified) \n          \n            Extraction Temperature  \n            \n          \n            Primary Radiance Active  \n           4.0% Himalayan Sea Buckthorn (Hippophae rhamnoides · Omega-7 & Vitamin C) \n          \n            Primary Humectant Cushion  \n           5.0% Botanical Glycerin + 0.1% Multi-Molecular Hyaluronic Acid \n          \n            Barrier Vitamin CoFactor  \n           0.1% USP-Grade Niacinamide (Vitamin B3 · Ceramide & Pore Support) \n          \n            Ayurvedic Phyto Complex  \n           0.5% Manjistha + 0.5% Haridra (Turmeric) + 0.5% Neem + 0.5% Cucumber \n          \n            Total Disclosed Actives  \n           10.7% Active & Functional Botanical/Humectant Concentration + Q.S. Base",
    "editorial_heading": "Golden Himalayan Botanical Nutrition: 4% Cold-Pressed Sea Buckthorn, 5% Glycerin, Hyaluronic Acid & Niacinamide",
    "editorial_paragraphs": [
      "High in the cold desert valleys of Ladakh and Lahaul-Spiti at altitudes between 3,200 and 4,100 meters, the wild Himalayan Sea Buckthorn shrub (Hippophae rhamnoides L.) thrives under sub-zero frost, arid winds, and intense alpine ultraviolet radiation. To protect its cellular DNA against these extreme environmental stressors, the bright orange berry bio-accumulates over 190 bioactive phytonutrients—including rare Omega-7 (palmitoleic acid, a fatty acid naturally present in young human skin lipids), Omega-3, 6, and 9 fatty acids, beta-carotene, lycopene, zeaxanthin, superoxide dismutase (SOD), tocopherols (Vitamin E), and high-potency Vitamin C.",
      "While conventional brightening face washes use less than 0.05% heat-degraded berry extract for label marketing, the Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash is formulated per 100ml with a full, label-disclosed 4.0% concentration of sub-28°C cold-pressed Sea Buckthorn extract, paired with 5.0% Botanical Glycerin, 0.1% Hyaluronic Acid, 0.1% Niacinamide (Vitamin B3), 0.5% Manjistha, 0.5% Haridra (Turmeric), 0.5% Neem, and 0.5% Cooling Cucumber Extract.",
      "Why does sub-28°C cold-pressing matter so profoundly for Sea Buckthorn? Palmitoleic acid (Omega-7), trans-beta-carotene, and L-ascorbic acid are thermally labile molecules; when subjected to standard 85°C industrial steam extraction, their double bonds oxidize rapidly, destroying their antioxidant capacity and turning the extract dull brown. At Bhumivera, post-frost Sea Buckthorn berries harvested from Ladakh cooperative lots are cold-pressed below 28°C (verified at 26.4°C in Batch #SFW26H), preserving the vibrant saffron-amber carotenoid matrix intact.",
      "When you massage this 4.0% Sea Buckthorn emulsion over damp facial skin, its biocompatible Omega-7 lipids cushion the stratum corneum against surfactant disruption, while 5.0% Botanical Glycerin and 0.1% Sodium Hyaluronate bind water molecules directly to the outer corneocytes. Simultaneously, 0.1% USP-grade Niacinamide (calibrated at pH 5.3–5.5 so it never hydrolyzes into flushing nicotinic acid) supports endogenous ceramide synthesis and refines pore appearance.",
      "To amplify cellular radiance across Indian skin tones prone to sun-tanning and post-inflammatory hyperpigmentation, our chemists united the 4.0% Himalayan Sea Buckthorn core with 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cucumber (Cucumis sativus). Manjistha and Haridra work synergistically with Sea Buckthorn's carotenoids and Niacinamide to visibly brighten dullness and soften the look of dark spots, while Neem and Cucumber keep pores clarified, cool, and calm.",
      "Whether you found Bhumivera by searching for 'bhumivera seabuckthorn face wash', 'sea buckthorn face wash India', or 'facewash with niacinamide and hyaluronic acid', this 10.7% total-active formulation delivers complete milligram and percentage transparency."
    ],
    "exactCompositionTable": [
      {
        "active": "Himalayan Sea Buckthorn",
        "ingredient": "Himalayan Sea Buckthorn",
        "potency": "4.0%",
        "concentration": "4.0%",
        "classification": "Hippophae rhamnoides (High-Altitude Super-Berry)",
        "botanical": "Hippophae rhamnoides (High-Altitude Super-Berry)",
        "inci": "",
        "molecular_markers": "Omega-7 (Palmitoleic Acid), Omega-3/6/9, Beta-Carotene, Lycopene, Vitamin C & Tocopherols",
        "extraction_method": "Sub-28°C Cold Cellular Press (26.4°C Verified)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
        "mechanism": "Rich in rare Omega-7 (Palmitoleic acid), Omega 3, 6, 9, and natural Vitamin C carotenoids to replenish barrier lipids, combat photo-oxidative dullness, and enhance cellular radiance.",
        "role": "Rich in rare Omega-7 (Palmitoleic acid), Omega 3, 6, 9, and natural Vitamin C carotenoids to replenish barrier lipids, combat photo-oxidative dullness, and enhance cellular radiance.",
        "synergy_partners": "0.1% Niacinamide + 0.5% Manjistha + 5.0% Glycerin",
        "reference_url": "https://en.wikipedia.org/wiki/Hippophae_rhamnoides"
      },
      {
        "active": "Botanical Glycerin",
        "ingredient": "Botanical Glycerin",
        "potency": "5.0%",
        "concentration": "5.0%",
        "classification": "Plant-Derived Humectant Cushion",
        "botanical": "Plant-Derived Humectant Cushion",
        "inci": "",
        "molecular_markers": "Propane-1,2,3-triol (Hydrophilic Moisture Binder)",
        "extraction_method": "Cold-Filtered Vegetable Lipid Hydrolysis",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
        "mechanism": "Helps retain surface moisture during and after rinsing, preventing transepidermal water loss (TEWL) and leaving a supple, dewy glass-skin finish.",
        "role": "Helps retain surface moisture during and after rinsing, preventing transepidermal water loss (TEWL) and leaving a supple, dewy glass-skin finish.",
        "synergy_partners": "0.1% Hyaluronic Acid + 4.0% Sea Buckthorn",
        "reference_url": "https://en.wikipedia.org/wiki/Glycerol"
      },
      {
        "active": "Manjistha Extract",
        "ingredient": "Manjistha Extract",
        "potency": "0.5%",
        "concentration": "0.5%",
        "classification": "Rubia cordifolia (Ayurvedic Varnya Root)",
        "botanical": "Rubia cordifolia (Ayurvedic Varnya Root)",
        "inci": "",
        "molecular_markers": "Purpurin, Munjistin & Rubiadin Glycosides",
        "extraction_method": "Sub-28°C Cold Root Maceration",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
        "mechanism": "Traditional Ayurvedic botanical that helps visibly improve uneven skin tone, sun-induced tan, and post-blemish marks.",
        "role": "Traditional Ayurvedic botanical that helps visibly improve uneven skin tone, sun-induced tan, and post-blemish marks.",
        "synergy_partners": "4.0% Sea Buckthorn + 0.5% Haridra",
        "reference_url": "https://en.wikipedia.org/wiki/Rubia_cordifolia"
      },
      {
        "active": "Haridra (Wild Turmeric)",
        "ingredient": "Haridra (Wild Turmeric)",
        "potency": "0.5%",
        "concentration": "0.5%",
        "classification": "Curcuma longa Antioxidant Rhizome",
        "botanical": "Curcuma longa Antioxidant Rhizome",
        "inci": "",
        "molecular_markers": "Bioactive Curcuminoids & Turmerones",
        "extraction_method": "Sub-28°C Cold Rhizome Extraction",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
        "mechanism": "Supports natural skin luminosity, calms visible redness, and defends against everyday environmental oxidative stress.",
        "role": "Supports natural skin luminosity, calms visible redness, and defends against everyday environmental oxidative stress.",
        "synergy_partners": "4.0% Sea Buckthorn + 0.5% Manjistha",
        "reference_url": "https://en.wikipedia.org/wiki/Turmeric"
      },
      {
        "active": "Neem Extract",
        "ingredient": "Neem Extract",
        "potency": "0.5%",
        "concentration": "0.5%",
        "classification": "Azadirachta indica Clarifying Leaf",
        "botanical": "Azadirachta indica Clarifying Leaf",
        "inci": "",
        "molecular_markers": "Nimbidin, Nimbin & Quercetin Flavonoids",
        "extraction_method": "Sub-28°C Cold Leaf Infusion",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
        "mechanism": "Purifies pores gently and helps maintain a clean, balanced, blemish-free complexion.",
        "role": "Purifies pores gently and helps maintain a clean, balanced, blemish-free complexion.",
        "synergy_partners": "0.1% Niacinamide + 0.5% Haridra",
        "reference_url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
      },
      {
        "active": "Cucumber Extract",
        "ingredient": "Cucumber Extract",
        "potency": "0.5%",
        "concentration": "0.5%",
        "classification": "Cucumis sativus Soothing Agent",
        "botanical": "Cucumis sativus Soothing Agent",
        "inci": "",
        "molecular_markers": "Caffeic Acid, Ascorbic Acid & Amino Acids",
        "extraction_method": "Cold Cellular Press (<25°C)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
        "mechanism": "Soothes heat-stressed skin, reduces morning puffiness, and refreshes tired complexions.",
        "role": "Soothes heat-stressed skin, reduces morning puffiness, and refreshes tired complexions.",
        "synergy_partners": "5.0% Botanical Glycerin + 0.1% Hyaluronic Acid",
        "reference_url": "https://en.wikipedia.org/wiki/Cucumber"
      },
      {
        "active": "Hyaluronic Acid",
        "ingredient": "Hyaluronic Acid",
        "potency": "0.1%",
        "concentration": "0.1%",
        "classification": "Sodium Hyaluronate Humectant",
        "botanical": "Sodium Hyaluronate Humectant",
        "inci": "",
        "molecular_markers": "Multi-Molecular Glycosaminoglycan Polysaccharide",
        "extraction_method": "Plant-Glucose Bio-Fermentation",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
        "mechanism": "Hydrates the outer epidermal layers during washing for an instant smooth, plumped, cushiony appearance.",
        "role": "Hydrates the outer epidermal layers during washing for an instant smooth, plumped, cushiony appearance.",
        "synergy_partners": "5.0% Botanical Glycerin + 0.1% Niacinamide",
        "reference_url": "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate"
      },
      {
        "active": "Niacinamide (Vitamin B3)",
        "ingredient": "Niacinamide (Vitamin B3)",
        "potency": "0.1%",
        "concentration": "0.1%",
        "classification": "Nicotinamide Lipid Barrier Co-Factor",
        "botanical": "Nicotinamide Lipid Barrier Co-Factor",
        "inci": "",
        "molecular_markers": "Pyridine-3-carboxamide (C6H6N2O · Purity ≥99.5%)",
        "extraction_method": "Analytical Synthesis (Calibrated at pH 5.4 for Zero Flush)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
        "mechanism": "Supports natural barrier ceramides, balances uneven tone, and refines overall pore and skin texture.",
        "role": "Supports natural barrier ceramides, balances uneven tone, and refines overall pore and skin texture.",
        "synergy_partners": "4.0% Sea Buckthorn + 0.5% Manjistha",
        "reference_url": "https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide"
      },
      {
        "active": "Perfume & Cleanser Base",
        "ingredient": "Perfume & Cleanser Base",
        "potency": "0.5% / Q.S.",
        "concentration": "0.5% / Q.S.",
        "classification": "pH-Balanced Sulfate-Free Emulsion",
        "botanical": "pH-Balanced Sulfate-Free Emulsion",
        "inci": "",
        "molecular_markers": "Biodegradable Plant-Derived Glucoside Micelles",
        "extraction_method": "Sub-28°C Cleanroom Emulsification",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.3 – 5.5 (Radiance & Moisture-Barrier Calibrated)",
        "mechanism": "Silk-textured, non-stripping botanical cleansing matrix free from SLS/SLES sulfates and parabens.",
        "role": "Silk-textured, non-stripping botanical cleansing matrix free from SLS/SLES sulfates and parabens.",
        "synergy_partners": "All 8 Disclosed Actives",
        "reference_url": "https://bhumivera.com/science"
      }
    ],
    "directAnswerFaqs": [
      {
        "q": "What is the exact percentage of Sea Buckthorn and active ingredients in Bhumivera Sea Buckthorn Face Wash?",
        "a": "Every 100ml bottle is formulated with a label-disclosed 4% Sea Buckthorn extract, 5% Glycerin, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber Extract, 0.5% Manjistha Extract, 0.1% Hyaluronic Acid, and 0.1% Niacinamide in a gentle cleansing base (Q.S.)."
      },
      {
        "q": "Why is 4% Sea Buckthorn combined with Manjistha, Hyaluronic Acid, and Niacinamide ideal for glowing skin?",
        "a": "Sea Buckthorn supplies rare Omega-7 lipids and natural Vitamin C carotenoids to nourish the skin barrier, Manjistha and Haridra help brighten dull, uneven tone, Niacinamide refines pore appearance, and Hyaluronic Acid + 5% Glycerin flood the skin with moisture."
      },
      {
        "q": "If I am looking for a face wash with Niacinamide and Hyaluronic Acid, is this suitable?",
        "a": "Yes! Bhumivera Himalayan Sea Buckthorn Face Wash combines 0.1% USP Niacinamide and 0.1% Hyaluronic Acid with 5.0% Botanical Glycerin and 4.0% Sea Buckthorn at pH 5.3–5.5—giving you both clinical barrier humectants and cold-pressed Himalayan antioxidant nutrition."
      },
      {
        "q": "Which Bhumivera face wash should I choose: Activated Charcoal or Himalayan Sea Buckthorn?",
        "a": "Choose the 3% Activated Charcoal Face Wash if your primary goals are deep pore detoxification, urban pollution removal, and oil control. Choose the 4% Himalayan Sea Buckthorn Face Wash if you want intensive Omega-7 nourishment, dullness brightening, and dewy radiance—or use Charcoal in the evening and Sea Buckthorn in the morning."
      },
      {
        "q": "Is Bhumivera Himalayan Sea Buckthorn Face Wash sulfate-free and pH-balanced?",
        "a": "Yes. It is 100% free from SLS/SLES sulfates, parabens, and mineral oil, and is calibrated to a skin-identical pH of 5.3 – 5.5."
      },
      {
        "q": "What is Omega-7 in Sea Buckthorn and how does it help facial skin?",
        "a": "Omega-7 (palmitoleic acid) is a rare monounsaturated fatty acid naturally present in human sebum and epidermal lipids. It cushions the skin barrier during cleansing, softens dry or sun-stressed texture, and supports a supple, radiant glow."
      },
      {
        "q": "Can I use Bhumivera Sea Buckthorn Face Wash on sensitive or acne-prone skin?",
        "a": "Yes. Its pH 5.4 calibration, 5% Glycerin cushion, 0.5% Neem, and 0.1% Niacinamide make it gentle on sensitive and blemish-prone skin. As with all concentrated botanical formulas, perform a 24-hour inner-forearm patch test before first use."
      },
      {
        "q": "Where are the Sea Buckthorn berries sourced from?",
        "a": "Our Hippophae rhamnoides berries are sourced from high-altitude valleys in Ladakh and Spiti (above 3,200m) and cold-pressed below 28°C to preserve heat-sensitive carotenoids and Omega-7 lipids."
      },
      {
        "q": "Does this face wash remove sunscreen and light daily makeup?",
        "a": "Yes. Its mild plant-glucoside micelles and 4% Sea Buckthorn lipid complex effectively lift daily sunscreen, surface sebum, and urban dust in a 30–45 second wash without stripping the acid mantle."
      },
      {
        "q": "Where can I verify my bottle's batch COA and authenticity?",
        "a": "Scan the QR code on your box or enter your bottle serial (e.g., BHMV-2610-SB083) at https://bhumivera.com/verify to view the digital pH 5.42 assay and heavy-metal test results."
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
    "rating": 4.69,
    "review_count": 222,
    "reviews": 222,
    "legacySlugs": [
      "bhumivera-amla-bhringraj-botanical-shampoo",
      "bhumivera-2-in-1-shampoo",
      "rosemary-bhringraj-shampoo",
      "reetha-amla-shikakai-shampoo",
      "bhumivera-shampoo",
      "sulfate-free-ayurvedic-shampoo"
    ],
    "sku": "BV-LUX-SH2IN1-03",
    "legacySkus": [
      "BV-ARSH-200ML",
      "BV-LUX-SH2IN1-05"
    ],
    "mpn": "BVSH2IN1LUX",
    "gtin13": "8906182600032",
    "net_volume": "200 ML",
    "price": 899.0,
    "discountPrice": 899.0,
    "mrp": 1199.0,
    "stock": 200,
    "quantity": 200,
    "gst_hsn_code": "30049011",
    "gst_rate": 5.0,
    "cost_price": 85.0,
    "batch_no": "SHS26H",
    "mfg_date": "2026-08-01",
    "manufacturer_name": "Sitashi Herbal Industry",
    "manufacturer_address": "H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022, Rajasthan",
    "manufacturer_gstin": "08AEQFS1102P1ZM",
    "manufacturer_fssai": "12222999000145",
    "category": "Luxury Hair Care",
    "ph_level": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
    "active_ingredients": "Ritta/Reetha (25mg), Amla (20mg), Triphala (10mg), Bringna/Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aleovera/Aloe Vera (10mg), Shikhakai (5mg), Shampoo Base (Q.S.)",
    "image_url": "/images/products/bhumivera-luxury-2-in-1-shampoo-conditioner.webp",
    "image": "/images/products/bhumivera-luxury-2-in-1-shampoo-conditioner.webp",
    "additionalImages": [
      "/assets/images/Promo3.webp",
      "/assets/images/Promo8.webp"
    ],
    "seo_title": "Bhumivera Royal 2-in-1 Luxury Shampoo with Conditioner (200ml) | Reetha (25mg), Amla (20mg), Rosemary Oil, Bhringraj & Aloe Vera Sulfate-Free Hair Cleanser",
    "meta_description": "Shop Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200ml). Formulated with label-verified 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera & 5mg Shikakai.",
    "short_description": "Dual-action Ayurvedic botanical 2-in-1 Shampoo with Conditioner. Formulated with label-disclosed 25mg Ritta (Reetha), 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera & 5mg Shikakai for clean, soft, fuller-looking hair.",
    "search_keywords": "bhumivera 2 in 1 shampoo, bhumivera shampoo, ayurvedic 2 in 1 shampoo with conditioner India, sulfate free reetha amla shikakai bhringraj rosemary shampoo, rosemary oil shampoo for hair growth India, herbal shampoo for hair fall and frizzy hair, natural saponin hair cleanser India, bhumivera.com",
    "conscious_buyer_highlights": [
      "100 mg Standardized 8-Herb Complex: Exact milligram dosages of Reetha (25mg), Amla (20mg), Triphala (10mg), Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aloe Vera (10mg), and Shikakai (5mg) per 100ml.",
      "Natural Plant Saponin Cleansing: Gently lifts scalp oil, sweat, and hard-water residue without harsh SLS/SLES sulfates.",
      "Silicone-Free Built-In Conditioning: Aloe Vera (10mg) and low-pH Shikakai (5mg) smooth and seal the hair cuticle at pH 5.0–5.24 for soft, tangle-free shine.",
      "Root & Follicle Stewardship: Rosemary Essential Oil, Bhringraj, Amla, and Triphala invigorate scalp massage micro-circulation and fortify strands against breakage."
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
      },
      {
        "name": "Azadirachta indica (Neem)",
        "url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
      },
      {
        "name": "Aloe vera",
        "url": "https://en.wikipedia.org/wiki/Aloe_vera"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Ritta (Reetha / Soapnut)",
        "inci_name": "Sapindus mukorossi Pericarp Extract",
        "concentration": "25 mg",
        "botanical": "Sapindus mukorossi (Natural Saponin Pod)",
        "molecular_markers": "Triterpenoid Saponins (Sapindoside A, B, C & Mukorossi Saponins)",
        "extraction_method": "Sub-28°C De-Ionized Aqueous Pericarp Decoction",
        "origin_corridor": "REG-05 · Vindhya & Himachal Saponin Estates",
        "ph_stability_window": "pH 4.8 – 5.5 (Natural Acidic Saponin Window)",
        "role": "Natural plant saponin cleanser that gently emulsifies scalp sebum, dust, and hard-water buildup without stripping natural keratin lipids.",
        "synergy_partners": "5 mg Shikakai + 10 mg Aloe Vera",
        "reference_url": "https://en.wikipedia.org/wiki/Sapindus_mukorossi",
        "related_products": []
      },
      {
        "ingredient": "Amla (Indian Gooseberry)",
        "inci_name": "Phyllanthus emblica Fruit Extract",
        "concentration": "20 mg",
        "botanical": "Phyllanthus emblica (Rasayana Fruit)",
        "molecular_markers": "Emblicanin A & B, Ascorbic Acid, Gallic Acid & Ellagitannins",
        "extraction_method": "Sub-28°C Cold Fruit Maceration",
        "origin_corridor": "REG-05 · Central Indian Forest Cooperatives",
        "ph_stability_window": "pH 4.5 – 5.5",
        "role": "Rich in bio-available Vitamin C and hydrolysable tannins that bind to hair keratin, nourish hair roots, and impart mirror-like glossy shine.",
        "synergy_partners": "10 mg Bhringraj + 10 mg Triphala + 10 mg Rosemary Oil",
        "reference_url": "https://en.wikipedia.org/wiki/Phyllanthus_emblica",
        "related_products": []
      },
      {
        "ingredient": "Triphala Complex",
        "inci_name": "Phyllanthus emblica, Terminalia bellirica & Terminalia chebula Fruit Extract",
        "concentration": "10 mg",
        "botanical": "Amalaki, Bibhitaki & Haritaki Trio",
        "molecular_markers": "Chebulagic Acid, Chebulinic Acid & Gallic Acid Polyphenols",
        "extraction_method": "Sub-28°C Tridoshic Cold Infusion",
        "origin_corridor": "REG-05 · Vindhya Forest Belt",
        "ph_stability_window": "pH 4.8 – 5.5",
        "role": "Traditional three-fruit Ayurvedic blend that clarifies follicular ostia, neutralizes scalp oxidative stress, and supports strong, anchored roots.",
        "synergy_partners": "20 mg Amla + 10 mg Neem",
        "reference_url": "https://en.wikipedia.org/wiki/Triphala",
        "related_products": []
      },
      {
        "ingredient": "Bringna (Bhringraj)",
        "inci_name": "Eclipta prostrata Whole-Plant Extract",
        "concentration": "10 mg",
        "botanical": "Eclipta prostrata (Keshraj — King of Hair)",
        "molecular_markers": "Wedelolactone, Demethylwedelolactone & Ecliptine",
        "extraction_method": "Sub-28°C Whole-Leaf & Stem Extraction",
        "origin_corridor": "REG-05 · Eastern & Central India Riverine Belts",
        "ph_stability_window": "pH 5.0 – 5.8",
        "role": "Revered in Ayurveda as 'Keshraj' (King of Hair) to nourish dermal papilla cells, reduce hair breakage, and support thicker, fuller-looking hair.",
        "synergy_partners": "10 mg Rosemary Oil + 20 mg Amla",
        "reference_url": "https://en.wikipedia.org/wiki/Eclipta_prostrata",
        "related_products": []
      },
      {
        "ingredient": "Rosemary Oil",
        "inci_name": "Rosmarinus officinalis Leaf Essential Oil",
        "concentration": "10 mg",
        "botanical": "Rosmarinus officinalis Essential Oil",
        "molecular_markers": "1,8-Cineole, Carnosic Acid, Rosmarinic Acid & Alpha-Pinene",
        "extraction_method": "Low-Temperature Steam Hydro-Distillation",
        "origin_corridor": "REG-05 · High-Altitude Herbal Estates",
        "ph_stability_window": "pH 5.0 – 6.0",
        "role": "Invigorates scalp massage micro-circulation around the hair bulb and supports healthy, resilient hair strands.",
        "synergy_partners": "10 mg Bhringraj + 20 mg Amla",
        "reference_url": "https://en.wikipedia.org/wiki/Rosemary",
        "related_products": []
      },
      {
        "ingredient": "Neem Extract",
        "inci_name": "Azadirachta indica Leaf Extract",
        "concentration": "10 mg",
        "botanical": "Azadirachta indica Scalp Clarifier",
        "molecular_markers": "Nimbidin, Nimbin & Quercetin",
        "extraction_method": "Sub-28°C Cold Leaf Infusion",
        "origin_corridor": "REG-05 · Central India Botanical Cooperatives",
        "ph_stability_window": "pH 5.0 – 6.0",
        "role": "Purifies the scalp microbiome, helping keep the scalp clean, flake-free, and comfortable.",
        "synergy_partners": "10 mg Triphala + 10 mg Rosemary Oil",
        "reference_url": "https://en.wikipedia.org/wiki/Azadirachta_indica",
        "related_products": [
          {
            "name": "Soothing Bar (Aloe, Neem & Tulsi)",
            "slug": "artisanal-aloe-vera-handmade-soap"
          }
        ]
      },
      {
        "ingredient": "Aleovera (Aloe Vera)",
        "inci_name": "Aloe barbadensis Leaf Juice Fillet",
        "concentration": "10 mg",
        "botanical": "Aloe barbadensis Miller Inner Fillet",
        "molecular_markers": "Acemannan Mucopolysaccharides, Amino Acids & Plant Sterols",
        "extraction_method": "Cold Hand-Filleted Inner Gel (<6h Post-Harvest)",
        "origin_corridor": "REG-04 · Thar Edge Organic Belts, Rajasthan",
        "ph_stability_window": "pH 4.8 – 5.5",
        "role": "Natural moisture-binding conditioner that smooths raised hair cuticles, hydrates the scalp, and tames frizz without heavy silicones.",
        "synergy_partners": "5 mg Shikakai + 25 mg Reetha",
        "reference_url": "https://en.wikipedia.org/wiki/Aloe_vera",
        "related_products": [
          {
            "name": "Charcoal Deep Cleansing Bar",
            "slug": "artisanal-charcoal-handmade-soap"
          },
          {
            "name": "Soothing Bar",
            "slug": "artisanal-aloe-vera-handmade-soap"
          }
        ]
      },
      {
        "ingredient": "Shikhakai",
        "inci_name": "Acacia concinna Fruit Pod Extract",
        "concentration": "5 mg",
        "botanical": "Acacia concinna (Cuticle Detangler)",
        "molecular_markers": "Acacinin A & B Saponins & Lupeol",
        "extraction_method": "Sub-28°C Pod Decoction",
        "origin_corridor": "REG-05 · Western Ghats & Central India",
        "ph_stability_window": "pH 4.5 – 5.3",
        "role": "Low-pH botanical detangler that seals hair cuticles post-wash, leaving lengths silky and manageable without synthetic dimethicone.",
        "synergy_partners": "25 mg Reetha + 10 mg Aloe Vera",
        "reference_url": "https://en.wikipedia.org/wiki/Acacia_concinna",
        "related_products": []
      },
      {
        "ingredient": "Shampoo Base",
        "inci_name": "Aqua & Mild Plant-Glucoside Conditioning Matrix",
        "concentration": "Q.S.",
        "botanical": "Conditioning Cleansing Matrix",
        "molecular_markers": "Sulfate-Free & Silicone-Free Suspension",
        "extraction_method": "Cleanroom Cold Homogenization (27.1°C)",
        "origin_corridor": "REG-06 · GMP Formulation Cleanroom",
        "ph_stability_window": "pH 5.0 – 5.24 Calibrated",
        "role": "Gentle pH-balanced cleansing and conditioning suspension base suitable for all hair and scalp types.",
        "synergy_partners": "All 8 Milligram-Disclosed Botanicals",
        "reference_url": "https://bhumivera.com/guides/science-of-sulfate-free-luxury-herbal-shampoos",
        "related_products": []
      }
    ],
    "specifications": {
      "Brand_Name": "Bhumivera (The Transparent Maison · Est. 2016 Lineage)",
      "Product_Full_Name": "Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner",
      "SKU_Code": "BV-LUX-SH2IN1-03 (Legacy: BV-ARSH-200ML / BV-LUX-SH2IN1-05)",
      "MPN_Code": "BVSH2IN1LUX",
      "GTIN_13_EAN": "8906182600032",
      "GST_HSN_Code": "30049011 (Ayurvedic & Botanical Preparations · 5% GST)",
      "Net_Volume_Metric": "200 ML (6.76 fl. oz.)",
      "Gross_Dispatch_Weight": "342.0 Grams (±0.5g Digital Scale Verified)",
      "Batch_Number": "SHS26H / BATCH-04/26-SH (200–250 Units per Micro-Batch)",
      "Calibrated_pH_Range": "pH 5.00 – 5.24 at 25.0°C (5.18 pH Cuticle-Sealing Calibration)",
      "Extraction_Temperature": "< 28.0°C (27.1°C Sub-Ambient Saponin Infusion)",
      "Standardized_Active_Complex": "100 mg Standardized 8-Herb Ayurvedic Complex per 100 ML",
      "Primary_Saponin_Cleansers": "Ritta/Reetha (25 mg) + Shikhakai (5 mg) Natural Plant Saponins",
      "Follicular_Strength_Actives": "Amla (20 mg) + Bringna/Bhringraj (10 mg) + Rosemary Oil (10 mg) + Triphala (10 mg)",
      "Scalp_And_Cuticle_Care": "Neem Extract (10 mg) Scalp Clarifier + Aloe Vera (10 mg) Cuticle Conditioner",
      "Surfactant_Architecture": "100% Sulfate-Free (Natural Sapindus mukorossi Saponins + Plant Glucosides)",
      "Conditioning_Mechanism": "100% Silicone-Free (Aloe Acemannan + Acidic Shikakai Cuticle Alignment)",
      "Free_From_Guarantee": "0% SLS, 0% SLES, 0% Dimethicone Silicones, 0% Parabens, 0% Mineral Oil",
      "Target_Hair_And_Scalp_Types": "All Scalp Types, Frizz-Prone, Thinning/Breakage-Prone & Hard-Water Exposed Hair",
      "Primary_Trichology_Goals": "Root Fortification, Reduced Breakage, Scalp Clarity & Detangled Shine",
      "Texture_And_Visual_Profile": "Rich Botanical Herbal Emulsion with Soft Saponin Micro-Lather",
      "Aromatic_Profile": "Natural Rosemary Essential Oil & Earthy Amla-Herbal Bouquet",
      "Recommended_Ritual_Timing": "2–4 Times Weekly (Massage into wet scalp for 90–120 seconds before rinsing)",
      "Shelf_Life_And_PAO": "24 Months from Manufacturing Date (6 Months Period After Opening)",
      "Primary_Vessel_Material": "200 ML UV-Protected Apothecary Bottle with Tamper-Evident Gold Seal",
      "Microbiological_Purity": "Total Aerobic Microbial Count < 10 CFU/ml (Passed Cleanroom QC)",
      "Heavy_Metals_ICP_MS": "Lead <0.03 ppm · Arsenic Not Detected (ND) · Mercury Not Detected (ND)",
      "Harvest_Origin_Lot": "Himachal & Central India Saponin Estate Lot #HIM-RP-2026",
      "Brand_Flagship_Entity": "Bhumivera Organics India Private Limited (Inc. August 4, 2026 · Asansol, WB)",
      "Parent_Heritage_Entity": "MPG E-Business Private Limited (Inc. Sept 22, 2016 · CIN: U74999WB2016PTC217735)",
      "Country_Of_Origin": "Proudly Formulated & Manufactured in India (Bharat)"
    },
    "hero_heading": "Precision-Dosed 8-Botanical Ayurvedic Trichology: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, Bhringraj, Triphala, Neem, Aloe Vera & Shikakai",
    "intro_paragraphs": [
      "Healthy, voluminous, resilient hair begins at the scalp microbiome and the overlapping keratin cuticle of the hair shaft. Conventional mass-market shampoos rely on aggressive anionic detergents—Sodium Lauryl Sulfate (SLS) and Sodium Laureth Sulfate (SLES)—that strip the scalp's protective sebum mantle and raise the pH of the hair shaft, causing cuticle scales to swell, snag, and fracture. To disguise this structural damage, conventional 2-in-1 shampoos coat the hair in water-insoluble synthetic silicones (dimethicone andamodimethicone) that suffocate hair follicles and attract dust.",
      "The Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · SKU: BV-LUX-SH2IN1-03) replaces synthetic sulfates and occlusive silicones with a 100% label-disclosed, 100 mg standardized 8-herb Ayurvedic complex per 100ml: Ritta/Reetha (25 mg), Amla (20 mg), Triphala (10 mg), Bringna/Bhringraj (10 mg), Rosemary Essential Oil (10 mg), Neem (10 mg), Aleovera/Aloe Vera (10 mg), and Shikhakai (5 mg), calibrated to a cuticle-sealing pH of 5.0 – 5.24."
    ],
    "science_paragraphs": [
      "Our cleansing engine is led by 25 mg of wild-harvested Ritta/Reetha (Sapindus mukorossi) and 5 mg of Shikhakai (Acacia concinna). Reetha pericarps are naturally rich in triterpenoid saponins (sapindoside A and B)—non-ionic, biodegradable plant surfactants that lower the surface tension of water to lift excess scalp oil, sweat, and hard-water mineral deposits without stripping intracellular keratin lipids. Because Shikakai and Reetha naturally operate at an acidic pH around 5.0, they keep the hair cuticle flat and sealed during washing.",
      "Simultaneously, 10 mg of cold-filleted Aloe Vera (Aloe barbadensis Miller, rich in acemannan mucopolysaccharides) and 20 mg of Amla (Phyllanthus emblica, rich in Vitamin C and gallotannins) act as a weightless, silicone-free built-in conditioner. They bind moisture along the hair cortex and smooth surface friction so wet hair detangles effortlessly with minimal comb breakage."
    ],
    "synergy_paragraphs": [
      "To nourish the scalp and support fuller, stronger-looking hair from the root, Bhumivera pairs 10 mg of pure Rosemary Essential Oil (Rosmarinus officinalis) with 10 mg of Bringna/Bhringraj (Eclipta prostrata), 10 mg of Triphala (Amalaki, Bibhitaki, and Haritaki), and 10 mg of clarifying Neem leaf extract. Rosemary Oil's carnosic and rosmarinic acids invigorate micro-vascular circulation during a 2-minute scalp massage, while Bhringraj's wedelolactone and Triphala's polyphenols fortify the follicular bulb.",
      "Meanwhile, 10 mg of Neem extract keeps the scalp microbiome clean, balanced, and free from seasonal flaking or itchiness—making this 200ml apothecary vessel a complete 2-in-1 scalp and length ritual."
    ],
    "ritual_paragraphs": [
      "Wet hair thoroughly with lukewarm water. Dispense a coin-sized amount of Bhumivera Royal Botanical 2-in-1 Shampoo into your palms, emulsify with water, and massage into the scalp using your fingertips for a full 90 to 120 seconds. Allow the botanical saponin and Aloe lather to glide down the lengths before rinsing thoroughly. No separate synthetic conditioner is required."
    ],
    "climate_paragraphs": [
      "Ideal for Indian hard-water regions, humid monsoon scalps prone to oiliness and dandruff, and dry winter hair prone to static and frizz. Safe for oiled hair (gently emulsifies light pre-wash botanical oils in two washes) and daily or alternate-day cleansing."
    ],
    "provenance_paragraphs": [
      "Every 200ml bottle of Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (Batch #SHS26H · Sample COA Serial: BHMV-2610-SH112) is verified at pH 5.18, <10 CFU/ml microbial purity, and non-detected arsenic/mercury via ICP-MS."
    ],
    "faqs": [
      {
        "q": "What are the exact active ingredients and dosages in Bhumivera 2-in-1 Luxury Shampoo?",
        "a": "Each unit is formulated with 8 label-disclosed botanicals: Ritta/Reetha (25 mg), Amla (20 mg), Triphala (10 mg), Bringna/Bhringraj (10 mg), Rosemary Oil (10 mg), Neem (10 mg), Aloe Vera (10 mg), and Shikhakai (5 mg) in a conditioning shampoo base (Q.S.)."
      },
      {
        "q": "How does Bhumivera 2-in-1 Shampoo help reduce hair breakage and condition strands naturally?",
        "a": "The synergy of 10 mg Rosemary Oil, 10 mg Bhringraj, 20 mg Amla, and 10 mg Triphala nourishes the scalp and strengthens hair fibers, while Aloe Vera (10 mg) and Shikakai (5 mg) smooth and detangle strands without heavy synthetic silicones."
      },
      {
        "q": "Is Bhumivera 2-in-1 Shampoo completely free from SLS/SLES sulfates and silicones?",
        "a": "Yes. It uses natural Reetha (25 mg) and Shikakai (5 mg) plant saponins with mild biodegradable glucosides—0% SLS, 0% SLES, 0% parabens, and 0% dimethicone silicones."
      },
      {
        "q": "Does this shampoo contain Rosemary Oil and Bhringraj for hair vitality?",
        "a": "Yes. Every bottle includes 10 mg of pure Rosemary Essential Oil and 10 mg of Bhringraj alongside 20 mg of Amla and 10 mg of Triphala to invigorate scalp circulation and fortify roots."
      },
      {
        "q": "Why is the pH of 5.0 – 5.24 important for hair and scalp health?",
        "a": "Alkaline shampoos (pH > 7.0) cause hair cuticle scales to lift and tangle, leading to frizz and breakage. Calibrating our shampoo to pH 5.0–5.24 keeps cuticles flat, sealed, and naturally glossy."
      },
      {
        "q": "Can I use Bhumivera 2-in-1 Shampoo to wash off hair oil?",
        "a": "Yes. Massage into wet scalp for 90–120 seconds and rinse; if you have applied a heavy pre-wash oil treatment, a gentle second wash will leave your scalp clean and lengths soft."
      },
      {
        "q": "Does it help with dandruff, scalp itchiness, and hard-water buildup?",
        "a": "Yes. 10 mg of Neem and 10 mg of Triphala clarify the scalp microbiome, while 25 mg of Reetha saponins gently chelate and lift hard-water mineral residue."
      },
      {
        "q": "Do I need a separate conditioner after using this 2-in-1 formula?",
        "a": "For most hair types, no separate conditioner is needed because 10 mg Aloe Vera, 20 mg Amla, and 5 mg low-pH Shikakai naturally detangle and condition hair cuticles during the wash."
      },
      {
        "q": "Is it safe for color-treated or keratin-treated hair?",
        "a": "Yes. Its sulfate-free, pH 5.0–5.24 cuticle-sealing formulation is gentle on color-treated and fragile hair shafts."
      },
      {
        "q": "How can I check the lab COA for my bottle of Bhumivera Shampoo?",
        "a": "Visit https://bhumivera.com/verify and enter your bottle serial (or sample serial BHMV-2610-SH112) to inspect the pH 5.18 and heavy-metal assay report."
      }
    ],
    "full_description": "<article class=\"bhumivera-monograph space-y-6\">\n  <h3>Precision-Dosed 8-Botanical Ayurvedic Trichology: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, Bhringraj, Triphala, Neem, Aloe Vera & Shikakai</h3>\n  <p><strong>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · SKU: BV-LUX-SH2IN1-03)</strong> is a flagship formulation from <a href=\"https://bhumivera.com\"><strong>Bhumivera — The Transparent Maison</strong></a> (<a href=\"https://bhumivera.com/about\">Bhumivera Organics India Private Limited</a>, incorporated August 4, 2026 under Founder <strong>Akash Prasad</strong> and Directors <strong>Akash Prasad, Payal Prasad &amp; Aman Prasad</strong>), rooted in the 10-year herbal manufacturing and household distribution heritage of <a href=\"https://bhumivera.com/mpgebusiness\"><strong>MPG E-Business Private Limited</strong></a> (established September 22, 2016 in Asansol, West Bengal · CIN: <code>U74999WB2016PTC217735</code> · Founder: <strong>Dilip Prasad Nonia</strong>). Engineered under <em>The Bhumivera Transparency Standard (Est. 2016 lineage)</em>, this formulation prints 100% of its functional active concentrations openly on the physical bottle label: <strong>Ritta/Reetha (25mg), Amla (20mg), Triphala (10mg), Bringna/Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aleovera/Aloe Vera (10mg), Shikhakai (5mg), Shampoo Base (Q.S.)</strong>, calibrated to <strong>pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)</strong>.</p>\n  <p>Healthy, voluminous, resilient hair begins at the scalp microbiome and the overlapping keratin cuticle of the hair shaft. Conventional mass-market shampoos rely on aggressive anionic detergents—Sodium Lauryl Sulfate (SLS) and Sodium Laureth Sulfate (SLES)—that strip the scalp's protective sebum mantle and raise the pH of the hair shaft, causing cuticle scales to swell, snag, and fracture. To disguise this structural damage, conventional 2-in-1 shampoos coat the hair in water-insoluble synthetic silicones (dimethicone andamodimethicone) that suffocate hair follicles and attract dust.</p><p>The Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · SKU: BV-LUX-SH2IN1-03) replaces synthetic sulfates and occlusive silicones with a 100% label-disclosed, 100 mg standardized 8-herb Ayurvedic complex per 100ml: Ritta/Reetha (25 mg), Amla (20 mg), Triphala (10 mg), Bringna/Bhringraj (10 mg), Rosemary Essential Oil (10 mg), Neem (10 mg), Aleovera/Aloe Vera (10 mg), and Shikhakai (5 mg), calibrated to a cuticle-sealing pH of 5.0 – 5.24.</p>\n\n  <h3>I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters</h3>\n  <p>Our cleansing engine is led by 25 mg of wild-harvested Ritta/Reetha (Sapindus mukorossi) and 5 mg of Shikhakai (Acacia concinna). Reetha pericarps are naturally rich in triterpenoid saponins (sapindoside A and B)—non-ionic, biodegradable plant surfactants that lower the surface tension of water to lift excess scalp oil, sweat, and hard-water mineral deposits without stripping intracellular keratin lipids. Because Shikakai and Reetha naturally operate at an acidic pH around 5.0, they keep the hair cuticle flat and sealed during washing.</p><p>Simultaneously, 10 mg of cold-filleted Aloe Vera (Aloe barbadensis Miller, rich in acemannan mucopolysaccharides) and 20 mg of Amla (Phyllanthus emblica, rich in Vitamin C and gallotannins) act as a weightless, silicone-free built-in conditioner. They bind moisture along the hair cortex and smooth surface friction so wet hair detangles effortlessly with minimal comb breakage.</p>\n  <p>For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque <code>&ldquo;Aqua / Base Q.S.&rdquo;</code> disclosure on the back—where high-value botanicals like <a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Himalayan Sea Buckthorn</a>, <a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Manjistha (Rubia cordifolia)</a>, <a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Haridra (Curcuma longa)</a>, <a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reetha (Sapindus mukorossi)</a>, and <a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Sacred Tulsi (Ocimum tenuiflorum)</a> are dusted in at trace levels below 0.01% and boiled at 80°C–100°C. <a href=\"https://bhumivera.com/science\">Bhumivera’s Sub-28°C Formulation Lab</a> eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Niacinamide Vitamin B3</a>, <a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Multi-Molecular Hyaluronic Acid</a>, and Plant-Derived Glycerin) at full, verifiable label potencies.</p>\n\n  <h4>Complete Active Ingredient &amp; Phytochemical Monograph Table (200 ML)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Disclosed Active &amp; INCI</th>\n          <th>Label Potency</th>\n          <th>Botanical / Chemical Class &amp; Reference</th>\n          <th>Extraction &amp; Harvest Corridor</th>\n          <th>Dermal / Trichological / Cellular Mechanism</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Ritta (Reetha / Soapnut)</strong><br/><small>Sapindus mukorossi Pericarp Extract</small></td>\n          <td><strong>25 mg</strong></td>\n          <td>Sapindus mukorossi (Natural Saponin Pod) (<a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C De-Ionized Aqueous Pericarp Decoction · <a href=\"/provenance-engine\">REG-05 · Vindhya & Himachal Saponin Estates</a></td>\n          <td>Natural plant saponin cleanser that gently emulsifies scalp sebum, dust, and hard-water buildup without stripping natural keratin lipids.</td>\n        </tr><tr>\n          <td><strong>Amla (Indian Gooseberry)</strong><br/><small>Phyllanthus emblica Fruit Extract</small></td>\n          <td><strong>20 mg</strong></td>\n          <td>Phyllanthus emblica (Rasayana Fruit) (<a href=\"https://en.wikipedia.org/wiki/Phyllanthus_emblica\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Fruit Maceration · <a href=\"/provenance-engine\">REG-05 · Central Indian Forest Cooperatives</a></td>\n          <td>Rich in bio-available Vitamin C and hydrolysable tannins that bind to hair keratin, nourish hair roots, and impart mirror-like glossy shine.</td>\n        </tr><tr>\n          <td><strong>Triphala Complex</strong><br/><small>Phyllanthus emblica, Terminalia bellirica & Terminalia chebula Fruit Extract</small></td>\n          <td><strong>10 mg</strong></td>\n          <td>Amalaki, Bibhitaki & Haritaki Trio (<a href=\"https://en.wikipedia.org/wiki/Triphala\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Tridoshic Cold Infusion · <a href=\"/provenance-engine\">REG-05 · Vindhya Forest Belt</a></td>\n          <td>Traditional three-fruit Ayurvedic blend that clarifies follicular ostia, neutralizes scalp oxidative stress, and supports strong, anchored roots.</td>\n        </tr><tr>\n          <td><strong>Bringna (Bhringraj)</strong><br/><small>Eclipta prostrata Whole-Plant Extract</small></td>\n          <td><strong>10 mg</strong></td>\n          <td>Eclipta prostrata (Keshraj — King of Hair) (<a href=\"https://en.wikipedia.org/wiki/Eclipta_prostrata\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Whole-Leaf & Stem Extraction · <a href=\"/provenance-engine\">REG-05 · Eastern & Central India Riverine Belts</a></td>\n          <td>Revered in Ayurveda as 'Keshraj' (King of Hair) to nourish dermal papilla cells, reduce hair breakage, and support thicker, fuller-looking hair.</td>\n        </tr><tr>\n          <td><strong>Rosemary Oil</strong><br/><small>Rosmarinus officinalis Leaf Essential Oil</small></td>\n          <td><strong>10 mg</strong></td>\n          <td>Rosmarinus officinalis Essential Oil (<a href=\"https://en.wikipedia.org/wiki/Rosemary\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Low-Temperature Steam Hydro-Distillation · <a href=\"/provenance-engine\">REG-05 · High-Altitude Herbal Estates</a></td>\n          <td>Invigorates scalp massage micro-circulation around the hair bulb and supports healthy, resilient hair strands.</td>\n        </tr><tr>\n          <td><strong>Neem Extract</strong><br/><small>Azadirachta indica Leaf Extract</small></td>\n          <td><strong>10 mg</strong></td>\n          <td>Azadirachta indica Scalp Clarifier (<a href=\"https://en.wikipedia.org/wiki/Azadirachta_indica\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Leaf Infusion · <a href=\"/provenance-engine\">REG-05 · Central India Botanical Cooperatives</a></td>\n          <td>Purifies the scalp microbiome, helping keep the scalp clean, flake-free, and comfortable.</td>\n        </tr><tr>\n          <td><strong>Aleovera (Aloe Vera)</strong><br/><small>Aloe barbadensis Leaf Juice Fillet</small></td>\n          <td><strong>10 mg</strong></td>\n          <td>Aloe barbadensis Miller Inner Fillet (<a href=\"https://en.wikipedia.org/wiki/Aloe_vera\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold Hand-Filleted Inner Gel (<6h Post-Harvest) · <a href=\"/provenance-engine\">REG-04 · Thar Edge Organic Belts, Rajasthan</a></td>\n          <td>Natural moisture-binding conditioner that smooths raised hair cuticles, hydrates the scalp, and tames frizz without heavy silicones.</td>\n        </tr><tr>\n          <td><strong>Shikhakai</strong><br/><small>Acacia concinna Fruit Pod Extract</small></td>\n          <td><strong>5 mg</strong></td>\n          <td>Acacia concinna (Cuticle Detangler) (<a href=\"https://en.wikipedia.org/wiki/Acacia_concinna\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Pod Decoction · <a href=\"/provenance-engine\">REG-05 · Western Ghats & Central India</a></td>\n          <td>Low-pH botanical detangler that seals hair cuticles post-wash, leaving lengths silky and manageable without synthetic dimethicone.</td>\n        </tr><tr>\n          <td><strong>Shampoo Base</strong><br/><small>Aqua & Mild Plant-Glucoside Conditioning Matrix</small></td>\n          <td><strong>Q.S.</strong></td>\n          <td>Conditioning Cleansing Matrix (<a href=\"https://bhumivera.com/guides/science-of-sulfate-free-luxury-herbal-shampoos\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cleanroom Cold Homogenization (27.1°C) · <a href=\"/provenance-engine\">REG-06 · GMP Formulation Cleanroom</a></td>\n          <td>Gentle pH-balanced cleansing and conditioning suspension base suitable for all hair and scalp types.</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3>II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration))</h3>\n  <p>To nourish the scalp and support fuller, stronger-looking hair from the root, Bhumivera pairs 10 mg of pure Rosemary Essential Oil (Rosmarinus officinalis) with 10 mg of Bringna/Bhringraj (Eclipta prostrata), 10 mg of Triphala (Amalaki, Bibhitaki, and Haritaki), and 10 mg of clarifying Neem leaf extract. Rosemary Oil's carnosic and rosmarinic acids invigorate micro-vascular circulation during a 2-minute scalp massage, while Bhringraj's wedelolactone and Triphala's polyphenols fortify the follicular bulb.</p><p>Meanwhile, 10 mg of Neem extract keeps the scalp microbiome clean, balanced, and free from seasonal flaking or itchiness—making this 200ml apothecary vessel a complete 2-in-1 scalp and length ritual.</p>\n  <p>Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically <em>beta-glucocerebrosidase</em> and <em>acidic sphingomyelinase</em>—require an acidic microenvironment between <strong>pH 4.7 and 5.75</strong> to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating <strong>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner</strong> to <strong>pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)</strong> and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our <a href=\"/verify\">Bottle Serial &amp; COA Verification Portal</a> and <a href=\"/somatic-registry\">Somatic INCI Label Registry</a>), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it.</p>\n\n  <h3>III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule</h3>\n  <p>Wet hair thoroughly with lukewarm water. Dispense a coin-sized amount of Bhumivera Royal Botanical 2-in-1 Shampoo into your palms, emulsify with water, and massage into the scalp using your fingertips for a full 90 to 120 seconds. Allow the botanical saponin and Aloe lather to glide down the lengths before rinsing thoroughly. No separate synthetic conditioner is required.</p>\n  <ul>\n    <li><strong>Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):</strong> Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer.</li>\n    <li><strong>Step 2 — Measured Dispensing &amp; Palmar Emulsification:</strong> Dispense the recommended dose of <strong>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner</strong> into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp.</li>\n    <li><strong>Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:</strong> Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives (<strong>Ritta/Reetha (25mg), Amla (20mg), Triphala (10mg), Bringna/Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aleovera/Aloe Vera (10mg), Shikhakai (5mg), Shampoo Base (Q.S.)</strong>) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates.</li>\n    <li><strong>Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:</strong> Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary <a href=\"/shop\">Bhumivera Inside-Out Ritual</a> formulations.</li>\n    <li><strong>Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:</strong> Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility (<a href=\"/lab\">read our full Cleanroom &amp; Patch-Test Protocol</a>).</li>\n  </ul>\n\n  <h3>IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter)</h3>\n  <p>Ideal for Indian hard-water regions, humid monsoon scalps prone to oiliness and dandruff, and dry winter hair prone to static and frizz. Safe for oiled hair (gently emulsifies light pre-wash botanical oils in two washes) and daily or alternate-day cleansing.</p>\n  <p>Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum. <strong>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner</strong> is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration.</p>\n\n  <h3>V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem</h3>\n  <p>Every formulation in the <a href=\"/shop\">Bhumivera 6-Product Flagship Catalog</a> is engineered to work as part of an interconnected, inside-out botanical system. Explore how <strong>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner</strong> pairs with our companion formulations:</p>\n  <ul>\n    <li><strong>1. <a href=\"/product/activated-charcoal-luxury-face-wash\">Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699)</a>:</strong> Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification.</li>\n    <li><strong>2. <a href=\"/product/himalayan-seabuckthorn-luxury-face-wash\">Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799)</a>:</strong> Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity.</li>\n    <li><strong>3. <a href=\"/product/luxury-2-in-1-botanical-shampoo-conditioner\">Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899)</a>:</strong> Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing.</li>\n    <li><strong>4. <a href=\"/product/artisanal-charcoal-handmade-soap\">Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399)</a>:</strong> Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification.</li>\n    <li><strong>5. <a href=\"/product/artisanal-aloe-vera-handmade-soap\">Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349)</a>:</strong> Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care.</li>\n    <li><strong>6. <a href=\"/product/kalpvriksh-satva-tulsi-7-tulsi-extract\">Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499)</a>:</strong> Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality.</li>\n  </ul>\n  <p>You can also acquire coordinated sets in our <a href=\"/combo/bundle-daily-regimen\">Grand Maison 4-Piece Daily Apothecary Bundle</a>, <a href=\"/combo/bundle-royal-crown-trio\">Royal Skin &amp; Scalp Stewardship Trio</a>, <a href=\"/combo/bundle-inside-out-ritual\">Inside-Out Skin-Clearing &amp; Cortisol Ritual</a>, or the collector’s <a href=\"/combo/bundle-grand-maison-vault\">Grand Maison 6-Piece Apothecary Vault</a>, or compare any two formulations side-by-side on our <a href=\"/compare\">Interactive Formulation Comparison Tool</a>.</p>\n\n  <h3>VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact</h3>\n  <p>Every 200ml bottle of Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (Batch #SHS26H · Sample COA Serial: BHMV-2610-SH112) is verified at pH 5.18, <10 CFU/ml microbial purity, and non-detected arsenic/mercury via ICP-MS.</p>\n  <p>Every unit of <strong>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner</strong> is traceable through our <a href=\"/provenance-engine\">6-Corridor Indian Botanical Provenance Engine</a> and protected by <a href=\"/purchase-protection\">Bhumivera White-Glove Purchase Protection</a>. To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard (<a href=\"/legal/shipping-hygiene\">Part II of the Bhumivera Legal Suite</a>) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch (<a href=\"/order-tracking\">track live AWB &amp; dispatch weight logs</a>). Furthermore, every order supports our verifiable community initiatives documented on the <a href=\"/impact\">Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact)</a>—including <a href=\"/impact/stray-animal-care\">The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative</a> and <a href=\"/impact/elderly-disabled-rations\">The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative</a> in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors (<a href=\"/impact/damodar-cleanup\">Damodar Riverbank Vetiver Cleanup</a>, <a href=\"/impact/jute-sapling-nursery\">Biodegradable Jute Sapling Nursery</a>, <a href=\"/impact/village-pukur-revival\">Village Pukur Pond Revival</a>, <a href=\"/impact/herbal-kitchen-gardens\">Medicinal Herbal Kitchen Gardens</a>, <a href=\"/impact/mandi-vermicomposting\">Mandi Waste Vermicomposting</a>, and <a href=\"/impact/coal-belt-microgrove\">Coal-Belt Native Micro-Grove</a>).</p>\n\n  <h4>Technical &amp; Regulatory Specification Summary (BV-LUX-SH2IN1-03)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Specification Parameter</th>\n          <th>Verified Bhumivera Standard</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Brand Name</strong></td>\n          <td>Bhumivera (The Transparent Maison · Est. 2016 Lineage)</td>\n        </tr><tr>\n          <td><strong>Product Full Name</strong></td>\n          <td>Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner</td>\n        </tr><tr>\n          <td><strong>SKU Code</strong></td>\n          <td>BV-LUX-SH2IN1-03 (Legacy: BV-ARSH-200ML / BV-LUX-SH2IN1-05)</td>\n        </tr><tr>\n          <td><strong>MPN Code</strong></td>\n          <td>BVSH2IN1LUX</td>\n        </tr><tr>\n          <td><strong>GTIN 13 EAN</strong></td>\n          <td>8906182600032</td>\n        </tr><tr>\n          <td><strong>GST HSN Code</strong></td>\n          <td>30049011 (Ayurvedic & Botanical Preparations · 5% GST)</td>\n        </tr><tr>\n          <td><strong>Net Volume Metric</strong></td>\n          <td>200 ML (6.76 fl. oz.)</td>\n        </tr><tr>\n          <td><strong>Gross Dispatch Weight</strong></td>\n          <td>342.0 Grams (±0.5g Digital Scale Verified)</td>\n        </tr><tr>\n          <td><strong>Batch Number</strong></td>\n          <td>SHS26H / BATCH-04/26-SH (200–250 Units per Micro-Batch)</td>\n        </tr><tr>\n          <td><strong>Calibrated pH Range</strong></td>\n          <td>pH 5.00 – 5.24 at 25.0°C (5.18 pH Cuticle-Sealing Calibration)</td>\n        </tr><tr>\n          <td><strong>Extraction Temperature</strong></td>\n          <td>< 28.0°C (27.1°C Sub-Ambient Saponin Infusion)</td>\n        </tr><tr>\n          <td><strong>Standardized Active Complex</strong></td>\n          <td>100 mg Standardized 8-Herb Ayurvedic Complex per 100 ML</td>\n        </tr><tr>\n          <td><strong>Primary Saponin Cleansers</strong></td>\n          <td>Ritta/Reetha (25 mg) + Shikhakai (5 mg) Natural Plant Saponins</td>\n        </tr><tr>\n          <td><strong>Follicular Strength Actives</strong></td>\n          <td>Amla (20 mg) + Bringna/Bhringraj (10 mg) + Rosemary Oil (10 mg) + Triphala (10 mg)</td>\n        </tr><tr>\n          <td><strong>Scalp And Cuticle Care</strong></td>\n          <td>Neem Extract (10 mg) Scalp Clarifier + Aloe Vera (10 mg) Cuticle Conditioner</td>\n        </tr><tr>\n          <td><strong>Surfactant Architecture</strong></td>\n          <td>100% Sulfate-Free (Natural Sapindus mukorossi Saponins + Plant Glucosides)</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</article>",
    "description": "Precision-Dosed 8-Botanical Ayurvedic Trichology: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, Bhringraj, Triphala, Neem, Aloe Vera & Shikakai \n    Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · SKU: BV-LUX-SH2IN1-03)  is a flagship formulation from   Bhumivera — The Transparent Maison   ( Bhumivera Organics India Private Limited , incorporated August 4, 2026 under Founder  Akash Prasad  and Directors  Akash Prasad, Payal Prasad &amp; Aman Prasad ), rooted in the 10-year herbal manufacturing and household distribution heritage of   MPG E-Business Private Limited   (established September 22, 2016 in Asansol, West Bengal · CIN:  U74999WB2016PTC217735  · Founder:  Dilip Prasad Nonia ). Engineered under  The Bhumivera Transparency Standard (Est. 2016 lineage) , this formulation prints 100% of its functional active concentrations openly on the physical bottle label:  Ritta/Reetha (25mg), Amla (20mg), Triphala (10mg), Bringna/Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aleovera/Aloe Vera (10mg), Shikhakai (5mg), Shampoo Base (Q.S.) , calibrated to  pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration) . \n   Healthy, voluminous, resilient hair begins at the scalp microbiome and the overlapping keratin cuticle of the hair shaft. Conventional mass-market shampoos rely on aggressive anionic detergents—Sodium Lauryl Sulfate (SLS) and Sodium Laureth Sulfate (SLES)—that strip the scalp's protective sebum mantle and raise the pH of the hair shaft, causing cuticle scales to swell, snag, and fracture. To disguise this structural damage, conventional 2-in-1 shampoos coat the hair in water-insoluble synthetic silicones (dimethicone andamodimethicone) that suffocate hair follicles and attract dust.  The Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · SKU: BV-LUX-SH2IN1-03) replaces synthetic sulfates and occlusive silicones with a 100% label-disclosed, 100 mg standardized 8-herb Ayurvedic complex per 100ml: Ritta/Reetha (25 mg), Amla (20 mg), Triphala (10 mg), Bringna/Bhringraj (10 mg), Rosemary Essential Oil (10 mg), Neem (10 mg), Aleovera/Aloe Vera (10 mg), and Shikhakai (5 mg), calibrated to a cuticle-sealing pH of 5.0 – 5.24. \n\n   I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters \n   Our cleansing engine is led by 25 mg of wild-harvested Ritta/Reetha (Sapindus mukorossi) and 5 mg of Shikhakai (Acacia concinna). Reetha pericarps are naturally rich in triterpenoid saponins (sapindoside A and B)—non-ionic, biodegradable plant surfactants that lower the surface tension of water to lift excess scalp oil, sweat, and hard-water mineral deposits without stripping intracellular keratin lipids. Because Shikakai and Reetha naturally operate at an acidic pH around 5.0, they keep the hair cuticle flat and sealed during washing.  Simultaneously, 10 mg of cold-filleted Aloe Vera (Aloe barbadensis Miller, rich in acemannan mucopolysaccharides) and 20 mg of Amla (Phyllanthus emblica, rich in Vitamin C and gallotannins) act as a weightless, silicone-free built-in conditioner. They bind moisture along the hair cortex and smooth surface friction so wet hair detangles effortlessly with minimal comb breakage. \n   For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque  &ldquo;Aqua / Base Q.S.&rdquo;  disclosure on the back—where high-value botanicals like  Himalayan Sea Buckthorn ,  Manjistha (Rubia cordifolia) ,  Haridra (Curcuma longa) ,  Reetha (Sapindus mukorossi) , and  Sacred Tulsi (Ocimum tenuiflorum)  are dusted in at trace levels below 0.01% and boiled at 80°C–100°C.  Bhumivera’s Sub-28°C Formulation Lab  eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants ( Niacinamide Vitamin B3 ,  Multi-Molecular Hyaluronic Acid , and Plant-Derived Glycerin) at full, verifiable label potencies. \n\n   Complete Active Ingredient &amp; Phytochemical Monograph Table (200 ML) \n   \n     \n       \n         \n           Disclosed Active &amp; INCI \n           Label Potency \n           Botanical / Chemical Class &amp; Reference \n           Extraction &amp; Harvest Corridor \n           Dermal / Trichological / Cellular Mechanism \n         \n       \n       \n         \n            Ritta (Reetha / Soapnut)   Sapindus mukorossi Pericarp Extract  \n            25 mg  \n           Sapindus mukorossi (Natural Saponin Pod) ( Reference ↗ ) \n           Sub-28°C De-Ionized Aqueous Pericarp Decoction ·  REG-05 · Vindhya & Himachal Saponin Estates  \n           Natural plant saponin cleanser that gently emulsifies scalp sebum, dust, and hard-water buildup without stripping natural keratin lipids. \n          \n            Amla (Indian Gooseberry)   Phyllanthus emblica Fruit Extract  \n            20 mg  \n           Phyllanthus emblica (Rasayana Fruit) ( Reference ↗ ) \n           Sub-28°C Cold Fruit Maceration ·  REG-05 · Central Indian Forest Cooperatives  \n           Rich in bio-available Vitamin C and hydrolysable tannins that bind to hair keratin, nourish hair roots, and impart mirror-like glossy shine. \n          \n            Triphala Complex   Phyllanthus emblica, Terminalia bellirica & Terminalia chebula Fruit Extract  \n            10 mg  \n           Amalaki, Bibhitaki & Haritaki Trio ( Reference ↗ ) \n           Sub-28°C Tridoshic Cold Infusion ·  REG-05 · Vindhya Forest Belt  \n           Traditional three-fruit Ayurvedic blend that clarifies follicular ostia, neutralizes scalp oxidative stress, and supports strong, anchored roots. \n          \n            Bringna (Bhringraj)   Eclipta prostrata Whole-Plant Extract  \n            10 mg  \n           Eclipta prostrata (Keshraj — King of Hair) ( Reference ↗ ) \n           Sub-28°C Whole-Leaf & Stem Extraction ·  REG-05 · Eastern & Central India Riverine Belts  \n           Revered in Ayurveda as 'Keshraj' (King of Hair) to nourish dermal papilla cells, reduce hair breakage, and support thicker, fuller-looking hair. \n          \n            Rosemary Oil   Rosmarinus officinalis Leaf Essential Oil  \n            10 mg  \n           Rosmarinus officinalis Essential Oil ( Reference ↗ ) \n           Low-Temperature Steam Hydro-Distillation ·  REG-05 · High-Altitude Herbal Estates  \n           Invigorates scalp massage micro-circulation around the hair bulb and supports healthy, resilient hair strands. \n          \n            Neem Extract   Azadirachta indica Leaf Extract  \n            10 mg  \n           Azadirachta indica Scalp Clarifier ( Reference ↗ ) \n           Sub-28°C Cold Leaf Infusion ·  REG-05 · Central India Botanical Cooperatives  \n           Purifies the scalp microbiome, helping keep the scalp clean, flake-free, and comfortable. \n          \n            Aleovera (Aloe Vera)   Aloe barbadensis Leaf Juice Fillet  \n            10 mg  \n           Aloe barbadensis Miller Inner Fillet ( Reference ↗ ) \n           Cold Hand-Filleted Inner Gel ( REG-04 · Thar Edge Organic Belts, Rajasthan  \n           Natural moisture-binding conditioner that smooths raised hair cuticles, hydrates the scalp, and tames frizz without heavy silicones. \n          \n            Shikhakai   Acacia concinna Fruit Pod Extract  \n            5 mg  \n           Acacia concinna (Cuticle Detangler) ( Reference ↗ ) \n           Sub-28°C Pod Decoction ·  REG-05 · Western Ghats & Central India  \n           Low-pH botanical detangler that seals hair cuticles post-wash, leaving lengths silky and manageable without synthetic dimethicone. \n          \n            Shampoo Base   Aqua & Mild Plant-Glucoside Conditioning Matrix  \n            Q.S.  \n           Conditioning Cleansing Matrix ( Reference ↗ ) \n           Cleanroom Cold Homogenization (27.1°C) ·  REG-06 · GMP Formulation Cleanroom  \n           Gentle pH-balanced cleansing and conditioning suspension base suitable for all hair and scalp types. \n         \n       \n     \n   \n\n   II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)) \n   To nourish the scalp and support fuller, stronger-looking hair from the root, Bhumivera pairs 10 mg of pure Rosemary Essential Oil (Rosmarinus officinalis) with 10 mg of Bringna/Bhringraj (Eclipta prostrata), 10 mg of Triphala (Amalaki, Bibhitaki, and Haritaki), and 10 mg of clarifying Neem leaf extract. Rosemary Oil's carnosic and rosmarinic acids invigorate micro-vascular circulation during a 2-minute scalp massage, while Bhringraj's wedelolactone and Triphala's polyphenols fortify the follicular bulb.  Meanwhile, 10 mg of Neem extract keeps the scalp microbiome clean, balanced, and free from seasonal flaking or itchiness—making this 200ml apothecary vessel a complete 2-in-1 scalp and length ritual. \n   Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically  beta-glucocerebrosidase  and  acidic sphingomyelinase —require an acidic microenvironment between  pH 4.7 and 5.75  to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner  to  pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)  and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our  Bottle Serial &amp; COA Verification Portal  and  Somatic INCI Label Registry ), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it. \n\n   III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule \n   Wet hair thoroughly with lukewarm water. Dispense a coin-sized amount of Bhumivera Royal Botanical 2-in-1 Shampoo into your palms, emulsify with water, and massage into the scalp using your fingertips for a full 90 to 120 seconds. Allow the botanical saponin and Aloe lather to glide down the lengths before rinsing thoroughly. No separate synthetic conditioner is required. \n   \n      Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):  Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer. \n      Step 2 — Measured Dispensing &amp; Palmar Emulsification:  Dispense the recommended dose of  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner  into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp. \n      Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:  Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives ( Ritta/Reetha (25mg), Amla (20mg), Triphala (10mg), Bringna/Bhringraj (10mg), Rosemary Oil (10mg), Neem (10mg), Aleovera/Aloe Vera (10mg), Shikhakai (5mg), Shampoo Base (Q.S.) ) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates. \n      Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:  Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary  Bhumivera Inside-Out Ritual  formulations. \n      Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:  Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility ( read our full Cleanroom &amp; Patch-Test Protocol ). \n   \n\n   IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter) \n   Ideal for Indian hard-water regions, humid monsoon scalps prone to oiliness and dandruff, and dry winter hair prone to static and frizz. Safe for oiled hair (gently emulsifies light pre-wash botanical oils in two washes) and daily or alternate-day cleansing. \n   Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner  is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration. \n\n   V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem \n   Every formulation in the  Bhumivera 6-Product Flagship Catalog  is engineered to work as part of an interconnected, inside-out botanical system. Explore how  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner  pairs with our companion formulations: \n   \n      1.  Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699) :  Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification. \n      2.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799) :  Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity. \n      3.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899) :  Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing. \n      4.  Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399) :  Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification. \n      5.  Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349) :  Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care. \n      6.  Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499) :  Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality. \n   \n   You can also acquire coordinated sets in our  Grand Maison 4-Piece Daily Apothecary Bundle ,  Royal Skin &amp; Scalp Stewardship Trio ,  Inside-Out Skin-Clearing &amp; Cortisol Ritual , or the collector’s  Grand Maison 6-Piece Apothecary Vault , or compare any two formulations side-by-side on our  Interactive Formulation Comparison Tool . \n\n   VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact \n   Every 200ml bottle of Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (Batch #SHS26H · Sample COA Serial: BHMV-2610-SH112) is verified at pH 5.18,  \n   Every unit of  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner  is traceable through our  6-Corridor Indian Botanical Provenance Engine  and protected by  Bhumivera White-Glove Purchase Protection . To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard ( Part II of the Bhumivera Legal Suite ) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch ( track live AWB &amp; dispatch weight logs ). Furthermore, every order supports our verifiable community initiatives documented on the  Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact) —including  The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative  and  The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative  in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors ( Damodar Riverbank Vetiver Cleanup ,  Biodegradable Jute Sapling Nursery ,  Village Pukur Pond Revival ,  Medicinal Herbal Kitchen Gardens ,  Mandi Waste Vermicomposting , and  Coal-Belt Native Micro-Grove ). \n\n   Technical &amp; Regulatory Specification Summary (BV-LUX-SH2IN1-03) \n   \n     \n       \n         \n           Specification Parameter \n           Verified Bhumivera Standard \n         \n       \n       \n         \n            Brand Name  \n           Bhumivera (The Transparent Maison · Est. 2016 Lineage) \n          \n            Product Full Name  \n           Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner \n          \n            SKU Code  \n           BV-LUX-SH2IN1-03 (Legacy: BV-ARSH-200ML / BV-LUX-SH2IN1-05) \n          \n            MPN Code  \n           BVSH2IN1LUX \n          \n            GTIN 13 EAN  \n           8906182600032 \n          \n            GST HSN Code  \n           30049011 (Ayurvedic & Botanical Preparations · 5% GST) \n          \n            Net Volume Metric  \n           200 ML (6.76 fl. oz.) \n          \n            Gross Dispatch Weight  \n           342.0 Grams (±0.5g Digital Scale Verified) \n          \n            Batch Number  \n           SHS26H / BATCH-04/26-SH (200–250 Units per Micro-Batch) \n          \n            Calibrated pH Range  \n           pH 5.00 – 5.24 at 25.0°C (5.18 pH Cuticle-Sealing Calibration) \n          \n            Extraction Temperature  \n            \n          \n            Standardized Active Complex  \n           100 mg Standardized 8-Herb Ayurvedic Complex per 100 ML \n          \n            Primary Saponin Cleansers  \n           Ritta/Reetha (25 mg) + Shikhakai (5 mg) Natural Plant Saponins \n          \n            Follicular Strength Actives  \n           Amla (20 mg) + Bringna/Bhringraj (10 mg) + Rosemary Oil (10 mg) + Triphala (10 mg) \n          \n            Scalp And Cuticle Care  \n           Neem Extract (10 mg) Scalp Clarifier + Aloe Vera (10 mg) Cuticle Conditioner \n          \n            Surfactant Architecture  \n           100% Sulfate-Free (Natural Sapindus mukorossi Saponins + Plant Glucosides)",
    "editorial_heading": "Precision-Dosed 8-Botanical Ayurvedic Trichology: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, Bhringraj, Triphala, Neem, Aloe Vera & Shikakai",
    "editorial_paragraphs": [
      "Healthy, voluminous, resilient hair begins at the scalp microbiome and the overlapping keratin cuticle of the hair shaft. Conventional mass-market shampoos rely on aggressive anionic detergents—Sodium Lauryl Sulfate (SLS) and Sodium Laureth Sulfate (SLES)—that strip the scalp's protective sebum mantle and raise the pH of the hair shaft, causing cuticle scales to swell, snag, and fracture. To disguise this structural damage, conventional 2-in-1 shampoos coat the hair in water-insoluble synthetic silicones (dimethicone andamodimethicone) that suffocate hair follicles and attract dust.",
      "The Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · SKU: BV-LUX-SH2IN1-03) replaces synthetic sulfates and occlusive silicones with a 100% label-disclosed, 100 mg standardized 8-herb Ayurvedic complex per 100ml: Ritta/Reetha (25 mg), Amla (20 mg), Triphala (10 mg), Bringna/Bhringraj (10 mg), Rosemary Essential Oil (10 mg), Neem (10 mg), Aleovera/Aloe Vera (10 mg), and Shikhakai (5 mg), calibrated to a cuticle-sealing pH of 5.0 – 5.24.",
      "Our cleansing engine is led by 25 mg of wild-harvested Ritta/Reetha (Sapindus mukorossi) and 5 mg of Shikhakai (Acacia concinna). Reetha pericarps are naturally rich in triterpenoid saponins (sapindoside A and B)—non-ionic, biodegradable plant surfactants that lower the surface tension of water to lift excess scalp oil, sweat, and hard-water mineral deposits without stripping intracellular keratin lipids. Because Shikakai and Reetha naturally operate at an acidic pH around 5.0, they keep the hair cuticle flat and sealed during washing.",
      "Simultaneously, 10 mg of cold-filleted Aloe Vera (Aloe barbadensis Miller, rich in acemannan mucopolysaccharides) and 20 mg of Amla (Phyllanthus emblica, rich in Vitamin C and gallotannins) act as a weightless, silicone-free built-in conditioner. They bind moisture along the hair cortex and smooth surface friction so wet hair detangles effortlessly with minimal comb breakage.",
      "To nourish the scalp and support fuller, stronger-looking hair from the root, Bhumivera pairs 10 mg of pure Rosemary Essential Oil (Rosmarinus officinalis) with 10 mg of Bringna/Bhringraj (Eclipta prostrata), 10 mg of Triphala (Amalaki, Bibhitaki, and Haritaki), and 10 mg of clarifying Neem leaf extract. Rosemary Oil's carnosic and rosmarinic acids invigorate micro-vascular circulation during a 2-minute scalp massage, while Bhringraj's wedelolactone and Triphala's polyphenols fortify the follicular bulb.",
      "Meanwhile, 10 mg of Neem extract keeps the scalp microbiome clean, balanced, and free from seasonal flaking or itchiness—making this 200ml apothecary vessel a complete 2-in-1 scalp and length ritual."
    ],
    "exactCompositionTable": [
      {
        "active": "Ritta (Reetha / Soapnut)",
        "ingredient": "Ritta (Reetha / Soapnut)",
        "potency": "25 mg",
        "concentration": "25 mg",
        "classification": "Sapindus mukorossi (Natural Saponin Pod)",
        "botanical": "Sapindus mukorossi (Natural Saponin Pod)",
        "inci": "",
        "molecular_markers": "Triterpenoid Saponins (Sapindoside A, B, C & Mukorossi Saponins)",
        "extraction_method": "Sub-28°C De-Ionized Aqueous Pericarp Decoction",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
        "mechanism": "Natural plant saponin cleanser that gently emulsifies scalp sebum, dust, and hard-water buildup without stripping natural keratin lipids.",
        "role": "Natural plant saponin cleanser that gently emulsifies scalp sebum, dust, and hard-water buildup without stripping natural keratin lipids.",
        "synergy_partners": "5 mg Shikakai + 10 mg Aloe Vera",
        "reference_url": "https://en.wikipedia.org/wiki/Sapindus_mukorossi"
      },
      {
        "active": "Amla (Indian Gooseberry)",
        "ingredient": "Amla (Indian Gooseberry)",
        "potency": "20 mg",
        "concentration": "20 mg",
        "classification": "Phyllanthus emblica (Rasayana Fruit)",
        "botanical": "Phyllanthus emblica (Rasayana Fruit)",
        "inci": "",
        "molecular_markers": "Emblicanin A & B, Ascorbic Acid, Gallic Acid & Ellagitannins",
        "extraction_method": "Sub-28°C Cold Fruit Maceration",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
        "mechanism": "Rich in bio-available Vitamin C and hydrolysable tannins that bind to hair keratin, nourish hair roots, and impart mirror-like glossy shine.",
        "role": "Rich in bio-available Vitamin C and hydrolysable tannins that bind to hair keratin, nourish hair roots, and impart mirror-like glossy shine.",
        "synergy_partners": "10 mg Bhringraj + 10 mg Triphala + 10 mg Rosemary Oil",
        "reference_url": "https://en.wikipedia.org/wiki/Phyllanthus_emblica"
      },
      {
        "active": "Triphala Complex",
        "ingredient": "Triphala Complex",
        "potency": "10 mg",
        "concentration": "10 mg",
        "classification": "Amalaki, Bibhitaki & Haritaki Trio",
        "botanical": "Amalaki, Bibhitaki & Haritaki Trio",
        "inci": "",
        "molecular_markers": "Chebulagic Acid, Chebulinic Acid & Gallic Acid Polyphenols",
        "extraction_method": "Sub-28°C Tridoshic Cold Infusion",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
        "mechanism": "Traditional three-fruit Ayurvedic blend that clarifies follicular ostia, neutralizes scalp oxidative stress, and supports strong, anchored roots.",
        "role": "Traditional three-fruit Ayurvedic blend that clarifies follicular ostia, neutralizes scalp oxidative stress, and supports strong, anchored roots.",
        "synergy_partners": "20 mg Amla + 10 mg Neem",
        "reference_url": "https://en.wikipedia.org/wiki/Triphala"
      },
      {
        "active": "Bringna (Bhringraj)",
        "ingredient": "Bringna (Bhringraj)",
        "potency": "10 mg",
        "concentration": "10 mg",
        "classification": "Eclipta prostrata (Keshraj — King of Hair)",
        "botanical": "Eclipta prostrata (Keshraj — King of Hair)",
        "inci": "",
        "molecular_markers": "Wedelolactone, Demethylwedelolactone & Ecliptine",
        "extraction_method": "Sub-28°C Whole-Leaf & Stem Extraction",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
        "mechanism": "Revered in Ayurveda as 'Keshraj' (King of Hair) to nourish dermal papilla cells, reduce hair breakage, and support thicker, fuller-looking hair.",
        "role": "Revered in Ayurveda as 'Keshraj' (King of Hair) to nourish dermal papilla cells, reduce hair breakage, and support thicker, fuller-looking hair.",
        "synergy_partners": "10 mg Rosemary Oil + 20 mg Amla",
        "reference_url": "https://en.wikipedia.org/wiki/Eclipta_prostrata"
      },
      {
        "active": "Rosemary Oil",
        "ingredient": "Rosemary Oil",
        "potency": "10 mg",
        "concentration": "10 mg",
        "classification": "Rosmarinus officinalis Essential Oil",
        "botanical": "Rosmarinus officinalis Essential Oil",
        "inci": "",
        "molecular_markers": "1,8-Cineole, Carnosic Acid, Rosmarinic Acid & Alpha-Pinene",
        "extraction_method": "Low-Temperature Steam Hydro-Distillation",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
        "mechanism": "Invigorates scalp massage micro-circulation around the hair bulb and supports healthy, resilient hair strands.",
        "role": "Invigorates scalp massage micro-circulation around the hair bulb and supports healthy, resilient hair strands.",
        "synergy_partners": "10 mg Bhringraj + 20 mg Amla",
        "reference_url": "https://en.wikipedia.org/wiki/Rosemary"
      },
      {
        "active": "Neem Extract",
        "ingredient": "Neem Extract",
        "potency": "10 mg",
        "concentration": "10 mg",
        "classification": "Azadirachta indica Scalp Clarifier",
        "botanical": "Azadirachta indica Scalp Clarifier",
        "inci": "",
        "molecular_markers": "Nimbidin, Nimbin & Quercetin",
        "extraction_method": "Sub-28°C Cold Leaf Infusion",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
        "mechanism": "Purifies the scalp microbiome, helping keep the scalp clean, flake-free, and comfortable.",
        "role": "Purifies the scalp microbiome, helping keep the scalp clean, flake-free, and comfortable.",
        "synergy_partners": "10 mg Triphala + 10 mg Rosemary Oil",
        "reference_url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
      },
      {
        "active": "Aleovera (Aloe Vera)",
        "ingredient": "Aleovera (Aloe Vera)",
        "potency": "10 mg",
        "concentration": "10 mg",
        "classification": "Aloe barbadensis Miller Inner Fillet",
        "botanical": "Aloe barbadensis Miller Inner Fillet",
        "inci": "",
        "molecular_markers": "Acemannan Mucopolysaccharides, Amino Acids & Plant Sterols",
        "extraction_method": "Cold Hand-Filleted Inner Gel (<6h Post-Harvest)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
        "mechanism": "Natural moisture-binding conditioner that smooths raised hair cuticles, hydrates the scalp, and tames frizz without heavy silicones.",
        "role": "Natural moisture-binding conditioner that smooths raised hair cuticles, hydrates the scalp, and tames frizz without heavy silicones.",
        "synergy_partners": "5 mg Shikakai + 25 mg Reetha",
        "reference_url": "https://en.wikipedia.org/wiki/Aloe_vera"
      },
      {
        "active": "Shikhakai",
        "ingredient": "Shikhakai",
        "potency": "5 mg",
        "concentration": "5 mg",
        "classification": "Acacia concinna (Cuticle Detangler)",
        "botanical": "Acacia concinna (Cuticle Detangler)",
        "inci": "",
        "molecular_markers": "Acacinin A & B Saponins & Lupeol",
        "extraction_method": "Sub-28°C Pod Decoction",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
        "mechanism": "Low-pH botanical detangler that seals hair cuticles post-wash, leaving lengths silky and manageable without synthetic dimethicone.",
        "role": "Low-pH botanical detangler that seals hair cuticles post-wash, leaving lengths silky and manageable without synthetic dimethicone.",
        "synergy_partners": "25 mg Reetha + 10 mg Aloe Vera",
        "reference_url": "https://en.wikipedia.org/wiki/Acacia_concinna"
      },
      {
        "active": "Shampoo Base",
        "ingredient": "Shampoo Base",
        "potency": "Q.S.",
        "concentration": "Q.S.",
        "classification": "Conditioning Cleansing Matrix",
        "botanical": "Conditioning Cleansing Matrix",
        "inci": "",
        "molecular_markers": "Sulfate-Free & Silicone-Free Suspension",
        "extraction_method": "Cleanroom Cold Homogenization (27.1°C)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "pH 5.0 – 5.24 (Ayurvedic Saponin & Aloe Cuticle-Smoothing Calibration)",
        "mechanism": "Gentle pH-balanced cleansing and conditioning suspension base suitable for all hair and scalp types.",
        "role": "Gentle pH-balanced cleansing and conditioning suspension base suitable for all hair and scalp types.",
        "synergy_partners": "All 8 Milligram-Disclosed Botanicals",
        "reference_url": "https://bhumivera.com/guides/science-of-sulfate-free-luxury-herbal-shampoos"
      }
    ],
    "directAnswerFaqs": [
      {
        "q": "What are the exact active ingredients and dosages in Bhumivera 2-in-1 Luxury Shampoo?",
        "a": "Each unit is formulated with 8 label-disclosed botanicals: Ritta/Reetha (25 mg), Amla (20 mg), Triphala (10 mg), Bringna/Bhringraj (10 mg), Rosemary Oil (10 mg), Neem (10 mg), Aloe Vera (10 mg), and Shikhakai (5 mg) in a conditioning shampoo base (Q.S.)."
      },
      {
        "q": "How does Bhumivera 2-in-1 Shampoo help reduce hair breakage and condition strands naturally?",
        "a": "The synergy of 10 mg Rosemary Oil, 10 mg Bhringraj, 20 mg Amla, and 10 mg Triphala nourishes the scalp and strengthens hair fibers, while Aloe Vera (10 mg) and Shikakai (5 mg) smooth and detangle strands without heavy synthetic silicones."
      },
      {
        "q": "Is Bhumivera 2-in-1 Shampoo completely free from SLS/SLES sulfates and silicones?",
        "a": "Yes. It uses natural Reetha (25 mg) and Shikakai (5 mg) plant saponins with mild biodegradable glucosides—0% SLS, 0% SLES, 0% parabens, and 0% dimethicone silicones."
      },
      {
        "q": "Does this shampoo contain Rosemary Oil and Bhringraj for hair vitality?",
        "a": "Yes. Every bottle includes 10 mg of pure Rosemary Essential Oil and 10 mg of Bhringraj alongside 20 mg of Amla and 10 mg of Triphala to invigorate scalp circulation and fortify roots."
      },
      {
        "q": "Why is the pH of 5.0 – 5.24 important for hair and scalp health?",
        "a": "Alkaline shampoos (pH > 7.0) cause hair cuticle scales to lift and tangle, leading to frizz and breakage. Calibrating our shampoo to pH 5.0–5.24 keeps cuticles flat, sealed, and naturally glossy."
      },
      {
        "q": "Can I use Bhumivera 2-in-1 Shampoo to wash off hair oil?",
        "a": "Yes. Massage into wet scalp for 90–120 seconds and rinse; if you have applied a heavy pre-wash oil treatment, a gentle second wash will leave your scalp clean and lengths soft."
      },
      {
        "q": "Does it help with dandruff, scalp itchiness, and hard-water buildup?",
        "a": "Yes. 10 mg of Neem and 10 mg of Triphala clarify the scalp microbiome, while 25 mg of Reetha saponins gently chelate and lift hard-water mineral residue."
      },
      {
        "q": "Do I need a separate conditioner after using this 2-in-1 formula?",
        "a": "For most hair types, no separate conditioner is needed because 10 mg Aloe Vera, 20 mg Amla, and 5 mg low-pH Shikakai naturally detangle and condition hair cuticles during the wash."
      },
      {
        "q": "Is it safe for color-treated or keratin-treated hair?",
        "a": "Yes. Its sulfate-free, pH 5.0–5.24 cuticle-sealing formulation is gentle on color-treated and fragile hair shafts."
      },
      {
        "q": "How can I check the lab COA for my bottle of Bhumivera Shampoo?",
        "a": "Visit https://bhumivera.com/verify and enter your bottle serial (or sample serial BHMV-2610-SH112) to inspect the pH 5.18 and heavy-metal assay report."
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
    "rating": 4.76,
    "review_count": 219,
    "reviews": 219,
    "legacySlugs": [
      "bhumivera-kumkumadi-night-elixir",
      "bhumivera-charcoal-soap",
      "charcoal-deep-cleansing-bar",
      "charcoal-aloe-vera-handmade-soap",
      "handmade-charcoal-soap"
    ],
    "sku": "BV-LUX-CSOAP-04",
    "legacySkus": [
      "BV-KMNE-30ML"
    ],
    "mpn": "BVCSOAP100GM",
    "gtin13": "8906182600049",
    "net_volume": "100 GM",
    "price": 399.0,
    "discountPrice": 399.0,
    "mrp": 499.0,
    "stock": 300,
    "quantity": 300,
    "gst_hsn_code": "30049011",
    "gst_rate": 5.0,
    "cost_price": 24.0,
    "batch_no": "SACHS26I",
    "mfg_date": "2026-09-01",
    "manufacturer_name": "Sitashi Herbal Industry",
    "manufacturer_address": "H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022, Rajasthan",
    "manufacturer_gstin": "08AEQFS1102P1ZM",
    "manufacturer_fssai": "12222999000145",
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
    "search_keywords": "bhumivera charcoal soap, bhumivera charcoal deep cleansing bar, handmade charcoal soap India, ayurvedic activated charcoal aloe vera bathing bar, natural handmade soap for oily skin and body care, chemical free base charcoal soap, bhumivera.com",
    "conscious_buyer_highlights": [
      "Deep-Pore Carbon Purification: Microporous Activated Charcoal lifts excess body oil, back/shoulder sweat congestion, and urban grime.",
      "Soothing Aloe Vera Cushion: Pure Aloe Vera (Aloe barbadensis) inner-leaf extract keeps lather creamy and prevents post-bath skin dryness.",
      "Gentle Ayurvedic Soap Base: Hand-poured in small artisanal batches without harsh synthetic detergents; gentle enough for daily face and body cleansing (24-hour patch test advised).",
      "Long-Lasting 100 GM Solid Bar: Zero plastic bottle waste, ideal for travel and daily luxury bathing."
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
      },
      {
        "name": "Glycerol (Natural Humectant)",
        "url": "https://en.wikipedia.org/wiki/Glycerol"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Activated Charcoal",
        "inci_name": "Carbon Black / Steam-Activated Bamboo Charcoal (<15 μm)",
        "concentration": "Deep Cleansing Core",
        "botanical": "Microporous Activated Carbon",
        "molecular_markers": "High-Surface-Area Microporous Carbon Lattice (>900 m²/g)",
        "extraction_method": "850°C Steam Activation & Fine Sieve Milling",
        "origin_corridor": "REG-03 · Assam & North-East Sustainable Bamboo Groves",
        "ph_stability_window": "Stable Across Solid Bar Matrix",
        "role": "Draws out deep-seated pore impurities, excess body sebum, sweat residue, and environmental pollutants from face, neck, back, and shoulders.",
        "synergy_partners": "Aloevera Extract + Gentle Ayurvedic Soap Base",
        "reference_url": "https://en.wikipedia.org/wiki/Activated_carbon",
        "related_products": [
          {
            "name": "Activated Charcoal Luxury Face Wash",
            "slug": "activated-charcoal-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Aloevera Extract",
        "inci_name": "Aloe barbadensis Miller Inner-Leaf Fillet Gel",
        "concentration": "Soothing Hydration Matrix",
        "botanical": "Aloe barbadensis miller",
        "molecular_markers": "Acemannan Polysaccharides, Glucomannans, Amino Acids & Sterols",
        "extraction_method": "Cold Hand-Filleted Mucilage (<28°C)",
        "origin_corridor": "REG-04 · Thar Edge Organic Belts, Rajasthan",
        "ph_stability_window": "Soothing Moisture Cushion",
        "role": "Replenishes skin moisture during bathing, calms heat and dryness, and creates a rich, velvety, non-stripping lather.",
        "synergy_partners": "Microporous Activated Charcoal",
        "reference_url": "https://en.wikipedia.org/wiki/Aloe_vera",
        "related_products": [
          {
            "name": "Soothing Bar (Aloe, Neem & Tulsi)",
            "slug": "artisanal-aloe-vera-handmade-soap"
          }
        ]
      },
      {
        "ingredient": "Ayurvedic Soap Base",
        "inci_name": "Artisanal Vegetable-Oil & Glycerin Saponified Base",
        "concentration": "Q.S. (100 GM Bar)",
        "botanical": "Gentle Artisanal Soap Base",
        "molecular_markers": "Retained Natural Plant Glycerin & Mild Fatty Acid Salts",
        "extraction_method": "Small-Batch Cold-Molded Artisanal Curing",
        "origin_corridor": "REG-06 · GMP Artisanal Soap Atelier",
        "ph_stability_window": "Skin-Friendly Mild Cleansing Matrix",
        "role": "Prepared in quality-controlled batches without harsh synthetic detergents, SLS, parabens, or animal tallow for everyday face and body cleansing.",
        "synergy_partners": "Activated Charcoal + Aloe Vera",
        "reference_url": "https://en.wikipedia.org/wiki/Ayurveda",
        "related_products": [
          {
            "name": "Soothing Bar (Aloe, Neem & Tulsi)",
            "slug": "artisanal-aloe-vera-handmade-soap"
          }
        ]
      }
    ],
    "specifications": {
      "Brand_Name": "Bhumivera (The Transparent Maison · Est. 2016 Lineage)",
      "Product_Full_Name": "Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)",
      "SKU_Code": "BV-LUX-CSOAP-04",
      "MPN_Code": "BVCSOAP100GM",
      "GTIN_13_EAN": "8906182600049",
      "GST_HSN_Code": "30049011 (Ayurvedic & Botanical Preparations · 5% GST)",
      "Net_Weight_Metric": "100 GM (3.52 oz. Solid Artisanal Bar)",
      "Gross_Dispatch_Weight": "135.0 Grams (±0.5g Digital Scale Verified)",
      "Batch_Number": "SACHS26I (Handcrafted Quality-Controlled Batch)",
      "Manufacturing_Date": "2026-09-01 (24-Month Shelf Life)",
      "Formulation_Standard": "Skin-Friendly Handmade Ayurvedic Bar (Free from Harsh Synthetic Detergents)",
      "Primary_Purifying_Active": "Steam-Activated Microporous Bamboo Charcoal (<15 Microns)",
      "Primary_Soothing_Active": "Pure Aloe Vera (Aloe barbadensis Miller) Inner-Leaf Fillet Extract",
      "Cleansing_Base_Type": "100% Vegetarian Ayurvedic Soap Base with Retained Natural Glycerin",
      "Free_From_Guarantee": "0% SLS/SLES, 0% Parabens, 0% Animal Fat/Tallow, 0% Synthetic Microbeads",
      "Target_Skin_Profiles": "Oily, Combination, Sweat-Prone, Normal & Delicate Skin (Face & Body)",
      "Primary_Bathing_Goals": "Full-Body Pore Detox, Back/Shoulder Clarity, Sweat Removal & Soft Skin",
      "Texture_And_Lather_Profile": "Smooth Obsidian Bar Producing a Creamy, Non-Drying Cushion Lather",
      "Application_Zones": "Daily Full-Body Bathing, Neck, Underarms, Back & Facial Cleansing",
      "Recommended_Ritual_Timing": "Daily Morning & Evening Bathing (Massage lather for 30–45 seconds)",
      "Storage_Instructions": "Keep on a well-drained soap dish between uses in a cool, dry place",
      "Patch_Test_Standard": "24-Hour Inner-Forearm Patch Test Recommended Prior to Initial Use",
      "Brand_Flagship_Entity": "Bhumivera Organics India Private Limited (Inc. August 4, 2026 · Asansol, WB)",
      "Parent_Heritage_Entity": "MPG E-Business Private Limited (Inc. Sept 22, 2016 · CIN: U74999WB2016PTC217735)",
      "Licensed_Manufacturing_Unit": "Sitashi Herbal Industry, H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022",
      "Country_Of_Origin": "Proudly Handcrafted in India (Bharat)"
    },
    "hero_heading": "Artisanal Ayurvedic Deep Cleansing Meets Pure Aloe Hydration: The 100 GM Charcoal Deep Cleansing Bar",
    "intro_paragraphs": [
      "While facial skin often receives carefully calibrated cleansers, the skin covering the rest of the body—particularly the back, shoulders, chest, and neck, which house a high density of sebaceous and eccrine sweat glands—is frequently subjected to harsh, mass-manufactured commercial syndet and tallow detergent bars. These industrial bars strip the body's lipid mantle, leave chalky hard-water soap scum across pores, and trigger post-shower dryness and body congestion.",
      "The Bhumivera Charcoal Deep Cleansing Bar (100 GM · SKU: BV-LUX-CSOAP-04) elevates daily full-body bathing into a handcrafted Ayurvedic apothecary ritual. Compounded in quality-controlled artisanal batches under The Bhumivera Transparency Standard (Est. 2016 lineage), this obsidian bar pairs high-porosity Activated Charcoal with soothing Pure Aloe Vera (Aloe barbadensis Miller) inside a gentle, 100% vegetarian Ayurvedic soap base free from harsh synthetic detergents."
    ],
    "science_paragraphs": [
      "Activated Charcoal functions across the skin of the body through physical adsorption: its vast internal network of micropores binds excess sebum, gym and commute sweat, oxidized body oils, deodorants, and urban airborne particulates without requiring harsh alkaline degreasing agents. Because the carbon powder in the Bhumivera Charcoal Deep Cleansing Bar is finely milled, the bar glides smoothly over the skin without scratching or irritating delicate areas.",
      "To counter the drying tendency of ordinary charcoal soaps, Bhumivera infuses the bar with cold-filleted Aloe Vera inner-leaf mucilage. Rich in acemannan polysaccharides, glycoproteins, and soothing plant sterols, Aloe Vera cushions the lather so that your skin emerges from the bath feeling velvety, calm, and deeply hydrated."
    ],
    "synergy_paragraphs": [
      "For patrons seeking a complete head-to-toe purifying regimen, the Bhumivera Charcoal Deep Cleansing Bar pairs seamlessly with our Bhumivera Activated Charcoal Purifying Luxury Face Wash (for targeted pH 5.4 facial cleansing) and our Kalpvriksh Satva 7-Tulsi Drops in The Inside-Out Skin-Clearing & Cortisol Ritual Bundle.",
      "If you prefer to rotate your daily bathing bars by skin mood, use the Charcoal Deep Cleansing Bar after workouts or humid outdoor commutes, and alternate with the Bhumivera Soothing Bar (Aloe Vera, Neem & Sacred Tulsi) for calming herbal nourishment."
    ],
    "ritual_paragraphs": [
      "Wet the 100 GM bar under lukewarm shower water and work it between your palms or onto a soft cotton washcloth to build a rich, creamy lather. Massage across wet skin for 30 to 45 seconds—paying special attention to the neck, shoulders, upper back, and chest—before rinsing thoroughly. Place the bar on a well-drained dish after each use so it stays firm and long-lasting."
    ],
    "climate_paragraphs": [
      "In India's hot summers and sticky monsoons, daily sweat and dust accumulate rapidly on the neck and back; the Charcoal Deep Cleansing Bar lifts this buildup effortlessly while leaving skin fresh. In cooler winter months, its Aloe Vera hydration matrix prevents the flaky, ashy skin dryness caused by ordinary market soaps."
    ],
    "provenance_paragraphs": [
      "Handcrafted under Batch #SACHS26I using Assam bamboo activated carbon and Rajasthan Aloe Vera inner-leaf fillet, each 100 GM bar is wrapped and sealed under Bhumivera's strict sanitary custody protocol."
    ],
    "faqs": [
      {
        "q": "What are the exact ingredients in Bhumivera Charcoal Deep Cleansing Bar?",
        "a": "It is formulated with Activated Charcoal, pure Aloe Vera (Aloevera / Aloe barbadensis), and a gentle Ayurvedic Soap Base in a 100 GM handmade bar free from harsh synthetic detergents."
      },
      {
        "q": "Is Bhumivera Handmade Charcoal Soap suitable for sensitive skin?",
        "a": "Yes. This handmade Ayurvedic cleansing bar is crafted under strict quality control with soothing Aloe Vera and without harsh synthetic detergents, making it gentle for everyday use. As with all botanical products, we recommend a 24-hour patch test before first use."
      },
      {
        "q": "Can I use the Charcoal Deep Cleansing Bar on both my face and body?",
        "a": "Yes, its gentle Ayurvedic base and Aloe Vera cushion make it suitable for both face and body. For dedicated facial cleansing with 0.1% Niacinamide and 0.1% Hyaluronic Acid, you can also pair it with our Bhumivera Activated Charcoal Purifying Luxury Face Wash."
      },
      {
        "q": "Does this charcoal soap help with back acne, body sweat, and oily skin?",
        "a": "Yes. Microporous Activated Charcoal adsorbs excess sebum, sweat residue, and clogged pore debris on the back, shoulders, and chest without over-drying the skin."
      },
      {
        "q": "Will the black charcoal lather stain my skin or bathroom tiles?",
        "a": "No. The micro-milled carbon suspends cleanly in the Aloe-enriched lather and rinses off completely with water, leaving zero residue on skin or tiles."
      },
      {
        "q": "How is Bhumivera Charcoal Soap different from commercial market soaps?",
        "a": "Commercial soaps often remove natural glycerin and rely on harsh synthetic detergents (SLS) and animal tallow. Bhumivera crafts a 100% vegetarian Ayurvedic bar infused with pure Aloe Vera and steam-activated charcoal."
      },
      {
        "q": "How should I store my handmade soap bar so it lasts longer?",
        "a": "Store the bar on a slotted, well-drained soap dish away from direct standing water between showers so the artisanal base stays firm."
      },
      {
        "q": "What is the difference between the Charcoal Deep Cleansing Bar and the Bhumivera Soothing Bar?",
        "a": "The Charcoal Deep Cleansing Bar (₹399) focuses on deep-pore carbon detoxification with Aloe Vera, while the Soothing Bar (₹349) combines Aloe Vera, Neem, and Sacred Tulsi for calming, blemish-clarifying herbal care."
      }
    ],
    "full_description": "<article class=\"bhumivera-monograph space-y-6\">\n  <h3>Artisanal Ayurvedic Deep Cleansing Meets Pure Aloe Hydration: The 100 GM Charcoal Deep Cleansing Bar</h3>\n  <p><strong>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap) (100 GM · SKU: BV-LUX-CSOAP-04)</strong> is a flagship formulation from <a href=\"https://bhumivera.com\"><strong>Bhumivera — The Transparent Maison</strong></a> (<a href=\"https://bhumivera.com/about\">Bhumivera Organics India Private Limited</a>, incorporated August 4, 2026 under Founder <strong>Akash Prasad</strong> and Directors <strong>Akash Prasad, Payal Prasad &amp; Aman Prasad</strong>), rooted in the 10-year herbal manufacturing and household distribution heritage of <a href=\"https://bhumivera.com/mpgebusiness\"><strong>MPG E-Business Private Limited</strong></a> (established September 22, 2016 in Asansol, West Bengal · CIN: <code>U74999WB2016PTC217735</code> · Founder: <strong>Dilip Prasad Nonia</strong>). Engineered under <em>The Bhumivera Transparency Standard (Est. 2016 lineage)</em>, this formulation prints 100% of its functional active concentrations openly on the physical bottle label: <strong>Activated Charcoal, Aloevera (Aloe barbadensis), Pure Ayurvedic Soap Base (Free from Harsh Synthetic Chemicals)</strong>, calibrated to <strong>Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)</strong>.</p>\n  <p>While facial skin often receives carefully calibrated cleansers, the skin covering the rest of the body—particularly the back, shoulders, chest, and neck, which house a high density of sebaceous and eccrine sweat glands—is frequently subjected to harsh, mass-manufactured commercial syndet and tallow detergent bars. These industrial bars strip the body's lipid mantle, leave chalky hard-water soap scum across pores, and trigger post-shower dryness and body congestion.</p><p>The Bhumivera Charcoal Deep Cleansing Bar (100 GM · SKU: BV-LUX-CSOAP-04) elevates daily full-body bathing into a handcrafted Ayurvedic apothecary ritual. Compounded in quality-controlled artisanal batches under The Bhumivera Transparency Standard (Est. 2016 lineage), this obsidian bar pairs high-porosity Activated Charcoal with soothing Pure Aloe Vera (Aloe barbadensis Miller) inside a gentle, 100% vegetarian Ayurvedic soap base free from harsh synthetic detergents.</p>\n\n  <h3>I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters</h3>\n  <p>Activated Charcoal functions across the skin of the body through physical adsorption: its vast internal network of micropores binds excess sebum, gym and commute sweat, oxidized body oils, deodorants, and urban airborne particulates without requiring harsh alkaline degreasing agents. Because the carbon powder in the Bhumivera Charcoal Deep Cleansing Bar is finely milled, the bar glides smoothly over the skin without scratching or irritating delicate areas.</p><p>To counter the drying tendency of ordinary charcoal soaps, Bhumivera infuses the bar with cold-filleted Aloe Vera inner-leaf mucilage. Rich in acemannan polysaccharides, glycoproteins, and soothing plant sterols, Aloe Vera cushions the lather so that your skin emerges from the bath feeling velvety, calm, and deeply hydrated.</p>\n  <p>For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque <code>&ldquo;Aqua / Base Q.S.&rdquo;</code> disclosure on the back—where high-value botanicals like <a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Himalayan Sea Buckthorn</a>, <a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Manjistha (Rubia cordifolia)</a>, <a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Haridra (Curcuma longa)</a>, <a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reetha (Sapindus mukorossi)</a>, and <a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Sacred Tulsi (Ocimum tenuiflorum)</a> are dusted in at trace levels below 0.01% and boiled at 80°C–100°C. <a href=\"https://bhumivera.com/science\">Bhumivera’s Sub-28°C Formulation Lab</a> eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Niacinamide Vitamin B3</a>, <a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Multi-Molecular Hyaluronic Acid</a>, and Plant-Derived Glycerin) at full, verifiable label potencies.</p>\n\n  <h4>Complete Active Ingredient &amp; Phytochemical Monograph Table (100 GM)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Disclosed Active &amp; INCI</th>\n          <th>Label Potency</th>\n          <th>Botanical / Chemical Class &amp; Reference</th>\n          <th>Extraction &amp; Harvest Corridor</th>\n          <th>Dermal / Trichological / Cellular Mechanism</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Activated Charcoal</strong><br/><small>Carbon Black / Steam-Activated Bamboo Charcoal (<15 μm)</small></td>\n          <td><strong>Deep Cleansing Core</strong></td>\n          <td>Microporous Activated Carbon (<a href=\"https://en.wikipedia.org/wiki/Activated_carbon\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>850°C Steam Activation & Fine Sieve Milling · <a href=\"/provenance-engine\">REG-03 · Assam & North-East Sustainable Bamboo Groves</a></td>\n          <td>Draws out deep-seated pore impurities, excess body sebum, sweat residue, and environmental pollutants from face, neck, back, and shoulders.</td>\n        </tr><tr>\n          <td><strong>Aloevera Extract</strong><br/><small>Aloe barbadensis Miller Inner-Leaf Fillet Gel</small></td>\n          <td><strong>Soothing Hydration Matrix</strong></td>\n          <td>Aloe barbadensis miller (<a href=\"https://en.wikipedia.org/wiki/Aloe_vera\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold Hand-Filleted Mucilage (<28°C) · <a href=\"/provenance-engine\">REG-04 · Thar Edge Organic Belts, Rajasthan</a></td>\n          <td>Replenishes skin moisture during bathing, calms heat and dryness, and creates a rich, velvety, non-stripping lather.</td>\n        </tr><tr>\n          <td><strong>Ayurvedic Soap Base</strong><br/><small>Artisanal Vegetable-Oil & Glycerin Saponified Base</small></td>\n          <td><strong>Q.S. (100 GM Bar)</strong></td>\n          <td>Gentle Artisanal Soap Base (<a href=\"https://en.wikipedia.org/wiki/Ayurveda\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Small-Batch Cold-Molded Artisanal Curing · <a href=\"/provenance-engine\">REG-06 · GMP Artisanal Soap Atelier</a></td>\n          <td>Prepared in quality-controlled batches without harsh synthetic detergents, SLS, parabens, or animal tallow for everyday face and body cleansing.</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3>II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin))</h3>\n  <p>For patrons seeking a complete head-to-toe purifying regimen, the Bhumivera Charcoal Deep Cleansing Bar pairs seamlessly with our Bhumivera Activated Charcoal Purifying Luxury Face Wash (for targeted pH 5.4 facial cleansing) and our Kalpvriksh Satva 7-Tulsi Drops in The Inside-Out Skin-Clearing & Cortisol Ritual Bundle.</p><p>If you prefer to rotate your daily bathing bars by skin mood, use the Charcoal Deep Cleansing Bar after workouts or humid outdoor commutes, and alternate with the Bhumivera Soothing Bar (Aloe Vera, Neem & Sacred Tulsi) for calming herbal nourishment.</p>\n  <p>Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically <em>beta-glucocerebrosidase</em> and <em>acidic sphingomyelinase</em>—require an acidic microenvironment between <strong>pH 4.7 and 5.75</strong> to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating <strong>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)</strong> to <strong>Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)</strong> and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our <a href=\"/verify\">Bottle Serial &amp; COA Verification Portal</a> and <a href=\"/somatic-registry\">Somatic INCI Label Registry</a>), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it.</p>\n\n  <h3>III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule</h3>\n  <p>Wet the 100 GM bar under lukewarm shower water and work it between your palms or onto a soft cotton washcloth to build a rich, creamy lather. Massage across wet skin for 30 to 45 seconds—paying special attention to the neck, shoulders, upper back, and chest—before rinsing thoroughly. Place the bar on a well-drained dish after each use so it stays firm and long-lasting.</p>\n  <ul>\n    <li><strong>Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):</strong> Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer.</li>\n    <li><strong>Step 2 — Measured Dispensing &amp; Palmar Emulsification:</strong> Dispense the recommended dose of <strong>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)</strong> into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp.</li>\n    <li><strong>Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:</strong> Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives (<strong>Activated Charcoal, Aloevera (Aloe barbadensis), Pure Ayurvedic Soap Base (Free from Harsh Synthetic Chemicals)</strong>) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates.</li>\n    <li><strong>Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:</strong> Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary <a href=\"/shop\">Bhumivera Inside-Out Ritual</a> formulations.</li>\n    <li><strong>Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:</strong> Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility (<a href=\"/lab\">read our full Cleanroom &amp; Patch-Test Protocol</a>).</li>\n  </ul>\n\n  <h3>IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter)</h3>\n  <p>In India's hot summers and sticky monsoons, daily sweat and dust accumulate rapidly on the neck and back; the Charcoal Deep Cleansing Bar lifts this buildup effortlessly while leaving skin fresh. In cooler winter months, its Aloe Vera hydration matrix prevents the flaky, ashy skin dryness caused by ordinary market soaps.</p>\n  <p>Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum. <strong>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)</strong> is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration.</p>\n\n  <h3>V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem</h3>\n  <p>Every formulation in the <a href=\"/shop\">Bhumivera 6-Product Flagship Catalog</a> is engineered to work as part of an interconnected, inside-out botanical system. Explore how <strong>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)</strong> pairs with our companion formulations:</p>\n  <ul>\n    <li><strong>1. <a href=\"/product/activated-charcoal-luxury-face-wash\">Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699)</a>:</strong> Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification.</li>\n    <li><strong>2. <a href=\"/product/himalayan-seabuckthorn-luxury-face-wash\">Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799)</a>:</strong> Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity.</li>\n    <li><strong>3. <a href=\"/product/luxury-2-in-1-botanical-shampoo-conditioner\">Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899)</a>:</strong> Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing.</li>\n    <li><strong>4. <a href=\"/product/artisanal-charcoal-handmade-soap\">Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399)</a>:</strong> Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification.</li>\n    <li><strong>5. <a href=\"/product/artisanal-aloe-vera-handmade-soap\">Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349)</a>:</strong> Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care.</li>\n    <li><strong>6. <a href=\"/product/kalpvriksh-satva-tulsi-7-tulsi-extract\">Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499)</a>:</strong> Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality.</li>\n  </ul>\n  <p>You can also acquire coordinated sets in our <a href=\"/combo/bundle-daily-regimen\">Grand Maison 4-Piece Daily Apothecary Bundle</a>, <a href=\"/combo/bundle-royal-crown-trio\">Royal Skin &amp; Scalp Stewardship Trio</a>, <a href=\"/combo/bundle-inside-out-ritual\">Inside-Out Skin-Clearing &amp; Cortisol Ritual</a>, or the collector’s <a href=\"/combo/bundle-grand-maison-vault\">Grand Maison 6-Piece Apothecary Vault</a>, or compare any two formulations side-by-side on our <a href=\"/compare\">Interactive Formulation Comparison Tool</a>.</p>\n\n  <h3>VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact</h3>\n  <p>Handcrafted under Batch #SACHS26I using Assam bamboo activated carbon and Rajasthan Aloe Vera inner-leaf fillet, each 100 GM bar is wrapped and sealed under Bhumivera's strict sanitary custody protocol.</p>\n  <p>Every unit of <strong>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)</strong> is traceable through our <a href=\"/provenance-engine\">6-Corridor Indian Botanical Provenance Engine</a> and protected by <a href=\"/purchase-protection\">Bhumivera White-Glove Purchase Protection</a>. To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard (<a href=\"/legal/shipping-hygiene\">Part II of the Bhumivera Legal Suite</a>) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch (<a href=\"/order-tracking\">track live AWB &amp; dispatch weight logs</a>). Furthermore, every order supports our verifiable community initiatives documented on the <a href=\"/impact\">Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact)</a>—including <a href=\"/impact/stray-animal-care\">The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative</a> and <a href=\"/impact/elderly-disabled-rations\">The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative</a> in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors (<a href=\"/impact/damodar-cleanup\">Damodar Riverbank Vetiver Cleanup</a>, <a href=\"/impact/jute-sapling-nursery\">Biodegradable Jute Sapling Nursery</a>, <a href=\"/impact/village-pukur-revival\">Village Pukur Pond Revival</a>, <a href=\"/impact/herbal-kitchen-gardens\">Medicinal Herbal Kitchen Gardens</a>, <a href=\"/impact/mandi-vermicomposting\">Mandi Waste Vermicomposting</a>, and <a href=\"/impact/coal-belt-microgrove\">Coal-Belt Native Micro-Grove</a>).</p>\n\n  <h4>Technical &amp; Regulatory Specification Summary (BV-LUX-CSOAP-04)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Specification Parameter</th>\n          <th>Verified Bhumivera Standard</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Brand Name</strong></td>\n          <td>Bhumivera (The Transparent Maison · Est. 2016 Lineage)</td>\n        </tr><tr>\n          <td><strong>Product Full Name</strong></td>\n          <td>Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)</td>\n        </tr><tr>\n          <td><strong>SKU Code</strong></td>\n          <td>BV-LUX-CSOAP-04</td>\n        </tr><tr>\n          <td><strong>MPN Code</strong></td>\n          <td>BVCSOAP100GM</td>\n        </tr><tr>\n          <td><strong>GTIN 13 EAN</strong></td>\n          <td>8906182600049</td>\n        </tr><tr>\n          <td><strong>GST HSN Code</strong></td>\n          <td>30049011 (Ayurvedic & Botanical Preparations · 5% GST)</td>\n        </tr><tr>\n          <td><strong>Net Weight Metric</strong></td>\n          <td>100 GM (3.52 oz. Solid Artisanal Bar)</td>\n        </tr><tr>\n          <td><strong>Gross Dispatch Weight</strong></td>\n          <td>135.0 Grams (±0.5g Digital Scale Verified)</td>\n        </tr><tr>\n          <td><strong>Batch Number</strong></td>\n          <td>SACHS26I (Handcrafted Quality-Controlled Batch)</td>\n        </tr><tr>\n          <td><strong>Manufacturing Date</strong></td>\n          <td>2026-09-01 (24-Month Shelf Life)</td>\n        </tr><tr>\n          <td><strong>Formulation Standard</strong></td>\n          <td>Skin-Friendly Handmade Ayurvedic Bar (Free from Harsh Synthetic Detergents)</td>\n        </tr><tr>\n          <td><strong>Primary Purifying Active</strong></td>\n          <td>Steam-Activated Microporous Bamboo Charcoal (<15 Microns)</td>\n        </tr><tr>\n          <td><strong>Primary Soothing Active</strong></td>\n          <td>Pure Aloe Vera (Aloe barbadensis Miller) Inner-Leaf Fillet Extract</td>\n        </tr><tr>\n          <td><strong>Cleansing Base Type</strong></td>\n          <td>100% Vegetarian Ayurvedic Soap Base with Retained Natural Glycerin</td>\n        </tr><tr>\n          <td><strong>Free From Guarantee</strong></td>\n          <td>0% SLS/SLES, 0% Parabens, 0% Animal Fat/Tallow, 0% Synthetic Microbeads</td>\n        </tr><tr>\n          <td><strong>Target Skin Profiles</strong></td>\n          <td>Oily, Combination, Sweat-Prone, Normal & Delicate Skin (Face & Body)</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</article>",
    "description": "Artisanal Ayurvedic Deep Cleansing Meets Pure Aloe Hydration: The 100 GM Charcoal Deep Cleansing Bar \n    Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap) (100 GM · SKU: BV-LUX-CSOAP-04)  is a flagship formulation from   Bhumivera — The Transparent Maison   ( Bhumivera Organics India Private Limited , incorporated August 4, 2026 under Founder  Akash Prasad  and Directors  Akash Prasad, Payal Prasad &amp; Aman Prasad ), rooted in the 10-year herbal manufacturing and household distribution heritage of   MPG E-Business Private Limited   (established September 22, 2016 in Asansol, West Bengal · CIN:  U74999WB2016PTC217735  · Founder:  Dilip Prasad Nonia ). Engineered under  The Bhumivera Transparency Standard (Est. 2016 lineage) , this formulation prints 100% of its functional active concentrations openly on the physical bottle label:  Activated Charcoal, Aloevera (Aloe barbadensis), Pure Ayurvedic Soap Base (Free from Harsh Synthetic Chemicals) , calibrated to  Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin) . \n   While facial skin often receives carefully calibrated cleansers, the skin covering the rest of the body—particularly the back, shoulders, chest, and neck, which house a high density of sebaceous and eccrine sweat glands—is frequently subjected to harsh, mass-manufactured commercial syndet and tallow detergent bars. These industrial bars strip the body's lipid mantle, leave chalky hard-water soap scum across pores, and trigger post-shower dryness and body congestion.  The Bhumivera Charcoal Deep Cleansing Bar (100 GM · SKU: BV-LUX-CSOAP-04) elevates daily full-body bathing into a handcrafted Ayurvedic apothecary ritual. Compounded in quality-controlled artisanal batches under The Bhumivera Transparency Standard (Est. 2016 lineage), this obsidian bar pairs high-porosity Activated Charcoal with soothing Pure Aloe Vera (Aloe barbadensis Miller) inside a gentle, 100% vegetarian Ayurvedic soap base free from harsh synthetic detergents. \n\n   I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters \n   Activated Charcoal functions across the skin of the body through physical adsorption: its vast internal network of micropores binds excess sebum, gym and commute sweat, oxidized body oils, deodorants, and urban airborne particulates without requiring harsh alkaline degreasing agents. Because the carbon powder in the Bhumivera Charcoal Deep Cleansing Bar is finely milled, the bar glides smoothly over the skin without scratching or irritating delicate areas.  To counter the drying tendency of ordinary charcoal soaps, Bhumivera infuses the bar with cold-filleted Aloe Vera inner-leaf mucilage. Rich in acemannan polysaccharides, glycoproteins, and soothing plant sterols, Aloe Vera cushions the lather so that your skin emerges from the bath feeling velvety, calm, and deeply hydrated. \n   For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque  &ldquo;Aqua / Base Q.S.&rdquo;  disclosure on the back—where high-value botanicals like  Himalayan Sea Buckthorn ,  Manjistha (Rubia cordifolia) ,  Haridra (Curcuma longa) ,  Reetha (Sapindus mukorossi) , and  Sacred Tulsi (Ocimum tenuiflorum)  are dusted in at trace levels below 0.01% and boiled at 80°C–100°C.  Bhumivera’s Sub-28°C Formulation Lab  eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants ( Niacinamide Vitamin B3 ,  Multi-Molecular Hyaluronic Acid , and Plant-Derived Glycerin) at full, verifiable label potencies. \n\n   Complete Active Ingredient &amp; Phytochemical Monograph Table (100 GM) \n   \n     \n       \n         \n           Disclosed Active &amp; INCI \n           Label Potency \n           Botanical / Chemical Class &amp; Reference \n           Extraction &amp; Harvest Corridor \n           Dermal / Trichological / Cellular Mechanism \n         \n       \n       \n         \n            Activated Charcoal   Carbon Black / Steam-Activated Bamboo Charcoal (  \n            Deep Cleansing Core  \n           Microporous Activated Carbon ( Reference ↗ ) \n           850°C Steam Activation & Fine Sieve Milling ·  REG-03 · Assam & North-East Sustainable Bamboo Groves  \n           Draws out deep-seated pore impurities, excess body sebum, sweat residue, and environmental pollutants from face, neck, back, and shoulders. \n          \n            Aloevera Extract   Aloe barbadensis Miller Inner-Leaf Fillet Gel  \n            Soothing Hydration Matrix  \n           Aloe barbadensis miller ( Reference ↗ ) \n           Cold Hand-Filleted Mucilage ( REG-04 · Thar Edge Organic Belts, Rajasthan  \n           Replenishes skin moisture during bathing, calms heat and dryness, and creates a rich, velvety, non-stripping lather. \n          \n            Ayurvedic Soap Base   Artisanal Vegetable-Oil & Glycerin Saponified Base  \n            Q.S. (100 GM Bar)  \n           Gentle Artisanal Soap Base ( Reference ↗ ) \n           Small-Batch Cold-Molded Artisanal Curing ·  REG-06 · GMP Artisanal Soap Atelier  \n           Prepared in quality-controlled batches without harsh synthetic detergents, SLS, parabens, or animal tallow for everyday face and body cleansing. \n         \n       \n     \n   \n\n   II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)) \n   For patrons seeking a complete head-to-toe purifying regimen, the Bhumivera Charcoal Deep Cleansing Bar pairs seamlessly with our Bhumivera Activated Charcoal Purifying Luxury Face Wash (for targeted pH 5.4 facial cleansing) and our Kalpvriksh Satva 7-Tulsi Drops in The Inside-Out Skin-Clearing & Cortisol Ritual Bundle.  If you prefer to rotate your daily bathing bars by skin mood, use the Charcoal Deep Cleansing Bar after workouts or humid outdoor commutes, and alternate with the Bhumivera Soothing Bar (Aloe Vera, Neem & Sacred Tulsi) for calming herbal nourishment. \n   Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically  beta-glucocerebrosidase  and  acidic sphingomyelinase —require an acidic microenvironment between  pH 4.7 and 5.75  to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating  Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)  to  Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)  and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our  Bottle Serial &amp; COA Verification Portal  and  Somatic INCI Label Registry ), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it. \n\n   III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule \n   Wet the 100 GM bar under lukewarm shower water and work it between your palms or onto a soft cotton washcloth to build a rich, creamy lather. Massage across wet skin for 30 to 45 seconds—paying special attention to the neck, shoulders, upper back, and chest—before rinsing thoroughly. Place the bar on a well-drained dish after each use so it stays firm and long-lasting. \n   \n      Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):  Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer. \n      Step 2 — Measured Dispensing &amp; Palmar Emulsification:  Dispense the recommended dose of  Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)  into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp. \n      Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:  Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives ( Activated Charcoal, Aloevera (Aloe barbadensis), Pure Ayurvedic Soap Base (Free from Harsh Synthetic Chemicals) ) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates. \n      Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:  Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary  Bhumivera Inside-Out Ritual  formulations. \n      Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:  Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility ( read our full Cleanroom &amp; Patch-Test Protocol ). \n   \n\n   IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter) \n   In India's hot summers and sticky monsoons, daily sweat and dust accumulate rapidly on the neck and back; the Charcoal Deep Cleansing Bar lifts this buildup effortlessly while leaving skin fresh. In cooler winter months, its Aloe Vera hydration matrix prevents the flaky, ashy skin dryness caused by ordinary market soaps. \n   Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum.  Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)  is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration. \n\n   V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem \n   Every formulation in the  Bhumivera 6-Product Flagship Catalog  is engineered to work as part of an interconnected, inside-out botanical system. Explore how  Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)  pairs with our companion formulations: \n   \n      1.  Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699) :  Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification. \n      2.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799) :  Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity. \n      3.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899) :  Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing. \n      4.  Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399) :  Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification. \n      5.  Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349) :  Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care. \n      6.  Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499) :  Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality. \n   \n   You can also acquire coordinated sets in our  Grand Maison 4-Piece Daily Apothecary Bundle ,  Royal Skin &amp; Scalp Stewardship Trio ,  Inside-Out Skin-Clearing &amp; Cortisol Ritual , or the collector’s  Grand Maison 6-Piece Apothecary Vault , or compare any two formulations side-by-side on our  Interactive Formulation Comparison Tool . \n\n   VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact \n   Handcrafted under Batch #SACHS26I using Assam bamboo activated carbon and Rajasthan Aloe Vera inner-leaf fillet, each 100 GM bar is wrapped and sealed under Bhumivera's strict sanitary custody protocol. \n   Every unit of  Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)  is traceable through our  6-Corridor Indian Botanical Provenance Engine  and protected by  Bhumivera White-Glove Purchase Protection . To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard ( Part II of the Bhumivera Legal Suite ) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch ( track live AWB &amp; dispatch weight logs ). Furthermore, every order supports our verifiable community initiatives documented on the  Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact) —including  The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative  and  The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative  in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors ( Damodar Riverbank Vetiver Cleanup ,  Biodegradable Jute Sapling Nursery ,  Village Pukur Pond Revival ,  Medicinal Herbal Kitchen Gardens ,  Mandi Waste Vermicomposting , and  Coal-Belt Native Micro-Grove ). \n\n   Technical &amp; Regulatory Specification Summary (BV-LUX-CSOAP-04) \n   \n     \n       \n         \n           Specification Parameter \n           Verified Bhumivera Standard \n         \n       \n       \n         \n            Brand Name  \n           Bhumivera (The Transparent Maison · Est. 2016 Lineage) \n          \n            Product Full Name  \n           Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap) \n          \n            SKU Code  \n           BV-LUX-CSOAP-04 \n          \n            MPN Code  \n           BVCSOAP100GM \n          \n            GTIN 13 EAN  \n           8906182600049 \n          \n            GST HSN Code  \n           30049011 (Ayurvedic & Botanical Preparations · 5% GST) \n          \n            Net Weight Metric  \n           100 GM (3.52 oz. Solid Artisanal Bar) \n          \n            Gross Dispatch Weight  \n           135.0 Grams (±0.5g Digital Scale Verified) \n          \n            Batch Number  \n           SACHS26I (Handcrafted Quality-Controlled Batch) \n          \n            Manufacturing Date  \n           2026-09-01 (24-Month Shelf Life) \n          \n            Formulation Standard  \n           Skin-Friendly Handmade Ayurvedic Bar (Free from Harsh Synthetic Detergents) \n          \n            Primary Purifying Active  \n           Steam-Activated Microporous Bamboo Charcoal ( \n          \n            Primary Soothing Active  \n           Pure Aloe Vera (Aloe barbadensis Miller) Inner-Leaf Fillet Extract \n          \n            Cleansing Base Type  \n           100% Vegetarian Ayurvedic Soap Base with Retained Natural Glycerin \n          \n            Free From Guarantee  \n           0% SLS/SLES, 0% Parabens, 0% Animal Fat/Tallow, 0% Synthetic Microbeads \n          \n            Target Skin Profiles  \n           Oily, Combination, Sweat-Prone, Normal & Delicate Skin (Face & Body)",
    "editorial_heading": "Artisanal Ayurvedic Deep Cleansing Meets Pure Aloe Hydration: The 100 GM Charcoal Deep Cleansing Bar",
    "editorial_paragraphs": [
      "While facial skin often receives carefully calibrated cleansers, the skin covering the rest of the body—particularly the back, shoulders, chest, and neck, which house a high density of sebaceous and eccrine sweat glands—is frequently subjected to harsh, mass-manufactured commercial syndet and tallow detergent bars. These industrial bars strip the body's lipid mantle, leave chalky hard-water soap scum across pores, and trigger post-shower dryness and body congestion.",
      "The Bhumivera Charcoal Deep Cleansing Bar (100 GM · SKU: BV-LUX-CSOAP-04) elevates daily full-body bathing into a handcrafted Ayurvedic apothecary ritual. Compounded in quality-controlled artisanal batches under The Bhumivera Transparency Standard (Est. 2016 lineage), this obsidian bar pairs high-porosity Activated Charcoal with soothing Pure Aloe Vera (Aloe barbadensis Miller) inside a gentle, 100% vegetarian Ayurvedic soap base free from harsh synthetic detergents.",
      "Activated Charcoal functions across the skin of the body through physical adsorption: its vast internal network of micropores binds excess sebum, gym and commute sweat, oxidized body oils, deodorants, and urban airborne particulates without requiring harsh alkaline degreasing agents. Because the carbon powder in the Bhumivera Charcoal Deep Cleansing Bar is finely milled, the bar glides smoothly over the skin without scratching or irritating delicate areas.",
      "To counter the drying tendency of ordinary charcoal soaps, Bhumivera infuses the bar with cold-filleted Aloe Vera inner-leaf mucilage. Rich in acemannan polysaccharides, glycoproteins, and soothing plant sterols, Aloe Vera cushions the lather so that your skin emerges from the bath feeling velvety, calm, and deeply hydrated.",
      "For patrons seeking a complete head-to-toe purifying regimen, the Bhumivera Charcoal Deep Cleansing Bar pairs seamlessly with our Bhumivera Activated Charcoal Purifying Luxury Face Wash (for targeted pH 5.4 facial cleansing) and our Kalpvriksh Satva 7-Tulsi Drops in The Inside-Out Skin-Clearing & Cortisol Ritual Bundle.",
      "If you prefer to rotate your daily bathing bars by skin mood, use the Charcoal Deep Cleansing Bar after workouts or humid outdoor commutes, and alternate with the Bhumivera Soothing Bar (Aloe Vera, Neem & Sacred Tulsi) for calming herbal nourishment."
    ],
    "exactCompositionTable": [
      {
        "active": "Activated Charcoal",
        "ingredient": "Activated Charcoal",
        "potency": "Deep Cleansing Core",
        "concentration": "Deep Cleansing Core",
        "classification": "Microporous Activated Carbon",
        "botanical": "Microporous Activated Carbon",
        "inci": "",
        "molecular_markers": "High-Surface-Area Microporous Carbon Lattice (>900 m²/g)",
        "extraction_method": "850°C Steam Activation & Fine Sieve Milling",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)",
        "mechanism": "Draws out deep-seated pore impurities, excess body sebum, sweat residue, and environmental pollutants from face, neck, back, and shoulders.",
        "role": "Draws out deep-seated pore impurities, excess body sebum, sweat residue, and environmental pollutants from face, neck, back, and shoulders.",
        "synergy_partners": "Aloevera Extract + Gentle Ayurvedic Soap Base",
        "reference_url": "https://en.wikipedia.org/wiki/Activated_carbon"
      },
      {
        "active": "Aloevera Extract",
        "ingredient": "Aloevera Extract",
        "potency": "Soothing Hydration Matrix",
        "concentration": "Soothing Hydration Matrix",
        "classification": "Aloe barbadensis miller",
        "botanical": "Aloe barbadensis miller",
        "inci": "",
        "molecular_markers": "Acemannan Polysaccharides, Glucomannans, Amino Acids & Sterols",
        "extraction_method": "Cold Hand-Filleted Mucilage (<28°C)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)",
        "mechanism": "Replenishes skin moisture during bathing, calms heat and dryness, and creates a rich, velvety, non-stripping lather.",
        "role": "Replenishes skin moisture during bathing, calms heat and dryness, and creates a rich, velvety, non-stripping lather.",
        "synergy_partners": "Microporous Activated Charcoal",
        "reference_url": "https://en.wikipedia.org/wiki/Aloe_vera"
      },
      {
        "active": "Ayurvedic Soap Base",
        "ingredient": "Ayurvedic Soap Base",
        "potency": "Q.S. (100 GM Bar)",
        "concentration": "Q.S. (100 GM Bar)",
        "classification": "Gentle Artisanal Soap Base",
        "botanical": "Gentle Artisanal Soap Base",
        "inci": "",
        "molecular_markers": "Retained Natural Plant Glycerin & Mild Fatty Acid Salts",
        "extraction_method": "Small-Batch Cold-Molded Artisanal Curing",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "Skin-Friendly Handmade Ayurvedic Bar (Gentle for Delicate & Sensitive Skin)",
        "mechanism": "Prepared in quality-controlled batches without harsh synthetic detergents, SLS, parabens, or animal tallow for everyday face and body cleansing.",
        "role": "Prepared in quality-controlled batches without harsh synthetic detergents, SLS, parabens, or animal tallow for everyday face and body cleansing.",
        "synergy_partners": "Activated Charcoal + Aloe Vera",
        "reference_url": "https://en.wikipedia.org/wiki/Ayurveda"
      }
    ],
    "directAnswerFaqs": [
      {
        "q": "What are the exact ingredients in Bhumivera Charcoal Deep Cleansing Bar?",
        "a": "It is formulated with Activated Charcoal, pure Aloe Vera (Aloevera / Aloe barbadensis), and a gentle Ayurvedic Soap Base in a 100 GM handmade bar free from harsh synthetic detergents."
      },
      {
        "q": "Is Bhumivera Handmade Charcoal Soap suitable for sensitive skin?",
        "a": "Yes. This handmade Ayurvedic cleansing bar is crafted under strict quality control with soothing Aloe Vera and without harsh synthetic detergents, making it gentle for everyday use. As with all botanical products, we recommend a 24-hour patch test before first use."
      },
      {
        "q": "Can I use the Charcoal Deep Cleansing Bar on both my face and body?",
        "a": "Yes, its gentle Ayurvedic base and Aloe Vera cushion make it suitable for both face and body. For dedicated facial cleansing with 0.1% Niacinamide and 0.1% Hyaluronic Acid, you can also pair it with our Bhumivera Activated Charcoal Purifying Luxury Face Wash."
      },
      {
        "q": "Does this charcoal soap help with back acne, body sweat, and oily skin?",
        "a": "Yes. Microporous Activated Charcoal adsorbs excess sebum, sweat residue, and clogged pore debris on the back, shoulders, and chest without over-drying the skin."
      },
      {
        "q": "Will the black charcoal lather stain my skin or bathroom tiles?",
        "a": "No. The micro-milled carbon suspends cleanly in the Aloe-enriched lather and rinses off completely with water, leaving zero residue on skin or tiles."
      },
      {
        "q": "How is Bhumivera Charcoal Soap different from commercial market soaps?",
        "a": "Commercial soaps often remove natural glycerin and rely on harsh synthetic detergents (SLS) and animal tallow. Bhumivera crafts a 100% vegetarian Ayurvedic bar infused with pure Aloe Vera and steam-activated charcoal."
      },
      {
        "q": "How should I store my handmade soap bar so it lasts longer?",
        "a": "Store the bar on a slotted, well-drained soap dish away from direct standing water between showers so the artisanal base stays firm."
      },
      {
        "q": "What is the difference between the Charcoal Deep Cleansing Bar and the Bhumivera Soothing Bar?",
        "a": "The Charcoal Deep Cleansing Bar (₹399) focuses on deep-pore carbon detoxification with Aloe Vera, while the Soothing Bar (₹349) combines Aloe Vera, Neem, and Sacred Tulsi for calming, blemish-clarifying herbal care."
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
    "rating": 4.68,
    "review_count": 218,
    "reviews": 218,
    "legacySlugs": [
      "bhumivera-gotu-kola-barrier-repair-gel",
      "bhumivera-soothing-bar",
      "aloe-vera-neem-tulsi-soap",
      "bhumivera-aloe-vera-soap",
      "neem-tulsi-aloe-vera-handmade-soap"
    ],
    "sku": "BV-LUX-ASOAP-05",
    "legacySkus": [
      "BV-GKBG-50ML"
    ],
    "mpn": "BVASOAP100GM",
    "gtin13": "8906182600056",
    "net_volume": "100 GM",
    "price": 349.0,
    "discountPrice": 349.0,
    "mrp": 449.0,
    "stock": 300,
    "quantity": 300,
    "gst_hsn_code": "30049011",
    "gst_rate": 5.0,
    "cost_price": 24.0,
    "batch_no": "SANTS26I",
    "mfg_date": "2026-09-01",
    "manufacturer_name": "Sitashi Herbal Industry",
    "manufacturer_address": "H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022, Rajasthan",
    "manufacturer_gstin": "08AEQFS1102P1ZM",
    "manufacturer_fssai": "12222999000145",
    "category": "Artisanal Ayurvedic Cleansing Bars",
    "ph_level": "Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)",
    "active_ingredients": "Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Tulsi (Ocimum tenuiflorum), Pure Ayurvedic Soap Base",
    "image_url": "/images/products/bhumivera-artisanal-aloe-vera-handmade-soap.webp",
    "image": "/images/products/bhumivera-artisanal-aloe-vera-handmade-soap.webp",
    "additionalImages": [
      "/assets/images/aloeverascience.webp",
      "/assets/images/aloeveradrop.webp"
    ],
    "seo_title": "Bhumivera Soothing Bar (100 GM) | Handmade Aloe Vera, Neem & Tulsi Ayurvedic Soap for Glowing & Clear Skin",
    "meta_description": "Shop Bhumivera Soothing Bar (100 GM): a handmade Ayurvedic cleansing bar infused with Aloe Vera, Neem, and Sacred Tulsi for smooth, clarified, and glowing skin.",
    "short_description": "Bhumivera Soothing Bar (100 GM)—a handmade Ayurvedic Cleansing Bar infused with Aloe Vera, Neem, and Sacred Tulsi for glowing, smooth, and clarified skin. Crafted in a gentle base free from harsh synthetic detergents.",
    "search_keywords": "bhumivera soothing bar, bhumivera aloe vera soap, aloe vera neem tulsi handmade soap India, ayurvedic soothing bathing bar for clear glowing skin, natural herbal soap for sensitive blemish prone skin, bhumivera.com",
    "conscious_buyer_highlights": [
      "Sacred Ayurvedic Trio: Combines soothing Aloe Vera (Aloe barbadensis) with clarifying Neem (Azadirachta indica) and antioxidant-rich Sacred Tulsi (Ocimum tenuiflorum).",
      "Smooth & Luminous Finish: Hydrates outer skin layers while cleansing so skin feels soft, calm, and refreshed.",
      "Zero Harsh Synthetic Detergents: Handcrafted in a gentle vegetarian Ayurvedic base suitable for everyday face and body cleansing.",
      "Family & Sensitive Skin Friendly: Mild botanical bathing ritual backed by the 10-year MPG E-Business heritage (24-hour patch test advised)."
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
      },
      {
        "name": "Ayurveda",
        "url": "https://en.wikipedia.org/wiki/Ayurveda"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Aloevera (Aloe Vera)",
        "inci_name": "Aloe barbadensis Miller Inner-Leaf Fillet Gel",
        "concentration": "Primary Soothing Active",
        "botanical": "Aloe barbadensis miller",
        "molecular_markers": "Acemannan Polysaccharides, Amino Acids, Vitamins A/C/E & Plant Sterols",
        "extraction_method": "Cold Hand-Filleted Inner Mucilage (<28°C)",
        "origin_corridor": "REG-04 · Thar Edge Organic Belts, Rajasthan",
        "ph_stability_window": "Skin-Calming Hydration Cushion",
        "role": "Hydrates outer skin layers, cools heat and dryness, and imparts a smooth, dewy, glowing finish after bathing.",
        "synergy_partners": "Neem Extract + Sacred Tulsi",
        "reference_url": "https://en.wikipedia.org/wiki/Aloe_vera",
        "related_products": [
          {
            "name": "Charcoal Deep Cleansing Bar",
            "slug": "artisanal-charcoal-handmade-soap"
          },
          {
            "name": "Royal 2-in-1 Shampoo",
            "slug": "luxury-2-in-1-botanical-shampoo-conditioner"
          }
        ]
      },
      {
        "ingredient": "Neem Extract",
        "inci_name": "Azadirachta indica Leaf Extract",
        "concentration": "Purifying Botanical Clarifier",
        "botanical": "Azadirachta indica",
        "molecular_markers": "Nimbidin, Nimbin, Quercetin & Limonoids",
        "extraction_method": "Sub-28°C Cold Leaf Infusion",
        "origin_corridor": "REG-05 · Central & Eastern India Botanical Cooperatives",
        "ph_stability_window": "Microbiome-Clarifying Active",
        "role": "Helps keep blemish-prone, heat-stressed, and monsoon-exposed skin clean, fresh, and clarified.",
        "synergy_partners": "Sacred Tulsi + Aloe Vera",
        "reference_url": "https://en.wikipedia.org/wiki/Azadirachta_indica",
        "related_products": [
          {
            "name": "Activated Charcoal Face Wash",
            "slug": "activated-charcoal-luxury-face-wash"
          },
          {
            "name": "Himalayan Sea Buckthorn Face Wash",
            "slug": "himalayan-seabuckthorn-luxury-face-wash"
          }
        ]
      },
      {
        "ingredient": "Tulsi (Holy Basil)",
        "inci_name": "Ocimum tenuiflorum Leaf Extract",
        "concentration": "Adaptogenic Herbal Purifier",
        "botanical": "Ocimum tenuiflorum",
        "molecular_markers": "Eugenol, Rosmarinic Acid, Ursolic Acid & Carvacrol",
        "extraction_method": "Sub-28°C Cold Herbal Infusion",
        "origin_corridor": "REG-05 · Vrindavan & Central India Tulsi Sanctuaries",
        "ph_stability_window": "Antioxidant Polyphenol Shield",
        "role": "Rich in natural eugenol and rosmarinic acid antioxidants that refresh pores, calm environmental stress, and support radiant skin.",
        "synergy_partners": "Neem Extract + Aloe Vera",
        "reference_url": "https://en.wikipedia.org/wiki/Ocimum_tenuiflorum",
        "related_products": [
          {
            "name": "Kalpvriksh Satva 7-Tulsi Drops",
            "slug": "kalpvriksh-satva-tulsi-7-tulsi-extract"
          }
        ]
      },
      {
        "ingredient": "Ayurvedic Soap Base",
        "inci_name": "Artisanal Vegetarian Glycerin-Retained Soap Base",
        "concentration": "Q.S. (100 GM Bar)",
        "botanical": "Gentle Artisanal Base",
        "molecular_markers": "Plant-Derived Fatty Acid Salts & Natural Glycerin",
        "extraction_method": "Small-Batch Cold-Molded Curing",
        "origin_corridor": "REG-06 · GMP Artisanal Soap Atelier",
        "ph_stability_window": "Mild Daily Cleansing Vehicle",
        "role": "Crafted under strict quality control without harsh synthetic chemicals, SLS/SLES, or animal tallow.",
        "synergy_partners": "Aloe Vera + Neem + Tulsi",
        "reference_url": "https://en.wikipedia.org/wiki/Ayurveda",
        "related_products": [
          {
            "name": "Charcoal Deep Cleansing Bar",
            "slug": "artisanal-charcoal-handmade-soap"
          }
        ]
      }
    ],
    "specifications": {
      "Brand_Name": "Bhumivera (The Transparent Maison · Est. 2016 Lineage)",
      "Product_Full_Name": "Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)",
      "SKU_Code": "BV-LUX-ASOAP-05",
      "MPN_Code": "BVASOAP100GM",
      "GTIN_13_EAN": "8906182600056",
      "GST_HSN_Code": "30049011 (Ayurvedic & Botanical Preparations · 5% GST)",
      "Net_Weight_Metric": "100 GM (3.52 oz. Solid Artisanal Bar)",
      "Gross_Dispatch_Weight": "134.5 Grams (±0.5g Digital Scale Verified)",
      "Batch_Number": "SANTS26I (Handcrafted Quality-Controlled Batch)",
      "Manufacturing_Date": "2026-09-01 (24-Month Shelf Life)",
      "Formulation_Standard": "Gentle Ayurvedic Soothing Bar (Zero Harsh Synthetic Detergents)",
      "Primary_Soothing_Active": "Pure Aloe Vera (Aloe barbadensis Miller) Inner-Leaf Fillet Gel",
      "Primary_Clarifying_Actives": "Neem (Azadirachta indica) + Sacred Tulsi (Ocimum tenuiflorum)",
      "Cleansing_Base_Type": "100% Vegetarian Ayurvedic Soap Base with Retained Natural Glycerin",
      "Free_From_Guarantee": "0% SLS/SLES, 0% Parabens, 0% Animal Fat/Tallow, 0% Harsh Detergents",
      "Target_Skin_Profiles": "Sensitive, Delicate, Blemish-Prone, Dry, Normal & Combination Skin",
      "Primary_Bathing_Goals": "Soothing Hydration, Prickly-Heat & Blemish Clarity, Smooth Luminous Skin",
      "Texture_And_Lather_Profile": "Botanical Emerald-Cream Bar with Silky, Moisture-Rich Lather",
      "Application_Zones": "Gentle Daily Face & Full-Body Cleansing for All Adult Skin Profiles",
      "Recommended_Ritual_Timing": "Twice Daily Morning & Evening Bathing Ritual (30–45s Massage)",
      "Storage_Instructions": "Store on a dry, ventilated soap dish away from direct standing water",
      "Patch_Test_Standard": "24-Hour Inner-Forearm Patch Test Recommended Prior to First Use",
      "Brand_Flagship_Entity": "Bhumivera Organics India Private Limited (Inc. August 4, 2026 · Asansol, WB)",
      "Parent_Heritage_Entity": "MPG E-Business Private Limited (Inc. Sept 22, 2016 · CIN: U74999WB2016PTC217735)",
      "Licensed_Manufacturing_Unit": "Sitashi Herbal Industry, H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022",
      "Country_Of_Origin": "Proudly Handcrafted in India (Bharat)"
    },
    "hero_heading": "The Classic Trinity of Ayurveda: Handmade Aloe Vera, Neem & Sacred Tulsi Soothing Bar for Glowing, Clear Skin",
    "intro_paragraphs": [
      "In classical Indian household wellness—a tradition our parent heritage enterprise MPG E-Business Private Limited has championed in Asansol, West Bengal since September 22, 2016—three botanicals stand unmatched for daily skin harmony: Aloe Vera (Kumari), Neem (Nimba), and Sacred Tulsi (Surasa). When skin is exposed to heat, humidity, sweat, friction, or seasonal dryness, it needs a cleanser that clarifies surface microbes without stripping the epidermal moisture barrier.",
      "The Bhumivera Soothing Bar (100 GM · SKU: BV-LUX-ASOAP-05) brings this sacred Ayurvedic trio together in a handcrafted luxury bathing bar. Formulated with pure Aloe Vera inner-leaf fillet, clarifying Neem leaf extract, and antioxidant-rich Sacred Tulsi inside a mild, detergent-free Ayurvedic soap base, it leaves both face and body feeling calm, smooth, clarified, and naturally luminous."
    ],
    "science_paragraphs": [
      "Each botanical in the Bhumivera Soothing Bar performs a distinct, complementary biochemical role during bathing. Cold-filleted Aloe Vera (Aloe barbadensis Miller) supplies long-chain acemannan mucopolysaccharides that form a soothing, water-binding film over the stratum corneum, cooling heat-flushed skin and preventing post-bath tightness.",
      "Simultaneously, Neem (Azadirachta indica, rich in nimbidin and quercetin limonoids) and Sacred Tulsi (Ocimum tenuiflorum, rich in eugenol, ursolic acid, and rosmarinic acid) purify pores and help maintain a balanced cutaneous microbiome—making this bar especially comforting during prickly summer heat, humid monsoons, and seasonal transitions."
    ],
    "synergy_paragraphs": [
      "Unlike mass-market herbal soaps that use synthetic green dyes and harsh sodium tallowate or SLS detergents, the Bhumivera Soothing Bar is hand-poured in a 100% vegetarian Ayurvedic base that retains natural plant glycerin. It is featured in our Royal Skin & Scalp Stewardship Trio alongside the 4% Himalayan Sea Buckthorn Face Wash and Royal 2-in-1 Botanical Shampoo.",
      "For an inside-out Tulsi ritual, pair your daily bath with the Bhumivera Soothing Bar alongside 3–4 internal drops of Bhumivera Kalpvriksh Satva Tulsi (7-Tulsi Liquid Extract) in warm water."
    ],
    "ritual_paragraphs": [
      "Moisten skin with lukewarm water, work the Bhumivera Soothing Bar into a rich, creamy lather between your palms, and massage gently over your face and body for 30 to 45 seconds before rinsing clean. Pat dry with a soft towel."
    ],
    "climate_paragraphs": [
      "During hot Indian summers and humid monsoons, Neem and Tulsi refresh sweat-prone skin and calm heat rashes. During dry autumns and winters, Aloe Vera's polysaccharide cushion keeps skin supple, smooth, and flake-free."
    ],
    "provenance_paragraphs": [
      "Compounded in Batch #SANTS26I under strict cleanroom quality control, every 100 GM Bhumivera Soothing Bar upholds our 100% Virgin Sanitary Custody Standard."
    ],
    "faqs": [
      {
        "q": "What makes Bhumivera Soothing Bar ideal for glowing and blemish-prone skin?",
        "a": "Unlike ordinary soaps that strip skin moisture, Bhumivera Soothing Bar pairs hydrating Aloe Vera with purifying Neem and antioxidant Tulsi in a gentle Ayurvedic soap base—clarifying pores while keeping skin soft and luminous."
      },
      {
        "q": "Can Bhumivera Aloe Vera, Neem & Tulsi Soothing Bar be used on sensitive skin?",
        "a": "Yes. It is crafted under strict quality control without harsh synthetic detergents. We recommend a standard 24-hour inner-forearm patch test before first use."
      },
      {
        "q": "What are the exact ingredients in the Bhumivera Soothing Bar?",
        "a": "It is formulated with Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Sacred Tulsi (Ocimum tenuiflorum), and a pure vegetarian Ayurvedic Soap Base in a 100 GM handmade bar."
      },
      {
        "q": "Can I use the Soothing Bar for daily facial and body washing?",
        "a": "Yes. Its mild, detergent-free Ayurvedic base and high Aloe Vera content make it gentle enough for both face and full-body daily bathing."
      },
      {
        "q": "How does Neem and Tulsi help skin during summer and monsoon seasons?",
        "a": "Neem (nimbidin) and Tulsi (eugenol and rosmarinic acid) naturally clarify sweat, humidity-induced oiliness, and surface grime while Aloe Vera cools heat-flushed skin."
      },
      {
        "q": "Does Bhumivera Soothing Bar contain animal fat or SLS?",
        "a": "No. It is 100% vegetarian, cruelty-free, and formulated without SLS/SLES sulfates, parabens, or harsh synthetic detergents."
      },
      {
        "q": "Which Bhumivera handmade soap should I pick: Soothing Bar or Charcoal Deep Cleansing Bar?",
        "a": "Pick the Soothing Bar (Aloe, Neem & Tulsi · ₹349) if you want calming hydration and gentle herbal clarity for sensitive or blemish-prone skin; pick the Charcoal Deep Cleansing Bar (Charcoal & Aloe · ₹399) if you want deep carbon adsorption for heavy sweat and oily skin."
      },
      {
        "q": "Which bundle includes the Bhumivera Soothing Bar?",
        "a": "It is included in The Royal Skin & Scalp Stewardship Trio (/combo/bundle-royal-crown-trio) and The Grand Maison 6-Piece Apothecary Vault (/combo/bundle-grand-maison-vault)."
      }
    ],
    "full_description": "<article class=\"bhumivera-monograph space-y-6\">\n  <h3>The Classic Trinity of Ayurveda: Handmade Aloe Vera, Neem & Sacred Tulsi Soothing Bar for Glowing, Clear Skin</h3>\n  <p><strong>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap) (100 GM · SKU: BV-LUX-ASOAP-05)</strong> is a flagship formulation from <a href=\"https://bhumivera.com\"><strong>Bhumivera — The Transparent Maison</strong></a> (<a href=\"https://bhumivera.com/about\">Bhumivera Organics India Private Limited</a>, incorporated August 4, 2026 under Founder <strong>Akash Prasad</strong> and Directors <strong>Akash Prasad, Payal Prasad &amp; Aman Prasad</strong>), rooted in the 10-year herbal manufacturing and household distribution heritage of <a href=\"https://bhumivera.com/mpgebusiness\"><strong>MPG E-Business Private Limited</strong></a> (established September 22, 2016 in Asansol, West Bengal · CIN: <code>U74999WB2016PTC217735</code> · Founder: <strong>Dilip Prasad Nonia</strong>). Engineered under <em>The Bhumivera Transparency Standard (Est. 2016 lineage)</em>, this formulation prints 100% of its functional active concentrations openly on the physical bottle label: <strong>Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Tulsi (Ocimum tenuiflorum), Pure Ayurvedic Soap Base</strong>, calibrated to <strong>Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)</strong>.</p>\n  <p>In classical Indian household wellness—a tradition our parent heritage enterprise MPG E-Business Private Limited has championed in Asansol, West Bengal since September 22, 2016—three botanicals stand unmatched for daily skin harmony: Aloe Vera (Kumari), Neem (Nimba), and Sacred Tulsi (Surasa). When skin is exposed to heat, humidity, sweat, friction, or seasonal dryness, it needs a cleanser that clarifies surface microbes without stripping the epidermal moisture barrier.</p><p>The Bhumivera Soothing Bar (100 GM · SKU: BV-LUX-ASOAP-05) brings this sacred Ayurvedic trio together in a handcrafted luxury bathing bar. Formulated with pure Aloe Vera inner-leaf fillet, clarifying Neem leaf extract, and antioxidant-rich Sacred Tulsi inside a mild, detergent-free Ayurvedic soap base, it leaves both face and body feeling calm, smooth, clarified, and naturally luminous.</p>\n\n  <h3>I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters</h3>\n  <p>Each botanical in the Bhumivera Soothing Bar performs a distinct, complementary biochemical role during bathing. Cold-filleted Aloe Vera (Aloe barbadensis Miller) supplies long-chain acemannan mucopolysaccharides that form a soothing, water-binding film over the stratum corneum, cooling heat-flushed skin and preventing post-bath tightness.</p><p>Simultaneously, Neem (Azadirachta indica, rich in nimbidin and quercetin limonoids) and Sacred Tulsi (Ocimum tenuiflorum, rich in eugenol, ursolic acid, and rosmarinic acid) purify pores and help maintain a balanced cutaneous microbiome—making this bar especially comforting during prickly summer heat, humid monsoons, and seasonal transitions.</p>\n  <p>For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque <code>&ldquo;Aqua / Base Q.S.&rdquo;</code> disclosure on the back—where high-value botanicals like <a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Himalayan Sea Buckthorn</a>, <a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Manjistha (Rubia cordifolia)</a>, <a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Haridra (Curcuma longa)</a>, <a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reetha (Sapindus mukorossi)</a>, and <a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Sacred Tulsi (Ocimum tenuiflorum)</a> are dusted in at trace levels below 0.01% and boiled at 80°C–100°C. <a href=\"https://bhumivera.com/science\">Bhumivera’s Sub-28°C Formulation Lab</a> eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Niacinamide Vitamin B3</a>, <a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Multi-Molecular Hyaluronic Acid</a>, and Plant-Derived Glycerin) at full, verifiable label potencies.</p>\n\n  <h4>Complete Active Ingredient &amp; Phytochemical Monograph Table (100 GM)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Disclosed Active &amp; INCI</th>\n          <th>Label Potency</th>\n          <th>Botanical / Chemical Class &amp; Reference</th>\n          <th>Extraction &amp; Harvest Corridor</th>\n          <th>Dermal / Trichological / Cellular Mechanism</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Aloevera (Aloe Vera)</strong><br/><small>Aloe barbadensis Miller Inner-Leaf Fillet Gel</small></td>\n          <td><strong>Primary Soothing Active</strong></td>\n          <td>Aloe barbadensis miller (<a href=\"https://en.wikipedia.org/wiki/Aloe_vera\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold Hand-Filleted Inner Mucilage (<28°C) · <a href=\"/provenance-engine\">REG-04 · Thar Edge Organic Belts, Rajasthan</a></td>\n          <td>Hydrates outer skin layers, cools heat and dryness, and imparts a smooth, dewy, glowing finish after bathing.</td>\n        </tr><tr>\n          <td><strong>Neem Extract</strong><br/><small>Azadirachta indica Leaf Extract</small></td>\n          <td><strong>Purifying Botanical Clarifier</strong></td>\n          <td>Azadirachta indica (<a href=\"https://en.wikipedia.org/wiki/Azadirachta_indica\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Leaf Infusion · <a href=\"/provenance-engine\">REG-05 · Central & Eastern India Botanical Cooperatives</a></td>\n          <td>Helps keep blemish-prone, heat-stressed, and monsoon-exposed skin clean, fresh, and clarified.</td>\n        </tr><tr>\n          <td><strong>Tulsi (Holy Basil)</strong><br/><small>Ocimum tenuiflorum Leaf Extract</small></td>\n          <td><strong>Adaptogenic Herbal Purifier</strong></td>\n          <td>Ocimum tenuiflorum (<a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sub-28°C Cold Herbal Infusion · <a href=\"/provenance-engine\">REG-05 · Vrindavan & Central India Tulsi Sanctuaries</a></td>\n          <td>Rich in natural eugenol and rosmarinic acid antioxidants that refresh pores, calm environmental stress, and support radiant skin.</td>\n        </tr><tr>\n          <td><strong>Ayurvedic Soap Base</strong><br/><small>Artisanal Vegetarian Glycerin-Retained Soap Base</small></td>\n          <td><strong>Q.S. (100 GM Bar)</strong></td>\n          <td>Gentle Artisanal Base (<a href=\"https://en.wikipedia.org/wiki/Ayurveda\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Small-Batch Cold-Molded Curing · <a href=\"/provenance-engine\">REG-06 · GMP Artisanal Soap Atelier</a></td>\n          <td>Crafted under strict quality control without harsh synthetic chemicals, SLS/SLES, or animal tallow.</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3>II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin))</h3>\n  <p>Unlike mass-market herbal soaps that use synthetic green dyes and harsh sodium tallowate or SLS detergents, the Bhumivera Soothing Bar is hand-poured in a 100% vegetarian Ayurvedic base that retains natural plant glycerin. It is featured in our Royal Skin & Scalp Stewardship Trio alongside the 4% Himalayan Sea Buckthorn Face Wash and Royal 2-in-1 Botanical Shampoo.</p><p>For an inside-out Tulsi ritual, pair your daily bath with the Bhumivera Soothing Bar alongside 3–4 internal drops of Bhumivera Kalpvriksh Satva Tulsi (7-Tulsi Liquid Extract) in warm water.</p>\n  <p>Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically <em>beta-glucocerebrosidase</em> and <em>acidic sphingomyelinase</em>—require an acidic microenvironment between <strong>pH 4.7 and 5.75</strong> to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating <strong>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)</strong> to <strong>Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)</strong> and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our <a href=\"/verify\">Bottle Serial &amp; COA Verification Portal</a> and <a href=\"/somatic-registry\">Somatic INCI Label Registry</a>), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it.</p>\n\n  <h3>III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule</h3>\n  <p>Moisten skin with lukewarm water, work the Bhumivera Soothing Bar into a rich, creamy lather between your palms, and massage gently over your face and body for 30 to 45 seconds before rinsing clean. Pat dry with a soft towel.</p>\n  <ul>\n    <li><strong>Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):</strong> Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer.</li>\n    <li><strong>Step 2 — Measured Dispensing &amp; Palmar Emulsification:</strong> Dispense the recommended dose of <strong>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)</strong> into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp.</li>\n    <li><strong>Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:</strong> Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives (<strong>Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Tulsi (Ocimum tenuiflorum), Pure Ayurvedic Soap Base</strong>) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates.</li>\n    <li><strong>Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:</strong> Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary <a href=\"/shop\">Bhumivera Inside-Out Ritual</a> formulations.</li>\n    <li><strong>Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:</strong> Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility (<a href=\"/lab\">read our full Cleanroom &amp; Patch-Test Protocol</a>).</li>\n  </ul>\n\n  <h3>IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter)</h3>\n  <p>During hot Indian summers and humid monsoons, Neem and Tulsi refresh sweat-prone skin and calm heat rashes. During dry autumns and winters, Aloe Vera's polysaccharide cushion keeps skin supple, smooth, and flake-free.</p>\n  <p>Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum. <strong>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)</strong> is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration.</p>\n\n  <h3>V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem</h3>\n  <p>Every formulation in the <a href=\"/shop\">Bhumivera 6-Product Flagship Catalog</a> is engineered to work as part of an interconnected, inside-out botanical system. Explore how <strong>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)</strong> pairs with our companion formulations:</p>\n  <ul>\n    <li><strong>1. <a href=\"/product/activated-charcoal-luxury-face-wash\">Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699)</a>:</strong> Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification.</li>\n    <li><strong>2. <a href=\"/product/himalayan-seabuckthorn-luxury-face-wash\">Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799)</a>:</strong> Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity.</li>\n    <li><strong>3. <a href=\"/product/luxury-2-in-1-botanical-shampoo-conditioner\">Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899)</a>:</strong> Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing.</li>\n    <li><strong>4. <a href=\"/product/artisanal-charcoal-handmade-soap\">Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399)</a>:</strong> Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification.</li>\n    <li><strong>5. <a href=\"/product/artisanal-aloe-vera-handmade-soap\">Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349)</a>:</strong> Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care.</li>\n    <li><strong>6. <a href=\"/product/kalpvriksh-satva-tulsi-7-tulsi-extract\">Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499)</a>:</strong> Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality.</li>\n  </ul>\n  <p>You can also acquire coordinated sets in our <a href=\"/combo/bundle-daily-regimen\">Grand Maison 4-Piece Daily Apothecary Bundle</a>, <a href=\"/combo/bundle-royal-crown-trio\">Royal Skin &amp; Scalp Stewardship Trio</a>, <a href=\"/combo/bundle-inside-out-ritual\">Inside-Out Skin-Clearing &amp; Cortisol Ritual</a>, or the collector’s <a href=\"/combo/bundle-grand-maison-vault\">Grand Maison 6-Piece Apothecary Vault</a>, or compare any two formulations side-by-side on our <a href=\"/compare\">Interactive Formulation Comparison Tool</a>.</p>\n\n  <h3>VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact</h3>\n  <p>Compounded in Batch #SANTS26I under strict cleanroom quality control, every 100 GM Bhumivera Soothing Bar upholds our 100% Virgin Sanitary Custody Standard.</p>\n  <p>Every unit of <strong>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)</strong> is traceable through our <a href=\"/provenance-engine\">6-Corridor Indian Botanical Provenance Engine</a> and protected by <a href=\"/purchase-protection\">Bhumivera White-Glove Purchase Protection</a>. To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard (<a href=\"/legal/shipping-hygiene\">Part II of the Bhumivera Legal Suite</a>) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch (<a href=\"/order-tracking\">track live AWB &amp; dispatch weight logs</a>). Furthermore, every order supports our verifiable community initiatives documented on the <a href=\"/impact\">Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact)</a>—including <a href=\"/impact/stray-animal-care\">The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative</a> and <a href=\"/impact/elderly-disabled-rations\">The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative</a> in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors (<a href=\"/impact/damodar-cleanup\">Damodar Riverbank Vetiver Cleanup</a>, <a href=\"/impact/jute-sapling-nursery\">Biodegradable Jute Sapling Nursery</a>, <a href=\"/impact/village-pukur-revival\">Village Pukur Pond Revival</a>, <a href=\"/impact/herbal-kitchen-gardens\">Medicinal Herbal Kitchen Gardens</a>, <a href=\"/impact/mandi-vermicomposting\">Mandi Waste Vermicomposting</a>, and <a href=\"/impact/coal-belt-microgrove\">Coal-Belt Native Micro-Grove</a>).</p>\n\n  <h4>Technical &amp; Regulatory Specification Summary (BV-LUX-ASOAP-05)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Specification Parameter</th>\n          <th>Verified Bhumivera Standard</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Brand Name</strong></td>\n          <td>Bhumivera (The Transparent Maison · Est. 2016 Lineage)</td>\n        </tr><tr>\n          <td><strong>Product Full Name</strong></td>\n          <td>Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)</td>\n        </tr><tr>\n          <td><strong>SKU Code</strong></td>\n          <td>BV-LUX-ASOAP-05</td>\n        </tr><tr>\n          <td><strong>MPN Code</strong></td>\n          <td>BVASOAP100GM</td>\n        </tr><tr>\n          <td><strong>GTIN 13 EAN</strong></td>\n          <td>8906182600056</td>\n        </tr><tr>\n          <td><strong>GST HSN Code</strong></td>\n          <td>30049011 (Ayurvedic & Botanical Preparations · 5% GST)</td>\n        </tr><tr>\n          <td><strong>Net Weight Metric</strong></td>\n          <td>100 GM (3.52 oz. Solid Artisanal Bar)</td>\n        </tr><tr>\n          <td><strong>Gross Dispatch Weight</strong></td>\n          <td>134.5 Grams (±0.5g Digital Scale Verified)</td>\n        </tr><tr>\n          <td><strong>Batch Number</strong></td>\n          <td>SANTS26I (Handcrafted Quality-Controlled Batch)</td>\n        </tr><tr>\n          <td><strong>Manufacturing Date</strong></td>\n          <td>2026-09-01 (24-Month Shelf Life)</td>\n        </tr><tr>\n          <td><strong>Formulation Standard</strong></td>\n          <td>Gentle Ayurvedic Soothing Bar (Zero Harsh Synthetic Detergents)</td>\n        </tr><tr>\n          <td><strong>Primary Soothing Active</strong></td>\n          <td>Pure Aloe Vera (Aloe barbadensis Miller) Inner-Leaf Fillet Gel</td>\n        </tr><tr>\n          <td><strong>Primary Clarifying Actives</strong></td>\n          <td>Neem (Azadirachta indica) + Sacred Tulsi (Ocimum tenuiflorum)</td>\n        </tr><tr>\n          <td><strong>Cleansing Base Type</strong></td>\n          <td>100% Vegetarian Ayurvedic Soap Base with Retained Natural Glycerin</td>\n        </tr><tr>\n          <td><strong>Free From Guarantee</strong></td>\n          <td>0% SLS/SLES, 0% Parabens, 0% Animal Fat/Tallow, 0% Harsh Detergents</td>\n        </tr><tr>\n          <td><strong>Target Skin Profiles</strong></td>\n          <td>Sensitive, Delicate, Blemish-Prone, Dry, Normal & Combination Skin</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</article>",
    "description": "The Classic Trinity of Ayurveda: Handmade Aloe Vera, Neem & Sacred Tulsi Soothing Bar for Glowing, Clear Skin \n    Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap) (100 GM · SKU: BV-LUX-ASOAP-05)  is a flagship formulation from   Bhumivera — The Transparent Maison   ( Bhumivera Organics India Private Limited , incorporated August 4, 2026 under Founder  Akash Prasad  and Directors  Akash Prasad, Payal Prasad &amp; Aman Prasad ), rooted in the 10-year herbal manufacturing and household distribution heritage of   MPG E-Business Private Limited   (established September 22, 2016 in Asansol, West Bengal · CIN:  U74999WB2016PTC217735  · Founder:  Dilip Prasad Nonia ). Engineered under  The Bhumivera Transparency Standard (Est. 2016 lineage) , this formulation prints 100% of its functional active concentrations openly on the physical bottle label:  Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Tulsi (Ocimum tenuiflorum), Pure Ayurvedic Soap Base , calibrated to  Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin) . \n   In classical Indian household wellness—a tradition our parent heritage enterprise MPG E-Business Private Limited has championed in Asansol, West Bengal since September 22, 2016—three botanicals stand unmatched for daily skin harmony: Aloe Vera (Kumari), Neem (Nimba), and Sacred Tulsi (Surasa). When skin is exposed to heat, humidity, sweat, friction, or seasonal dryness, it needs a cleanser that clarifies surface microbes without stripping the epidermal moisture barrier.  The Bhumivera Soothing Bar (100 GM · SKU: BV-LUX-ASOAP-05) brings this sacred Ayurvedic trio together in a handcrafted luxury bathing bar. Formulated with pure Aloe Vera inner-leaf fillet, clarifying Neem leaf extract, and antioxidant-rich Sacred Tulsi inside a mild, detergent-free Ayurvedic soap base, it leaves both face and body feeling calm, smooth, clarified, and naturally luminous. \n\n   I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters \n   Each botanical in the Bhumivera Soothing Bar performs a distinct, complementary biochemical role during bathing. Cold-filleted Aloe Vera (Aloe barbadensis Miller) supplies long-chain acemannan mucopolysaccharides that form a soothing, water-binding film over the stratum corneum, cooling heat-flushed skin and preventing post-bath tightness.  Simultaneously, Neem (Azadirachta indica, rich in nimbidin and quercetin limonoids) and Sacred Tulsi (Ocimum tenuiflorum, rich in eugenol, ursolic acid, and rosmarinic acid) purify pores and help maintain a balanced cutaneous microbiome—making this bar especially comforting during prickly summer heat, humid monsoons, and seasonal transitions. \n   For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque  &ldquo;Aqua / Base Q.S.&rdquo;  disclosure on the back—where high-value botanicals like  Himalayan Sea Buckthorn ,  Manjistha (Rubia cordifolia) ,  Haridra (Curcuma longa) ,  Reetha (Sapindus mukorossi) , and  Sacred Tulsi (Ocimum tenuiflorum)  are dusted in at trace levels below 0.01% and boiled at 80°C–100°C.  Bhumivera’s Sub-28°C Formulation Lab  eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants ( Niacinamide Vitamin B3 ,  Multi-Molecular Hyaluronic Acid , and Plant-Derived Glycerin) at full, verifiable label potencies. \n\n   Complete Active Ingredient &amp; Phytochemical Monograph Table (100 GM) \n   \n     \n       \n         \n           Disclosed Active &amp; INCI \n           Label Potency \n           Botanical / Chemical Class &amp; Reference \n           Extraction &amp; Harvest Corridor \n           Dermal / Trichological / Cellular Mechanism \n         \n       \n       \n         \n            Aloevera (Aloe Vera)   Aloe barbadensis Miller Inner-Leaf Fillet Gel  \n            Primary Soothing Active  \n           Aloe barbadensis miller ( Reference ↗ ) \n           Cold Hand-Filleted Inner Mucilage ( REG-04 · Thar Edge Organic Belts, Rajasthan  \n           Hydrates outer skin layers, cools heat and dryness, and imparts a smooth, dewy, glowing finish after bathing. \n          \n            Neem Extract   Azadirachta indica Leaf Extract  \n            Purifying Botanical Clarifier  \n           Azadirachta indica ( Reference ↗ ) \n           Sub-28°C Cold Leaf Infusion ·  REG-05 · Central & Eastern India Botanical Cooperatives  \n           Helps keep blemish-prone, heat-stressed, and monsoon-exposed skin clean, fresh, and clarified. \n          \n            Tulsi (Holy Basil)   Ocimum tenuiflorum Leaf Extract  \n            Adaptogenic Herbal Purifier  \n           Ocimum tenuiflorum ( Reference ↗ ) \n           Sub-28°C Cold Herbal Infusion ·  REG-05 · Vrindavan & Central India Tulsi Sanctuaries  \n           Rich in natural eugenol and rosmarinic acid antioxidants that refresh pores, calm environmental stress, and support radiant skin. \n          \n            Ayurvedic Soap Base   Artisanal Vegetarian Glycerin-Retained Soap Base  \n            Q.S. (100 GM Bar)  \n           Gentle Artisanal Base ( Reference ↗ ) \n           Small-Batch Cold-Molded Curing ·  REG-06 · GMP Artisanal Soap Atelier  \n           Crafted under strict quality control without harsh synthetic chemicals, SLS/SLES, or animal tallow. \n         \n       \n     \n   \n\n   II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)) \n   Unlike mass-market herbal soaps that use synthetic green dyes and harsh sodium tallowate or SLS detergents, the Bhumivera Soothing Bar is hand-poured in a 100% vegetarian Ayurvedic base that retains natural plant glycerin. It is featured in our Royal Skin & Scalp Stewardship Trio alongside the 4% Himalayan Sea Buckthorn Face Wash and Royal 2-in-1 Botanical Shampoo.  For an inside-out Tulsi ritual, pair your daily bath with the Bhumivera Soothing Bar alongside 3–4 internal drops of Bhumivera Kalpvriksh Satva Tulsi (7-Tulsi Liquid Extract) in warm water. \n   Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically  beta-glucocerebrosidase  and  acidic sphingomyelinase —require an acidic microenvironment between  pH 4.7 and 5.75  to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating  Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)  to  Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)  and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our  Bottle Serial &amp; COA Verification Portal  and  Somatic INCI Label Registry ), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it. \n\n   III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule \n   Moisten skin with lukewarm water, work the Bhumivera Soothing Bar into a rich, creamy lather between your palms, and massage gently over your face and body for 30 to 45 seconds before rinsing clean. Pat dry with a soft towel. \n   \n      Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):  Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer. \n      Step 2 — Measured Dispensing &amp; Palmar Emulsification:  Dispense the recommended dose of  Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)  into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp. \n      Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:  Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives ( Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Tulsi (Ocimum tenuiflorum), Pure Ayurvedic Soap Base ) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates. \n      Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:  Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary  Bhumivera Inside-Out Ritual  formulations. \n      Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:  Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility ( read our full Cleanroom &amp; Patch-Test Protocol ). \n   \n\n   IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter) \n   During hot Indian summers and humid monsoons, Neem and Tulsi refresh sweat-prone skin and calm heat rashes. During dry autumns and winters, Aloe Vera's polysaccharide cushion keeps skin supple, smooth, and flake-free. \n   Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum.  Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)  is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration. \n\n   V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem \n   Every formulation in the  Bhumivera 6-Product Flagship Catalog  is engineered to work as part of an interconnected, inside-out botanical system. Explore how  Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)  pairs with our companion formulations: \n   \n      1.  Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699) :  Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification. \n      2.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799) :  Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity. \n      3.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899) :  Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing. \n      4.  Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399) :  Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification. \n      5.  Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349) :  Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care. \n      6.  Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499) :  Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality. \n   \n   You can also acquire coordinated sets in our  Grand Maison 4-Piece Daily Apothecary Bundle ,  Royal Skin &amp; Scalp Stewardship Trio ,  Inside-Out Skin-Clearing &amp; Cortisol Ritual , or the collector’s  Grand Maison 6-Piece Apothecary Vault , or compare any two formulations side-by-side on our  Interactive Formulation Comparison Tool . \n\n   VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact \n   Compounded in Batch #SANTS26I under strict cleanroom quality control, every 100 GM Bhumivera Soothing Bar upholds our 100% Virgin Sanitary Custody Standard. \n   Every unit of  Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)  is traceable through our  6-Corridor Indian Botanical Provenance Engine  and protected by  Bhumivera White-Glove Purchase Protection . To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard ( Part II of the Bhumivera Legal Suite ) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch ( track live AWB &amp; dispatch weight logs ). Furthermore, every order supports our verifiable community initiatives documented on the  Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact) —including  The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative  and  The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative  in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors ( Damodar Riverbank Vetiver Cleanup ,  Biodegradable Jute Sapling Nursery ,  Village Pukur Pond Revival ,  Medicinal Herbal Kitchen Gardens ,  Mandi Waste Vermicomposting , and  Coal-Belt Native Micro-Grove ). \n\n   Technical &amp; Regulatory Specification Summary (BV-LUX-ASOAP-05) \n   \n     \n       \n         \n           Specification Parameter \n           Verified Bhumivera Standard \n         \n       \n       \n         \n            Brand Name  \n           Bhumivera (The Transparent Maison · Est. 2016 Lineage) \n          \n            Product Full Name  \n           Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap) \n          \n            SKU Code  \n           BV-LUX-ASOAP-05 \n          \n            MPN Code  \n           BVASOAP100GM \n          \n            GTIN 13 EAN  \n           8906182600056 \n          \n            GST HSN Code  \n           30049011 (Ayurvedic & Botanical Preparations · 5% GST) \n          \n            Net Weight Metric  \n           100 GM (3.52 oz. Solid Artisanal Bar) \n          \n            Gross Dispatch Weight  \n           134.5 Grams (±0.5g Digital Scale Verified) \n          \n            Batch Number  \n           SANTS26I (Handcrafted Quality-Controlled Batch) \n          \n            Manufacturing Date  \n           2026-09-01 (24-Month Shelf Life) \n          \n            Formulation Standard  \n           Gentle Ayurvedic Soothing Bar (Zero Harsh Synthetic Detergents) \n          \n            Primary Soothing Active  \n           Pure Aloe Vera (Aloe barbadensis Miller) Inner-Leaf Fillet Gel \n          \n            Primary Clarifying Actives  \n           Neem (Azadirachta indica) + Sacred Tulsi (Ocimum tenuiflorum) \n          \n            Cleansing Base Type  \n           100% Vegetarian Ayurvedic Soap Base with Retained Natural Glycerin \n          \n            Free From Guarantee  \n           0% SLS/SLES, 0% Parabens, 0% Animal Fat/Tallow, 0% Harsh Detergents \n          \n            Target Skin Profiles  \n           Sensitive, Delicate, Blemish-Prone, Dry, Normal & Combination Skin",
    "editorial_heading": "The Classic Trinity of Ayurveda: Handmade Aloe Vera, Neem & Sacred Tulsi Soothing Bar for Glowing, Clear Skin",
    "editorial_paragraphs": [
      "In classical Indian household wellness—a tradition our parent heritage enterprise MPG E-Business Private Limited has championed in Asansol, West Bengal since September 22, 2016—three botanicals stand unmatched for daily skin harmony: Aloe Vera (Kumari), Neem (Nimba), and Sacred Tulsi (Surasa). When skin is exposed to heat, humidity, sweat, friction, or seasonal dryness, it needs a cleanser that clarifies surface microbes without stripping the epidermal moisture barrier.",
      "The Bhumivera Soothing Bar (100 GM · SKU: BV-LUX-ASOAP-05) brings this sacred Ayurvedic trio together in a handcrafted luxury bathing bar. Formulated with pure Aloe Vera inner-leaf fillet, clarifying Neem leaf extract, and antioxidant-rich Sacred Tulsi inside a mild, detergent-free Ayurvedic soap base, it leaves both face and body feeling calm, smooth, clarified, and naturally luminous.",
      "Each botanical in the Bhumivera Soothing Bar performs a distinct, complementary biochemical role during bathing. Cold-filleted Aloe Vera (Aloe barbadensis Miller) supplies long-chain acemannan mucopolysaccharides that form a soothing, water-binding film over the stratum corneum, cooling heat-flushed skin and preventing post-bath tightness.",
      "Simultaneously, Neem (Azadirachta indica, rich in nimbidin and quercetin limonoids) and Sacred Tulsi (Ocimum tenuiflorum, rich in eugenol, ursolic acid, and rosmarinic acid) purify pores and help maintain a balanced cutaneous microbiome—making this bar especially comforting during prickly summer heat, humid monsoons, and seasonal transitions.",
      "Unlike mass-market herbal soaps that use synthetic green dyes and harsh sodium tallowate or SLS detergents, the Bhumivera Soothing Bar is hand-poured in a 100% vegetarian Ayurvedic base that retains natural plant glycerin. It is featured in our Royal Skin & Scalp Stewardship Trio alongside the 4% Himalayan Sea Buckthorn Face Wash and Royal 2-in-1 Botanical Shampoo.",
      "For an inside-out Tulsi ritual, pair your daily bath with the Bhumivera Soothing Bar alongside 3–4 internal drops of Bhumivera Kalpvriksh Satva Tulsi (7-Tulsi Liquid Extract) in warm water."
    ],
    "exactCompositionTable": [
      {
        "active": "Aloevera (Aloe Vera)",
        "ingredient": "Aloevera (Aloe Vera)",
        "potency": "Primary Soothing Active",
        "concentration": "Primary Soothing Active",
        "classification": "Aloe barbadensis miller",
        "botanical": "Aloe barbadensis miller",
        "inci": "",
        "molecular_markers": "Acemannan Polysaccharides, Amino Acids, Vitamins A/C/E & Plant Sterols",
        "extraction_method": "Cold Hand-Filleted Inner Mucilage (<28°C)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)",
        "mechanism": "Hydrates outer skin layers, cools heat and dryness, and imparts a smooth, dewy, glowing finish after bathing.",
        "role": "Hydrates outer skin layers, cools heat and dryness, and imparts a smooth, dewy, glowing finish after bathing.",
        "synergy_partners": "Neem Extract + Sacred Tulsi",
        "reference_url": "https://en.wikipedia.org/wiki/Aloe_vera"
      },
      {
        "active": "Neem Extract",
        "ingredient": "Neem Extract",
        "potency": "Purifying Botanical Clarifier",
        "concentration": "Purifying Botanical Clarifier",
        "classification": "Azadirachta indica",
        "botanical": "Azadirachta indica",
        "inci": "",
        "molecular_markers": "Nimbidin, Nimbin, Quercetin & Limonoids",
        "extraction_method": "Sub-28°C Cold Leaf Infusion",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)",
        "mechanism": "Helps keep blemish-prone, heat-stressed, and monsoon-exposed skin clean, fresh, and clarified.",
        "role": "Helps keep blemish-prone, heat-stressed, and monsoon-exposed skin clean, fresh, and clarified.",
        "synergy_partners": "Sacred Tulsi + Aloe Vera",
        "reference_url": "https://en.wikipedia.org/wiki/Azadirachta_indica"
      },
      {
        "active": "Tulsi (Holy Basil)",
        "ingredient": "Tulsi (Holy Basil)",
        "potency": "Adaptogenic Herbal Purifier",
        "concentration": "Adaptogenic Herbal Purifier",
        "classification": "Ocimum tenuiflorum",
        "botanical": "Ocimum tenuiflorum",
        "inci": "",
        "molecular_markers": "Eugenol, Rosmarinic Acid, Ursolic Acid & Carvacrol",
        "extraction_method": "Sub-28°C Cold Herbal Infusion",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)",
        "mechanism": "Rich in natural eugenol and rosmarinic acid antioxidants that refresh pores, calm environmental stress, and support radiant skin.",
        "role": "Rich in natural eugenol and rosmarinic acid antioxidants that refresh pores, calm environmental stress, and support radiant skin.",
        "synergy_partners": "Neem Extract + Aloe Vera",
        "reference_url": "https://en.wikipedia.org/wiki/Ocimum_tenuiflorum"
      },
      {
        "active": "Ayurvedic Soap Base",
        "ingredient": "Ayurvedic Soap Base",
        "potency": "Q.S. (100 GM Bar)",
        "concentration": "Q.S. (100 GM Bar)",
        "classification": "Gentle Artisanal Base",
        "botanical": "Gentle Artisanal Base",
        "inci": "",
        "molecular_markers": "Plant-Derived Fatty Acid Salts & Natural Glycerin",
        "extraction_method": "Small-Batch Cold-Molded Curing",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "Gentle Ayurvedic Soothing Bar (Suitable for Delicate & Sensitive Skin)",
        "mechanism": "Crafted under strict quality control without harsh synthetic chemicals, SLS/SLES, or animal tallow.",
        "role": "Crafted under strict quality control without harsh synthetic chemicals, SLS/SLES, or animal tallow.",
        "synergy_partners": "Aloe Vera + Neem + Tulsi",
        "reference_url": "https://en.wikipedia.org/wiki/Ayurveda"
      }
    ],
    "directAnswerFaqs": [
      {
        "q": "What makes Bhumivera Soothing Bar ideal for glowing and blemish-prone skin?",
        "a": "Unlike ordinary soaps that strip skin moisture, Bhumivera Soothing Bar pairs hydrating Aloe Vera with purifying Neem and antioxidant Tulsi in a gentle Ayurvedic soap base—clarifying pores while keeping skin soft and luminous."
      },
      {
        "q": "Can Bhumivera Aloe Vera, Neem & Tulsi Soothing Bar be used on sensitive skin?",
        "a": "Yes. It is crafted under strict quality control without harsh synthetic detergents. We recommend a standard 24-hour inner-forearm patch test before first use."
      },
      {
        "q": "What are the exact ingredients in the Bhumivera Soothing Bar?",
        "a": "It is formulated with Aloevera (Aloe barbadensis), Neem (Azadirachta indica), Sacred Tulsi (Ocimum tenuiflorum), and a pure vegetarian Ayurvedic Soap Base in a 100 GM handmade bar."
      },
      {
        "q": "Can I use the Soothing Bar for daily facial and body washing?",
        "a": "Yes. Its mild, detergent-free Ayurvedic base and high Aloe Vera content make it gentle enough for both face and full-body daily bathing."
      },
      {
        "q": "How does Neem and Tulsi help skin during summer and monsoon seasons?",
        "a": "Neem (nimbidin) and Tulsi (eugenol and rosmarinic acid) naturally clarify sweat, humidity-induced oiliness, and surface grime while Aloe Vera cools heat-flushed skin."
      },
      {
        "q": "Does Bhumivera Soothing Bar contain animal fat or SLS?",
        "a": "No. It is 100% vegetarian, cruelty-free, and formulated without SLS/SLES sulfates, parabens, or harsh synthetic detergents."
      },
      {
        "q": "Which Bhumivera handmade soap should I pick: Soothing Bar or Charcoal Deep Cleansing Bar?",
        "a": "Pick the Soothing Bar (Aloe, Neem & Tulsi · ₹349) if you want calming hydration and gentle herbal clarity for sensitive or blemish-prone skin; pick the Charcoal Deep Cleansing Bar (Charcoal & Aloe · ₹399) if you want deep carbon adsorption for heavy sweat and oily skin."
      },
      {
        "q": "Which bundle includes the Bhumivera Soothing Bar?",
        "a": "It is included in The Royal Skin & Scalp Stewardship Trio (/combo/bundle-royal-crown-trio) and The Grand Maison 6-Piece Apothecary Vault (/combo/bundle-grand-maison-vault)."
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
    "rating": 4.7,
    "review_count": 275,
    "reviews": 275,
    "legacySlugs": [
      "bhumivera-copper-distilled-tulsi-rose-hydrosol",
      "kalpvriksh-satva-tulsi",
      "bhumivera-tulsi-drops",
      "7-tulsi-drops",
      "seven-tulsi-drops",
      "panch-tulsi-drops"
    ],
    "sku": "BV-LUX-TULSI-06",
    "legacySkus": [
      "BV-TRHM-100ML"
    ],
    "mpn": "BVTULSI30ML",
    "gtin13": "8906182600063",
    "net_volume": "30 ML",
    "price": 499.0,
    "discountPrice": 499.0,
    "mrp": 649.0,
    "stock": 300,
    "quantity": 300,
    "gst_hsn_code": "20099000",
    "gst_rate": 5.0,
    "cost_price": 40.0,
    "batch_no": "SPTD26I",
    "mfg_date": "2026-09-01",
    "manufacturer_name": "Sitashi Herbal Industry",
    "manufacturer_address": "H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022, Rajasthan",
    "manufacturer_gstin": "08AEQFS1102P1ZM",
    "manufacturer_fssai": "12222999000145",
    "category": "Luxury Ayurvedic Wellness & Immunity Drops",
    "ph_level": "90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)",
    "active_ingredients": "Each 10ml contains 9.0ml Mix Blend of Seven Tulsi: Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, Lemon Tulsi; Excipient Q.S.",
    "image_url": "/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp",
    "image": "/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp",
    "additionalImages": [
      "/assets/images/tulsi.webp",
      "/assets/images/Promo5.webp"
    ],
    "seo_title": "Bhumivera Kalpvriksh Satva Tulsi Drops (30 ML) | Concentrated Liquid Extract of 7 Types of Tulsi (9.0ml per 10ml)",
    "meta_description": "Shop Bhumivera Kalpvriksh Satva Tulsi (30 ML): concentrated Ayurvedic wellness drops containing 9.0ml per 10ml liquid extract of 7 Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi).",
    "short_description": "The Ingestible Skin-Clearing & Cortisol Adaptogen in the Bhumivera Unified Inside-Out Botanical Ritual. Each 10ml of Bhumivera Kalpvriksh Satva Tulsi contains 9.0ml concentrated liquid extract of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi) to calm cortisol-induced skin stress, support gut-skin clarity, and provide daily antioxidant vitality.",
    "search_keywords": "bhumivera kalpvriksh satva tulsi, bhumivera tulsi drops, kalpvriksh satva tulsi drops, 7 tulsi liquid extract drops India, seven tulsi ark immunity wellness drops, panchtulsi vs 7 tulsi drops bhumivera, gut skin cortisol adaptogen drops, bhumivera.com",
    "conscious_buyer_highlights": [
      "7 Distinct Tulsi Varieties (Beyond Standard 5-Herb Panch Tulsi): Unites Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, and Lemon Tulsi.",
      "90% Label-Verified Concentration: Each 10ml contains 9.0ml of pure Seven-Tulsi liquid phyto-extract.",
      "Inside-Out Gut-Skin & Cortisol Adaptogen: Rich in natural eugenol, rosmarinic acid, and ursolic acid to support internal antioxidant vitality and seasonal respiratory comfort.",
      "Effortless Daily Ritual: Just 3–4 drops in a glass of warm water, herbal tea, or milk twice daily (approx. 150–200 servings per 30 ML dropper bottle)."
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
      },
      {
        "name": "Rosmarinic acid",
        "url": "https://en.wikipedia.org/wiki/Rosmarinic_acid"
      },
      {
        "name": "Ursolic acid",
        "url": "https://en.wikipedia.org/wiki/Ursolic_acid"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Seven-Tulsi Concentrated Blend (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi)",
        "inci_name": "Ocimum gratissimum, Ocimum basilicum, Origanum majorana/Ocimum, Ocimum tenuiflorum (Kala & Rama), Ocimum × africanum Distillate",
        "concentration": "9.0 ml (per 10 ml)",
        "botanical": "Ocimum Spectrum Phyto-Extract (90% Potency)",
        "molecular_markers": "Eugenol, Methyl Eugenol, Rosmarinic Acid, Ursolic Acid, Carvacrol, Linalool & Citral",
        "extraction_method": "Cold-Hydro-Distilled Phyto-Essence (24.9°C Verified)",
        "origin_corridor": "REG-05 · Vrindavan & Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026",
        "ph_stability_window": "90% Concentrated Botanical Distillate",
        "role": "Provides 90% active tulsi extract rich in natural eugenol, ursolic acid, and rosmarinic acid to support daily wellness, seasonal comfort, gut-skin clarity, and antioxidant vitality.",
        "synergy_partners": "Pairs internally with topical Sea Buckthorn & Charcoal Face Washes",
        "reference_url": "https://en.wikipedia.org/wiki/Ocimum_tenuiflorum",
        "related_products": [
          {
            "name": "Soothing Bar (Aloe, Neem & Tulsi)",
            "slug": "artisanal-aloe-vera-handmade-soap"
          }
        ]
      },
      {
        "ingredient": "Excipient Base",
        "inci_name": "Food-Grade Solubilizing Botanical Carrier",
        "concentration": "Q.S. (1.0 ml per 10 ml)",
        "botanical": "Food-Grade Carrier",
        "molecular_markers": "Micro-Dispersible Hydro-Botanical Suspension",
        "extraction_method": "Sterile Food-Grade Blending (FSSAI: 12222999000145)",
        "origin_corridor": "REG-06 · Hygienic Bottling Cleanroom",
        "ph_stability_window": "Stable Dispersion in Warm Water, Tea, or Milk",
        "role": "Stabilizes volatile botanical essential oils for instant, uniform dispersion in warm water, tea, or milk.",
        "synergy_partners": "9.0 ml Seven-Tulsi Blend",
        "reference_url": "https://en.wikipedia.org/wiki/Eugenol",
        "related_products": []
      },
      {
        "ingredient": "Nutritional Profile (Per 100ml Approx.)",
        "inci_name": "Energy 80 Kcal | Carbohydrate 2.0g | Protein 0.0g | Essential Botanical Lipids 8.0g",
        "concentration": "80 Kcal | 2g Carb | 8g Essential Lipids",
        "botanical": "Label Nutritional Value",
        "molecular_markers": "Zero Added Sugar · Zero Synthetic Colors · Zero Alcohol",
        "extraction_method": "Verified Nutritional Assay per 100ml",
        "origin_corridor": "FSSAI Licensed Facility (12222999000145)",
        "ph_stability_window": "Consume Within 30 Days of Opening",
        "role": "0.0g protein; concentrated botanical phytonutrient profile delivering pure volatile essential lipids.",
        "synergy_partners": "Daily Warm Water / Herbal Tea Ritual",
        "reference_url": "https://en.wikipedia.org/wiki/Rosmarinic_acid",
        "related_products": []
      }
    ],
    "specifications": {
      "Brand_Name": "Bhumivera (The Transparent Maison · Est. 2016 Lineage)",
      "Product_Full_Name": "Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)",
      "SKU_Code": "BV-LUX-TULSI-06 (Legacy: BV-TRHM-100ML)",
      "MPN_Code": "BVTULSI30ML",
      "GTIN_13_EAN": "8906182600063",
      "GST_HSN_Code": "20099000 (Botanical & Herbal Extracts · 5% GST)",
      "FSSAI_License_Number": "12222999000145 (Food-Grade Botanical Purity Standard)",
      "Net_Volume_Metric": "30 ML (1.01 fl. oz. Precision Dropper Bottle)",
      "Gross_Dispatch_Weight": "98.5 Grams (±0.5g Digital Scale Verified)",
      "Batch_Number": "SPTD26I / BATCH-04/26-TL (250 Units per Micro-Batch)",
      "Manufacturing_Date": "2026-09-01 (Consume within 30 days of opening bottle)",
      "Active_Potency_Ratio": "9.0 ML Seven-Tulsi Extract per 10 ML (90.0% Active Concentration)",
      "Seven_Tulsi_Varieties": "1. Van, 2. Sweet, 3. Marua, 4. Bisva, 5. Kala (Krishna), 6. Rama, 7. Lemon Tulsi",
      "Key_Phytochemicals": "Eugenol, Rosmarinic Acid, Ursolic Acid, Carvacrol, Linalool & Citral",
      "Extraction_Temperature": "< 28.0°C (24.9°C Cold-Hydro-Distilled Phyto-Essence)",
      "Nutritional_Energy_Per_100ml": "80 Kcal | Carbohydrate: 2.0 gm | Protein: 0.0 gm | Essential Oils/Fat: 8.0 gm",
      "Free_From_Guarantee": "0% Alcohol, 0% Added Sugar, 0% Synthetic Flavors, 0% Artificial Colors",
      "Primary_Wellness_Goals": "Inside-Out Gut-Skin-Cortisol Balance, Seasonal Immunity & Respiratory Comfort",
      "Recommended_Dosage": "3 to 4 Drops in a Glass of Warm Water, Tea, or Milk Twice Daily",
      "Servings_Per_Container": "Approx. 150 to 200 Daily Wellness Servings per 30 ML Bottle",
      "Primary_Vessel_Material": "UV-Amber Apothecary Bottle with Tamper-Evident Precision Dropper Seal",
      "Microbiological_Purity": "Food-Grade Botanical Purity · Zero Synthetic Solvents",
      "Heavy_Metals_ICP_MS": "Lead ND · Arsenic ND · Cadmium ND · Mercury ND (ICP-MS Verified)",
      "Harvest_Origin_Lot": "Vrindavan & Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026",
      "Brand_Flagship_Entity": "Bhumivera Organics India Private Limited (Inc. August 4, 2026 · Asansol, WB)",
      "Parent_Heritage_Entity": "MPG E-Business Private Limited (Inc. Sept 22, 2016 · CIN: U74999WB2016PTC217735)",
      "Licensed_Manufacturing_Unit": "Sitashi Herbal Industry, H-1034, 3rd Phase, Sitapura Industrial Area, Jaipur 302022",
      "Country_Of_Origin": "Proudly Formulated & Manufactured in India (Bharat)"
    },
    "hero_heading": "The Concentrated Nectar of Seven Sacred Tulsi Varieties (90% Potency · 9.0ml per 10ml): Inside-Out Skin & Wellness Adaptogen",
    "intro_paragraphs": [
      "True skin luminosity and systemic vitality are governed not only by what we apply topically to the stratum corneum, but also by the internal gut-skin-cortisol axis. Chronic psychological stress, seasonal weather shifts, and urban oxidative load elevate circulating cortisol levels—triggering sebaceous gland hyperactivity, barrier inflammation, and dullness from within.",
      "While standard market 'Panch Tulsi' drops combine only five varieties of basil, Bhumivera Kalpvriksh Satva Tulsi (30 ML · SKU: BV-LUX-TULSI-06) delivers the concentrated liquid extract of 7 distinct types of Tulsi—Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala (Krishna) Tulsi, Rama Tulsi, and Lemon Tulsi—at a label-disclosed potency of 9.0 ml active extract per 10 ml (90% concentration)."
    ],
    "science_paragraphs": [
      "Why unite seven distinct Ocimum chemotypes rather than one or five? Each Tulsi variety biosynthesizes a specialized ratio of volatile phenylpropanoids, monoterpenes, and triterpenoids. Kala (Krishna) and Rama Tulsi (Ocimum tenuiflorum) are rich in eugenol, rosmarinic acid, and ursolic acid—potent adaptogenic polyphenols that modulate oxidative stress. Van Tulsi (Ocimum gratissimum) contributes thymol and eugenol for seasonal respiratory comfort; Sweet Tulsi (Ocimum basilicum) provides linalool; Lemon Tulsi (Ocimum × africanum) delivers uplifting citral; and Marua and Bisva Tulsi round out the digestive and soothing phytonutrient spectrum.",
      "Extracted via cold-hydro-distillation at 24.9°C (Batch #SPTD26I · Sample COA Serial: BHMV-2610-TL019) under FSSAI license 12222999000145, every 100ml provides 8.0 grams of pure essential botanical lipids, 2.0 grams of carbohydrate, 0.0 grams of protein, and 80 Kcal of phytonutrient energy with zero synthetic solvents."
    ],
    "synergy_paragraphs": [
      "Within the Bhumivera apothecary ecosystem, Kalpvriksh Satva Tulsi serves as the internal cornerstone of our Inside-Out Botanical Ritual. When you pair 3–4 drops of Kalpvriksh Satva Tulsi in warm morning and evening water alongside topical cleansing with the Bhumivera 4% Himalayan Sea Buckthorn Face Wash or 3% Activated Charcoal Face Wash, you address both external urban pollution and internal oxidative stress simultaneously.",
      "It is featured in both The Grand Maison 4-Piece Daily Apothecary Bundle (/combo/bundle-daily-regimen) and The Inside-Out Skin-Clearing & Cortisol Ritual Bundle (/combo/bundle-inside-out-ritual)."
    ],
    "ritual_paragraphs": [
      "Add 3 to 4 drops of Bhumivera Kalpvriksh Satva Tulsi into a glass (150–200 ml) of lukewarm water, herbal tea, or warm milk twice daily—once in the morning before breakfast and once in the evening—or as directed by a wellness professional. Because it is a 90% concentrated extract (9.0 ml per 10 ml), never consume undiluted drops directly on the tongue. Consume the contents within 30 days of opening the bottle."
    ],
    "climate_paragraphs": [
      "Particularly valuable during seasonal transitions (monsoon-to-autumn and autumn-to-winter), high-pollution winter smog months, and periods of intense work or travel stress across India."
    ],
    "provenance_paragraphs": [
      "Sourced from Vrindavan and Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026 and verified via ICP-MS for non-detected Lead, Arsenic, Cadmium, and Mercury."
    ],
    "faqs": [
      {
        "q": "How is Bhumivera Kalpvriksh Satva Tulsi different from regular Panch Tulsi drops?",
        "a": "Regular Panch Tulsi products use 5 types of tulsi. Bhumivera Kalpvriksh Satva Tulsi combines 7 distinct varieties—Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, and Lemon Tulsi—at a label-disclosed concentration of 9.0ml per 10ml (90% active potency)."
      },
      {
        "q": "How should I take Kalpvriksh Satva Tulsi drops daily?",
        "a": "Add 3 to 4 drops into a glass of warm water, tea, or milk twice daily. Because it is a concentrated 90% botanical extract (9.0ml per 10ml), 3–4 drops are sufficient for a daily wellness serving."
      },
      {
        "q": "What are the 7 types of Tulsi in Bhumivera Kalpvriksh Satva Tulsi?",
        "a": "Each 10ml contains 9.0ml Mix Blend of: 1) Van Tulsi, 2) Sweet Tulsi, 3) Marua Tulsi, 4) Bisva Tulsi, 5) Kala Tulsi, 6) Rama Tulsi, and 7) Lemon Tulsi, with Excipient Q.S."
      },
      {
        "q": "What is the nutritional value of Kalpvriksh Satva Tulsi per 100ml?",
        "a": "Per 100ml (approx.): Energy 80 Kcal, Carbohydrate 2.0 gm, Protein 0.0 gm, and Fat (Essential Botanical Oils) 8.0 gm."
      },
      {
        "q": "How does Kalpvriksh Satva Tulsi support clear, glowing skin from within?",
        "a": "Tulsi is rich in adaptogenic eugenol, rosmarinic acid, and ursolic acid, which help calm internal oxidative and cortisol stress along the gut-skin axis—complementing topical skincare with our Sea Buckthorn and Charcoal Face Washes."
      },
      {
        "q": "How long does one 30 ML bottle last, and what is its shelf window after opening?",
        "a": "At 3–4 drops twice daily, a 30 ML bottle provides approximately 150–200 servings. For peak volatile oil freshness, consume contents within 30 days of opening the bottle."
      },
      {
        "q": "Is Bhumivera Kalpvriksh Satva Tulsi licensed under FSSAI?",
        "a": "Yes, it is manufactured under FSSAI License No. 12222999000145 with Batch No. SPTD26I and HSN Code 20099000."
      },
      {
        "q": "Where can I verify the batch COA for Kalpvriksh Satva Tulsi?",
        "a": "Visit https://bhumivera.com/verify and enter your bottle serial (or sample serial BHMV-2610-TL019) to inspect the 24.9°C cold-hydro-distillation and heavy-metal ND certificate."
      }
    ],
    "full_description": "<article class=\"bhumivera-monograph space-y-6\">\n  <h3>The Concentrated Nectar of Seven Sacred Tulsi Varieties (90% Potency · 9.0ml per 10ml): Inside-Out Skin & Wellness Adaptogen</h3>\n  <p><strong>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi) (30 ML · SKU: BV-LUX-TULSI-06)</strong> is a flagship formulation from <a href=\"https://bhumivera.com\"><strong>Bhumivera — The Transparent Maison</strong></a> (<a href=\"https://bhumivera.com/about\">Bhumivera Organics India Private Limited</a>, incorporated August 4, 2026 under Founder <strong>Akash Prasad</strong> and Directors <strong>Akash Prasad, Payal Prasad &amp; Aman Prasad</strong>), rooted in the 10-year herbal manufacturing and household distribution heritage of <a href=\"https://bhumivera.com/mpgebusiness\"><strong>MPG E-Business Private Limited</strong></a> (established September 22, 2016 in Asansol, West Bengal · CIN: <code>U74999WB2016PTC217735</code> · Founder: <strong>Dilip Prasad Nonia</strong>). Engineered under <em>The Bhumivera Transparency Standard (Est. 2016 lineage)</em>, this formulation prints 100% of its functional active concentrations openly on the physical bottle label: <strong>Each 10ml contains 9.0ml Mix Blend of Seven Tulsi: Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, Lemon Tulsi; Excipient Q.S.</strong>, calibrated to <strong>90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)</strong>.</p>\n  <p>True skin luminosity and systemic vitality are governed not only by what we apply topically to the stratum corneum, but also by the internal gut-skin-cortisol axis. Chronic psychological stress, seasonal weather shifts, and urban oxidative load elevate circulating cortisol levels—triggering sebaceous gland hyperactivity, barrier inflammation, and dullness from within.</p><p>While standard market 'Panch Tulsi' drops combine only five varieties of basil, Bhumivera Kalpvriksh Satva Tulsi (30 ML · SKU: BV-LUX-TULSI-06) delivers the concentrated liquid extract of 7 distinct types of Tulsi—Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala (Krishna) Tulsi, Rama Tulsi, and Lemon Tulsi—at a label-disclosed potency of 9.0 ml active extract per 10 ml (90% concentration).</p>\n\n  <h3>I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters</h3>\n  <p>Why unite seven distinct Ocimum chemotypes rather than one or five? Each Tulsi variety biosynthesizes a specialized ratio of volatile phenylpropanoids, monoterpenes, and triterpenoids. Kala (Krishna) and Rama Tulsi (Ocimum tenuiflorum) are rich in eugenol, rosmarinic acid, and ursolic acid—potent adaptogenic polyphenols that modulate oxidative stress. Van Tulsi (Ocimum gratissimum) contributes thymol and eugenol for seasonal respiratory comfort; Sweet Tulsi (Ocimum basilicum) provides linalool; Lemon Tulsi (Ocimum × africanum) delivers uplifting citral; and Marua and Bisva Tulsi round out the digestive and soothing phytonutrient spectrum.</p><p>Extracted via cold-hydro-distillation at 24.9°C (Batch #SPTD26I · Sample COA Serial: BHMV-2610-TL019) under FSSAI license 12222999000145, every 100ml provides 8.0 grams of pure essential botanical lipids, 2.0 grams of carbohydrate, 0.0 grams of protein, and 80 Kcal of phytonutrient energy with zero synthetic solvents.</p>\n  <p>For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque <code>&ldquo;Aqua / Base Q.S.&rdquo;</code> disclosure on the back—where high-value botanicals like <a href=\"https://en.wikipedia.org/wiki/Hippophae_rhamnoides\" target=\"_blank\" rel=\"noopener noreferrer\">Himalayan Sea Buckthorn</a>, <a href=\"https://en.wikipedia.org/wiki/Rubia_cordifolia\" target=\"_blank\" rel=\"noopener noreferrer\">Manjistha (Rubia cordifolia)</a>, <a href=\"https://en.wikipedia.org/wiki/Turmeric\" target=\"_blank\" rel=\"noopener noreferrer\">Haridra (Curcuma longa)</a>, <a href=\"https://en.wikipedia.org/wiki/Sapindus_mukorossi\" target=\"_blank\" rel=\"noopener noreferrer\">Reetha (Sapindus mukorossi)</a>, and <a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Sacred Tulsi (Ocimum tenuiflorum)</a> are dusted in at trace levels below 0.01% and boiled at 80°C–100°C. <a href=\"https://bhumivera.com/science\">Bhumivera’s Sub-28°C Formulation Lab</a> eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants (<a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide\" target=\"_blank\" rel=\"noopener noreferrer\">Niacinamide Vitamin B3</a>, <a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate\" target=\"_blank\" rel=\"noopener noreferrer\">Multi-Molecular Hyaluronic Acid</a>, and Plant-Derived Glycerin) at full, verifiable label potencies.</p>\n\n  <h4>Complete Active Ingredient &amp; Phytochemical Monograph Table (30 ML)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Disclosed Active &amp; INCI</th>\n          <th>Label Potency</th>\n          <th>Botanical / Chemical Class &amp; Reference</th>\n          <th>Extraction &amp; Harvest Corridor</th>\n          <th>Dermal / Trichological / Cellular Mechanism</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Seven-Tulsi Concentrated Blend (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi)</strong><br/><small>Ocimum gratissimum, Ocimum basilicum, Origanum majorana/Ocimum, Ocimum tenuiflorum (Kala & Rama), Ocimum × africanum Distillate</small></td>\n          <td><strong>9.0 ml (per 10 ml)</strong></td>\n          <td>Ocimum Spectrum Phyto-Extract (90% Potency) (<a href=\"https://en.wikipedia.org/wiki/Ocimum_tenuiflorum\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Cold-Hydro-Distilled Phyto-Essence (24.9°C Verified) · <a href=\"/provenance-engine\">REG-05 · Vrindavan & Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026</a></td>\n          <td>Provides 90% active tulsi extract rich in natural eugenol, ursolic acid, and rosmarinic acid to support daily wellness, seasonal comfort, gut-skin clarity, and antioxidant vitality.</td>\n        </tr><tr>\n          <td><strong>Excipient Base</strong><br/><small>Food-Grade Solubilizing Botanical Carrier</small></td>\n          <td><strong>Q.S. (1.0 ml per 10 ml)</strong></td>\n          <td>Food-Grade Carrier (<a href=\"https://en.wikipedia.org/wiki/Eugenol\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Sterile Food-Grade Blending (FSSAI: 12222999000145) · <a href=\"/provenance-engine\">REG-06 · Hygienic Bottling Cleanroom</a></td>\n          <td>Stabilizes volatile botanical essential oils for instant, uniform dispersion in warm water, tea, or milk.</td>\n        </tr><tr>\n          <td><strong>Nutritional Profile (Per 100ml Approx.)</strong><br/><small>Energy 80 Kcal | Carbohydrate 2.0g | Protein 0.0g | Essential Botanical Lipids 8.0g</small></td>\n          <td><strong>80 Kcal | 2g Carb | 8g Essential Lipids</strong></td>\n          <td>Label Nutritional Value (<a href=\"https://en.wikipedia.org/wiki/Rosmarinic_acid\" target=\"_blank\" rel=\"noopener noreferrer\">Reference ↗</a>)</td>\n          <td>Verified Nutritional Assay per 100ml · <a href=\"/provenance-engine\">FSSAI Licensed Facility (12222999000145)</a></td>\n          <td>0.0g protein; concentrated botanical phytonutrient profile delivering pure volatile essential lipids.</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h3>II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml))</h3>\n  <p>Within the Bhumivera apothecary ecosystem, Kalpvriksh Satva Tulsi serves as the internal cornerstone of our Inside-Out Botanical Ritual. When you pair 3–4 drops of Kalpvriksh Satva Tulsi in warm morning and evening water alongside topical cleansing with the Bhumivera 4% Himalayan Sea Buckthorn Face Wash or 3% Activated Charcoal Face Wash, you address both external urban pollution and internal oxidative stress simultaneously.</p><p>It is featured in both The Grand Maison 4-Piece Daily Apothecary Bundle (/combo/bundle-daily-regimen) and The Inside-Out Skin-Clearing & Cortisol Ritual Bundle (/combo/bundle-inside-out-ritual).</p>\n  <p>Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically <em>beta-glucocerebrosidase</em> and <em>acidic sphingomyelinase</em>—require an acidic microenvironment between <strong>pH 4.7 and 5.75</strong> to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating <strong>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)</strong> to <strong>90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)</strong> and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our <a href=\"/verify\">Bottle Serial &amp; COA Verification Portal</a> and <a href=\"/somatic-registry\">Somatic INCI Label Registry</a>), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it.</p>\n\n  <h3>III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule</h3>\n  <p>Add 3 to 4 drops of Bhumivera Kalpvriksh Satva Tulsi into a glass (150–200 ml) of lukewarm water, herbal tea, or warm milk twice daily—once in the morning before breakfast and once in the evening—or as directed by a wellness professional. Because it is a 90% concentrated extract (9.0 ml per 10 ml), never consume undiluted drops directly on the tongue. Consume the contents within 30 days of opening the bottle.</p>\n  <ul>\n    <li><strong>Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):</strong> Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer.</li>\n    <li><strong>Step 2 — Measured Dispensing &amp; Palmar Emulsification:</strong> Dispense the recommended dose of <strong>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)</strong> into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp.</li>\n    <li><strong>Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:</strong> Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives (<strong>Each 10ml contains 9.0ml Mix Blend of Seven Tulsi: Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, Lemon Tulsi; Excipient Q.S.</strong>) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates.</li>\n    <li><strong>Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:</strong> Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary <a href=\"/shop\">Bhumivera Inside-Out Ritual</a> formulations.</li>\n    <li><strong>Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:</strong> Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility (<a href=\"/lab\">read our full Cleanroom &amp; Patch-Test Protocol</a>).</li>\n  </ul>\n\n  <h3>IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter)</h3>\n  <p>Particularly valuable during seasonal transitions (monsoon-to-autumn and autumn-to-winter), high-pollution winter smog months, and periods of intense work or travel stress across India.</p>\n  <p>Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum. <strong>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)</strong> is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration.</p>\n\n  <h3>V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem</h3>\n  <p>Every formulation in the <a href=\"/shop\">Bhumivera 6-Product Flagship Catalog</a> is engineered to work as part of an interconnected, inside-out botanical system. Explore how <strong>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)</strong> pairs with our companion formulations:</p>\n  <ul>\n    <li><strong>1. <a href=\"/product/activated-charcoal-luxury-face-wash\">Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699)</a>:</strong> Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification.</li>\n    <li><strong>2. <a href=\"/product/himalayan-seabuckthorn-luxury-face-wash\">Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799)</a>:</strong> Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity.</li>\n    <li><strong>3. <a href=\"/product/luxury-2-in-1-botanical-shampoo-conditioner\">Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899)</a>:</strong> Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing.</li>\n    <li><strong>4. <a href=\"/product/artisanal-charcoal-handmade-soap\">Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399)</a>:</strong> Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification.</li>\n    <li><strong>5. <a href=\"/product/artisanal-aloe-vera-handmade-soap\">Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349)</a>:</strong> Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care.</li>\n    <li><strong>6. <a href=\"/product/kalpvriksh-satva-tulsi-7-tulsi-extract\">Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499)</a>:</strong> Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality.</li>\n  </ul>\n  <p>You can also acquire coordinated sets in our <a href=\"/combo/bundle-daily-regimen\">Grand Maison 4-Piece Daily Apothecary Bundle</a>, <a href=\"/combo/bundle-royal-crown-trio\">Royal Skin &amp; Scalp Stewardship Trio</a>, <a href=\"/combo/bundle-inside-out-ritual\">Inside-Out Skin-Clearing &amp; Cortisol Ritual</a>, or the collector’s <a href=\"/combo/bundle-grand-maison-vault\">Grand Maison 6-Piece Apothecary Vault</a>, or compare any two formulations side-by-side on our <a href=\"/compare\">Interactive Formulation Comparison Tool</a>.</p>\n\n  <h3>VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact</h3>\n  <p>Sourced from Vrindavan and Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026 and verified via ICP-MS for non-detected Lead, Arsenic, Cadmium, and Mercury.</p>\n  <p>Every unit of <strong>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)</strong> is traceable through our <a href=\"/provenance-engine\">6-Corridor Indian Botanical Provenance Engine</a> and protected by <a href=\"/purchase-protection\">Bhumivera White-Glove Purchase Protection</a>. To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard (<a href=\"/legal/shipping-hygiene\">Part II of the Bhumivera Legal Suite</a>) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch (<a href=\"/order-tracking\">track live AWB &amp; dispatch weight logs</a>). Furthermore, every order supports our verifiable community initiatives documented on the <a href=\"/impact\">Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact)</a>—including <a href=\"/impact/stray-animal-care\">The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative</a> and <a href=\"/impact/elderly-disabled-rations\">The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative</a> in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors (<a href=\"/impact/damodar-cleanup\">Damodar Riverbank Vetiver Cleanup</a>, <a href=\"/impact/jute-sapling-nursery\">Biodegradable Jute Sapling Nursery</a>, <a href=\"/impact/village-pukur-revival\">Village Pukur Pond Revival</a>, <a href=\"/impact/herbal-kitchen-gardens\">Medicinal Herbal Kitchen Gardens</a>, <a href=\"/impact/mandi-vermicomposting\">Mandi Waste Vermicomposting</a>, and <a href=\"/impact/coal-belt-microgrove\">Coal-Belt Native Micro-Grove</a>).</p>\n\n  <h4>Technical &amp; Regulatory Specification Summary (BV-LUX-TULSI-06)</h4>\n  <div class=\"overflow-x-auto my-4\">\n    <table>\n      <thead>\n        <tr>\n          <th>Specification Parameter</th>\n          <th>Verified Bhumivera Standard</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><strong>Brand Name</strong></td>\n          <td>Bhumivera (The Transparent Maison · Est. 2016 Lineage)</td>\n        </tr><tr>\n          <td><strong>Product Full Name</strong></td>\n          <td>Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)</td>\n        </tr><tr>\n          <td><strong>SKU Code</strong></td>\n          <td>BV-LUX-TULSI-06 (Legacy: BV-TRHM-100ML)</td>\n        </tr><tr>\n          <td><strong>MPN Code</strong></td>\n          <td>BVTULSI30ML</td>\n        </tr><tr>\n          <td><strong>GTIN 13 EAN</strong></td>\n          <td>8906182600063</td>\n        </tr><tr>\n          <td><strong>GST HSN Code</strong></td>\n          <td>20099000 (Botanical & Herbal Extracts · 5% GST)</td>\n        </tr><tr>\n          <td><strong>FSSAI License Number</strong></td>\n          <td>12222999000145 (Food-Grade Botanical Purity Standard)</td>\n        </tr><tr>\n          <td><strong>Net Volume Metric</strong></td>\n          <td>30 ML (1.01 fl. oz. Precision Dropper Bottle)</td>\n        </tr><tr>\n          <td><strong>Gross Dispatch Weight</strong></td>\n          <td>98.5 Grams (±0.5g Digital Scale Verified)</td>\n        </tr><tr>\n          <td><strong>Batch Number</strong></td>\n          <td>SPTD26I / BATCH-04/26-TL (250 Units per Micro-Batch)</td>\n        </tr><tr>\n          <td><strong>Manufacturing Date</strong></td>\n          <td>2026-09-01 (Consume within 30 days of opening bottle)</td>\n        </tr><tr>\n          <td><strong>Active Potency Ratio</strong></td>\n          <td>9.0 ML Seven-Tulsi Extract per 10 ML (90.0% Active Concentration)</td>\n        </tr><tr>\n          <td><strong>Seven Tulsi Varieties</strong></td>\n          <td>1. Van, 2. Sweet, 3. Marua, 4. Bisva, 5. Kala (Krishna), 6. Rama, 7. Lemon Tulsi</td>\n        </tr><tr>\n          <td><strong>Key Phytochemicals</strong></td>\n          <td>Eugenol, Rosmarinic Acid, Ursolic Acid, Carvacrol, Linalool & Citral</td>\n        </tr><tr>\n          <td><strong>Extraction Temperature</strong></td>\n          <td>< 28.0°C (24.9°C Cold-Hydro-Distilled Phyto-Essence)</td>\n        </tr><tr>\n          <td><strong>Nutritional Energy Per 100ml</strong></td>\n          <td>80 Kcal | Carbohydrate: 2.0 gm | Protein: 0.0 gm | Essential Oils/Fat: 8.0 gm</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</article>",
    "description": "The Concentrated Nectar of Seven Sacred Tulsi Varieties (90% Potency · 9.0ml per 10ml): Inside-Out Skin & Wellness Adaptogen \n    Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi) (30 ML · SKU: BV-LUX-TULSI-06)  is a flagship formulation from   Bhumivera — The Transparent Maison   ( Bhumivera Organics India Private Limited , incorporated August 4, 2026 under Founder  Akash Prasad  and Directors  Akash Prasad, Payal Prasad &amp; Aman Prasad ), rooted in the 10-year herbal manufacturing and household distribution heritage of   MPG E-Business Private Limited   (established September 22, 2016 in Asansol, West Bengal · CIN:  U74999WB2016PTC217735  · Founder:  Dilip Prasad Nonia ). Engineered under  The Bhumivera Transparency Standard (Est. 2016 lineage) , this formulation prints 100% of its functional active concentrations openly on the physical bottle label:  Each 10ml contains 9.0ml Mix Blend of Seven Tulsi: Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, Lemon Tulsi; Excipient Q.S. , calibrated to  90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml) . \n   True skin luminosity and systemic vitality are governed not only by what we apply topically to the stratum corneum, but also by the internal gut-skin-cortisol axis. Chronic psychological stress, seasonal weather shifts, and urban oxidative load elevate circulating cortisol levels—triggering sebaceous gland hyperactivity, barrier inflammation, and dullness from within.  While standard market 'Panch Tulsi' drops combine only five varieties of basil, Bhumivera Kalpvriksh Satva Tulsi (30 ML · SKU: BV-LUX-TULSI-06) delivers the concentrated liquid extract of 7 distinct types of Tulsi—Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala (Krishna) Tulsi, Rama Tulsi, and Lemon Tulsi—at a label-disclosed potency of 9.0 ml active extract per 10 ml (90% concentration). \n\n   I. Molecular &amp; Phytochemical Architecture: Why 100% Label-Disclosed Potency Matters \n   Why unite seven distinct Ocimum chemotypes rather than one or five? Each Tulsi variety biosynthesizes a specialized ratio of volatile phenylpropanoids, monoterpenes, and triterpenoids. Kala (Krishna) and Rama Tulsi (Ocimum tenuiflorum) are rich in eugenol, rosmarinic acid, and ursolic acid—potent adaptogenic polyphenols that modulate oxidative stress. Van Tulsi (Ocimum gratissimum) contributes thymol and eugenol for seasonal respiratory comfort; Sweet Tulsi (Ocimum basilicum) provides linalool; Lemon Tulsi (Ocimum × africanum) delivers uplifting citral; and Marua and Bisva Tulsi round out the digestive and soothing phytonutrient spectrum.  Extracted via cold-hydro-distillation at 24.9°C (Batch #SPTD26I · Sample COA Serial: BHMV-2610-TL019) under FSSAI license 12222999000145, every 100ml provides 8.0 grams of pure essential botanical lipids, 2.0 grams of carbohydrate, 0.0 grams of protein, and 80 Kcal of phytonutrient energy with zero synthetic solvents. \n   For decades, conscious skincare and haircare buyers across India and global markets have faced a false dichotomy. On one side stand synthetic laboratory isolate brands that disclose single-chemical percentages but rely on sterile, petro-derived bases devoid of whole-plant phytonutrients. On the other side stand legacy and viral Ayurvedic brands that romanticize ancient herbs on the front label while hiding behind an opaque  &ldquo;Aqua / Base Q.S.&rdquo;  disclosure on the back—where high-value botanicals like  Himalayan Sea Buckthorn ,  Manjistha (Rubia cordifolia) ,  Haridra (Curcuma longa) ,  Reetha (Sapindus mukorossi) , and  Sacred Tulsi (Ocimum tenuiflorum)  are dusted in at trace levels below 0.01% and boiled at 80°C–100°C.  Bhumivera’s Sub-28°C Formulation Lab  eliminates this compromise by uniting cold-processed Indian botanicals with biomimetic barrier humectants ( Niacinamide Vitamin B3 ,  Multi-Molecular Hyaluronic Acid , and Plant-Derived Glycerin) at full, verifiable label potencies. \n\n   Complete Active Ingredient &amp; Phytochemical Monograph Table (30 ML) \n   \n     \n       \n         \n           Disclosed Active &amp; INCI \n           Label Potency \n           Botanical / Chemical Class &amp; Reference \n           Extraction &amp; Harvest Corridor \n           Dermal / Trichological / Cellular Mechanism \n         \n       \n       \n         \n            Seven-Tulsi Concentrated Blend (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi)   Ocimum gratissimum, Ocimum basilicum, Origanum majorana/Ocimum, Ocimum tenuiflorum (Kala & Rama), Ocimum × africanum Distillate  \n            9.0 ml (per 10 ml)  \n           Ocimum Spectrum Phyto-Extract (90% Potency) ( Reference ↗ ) \n           Cold-Hydro-Distilled Phyto-Essence (24.9°C Verified) ·  REG-05 · Vrindavan & Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026  \n           Provides 90% active tulsi extract rich in natural eugenol, ursolic acid, and rosmarinic acid to support daily wellness, seasonal comfort, gut-skin clarity, and antioxidant vitality. \n          \n            Excipient Base   Food-Grade Solubilizing Botanical Carrier  \n            Q.S. (1.0 ml per 10 ml)  \n           Food-Grade Carrier ( Reference ↗ ) \n           Sterile Food-Grade Blending (FSSAI: 12222999000145) ·  REG-06 · Hygienic Bottling Cleanroom  \n           Stabilizes volatile botanical essential oils for instant, uniform dispersion in warm water, tea, or milk. \n          \n            Nutritional Profile (Per 100ml Approx.)   Energy 80 Kcal | Carbohydrate 2.0g | Protein 0.0g | Essential Botanical Lipids 8.0g  \n            80 Kcal | 2g Carb | 8g Essential Lipids  \n           Label Nutritional Value ( Reference ↗ ) \n           Verified Nutritional Assay per 100ml ·  FSSAI Licensed Facility (12222999000145)  \n           0.0g protein; concentrated botanical phytonutrient profile delivering pure volatile essential lipids. \n         \n       \n     \n   \n\n   II. Multi-Pathway Bio-Active Synergy &amp; Barrier-First pH Calibration (90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)) \n   Within the Bhumivera apothecary ecosystem, Kalpvriksh Satva Tulsi serves as the internal cornerstone of our Inside-Out Botanical Ritual. When you pair 3–4 drops of Kalpvriksh Satva Tulsi in warm morning and evening water alongside topical cleansing with the Bhumivera 4% Himalayan Sea Buckthorn Face Wash or 3% Activated Charcoal Face Wash, you address both external urban pollution and internal oxidative stress simultaneously.  It is featured in both The Grand Maison 4-Piece Daily Apothecary Bundle (/combo/bundle-daily-regimen) and The Inside-Out Skin-Clearing & Cortisol Ritual Bundle (/combo/bundle-inside-out-ritual). \n   Every wash-off or leave-on ritual interacts directly with the human stratum corneum or scalp cuticle—a delicate biological shield composed of corneocytes embedded in a lamellar lipid matrix of ceramides (50%), cholesterol (25%), and free fatty acids (15%). The enzymes responsible for synthesizing these barrier ceramides—specifically  beta-glucocerebrosidase  and  acidic sphingomyelinase —require an acidic microenvironment between  pH 4.7 and 5.75  to function. When you cleanse with a conventional alkaline foaming wash or detergent bar (pH 8.0–9.5), the sudden pH spike deactivates these lipid-synthesizing enzymes, activates serine proteases (kallikreins) that degrade corneodesmosomes, swells the stratum corneum, and accelerates transepidermal water loss (TEWL). By calibrating  Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)  to  90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)  and verifying every artisanal batch on a temperature-compensated digital glass electrode at 25.0°C (inspectable anytime on our  Bottle Serial &amp; COA Verification Portal  and  Somatic INCI Label Registry ), Bhumivera ensures that daily cleansing reinforces your natural barrier rather than stripping it. \n\n   III. Step-by-Step Morning (AM) &amp; Evening (PM) Ritual Protocol &amp; The 60-Second Layering Rule \n   Add 3 to 4 drops of Bhumivera Kalpvriksh Satva Tulsi into a glass (150–200 ml) of lukewarm water, herbal tea, or warm milk twice daily—once in the morning before breakfast and once in the evening—or as directed by a wellness professional. Because it is a 90% concentrated extract (9.0 ml per 10 ml), never consume undiluted drops directly on the tongue. Consume the contents within 30 days of opening the bottle. \n   \n      Step 1 — Thermal Water Preparation (24°C–30°C Lukewarm Water):  Avoid hot shower water above 38°C, which melts intercellular epidermal lipids and triggers cutaneous vasodilation. Splash skin or scalp with cool-to-lukewarm water for 10 seconds to hydrate the outer corneocyte layer. \n      Step 2 — Measured Dispensing &amp; Palmar Emulsification:  Dispense the recommended dose of  Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)  into clean, wet palms. Rub palms together for 5 seconds to activate the natural plant glucosides, saponins, or phyto-extracts into a cushiony, micro-fine suspension before touching the skin or scalp. \n      Step 3 — The 30-to-60 Second Micro-Circulation Contact Window:  Massage gently using upward circular fingertip strokes. Never scrub aggressively with abrasive loofahs or synthetic brushes. Allow the disclosed actives ( Each 10ml contains 9.0ml Mix Blend of Seven Tulsi: Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, Lemon Tulsi; Excipient Q.S. ) 30 to 60 seconds of contact time so humectants bind water to the outer layers while purifying botanicals lift oxidized sebum and PM2.5 particulates. \n      Step 4 — Thorough Rinse &amp; The 60-Second Damp-Skin Seal:  Rinse completely with lukewarm water and pat gently with a clean, soft cotton towel—leaving the skin slightly dewy. Within 60 seconds of patting dry, lock in hydration or pair with your complementary  Bhumivera Inside-Out Ritual  formulations. \n      Step 5 — Mandatory 24-Hour Inner-Forearm Patch Test Protocol:  Because Bhumivera formulations contain high-potency, sub-28°C cold-pressed botanical extracts and essential phytonutrients, apply a small dab to the inner forearm for 24 hours prior to first full use to confirm individual skin compatibility ( read our full Cleanroom &amp; Patch-Test Protocol ). \n   \n\n   IV. Indian Climate &amp; Seasonal Adaptation Guide (Summer, Monsoon, Autumn &amp; Winter) \n   Particularly valuable during seasonal transitions (monsoon-to-autumn and autumn-to-winter), high-pollution winter smog months, and periods of intense work or travel stress across India. \n   Across the Indian subcontinent—from the high humidity of coastal Mumbai, Chennai, and Kolkata during the southwest monsoon to the dry winter winds of Delhi, Jaipur, and Asansol, and the high-UV alpine corridors of Ladakh and Himachal—skin and scalp physiology shifts dramatically across seasons. During hot, humid summers and monsoons, sebaceous glands increase squalene and wax ester secretion by up to 40%, while atmospheric PM2.5 soot adheres to surface sweat to form peroxidized squalene (a primary trigger of comedones and dullness). During dry winters and in air-conditioned offices, ambient relative humidity drops below 35%, drawing moisture out of the stratum corneum.  Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)  is specifically balanced so its purifying and clarifying botanicals address summer/monsoon congestion while its humectant and lipid-supporting actives cushion against winter dehydration. \n\n   V. Complete Cross-Catalog Pairing &amp; The Bhumivera 6-SKU Apothecary Ecosystem \n   Every formulation in the  Bhumivera 6-Product Flagship Catalog  is engineered to work as part of an interconnected, inside-out botanical system. Explore how  Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)  pairs with our companion formulations: \n   \n      1.  Bhumivera Activated Charcoal Purifying Luxury Face Wash (100 ML · ₹699) :  Formulated with 3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.4–5.5). Ideal for evening (PM) urban pollution and deep pore detoxification. \n      2.  Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML · ₹799) :  Formulated with 4% Himalayan Sea Buckthorn (Omega-7 &amp; Vitamin C carotenoids), 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid &amp; 0.1% Niacinamide (pH 5.3–5.5). Ideal for morning (AM) cellular radiance, barrier lipid replenishment, and glass-skin luminosity. \n      3.  Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML · ₹899) :  Formulated with a 100 mg standardized 8-herb complex: 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, 10mg Bhringraj, 10mg Triphala, 10mg Neem, 10mg Aloe Vera &amp; 5mg Shikakai (pH 5.0–5.24). Sulfate-free saponin scalp cleansing and silicone-free cuticle smoothing. \n      4.  Bhumivera Charcoal Deep Cleansing Bar (100 GM · ₹399) :  Handcrafted Ayurvedic luxury bathing bar combining Microporous Activated Charcoal and Pure Aloe Vera inner-leaf fillet in a gentle, detergent-free soap base for full-body pore purification. \n      5.  Bhumivera Soothing Bar — Aloe Vera, Neem &amp; Sacred Tulsi (100 GM · ₹349) :  Handcrafted Ayurvedic soothing bathing bar uniting Aloe Vera, clarifying Neem, and adaptogenic Tulsi for calm, smooth, blemish-clarified face and body care. \n      6.  Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML · ₹499) :  Concentrated 90% distillate (9.0 ml per 10 ml) of 7 distinct Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi) to support the internal gut-skin-cortisol axis and daily antioxidant vitality. \n   \n   You can also acquire coordinated sets in our  Grand Maison 4-Piece Daily Apothecary Bundle ,  Royal Skin &amp; Scalp Stewardship Trio ,  Inside-Out Skin-Clearing &amp; Cortisol Ritual , or the collector’s  Grand Maison 6-Piece Apothecary Vault , or compare any two formulations side-by-side on our  Interactive Formulation Comparison Tool . \n\n   VI. Harvest Provenance, Cleanroom Serialization, Sanitary Custody &amp; Grassroots Impact \n   Sourced from Vrindavan and Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026 and verified via ICP-MS for non-detected Lead, Arsenic, Cadmium, and Mercury. \n   Every unit of  Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)  is traceable through our  6-Corridor Indian Botanical Provenance Engine  and protected by  Bhumivera White-Glove Purchase Protection . To protect patrons against counterfeit marketplace stock or biological contamination, delivered personal care units are governed by our 100% Virgin Sanitary Custody Standard ( Part II of the Bhumivera Legal Suite ) and weighed to ±0.5g on a calibrated digital platform scale prior to dispatch ( track live AWB &amp; dispatch weight logs ). Furthermore, every order supports our verifiable community initiatives documented on the  Bhumivera Public Impact &amp; Stewardship Ledger (bhumivera.com/impact) —including  The Ceaser Memorial Stray Dog &amp; Cat Rescue Initiative  and  The Smt. Shanti Memorial Elderly &amp; Disabled Food Ration Kits Initiative  in Paschim Bardhaman, West Bengal, alongside our six upcoming 2028 ecological restoration corridors ( Damodar Riverbank Vetiver Cleanup ,  Biodegradable Jute Sapling Nursery ,  Village Pukur Pond Revival ,  Medicinal Herbal Kitchen Gardens ,  Mandi Waste Vermicomposting , and  Coal-Belt Native Micro-Grove ). \n\n   Technical &amp; Regulatory Specification Summary (BV-LUX-TULSI-06) \n   \n     \n       \n         \n           Specification Parameter \n           Verified Bhumivera Standard \n         \n       \n       \n         \n            Brand Name  \n           Bhumivera (The Transparent Maison · Est. 2016 Lineage) \n          \n            Product Full Name  \n           Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi) \n          \n            SKU Code  \n           BV-LUX-TULSI-06 (Legacy: BV-TRHM-100ML) \n          \n            MPN Code  \n           BVTULSI30ML \n          \n            GTIN 13 EAN  \n           8906182600063 \n          \n            GST HSN Code  \n           20099000 (Botanical & Herbal Extracts · 5% GST) \n          \n            FSSAI License Number  \n           12222999000145 (Food-Grade Botanical Purity Standard) \n          \n            Net Volume Metric  \n           30 ML (1.01 fl. oz. Precision Dropper Bottle) \n          \n            Gross Dispatch Weight  \n           98.5 Grams (±0.5g Digital Scale Verified) \n          \n            Batch Number  \n           SPTD26I / BATCH-04/26-TL (250 Units per Micro-Batch) \n          \n            Manufacturing Date  \n           2026-09-01 (Consume within 30 days of opening bottle) \n          \n            Active Potency Ratio  \n           9.0 ML Seven-Tulsi Extract per 10 ML (90.0% Active Concentration) \n          \n            Seven Tulsi Varieties  \n           1. Van, 2. Sweet, 3. Marua, 4. Bisva, 5. Kala (Krishna), 6. Rama, 7. Lemon Tulsi \n          \n            Key Phytochemicals  \n           Eugenol, Rosmarinic Acid, Ursolic Acid, Carvacrol, Linalool & Citral \n          \n            Extraction Temperature  \n            \n          \n            Nutritional Energy Per 100ml  \n           80 Kcal | Carbohydrate: 2.0 gm | Protein: 0.0 gm | Essential Oils/Fat: 8.0 gm",
    "editorial_heading": "The Concentrated Nectar of Seven Sacred Tulsi Varieties (90% Potency · 9.0ml per 10ml): Inside-Out Skin & Wellness Adaptogen",
    "editorial_paragraphs": [
      "True skin luminosity and systemic vitality are governed not only by what we apply topically to the stratum corneum, but also by the internal gut-skin-cortisol axis. Chronic psychological stress, seasonal weather shifts, and urban oxidative load elevate circulating cortisol levels—triggering sebaceous gland hyperactivity, barrier inflammation, and dullness from within.",
      "While standard market 'Panch Tulsi' drops combine only five varieties of basil, Bhumivera Kalpvriksh Satva Tulsi (30 ML · SKU: BV-LUX-TULSI-06) delivers the concentrated liquid extract of 7 distinct types of Tulsi—Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala (Krishna) Tulsi, Rama Tulsi, and Lemon Tulsi—at a label-disclosed potency of 9.0 ml active extract per 10 ml (90% concentration).",
      "Why unite seven distinct Ocimum chemotypes rather than one or five? Each Tulsi variety biosynthesizes a specialized ratio of volatile phenylpropanoids, monoterpenes, and triterpenoids. Kala (Krishna) and Rama Tulsi (Ocimum tenuiflorum) are rich in eugenol, rosmarinic acid, and ursolic acid—potent adaptogenic polyphenols that modulate oxidative stress. Van Tulsi (Ocimum gratissimum) contributes thymol and eugenol for seasonal respiratory comfort; Sweet Tulsi (Ocimum basilicum) provides linalool; Lemon Tulsi (Ocimum × africanum) delivers uplifting citral; and Marua and Bisva Tulsi round out the digestive and soothing phytonutrient spectrum.",
      "Extracted via cold-hydro-distillation at 24.9°C (Batch #SPTD26I · Sample COA Serial: BHMV-2610-TL019) under FSSAI license 12222999000145, every 100ml provides 8.0 grams of pure essential botanical lipids, 2.0 grams of carbohydrate, 0.0 grams of protein, and 80 Kcal of phytonutrient energy with zero synthetic solvents.",
      "Within the Bhumivera apothecary ecosystem, Kalpvriksh Satva Tulsi serves as the internal cornerstone of our Inside-Out Botanical Ritual. When you pair 3–4 drops of Kalpvriksh Satva Tulsi in warm morning and evening water alongside topical cleansing with the Bhumivera 4% Himalayan Sea Buckthorn Face Wash or 3% Activated Charcoal Face Wash, you address both external urban pollution and internal oxidative stress simultaneously.",
      "It is featured in both The Grand Maison 4-Piece Daily Apothecary Bundle (/combo/bundle-daily-regimen) and The Inside-Out Skin-Clearing & Cortisol Ritual Bundle (/combo/bundle-inside-out-ritual)."
    ],
    "exactCompositionTable": [
      {
        "active": "Seven-Tulsi Concentrated Blend (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi)",
        "ingredient": "Seven-Tulsi Concentrated Blend (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi)",
        "potency": "9.0 ml (per 10 ml)",
        "concentration": "9.0 ml (per 10 ml)",
        "classification": "Ocimum Spectrum Phyto-Extract (90% Potency)",
        "botanical": "Ocimum Spectrum Phyto-Extract (90% Potency)",
        "inci": "",
        "molecular_markers": "Eugenol, Methyl Eugenol, Rosmarinic Acid, Ursolic Acid, Carvacrol, Linalool & Citral",
        "extraction_method": "Cold-Hydro-Distilled Phyto-Essence (24.9°C Verified)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)",
        "mechanism": "Provides 90% active tulsi extract rich in natural eugenol, ursolic acid, and rosmarinic acid to support daily wellness, seasonal comfort, gut-skin clarity, and antioxidant vitality.",
        "role": "Provides 90% active tulsi extract rich in natural eugenol, ursolic acid, and rosmarinic acid to support daily wellness, seasonal comfort, gut-skin clarity, and antioxidant vitality.",
        "synergy_partners": "Pairs internally with topical Sea Buckthorn & Charcoal Face Washes",
        "reference_url": "https://en.wikipedia.org/wiki/Ocimum_tenuiflorum"
      },
      {
        "active": "Excipient Base",
        "ingredient": "Excipient Base",
        "potency": "Q.S. (1.0 ml per 10 ml)",
        "concentration": "Q.S. (1.0 ml per 10 ml)",
        "classification": "Food-Grade Carrier",
        "botanical": "Food-Grade Carrier",
        "inci": "",
        "molecular_markers": "Micro-Dispersible Hydro-Botanical Suspension",
        "extraction_method": "Sterile Food-Grade Blending (FSSAI: 12222999000145)",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)",
        "mechanism": "Stabilizes volatile botanical essential oils for instant, uniform dispersion in warm water, tea, or milk.",
        "role": "Stabilizes volatile botanical essential oils for instant, uniform dispersion in warm water, tea, or milk.",
        "synergy_partners": "9.0 ml Seven-Tulsi Blend",
        "reference_url": "https://en.wikipedia.org/wiki/Eugenol"
      },
      {
        "active": "Nutritional Profile (Per 100ml Approx.)",
        "ingredient": "Nutritional Profile (Per 100ml Approx.)",
        "potency": "80 Kcal | 2g Carb | 8g Essential Lipids",
        "concentration": "80 Kcal | 2g Carb | 8g Essential Lipids",
        "classification": "Label Nutritional Value",
        "botanical": "Label Nutritional Value",
        "inci": "",
        "molecular_markers": "Zero Added Sugar · Zero Synthetic Colors · Zero Alcohol",
        "extraction_method": "Verified Nutritional Assay per 100ml",
        "harvest_corridor": "Indian Botanical Corridor",
        "corridor_url": "/provenance-engine",
        "ph_window": "90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml)",
        "mechanism": "0.0g protein; concentrated botanical phytonutrient profile delivering pure volatile essential lipids.",
        "role": "0.0g protein; concentrated botanical phytonutrient profile delivering pure volatile essential lipids.",
        "synergy_partners": "Daily Warm Water / Herbal Tea Ritual",
        "reference_url": "https://en.wikipedia.org/wiki/Rosmarinic_acid"
      }
    ],
    "directAnswerFaqs": [
      {
        "q": "How is Bhumivera Kalpvriksh Satva Tulsi different from regular Panch Tulsi drops?",
        "a": "Regular Panch Tulsi products use 5 types of tulsi. Bhumivera Kalpvriksh Satva Tulsi combines 7 distinct varieties—Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, and Lemon Tulsi—at a label-disclosed concentration of 9.0ml per 10ml (90% active potency)."
      },
      {
        "q": "How should I take Kalpvriksh Satva Tulsi drops daily?",
        "a": "Add 3 to 4 drops into a glass of warm water, tea, or milk twice daily. Because it is a concentrated 90% botanical extract (9.0ml per 10ml), 3–4 drops are sufficient for a daily wellness serving."
      },
      {
        "q": "What are the 7 types of Tulsi in Bhumivera Kalpvriksh Satva Tulsi?",
        "a": "Each 10ml contains 9.0ml Mix Blend of: 1) Van Tulsi, 2) Sweet Tulsi, 3) Marua Tulsi, 4) Bisva Tulsi, 5) Kala Tulsi, 6) Rama Tulsi, and 7) Lemon Tulsi, with Excipient Q.S."
      },
      {
        "q": "What is the nutritional value of Kalpvriksh Satva Tulsi per 100ml?",
        "a": "Per 100ml (approx.): Energy 80 Kcal, Carbohydrate 2.0 gm, Protein 0.0 gm, and Fat (Essential Botanical Oils) 8.0 gm."
      },
      {
        "q": "How does Kalpvriksh Satva Tulsi support clear, glowing skin from within?",
        "a": "Tulsi is rich in adaptogenic eugenol, rosmarinic acid, and ursolic acid, which help calm internal oxidative and cortisol stress along the gut-skin axis—complementing topical skincare with our Sea Buckthorn and Charcoal Face Washes."
      },
      {
        "q": "How long does one 30 ML bottle last, and what is its shelf window after opening?",
        "a": "At 3–4 drops twice daily, a 30 ML bottle provides approximately 150–200 servings. For peak volatile oil freshness, consume contents within 30 days of opening the bottle."
      },
      {
        "q": "Is Bhumivera Kalpvriksh Satva Tulsi licensed under FSSAI?",
        "a": "Yes, it is manufactured under FSSAI License No. 12222999000145 with Batch No. SPTD26I and HSN Code 20099000."
      },
      {
        "q": "Where can I verify the batch COA for Kalpvriksh Satva Tulsi?",
        "a": "Visit https://bhumivera.com/verify and enter your bottle serial (or sample serial BHMV-2610-TL019) to inspect the 24.9°C cold-hydro-distillation and heavy-metal ND certificate."
      }
    ]
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
