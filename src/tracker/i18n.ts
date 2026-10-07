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
