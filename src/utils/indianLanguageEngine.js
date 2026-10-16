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
    te: 'AI కన్సియర్జ్ ను అడगండి',
    ta: 'AI உதவியாளரிடம் கேளுங்கள்',
    gu: 'AI સહાયકને પૂછો',
    ur: 'AI معاون سے پوچھیں',
    kn: 'AI ಸಹಾಯಕರನ್ನು ಕೇಳಿ',
    ml: 'AI സഹായിയോട് ചോദിക്കുക',
    pa: 'AI ਸਹਾਇਕ ਨੂੰ ਪੁੱਛੋ',
  },
  nav_impact: {
    en: 'Our impact',
    hi: 'हमारा प्रभाव',
    bn: 'আমাদের প্রভাব',
    mr: 'आमचा प्रभाव',
    te: 'మా ప్రభావం',
    ta: 'எங்கள் தாக்கம்',
    gu: 'અમારો પ્રભાવ',
    ur: 'ہمارا اثر',
    kn: 'ನಮ್ಮ ಪ್ರಭಾವ',
    ml: 'ഞങ്ങളുടെ സ്വാധീനം',
    pa: 'ਸਾਡਾ ਪ੍ਰਭਾਵ',
  },
  nav_support: {
    en: 'Boutique Support',
    hi: 'बुटीक सहायता',
    bn: 'সহায়তা কেন্দ্র',
    mr: 'मदत केंद्र',
    te: 'మద్దతు కేంద్రం',
    ta: 'ஆதரவு மையம்',
    gu: 'સહાયતા કેન્દ્ર',
    ur: 'سپورٹ سینٹر',
    kn: 'ಬೆಂಬಲ ಕೇಂದ್ರ',
    ml: 'സഹായ കേന്ദ്രം',
    pa: 'ਸਹਾਇਤਾ ਕੇਂਦਰ',
  },
  nav_signin: {
    en: 'Sign In',
    hi: 'साइन इन',
    bn: 'সাইন ইন',
    mr: 'साइन इन',
    te: 'సైన్ ఇన్',
    ta: 'உள்நுழைக',
    gu: 'સાઇન ઇન',
    ur: 'سائن ان',
    kn: 'ಸೈನ್ ಇನ್',
    ml: 'സൈൻ ഇൻ',
    pa: 'ਸਾਈਨ ਇਨ',
  },
  search_placeholder: {
    en: 'Search skincare, hair care, ingredients...',
    hi: 'स्किनकेयर, हेयर केयर या सामग्री खोजें...',
    bn: 'স্কিনকেয়ার বা উপাদান খুঁজুন...',
    mr: 'त्वचा काळजी किंवा घटक शोधा...',
    te: 'స్కిన్‌కేర్ లేదా ఉత్పత్తులను శోధించండి...',
    ta: 'சரும பராமரிப்பு பொருட்களைத் தேடுங்கள்...',
    gu: 'સ્કિનકેર અથવા ઘટકો શોધો...',
    ur: 'اسکن کیئر یا اشیاء تلاش کریں...',
    kn: 'ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ...',
    ml: 'ഉൽപ്പന്നങ്ങൾ തിരയുക...',
    pa: 'ਉਤਪਾਦ ਖੋਜੋ...',
  },
  search_action: {
    en: 'Discover',
    hi: 'खोजें',
    bn: 'অনুসন্ধান',
    mr: 'शोधा',
    te: 'కనుగొనండి',
    ta: 'கண்டறியுங்கள்',
    gu: 'શોધો',
    ur: 'دریافت کریں',
    kn: 'ಹುಡುಕಿ',
    ml: 'കണ്ടെത്തുക',
    pa: 'ਲੱਭੋ',
  },
  active_regimen: {
    en: 'Active Regimen',
    hi: 'सक्रिय दिनचर्या',
    bn: 'সক্রিয় নিয়ম',
    mr: 'सक्रिय दिनचर्या',
    te: 'యాక్టివ్ విధానం',
    ta: 'செயலில் உள்ள வழக்கம்',
    gu: 'સક્રિય પદ્ધતિ',
    ur: 'فعال معمول',
    kn: 'ಸಕ್ರಿಯ ನಿಯಮ',
    ml: 'സജീവ ക്രമം',
    pa: 'ਸਰਗਰਮ ਰੁਟੀਨ',
  },
  discover_science: {
    en: 'Discover the Science',
    hi: 'विज्ञान जानें',
    bn: 'বিজ্ঞান জানুন',
    mr: 'विज्ञान जाणा',
    te: 'సైన్స్ తెలుసుకోండి',
    ta: 'அறிவியலை அறிக',
    gu: 'વિજ્ઞાન જાણો',
    ur: 'سائنس جانیے',
    kn: 'ವಿಜ್ಞಾನ ತಿಳಿಯಿರಿ',
    ml: 'ശാസ്ത്രം അറിയുക',
    pa: 'ਵਿਗਿਆਨ ਜਾਣੋ',
  },
  nav_offers: {
    en: 'Offers',
    hi: 'ऑफ़र्स',
    bn: 'অফার',
    mr: 'ऑफर',
    te: 'ఆఫర్లు',
    ta: 'சலுகைகள்',
    gu: 'ઑફર્સ',
    ur: 'پیشکشیں',
    kn: 'ಆಫರ್ಗಳು',
    ml: 'ഓഫറുകൾ',
    pa: 'ਆਫਰ',
  },
  nav_story: {
    en: 'Our story',
    hi: 'हमारी कहानी',
    bn: 'আমাদের গল্প',
    mr: 'आमची कथा',
    te: 'మా కథ',
    ta: 'எங்கள் கதை',
    gu: 'અમારી વાર્તા',
    ur: 'ہماری کہانی',
    kn: 'ನಮ್ಮ ಕಥೆ',
    ml: 'ഞങ്ങളുടെ കഥ',
    pa: 'ਸਾਡੀ ਕਹਾਣੀ',
  },
  nav_help: {
    en: 'Help & support',
    hi: 'सहायता और संपर्क',
    bn: 'সাহায্য ও সহায়তা',
    mr: 'मदत आणि सहकार्य',
    te: 'సహాయం & మద్దతు',
    ta: 'உதவி மற்றும் ஆதரவு',
    gu: 'મદદ અને સહાય',
    ur: 'مدد اور سپورٹ',
    kn: 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ',
    ml: 'സഹായവും പിന്തുണയും',
    pa: 'ਸਹਾਇਤਾ ਅਤੇ ਸਹਿਯੋਗ',
  },
  nav_register: {
    en: 'Create an account',
    hi: 'खाता बनाएं',
    bn: 'অ্যাকাউন্ট খুলুন',
    mr: 'खाते तयार करा',
    te: 'ఖాతా సృష్టించండి',
    ta: 'கணக்கு தொடங்கவும்',
    gu: 'એકાઉન્ટ બનાવો',
    ur: 'نیا اکاؤنٹ بنائیں',
    kn: 'ಖಾತೆ ತೆರೆಯಿರಿ',
    ml: 'അക്കൗണ്ട് നിർമ്മിക്കുക',
    pa: 'ਖਾਤਾ ਬਣਾਓ',
  },
  nav_wishlist: {
    en: 'Wishlist',
    hi: 'विशलिस्ट',
    bn: 'পছন্দের তালিকা',
    mr: 'आवडते',
    te: 'విష్‌లిస్ట్',
    ta: 'விருப்பப் பட்டியல்',
    gu: 'વિશલિસ્ટ',
    ur: 'پسندیدہ فہرست',
    kn: 'ವಿಶ್ಲಿಸ್ಟ್',
    ml: 'വിഷ്‌ലിസ്റ്റ്',
    pa: 'ਪਸੰਦੀਦਾ ਸੂਚੀ',
  },
  nav_compare: {
    en: 'Compare products',
    hi: 'तुलना करें',
    bn: 'পণ্য তুলনা',
    mr: 'तुलना करा',
    te: 'పోల్చండి',
    ta: 'ஒப்பீடு செய்க',
    gu: 'સરખામણી કરો',
    ur: 'موازنہ کریں',
    kn: 'ಹೋಲಿಕೆ ಮಾಡಿ',
    ml: 'താരതമ്യം ചെയ്യുക',
    pa: 'ਤੁਲਨਾ ਕਰੋ',
  },
  nav_damaged_credit: {
    en: 'Damaged item & courtesy credit',
    hi: 'क्षतिग्रस्त उत्पाद और सौजन्य क्रेडिट',
    bn: 'ক্ষতিগ্রস্ত পণ্য ও সৌজন্য ক্রেডিট',
    mr: 'नुकसान झालेले उत्पादन आणि सौजन्य क्रेडिट',
    te: 'దెబ్బతిన్న ఉత్పత్తి & మర్యాద క్రెడిట్',
    ta: 'சேதமடைந்த பொருள் & கிரெடிட்',
    gu: 'ક્ષતિગ્રસ્ત વસ્તુ અને ક્રેડિટ',
    ur: 'خراب اشیاء اور کریڈٹ',
    kn: 'ಹಾನಿಗೊಳಗಾದ ವಸ್ತು ಮತ್ತು ಕ್ರೆಡಿಟ್',
    ml: 'കേടുവന്ന ഉൽപ്പന്നവും ക്രെഡിറ്റും',
    pa: 'ਖਰਾਬ ਉਤਪਾਦ ਅਤੇ ਵਾਲਿਟ ਕ੍ਰੈਡਿਟ',
  },
  concierge_title: {
    en: 'Bhumivera Client Concierge',
    hi: 'भूमिअवेरा क्लाइंट सलाहकार',
    bn: 'ভূমিভেরা ক্লায়েন্ট সহায়ক',
    mr: 'भूमीवेरा क्लायंट सहाय्यक',
    te: 'భూమివేర క్లయింట్ కన్సియర్జ్',
    ta: 'பூமிவேரா வாடிக்கையாளர் உதவியாளர்',
    gu: 'ભૂમિવેરા ક્લાયન્ટ સહાયક',
    ur: 'بھومی ویرا کلائنٹ معاون',
    kn: 'ಭೂಮಿವೇರ ಕ್ಲೈಂಟ್ ಸಹಾಯಕ',
    ml: 'ഭൂമിവേര ക്ലയന്റ് സഹായി',
    pa: 'ਭੂਮੀਵੇਰਾ ਕਲਾਇੰਟ ਸਹਾਇਕ',
  },
  concierge_subtitle: {
    en: '✦ Ayurvedic Botanical AI · Always Active',
    hi: '✦ आयुर्वेदिक वानस्पतिक AI · हमेशा सक्रिय',
    bn: '✦ আয়ুর্বেদিক ভেষজ AI · সর্বদা সক্রিয়',
    mr: '✦ आयुर्वेदिक वनस्पती AI · सदैव सक्रिय',
    te: '✦ ఆయుర్వేద బొటానికల్ AI · ఎల్లప్పుడూ సక్రియం',
    ta: '✦ ஆயுர்வேத தாவர AI · எப்போதும் செயல்படுகிறது',
    gu: '✦ આયુર્વેદિક વનસ્પતિ AI · હંમેશા સક્રિય',
    ur: '✦ آیورویدک نباتیاتی AI · ہمیشہ متحرک',
    kn: '✦ ಆಯುರ್ವೇದ ಬೊಟಾನಿಕಲ್ AI · ಯಾವಾಗಲೂ ಸಕ್ರಿಯ',
    ml: '✦ ആയുർവേദ ബൊട്ടാണിക്കൽ AI · എപ്പോഴും സജീവം',
    pa: '✦ ਆਯੁਰਵੈਦਿਕ ਬੋਟੈਨੀਕਲ AI · ਹਮੇਸ਼ਾ ਕਿਰਿਆਸ਼ੀਲ',
  },
  concierge_verify_order: {
    en: 'Verify Order',
    hi: 'ऑर्डर सत्यापित करें',
    bn: 'অর্ডার যাচাই করুন',
    mr: 'ऑर्डर तपासा',
    te: 'ఆర్డర్ ధృవీకరించండి',
    ta: 'ஆர்டரை சரிபார்க்கவும்',
    gu: 'ઓર્ડર ચકાસો',
    ur: 'آرڈر تصدیق کریں',
    kn: 'ಆರ್ಡರ್ ಪರಿಶೀಲಿಸಿ',
    ml: 'ഓർഡർ പരിശോധിക്കുക',
    pa: 'ਆਰਡਰ ਜਾਂਚੋ',
  },
  concierge_input_placeholder: {
    en: 'Ask about ingredients, orders, rituals, or enter an Order ID...',
    hi: 'सामग्री, ऑर्डर, दिनचर्या या ऑर्डर आईडी के बारे में पूछें...',
    bn: 'উপাদান, অর্ডার, নিয়ম বা অর্ডার আইডি সম্পর্কে জিজ্ঞাসা করুন...',
    mr: 'घटक, ऑर्डर, दिनचर्या किंवा ऑर्डर आयडी बद्दल विचारा...',
    te: 'పదార్థాలు, ఆర్డర్‌లు లేదా ఆర్డర్ ఐడి గురించి అడగండి...',
    ta: 'பொருட்கள், ஆர்டர்கள் அல்லது ஆர்டர் ஐடி பற்றி கேளுங்கள்...',
    gu: 'ઘટકો, ઓર્ડર અથવા ઓર્ડર આઈડી વિશે પૂછો...',
    ur: 'اجزاء، آرڈرز یا آرڈر آئی ڈی کے بارے میں پوچھیں...',
    kn: 'ಘಟಕಗಳು, ಆರ್ಡರ್‌ಗಳು ಅಥವಾ ಆರ್ಡರ್ ಐಡಿ ಬಗ್ಗೆ ಕೇಳಿ...',
    ml: 'ചേരുവകൾ, ഓർഡറുകൾ അല്ലെങ്കിൽ ഓർഡർ ഐഡിയെക്കുറിച്ച് ചോദിക്കുക...',
    pa: 'ਸਮੱਗਰੀ, ਆਰਡਰ ਜਾਂ ਆਰਡਰ ਆਈਡੀ ਬਾਰੇ ਪੁੱਛੋ...',
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
};

