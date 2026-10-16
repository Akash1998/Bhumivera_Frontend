import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  ArrowLeftRight,
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
const SUPPORT_ENTRY_CHOICES = [
  {
    id: 'order',
    label: 'Order-related issue',
    description: 'Delivery, payment, return, or an existing order',
    prompt: 'I need help with an order.',
  },
  {
    id: 'general',
    label: 'General question',
    description: 'Products, ingredients, or store policies',
    prompt: 'I have a general question about Bhumivera products, ingredients, or policies.',
  },
];

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
      'Meet the botanicals that inspire us—and the authentic formulations shaping everyday skin wellness.',
    accentHex: '#E07A24',
    badgeLabel: 'Himalayan Omega-7 Super-Berry',
    terroir: 'High-Altitude Cold Desert Valleys of Ladakh & Lahaul-Spiti (3,200m–4,100m)',
    harvestWindow: 'Late September to First Himalayan Frost (Hand-Picked at Peak Carotenoid Density)',
    extractionCraft: 'Sub-Critical CO2 Dual Pulp & Seed Extraction + Cold Cellular Press',
    concentrationStandard: 'Standardized Bio-Active Complex in Sea Buckthorn Face Wash',
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
          'Growing above 3,500 meters where UV radiation is intense and temperatures plunge below -25°C, Sea Buckthorn berries synthesize rare Omega-7 and rich antioxidants to protect their own cellular membranes.',
        detailedNarrative:
          'Unlike lowland botanicals, Himalayan Hippophae rhamnoides endures extreme diurnal temperature swings and intense solar radiation. In response, the berry concentrates rare Palmitoleic Acid (Omega-7), Vitamin C, tocotrienols, and bioactive flavonoids.',
      },
      {
        step: 2,
        chapterTitle: 'Step 2 · Dual-Phase Seed & Pulp Synergy',
        summary:
          'Bhumivera extracts both the ruby-orange pericarp pulp and the nutrient-dense dark seed kernel using solvent-free supercritical CO2 extraction.',
        detailedNarrative:
          'The berry pulp delivers rare Omega-7 (Palmitoleic Acid)—a lipid naturally present in youthful human sebum—while the seed oil provides an ideal ratio of Linoleic (Omega-6) and Alpha-Linolenic (Omega-3) fatty acids to rebuild compromised stratum corneum bilayers.',
      },
      {
        step: 3,
        chapterTitle: 'Step 3 · Stratum Corneum Lipid Integration',
        summary:
          'During the 40-second cleansing massage, micro-emulsified Sea Buckthorn micelles selectively lift oxidized sebum while depositing pro-barrier carotenoids.',
        detailedNarrative:
          'Conventional foaming cleansers strip intercellular lipids, triggering rebound oiliness. Sea Buckthorn forms a biomimetic cushion during cleansing so gentle surfactants remove only debris and particulate matter while leaving the acid mantle intact at pH 5.2–5.5.',
      },
      {
        step: 4,
        chapterTitle: 'Step 4 · Synergy with Niacinamide & Aloe Vera',
        summary:
          'Paired with 1% Niacinamide and 5% Pure Aloe Vera, Sea Buckthorn accelerates epidermal hydration and preserves post-cleansing comfort.',
        detailedNarrative:
          'While Omega-7 supplies essential fatty acids, Niacinamide supports epidermal ceramide synthesis, creating a dual-action barrier defense loop.',
      },
    ],
    quickPrompts: [
      'Tell me about Sea Buckthorn Face Wash and its key ingredients',
      'How do I really use Sea Buckthorn Face Wash step-by-step and what time of day should I use it?',
      'How does Sea Buckthorn work with Niacinamide and Aloe Vera?',
      'How do I pair Sea Buckthorn Face Wash with Kumkumadi Night Elixir?',
    ],
  },
  {
    storyCode: 'INGREDIENT STORY · 02',
    storyIndex: 2,
    ingredientId: 'activated_charcoal',
    title: 'Charcoal',
    displayName: 'Activated Bamboo Charcoal',
    latinName: 'Carbon (Steam-Activated Phyllostachys edulis)',
    tagline: 'A grounded, elemental presence in the ritual.',
    heroSectionHeading: 'Nature has more than one note.',
    heroSectionSubheading:
      'Meet the botanicals that inspire us—and the authentic formulations shaping everyday skin wellness.',
    accentHex: '#3A4440',
    badgeLabel: 'Micro-Porous Adsorption Matrix',
    terroir: 'Sustainably Harvested 5-Year Highland Bamboo Groves',
    harvestWindow: 'Late Autumn Dormant Culm Harvest (Maximum Lignin Density)',
    extractionCraft: '900°C Pyrolysis Kiln Carbonization + High-Pressure Steam Micronization',
    concentrationStandard: '3.00% Ultra-Fine Micro-Mesh (Non-Abrasive Grade)',
    ayurvedicProfile: 'Kapha & Pitta Clarifier (Draws out Ama, excess sebum, and urban toxins)',
    sensoryArchitecture: {
      visualNote: 'Velvety obsidian-slate suspension that transforms into a silky pearl-grey lather',
      aromaticNote: 'Clean rain-washed slate, subtle earthy undertone, and crisp herbal freshness',
      tactileNote: 'Zero-grit satin glide that acts like a microscopic magnet without physical scratching',
    },
    chapters: [
      {
        step: 1,
        chapterTitle: 'Step 1 · High-Temperature Pyrolysis & Steam Activation',
        summary:
          'Mature bamboo culms are carbonized at 900°C and activated with superheated steam to carve a vast internal labyrinth of micropores.',
        detailedNarrative:
          'Steam-activated bamboo charcoal possesses an expansive internal surface area. This honeycomb architecture creates adsorption forces capable of trapping lipophilic pollutants, excess sebum, and particulate matter.',
      },
      {
        step: 2,
        chapterTitle: 'Step 2 · Selective PM2.5 & Sebum Adsorption',
        summary:
          'Charcoal targets urban smog particulates, environmental pollutants, and oxidized squalene inside follicular openings.',
        detailedNarrative:
          'Urban smog particulates are smaller than human pores and cause oxidative dullness. Activated Bamboo Charcoal binds these hydrophobic impurities on contact so they rinse away effortlessly with lukewarm water.',
      },
      {
        step: 3,
        chapterTitle: 'Step 3 · Cushioning with Botanical Glycerin & Aloe',
        summary:
          'We suspend our micronized charcoal in a base of Botanical Glycerin and soothing actives so pores are decongested without dryness or tightness.',
        detailedNarrative:
          'Raw charcoal or clay cleansers can strip moisture. By cushioning charcoal in 5% Botanical Glycerin and hyaluronic hydration, Bhumivera delivers deep follicular purification while maintaining skin suppleness.',
      },
      {
        step: 4,
        chapterTitle: 'Step 4 · Clarifying Synergy with Neem & Haridra',
        summary:
          'Paired with Sacred Neem and Standardized Turmeric (Haridra), Charcoal clears surface congestion while Ayurvedic botanicals soothe and brighten.',
        detailedNarrative:
          'Charcoal acts as the surface magnet while Neem curbs blemish-causing microbes and Turmeric provides antioxidant clarity against post-blemish marks.',
      },
    ],
    quickPrompts: [
      'Tell me about Charcoal Face Wash and how it purifies pores without drying skin',
      'Can I use Charcoal Face Wash in the PM and Sea Buckthorn in the AM?',
      'What is the step-by-step evening detox ritual with Charcoal Face Wash?',
      'How does Charcoal Face Wash pair with Kumkumadi Night Elixir?',
    ],
  },
  {
    storyCode: 'INGREDIENT STORY · 03',
    storyIndex: 3,
    ingredientId: 'kumkumadi',
    title: 'Kumkumadi Night Elixir',
    displayName: 'Classical Kumkumadi Tailam & Kashmiri Saffron',
    latinName: 'Crocus sativus L. & 26 Ayurvedic Botanical Decoctions',
    tagline: 'Overnight golden luminosity steeped in classical Ayurvedic wisdom.',
    heroSectionHeading: 'The Golden Standard of Skin Radiance.',
    heroSectionSubheading:
      'Handcrafted using authentic Kashmiri Mogra Saffron, Rakta Chandana, and 26 classical Ayurvedic herbs.',
    accentHex: '#D4AF37',
    badgeLabel: 'Classical 26-Herb Radiance Elixir',
    terroir: 'High-Altitude Pampore Saffron Plateaus (Kashmir) & Sacred Ayurvedic Herb Groves',
    harvestWindow: 'Autumn Pre-Dawn Saffron Stigma Plucking (Highest Crocin & Safranal Density)',
    extractionCraft: 'Classical Taila Paka Vidhi (16-Hour Copper-Vessel Phyto-Infusion)',
    concentrationStandard: 'Pure Ayurvedic Tailam Infused with Grade-1 Kashmiri Mogra Saffron',
    ayurvedicProfile: 'Tridoshic Rasayana (Deeply pacifies Vata dryness, Pitta heat & restores Ojas)',
    sensoryArchitecture: {
      visualNote: 'Radiant deep crimson-gold oil shimmering with suspended saffron stigma warmth',
      aromaticNote: 'Sacred saffron threads, honeyed sandalwood warmth, and earthy floral serenity',
      tactileNote: 'Rich yet fast-absorbing botanical nectar that melts into damp skin overnight',
    },
    chapters: [
      {
        step: 1,
        chapterTitle: 'Step 1 · Kashmiri Mogra Saffron (Grade-1 Kesar) Selection',
        summary:
          'Harvested at sunrise in the high plains of Pampore, Kashmir, each red stigma is hand-sorted for maximum crocin content.',
        detailedNarrative:
          'Kashmiri Saffron (Crocus sativus) is globally renowned as the highest potency saffron. Its active crocin, crocetin, and safranal molecules accelerate cellular turnover, visibly fade dark spots, and impart an incomparable natural golden warmth to the complexion.',
      },
      {
        step: 2,
        chapterTitle: 'Step 2 · 16-Hour Classical Taila Paka Decoction',
        summary:
          'Herbs including Haridra, Manjistha, Chandana, and Padma are simmered in a herbal decoction (Kwatha) and pure base oil until moisture evaporates completely.',
        detailedNarrative:
          'This classical Ayurvedic method transfers both water-soluble and lipid-soluble botanical bio-actives into the oil matrix, creating a shelf-stable lipid veil that penetrates the deepest layers of the stratum corneum.',
      },
      {
        step: 3,
        chapterTitle: 'Step 3 · Nocturnal Lipid Barrier Regeneration',
        summary:
          'Pressed onto clean, damp skin before sleep, Kumkumadi synchronizes with the skins natural 11 PM to 2 AM cellular repair window.',
        detailedNarrative:
          'During sleep, cutaneous blood flow peaks and transepidermal water loss increases. Kumkumadi locks in cellular hydration, repairs environmental UV damage, and encourages fresh, radiant cell renewal by morning.',
      },
      {
        step: 4,
        chapterTitle: 'Step 4 · Post-Cleansing Layering Protocol',
        summary:
          'Warm 2 to 3 drops between clean palms and gently press onto damp skin right after using Sea Buckthorn or Charcoal Face Wash.',
        detailedNarrative:
          'Applying Kumkumadi onto 15% damp skin traps hydrating water molecules inside the lipid barrier, enhancing absorption by up to 40% with zero greasy residue on pillows.',
      },
    ],
    quickPrompts: [
      'Tell me about Kumkumadi Night Elixir and how to apply it',
      'How do I layer Kumkumadi Night Elixir with Bhumivera Face Wash?',
      'Can I use Kumkumadi Night Elixir every night on oily or acne-prone skin?',
      'What are the key ingredients inside Bhumivera Kumkumadi Night Elixir?',
    ],
  },
  {
    storyCode: 'INGREDIENT STORY · 04',
    storyIndex: 4,
    ingredientId: 'sacred_tulsi',
    title: 'Sacred Tulsi & Aloe',
    displayName: 'Sacred Tulsi & Pure Aloe Vera Complex',
    latinName: 'Ocimum sanctum & Aloe barbadensis miller',
    tagline: 'Adaptogenic calm and cooling bio-polysaccharide hydration.',
    heroSectionHeading: 'Nature has more than one note.',
    heroSectionSubheading:
      'Meet the botanicals that inspire us—and the authentic formulations shaping everyday skin wellness.',
    accentHex: '#2E6F4E',
    badgeLabel: 'Adaptogenic Barrier & Hydration Duo',
    terroir: 'Organic Herb Groves of Uttarakhand & Mineral-Rich Red Soils of Thar Desert',
    harvestWindow: 'Pre-Dawn Harvest During Early Flowering & Mature Outer Leaf Filleting',
    extractionCraft: 'Cold-Stabilized Inner-Leaf Filleting + Aqueous Botanical Distillation',
    concentrationStandard: 'Standardized Bio-Active Base in Bhumivera Face Washes',
    ayurvedicProfile: 'Sattvic Rasayana (Balances Kapha oiliness, cools Pitta heat & calms redness)',
    sensoryArchitecture: {
      visualNote: 'Translucent emerald-dew botanical infusion with soothing plant mucilage',
      aromaticNote: 'Crisp green stem dew, cool succulent leaf freshness, and herbal peace',
      tactileNote: 'Instant soothing glide with zero post-rinse tightness or dryness',
    },
    chapters: [
      {
        step: 1,
        chapterTitle: 'Step 1 · Dual-Cultivar Sacred Tulsi Selection',
        summary:
          'Bhumivera uses authentic Sacred Tulsi (Holy Basil) rich in soothing ursolic acid, rosmarinic acid, and eugenol.',
        detailedNarrative:
          'Revered in Ayurveda as "The Incomparable One," Tulsi is celebrated in modern dermal science as a potent adaptogen that calms environmental stress, balances excess surface oil, and protects the cutaneous microbiome.',
      },
      {
        step: 2,
        chapterTitle: 'Step 2 · Cold-Stabilized Inner-Fillet Aloe Vera',
        summary:
          'Rather than using heat-degraded powder, Bhumivera incorporates cold-stabilized inner leaf fillet rich in acemannan polysaccharides.',
        detailedNarrative:
          'This preserves native polysaccharides that bind water molecules and cushion delicate facial tissue during the cleansing process, preventing transepidermal water loss.',
      },
      {
        step: 3,
        chapterTitle: 'Step 3 · Calming Trans-Epidermal Redness',
        summary:
          'Tulsi and Aloe together soothe transient redness caused by sun exposure, urban commute heat, and hard water.',
        detailedNarrative:
          'Natural plant mucilage forms a protective veil on the stratum corneum while ursolic acid calms irritation, making it ideal for sensitive and reactive complexions.',
      },
      {
        step: 4,
        chapterTitle: 'Step 4 · Humectant Synergy with Hyaluronic & Glycerin',
        summary:
          'Functions as the botanical delivery vehicle for Hyaluronic Acid and Botanical Glycerin to lock in lasting post-cleanse suppleness.',
        detailedNarrative:
          'Even in dry air-conditioned environments, this botanical matrix keeps the acid mantle balanced at pH 5.2–5.5.',
      },
    ],
    quickPrompts: [
      'Tell me about Tulsi and Aloe Vera in Bhumivera formulations',
      'How does Tulsi help with skin stress, redness, and blemish balance?',
      'Why does Bhumivera use cold-stabilized Aloe Vera instead of dried powder?',
      'Walk me through the 60-second damp-skin hydration ritual',
    ],
  },
];

