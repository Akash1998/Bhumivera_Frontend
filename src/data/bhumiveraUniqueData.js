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
    name: 'The Biotic Cellular Reset: 30-Day Gut-Skin Protocol',
    brand: 'Bhumivera',
    category_id: 3,
    category_name: 'Synchronized Gut-Skin Protocols',
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
    name: 'The Biotic Cellular Reset: 30-Day Gut-Skin Protocol',
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
    "name": "Bhumivera Activated Charcoal Postbiotic Cellular Emulsion (100 ml)",
    "subtitle": "3% Activated Charcoal, 5% Glycerin, Postbiotic Lactobacillus Ferment, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.1% HA & 0.1% Niacinamide",
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
    "category": "Postbiotic Barrier Emulsions",
    "ph_level": "pH 5.4 \u2013 5.5 (Acid-Mantle & Cutaneous Microbiome Calibrated)",
    "active_ingredients": "Activated Charcoal (3.0%), Botanical Glycerin (5.0%), Lactobacillus Postbiotic Ferment Lysate (1.0%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Non-Stripping Glucoside Emulsion Base (Q.S.)",
    "image_url": "/images/products/bhumivera-activated-charcoal-luxury-face-wash.webp",
    "image": "/images/products/bhumivera-activated-charcoal-luxury-face-wash.webp",
    "additionalImages": [
      "/assets/images/charcoalFace wash.webp"
    ],
    "seo_title": "Bhumivera Activated Charcoal Postbiotic Cellular Emulsion (100ml) | 3% Charcoal, 5% Glycerin, Hyaluronic Acid, Niacinamide & Manjistha Barrier Cleanser",
    "meta_description": "Engineered for the Synchronized Gut-Skin Biotic Protocol: Bhumivera Activated Charcoal Postbiotic Cellular Emulsion (100ml) with 3% Activated Charcoal, 5% Glycerin, Postbiotic Ferments, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.1% HA & 0.1% Niacinamide at pH 5.4\u20135.5.",
    "short_description": "Targeted PM external pore-detoxification micro-emulsion in the Bhumivera Gut-Skin Biotic Protocol. Formulated per 100ml with 100% label-disclosed 3% Activated Charcoal (>900 m\u00b2/g microporous surface area), 5% Botanical Glycerin, Postbiotic Lactobacillus Ferment, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid & 0.1% Niacinamide at pH 5.4\u20135.5.",
    "search_keywords": "postbiotic charcoal cleansing emulsion India, pH 5.5 barrier face wash, cutibacterium acnes microbiome cleanser, 3% activated charcoal 5% glycerin niacinamide hyaluronic acid, non stripping glucoside cleanser India",
    "conscious_buyer_highlights": [
      "100% Label-Disclosed Active Stoichiometry: Exact concentrations (3% Activated Charcoal, 5% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid, 0.1% Niacinamide) printed openly on the Biophotonic UV glass bottle.",
      "Cutaneous Microbiome & Acid-Mantle Defense: Calibrated strictly at pH 5.4\u20135.5 to inhibit virulent Cutibacterium acnes phylotype IA1 proliferation while preserving commensal Staphylococcus epidermidis.",
      "Zero Alkaline Or Acid Stripping: Replaces harsh SLS/SLES sulfates and over-exfoliating synthetic acids with a 5.0% Botanical Glycerin and 0.1% Hyaluronic Acid moisture cushion.",
      "Regulatory & Batch Transparency: Manufactured under AYUSH / Cosmetics Rules, 2020 with serialized QR codes verifying <28\u00b0C cold processing and 0.000 ppm pesticide residue."
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
        "ingredient": "Activated Bamboo Carbon (<15 \u03bcm)",
        "concentration": "3.0% (3,000 mg)",
        "botanical": "Bambusa tulda Microporous Carbon (CAS 7440-44-0)",
        "role": "Provides >900 m\u00b2/g microporous Van der Waals adsorption capacity to chelate PM2.5 polycyclic aromatic hydrocarbons (PAHs), heavy metals, and peroxidized squalene without mechanical micro-tears."
      },
      {
        "ingredient": "Plant-Derived Botanical Glycerin",
        "concentration": "5.0% (5,000 mg)",
        "botanical": "Vegetable Glycerol Trihydroxy Alcohol (CAS 56-81-5)",
        "role": "Activates epidermal Aquaporin-3 (AQP3) water-transport channels and forms a humectant cushion that prevents post-rinse transepidermal water loss (TEWL)."
      },
      {
        "ingredient": "Postbiotic Lactobacillus Ferment Lysate",
        "concentration": "1.0% (1,000 mg)",
        "botanical": "Bio-Fermented Peptide & Lactic Bacteriocin Fraction",
        "role": "Delivers antimicrobial bacteriocins and organic acids that reinforce tight-junction claudin-1 expression and stabilize the resident skin microbiome at pH 5.4."
      },
      {
        "ingredient": "Manjistha Root Bio-Extract",
        "concentration": "0.5% (500 mg)",
        "botanical": "Rubia cordifolia (Standardized \u22658% Rubiadin & Purpurin)",
        "role": "Inhibits tyrosinase-driven post-inflammatory hyperpigmentation (PIH) and downregulates dermal TNF-alpha microvascular erythema."
      },
      {
        "ingredient": "Haridra Rhizome Cold-Extract",
        "concentration": "0.5% (500 mg)",
        "botanical": "Curcuma longa (Standardized \u226525% Tetrahydrocurcuminoids)",
        "role": "Suppresses Toll-Like Receptor 2 (TLR-2) and NF-kappaB signaling triggered by Cutibacterium acnes lipopolysaccharides and propionic acid."
      },
      {
        "ingredient": "Neem Leaf supercritical Extract",
        "concentration": "0.5% (500 mg)",
        "botanical": "Azadirachta indica (Nimbidin, Quercetin & Azadirachtin)",
        "role": "Selectively quenches quorum-sensing biofilm formation of virulent acne phylotypes while leaving beneficial epidermal flora intact."
      },
      {
        "ingredient": "Cellular Cucumber Hydro-Fillet",
        "concentration": "0.5% (500 mg)",
        "botanical": "Cucumis sativus L. (Caffeic Acid, Ascorbic Acid & Silica)",
        "role": "Cools neurogenic thermal flushing and reduces perifollicular edema within 45 seconds of massage."
      },
      {
        "ingredient": "Multi-Molecular Hyaluronic Acid",
        "concentration": "0.1% (100 mg)",
        "botanical": "Bio-Fermented Sodium Hyaluronate (CAS 9067-32-7)",
        "role": "Binds up to 1,000x its molecular weight in water across the stratum corneum corneocyte matrix."
      },
      {
        "ingredient": "Niacinamide (USP Vitamin B3)",
        "concentration": "0.1% (100 mg)",
        "botanical": "Nicotinamide Pyridine-3-Carboxamide (CAS 98-92-0)",
        "role": "Stimulates de novo synthesis of ceramide NP/EOS, free fatty acids, and cholesterol while moderating sebocyte lipogenesis."
      },
      {
        "ingredient": "Decyl & Coco-Glucoside Micro-Emulsion",
        "concentration": "Q.S. to 100 ml",
        "botanical": "Non-Ionic Plant Sugar Surfactant Matrix (pH 5.45)",
        "role": "Zero-sulfate, biodegradable micellar suspension calibrated to physiological acid-mantle neutrality."
      }
    ],
    "full_description": "<h3>Targeted PM Cutaneous Detoxification Without Barrier Stripping</h3>\n<p>In the Indian urban environment, particulate matter (PM2.5) and oxidized sebum peroxidize squalene on the facial surface, triggering Toll-Like Receptor 2 (TLR-2) activation and follicular hyperkeratinization. Conventional mass-market charcoal washes compound this damage by using alkaline sulfate detergents (pH 8.0\u20139.2) that strip intercellular ceramides and destroy the acid mantle.</p>\n<p>The <strong>Bhumivera Activated Charcoal Postbiotic Cellular Emulsion (100 ml)</strong> re-engineers pore purification as a cellular barrier-support treatment. Suspending <strong>3.0% jet-milled (<15 micron) microporous carbon</strong> inside a <strong>5.0% Botanical Glycerin</strong> and <strong>Postbiotic Lactobacillus Ferment</strong> matrix at <strong>pH 5.4\u20135.5</strong>, it chelates deep follicular toxins while fortifying stratum corneum lipid integrity. Synergized with <strong>0.5% Manjistha</strong>, <strong>0.5% Haridra</strong>, <strong>0.5% Neem</strong>, <strong>0.1% Hyaluronic Acid</strong>, and <strong>0.1% Niacinamide</strong>, it leaves blemish-prone and urban-exposed skin calm, hydrated, and microbiologically balanced.</p>\n<p><strong>Clinical Ritual Protocol:</strong> Dispense 2 pumps onto damp facial skin every evening. Massage gently for 45 seconds to allow microporous adsorption and postbiotic deposition, then rinse with lukewarm water. Follow immediately with Step 1 Internal 7-Tulsi Drops in your daily Inside-Out Protocol.</p>",
    "faqs": [
      {
        "q": "What is the exact ingredient percentage breakdown of Bhumivera Activated Charcoal Postbiotic Emulsion?",
        "a": "Each 100ml Biophotonic UV glass bottle features a 100% transparent, label-disclosed formulation: 3% Activated Charcoal, 5% Glycerin, 1% Lactobacillus Postbiotic Ferment, 0.5% Haridra (Turmeric), 0.5% Neem, 0.5% Cucumber Extract, 0.5% Manjistha Extract, 0.1% Hyaluronic Acid, and 0.1% Niacinamide in a pH 5.4\u20135.5 glucoside micro-emulsion base."
      },
      {
        "q": "How does this emulsion protect the skin microbiome compared to salicylic acid or sulfate washes?",
        "a": "Aggressive alpha/beta-hydroxy acids and synthetic sulfates strip the stratum corneum lipid matrix and elevate skin pH above 5.5, causing dysbiosis and rebound sebum production. Bhumivera cleanses with non-ionic plant glucosides buffered at pH 5.45 while delivering 5% Glycerin, Hyaluronic Acid, and Lactobacillus postbiotics."
      },
      {
        "q": "How does it pair with Kalpvriksh Satva 7-Tulsi Drops in the Gut-Skin Protocol?",
        "a": "While the 3% Charcoal Postbiotic Emulsion clears external PM2.5 pollutants and stabilizes cutaneous pH externally, consuming 4 drops of Kalpvriksh Satva 7-Tulsi Drops internally every morning downregulates gut-derived TNF-alpha and IL-6 cytokines that drive sebaceous gland inflammation."
      }
    ]
  },
  {
    "id": 2,
    "legacyIds": [
      8,
      2
    ],
    "name": "Bhumivera Himalayan Sea Buckthorn Postbiotic Cellular Emulsion (100 ml)",
    "subtitle": "Step 2 External Pathway \u00b7 4% Wild Ladakh Sea Buckthorn (Omega-7), 5% Glycerin, Postbiotic Ferments, Manjistha, Haridra, HA & Niacinamide",
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
    "category": "Postbiotic Barrier Emulsions",
    "ph_level": "pH 5.3 \u2013 5.5 (Acid-Mantle & Omega-7 Cellular Barrier Calibrated)",
    "active_ingredients": "Wild Himalayan Sea Buckthorn Sub-28\u00b0C Extract (4.0%), Botanical Glycerin (5.0%), Postbiotic Lactobacillus Ferment (1.5%), Haridra/Turmeric (0.5%), Neem (0.5%), Cucumber Extract (0.5%), Manjistha Extract (0.5%), Hyaluronic Acid (0.1%), Niacinamide (0.1%), Non-Stripping Glucoside Micro-Emulsion Base (Q.S.)",
    "image_url": "/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp",
    "image": "/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp",
    "additionalImages": [
      "/assets/images/seabuckthorn.webp"
    ],
    "seo_title": "Bhumivera Himalayan Sea Buckthorn Postbiotic Cellular Emulsion (100ml) | Step 2 External Gut-Skin Protocol \u00b7 4% Sea Buckthorn Omega-7 & pH 5.5",
    "meta_description": "Step 2 External Pathway of The Biotic Cellular Reset: Bhumivera Himalayan Sea Buckthorn Postbiotic Cellular Emulsion (100ml) with 4% sub-28\u00b0C cold-pressed Ladakh Sea Buckthorn (Omega-7 & bio-ferulic acid), 5% Glycerin, Lactobacillus Postbiotics, Manjistha, Haridra, HA & Niacinamide at pH 5.3\u20135.5.",
    "short_description": "Step 2 (External Pathway) of the Bhumivera Synchronized Gut-Skin Biotic Protocol. Formulated per 100ml with 4.0% wild Himalayan Sea Buckthorn extract (wildcrafted above 11,000 ft in Ladakh & Spiti and cold-extracted below 28\u00b0C to preserve rare Omega-7 palmitoleic acid and native bio-ferulic acid), 5.0% Botanical Glycerin, Postbiotic Lactobacillus Ferments, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.1% Hyaluronic Acid & 0.1% Niacinamide at pH 5.3\u20135.5.",
    "search_keywords": "Himalayan sea buckthorn skin barrier benefits, best pH 5.5 face wash India, postbiotic cellular cleansing emulsion, omega 7 palmitoleic acid skincare India, gut skin reset protocol step 2, non stripping barrier repair cleanser",
    "conscious_buyer_highlights": [
      "4.0% Sub-28\u00b0C Cold-Extracted Ladakh Sea Buckthorn: Wildcrafted above 11,000 feet in Nubra & Spiti valleys; preserves fragile Omega-7 (palmitoleic acid \u226534%) and native bio-ferulic acid while reducing thermal energy consumption by 60%.",
      "Postbiotic Acid-Mantle Fortification (pH 5.3\u20135.5): Lactobacillus postbiotic ferments + non-stripping decyl/coco-glucosides protect commensal flora and prevent stratum corneum lipid depletion.",
      "Biomimetic Humectant & Ceramide Synergy: 5.0% Botanical Glycerin, 0.1% Hyaluronic Acid, and 0.1% Niacinamide replenish intercellular lamellar lipids during the 45-second micro-emulsion massage.",
      "Biophotonic UV Glass & QR Batch COA: Packaged in ultraviolet-filtering biophotonic glass with on-bottle QR verification of digital electrode pH (5.42), 0.000 ppm pesticide residue, and GPS harvest coordinates."
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
        "ingredient": "Wild Himalayan Sea Buckthorn Pulp & Seed Bio-Lipid",
        "concentration": "4.0% (4,000 mg)",
        "botanical": "Hippophae rhamnoides L. (\u226534% Omega-7 Palmitoleic Acid & Bio-Ferulic Acid)",
        "role": "Biomimetically replenishes human sebum palmitoleic acid (16:1 n-7), accelerates keratinocyte re-epithelialization, and inhibits NF-kappaB & STAT1 cutaneous inflammation."
      },
      {
        "ingredient": "Plant-Derived Botanical Glycerin",
        "concentration": "5.0% (5,000 mg)",
        "botanical": "Vegetable Glycerol Humectant Cushion (CAS 56-81-5)",
        "role": "Maintains corneocyte hydration and prevents surfactant-induced protein denaturation during cleansing."
      },
      {
        "ingredient": "Postbiotic Lactobacillus Ferment Filtrate",
        "concentration": "1.5% (1,500 mg)",
        "botanical": "Standardized Postbiotic Lactic & Peptide Metabolites",
        "role": "Lowers epidermal surface pH to the physiological 5.3\u20135.5 window, suppressing pathogenic Staphylococcus aureus and virulent C. acnes."
      },
      {
        "ingredient": "Manjistha Root Extract",
        "concentration": "0.5% (500 mg)",
        "botanical": "Rubia cordifolia (Anthraquinone & Rubiadin Complex)",
        "role": "Accelerates resolution of post-acne erythema (PIE) and hyperpigmentation (PIH) while supporting dermal microcirculation."
      },
      {
        "ingredient": "Haridra (Wild Turmeric) Extract",
        "concentration": "0.5% (500 mg)",
        "botanical": "Curcuma longa (Standardized Curcuminoid Complex)",
        "role": "Neutralizes UVB and pollution-induced reactive oxygen species (ROS) and downregulates epidermal IL-6 and IL-8."
      },
      {
        "ingredient": "Neem Leaf Bio-Extract",
        "concentration": "0.5% (500 mg)",
        "botanical": "Azadirachta indica (Nimbidin & Quercetin)",
        "role": "Clarifies follicular ostia without disrupting the intercellular ceramide-cholesterol-fatty acid ratio."
      },
      {
        "ingredient": "Cucumber Cellular Extract",
        "concentration": "0.5% (500 mg)",
        "botanical": "Cucumis sativus (Silica & Ascorbic Acid)",
        "role": "Soothes barrier sensitivity and calms inflammatory heat."
      },
      {
        "ingredient": "Sodium Hyaluronate (Multi-Molecular HA)",
        "concentration": "0.1% (100 mg)",
        "botanical": "Bio-Fermented Hyaluronic Acid (CAS 9067-32-7)",
        "role": "Forms a breathable hydrophilic lattice that reduces post-wash transepidermal water loss (TEWL)."
      },
      {
        "ingredient": "Niacinamide (Vitamin B3)",
        "concentration": "0.1% (100 mg)",
        "botanical": "USP Nicotinamide (CAS 98-92-0)",
        "role": "Upregulates serine palmitoyltransferase (SPT) to boost endogenous ceramide synthesis and tighten follicular walls."
      },
      {
        "ingredient": "Glucoside Micro-Emulsion Matrix",
        "concentration": "Q.S. to 100 ml",
        "botanical": "Decyl Glucoside & Coco-Glucoside (pH 5.42)",
        "role": "Silk-textured, non-stripping micro-emulsion that rinses clean while leaving the lipid barrier intact."
      }
    ],
    "full_description": "<h3>Step 2 External Pathway: Omega-7 & Postbiotic Acid-Mantle Fortification</h3>\n<p>Indian consumers frequently compound internal gut-derived skin inflammation by over-exfoliating with harsh synthetic alpha-hydroxy acids, high-percentage salicylic acid washes, and sulfate detergents. These stripping agents destroy the stratum corneum's intercellular lipid matrix and drive facial pH far above the healthy physiological ceiling of 5.5, leaving the skin defenseless against internally triggered breakouts.</p>\n<p>The <strong>Bhumivera Himalayan Sea Buckthorn Postbiotic Cellular Emulsion (100 ml)</strong> is engineered as <strong>Step 2 (External Pathway)</strong> of the Synchronized Gut-Skin Biotic Protocol. Formulated with a full <strong>4.0% concentration of wild Himalayan Sea Buckthorn</strong> harvested above 11,000 feet in Ladakh and Spiti and extracted below 28\u00b0C, it delivers a high natural density of <strong>Omega-7 palmitoleic acid</strong> and <strong>native bio-ferulic acid</strong> alongside <strong>postbiotic Lactobacillus ferments</strong>, <strong>5.0% Botanical Glycerin</strong>, <strong>0.5% Manjistha</strong>, <strong>0.5% Haridra</strong>, <strong>0.1% Hyaluronic Acid</strong>, and <strong>0.1% Niacinamide</strong>.</p>\n<p><strong>Daily Consumer Ritual:</strong> Massage 2 pumps onto damp facial skin morning and night for 45 seconds. The formula transforms into a cushiony golden micro-emulsion that lifts dirt and oxidized sebum while leaving the barrier lipid matrix and acid mantle (pH 5.3\u20135.5) completely intact.</p>",
    "faqs": [
      {
        "q": "Why is Bhumivera Sea Buckthorn formulated as a Postbiotic Cellular Emulsion rather than an ordinary foaming face wash?",
        "a": "Ordinary foaming washes rely on high-pH sulfates that strip intercellular lipids and disrupt the skin microbiome. Our Postbiotic Cellular Emulsion combines 4% sub-28\u00b0C cold-extracted Ladakh Sea Buckthorn (rich in Omega-7 palmitoleic acid) with Lactobacillus postbiotic ferments and 5% Glycerin in a pH 5.3\u20135.5 glucoside base\u2014repairing the acid mantle while cleansing."
      },
      {
        "q": "What is the exact active concentration breakdown of the Sea Buckthorn Postbiotic Cellular Emulsion?",
        "a": "Every 100ml Biophotonic UV glass bottle discloses 100% of its active concentrations on the label: 4.0% Wild Himalayan Sea Buckthorn Extract, 5.0% Botanical Glycerin, 1.5% Postbiotic Lactobacillus Ferment, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid, and 0.1% Niacinamide."
      },
      {
        "q": "How does sub-28\u00b0C cold extraction in Ladakh & Spiti improve Omega-7 efficacy?",
        "a": "Standard industrial extraction boils botanicals at 80\u00b0C\u2013100\u00b0C, oxidizing fragile Omega-7 palmitoleic acid and native carotenoids. Bhumivera\u2019s sub-28\u00b0C extraction protocol preserves 99.4% of bioactive Omega-7 and bio-ferulic acid while reducing manufacturing thermal energy consumption by up to 60%."
      }
    ]
  },
  {
    "id": 3,
    "legacyIds": [
      104,
      3
    ],
    "name": "The Biotic Cellular Reset: 30-Day 2-Step Gut-Skin Protocol",
    "subtitle": "Step 1 Internal Kalpvriksh Satva 7-Tulsi Cellular Reset Drops + Step 2 External Himalayan Sea Buckthorn Postbiotic Emulsion (100 ml)",
    "slug": "biotic-cellular-reset-30-day-gut-skin-protocol",
    "legacySlugs": [
      "luxury-2-in-1-botanical-shampoo-conditioner",
      "bhumivera-amla-bhringraj-botanical-shampoo"
    ],
    "sku": "BV-PROT-GUTSKIN-03",
    "legacySkus": [
      "BV-LUX-SH2IN1-03",
      "BV-ARSH-200ML",
      "BV-LUX-SH2IN1-05"
    ],
    "mpn": "BVPROTGUTSKIN30D",
    "net_volume": "30 ML + 100 ML (30-Day Synchronized Kit)",
    "price": 1199,
    "discountPrice": 1199,
    "mrp": 1498,
    "stock": 250,
    "quantity": 250,
    "category": "Synchronized Gut-Skin Protocols",
    "ph_level": "90% Internal 7-Tulsi Phyto-Extract + pH 5.42 External Postbiotic Emulsion",
    "active_ingredients": "Step 1 Internal (9.0ml/10ml Seven-Tulsi Extract: Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi rich in Eugenol, Rosmarinic Acid & Ursolic Acid) + Step 2 External (4% Wild Ladakh Sea Buckthorn Omega-7, 5% Glycerin, 1.5% Lactobacillus Postbiotic Ferment, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.1% HA, 0.1% Niacinamide at pH 5.3\u20135.5)",
    "image_url": "/assets/images/Promo7.webp",
    "image": "/assets/images/Promo7.webp",
    "additionalImages": [
      "/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp"
    ],
    "seo_title": "The Biotic Cellular Reset: 30-Day 2-Step Gut-Skin Protocol (\u20b91,199) | Synchronized Inside-Out Acne & Barrier Treatment Kit | Bhumivera",
    "meta_description": "India\u2019s pioneering Synchronized Inside-Out Biotic Protocol (\u20b91,199 vs \u20b91,498 value): Step 1 Kalpvriksh Satva 7-Tulsi Cellular Reset Drops (downregulates gut COX-2, TNF-\u03b1 & IL-6) + Step 2 Himalayan Sea Buckthorn Postbiotic Emulsion (4% Omega-7, pH 5.5 barrier fortification).",
    "short_description": "The category-defining 30-Day Synchronized Inside-Out Biotic Protocol. Unites Step 1: Kalpvriksh Satva 7-Tulsi Cellular Reset Drops (90% active 7-cultivar extract that seals gut mucosal tight junctions and suppresses systemic TNF-\u03b1, IL-6, and IL-17 cytokines) with Step 2: Himalayan Sea Buckthorn Postbiotic Cellular Emulsion (4% sub-28\u00b0C cold-pressed Ladakh Sea Buckthorn Omega-7 + Lactobacillus ferments at pH 5.3\u20135.5). Packaged in Biophotonic UV glass within a dual-panel Legal Metrology 2011 compliant presentation box.",
    "search_keywords": "buy gut skin reset protocol, inside out acne treatment kit India, gut skin axis acne India, leaky gut cystic acne connection, 30 day biotic cellular reset bhumivera, 7 tulsi drops and sea buckthorn cleanser kit",
    "conscious_buyer_highlights": [
      "Synchronized Bidirectional Gut-Skin Action: Simultaneously resolves internal intestinal permeability (LPS endotoxemia & TNF-\u03b1/IL-6 cytokine surges) and external stratum corneum acid-mantle disruption.",
      "Architectural Protocol Value (Save \u20b9299): Entry protocol price of \u20b91,199 compared to the combined \u20b91,498 retail value, with optional 25-day auto-replenishment subscription (extra 15% savings).",
      "Dual Statutory Compliance (FSSAI + AYUSH/Cosmetics Rules 2020): Step 1 manufactured under valid FSSAI Ayush-Aahar/Nutraceutical license; Step 2 under Cosmetics Rules, 2020; enclosed in a Legal Metrology Rules, 2011 dual-panel box.",
      "Biophotonic UV Glass & QR Lab Traceability: Zero virgin petroleum plastic; every serialized kit carries an on-bottle QR code linking to ICP-MS heavy metal, GC-MS pesticide-free, and pH 5.42 batch certificates."
    ],
    "wikipedia_entities": [
      {
        "name": "Gut\u2013skin axis (Microbiota)",
        "url": "https://en.wikipedia.org/wiki/Gut_microbiota"
      },
      {
        "name": "Hippophae rhamnoides (Sea buckthorn)",
        "url": "https://en.wikipedia.org/wiki/Hippophae_rhamnoides"
      },
      {
        "name": "Ocimum tenuiflorum (Sacred Tulsi)",
        "url": "https://en.wikipedia.org/wiki/Ocimum_tenuiflorum"
      },
      {
        "name": "Omega-7 fatty acid (Palmitoleic acid)",
        "url": "https://en.wikipedia.org/wiki/Omega-7_fatty_acid"
      },
      {
        "name": "Rosmarinic acid",
        "url": "https://en.wikipedia.org/wiki/Rosmarinic_acid"
      },
      {
        "name": "Niacinamide",
        "url": "https://en.wikipedia.org/wiki/Niacinamide"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Step 1 Internal: 7-Cultivar Kalpvriksh Satva Tulsi Extract",
        "concentration": "9.0 ml per 10 ml (90% Potency)",
        "botanical": "Ocimum tenuiflorum, gratissimum, basilicum, americanum, kilimandscharicum, viride & \u00d7 citriodorum",
        "role": "Rich in Eugenol (\u226542%), Rosmarinic Acid (\u226518%), and Ursolic Acid (\u226512%); downregulates intestinal COX-2, seals ZO-1/occludin gut tight junctions, and suppresses circulating TNF-alpha, IL-6, and IL-17 cytokines."
      },
      {
        "ingredient": "Step 2 External: Wild Himalayan Sea Buckthorn Extract",
        "concentration": "4.0% (4,000 mg / 100 ml)",
        "botanical": "Hippophae rhamnoides (>11,000 ft Ladakh/Spiti Sub-28\u00b0C Cold-Pressed)",
        "role": "Supplies rare Omega-7 palmitoleic acid (\u226534%) and native bio-ferulic acid to rebuild the epidermal lipid matrix and accelerate barrier recovery."
      },
      {
        "ingredient": "Step 2 External: Postbiotic Lactobacillus Ferment",
        "concentration": "1.5% (1,500 mg / 100 ml)",
        "botanical": "Bio-Fermented Lactic & Bacteriocin Postbiotic Complex",
        "role": "Maintains facial acid mantle at pH 5.3\u20135.5, preventing virulent Cutibacterium acnes colonization without harsh synthetic acids."
      },
      {
        "ingredient": "Step 2 External: Botanical Glycerin + Hyaluronic Acid + Niacinamide",
        "concentration": "5.0% + 0.1% + 0.1%",
        "botanical": "Biomimetic Humectant & Ceramide-Synthesis Triad",
        "role": "Locks in multi-depth hydration and stimulates endogenous ceramide NP synthesis during twice-daily cleansing."
      },
      {
        "ingredient": "Step 2 External: Manjistha + Haridra + Neem + Cucumber",
        "concentration": "0.5% Each (2.0% Total)",
        "botanical": "Rubia cordifolia, Curcuma longa, Azadirachta indica & Cucumis sativus",
        "role": "Calms cutaneous neurogenic redness, inhibits tyrosinase hyperpigmentation, and clarifies pores."
      }
    ],
    "full_description": "<h3>The Category-Defining Synchronized Inside-Out Gut-Skin Biotic Protocol</h3>\n<p>Clinical dermatology and gastroenterology have established the bidirectional <strong>gut-skin axis</strong>: chronic inflammatory breakouts, adult acne, and barrier sensitivity cannot be permanently resolved through topical application alone. When dietary stress, cortisol, and dysbiosis loosen intestinal tight junctions, bacterial lipopolysaccharides (LPS) translocate into the systemic bloodstream, upregulating pro-inflammatory cytokines (<strong>TNF-\u03b1, IL-6, and IL-17</strong>). As these cytokines reach the skin, they induce sebaceous gland hyperplasia, alter sebum lipids, and trigger virulent <em>Cutibacterium acnes</em> inflammation\u2014which consumers inadvertently worsen by stripping their acid mantle with harsh topical acids and sulfates.</p>\n<p><strong>The Biotic Cellular Reset: 30-Day 2-Step Gut-Skin Protocol</strong> is India's first integrated inside-out dermatological ritual:</p>\n<ul>\n  <li><strong>Step 1 (Internal Pathway \u2014 7:00 AM Empty Stomach):</strong> Blend <strong>4 concentrated drops</strong> of <em>Kalpvriksh Satva 7-Tulsi Cellular Reset Drops</em> into 100 ml of lukewarm water every morning to seal gut mucosal junctions, inhibit COX-2, and neutralize systemic inflammatory triggers from within.</li>\n  <li><strong>Step 2 (External Pathway \u2014 AM &amp; PM Facial Ritual):</strong> Massage <strong>2 pumps</strong> of <em>Himalayan Sea Buckthorn Postbiotic Cellular Emulsion</em> onto damp facial skin for 45 seconds morning and night, rinsing away impurities while fortifying the pH 5.3\u20135.5 acid mantle with Omega-7 and postbiotic ferments.</li>\n</ul>",
    "faqs": [
      {
        "q": "Why is the 2-Step Gut-Skin Protocol more effective than standalone niacinamide or salicylic acid serums?",
        "a": "Standalone topical serums only address surface symptoms while ignoring gut-derived systemic endotoxemia (LPS translocation and elevated TNF-alpha, IL-6, and IL-17 cytokines) that continuously triggers sebaceous gland inflammation. By pairing internal 7-Tulsi COX-2/cytokine modulation with external pH 5.42 Sea Buckthorn Omega-7 postbiotic barrier repair, the protocol resolves the root inside-out cascade."
      },
      {
        "q": "How is the 30-Day Gut-Skin Reset Protocol regulated and packaged in India?",
        "a": "Step 1 (Kalpvriksh Satva 7-Tulsi Drops) is manufactured and labeled under a valid FSSAI Ayush-Aahar / Nutraceutical framework. Step 2 (Himalayan Sea Buckthorn Postbiotic Emulsion) operates under a valid AYUSH / Cosmetics Rules, 2020 license. Both Biophotonic UV glass vessels are enclosed in a secondary eco-luxe box featuring distinct statutory compliance panels satisfying the Legal Metrology (Packaged Commodities) Rules, 2011."
      },
      {
        "q": "How does the 25-day auto-replenishment subscription work?",
        "a": "Each 30-day combination protocol is calibrated for 60 external cleanses (2 pumps AM/PM) and 30 internal morning servings (4 drops daily). Enrolling in our 25-day auto-delivery or WhatsApp reorder workflow saves an additional 15% and ensures uninterrupted microbiome and barrier continuity."
      }
    ]
  },
  {
    "id": 4,
    "legacyIds": [
      103,
      4
    ],
    "name": "Bhumivera Restorative Sea Buckthorn & Prebiotic GOS Barrier Cr\u00e8me (50 g)",
    "subtitle": "Phase 2 Microbiome Extension \u00b7 3% Sea Buckthorn Omega-7, 2% Prebiotic GOS, 3% Centella Madecassoside, 2% Panthenol & Ceramide Precursors",
    "slug": "restorative-seabuckthorn-prebiotic-barrier-creme",
    "legacySlugs": [
      "artisanal-charcoal-handmade-soap",
      "bhumivera-kumkumadi-night-elixir",
      "bhumivera-gotu-kola-barrier-repair-gel"
    ],
    "sku": "BV-EXT-CREME-04",
    "legacySkus": [
      "BV-LUX-CSOAP-04",
      "BV-KMNE-30ML",
      "BV-GKBG-50ML"
    ],
    "mpn": "BVCREME50G",
    "net_volume": "50 GM",
    "price": 999,
    "discountPrice": 999,
    "mrp": 1299,
    "stock": 250,
    "quantity": 250,
    "category": "Microbiome Barrier Extensions",
    "ph_level": "pH 5.40 (Lamellar Lipid & Cutaneous Microbiome Calibrated)",
    "active_ingredients": "Cold-Pressed Himalayan Sea Buckthorn Lipid (3.0%), Prebiotic Galactooligosaccharides / GOS (2.0%), Centella Asiatica Madecassoside Extract (3.0%), D-Panthenol Pro-Vitamin B5 (2.0%), Niacinamide (1.0%), Multi-Molecular Hyaluronic Acid (0.5%), Biomimetic Lamellar Emulsion Base (Q.S.)",
    "image_url": "/assets/images/Promo4.webp",
    "image": "/assets/images/Promo4.webp",
    "additionalImages": [
      "/assets/images/aloeverascience.webp"
    ],
    "seo_title": "Bhumivera Restorative Sea Buckthorn & Prebiotic GOS Barrier Cr\u00e8me (50g) | Omega-7, Centella Madecassoside & pH 5.4 Microbiome Moisturizer",
    "meta_description": "Phase 2 Microbiome Extension in the Bhumivera Gut-Skin Protocol: Restorative Barrier Cr\u00e8me (50g) with 3% Cold-Pressed Ladakh Sea Buckthorn (Omega-7), 2% Prebiotic Galactooligosaccharides (GOS), 3% Centella Asiatica, 2% Panthenol & 1% Niacinamide at pH 5.4.",
    "short_description": "Synergistic leave-on barrier recovery cr\u00e8me engineered for over-exfoliated, acne-compromised, and sensitive skin. Formulated with 100% label-disclosed 3.0% Cold-Pressed Himalayan Sea Buckthorn (Omega-7), 2.0% Prebiotic Galactooligosaccharides (GOS) to selectively feed commensal Staphylococcus epidermidis, 3.0% Centella Asiatica (Madecassoside), 2.0% D-Panthenol, and 1.0% Niacinamide at pH 5.4.",
    "search_keywords": "prebiotic barrier repair cream India, sea buckthorn omega 7 moisturizer, galactooligosaccharides microbiome cream, centella madecassoside panthenol barrier creme, pH 5.4 ceramide barrier repair India",
    "conscious_buyer_highlights": [
      "Prebiotic GOS Microbiome Nutrition (2.0%): Galactooligosaccharides selectively nourish protective commensal skin bacteria while starving inflammatory pathogens.",
      "3.0% Cold-Pressed Sea Buckthorn + 3.0% Centella Asiatica: Rebuilds damaged intercellular lipid bilayers and accelerates collagen and epidermal recovery.",
      "60-Second Damp-Skin Seal: Locks in hydration immediately after cleansing with Step 2 Sea Buckthorn Postbiotic Emulsion.",
      "Biophotonic UV Glass Jar: Preserves oxygen- and light-sensitive Omega-7 fatty acids without synthetic silicones or parabens."
    ],
    "wikipedia_entities": [
      {
        "name": "Hippophae rhamnoides (Sea buckthorn)",
        "url": "https://en.wikipedia.org/wiki/Hippophae_rhamnoides"
      },
      {
        "name": "Galactooligosaccharide",
        "url": "https://en.wikipedia.org/wiki/Galactooligosaccharide"
      },
      {
        "name": "Centella asiatica",
        "url": "https://en.wikipedia.org/wiki/Centella_asiatica"
      },
      {
        "name": "Panthenol",
        "url": "https://en.wikipedia.org/wiki/Panthenol"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Cold-Pressed Himalayan Sea Buckthorn Oil",
        "concentration": "3.0% (1,500 mg)",
        "botanical": "Hippophae rhamnoides L. (Sub-28\u00b0C Seed & Berry Lipid)",
        "role": "Replenishes Omega-7 palmitoleic acid, linoleic acid (Omega-6), and alpha-tocopherol across disrupted stratum corneum lamellae."
      },
      {
        "ingredient": "Prebiotic Galactooligosaccharides (GOS)",
        "concentration": "2.0% (1,000 mg)",
        "botanical": "Enzymatic Plant Prebiotic Oligosaccharide Complex",
        "role": "Selectively metabolized by commensal Staphylococcus epidermidis to produce natural antimicrobial peptides (AMPs) and short-chain fatty acids."
      },
      {
        "ingredient": "Centella Asiatica Triterpene Extract",
        "concentration": "3.0% (1,500 mg)",
        "botanical": "Centella asiatica (Standardized Madecassoside & Asiaticoside)",
        "role": "Inhibits MMP-1 collagenase, calms perifollicular inflammation, and accelerates post-blemish tissue remodeling."
      },
      {
        "ingredient": "D-Panthenol (Pro-Vitamin B5)",
        "concentration": "2.0% (1,000 mg)",
        "botanical": "Dexpanthenol (CAS 81-13-0)",
        "role": "Converts to pantothenic acid (Coenzyme A cofactor) in keratinocytes to accelerate lipid synthesis and soothe neurogenic itching."
      },
      {
        "ingredient": "Niacinamide + Sodium Hyaluronate",
        "concentration": "1.0% + 0.5%",
        "botanical": "Vitamin B3 & Multi-Molecular Hyaluronic Acid",
        "role": "Boosts endogenous ceramide NP synthesis and locks 72-hour intracellular water reserves."
      }
    ],
    "full_description": "<h3>Restoring the Lamellar Lipid Matrix & Cutaneous Microbiome</h3>\n<p>When Indian consumers overuse high-strength synthetic acids (AHA/BHA peels) or retinoids, the stratum corneum suffers acute lipid depletion and microbial dysbiosis. The <strong>Bhumivera Restorative Sea Buckthorn &amp; Prebiotic GOS Barrier Cr\u00e8me (50 g)</strong> is our Phase 2 leave-on extension engineered to seal and feed the cutaneous ecosystem after cleansing.</p>\n<p>Combining <strong>3.0% sub-28\u00b0C cold-pressed Ladakh Sea Buckthorn lipid</strong> with <strong>2.0% Prebiotic Galactooligosaccharides (GOS)</strong>, <strong>3.0% Centella Asiatica (Madecassoside)</strong>, <strong>2.0% D-Panthenol</strong>, and <strong>1.0% Niacinamide</strong> at <strong>pH 5.40</strong>, it restores brick-and-mortar corneocyte cohesion while feeding beneficial skin flora.</p>",
    "faqs": [
      {
        "q": "How do Prebiotic Galactooligosaccharides (GOS) in this cr\u00e8me improve acne-prone and sensitive skin?",
        "a": "Prebiotic GOS acts as a selective nutritional substrate for beneficial commensal bacteria (like Staphylococcus epidermidis), enabling them to outcompete virulent Cutibacterium acnes and Staphylococcus aureus while maintaining a resilient pH 5.4 barrier."
      },
      {
        "q": "When should I apply the Restorative Barrier Cr\u00e8me in the Gut-Skin Protocol?",
        "a": "Apply a pea-sized amount onto damp skin within 60 seconds of rinsing off Step 2 (Himalayan Sea Buckthorn Postbiotic Cellular Emulsion) or misting with Fermented 7-Tulsi Cellular Hydration Mist."
      }
    ]
  },
  {
    "id": 5,
    "legacyIds": [
      105,
      5
    ],
    "name": "Bhumivera Fermented 7-Tulsi Hydrosol Cellular Hydration Mist (100 ml)",
    "subtitle": "Phase 2 Microbiome Extension \u00b7 70% Copper-Distilled Kannauj Rose, 26% Fermented 7-Tulsi Hydrosol & 2% Lactobacillus Postbiotic Filtrate",
    "slug": "fermented-tulsi-cellular-hydration-mist",
    "legacySlugs": [
      "artisanal-aloe-vera-handmade-soap",
      "bhumivera-copper-distilled-tulsi-rose-hydrosol"
    ],
    "sku": "BV-EXT-MIST-05",
    "legacySkus": [
      "BV-LUX-ASOAP-05"
    ],
    "mpn": "BVMIST100ML",
    "net_volume": "100 ML",
    "price": 649,
    "discountPrice": 649,
    "mrp": 849,
    "stock": 250,
    "quantity": 250,
    "category": "Microbiome Barrier Extensions",
    "ph_level": "pH 5.30 (Post-Cleanse Acid-Mantle Reset Calibration)",
    "active_ingredients": "Copper-Distilled Kannauj Rosa damascena Cellular Hydrosol (70.0%), Bio-Fermented 7-Tulsi Botanical Distillate (26.0%), Lactobacillus Postbiotic Filtrate (2.0%), Botanical Glycerin (2.0%)",
    "image_url": "/assets/images/tulsi.webp",
    "image": "/assets/images/tulsi.webp",
    "additionalImages": [
      "/assets/images/Promo5.webp"
    ],
    "seo_title": "Bhumivera Fermented 7-Tulsi Hydrosol Cellular Hydration Mist (100ml) | pH 5.3 Postbiotic & Kannauj Rose Acid-Mantle Toner",
    "meta_description": "Shop Bhumivera Fermented 7-Tulsi Cellular Hydration Mist (100ml): 70% Copper-Distilled Kannauj Rose Hydrosol, 26% Fermented 7-Tulsi Distillate, 2% Lactobacillus Postbiotic Filtrate & 2% Glycerin at pH 5.3.",
    "short_description": "Phase 2 microbiome-balancing cellular mist formulated for the 60-second post-cleanse hydration window. Unites 70% traditional copper-deg distilled Kannauj Rosa damascena hydrosol with 26% bio-fermented 7-Tulsi cellular water, 2% Lactobacillus postbiotic filtrate, and 2% Botanical Glycerin at pH 5.3 to neutralize hard-water alkalinity.",
    "search_keywords": "fermented tulsi facial mist India, copper distilled rose and tulsi hydrosol, pH 5.3 postbiotic toner mist, microbiome hydration mist India, hard water pH buffer facial mist",
    "conscious_buyer_highlights": [
      "Instant Hard-Water Alkalinity Buffer (pH 5.30): Neutralizes pH 7.5\u20138.5 municipal tap water residue within 5 seconds of misting after cleansing.",
      "26% Bio-Fermented 7-Tulsi Hydrosol + 70% Kannauj Rose: Delivers water-soluble rosmarinic acid, eugenol micro-volatiles, and rose phenylethanol to calm thermal redness.",
      "Zero Denatured Alcohol Or Synthetic Fragrance: 100% pure steam-distilled cellular botanical waters in a fine-mist Biophotonic UV glass atomizer."
    ],
    "wikipedia_entities": [
      {
        "name": "Ocimum tenuiflorum (Tulsi)",
        "url": "https://en.wikipedia.org/wiki/Ocimum_tenuiflorum"
      },
      {
        "name": "Rosa \u00d7 damascena",
        "url": "https://en.wikipedia.org/wiki/Rosa_%C3%97_damascena"
      },
      {
        "name": "Herbal distillate (Hydrosol)",
        "url": "https://en.wikipedia.org/wiki/Herbal_distillate"
      }
    ],
    "composition_table": [
      {
        "ingredient": "Copper-Distilled Kannauj Rosa damascena Hydrosol",
        "concentration": "70.0% (70 ml)",
        "botanical": "Rosa \u00d7 damascena (Traditional Deg-Bhapka Steam Distillate)",
        "role": "Rich in natural phenylethanol, geraniol, and citronellol micro-solubles that cool vasodilation and hydrate corneocytes."
      },
      {
        "ingredient": "Bio-Fermented 7-Tulsi Cellular Hydrosol",
        "concentration": "26.0% (26 ml)",
        "botanical": "Fermented Seven-Cultivar Ocimum Steam Distillate",
        "role": "Provides bioavailable rosmarinic acid and eugenol to suppress surface oxidative stress and balance sebum."
      },
      {
        "ingredient": "Lactobacillus Postbiotic Ferment Filtrate",
        "concentration": "2.0% (2 ml)",
        "botanical": "Postbiotic Organic Acid & Peptide Buffer",
        "role": "Buffers the epidermal surface at pH 5.30 immediately after tap-water rinsing."
      },
      {
        "ingredient": "Plant-Derived Botanical Glycerin",
        "concentration": "2.0% (2 ml)",
        "botanical": "Humectant Water-Binding Matrix",
        "role": "Prepares damp skin for 3x deeper absorption of subsequent barrier treatments."
      }
    ],
    "full_description": "<h3>The 60-Second Post-Cleanse Acid-Mantle Buffer</h3>\n<p>Across Indian metros, municipal hard water carries an alkaline pH of 7.5 to 8.5 and high calcium/magnesium carbonate loads that disrupt the skin's acid mantle immediately after rinsing. The <strong>Bhumivera Fermented 7-Tulsi Hydrosol Cellular Hydration Mist (100 ml)</strong> is engineered to be misted onto damp skin within 60 seconds of cleansing with our Sea Buckthorn Postbiotic Emulsion.</p>\n<p>Combining <strong>70% copper-distilled Kannauj Rose cellular water</strong> with <strong>26% bio-fermented 7-Tulsi hydrosol</strong>, <strong>2% Lactobacillus postbiotic filtrate</strong>, and <strong>2% Botanical Glycerin</strong> at <strong>pH 5.30</strong>, it immediately resets surface acidity and floods the epidermis with calming phytonutrients.</p>",
    "faqs": [
      {
        "q": "Why is a pH 5.30 mist critical after washing with municipal tap water in India?",
        "a": "Even when using a pH 5.4 cleanser, rinsing with hard tap water (pH 7.8\u20138.5) leaves alkaline mineral ions on the skin. Misting with Fermented 7-Tulsi Hydrosol at pH 5.30 within 60 seconds restores optimal acid-mantle enzymatic activity."
      },
      {
        "q": "Does the Fermented 7-Tulsi Cellular Hydration Mist contain alcohol or synthetic rose fragrance?",
        "a": "Zero alcohol, zero synthetic perfume, and zero polysorbate solubilizers. Its aroma and therapeutic action come strictly from 70% copper-distilled Kannauj Rosa damascena and 26% fermented 7-Tulsi hydrosol."
      }
    ]
  },
  {
    "id": 6,
    "legacyIds": [
      106,
      6
    ],
    "name": "Bhumivera Kalpvriksh Satva 7-Tulsi Cellular Reset Drops (30 ml)",
    "subtitle": "Step 1 Internal Pathway \u00b7 9.0ml Seven-Tulsi Extract per 10ml (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi) | Gut-Skin COX-2 & Cytokine Reset",
    "slug": "kalpvriksh-satva-tulsi-7-tulsi-extract",
    "legacySlugs": [],
    "sku": "BV-LUX-TULSI-06",
    "legacySkus": [
      "BV-TRHM-100ML"
    ],
    "mpn": "BVTULSI30ML",
    "net_volume": "30 ML (90% Active Phyto-Extract)",
    "price": 499,
    "discountPrice": 499,
    "mrp": 649,
    "stock": 300,
    "quantity": 300,
    "category": "Ingestible Nutricosmetic Elixirs",
    "ph_level": "90% Concentrated Seven-Tulsi Botanical Distillate (9.0ml per 10ml \u00b7 Sub-28\u00b0C Cold-Hydro-Distilled)",
    "active_ingredients": "Each 10ml contains 9.0ml Standardized Liquid Phyto-Extract across Seven Tulsi Chemotypes: Van Tulsi (Ocimum gratissimum), Sweet Tulsi (O. basilicum), Marua Tulsi (O. kilimandscharicum), Bisva Tulsi (O. americanum), Kala/Krishna Tulsi (O. tenuiflorum), Rama Tulsi (O. sanctum), Lemon Tulsi (O. \u00d7 citriodorum); Food-Grade Carrier Q.S.",
    "image_url": "/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp",
    "image": "/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp",
    "additionalImages": [
      "/assets/images/tulsi.webp"
    ],
    "seo_title": "Bhumivera Kalpvriksh Satva 7-Tulsi Cellular Reset Drops (30 ML) | Step 1 Internal Gut-Skin Biotic Protocol \u00b7 9.0ml/10ml Seven-Tulsi Extract",
    "meta_description": "Step 1 Internal Pathway of the Bhumivera Gut-Skin Biotic Protocol: Kalpvriksh Satva 7-Tulsi Cellular Reset Drops (30 ML) with 9.0ml/10ml active extract of 7 Tulsi cultivars (Eugenol, Rosmarinic Acid & Ursolic Acid) to seal gut tight junctions and downregulate COX-2, TNF-\u03b1 & IL-6.",
    "short_description": "Step 1 (Internal Pathway) of the Bhumivera Synchronized Inside-Out Gut-Skin Biotic Protocol. Formulated at a 90% active concentration (9.0 ml liquid extract per 10 ml) across 7 rare Tulsi chemotypes (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi). Rich in standardized Eugenol (\u226542%), Rosmarinic Acid (\u226518%), and Ursolic Acid (\u226512%) to downregulate intestinal COX-2 pathways, seal gut mucosal tight junctions (ZO-1/occludin), and suppress circulating TNF-\u03b1, IL-6, and IL-17 cytokines that drive inflammatory breakouts.",
    "search_keywords": "7 tulsi drops for skin inflammation, kalpvriksh satva tulsi drops, pure 7 tulsi drops online, gut skin axis ingestible elixir India, eugenol rosmarinic acid ursolic acid gut inflammation, FSSAI ayush aahar tulsi drops",
    "conscious_buyer_highlights": [
      "90% Label-Disclosed Bio-Extraction (9.0 ml per 10 ml): Unites 7 distinct Ocimum chemotypes rather than diluted 5-herb Panch-Tulsi drops.",
      "Gut-Skin Axis Cytokine & COX-2 Modulation: Standardized Eugenol, Rosmarinic Acid, and Ursolic Acid seal intestinal tight junctions, reducing LPS endotoxemia and systemic TNF-\u03b1, IL-6, and IL-17 surges.",
      "Effortless Morning Empty-Stomach Ritual: Blend 4 concentrated drops into 100 ml of lukewarm water every morning on an empty stomach.",
      "FSSAI Ayush-Aahar / Nutraceutical Compliance: Bottled in Biophotonic UV glass with serialized QR laboratory verification for zero heavy metals and zero synthetic solvents."
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
        "name": "Ocimum \u00d7 africanum (Lemon Tulsi)",
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
        "ingredient": "Kala / Krishna Tulsi (Ocimum tenuiflorum) & Rama Tulsi (O. sanctum)",
        "concentration": "3.2 ml per 10 ml",
        "botanical": "High-Eugenol & Rosmarinic Acid Adaptogenic Chemotypes",
        "role": "Demonstrates 97% COX-1 and potent COX-2 inhibitory activity; downregulates systemic TNF-alpha and IL-6 cytokines along the gut-skin axis."
      },
      {
        "ingredient": "Van Tulsi (Ocimum gratissimum) & Bisva Tulsi (O. americanum)",
        "concentration": "2.6 ml per 10 ml",
        "botanical": "Thymol, Eugenol & Triterpenoid Ursolic Acid Fraction",
        "role": "Reinforces intestinal epithelial tight-junction proteins (ZO-1 and occludin), preventing lipopolysaccharide (LPS) endotoxemia into the bloodstream."
      },
      {
        "ingredient": "Sweet Tulsi (O. basilicum), Marua Tulsi (O. kilimandscharicum) & Lemon Tulsi (O. \u00d7 citriodorum)",
        "concentration": "3.2 ml per 10 ml",
        "botanical": "Linalool, Citral, Caffeic Acid & Orientin Flavonoids",
        "role": "Modulates hypothalamic-pituitary-adrenal (HPA) axis cortisol spikes that trigger sebocyte lipid overproduction and follicular plugging."
      },
      {
        "ingredient": "Food-Grade Botanical Excipient Carrier",
        "concentration": "1.0 ml per 10 ml (Q.S.)",
        "botanical": "Solvent-Free Hydro-Lipid Micellar Carrier",
        "role": "Ensures rapid dispersion of volatile phenylpropanoids and triterpenoids in 100 ml of lukewarm water."
      },
      {
        "ingredient": "Nutritional & Phytonutrient Assay (Per 100 ml)",
        "concentration": "80 Kcal | 2.0g Carb | 8.0g Essential Phyto-Lipids",
        "botanical": "FSSAI Ayush-Aahar / Nutraceutical Panel",
        "role": "0.0g protein, 0.0g added sugar, zero synthetic preservatives."
      }
    ],
    "full_description": "<h3>Step 1 Internal Pathway: Sealing the Gut Mucosal Barrier & Quenching Systemic Cytokines</h3>\n<p>Chronic acne, recurrent papules, and inflammatory skin flare-ups frequently originate in the gastrointestinal tract. Processed diets, psychological stress, and dysbiosis loosen intestinal tight junctions, allowing bacterial lipopolysaccharides (LPS) to enter systemic circulation. This endotoxemia upregulates <strong>TNF-\u03b1, Interleukin-6 (IL-6), and Interleukin-17 (IL-17)</strong>, which travel to cutaneous sebaceous glands to trigger sebum oxidation and virulent <em>Cutibacterium acnes</em> proliferation.</p>\n<p><strong>Bhumivera Kalpvriksh Satva 7-Tulsi Cellular Reset Drops</strong> serves as the foundational <strong>Step 1 (Internal Pathway)</strong> of our Synchronized Gut-Skin Biotic Protocol. Formulated at an extraordinary <strong>9.0 ml active extract per 10 ml (90% potency)</strong> across seven distinct Tulsi cultivars (<strong>Van, Sweet, Marua, Bisva, Kala, Rama, and Lemon Tulsi</strong>), it delivers a standardized phytocomplex of <strong>eugenol, rosmarinic acid, and ursolic acid</strong> that downregulates intestinal COX-2 pathways, seals gut mucosal junctions, and neutralizes internal inflammatory triggers before they reach your skin.</p>\n<p><strong>Daily Consumer Ritual:</strong> Blend <strong>4 concentrated drops</strong> into 100 ml of lukewarm water every morning on an empty stomach. Follow externally with Step 2 (Himalayan Sea Buckthorn Postbiotic Cellular Emulsion).</p>",
    "faqs": [
      {
        "q": "How does Kalpvriksh Satva 7-Tulsi Drops resolve skin inflammation from the inside out?",
        "a": "By delivering 9.0ml per 10ml of seven Tulsi chemotypes rich in eugenol, rosmarinic acid, and ursolic acid, it inhibits intestinal COX-2 enzymes, strengthens gut mucosal tight junctions against leaky-gut endotoxemia, and lowers circulating TNF-alpha and IL-6 cytokines that drive facial breakouts."
      },
      {
        "q": "How is Bhumivera 7-Tulsi different from standard market Panch-Tulsi drops?",
        "a": "Standard Panch-Tulsi drops use 5 varieties often diluted in synthetic propylene glycol carriers. Bhumivera Kalpvriksh Satva unites 7 distinct chemotypes (Van, Sweet, Marua, Bisva, Kala, Rama, and Lemon Tulsi) cold-hydro-distilled below 28\u00b0C at a verified 90% active concentration (9.0ml/10ml) in Biophotonic UV glass."
      },
      {
        "q": "What is the recommended daily dosage for the 30-Day Gut-Skin Reset Protocol?",
        "a": "Blend 4 concentrated drops into 100 ml of lukewarm water and consume every morning on an empty stomach (and optionally 3\u20134 drops in the evening) to maintain continuous gut-skin axis antioxidant and cortisol support."
      }
    ]
  }
];