/**
 * Universal phrase translation map for client DOM node replacement
 */
export const DOM_PHRASE_DICTIONARY = {
  hi: {
    'Home': 'होम',
    'Shop': 'शॉप',
    'Shop all': 'सभी उत्पाद',
    'Shop All Botanicals': 'सभी वानस्पतिक उत्पाद',
    'Offers': 'ऑफ़र्स',
    'Our science': 'हमारा विज्ञान',
    'Our story': 'हमारी कहानी',
    'Our roots': 'हमारी जड़ें',
    'Our impact': 'हमारा प्रभाव',
    'Giving back': 'समाज सेवा',
    'Help & support': 'सहायता और संपर्क',
    'We’re here': 'हम आपके साथ हैं',
    'Botanical Science': 'वानस्पतिक विज्ञान',
    'Active Regimen': 'सक्रिय दिनचर्या',
    'Discover the Science': 'विज्ञान जानें',
    'Sign In': 'साइन इन',
    'Join Bhumivera': 'खाता बनाएं',
    'Create an account': 'खाता बनाएं',
    'My account': 'मेरा खाता',
    'Shopping Bag': 'शॉपिंग बैग',
    'Track an order': 'ऑर्डर ट्रैक करें',
    'Track Orders': 'ऑर्डर ट्रैक करें',
    'Wishlist': 'विशलिस्ट',
    'Compare products': 'तुलना करें',
    'Damaged item & courtesy credit': 'क्षतिग्रस्त उत्पाद और सौजन्य क्रेडिट',
    'Damaged Items & Courtesy Credit': 'क्षतिग्रस्त उत्पाद और सौजन्य क्रेडिट',
    'Help & Support Guide': 'सहायता मार्गदर्शिका',
    'Customer Care Helpline': 'कस्टमर केयर हेल्पलाइन',
    'Conditions of Use & Sale': 'उपयोग और बिक्री की शर्तें',
    'Privacy Policy': 'गोपनीयता नीति',
    'Connect With Us': 'हमसे जुड़ें',
    'Telegram Community': 'टेलीग्राम कम्युनिटी',
    'Verify Product Authenticity': 'प्रामाणिकता सत्यापित करें',
    'E-Warranty Registration': 'ई-वारंटी पंजीकरण',
    'Bhumivera Client Concierge': 'भूमिअवेरा क्लाइंट सलाहकार',
    'Ayurvedic Botanical AI · Always Active': 'आयुर्वेदिक वानस्पतिक AI · हमेशा सक्रिय',
    'Verify Order': 'ऑर्डर सत्यापित करें',
    'Ask AI Guide': 'AI गाइड से पूछें',
    'Visual Guide': 'विजुअल गाइड',
    'Map Guide': 'मैप गाइड',
    'Delivery Visual Guide': 'डिलीवरी विजुअल गाइड',
    'Add to Bag': 'बैग में जोड़ें',
    'Buy Now': 'अभी खरीदें',
    'View Details': 'विवरण देखें',
    'Reset your password': 'अपना पासवर्ड रीसेट करें',
    'Verify your email': 'अपना ईमेल सत्यापित करें',
    'Set new password': 'नया पासवर्ड सेट करें',
    'Back to login': 'लॉगिन पर वापस जाएं',
    'Address Book': 'पता पुस्तिका',
    'Add New Address': 'नया पता जोड़ें',
    'Natural Purity. Premium Care.': 'प्राकृतिक शुद्धता. प्रीमियम देखभाल.',
    'Replacement & Courtesy Credit Policy': 'प्रतिस्थापन और सौजन्य क्रेडिट नीति',
    'What to Do If an Item Arrives Damaged': 'यदि आइटम क्षतिग्रस्त मिले तो क्या करें',
    'Snap a Quick Photo': 'एक फोटो खींचें',
    'Instant Replacement or Store Credit': 'तुरंत नया उत्पाद या स्टोर क्रेडिट',
    'Frequently Asked Questions': 'अक्सर पूछे जाने वाले प्रश्न',
    'Need Help with an Order?': 'ऑर्डर में सहायता चाहिए?',
    'View My Orders': 'मेरे ऑर्डर देखें',
    'Message AI Concierge': 'AI सलाहकार से बात करें',
    'Search skincare, hair care, ingredients...': 'स्किनकेयर, हेयर केयर या सामग्री खोजें...',
    'Discover': 'खोजें',
    'A more thoughtful ritual': 'एक विचारशील दिनचर्या',
    'Find your kind of care.': 'अपनी त्वचा की सही देखभाल पाएं।',
    'Your account': 'आपका खाता',
    'Orders, saved care & more': 'ऑर्डर, सहेजी गई सामग्री और अधिक',
    'Made with care · rooted in nature': 'प्रकृति से प्रेरित · प्रेम से निर्मित',
  },
  bn: {
    'Home': 'হোম',
    'Shop': 'শপ',
    'Shop all': 'সব পণ্য',
    'Shop All Botanicals': 'সব ভেষজ পণ্য',
    'Offers': 'অফার',
    'Our science': 'আমাদের বিজ্ঞান',
    'Our story': 'আমাদের গল্প',
    'Our roots': 'আমাদের শিকড়',
    'Our impact': 'আমাদের প্রভাব',
    'Help & support': 'সাহায্য ও সহায়তা',
    'Botanical Science': 'উদ্ভিদ বিজ্ঞান',
    'Sign In': 'সাইন ইন',
    'Join Bhumivera': 'যুক্ত হন',
    'Create an account': 'অ্যাকাউন্ট খুলুন',
    'My account': 'আমার অ্যাকাউন্ট',
    'Shopping Bag': 'শপিং ব্যাগ',
    'Track an order': 'অর্ডার ট্র্যাক করুন',
    'Track Orders': 'অর্ডার ট্র্যাক করুন',
    'Wishlist': 'পছন্দের তালিকা',
    'Compare products': 'পণ্য তুলনা',
    'Damaged item & courtesy credit': 'ক্ষতিগ্রস্ত পণ্য ও সৌজন্য ক্রেডিট',
    'Damaged Items & Courtesy Credit': 'ক্ষতিগ্রস্ত পণ্য ও সৌজন্য ক্রেডিট',
    'Help & Support Guide': 'সহায়তা গাইড',
    'Connect With Us': 'আমাদের সাথে যুক্ত হন',
    'Bhumivera Client Concierge': 'ক্লায়েন্ট সহায়ক',
    'Verify Order': 'অর্ডার যাচাই করুন',
    'Ask AI Guide': 'AI গাইডকে জিজ্ঞাসা করুন',
    'Visual Guide': 'ভিজ্যুয়াল গাইড',
    'Map Guide': 'ম্যাপ গাইড',
    'Add to Bag': 'ব্যাগে যোগ করুন',
    'Buy Now': 'এখনই কিনুন',
    'View Details': 'বিস্তারিত দেখুন',
    'Reset your password': 'পাসওয়ার্ড রিসেট করুন',
    'Address Book': 'ঠিকানা খাতা',
    'Add New Address': 'নতুন ঠিকানা যোগ করুন',
    'Natural Purity. Premium Care.': 'প্রাকৃতিক বিশুদ্ধতা. প্রিমিয়াম যত্ন.',
    'Replacement & Courtesy Credit Policy': 'প্রতিস্থাপন ও সৌজন্য ক্রেডিট নীতি',
    'Search skincare, hair care, ingredients...': 'স্কিনকেয়ার বা উপাদান খুঁজুন...',
    'Discover': 'অনুসন্ধান',
  },
  mr: {
    'Home': 'मुख्यपृष्ठ',
    'Shop': 'खरेदी करा',
    'Shop all': 'सर्व उत्पादने',
    'Shop All Botanicals': 'सर्व वनस्पती उत्पादने',
    'Offers': 'ऑफर',
    'Our science': 'आमचे विज्ञान',
    'Our story': 'आमची कथा',
    'Help & support': 'मदत आणि सहकार्य',
    'Botanical Science': 'वनस्पती शास्त्र',
    'Sign In': 'साइन इन',
    'Join Bhumivera': 'खाते तयार करा',
    'Create an account': 'खाते तयार करा',
    'My account': 'माझे खाते',
    'Shopping Bag': 'खरेदी पिशवी',
    'Track an order': 'ऑर्डर ट्रॅक करा',
    'Track Orders': 'ऑर्डर ट्रॅक करा',
    'Wishlist': 'आवडते',
    'Damaged item & courtesy credit': 'नुकसान झालेले उत्पादन आणि सौजन्य क्रेडिट',
    'Damaged Items & Courtesy Credit': 'नुकसान झालेले उत्पादन आणि सौजन्य क्रेडिट',
    'Help & Support Guide': 'मदत मार्गदर्शक',
    'Connect With Us': 'आमच्याशी जोडा',
    'Verify Order': 'ऑर्डर तपासा',
    'Ask AI Guide': 'AI मदतनीसाला विचारा',
    'Visual Guide': 'चित्रात्मक मार्गदर्शक',
    'Map Guide': 'नकाशा मार्गदर्शक',
    'Add to Bag': 'बॅगमध्ये जोडा',
    'Buy Now': 'आता खरेदी करा',
    'View Details': 'तपशील पहा',
    'Reset your password': 'पासवर्ड रीसेट करा',
    'Address Book': 'पत्ता पुस्तिका',
    'Add New Address': 'नवीन पत्ता जोडा',
    'Search skincare, hair care, ingredients...': 'त्वचा काळजी किंवा घटक शोधा...',
    'Discover': 'शोधा',
  },
  te: {
    'Home': 'హోమ్',
    'Shop': 'షాప్',
    'Shop all': 'అన్ని ఉత్పత్తులు',
    'Offers': 'ఆఫర్లు',
    'Our science': 'మా సైన్స్',
    'Our story': 'మా కథ',
    'Help & support': 'సహాయం & మద్దతు',
    'Botanical Science': 'బొటానికల్ సైన్స్',
    'Sign In': 'సైన్ ఇన్',
    'My account': 'నా ఖాతా',
    'Shopping Bag': 'షాపింగ్ బ్యాగ్',
    'Track an order': 'ఆర్డర్ ట్రాక్ చేయండి',
    'Track Orders': 'ఆర్డర్ ట్రాక్ చేయండి',
    'Damaged item & courtesy credit': 'దెబ్బతిన్న ఉత్పత్తి & మర్యాద క్రెడిట్',
    'Help & Support Guide': 'సహాయక గైడ్',
    'Connect With Us': 'మమ్మల్ని సంప్రదించండి',
    'Verify Order': 'ఆర్డర్ ధృవీకరించండి',
    'Ask AI Guide': 'AI గైడ్ ని అడగండి',
    'Visual Guide': 'విజువల్ గైడ్',
    'Map Guide': 'మ్యాప్ గైడ్',
    'Add to Bag': 'బ్యాగ్‌కు జోడించండి',
    'Buy Now': 'ఇప్పుడే కొనండి',
    'Reset your password': 'పాస్‌వర్డ్‌ను రీసెట్ చేయండి',
    'Address Book': 'చిరునామా పుస్తకం',
    'Add New Address': 'కొత్త చిరునామా జోడించండి',
    'Search skincare, hair care, ingredients...': 'స్కిన్‌కేర్ లేదా ఉత్పత్తులను శోధించండి...',
    'Discover': 'కనుగొనండి',
  },
  ta: {
    'Home': 'முகப்பு',
    'Shop': 'ஷாப்பிங்',
    'Shop all': 'அனைத்து பொருட்கள்',
    'Offers': 'சலுகைகள்',
    'Our science': 'எங்கள் அறிவியல்',
    'Our story': 'எங்கள் கதை',
    'Help & support': 'உதவி மற்றும் ஆதரவு',
    'Botanical Science': 'தாவர அறிவியல்',
    'Sign In': 'உள்நுழைக',
    'My account': 'என் கணக்கு',
    'Shopping Bag': 'ஷாப்பிங் பை',
    'Track an order': 'ஆர்டரை கண்காணிக்கவும்',
    'Track Orders': 'ஆர்டரை கண்காணிக்கவும்',
    'Damaged item & courtesy credit': 'சேதமடைந்த பொருள் & கிரெடிட்',
    'Help & Support Guide': 'உதவி வழிகாட்டி',
    'Connect With Us': 'எங்களுடன் இணையுங்கள்',
    'Verify Order': 'ஆர்டரை சரிபார்க்கவும்',
    'Ask AI Guide': 'AI வழிகாட்டியிடம் கேளுங்கள்',
    'Visual Guide': 'படக் குறிப்பு',
    'Map Guide': 'வரைபட வழிகாட்டி',
    'Add to Bag': 'பையில் சேர்க்கவும்',
    'Buy Now': 'இப்போதே வாங்கவும்',
    'Reset your password': 'கடவுச்சொல்லை மீட்டமைക്കുക',
    'Address Book': 'முகவரி புத்தகம்',
    'Add New Address': 'புதிய முகவரி சேர்க்கவும்',
    'Search skincare, hair care, ingredients...': 'சரும பராமரிப்பு பொருட்களைத் தேடுங்கள்...',
    'Discover': 'கண்டறியுங்கள்',
  },
  gu: {
    'Home': 'હોમ',
    'Shop': 'શોપ',
    'Shop all': 'બધી વસ્તુઓ',
    'Offers': 'ઑફર્સ',
    'Our science': 'અમારું વિજ્ઞાન',
    'Our story': 'અમારી વાર્તા',
    'Help & support': 'મદદ અને સહાય',
    'Botanical Science': 'વનસ્પતિ વિજ્ઞાન',
    'Sign In': 'સાઇન ઇન',
    'My account': 'મારું એકાઉન્ટ',
    'Shopping Bag': 'શોપિંગ બેગ',
    'Track an order': 'ઓર્ડર ટ્રેક કરો',
    'Track Orders': 'ઓર્ડર ટ્રેક કરો',
    'Damaged item & courtesy credit': 'ક્ષતિગ્રસ્ત વસ્તુ અને ક્રેડિટ',
    'Help & Support Guide': 'સહાયક માર્ગદર્શિકા',
    'Connect With Us': 'અમારી સાથે જોડાઓ',
    'Verify Order': 'ઓર્ડર ચકાસો',
    'Ask AI Guide': 'AI ગાઇડને પૂછો',
    'Visual Guide': 'વિઝ્યુઅલ ગાઇડ',
    'Map Guide': 'નકશા માર્ગદર્શિકા',
    'Add to Bag': 'બેગમાં ઉમેરો',
    'Buy Now': 'હમણાં ખરીદો',
    'Reset your password': 'પાસવર્ડ રીસેટ કરો',
    'Address Book': 'સરનામાં પુસ્તિકા',
    'Add New Address': 'નવું સરનામું ઉમેરો',
    'Search skincare, hair care, ingredients...': 'સ્કિનકેર અથવા ઘટકો શોધો...',
    'Discover': 'શોધો',
  },
  ur: {
    'Home': 'ہوم',
    'Shop': 'شاپ',
    'Shop all': 'تمام مصنوعات',
    'Offers': 'پیشکشیں',
    'Our science': 'ہماری سائنس',
    'Our story': 'ہماری کہانی',
    'Help & support': 'مدد اور سپورٹ',
    'Botanical Science': 'نباتیاتی سائنس',
    'Sign In': 'سائن ان',
    'My account': 'میرا اکاؤنٹ',
    'Shopping Bag': 'شاپنگ بیگ',
    'Track an order': 'آرڈر ٹریک کریں',
    'Track Orders': 'آرڈر ٹریک کریں',
    'Damaged item & courtesy credit': 'خراب اشیاء اور کریڈٹ',
    'Help & Support Guide': 'رہنمائی گائیڈ',
    'Connect With Us': 'ہم سے رابطہ کریں',
    'Verify Order': 'آرڈر کی تصدیق کریں',
    'Ask AI Guide': 'AI سے پوچھیں',
    'Visual Guide': 'بصری گائیڈ',
    'Map Guide': 'نقشہ گائیڈ',
    'Add to Bag': 'بیگ میں شامل کریں',
    'Buy Now': 'ابھی خریدیں',
    'Reset your password': 'پاس ورڈ دوبارہ ترتیب دیں',
    'Address Book': 'ایڈریس بک',
    'Add New Address': 'نیا پتہ شامل کریں',
    'Search skincare, hair care, ingredients...': 'اسکن کیئر یا اشیاء تلاش کریں...',
    'Discover': 'دریافت کریں',
  },
  kn: {
    'Home': 'ಮುಖಪುಟ',
    'Shop': 'ಶಾಪ್',
    'Shop all': 'ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು',
    'Offers': 'ಆಫರ್ಗಳು',
    'Our science': 'ನಮ್ಮ ವಿಜ್ಞಾನ',
    'Help & support': 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ',
    'Botanical Science': 'ಬೊಟಾನಿಕಲ್ ಸೈನ್ಸ್',
    'Sign In': 'ಸೈನ್ ಇನ್',
    'My account': 'ನನ್ನ ಖಾತೆ',
    'Shopping Bag': 'ಶಾಪಿಂಗ್ ಬ್ಯಾಗ್',
    'Track an order': 'ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    'Track Orders': 'ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    'Damaged item & courtesy credit': 'ಹಾನಿಗೊಳಗಾದ ವಸ್ತು ಮತ್ತು ಕ್ರೆಡಿಟ್',
    'Help & Support Guide': 'ಸಹಾಯ ಮಾರ್ಗದರ್ಶಿ',
    'Connect With Us': 'ನಮ್ಮೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ',
    'Verify Order': 'ಆರ್ಡರ್ ಪರಿಶೀಲಿಸಿ',
    'Ask AI Guide': 'AI ಗೈಡ್ ಕೇಳಿ',
    'Visual Guide': 'ಚಿತ್ರ ಮಾರ್ಗದರ್ಶಿ',
    'Map Guide': 'ಮ್ಯಾಪ್ ಗೈಡ್',
    'Add to Bag': 'ಬ್ಯಾಗ್ಗೆ ಸೇರಿಸಿ',
    'Buy Now': 'ಈಗಲೇ ಖರೀದಿಸಿ',
    'Reset your password': 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ',
    'Address Book': 'ವಿಳಾಸ ಪುಸ್ತಕ',
    'Add New Address': 'ಹೊಸ ವಿಳಾಸ ಸೇರಿಸಿ',
    'Search skincare, hair care, ingredients...': 'ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ...',
    'Discover': 'ಹುಡುಕಿ',
  },
  ml: {
    'Home': 'ഹോം',
    'Shop': 'ഷോപ്പ്',
    'Shop all': 'എല്ലാ ഉൽപ്പന്നങ്ങളും',
    'Offers': 'ഓഫറുകൾ',
    'Our science': 'ഞങ്ങളുടെ ശാസ്ത്രം',
    'Help & support': 'സഹായവും പിന്തുണയും',
    'Botanical Science': 'ബൊട്ടാണിക്കൽ സയൻസ്',
    'Sign In': 'സൈൻ ഇൻ',
    'My account': 'എന്റെ അക്കൗണ്ട്',
    'Shopping Bag': 'ഷോപ്പിംഗ് ബാഗ്',
    'Track an order': 'ഓർഡർ ട്രാക്ക് ചെയ്യുക',
    'Track Orders': 'ഓർഡർ ട്രാക്ക് ചെയ്യുക',
    'Damaged item & courtesy credit': 'കേടുവന്ന ഉൽപ്പന്നവും ക്രെഡിറ്റും',
    'Help & Support Guide': 'സഹായ മാർഗ്ഗനിർദ്ദേശം',
    'Connect With Us': 'ഞങ്ങളുമായി ബന്ധപ്പെടുക',
    'Verify Order': 'ഓർഡർ പരിശോധിക്കുക',
    'Ask AI Guide': 'AI ഗൈഡിനോട് ചോദിക്കുക',
    'Visual Guide': 'വിഷ്വൽ ഗൈഡ്',
    'Map Guide': 'മാപ്പ് ഗൈഡ്',
    'Add to Bag': 'ബാഗിലേക്ക് ചേർക്കുക',
    'Buy Now': 'ഇപ്പോൾ വാങ്ങുക',
    'Reset your password': 'പാസ്‌വേഡ് റീസെറ്റ് ചെയ്യുക',
    'Address Book': 'വിലാസ പുസ്തകം',
    'Add New Address': 'പുതിയ വിലാസം ചേർക്കുക',
    'Search skincare, hair care, ingredients...': 'ഉൽപ്പന്നങ്ങൾ തിരയുക...',
    'Discover': 'കണ്ടെത്തുക',
  },
  pa: {
    'Home': 'ਮੁੱਖ ਪੰਨਾ',
    'Shop': 'ਦੁਕਾਨ',
    'Shop all': 'ਸਾਰੇ ਉਤਪਾਦ',
    'Offers': 'ਆਫਰ',
    'Our science': 'ਸਾਡਾ ਵਿਗਿਆਨ',
    'Help & support': 'ਸਹਾਇਤਾ ਅਤੇ ਸਹਿਯੋਗ',
    'Botanical Science': 'ਬੋਟੈਨੀਕਲ ਵਿਗਿਆਨ',
    'Sign In': 'ਸਾਈਨ ਇਨ',
    'My account': 'ਮੇਰਾ ਖਾਤਾ',
    'Shopping Bag': 'ਖਰੀਦਦਾਰੀ ਝੋਲਾ',
    'Track an order': 'ਆਰਡਰ ਟਰੈਕ ਕਰੋ',
    'Track Orders': 'ਆਰਡਰ ਟਰੈਕ ਕਰੋ',
    'Damaged item & courtesy credit': 'ਖਰਾਬ ਉਤਪਾਦ ਅਤੇ ਵਾਲਿਟ ਕ੍ਰੈਡਿਟ',
    'Help & Support Guide': 'ਸਹਾਇਤਾ ਗਾਈਡ',
    'Connect With Us': 'ਸਾਡੇ ਨਾਲ ਜੁੜੋ',
    'Verify Order': 'ਆਰਡਰ ਦੀ ਜਾਂਚ ਕਰੋ',
    'Ask AI Guide': 'AI ਗਾਈਡ ਨੂੰ ਪੁੱਛੋ',
    'Visual Guide': 'ਵਿਜ਼ੂਅਲ ਗਾਈਡ',
    'Map Guide': 'ਨਕਸ਼ਾ ਗਾਈਡ',
    'Add to Bag': 'ਬੈਗ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ',
    'Buy Now': 'ਹੁਣੇ ਖਰੀਦੋ',
    'Reset your password': 'ਪਾਸਵਰਡ ਰੀਸੈੱਟ ਕਰੋ',
    'Address Book': 'ਪਤਾ ਪੁਸਤਕ',
    'Add New Address': 'ਨਵਾਂ ਪਤਾ ਸ਼ਾਮਲ ਕਰੋ',
    'Search skincare, hair care, ingredients...': 'ਉਤਪਾਦ ਖੋਜੋ...',
    'Discover': 'ਲੱਭੋ',
  },
};

