import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import mapData from './data/map.json';
import LivingFlagMap, { type DistrictInfo, type MapDistrict } from './components/LivingFlagMap';
import { repository } from './domain/repository';
import { decodeMask, encodeMask } from './domain/share';
import { parseGroupParam } from './domain/group';
import { allBadges, badgeProgress } from './domain/badges';
import { nextMilestone, rankFor } from './domain/ranks';
import { useTrackerState } from './domain/userState';
import type { DistrictIndex } from './domain/types';
import { num, t } from './i18n';

const DistrictSheet = lazy(() => import('./components/DistrictSheet'));
const ShareModal = lazy(() => import('./components/ShareModal'));
const DirectoryView = lazy(() => import('./components/DirectoryView'));
const GroupView = lazy(() => import('./components/GroupView'));
const BusinessView = lazy(() => import('./components/BusinessView'));

type View = 'map' | 'directory' | 'group' | 'business';
const VIEWS: View[] = ['map', 'directory', 'group', 'business'];
const NAV_KEY = { map: 'navMap', directory: 'navDirectory', group: 'navGroup', business: 'navBusiness' } as const;
const readView = (): View => {
  const h = window.location.hash.replace('#', '') as View;
  return VIEWS.includes(h) ? h : 'map';
};

function readGroup() {
  try {
    return new URLSearchParams(window.location.search).get('g');
  } catch {
    return null;
  }
}

const DISTRICTS = mapData.districts as MapDistrict[];
const VIEWBOX = mapData.viewBox as [number, number];
// Bit position == position in the (alphabetically sorted) map data.
const ID_TO_BIT = new Map(DISTRICTS.map((d, i) => [d.id, i]));
const BIT_TO_ID = DISTRICTS.map((d) => d.id);

const norm = (s: string) => s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{M}\p{N}]/gu, '');

function readPreselect(): string | null {
  try {
    const d = new URLSearchParams(window.location.search).get('d');
    return d && ID_TO_BIT.has(d) ? d : null;
  } catch {
    return null;
  }
}

function readShared(): { visited: Set<number>; want: Set<number> } | null {
  try {
    const q = new URLSearchParams(window.location.search);
    const v = decodeMask(q.get('v'));
    if (!v) return null;
    return { visited: v, want: decodeMask(q.get('w')) ?? new Set() };
  } catch {
    return null;
  }
}

