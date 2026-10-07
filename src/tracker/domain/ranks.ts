import type { Bilingual } from './types';

const RANKS: Array<{ min: number; label: Bilingual }> = [
  { min: 0, label: { en: 'Fresh Wanderer', bn: 'নতুন পর্যটক' } },
  { min: 6, label: { en: 'Weekend Explorer', bn: 'সপ্তাহান্তের অভিযাত্রী' } },
  { min: 16, label: { en: 'Seasoned Traveler', bn: 'অভিজ্ঞ ভ্রমণকারী' } },
  { min: 31, label: { en: 'Trailblazer', bn: 'পথপ্রদর্শক' } },
  { min: 48, label: { en: 'Master Explorer', bn: 'মাস্টার এক্সপ্লোরার' } },
  { min: 64, label: { en: 'Sonar Bangla Complete', bn: 'সোনার বাংলা সম্পূর্ণ' } },
];

export function rankFor(count: number): Bilingual {
  let r = RANKS[0];
  for (const x of RANKS) if (count >= x.min) r = x;
  return r.label;
}

/** Next milestone above `count`, or null when complete. */
export function nextMilestone(count: number): number | null {
  const n = RANKS.find((r) => r.min > count);
  return n ? n.min : null;
}