const ORIGINAL_TEXT_MAP = new WeakMap();
let domObserver = null;

/**
 * High-speed in-place DOM translation walker
 * Replaces visible English text nodes with native Indian translations with 0ms latency
 */
export function translateDomNodes(targetLang) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const lang = targetLang || getCurrentLanguage();
  const phraseMap = DOM_PHRASE_DICTIONARY[lang];

  function processTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const parent = node.parentElement;
    if (!parent) return;
    const tag = parent.tagName ? parent.tagName.toLowerCase() : '';
    if (['script', 'style', 'code', 'pre', 'noscript'].includes(tag)) return;
    if (parent.isContentEditable) return;

    let original = ORIGINAL_TEXT_MAP.get(node);
    if (original === undefined) {
      original = node.nodeValue;
      ORIGINAL_TEXT_MAP.set(node, original);
    }

    if (lang === 'en' || !phraseMap) {
      if (node.nodeValue !== original) {
        node.nodeValue = original;
      }
      return;
    }

    const trimmed = original.trim();
    if (!trimmed) return;

    if (phraseMap[trimmed]) {
      const leading = original.match(/^\s*/)?.[0] || '';
      const trailing = original.match(/\s*$/)?.[0] || '';
      node.nodeValue = leading + phraseMap[trimmed] + trailing;
    }
  }

  // Walk text nodes in the DOM
  if (document.body) {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      processTextNode(currentNode);
    }

    // Translate input placeholders
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((el) => {
      let origPlaceholder = el.getAttribute('data-orig-placeholder');
      if (origPlaceholder === null) {
        origPlaceholder = el.placeholder;
        el.setAttribute('data-orig-placeholder', origPlaceholder);
      }
      if (lang === 'en' || !phraseMap) {
        el.placeholder = origPlaceholder;
      } else if (phraseMap[origPlaceholder.trim()]) {
        el.placeholder = phraseMap[origPlaceholder.trim()];
      }
    });
  }

  // Set up MutationObserver for any dynamic additions
  if (!domObserver && typeof MutationObserver !== 'undefined' && document.body) {
    domObserver = new MutationObserver((mutations) => {
      const activeL = getCurrentLanguage();
      if (activeL === 'en') return;
      for (const m of mutations) {
        for (const added of m.addedNodes) {
          if (added.nodeType === Node.TEXT_NODE) {
            processTextNode(added);
          } else if (added.nodeType === Node.ELEMENT_NODE) {
            const subWalker = document.createTreeWalker(
              added,
              NodeFilter.SHOW_TEXT,
              null,
              false
            );
            let subNode;
            while ((subNode = subWalker.nextNode())) {
              processTextNode(subNode);
            }
          }
        }
      }
    });
    domObserver.observe(document.body, { childList: true, subtree: true });
  }
}

