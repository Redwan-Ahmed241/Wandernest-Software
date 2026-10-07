export type Lang = 'en' | 'bn';

export interface Bilingual {
  en: string;
  bn: string;
}

export interface Division {
  id: string;
  en: string;
  bn: string;
}

export interface DistrictSummary {
  id: string;
  /** Fixed position in the share bitmask. Never reorder or reuse. */
  bit: number;
  name_en: string;
  name_bn: string;
  aliases: string[];
  division: string;
  centroid: [number, number];
  neighbors: string[];
}

export interface DistrictIndex {
  schema: number;
  attribution: string;
  divisions: Division[];
  districts: DistrictSummary[];
}

export type AttractionCategory = 'nature' | 'heritage' | 'landmark';

export interface DirectContact {
  phone?: string;
  whatsapp?: string;
  website?: string;
  mapUrl?: string;
}

export interface DistrictDetail extends DistrictSummary {
  /** 'draft' = written from general knowledge, not yet checked by a human. */
  status: 'draft' | 'verified';
  summary: Bilingual;
  bestSeason: { months: number[]; note_en: string };
  attractions: Array<{
    name: Bilingual;
    category: AttractionCategory;
    sourceUrl?: string;
    lastVerified?: string;
  }>;
  food: Array<{ name: Bilingual; note?: string }>;
  stays?: Array<{
    name: string;
    priceBand: '৳' | '৳৳' | '৳৳৳';
    directContact?: DirectContact;
    publicPackages?: string[];
    source: string;
    lastVerified: string;
  }>;
}

export interface DistrictRepository {
  getIndex(): Promise<DistrictIndex>;
  /** Resolves null when no editorial content exists for the district yet. */
  getDetail(id: string): Promise<DistrictDetail | null>;
}