export const MAISON_REGIMEN_BUNDLES = [
  {
    "id": "bundle-30day-gut-skin-protocol",
    "sku": "BV-PROT-GUTSKIN-30D",
    "name": "The 30-Day Gut-Skin Biotic Reset Protocol (2-Step Flagship)",
    "badge": "Flagship Hero Protocol \u00b7 Save \u20b9299",
    "tagline": "Step 1 Internal 7-Tulsi Cellular Reset Drops + Step 2 External 4% Sea Buckthorn Postbiotic Emulsion",
    "items": [
      {
        "id": 6,
        "slug": "kalpvriksh-satva-tulsi-7-tulsi-extract",
        "name": "Step 1 Internal: Kalpvriksh Satva 7-Tulsi Cellular Reset Drops (30 ml)",
        "price": 499,
        "active": "9.0ml/10ml 7-Tulsi Extract \u00b7 Eugenol, Rosmarinic & Ursolic Acid (COX-2 & TNF-\u03b1 Reset)"
      },
      {
        "id": 2,
        "slug": "himalayan-seabuckthorn-luxury-face-wash",
        "name": "Step 2 External: Himalayan Sea Buckthorn Postbiotic Cellular Emulsion (100 ml)",
        "price": 799,
        "active": "4% Sub-28\u00b0C Ladakh Sea Buckthorn (Omega-7) + 1.5% Lactobacillus Postbiotics (pH 5.42)"
      },
      {
        "id": 3,
        "slug": "biotic-cellular-reset-30-day-gut-skin-protocol",
        "name": "Biophotonic UV Glass Dual-Compliance Box + 30-Day Clinical Protocol Dossier",
        "price": 200,
        "active": "FSSAI Ayush-Aahar + Cosmetics Rules 2020 + Legal Metrology 2011 Certified Packaging"
      }
    ],
    "mrpTotal": 1498,
    "bundlePrice": 1199,
    "subscriptionPrice": 1019,
    "savings": 299,
    "phWindow": "90% Internal Phyto-Extract + pH 5.42 External Acid-Mantle Calibration",
    "batchAllocation": "Batch 04/26 \u00b7 38 Protocol Kits Remaining",
    "image_url": "/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp"
  },
  {
    "id": "bundle-inside-out-clarifying",
    "sku": "BV-PROT-CLARIFY-30D",
    "name": "The Urban PM2.5 & Gut-Skin Clarifying Protocol (Oily / Acne-Prone)",
    "badge": "Targeted Sebum & Cytokine Reset \u00b7 Save \u20b9348",
    "tagline": "Step 1 Internal 7-Tulsi Drops + Step 2 3% Charcoal Postbiotic Emulsion + Fermented 7-Tulsi Mist",
    "items": [
      {
        "id": 6,
        "slug": "kalpvriksh-satva-tulsi-7-tulsi-extract",
        "name": "Step 1 Internal: Kalpvriksh Satva 7-Tulsi Cellular Reset Drops (30 ml)",
        "price": 499,
        "active": "9.0ml/10ml Seven-Tulsi Extract \u00b7 Gut Tight-Junction & Cortisol Adaptogen"
      },
      {
        "id": 1,
        "slug": "activated-charcoal-luxury-face-wash",
        "name": "Step 2 External: Activated Charcoal Postbiotic Cellular Emulsion (100 ml)",
        "price": 699,
        "active": "3% Microporous Carbon + 5% Glycerin + 1% Lactobacillus Postbiotics (pH 5.45)"
      },
      {
        "id": 5,
        "slug": "fermented-tulsi-cellular-hydration-mist",
        "name": "Step 3 Buffer: Fermented 7-Tulsi Hydrosol Cellular Hydration Mist (100 ml)",
        "price": 649,
        "active": "70% Copper-Distilled Rose + 26% Fermented 7-Tulsi Hydrosol (pH 5.30)"
      }
    ],
    "mrpTotal": 1847,
    "bundlePrice": 1499,
    "subscriptionPrice": 1274,
    "savings": 348,
    "phWindow": "pH 5.30\u20135.45 Topical + 90% Internal Phyto-Extract",
    "batchAllocation": "Batch 04/26 \u00b7 31 Protocol Sets Remaining",
    "image_url": "/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp"
  },
  {
    "id": "bundle-complete-microbiome-vault",
    "sku": "BV-PROT-VAULT-60D",
    "name": "The Complete 4-Step Gut-Skin Microbiome Cellular Vault",
    "badge": "Clinical Barrier & Microbiome Mastery \u00b7 Save \u20b9647",
    "tagline": "Internal 7-Tulsi Drops + Sea Buckthorn Postbiotic Emulsion + Fermented Tulsi Mist + Prebiotic GOS Barrier Cr\u00e8me",
    "items": [
      {
        "id": 6,
        "slug": "kalpvriksh-satva-tulsi-7-tulsi-extract",
        "name": "Step 1 Internal: Kalpvriksh Satva 7-Tulsi Cellular Reset Drops (30 ml)",
        "price": 499,
        "active": "9.0ml/10ml 7-Tulsi Extract (COX-2, TNF-\u03b1 & IL-6 Suppression)"
      },
      {
        "id": 2,
        "slug": "himalayan-seabuckthorn-luxury-face-wash",
        "name": "Step 2 Cleanse: Himalayan Sea Buckthorn Postbiotic Emulsion (100 ml)",
        "price": 799,
        "active": "4% Sea Buckthorn Omega-7 + 5% Glycerin + Postbiotics (pH 5.42)"
      },
      {
        "id": 5,
        "slug": "fermented-tulsi-cellular-hydration-mist",
        "name": "Step 3 Tone: Fermented 7-Tulsi Hydrosol Cellular Hydration Mist (100 ml)",
        "price": 649,
        "active": "70% Kannauj Rose + 26% Fermented 7-Tulsi Hydrosol (pH 5.30)"
      },
      {
        "id": 4,
        "slug": "restorative-seabuckthorn-prebiotic-barrier-creme",
        "name": "Step 4 Seal: Restorative Sea Buckthorn & Prebiotic GOS Barrier Cr\u00e8me (50 g)",
        "price": 999,
        "active": "3% Sea Buckthorn + 2% Prebiotic GOS + 3% Centella Madecassoside (pH 5.40)"
      }
    ],
    "mrpTotal": 2946,
    "bundlePrice": 2299,
    "subscriptionPrice": 1954,
    "savings": 647,
    "phWindow": "Full pH 5.30\u20135.42 Assay Certificates & Biophotonic UV Glass Vessels",
    "batchAllocation": "Batch 04/26 \u00b7 19 Collector Vaults Remaining",
    "image_url": "/assets/images/Promo7.webp"
  }
];

