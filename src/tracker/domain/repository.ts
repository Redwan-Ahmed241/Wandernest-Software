import type { DistrictDetail, DistrictIndex, DistrictRepository, Listing } from './types';

const ID_RE = /^[a-z0-9-]{1,40}$/;

/**
 * Static JSON implementation. A future FastAPI implementation only needs to
 * satisfy the same DistrictRepository interface; the UI never changes.
 */
export class StaticDistrictRepository implements DistrictRepository {
  private indexPromise: Promise<DistrictIndex> | null = null;
  private details = new Map<string, Promise<DistrictDetail | null>>();
  private listings: Promise<Listing[]> | null = null;

  private base: string;

  constructor(base = '/tracker-data') {
    this.base = base;
  }

  getIndex(): Promise<DistrictIndex> {
    this.indexPromise ??= fetch(`${this.base}/districts-index.json`).then((r) => {
      if (!r.ok) throw new Error(`index ${r.status}`);
      return r.json() as Promise<DistrictIndex>;
    });
    return this.indexPromise;
  }

  getDetail(id: string): Promise<DistrictDetail | null> {
    if (!ID_RE.test(id)) return Promise.resolve(null);
    let p = this.details.get(id);
    if (!p) {
      p = fetch(`${this.base}/districts/${id}.json`).then((r) => {
        if (!r.ok) return null;
        // Netlify's SPA fallback may answer 200 with HTML for missing files.
        if (!(r.headers.get('content-type') ?? '').includes('json')) return null;
        return r.json() as Promise<DistrictDetail>;
      }).catch(() => null);
      this.details.set(id, p);
    }
    return p;
  }

  getListings(): Promise<Listing[]> {
    this.listings ??= fetch(`${this.base}/listings.json`)
      .then((r) => (r.ok && (r.headers.get('content-type') ?? '').includes('json') ? r.json() : []))
      .then((d) => (Array.isArray(d) ? (d as Listing[]) : []))
      .catch(() => []);
    return this.listings;
  }
}

export const repository: DistrictRepository = new StaticDistrictRepository();
