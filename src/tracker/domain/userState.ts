import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang } from './types';

const KEY = 'wn.tracker.v1';
const ID_RE = /^[a-z0-9-]{1,40}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const MAX_NOTES = 4000;
const MAX_LABEL = 80;
const MAX_ITEMS = 30;

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}
export interface TripPlan {
  date: string;
  notes: string;
  checklist: ChecklistItem[];
}
export interface TrackerState {
  v: 1;
  lang: Lang;
  visited: number[];
  want: number[];
  trips: Record<string, TripPlan>;
}

export const DEFAULT_CHECKLIST = ['Hotel booked', 'Transport booked', 'Camera', 'Power bank'];

export const defaultPlan = (): TripPlan => ({
  date: '',
  notes: '',
  checklist: DEFAULT_CHECKLIST.map((label, i) => ({ id: `d${i}`, label, done: false })),
});

const empty = (): TrackerState => ({ v: 1, lang: 'en', visited: [], want: [], trips: {} });

const isBit = (n: unknown): n is number => Number.isInteger(n) && (n as number) >= 0 && (n as number) < 64;
const uniqBits = (a: unknown): number[] =>
  Array.isArray(a) ? [...new Set(a.filter(isBit))].sort((x, y) => x - y) : [];

/** Treats everything from storage (or an import) as untrusted. */
export function sanitize(raw: unknown): TrackerState {
  const out = empty();
  if (!raw || typeof raw !== 'object') return out;
  const r = raw as Record<string, unknown>;
  if (r.lang === 'bn') out.lang = 'bn';
  out.visited = uniqBits(r.visited);
  const v = new Set(out.visited);
  out.want = uniqBits(r.want).filter((b) => !v.has(b));
  if (r.trips && typeof r.trips === 'object') {
    for (const [id, t] of Object.entries(r.trips as Record<string, unknown>).slice(0, 64)) {
      if (!ID_RE.test(id) || !t || typeof t !== 'object') continue;
      const tt = t as Record<string, unknown>;
      const checklist: ChecklistItem[] = [];
      if (Array.isArray(tt.checklist)) {
        for (const it of tt.checklist.slice(0, MAX_ITEMS)) {
          if (!it || typeof it !== 'object') continue;
          const o = it as Record<string, unknown>;
          if (typeof o.label !== 'string' || !o.label.trim()) continue;
          checklist.push({
            id: typeof o.id === 'string' && ID_RE.test(o.id) ? o.id : `i${checklist.length}`,
            label: o.label.slice(0, MAX_LABEL),
            done: o.done === true,
          });
        }
      }
      out.trips[id] = {
        date: typeof tt.date === 'string' && DATE_RE.test(tt.date) ? tt.date : '',
        notes: typeof tt.notes === 'string' ? tt.notes.slice(0, MAX_NOTES) : '',
        checklist,
      };
    }
  }
  return out;
}

function load(): TrackerState {
  try {
    const s = localStorage.getItem(KEY);
    return s ? sanitize(JSON.parse(s)) : empty();
  } catch {
    return empty();
  }
}

export function useTrackerState() {
  const [state, setState] = useState<TrackerState>(load);
  const timer = useRef<number | undefined>(undefined);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch {
        /* storage full or blocked (private mode): keep working in memory */
      }
    }, 250);
    return () => window.clearTimeout(timer.current);
  }, [state]);

  const setLang = useCallback((lang: Lang) => setState((s) => ({ ...s, lang })), []);

  const setStatus = useCallback((bit: number, status: 'visited' | 'want' | 'none') => {
    if (!isBit(bit)) return;
    setState((s) => {
      const visited = new Set(s.visited);
      const want = new Set(s.want);
      visited.delete(bit);
      want.delete(bit);
      if (status === 'visited') visited.add(bit);
      if (status === 'want') want.add(bit);
      return { ...s, visited: [...visited].sort((a, b) => a - b), want: [...want].sort((a, b) => a - b) };
    });
  }, []);

  const replaceAll = useCallback((visited: Iterable<number>, want: Iterable<number>) => {
    setState((s) => {
      const v = uniqBits([...visited]);
      const vs = new Set(v);
      return { ...s, visited: v, want: uniqBits([...want]).filter((b) => !vs.has(b)) };
    });
  }, []);

  const updateTrip = useCallback((id: string, fn: (t: TripPlan) => TripPlan) => {
    if (!ID_RE.test(id)) return;
    setState((s) => {
      const cur = s.trips[id] ?? defaultPlan();
      const next = sanitize({ ...s, trips: { ...s.trips, [id]: fn(cur) } });
      return { ...s, trips: next.trips };
    });
  }, []);

  return { state, setLang, setStatus, replaceAll, updateTrip };
}
