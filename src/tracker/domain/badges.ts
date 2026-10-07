import type { Bilingual, DistrictIndex } from './types';

export interface Badge {
  id: string;
  icon: string;
  label: Bilingual;
  /** Every one of these districts must be visited. */
  districts: string[];
}

const THEMED: Badge[] = [
  {
    id: 'hill-tracts',
    icon: '⛰️',
    label: { en: 'Hill Tracts Conqueror', bn: 'পার্বত্য চট্টগ্রাম বিজয়ী' },
    districts: ['rangamati', 'khagrachhari', 'bandarban'],
  },
  {
    id: 'two-seas',
    icon: '🌊',
    label: { en: 'Coastal Wanderer', bn: 'উপকূলের পথিক' },
    districts: ['coxs-bazar', 'patuakhali'],
  },
  {
    id: 'tea-trail',
    icon: '🍃',
    label: { en: 'Tea Trail', bn: 'চা-বাগানের পথিক' },
    districts: ['sylhet', 'moulvibazar', 'habiganj'],
  },
  {
    id: 'mangrove',
    icon: '🐅',
    label: { en: 'Mangrove Explorer', bn: 'ম্যানগ্রোভ অভিযাত্রী' },
    districts: ['khulna', 'bagerhat', 'satkhira'],
  },
  {
    id: 'haor',
    icon: '🛶',
    label: { en: 'Haor Rider', bn: 'হাওরের মাঝি' },
    districts: ['sunamganj', 'kishoreganj', 'netrokona'],
  },
  {
    id: 'heritage',
    icon: '🏛️',
    label: { en: 'Heritage Hunter', bn: 'ঐতিহ্য সন্ধানী' },
    districts: ['bogura', 'naogaon', 'bagerhat', 'cumilla'],
  },
  {
    id: 'north',
    icon: '🏔️',
    label: { en: 'Northern Frontier', bn: 'উত্তরের সীমান্ত' },
    districts: ['panchagarh', 'thakurgaon', 'dinajpur'],
  },
];

/** Themed badges plus one "complete the division" badge per division. */
export function allBadges(index: DistrictIndex | null): Badge[] {
  if (!index) return THEMED;
  const divisions = index.divisions.map((dv) => ({
    id: `div-${dv.id}`,
    icon: '🏅',
    label: { en: `${dv.en} Division Complete`, bn: `${dv.bn} বিভাগ সম্পূর্ণ` },
    districts: index.districts.filter((d) => d.division === dv.id).map((d) => d.id),
  }));
  return [...THEMED, ...divisions];
}

export interface BadgeProgress {
  badge: Badge;
  done: number;
  missing: string[];
  earned: boolean;
}

export function badgeProgress(badges: Badge[], visited: ReadonlySet<string>): BadgeProgress[] {
  return badges.map((badge) => {
    const missing = badge.districts.filter((d) => !visited.has(d));
    return { badge, done: badge.districts.length - missing.length, missing, earned: missing.length === 0 };
  });
}
