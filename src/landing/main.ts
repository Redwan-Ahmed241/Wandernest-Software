import './landing.css';
import { initExplore } from './explore';

type Lang = 'en' | 'bn';
// Shared with the tracker so the chosen language carries over.
const KEY = 'wn.tracker.v1';

const BN: Record<string, string> = {
  navTracker: '৬৪ জেলার ম্যাপ',
  navTodo: 'কী করবেন',
  navAll: 'সব জেলা',
  navAbout: 'আমাদের কথা',
  kicker: '৬৪ জেলা · ৮ বিভাগ',
  heroTitle: 'বাংলাদেশের কতটা ঘুরেছেন?',
  heroLead: 'যেসব জেলায় গেছেন সেগুলোতে ট্যাপ করুন, স্কোর দেখুন, আর ম্যাপটি শেয়ার করুন। বিনামূল্যে, সাইন-আপ ছাড়াই, আপনার ডিভাইসেই সংরক্ষিত।',
  heroCta: 'আমার ম্যাপ শুরু করুন →',
  heroSecondary: 'অনুপ্রেরণা নিন',
  heroCredit: 'রাতারগুল জলাবন, সিলেট',
  exploreTitle: 'এরপর কোথায় যাবেন?',
  c1Title: 'শ্রীমঙ্গলের চা-বাগান',
  c1Sub: 'মৌলভীবাজার · সিলেট বিভাগ',
  c2Title: 'সুন্দরবন',
  c2Sub: 'খুলনা · খুলনা বিভাগ',
  c3Title: 'সেন্টমার্টিন দ্বীপ',
  c3Sub: 'কক্সবাজার · চট্টগ্রাম বিভাগ',
  c4Title: 'বান্দরবানের পাহাড়',
  c4Sub: 'বান্দরবান · চট্টগ্রাম বিভাগ',
  aboutTitle: 'ওয়ান্ডারনেস্ট বিডি সম্পর্কে',
  aboutBody: 'ওয়ান্ডারনেস্ট বিডি বাংলাদেশের একটি স্বাধীন ভ্রমণ-গাইড। আমরা বুকিং বা পেমেন্ট নিই না; আপনার ম্যাপ আপনার নিজের ডিভাইসেই থাকে।',
  footer: '© ওয়ান্ডারনেস্ট বিডি · স্বাধীন ভ্রমণ-ডিরেক্টরি',
  monthTitle: 'ভ্রমণের সেরা সময়:',
  monthSub: 'এখন যেসব জেলার মৌসুম চলছে। স্থান, খাবার ও থাকার জায়গা দেখতে ট্যাপ করুন।',
  todoTitle: 'বাংলাদেশ জুড়ে কী করবেন',
  allTitle: '৬৪ জেলা',
  featTitle: 'শুধু ম্যাপ নয়',
  f1Title: 'ব্যাজ অর্জন করুন',
  f1Sub: 'পার্বত্য চট্টগ্রাম বিজয়ী, চা-বাগানের পথিক, ম্যানগ্রোভ অভিযাত্রীসহ আরও ১২টি।',
  f2Title: 'বন্ধুদের সাথে তুলনা',
  f2Sub: 'দেখুন আপনার গ্রুপ মিলে বাংলাদেশের কতটা ঘুরেছে।',
  f3Title: 'থাকা ও ট্যুরের যোগাযোগ',
  f3Sub: 'হোটেল, রিসোর্ট ও ট্যুর অপারেটরের সরাসরি ফোন নম্বর।',
  markOnMap: 'আমার ম্যাপে চিহ্নিত করুন',
  draftNote: 'ভ্রমণ তথ্য খসড়া, ভুল থাকতে পারে। যাওয়ার আগে স্থানীয়ভাবে নিশ্চিত হয়ে নিন।',
};

const nodes = [...document.querySelectorAll<HTMLElement>('[data-i18n]')];
const EN = new Map(nodes.map((n) => [n, n.textContent ?? '']));

function readLang(): Lang {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return s?.lang === 'bn' ? 'bn' : 'en';
  } catch {
    return 'en';
  }
}

function saveLang(lang: Lang) {
  try {
    const raw = localStorage.getItem(KEY);
    const s = raw ? JSON.parse(raw) : { v: 1, visited: [], want: [], trips: {} };
    localStorage.setItem(KEY, JSON.stringify({ ...s, lang }));
  } catch {
    /* storage blocked: language just won't persist */
  }
}

function apply(lang: Lang) {
  document.documentElement.lang = lang;
  for (const n of nodes) n.textContent = lang === 'bn' ? (BN[n.dataset.i18n!] ?? EN.get(n)!) : EN.get(n)!;
  for (const b of document.querySelectorAll<HTMLButtonElement>('[data-lang]')) {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  }
}

for (const b of document.querySelectorAll<HTMLButtonElement>('[data-lang]')) {
  b.addEventListener('click', () => {
    const lang = b.dataset.lang === 'bn' ? 'bn' : 'en';
    saveLang(lang);
    applyAll(lang);
  });
}

let current: Lang = readLang();
const renderExplore = initExplore(() => current);
const applyAll = (lang: Lang) => {
  current = lang;
  apply(lang);
  renderExplore();
};
applyAll(current);
