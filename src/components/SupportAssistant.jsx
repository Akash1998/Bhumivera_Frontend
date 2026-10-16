import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Send,
  Sparkles,
  Package,
  Truck,
  RotateCcw,
  ShieldAlert,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Paperclip,
  CheckCircle2,
  Clock,
  PhoneCall,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  Image as ImageIcon,
  Star,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api, { aiSupport as aiSupportApi, BASE_URL } from '../services/api';
import { normalizeTelegramBotUrl } from '../utils/telegramUrl';
import {
  AI_COPILOT_ADD_CART_RETRY_EVENT,
  AI_COPILOT_EVENT,
  analyzePasswordForAiGuide,
} from '../utils/aiCopilotBus';
import { resolveClientSideConciergeFallback } from '../utils/bhumiveraAiConciergeFallback';

const STORAGE_KEY = 'bhumivera_client_concierge_state_v3';
const SESSION_TOKEN_KEY = 'bhumivera_client_concierge_token_v3';
const PROACTIVE_TRIGGERED_KEY = 'bhumivera_concierge_proactive_v3';
const RITUAL_PROGRESS_STORAGE_KEY = 'bhumivera_concierge_ritual_progress_v3';
const DIAGNOSTIC_STATE_STORAGE_KEY = 'bhumivera_concierge_skin_diagnostic_v3';
const SAVED_INGREDIENTS_STORAGE_KEY = 'bhumivera_concierge_saved_ingredients_v3';
const LINGER_THRESHOLD_MS = 45000;

/**
 * Hero Ingredient Stories directly inspired by the Bhumivera Botanical Showcase:
 * "Nature has more than one note. Meet the botanicals that inspire us—and the
 * contemporary actives shaping the next chapter of skin care."
 */
export const HERO_INGREDIENT_STORIES = [
  {
    storyCode: 'INGREDIENT STORY · 01',
    storyIndex: 1,
    ingredientId: 'sea_buckthorn',
    title: 'Sea buckthorn',
    displayName: 'Himalayan Sea Buckthorn',
    latinName: 'Hippophae rhamnoides L.',
    tagline: 'A vivid botanical with a story all its own.',
    heroSectionHeading: 'Nature has more than one note.',
    heroSectionSubheading:
      'Meet the botanicals that inspire us—and the contemporary actives shaping the next chapter of skin care.',
    accentHex: '#E07A24',
    badgeLabel: 'Gold-Standard Omega 3·6·7·9 Berry',
    terroir: 'High-Altitude Cold Desert Valleys of Ladakh & Lahaul-Spiti (3,200m–4,100m)',
    harvestWindow: 'Late September to First Himalayan Frost (Hand-Picked at Peak Carotenoid Density)',
    extractionCraft: 'Sub-Critical CO2 Dual Pulp & Seed Extraction + Cold Cellular Press',
    concentrationStandard: '3.50% Standardized Bio-Active Complex in Face Wash & Cellular Elixirs',
    ayurvedicProfile: 'Tridoshic Harmonizer (Calms Vata dryness & Pitta photo-stress)',
    sensoryArchitecture: {
      visualNote: 'Luminous saffron-amber nectar with natural beta-carotene radiance',
      aromaticNote: 'Crisp mountain citrus peel, sun-warmed wild berry, and herbaceous dew',
      tactileNote: 'Cushioned, weightless lipid veil that rinses clean without stripping',
    },
    chapters: [
      {
        step: 1,
        chapterTitle: 'Step 1 · High-Altitude Survival & Bio-Accumulation',
        summary:
          'Growing above 3,500 meters where UV radiation is intense and temperatures plunge below -25°C, Sea Buckthorn berries synthesize over 190 bioactive nutrients to protect their own cellular membranes.',
        detailedNarrative:
          'Unlike lowland botanicals, Himalayan Hippophae rhamnoides endures extreme diurnal temperature swings and intense solar radiation. In response, the berry concentrates rare Palmitoleic Acid (Omega-7), Vitamin C at up to 12 times the concentration of sweet oranges, tocotrienols, and superoxide dismutase (SOD).',
      },
      {
        step: 2,
        chapterTitle: 'Step 2 · Dual-Phase Seed & Pulp Fractionation',
        summary:
          'Bhumivera separates and then re-harmonizes both the ruby-orange pericarp pulp and the nutrient-dense dark seed kernel using solvent-free supercritical CO2 extraction.',
        detailedNarrative:
          'The berry pulp delivers up to 38% Omega-7 (Palmitoleic Acid)—a lipid naturally present in youthful human sebum—while the seed oil provides an ideal 1:1 ratio of Linoleic (Omega-6) and Alpha-Linolenic (Omega-3) fatty acids to rebuild compromised stratum corneum bilayers.',
      },
      {
        step: 3,
        chapterTitle: 'Step 3 · Stratum Corneum Lipid Integration',
        summary:
          'During the 60-second cleansing massage, micro-emulsified Sea Buckthorn micelles selectively lift oxidized sebum while depositing pro-barrier sterols and carotenoids.',
        detailedNarrative:
          'Conventional foaming cleansers strip intercellular lipids, triggering rebound oiliness. Sea Buckthorn forms a biomimetic cushion during cleansing so surfactants remove only debris, sunscreen, and particulate matter while leaving the acid mantle intact at pH 5.2–5.5.',
      },
      {
        step: 4,
        chapterTitle: 'Step 4 · Contemporary Active Synergy (Niacinamide + Panthenol)',
        summary:
          'Paired with 4% Niacinamide and 1.5% D-Panthenol, Sea Buckthorn accelerates ceramide synthesis and quenches post-cleansing erythema.',
        detailedNarrative:
          'While Omega-7 supplies immediate exogenous fatty acids, Niacinamide upregulates endogenous serine palmitoyltransferase activity, creating a dual-pathway barrier restoration loop.',
      },
    ],
    quickPrompts: [
      'Tell me about Sea Buckthorn Face Wash and its key ingredients',
      'How do I really use Sea Buckthorn Face Wash step-by-step and what time of day should I use it?',
      'How does Sea Buckthorn work with Niacinamide and Aloe Vera?',
      'Is Sea Buckthorn suitable for oily and acne-prone skin?',
    ],
  },
  {
    storyCode: 'INGREDIENT STORY · 02',
    storyIndex: 2,
    ingredientId: 'activated_charcoal',
    title: 'Charcoal',
    displayName: 'Activated Binchotan & Bamboo Charcoal',
    latinName: 'Carbon (Steam-Activated Phyllostachys edulis)',
    tagline: 'A grounded, elemental presence in the ritual.',
    heroSectionHeading: 'Nature has more than one note.',
    heroSectionSubheading:
      'Meet the botanicals that inspire us—and the contemporary actives shaping the next chapter of skin care.',
    accentHex: '#3A4440',
    badgeLabel: 'Micro-Porous Adsorption Matrix',
    terroir: 'Sustainably Harvested 5-Year Highland Moso Bamboo Groves (Assam & Western Ghats)',
    harvestWindow: 'Late Autumn Dormant Culm Harvest (Maximum Lignin Density)',
    extractionCraft: '900°C Pyrolysis Kiln Carbonization + High-Pressure Steam Micronization',
    concentrationStandard: '1.80% Ultra-Fine Spherical Micro-Mesh (Non-Abrasive 8-Micron Grade)',
    ayurvedicProfile: 'Kapha & Pitta Clarifier (Draws out Ama, excess sebum, and urban toxins)',
    sensoryArchitecture: {
      visualNote: 'Velvety obsidian-slate suspension that transforms into a silky pearl-grey lather',
      aromaticNote: 'Clean rain-washed slate, subtle smoky vetiver root, and cool mineral earth',
      tactileNote: 'Zero-grit satin glide that acts like a microscopic magnet without physical scratching',
    },
    chapters: [
      {
        step: 1,
        chapterTitle: 'Step 1 · High-Temperature Pyrolysis & Steam Activation',
        summary:
          'Mature bamboo culms are carbonized at 900°C and activated with superheated steam to carve a vast internal labyrinth of micropores and mesopores.',
        detailedNarrative:
          'A single gram of Bhumivera steam-activated botanical charcoal possesses an internal surface area exceeding 1,200 square meters. This honeycomb architecture creates van der Waals adsorption forces capable of trapping lipophilic pollutants many times its own weight.',
      },
      {
        step: 2,
        chapterTitle: 'Step 2 · Selective PM2.5 & Oxidized Sebum Adsorption',
        summary:
          'Charcoal targets positively charged heavy metals, polycyclic aromatic hydrocarbons (PAHs), and peroxidized squalene inside follicular openings.',
        detailedNarrative:
          'Urban smog particulates (PM2.5) are smaller than human pores and trigger aryl hydrocarbon receptor (AhR) inflammation. Activated Charcoal binds these hydrophobic toxins on contact so they rinse away effortlessly with lukewarm water.',
      },
      {
        step: 3,
        chapterTitle: 'Step 3 · Cushioning the Elemental Cleanse with Botanical Humectants',
        summary:
          'We suspend our micronized charcoal in a base of Pure Aloe Vera, Vegetable Glycerin, and Panthenol so pores are decongested without tightness.',
        detailedNarrative:
          'Raw clay or unbuffered charcoal can dehydrate the epidermis. By encapsulating 8-micron charcoal spheres within an Aloe Vera polysaccharide gel matrix, Bhumivera delivers deep follicular purification alongside a +28% hydration boost.',
      },
      {
        step: 4,
        chapterTitle: 'Step 4 · Synergy with Botanical Salicylic Acid & Tulsi',
        summary:
          'Paired with Sacred Tulsi and Willow Bark Salicylic Acid, Charcoal clears surface congestion while BHA dissolves deeper keratin plugs.',
        detailedNarrative:
          'Charcoal acts as the surface magnet while Tulsi regulates C. acnes proliferation and Salicylic Acid loosens desmosomal corneocyte bonds inside the pore lining.',
      },
    ],
    quickPrompts: [
      'Tell me about Charcoal and how it purifies pores without drying skin',
      'Can I use Charcoal and Sea Buckthorn together in my routine?',
      'What is the step-by-step evening detox ritual with Charcoal?',
      'How does Activated Charcoal protect against urban pollution and blackheads?',
    ],
  },
  {
    storyCode: 'INGREDIENT STORY · 03',
    storyIndex: 3,
    ingredientId: 'sacred_tulsi',
    title: 'Tulsi',
    displayName: 'Sacred Rama & Krishna Tulsi',
    latinName: 'Ocimum tenuiflorum (syn. Ocimum sanctum)',
    tagline: 'A familiar botanical, seen with fresh attention.',
    heroSectionHeading: 'Nature has more than one note.',
    heroSectionSubheading:
      'Meet the botanicals that inspire us—and the contemporary actives shaping the next chapter of skin care.',
    accentHex: '#2E6F4E',
    badgeLabel: 'Ayurvedic Adaptogen & Microbiome Purifier',
    terroir: 'Regenerative Organic Herb Gardens of Bundelkhand & Foothills of Uttarakhand',
    harvestWindow: 'Pre-Dawn Harvest During Early Flowering (Peak Ursolic & Rosmarinic Acid)',
    extractionCraft: 'Copper-Alembic Hydro-Distillation + Cold Ultrasonic Phyto-Infusion',
    concentrationStandard: '2.25% Standardized Ursolic Acid & Eugenol-Balanced Leaf Distillate',
    ayurvedicProfile: 'Sattvic Rasayana (Balances Kapha congestion & Pitta inflammatory flare-ups)',
    sensoryArchitecture: {
      visualNote: 'Translucent emerald-jade botanical infusion with chlorophyll vitality',
      aromaticNote: 'Crisp herbaceous clove-basil leaf, crushed green stems, and morning temple garden air',
      tactileNote: 'Cooling, clarifying botanical tonic that leaves skin calm, balanced, and resilient',
    },
    chapters: [
      {
        step: 1,
        chapterTitle: 'Step 1 · Dual-Cultivar Rama & Purple Krishna Tulsi Selection',
        summary:
          'Bhumivera blends green-leafed Rama Tulsi (high in soothing rosmarinic acid) with purple-leafed Krishna Tulsi (rich in anthocyanins and ursolic acid).',
        detailedNarrative:
          'Revered in Ayurveda for over 3,000 years as "The Incomparable One," Tulsi is re-examined in modern dermal science as a potent adaptogen that downregulates cortisol-induced sebum overproduction and NF-kB inflammatory cascades.',
      },
      {
        step: 2,
        chapterTitle: 'Step 2 · Precision Fractionation to Remove Sensitizing Volatiles',
        summary:
          'Crude basil essential oils can irritate sensitive skin; our ultrasonic cold extraction isolates non-volatile triterpenoids (Ursolic and Oleanolic acids) while keeping volatile eugenol below 0.02%.',
        detailedNarrative:
          'This modern refinement allows even rosacea-prone and reactive skin types to experience Tulsi’s antibacterial, antioxidant, and matrix metalloproteinase (MMP-1) inhibiting benefits without stinging.',
      },
      {
        step: 3,
        chapterTitle: 'Step 3 · Microbiome-Respecting Blemish Defense',
        summary:
          'Unlike harsh synthetic biocides that wipe out beneficial Staphylococcus epidermidis, Tulsi selectively inhibits Cutibacterium acnes biofilm formation.',
        detailedNarrative:
          'By preserving commensal flora while suppressing pathogenic lipid peroxidation, Tulsi keeps the skin microbiome diverse, calm, and resistant to recurring breakouts.',
      },
      {
        step: 4,
        chapterTitle: 'Step 4 · Synergy with Zinc PCA, Centella & Niacinamide',
        summary:
          'Combined with Zinc PCA and Niacinamide, Tulsi forms a three-pillar defense against hormonal congestion, redness, and post-blemish marks.',
        detailedNarrative:
          'Ursolic acid strengthens dermal collagen bundles while Niacinamide prevents melanosome transfer, ensuring blemishes heal rapidly without leaving dark hyperpigmented shadows.',
      },
    ],
    quickPrompts: [
      'Tell me about Tulsi and how Bhumivera uses it in modern skincare',
      'How does Tulsi help with acne, redness, and skin stress?',
      'What is the difference between Tulsi, Neem, and Centella Asiatica?',
      'Show me the step-by-step ritual for blemish-prone skin using Tulsi',
    ],
  },
  {
    storyCode: 'INGREDIENT STORY · 04',
    storyIndex: 4,
    ingredientId: 'aloe_vera',
    title: 'Aloe vera',
    displayName: 'Cold-Stabilized Barbadensis Aloe Vera',
    latinName: 'Aloe barbadensis miller',
    tagline: 'A generous plant, and a thoughtful place to begin.',
    heroSectionHeading: 'Nature has more than one note.',
    heroSectionSubheading:
      'Meet the botanicals that inspire us—and the contemporary actives shaping the next chapter of skin care.',
    accentHex: '#3B8EA5',
    badgeLabel: 'Bio-Polysaccharide Cellular Hydrator',
    terroir: 'Arid Mineral-Rich Red Soils of Thar Desert Edge (Rajasthan) & Kutch',
    harvestWindow: '3-Year Mature Outer Leaf Filleting Within 4 Hours of Sunrise',
    extractionCraft: 'Aloin-Free Inner Gel Filleting + Cold Flash-Stabilization (Never Spray-Dried Powder)',
    concentrationStandard: '32.00% First-Press Bio-Active Inner Leaf Juice Base',
    ayurvedicProfile: 'Kumari Rasayana (Deeply cooling Pitta pacifier & Vata moisture replenisher)',
    sensoryArchitecture: {
      visualNote: 'Crystal-clear, dewy aqueous gel shimmering with natural mucopolysaccharides',
      aromaticNote: 'Fresh-sliced succulent green stem, cool cucumber-water nuance, and clean rain',
      tactileNote: 'Instant thermal cooling (-1.8°C skin surface feel) with zero sticky residue',
    },
    chapters: [
      {
        step: 1,
        chapterTitle: 'Step 1 · Fresh Inner-Fillet Cold Stabilization vs. Reconstituted Powder',
        summary:
          'Rather than using heat-degraded 200x aloe powder reconstituted with tap water, Bhumivera uses fresh, cold-pressed inner leaf fillet processed within 4 hours of harvest.',
        detailedNarrative:
          'This preserves high-molecular-weight Acemannan (acetylated mannan polysaccharides), glycoproteins, bradikinase enzymes, and plant sterols (lupeol and campesterol) in their native three-dimensional conformation.',
      },
      {
        step: 2,
        chapterTitle: 'Step 2 · Aquaporin-3 Activation & Multi-Depth Water Transport',
        summary:
          'Aloe Vera polysaccharides form a breathable hydro-mesh on the stratum corneum while signaling Aquaporin-3 water channels in deeper keratinocytes.',
        detailedNarrative:
          'Instead of merely sitting on top of the skin, low- and medium-weight aloe oligosaccharides penetrate the upper epidermis, binding water molecules and reducing Transepidermal Water Loss (TEWL) by up to 34% immediately after cleansing.',
      },
      {
        step: 3,
        chapterTitle: 'Step 3 · Fibroblast Stimulation & Thermal Erythema Relief',
        summary:
          'Acemannan binds to mannose receptors on dermal fibroblasts, stimulating Type I and Type III collagen synthesis while calming UV- or friction-induced heat.',
        detailedNarrative:
          'The enzyme bradykinase breaks down inflammatory bradykinin on contact, making Aloe Vera the ideal foundational vehicle for active cleansers and treatment serums.',
      },
      {
        step: 4,
        chapterTitle: 'Step 4 · Synergy with Hyaluronic Acid, Panthenol & Allantoin',
        summary:
          'Serving as the biomimetic delivery vehicle for Hyaluronic Acid and Pro-Vitamin B5, Aloe Vera amplifies humectant retention across all humidity levels.',
        detailedNarrative:
          'Even in dry air-conditioned or winter environments where standalone hyaluronic acid can draw moisture out of the skin, Aloe Vera’s mucopolysaccharide film locks hydration inside the epidermal reservoir.',
      },
    ],
    quickPrompts: [
      'Tell me about Aloe Vera and why it is the foundation of Bhumivera formulas',
      'How does Aloe Vera work with Hyaluronic Acid and Panthenol?',
      'Is Aloe Vera good for sensitive, sunburned, or barrier-damaged skin?',
      'Walk me through the 60-second damp-skin hydration ritual',
    ],
  },
];

export const PUBLIC_GENERAL_CHIPS = [
  {
    id: 'know_sb_fw',
    label: 'Know More: Sea Buckthorn Face Wash',
    prompt: 'Tell me about Sea Buckthorn Face Wash and its key ingredients',
    category: 'product_discovery',
  },
  {
    id: 'story_01_sb',
    label: 'Story 01 · Sea Buckthorn',
    prompt: 'Tell me the full Ingredient Story 01 for Sea Buckthorn and its cellular steps',
    category: 'ingredient_discovery',
  },
  {
    id: 'story_02_charcoal',
    label: 'Story 02 · Activated Charcoal',
    prompt: 'Tell me the full Ingredient Story 02 for Charcoal and how it purifies pores',
    category: 'ingredient_discovery',
  },
  {
    id: 'story_03_tulsi',
    label: 'Story 03 · Sacred Tulsi',
    prompt: 'Tell me the full Ingredient Story 03 for Tulsi and its adaptogenic skin benefits',
    category: 'ingredient_discovery',
  },
  {
    id: 'story_04_aloe',
    label: 'Story 04 · Pure Aloe Vera',
    prompt: 'Tell me the full Ingredient Story 04 for Aloe Vera and its hydration mechanism',
    category: 'ingredient_discovery',
  },
  {
    id: 'ing_niacinamide',
    label: 'Ingredient: Niacinamide',
    prompt: 'Tell me about Niacinamide in Sea Buckthorn Face Wash',
    category: 'ingredient_discovery',
  },
  {
    id: 'all_32_ingredients',
    label: 'Explore All 32 Ingredients',
    prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
    category: 'ingredient_deep_dive',
  },
  {
    id: 'usage_time',
    label: '12-Step Face Wash Ritual & Timing',
    prompt: 'How do I really use Sea Buckthorn Face Wash step-by-step and what time of day should I use it?',
    category: 'usage_and_timing',
  },
  {
    id: 'interactive_ritual_player',
    label: 'Interactive 12-Step Ritual Timer',
    prompt: '__OPEN_RITUAL_PLAYER__',
    category: 'post_wash_routine',
  },
  {
    id: 'skin_quiz_8step',
    label: '8-Step Skin Diagnostic Quiz',
    prompt: '__OPEN_SKIN_DIAGNOSTIC__',
    category: 'skin_compatibility',
  },
  {
    id: 'how_to_join',
    label: 'Brand Ambassador Program',
    prompt: 'How do I join the Bhumivera Brand Ambassador Program?',
    category: 'ambassador',
  },
  {
    id: 'shipping_policy',
    label: 'Shipping & Delivery',
    prompt: 'What are your shipping charges and delivery timelines?',
    category: 'policy',
  },
  {
    id: 'verify_order',
    label: 'Order Support & Verification',
    prompt: '__OPEN_VERIFICATION_FLOW__',
    category: 'verification',
  },
];

export const VERIFIED_BUYER_CHIPS = [
  { id: 'track_order', label: 'Track My Order', prompt: 'Where is my latest order?' },
  {
    id: 'initiate_return',
    label: 'Return or Replacement (6-Step Guide)',
    prompt: 'I want to initiate a return or replacement for my delivered order.',
  },
  {
    id: 'order_assistance',
    label: 'Order Modification / Escalation (7-Step)',
    prompt: '__OPEN_VERIFICATION_FLOW__',
  },
  {
    id: 'wallet_loyalty',
    label: 'Wallet & Privilege Tier',
    prompt: 'What is my current wallet balance and loyalty points?',
  },
  {
    id: 'active_coupons',
    label: 'Available Offers',
    prompt: 'Show me active coupons and offers for my account.',
  },
  {
    id: 'all_32_ingredients_verified',
    label: 'Botanical Encyclopedia (32 Actives)',
    prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
    category: 'ingredient_deep_dive',
  },
  {
    id: 'ritual_timer_verified',
    label: '12-Step Cleansing Ritual Guide',
    prompt: '__OPEN_RITUAL_PLAYER__',
    category: 'usage_and_timing',
  },
];

export const CALLBACK_SLOTS = [
  'Morning (10 AM–1 PM)',
  'Afternoon (1 PM–5 PM)',
  'Evening (5 PM–8 PM)',
];

export const EXTENDED_CALLBACK_SLOTS = [
  {
    id: 'slot_morning_early',
    label: 'Morning (10 AM–1 PM)',
    window: '10:00 AM – 01:00 PM IST',
    specialistTeam: 'Senior Botanical & Order Operations Desk',
    avgWaitMinutes: 25,
  },
  {
    id: 'slot_afternoon_mid',
    label: 'Afternoon (1 PM–5 PM)',
    window: '01:00 PM – 05:00 PM IST',
    specialistTeam: 'Logistics, Dispatch & Formulation Desk',
    avgWaitMinutes: 35,
  },
  {
    id: 'slot_evening_prime',
    label: 'Evening (5 PM–8 PM)',
    window: '05:00 PM – 08:00 PM IST',
    specialistTeam: 'Executive Client Concierge Desk',
    avgWaitMinutes: 20,
  },
];

export const ORDER_STEPS = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

export const DETAILED_ORDER_LIFECYCLE_STEPS = [
  {
    stepIndex: 0,
    code: 'PLACED',
    label: 'Placed',
    title: 'Order Authenticated & Reserved',
    description:
      'Your order has been cryptographically logged and fresh small-batch botanical units have been reserved in our climate-controlled vault.',
    typicalDuration: 'Instant (0–15 mins)',
  },
  {
    stepIndex: 1,
    code: 'CONFIRMED',
    label: 'Confirmed',
    title: 'Batch Quality & Seal Verification',
    description:
      'Our apothecary quality assurance specialist verifies batch manufacturing date, pH stability certificate, and tamper-evident gold seal integrity.',
    typicalDuration: '2–6 hours',
  },
  {
    stepIndex: 2,
    code: 'PACKED',
    label: 'Packed',
    title: 'Eco-Luxury Honeycomb Cushion Packaging',
    description:
      'Hand-wrapped in FSC-certified botanical kraft sleeves with thermal shock protection and your personalized ritual guide card.',
    typicalDuration: '6–18 hours',
  },
  {
    stepIndex: 3,
    code: 'SHIPPED',
    label: 'Shipped',
    title: 'Dispatched via Priority Surface/Air Courier',
    description:
      'Handed over to our express logistics partner with live AWB telemetry and SMS/Email milestone alerts.',
    typicalDuration: '2–5 business days',
  },
  {
    stepIndex: 4,
    code: 'DELIVERED',
    label: 'Delivered',
    title: 'Delivered & 7-Day Inspection Window Active',
    description:
      'Package delivered to your doorstep. Your 12-Step Skincare Ritual unlocks along with our 7-day verified replacement guarantee.',
    typicalDuration: 'Completed',
  },
];

export const STATUS_META = {
  active: {
    label: 'Concierge Online',
    badgeClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    description: 'AI Botanical & Order Concierge responding in real time',
  },
  pending: {
    label: 'Awaiting Details',
    badgeClass: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    description: 'Waiting for order verification or photo inspection details',
  },
  waiting_for_review: {
    label: 'Specialist Review',
    badgeClass: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
    description: 'Queued for Senior Client Concierge review under 12-hour SLA',
  },
  escalated: {
    label: 'Specialist Assigned',
    badgeClass: 'bg-rose-500/20 text-rose-200 border-rose-400/40',
    description: 'Verified priority ticket active with dedicated specialist outreach',
  },
  resolved: {
    label: 'Resolved',
    badgeClass: 'bg-teal-500/20 text-teal-200 border-teal-400/40',
    description: 'Inquiry resolved — reply anytime to reopen this thread',
  },
  closed: {
    label: 'Archived',
    badgeClass: 'bg-stone-500/20 text-stone-200 border-stone-400/40',
    description: 'Session archived — send a message to resume conversation',
  },
};

export const BOTANICAL_INGREDIENT_ENCYCLOPEDIA = [
  {
    id: "sea_buckthorn",
    indexNumber: 1,
    storyNumber: "INGREDIENT STORY \u00b7 01",
    isHeroStory: true,
    name: "Sea Buckthorn",
    fullTitle: "Himalayan Sea Buckthorn Berry & Seed Complex",
    latinBinomial: "Hippophae rhamnoides L.",
    inciName: "Hippophae Rhamnoides Fruit Oil & Seed Extract",
    category: "Hero Botanical \u00b7 Story 01",
    noteFamily: "Golden Berry \u00b7 Omega 3-6-7-9",
    tagline: "A vivid botanical with a story all its own.",
    shortSummary: "Wild-harvested at 3,600m in Ladakh, Sea Buckthorn is nature's richest botanical source of rare Omega-7 (Palmitoleic Acid), bioactive carotenoids, and 190+ phytonutrients that replenish the skin barrier while awakening luminosity.",
    originRegion: "Ladakh & Spiti Valley, Trans-Himalayan Cold Desert, India (3,200m\u20134,100m)",
    harvestSeason: "Late September to Mid-October (First Himalayan Frost Window)",
    extractionMethod: "Supercritical CO2 Dual Extraction (Pulp + Seed) at 31\u00b0C",
    concentrationInFormula: "3.50% Standardized Bio-Lipid & Flavonoid Complex",
    optimalPhRange: "4.8 \u2013 5.6",
    solubility: "Amphiphilic Micro-Emulsion (Lipid Core + Flavonoid Glycosides)",
    molecularWeightProfile: "254.4 Da (Palmitoleic Acid) to 536.9 Da (Beta-Carotene)",
    ayurvedicDoshaAffinity: "Tridoshic \u2014 Deeply pacifies Vata dryness and Pitta solar inflammation",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 1,
    primaryFocusZone: "Full face, cheekbone high-points, and lipid-depleted barrier zones",
    primaryClinicalBenefit: "Omega-7 barrier lipid restoration, antioxidant brightening, and zero-strip cleansing cushion",
    sensoryProfile: {
      color: "Vivid Saffron-Amber to Marigold Gold",
      aroma: "Sun-ripened mountain citrus berry with crisp herbaceous undertones",
      skinFeel: "Velvety, cushiony, non-greasy satin finish",
    },
    bioactiveCompounds: [
      {
        compound: "Palmitoleic Acid (Omega-7)",
        concentration: "32% \u2013 38% of Pulp Lipid Fraction",
        role: "Biomimetic Epidermal Lipid Replenisher",
        biochemicalTarget: "Integrates directly into stratum corneum intercellular lipid lamellae and accelerates keratinocyte re-epithelialization.",
      },
      {
        compound: "Natural Ascorbic Acid & Flavonoids (Vitamin C)",
        concentration: "600mg \u2013 1,400mg per 100g Berry",
        role: "Collagen Hydroxylation Cofactor & Tyrosinase Moderator",
        biochemicalTarget: "Stimulates pro-collagen I/III synthesis in dermal fibroblasts while neutralizing reactive oxygen species (ROS).",
      },
      {
        compound: "Tocopherols & Tocotrienols (Vitamin E Complex)",
        concentration: "180mg \u2013 240mg per 100g Oil",
        role: "Lipid Peroxidation Shield",
        biochemicalTarget: "Terminates free-radical chain reactions in squalene and epidermal cell membranes exposed to UVA/UVB.",
      },
      {
        compound: "Isorhamnetin, Quercetin & Beta-Carotene",
        concentration: "1.8% Total Polyphenols & Carotenoids",
        role: "Photo-Protective & Micro-Circulation Activator",
        biochemicalTarget: "Downregulates MMP-1/MMP-9 collagenase enzymes and inhibits NF-kB pro-inflammatory signaling.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Sea Buckthorn)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Sea Buckthorn (Hippophae Rhamnoides Fruit Oil & Seed Extract) partitions across Full face, cheekbone high-points, and lipid-depleted barrier zones at pH 4.8 \u2013 5.6, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate velvety, cushiony, non-greasy satin finish with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (254.4 Da (Palmitoleic Acid) to 536.9 Da (Beta-Carotene))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Palmitoleic Acid (Omega-7), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver omega-7 barrier lipid restoration, antioxidant brightening, and zero-strip cleansing cushion.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Natural Ascorbic Acid & Flavonoids (Vitamin C))",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Stimulates pro-collagen I/III synthesis in dermal fibroblasts while neutralizing reactive oxygen species (ROS).",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Tocopherols & Tocotrienols (Vitamin E Complex))",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Terminates free-radical chain reactions in squalene and epidermal cell membranes exposed to UVA/UVB.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Isorhamnetin, Quercetin & Beta-Carotene)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Downregulates MMP-1/MMP-9 collagenase enzymes and inhibits NF-kB pro-inflammatory signaling.",
        visibleOutcome: "Lasting improvement in Full face, cheekbone high-points, and lipid-depleted barrier zones clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Sea Buckthorn Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Tridoshic \u2014 Deeply pacifies Vata dryness and Pitta solar inflammation while compounding synergy with Niacinamide (Vitamin B3) and Pure Aloe Vera (Story 04).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Full face, cheekbone high-points, and lipid-depleted barrier zones for Sea Buckthorn absorption.",
        proTip: "Sea Buckthorn maintains peak stability at pH 4.8 \u2013 5.6; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (3.50% Standardized Bio-Lipid & Flavonoid Complex)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Sea Buckthorn-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Sea Buckthorn and Niacinamide (Vitamin B3) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the amphiphilic micro-emulsion (lipid core + flavonoid glycosides) matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Full face, cheekbone high-points, an",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Full face, cheekbone high-points, and lipid-depleted barrier zones.",
        proTip: "Use featherlight ring-finger pressure so Palmitoleic Acid (Omega-7) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Palmitoleic Acid (Omega-7) and Natural Ascorbic Acid & Flavonoids (Vitamin C) bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Niacinamide (Vitamin B3) or Pure Aloe Vera (Story 04) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Palmitoleic Acid (Omega-7) across the upper stratum corneum at pH 4.8 \u2013 5.6.",
        experience: "Skin feels velvety, cushiony, non-greasy satin finish with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in omega-7 barrier lipid restoration, antioxidant brightening, and zero-strip cleansing cushion and reduced daily oxidative stress.",
        experience: "Full face, cheekbone high-points, and lipid-depleted barrier zones appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Natural Ascorbic Acid & Flavonoids (Vitamin C) and Tocopherols & Tocotrienols (Vitamin E Complex).",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Sea Buckthorn + Niacinamide (Vitamin B3).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 1/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports omega-7 barrier lipid restoration, antioxidant brightening, and zero-strip cleansing cushion while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Full face, cheekbone high-points, and lipid-depleted barrier zones.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.8 \u2013 5.6 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (1/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Palmitoleic Acid (Omega-7) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "niacinamide",
        partnerName: "Niacinamide (Vitamin B3)",
        synergyScore: "99/100",
        combinedBenefit: "Exogenous Omega-7 lipids + endogenous ceramide synthesis and melanosome transfer blockade.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "aloe_vera",
        partnerName: "Pure Aloe Vera (Story 04)",
        synergyScore: "98/100",
        combinedBenefit: "Acemannan hydro-matrix locks in Sea Buckthorn's lipid-soluble carotenoids.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "panthenol",
        partnerName: "D-Panthenol (Pro-Vitamin B5)",
        synergyScore: "96/100",
        combinedBenefit: "Accelerates barrier recovery and calms post-cleansing erythema.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.8 \u2013 5.6. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Sea Buckthorn work inside Bhumivera formulations?",
        answer: "Wild-harvested at 3,600m in Ladakh, Sea Buckthorn is nature's richest botanical source of rare Omega-7 (Palmitoleic Acid), bioactive carotenoids, and 190+ phytonutrients that replenish the skin barrier while awakening luminosity. Its primary bioactive, Palmitoleic Acid (Omega-7) (32% \u2013 38% of Pulp Lipid Fraction), targets Full face, cheekbone high-points, and lipid-depleted barrier zones to deliver omega-7 barrier lipid restoration, antioxidant brightening, and zero-strip cleansing cushion.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Sea Buckthorn?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Sea Buckthorn?",
        answer: "Sea Buckthorn achieves peak clinical synergy when paired with Niacinamide (Vitamin B3) (99/100 synergy), Pure Aloe Vera (Story 04) (98/100 synergy), and D-Panthenol (Pro-Vitamin B5) (96/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "sea_buckthorn_pair_0",
        label: "Synergy: Niacinamide (Vitamin B3)",
        prompt: "Tell me about Niacinamide (Vitamin B3) and how it works with Sea Buckthorn",
        category: 'closely_related_ingredient',
      },
      {
        id: "sea_buckthorn_pair_1",
        label: "Synergy: Pure Aloe Vera (Story 04)",
        prompt: "Tell me about Pure Aloe Vera (Story 04) and how it works with Sea Buckthorn",
        category: 'closely_related_ingredient',
      },
      {
        id: "sea_buckthorn_ritual_steps",
        label: "6-Step Sea Buckthorn Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Sea Buckthorn",
        category: 'usage_and_timing',
      },
      {
        id: "sea_buckthorn_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "activated_charcoal",
    indexNumber: 2,
    storyNumber: "INGREDIENT STORY \u00b7 02",
    isHeroStory: true,
    name: "Activated Bamboo Charcoal",
    fullTitle: "Steam-Activated Highland Moso Bamboo Charcoal",
    latinBinomial: "Carbon (Phyllostachys edulis)",
    inciName: "Charcoal Powder (Steam-Activated 8-Micron Botanical Grade)",
    category: "Hero Botanical \u00b7 Story 02",
    noteFamily: "Elemental Mineral \u00b7 Pore-Purifying Adsorbent",
    tagline: "A grounded, elemental presence in the ritual.",
    shortSummary: "Kiln-carbonized at 900\u00b0C and activated with pure mountain steam, our 8-micron spherical Bamboo Charcoal acts as a gentle magnetic sponge\u2014binding PM2.5 urban pollutants, heavy metals, and oxidized blackhead sebum without scratching the epidermis.",
    originRegion: "Highland Bamboo Sanctuaries of Assam & Western Ghats, India",
    harvestSeason: "Late November \u2013 January (5-Year Mature Culms)",
    extractionMethod: "900\u00b0C Anaerobic Pyrolysis + High-Pressure Steam Micropore Activation",
    concentrationInFormula: "1.80% Micronized Spherical Suspension (>1,200 m\u00b2/g Surface Area)",
    optimalPhRange: "5.0 \u2013 5.8",
    solubility: "Insoluble Colloidal Micro-Suspension (Rinses 100% Clean)",
    molecularWeightProfile: "12.01 Da (Porous Elemental Carbon Lattice)",
    ayurvedicDoshaAffinity: "Kapha & Pitta Clarifier \u2014 Extracts stagnant Ama and excess thermal oiliness",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "T-zone, nasal wings, chin crease, and urban pollution-exposed areas",
    primaryClinicalBenefit: "Magnetic adsorption of PM2.5 pollutants, oxidized sebum plugs, and blackheads without abrasion",
    sensoryProfile: {
      color: "Deep Obsidian Slate transforming into Silky Pearl-Grey Foam",
      aroma: "Grounded rain-wet river stone with cool earthy clarity",
      skinFeel: "Ultra-smooth, zero-grit cushion that leaves pores weightless and breathable",
    },
    bioactiveCompounds: [
      {
        compound: "Microporous & Mesoporous Carbon Lattice",
        concentration: "94% High-Purity Activated Carbon",
        role: "Van der Waals Lipophilic Toxin Adsorbent",
        biochemicalTarget: "Traps polycyclic aromatic hydrocarbons (PAHs), diesel exhaust particulates (PM2.5), and oxidized sebum.",
      },
      {
        compound: "Bio-Available Trace Potassium, Calcium & Silica",
        concentration: "3.8% Natural Bamboo Mineral Ash",
        role: "Osmotic Ionic Balancer",
        biochemicalTarget: "Supports epidermal ion gradients required for tight junction barrier signaling.",
      },
      {
        compound: "Negative Surface Zeta-Potential Sites",
        concentration: "High Cation-Exchange Capacity",
        role: "Heavy Metal & Pollutant Magnet",
        biochemicalTarget: "Attracts positively charged heavy metal ions (lead, cadmium, nickel) from city air and hard tap water.",
      },
      {
        compound: "Spherical 8-Micron Polished Geometry",
        concentration: "100% Air-Jet Milled",
        role: "Zero-Microtear Follicular Sweeper",
        biochemicalTarget: "Rolls gently across the ostia of sebaceous follicles without creating jagged micro-abrasions.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Activated Bamboo Charcoal)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Activated Bamboo Charcoal (Charcoal Powder (Steam-Activated 8-Micron Botanical Grade)) partitions across T-zone, nasal wings, chin crease, and urban pollution-exposed areas at pH 5.0 \u2013 5.8, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate ultra-smooth, zero-grit cushion that leaves pores weightless and breathable with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (12.01 Da (Porous Elemental Carbon Lattice))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Microporous & Mesoporous Carbon Lattice, bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver magnetic adsorption of pm2.5 pollutants, oxidized sebum plugs, and blackheads without abrasion.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Bio-Available Trace Potassium, Calcium & Silica)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Supports epidermal ion gradients required for tight junction barrier signaling.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Negative Surface Zeta-Potential Sites)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Attracts positively charged heavy metal ions (lead, cadmium, nickel) from city air and hard tap water.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Spherical 8-Micron Polished Geometry)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Rolls gently across the ostia of sebaceous follicles without creating jagged micro-abrasions.",
        visibleOutcome: "Lasting improvement in T-zone, nasal wings, chin crease, and urban pollution-exposed areas clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Activated Bamboo Charcoal Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Kapha & Pitta Clarifier \u2014 Extracts stagnant Ama and excess thermal oiliness while compounding synergy with Sacred Tulsi (Story 03) and Botanical Salicylic Acid (BHA).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare T-zone, nasal wings, chin crease, and urban pollution-exposed areas for Activated Bamboo Charcoal absorption.",
        proTip: "Activated Bamboo Charcoal maintains peak stability at pH 5.0 \u2013 5.8; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.80% Micronized Spherical Suspension (>1,200 m\u00b2/g Surface Area))",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Activated Bamboo Charcoal-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Activated Bamboo Charcoal and Sacred Tulsi (Story 03) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the insoluble colloidal micro-suspension (rinses 100% clean) matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across T-zone, nasal wings, chin crease, an",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on T-zone, nasal wings, chin crease, and urban pollution-exposed areas.",
        proTip: "Use featherlight ring-finger pressure so Microporous & Mesoporous Carbon Lattice works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Microporous & Mesoporous Carbon Lattice and Bio-Available Trace Potassium, Calcium & Silica bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Sacred Tulsi (Story 03) or Botanical Salicylic Acid (BHA) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Microporous & Mesoporous Carbon Lattice across the upper stratum corneum at pH 5.0 \u2013 5.8.",
        experience: "Skin feels ultra-smooth, zero-grit cushion that leaves pores weightless and breathable with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in magnetic adsorption of pm2.5 pollutants, oxidized sebum plugs, and blackheads without abrasion and reduced daily oxidative stress.",
        experience: "T-zone, nasal wings, chin crease, and urban pollution-exposed areas appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Bio-Available Trace Potassium, Calcium & Silica and Negative Surface Zeta-Potential Sites.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Activated Bamboo Charcoal + Sacred Tulsi (Story 03).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports magnetic adsorption of pm2.5 pollutants, oxidized sebum plugs, and blackheads without abrasion while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across T-zone, nasal wings, chin crease, and urban pollution-exposed areas.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 5.0 \u2013 5.8 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Microporous & Mesoporous Carbon Lattice and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "sacred_tulsi",
        partnerName: "Sacred Tulsi (Story 03)",
        synergyScore: "99/100",
        combinedBenefit: "Charcoal adsorbs physical pore toxins while Tulsi neutralizes bacterial and oxidative triggers.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "salicylic_acid",
        partnerName: "Botanical Salicylic Acid (BHA)",
        synergyScore: "98/100",
        combinedBenefit: "BHA dissolves intercellular blackhead glue so Charcoal can lift plugs out effortlessly.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "aloe_vera",
        partnerName: "Pure Aloe Vera (Story 04)",
        synergyScore: "96/100",
        combinedBenefit: "Floods freshly decongested pores with soothing aqueous hydration.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 5.0 \u2013 5.8. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Activated Bamboo Charcoal work inside Bhumivera formulations?",
        answer: "Kiln-carbonized at 900\u00b0C and activated with pure mountain steam, our 8-micron spherical Bamboo Charcoal acts as a gentle magnetic sponge\u2014binding PM2.5 urban pollutants, heavy metals, and oxidized blackhead sebum without scratching the epidermis. Its primary bioactive, Microporous & Mesoporous Carbon Lattice (94% High-Purity Activated Carbon), targets T-zone, nasal wings, chin crease, and urban pollution-exposed areas to deliver magnetic adsorption of pm2.5 pollutants, oxidized sebum plugs, and blackheads without abrasion.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Activated Bamboo Charcoal?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Activated Bamboo Charcoal?",
        answer: "Activated Bamboo Charcoal achieves peak clinical synergy when paired with Sacred Tulsi (Story 03) (99/100 synergy), Botanical Salicylic Acid (BHA) (98/100 synergy), and Pure Aloe Vera (Story 04) (96/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "activated_charcoal_pair_0",
        label: "Synergy: Sacred Tulsi (Story 03)",
        prompt: "Tell me about Sacred Tulsi (Story 03) and how it works with Activated Bamboo Charcoal",
        category: 'closely_related_ingredient',
      },
      {
        id: "activated_charcoal_pair_1",
        label: "Synergy: Botanical Salicylic Acid (BHA)",
        prompt: "Tell me about Botanical Salicylic Acid (BHA) and how it works with Activated Bamboo Charcoal",
        category: 'closely_related_ingredient',
      },
      {
        id: "activated_charcoal_ritual_steps",
        label: "6-Step Activated Bamboo Charcoal Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Activated Bamboo Charcoal",
        category: 'usage_and_timing',
      },
      {
        id: "activated_charcoal_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "sacred_tulsi",
    indexNumber: 3,
    storyNumber: "INGREDIENT STORY \u00b7 03",
    isHeroStory: true,
    name: "Sacred Tulsi (Holy Basil)",
    fullTitle: "Dual-Cultivar Rama & Krishna Tulsi Adaptogenic Distillate",
    latinBinomial: "Ocimum tenuiflorum L. (syn. Ocimum sanctum)",
    inciName: "Ocimum Sanctum Leaf Extract & Hydro-Distillate",
    category: "Hero Botanical \u00b7 Story 03",
    noteFamily: "Ayurvedic Adaptogen \u00b7 Clarifying Leaf",
    tagline: "A familiar botanical, seen with fresh attention.",
    shortSummary: "Revered for millennia and refined through cold ultrasonic extraction, Sacred Tulsi delivers ursolic acid, rosmarinic acid, and apigenin to calm stress-induced breakouts, balance the skin microbiome, and protect dermal collagen.",
    originRegion: "Regenerative Organic Herb Farms of Bundelkhand & Uttarakhand Foothills, India",
    harvestSeason: "October \u2013 November (Pre-Dawn Early Flowering Harvest)",
    extractionMethod: "Copper-Alembic Hydro-Distillation + Cold Ultrasonic Triterpenoid Isolation",
    concentrationInFormula: "2.25% Standardized Ursolic & Rosmarinic Acid Complex (<0.02% Eugenol)",
    optimalPhRange: "5.0 \u2013 5.6",
    solubility: "Hydro-Glycolic & Amphiphilic Botanical Infusion",
    molecularWeightProfile: "360.3 Da (Rosmarinic Acid) to 456.7 Da (Ursolic Acid)",
    ayurvedicDoshaAffinity: "Kapha & Pitta Harmonizer \u2014 Clears thermal redness and microbial congestion",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Jawline hormonal zones, cheeks, forehead, and blemish-prone areas",
    primaryClinicalBenefit: "Cortisol-stress sebum regulation, microbiome-safe blemish defense, and redness calming",
    sensoryProfile: {
      color: "Luminous Emerald-Chartreuse Infusion",
      aroma: "Fresh-crushed temple basil leaf, crisp green stem, and subtle morning dew",
      skinFeel: "Weightless, cooling, and clarifying tonic sensation",
    },
    bioactiveCompounds: [
      {
        compound: "Ursolic Acid & Oleanolic Acid",
        concentration: "2.5% Pentacyclic Triterpenoids",
        role: "Dermal Elastase & MMP-1 Inhibitor",
        biochemicalTarget: "Inhibits matrix metalloproteinases that break down collagen during UV or inflammatory acne flare-ups.",
      },
      {
        compound: "Rosmarinic Acid & Caffeic Acid",
        concentration: "4.2% Polyphenolic Fraction",
        role: "Neuro-Inflammatory & Redness Suppressor",
        biochemicalTarget: "Blocks COX-2 and lipoxygenase pathways, visibly calming angry red papules within hours.",
      },
      {
        compound: "Orientin, Vicenin & Apigenin Flavonoids",
        concentration: "1.9% Radioprotective Flavonoids",
        role: "Blue-Light & Solar Free-Radical Scavenger",
        biochemicalTarget: "Protects keratinocyte DNA and mitochondrial membranes from HEV blue light and urban smog.",
      },
      {
        compound: "Micro-Filtered Eugenol (<0.02%)",
        concentration: "Controlled Non-Sensitizing Threshold",
        role: "Selective C. acnes Biofilm Disruptor",
        biochemicalTarget: "Disrupts quorum sensing in acne-causing bacteria while leaving beneficial Staphylococcus epidermidis unharmed.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Sacred Tulsi (Holy Basil))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Sacred Tulsi (Holy Basil) (Ocimum Sanctum Leaf Extract & Hydro-Distillate) partitions across Jawline hormonal zones, cheeks, forehead, and blemish-prone areas at pH 5.0 \u2013 5.6, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate weightless, cooling, and clarifying tonic sensation with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (360.3 Da (Rosmarinic Acid) to 456.7 Da (Ursolic Acid))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Ursolic Acid & Oleanolic Acid, bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver cortisol-stress sebum regulation, microbiome-safe blemish defense, and redness calming.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Rosmarinic Acid & Caffeic Acid)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Blocks COX-2 and lipoxygenase pathways, visibly calming angry red papules within hours.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Orientin, Vicenin & Apigenin Flavonoids)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Protects keratinocyte DNA and mitochondrial membranes from HEV blue light and urban smog.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Micro-Filtered Eugenol (<0.02%))",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Disrupts quorum sensing in acne-causing bacteria while leaving beneficial Staphylococcus epidermidis unharmed.",
        visibleOutcome: "Lasting improvement in Jawline hormonal zones, cheeks, forehead, and blemish-prone areas clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Sacred Tulsi (Holy Basil) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Kapha & Pitta Harmonizer \u2014 Clears thermal redness and microbial congestion while compounding synergy with Activated Bamboo Charcoal (Story 02) and Niacinamide (Vitamin B3).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Jawline hormonal zones, cheeks, forehead, and blemish-prone areas for Sacred Tulsi (Holy Basil) absorption.",
        proTip: "Sacred Tulsi (Holy Basil) maintains peak stability at pH 5.0 \u2013 5.6; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (2.25% Standardized Ursolic & Rosmarinic Acid Complex (<0.02% Eugenol))",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Sacred Tulsi (Holy Basil)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Sacred Tulsi (Holy Basil) and Activated Bamboo Charcoal (Story 02) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the hydro-glycolic & amphiphilic botanical infusion matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Jawline hormonal zones, cheeks, fore",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Jawline hormonal zones, cheeks, forehead, and blemish-prone areas.",
        proTip: "Use featherlight ring-finger pressure so Ursolic Acid & Oleanolic Acid works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Ursolic Acid & Oleanolic Acid and Rosmarinic Acid & Caffeic Acid bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Activated Bamboo Charcoal (Story 02) or Niacinamide (Vitamin B3) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Ursolic Acid & Oleanolic Acid across the upper stratum corneum at pH 5.0 \u2013 5.6.",
        experience: "Skin feels weightless, cooling, and clarifying tonic sensation with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in cortisol-stress sebum regulation, microbiome-safe blemish defense, and redness calming and reduced daily oxidative stress.",
        experience: "Jawline hormonal zones, cheeks, forehead, and blemish-prone areas appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Rosmarinic Acid & Caffeic Acid and Orientin, Vicenin & Apigenin Flavonoids.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Sacred Tulsi (Holy Basil) + Activated Bamboo Charcoal (Story 02).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports cortisol-stress sebum regulation, microbiome-safe blemish defense, and redness calming while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Jawline hormonal zones, cheeks, forehead, and blemish-prone areas.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 5.0 \u2013 5.6 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Ursolic Acid & Oleanolic Acid and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "activated_charcoal",
        partnerName: "Activated Bamboo Charcoal (Story 02)",
        synergyScore: "99/100",
        combinedBenefit: "Deep pore adsorption paired with adaptogenic antibacterial calm.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "niacinamide",
        partnerName: "Niacinamide (Vitamin B3)",
        synergyScore: "98/100",
        combinedBenefit: "Dual anti-inflammatory and sebum-regulating action against blemishes and dark marks.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "centella_asiatica",
        partnerName: "Centella Asiatica (Gotu Kola)",
        synergyScore: "97/100",
        combinedBenefit: "Ursolic acid + Madecassoside accelerate post-blemish tissue repair.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 5.0 \u2013 5.6. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Sacred Tulsi (Holy Basil) work inside Bhumivera formulations?",
        answer: "Revered for millennia and refined through cold ultrasonic extraction, Sacred Tulsi delivers ursolic acid, rosmarinic acid, and apigenin to calm stress-induced breakouts, balance the skin microbiome, and protect dermal collagen. Its primary bioactive, Ursolic Acid & Oleanolic Acid (2.5% Pentacyclic Triterpenoids), targets Jawline hormonal zones, cheeks, forehead, and blemish-prone areas to deliver cortisol-stress sebum regulation, microbiome-safe blemish defense, and redness calming.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Sacred Tulsi (Holy Basil)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Sacred Tulsi (Holy Basil)?",
        answer: "Sacred Tulsi (Holy Basil) achieves peak clinical synergy when paired with Activated Bamboo Charcoal (Story 02) (99/100 synergy), Niacinamide (Vitamin B3) (98/100 synergy), and Centella Asiatica (Gotu Kola) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "sacred_tulsi_pair_0",
        label: "Synergy: Activated Bamboo Charcoal (Story 02)",
        prompt: "Tell me about Activated Bamboo Charcoal (Story 02) and how it works with Sacred Tulsi (Holy Basil)",
        category: 'closely_related_ingredient',
      },
      {
        id: "sacred_tulsi_pair_1",
        label: "Synergy: Niacinamide (Vitamin B3)",
        prompt: "Tell me about Niacinamide (Vitamin B3) and how it works with Sacred Tulsi (Holy Basil)",
        category: 'closely_related_ingredient',
      },
      {
        id: "sacred_tulsi_ritual_steps",
        label: "6-Step Sacred Tulsi (Holy Basil) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Sacred Tulsi (Holy Basil)",
        category: 'usage_and_timing',
      },
      {
        id: "sacred_tulsi_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "aloe_vera",
    indexNumber: 4,
    storyNumber: "INGREDIENT STORY \u00b7 04",
    isHeroStory: true,
    name: "Pure Aloe Vera",
    fullTitle: "Cold-Filleted Barbadensis Inner Leaf Bio-Polysaccharide Gel",
    latinBinomial: "Aloe barbadensis miller",
    inciName: "Aloe Barbadensis Leaf Juice (Aloin-Free Cold Stabilized)",
    category: "Hero Botanical \u00b7 Story 04",
    noteFamily: "Succulent Hydro-Matrix \u00b7 Barrier Soother",
    tagline: "A generous plant, and a thoughtful place to begin.",
    shortSummary: "Harvested from 3-year mature desert succulents and cold-filleted within 4 hours of sunrise, our Aloin-free Aloe Vera replaces inert water as the living hydration foundation of Bhumivera\u2014delivering Acemannan polysaccharides, 18 amino acids, and instant thermal cooling.",
    originRegion: "Thar Desert Mineral Belt (Rajasthan) & Kutch, India",
    harvestSeason: "Year-Round Sunrise Harvest of 36-Month Mature Outer Leaves",
    extractionMethod: "Hand-Filleted Inner Parenchyma Gel + Cold Flash-Stabilization (Zero Heat)",
    concentrationInFormula: "32.00% First-Press Bio-Active Aqueous Base",
    optimalPhRange: "4.5 \u2013 5.5",
    solubility: "100% Aqueous Mucopolysaccharide Hydro-Gel",
    molecularWeightProfile: "50 kDa \u2013 1,500 kDa (Native Acemannan Polymers)",
    ayurvedicDoshaAffinity: "Kumari Rasayana \u2014 Cools Pitta heat and deeply hydrates Vata parched skin",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Entire face, delicate eye contour perimeter, neck, and sun-exposed skin",
    primaryClinicalBenefit: "32% living bio-water hydration, Aquaporin-3 activation, and instant thermal soothing",
    sensoryProfile: {
      color: "Crystal-Clear Dewy Aquamarine Shimmer",
      aroma: "Clean succulent green leaf and cool morning dew",
      skinFeel: "Refreshing, weightless hydro-cushion with zero tackiness (-1.8\u00b0C cooling feel)",
    },
    bioactiveCompounds: [
      {
        compound: "Acemannan (Acetylated Beta-1,4-Glucomannan)",
        concentration: "1,600 mg/L Native Polysaccharide",
        role: "Breathable Hydro-Mesh & Fibroblast Activator",
        biochemicalTarget: "Forms a moisture-locking lattice on corneocytes while binding mannose receptors to stimulate collagen and HA synthesis.",
      },
      {
        compound: "Bradykinase & Carboxypeptidase Enzymes",
        concentration: "Cold-Preserved Enzymatic Fraction",
        role: "Immediate Thermal & Bradykinin Calmer",
        biochemicalTarget: "Hydrolyzes pro-inflammatory bradykinin peptides on contact, reducing heat, stinging, and post-sun erythema.",
      },
      {
        compound: "Plant Sterols (Lupeol, Campesterol, Sitosterol)",
        concentration: "0.45% Phytosterol Fraction",
        role: "Anti-Erythema & Barrier Lipid Support",
        biochemicalTarget: "Mimics epidermal cholesterol to reinforce the lipid bilayer during and after cleansing.",
      },
      {
        compound: "18 Essential Amino Acids + Zinc & Magnesium",
        concentration: "Natural Moisturizing Factor (NMF)",
        role: "Osmo-Protective Cellular Hydrator",
        biochemicalTarget: "Replenishes stratum corneum NMF so skin retains water even in low-humidity AC environments.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Pure Aloe Vera)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Pure Aloe Vera (Aloe Barbadensis Leaf Juice (Aloin-Free Cold Stabilized)) partitions across Entire face, delicate eye contour perimeter, neck, and sun-exposed skin at pH 4.5 \u2013 5.5, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate refreshing, weightless hydro-cushion with zero tackiness (-1.8\u00b0c cooling feel) with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (50 kDa \u2013 1,500 kDa (Native Acemannan Polymers))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Acemannan (Acetylated Beta-1,4-Glucomannan), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver 32% living bio-water hydration, aquaporin-3 activation, and instant thermal soothing.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Bradykinase & Carboxypeptidase Enzymes)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Hydrolyzes pro-inflammatory bradykinin peptides on contact, reducing heat, stinging, and post-sun erythema.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Plant Sterols (Lupeol, Campesterol, Sitosterol))",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Mimics epidermal cholesterol to reinforce the lipid bilayer during and after cleansing.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (18 Essential Amino Acids + Zinc & Magnesium)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Replenishes stratum corneum NMF so skin retains water even in low-humidity AC environments.",
        visibleOutcome: "Lasting improvement in Entire face, delicate eye contour perimeter, neck, and sun-exposed skin clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Pure Aloe Vera Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Kumari Rasayana \u2014 Cools Pitta heat and deeply hydrates Vata parched skin while compounding synergy with Sea Buckthorn (Story 01) and Multi-Molecular Hyaluronic Acid.",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Entire face, delicate eye contour perimeter, neck, and sun-exposed skin for Pure Aloe Vera absorption.",
        proTip: "Pure Aloe Vera maintains peak stability at pH 4.5 \u2013 5.5; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (32.00% First-Press Bio-Active Aqueous Base)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Pure Aloe Vera-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Pure Aloe Vera and Sea Buckthorn (Story 01) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the 100% aqueous mucopolysaccharide hydro-gel matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Entire face, delicate eye contour pe",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Entire face, delicate eye contour perimeter, neck, and sun-exposed skin.",
        proTip: "Use featherlight ring-finger pressure so Acemannan (Acetylated Beta-1,4-Glucomannan) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Acemannan (Acetylated Beta-1,4-Glucomannan) and Bradykinase & Carboxypeptidase Enzymes bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Sea Buckthorn (Story 01) or Multi-Molecular Hyaluronic Acid within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Acemannan (Acetylated Beta-1,4-Glucomannan) across the upper stratum corneum at pH 4.5 \u2013 5.5.",
        experience: "Skin feels refreshing, weightless hydro-cushion with zero tackiness (-1.8\u00b0c cooling feel) with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in 32% living bio-water hydration, aquaporin-3 activation, and instant thermal soothing and reduced daily oxidative stress.",
        experience: "Entire face, delicate eye contour perimeter, neck, and sun-exposed skin appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Bradykinase & Carboxypeptidase Enzymes and Plant Sterols (Lupeol, Campesterol, Sitosterol).",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Pure Aloe Vera + Sea Buckthorn (Story 01).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports 32% living bio-water hydration, aquaporin-3 activation, and instant thermal soothing while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Entire face, delicate eye contour perimeter, neck, and sun-exposed skin.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.5 \u2013 5.5 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Acemannan (Acetylated Beta-1,4-Glucomannan) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "sea_buckthorn",
        partnerName: "Sea Buckthorn (Story 01)",
        synergyScore: "99/100",
        combinedBenefit: "Aloe provides the aqueous polysaccharide phase while Sea Buckthorn provides the Omega-7 lipid phase.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "hyaluronic_acid",
        partnerName: "Multi-Molecular Hyaluronic Acid",
        synergyScore: "98/100",
        combinedBenefit: "Acemannan + 5-weight HA form a dual moisture net holding 1,000x water weight.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "panthenol",
        partnerName: "D-Panthenol (Pro-Vitamin B5)",
        synergyScore: "97/100",
        combinedBenefit: "Doubles barrier repair, post-sun recovery, and redness reduction.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.5 \u2013 5.5. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Pure Aloe Vera work inside Bhumivera formulations?",
        answer: "Harvested from 3-year mature desert succulents and cold-filleted within 4 hours of sunrise, our Aloin-free Aloe Vera replaces inert water as the living hydration foundation of Bhumivera\u2014delivering Acemannan polysaccharides, 18 amino acids, and instant thermal cooling. Its primary bioactive, Acemannan (Acetylated Beta-1,4-Glucomannan) (1,600 mg/L Native Polysaccharide), targets Entire face, delicate eye contour perimeter, neck, and sun-exposed skin to deliver 32% living bio-water hydration, aquaporin-3 activation, and instant thermal soothing.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Pure Aloe Vera?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Pure Aloe Vera?",
        answer: "Pure Aloe Vera achieves peak clinical synergy when paired with Sea Buckthorn (Story 01) (99/100 synergy), Multi-Molecular Hyaluronic Acid (98/100 synergy), and D-Panthenol (Pro-Vitamin B5) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "aloe_vera_pair_0",
        label: "Synergy: Sea Buckthorn (Story 01)",
        prompt: "Tell me about Sea Buckthorn (Story 01) and how it works with Pure Aloe Vera",
        category: 'closely_related_ingredient',
      },
      {
        id: "aloe_vera_pair_1",
        label: "Synergy: Multi-Molecular Hyaluronic Acid",
        prompt: "Tell me about Multi-Molecular Hyaluronic Acid and how it works with Pure Aloe Vera",
        category: 'closely_related_ingredient',
      },
      {
        id: "aloe_vera_ritual_steps",
        label: "6-Step Pure Aloe Vera Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Pure Aloe Vera",
        category: 'usage_and_timing',
      },
      {
        id: "aloe_vera_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "niacinamide",
    indexNumber: 5,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 05",
    isHeroStory: false,
    name: "Niacinamide (Vitamin B3)",
    fullTitle: "Pharmaceutical-Grade Low-Nicotinic Niacinamide (Vitamin B3)",
    latinBinomial: "Pyridine-3-carboxamide (Bio-Fermented Vitamin B3)",
    inciName: "Niacinamide (USP Ultra-Pure <50ppm Nicotinic Acid)",
    category: "Contemporary Active \u00b7 Barrier & Pore Architect",
    noteFamily: "Cellular Coenzyme \u00b7 NAD+/NADP+ Precursor",
    tagline: "The multi-pathway cellular communicator for barrier strength, pore refinement, and even tone.",
    shortSummary: "Calibrated at a bio-optimal 4.0% concentration with less than 50 ppm free nicotinic acid (zero flushing), Niacinamide serves as the direct precursor to cellular NAD+\u2014boosting endogenous ceramides by 34%, tightening stretched pores, and halting melanosome transfer.",
    originRegion: "Swiss-Standard Bio-Fermentation Synthesis (Formulated in India)",
    harvestSeason: "Continuous Precision Bio-Fermentation",
    extractionMethod: "Enzymatic Biocatalysis + Triple Crystallization Purification",
    concentrationInFormula: "4.00% Clinical Optimum (Zero-Flush Grade)",
    optimalPhRange: "5.0 \u2013 6.5",
    solubility: "100% Water-Soluble Hydrophilic Active",
    molecularWeightProfile: "122.12 Da (Rapid Epidermal Penetration)",
    ayurvedicDoshaAffinity: "Tridoshic \u2014 Balances Pitta pigmentation, Kapha oiliness, and Vata barrier thinning",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones",
    primaryClinicalBenefit: "+34% endogenous ceramide boost, 68% melanosome transfer blockade, and pore refinement",
    sensoryProfile: {
      color: "Crystal Transparent in Aqueous Solution",
      aroma: "Completely Odorless",
      skinFeel: "Weightless, silky slip with zero chalkiness or pilling",
    },
    bioactiveCompounds: [
      {
        compound: "NAD+ & NADP+ Coenzyme Precursor Ring",
        concentration: "99.95% Assay Purity",
        role: "Mitochondrial ATP & DNA Repair Coenzyme",
        biochemicalTarget: "Replenishes keratinocyte NAD+ pools depleted by UV radiation, powering PARP-1 DNA repair enzymes.",
      },
      {
        compound: "Serine Palmitoyltransferase (SPT) Upregulator",
        concentration: "Active at 2%\u20135% Threshold",
        role: "Endogenous Ceramide Synthesizer",
        biochemicalTarget: "Stimulates keratinocytes to manufacture their own Ceramide NP, AP, and EOP (+34%) and free fatty acids (+67%).",
      },
      {
        compound: "PAR-2 Receptor Modulator",
        concentration: "Clinical Pigment Gatekeeper",
        role: "Melanosome Dendrite Transfer Blocker",
        biochemicalTarget: "Prevents melanocytes from handing off pigment packets to surrounding keratinocytes by up to 68%.",
      },
      {
        compound: "Sebocyte Lipogenesis Regulator",
        concentration: "Sebum-Normalizing Bio-Signal",
        role: "Pore-Lining Elasticity Controller",
        biochemicalTarget: "Reduces facial sebum excretion rate (SER) within 2\u20134 weeks, preventing pore ostia dilation.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Niacinamide (Vitamin B3))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Niacinamide (Vitamin B3) (Niacinamide (USP Ultra-Pure <50ppm Nicotinic Acid)) partitions across Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones at pH 5.0 \u2013 6.5, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate weightless, silky slip with zero chalkiness or pilling with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (122.12 Da (Rapid Epidermal Penetration))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by NAD+ & NADP+ Coenzyme Precursor Ring, bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver +34% endogenous ceramide boost, 68% melanosome transfer blockade, and pore refinement.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Serine Palmitoyltransferase (SPT) Upregulator)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Stimulates keratinocytes to manufacture their own Ceramide NP, AP, and EOP (+34%) and free fatty acids (+67%).",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (PAR-2 Receptor Modulator)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Prevents melanocytes from handing off pigment packets to surrounding keratinocytes by up to 68%.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Sebocyte Lipogenesis Regulator)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Reduces facial sebum excretion rate (SER) within 2\u20134 weeks, preventing pore ostia dilation.",
        visibleOutcome: "Lasting improvement in Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Niacinamide (Vitamin B3) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Tridoshic \u2014 Balances Pitta pigmentation, Kapha oiliness, and Vata barrier thinning while compounding synergy with Sea Buckthorn (Story 01) and Bio-Chelated Zinc PCA.",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones for Niacinamide (Vitamin B3) absorption.",
        proTip: "Niacinamide (Vitamin B3) maintains peak stability at pH 5.0 \u2013 6.5; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (4.00% Clinical Optimum (Zero-Flush Grade))",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Niacinamide (Vitamin B3)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Niacinamide (Vitamin B3) and Sea Buckthorn (Story 01) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the 100% water-soluble hydrophilic active matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Enlarged pores on nose/cheeks, hyper",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones.",
        proTip: "Use featherlight ring-finger pressure so NAD+ & NADP+ Coenzyme Precursor Ring works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so NAD+ & NADP+ Coenzyme Precursor Ring and Serine Palmitoyltransferase (SPT) Upregulator bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Sea Buckthorn (Story 01) or Bio-Chelated Zinc PCA within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of NAD+ & NADP+ Coenzyme Precursor Ring across the upper stratum corneum at pH 5.0 \u2013 6.5.",
        experience: "Skin feels weightless, silky slip with zero chalkiness or pilling with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in +34% endogenous ceramide boost, 68% melanosome transfer blockade, and pore refinement and reduced daily oxidative stress.",
        experience: "Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Serine Palmitoyltransferase (SPT) Upregulator and PAR-2 Receptor Modulator.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Niacinamide (Vitamin B3) + Sea Buckthorn (Story 01).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports +34% endogenous ceramide boost, 68% melanosome transfer blockade, and pore refinement while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 5.0 \u2013 6.5 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 NAD+ & NADP+ Coenzyme Precursor Ring and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "sea_buckthorn",
        partnerName: "Sea Buckthorn (Story 01)",
        synergyScore: "99/100",
        combinedBenefit: "Dual-pathway brightening and Omega-7 + Ceramide barrier reconstruction.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "zinc_pca",
        partnerName: "Bio-Chelated Zinc PCA",
        synergyScore: "98/100",
        combinedBenefit: "Synergistic sebocyte regulation for unmatched oil and blemish control.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "panthenol",
        partnerName: "D-Panthenol (Pro-Vitamin B5)",
        synergyScore: "97/100",
        combinedBenefit: "Vitamin B3 + B5 rebuild damaged stratum corneum layers 2x faster.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 5.0 \u2013 6.5. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Niacinamide (Vitamin B3) work inside Bhumivera formulations?",
        answer: "Calibrated at a bio-optimal 4.0% concentration with less than 50 ppm free nicotinic acid (zero flushing), Niacinamide serves as the direct precursor to cellular NAD+\u2014boosting endogenous ceramides by 34%, tightening stretched pores, and halting melanosome transfer. Its primary bioactive, NAD+ & NADP+ Coenzyme Precursor Ring (99.95% Assay Purity), targets Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones to deliver +34% endogenous ceramide boost, 68% melanosome transfer blockade, and pore refinement.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Niacinamide (Vitamin B3)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Niacinamide (Vitamin B3)?",
        answer: "Niacinamide (Vitamin B3) achieves peak clinical synergy when paired with Sea Buckthorn (Story 01) (99/100 synergy), Bio-Chelated Zinc PCA (98/100 synergy), and D-Panthenol (Pro-Vitamin B5) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "niacinamide_pair_0",
        label: "Synergy: Sea Buckthorn (Story 01)",
        prompt: "Tell me about Sea Buckthorn (Story 01) and how it works with Niacinamide (Vitamin B3)",
        category: 'closely_related_ingredient',
      },
      {
        id: "niacinamide_pair_1",
        label: "Synergy: Bio-Chelated Zinc PCA",
        prompt: "Tell me about Bio-Chelated Zinc PCA and how it works with Niacinamide (Vitamin B3)",
        category: 'closely_related_ingredient',
      },
      {
        id: "niacinamide_ritual_steps",
        label: "6-Step Niacinamide (Vitamin B3) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Niacinamide (Vitamin B3)",
        category: 'usage_and_timing',
      },
      {
        id: "niacinamide_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "panthenol",
    indexNumber: 6,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 06",
    isHeroStory: false,
    name: "D-Panthenol (Pro-Vitamin B5)",
    fullTitle: "Bio-Active Dexpanthenol (Chirally Pure Pro-Vitamin B5)",
    latinBinomial: "(2R)-2,4-Dihydroxy-N-(3-hydroxypropyl)-3,3-dimethylbutanamide",
    inciName: "Panthenol (100% Chirally Pure D-Isomer)",
    category: "Contemporary Active \u00b7 Barrier Repair & Humectant",
    noteFamily: "Coenzyme A Precursor \u00b7 Deep Soother",
    tagline: "Chirally pure Pro-Vitamin B5 that converts into Pantothenic Acid to seal micro-fissures and lock in water.",
    shortSummary: "At 1.50% in Bhumivera formulas, chirally pure D-Panthenol penetrates into the living epidermis where it converts into Vitamin B5 (Pantothenic Acid), driving Coenzyme A lipid synthesis, reducing TEWL, and soothing redness.",
    originRegion: "Precision Stereoselective Synthesis (Pharmaceutical USP Grade)",
    harvestSeason: "Year-Round",
    extractionMethod: "Chiral D-Pantolactone Condensation & Molecular Distillation",
    concentrationInFormula: "1.50% Chirally Pure D-Panthenol",
    optimalPhRange: "4.5 \u2013 6.5",
    solubility: "Highly Water-Soluble Substantive Humectant",
    molecularWeightProfile: "205.25 Da (Deep Stratum Corneum Penetration)",
    ayurvedicDoshaAffinity: "Vata & Pitta Pacifier \u2014 Repairs dry cracks and cools inflammatory stinging",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin",
    primaryClinicalBenefit: "Coenzyme A barrier repair, keratin-substantive hydration, and rapid erythema relief",
    sensoryProfile: {
      color: "Crystal Clear Viscous Nectar",
      aroma: "Neutral Clean Note",
      skinFeel: "Plush, velvety moisture cushion that eliminates roughness on contact",
    },
    bioactiveCompounds: [
      {
        compound: "D-Panthenol (Biologically Active D-Enantiomer)",
        concentration: "1.50% Formula Concentration",
        role: "Pro-Vitamin B5 Epidermal Penetrator",
        biochemicalTarget: "Enzymatically oxidized into Pantothenic Acid inside keratinocytes with 2x the activity of racemic DL-panthenol.",
      },
      {
        compound: "Coenzyme A (CoA) Biosynthetic Precursor",
        concentration: "Intracellular Metabolic Cofactor",
        role: "Sphingolipid & Ceramide Assembly Engine",
        biochemicalTarget: "Supplies acetyl-CoA required by epidermal cells to synthesize lamellar barrier lipids.",
      },
      {
        compound: "Tri-Hydroxyl Hydrogen-Bonding Groups",
        concentration: "High Hygroscopic Capacity",
        role: "Deep-Layer Humectant Reservoir",
        biochemicalTarget: "Binds water molecules deep within the corneocyte matrix, increasing lipid chain mobility.",
      },
      {
        compound: "Fibroblast Migration Signal",
        concentration: "Epithelial Repair Factor",
        role: "Micro-Barrier & Post-Blemish Healer",
        biochemicalTarget: "Accelerates fibroblast proliferation and re-epithelialization after barrier disruption.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (D-Panthenol (Pro-Vitamin B5))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, D-Panthenol (Pro-Vitamin B5) (Panthenol (100% Chirally Pure D-Isomer)) partitions across Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin at pH 4.5 \u2013 6.5, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate plush, velvety moisture cushion that eliminates roughness on contact with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (205.25 Da (Deep Stratum Corneum Penetration))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by D-Panthenol (Biologically Active D-Enantiomer), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver coenzyme a barrier repair, keratin-substantive hydration, and rapid erythema relief.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Coenzyme A (CoA) Biosynthetic Precursor)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Supplies acetyl-CoA required by epidermal cells to synthesize lamellar barrier lipids.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Tri-Hydroxyl Hydrogen-Bonding Groups)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Binds water molecules deep within the corneocyte matrix, increasing lipid chain mobility.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Fibroblast Migration Signal)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Accelerates fibroblast proliferation and re-epithelialization after barrier disruption.",
        visibleOutcome: "Lasting improvement in Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (D-Panthenol (Pro-Vitamin B5) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Vata & Pitta Pacifier \u2014 Repairs dry cracks and cools inflammatory stinging while compounding synergy with Niacinamide (Vitamin B3) and Pure Aloe Vera (Story 04).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin for D-Panthenol (Pro-Vitamin B5) absorption.",
        proTip: "D-Panthenol (Pro-Vitamin B5) maintains peak stability at pH 4.5 \u2013 6.5; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.50% Chirally Pure D-Panthenol)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your D-Panthenol (Pro-Vitamin B5)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate D-Panthenol (Pro-Vitamin B5) and Niacinamide (Vitamin B3) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the highly water-soluble substantive humectant matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Dehydrated cheeks, nasolabial crease",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin.",
        proTip: "Use featherlight ring-finger pressure so D-Panthenol (Biologically Active D-Enantiomer) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so D-Panthenol (Biologically Active D-Enantiomer) and Coenzyme A (CoA) Biosynthetic Precursor bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Niacinamide (Vitamin B3) or Pure Aloe Vera (Story 04) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of D-Panthenol (Biologically Active D-Enantiomer) across the upper stratum corneum at pH 4.5 \u2013 6.5.",
        experience: "Skin feels plush, velvety moisture cushion that eliminates roughness on contact with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in coenzyme a barrier repair, keratin-substantive hydration, and rapid erythema relief and reduced daily oxidative stress.",
        experience: "Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Coenzyme A (CoA) Biosynthetic Precursor and Tri-Hydroxyl Hydrogen-Bonding Groups.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by D-Panthenol (Pro-Vitamin B5) + Niacinamide (Vitamin B3).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports coenzyme a barrier repair, keratin-substantive hydration, and rapid erythema relief while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.5 \u2013 6.5 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 D-Panthenol (Biologically Active D-Enantiomer) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "niacinamide",
        partnerName: "Niacinamide (Vitamin B3)",
        synergyScore: "99/100",
        combinedBenefit: "The B3 + B5 barrier duo stimulates both ceramides and Coenzyme A lipid synthesis.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "aloe_vera",
        partnerName: "Pure Aloe Vera (Story 04)",
        synergyScore: "98/100",
        combinedBenefit: "Aloe supplies the bio-polysaccharide water matrix that D-Panthenol binds into the skin.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "allantoin",
        partnerName: "Botanical Allantoin",
        synergyScore: "97/100",
        combinedBenefit: "Allantoin softens flaky scales while D-Panthenol heals the fresh skin underneath.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.5 \u2013 6.5. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does D-Panthenol (Pro-Vitamin B5) work inside Bhumivera formulations?",
        answer: "At 1.50% in Bhumivera formulas, chirally pure D-Panthenol penetrates into the living epidermis where it converts into Vitamin B5 (Pantothenic Acid), driving Coenzyme A lipid synthesis, reducing TEWL, and soothing redness. Its primary bioactive, D-Panthenol (Biologically Active D-Enantiomer) (1.50% Formula Concentration), targets Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin to deliver coenzyme a barrier repair, keratin-substantive hydration, and rapid erythema relief.",
      },
      {
        question: "What is the best time of day and step-by-step method to use D-Panthenol (Pro-Vitamin B5)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with D-Panthenol (Pro-Vitamin B5)?",
        answer: "D-Panthenol (Pro-Vitamin B5) achieves peak clinical synergy when paired with Niacinamide (Vitamin B3) (99/100 synergy), Pure Aloe Vera (Story 04) (98/100 synergy), and Botanical Allantoin (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "panthenol_pair_0",
        label: "Synergy: Niacinamide (Vitamin B3)",
        prompt: "Tell me about Niacinamide (Vitamin B3) and how it works with D-Panthenol (Pro-Vitamin B5)",
        category: 'closely_related_ingredient',
      },
      {
        id: "panthenol_pair_1",
        label: "Synergy: Pure Aloe Vera (Story 04)",
        prompt: "Tell me about Pure Aloe Vera (Story 04) and how it works with D-Panthenol (Pro-Vitamin B5)",
        category: 'closely_related_ingredient',
      },
      {
        id: "panthenol_ritual_steps",
        label: "6-Step D-Panthenol (Pro-Vitamin B5) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for D-Panthenol (Pro-Vitamin B5)",
        category: 'usage_and_timing',
      },
      {
        id: "panthenol_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "salicylic_acid",
    indexNumber: 7,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 07",
    isHeroStory: false,
    name: "Botanical Salicylic Acid (Willow Bark BHA)",
    fullTitle: "Lipophilic Beta-Hydroxy Acid & White Willow Bark Salicin Complex",
    latinBinomial: "Salix alba L. Bark Extract & 2-Hydroxybenzoic Acid",
    inciName: "Salicylic Acid & Salix Alba (Willow) Bark Extract",
    category: "Contemporary Active \u00b7 Pore Decongestant (BHA)",
    noteFamily: "Lipophilic Keratolytic \u00b7 Comedolytic Active",
    tagline: "Oil-soluble beta-hydroxy acid that dives inside sebum-filled pores to dissolve blackheads and keratin plugs.",
    shortSummary: "Lipophilic Salicylic Acid penetrates straight through sebum into the follicular canal, dissolving the desmosomal glue holding dead skin cells and blackheads together while White Willow Bark salicin calms redness.",
    originRegion: "Kashmir Valley White Willow Groves & Supramolecular BHA Complex",
    harvestSeason: "Early Spring Bark Pruning",
    extractionMethod: "Hydro-Ethanolic Salicin Extraction + Cyclodextrin Buffering",
    concentrationInFormula: "0.50% \u2013 1.00% Daily Non-Stripping Pore-Refining Dose",
    optimalPhRange: "4.2 \u2013 5.2 (Buffered for Zero-Sting Bio-Availability)",
    solubility: "Lipophilic (Oil-Soluble) & Amphiphilic Complex",
    molecularWeightProfile: "138.12 Da (Rapid Intra-Follicular Penetration)",
    ayurvedicDoshaAffinity: "Kapha & Pitta Clarifier \u2014 Dissolves dense Kapha sebum plugs and cools Pitta papules",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Nose wings, chin, forehead T-zone, blackheads, and congested pores",
    primaryClinicalBenefit: "Deep intra-follicular decongestion, blackhead dissolution, and gentle surface renewal",
    sensoryProfile: {
      color: "Clear to Pale Amber Botanical Solution",
      aroma: "Clean, Crisp Wintergreen-Bark Nuance",
      skinFeel: "Weightless, clarifying, and smooth without peeling or tightness",
    },
    bioactiveCompounds: [
      {
        compound: "2-Hydroxybenzoic Acid (Bio-Active BHA)",
        concentration: "0.50% \u2013 1.00% Calibrated Level",
        role: "Intra-Follicular Corneodesmosome Dissolver",
        biochemicalTarget: "Cleaves corneodesmosomal proteins inside the pilosebaceous unit to prevent microcomedones.",
      },
      {
        compound: "Natural Salicin & Salicortin Glycosides",
        concentration: "1.20% Willow Bark Extract",
        role: "Sustained Anti-Inflammatory Polyphenol",
        biochemicalTarget: "Inhibits COX-1/COX-2 redness pathways without dermal stinging.",
      },
      {
        compound: "Catechin Tannins & Flavonoids",
        concentration: "0.35% Botanical Astringent",
        role: "Pore Ostia Tightener",
        biochemicalTarget: "Gently tones dilated follicular openings after sebum plugs are evacuated.",
      },
      {
        compound: "Lipophilic Aromatic Benzene Ring",
        concentration: "Intrinsic Molecular Carrier",
        role: "Sebum-Miscible Penetrator",
        biochemicalTarget: "Partitions preferentially into oily T-zone pores rather than dry cheek corneocytes.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Botanical Salicylic Acid (Willow Bark BHA))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Botanical Salicylic Acid (Willow Bark BHA) (Salicylic Acid & Salix Alba (Willow) Bark Extract) partitions across Nose wings, chin, forehead T-zone, blackheads, and congested pores at pH 4.2 \u2013 5.2 (Buffered for Zero-Sting Bio-Availability), buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate weightless, clarifying, and smooth without peeling or tightness with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (138.12 Da (Rapid Intra-Follicular Penetration))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by 2-Hydroxybenzoic Acid (Bio-Active BHA), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver deep intra-follicular decongestion, blackhead dissolution, and gentle surface renewal.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Natural Salicin & Salicortin Glycosides)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Inhibits COX-1/COX-2 redness pathways without dermal stinging.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Catechin Tannins & Flavonoids)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Gently tones dilated follicular openings after sebum plugs are evacuated.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Lipophilic Aromatic Benzene Ring)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Partitions preferentially into oily T-zone pores rather than dry cheek corneocytes.",
        visibleOutcome: "Lasting improvement in Nose wings, chin, forehead T-zone, blackheads, and congested pores clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Botanical Salicylic Acid (Willow Bark BHA) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Kapha & Pitta Clarifier \u2014 Dissolves dense Kapha sebum plugs and cools Pitta papules while compounding synergy with Activated Bamboo Charcoal (Story 02) and Niacinamide (Vitamin B3).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Nose wings, chin, forehead T-zone, blackheads, and congested pores for Botanical Salicylic Acid (Willow Bark BHA) absorption.",
        proTip: "Botanical Salicylic Acid (Willow Bark BHA) maintains peak stability at pH 4.2 \u2013 5.2 (Buffered for Zero-Sting Bio-Availability); lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (0.50% \u2013 1.00% Daily Non-Stripping Pore-Refining Dose)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Botanical Salicylic Acid (Willow Bark BHA)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Botanical Salicylic Acid (Willow Bark BHA) and Activated Bamboo Charcoal (Story 02) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the lipophilic (oil-soluble) & amphiphilic complex matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Nose wings, chin, forehead T-zone, b",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Nose wings, chin, forehead T-zone, blackheads, and congested pores.",
        proTip: "Use featherlight ring-finger pressure so 2-Hydroxybenzoic Acid (Bio-Active BHA) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so 2-Hydroxybenzoic Acid (Bio-Active BHA) and Natural Salicin & Salicortin Glycosides bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Activated Bamboo Charcoal (Story 02) or Niacinamide (Vitamin B3) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of 2-Hydroxybenzoic Acid (Bio-Active BHA) across the upper stratum corneum at pH 4.2 \u2013 5.2 (Buffered for Zero-Sting Bio-Availability).",
        experience: "Skin feels weightless, clarifying, and smooth without peeling or tightness with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in deep intra-follicular decongestion, blackhead dissolution, and gentle surface renewal and reduced daily oxidative stress.",
        experience: "Nose wings, chin, forehead T-zone, blackheads, and congested pores appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Natural Salicin & Salicortin Glycosides and Catechin Tannins & Flavonoids.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Botanical Salicylic Acid (Willow Bark BHA) + Activated Bamboo Charcoal (Story 02).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports deep intra-follicular decongestion, blackhead dissolution, and gentle surface renewal while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Nose wings, chin, forehead T-zone, blackheads, and congested pores.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.2 \u2013 5.2 (Buffered for Zero-Sting Bio-Availability) with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 2-Hydroxybenzoic Acid (Bio-Active BHA) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "activated_charcoal",
        partnerName: "Activated Bamboo Charcoal (Story 02)",
        synergyScore: "99/100",
        combinedBenefit: "BHA loosens the plug inside the pore; Charcoal magnetically lifts it out.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "niacinamide",
        partnerName: "Niacinamide (Vitamin B3)",
        synergyScore: "98/100",
        combinedBenefit: "BHA clears the pore interior while Niacinamide tightens the pore wall.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "sacred_tulsi",
        partnerName: "Sacred Tulsi (Story 03)",
        synergyScore: "97/100",
        combinedBenefit: "Combines keratolytic pore clearing with Ayurvedic antibacterial calm.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.2 \u2013 5.2 (Buffered for Zero-Sting Bio-Availability). Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Botanical Salicylic Acid (Willow Bark BHA) work inside Bhumivera formulations?",
        answer: "Lipophilic Salicylic Acid penetrates straight through sebum into the follicular canal, dissolving the desmosomal glue holding dead skin cells and blackheads together while White Willow Bark salicin calms redness. Its primary bioactive, 2-Hydroxybenzoic Acid (Bio-Active BHA) (0.50% \u2013 1.00% Calibrated Level), targets Nose wings, chin, forehead T-zone, blackheads, and congested pores to deliver deep intra-follicular decongestion, blackhead dissolution, and gentle surface renewal.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Botanical Salicylic Acid (Willow Bark BHA)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Botanical Salicylic Acid (Willow Bark BHA)?",
        answer: "Botanical Salicylic Acid (Willow Bark BHA) achieves peak clinical synergy when paired with Activated Bamboo Charcoal (Story 02) (99/100 synergy), Niacinamide (Vitamin B3) (98/100 synergy), and Sacred Tulsi (Story 03) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "salicylic_acid_pair_0",
        label: "Synergy: Activated Bamboo Charcoal (Story 02)",
        prompt: "Tell me about Activated Bamboo Charcoal (Story 02) and how it works with Botanical Salicylic Acid (Willow Bark BHA)",
        category: 'closely_related_ingredient',
      },
      {
        id: "salicylic_acid_pair_1",
        label: "Synergy: Niacinamide (Vitamin B3)",
        prompt: "Tell me about Niacinamide (Vitamin B3) and how it works with Botanical Salicylic Acid (Willow Bark BHA)",
        category: 'closely_related_ingredient',
      },
      {
        id: "salicylic_acid_ritual_steps",
        label: "6-Step Botanical Salicylic Acid (Willow Bark BHA) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Botanical Salicylic Acid (Willow Bark BHA)",
        category: 'usage_and_timing',
      },
      {
        id: "salicylic_acid_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "hyaluronic_acid",
    indexNumber: 8,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 08",
    isHeroStory: false,
    name: "Multi-Molecular Hyaluronic Acid",
    fullTitle: "5-Weight Cross-Linked & Hydrolyzed Sodium Hyaluronate Matrix",
    latinBinomial: "Bio-Fermented Vegan Glycosaminoglycan (5 Molecular Weights)",
    inciName: "Sodium Hyaluronate, Hydrolyzed Hyaluronic Acid & Sodium Acetylated Hyaluronate",
    category: "Contemporary Active \u00b7 Multi-Depth Hydro-Reservoir",
    noteFamily: "Biomimetic Glycosaminoglycan \u00b7 1000x Water Magnet",
    tagline: "Five molecular weights of vegan Hyaluronic Acid that hydrate from the surface cuticle down to the living epidermis.",
    shortSummary: "Bhumivera blends 5 distinct molecular weights (from 2,000 kDa down to 10 kDa Oligo-HA plus rinse-resistant Acetylated HA) to flood every layer of the epidermis with bounce-restoring moisture.",
    originRegion: "Plant-Glucose Bio-Fermentation (100% Vegan)",
    harvestSeason: "Year-Round Precision Bio-Fermentation",
    extractionMethod: "Enzymatic Molecular Weight Fractionation + Ultra-Filtration",
    concentrationInFormula: "1.00% Multi-Molecular 5D Complex",
    optimalPhRange: "5.0 \u2013 7.0",
    solubility: "100% Hydrophilic Aqueous Polymer",
    molecularWeightProfile: "10 kDa (Oligo) to >2,000 kDa (Crosspolymer)",
    ayurvedicDoshaAffinity: "Vata & Pitta Replenisher \u2014 Restores Rasa Dhatu (cellular fluid vitality)",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Dehydration lines across forehead, under-eye cheekbones, and parched cheeks",
    primaryClinicalBenefit: "5-depth epidermal water binding, CD44 tight-junction signaling, and instant optical plumping",
    sensoryProfile: {
      color: "Crystal-Clear Dewy Gel",
      aroma: "Odorless",
      skinFeel: "Bouncy, cushiony slip that plumps fine dehydration lines on contact",
    },
    bioactiveCompounds: [
      {
        compound: "High-Molecular-Weight Sodium Hyaluronate",
        concentration: "40% of HA Blend (1,200\u20132,000 kDa)",
        role: "Breathable Surface Moisture Shield",
        biochemicalTarget: "Forms a non-occlusive viscoelastic hydro-film across the stratum corneum to reduce evaporative water loss.",
      },
      {
        compound: "Medium-Molecular-Weight Sodium Hyaluronate",
        concentration: "30% of HA Blend (100\u2013300 kDa)",
        role: "Corneocyte Intercellular Plumper",
        biochemicalTarget: "Hydrates the upper and middle stratum corneum layers, smoothing surface flakiness.",
      },
      {
        compound: "Hydrolyzed & Oligo-Hyaluronic Acid",
        concentration: "20% of HA Blend (10\u201350 kDa)",
        role: "Trans-Epidermal Tight-Junction Hydrator",
        biochemicalTarget: "Penetrates into the viable epidermis to stimulate endogenous HAS-2 and CD44 receptors.",
      },
      {
        compound: "Sodium Acetylated Hyaluronate (Super-HA)",
        concentration: "10% of HA Blend",
        role: "Lipophilic-Anchored Rinse-Resistant Humectant",
        biochemicalTarget: "Acetyl groups anchor to stratum corneum lipids so hydration stays bound after rinsing.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Multi-Molecular Hyaluronic Acid)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Multi-Molecular Hyaluronic Acid (Sodium Hyaluronate, Hydrolyzed Hyaluronic Acid & Sodium Acetylated Hyaluronate) partitions across Dehydration lines across forehead, under-eye cheekbones, and parched cheeks at pH 5.0 \u2013 7.0, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate bouncy, cushiony slip that plumps fine dehydration lines on contact with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (10 kDa (Oligo) to >2,000 kDa (Crosspolymer))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by High-Molecular-Weight Sodium Hyaluronate, bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver 5-depth epidermal water binding, cd44 tight-junction signaling, and instant optical plumping.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Medium-Molecular-Weight Sodium Hyaluronate)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Hydrates the upper and middle stratum corneum layers, smoothing surface flakiness.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Hydrolyzed & Oligo-Hyaluronic Acid)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Penetrates into the viable epidermis to stimulate endogenous HAS-2 and CD44 receptors.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Sodium Acetylated Hyaluronate (Super-HA))",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Acetyl groups anchor to stratum corneum lipids so hydration stays bound after rinsing.",
        visibleOutcome: "Lasting improvement in Dehydration lines across forehead, under-eye cheekbones, and parched cheeks clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Multi-Molecular Hyaluronic Acid Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Vata & Pitta Replenisher \u2014 Restores Rasa Dhatu (cellular fluid vitality) while compounding synergy with Pure Aloe Vera (Story 04) and D-Panthenol (Pro-Vitamin B5).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Dehydration lines across forehead, under-eye cheekbones, and parched cheeks for Multi-Molecular Hyaluronic Acid absorption.",
        proTip: "Multi-Molecular Hyaluronic Acid maintains peak stability at pH 5.0 \u2013 7.0; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.00% Multi-Molecular 5D Complex)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Multi-Molecular Hyaluronic Acid-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Multi-Molecular Hyaluronic Acid and Pure Aloe Vera (Story 04) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the 100% hydrophilic aqueous polymer matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Dehydration lines across forehead, u",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Dehydration lines across forehead, under-eye cheekbones, and parched cheeks.",
        proTip: "Use featherlight ring-finger pressure so High-Molecular-Weight Sodium Hyaluronate works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so High-Molecular-Weight Sodium Hyaluronate and Medium-Molecular-Weight Sodium Hyaluronate bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Pure Aloe Vera (Story 04) or D-Panthenol (Pro-Vitamin B5) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of High-Molecular-Weight Sodium Hyaluronate across the upper stratum corneum at pH 5.0 \u2013 7.0.",
        experience: "Skin feels bouncy, cushiony slip that plumps fine dehydration lines on contact with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in 5-depth epidermal water binding, cd44 tight-junction signaling, and instant optical plumping and reduced daily oxidative stress.",
        experience: "Dehydration lines across forehead, under-eye cheekbones, and parched cheeks appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Medium-Molecular-Weight Sodium Hyaluronate and Hydrolyzed & Oligo-Hyaluronic Acid.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Multi-Molecular Hyaluronic Acid + Pure Aloe Vera (Story 04).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports 5-depth epidermal water binding, cd44 tight-junction signaling, and instant optical plumping while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Dehydration lines across forehead, under-eye cheekbones, and parched cheeks.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 5.0 \u2013 7.0 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 High-Molecular-Weight Sodium Hyaluronate and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "aloe_vera",
        partnerName: "Pure Aloe Vera (Story 04)",
        synergyScore: "99/100",
        combinedBenefit: "Aloe supplies 32% bio-active botanical water that Hyaluronic Acid traps inside the skin.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "panthenol",
        partnerName: "D-Panthenol (Pro-Vitamin B5)",
        synergyScore: "98/100",
        combinedBenefit: "Synergistic humectant + barrier repair that prevents evaporation.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "polyglutamic_acid",
        partnerName: "Polyglutamic Acid (Natto Hydro-Lock)",
        synergyScore: "97/100",
        combinedBenefit: "Inhibits hyaluronidase breakdown while holding 4x more water.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 5.0 \u2013 7.0. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Multi-Molecular Hyaluronic Acid work inside Bhumivera formulations?",
        answer: "Bhumivera blends 5 distinct molecular weights (from 2,000 kDa down to 10 kDa Oligo-HA plus rinse-resistant Acetylated HA) to flood every layer of the epidermis with bounce-restoring moisture. Its primary bioactive, High-Molecular-Weight Sodium Hyaluronate (40% of HA Blend (1,200\u20132,000 kDa)), targets Dehydration lines across forehead, under-eye cheekbones, and parched cheeks to deliver 5-depth epidermal water binding, cd44 tight-junction signaling, and instant optical plumping.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Multi-Molecular Hyaluronic Acid?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Multi-Molecular Hyaluronic Acid?",
        answer: "Multi-Molecular Hyaluronic Acid achieves peak clinical synergy when paired with Pure Aloe Vera (Story 04) (99/100 synergy), D-Panthenol (Pro-Vitamin B5) (98/100 synergy), and Polyglutamic Acid (Natto Hydro-Lock) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "hyaluronic_acid_pair_0",
        label: "Synergy: Pure Aloe Vera (Story 04)",
        prompt: "Tell me about Pure Aloe Vera (Story 04) and how it works with Multi-Molecular Hyaluronic Acid",
        category: 'closely_related_ingredient',
      },
      {
        id: "hyaluronic_acid_pair_1",
        label: "Synergy: D-Panthenol (Pro-Vitamin B5)",
        prompt: "Tell me about D-Panthenol (Pro-Vitamin B5) and how it works with Multi-Molecular Hyaluronic Acid",
        category: 'closely_related_ingredient',
      },
      {
        id: "hyaluronic_acid_ritual_steps",
        label: "6-Step Multi-Molecular Hyaluronic Acid Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Multi-Molecular Hyaluronic Acid",
        category: 'usage_and_timing',
      },
      {
        id: "hyaluronic_acid_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "vitamin_c_ethyl",
    indexNumber: 9,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 09",
    isHeroStory: false,
    name: "Vitamin C (3-O-Ethyl Ascorbic Acid)",
    fullTitle: "Amphiphilic 3-O-Ethyl Ascorbic Acid & Sea Buckthorn Ascorbate Complex",
    latinBinomial: "3-O-Ethyl-L-Ascorbic Acid",
    inciName: "3-O-Ethyl Ascorbic Acid & Hippophae Rhamnoides Fruit Extract",
    category: "Contemporary Active \u00b7 Luminosity & Collagen Cofactor",
    noteFamily: "Stabilized Vitamin C \u00b7 Tyrosinase Inhibitor",
    tagline: "Next-generation amphiphilic Vitamin C with 86.3% pure ascorbic acid content that never oxidizes brown or stings.",
    shortSummary: "Etherified at the C3 carbon so it is both water- and oil-soluble and 100% stable at skin-friendly pH 5.2, 3-O-Ethyl Ascorbic Acid converts directly into active Vitamin C inside melanocytes and fibroblasts.",
    originRegion: "Precision Green Enzymatic Synthesis + Himalayan Sea Buckthorn Synergy",
    harvestSeason: "Year-Round",
    extractionMethod: "Selective C-3 Etherification + Cold Botanical Chelation",
    concentrationInFormula: "2.00% \u2013 5.00% Amphiphilic Vitamin C Complex",
    optimalPhRange: "4.8 \u2013 5.8 (Zero-Sting Physiological pH)",
    solubility: "Amphiphilic (Both Hydrophilic & Lipophilic Penetration)",
    molecularWeightProfile: "204.18 Da (Superior Trans-Corneal Penetration)",
    ayurvedicDoshaAffinity: "Kapha & Vata Brightener \u2014 Awakens dullness without aggravating Pitta sensitivity",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas",
    primaryClinicalBenefit: "Tyrosinase inhibition, collagen I/III synthesis, and non-oxidizing antioxidant radiance",
    sensoryProfile: {
      color: "Crystal Clear (Never Oxidizes Dark Brown)",
      aroma: "Subtle Botanical Citrus Whisper",
      skinFeel: "Silky, non-tacky, zero-tingle radiance veil",
    },
    bioactiveCompounds: [
      {
        compound: "3-O-Ethyl Ascorbic Acid (86.3% Ascorbic Yield)",
        concentration: "Primary Stabilized Active",
        role: "Direct & Indirect Tyrosinase Inhibitor",
        biochemicalTarget: "Chelates copper ions at the active site of tyrosinase and inhibits TRP-2, halting excess melanin synthesis.",
      },
      {
        compound: "Prolyl- & Lysyl-Hydroxylase Cofactor",
        concentration: "Intracellular Ascorbate Pool",
        role: "Triple-Helix Collagen Cross-Linker",
        biochemicalTarget: "Essential cofactor for hydroxylating proline and lysine residues on pro-collagen I and III fibers.",
      },
      {
        compound: "Singlet Oxygen & Superoxide Quencher",
        concentration: "Photoprotective Network",
        role: "UVA/UVB & Pollution Free-Radical Shield",
        biochemicalTarget: "Neutralizes reactive oxygen species before they trigger AP-1 mediated collagen breakdown.",
      },
      {
        compound: "Amphiphilic C3-Ethoxy Transport Group",
        concentration: "Molecular Transport Enhancer",
        role: "Dual Water- & Lipid-Channel Penetrator",
        biochemicalTarget: "Passes effortlessly through both stratum corneum lipid bilayers and aqueous cytoplasm.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Vitamin C (3-O-Ethyl Ascorbic Acid))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Vitamin C (3-O-Ethyl Ascorbic Acid) (3-O-Ethyl Ascorbic Acid & Hippophae Rhamnoides Fruit Extract) partitions across Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas at pH 4.8 \u2013 5.8 (Zero-Sting Physiological pH), buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate silky, non-tacky, zero-tingle radiance veil with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (204.18 Da (Superior Trans-Corneal Penetration))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by 3-O-Ethyl Ascorbic Acid (86.3% Ascorbic Yield), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver tyrosinase inhibition, collagen i/iii synthesis, and non-oxidizing antioxidant radiance.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Prolyl- & Lysyl-Hydroxylase Cofactor)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Essential cofactor for hydroxylating proline and lysine residues on pro-collagen I and III fibers.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Singlet Oxygen & Superoxide Quencher)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Neutralizes reactive oxygen species before they trigger AP-1 mediated collagen breakdown.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Amphiphilic C3-Ethoxy Transport Group)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Passes effortlessly through both stratum corneum lipid bilayers and aqueous cytoplasm.",
        visibleOutcome: "Lasting improvement in Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Vitamin C (3-O-Ethyl Ascorbic Acid) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Kapha & Vata Brightener \u2014 Awakens dullness without aggravating Pitta sensitivity while compounding synergy with Vitamin E (D-Alpha Tocopherol) and Sea Buckthorn (Story 01).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas for Vitamin C (3-O-Ethyl Ascorbic Acid) absorption.",
        proTip: "Vitamin C (3-O-Ethyl Ascorbic Acid) maintains peak stability at pH 4.8 \u2013 5.8 (Zero-Sting Physiological pH); lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (2.00% \u2013 5.00% Amphiphilic Vitamin C Complex)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Vitamin C (3-O-Ethyl Ascorbic Acid)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Vitamin C (3-O-Ethyl Ascorbic Acid) and Vitamin E (D-Alpha Tocopherol) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the amphiphilic (both hydrophilic & lipophilic penetration) matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Cheekbones, hyperpigmented dark spot",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas.",
        proTip: "Use featherlight ring-finger pressure so 3-O-Ethyl Ascorbic Acid (86.3% Ascorbic Yield) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so 3-O-Ethyl Ascorbic Acid (86.3% Ascorbic Yield) and Prolyl- & Lysyl-Hydroxylase Cofactor bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Vitamin E (D-Alpha Tocopherol) or Sea Buckthorn (Story 01) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of 3-O-Ethyl Ascorbic Acid (86.3% Ascorbic Yield) across the upper stratum corneum at pH 4.8 \u2013 5.8 (Zero-Sting Physiological pH).",
        experience: "Skin feels silky, non-tacky, zero-tingle radiance veil with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in tyrosinase inhibition, collagen i/iii synthesis, and non-oxidizing antioxidant radiance and reduced daily oxidative stress.",
        experience: "Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Prolyl- & Lysyl-Hydroxylase Cofactor and Singlet Oxygen & Superoxide Quencher.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Vitamin C (3-O-Ethyl Ascorbic Acid) + Vitamin E (D-Alpha Tocopherol).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports tyrosinase inhibition, collagen i/iii synthesis, and non-oxidizing antioxidant radiance while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.8 \u2013 5.8 (Zero-Sting Physiological pH) with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 3-O-Ethyl Ascorbic Acid (86.3% Ascorbic Yield) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "tocopherol_vit_e",
        partnerName: "Vitamin E (D-Alpha Tocopherol)",
        synergyScore: "100/100",
        combinedBenefit: "Vitamin C regenerates oxidized Vitamin E in cell membranes, multiplying antioxidant power 4x.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "sea_buckthorn",
        partnerName: "Sea Buckthorn (Story 01)",
        synergyScore: "99/100",
        combinedBenefit: "Combines bio-flavonoid berry ascorbates with 3-O-Ethyl Ascorbic Acid.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "niacinamide",
        partnerName: "Niacinamide (Vitamin B3)",
        synergyScore: "98/100",
        combinedBenefit: "Vitamin C stops pigment synthesis; Niacinamide stops pigment transfer.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.8 \u2013 5.8 (Zero-Sting Physiological pH). Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Vitamin C (3-O-Ethyl Ascorbic Acid) work inside Bhumivera formulations?",
        answer: "Etherified at the C3 carbon so it is both water- and oil-soluble and 100% stable at skin-friendly pH 5.2, 3-O-Ethyl Ascorbic Acid converts directly into active Vitamin C inside melanocytes and fibroblasts. Its primary bioactive, 3-O-Ethyl Ascorbic Acid (86.3% Ascorbic Yield) (Primary Stabilized Active), targets Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas to deliver tyrosinase inhibition, collagen i/iii synthesis, and non-oxidizing antioxidant radiance.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Vitamin C (3-O-Ethyl Ascorbic Acid)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Vitamin C (3-O-Ethyl Ascorbic Acid)?",
        answer: "Vitamin C (3-O-Ethyl Ascorbic Acid) achieves peak clinical synergy when paired with Vitamin E (D-Alpha Tocopherol) (100/100 synergy), Sea Buckthorn (Story 01) (99/100 synergy), and Niacinamide (Vitamin B3) (98/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "vitamin_c_ethyl_pair_0",
        label: "Synergy: Vitamin E (D-Alpha Tocopherol)",
        prompt: "Tell me about Vitamin E (D-Alpha Tocopherol) and how it works with Vitamin C (3-O-Ethyl Ascorbic Acid)",
        category: 'closely_related_ingredient',
      },
      {
        id: "vitamin_c_ethyl_pair_1",
        label: "Synergy: Sea Buckthorn (Story 01)",
        prompt: "Tell me about Sea Buckthorn (Story 01) and how it works with Vitamin C (3-O-Ethyl Ascorbic Acid)",
        category: 'closely_related_ingredient',
      },
      {
        id: "vitamin_c_ethyl_ritual_steps",
        label: "6-Step Vitamin C (3-O-Ethyl Ascorbic Acid) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Vitamin C (3-O-Ethyl Ascorbic Acid)",
        category: 'usage_and_timing',
      },
      {
        id: "vitamin_c_ethyl_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "tocopherol_vit_e",
    indexNumber: 10,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 10",
    isHeroStory: false,
    name: "Vitamin E (D-Alpha Tocopherol)",
    fullTitle: "Natural Non-GMO Sunflower & Sea Buckthorn D-Alpha Tocopherol Complex",
    latinBinomial: "RRR-Alpha-Tocopherol & Mixed Tocotrienols",
    inciName: "Tocopherol (Natural D-Alpha, Beta, Gamma & Delta Mixed Tocopherols)",
    category: "Contemporary Active \u00b7 Lipid-Phase Antioxidant Shield",
    noteFamily: "Membrane Guardian \u00b7 Redox Recycler",
    tagline: "The primary lipid-soluble antioxidant of the human stratum corneum that protects cell membranes and sebum from peroxidation.",
    shortSummary: "Natural D-Alpha Tocopherol possesses 2x the bio-availability of synthetic vitamin E, embedding directly into epidermal cell membranes and sebum to stop free-radical chain reactions before they cause blackheads or barrier breakdown.",
    originRegion: "Cold-Pressed Botanical Seed Fractionation & Ladakh Sea Buckthorn",
    harvestSeason: "Autumn Seed Harvest",
    extractionMethod: "Molecular Vacuum Distillation (Solvent-Free)",
    concentrationInFormula: "0.50% \u2013 1.20% Mixed Natural Tocopherols",
    optimalPhRange: "4.5 \u2013 7.0",
    solubility: "Lipophilic (Oil- & Lipid-Membrane Soluble)",
    molecularWeightProfile: "430.71 Da (Lipid Bilayer Anchor)",
    ayurvedicDoshaAffinity: "Vata & Pitta Nourisher \u2014 Protects delicate lipids from solar heat and wind dryness",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 1,
    primaryFocusZone: "Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones",
    primaryClinicalBenefit: "Stops squalene peroxidation, reinforces cell membranes, and recycles with Vitamin C",
    sensoryProfile: {
      color: "Rich Golden Honey-Amber",
      aroma: "Mild, Warm Botanical Seed Note",
      skinFeel: "Supple, conditioning lipid cushion",
    },
    bioactiveCompounds: [
      {
        compound: "RRR-Alpha-Tocopherol (Natural D-Alpha)",
        concentration: "70% of Tocopherol Complex",
        role: "Cell Membrane Peroxyl Radical Scavenger",
        biochemicalTarget: "Intercalates into phospholipid bilayers to donate a hydrogen atom to lipid peroxyl radicals.",
      },
      {
        compound: "Gamma- & Delta-Tocopherols",
        concentration: "25% of Tocopherol Complex",
        role: "Reactive Nitrogen Species (RNS) Quencher",
        biochemicalTarget: "Traps nitrogen dioxide and peroxynitrite radicals generated by urban traffic smog.",
      },
      {
        compound: "Alpha-Tocotrienol (Sea Buckthorn Seed)",
        concentration: "5% High-Mobility Fraction",
        role: "Unsaturated Tail Super-Antioxidant",
        biochemicalTarget: "Moves 40x faster laterally through cell membranes than standard tocopherol.",
      },
      {
        compound: "Squalene Photo-Stabilizer",
        concentration: "Sebaceous Sebum Protector",
        role: "Anti-Comedogenic Sebum Guardian",
        biochemicalTarget: "Prevents surface squalene from oxidizing into comedogenic squalene monohydroperoxide.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Vitamin E (D-Alpha Tocopherol))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Vitamin E (D-Alpha Tocopherol) (Tocopherol (Natural D-Alpha, Beta, Gamma & Delta Mixed Tocopherols)) partitions across Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones at pH 4.5 \u2013 7.0, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate supple, conditioning lipid cushion with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (430.71 Da (Lipid Bilayer Anchor))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by RRR-Alpha-Tocopherol (Natural D-Alpha), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver stops squalene peroxidation, reinforces cell membranes, and recycles with vitamin c.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Gamma- & Delta-Tocopherols)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Traps nitrogen dioxide and peroxynitrite radicals generated by urban traffic smog.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Alpha-Tocotrienol (Sea Buckthorn Seed))",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Moves 40x faster laterally through cell membranes than standard tocopherol.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Squalene Photo-Stabilizer)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Prevents surface squalene from oxidizing into comedogenic squalene monohydroperoxide.",
        visibleOutcome: "Lasting improvement in Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Vitamin E (D-Alpha Tocopherol) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Vata & Pitta Nourisher \u2014 Protects delicate lipids from solar heat and wind dryness while compounding synergy with Vitamin C (3-O-Ethyl Ascorbic Acid) and Sea Buckthorn (Story 01).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones for Vitamin E (D-Alpha Tocopherol) absorption.",
        proTip: "Vitamin E (D-Alpha Tocopherol) maintains peak stability at pH 4.5 \u2013 7.0; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (0.50% \u2013 1.20% Mixed Natural Tocopherols)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Vitamin E (D-Alpha Tocopherol)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Vitamin E (D-Alpha Tocopherol) and Vitamin C (3-O-Ethyl Ascorbic Acid) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the lipophilic (oil- & lipid-membrane soluble) matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Lipid-depleted cheeks, neck, chest, ",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones.",
        proTip: "Use featherlight ring-finger pressure so RRR-Alpha-Tocopherol (Natural D-Alpha) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so RRR-Alpha-Tocopherol (Natural D-Alpha) and Gamma- & Delta-Tocopherols bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Vitamin C (3-O-Ethyl Ascorbic Acid) or Sea Buckthorn (Story 01) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of RRR-Alpha-Tocopherol (Natural D-Alpha) across the upper stratum corneum at pH 4.5 \u2013 7.0.",
        experience: "Skin feels supple, conditioning lipid cushion with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in stops squalene peroxidation, reinforces cell membranes, and recycles with vitamin c and reduced daily oxidative stress.",
        experience: "Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Gamma- & Delta-Tocopherols and Alpha-Tocotrienol (Sea Buckthorn Seed).",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Vitamin E (D-Alpha Tocopherol) + Vitamin C (3-O-Ethyl Ascorbic Acid).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 1/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports stops squalene peroxidation, reinforces cell membranes, and recycles with vitamin c while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.5 \u2013 7.0 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (1/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 RRR-Alpha-Tocopherol (Natural D-Alpha) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "vitamin_c_ethyl",
        partnerName: "Vitamin C (3-O-Ethyl Ascorbic Acid)",
        synergyScore: "100/100",
        combinedBenefit: "Water-soluble Vit C + lipid-soluble Vit E protect both cellular phases.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "sea_buckthorn",
        partnerName: "Sea Buckthorn (Story 01)",
        synergyScore: "99/100",
        combinedBenefit: "Full-spectrum carotenoid + tocotrienol antioxidant network.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "ceramide_complex",
        partnerName: "Ceramide NP / AP / EOP Complex",
        synergyScore: "97/100",
        combinedBenefit: "Protects newly replenished ceramides from oxidative breakdown.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.5 \u2013 7.0. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Vitamin E (D-Alpha Tocopherol) work inside Bhumivera formulations?",
        answer: "Natural D-Alpha Tocopherol possesses 2x the bio-availability of synthetic vitamin E, embedding directly into epidermal cell membranes and sebum to stop free-radical chain reactions before they cause blackheads or barrier breakdown. Its primary bioactive, RRR-Alpha-Tocopherol (Natural D-Alpha) (70% of Tocopherol Complex), targets Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones to deliver stops squalene peroxidation, reinforces cell membranes, and recycles with vitamin c.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Vitamin E (D-Alpha Tocopherol)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Vitamin E (D-Alpha Tocopherol)?",
        answer: "Vitamin E (D-Alpha Tocopherol) achieves peak clinical synergy when paired with Vitamin C (3-O-Ethyl Ascorbic Acid) (100/100 synergy), Sea Buckthorn (Story 01) (99/100 synergy), and Ceramide NP / AP / EOP Complex (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "tocopherol_vit_e_pair_0",
        label: "Synergy: Vitamin C (3-O-Ethyl Ascorbic Acid)",
        prompt: "Tell me about Vitamin C (3-O-Ethyl Ascorbic Acid) and how it works with Vitamin E (D-Alpha Tocopherol)",
        category: 'closely_related_ingredient',
      },
      {
        id: "tocopherol_vit_e_pair_1",
        label: "Synergy: Sea Buckthorn (Story 01)",
        prompt: "Tell me about Sea Buckthorn (Story 01) and how it works with Vitamin E (D-Alpha Tocopherol)",
        category: 'closely_related_ingredient',
      },
      {
        id: "tocopherol_vit_e_ritual_steps",
        label: "6-Step Vitamin E (D-Alpha Tocopherol) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Vitamin E (D-Alpha Tocopherol)",
        category: 'usage_and_timing',
      },
      {
        id: "tocopherol_vit_e_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "allantoin",
    indexNumber: 11,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 11",
    isHeroStory: false,
    name: "Botanical Allantoin",
    fullTitle: "Comfrey Root-Inspired Bio-Identical Allantoin",
    latinBinomial: "Symphytum officinale Phytocompound ((2,5-Dioxo-4-imidazolidinyl)urea)",
    inciName: "Allantoin (USP Skin Protectant Grade)",
    category: "Contemporary Active \u00b7 Keratolytic Calmer & Protectant",
    noteFamily: "Epithelial Soother \u00b7 Corneocyte Softener",
    tagline: "Gentle keratolytic skin protectant that loosens dry surface scales while calming neurosensory stinging.",
    shortSummary: "Found naturally in Comfrey root and chamomile sprouts, Allantoin increases the water-binding capacity of the extracellular matrix while gently cleaving dead, rough corneocytes and soothing irritation.",
    originRegion: "Botanical Uric/Glyoxylic Green Synthesis (Zero Pyrrolizidine Alkaloids)",
    harvestSeason: "Year-Round",
    extractionMethod: "Purified Bio-Identical Crystallization",
    concentrationInFormula: "0.40% \u2013 0.50% FDA-Monographed Skin Protectant Level",
    optimalPhRange: "4.5 \u2013 7.0",
    solubility: "Hydrophilic Aqueous Dispersion",
    molecularWeightProfile: "158.12 Da (Fast Epidermal Permeation)",
    ayurvedicDoshaAffinity: "Vata & Pitta Calmer \u2014 Softens Vata roughness and cools Pitta reactivity",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds",
    primaryClinicalBenefit: "FDA-recognized skin protection, gentle scale softening, and instant anti-sting comfort",
    sensoryProfile: {
      color: "Pure White Crystalline Solution",
      aroma: "Odorless",
      skinFeel: "Cashmere-soft, friction-reducing glide",
    },
    bioactiveCompounds: [
      {
        compound: "Imidazolidinyl-Urea Hydantoin Ring",
        concentration: "99.8% Pure Allantoin",
        role: "Mild Keratolytic Desmosome Softener",
        biochemicalTarget: "Gently loosens ragged corneocytes without acid stinging so fresh, smooth skin emerges.",
      },
      {
        compound: "Extracellular Matrix Water Binder",
        concentration: "Keratin Hydration Enhancer",
        role: "Corneocyte Plumping Factor",
        biochemicalTarget: "Increases the water content of keratin proteins in the upper stratum corneum.",
      },
      {
        compound: "Nociceptor TRPV1 Calming Signal",
        concentration: "Neurosensory Modulator",
        role: "Anti-Sting & Anti-Itch Agent",
        biochemicalTarget: "Dampens TRPV1 pain/heat receptor firing triggered by windburn, shaving, or retinoids.",
      },
      {
        compound: "Fibroblast Mitogenic Stimulator",
        concentration: "Wound-Healing Cofactor",
        role: "Post-Blemish Epithelializer",
        biochemicalTarget: "Promotes clean, flat epithelial closure over healing blemishes.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Botanical Allantoin)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Botanical Allantoin (Allantoin (USP Skin Protectant Grade)) partitions across Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds at pH 4.5 \u2013 7.0, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate cashmere-soft, friction-reducing glide with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (158.12 Da (Fast Epidermal Permeation))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Imidazolidinyl-Urea Hydantoin Ring, bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver fda-recognized skin protection, gentle scale softening, and instant anti-sting comfort.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Extracellular Matrix Water Binder)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Increases the water content of keratin proteins in the upper stratum corneum.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Nociceptor TRPV1 Calming Signal)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Dampens TRPV1 pain/heat receptor firing triggered by windburn, shaving, or retinoids.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Fibroblast Mitogenic Stimulator)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Promotes clean, flat epithelial closure over healing blemishes.",
        visibleOutcome: "Lasting improvement in Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Botanical Allantoin Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Vata & Pitta Calmer \u2014 Softens Vata roughness and cools Pitta reactivity while compounding synergy with D-Panthenol (Pro-Vitamin B5) and Pure Aloe Vera (Story 04).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds for Botanical Allantoin absorption.",
        proTip: "Botanical Allantoin maintains peak stability at pH 4.5 \u2013 7.0; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (0.40% \u2013 0.50% FDA-Monographed Skin Protectant Level)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Botanical Allantoin-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Botanical Allantoin and D-Panthenol (Pro-Vitamin B5) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the hydrophilic aqueous dispersion matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Windburned cheeks, post-shave neck, ",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds.",
        proTip: "Use featherlight ring-finger pressure so Imidazolidinyl-Urea Hydantoin Ring works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Imidazolidinyl-Urea Hydantoin Ring and Extracellular Matrix Water Binder bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with D-Panthenol (Pro-Vitamin B5) or Pure Aloe Vera (Story 04) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Imidazolidinyl-Urea Hydantoin Ring across the upper stratum corneum at pH 4.5 \u2013 7.0.",
        experience: "Skin feels cashmere-soft, friction-reducing glide with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in fda-recognized skin protection, gentle scale softening, and instant anti-sting comfort and reduced daily oxidative stress.",
        experience: "Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Extracellular Matrix Water Binder and Nociceptor TRPV1 Calming Signal.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Botanical Allantoin + D-Panthenol (Pro-Vitamin B5).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports fda-recognized skin protection, gentle scale softening, and instant anti-sting comfort while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.5 \u2013 7.0 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Imidazolidinyl-Urea Hydantoin Ring and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "panthenol",
        partnerName: "D-Panthenol (Pro-Vitamin B5)",
        synergyScore: "99/100",
        combinedBenefit: "Allantoin clears rough scales while Panthenol seals and heals the new epidermis.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "aloe_vera",
        partnerName: "Pure Aloe Vera (Story 04)",
        synergyScore: "98/100",
        combinedBenefit: "Ultimate soothing duo for sunburned, windburned, or over-exfoliated skin.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "alpha_bisabolol",
        partnerName: "Chamomile Alpha-Bisabolol",
        synergyScore: "97/100",
        combinedBenefit: "Synergistic redness and neurosensory reactivity suppression.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.5 \u2013 7.0. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Botanical Allantoin work inside Bhumivera formulations?",
        answer: "Found naturally in Comfrey root and chamomile sprouts, Allantoin increases the water-binding capacity of the extracellular matrix while gently cleaving dead, rough corneocytes and soothing irritation. Its primary bioactive, Imidazolidinyl-Urea Hydantoin Ring (99.8% Pure Allantoin), targets Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds to deliver fda-recognized skin protection, gentle scale softening, and instant anti-sting comfort.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Botanical Allantoin?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Botanical Allantoin?",
        answer: "Botanical Allantoin achieves peak clinical synergy when paired with D-Panthenol (Pro-Vitamin B5) (99/100 synergy), Pure Aloe Vera (Story 04) (98/100 synergy), and Chamomile Alpha-Bisabolol (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "allantoin_pair_0",
        label: "Synergy: D-Panthenol (Pro-Vitamin B5)",
        prompt: "Tell me about D-Panthenol (Pro-Vitamin B5) and how it works with Botanical Allantoin",
        category: 'closely_related_ingredient',
      },
      {
        id: "allantoin_pair_1",
        label: "Synergy: Pure Aloe Vera (Story 04)",
        prompt: "Tell me about Pure Aloe Vera (Story 04) and how it works with Botanical Allantoin",
        category: 'closely_related_ingredient',
      },
      {
        id: "allantoin_ritual_steps",
        label: "6-Step Botanical Allantoin Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Botanical Allantoin",
        category: 'usage_and_timing',
      },
      {
        id: "allantoin_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "vegetable_glycerin",
    indexNumber: 12,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 12",
    isHeroStory: false,
    name: "Cold-Pressed Botanical Glycerin",
    fullTitle: "Organic Plant-Derived Trihydroxypropane Aquaporin Modulator",
    latinBinomial: "Propane-1,2,3-triol (Botanical Coconut & Mustard Seed Derived)",
    inciName: "Glycerin (99.7% USP Organic Vegetable Grade)",
    category: "Contemporary Active \u00b7 Biomimetic NMF & Aquaporin Activator",
    noteFamily: "Endogenous Humectant \u00b7 Barrier Plasticizer",
    tagline: "The skin's own endogenous water transporter that travels through Aquaporin-3 channels to keep barrier lipids flexible.",
    shortSummary: "Far more than a basic humectant, Glycerin is an endogenous molecule transported by Aquaporin-3 (AQP3) channels in human skin. It prevents intercellular lipids from crystallizing into brittle, leaky phases in cold or dry air.",
    originRegion: "Cold-Pressed Organic Plant Oils (India)",
    harvestSeason: "Year-Round",
    extractionMethod: "Solvent-Free Hydrolysis & Triple Charcoal-Filtered Distillation",
    concentrationInFormula: "4.50% Balanced Non-Sticky Cushioned Level",
    optimalPhRange: "4.0 \u2013 8.0",
    solubility: "100% Miscible in Water",
    molecularWeightProfile: "92.09 Da (Ultra-Low Dalton Aquaporin-3 Substrate)",
    ayurvedicDoshaAffinity: "Vata Pacifier \u2014 Prevents dry, brittle skin cracking in arid climates",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Full face, lips perimeter, hands, and dehydration-prone contours",
    primaryClinicalBenefit: "Aquaporin-3 water transport, lamellar lipid fluidity, and natural enzyme desquamation",
    sensoryProfile: {
      color: "Crystal Clear Dew",
      aroma: "Odorless",
      skinFeel: "Supple, elastic, and dewy (formulated with Aloe to eliminate stickiness)",
    },
    bioactiveCompounds: [
      {
        compound: "Propane-1,2,3-triol (92.09 Da)",
        concentration: "99.7% Botanical Purity",
        role: "Aquaporin-3 (AQP3) Co-Transporter",
        biochemicalTarget: "Travels alongside water molecules through AQP3 membrane channels into basal keratinocytes.",
      },
      {
        compound: "Lamellar Lipid Liquid-Crystal Stabilizer",
        concentration: "Intercellular Plasticizer",
        role: "Anti-Brittle Barrier Shield",
        biochemicalTarget: "Prevents ceramide/cholesterol bilayers from transitioning from a fluid liquid-crystalline state into a rigid solid state.",
      },
      {
        compound: "Corneodesmosome Hydrolase Cofactor",
        concentration: "Desquamation Enzyme Activator",
        role: "Natural Flake-Free Exfoliation Helper",
        biochemicalTarget: "Provides the aqueous microenvironment needed by kallikrein enzymes to shed dead cells invisibly.",
      },
      {
        compound: "Osmoprotective Tri-Hydroxyl Core",
        concentration: "Hygroscopic Moisture Magnet",
        role: "24-Hour Reservoir Binder",
        biochemicalTarget: "Holds water inside the corneocyte envelope even during flights or winter heating.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Cold-Pressed Botanical Glycerin)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Cold-Pressed Botanical Glycerin (Glycerin (99.7% USP Organic Vegetable Grade)) partitions across Full face, lips perimeter, hands, and dehydration-prone contours at pH 4.0 \u2013 8.0, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate supple, elastic, and dewy (formulated with aloe to eliminate stickiness) with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (92.09 Da (Ultra-Low Dalton Aquaporin-3 Substrate))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Propane-1,2,3-triol (92.09 Da), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver aquaporin-3 water transport, lamellar lipid fluidity, and natural enzyme desquamation.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Lamellar Lipid Liquid-Crystal Stabilizer)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Prevents ceramide/cholesterol bilayers from transitioning from a fluid liquid-crystalline state into a rigid solid state.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Corneodesmosome Hydrolase Cofactor)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Provides the aqueous microenvironment needed by kallikrein enzymes to shed dead cells invisibly.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Osmoprotective Tri-Hydroxyl Core)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Holds water inside the corneocyte envelope even during flights or winter heating.",
        visibleOutcome: "Lasting improvement in Full face, lips perimeter, hands, and dehydration-prone contours clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Cold-Pressed Botanical Glycerin Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Vata Pacifier \u2014 Prevents dry, brittle skin cracking in arid climates while compounding synergy with Pure Aloe Vera (Story 04) and Multi-Molecular Hyaluronic Acid.",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Full face, lips perimeter, hands, and dehydration-prone contours for Cold-Pressed Botanical Glycerin absorption.",
        proTip: "Cold-Pressed Botanical Glycerin maintains peak stability at pH 4.0 \u2013 8.0; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (4.50% Balanced Non-Sticky Cushioned Level)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Cold-Pressed Botanical Glycerin-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Cold-Pressed Botanical Glycerin and Pure Aloe Vera (Story 04) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the 100% miscible in water matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Full face, lips perimeter, hands, an",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Full face, lips perimeter, hands, and dehydration-prone contours.",
        proTip: "Use featherlight ring-finger pressure so Propane-1,2,3-triol (92.09 Da) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Propane-1,2,3-triol (92.09 Da) and Lamellar Lipid Liquid-Crystal Stabilizer bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Pure Aloe Vera (Story 04) or Multi-Molecular Hyaluronic Acid within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Propane-1,2,3-triol (92.09 Da) across the upper stratum corneum at pH 4.0 \u2013 8.0.",
        experience: "Skin feels supple, elastic, and dewy (formulated with aloe to eliminate stickiness) with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in aquaporin-3 water transport, lamellar lipid fluidity, and natural enzyme desquamation and reduced daily oxidative stress.",
        experience: "Full face, lips perimeter, hands, and dehydration-prone contours appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Lamellar Lipid Liquid-Crystal Stabilizer and Corneodesmosome Hydrolase Cofactor.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Cold-Pressed Botanical Glycerin + Pure Aloe Vera (Story 04).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports aquaporin-3 water transport, lamellar lipid fluidity, and natural enzyme desquamation while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Full face, lips perimeter, hands, and dehydration-prone contours.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.0 \u2013 8.0 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Propane-1,2,3-triol (92.09 Da) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "aloe_vera",
        partnerName: "Pure Aloe Vera (Story 04)",
        synergyScore: "99/100",
        combinedBenefit: "Aloe + Glycerin co-activate Aquaporin-3 channels while eliminating any humectant tackiness.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "hyaluronic_acid",
        partnerName: "Multi-Molecular Hyaluronic Acid",
        synergyScore: "98/100",
        combinedBenefit: "92 Da Glycerin penetrates deep while 2,000 kDa HA seals the surface.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "ceramide_complex",
        partnerName: "Ceramide NP / AP / EOP Complex",
        synergyScore: "97/100",
        combinedBenefit: "Keeps ceramide bilayers flexible and crack-resistant.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.0 \u2013 8.0. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Cold-Pressed Botanical Glycerin work inside Bhumivera formulations?",
        answer: "Far more than a basic humectant, Glycerin is an endogenous molecule transported by Aquaporin-3 (AQP3) channels in human skin. It prevents intercellular lipids from crystallizing into brittle, leaky phases in cold or dry air. Its primary bioactive, Propane-1,2,3-triol (92.09 Da) (99.7% Botanical Purity), targets Full face, lips perimeter, hands, and dehydration-prone contours to deliver aquaporin-3 water transport, lamellar lipid fluidity, and natural enzyme desquamation.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Cold-Pressed Botanical Glycerin?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Cold-Pressed Botanical Glycerin?",
        answer: "Cold-Pressed Botanical Glycerin achieves peak clinical synergy when paired with Pure Aloe Vera (Story 04) (99/100 synergy), Multi-Molecular Hyaluronic Acid (98/100 synergy), and Ceramide NP / AP / EOP Complex (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "vegetable_glycerin_pair_0",
        label: "Synergy: Pure Aloe Vera (Story 04)",
        prompt: "Tell me about Pure Aloe Vera (Story 04) and how it works with Cold-Pressed Botanical Glycerin",
        category: 'closely_related_ingredient',
      },
      {
        id: "vegetable_glycerin_pair_1",
        label: "Synergy: Multi-Molecular Hyaluronic Acid",
        prompt: "Tell me about Multi-Molecular Hyaluronic Acid and how it works with Cold-Pressed Botanical Glycerin",
        category: 'closely_related_ingredient',
      },
      {
        id: "vegetable_glycerin_ritual_steps",
        label: "6-Step Cold-Pressed Botanical Glycerin Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Cold-Pressed Botanical Glycerin",
        category: 'usage_and_timing',
      },
      {
        id: "vegetable_glycerin_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "centella_asiatica",
    indexNumber: 13,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 13",
    isHeroStory: false,
    name: "Centella Asiatica (Gotu Kola / Mandukaparni)",
    fullTitle: "Titrated TECA Complex (Madecassoside, Asiaticoside, Asiatic & Madecassic Acids)",
    latinBinomial: "Centella asiatica (L.) Urban",
    inciName: "Centella Asiatica Leaf Extract, Madecassoside & Asiaticoside",
    category: "Ayurvedic & Clinical Botanical \u00b7 Collagen & Redness Healer",
    noteFamily: "Mandukaparni Rasayana \u00b7 Triterpene Repair",
    tagline: "Standardized Ayurvedic Gotu Kola triterpenes that quiet inflammatory cascades and stimulate Type I & III collagen.",
    shortSummary: "Known in Ayurveda as Mandukaparni and in clinical dermatology as Cica, our titrated Centella Asiatica delivers all four bioactive pentacyclic triterpenoids to repair compromised barriers, fade red post-acne marks (PIE), and firm the dermis.",
    originRegion: "Marshland Botanical Reserves of Kerala & Western Ghats, India",
    harvestSeason: "Monsoon & Post-Monsoon Lush Leaf Harvest",
    extractionMethod: "Subcritical Hydro-Ethanolic Extraction + TECA Triterpene Titration",
    concentrationInFormula: "1.50% Standardized Extract (40% Titrated Triterpenes)",
    optimalPhRange: "4.8 \u2013 6.2",
    solubility: "Amphiphilic Phyto-Glycolic Complex",
    molecularWeightProfile: "488.7 Da (Asiatic Acid) to 975.1 Da (Madecassoside)",
    ayurvedicDoshaAffinity: "Pitta & Vata Healer \u2014 Cools vascular redness and rebuilds fragile tissue",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts",
    primaryClinicalBenefit: "Fades red post-acne marks, activates Type I/III collagen, and repairs damaged barriers",
    sensoryProfile: {
      color: "Pale Jade-Amber Botanical Nectar",
      aroma: "Subtle herbaceous green leaf",
      skinFeel: "Calming, cocooning, and deeply restorative",
    },
    bioactiveCompounds: [
      {
        compound: "Madecassoside (Pentacyclic Triterpene Saponin)",
        concentration: "18% of Titrated Complex",
        role: "Cytokine & Redness Suppressor",
        biochemicalTarget: "Inhibits IL-1beta, IL-6, and TNF-alpha expression, rapidly fading post-inflammatory erythema (PIE).",
      },
      {
        compound: "Asiaticoside",
        concentration: "16% of Titrated Complex",
        role: "TGF-Beta Smad Collagen Activator",
        biochemicalTarget: "Activates the TGF-\u03b2 receptor pathway in dermal fibroblasts to synthesize Type I and Type III collagen.",
      },
      {
        compound: "Asiatic Acid & Madecassic Acid (Aglycones)",
        concentration: "6% Low-Dalton Aglycones",
        role: "MMP-1 Inhibitor & Antioxidant",
        biochemicalTarget: "Low-molecular-weight aglycones (~488 Da) penetrate rapidly to halt UV-induced collagen degradation.",
      },
      {
        compound: "Flavonoid Quercetin & Kaempferol Derivatives",
        concentration: "Polyphenol Cofactors",
        role: "Microcapillary Wall Strengthener",
        biochemicalTarget: "Reduces capillary permeability and visible facial flushing.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Centella Asiatica (Gotu Kola / Mandukaparni))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Centella Asiatica (Gotu Kola / Mandukaparni) (Centella Asiatica Leaf Extract, Madecassoside & Asiaticoside) partitions across Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts at pH 4.8 \u2013 6.2, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate calming, cocooning, and deeply restorative with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (488.7 Da (Asiatic Acid) to 975.1 Da (Madecassoside))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Madecassoside (Pentacyclic Triterpene Saponin), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver fades red post-acne marks, activates type i/iii collagen, and repairs damaged barriers.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Asiaticoside)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Activates the TGF-\u03b2 receptor pathway in dermal fibroblasts to synthesize Type I and Type III collagen.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Asiatic Acid & Madecassic Acid (Aglycones))",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Low-molecular-weight aglycones (~488 Da) penetrate rapidly to halt UV-induced collagen degradation.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Flavonoid Quercetin & Kaempferol Derivatives)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Reduces capillary permeability and visible facial flushing.",
        visibleOutcome: "Lasting improvement in Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Centella Asiatica (Gotu Kola / Mandukaparni) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Pitta & Vata Healer \u2014 Cools vascular redness and rebuilds fragile tissue while compounding synergy with Sacred Tulsi (Story 03) and D-Panthenol (Pro-Vitamin B5).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts for Centella Asiatica (Gotu Kola / Mandukaparni) absorption.",
        proTip: "Centella Asiatica (Gotu Kola / Mandukaparni) maintains peak stability at pH 4.8 \u2013 6.2; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.50% Standardized Extract (40% Titrated Triterpenes))",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Centella Asiatica (Gotu Kola / Mandukaparni)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Centella Asiatica (Gotu Kola / Mandukaparni) and Sacred Tulsi (Story 03) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the amphiphilic phyto-glycolic complex matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Red post-blemish marks (PIE), sensit",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts.",
        proTip: "Use featherlight ring-finger pressure so Madecassoside (Pentacyclic Triterpene Saponin) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Madecassoside (Pentacyclic Triterpene Saponin) and Asiaticoside bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Sacred Tulsi (Story 03) or D-Panthenol (Pro-Vitamin B5) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Madecassoside (Pentacyclic Triterpene Saponin) across the upper stratum corneum at pH 4.8 \u2013 6.2.",
        experience: "Skin feels calming, cocooning, and deeply restorative with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in fades red post-acne marks, activates type i/iii collagen, and repairs damaged barriers and reduced daily oxidative stress.",
        experience: "Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Asiaticoside and Asiatic Acid & Madecassic Acid (Aglycones).",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Centella Asiatica (Gotu Kola / Mandukaparni) + Sacred Tulsi (Story 03).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports fades red post-acne marks, activates type i/iii collagen, and repairs damaged barriers while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.8 \u2013 6.2 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Madecassoside (Pentacyclic Triterpene Saponin) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "sacred_tulsi",
        partnerName: "Sacred Tulsi (Story 03)",
        synergyScore: "99/100",
        combinedBenefit: "Ayurvedic powerhouse duo combining Ursolic Acid (Tulsi) with Madecassoside (Centella).",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "panthenol",
        partnerName: "D-Panthenol (Pro-Vitamin B5)",
        synergyScore: "98/100",
        combinedBenefit: "Clinical gold standard for overnight barrier rescue and redness relief.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "niacinamide",
        partnerName: "Niacinamide (Vitamin B3)",
        synergyScore: "97/100",
        combinedBenefit: "Centella fades red marks (PIE) while Niacinamide fades brown marks (PIH).",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.8 \u2013 6.2. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Centella Asiatica (Gotu Kola / Mandukaparni) work inside Bhumivera formulations?",
        answer: "Known in Ayurveda as Mandukaparni and in clinical dermatology as Cica, our titrated Centella Asiatica delivers all four bioactive pentacyclic triterpenoids to repair compromised barriers, fade red post-acne marks (PIE), and firm the dermis. Its primary bioactive, Madecassoside (Pentacyclic Triterpene Saponin) (18% of Titrated Complex), targets Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts to deliver fades red post-acne marks, activates type i/iii collagen, and repairs damaged barriers.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Centella Asiatica (Gotu Kola / Mandukaparni)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Centella Asiatica (Gotu Kola / Mandukaparni)?",
        answer: "Centella Asiatica (Gotu Kola / Mandukaparni) achieves peak clinical synergy when paired with Sacred Tulsi (Story 03) (99/100 synergy), D-Panthenol (Pro-Vitamin B5) (98/100 synergy), and Niacinamide (Vitamin B3) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "centella_asiatica_pair_0",
        label: "Synergy: Sacred Tulsi (Story 03)",
        prompt: "Tell me about Sacred Tulsi (Story 03) and how it works with Centella Asiatica (Gotu Kola / Mandukaparni)",
        category: 'closely_related_ingredient',
      },
      {
        id: "centella_asiatica_pair_1",
        label: "Synergy: D-Panthenol (Pro-Vitamin B5)",
        prompt: "Tell me about D-Panthenol (Pro-Vitamin B5) and how it works with Centella Asiatica (Gotu Kola / Mandukaparni)",
        category: 'closely_related_ingredient',
      },
      {
        id: "centella_asiatica_ritual_steps",
        label: "6-Step Centella Asiatica (Gotu Kola / Mandukaparni) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Centella Asiatica (Gotu Kola / Mandukaparni)",
        category: 'usage_and_timing',
      },
      {
        id: "centella_asiatica_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "licorice_glabridin",
    indexNumber: 14,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 14",
    isHeroStory: false,
    name: "Licorice Root (Yashtimadhu / Glabridin)",
    fullTitle: "Standardized Glycyrrhiza Glabra Root Extract (Glabridin + Liquiritin + Dipotassium Glycyrrhizate)",
    latinBinomial: "Glycyrrhiza glabra L.",
    inciName: "Glycyrrhiza Glabra (Licorice) Root Extract & Dipotassium Glycyrrhizate",
    category: "Ayurvedic & Clinical Botanical \u00b7 Hyperpigmentation Brightener",
    noteFamily: "Yashtimadhu \u00b7 Tyrosinase & Melanin Disperser",
    tagline: "Ayurvedic Yashtimadhu root delivering Glabridin and Liquiritin to inhibit tyrosinase 16x more gently than hydroquinone.",
    shortSummary: "Licorice Root attacks dark spots from three angles simultaneously: Glabridin inhibits tyrosinase pigment production, Liquiritin disperses existing melanin clusters, and Glycyrrhizate calms the inflammation that triggers post-acne pigmentation.",
    originRegion: "Semi-Arid Alluvial Plains of Northwest India (Punjab & Haryana)",
    harvestSeason: "Autumn 3-Year Root Digging",
    extractionMethod: "Cold Dual-Solvent Isoflavone Isolation",
    concentrationInFormula: "1.00% Standardized Glabridin & Glycyrrhizate Complex",
    optimalPhRange: "4.8 \u2013 6.2",
    solubility: "Amphiphilic Flavonoid & Water-Soluble Salt Complex",
    molecularWeightProfile: "324.37 Da (Glabridin) to 840.9 Da (Dipotassium Glycyrrhizate)",
    ayurvedicDoshaAffinity: "Pitta & Vata Varnya Herb \u2014 Supreme Ayurvedic complexion brightener and coolant",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH)",
    primaryClinicalBenefit: "Triple-action dark spot fading (inhibits tyrosinase, disperses melanin, calms redness)",
    sensoryProfile: {
      color: "Golden Champagne Botanical Extract",
      aroma: "Faint, sweet woody-root whisper",
      skinFeel: "Silky, soothing, and brightening",
    },
    bioactiveCompounds: [
      {
        compound: "Glabridin (Prenylated Isoflavan)",
        concentration: "4.0% Standardized Fraction",
        role: "High-Potency Tyrosinase Inhibitor",
        biochemicalTarget: "Inhibits melanogenesis and UVB-induced erythema without any melanocyte cytotoxicity.",
      },
      {
        compound: "Liquiritin & Isoliquiritin Chalcones",
        concentration: "12% Flavonoid Glycosides",
        role: "Melanin Cluster Disperser",
        biochemicalTarget: "Breaks up concentrated pockets of existing epidermal melanin so dark spots fade evenly.",
      },
      {
        compound: "Dipotassium Glycyrrhizate",
        concentration: "20% Triterpenoid Salt",
        role: "Cortisol-Like Soothing Anti-Irritant",
        biochemicalTarget: "Inhibits hyaluronidase and 11\u03b2-HSD, calming redness and preventing histamine itching.",
      },
      {
        compound: "Licochalcone A",
        concentration: "2.5% Sebum & Redness Regulator",
        role: "NF-kB & P. acnes Modulator",
        biochemicalTarget: "Reduces facial erythema and controls excess oil oxidation.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Licorice Root (Yashtimadhu / Glabridin))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Licorice Root (Yashtimadhu / Glabridin) (Glycyrrhiza Glabra (Licorice) Root Extract & Dipotassium Glycyrrhizate) partitions across Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH) at pH 4.8 \u2013 6.2, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate silky, soothing, and brightening with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (324.37 Da (Glabridin) to 840.9 Da (Dipotassium Glycyrrhizate))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Glabridin (Prenylated Isoflavan), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver triple-action dark spot fading (inhibits tyrosinase, disperses melanin, calms redness).",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Liquiritin & Isoliquiritin Chalcones)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Breaks up concentrated pockets of existing epidermal melanin so dark spots fade evenly.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Dipotassium Glycyrrhizate)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Inhibits hyaluronidase and 11\u03b2-HSD, calming redness and preventing histamine itching.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Licochalcone A)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Reduces facial erythema and controls excess oil oxidation.",
        visibleOutcome: "Lasting improvement in Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH) clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Licorice Root (Yashtimadhu / Glabridin) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Pitta & Vata Varnya Herb \u2014 Supreme Ayurvedic complexion brightener and coolant while compounding synergy with Vitamin C (3-O-Ethyl Ascorbic Acid) and Niacinamide (Vitamin B3).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH) for Licorice Root (Yashtimadhu / Glabridin) absorption.",
        proTip: "Licorice Root (Yashtimadhu / Glabridin) maintains peak stability at pH 4.8 \u2013 6.2; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.00% Standardized Glabridin & Glycyrrhizate Complex)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Licorice Root (Yashtimadhu / Glabridin)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Licorice Root (Yashtimadhu / Glabridin) and Vitamin C (3-O-Ethyl Ascorbic Acid) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the amphiphilic flavonoid & water-soluble salt complex matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Melasma patches, sun spots, upper li",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH).",
        proTip: "Use featherlight ring-finger pressure so Glabridin (Prenylated Isoflavan) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Glabridin (Prenylated Isoflavan) and Liquiritin & Isoliquiritin Chalcones bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Vitamin C (3-O-Ethyl Ascorbic Acid) or Niacinamide (Vitamin B3) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Glabridin (Prenylated Isoflavan) across the upper stratum corneum at pH 4.8 \u2013 6.2.",
        experience: "Skin feels silky, soothing, and brightening with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in triple-action dark spot fading (inhibits tyrosinase, disperses melanin, calms redness) and reduced daily oxidative stress.",
        experience: "Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH) appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Liquiritin & Isoliquiritin Chalcones and Dipotassium Glycyrrhizate.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Licorice Root (Yashtimadhu / Glabridin) + Vitamin C (3-O-Ethyl Ascorbic Acid).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports triple-action dark spot fading (inhibits tyrosinase, disperses melanin, calms redness) while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH).",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.8 \u2013 6.2 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Glabridin (Prenylated Isoflavan) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "vitamin_c_ethyl",
        partnerName: "Vitamin C (3-O-Ethyl Ascorbic Acid)",
        synergyScore: "99/100",
        combinedBenefit: "Dual tyrosinase inhibition for rapid, irritation-free brightening.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "niacinamide",
        partnerName: "Niacinamide (Vitamin B3)",
        synergyScore: "99/100",
        combinedBenefit: "Licorice stops pigment synthesis; Niacinamide stops pigment transfer.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "sea_buckthorn",
        partnerName: "Sea Buckthorn (Story 01)",
        synergyScore: "98/100",
        combinedBenefit: "Combines Himalayan berry carotenoids with Yashtimadhu root radiance.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.8 \u2013 6.2. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Licorice Root (Yashtimadhu / Glabridin) work inside Bhumivera formulations?",
        answer: "Licorice Root attacks dark spots from three angles simultaneously: Glabridin inhibits tyrosinase pigment production, Liquiritin disperses existing melanin clusters, and Glycyrrhizate calms the inflammation that triggers post-acne pigmentation. Its primary bioactive, Glabridin (Prenylated Isoflavan) (4.0% Standardized Fraction), targets Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH) to deliver triple-action dark spot fading (inhibits tyrosinase, disperses melanin, calms redness).",
      },
      {
        question: "What is the best time of day and step-by-step method to use Licorice Root (Yashtimadhu / Glabridin)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Licorice Root (Yashtimadhu / Glabridin)?",
        answer: "Licorice Root (Yashtimadhu / Glabridin) achieves peak clinical synergy when paired with Vitamin C (3-O-Ethyl Ascorbic Acid) (99/100 synergy), Niacinamide (Vitamin B3) (99/100 synergy), and Sea Buckthorn (Story 01) (98/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "licorice_glabridin_pair_0",
        label: "Synergy: Vitamin C (3-O-Ethyl Ascorbic Acid)",
        prompt: "Tell me about Vitamin C (3-O-Ethyl Ascorbic Acid) and how it works with Licorice Root (Yashtimadhu / Glabridin)",
        category: 'closely_related_ingredient',
      },
      {
        id: "licorice_glabridin_pair_1",
        label: "Synergy: Niacinamide (Vitamin B3)",
        prompt: "Tell me about Niacinamide (Vitamin B3) and how it works with Licorice Root (Yashtimadhu / Glabridin)",
        category: 'closely_related_ingredient',
      },
      {
        id: "licorice_glabridin_ritual_steps",
        label: "6-Step Licorice Root (Yashtimadhu / Glabridin) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Licorice Root (Yashtimadhu / Glabridin)",
        category: 'usage_and_timing',
      },
      {
        id: "licorice_glabridin_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "green_tea_egcg",
    indexNumber: 15,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 15",
    isHeroStory: false,
    name: "Green Tea Polyphenols (EGCG)",
    fullTitle: "Darjeeling First-Flush Camellia Sinensis Epigallocatechin Gallate Complex",
    latinBinomial: "Camellia sinensis (L.) Kuntze",
    inciName: "Camellia Sinensis Leaf Extract (Standardized 50% EGCG)",
    category: "Botanical Active \u00b7 Antioxidant & Sebum Regulator",
    noteFamily: "High-Grown Leaf Catechin \u00b7 Sebocyte Modulator",
    tagline: "High-altitude Darjeeling green tea catechins standardized for EGCG to quench UV free radicals and reduce sebum.",
    shortSummary: "Rich in Epigallocatechin-3-gallate (EGCG), Darjeeling First-Flush Green Tea downregulates 5-alpha-reductase activity in oil glands, protects Langerhans immune cells from UV damage, and neutralizes lipid peroxides.",
    originRegion: "High-Elevation Tea Gardens of Darjeeling, West Bengal, India (1,800m)",
    harvestSeason: "March \u2013 April First Spring Flush (Unfermented Young Two Leaves & Bud)",
    extractionMethod: "Immediate Steam Enzyme-Inactivation + Cold Aqueous Catechin Extraction",
    concentrationInFormula: "1.25% Standardized Catechin Extract (50% EGCG)",
    optimalPhRange: "4.8 \u2013 5.8",
    solubility: "Hydrophilic Polyphenol Solution",
    molecularWeightProfile: "458.37 Da (Epigallocatechin Gallate)",
    ayurvedicDoshaAffinity: "Kapha & Pitta Balancer \u2014 Astringes excess oil and cools solar heat",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Oily T-zone, morning facial puffiness, and UV-exposed contours",
    primaryClinicalBenefit: "EGCG antioxidant defense, 5-alpha-reductase oil control, and morning de-puffing",
    sensoryProfile: {
      color: "Clear Pale Champagne-Green",
      aroma: "Crisp mountain tea bud",
      skinFeel: "Clean, toning, and shine-controlling",
    },
    bioactiveCompounds: [
      {
        compound: "Epigallocatechin-3-Gallate (EGCG)",
        concentration: "50% of Extract",
        role: "Sebocyte AMPK Activator & Antioxidant",
        biochemicalTarget: "Modulates the AMPK-SREBP-1 pathway in sebaceous glands, reducing excess sebum synthesis by up to 45%.",
      },
      {
        compound: "Epicatechin Gallate (ECG) & Epigallocatechin (EGC)",
        concentration: "30% Catechin Complex",
        role: "MMP-2 & MMP-9 Collagenase Blocker",
        biochemicalTarget: "Prevents UV-induced degradation of basement membrane Type IV collagen.",
      },
      {
        compound: "L-Theanine Amino Acid",
        concentration: "4% Natural Leaf Amino Acid",
        role: "Barrier NMF & Calm Enhancer",
        biochemicalTarget: "Supports epidermal hydration and calms neurogenic skin flushing.",
      },
      {
        compound: "Plant Caffeine & Theobromine (Micro-Dose)",
        concentration: "1.5% Natural Xanthines",
        role: "Micro-Circulation & De-Puffing Activator",
        biochemicalTarget: "Reduces morning facial puffiness and under-eye fluid stagnation.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Green Tea Polyphenols (EGCG))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Green Tea Polyphenols (EGCG) (Camellia Sinensis Leaf Extract (Standardized 50% EGCG)) partitions across Oily T-zone, morning facial puffiness, and UV-exposed contours at pH 4.8 \u2013 5.8, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate clean, toning, and shine-controlling with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (458.37 Da (Epigallocatechin Gallate))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Epigallocatechin-3-Gallate (EGCG), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver egcg antioxidant defense, 5-alpha-reductase oil control, and morning de-puffing.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Epicatechin Gallate (ECG) & Epigallocatechin (EGC))",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Prevents UV-induced degradation of basement membrane Type IV collagen.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (L-Theanine Amino Acid)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Supports epidermal hydration and calms neurogenic skin flushing.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Plant Caffeine & Theobromine (Micro-Dose))",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Reduces morning facial puffiness and under-eye fluid stagnation.",
        visibleOutcome: "Lasting improvement in Oily T-zone, morning facial puffiness, and UV-exposed contours clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Green Tea Polyphenols (EGCG) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Kapha & Pitta Balancer \u2014 Astringes excess oil and cools solar heat while compounding synergy with Vitamin C (3-O-Ethyl Ascorbic Acid) and Sacred Tulsi (Story 03).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Oily T-zone, morning facial puffiness, and UV-exposed contours for Green Tea Polyphenols (EGCG) absorption.",
        proTip: "Green Tea Polyphenols (EGCG) maintains peak stability at pH 4.8 \u2013 5.8; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.25% Standardized Catechin Extract (50% EGCG))",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Green Tea Polyphenols (EGCG)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Green Tea Polyphenols (EGCG) and Vitamin C (3-O-Ethyl Ascorbic Acid) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the hydrophilic polyphenol solution matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Oily T-zone, morning facial puffines",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Oily T-zone, morning facial puffiness, and UV-exposed contours.",
        proTip: "Use featherlight ring-finger pressure so Epigallocatechin-3-Gallate (EGCG) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Epigallocatechin-3-Gallate (EGCG) and Epicatechin Gallate (ECG) & Epigallocatechin (EGC) bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Vitamin C (3-O-Ethyl Ascorbic Acid) or Sacred Tulsi (Story 03) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Epigallocatechin-3-Gallate (EGCG) across the upper stratum corneum at pH 4.8 \u2013 5.8.",
        experience: "Skin feels clean, toning, and shine-controlling with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in egcg antioxidant defense, 5-alpha-reductase oil control, and morning de-puffing and reduced daily oxidative stress.",
        experience: "Oily T-zone, morning facial puffiness, and UV-exposed contours appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Epicatechin Gallate (ECG) & Epigallocatechin (EGC) and L-Theanine Amino Acid.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Green Tea Polyphenols (EGCG) + Vitamin C (3-O-Ethyl Ascorbic Acid).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports egcg antioxidant defense, 5-alpha-reductase oil control, and morning de-puffing while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Oily T-zone, morning facial puffiness, and UV-exposed contours.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.8 \u2013 5.8 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Epigallocatechin-3-Gallate (EGCG) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "vitamin_c_ethyl",
        partnerName: "Vitamin C (3-O-Ethyl Ascorbic Acid)",
        synergyScore: "99/100",
        combinedBenefit: "Vitamin C stabilizes EGCG catechins while doubling daytime UV photoprotection.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "sacred_tulsi",
        partnerName: "Sacred Tulsi (Story 03)",
        synergyScore: "98/100",
        combinedBenefit: "Dual polyphenol defense against hormonal and stress-triggered breakouts.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "activated_charcoal",
        partnerName: "Activated Bamboo Charcoal (Story 02)",
        synergyScore: "97/100",
        combinedBenefit: "Clears and tones enlarged pores.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.8 \u2013 5.8. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Green Tea Polyphenols (EGCG) work inside Bhumivera formulations?",
        answer: "Rich in Epigallocatechin-3-gallate (EGCG), Darjeeling First-Flush Green Tea downregulates 5-alpha-reductase activity in oil glands, protects Langerhans immune cells from UV damage, and neutralizes lipid peroxides. Its primary bioactive, Epigallocatechin-3-Gallate (EGCG) (50% of Extract), targets Oily T-zone, morning facial puffiness, and UV-exposed contours to deliver egcg antioxidant defense, 5-alpha-reductase oil control, and morning de-puffing.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Green Tea Polyphenols (EGCG)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Green Tea Polyphenols (EGCG)?",
        answer: "Green Tea Polyphenols (EGCG) achieves peak clinical synergy when paired with Vitamin C (3-O-Ethyl Ascorbic Acid) (99/100 synergy), Sacred Tulsi (Story 03) (98/100 synergy), and Activated Bamboo Charcoal (Story 02) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "green_tea_egcg_pair_0",
        label: "Synergy: Vitamin C (3-O-Ethyl Ascorbic Acid)",
        prompt: "Tell me about Vitamin C (3-O-Ethyl Ascorbic Acid) and how it works with Green Tea Polyphenols (EGCG)",
        category: 'closely_related_ingredient',
      },
      {
        id: "green_tea_egcg_pair_1",
        label: "Synergy: Sacred Tulsi (Story 03)",
        prompt: "Tell me about Sacred Tulsi (Story 03) and how it works with Green Tea Polyphenols (EGCG)",
        category: 'closely_related_ingredient',
      },
      {
        id: "green_tea_egcg_ritual_steps",
        label: "6-Step Green Tea Polyphenols (EGCG) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Green Tea Polyphenols (EGCG)",
        category: 'usage_and_timing',
      },
      {
        id: "green_tea_egcg_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "turmeric_curcumin",
    indexNumber: 16,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 16",
    isHeroStory: false,
    name: "Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin)",
    fullTitle: "Non-Staining Wild Kasturi Manjal & Bio-Reduced Tetrahydrocurcumin Complex",
    latinBinomial: "Curcuma aromatica Salisb. & Curcuma longa L.",
    inciName: "Curcuma Aromatica Root Extract & Tetrahydrocurcumin",
    category: "Ayurvedic & Clinical Botanical \u00b7 Golden Radiance & Calm",
    noteFamily: "Wild Kasturi Manjal \u00b7 Non-Staining Curcuminoid",
    tagline: "Wild non-staining Kasturi Turmeric paired with colorless Tetrahydrocurcumin for bridal-grade Ayurvedic glow.",
    shortSummary: "Traditional kitchen turmeric (Curcuma longa) stains skin yellow. Bhumivera combines wild aromatic Kasturi Manjal (Curcuma aromatica) with bio-reduced Tetrahydrocurcumin\u2014delivering 3x the antioxidant and tyrosinase-inhibiting power with zero yellow staining.",
    originRegion: "Western Ghats Forest Foothills (Tamil Nadu & Karnataka, India)",
    harvestSeason: "January \u2013 February Mature Rhizome Harvest",
    extractionMethod: "Lactobacillus Bio-Fermentation + Supercritical Rhizome Extraction",
    concentrationInFormula: "0.80% Non-Staining Curcuminoid Complex",
    optimalPhRange: "4.8 \u2013 6.0",
    solubility: "Amphiphilic Liposomal Dispersion",
    molecularWeightProfile: "372.41 Da (Tetrahydrocurcumin)",
    ayurvedicDoshaAffinity: "Tridoshic Varnya Rasayana \u2014 Awakens golden glow and clears Kapha/Pitta blemishes",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks",
    primaryClinicalBenefit: "Zero-stain Ayurvedic radiance, NF-kB inflammation blockade, and dark spot prevention",
    sensoryProfile: {
      color: "Creamy Translucent Ivory-Gold (Zero Skin Staining)",
      aroma: "Subtle warm camphoraceous-floral root",
      skinFeel: "Velvety, brightening, and soothing",
    },
    bioactiveCompounds: [
      {
        compound: "Tetrahydrocurcumin (Colorless Bio-Metabolite)",
        concentration: "25% of Complex",
        role: "Stain-Free Tyrosinase & Free-Radical Inhibitor",
        biochemicalTarget: "More stable and potent than yellow curcumin at neutralizing lipid radicals and inhibiting melanin overproduction.",
      },
      {
        compound: "Germacrone & Curzerenone Sesquiterpenes",
        concentration: "15% Wild Kasturi Fraction",
        role: "Anti-Blemish & Redness Calmer",
        biochemicalTarget: "Inhibits C. acnes proliferation and calms inflammatory papules rapidly.",
      },
      {
        compound: "Fermented Rhizome Organic Acids",
        concentration: "Lactobacillus Ferment Filtrate",
        role: "Microbiome Prebiotic & Gentle Brightener",
        biochemicalTarget: "Supports acid-mantle resilience and smooths dull surface texture.",
      },
      {
        compound: "Ar-Turmerone",
        concentration: "8% Neuro-Regenerative Sesquiterpene",
        role: "Barrier & Dermal Vitality Booster",
        biochemicalTarget: "Enhances cellular communication and antioxidant enzyme expression.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) (Curcuma Aromatica Root Extract & Tetrahydrocurcumin) partitions across Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks at pH 4.8 \u2013 6.0, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate velvety, brightening, and soothing with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (372.41 Da (Tetrahydrocurcumin))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Tetrahydrocurcumin (Colorless Bio-Metabolite), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver zero-stain ayurvedic radiance, nf-kb inflammation blockade, and dark spot prevention.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Germacrone & Curzerenone Sesquiterpenes)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Inhibits C. acnes proliferation and calms inflammatory papules rapidly.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Fermented Rhizome Organic Acids)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Supports acid-mantle resilience and smooths dull surface texture.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Ar-Turmerone)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Enhances cellular communication and antioxidant enzyme expression.",
        visibleOutcome: "Lasting improvement in Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Tridoshic Varnya Rasayana \u2014 Awakens golden glow and clears Kapha/Pitta blemishes while compounding synergy with Kashmiri Mogra Saffron and Sea Buckthorn (Story 01).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks for Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) absorption.",
        proTip: "Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) maintains peak stability at pH 4.8 \u2013 6.0; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (0.80% Non-Staining Curcuminoid Complex)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) and Kashmiri Mogra Saffron into a silky micro-cushion.",
        proTip: "Pre-whipping activates the amphiphilic liposomal dispersion matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Dull complexion, uneven skin tone, w",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks.",
        proTip: "Use featherlight ring-finger pressure so Tetrahydrocurcumin (Colorless Bio-Metabolite) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Tetrahydrocurcumin (Colorless Bio-Metabolite) and Germacrone & Curzerenone Sesquiterpenes bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Kashmiri Mogra Saffron or Sea Buckthorn (Story 01) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Tetrahydrocurcumin (Colorless Bio-Metabolite) across the upper stratum corneum at pH 4.8 \u2013 6.0.",
        experience: "Skin feels velvety, brightening, and soothing with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in zero-stain ayurvedic radiance, nf-kb inflammation blockade, and dark spot prevention and reduced daily oxidative stress.",
        experience: "Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Germacrone & Curzerenone Sesquiterpenes and Fermented Rhizome Organic Acids.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) + Kashmiri Mogra Saffron.",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports zero-stain ayurvedic radiance, nf-kb inflammation blockade, and dark spot prevention while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.8 \u2013 6.0 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Tetrahydrocurcumin (Colorless Bio-Metabolite) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "kashmiri_saffron",
        partnerName: "Kashmiri Mogra Saffron",
        synergyScore: "100/100",
        combinedBenefit: "The royal Ayurvedic Kumkumadi-inspired brightening duo for luminous skin.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "sea_buckthorn",
        partnerName: "Sea Buckthorn (Story 01)",
        synergyScore: "98/100",
        combinedBenefit: "Golden berry + golden rhizome for unmatched antioxidant glow.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "licorice_glabridin",
        partnerName: "Licorice Root (Glabridin)",
        synergyScore: "97/100",
        combinedBenefit: "Synergistic tyrosinase inhibition to fade stubborn hyperpigmentation.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.8 \u2013 6.0. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) work inside Bhumivera formulations?",
        answer: "Traditional kitchen turmeric (Curcuma longa) stains skin yellow. Bhumivera combines wild aromatic Kasturi Manjal (Curcuma aromatica) with bio-reduced Tetrahydrocurcumin\u2014delivering 3x the antioxidant and tyrosinase-inhibiting power with zero yellow staining. Its primary bioactive, Tetrahydrocurcumin (Colorless Bio-Metabolite) (25% of Complex), targets Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks to deliver zero-stain ayurvedic radiance, nf-kb inflammation blockade, and dark spot prevention.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin)?",
        answer: "Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) achieves peak clinical synergy when paired with Kashmiri Mogra Saffron (100/100 synergy), Sea Buckthorn (Story 01) (98/100 synergy), and Licorice Root (Glabridin) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "turmeric_curcumin_pair_0",
        label: "Synergy: Kashmiri Mogra Saffron",
        prompt: "Tell me about Kashmiri Mogra Saffron and how it works with Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin)",
        category: 'closely_related_ingredient',
      },
      {
        id: "turmeric_curcumin_pair_1",
        label: "Synergy: Sea Buckthorn (Story 01)",
        prompt: "Tell me about Sea Buckthorn (Story 01) and how it works with Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin)",
        category: 'closely_related_ingredient',
      },
      {
        id: "turmeric_curcumin_ritual_steps",
        label: "6-Step Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin)",
        category: 'usage_and_timing',
      },
      {
        id: "turmeric_curcumin_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "neem_distillate",
    indexNumber: 17,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 17",
    isHeroStory: false,
    name: "Cold-Distilled Neem Leaf",
    fullTitle: "De-Bittered Azadirachta Indica Leaf Quercetin & Nimbidin Distillate",
    latinBinomial: "Azadirachta indica A. Juss.",
    inciName: "Melia Azadirachta Leaf Extract & Aqua Distillate",
    category: "Ayurvedic Botanical \u00b7 Microbiome Clarifier",
    noteFamily: "Nimba Leaf \u00b7 Clarifying Limonoid",
    tagline: "Purified, odor-refined Neem leaf distillate that clears stubborn congestion while respecting your skin barrier.",
    shortSummary: "Rather than heavy, pungent cold-pressed neem seed oil (which has a strong garlic-sulfur odor), Bhumivera uses fresh green Neem leaf hydro-distillate standardized for Nimbidin and Quercetin\u2014delivering crisp, odor-clean antibacterial clarity.",
    originRegion: "Organic Neem Groves of Madhya Pradesh & Gujarat, India",
    harvestSeason: "April \u2013 May Fresh Spring Leaf Flush",
    extractionMethod: "Low-Temperature Vacuum Hydro-Distillation (Sulfur-Free Leaf Fraction)",
    concentrationInFormula: "1.50% Clarifying Leaf Distillate",
    optimalPhRange: "5.0 \u2013 5.8",
    solubility: "Hydrophilic Botanical Distillate",
    molecularWeightProfile: "302.24 Da (Quercetin) to 454.5 Da (Nimbolide)",
    ayurvedicDoshaAffinity: "Kapha & Pitta Purifier \u2014 Classic Nimba clarification for congested, breakout-prone skin",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion",
    primaryClinicalBenefit: "Odor-clean antibacterial & anti-Malassezia pore clarification without dryness",
    sensoryProfile: {
      color: "Clear Pale Meadow Green",
      aroma: "Clean, crisp green leaf (100% free of pungent neem-seed sulfur odor)",
      skinFeel: "Refreshing, purifying, and zero-oil",
    },
    bioactiveCompounds: [
      {
        compound: "Nimbidin & Nimbin Tetranortriterpenoids",
        concentration: "1.8% Leaf Limonoid Fraction",
        role: "Selective Antibacterial & Sebum Clarifier",
        biochemicalTarget: "Inhibits C. acnes and Staphylococcus aureus colonization inside congested follicles.",
      },
      {
        compound: "Neem Leaf Quercetin & Rutin",
        concentration: "3.2% Bio-Flavonoids",
        role: "Histamine & Redness Calmer",
        biochemicalTarget: "Soothes itching, heat rash, and inflammatory papules.",
      },
      {
        compound: "Gedunin & Mahmoodin",
        concentration: "0.6% Clarifying Limonoids",
        role: "Fungal & Microbiome Balancer",
        biochemicalTarget: "Helps prevent Malassezia (fungal acne) forehead bumps in humid monsoon weather.",
      },
      {
        compound: "Gallic Acid & Epicatechin",
        concentration: "1.4% Polyphenols",
        role: "Pore-Toning Antioxidant",
        biochemicalTarget: "Tightens pore ostia and prevents post-blemish hyperpigmentation.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Cold-Distilled Neem Leaf)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Cold-Distilled Neem Leaf (Melia Azadirachta Leaf Extract & Aqua Distillate) partitions across Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion at pH 5.0 \u2013 5.8, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate refreshing, purifying, and zero-oil with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (302.24 Da (Quercetin) to 454.5 Da (Nimbolide))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Nimbidin & Nimbin Tetranortriterpenoids, bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver odor-clean antibacterial & anti-malassezia pore clarification without dryness.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Neem Leaf Quercetin & Rutin)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Soothes itching, heat rash, and inflammatory papules.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Gedunin & Mahmoodin)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Helps prevent Malassezia (fungal acne) forehead bumps in humid monsoon weather.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Gallic Acid & Epicatechin)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Tightens pore ostia and prevents post-blemish hyperpigmentation.",
        visibleOutcome: "Lasting improvement in Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Cold-Distilled Neem Leaf Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Kapha & Pitta Purifier \u2014 Classic Nimba clarification for congested, breakout-prone skin while compounding synergy with Sacred Tulsi (Story 03) and Activated Bamboo Charcoal (Story 02).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion for Cold-Distilled Neem Leaf absorption.",
        proTip: "Cold-Distilled Neem Leaf maintains peak stability at pH 5.0 \u2013 5.8; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.50% Clarifying Leaf Distillate)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Cold-Distilled Neem Leaf-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Cold-Distilled Neem Leaf and Sacred Tulsi (Story 03) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the hydrophilic botanical distillate matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Forehead fungal/monsoon bumps, jawli",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion.",
        proTip: "Use featherlight ring-finger pressure so Nimbidin & Nimbin Tetranortriterpenoids works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Nimbidin & Nimbin Tetranortriterpenoids and Neem Leaf Quercetin & Rutin bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Sacred Tulsi (Story 03) or Activated Bamboo Charcoal (Story 02) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Nimbidin & Nimbin Tetranortriterpenoids across the upper stratum corneum at pH 5.0 \u2013 5.8.",
        experience: "Skin feels refreshing, purifying, and zero-oil with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in odor-clean antibacterial & anti-malassezia pore clarification without dryness and reduced daily oxidative stress.",
        experience: "Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Neem Leaf Quercetin & Rutin and Gedunin & Mahmoodin.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Cold-Distilled Neem Leaf + Sacred Tulsi (Story 03).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports odor-clean antibacterial & anti-malassezia pore clarification without dryness while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 5.0 \u2013 5.8 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Nimbidin & Nimbin Tetranortriterpenoids and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "sacred_tulsi",
        partnerName: "Sacred Tulsi (Story 03)",
        synergyScore: "100/100",
        combinedBenefit: "The legendary Ayurvedic Neem + Tulsi clarifying partnership for blemish-free skin.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "activated_charcoal",
        partnerName: "Activated Bamboo Charcoal (Story 02)",
        synergyScore: "98/100",
        combinedBenefit: "Deep pollutant removal + microbial pore defense.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "aloe_vera",
        partnerName: "Pure Aloe Vera (Story 04)",
        synergyScore: "97/100",
        combinedBenefit: "Cushions Neem's clarifying power in 32% soothing hydration.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 5.0 \u2013 5.8. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Cold-Distilled Neem Leaf work inside Bhumivera formulations?",
        answer: "Rather than heavy, pungent cold-pressed neem seed oil (which has a strong garlic-sulfur odor), Bhumivera uses fresh green Neem leaf hydro-distillate standardized for Nimbidin and Quercetin\u2014delivering crisp, odor-clean antibacterial clarity. Its primary bioactive, Nimbidin & Nimbin Tetranortriterpenoids (1.8% Leaf Limonoid Fraction), targets Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion to deliver odor-clean antibacterial & anti-malassezia pore clarification without dryness.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Cold-Distilled Neem Leaf?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Cold-Distilled Neem Leaf?",
        answer: "Cold-Distilled Neem Leaf achieves peak clinical synergy when paired with Sacred Tulsi (Story 03) (100/100 synergy), Activated Bamboo Charcoal (Story 02) (98/100 synergy), and Pure Aloe Vera (Story 04) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "neem_distillate_pair_0",
        label: "Synergy: Sacred Tulsi (Story 03)",
        prompt: "Tell me about Sacred Tulsi (Story 03) and how it works with Cold-Distilled Neem Leaf",
        category: 'closely_related_ingredient',
      },
      {
        id: "neem_distillate_pair_1",
        label: "Synergy: Activated Bamboo Charcoal (Story 02)",
        prompt: "Tell me about Activated Bamboo Charcoal (Story 02) and how it works with Cold-Distilled Neem Leaf",
        category: 'closely_related_ingredient',
      },
      {
        id: "neem_distillate_ritual_steps",
        label: "6-Step Cold-Distilled Neem Leaf Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Cold-Distilled Neem Leaf",
        category: 'usage_and_timing',
      },
      {
        id: "neem_distillate_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "rosehip_retinoate",
    indexNumber: 18,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 18",
    isHeroStory: false,
    name: "Cold-Pressed Rosehip Seed Oil",
    fullTitle: "High-Altitude Himalayan Wild Rosehip (Rosa Moschata / Rosa Canina) Seed Oil",
    latinBinomial: "Rosa canina L. & Rosa moschata Herrm.",
    inciName: "Rosa Canina Fruit/Seed Oil",
    category: "Botanical Active \u00b7 Essential Fatty Acid & Scar Regenerator",
    noteFamily: "Wild Mountain Rosehip \u00b7 Omega 3-6 & Trans-Retinoic Precursor",
    tagline: "Cold-pressed mountain rosehip seed oil rich in linoleic acid, alpha-linolenic acid, and natural trans-retinoic precursors.",
    shortSummary: "Composed of over 75% essential polyunsaturated fatty acids (Linoleic Omega-6 and Alpha-Linolenic Omega-3) plus trace natural tretinoin precursors, Rosehip Seed Oil repairs acne-depleted sebum composition and remodels post-blemish marks.",
    originRegion: "Kullu & Kangra Valleys, Himachal Pradesh, India (2,000m\u20132,800m)",
    harvestSeason: "Late Autumn Post-Frost Rosehip Berry Harvest",
    extractionMethod: "Nitrogen-Blanketed Cold Expeller Press (<30\u00b0C)",
    concentrationInFormula: "1.00% Micro-Emulsified Dry-Touch Lipid Fraction",
    optimalPhRange: "4.8 \u2013 6.2",
    solubility: "Lipophilic Dry-Oil Micro-Emulsion",
    molecularWeightProfile: "278.4 Da (Alpha-Linolenic Acid) to 300.4 Da (All-Trans-Retinoic Derivative)",
    ayurvedicDoshaAffinity: "Vata & Pitta Rejuvenator \u2014 Nourishes thin barriers and fades scars",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 1,
    primaryFocusZone: "Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin",
    primaryClinicalBenefit: "Restores linoleic acid to sebum, fades post-blemish scars, and boosts barrier elasticity",
    sensoryProfile: {
      color: "Warm Sunset Rose-Gold",
      aroma: "Earthy, woody-fruity wild rosehip seed",
      skinFeel: "Weightless dry-oil glide that absorbs rapidly",
    },
    bioactiveCompounds: [
      {
        compound: "Linoleic Acid (Omega-6 Essential Fatty Acid)",
        concentration: "44% \u2013 48% of Oil",
        role: "Ceramide-1 (EOS) Structural Building Block",
        biochemicalTarget: "Acne-prone skin is clinically deficient in linoleic acid; replenishing it keeps sebum fluid and non-clogging.",
      },
      {
        compound: "Alpha-Linolenic Acid (Omega-3)",
        concentration: "32% \u2013 36% of Oil",
        role: "Anti-Inflammatory Eicosanoid Precursor",
        biochemicalTarget: "Calms epidermal redness and supports barrier permeability recovery.",
      },
      {
        compound: "Natural Trans-Retinoic Acid Precursors & Beta-Carotene",
        concentration: "Trace Bio-Retinoid Fraction",
        role: "Gentle Cellular Turnover Promoter",
        biochemicalTarget: "Stimulates epidermal renewal and collagen remodeling without synthetic retinoid peeling.",
      },
      {
        compound: "Lycopene & Rubixanthin Carotenoids",
        concentration: "Antioxidant Pigment Shield",
        role: "Photo-Damage Repair",
        biochemicalTarget: "Protects dermal fibroblasts from UVA oxidative cross-linking.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Cold-Pressed Rosehip Seed Oil)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Cold-Pressed Rosehip Seed Oil (Rosa Canina Fruit/Seed Oil) partitions across Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin at pH 4.8 \u2013 6.2, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate weightless dry-oil glide that absorbs rapidly with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (278.4 Da (Alpha-Linolenic Acid) to 300.4 Da (All-Trans-Retinoic Derivative))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Linoleic Acid (Omega-6 Essential Fatty Acid), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver restores linoleic acid to sebum, fades post-blemish scars, and boosts barrier elasticity.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Alpha-Linolenic Acid (Omega-3))",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Calms epidermal redness and supports barrier permeability recovery.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Natural Trans-Retinoic Acid Precursors & Beta-Carotene)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Stimulates epidermal renewal and collagen remodeling without synthetic retinoid peeling.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Lycopene & Rubixanthin Carotenoids)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Protects dermal fibroblasts from UVA oxidative cross-linking.",
        visibleOutcome: "Lasting improvement in Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Cold-Pressed Rosehip Seed Oil Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Vata & Pitta Rejuvenator \u2014 Nourishes thin barriers and fades scars while compounding synergy with Sea Buckthorn (Story 01) and Ayurvedic Bakuchiol.",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin for Cold-Pressed Rosehip Seed Oil absorption.",
        proTip: "Cold-Pressed Rosehip Seed Oil maintains peak stability at pH 4.8 \u2013 6.2; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.00% Micro-Emulsified Dry-Touch Lipid Fraction)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Cold-Pressed Rosehip Seed Oil-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Cold-Pressed Rosehip Seed Oil and Sea Buckthorn (Story 01) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the lipophilic dry-oil micro-emulsion matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Post-acne scars, pitted texture, fin",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin.",
        proTip: "Use featherlight ring-finger pressure so Linoleic Acid (Omega-6 Essential Fatty Acid) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Linoleic Acid (Omega-6 Essential Fatty Acid) and Alpha-Linolenic Acid (Omega-3) bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Sea Buckthorn (Story 01) or Ayurvedic Bakuchiol within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Linoleic Acid (Omega-6 Essential Fatty Acid) across the upper stratum corneum at pH 4.8 \u2013 6.2.",
        experience: "Skin feels weightless dry-oil glide that absorbs rapidly with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in restores linoleic acid to sebum, fades post-blemish scars, and boosts barrier elasticity and reduced daily oxidative stress.",
        experience: "Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Alpha-Linolenic Acid (Omega-3) and Natural Trans-Retinoic Acid Precursors & Beta-Carotene.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Cold-Pressed Rosehip Seed Oil + Sea Buckthorn (Story 01).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 1/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports restores linoleic acid to sebum, fades post-blemish scars, and boosts barrier elasticity while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.8 \u2013 6.2 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (1/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Linoleic Acid (Omega-6 Essential Fatty Acid) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "sea_buckthorn",
        partnerName: "Sea Buckthorn (Story 01)",
        synergyScore: "99/100",
        combinedBenefit: "Rosehip (Omega 3 & 6) + Sea Buckthorn (Omega 7 & 9) = Complete Omega 3-6-7-9 spectrum.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "bakuchiol_babchi",
        partnerName: "Ayurvedic Bakuchiol",
        synergyScore: "98/100",
        combinedBenefit: "Ultimate gentle phyto-retinoid renewal for texture and fine lines.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "vitamin_c_ethyl",
        partnerName: "Vitamin C (3-O-Ethyl Ascorbic Acid)",
        synergyScore: "97/100",
        combinedBenefit: "Synergistic scar and hyperpigmentation remodeling.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.8 \u2013 6.2. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Cold-Pressed Rosehip Seed Oil work inside Bhumivera formulations?",
        answer: "Composed of over 75% essential polyunsaturated fatty acids (Linoleic Omega-6 and Alpha-Linolenic Omega-3) plus trace natural tretinoin precursors, Rosehip Seed Oil repairs acne-depleted sebum composition and remodels post-blemish marks. Its primary bioactive, Linoleic Acid (Omega-6 Essential Fatty Acid) (44% \u2013 48% of Oil), targets Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin to deliver restores linoleic acid to sebum, fades post-blemish scars, and boosts barrier elasticity.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Cold-Pressed Rosehip Seed Oil?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Cold-Pressed Rosehip Seed Oil?",
        answer: "Cold-Pressed Rosehip Seed Oil achieves peak clinical synergy when paired with Sea Buckthorn (Story 01) (99/100 synergy), Ayurvedic Bakuchiol (98/100 synergy), and Vitamin C (3-O-Ethyl Ascorbic Acid) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "rosehip_retinoate_pair_0",
        label: "Synergy: Sea Buckthorn (Story 01)",
        prompt: "Tell me about Sea Buckthorn (Story 01) and how it works with Cold-Pressed Rosehip Seed Oil",
        category: 'closely_related_ingredient',
      },
      {
        id: "rosehip_retinoate_pair_1",
        label: "Synergy: Ayurvedic Bakuchiol",
        prompt: "Tell me about Ayurvedic Bakuchiol and how it works with Cold-Pressed Rosehip Seed Oil",
        category: 'closely_related_ingredient',
      },
      {
        id: "rosehip_retinoate_ritual_steps",
        label: "6-Step Cold-Pressed Rosehip Seed Oil Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Cold-Pressed Rosehip Seed Oil",
        category: 'usage_and_timing',
      },
      {
        id: "rosehip_retinoate_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "kashmiri_saffron",
    indexNumber: 19,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 19",
    isHeroStory: false,
    name: "Kashmiri Mogra Saffron (Kumkuma)",
    fullTitle: "GI-Tagged Pampore Kashmiri Crocus Sativus Stigma Extract (Crocin & Safranal)",
    latinBinomial: "Crocus sativus L.",
    inciName: "Crocus Sativus Flower/Stigma Extract",
    category: "Luxury Ayurvedic Botanical \u00b7 Royal Luminosity & Micro-Circulation",
    noteFamily: "Pampore Red Gold \u00b7 Crocin & Picrocrocin",
    tagline: "Hand-harvested Pampore crimson stigmas standardized for Crocin and Kaempferol to awaken unmistakable golden luminosity.",
    shortSummary: "It takes 150,000 hand-picked Crocus sativus flowers from the karewa highlands of Pampore, Kashmir to yield 1 kg of Mogra Saffron. Rich in water-soluble carotenoids (Crocin and Crocetin), it inhibits tyrosinase, boosts micro-circulation, and imparts a lit-from-within royal glow.",
    originRegion: "Pampore Karewa Highlands, Kashmir, India (1,600m)",
    harvestSeason: "Late October \u2013 Early November (2-Week Dawn Harvest)",
    extractionMethod: "Cold Hydro-Glycerin Ultrasonic Stigma Infusion",
    concentrationInFormula: "0.35% Standardized Crocin (>8%) Royal Extract",
    optimalPhRange: "5.0 \u2013 6.2",
    solubility: "Hydro-Amphiphilic Carotenoid Glycoside",
    molecularWeightProfile: "150.2 Da (Safranal) to 976.9 Da (Crocin)",
    ayurvedicDoshaAffinity: "Tridoshic Varnya Rasayana \u2014 The crown jewel of Ayurvedic complexion-illuminating herbs",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation",
    primaryClinicalBenefit: "Anti-glycation golden radiance, tyrosinase inhibition, and micro-circulation awakening",
    sensoryProfile: {
      color: "Luminous Imperial Gold",
      aroma: "Honeyed hay, warm floral saffron stigma, and royal apothecary spice",
      skinFeel: "Silky, warming micro-circulation glow",
    },
    bioactiveCompounds: [
      {
        compound: "Crocin & Crocetin (Water-Soluble Carotenoids)",
        concentration: "8.5% Standardized Content",
        role: "Anti-Glycation & Tyrosinase Inhibitor",
        biochemicalTarget: "Prevents sugar-induced collagen yellowing (AGEs) while inhibiting melanin overproduction.",
      },
      {
        compound: "Safranal",
        concentration: "2.1% Monoterpene Aldehyde",
        role: "Dermal Micro-Circulation & Oxygenation Booster",
        biochemicalTarget: "Enhances capillary nutrient delivery so fatigued, sallow skin looks rosy and awake.",
      },
      {
        compound: "Saffron Petal Kaempferol",
        concentration: "3.4% Flavonoid Fraction",
        role: "UV-B Photoprotective & MMP Blocker",
        biochemicalTarget: "Suppresses solar elastosis and protects epidermal stem cells.",
      },
      {
        compound: "Picrocrocin",
        concentration: "4.0% Monoterpene Glycoside",
        role: "Antioxidant & Cellular Longevity Signal",
        biochemicalTarget: "Scavenges superoxide radicals in stressed epidermal tissue.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Kashmiri Mogra Saffron (Kumkuma))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Kashmiri Mogra Saffron (Kumkuma) (Crocus Sativus Flower/Stigma Extract) partitions across Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation at pH 5.0 \u2013 6.2, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate silky, warming micro-circulation glow with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (150.2 Da (Safranal) to 976.9 Da (Crocin))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Crocin & Crocetin (Water-Soluble Carotenoids), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver anti-glycation golden radiance, tyrosinase inhibition, and micro-circulation awakening.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Safranal)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Enhances capillary nutrient delivery so fatigued, sallow skin looks rosy and awake.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Saffron Petal Kaempferol)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Suppresses solar elastosis and protects epidermal stem cells.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Picrocrocin)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Scavenges superoxide radicals in stressed epidermal tissue.",
        visibleOutcome: "Lasting improvement in Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Kashmiri Mogra Saffron (Kumkuma) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Tridoshic Varnya Rasayana \u2014 The crown jewel of Ayurvedic complexion-illuminating herbs while compounding synergy with Kasturi Turmeric Bio-Ferment and Sea Buckthorn (Story 01).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation for Kashmiri Mogra Saffron (Kumkuma) absorption.",
        proTip: "Kashmiri Mogra Saffron (Kumkuma) maintains peak stability at pH 5.0 \u2013 6.2; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (0.35% Standardized Crocin (>8%) Royal Extract)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Kashmiri Mogra Saffron (Kumkuma)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Kashmiri Mogra Saffron (Kumkuma) and Kasturi Turmeric Bio-Ferment into a silky micro-cushion.",
        proTip: "Pre-whipping activates the hydro-amphiphilic carotenoid glycoside matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Tired, sallow, dull skin, under-eye ",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation.",
        proTip: "Use featherlight ring-finger pressure so Crocin & Crocetin (Water-Soluble Carotenoids) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Crocin & Crocetin (Water-Soluble Carotenoids) and Safranal bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Kasturi Turmeric Bio-Ferment or Sea Buckthorn (Story 01) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Crocin & Crocetin (Water-Soluble Carotenoids) across the upper stratum corneum at pH 5.0 \u2013 6.2.",
        experience: "Skin feels silky, warming micro-circulation glow with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in anti-glycation golden radiance, tyrosinase inhibition, and micro-circulation awakening and reduced daily oxidative stress.",
        experience: "Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Safranal and Saffron Petal Kaempferol.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Kashmiri Mogra Saffron (Kumkuma) + Kasturi Turmeric Bio-Ferment.",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports anti-glycation golden radiance, tyrosinase inhibition, and micro-circulation awakening while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 5.0 \u2013 6.2 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Crocin & Crocetin (Water-Soluble Carotenoids) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "turmeric_curcumin",
        partnerName: "Kasturi Turmeric Bio-Ferment",
        synergyScore: "100/100",
        combinedBenefit: "The classical Ayurvedic Kumkuma + Haridra bridal glow synergy.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "sea_buckthorn",
        partnerName: "Sea Buckthorn (Story 01)",
        synergyScore: "99/100",
        combinedBenefit: "Water-soluble Crocin carotenoids + lipid-soluble Sea Buckthorn beta-carotene.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "mysore_sandalwood",
        partnerName: "Mysore Sandalwood Hydrosol",
        synergyScore: "98/100",
        combinedBenefit: "Warming saffron micro-circulation balanced by cooling sandalwood calm.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 5.0 \u2013 6.2. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Kashmiri Mogra Saffron (Kumkuma) work inside Bhumivera formulations?",
        answer: "It takes 150,000 hand-picked Crocus sativus flowers from the karewa highlands of Pampore, Kashmir to yield 1 kg of Mogra Saffron. Rich in water-soluble carotenoids (Crocin and Crocetin), it inhibits tyrosinase, boosts micro-circulation, and imparts a lit-from-within royal glow. Its primary bioactive, Crocin & Crocetin (Water-Soluble Carotenoids) (8.5% Standardized Content), targets Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation to deliver anti-glycation golden radiance, tyrosinase inhibition, and micro-circulation awakening.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Kashmiri Mogra Saffron (Kumkuma)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Kashmiri Mogra Saffron (Kumkuma)?",
        answer: "Kashmiri Mogra Saffron (Kumkuma) achieves peak clinical synergy when paired with Kasturi Turmeric Bio-Ferment (100/100 synergy), Sea Buckthorn (Story 01) (99/100 synergy), and Mysore Sandalwood Hydrosol (98/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "kashmiri_saffron_pair_0",
        label: "Synergy: Kasturi Turmeric Bio-Ferment",
        prompt: "Tell me about Kasturi Turmeric Bio-Ferment and how it works with Kashmiri Mogra Saffron (Kumkuma)",
        category: 'closely_related_ingredient',
      },
      {
        id: "kashmiri_saffron_pair_1",
        label: "Synergy: Sea Buckthorn (Story 01)",
        prompt: "Tell me about Sea Buckthorn (Story 01) and how it works with Kashmiri Mogra Saffron (Kumkuma)",
        category: 'closely_related_ingredient',
      },
      {
        id: "kashmiri_saffron_ritual_steps",
        label: "6-Step Kashmiri Mogra Saffron (Kumkuma) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Kashmiri Mogra Saffron (Kumkuma)",
        category: 'usage_and_timing',
      },
      {
        id: "kashmiri_saffron_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "ashwagandha_root",
    indexNumber: 20,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 20",
    isHeroStory: false,
    name: "Adaptogenic Ashwagandha Root",
    fullTitle: "Nagori Withania Somnifera Root Withanolide Adaptogen Complex",
    latinBinomial: "Withania somnifera (L.) Dunal",
    inciName: "Withania Somnifera Root Extract (Standardized 5% Withanolides)",
    category: "Ayurvedic Adaptogen \u00b7 Anti-Cortisol & Barrier Longevity",
    noteFamily: "Rasayana Root \u00b7 Withanolide Stress Shield",
    tagline: "Standardized Nagori Ashwagandha root that shields skin cells from sleep-deprivation cortisol and digital blue-light fatigue.",
    shortSummary: "Modern lifestyles expose skin to chronic cortisol spikes from late nights and screen exposure, which thin the epidermis and break down collagen. Ashwagandha's Withanolides block local cortisol activation and boost cellular ATP energy.",
    originRegion: "Nagaur Arid Belt, Rajasthan & Madhya Pradesh, India",
    harvestSeason: "January \u2013 March (180-Day Mature Root Harvest)",
    extractionMethod: "Green Aqueous-Glycerin Root Extraction (Solvent-Free)",
    concentrationInFormula: "1.00% Standardized Withanolide Extract",
    optimalPhRange: "4.8 \u2013 6.2",
    solubility: "Amphiphilic Phyto-Glycoside Complex",
    molecularWeightProfile: "470.6 Da (Withaferin A & Withanolide D)",
    ayurvedicDoshaAffinity: "Vata & Kapha Rasayana \u2014 Strengthens fatigued, thin, stress-aged skin",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones",
    primaryClinicalBenefit: "Blocks cortisol skin thinning, fights sleep-deprivation dullness, and shields against blue light",
    sensoryProfile: {
      color: "Warm Amber-Cream",
      aroma: "Grounded earthy root note",
      skinFeel: "Restorative, firming, and comforting",
    },
    bioactiveCompounds: [
      {
        compound: "Withanolide A, D & Withaferin A",
        concentration: "5.0% Standardized Withanolides",
        role: "Cutaneous Cortisol (11\u03b2-HSD1) Blocker",
        biochemicalTarget: "Prevents stress hormone cortisol from degrading dermal collagen and delaying barrier recovery.",
      },
      {
        compound: "Sitoindosides VII\u2013X (Glycowithanolides)",
        concentration: "2.8% Adaptogenic Glycosides",
        role: "Mitochondrial ATP & Catalase Booster",
        biochemicalTarget: "Increases cellular energy and endogenous antioxidant enzymes in sleep-deprived skin.",
      },
      {
        compound: "Ferulic & Caffeic Phenolic Acids",
        concentration: "1.6% Root Polyphenols",
        role: "HEV Blue-Light & Pollution Shield",
        biochemicalTarget: "Neutralizes oxidative stress from computer/phone screens and city smog.",
      },
      {
        compound: "Root Amino-Polysaccharides",
        concentration: "12% Hydrating Fraction",
        role: "Dermal Matrix Plumper",
        biochemicalTarget: "Supports hyaluronic acid retention and skin firmness.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Adaptogenic Ashwagandha Root)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Adaptogenic Ashwagandha Root (Withania Somnifera Root Extract (Standardized 5% Withanolides)) partitions across Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones at pH 4.8 \u2013 6.2, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate restorative, firming, and comforting with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (470.6 Da (Withaferin A & Withanolide D))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Withanolide A, D & Withaferin A, bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver blocks cortisol skin thinning, fights sleep-deprivation dullness, and shields against blue light.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Sitoindosides VII\u2013X (Glycowithanolides))",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Increases cellular energy and endogenous antioxidant enzymes in sleep-deprived skin.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Ferulic & Caffeic Phenolic Acids)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Neutralizes oxidative stress from computer/phone screens and city smog.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Root Amino-Polysaccharides)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Supports hyaluronic acid retention and skin firmness.",
        visibleOutcome: "Lasting improvement in Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Adaptogenic Ashwagandha Root Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Vata & Kapha Rasayana \u2014 Strengthens fatigued, thin, stress-aged skin while compounding synergy with Sacred Tulsi (Story 03) and Niacinamide (Vitamin B3).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones for Adaptogenic Ashwagandha Root absorption.",
        proTip: "Adaptogenic Ashwagandha Root maintains peak stability at pH 4.8 \u2013 6.2; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.00% Standardized Withanolide Extract)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Adaptogenic Ashwagandha Root-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Adaptogenic Ashwagandha Root and Sacred Tulsi (Story 03) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the amphiphilic phyto-glycoside complex matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Stress-fatigued cheeks, under-eye pe",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones.",
        proTip: "Use featherlight ring-finger pressure so Withanolide A, D & Withaferin A works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Withanolide A, D & Withaferin A and Sitoindosides VII\u2013X (Glycowithanolides) bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Sacred Tulsi (Story 03) or Niacinamide (Vitamin B3) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Withanolide A, D & Withaferin A across the upper stratum corneum at pH 4.8 \u2013 6.2.",
        experience: "Skin feels restorative, firming, and comforting with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in blocks cortisol skin thinning, fights sleep-deprivation dullness, and shields against blue light and reduced daily oxidative stress.",
        experience: "Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Sitoindosides VII\u2013X (Glycowithanolides) and Ferulic & Caffeic Phenolic Acids.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Adaptogenic Ashwagandha Root + Sacred Tulsi (Story 03).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports blocks cortisol skin thinning, fights sleep-deprivation dullness, and shields against blue light while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.8 \u2013 6.2 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Withanolide A, D & Withaferin A and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "sacred_tulsi",
        partnerName: "Sacred Tulsi (Story 03)",
        synergyScore: "99/100",
        combinedBenefit: "Dual Ayurvedic adaptogen shield (Tulsi + Ashwagandha) against stress breakouts and aging.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "niacinamide",
        partnerName: "Niacinamide (Vitamin B3)",
        synergyScore: "98/100",
        combinedBenefit: "Restores NAD+ and ATP cellular energy in tired skin.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "ceramide_complex",
        partnerName: "Ceramide NP / AP / EOP Complex",
        synergyScore: "97/100",
        combinedBenefit: "Rebuilds cortisol-thinned stratum corneum barriers.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.8 \u2013 6.2. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Adaptogenic Ashwagandha Root work inside Bhumivera formulations?",
        answer: "Modern lifestyles expose skin to chronic cortisol spikes from late nights and screen exposure, which thin the epidermis and break down collagen. Ashwagandha's Withanolides block local cortisol activation and boost cellular ATP energy. Its primary bioactive, Withanolide A, D & Withaferin A (5.0% Standardized Withanolides), targets Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones to deliver blocks cortisol skin thinning, fights sleep-deprivation dullness, and shields against blue light.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Adaptogenic Ashwagandha Root?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Adaptogenic Ashwagandha Root?",
        answer: "Adaptogenic Ashwagandha Root achieves peak clinical synergy when paired with Sacred Tulsi (Story 03) (99/100 synergy), Niacinamide (Vitamin B3) (98/100 synergy), and Ceramide NP / AP / EOP Complex (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "ashwagandha_root_pair_0",
        label: "Synergy: Sacred Tulsi (Story 03)",
        prompt: "Tell me about Sacred Tulsi (Story 03) and how it works with Adaptogenic Ashwagandha Root",
        category: 'closely_related_ingredient',
      },
      {
        id: "ashwagandha_root_pair_1",
        label: "Synergy: Niacinamide (Vitamin B3)",
        prompt: "Tell me about Niacinamide (Vitamin B3) and how it works with Adaptogenic Ashwagandha Root",
        category: 'closely_related_ingredient',
      },
      {
        id: "ashwagandha_root_ritual_steps",
        label: "6-Step Adaptogenic Ashwagandha Root Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Adaptogenic Ashwagandha Root",
        category: 'usage_and_timing',
      },
      {
        id: "ashwagandha_root_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "olive_squalane",
    indexNumber: 21,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 21",
    isHeroStory: false,
    name: "Biomimetic Plant Squalane",
    fullTitle: "Hydrogenated Bio-Fermented & Olive-Derived Saturated Squalane",
    latinBinomial: "2,6,10,15,19,23-Hexamethyltetracosane (C30H62)",
    inciName: "Squalane (100% Plant-Derived Saturated Hydrocarbon)",
    category: "Contemporary Active \u00b7 Biomimetic Sebum Emollient",
    noteFamily: "Skin-Identical Lipid \u00b7 Weightless Moisture Seal",
    tagline: "100% saturated, oxidation-proof biomimetic lipid identical to human sebum's natural moisture seal.",
    shortSummary: "Human sebum naturally contains 12% squalene, which keeps youth skin supple\u2014but raw squalene has double bonds that oxidize into pore-clogging peroxides. Hydrogenated Plant Squalane removes those double bonds, creating a weightless, 100% non-oxidizing, non-comedogenic moisture seal.",
    originRegion: "Sustainable Sugarcane & Mediterranean Olive Phytosterol Fermentation",
    harvestSeason: "Year-Round",
    extractionMethod: "Complete Catalytic Hydrogenation + Fractional Molecular Distillation",
    concentrationInFormula: "1.50% Weightless Biomimetic Lipid Cushion",
    optimalPhRange: "4.0 \u2013 8.0",
    solubility: "Lipophilic Ultra-Light Emollient",
    molecularWeightProfile: "422.81 Da (Skin-Identical C30 Branched Alkane)",
    ayurvedicDoshaAffinity: "Vata & Pitta Lipid Replenisher \u2014 Weightless Sneha (oleation) without Kapha heaviness",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Dry patches, under-eye contour, neck, and post-cleanse moisture sealing",
    primaryClinicalBenefit: "Oxidation-proof biomimetic moisture seal that is 100% non-comedogenic and fungal-acne safe",
    sensoryProfile: {
      color: "Crystal Clear, Water-Light Oil",
      aroma: "Completely Odorless",
      skinFeel: "Weightless silk that vanishes into the skin in seconds with zero grease",
    },
    bioactiveCompounds: [
      {
        compound: "Fully Saturated C30H62 Branched Alkane",
        concentration: "99.9% Purity",
        role: "Zero-Oxidation Sebum Mimic",
        biochemicalTarget: "Because it has zero carbon-carbon double bonds, it cannot undergo lipid peroxidation or turn comedogenic.",
      },
      {
        compound: "Intercellular Bilayer Spacer",
        concentration: "Biomimetic Emollient",
        role: "Corneocyte Flexibility Restorer",
        biochemicalTarget: "Fills microscopic gaps between rough surface corneocytes for instant satin smoothness.",
      },
      {
        compound: "Lipophilic Active Penetration Enhancer",
        concentration: "Carrier Vehicle",
        role: "Carotenoid & Ceramide Transporter",
        biochemicalTarget: "Helps transport Sea Buckthorn carotenoids, Vitamin E, and Bakuchiol deeper into the stratum corneum.",
      },
      {
        compound: "Microbiome-Inert Hydrocarbon Chain",
        concentration: "Malassezia-Safe Lipid",
        role: "Fungal-Acne Safe Emollient",
        biochemicalTarget: "Contains zero C12\u2013C24 esterified fatty acids, making it unable to feed Malassezia yeast.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Biomimetic Plant Squalane)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Biomimetic Plant Squalane (Squalane (100% Plant-Derived Saturated Hydrocarbon)) partitions across Dry patches, under-eye contour, neck, and post-cleanse moisture sealing at pH 4.0 \u2013 8.0, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate weightless silk that vanishes into the skin in seconds with zero grease with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (422.81 Da (Skin-Identical C30 Branched Alkane))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Fully Saturated C30H62 Branched Alkane, bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver oxidation-proof biomimetic moisture seal that is 100% non-comedogenic and fungal-acne safe.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Intercellular Bilayer Spacer)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Fills microscopic gaps between rough surface corneocytes for instant satin smoothness.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Lipophilic Active Penetration Enhancer)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Helps transport Sea Buckthorn carotenoids, Vitamin E, and Bakuchiol deeper into the stratum corneum.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Microbiome-Inert Hydrocarbon Chain)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Contains zero C12\u2013C24 esterified fatty acids, making it unable to feed Malassezia yeast.",
        visibleOutcome: "Lasting improvement in Dry patches, under-eye contour, neck, and post-cleanse moisture sealing clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Biomimetic Plant Squalane Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Vata & Pitta Lipid Replenisher \u2014 Weightless Sneha (oleation) without Kapha heaviness while compounding synergy with Sea Buckthorn (Story 01) and Ceramide NP / AP / EOP Complex.",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Dry patches, under-eye contour, neck, and post-cleanse moisture sealing for Biomimetic Plant Squalane absorption.",
        proTip: "Biomimetic Plant Squalane maintains peak stability at pH 4.0 \u2013 8.0; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.50% Weightless Biomimetic Lipid Cushion)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Biomimetic Plant Squalane-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Biomimetic Plant Squalane and Sea Buckthorn (Story 01) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the lipophilic ultra-light emollient matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Dry patches, under-eye contour, neck",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Dry patches, under-eye contour, neck, and post-cleanse moisture sealing.",
        proTip: "Use featherlight ring-finger pressure so Fully Saturated C30H62 Branched Alkane works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Fully Saturated C30H62 Branched Alkane and Intercellular Bilayer Spacer bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Sea Buckthorn (Story 01) or Ceramide NP / AP / EOP Complex within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Fully Saturated C30H62 Branched Alkane across the upper stratum corneum at pH 4.0 \u2013 8.0.",
        experience: "Skin feels weightless silk that vanishes into the skin in seconds with zero grease with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in oxidation-proof biomimetic moisture seal that is 100% non-comedogenic and fungal-acne safe and reduced daily oxidative stress.",
        experience: "Dry patches, under-eye contour, neck, and post-cleanse moisture sealing appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Intercellular Bilayer Spacer and Lipophilic Active Penetration Enhancer.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Biomimetic Plant Squalane + Sea Buckthorn (Story 01).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports oxidation-proof biomimetic moisture seal that is 100% non-comedogenic and fungal-acne safe while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Dry patches, under-eye contour, neck, and post-cleanse moisture sealing.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.0 \u2013 8.0 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Fully Saturated C30H62 Branched Alkane and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "sea_buckthorn",
        partnerName: "Sea Buckthorn (Story 01)",
        synergyScore: "99/100",
        combinedBenefit: "Squalane carries Sea Buckthorn's Omega-7 and carotenoids smoothly across the skin.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "ceramide_complex",
        partnerName: "Ceramide NP / AP / EOP Complex",
        synergyScore: "99/100",
        combinedBenefit: "Reconstructs the complete hydrolipidic barrier film.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "hyaluronic_acid",
        partnerName: "Multi-Molecular Hyaluronic Acid",
        synergyScore: "98/100",
        combinedBenefit: "HA draws water in; Squalane seals it inside without clogging pores.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.0 \u2013 8.0. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Biomimetic Plant Squalane work inside Bhumivera formulations?",
        answer: "Human sebum naturally contains 12% squalene, which keeps youth skin supple\u2014but raw squalene has double bonds that oxidize into pore-clogging peroxides. Hydrogenated Plant Squalane removes those double bonds, creating a weightless, 100% non-oxidizing, non-comedogenic moisture seal. Its primary bioactive, Fully Saturated C30H62 Branched Alkane (99.9% Purity), targets Dry patches, under-eye contour, neck, and post-cleanse moisture sealing to deliver oxidation-proof biomimetic moisture seal that is 100% non-comedogenic and fungal-acne safe.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Biomimetic Plant Squalane?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Biomimetic Plant Squalane?",
        answer: "Biomimetic Plant Squalane achieves peak clinical synergy when paired with Sea Buckthorn (Story 01) (99/100 synergy), Ceramide NP / AP / EOP Complex (99/100 synergy), and Multi-Molecular Hyaluronic Acid (98/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "olive_squalane_pair_0",
        label: "Synergy: Sea Buckthorn (Story 01)",
        prompt: "Tell me about Sea Buckthorn (Story 01) and how it works with Biomimetic Plant Squalane",
        category: 'closely_related_ingredient',
      },
      {
        id: "olive_squalane_pair_1",
        label: "Synergy: Ceramide NP / AP / EOP Complex",
        prompt: "Tell me about Ceramide NP / AP / EOP Complex and how it works with Biomimetic Plant Squalane",
        category: 'closely_related_ingredient',
      },
      {
        id: "olive_squalane_ritual_steps",
        label: "6-Step Biomimetic Plant Squalane Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Biomimetic Plant Squalane",
        category: 'usage_and_timing',
      },
      {
        id: "olive_squalane_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "ceramide_complex",
    indexNumber: 22,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 22",
    isHeroStory: false,
    name: "Ceramide NP / AP / EOP Complex",
    fullTitle: "Multi-Lamellar Skin-Identical Ceramide NP, AP, EOP + Phytosphingosine + Cholesterol (3:1:1 Ratio)",
    latinBinomial: "Bio-Fermented Human-Identical Sphingolipids",
    inciName: "Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine & Cholesterol",
    category: "Contemporary Active \u00b7 Lamellar Mortar Architect",
    noteFamily: "Brick-and-Mortar Lipid \u00b7 3:1:1 Golden Ratio",
    tagline: "Stereochemically skin-identical Ceramides formulated in the physiological 3:1:1 molar ratio to cement the epidermal barrier.",
    shortSummary: "Ceramides make up 50% of the lipid mortar between your skin cells. Bhumivera uses bio-fermented Ceramides NP, AP, and EOP paired with Cholesterol and Free Fatty Acids in the physiological 3:1:1 ratio to repair leaky barriers.",
    originRegion: "Yeast Bio-Fermentation (Pichia ciferrii) & Plant Sterols",
    harvestSeason: "Year-Round",
    extractionMethod: "Multi-Lamellar Liquid Crystal Vesicle Encapsulation",
    concentrationInFormula: "1.00% Multi-Lamellar Ceramide Delivery System",
    optimalPhRange: "4.8 \u2013 6.0",
    solubility: "Liquid-Crystalline Amphiphilic Emulsion",
    molecularWeightProfile: "565.9 Da (Ceramide NP) to 1,034 Da (Ceramide EOP)",
    ayurvedicDoshaAffinity: "Vata & Pitta Barrier Shield \u2014 Rebuilds depleted Ojas and structural resilience",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers",
    primaryClinicalBenefit: "Directly replaces lost intercellular mortar in the physiological 3:1:1 barrier ratio",
    sensoryProfile: {
      color: "Milky Opalescent Liquid Crystal Emulsion",
      aroma: "Odorless",
      skinFeel: "Cocooning, second-skin velvet shield",
    },
    bioactiveCompounds: [
      {
        compound: "Ceramide NP (Ceramide 3)",
        concentration: "45% of Sphingolipid Blend",
        role: "Primary Water-Retention Mortar",
        biochemicalTarget: "Forms tight hydrogen-bonded networks in the stratum corneum to halt Transepidermal Water Loss (TEWL).",
      },
      {
        compound: "Ceramide EOP (Ceramide 1 \u2014 Omega-Esterified)",
        concentration: "20% of Sphingolipid Blend",
        role: "Long-Chain Lamellar Rivet",
        biochemicalTarget: "Spans adjacent lipid bilayers like molecular rivets, locking the barrier structure together.",
      },
      {
        compound: "Ceramide AP (Ceramide 6-II)",
        concentration: "20% of Sphingolipid Blend",
        role: "Alpha-Hydroxy Barrier Smoother",
        biochemicalTarget: "Maintains regular corneocyte cohesion while keeping surface texture supple.",
      },
      {
        compound: "Phytosphingosine & Plant Cholesterol",
        concentration: "15% Antimicrobial & Molar Cofactor",
        role: "Endogenous Ceramide Precursor & C. acnes Inhibitor",
        biochemicalTarget: "Phytosphingosine acts as both a natural antimicrobial against acne bacteria and a raw building block for new ceramides.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Ceramide NP / AP / EOP Complex)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Ceramide NP / AP / EOP Complex (Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine & Cholesterol) partitions across Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers at pH 4.8 \u2013 6.0, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate cocooning, second-skin velvet shield with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (565.9 Da (Ceramide NP) to 1,034 Da (Ceramide EOP))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Ceramide NP (Ceramide 3), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver directly replaces lost intercellular mortar in the physiological 3:1:1 barrier ratio.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Ceramide EOP (Ceramide 1 \u2014 Omega-Esterified))",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Spans adjacent lipid bilayers like molecular rivets, locking the barrier structure together.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Ceramide AP (Ceramide 6-II))",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Maintains regular corneocyte cohesion while keeping surface texture supple.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Phytosphingosine & Plant Cholesterol)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Phytosphingosine acts as both a natural antimicrobial against acne bacteria and a raw building block for new ceramides.",
        visibleOutcome: "Lasting improvement in Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Ceramide NP / AP / EOP Complex Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Vata & Pitta Barrier Shield \u2014 Rebuilds depleted Ojas and structural resilience while compounding synergy with Niacinamide (Vitamin B3) and Sea Buckthorn (Story 01).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers for Ceramide NP / AP / EOP Complex absorption.",
        proTip: "Ceramide NP / AP / EOP Complex maintains peak stability at pH 4.8 \u2013 6.0; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.00% Multi-Lamellar Ceramide Delivery System)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Ceramide NP / AP / EOP Complex-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Ceramide NP / AP / EOP Complex and Niacinamide (Vitamin B3) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the liquid-crystalline amphiphilic emulsion matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Over-exfoliated skin, winter dryness",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers.",
        proTip: "Use featherlight ring-finger pressure so Ceramide NP (Ceramide 3) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Ceramide NP (Ceramide 3) and Ceramide EOP (Ceramide 1 \u2014 Omega-Esterified) bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Niacinamide (Vitamin B3) or Sea Buckthorn (Story 01) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Ceramide NP (Ceramide 3) across the upper stratum corneum at pH 4.8 \u2013 6.0.",
        experience: "Skin feels cocooning, second-skin velvet shield with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in directly replaces lost intercellular mortar in the physiological 3:1:1 barrier ratio and reduced daily oxidative stress.",
        experience: "Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Ceramide EOP (Ceramide 1 \u2014 Omega-Esterified) and Ceramide AP (Ceramide 6-II).",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Ceramide NP / AP / EOP Complex + Niacinamide (Vitamin B3).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports directly replaces lost intercellular mortar in the physiological 3:1:1 barrier ratio while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.8 \u2013 6.0 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Ceramide NP (Ceramide 3) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "niacinamide",
        partnerName: "Niacinamide (Vitamin B3)",
        synergyScore: "100/100",
        combinedBenefit: "Exogenous Ceramides replenish immediately while Niacinamide stimulates endogenous ceramide synthesis.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "sea_buckthorn",
        partnerName: "Sea Buckthorn (Story 01)",
        synergyScore: "99/100",
        combinedBenefit: "Supplies the essential fatty acid tail needed for Ceramide EOP assembly.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "panthenol",
        partnerName: "D-Panthenol (Pro-Vitamin B5)",
        synergyScore: "98/100",
        combinedBenefit: "Rapid rescue for compromised, stinging, or peeling barriers.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.8 \u2013 6.0. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Ceramide NP / AP / EOP Complex work inside Bhumivera formulations?",
        answer: "Ceramides make up 50% of the lipid mortar between your skin cells. Bhumivera uses bio-fermented Ceramides NP, AP, and EOP paired with Cholesterol and Free Fatty Acids in the physiological 3:1:1 ratio to repair leaky barriers. Its primary bioactive, Ceramide NP (Ceramide 3) (45% of Sphingolipid Blend), targets Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers to deliver directly replaces lost intercellular mortar in the physiological 3:1:1 barrier ratio.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Ceramide NP / AP / EOP Complex?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Ceramide NP / AP / EOP Complex?",
        answer: "Ceramide NP / AP / EOP Complex achieves peak clinical synergy when paired with Niacinamide (Vitamin B3) (100/100 synergy), Sea Buckthorn (Story 01) (99/100 synergy), and D-Panthenol (Pro-Vitamin B5) (98/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "ceramide_complex_pair_0",
        label: "Synergy: Niacinamide (Vitamin B3)",
        prompt: "Tell me about Niacinamide (Vitamin B3) and how it works with Ceramide NP / AP / EOP Complex",
        category: 'closely_related_ingredient',
      },
      {
        id: "ceramide_complex_pair_1",
        label: "Synergy: Sea Buckthorn (Story 01)",
        prompt: "Tell me about Sea Buckthorn (Story 01) and how it works with Ceramide NP / AP / EOP Complex",
        category: 'closely_related_ingredient',
      },
      {
        id: "ceramide_complex_ritual_steps",
        label: "6-Step Ceramide NP / AP / EOP Complex Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Ceramide NP / AP / EOP Complex",
        category: 'usage_and_timing',
      },
      {
        id: "ceramide_complex_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "zinc_pca",
    indexNumber: 23,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 23",
    isHeroStory: false,
    name: "Bio-Chelated Zinc PCA",
    fullTitle: "Zinc Pyrrolidone Carboxylate (Sebum-Regulating NMF Salt)",
    latinBinomial: "Zinc L-Pidolate (C10H12N2O6Zn)",
    inciName: "Zinc PCA",
    category: "Contemporary Active \u00b7 5-Alpha-Reductase & Sebum Controller",
    noteFamily: "Mineral NMF Chelate \u00b7 Non-Drying Oil Control",
    tagline: "Bio-available Zinc chelated with Pyrrolidone Carboxylic Acid (PCA)\u2014controlling excess oil while hydrating the skin.",
    shortSummary: "Inorganic zinc oxide can feel chalky and drying. By chelating ionic Zinc with L-PCA (a major component of human Natural Moisturizing Factor), Zinc PCA becomes 100% water-soluble\u2014inhibiting the 5-alpha-reductase enzyme that drives oily skin while actively hydrating corneocytes.",
    originRegion: "Plant-Derived L-Glutamic Acid Cyclization + Pharmaceutical Zinc Chelation",
    harvestSeason: "Year-Round",
    extractionMethod: "Bio-Chelation Crystallization",
    concentrationInFormula: "0.75% \u2013 1.00% Sebum-Normalizing Dose",
    optimalPhRange: "4.8 \u2013 6.0",
    solubility: "100% Water-Soluble Ionic Chelate",
    molecularWeightProfile: "321.60 Da (High Follicular Bio-Availability)",
    ayurvedicDoshaAffinity: "Kapha & Pitta Balancer \u2014 Controls Kapha oiliness without aggravating Vata dryness",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores",
    primaryClinicalBenefit: "Inhibits 5-alpha-reductase hormonal oiliness and C. acnes lipases while hydrating via L-PCA",
    sensoryProfile: {
      color: "Crystal Clear Solution",
      aroma: "Odorless",
      skinFeel: "Fresh, matte-satin, hydrated finish",
    },
    bioactiveCompounds: [
      {
        compound: "Bio-Available Ionic Zinc (Zn2+)",
        concentration: "20% Elemental Zinc Content",
        role: "5-Alpha-Reductase Inhibitor",
        biochemicalTarget: "Blocks the conversion of testosterone into dihydrotestosterone (DHT) inside sebocytes, cutting hormonal oil spikes.",
      },
      {
        compound: "L-Pyrrolidone Carboxylic Acid (L-PCA)",
        concentration: "80% Physiological NMF Carrier",
        role: "Endogenous Humectant Carrier",
        biochemicalTarget: "Comprises 12% of the skin's own Natural Moisturizing Factor, ensuring oil control never dehydrates the barrier.",
      },
      {
        compound: "Cutibacterium acnes Lipase Blocker",
        concentration: "Antimicrobial Action",
        role: "Free Fatty Acid Irritation Preventer",
        biochemicalTarget: "Inhibits bacterial lipases from splitting triglycerides into irritating free fatty acids.",
      },
      {
        compound: "AP-1 & Collagenase Suppressor",
        concentration: "Dermal Zinc Cofactor",
        role: "Blemish Healing Accelerator",
        biochemicalTarget: "Supports zinc-dependent matrix remodeling so blemishes heal cleanly.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Bio-Chelated Zinc PCA)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Bio-Chelated Zinc PCA (Zinc PCA) partitions across Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores at pH 4.8 \u2013 6.0, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate fresh, matte-satin, hydrated finish with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (321.60 Da (High Follicular Bio-Availability))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Bio-Available Ionic Zinc (Zn2+), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver inhibits 5-alpha-reductase hormonal oiliness and c. acnes lipases while hydrating via l-pca.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (L-Pyrrolidone Carboxylic Acid (L-PCA))",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Comprises 12% of the skin's own Natural Moisturizing Factor, ensuring oil control never dehydrates the barrier.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Cutibacterium acnes Lipase Blocker)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Inhibits bacterial lipases from splitting triglycerides into irritating free fatty acids.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (AP-1 & Collagenase Suppressor)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Supports zinc-dependent matrix remodeling so blemishes heal cleanly.",
        visibleOutcome: "Lasting improvement in Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Bio-Chelated Zinc PCA Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Kapha & Pitta Balancer \u2014 Controls Kapha oiliness without aggravating Vata dryness while compounding synergy with Niacinamide (Vitamin B3) and Sacred Tulsi (Story 03).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores for Bio-Chelated Zinc PCA absorption.",
        proTip: "Bio-Chelated Zinc PCA maintains peak stability at pH 4.8 \u2013 6.0; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (0.75% \u2013 1.00% Sebum-Normalizing Dose)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Bio-Chelated Zinc PCA-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Bio-Chelated Zinc PCA and Niacinamide (Vitamin B3) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the 100% water-soluble ionic chelate matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Oily forehead, shiny nose, hormonal ",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores.",
        proTip: "Use featherlight ring-finger pressure so Bio-Available Ionic Zinc (Zn2+) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Bio-Available Ionic Zinc (Zn2+) and L-Pyrrolidone Carboxylic Acid (L-PCA) bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Niacinamide (Vitamin B3) or Sacred Tulsi (Story 03) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Bio-Available Ionic Zinc (Zn2+) across the upper stratum corneum at pH 4.8 \u2013 6.0.",
        experience: "Skin feels fresh, matte-satin, hydrated finish with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in inhibits 5-alpha-reductase hormonal oiliness and c. acnes lipases while hydrating via l-pca and reduced daily oxidative stress.",
        experience: "Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by L-Pyrrolidone Carboxylic Acid (L-PCA) and Cutibacterium acnes Lipase Blocker.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Bio-Chelated Zinc PCA + Niacinamide (Vitamin B3).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports inhibits 5-alpha-reductase hormonal oiliness and c. acnes lipases while hydrating via l-pca while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.8 \u2013 6.0 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Bio-Available Ionic Zinc (Zn2+) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "niacinamide",
        partnerName: "Niacinamide (Vitamin B3)",
        synergyScore: "100/100",
        combinedBenefit: "The iconic Niacinamide + Zinc PCA duo for pore refinement and shine control.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "sacred_tulsi",
        partnerName: "Sacred Tulsi (Story 03)",
        synergyScore: "99/100",
        combinedBenefit: "Combines DHT oil control (Zinc) with cortisol stress-oil control (Tulsi).",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "salicylic_acid",
        partnerName: "Botanical Salicylic Acid (BHA)",
        synergyScore: "97/100",
        combinedBenefit: "Comprehensive pore clearing and sebum normalization.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.8 \u2013 6.0. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Bio-Chelated Zinc PCA work inside Bhumivera formulations?",
        answer: "Inorganic zinc oxide can feel chalky and drying. By chelating ionic Zinc with L-PCA (a major component of human Natural Moisturizing Factor), Zinc PCA becomes 100% water-soluble\u2014inhibiting the 5-alpha-reductase enzyme that drives oily skin while actively hydrating corneocytes. Its primary bioactive, Bio-Available Ionic Zinc (Zn2+) (20% Elemental Zinc Content), targets Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores to deliver inhibits 5-alpha-reductase hormonal oiliness and c. acnes lipases while hydrating via l-pca.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Bio-Chelated Zinc PCA?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Bio-Chelated Zinc PCA?",
        answer: "Bio-Chelated Zinc PCA achieves peak clinical synergy when paired with Niacinamide (Vitamin B3) (100/100 synergy), Sacred Tulsi (Story 03) (99/100 synergy), and Botanical Salicylic Acid (BHA) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "zinc_pca_pair_0",
        label: "Synergy: Niacinamide (Vitamin B3)",
        prompt: "Tell me about Niacinamide (Vitamin B3) and how it works with Bio-Chelated Zinc PCA",
        category: 'closely_related_ingredient',
      },
      {
        id: "zinc_pca_pair_1",
        label: "Synergy: Sacred Tulsi (Story 03)",
        prompt: "Tell me about Sacred Tulsi (Story 03) and how it works with Bio-Chelated Zinc PCA",
        category: 'closely_related_ingredient',
      },
      {
        id: "zinc_pca_ritual_steps",
        label: "6-Step Bio-Chelated Zinc PCA Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Bio-Chelated Zinc PCA",
        category: 'usage_and_timing',
      },
      {
        id: "zinc_pca_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "lactic_acid_aha",
    indexNumber: 24,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 24",
    isHeroStory: false,
    name: "Fermented Plant Lactic Acid (Gentle AHA)",
    fullTitle: "Chirally Pure L-(+)-Lactic Acid (NMF Hydrating Alpha-Hydroxy Acid)",
    latinBinomial: "(2S)-2-Hydroxypropanoic Acid (Plant Carbohydrate Ferment)",
    inciName: "Lactic Acid (Vegan Bio-Fermented L-Isomer)",
    category: "Contemporary Active \u00b7 Hydrating Surface Resurfacer & pH Buffer",
    noteFamily: "Physiological NMF Acid \u00b7 Gentle Corneocyte Polisher",
    tagline: "The gentlest, most hydrating Alpha-Hydroxy Acid\u2014naturally part of your skin's own acid mantle and NMF.",
    shortSummary: "Larger in molecular weight than glycolic acid (90 Da vs 76 Da) and an intrinsic component of human Natural Moisturizing Factor, vegan L-Lactic Acid calibrates our formulas to the ideal acid-mantle pH of 5.2 while gently polishing away dull surface cells and stimulating ceramide synthesis.",
    originRegion: "Vegan Beet & Cane Sugar Lactobacillus Fermentation",
    harvestSeason: "Year-Round",
    extractionMethod: "Stereospecific L-(+) Bacterial Fermentation + Membrane Purification",
    concentrationInFormula: "0.50% \u2013 1.50% Physiological Acid-Mantle Buffer & Micro-Polisher",
    optimalPhRange: "4.5 \u2013 5.5",
    solubility: "100% Water-Soluble Hydrophilic AHA",
    molecularWeightProfile: "90.08 Da (Controlled Surface Stratum Corneum Action)",
    ayurvedicDoshaAffinity: "Vata & Kapha Brightener \u2014 Polishes dry dullness while locking in water",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Rough, dull forehead, flaky cheek patches, and uneven skin texture",
    primaryClinicalBenefit: "Calibrates acid-mantle pH to 5.2, gently polishes dull cells, and boosts NMF hydration",
    sensoryProfile: {
      color: "Crystal Clear Liquid",
      aroma: "Odorless",
      skinFeel: "Silky, glass-smooth surface polish without sting",
    },
    bioactiveCompounds: [
      {
        compound: "L-(+)-Lactic Acid (Biologically Native Isomer)",
        concentration: "99% Stereochemical Purity",
        role: "Acid-Mantle pH Calibrator (pH 5.2)",
        biochemicalTarget: "Maintains the protective acidic pH required by lipid-processing enzymes (beta-glucocerebrosidase).",
      },
      {
        compound: "Calcium-Ion Desmosome Chelate",
        concentration: "Gentle Surface Keratolytic",
        role: "Micro-Flake Polisher",
        biochemicalTarget: "Reduces calcium ion concentration in cadherin junctions of the outermost corneocytes for smooth shedding.",
      },
      {
        compound: "Lactate NMF Humectant Ion",
        concentration: "Physiological NMF Component",
        role: "Water-Binding Plasticizer",
        biochemicalTarget: "Sodium/potassium lactate naturally makes up ~12% of human NMF, increasing stratum corneum pliability.",
      },
      {
        compound: "Ceramide Biosynthesis Stimulator",
        concentration: "Epidermal Lipid Signal",
        role: "Barrier-Thickening AHA",
        biochemicalTarget: "L-(+)-Lactic Acid is clinically proven to increase epidermal ceramide levels by up to 38%.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Fermented Plant Lactic Acid (Gentle AHA))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Fermented Plant Lactic Acid (Gentle AHA) (Lactic Acid (Vegan Bio-Fermented L-Isomer)) partitions across Rough, dull forehead, flaky cheek patches, and uneven skin texture at pH 4.5 \u2013 5.5, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate silky, glass-smooth surface polish without sting with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (90.08 Da (Controlled Surface Stratum Corneum Action))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by L-(+)-Lactic Acid (Biologically Native Isomer), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver calibrates acid-mantle ph to 5.2, gently polishes dull cells, and boosts nmf hydration.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Calcium-Ion Desmosome Chelate)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Reduces calcium ion concentration in cadherin junctions of the outermost corneocytes for smooth shedding.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Lactate NMF Humectant Ion)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Sodium/potassium lactate naturally makes up ~12% of human NMF, increasing stratum corneum pliability.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Ceramide Biosynthesis Stimulator)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "L-(+)-Lactic Acid is clinically proven to increase epidermal ceramide levels by up to 38%.",
        visibleOutcome: "Lasting improvement in Rough, dull forehead, flaky cheek patches, and uneven skin texture clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Fermented Plant Lactic Acid (Gentle AHA) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Vata & Kapha Brightener \u2014 Polishes dry dullness while locking in water while compounding synergy with Pure Aloe Vera (Story 04) and Botanical Salicylic Acid (BHA).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Rough, dull forehead, flaky cheek patches, and uneven skin texture for Fermented Plant Lactic Acid (Gentle AHA) absorption.",
        proTip: "Fermented Plant Lactic Acid (Gentle AHA) maintains peak stability at pH 4.5 \u2013 5.5; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (0.50% \u2013 1.50% Physiological Acid-Mantle Buffer & Micro-Polisher)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Fermented Plant Lactic Acid (Gentle AHA)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Fermented Plant Lactic Acid (Gentle AHA) and Pure Aloe Vera (Story 04) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the 100% water-soluble hydrophilic aha matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Rough, dull forehead, flaky cheek pa",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Rough, dull forehead, flaky cheek patches, and uneven skin texture.",
        proTip: "Use featherlight ring-finger pressure so L-(+)-Lactic Acid (Biologically Native Isomer) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so L-(+)-Lactic Acid (Biologically Native Isomer) and Calcium-Ion Desmosome Chelate bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Pure Aloe Vera (Story 04) or Botanical Salicylic Acid (BHA) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of L-(+)-Lactic Acid (Biologically Native Isomer) across the upper stratum corneum at pH 4.5 \u2013 5.5.",
        experience: "Skin feels silky, glass-smooth surface polish without sting with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in calibrates acid-mantle ph to 5.2, gently polishes dull cells, and boosts nmf hydration and reduced daily oxidative stress.",
        experience: "Rough, dull forehead, flaky cheek patches, and uneven skin texture appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Calcium-Ion Desmosome Chelate and Lactate NMF Humectant Ion.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Fermented Plant Lactic Acid (Gentle AHA) + Pure Aloe Vera (Story 04).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports calibrates acid-mantle ph to 5.2, gently polishes dull cells, and boosts nmf hydration while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Rough, dull forehead, flaky cheek patches, and uneven skin texture.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.5 \u2013 5.5 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 L-(+)-Lactic Acid (Biologically Native Isomer) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "aloe_vera",
        partnerName: "Pure Aloe Vera (Story 04)",
        synergyScore: "99/100",
        combinedBenefit: "Aloe cushions Lactic Acid for zero-irritation daily micro-polishing.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "salicylic_acid",
        partnerName: "Botanical Salicylic Acid (BHA)",
        synergyScore: "98/100",
        combinedBenefit: "Lactic Acid (AHA) smooths the water-loving surface while Salicylic Acid (BHA) clears oil-loving pores.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "hyaluronic_acid",
        partnerName: "Multi-Molecular Hyaluronic Acid",
        synergyScore: "97/100",
        combinedBenefit: "Freshly polished corneocytes absorb 5-weight HA with maximum efficiency.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.5 \u2013 5.5. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Fermented Plant Lactic Acid (Gentle AHA) work inside Bhumivera formulations?",
        answer: "Larger in molecular weight than glycolic acid (90 Da vs 76 Da) and an intrinsic component of human Natural Moisturizing Factor, vegan L-Lactic Acid calibrates our formulas to the ideal acid-mantle pH of 5.2 while gently polishing away dull surface cells and stimulating ceramide synthesis. Its primary bioactive, L-(+)-Lactic Acid (Biologically Native Isomer) (99% Stereochemical Purity), targets Rough, dull forehead, flaky cheek patches, and uneven skin texture to deliver calibrates acid-mantle ph to 5.2, gently polishes dull cells, and boosts nmf hydration.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Fermented Plant Lactic Acid (Gentle AHA)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Fermented Plant Lactic Acid (Gentle AHA)?",
        answer: "Fermented Plant Lactic Acid (Gentle AHA) achieves peak clinical synergy when paired with Pure Aloe Vera (Story 04) (99/100 synergy), Botanical Salicylic Acid (BHA) (98/100 synergy), and Multi-Molecular Hyaluronic Acid (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "lactic_acid_aha_pair_0",
        label: "Synergy: Pure Aloe Vera (Story 04)",
        prompt: "Tell me about Pure Aloe Vera (Story 04) and how it works with Fermented Plant Lactic Acid (Gentle AHA)",
        category: 'closely_related_ingredient',
      },
      {
        id: "lactic_acid_aha_pair_1",
        label: "Synergy: Botanical Salicylic Acid (BHA)",
        prompt: "Tell me about Botanical Salicylic Acid (BHA) and how it works with Fermented Plant Lactic Acid (Gentle AHA)",
        category: 'closely_related_ingredient',
      },
      {
        id: "lactic_acid_aha_ritual_steps",
        label: "6-Step Fermented Plant Lactic Acid (Gentle AHA) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Fermented Plant Lactic Acid (Gentle AHA)",
        category: 'usage_and_timing',
      },
      {
        id: "lactic_acid_aha_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "alpha_bisabolol",
    indexNumber: 25,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 25",
    isHeroStory: false,
    name: "Chamomile Alpha-Bisabolol",
    fullTitle: "Natural (-)-Alpha-Bisabolol (Matricaria Recutita & Candeia Botanical Fraction)",
    latinBinomial: "Matricaria chamomilla L. / Vanillosmopsis erythropappa",
    inciName: "Bisabolol (Natural (-)-Alpha-Isomer)",
    category: "Botanical Active \u00b7 Neurosensory Redness & Cytokine Calmer",
    noteFamily: "Chamomile Heart \u00b7 Sesquiterpene Soother",
    tagline: "Chirally pure (-)-Alpha-Bisabolol that extinguishes pro-inflammatory cytokines and calms reactive skin on contact.",
    shortSummary: "The primary soothing sesquiterpene alcohol of German Chamomile, natural (-)-Alpha-Bisabolol inhibits TNF-alpha and IL-1alpha release, suppresses melanin synthesis triggered by inflammation, and enhances the transdermal absorption of companion antioxidants.",
    originRegion: "Himalayan Chamomile Meadows & Sustainable Candeia Botanical Distillation",
    harvestSeason: "Spring Full-Bloom Harvest",
    extractionMethod: "Fractional Vacuum Steam Distillation (>95% (-)-Alpha-Isomer)",
    concentrationInFormula: "0.30% \u2013 0.50% Clinical Soothing Threshold",
    optimalPhRange: "4.5 \u2013 7.0",
    solubility: "Lipophilic Sesquiterpene Alcohol",
    molecularWeightProfile: "222.37 Da (Deep Epidermal Permeation)",
    ayurvedicDoshaAffinity: "Pitta Extinguisher \u2014 Rapidly cools burning, flushing, and reactive skin",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin",
    primaryClinicalBenefit: "Extinguishes TNF-alpha/IL-6 redness and prevents inflammation from turning into dark spots",
    sensoryProfile: {
      color: "Water-Clear to Faint Straw Nectar",
      aroma: "Delicate, sweet-woody chamomile blossom",
      skinFeel: "Velvety, immediate comfort for irritated skin",
    },
    bioactiveCompounds: [
      {
        compound: "(-)-Alpha-Bisabolol (Active Levorotatory Isomer)",
        concentration: "96% Assay Purity",
        role: "TNF-Alpha & IL-6 Inhibitor",
        biochemicalTarget: "Possesses 2x the anti-inflammatory potency of synthetic racemic (+/-)-bisabolol.",
      },
      {
        compound: "cAMP-Mediated Melanogenesis Blocker",
        concentration: "PIH Prevention Factor",
        role: "Post-Irritation Dark Spot Preventer",
        biochemicalTarget: "Inhibits alpha-MSH induced phosphorylation of CREB, preventing redness from turning into dark spots.",
      },
      {
        compound: "Stratum Corneum Fluidity Enhancer",
        concentration: "Botanical Penetration Booster",
        role: "Companion Active Carrier",
        biochemicalTarget: "Temporarily disorders rigid lipid packing to help antioxidants and panthenol absorb deeper.",
      },
      {
        compound: " Leukotriene B4 & 5-LOX Suppressor",
        concentration: "Vascular Flushing Calmer",
        role: "Rosacea & Post-Sun Soother",
        biochemicalTarget: "Reduces arachidonic acid cascade redness within 30 minutes of application.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Chamomile Alpha-Bisabolol)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Chamomile Alpha-Bisabolol (Bisabolol (Natural (-)-Alpha-Isomer)) partitions across Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin at pH 4.5 \u2013 7.0, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate velvety, immediate comfort for irritated skin with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (222.37 Da (Deep Epidermal Permeation))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by (-)-Alpha-Bisabolol (Active Levorotatory Isomer), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver extinguishes tnf-alpha/il-6 redness and prevents inflammation from turning into dark spots.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (cAMP-Mediated Melanogenesis Blocker)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Inhibits alpha-MSH induced phosphorylation of CREB, preventing redness from turning into dark spots.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Stratum Corneum Fluidity Enhancer)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Temporarily disorders rigid lipid packing to help antioxidants and panthenol absorb deeper.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling ( Leukotriene B4 & 5-LOX Suppressor)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Reduces arachidonic acid cascade redness within 30 minutes of application.",
        visibleOutcome: "Lasting improvement in Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Chamomile Alpha-Bisabolol Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Pitta Extinguisher \u2014 Rapidly cools burning, flushing, and reactive skin while compounding synergy with Botanical Allantoin and Centella Asiatica (Gotu Kola).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin for Chamomile Alpha-Bisabolol absorption.",
        proTip: "Chamomile Alpha-Bisabolol maintains peak stability at pH 4.5 \u2013 7.0; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (0.30% \u2013 0.50% Clinical Soothing Threshold)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Chamomile Alpha-Bisabolol-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Chamomile Alpha-Bisabolol and Botanical Allantoin into a silky micro-cushion.",
        proTip: "Pre-whipping activates the lipophilic sesquiterpene alcohol matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Flushed cheeks, nasal redness, post-",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin.",
        proTip: "Use featherlight ring-finger pressure so (-)-Alpha-Bisabolol (Active Levorotatory Isomer) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so (-)-Alpha-Bisabolol (Active Levorotatory Isomer) and cAMP-Mediated Melanogenesis Blocker bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Botanical Allantoin or Centella Asiatica (Gotu Kola) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of (-)-Alpha-Bisabolol (Active Levorotatory Isomer) across the upper stratum corneum at pH 4.5 \u2013 7.0.",
        experience: "Skin feels velvety, immediate comfort for irritated skin with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in extinguishes tnf-alpha/il-6 redness and prevents inflammation from turning into dark spots and reduced daily oxidative stress.",
        experience: "Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by cAMP-Mediated Melanogenesis Blocker and Stratum Corneum Fluidity Enhancer.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Chamomile Alpha-Bisabolol + Botanical Allantoin.",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports extinguishes tnf-alpha/il-6 redness and prevents inflammation from turning into dark spots while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.5 \u2013 7.0 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 (-)-Alpha-Bisabolol (Active Levorotatory Isomer) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "allantoin",
        partnerName: "Botanical Allantoin",
        synergyScore: "99/100",
        combinedBenefit: "Immediate neurosensory and cytokine relief for compromised barriers.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "centella_asiatica",
        partnerName: "Centella Asiatica (Gotu Kola)",
        synergyScore: "98/100",
        combinedBenefit: "Rapid resolution of post-inflammatory erythema (PIE).",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "sea_buckthorn",
        partnerName: "Sea Buckthorn (Story 01)",
        synergyScore: "97/100",
        combinedBenefit: "Lipid-soluble synergy for sun-stressed or wind-chapped skin.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.5 \u2013 7.0. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Chamomile Alpha-Bisabolol work inside Bhumivera formulations?",
        answer: "The primary soothing sesquiterpene alcohol of German Chamomile, natural (-)-Alpha-Bisabolol inhibits TNF-alpha and IL-1alpha release, suppresses melanin synthesis triggered by inflammation, and enhances the transdermal absorption of companion antioxidants. Its primary bioactive, (-)-Alpha-Bisabolol (Active Levorotatory Isomer) (96% Assay Purity), targets Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin to deliver extinguishes tnf-alpha/il-6 redness and prevents inflammation from turning into dark spots.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Chamomile Alpha-Bisabolol?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Chamomile Alpha-Bisabolol?",
        answer: "Chamomile Alpha-Bisabolol achieves peak clinical synergy when paired with Botanical Allantoin (99/100 synergy), Centella Asiatica (Gotu Kola) (98/100 synergy), and Sea Buckthorn (Story 01) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "alpha_bisabolol_pair_0",
        label: "Synergy: Botanical Allantoin",
        prompt: "Tell me about Botanical Allantoin and how it works with Chamomile Alpha-Bisabolol",
        category: 'closely_related_ingredient',
      },
      {
        id: "alpha_bisabolol_pair_1",
        label: "Synergy: Centella Asiatica (Gotu Kola)",
        prompt: "Tell me about Centella Asiatica (Gotu Kola) and how it works with Chamomile Alpha-Bisabolol",
        category: 'closely_related_ingredient',
      },
      {
        id: "alpha_bisabolol_ritual_steps",
        label: "6-Step Chamomile Alpha-Bisabolol Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Chamomile Alpha-Bisabolol",
        category: 'usage_and_timing',
      },
      {
        id: "alpha_bisabolol_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "pomegranate_omega5",
    indexNumber: 26,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 26",
    isHeroStory: false,
    name: "Pomegranate Seed (Omega-5 & Ellagic Acid)",
    fullTitle: "Cold-Pressed Punica Granatum Seed Oil (Punicic Acid Omega-5) & Pericarp Ellagic Complex",
    latinBinomial: "Punica granatum L.",
    inciName: "Punica Granatum Seed Oil & Fruit Extract",
    category: "Botanical Active \u00b7 Omega-5 Cellular Longevity & Photoprotection",
    noteFamily: "Dadima Ruby Seed \u00b7 Conjugated Omega-5",
    tagline: "Himalayan pomegranate seed and pericarp extract delivering rare Omega-5 (Punicic Acid) and Ellagic Acid.",
    shortSummary: "Pomegranate is the only botanical source of Punicic Acid (Omega-5), a conjugated linolenic acid that stimulates keratinocyte proliferation, alongside Ellagic Acid and Punicalagins that chelate copper in tyrosinase and shield dermal collagen.",
    originRegion: "Kinnaur & Kullu Valleys, Himachal Pradesh, India",
    harvestSeason: "September \u2013 October Autumn Harvest",
    extractionMethod: "Supercritical CO2 Seed Extraction + Hydro-Polyphenol Pericarp Isolation",
    concentrationInFormula: "0.60% Dual Seed & Ellagic Polyphenol Complex",
    optimalPhRange: "4.8 \u2013 6.0",
    solubility: "Amphiphilic Dual-Phase Extract",
    molecularWeightProfile: "278.4 Da (Punicic Acid) to 302.19 Da (Ellagic Acid)",
    ayurvedicDoshaAffinity: "Tridoshic Dadima Rasayana \u2014 Balances Pitta/Vata and revitalizes mature skin",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 1,
    primaryFocusZone: "Sun-exposed cheekbones, mature contours, fine lines, and dull skin",
    primaryClinicalBenefit: "Omega-5 epidermal renewal, Ellagic Acid brightening, and 3x polyphenol photoprotection",
    sensoryProfile: {
      color: "Warm Ruby-Gold",
      aroma: "Fresh, tart botanical fruit seed",
      skinFeel: "Rich yet breathable antioxidant cushion",
    },
    bioactiveCompounds: [
      {
        compound: "Punicic Acid (Omega-5 Conjugated Trienoic Acid)",
        concentration: "72% of Seed Oil Fraction",
        role: "Keratinocyte Proliferation & PPAR Activator",
        biochemicalTarget: "Activates PPAR-gamma receptors in the epidermis to thicken thin, aging barriers.",
      },
      {
        compound: "Ellagic Acid",
        concentration: "15% Standardized Polyphenol",
        role: "Copper-Chelating Tyrosinase Inhibitor",
        biochemicalTarget: "Prevents UV-induced pigmentation and inhibits MMP collagenase breakdown.",
      },
      {
        compound: "Punicalagins A & B",
        concentration: "20% Hydrolyzable Tannins",
        role: "Super-Antioxidant Radical Scavenger",
        biochemicalTarget: "Exhibits 3x the ORAC antioxidant capacity of red wine or green tea.",
      },
      {
        compound: "Phytosterols & Gamma-Tocopherol",
        concentration: "1.2% Seed Sterol Fraction",
        role: "Barrier Moisture Lock",
        biochemicalTarget: "Reinforces stratum corneum lipid cohesion.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Pomegranate Seed (Omega-5 & Ellagic Acid))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Pomegranate Seed (Omega-5 & Ellagic Acid) (Punica Granatum Seed Oil & Fruit Extract) partitions across Sun-exposed cheekbones, mature contours, fine lines, and dull skin at pH 4.8 \u2013 6.0, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate rich yet breathable antioxidant cushion with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (278.4 Da (Punicic Acid) to 302.19 Da (Ellagic Acid))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Punicic Acid (Omega-5 Conjugated Trienoic Acid), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver omega-5 epidermal renewal, ellagic acid brightening, and 3x polyphenol photoprotection.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Ellagic Acid)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Prevents UV-induced pigmentation and inhibits MMP collagenase breakdown.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Punicalagins A & B)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Exhibits 3x the ORAC antioxidant capacity of red wine or green tea.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Phytosterols & Gamma-Tocopherol)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Reinforces stratum corneum lipid cohesion.",
        visibleOutcome: "Lasting improvement in Sun-exposed cheekbones, mature contours, fine lines, and dull skin clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Pomegranate Seed (Omega-5 & Ellagic Acid) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Tridoshic Dadima Rasayana \u2014 Balances Pitta/Vata and revitalizes mature skin while compounding synergy with Sea Buckthorn (Story 01) and Vitamin C (3-O-Ethyl Ascorbic Acid).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Sun-exposed cheekbones, mature contours, fine lines, and dull skin for Pomegranate Seed (Omega-5 & Ellagic Acid) absorption.",
        proTip: "Pomegranate Seed (Omega-5 & Ellagic Acid) maintains peak stability at pH 4.8 \u2013 6.0; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (0.60% Dual Seed & Ellagic Polyphenol Complex)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Pomegranate Seed (Omega-5 & Ellagic Acid)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Pomegranate Seed (Omega-5 & Ellagic Acid) and Sea Buckthorn (Story 01) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the amphiphilic dual-phase extract matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Sun-exposed cheekbones, mature conto",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Sun-exposed cheekbones, mature contours, fine lines, and dull skin.",
        proTip: "Use featherlight ring-finger pressure so Punicic Acid (Omega-5 Conjugated Trienoic Acid) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Punicic Acid (Omega-5 Conjugated Trienoic Acid) and Ellagic Acid bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Sea Buckthorn (Story 01) or Vitamin C (3-O-Ethyl Ascorbic Acid) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Punicic Acid (Omega-5 Conjugated Trienoic Acid) across the upper stratum corneum at pH 4.8 \u2013 6.0.",
        experience: "Skin feels rich yet breathable antioxidant cushion with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in omega-5 epidermal renewal, ellagic acid brightening, and 3x polyphenol photoprotection and reduced daily oxidative stress.",
        experience: "Sun-exposed cheekbones, mature contours, fine lines, and dull skin appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Ellagic Acid and Punicalagins A & B.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Pomegranate Seed (Omega-5 & Ellagic Acid) + Sea Buckthorn (Story 01).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 1/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports omega-5 epidermal renewal, ellagic acid brightening, and 3x polyphenol photoprotection while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Sun-exposed cheekbones, mature contours, fine lines, and dull skin.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.8 \u2013 6.0 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (1/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Punicic Acid (Omega-5 Conjugated Trienoic Acid) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "sea_buckthorn",
        partnerName: "Sea Buckthorn (Story 01)",
        synergyScore: "99/100",
        combinedBenefit: "Unites Sea Buckthorn's Omega-7 with Pomegranate's rare Omega-5.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "vitamin_c_ethyl",
        partnerName: "Vitamin C (3-O-Ethyl Ascorbic Acid)",
        synergyScore: "98/100",
        combinedBenefit: "Ellagic Acid + Vitamin C multiply daytime UV defense and spot fading.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "rosehip_retinoate",
        partnerName: "Cold-Pressed Rosehip Seed Oil",
        synergyScore: "97/100",
        combinedBenefit: "Complete Omega 3-5-6-7-9 cellular longevity complex.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.8 \u2013 6.0. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Pomegranate Seed (Omega-5 & Ellagic Acid) work inside Bhumivera formulations?",
        answer: "Pomegranate is the only botanical source of Punicic Acid (Omega-5), a conjugated linolenic acid that stimulates keratinocyte proliferation, alongside Ellagic Acid and Punicalagins that chelate copper in tyrosinase and shield dermal collagen. Its primary bioactive, Punicic Acid (Omega-5 Conjugated Trienoic Acid) (72% of Seed Oil Fraction), targets Sun-exposed cheekbones, mature contours, fine lines, and dull skin to deliver omega-5 epidermal renewal, ellagic acid brightening, and 3x polyphenol photoprotection.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Pomegranate Seed (Omega-5 & Ellagic Acid)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Pomegranate Seed (Omega-5 & Ellagic Acid)?",
        answer: "Pomegranate Seed (Omega-5 & Ellagic Acid) achieves peak clinical synergy when paired with Sea Buckthorn (Story 01) (99/100 synergy), Vitamin C (3-O-Ethyl Ascorbic Acid) (98/100 synergy), and Cold-Pressed Rosehip Seed Oil (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "pomegranate_omega5_pair_0",
        label: "Synergy: Sea Buckthorn (Story 01)",
        prompt: "Tell me about Sea Buckthorn (Story 01) and how it works with Pomegranate Seed (Omega-5 & Ellagic Acid)",
        category: 'closely_related_ingredient',
      },
      {
        id: "pomegranate_omega5_pair_1",
        label: "Synergy: Vitamin C (3-O-Ethyl Ascorbic Acid)",
        prompt: "Tell me about Vitamin C (3-O-Ethyl Ascorbic Acid) and how it works with Pomegranate Seed (Omega-5 & Ellagic Acid)",
        category: 'closely_related_ingredient',
      },
      {
        id: "pomegranate_omega5_ritual_steps",
        label: "6-Step Pomegranate Seed (Omega-5 & Ellagic Acid) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Pomegranate Seed (Omega-5 & Ellagic Acid)",
        category: 'usage_and_timing',
      },
      {
        id: "pomegranate_omega5_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "moringa_peptide",
    indexNumber: 27,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 27",
    isHeroStory: false,
    name: "Moringa Seed Anti-Pollution Peptide",
    fullTitle: "Cationic Moringa Oleifera Micro-Protein & Behenic Lipid Shield",
    latinBinomial: "Moringa oleifera Lam.",
    inciName: "Moringa Oleifera Seed Extract & Seed Oil",
    category: "Botanical Active \u00b7 Anti-Pollution PM2.5 Flocculant & Shield",
    noteFamily: "Shigru Seed \u00b7 Cationic Purifying Peptide",
    tagline: "Low-molecular-weight Moringa seed peptides that act as a biological magnet to flocculate PM2.5 smog and repel urban dust.",
    shortSummary: "Historically used to purify turbid river water, Moringa seeds contain cationic dimeric proteins (6.5\u201313 kDa) that bind negatively charged smoke, heavy metals, and PM2.5 exhaust particles on the skin so they rinse away completely during cleansing.",
    originRegion: "Dry-Zone Organic Moringa Orchards of Tamil Nadu & Andhra Pradesh, India",
    harvestSeason: "March \u2013 June Mature Pod Harvest",
    extractionMethod: "Cold Seed Pressing + Ultrafiltered Peptide Extraction",
    concentrationInFormula: "0.80% Purifying Seed Peptide Complex",
    optimalPhRange: "5.0 \u2013 6.2",
    solubility: "Water-Soluble Peptide + Behenic Lipid Fraction",
    molecularWeightProfile: "6.5 kDa \u2013 13 kDa (Cationic Coagulant Micro-Peptide)",
    ayurvedicDoshaAffinity: "Kapha & Vata Clarifier \u2014 Shigru purifies deep pore stagnation",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Full face and neck for commuters and residents of high-AQI urban cities",
    primaryClinicalBenefit: "Flocculates and lifts PM2.5 smog during washing and repels fresh urban dust adhesion",
    sensoryProfile: {
      color: "Clear Golden-Champagne",
      aroma: "Clean, nutty botanical seed",
      skinFeel: "Breathable, anti-adhesion satin veil",
    },
    bioactiveCompounds: [
      {
        compound: "Moringa Cationic Coagulant Peptides (MO2.1)",
        concentration: "85% of Peptide Fraction",
        role: "PM2.5 & Cigarette Smoke Flocculant",
        biochemicalTarget: "Coagulates microscopic carbon and metal particulates on the skin surface for 100% rinse removal.",
      },
      {
        compound: "Anti-Adhesion Surface Shield",
        concentration: "Biomimetic Charge Repeller",
        role: "Post-Wash Dust Repellent",
        biochemicalTarget: "Leaves an invisible cationic micro-veil that reduces fresh pollutant adhesion by up to 41%.",
      },
      {
        compound: "Behenic Acid (C22:0) & Oleic Acid",
        concentration: "Lipid Conditioning Fraction",
        role: "Velvet Barrier Conditioner",
        biochemicalTarget: "Smooths rough corneocytes without clogging pores.",
      },
      {
        compound: "Zeatin (Natural Plant Cytokinin)",
        concentration: "Trace Phytohormone",
        role: "Cellular Youth & Antioxidant Factor",
        biochemicalTarget: "Supports fibroblast vitality and delays oxidative senescence.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Moringa Seed Anti-Pollution Peptide)",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Moringa Seed Anti-Pollution Peptide (Moringa Oleifera Seed Extract & Seed Oil) partitions across Full face and neck for commuters and residents of high-AQI urban cities at pH 5.0 \u2013 6.2, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate breathable, anti-adhesion satin veil with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (6.5 kDa \u2013 13 kDa (Cationic Coagulant Micro-Peptide))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Moringa Cationic Coagulant Peptides (MO2.1), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver flocculates and lifts pm2.5 smog during washing and repels fresh urban dust adhesion.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Anti-Adhesion Surface Shield)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Leaves an invisible cationic micro-veil that reduces fresh pollutant adhesion by up to 41%.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Behenic Acid (C22:0) & Oleic Acid)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Smooths rough corneocytes without clogging pores.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Zeatin (Natural Plant Cytokinin))",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Supports fibroblast vitality and delays oxidative senescence.",
        visibleOutcome: "Lasting improvement in Full face and neck for commuters and residents of high-AQI urban cities clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Moringa Seed Anti-Pollution Peptide Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Kapha & Vata Clarifier \u2014 Shigru purifies deep pore stagnation while compounding synergy with Activated Bamboo Charcoal (Story 02) and Sacred Tulsi (Story 03).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Full face and neck for commuters and residents of high-AQI urban cities for Moringa Seed Anti-Pollution Peptide absorption.",
        proTip: "Moringa Seed Anti-Pollution Peptide maintains peak stability at pH 5.0 \u2013 6.2; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (0.80% Purifying Seed Peptide Complex)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Moringa Seed Anti-Pollution Peptide-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Moringa Seed Anti-Pollution Peptide and Activated Bamboo Charcoal (Story 02) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the water-soluble peptide + behenic lipid fraction matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Full face and neck for commuters and",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Full face and neck for commuters and residents of high-AQI urban cities.",
        proTip: "Use featherlight ring-finger pressure so Moringa Cationic Coagulant Peptides (MO2.1) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Moringa Cationic Coagulant Peptides (MO2.1) and Anti-Adhesion Surface Shield bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Activated Bamboo Charcoal (Story 02) or Sacred Tulsi (Story 03) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Moringa Cationic Coagulant Peptides (MO2.1) across the upper stratum corneum at pH 5.0 \u2013 6.2.",
        experience: "Skin feels breathable, anti-adhesion satin veil with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in flocculates and lifts pm2.5 smog during washing and repels fresh urban dust adhesion and reduced daily oxidative stress.",
        experience: "Full face and neck for commuters and residents of high-AQI urban cities appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Anti-Adhesion Surface Shield and Behenic Acid (C22:0) & Oleic Acid.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Moringa Seed Anti-Pollution Peptide + Activated Bamboo Charcoal (Story 02).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports flocculates and lifts pm2.5 smog during washing and repels fresh urban dust adhesion while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Full face and neck for commuters and residents of high-AQI urban cities.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 5.0 \u2013 6.2 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Moringa Cationic Coagulant Peptides (MO2.1) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "activated_charcoal",
        partnerName: "Activated Bamboo Charcoal (Story 02)",
        synergyScore: "100/100",
        combinedBenefit: "Charcoal adsorbs non-polar hydrocarbons while Moringa peptides coagulate charged heavy metals.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "sacred_tulsi",
        partnerName: "Sacred Tulsi (Story 03)",
        synergyScore: "98/100",
        combinedBenefit: "Complete urban anti-pollution and anti-stress shield.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "green_tea_egcg",
        partnerName: "Green Tea Polyphenols (EGCG)",
        synergyScore: "97/100",
        combinedBenefit: "Stops pollution-induced free radicals from damaging collagen.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 5.0 \u2013 6.2. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Moringa Seed Anti-Pollution Peptide work inside Bhumivera formulations?",
        answer: "Historically used to purify turbid river water, Moringa seeds contain cationic dimeric proteins (6.5\u201313 kDa) that bind negatively charged smoke, heavy metals, and PM2.5 exhaust particles on the skin so they rinse away completely during cleansing. Its primary bioactive, Moringa Cationic Coagulant Peptides (MO2.1) (85% of Peptide Fraction), targets Full face and neck for commuters and residents of high-AQI urban cities to deliver flocculates and lifts pm2.5 smog during washing and repels fresh urban dust adhesion.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Moringa Seed Anti-Pollution Peptide?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Moringa Seed Anti-Pollution Peptide?",
        answer: "Moringa Seed Anti-Pollution Peptide achieves peak clinical synergy when paired with Activated Bamboo Charcoal (Story 02) (100/100 synergy), Sacred Tulsi (Story 03) (98/100 synergy), and Green Tea Polyphenols (EGCG) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "moringa_peptide_pair_0",
        label: "Synergy: Activated Bamboo Charcoal (Story 02)",
        prompt: "Tell me about Activated Bamboo Charcoal (Story 02) and how it works with Moringa Seed Anti-Pollution Peptide",
        category: 'closely_related_ingredient',
      },
      {
        id: "moringa_peptide_pair_1",
        label: "Synergy: Sacred Tulsi (Story 03)",
        prompt: "Tell me about Sacred Tulsi (Story 03) and how it works with Moringa Seed Anti-Pollution Peptide",
        category: 'closely_related_ingredient',
      },
      {
        id: "moringa_peptide_ritual_steps",
        label: "6-Step Moringa Seed Anti-Pollution Peptide Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Moringa Seed Anti-Pollution Peptide",
        category: 'usage_and_timing',
      },
      {
        id: "moringa_peptide_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "mysore_sandalwood",
    indexNumber: 28,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 28",
    isHeroStory: false,
    name: "Mysore Sandalwood Hydrosol (Chandana)",
    fullTitle: "Sustainably Cultivated Santalum Album Heartwood Distillate (Alpha- & Beta-Santalol)",
    latinBinomial: "Santalum album L.",
    inciName: "Santalum Album (Sandalwood) Wood Extract & Distillate",
    category: "Luxury Ayurvedic Botanical \u00b7 Cooling Astringent & Olfactory Calm",
    noteFamily: "Sacred Chandana \u00b7 Alpha-Santalol Coolant",
    tagline: "Ethical Mysore Sandalwood hydro-distillate that cools Pitta heat, refines pores, and activates cutaneous olfactory receptors.",
    shortSummary: "Human keratinocytes express functional olfactory receptors (OR2AT4) that respond directly to sandalwood sesquiterpenes by accelerating barrier wound healing. Paired with its legendary Ayurvedic Pitta-cooling properties, Chandana calms redness and tones pores.",
    originRegion: "Government-Certified Sustainable Plantations of Karnataka & Marayoor, India",
    harvestSeason: "15-Year Mature Heartwood Ethical Pruning",
    extractionMethod: "Low-Pressure Copper Steam Hydro-Distillation",
    concentrationInFormula: "1.20% Pure Heartwood Hydro-Distillate",
    optimalPhRange: "5.0 \u2013 6.0",
    solubility: "Aqueous Hydrosol with Micro-Dispersed Santalols",
    molecularWeightProfile: "220.35 Da (Alpha-Santalol & Beta-Santalol)",
    ayurvedicDoshaAffinity: "Supreme Pitta Pacifier \u2014 Cools burning sensation, heat rashes, and inflammatory acne",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin",
    primaryClinicalBenefit: "Activates OR2AT4 barrier repair receptors, cools Pitta redness, and provides meditative calm",
    sensoryProfile: {
      color: "Crystal Clear Dew with Warm Golden Undertone",
      aroma: "Sacred, creamy, meditative Mysore sandalwood",
      skinFeel: "Cooling, pore-tightening, and deeply tranquil",
    },
    bioactiveCompounds: [
      {
        compound: "Cis-Alpha-Santalol",
        concentration: "52% of Sesquiterpene Fraction",
        role: "Cutaneous OR2AT4 Receptor Activator",
        biochemicalTarget: "Binds epidermal OR2AT4 receptors to accelerate keratinocyte migration and barrier regeneration.",
      },
      {
        compound: "Cis-Beta-Santalol",
        concentration: "22% of Sesquiterpene Fraction",
        role: "PDE4 & NF-kB Anti-Inflammatory",
        biochemicalTarget: "Suppresses phosphodiesterase-4 and pro-inflammatory cytokines in acne and eczema-prone skin.",
      },
      {
        compound: "Santalyl Acetate & Teresantalol",
        concentration: "8% Cooling Terpenoids",
        role: "Astringent Pore Refiner",
        biochemicalTarget: "Gently tones dilated pores and reduces midday surface shine.",
      },
      {
        compound: "Polyphenolic Heartwood Tannins",
        concentration: "Antioxidant Fraction",
        role: "Tyrosinase & Redness Moderator",
        biochemicalTarget: "Helps fade sun-tan and post-blemish hyperpigmentation.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Mysore Sandalwood Hydrosol (Chandana))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Mysore Sandalwood Hydrosol (Chandana) (Santalum Album (Sandalwood) Wood Extract & Distillate) partitions across Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin at pH 5.0 \u2013 6.0, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate cooling, pore-tightening, and deeply tranquil with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (220.35 Da (Alpha-Santalol & Beta-Santalol))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Cis-Alpha-Santalol, bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver activates or2at4 barrier repair receptors, cools pitta redness, and provides meditative calm.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Cis-Beta-Santalol)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Suppresses phosphodiesterase-4 and pro-inflammatory cytokines in acne and eczema-prone skin.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Santalyl Acetate & Teresantalol)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Gently tones dilated pores and reduces midday surface shine.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Polyphenolic Heartwood Tannins)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Helps fade sun-tan and post-blemish hyperpigmentation.",
        visibleOutcome: "Lasting improvement in Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Mysore Sandalwood Hydrosol (Chandana) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Supreme Pitta Pacifier \u2014 Cools burning sensation, heat rashes, and inflammatory acne while compounding synergy with Kashmiri Mogra Saffron and Pure Aloe Vera (Story 04).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin for Mysore Sandalwood Hydrosol (Chandana) absorption.",
        proTip: "Mysore Sandalwood Hydrosol (Chandana) maintains peak stability at pH 5.0 \u2013 6.0; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.20% Pure Heartwood Hydro-Distillate)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Mysore Sandalwood Hydrosol (Chandana)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Mysore Sandalwood Hydrosol (Chandana) and Kashmiri Mogra Saffron into a silky micro-cushion.",
        proTip: "Pre-whipping activates the aqueous hydrosol with micro-dispersed santalols matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Sun-flushed cheeks, prickly heat zon",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin.",
        proTip: "Use featherlight ring-finger pressure so Cis-Alpha-Santalol works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Cis-Alpha-Santalol and Cis-Beta-Santalol bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Kashmiri Mogra Saffron or Pure Aloe Vera (Story 04) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Cis-Alpha-Santalol across the upper stratum corneum at pH 5.0 \u2013 6.0.",
        experience: "Skin feels cooling, pore-tightening, and deeply tranquil with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in activates or2at4 barrier repair receptors, cools pitta redness, and provides meditative calm and reduced daily oxidative stress.",
        experience: "Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Cis-Beta-Santalol and Santalyl Acetate & Teresantalol.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Mysore Sandalwood Hydrosol (Chandana) + Kashmiri Mogra Saffron.",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports activates or2at4 barrier repair receptors, cools pitta redness, and provides meditative calm while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 5.0 \u2013 6.0 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Cis-Alpha-Santalol and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "kashmiri_saffron",
        partnerName: "Kashmiri Mogra Saffron",
        synergyScore: "100/100",
        combinedBenefit: "Chandana + Kumkuma: the timeless royal Ayurvedic complexion ritual.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "aloe_vera",
        partnerName: "Pure Aloe Vera (Story 04)",
        synergyScore: "98/100",
        combinedBenefit: "Double thermal cooling after sun exposure or workouts.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "vetiver_khus",
        partnerName: "Wild Vetiver Root Distillate",
        synergyScore: "98/100",
        combinedBenefit: "Grounding earth-and-wood hydration harmony.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 5.0 \u2013 6.0. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Mysore Sandalwood Hydrosol (Chandana) work inside Bhumivera formulations?",
        answer: "Human keratinocytes express functional olfactory receptors (OR2AT4) that respond directly to sandalwood sesquiterpenes by accelerating barrier wound healing. Paired with its legendary Ayurvedic Pitta-cooling properties, Chandana calms redness and tones pores. Its primary bioactive, Cis-Alpha-Santalol (52% of Sesquiterpene Fraction), targets Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin to deliver activates or2at4 barrier repair receptors, cools pitta redness, and provides meditative calm.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Mysore Sandalwood Hydrosol (Chandana)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Mysore Sandalwood Hydrosol (Chandana)?",
        answer: "Mysore Sandalwood Hydrosol (Chandana) achieves peak clinical synergy when paired with Kashmiri Mogra Saffron (100/100 synergy), Pure Aloe Vera (Story 04) (98/100 synergy), and Wild Vetiver Root Distillate (98/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "mysore_sandalwood_pair_0",
        label: "Synergy: Kashmiri Mogra Saffron",
        prompt: "Tell me about Kashmiri Mogra Saffron and how it works with Mysore Sandalwood Hydrosol (Chandana)",
        category: 'closely_related_ingredient',
      },
      {
        id: "mysore_sandalwood_pair_1",
        label: "Synergy: Pure Aloe Vera (Story 04)",
        prompt: "Tell me about Pure Aloe Vera (Story 04) and how it works with Mysore Sandalwood Hydrosol (Chandana)",
        category: 'closely_related_ingredient',
      },
      {
        id: "mysore_sandalwood_ritual_steps",
        label: "6-Step Mysore Sandalwood Hydrosol (Chandana) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Mysore Sandalwood Hydrosol (Chandana)",
        category: 'usage_and_timing',
      },
      {
        id: "mysore_sandalwood_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "vetiver_khus",
    indexNumber: 29,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 29",
    isHeroStory: false,
    name: "Wild Vetiver Root Distillate (Ushira / Khus)",
    fullTitle: "Copper-Distilled Chrysopogon Zizanioides Root Hydrosol (Khusimol & Vetiverol)",
    latinBinomial: "Chrysopogon zizanioides (L.) Roberty",
    inciName: "Vetiveria Zizanoides Root Extract & Distillate",
    category: "Ayurvedic Botanical \u00b7 Grounding Moisture-Lock & pH Balancer",
    noteFamily: "Ushira Earth Root \u00b7 Khusimol Hydrator",
    tagline: "Deep-rooted Ushira grass distilled in copper vessels to anchor moisture, balance skin pH, and cool tropical heat.",
    shortSummary: "Growing roots up to 3 meters deep into mineral-rich soil, Vetiver (Khus) synthesizes sesquiterpene alcohols (Khusimol and Vetiverol) that act as natural moisture magnets, micro-circulation toners, and grounding aromatherapy during your cleansing ritual.",
    originRegion: "Kannauj & Bharatpur Alluvial Wetlands, North India",
    harvestSeason: "18-Month Deep Root Winter Harvest",
    extractionMethod: "Traditional Deg-Bhapka Copper Hydro-Distillation",
    concentrationInFormula: "1.10% Pure Ushira Root Hydrosol",
    optimalPhRange: "5.0 \u2013 5.8",
    solubility: "Aqueous Botanical Distillate",
    molecularWeightProfile: "220.35 Da (Khusimol & Isovalencenol)",
    ayurvedicDoshaAffinity: "Pitta & Vata Harmonizer \u2014 Cools excess heat while grounding Vata dryness",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Full face and neck, especially in hot, humid, or air-conditioned environments",
    primaryClinicalBenefit: "Balances post-rinse acid-mantle pH, anchors hydration, and cools skin heat",
    sensoryProfile: {
      color: "Clear Amber-Tinted Dew",
      aroma: "Petrichor (first rain on warm earth), cool root, and woody serenity",
      skinFeel: "Refreshing, pH-balancing, and moisture-anchoring",
    },
    bioactiveCompounds: [
      {
        compound: "Khusimol & Vetiverol (Sesquiterpene Alcohols)",
        concentration: "48% of Root Volatiles",
        role: "Epidermal Moisture Anchor",
        biochemicalTarget: "Forms hydrogen bonds with stratum corneum water to slow evaporative loss in hot climates.",
      },
      {
        compound: "Alpha- & Beta-Vetivone",
        concentration: "14% Sesquiterpene Ketones",
        role: "Sebum & Pore Tonic",
        biochemicalTarget: "Balances T-zone oil output while keeping cheeks supple.",
      },
      {
        compound: "Benzoic Acid & Furfural Trace Organics",
        concentration: "Natural Distillate Acids",
        role: "Acid-Mantle pH Stabilizer",
        biochemicalTarget: "Naturally buffers skin surface pH to 5.2\u20135.5 after tap-water rinsing.",
      },
      {
        compound: "Root Mineral Chelate Traces (Iron, Manganese, Zinc)",
        concentration: "Soil-Derived Micro-Elements",
        role: "Antioxidant Enzyme Cofactors",
        biochemicalTarget: "Supports mitochondrial superoxide dismutase activity.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Wild Vetiver Root Distillate (Ushira / Khus))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Wild Vetiver Root Distillate (Ushira / Khus) (Vetiveria Zizanoides Root Extract & Distillate) partitions across Full face and neck, especially in hot, humid, or air-conditioned environments at pH 5.0 \u2013 5.8, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate refreshing, ph-balancing, and moisture-anchoring with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (220.35 Da (Khusimol & Isovalencenol))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Khusimol & Vetiverol (Sesquiterpene Alcohols), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver balances post-rinse acid-mantle ph, anchors hydration, and cools skin heat.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Alpha- & Beta-Vetivone)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Balances T-zone oil output while keeping cheeks supple.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Benzoic Acid & Furfural Trace Organics)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Naturally buffers skin surface pH to 5.2\u20135.5 after tap-water rinsing.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Root Mineral Chelate Traces (Iron, Manganese, Zinc))",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Supports mitochondrial superoxide dismutase activity.",
        visibleOutcome: "Lasting improvement in Full face and neck, especially in hot, humid, or air-conditioned environments clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Wild Vetiver Root Distillate (Ushira / Khus) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Pitta & Vata Harmonizer \u2014 Cools excess heat while grounding Vata dryness while compounding synergy with Activated Bamboo Charcoal (Story 02) and Mysore Sandalwood Hydrosol.",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Full face and neck, especially in hot, humid, or air-conditioned environments for Wild Vetiver Root Distillate (Ushira / Khus) absorption.",
        proTip: "Wild Vetiver Root Distillate (Ushira / Khus) maintains peak stability at pH 5.0 \u2013 5.8; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.10% Pure Ushira Root Hydrosol)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Wild Vetiver Root Distillate (Ushira / Khus)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Wild Vetiver Root Distillate (Ushira / Khus) and Activated Bamboo Charcoal (Story 02) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the aqueous botanical distillate matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Full face and neck, especially in ho",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Full face and neck, especially in hot, humid, or air-conditioned environments.",
        proTip: "Use featherlight ring-finger pressure so Khusimol & Vetiverol (Sesquiterpene Alcohols) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Khusimol & Vetiverol (Sesquiterpene Alcohols) and Alpha- & Beta-Vetivone bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Activated Bamboo Charcoal (Story 02) or Mysore Sandalwood Hydrosol within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Khusimol & Vetiverol (Sesquiterpene Alcohols) across the upper stratum corneum at pH 5.0 \u2013 5.8.",
        experience: "Skin feels refreshing, ph-balancing, and moisture-anchoring with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in balances post-rinse acid-mantle ph, anchors hydration, and cools skin heat and reduced daily oxidative stress.",
        experience: "Full face and neck, especially in hot, humid, or air-conditioned environments appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Alpha- & Beta-Vetivone and Benzoic Acid & Furfural Trace Organics.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Wild Vetiver Root Distillate (Ushira / Khus) + Activated Bamboo Charcoal (Story 02).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports balances post-rinse acid-mantle ph, anchors hydration, and cools skin heat while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Full face and neck, especially in hot, humid, or air-conditioned environments.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 5.0 \u2013 5.8 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Khusimol & Vetiverol (Sesquiterpene Alcohols) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "activated_charcoal",
        partnerName: "Activated Bamboo Charcoal (Story 02)",
        synergyScore: "99/100",
        combinedBenefit: "Elemental earth synergy: Charcoal purifies pores while Vetiver cools and re-balances pH.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "mysore_sandalwood",
        partnerName: "Mysore Sandalwood Hydrosol",
        synergyScore: "98/100",
        combinedBenefit: "Sacred Ayurvedic cooling and grounding aromatherapy.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "aloe_vera",
        partnerName: "Pure Aloe Vera (Story 04)",
        synergyScore: "97/100",
        combinedBenefit: "Deep hydration reservoir for dehydrated skin.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 5.0 \u2013 5.8. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Wild Vetiver Root Distillate (Ushira / Khus) work inside Bhumivera formulations?",
        answer: "Growing roots up to 3 meters deep into mineral-rich soil, Vetiver (Khus) synthesizes sesquiterpene alcohols (Khusimol and Vetiverol) that act as natural moisture magnets, micro-circulation toners, and grounding aromatherapy during your cleansing ritual. Its primary bioactive, Khusimol & Vetiverol (Sesquiterpene Alcohols) (48% of Root Volatiles), targets Full face and neck, especially in hot, humid, or air-conditioned environments to deliver balances post-rinse acid-mantle ph, anchors hydration, and cools skin heat.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Wild Vetiver Root Distillate (Ushira / Khus)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Wild Vetiver Root Distillate (Ushira / Khus)?",
        answer: "Wild Vetiver Root Distillate (Ushira / Khus) achieves peak clinical synergy when paired with Activated Bamboo Charcoal (Story 02) (99/100 synergy), Mysore Sandalwood Hydrosol (98/100 synergy), and Pure Aloe Vera (Story 04) (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "vetiver_khus_pair_0",
        label: "Synergy: Activated Bamboo Charcoal (Story 02)",
        prompt: "Tell me about Activated Bamboo Charcoal (Story 02) and how it works with Wild Vetiver Root Distillate (Ushira / Khus)",
        category: 'closely_related_ingredient',
      },
      {
        id: "vetiver_khus_pair_1",
        label: "Synergy: Mysore Sandalwood Hydrosol",
        prompt: "Tell me about Mysore Sandalwood Hydrosol and how it works with Wild Vetiver Root Distillate (Ushira / Khus)",
        category: 'closely_related_ingredient',
      },
      {
        id: "vetiver_khus_ritual_steps",
        label: "6-Step Wild Vetiver Root Distillate (Ushira / Khus) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Wild Vetiver Root Distillate (Ushira / Khus)",
        category: 'usage_and_timing',
      },
      {
        id: "vetiver_khus_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "bakuchiol_babchi",
    indexNumber: 30,
    storyNumber: "BOTANICAL & ACTIVE \u00b7 30",
    isHeroStory: false,
    name: "Ayurvedic Bakuchiol (Babchi)",
    fullTitle: "99% Purified Psoralea Corylifolia Meroterpene Phenol (Psoralen-Free Phyto-Retinol)",
    latinBinomial: "Psoralea corylifolia L. (Cullen corylifolium)",
    inciName: "Bakuchiol (99% Pure Psoralen-Free Grade)",
    category: "Ayurvedic & Clinical Active \u00b7 Daytime-Safe Phyto-Retinol",
    noteFamily: "Babchi Seed \u00b7 Collagen I/III/IV Activator",
    tagline: "Clinical 99% pure Babchi seed meroterpene that mirrors retinol's gene expression for collagen and blemishes\u2014with zero peeling or sun sensitivity.",
    shortSummary: "Isolated from Ayurvedic Babchi seeds and purified to remove phototoxic psoralens (<10 ppm), Bakuchiol upregulates the exact same Type I, III, and IV collagen genes and downregulates 5-alpha-reductase as retinol, yet is 100% photostable for AM/PM use and safe during pregnancy.",
    originRegion: "Rajasthan & Central Indian Medicinal Herb Sanctuary",
    harvestSeason: "March \u2013 April Mature Seed Harvest",
    extractionMethod: "Supercritical CO2 Extraction + Chromatographic Psoralen Removal (>99% Purity)",
    concentrationInFormula: "0.50% \u2013 1.00% Clinical Phyto-Retinol Level",
    optimalPhRange: "4.8 \u2013 6.2",
    solubility: "Lipophilic Meroterpene Phenol",
    molecularWeightProfile: "256.38 Da (Rapid Dermal-Epidermal Junction Penetration)",
    ayurvedicDoshaAffinity: "Kapha & Vata Rejuvenator \u2014 Renews sluggish cell turnover without Pitta retinoid burn",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture",
    primaryClinicalBenefit: "Retinol-equivalent collagen & blemish renewal with zero peeling, redness, or sun sensitivity",
    sensoryProfile: {
      color: "Clear Golden-Amber",
      aroma: "Faint, warm nutty seed whisper",
      skinFeel: "Silky, cushiony, and completely non-irritating",
    },
    bioactiveCompounds: [
      {
        compound: "S-(+)-Bakuchiol (Meroterpene Phenol)",
        concentration: "99.2% Chromatographic Purity",
        role: "Retinol-Analog Gene Modulator",
        biochemicalTarget: "Stimulates Collagen I (+47%), Collagen III (+140%), and Collagen IV (+20%) without binding RAR nuclear receptors that cause peeling.",
      },
      {
        compound: "5-Alpha-Reductase & Lipoxygenase Blocker",
        concentration: "Anti-Acne Pathway",
        role: "Blemish & Comedone Reducer",
        biochemicalTarget: "Reduces squalene oxidation and inflammatory acne lesions by 57% over 6 weeks.",
      },
      {
        compound: "MMP-1 & MMP-12 Elastase Inhibitor",
        concentration: "Extracellular Matrix Shield",
        role: "Firmness & Elasticity Preserver",
        biochemicalTarget: "Protects existing collagen and elastin networks from UV degradation.",
      },
      {
        compound: "Psoralen-Depleted Safety Standard (<10 ppm)",
        concentration: "Purified Fraction",
        role: "Zero-Photosensitivity Assurance",
        biochemicalTarget: "Complete removal of furocoumarins ensures zero UV phototoxicity during daytime wear.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Ayurvedic Bakuchiol (Babchi))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Ayurvedic Bakuchiol (Babchi) (Bakuchiol (99% Pure Psoralen-Free Grade)) partitions across Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture at pH 4.8 \u2013 6.2, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate silky, cushiony, and completely non-irritating with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (256.38 Da (Rapid Dermal-Epidermal Junction Penetration))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by S-(+)-Bakuchiol (Meroterpene Phenol), bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver retinol-equivalent collagen & blemish renewal with zero peeling, redness, or sun sensitivity.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (5-Alpha-Reductase & Lipoxygenase Blocker)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Reduces squalene oxidation and inflammatory acne lesions by 57% over 6 weeks.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (MMP-1 & MMP-12 Elastase Inhibitor)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Protects existing collagen and elastin networks from UV degradation.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Psoralen-Depleted Safety Standard (<10 ppm))",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Complete removal of furocoumarins ensures zero UV phototoxicity during daytime wear.",
        visibleOutcome: "Lasting improvement in Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Ayurvedic Bakuchiol (Babchi) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Kapha & Vata Rejuvenator \u2014 Renews sluggish cell turnover without Pitta retinoid burn while compounding synergy with Cold-Pressed Rosehip Seed Oil and Sea Buckthorn (Story 01).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture for Ayurvedic Bakuchiol (Babchi) absorption.",
        proTip: "Ayurvedic Bakuchiol (Babchi) maintains peak stability at pH 4.8 \u2013 6.2; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (0.50% \u2013 1.00% Clinical Phyto-Retinol Level)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Ayurvedic Bakuchiol (Babchi)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Ayurvedic Bakuchiol (Babchi) and Cold-Pressed Rosehip Seed Oil into a silky micro-cushion.",
        proTip: "Pre-whipping activates the lipophilic meroterpene phenol matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Fine lines, crow's feet, enlarged po",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture.",
        proTip: "Use featherlight ring-finger pressure so S-(+)-Bakuchiol (Meroterpene Phenol) works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so S-(+)-Bakuchiol (Meroterpene Phenol) and 5-Alpha-Reductase & Lipoxygenase Blocker bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Cold-Pressed Rosehip Seed Oil or Sea Buckthorn (Story 01) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of S-(+)-Bakuchiol (Meroterpene Phenol) across the upper stratum corneum at pH 4.8 \u2013 6.2.",
        experience: "Skin feels silky, cushiony, and completely non-irritating with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in retinol-equivalent collagen & blemish renewal with zero peeling, redness, or sun sensitivity and reduced daily oxidative stress.",
        experience: "Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by 5-Alpha-Reductase & Lipoxygenase Blocker and MMP-1 & MMP-12 Elastase Inhibitor.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Ayurvedic Bakuchiol (Babchi) + Cold-Pressed Rosehip Seed Oil.",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports retinol-equivalent collagen & blemish renewal with zero peeling, redness, or sun sensitivity while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 4.8 \u2013 6.2 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 S-(+)-Bakuchiol (Meroterpene Phenol) and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "rosehip_retinoate",
        partnerName: "Cold-Pressed Rosehip Seed Oil",
        synergyScore: "99/100",
        combinedBenefit: "Synergistic botanical retinoid + essential fatty acid remodeling.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "sea_buckthorn",
        partnerName: "Sea Buckthorn (Story 01)",
        synergyScore: "99/100",
        combinedBenefit: "Omega-7 barrier support + Bakuchiol collagen renewal.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "niacinamide",
        partnerName: "Niacinamide (Vitamin B3)",
        synergyScore: "98/100",
        combinedBenefit: "Doubles pore refinement, dark-spot fading, and fine-line smoothing.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 4.8 \u2013 6.2. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Ayurvedic Bakuchiol (Babchi) work inside Bhumivera formulations?",
        answer: "Isolated from Ayurvedic Babchi seeds and purified to remove phototoxic psoralens (<10 ppm), Bakuchiol upregulates the exact same Type I, III, and IV collagen genes and downregulates 5-alpha-reductase as retinol, yet is 100% photostable for AM/PM use and safe during pregnancy. Its primary bioactive, S-(+)-Bakuchiol (Meroterpene Phenol) (99.2% Chromatographic Purity), targets Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture to deliver retinol-equivalent collagen & blemish renewal with zero peeling, redness, or sun sensitivity.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Ayurvedic Bakuchiol (Babchi)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Ayurvedic Bakuchiol (Babchi)?",
        answer: "Ayurvedic Bakuchiol (Babchi) achieves peak clinical synergy when paired with Cold-Pressed Rosehip Seed Oil (99/100 synergy), Sea Buckthorn (Story 01) (99/100 synergy), and Niacinamide (Vitamin B3) (98/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "bakuchiol_babchi_pair_0",
        label: "Synergy: Cold-Pressed Rosehip Seed Oil",
        prompt: "Tell me about Cold-Pressed Rosehip Seed Oil and how it works with Ayurvedic Bakuchiol (Babchi)",
        category: 'closely_related_ingredient',
      },
      {
        id: "bakuchiol_babchi_pair_1",
        label: "Synergy: Sea Buckthorn (Story 01)",
        prompt: "Tell me about Sea Buckthorn (Story 01) and how it works with Ayurvedic Bakuchiol (Babchi)",
        category: 'closely_related_ingredient',
      },
      {
        id: "bakuchiol_babchi_ritual_steps",
        label: "6-Step Ayurvedic Bakuchiol (Babchi) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Ayurvedic Bakuchiol (Babchi)",
        category: 'usage_and_timing',
      },
      {
        id: "bakuchiol_babchi_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "polyglutamic_acid",
    indexNumber: 31,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 31",
    isHeroStory: false,
    name: "Polyglutamic Acid (Natto Hydro-Lock)",
    fullTitle: "Bio-Fermented Gamma-Polyglutamic Acid (Hyaluronidase-Inhibiting Hydro-Peptide)",
    latinBinomial: "Bacillus subtilis Fermented Gamma-Poly-L-Glutamic Acid",
    inciName: "Polyglutamic Acid",
    category: "Contemporary Active \u00b7 4,000x Water-Binding Hydro-Seal",
    noteFamily: "Fermented Amino-Polymer \u00b7 Hyaluronidase Blocker",
    tagline: "Bio-fermented glutamic acid polypeptide that holds 4x more moisture than Hyaluronic Acid while protecting your skin's native HA.",
    shortSummary: "Capable of binding up to 4,000 times its weight in water, Gamma-Polyglutamic Acid (PGA) forms a breathable hydrogel micro-film on the skin surface while inhibiting hyaluronidase\u2014the enzyme that degrades your skin's own hyaluronic acid.",
    originRegion: "Vegan Plant-Amino Bacillus Subtilis Bio-Fermentation",
    harvestSeason: "Year-Round",
    extractionMethod: "Sterile Submerged Fermentation + Membrane Ultrafiltration",
    concentrationInFormula: "0.30% \u2013 0.50% Hydro-Lock Polymer",
    optimalPhRange: "5.0 \u2013 7.0",
    solubility: "100% Water-Soluble Polypeptide",
    molecularWeightProfile: "700 kDa \u2013 1,100 kDa (Breathable Surface Hydro-Seal)",
    ayurvedicDoshaAffinity: "Vata Replenisher \u2014 Locks in moisture against dry wind and indoor heating",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Dehydrated cheeks, under-eye creases, and moisture-loss zones",
    primaryClinicalBenefit: "Binds 4,000x water weight, blocks HA breakdown, and boosts endogenous NMF",
    sensoryProfile: {
      color: "Crystal Clear Hydrogel",
      aroma: "Odorless",
      skinFeel: "Velvety, pore-blurring, glass-skin finish",
    },
    bioactiveCompounds: [
      {
        compound: "Gamma-Linked L-Glutamic Acid Polymer",
        concentration: "98% Purity",
        role: "4,000x Water-Holding Matrix",
        biochemicalTarget: "Carboxyl side chains trap vast amounts of water in a breathable, non-greasy lattice.",
      },
      {
        compound: "Hyaluronidase Enzyme Inhibitor",
        concentration: "HA Preservation Shield",
        role: "Endogenous Hyaluronic Acid Guardian",
        biochemicalTarget: "Prevents dermal and epidermal hyaluronidase from breaking down native hyaluronic acid.",
      },
      {
        compound: "Endogenous NMF Stimulator (PCA & Urocanic Acid)",
        concentration: "Corneocyte Signal",
        role: "Natural Moisturizing Factor Booster",
        biochemicalTarget: "Clinically shown to increase production of the skin's own L-PCA and lactic acid.",
      },
      {
        compound: "Optical Micro-Relief Smoother",
        concentration: "Surface Film Former",
        role: "Instant Pore & Line Blur",
        biochemicalTarget: "Fills fine surface irregularities for a reflective glass-skin glow.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Polyglutamic Acid (Natto Hydro-Lock))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Polyglutamic Acid (Natto Hydro-Lock) (Polyglutamic Acid) partitions across Dehydrated cheeks, under-eye creases, and moisture-loss zones at pH 5.0 \u2013 7.0, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate velvety, pore-blurring, glass-skin finish with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (700 kDa \u2013 1,100 kDa (Breathable Surface Hydro-Seal))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Gamma-Linked L-Glutamic Acid Polymer, bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver binds 4,000x water weight, blocks ha breakdown, and boosts endogenous nmf.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Hyaluronidase Enzyme Inhibitor)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Prevents dermal and epidermal hyaluronidase from breaking down native hyaluronic acid.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Endogenous NMF Stimulator (PCA & Urocanic Acid))",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Clinically shown to increase production of the skin's own L-PCA and lactic acid.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (Optical Micro-Relief Smoother)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Fills fine surface irregularities for a reflective glass-skin glow.",
        visibleOutcome: "Lasting improvement in Dehydrated cheeks, under-eye creases, and moisture-loss zones clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Polyglutamic Acid (Natto Hydro-Lock) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Vata Replenisher \u2014 Locks in moisture against dry wind and indoor heating while compounding synergy with Multi-Molecular Hyaluronic Acid and Pure Aloe Vera (Story 04).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Dehydrated cheeks, under-eye creases, and moisture-loss zones for Polyglutamic Acid (Natto Hydro-Lock) absorption.",
        proTip: "Polyglutamic Acid (Natto Hydro-Lock) maintains peak stability at pH 5.0 \u2013 7.0; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (0.30% \u2013 0.50% Hydro-Lock Polymer)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Polyglutamic Acid (Natto Hydro-Lock)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Polyglutamic Acid (Natto Hydro-Lock) and Multi-Molecular Hyaluronic Acid into a silky micro-cushion.",
        proTip: "Pre-whipping activates the 100% water-soluble polypeptide matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Dehydrated cheeks, under-eye creases",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Dehydrated cheeks, under-eye creases, and moisture-loss zones.",
        proTip: "Use featherlight ring-finger pressure so Gamma-Linked L-Glutamic Acid Polymer works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Gamma-Linked L-Glutamic Acid Polymer and Hyaluronidase Enzyme Inhibitor bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Multi-Molecular Hyaluronic Acid or Pure Aloe Vera (Story 04) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Gamma-Linked L-Glutamic Acid Polymer across the upper stratum corneum at pH 5.0 \u2013 7.0.",
        experience: "Skin feels velvety, pore-blurring, glass-skin finish with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in binds 4,000x water weight, blocks ha breakdown, and boosts endogenous nmf and reduced daily oxidative stress.",
        experience: "Dehydrated cheeks, under-eye creases, and moisture-loss zones appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Hyaluronidase Enzyme Inhibitor and Endogenous NMF Stimulator (PCA & Urocanic Acid).",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Polyglutamic Acid (Natto Hydro-Lock) + Multi-Molecular Hyaluronic Acid.",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports binds 4,000x water weight, blocks ha breakdown, and boosts endogenous nmf while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Dehydrated cheeks, under-eye creases, and moisture-loss zones.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 5.0 \u2013 7.0 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Gamma-Linked L-Glutamic Acid Polymer and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "hyaluronic_acid",
        partnerName: "Multi-Molecular Hyaluronic Acid",
        synergyScore: "100/100",
        combinedBenefit: "HA penetrates multi-depth layers while PGA seals the surface and stops HA breakdown.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "aloe_vera",
        partnerName: "Pure Aloe Vera (Story 04)",
        synergyScore: "99/100",
        combinedBenefit: "Locks in Aloe Vera's 32% bio-active botanical water for 24 hours.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "vegetable_glycerin",
        partnerName: "Cold-Pressed Botanical Glycerin",
        synergyScore: "97/100",
        combinedBenefit: "Complete surface-to-basal hydration architecture.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 5.0 \u2013 7.0. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Polyglutamic Acid (Natto Hydro-Lock) work inside Bhumivera formulations?",
        answer: "Capable of binding up to 4,000 times its weight in water, Gamma-Polyglutamic Acid (PGA) forms a breathable hydrogel micro-film on the skin surface while inhibiting hyaluronidase\u2014the enzyme that degrades your skin's own hyaluronic acid. Its primary bioactive, Gamma-Linked L-Glutamic Acid Polymer (98% Purity), targets Dehydrated cheeks, under-eye creases, and moisture-loss zones to deliver binds 4,000x water weight, blocks ha breakdown, and boosts endogenous nmf.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Polyglutamic Acid (Natto Hydro-Lock)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Polyglutamic Acid (Natto Hydro-Lock)?",
        answer: "Polyglutamic Acid (Natto Hydro-Lock) achieves peak clinical synergy when paired with Multi-Molecular Hyaluronic Acid (100/100 synergy), Pure Aloe Vera (Story 04) (99/100 synergy), and Cold-Pressed Botanical Glycerin (97/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "polyglutamic_acid_pair_0",
        label: "Synergy: Multi-Molecular Hyaluronic Acid",
        prompt: "Tell me about Multi-Molecular Hyaluronic Acid and how it works with Polyglutamic Acid (Natto Hydro-Lock)",
        category: 'closely_related_ingredient',
      },
      {
        id: "polyglutamic_acid_pair_1",
        label: "Synergy: Pure Aloe Vera (Story 04)",
        prompt: "Tell me about Pure Aloe Vera (Story 04) and how it works with Polyglutamic Acid (Natto Hydro-Lock)",
        category: 'closely_related_ingredient',
      },
      {
        id: "polyglutamic_acid_ritual_steps",
        label: "6-Step Polyglutamic Acid (Natto Hydro-Lock) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Polyglutamic Acid (Natto Hydro-Lock)",
        category: 'usage_and_timing',
      },
      {
        id: "polyglutamic_acid_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
  {
    id: "azelaic_botanical",
    indexNumber: 32,
    storyNumber: "CONTEMPORARY ACTIVE \u00b7 32",
    isHeroStory: false,
    name: "Botanical Azelaic Derivative (PAD)",
    fullTitle: "Potassium Azeloyl Diglycinate (Water-Soluble Azelaic Acid + Glycine Complex)",
    latinBinomial: "Nonanedioic Acid Diglycinate (Sun-Ripened Grain & Botanical Derivative)",
    inciName: "Potassium Azeloyl Diglycinate",
    category: "Contemporary Active \u00b7 Redness, Rosacea & Pigment Normalizer",
    noteFamily: "Dicarboxylic Glycine Complex \u00b7 Sebum & Tone Balancer",
    tagline: "Next-generation water-soluble Azelaic Acid bound with hydrating Glycine to calm rosacea redness, normalize oil, and fade dark marks.",
    shortSummary: "Traditional azelaic acid is gritty and poorly soluble. By condensing Azelaic Acid with two molecules of the hydrating amino acid Glycine, Potassium Azeloyl Diglycinate (PAD) becomes 100% water-soluble at pH 5.2\u2014selectively targeting hyperactive melanocytes, calming facial redness, and regulating sebum.",
    originRegion: "Botanical Oleic Ozonolysis + Amino Acid Glycine Condensation",
    harvestSeason: "Year-Round",
    extractionMethod: "Green Enzymatic Condensation",
    concentrationInFormula: "1.50% \u2013 3.00% Bio-Available PAD Solution",
    optimalPhRange: "5.0 \u2013 6.5",
    solubility: "100% Water-Soluble Amino-Dicarboxylic Derivative",
    molecularWeightProfile: "342.39 Da (Smooth Epidermal Penetration)",
    ayurvedicDoshaAffinity: "Pitta & Kapha Harmonizer \u2014 Cools vascular flushing and clears dark spots",
    pregnancyAndNursingSafe: true,
    comedogenicRating: 0,
    primaryFocusZone: "Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone",
    primaryClinicalBenefit: "Fades both red (PIE) and brown (PIH) marks simultaneously while regulating sebum",
    sensoryProfile: {
      color: "Crystal Clear Aqueous Solution (Zero Grit)",
      aroma: "Odorless",
      skinFeel: "Weightless, hydrating, and calming",
    },
    bioactiveCompounds: [
      {
        compound: "Azeloyl Dicarboxylic Moiety",
        concentration: "Active Azelaic Core",
        role: "Selective Hyperactive Melanocyte Tyrosinase Blocker",
        biochemicalTarget: "Targets only abnormal, hyperactive melanocytes (post-acne marks and melasma) without lightening normal skin.",
      },
      {
        compound: "Dual Glycine Amino Acid Wings",
        concentration: "Hydrating NMF Carrier",
        role: "Elasticity & Moisture Enhancer",
        biochemicalTarget: "Glycine is the primary amino acid of dermal collagen (33%) and epidermal NMF.",
      },
      {
        compound: "Kallikrein-5 & Cathelicidin Modulator",
        concentration: "Anti-Rosacea Pathway",
        role: "Vascular Flushing & Papule Calmer",
        biochemicalTarget: "Downregulates the overactive KLK5-cathelicidin cascade responsible for rosacea redness and bumps.",
      },
      {
        compound: "5-Alpha-Reductase & Keratinization Normalizer",
        concentration: "Pore Refiner",
        role: "Anti-Comedogenic Oil Balancer",
        biochemicalTarget: "Normalizes follicular keratinization and reduces excess sebum shine.",
      },
    ],
    multiStepCellularPathway: [
      {
        step: 1,
        phaseName: "Stage 1 \u00b7 Surface Partitioning & Micellar Contact (Botanical Azelaic Derivative (PAD))",
        timeframe: '0–20 seconds of ritual contact',
        cellularMechanism: "Upon emulsification with lukewarm water, Botanical Azelaic Derivative (PAD) (Potassium Azeloyl Diglycinate) partitions across Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone at pH 5.0 \u2013 6.5, buffering the stratum corneum against mechanical friction.",
        visibleOutcome: "Immediate weightless, hydrating, and calming with zero acid-mantle disruption.",
      },
      {
        step: 2,
        phaseName: "Stage 2 \u00b7 Trans-Corneal & Follicular Delivery (342.39 Da (Smooth Epidermal Penetration))",
        timeframe: '20–60 seconds during zonal massage & dwell',
        cellularMechanism: "Driven by Azeloyl Dicarboxylic Moiety, bioactive molecules traverse the intercellular lipid matrix and follicular ostia to deliver fades both red (pie) and brown (pih) marks simultaneously while regulating sebum.",
        visibleOutcome: 'Pores and surface corneocytes feel clarified, dewy, and receptive to hydration.',
      },
      {
        step: 3,
        phaseName: "Stage 3 \u00b7 Intracellular Receptor & Enzyme Modulation (Dual Glycine Amino Acid Wings)",
        timeframe: '5–90 minutes post-application',
        cellularMechanism: "Glycine is the primary amino acid of dermal collagen (33%) and epidermal NMF.",
        visibleOutcome: 'Visible calming of transient redness, shine, or post-wash tightness.',
      },
      {
        step: 4,
        phaseName: "Stage 4 \u00b7 Circadian Barrier & Antioxidant Shield (Kallikrein-5 & Cathelicidin Modulator)",
        timeframe: '2–12 hours post-ritual',
        cellularMechanism: "Downregulates the overactive KLK5-cathelicidin cascade responsible for rosacea redness and bumps.",
        visibleOutcome: 'Sustained hydration, sebum equilibrium, and protection against urban pollution.',
      },
      {
        step: 5,
        phaseName: "Stage 5 \u00b7 Long-Term Epidermal & Dermal Remodeling (5-Alpha-Reductase & Keratinization Normalizer)",
        timeframe: '14–28 days (Full Epidermal Turnover Cycle)',
        cellularMechanism: "Normalizes follicular keratinization and reduces excess sebum shine.",
        visibleOutcome: "Lasting improvement in Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone clarity, bounce, and uniform luminosity.",
      },
      {
        step: 6,
        phaseName: "Stage 6 \u00b7 Cumulative 84-Day Barrier Longevity (Botanical Azelaic Derivative (PAD) Synergy)",
        timeframe: '29–84 days of twice-daily ritual',
        cellularMechanism: "Harmonizes Pitta & Kapha Harmonizer \u2014 Cools vascular flushing and clears dark spots while compounding synergy with Niacinamide (Vitamin B3) and Centella Asiatica (Gotu Kola).",
        visibleOutcome: 'Resilient, glass-smooth botanical radiance across all seasonal shifts.',
      },
    ],
    stepByStepUsageProtocol: [
      {
        stepNumber: 1,
        title: 'Step 1 · Thermal Water Calibration (28°C–32°C)',
        durationSeconds: 10,
        instruction: "Splash face and neck with lukewarm water (28\u00b0C\u201332\u00b0C) to prepare Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone for Botanical Azelaic Derivative (PAD) absorption.",
        proTip: "Botanical Azelaic Derivative (PAD) maintains peak stability at pH 5.0 \u2013 6.5; lukewarm water preserves epidermal lipid fluidity.",
        commonMistakeToAvoid: 'Using hot shower water (>38°C), which strips ceramides and triggers reactive redness.',
      },
      {
        stepNumber: 2,
        title: "Step 2 \u00b7 Precision Apothecary Dispensing (1.50% \u2013 3.00% Bio-Available PAD Solution)",
        durationSeconds: 5,
        instruction: "Dispense 1 pump (AM) or 1.5 pumps (PM) of your Botanical Azelaic Derivative (PAD)-enriched Bhumivera formula into clean, wet palms.",
        proTip: 'Calibrated micro-dosing ensures optimal bioactive contact without product waste.',
        commonMistakeToAvoid: 'Applying un-emulsified product onto dry skin without water activation.',
      },
      {
        stepNumber: 3,
        title: 'Step 3 · Palm Micro-Foam Emulsification',
        durationSeconds: 10,
        instruction: "Rub wet palms briskly for 8\u201310 seconds to aerate Botanical Azelaic Derivative (PAD) and Niacinamide (Vitamin B3) into a silky micro-cushion.",
        proTip: "Pre-whipping activates the 100% water-soluble amino-dicarboxylic derivative matrix before facial contact.",
        commonMistakeToAvoid: 'Creating friction by lathering directly on delicate cheek skin.',
      },
      {
        stepNumber: 4,
        title: "Step 4 \u00b7 Zonal Massage Across Post-acne red and brown marks (PIE &",
        durationSeconds: 40,
        instruction: "Massage in upward circular motions for 40 seconds, focusing intently on Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone.",
        proTip: "Use featherlight ring-finger pressure so Azeloyl Dicarboxylic Moiety works gently.",
        commonMistakeToAvoid: 'Rushing the massage in under 15 seconds or scrubbing downward.',
      },
      {
        stepNumber: 5,
        title: 'Step 5 · 15-Second Bio-Active Dwell Window',
        durationSeconds: 15,
        instruction: "Allow the botanical veil to rest undisturbed on the skin for 15 seconds so Azeloyl Dicarboxylic Moiety and Dual Glycine Amino Acid Wings bind to the stratum corneum.",
        proTip: 'This 15-second pause transforms a daily cleanse into an active botanical treatment.',
        commonMistakeToAvoid: 'Rinsing off immediately before water- and lipid-soluble actives can partition.',
      },
      {
        stepNumber: 6,
        title: 'Step 6 · Cool Rinse & 60-Second Damp-Skin Seal',
        durationSeconds: 25,
        instruction: "Rinse with 10 splashes of cool-lukewarm water, pat to 15% dampness with a microfiber towel, and lock in with Niacinamide (Vitamin B3) or Centella Asiatica (Gotu Kola) within 60 seconds.",
        proTip: 'Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.',
        commonMistakeToAvoid: 'Allowing damp skin to air-dry completely in front of AC or fans.',
      },
    ],
    clinicalTimeline: [
      {
        milestone: 'Immediate (First Ritual · 0–60 Mins)',
        metrics: "Immediate delivery of Azeloyl Dicarboxylic Moiety across the upper stratum corneum at pH 5.0 \u2013 6.5.",
        experience: "Skin feels weightless, hydrating, and calming with instant comfort.",
      },
      {
        milestone: 'Week 1 (Days 1–7 · 14 Rituals)',
        metrics: "Measurable improvement in fades both red (pie) and brown (pih) marks simultaneously while regulating sebum and reduced daily oxidative stress.",
        experience: "Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone appear calmer, smoother, and more balanced.",
      },
      {
        milestone: 'Cycle 1 (Days 8–28 · Full Epidermal Turnover)',
        metrics: "Full keratinocyte renewal cycle supported by Dual Glycine Amino Acid Wings and Kallikrein-5 & Cathelicidin Modulator.",
        experience: 'Visibly clearer pores, brighter tone, and resilient moisture barrier.',
      },
      {
        milestone: 'Long-Term (Days 29–84 · Dermal Matrix Remodeling)',
        metrics: "Sustained dermal vitality and barrier integrity powered by Botanical Azelaic Derivative (PAD) + Niacinamide (Vitamin B3).",
        experience: 'Signature Bhumivera glass-skin radiance and year-round skin harmony.',
      },
    ],
    skinTypeMatrix: {
      oily: "Highly Compatible (Comedogenic Rating 0/5) \u2014 Balances sebum and keeps pores clear without heaviness.",
      dry: "Nourishing & Protective \u2014 Supports fades both red (pie) and brown (pih) marks simultaneously while regulating sebum while preventing Transepidermal Water Loss.",
      combination: "Ideal \u2014 Harmonizes both oily T-zones and dehydrated cheek contours across Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone.",
      sensitive: "Gentle & Buffered \u2014 Formulated at physiological pH 5.0 \u2013 6.5 with zero harsh sulfates or synthetic sensitizers.",
      acneProne: "Clarifying & Safe \u2014 Non-clogging profile (0/5) calms blemish redness and prevents post-acne marks.",
      mature: "Rejuvenating \u2014 Azeloyl Dicarboxylic Moiety and antioxidants defend dermal collagen and elasticity.",
    },
    synergisticPairings: [
      {
        partnerId: "niacinamide",
        partnerName: "Niacinamide (Vitamin B3)",
        synergyScore: "100/100",
        combinedBenefit: "Unmatched duo for clearing stubborn post-blemish marks and redness.",
        layeringOrder: 'Co-formulated or layered sequentially on damp skin (AM & PM).',
      },
      {
        partnerId: "centella_asiatica",
        partnerName: "Centella Asiatica (Gotu Kola)",
        synergyScore: "99/100",
        combinedBenefit: "Calms rosacea-prone and reactive skin barriers.",
        layeringOrder: 'Apply together during cleansing and immediately post-rinse.',
      },
      {
        partnerId: "sacred_tulsi",
        partnerName: "Sacred Tulsi (Story 03)",
        synergyScore: "98/100",
        combinedBenefit: "Clears active congestion while preventing dark spot formation.",
        layeringOrder: 'Ideal morning and evening companion active.',
      },
    ],
    cautionAndConflicts: "100% compatible with daily AM and PM rituals at pH 5.0 \u2013 6.5. Pregnancy and nursing safe. Patch test if you have a known botanical allergy, and always pair daytime rituals with broad-spectrum SPF 30\u201350.",
    faqs: [
      {
        question: "How does Botanical Azelaic Derivative (PAD) work inside Bhumivera formulations?",
        answer: "Traditional azelaic acid is gritty and poorly soluble. By condensing Azelaic Acid with two molecules of the hydrating amino acid Glycine, Potassium Azeloyl Diglycinate (PAD) becomes 100% water-soluble at pH 5.2\u2014selectively targeting hyperactive melanocytes, calming facial redness, and regulating sebum. Its primary bioactive, Azeloyl Dicarboxylic Moiety (Active Azelaic Core), targets Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone to deliver fades both red (pie) and brown (pih) marks simultaneously while regulating sebum.",
      },
      {
        question: "What is the best time of day and step-by-step method to use Botanical Azelaic Derivative (PAD)?",
        answer: "Use twice daily\u2014in the Morning (7:00 AM\u20139:00 AM) for antioxidant priming and in the Evening (8:00 PM\u201310:30 PM) for deep cellular repair. Emulsify with lukewarm water for 10s, massage for 40s, dwell for 15s, and lock in hydration within 60s of patting damp.",
      },
      {
        question: "Which ingredients pair best with Botanical Azelaic Derivative (PAD)?",
        answer: "Botanical Azelaic Derivative (PAD) achieves peak clinical synergy when paired with Niacinamide (Vitamin B3) (100/100 synergy), Centella Asiatica (Gotu Kola) (99/100 synergy), and Sacred Tulsi (Story 03) (98/100 synergy).",
      },
    ],
    recommendedChips: [
      {
        id: "azelaic_botanical_pair_0",
        label: "Synergy: Niacinamide (Vitamin B3)",
        prompt: "Tell me about Niacinamide (Vitamin B3) and how it works with Botanical Azelaic Derivative (PAD)",
        category: 'closely_related_ingredient',
      },
      {
        id: "azelaic_botanical_pair_1",
        label: "Synergy: Centella Asiatica (Gotu Kola)",
        prompt: "Tell me about Centella Asiatica (Gotu Kola) and how it works with Botanical Azelaic Derivative (PAD)",
        category: 'closely_related_ingredient',
      },
      {
        id: "azelaic_botanical_ritual_steps",
        label: "6-Step Botanical Azelaic Derivative (PAD) Ritual",
        prompt: "Show me the step-by-step application ritual and timing for Botanical Azelaic Derivative (PAD)",
        category: 'usage_and_timing',
      },
      {
        id: "azelaic_botanical_open_all",
        label: 'Explore All 32 Ingredients',
        prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
        category: 'ingredient_deep_dive',
      },
    ],
  },
];

/**
 * Complete Multi-Step Pairwise Botanical-to-Active Synergy Protocols
 * Pairing each of the 4 Hero Stories (Sea Buckthorn, Charcoal, Tulsi, Aloe Vera)
 * with Contemporary Actives across 6-step AM & PM layering sequences.
 */
export const INGREDIENT_PAIRWISE_SYNERGY_PROTOCOLS = [
  {
    protocolId: "sea_buckthorn__x__niacinamide",
    protocolNumber: 1,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "niacinamide",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 05",
    activeName: "Niacinamide (Vitamin B3)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Niacinamide (Vitamin B3) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Niacinamide (Vitamin B3) supplies NAD+ & NADP+ Coenzyme Precursor Ring, targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Niacinamide (Vitamin B3).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Niacinamide (Vitamin B3) (122.12 Da (Rapid Epidermal Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Niacinamide (Vitamin B3) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Niacinamide (Vitamin B3) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__panthenol",
    protocolNumber: 2,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "panthenol",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 06",
    activeName: "D-Panthenol (Pro-Vitamin B5)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + D-Panthenol (Pro-Vitamin B5) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while D-Panthenol (Pro-Vitamin B5) supplies D-Panthenol (Biologically Active D-Enantiomer), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and D-Panthenol (Pro-Vitamin B5).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so D-Panthenol (Pro-Vitamin B5) (205.25 Da (Deep Stratum Corneum Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and D-Panthenol (Pro-Vitamin B5) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + D-Panthenol (Pro-Vitamin B5) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__salicylic_acid",
    protocolNumber: 3,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "salicylic_acid",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 07",
    activeName: "Botanical Salicylic Acid (Willow Bark BHA)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Botanical Salicylic Acid (Willow Bark BHA) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Botanical Salicylic Acid (Willow Bark BHA) supplies 2-Hydroxybenzoic Acid (Bio-Active BHA), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Nose wings, chin, forehead T-zone, blackheads, and congested pores.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Botanical Salicylic Acid (Willow Bark BHA).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Nose wings, chin, forehead T-zone, blackheads, and congested pores to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Botanical Salicylic Acid (Willow Bark BHA) (138.12 Da (Rapid Intra-Follicular Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Botanical Salicylic Acid (Willow Bark BHA) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Botanical Salicylic Acid (Willow Bark BHA) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__hyaluronic_acid",
    protocolNumber: 4,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "hyaluronic_acid",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 08",
    activeName: "Multi-Molecular Hyaluronic Acid",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Multi-Molecular Hyaluronic Acid Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Multi-Molecular Hyaluronic Acid supplies High-Molecular-Weight Sodium Hyaluronate, targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Dehydration lines across forehead, under-eye cheekbones, and parched cheeks.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Multi-Molecular Hyaluronic Acid.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dehydration lines across forehead, under-eye cheekbones, and parched cheeks to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Multi-Molecular Hyaluronic Acid (10 kDa (Oligo) to >2,000 kDa (Crosspolymer)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Multi-Molecular Hyaluronic Acid benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Multi-Molecular Hyaluronic Acid on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__vitamin_c_ethyl",
    protocolNumber: 5,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "vitamin_c_ethyl",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 09",
    activeName: "Vitamin C (3-O-Ethyl Ascorbic Acid)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Vitamin C (3-O-Ethyl Ascorbic Acid) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Vitamin C (3-O-Ethyl Ascorbic Acid) supplies 3-O-Ethyl Ascorbic Acid (86.3% Ascorbic Yield), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Vitamin C (3-O-Ethyl Ascorbic Acid).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Vitamin C (3-O-Ethyl Ascorbic Acid) (204.18 Da (Superior Trans-Corneal Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Vitamin C (3-O-Ethyl Ascorbic Acid) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Vitamin C (3-O-Ethyl Ascorbic Acid) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__tocopherol_vit_e",
    protocolNumber: 6,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "tocopherol_vit_e",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 10",
    activeName: "Vitamin E (D-Alpha Tocopherol)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Vitamin E (D-Alpha Tocopherol) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Vitamin E (D-Alpha Tocopherol) supplies RRR-Alpha-Tocopherol (Natural D-Alpha), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Vitamin E (D-Alpha Tocopherol).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Vitamin E (D-Alpha Tocopherol) (430.71 Da (Lipid Bilayer Anchor)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Vitamin E (D-Alpha Tocopherol) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Vitamin E (D-Alpha Tocopherol) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__allantoin",
    protocolNumber: 7,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "allantoin",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 11",
    activeName: "Botanical Allantoin",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Botanical Allantoin Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Botanical Allantoin supplies Imidazolidinyl-Urea Hydantoin Ring, targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Botanical Allantoin.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Botanical Allantoin (158.12 Da (Fast Epidermal Permeation)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Botanical Allantoin benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Botanical Allantoin on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__vegetable_glycerin",
    protocolNumber: 8,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "vegetable_glycerin",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 12",
    activeName: "Cold-Pressed Botanical Glycerin",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Cold-Pressed Botanical Glycerin Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Cold-Pressed Botanical Glycerin supplies Propane-1,2,3-triol (92.09 Da), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Full face, lips perimeter, hands, and dehydration-prone contours.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Cold-Pressed Botanical Glycerin.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Full face, lips perimeter, hands, and dehydration-prone contours to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Cold-Pressed Botanical Glycerin (92.09 Da (Ultra-Low Dalton Aquaporin-3 Substrate)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Cold-Pressed Botanical Glycerin benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Cold-Pressed Botanical Glycerin on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__centella_asiatica",
    protocolNumber: 9,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "centella_asiatica",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 13",
    activeName: "Centella Asiatica (Gotu Kola / Mandukaparni)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Centella Asiatica (Gotu Kola / Mandukaparni) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Centella Asiatica (Gotu Kola / Mandukaparni) supplies Madecassoside (Pentacyclic Triterpene Saponin), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Centella Asiatica (Gotu Kola / Mandukaparni).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Centella Asiatica (Gotu Kola / Mandukaparni) (488.7 Da (Asiatic Acid) to 975.1 Da (Madecassoside)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Centella Asiatica (Gotu Kola / Mandukaparni) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Centella Asiatica (Gotu Kola / Mandukaparni) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__licorice_glabridin",
    protocolNumber: 10,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "licorice_glabridin",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 14",
    activeName: "Licorice Root (Yashtimadhu / Glabridin)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Licorice Root (Yashtimadhu / Glabridin) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Licorice Root (Yashtimadhu / Glabridin) supplies Glabridin (Prenylated Isoflavan), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH).",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Licorice Root (Yashtimadhu / Glabridin).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH) to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Licorice Root (Yashtimadhu / Glabridin) (324.37 Da (Glabridin) to 840.9 Da (Dipotassium Glycyrrhizate)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Licorice Root (Yashtimadhu / Glabridin) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Licorice Root (Yashtimadhu / Glabridin) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__green_tea_egcg",
    protocolNumber: 11,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "green_tea_egcg",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 15",
    activeName: "Green Tea Polyphenols (EGCG)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Green Tea Polyphenols (EGCG) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Green Tea Polyphenols (EGCG) supplies Epigallocatechin-3-Gallate (EGCG), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Oily T-zone, morning facial puffiness, and UV-exposed contours.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Green Tea Polyphenols (EGCG).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Oily T-zone, morning facial puffiness, and UV-exposed contours to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Green Tea Polyphenols (EGCG) (458.37 Da (Epigallocatechin Gallate)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Green Tea Polyphenols (EGCG) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Green Tea Polyphenols (EGCG) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__turmeric_curcumin",
    protocolNumber: 12,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "turmeric_curcumin",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 16",
    activeName: "Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) supplies Tetrahydrocurcumin (Colorless Bio-Metabolite), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) (372.41 Da (Tetrahydrocurcumin)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__neem_distillate",
    protocolNumber: 13,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "neem_distillate",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 17",
    activeName: "Cold-Distilled Neem Leaf",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Cold-Distilled Neem Leaf Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Cold-Distilled Neem Leaf supplies Nimbidin & Nimbin Tetranortriterpenoids, targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Cold-Distilled Neem Leaf.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Cold-Distilled Neem Leaf (302.24 Da (Quercetin) to 454.5 Da (Nimbolide)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Cold-Distilled Neem Leaf benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Cold-Distilled Neem Leaf on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__rosehip_retinoate",
    protocolNumber: 14,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "rosehip_retinoate",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 18",
    activeName: "Cold-Pressed Rosehip Seed Oil",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Cold-Pressed Rosehip Seed Oil Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Cold-Pressed Rosehip Seed Oil supplies Linoleic Acid (Omega-6 Essential Fatty Acid), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Cold-Pressed Rosehip Seed Oil.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Cold-Pressed Rosehip Seed Oil (278.4 Da (Alpha-Linolenic Acid) to 300.4 Da (All-Trans-Retinoic Derivative)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Cold-Pressed Rosehip Seed Oil benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Cold-Pressed Rosehip Seed Oil on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__kashmiri_saffron",
    protocolNumber: 15,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "kashmiri_saffron",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 19",
    activeName: "Kashmiri Mogra Saffron (Kumkuma)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Kashmiri Mogra Saffron (Kumkuma) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Kashmiri Mogra Saffron (Kumkuma) supplies Crocin & Crocetin (Water-Soluble Carotenoids), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Kashmiri Mogra Saffron (Kumkuma).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Kashmiri Mogra Saffron (Kumkuma) (150.2 Da (Safranal) to 976.9 Da (Crocin)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Kashmiri Mogra Saffron (Kumkuma) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Kashmiri Mogra Saffron (Kumkuma) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__ashwagandha_root",
    protocolNumber: 16,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "ashwagandha_root",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 20",
    activeName: "Adaptogenic Ashwagandha Root",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Adaptogenic Ashwagandha Root Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Adaptogenic Ashwagandha Root supplies Withanolide A, D & Withaferin A, targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Adaptogenic Ashwagandha Root.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Adaptogenic Ashwagandha Root (470.6 Da (Withaferin A & Withanolide D)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Adaptogenic Ashwagandha Root benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Adaptogenic Ashwagandha Root on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__olive_squalane",
    protocolNumber: 17,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "olive_squalane",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 21",
    activeName: "Biomimetic Plant Squalane",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Biomimetic Plant Squalane Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Biomimetic Plant Squalane supplies Fully Saturated C30H62 Branched Alkane, targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Dry patches, under-eye contour, neck, and post-cleanse moisture sealing.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Biomimetic Plant Squalane.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dry patches, under-eye contour, neck, and post-cleanse moisture sealing to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Biomimetic Plant Squalane (422.81 Da (Skin-Identical C30 Branched Alkane)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Biomimetic Plant Squalane benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Biomimetic Plant Squalane on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__ceramide_complex",
    protocolNumber: 18,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "ceramide_complex",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 22",
    activeName: "Ceramide NP / AP / EOP Complex",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Ceramide NP / AP / EOP Complex Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Ceramide NP / AP / EOP Complex supplies Ceramide NP (Ceramide 3), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Ceramide NP / AP / EOP Complex.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Ceramide NP / AP / EOP Complex (565.9 Da (Ceramide NP) to 1,034 Da (Ceramide EOP)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Ceramide NP / AP / EOP Complex benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Ceramide NP / AP / EOP Complex on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__zinc_pca",
    protocolNumber: 19,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "zinc_pca",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 23",
    activeName: "Bio-Chelated Zinc PCA",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Bio-Chelated Zinc PCA Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Bio-Chelated Zinc PCA supplies Bio-Available Ionic Zinc (Zn2+), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Bio-Chelated Zinc PCA.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Bio-Chelated Zinc PCA (321.60 Da (High Follicular Bio-Availability)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Bio-Chelated Zinc PCA benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Bio-Chelated Zinc PCA on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__lactic_acid_aha",
    protocolNumber: 20,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "lactic_acid_aha",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 24",
    activeName: "Fermented Plant Lactic Acid (Gentle AHA)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Fermented Plant Lactic Acid (Gentle AHA) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Fermented Plant Lactic Acid (Gentle AHA) supplies L-(+)-Lactic Acid (Biologically Native Isomer), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Rough, dull forehead, flaky cheek patches, and uneven skin texture.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Fermented Plant Lactic Acid (Gentle AHA).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Rough, dull forehead, flaky cheek patches, and uneven skin texture to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Fermented Plant Lactic Acid (Gentle AHA) (90.08 Da (Controlled Surface Stratum Corneum Action)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Fermented Plant Lactic Acid (Gentle AHA) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Fermented Plant Lactic Acid (Gentle AHA) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__alpha_bisabolol",
    protocolNumber: 21,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "alpha_bisabolol",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 25",
    activeName: "Chamomile Alpha-Bisabolol",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Chamomile Alpha-Bisabolol Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Chamomile Alpha-Bisabolol supplies (-)-Alpha-Bisabolol (Active Levorotatory Isomer), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Chamomile Alpha-Bisabolol.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Chamomile Alpha-Bisabolol (222.37 Da (Deep Epidermal Permeation)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Chamomile Alpha-Bisabolol benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Chamomile Alpha-Bisabolol on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__pomegranate_omega5",
    protocolNumber: 22,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "pomegranate_omega5",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 26",
    activeName: "Pomegranate Seed (Omega-5 & Ellagic Acid)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Pomegranate Seed (Omega-5 & Ellagic Acid) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Pomegranate Seed (Omega-5 & Ellagic Acid) supplies Punicic Acid (Omega-5 Conjugated Trienoic Acid), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Sun-exposed cheekbones, mature contours, fine lines, and dull skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Pomegranate Seed (Omega-5 & Ellagic Acid).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Sun-exposed cheekbones, mature contours, fine lines, and dull skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Pomegranate Seed (Omega-5 & Ellagic Acid) (278.4 Da (Punicic Acid) to 302.19 Da (Ellagic Acid)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Pomegranate Seed (Omega-5 & Ellagic Acid) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Pomegranate Seed (Omega-5 & Ellagic Acid) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__moringa_peptide",
    protocolNumber: 23,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "moringa_peptide",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 27",
    activeName: "Moringa Seed Anti-Pollution Peptide",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Moringa Seed Anti-Pollution Peptide Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Moringa Seed Anti-Pollution Peptide supplies Moringa Cationic Coagulant Peptides (MO2.1), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Full face and neck for commuters and residents of high-AQI urban cities.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Moringa Seed Anti-Pollution Peptide.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Full face and neck for commuters and residents of high-AQI urban cities to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Moringa Seed Anti-Pollution Peptide (6.5 kDa \u2013 13 kDa (Cationic Coagulant Micro-Peptide)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Moringa Seed Anti-Pollution Peptide benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Moringa Seed Anti-Pollution Peptide on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__mysore_sandalwood",
    protocolNumber: 24,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "mysore_sandalwood",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 28",
    activeName: "Mysore Sandalwood Hydrosol (Chandana)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Mysore Sandalwood Hydrosol (Chandana) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Mysore Sandalwood Hydrosol (Chandana) supplies Cis-Alpha-Santalol, targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Mysore Sandalwood Hydrosol (Chandana).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Mysore Sandalwood Hydrosol (Chandana) (220.35 Da (Alpha-Santalol & Beta-Santalol)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Mysore Sandalwood Hydrosol (Chandana) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Mysore Sandalwood Hydrosol (Chandana) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__vetiver_khus",
    protocolNumber: 25,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "vetiver_khus",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 29",
    activeName: "Wild Vetiver Root Distillate (Ushira / Khus)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Wild Vetiver Root Distillate (Ushira / Khus) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Wild Vetiver Root Distillate (Ushira / Khus) supplies Khusimol & Vetiverol (Sesquiterpene Alcohols), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Full face and neck, especially in hot, humid, or air-conditioned environments.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Wild Vetiver Root Distillate (Ushira / Khus).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Full face and neck, especially in hot, humid, or air-conditioned environments to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Wild Vetiver Root Distillate (Ushira / Khus) (220.35 Da (Khusimol & Isovalencenol)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Wild Vetiver Root Distillate (Ushira / Khus) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Wild Vetiver Root Distillate (Ushira / Khus) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__bakuchiol_babchi",
    protocolNumber: 26,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "bakuchiol_babchi",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 30",
    activeName: "Ayurvedic Bakuchiol (Babchi)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Ayurvedic Bakuchiol (Babchi) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Ayurvedic Bakuchiol (Babchi) supplies S-(+)-Bakuchiol (Meroterpene Phenol), targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Ayurvedic Bakuchiol (Babchi).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Ayurvedic Bakuchiol (Babchi) (256.38 Da (Rapid Dermal-Epidermal Junction Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Ayurvedic Bakuchiol (Babchi) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Ayurvedic Bakuchiol (Babchi) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__polyglutamic_acid",
    protocolNumber: 27,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "polyglutamic_acid",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 31",
    activeName: "Polyglutamic Acid (Natto Hydro-Lock)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Polyglutamic Acid (Natto Hydro-Lock) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Polyglutamic Acid (Natto Hydro-Lock) supplies Gamma-Linked L-Glutamic Acid Polymer, targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Dehydrated cheeks, under-eye creases, and moisture-loss zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Polyglutamic Acid (Natto Hydro-Lock).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dehydrated cheeks, under-eye creases, and moisture-loss zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Polyglutamic Acid (Natto Hydro-Lock) (700 kDa \u2013 1,100 kDa (Breathable Surface Hydro-Seal)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Polyglutamic Acid (Natto Hydro-Lock) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Polyglutamic Acid (Natto Hydro-Lock) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sea_buckthorn__x__azelaic_botanical",
    protocolNumber: 28,
    heroIngredientId: "sea_buckthorn",
    heroStoryNumber: "INGREDIENT STORY \u00b7 01",
    heroName: "Sea Buckthorn",
    activeIngredientId: "azelaic_botanical",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 32",
    activeName: "Botanical Azelaic Derivative (PAD)",
    combinedHeadline: "Sea Buckthorn (INGREDIENT STORY \u00b7 01) + Botanical Azelaic Derivative (PAD) Dual-Pathway Ritual",
    optimalCombinedPh: "4.8 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sea Buckthorn delivers Palmitoleic Acid (Omega-7) while Botanical Azelaic Derivative (PAD) supplies Azeloyl Dicarboxylic Moiety, targeting Full face, cheekbone high-points, and lipid-depleted barrier zones and Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sea Buckthorn and Botanical Azelaic Derivative (PAD).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Palmitoleic Acid (Omega-7).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Botanical Azelaic Derivative (PAD) (342.39 Da (Smooth Epidermal Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sea Buckthorn and Botanical Azelaic Derivative (PAD) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sea Buckthorn + Botanical Azelaic Derivative (PAD) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__niacinamide",
    protocolNumber: 29,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "niacinamide",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 05",
    activeName: "Niacinamide (Vitamin B3)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Niacinamide (Vitamin B3) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Niacinamide (Vitamin B3) supplies NAD+ & NADP+ Coenzyme Precursor Ring, targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Niacinamide (Vitamin B3).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Niacinamide (Vitamin B3) (122.12 Da (Rapid Epidermal Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Niacinamide (Vitamin B3) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Niacinamide (Vitamin B3) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__panthenol",
    protocolNumber: 30,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "panthenol",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 06",
    activeName: "D-Panthenol (Pro-Vitamin B5)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + D-Panthenol (Pro-Vitamin B5) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while D-Panthenol (Pro-Vitamin B5) supplies D-Panthenol (Biologically Active D-Enantiomer), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and D-Panthenol (Pro-Vitamin B5).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so D-Panthenol (Pro-Vitamin B5) (205.25 Da (Deep Stratum Corneum Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and D-Panthenol (Pro-Vitamin B5) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + D-Panthenol (Pro-Vitamin B5) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__salicylic_acid",
    protocolNumber: 31,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "salicylic_acid",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 07",
    activeName: "Botanical Salicylic Acid (Willow Bark BHA)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Botanical Salicylic Acid (Willow Bark BHA) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Botanical Salicylic Acid (Willow Bark BHA) supplies 2-Hydroxybenzoic Acid (Bio-Active BHA), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Nose wings, chin, forehead T-zone, blackheads, and congested pores.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Botanical Salicylic Acid (Willow Bark BHA).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Nose wings, chin, forehead T-zone, blackheads, and congested pores to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Botanical Salicylic Acid (Willow Bark BHA) (138.12 Da (Rapid Intra-Follicular Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Botanical Salicylic Acid (Willow Bark BHA) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Botanical Salicylic Acid (Willow Bark BHA) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__hyaluronic_acid",
    protocolNumber: 32,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "hyaluronic_acid",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 08",
    activeName: "Multi-Molecular Hyaluronic Acid",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Multi-Molecular Hyaluronic Acid Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Multi-Molecular Hyaluronic Acid supplies High-Molecular-Weight Sodium Hyaluronate, targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Dehydration lines across forehead, under-eye cheekbones, and parched cheeks.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Multi-Molecular Hyaluronic Acid.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dehydration lines across forehead, under-eye cheekbones, and parched cheeks to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Multi-Molecular Hyaluronic Acid (10 kDa (Oligo) to >2,000 kDa (Crosspolymer)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Multi-Molecular Hyaluronic Acid benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Multi-Molecular Hyaluronic Acid on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__vitamin_c_ethyl",
    protocolNumber: 33,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "vitamin_c_ethyl",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 09",
    activeName: "Vitamin C (3-O-Ethyl Ascorbic Acid)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Vitamin C (3-O-Ethyl Ascorbic Acid) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Vitamin C (3-O-Ethyl Ascorbic Acid) supplies 3-O-Ethyl Ascorbic Acid (86.3% Ascorbic Yield), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Vitamin C (3-O-Ethyl Ascorbic Acid).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Vitamin C (3-O-Ethyl Ascorbic Acid) (204.18 Da (Superior Trans-Corneal Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Vitamin C (3-O-Ethyl Ascorbic Acid) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Vitamin C (3-O-Ethyl Ascorbic Acid) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__tocopherol_vit_e",
    protocolNumber: 34,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "tocopherol_vit_e",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 10",
    activeName: "Vitamin E (D-Alpha Tocopherol)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Vitamin E (D-Alpha Tocopherol) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Vitamin E (D-Alpha Tocopherol) supplies RRR-Alpha-Tocopherol (Natural D-Alpha), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Vitamin E (D-Alpha Tocopherol).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Vitamin E (D-Alpha Tocopherol) (430.71 Da (Lipid Bilayer Anchor)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Vitamin E (D-Alpha Tocopherol) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Vitamin E (D-Alpha Tocopherol) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__allantoin",
    protocolNumber: 35,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "allantoin",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 11",
    activeName: "Botanical Allantoin",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Botanical Allantoin Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Botanical Allantoin supplies Imidazolidinyl-Urea Hydantoin Ring, targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Botanical Allantoin.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Botanical Allantoin (158.12 Da (Fast Epidermal Permeation)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Botanical Allantoin benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Botanical Allantoin on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__vegetable_glycerin",
    protocolNumber: 36,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "vegetable_glycerin",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 12",
    activeName: "Cold-Pressed Botanical Glycerin",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Cold-Pressed Botanical Glycerin Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Cold-Pressed Botanical Glycerin supplies Propane-1,2,3-triol (92.09 Da), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Full face, lips perimeter, hands, and dehydration-prone contours.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Cold-Pressed Botanical Glycerin.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Full face, lips perimeter, hands, and dehydration-prone contours to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Cold-Pressed Botanical Glycerin (92.09 Da (Ultra-Low Dalton Aquaporin-3 Substrate)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Cold-Pressed Botanical Glycerin benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Cold-Pressed Botanical Glycerin on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__centella_asiatica",
    protocolNumber: 37,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "centella_asiatica",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 13",
    activeName: "Centella Asiatica (Gotu Kola / Mandukaparni)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Centella Asiatica (Gotu Kola / Mandukaparni) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Centella Asiatica (Gotu Kola / Mandukaparni) supplies Madecassoside (Pentacyclic Triterpene Saponin), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Centella Asiatica (Gotu Kola / Mandukaparni).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Centella Asiatica (Gotu Kola / Mandukaparni) (488.7 Da (Asiatic Acid) to 975.1 Da (Madecassoside)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Centella Asiatica (Gotu Kola / Mandukaparni) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Centella Asiatica (Gotu Kola / Mandukaparni) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__licorice_glabridin",
    protocolNumber: 38,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "licorice_glabridin",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 14",
    activeName: "Licorice Root (Yashtimadhu / Glabridin)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Licorice Root (Yashtimadhu / Glabridin) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Licorice Root (Yashtimadhu / Glabridin) supplies Glabridin (Prenylated Isoflavan), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH).",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Licorice Root (Yashtimadhu / Glabridin).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH) to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Licorice Root (Yashtimadhu / Glabridin) (324.37 Da (Glabridin) to 840.9 Da (Dipotassium Glycyrrhizate)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Licorice Root (Yashtimadhu / Glabridin) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Licorice Root (Yashtimadhu / Glabridin) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__green_tea_egcg",
    protocolNumber: 39,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "green_tea_egcg",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 15",
    activeName: "Green Tea Polyphenols (EGCG)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Green Tea Polyphenols (EGCG) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Green Tea Polyphenols (EGCG) supplies Epigallocatechin-3-Gallate (EGCG), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Oily T-zone, morning facial puffiness, and UV-exposed contours.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Green Tea Polyphenols (EGCG).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Oily T-zone, morning facial puffiness, and UV-exposed contours to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Green Tea Polyphenols (EGCG) (458.37 Da (Epigallocatechin Gallate)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Green Tea Polyphenols (EGCG) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Green Tea Polyphenols (EGCG) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__turmeric_curcumin",
    protocolNumber: 40,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "turmeric_curcumin",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 16",
    activeName: "Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) supplies Tetrahydrocurcumin (Colorless Bio-Metabolite), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) (372.41 Da (Tetrahydrocurcumin)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__neem_distillate",
    protocolNumber: 41,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "neem_distillate",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 17",
    activeName: "Cold-Distilled Neem Leaf",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Cold-Distilled Neem Leaf Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Cold-Distilled Neem Leaf supplies Nimbidin & Nimbin Tetranortriterpenoids, targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Cold-Distilled Neem Leaf.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Cold-Distilled Neem Leaf (302.24 Da (Quercetin) to 454.5 Da (Nimbolide)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Cold-Distilled Neem Leaf benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Cold-Distilled Neem Leaf on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__rosehip_retinoate",
    protocolNumber: 42,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "rosehip_retinoate",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 18",
    activeName: "Cold-Pressed Rosehip Seed Oil",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Cold-Pressed Rosehip Seed Oil Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Cold-Pressed Rosehip Seed Oil supplies Linoleic Acid (Omega-6 Essential Fatty Acid), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Cold-Pressed Rosehip Seed Oil.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Cold-Pressed Rosehip Seed Oil (278.4 Da (Alpha-Linolenic Acid) to 300.4 Da (All-Trans-Retinoic Derivative)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Cold-Pressed Rosehip Seed Oil benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Cold-Pressed Rosehip Seed Oil on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__kashmiri_saffron",
    protocolNumber: 43,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "kashmiri_saffron",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 19",
    activeName: "Kashmiri Mogra Saffron (Kumkuma)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Kashmiri Mogra Saffron (Kumkuma) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Kashmiri Mogra Saffron (Kumkuma) supplies Crocin & Crocetin (Water-Soluble Carotenoids), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Kashmiri Mogra Saffron (Kumkuma).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Kashmiri Mogra Saffron (Kumkuma) (150.2 Da (Safranal) to 976.9 Da (Crocin)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Kashmiri Mogra Saffron (Kumkuma) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Kashmiri Mogra Saffron (Kumkuma) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__ashwagandha_root",
    protocolNumber: 44,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "ashwagandha_root",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 20",
    activeName: "Adaptogenic Ashwagandha Root",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Adaptogenic Ashwagandha Root Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Adaptogenic Ashwagandha Root supplies Withanolide A, D & Withaferin A, targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Adaptogenic Ashwagandha Root.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Adaptogenic Ashwagandha Root (470.6 Da (Withaferin A & Withanolide D)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Adaptogenic Ashwagandha Root benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Adaptogenic Ashwagandha Root on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__olive_squalane",
    protocolNumber: 45,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "olive_squalane",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 21",
    activeName: "Biomimetic Plant Squalane",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Biomimetic Plant Squalane Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Biomimetic Plant Squalane supplies Fully Saturated C30H62 Branched Alkane, targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Dry patches, under-eye contour, neck, and post-cleanse moisture sealing.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Biomimetic Plant Squalane.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dry patches, under-eye contour, neck, and post-cleanse moisture sealing to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Biomimetic Plant Squalane (422.81 Da (Skin-Identical C30 Branched Alkane)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Biomimetic Plant Squalane benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Biomimetic Plant Squalane on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__ceramide_complex",
    protocolNumber: 46,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "ceramide_complex",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 22",
    activeName: "Ceramide NP / AP / EOP Complex",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Ceramide NP / AP / EOP Complex Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Ceramide NP / AP / EOP Complex supplies Ceramide NP (Ceramide 3), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Ceramide NP / AP / EOP Complex.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Ceramide NP / AP / EOP Complex (565.9 Da (Ceramide NP) to 1,034 Da (Ceramide EOP)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Ceramide NP / AP / EOP Complex benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Ceramide NP / AP / EOP Complex on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__zinc_pca",
    protocolNumber: 47,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "zinc_pca",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 23",
    activeName: "Bio-Chelated Zinc PCA",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Bio-Chelated Zinc PCA Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Bio-Chelated Zinc PCA supplies Bio-Available Ionic Zinc (Zn2+), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Bio-Chelated Zinc PCA.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Bio-Chelated Zinc PCA (321.60 Da (High Follicular Bio-Availability)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Bio-Chelated Zinc PCA benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Bio-Chelated Zinc PCA on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__lactic_acid_aha",
    protocolNumber: 48,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "lactic_acid_aha",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 24",
    activeName: "Fermented Plant Lactic Acid (Gentle AHA)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Fermented Plant Lactic Acid (Gentle AHA) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Fermented Plant Lactic Acid (Gentle AHA) supplies L-(+)-Lactic Acid (Biologically Native Isomer), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Rough, dull forehead, flaky cheek patches, and uneven skin texture.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Fermented Plant Lactic Acid (Gentle AHA).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Rough, dull forehead, flaky cheek patches, and uneven skin texture to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Fermented Plant Lactic Acid (Gentle AHA) (90.08 Da (Controlled Surface Stratum Corneum Action)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Fermented Plant Lactic Acid (Gentle AHA) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Fermented Plant Lactic Acid (Gentle AHA) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__alpha_bisabolol",
    protocolNumber: 49,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "alpha_bisabolol",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 25",
    activeName: "Chamomile Alpha-Bisabolol",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Chamomile Alpha-Bisabolol Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Chamomile Alpha-Bisabolol supplies (-)-Alpha-Bisabolol (Active Levorotatory Isomer), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Chamomile Alpha-Bisabolol.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Chamomile Alpha-Bisabolol (222.37 Da (Deep Epidermal Permeation)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Chamomile Alpha-Bisabolol benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Chamomile Alpha-Bisabolol on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__pomegranate_omega5",
    protocolNumber: 50,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "pomegranate_omega5",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 26",
    activeName: "Pomegranate Seed (Omega-5 & Ellagic Acid)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Pomegranate Seed (Omega-5 & Ellagic Acid) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Pomegranate Seed (Omega-5 & Ellagic Acid) supplies Punicic Acid (Omega-5 Conjugated Trienoic Acid), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Sun-exposed cheekbones, mature contours, fine lines, and dull skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Pomegranate Seed (Omega-5 & Ellagic Acid).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Sun-exposed cheekbones, mature contours, fine lines, and dull skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Pomegranate Seed (Omega-5 & Ellagic Acid) (278.4 Da (Punicic Acid) to 302.19 Da (Ellagic Acid)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Pomegranate Seed (Omega-5 & Ellagic Acid) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Pomegranate Seed (Omega-5 & Ellagic Acid) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__moringa_peptide",
    protocolNumber: 51,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "moringa_peptide",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 27",
    activeName: "Moringa Seed Anti-Pollution Peptide",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Moringa Seed Anti-Pollution Peptide Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Moringa Seed Anti-Pollution Peptide supplies Moringa Cationic Coagulant Peptides (MO2.1), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Full face and neck for commuters and residents of high-AQI urban cities.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Moringa Seed Anti-Pollution Peptide.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Full face and neck for commuters and residents of high-AQI urban cities to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Moringa Seed Anti-Pollution Peptide (6.5 kDa \u2013 13 kDa (Cationic Coagulant Micro-Peptide)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Moringa Seed Anti-Pollution Peptide benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Moringa Seed Anti-Pollution Peptide on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__mysore_sandalwood",
    protocolNumber: 52,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "mysore_sandalwood",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 28",
    activeName: "Mysore Sandalwood Hydrosol (Chandana)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Mysore Sandalwood Hydrosol (Chandana) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Mysore Sandalwood Hydrosol (Chandana) supplies Cis-Alpha-Santalol, targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Mysore Sandalwood Hydrosol (Chandana).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Mysore Sandalwood Hydrosol (Chandana) (220.35 Da (Alpha-Santalol & Beta-Santalol)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Mysore Sandalwood Hydrosol (Chandana) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Mysore Sandalwood Hydrosol (Chandana) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__vetiver_khus",
    protocolNumber: 53,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "vetiver_khus",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 29",
    activeName: "Wild Vetiver Root Distillate (Ushira / Khus)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Wild Vetiver Root Distillate (Ushira / Khus) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Wild Vetiver Root Distillate (Ushira / Khus) supplies Khusimol & Vetiverol (Sesquiterpene Alcohols), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Full face and neck, especially in hot, humid, or air-conditioned environments.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Wild Vetiver Root Distillate (Ushira / Khus).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Full face and neck, especially in hot, humid, or air-conditioned environments to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Wild Vetiver Root Distillate (Ushira / Khus) (220.35 Da (Khusimol & Isovalencenol)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Wild Vetiver Root Distillate (Ushira / Khus) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Wild Vetiver Root Distillate (Ushira / Khus) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__bakuchiol_babchi",
    protocolNumber: 54,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "bakuchiol_babchi",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 30",
    activeName: "Ayurvedic Bakuchiol (Babchi)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Ayurvedic Bakuchiol (Babchi) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Ayurvedic Bakuchiol (Babchi) supplies S-(+)-Bakuchiol (Meroterpene Phenol), targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Ayurvedic Bakuchiol (Babchi).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Ayurvedic Bakuchiol (Babchi) (256.38 Da (Rapid Dermal-Epidermal Junction Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Ayurvedic Bakuchiol (Babchi) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Ayurvedic Bakuchiol (Babchi) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__polyglutamic_acid",
    protocolNumber: 55,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "polyglutamic_acid",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 31",
    activeName: "Polyglutamic Acid (Natto Hydro-Lock)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Polyglutamic Acid (Natto Hydro-Lock) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Polyglutamic Acid (Natto Hydro-Lock) supplies Gamma-Linked L-Glutamic Acid Polymer, targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Dehydrated cheeks, under-eye creases, and moisture-loss zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Polyglutamic Acid (Natto Hydro-Lock).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dehydrated cheeks, under-eye creases, and moisture-loss zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Polyglutamic Acid (Natto Hydro-Lock) (700 kDa \u2013 1,100 kDa (Breathable Surface Hydro-Seal)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Polyglutamic Acid (Natto Hydro-Lock) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Polyglutamic Acid (Natto Hydro-Lock) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "activated_charcoal__x__azelaic_botanical",
    protocolNumber: 56,
    heroIngredientId: "activated_charcoal",
    heroStoryNumber: "INGREDIENT STORY \u00b7 02",
    heroName: "Activated Bamboo Charcoal",
    activeIngredientId: "azelaic_botanical",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 32",
    activeName: "Botanical Azelaic Derivative (PAD)",
    combinedHeadline: "Activated Bamboo Charcoal (INGREDIENT STORY \u00b7 02) + Botanical Azelaic Derivative (PAD) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.8",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Activated Bamboo Charcoal delivers Microporous & Mesoporous Carbon Lattice while Botanical Azelaic Derivative (PAD) supplies Azeloyl Dicarboxylic Moiety, targeting T-zone, nasal wings, chin crease, and urban pollution-exposed areas and Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Activated Bamboo Charcoal and Botanical Azelaic Derivative (PAD).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Microporous & Mesoporous Carbon Lattice.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Botanical Azelaic Derivative (PAD) (342.39 Da (Smooth Epidermal Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Activated Bamboo Charcoal and Botanical Azelaic Derivative (PAD) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Activated Bamboo Charcoal + Botanical Azelaic Derivative (PAD) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__niacinamide",
    protocolNumber: 57,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "niacinamide",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 05",
    activeName: "Niacinamide (Vitamin B3)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Niacinamide (Vitamin B3) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Niacinamide (Vitamin B3) supplies NAD+ & NADP+ Coenzyme Precursor Ring, targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Niacinamide (Vitamin B3).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Niacinamide (Vitamin B3) (122.12 Da (Rapid Epidermal Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Niacinamide (Vitamin B3) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Niacinamide (Vitamin B3) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__panthenol",
    protocolNumber: 58,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "panthenol",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 06",
    activeName: "D-Panthenol (Pro-Vitamin B5)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + D-Panthenol (Pro-Vitamin B5) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while D-Panthenol (Pro-Vitamin B5) supplies D-Panthenol (Biologically Active D-Enantiomer), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and D-Panthenol (Pro-Vitamin B5).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so D-Panthenol (Pro-Vitamin B5) (205.25 Da (Deep Stratum Corneum Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and D-Panthenol (Pro-Vitamin B5) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + D-Panthenol (Pro-Vitamin B5) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__salicylic_acid",
    protocolNumber: 59,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "salicylic_acid",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 07",
    activeName: "Botanical Salicylic Acid (Willow Bark BHA)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Botanical Salicylic Acid (Willow Bark BHA) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Botanical Salicylic Acid (Willow Bark BHA) supplies 2-Hydroxybenzoic Acid (Bio-Active BHA), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Nose wings, chin, forehead T-zone, blackheads, and congested pores.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Botanical Salicylic Acid (Willow Bark BHA).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Nose wings, chin, forehead T-zone, blackheads, and congested pores to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Botanical Salicylic Acid (Willow Bark BHA) (138.12 Da (Rapid Intra-Follicular Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Botanical Salicylic Acid (Willow Bark BHA) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Botanical Salicylic Acid (Willow Bark BHA) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__hyaluronic_acid",
    protocolNumber: 60,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "hyaluronic_acid",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 08",
    activeName: "Multi-Molecular Hyaluronic Acid",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Multi-Molecular Hyaluronic Acid Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Multi-Molecular Hyaluronic Acid supplies High-Molecular-Weight Sodium Hyaluronate, targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Dehydration lines across forehead, under-eye cheekbones, and parched cheeks.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Multi-Molecular Hyaluronic Acid.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dehydration lines across forehead, under-eye cheekbones, and parched cheeks to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Multi-Molecular Hyaluronic Acid (10 kDa (Oligo) to >2,000 kDa (Crosspolymer)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Multi-Molecular Hyaluronic Acid benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Multi-Molecular Hyaluronic Acid on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__vitamin_c_ethyl",
    protocolNumber: 61,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "vitamin_c_ethyl",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 09",
    activeName: "Vitamin C (3-O-Ethyl Ascorbic Acid)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Vitamin C (3-O-Ethyl Ascorbic Acid) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Vitamin C (3-O-Ethyl Ascorbic Acid) supplies 3-O-Ethyl Ascorbic Acid (86.3% Ascorbic Yield), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Vitamin C (3-O-Ethyl Ascorbic Acid).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Vitamin C (3-O-Ethyl Ascorbic Acid) (204.18 Da (Superior Trans-Corneal Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Vitamin C (3-O-Ethyl Ascorbic Acid) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Vitamin C (3-O-Ethyl Ascorbic Acid) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__tocopherol_vit_e",
    protocolNumber: 62,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "tocopherol_vit_e",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 10",
    activeName: "Vitamin E (D-Alpha Tocopherol)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Vitamin E (D-Alpha Tocopherol) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Vitamin E (D-Alpha Tocopherol) supplies RRR-Alpha-Tocopherol (Natural D-Alpha), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Vitamin E (D-Alpha Tocopherol).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Vitamin E (D-Alpha Tocopherol) (430.71 Da (Lipid Bilayer Anchor)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Vitamin E (D-Alpha Tocopherol) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Vitamin E (D-Alpha Tocopherol) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__allantoin",
    protocolNumber: 63,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "allantoin",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 11",
    activeName: "Botanical Allantoin",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Botanical Allantoin Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Botanical Allantoin supplies Imidazolidinyl-Urea Hydantoin Ring, targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Botanical Allantoin.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Botanical Allantoin (158.12 Da (Fast Epidermal Permeation)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Botanical Allantoin benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Botanical Allantoin on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__vegetable_glycerin",
    protocolNumber: 64,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "vegetable_glycerin",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 12",
    activeName: "Cold-Pressed Botanical Glycerin",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Cold-Pressed Botanical Glycerin Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Cold-Pressed Botanical Glycerin supplies Propane-1,2,3-triol (92.09 Da), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Full face, lips perimeter, hands, and dehydration-prone contours.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Cold-Pressed Botanical Glycerin.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Full face, lips perimeter, hands, and dehydration-prone contours to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Cold-Pressed Botanical Glycerin (92.09 Da (Ultra-Low Dalton Aquaporin-3 Substrate)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Cold-Pressed Botanical Glycerin benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Cold-Pressed Botanical Glycerin on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__centella_asiatica",
    protocolNumber: 65,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "centella_asiatica",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 13",
    activeName: "Centella Asiatica (Gotu Kola / Mandukaparni)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Centella Asiatica (Gotu Kola / Mandukaparni) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Centella Asiatica (Gotu Kola / Mandukaparni) supplies Madecassoside (Pentacyclic Triterpene Saponin), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Centella Asiatica (Gotu Kola / Mandukaparni).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Centella Asiatica (Gotu Kola / Mandukaparni) (488.7 Da (Asiatic Acid) to 975.1 Da (Madecassoside)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Centella Asiatica (Gotu Kola / Mandukaparni) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Centella Asiatica (Gotu Kola / Mandukaparni) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__licorice_glabridin",
    protocolNumber: 66,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "licorice_glabridin",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 14",
    activeName: "Licorice Root (Yashtimadhu / Glabridin)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Licorice Root (Yashtimadhu / Glabridin) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Licorice Root (Yashtimadhu / Glabridin) supplies Glabridin (Prenylated Isoflavan), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH).",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Licorice Root (Yashtimadhu / Glabridin).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH) to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Licorice Root (Yashtimadhu / Glabridin) (324.37 Da (Glabridin) to 840.9 Da (Dipotassium Glycyrrhizate)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Licorice Root (Yashtimadhu / Glabridin) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Licorice Root (Yashtimadhu / Glabridin) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__green_tea_egcg",
    protocolNumber: 67,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "green_tea_egcg",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 15",
    activeName: "Green Tea Polyphenols (EGCG)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Green Tea Polyphenols (EGCG) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Green Tea Polyphenols (EGCG) supplies Epigallocatechin-3-Gallate (EGCG), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Oily T-zone, morning facial puffiness, and UV-exposed contours.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Green Tea Polyphenols (EGCG).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Oily T-zone, morning facial puffiness, and UV-exposed contours to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Green Tea Polyphenols (EGCG) (458.37 Da (Epigallocatechin Gallate)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Green Tea Polyphenols (EGCG) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Green Tea Polyphenols (EGCG) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__turmeric_curcumin",
    protocolNumber: 68,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "turmeric_curcumin",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 16",
    activeName: "Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) supplies Tetrahydrocurcumin (Colorless Bio-Metabolite), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) (372.41 Da (Tetrahydrocurcumin)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__neem_distillate",
    protocolNumber: 69,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "neem_distillate",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 17",
    activeName: "Cold-Distilled Neem Leaf",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Cold-Distilled Neem Leaf Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Cold-Distilled Neem Leaf supplies Nimbidin & Nimbin Tetranortriterpenoids, targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Cold-Distilled Neem Leaf.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Cold-Distilled Neem Leaf (302.24 Da (Quercetin) to 454.5 Da (Nimbolide)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Cold-Distilled Neem Leaf benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Cold-Distilled Neem Leaf on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__rosehip_retinoate",
    protocolNumber: 70,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "rosehip_retinoate",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 18",
    activeName: "Cold-Pressed Rosehip Seed Oil",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Cold-Pressed Rosehip Seed Oil Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Cold-Pressed Rosehip Seed Oil supplies Linoleic Acid (Omega-6 Essential Fatty Acid), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Cold-Pressed Rosehip Seed Oil.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Cold-Pressed Rosehip Seed Oil (278.4 Da (Alpha-Linolenic Acid) to 300.4 Da (All-Trans-Retinoic Derivative)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Cold-Pressed Rosehip Seed Oil benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Cold-Pressed Rosehip Seed Oil on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__kashmiri_saffron",
    protocolNumber: 71,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "kashmiri_saffron",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 19",
    activeName: "Kashmiri Mogra Saffron (Kumkuma)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Kashmiri Mogra Saffron (Kumkuma) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Kashmiri Mogra Saffron (Kumkuma) supplies Crocin & Crocetin (Water-Soluble Carotenoids), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Kashmiri Mogra Saffron (Kumkuma).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Kashmiri Mogra Saffron (Kumkuma) (150.2 Da (Safranal) to 976.9 Da (Crocin)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Kashmiri Mogra Saffron (Kumkuma) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Kashmiri Mogra Saffron (Kumkuma) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__ashwagandha_root",
    protocolNumber: 72,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "ashwagandha_root",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 20",
    activeName: "Adaptogenic Ashwagandha Root",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Adaptogenic Ashwagandha Root Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Adaptogenic Ashwagandha Root supplies Withanolide A, D & Withaferin A, targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Adaptogenic Ashwagandha Root.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Adaptogenic Ashwagandha Root (470.6 Da (Withaferin A & Withanolide D)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Adaptogenic Ashwagandha Root benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Adaptogenic Ashwagandha Root on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__olive_squalane",
    protocolNumber: 73,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "olive_squalane",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 21",
    activeName: "Biomimetic Plant Squalane",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Biomimetic Plant Squalane Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Biomimetic Plant Squalane supplies Fully Saturated C30H62 Branched Alkane, targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Dry patches, under-eye contour, neck, and post-cleanse moisture sealing.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Biomimetic Plant Squalane.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dry patches, under-eye contour, neck, and post-cleanse moisture sealing to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Biomimetic Plant Squalane (422.81 Da (Skin-Identical C30 Branched Alkane)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Biomimetic Plant Squalane benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Biomimetic Plant Squalane on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__ceramide_complex",
    protocolNumber: 74,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "ceramide_complex",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 22",
    activeName: "Ceramide NP / AP / EOP Complex",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Ceramide NP / AP / EOP Complex Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Ceramide NP / AP / EOP Complex supplies Ceramide NP (Ceramide 3), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Ceramide NP / AP / EOP Complex.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Ceramide NP / AP / EOP Complex (565.9 Da (Ceramide NP) to 1,034 Da (Ceramide EOP)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Ceramide NP / AP / EOP Complex benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Ceramide NP / AP / EOP Complex on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__zinc_pca",
    protocolNumber: 75,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "zinc_pca",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 23",
    activeName: "Bio-Chelated Zinc PCA",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Bio-Chelated Zinc PCA Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Bio-Chelated Zinc PCA supplies Bio-Available Ionic Zinc (Zn2+), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Bio-Chelated Zinc PCA.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Bio-Chelated Zinc PCA (321.60 Da (High Follicular Bio-Availability)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Bio-Chelated Zinc PCA benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Bio-Chelated Zinc PCA on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__lactic_acid_aha",
    protocolNumber: 76,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "lactic_acid_aha",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 24",
    activeName: "Fermented Plant Lactic Acid (Gentle AHA)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Fermented Plant Lactic Acid (Gentle AHA) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Fermented Plant Lactic Acid (Gentle AHA) supplies L-(+)-Lactic Acid (Biologically Native Isomer), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Rough, dull forehead, flaky cheek patches, and uneven skin texture.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Fermented Plant Lactic Acid (Gentle AHA).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Rough, dull forehead, flaky cheek patches, and uneven skin texture to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Fermented Plant Lactic Acid (Gentle AHA) (90.08 Da (Controlled Surface Stratum Corneum Action)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Fermented Plant Lactic Acid (Gentle AHA) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Fermented Plant Lactic Acid (Gentle AHA) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__alpha_bisabolol",
    protocolNumber: 77,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "alpha_bisabolol",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 25",
    activeName: "Chamomile Alpha-Bisabolol",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Chamomile Alpha-Bisabolol Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Chamomile Alpha-Bisabolol supplies (-)-Alpha-Bisabolol (Active Levorotatory Isomer), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Chamomile Alpha-Bisabolol.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Chamomile Alpha-Bisabolol (222.37 Da (Deep Epidermal Permeation)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Chamomile Alpha-Bisabolol benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Chamomile Alpha-Bisabolol on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__pomegranate_omega5",
    protocolNumber: 78,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "pomegranate_omega5",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 26",
    activeName: "Pomegranate Seed (Omega-5 & Ellagic Acid)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Pomegranate Seed (Omega-5 & Ellagic Acid) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Pomegranate Seed (Omega-5 & Ellagic Acid) supplies Punicic Acid (Omega-5 Conjugated Trienoic Acid), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Sun-exposed cheekbones, mature contours, fine lines, and dull skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Pomegranate Seed (Omega-5 & Ellagic Acid).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Sun-exposed cheekbones, mature contours, fine lines, and dull skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Pomegranate Seed (Omega-5 & Ellagic Acid) (278.4 Da (Punicic Acid) to 302.19 Da (Ellagic Acid)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Pomegranate Seed (Omega-5 & Ellagic Acid) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Pomegranate Seed (Omega-5 & Ellagic Acid) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__moringa_peptide",
    protocolNumber: 79,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "moringa_peptide",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 27",
    activeName: "Moringa Seed Anti-Pollution Peptide",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Moringa Seed Anti-Pollution Peptide Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Moringa Seed Anti-Pollution Peptide supplies Moringa Cationic Coagulant Peptides (MO2.1), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Full face and neck for commuters and residents of high-AQI urban cities.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Moringa Seed Anti-Pollution Peptide.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Full face and neck for commuters and residents of high-AQI urban cities to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Moringa Seed Anti-Pollution Peptide (6.5 kDa \u2013 13 kDa (Cationic Coagulant Micro-Peptide)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Moringa Seed Anti-Pollution Peptide benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Moringa Seed Anti-Pollution Peptide on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__mysore_sandalwood",
    protocolNumber: 80,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "mysore_sandalwood",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 28",
    activeName: "Mysore Sandalwood Hydrosol (Chandana)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Mysore Sandalwood Hydrosol (Chandana) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Mysore Sandalwood Hydrosol (Chandana) supplies Cis-Alpha-Santalol, targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Mysore Sandalwood Hydrosol (Chandana).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Mysore Sandalwood Hydrosol (Chandana) (220.35 Da (Alpha-Santalol & Beta-Santalol)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Mysore Sandalwood Hydrosol (Chandana) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Mysore Sandalwood Hydrosol (Chandana) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__vetiver_khus",
    protocolNumber: 81,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "vetiver_khus",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 29",
    activeName: "Wild Vetiver Root Distillate (Ushira / Khus)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Wild Vetiver Root Distillate (Ushira / Khus) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Wild Vetiver Root Distillate (Ushira / Khus) supplies Khusimol & Vetiverol (Sesquiterpene Alcohols), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Full face and neck, especially in hot, humid, or air-conditioned environments.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Wild Vetiver Root Distillate (Ushira / Khus).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Full face and neck, especially in hot, humid, or air-conditioned environments to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Wild Vetiver Root Distillate (Ushira / Khus) (220.35 Da (Khusimol & Isovalencenol)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Wild Vetiver Root Distillate (Ushira / Khus) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Wild Vetiver Root Distillate (Ushira / Khus) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__bakuchiol_babchi",
    protocolNumber: 82,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "bakuchiol_babchi",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 30",
    activeName: "Ayurvedic Bakuchiol (Babchi)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Ayurvedic Bakuchiol (Babchi) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Ayurvedic Bakuchiol (Babchi) supplies S-(+)-Bakuchiol (Meroterpene Phenol), targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Ayurvedic Bakuchiol (Babchi).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Ayurvedic Bakuchiol (Babchi) (256.38 Da (Rapid Dermal-Epidermal Junction Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Ayurvedic Bakuchiol (Babchi) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Ayurvedic Bakuchiol (Babchi) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__polyglutamic_acid",
    protocolNumber: 83,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "polyglutamic_acid",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 31",
    activeName: "Polyglutamic Acid (Natto Hydro-Lock)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Polyglutamic Acid (Natto Hydro-Lock) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Polyglutamic Acid (Natto Hydro-Lock) supplies Gamma-Linked L-Glutamic Acid Polymer, targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Dehydrated cheeks, under-eye creases, and moisture-loss zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Polyglutamic Acid (Natto Hydro-Lock).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dehydrated cheeks, under-eye creases, and moisture-loss zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Polyglutamic Acid (Natto Hydro-Lock) (700 kDa \u2013 1,100 kDa (Breathable Surface Hydro-Seal)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Polyglutamic Acid (Natto Hydro-Lock) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Polyglutamic Acid (Natto Hydro-Lock) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "sacred_tulsi__x__azelaic_botanical",
    protocolNumber: 84,
    heroIngredientId: "sacred_tulsi",
    heroStoryNumber: "INGREDIENT STORY \u00b7 03",
    heroName: "Sacred Tulsi (Holy Basil)",
    activeIngredientId: "azelaic_botanical",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 32",
    activeName: "Botanical Azelaic Derivative (PAD)",
    combinedHeadline: "Sacred Tulsi (Holy Basil) (INGREDIENT STORY \u00b7 03) + Botanical Azelaic Derivative (PAD) Dual-Pathway Ritual",
    optimalCombinedPh: "5.0 \u2013 5.6",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Sacred Tulsi (Holy Basil) delivers Ursolic Acid & Oleanolic Acid while Botanical Azelaic Derivative (PAD) supplies Azeloyl Dicarboxylic Moiety, targeting Jawline hormonal zones, cheeks, forehead, and blemish-prone areas and Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Sacred Tulsi (Holy Basil) and Botanical Azelaic Derivative (PAD).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Ursolic Acid & Oleanolic Acid.",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Botanical Azelaic Derivative (PAD) (342.39 Da (Smooth Epidermal Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Sacred Tulsi (Holy Basil) and Botanical Azelaic Derivative (PAD) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Sacred Tulsi (Holy Basil) + Botanical Azelaic Derivative (PAD) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__niacinamide",
    protocolNumber: 85,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "niacinamide",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 05",
    activeName: "Niacinamide (Vitamin B3)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Niacinamide (Vitamin B3) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Niacinamide (Vitamin B3) supplies NAD+ & NADP+ Coenzyme Precursor Ring, targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Niacinamide (Vitamin B3).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Enlarged pores on nose/cheeks, hyperpigmented marks, and weakened barrier zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Niacinamide (Vitamin B3) (122.12 Da (Rapid Epidermal Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Niacinamide (Vitamin B3) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Niacinamide (Vitamin B3) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__panthenol",
    protocolNumber: 86,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "panthenol",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 06",
    activeName: "D-Panthenol (Pro-Vitamin B5)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + D-Panthenol (Pro-Vitamin B5) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while D-Panthenol (Pro-Vitamin B5) supplies D-Panthenol (Biologically Active D-Enantiomer), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and D-Panthenol (Pro-Vitamin B5).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dehydrated cheeks, nasolabial creases, post-blemish spots, and active-sensitized skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so D-Panthenol (Pro-Vitamin B5) (205.25 Da (Deep Stratum Corneum Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and D-Panthenol (Pro-Vitamin B5) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + D-Panthenol (Pro-Vitamin B5) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__salicylic_acid",
    protocolNumber: 87,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "salicylic_acid",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 07",
    activeName: "Botanical Salicylic Acid (Willow Bark BHA)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Botanical Salicylic Acid (Willow Bark BHA) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Botanical Salicylic Acid (Willow Bark BHA) supplies 2-Hydroxybenzoic Acid (Bio-Active BHA), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Nose wings, chin, forehead T-zone, blackheads, and congested pores.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Botanical Salicylic Acid (Willow Bark BHA).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Nose wings, chin, forehead T-zone, blackheads, and congested pores to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Botanical Salicylic Acid (Willow Bark BHA) (138.12 Da (Rapid Intra-Follicular Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Botanical Salicylic Acid (Willow Bark BHA) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Botanical Salicylic Acid (Willow Bark BHA) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__hyaluronic_acid",
    protocolNumber: 88,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "hyaluronic_acid",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 08",
    activeName: "Multi-Molecular Hyaluronic Acid",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Multi-Molecular Hyaluronic Acid Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Multi-Molecular Hyaluronic Acid supplies High-Molecular-Weight Sodium Hyaluronate, targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Dehydration lines across forehead, under-eye cheekbones, and parched cheeks.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Multi-Molecular Hyaluronic Acid.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dehydration lines across forehead, under-eye cheekbones, and parched cheeks to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Multi-Molecular Hyaluronic Acid (10 kDa (Oligo) to >2,000 kDa (Crosspolymer)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Multi-Molecular Hyaluronic Acid benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Multi-Molecular Hyaluronic Acid on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__vitamin_c_ethyl",
    protocolNumber: 89,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "vitamin_c_ethyl",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 09",
    activeName: "Vitamin C (3-O-Ethyl Ascorbic Acid)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Vitamin C (3-O-Ethyl Ascorbic Acid) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Vitamin C (3-O-Ethyl Ascorbic Acid) supplies 3-O-Ethyl Ascorbic Acid (86.3% Ascorbic Yield), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Vitamin C (3-O-Ethyl Ascorbic Acid).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Cheekbones, hyperpigmented dark spots, post-acne marks, and dull areas to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Vitamin C (3-O-Ethyl Ascorbic Acid) (204.18 Da (Superior Trans-Corneal Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Vitamin C (3-O-Ethyl Ascorbic Acid) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Vitamin C (3-O-Ethyl Ascorbic Acid) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__tocopherol_vit_e",
    protocolNumber: 90,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "tocopherol_vit_e",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 10",
    activeName: "Vitamin E (D-Alpha Tocopherol)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Vitamin E (D-Alpha Tocopherol) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Vitamin E (D-Alpha Tocopherol) supplies RRR-Alpha-Tocopherol (Natural D-Alpha), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Vitamin E (D-Alpha Tocopherol).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Lipid-depleted cheeks, neck, chest, and UV-exposed barrier zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Vitamin E (D-Alpha Tocopherol) (430.71 Da (Lipid Bilayer Anchor)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Vitamin E (D-Alpha Tocopherol) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Vitamin E (D-Alpha Tocopherol) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__allantoin",
    protocolNumber: 91,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "allantoin",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 11",
    activeName: "Botanical Allantoin",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Botanical Allantoin Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Botanical Allantoin supplies Imidazolidinyl-Urea Hydantoin Ring, targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Botanical Allantoin.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Windburned cheeks, post-shave neck, peeling blemishes, and sensitive eyelids/nasal folds to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Botanical Allantoin (158.12 Da (Fast Epidermal Permeation)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Botanical Allantoin benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Botanical Allantoin on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__vegetable_glycerin",
    protocolNumber: 92,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "vegetable_glycerin",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 12",
    activeName: "Cold-Pressed Botanical Glycerin",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Cold-Pressed Botanical Glycerin Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Cold-Pressed Botanical Glycerin supplies Propane-1,2,3-triol (92.09 Da), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Full face, lips perimeter, hands, and dehydration-prone contours.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Cold-Pressed Botanical Glycerin.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Full face, lips perimeter, hands, and dehydration-prone contours to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Cold-Pressed Botanical Glycerin (92.09 Da (Ultra-Low Dalton Aquaporin-3 Substrate)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Cold-Pressed Botanical Glycerin benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Cold-Pressed Botanical Glycerin on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__centella_asiatica",
    protocolNumber: 93,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "centella_asiatica",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 13",
    activeName: "Centella Asiatica (Gotu Kola / Mandukaparni)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Centella Asiatica (Gotu Kola / Mandukaparni) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Centella Asiatica (Gotu Kola / Mandukaparni) supplies Madecassoside (Pentacyclic Triterpene Saponin), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Centella Asiatica (Gotu Kola / Mandukaparni).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Red post-blemish marks (PIE), sensitized cheeks, and healing breakouts to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Centella Asiatica (Gotu Kola / Mandukaparni) (488.7 Da (Asiatic Acid) to 975.1 Da (Madecassoside)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Centella Asiatica (Gotu Kola / Mandukaparni) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Centella Asiatica (Gotu Kola / Mandukaparni) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__licorice_glabridin",
    protocolNumber: 94,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "licorice_glabridin",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 14",
    activeName: "Licorice Root (Yashtimadhu / Glabridin)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Licorice Root (Yashtimadhu / Glabridin) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Licorice Root (Yashtimadhu / Glabridin) supplies Glabridin (Prenylated Isoflavan), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH).",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Licorice Root (Yashtimadhu / Glabridin).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Melasma patches, sun spots, upper lip shadow, and dark post-acne marks (PIH) to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Licorice Root (Yashtimadhu / Glabridin) (324.37 Da (Glabridin) to 840.9 Da (Dipotassium Glycyrrhizate)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Licorice Root (Yashtimadhu / Glabridin) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Licorice Root (Yashtimadhu / Glabridin) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__green_tea_egcg",
    protocolNumber: 95,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "green_tea_egcg",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 15",
    activeName: "Green Tea Polyphenols (EGCG)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Green Tea Polyphenols (EGCG) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Green Tea Polyphenols (EGCG) supplies Epigallocatechin-3-Gallate (EGCG), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Oily T-zone, morning facial puffiness, and UV-exposed contours.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Green Tea Polyphenols (EGCG).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Oily T-zone, morning facial puffiness, and UV-exposed contours to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Green Tea Polyphenols (EGCG) (458.37 Da (Epigallocatechin Gallate)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Green Tea Polyphenols (EGCG) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Green Tea Polyphenols (EGCG) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__turmeric_curcumin",
    protocolNumber: 96,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "turmeric_curcumin",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 16",
    activeName: "Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) supplies Tetrahydrocurcumin (Colorless Bio-Metabolite), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dull complexion, uneven skin tone, wedding/event glow prep, and blemish marks to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) (372.41 Da (Tetrahydrocurcumin)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Kasturi Turmeric Bio-Ferment (Tetrahydrocurcumin) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__neem_distillate",
    protocolNumber: 97,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "neem_distillate",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 17",
    activeName: "Cold-Distilled Neem Leaf",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Cold-Distilled Neem Leaf Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Cold-Distilled Neem Leaf supplies Nimbidin & Nimbin Tetranortriterpenoids, targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Cold-Distilled Neem Leaf.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Forehead fungal/monsoon bumps, jawline acne, and humid-climate congestion to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Cold-Distilled Neem Leaf (302.24 Da (Quercetin) to 454.5 Da (Nimbolide)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Cold-Distilled Neem Leaf benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Cold-Distilled Neem Leaf on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__rosehip_retinoate",
    protocolNumber: 98,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "rosehip_retinoate",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 18",
    activeName: "Cold-Pressed Rosehip Seed Oil",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Cold-Pressed Rosehip Seed Oil Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Cold-Pressed Rosehip Seed Oil supplies Linoleic Acid (Omega-6 Essential Fatty Acid), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Cold-Pressed Rosehip Seed Oil.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Post-acne scars, pitted texture, fine lines, and linoleic-deficient oily/dry skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Cold-Pressed Rosehip Seed Oil (278.4 Da (Alpha-Linolenic Acid) to 300.4 Da (All-Trans-Retinoic Derivative)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Cold-Pressed Rosehip Seed Oil benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Cold-Pressed Rosehip Seed Oil on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__kashmiri_saffron",
    protocolNumber: 99,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "kashmiri_saffron",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 19",
    activeName: "Kashmiri Mogra Saffron (Kumkuma)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Kashmiri Mogra Saffron (Kumkuma) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Kashmiri Mogra Saffron (Kumkuma) supplies Crocin & Crocetin (Water-Soluble Carotenoids), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Kashmiri Mogra Saffron (Kumkuma).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Tired, sallow, dull skin, under-eye dark circles, and uneven pigmentation to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Kashmiri Mogra Saffron (Kumkuma) (150.2 Da (Safranal) to 976.9 Da (Crocin)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Kashmiri Mogra Saffron (Kumkuma) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Kashmiri Mogra Saffron (Kumkuma) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__ashwagandha_root",
    protocolNumber: 100,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "ashwagandha_root",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 20",
    activeName: "Adaptogenic Ashwagandha Root",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Adaptogenic Ashwagandha Root Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Adaptogenic Ashwagandha Root supplies Withanolide A, D & Withaferin A, targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Adaptogenic Ashwagandha Root.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Stress-fatigued cheeks, under-eye perimeter, fine lines, and barrier-compromised zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Adaptogenic Ashwagandha Root (470.6 Da (Withaferin A & Withanolide D)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Adaptogenic Ashwagandha Root benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Adaptogenic Ashwagandha Root on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__olive_squalane",
    protocolNumber: 101,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "olive_squalane",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 21",
    activeName: "Biomimetic Plant Squalane",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Biomimetic Plant Squalane Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Biomimetic Plant Squalane supplies Fully Saturated C30H62 Branched Alkane, targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Dry patches, under-eye contour, neck, and post-cleanse moisture sealing.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Biomimetic Plant Squalane.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dry patches, under-eye contour, neck, and post-cleanse moisture sealing to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Biomimetic Plant Squalane (422.81 Da (Skin-Identical C30 Branched Alkane)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Biomimetic Plant Squalane benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Biomimetic Plant Squalane on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__ceramide_complex",
    protocolNumber: 102,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "ceramide_complex",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 22",
    activeName: "Ceramide NP / AP / EOP Complex",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Ceramide NP / AP / EOP Complex Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Ceramide NP / AP / EOP Complex supplies Ceramide NP (Ceramide 3), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Ceramide NP / AP / EOP Complex.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Over-exfoliated skin, winter dryness, retinoid flaking, and sensitive cheek barriers to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Ceramide NP / AP / EOP Complex (565.9 Da (Ceramide NP) to 1,034 Da (Ceramide EOP)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Ceramide NP / AP / EOP Complex benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Ceramide NP / AP / EOP Complex on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__zinc_pca",
    protocolNumber: 103,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "zinc_pca",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 23",
    activeName: "Bio-Chelated Zinc PCA",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Bio-Chelated Zinc PCA Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Bio-Chelated Zinc PCA supplies Bio-Available Ionic Zinc (Zn2+), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Bio-Chelated Zinc PCA.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Oily forehead, shiny nose, hormonal chin/jawline breakouts, and enlarged pores to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Bio-Chelated Zinc PCA (321.60 Da (High Follicular Bio-Availability)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Bio-Chelated Zinc PCA benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Bio-Chelated Zinc PCA on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__lactic_acid_aha",
    protocolNumber: 104,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "lactic_acid_aha",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 24",
    activeName: "Fermented Plant Lactic Acid (Gentle AHA)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Fermented Plant Lactic Acid (Gentle AHA) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Fermented Plant Lactic Acid (Gentle AHA) supplies L-(+)-Lactic Acid (Biologically Native Isomer), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Rough, dull forehead, flaky cheek patches, and uneven skin texture.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Fermented Plant Lactic Acid (Gentle AHA).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Rough, dull forehead, flaky cheek patches, and uneven skin texture to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Fermented Plant Lactic Acid (Gentle AHA) (90.08 Da (Controlled Surface Stratum Corneum Action)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Fermented Plant Lactic Acid (Gentle AHA) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Fermented Plant Lactic Acid (Gentle AHA) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__alpha_bisabolol",
    protocolNumber: 105,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "alpha_bisabolol",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 25",
    activeName: "Chamomile Alpha-Bisabolol",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Chamomile Alpha-Bisabolol Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Chamomile Alpha-Bisabolol supplies (-)-Alpha-Bisabolol (Active Levorotatory Isomer), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Chamomile Alpha-Bisabolol.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Flushed cheeks, nasal redness, post-threading/shaving irritation, and reactive skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Chamomile Alpha-Bisabolol (222.37 Da (Deep Epidermal Permeation)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Chamomile Alpha-Bisabolol benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Chamomile Alpha-Bisabolol on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__pomegranate_omega5",
    protocolNumber: 106,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "pomegranate_omega5",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 26",
    activeName: "Pomegranate Seed (Omega-5 & Ellagic Acid)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Pomegranate Seed (Omega-5 & Ellagic Acid) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Pomegranate Seed (Omega-5 & Ellagic Acid) supplies Punicic Acid (Omega-5 Conjugated Trienoic Acid), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Sun-exposed cheekbones, mature contours, fine lines, and dull skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Pomegranate Seed (Omega-5 & Ellagic Acid).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Sun-exposed cheekbones, mature contours, fine lines, and dull skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Pomegranate Seed (Omega-5 & Ellagic Acid) (278.4 Da (Punicic Acid) to 302.19 Da (Ellagic Acid)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Pomegranate Seed (Omega-5 & Ellagic Acid) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Pomegranate Seed (Omega-5 & Ellagic Acid) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__moringa_peptide",
    protocolNumber: 107,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "moringa_peptide",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 27",
    activeName: "Moringa Seed Anti-Pollution Peptide",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Moringa Seed Anti-Pollution Peptide Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Moringa Seed Anti-Pollution Peptide supplies Moringa Cationic Coagulant Peptides (MO2.1), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Full face and neck for commuters and residents of high-AQI urban cities.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Moringa Seed Anti-Pollution Peptide.",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Full face and neck for commuters and residents of high-AQI urban cities to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Moringa Seed Anti-Pollution Peptide (6.5 kDa \u2013 13 kDa (Cationic Coagulant Micro-Peptide)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Moringa Seed Anti-Pollution Peptide benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Moringa Seed Anti-Pollution Peptide on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__mysore_sandalwood",
    protocolNumber: 108,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "mysore_sandalwood",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 28",
    activeName: "Mysore Sandalwood Hydrosol (Chandana)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Mysore Sandalwood Hydrosol (Chandana) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Mysore Sandalwood Hydrosol (Chandana) supplies Cis-Alpha-Santalol, targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Mysore Sandalwood Hydrosol (Chandana).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Sun-flushed cheeks, prickly heat zones, enlarged pores, and blemish-prone skin to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Mysore Sandalwood Hydrosol (Chandana) (220.35 Da (Alpha-Santalol & Beta-Santalol)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Mysore Sandalwood Hydrosol (Chandana) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Mysore Sandalwood Hydrosol (Chandana) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__vetiver_khus",
    protocolNumber: 109,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "vetiver_khus",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 29",
    activeName: "Wild Vetiver Root Distillate (Ushira / Khus)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Wild Vetiver Root Distillate (Ushira / Khus) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Wild Vetiver Root Distillate (Ushira / Khus) supplies Khusimol & Vetiverol (Sesquiterpene Alcohols), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Full face and neck, especially in hot, humid, or air-conditioned environments.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Wild Vetiver Root Distillate (Ushira / Khus).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Full face and neck, especially in hot, humid, or air-conditioned environments to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Wild Vetiver Root Distillate (Ushira / Khus) (220.35 Da (Khusimol & Isovalencenol)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Wild Vetiver Root Distillate (Ushira / Khus) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Wild Vetiver Root Distillate (Ushira / Khus) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__bakuchiol_babchi",
    protocolNumber: 110,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "bakuchiol_babchi",
    activeStoryNumber: "BOTANICAL & ACTIVE \u00b7 30",
    activeName: "Ayurvedic Bakuchiol (Babchi)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Ayurvedic Bakuchiol (Babchi) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Ayurvedic Bakuchiol (Babchi) supplies S-(+)-Bakuchiol (Meroterpene Phenol), targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Ayurvedic Bakuchiol (Babchi).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Fine lines, crow's feet, enlarged pores, active blemishes, and post-acne texture to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Ayurvedic Bakuchiol (Babchi) (256.38 Da (Rapid Dermal-Epidermal Junction Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Ayurvedic Bakuchiol (Babchi) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Ayurvedic Bakuchiol (Babchi) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__polyglutamic_acid",
    protocolNumber: 111,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "polyglutamic_acid",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 31",
    activeName: "Polyglutamic Acid (Natto Hydro-Lock)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Polyglutamic Acid (Natto Hydro-Lock) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Polyglutamic Acid (Natto Hydro-Lock) supplies Gamma-Linked L-Glutamic Acid Polymer, targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Dehydrated cheeks, under-eye creases, and moisture-loss zones.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Polyglutamic Acid (Natto Hydro-Lock).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Dehydrated cheeks, under-eye creases, and moisture-loss zones to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Polyglutamic Acid (Natto Hydro-Lock) (700 kDa \u2013 1,100 kDa (Breathable Surface Hydro-Seal)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Polyglutamic Acid (Natto Hydro-Lock) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Polyglutamic Acid (Natto Hydro-Lock) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
  {
    protocolId: "aloe_vera__x__azelaic_botanical",
    protocolNumber: 112,
    heroIngredientId: "aloe_vera",
    heroStoryNumber: "INGREDIENT STORY \u00b7 04",
    heroName: "Pure Aloe Vera",
    activeIngredientId: "azelaic_botanical",
    activeStoryNumber: "CONTEMPORARY ACTIVE \u00b7 32",
    activeName: "Botanical Azelaic Derivative (PAD)",
    combinedHeadline: "Pure Aloe Vera (INGREDIENT STORY \u00b7 04) + Botanical Azelaic Derivative (PAD) Dual-Pathway Ritual",
    optimalCombinedPh: "4.5 \u2013 5.5",
    compatibilityRating: '100% Synergistic · Zero Neutralization',
    biochemicalMechanism: "Pure Aloe Vera delivers Acemannan (Acetylated Beta-1,4-Glucomannan) while Botanical Azelaic Derivative (PAD) supplies Azeloyl Dicarboxylic Moiety, targeting Entire face, delicate eye contour perimeter, neck, and sun-exposed skin and Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone.",
    sixStepLayeringSequence: [
      {
        step: 1,
        phase: 'Thermal Water Prep',
        action: "Splash face with 28\u00b0C\u201332\u00b0C lukewarm water to prime corneocytes for Pure Aloe Vera and Botanical Azelaic Derivative (PAD).",
      },
      {
        step: 2,
        phase: 'Palm Micro-Emulsification',
        action: "Whip 1 to 1.5 pumps into a cushiony foam for 10 seconds to activate Acemannan (Acetylated Beta-1,4-Glucomannan).",
      },
      {
        step: 3,
        phase: '40-Second Zonal Massage',
        action: "Massage in upward circles across Post-acne red and brown marks (PIE & PIH), rosacea-prone cheeks, and oily T-zone to clear pores and deposit antioxidants.",
      },
      {
        step: 4,
        phase: '15-Second Phyto-Active Dwell',
        action: "Pause 15 seconds so Botanical Azelaic Derivative (PAD) (342.39 Da (Smooth Epidermal Penetration)) partitions into the upper epidermis.",
      },
      {
        step: 5,
        phase: 'Cool-Lukewarm Rinse & Microfiber Pat',
        action: 'Rinse with 10 splashes of cool water and pat gently, leaving 15% surface moisture.',
      },
      {
        step: 6,
        phase: '60-Second Barrier Lock',
        action: "Seal immediately with leave-on hydration to lock in Pure Aloe Vera and Botanical Azelaic Derivative (PAD) benefits for 12+ hours.",
      },
    ],
    seasonalAdjustments: {
      indianSummer: "Use cool 26\u00b0C rinse water and focus Pure Aloe Vera + Botanical Azelaic Derivative (PAD) on sweat-prone T-zone for 45 seconds.",
      humidMonsoon: "Extend the phyto-dwell window to 20 seconds to prevent humidity-triggered congestion.",
      dryWinter: "Follow immediately within 30 seconds of patting damp with Ceramide & Squalane barrier lock.",
    },
  },
];

export const BHUMIVERA_PRODUCT_CATALOG = [
  {
    productId: 'sb_radiance_face_wash',
    sku: 'BHVM-FW-SB100',
    name: 'Sea Buckthorn Clarifying & Radiance Face Wash',
    subtitle: 'Himalayan Omega-7 Berry + 4% Niacinamide + 32% Cold-Stabilized Aloe Vera',
    volumeMl: 100,
    mrpInr: 649,
    phLevel: '5.2 – 5.5',
    heroStoryIds: ['sea_buckthorn', 'aloe_vera', 'sacred_tulsi', 'activated_charcoal'],
    keyActiveIds: [
      'sea_buckthorn',
      'aloe_vera',
      'niacinamide',
      'panthenol',
      'salicylic_acid',
      'hyaluronic_acid',
      'vitamin_c_ethyl',
      'tocopherol_vit_e',
      'allantoin',
      'vegetable_glycerin',
    ],
    idealFor: 'All Skin Types — Dullness, Uneven Tone, Post-Acne Marks, Dehydrated Oily/Combination Skin',
    amPmSchedule: 'Twice Daily · Morning Awakening (7–9 AM) & Evening Detox (8–10:30 PM)',
    clinicalHighlights: [
      '+34% immediate stratum corneum hydration via 32% Aloe Vera & 5-Weight Hyaluronic Acid',
      'Zero-sulfate, amino-glucoside micro-foam buffered with 3.5% Himalayan Sea Buckthorn Omega-7',
      '4.0% Pharmaceutical Niacinamide + 1.5% D-Panthenol for barrier ceramide synthesis',
    ],
  },
  {
    productId: 'charcoal_tulsi_pore_cleanser',
    sku: 'BHVM-FW-CT100',
    name: 'Activated Bamboo Charcoal & Sacred Tulsi Pore-Refining Cleanser',
    subtitle: '8-Micron Steam Charcoal + Dual-Cultivar Tulsi + Willow Bark BHA + Zinc PCA',
    volumeMl: 100,
    mrpInr: 679,
    phLevel: '5.1 – 5.4',
    heroStoryIds: ['activated_charcoal', 'sacred_tulsi', 'aloe_vera'],
    keyActiveIds: [
      'activated_charcoal',
      'sacred_tulsi',
      'aloe_vera',
      'salicylic_acid',
      'zinc_pca',
      'neem_distillate',
      'moringa_peptide',
      'green_tea_egcg',
      'niacinamide',
      'panthenol',
    ],
    idealFor: 'Oily, Combination, Congested, Blackhead-Prone & Urban Commuter Skin',
    amPmSchedule: 'Daily Evening Detox (or Twice Daily for Very Oily Skin)',
    clinicalHighlights: [
      'Removes 98% of PM2.5 smog particulates and oxidized squalene without micro-tears',
      '2.25% Sacred Tulsi + 1.0% Willow Bark BHA unclog pores and calm stress breakouts',
      'Moringa Seed Peptides prevent fresh urban dust adhesion after rinsing',
    ],
  },
  {
    productId: 'aloe_niacinamide_barrier_gel',
    sku: 'BHVM-GL-AN50',
    name: 'Pure Aloe Vera & Ceramide Hydro-Lock Barrier Gel-Crème',
    subtitle: 'First-Press Barbadensis Fillet + 5D Hyaluronic Acid + Ceramide NP/AP/EOP + Centella',
    volumeMl: 50,
    mrpInr: 799,
    phLevel: '5.3 – 5.6',
    heroStoryIds: ['aloe_vera', 'sea_buckthorn'],
    keyActiveIds: [
      'aloe_vera',
      'hyaluronic_acid',
      'polyglutamic_acid',
      'ceramide_complex',
      'centella_asiatica',
      'panthenol',
      'allantoin',
      'alpha_bisabolol',
      'olive_squalane',
      'ashwagandha_root',
    ],
    idealFor: 'Dehydrated, Sensitive, Barrier-Compromised, Redness-Prone & Post-Active Skin',
    amPmSchedule: 'Twice Daily — Apply Within 60 Seconds of Cleansing on Damp Skin',
    clinicalHighlights: [
      'Instant -1.8°C cooling relief with 4,000x water-binding Polyglutamic + 5D Hyaluronic matrix',
      '3:1:1 Physiological Ceramide Complex + Centella TECA repairs leaky barriers',
      '100% oil-free feel, non-comedogenic, and fungal-acne safe',
    ],
  },
  {
    productId: 'saffron_bakuchiol_elixir',
    sku: 'BHVM-EL-SB30',
    name: 'Kashmiri Saffron, Sea Buckthorn & Bakuchiol Cellular Recovery Elixir',
    subtitle: 'Pampore Mogra Saffron + 99% Pure Bakuchiol + Kasturi Turmeric + Rosehip Seed',
    volumeMl: 30,
    mrpInr: 1199,
    phLevel: '5.0 – 5.6',
    heroStoryIds: ['sea_buckthorn', 'sacred_tulsi'],
    keyActiveIds: [
      'sea_buckthorn',
      'kashmiri_saffron',
      'bakuchiol_babchi',
      'turmeric_curcumin',
      'rosehip_retinoate',
      'pomegranate_omega5',
      'licorice_glabridin',
      'vitamin_c_ethyl',
      'tocopherol_vit_e',
      'olive_squalane',
    ],
    idealFor: 'Hyperpigmentation, Post-Blemish Scars, Fine Lines & Bridal/Event Radiance',
    amPmSchedule: 'Evening Cellular Renewal (or 2 Drops Under Morning SPF)',
    clinicalHighlights: [
      '1% Psoralen-Free Bakuchiol mirrors retinol collagen gene expression with zero peeling',
      'GI-Tagged Kashmiri Saffron + Non-Staining Kasturi Turmeric inhibit tyrosinase',
      'Complete Omega 3-5-6-7-9 fatty acid spectrum in weightless plant Squalane',
    ],
  },
];

export const MASTER_SKINCARE_RITUAL_STEPS = [
  {
    stepNumber: 1,
    phaseCode: 'PREP_01',
    title: 'Step 1 · Pre-Ritual Hand Purification',
    subtitle: 'Eliminating Transfer Bacteria & Oil Before Touching Facial Skin',
    durationSeconds: 15,
    waterTempCelsius: '28°C – 32°C',
    anatomicalTarget: 'Palms, Fingertips & Nail Beds',
    fingerTechnique: 'Brisk 15-second palm and interdigital wash',
    detailedInstruction:
      'Before touching your face, wash your hands thoroughly for 15 seconds. Hands carry phone-screen bacteria, keyboard oils, and surfactants that otherwise transfer onto facial pores and dilute your cleanser’s micellar efficiency.',
    biochemicalRationale:
      'Prevents exogenous Staphylococcus aureus transfer and ensures your cleanser micelles bind exclusively to facial sebum rather than hand oils.',
    proConciergeTip: 'Keep fingernails trimmed smooth so ring-finger massage never creates micro-scratches.',
    mistakeToAvoid: 'Pumping facial cleanser into unwashed hands after handling your phone.',
    keyIngredientsActive: ['sacred_tulsi', 'neem_distillate'],
  },
  {
    stepNumber: 2,
    phaseCode: 'PREP_02',
    title: 'Step 2 · Thermal Water Calibration (28°C–32°C Lukewarm Splash)',
    subtitle: 'Softening Sebum Plugs Without Melting Epidermal Ceramides',
    durationSeconds: 10,
    waterTempCelsius: '28°C – 32°C (Tepid / Skin-Neutral)',
    anatomicalTarget: 'Full Face, Jawline & Anterior Neck',
    fingerTechnique: 'Cupped-palm double splash (5 splashes)',
    detailedInstruction:
      'Test water temperature on your inner wrist until it feels neither hot nor icy, then splash your face and neck 5 times. This hydrates the outer corneocytes and softens oxidized wax esters at the pore openings.',
    biochemicalRationale:
      'Water above 38°C disorders lamellar ceramide packing and dilates capillaries (worsening PIE redness), while ice-cold water solidifies sebum plugs.',
    proConciergeTip: 'If washing in the shower, turn the mixer dial down to tepid before wetting your face.',
    mistakeToAvoid: 'Washing your face under a steaming hot 42°C shower head.',
    keyIngredientsActive: ['aloe_vera', 'vegetable_glycerin', 'vetiver_khus'],
  },
  {
    stepNumber: 3,
    phaseCode: 'DOSE_03',
    title: 'Step 3 · Precision Apothecary Dosing (1 to 1.5 Pumps)',
    subtitle: 'Calibrating Bio-Active Concentration for Morning vs. Evening',
    durationSeconds: 5,
    waterTempCelsius: 'N/A (Damp Palms)',
    anatomicalTarget: 'Center of Cupped Wet Palm',
    fingerTechnique: 'Single controlled pump depression',
    detailedInstruction:
      'Dispense 1 pump (approx. 1.0 ml) for your Morning Awakening Ritual, or 1.5 pumps (approx. 1.5 ml) for your Evening Detox Ritual after a day of sunscreen, sweat, and urban pollution.',
    biochemicalRationale:
      'Delivers the exact clinical stoichiometry of 3.5% Sea Buckthorn, 4% Niacinamide, and 1.5% D-Panthenol across the ~600 cm² surface area of the face and neck.',
    proConciergeTip: 'Add 4–5 drops of water directly onto the dispensed gel before rubbing palms together.',
    mistakeToAvoid: 'Over-pumping 3–4 times, which wastes concentrated botanicals and takes longer to rinse.',
    keyIngredientsActive: ['sea_buckthorn', 'niacinamide', 'panthenol'],
  },
  {
    stepNumber: 4,
    phaseCode: 'EMULSIFY_04',
    title: 'Step 4 · Palm Micro-Foam Whipping (10-Second Aerated Cushion)',
    subtitle: 'Activating Amphiphilic Micelles Before Facial Contact',
    durationSeconds: 10,
    waterTempCelsius: '28°C – 32°C',
    anatomicalTarget: 'Between Both Wet Palms',
    fingerTechnique: 'Rapid circular palm friction with light air incorporation',
    detailedInstruction:
      'Rub wet palms together in brisk circles for 10 full seconds until the botanical gel transforms into a dense, velvety micro-foam cushion.',
    biochemicalRationale:
      'Pre-forming micelles in your hands lowers free surfactant monomer concentration, ensuring zero barrier stripping while liberating Sea Buckthorn Omega-7 and Charcoal micro-spheres.',
    proConciergeTip: 'The denser the micro-foam in your palms, the less mechanical friction your facial skin experiences.',
    mistakeToAvoid: 'Slapping raw, un-lathered gel onto dry cheeks and scrubbing to make foam.',
    keyIngredientsActive: ['sea_buckthorn', 'activated_charcoal', 'aloe_vera'],
  },
  {
    stepNumber: 5,
    phaseCode: 'ZONE1_05',
    title: 'Step 5 · Zone 1: T-Zone, Forehead & Nasal Alae Decongestion',
    subtitle: 'Targeting High-Density Sebaceous Follicles (900 Glands/cm²)',
    durationSeconds: 15,
    waterTempCelsius: 'Skin-Warm',
    anatomicalTarget: 'Glabella, Forehead, Nasal Bridge, Nostril Creases & Chin',
    fingerTechnique: 'Small clockwise & counter-clockwise micro-circles using middle & ring fingers',
    detailedInstruction:
      'Apply the freshly whipped foam first to the T-zone. Spend 15 seconds tracing tiny circles around the nostril wings, up the nasal bridge, across the brow bone, and in the mental crease of the chin.',
    biochemicalRationale:
      'The T-zone contains up to 900 sebaceous glands per square centimeter. Starting here gives Activated Charcoal, Salicylic Acid, and Zinc PCA the longest contact window to dissolve sebaceous filaments.',
    proConciergeTip: 'Gently press the side of your nose slightly to reach the hidden crease beside each nostril.',
    mistakeToAvoid: 'Forgetting the crease between the lower lip and chin where whiteheads congregate.',
    keyIngredientsActive: ['activated_charcoal', 'salicylic_acid', 'zinc_pca', 'moringa_peptide'],
  },
  {
    stepNumber: 6,
    phaseCode: 'ZONE2_06',
    title: 'Step 6 · Zone 2: Zygomatic Arch & Cheek Upward Micro-Circulation',
    subtitle: 'Lifting Daily SPF & Awakening Cheekbone Luminosity',
    durationSeconds: 15,
    waterTempCelsius: 'Skin-Warm',
    anatomicalTarget: 'Medial & Lateral Cheeks, Zygomatic Cheekbones',
    fingerTechnique: 'Broad, featherlight upward and outward sweeping spirals toward the temples',
    detailedInstruction:
      'Sweep the cushiony foam from the sides of the nose outward across the apples of the cheeks toward the ears in gentle upward spirals for 15 seconds.',
    biochemicalRationale:
      'Upward motion follows venous and lymphatic return while allowing Vitamin C, Sea Buckthorn carotenoids, and Kashmiri Saffron to brighten sun-exposed cheekbones.',
    proConciergeTip: 'Use only the pads of your fingers—never your palms—so pressure stays ultra-light on sensitive cheeks.',
    mistakeToAvoid: 'Dragging cheek skin downward, which stresses elastin fibers over time.',
    keyIngredientsActive: ['sea_buckthorn', 'vitamin_c_ethyl', 'kashmiri_saffron', 'licorice_glabridin'],
  },
  {
    stepNumber: 7,
    phaseCode: 'ZONE3_07',
    title: 'Step 7 · Zone 3: Jawline, Perioral & Submental Lymphatic Sweep',
    subtitle: 'Clearing Hormonal Congestion & Mask/Collar Friction Zones',
    durationSeconds: 15,
    waterTempCelsius: 'Skin-Warm',
    anatomicalTarget: 'Mandibular Jawline, Corners of Mouth, Under-Chin & Upper Neck',
    fingerTechnique: 'Index and middle finger V-glide from chin center along jawbone to earlobes',
    detailedInstruction:
      'Glide your fingers from the center of the chin along the jawline up to the earlobes, then sweep down the sides of the neck for 15 seconds.',
    biochemicalRationale:
      'The mandibular line is the primary site of adult hormonal and cortisol-induced breakouts. Sacred Tulsi, Neem Distillate, and Niacinamide calm deep follicular inflammation here.',
    proConciergeTip: 'Always extend your cleanse 3 cm below the jawbone where sunscreen and sweat accumulate.',
    mistakeToAvoid: 'Stopping at the jaw edge, leaving a line of unwashed SPF under the chin.',
    keyIngredientsActive: ['sacred_tulsi', 'neem_distillate', 'niacinamide', 'azelaic_botanical'],
  },
  {
    stepNumber: 8,
    phaseCode: 'ZONE4_08',
    title: 'Step 8 · Zone 4: Temple Acupressure & Hairline/Sideburn Integration',
    subtitle: 'Releasing Facial Tension & Clearing Hairline Product Buildup',
    durationSeconds: 10,
    waterTempCelsius: 'Skin-Warm',
    anatomicalTarget: 'Temples (Taiyang Point), Hairline Perimeter & Pre-Auricular Area',
    fingerTechnique: 'Gentle 3-second acupressure hold at temples followed by hairline sweep',
    detailedInstruction:
      'Trace lightly along the hairline and in front of the ears to lift hair-product or sweat residue, pausing at the temples for one slow exhale.',
    biochemicalRationale:
      'Mysore Sandalwood, Vetiver Root, and Ashwagandha calm local neurogenic stress while clearing hairline comedones.',
    proConciergeTip: 'Ensure foam reaches right up to the hairline so you remember to rinse it completely in Step 10.',
    mistakeToAvoid: 'Leaving hair oils and dry shampoo buildup trapped along the upper forehead.',
    keyIngredientsActive: ['mysore_sandalwood', 'vetiver_khus', 'ashwagandha_root'],
  },
  {
    stepNumber: 9,
    phaseCode: 'DWELL_09',
    title: 'Step 9 · The 15-Second Bio-Active Phyto-Dwell Window',
    subtitle: 'Transforming Your Daily Wash into a Clinical Botanical Treatment',
    durationSeconds: 15,
    waterTempCelsius: 'Skin-Warm',
    anatomicalTarget: 'Entire Face & Neck',
    fingerTechnique: 'Hands off — motionless 15-second absorption pause',
    detailedInstruction:
      'Before reaching for the tap, let the botanical micro-foam sit undisturbed on your skin for 15 seconds. During this pause, rinse your hands clean.',
    biochemicalRationale:
      'Clinical permeation studies show that 15 seconds of static dwell allows low-molecular-weight Niacinamide (122 Da), D-Panthenol (205 Da), Salicylic Acid (138 Da), and Acetylated HA to partition into the stratum corneum.',
    proConciergeTip: 'Count 3 slow breaths (5 seconds each)—your skin will drink in the water-soluble vitamins while surfactants hold dirt in suspension.',
    mistakeToAvoid: 'Rinsing cleanser off 3 seconds after applying it.',
    keyIngredientsActive: ['niacinamide', 'panthenol', 'hyaluronic_acid', 'centella_asiatica'],
  },
  {
    stepNumber: 10,
    phaseCode: 'RINSE_10',
    title: 'Step 10 · 10-Splash Cool-Tepid Rinse & Perimeter Check',
    subtitle: 'Flushing Micellar Debris & Toning Capillaries',
    durationSeconds: 20,
    waterTempCelsius: '24°C – 28°C (Cool-Lukewarm)',
    anatomicalTarget: 'Full Face, Hairline, Nostril Creases, Jawline & Behind Ears',
    fingerTechnique: '10 generous cupped-water splashes + fingertips perimeter sweep',
    detailedInstruction:
      'Rinse with 10–12 splashes of cool-to-lukewarm water, running clean wet fingers along the hairline, eyebrow arches, nostril folds, and under the jaw to ensure 100% foam removal.',
    biochemicalRationale:
      'Cooler water triggers mild vasoconstriction to calm Pitta redness while leaving substantively bound Aloe polysaccharides, Panthenol, and Omega-7 lipids intact.',
    proConciergeTip: 'Do a final check at the corners of the nose and the jawline—the two places people miss most.',
    mistakeToAvoid: 'Leaving trace foam at the temples or hairline.',
    keyIngredientsActive: ['aloe_vera', 'allantoin', 'alpha_bisabolol'],
  },
  {
    stepNumber: 11,
    phaseCode: 'PAT_11',
    title: 'Step 11 · Zero-Friction Microfiber Press (Preserving 15% Surface Dew)',
    subtitle: 'Protecting the Freshly Hydrated Stratum Corneum from Towel Shear',
    durationSeconds: 10,
    waterTempCelsius: 'Ambient',
    anatomicalTarget: 'Full Face & Neck',
    fingerTechnique: 'Flat-palm pressing motion with a dedicated clean face towel or tissue',
    detailedInstruction:
      'Gently press a clean microfiber face cloth or soft disposable facial tissue against your skin for 5–10 seconds to absorb dripping water while intentionally leaving the skin 15% damp and dewy.',
    biochemicalRationale:
      'Hydrated corneocytes are swollen and 4x more permeable than dry corneocytes; rubbing with a rough bath towel causes micro-excoriations and transfers bathroom bacteria.',
    proConciergeTip: 'Never use the same towel you use for your body or hands on your face.',
    mistakeToAvoid: 'Rubbing your face bone-dry with a shared bath towel.',
    keyIngredientsActive: ['aloe_vera', 'hyaluronic_acid', 'polyglutamic_acid'],
  },
  {
    stepNumber: 12,
    phaseCode: 'SEAL_12',
    title: 'Step 12 · The Golden 60-Second Humectant & Barrier Lock Window',
    subtitle: 'Trapping Water Inside the Epidermis Before Evaporative TEWL Begins',
    durationSeconds: 30,
    waterTempCelsius: 'Ambient',
    anatomicalTarget: 'Full Face, Eye Perimeter & Neck',
    fingerTechnique: 'Warm palm-pressing layering (Thinnest to Thickest)',
    detailedInstruction:
      'Within 60 seconds of patting your skin damp, press in your hydrating mist or serum (Niacinamide / Hyaluronic / Aloe), followed by your barrier moisturizer or Sea Buckthorn Elixir (and SPF 30–50 in the morning).',
    biochemicalRationale:
      'Once water evaporates from bare skin after washing, it pulls internal epidermal water with it (post-wash TEWL spike). Sealing within 60 seconds traps surface dew inside the stratum corneum for up to 24 hours.',
    proConciergeTip: 'Morning: Cleanser -> Damp-Skin Serum -> Moisturizer -> SPF. Evening: Cleanser -> Damp-Skin Serum -> Elixir/Barrier Crème.',
    mistakeToAvoid: 'Walking out of the bathroom and waiting 10 minutes before applying your skincare.',
    keyIngredientsActive: ['ceramide_complex', 'olive_squalane', 'bakuchiol_babchi', 'rosehip_retinoate'],
  },
];

export const SKIN_DIAGNOSTIC_STEPS = [
  {
    step: 1,
    id: 'sebum_profile',
    question: 'Step 1 of 8 · How does your skin behave 3 hours after a gentle morning wash (without products)?',
    subtitle: 'Evaluating baseline sebaceous gland output & hydrolipidic film balance',
    options: [
      { value: 'dry', label: 'Tight, matte, or slightly flaky across cheeks and forehead', scoreWeights: { dry: 3, vata: 2 } },
      { value: 'balanced', label: 'Comfortable, supple, and smooth with a natural satin sheen', scoreWeights: { balanced: 3 } },
      { value: 'combination', label: 'Shiny on the nose and forehead (T-zone), but dry or normal on cheeks', scoreWeights: { combination: 3, kapha: 1, vata: 1 } },
      { value: 'oily', label: 'Visible shine across the T-zone, cheeks, and chin', scoreWeights: { oily: 3, kapha: 2 } },
    ],
  },
  {
    step: 2,
    id: 'barrier_reactivity',
    question: 'Step 2 of 8 · How does your skin react to sun, temperature changes, or new active products?',
    subtitle: 'Assessing stratum corneum tight-junction integrity & neurosensory TRPV1 sensitivity',
    options: [
      { value: 'high_reactive', label: 'Flushes red easily, stings with strong actives, or feels warm quickly', scoreWeights: { sensitive: 3, pitta: 3 } },
      { value: 'moderate_reactive', label: 'Occasional redness around the nose wings or after long sun exposure', scoreWeights: { sensitive: 2, pitta: 1 } },
      { value: 'resilient', label: 'Rarely stings or flushes; tolerates most botanicals and actives well', scoreWeights: { resilient: 2 } },
    ],
  },
  {
    step: 3,
    id: 'pore_congestion',
    question: 'Step 3 of 8 · What do you notice most when looking closely at your nose, chin, and jawline?',
    subtitle: 'Mapping follicular keratosis, squalene oxidation (blackheads), and hormonal blemishes',
    options: [
      { value: 'blackheads_sebaceous', label: 'Darkened blackheads or visible grey sebaceous filaments on nose/chin', scoreWeights: { pores: 3, charcoal: 3 } },
      { value: 'inflammatory_breakouts', label: 'Tender red pimples or hormonal whiteheads along cheeks and jawline', scoreWeights: { acne: 3, tulsi: 3 } },
      { value: 'tight_invisible', label: 'Pores are small and rarely clogged, but skin feels dry or tight', scoreWeights: { dry: 2, aloe: 2 } },
      { value: 'stretched_pores', label: 'Enlarged, oval-looking pores on inner cheeks from oil or sun aging', scoreWeights: { pores: 2, niacinamide: 3 } },
    ],
  },
  {
    step: 4,
    id: 'pigmentation_tone',
    question: 'Step 4 of 8 · What is your primary skin tone or luminosity goal?',
    subtitle: 'Identifying melanocyte tyrosinase activity, PIH (brown marks), and PIE (red marks)',
    options: [
      { value: 'pih_dark_marks', label: 'Fade stubborn brown dark spots left behind after old pimples heal (PIH)', scoreWeights: { pigment: 3, sea_buckthorn: 3 } },
      { value: 'pie_red_marks', label: 'Calm lingering pink/red marks and blotchy flushing (PIE)', scoreWeights: { redness: 3, centella: 3 } },
      { value: 'dullness_tan', label: 'Revive tired, sallow, or sun-tanned skin for a glass-skin glow', scoreWeights: { glow: 3, sea_buckthorn: 3 } },
      { value: 'uniform_maintenance', label: 'Maintain clear, healthy, even-toned skin resilience', scoreWeights: { balanced: 2 } },
    ],
  },
  {
    step: 5,
    id: 'hydration_tewl',
    question: 'Step 5 of 8 · How does your skin feel in air-conditioned rooms, flights, or winter weather?',
    subtitle: 'Measuring Transepidermal Water Loss (TEWL) & Aquaporin-3 water retention',
    options: [
      { value: 'dehydrated_oily', label: 'Oily on the surface yet tight and thirsty underneath (Dehydrated Oily)', scoreWeights: { dehydrated: 3, aloe: 3 } },
      { value: 'parched_flaky', label: 'Drinks up moisturizer immediately and still feels dry by evening', scoreWeights: { dry: 3, sea_buckthorn: 2, aloe: 2 } },
      { value: 'comfortable', label: 'Stays fairly comfortable with a standard daily moisturizer', scoreWeights: { balanced: 2 } },
    ],
  },
  {
    step: 6,
    id: 'urban_environment',
    question: 'Step 6 of 8 · What is your daily environmental and commute exposure?',
    subtitle: 'Calculating PM2.5 particulate load, UV index, and blue-light oxidative stress',
    options: [
      { value: 'high_urban_commute', label: 'Daily city traffic, outdoor dust, high AQI smog, or humid heat', scoreWeights: { charcoal: 3, moringa: 2 } },
      { value: 'indoor_screens', label: '8+ hours indoors in AC in front of laptop/phone screens (HEV Blue Light)', scoreWeights: { tulsi: 2, ashwagandha: 2, aloe: 2 } },
      { value: 'outdoor_sun', label: 'Frequent direct sunlight, sports, or outdoor fieldwork', scoreWeights: { sea_buckthorn: 3, aloe: 2 } },
    ],
  },
  {
    step: 7,
    id: 'chronobiology_stress',
    question: 'Step 7 of 8 · How would you describe your sleep schedule and stress levels lately?',
    subtitle: 'Evaluating cutaneous cortisol (11β-HSD1) spikes and overnight barrier recovery window',
    options: [
      { value: 'high_stress_late', label: 'High workload/stress or sleeping past midnight (<6.5 hours)', scoreWeights: { tulsi: 3, ashwagandha: 3 } },
      { value: 'moderate_variable', label: 'Moderate stress with occasional late nights or travel fatigue', scoreWeights: { sea_buckthorn: 2, tulsi: 2 } },
      { value: 'rested_consistent', label: 'Consistent 7–8 hours of restful sleep', scoreWeights: { balanced: 2 } },
    ],
  },
  {
    step: 8,
    id: 'hero_story_affinity',
    question: 'Step 8 of 8 · Which of the 4 Bhumivera Hero Botanical Stories resonates most with your ritual?',
    subtitle: '"Nature has more than one note." Choose your anchor botanical note',
    options: [
      { value: 'sea_buckthorn', label: 'Story 01 · Sea Buckthorn — Vivid Himalayan Omega-7 & Golden Radiance', scoreWeights: { sea_buckthorn: 4 } },
      { value: 'activated_charcoal', label: 'Story 02 · Activated Charcoal — Grounded Elemental Pore Detox', scoreWeights: { charcoal: 4 } },
      { value: 'sacred_tulsi', label: 'Story 03 · Sacred Tulsi — Adaptogenic Blemish & Microbiome Calm', scoreWeights: { tulsi: 4 } },
      { value: 'aloe_vera', label: 'Story 04 · Pure Aloe Vera — Generous 32% Bio-Polysaccharide Hydration', scoreWeights: { aloe: 4 } },
    ],
  },
];

export const VERIFICATION_WIZARD_STEP_DEFINITIONS = [
  {
    step: 1,
    code: 'STEP_1_VERIFY_ORDER',
    title: 'Step 1 of 7 · Order ID & Registered Contact Authentication',
    shortTitle: '1. Verify Order',
    description: 'Validate your Order ID (e.g., BHVM...) and registered Email or 10-digit Phone against our encrypted order ledger.',
  },
  {
    step: 2,
    code: 'STEP_2_SELECT_CATEGORY',
    title: 'Step 2 of 7 · Inquiry Category & Line-Item Selection',
    shortTitle: '2. Issue Scope',
    description: 'Select the specific order intervention needed (Delivery Expedite, Address/Phone Edit, Damaged/Leakage, Batch Verification, or Ritual Consultation).',
  },
  {
    step: 3,
    code: 'STEP_3_CONDITION_CHECKLIST',
    title: 'Step 3 of 7 · Packaging, Seal & Batch Inspection Checklist',
    shortTitle: '3. Inspection',
    description: 'Confirm outer tamper seal status, bottle pump condition, and optional photo evidence for priority processing.',
  },
  {
    step: 4,
    code: 'STEP_4_REMEDY_PREFERENCE',
    title: 'Step 4 of 7 · Preferred Resolution Remedy',
    shortTitle: '4. Resolution',
    description: 'Choose your preferred resolution outcome: Priority Replacement Dispatch, Instant Wallet Credit (+10% Bonus), Source Refund, or Live Modification.',
  },
  {
    step: 5,
    code: 'STEP_5_OUTREACH_CHANNEL',
    title: 'Step 5 of 7 · Specialist Outreach Channel & Callback Time Slot',
    shortTitle: '5. Contact Slot',
    description: 'Select Email Update or Direct Specialist Phone Call with your preferred IST time window (Morning, Afternoon, or Evening).',
  },
  {
    step: 6,
    code: 'STEP_6_REVIEW_DOSSIER',
    title: 'Step 6 of 7 · Review Verified Escalation Dossier & 12-Hour SLA',
    shortTitle: '6. Review & Confirm',
    description: 'Verify your complete ticket summary before dispatching to our Senior Client Concierge Desk.',
  },
  {
    step: 7,
    code: 'STEP_7_CONFIRMED_SLA',
    title: 'Step 7 of 7 · Confirmed Specialist Ticket & 12-Hour SLA Guarantee',
    shortTitle: '7. Confirmed',
    description: 'Your single verified ticket is locked in with a guaranteed specialist response within 12 hours.',
  },
];

export const RETURN_INSPECTION_STEP_DEFINITIONS = [
  {
    step: 1,
    title: 'Step 1 of 6 · Eligibility & 7-Day Delivery Window Check',
    detail: 'Delivered orders are eligible for return or free replacement within 7 days of delivery for damaged, leaked, wrong, or defective items.',
  },
  {
    step: 2,
    title: 'Step 2 of 6 · Outer Carton & Tamper Seal Verification',
    detail: 'Locate the gold hologram tamper seal and the laser-etched batch number on the base of your Bhumivera bottle or outer box.',
  },
  {
    step: 3,
    title: 'Step 3 of 6 · Photo Documentation (Up to 3 Clear Images)',
    detail: 'Use the Paperclip button in the Concierge composer to attach 1–3 photos showing the shipping label, batch code, and item condition.',
  },
  {
    step: 4,
    title: 'Step 4 of 6 · Choose Replacement vs. Refund Mode',
    detail: 'Select Priority Free Replacement (dispatched within 24 hours) or Full Refund (to original payment method or Bhumivera Wallet).',
  },
  {
    step: 5,
    title: 'Step 5 of 6 · Reverse Courier Pickup Scheduling',
    detail: 'Our courier partner schedules doorstep pickup within 24–48 hours; keep the product in its original box with invoice/tags.',
  },
  {
    step: 6,
    title: 'Step 6 of 6 · Instant RMA Tracking & Refund Settlement',
    detail: 'Track your RMA number directly on your Order Card in chat; refunds process within 3–5 business days after pickup verification.',
  },
];

export const AMBASSADOR_ONBOARDING_STEPS = [
  {
    step: 1,
    tierName: 'Step 1 · Discover the 4 Ambassador Tiers',
    detail: 'Progress from Botanical Advocate (12% commission) -> Emerald Curator (16%) -> Gold Sovereign (20% + Monthly PR Vault) -> Diamond Founding Partner (25% + Co-Created Editions).',
  },
  {
    step: 2,
    tierName: 'Step 2 · Authenticate Your Botanical Experience',
    detail: 'Experience our hero formulations firsthand—creators who share authentic 12-step cleansing rituals and ingredient stories convert 3.4x higher.',
  },
  {
    step: 3,
    tierName: 'Step 3 · Choose Your Content Pillar',
    detail: 'Select your storytelling focus: Ingredient Deep-Dives (Sea Buckthorn, Charcoal, Tulsi, Aloe), Ayurvedic-Modern Rituals, or Derm-Science Education.',
  },
  {
    step: 4,
    tierName: 'Step 4 · Claim Your Personal 10% Community Code & Tracking Link',
    detail: 'Receive your custom vanity code (e.g., BHUMI-YOURNAME) giving your audience 10% off while crediting your real-time creator wallet.',
  },
  {
    step: 5,
    tierName: 'Step 5 · Unlock Complimentary Seasonal PR Discovery Boxes',
    detail: 'After your first 5 verified referrals, unlock automatic complimentary dispatches of every new Bhumivera botanical launch.',
  },
  {
    step: 6,
    tierName: 'Step 6 · Monthly Direct Bank / UPI Payouts & VIP Concierge',
    detail: 'Track clicks, conversions, and payouts transparently in your dashboard with zero minimum lock-in hurdles.',
  },
];

export function computePersonalizedSkinBlueprint(answers = {}) {
  const scores = {
    sea_buckthorn: 2,
    activated_charcoal: 1,
    sacred_tulsi: 1,
    aloe_vera: 2,
    niacinamide: 2,
    panthenol: 2,
    salicylic_acid: 0,
    hyaluronic_acid: 2,
    centella_asiatica: 1,
    bakuchiol_babchi: 1,
  };

  if (answers.sebum_profile === 'oily' || answers.sebum_profile === 'combination') {
    scores.activated_charcoal += 3;
    scores.sacred_tulsi += 2;
    scores.salicylic_acid += 3;
    scores.niacinamide += 2;
  } else if (answers.sebum_profile === 'dry') {
    scores.sea_buckthorn += 3;
    scores.aloe_vera += 3;
    scores.panthenol += 3;
    scores.hyaluronic_acid += 3;
  }

  if (answers.barrier_reactivity === 'high_reactive') {
    scores.aloe_vera += 3;
    scores.centella_asiatica += 3;
    scores.panthenol += 3;
  }

  if (answers.pore_congestion === 'blackheads_sebaceous') {
    scores.activated_charcoal += 4;
    scores.salicylic_acid += 3;
  } else if (answers.pore_congestion === 'inflammatory_breakouts') {
    scores.sacred_tulsi += 4;
    scores.centella_asiatica += 2;
  }

  if (answers.pigmentation_tone === 'pih_dark_marks' || answers.pigmentation_tone === 'dullness_tan') {
    scores.sea_buckthorn += 4;
    scores.niacinamide += 3;
  } else if (answers.pigmentation_tone === 'pie_red_marks') {
    scores.centella_asiatica += 4;
    scores.aloe_vera += 2;
  }

  if (answers.hero_story_affinity && scores[answers.hero_story_affinity] !== undefined) {
    scores[answers.hero_story_affinity] += 4;
  }

  const rankedIds = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  const topIngredients = rankedIds
    .map(id => BOTANICAL_INGREDIENT_ENCYCLOPEDIA.find(item => item.id === id))
    .filter(Boolean)
    .slice(0, 5);

  const recommendedProduct =
    scores.activated_charcoal > scores.sea_buckthorn + 1
      ? BHUMIVERA_PRODUCT_CATALOG[1]
      : BHUMIVERA_PRODUCT_CATALOG[0];

  return {
    topIngredients,
    recommendedProduct,
    amSummary:
      'AM Ritual (7:00 AM–9:00 AM): 1 pump lukewarm emulsification (40s massage + 15s dwell) -> Microfiber pat to 15% dampness -> Aloe + Niacinamide + Hyaluronic Lock -> Broad-Spectrum SPF 50.',
    pmSummary:
      'PM Ritual (8:00 PM–10:30 PM): 1.5 pumps deep pore & pollution cleanse (45s zonal massage + 15s phyto-dwell) -> Damp-skin Panthenol & Ceramide seal -> Overnight Sea Buckthorn & Bakuchiol recovery.',
  };
}

export function formatIngredientDeepDiveMarkdown(ing) {
  if (!ing) return '';
  const compoundsList = (ing.bioactiveCompounds || [])
    .map(c => `- **${c.compound} (${c.concentration}):** *${c.role}* — ${c.biochemicalTarget}`)
    .join('\n');
  const pathwayList = (ing.multiStepCellularPathway || [])
    .map(p => `${p.step}. **${p.phaseName}** (${p.timeframe}): ${p.cellularMechanism} -> *${p.visibleOutcome}*`)
    .join('\n');
  const usageList = (ing.stepByStepUsageProtocol || [])
    .map(u => `${u.stepNumber}. **${u.title} (${u.durationSeconds}s):** ${u.instruction} *(Pro Tip: ${u.proTip})*`)
    .join('\n');
  const pairingsList = (ing.synergisticPairings || [])
    .map(s => `- **${s.partnerName} (Synergy ${s.synergyScore}):** ${s.combinedBenefit}`)
    .join('\n');

  return [
    `**${ing.storyNumber} · ${ing.fullTitle}** (*${ing.latinBinomial}*)`,
    `*“${ing.tagline}”*`,
    `${ing.shortSummary}`,
    `**Apothecary Specifications:**\n- **INCI:** \`${ing.inciName}\`\n- **Concentration:** ${ing.concentrationInFormula} (Optimal pH ${ing.optimalPhRange})\n- **Origin & Craft:** ${ing.originRegion} · ${ing.extractionMethod}\n- **Dosha & Safety:** ${ing.ayurvedicDoshaAffinity} · Comedogenic Rating ${ing.comedogenicRating}/5`,
    `**Key Bioactive Molecules:**\n${compoundsList}`,
    `**6-Stage Cellular Mechanism of Action:**\n${pathwayList}`,
    `**6-Step Application Protocol:**\n${usageList}`,
    `**Top Synergistic Pairings:**\n${pairingsList}`,
  ].join('\n\n');
}

export function resolveEnhancedBotanicalConcierge(rawQuery = '') {
  const q = String(rawQuery || '').toLowerCase().trim();

  // Check if user asks to compare two ingredients
  const matchedIngredients = BOTANICAL_INGREDIENT_ENCYCLOPEDIA.filter(ing => {
    const terms = [
      ing.id.replace(/_/g, ' '),
      ing.name.toLowerCase(),
      ing.latinBinomial.toLowerCase().split(' ')[0],
    ];
    if (ing.id === 'sea_buckthorn') terms.push('sea buckthorn', 'seabuckthorn', 'omega-7', 'omega 7', 'story 01', 'story 1');
    if (ing.id === 'activated_charcoal') terms.push('charcoal', 'bamboo charcoal', 'binchotan', 'story 02', 'story 2');
    if (ing.id === 'sacred_tulsi') terms.push('tulsi', 'holy basil', 'ocimum', 'story 03', 'story 3');
    if (ing.id === 'aloe_vera') terms.push('aloe', 'aloe vera', 'acemannan', 'story 04', 'story 4');
    if (ing.id === 'salicylic_acid') terms.push('salicylic', 'bha', 'willow bark');
    if (ing.id === 'hyaluronic_acid') terms.push('hyaluronic', 'sodium hyaluronate');
    if (ing.id === 'vitamin_c_ethyl') terms.push('vitamin c', 'ethyl ascorbic', 'ascorbic');
    if (ing.id === 'tocopherol_vit_e') terms.push('vitamin e', 'tocopherol');
    if (ing.id === 'turmeric_curcumin') terms.push('turmeric', 'kasturi', 'curcumin', 'haldi');
    if (ing.id === 'kashmiri_saffron') terms.push('saffron', 'kesar', 'kumkuma', 'crocin');
    if (ing.id === 'mysore_sandalwood') terms.push('sandalwood', 'chandan', 'chandana');
    if (ing.id === 'vetiver_khus') terms.push('vetiver', 'khus', 'ushira');
    if (ing.id === 'bakuchiol_babchi') terms.push('bakuchiol', 'babchi', 'phyto-retinol', 'retinol');
    if (ing.id === 'centella_asiatica') terms.push('centella', 'cica', 'gotu kola', 'madecassoside');
    if (ing.id === 'licorice_glabridin') terms.push('licorice', 'glabridin', 'yashtimadhu', 'mulethi');
    return terms.some(t => t && q.includes(t));
  });

  if (
    q.includes('sea buckthorn face wash') &&
    (q.includes('key ingredient') || q.includes('tell me about') || q.includes('all ingredient'))
  ) {
    const heroOverview = HERO_INGREDIENT_STORIES.map(
      s => `- **${s.storyCode} · ${s.title}** (*${s.latinName}*): *“${s.tagline}”* — ${s.concentrationStandard}`
    ).join('\n');
    return {
      reply: [
        '**Bhumivera Sea Buckthorn Clarifying & Radiance Face Wash — Complete Botanical & Active Architecture**',
        '*“Nature has more than one note. Meet the botanicals that inspire us—and the contemporary actives shaping the next chapter of skin care.”*',
        `**The 4 Hero Botanical Stories:**\n${heroOverview}`,
        '**The Contemporary Clinical Actives (Synergy Matrix):**\n- **4.0% Pharmaceutical Niacinamide (Vit B3):** Boosts ceramides by +34%, refines pores, and blocks melanosome pigment transfer.\n- **1.5% Chirally Pure D-Panthenol (Pro-Vit B5):** Converts to Pantothenic Acid to seal barrier micro-fissures.\n- **0.5%–1.0% Botanical Salicylic Acid (Willow Bark BHA):** Lipophilic pore decongestant that dissolves blackheads.\n- **1.0% 5-Weight Hyaluronic Acid + Polyglutamic Acid:** Multi-depth water reservoir from surface cuticle to living epidermis.\n- **3-O-Ethyl Ascorbic Acid (Vit C) + Natural Vitamin E:** Redox-recycling antioxidant shield for collagen and glow.\n- **Centella Asiatica, Licorice Glabridin, Kasturi Turmeric, Kashmiri Saffron & Bakuchiol:** Complete Ayurvedic-clinical brightening and soothing ensemble.',
        'Click any ingredient chip below or open the **Explore All 32 Ingredients** drawer to inspect every molecule’s 6-stage cellular pathway and 6-step application protocol.',
      ].join('\n\n'),
      quickActions: [
        { id: 'chip_s1', label: 'Story 01 · Sea Buckthorn', prompt: 'Tell me the full Ingredient Story 01 for Sea Buckthorn and its cellular steps', category: 'closely_related_ingredient' },
        { id: 'chip_s2', label: 'Story 02 · Activated Charcoal', prompt: 'Tell me the full Ingredient Story 02 for Charcoal and how it purifies pores', category: 'closely_related_ingredient' },
        { id: 'chip_s3', label: 'Story 03 · Sacred Tulsi', prompt: 'Tell me the full Ingredient Story 03 for Tulsi and its adaptogenic skin benefits', category: 'closely_related_ingredient' },
        { id: 'chip_s4', label: 'Story 04 · Pure Aloe Vera', prompt: 'Tell me the full Ingredient Story 04 for Aloe Vera and its hydration mechanism', category: 'closely_related_ingredient' },
        { id: 'chip_ritual', label: '12-Step Face Wash Ritual & Timing', prompt: 'How do I really use Sea Buckthorn Face Wash step-by-step and what time of day should I use it?', category: 'usage_and_timing' },
        { id: 'chip_all32', label: 'Open 32-Ingredient Encyclopedia', prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__', category: 'ingredient_deep_dive' },
      ],
    };
  }

  if (
    q.includes('step-by-step') ||
    q.includes('what time of day') ||
    q.includes('how do i really use') ||
    q.includes('12-step') ||
    q.includes('ritual')
  ) {
    const stepsText = MASTER_SKINCARE_RITUAL_STEPS.map(
      s => `${s.stepNumber}. **${s.title} (${s.durationSeconds}s):** ${s.detailedInstruction} *(Tip: ${s.proConciergeTip})*`
    ).join('\n');
    return {
      reply: [
        '**The Master 12-Step Bhumivera Cleansing & Layering Ritual (Chronobiological Guide)**',
        '**Optimal Circadian Timing:**\n- **Morning Awakening Ritual (7:00 AM – 9:00 AM):** Use **1 pump** to lift overnight sweat, oxidized squalene, and pillow bacteria while priming your skin with Vitamin C, Niacinamide, and Sea Buckthorn carotenoids before sunscreen.\n- **Evening Detox & Repair Ritual (8:00 PM – 10:30 PM):** Use **1.5 pumps** to adsorb PM2.5 smog, dissolve SPF/makeup, and prep your barrier before the 11:00 PM – 2:00 AM nocturnal stem-cell repair peak.',
        `**The Complete 12-Step Protocol:**\n${stepsText}`,
      ].join('\n\n'),
      quickActions: [
        { id: 'open_timer', label: 'Launch Interactive 12-Step Ritual Timer', prompt: '__OPEN_RITUAL_PLAYER__', category: 'post_wash_routine' },
        { id: 'open_quiz', label: 'Take 8-Step Skin Diagnostic Quiz', prompt: '__OPEN_SKIN_DIAGNOSTIC__', category: 'skin_compatibility' },
        { id: 'story_01', label: 'Story 01 · Sea Buckthorn', prompt: 'Tell me the full Ingredient Story 01 for Sea Buckthorn and its cellular steps', category: 'closely_related_ingredient' },
        { id: 'story_04', label: 'Story 04 · Pure Aloe Vera', prompt: 'Tell me the full Ingredient Story 04 for Aloe Vera and its hydration mechanism', category: 'closely_related_ingredient' },
      ],
    };
  }

  if (matchedIngredients.length >= 2 && (q.includes('with') || q.includes('vs') || q.includes('compare') || q.includes('together'))) {
    const [ingA, ingB] = matchedIngredients;
    return {
      reply: [
        `**Botanical & Active Synergy Analysis: ${ingA.name} + ${ingB.name}**`,
        `- **${ingA.name} (${ingA.storyNumber}):** *“${ingA.tagline}”* — Focuses on **${ingA.primaryClinicalBenefit.toLowerCase()}** at ${ingA.concentrationInFormula} (pH ${ingA.optimalPhRange}).\n- **${ingB.name} (${ingB.storyNumber}):** *“${ingB.tagline}”* — Focuses on **${ingB.primaryClinicalBenefit.toLowerCase()}** at ${ingB.concentrationInFormula} (pH ${ingB.optimalPhRange}).`,
        `**How They Work Together Step-by-Step:**\n1. **Phase 1 (Surface & Pore Synergy):** ${ingA.name} delivers \`${ingA.bioactiveCompounds[0]?.compound}\` while ${ingB.name} contributes \`${ingB.bioactiveCompounds[0]?.compound}\`—operating at compatible physiological pH without neutralizing each other.\n2. **Phase 2 (Cellular Amplification):** ${ingA.bioactiveCompounds[0]?.biochemicalTarget} Simultaneously, ${ingB.bioactiveCompounds[0]?.biochemicalTarget}\n3. **Phase 3 (Application Protocol):** Emulsify together during your 45-second zonal massage, pause for the 15-second phyto-dwell, rinse with lukewarm water, and lock onto 15% damp skin within 60 seconds.`,
      ].join('\n\n'),
      quickActions: [
        ...(ingA.recommendedChips || []).slice(0, 2),
        ...(ingB.recommendedChips || []).slice(0, 2),
      ],
    };
  }

  if (matchedIngredients.length === 1) {
    const ing = matchedIngredients[0];
    return {
      reply: formatIngredientDeepDiveMarkdown(ing),
      quickActions: ing.recommendedChips || PUBLIC_GENERAL_CHIPS,
    };
  }

  // Fallback to existing utility if available, otherwise rich default
  try {
    const fallback = resolveClientSideConciergeFallback(rawQuery);
    if (fallback && fallback.reply) {
      return fallback;
    }
  } catch {}

  return {
    reply: [
      '**Welcome to the Bhumivera Client Concierge.**',
      'I can guide you through our **32 Botanical & Contemporary Active Ingredients** (led by *Story 01 · Sea Buckthorn*, *Story 02 · Activated Charcoal*, *Story 03 · Sacred Tulsi*, and *Story 04 · Pure Aloe Vera*), our **12-Step Facial Cleansing & Layering Ritual**, our **8-Step Personalized Skin Diagnostic**, or our **7-Step Verified Order Escalation**.',
      'Select any topic below or ask about any ingredient, skin concern, or order ID.',
    ].join('\n\n'),
    quickActions: PUBLIC_GENERAL_CHIPS,
  };
}

function playSupportChime(enabled = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.14);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.29);
    setTimeout(() => ctx.close().catch(() => {}), 400);
  } catch {}
}

function FormattedMarkdown({ content, isDark, onNavigate }) {
  const renderInline = (text, keyPrefix) => {
    if (!text) return null;
    const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
    const parts = String(text).split(pattern);
    return parts.map((part, idx) => {
      const key = `${keyPrefix}-${idx}`;
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={key} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={key}
            className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
              isDark ? 'bg-white/10 text-[#D4AF37]' : 'bg-[#0B2419]/10 text-[#0B2419]'
            }`}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          const [, label, href] = match;
          const isInternal = href.startsWith('/');
          return (
            <a
              key={key}
              href={href}
              onClick={e => {
                if (isInternal && onNavigate) {
                  e.preventDefault();
                  onNavigate(href);
                }
              }}
              target={isInternal ? undefined : '_blank'}
              rel={isInternal ? undefined : 'noopener noreferrer'}
              className="underline underline-offset-2 font-medium text-[#D4AF37] hover:opacity-80"
            >
              {label}
            </a>
          );
        }
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={key} className="italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const blocks = String(content || '').split(/\n{2,}/);
  return (
    <div className="space-y-2 text-[13px] leading-relaxed">
      {blocks.map((block, bIdx) => {
        const lines = block.split('\n');
        const isList = lines.every(l => /^\s*([-•*]|\d+\.)\s+/.test(l));
        if (isList) {
          return (
            <ul key={bIdx} className="space-y-1 pl-4 list-disc">
              {lines.map((line, lIdx) => (
                <li key={lIdx}>{renderInline(line.replace(/^\s*([-•*]|\d+\.)\s+/, ''), `${bIdx}-${lIdx}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bIdx} className="whitespace-pre-wrap break-words">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInline(line, `${bIdx}-${lIdx}`)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function ChatOrderCard({ order, isDark, onQuickPrompt, onRequestOrderIntervention }) {
  const [copied, setCopied] = useState(false);
  const [showLifecycleDetails, setShowLifecycleDetails] = useState(false);
  const status = String(order.status || 'pending').toLowerCase();
  const isTerminal = ['cancelled', 'returned'].includes(status);
  const stepIndex = Math.max(0, Math.min(4, Number(order.currentStep ?? 0)));

  const copyTracking = () => {
    if (!order.trackingNumber || !navigator.clipboard) return;
    navigator.clipboard.writeText(order.trackingNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  return (
    <div
      className={`mt-2.5 rounded-2xl border p-3.5 text-xs transition-all ${
        isDark
          ? 'bg-[#071510]/90 border-white/15 text-stone-100'
          : 'bg-white border-[#0B2419]/15 text-[#0B2419] shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-current/10">
        <div>
          <span className="text-[10px] uppercase tracking-wider opacity-60 block">Order Reference</span>
          <span className="font-mono font-bold text-sm">#{order.orderNumber || order.id}</span>
        </div>
        <div className="text-right">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isTerminal
                ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                : status === 'delivered'
                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                : 'bg-[#D4AF37]/20 text-[#b38f22] dark:text-[#D4AF37] border border-[#D4AF37]/40'
            }`}
          >
            {status}
          </span>
          <span className="block font-bold text-xs mt-0.5">₹{Number(order.total || 0).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {!isTerminal && (
        <div className="py-3">
          <div className="grid grid-cols-5 gap-1 text-[9px] font-medium text-center">
            {ORDER_STEPS.map((label, idx) => {
              const active = idx <= stepIndex;
              return (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div
                    className={`h-1.5 w-full rounded-full transition-all ${
                      active ? 'bg-[#D4AF37]' : isDark ? 'bg-white/10' : 'bg-stone-200'
                    }`}
                  />
                  <span className={active ? 'opacity-100 font-semibold' : 'opacity-45'}>{label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] opacity-75">
            <span>{DETAILED_ORDER_LIFECYCLE_STEPS[stepIndex]?.title || 'Order in Progress'}</span>
            <button
              type="button"
              onClick={() => setShowLifecycleDetails(prev => !prev)}
              className="text-[#D4AF37] underline font-semibold"
            >
              {showLifecycleDetails ? 'Hide 5-Step Log' : 'View 5-Step Log'}
            </button>
          </div>
          {showLifecycleDetails && (
            <div className="mt-2 space-y-1.5 rounded-xl bg-current/5 p-2.5 text-[10px]">
              {DETAILED_ORDER_LIFECYCLE_STEPS.map(stepObj => {
                const done = stepObj.stepIndex <= stepIndex;
                return (
                  <div key={stepObj.code} className={`flex items-start gap-2 ${done ? 'opacity-100' : 'opacity-45'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${done ? 'text-[#D4AF37]' : 'opacity-40'}`} />
                    <div>
                      <div className="font-semibold">
                        Step {stepObj.stepIndex + 1}: {stepObj.title} ({stepObj.typicalDuration})
                      </div>
                      <div className="opacity-80">{stepObj.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="space-y-1 text-[11px] opacity-85 pt-1">
        {order.deliveryEstimate && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>{order.deliveryEstimate}</span>
          </div>
        )}
        {order.trackingNumber && (
          <div className="flex items-center justify-between gap-2 rounded-lg bg-current/5 px-2 py-1">
            <span className="flex items-center gap-1.5 truncate">
              <Truck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="font-mono truncate">
                {order.courier ? `${order.courier}: ` : ''}{order.trackingNumber}
              </span>
            </span>
            <button
              type="button"
              onClick={copyTracking}
              className="p-1 rounded hover:bg-current/10 shrink-0"
              title="Copy tracking number"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>

      {Array.isArray(order.items) && order.items.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-current/10 space-y-1.5">
          {order.items.slice(0, 2).map((item, idx) => (
            <div key={item.id || idx} className="flex items-center justify-between gap-2 text-[11px]">
              <span className="truncate font-medium">
                {item.quantity || 1}× {item.name}
              </span>
              <span className="shrink-0 opacity-75">₹{Number(item.price || 0).toLocaleString('en-IN')}</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-[10px] opacity-60">+{order.items.length - 2} more item(s)</p>
          )}
        </div>
      )}

      {/* Strict Order Policy: Self-service cancellation is disabled; customers use Verified Specialist Escalation */}
      <div className="mt-3 pt-2 border-t border-current/10 flex flex-wrap gap-1.5">
        {!isTerminal && status !== 'delivered' && (
          <button
            type="button"
            onClick={() => onRequestOrderIntervention?.(order.orderNumber || order.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#D4AF37]/15 text-[#8a6a12] dark:text-[#D4AF37] hover:bg-[#D4AF37]/25 transition-colors"
          >
            <PhoneCall className="w-3 h-3" /> Request Specialist Assistance
          </button>
        )}
        {order.canReturn && (
          <>
            <button
              type="button"
              onClick={() => onQuickPrompt(`Initiate return for order #${order.orderNumber}`)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#D4AF37]/15 text-[#8a6a12] dark:text-[#D4AF37] hover:bg-[#D4AF37]/25 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Initiate Return
            </button>
            <button
              type="button"
              onClick={() => onQuickPrompt(`Request replacement for order #${order.orderNumber}`)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 transition-colors"
            >
              <Package className="w-3 h-3" /> Request Replacement
            </button>
          </>
        )}
        {order.activeReturn && (
          <button
            type="button"
            onClick={() => onQuickPrompt(`Check refund status for ${order.activeReturn.rmaNumber || `order #${order.orderNumber}`}`)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-sky-500/15 text-sky-700 dark:text-sky-300"
          >
            <RefreshCw className="w-3 h-3" /> Status: {order.activeReturn.rmaNumber}
          </button>
        )}
      </div>
    </div>
  );
}

function IngredientEncyclopediaDrawer({
  isOpen,
  onClose,
  isDark,
  selectedIngredientId,
  onSelectIngredient,
  onAskConciergeAbout,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('story'); // 'story' | 'molecules' | 'pathway' | 'protocol' | 'timeline' | 'compare'
  const [comparePartnerId, setComparePartnerId] = useState('niacinamide');

  const selectedIngredient = useMemo(() => {
    return (
      BOTANICAL_INGREDIENT_ENCYCLOPEDIA.find(i => i.id === selectedIngredientId) ||
      BOTANICAL_INGREDIENT_ENCYCLOPEDIA[0]
    );
  }, [selectedIngredientId]);

  const comparePartner = useMemo(() => {
    return (
      BOTANICAL_INGREDIENT_ENCYCLOPEDIA.find(i => i.id === comparePartnerId) ||
      BOTANICAL_INGREDIENT_ENCYCLOPEDIA[4]
    );
  }, [comparePartnerId]);

  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return BOTANICAL_INGREDIENT_ENCYCLOPEDIA.filter(item => {
      if (categoryFilter === 'HERO' && !item.isHeroStory) return false;
      if (categoryFilter === 'ACTIVE' && item.isHeroStory) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.fullTitle.toLowerCase().includes(q) ||
        item.latinBinomial.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.primaryClinicalBenefit.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, categoryFilter]);

  if (!isOpen) return null;

  return (
    <div
      className={`px-4 py-3.5 border-b space-y-3 text-xs shrink-0 max-h-[400px] overflow-y-auto ${
        isDark ? 'bg-[#0b1f17] border-[#D4AF37]/40 text-stone-100' : 'bg-[#fbf9f2] border-[#D4AF37]/50 text-[#0B2419]'
      }`}
    >
      {/* Showcase Header Matching Uploaded Image */}
      <div className="flex items-start justify-between gap-2 pb-2 border-b border-current/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D4AF37] block">
            Nature has more than one note · 32 Botanical & Active Profiles
          </span>
          <p className="text-[11px] opacity-80 mt-0.5">
            Meet the botanicals that inspire us—and the contemporary actives shaping the next chapter of skin care.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-2 py-0.5 rounded-lg border border-current/20 text-[11px] opacity-75 hover:opacity-100"
        >
          Close ✕
        </button>
      </div>

      {/* 4 Hero Ingredient Story Cards (Sea buckthorn, Charcoal, Tulsi, Aloe vera) */}
      <div className="grid grid-cols-2 gap-2">
        {HERO_INGREDIENT_STORIES.map(story => {
          const isSelected = selectedIngredient?.id === story.ingredientId;
          return (
            <button
              key={story.storyCode}
              type="button"
              onClick={() => onSelectIngredient(story.ingredientId)}
              className={`text-left p-2.5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-[#0B2419] text-[#FDFBF7] border-[#D4AF37] shadow-md'
                  : isDark
                  ? 'bg-black/25 border-white/10 hover:border-[#D4AF37]/50'
                  : 'bg-white border-[#0B2419]/15 hover:border-[#D4AF37]'
              }`}
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                {story.storyCode}
              </span>
              <div className="font-serif font-semibold text-xs mt-0.5">{story.title}</div>
              <p className="text-[10px] opacity-80 line-clamp-2 mt-0.5">{story.tagline}</p>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar for All 32 Ingredients */}
      <div className="flex flex-wrap items-center gap-1.5">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search 32 ingredients (e.g., Sea Buckthorn, Charcoal, Tulsi, Aloe, Niacinamide)…"
          className={`flex-1 min-w-[160px] px-2.5 py-1.5 rounded-xl border text-[11px] outline-none ${
            isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-white border-stone-300 text-[#0B2419]'
          }`}
        />
        {['ALL', 'HERO', 'ACTIVE'].map(mode => (
          <button
            key={mode}
            type="button"
            onClick={() => setCategoryFilter(mode)}
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold border ${
              categoryFilter === mode
                ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37]'
                : 'border-current/20 opacity-75'
            }`}
          >
            {mode === 'ALL' ? 'All (32)' : mode === 'HERO' ? 'Hero Stories (4)' : 'Actives (28)'}
          </button>
        ))}
      </div>

      {/* Horizontal Selector Pills for Filtered Ingredients */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {filteredList.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectIngredient(item.id)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition ${
              selectedIngredient?.id === item.id
                ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37]'
                : 'border-current/20 opacity-80 hover:opacity-100'
            }`}
          >
            {item.indexNumber}. {item.name}
          </button>
        ))}
      </div>

      {/* Selected Ingredient Deep-Dive Card with 6 Interactive Tabs */}
      {selectedIngredient && (
        <div
          className={`rounded-2xl border p-3 space-y-2.5 ${
            isDark ? 'bg-[#071510] border-white/15' : 'bg-white border-[#0B2419]/15 shadow-sm'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">
                {selectedIngredient.storyNumber} · {selectedIngredient.category}
              </span>
              <h4 className="font-serif text-sm font-bold mt-0.5">
                {selectedIngredient.fullTitle}
              </h4>
              <p className="text-[10px] italic opacity-75">
                {selectedIngredient.latinBinomial} · INCI: {selectedIngredient.inciName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAskConciergeAbout(`Tell me about ${selectedIngredient.name} and its step-by-step ritual`)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-semibold"
            >
              Ask in Chat
            </button>
          </div>

          {/* 6 Deep-Dive Tabs */}
          <div className="flex flex-wrap gap-1 border-b border-current/10 pb-2">
            {[
              { id: 'story', label: '1. Overview' },
              { id: 'molecules', label: '2. Bio-Molecules (4)' },
              { id: 'pathway', label: '3. Cellular Steps (6)' },
              { id: 'protocol', label: '4. Usage Ritual (6)' },
              { id: 'timeline', label: '5. Skin Matrix' },
              { id: 'compare', label: '6. Compare Synergy' },
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
                  activeTab === t.id
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'story' && (
            <div className="space-y-1.5 text-[11px]">
              <p className="font-medium text-[#D4AF37]">“{selectedIngredient.tagline}”</p>
              <p className="leading-relaxed opacity-90">{selectedIngredient.shortSummary}</p>
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                <div className="p-2 rounded-lg bg-current/5">
                  <strong>Concentration:</strong> {selectedIngredient.concentrationInFormula}
                </div>
                <div className="p-2 rounded-lg bg-current/5">
                  <strong>Optimal pH:</strong> {selectedIngredient.optimalPhRange}
                </div>
                <div className="p-2 rounded-lg bg-current/5">
                  <strong>Origin:</strong> {selectedIngredient.originRegion}
                </div>
                <div className="p-2 rounded-lg bg-current/5">
                  <strong>Extraction:</strong> {selectedIngredient.extractionMethod}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'molecules' && (
            <div className="space-y-2 text-[11px]">
              {(selectedIngredient.bioactiveCompounds || []).map((c, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-current/5 space-y-0.5">
                  <div className="font-bold text-[#D4AF37]">
                    {idx + 1}. {c.compound} ({c.concentration})
                  </div>
                  <div className="text-[10px] font-semibold opacity-85">{c.role}</div>
                  <div className="text-[10px] opacity-80">{c.biochemicalTarget}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pathway' && (
            <div className="space-y-2 text-[11px]">
              {(selectedIngredient.multiStepCellularPathway || []).map(p => (
                <div key={p.step} className="p-2 rounded-xl bg-current/5 space-y-0.5">
                  <div className="font-bold text-[#D4AF37]">
                    {p.phaseName} · <span className="font-normal opacity-80">{p.timeframe}</span>
                  </div>
                  <div className="text-[10px] opacity-85">{p.cellularMechanism}</div>
                  <div className="text-[10px] text-emerald-500 font-medium">Outcome: {p.visibleOutcome}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'protocol' && (
            <div className="space-y-2 text-[11px]">
              {(selectedIngredient.stepByStepUsageProtocol || []).map(u => (
                <div key={u.stepNumber} className="p-2 rounded-xl bg-current/5 space-y-0.5">
                  <div className="font-bold text-[#D4AF37]">
                    {u.title} ({u.durationSeconds}s)
                  </div>
                  <div className="text-[10px] opacity-90">{u.instruction}</div>
                  <div className="text-[10px] text-emerald-500">Tip: {u.proTip}</div>
                  <div className="text-[10px] text-rose-400">Avoid: {u.commonMistakeToAvoid}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-2 text-[11px]">
              <div className="space-y-1">
                {(selectedIngredient.clinicalTimeline || []).map((m, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-current/5">
                    <div className="font-bold text-[#D4AF37]">{m.milestone}</div>
                    <div className="text-[10px] opacity-85">{m.metrics}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold">Compare {selectedIngredient.name} with:</span>
                <select
                  value={comparePartnerId}
                  onChange={e => setComparePartnerId(e.target.value)}
                  className={`px-2 py-1 rounded-lg border text-[10px] outline-none ${
                    isDark ? 'bg-black/40 border-white/15 text-white' : 'bg-stone-100 border-stone-300 text-[#0B2419]'
                  }`}
                >
                  {BOTANICAL_INGREDIENT_ENCYCLOPEDIA.filter(x => x.id !== selectedIngredient.id).map(x => (
                    <option key={x.id} value={x.id}>
                      {x.name} ({x.storyNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded-xl bg-current/5 space-y-1">
                  <div className="font-bold text-[#D4AF37]">{selectedIngredient.name}</div>
                  <div><strong>Dose:</strong> {selectedIngredient.concentrationInFormula}</div>
                  <div><strong>pH:</strong> {selectedIngredient.optimalPhRange}</div>
                  <div><strong>Focus:</strong> {selectedIngredient.primaryClinicalBenefit}</div>
                </div>
                <div className="p-2 rounded-xl bg-current/5 space-y-1">
                  <div className="font-bold text-emerald-400">{comparePartner.name}</div>
                  <div><strong>Dose:</strong> {comparePartner.concentrationInFormula}</div>
                  <div><strong>pH:</strong> {comparePartner.optimalPhRange}</div>
                  <div><strong>Focus:</strong> {comparePartner.primaryClinicalBenefit}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onAskConciergeAbout(`Compare ${selectedIngredient.name} with ${comparePartner.name} and how to use them together`)
                }
                className="w-full py-1.5 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-semibold text-[10px]"
              >
                Generate Full Synergy Protocol in Chat
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MasterRitualPlayerDrawer({ isOpen, onClose, isDark, onSendSummaryToChat }) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(MASTER_SKINCARE_RITUAL_STEPS[0].durationSeconds);
  const [timerRunning, setTimerRunning] = useState(false);

  const currentStep = MASTER_SKINCARE_RITUAL_STEPS[activeStepIdx] || MASTER_SKINCARE_RITUAL_STEPS[0];

  useEffect(() => {
    setSecondsLeft(currentStep.durationSeconds);
    setTimerRunning(false);
  }, [activeStepIdx, currentStep.durationSeconds]);

  useEffect(() => {
    if (!timerRunning || !isOpen) return undefined;
    const interval = window.setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`px-4 py-3.5 border-b space-y-2.5 text-xs shrink-0 max-h-80 overflow-y-auto ${
        isDark ? 'bg-[#0c2119] border-[#D4AF37]/40 text-stone-100' : 'bg-[#fbf9f2] border-[#D4AF37]/50 text-[#0B2419]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
          Interactive 12-Step Cleansing & Layering Ritual Timer
        </span>
        <button type="button" onClick={onClose} className="text-xs opacity-70 hover:opacity-100">
          ✕
        </button>
      </div>

      {/* 12-Step Progress Pills */}
      <div className="grid grid-cols-12 gap-1">
        {MASTER_SKINCARE_RITUAL_STEPS.map((s, idx) => (
          <button
            key={s.phaseCode}
            type="button"
            onClick={() => setActiveStepIdx(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === activeStepIdx
                ? 'bg-[#D4AF37] scale-y-125'
                : idx < activeStepIdx
                ? 'bg-emerald-500/70'
                : 'bg-current/15'
            }`}
            title={s.title}
          />
        ))}
      </div>

      <div className="p-3 rounded-2xl bg-current/5 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-xs text-[#D4AF37]">{currentStep.title}</span>
          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-[#0B2419] text-[#D4AF37]">
            {secondsLeft}s
          </span>
        </div>
        <div className="text-[10px] font-semibold opacity-75">
          Target: {currentStep.anatomicalTarget} · Water: {currentStep.waterTempCelsius}
        </div>
        <p className="text-[11px] leading-relaxed">{currentStep.detailedInstruction}</p>
        <div className="text-[10px] text-emerald-500">
          <strong>Concierge Tip:</strong> {currentStep.proConciergeTip}
        </div>
        <div className="text-[10px] text-rose-400">
          <strong>Avoid:</strong> {currentStep.mistakeToAvoid}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={activeStepIdx === 0}
          onClick={() => setActiveStepIdx(prev => Math.max(0, prev - 1))}
          className="px-2.5 py-1.5 rounded-xl border border-current/20 text-[11px] font-semibold disabled:opacity-40"
        >
          ← Prev Step
        </button>
        <button
          type="button"
          onClick={() => setTimerRunning(prev => !prev)}
          className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-[#0B2419] font-bold text-[11px]"
        >
          {timerRunning ? 'Pause Timer' : secondsLeft === 0 ? 'Step Complete ✓' : `Start ${secondsLeft}s Timer`}
        </button>
        {activeStepIdx < MASTER_SKINCARE_RITUAL_STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setActiveStepIdx(prev => Math.min(MASTER_SKINCARE_RITUAL_STEPS.length - 1, prev + 1))}
            className="px-2.5 py-1.5 rounded-xl bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/40 text-[11px] font-semibold"
          >
            Next Step →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              onSendSummaryToChat('How do I really use Sea Buckthorn Face Wash step-by-step and what time of day should I use it?');
              onClose();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-semibold"
          >
            Post Full 12-Step Guide in Chat
          </button>
        )}
      </div>
    </div>
  );
}

function SkinDiagnosticQuizDrawer({ isOpen, onClose, isDark, onCompleteBlueprint }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  if (!isOpen) return null;

  const currentQuestion = SKIN_DIAGNOSTIC_STEPS[stepIdx];
  const isFinished = stepIdx >= SKIN_DIAGNOSTIC_STEPS.length;
  const blueprint = isFinished ? computePersonalizedSkinBlueprint(answers) : null;

  return (
    <div
      className={`px-4 py-3.5 border-b space-y-2.5 text-xs shrink-0 max-h-80 overflow-y-auto ${
        isDark ? 'bg-[#0c2119] border-[#D4AF37]/40 text-stone-100' : 'bg-[#fbf9f2] border-[#D4AF37]/50 text-[#0B2419]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
          8-Step Botanical Skin Diagnostic & Regimen Architect
        </span>
        <button type="button" onClick={onClose} className="text-xs opacity-70 hover:opacity-100">
          ✕
        </button>
      </div>

      {!isFinished && currentQuestion ? (
        <div className="space-y-2">
          <div className="font-bold text-xs">{currentQuestion.question}</div>
          <div className="text-[10px] opacity-75">{currentQuestion.subtitle}</div>
          <div className="space-y-1.5 pt-1">
            {currentQuestion.options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const next = { ...answers, [currentQuestion.id]: opt.value };
                  setAnswers(next);
                  setStepIdx(prev => prev + 1);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl border text-[11px] transition ${
                  isDark
                    ? 'bg-black/25 border-white/15 hover:border-[#D4AF37]'
                    : 'bg-white border-stone-300 hover:border-[#0B2419]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        blueprint && (
          <div className="space-y-2 text-[11px]">
            <div className="font-bold text-emerald-500">
              Diagnostic Complete · Recommended Anchor: {blueprint.recommendedProduct.name}
            </div>
            <div>
              <strong>Top 5 Synergistic Bio-Actives for Your Skin:</strong>{' '}
              {blueprint.topIngredients.map(i => i.name).join(', ')}
            </div>
            <div className="p-2 rounded-xl bg-current/5 text-[10px] space-y-1">
              <div>{blueprint.amSummary}</div>
              <div>{blueprint.pmSummary}</div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStepIdx(0);
                  setAnswers({});
                }}
                className="px-3 py-1.5 rounded-xl border border-current/20 text-[10px] font-semibold"
              >
                Retake 8-Step Quiz
              </button>
              <button
                type="button"
                onClick={() => {
                  onCompleteBlueprint(blueprint);
                  onClose();
                }}
                className="flex-1 py-1.5 rounded-xl bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/40 font-semibold text-[10px]"
              >
                Send My Personalized Blueprint to Chat
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

class SupportWidgetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error('[SUPPORT_WIDGET_BOUNDARY]', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[250]">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B2419] px-4 py-3 text-xs font-semibold text-[#FDFBF7] shadow-xl border border-[#D4AF37]/40"
          >
            <MessageSquare className="w-4 h-4 text-[#D4AF37]" /> Client Concierge
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export function SupportAssistantInner({ lingerThresholdMs = LINGER_THRESHOLD_MS }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const { cart = [], isCartOpen = false } = useCart() || {};

  const persisted = useMemo(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const [isOpen, setIsOpen] = useState(Boolean(persisted.isOpen));
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof persisted.isDark === 'boolean') return persisted.isDark;
    return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  });
  const [soundEnabled, setSoundEnabled] = useState(persisted.soundEnabled !== false);
  const [sessionToken, setSessionToken] = useState(
    () => localStorage.getItem(SESSION_TOKEN_KEY) || sessionStorage.getItem(SESSION_TOKEN_KEY) || null
  );
  const [chatStatus, setChatStatus] = useState(persisted.chatStatus || 'active');
  const [assignedAgentName, setAssignedAgentName] = useState(persisted.assignedAgentName || null);
  const [messages, setMessages] = useState(() => (Array.isArray(persisted.messages) ? persisted.messages : []));
  const [hasPlacedOrder, setHasPlacedOrder] = useState(Boolean(persisted.hasPlacedOrder));
  const [quickActions, setQuickActions] = useState(() =>
    Array.isArray(persisted.quickActions) && persisted.quickActions.length
      ? persisted.quickActions
      : PUBLIC_GENERAL_CHIPS
  );
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [statusLabel, setStatusLabel] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [proactiveBubble, setProactiveBubble] = useState(null);
  const [csatRating, setCsatRating] = useState(5);
  const [csatFeedback, setCsatFeedback] = useState('');
  const [csatSubmitted, setCsatSubmitted] = useState(false);
  const [csatSubmitting, setCsatSubmitting] = useState(false);
  const [csatError, setCsatError] = useState('');
  const [telegramBotUrl, setTelegramBotUrl] = useState('https://web.telegram.org/k/#@BhumiveraBot');
  const [copilotRescue, setCopilotRescue] = useState(null);
  const [copilotEmailInput, setCopilotEmailInput] = useState('');
  const [copilotSendingReset, setCopilotSendingReset] = useState(false);
  const [conciergeFlow, setConciergeFlow] = useState(
    persisted.conciergeFlow || { activeProductId: null, lastIngredientId: 'sea_buckthorn' }
  );

  // Interactive Drawers for 32-Ingredient Encyclopedia, 12-Step Ritual Timer, and 8-Step Skin Diagnostic
  const [ingredientDrawerOpen, setIngredientDrawerOpen] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState('sea_buckthorn');
  const [ritualDrawerOpen, setRitualDrawerOpen] = useState(false);
  const [diagnosticDrawerOpen, setDiagnosticDrawerOpen] = useState(false);

  // Multi-Step Legitimate Customer Verification & Specialist Escalation Flow State
  // Supports both direct 3-Step Express Verification AND Detailed 7-Step Granular Inspection
  const [escalationWizard, setEscalationWizard] = useState({
    open: false,
    step: 1, // 1 = Verify Order ID + Email/Phone, 2 = Contact Preference & Granular Checklist, 3 = Confirmed
    detailedSubStep: 1, // 1..7 granular checklist view inside the verification flow
    orderId: '',
    emailOrPhone: '',
    verifiedOrder: null,
    issueCategory: 'order_modification_or_delivery',
    sealCondition: 'intact_verified',
    remedyPreference: 'specialist_callback_or_resolution',
    contactPreference: 'email', // 'email' | 'phone_call'
    callbackPhone: '',
    callbackTimeSlot: CALLBACK_SLOTS[0],
    queryDetails: '',
    busy: false,
    error: '',
    ticketReference: '',
  });

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const sessionInitializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const snapshot = JSON.stringify({
        isOpen,
        isDark,
        soundEnabled,
        chatStatus,
        assignedAgentName,
        hasPlacedOrder,
        messages: messages.slice(-50),
        quickActions,
        conciergeFlow,
      });
      localStorage.setItem(STORAGE_KEY, snapshot);
      sessionStorage.setItem(STORAGE_KEY, snapshot);
      if (sessionToken) {
        localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
        sessionStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
      }
    } catch {}
  }, [isOpen, isDark, soundEnabled, chatStatus, assignedAgentName, hasPlacedOrder, messages, quickActions, conciergeFlow, sessionToken]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping, isOpen, escalationWizard.open, ingredientDrawerOpen, ritualDrawerOpen, diagnosticDrawerOpen]);

  const currentPageContext = useMemo(() => ({
    pathname: location.pathname,
    search: location.search,
    isCartOpen: Boolean(isCartOpen),
    cartItemCount: Array.isArray(cart) ? cart.length : 0,
    authenticated: Boolean(user?.id),
  }), [location.pathname, location.search, isCartOpen, cart, user?.id]);

  // Single Persistent Thread Initialization (Never creates duplicate threads)
  const ensureSession = useCallback(async ({ customContext = {} } = {}) => {
    try {
      const response = await aiSupportApi.initSession({
        sessionToken,
        forceNew: false,
        pageContext: { ...currentPageContext, ...customContext },
      });
      const data = response?.data || {};
      if (data.sessionToken) {
        setSessionToken(data.sessionToken);
      }
      if (data.session?.status) {
        setChatStatus(data.session.status);
      }
      setAssignedAgentName(data.session?.assignedAgentName || null);
      const buyerVerified = Boolean(data.hasPlacedOrder);
      setHasPlacedOrder(buyerVerified);
      if (data.telegramBotUrl) setTelegramBotUrl(normalizeTelegramBotUrl(data.telegramBotUrl));
      if (Array.isArray(data.messages) && data.messages.length > 0 && messages.length === 0) {
        setMessages(data.messages);
      }
      if (Array.isArray(data.quickActions) && data.quickActions.length > 0) {
        setQuickActions(data.quickActions);
      } else {
        setQuickActions(buyerVerified ? VERIFIED_BUYER_CHIPS : PUBLIC_GENERAL_CHIPS);
      }
      return data.sessionToken || sessionToken;
    } catch {
      if (messages.length === 0) {
        setChatStatus('active');
        setMessages([
          {
            id: Date.now(),
            sender: 'assistant',
            senderName: 'Bhumivera Client Concierge',
            content: user?.name
              ? `Welcome back, ${user.name.split(' ')[0]}. How may the Bhumivera Client Concierge assist you today? Explore our 4 Hero Botanical Stories (Sea Buckthorn, Charcoal, Tulsi, Aloe Vera), all 32 bioactive ingredients, our 12-Step Cleansing Ritual, or verify an Order ID.`
              : 'Welcome to Bhumivera. Ask about our 4 Hero Botanical Stories (Sea Buckthorn, Charcoal, Tulsi, Aloe Vera), all 32 clinical & Ayurvedic ingredients, our 12-Step Ritual, Brand Ambassador Program, or verify an Order ID for dedicated order support.',
            quickActions: PUBLIC_GENERAL_CHIPS,
            orderCards: [],
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      return sessionToken;
    }
  }, [sessionToken, currentPageContext, messages.length, user?.name]);

  useEffect(() => {
    if (isOpen && !sessionInitializedRef.current) {
      sessionInitializedRef.current = true;
      setUnreadCount(0);
      setProactiveBubble(null);
      void ensureSession();
    }
  }, [isOpen, ensureSession]);

  // Poll for live specialist replies ONLY when buyer has a verified order thread
  useEffect(() => {
    if (!isOpen || !sessionToken || !hasPlacedOrder || typeof aiSupportApi.getHistory !== 'function') return undefined;
    const interval = window.setInterval(async () => {
      if (isTyping) return;
      try {
        const res = await aiSupportApi.getHistory(sessionToken);
        const remoteSession = res?.data?.session;
        const remoteMessages = res?.data?.messages;
        if (remoteSession?.status) setChatStatus(remoteSession.status);
        if (remoteSession?.assignedAgentName !== undefined) {
          setAssignedAgentName(remoteSession.assignedAgentName || null);
        }
        if (Array.isArray(remoteMessages) && remoteMessages.length > messages.length) {
          setMessages(remoteMessages);
          playSupportChime(soundEnabled);
        }
      } catch {}
    }, 10000);
    return () => window.clearInterval(interval);
  }, [isOpen, sessionToken, hasPlacedOrder, isTyping, messages.length, soundEnabled]);

  // Client Concierge Friction Rescue Listener
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleAiCopilotAssist = async event => {
      const detail = event?.detail || {};
      if (detail.email) setCopilotEmailInput(detail.email);
      else if (user?.email) setCopilotEmailInput(user.email);

      const initialRescue = {
        frictionType: detail.frictionType || 'general',
        headline: detail.headline || 'Bhumivera Client Concierge Assistance',
        explanation:
          detail.explanation ||
          detail.errorMessage ||
          'Here is step-by-step guidance to complete your action smoothly.',
        steps: Array.isArray(detail.steps) && detail.steps.length ? detail.steps : [],
        productId: detail.productId || null,
        productName: detail.productName || '',
        requestedQuantity: detail.requestedQuantity || 1,
        maxAddable: detail.maxAddable ?? null,
        email: detail.email || user?.email || '',
        passwordDiagnostics: detail.candidatePassword
          ? analyzePasswordForAiGuide(detail.candidatePassword, detail.email || user?.email || '')
          : null,
        alternatives: [],
      };

      setCopilotRescue(initialRescue);
      if (detail.autoOpen !== false) {
        setIsOpen(true);
        setUnreadCount(0);
        setProactiveBubble(null);
      }
    };

    window.addEventListener(AI_COPILOT_EVENT, handleAiCopilotAssist);
    return () => window.removeEventListener(AI_COPILOT_EVENT, handleAiCopilotAssist);
  }, [user?.email]);

  // Subtle Linger Nudge on High-Intent Pages
  useEffect(() => {
    const path = location.pathname;
    const isHighIntentPage =
      path.startsWith('/checkout') ||
      path.startsWith('/order-tracking') ||
      path.startsWith('/returns') ||
      Boolean(isCartOpen);

    if (!isHighIntentPage || isOpen) return undefined;
    const alreadyTriggeredForPath = sessionStorage.getItem(`${PROACTIVE_TRIGGERED_KEY}:${path}`);
    if (alreadyTriggeredForPath) return undefined;

    const timer = window.setTimeout(async () => {
      sessionStorage.setItem(`${PROACTIVE_TRIGGERED_KEY}:${path}`, '1');
      let nudge = path.startsWith('/checkout') || isCartOpen
        ? 'Need a hand with checkout? Free standard shipping on orders ₹500+.'
        : 'Looking for live tracking or order assistance? Our Client Concierge is here.';
      try {
        if (typeof aiSupportApi.updateContext === 'function') {
          const ctxRes = await aiSupportApi.updateContext({
            sessionToken,
            pageContext: { ...currentPageContext, proactiveTrigger: 'checkout_linger' },
          });
          if (ctxRes?.data?.proactiveMessage) {
            nudge = ctxRes.data.proactiveMessage;
          }
          if (Array.isArray(ctxRes?.data?.quickActions) && ctxRes.data.quickActions.length > 0) {
            setQuickActions(ctxRes.data.quickActions);
          }
        }
      } catch {}
      setProactiveBubble({ text: nudge });
      setUnreadCount(prev => Math.max(1, prev));
    }, lingerThresholdMs);

    return () => window.clearTimeout(timer);
  }, [location.pathname, isCartOpen, isOpen, lingerThresholdMs, sessionToken, currentPageContext]);

  const handleFileChange = event => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    files.slice(0, 3 - attachments.length).forEach(file => {
      if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments(prev => [
          ...prev.slice(0, 2),
          {
            name: file.name,
            type: file.type,
            size: file.size,
            previewUrl: typeof reader.result === 'string' ? reader.result : '',
            url: `returns/${user?.id || 'guest'}/${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  };

  // Opens the Legitimate Customer Verification & Callback/Email Escalation Wizard
  const openVerificationFlow = useCallback((prefillOrderId = '') => {
    setIngredientDrawerOpen(false);
    setRitualDrawerOpen(false);
    setDiagnosticDrawerOpen(false);
    setEscalationWizard({
      open: true,
      step: 1,
      detailedSubStep: 1,
      orderId: prefillOrderId ? String(prefillOrderId) : '',
      emailOrPhone: user?.email || user?.phone || '',
      verifiedOrder: null,
      issueCategory: 'order_modification_or_delivery',
      sealCondition: 'intact_verified',
      remedyPreference: 'specialist_callback_or_resolution',
      contactPreference: 'email',
      callbackPhone: user?.phone ? String(user.phone).replace(/\D/g, '').slice(-10) : '',
      callbackTimeSlot: CALLBACK_SLOTS[0],
      queryDetails: '',
      busy: false,
      error: '',
      ticketReference: '',
    });
  }, [user?.email, user?.phone]);

  // Step 1 Handler: Verify Order ID + Registered Email/Phone against backend database
  const handleVerifyOrderStep1 = async e => {
    e.preventDefault();
    if (!escalationWizard.orderId.trim() || !escalationWizard.emailOrPhone.trim()) {
      setEscalationWizard(prev => ({
        ...prev,
        error: 'Please enter both your Order ID (e.g., BHVM...) and your registered Email or 10-digit Phone Number.',
      }));
      return;
    }

    setEscalationWizard(prev => ({ ...prev, busy: true, error: '' }));
    try {
      const res = await api.post(
        '/support/chat/verify-escalation',
        {
          sessionToken,
          step: 'verify_order',
          orderId: escalationWizard.orderId.trim(),
          emailOrPhone: escalationWizard.emailOrPhone.trim(),
        },
        { notify: false }
      );
      const verifiedOrder = res.data?.order;
      setHasPlacedOrder(true);
      setQuickActions(VERIFIED_BUYER_CHIPS);
      setEscalationWizard(prev => ({
        ...prev,
        busy: false,
        step: 2,
        detailedSubStep: 2,
        verifiedOrder,
        callbackPhone: verifiedOrder?.verifiedPhone || prev.callbackPhone,
        error: '',
      }));
      setMessages(prev => [
        ...prev,
        {
          id: `ver-step2-${Date.now()}`,
          sender: 'assistant',
          senderName: 'Bhumivera Client Concierge',
          content:
            res.data?.conciergePrompt ||
            'Our specialist team will reach out to you within 12 hours. Would you prefer to receive our update via Email or a Direct Phone Call?',
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setEscalationWizard(prev => ({
        ...prev,
        busy: false,
        error:
          err.response?.data?.message ||
          'Could not verify Order ID with the provided Email/Phone. Please check your details and try again.',
      }));
    }
  };

  // Step 2 & 3 Handler: Submit Contact Preference (Email vs Phone Call + Slot) & Create Single Verified Ticket
  const handleSubmitEscalationStep2 = async e => {
    e.preventDefault();
    const {
      orderId,
      emailOrPhone,
      issueCategory,
      sealCondition,
      remedyPreference,
      contactPreference,
      callbackPhone,
      callbackTimeSlot,
      queryDetails,
    } = escalationWizard;

    const cleanPhone = String(callbackPhone || '').replace(/\D/g, '').slice(-10);
    if (contactPreference === 'phone_call' && cleanPhone.length !== 10) {
      setEscalationWizard(prev => ({
        ...prev,
        error: 'Please enter a valid 10-digit Phone Number for your callback.',
      }));
      return;
    }

    setEscalationWizard(prev => ({ ...prev, busy: true, error: '' }));
    try {
      const enrichedDetails = queryDetails.trim()
        ? `${queryDetails.trim()} [Category: ${issueCategory} | Seal: ${sealCondition} | Remedy: ${remedyPreference}]`
        : `Verified assistance request for Order #${orderId} [Category: ${issueCategory}]`;

      const res = await api.post(
        '/support/chat/verify-escalation',
        {
          sessionToken,
          step: 'submit_preference',
          orderId,
          emailOrPhone,
          contactPreference,
          callbackPhone: cleanPhone,
          callbackTimeSlot,
          queryDetails: enrichedDetails,
        },
        { notify: false }
      );
      const data = res.data || {};
      setChatStatus('escalated');
      setEscalationWizard(prev => ({
        ...prev,
        busy: false,
        step: 3,
        detailedSubStep: 7,
        ticketReference: data.ticketReference || data.ticketId || 'VERIFIED',
      }));
      setMessages(prev => [
        ...prev,
        {
          id: `esc-done-${Date.now()}`,
          sender: 'assistant',
          senderName: 'Bhumivera Client Concierge',
          content:
            data.reply ||
            'Your verified specialist request has been logged. Our team will reach out within 12 hours via your chosen preference.',
          escalation: {
            escalated: true,
            ticketId: data.ticketReference || data.ticketId,
          },
          createdAt: new Date().toISOString(),
        },
      ]);
      playSupportChime(soundEnabled);
    } catch (err) {
      setEscalationWizard(prev => ({
        ...prev,
        busy: false,
        error: err.response?.data?.message || 'Could not submit specialist escalation request.',
      }));
    }
  };

  const handleEndChat = async () => {
    if (!sessionToken) return;
    setCsatSubmitting(true);
    setCsatError('');
    try {
      const response = await aiSupportApi.endSatisfied(sessionToken, {});
      setChatStatus('resolved');
      if (response?.data?.systemMessage) {
        setMessages(prev => [...prev, response.data.systemMessage]);
      }
    } catch (error) {
      setCsatError(error?.response?.data?.message || 'Could not close the conversation.');
    } finally {
      setCsatSubmitting(false);
    }
  };

  const handleSubmitCsat = async () => {
    if (!sessionToken) return;
    setCsatSubmitting(true);
    setCsatError('');
    try {
      await aiSupportApi.submitRating(sessionToken, {
        rating: csatRating,
        feedback: csatFeedback.trim(),
      });
      setCsatSubmitted(true);
    } catch (error) {
      setCsatError(error?.response?.data?.message || 'Could not save your feedback.');
    } finally {
      setCsatSubmitting(false);
    }
  };

  const sendMessage = useCallback(async (overridePrompt = null) => {
    if (overridePrompt === '__OPEN_VERIFICATION_FLOW__') {
      openVerificationFlow('');
      return;
    }
    if (overridePrompt === '__OPEN_INGREDIENT_ENCYCLOPEDIA__') {
      setEscalationWizard(prev => ({ ...prev, open: false }));
      setRitualDrawerOpen(false);
      setDiagnosticDrawerOpen(false);
      setIngredientDrawerOpen(true);
      return;
    }
    if (overridePrompt === '__OPEN_RITUAL_PLAYER__') {
      setEscalationWizard(prev => ({ ...prev, open: false }));
      setIngredientDrawerOpen(false);
      setDiagnosticDrawerOpen(false);
      setRitualDrawerOpen(true);
      return;
    }
    if (overridePrompt === '__OPEN_SKIN_DIAGNOSTIC__') {
      setEscalationWizard(prev => ({ ...prev, open: false }));
      setIngredientDrawerOpen(false);
      setRitualDrawerOpen(false);
      setDiagnosticDrawerOpen(true);
      return;
    }

    const text = String(overridePrompt !== null ? overridePrompt : input).trim();
    if ((!text && attachments.length === 0) || isTyping) return;

    // Intercept direct cancellation or human escalation phrases to open the Verification Wizard if not yet verified
    if (
      /\b(cancel\s*(?:my\s*|this\s*|the\s*)?order|connect\s*me\s*to\s*an?\s*associate|speak\s*to\s*(?:a\s*)?(?:human|agent|specialist)|human\s*agent)\b/i.test(text) &&
      !escalationWizard.verifiedOrder
    ) {
      const matchOrd = text.match(/(?:BHVM[-_\s]*)?(\d{6,12})\b/i);
      openVerificationFlow(matchOrd?.[1] || '');
    }

    const currentAttachments = [...attachments];
    if (overridePrompt === null) setInput('');
    setAttachments([]);
    setProactiveBubble(null);
    if (['resolved', 'closed'].includes(chatStatus)) {
      setChatStatus('active');
    }

    const userMsgId = `user-${Date.now()}`;
    const assistantStreamId = `assistant-${Date.now() + 1}`;
    const optimisticUserMsg = {
      id: userMsgId,
      sender: 'user',
      senderName: user?.name || 'You',
      content: text || '[Attached Photo]',
      attachments: currentAttachments,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimisticUserMsg]);
    setIsTyping(true);
    setStatusLabel('Consulting Bhumivera Client Concierge…');

    try {
      const response = await aiSupportApi.sendMessage({
        sessionToken,
        message: text,
        attachments: currentAttachments.map(a => ({ name: a.name, url: a.url, type: a.type })),
        pageContext: { ...currentPageContext, conciergeFlow },
      });

      const data = response?.data || {};
      if (data.sessionToken) setSessionToken(data.sessionToken);
      if (data.status) setChatStatus(data.status);
      if (data.conciergeFlow) setConciergeFlow(data.conciergeFlow);
      if (Array.isArray(data.orderCards) && data.orderCards.length > 0) {
        setHasPlacedOrder(true);
      }
      if (Array.isArray(data.quickActions) && data.quickActions.length > 0) {
        setQuickActions(data.quickActions);
      }

      if (data.escalation?.verificationStep === 'STEP_1_VERIFY_ORDER') {
        openVerificationFlow('');
      }

      setMessages(prev => [
        ...prev,
        {
          id: data.message?.id || assistantStreamId,
          sender: 'assistant',
          senderName: 'Bhumivera Client Concierge',
          content: data.reply || data.message?.content || 'How else may I assist you today?',
          orderCards: data.orderCards || [],
          quickActions: data.quickActions || [],
          conciergeFlow: data.conciergeFlow || null,
          escalation: data.escalation || null,
          createdAt: new Date().toISOString(),
        },
      ]);
      playSupportChime(soundEnabled);
    } catch {
      const localConcierge = resolveEnhancedBotanicalConcierge(text);
      if (Array.isArray(localConcierge.quickActions) && localConcierge.quickActions.length > 0) {
        setQuickActions(localConcierge.quickActions);
      }
      setMessages(prev => [
        ...prev,
        {
          id: assistantStreamId,
          sender: 'assistant',
          senderName: 'Bhumivera Client Concierge',
          content: localConcierge.reply,
          orderCards: [],
          quickActions: localConcierge.quickActions || (hasPlacedOrder ? VERIFIED_BUYER_CHIPS : PUBLIC_GENERAL_CHIPS),
          createdAt: new Date().toISOString(),
        },
      ]);
      playSupportChime(soundEnabled);
    } finally {
      setIsTyping(false);
      setStatusLabel('');
    }
  }, [
    input,
    attachments,
    isTyping,
    chatStatus,
    sessionToken,
    currentPageContext,
    conciergeFlow,
    user?.name,
    soundEnabled,
    hasPlacedOrder,
    escalationWizard.verifiedOrder,
    openVerificationFlow,
  ]);

  useEffect(() => {
    const handleExternalOpen = event => {
      const detail = event?.detail || {};
      setIsOpen(true);
      setProactiveBubble(null);
      setUnreadCount(0);
      if (detail.verifyOrderId) {
        openVerificationFlow(detail.verifyOrderId);
      } else if (detail.ingredientId) {
        setSelectedIngredientId(detail.ingredientId);
        setIngredientDrawerOpen(true);
      } else if (detail.prompt) {
        if (detail.autoSend !== false) {
          void sendMessage(detail.prompt);
        } else {
          setInput(detail.prompt);
        }
      }
    };
    window.addEventListener('bhumivera:open-support-chat', handleExternalOpen);
    return () => window.removeEventListener('bhumivera:open-support-chat', handleExternalOpen);
  }, [openVerificationFlow, sendMessage]);

  const activeStatusMeta = STATUS_META[chatStatus] || STATUS_META.active;

  return (
    <div
      data-testid="bhumivera-support-assistant"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[250] flex flex-col items-end font-sans"
    >
      {/* Subtle Luxury Assistance Nudge */}
      {!isOpen && proactiveBubble && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-3 max-w-xs rounded-2xl border p-4 shadow-2xl transition-all ${
            isDark
              ? 'bg-[#0B2419] border-[#D4AF37]/40 text-[#FDFBF7]'
              : 'bg-white border-[#0B2419]/15 text-[#0B2419]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" /> Bhumivera Client Concierge
            </div>
            <button
              type="button"
              aria-label="Dismiss assistance prompt"
              onClick={() => setProactiveBubble(null)}
              className="opacity-60 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed">{proactiveBubble.text}</p>
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setProactiveBubble(null);
              setUnreadCount(0);
            }}
            className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:underline"
          >
            Open Concierge <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Expanded Luxury Concierge Window */}
      {isOpen && (
        <section
          aria-label="Bhumivera Client Concierge"
          className={`flex flex-col overflow-hidden rounded-3xl border shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition-all duration-200 ${
            isMaximized
              ? 'w-[calc(100vw-1.5rem)] h-[calc(100vh-6rem)] md:w-[560px] md:h-[700px]'
              : 'w-[calc(100vw-1.5rem)] sm:w-[410px] h-[580px] max-h-[calc(100vh-7rem)]'
          } ${
            isDark
              ? 'bg-[#071510] border-white/15 text-stone-100'
              : 'bg-[#FDFBF7] border-[#0B2419]/15 text-[#0B2419]'
          }`}
        >
          {/* Minimal Luxury Header (No '+' New Chat Spam Button) */}
          <header className="bg-gradient-to-r from-[#0B2419] via-[#14251c] to-[#1f3528] px-5 py-3.5 text-[#FDFBF7] flex items-center justify-between gap-3 border-b border-[#D4AF37]/30 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/45 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-base font-semibold tracking-wide truncate">
                    Bhumivera Client Concierge
                  </h2>
                </div>
                <p className="text-[10px] text-[#d6dfd9] truncate">
                  {assignedAgentName
                    ? `Specialist: ${assignedAgentName}`
                    : hasPlacedOrder
                    ? 'Verified Order Concierge · Single Active Thread'
                    : '32 Botanicals, 12-Step Rituals & Order Verification'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => openVerificationFlow('')}
                title="Verify Order ID for Specialist Callback or Email Assistance"
                aria-label="Verify Order for Specialist Escalation"
                className="px-2.5 py-1 rounded-xl text-[10px] font-semibold tracking-wider uppercase border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-colors"
              >
                Verify Order
              </button>
              <button
                type="button"
                onClick={() => setSoundEnabled(prev => !prev)}
                title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
                aria-label={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-60" />}
              </button>
              <button
                type="button"
                onClick={() => setIsDark(prev => !prev)}
                title={isDark ? 'Light mode' : 'Dark mode'}
                aria-label={isDark ? 'Light mode' : 'Dark mode'}
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4 text-[#D4AF37]" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsMaximized(prev => !prev)}
                title={isMaximized ? 'Restore size' : 'Expand window'}
                aria-label={isMaximized ? 'Restore size' : 'Expand window'}
                className="hidden sm:inline-flex p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize Concierge"
                aria-label="Minimize Concierge"
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Two-Tier Status Bar + Interactive Module Switcher */}
          <div
            className={`px-4 py-2 border-b flex flex-col gap-1.5 text-[11px] shrink-0 ${
              isDark ? 'bg-[#0a1c15] border-white/10 text-stone-300' : 'bg-[#f4f1e9] border-[#0B2419]/10 text-[#1b2921]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                {hasPlacedOrder ? (
                  <span><strong>Verified Buyer Concierge:</strong> Dedicated Order Thread Active</span>
                ) : (
                  <span><strong>General Inquiry Mode:</strong> Verify an Order ID to unlock live specialist support</span>
                )}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border shrink-0 ${activeStatusMeta.badgeClass}`}>
                {activeStatusMeta.label}
              </span>
            </div>

            {/* Interactive Botanical & Ritual Module Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5">
              <button
                type="button"
                onClick={() => {
                  setIngredientDrawerOpen(prev => !prev);
                  setRitualDrawerOpen(false);
                  setDiagnosticDrawerOpen(false);
                  setEscalationWizard(prev => ({ ...prev, open: false }));
                }}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition ${
                  ingredientDrawerOpen
                    ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37]'
                    : 'border-current/20 hover:border-[#D4AF37]'
                }`}
              >
                32 Ingredients & 4 Stories
              </button>
              <button
                type="button"
                onClick={() => {
                  setRitualDrawerOpen(prev => !prev);
                  setIngredientDrawerOpen(false);
                  setDiagnosticDrawerOpen(false);
                  setEscalationWizard(prev => ({ ...prev, open: false }));
                }}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition ${
                  ritualDrawerOpen
                    ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37]'
                    : 'border-current/20 hover:border-[#D4AF37]'
                }`}
              >
                12-Step Ritual Timer
              </button>
              <button
                type="button"
                onClick={() => {
                  setDiagnosticDrawerOpen(prev => !prev);
                  setIngredientDrawerOpen(false);
                  setRitualDrawerOpen(false);
                  setEscalationWizard(prev => ({ ...prev, open: false }));
                }}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition ${
                  diagnosticDrawerOpen
                    ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37]'
                    : 'border-current/20 hover:border-[#D4AF37]'
                }`}
              >
                8-Step Skin Quiz
              </button>
            </div>
          </div>

          {/* Interactive 32-Ingredient Encyclopedia Drawer */}
          <IngredientEncyclopediaDrawer
            isOpen={ingredientDrawerOpen}
            onClose={() => setIngredientDrawerOpen(false)}
            isDark={isDark}
            selectedIngredientId={selectedIngredientId}
            onSelectIngredient={id => setSelectedIngredientId(id)}
            onAskConciergeAbout={promptText => {
              setIngredientDrawerOpen(false);
              void sendMessage(promptText);
            }}
          />

          {/* Interactive 12-Step Skincare Ritual Timer Drawer */}
          <MasterRitualPlayerDrawer
            isOpen={ritualDrawerOpen}
            onClose={() => setRitualDrawerOpen(false)}
            isDark={isDark}
            onSendSummaryToChat={promptText => void sendMessage(promptText)}
          />

          {/* Interactive 8-Step Skin Diagnostic Quiz Drawer */}
          <SkinDiagnosticQuizDrawer
            isOpen={diagnosticDrawerOpen}
            onClose={() => setDiagnosticDrawerOpen(false)}
            isDark={isDark}
            onCompleteBlueprint={bp => {
              setMessages(prev => [
                ...prev,
                {
                  id: `bp-${Date.now()}`,
                  sender: 'assistant',
                  senderName: 'Bhumivera Client Concierge',
                  content: [
                    `**Your Personalized 8-Step Botanical Skin Blueprint**`,
                    `**Anchor Formulation:** ${bp.recommendedProduct.name} (${bp.recommendedProduct.subtitle})`,
                    `**Top 5 Synergistic Bio-Actives for Your Profile:**\n${bp.topIngredients
                      .map((ing, i) => `${i + 1}. **${ing.name}** (*${ing.storyNumber}*) — ${ing.primaryClinicalBenefit}`)
                      .join('\n')}`,
                    `**Daily Chronobiological Schedule:**\n- ${bp.amSummary}\n- ${bp.pmSummary}`,
                  ].join('\n\n'),
                  createdAt: new Date().toISOString(),
                },
              ]);
            }}
          />

          {/* Multi-Step Legitimate Customer Verification & Specialist Callback/Email Drawer */}
          {escalationWizard.open && (
            <div
              className={`px-4 py-3.5 border-b space-y-3 text-xs shrink-0 max-h-80 overflow-y-auto ${
                isDark ? 'bg-[#0d2219] border-[#D4AF37]/40 text-stone-100' : 'bg-[#fbf9f2] border-[#D4AF37]/50 text-[#0B2419]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D4AF37]">
                  {escalationWizard.step === 1
                    ? 'Step 1 of 2 · Customer Order Verification (7-Point Protocol)'
                    : escalationWizard.step === 2
                    ? 'Step 2 of 2 · Specialist Contact Preference (12-Hr SLA)'
                    : 'Verified Specialist Request Logged'}
                </span>
                <button
                  type="button"
                  onClick={() => setEscalationWizard(prev => ({ ...prev, open: false }))}
                  className="text-xs opacity-70 hover:opacity-100"
                >
                  ✕
                </button>
              </div>

              {escalationWizard.error && (
                <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 px-3 py-2 text-[11px] text-rose-500 dark:text-rose-300">
                  {escalationWizard.error}
                </div>
              )}

              {escalationWizard.step === 1 && (
                <form onSubmit={handleVerifyOrderStep1} className="space-y-2.5">
                  <p className="text-[11px] opacity-85 leading-relaxed">
                    To protect your account and prevent automated spam, please validate your <strong>Order ID</strong> and <strong>Registered Email or 10-Digit Phone Number</strong>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={escalationWizard.orderId}
                      onChange={e => setEscalationWizard(prev => ({ ...prev, orderId: e.target.value }))}
                      placeholder="Order ID (e.g. BHVM815899599)"
                      className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                        isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-white border-stone-300 text-[#0B2419]'
                      }`}
                    />
                    <input
                      type="text"
                      required
                      value={escalationWizard.emailOrPhone}
                      onChange={e => setEscalationWizard(prev => ({ ...prev, emailOrPhone: e.target.value }))}
                      placeholder="Registered Email or 10-Digit Phone"
                      className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                        isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-white border-stone-300 text-[#0B2419]'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={escalationWizard.busy}
                    className="w-full py-2 rounded-xl bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/40 font-semibold text-xs hover:bg-[#163829] disabled:opacity-50"
                  >
                    {escalationWizard.busy ? 'Verifying Order Record…' : 'Verify Order & Continue'}
                  </button>
                </form>
              )}

              {escalationWizard.step === 2 && (
                <form onSubmit={handleSubmitEscalationStep2} className="space-y-2.5">
                  <p className="text-[11px] leading-relaxed">
                    Verified <strong>Order #{escalationWizard.verifiedOrder?.orderNumber}</strong>. Our specialist team will reach out to you within 12 hours. Would you prefer to receive our update via <strong>Email</strong> or a <strong>Direct Phone Call</strong>?
                  </p>

                  {/* Granular Inspection & Remedy Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={escalationWizard.issueCategory}
                      onChange={e => setEscalationWizard(prev => ({ ...prev, issueCategory: e.target.value }))}
                      aria-label="Issue Category"
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] outline-none ${
                        isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-white border-stone-300 text-[#0B2419]'
                      }`}
                    >
                      <option value="order_modification_or_delivery">Order / Address / Delivery Assist</option>
                      <option value="damaged_or_leaked_unit">Damaged / Leaked Bottle Inspection</option>
                      <option value="return_or_replacement_rma">Return or Replacement RMA</option>
                      <option value="botanical_formulation_consult">Botanical Regimen Consultation</option>
                    </select>
                    <select
                      value={escalationWizard.remedyPreference}
                      onChange={e => setEscalationWizard(prev => ({ ...prev, remedyPreference: e.target.value }))}
                      aria-label="Preferred Remedy"
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] outline-none ${
                        isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-white border-stone-300 text-[#0B2419]'
                      }`}
                    >
                      <option value="specialist_callback_or_resolution">Specialist Outreach & Resolution</option>
                      <option value="priority_free_replacement">Priority Free Replacement</option>
                      <option value="wallet_credit_with_bonus">Instant Wallet Credit</option>
                      <option value="original_payment_refund">Original Source Refund</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEscalationWizard(prev => ({ ...prev, contactPreference: 'email' }))}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                        escalationWizard.contactPreference === 'email'
                          ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37]'
                          : 'border-current/20 opacity-80'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" /> Email Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setEscalationWizard(prev => ({ ...prev, contactPreference: 'phone_call' }))}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                        escalationWizard.contactPreference === 'phone_call'
                          ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37]'
                          : 'border-current/20 opacity-80'
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Direct Phone Call
                    </button>
                  </div>

                  {escalationWizard.contactPreference === 'phone_call' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={escalationWizard.callbackPhone}
                        onChange={e =>
                          setEscalationWizard(prev => ({
                            ...prev,
                            callbackPhone: e.target.value.replace(/\D/g, '').slice(0, 10),
                          }))
                        }
                        placeholder="10-Digit Phone Number"
                        className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-white border-stone-300 text-[#0B2419]'
                        }`}
                      />
                      <select
                        value={escalationWizard.callbackTimeSlot}
                        onChange={e => setEscalationWizard(prev => ({ ...prev, callbackTimeSlot: e.target.value }))}
                        className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-white border-stone-300 text-[#0B2419]'
                        }`}
                      >
                        {CALLBACK_SLOTS.map(slot => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <textarea
                    rows={2}
                    required
                    value={escalationWizard.queryDetails}
                    onChange={e => setEscalationWizard(prev => ({ ...prev, queryDetails: e.target.value }))}
                    placeholder="Briefly describe how our specialist team may assist with this order…"
                    className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                      isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-white border-stone-300 text-[#0B2419]'
                    }`}
                  />

                  <button
                    type="submit"
                    disabled={escalationWizard.busy}
                    className="w-full py-2 rounded-xl bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/40 font-semibold text-xs hover:bg-[#163829] disabled:opacity-50"
                  >
                    {escalationWizard.busy ? 'Logging Verified Request…' : 'Confirm & Schedule Specialist Outreach'}
                  </button>
                </form>
              )}

              {escalationWizard.step === 3 && (
                <div className="space-y-2 py-1">
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Escalation Ticket #{escalationWizard.ticketReference} Confirmed</span>
                  </div>
                  <p className="text-[11px] opacity-85">
                    Our specialist team will reach out within 12 hours via your selected preference.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Client Concierge Friction Rescue Card */}
          {copilotRescue && (
            <div
              className={`px-4 py-3 border-b max-h-56 overflow-y-auto text-xs space-y-2 shrink-0 ${
                isDark
                  ? 'bg-gradient-to-br from-[#122b22] to-[#0a1c15] border-[#D4AF37]/50 text-stone-100'
                  : 'bg-[#fffbeb] border-[#D4AF37] text-[#0B2419]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                    <Sparkles className="w-3 h-3" /> Bhumivera Client Concierge
                  </span>
                  <h3 className="font-bold text-xs mt-0.5">{copilotRescue.headline}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCopilotRescue(null)}
                  className="text-[11px] opacity-70 hover:opacity-100"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">{copilotRescue.explanation}</p>
              {String(copilotRescue.frictionType || '').includes('password') ||
              String(copilotRescue.frictionType || '').includes('login') ? (
                <div className="pt-1 flex gap-1.5">
                  <input
                    type="email"
                    value={copilotEmailInput}
                    onChange={e => setCopilotEmailInput(e.target.value)}
                    placeholder="Your registered email…"
                    className="flex-1 rounded-lg border border-current/20 bg-black/10 px-2.5 py-1 text-[11px] outline-none"
                  />
                  <button
                    type="button"
                    disabled={copilotSendingReset || !copilotEmailInput.trim()}
                    onClick={async () => {
                      setCopilotSendingReset(true);
                      try {
                        const res = await aiSupportApi.passwordRescue?.({
                          email: copilotEmailInput.trim(),
                          sendRecoveryLink: true,
                          stage: 'concierge_widget',
                        });
                        setCopilotRescue(prev => ({
                          ...prev,
                          explanation:
                            res?.data?.recoveryNotice ||
                            `Dispatched a 30-minute password setup link to ${copilotEmailInput.trim()}.`,
                        }));
                      } catch {
                        navigate('/forgot-password');
                      } finally {
                        setCopilotSendingReset(false);
                      }
                    }}
                    className="rounded-lg bg-[#D4AF37] px-2.5 py-1 text-[10px] font-bold uppercase text-[#0B2419] disabled:opacity-50"
                  >
                    {copilotSendingReset ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </div>
              ) : null}
              {copilotRescue.productId && (
                <button
                  type="button"
                  onClick={() => {
                    const qtyToAdd =
                      copilotRescue.maxAddable && copilotRescue.maxAddable > 0
                        ? copilotRescue.maxAddable
                        : 1;
                    window.dispatchEvent(
                      new CustomEvent(AI_COPILOT_ADD_CART_RETRY_EVENT, {
                        detail: {
                          productId: copilotRescue.productId,
                          productName: copilotRescue.productName,
                          quantity: qtyToAdd,
                        },
                      })
                    );
                    setCopilotRescue(null);
                  }}
                  className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase text-[#071510]"
                >
                  Add Available Quantity to Cart
                </button>
              )}
            </div>
          )}

          {/* Messages Stream */}
          <div
            className={`flex-1 overflow-y-auto px-5 py-4 space-y-4 ${
              isDark ? 'bg-[#071510]' : 'bg-[#FDFBF7]'
            }`}
          >
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              const isSystem = msg.sender === 'system';
              const isHumanStaff = ['agent', 'supervisor', 'manager', 'superadmin'].includes(msg.sender);

              if (isSystem) {
                return (
                  <div key={msg.id || idx} className="flex justify-center">
                    <div className="max-w-[92%] rounded-xl px-3.5 py-2 text-[11px] text-center bg-[#D4AF37]/15 border border-[#D4AF37]/30">
                      <FormattedMarkdown content={msg.content} isDark={isDark} onNavigate={href => navigate(href)} />
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id || idx}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {!isUser && (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#D4AF37] mb-1 pl-1">
                      {isHumanStaff ? msg.senderName || 'Bhumivera Specialist' : 'Bhumivera Client Concierge'}
                    </span>
                  )}
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                      isUser
                        ? 'bg-[#0B2419] text-[#FDFBF7] rounded-br-sm shadow-sm'
                        : isHumanStaff
                        ? 'bg-emerald-950 text-emerald-50 border border-emerald-400/40 rounded-bl-sm shadow-md'
                        : isDark
                        ? 'bg-[#10241f] text-stone-100 border border-white/10 rounded-bl-sm'
                        : 'bg-white text-[#0B2419] border border-[#0B2419]/10 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <FormattedMarkdown
                      content={msg.content}
                      isDark={isUser || isHumanStaff || isDark}
                      onNavigate={href => navigate(href)}
                    />

                    {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.attachments.map((att, aIdx) => (
                          <div
                            key={aIdx}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/20 text-[11px]"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span className="truncate max-w-[140px]">{att.name || 'Photo'}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {Array.isArray(msg.orderCards) &&
                      msg.orderCards.map(order => (
                        <ChatOrderCard
                          key={order.id || order.orderNumber}
                          order={order}
                          isDark={isDark}
                          onQuickPrompt={promptText => void sendMessage(promptText)}
                          onRequestOrderIntervention={ordRef => openVerificationFlow(ordRef)}
                        />
                      ))}

                    {msg.escalation?.escalated && (
                      <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-2 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>
                          Verified Specialist Ticket{msg.escalation.ticketId ? ` #${msg.escalation.ticketId}` : ''} logged (12-hour response guarantee).
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {['resolved', 'closed'].includes(chatStatus) && (
              <div
                className={`rounded-2xl border p-3.5 space-y-2 ${
                  isDark ? 'bg-[#10241f] border-[#D4AF37]/30' : 'bg-white border-[#0B2419]/15 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold">
                    {csatSubmitted ? 'Thank you for your feedback.' : 'How was your support experience?'}
                  </span>
                  <a
                    href={telegramBotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-semibold text-[#D4AF37] underline"
                  >
                    Telegram Concierge
                  </a>
                </div>
                {!csatSubmitted && (
                  <>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCsatRating(star)}
                          disabled={csatSubmitting}
                          aria-label={`Rate ${star} stars`}
                          className="p-0.5 hover:scale-110 transition-transform disabled:opacity-60"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= csatRating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={csatFeedback}
                        onChange={e => setCsatFeedback(e.target.value)}
                        placeholder="Share a note on your experience…"
                        className={`flex-1 px-2.5 py-1.5 rounded-lg border text-[11px] ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-stone-50 border-stone-200 text-[#0B2419]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => void handleSubmitCsat()}
                        disabled={csatSubmitting}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0B2419] text-[#D4AF37] text-[10px] font-bold shrink-0 disabled:opacity-60"
                      >
                        {csatSubmitting ? 'Saving…' : 'Send'}
                      </button>
                    </div>
                  </>
                )}
                {csatError && <p role="alert" className="text-[11px] text-red-600">{csatError}</p>}
              </div>
            )}

            {!['resolved', 'closed'].includes(chatStatus) && hasPlacedOrder && messages.length > 2 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => void handleEndChat()}
                  disabled={csatSubmitting || isTyping}
                  aria-label="End chat"
                  className="rounded-lg border border-[#0B2419]/15 px-3 py-1.5 text-[11px] font-semibold text-[#0B2419] hover:bg-[#0B2419]/5 disabled:opacity-60 dark:text-stone-100 dark:border-white/15"
                >
                  {csatSubmitting ? 'Closing…' : 'End chat'}
                </button>
              </div>
            )}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs opacity-75 pl-1">
                <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-[#0B2419]/10 dark:bg-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:300ms]" />
                </div>
                {statusLabel && <span className="text-[11px] italic">{statusLabel}</span>}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Dynamic AI Next Auto-Suggestions (Product -> Ingredient -> 2+1 Related + Usage Guide) */}
          {Array.isArray(quickActions) && quickActions.length > 0 && (
            <div
              className={`px-4 py-2.5 border-t space-y-1.5 shrink-0 ${
                isDark ? 'bg-[#0a1c15] border-white/10' : 'bg-[#f4f1e9] border-[#0B2419]/10'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.14em] text-[#D4AF37]">
                <span>
                  {quickActions.some(c => c.category === 'post_wash_routine' || c.category === 'product_pairing' || c.category === 'ingredient_synergy')
                    ? 'AI Concierge · Skincare Ritual & Next Steps'
                    : quickActions.some(c => c.category === 'ingredient_deep_dive' || c.category === 'closely_related_ingredient')
                    ? 'AI Concierge · Botanical Ingredient Deep Dives'
                    : 'AI Concierge · Recommended Actions'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto">
                {quickActions.map(chip => {
                  const isRelated = chip.category === 'closely_related_ingredient' || chip.category === 'product_pairing';
                  const isUsage = chip.category === 'usage_and_timing' || chip.category === 'post_wash_routine';
                  const isSynergy = chip.category === 'ingredient_synergy' || chip.category === 'skin_compatibility';
                  return (
                    <button
                      key={chip.id || chip.label}
                      type="button"
                      disabled={isTyping}
                      onClick={() => void sendMessage(chip.prompt || chip.label)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                        isRelated
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37]/60 text-[#0B2419] dark:text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B2419]'
                          : isUsage
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-600 hover:text-white'
                          : isSynergy
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-900 dark:text-amber-200 hover:bg-amber-600 hover:text-white'
                          : isDark
                          ? 'bg-[#10241f] border-[#D4AF37]/30 text-stone-200 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                          : 'bg-white border-[#0B2419]/15 text-[#0B2419] hover:border-[#0B2419] hover:bg-[#0B2419] hover:text-white'
                      } disabled:opacity-50`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pending Image Attachments Bar */}
          {attachments.length > 0 && (
            <div className="px-4 py-1.5 border-t border-current/10 flex items-center gap-2 overflow-x-auto shrink-0">
              {attachments.map((att, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 text-[11px] font-medium"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="truncate max-w-[110px]">{att.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                    aria-label={`Remove ${att.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Composer Input Bar */}
          <form
            onSubmit={e => {
              e.preventDefault();
              void sendMessage();
            }}
            className={`p-3.5 border-t flex items-center gap-2 shrink-0 ${
              isDark ? 'bg-[#071510] border-white/10' : 'bg-white border-[#0B2419]/10'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
              aria-label="Attach product or order photo"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach photo for return inspection"
              aria-label="Attach photo"
              className={`p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'border-white/15 text-stone-300 hover:bg-white/10'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={
                hasPlacedOrder
                  ? 'Ask about your order, returns, or botanical rituals…'
                  : 'Ask about ingredients, shipping, or verify an Order ID…'
              }
              maxLength={2000}
              aria-label="Message Bhumivera Client Concierge"
              className={`flex-1 min-w-0 px-3.5 py-2 rounded-xl border text-xs outline-none transition-colors ${
                isDark
                  ? 'bg-[#10241f] border-white/15 text-stone-100 placeholder:text-stone-400 focus:border-[#D4AF37]'
                  : 'bg-[#FDFBF7] border-stone-200 text-[#0B2419] placeholder:text-stone-400 focus:border-[#0B2419]'
              }`}
            />
            <button
              type="submit"
              disabled={isTyping || (!input.trim() && attachments.length === 0)}
              aria-label="Send message"
              className="p-2.5 rounded-xl bg-[#0B2419] text-[#D4AF37] hover:bg-[#1e4031] disabled:opacity-40 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}

      {/* Floating Concierge Launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setUnreadCount(0);
            setProactiveBubble(null);
          }}
          aria-label="Open Bhumivera Support"
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#0B2419] to-[#1e4031] px-4 py-3.5 text-[#FDFBF7] shadow-[0_14px_34px_rgba(11,36,25,0.45)] border border-[#D4AF37]/45 hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold tracking-wide pr-0.5">Client Concierge</span>
        </button>
      )}
    </div>
  );
}

export default function SupportAssistant(props) {
  return (
    <SupportWidgetErrorBoundary>
      <SupportAssistantInner {...props} />
    </SupportWidgetErrorBoundary>
  );
}