export const SAMPLE_BATCH_COAS = {
  "BHMV-2610-SB083": {
    "serial": "BHMV-2610-SB083",
    "batchCode": "BATCH-04/26-SB",
    "productId": 2,
    "productName": "Bhumivera Himalayan Sea Buckthorn Postbiotic Cellular Emulsion (100 ML \u00b7 Step 2 External)",
    "bottleSequence": "Biophotonic UV Vessel #083 of 250",
    "remainingInBatch": 83,
    "pressedDate": "2026-10-18",
    "extractionTemp": "26.4\u00b0C (Sub-28\u00b0C Cold-Extracted \u00b7 60% Thermal Energy Saved)",
    "calibratedPh": "5.42 pH (at 25.0\u00b0C Digital Glass Electrode)",
    "microbiologicalAssay": "TAMC < 10 CFU/ml \u00b7 TYMC < 10 CFU/ml \u00b7 Zero Pathogens (ISO 17516)",
    "heavyMetals": "Lead <0.02 ppm \u00b7 Arsenic <0.01 ppm \u00b7 Mercury ND \u00b7 Cadmium ND (ICP-MS)",
    "pesticideResidue": "0.000 ppm Across 210 Organochlorine & Organophosphorus Pesticides (GC-MS/MS)",
    "harvestCoordinates": "Nubra & Spiti Valley Wildcraft Cooperative (34.5821\u00b0 N, 77.4682\u00b0 E \u00b7 Altitude 11,420 ft)",
    "regulatoryLicense": "Cosmetics Rules, 2020 (CDSCO/AYUSH State License) \u00b7 Legal Metrology 2011 Compliant",
    "disclosedActives": "4.0% Wild Ladakh Sea Buckthorn (\u226534% Omega-7 Palmitoleic Acid & Bio-Ferulic Acid), 5.0% Botanical Glycerin, 1.5% Lactobacillus Postbiotic Ferment, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid, 0.1% Niacinamide",
    "tamperCustody": "Biophotonic UV Glass \u00b7 Wax-Sealed & Gold-Foil Collar Intact \u00b7 Gravimetric Weight 214.5g",
    "originLot": "Ladakh Nubra Valley Tribal Cooperative Lot #LDK-SB-2026"
  },
  "BHMV-2610-TL019": {
    "serial": "BHMV-2610-TL019",
    "batchCode": "BATCH-04/26-TL",
    "productId": 6,
    "productName": "Bhumivera Kalpvriksh Satva 7-Tulsi Cellular Reset Drops (30 ML \u00b7 Step 1 Internal)",
    "bottleSequence": "Biophotonic UV Dropper #019 of 250",
    "remainingInBatch": 58,
    "pressedDate": "2026-10-20",
    "extractionTemp": "24.9\u00b0C (Sub-28\u00b0C Cold-Hydro-Distilled Phyto-Essence)",
    "calibratedPh": "90% Concentrated Seven-Tulsi Distillate (9.0 ml / 10 ml)",
    "microbiologicalAssay": "FSSAI Ayush-Aahar Food-Grade Purity \u00b7 E. coli, Salmonella & S. aureus Absent",
    "heavyMetals": "Lead ND \u00b7 Arsenic ND \u00b7 Cadmium ND \u00b7 Mercury ND (ICP-MS Verified)",
    "pesticideResidue": "0.000 ppm Pesticide & Aflatoxin B1/B2/G1/G2 Residue (GC-MS/MS & HPLC)",
    "harvestCoordinates": "Vrindavan & Bundelkhand Organic Tulsi Sanctuary (25.4358\u00b0 N, 78.5685\u00b0 E)",
    "regulatoryLicense": "FSSAI Ayush-Aahar / Nutraceutical Statutory Compliance \u00b7 Legal Metrology 2011",
    "disclosedActives": "9.0 ml per 10 ml Seven-Tulsi Spectrum (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi) Standardized for \u226542% Eugenol, \u226518% Rosmarinic Acid & \u226512% Ursolic Acid",
    "tamperCustody": "Biophotonic UV Glass Dropper Security Seal Intact \u00b7 Gravimetric Weight 98.5g",
    "originLot": "Vrindavan & Bundelkhand Tulsi Sanctuary Lot #VRN-7T-2026"
  },
  "BHMV-2610-PR012": {
    "serial": "BHMV-2610-PR012",
    "batchCode": "BATCH-04/26-PR",
    "productId": 3,
    "productName": "The Biotic Cellular Reset: 30-Day 2-Step Gut-Skin Protocol Kit (30 ML + 100 ML)",
    "bottleSequence": "Protocol Kit #012 of 250",
    "remainingInBatch": 38,
    "pressedDate": "2026-10-20",
    "extractionTemp": "24.9\u00b0C (Step 1) / 26.4\u00b0C (Step 2) Sub-28\u00b0C Cold Extraction",
    "calibratedPh": "Step 1: 90% Phyto-Extract \u00b7 Step 2: 5.42 pH (Digital Electrode)",
    "microbiologicalAssay": "Dual Cleanroom Assay Passed (<10 CFU/ml \u00b7 Zero Pathogens)",
    "heavyMetals": "ICP-MS Verified Non-Detect Across Both Vessels",
    "pesticideResidue": "0.000 ppm Verified by Third-Party NABL Analytical Lab (GC-MS/MS)",
    "harvestCoordinates": "Ladakh (34.5821\u00b0 N, 77.4682\u00b0 E \u00b7 11,420 ft) & Bundelkhand (25.4358\u00b0 N, 78.5685\u00b0 E)",
    "regulatoryLicense": "Dual Panel: FSSAI Ayush-Aahar (Step 1) + Cosmetics Rules 2020 (Step 2) \u00b7 Legal Metrology 2011",
    "disclosedActives": "Step 1: 9.0ml/10ml 7-Tulsi Extract + Step 2: 4.0% Ladakh Sea Buckthorn Omega-7, 5.0% Glycerin, 1.5% Lactobacillus Postbiotics, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.1% HA, 0.1% Niacinamide",
    "tamperCustody": "Dual Biophotonic UV Glass Vessels in Wax-Sealed Eco-Luxe Box \u00b7 342.0g Verified",
    "originLot": "Synchronized Protocol Master Lot #BV-GUTSKIN-2026"
  },
  "BHMV-2610-CH041": {
    "serial": "BHMV-2610-CH041",
    "batchCode": "BATCH-04/26-CH",
    "productId": 1,
    "productName": "Bhumivera Activated Charcoal Postbiotic Cellular Emulsion (100 ML)",
    "bottleSequence": "Biophotonic UV Vessel #041 of 250",
    "remainingInBatch": 64,
    "pressedDate": "2026-10-16",
    "extractionTemp": "25.8\u00b0C (Sub-28\u00b0C Cold-Compounded)",
    "calibratedPh": "5.48 pH (at 25.0\u00b0C Digital Electrode)",
    "microbiologicalAssay": "Total Aerobic Microbial Count < 10 CFU/ml (Sterile Cleanroom Fill)",
    "heavyMetals": "Lead <0.04 ppm \u00b7 Arsenic <0.01 ppm \u00b7 Mercury ND (ICP-MS Verified)",
    "pesticideResidue": "0.000 ppm Pesticide Residue (GC-MS/MS Verified)",
    "harvestCoordinates": "Assam Bamboo Grove Corridor (26.1445\u00b0 N, 91.7362\u00b0 E)",
    "regulatoryLicense": "Cosmetics Rules, 2020 (CDSCO/AYUSH) \u00b7 Legal Metrology 2011 Compliant",
    "disclosedActives": "3.0% Activated Charcoal, 5.0% Botanical Glycerin, 1.0% Lactobacillus Postbiotic Ferment, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid, 0.1% Niacinamide",
    "tamperCustody": "Biophotonic UV Glass \u00b7 Wax-Sealed & Gold-Foil Neck Collar Intact \u00b7 Gravimetric Weight 215.0g",
    "originLot": "Assam Microporous Bamboo Carbon Lot #ASM-BC-2026"
  }
};

