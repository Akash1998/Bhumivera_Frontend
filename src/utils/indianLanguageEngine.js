/**
 * Bhumivera Indian Multi-Language Translation & Localization Engine
 * Supports Top 10 Most Spoken Indian Languages + English:
 * 1. English (en)
 * 2. Hindi - हिन्दी (hi)
 * 3. Bengali - বাংলা (bn)
 * 4. Marathi - मराठी (mr)
 * 5. Telugu - తెలుగు (te)
 * 6. Tamil - தமிழ் (ta)
 * 7. Gujarati - ગુજરાતી (gu)
 * 8. Urdu - اردو (ur)
 * 9. Kannada - ಕನ್ನಡ (kn)
 * 10. Malayalam - മലയാളം (ml)
 * 11. Punjabi - ਪੰਜਾਬੀ (pa)
 */

export const SUPPORTED_INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', flag: '🇬🇧', region: 'Pan-India' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', flag: '🇮🇳', region: 'North & Central India' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', flag: '🇮🇳', region: 'West Bengal & East' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', flag: '🇮🇳', region: 'Maharashtra' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', flag: '🇮🇳', region: 'Andhra Pradesh & Telangana' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', flag: '🇮🇳', region: 'Tamil Nadu' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', flag: '🇮🇳', region: 'Gujarat' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Perso-Arabic', flag: '🇮🇳', region: 'Pan-India' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', flag: '🇮🇳', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', flag: '🇮🇳', region: 'Kerala' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', flag: '🇮🇳', region: 'Punjab' },
];

