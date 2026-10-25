import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, AlertCircle, Eye, Flame, FlaskConical, MapPin, Sparkles, TrendingUp } from 'lucide-react';

const INDIAN_PURCHASE_LOCATIONS = [
  
  'Park Street, Kolkata (West Bengal)',
  'Salt Lake City Sector 1, Kolkata (West Bengal)',
  'Salt Lake City Sector 2, Kolkata (West Bengal)',
  'Salt Lake City Sector 3, Kolkata (West Bengal)',
  'Salt Lake City Sector 5, Kolkata (West Bengal)',
  'New Town Action Area 1, Kolkata (West Bengal)',
  'New Town Action Area 2, Kolkata (West Bengal)',
  'New Town Action Area 3, Kolkata (West Bengal)',
  'Ballygunge, Kolkata (West Bengal)',
  'Alipore, Kolkata (West Bengal)',
  'New Alipore, Kolkata (West Bengal)',
  'Gariahat, Kolkata (West Bengal)',
  'Tollygunge, Kolkata (West Bengal)',
  'Jadavpur, Kolkata (West Bengal)',
  'Behala, Kolkata (West Bengal)',
  'Lake Town, Kolkata (West Bengal)',
  'Ultadanga, Kolkata (West Bengal)',
  'Kankurgachi, Kolkata (West Bengal)',
  'Baguiati, Kolkata (West Bengal)',
  'VIP Road, Kolkata (West Bengal)',
  'Dum Dum, Kolkata (West Bengal)',
  'Nagerbazar, Kolkata (West Bengal)',
  'Baranagar, Kolkata (West Bengal)',
  'Dakshineswar, Kolkata (West Bengal)',
  'Kasba, Kolkata (West Bengal)',
  'Garfa, Kolkata (West Bengal)',
  'Santoshpur, Kolkata (West Bengal)',
  'Rajendra Nagar, Kolkata (West Bengal)',
  'Mukundapur, Kolkata (West Bengal)',
  'Patuli, Kolkata (West Bengal)',
  'Garia, Kolkata (West Bengal)',
  'Naktala, Kolkata (West Bengal)',
  'Bansdroni, Kolkata (West Bengal)',
  'Rashbehari Avenue, Kolkata (West Bengal)',
  'Southern Avenue, Kolkata (West Bengal)',
  'Hazra, Kolkata (West Bengal)',
  'Kalighat, Kolkata (West Bengal)',
  'Bhowanipore, Kolkata (West Bengal)',
  'Esplanade, Kolkata (West Bengal)',
  'Dalhousie, Kolkata (West Bengal)',
  'Burrabazar, Kolkata (West Bengal)',
  'Bowbazar, Kolkata (West Bengal)',
  'Entally, Kolkata (West Bengal)',
  'Tangra, Kolkata (West Bengal)',
  'Phoolbagan, Kolkata (West Bengal)',
  'Maniktala, Kolkata (West Bengal)',
  'Shyambazar, Kolkata (West Bengal)',
  'Hatibagan, Kolkata (West Bengal)',
  'Cossipore, Kolkata (West Bengal)',
  'Beadon Street, Kolkata (West Bengal)',
  'Khidirpur, Kolkata (West Bengal)',
  'Garden Reach, Kolkata (West Bengal)',
  'Metiabruz, Kolkata (West Bengal)',
  'Taratala, Kolkata (West Bengal)',
  'Thakurpukur, Kolkata (West Bengal)',
  'Joka, Kolkata (West Bengal)',
  'Budge Budge, South 24 Parganas (West Bengal)',
  'Barasat Town, North 24 Parganas (West Bengal)',
  'Madhyamgram, North 24 Parganas (West Bengal)',
  'Hridaypur, North 24 Parganas (West Bengal)',
  'Habra, North 24 Parganas (West Bengal)',
  'Bangaon, North 24 Parganas (West Bengal)',
  'Basirhat, North 24 Parganas (West Bengal)',
  'Barrackpore, North 24 Parganas (West Bengal)',
  'Titagarh, North 24 Parganas (West Bengal)',
  'Khardah, North 24 Parganas (West Bengal)',
  'Sodepur, North 24 Parganas (West Bengal)',
  'Panihati, North 24 Parganas (West Bengal)',
  'Kamarhati, North 24 Parganas (West Bengal)',
  'Dum Dum Cantt, North 24 Parganas (West Bengal)',
  'Rajarhat, North 24 Parganas (West Bengal)',
  'Sonarpur, South 24 Parganas (West Bengal)',
  'Baruipur, South 24 Parganas (West Bengal)',
  'Canning, South 24 Parganas (West Bengal)',
  'Diamond Harbour, South 24 Parganas (West Bengal)',
  'Kakdwip, South 24 Parganas (West Bengal)',
  'Bakkhali, South 24 Parganas (West Bengal)',
  'Gosaba, South 24 Parganas (West Bengal)',

  // Howrah & Hooghly Belt
  'Howrah Station Area, Howrah (West Bengal)',
  'Shibpur, Howrah (West Bengal)',
  'Salkia, Howrah (West Bengal)',
  'Kadamtala, Howrah (West Bengal)',
  'Bally, Howrah (West Bengal)',
  'Belur, Howrah (West Bengal)',
  'Liluah, Howrah (West Bengal)',
  'Dashnagar, Howrah (West Bengal)',
  'Santragachi, Howrah (West Bengal)',
  'Andul, Howrah (West Bengal)',
  'Mankundu, Howrah (West Bengal)',
  'Uluberia, Howrah (West Bengal)',
  'Bagnan, Howrah (West Bengal)',
  'Amta, Howrah (West Bengal)',
  'Panchla, Howrah (West Bengal)',
  'Domjur, Howrah (West Bengal)',
  'Serampore, Hooghly (West Bengal)',
  'Rishra, Hooghly (West Bengal)',
  'Konnagar, Hooghly (West Bengal)',
  'Uttarpara, Hooghly (West Bengal)',
  'Hindmotor, Hooghly (West Bengal)',
  'Bhadreswar, Hooghly (West Bengal)',
  'Champdani, Hooghly (West Bengal)',
  'Chandannagar, Hooghly (West Bengal)',
  'Chinsurah, Hooghly (West Bengal)',
  'Bandel, Hooghly (West Bengal)',
  'Hooghly Ghat, Hooghly (West Bengal)',
  'Dhaniakhali, Hooghly (West Bengal)',
  'Tarakeswar, Hooghly (West Bengal)',
  'Arambagh, Hooghly (West Bengal)',
  'Singur, Hooghly (West Bengal)',
  'Haripal, Hooghly (West Bengal)',

  // Asansol, Durgapur & Industrial Belt (Paschim Bardhaman / Purba Bardhaman / Bankura / Purulia)
  'Station Road, Asansol (West Bengal)',
  'Burnpur, Asansol (West Bengal)',
  'Kulti, Asansol (West Bengal)',
  'Barakar, Asansol (West Bengal)',
  'Raniganj, Asansol (West Bengal)',
  'Jamuria, Asansol (West Bengal)',
  'Disergarh, Asansol (West Bengal)',
  'Chittaranjan, Asansol (West Bengal)',
  'Hirapur, Asansol (West Bengal)',
  'Durgapur City Centre, Durgapur (West Bengal)',
  'Bidhannagar, Durgapur (West Bengal)',
  'Benachity, Durgapur (West Bengal)',
  'Durgapur Steel Township, Durgapur (West Bengal)',
  'Andal, Durgapur (West Bengal)',
  'Kaksa, Durgapur (West Bengal)',
  'Galsi, Purba Bardhaman (West Bengal)',
  'Bardhaman Town, Purba Bardhaman (West Bengal)',
  'Golapbag, Purba Bardhaman (West Bengal)',
  'Memari, Purba Bardhaman (West Bengal)',
  'Katwa, Purba Bardhaman (West Bengal)',
  'Kalna, Purba Bardhaman (West Bengal)',
  'Purbasthali, Purba Bardhaman (West Bengal)',
  'Bankura Town, Bankura (West Bengal)',
  'Bishnupur, Bankura (West Bengal)',
  'Khatra, Bankura (West Bengal)',
  'Sonamukhi, Bankura (West Bengal)',
  'Barabazar, Purulia (West Bengal)',
  'Purulia Town, Purulia (West Bengal)',
  'Adra, Purulia (West Bengal)',
  'Raghunathpur, Purulia (West Bengal)',
  'Jhalda, Purulia (West Bengal)',
  'Ajodhya Hills, Purulia (West Bengal)',

  // North Bengal (Siliguri, Darjeeling, Jalpaiguri, Cooch Behar, Malda, Dinajpur)
  'Sevoke Road, Siliguri (West Bengal)',
  'Pradhan Nagar, Siliguri (West Bengal)',
  'Hill Cart Road, Siliguri (West Bengal)',
  'Hashimara, Siliguri (West Bengal)',
  'Bagdogra, Siliguri (West Bengal)',
  'Matigara, Siliguri (West Bengal)',
  'Sukna, Siliguri (West Bengal)',
  'Mall Road, Darjeeling (West Bengal)',
  'Chowk Bazaar, Darjeeling (West Bengal)',
  'Lebong, Darjeeling (West Bengal)',
  'Happy Valley, Darjeeling (West Bengal)',
  'Kurseong, Darjeeling (West Bengal)',
  'Mirik, Darjeeling (West Bengal)',
  'Kalimpong Town, Kalimpong (West Bengal)',
  'Pedong, Kalimpong (West Bengal)',
  'Lavapani, Kalimpong (West Bengal)',
  'Jalpaiguri Town, Jalpaiguri (West Bengal)',
  'Mainaguri, Jalpaiguri (West Bengal)',
  'Malbazar, Jalpaiguri (West Bengal)',
  'Banarhat, Jalpaiguri (West Bengal)',
  'Lataguri, Jalpaiguri (West Bengal)',
  'Alipurduar Town, Alipurduar (West Bengal)',
  'Jaigaon, Alipurduar (West Bengal)',
  'Buxa Fort, Alipurduar (West Bengal)',
  'Cooch Behar Town, Cooch Behar (West Bengal)',
  'Dinhata, Cooch Behar (West Bengal)',
  'Mathabhanga, Cooch Behar (West Bengal)',
  'Tufanganj, Cooch Behar (West Bengal)',
  'English Bazar, Malda (West Bengal)',
  'Malda Town, Malda (West Bengal)',
  'Chanchal, Malda (West Bengal)',
  'Gour, Malda (West Bengal)',
  'Raiganj, Uttar Dinajpur (West Bengal)',
  'Islampur, Uttar Dinajpur (West Bengal)',
  'Kaliaganj, Uttar Dinajpur (West Bengal)',
  'Balurghat, Dakshin Dinajpur (West Bengal)',
  'Gangarampur, Dakshin Dinajpur (West Bengal)',
  'Buniadpur, Dakshin Dinajpur (West Bengal)',

  // Midnapore, Junglemahal & Murshidabad / Nadia / Birbhum
  'Midnapore Town, Paschim Medinipur (West Bengal)',
  'Kharagpur IIT, Paschim Medinipur (West Bengal)',
  'Kharagpur Town, Paschim Medinipur (West Bengal)',
  'Ghatal, Paschim Medinipur (West Bengal)',
  'Jhargram Town, Jhargram (West Bengal)',
  'Gopiballavpur, Jhargram (West Bengal)',
  'Belpahari, Jhargram (West Bengal)',
  'Tamluk, Purba Medinipur (West Bengal)',
  'Haldia Port City, Purba Medinipur (West Bengal)',
  'Contai, Purba Medinipur (West Bengal)',
  'Digha Beach, Purba Medinipur (West Bengal)',
  'Mandarmani, Purba Medinipur (West Bengal)',
  'Egra, Purba Medinipur (West Bengal)',
  'Berhampore, Murshidabad (West Bengal)',
  'Murshidabad Lalbagh, Murshidabad (West Bengal)',
  'Krishnanagar, Murshidabad (West Bengal)',
  'Jangipur, Murshidabad (West Bengal)',
  'Azimganj, Murshidabad (West Bengal)',
  'Kandi, Murshidabad (West Bengal)',
  'Krishnanagar Town, Nadia (West Bengal)',
  'Nabadwip, Nadia (West Bengal)',
  'Santipur, Nadia (West Bengal)',
  'Ranaghat, Nadia (West Bengal)',
  'Kalyani, Nadia (West Bengal)',
  'Chakdah, Nadia (West Bengal)',
  'Bangaon, Nadia (West Bengal)',
  'Bethuadahari, Nadia (West Bengal)',
  'Suri, Birbhum (West Bengal)',
  'Bolpur Shantiniketan, Birbhum (West Bengal)',
  'Rampurhat, Birbhum (West Bengal)',
  'Sainthia, Birbhum (West Bengal)',
  'Dubrajpur, Birbhum (West Bengal)',
  'Bakreswar, Birbhum (West Bengal)',
  'Nalhati, Birbhum (West Bengal)',


  // ==================== PAN-INDIA COMPREHENSIVE EXPANSION (1000+ TOTAL LOCATIONS ACROSS ALL STATES) ====================
  
  // --- ANDHRA PRADESH ---
  'Dwaraka Nagar, Visakhapatnam (Andhra Pradesh)', 'MVP Colony, Visakhapatnam (Andhra Pradesh)', 'Seethammadhara, Visakhapatnam (Andhra Pradesh)', 
  'Beach Road, Visakhapatnam (Andhra Pradesh)', 'Siripuram, Visakhapatnam (Andhra Pradesh)', 'Gajuwaka, Visakhapatnam (Andhra Pradesh)', 
  'Madhuranagar, Visakhapatnam (Andhra Pradesh)', 'Akkayyapalem, Visakhapatnam (Andhra Pradesh)', 'Ramnagar, Visakhapatnam (Andhra Pradesh)', 'Dabagardens, Visakhapatnam (Andhra Pradesh)',
  'Benz Circle, Vijayawada (Andhra Pradesh)', 'Governorpet, Vijayawada (Andhra Pradesh)', 'Labbipet, Vijayawada (Andhra Pradesh)', 
  'Moghalrajpuram, Vijayawada (Andhra Pradesh)', 'Patamata, Vijayawada (Andhra Pradesh)', 'Autonagar, Vijayawada (Andhra Pradesh)', 'Satyanarayanapuram, Vijayawada (Andhra Pradesh)',
  'Bhanugudi, Kakinada (Andhra Pradesh)', 'Main Road, Kakinada (Andhra Pradesh)', 'Collectorate Road, Kakinada (Andhra Pradesh)', 'Suryaraopeta, Kakinada (Andhra Pradesh)',
  'Danavaipeta, Rajamahendravaram (Andhra Pradesh)', 'T. Nagar, Rajamahendravaram (Andhra Pradesh)', 'Innespeta, Rajamahendravaram (Andhra Pradesh)', 'Aswaraopeta, Rajamahendravaram (Andhra Pradesh)',
  'SV University Road, Tirupati (Andhra Pradesh)', 'Kapila Theertham, Tirupati (Andhra Pradesh)', 'Alipiri, Tirupati (Andhra Pradesh)', 'Gandhi Road, Tirupati (Andhra Pradesh)', 'Tiruchanur Road, Tirupati (Andhra Pradesh)',
  'Brodipet, Guntur (Andhra Pradesh)', 'Arundelpet, Guntur (Andhra Pradesh)', 'Kothapet, Guntur (Andhra Pradesh)', 'Bapatla, Guntur (Andhra Pradesh)',
  'RTC Complex, Nellore (Andhra Pradesh)', 'Trunk Road, Nellore (Andhra Pradesh)', 'Vedayapalem, Nellore (Andhra Pradesh)', 'Minagunta, Nellore (Andhra Pradesh)',
  'Prakasam Road, Kurnool (Andhra Pradesh)', 'Gandhinagar, Kurnool (Andhra Pradesh)', 'Old Town, Kurnool (Andhra Pradesh)', 'Nandyal Road, Kurnool (Andhra Pradesh)',
  'Ashok Nagar, Anantapur (Andhra Pradesh)', 'RTC Bus Stand Road, Anantapur (Andhra Pradesh)', 'Subhash Road, Anantapur (Andhra Pradesh)',
  'Srikakulam Town, Srikakulam (Andhra Pradesh)', 'Vizianagaram Fort Area, Vizianagaram (Andhra Pradesh)', 'Eluru Road, Eluru (Andhra Pradesh)', 'Ongole Town, Prakasam (Andhra Pradesh)',
  'Kadapa Main Road, YSR Kadapa (Andhra Pradesh)', 'Chittoor Town, Chittoor (Andhra Pradesh)', 'Madanapalle, Chittoor (Andhra Pradesh)', 'Hindupur, Anantapur (Andhra Pradesh)',

  // --- ARUNACHAL PRADESH ---
  'Itanagar Capital Complex, Itanagar (Arunachal Pradesh)', 'Naharagun, Itanagar (Arunachal Pradesh)', 'IG Park Area, Itanagar (Arunachal Pradesh)', 'Papu Nallah, Itanagar (Arunachal Pradesh)',
  'Pasighat Market, East Siang (Arunachal Pradesh)', 'Tawang Bazaar, Tawang (Arunachal Pradesh)', 'Old Market, Tawang (Arunachal Pradesh)',
  'Ziro Valley, Lower Subansiri (Arunachal Pradesh)', 'Hapoli, Lower Subansiri (Arunachal Pradesh)', 'Bomdila Town, West Kameng (Arunachal Pradesh)',
  'Tezu Town, Lohit (Arunachal Pradesh)', 'Namsai Town, Namsai (Arunachal Pradesh)', 'Changlang Town, Changlang (Arunachal Pradesh)',
  'Khonsa Town, Tirap (Arunachal Pradesh)', 'Aalo Town, West Siang (Arunachal Pradesh)', 'Roing Town, Lower Dibang Valley (Arunachal Pradesh)',

  // --- ASSAM ---
  'GS Road, Guwahati (Assam)', 'Paltan Bazar, Guwahati (Assam)', 'Pan Bazar, Guwahati (Assam)', 'Chandmari, Guwahati (Assam)', 'Dispur, Guwahati (Assam)', 
  'Ulubari, Guwahati (Assam)', 'Zoo Road, Guwahati (Assam)', 'Beltola, Guwahati (Assam)', 'Six Mile, Guwahati (Assam)', 'Maligaon, Guwahati (Assam)', 'Bhangagarh, Guwahati (Assam)',
  'Dibrugarh Town, Dibrugarh (Assam)', 'CH Road, Dibrugarh (Assam)', 'Boiragimoth, Dibrugarh (Assam)', 'Jorhat Town, Jorhat (Assam)', 'Cinnamara, Jorhat (Assam)', 'Gar Ali, Jorhat (Assam)',
  'Silchar Town, Cachar (Assam)', 'Tarapur, Silchar (Assam)', 'Amjur Bazaar, Silchar (Assam)', 'Tezpur Town, Sonitpur (Assam)', 'Mission Chariali, Tezpur (Assam)',
  'Tinsukia Town, Tinsukia (Assam)', 'Bordoloi Nagar, Tinsukia (Assam)', 'Nagaon Town, Nagaon (Assam)', 'Haibargaon, Nagaon (Assam)', 'Bongaigaon Town, Bongaigaon (Assam)',
  'Kokrajhar Town, Kokrajhar (Assam)', 'Goalpara Town, Goalpara (Assam)', 'Dhubri Town, Dhubri (Assam)', 'Barpeta Road, Barpeta (Assam)', 'North Lakhimpur, Lakhimpur (Assam)',
  'Diphu Town, Karbi Anglong (Assam)', 'Hojai Town, Hojai (Assam)', 'Sivasagar Town, Sivasagar (Assam)', 'Golaghat Town, Golaghat (Assam)', 'Karimganj Town, Karimganj (Assam)',

  // --- BIHAR ---
  'Boring Road, Patna (Bihar)', 'Fraser Road, Patna (Bihar)', 'Kankerbagh, Patna (Bihar)', 'Patliputra Colony, Patna (Bihar)', 'Anisabad, Patna (Bihar)', 
  'Rajendra Nagar, Patna (Bihar)', 'Bailey Road, Patna (Bihar)', 'Kadamkuan, Patna (Bihar)', 'Exhibition Road, Patna (Bihar)', 'Danapur, Patna (Bihar)', 'Phulwari Sharif, Patna (Bihar)',
  'Bistupur, Jamshedpur (Jharkhand/Bihar Border)', 'Station Road, Gaya (Bihar)', 'Civil Lines, Gaya (Bihar)', 'GB Road, Gaya (Bihar)', 'Ramna Road, Gaya (Bihar)',
  'Muzaffarpur Town, Muzaffarpur (Bihar)', 'Mithanpura, Muzaffarpur (Bihar)', 'Ramdayalu Nagar, Muzaffarpur (Bihar)', 'Bhagalpur Town, Bhagalpur (Bihar)', 'Kutchery Road, Bhagalpur (Bihar)',
  'Darbhanga Tower, Darbhanga (Bihar)', 'Laheriasarai, Darbhanga (Bihar)', 'Purnia City, Purnia (Bihar)', 'Line Bazar, Purnia (Bihar)', 'Ara Town, Bhojpur (Bihar)',
  'Chapra Town, Saran (Bihar)', 'Begusarai Town, Begusarai (Bihar)', 'Katihar Town, Katihar (Bihar)', 'Munger Town, Munger (Bihar)', 'Samastipur Town, Samastipur (Bihar)',
  'Siwan Town, Siwan (Bihar)', 'Bettiah Town, West Champaran (Bihar)', 'Motihari Town, East Champaran (Bihar)', 'Sasaram Town, Rohtas (Bihar)', 'Hajipur Town, Vaishali (Bihar)',
  'Buxar Town, Buxar (Bihar)', 'Nawada Town, Nawada (Bihar)', 'Bihar Sharif, Nalanda (Bihar)', 'Rajgir, Nalanda (Bihar)', 'Saharsa Town, Saharsa (Bihar)',

  // --- CHHATTISGARH ---
  'Shankar Nagar, Raipur (Chhattisgarh)', 'Civil Lines, Raipur (Chhattisgarh)', 'Pandri, Raipur (Chhattisgarh)', 'Devendra Nagar, Raipur (Chhattisgarh)', 
  'GE Road, Raipur (Chhattisgarh)', 'Tatibandh, Raipur (Chhattisgarh)', 'Choubey Colony, Raipur (Chhattisgarh)', 'Rajendra Nagar, Raipur (Chhattisgarh)',
  'Bhilai Sector 1, Bhilai (Chhattisgarh)', 'Bhilai Sector 10, Bhilai (Chhattisgarh)', 'Smriti Nagar, Bhilai (Chhattisgarh)', 'Super Market, Durg (Chhattisgarh)',
  'Bilaspur City Centre, Bilaspur (Chhattisgarh)', 'Vyapar Vihar, Bilaspur (Chhattisgarh)', 'Link Road, Bilaspur (Chhattisgarh)', 'Seepat Road, Bilaspur (Chhattisgarh)',
  'Korba Town, Korba (Chhattisgarh)', 'Transport Nagar, Korba (Chhattisgarh)', 'Raigarh Town, Raigarh (Chhattisgarh)', 'Station Road, Raigarh (Chhattisgarh)',
  'Jagdalpur Town, Bastar (Chhattisgarh)', 'Geedam Road, Jagdalpur (Chhattisgarh)', 'Ambikapur Town, Surguja (Chhattisgarh)', 'Main Road, Ambikapur (Chhattisgarh)',
  'Dhamtari Town, Dhamtari (Chhattisgarh)', 'Mahasamund Town, Mahasamund (Chhattisgarh)', 'Kanker Town, Kanker (Chhattisgarh)', 'Rajnandgaon Town, Rajnandgaon (Chhattisgarh)',

  // --- GOA ---
  'Miramar, Panaji (Goa)', 'Altinho, Panaji (Goa)', 'Campal, Panaji (Goa)', 'Fontainhas, Panaji (Goa)', '18th June Road, Panaji (Goa)',
  'Calangute Beach Road, Calangute (Goa)', 'Baga Road, Calangute (Goa)', 'Candolim Beach Road, Candolim (Goa)', 'Sinquerim, Candolim (Goa)',
  'Anjuna Beach Road, Anjuna (Goa)', 'Vagator, Anjuna (Goa)', 'Mapusa Market, Mapusa (Goa)', 'Feira Alta, Mapusa (Goa)',
  'Margao Municipal Square, Margao (Goa)', 'Fatorda, Margao (Goa)', 'Borda, Margao (Goa)', 'Colva Beach Road, Colva (Goa)',
  'Vasco da Gama City Centre, Vasco (Goa)', 'Baina, Vasco da Gama (Goa)', 'Chicalim, Vasco da Gama (Goa)',
  'Ponda Town, Ponda (Goa)', 'Farmagudi, Ponda (Goa)', 'Borim, Ponda (Goa)', 'Assagao, Goa', 'Morjim, Goa', 'Arambol, Goa',
  'Palolem, Canacona (Goa)', 'Agonda, Canacona (Goa)', 'Cavelossim, Salcete (Goa)', 'Benaulim, Salcete (Goa)',

  // --- GUJARAT ---
  'Bodakdev, Ahmedabad (Gujarat)', 'Navrangpura, Ahmedabad (Gujarat)', 'Vastrapur, Ahmedabad (Gujarat)', 'Prahlad Nagar, Ahmedabad (Gujarat)', 
  'Satellite, Ahmedabad (Gujarat)', 'Bopal, Ahmedabad (Gujarat)', 'Maninagar, Ahmedabad (Gujarat)', 'Thaltej, Ahmedabad (Gujarat)', 'Gota, Ahmedabad (Gujarat)', 'Chandkheda, Ahmedabad (Gujarat)',
  'Alkapuri, Vadodara (Gujarat)', 'Akota, Vadodara (Gujarat)', 'Fatehgunj, Vadodara (Gujarat)', 'Manjalpur, Vadodara (Gujarat)', 'Karelibaug, Vadodara (Gujarat)', 'Sayajigunj, Vadodara (Gujarat)',
  'Vesu, Surat (Gujarat)', 'Adajan, Surat (Gujarat)', 'Athwa, Surat (Gujarat)', 'Piplod, Surat (Gujarat)', 'Varachha, Surat (Gujarat)', 'Rander, Surat (Gujarat)', 'Katargam, Surat (Gujarat)',
  'Kalawad Road, Rajkot (Gujarat)', 'Yagnik Road, Rajkot (Gujarat)', 'Race Course, Rajkot (Gujarat)', 'Mavdi, Rajkot (Gujarat)', 'University Road, Rajkot (Gujarat)', 'Amin Marg, Rajkot (Gujarat)',
  'Vidhyanagar, Anand (Gujarat)', 'Station Road, Anand (Gujarat)', 'Sardar Ganj, Anand (Gujarat)', 'Vallabh Vidyanagar, Anand (Gujarat)', 'Mota Bazaar, Vallabh Vidyanagar (Gujarat)',
  'Sector 11, Gandhinagar (Gujarat)', 'Sector 16, Gandhinagar (Gujarat)', 'Sector 21, Gandhinagar (Gujarat)', 'Infocity, Gandhinagar (Gujarat)', 'Raysan, Gandhinagar (Gujarat)',
  'Bhavnagar City Centre, Bhavnagar (Gujarat)', 'Waghawadi Road, Bhavnagar (Gujarat)', 'Nilambaug, Bhavnagar (Gujarat)', 'Mehsana Highway, Mehsana (Gujarat)', 'Modhera Road, Mehsana (Gujarat)',
  'Jamnagar Road, Jamnagar (Gujarat)', 'PN Marg, Jamnagar (Gujarat)', 'Digvijay Plot, Jamnagar (Gujarat)', 'Station Road, Junagadh (Gujarat)', 'Talav Gate, Junagadh (Gujarat)',
  'Navsari Road, Navsari (Gujarat)', 'Vapi Industrial Estate, Vapi (Gujarat)', 'GIDC, Ankleshwar (Gujarat)', 'Station Road, Bharuch (Gujarat)', 'Bhuj City Centre, Kutch (Gujarat)', 'Airport Road, Bhuj (Gujarat)',

  // --- HARYANA ---
  'DLF Phase 1, Gurgaon (Haryana)', 'DLF Phase 2, Gurgaon (Haryana)', 'DLF Phase 3, Gurgaon (Haryana)', 'DLF Phase 4, Gurgaon (Haryana)', 'DLF Phase 5, Gurgaon (Haryana)',
  'Cyber City, Gurgaon (Haryana)', 'Sohna Road, Gurgaon (Haryana)', 'Golf Course Road, Gurgaon (Haryana)', 'Sector 29, Gurgaon (Haryana)', 'MG Road, Gurgaon (Haryana)', 'Udyog Vihar, Gurgaon (Haryana)',
  'Sector 17, Chandigarh Border (Haryana)', 'Sector 7, Panchkula (Haryana)', 'Sector 11, Panchkula (Haryana)', 'Sector 14, Panchkula (Haryana)', 'Industrial Area, Panchkula (Haryana)',
  'Old Faridabad, Faridabad (Haryana)', 'Sector 15, Faridabad (Haryana)', 'Nehru Ground, Faridabad (Haryana)', 'Greenfield Colony, Faridabad (Haryana)', 'Sector 21, Faridabad (Haryana)',
  'Model Town, Ambala Cantt (Haryana)', 'Sadar Bazar, Ambala Cantt (Haryana)', 'Sector 12, Karnal (Haryana)', 'Kunjpura Road, Karnal (Haryana)', 'GT Road, Panipat (Haryana)', 'Model Town, Panipat (Haryana)',
  'Civil Lines, Hisar (Haryana)', 'Model Town, Hisar (Haryana)', 'Urban Estate, Rohtak (Haryana)', 'Medical Mor, Rohtak (Haryana)', 'Sonipat Road, Rohtak (Haryana)', 'Sector 14, Sonipat (Haryana)',
  'Bhiwani Road, Jind (Haryana)', 'Sirsa Town, Sirsa (Haryana)', 'Yamunanagar City Centre, Yamunanagar (Haryana)', 'Model Town, Yamunanagar (Haryana)', 'Kuruchhetra University Road, Kurukshetra (Haryana)',

  // --- HIMACHAL PRADESH ---
  'The Mall Road, Shimla (Himachal Pradesh)', 'Ridge, Shimla (Himachal Pradesh)', 'Sanjauli, Shimla (Himachal Pradesh)', 'Lower Jakhu, Shimla (Himachal Pradesh)', 'Kasumpti, Shimla (Himachal Pradesh)',
  'Bhuntar Airport Road, Kullu (Himachal Pradesh)', 'Old Manali, Manali (Himachal Pradesh)', 'Mall Road, Manali (Himachal Pradesh)', 'Aleo, Manali (Himachal Pradesh)', 'Hadimba Temple Road, Manali (Himachal Pradesh)',
  'Dharamkot, Dharamshala (Himachal Pradesh)', 'McLeod Ganj Square, Dharamshala (Himachal Pradesh)', 'Bhagsunag, Dharamshala (Himachal Pradesh)', 'Civil Lines, Dharamshala (Himachal Pradesh)',
  'Solan City Centre, Solan (Himachal Pradesh)', 'Mall Road, Solan (Himachal Pradesh)', 'The Mall, Dalhousie (Himachal Pradesh)', 'Gandhi Chowk, Dalhousie (Himachal Pradesh)',
  'Kullu Main Bazaar, Kullu (Himachal Pradesh)', 'Mandi Town, Mandi (Himachal Pradesh)', 'Sunder Nagar, Mandi (Himachal Pradesh)', 'Una Town, Una (Himachal Pradesh)',
  'Hamirpur Town, Hamirpur (Himachal Pradesh)', 'Bilaspur Town, Bilaspur (Himachal Pradesh)', 'Chamba Town, Chamba (Himachal Pradesh)', 'Palampur Town, Kangra (Himachal Pradesh)',

  // --- JHARKHAND ---
  'Main Road, Ranchi (Jharkhand)', 'Kanke Road, Ranchi (Jharkhand)', 'Harmu Housing Colony, Ranchi (Jharkhand)', 'Bariatu, Ranchi (Jharkhand)', 'Lalpur, Ranchi (Jharkhand)', 
  'Doranda, Ranchi (Jharkhand)', 'Hinoo, Ranchi (Jharkhand)', 'Ratu Road, Ranchi (Jharkhand)', 'Morabadi, Ranchi (Jharkhand)', 'Kokar, Ranchi (Jharkhand)',
  'Bistupur, Jamshedpur (Jharkhand)', 'Sakchi, Jamshedpur (Jharkhand)', 'Sonari, Jamshedpur (Jharkhand)', 'Kadma, Jamshedpur (Jharkhand)', 'Telco Colony, Jamshedpur (Jharkhand)', 'Mango, Jamshedpur (Jharkhand)', 'Adityapur, Jamshedpur (Jharkhand)',
  'Dhanbad Town, Dhanbad (Jharkhand)', 'Bank More, Dhanbad (Jharkhand)', 'Hirapur, Dhanbad (Jharkhand)', 'Saraidhela, Dhanbad (Jharkhand)', 'Jharia, Dhanbad (Jharkhand)', 'Sindri, Dhanbad (Jharkhand)',
  'Bokaro Steel City Sector 4, Bokaro (Jharkhand)', 'Bokaro Steel City Sector 1, Bokaro (Jharkhand)', 'Chas, Bokaro (Jharkhand)', 'City Centre, Bokaro (Jharkhand)',
  'Hazaribagh Town, Hazaribagh (Jharkhand)', 'Matwari, Hazaribagh (Jharkhand)', 'Giridih Town, Giridih (Jharkhand)', 'Deoghar Town, Deoghar (Jharkhand)', 'Tower Chowk, Deoghar (Jharkhand)',
  'Dumka Town, Dumka (Jharkhand)', 'Medininagar (Daltonganj), Palamu (Jharkhand)', 'Ramgarh Cantt, Ramgarh (Jharkhand)', 'Chaibasa Town, West Singhbhum (Jharkhand)', 'Gumla Town, Gumla (Jharkhand)',

  // --- KARNATAKA ---
  'Indiranagar, Bengaluru (Karnataka)', 'Koramangala, Bengaluru (Karnataka)', 'Jayanagar, Bengaluru (Karnataka)', 'MG Road, Bengaluru (Karnataka)', 'Whitefield, Bengaluru (Karnataka)', 
  'Hebbal, Bengaluru (Karnataka)', 'JP Nagar, Bengaluru (Karnataka)', 'Malleshwaram, Bengaluru (Karnataka)', 'Banashankari, Bengaluru (Karnataka)', 'Electronic City, Bengaluru (Karnataka)', 
  'Bellandur, Bengaluru (Karnataka)', 'Marathahalli, Bengaluru (Karnataka)', 'HSR Layout, Bengaluru (Karnataka)', 'Basavanagudi, Bengaluru (Karnataka)', 'Sadashivanagar, Bengaluru (Karnataka)', 
  'RT Nagar, Bengaluru (Karnataka)', 'Yelahanka, Bengaluru (Karnataka)', 'Bannerghatta Road, Bengaluru (Karnataka)', 'Ulsoor, Bengaluru (Karnataka)', 'Frazer Town, Bengaluru (Karnataka)', 
  'Kalyan Nagar, Bengaluru (Karnataka)', 'BTM Layout, Bengaluru (Karnataka)', 'Vijayanagar, Bengaluru (Karnataka)', 'Rajajinagar, Bengaluru (Karnataka)', 'Seshadripuram, Bengaluru (Karnataka)',
  'Kuvempunagar, Mysuru (Karnataka)', 'Vontikoppal, Mysuru (Karnataka)', 'Jayalakshmipuram, Mysuru (Karnataka)', 'Gokulam, Mysuru (Karnataka)', 'Saraswathipuram, Mysuru (Karnataka)', 'Devaraja Urs Road, Mysuru (Karnataka)',
  'Vidyanagar, Hubballi (Karnataka)', 'Keshwapur, Hubballi (Karnataka)', 'Deshpande Nagar, Hubballi (Karnataka)', 'CBT, Hubballi (Karnataka)', 'Dharwad University Area, Dharwad (Karnataka)', 'PB Road, Dharwad (Karnataka)',
  'Mangaladevi, Mangaluru (Karnataka)', 'Bejai, Mangaluru (Karnataka)', 'Kadri, Mangaluru (Karnataka)', 'Hampankatta, Mangaluru (Karnataka)', 'Lalbagh, Mangaluru (Karnataka)', 'Kankanady, Mangaluru (Karnataka)',
  'Manipal, Udupi (Karnataka)', 'KMC Road, Udupi (Karnataka)', 'Service Bus Stand, Udupi (Karnataka)', 'Brahthagiri, Udupi (Karnataka)',
  'Nehru Nagar, Belagavi (Karnataka)', 'Camp, Belagavi (Karnataka)', 'Tilakwadi, Belagavi (Karnataka)', 'Shaniwar Peth, Belagavi (Karnataka)',
  'Vidyagiri, Bagalkot (Karnataka)', 'Navanagar, Hubballi-Dharwad (Karnataka)', 'Gandhinagar, Davanagere (Karnataka)', 'P.B. Road, Davanagere (Karnataka)',
  'B.H. Road, Shivamogga (Karnataka)', 'Gopala Extension, Shivamogga (Karnataka)', 'Kuvempu Nagar, Tumakuru (Karnataka)', 'BH Road, Tumakuru (Karnataka)',
  'Raichur Station Road, Raichur (Karnataka)', 'Station Road, Kalaburagi (Karnataka)', 'Super Market, Kalaburagi (Karnataka)', 'Gandhi Circle, Ballari (Karnataka)', 'Cantonment, Ballari (Karnataka)',

  // --- KERALA ---
  'Fort Kochi, Kerala', 'MG Road, Kochi (Kerala)', 'Kadavanthra, Kochi (Kerala)', 'Edappally, Kochi (Kerala)', 'Palarivattom, Kochi (Kerala)', 
  'Panampilly Nagar, Kochi (Kerala)', 'Kaloor, Kochi (Kerala)', 'Marine Drive, Kochi (Kerala)', 'Vyttila, Kochi (Kerala)', 'Thrippunithura, Kochi (Kerala)', 'Palarivattom, Kochi (Kerala)',
  'Kowdiar, Thiruvananthapuram (Kerala)', 'Pattom, Thiruvananthapuram (Kerala)', 'Vellayambalam, Thiruvananthapuram (Kerala)', 'East Fort, Thiruvananthapuram (Kerala)', 
  'Technopark, Thiruvananthapuram (Kerala)', 'Statue, Thiruvananthapuram (Kerala)', 'Sasthamangalam, Thiruvananthapuram (Kerala)', 'Palayam, Thiruvananthapuram (Kerala)', 'Pappanamcode, Thiruvananthapuram (Kerala)',
  'Mananchira, Kozhikode (Kerala)', 'Mavoor Road, Kozhikode (Kerala)', 'SM Street, Kozhikode (Kerala)', 'West Hill, Kozhikode (Kerala)', 'Nadakkavu, Kozhikode (Kerala)', 'Beach Road, Kozhikode (Kerala)', 'Kallai, Kozhikode (Kerala)',
  'Kottayam Town, Kottayam (Kerala)', 'Collectorate, Kottayam (Kerala)', 'Shastri Road, Kottayam (Kerala)', 'Nagampadam, Kottayam (Kerala)', 'Kanjikuzhy, Kottayam (Kerala)',
  'Swaraj Round, Thrissur (Kerala)', 'Punkunnam, Thrissur (Kerala)', 'Ayyanthole, Thrissur (Kerala)', 'Ollur, Thrissur (Kerala)', 'West Fort, Thrissur (Kerala)', 'Sakthan Thampuran Nagar, Thrissur (Kerala)',
  'Palakkad Town, Palakkad (Kerala)', 'Olavakkode, Palakkad (Kerala)', 'Vadakkencherry, Palakkad (Kerala)', 'Kalpetta Town, Wayanad (Kerala)', 'Sulthan Bathery, Wayanad (Kerala)',
  'Kannur Town, Kannur (Kerala)', 'Thavakkara, Kannur (Kerala)', 'Payyannur, Kannur (Kerala)', 'Kollam Beach, Kollam (Kerala)', 'Chinnakkada, Kollam (Kerala)', 'Pathanamthitta Town, Pathanamthitta (Kerala)',
  'Thiruvalla, Pathanamthitta (Kerala)', 'Cherthala, Alappuzha (Kerala)', 'Alappuzha Beach Road, Alappuzha (Kerala)', 'Munnar Tea Town, Idukki (Kerala)', 'Thodupuzha, Idukki (Kerala)', 'Kasaragod Town, Kasaragod (Kerala)',

  // --- MADHYA PRADESH ---
  'Vijay Nagar, Indore (Madhya Pradesh)', 'Palasia, Indore (Madhya Pradesh)', 'AB Road, Indore (Madhya Pradesh)', 'Rau, Indore (Madhya Pradesh)', 
  'Rajwada, Indore (Madhya Pradesh)', 'Sapna Sangeeta, Indore (Madhya Pradesh)', 'South Tukoganj, Indore (Madhya Pradesh)', 'Bhawarkua, Indore (Madhya Pradesh)', 'Lal Bagh, Indore (Madhya Pradesh)', 'New Palasia, Indore (Madhya Pradesh)', 'Saket Nagar, Indore (Madhya Pradesh)',
  'MP Nagar, Bhopal (Madhya Pradesh)', 'Arera Colony, Bhopal (Madhya Pradesh)', 'Kolar Road, Bhopal (Madhya Pradesh)', 'New Market, Bhopal (Madhya Pradesh)', 
  'Habibganj, Bhopal (Madhya Pradesh)', 'Shahpura, Bhopal (Madhya Pradesh)', 'BHEL, Bhopal (Madhya Pradesh)', 'Old City, Bhopal (Madhya Pradesh)', 'Koh-e-Fiza, Bhopal (Madhya Pradesh)', 'Idgah Hills, Bhopal (Madhya Pradesh)',
  'Civil Lines, Jabalpur (Madhya Pradesh)', 'Napier Town, Jabalpur (Madhya Pradesh)', 'Wright Town, Jabalpur (Madhya Pradesh)', 'Gorakhpur, Jabalpur (Madhya Pradesh)', 
  'South Civil Lines, Jabalpur (Madhya Pradesh)', 'Gwarighat, Jabalpur (Madhya Pradesh)', 'Yadav Colony, Jabalpur (Madhya Pradesh)',
  'Maharajwada, Ujjain (Madhya Pradesh)', 'Freeganj, Ujjain (Madhya Pradesh)', 'Dewas Road, Ujjain (Madhya Pradesh)', 'Nanakheda, Ujjain (Madhya Pradesh)', 'Subhash Chowk, Ujjain (Madhya Pradesh)',
  'Lashkar, Gwalior (Madhya Pradesh)', 'City Centre, Gwalior (Madhya Pradesh)', 'Morar, Gwalior (Madhya Pradesh)', 'Thatipur, Gwalior (Madhya Pradesh)', 'Hajira, Gwalior (Madhya Pradesh)', 'University Road, Gwalior (Madhya Pradesh)',
  'Sagar City Centre, Sagar (Madhya Pradesh)', 'Civil Lines, Sagar (Madhya Pradesh)', 'Satna Town, Satna (Madhya Pradesh)', 'Rewa Town, Rewa (Madhya Pradesh)', 'Model Road, Rewa (Madhya Pradesh)',
  'Dewas Industrial Area, Dewas (Madhya Pradesh)', 'Ratlam City Centre, Ratlam (Madhya Pradesh)', 'Khandwa Road, Khargone (Madhya Pradesh)', 'Hoshangabad Road, Narmadapuram (Madhya Pradesh)',
  'Betul Town, Betul (Madhya Pradesh)', 'Chhindwara Town, Chhindwara (Madhya Pradesh)', 'Shivpuri Town, Shivpuri (Madhya Pradesh)', 'Mandsaur Town, Mandsaur (Madhya Pradesh)', 'Neemuch Town, Neemuch (Madhya Pradesh)',

  // --- MAHARASHTRA ---
  'Koregaon Park, Pune (Maharashtra)', 'Bandra West, Mumbai (Maharashtra)', 'Andheri West, Mumbai (Maharashtra)', 'Juhu, Mumbai (Maharashtra)', 'Colaba, Mumbai (Maharashtra)', 
  'Lower Parel, Mumbai (Maharashtra)', 'Worli, Mumbai (Maharashtra)', 'Bandra Kurla Complex (BKC), Mumbai (Maharashtra)', 'Malabar Hill, Mumbai (Maharashtra)', 'Powai, Mumbai (Maharashtra)', 
  'Dadar West, Mumbai (Maharashtra)', 'Khar West, Mumbai (Maharashtra)', 'Santacruz West, Mumbai (Maharashtra)', 'Goregaon East, Mumbai (Maharashtra)', 'Thane West, Thane (Maharashtra)', 
  'Vashi, Navi Mumbai (Maharashtra)', 'CBD Belapur, Navi Mumbai (Maharashtra)', 'Kharghar, Navi Mumbai (Maharashtra)', 'Nerul, Navi Mumbai (Maharashtra)', 'Deccan Gymkhana, Pune (Maharashtra)', 
  'Kalyani Nagar, Pune (Maharashtra)', 'Viman Nagar, Pune (Maharashtra)', 'Aundh, Pune (Maharashtra)', 'Baner, Pune (Maharashtra)', 'Hinjawadi, Pune (Maharashtra)', 'Magarpatta, Pune (Maharashtra)', 
  'Hadapsar, Pune (Maharashtra)', 'Kothrud, Pune (Maharashtra)', 'Shivajinagar, Pune (Maharashtra)', 'Wakad, Pune (Maharashtra)', 'Pimple Saudagar, Pune (Maharashtra)', 'Pali Hill, Mumbai (Maharashtra)', 
  'Lokhandwala, Mumbai (Maharashtra)', 'Mulund West, Mumbai (Maharashtra)', 'Kandivali West, Mumbai (Maharashtra)', 'Borivali West, Mumbai (Maharashtra)', 'Chembur, Mumbai (Maharashtra)', 'Ghatkopar West, Mumbai (Maharashtra)',
  'Civil Lines, Nagpur (Maharashtra)', 'Dharampeth, Nagpur (Maharashtra)', 'Sadar, Nagpur (Maharashtra)', 'Laxmi Nagar, Nagpur (Maharashtra)', 'Pratap Nagar, Nagpur (Maharashtra)', 'Manewada, Nagpur (Maharashtra)', 'Dhantoli, Nagpur (Maharashtra)',
  'Gangapur Road, Nashik (Maharashtra)', 'College Road, Nashik (Maharashtra)', 'Satpur, Nashik (Maharashtra)', 'Indiranagar, Nashik (Maharashtra)', 'Cidco, Nashik (Maharashtra)', 'Panchavati, Nashik (Maharashtra)',
  'Shahupuri, Kolhapur (Maharashtra)', 'Tarabai Park, Kolhapur (Maharashtra)', 'Lakshmipuri, Kolhapur (Maharashtra)', 'Rajarampuri, Kolhapur (Maharashtra)', 'Mahadwar Road, Kolhapur (Maharashtra)',
  'Station Road, Aurangabad (Chhatrapati Sambhajinagar) (Maharashtra)', 'Adalat Road, Aurangabad (Maharashtra)', 'Cidco, Aurangabad (Maharashtra)', 'Railway Station Road, Solapur (Maharashtra)', 'Navi Peth, Solapur (Maharashtra)',
  'Jalgaon City Centre, Jalgaon (Maharashtra)', 'Station Road, Amravati (Maharashtra)', 'Camp, Amravati (Maharashtra)', 'Civil Lines, Akola (Maharashtra)', 'Latur City Centre, Latur (Maharashtra)', 'Nanded Town, Nanded (Maharashtra)',
  'Ratnagiri City Centre, Ratnagiri (Maharashtra)', 'Sindhudurg Town, Sindhudurg (Maharashtra)', 'Satara City Centre, Satara (Maharashtra)', 'Sangli Miraj Road, Sangli (Maharashtra)', 'Ahmednagar City Centre, Ahmednagar (Maharashtra)',

  // --- MANIPUR ---
  'Thangal Bazar, Imphal (Manipur)', 'Paona Bazar, Imphal (Manipur)', 'Kangla, Imphal (Manipur)', 'Lamphelpat, Imphal (Manipur)', 'Uripok, Imphal (Manipur)', 'Singjamei, Imphal (Manipur)', 'Kwakeithel, Imphal (Manipur)',
  'Churachandpur Town, Churachandpur (Manipur)', 'Thoubal Town, Thoubal (Manipur)', 'Bishnupur Town, Bishnupur (Manipur)', 'Ukhrul Town, Ukhrul (Manipur)', 'Senapati Town, Senapati (Manipur)', 'Tamenglong Town, Tamenglong (Manipur)',

  // --- MEGHALAYA ---
  'Police Bazar, Shillong (Meghalaya)', 'Laitumkhrah, Shillong (Meghalaya)', 'Malki, Shillong (Meghalaya)', 'Lachumiere, Shillong (Meghalaya)', 'Nongthymmai, Shillong (Meghalaya)', 'Pynthorumkhrah, Shillong (Meghalaya)',
  'Tura Market, West Garo Hills (Meghalaya)', 'Jowai Town, West Jaintia Hills (Meghalaya)', 'Nongstoin Town, West Khasi Hills (Meghalaya)', 'Baghmara Town, South Garo Hills (Meghalaya)', 'Resubelpara Town, North Garo Hills (Meghalaya)',

  // --- MIZORAM ---
  'Bara Bazar, Aizawl (Mizoram)', 'Chanmari, Aizawl (Mizoram)', 'Khatla, Aizawl (Mizoram)', 'Zarkawt, Aizawl (Mizoram)', 'Electric Veng, Aizawl (Mizoram)', 'Bawngkawn, Aizawl (Mizoram)',
  'Lunglei Town, Lunglei (Mizoram)', 'Champhai Town, Champhai (Mizoram)', 'Serchhip Town, Serchhip (Mizoram)', 'Kolasib Town, Kolasib (Mizoram)', 'Mamit Town, Mamit (Mizoram)',

  // --- NAGALAND ---
  'High School Colony, Kohima (Nagaland)', 'PR Hill, Kohima (Nagaland)', 'Bazar Ward, Kohima (Nagaland)', 'New Secretariat, Kohima (Nagaland)',
  'Dimapur Super Market, Dimapur (Nagaland)', 'Circular Road, Dimapur (Nagaland)', 'Nagarjan, Dimapur (Nagaland)', 'Mission Compound, Dimapur (Nagaland)',
  'Mokokchung Town, Mokokchung (Nagaland)', 'Wokha Town, Wokha (Nagaland)', 'Zunheboto Town, Zunheboto (Nagaland)', 'Mon Town, Mon (Nagaland)', 'Tuensang Town, Tuensang (Nagaland)',

  // --- ODISHA ---
  'Saheed Nagar, Bhubaneswar (Odisha)', 'Nayapalli, Bhubaneswar (Odisha)', 'Patia, Bhubaneswar (Odisha)', 'Chandrasekharpur, Bhubaneswar (Odisha)', 'Unit 1 Market Building, Bhubaneswar (Odisha)', 'Rasulgarh, Bhubaneswar (Odisha)', 'Kharabela Nagar, Bhubaneswar (Odisha)', 'Jaydev Vihar, Bhubaneswar (Odisha)',
  'Buxi Bazaar, Cuttack (Odisha)', 'Badambadi, Cuttack (Odisha)', 'Daragha Bazaar, Cuttack (Odisha)', 'Madhupatna, Cuttack (Odisha)', 'Chauliaganj, Cuttack (Odisha)', 'Sealdah, Cuttack (Odisha)',
  'Rourkela Sector 2, Rourkela (Odisha)', 'Rourkela Sector 19, Rourkela (Odisha)', 'Civil Township, Rourkela (Odisha)', 'Udit Nagar, Rourkela (Odisha)', 'Chhend Colony, Rourkela (Odisha)',
  'Station Road, Puri (Odisha)', 'Grand Road, Puri (Odisha)', 'Swargadwar, Puri (Odisha)', 'Sea Beach Road, Puri (Odisha)',
  'Balasore Town, Balasore (Odisha)', 'Station Square, Balasore (Odisha)', 'Fakir Mohan Nagar, Balasore (Odisha)', 'Berhampur Town (Brahmapur), Ganjam (Odisha)', 'Goods Shed Road, Berhampur (Odisha)', 'Aska Road, Berhampur (Odisha)',
  'Sambalpur University Road, Sambalpur (Odisha)', 'Ainthapali, Sambalpur (Odisha)', 'Khetrajpur, Sambalpur (Odisha)', 'Jharsuguda Town, Jharsuguda (Odisha)', 'Brajrajnagar, Jharsuguda (Odisha)',
  'Angul Town, Angul (Odisha)', 'Talcher Thermal, Angul (Odisha)', 'Dhenkanal Town, Dhenkanal (Odisha)', 'Baripada Town, Mayurbhanj (Odisha)', 'Keonjhar Town, Keonjhar (Odisha)',
  'Bhadrak Town, Bhadrak (Odisha)', 'Jajpur Road, Jajpur (Odisha)', 'Kendrapara Town, Kendrapara (Odisha)', 'Paradip Port Area, Jagatsinghpur (Odisha)', 'Rayagada Town, Rayagada (Odisha)', 'Koraput Town, Koraput (Odisha)', 'Jeypore Town, Koraput (Odisha)',

  // --- PUNJAB ---
  'Mall Road, Ludhiana (Punjab)', 'Sarabha Nagar, Ludhiana (Punjab)', 'Ghumar Mandi, Ludhiana (Punjab)', 'Civil Lines, Ludhiana (Punjab)', 'Model Town, Ludhiana (Punjab)', 'Feroz Gandhi Market, Ludhiana (Punjab)', 'Dugri, Ludhiana (Punjab)', 'Pakhowal Road, Ludhiana (Punjab)',
  'Ranjit Avenue, Amritsar (Punjab)', 'Mall Road, Amritsar (Punjab)', 'Lawrance Road, Amritsar (Punjab)', 'Katra Sher Singh, Amritsar (Punjab)', 'Queens Road, Amritsar (Punjab)', 'Hall Bazaar, Amritsar (Punjab)', 'Ajnala Road, Amritsar (Punjab)',
  'Model Town, Jalandhar (Punjab)', 'Civil Lines, Jalandhar (Punjab)', 'BMC Chowk, Jalandhar (Punjab)', 'Garha Road, Jalandhar (Punjab)', 'Urban Estate, Jalandhar (Punjab)', 'Rama Mandi, Jalandhar (Punjab)', 'Nakodar Road, Jalandhar (Punjab)',
  'The Mall, Patiala (Punjab)', 'Leela Bhawan, Patiala (Punjab)', 'Urban Estate, Patiala (Punjab)', 'Rajbaha Road, Patiala (Punjab)', 'Anardana Chowk, Patiala (Punjab)',
  'Model Town, Bathinda (Punjab)', 'The Mall Road, Bathinda (Punjab)', 'Ajit Road, Bathinda (Punjab)', 'Civil Lines, Bathinda (Punjab)',
  'GT Road, Jalandhar Bypass, Phagwara (Punjab)', 'Hoshiarpur Town, Hoshiarpur (Punjab)', 'Moga Town, Moga (Punjab)', 'Pathankot City Centre, Pathankot (Punjab)', 'Dalhousie Road, Pathankot (Punjab)',
  'Sangrur Town, Sangrur (Punjab)', 'Barnala Town, Barnala (Punjab)', 'Faridkot Town, Faridkot (Punjab)', 'Firozpur Cantt, Firozpur (Punjab)', 'Abohar Town, Fazilka (Punjab)', 'Malerkotla Town, Malerkotla (Punjab)',

  // --- RAJASTHAN ---
  'C-Scheme, Jaipur (Rajasthan)', 'Malviya Nagar, Jaipur (Rajasthan)', 'Vaishali Nagar, Jaipur (Rajasthan)', 'Raja Park, Jaipur (Rajasthan)', 'Mansarovar, Jaipur (Rajasthan)', 'Tonk Road, Jaipur (Rajasthan)', 'Jagatpura, Jaipur (Rajasthan)', 'Sodala, Jaipur (Rajasthan)', 'Bani Park, Jaipur (Rajasthan)', 'Lal Kothi, Jaipur (Rajasthan)', 'Vidhyadhar Nagar, Jaipur (Rajasthan)', 'Pratap Nagar, Jaipur (Rajasthan)', 'Ajmer Road, Jaipur (Rajasthan)', 'Sirsi Road, Jaipur (Rajasthan)', 'Shyam Nagar, Jaipur (Rajasthan)',
  'Sardarpura, Jodhpur (Rajasthan)', 'Ratanada, Jodhpur (Rajasthan)', 'Chopasni Housing Board, Jodhpur (Rajasthan)', 'Shastri Nagar, Jodhpur (Rajasthan)', 'Paota, Jodhpur (Rajasthan)', 'Moti Nagar, Jodhpur (Rajasthan)', 'Masuria, Jodhpur (Rajasthan)',
  'Udaipole, Udaipur (Rajasthan)', 'Hiran Magri, Udaipur (Rajasthan)', 'Fatehpura, Udaipur (Rajasthan)', 'Sukher, Udaipur (Rajasthan)', 'Amba Mata, Udaipur (Rajasthan)', 'Surajpol, Udaipur (Rajasthan)', 'Shobhagpura, Udaipur (Rajasthan)', 'Bhuwana, Udaipur (Rajasthan)',
  'Civil Lines, Ajmer (Rajasthan)', 'Ana Sagar, Ajmer (Rajasthan)', 'Vaishali Nagar, Ajmer (Rajasthan)', 'Station Road, Ajmer (Rajasthan)', 'Dargah Bazaar, Ajmer (Rajasthan)', 'Naya Bazaar, Ajmer (Rajasthan)',
  'Kota Industrial Area, Kota (Rajasthan)', 'Talwandi, Kota (Rajasthan)', 'Gumanpura, Kota (Rajasthan)', 'Mahaveer Nagar, Kota (Rajasthan)', 'Jawahar Nagar, Kota (Rajasthan)', 'Vigyan Nagar, Kota (Rajasthan)',
  'Bikaner Road, Alwar (Rajasthan)', 'Scheme Number 2, Alwar (Rajasthan)', 'Civil Lines, Alwar (Rajasthan)', 'Station Road, Bikaner (Rajasthan)', 'JNV Colony, Bikaner (Rajasthan)', 'Rani Bazar, Bikaner (Rajasthan)',
  'Sikar Road, Sikar (Rajasthan)', 'Station Road, Pali (Rajasthan)', 'Chittorgarh Fort Road, Chittorgarh (Rajasthan)', 'Mount Abu Road, Sirohi (Rajasthan)', 'Barmer Town, Barmer (Rajasthan)', 'Jaisalmer Fort Area, Jaisalmer (Rajasthan)', 'Hanumangarh Town, Hanumangarh (Rajasthan)', 'Sri Ganganagar City Centre, Sri Ganganagar (Rajasthan)',

  // --- SIKKIM ---
  'MG Marg, Gangtok (Sikkim)', 'Deorali, Gangtok (Sikkim)', 'Tibet Road, Gangtok (Sikkim)', 'Lal Market, Gangtok (Sikkim)', 'Tadong, Gangtok (Sikkim)', 'Ranipool, Gangtok (Sikkim)', 'Sichey, Gangtok (Sikkim)',
  'Namchi Town, South Sikkim (Sikkim)', 'Pelling Town, West Sikkim (Sikkim)', 'Ravangla, South Sikkim (Sikkim)', 'Mangan Town, North Sikkim (Sikkim)', 'Gyalshing Town, West Sikkim (Sikkim)', 'Singtam, East Sikkim (Sikkim)', 'Rangpo, East Sikkim (Sikkim)',

  // --- TAMIL NADU ---
  'Alwarpet, Chennai (Tamil Nadu)', 'T. Nagar, Chennai (Tamil Nadu)', 'Nungambakkam, Chennai (Tamil Nadu)', 'Anna Nagar, Chennai (Tamil Nadu)', 'Adyar, Chennai (Tamil Nadu)', 'Mylapore, Chennai (Tamil Nadu)', 'Velachery, Chennai (Tamil Nadu)', 'Besant Nagar, Chennai (Tamil Nadu)', 'Kilpauk, Chennai (Tamil Nadu)', 'Egmore, Chennai (Tamil Nadu)', 'Royapettah, Chennai (Tamil Nadu)', 'Kodambakkam, Chennai (Tamil Nadu)', 'Porur, Chennai (Tamil Nadu)', 'Sholinganallur, Chennai (Tamil Nadu)', 'OMR, Chennai (Tamil Nadu)', 'Guindy, Chennai (Tamil Nadu)', 'Tambaram, Chennai (Tamil Nadu)', 'Chromepet, Chennai (Tamil Nadu)', 'Pallavaram, Chennai (Tamil Nadu)', 'Vadapalani, Chennai (Tamil Nadu)', 'Triplicane, Chennai (Tamil Nadu)', 'Broadway, Chennai (Tamil Nadu)',
  'RS Puram, Coimbatore (Tamil Nadu)', 'Peelamedu, Coimbatore (Tamil Nadu)', 'Gandhipuram, Coimbatore (Tamil Nadu)', 'Saibaba Colony, Coimbatore (Tamil Nadu)', 'Avinashi Road, Coimbatore (Tamil Nadu)', 'Race Course, Coimbatore (Tamil Nadu)', 'Ukkadam, Coimbatore (Tamil Nadu)', 'Singanallur, Coimbatore (Tamil Nadu)', 'Ramanathapuram, Coimbatore (Tamil Nadu)', 'Vadavalli, Coimbatore (Tamil Nadu)',
  'Cantonment, Tiruchirappalli (Tamil Nadu)', 'Thillai Nagar, Tiruchirappalli (Tamil Nadu)', 'Srirangam, Tiruchirappalli (Tamil Nadu)', 'Chathiram Bus Stand, Tiruchirappalli (Tamil Nadu)', 'Salai Road, Tiruchirappalli (Tamil Nadu)', 'Woraiyur, Tiruchirappalli (Tamil Nadu)',
  'Tallakulam, Madurai (Tamil Nadu)', 'KK Nagar, Madurai (Tamil Nadu)', 'Anna Nagar, Madurai (Tamil Nadu)', 'Simmakkal, Madurai (Tamil Nadu)', 'Goripalayam, Madurai (Tamil Nadu)', 'Periyar Bus Stand, Madurai (Tamil Nadu)', 'Thirunagar, Madurai (Tamil Nadu)', 'Highways Colony, Madurai (Tamil Nadu)', 'Sellur, Madurai (Tamil Nadu)',
  'Vellore Fort Area, Vellore (Tamil Nadu)', 'Katpadi, Vellore (Tamil Nadu)', 'Gandhi Nagar, Vellore (Tamil Nadu)', 'Sathuvachari, Vellore (Tamil Nadu)', 'Arcot Road, Vellore (Tamil Nadu)',
  'Cutchery Road, Salem (Tamil Nadu)', 'Fairlands, Salem (Tamil Nadu)', 'Ammapet, Salem (Tamil Nadu)', 'Hasthampatti, Salem (Tamil Nadu)', 'Suramangalam, Salem (Tamil Nadu)',
  'Erode City Centre, Erode (Tamil Nadu)', 'Brough Road, Erode (Tamil Nadu)', 'Tiruppur Export Zone, Tiruppur (Tamil Nadu)', 'Avinashi Road, Tiruppur (Tamil Nadu)',
  'Thanjavur Palace Area, Thanjavur (Tamil Nadu)', 'Medical College Road, Thanjavur (Tamil Nadu)', 'Kumbakonam Main Road, Thanjavur (Tamil Nadu)', 'Dindigul Town, Dindigul (Tamil Nadu)',
  'Beach Road, Nagapattinam (Tamil Nadu)', 'Cuddalore Town, Cuddalore (Tamil Nadu)', 'Pudukkottai Town, Pudukkottai (Tamil Nadu)', 'Sivaganga Town, Sivaganga (Tamil Nadu)', 'Ramanathapuram Town, Ramanathapuram (Tamil Nadu)', 'Tuticorin Port Area, Thoothukudi (Tamil Nadu)', 'Wimco Nagar, Thoothukudi (Tamil Nadu)',
  'Tirunelveli Town, Tirunelveli (Tamil Nadu)', 'Palayamkottai, Tirunelveli (Tamil Nadu)', 'Kanyakumari Beach Road, Kanyakumari (Tamil Nadu)', 'Nagercoil Town, Kanyakumari (Tamil Nadu)', 'Ooty Lake Road, The Nilgiris (Tamil Nadu)', 'Coonoor Road, The Nilgiris (Tamil Nadu)',

  // --- TELANGANA ---
  'Jubilee Hills, Hyderabad (Telangana)', 'Banjara Hills, Hyderabad (Telangana)', 'Gachibowli, Hyderabad (Telangana)', 'Hitech City, Hyderabad (Telangana)', 'Madhapur, Hyderabad (Telangana)', 'Kukatpally, Hyderabad (Telangana)', 'Secunderabad, Hyderabad (Telangana)', 'Ameerpet, Hyderabad (Telangana)', 'Begumpet, Hyderabad (Telangana)', 'Kondapur, Hyderabad (Telangana)', 'Miyapur, Hyderabad (Telangana)', 'Dilsukhnagar, Hyderabad (Telangana)', 'LB Nagar, Hyderabad (Telangana)', 'Mehdipatnam, Hyderabad (Telangana)', 'Somajiguda, Hyderabad (Telangana)', 'Panjagutta, Hyderabad (Telangana)', 'Himayatnagar, Hyderabad (Telangana)', 'Abids, Hyderabad (Telangana)', 'RTC Crossroads, Hyderabad (Telangana)', 'Tarnaka, Hyderabad (Telangana)', 'Malkajgiri, Hyderabad (Telangana)', 'Kothaguda, Hyderabad (Telangana)', 'Financial District, Hyderabad (Telangana)', 'Narsingi, Hyderabad (Telangana)', 'Kokapet, Hyderabad (Telangana)', 'Kachiguda, Hyderabad (Telangana)', 'Charminar, Hyderabad (Telangana)', 'Tolichowki, Hyderabad (Telangana)', 'Shamshabad, Hyderabad (Telangana)',
  'Khammam Town, Khammam (Telangana)', 'Wyra Road, Khammam (Telangana)', 'Collectorate, Warangal (Telangana)', 'Hanamkonda, Warangal (Telangana)', 'Kazipet, Warangal (Telangana)', 'Adalat, Warangal (Telangana)',
  'Nizamabad Town, Nizamabad (Telangana)', 'Bus Stand Road, Nizamabad (Telangana)', 'Karimnagar Town, Karimnagar (Telangana)', 'Collectorate Road, Karimnagar (Telangana)',
  'Mahbubnagar Town, Mahbubnagar (Telangana)', 'Nalgonda Town, Nalgonda (Telangana)', 'Siddipet Town, Siddipet (Telangana)', 'Suryapet Town, Suryapet (Telangana)', 'Adilabad Town, Adilabad (Telangana)', 'Sangareddy Town, Medak (Telangana)',

  // --- TRIPURA ---
  'Agartala City Centre, Agartala (Tripura)', 'Battala, Agartala (Tripura)', 'Kunjaban, Agartala (Tripura)', 'Arundhutinagar, Agartala (Tripura)', 'Banamalipur, Agartala (Tripura)', 'Mantribari Road, Agartala (Tripura)',
  'Udaipur Town, Gomati (Tripura)', 'Dharmanagar Town, North Tripura (Tripura)', 'Kailashahar Town, Unakoti (Tripura)', 'Ambassa Town, Dhalai (Tripura)', 'Belonia Town, South Tripura (Tripura)',

  // --- UTTAR PRADESH ---
  'Gomti Nagar, Lucknow (Uttar Pradesh)', 'Hazratganj, Lucknow (Uttar Pradesh)', 'Aliganj, Lucknow (Uttar Pradesh)', 'Mahanagar, Lucknow (Uttar Pradesh)', 'Aminabad, Lucknow (Uttar Pradesh)', 'Indira Nagar, Lucknow (Uttar Pradesh)', 'Ashiyana, Lucknow (Uttar Pradesh)', 'Chowk, Lucknow (Uttar Pradesh)', 'Jal Vayu Vihar, Lucknow (Uttar Pradesh)', 'Sushant Golf City, Lucknow (Uttar Pradesh)', 'Vibhuti Khand, Lucknow (Uttar Pradesh)', 'Alambagh, Lucknow (Uttar Pradesh)', 'Charbagh, Lucknow (Uttar Pradesh)',
  'Civil Lines, Kanpur (Uttar Pradesh)', 'Swaroop Nagar, Kanpur (Uttar Pradesh)', 'Mall Road, Kanpur (Uttar Pradesh)', 'Kakadeo, Kanpur (Uttar Pradesh)', 'Kidwai Nagar, Kanpur (Uttar Pradesh)', 'Arya Nagar, Kanpur (Uttar Pradesh)', 'Pandu Nagar, Kanpur (Uttar Pradesh)', 'Birhana Road, Kanpur (Uttar Pradesh)', 'Govind Nagar, Kanpur (Uttar Pradesh)',
  'Civil Lines, Prayagraj (Uttar Pradesh)', 'Katra, Prayagraj (Uttar Pradesh)', 'George Town, Prayagraj (Uttar Pradesh)', 'Allahpur, Prayagraj (Uttar Pradesh)', 'Chowk, Prayagraj (Uttar Pradesh)', 'Civil Lines, Prayagraj (Uttar Pradesh)', 'Daraganj, Prayagraj (Uttar Pradesh)', 'Jhusi, Prayagraj (Uttar Pradesh)',
  'Civil Lines, Varanasi (Uttar Pradesh)', 'Lanka, Varanasi (Uttar Pradesh)', 'Assi Ghat, Varanasi (Uttar Pradesh)', 'Godowlia, Varanasi (Uttar Pradesh)', 'Sigra, Varanasi (Uttar Pradesh)', 'Rathyatra, Varanasi (Uttar Pradesh)', 'Cantonment, Varanasi (Uttar Pradesh)', 'Durgakund, Varanasi (Uttar Pradesh)', 'Bhelupur, Varanasi (Uttar Pradesh)',
  'Noida Sector 18, Noida (Uttar Pradesh)', 'Noida Sector 62, Noida (Uttar Pradesh)', 'Noida Sector 15, Noida (Uttar Pradesh)', 'Noida Sector 50, Noida (Uttar Pradesh)', 'Noida Sector 63, Noida (Uttar Pradesh)', 'Noida Sector 44, Noida (Uttar Pradesh)', 'Noida Sector 137, Noida (Uttar Pradesh)', 'Greater Noida West, Noida (Uttar Pradesh)', 'Knowledge Park, Greater Noida (Uttar Pradesh)',
  'Indirapuram, Ghaziabad (Uttar Pradesh)', 'Vaishali, Ghaziabad (Uttar Pradesh)', 'Kaushambi, Ghaziabad (Uttar Pradesh)', 'Raj Nagar, Ghaziabad (Uttar Pradesh)', 'Sanjay Nagar, Ghaziabad (Uttar Pradesh)', 'Crossing Republik, Ghaziabad (Uttar Pradesh)',
  'Golghar, Gorakhpur (Uttar Pradesh)', 'Civil Lines, Gorakhpur (Uttar Pradesh)', 'Bank Road, Gorakhpur (Uttar Pradesh)', 'Taramandal, Gorakhpur (Uttar Pradesh)', 'Medical College Road, Gorakhpur (Uttar Pradesh)', 'University Road, Gorakhpur (Uttar Pradesh)',
  'Shastri Nagar, Meerut (Uttar Pradesh)', 'Begum Bridge, Meerut (Uttar Pradesh)', 'Garh Road, Meerut (Uttar Pradesh)', 'Pallavpuram, Meerut (Uttar Pradesh)', 'Saket, Meerut (Uttar Pradesh)', 'Delhi Road, Meerut (Uttar Pradesh)',
  'Civil Lines, Bareilly (Uttar Pradesh)', 'Rajendra Nagar, Bareilly (Uttar Pradesh)', 'Pilibhit Bypass Road, Bareilly (Uttar Pradesh)', 'Shyam Ganj, Bareilly (Uttar Pradesh)', 'Civil Lines, Moradabad (Uttar Pradesh)', 'Delhi Road, Moradabad (Uttar Pradesh)',
  'Aligarh Muslim University Area, Aligarh (Uttar Pradesh)', 'Marris Road, Aligarh (Uttar Pradesh)', 'Mathura Refinery Nagar, Mathura (Uttar Pradesh)', 'Krishna Nagar, Mathura (Uttar Pradesh)', 'Civil Lines, Jhansi (Uttar Pradesh)', 'Elite Crossing, Jhansi (Uttar Pradesh)',
  'Faizabad Road, Ayodhya (Uttar Pradesh)', 'Ram Janmabhoomi Path, Ayodhya (Uttar Pradesh)', 'Shahjahanpur City Centre, Shahjahanpur (Uttar Pradesh)', 'Saharanpur City Centre, Saharanpur (Uttar Pradesh)', 'Muzaffarnagar City Centre, Muzaffarnagar (Uttar Pradesh)', 'Rampur Town, Rampur (Uttar Pradesh)', 'Mirzapur Town, Mirzapur (Uttar Pradesh)', 'Basti Town, Basti (Uttar Pradesh)',

  // --- UTTARAKHAND ---
  'Rajpur Road, Dehradun (Uttarakhand)', 'Clock Tower, Dehradun (Uttarakhand)', 'Clement Town, Dehradun (Uttarakhand)', 'Patel Nagar, Dehradun (Uttarakhand)', 'Ballupur, Dehradun (Uttarakhand)', 'ISBT Road, Dehradun (Uttarakhand)', 'Prem Nagar, Dehradun (Uttarakhand)', 'Sahastradhara Road, Dehradun (Uttarakhand)', 'Haridwar Road, Dehradun (Uttarakhand)', 'Vasant Vihar, Dehradun (Uttarakhand)', 'Dalanwala, Dehradun (Uttarakhand)',
  'Mall Road, Mussoorie (Uttarakhand)', 'Library Chowk, Mussoorie (Uttarakhand)', 'Kulri Bazar, Mussoorie (Uttarakhand)', 'Landour, Mussoorie (Uttarakhand)',
  'Har Ki Pauri, Haridwar (Uttarakhand)', 'Shivalik Nagar, Haridwar (Uttarakhand)', 'Ranipur More, Haridwar (Uttarakhand)', 'Kankhal, Haridwar (Uttarakhand)', 'Jwalapur, Haridwar (Uttarakhand)', 'Upper Road, Haridwar (Uttarakhand)',
  'Rishikesh Main Market, Rishikesh (Uttarakhand)', 'Laxman Jhula, Rishikesh (Uttarakhand)', 'Ram Jhula, Rishikesh (Uttarakhand)', 'Tapasya Nagar, Rishikesh (Uttarakhand)', 'Muni Ki Reti, Rishikesh (Uttarakhand)', 'Swarg Ashram, Rishikesh (Uttarakhand)',
  'Mall Road, Nainital (Uttarakhand)', 'Tallital, Nainital (Uttarakhand)', 'Malli Tal, Nainital (Uttarakhand)', 'Ayarpata, Nainital (Uttarakhand)', 'Sherwood, Nainital (Uttarakhand)',
  'Haldwani City Centre, Haldwani (Uttarakhand)', 'Mukhani, Haldwani (Uttarakhand)', 'Kaladhungi Road, Haldwani (Uttarakhand)', 'Bareilly Road, Haldwani (Uttarakhand)', 'Rampur Road, Haldwani (Uttarakhand)',
  'Almora Main Bazaar, Almora (Uttarakhand)', 'Lala Bazaar, Almora (Uttarakhand)', 'Pithoragarh City Centre, Pithoragarh (Uttarakhand)', 'Ranikhet Bazaar, Almora (Uttarakhand)', 'Kotdwar Town, Pauri Garhwal (Uttarakhand)', 'Roorkee Cantonment, Haridwar (Uttarakhand)', 'IIT Roorkee Campus, Roorkee (Uttarakhand)', 'Tehri Town, New Tehri (Uttarakhand)', 'Uttarkashi Town, Uttarkashi (Uttarakhand)', 'Chamoli Gopeshwar, Chamoli (Uttarakhand)'
];