/**
 * Get the currently active language code from localStorage or navigator
 */
export function getCurrentLanguage() {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem('bhumivera_language');
    if (saved && SUPPORTED_INDIAN_LANGUAGES.some((l) => l.code === saved)) {
      return saved;
    }
    // Auto-detect Indian locales from navigator
    const browserLang = (navigator.language || '').split('-')[0].toLowerCase();
    const matched = SUPPORTED_INDIAN_LANGUAGES.find((l) => l.code === browserLang);
    return matched ? matched.code : 'en';
  } catch {
    return 'en';
  }
}

let googleTranslateWidgetInitialized = false;
let googleTranslateComboObserver;
let googleTranslateComboTimeout;
let googleTranslateBannerObserver;
let googleTranslateTargetLang = 'en';

function applyGoogleTranslation(lang) {
  const combo = document.querySelector('#google_translate_element .goog-te-combo');
  if (!combo || !Array.from(combo.options).some((option) => option.value === lang)) {
    return false;
  }

  combo.value = lang;
  combo.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

function removeGoogleTranslateBanner(root) {
  if (root instanceof Element && root.matches('.goog-te-banner-frame')) {
    root.remove();
  }
  root.querySelectorAll?.('.goog-te-banner-frame').forEach((banner) => banner.remove());
  if (document.body?.style?.top) {
    document.body.style.setProperty('top', '0px', 'important');
  }
  if (document.body?.style?.marginTop) {
    document.body.style.setProperty('margin-top', '0px', 'important');
  }
}

function hideGoogleTranslateBanner() {
  if (typeof document === 'undefined' || !document.body) return;
  removeGoogleTranslateBanner(document.body);
  if (googleTranslateBannerObserver) return;

  googleTranslateBannerObserver = new MutationObserver((mutations) => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach((node) => {
        if (node instanceof Element) removeGoogleTranslateBanner(node);
      });
    });
  });
  googleTranslateBannerObserver.observe(document.body, { childList: true, subtree: true });
}