export default function App() {
  const { state, setLang, setStatus, replaceAll, updateTrip } = useTrackerState();
  const lang = state.lang;
  const [index, setIndex] = useState<DistrictIndex | null>(null);
  const [shared, setShared] = useState(readShared);
  const [selected, setSelected] = useState<string | null>(readPreselect);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [query, setQuery] = useState('');
  const [justChanged, setJustChanged] = useState<string | null>(null);
  const popTimer = useRef<number | undefined>(undefined);
  const [view, setViewState] = useState<View>(readView);
  const [dirDistrict, setDirDistrict] = useState('');
  const [groupInitial] = useState(() => parseGroupParam(readGroup()));

  useEffect(() => {
    const on = () => setViewState(readView());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = useCallback((v: View) => {
    window.location.hash = v === 'map' ? '' : v;
    setViewState(v);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    repository.getIndex().then(setIndex).catch(() => undefined);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
  }, [lang]);

  const visitedBits = useMemo(() => (shared ? shared.visited : new Set(state.visited)), [shared, state.visited]);
  const wantBits = useMemo(() => (shared ? shared.want : new Set(state.want)), [shared, state.want]);
  const visitedIds = useMemo(() => new Set([...visitedBits].map((b) => BIT_TO_ID[b]).filter(Boolean)), [visitedBits]);
  const wantIds = useMemo(() => new Set([...wantBits].map((b) => BIT_TO_ID[b]).filter(Boolean)), [wantBits]);

  const byId = useMemo(() => new Map((index?.districts ?? []).map((d) => [d.id, d])), [index]);
  const info = useMemo(() => {
    const o: Record<string, DistrictInfo> = {};
    const divs = new Map((index?.divisions ?? []).map((d) => [d.id, d]));
    for (const d of index?.districts ?? []) {
      const dv = divs.get(d.division);
      o[d.id] = {
        name: lang === 'bn' ? d.name_bn : d.name_en,
        both: `${d.name_en} | ${d.name_bn}`,
        division: dv ? `${lang === 'bn' ? dv.bn : dv.en} ${t(lang, 'division')}` : '',
      };
    }
    return o;
  }, [index, lang]);

  const count = visitedIds.size;
  const percent = Math.round((count / 64) * 100);
  const rank = rankFor(count);
  const next = nextMilestone(count);

  const divisionStats = useMemo(() => {
    if (!index) return [];
    return index.divisions.map((dv) => {
      const all = index.districts.filter((d) => d.division === dv.id);
      return { dv, total: all.length, done: all.filter((d) => visitedIds.has(d.id)).length };
    });
  }, [index, visitedIds]);

  const [listingCount, setListingCount] = useState<Map<string, number>>(new Map());
  useEffect(() => {
    repository.getListings().then((all) => {
      const m = new Map<string, number>();
      for (const l of all) m.set(l.district, (m.get(l.district) ?? 0) + 1);
      setListingCount(m);
    });
  }, []);

  const badges = useMemo(() => badgeProgress(allBadges(index), visitedIds), [index, visitedIds]);
  const earned = useMemo(() => badges.filter((b) => b.earned), [badges]);
  // Celebrate a badge only when the user's own action earns it (not on load or on a shared map).
  const [toast, setToast] = useState<string | null>(null);
  const earnedBefore = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!index) return;
    const now = new Set(earned.map((b) => b.badge.id));
    const prev = earnedBefore.current;
    earnedBefore.current = now;
    if (!prev || shared) return;
    const fresh = earned.find((b) => !prev.has(b.badge.id));
    if (!fresh) return;
    setToast(`${fresh.badge.icon} ${t(lang, 'badgeNew')}: ${fresh.badge.label[lang]}`);
    const id = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [earned, index]);

  const flash = useCallback((id: string) => {
    setJustChanged(id);
    window.clearTimeout(popTimer.current);
    popTimer.current = window.setTimeout(() => setJustChanged(null), 700);
  }, []);

  const mark = (status: 'visited' | 'want' | 'none') => {
    if (!selected || shared) return;
    const bit = ID_TO_BIT.get(selected);
    if (bit === undefined) return;
    setStatus(bit, status);
    flash(selected);
  };

  const selStatus = selected ? (visitedIds.has(selected) ? 'visited' : wantIds.has(selected) ? 'want' : 'none') : 'none';
  const sel = selected ? byId.get(selected) : undefined;
  const selName = sel ? (lang === 'bn' ? sel.name_bn : sel.name_en) : selected ?? '';

  const results = useMemo(() => {
    const q = norm(query);
    if (!q || !index) return [];
    return index.districts
      .filter((d) => [d.name_en, d.name_bn, ...d.aliases].some((n) => norm(n).includes(q)))
      .slice(0, 8);
  }, [query, index]);

  const exitShared = () => {
    setShared(null);
    setConfirmSave(false);
    window.history.replaceState(null, '', window.location.pathname);
  };
  const saveShared = () => {
    if (!shared) return;
    if (state.visited.length + state.want.length > 0 && !confirmSave) {
      setConfirmSave(true);
      return;
    }
    replaceAll(shared.visited, shared.want);
    exitShared();
  };

  const shareLink = useMemo(() => {
    const base = `${window.location.origin}${window.location.pathname}`;
    let l = `${base}?v=${encodeMask(state.visited)}`;
    if (state.want.length) l += `&w=${encodeMask(state.want)}`;
    return l;
  }, [state.visited, state.want]);

  const cardInput = () => ({
    lang,
    districts: DISTRICTS,
    viewBox: VIEWBOX,
    visited: visitedIds,
    want: wantIds,
    count,
    percent,
    rankLabel: rank[lang],
    heading: t(lang, 'title'),
    unit: t(lang, 'explored'),
    site: /^(localhost|127\.)/.test(window.location.hostname) ? '' : window.location.host,
    badges: earned.map((b) => b.badge.icon),
    badgesLabel: t(lang, 'badgesTitle'),
  });

  return (
    <div className="app">
      <header className="top">
        <a className="brand" href="/">
          WanderNest <b>BD</b>
        </a>
        <nav className="views" aria-label="Sections">
          {VIEWS.map((v) => (
            <button key={v} type="button" className={view === v ? 'on' : ''} aria-current={view === v ? 'page' : undefined} onClick={() => go(v)}>
              {t(lang, NAV_KEY[v])}
            </button>
          ))}
        </nav>
        <div className="lang" role="group" aria-label="Language">
          <button type="button" className={lang === 'en' ? 'on' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
            EN
          </button>
          <button type="button" className={lang === 'bn' ? 'on' : ''} aria-pressed={lang === 'bn'} onClick={() => setLang('bn')}>
            বাংলা
          </button>
        </div>
      </header>

      {view === 'map' && (
      <div className="layout">
        <section className="hero a-hero">
          <h1>{t(lang, 'title')}</h1>
          <p>{t(lang, 'sub')}</p>
        </section>

        {shared && (
          <div className="banner a-banner" role="status">
            <span>{t(lang, 'sharedBanner')}</span>
            <div className="row">
              <button type="button" className="btn red" onClick={saveShared}>
                {confirmSave ? t(lang, 'replaceWarn') : t(lang, 'saveShared')}
              </button>
              <button type="button" className="btn" onClick={exitShared}>
                {t(lang, 'backMine')}
              </button>
            </div>
          </div>
        )}

        {selected && (
          <div className="actionbar a-sel" role="region" aria-label={selName}>
            <div className="who">
              <div>
                <strong>{info[selected]?.both ?? selName}</strong>
                <small>{info[selected]?.division}</small>
              </div>
              <button type="button" className="x" onClick={() => setSelected(null)} aria-label={t(lang, 'close')}>
                ×
              </button>
            </div>
            <div className="acts">
              {!shared && (
                <>
                  <button
                    type="button"
                    className={`btn ${selStatus === 'visited' ? 'red on' : ''}`}
                    aria-pressed={selStatus === 'visited'}
                    onClick={() => mark(selStatus === 'visited' ? 'none' : 'visited')}
                  >
                    ✓ {t(lang, 'visited')}
                  </button>
                  <button
                    type="button"
                    className={`btn ${selStatus === 'want' ? 'mint on' : ''}`}
                    aria-pressed={selStatus === 'want'}
                    onClick={() => mark(selStatus === 'want' ? 'none' : 'want')}
                  >
                    ☆ {t(lang, 'want')}
                  </button>
                </>
              )}
              <button type="button" className="btn" onClick={() => setSheetOpen(true)} disabled={!sel}>
                {t(lang, 'details')}
              </button>
            </div>
            {!shared && selStatus === 'want' && (listingCount.get(selected) ?? 0) > 0 && (
              <button
                type="button"
                className="nudge"
                onClick={() => {
                  setDirDistrict(selected);
                  go('directory');
                }}
              >
                {t(lang, 'wantNudge')
                  .replace('{d}', info[selected]?.name ?? '')
                  .replace('{n}', num(lang, listingCount.get(selected) ?? 0))}{' '}
                →
              </button>
            )}
          </div>
        )}

        <section className="score a-score" aria-live="polite">
          <div className="big">
            {num(lang, count)}
            <span>/{num(lang, 64)}</span>
          </div>
          <div className="meta">
            <strong>
              {num(lang, percent)}% {t(lang, 'explored')}
            </strong>
            <span className="rank">{rank[lang]}</span>
            {next && (
              <small>
                {t(lang, 'next')}: {num(lang, next)} {t(lang, 'districts')}
              </small>
            )}
          </div>
          <div className="progress" aria-hidden="true">
            <i style={{ width: `${percent}%` }} />
          </div>
        </section>

        <div className="search a-search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(lang, 'search')}
            aria-label={t(lang, 'search')}
            autoComplete="off"
            maxLength={40}
          />
          {results.length > 0 && (
            <ul className="results">
              {results.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(d.id);
                      setQuery('');
                    }}
                  >
                    {lang === 'bn' ? d.name_bn : d.name_en}
                    <small>{info[d.id]?.division}</small>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="a-map">
          <LivingFlagMap
            districts={DISTRICTS}
            viewBox={VIEWBOX}
            visited={visitedIds}
            want={wantIds}
            selected={selected}
            justChanged={justChanged}
            info={info}
            lang={lang}
            onSelect={setSelected}
          />
        </div>

        <button type="button" className="btn red wide a-share" onClick={() => setShareOpen(true)}>
          {t(lang, 'share')}
        </button>

        <section className="badges a-badges">
          <h2>
            {t(lang, 'badgesTitle')}{' '}
            <small className="muted">
              {num(lang, earned.length)}/{num(lang, badges.length)}
            </small>
          </h2>
          <ul>
            {[...badges]
              .sort(
                (a, b) =>
                  Number(b.earned) - Number(a.earned) ||
                  b.done / b.badge.districts.length - a.done / a.badge.districts.length,
              )
              .map(({ badge, done, missing, earned: ok }) => (
                <li key={badge.id} className={ok ? 'got' : ''}>
                  <span className="ico" aria-hidden="true">
                    {badge.icon}
                  </span>
                  <span className="txt">
                    <strong>{badge.label[lang]}</strong>
                    <small className="muted">
                      {ok
                        ? t(lang, 'badgeEarned')
                        : `${num(lang, done)}/${num(lang, badge.districts.length)} · ${t(lang, 'badgeNeed')}: ${missing
                            .slice(0, 3)
                            .map((id) => info[id]?.name ?? id)
                            .join(', ')}${missing.length > 3 ? '…' : ''}`}
                    </small>
                  </span>
                </li>
              ))}
          </ul>
        </section>

        {divisionStats.length > 0 && (
          <section className="divs a-divs">
            <h2>{t(lang, 'divisions')}</h2>
            <ul>
              {divisionStats.map(({ dv, total, done }) => (
                <li key={dv.id}>
                  <span>{lang === 'bn' ? dv.bn : dv.en}</span>
                  <span className="track">
                    <i style={{ width: `${(done / total) * 100}%` }} />
                  </span>
                  <span className="n">
                    {num(lang, done)}/{num(lang, total)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="foot a-foot">
          <p>{t(lang, 'footer')}</p>
        </footer>
      </div>
      )}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}

      <Suspense fallback={<p className="muted">…</p>}>
        {view === 'directory' && (
          <DirectoryView lang={lang} index={index} district={dirDistrict} onDistrict={setDirDistrict} />
        )}
        {view === 'group' && (
          <GroupView
            lang={lang}
            index={index}
            myVisited={state.visited}
            districts={DISTRICTS}
            viewBox={VIEWBOX}
            info={info}
            initial={groupInitial}
          />
        )}
        {view === 'business' && <BusinessView lang={lang} />}
      </Suspense>

      <Suspense fallback={null}>
        {sheetOpen && sel && index && (
          <DistrictSheet
            district={sel}
            index={index}
            lang={lang}
            plan={state.trips[sel.id]}
            onUpdatePlan={(fn) => updateTrip(sel.id, fn)}
            onSelectDistrict={(id) => setSelected(id)}
            onOpenDirectory={(id) => {
              setSheetOpen(false);
              setDirDistrict(id);
              go('directory');
            }}
            onClose={() => setSheetOpen(false)}
          />
        )}
        {shareOpen && (
          <ShareModal
            lang={lang}
            link={shared ? window.location.href : shareLink}
            card={cardInput()}
            onClose={() => setShareOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
}
