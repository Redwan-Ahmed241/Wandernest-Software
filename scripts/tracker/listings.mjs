// Directory data: stays, guides and tour operators. Edit here, then run
//   node scripts/tracker/build-listings.mjs
//
// RULES
// - Only businesses (no private individuals' personal numbers).
// - Copy contact details exactly from the business's own website or an official
//   listing; put that page in sourceUrl and the date you read it in collectedOn.
// - Write `about` in our own words. Never copy descriptions, photos or reviews.
// - `featured: true` only for paying businesses; the UI labels it "Sponsored".
// - Remove a listing promptly if the business asks.

const COLLECTED = '2026-10-07';

// Bangladesh Parjatan Corporation (government) properties, from hotels.gov.bd.
const parjatan = (id, district, name, area, phone) => ({
  id: `parjatan-${id}`,
  kind: 'stay',
  district,
  name,
  area,
  about: {
    en: 'Government-run hotel/motel of Bangladesh Parjatan Corporation; online booking on hotels.gov.bd.',
    bn: 'বাংলাদেশ পর্যটন করপোরেশনের সরকারি হোটেল/মোটেল; hotels.gov.bd-তে অনলাইন বুকিং।',
  },
  contact: { phone, website: `https://hotels.gov.bd/frontend/hotel/${id}` },
  sourceUrl: `https://hotels.gov.bd/frontend/hotel/${id}`,
  collectedOn: COLLECTED,
});

