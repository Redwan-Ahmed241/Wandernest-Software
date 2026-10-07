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
}

export type ListingKind = 'stay' | 'guide' | 'tour';

/**
 * A business collected from public internet sources. NOT verified by us:
 * the UI must always show the source, collection date and "contact to confirm" notice.
 */
export interface Listing {
  id: string;
  kind: ListingKind;
  district: string;
  name: string;
  area?: string;
  /** Our own one-line description (never copied from the source). */
  about?: Bilingual;
  /** Price exactly as the source advertised it, with its date in collectedOn. */
  priceNote?: string;
  contact: DirectContact & { facebook?: string; email?: string };
  sourceUrl: string;
  collectedOn: string;
  /** Paid placement. Always shown with a visible "Sponsored" label. */
  featured?: boolean;
}

export interface DistrictRepository {
  getIndex(): Promise<DistrictIndex>;
  /** Resolves null when no editorial content exists for the district yet. */
  getDetail(id: string): Promise<DistrictDetail | null>;
  getListings(): Promise<Listing[]>;
}
