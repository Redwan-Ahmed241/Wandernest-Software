import type { Listing } from './types';

export const safeHttp = (u: string | undefined) => (u && /^https:\/\//i.test(u) ? u : undefined);
export const safeTel = (p: string | undefined) =>
  p && /^\+?[0-9 ()-]{6,20}$/.test(p) ? p.replace(/[^\d+]/g, '') : undefined;

/** Paid placements first (always labelled), then alphabetical. */
export function sortListings(a: Listing, b: Listing) {
  return Number(!!b.featured) - Number(!!a.featured) || a.name.localeCompare(b.name);
}
