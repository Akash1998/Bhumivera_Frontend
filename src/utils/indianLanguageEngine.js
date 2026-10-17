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
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', flag: '🇬🇧', region: 'Global / India' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', flag: '🇮🇳', region: 'भारत (Hindi)' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', flag: '🇮🇳', region: 'ভারত ও পশ্চিমবঙ্গ (Bengali)' },
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
    // Navigation & Core UI
    'Home': 'होम',
    'Shop': 'शॉप',
    'Shop all': 'सभी उत्पाद',
    'Shop All Botanicals': 'सभी वानस्पतिक उत्पाद',
    'Shop the collection': 'संग्रह खरीदें',
    'Offers': 'ऑफ़र्स',
    'Fresh offers': 'ताज़ा ऑफ़र',
    'Our science': 'हमारा विज्ञान',
    'Plant science': 'पादप विज्ञान',
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
    'Account Profile': 'खाता प्रोफ़ाइल',
    'Shopping Bag': 'शॉपिंग बैग',
    'Track an order': 'ऑर्डर ट्रैक करें',
    'Track Orders': 'ऑर्डर ट्रैक करें',
    'Track Order': 'ऑर्डर ट्रैक करें',
    'Wishlist': 'विशलिस्ट',
    'Saved Wishlist': 'सहेजी गई विशलिस्ट',
    'Compare products': 'तुलना करें',
    'Damaged item & courtesy credit': 'क्षतिग्रस्त उत्पाद और सौजन्य क्रेडिट',
    'Damaged Items & Courtesy Credit': 'क्षतिग्रस्त उत्पाद और सौजन्य क्रेडिट',
    'Help & Support Guide': 'सहायता मार्गदर्शिका',
    'Customer Care Helpline': 'कस्टमर केयर हेल्पलाइन',
    'Conditions of Use & Sale': 'उपयोग और बिक्री की शर्तें',
    'Privacy Policy': 'गोपनीयता नीति',
    'Privacy Notice': 'गोपनीयता सूचना',
    'Connect With Us': 'हमसे जुड़ें',
    'Telegram Community': 'टेलीग्राम कम्युनिटी',
    'Verify Product Authenticity': 'प्रामाणिकता सत्यापित करें',
    'E-Warranty Registration': 'ई-वारंटी पंजीकरण',
    'Become an affiliate': 'सहयोगी (एफिलिएट) बनें',
    'Sell on Bhumivera': 'भूमिअवेरा पर बेचें',
    'Partnership enquiries': 'साझेदारी पूछताछ',
    'Customer care': 'कस्टमर केयर',
    'Referral rewards': 'रेफरल पुरस्कार',
    'Return & Refund Policy': 'प्रतिस्थापन और सौजन्य क्रेडिट नीति',
    'Replacement & Courtesy Credit Policy': 'प्रतिस्थापन और सौजन्य क्रेडिट नीति',
    'Bhumivera Store': 'भूमिअवेरा स्टोर',
    'Storefront Home': 'स्टोर होम',
    'Product science': 'उत्पाद विज्ञान',
    'Account & Security': 'खाता और सुरक्षा',
    'Customer Sign In': 'ग्राहक साइन इन',
    'Create Account': 'खाता बनाएं',
    'Forgot / Reset Password (AI Assist)': 'पासवर्ड भूल गए / रीसेट करें (AI सहायक)',
    'My Profile, Wallet & Orders': 'मेरी प्रोफ़ाइल, वॉलेट और ऑर्डर',
    'Secure Checkout': 'सुरक्षित चेकआउट',
    'Authenticity & Partners': 'प्रामाणिकता और सहयोगी',

    // Hero Section
    'A story that begins with the earth': 'एक कहानी जो धरती से शुरू होती है',
    'Rooted in nature. Made for your everyday.': 'प्रकृति से प्रेरित। आपके दैनिक जीवन के लिए निर्मित।',
    'Rooted in nature.': 'प्रकृति से प्रेरित।',
    'Made with care.': 'प्रेम और सावधानी से निर्मित।',
    'From botanicals shaped by the natural world to the care we choose to give it, discover a more considered way to make your everyday ritual your own.': 'प्राकृतिक दुनिया द्वारा संवारे गए वानस्पतिक तत्वों से लेकर उसकी देखभाल तक, अपनी दैनिक दिनचर्या को सार्थक बनाने का एक विचारशील तरीका खोजें।',
    'Explore the Collection': 'संग्रह देखें',
    'Explore the collection': 'संग्रह देखें',
    'Explore collection': 'संग्रह देखें',
    'Shop collection': 'संग्रह देखें',
    'Botanical heritage · contemporary skin science': 'वानस्पतिक विरासत · आधुनिक त्वचा विज्ञान',
    'Scroll': 'नीचे स्क्रॉल करें',
    'A more thoughtful ritual': 'एक विचारशील दिनचर्या',
    'Find your kind of care.': 'अपनी त्वचा की सही देखभाल पाएं।',
    'Explore Bhumivera': 'भूमिअवेरा एक्सप्लोर करें',
    'Thoughtfully made, every day': 'हर दिन के लिए विचारपूर्वक निर्मित',
    'All products': 'सभी उत्पाद',
    'Your account': 'आपका खाता',
    'Orders, saved care & more': 'ऑर्डर, सहेजी गई सामग्री और अधिक',
    'Made with care · rooted in nature': 'प्रकृति से प्रेरित · प्रेम से निर्मित',

    // Roots, Planting & Impact
    'Care, returned to the earth': 'प्रकृति की सेवा, प्रकृति को समर्पित',
    'A future worth growing, one tree at a time.': 'एक सुंदर भविष्य, एक समय में एक पेड़।',
    'Our planting vision starts with locally chosen trees and care that continues beyond planting day. We believe the work should be guided by local knowledge and shared through updates you can verify.': 'हमारा वृक्षारोपण दृष्टिकोण स्थानीय रूप से चुने गए पेड़ों और रोपण के बाद भी निरंतर देखभाल से शुरू होता है। हमारा मानना है कि कार्य स्थानीय ज्ञान द्वारा निर्देशित और सत्यापित अपडेट के माध्यम से साझा किया जाना चाहिए।',
    'A future direction—not a claim of completed planting.': 'एक भविष्य की दिशा—वृक्षारोपण पूर्ण होने का कोई झूठा दावा नहीं।',
    'Explore our impact record': 'हमारा प्रभाव रिकॉर्ड देखें',
    'A planting vision · illustrative artwork': 'वृक्षारोपण दृष्टिकोण · कलात्मक चित्रण',
    'A planting vision · live botanical cinema': 'वृक्षारोपण दृष्टिकोण · लाइव वानस्पतिक सिनेमा',
    'Live field vision · 01': 'लाइव फील्ड विज़न · 01',
    'Live field vision · 02': 'लाइव फील्ड विज़न · 02',
    'Live field vision · 03': 'लाइव फील्ड विज़न · 03',
    'Legal & Anti-Fraud Shield': 'कानूनी और धोखाधड़ी-रोधी सुरक्षा',
    'Anti-Fraud & Unboxing Policy': 'धोखाधड़ी-रोधी और 360° अनबॉक्सिंग नीति',
    'Grievance & Arbitration': 'शिकायत निवारण और मध्यस्थता',
    'See our verified impact record': 'हमारा सत्यापित प्रभाव रिकॉर्ड देखें',

    // Story & Philosophy
    'The Bhumivera point of view': 'भूमिअवेरा का दृष्टिकोण',
    'Care should feel like coming back to yourself.': 'देखभाल ऐसी होनी चाहिए जो आपको खुद से जोड़े।',
    'We begin with the living world, then bring curiosity to every detail.': 'हम जीवंत प्रकृति से शुरुआत करते हैं और हर विवरण में उत्सुकता लाते हैं।',
    'Aloe vera, tulsi, charcoal and sea buckthorn each bring a different character to our story. We pair that botanical curiosity with contemporary skin care knowledge—without louder promises or more steps than you need.': 'एलोवेरा, तुलसी, चारकोल और सी बकथॉर्न—हर घटक हमारी कहानी में अनोखा गुण लाता है। हम वानस्पतिक ज्ञान को आधुनिक त्वचा विज्ञान से जोड़ते हैं—बिना झूठे दावों या जटिल चरणों के।',
    'Read the Bhumivera story': 'भूमिअवेरा की कहानी पढ़ें',

    // Living Ingredient Palette
    'A living ingredient palette': 'जीवंत वानस्पतिक सामग्री पैलेट',
    'Nature has more than one note.': 'प्रकृति का हर सुर अनोखा है।',
    'Meet the botanicals that inspire us—and the contemporary actives shaping the next chapter of skin care.': 'उन प्राकृतिक सामग्रियों से मिलें जो हमें प्रेरित करती हैं और आधुनिक स्किनकेयर को नया रूप देती हैं।',
    'Ingredient story · 01': 'सामग्री कहानी · 01',
    'Ingredient story · 02': 'सामग्री कहानी · 02',
    'Ingredient story · 03': 'सामग्री कहानी · 03',
    'Ingredient story · 04': 'सामग्री कहानी · 04',
    'Sea buckthorn': 'सी बकथॉर्न',
    'A vivid botanical with a story all its own.': 'एक जीवंत वनस्पति जिसकी अपनी एक अनूठी कहानी है।',
    'Charcoal': 'चारकोल',
    'A grounded, elemental presence in the ritual.': 'त्वचा की शुद्धि के लिए एक गहरा और प्राकृतिक तत्व।',
    'Tulsi': 'तुलसी',
    'A familiar botanical, seen with fresh attention.': 'एक चिर-परिचित वनस्पति, नए वैज्ञानिक दृष्टिकोण के साथ।',
    'Aloe vera': 'एलोवेरा',
    'A generous plant, and a thoughtful place to begin.': 'एक गुणकारी पौधा, और त्वचा की देखभाल की बेहतरीन शुरुआत।',

    // Modern Actives & Science
    'Modern actives, thoughtfully considered': 'आधुनिक सक्रिय तत्व, विचारपूर्वक चयनित',
    'The modern ingredient edit': 'आधुनिक सामग्री संग्रह',
    'Two names shaping today’s skin conversation.': 'आज की स्किनकेयर चर्चा को आकार देने वाले दो प्रमुख नाम।',
    'Niacinamide': 'नियासिनमाइड',
    'A much-loved modern active, often explored in routines focused on the look of tone and the feel of the skin barrier.': 'त्वचा की रंगत और प्राकृतिक सुरक्षा बैरियर को स्वस्थ रखने के लिए एक पसंदीदा आधुनिक घटक।',
    'Hyaluronic acid': 'हयालूरोनिक एसिड',
    'A familiar hydration-focused ingredient, valued for the supple, comfortable feel it can bring to a routine.': 'गहन नमी प्रदान करने वाला लोकप्रिय घटक, जो त्वचा को कोमल और ताजगी भरा बनाए रखता है।',
    'Ingredient presence and directions vary by product. Always check the individual product page and label.': 'सामग्रियों की उपस्थिति और उपयोग के निर्देश उत्पाद अनुसार भिन्न हो सकते हैं। कृपया उत्पाद लेबल अवश्य जांचें।',
    'Explore the ingredient notes': 'सामग्री नोट्स देखें',
    'Explore ingredient notes': 'सामग्री नोट्स देखें',
    'Explore by ritual': 'दिनचर्या अनुसार खोजें',

    // Considered Collection
    'The considered collection': 'विचारशील उत्पाद संग्रह',
    'Find your daily ritual.': 'अपनी दैनिक दिनचर्या खोजें।',
    'View all': 'सभी देखें',
    'Bhumivera ritual': 'भूमिअवेरा दिनचर्या',
    'Discover details': 'विवरण जानें',
    'View details': 'विवरण देखें',
    'A collection worth taking your time with.': 'एक ऐसा संग्रह जिस पर समय देना सार्थक है।',
    'The live collection is being refreshed. Visit the shop to see current product availability.': 'लाइव संग्रह को अपडेट किया जा रहा है। वर्तमान उपलब्धता देखने के लिए शॉप पर जाएं।',
    'Visit the shop': 'शॉप पर जाएं',
    'Chosen around your activity': 'आपकी प्राथमिकताओं के अनुसार चयनित',
    'Popular with customers': 'ग्राहकों में सर्वाधिक लोकप्रिय',
    'A little more you.': 'बिल्कुल आपके अनुकूल।',
    'Suggestions are shaped by products you have viewed, saved, reviewed, or purchased.': 'सुझाव आपके द्वारा देखे गए, सहेजे गए या खरीदे गए उत्पादों पर आधारित हैं।',
    'Your suggestions will become more personal as you explore, save, review, and purchase products.': 'जैसे-जैसे आप उत्पादों को देखेंगे, सुझाव और अधिक व्यक्तिगत होते जाएंगे।',
    'Explore all products': 'सभी उत्पाद देखें',
    'We couldn’t load your suggestions right now.': 'हम इस समय आपके सुझाव लोड नहीं कर सके।',
    'Try again': 'पुनः प्रयास करें',
    'Explore the collection to get product suggestions made for you.': 'अपने लिए विशेष सुझाव पाने के लिए संग्रह देखें।',

    // Campaign Stories
    'A Bhumivera point of view': 'भूमिअवेरा का दृष्टिकोण',
    'Care is most beautiful when it is considered.': 'देखभाल तब सबसे सुंदर होती है जब वह विचारशील हो।',
    'From the intelligence of nature to the choices we make each day, our approach begins with attention, curiosity and respect for the living world.': 'प्रकृति की बुद्धिमत्ता से लेकर हमारे दैनिक निर्णयों तक, हमारा दृष्टिकोण सम्मान और उत्सुकता पर आधारित है।',
    'Nature’s precision. Planet first.': 'प्रकृति की सटीकता। पर्यावरण सर्वप्रथम।',
    'A reminder to look closer: the natural world is intricate, generous and worth treating with care.': 'प्रकृति जटिल, उदार और अत्यधिक सावधानी से संजोने योग्य है।',
    'Where science meets soil.': 'जहाँ विज्ञान का मिट्टी से मिलन होता है।',
    'Curiosity helps us understand what goes into a formula—and keep the conversation grounded in nature.': 'जिज्ञासा हमें फॉर्मूले की गहराई समझने और प्रकृति से जुड़े रहने में मदद करती है।',
    'Change, made thoughtfully.': 'सार्थक और विचारशील बदलाव।',
    'Better choices are built into everyday life, one considered decision at a time.': 'बेहतर विकल्प दैनिक जीवन में धीरे-धीरे एक-एक निर्णय से बनते हैं।',
    'Where nature meets logic.': 'जहाँ प्रकृति और तर्क का सामंजस्य है।',
    'Botanical inspiration and careful thinking can belong in the same story.': 'वानस्पतिक प्रेरणा और वैज्ञानिक सोच एक साथ हो सकते हैं।',

    // Community & Reviews
    'Notes from our community': 'हमारे समुदाय के अनुभव',
    'Shared, in their own words.': 'उनके अपने शब्दों में साझा।',
    'Explore products': 'उत्पाद देखें',
    'Our community, by choice': 'हमसे जुड़े हमारे ग्राहक',
    'The people who make this story their own.': 'वे लोग जिन्होंने इस कहानी को अपना बनाया।',
    'These customer photos and words are shared with permission and shown only after the review is approved.': 'ग्राहकों की तस्वीरें और समीक्षाएं अनुमति और सत्यापन के बाद ही प्रदर्शित की जाती हैं।',
    'Bhumivera customer': 'भूमिअवेरा ग्राहक',

    // FAQ Section
    'A more personal kind of help': 'एक अधिक व्यक्तिगत सहायता',
    'A question deserves a considered answer.': 'हर प्रश्न एक विचारशील उत्तर का हकदार है।',
    'Explore the topics that matter to you, one answer at a time. For anything more personal, our team is here to help.': 'अपने महत्वपूर्ण विषयों के उत्तर जानें। किसी भी व्यक्तिगत प्रश्न के लिए हमारी टीम सदैव उपलब्ध है।',
    'Speak with our team': 'हमारी टीम से बात करें',
    'The considered answer': 'सटीक और विचारशील उत्तर',
    'Good to know.': 'जानना ज़रूरी है।',
    'Choose a topic to reveal its answer. No wall of questions—just the details you came for.': 'उत्तर देखने के लिए विषय चुनें। बिना किसी उलझन के केवल आवश्यक जानकारी पाएं।',
    'Ingredients': 'सामग्री',
    'What is actually inside each formula?': 'प्रत्येक फॉर्मूले के अंदर वास्तव में क्या है?',
    'Every product has its own ingredient list and directions. Explore the product page before choosing; the ingredient stories on this homepage are an introduction to our world, not a claim that every ingredient appears in every formula.': 'प्रत्येक उत्पाद की अपनी सामग्री सूची और उपयोग के निर्देश होते हैं। चुनने से पहले उत्पाद पृष्ठ देखें; होमपेज पर सामग्री की कहानियां हमारी दुनिया का परिचय हैं, यह दावा नहीं कि हर सामग्री हर उत्पाद में मौजूद है।',
    'Choosing a ritual': 'दिनचर्या का चयन',
    'Where should I begin?': 'मुझे कहाँ से शुरुआत करनी चाहिए?',
    'Begin with the product that fits a routine you already enjoy. Read its details, check current availability, and add one considered step at a time. There is no need to build a complicated routine.': 'उस उत्पाद से शुरुआत करें जो आपकी वर्तमान दिनचर्या के अनुकूल हो। विवरण पढ़ें, उपलब्धता जांचें और धीरे-धीरे एक-एक कदम आगे बढ़ाएं। जटिल दिनचर्या बनाने की कोई आवश्यकता नहीं है।',
    'Browse the collection': 'संग्रह ब्राउज़ करें',
    'Orders': 'ऑर्डर',
    'Where can I follow an order?': 'मैं अपने ऑर्डर को कहाँ ट्रैक कर सकता हूँ?',
    'Use your order reference on the order-tracking page to see the latest fulfillment update recorded by our team.': 'हमारी टीम द्वारा दर्ज नवीनतम डिलीवरी अपडेट देखने के लिए ऑर्डर ट्रैकिंग पेज पर अपना ऑर्डर नंबर दर्ज करें।',
    'Returns': 'रिटर्न और क्रेडिट',
    'How do returns work?': 'रिटर्न और क्रेडिट कैसे काम करते हैं?',
    'Return eligibility depends on the published policy, order details and product condition. Review the Returns Centre for the current steps before sending an item back.': 'स्वच्छता नीति के तहत उपयोग किए गए व्यक्तिगत उत्पादों को वापस नहीं लिया जाता। यदि उत्पाद क्षतिग्रस्त मिले तो तुरंत फोटो भेजें और मुफ्त प्रतिस्थापन या सौजन्य क्रेडिट प्राप्त करें।',
    'Visit the Returns Centre': 'रिटर्न और क्रेडिट नीति देखें',
    'Replacement & Credit': 'प्रतिस्थापन और क्रेडिट',
    'How do replacements and courtesy credits work?': 'प्रतिस्थापन और सौजन्य क्रेडिट कैसे काम करते हैं?',
    'As personal care cosmetics, delivered bottles cannot be physically returned for hygiene safety. If your item arrives damaged or leaking, submit a photo to receive an instant free replacement or 100% courtesy wallet credit.': 'स्वच्छता नीति के तहत डिलीवर किए गए व्यक्तिगत देखभाल उत्पादों को वापस नहीं लिया जाता। यदि उत्पाद क्षतिग्रस्त या लीक मिले तो तुरंत फोटो भेजें और मुफ्त प्रतिस्थापन या 100% सौजन्य वॉलेट क्रेडिट प्राप्त करें।',
    'Replacement & Courtesy Credit': 'प्रतिस्थापन और सौजन्य क्रेडिट',
    'Replacement & Courtesy Credit Policy': 'प्रतिस्थापन और सौजन्य क्रेडिट नीति',
    'Ingredient story · 0': 'सामग्री कहानी · 0',
    '· Bhumivera care': '· भूमिअवेरा केयर',
    'Bhumivera care': 'भूमिअवेरा केयर',
    'How are checkout contributions recorded?': 'चेकआउट योगदान कैसे दर्ज किए जाते हैं?',
    'An eligible checkout contribution is treated as a pledge first. It is recorded as collected only after delivery and reconciliation; verified field updates are shared in our impact record when evidence is available.': 'चेकआउट पर किया गया योगदान पहले एक संकल्प के रूप में दर्ज होता है। डिलीवरी और मिलान के बाद ही इसे एकत्रित माना जाता है; साक्ष्य उपलब्ध होने पर सत्यापित फील्ड अपडेट हमारे प्रभाव रिकॉर्ड में साझा किए जाते हैं।',
    'Explore our impact': 'हमारा प्रभाव देखें',
    'Care, returned to its source.': 'प्रकृति की सेवा, उसके मूल स्रोत को समर्पित।',
    'A considered ritual. A clear choice. A little more room to be yourself.': 'एक विचारशील दिनचर्या। एक स्पष्ट विकल्प। स्वयं के साथ जुड़ने का पल।',
    'Visit our impact page': 'हमारा प्रभाव पृष्ठ देखें',

    // Footer & Concierge Prompts
    'Curiosity, carried further · Bhumivera Client Concierge': 'जिज्ञासा को नई दिशा · भूमिअवेरा क्लाइंट सलाहकार',
    'Get to know the details behind your ritual.': 'अपनी दैनिक दिनचर्या के पीछे के विज्ञान और तत्वों को जानें।',
    'Explore botanical notes, verify product authenticity, reset your password with AI assistance, or ask our concierge team a question.': 'वानस्पतिक नोट्स देखें, उत्पाद प्रामाणिकता सत्यापित करें, AI सहायता से अपना पासवर्ड रीसेट करें, या हमारे सलाहकार से प्रश्न पूछें।',
    '✦ Bhumivera Client Concierge': '✦ भूमिअवेरा क्लाइंट सलाहकार',
    'Botanical notes': 'वानस्पतिक नोट्स',
    'Contact us': 'संपर्क करें',
    'How can I assist you today? I can help you add items to your cart, set or reset your password, track an order, or jump to any page on Bhumivera.': 'आज मैं आपकी कैसे सहायता कर सकता हूँ? मैं आपके बैग में उत्पाद जोड़ने, पासवर्ड सेट या रीसेट करने, ऑर्डर ट्रैक करने या भूमिअवेरा के किसी भी पेज पर जाने में आपकी मदद कर सकता हूँ।',

    // AI Concierge & Chat
    'Bhumivera Client Concierge': 'भूमिअवेरा क्लाइंट सलाहकार',
    'Ayurvedic Botanical AI · Always Active': 'आयुर्वेदिक वानस्पतिक AI · हमेशा सक्रिय',
    'Ask AI Concierge': 'AI सलाहकार से पूछें',
    'Ask Concierge 💬': 'सलाहकार से पूछें 💬',
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
    'Need Help with an Order?': 'ऑर्डर में सहायता चाहिए?',
    'View My Orders': 'मेरे ऑर्डर देखें',
    'Message AI Concierge': 'AI सलाहकार से बात करें',
    'How can I assist you today?': 'आज मैं आपकी कैसे सहायता कर सकता हूँ?',
    'How may I assist you today?': 'आज मैं आपकी क्या सहायता कर सकता हूँ?',
    'How else may I assist you today?': 'आज मैं आपकी और क्या सहायता कर सकता हूँ?',
    'Welcome back': 'पुनः स्वागत है',
    'Type a question or select a topic below...': 'एक प्रश्न लिखें या नीचे दिए गए विषयों में से चुनें...',
    'Send message': 'संदेश भेजें',
    'Connecting with concierge...': 'सलाहकार से जुड़ रहे हैं...',
    'Concierge is typing...': 'सलाहकार लिख रहे हैं...',
    'Select Language · भाषा चुनें': 'भाषा चुनें',
    'Select Language': 'भाषा चुनें',
    'Overview': 'सिंहावलोकन',
    'Molecules': 'अणु घटक',
    'Layering': 'लगाने का क्रम',
    'Pairings': 'उत्तम संयोजन',

    // Search & Placeholders
    'Search skincare, hair care, ingredients...': 'स्किनकेयर, हेयर केयर या सामग्री खोजें...',
    'Search products and ingredients': 'उत्पाद और सामग्री खोजें',
    'Discover': 'खोजें',
    'No botanical matches found.': 'कोई वानस्पतिक उत्पाद नहीं मिला।',
    'Semantic Formulation Results': 'स्मार्ट फॉर्मूलेशन परिणाम',
    'Standard Search': 'सामान्य खोज',
  },
  bn: {
    // Navigation & Global UI
    'Home': 'হোম',
    'Shop': 'শপ',
    'Shop all': 'সব পণ্য',
    'Shop All Botanicals': 'সব ভেষজ পণ্য',
    'Shop the collection': 'সংগ্রহ কেনাকাটা করুন',
    'Offers': 'অফার',
    'Fresh offers': 'নতুন অফার',
    'Our science': 'আমাদের বিজ্ঞান',
    'Plant science': 'উদ্ভিদ বিজ্ঞান',
    'Botanical Science': 'উদ্ভিদ বিজ্ঞান',
    'Our story': 'আমাদের গল্প',
    'Our roots': 'আমাদের শিকড়',
    'Our impact': 'আমাদের প্রভাব',
    'Giving back': 'প্রকৃতির যত্ন',
    'Help & support': 'সাহায্য ও সহায়তা',
    'We’re here': 'আমরা আছি আপনার পাশে',
    'Sign In': 'সাইন ইন',
    'Join Bhumivera': 'যুক্ত হন',
    'Create an account': 'অ্যাকাউন্ট খুলুন',
    'My account': 'আমার অ্যাকাউন্ট',
    'Account Profile': 'অ্যাকাউন্ট প্রোফাইল',
    'Shopping Bag': 'শপিং ব্যাগ',
    'Track an order': 'অর্ডার ট্র্যাক করুন',
    'Track Orders': 'অর্ডার ট্র্যাক করুন',
    'Track Order': 'অর্ডার ট্র্যাক করুন',
    'Wishlist': 'পছন্দের তালিকা',
    'Saved Wishlist': 'পছন্দের তালিকা',
    'Compare products': 'পণ্য তুলনা',
    'Damaged item & courtesy credit': 'ক্ষতিগ্রস্ত পণ্য ও সৌজন্য ক্রেডিট',
    'Damaged Items & Courtesy Credit': 'ক্ষতিগ্রস্ত পণ্য ও সৌজন্য ক্রেডিট',
    'Help & Support Guide': 'সহায়তা গাইড',
    'Connect With Us': 'আমাদের সাথে যুক্ত হন',
    'Customer Care Helpline': 'গ্রাহক সহায়তা হেল্পলাইন',
    'Conditions of Use & Sale': 'ব্যবহার ও বিক্রয়ের শর্তাবলী',
    'Privacy Policy': 'গোপনীয়তা নীতি',
    'Privacy Notice': 'গোপনীয়তা বিজ্ঞপ্তি',
    'Telegram Community': 'টেলিগ্রাম কমিউনিটি',
    'Verify Product Authenticity': 'পণ্যের আসল সত্যতা যাচাই করুন',
    'E-Warranty Registration': 'ই-ওয়ারেন্টি রেজিস্ট্রেশন',
    'Become an affiliate': 'অ্যাফিলিয়েট হন',
    'Sell on Bhumivera': 'ভূমিভেরাতে বিক্রি করুন',
    'Partnership enquiries': 'অংশীদারিত্বের অনুসন্ধান',
    'Customer care': 'গ্রাহক সেবা',
    'Referral rewards': 'রেফারেল পুরস্কার',
    'Return & Refund Policy': 'প্রতিস্থাপন ও সৌজন্য ক্রেডিট নীতি',
    'Replacement & Courtesy Credit Policy': 'প্রতিস্থাপন ও সৌজন্য ক্রেডিট নীতি',
    'Bhumivera Store': 'ভূমিভেরা স্টোর',
    'Storefront Home': 'স্টোর হোম',
    'Product science': 'পণ্য বিজ্ঞান',
    'Account & Security': 'অ্যাকাউন্ট ও নিরাপত্তা',
    'Customer Sign In': 'গ্রাহক সাইন ইন',
    'Create Account': 'অ্যাকাউন্ট তৈরি করুন',
    'Forgot / Reset Password (AI Assist)': 'পাসওয়ার্ড ভুলে গেছেন / রিসেট (AI সহায়ক)',
    'My Profile, Wallet & Orders': 'আমার প্রোফাইল, ওয়ালেট ও অর্ডার',
    'Secure Checkout': 'নিরাপদ চেকআউট',
    'Authenticity & Partners': 'আসল প্রামাণ্যতা ও অংশীদার',

    // Hero Section
    'A story that begins with the earth': 'একটি গল্প যা মাটি থেকে শুরু হয়',
    'Rooted in nature. Made for your everyday.': 'প্রকৃতি থেকে অনুপ্রাণিত। আপনার দৈনন্দিন জীবনের জন্য তৈরি।',
    'Rooted in nature.': 'প্রকৃতি থেকে অনুপ্রাণিত।',
    'Made with care.': 'যত্ন সহকারে তৈরি।',
    'From botanicals shaped by the natural world to the care we choose to give it, discover a more considered way to make your everyday ritual your own.': 'প্রাকৃতিক উপাদান থেকে শুরু করে পরিবেশের যত্ন নেওয়া পর্যন্ত, আপনার দৈনন্দিন পরিচর্যাকে সুন্দর করে তোলার এক সচেতন উপায় আবিষ্কার করুন।',
    'Explore the Collection': 'সংগ্রহ দেখুন',
    'Explore the collection': 'সংগ্রহ দেখুন',
    'Explore collection': 'সংগ্রহ দেখুন',
    'Shop collection': 'সংগ্রহ দেখুন',
    'Botanical heritage · contemporary skin science': 'ভেষজ ঐতিহ্য · আধুনিক ত্বক বিজ্ঞান',
    'Scroll': 'স্ক্রোল করুন',
    'A more thoughtful ritual': 'এক গভীর সচেতন রূপচর্চা',
    'Find your kind of care.': 'আপনার ত্বকের সঠিক যত্ন খুঁজুন।',
    'Explore Bhumivera': 'ভূমিভেরা অন্বেষণ করুন',
    'Thoughtfully made, every day': 'সতর্কতার সাথে তৈরি, প্রতিদিনের জন্য',
    'All products': 'সব পণ্য',
    'Your account': 'আপনার অ্যাকাউন্ট',
    'Orders, saved care & more': 'অর্ডার, সংরক্ষিত যত্ন এবং আরও অনেক কিছু',
    'Made with care · rooted in nature': 'যত্ন সহকারে তৈরি · প্রকৃতির সাথে যুক্ত',

    // Roots, Planting & Impact
    'Care, returned to the earth': 'যত্ন, প্রকৃতির কাছে সমর্পিত',
    'A future worth growing, one tree at a time.': 'একটি উজ্জ্বল ভবিষ্যৎ, একটি করে গাছ রোপণ করে।',
    'Our planting vision starts with locally chosen trees and care that continues beyond planting day. We believe the work should be guided by local knowledge and shared through updates you can verify.': 'আমাদের বৃক্ষরোপণ দৃষ্টিভঙ্গি শুরু হয় স্থানীয় জাতের গাছ নির্বাচন এবং রোপণের পরেও নিয়মিত পরিচর্যার মাধ্যমে। আমরা বিশ্বাস করি স্থানীয় অভিজ্ঞতায় এই কাজ পরিচালিত হওয়া উচিত এবং প্রতিটি তথ্য যাচাইযোগ্য হওয়া দরকার।',
    'A future direction—not a claim of completed planting.': 'একটি ভবিষ্যৎ অঙ্গীকার—গাছ লাগানো শেষ হয়েছে এমন কোনো অলীক দাবি নয়।',
    'Explore our impact record': 'আমাদের প্রভাব রেকর্ড দেখুন',
    'A planting vision · illustrative artwork': 'বৃক্ষরোপণ পরিকল্পনা · কাল্পনিক চিত্রায়ন',
    'A planting vision · live botanical cinema': 'বৃক্ষরোপণ পরিকল্পনা · লাইভ বোটানিক্যাল সিনেমা',
    'Live field vision · 01': 'লাইভ ফিল্ড ভিশন · ০১',
    'Live field vision · 02': 'লাইভ ফিল্ড ভিশন · ০২',
    'Live field vision · 03': 'লাইভ ফিল্ড ভিশন · ০৩',
    'Legal & Anti-Fraud Shield': 'আইনি ও জালিয়াতি-প্রতিরোধী সুরক্ষা',
    'Anti-Fraud & Unboxing Policy': 'জালিয়াতি-প্রতিরোধ ও ৩৬০° আনবক্সিং নীতি',
    'Grievance & Arbitration': 'অভিযোগ নিষ্পত্তি ও সালিশি',
    'See our verified impact record': 'আমাদের যাচাইকৃত প্রভাব রেকর্ড দেখুন',

    // Point of View & Story
    'The Bhumivera point of view': 'ভূমিভেরার দৃষ্টিভঙ্গি',
    'Care should feel like coming back to yourself.': 'নিজের যত্ন নেওয়া যেন নিজের কাছে ফিরে আসার অনুভূতি দেয়।',
    'We begin with the living world, then bring curiosity to every detail.': 'আমরা প্রকৃতির জীবন্ত জগত দিয়ে শুরু করি, তারপর প্রতিটি উপাদানে নিখুঁত মনোযোগ দিই।',
    'Aloe vera, tulsi, charcoal and sea buckthorn each bring a different character to our story. We pair that botanical curiosity with contemporary skin care knowledge—without louder promises or more steps than you need.': 'অ্যালোভেরা, তুলসী, চারকোল এবং সি বাকথর্ন—প্রত্যেকটি উপাদান আমাদের গল্পে আনে আলাদা বৈশিষ্ট্য। আমরা উদ্ভিদের প্রতি কৌতূহলকে আধুনিক ত্বক বিজ্ঞানের সাথে একত্রিত করি—অতিরিক্ত প্রতিশ্রুতি বা জটিল ধাপ ছাড়াই।',
    'Read the Bhumivera story': 'ভূমিভেরার গল্প পড়ুন',

    // Living Ingredient Palette
    'A living ingredient palette': 'সজীব উদ্ভিদ উপাদানের সম্ভার',
    'Nature has more than one note.': 'প্রকৃতির প্রতিটি রূপ অনন্য।',
    'Meet the botanicals that inspire us—and the contemporary actives shaping the next chapter of skin care.': 'যে উদ্ভিদগুলি আমাদের অনুপ্রেরণা জোগায় এবং আধুনিক ত্বকের যত্নকে নতুন মাত্রা দেয়, তাদের সাথে পরিচিত হন।',
    'Ingredient story · 01': 'উপাদান গল্প · ০১',
    'Ingredient story · 02': 'উপাদান গল্প · ০২',
    'Ingredient story · 03': 'উপাদান গল্প · ০৩',
    'Ingredient story · 04': 'উপাদান গল্প · ০৪',
    'Sea buckthorn': 'সি বাকথর্ন',
    'A vivid botanical with a story all its own.': 'একটি প্রাণবন্ত ভেষজ উপাদান, যার রয়েছে নিজস্ব গল্প।',
    'Charcoal': 'চারকোল',
    'A grounded, elemental presence in the ritual.': 'রূপচর্চায় এক গভীর বিশুদ্ধ প্রাকৃতিক উপাদান।',
    'Tulsi': 'তুলসী',
    'A familiar botanical, seen with fresh attention.': 'একটি পরিচিত ঔষধি ভেষজ, নতুন দৃষ্টিভঙ্গিতে দেখা।',
    'Aloe vera': 'অ্যালোভেরা',
    'A generous plant, and a thoughtful place to begin.': 'এক অপরিসীম গুণসম্পন্ন উদ্ভিদ, যত্নের আদর্শ সূচনা।',

    // Modern Actives & Science
    'Modern actives, thoughtfully considered': 'আধুনিক উপাদান, সতর্কতার সাথে নির্বাচিত',
    'The modern ingredient edit': 'আধুনিক সক্রিয় উপাদান সংগ্রহ',
    'Two names shaping today’s skin conversation.': 'আজকের স্কিনকেয়ারের মূল দুটি আধুনিক উপাদান।',
    'Niacinamide': 'নিয়াসিনামাইড',
    'A much-loved modern active, often explored in routines focused on the look of tone and the feel of the skin barrier.': 'ত্বকের উজ্জ্বলতা এবং প্রাকৃতিক সুরক্ষাবলয় সুদৃঢ় রাখতে একটি অত্যন্ত প্রশংসিত আধুনিক উপাদান।',
    'Hyaluronic acid': 'হায়ালুরোনিক অ্যাসিড',
    'A familiar hydration-focused ingredient, valued for the supple, comfortable feel it can bring to a routine.': 'গভীর আর্দ্রতা প্রদানকারী সুপরিচিত উপাদান, যা ত্বককে রাখে কোমল ও প্রাণবন্ত।',
    'Ingredient presence and directions vary by product. Always check the individual product page and label.': 'উপাদান ও ব্যবহারের নিয়ম পণ্যভেদে ভিন্ন হতে পারে। অনুগ্রহ করে প্যাকেটের লেবেল দেখে নিন।',
    'Explore the ingredient notes': 'উপাদান নোটগুলি দেখুন',
    'Explore ingredient notes': 'উপাদান নোটগুলি দেখুন',
    'Explore by ritual': 'নিয়ম অনুযায়ী অন্বেষণ করুন',
    'Active Regimen': 'সক্রিয় নিয়ম',
    'Discover the Science': 'বিজ্ঞান জানুন',

    // Considered Collection
    'The considered collection': 'নির্বাচিত ভেষজ সম্ভার',
    'Find your daily ritual.': 'আপনার দৈনন্দিন রূপচর্চার নিয়ম খুঁজুন।',
    'View all': 'সব দেখুন',
    'Bhumivera ritual': 'ভূমিভেরা রূপচর্চা',
    'Discover details': 'বিস্তারিত জানুন',
    'View details': 'বিস্তারিত দেখুন',
    'A collection worth taking your time with.': 'মনোযোগ দিয়ে দেখার মতো একটি অনন্য সংগ্রহ।',
    'The live collection is being refreshed. Visit the shop to see current product availability.': 'আমাদের সংগ্রহ আপডেট করা হচ্ছে। বর্তমান প্রাপ্যতা দেখতে শপ পেজে যান।',
    'Visit the shop': 'দোকান দেখুন',
    'Chosen around your activity': 'আপনার পছন্দের উপর ভিত্তি করে নির্বাচিত',
    'Popular with customers': 'গ্রাহকদের পছন্দের তালিকায় শীর্ষে',
    'A little more you.': 'ঠিক আপনার মনের মতো।',
    'Suggestions are shaped by products you have viewed, saved, reviewed, or purchased.': 'আপনার দেখা, পছন্দ করা বা কেনা পণ্যের ওপর ভিত্তি করে এই পরামর্শ দেওয়া হয়েছে।',
    'Your suggestions will become more personal as you explore, save, review, and purchase products.': 'আপনি যত বেশি পণ্য দেখবেন ও পছন্দ করবেন, পরামর্শ তত বেশি আপনার উপযোগী হবে।',
    'Explore all products': 'সব পণ্য দেখুন',
    'We couldn’t load your suggestions right now.': 'এই মুহূর্তে পরামর্শগুলি লোড করা যায়নি।',
    'Try again': 'আবার চেষ্টা করুন',
    'Explore the collection to get product suggestions made for you.': 'আপনার উপযোগী পণ্য পরামর্শ পেতে সংগ্রহটি ঘুরে দেখুন।',

    // Campaign Stories
    'A Bhumivera point of view': 'ভূমিভেরার নিজস্ব দৃষ্টিভঙ্গি',
    'Care is most beautiful when it is considered.': 'সচেতন ও গভীর যত্নই সবচেয়ে সুন্দর।',
    'From the intelligence of nature to the choices we make each day, our approach begins with attention, curiosity and respect for the living world.': 'প্রকৃতির প্রজ্ঞা থেকে শুরু করে আমাদের দৈনন্দিন সিদ্ধান্ত পর্যন্ত, প্রতিটি ধাপে রয়েছে জীবজগতের প্রতি গভীর শ্রদ্ধা।',
    'Nature’s precision. Planet first.': 'প্রকৃতির নিপুণতা। পৃথিবীর সুরক্ষা সবার আগে।',
    'A reminder to look closer: the natural world is intricate, generous and worth treating with care.': 'প্রকৃতি জটিল, উদার এবং পরম যত্নের দাবিদার।',
    'Where science meets soil.': 'যেখানে বিজ্ঞানের সাথে মাটির মিলন।',
    'Curiosity helps us understand what goes into a formula—and keep the conversation grounded in nature.': 'কৌতূহল আমাদের প্রতিটি উপাদানের গুণাগুণ বুঝতে সাহায্য করে।',
    'Change, made thoughtfully.': 'সচেতন পরিবর্তনের সূচনা।',
    'Better choices are built into everyday life, one considered decision at a time.': 'প্রতিদিনের একটি করে সঠিক সিদ্ধান্ত সুন্দর ভবিষ্যৎ গড়ে তোলে।',
    'Where nature meets logic.': 'যেখানে প্রকৃতি ও যুক্তির মেলবন্ধন।',
    'Botanical inspiration and careful thinking can belong in the same story.': 'উদ্ভিদের অনুপ্রেরণা এবং গভীর চিন্তা একই সূত্রে গাঁথা।',

    // Community & Reviews
    'Notes from our community': 'আমাদের শুভাকাঙ্ক্ষীদের অভিজ্ঞতা',
    'Shared, in their own words.': 'তাদের নিজস্ব অনুভূতিতে ব্যক্ত।',
    'Explore products': 'পণ্য দেখুন',
    'Our community, by choice': 'আমাদের সাথে যুক্ত মানুষেরা',
    'The people who make this story their own.': 'যাঁরা এই গল্পকে নিজেদের করে নিয়েছেন।',
    'These customer photos and words are shared with permission and shown only after the review is approved.': 'গ্রাহকদের ছবি ও মন্তব্য অনুমোদনের পরই প্রকাশিত হয়েছে।',
    'Bhumivera customer': 'ভূমিভেরা গ্রাহক',

    // FAQ Section
    'A more personal kind of help': 'একটি ব্যক্তিগত ও আন্তরিক সহায়তা',
    'A question deserves a considered answer.': 'প্রতিটি প্রশ্নের প্রয়োজন একটি সুবিবেচিত উত্তর।',
    'Explore the topics that matter to you, one answer at a time. For anything more personal, our team is here to help.': 'আপনার প্রয়োজনীয় প্রশ্নগুলির উত্তর জেনে নিন। আরও তথ্যের জন্য আমাদের টিম সদা প্রস্তুত।',
    'Speak with our team': 'আমাদের টিমের সাথে কথা বলুন',
    'The considered answer': 'সঠিক ও সুবিবেচিত উত্তর',
    'Good to know.': 'জানা জরুরি।',
    'Choose a topic to reveal its answer. No wall of questions—just the details you came for.': 'উত্তর দেখতে একটি বিষয় নির্বাচন করুন। অপ্রয়োজনীয় ভিড় এড়িয়ে শুধু প্রয়োজনীয় তথ্য জানুন।',
    'Ingredients': 'উপাদানসমূহ',
    'What is actually inside each formula?': 'প্রতিটি ফর্মুলায় আসলে কী কী উপাদান রয়েছে?',
    'Every product has its own ingredient list and directions. Explore the product page before choosing; the ingredient stories on this homepage are an introduction to our world, not a claim that every ingredient appears in every formula.': 'প্রতিটি পণ্যের নিজস্ব উপাদান তালিকা ও ব্যবহারের নিয়ম রয়েছে। নির্বাচনের আগে পণ্যের পেজ দেখুন; হোমপেজের ভেষজ গল্পগুলি একটি পরিচিতি মাত্র, প্রতিটি পণ্যে সব উপাদান রয়েছে এমন দাবি নয়।',
    'Choosing a ritual': 'রূপচর্চা নির্বাচন',
    'Where should I begin?': 'আমি কোথা থেকে শুরু করব?',
    'Begin with the product that fits a routine you already enjoy. Read its details, check current availability, and add one considered step at a time. There is no need to build a complicated routine.': 'যে পণ্যটি আপনার দৈনন্দিন অভ্যাসের সাথে মানানসই তা দিয়ে শুরু করুন। বিস্তারিত বিবরণ পড়ুন এবং ধীরে ধীরে একটি করে নতুন ধাপ যোগ করুন। জটিল নিয়ম তৈরির কোনো প্রয়োজন নেই।',
    'Browse the collection': 'সংগ্রহ ঘুরে দেখুন',
    'Orders': 'অর্ডারসমূহ',
    'Where can I follow an order?': 'আমি আমার অর্ডার কোথায় ট্র্যাক করতে পারি?',
    'Use your order reference on the order-tracking page to see the latest fulfillment update recorded by our team.': 'আমাদের টিমের সর্বশেষ ডেলিভারি আপডেট দেখতে অর্ডার ট্র্যাকিং পেজে আপনার অর্ডার নম্বর ব্যবহার করুন।',
    'Returns': 'রিটার্ন ও ক্রেডিট',
    'How do returns work?': 'রিটার্ন ও ক্রেডিট কীভাবে কাজ করে?',
    'Return eligibility depends on the published policy, order details and product condition. Review the Returns Centre for the current steps before sending an item back.': 'স্বাস্থ্যবিধি অনুযায়ী ব্যবহৃত প্রসাধন সামগ্রী ফেরত নেওয়া হয় না। পণ্য ক্ষতিগ্রস্ত হলে ছবি পাঠিয়ে তাৎক্ষণিক বিনামূল্যে নতুন পণ্য বা ওয়ালেট ক্রেডিট পান।',
    'Visit the Returns Centre': 'রিটার্ন ও ক্রেডিট নীতি দেখুন',
    'Replacement & Credit': 'প্রতিস্থাপন ও ক্রেডিট',
    'How do replacements and courtesy credits work?': 'প্রতিস্থাপন ও সৌজন্য ক্রেডিট কীভাবে কাজ করে?',
    'As personal care cosmetics, delivered bottles cannot be physically returned for hygiene safety. If your item arrives damaged or leaking, submit a photo to receive an instant free replacement or 100% courtesy wallet credit.': 'স্বাস্থ্যবিধি অনুযায়ী ডেলিভারির পর প্রসাধন সামগ্রী ফেরত নেওয়া হয় না। পণ্য ক্ষতিগ্রস্ত বা লিক হলে ছবি পাঠিয়ে তাৎক্ষণিক বিনামূল্যে নতুন পণ্য বা ১০০% সৌজন্য ওয়ালেট ক্রেডিট পান।',
    'Replacement & Courtesy Credit': 'প্রতিস্থাপন ও সৌজন্য ক্রেডিট',
    'Replacement & Courtesy Credit Policy': 'প্রতিস্থাপন ও সৌজন্য ক্রেডিট নীতি',
    'Ingredient story · 0': 'উপাদান গল্প · ০',
    '· Bhumivera care': '· ভূমিভেরা যত্ন',
    'Bhumivera care': 'ভূমিভেরা যত্ন',
    'How are checkout contributions recorded?': 'চেকআউট অনুদান কীভাবে রেকর্ড করা হয়?',
    'An eligible checkout contribution is treated as a pledge first. It is recorded as collected only after delivery and reconciliation; verified field updates are shared in our impact record when evidence is available.': 'চেকআউটের অনুদান প্রথমে একটি প্রতিশ্রুতি হিসেবে বিবেচিত হয়। সফল ডেলিভারির পরেই তা সংগৃহীত হিসেবে রেকর্ড হয় এবং যাচাইকৃত তথ্য আমাদের প্রভাব রেকর্ডে প্রকাশ করা হয়।',
    'Explore our impact': 'আমাদের প্রভাব দেখুন',
    'Care, returned to its source.': 'যত্ন, তার মূল উৎসে সমর্পিত।',
    'A considered ritual. A clear choice. A little more room to be yourself.': 'একটি সুবিবেচিত রূপচর্চা। স্পষ্ট পছন্দ। নিজের মতো থাকার স্বাধীনতা।',
    'Visit our impact page': 'আমাদের প্রভাব পেজ দেখুন',

    // Footer & Concierge Prompts
    'Curiosity, carried further · Bhumivera Client Concierge': 'জানার আগ্রহকে এগিয়ে নিয়ে চলুন · ভূমিভেরা ক্লায়েন্ট সহায়ক',
    'Get to know the details behind your ritual.': 'আপনার রূপচর্চার পেছনের উপাদান ও বিজ্ঞান সম্পর্কে জানুন।',
    'Explore botanical notes, verify product authenticity, reset your password with AI assistance, or ask our concierge team a question.': 'ভেষজ নোটগুলি দেখুন, পণ্যের আসল সত্যতা যাচাই করুন, AI এর সাহায্যে পাসওয়ার্ড রিসেট করুন, বা আমাদের সহকারীর কাছে প্রশ্ন করুন।',
    '✦ Bhumivera Client Concierge': '✦ ভূমিভেরা ক্লায়েন্ট সহায়ক',
    'Botanical notes': 'ভেষজ নোট',
    'Contact us': 'যোগাযোগ করুন',
    'How can I assist you today? I can help you add items to your cart, set or reset your password, track an order, or jump to any page on Bhumivera.': 'আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি? আপনার ব্যাগে পণ্য যোগ করা, পাসওয়ার্ড রিসেট করা, অর্ডার ট্র্যাক করা বা যেকোনো পেজে যাওয়ার বিষয়ে আমি আপনাকে সহায়তা করতে পারি।',

    // AI Concierge & Chat
    'Bhumivera Client Concierge': 'ভূমিভেরা ক্লায়েন্ট সহায়ক',
    'Ayurvedic Botanical AI · Always Active': 'আয়ুর্বেদিক ভেষজ AI · সর্বদা সক্রিয়',
    'Ask AI Concierge': 'AI সহায়ককে জিজ্ঞাসা করুন',
    'Ask Concierge 💬': 'সহায়ককে জিজ্ঞাসা করুন 💬',
    'Ask AI Guide': 'AI গাইডকে জিজ্ঞাসা করুন',
    'Visual Guide': 'ভিজ্যুয়াল গাইড',
    'Map Guide': 'ম্যাপ গাইড',
    'Delivery Visual Guide': 'ডেলিভারি ভিজ্যুয়াল গাইড',
    'Add to Bag': 'ব্যাগে যোগ করুন',
    'Buy Now': 'এখনই কিনুন',
    'View Details': 'বিস্তারিত দেখুন',
    'Reset your password': 'পাসওয়ার্ড রিসেট করুন',
    'Verify your email': 'ইমেইল যাচাই করুন',
    'Set new password': 'নতুন পাসওয়ার্ড দিন',
    'Back to login': 'লগইনে ফিরে যান',
    'Address Book': 'ঠিকানা খাতা',
    'Add New Address': 'নতুন ঠিকানা যোগ করুন',
    'Natural Purity. Premium Care.': 'প্রাকৃতিক বিশুদ্ধতা. প্রিমিয়াম যত্ন.',
    'Replacement & Courtesy Credit Policy': 'প্রতিস্থাপন ও সৌজন্য ক্রেডিট নীতি',
    'What to Do If an Item Arrives Damaged': 'পণ্য ক্ষতিগ্রস্ত হলে কী করবেন',
    'Snap a Quick Photo': 'একটি ছবি তুলে রাখুন',
    'Instant Replacement or Store Credit': 'তাৎক্ষণিক নতুন পণ্য বা স্টোর ক্রেডিট',
    'Need Help with an Order?': 'অর্ডারে সাহায্য প্রয়োজন?',
    'View My Orders': 'আমার অর্ডার দেখুন',
    'Message AI Concierge': 'AI সহায়কের সাথে কথা বলুন',
    'How can I assist you today?': 'আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
    'How may I assist you today?': 'আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
    'How else may I assist you today?': 'আজ আমি আপনাকে আর কীভাবে সাহায্য করতে পারি?',
    'Welcome back': 'আবার স্বাগতম',
    'Type a question or select a topic below...': 'প্রশ্ন লিখুন অথবা নিচের বিষয় থেকে নির্বাচন করুন...',
    'Send message': 'বার্তা পাঠান',
    'Connecting with concierge...': 'সহায়কের সাথে সংযোগ করা হচ্ছে...',
    'Concierge is typing...': 'সহায়ক লিখছেন...',
    'Select Language · भाषा चुनें': 'ভাষা নির্বাচন করুন',
    'Select Language': 'ভাষা নির্বাচন করুন',
    'Overview': 'এক নজরে',
    'Molecules': 'উপাদান অণু',
    'Layering': 'প্রয়োগের ক্রম',
    'Pairings': 'উপযুক্ত জুড়ি',

    // Search & Placeholders
    'Search skincare, hair care, ingredients...': 'স্কিনকেয়ার বা উপাদান খুঁজুন...',
    'Search products and ingredients': 'পণ্য ও উপাদান খুঁজুন',
    'Discover': 'অনুসন্ধান',
    'No botanical matches found.': 'কোনো ভেষজ মিল পাওয়া যায়নি।',
    'Semantic Formulation Results': 'স্মার্ট অনুসন্ধান ফলাফল',
    'Standard Search': 'সাধারণ অনুসন্ধান',
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

    const cleanStr = original.replace(/\u00a0/g, ' ');
    const trimmed = cleanStr.trim();
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

    // Translate input and textarea placeholders
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((el) => {
      let origPlaceholder = el.getAttribute('data-orig-placeholder');
      if (origPlaceholder === null) {
        origPlaceholder = el.placeholder;
        el.setAttribute('data-orig-placeholder', origPlaceholder);
      }
      if (lang === 'en' || !phraseMap) {
        el.placeholder = origPlaceholder;
      } else {
        const cleanPlaceholder = origPlaceholder.replace(/\u00a0/g, ' ').trim();
        if (phraseMap[cleanPlaceholder]) {
          el.placeholder = phraseMap[cleanPlaceholder];
        }
      }
    });

    // Translate aria-label and title attributes
    document.querySelectorAll('[aria-label], [title]').forEach((el) => {
      if (el.hasAttribute('aria-label')) {
        let origAria = el.getAttribute('data-orig-aria-label');
        if (origAria === null) {
          origAria = el.getAttribute('aria-label');
          el.setAttribute('data-orig-aria-label', origAria);
        }
        if (lang === 'en' || !phraseMap) {
          el.setAttribute('aria-label', origAria);
        } else {
          const cleanAria = origAria.replace(/\u00a0/g, ' ').trim();
          if (phraseMap[cleanAria]) {
            el.setAttribute('aria-label', phraseMap[cleanAria]);
          }
        }
      }

      if (el.hasAttribute('title')) {
        let origTitle = el.getAttribute('data-orig-title');
        if (origTitle === null) {
          origTitle = el.getAttribute('title');
          el.setAttribute('data-orig-title', origTitle);
        }
        if (lang === 'en' || !phraseMap) {
          el.setAttribute('title', origTitle);
        } else {
          const cleanTitle = origTitle.replace(/\u00a0/g, ' ').trim();
          if (phraseMap[cleanTitle]) {
            el.setAttribute('title', phraseMap[cleanTitle]);
          }
        }
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
 * Dynamic Client-Side Page Translator
 * Translates the entire site with 0ms latency, zero screen blinking, and zero cookie lock
 */
export function activateFullSiteTranslation(targetLangCode, _options = {}) {
  if (typeof window === 'undefined') return;
  const lang = targetLangCode || getCurrentLanguage();

  // Clear all googtrans cookies across all domain and path variations
  // so old Google Translate cookies never lock the DOM into Hindi or crash
  try {
    const host = window.location.hostname || '';
    const domains = ['', host, `.${host}`, `.${host.replace(/^www\./, '')}`, 'localhost'];
    const paths = ['/', '/app', ''];
    domains.forEach((d) => {
      paths.forEach((p) => {
        const domainStr = d ? `; domain=${d}` : '';
        const pathStr = p ? `; path=${p}` : '; path=/';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC${domainStr}${pathStr}; SameSite=Lax`;
        document.cookie = `googtrans=; Max-Age=0${domainStr}${pathStr}; SameSite=Lax`;
      });
    });
  } catch (err) {
    console.warn('[LanguageEngine] Cookie cleanup error:', err);
  }

  // Remove any legacy injected Google Translate banners/toolbars/iframes
  if (typeof document !== 'undefined') {
    document
      .querySelectorAll?.('.goog-te-banner-frame, .goog-te-menu-frame, #goog-gt-tt, .skiptranslate')
      .forEach((el) => el.remove());
    if (document.body?.style) {
      document.body.style.top = '0px';
      document.body.style.marginTop = '0px';
    }
  }

  // Handle any mocked translate element in test environment if present
  const combo = document.querySelector?.('#google_translate_element .goog-te-combo');
  if (combo && Array.from(combo.options || []).some((o) => o.value === lang)) {
    combo.value = lang;
    combo.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Instant native client-side translation walker
  translateDomNodes(lang);
}