function applyGoogleTranslationWhenReady(lang) {
  if (applyGoogleTranslation(lang)) {
    googleTranslateComboObserver?.disconnect();
    googleTranslateComboObserver = undefined;
    if (typeof window !== 'undefined') window.clearTimeout(googleTranslateComboTimeout);
    return;
  }

  googleTranslateComboObserver?.disconnect();
  if (typeof window !== 'undefined') window.clearTimeout(googleTranslateComboTimeout);
  if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined' && document.body) {
    googleTranslateComboObserver = new MutationObserver(() => {
      if (applyGoogleTranslation(lang)) {
        googleTranslateComboObserver.disconnect();
        if (typeof window !== 'undefined') window.clearTimeout(googleTranslateComboTimeout);
        googleTranslateComboObserver = undefined;
      }
    });
    googleTranslateComboObserver.observe(document.body, { childList: true, subtree: true });
    googleTranslateComboTimeout = window.setTimeout(() => {
      googleTranslateComboObserver?.disconnect();
      googleTranslateComboObserver = undefined;
      console.warn('[LanguageEngine] Google Translate language option did not become available.');
    }, 15000);
  }
}

function initializeGoogleTranslate() {
  const TranslateElement = window.google?.translate?.TranslateElement;
  if (!TranslateElement || googleTranslateWidgetInitialized) return;

  googleTranslateWidgetInitialized = true;
  new TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'en,hi,bn,mr,te,ta,gu,ur,kn,ml,pa',
      autoDisplay: false,
      layout: TranslateElement.InlineLayout.SIMPLE,
    },
    'google_translate_element'
  );
  applyGoogleTranslationWhenReady(googleTranslateTargetLang);
}