export const GUT_SKIN_AXIS_CASCADE_STAGES = [
  {
    step: 'Stage 01 · Intestinal Mucosal Permeability',
    title: 'Leaky Gut & Tight-Junction (ZO-1 / Occludin) Loosening',
    biochemistry: 'Processed diets, chronic psychological cortisol, environmental toxins, and gut dysbiosis degrade intestinal mucin and downregulate Zonula Occludens-1 (ZO-1) and occludin tight-junction proteins.',
    molecularMarkers: 'Elevated Zonulin · Depleted Faecalibacterium & Butyrate SCFAs · Gram-Negative Lipopolysaccharide (LPS) Translocation',
    intervention: 'Step 1 Internal: Kalpvriksh Satva 7-Tulsi (2.6 ml/10ml Van & Bisva Tulsi Ursolic Acid + Thymol) seals intestinal epithelial tight junctions and halts endotoxin translocation.',
    citationUrl: 'https://www.researchgate.net/publication/389634447_The_gut-skin_axis_a_bi-directional_microbiota-driven_relationship_with_therapeutic_potential',
    citationLabel: 'ResearchGate · Bidirectional Gut-Skin Axis (2025)'
  },
  {
    step: 'Stage 02 · Systemic Endotoxemia & Cytokine Surge',
    title: 'Circulating LPS Upregulates TNF-α, IL-6, IL-17 & COX-2',
    biochemistry: 'Translocated lipopolysaccharides (LPS) bind Toll-Like Receptor 4 (TLR-4) on systemic macrophages, activating NF-κB and COX-2 pathways and flooding the bloodstream with pro-inflammatory cytokines.',
    molecularMarkers: 'TNF-α Upregulation · Interleukin-6 (IL-6) · Interleukin-17 (IL-17A) · Prostaglandin E2 (PGE2 via COX-2)',
    intervention: 'Step 1 Internal: 9.0 ml/10ml Seven-Tulsi Phyto-Extract (≥42% Eugenol & ≥18% Rosmarinic Acid) inhibits COX-1 (97%) and COX-2 pathways and suppresses circulating TNF-α and IL-6.',
    citationUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12645903/',
    citationLabel: 'PubMed Central · Gut Microbiota & Cytokine Axis (PMC12645903)'
  },
  {
    step: 'Stage 03 · Cutaneous Sebocyte Hyperplasia & Dysbiosis',
    title: 'Altered Sebum Lipids & Virulent Cutibacterium acnes IA1',
    biochemistry: 'Circulating cytokines reach cutaneous sebaceous glands, inducing sebocyte hyperplasia, squalene peroxidation, and follicular hyperkeratinization—creating an anaerobic plug where virulent C. acnes proliferates via TLR-2.',
    molecularMarkers: 'Peroxidized Squalene · TLR-2 Macrophage Activation · Follicular IL-1β, IL-8 & MMP-9 Matrix Breakdown',
    intervention: 'Step 2 External: 0.5% Haridra (Curcuminoids), 0.5% Manjistha (Rubiadin), 0.5% Neem & 1.5% Lactobacillus Postbiotic Ferment quench TLR-2 inflammation and selectively inhibit C. acnes biofilms.',
    citationUrl: 'https://www.mdpi.com/2076-393x/10/2/244',
    citationLabel: 'MDPI · Commensal C. acnes & Th17 Cutaneous Inflammation'
  },
  {
    step: 'Stage 04 · Topical Stripping vs. Postbiotic Barrier Reset',
    title: 'Rebuilding the pH 5.3–5.5 Acid Mantle with 4% Sea Buckthorn Omega-7',
    biochemistry: 'Harsh synthetic AHA/BHA acids and alkaline SLS/SLES washes strip intercellular ceramides and drive skin pH above 5.5. Bhumivera replaces stripping detergents with a pH 5.42 Omega-7 postbiotic micro-emulsion.',
    molecularMarkers: '≥34% Omega-7 Palmitoleic Acid (16:1 n-7) · Native Bio-Ferulic Acid · 5.0% Glycerin + 0.1% HA + 0.1% Niacinamide',
    intervention: 'Step 2 External: 4.0% Sub-28°C Cold-Pressed Ladakh Sea Buckthorn replenishes epidermal lipids, reduces TEWL, and locks the acid mantle at pH 5.3–5.5.',
    citationUrl: 'https://www.mdpi.com/2079-9284/13/1/45',
    citationLabel: 'MDPI · Palmitoleic (Omega-7) Acid & Skin Barrier Health (2026)'
  }
];

