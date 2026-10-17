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

export const LOCALIZED_INTENT_RESPONSES = {
  hi: {
    PASSWORD_GUIDE: {
      intent: 'PASSWORD_GUIDE',
      reply: [
        '🔐 **भूमिअवेरा AI पासवर्ड और खाता सुरक्षा मार्गदर्शिका**',
        'यदि आपको लॉगिन करने, पासवर्ड रीसेट करने या आवश्यकताओं को पूरा करने में कोई समस्या आ रही है, तो यहाँ आपके लिए पूरी जानकारी है:',
        '**पासवर्ड सुरक्षा नियम (लाइव जांच):**\n- **लंबाई:** 8 से 72 अक्षर।\n- **अक्षर:** कम से कम 1 बड़ा अक्षर (A–Z) और 1 छोटा अक्षर (a–z)।\n- **संख्या और प्रतीक:** कम से कम 1 संख्या (0–9) और 1 विशेष प्रतीक (!@#$%^&*)।\n- **सुरक्षा:** सामान्य शब्द जैसे "Password123" या ईमेल का नाम दोहराने से बचें।',
        '**3 आसान चरणों में पासवर्ड रीसेट करें:**\n1. [पासवर्ड भूल गए पेज](/forgot-password) पर जाएं।\n2. 6 अंकों का सुरक्षित OTP प्राप्त करने के लिए अपना पंजीकृत ईमेल दर्ज करें।\n3. OTP दर्ज करें और अपना नया मजबूत पासवर्ड बनाएं।',
        '💡 *तत्काल सहायता चाहिए? यदि आपको परेशानी हो रही है, तो हमारा AI सलाहकार सीधे आपके इनबॉक्स में 30 मिनट का वन-क्लिक रिकवरी लिंक भेज सकता है।*',
      ].join('\n\n'),
      quickActions: [
        { id: 'go_forgot_pwd', label: '🔑 पासवर्ड रीसेट पेज खोलें', prompt: 'I want to reset my password on the Forgot Password page' },
        { id: 'otp_help', label: '✉️ OTP कोड नहीं मिला?', prompt: 'I did not receive the password OTP verification email' },
        { id: 'contact_auth_agent', label: '👤 खाता विशेषज्ञ से बात करें', prompt: 'Connect me with an account support specialist for login help' },
      ],
    },
    DAMAGED_ITEM_CREDIT: {
      intent: 'DAMAGED_ITEM_CREDIT',
      reply: [
        '🌿 **भूमिअवेरा स्वच्छता और अनूठी हस्तनिर्मित सुरक्षा नीति**',
        '*“100% सीलबंद वर्जिन यूनिट्स — 250 बोतलों के छोटे बैच में तैयार।”*',
        '**वर्जिन स्वच्छता कस्टडी:**\nहमारे सभी उत्पाद (सी बकथॉर्न फेस वॉश, चारकोल फेस वॉश, और बोटैनिकल शैम्पू) स्वच्छता सुरक्षा मानकों के अनुसार 100% गैर-वापसी योग्य और सीलबंद रखे जाते हैं ताकि हर ग्राहक को पूर्णतः शुद्ध और अप्रयुक्त उत्पाद मिले। प्रत्येक बोतल का एक अनूठा सीरियल नंबर होता है जिसे /verify पर देखा जा सकता है।',
        '**पार्सल समस्या के लिए सहायता:**\nयदि पार्सल को डिलीवरी के समय कोई क्षति हुई है, तो डिलीवरी के 48 घंटों के भीतर 360° अनबॉक्सिंग वीडियो साझा करें। हमारे कंसीयर्ज द्वारा जांच के बाद हमारे नियमित ग्राहकों के लिए सीधे समाधान (रिफंड या क्रेडिट) प्रदान किया जाता है।',
      ].join('\n\n'),
      quickActions: [
        { id: 'damaged_claim', label: '📹 अनबॉक्सिंग वीडियो सत्यापन भेजें', prompt: 'I want to submit an unboxing verification video to concierge' },
        { id: 'verify_serial', label: '🔬 बोतल सीरियल और लैब टेस्ट जांचें', prompt: 'I want to verify the artisanal serial number and lab assay of my bottle' },
        { id: 'check_wallet', label: '💰 वॉलेट बैलेंस देखें', prompt: 'What is my current Bhumivera Wallet and Courtesy Credit balance?' },
      ],
    },
    ORDER_TRACKING: {
      intent: 'ORDER_TRACKING',
      reply: [
        '📦 **भूमिअवेरा लाइव एक्सप्रेस डिलीवरी ट्रैकिंग गाइड**',
        'हमारे सभी ऑर्डर **Delhivery, BlueDart, और DTDC Express** द्वारा पूरे भारत में एसएमएस और व्हाट्सएप ट्रैकिंग के साथ भेजे जाते हैं।',
        '**डिलीवरी समय सीमा:**\n- **मेट्रो शहर (दिल्ली, मुंबई, बेंगलुरु, हैदराबाद, चेन्नई, कोलकाता):** 2 से 3 कार्य दिवस।\n- **टियर 2 / टियर 3 शहर:** 3 से 5 कार्य दिवस।\n- **पूर्वोत्तर और दूरदराज के क्षेत्र:** 4 से 6 कार्य दिवस।',
        '**ट्रैक कैसे करें:**\n- अपनी **ऑर्डर आईडी** (उदा. #BHU-84920) सीधे इस चैट में दर्ज करें या हमारे [लाइव ऑर्डर ट्रैकिंग पेज](/order-tracking) पर जाएं।\n- प्रेषण के बाद आपको कूरियर को लाइव ट्रैक करने के लिए एक सीधा AWB लिंक एसएमएस पर मिलता है।',
      ].join('\n\n'),
      quickActions: [
        { id: 'open_tracker', label: '🚚 ऑर्डर ट्रैकर खोलें', prompt: 'Open the Live Order Tracking page' },
        { id: 'deliv_estimate', label: '⏱ पिनकोड डिलीवरी समय जांचें', prompt: 'How long will delivery take to my pin code?' },
        { id: 'order_history', label: '📋 हाल के ऑर्डर देखें', prompt: 'Show me my recent orders and tracking status' },
      ],
    },
    ADDRESS_PINPOINT: {
      intent: 'ADDRESS_PINPOINT',
      reply: [
        '📍 **पता और गूगल मैप्स सटीक लोकेशन डिलीवरी गाइड**',
        'कूरियर पार्टनर बिना किसी भ्रम के सीधे आपके दरवाजे तक पहुँच सकें, इसके लिए भूमिअवेरा **गूगल मैप्स लाइव लोकेशन पिनपॉइंट** का समर्थन करता है:',
        '**पता कैसे अपडेट या पिन करें:**\n1. अपनी [प्रोफ़ाइल पता पुस्तिका](/profile) या चेकआउट स्क्रीन पर जाएं।\n2. **' + '"' + 'लाइव लोकेशन का उपयोग करें / मैप पर पिन करें' + '"' + '** पर टैप करें।\n3. सुनिश्चित करें कि आपका मकान/फ्लैट नंबर, लैंडमार्क और 6 अंकों का पिनकोड सही है।',
        '⚠️ **यदि आपका ऑर्डर पहले ही दिया जा चुका है:**\n- यदि स्थिति *प्रोसेसिंग* है, तो हम तुरंत डिलीवरी पता बदल सकते हैं।\n- यदि स्थिति *डिस्पैच* है, तो हमारी टीम कूरियर से संपर्क करके पता अपडेट करवाती है।',
      ].join('\n\n'),
      quickActions: [
        { id: 'edit_address', label: '🏠 प्रोफ़ाइल में पता बदलें', prompt: 'I want to update my delivery address in my profile' },
        { id: 'change_order_addr', label: '🚚 ऑर्डर का पता बदलें', prompt: 'Can I change the delivery address of my pending order?' },
      ],
    },
    PAYMENT_TROUBLESHOOT: {
      intent: 'PAYMENT_TROUBLESHOOT',
      reply: [
        '💳 **पेमेंट, यूपीआई और कैश ऑन डिलीवरी (COD) गाइड**',
        'भूमिअवेरा के सभी ऑनलाइन भुगतान **100% सुरक्षित रेज़रपे (256-बिट SSL)** द्वारा संसाधित होते हैं, जिसमें UPI (Google Pay, PhonePe, Paytm, BHIM), कार्ड और नेट बैंकिंग शामिल हैं।',
        '**पैसे कट गए लेकिन ऑर्डर कन्फर्म नहीं हुआ?**\nचिंता न करें! यदि बैंक सर्वर या नेटवर्क की समस्या के कारण ऐसा हुआ है:\n- NPCI बैंकिंग गेटवे **2 से 4 कार्य दिवसों में पूरी राशि स्वतः आपके बैंक खाते में वापस कर देता है**।\n- अपनी 12 अंकों की UPI UTR संख्या या स्क्रीनशॉट हमारे सलाहकार से साझा करें ताकि हम तुरंत पुष्टि कर सकें।',
        '**कैश ऑन डिलीवरी (COD):**\n- भारत के 19,000+ पिनकोड पर ₹3,000 तक के ऑर्डर पर उपलब्ध है।\n- प्रेषण से पहले आपको त्वरित 1-क्लिक व्हाट्सएप/एसएमएस सत्यापन प्राप्त होगा।',
      ].join('\n\n'),
      quickActions: [
        { id: 'verify_payment', label: '🔍 पेंडिंग ट्रांजेक्शन जांचें', prompt: 'Money was deducted from my UPI but order did not show confirmation' },
        { id: 'cod_query', label: '💵 COD सत्यापन जानकारी', prompt: 'How does Cash on Delivery verification work?' },
      ],
    },
    SKINCARE_LAYERING: {
      intent: 'SKINCARE_LAYERING',
      reply: [
        '🌸 **भूमिअवेरा सुबह और शाम की विशेष स्किनकेयर दिनचर्या**',
        '**☀️ सुबह की दिनचर्या (7:00 AM – 9:00 AM):**\n1. **क्लींज:** गुनगुने पानी (28°C–32°C) के साथ **सी बकथॉर्न फेस वॉश** का 1 पंप। 40 सेकंड मालिश करें और 15 सेकंड रुकें।\n2. **धोएं और थपथपाएं:** ठंडे पानी से धोएं और तौलिये से थपथपाकर 15% नमी छोड़ें।\n3. **हाइड्रेट और सुरक्षा:** 60 सेकंड के अंदर टोनर या सीरम लगाएं और SPF 50 सनस्क्रीन से सुरक्षित करें।',
        '**🌙 शाम की दिनचर्या (8:00 PM – 10:30 PM):**\n1. **डीटॉक्स क्लींज:** प्रदूषण और सनस्क्रीन हटाने के लिए **चारकोल फेस वॉश** का 1.5 पंप।\n2. **कुमकुमादि एलिक्सिर:** **कुमकुमादि नाइट एलिक्सिर** की 2-3 बूंदें हथेलियों में गर्म करें और गालों, माथे और गर्दन पर हल्के हाथों से दबाएं।\n3. **रात भर पोषण:** सोते समय त्वचा की कोशिकाओं को प्राकृतिक रूप से स्वस्थ होने दें।',
      ].join('\n\n'),
      quickActions: [
        { id: 'launch_ritual_timer', label: '⏱ 4-फेज रिचुअल प्लेयर शुरू करें', prompt: '__OPEN_RITUAL_PLAYER__' },
        { id: 'kumk_details', label: '🌙 कुमकुमादि नाइट एलिक्सिर गाइड', prompt: 'Tell me about Kumkumadi Night Elixir and how to apply it' },
        { id: 'sb_wash_details', label: '🍊 सी बकथॉर्न फेस वॉश विवरण', prompt: 'Tell me about Sea Buckthorn Face Wash and its key ingredients' },
      ],
    },
  },
  bn: {
    PASSWORD_GUIDE: {
      intent: 'PASSWORD_GUIDE',
      reply: [
        '🔐 **ভূমিভেরা AI পাসওয়ার্ড ও অ্যাকাউন্ট অ্যাক্সেস নির্দেশিকা**',
        'লগইন করতে বা পাসওয়ার্ড রিসেট করতে সমস্যা হলে নিচে প্রয়োজনীয় পদক্ষেপ দেখুন:',
        '**পাসওয়ার্ড সুরক্ষার নিয়মাবলী:**\n- দৈর্ঘ্য: ৮ থেকে ৭২ অক্ষর\n- কমপক্ষে ১টি বড় হাতের (A-Z) ও ১টি ছোট হাতের অক্ষর (a-z)\n- কমপক্ষে ১টি সংখ্যা ও ১টি বিশেষ চিহ্ন (!@#$%^&*)',
        '**সহজ ৩ ধাপে রিসেট করুন:**\n১. [পাসওয়ার্ড রিসেট পেজে](/forgot-password) যান।\n২. নিবন্ধিত ইমেইল প্রদান করে ৬ সংখ্যার OTP কোড নিন।\n৩. OTP যাচাই করে নতুন পাসওয়ার্ড নির্ধারণ করুন।',
      ].join('\n\n'),
      quickActions: [
        { id: 'go_forgot_pwd', label: '🔑 পাসওয়ার্ড রিসেট পেজ', prompt: 'I want to reset my password on the Forgot Password page' },
        { id: 'contact_auth_agent', label: '👤 সাপোর্ট প্রতিনিধির সাথে কথা বলুন', prompt: 'Connect me with an account support specialist for login help' },
      ],
    },
    DAMAGED_ITEM_CREDIT: {
      intent: 'DAMAGED_ITEM_CREDIT',
      reply: [
        '🌿 **ভূমিভেরা স্বাস্থ্যবিধি ও স্বাতন্ত্র্যসূচক আর্টয়সান সুরক্ষা নীতি**',
        '*“১০০% সিলযুক্ত ভার্জিন ইউনিট — ২৫০ বোতলের ক্ষুদ্র ব্যাচে তৈরি।”*',
        'ফেসওয়াশ ও শ্যাম্পু ব্যক্তিগত প্রসাধন সামগ্রী হওয়ায় স্বাস্থ্যবিধি মান বজায় রাখতে এগুলো ১০০% সিলযুক্ত ও ফেরত-অযোগ্য রাখা হয়। প্রতিটি বোতলের রয়েছে স্বতন্ত্র সিরিয়াল নম্বর যা /verify পেজে যাচাই করা যায়। কোনো সমস্যা থাকলে ডেলিভারির ৪৮ ঘণ্টার মধ্যে আনবক্সিং ভিডিও শেয়ার করুন; কনসিয়ার্জ টিম সরাসরি সমাধান করবে।',
      ].join('\n\n'),
      quickActions: [
        { id: 'damaged_claim', label: '📹 আনবক্সিং ভিডিও যাচাই করুন', prompt: 'I want to submit an unboxing verification video to concierge' },
        { id: 'verify_serial', label: '🔬 বোতল সিরিয়াল ও ল্যাব টেস্ট', prompt: 'I want to verify the artisanal serial number and lab assay of my bottle' },
        { id: 'check_wallet', label: '💰 ওয়ালেট ব্যালেন্স দেখুন', prompt: 'What is my current Bhumivera Wallet and Courtesy Credit balance?' },
      ],
    },
    ORDER_TRACKING: {
      intent: 'ORDER_TRACKING',
      reply: [
        '📦 **ভূমিভেরা লাইভ এক্সপ্রেস ডেলিভারি ট্র্যাকিং**',
        'আপনার অর্ডারটি Delhivery, BlueDart অথবা DTDC এক্সপ্রেসের মাধ্যমে পাঠানো হয়।\n- মেট্রো শহর: ২-৩ দিন\n- অন্যান্য শহর: ৩-৫ দিন\nআপনার অর্ডার আইডি লিখে সরাসরি চ্যাটে পাঠান বা ট্র্যাকিং পেজ দেখুন।',
      ].join('\n\n'),
      quickActions: [
        { id: 'open_tracker', label: '🚚 ট্র্যাকিং পেজ খুলুন', prompt: 'Open the Live Order Tracking page' },
      ],
    },
    ADDRESS_PINPOINT: {
      intent: 'ADDRESS_PINPOINT',
      reply: [
        '📍 **ঠিকানা ও গুগল ম্যাপস সঠিক লোকেশন ডেলিভারি গাইড**',
        'কুরিয়ার পার্টনার যাতে কোনো বিভ্রান্তি ছাড়াই সরাসরি আপনার ঠিকানায় পৌঁছাতে পারেন, সেজন্য ভূমিভেরা **গুগল ম্যাপস লাইভ লোকেশন পিনপয়েন্ট** সমর্থন করে:',
        '**ঠিকানা আপডেট বা ম্যাপে পিন করার নিয়ম:**\n১. আপনার [প্রোফাইল ঠিকানা বই](/profile) অথবা চেকআউট স্ক্রিনে যান।\n২. **"বর্তমান লোকেশন ব্যবহার করুন / ম্যাপে পিন করুন"** বোতামে ক্লিক করুন।\n৩. আপনার বাড়ি/ফ্ল্যাট নম্বর, ল্যান্ডমার্ক এবং ৬ সংখ্যার পিনকোড সঠিকভাবে দিন।',
        '⚠️ **যদি আপনার অর্ডার আগেই সম্পন্ন হয়ে থাকে:**\n- অর্ডারটি *প্রসেসিং* অবস্থায় থাকলে আমরা অবিলম্বে ডেলিভারি ঠিকানা পরিবর্তন করতে পারব।\n- যদি *ডিসপ্যাচ* হয়ে গিয়ে থাকে, তবে আমাদের টিম কুরিয়ারের সাথে যোগাযোগ করে ঠিকানা আপডেট নিশ্চিত করবে।',
      ].join('\n\n'),
      quickActions: [
        { id: 'edit_address', label: '🏠 প্রোফাইলে ঠিকানা পরিবর্তন করুন', prompt: 'I want to update my delivery address in my profile' },
        { id: 'change_order_addr', label: '🚚 অর্ডারের ঠিকানা পরিবর্তন করুন', prompt: 'Can I change the delivery address of my pending order?' },
      ],
    },
    PAYMENT_TROUBLESHOOT: {
      intent: 'PAYMENT_TROUBLESHOOT',
      reply: [
        '💳 **পেমেন্ট, ইউপিআই (UPI) ও ক্যাশ অন ডেলিভারি (COD) নির্দেশিকা**',
        'ভূমিভেরার সমস্ত অনলাইন পেমেন্ট **১০০% নিরাপদ রেজরপে (256-বিট SSL)** দ্বারা সুরক্ষিত, যার মধ্যে UPI (Google Pay, PhonePe, Paytm, BHIM), ক্রেডিট/ডেবিট কার্ড ও নেট ব্যাংকিং অন্তর্ভুক্ত।',
        '**টাকা কেটে গেছে কিন্তু অর্ডার নিশ্চিত হয়নি?**\nচিন্তার কোনো কারণ নেই! যদি ব্যাংক সার্ভার বা নেটওয়ার্ক সমস্যার কারণে এমনটি ঘটে:\n- NPCI ব্যাংকিং গেটওয়ে **২ থেকে ৪ কার্যদিবসের মধ্যে সম্পূর্ণ অর্থ স্বয়ংক্রিয়ভাবে আপনার ব্যাংক অ্যাকাউন্টে ফেরত পাঠাবে**।\n- আপনার ১২ সংখ্যার UPI UTR নম্বর বা স্ক্রিনশট আমাদের সহকারীর সাথে শেয়ার করুন যাতে আমরা অবিলম্বে তা নিশ্চিত করতে পারি।',
        '**ক্যাশ অন ডেলিভারি (COD):**\n- ভারতের ১৯,০০০+ পিনকোডে ₹৩,০০০ পর্যন্ত অর্ডারে COD উপলব্ধ।\n- পার্সেল পাঠানোর আগে আপনি ১-ক্লিক হোয়াটসঅ্যাপ/এসএমএস যাচাইকরণ বার্তা পাবেন।',
      ].join('\n\n'),
      quickActions: [
        { id: 'verify_payment', label: '🔍 অমীমাংসিত পেমেন্ট যাচাই করুন', prompt: 'Money was deducted from my UPI but order did not show confirmation' },
        { id: 'cod_query', label: '💵 COD তথ্যের নিয়মাবলী', prompt: 'How does Cash on Delivery verification work?' },
      ],
    },
    SKINCARE_LAYERING: {
      intent: 'SKINCARE_LAYERING',
      reply: [
        '🌸 **ভূমিভেরা সকাল ও রাতের বিশেষ ভেষজ স্কিনকেয়ার রুটিন**',
        '**☀️ সকালের রূপচর্চা (7:00 AM – 9:00 AM):**\n১. **ক্লিনজিং:** কুসুম গরম জলের (28°C–32°C) সাথে **সি বাকথর্ন ফেস ওয়াশ**-এর ১ পাম্প নিন। ৪০ সেকেন্ড আলতো করে ম্যাসাজ করুন এবং ১৫ সেকেন্ড রেখে দিন।\n২. **ধোয়া ও শুকানো:** ঠান্ডা জলে মুখ ধুয়ে নরম তোয়ালে দিয়ে আলতো করে চাপ দিন যাতে ত্বক ১৫% ভেজা থাকে।\n৩. **ময়েশ্চারাইজ ও সুরক্ষা:** ৬০ সেকেন্ডের মধ্যে টোনার বা সিরাম লাগান এবং SPF 50 সানস্ক্রিন ব্যবহার করুন।',
        '**🌙 রাতের রূপচর্চা (8:00 PM – 10:30 PM):**\n১. **ডিটক্স ক্লিনজিং:** ধুলোবালি ও অতিরিক্ত তেল দূর করতে **চারকোল ফেস ওয়াশ**-এর ১.৫ পাম্প ব্যবহার করুন।\n২. **কুমকুমাদি এলিক্সির:** **কুমকুমাদি নাইট এলিক্সির**-এর ২-৩ ফোঁটা হাতের তালুতে নিয়ে হালকা ম্যাসাজে গাল, কপাল ও গলায় লাগিয়ে নিন।\n৩. **রাতভর পুষ্টি:** ঘুমের মধ্যে প্রাকৃতিক উপাদানগুলি ত্বকের গভীরে পুষ্টি জোগাবে।',
      ].join('\n\n'),
      quickActions: [
        { id: 'launch_ritual_timer', label: '⏱ ৪-ধাপের রূপচর্চা টাইমার শুরু করুন', prompt: '__OPEN_RITUAL_PLAYER__' },
        { id: 'kumk_details', label: '🌙 কুমকুমাদি নাইট এলিক্সির তথ্য', prompt: 'Tell me about Kumkumadi Night Elixir and how to apply it' },
        { id: 'sb_wash_details', label: '🍊 সি বাকথর্ন ফেস ওয়াশ তথ্য', prompt: 'Tell me about Sea Buckthorn Face Wash and its key ingredients' },
      ],
    },
  },
  mr: {
    PASSWORD_GUIDE: {
      intent: 'PASSWORD_GUIDE',
      reply: [
        '🔐 **भूमीवेरा AI पासवर्ड आणि खाते सुरक्षा मार्गदर्शक**',
        'पासवर्ड रीसेट करण्यासाठी खालील पायऱ्या फॉलो करा:\n१. [पासवर्ड विसरलात का?](/forgot-password) पृष्ठावर जा.\n२. नोंदणीकृत ईमेल टाकून ६-अंकी OTP मिळवा.\n३. OTP टाकून सुरक्षित नवीन पासवर्ड सेट करा.',
      ].join('\n\n'),
      quickActions: [
        { id: 'go_forgot_pwd', label: '🔑 पासवर्ड रीसेट करा', prompt: 'I want to reset my password on the Forgot Password page' },
      ],
    },
    DAMAGED_ITEM_CREDIT: {
      intent: 'DAMAGED_ITEM_CREDIT',
      reply: [
        '🌿 **भूमीवेरा स्वच्छता आणि आर्टिसनल सुरक्षा मानक**',
        '*“१००% सीलबंद व्हर्जिन युनिट्स — २५० बाटल्यांच्या लहान बॅचमध्ये तयार.”*',
        'फेस वॉश आणि शाम्पू ही वैयक्तिक काळजी उत्पादने असल्याने स्वच्छता मानकांनुसार ती १००% सीलबंद व गैर-परतावा ठेवली जातात. प्रत्येक बाटलीचा एक युनिक अनुक्रमांक असतो जो /verify वर तपासता येतो. कोणतीही अडचण असल्यास ४८ तासांत अनबॉक्सिंग व्हिडिओ शेअर करा; कॉन्सिअर्ज टीम थेट मदत करेल.',
      ].join('\n\n'),
      quickActions: [
        { id: 'damaged_claim', label: '📹 अनबॉक्सिंग व्हिडिओ पडताळणी पाठवा', prompt: 'I want to submit an unboxing verification video to concierge' },
        { id: 'verify_serial', label: '🔬 बाटली अनुक्रमांक आणि लॅब टेस्ट', prompt: 'I want to verify the artisanal serial number and lab assay of my bottle' },
      ],
    },
    ORDER_TRACKING: {
      intent: 'ORDER_TRACKING',
      reply: [
        '📦 **भूमीवेरा थेट एक्सप्रेस डिलिव्हरी ट्रॅकिंग**',
        'सर्व ऑर्डर्स Delhivery आणि BlueDart द्वारे पाठवल्या जातात.\nमेट्रो शहरे: २ ते ३ दिवस | इतर शहरे: ३ ते ५ दिवस\nआपला ऑर्डर आयडी टाकून थेट ट्रॅक करा.',
      ].join('\n\n'),
      quickActions: [
        { id: 'open_tracker', label: '🚚 ट्रॅकिंग पेज उघडा', prompt: 'Open the Live Order Tracking page' },
      ],
    },
  },
};