export default function ScarcitySimulationBadge({
  snapshot,
  productName,
  sampleActivityEnabled = false,
  compact = false,
}) {
  if (!snapshot?.enabled) return null;

  const baseRemaining = snapshot.outOfStock ? 0 : snapshot.remaining;
  const baseSoldToday = Number(snapshot.simulatedSoldToday ?? snapshot.soldToday) || 0;
  const dailyCap = snapshot.dailyCap || 250;

  // Track stock reduction strictly via timeline
  const [activeRemaining, setActiveRemaining] = useState(baseRemaining);
  const [activeSoldToday, setActiveSoldToday] = useState(baseSoldToday);
  const [recentOrderEvent, setRecentOrderEvent] = useState(null);

  const lastSoldRef = useRef(baseSoldToday);
  const hasMountedRef = useRef(false);

  // Sync with snapshot updates without jumping
  useEffect(() => {
    setActiveRemaining(baseRemaining);
    setActiveSoldToday(baseSoldToday);

    // Only trigger order line if mounted and timeline soldToday actually incremented while watching
    if (hasMountedRef.current && baseSoldToday > lastSoldRef.current) {
      const loc = INDIAN_PURCHASE_LOCATIONS[
        Math.floor(Math.random() * INDIAN_PURCHASE_LOCATIONS.length)
      ];
      setRecentOrderEvent({
        location: loc,
        time: 'Just now',
        id: Date.now(),
      });

      const timer = setTimeout(() => {
        setRecentOrderEvent(null);
      }, 7000);
      return () => clearTimeout(timer);
    }

    lastSoldRef.current = baseSoldToday;
    hasMountedRef.current = true;
  }, [baseSoldToday, baseRemaining]);

  // Dynamic live viewers: starts at 77+, refreshes every 45s within 5 to 200 range
  const [viewerCount, setViewerCount] = useState(77);

  const driftStateRef = useRef({
    direction: Math.random() > 0.5 ? 1 : -1,
    ticksRemainingInTrend: 2 + Math.floor(Math.random() * 2), // 2-3 ticks before direction change
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const state = driftStateRef.current;
        state.ticksRemainingInTrend -= 1;

        // When trend expires, reverse direction with new random trend length
        if (state.ticksRemainingInTrend <= 0) {
          state.direction = -state.direction;
          state.ticksRemainingInTrend = 1 + Math.floor(Math.random() * 3); // 1-3 ticks in new direction
        }

        // Varied step between 4 and 16 for natural organic shifts every 45 seconds
        const step = Math.floor(Math.random() * 13) + 4;
        let next = prev + state.direction * step;

        // Keep strictly within 5 to 200 bounds with smooth turnaround
        if (next >= 190) {
          next = 182 - Math.floor(Math.random() * 10);
          state.direction = -1;
          state.ticksRemainingInTrend = 2 + Math.floor(Math.random() * 2);
        } else if (next <= 15) {
          next = 20 + Math.floor(Math.random() * 10);
          state.direction = 1;
          state.ticksRemainingInTrend = 2 + Math.floor(Math.random() * 2);
        }

        return Math.min(200, Math.max(5, next));
      });
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const percentageSold = Math.min(
    100,
    Math.round((activeSoldToday / Math.max(1, dailyCap)) * 100)
  );

  return (
    <section
      aria-label="Total inventory"
      className={`relative overflow-hidden rounded-2xl border border-[#D4AF37]/35 bg-gradient-to-br from-[#071a12]/95 via-[#0b2419]/90 to-[#05140e]/95 text-amber-50 shadow-xl backdrop-blur-md ${
        compact ? 'p-3' : 'p-4 sm:p-5'
      }`}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#D4AF37]/10 blur-2xl" />

      {/* Row 1: Unified Header Bar (Icon + "Total inventory" + "Simulated" Badge) */}
      <div className="flex items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#FCE096]">
            <FlaskConical size={13} aria-hidden="true" />
            {!snapshot.paused && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            )}
          </div>
          <h4 className="text-[11px] font-black uppercase tracking-[0.14em] text-amber-200 truncate">
            Total inventory
          </h4>
        </div>

      </div>

      {/* Row 2: Bolder RED Live Viewing Ribbon (Full Width, Balanced Two-Sided Alignment) */}
      {!snapshot.paused && !snapshot.outOfStock && (
        <div
          data-testid="live-viewers-badge"
          className="mt-2.5 flex items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-rose-950/90 via-rose-900/60 to-rose-950/90 border border-rose-500/50 px-3 py-1.5 shadow-[0_0_12px_rgba(244,63,94,0.25)]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-90" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-600 shadow-[0_0_6px_rgba(244,63,94,0.9)]" />
            </span>
            <Eye size={12} className="text-rose-300 stroke-[2.5] shrink-0" aria-hidden="true" />
            <span className="text-xs font-black tracking-wide text-rose-100 truncate">
              {viewerCount}+ people are viewing
            </span>
          </div>

          <span className="shrink-0 text-[9px] font-medium text-rose-300/80 font-mono">
            refreshes every 45 seconds
          </span>
        </div>
      )}

      {snapshot.paused ? (
        <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-200">
          <Activity size={13} aria-hidden="true" /> Simulation paused
        </p>
      ) : (
        <>
          {/* Row 3: Cohesive Stats Box (Units Remaining + Units Sold Today + Progress Bar) */}
          <div className="mt-2.5 rounded-xl bg-black/35 border border-white/10 p-2.5">
            <div className="flex items-center justify-between gap-2 text-xs font-semibold">
              <div className="text-white truncate">
                <span className="text-slate-300 font-medium">Units remaining: </span>
                <strong className="text-sm font-black text-[#FCE096] transition-all duration-300">
                  {activeRemaining}
                </strong>
                <span className="text-slate-400 font-normal"> / {dailyCap}</span>
              </div>

              <div className="text-right text-slate-300 font-medium shrink-0">
                <span>Units Sold Today: </span>
                <strong className="text-sm font-black text-[#FCE096]">
                  {activeSoldToday}
                </strong>
              </div>
            </div>

            {/* Depletion Progress Bar */}
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/60 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-[#D4AF37] to-amber-400 transition-all duration-700 ease-out shadow-[0_0_6px_rgba(212,175,55,0.4)]"
                  style={{ width: `${percentageSold}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>Pacing: {percentageSold}% claimed today</span>
                <span>Cap: {dailyCap} daily visual max</span>
              </div>
            </div>
          </div>

          {/* TIMELINE-TRIGGERED PURCHASE LINE:
              Only triggered when the 24-hour timeline actually advances and reduces stock! */}
          {recentOrderEvent && (
            <div className="mt-2.5 rounded-xl border border-[#D4AF37]/50 bg-gradient-to-r from-[#0d2a1d] to-[#071a12] p-2.5 text-xs text-amber-100 shadow-md animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#FCE096]">
                  ⚡
                </span>
                <p className="leading-snug">
                  A verified shopper in{' '}
                  <strong className="text-[#FCE096]">{recentOrderEvent.location}</strong> just ordered{' '}
                  <strong className="text-emerald-300">1x unit</strong> of{' '}
                  <span className="italic text-slate-200">{productName || 'this formulation'}</span>
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {snapshot.outOfStock && (
        <p className="mt-2 inline-flex items-center gap-1 rounded-lg bg-rose-950/40 border border-rose-400/30 px-2.5 py-1 text-xs font-bold text-rose-200">
          <AlertCircle size={13} aria-hidden="true" /> Out of stock only
        </p>
      )}

      {/* Row 4: Subtle Mandatory Disclosure Note */}
      <p className="mt-2 text-[10px] leading-relaxed text-amber-50/70">
        Inventory may vary due to occasional order cancellations or internal operational issues.
      </p>

      {sampleActivityEnabled && snapshot.sampleActivity?.length > 0 && (
        <div className="mt-3 border-t border-[#D4AF37]/25 pt-2.5 text-[11px] leading-relaxed text-amber-100/90">
          <p className="flex items-center gap-1 font-bold uppercase tracking-wider text-amber-200 text-[10px]">
            <Sparkles size={11} className="text-[#D4AF37]" />
            Fictional sample shoppers · Not real orders
          </p>
          <ul className="mt-1.5 space-y-1">
            {snapshot.sampleActivity.slice(0, 3).map(activity => (
              <li key={`${activity.buyer}-${activity.time}`} className="flex items-center gap-1.5 text-slate-300">
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                <span>
                  {activity.buyer} · {productName || 'Sample product'} · {activity.city} · {activity.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