export const LISTINGS = [
  parjatan('1-hotel-abakash', 'dhaka', 'Parjatan Hotel Abakash', 'Mohakhali, Dhaka', '+88 02 41024218'),
  parjatan('2-parjatan-motel-dinajpur', 'dinajpur', 'Parjatan Motel Dinajpur', 'Dinajpur', '01775-883355'),
  parjatan('3-parjatan-motel-bogura', 'bogura', 'Parjatan Motel Bogura', 'Bogura', '01798-462890'),
  parjatan('4-parjatan-motel-rajshahi', 'rajshahi', 'Parjatan Motel Rajshahi', 'Abdul Mojid Road, Rajshahi', '0721775237'),
  parjatan('5-hotel-ne-taung', 'coxs-bazar', 'Parjatan Hotel Ne-Taung', 'Teknaf', '01568671630'),
  parjatan('6-hotel-shaibal', 'coxs-bazar', 'Parjatan Hotel Shaibal', "Motel Road, Cox's Bazar", '01991139020'),
  parjatan('7-motel-rangpur', 'rangpur', 'Parjatan Motel Rangpur', 'R. K. Road, Rangpur', '01991139666'),
  parjatan('8-motel-benapole', 'jashore', 'Parjatan Motel Benapole', 'Benapole, Sharsha', '01991139032'),
  parjatan('9-hotel-pashur', 'bagerhat', 'Parjatan Hotel Pashur', 'Mongla Port Area, Mongla', '01773044470'),
  parjatan('10-hotel-shaikat', 'chattogram', 'Parjatan Hotel Shaikat', 'Station Road, Chattogram', '01991139143'),
  parjatan('11-motel-labonee', 'coxs-bazar', 'Parjatan Motel Labonee', "Motel Road, Cox's Bazar", '01312884420'),
  parjatan('12-kuakata-holiday-homes-youth-inn', 'patuakhali', 'Parjatan Holiday Homes & Youth Inn', 'Kuakata', '01732091599'),
  parjatan('13-motel-bandarban', 'bandarban', 'Parjatan Motel Bandarban', 'Meghla, Bandarban', '01991139548'),
  parjatan('14-motel-sylhet', 'sylhet', 'Parjatan Motel Sylhet', 'Airport Road, Borosola, Sylhet', '01795594790'),
  parjatan('15-holiday-complex-rangamati', 'rangamati', 'Parjatan Holiday Complex Rangamati', 'Rangamati', '01863231185'),
  parjatan('16-hotel-modhumoti', 'gopalganj', 'Parjatan Hotel Modhumoti', 'Tungipara', '01991139031'),
  parjatan('17-motel-sonamosjid', 'chapainawabganj', 'Parjatan Motel Sonamosjid', 'Sonamosjid, Shibganj', '01991139888'),
  parjatan('18-motel-khagrachari', 'khagrachhari', 'Parjatan Motel Khagrachari', 'Khagrachhari', '01737-444961'),
  parjatan('19-motel-upal', 'coxs-bazar', 'Parjatan Motel Upal', "Motel Road, Cox's Bazar", '01991139022'),
  parjatan('20-motel-jaflong', 'sylhet', 'Parjatan Motel Jaflong', 'Guccha Gram, Jaflong', '+8801991139029'),
  parjatan('48-ahdorshonagar-parjatan-kendro', 'netrokona', 'Adarsha Nagar Parjatan Kendro', 'Mohanganj', '01712950780'),
  parjatan('49-salna-parjatan-resort-picnic-spot', 'gazipur', 'Salna Parjatan Resort & Picnic Spot', 'Salna, Gazipur', '01991139815'),
  parjatan('54-parjatan-motel-youth-inn-bagerhat', 'bagerhat', 'Parjatan Motel & Youth Inn Bagerhat', 'Ronobijoypur, Bagerhat', '+8801991139827'),
  parjatan('55-motel-probal', 'coxs-bazar', 'Parjatan Hotel Probal', "Motel Road, Cox's Bazar", '01991139022'),

  // Private businesses: numbers copied from each business's own website.
  {
    id: 'grand-sultan-tea-resort',
    kind: 'stay',
    district: 'moulvibazar',
    name: 'Grand Sultan Tea Resort & Golf',
    area: 'Sreemangal',
    about: {
      en: 'Large luxury resort among the tea gardens of Sreemangal.',
      bn: 'শ্রীমঙ্গলের চা-বাগানের মাঝে বড় বিলাসবহুল রিসোর্ট।',
    },
    contact: {
      phone: '+880 9678 785959',
      whatsapp: '+8801730793555',
      website: 'https://www.grandsultanresort.com/',
      facebook: 'https://www.facebook.com/Grandsultanresort',
      email: 'reservations@grandsultanresort.com',
    },
    sourceUrl: 'https://www.grandsultanresort.com/',
    collectedOn: COLLECTED,
  },
  {
    id: 'sayeman-beach-resort',
    kind: 'stay',
    district: 'coxs-bazar',
    name: 'Sayeman Beach Resort',
    area: "Marine Drive Road, Kolatoli, Cox's Bazar",
    about: {
      en: "Beachfront resort on Marine Drive in Cox's Bazar.",
      bn: 'কক্সবাজারের মেরিন ড্রাইভে সৈকতঘেঁষা রিসোর্ট।',
    },
    contact: {
      phone: '+88 01401 777 888',
      website: 'https://www.sayemanresort.com/',
      facebook: 'https://www.facebook.com/SayemanBeachResort',
    },
    sourceUrl: 'https://www.sayemanresort.com/',
    collectedOn: COLLECTED,
  },
  {
    id: 'nazimgarh-sylhet-city',
    kind: 'stay',
    district: 'sylhet',
    name: 'Nazimgarh Resorts, Sylhet City',
    area: 'Sylhet',
    about: {
      en: 'Resort on landscaped grounds on the edge of Sylhet city.',
      bn: 'সিলেট শহরের প্রান্তে সাজানো বাগানঘেরা রিসোর্ট।',
    },
    contact: {
      phone: '+8801747200100',
      website: 'https://www.nazimgarh.com/',
    },
    sourceUrl: 'https://www.nazimgarh.com/',
    collectedOn: COLLECTED,
  },
  {
    id: 'nazimgarh-lalakhal',
    kind: 'stay',
    district: 'sylhet',
    name: 'Nazimgarh Resorts, Lalakhal',
    area: 'Lalakhal, Jaintiapur',
    about: {
      en: 'Riverside resort near the blue-green water of Lalakhal.',
      bn: 'লালাখালের নীল-সবুজ পানির কাছে নদীতীরের রিসোর্ট।',
    },
    contact: {
      phone: '+8801841001200',
      website: 'https://www.nazimgarh.com/',
    },
    sourceUrl: 'https://www.nazimgarh.com/',
    collectedOn: COLLECTED,
  },
  {
    id: 'bengal-tours',
    kind: 'tour',
    district: 'dhaka',
    name: 'Bengal Tours Ltd.',
    area: 'Banani, Dhaka',
    about: {
      en: 'Dhaka-based tour operator offering tours across Bangladesh.',
      bn: 'ঢাকাভিত্তিক ট্যুর অপারেটর; সারা বাংলাদেশে ট্যুর পরিচালনা করে।',
    },
    contact: {
      phone: '+8801775105351',
      website: 'https://www.bengaltours.com/',
      facebook: 'https://www.facebook.com/bengaltoursltd',
      email: 'info@bengaltours.com',
    },
    sourceUrl: 'https://www.bengaltours.com/',
    collectedOn: COLLECTED,
  },
];