export const TRANSLATION_DICTIONARY = {
  // Navigation & Core UI
  nav_home: {
    en: 'Home',
    hi: 'होम',
    bn: 'হোম',
    mr: 'मुख्यपृष्ठ',
    te: 'హోమ్',
    ta: 'முகப்பு',
    gu: 'હોમ',
    ur: 'ہوم',
    kn: 'ಮುಖಪುಟ',
    ml: 'ഹോം',
    pa: 'ਮੁੱਖ ਪੰਨਾ',
  },
  nav_shop: {
    en: 'Shop All Botanicals',
    hi: 'सभी उत्पाद देखें',
    bn: 'সব পণ্য দেখুন',
    mr: 'सर्व उत्पादने खरेदी करा',
    te: 'అన్ని ఉత్పత్తులు',
    ta: 'அனைத்து தயாரிப்புகள்',
    gu: 'બધા ઉત્પાદનો જુઓ',
    ur: 'تمام مصنوعات خریدیں',
    kn: 'ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು',
    ml: 'എല്ലാ ഉൽപ്പന്നങ്ങളും',
    pa: 'ਸਾਰੇ ਉਤਪਾਦ ਵੇਖੋ',
  },
  nav_science: {
    en: 'Botanical Science',
    hi: 'वानस्पतिक विज्ञान',
    bn: 'উদ্ভিদ বিজ্ঞান',
    mr: 'वनस्पती शास्त्र',
    te: 'బొటానికల్ సైన్స్',
    ta: 'தாவர அறிவியல்',
    gu: 'વનસ્પતિ વિજ્ઞાન',
    ur: 'نباتیاتی سائنس',
    kn: 'ಬೊಟಾನಿಕಲ್ ಸೈನ್ಸ್',
    ml: 'ബൊട്ടാണിക്കൽ സയൻസ്',
    pa: 'ਬੋਟੈਨੀਕਲ ਵਿਗਿਆਨ',
  },
  nav_cart: {
    en: 'Shopping Bag',
    hi: 'शॉपिंग बैग',
    bn: 'শপিং ব্যাগ',
    mr: 'खरेदी पिशवी',
    te: 'షాపింగ్ బ్యాగ్',
    ta: 'ஷாப்பிங் பை',
    gu: 'શોપિંગ બેગ',
    ur: 'شاپنگ بیگ',
    kn: 'ಶಾಪಿಂಗ್ ಬ್ಯಾಗ್',
    ml: 'ഷോപ്പിംഗ് ബാഗ്',
    pa: 'ਖਰੀਦਦਾਰੀ ਝੋਲਾ',
  },
  nav_profile: {
    en: 'Account Profile',
    hi: 'खाता प्रोफ़ाइल',
    bn: 'অ্যাকাউন্ট প্রোফাইল',
    mr: 'खाते प्रोफाइल',
    te: 'ఖాతా ప్రొఫైల్',
    ta: 'கணக்கு சுயவிவரம்',
    gu: 'એકાઉન્ટ પ્રોફાઇલ',
    ur: 'اکاؤنٹ پروفائل',
    kn: 'ಖಾತೆ ಪ್ರೊಫೈಲ್',
    ml: 'അക്കൗണ്ട് പ്രൊഫൈൽ',
    pa: 'ਖਾਤਾ ਪ੍ਰੋਫਾਈਲ',
  },
  nav_track_order: {
    en: 'Track Order',
    hi: 'ऑर्डर ट्रैक करें',
    bn: 'অর্ডার ট্র্যাক করুন',
    mr: 'ऑर्डर ट्रॅक करा',
    te: 'ఆర్డర్ ట్రాక్ చేయండి',
    ta: 'ஆர்டரைக் கண்காணிக்கவும்',
    gu: 'ઓર્ડર ટ્રેક કરો',
    ur: 'آرڈر ٹریک کریں',
    kn: 'ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    ml: 'ഓർഡർ ട്രാക്ക് ചെയ്യുക',
    pa: 'ਆਰਡਰ ਟਰੈਕ ਕਰੋ',
  },
  nav_ask_concierge: {
    en: 'Ask AI Concierge',
    hi: 'AI सलाहकार से पूछें',
    bn: 'AI সহযোগীকে জিজ্ঞাসা করুন',
    mr: 'AI सहाय्यकाला विचारा',
    te: 'AI కన్సియర్జ్ ను అడగండి',
    ta: 'AI உதவியாளரிடம் கேளுங்கள்',
    gu: 'AI સહાયકને પૂછો',
    ur: 'AI معاون سے پوچھیں',
    kn: 'AI ಸಹಾಯಕರನ್ನು ಕೇಳಿ',
    ml: 'AI സഹായിയോട് ചോദിക്കുക',
    pa: 'AI ਸਹਾਇਕ ਨੂੰ ਪੁੱਛੋ',
  },

  // Guarantees & Policy
  guarantee_hygiene_policy: {
    en: 'Hygiene & Courtesy Guarantee: As personal care cosmetics (face washes & shampoos), items cannot be physically returned once delivered. If damaged or leaking, we issue an instant replacement or courtesy wallet credit!',
    hi: 'स्वच्छता और सौजन्य गारंटी: व्यक्तिगत देखभाल कॉस्मेटिक्स (फेस वॉश और शैम्पू) होने के कारण, डिलीवरी के बाद इन्हें वापस नहीं लिया जा सकता। यदि आइटम क्षतिग्रस्त या लीक हुआ है, तो हम तुरंत मुफ्त प्रतिस्थापन या वॉलेट क्रेडिट देते हैं!',
    bn: 'স্বাস্থ্যবিধি ও সৌজন্য গ্যারান্টি: ফেসওয়াশ ও শ্যাম্পু ব্যক্তিগত প্রসাধন সামগ্রী হওয়ায় ডেলিভারির পর এগুলো ফেরত নেওয়া হয় না। ক্ষতিগ্রস্ত বা লিক হলে আমরা তৎক্ষণাৎ প্রতিস্থাপন বা ওয়ালেট ক্রেডিট প্রদান করি!',
    mr: 'स्वच्छता आणि सौजन्य हमी: फेस वॉश आणि शाम्पू हे वैयक्तिक काळजी सौंदर्यप्रसाधने असल्याने डिलिव्हरीनंतर ते परत घेतले जात नाहीत. नुकसान किंवा गळती असल्यास, आम्ही त्वरित मोफत बदलून देतो किंवा वॉलेट क्रेडिट देतो!',
    te: 'పరిశుభ్రత & మర్యాద హామీ: ఫేస్ వాష్ మరియు షాంపూలు వ్యక్తిగత సంరక్షణ సౌందర్య సాధనాలు కాబట్టి, డెలివరీ తర్వాత వాటిని తిరిగి తీసుకోలేము. ఉత్పత్తి దెబ్బతిన్నా లేదా లీకైనా, మేము తక్షణ రీప్లేస్‌మెంట్ లేదా వాలెట్ క్రెడిట్ ఇస్తాము!',
    ta: 'சுகாதாரம் மற்றும் நற்பெயர் உத்தரவாதம்: ஃபேஸ் வாஷ் மற்றும் ஷாம்பூ தனிப்பட்ட பராமரிப்பு பொருட்கள் என்பதால், டெலிவரிக்குப் பிறகு அவற்றை திரும்பப் பெற முடியாது. சேதமடைந்தால் அல்லது கசிந்தால், உடனடியாக மாற்றுப் பொருள் அல்லது வாலெட் கிரெடிட் தருகிறோம்!',
    gu: 'સ્વચ્છતા અને સૌજન્ય ગેરંટી: ફેસ વોશ અને શેમ્પૂ પર્સનલ કેર પ્રોડક્ટ્સ હોવાથી, ડિલિવરી પછી તે પરત લઈ શકાતા નથી. જો વસ્તુ ક્ષતિગ્રસ્ત અથવા લીક થઈ હોય, તો અમે તાત્કાલિક રિપ્લેસમેન્ટ અથવા વૉલેટ ક્રેડિટ આપીએ છીએ!',
    ur: 'حفظان صحت اور شکریہ کی ضمانت: چونکہ فیس واش اور شیمپو ذاتی نگہداشت کی اشیاء ہیں، اس لیے ڈلیوری کے بعد واپسی ممکن نہیں ہے۔ نقصان یا لیکیج کی صورت میں ہم فوری متبادل یا والیٹ کریڈٹ فراہم کرتے ہیں!',
    kn: 'ನೈರ್ಮಲ್ಯ ಮತ್ತು ಸೌಜನ್ಯ ಖಾತರಿ: ಫೇಸ್ ವಾಶ್ ಮತ್ತು ಶಾಂಪೂ ವೈಯಕ್ತಿಕ ಕಾಳಜಿಯ ಉತ್ಪನ್ನಗಳಾಗಿರುವುದರಿಂದ ಡೆಲಿವರಿ ನಂತರ ಹಿಂತಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ಹಾನಿಯಾಗಿದ್ದರೆ ಅಥವಾ ಸೋರಿಕೆಯಾಗಿದ್ದರೆ, ನಾವು ತಕ್ಷಣ ರಿಪ್ಲೇಸ್ಮೆಂಟ್ ಅಥವಾ ವಾಲೆಟ್ ಕ್ರೆಡಿಟ್ ನೀಡುತ್ತೇವೆ!',
    ml: 'ശുചിത്വ ഉറപ്പ്: ഫെയ്‌സ് വാഷും ഷാംപൂവും വ്യക്തിഗത സൗന്ദര്യവർദ്ധക വസ്തുക്കളായതിനാൽ ഡെലിവറിക്ക് ശേഷം തിരികെ എടുക്കാനാകില്ല. കേടുപാടുകൾ സംഭവിച്ചാൽ ഉടനടി സൗജന്യ റീപ്ലേസ്‌മെന്റോ വാലറ്റ് ക്രെഡിറ്റോ നൽകുന്നു!',
    pa: 'ਸਵੱਛਤਾ ਅਤੇ ਗਾਰੰਟੀ: ਫੇਸ ਵਾਸ਼ ਅਤੇ ਸ਼ੈਂਪੂ ਨਿੱਜੀ ਦੇਖਭਾਲ ਦੇ ਉਤਪਾਦ ਹੋਣ ਕਰਕੇ ਡਿਲੀਵਰੀ ਤੋਂ ਬਾਅਦ ਵਾਪਸ ਨਹੀਂ ਲਏ ਜਾ ਸਕਦੇ। ਜੇਕਰ ਕੋਈ ਨੁਕਸਾਨ ਜਾਂ ਲੀਕੇਜ ਹੋਵੇ ਤਾਂ ਅਸੀਂ ਤੁਰੰਤ ਨਵਾਂ ਉਤਪਾਦ ਜਾਂ ਵਾਲਿਟ ਕ੍ਰੈਡਿਟ ਦਿੰਦੇ ਹਾਂ!',
  },

  // Password Guide
  password_guide_title: {
    en: 'AI Password & Account Access Guide',
    hi: 'AI पासवर्ड और खाता सुरक्षा मार्गदर्शिका',
    bn: 'AI পাসওয়ার্ড ও অ্যাকাউন্ট অ্যাক্সেস নির্দেশিকা',
    mr: 'AI पासवर्ड आणि खाते सुरक्षा मार्गदर्शक',
    te: 'AI పాస్‌వర్డ్ & ఖాతా భద్రత గైడ్',
    ta: 'AI கடவுச்சொல் மற்றும் கணக்கு அணுகல் வழிகாட்டி',
    gu: 'AI પાસવર્ડ અને એકાઉન્ટ એક્સેસ ગાઇડ',
    ur: 'AI پاس ورڈ اور اکاؤنٹ رسائی گائیڈ',
    kn: 'AI ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತು ಖಾತೆ ಪ್ರವೇಶ ಮಾರ್ಗದರ್ಶಿ',
    ml: 'AI പാസ്‌വേഡ് & അക്കൗണ്ട് ആക്സസ് ഗൈഡ്',
    pa: 'AI ਪਾਸਵਰਡ ਅਤੇ ਖਾਤਾ ਸੁਰੱਖਿਆ ਗਾਈਡ',
  },
  password_rule_length: {
    en: '8 to 72 characters long',
    hi: '8 से 72 अक्षर लंबा',
    bn: '৮ থেকে ৭২ অক্ষরের হতে হবে',
    mr: '८ ते ७२ अक्षरे लांब',
    te: '8 నుండి 72 అక్షరాలు ఉండాలి',
    ta: '8 முதல் 72 எழுத்துக்கள் நீளம்',
    gu: '8 થી 72 અક્ષરો લાંબો',
    ur: '8 سے 72 حروف پر مشتمل',
    kn: '8 ರಿಂದ 72 ಅಕ್ಷರಗಳು',
    ml: '8 മുതൽ 72 അക്ഷരങ്ങൾ നീളം',
    pa: '8 ਤੋਂ 72 ਅੱਖਰ ਲੰਬਾ',
  },

  // Damaged Item Assistance
  damaged_item_title: {
    en: 'Damaged or Leaking Item Resolution',
    hi: 'क्षतिग्रस्त या लीक उत्पाद का तुरंत समाधान',
    bn: 'ক্ষতিগ্রস্ত বা লিক হওয়া পণ্যের সমাধান',
    mr: 'नुकसान किंवा गळती झालेल्या उत्पादनाचे त्वरित निवारण',
    te: 'దెబ్బతిన్న లేదా లీకైన ఉత్పత్తి పరిష్కారం',
    ta: 'சேதமடைந்த அல்லது கசிந்த பொருளுக்கான உடனடி தீர்வு',
    gu: 'ક્ષતિગ્રસ્ત અથવા લીક થયેલ વસ્તુનું ઝડપી સમાધાન',
    ur: 'خراب یا لیکیج والی اشیاء کا فوری حل',
    kn: 'ಹಾನಿಗೊಳಗಾದ ಅಥವಾ ಸೋರಿಕೆಯಾದ ಉತ್ಪನ್ನದ ಪರಿಹಾರ',
    ml: 'കേടുപാടുകൾ സംഭവിച്ച ഉൽപ്പന്നങ്ങളുടെ പരിഹാരം',
    pa: 'ਖਰਾਬ ਜਾਂ ਲੀਕ ਹੋਏ ਉਤਪਾਦ ਦਾ ਤੁਰੰਤ ਹੱਲ',
  },

  // Order Tracking
  order_tracking_title: {
    en: 'Live Express Delivery Tracking',
    hi: 'लाइव एक्सप्रेस डिलीवरी ट्रैकिंग',
    bn: 'লাইভ এক্সপ্রেস ডেলিভারি ট্র্যাকিং',
    mr: 'थेट एक्सप्रेस डिलिव्हरी ट्रॅकिंग',
    te: 'లైవ్ ఎక్స్‌ప్రెస్ డెలివరీ ట్రాకింగ్',
    ta: 'நேரலை எக்ஸ்பிரஸ் டெலிவரி கண்காணிப்பு',
    gu: 'લાઇવ એક્સપ્રેસ ડિલિવરી ટ્રેકિંગ',
    ur: 'لائیو ایکسپریس ڈلیوری ٹریکنگ',
    kn: 'ಲೈವ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಡೆಲಿವರಿ ಟ್ರ್ಯಾಕಿಂಗ್',
    ml: 'തത്സമയ എക്സ്പ്രസ് ഡെലിവറി ട്രാക്കിംഗ്',
    pa: 'ਲਾਈਵ ਐਕਸਪ੍ਰੈਸ ਡਿਲੀਵਰੀ ਟਰੈਕਿੰਗ',
  },

  // Skincare Layering
  layering_guide_title: {
    en: 'Chronobiological AM & PM Layering Ritual',
    hi: 'सुबह और शाम की स्किनकेयर दिनचर्या',
    bn: 'সকাল ও রাতের ত্বকের যত্ন ও ব্যবহারের নিয়ম',
    mr: 'सकाळ आणि संध्याकाळची स्किनकेअर दिनचर्या',
    te: 'ఉదయం & రాత్రి స్కిన్‌కేర్ లేయరింగ్ విధానం',
    ta: 'காலை மற்றும் இரவு சரும பராமரிப்பு வரிசைமுறை',
    gu: 'સવાર અને સાંજની સ્કિનકેર ક્રમ પદ્ધતિ',
    ur: 'صبح اور شام کے اسکن کیئر کے درست طریقے',
    kn: 'ಬೆಳಿಗ್ಗೆ ಮತ್ತು ಸಂಜೆಯ ತ್ವಚೆ ಸಂರಕ್ಷಣಾ ವಿಧಾನ',
    ml: 'രാവിലെയും വൈകുന്നേരവുമുള്ള ചർമ്മ സംരക്ഷണ ക്രമം',
    pa: 'ਸਵੇਰ ਅਤੇ ਸ਼ਾਮ ਦੀ ਸਕਿਨਕੇਅਰ ਵਰਤੋਂ ਦਾ ਤਰੀਕਾ',
  },
};

