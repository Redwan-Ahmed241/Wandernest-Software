import type { Lang } from './domain/types';

const S = {
  title: { en: 'How much of Bangladesh have you explored?', bn: 'বাংলাদেশের কতটা ঘুরেছেন?' },
  sub: {
    en: 'Tap a district to mark it. Your map stays on this device.',
    bn: 'জেলায় ট্যাপ করে চিহ্নিত করুন। আপনার ম্যাপ শুধু এই ডিভাইসেই থাকে।',
  },
  districts: { en: 'districts', bn: 'জেলা' },
  explored: { en: 'explored', bn: 'ভ্রমণ করা হয়েছে' },
  visited: { en: 'Visited', bn: 'ঘুরেছি' },
  want: { en: 'Want to go', bn: 'যেতে চাই' },
  unvisited: { en: 'Not yet', bn: 'এখনো না' },
  details: { en: 'Details', bn: 'বিস্তারিত' },
  share: { en: 'Share my map', bn: 'ম্যাপ শেয়ার করুন' },
  search: { en: 'Search a district (e.g. Bogra, কুমিল্লা)', bn: 'জেলা খুঁজুন (যেমন Bogra, কুমিল্লা)' },
  division: { en: 'Division', bn: 'বিভাগ' },
  divisions: { en: 'Division progress', bn: 'বিভাগভিত্তিক অগ্রগতি' },
  next: { en: 'next milestone', bn: 'পরবর্তী লক্ষ্য' },
  sharedBanner: { en: 'You are viewing a shared map.', bn: 'আপনি একটি শেয়ার করা ম্যাপ দেখছেন।' },
  saveShared: { en: 'Save as my map', bn: 'আমার ম্যাপ হিসেবে সংরক্ষণ' },
  backMine: { en: 'Back to my map', bn: 'আমার ম্যাপে ফিরুন' },
  replaceWarn: {
    en: 'This replaces your current map. Tap again to confirm.',
    bn: 'এতে আপনার বর্তমান ম্যাপ বদলে যাবে। নিশ্চিত করতে আবার ট্যাপ করুন।',
  },
  zoomIn: { en: 'Zoom in', bn: 'বড় করুন' },
  zoomOut: { en: 'Zoom out', bn: 'ছোট করুন' },
  reset: { en: 'Reset view', bn: 'রিসেট' },
  close: { en: 'Close', bn: 'বন্ধ করুন' },
  overview: { en: 'Overview', bn: 'পরিচিতি' },
  places: { en: 'Places', bn: 'দর্শনীয় স্থান' },
  food: { en: 'Food', bn: 'খাবার' },
  stays: { en: 'Stays', bn: 'থাকার জায়গা' },
  myTrip: { en: 'My trip', bn: 'আমার ভ্রমণ' },
  bestTime: { en: 'Best time to visit', bn: 'ভ্রমণের সেরা সময়' },
  neighbors: { en: 'Nearby districts', bn: 'পাশের জেলা' },
  noContent: {
    en: 'A detailed guide for this district has not been added yet.',
    bn: 'এই জেলার বিস্তারিত গাইড এখনো যুক্ত হয়নি।',
  },
  draft: { en: 'Draft: not yet verified', bn: 'খসড়া: এখনো যাচাই করা হয়নি' },
  lastVerified: { en: 'Last verified', bn: 'সর্বশেষ যাচাই' },
  tripDate: { en: 'Planned date', bn: 'পরিকল্পিত তারিখ' },
  notes: {
    en: 'Notes (plain text, saved on this device)',
    bn: 'নোট (সাধারণ টেক্সট, এই ডিভাইসে সংরক্ষিত)',
  },
  checklist: { en: 'Checklist', bn: 'চেকলিস্ট' },
  addItem: { en: 'Add item', bn: 'যোগ করুন' },
  call: { en: 'Call', bn: 'কল' },
  whatsapp: { en: 'WhatsApp', bn: 'হোয়াটসঅ্যাপ' },
  website: { en: 'Website', bn: 'ওয়েবসাইট' },
  map: { en: 'Map', bn: 'ম্যাপ' },
  source: { en: 'Source', bn: 'উৎস' },
  report: { en: 'Report an error / request removal', bn: 'ভুল জানান / সরানোর অনুরোধ' },
  makingCard: { en: 'Making your card…', bn: 'কার্ড তৈরি হচ্ছে…' },
  story: { en: 'Story 9:16', bn: 'স্টোরি ৯:১৬' },
  post: { en: 'Post 4:5', bn: 'পোস্ট ৪:৫' },
  shareBtn: { en: 'Share', bn: 'শেয়ার' },
  download: { en: 'Download', bn: 'ডাউনলোড' },
  copyLink: { en: 'Copy link', bn: 'লিংক কপি' },
  copied: { en: 'Copied!', bn: 'কপি হয়েছে!' },
  holdSave: { en: 'Tap and hold the image to save it.', bn: 'ছবিতে ট্যাপ করে ধরে রেখে সংরক্ষণ করুন।' },
  backupNote: {
    en: 'Your link is also a backup: open it in any browser to restore your map.',
    bn: 'এই লিংকটি আপনার ব্যাকআপও: যেকোনো ব্রাউজারে খুললে ম্যাপ ফিরে পাবেন।',
  },
  months: {
    en: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',
    bn: 'জানু,ফেব্রু,মার্চ,এপ্রি,মে,জুন,জুলা,আগ,সেপ্টে,অক্টো,নভে,ডিসে',
  },
  navMap: { en: 'My map', bn: 'আমার ম্যাপ' },
  navDirectory: { en: 'Stays & guides', bn: 'থাকা ও গাইড' },
  navGroup: { en: 'Friends & group', bn: 'বন্ধু ও গ্রুপ' },
  navBusiness: { en: 'For businesses', bn: 'ব্যবসার জন্য' },
  kindAll: { en: 'All', bn: 'সব' },
  kindStay: { en: 'Stays', bn: 'থাকার জায়গা' },
  kindGuide: { en: 'Guides', bn: 'গাইড' },
  kindTour: { en: 'Tour operators', bn: 'ট্যুর অপারেটর' },
  allDistricts: { en: 'All districts', bn: 'সব জেলা' },
  dirTitle: { en: 'Stays, guides and tour operators', bn: 'থাকার জায়গা, গাইড ও ট্যুর অপারেটর' },
  dirSearch: { en: 'Search by name or area', bn: 'নাম বা এলাকা দিয়ে খুঁজুন' },
  dirEmpty: {
    en: 'No listings here yet. Know a good place? Tell the business to contact us.',
    bn: 'এখানে এখনো কোনো তালিকা নেই। ভালো কোনো জায়গা চেনেন? ব্যবসাটিকে আমাদের সাথে যোগাযোগ করতে বলুন।',
  },
  dirCount: { en: 'listings', bn: 'টি তালিকা' },
  unverifiedTitle: { en: 'Collected from the internet, not verified', bn: 'ইন্টারনেট থেকে সংগৃহীত, যাচাই করা হয়নি' },
  unverifiedBody: {
    en: 'We gathered these details from public websites and pages. Prices, availability and phone numbers may be wrong or out of date. Always call the number below to get the actual information before you book or pay.',
    bn: 'এই তথ্যগুলো প্রকাশ্য ওয়েবসাইট ও পেজ থেকে সংগ্রহ করা। দাম, খালি থাকা ও ফোন নম্বর ভুল বা পুরোনো হতে পারে। বুকিং বা পেমেন্টের আগে অবশ্যই নিচের নম্বরে ফোন করে আসল তথ্য জেনে নিন।',
  },
  callToConfirm: { en: 'Call to confirm', bn: 'নিশ্চিত হতে ফোন করুন' },
  priceAsListed: { en: 'Price as listed on source', bn: 'উৎসে দেওয়া দাম' },
  collectedOn: { en: 'Collected', bn: 'সংগ্রহের তারিখ' },
  sponsored: { en: 'Sponsored', bn: 'বিজ্ঞাপন' },
  facebook: { en: 'Facebook', bn: 'ফেসবুক' },
  email: { en: 'Email', bn: 'ইমেইল' },
  myBusiness: { en: 'Is this your business? Update or remove', bn: 'এটি কি আপনার ব্যবসা? তথ্য বদলান বা সরান' },
  grpTitle: { en: 'Compare with friends', bn: 'বন্ধুদের সাথে তুলনা করুন' },
  grpSub: {
    en: "Paste your friends' map links to see how much of Bangladesh your group has covered together.",
    bn: 'বন্ধুদের ম্যাপ লিংক পেস্ট করুন, দেখুন আপনারা মিলে বাংলাদেশের কতটা ঘুরেছেন।',
  },
  grpName: { en: 'Name', bn: 'নাম' },
  grpLink: { en: 'Map link', bn: 'ম্যাপ লিংক' },
  grpAdd: { en: 'Add friend', bn: 'বন্ধু যোগ করুন' },
  grpBadLink: { en: 'That does not look like a WanderNest map link.', bn: 'এটি ওয়ান্ডারনেস্ট ম্যাপ লিংক মনে হচ্ছে না।' },
  grpTogether: { en: 'covered together', bn: 'একসাথে ঘোরা' },
  grpEveryone: { en: 'Everyone has been', bn: 'সবাই গিয়েছেন' },
  grpNobody: { en: 'Nobody has been yet: plan a group trip!', bn: 'কেউ এখনো যাননি: গ্রুপ ট্রিপ প্ল্যান করুন!' },
  grpShare: { en: 'Copy group link', bn: 'গ্রুপ লিংক কপি' },
  grpLegendAll: { en: 'Everyone', bn: 'সবাই' },
  grpLegendSome: { en: 'Some of us', bn: 'কয়েকজন' },
  grpLegendNone: { en: 'Nobody yet', bn: 'কেউ না' },
  grpYourName: { en: 'Your name (shown to friends in the group link)', bn: 'আপনার নাম (গ্রুপ লিংকে বন্ধুরা দেখবে)' },
  grpMe: { en: 'Me', bn: 'আমি' },
  grpRemove: { en: 'Remove', bn: 'সরান' },
  grpMax: { en: 'Up to 8 friends.', bn: 'সর্বোচ্চ ৮ জন বন্ধু।' },
  bizTitle: { en: 'List your resort, cottage or tour', bn: 'আপনার রিসোর্ট, কটেজ বা ট্যুর তালিকাভুক্ত করুন' },
  bizSub: {
    en: 'Travellers use WanderNest BD to plan trips district by district. Make sure they find the right information about you.',
    bn: 'ভ্রমণকারীরা জেলা ধরে ট্রিপ সাজাতে ওয়ান্ডারনেস্ট বিডি ব্যবহার করেন। আপনার সম্পর্কে সঠিক তথ্য যেন তাঁরা পান।',
  },
  bizFreeTitle: { en: 'Basic listing: free', bn: 'সাধারণ তালিকা: বিনামূল্যে' },
  bizFreeBody: {
    en: 'Correct your name, phone, WhatsApp, Facebook page and prices, or ask us to remove your listing.',
    bn: 'নাম, ফোন, হোয়াটসঅ্যাপ, ফেসবুক পেজ ও দাম ঠিক করুন, অথবা তালিকা সরাতে বলুন।',
  },
  bizFeatTitle: { en: 'Featured listing', bn: 'ফিচার্ড তালিকা' },
  bizFeatBody: {
    en: 'Appear at the top of your district and in the directory, clearly marked "Sponsored". Ask us for current rates.',
    bn: 'আপনার জেলায় ও ডিরেক্টরিতে সবার উপরে দেখান, স্পষ্টভাবে "বিজ্ঞাপন" চিহ্নসহ। বর্তমান রেটের জন্য যোগাযোগ করুন।',
  },
  bizContact: { en: 'Contact us', bn: 'যোগাযোগ করুন' },
  bizNoContact: { en: 'Contact details coming soon.', bn: 'যোগাযোগের তথ্য শিগগিরই যোগ হবে।' },
  bizPolicy: {
    en: 'We never accept payment to change reviews or hide problems, and we do not take bookings or payments for you.',
    bn: 'রিভিউ বদলাতে বা সমস্যা লুকাতে আমরা কখনো টাকা নিই না, এবং আপনার হয়ে বুকিং বা পেমেন্টও নিই না।',
  },
  badgesTitle: { en: 'Badges', bn: 'ব্যাজ' },
  badgeEarned: { en: 'Unlocked!', bn: 'অর্জিত!' },
  badgeNeed: { en: 'still need', bn: 'বাকি' },
  badgeNew: { en: 'New badge', bn: 'নতুন ব্যাজ' },
  wantNudge: {
    en: 'Planning {d}? See {n} stays & tour contacts',
    bn: '{d} যেতে চান? থাকা ও ট্যুরের {n}টি যোগাযোগ দেখুন',
  },
  disclaimerTitle: { en: 'Independent directory', bn: 'স্বাধীন ডিরেক্টরি' },
  disclaimer: {
    en: 'WanderNest BD is an independent information directory with no commercial affiliation to the places listed. Details such as prices, opening status and contacts are compiled from public sources, may change without notice and may be out of date; always confirm directly with the provider. We do not take bookings or payments and do not guarantee any service or transaction. Names and logos belong to their owners and are used for identification only.',
    bn: 'ওয়ান্ডারনেস্ট বিডি একটি স্বাধীন তথ্য-ডিরেক্টরি; তালিকাভুক্ত স্থান বা প্রতিষ্ঠানের সঙ্গে আমাদের কোনো বাণিজ্যিক সম্পর্ক নেই। মূল্য, খোলা/বন্ধের অবস্থা ও যোগাযোগসহ তথ্য প্রকাশ্য উৎস থেকে সংকলিত, পূর্ব-ঘোষণা ছাড়া বদলাতে পারে এবং পুরোনো হতে পারে; তাই সংশ্লিষ্ট সেবাদাতার সঙ্গে সরাসরি নিশ্চিত হয়ে নিন। আমরা বুকিং বা পেমেন্ট নিই না এবং কোনো সেবা বা লেনদেনের নিশ্চয়তা দিই না। নাম ও লোগো সংশ্লিষ্ট মালিকের, শুধু শনাক্তকরণের জন্য ব্যবহৃত।',
  },
  footer: {
    en: 'Boundaries: Bangladesh Bureau of Statistics / OCHA via geoBoundaries (CC BY 3.0 IGO). Map is illustrative only.',
    bn: 'সীমানা: বাংলাদেশ পরিসংখ্যান ব্যুরো / OCHA, geoBoundaries-এর মাধ্যমে (CC BY 3.0 IGO)। মানচিত্র শুধু চিত্রণের জন্য।',
  },
} as const;

export type StringKey = keyof typeof S;

export function t(lang: Lang, key: StringKey): string {
  return S[key][lang];
}

export function monthName(lang: Lang, m: number): string {
  return S.months[lang].split(',')[m - 1] ?? '';
}

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
export function num(lang: Lang, n: number | string): string {
  const s = String(n);
  return lang === 'bn' ? s.replace(/\d/g, (d) => BN_DIGITS[Number(d)]) : s;
}
