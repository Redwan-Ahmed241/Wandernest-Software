import { useEffect, useMemo, useRef, useState } from 'react';
import type { DirectContact, DistrictDetail, DistrictIndex, DistrictSummary, Lang } from '../domain/types';
import { repository } from '../domain/repository';
import { MAX_NOTES, defaultPlan, type TripPlan } from '../domain/userState';
import { monthName, num, t } from '../i18n';

// Set before launch: shown as the error-report / takedown contact.
const REPORT_EMAIL = '';

interface Props {
  district: DistrictSummary;
  index: DistrictIndex;
  lang: Lang;
  plan: TripPlan | undefined;
  onUpdatePlan: (fn: (t: TripPlan) => TripPlan) => void;
  onSelectDistrict: (id: string) => void;
  onClose: () => void;
}

type Tab = 'overview' | 'places' | 'food' | 'stays' | 'trip';

const safeHttp = (u: string | undefined) => (u && /^https?:\/\//i.test(u) ? u : undefined);
const safeTel = (p: string | undefined) => (p && /^\+?[0-9 ()-]{6,20}$/.test(p) ? p.replace(/[^\d+]/g, '') : undefined);

export default function DistrictSheet({ district, index, lang, plan, onUpdatePlan, onSelectDistrict, onClose }: Props) {
  const [detail, setDetail] = useState<DistrictDetail | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>('overview');
  const [newItem, setNewItem] = useState('');
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let live = true;
    setDetail(undefined);
    setTab('overview');
    repository.getDetail(district.id).then((d) => live && setDetail(d));
    return () => {
      live = false;
    };
  }, [district.id]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const tabs = useMemo(() => {
    const out: Tab[] = ['overview'];
    if (detail?.attractions?.length) out.push('places');
    if (detail?.food?.length) out.push('food');
    if (detail?.stays?.length) out.push('stays');
    out.push('trip');
    return out;
  }, [detail]);

  const name = (d: { name_en: string; name_bn: string }) => (lang === 'bn' ? d.name_bn : d.name_en);
  const division = index.divisions.find((d) => d.id === district.division);
  const byId = useMemo(() => new Map(index.districts.map((d) => [d.id, d])), [index]);
  const trip: TripPlan = plan ?? defaultPlan();

  return (
    <div className="sheet-back" onClick={onClose}>
      <aside className="sheet" role="dialog" aria-modal="true" aria-label={name(district)} onClick={(e) => e.stopPropagation()}>
        <header>
          <div>
            <h2>{name(district)}</h2>
            <p className="muted">
              {division ? (lang === 'bn' ? division.bn : division.en) : ''} {lang === 'bn' ? 'বিভাগ' : 'Division'}
            </p>
          </div>
          <button ref={closeRef} type="button" className="x" onClick={onClose} aria-label={t(lang, 'close')}>
            ×
          </button>
        </header>

        <div className="tabs" role="tablist">
          {tabs.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={tab === k}
              className={tab === k ? 'on' : ''}
              onClick={() => setTab(k)}
            >
              {t(lang, k === 'trip' ? 'myTrip' : k)}
            </button>
          ))}
        </div>

        <div className="sheet-body">
          {detail === undefined && <p className="muted">…</p>}

          {tab === 'overview' && detail !== undefined && (
            <>
              {detail ? (
                <>
                  {detail.status === 'draft' && <span className="badge">{t(lang, 'draft')}</span>}
                  <p>{detail.summary[lang]}</p>
                  <h3>{t(lang, 'bestTime')}</h3>
                  <p>
                    {detail.bestSeason.months.map((m) => monthName(lang, m)).join(' · ')}
                    {lang === 'en' && detail.bestSeason.note_en ? ` — ${detail.bestSeason.note_en}` : ''}
                  </p>
                </>
              ) : (
                <p className="muted">{t(lang, 'noContent')}</p>
              )}
              {district.neighbors.length > 0 && (
                <>
                  <h3>{t(lang, 'neighbors')}</h3>
                  <div className="chips">
                    {district.neighbors.map((id) => {
                      const n = byId.get(id);
                      return n ? (
                        <button key={id} type="button" onClick={() => onSelectDistrict(id)}>
                          {name(n)}
                        </button>
                      ) : null;
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {tab === 'places' && detail && (
            <ul className="cards">
              {detail.attractions.map((a, i) => (
                <li key={i}>
                  <strong>{a.name[lang]}</strong>
                  <span className="tag">{a.category}</span>
                  {a.lastVerified && (
                    <small className="muted">
                      {t(lang, 'lastVerified')}: {a.lastVerified}
                    </small>
                  )}
                  {safeHttp(a.sourceUrl) && (
                    <a href={safeHttp(a.sourceUrl)} target="_blank" rel="noopener noreferrer">
                      {t(lang, 'source')}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}

          {tab === 'food' && detail && (
            <ul className="cards">
              {detail.food.map((f, i) => (
                <li key={i}>
                  <strong>{f.name[lang]}</strong>
                  {f.note && lang === 'en' && <span>{f.note}</span>}
                </li>
              ))}
            </ul>
          )}

          {tab === 'stays' && detail?.stays && (
            <ul className="cards">
              {detail.stays.map((s, i) => (
                <li key={i}>
                  <strong>
                    {s.name} <span className="tag">{s.priceBand}</span>
                  </strong>
                  {s.publicPackages?.map((p, j) => (
                    <span key={j}>{p}</span>
                  ))}
                  <Contact c={s.directContact} lang={lang} />
                  <small className="muted">
                    {t(lang, 'source')}: {s.source} · {t(lang, 'lastVerified')}: {s.lastVerified}
                  </small>
                </li>
              ))}
            </ul>
          )}

          {tab === 'trip' && (
            <div className="trip">
              <label>
                {t(lang, 'tripDate')}
                <input
                  type="date"
                  value={trip.date}
                  onChange={(e) => onUpdatePlan((p) => ({ ...p, date: e.target.value }))}
                />
              </label>
              <h3>{t(lang, 'checklist')}</h3>
              <ul className="checks">
                {trip.checklist.map((it) => (
                  <li key={it.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={it.done}
                        onChange={() =>
                          onUpdatePlan((p) => ({
                            ...p,
                            checklist: p.checklist.map((c) => (c.id === it.id ? { ...c, done: !c.done } : c)),
                          }))
                        }
                      />
                      <span>{it.label}</span>
                    </label>
                    <button
                      type="button"
                      className="x sm"
                      aria-label="remove"
                      onClick={() => onUpdatePlan((p) => ({ ...p, checklist: p.checklist.filter((c) => c.id !== it.id) }))}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <form
                className="add"
                onSubmit={(e) => {
                  e.preventDefault();
                  const label = newItem.trim();
                  if (!label) return;
                  onUpdatePlan((p) => ({
                    ...p,
                    checklist: [...p.checklist, { id: `u${Date.now().toString(36)}`, label, done: false }],
                  }));
                  setNewItem('');
                }}
              >
                <input value={newItem} maxLength={80} onChange={(e) => setNewItem(e.target.value)} placeholder={t(lang, 'addItem')} />
                <button type="submit" className="btn">
                  +
                </button>
              </form>
              <label>
                {t(lang, 'notes')}
                {/* Plain text only: never rendered as HTML. */}
                <textarea
                  rows={6}
                  maxLength={MAX_NOTES}
                  value={trip.notes}
                  onChange={(e) => onUpdatePlan((p) => ({ ...p, notes: e.target.value }))}
                />
                <small className="muted">
                  {num(lang, trip.notes.length)}/{num(lang, MAX_NOTES)}
                </small>
              </label>
            </div>
          )}
        </div>

        <footer className="disclaimer">
          <strong>{t(lang, 'disclaimerTitle')}</strong>
          <p>{t(lang, 'disclaimer')}</p>
          {REPORT_EMAIL ? (
            <a href={`mailto:${REPORT_EMAIL}?subject=WanderNest%20BD%20-%20${encodeURIComponent(district.name_en)}`}>
              {t(lang, 'report')}
            </a>
          ) : (
            import.meta.env.DEV && <em>[Set REPORT_EMAIL in DistrictSheet.tsx before launch]</em>
          )}
        </footer>
      </aside>
    </div>
  );
}

function Contact({ c, lang }: { c: DirectContact | undefined; lang: Lang }) {
  if (!c) return null;
  const tel = safeTel(c.phone);
  const wa = safeTel(c.whatsapp);
  const web = safeHttp(c.website);
  const map = safeHttp(c.mapUrl);
  return (
    <div className="contact">
      {tel && <a href={`tel:${tel}`}>{t(lang, 'call')}</a>}
      {wa && (
        <a href={`https://wa.me/${wa.replace('+', '')}`} target="_blank" rel="noopener noreferrer">
          {t(lang, 'whatsapp')}
        </a>
      )}
      {web && (
        <a href={web} target="_blank" rel="noopener noreferrer">
          {t(lang, 'website')}
        </a>
      )}
      {map && (
        <a href={map} target="_blank" rel="noopener noreferrer">
          {t(lang, 'map')}
        </a>
      )}
    </div>
  );
}