export function matchAiIntentWithFuzzy(rawQuery = '', targetLangOverride) {
  const q = String(rawQuery || '').trim();
  if (!q) return null;

  const topIntent = scoreIntent(q);
  if (!topIntent) return null;

  const currentL = targetLangOverride || getCurrentLanguage();
  if (currentL && currentL !== 'en' && LOCALIZED_INTENT_RESPONSES[currentL]?.[topIntent]) {
    return LOCALIZED_INTENT_RESPONSES[currentL][topIntent];
  }

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

  // 2. Artisanal Sealed Virgin Custody & Concierge Resolution
  if (topIntent === 'DAMAGED_ITEM_CREDIT') {
    return {
      intent: 'DAMAGED_ITEM_CREDIT',
      reply: [
        '🌿 **Bhumivera Artisanal Custody & Executive Concierge Care**',
        '*“100% Sealed Virgin Unit Custody — Artisanal Small-Batch Formulations.”*',
        '**Sealed Virgin Custody:**\nBecause our botanical formulations (Activated Bamboo Charcoal Face Wash, Botanical Hair Cleanser, and Sea Buckthorn Face Wash) are intimate personal care cosmetics, each bottle is compounded in small artisanal runs of 250 units and sealed with tamper-evident security to guarantee 100% sterile virgin purity.',
        '**Verification & Concierge Resolution:**\nEvery bottle carries a serialized QR code verifiable on our /verify portal for calibrated pH (5.51) and spectrophotometric assays. If any parcel exhibits transit compromise upon arrival, submit your continuous 360° unboxing video showing the intact outer AWB label within 48 hours. Our executive concierge team directly reviews claims for verified patrons and coordinates immediate resolution.',
      ].join('\n\n'),
      quickActions: [
        { id: 'damaged_claim', label: '📹 Submit Unboxing Video Verification', prompt: 'I want to submit an unboxing verification video to concierge' },
        { id: 'verify_serial', label: '🔬 Verify Bottle Serial & Lab Assay', prompt: 'I want to verify the artisanal serial number and lab assay of my bottle' },
        { id: 'check_wallet', label: '💰 View My Wallet Balance', prompt: 'What is my current Bhumivera Wallet balance?' },
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
