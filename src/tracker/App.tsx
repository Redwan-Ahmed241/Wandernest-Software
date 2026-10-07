import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import mapData from './data/map.json';
import LivingFlagMap, { type MapDistrict } from './components/LivingFlagMap';
import { repository } from './domain/repository';
import { decodeMask, encodeMask } from './domain/share';
import { nextMilestone, rankFor } from './domain/ranks';
import { useTrackerState } from './domain/userState';
import type { DistrictIndex } from './domain/types';
import { num, t } from './i18n';

const DistrictSheet = lazy(() => import('./components/DistrictSheet'));
const ShareModal = lazy(() => import('./components/ShareModal'));

const DISTRICTS = mapData.districts as MapDistrict[];
const VIEWBOX = mapData.viewBox as [number, number];
// Bit position == position in the (alphabetically sorted) map data.
const ID_TO_BIT = new Map(DISTRICTS.map((d, i) => [d.id, i]));
const BIT_TO_ID = DISTRICTS.map((d) => d.id);

const norm = (s: string) => s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{M}\p{N}]/gu, '');

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
  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [query, setQuery] = useState('');
  const [justChanged, setJustChanged] = useState<string | null>(null);
  const popTimer = useRef<number | undefined>(undefined);

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
  const labels = useMemo(() => {
    const o: Record<string, string> = {};
    for (const d of index?.districts ?? []) o[d.id] = lang === 'bn' ? d.name_bn : d.name_en;
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
  });

  return (
    <div className="app">
      <header className="top">
        <span className="brand">WanderNest BD</span>
        <div className="lang" role="group" aria-label="Language">
          <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
            EN
          </button>
          <button type="button" className={lang === 'bn' ? 'on' : ''} onClick={() => setLang('bn')}>
            বাংলা
          </button>
        </div>
      </header>

      <section className="hero">
        <h1>{t(lang, 'title')}</h1>
        <p>{t(lang, 'sub')}</p>
      </section>

      {shared && (
        <div className="banner" role="status">
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

      <section className="score" aria-live="polite">
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

      <div className="search">
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
                  <small>{lang === 'bn' ? d.name_en : d.name_bn}</small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <LivingFlagMap
        districts={DISTRICTS}
        viewBox={VIEWBOX}
        visited={visitedIds}
        want={wantIds}
        selected={selected}
        justChanged={justChanged}
        labels={labels}
        lang={lang}
        onSelect={setSelected}
      />

      <button type="button" className="btn red wide" onClick={() => setShareOpen(true)}>
        {t(lang, 'share')}
      </button>

      {divisionStats.length > 0 && (
        <section className="divs">
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

      <footer className="foot">
        <p>{t(lang, 'footer')}</p>
      </footer>

      {selected && (
        <div className="actionbar" role="region" aria-label={selName}>
          <div className="who">
            <strong>{selName}</strong>
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
            <button type="button" className="x" onClick={() => setSelected(null)} aria-label={t(lang, 'close')}>
              ×
            </button>
          </div>
        </div>
      )}

      <Suspense fallback={null}>
        {sheetOpen && sel && index && (
          <DistrictSheet
            district={sel}
            index={index}
            lang={lang}
            plan={state.trips[sel.id]}
            onUpdatePlan={(fn) => updateTrip(sel.id, fn)}
            onSelectDistrict={(id) => setSelected(id)}
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