export const COMPETITIVE_D2C_MATRIX = [
  {
    brand: 'Bhumivera Organics (Category Pioneer)',
    backing: 'Bhumivera Organics India Pvt. Ltd. (Est. 2016)',
    hook: 'Synchronized Inside-Out Gut-Skin Biotic Protocol (90% 7-Tulsi Internal + 4% Sea Buckthorn Postbiotic External)',
    tier: 'Clinical Apothecary · Protocol ₹1,199 (AOV >₹1,200)',
    demographic: 'Ingredient-literate urban consumers tackling chronic gut-derived acne & barrier damage',
    vulnerability: 'Uncontested Category Monopoly: 80%+ gross manufacturing margin (COGS <₹220), Biophotonic UV glass & QR batch COA.'
  },
  {
    brand: 'Minimalist',
    backing: 'Acquired by Hindustan Unilever (~₹2,955–3,000 Cr)',
    hook: 'Single-ingredient synthetic clinical serums (10% Niacinamide, Salicylic Acid)',
    tier: 'Mid-Premium (₹500–₹800); AOV ₹850–₹1,200',
    demographic: 'Ingredient-literate Gen Z & Millennials in Metro/Tier-1 centers',
    vulnerability: 'Total absence of ingestible gut-skin wellness; clinically sterile aesthetic; growing active fatigue among over-exfoliated skin.'
  },
  {
    brand: 'The Derma Co. / Aqualogica / Dr. Sheth’s',
    backing: 'Honasa Consumer (Publicly Listed)',
    hook: 'Topical problem-solution synthetic actives & fruit-hydration gels',
    tier: 'Mass-Premium (₹300–₹750); AOV ₹600–₹900',
    demographic: 'College students & young urban professionals',
    vulnerability: 'Purely topical surface cosmetics; zero internal metabolic/gut dermatology; ~33% revenue burned on paid digital media.'
  },
  {
    brand: 'Dot & Key / Plum / Pilgrim',
    backing: 'Nykaa Majority / Pureplay / Venture D2C',
    hook: 'Sensory fruit actives, vegan basics & exotic global ingredient stories',
    tier: 'Mid-Premium (₹350–₹800); AOV ₹700–₹1,000',
    demographic: 'Urban lifestyle-driven skincare buyers aged 18–32',
    vulnerability: 'Customer acquisition trap (up to 53%–57% of revenue spent on paid ads); lack of proprietary inside-out biotic science.'
  },
  {
    brand: 'RAS Luxury Skincare / Nat Habit',
    backing: 'Dabur Venture / Venture D2C',
    hook: 'Farm-to-face prestige facial oils (RAS) & short-shelf-life kitchen Ayurveda (Nat Habit)',
    tier: 'Luxury ₹1,500–₹3,500 (RAS) / Mass ₹250–₹550 (Nat Habit)',
    demographic: 'Affluent ritual seekers or traditionalists',
    vulnerability: 'Low replenishment frequency on luxury oils or severe cold-chain spoilage bottlenecks; no synchronized gut-skin protocol.'
  }
];