/**
 * Switch active language across the application and trigger global event
 */
export function setLanguage(langCode, options = {}) {
  if (typeof window === 'undefined') return;
  const target = SUPPORTED_INDIAN_LANGUAGES.some((l) => l.code === langCode) ? langCode : 'en';
  try {
    localStorage.setItem('bhumivera_language', target);
    document.documentElement.lang = target;
    translateDomNodes(target);
    window.dispatchEvent(new CustomEvent('bhumivera:language-change', { detail: { lang: target } }));
    activateFullSiteTranslation(target, options);
  } catch (err) {
    console.error('[LanguageEngine] setLanguage error:', err);
  }
}

/**
 * Look up a translated string with fallback to English
 */
export function t(key, defaultFallback = '', langOverride) {
  const lang = langOverride || getCurrentLanguage();
  const entry = TRANSLATION_DICTIONARY[key];
  if (!entry) return defaultFallback;
  return entry[lang] || entry.en || defaultFallback;
}

/**
 * Dynamic Client-Side Page Translator (Google Neural Translation Bridge)
 * Translates the page through the site's language selector without showing Google's controls
 */
export function activateFullSiteTranslation(targetLangCode, { reloadPage } = {}) {
  if (typeof window === 'undefined') return;
  hideGoogleTranslateBanner();
  const lang = targetLangCode || getCurrentLanguage();
  const currentTranslateValues = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .filter((cookie) => cookie.startsWith('googtrans='))
    .map((cookie) => decodeURIComponent(cookie.slice('googtrans='.length)));
  const requestedTranslateValue = lang === 'en' ? null : `/en/${lang}`;
  const alreadyOnRequestedLanguage = lang === 'en'
    ? currentTranslateValues.length === 0
    : currentTranslateValues.length > 0 &&
      currentTranslateValues.every((value) => value === requestedTranslateValue);

  googleTranslateTargetLang = lang;

  // Remove old host-only and domain-scoped cookies to prevent conflicting target languages.
  document.cookie = 'googtrans=; Max-Age=0; path=/;';
  document.cookie = `googtrans=; Max-Age=0; path=/; domain=.${window.location.hostname}`;
  if (lang === 'en') {
    if (typeof reloadPage === 'function' && !alreadyOnRequestedLanguage && (googleTranslateWidgetInitialized || currentTranslateValues.length > 0)) {
      reloadPage();
      return;
    }
    if (googleTranslateWidgetInitialized) {
      applyGoogleTranslationWhenReady('en');
    }
    return;
  }

  document.cookie = `googtrans=${requestedTranslateValue}; path=/; SameSite=Lax`;
  if (typeof reloadPage === 'function' && !alreadyOnRequestedLanguage && (googleTranslateWidgetInitialized || currentTranslateValues.length > 0)) {
    reloadPage();
    return;
  }

  window.googleTranslateElementInit = initializeGoogleTranslate;

  if (googleTranslateWidgetInitialized) {
    applyGoogleTranslationWhenReady(lang);
  } else if (window.google?.translate?.TranslateElement) {
    initializeGoogleTranslate();
  } else if (!document.getElementById('bhumivera-google-translate-script')) {
    const s = document.createElement('script');
    s.id = 'bhumivera-google-translate-script';
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    s.onerror = () => {
      console.error('[LanguageEngine] Failed to load Google Translate.');
    };
    document.body.appendChild(s);
  }
}