export const PUBLIC_GENERAL_CHIPS = [
  {
    id: 'track_order',
    label: 'Where is my order?',
    prompt: 'Where is my order?',
    category: 'order_tracking',
  },
  {
    id: 'know_sb_fw',
    label: 'Sea Buckthorn Face Wash',
    prompt: 'Tell me about Sea Buckthorn Face Wash and its key ingredients',
    category: 'product_discovery',
  },
  {
    id: 'know_kumkumadi',
    label: 'Kumkumadi Night Elixir',
    prompt: 'Tell me about Kumkumadi Night Elixir and how to apply it',
    category: 'product_discovery',
  },
  {
    id: 'know_charcoal',
    label: 'Charcoal Face Wash',
    prompt: 'Tell me about Charcoal Face Wash and its key ingredients',
    category: 'product_discovery',
  },
  {
    id: 'layering_guide',
    label: 'Post-Wash Layering Guide',
    prompt: 'What skincare products should I apply right after using Sea Buckthorn Face Wash?',
    category: 'post_wash_routine',
  },
  {
    id: 'story_01_sb',
    label: 'Story 01 · Sea Buckthorn',
    prompt: 'Tell me the full Ingredient Story 01 for Sea Buckthorn and its cellular steps',
    category: 'ingredient_discovery',
  },
  {
    id: 'story_03_kumkumadi',
    label: 'Story 03 · Kumkumadi Elixir',
    prompt: 'Tell me about Kumkumadi Night Elixir and how to apply it',
    category: 'ingredient_discovery',
  },
  {
    id: 'ing_niacinamide',
    label: 'Active: Niacinamide (1%)',
    prompt: 'Tell me about Niacinamide in Sea Buckthorn Face Wash',
    category: 'ingredient_discovery',
  },
  {
    id: 'all_catalog_ingredients',
    label: 'Botanical Library',
    prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
    category: 'ingredient_deep_dive',
  },
  {
    id: 'usage_time',
    label: 'Daily Facial Ritual Guide',
    prompt: 'How do I really use Sea Buckthorn Face Wash step-by-step and what time of day should I use it?',
    category: 'usage_and_timing',
  },
  {
    id: 'interactive_ritual_player',
    label: 'Facial Ritual Player (4 Phases)',
    prompt: '__OPEN_RITUAL_PLAYER__',
    category: 'post_wash_routine',
  },
  {
    id: 'skin_quiz_diagnostic',
    label: 'Personalized Skin Quiz',
    prompt: '__OPEN_SKIN_DIAGNOSTIC__',
    category: 'skin_compatibility',
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
    label: 'Return or Replacement',
    prompt: 'I want to initiate a return or replacement for my delivered order.',
  },
  {
    id: 'layering_guide_v',
    label: 'Post-Wash Layering Guide',
    prompt: 'What skincare products should I apply right after using Sea Buckthorn Face Wash?',
  },
  {
    id: 'order_assistance',
    label: 'Specialist Escalation',
    prompt: '__OPEN_VERIFICATION_FLOW__',
  },
  {
    id: 'wallet_loyalty',
    label: 'Privilege Tier & Rewards',
    prompt: 'What is my current wallet balance and loyalty points?',
  },
  {
    id: 'all_catalog_ingredients_verified',
    label: 'Botanical Library',
    prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__',
    category: 'ingredient_deep_dive',
  },
  {
    id: 'ritual_timer_verified',
    label: 'Facial Ritual Guide (4 Phases)',
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
    label: 'Automated help',
    badgeClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    description: 'Automated guidance is available; this is not a live-agent chat',
  },
  pending: {
    label: 'Request noted',
    badgeClass: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    description: 'Your follow-up request is saved for later review',
  },
  waiting_for_review: {
    label: 'Awaiting review',
    badgeClass: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
    description: 'Your request is queued for review; replies may take time',
  },
  escalated: {
    label: 'Follow-up requested',
    badgeClass: 'bg-rose-500/20 text-rose-200 border-rose-400/40',
    description: 'Your verified request is recorded for later follow-up',
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
    "id": "sea_buckthorn",
    "indexNumber": 1,
    "storyNumber": "INGREDIENT STORY · 01",
    "isHeroStory": true,
    "name": "Sea Buckthorn",
    "fullTitle": "Himalayan Sea Buckthorn Berry & Seed Complex",
    "latinBinomial": "Hippophae rhamnoides L.",
    "inciName": "Hippophae Rhamnoides Fruit Oil & Seed Extract",
    "category": "Hero Botanical · Story 01",
    "noteFamily": "Golden Berry · Omega 3-6-7-9",
    "tagline": "A vivid botanical with a story all its own.",
    "shortSummary": "Wild-harvested in high-altitude Himalayan valleys (3,200m–4,100m), Sea Buckthorn is nature's richest botanical source of rare Omega-7 (Palmitoleic Acid), bioactive carotenoids, and 190+ phytonutrients that replenish the skin barrier while awakening luminosity.",
    "originRegion": "Ladakh & Lahaul-Spiti, Trans-Himalayas, India",
    "harvestSeason": "Late September to First Himalayan Frost",
    "extractionMethod": "Supercritical CO2 Dual Pulp & Seed Extraction",
    "concentrationInFormula": "Standardized Bio-Active Complex in Face Wash",
    "optimalPhRange": "4.8 – 5.6",
    "solubility": "Amphiphilic Micro-Emulsion (Lipid Core + Flavonoid Glycosides)",
    "ayurvedicDoshaAffinity": "Tridoshic — Pacifies Vata dryness and Pitta photo-heat",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 1,
    "primaryFocusZone": "Full face, cheekbone contours, and lipid-depleted barrier zones",
    "primaryClinicalBenefit": "Omega-7 barrier lipid restoration, antioxidant brightening, and zero-strip cleansing cushion",
    "sensoryProfile": {
      "color": "Vivid Saffron-Amber to Marigold Gold",
      "aroma": "Sun-ripened mountain citrus berry with crisp herbaceous undertones",
      "skinFeel": "Velvety, cushiony, non-greasy satin finish"
    },
    "bioactiveCompounds": [
      {
        "compound": "Palmitoleic Acid (Omega-7)",
        "concentration": "32% – 38% of Pulp Lipid Fraction",
        "role": "Biomimetic Epidermal Lipid Replenisher",
        "biochemicalTarget": "Integrates into stratum corneum intercellular lipid lamellae and accelerates keratinocyte renewal."
      },
      {
        "compound": "Natural Ascorbic Acid & Flavonoids",
        "concentration": "Concentrated Bioavailable Vitamin C",
        "role": "Antioxidant & Collagen Support",
        "biochemicalTarget": "Neutralizes reactive oxygen species and boosts skin luminosity."
      },
      {
        "compound": "Tocopherols & Tocotrienols",
        "concentration": "Natural Vitamin E Complex",
        "role": "Lipid Peroxidation Shield",
        "biochemicalTarget": "Shields epidermal cell membranes against photo-oxidative stress."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Thermal Water Calibration (28°C–32°C)",
        "durationSeconds": 10,
        "instruction": "Splash face and neck with lukewarm water (28°C–32°C) to soften sebum without stripping ceramides.",
        "proTip": "Sea Buckthorn maintains peak stability at pH 4.8–5.6; lukewarm water preserves lipid fluidity.",
        "commonMistakeToAvoid": "Using hot shower water (>38°C), which strips lipids and triggers reactive redness."
      },
      {
        "stepNumber": 2,
        "title": "Step 2 · Precision Apothecary Dispensing",
        "durationSeconds": 5,
        "instruction": "Dispense 1 pump (AM) or 1.5 pumps (PM) of Sea Buckthorn Face Wash into clean, wet palms.",
        "proTip": "Calibrated micro-dosing ensures optimal bioactive contact without product waste.",
        "commonMistakeToAvoid": "Applying un-emulsified product onto dry skin."
      },
      {
        "stepNumber": 3,
        "title": "Step 3 · Palm Micro-Foam Emulsification",
        "durationSeconds": 10,
        "instruction": "Rub wet palms briskly for 8–10 seconds to aerate into a silky, friction-free micro-cushion.",
        "proTip": "Pre-whipping in palms protects delicate cheek capillaries from friction.",
        "commonMistakeToAvoid": "Lathering directly on delicate cheeks."
      },
      {
        "stepNumber": 4,
        "title": "Step 4 · Zonal Sculpting Massage",
        "durationSeconds": 40,
        "instruction": "Massage in upward circular motions for 40 seconds across T-zone, cheek contours, and jawline.",
        "proTip": "Use featherlight ring-finger pressure on cheeks so Omega-7 works gently.",
        "commonMistakeToAvoid": "Rushing the massage in under 15 seconds or scrubbing downward."
      },
      {
        "stepNumber": 5,
        "title": "Step 5 · 15-Second Bio-Active Dwell Window",
        "durationSeconds": 15,
        "instruction": "Allow botanical foam to rest undisturbed on the skin for 15 seconds so bio-actives partition.",
        "proTip": "This 15-second pause transforms a daily cleanse into an active botanical treatment.",
        "commonMistakeToAvoid": "Rinsing off immediately before water- and lipid-soluble actives can bind."
      },
      {
        "stepNumber": 6,
        "title": "Step 6 · Cool Rinse & 60-Second Damp-Skin Seal",
        "durationSeconds": 25,
        "instruction": "Rinse with cool water, pat to 15% dampness, and lock in hydration with Kumkumadi Night Elixir or moisturizer within 60 seconds.",
        "proTip": "Applying leave-on hydration within 60 seconds of patting dry increases retention by 40%.",
        "commonMistakeToAvoid": "Allowing damp skin to air-dry completely in front of AC or fans."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "niacinamide",
        "partnerName": "Niacinamide (Vitamin B3)",
        "synergyScore": "99/100",
        "combinedBenefit": "Exogenous Omega-7 lipids + endogenous ceramide synthesis and pore refinement."
      },
      {
        "partnerId": "kumkumadi",
        "partnerName": "Kumkumadi Night Elixir",
        "synergyScore": "98/100",
        "combinedBenefit": "Daytime barrier defense followed by overnight Kashmiri Saffron lipid renewal."
      },
      {
        "partnerId": "aloe_vera",
        "partnerName": "Pure Aloe Vera",
        "synergyScore": "96/100",
        "combinedBenefit": "Polysaccharide hydration cushioning lipid-rich Omega-7 delivery."
      }
    ],
    "recommendedChips": [
      {
        "id": "sb_know",
        "label": "Sea Buckthorn Face Wash",
        "prompt": "Tell me about Sea Buckthorn Face Wash and its key ingredients"
      },
      {
        "id": "sb_layer",
        "label": "Post-Wash Layering Guide",
        "prompt": "What skincare products should I apply right after using Sea Buckthorn Face Wash?"
      },
      {
        "id": "sb_pair",
        "label": "Pair with Kumkumadi Elixir",
        "prompt": "How do I pair Sea Buckthorn Face Wash with Bhumivera Kumkumadi Night Elixir?"
      }
    ]
  },
  {
    "id": "activated_charcoal",
    "indexNumber": 2,
    "storyNumber": "INGREDIENT STORY · 02",
    "isHeroStory": true,
    "name": "Activated Bamboo Charcoal",
    "fullTitle": "Steam-Activated Highland Bamboo Charcoal",
    "latinBinomial": "Carbon (Phyllostachys edulis)",
    "inciName": "Charcoal Powder",
    "category": "Hero Botanical · Story 02",
    "noteFamily": "Elemental Carbon · Microporous Adsorption",
    "tagline": "A grounded, elemental presence in the ritual.",
    "shortSummary": "Produced via 900°C pyrolysis and superheated steam activation from mature highland bamboo, Bhumivera micronized charcoal adsorbs PM2.5 smog particulates, environmental pollutants, and excess sebum without abrasion.",
    "originRegion": "Highland Bamboo Groves, India",
    "harvestSeason": "Late Autumn Harvest",
    "extractionMethod": "900°C Pyrolysis + High-Pressure Steam Micronization",
    "concentrationInFormula": "3.00% Ultra-Fine Micro-Mesh (Non-Abrasive)",
    "optimalPhRange": "5.1 – 5.4",
    "solubility": "Insoluble Micronized Dispersion in Polysaccharide Gel",
    "ayurvedicDoshaAffinity": "Kapha & Pitta Clarifier — Purifies Ama and reduces excess oiliness",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 0,
    "primaryFocusZone": "T-zone, nasal alae, chin crease, and congested pores",
    "primaryClinicalBenefit": "Deep follicular detoxification, urban PM2.5 adsorption, and pore refinement",
    "sensoryProfile": {
      "color": "Velvety obsidian-slate lathering to pearl-grey micro-foam",
      "aroma": "Clean rain-washed mineral stone with herbal undertones",
      "skinFeel": "Weightless satin glide with zero particulate grit"
    },
    "bioactiveCompounds": [
      {
        "compound": "Microporous Carbon Honeycomb",
        "concentration": "Surface Area >1,200 m²/g",
        "role": "Selective Impurity Adsorption",
        "biochemicalTarget": "Traps lipophilic pollutants, heavy metals, and oxidized sebum via van der Waals forces."
      },
      {
        "compound": "Standardized Mineral Ash",
        "concentration": "<2.5% Mineral Trace Elements",
        "role": "Sebum Regulation",
        "biochemicalTarget": "Adsorbs excess surface sebum without destabilizing epidermal barrier ceramides."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Evening Lukewarm Prep (28°C–32°C)",
        "durationSeconds": 10,
        "instruction": "Splash face with lukewarm water to soften congested sebum plugs.",
        "proTip": "Use in the evening to dissolve daytime sunscreen, sweat, and city smog.",
        "commonMistakeToAvoid": "Applying charcoal wash directly to dry skin without water activation."
      },
      {
        "stepNumber": 2,
        "title": "Step 2 · Controlled Dispensing (1.5 Pumps)",
        "durationSeconds": 5,
        "instruction": "Dispense 1.5 pumps of Charcoal Face Wash into wet palms.",
        "proTip": "1.5 pumps provides the optimal dosage for full face and neck pollution cleanse.",
        "commonMistakeToAvoid": "Using excess pumps, which increases rinse time needlessly."
      },
      {
        "stepNumber": 3,
        "title": "Step 3 · Palm Micro-Foam Whipping",
        "durationSeconds": 10,
        "instruction": "Lather briskly in wet palms for 10 seconds until it turns pearl-grey and creamy.",
        "proTip": "Lathering in palms aerates the charcoal micelles before facial contact.",
        "commonMistakeToAvoid": "Rubbing the un-lathered black gel directly into sensitive cheeks."
      },
      {
        "stepNumber": 4,
        "title": "Step 4 · T-Zone & Congestion Focus",
        "durationSeconds": 40,
        "instruction": "Massage for 40 seconds, dedicating 20 seconds to nose wings, chin, and forehead.",
        "proTip": "Spend extra time on the nostril creases and chin where blackheads form.",
        "commonMistakeToAvoid": "Scrubbing vigorously around the delicate eye contour."
      },
      {
        "stepNumber": 5,
        "title": "Step 5 · 15-Second Clarifying Dwell",
        "durationSeconds": 15,
        "instruction": "Let the charcoal lather rest for 15 seconds so pores are cleared effortlessly.",
        "proTip": "Allows Neem and Haridra botanicals in the formula to soothe active blemishes.",
        "commonMistakeToAvoid": "Rinsing immediately before adsorption takes place."
      },
      {
        "stepNumber": 6,
        "title": "Step 6 · Cool Water Rinse & Overnight Seal",
        "durationSeconds": 25,
        "instruction": "Rinse with cool water, pat damp, and follow immediately with 2–3 drops of Kumkumadi Night Elixir.",
        "proTip": "Pairing Charcoal Face Wash with Kumkumadi Night Elixir provides the ultimate PM reset.",
        "commonMistakeToAvoid": "Rubbing skin with a rough towel."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "neem",
        "partnerName": "Sacred Neem Leaf Extract",
        "synergyScore": "98/100",
        "combinedBenefit": "Physical pore adsorption + botanical antimicrobial blemish defense."
      },
      {
        "partnerId": "haridra",
        "partnerName": "Haridra (Turmeric)",
        "synergyScore": "97/100",
        "combinedBenefit": "Deep pore clearance paired with antioxidant curcuminoid brightness."
      },
      {
        "partnerId": "kumkumadi",
        "partnerName": "Kumkumadi Night Elixir",
        "synergyScore": "99/100",
        "combinedBenefit": "Purified pores ready to receive Kashmiri Saffron cellular nourishment."
      }
    ],
    "recommendedChips": [
      {
        "id": "charcoal_know",
        "label": "Charcoal Face Wash",
        "prompt": "Tell me about Charcoal Face Wash and its key ingredients"
      },
      {
        "id": "charcoal_pm",
        "label": "Evening Detox Ritual",
        "prompt": "What is the step-by-step evening detox ritual with Charcoal Face Wash?"
      },
      {
        "id": "charcoal_pair",
        "label": "Pair with Kumkumadi",
        "prompt": "How does Charcoal Face Wash pair with Kumkumadi Night Elixir?"
      }
    ]
  },
  {
    "id": "kumkumadi",
    "indexNumber": 3,
    "storyNumber": "INGREDIENT STORY · 03",
    "isHeroStory": true,
    "name": "Kumkumadi Tailam",
    "fullTitle": "Classical 26-Herb Kumkumadi Tailam Night Elixir",
    "latinBinomial": "Kumkumadi Tailam Classical Formulation",
    "inciName": "Sesamum Indicum Seed Oil, Crocus Sativus Stigma, Curcuma Longa, Herbal Extracts",
    "category": "Hero Botanical · Story 03",
    "noteFamily": "Sacred Tailam · Kashmiri Saffron & Golden Radiance",
    "tagline": "Overnight golden luminosity steeped in classical Ayurvedic wisdom.",
    "shortSummary": "Handcrafted using authentic Grade-1 Kashmiri Mogra Saffron, Rakta Chandana, Haridra, and 26 classical Ayurvedic botanicals simmered via the traditional Taila Paka Vidhi. Restores cellular lipid moisture, fades stubborn dark marks, and imparts overnight golden radiance.",
    "originRegion": "Pampore, Kashmir & Sacred Ayurvedic Herb Groves, India",
    "harvestSeason": "Autumn Pre-Dawn Saffron Harvest",
    "extractionCraft": "Classical Taila Paka Vidhi (16-Hour Copper-Vessel Phyto-Infusion)",
    "concentrationStandard": "Pure Ayurvedic Tailam with Grade-1 Kashmiri Mogra Saffron",
    "optimalPhRange": "5.0 – 5.5",
    "solubility": "Nutritive Botanical Lipid Matrix",
    "ayurvedicDoshaAffinity": "Tridoshic Rasayana — Deeply balances Vata dryness, Pitta heat & builds Ojas",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 1,
    "primaryFocusZone": "Face, neck, cheekbone high points, and areas with dark spots or uneven tone",
    "primaryClinicalBenefit": "Nocturnal cellular repair, dark spot fading, intense lipid barrier nourishment, and signature golden glow",
    "sensoryProfile": {
      "color": "Deep crimson-gold nectar shimmering with saffron warmth",
      "aroma": "Rich saffron threads, honeyed sandalwood, and serene floral herbal warmth",
      "skinFeel": "Luxuriously rich yet rapidly absorbing botanical nectar with non-greasy satin finish"
    },
    "bioactiveCompounds": [
      {
        "compound": "Crocin & Safranal (Kashmiri Saffron)",
        "concentration": "Standardized Grade-1 Kashmiri Mogra Stigmas",
        "role": "Cellular Micro-Renewal & Melanin Moderation",
        "biochemicalTarget": "Inhibits tyrosinase activity to fade dark spots and impart a warm, golden luminous glow."
      },
      {
        "compound": "Curcuminoids (Standardized Haridra)",
        "concentration": "Bioactive Rhizome Curcumin",
        "role": "Antioxidant & Anti-Inflammatory",
        "biochemicalTarget": "Quenches photo-oxidative stress and calms micro-inflammation in epidermal tissues."
      },
      {
        "compound": "Classical 26-Herb Phyto-Sterols",
        "concentration": "Full Ayurvedic Kwatha Decoction Spectrum",
        "role": "Nocturnal Barrier Regeneration",
        "biochemicalTarget": "Replenishes depleted intercellular lipids and locks in hydration during overnight sleep."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Cleanse Thoroughly Before Sleep",
        "durationSeconds": 60,
        "instruction": "Cleanse face with Bhumivera Sea Buckthorn or Charcoal Face Wash to remove all surface debris.",
        "proTip": "A freshly cleansed barrier allows saffron and Ayurvedic bio-actives to penetrate unimpeded.",
        "commonMistakeToAvoid": "Applying elixir over unwashed skin or lingering makeup."
      },
      {
        "stepNumber": 2,
        "title": "Step 2 · Preserve 15% Damp Skin Moisture",
        "durationSeconds": 10,
        "instruction": "Gently pat face with a clean towel, leaving skin slightly damp (approx. 15% moisture).",
        "proTip": "Applying oil on damp skin locks in water and boosts absorption by up to 40%.",
        "commonMistakeToAvoid": "Waiting until skin is completely dry and parched."
      },
      {
        "stepNumber": 3,
        "title": "Step 3 · Precision Palm Warming (2 to 3 Drops)",
        "durationSeconds": 5,
        "instruction": "Dispense 2 to 3 drops into clean palms and rub palms together to warm the botanical elixir.",
        "proTip": "Warming activates the aromatic safranal and enhances lipid spreadability.",
        "commonMistakeToAvoid": "Using 6–8 drops, which oversaturates the skin and may transfer to pillowcases."
      },
      {
        "stepNumber": 4,
        "title": "Step 4 · Gentle Palm-Press Application",
        "durationSeconds": 30,
        "instruction": "Gently press warm palms onto cheeks, forehead, chin, and neck using upward pressure.",
        "proTip": "Pressing rather than dragging prevents pulling on delicate facial skin.",
        "commonMistakeToAvoid": "Aggressive rubbing or scrubbing around the eyes."
      },
      {
        "stepNumber": 5,
        "title": "Step 5 · Nocturnal Dwell & Sleep Integration",
        "durationSeconds": 15,
        "instruction": "Allow 5 minutes before resting your head on your pillow so the nectar fully absorbs.",
        "proTip": "The elixir works overnight in tandem with your natural circadian 11 PM–2 AM repair cycle.",
        "commonMistakeToAvoid": "Washing off before morning; Kumkumadi is an overnight leave-on treatment."
      },
      {
        "stepNumber": 6,
        "title": "Step 6 · Morning Awakening Splash",
        "durationSeconds": 20,
        "instruction": "Splash with lukewarm water in the morning to reveal plump, supple, golden-toned radiance.",
        "proTip": "Follow with Sea Buckthorn Face Wash and daily broad-spectrum SPF.",
        "commonMistakeToAvoid": "Skipping daytime sunscreen after overnight brightening treatments."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "sea_buckthorn",
        "partnerName": "Himalayan Sea Buckthorn",
        "synergyScore": "98/100",
        "combinedBenefit": "Sea Buckthorn morning cleanse + Kumkumadi overnight lipid regeneration."
      },
      {
        "partnerId": "charcoal_face_wash",
        "partnerName": "Charcoal Face Wash",
        "synergyScore": "99/100",
        "combinedBenefit": "PM Charcoal pore detox followed immediately by Kumkumadi nutrient infusion."
      },
      {
        "partnerId": "kashmiri_saffron",
        "partnerName": "Kashmiri Mogra Saffron (Kesar)",
        "synergyScore": "100/100",
        "combinedBenefit": "Core hero active driving the clinical radiance of the Kumkumadi formulation."
      }
    ],
    "recommendedChips": [
      {
        "id": "kumk_know",
        "label": "Kumkumadi Night Elixir",
        "prompt": "Tell me about Kumkumadi Night Elixir and how to apply it"
      },
      {
        "id": "kumk_layer",
        "label": "Layering with Face Wash",
        "prompt": "How do I layer Kumkumadi Night Elixir with Bhumivera Face Wash?"
      },
      {
        "id": "kumk_skin",
        "label": "Oily & Sensitive Skin Guide",
        "prompt": "Can I use Kumkumadi Night Elixir every night on oily or acne-prone skin?"
      }
    ]
  },
  {
    "id": "kashmiri_saffron",
    "indexNumber": 4,
    "storyNumber": "HERO BOTANICAL · 04",
    "isHeroStory": true,
    "name": "Kashmiri Mogra Saffron (Kesar)",
    "fullTitle": "High-Altitude Pampore Kashmiri Mogra Saffron",
    "latinBinomial": "Crocus sativus L.",
    "inciName": "Crocus Sativus Stigma Extract",
    "category": "Radiance Active",
    "noteFamily": "Precious Spice · Golden Carotenoids",
    "tagline": "The golden standard of botanical skin radiance.",
    "shortSummary": "Hand-picked at dawn in the high-altitude fields of Pampore, Kashmir, Grade-1 Mogra Saffron contains the worlds highest concentrations of crocin and safranal. It accelerates cell turnover and imparts an incomparable golden warmth to the complexion.",
    "originRegion": "Pampore, Kashmir Valley, India",
    "harvestSeason": "Late October to Early November",
    "extractionMethod": "Classical Phyto-Infusion in Ayurvedic Tailam",
    "concentrationInFormula": "Grade-1 Saffron Stigmas in Kumkumadi Night Elixir",
    "optimalPhRange": "5.0 – 5.5",
    "ayurvedicDoshaAffinity": "Tridoshic — Awakens Sattva, balances Pitta warmth and restores skin Ojas",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 1,
    "primaryFocusZone": "Cheeks, forehead, neck, and hyperpigmented areas",
    "primaryClinicalBenefit": "Tyrosinase moderation, dark spot fading, photo-damage defense, and cellular luminosity",
    "sensoryProfile": {
      "color": "Rich deep orange-red stigmas yielding golden-crimson hue",
      "aroma": "Distinctive sweet honeyed floral saffron bouquet",
      "skinFeel": "Silky, warm, and deeply comforting"
    },
    "bioactiveCompounds": [
      {
        "compound": "Crocin & Crocetin",
        "concentration": "High Carotenoid Glycosides",
        "role": "Pigment Evening & Radiance",
        "biochemicalTarget": "Downregulates excess melanin production and brightens dull skin tone."
      },
      {
        "compound": "Safranal",
        "concentration": "Bioactive Monoterpene Aldehyde",
        "role": "Antioxidant & Free-Radical Scavenger",
        "biochemicalTarget": "Defends dermal fibroblasts against UV photo-oxidation."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Evening Cleanse",
        "durationSeconds": 45,
        "instruction": "Wash face thoroughly with Charcoal or Sea Buckthorn Face Wash.",
        "proTip": "Clean skin absorbs saffron crocin without surface blockage.",
        "commonMistakeToAvoid": "Applying over dirty skin."
      },
      {
        "stepNumber": 2,
        "title": "Step 2 · Apply on Damp Skin",
        "durationSeconds": 15,
        "instruction": "Warm 2–3 drops of Kumkumadi Night Elixir and press gently into damp face and neck.",
        "proTip": "Damp skin ensures zero oily residue and deep overnight penetration.",
        "commonMistakeToAvoid": "Using on completely dry or parched skin."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "kumkumadi",
        "partnerName": "Kumkumadi Tailam",
        "synergyScore": "100/100",
        "combinedBenefit": "Native botanical vehicle delivering Kashmiri Saffron bio-actives deep into the epidermis."
      },
      {
        "partnerId": "haridra",
        "partnerName": "Haridra (Turmeric)",
        "synergyScore": "99/100",
        "combinedBenefit": "Dual golden Ayurvedic synergy for maximum brightness and blemish recovery."
      }
    ],
    "recommendedChips": [
      {
        "id": "saff_1",
        "label": "Kashmiri Saffron Science",
        "prompt": "Tell me about Kashmiri Saffron in Bhumivera Kumkumadi Night Elixir"
      },
      {
        "id": "saff_2",
        "label": "Dark Spot Recovery",
        "prompt": "How does Kashmiri Saffron help fade dark spots and hyperpigmentation?"
      }
    ]
  },
  {
    "id": "sacred_tulsi",
    "indexNumber": 5,
    "storyNumber": "HERO BOTANICAL · 05",
    "isHeroStory": true,
    "name": "Sacred Tulsi (Holy Basil)",
    "fullTitle": "Sacred Rama & Krishna Tulsi Leaf Distillate",
    "latinBinomial": "Ocimum tenuiflorum (syn. Ocimum sanctum)",
    "inciName": "Ocimum Sanctum Leaf Extract",
    "category": "Adaptogen & Microbiome Shield",
    "noteFamily": "Sacred Herbal Dew · Eugenol & Ursolic Acid",
    "tagline": "Adaptogenic calm and microbiome resilience.",
    "shortSummary": "Revered in Ayurveda as 'The Incomparable One,' Tulsi is an adaptogenic botanical that regulates environmental stress, balances excess sebum, and protects beneficial skin flora without irritation.",
    "originRegion": "Bundelkhand & Foothills of Uttarakhand, India",
    "harvestSeason": "Pre-Dawn Early Flowering Harvest",
    "extractionMethod": "Hydro-Distillation & Cold Phyto-Extraction",
    "concentrationInFormula": "Listed Botanical Extract in Sea Buckthorn Face Wash",
    "optimalPhRange": "5.0 – 5.5",
    "ayurvedicDoshaAffinity": "Sattvic Rasayana — Balances Kapha oiliness and calms Pitta irritation",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 0,
    "primaryFocusZone": "Full face, T-zone, and stress-prone breakout areas",
    "primaryClinicalBenefit": "Cutaneous stress relief, microbial balancing, and blemish prevention",
    "sensoryProfile": {
      "color": "Fresh herbal-emerald botanical tint",
      "aroma": "Crisp clove-basil herbal aroma with dewy morning sweetness",
      "skinFeel": "Refreshing, cooling, and clarifying"
    },
    "bioactiveCompounds": [
      {
        "compound": "Ursolic Acid & Rosmarinic Acid",
        "concentration": "High Triterpenoid Fraction",
        "role": "Barrier Defense & Anti-Inflammatory",
        "biochemicalTarget": "Calms cutaneous stress signals and preserves collagen integrity."
      },
      {
        "compound": "Eugenol",
        "concentration": "Standardized Gentle Plant Distillate",
        "role": "Microbiome Harmonizer",
        "biochemicalTarget": "Purifies blemish-causing bacteria while respecting beneficial skin flora."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Gentle Cleansing Activation",
        "durationSeconds": 40,
        "instruction": "Massage Sea Buckthorn Face Wash containing Tulsi for 40 seconds over wet skin.",
        "proTip": "Allows adaptogenic triterpenoids to calm surface reactivity.",
        "commonMistakeToAvoid": "Rushing the cleanse in under 15 seconds."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "sea_buckthorn",
        "partnerName": "Sea Buckthorn",
        "synergyScore": "97/100",
        "combinedBenefit": "Tulsi adaptogenic calm cushions Sea Buckthorn Omega-7 lipid renewal."
      },
      {
        "partnerId": "aloe_vera",
        "partnerName": "Pure Aloe Vera",
        "synergyScore": "98/100",
        "combinedBenefit": "Dual cooling botanicals that immediately soothe transient facial redness."
      }
    ],
    "recommendedChips": [
      {
        "id": "tulsi_1",
        "label": "Tulsi in Face Wash",
        "prompt": "Tell me about Tulsi in Bhumivera Sea Buckthorn Face Wash"
      },
      {
        "id": "tulsi_2",
        "label": "Microbiome & Acne",
        "prompt": "How does Sacred Tulsi help with skin stress, redness, and blemish balance?"
      }
    ]
  },
  {
    "id": "aloe_vera",
    "indexNumber": 6,
    "storyNumber": "HERO BOTANICAL · 06",
    "isHeroStory": true,
    "name": "Pure Aloe Vera",
    "fullTitle": "Cold-Stabilized Inner-Fillet Aloe Vera Juice",
    "latinBinomial": "Aloe barbadensis miller",
    "inciName": "Aloe Barbadensis Leaf Juice",
    "category": "Bio-Polysaccharide Hydrator",
    "noteFamily": "Cooling Succulent · Acemannan Mucilage",
    "tagline": "A generous plant, and a thoughtful place to begin.",
    "shortSummary": "Cold-stabilized first-press inner leaf fillet rich in native Acemannan polysaccharides. Calibrated at 5% concentration in Bhumivera Face Wash to cool redness and cushion facial skin with multi-depth hydration.",
    "originRegion": "Thar Desert Edge & Kutch, India",
    "harvestSeason": "Morning Harvest of 3-Year Mature Leaves",
    "extractionMethod": "Cold-Pressed Inner Leaf Filleting (Never Heat-Degraded Powder)",
    "concentrationInFormula": "5.00% Cold-Stabilized Juice in Face Wash",
    "optimalPhRange": "5.0 – 5.5",
    "ayurvedicDoshaAffinity": "Kumari Rasayana — Deeply cooling Pitta pacifier & Vata moisture replenisher",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 0,
    "primaryFocusZone": "Full face, cheek contours, and dehydrated areas",
    "primaryClinicalBenefit": "Immediate thermal cooling, polysaccharide moisture cushioning, and barrier soothing",
    "sensoryProfile": {
      "color": "Crystal-clear aqueous dewy sheen",
      "aroma": "Fresh crisp succulent leaf dew",
      "skinFeel": "Instantly cooling, soothing, and zero-stick finish"
    },
    "bioactiveCompounds": [
      {
        "compound": "Acemannan Polysaccharides",
        "concentration": "High-Molecular-Weight Mucilage",
        "role": "Aquaporin Activation & Water Binding",
        "biochemicalTarget": "Binds atmospheric water to stratum corneum and prevents moisture loss."
      },
      {
        "compound": "Bradykinase & Plant Sterols",
        "concentration": "Natural Botanical Enzymes",
        "role": "Thermal Erythema Relief",
        "biochemicalTarget": "Calms cutaneous heat sensations after sun exposure or cleansing."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Cushioned Cleanse",
        "durationSeconds": 40,
        "instruction": "Lather Sea Buckthorn Face Wash with wet palms; the Aloe base protects against tightness.",
        "proTip": "Aloe forms a protective veil so surfactants rinse clean without stripping.",
        "commonMistakeToAvoid": "Rinsing with scalding hot water, which negates the cooling benefit."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "hyaluronic_acid",
        "partnerName": "Hyaluronic Acid",
        "synergyScore": "99/100",
        "combinedBenefit": "Aloe mucopolysaccharides amplify Hyaluronic Acid water retention across all humidity levels."
      },
      {
        "partnerId": "vegetable_glycerin",
        "partnerName": "Botanical Glycerin",
        "synergyScore": "98/100",
        "combinedBenefit": "Dual humectant matrix that locks in post-cleanse suppleness."
      }
    ],
    "recommendedChips": [
      {
        "id": "aloe_1",
        "label": "Aloe Vera Science",
        "prompt": "Tell me about Aloe Vera in Bhumivera Sea Buckthorn Face Wash"
      },
      {
        "id": "aloe_2",
        "label": "Damp Skin Hydration",
        "prompt": "Walk me through the 60-second damp-skin hydration ritual"
      }
    ]
  },
  {
    "id": "niacinamide",
    "indexNumber": 7,
    "storyNumber": "CLINICAL ACTIVE · 07",
    "isHeroStory": false,
    "name": "Niacinamide (Vitamin B3)",
    "fullTitle": "Physiologically Active Niacinamide (Vitamin B3)",
    "latinBinomial": "Pyridine-3-carboxamide",
    "inciName": "Niacinamide",
    "category": "Ceramide Booster & Pore Refiner",
    "noteFamily": "Vitamin B3 · Cellular Energy Cofactor",
    "tagline": "Essential barrier vitamin for refined pores and even tone.",
    "shortSummary": "Calibrated at 1% concentration in Bhumivera Sea Buckthorn Face Wash and 0.1% in Charcoal Face Wash. Stimulates natural epidermal ceramide synthesis, refines enlarged pores, regulates excess sebum, and fades post-blemish redness without irritation.",
    "originRegion": "Pharmaceutical-Grade Synthesis",
    "harvestSeason": "All Seasons",
    "extractionMethod": "High-Purity Bio-Identical Purification",
    "concentrationInFormula": "1.00% Calibrated Active (Face Wash)",
    "optimalPhRange": "5.0 – 6.0",
    "ayurvedicDoshaAffinity": "Tridoshic — Balances Kapha sebum and Pitta redness",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 0,
    "primaryFocusZone": "T-zone, cheeks, pores, and areas with uneven tone or post-acne marks",
    "primaryClinicalBenefit": "Endogenous ceramide synthesis, pore refinement, sebum regulation, and dark mark moderation",
    "sensoryProfile": {
      "color": "Water-clear solution",
      "aroma": "Neutral / unscented",
      "skinFeel": "Weightless and smooth"
    },
    "bioactiveCompounds": [
      {
        "compound": "Nicotinamide (NAD+/NADP+ Precursor)",
        "concentration": "1.0% Pure Calibrated Grade",
        "role": "Ceramide Synthesis Stimulator",
        "biochemicalTarget": "Upregulates serine palmitoyltransferase to build natural barrier lipids."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · 40-Second Bioactive Contact",
        "durationSeconds": 40,
        "instruction": "Gently massage cleanser foam over wet skin for 40 seconds so Niacinamide binds to pores.",
        "proTip": "1% concentration delivers daily barrier support without the flushing of higher 10% serums.",
        "commonMistakeToAvoid": "Rinsing immediately in under 10 seconds."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "sea_buckthorn",
        "partnerName": "Sea Buckthorn",
        "synergyScore": "99/100",
        "combinedBenefit": "Exogenous Omega-7 lipids + endogenous ceramide synthesis for total barrier harmony."
      },
      {
        "partnerId": "hyaluronic_acid",
        "partnerName": "Hyaluronic Acid",
        "synergyScore": "98/100",
        "combinedBenefit": "Hydration binding paired with barrier strengthening."
      }
    ],
    "recommendedChips": [
      {
        "id": "nia_1",
        "label": "Niacinamide in Face Wash",
        "prompt": "Tell me about Niacinamide in Sea Buckthorn Face Wash"
      },
      {
        "id": "nia_2",
        "label": "Pore & Oil Control",
        "prompt": "How does Niacinamide help control oil and refine pores?"
      }
    ]
  },
  {
    "id": "hyaluronic_acid",
    "indexNumber": 8,
    "storyNumber": "CLINICAL ACTIVE · 08",
    "isHeroStory": false,
    "name": "Hyaluronic Acid",
    "fullTitle": "High-Purity Biomimetic Sodium Hyaluronate",
    "latinBinomial": "Sodium Hyaluronate",
    "inciName": "Sodium Hyaluronate",
    "category": "Multi-Depth Epidermal Humectant",
    "noteFamily": "Biomimetic Glycosaminoglycan · Hydro-Reservoir",
    "tagline": "Nature's premier moisture-binding biomolecule.",
    "shortSummary": "High-purity Sodium Hyaluronate calibrated at 0.5% in Sea Buckthorn Face Wash and 0.1% in Charcoal Face Wash. Binds up to 1,000 times its weight in water, delivering multi-depth epidermal hydration and preventing tight, dehydrated sensations after cleansing.",
    "originRegion": "Bio-Fermentation Pure Grade",
    "harvestSeason": "All Seasons",
    "extractionMethod": "Non-GMO Plant Bio-Fermentation",
    "concentrationInFormula": "0.50% Calibrated Humectant (Face Wash)",
    "optimalPhRange": "5.0 – 6.0",
    "ayurvedicDoshaAffinity": "Vata & Pitta Hydrator — Replenishes deep moisture reservoirs",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 0,
    "primaryFocusZone": "Full face, cheek contours, and moisture-depleted zones",
    "primaryClinicalBenefit": "Binds up to 1,000x water weight, infuses immediate suppleness, and prevents post-cleanse tightness",
    "sensoryProfile": {
      "color": "Water-clear silky fluid",
      "aroma": "Clean and neutral",
      "skinFeel": "Plump, cushiony, and deeply quenching"
    },
    "bioactiveCompounds": [
      {
        "compound": "Sodium Hyaluronate",
        "concentration": "0.5% Calibrated Concentration",
        "role": "Epidermal Water Magnet",
        "biochemicalTarget": "Forms a breathable hydration veil across the stratum corneum to lock in water molecules."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Damp-Skin Cleansing",
        "durationSeconds": 40,
        "instruction": "Use with lukewarm water; Hyaluronic Acid binds water molecules during your cleanse.",
        "proTip": "Always follow with the 60-second damp skin lock to maximize hydration retention.",
        "commonMistakeToAvoid": "Washing with very hot water, which speeds evaporation."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "vegetable_glycerin",
        "partnerName": "Botanical Glycerin",
        "synergyScore": "99/100",
        "combinedBenefit": "Dual humectant partnership ensuring lasting cellular hydration."
      },
      {
        "partnerId": "aloe_vera",
        "partnerName": "Pure Aloe Vera",
        "synergyScore": "98/100",
        "combinedBenefit": "Polysaccharide hydro-mesh holding hyaluronic moisture against the skin."
      }
    ],
    "recommendedChips": [
      {
        "id": "ha_1",
        "label": "Hyaluronic Acid in Cleansers",
        "prompt": "Tell me about Hyaluronic Acid in Sea Buckthorn Face Wash"
      },
      {
        "id": "ha_2",
        "label": "Prevent Post-Wash Tightness",
        "prompt": "How does Hyaluronic Acid prevent dry or tight skin after washing?"
      }
    ]
  },
  {
    "id": "vegetable_glycerin",
    "indexNumber": 9,
    "storyNumber": "BOTANICAL ACTIVE · 09",
    "isHeroStory": false,
    "name": "Botanical Glycerin",
    "fullTitle": "100% Plant-Derived Botanical Glycerin",
    "latinBinomial": "Glycerol (Plant Origin)",
    "inciName": "Glycerin",
    "category": "Moisture-Lock Humectant",
    "noteFamily": "Plant Humectant · Cellular Suppleness",
    "tagline": "The foundational moisture-locking botanical.",
    "shortSummary": "100% plant-derived botanical glycerin calibrated at 4% in Sea Buckthorn Face Wash and 5% in Charcoal Face Wash. Functions as a core humectant that prevents transepidermal water loss (TEWL) and maintains cellular suppleness.",
    "originRegion": "Sustainable Plant Seed Extraction",
    "harvestSeason": "All Seasons",
    "extractionMethod": "High-Purity Botanical Distillation",
    "concentrationInFormula": "4.00% – 5.00% in Bhumivera Formulations",
    "optimalPhRange": "5.0 – 6.5",
    "ayurvedicDoshaAffinity": "Vata Pacifier — Restores softness and prevents skin cracking",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 0,
    "primaryFocusZone": "Full face, cheek contours, and moisture barrier",
    "primaryClinicalBenefit": "Draws atmospheric moisture into stratum corneum and prevents post-cleanse barrier tightness",
    "sensoryProfile": {
      "color": "Crystal-clear viscous liquid",
      "aroma": "Subtle sweet warmth",
      "skinFeel": "Comforting, smooth, and moisture-rich"
    },
    "bioactiveCompounds": [
      {
        "compound": "Plant-Derived Glycerol",
        "concentration": "99.7% Pure Pharmacopeia Grade",
        "role": "Transepidermal Water Retainer",
        "biochemicalTarget": "Penetrates aquaporin channels to hydrate deeper layers of the epidermis."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Water-Emulsified Cleanse",
        "durationSeconds": 40,
        "instruction": "Lather face wash with wet palms; Glycerin ensures zero moisture is pulled from living skin cells.",
        "proTip": "Keeps skin feeling soft and elastic rather than squeaky or stripped.",
        "commonMistakeToAvoid": "Using harsh soap bars with no humectants."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "hyaluronic_acid",
        "partnerName": "Hyaluronic Acid",
        "synergyScore": "99/100",
        "combinedBenefit": "Synergistic humectant duo for surface and multi-depth epidermal hydration."
      }
    ],
    "recommendedChips": [
      {
        "id": "gly_1",
        "label": "Botanical Glycerin Science",
        "prompt": "Why does Bhumivera use Botanical Glycerin in its face washes?"
      }
    ]
  },
  {
    "id": "neem",
    "indexNumber": 10,
    "storyNumber": "AYURVEDIC ACTIVE · 10",
    "isHeroStory": false,
    "name": "Sacred Neem (Nimba)",
    "fullTitle": "Sacred Neem Leaf Extract & Distillate",
    "latinBinomial": "Azadirachta indica",
    "inciName": "Azadirachta Indica Leaf Extract",
    "category": "Antimicrobial Purifier",
    "noteFamily": "Ayurvedic Nimba · Purifying Bitter",
    "tagline": "Classical Ayurvedic guardian against blemishes and follicular congestion.",
    "shortSummary": "Calibrated at 0.5% in Charcoal Face Wash and included in Botanical Shampoo. Rich in margosic acids, nimbidin, and azadirachtin that clarify blemish-prone skin, soothe scalp irritation, and curb bacterial colonization without stripping.",
    "originRegion": "Certified Organic Neem Orchards, India",
    "harvestSeason": "Early Summer Leaf Harvest",
    "extractionMethod": "Hydro-Glycolic Phyto-Extraction & Cold Leaf Distillation",
    "concentrationInFormula": "0.50% Calibrated Botanical Extract",
    "optimalPhRange": "5.0 – 6.0",
    "ayurvedicDoshaAffinity": "Kapha & Pitta Pacifier — Powerful Ayurvedic Tikta (bitter) purifier",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 0,
    "primaryFocusZone": "T-zone, jawline, blemish-prone areas, and scalp roots",
    "primaryClinicalBenefit": "Antimicrobial clarity, redness calming, sebum balancing, and scalp purification",
    "sensoryProfile": {
      "color": "Deep olive-green botanical tincture",
      "aroma": "Distinctive clean herbal bitter leaf note",
      "skinFeel": "Refreshing, cooling, and clarifying"
    },
    "bioactiveCompounds": [
      {
        "compound": "Nimbidin & Azadirachtin",
        "concentration": "Bioactive Terpenoid Fraction",
        "role": "Natural Antimicrobial & Purifier",
        "biochemicalTarget": "Curbs proliferation of Cutibacterium acnes and Malassezia without resistance."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Zonal Purifying Massage",
        "durationSeconds": 40,
        "instruction": "Massage Charcoal Face Wash or Botanical Shampoo into congested zones for 40–60 seconds.",
        "proTip": "Allow 15 seconds dwell time so Neem actives can clarify pores and scalp follicles.",
        "commonMistakeToAvoid": "Rinsing immediately before Neem can act."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "activated_charcoal",
        "partnerName": "Activated Charcoal",
        "synergyScore": "98/100",
        "combinedBenefit": "Charcoal adsorbs surface oils while Neem purifies deeper follicular microbes."
      },
      {
        "partnerId": "haridra",
        "partnerName": "Haridra (Turmeric)",
        "synergyScore": "99/100",
        "combinedBenefit": "Classical Ayurvedic clarifying trinity for blemish-free skin clarity."
      }
    ],
    "recommendedChips": [
      {
        "id": "neem_1",
        "label": "Neem in Skincare",
        "prompt": "Tell me about Neem in Bhumivera Charcoal Face Wash"
      },
      {
        "id": "neem_2",
        "label": "Neem for Haircare",
        "prompt": "How does Neem help purify the scalp in Bhumivera Botanical Shampoo?"
      }
    ]
  },
  {
    "id": "haridra",
    "indexNumber": 11,
    "storyNumber": "AYURVEDIC ACTIVE · 11",
    "isHeroStory": false,
    "name": "Haridra (Kasturi Turmeric)",
    "fullTitle": "Standardized Ayurvedic Haridra Rhizome Extract",
    "latinBinomial": "Curcuma longa L.",
    "inciName": "Curcuma Longa Root Extract",
    "category": "Antioxidant & Curcuminoid Radiance",
    "noteFamily": "Golden Rhizome · Curcuminoid Glow",
    "tagline": "Sacred golden rhizome for radiant clarity and even tone.",
    "shortSummary": "Calibrated at 0.5% in Charcoal Face Wash and infused in Kumkumadi Night Elixir. Standardized for antioxidant curcuminoids, it visibly brightens hyperpigmentation, protects against photo-oxidative stress, and imparts warmth and clarity to the complexion.",
    "originRegion": "Certified Organic Farms, Western Ghats, India",
    "harvestSeason": "Winter Rhizome Harvest",
    "extractionMethod": "Standardized Supercritical Phyto-Extraction",
    "concentrationInFormula": "Standardized Active Extract in Face Wash & Elixir",
    "optimalPhRange": "5.0 – 5.5",
    "ayurvedicDoshaAffinity": "Tridoshic — Balances all three doshas, especially Kapha and Pitta",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 0,
    "primaryFocusZone": "Full face, cheek contours, and areas with dark spots or blemishes",
    "primaryClinicalBenefit": "Curcuminoid antioxidant protection, post-blemish mark fading, and natural skin glow",
    "sensoryProfile": {
      "color": "Vibrant golden-warm botanical hue",
      "aroma": "Warm earthy spicy herbal fragrance",
      "skinFeel": "Comforting, smooth, and luminous"
    },
    "bioactiveCompounds": [
      {
        "compound": "Curcuminoids (Curcumin, Demethoxycurcumin)",
        "concentration": "Standardized Curcuminoid Active",
        "role": "Potent Free-Radical Scavenger",
        "biochemicalTarget": "Neutralizes reactive nitrogen/oxygen species and supports collagen integrity."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Daily Botanical Application",
        "durationSeconds": 40,
        "instruction": "Use Charcoal Face Wash daily, or press Kumkumadi Night Elixir onto clean skin before sleep.",
        "proTip": "Non-staining cosmetic extract formulation that rinses clean without yellow residue.",
        "commonMistakeToAvoid": "Confusing with raw kitchen turmeric powder which stains skin."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "kumkumadi",
        "partnerName": "Kumkumadi Tailam",
        "synergyScore": "99/100",
        "combinedBenefit": "Herbal synergy that accelerates dark mark fading and boosts golden luminosity."
      },
      {
        "partnerId": "neem",
        "partnerName": "Sacred Neem",
        "synergyScore": "98/100",
        "combinedBenefit": "Neem clarifies blemish-causing microbes while Haridra soothes post-acne redness."
      }
    ],
    "recommendedChips": [
      {
        "id": "hari_1",
        "label": "Turmeric in Bhumivera",
        "prompt": "Tell me about Haridra (Turmeric) in Bhumivera products"
      },
      {
        "id": "hari_2",
        "label": "Fade Dark Spots",
        "prompt": "How does Haridra help fade dark spots and boost skin glow?"
      }
    ]
  },
  {
    "id": "amla",
    "indexNumber": 12,
    "storyNumber": "HAIRCARE RASAYANA · 12",
    "isHeroStory": false,
    "name": "Amla (Indian Gooseberry)",
    "fullTitle": "Ayurvedic Amla Fruit Phyto-Extract",
    "latinBinomial": "Phyllanthus emblica",
    "inciName": "Emblica Officinalis Fruit Extract",
    "category": "Follicular Strengthener & Vitamin C",
    "noteFamily": "Ayurvedic Rasayana · Tannins & Vitamin C",
    "tagline": "Classical rejuvenator for strong roots and lustrous hair.",
    "shortSummary": "Potent Ayurvedic Rasayana featured in Bhumivera Botanical Shampoo. Delivers concentrated bioavailable Vitamin C and heat-stable tannins that fortify follicular roots, stabilize keratin protein fibers, and protect hair against environmental stress.",
    "originRegion": "Forest Groves of Central India",
    "harvestSeason": "Winter Fruit Harvest",
    "extractionMethod": "Cold Ultrasonic Aqueous Decoction",
    "concentrationInFormula": "Active Botanical Extract in Botanical Shampoo",
    "optimalPhRange": "5.5 – 6.0",
    "ayurvedicDoshaAffinity": "Tridoshic Rasayana — Cools Pitta heat, strengthens roots",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 0,
    "primaryFocusZone": "Hair roots, scalp, and hair shaft cuticle",
    "primaryClinicalBenefit": "Fortifies follicular anchors, stabilizes keratin fibers, and enhances hair shine",
    "sensoryProfile": {
      "color": "Rich amber-brown herbal decoction",
      "aroma": "Crisp tangy green fruit and earthy herbal nuance",
      "skinFeel": "Strengthening, non-stripping, and refreshing"
    },
    "bioactiveCompounds": [
      {
        "compound": "Emblicanins & Chebulagic Tannins",
        "concentration": "Standardized Polyphenols",
        "role": "Keratin Protein Stabilization",
        "biochemicalTarget": "Cross-links hair protein chains to reduce breakage and shedding."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Scalp Massage (60 Seconds)",
        "durationSeconds": 60,
        "instruction": "Apply Botanical Shampoo to wet scalp and massage gently for 60 seconds before rinsing.",
        "proTip": "Allows Amla tannins and Vitamin C to reach follicular papillae.",
        "commonMistakeToAvoid": "Rinsing immediately without massaging into the scalp roots."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "bhringraj",
        "partnerName": "Bhringraj (False Daisy)",
        "synergyScore": "99/100",
        "combinedBenefit": "The legendary Ayurvedic hair synergy: Amla fortifies roots while Bhringraj revitalizes growth."
      },
      {
        "partnerId": "rosemary",
        "partnerName": "Rosemary Leaf Oil",
        "synergyScore": "98/100",
        "combinedBenefit": "Rosemary stimulates scalp circulation while Amla feeds follicular bio-nutrients."
      }
    ],
    "recommendedChips": [
      {
        "id": "amla_1",
        "label": "Amla in Shampoo",
        "prompt": "Tell me about Amla in Bhumivera Botanical Shampoo"
      },
      {
        "id": "amla_2",
        "label": "Hair Strength Routine",
        "prompt": "How does Amla strengthen hair roots and reduce hair breakage?"
      }
    ]
  },
  {
    "id": "bhringraj",
    "indexNumber": 13,
    "storyNumber": "HAIRCARE RASAYANA · 13",
    "isHeroStory": false,
    "name": "Bhringraj (False Daisy)",
    "fullTitle": "Classical Bhringraj Root & Leaf Extract",
    "latinBinomial": "Eclipta alba (syn. Eclipta prostrata)",
    "inciName": "Eclipta Alba Extract",
    "category": "King of Hair Follicle Revitalizer",
    "noteFamily": "Keshraj · Ayurvedic Follicle Activator",
    "tagline": "The classical King of Hair for density and follicular vitality.",
    "shortSummary": "Celebrated in Ayurveda as 'Keshraj' (King of Hair), Bhringraj is rich in wedelolactone and ecliptine that encourage resting follicles back into active growth phase, reducing excess hair shedding and boosting strand density.",
    "originRegion": "Certified Ayurvedic Herbal Groves, India",
    "harvestSeason": "Late Monsoon Herb Harvest",
    "extractionMethod": "Hydro-Alcoholic Phyto-Decoction",
    "concentrationInFormula": "Active Botanical Extract in Botanical Shampoo",
    "optimalPhRange": "5.5 – 6.0",
    "ayurvedicDoshaAffinity": "Pitta Pacifier — Cools excess scalp heat and calms premature shedding",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 0,
    "primaryFocusZone": "Scalp follicles and thinning hair zones",
    "primaryClinicalBenefit": "Stimulates anagen hair phase, reduces shedding, and revitalizes dormant follicles",
    "sensoryProfile": {
      "color": "Deep earthy botanical green tincture",
      "aroma": "Soothing earthy herbal aroma",
      "skinFeel": "Cooling, fortifying, and revitalizing"
    },
    "bioactiveCompounds": [
      {
        "compound": "Wedelolactone & Desmethylwedelolactone",
        "concentration": "Standardized Coumestan Bio-Actives",
        "role": "Follicular Papilla Activator",
        "biochemicalTarget": "Stimulates follicular cellular activity and prolongs the anagen growth cycle."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Stimulating Scalp Massage",
        "durationSeconds": 60,
        "instruction": "Work lather through wet scalp using fingertip pads in circular motions for 60 seconds.",
        "proTip": "Gentle scalp massage boosts microcirculation and nutrient uptake.",
        "commonMistakeToAvoid": "Scratching scalp with fingernails."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "amla",
        "partnerName": "Amla",
        "synergyScore": "99/100",
        "combinedBenefit": "Dual Ayurvedic Rasayana for comprehensive root strengthening and growth."
      },
      {
        "partnerId": "rosemary",
        "partnerName": "Rosemary Leaf Oil",
        "synergyScore": "98/100",
        "combinedBenefit": "Clinically proven herbal synergy for hair density and scalp circulation."
      }
    ],
    "recommendedChips": [
      {
        "id": "bhring_1",
        "label": "Bhringraj Science",
        "prompt": "Tell me about Bhringraj in Bhumivera Botanical Shampoo"
      },
      {
        "id": "bhring_2",
        "label": "Hair Fall Defense",
        "prompt": "How does Bhringraj help with hair fall and thinning hair?"
      }
    ]
  },
  {
    "id": "rosemary",
    "indexNumber": 14,
    "storyNumber": "HAIRCARE ACTIVE · 14",
    "isHeroStory": false,
    "name": "Rosemary Leaf Oil",
    "fullTitle": "Therapeutic Cold-Pressed Rosemary Essential Oil",
    "latinBinomial": "Rosmarinus officinalis L.",
    "inciName": "Rosmarinus Officinalis Leaf Oil",
    "category": "Scalp Micro-Perfusion Activator",
    "noteFamily": "Aromatic Phyto-Essence · Carnosic Acid & 1,8-Cineole",
    "tagline": "Targeted botanical stimulus for follicular circulation.",
    "shortSummary": "Pure therapeutic botanical oil calibrated in Bhumivera Botanical Shampoo. Contains carnosic acid and 1,8-cineole that stimulate scalp microcapillary blood flow, delivering oxygen and nutrients directly to hair roots to boost vitality without irritation.",
    "originRegion": "Highland Herb Gardens, Nilgiris & Mediterranean Foothills",
    "harvestSeason": "Spring Flowering Bloom",
    "extractionMethod": "Steam Alembic Distillation",
    "concentrationInFormula": "Calibrated Therapeutic Essence in Shampoo",
    "optimalPhRange": "5.5 – 6.0",
    "ayurvedicDoshaAffinity": "Kapha & Vata Stimulator — Activates Prana and scalp blood flow",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 0,
    "primaryFocusZone": "Scalp dermal papilla and hair root capillaries",
    "primaryClinicalBenefit": "Stimulates microcapillary blood flow, energizes follicles, and curbs scalp dryness",
    "sensoryProfile": {
      "color": "Pale golden-clear aromatic essence",
      "aroma": "Crisp piney herbaceous freshness with woodsy depth",
      "skinFeel": "Tingling, invigorating, and refreshing"
    },
    "bioactiveCompounds": [
      {
        "compound": "Carnosic Acid & Rosmarinic Acid",
        "concentration": "High Phenolic Diterpene Content",
        "role": "Microcirculation Stimulator",
        "biochemicalTarget": "Increases capillary perfusion around dormant follicles to feed cellular growth."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Invigorating Scalp Cleanse",
        "durationSeconds": 60,
        "instruction": "Lather into wet hair and massage scalp for 60 seconds; feel the gentle refreshing coolness.",
        "proTip": "The 60-second window allows 1,8-cineole to awaken microcapillary flow.",
        "commonMistakeToAvoid": "Rinsing with hot water; cool-lukewarm preserves essential oil benefits."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "bhringraj",
        "partnerName": "Bhringraj",
        "synergyScore": "98/100",
        "combinedBenefit": "Rosemary accelerates scalp blood flow while Bhringraj signals active follicle growth."
      },
      {
        "partnerId": "amla",
        "partnerName": "Amla",
        "synergyScore": "97/100",
        "combinedBenefit": "Nutrient delivery meets root stabilization."
      }
    ],
    "recommendedChips": [
      {
        "id": "rosemary_1",
        "label": "Rosemary Oil for Hair",
        "prompt": "Tell me about Rosemary Leaf Oil in Bhumivera Botanical Shampoo"
      },
      {
        "id": "rosemary_2",
        "label": "Scalp Circulation Guide",
        "prompt": "How does Rosemary Leaf Oil boost scalp circulation and hair growth?"
      }
    ]
  },
  {
    "id": "reetha",
    "indexNumber": 15,
    "storyNumber": "HAIRCARE ACTIVE · 15",
    "isHeroStory": false,
    "name": "Reetha (Soapnut)",
    "fullTitle": "Wild-Harvested Reetha Saponin Extract",
    "latinBinomial": "Sapindus mukorossi",
    "inciName": "Sapindus Mukorossi Fruit Extract",
    "category": "Natural Non-Ionic Cleanser",
    "noteFamily": "Botanical Saponin · Gentle Cleansing",
    "tagline": "Ancient botanical saponin cleanser for clean, bouncy hair.",
    "shortSummary": "Wild-harvested Himalayan soapnut rich in natural non-ionic saponins. Featured in Bhumivera Botanical Shampoo to emulsify excess scalp sebum and environmental residue without stripping the scalps natural moisture barrier.",
    "originRegion": "Himalayan Foothills, Uttarakhand, India",
    "harvestSeason": "Autumn Pod Harvest",
    "extractionMethod": "Cold Ultrasonic Aqueous Extraction",
    "concentrationInFormula": "Active Botanical Saponin Base in Shampoo",
    "optimalPhRange": "5.5 – 6.0",
    "ayurvedicDoshaAffinity": "Tridoshic Cleanser — Non-irritating and gentle",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 0,
    "primaryFocusZone": "Hair strands and scalp surface",
    "primaryClinicalBenefit": "Sulfate-free natural foaming, sebum emulsification, and clean bouncy volume",
    "sensoryProfile": {
      "color": "Warm amber botanical nectar",
      "aroma": "Subtle fruit-vinegar honeyed herbal scent",
      "skinFeel": "Smooth silky slip with clean water rinse"
    },
    "bioactiveCompounds": [
      {
        "compound": "Triterpenoid Saponins",
        "concentration": "Natural Saponin Complex",
        "role": "Non-Ionic Gentle Cleanser",
        "biochemicalTarget": "Emulsifies lipophilic debris without solubilizing vital hair lipid layers."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Gentle Natural Cleansing",
        "durationSeconds": 60,
        "instruction": "Lather Botanical Shampoo thoroughly through wet scalp and hair.",
        "proTip": "Produces a rich, soft natural lather that rinses clean with zero residue.",
        "commonMistakeToAvoid": "Over-washing with harsh chemical sulfates."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "shikakai",
        "partnerName": "Shikakai",
        "synergyScore": "99/100",
        "combinedBenefit": "Classical Ayurvedic shampoo duo: Reetha cleanses while Shikakai conditions and smooths."
      }
    ],
    "recommendedChips": [
      {
        "id": "reetha_1",
        "label": "Reetha in Shampoo",
        "prompt": "Why does Bhumivera use Reetha (Soapnut) instead of sulfates?"
      }
    ]
  },
  {
    "id": "shikakai",
    "indexNumber": 16,
    "storyNumber": "HAIRCARE ACTIVE · 16",
    "isHeroStory": false,
    "name": "Shikakai",
    "fullTitle": "Traditional Shikakai Pod Botanical Extract",
    "latinBinomial": "Acacia concinna",
    "inciName": "Acacia Concinna Fruit Extract",
    "category": "Cuticle-Smoothing Plant Mucilage",
    "noteFamily": "Fruit for Hair · Natural Conditioner",
    "tagline": "Natural botanical conditioner that seals cuticles and unlocks shine.",
    "shortSummary": "Traditional fruit for hair (Acacia concinna) carrying naturally low acidic pH and soothing plant mucilage. Smooths down the hair cuticle, detangles unruly fibers, and imparts high-gloss shine without synthetic silicones.",
    "originRegion": "Tropical Forest Edge, India",
    "harvestSeason": "Dry Season Pod Harvest",
    "extractionMethod": "Gentle Aqueous Phyto-Extraction",
    "concentrationInFormula": "Active Botanical Conditioning Extract in Shampoo",
    "optimalPhRange": "5.5 – 6.0",
    "ayurvedicDoshaAffinity": "Pitta & Kapha Harmonizer — Lowers pH and cools scalp",
    "pregnancyAndNursingSafe": true,
    "comedogenicRating": 0,
    "primaryFocusZone": "Hair cuticle, mid-lengths, and ends",
    "primaryClinicalBenefit": "Smooths down hair cuticles, seals in moisture, and imparts high-gloss shine",
    "sensoryProfile": {
      "color": "Rich reddish-brown botanical extract",
      "aroma": "Earthy tart fruit scent",
      "skinFeel": "Silky, smoothing, and detangling"
    },
    "bioactiveCompounds": [
      {
        "compound": "Acidic Plant Mucilage & Tannins",
        "concentration": "Natural Cuticle Sealer",
        "role": "Cuticle Flattening & Gloss",
        "biochemicalTarget": "Tightens hair keratin scales to reflect light and eliminate frizz."
      }
    ],
    "stepByStepUsageProtocol": [
      {
        "stepNumber": 1,
        "title": "Step 1 · Cuticle Conditioning",
        "durationSeconds": 60,
        "instruction": "Massage lather through mid-lengths and ends before rinsing with cool water.",
        "proTip": "Low acidic pH seals hair scales, making strands silky and tangle-free.",
        "commonMistakeToAvoid": "Using scalding hot water which lifts cuticles."
      }
    ],
    "synergisticPairings": [
      {
        "partnerId": "reetha",
        "partnerName": "Reetha (Soapnut)",
        "synergyScore": "99/100",
        "combinedBenefit": "Reetha provides non-stripping cleanse while Shikakai delivers silky cuticle conditioning."
      },
      {
        "partnerId": "amla",
        "partnerName": "Amla",
        "synergyScore": "98/100",
        "combinedBenefit": "Root nourishment and strand gloss in one unified wash."
      }
    ],
    "recommendedChips": [
      {
        "id": "shika_1",
        "label": "Shikakai Conditioning",
        "prompt": "Tell me about Shikakai in Bhumivera Botanical Shampoo"
      }
    ]
  }
];