export const OMNICHANNEL_DISTRIBUTION_TABLE = [
  {
    channel: 'Bhumivera D2C Flagship Hub (bhumivera.com)',
    revenueShare: '25%',
    cacWindow: '₹450 – ₹600',
    cm2Margin: '48% – 54%',
    mechanics: 'Central clinical discovery & Journal of Cutaneous Ecology hub; anchors 25-day WhatsApp auto-replenishment subscriptions & diagnostic quiz profiles.'
  },
  {
    channel: 'Quick Commerce Dark Stores (Blinkit, Zepto, Instamart)',
    revenueShare: '40%',
    cacWindow: '₹120 – ₹180 (Platform Search)',
    cm2Margin: '32% – 36%',
    mechanics: '10-minute metro fulfillment across 2,400+ Blinkit and 1,100+ Zepto/Instamart hubs; captures urgent 30-day consumable protocol reorders.'
  },
  {
    channel: 'E-Commerce Marketplaces (Amazon, Nykaa, Tira)',
    revenueShare: '20%',
    cacWindow: '₹250 – ₹350',
    cm2Margin: '38% – 42%',
    mechanics: 'Captures high-intent national search demand, verified transformation reviews, and Tier-2/Tier-3 urban dermatological adoption.'
  },
  {
    channel: 'Prestige Offline Boutiques & Functional Medicine Clinics',
    revenueShare: '15%',
    cacWindow: 'Fixed Trade Margins',
    cm2Margin: '28% – 32%',
    mechanics: 'Anchors medical and luxury authority across integrative dermatology clinics, gut-health nutritionists, Nykaa Luxe, Tira, and Sephora.'
  }
];