/**
 * Get the currently active language code from localStorage or navigator
 */
export function getCurrentLanguage() {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem('bhumivera_language');
    if (saved && SUPPORTED_INDIAN_LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }
    // Auto-detect Indian locales from navigator
    const browserLang = (navigator.language || '').split('-')[0].toLowerCase();
    const matched = SUPPORTED_INDIAN_LANGUAGES.find(l => l.code === browserLang);
    return matched ? matched.code : 'en';
  } catch {
    return 'en';
  }
}

/**
 * Switch active language across the application and trigger global event
 */
export function setLanguage(langCode) {
  if (typeof window === 'undefined') return;
  const target = SUPPORTED_INDIAN_LANGUAGES.some(l => l.code === langCode) ? langCode : 'en';
  try {
    localStorage.setItem('bhumivera_language', target);
    document.documentElement.lang = target;
    window.dispatchEvent(new CustomEvent('bhumivera:language-change', { detail: { lang: target } }));
  } catch (err) {
    console.error('[LanguageEngine] setLanguage error:', err);
  }
}

/**
 * Look up a translated string with fallback to English
 */
export function t(key, defaultFallback = '') {
  const lang = getCurrentLanguage();
  const entry = TRANSLATION_DICTIONARY[key];
  if (!entry) return defaultFallback;
  return entry[lang] || entry.en || defaultFallback;
}

/**
 * Dynamic Client-Side Page Translator (Google Neural Translation Bridge)
 * Activates seamless, non-intrusive in-place DOM translation for the whole website
 */
export function activateFullSiteTranslation(targetLangCode) {
  if (typeof window === 'undefined') return;
  const lang = targetLangCode || getCurrentLanguage();
  if (lang === 'en') {
    // Reset back to English
    const docCookie = document.cookie;
    if (docCookie.includes('googtrans')) {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
    }
    return;
  }

  // Set Google Translate cookie so the translation engine renders automatically
  document.cookie = `/en/${lang}; path=/;`;
  document.cookie = `googtrans=/en/${lang}; path=/;`;
  document.cookie = `googtrans=/en/${lang}; path=/; domain=.${window.location.hostname}`;

  // Dynamically load Google Translate non-blocking script if not already present
  if (!document.getElementById('bhumivera-google-translate-script')) {
    window.googleTranslateElementInit = function () {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,bn,mr,te,ta,gu,ur,kn,ml,pa',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      }
    };

    const s = document.createElement('script');
    s.id = 'bhumivera-google-translate-script';
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.body.appendChild(s);
  }
}
