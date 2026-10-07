// Editorial content for district pages. SOURCE OF TRUTH: edit here, then run
//   node scripts/tracker/build-details.mjs
//
// Every record below is status "draft": written from general knowledge and NOT yet
// checked against sources. Before launch a human must verify each record, add
// `sourceUrl` + `lastVerified`, and flip status to "verified".
//
// `stays` (resorts / hotels) is intentionally absent everywhere: add it only from
// sources you may legally use (the operator's own listing, permission, official data),
// with source + lastVerified. Never copy prices/phones/photos from third-party sites.

const D = (id, summary_en, summary_bn, months, note_en, attractions, food) => ({
  id,
  status: 'draft',
  summary: { en: summary_en, bn: summary_bn },
  bestSeason: { months, note_en },
  attractions: attractions.map(([en, bn, category]) => ({ name: { en, bn }, category })),
  food: food.map(([en, bn, note]) => ({ name: { en, bn }, ...(note ? { note } : {}) })),
});

export const CONTENT = [
  D(
    'coxs-bazar',
    "Home to one of the world's longest natural sea beaches, with surf, sunsets, hill-and-sea drives and gateways to St. Martin's Island.",
    'বিশ্বের অন্যতম দীর্ঘ প্রাকৃতিক সমুদ্রসৈকতের জেলা; সূর্যাস্ত, ঢেউ আর পাহাড়-সাগরের পথ।',
    [11, 12, 1, 2, 3],
    'Dry, cooler season. Monsoon (Jun–Sep) brings rough seas.',
    [
      ["Cox's Bazar Sea Beach", 'কক্সবাজার সমুদ্রসৈকত', 'nature'],
      ['Inani Beach', 'ইনানী সৈকত', 'nature'],
      ['Himchari National Park', 'হিমছড়ি জাতীয় উদ্যান', 'nature'],
    ],
    [['Fresh seafood', 'তাজা সামুদ্রিক মাছ', 'Grilled and fried fish, prawns and crab are popular.'], ['Dried fish (shutki)', 'শুঁটকি']],
  ),
  D(
    'bandarban',
    'Bangladesh\'s hill district: mountain trails, lakes, waterfalls and indigenous communities.',
    'বাংলাদেশের পাহাড়ি জেলা: পাহাড়ি পথ, হ্রদ, ঝরনা ও আদিবাসী সংস্কৃতি।',
    [10, 11, 12, 1, 2, 3],
    'Waterfalls are fullest in the rainy season, but trails are harder then.',
    [
      ['Nilgiri', 'নীলগিরি', 'nature'],
      ['Boga Lake', 'বগা লেক', 'nature'],
      ['Nafakhum Waterfall', 'নাফাখুম ঝরনা', 'nature'],
    ],
    [['Bamboo-cooked chicken', 'বাঁশের চোঙায় রান্না মুরগি']],
  ),
  D(
    'rangamati',
    'A lake-and-hills district around Kaptai Lake, with boat rides, tribal culture and the Sajek Valley viewpoints.',
    'কাপ্তাই হ্রদ ঘিরে লেক ও পাহাড়ের জেলা; নৌভ্রমণ, উপজাতীয় সংস্কৃতি ও সাজেক উপত্যকা।',
    [10, 11, 12, 1, 2, 3],
    'Clear winter skies are best for views; monsoon mist is beautiful but roads can be difficult.',
    [
      ['Kaptai Lake', 'কাপ্তাই হ্রদ', 'nature'],
      ['Hanging Bridge (Jhulonto Bridge)', 'ঝুলন্ত সেতু', 'landmark'],
      ['Sajek Valley', 'সাজেক উপত্যকা', 'nature'],
    ],
    [['Hill-style bamboo dishes', 'পাহাড়ি বাঁশ-রান্না']],
  ),
  D(
    'sylhet',
    'Tea hills, river rapids and a major Sufi shrine; gateway to the north-east.',
    'চা-বাগান, নদী-ঝরনা আর বিখ্যাত মাজারের শহর; উত্তর-পূর্বের প্রবেশদ্বার।',
    [10, 11, 12, 1, 2, 3],
    'Ratargul is best in the rainy season when the forest floods.',
    [
      ['Ratargul Swamp Forest', 'রাতারগুল জলাবন', 'nature'],
      ['Jaflong', 'জাফলং', 'nature'],
      ['Shrine of Hazrat Shah Jalal', 'হযরত শাহজালালের মাজার', 'heritage'],
    ],
    [['Shatkora beef curry', 'শাতকরা দিয়ে গরুর মাংস', 'Cooked with the local citrus fruit shatkora.']],
  ),
  D(
    'moulvibazar',
    'The tea capital of Bangladesh, with rolling tea estates and rainforest around Sreemangal.',
    'বাংলাদেশের চায়ের রাজধানী; শ্রীমঙ্গলের চা-বাগান ও বনভূমি।',
    [10, 11, 12, 1, 2, 3],
    'Cool and dry; tea gardens are green after the monsoon.',
    [
      ['Tea gardens of Sreemangal', 'শ্রীমঙ্গলের চা-বাগান', 'nature'],
      ['Lawachara National Park', 'লাউয়াছড়া জাতীয় উদ্যান', 'nature'],
      ['Madhabkunda Waterfall', 'মাধবকুণ্ড জলপ্রপাত', 'nature'],
    ],
    [['Seven-layer tea', 'সাত রঙের চা'], ['Pineapple', 'আনারস']],
  ),
  D(
    'sunamganj',
    'A haor (wetland) district of vast seasonal lakes, bird life and boat journeys.',
    'হাওরের জেলা: বিস্তীর্ণ জলরাশি, পাখি ও নৌকাভ্রমণ।',
    [7, 8, 9, 10, 12, 1],
    'Monsoon for boat trips over the flooded haor; winter for migratory birds.',
    [
      ['Tanguar Haor', 'টাঙ্গুয়ার হাওর', 'nature'],
      ['Niladri Lake', 'নীলাদ্রি লেক', 'nature'],
      ['Jadukata River', 'যাদুকাটা নদী', 'nature'],
    ],
    [['Fresh haor fish', 'হাওরের তাজা মাছ']],
  ),
  D(
    'khulna',
    'Gateway to the Sundarbans, the world\'s largest mangrove forest, reached by boat from Khulna.',
    'বিশ্বের বৃহত্তম ম্যানগ্রোভ বন সুন্দরবনের প্রবেশদ্বার।',
    [11, 12, 1, 2, 3],
    'Winter is the most comfortable for boat tours; permits and guides are required.',
    [
      ['Sundarbans (Khulna range)', 'সুন্দরবন (খুলনা রেঞ্জ)', 'nature'],
    ],
    [['Chui jhal', 'চুইঝাল', 'A spicy dish made with chui (Piper chaba) vine, a Khulna specialty.'], ['Sundarbans honey', 'সুন্দরবনের মধু']],
  ),
  D(
    'bagerhat',
    'Home to the historic Sixty Dome Mosque (a UNESCO World Heritage Site) and a part of the Sundarbans.',
    'ইউনেস্কো বিশ্ব ঐতিহ্য ষাট গম্বুজ মসজিদ ও সুন্দরবনের অংশের জেলা।',
    [11, 12, 1, 2],
    'Cool dry weather is best for visiting heritage sites and boat trips.',
    [
      ['Sixty Dome Mosque', 'ষাট গম্বুজ মসজিদ', 'heritage'],
      ['Tomb of Khan Jahan Ali', 'খান জাহান আলীর মাজার', 'heritage'],
      ['Sundarbans (Mongla side)', 'সুন্দরবন (মোংলা)', 'nature'],
    ],
    [['Fresh river fish', 'নদীর তাজা মাছ']],
  ),
  D(
    'dhaka',
    'The capital: Mughal-era landmarks, modern architecture and the street food of Old Dhaka.',
    'রাজধানী: মুঘল আমলের স্থাপনা, আধুনিক স্থাপত্য আর পুরান ঢাকার খাবার।',
    [11, 12, 1, 2],
    'Cooler months are far more comfortable for walking tours.',
    [
      ['Lalbagh Fort', 'লালবাগ কেল্লা', 'heritage'],
      ['Ahsan Manzil', 'আহসান মঞ্জিল', 'heritage'],
      ['National Parliament House', 'জাতীয় সংসদ ভবন', 'landmark'],
    ],
    [['Old Dhaka biryani', 'পুরান ঢাকার বিরিয়ানি'], ['Bakarkhani', 'বাখরখানি']],
  ),
  D(
    'bogura',
    'Site of Mahasthangarh, among the earliest known urban archaeological sites in Bangladesh.',
    'বাংলাদেশের প্রাচীনতম নগর-প্রত্নস্থলগুলোর অন্যতম মহাস্থানগড়ের জেলা।',
    [11, 12, 1, 2, 3],
    'Dry, cool season is best for outdoor archaeological sites.',
    [
      ['Mahasthangarh', 'মহাস্থানগড়', 'heritage'],
      ['Behula-Lakhindar Basar Ghar', 'বেহুলার বাসরঘর', 'heritage'],
    ],
    [['Bogurar doi (sweet curd)', 'বগুড়ার দই']],
  ),
  D(
    'natore',
    'Known for the Natore Rajbari palace complex and the beels (wetlands) of the Chalan region.',
    'নাটোর রাজবাড়ী ও চলনবিলের জেলা।',
    [11, 12, 1, 2],
    'Cool season for palace visits; beels are fullest after the monsoon.',
    [['Natore Rajbari (Uttara Ganabhaban)', 'নাটোর রাজবাড়ী (উত্তরা গণভবন)', 'heritage']],
    [['Kachagolla', 'কাঁচাগোল্লা', 'A famous Natore sweet.']],
  ),
  D(
    'rajshahi',
    'A heritage-rich city on the Padma, known for temples, museums and mangoes.',
    'পদ্মা-তীরের ঐতিহ্যবাহী শহর; মন্দির, জাদুঘর ও আমের জন্য বিখ্যাত।',
    [11, 12, 1, 2],
    'Winter is pleasant; mango season is roughly Jun–Aug.',
    [
      ['Puthia Temple Complex', 'পুঠিয়া মন্দির কমপ্লেক্স', 'heritage'],
      ['Varendra Research Museum', 'বরেন্দ্র গবেষণা জাদুঘর', 'heritage'],
    ],
    [['Rajshahi mango', 'রাজশাহীর আম', 'Seasonal, typically in summer.']],
  ),
  D(
    'cumilla',
    'Buddhist-era ruins at Mainamati and a famous sweet shop tradition.',
    'ময়নামতির বৌদ্ধ যুগের প্রত্নস্থল ও বিখ্যাত মিষ্টির জেলা।',
    [11, 12, 1, 2, 3],
    'Dry, cooler months are best for the archaeological sites.',
    [
      ['Mainamati ruins (Shalban Vihara)', 'ময়নামতি (শালবন বিহার)', 'heritage'],
      ['Kotila Mura', 'কোটিলা মুড়া', 'heritage'],
    ],
    [['Rasmalai', 'রসমালাই', 'A well-known Cumilla sweet.']],
  ),
  D(
    'chattogram',
    "The port city between hills and sea: lakes, a city beach and WWII memorials.",
    'পাহাড় ও সাগরের মাঝের বন্দরনগরী: লেক, সমুদ্রসৈকত ও যুদ্ধ-স্মৃতিস্তম্ভ।',
    [11, 12, 1, 2, 3],
    'Cool dry months are best.',
    [
      ["Foy's Lake", 'ফয়’স লেক', 'nature'],
      ['Patenga Sea Beach', 'পতেঙ্গা সমুদ্রসৈকত', 'nature'],
      ['Chattogram War Cemetery', 'চট্টগ্রাম ওয়ার সিমেট্রি', 'heritage'],
    ],
    [['Mezban beef', 'মেজবানের গরুর মাংস', 'A traditional feast dish of Chattogram.']],
  ),
  D(
    'patuakhali',
    'Home to Kuakata, a rare beach where you can watch both sunrise and sunset over the sea.',
    'কুয়াকাটা সৈকতের জেলা, যেখান থেকে সমুদ্রের ওপর সূর্যোদয় ও সূর্যাস্ত দুটোই দেখা যায়।',
    [11, 12, 1, 2, 3],
    'Winter is calmer and drier.',
    [
      ['Kuakata Sea Beach', 'কুয়াকাটা সমুদ্রসৈকত', 'nature'],
      ['Gangamati Mangrove Forest', 'গঙ্গামতি ম্যানগ্রোভ বন', 'nature'],
    ],
    [['Fresh sea and river fish', 'সামুদ্রিক ও নদীর তাজা মাছ']],
  ),
  D(
    'gazipur',
    "A green belt north of Dhaka with national parks, a safari park and many weekend resorts.",
    'ঢাকার উত্তরে সবুজ বলয়: জাতীয় উদ্যান, সাফারি পার্ক ও উইকেন্ড রিসোর্ট।',
    [10, 11, 12, 1, 2, 3],
    'Cooler months suit outdoor park visits.',
    [
      ['Bhawal National Park', 'ভাওয়াল জাতীয় উদ্যান', 'nature'],
      ['Bangabandhu Sheikh Mujib Safari Park', 'বঙ্গবন্ধু শেখ মুজিব সাফারি পার্ক', 'nature'],
    ],
    [],
  ),
];