export const BHUMIVERA_PRODUCT_CATALOG = [
  {
    productId: 'sb_radiance_face_wash',
    sku: 'BHVM-FW-SB100',
    name: 'Bhumivera Sea Buckthorn Face Wash',
    subtitle: 'Himalayan Omega-7 Berry + 1% Niacinamide + 5% Aloe Vera + 0.5% Hyaluronic Acid',
    volumeMl: 100,
    mrpInr: 649,
    phLevel: '5.2 – 5.5',
    heroStoryIds: ['sea_buckthorn', 'sacred_tulsi'],
    keyActiveIds: [
      'sea_buckthorn',
      'niacinamide',
      'hyaluronic_acid',
      'aloe_vera',
      'vegetable_glycerin',
      'sacred_tulsi',
    ],
    idealFor: 'All Skin Types — Dullness, Barrier Repair, Uneven Tone & Gentle Daily Awakening',
    amPmSchedule: 'Twice Daily · Morning Awakening (7–9 AM) & Evening Refresh',
    clinicalHighlights: [
      'Zero-sulfate, gentle botanical micro-cushion enriched with Himalayan Sea Buckthorn Omega-7',
      '1.0% Niacinamide + 0.5% Biomimetic Hyaluronic Acid for post-rinse barrier hydration',
      'Calibrated at skin-neutral pH 5.5 to protect the acid mantle',
    ],
  },
  {
    productId: 'charcoal_face_wash',
    sku: 'BHVM-FW-CT100',
    name: 'Bhumivera Charcoal Face Wash',
    subtitle: '3% Steam-Activated Bamboo Charcoal + 0.5% Neem + 0.5% Haridra (Turmeric) + 5% Glycerin',
    volumeMl: 100,
    mrpInr: 679,
    phLevel: '5.1 – 5.4',
    heroStoryIds: ['activated_charcoal'],
    keyActiveIds: [
      'activated_charcoal',
      'vegetable_glycerin',
      'neem',
      'haridra',
      'hyaluronic_acid',
      'niacinamide',
    ],
    idealFor: 'Oily, Combination, Congested, Blackhead-Prone & Urban Commuter Skin',
    amPmSchedule: 'Daily Evening Detox (or Twice Daily for Very Oily Skin)',
    clinicalHighlights: [
      'Adsorbs PM2.5 smog particulates, environmental pollutants, and oxidized sebum',
      'Sacred Neem and Haridra (Turmeric) clarify blemishes and soothe irritation',
      '5.0% Botanical Glycerin ensures deep purification with zero post-rinse tightness',
    ],
  },
  {
    productId: 'kumkumadi_night_elixir',
    sku: 'BHVM-EL-KN30',
    name: 'Bhumivera Kumkumadi Night Elixir',
    subtitle: 'Classical 26-Herb Kumkumadi Tailam + Kashmiri Mogra Saffron (Kesar) + Haridra',
    volumeMl: 30,
    mrpInr: 1299,
    phLevel: '5.0 – 5.5',
    heroStoryIds: ['kumkumadi'],
    keyActiveIds: [
      'kumkumadi',
      'kashmiri_saffron',
      'haridra',
    ],
    idealFor: 'Dullness, Dark Spots, Fine Lines, Overnight Rejuvenation & Bridal Glow',
    amPmSchedule: 'Evening Nocturnal Renewal — Press 2–3 drops onto clean, damp face and neck before bedtime',
    clinicalHighlights: [
      'Infused with authentic Grade-1 Kashmiri Mogra Saffron rich in crocin for radiant cell renewal',
      'Crafted via classical 16-hour copper-vessel decoction with 26 Ayurvedic botanicals',
      'Locks in cellular moisture and restores overnight skin bounce and luminous warmth',
    ],
  },
  {
    productId: 'botanical_shampoo',
    sku: 'BHVM-HC-SH200',
    name: 'Bhumivera Botanical Hair Vitality Shampoo',
    subtitle: 'Amla + Reetha + Shikakai + Bhringraj + Rosemary Leaf Oil + Neem',
    volumeMl: 200,
    mrpInr: 599,
    phLevel: '5.5 – 6.0',
    heroStoryIds: ['sea_buckthorn'],
    keyActiveIds: [
      'amla',
      'reetha',
      'shikakai',
      'bhringraj',
      'rosemary',
      'neem',
    ],
    idealFor: 'Hair Fall, Follicular Weakness, Scalp Congestion, Dullness & Daily Hair Vitality',
    amPmSchedule: '2–3 Times Weekly · Gentle scalp massage for 60 seconds before rinsing',
    clinicalHighlights: [
      'Therapeutic Rosemary Leaf Oil stimulates scalp microcirculation to revitalize follicles',
      'Natural Reetha saponins cleanse gently without stripping scalp natural moisture',
      'Classical Bhringraj and Amla fortify hair roots and protect against premature shedding',
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
    title: 'Step 5 of 7 · Follow-up Contact Preference',
    shortTitle: '5. Contact Slot',
    description: 'Choose whether you prefer an email or phone follow-up. Replies are not live and may take some time.',
  },
  {
    step: 6,
    code: 'STEP_6_REVIEW_DOSSIER',
    title: 'Step 6 of 7 · Review Your Verified Follow-up Request',
    shortTitle: '6. Review & Confirm',
    description: 'Verify your complete ticket summary before dispatching to our Senior Client Concierge Desk.',
  },
  {
    step: 7,
    code: 'STEP_7_CONFIRMED_SLA',
    title: 'Step 7 of 7 · Follow-up Request Recorded',
    shortTitle: '7. Confirmed',
    description: 'Your verified request is saved for later review. Replies are not live and may take some time.',
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
    kumkumadi: 2,
    kashmiri_saffron: 2,
    sacred_tulsi: 1,
    aloe_vera: 2,
    niacinamide: 2,
    hyaluronic_acid: 2,
    haridra: 1,
    neem: 1,
  };

  if (answers.sebum_profile === 'oily' || answers.sebum_profile === 'combination') {
    scores.activated_charcoal += 3;
    scores.sacred_tulsi += 2;
    scores.neem += 3;
    scores.niacinamide += 2;
  } else if (answers.sebum_profile === 'dry') {
    scores.sea_buckthorn += 3;
    scores.kumkumadi += 3;
    scores.aloe_vera += 3;
    scores.hyaluronic_acid += 3;
  }

  if (answers.barrier_reactivity === 'high_reactive') {
    scores.aloe_vera += 3;
    scores.sacred_tulsi += 3;
    scores.sea_buckthorn += 2;
  }

  if (answers.pore_congestion === 'blackheads_sebaceous') {
    scores.activated_charcoal += 4;
    scores.neem += 3;
  } else if (answers.pore_congestion === 'inflammatory_breakouts') {
    scores.sacred_tulsi += 4;
    scores.neem += 3;
    scores.haridra += 2;
  }

  if (answers.pigmentation_tone === 'pih_dark_marks' || answers.pigmentation_tone === 'dullness_tan') {
    scores.kumkumadi += 4;
    scores.kashmiri_saffron += 4;
    scores.sea_buckthorn += 3;
    scores.haridra += 3;
  } else if (answers.pigmentation_tone === 'pie_red_marks') {
    scores.sacred_tulsi += 3;
    scores.aloe_vera += 3;
    scores.haridra += 2;
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
      : scores.kumkumadi > scores.sea_buckthorn + 2
      ? BHUMIVERA_PRODUCT_CATALOG[2]
      : BHUMIVERA_PRODUCT_CATALOG[0];

  return {
    topIngredients,
    recommendedProduct,
    amSummary:
      'AM Awakening Ritual (7:00 AM–9:00 AM): 1 pump Sea Buckthorn Face Wash (40s massage + 15s dwell) -> Cool water rinse -> Pat 15% damp -> Damp skin hydration lock -> Broad-Spectrum SPF 50.',
    pmSummary:
      'PM Detox & Renewal Ritual (8:00 PM–10:30 PM): 1.5 pumps Charcoal Face Wash (pollution/SPF detox) -> Lukewarm rinse -> Pat 15% damp -> 2 to 3 drops of Kumkumadi Night Elixir pressed onto face & neck.',
  };
}

export function formatIngredientDeepDiveMarkdown(ing) {
  if (!ing) return '';
  const compoundsList = (ing.bioactiveCompounds || [])
    .map(c => `- **${c.compound} (${c.concentration}):** *${c.role}* — ${c.biochemicalTarget}`)
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
    `**Apothecary Specifications:**\n- **INCI:** \`${ing.inciName}\`\n- **Formulation Role:** ${ing.concentrationInFormula} (Optimal pH ${ing.optimalPhRange})\n- **Origin & Craft:** ${ing.originRegion} · ${ing.extractionMethod}\n- **Ayurvedic Profile:** ${ing.ayurvedicDoshaAffinity} · Comedogenic Rating ${ing.comedogenicRating}/5`,
    `**Key Bioactive Molecules:**\n${compoundsList}`,
    `**Application Steps & Protocol:**\n${usageList}`,
    `**Top Synergistic Pairings:**\n${pairingsList}`,
  ].join('\n\n');
}

export function resolveEnhancedBotanicalConcierge(rawQuery = '') {
  const q = String(rawQuery || '').toLowerCase().trim();

  // 1. Kumkumadi Night Elixir discovery & application
  if (q.includes('kumkumadi') || q.includes('night elixir') || q.includes('kesar oil') || (q.includes('saffron') && q.includes('oil'))) {
    return {
      reply: [
        '**Bhumivera Kumkumadi Night Elixir — Classical 26-Herb Nocturnal Renewal**',
        '*“Overnight golden luminosity steeped in classical Ayurvedic wisdom.”*',
        'Bhumivera Kumkumadi Night Elixir is handcrafted with authentic **Grade-1 Kashmiri Mogra Saffron (Kesar)**, Haridra (Turmeric), Rakta Chandana, and 26 classical Ayurvedic herbs simmered via the traditional Taila Paka Vidhi in copper vessels.',
        '**Key Bio-Actives & Clinical Role:**\n- **Kashmiri Mogra Saffron:** Richest in active crocin to accelerate cellular renewal and fade stubborn dark marks.\n- **Standardized Haridra (Turmeric):** Calms cutaneous micro-inflammation and delivers antioxidant warmth.\n- **Classical Herbal Decoctions:** Replenishes depleted intercellular lipids while you sleep.',
        '**Step-by-Step PM Application Ritual:**\n1. **Cleanse:** Wash face with Sea Buckthorn or Charcoal Face Wash and pat to **15% dampness**.\n2. **Warm:** Dispense **2 to 3 drops** into clean palms and rub palms together to warm the botanical nectar.\n3. **Press:** Gently press warm palms onto cheeks, forehead, chin, and neck using upward pressure.\n4. **Nocturnal Rest:** Leave on overnight during your natural 11 PM–2 AM cellular repair window. Reveal plump, golden luminosity by morning.',
      ].join('\n\n'),
      quickActions: [
        { id: 'kumk_layer', label: 'Layering with Face Wash', prompt: 'How do I layer Kumkumadi Night Elixir with Bhumivera Face Wash?', category: 'post_wash_routine' },
        { id: 'kumk_pair_charcoal', label: 'PM Routine: Charcoal + Kumkumadi', prompt: 'What is the step-by-step evening detox ritual with Charcoal Face Wash?', category: 'post_wash_routine' },
        { id: 'story_03_kumk', label: 'Kumkumadi Story 03', prompt: 'Tell me about Kumkumadi Night Elixir and how to apply it', category: 'ingredient_discovery' },
        { id: 'open_catalog', label: 'Open Botanical Library', prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__', category: 'ingredient_deep_dive' },
      ],
    };
  }

  // 2. Sea Buckthorn Face Wash
  if (
    q.includes('sea buckthorn face wash') &&
    (q.includes('key ingredient') || q.includes('tell me about') || q.includes('all ingredient') || q.includes('active'))
  ) {
    return {
      reply: [
        '**Bhumivera Sea Buckthorn Face Wash — Authentic Botanical & Active Architecture**',
        '*“Himalayan Omega-7 Berry + 1% Niacinamide + 5% Aloe Vera + 0.5% Hyaluronic Acid”*',
        '**The Complete Listed Ingredients:**\n- **Himalayan Sea Buckthorn:** Wild-harvested at 3,500m in Ladakh, nature’s richest source of rare Omega-7 and carotenoids for a zero-strip cleansing cushion.\n- **1.0% Niacinamide (Vitamin B3):** Enhances ceramide synthesis, refines enlarged pores, and balances oil.\n- **5.0% Pure Aloe Vera:** Cold-stabilized inner-fillet juice that cools redness and hydrates delicate skin.\n- **0.5% Biomimetic Hyaluronic Acid:** Binds water molecules to prevent post-rinse dryness.\n- **4.0% Botanical Glycerin:** Core plant humectant locking in suppleness.\n- **Sacred Tulsi (Holy Basil):** Adaptogenic shield defending the skin microbiome against urban stress.',
        'Formulated at physiological **pH 5.5**, sulfate-free, non-comedogenic, and dermatologically tested for all skin types.',
      ].join('\n\n'),
      quickActions: [
        { id: 'layer_guide', label: 'Post-Wash Layering Guide', prompt: 'What skincare products should I apply right after using Sea Buckthorn Face Wash?', category: 'post_wash_routine' },
        { id: 'kumk_pair', label: 'Pair with Kumkumadi Night Elixir', prompt: 'How do I pair Sea Buckthorn Face Wash with Bhumivera Kumkumadi Night Elixir?', category: 'product_pairing' },
        { id: 'sb_ritual', label: 'Facial Ritual Player (4 Phases)', prompt: '__OPEN_RITUAL_PLAYER__', category: 'usage_and_timing' },
        { id: 'sb_story', label: 'Story 01 · Sea Buckthorn', prompt: 'Tell me the full Ingredient Story 01 for Sea Buckthorn and its cellular steps', category: 'ingredient_discovery' },
      ],
    };
  }

  // 3. Charcoal Face Wash
  if (q.includes('charcoal face wash') || (q.includes('charcoal') && (q.includes('wash') || q.includes('cleanser') || q.includes('pore')))) {
    return {
      reply: [
        '**Bhumivera Charcoal Face Wash — Elemental Pore Detox & Pollution Defense**',
        '*“3% Steam-Activated Bamboo Charcoal + 0.5% Neem + 0.5% Haridra (Turmeric) + 5% Glycerin”*',
        '**The Complete Listed Ingredients:**\n- **3.0% Steam-Activated Bamboo Charcoal:** Micro-porous carbon matrix that adsorbs PM2.5 smog particulates, excess sebum, and trapped impurities without scratching.\n- **0.5% Sacred Neem (Nimba):** Classical Ayurvedic purifier that soothes redness and curbs blemish-causing microbes.\n- **0.5% Haridra (Turmeric):** Standardized curcuminoid extract for antioxidant clarity and fading dark marks.\n- **5.0% Botanical Glycerin & Hyaluronic Acid:** Cushions the deep cleanse so pores are purified with zero tightness.',
        '**Best Usage:** Ideal for your daily **Evening Detox Ritual** to remove sunscreen, sweat, and city pollution.',
      ].join('\n\n'),
      quickActions: [
        { id: 'char_pm', label: 'PM Detox Ritual Guide', prompt: 'What is the step-by-step evening detox ritual with Charcoal Face Wash?', category: 'post_wash_routine' },
        { id: 'char_kumk', label: 'Pair with Kumkumadi Night Elixir', prompt: 'How does Charcoal Face Wash pair with Kumkumadi Night Elixir?', category: 'product_pairing' },
        { id: 'char_story', label: 'Story 02 · Charcoal', prompt: 'Tell me the full Ingredient Story 02 for Charcoal and how it purifies pores', category: 'ingredient_discovery' },
      ],
    };
  }

  // 4. Botanical Shampoo
  if (q.includes('shampoo') || q.includes('haircare') || q.includes('hair vitality') || q.includes('hair fall')) {
    return {
      reply: [
        '**Bhumivera Botanical Hair Vitality Shampoo — Ayurvedic Root & Follicle Rasayana**',
        '*“Amla + Reetha + Shikakai + Bhringraj + Rosemary Leaf Oil + Neem”*',
        '**Key Listed Actives & Benefits:**\n- **Therapeutic Rosemary Leaf Oil:** Stimulates scalp microcapillary perfusion, delivering oxygen directly to hair follicles.\n- **Classical Bhringraj (King of Hair):** Encourages follicles into active growth (anagen) phase and reduces hair shedding.\n- **Amla (Indian Gooseberry):** Packed with bioavailable Vitamin C and tannins that strengthen keratin protein bonds.\n- **Wild Reetha (Soapnut) & Shikakai:** Natural non-ionic saponins that cleanse excess scalp oil while smoothing hair cuticles with zero synthetic sulfates.',
      ].join('\n\n'),
      quickActions: [
        { id: 'shamp_use', label: 'How to Use Botanical Shampoo', prompt: 'How do I use Bhumivera Botanical Shampoo for maximum hair strength?' },
        { id: 'shamp_rosemary', label: 'Rosemary Oil in Shampoo', prompt: 'Tell me about Rosemary Leaf Oil in Bhumivera Botanical Shampoo' },
        { id: 'shamp_bhring', label: 'Bhringraj Science', prompt: 'Tell me about Bhringraj in Bhumivera Botanical Shampoo' },
      ],
    };
  }

  // 5. Layering & Ritual Guide
  if (
    q.includes('layering') ||
    q.includes('step-by-step') ||
    q.includes('what time of day') ||
    q.includes('routine') ||
    q.includes('how do i really use') ||
    q.includes('ritual')
  ) {
    return {
      reply: [
        '**The Bhumivera Chronobiological Skincare & Layering Protocol**',
        '**1. Morning Awakening Ritual (7:00 AM – 9:00 AM):**\n- **Step 1:** Splash face with lukewarm water (28°C–32°C).\n- **Step 2:** Dispense **1 pump** of **Sea Buckthorn Face Wash** into wet palms and aerate into a silky micro-cushion (10s).\n- **Step 3:** Massage upward for 40 seconds across T-zone and cheeks, then allow a **15-second phyto-dwell pause**.\n- **Step 4:** Rinse with cool water and pat to **15% dampness**.\n- **Step 5 (Layering):** Seal moisture within 60 seconds with your hydration barrier product, followed by broad-spectrum SPF.',
        '**2. Evening Detox & Overnight Renewal Ritual (8:00 PM – 10:30 PM):**\n- **Step 1:** Dispense **1.5 pumps** of **Charcoal Face Wash** into wet palms to draw out PM2.5 smog, sunscreen, and excess sebum.\n- **Step 2:** Rinse with lukewarm water and pat to **15% dampness**.\n- **Step 3 (Layering):** Warm **2 to 3 drops** of **Kumkumadi Night Elixir** between clean palms and gently press onto face and neck before sleep for overnight golden luminosity.',
      ].join('\n\n'),
      quickActions: [
        { id: 'open_timer', label: 'Launch 4-Phase Ritual Player', prompt: '__OPEN_RITUAL_PLAYER__', category: 'post_wash_routine' },
        { id: 'know_kumkumadi', label: 'Kumkumadi Night Elixir Guide', prompt: 'Tell me about Kumkumadi Night Elixir and how to apply it', category: 'product_discovery' },
        { id: 'open_quiz', label: 'Take Personalized Skin Quiz', prompt: '__OPEN_SKIN_DIAGNOSTIC__', category: 'skin_compatibility' },
        { id: 'open_catalog', label: 'Open Botanical Library', prompt: '__OPEN_INGREDIENT_ENCYCLOPEDIA__', category: 'ingredient_deep_dive' },
      ],
    };
  }

  // 6. Check single or paired ingredient queries from encyclopedia
  const matchedIngredients = BOTANICAL_INGREDIENT_ENCYCLOPEDIA.filter(ing => {
    const terms = [
      ing.id.replace(/_/g, ' '),
      ing.name.toLowerCase(),
      ing.latinBinomial.toLowerCase().split(' ')[0],
    ];
    if (ing.id === 'sea_buckthorn') terms.push('sea buckthorn', 'seabuckthorn', 'omega-7', 'omega 7', 'story 01');
    if (ing.id === 'activated_charcoal') terms.push('charcoal', 'bamboo charcoal', 'story 02');
    if (ing.id === 'kumkumadi') terms.push('kumkumadi', 'kumkumadi oil', 'night elixir', 'tailam', 'story 03');
    if (ing.id === 'kashmiri_saffron') terms.push('saffron', 'kesar', 'crocin', 'mogra saffron');
    if (ing.id === 'sacred_tulsi') terms.push('tulsi', 'holy basil', 'ocimum');
    if (ing.id === 'aloe_vera') terms.push('aloe', 'aloe vera', 'acemannan');
    if (ing.id === 'niacinamide') terms.push('niacinamide', 'vitamin b3', 'nicotinamide');
    if (ing.id === 'hyaluronic_acid') terms.push('hyaluronic', 'sodium hyaluronate');
    if (ing.id === 'vegetable_glycerin') terms.push('glycerin', 'glycerine', 'botanical glycerin');
    if (ing.id === 'neem') terms.push('neem', 'nimba', 'azadirachta');
    if (ing.id === 'haridra') terms.push('turmeric', 'haridra', 'curcumin', 'haldi');
    if (ing.id === 'amla') terms.push('amla', 'amalaki', 'gooseberry');
    if (ing.id === 'bhringraj') terms.push('bhringraj', 'keshraj', 'eclipta');
    if (ing.id === 'rosemary') terms.push('rosemary', 'rosemary oil');
    if (ing.id === 'reetha') terms.push('reetha', 'soapnut', 'sapindus');
    if (ing.id === 'shikakai') terms.push('shikakai', 'acacia concinna');
    return terms.some(t => t && q.includes(t));
  });

  if (matchedIngredients.length >= 2 && (q.includes('with') || q.includes('vs') || q.includes('compare') || q.includes('together') || q.includes('pair'))) {
    const [ingA, ingB] = matchedIngredients;
    return {
      reply: [
        `**Botanical & Active Synergy: ${ingA.name} + ${ingB.name}**`,
        `- **${ingA.name} (${ingA.storyNumber}):** Focuses on **${ingA.primaryClinicalBenefit.toLowerCase()}** in ${ingA.concentrationInFormula}.\n- **${ingB.name} (${ingB.storyNumber}):** Focuses on **${ingB.primaryClinicalBenefit.toLowerCase()}** in ${ingB.concentrationInFormula}.`,
        `**How to Layer Them in Your Routine:**\n1. **Morning Protocol:** Use ${ingA.name} during your daytime cleanse/prep to shield against photo-oxidative stress.\n2. **Evening Protocol:** Apply ${ingB.name} as your nocturnal treatment to support lipid barrier restoration.\n3. **Application Rule:** Always apply on **15% damp skin** within 60 seconds of cleansing for optimal moisture retention.`,
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

  // 7. Client-side fallback utility
  try {
    const fallback = resolveClientSideConciergeFallback(rawQuery);
    if (fallback && fallback.reply) {
      return fallback;
    }
  } catch {}

  // 8. General authentic welcome
  return {
    reply: [
      '**Welcome to the Bhumivera Client Concierge.**',
      'I can guide you through our **authentic botanical catalog** (featuring *Sea Buckthorn Face Wash*, *Charcoal Face Wash*, *Kumkumadi Night Elixir*, and *Botanical Shampoo*), our **4-Phase Facial Cleansing Ritual**, our **Personalized Skin Quiz**, or real-time **Order Tracking & Account Details**.',
      'Select any option below or enter your question or Order ID.',
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


const INGREDIENT_PATHWAY_GROUPS = [
  { id: 'ALL', label: 'All Catalog Actives (16)', icon: '✦' },
  { id: 'HERO', label: '👑 4 Hero Formulations', icon: '👑' },
  { id: 'BARRIER', label: '✨ Barrier & Radiance', icon: '✨' },
  { id: 'CLARIFY', label: '🌿 Pores & Clarifying', icon: '🌿' },
  { id: 'HAIR', label: '💆 Haircare Rasayanas', icon: '💆' },
];

const FOUR_CORE_RITUAL_PHASES = [
  {
    phaseId: 1,
    phaseNumber: 'PHASE 01',
    title: 'Thermal Water Prep & Apothecary Dosing',
    durationTotal: 30,
    stepsCovered: [1, 2, 3],
    temperature: '28°C–32°C Lukewarm',
    dosage: '1 to 1.5 Pumps',
    headline: 'Prime corneal hydration & calibrate bio-actives without melting epidermal ceramides',
    instruction: 'Wash hands for 15s to clear phone/keyboard oils. Splash face 5 times with lukewarm (28°C–32°C) water. Dispense 1 pump for AM refresh, or 1.5 pumps for PM sunscreen & pollution detox.',
    proTip: 'Water above 38°C dissolves skin lipids and worsens redness; keep it skin-neutral lukewarm.',
    avoid: 'Pumping face wash onto dry hands or washing under a steaming hot shower head.',
    actives: ['Sea Buckthorn', 'Aloe Vera', 'Neem Leaf', 'Botanical Glycerin'],
  },
  {
    phaseId: 2,
    phaseNumber: 'PHASE 02',
    title: 'Palm Micro-Foam Activation',
    durationTotal: 10,
    stepsCovered: [4],
    temperature: 'Lukewarm Damp Palms',
    dosage: 'Micro-Foam Cushion',
    headline: 'Aerate amphiphilic micelles into a dense, velvety cushion to eliminate skin friction',
    instruction: 'Rub wet palms together vigorously in brisk circles for 10 seconds. Aerate the concentrated gel into a cushiony micro-foam BEFORE touching your face.',
    proTip: 'Pre-forming foam in your palms liberates Sea Buckthorn Omega-7 and micro-charcoal while reducing friction on facial capillaries.',
    avoid: 'Slapping raw, un-lathered gel onto dry cheeks and scrubbing mechanically.',
    actives: ['Sea Buckthorn (Omega-7)', 'Activated Bamboo Charcoal', 'Aloe Vera Polysaccharides'],
  },
  {
    phaseId: 3,
    phaseNumber: 'PHASE 03',
    title: '40s Zonal Ayurvedic Sculpt Massage & Phyto-Dwell',
    durationTotal: 55,
    stepsCovered: [5, 6, 7, 8, 9],
    temperature: 'Skin-Warm',
    dosage: 'Zone-by-Zone Application',
    headline: 'Target sebaceous zones, sculpt facial contours, and allow 15s bio-active partition',
    instruction: '1) T-Zone & Nose: small circles around nostrils and chin crease (15s). 2) Cheeks: upward lifting sweeps toward cheekbones (10s). 3) Jaw & Neck: drainage sweeps along jawline to lymph nodes (10s). 4) Pause 15s for the Phyto-Active Dwell so Niacinamide and Botanical Actives penetrate.',
    proTip: 'The 15-second dwell window is where therapeutic botanicals bind to receptors; do not rush to wash off immediately.',
    avoid: 'Aggressive scrubbing around the delicate orbital eye contour.',
    actives: ['1% Niacinamide', 'Haridra (Turmeric)', 'Sacred Tulsi Ursolic Acid'],
  },
  {
    phaseId: 4,
    phaseNumber: 'PHASE 04',
    title: 'Cool-Water Rinse & 60-Second Barrier Lock',
    durationTotal: 25,
    stepsCovered: [10, 11, 12],
    temperature: '22°C–25°C Cool Water',
    dosage: 'Damp Skin Seal',
    headline: 'Flush dissolved debris, pat to 15% surface moisture, and lock hydration within 60 seconds',
    instruction: 'Rinse with 10 gentle splashes of cool water (22°C–25°C) to close pore openings. Gently press (never rub) with a clean microfiber towel, leaving skin 15% damp. Within 60 seconds, warm 2 to 3 drops of Kumkumadi Night Elixir between palms and gently press onto face and neck.',
    proTip: 'Sealing moisturizer or botanical elixir while skin is still slightly damp locks in 40% more hydration.',
    avoid: 'Vigorously rubbing face with a rough bathroom towel until bone-dry.',
    actives: ['Biomimetic Hyaluronic Acid', 'Botanical Glycerin', 'Kumkumadi Night Elixir'],
  },
];

function PhaseVisualClip({ phaseId, isDark }) {
  if (phaseId === 1) {
    return (
      <div className={`relative w-full h-28 rounded-2xl overflow-hidden border flex items-center justify-center p-2 transition-all ${
        isDark ? 'bg-gradient-to-br from-[#071610] to-[#0d281c] border-[#D4AF37]/30' : 'bg-gradient-to-br from-[#faf7ee] to-[#f2ede0] border-[#D4AF37]/40 shadow-inner'
      }`}>
        <svg viewBox="0 0 320 110" className="w-full h-full max-w-[280px]">
          <defs>
            <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D061" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
          <rect x="25" y="20" width="14" height="60" rx="7" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />
          <rect x="27" y="42" width="10" height="38" rx="5" fill="#10B981" />
          <circle cx="32" cy="80" r="9" fill="#10B981" />
          <text x="48" y="48" fill="#D4AF37" fontSize="10" fontWeight="bold">28°C–32°C</text>
          <text x="48" y="60" fill={isDark ? "#A8A29E" : "#57534E"} fontSize="8">Thermal Lukewarm</text>

          <rect x="165" y="15" width="24" height="40" rx="4" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
          <rect x="171" y="8" width="12" height="7" fill="#D4AF37" />
          <line x1="165" y1="12" x2="155" y2="12" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
          
          <circle cx="155" cy="22" r="3.5" fill="url(#goldGrad1)">
            <animate attributeName="cy" values="18;72;72" dur="2s" repeatCount="indefinite" keyTimes="0;0.6;1" />
            <animate attributeName="opacity" values="1;0;0" dur="2s" repeatCount="indefinite" keyTimes="0;0.6;1" />
          </circle>

          <path d="M 120 80 Q 155 96 190 80 Q 210 85 220 78" fill="none" stroke={isDark ? "#E7E5E4" : "#1C1917"} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 128 82 Q 155 92 182 82" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="d" values="M 128 82 Q 155 92 182 82; M 128 80 Q 155 88 182 80; M 128 82 Q 155 92 182 82" dur="2s" repeatCount="indefinite" />
          </path>
          
          <rect x="230" y="38" width="75" height="28" rx="6" fill={isDark ? "#0B2419" : "#FFFFFF"} stroke="#D4AF37" strokeWidth="1" />
          <text x="267" y="50" fill="#D4AF37" fontSize="8" fontWeight="bold" textAnchor="middle">1–1.5 PUMPS</text>
          <text x="267" y="60" fill={isDark ? "#A8A29E" : "#57534E"} fontSize="7" textAnchor="middle">Wet Hands</text>
        </svg>
      </div>
    );
  }

  if (phaseId === 2) {
    return (
      <div className={`relative w-full h-28 rounded-2xl overflow-hidden border flex items-center justify-center p-2 transition-all ${
        isDark ? 'bg-gradient-to-br from-[#071610] to-[#0d281c] border-[#D4AF37]/30' : 'bg-gradient-to-br from-[#faf7ee] to-[#f2ede0] border-[#D4AF37]/40 shadow-inner'
      }`}>
        <svg viewBox="0 0 320 110" className="w-full h-full max-w-[280px]">
          <defs>
            <linearGradient id="foamGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F5D061" />
            </linearGradient>
          </defs>
          <ellipse cx="115" cy="55" rx="32" ry="22" fill="none" stroke="#D4AF37" strokeWidth="1.5" transform="rotate(-15 115 55)">
            <animateTransform attributeName="transform" type="rotate" values="-15 115 55; -5 115 55; -15 115 55" dur="1.2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="155" cy="55" rx="32" ry="22" fill="none" stroke="#D4AF37" strokeWidth="1.5" transform="rotate(15 155 55)">
            <animateTransform attributeName="transform" type="rotate" values="15 155 55; 5 155 55; 15 155 55" dur="1.2s" repeatCount="indefinite" />
          </ellipse>

          <circle cx="135" cy="50" r="9" fill="url(#foamGrad2)" opacity="0.9">
            <animate attributeName="r" values="7;11;7" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="125" cy="62" r="6" fill="url(#foamGrad2)" opacity="0.8">
            <animate attributeName="r" values="5;8;5" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="145" cy="60" r="7" fill="url(#foamGrad2)" opacity="0.85">
            <animate attributeName="r" values="6;9;6" dur="1.2s" repeatCount="indefinite" />
          </circle>

          <text x="240" y="50" fill="#D4AF37" fontSize="10" fontWeight="bold">10 SECONDS</text>
          <text x="240" y="62" fill={isDark ? "#A8A29E" : "#57534E"} fontSize="8">Aerated Micro-Cushion</text>
          <text x="240" y="72" fill="#10B981" fontSize="7" fontWeight="bold">Zero Friction on Cheeks</text>
        </svg>
      </div>
    );
  }

  if (phaseId === 3) {
    return (
      <div className={`relative w-full h-28 rounded-2xl overflow-hidden border flex items-center justify-center p-2 transition-all ${
        isDark ? 'bg-gradient-to-br from-[#071610] to-[#0d281c] border-[#D4AF37]/30' : 'bg-gradient-to-br from-[#faf7ee] to-[#f2ede0] border-[#D4AF37]/40 shadow-inner'
      }`}>
        <svg viewBox="0 0 320 110" className="w-full h-full max-w-[280px]">
          <defs>
            <radialGradient id="dwellAura3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F5D061" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M 85 20 C 68 20 58 48 58 68 C 58 86 75 98 85 98 C 95 98 112 86 112 68 C 112 48 102 20 85 20 Z" 
                fill="none" stroke="#D4AF37" strokeWidth="1.5" />
          
          <circle cx="85" cy="58" r="38" fill="url(#dwellAura3)">
            <animate attributeName="r" values="32;42;32" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
          </circle>

          <path d="M 72 68 Q 68 52 78 42" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 98 68 Q 102 52 92 42" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
          
          <circle cx="85" cy="38" r="6" fill="none" stroke="#60A5FA" strokeWidth="1.2" strokeDasharray="2 2">
            <animateTransform attributeName="transform" type="rotate" values="0 85 38; 360 85 38" dur="3s" repeatCount="indefinite" />
          </circle>

          <g transform="translate(140, 22)">
            <circle cx="6" cy="10" r="3" fill="#60A5FA" />
            <text x="14" y="13" fill={isDark ? "#E7E5E4" : "#1C1917"} fontSize="8" fontWeight="bold">15s T-Zone Decongestion</text>

            <circle cx="6" cy="26" r="3" fill="#10B981" />
            <text x="14" y="29" fill={isDark ? "#E7E5E4" : "#1C1917"} fontSize="8" fontWeight="bold">15s Upward Cheek Lift</text>

            <circle cx="6" cy="42" r="3" fill="#F5D061" />
            <text x="14" y="45" fill={isDark ? "#E7E5E4" : "#1C1917"} fontSize="8" fontWeight="bold">10s Jawline Lymph Drainage</text>

            <rect x="0" y="52" width="145" height="18" rx="4" fill={isDark ? "#0B2419" : "#FFFFFF"} stroke="#D4AF37" strokeWidth="1" />
            <text x="72" y="64" fill="#D4AF37" fontSize="8" fontWeight="bold" textAnchor="middle">✦ 15s Active Botanical Dwell</text>
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-28 rounded-2xl overflow-hidden border flex items-center justify-center p-2 transition-all ${
      isDark ? 'bg-gradient-to-br from-[#071610] to-[#0d281c] border-[#D4AF37]/30' : 'bg-gradient-to-br from-[#faf7ee] to-[#f2ede0] border-[#D4AF37]/40 shadow-inner'
    }`}>
      <svg viewBox="0 0 320 110" className="w-full h-full max-w-[280px]">
        <defs>
          <linearGradient id="shieldGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <circle cx="55" cy="32" r="3.5" fill="#60A5FA" opacity="0.8">
          <animate attributeName="cy" values="22;52;22" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="42" cy="46" r="3" fill="#60A5FA" opacity="0.7">
          <animate attributeName="cy" values="36;64;36" dur="2.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="68" cy="50" r="3.2" fill="#60A5FA" opacity="0.85">
          <animate attributeName="cy" values="40;70;40" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <text x="55" y="82" fill="#60A5FA" fontSize="8" fontWeight="bold" textAnchor="middle">22°C–25°C Cool</text>
        <text x="55" y="92" fill={isDark ? "#A8A29E" : "#57534E"} fontSize="7" textAnchor="middle">10 Gentle Splashes</text>

        <polygon points="140,22 176,22 194,52 176,82 140,82 122,52" fill="url(#shieldGrad4)" stroke="#D4AF37" strokeWidth="1.5">
          <animate attributeName="strokeWidth" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" />
        </polygon>
        <path d="M 148 52 L 156 60 L 170 44" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="158" y="72" fill="#D4AF37" fontSize="8" fontWeight="bold" textAnchor="middle">BARRIER LOCK</text>

        <circle cx="245" cy="50" r="22" fill="none" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} strokeWidth="3" />
        <circle cx="245" cy="50" r="22" fill="none" stroke="#D4AF37" strokeWidth="3" strokeDasharray="140" strokeDashoffset="35">
          <animate attributeName="strokeDashoffset" values="140;0" dur="4s" repeatCount="indefinite" />
        </circle>
        <text x="245" y="48" fill="#D4AF37" fontSize="10" fontWeight="bold" textAnchor="middle">60s</text>
        <text x="245" y="58" fill={isDark ? "#E7E5E4" : "#1C1917"} fontSize="7" fontWeight="semibold" textAnchor="middle">Damp Skin</text>
        <text x="245" y="84" fill="#10B981" fontSize="8" fontWeight="bold" textAnchor="middle">+40% Retention</text>
      </svg>
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
  const [pathwayFilter, setPathwayFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('story');
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
      BOTANICAL_INGREDIENT_ENCYCLOPEDIA[6]
    );
  }, [comparePartnerId]);

  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return BOTANICAL_INGREDIENT_ENCYCLOPEDIA.filter(item => {
      if (pathwayFilter === 'HERO' && !item.isHeroStory) return false;
      if (pathwayFilter === 'BARRIER') {
        const isB = ['sea_buckthorn', 'kumkumadi', 'kashmiri_saffron', 'niacinamide', 'hyaluronic_acid', 'vegetable_glycerin', 'aloe_vera'].includes(item.id);
        if (!isB) return false;
      }
      if (pathwayFilter === 'CLARIFY') {
        const isC = ['activated_charcoal', 'neem', 'haridra', 'sacred_tulsi'].includes(item.id);
        if (!isC) return false;
      }
      if (pathwayFilter === 'HAIR') {
        const isH = ['amla', 'bhringraj', 'rosemary', 'reetha', 'shikakai', 'neem'].includes(item.id);
        if (!isH) return false;
      }

      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.fullTitle.toLowerCase().includes(q) ||
        item.latinBinomial.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.primaryClinicalBenefit.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, pathwayFilter]);

  if (!isOpen) return null;

  return (
    <div
      className={`px-4 py-3.5 border-b space-y-3.5 text-xs shrink-0 max-h-[460px] overflow-y-auto ${
        isDark
          ? 'bg-[#081a13] border-[#D4AF37]/35 text-stone-100'
          : 'bg-[#faf8f2] border-[#D4AF37]/45 text-[#0B2419]'
      }`}
    >
      <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-current/10">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" /> Botanical Apothecary & Bio-Actives
          </div>
          <h3 className="font-serif text-sm font-semibold mt-0.5 tracking-wide">
            Curated Portfolio · 4 Hero Formulations & Listed Catalog Actives
          </h3>
          <p className="text-[11px] opacity-75 mt-0.5">
            Select an active or search by skin concern to inspect cellular mechanisms and synergistic pairings.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 px-2.5 py-1 rounded-xl border border-current/20 text-[11px] font-medium opacity-80 hover:opacity-100 hover:border-[#D4AF37] transition-colors"
        >
          Close ✕
        </button>
      </div>

      {(pathwayFilter === 'ALL' || pathwayFilter === 'HERO') && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
            <span>👑 4 Ayurvedic Hero Formulations</span>
            <span className="text-[9px] font-normal opacity-70">Core Website Catalog</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {HERO_INGREDIENT_STORIES.map(story => {
              const isSelected = selectedIngredient?.id === story.ingredientId;
              return (
                <button
                  key={story.storyCode}
                  type="button"
                  onClick={() => onSelectIngredient(story.ingredientId)}
                  className={`text-left p-3 rounded-2xl border transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#0B2419] text-[#FDFBF7] border-[#D4AF37] shadow-lg ring-1 ring-[#D4AF37]/50'
                      : isDark
                      ? 'bg-black/30 border-white/10 hover:border-[#D4AF37]/60'
                      : 'bg-white border-[#0B2419]/15 hover:border-[#D4AF37] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">
                      {story.storyCode}
                    </span>
                    {isSelected && <span className="text-[10px] text-[#D4AF37]">● Active</span>}
                  </div>
                  <div className="font-serif font-semibold text-xs mt-0.5 tracking-wide">{story.title}</div>
                  <p className="text-[10px] opacity-80 line-clamp-2 mt-0.5 leading-snug">{story.tagline}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <div className="text-[10px] font-semibold opacity-80">Filter by Formulation Category:</div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {INGREDIENT_PATHWAY_GROUPS.map(mode => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setPathwayFilter(mode.id)}
              className={`shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-semibold border transition-all ${
                pathwayFilter === mode.id
                  ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37] shadow-sm'
                  : 'border-current/15 opacity-75 hover:opacity-100 hover:border-current/30'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search catalog actives (e.g., Sea Buckthorn, Kumkumadi, Charcoal, Niacinamide)…"
          className={`w-full px-3 py-2 rounded-xl border text-[11px] outline-none transition-colors ${
            isDark
              ? 'bg-black/35 border-white/15 text-white placeholder:text-stone-400 focus:border-[#D4AF37]'
              : 'bg-white border-stone-300 text-[#0B2419] placeholder:text-stone-400 focus:border-[#0B2419]'
          }`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-2 text-[11px] opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {filteredList.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectIngredient(item.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all ${
              selectedIngredient?.id === item.id
                ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37] shadow-sm font-bold'
                : isDark
                ? 'bg-black/25 border-white/10 opacity-80 hover:opacity-100 hover:border-[#D4AF37]/50'
                : 'bg-white border-stone-200 opacity-85 hover:opacity-100 hover:border-[#0B2419]'
            }`}
          >
            {item.indexNumber}. {item.name}
          </button>
        ))}
        {filteredList.length === 0 && (
          <p className="text-[11px] opacity-70 italic py-1">No ingredients match “{searchQuery}”.</p>
        )}
      </div>

      {selectedIngredient && (
        <div
          className={`rounded-2xl border p-3.5 space-y-3 ${
            isDark ? 'bg-[#071510] border-white/15 shadow-inner' : 'bg-white border-[#0B2419]/15 shadow-sm'
          }`}
        >
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-current/10">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">
                {selectedIngredient.storyNumber} · {selectedIngredient.category}
              </span>
              <h4 className="font-serif text-sm font-bold mt-0.5 tracking-wide">
                {selectedIngredient.fullTitle}
              </h4>
              <p className="text-[10px] italic opacity-75">
                {selectedIngredient.latinBinomial} · INCI: {selectedIngredient.inciName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAskConciergeAbout(`Tell me about ${selectedIngredient.name} and how it fits into my daily facial ritual`)}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold hover:bg-[#143928] transition-colors"
            >
              Ask Concierge 💬
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1 border-b border-current/10 pb-2">
            {[
              { id: 'story', label: '1. Overview' },
              { id: 'molecules', label: '2. Molecules' },
              { id: 'protocol', label: '3. Layering' },
              { id: 'compare', label: '4. Pairings' },
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`py-1 rounded-lg text-[10px] font-semibold text-center transition ${
                  activeTab === t.id
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 font-bold'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'story' && (
            <div className="space-y-2 text-[11px]">
              <p className="font-serif italic text-[#D4AF37]">“{selectedIngredient.tagline}”</p>
              <p className="leading-relaxed opacity-90">{selectedIngredient.shortSummary}</p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                <div className="p-2.5 rounded-xl bg-current/5">
                  <div className="font-bold opacity-70 uppercase tracking-wider text-[9px]">Dosing / Role</div>
                  <div className="font-semibold mt-0.5">{selectedIngredient.concentrationInFormula}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-current/5">
                  <div className="font-bold opacity-70 uppercase tracking-wider text-[9px]">Optimal pH</div>
                  <div className="font-semibold mt-0.5">{selectedIngredient.optimalPhRange}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-current/5">
                  <div className="font-bold opacity-70 uppercase tracking-wider text-[9px]">Origin</div>
                  <div className="font-semibold mt-0.5">{selectedIngredient.originRegion}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-current/5">
                  <div className="font-bold opacity-70 uppercase tracking-wider text-[9px]">Extraction</div>
                  <div className="font-semibold mt-0.5">{selectedIngredient.extractionMethod}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'molecules' && (
            <div className="space-y-2 text-[11px]">
              <div className="text-[10px] opacity-75 font-semibold">Active Molecular Profile & Targets:</div>
              {(selectedIngredient.bioactiveCompounds || []).map((c, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-current/5 space-y-0.5">
                  <div className="font-bold text-[#D4AF37]">
                    {idx + 1}. {c.compound} ({c.concentration})
                  </div>
                  <div className="text-[10px] font-semibold opacity-90">{c.role}</div>
                  <div className="text-[10px] opacity-75">Target: {c.biochemicalTarget}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'protocol' && (
            <div className="space-y-2 text-[11px]">
              <div className="text-[10px] opacity-75 font-semibold">Ayurvedic & Clinical Application Steps:</div>
              {(selectedIngredient.stepByStepUsageProtocol || []).map(u => (
                <div key={u.stepNumber} className="p-2.5 rounded-xl bg-current/5 space-y-0.5">
                  <div className="font-bold text-[#D4AF37]">
                    {u.title} ({u.durationSeconds}s)
                  </div>
                  <div className="text-[10px] opacity-90">{u.instruction}</div>
                  <div className="text-[10px] text-emerald-500 font-medium">✓ Pro-Tip: {u.proTip}</div>
                  <div className="text-[10px] text-rose-400 font-medium">✕ Avoid: {u.commonMistakeToAvoid}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="space-y-2.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold">Pair {selectedIngredient.name} with:</span>
                <select
                  value={comparePartnerId}
                  onChange={e => setComparePartnerId(e.target.value)}
                  className={`flex-1 px-2.5 py-1.5 rounded-xl border text-[10px] outline-none ${
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
                <div className="p-2.5 rounded-xl bg-current/5 space-y-1">
                  <div className="font-bold text-[#D4AF37]">{selectedIngredient.name}</div>
                  <div><strong>Role:</strong> {selectedIngredient.concentrationInFormula}</div>
                  <div><strong>Focus:</strong> {selectedIngredient.primaryClinicalBenefit}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-current/5 space-y-1">
                  <div className="font-bold text-emerald-400">{comparePartner.name}</div>
                  <div><strong>Role:</strong> {comparePartner.concentrationInFormula}</div>
                  <div><strong>Focus:</strong> {comparePartner.primaryClinicalBenefit}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onAskConciergeAbout(`Compare ${selectedIngredient.name} with ${comparePartner.name} and how to layer them together in my daily routine`)
                }
                className="w-full py-2 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-bold text-[10px] hover:bg-[#D4AF37]/30 transition-colors"
              >
                Generate Synergistic Layering Sequence in Chat ✦
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MasterRitualPlayerDrawer({ isOpen, onClose, isDark, onSendSummaryToChat }) {
  const [viewMode, setViewMode] = useState('four_phase');
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showVisualDemo, setShowVisualDemo] = useState(true);

  const currentPhase = FOUR_CORE_RITUAL_PHASES[activePhaseIdx] || FOUR_CORE_RITUAL_PHASES[0];
  const currentStep = MASTER_SKINCARE_RITUAL_STEPS[activeStepIdx] || MASTER_SKINCARE_RITUAL_STEPS[0];

  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(currentPhase.durationTotal);
  const [stepSecondsLeft, setStepSecondsLeft] = useState(currentStep.durationSeconds);

  useEffect(() => {
    setPhaseSecondsLeft(currentPhase.durationTotal);
    setTimerRunning(false);
  }, [activePhaseIdx, currentPhase.durationTotal]);

  useEffect(() => {
    setStepSecondsLeft(currentStep.durationSeconds);
    setTimerRunning(false);
  }, [activeStepIdx, currentStep.durationSeconds]);

  useEffect(() => {
    if (!timerRunning || !isOpen) return undefined;
    const interval = window.setInterval(() => {
      if (viewMode === 'four_phase') {
        setPhaseSecondsLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setStepSecondsLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, isOpen, viewMode]);

  if (!isOpen) return null;

  return (
    <div
      className={`px-4 py-3.5 border-b space-y-3.5 text-xs shrink-0 max-h-[460px] overflow-y-auto ${
        isDark
          ? 'bg-[#091d15] border-[#D4AF37]/35 text-stone-100'
          : 'bg-[#faf8f2] border-[#D4AF37]/45 text-[#0B2419]'
      }`}
    >
      <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-current/10">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
            <Clock className="w-3.5 h-3.5" /> Ayurvedic Facial Cleansing Ritual
          </div>
          <h3 className="font-serif text-sm font-semibold mt-0.5 tracking-wide">
            {viewMode === 'four_phase' ? '4-Phase Daily Cleansing Protocol (2 Mins)' : 'Granular 12-Step Apothecary Sequence'}
          </h3>
          <p className="text-[11px] opacity-75 mt-0.5">
            Chronobiological timing designed to preserve barrier lipids while decongesting pores.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 px-2.5 py-1 rounded-xl border border-current/20 text-[11px] font-medium opacity-80 hover:opacity-100 hover:border-[#D4AF37] transition-colors"
        >
          Close ✕
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 p-1 rounded-xl bg-current/5">
        <button
          type="button"
          onClick={() => {
            setViewMode('four_phase');
            setTimerRunning(false);
          }}
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
            viewMode === 'four_phase'
              ? 'bg-[#D4AF37] text-[#0B2419] shadow-sm'
              : 'opacity-70 hover:opacity-100'
          }`}
        >
          ✨ 4-Phase Express Guide (Recommended)
        </button>
        <button
          type="button"
          onClick={() => {
            setViewMode('twelve_step');
            setTimerRunning(false);
          }}
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
            viewMode === 'twelve_step'
              ? 'bg-[#D4AF37] text-[#0B2419] shadow-sm'
              : 'opacity-70 hover:opacity-100'
          }`}
        >
          🔬 12-Step Granular View
        </button>
      </div>

      {viewMode === 'four_phase' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-1.5">
            {FOUR_CORE_RITUAL_PHASES.map((p, idx) => (
              <button
                key={p.phaseId}
                type="button"
                onClick={() => setActivePhaseIdx(idx)}
                className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                  idx === activePhaseIdx
                    ? 'bg-[#0B2419] text-[#FDFBF7] border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]/50'
                    : idx < activePhaseIdx
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                    : 'bg-current/5 border-transparent opacity-65 hover:opacity-100'
                }`}
              >
                <div className="text-[9px] font-bold text-[#D4AF37]">{p.phaseNumber}</div>
                <div className="text-[10px] font-semibold truncate mt-0.5">{p.title.split(' ')[0]}</div>
                <div className="text-[9px] opacity-75">{p.durationTotal}s</div>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-current/5 border border-current/10 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  {currentPhase.phaseNumber} · {currentPhase.durationTotal} Seconds
                </span>
                <h4 className="font-serif text-xs font-bold mt-0.5 tracking-wide">{currentPhase.title}</h4>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowVisualDemo(prev => !prev)}
                  className="px-2 py-0.5 rounded-lg border border-[#D4AF37]/30 text-[9px] font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-colors"
                >
                  {showVisualDemo ? 'Hide Clip ✕' : '▶ Animated Demo'}
                </button>
                <span className="font-mono font-bold text-sm px-3 py-1 rounded-xl bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                  {phaseSecondsLeft}s
                </span>
              </div>
            </div>

            {showVisualDemo && (
              <PhaseVisualClip phaseId={currentPhase.phaseId} isDark={isDark} />
            )}

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-xl bg-current/5">
                <strong className="text-[9px] uppercase tracking-wider opacity-70 block">Water Temp</strong>
                <span>{currentPhase.temperature}</span>
              </div>
              <div className="p-2 rounded-xl bg-current/5">
                <strong className="text-[9px] uppercase tracking-wider opacity-70 block">Target Dosage</strong>
                <span>{currentPhase.dosage}</span>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed pt-1">{currentPhase.instruction}</p>

            <div className="space-y-1 pt-1 text-[10px]">
              <div className="text-emerald-500 font-medium">
                <strong>✓ Concierge Pro-Tip:</strong> {currentPhase.proTip}
              </div>
              <div className="text-rose-400 font-medium">
                <strong>✕ Common Mistake to Avoid:</strong> {currentPhase.avoid}
              </div>
            </div>

            <div className="pt-1.5 flex flex-wrap gap-1 items-center">
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-70 mr-1">Bio-Actives at Work:</span>
              {currentPhase.actives.map((act, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[9px] font-semibold border border-[#D4AF37]/30">
                  {act}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              disabled={activePhaseIdx === 0}
              onClick={() => setActivePhaseIdx(prev => Math.max(0, prev - 1))}
              className="px-3 py-1.5 rounded-xl border border-current/20 text-[11px] font-semibold disabled:opacity-40"
            >
              ← Prev Phase
            </button>
            <button
              type="button"
              onClick={() => setTimerRunning(prev => !prev)}
              className="flex-1 py-2 rounded-xl bg-[#D4AF37] text-[#0B2419] font-bold text-xs shadow-md hover:bg-[#e0bc46] transition-all"
            >
              {timerRunning ? 'Pause Timer ⏸' : phaseSecondsLeft === 0 ? 'Phase Complete ✓' : `Start ${phaseSecondsLeft}s Timer ▶`}
            </button>
            {activePhaseIdx < FOUR_CORE_RITUAL_PHASES.length - 1 ? (
              <button
                type="button"
                onClick={() => setActivePhaseIdx(prev => Math.min(FOUR_CORE_RITUAL_PHASES.length - 1, prev + 1))}
                className="px-3 py-1.5 rounded-xl bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/40 text-[11px] font-semibold hover:bg-[#143928] transition-colors"
              >
                Next Phase →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onSendSummaryToChat('How do I really use Sea Buckthorn Face Wash step-by-step and what time of day should I use it?');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold shadow-md hover:bg-emerald-700 transition-colors"
              >
                Send to Chat ✓
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
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

          <div className="p-3.5 rounded-2xl bg-current/5 border border-current/10 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs text-[#D4AF37]">{currentStep.title}</span>
              <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-[#0B2419] text-[#D4AF37]">
                {stepSecondsLeft}s
              </span>
            </div>
            <div className="text-[10px] font-semibold opacity-75">
              Target: {currentStep.anatomicalTarget} · Water: {currentStep.waterTempCelsius}
            </div>
            <p className="text-[11px] leading-relaxed pt-1">{currentStep.detailedInstruction}</p>
            <div className="text-[10px] text-emerald-500 font-medium pt-1">
              <strong>✓ Pro-Tip:</strong> {currentStep.proConciergeTip}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              disabled={activeStepIdx === 0}
              onClick={() => setActiveStepIdx(prev => Math.max(0, prev - 1))}
              className="px-3 py-1.5 rounded-xl border border-current/20 text-[11px] font-semibold disabled:opacity-40"
            >
              ← Prev Step
            </button>
            <button
              type="button"
              onClick={() => setTimerRunning(prev => !prev)}
              className="flex-1 py-2 rounded-xl bg-[#D4AF37] text-[#0B2419] font-bold text-xs shadow-md hover:bg-[#e0bc46] transition-all"
            >
              {timerRunning ? 'Pause Timer ⏸' : stepSecondsLeft === 0 ? 'Step Complete ✓' : `Start ${stepSecondsLeft}s Timer ▶`}
            </button>
            <button
              type="button"
              disabled={activeStepIdx === MASTER_SKINCARE_RITUAL_STEPS.length - 1}
              onClick={() => setActiveStepIdx(prev => Math.min(MASTER_SKINCARE_RITUAL_STEPS.length - 1, prev + 1))}
              className="px-3 py-1.5 rounded-xl bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/40 text-[11px] font-semibold hover:bg-[#143928] disabled:opacity-40 transition-colors"
            >
              Next Step →
            </button>
          </div>
        </div>
      )}
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
      className={`px-4 py-3.5 border-b space-y-3.5 text-xs shrink-0 max-h-[460px] overflow-y-auto ${
        isDark
          ? 'bg-[#091d15] border-[#D4AF37]/35 text-stone-100'
          : 'bg-[#faf8f2] border-[#D4AF37]/45 text-[#0B2419]'
      }`}
    >
      <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-current/10">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" /> Personalized Skin Blueprint
          </div>
          <h3 className="font-serif text-sm font-semibold mt-0.5 tracking-wide">
            {isFinished ? 'Your Tailored Botanical Blueprint' : `Diagnostic Diagnostic · Question ${stepIdx + 1} of ${SKIN_DIAGNOSTIC_STEPS.length}`}
          </h3>
          <p className="text-[11px] opacity-75 mt-0.5">
            Analyzes skin lipid barriers, urban exposure, and botanical active tolerance.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 px-2.5 py-1 rounded-xl border border-current/20 text-[11px] font-medium opacity-80 hover:opacity-100 hover:border-[#D4AF37] transition-colors"
        >
          Close ✕
        </button>
      </div>

      {!isFinished && currentQuestion ? (
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="h-1.5 w-full rounded-full bg-current/10 overflow-hidden">
            <div
              className="h-full bg-[#D4AF37] transition-all duration-300"
              style={{ width: `${((stepIdx + 1) / SKIN_DIAGNOSTIC_STEPS.length) * 100}%` }}
            />
          </div>

          <div className="space-y-1">
            <div className="font-serif text-xs font-bold tracking-wide">{currentQuestion.question}</div>
            <div className="text-[10px] opacity-75">{currentQuestion.subtitle}</div>
          </div>

          <div className="space-y-2 pt-1">
            {currentQuestion.options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const next = { ...answers, [currentQuestion.id]: opt.value };
                  setAnswers(next);
                  setStepIdx(prev => prev + 1);
                }}
                className={`w-full text-left p-3 rounded-2xl border text-[11px] transition-all duration-150 flex items-center justify-between gap-2 ${
                  isDark
                    ? 'bg-black/30 border-white/10 hover:border-[#D4AF37] hover:bg-black/50'
                    : 'bg-white border-stone-200 hover:border-[#0B2419] hover:bg-stone-50 shadow-sm'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                <span className="text-[#D4AF37] text-xs">→</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        blueprint && (
          <div className="space-y-3 text-[11px]">
            <div className="p-3.5 rounded-2xl bg-[#0B2419] text-[#FDFBF7] border border-[#D4AF37]/50 space-y-2 shadow-lg">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                Recommended Anchor Formulation
              </div>
              <div className="font-serif text-sm font-bold tracking-wide">
                {blueprint.recommendedProduct.name}
              </div>
              <p className="text-[10px] opacity-80">{blueprint.recommendedProduct.subtitle}</p>
            </div>

            <div className="p-3 rounded-2xl bg-current/5 border border-current/10 space-y-1.5">
              <div className="font-bold text-[10px] uppercase tracking-wider text-[#D4AF37]">
                Top 5 Synergistic Bio-Actives for Your Profile:
              </div>
              <div className="space-y-1 text-[10px]">
                {blueprint.topIngredients.map((ing, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-[#D4AF37] font-bold">{i + 1}.</span>
                    <span><strong>{ing.name}</strong> ({ing.storyNumber}) — {ing.primaryClinicalBenefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2.5 rounded-xl bg-current/5">
                <strong className="text-[9px] uppercase tracking-wider text-[#D4AF37] block">AM Ritual</strong>
                <span className="mt-0.5 block">{blueprint.amSummary}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-current/5">
                <strong className="text-[9px] uppercase tracking-wider text-[#D4AF37] block">PM Ritual</strong>
                <span className="mt-0.5 block">{blueprint.pmSummary}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setStepIdx(0);
                  setAnswers({});
                }}
                className="px-3 py-2 rounded-xl border border-current/20 text-[10px] font-semibold hover:border-current/40"
              >
                Retake Quiz
              </button>
              <button
                type="button"
                onClick={() => {
                  onCompleteBlueprint(blueprint);
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/40 font-bold text-[11px] shadow-md hover:bg-[#143928] transition-colors"
              >
                Send Personalized Blueprint to Chat ✦
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
  const [launcherSide, setLauncherSide] = useState(persisted.launcherSide === 'left' ? 'left' : 'right');
  const [supportCategory, setSupportCategory] = useState(persisted.supportCategory || null);
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
        launcherSide,
        isDark,
        soundEnabled,
        chatStatus,
        assignedAgentName,
        hasPlacedOrder,
        messages: messages.slice(-50),
        quickActions,
        conciergeFlow,
        supportCategory,
      });
      localStorage.setItem(STORAGE_KEY, snapshot);
      sessionStorage.setItem(STORAGE_KEY, snapshot);
      if (sessionToken) {
        localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
        sessionStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
      }
    } catch {}
  }, [isOpen, launcherSide, isDark, soundEnabled, chatStatus, assignedAgentName, hasPlacedOrder, messages, quickActions, conciergeFlow, supportCategory, sessionToken]);

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
              ? `Welcome back, ${user.name.split(' ')[0]}. How may the Bhumivera Client Concierge assist you today? Explore our 4 Hero Botanical Stories (Sea Buckthorn, Charcoal, Tulsi, Aloe Vera), our authentic formulations (Sea Buckthorn Face Wash, Charcoal Face Wash, Kumkumadi Night Elixir, Botanical Shampoo), our 4-Phase Facial Cleansing Ritual, or verify an Order ID.`
              : 'Welcome to Bhumivera. Ask about our 4 Hero Botanical Stories (Sea Buckthorn, Charcoal, Tulsi, Aloe Vera), our authentic catalog formulations, our 4-Phase Facial Cleansing Ritual, Brand Ambassador Program, or verify an Order ID for dedicated order support.',
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
            'Your verified follow-up request can be recorded for later review; replies are not live and may take some time. Would you prefer an update via Email or a Phone Call?',
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
            'Your verified follow-up request has been recorded. A team member will review it and reply when available; replies are not live.',
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
        error: err.response?.data?.message || 'Could not save your follow-up request.',
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

  const sendMessage = useCallback(async (overridePrompt = null, selectedCategory = null) => {
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

    // Cancellation requests always require order verification; general requests for a person do not.
    if (
      /\bcancel\s*(?:my\s*|this\s*|the\s*)?order\b/i.test(text) &&
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
        pageContext: {
          ...currentPageContext,
          conciergeFlow,
          ...(selectedCategory || supportCategory
            ? { supportCategory: selectedCategory || supportCategory }
            : {}),
        },
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
    } catch (error) {
      if (error?.response?.status === 429) {
        if (overridePrompt === null) setInput(text);
        setMessages(prev => [
          ...prev.filter(msg => msg.id !== userMsgId),
          {
            id: assistantStreamId,
            sender: 'assistant',
            senderName: 'Bhumivera Client Concierge',
            content: error.response.data?.message || 'Please wait before sending this message again.',
            createdAt: new Date().toISOString(),
          },
        ]);
        return;
      }
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
    supportCategory,
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
      className={`fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:bottom-6 z-[250] flex flex-col font-sans ${
        launcherSide === 'left' ? 'left-4 items-start' : 'right-4 items-end'
      }`}
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
          className={`flex flex-col overflow-hidden rounded-3xl border transition-all duration-200 backdrop-blur-xl ${
            isMaximized
              ? 'w-[calc(100vw-1.5rem)] sm:w-[580px] md:w-[680px] lg:w-[720px] h-[calc(100dvh-4rem)] md:h-[760px]'
              : 'w-[calc(100vw-1.5rem)] sm:w-[460px] md:w-[480px] h-[650px] max-h-[calc(100dvh-5.5rem)]'
          } ${
            isDark
              ? 'bg-[#071610]/98 border-[#D4AF37]/35 text-stone-100 shadow-[0_24px_70px_rgba(0,0,0,0.55)]'
              : 'bg-[#FDFBF7]/98 border-[#D4AF37]/40 text-[#0B2419] shadow-[0_24px_70px_rgba(11,36,25,0.22)]'
          }`}
        >
          {/* Haute Luxury Header */}
          <header className="bg-gradient-to-r from-[#071911] via-[#0B2419] to-[#143725] px-5 py-3.5 text-[#FDFBF7] flex items-center justify-between gap-3 border-b border-[#D4AF37]/30 shrink-0 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-base font-semibold tracking-wide truncate">
                    Bhumivera Client Concierge
                  </h2>
                </div>
                <p className="text-[10px] text-[#D4AF37]/90 font-medium tracking-wide truncate flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ✦ Ayurvedic Botanical AI · Always Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => openVerificationFlow('')}
                title="Verify an order to submit a follow-up request"
                aria-label="Verify Order for Follow-up"
                className="hidden sm:inline-flex px-2.5 py-1 rounded-xl text-[10px] font-bold tracking-wider uppercase border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all shadow-sm"
              >
                Verify Order
              </button>
              <button
                type="button"
                onClick={() => setLauncherSide(prev => prev === 'left' ? 'right' : 'left')}
                title={`Move Concierge to ${launcherSide === 'left' ? 'right' : 'left'}`}
                aria-label={`Move Concierge to ${launcherSide === 'left' ? 'right' : 'left'}`}
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSoundEnabled(prev => !prev)}
                title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
                aria-label={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D4AF37]" /> : <VolumeX className="w-4 h-4 opacity-60" />}
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
                title="Close Concierge"
                aria-label="Close Concierge"
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Luxury Two-Tier Switcher Bar */}
          <div
            className={`px-4 py-2 border-b flex flex-col gap-1.5 text-[11px] shrink-0 transition-colors ${
              isDark ? 'bg-[#0a1c15] border-white/10 text-stone-300' : 'bg-[#f5f2e8] border-[#0B2419]/10 text-[#1b2921]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                {hasPlacedOrder ? (
                  <span><strong>Verified Client:</strong> Private order & refund details accessible</span>
                ) : (
                  <span><strong>AI Skincare Concierge:</strong> Personalized guidance & ingredient science</span>
                )}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border shrink-0 ${activeStatusMeta.badgeClass}`}>
                {activeStatusMeta.label}
              </span>
            </div>

            {/* Interactive Luxury Module Navigation Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 scrollbar-none">
              <button
                type="button"
                onClick={() => {
                  setIngredientDrawerOpen(prev => !prev);
                  setRitualDrawerOpen(false);
                  setDiagnosticDrawerOpen(false);
                  setEscalationWizard(prev => ({ ...prev, open: false }));
                }}
                className={`shrink-0 px-3 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                  ingredientDrawerOpen
                    ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37] shadow-sm'
                    : 'border-current/20 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                }`}
              >
                🌿 Botanical Library
              </button>
              <button
                type="button"
                onClick={() => {
                  setRitualDrawerOpen(prev => !prev);
                  setIngredientDrawerOpen(false);
                  setDiagnosticDrawerOpen(false);
                  setEscalationWizard(prev => ({ ...prev, open: false }));
                }}
                className={`shrink-0 px-3 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                  ritualDrawerOpen
                    ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37] shadow-sm'
                    : 'border-current/20 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                }`}
              >
                ⏳ Facial Ritual (4 Phases)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDiagnosticDrawerOpen(prev => !prev);
                  setIngredientDrawerOpen(false);
                  setRitualDrawerOpen(false);
                  setEscalationWizard(prev => ({ ...prev, open: false }));
                }}
                className={`shrink-0 px-3 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                  diagnosticDrawerOpen
                    ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37] shadow-sm'
                    : 'border-current/20 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                }`}
              >
                ✨ Skin Quiz
              </button>
              <button
                type="button"
                onClick={() => openVerificationFlow('')}
                className={`shrink-0 px-3 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                  escalationWizard.open
                    ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37] shadow-sm'
                    : 'border-current/20 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                }`}
              >
                🛡️ Specialist Support
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

          {/* Interactive 4-Phase Skincare Ritual Timer Drawer */}
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
                    `**Your Personalized Botanical Skin Blueprint**`,
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
                    ? 'Step 2 of 2 · Follow-up Contact Preference'
                    : 'Verified Follow-up Request Recorded'}
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
                    Verified <strong>Order #{escalationWizard.verifiedOrder?.orderNumber}</strong>. Your request can be saved for later review; replies are not live and may take some time. Would you prefer an update via <strong>Email</strong> or a <strong>Phone Call</strong>?
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
                      <option value="specialist_callback_or_resolution">Follow-up & Resolution</option>
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
                    {escalationWizard.busy ? 'Saving Verified Request…' : 'Submit Follow-up Request'}
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
                    Your verified request has been recorded for later review. Replies are not live and may take some time.
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
                    <div className="max-w-[92%] rounded-2xl px-4 py-2.5 text-[11px] text-center bg-[#D4AF37]/15 border border-[#D4AF37]/35 shadow-sm">
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
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#D4AF37] mb-1.5 pl-1">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>{isHumanStaff ? msg.senderName || 'Bhumivera Specialist' : 'Bhumivera Client Concierge'}</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[90%] rounded-2xl px-4.5 py-3.5 transition-all shadow-sm ${
                      isUser
                        ? 'bg-[#0B2419] text-[#FDFBF7] rounded-tr-sm border border-[#D4AF37]/25 shadow-md'
                        : isHumanStaff
                        ? 'bg-emerald-950 text-emerald-50 border border-emerald-400/40 rounded-tl-sm shadow-md'
                        : isDark
                        ? 'bg-[#0f241d] text-stone-100 border border-white/10 rounded-tl-sm shadow-md'
                        : 'bg-white text-[#0B2419] border border-[#0B2419]/10 rounded-tl-sm shadow-md'
                    }`}
                  >
                    <FormattedMarkdown
                      content={msg.content}
                      isDark={isUser || isHumanStaff || isDark}
                      onNavigate={href => navigate(href)}
                    />

                    {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {msg.attachments.map((att, aIdx) => (
                          <div
                            key={aIdx}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/20 text-[11px]"
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
                          Verified follow-up request{msg.escalation.ticketId ? ` #${msg.escalation.ticketId}` : ''} recorded. A specialist will review your details.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {!isTyping && !messages.some(msg => msg.sender === 'user') && (
              <div
                className={`rounded-2xl border p-4 space-y-3 ${
                  isDark ? 'border-white/10 bg-[#0d221a]' : 'border-[#0B2419]/10 bg-white shadow-sm'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                    Ayurvedic Bio-Active Consultation
                  </span>
                  <p className="font-serif text-sm font-semibold mt-0.5">How may we guide your skincare journey today?</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SUPPORT_ENTRY_CHOICES.map(choice => (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => {
                        setSupportCategory(choice.id);
                        void sendMessage(choice.prompt, choice.id);
                      }}
                      className={`rounded-xl border p-3 text-left transition-all flex flex-col justify-between ${
                        isDark
                          ? 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#D4AF37]/50'
                          : 'border-[#0B2419]/10 bg-[#FDFBF7] hover:bg-[#f4f1e9] hover:border-[#0B2419]/30'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#D4AF37]">{choice.label}</span>
                      <span className="mt-1 block text-[10px] opacity-75 leading-relaxed">{choice.description}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] opacity-65 italic">
                  ✦ Automated botanical concierge. Verified follow-up requests are scheduled with human specialists.
                </p>
              </div>
            )}

            {['resolved', 'closed'].includes(chatStatus) && (
              <div
                className={`rounded-2xl border p-4 space-y-2.5 ${
                  isDark ? 'bg-[#10241f] border-[#D4AF37]/35' : 'bg-white border-[#0B2419]/15 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold">
                    {csatSubmitted ? 'Thank you for your feedback.' : 'How was your support experience?'}
                  </span>
                  <a
                    href={telegramBotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-semibold text-[#D4AF37] underline"
                  >
                    Telegram Concierge ↗
                  </a>
                </div>
                {!csatSubmitted && (
                  <>
                    <div className="flex items-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCsatRating(star)}
                          disabled={csatSubmitting}
                          aria-label={`Rate ${star} stars`}
                          className="p-1 hover:scale-125 transition-transform disabled:opacity-60"
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
                        className={`flex-1 px-3 py-2 rounded-xl border text-[11px] ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-stone-50 border-stone-200 text-[#0B2419]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => void handleSubmitCsat()}
                        disabled={csatSubmitting}
                        className="px-3.5 py-2 rounded-xl bg-[#0B2419] text-[#D4AF37] text-xs font-bold shrink-0 disabled:opacity-60 hover:bg-[#143928] transition-colors"
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
                  className="rounded-xl border border-[#0B2419]/20 px-3.5 py-1.5 text-[11px] font-semibold text-[#0B2419] hover:bg-[#0B2419]/10 disabled:opacity-60 dark:text-stone-200 dark:border-white/20 transition-colors"
                >
                  {csatSubmitting ? 'Closing…' : 'End chat'}
                </button>
              </div>
            )}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs opacity-85 pl-1 animate-pulse">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#0B2419]/10 dark:bg-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:300ms]" />
                </div>
                {statusLabel && <span className="text-[11px] italic font-serif">{statusLabel}</span>}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Dynamic AI Suggested Actions Carousel */}
          {Array.isArray(quickActions) && quickActions.length > 0 && (
            <div
              className={`px-4 py-2 border-t space-y-1.5 shrink-0 transition-colors ${
                isDark ? 'bg-[#081a13] border-white/10' : 'bg-[#f6f3ea] border-[#0B2419]/10'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.16em] text-[#D4AF37]">
                <span>
                  {quickActions.some(c => c.category === 'post_wash_routine' || c.category === 'product_pairing' || c.category === 'ingredient_synergy')
                    ? '✦ Skincare Ritual & Layering Suggestions'
                    : quickActions.some(c => c.category === 'ingredient_deep_dive' || c.category === 'closely_related_ingredient')
                    ? '✦ Botanical Active Inquiries'
                    : '✦ Recommended Inquiries'}
                </span>
                <span className="text-[8px] opacity-60 font-normal">Swipe for more</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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
                      className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-medium border transition-all duration-150 ${
                        isRelated
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37]/60 text-[#0B2419] dark:text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B2419]'
                          : isUsage
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-600 hover:text-white'
                          : isSynergy
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-900 dark:text-amber-200 hover:bg-amber-600 hover:text-white'
                          : isDark
                          ? 'bg-[#10241f] border-[#D4AF37]/35 text-stone-200 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                          : 'bg-white border-[#0B2419]/15 text-[#0B2419] hover:border-[#0B2419] hover:bg-[#0B2419] hover:text-white shadow-sm'
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
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#D4AF37]/15 text-[11px] font-medium border border-[#D4AF37]/30"
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
              isDark ? 'bg-[#071610] border-white/10' : 'bg-white border-[#0B2419]/10'
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
              className={`p-2.5 rounded-xl border transition-colors ${
                isDark
                  ? 'border-white/15 text-stone-300 hover:bg-white/10 hover:border-[#D4AF37]'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-100 hover:border-[#0B2419]'
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
                  : 'Ask about ingredients, skin concerns, or verify an Order ID…'
              }
              maxLength={2000}
              aria-label="Message Bhumivera Client Concierge"
              className={`flex-1 min-w-0 px-4 py-2.5 rounded-2xl border text-xs outline-none transition-all ${
                isDark
                  ? 'bg-[#10241f] border-white/15 text-stone-100 placeholder:text-stone-400 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40'
                  : 'bg-[#FDFBF7] border-stone-200 text-[#0B2419] placeholder:text-stone-400 focus:border-[#0B2419] focus:ring-1 focus:ring-[#0B2419]/20'
              }`}
            />
            <button
              type="submit"
              disabled={isTyping || (!input.trim() && attachments.length === 0)}
              aria-label="Send message"
              className="p-2.5 rounded-2xl bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#163829] active:scale-95 disabled:opacity-40 transition-all shrink-0 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}

      {/* Floating Concierge Launcher */}
      {!isOpen && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLauncherSide(prev => (prev === 'left' ? 'right' : 'left'))}
            aria-label={`Move Concierge to ${launcherSide === 'left' ? 'right' : 'left'}`}
            title={`Move Concierge to ${launcherSide === 'left' ? 'right' : 'left'}`}
            className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-md transition-all duration-150 ${
              isDark
                ? 'border-white/15 bg-[#071510] text-stone-200 hover:bg-[#10241f] hover:border-[#D4AF37]/50'
                : 'border-[#0B2419]/15 bg-white text-[#0B2419] hover:bg-stone-50 hover:border-[#0B2419]'
            }`}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setUnreadCount(0);
              setProactiveBubble(null);
            }}
            aria-label="Open Bhumivera Support"
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#071911] via-[#0B2419] to-[#163828] px-4 py-3 text-[#FDFBF7] shadow-[0_12px_30px_rgba(11,36,25,0.35)] border border-[#D4AF37]/45 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            <div className="relative flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
              {unreadCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 min-w-[20px] h-[20px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-md">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold tracking-wider pr-0.5">
              <span className="sm:hidden">Concierge</span>
              <span className="hidden sm:inline">✦ Client Concierge</span>
            </span>
          </button>
        </div>
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