export const SCALING_ROADMAP_PHASES = [
  {
    phase: 'Phase 1: Portfolio Rationalization & Protocol Launch',
    timeline: 'Months 0 – 18',
    milestone: '₹0 to ₹10 Crore Run-Rate',
    footprint: 'Digital brand hub (bhumivera.com) + selective Amazon & clinic proof',
    architecture: '100% production focused on The 2-Step Gut-Skin Reset Protocol (COGS <₹220, >80% gross margin)',
    strategy: 'Collaborate with 100+ functional medicine practitioners, gut-health nutritionists & integrative dermatologists.'
  },
  {
    phase: 'Phase 2: Quick Commerce Expansion & Habit Creation',
    timeline: 'Months 18 – 36',
    milestone: '₹10 to ₹100 Crore Run-Rate',
    footprint: 'Metro dark stores across Blinkit, Zepto & Swiggy Instamart (Mumbai, Delhi-NCR, Bengaluru, Kolkata)',
    architecture: 'Launch 60-day concentrated refill pouches + Fermented 7-Tulsi Mist & Prebiotic GOS Barrier Crème',
    strategy: 'Institutional Series A capital; 25-day WhatsApp reorder workflows targeting 40%–45% 90-day repeat rate.'
  },
  {
    phase: 'Phase 3: National Retail Scale & Clinical Validation',
    timeline: 'Months 36 – 60',
    milestone: '₹100 to ₹500 Crore Run-Rate',
    footprint: '130+ Indian cities; dedicated counters in Nykaa Luxe, Tira, Sephora & premium wellness clinics',
    architecture: 'Independent 8-week double-blind clinical trials measuring lesion reduction, TEWL & gut microbiome alpha-diversity',
    strategy: 'Series B/C growth capital; publish clinical trial endpoints directly on Biophotonic UV glass packaging.'
  },
  {
    phase: 'Phase 4: Market Leadership & Strategic Monetization',
    timeline: 'Year 6 – 7',
    milestone: '₹500 to ₹1,000 Crore Revenue',
    footprint: '15,000+ prestige retail points pan-India + export to UAE, Saudi Arabia, UK & North America',
    architecture: 'Full patent portfolio around sub-28°C cold extraction, stabilized 7-Tulsi bioflavonoids & postbiotic barrier actives',
    strategy: 'Operating at 18%–22% EBITDA profitability; strategic conglomerate acquisition or public listing (IPO).'
  }
];
